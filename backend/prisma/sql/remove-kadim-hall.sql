-- ============================================================================
-- Salon 06 · Kadim Dünyalar kapısının kaldırılması (Faz 6)
--
-- Karar ve ölçüm: docs/muzik-bolumu-inceleme.md §3.0–§3.3, §5.3
-- Müzik, Kadim Dünyalar'ın YERİNİ alıyor (Salon 06); Temürkan 07'de kalıyor.
--
-- ── NEDEN SQL, NEDEN TS BETİĞİ DEĞİL ───────────────────────────────────────
-- `prisma/remove-kadim-hall.ts` yerelde çalışıyor ama ÜRETİM KONTEYNERİNDE
-- ÇALIŞMIYOR: orada `ts-node` dosyayı ES modülü olarak ayrıştırıyor ve
-- `'./_client'` uzantısız import'u çözülemiyor (ERR_MODULE_NOT_FOUND).
-- Bu dosya onun üretim karşılığı. Betiğin tek gerçek değeri "boş olmayan
-- evreni silme" koruması; o koruma burada `NOT EXISTS` yan tümceleri olarak
-- duruyor — üstelik güncellemeyle AYNI ifadede, yani atomik: sayım ile silme
-- arasında veri değişse bile yanlış satır silinemez.
--
-- ── İKİ ÖNEMLİ AYRINTI ─────────────────────────────────────────────────────
-- 1. `id` ve `updatedAt` sütunlarının veritabanı düzeyinde VARSAYILANI YOK.
--    Prisma'nın `@default(cuid())` ve `@updatedAt`ı istemci tarafında çalışır.
--    Bu yüzden INSERT'te ikisi de elle veriliyor ve UPDATE'lerde `updatedAt`
--    açıkça `now()` yapılıyor — yoksa sitemap'in okuduğu tarih bayat kalırdı.
-- 2. Yumuşak silmede slug'a `-deleted-{epoch}` soneki ekleniyor (AGENTS.md
--    kural 14): yoksa aynı slug ileride yeniden kullanılamaz.
--
-- ── KULLANIM ───────────────────────────────────────────────────────────────
-- Coolify → Postgres → Terminal:
--     psql -U postgres -d postgres -P pager=off -f /tmp/remove-kadim-hall.sql
-- Dosyayı kopyalamak zahmetliyse aşağıdaki bloğu doğrudan yapıştırmak da olur.
--
-- Tamamı tek işlemde (BEGIN/COMMIT): bir adım patlarsa hiçbiri uygulanmaz.
-- Tekrar çalıştırmak güvenli — ikinci koşuda eşleşen satır kalmaz.
-- ============================================================================

BEGIN;

-- ── 0) ÖNCE DURUM: ne yapılacağını göster ──────────────────────────────────
\echo '=== ONCESI: kadim evrenleri ve icerik sayimi ==='
SELECT u.slug,
       (SELECT count(*) FROM "Story" s
         WHERE s."universeId" = u.id AND s."isDeleted" = false) AS bolum,
       (SELECT count(*) FROM "Story" s
         WHERE s."universeId" = u.id AND s."isDeleted" = false
           AND s."isPublished" = false) AS taslak,
       (SELECT count(*) FROM "WikiEntry" w
         WHERE w."universeId" = u.id AND w."isDeleted" = false) AS wiki,
       (SELECT count(*) FROM "AmbientTrack" a WHERE a."universeId" = u.id) AS ses,
       (SELECT count(*) FROM "BookEntry" b
         WHERE b."universeId" = u.id AND b."isDeleted" = false) AS kitap
FROM "WikiUniverse" u
JOIN "UniverseCategory" c ON c.id = u."categoryId"
WHERE c.slug = 'kadim-dunyalar' AND u."isDeleted" = false
ORDER BY u.slug;

-- ── 1) Kitap kategorisi yoksa oluştur ──────────────────────────────────────
-- Kapı bugün koddan tanımlı (lib/halls.ts CODE_HALLS), kategori kaydı yok.
INSERT INTO "UniverseCategory" (id, slug, name, "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, 'kitap', 'Kitap', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "UniverseCategory" WHERE slug = 'kitap');

-- ── 2) Temürkan kategorisiz kalır ──────────────────────────────────────────
-- Sitenin kendi eseri; bir kitap serisi değil. Mühürlü kapısı kategori
-- sisteminden bağımsız (app/[locale]/page.tsx) — bundan etkilenmiyor.
UPDATE "WikiUniverse" u
   SET "categoryId" = NULL, "updatedAt" = now()
 WHERE u.slug = 'temurkan-efsaneleri'
   AND u."categoryId" = (SELECT id FROM "UniverseCategory"
                          WHERE slug = 'kadim-dunyalar');

