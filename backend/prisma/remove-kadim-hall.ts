import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './_client';

/**
 * Salon 06 · Kadim Dünyalar kapısının kaldırılması (Faz 6).
 *
 * Karar ve ölçüm: `docs/muzik-bolumu-inceleme.md` §3.0–§3.3, §5.3.
 * Müzik salonu Kadim Dünyalar'ın YERİNİ alıyor (Salon 06); Temürkan 07'de
 * kalıyor.
 *
 * ── NE YAPIYOR ────────────────────────────────────────────────────────────
 * 1. `kitap` kategorisini bulur, yoksa oluşturur (kapı bugün koddan tanımlı,
 *    `UniverseCategory` kaydı yok — `lib/halls.ts` CODE_HALLS).
 * 2. İçeriği olan kadim evrenlerini `kitap` kategorisine taşır.
 * 3. `temurkan-efsaneleri`nin `categoryId`'sini `null`a çeker — sitenin kendi
 *    eseri, bir kitap serisi değil. Mühürlü kapısı kategori sisteminden
 *    bağımsız olduğu için (`app/[locale]/page.tsx`) bundan etkilenmiyor.
 * 4. **Tamamen boş** kadim evrenlerini yumuşak siler.
 * 5. `kadim-dunyalar` kategorisini yumuşak siler.
 *
 * ── İKİ GÜVENLİK ÖZELLİĞİ ─────────────────────────────────────────────────
 *
 * **A) Varsayılan KURU ÇALIŞMA.** Argüman verilmezse hiçbir şey yazmaz,
 * yalnızca ne yapacağını söyler. Yazmak için `--apply` şart.
 *
 * **B) Boşluk ÖLÇÜLÜR, varsayılmaz.** Hangi evrenin silineceği koda
 * yazılmadı; betik her evrenin ON İLİŞKİSİNİ sayıyor (bölümler — TASLAKLAR
 * DAHİL —, wiki girdileri, fon sesleri, kitaplar, spor kayıtları, futbol
 * kulüpleri…) ve tek bir bağ bulursa o evreni ATLAR.
 *
 * Bunun gerekçesi somut: 11 Ağustos ölçümü kamuya açık uçtan yapılmıştı ve o
 * uç `isPublished: true` süzüyor — yani yayımlanmamış taslakları GÖRMÜYORDU.
 * O boşluğu "silmeden önce elle kontrol et" diye bir insan adımına bırakmak,
 * unutulabilir bir adım bırakmak olurdu. Ölçüm artık silme işleminin içinde.
 *
 * ── KULLANIM ──────────────────────────────────────────────────────────────
 *     npx ts-node prisma/remove-kadim-hall.ts            # kuru çalışma
 *     npx ts-node prisma/remove-kadim-hall.ts --apply    # uygula
 *
 * Tekrar çalıştırmak güvenli: zaten silinmiş kayıtlara dokunmaz.
 *
 * ⚠️ Bu betik `src/` altından import ETMEZ — üretimde yalnızca derlenmiş
 * `dist/` var (bkz. Dockerfile). `seed.ts` ile aynı kısıt.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️⚠️ BU BETİK ÜRETİM KONTEYNERİNDE ÇALIŞMIYOR — ÖLÇÜLDÜ (11 Ağustos 2026)
 *
 *     $ npx ts-node prisma/remove-kadim-hall.ts
 *     Error: Cannot find module '/app/prisma/_client'
 *     code: 'ERR_MODULE_NOT_FOUND'
 *
 * Konteynerde Node dosyayı **ES modülü olarak** ayrıştırıyor
 * (`MODULE_TYPELESS_PACKAGE_JSON` uyarısı: "Reparsing as ES module") ve ESM
 * çözümleyicisi `'./_client'` gibi uzantısız yolları çözmüyor. Yerelde
 * CommonJS olarak çözüldüğü için burada sorun görünmüyor.
 *
 * ⚠️ AYNI TUZAK `seed.ts` İÇİN DE GEÇERLİ — o da `'./_client'` import ediyor
 * ve `prisma.config.ts`te `seed: "ts-node prisma/seed.ts"` yazılı. Üretimde
 * seed çalıştırmak gerekirse aynı hatayı verecek.
 *
 * ÜRETİM KARŞILIĞI: **`prisma/sql/remove-kadim-hall.sql`**
 * Aynı işi yapıyor ve "boş olmayan evreni silme" koruması orada `NOT EXISTS`
 * yan tümceleri olarak duruyor — üstelik güncellemeyle aynı ifadede, yani
 * atomik. Bu `.ts` dosyası yerel geliştirme ve okunabilir doküman olarak
 * kalıyor; ÜRETİMDE SQL kullanılır.
 * ══════════════════════════════════════════════════════════════════════════
 */

