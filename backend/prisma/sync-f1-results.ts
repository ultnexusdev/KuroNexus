/**
 * Salon 06 · F1 podyum senkronizasyonu.
 *
 * Brief §6: dış API render'da çağrılmaz — bu iş günde bir çalışır, veriyi
 * kendi veritabanımıza yazar, sayfalar yalnızca oradan okur. Sağlayıcı
 * çökerse bu betik hata verir ama SİTE ETKİLENMEZ: son senkronize satırlar
 * yerinde durur.
 *
 * Yeniden çalıştırılabilir: her şey `upsert`. `F1RaceResult` için anahtar
 * (pist, sezon, basamak) üçlüsü — ikinci çalıştırma kopya üretmiyor.
 *
 * Çalıştırma:
 *   DATABASE_URL=$(cat /k/postgres/LOCAL_DB_URL.txt) \
 *     npx ts-node --transpile-only -O '{"module":"NodeNext","moduleResolution":"NodeNext"}' \
 *     prisma/sync-f1-results.ts monza
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import {
  CommonsPortraitResolver,
  JolpicaProvider,
  type F1ResultsProvider,
} from '../src/f1-sync/providers';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// İş mantığı ARAYÜZÜ tanıyor, sınıfı değil — sağlayıcı burada seçiliyor.
const provider: F1ResultsProvider = new JolpicaProvider();
const portraits = new CommonsPortraitResolver();

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

/** Ada göre dosya adı — "max_verstappen" zaten güvenli, yine de temizle. */
const guvenliAd = (s: string) => s.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();

async function portreIndir(externalId: string, url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'KuroNexus/1.0 (kisisel kultur arsivi)' },
    });
    if (!response.ok) return null;
    const uzanti = url.toLowerCase().includes('.png') ? 'png' : 'jpg';
    const rel = `/uploads/f1/drivers/${guvenliAd(externalId)}.${uzanti}`;
    const abs = join(UPLOAD_DIR, rel.replace(/^\/uploads\//, ''));
    await mkdir(dirname(abs), { recursive: true });
    await writeFile(abs, Buffer.from(await response.arrayBuffer()));
    return rel;
  } catch {
    return null;
  }
}

async function main() {
  const circuitSlug = process.argv[2] || 'monza';

  const circuit = await prisma.f1Circuit.findFirst({
    where: { slug: circuitSlug, isDeleted: false },
    select: { id: true, name: true },
  });
  if (!circuit) {
    throw new Error(
      `Pist bulunamadı: "${circuitSlug}". Önce arşiv kaydı açılmalı — ` +
        'senkronizasyon YAZILMIŞ pistleri zenginleştirir, yenisini yaratmaz. ' +
        '(Boş oda yasağı: veri tek başına sayfa açmaz.)',
    );
  }

  console.log(`${circuit.name} · sağlayıcı: ${provider.name}`);
  const podiums = await provider.getCircuitPodiums(circuitSlug);
  console.log(`  ${podiums.length} podyum satırı geldi`);

  // ---- Sürücü künyeleri ----
  const benzersiz = new Map<string, (typeof podiums)[number]>();
  for (const p of podiums) {
    if (p.driverExternalId && !benzersiz.has(p.driverExternalId)) {
      benzersiz.set(p.driverExternalId, p);
    }
  }

  const driverIdByExternal = new Map<string, string>();
  let yeniPortre = 0;

  for (const [externalId, ornek] of benzersiz) {
    const mevcut = await prisma.f1Driver.findUnique({
      where: { externalId },
      select: { id: true, photo: true },
    });

    const driver = mevcut
      ? mevcut
      : await prisma.f1Driver.create({
          data: {
            slug: guvenliAd(externalId),
            name: ornek.driverName,
            countryCode: null,
            externalId,
            // Künye kaydı: kendi sayfası yok, yayınlanmıyor (boş oda yasağı)
            isPublished: false,
          },
          select: { id: true, photo: true },
        });

    driverIdByExternal.set(externalId, driver.id);

    // Portre yalnızca YOKSA çekilir — her koşuda Commons'ı yormayalım
    if (!driver.photo) {
      const portre = await portraits.resolve(ornek.driverWikiUrl);
      if (portre) {
        const yerel = await portreIndir(externalId, portre.imageUrl);
        if (yerel) {
          await prisma.f1Driver.update({
            where: { id: driver.id },
            data: {
              photo: yerel,
              portraitSourceUrl: portre.sourceUrl,
              portraitLicense: portre.license,
              portraitAuthor: portre.author,
            },
          });
          yeniPortre++;
        }
      }
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  // ---- Podyum satırları ----
  const simdi = new Date();
  let yazilan = 0;
  for (const p of podiums) {
    await prisma.f1RaceResult.upsert({
      where: {
        circuitId_seasonYear_position: {
          circuitId: circuit.id,
          seasonYear: p.seasonYear,
          position: p.position,
        },
      },
      update: {
        driverName: p.driverName,
        driverNationality: p.driverNationality,
        constructorName: p.constructorName,
        timeText: p.timeText,
        raceName: p.raceName,
        raceDate: p.raceDate ? new Date(p.raceDate) : null,
        round: p.round,
        driverId: p.driverExternalId
          ? (driverIdByExternal.get(p.driverExternalId) ?? null)
          : null,
        externalSource: provider.name,
        externalFetchedAt: simdi,
      },
      create: {
        circuitId: circuit.id,
        seasonYear: p.seasonYear,
        position: p.position,
        round: p.round,
        raceName: p.raceName,
        raceDate: p.raceDate ? new Date(p.raceDate) : null,
        driverName: p.driverName,
        driverNationality: p.driverNationality,
        constructorName: p.constructorName,
        timeText: p.timeText,
        driverId: p.driverExternalId
          ? (driverIdByExternal.get(p.driverExternalId) ?? null)
          : null,
        externalSource: provider.name,
        externalFetchedAt: simdi,
      },
    });
    yazilan++;
  }

  console.log(`  ${benzersiz.size} sürücü künyesi, ${yeniPortre} yeni portre`);
  console.log(`  ${yazilan} podyum satırı yazıldı`);
}

main()
  .catch((error) => {
    console.error('Senkronizasyon başarısız:', error.message);
    console.error('Site etkilenmedi — son senkronize veri yerinde duruyor.');
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