-- ── 3) İÇERİĞİ OLAN kadim evrenleri → kitap kategorisi ─────────────────────
-- Koşul "boş DEĞİL": aşağıdaki 4. adımın tam tersi. İkisi birlikte her evreni
-- kapsıyor, yani hiçbir evren arada kaybolmuyor.
UPDATE "WikiUniverse" u
   SET "categoryId" = (SELECT id FROM "UniverseCategory" WHERE slug = 'kitap'),
       "updatedAt" = now()
 WHERE u."categoryId" = (SELECT id FROM "UniverseCategory"
                          WHERE slug = 'kadim-dunyalar')
   AND u."isDeleted" = false
   AND (
     EXISTS (SELECT 1 FROM "Story" s
              WHERE s."universeId" = u.id AND s."isDeleted" = false)
     OR EXISTS (SELECT 1 FROM "WikiEntry" w
                 WHERE w."universeId" = u.id AND w."isDeleted" = false)
     OR EXISTS (SELECT 1 FROM "AmbientTrack" a WHERE a."universeId" = u.id)
     OR EXISTS (SELECT 1 FROM "BookEntry" b
                 WHERE b."universeId" = u.id AND b."isDeleted" = false)
     OR EXISTS (SELECT 1 FROM "SportPlayer" x WHERE x."universeId" = u.id)
     OR EXISTS (SELECT 1 FROM "SportLegend" x WHERE x."universeId" = u.id)
     OR EXISTS (SELECT 1 FROM "RaceEvent" x WHERE x."universeId" = u.id)
     OR EXISTS (SELECT 1 FROM "DriverStanding" x WHERE x."universeId" = u.id)
     OR EXISTS (SELECT 1 FROM "TransferNews" x WHERE x."universeId" = u.id)
     OR EXISTS (SELECT 1 FROM "FootballClub" x WHERE x."universeId" = u.id)
   );

-- ── 4) TAMAMEN BOŞ kadim evrenleri → yumuşak sil ───────────────────────────
-- ⚠️ KORUMA BURADA. `Story` süzgecinde `isPublished` YOK: taslak da içeriktir.
-- 11 Ağustos ölçümü kamuya açık uçtan yapılmıştı ve o uç isPublished süzüyor,
-- yani taslakları GÖRMÜYORDU. Bu on `NOT EXISTS` o boşluğu kapatıyor ve
-- güncellemeyle aynı ifadede olduğu için atlanması mümkün değil.
UPDATE "WikiUniverse" u
   SET "isDeleted" = true,
       -- Kural 14: slug serbest kalsın
       slug = u.slug || '-deleted-' || extract(epoch from now())::bigint,
       "updatedAt" = now()
 WHERE u."categoryId" = (SELECT id FROM "UniverseCategory"
                          WHERE slug = 'kadim-dunyalar')
   AND u."isDeleted" = false
   AND u.slug <> 'temurkan-efsaneleri'
   AND NOT EXISTS (SELECT 1 FROM "Story" s
                    WHERE s."universeId" = u.id AND s."isDeleted" = false)
   AND NOT EXISTS (SELECT 1 FROM "WikiEntry" w
                    WHERE w."universeId" = u.id AND w."isDeleted" = false)
   AND NOT EXISTS (SELECT 1 FROM "AmbientTrack" a WHERE a."universeId" = u.id)
   AND NOT EXISTS (SELECT 1 FROM "BookEntry" b
                    WHERE b."universeId" = u.id AND b."isDeleted" = false)
   AND NOT EXISTS (SELECT 1 FROM "SportPlayer" x WHERE x."universeId" = u.id)
   AND NOT EXISTS (SELECT 1 FROM "SportLegend" x WHERE x."universeId" = u.id)
   AND NOT EXISTS (SELECT 1 FROM "RaceEvent" x WHERE x."universeId" = u.id)
   AND NOT EXISTS (SELECT 1 FROM "DriverStanding" x WHERE x."universeId" = u.id)
   AND NOT EXISTS (SELECT 1 FROM "TransferNews" x WHERE x."universeId" = u.id)
   AND NOT EXISTS (SELECT 1 FROM "FootballClub" x WHERE x."universeId" = u.id);

-- ── 5) Kategoriyi yumuşak sil ──────────────────────────────────────────────
-- Bağlı evren kalmadıysa. Kalmışsa (3. adım taşımayı başaramadıysa) kategori
-- AÇIK KALIR ve kapı duvarda görünmeye devam eder — sessiz yetim kayıt yok.
UPDATE "UniverseCategory" c
   SET "isDeleted" = true,
       slug = c.slug || '-deleted-' || extract(epoch from now())::bigint,
       "updatedAt" = now()
 WHERE c.slug = 'kadim-dunyalar'
   AND NOT EXISTS (SELECT 1 FROM "WikiUniverse" u
                    WHERE u."categoryId" = c.id AND u."isDeleted" = false);

-- ── 6) SONRA DURUM ─────────────────────────────────────────────────────────
\echo ''
\echo '=== SONRASI: eski kadim evrenleri nerede ==='
SELECT u.slug,
       coalesce(c.slug, '(KATEGORISIZ)') AS kategori,
       CASE WHEN u."isDeleted" THEN 'SILINDI' ELSE 'duruyor' END AS durum
FROM "WikiUniverse" u
LEFT JOIN "UniverseCategory" c ON c.id = u."categoryId"
WHERE u.slug LIKE '%dune%' OR u.slug LIKE '%zaman-carki%'
   OR u.slug LIKE '%temurkan%' OR u.slug LIKE '%malazan%'
   OR u.slug LIKE '%firtinaisigi%' OR u.slug LIKE '%buz-ve-atesin%'
   OR u.slug LIKE '%kral-katili%' OR u.slug LIKE '%yuzuklerin%'
ORDER BY u."isDeleted", u.slug;

\echo ''
\echo '=== KAPI DUVARINDAKI KATEGORILER ==='
SELECT slug, name, CASE WHEN "isDeleted" THEN 'SILINDI' ELSE 'duruyor' END AS durum
FROM "UniverseCategory" ORDER BY "isDeleted", slug;

COMMIT;