const KADIM_SLUG = 'kadim-dunyalar';
const KITAP_SLUG = 'kitap';
/** Sitenin kendi eseri — kitap kategorisine girmez, kategorisiz kalır. */
const OWN_WORK_SLUG = 'temurkan-efsaneleri';

const APPLY = process.argv.includes('--apply');

interface Census {
  slug: string;
  name: string;
  /** Yayımlanmış VE taslak bölümler — ayrım yapılmıyor, ikisi de içeriktir */
  stories: number;
  publishedStories: number;
  wikiEntries: number;
  ambientTracks: number;
  bookEntries: number;
  sportPlayers: number;
  sportLegends: number;
  raceEvents: number;
  driverStandings: number;
  transferNews: number;
  footballClubs: number;
}

function total(c: Census): number {
  return (
    c.stories +
    c.wikiEntries +
    c.ambientTracks +
    c.bookEntries +
    c.sportPlayers +
    c.sportLegends +
    c.raceEvents +
    c.driverStandings +
    c.transferNews +
    c.footballClubs
  );
}

function describe(c: Census): string {
  const parts: string[] = [];
  if (c.stories > 0) {
    const drafts = c.stories - c.publishedStories;
    parts.push(
      `${c.stories} bölüm` + (drafts > 0 ? ` (${drafts} TASLAK)` : ''),
    );
  }
  if (c.wikiEntries > 0) parts.push(`${c.wikiEntries} wiki`);
  if (c.ambientTracks > 0) parts.push(`${c.ambientTracks} fon sesi`);
  if (c.bookEntries > 0) parts.push(`${c.bookEntries} kitap`);
  if (c.sportPlayers > 0) parts.push(`${c.sportPlayers} sporcu`);
  if (c.sportLegends > 0) parts.push(`${c.sportLegends} efsane`);
  if (c.raceEvents > 0) parts.push(`${c.raceEvents} yarış`);
  if (c.driverStandings > 0) parts.push(`${c.driverStandings} sıralama`);
  if (c.transferNews > 0) parts.push(`${c.transferNews} transfer`);
  if (c.footballClubs > 0) parts.push(`${c.footballClubs} kulüp`);
  return parts.length > 0 ? parts.join(', ') : 'tamamen boş';
}

