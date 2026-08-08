/**
 * Pist görseli yükleme aracı.
 *
 * Kullanıcı kararı (8 Ağustos 2026): pist çizimlerini üretmeye çalışma,
 * görselleri kullanıcı kendi yükleyecek. Bu araç o işi tekrarlanabilir
 * kılıyor — her yeni pist için aynı komut.
 *
 * Ne yapıyor:
 *   1. Verilen dosyayı `UPLOAD_DIR/f1/circuits/<slug>.<uzantı>` altına kopyalar
 *      (CSP dış adrese izin vermiyor, görsel kendi sunucumuzda durmalı).
 *   2. `SportImage` kaydını `slot = TRACK` ile açar/günceller.
 *
 * Pist sayfası TRACK yuvasındaki görseli SVG çizimine TERCİH EDİYOR, yani
 * kayıt oluşur oluşmaz görsel yerine geçiyor — kod değişmiyor.
 *
 * Çalıştırma:
 *   DATABASE_URL=$(cat /k/postgres/LOCAL_DB_URL.txt) UPLOAD_DIR=./uploads \
 *     npx ts-node --transpile-only -O '{"module":"NodeNext","moduleResolution":"NodeNext"}' \
 *     prisma/add-track-image.ts monza "C:/yol/monza.png" "Monza pist haritası"
 */
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

async function main() {
  const [slug, kaynak, altText, kaynakNotu] = process.argv.slice(2);

  if (!slug || !kaynak) {
    throw new Error(
      [
        'Kullanım: add-track-image.ts <pist-slug> <dosya-yolu|adres> [alt-metin] [kaynak-notu]',
        'Örnek 1 : add-track-image.ts monza "C:/Users/user/Downloads/monza.png" "Monza pist haritası"',
        'Örnek 2 : add-track-image.ts monza "https://ornek.com/monza.jpg" "Monza pist haritası" "kaynak: ornek.com"',
      ].join('\n'),
    );
  }

  /**
   * Kaynak iki türlü olabilir (kullanıcı isteği, 8 Ağustos 2026):
   *   · yerel dosya yolu
   *   · http(s) adresi — görsel indirilip KENDİ sunucumuza yazılır
   *
   * Adres neden saklanmıyor da indiriliyor: CSP yabancı sunucuya izin
   * vermiyor, ve dış adres bir gün ölüyor (`CharacterImage.url` yorumunda
   * aynı gerekçe yazılı). Arşivin dış bir siteye bağımlı olmaması gerekiyor.
   */
  const uzaktan = /^https?:\/\//i.test(kaynak);
  let mutlak = '';
  let indirilen: Buffer | null = null;
  let uzantiIpucu = '';

  if (uzaktan) {
    const yanit = await fetch(kaynak, {
      headers: { 'User-Agent': 'KuroNexus/1.0 (kisisel kultur arsivi)' },
    });
    if (!yanit.ok) {
      throw new Error(`İndirilemedi: HTTP ${yanit.status} — ${kaynak}`);
    }
    const tur = yanit.headers.get('content-type') || '';
    if (!tur.startsWith('image/')) {
      throw new Error(`Görsel değil (content-type: ${tur || 'yok'}) — ${kaynak}`);
    }
    indirilen = Buffer.from(await yanit.arrayBuffer());
    uzantiIpucu =
      { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/avif': '.avif' }[
        tur.split(';')[0].trim()
      ] || '.jpg';
    console.log(
      `indirildi: ${(indirilen.length / 1024).toFixed(1)} KB · ${tur.split(';')[0]} · ${new URL(kaynak).host}`,
    );
  } else {
    mutlak = resolve(kaynak);
    if (!existsSync(mutlak)) {
      throw new Error(`Dosya bulunamadı: ${mutlak}`);
    }
  }

  const circuit = await prisma.f1Circuit.findFirst({
    where: { slug, isDeleted: false },
    select: { id: true, name: true },
  });
  if (!circuit) {
    throw new Error(
      `Pist bulunamadı: "${slug}". Önce arşiv kaydı açılmalı — ` +
        'görsel tek başına sayfa açmaz (boş oda yasağı).',
    );
  }

  const uzanti = uzaktan
    ? uzantiIpucu
    : (extname(mutlak) || '.png').toLowerCase();
  const rel = `/uploads/f1/circuits/${slug}${uzanti}`;
  const hedef = join(UPLOAD_DIR, rel.replace(/^\/uploads\//, ''));
  await mkdir(dirname(hedef), { recursive: true });
  if (indirilen) {
    await writeFile(hedef, indirilen);
  } else {
    await copyFile(mutlak, hedef);
  }

  // Aynı pistin TRACK yuvası tekil: varsa güncelle, yoksa aç
  const mevcut = await prisma.sportImage.findFirst({
    where: { circuitId: circuit.id, slot: 'TRACK', isDeleted: false },
    select: { id: true },
  });

  const veri = {
    url: rel,
    altTr: altText || `${circuit.name} pist haritası`,
    altEn: altText || `${circuit.name} circuit map`,
    sourceNote: kaynakNotu || null,
    orderIndex: 0,
  };

  if (mevcut) {
    await prisma.sportImage.update({ where: { id: mevcut.id }, data: veri });
    console.log('TRACK görseli GÜNCELLENDİ');
  } else {
    await prisma.sportImage.create({
      data: { ...veri, slot: 'TRACK', circuitId: circuit.id },
    });
    console.log('TRACK görseli EKLENDİ');
  }

  console.log(`  pist  : ${circuit.name}`);
  console.log(`  dosya : ${hedef}`);
  console.log(`  adres : ${rel}`);
  console.log('\nSayfa bu görseli SVG çizimine tercih eder — yenilemen yeterli.');
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