async function main(): Promise<void> {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  try {
    console.log(
      APPLY
        ? '=== UYGULAMA MODU — veritabanına yazılacak ===\n'
        : '=== KURU ÇALIŞMA — hiçbir şey yazılmayacak (uygulamak için --apply) ===\n',
    );

    const kadim = await prisma.universeCategory.findUnique({
      where: { slug: KADIM_SLUG },
      select: { id: true, name: true, isDeleted: true },
    });
    if (!kadim) {
      console.log(`"${KADIM_SLUG}" kategorisi bulunamadı — yapılacak iş yok.`);
      return;
    }
    if (kadim.isDeleted) {
      console.log(
        `"${KADIM_SLUG}" kategorisi zaten yumuşak silinmiş — betik daha önce koştu.`,
      );
    }

    /* ── Müzik kapısı var mı? (bu betik oluşturmuyor) ──────────────────── */
    const muzik = await prisma.universeCategory.findUnique({
      where: { slug: 'muzik' },
      select: { name: true, coverImage: true, isDeleted: true },
    });
    if (!muzik || muzik.isDeleted) {
      console.log(
        '⚠️ "muzik" kategorisi YOK. Kadim kapısı kalkınca Salon 06 boş kalır.\n' +
          '   Panelden (/admin/universe-categories) slug\'ı "muzik" olan bir\n' +
          '   kategori oluştur ve kapak görseli yükle. Bu betik onu oluşturmuyor:\n' +
          '   kapak görseli küratörün seçimi.\n',
      );
    } else {
      console.log(
        `✔ Müzik kapısı hazır: "${muzik.name}"` +
          (muzik.coverImage ? ' (kapak var)' : ' (⚠️ kapak YOK)') +
          '\n',
      );
    }

    /* ── Kitap kategorisi ─────────────────────────────────────────────── */
    let kitap = await prisma.universeCategory.findUnique({
      where: { slug: KITAP_SLUG },
      select: { id: true, name: true },
    });
    if (!kitap) {
      console.log(
        `"${KITAP_SLUG}" kategorisi yok (kapı koddan tanımlı) — oluşturulacak.`,
      );
      if (APPLY) {
        kitap = await prisma.universeCategory.create({
          data: { slug: KITAP_SLUG, name: 'Kitap' },
          select: { id: true, name: true },
        });
        console.log(`  → oluşturuldu: ${kitap.id}`);
      }
    } else {
      console.log(`✔ Kitap kategorisi mevcut: "${kitap.name}"`);
    }

    /* ── Kadim evrenlerinin sayımı ────────────────────────────────────── */
    const universes = await prisma.wikiUniverse.findMany({
      where: { categoryId: kadim.id, isDeleted: false },
      select: { id: true, slug: true, name: true },
      orderBy: { slug: 'asc' },
    });
    console.log(`\n${universes.length} evren bulundu. Sayım:\n`);

    const census: Array<Census & { id: string }> = [];
    for (const universe of universes) {
      const [
        stories,
        publishedStories,
        wikiEntries,
        ambientTracks,
        bookEntries,
        sportPlayers,
        sportLegends,
        raceEvents,
        driverStandings,
        transferNews,
        footballClubs,
      ] = await Promise.all([
        // ⚠️ `isPublished` SÜZÜLMÜYOR: taslak da içeriktir
        prisma.story.count({
          where: { universeId: universe.id, isDeleted: false },
        }),
        prisma.story.count({
          where: { universeId: universe.id, isDeleted: false, isPublished: true },
        }),
        prisma.wikiEntry.count({
          where: { universeId: universe.id, isDeleted: false },
        }),
        prisma.ambientTrack.count({ where: { universeId: universe.id } }),
        prisma.bookEntry.count({
          where: { universeId: universe.id, isDeleted: false },
        }),
        prisma.sportPlayer.count({ where: { universeId: universe.id } }),
        prisma.sportLegend.count({ where: { universeId: universe.id } }),
        prisma.raceEvent.count({ where: { universeId: universe.id } }),
        prisma.driverStanding.count({ where: { universeId: universe.id } }),
        prisma.transferNews.count({ where: { universeId: universe.id } }),
        prisma.footballClub.count({ where: { universeId: universe.id } }),
      ]);

      const entry = {
        id: universe.id,
        slug: universe.slug,
        name: universe.name,
        stories,
        publishedStories,
        wikiEntries,
        ambientTracks,
        bookEntries,
        sportPlayers,
        sportLegends,
        raceEvents,
        driverStandings,
        transferNews,
        footballClubs,
      };
      census.push(entry);
      const sum = total(entry);
      const verdict =
        universe.slug === OWN_WORK_SLUG
          ? 'KATEGORİSİZ KALACAK (sitenin kendi eseri)'
          : sum > 0
            ? 'KİTAP kategorisine taşınacak'
            : 'YUMUŞAK SİLİNECEK';
      console.log(
        `  ${universe.slug.padEnd(24)} ${describe(entry).padEnd(34)} → ${verdict}`,
      );
    }

    /* ── Uygulama ─────────────────────────────────────────────────────── */
    let moved = 0;
    let orphaned = 0;
    let deleted = 0;
    let skipped = 0;

    for (const entry of census) {
      const sum = total(entry);

      if (entry.slug === OWN_WORK_SLUG) {
        if (APPLY) {
          await prisma.wikiUniverse.update({
            where: { id: entry.id },
            data: { categoryId: null },
          });
        }
        orphaned += 1;
        continue;
      }

      if (sum > 0) {
        if (!kitap) {
          console.log(
            `\n⚠️ ${entry.slug} taşınamadı: kitap kategorisi yok (kuru çalışmada normal).`,
          );
          skipped += 1;
          continue;
        }
        if (APPLY) {
          await prisma.wikiUniverse.update({
            where: { id: entry.id },
            data: { categoryId: kitap.id },
          });
        }
        moved += 1;
        continue;
      }

      // Tamamen boş → yumuşak sil. Kural 14: slug'a `-deleted-{timestamp}`
      // soneki, yoksa aynı slug ileride yeniden kullanılamaz.
      if (APPLY) {
        await prisma.wikiUniverse.update({
          where: { id: entry.id },
          data: {
            isDeleted: true,
            slug: `${entry.slug}-deleted-${Date.now()}`,
          },
        });
      }
      deleted += 1;
    }

    /* ── Kategoriyi yumuşak sil ───────────────────────────────────────── */
    if (!kadim.isDeleted) {
      if (APPLY) {
        await prisma.universeCategory.update({
          where: { id: kadim.id },
          data: {
            isDeleted: true,
            slug: `${KADIM_SLUG}-deleted-${Date.now()}`,
          },
        });
      }
      console.log(
        `\n"${kadim.name}" kategorisi yumuşak silinecek (slug'a -deleted- soneki).`,
      );
    }

    console.log(
      `\n=== ÖZET ===\n` +
        `  kitap kategorisine taşınan : ${moved}\n` +
        `  kategorisiz kalan          : ${orphaned}  (${OWN_WORK_SLUG})\n` +
        `  yumuşak silinen            : ${deleted}\n` +
        `  atlanan                    : ${skipped}\n` +
        (APPLY
          ? '\nUygulandı. Ön yüzü doğrulamak için: ana sayfada Salon 06 Müzik,\n' +
            'Salon 07 Temürkan görünüyor mu; silinen evrenlerin adresleri 301 mi.'
          : '\nHiçbir şey yazılmadı. Uygulamak için: --apply'),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
