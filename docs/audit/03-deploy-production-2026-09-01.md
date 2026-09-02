# KuroNexus — Deploy & Production Denetimi (Parça 3/4)

> **Tarih:** 2026-09-01 · **Kapsam:** API & Database, Docker & Coolify, Build Memory, Security & Production
> **Yöntem:** Salt okuma + statik analiz. Sıfır kod değişikliği. Her bulgu dosya+satır kanıtlı.
> Canlı sunucuya ait tespitler yalnızca depodaki belgelerden (`docs/deploy-duzeni.md`) okunmuştur;
> panel/sunucu üzerinde doğrulama bu denetimin kapsamı dışındadır ve öyle işaretlenmiştir.

---

## 7 · API & Database

### API-01 — SSR fetch'lerinde timeout yok
- **Dosya:** `frontend/lib/api/client.ts` — **Satır:** 90
- **Problem:** Merkezî `apiFetch` sarmalayıcısı `fetch`'e hiçbir `AbortSignal.timeout` vermiyor. Sitedeki bütün sunucu tarafı veri çağrıları bu fonksiyondan geçiyor.
- **Etki:** **High**
- **Neden:** Backend yavaşlar ya da asılı kalırsa (ör. DB kilidi, bellek baskısı) her SSR isteği Node'un varsayılan sınırına kadar bekler. 120 sayfa `force-dynamic` olduğu için (bkz. API-05) asılı kalan tek bir uç, o uca dokunan bütün sayfaların render'ını kilitler; 2 çekirdekli sunucuda istek yığılması hızla büyür. Backend'in kendi dış istekleri istisnasız `AbortSignal.timeout` taşıyor (ör. `backend/src/anime/anilist.service.ts:743`, `backend/src/movies/tmdb.service.ts:406`) — aynı disiplin ön yüzde yok.
- **Çözüm:** `apiFetch` içine `signal: init?.signal ?? AbortSignal.timeout(10_000)` gibi tek satırlık bir varsayılan; timeout'u `ApiError`'a çevirip mevcut `catch { return [] }` yedekleri devralsın.
- **Getiri:** Backend arızasında sayfalar saniyeler içinde yedek içerikle açılır; SSR süreç havuzu asılı isteklerle dolmaz (RAM + gecikme).

### API-02 — SSR istekleri rate limit'te TEK kova paylaşıyor
- **Dosya:** `backend/src/app.module.ts` — **Satır:** 35 (`ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }])`) · destekleyen kanıt: `backend/src/main.ts:13`, `frontend/lib/api/client.ts:60-64`, `backend/src/app.controller.ts:35`
- **Problem:** Global throttle IP başına 100 istek/dk. Ancak SSR çağrıları tarayıcıdan değil Next konteynerinden çıkıyor — üretimde `API_INTERNAL_URL` ile Docker iç ağından, `X-Forwarded-For` başlığı olmadan. Yani **bütün ziyaretçilerin SSR istekleri tek IP'nin (Next konteyneri) kovasına** yazılıyor. `@SkipThrottle` yalnızca `/health`'te var.
- **Etki:** **High**
- **Neden:** Tek sayfa render'ı 2–5 API çağrısı yapıyor (bkz. API-04); dakikada ~20-30 sayfa görüntülemede sınır dolar ve backend 429 döndürmeye başlar. `lib/api/*`'deki yaygın `catch { return [] }` deseni (ör. `frontend/lib/api/curated-images.ts:68-69`, `frontend/lib/api/books.ts:154-155`) 429'u **sessizce boş rafa** çevirir — projenin bilinen Ö-8 arıza sınıfının ta kendisi, üstelik hiçbir logda görünmeden. Saatlik sitemap üretimi de aynı kovadan 9 istek yer (`frontend/app/sitemap.ts:103-105, 166-175`).
- **Çözüm:** Ya iç ağdan gelen istekleri throttle dışı bırakan özel bir `ThrottlerGuard.getTracker`/`skipIf` (kaynak IP Docker subnet'i ise atla), ya SSR isteklerine paylaşılan gizli bir başlık ekleyip onunla muaf tutmak, ya da public GET uçlarını ayrı-yüksek limitli bir throttle profiline almak.
- **Getiri:** Trafik arttığında sitenin kendi kendini boğması (boş raflar) engellenir; gerçek kötüye kullanım koruması tarayıcı istekleri için aynen kalır.

### API-03 — 25 sayfada aynı veri iki kez fetch ediliyor (`cache()` eksik)
- **Dosya:** `frontend/lib/api/*` geneli; sarılı tek örnekler `frontend/lib/api/curated-images.ts:61` ve `frontend/lib/auth/session.ts:24`
- **Problem:** `lib/api` altındaki ~50 getiriciden yalnızca 1'i React `cache()` ile sarılı. `generateMetadata` + sayfa gövdesi aynı getiriciyi çağırınca `no-store` uçlarda **iki ayrı ağ isteği** oluşuyor. Somut 25 vaka:
  - **`no-store`, dedupe YOK (11 sayfa, en ağır grup):** `app/[locale]/dark-stories/category/kitap/[slug]/page.tsx:20+43` (`getBookDetail`, kanıt `lib/api/books.ts:66`), `.../anime/[slug]/page.tsx:19+40`, `.../dizi/[slug]/page.tsx:19+42`, `.../film/[slug]/page.tsx:20+43`, `.../kitap/kisi/[slug]/page.tsx:29+65`, `.../kitap/seri/[slug]/page.tsx:29+65`, `.../kitap/yayinevi/[slug]/page.tsx:23+58`, `.../kitap/oduller/[key]/page.tsx:30+66`, `.../kitap/okuma-sirasi/[key]/page.tsx:30+66`, `.../anime/karakterler/[characterId]/page.tsx:30+75`, `app/[locale]/spor/futbol/oyuncu/[playerId]/page.tsx:27+55`
  - **Seçenekler farklı, dedupe imkânsız (4 müzik sayfası):** `app/[locale]/muzik/[actSlug]/page.tsx:62+98`, `muzik/tur/[genreSlug]/page.tsx:58+90`, `muzik/liste/[slug]/page.tsx:52+88`, `muzik/[actSlug]/[albumSlug]/page.tsx:54+113` — metadata `revalidate:300` ile, gövde `isAdmin`'e göre `no-store` ile çağırıyor (`lib/api/music.ts:346`)
  - **Layout + sayfa çifti:** `app/[locale]/muzik/layout.tsx:41` + `app/[locale]/muzik/listeler/page.tsx:53` (`fetchMusicPlaylists` aynı argümanla iki kez)
  - **`revalidate`'li 9 sayfa** (Data Cache kurtarabilir, yine de iki çağrı noktası): örn. `app/[locale]/spor/futbol/[clubSlug]/page.tsx:25+88`, `spor/formula-1/pistler/[slug]/page.tsx:25+69`
- **Etki:** **High** (ilk iki grup), Low (revalidate'li grup)
- **Neden:** Kitap detayının backend maliyeti tek başına ~253 kayıt × 5 sorgu (bkz. API-07); ikinci fetch bu maliyeti **her sayfa görüntülemede ikiye katlıyor**. API-02'deki paylaşılan kovayı da iki kat hızlı tüketiyor.
- **Çözüm:** `curated-images.ts:61` ve `session.ts:24`'teki mevcut desen: getiricileri `cache(...)` ile sarmak — çağrı yerlerine dokunmadan. Müzik dörtlüsünde ek olarak metadata'nın da sayfayla aynı sarmalayıcıyı (aynı `isAdmin` girdisiyle) kullanması gerekir.
- **Getiri:** Detay sayfalarında backend istek sayısı yarıya iner; TTFB düşer; throttle kovası iki kat geç dolar. Maliyet ~15 dosyada birer satır.

### API-04 — Arşiv uçlarının tamamı `no-store`: her ziyaret tam arşiv taşıyor
- **Dosya:** `frontend/lib/api/books.ts:47`, `anime.ts:28`, `movies.ts:40`, `shows.ts:36`, `characters.ts:44`, `football.ts:11`, `curated-images.ts:66` (+ `sport-archive.ts:634,656` `revalidate: 0`)
- **Problem:** Kitap/anime/film/dizi arşivleri ve karakter dizini her SSR render'ında taze çekiliyor; Next Data Cache hiç devrede değil. `/books` yanıtı ölçülmüş: **558 KB düz JSON** (`backend/src/main.ts:21`, gzip sonrası küçülür ama üretim + serileştirme maliyeti aynen durur).
- **Etki:** **Medium** (bilinçli bir karar olduğu için; gerekçe `curated-images.ts:18-22`'de yazılı — küratör yüklediğini ANINDA görmeli)
- **Neden:** Küratörlük tek kişilik ve seyrek; bedelini ise her ziyaretçi ödüyor: ziyaret başına yüzlerce KB'lik JSON üretimi 2 çekirdekli/3.7 GB'lık kutuda hem gecikme hem RAM demek. `pulse.ts` aynı ikilemi `fresh` parametresiyle çözmüş (`lib/api/pulse.ts:42`: admin'e `no-store`, ziyaretçiye `revalidate: 300`) — desen depoda hazır ama arşiv uçlarına uygulanmamış.
- **Çözüm:** `pulse.ts`/`music.ts`'teki `freshness(fresh)` desenini arşiv getiricilerine yaymak: ziyaretçi 60–300 sn'lik önbellek, küratör (`isAdmin`) `no-store`. Alternatif: küratör kaydetme işlemine `revalidatePath` bağlamak.
- **Getiri:** Backend istek hacmi ve API-02 kovası dramatik rahatlar; sayfa açılışları hızlanır. Küratör tazeliği `isAdmin` yolunda aynen korunur.

### API-05 — 120 sayfa `force-dynamic`, sıfır `generateStaticParams`: statik üretim fiilen kapalı
- **Dosya:** envanter — `app/` altında 120 dosyada `export const dynamic = "force-dynamic"` (örn. `app/[locale]/page.tsx:28`, `spor/futbol/page.tsx:31`, `anime/(salon)/page.tsx:23`); `generateStaticParams` kullanımı **0**
- **Problem:** Her rota her ziyarette baştan SSR ediliyor; API-03/04'teki maliyetler build maliyeti değil **istek başına** maliyet.
- **Etki:** **Medium** (mimari sonuç; tek başına hata değil)
- **Neden:** Bilinçli tercihin izi kodda var (`anime/slam-dunk/page.tsx:54-57`: küratör okumaları `no-store` olduğu için) ve `[locale]` altında `generateStaticParams`'ın bilinen 500 tuzağı nedeniyle statikleştirme riskli. Ancak API-04 çözülürse (ISR) `force-dynamic`'lerin çoğunun gerekçesi ortadan kalkar.
- **Çözüm:** Ayrı bir iş olarak değil, API-04'ün devamı olarak ele alınmalı: önce fetch katmanı `revalidate`'e dönmeli, sonra sayfa bazında `force-dynamic` bildirimleri gözden geçirilmeli.
- **Getiri:** Sunucu CPU/RAM'inde en büyük tekil rahatlama potansiyeli.

### API-06 — Ödül/okuma-sırası uçları her istekte TÜM kitap salonunu yeniden hesaplatıyor
- **Dosya:** `backend/src/books/awards.service.ts` — **Satır:** 408-409 · `backend/src/books/reading-orders.service.ts` — **Satır:** 281-282
- **Problem:** `readArchiveIndex()` yalnızca slug/kapak/başlık kullandığı hâlde `books.getArchive()`'i çağırıyor; o da ~10 sorgu + ~253 kayıt + istatistik/seri/yazar derlemeleri demek. Etkilenen public uçlar: `GET /books/awards`, `/books/awards/:key`, `/books/okuma-sirasi`, `/books/okuma-sirasi/:key` (`books.controller.ts:31,37,71,77`).
- **Etki:** **High**
- **Neden:** Dört public uç, ihtiyacının onlarca katı sorgu koşturuyor; API-04 yüzünden bu uçlar önbelleksiz de çağrılıyor.
- **Çözüm:** Yalnızca gereken sütunları çeken ince bir "arşiv dizini" sorgusu (`select: { slug, coverImage, title, originalTitle, googleId, binKitapSlug, status }`) — `getArchive()`'e hiç girmeden.
- **Getiri:** Uç başına ~10 sorgu → 1-2 sorgu; DB yükü ve yanıt süresi belirgin düşer.

### ~~API-07~~ — Tek kitap sayfası tüm arşivi çekiyor (slug türetme bedeli) → **YAPILDI (2 Eylül 2026 gecesi), ara çözüm yolu; migration YOK.** `getArchiveIndex` (API-06'nın ince dizini) `id/isbn13/genres/seriesName/seriesIndex/seriesId/universeId` ile genişledi; üç uç artık önce dizini okuyor (1 sorgu, ilişkisiz dar satırlar), tam kaydı (`CREDITS_INCLUDE`) yalnız SAYFADA GÖSTERİLEN kimlikler için `archiveBooksByIds` ile çekiyor: detay = hedef + komşular (≈20), seri = ciltler, kaynak = hiç (dizin yetiyor). Slug dizinden gelir, yeniden türetilmez. Kanıt: deploy sonrası dört yanıt (detay ×2, seri, kaynak) deploy öncesiyle bayt bayt kıyaslanacak.
- **Dosya:** `backend/src/books/books.service.ts` — **Satır:** 427-432 (detay), 629-634 (seri), 863-868 (kaynak)
- **Problem:** `GET /books/:slug`, `/books/seri/:slug`, `/books/kaynak/:slug` üçü de `bookEntry.findMany` ile ~253 kaydı 4 ilişkiyle (`CREDITS_INCLUDE`, satır 1868-1875) çekiyor; slug sütun olmadığı, liste sırasından türetildiği için (satır 85-86, 1795-1813; gerekçe 855-857).
- **Etki:** **Medium**
- **Neden:** Tek kayıt için ~253 satır × 5 sorgu. `relationJoins` preview'u da kapalı (`prisma/schema.prisma:4-9`), her `include` ayrı SQL.
- **Çözüm:** Kalıcı çözüm slug'ı sütuna terfi ettirmek (migration); ara çözüm üç ucun ortak, `select` projeksiyonlu tek "dizin" sorgusunu paylaşması.
- **Getiri:** Kitap detayı başına DB satır trafiği ~%99 düşer.

### API-08 — Film/dizi/anime uçları `externalData`'yı budamadan çekiyor
- **Dosya:** `backend/src/movies/movies.service.ts` — **Satır:** 210-213, 232 · `backend/src/shows/shows.service.ts:206-210, 261-265` · `backend/src/anime/anime.service.ts:236-240, 337-341, 421-425, 581-585` · `backend/src/pulse/pulse.service.ts:202-224`
- **Problem:** `toArchiveMovie` (`movies.service.ts:793-818`) `externalData`'dan 10 alan okuyor ama satırlar `cast`, `stills`, `providers`, `budget` dâhil tam TMDB anlık görüntüsüyle çekiliyor. Kitap kanadı aynı sorunu ölçüp `ARCHIVE_OMIT` ile çözmüş (`books.service.ts:1826-1842`: *"istek başına ~0.5 MB"*); film/dizi/anime karşılığını almamış. `pulse.service.ts` de kitap bacağında omit'li (satır 225-232), diğer üç bacakta omit'siz.
- **Etki:** **High**
- **Neden:** Ana sayfa (`/pulse`) dâhil en sık vurulan uçlarda kayıt başına gereksiz JSON taşınıp ayrıştırılıyor; ölçülü emsali kitapta.
- **Çözüm:** Liste uçlarında gösterilen alanları sütuna terfi ettirmek ya da Postgres JSON projeksiyonu; kısa vadede en azından `omit` benzeri daraltma.
- **Getiri:** Kitapta ölçülen kazancın (istek başına ~0.5 MB) benzeri üç salonda daha; DB→app→JSON zincirinde RAM/CPU düşer.

### ~~API-09~~ — `GET /shows` içinde döngüsel yazma + özyinelemeli çift okuma → **YAPILDI (2 Eylül 2026 gecesi):** ölçüm canlıda 92 dizinin 92'sinde sezon var, `create` ve `refresh` sezonları zaten kuruyor → arşiv ucundaki tohumlama bloğu ölü koddu, silindi; `GET /shows` saf okuma. `getDetail`teki özyineleme kalktı: sezon onarımı gerekirse yalnız o kayıt yeniden okunuyor (`readEntry`), slug listeden geldiği gibi kalıyor. Kanıt: tsc/build/jest 161 temiz; dizi arşivi yanıtı deploy sonrası bayt bayt kıyaslanacak.
- **Dosya:** `backend/src/shows/shows.service.ts` — **Satır:** 220-241 (seeding), 295-298 (özyineleme)
- **Problem:** Public arşiv ucu, sezonu eksik dizileri sınırsız `Promise.all` ile TMDB'den çekip dizi başına update + sezon başına upsert koşuyor (satır 220-241), ardından arşivi yeniden okuyor (satır 243). `getDetail` da sezon eksikse kendini çağırıp tam `findMany`'yi ikinci kez koşuyor (satır 295-298).
- **Etki:** **Medium** (tek seferlik geçiş amaçlı — yorum satır 212-217 — ama uç public ve koşul her boş-sezonlu kayıtta yeniden tetiklenir)
- **Neden:** GET isteğinin yan etkiyle yazma yapması hem yavaş istek hem eşzamanlılıkta çifte senkron riski demek.
- **Çözüm:** Seeding'i cron'a ya da admin ucuna taşımak; `getDetail` özyinelemesinde arşivi yeniden okumak yerine senkron sonrası kaydı tek `findMany` dilimiyle tazelemek.
- **Getiri:** Public GET saf okuma olur; kuyruk ve kilit riski kalkar.

### API-10 — Ödül servisi aynı istekte aynı sorguyu iki kez koşuyor
- **Dosya:** `backend/src/books/awards.service.ts` — **Satır:** 363-366 + 395-399 (aynı IN listesiyle iki `externalCache.findMany`); 344-346 + `books.service.ts:399-402` (aynı istekte iki `bookPerson.findMany`, tetikleyen `awards.service.ts:190-194`)
- **Problem:** `readMatches` zaten `fetchedAt` okuyor (satır 369); `readSettled`'ın ikinci sorgusu tamamen gereksiz. Kişi dizini de `getArchive` içindeki okumayla aynı istekte yineleniyor.
- **Etki:** **Medium** (düzeltmesi en ucuz bulgular; liste ucunda 235 anahtarlık IN sorgusu — `books.service.ts:278`)
- **Çözüm:** `readSettled`'ı `readMatches`'in dönüşünden türetmek; kişi dizinini `getArchive` sonucundan paylaşmak.
- **Getiri:** Ödül uçlarında istek başına 2 büyük sorgu eksilir.

### ~~API-11~~ — Müzik genel bakış: 7 seviyeli ilişki zinciri, `take` yok → **YAPILDI (2 Eylül 2026 gecesi):** `getFavoritePlaylists` tür payını tek gruplu ham SQL ile alıyor (playlist × onaylı tür başına bir satır, `COUNT(*)::int`); playlist listesi `_count.tracks` ile, parça bacağı hiç çekilmiyor. Sayım kuralı ve süzgeçsizlik (silinmiş parça/act süzülmez) eski davranışla birebir; tek fark eşit yüzdede sıralama artık ad sırasıyla sabit (eskiden parça sırasına, yani tanımsızdı). Kanıt: deploy sonrası `/music/overview` deploy öncesiyle kıyaslanacak (canlıda 1 liste, 8 parça).
- **Dosya:** `backend/src/music/music.service.ts` — **Satır:** 106-147 (özellikle 118-146)
- **Problem:** `GET /muzik` için tür yüzdesi hesabı `MusicPlaylist → …→ MusicGenre` zincirini 7 ayrı sorguyla ve `MusicPlaylistTrack` bacağında sınırsız çekiyor; Spotify listeleri yüzlerce parça olabiliyor (`music-playlist.service.ts:208`).
- **Etki:** **Medium**
- **Çözüm:** Aynı sonuç `groupBy`/ham SQL ile tür sayısı kadar satırda alınabilir.
- **Getiri:** Müzik salonunun açılış ucunda satır trafiği yüzlerceden onlara iner.

### API-12 — Yedek yolunda oyuncu başına 26 paralel önbelleksiz istek
- **Dosya:** `frontend/lib/sport/curator-images.ts` — **Satır:** 39-43
- **Problem:** Toplu uç (`fetchAllPlayerImages`) düşerse oyuncu başına tekil `fetchPlayerImages` çağrısına düşülüyor — ~26 paralel istek, hepsi `revalidate: 0` (`lib/api/sport-archive.ts:634`), hiçbiri önbelleğe düşmüyor. Bilinçli bir yedek (gerekçe satır 15-22) ama throttle kovasını (API-02) tek sayfada %26 tüketebiliyor.
- **Etki:** **Low** (yalnızca arıza penceresinde tetiklenir)
- **Çözüm:** Yedek yol isteklerine kısa bir `revalidate: 60` vermek ve/veya sayıyı ilk N oyuncuyla sınırlamak.

### API-13 — Backend admin/senkron yollarında döngüsel tekil yazmalar (toplu bulgu)
- **Dosya/Satır:** `backend/src/books/books.service.ts:1099-1147` (backfill: ~253 kayıt × künye bağlama), `backend/src/books/book-credits.service.ts:73-95, 186-199` (kişi başına 2-3, tür başına 3 sorgu; `createMany` fırsatı satır 186-199'da net), `backend/src/anime/anime.service.ts:902-915, 929-942, 1001-1019`, `backend/src/shows/shows.service.ts:670-686, 771-789, 794-808`, `backend/src/music/music-sync.service.ts:399-402` (2 satırlık rol sözlüğü parça başına yeniden okunuyor), `561-583` (liste öğesi başına 2 sorgu), `backend/src/transfer-news/transfer-news.service.ts:125, 159`
- **Etki:** **Low–Medium** (admin/cron yolları; istek yolunda değil)
- **Neden/Çözüm:** Depoda doğru emsaller hazır: `listening.service.ts:219-222` (`createMany + skipDuplicates`), `music-curator.service.ts:369-378` (`$transaction([deleteMany, createMany])`), `sport-archive.service.ts:917-927`. Aynı desenler bu noktalara taşınabilir; `music-sync`'teki rol sözlüğü servis ömrü boyunca bir kez okunmalı.
- **Getiri:** En ağırı `backfillCredits`: ~253 × (3M+3K+1) sorgudan birkaç toplu sorguya iner; senkron süreleri kısalır.

**Temiz çıkanlar (alan 7):** Backend'in bütün dış istekleri timeout'lu (21 çağrı noktası, tamamı `AbortSignal.timeout`); retry'lar sınırlı ve `Retry-After`'a saygılı (`google-books.service.ts:552-557`, `musicbrainz.service.ts:375-383`) — sonsuz retry döngüsü YOK. `/uploads/*` 365 gün `immutable` (`app.module.ts:63-66`), API yanıtları gzip'li (`main.ts:30-35`), `minimumCacheTTL` hizalı (`next.config.ts:505`). Controller+service çift okuma deseni yok; `sport-archive`, `football-live`, `stories`, `wiki`, `universes`, `curated-images` servisleri projeksiyonlu ve temiz. Karakter toplu uçları 50'lik chunk'larla doğru kurulmuş (`lib/api/characters.ts:89-103, 139-152`).

---

## 8 · Docker & Coolify

### DCK-01 — Backend üretim imajına devDependencies komple giriyor
- **Dosya:** `backend/Dockerfile` — **Satır:** 15 (`pnpm install --frozen-lockfile`) + 34 (`COPY --from=build /app/node_modules ./node_modules`)
- **Problem:** Build aşaması dev bağımlılıklarıyla kuruluyor ve **tüm** `node_modules` çalışma imajına kopyalanıyor. İçinde `typescript`, `jest`, `eslint`, `prettier`, `@nestjs/cli`, `ts-node` var (`backend/package.json:45-76`). Yereldeki ölçüm: `backend/node_modules` **491 MB**. Satır 33'teki gerekçe yalnızca "prisma CLI + dotenv migrate deploy için gerekli" — ikisi de devDependencies'te (`package.json:60, 67`) olduğu için tüm ağaç taşınmış.
- **Etki:** **High**
- **Neden:** İmaj boyutu deploy başına diski dolduruyor; disk dolması bu sunucuda **iki kez üretim arızası çıkardı** (`docs/deploy-duzeni.md` §9: kök disk 0 bayt, Coolify Redis MISCONF, deploy kuyruğu kilitlendi). Ayrıca imaj çekme/başlatma süreleri ve saldırı yüzeyi büyüyor.
- **Çözüm:** `prisma` ve `dotenv`'i `dependencies`'e taşı; Dockerfile'da deploy aşamasından önce `pnpm prune --prod` (ya da ayrı bir `pnpm install --prod --frozen-lockfile` katmanı) koş, sonra kopyala.
- **Getiri:** İmaj başına tahminen 250-350 MB disk; §9'daki disk-dolma arıza sınıfının tekrarı belirgin gecikir.

### DCK-02 — Frontend konteyneri root olarak çalışıyor
- **Dosya:** `frontend/Dockerfile` — **Satır:** 24-38 (çalışma aşamasında `USER` yönergesi yok)
- **Problem:** Next standalone sunucusu root ile başlıyor. Backend aynı kararı bilinçli olarak tersine almış ve gerekçelendirmiş (`backend/Dockerfile:56-60`, `USER node`).
- **Etki:** **Medium**
- **Neden:** Frontend'te bir RCE bulunursa saldırgan konteynerde root başlar; backend'te bu yüzey bilinçli kapatılmışken frontend'in açık kalması tutarsızlık.
- **Çözüm:** Çalışma aşamasına `USER node` eklemek (standalone çıktı + `.next/static` + `public` salt okunur; yazma ihtiyacı yok — Next'in image cache'i için `/app/.next/cache`'e node sahipliği vermek gerekebilir, ölçerek).
- **Getiri:** İki servisin güvenlik duruşu eşitlenir; container-escape zincirlerinin ilk halkası zayıflar.

### DCK-03 — Dockerfile'larda HEALTHCHECK yok; panel healthcheck durumu belirsiz
- **Dosya:** `frontend/Dockerfile` (tamamı), `backend/Dockerfile` (tamamı) — hiçbirinde `HEALTHCHECK` yönergesi yok
- **Problem:** Backend'in gerçek bir sağlık ucu var (`backend/src/app.controller.ts:34-50`, `SELECT 1` atan `/health`) ama imaj seviyesinde bağlı değil. Belgelere göre panel tarafı: backend healthcheck **"önerildi — uygulandığı doğrulanmadı"** (`docs/deploy-duzeni.md` §3c), frontend healthcheck **kapalı** (§8.7).
- **Etki:** **Medium** — panel durumu **Doğrulanamadı**
- **Neden:** Healthcheck'siz konteyner "ayakta ama hizmet veremiyor" durumunda (DB kopuk, boş raf sendromu Ö-8) sağlıklı görünür; Coolify eski konteyneri devirme kararlarını körlemesine verir.
- **Çözüm:** Panelden backend healthcheck'i §3c'deki değerlerle (özellikle `Start period: 120` — migration bitmeden ölü sayılmasın) doğrulamak/açmak; frontend açılacaksa §8.7'deki nota uymak (port 3000, imajda curl yok → `node -e "fetch(...)"`).
- **Getiri:** "200 dönen ama boş raflı site" arızası panelde görünür hâle gelir.

### DCK-04 — `NEXT_PUBLIC_API_URL` build'te boş kalırsa sessizce localhost'a gömülür
- **Dosya:** `frontend/Dockerfile` — **Satır:** 16-17 · `frontend/lib/api/client.ts:1-2` (`?? "http://localhost:3001"`)
- **Problem:** ARG verilmeden build alınırsa (Coolify'da Build Variable işareti unutulursa) üretim paketi API adresi olarak `http://localhost:3001`'i gömer; build **başarıyla** biter, site canlıda veri çekemez. Uyarı yalnızca yorumda (Dockerfile satır 14-15).
- **Etki:** **Medium**
- **Çözüm:** Build aşamasına tek satır kapı: `RUN test -n "$NEXT_PUBLIC_API_URL" || (echo "NEXT_PUBLIC_API_URL eksik" && exit 1)`.
- **Getiri:** Sessiz-bozuk deploy sınıfı, gürültülü build hatasına döner (projenin kendi ilkesi: `backend/Dockerfile:64-76`).

### DCK-05 — Build cache: pnpm store mount'u yok, tsbuildinfo taşınmıyor
- **Dosya:** `frontend/Dockerfile:10`, `backend/Dockerfile:15`
- **Problem:** `pnpm install` BuildKit cache mount'suz; builder cache silindiğinde (bu sunucuda yaşandı: `docs/deploy-duzeni.md` §9.6 — prune sonrası sıfırdan derleme ~4 dk, sıcak deploy 14 sn) tüm paketler yeniden iner.
- **Etki:** **Low**
- **Çözüm:** `RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile`.
- **Getiri:** Soğuk build süresi ve ağ trafiği düşer; 2 çekirdekli kutuda deploy penceresi kısalır.

### DCK-06 — Sürüm sabitleme gevşek: `node:24-slim` + `pnpm@10`
- **Dosya:** `frontend/Dockerfile:3, 6, 25` · `backend/Dockerfile:3, 11, 24`
- **Problem:** Taban imaj digest'siz, pnpm yalnızca major'a sabitli; iki build arasında Node minor'u ya da pnpm davranışı sessizce değişebilir. `package.json`'larda `packageManager` alanı da yok.
- **Etki:** **Low**
- **Çözüm:** `node:24.x-slim@sha256:…` + `pnpm@10.x.y` (ya da corepack + `packageManager`).
- **Getiri:** Tekrarlanabilir build; "dün geçiyordu" sınıfı arıza kapanır.

### DCK-07 — Dev compose: varsayılan parola + 5432 host'a açık
- **Dosya:** `docker-compose.yml` — **Satır:** 8 (`POSTGRES_PASSWORD:-kuronexus_dev_password`), 10-11 (`"${POSTGRES_PORT:-5432}:5432"`)
- **Problem:** Yalnızca geliştirme dosyası, ama port yayını 0.0.0.0'a bağlanır; bu dosya yanlışlıkla sunucuda koşturulursa PG internete varsayılan parolayla açılır.
- **Etki:** **Low** (dev kapsamı)
- **Çözüm:** `ports` satırını `127.0.0.1:5432:5432` yapmak; bir satır maliyetli, dev akışını değiştirmez.

**Temiz çıkanlar (alan 8):** İki Dockerfile da çok aşamalı; katman sırası doğru (önce lock dosyaları, sonra kaynak). Frontend standalone çıktı kullanıyor (`next.config.ts:241`), çalışma imajı minimal. `.dockerignore`'lar kritik dizinleri dışlıyor — özellikle `backend/.dockerignore:4` **155 MB'lık `uploads/`** ve iki tarafta `.env*` (frontend:6-8, backend:5-7). Migration zinciri `&&` ile fail-fast (`backend/Dockerfile:76`) ve gerekçesi belgeli; uploads volume sahipliği ve `HOME` tuzağı (satır 49-54) çözülmüş. Deploy düzeni arıza sınıfları (eşzamanlı build OOM, rolling update, bölünmüş sürüm) `docs/deploy-duzeni.md` §3/§10'da ölçülüp kapatılmış.

---

## 9 · Build Memory

### MEM-01 — En pahalı aşama: `next build` tip kontrolü; sunucu tepede, arıza bir kez yaşandı
- **Dosya (kanıt):** `docs/deploy-duzeni.md` §1 (Next build tepe 1.5–2.5 GB; Nest+prisma 1–1.5 GB; sunucu **3.7 GB RAM / 2 çekirdek**) ve §9.6 (adım 8: build `Linting and checking validity of types` satırında **Failed**, aynı commit ikinci denemede geçti; derleme sırasında disk ölçümüyle "disk elendi, geriye bellek kaldı")
- **Problem:** Frontend'te 915 TS/TSX dosyası tek `tsc` turunda kontrol ediliyor ve bu adım makinenin belgelenmiş tepe noktası. Docker build'inde `tsconfig.tsbuildinfo` taşınmadığı için artımlı kontrol de yok.
- **Etki:** **High** (ortam kaynaklı; kod hatası değil)
- **Neden:** RAM marjı ~sıfır; Redis/prune gibi eşzamanlı yükle çakışınca build düşüyor. Hafifletme belgelenmiş ama bilinçli olarak uygulanmamış (§9.6.1: `NEXT_OUTPUT_STANDALONE` bayrağına bağlı `typescript.ignoreBuildErrors` — "ölçmeden uygulama" notuyla beklemede).
- **Çözüm (sıralı):** 1) Build tekrar aynı satırda düşerse §9.6.1'deki hazır çözümü uygulamak (yerelde `tsc --noEmit` zaten koşuyor); 2) swap'ı ölçüp yoksa 2 GB swap eklemek (§6'da "ölçülmedi" olarak açık); 3) `NODE_OPTIONS=--max-old-space-size` ile tavanı bilinçli sınırlamak (depoda hiçbir yerde ayarlı değil — ölçüldü, 0 kullanım).
- **Getiri:** Deploy başarısızlık oranı düşer; OOM killer'ın çalışan servisleri vurma riski (deploy-duzeni §2) azalır.

### MEM-02 — Backend derlemesi gereksiz emit yapıyor: `declaration` + `sourceMap`
- **Dosya:** `backend/tsconfig.json` — **Satır:** 8 (`"declaration": true`), 14 (`"sourceMap": true`)
- **Problem:** Bir uygulama (kütüphane değil) için `.d.ts` üretimi gereksiz; source map'ler de dist ile birlikte üretim imajına kopyalanıyor (`backend/Dockerfile:35`). `src/generated` altındaki 94 dosyalık / 8.2 MB'lık Prisma istemcisi de her build'te bu ayarlarla derleniyor.
- **Etki:** **Low**
- **Çözüm:** `declaration: false`; source map istenirse `inlineSources` yerine üretim kopyasından `.map` dosyalarını ayıklamak. (Not: `source-map-support` devDependencies'te — DCK-01 çözülünce üretimde zaten yüklü olmayacak, stack-trace beklentisi buna göre netleştirilmeli.)
- **Getiri:** Build süresi/belleğinde küçük, imaj boyutunda ölçülebilir kazanç.

### MEM-03 — Statik üretim maliyeti düşük; bedel çalışma zamanına taşınmış
- **Dosya (kanıt):** `generateStaticParams` kullanımı 0; 120 `force-dynamic` (envanter §7/API-05); tek `revalidate` bildirimi `app/sitemap.ts:21`
- **Problem/Not:** Build sırasında SSG RAM baskısı yok — bu iyi. Ancak aynı karar her ziyareti SSR yapıyor ve bellek baskısı ÇALIŞAN konteynere binmiş durumda: bellek sıkışıklığında sitemap route'unun düştüğü ölçülmüş (`docs/deploy-duzeni.md` §10.2: `Internal server error at .next/server/app/sitemap.xml/route.js`, 674 KB sitemap).
- **Etki:** **Medium** (API-04/05 ile aynı kök)
- **Çözüm:** API-04'teki ISR geçişi bu bulgunun da çözümü.

### MEM-04 — Bundle tarafı temiz (pozitif tespit)
- **Kanıt:** Ağır editör (`@tiptap`) yalnızca `components/admin/RichTextEditor.tsx`'te — admin rotası chunk'ında; küratör panelleri `next/dynamic` ile mod açılınca iniyor (`components/book/BookHall.tsx:62-70`, `components/sport/SportCuratorSwitch.tsx:25`). 3.2 MB'lık `lib/characters/*-experience.ts` kütlesi rota başına bölünmüş; barrel patlaması yok (`lib/characters/index.ts` yalnızca 2 overlay taşıyor). Frontend'te `productionBrowserSourceMaps` açık değil (varsayılan kapalı).
- **Tek uyarı:** `app/[locale]/dark-stories/category/anime/karakterler/[characterId]/page.tsx:5` barrel importu — bugün 2 overlay ile zararsız; `lib/characters/index.ts:13`'teki `OVERLAYS` dizisi büyürse dinamik rotanın payload'ı onunla büyür.
- **Etki:** Low (izleme notu)

### MEM-05 — Dependency yoğunluğu
- **Kanıt:** `frontend/node_modules` 446 MB / `backend/node_modules` 491 MB (yerel ölçüm, dev dâhil). Frontend'in üretim bağımlılık listesi kısa ve yerinde (`frontend/package.json:16-29`); en ağır kalemler `sharp` (görsel optimizasyonu için gerekli) ve tiptap (admin). Backend'de ağırlık Prisma üretimi + Nest çekirdeği.
- **Etki:** Low — asıl sorun yoğunluğun kendisi değil, DCK-01'deki taşınması.

---

## 10 · Security & Production

### SEC-01 — Kök seviyede error boundary yok
- **Dosya (kanıt):** `app/` altında yalnızca 4 alt ağaçta `error.tsx` var: `app/[locale]/anime/error.tsx`, `app/[locale]/dark-stories/error.tsx`, `app/[locale]/muzik/error.tsx`, `app/[locale]/spor/error.tsx`. `app/[locale]/error.tsx` ve `app/global-error.tsx` YOK.
- **Problem:** Ana sayfa (`app/[locale]/page.tsx` — `force-dynamic`, 3 API çağrısı), `/anime` dışı karakter rotaları ve layout seviyesindeki bir hata, tasarlanmış bir hata ekranı yerine Next'in çıplak varsayılanına düşer.
- **Etki:** **Medium**
- **Çözüm:** Mevcut dört `error.tsx`'ten biri örnek alınarak `app/[locale]/error.tsx` (+ tercihen `app/global-error.tsx`) eklemek.
- **Getiri:** Arıza anında marka-uyumlu, iki dilli hata ekranı; çıplak stack ekranı riski kapanır.

### SEC-02 — Sessiz bozulma deseni: `catch { return boş }` + görünmez 429/5xx
- **Dosya:** `frontend/lib/api/books.ts:68-69, 86-87, 103-104, 116-117, 137-138, 154-155, 166-167` (ve `shows.ts:45-46`, `anime.ts:51-52`, `movies.ts:52-53`, `pulse.ts:44-45`, `curated-images.ts:68-69` — desen kütüphane geneli)
- **Problem:** Her API hatası sessizce boş raf/`null`'a çevriliyor ve **hiçbir yere loglanmıyor**. Bilinçli bir karar (deploy penceresi gerekçesi `curated-images.ts:28-31`'de; Ö-8 diye adlandırılmış, `/health` ucu telafi olarak yazılmış — `backend/src/app.controller.ts:23-29`). Ancak API-02'deki 429 senaryosuyla birleşince arıza sınıfı büyüyor: rate limit dolduğunda site "çalışıyor" görünür, raflar boşalır, iz kalmaz.
- **Etki:** **Medium**
- **Çözüm:** Deseni değiştirmeden tek ekleme: catch bloklarında `console.error` ile durum+path loglamak (SSR loglarına düşer, Coolify Logs'ta görünür). İkinci adım: `ApiError.status === 429`'u ayrıca saymak.
- **Getiri:** Ö-8 arızası sessiz olmaktan çıkar; canlı teşhis `docker logs`'tan yapılabilir hâle gelir.

### SEC-03 — Yapım kapısında sabit-zamanlı olmayan karşılaştırma
- **Dosya:** `frontend/middleware.ts` — **Satır:** 43-47
- **Problem:** Basic auth kullanıcı adı/parolası `===` ile karşılaştırılıyor (timing yan kanalı). Dosyanın kendi başlığı (satır 10-12) amacın güvenlik değil görünürlük olduğunu söylüyor; bu yüzden yalnızca kayıt düşülüyor.
- **Etki:** **Low**
- **Çözüm:** İstenirse `crypto.timingSafeEqual` (Edge runtime'da `crypto.subtle` türevi). Zorunlu değil.

### ~~SEC-04~~ — 15 MB'lık üretilmiş görsel seti depoda takipsiz → **KAPANDI (2 Eylül 2026 gecesi, kullanıcı kararı):** set `K:\KURONEXUS-uretim\jjk-2026-09-02\`e taşındı (README: yuva→dosya tablosu, lisans notu, küratör modundan yükleme adımları; skyline için 306 KB webp). Repoya commit edilmedi; görseller küratör modundan elle yüklenecek. Çalışma ağacı temiz.
- **Dosya:** `frontend/public/assets/jujutsu-kaisen/` (git durumu: `??`, 15 MB, `gorsel-manifest.json` + PNG'ler)
- **Problem:** Kod içinde bu yollara referans **yok** (ölçüldü: `assets/jujutsu-kaisen` dizgisi 0 eşleşme), yani bugün kırık bağlantı üretmiyor. Ama Coolify git'ten build aldığı için bu dosyalar commit edilmeden canlıya ÇIKMAZ; ileride bir sayfa bu yolları kullanırsa yerelde çalışıp canlıda 404 verir — fark edilmesi zor bir sınıf.
- **Etki:** **Low** (bugün); referans eklendiği gün High
- **Çözüm:** Kullanılacaklarsa commit; kullanılmayacaklarsa `K:\KURONEXUS-uretim\` altına taşımak (üretim yedekleri düzeni zaten orada).

### SEC-05 — Güvenlik günlüğü depoda (yalnızca kayıt)
- **Dosya:** `.gitignore` — **Satır:** 4-7 (açıklama bloğu) · `GUVENLIK-GUNLUGU.md` (depo kökü, takipte)
- **Problem:** Zayıf noktaların zaman çizelgesi bilinçli olarak private depoya alınmış; gerekçe ve "depo public yapılacaksa ÖNCE çıkarılmalı" şartı `.gitignore:4-7`'de yazılı. Bulgu değil, devir notu: bu şart depo görünürlüğü değişirse kritik hâle gelir.
- **Etki:** **Low** (koşullu)

### SEC-06 — Prisma bağlantı havuzu örtük
- **Dosya:** `backend/src/prisma/prisma.service.ts` — **Satır:** 12-16
- **Problem:** `PrismaPg` adapter'ına havuz boyutu verilmemiş; üretim `DATABASE_URL`'inde `connection_limit` olup olmadığı depodan görülemiyor. 3.7 GB'lık kutuda PG + iki uygulama yan yana; varsayılan havuz genelde güvenli ama **Belirsiz / Doğrulanamadı**.
- **Etki:** **Low**
- **Çözüm:** `max: 5-10` gibi açık bir değer; PG tarafındaki `max_connections` ile birlikte düşünülmeli.

### Kontrol listesi durumu (alan 10)

| Kontrol | Durum | Kanıt |
|---|---|---|
| Env kullanımı | ✅ Temiz | Frontend'te yalnızca 2 `NEXT_PUBLIC_*` (API_URL, SITE_URL); gizliler öneksiz (`middleware.ts:14-16` gerekçeli). Backend `JWT_SECRET` → `getOrThrow` (`auth.module.ts:13`) |
| Secret sızıntısı | ✅ Bulunamadı | Desen taraması 0 eşleşme; `.env`'ler git dışı (`git check-ignore` doğrulandı: `frontend/.gitignore:34`, `backend/.gitignore:35`) ve `.dockerignore`'da; `.env.example`'lar yalnızca yer tutucu |
| Debug kodu | ✅ Temiz | `console.log/debug/info`: uygulama kodunda 0; yalnızca `frontend/scripts/*` denetim betiklerinde (44 adet, build'e girmez). Dev-proxy üretimde 404 (`app/api/dev-proxy/[...path]/route.ts:18, 30`) |
| Error handling | ⚠️ SEC-01, SEC-02 | — |
| Metadata | ✅ Temiz | `metadataBase` (`app/[locale]/layout.tsx:315`), paylaşım kartı + canonical/hreflang tek kaynaktan (`lib/seo.ts:43-53`) |
| Sitemap | ✅ Var ve savunmalı | `app/sitemap.ts:21` saatlik; `allSettled` ile kısmi-arıza dayanıklı (satır 98-106); taşınan adres süzgeci (satır 108-127) |
| robots.txt | ✅ Var | `app/robots.ts:15-27` — admin iki dilde de kapalı, sitemap bildirimi doğru |
| Güvenlik başlıkları | ✅ Güçlü | CSP beyaz-liste + çalar karantinası (`next.config.ts:58-144, 213-236`); helmet + HSTS + CORS daraltması (`main.ts:58-84`); throttler + JWT + rol guard sırası (`app.module.ts:92-95`) |
| Broken link | ❓ **Doğrulanamadı** | Canlı tarama bu denetimin kapsamı dışında (statik analiz canlı 404'ü kanıtlayamaz). Bilinen son tarama: 22 Ağustos denetimi, 40 düzeltme. Statik tespit: bugün kırık referans üreten yol bulunamadı; tek koşullu risk SEC-04 |

---

## Production Readiness Puanı: **74 / 100**

| Kategori | Puan | Neden |
|---|---|---|
| Security & Production | 22 / 25 | En güçlü alan. Başlıklar, secret hijyeni, robots/sitemap/metadata, guard zinciri örnek seviyesinde. Kesinti: kök error boundary yok (SEC-01), sessiz bozulma gözlemlenemiyor (SEC-02) |
| Docker & Coolify | 18 / 25 | Multi-stage + standalone + fail-fast migration doğru kurulmuş; kesinti: üretim imajında devDependencies (DCK-01), frontend root (DCK-02), healthcheck bağlanmamış/doğrulanmamış (DCK-03), build-arg kapısı yok (DCK-04) |
| API & Database | 17 / 30 | **Puanı asıl düşüren alan.** İstek yolunda ölçekle büyüyen üç kök sorun: her şeyin `no-store`/`force-dynamic` olması (API-04/05), 25 sayfada çift fetch (API-03), tam-arşiv okuyan uçlar (API-06/07/08). Üstüne iki gizli bomba: timeout'suz SSR fetch (API-01) ve paylaşılan throttle kovası (API-02). Backend dış-istek disiplini ve cache başlıkları ise örnek seviyesinde |
| Build Memory | 17 / 20 | Bundle disiplini iyi (MEM-04); tek büyük risk ortamsal — tip kontrolü 3.7 GB'ın tepesinde ve bir build bu yüzden düştü (MEM-01). Hafifletme belgeli ama uygulanmamış |

**Genel değerlendirme:** Bu depo, karar gerekçelerinin ve ölçümlerin kod içinde belgelenmesi bakımından alışılmadık ölçüde olgun; güvenlik duruşu güçlü. Puanı düşüren şey hata değil **ölçek borcu**: küratör tazeliği için verilen "her şey taze" kararı (no-store + force-dynamic + cache()'siz getiriciler) bugün tek kullanıcılık trafikte görünmezken, trafik arttığında API-02 ile birleşip kendi kendini boğan bir sisteme dönüşür. İlk üç iş: API-02 (throttle muafiyeti), API-03 (`cache()` sarmalama, ~15 satır), API-01 (timeout, 1 satır) — üçü de küratör deneyimini hiç değiştirmeden uygulanabilir.

---

## Coolify Deploy Risk Değerlendirmesi: **MEDIUM**

**Neden HIGH değil:** Belgelenen üç büyük arıza sınıfı ölçülerek kapatılmış ve doğrulanmış: eşzamanlı çift build OOM'u (concurrent builds=1 + Watch Paths, `docs/deploy-duzeni.md` §3, doğrulama §7), rolling update takılması ve bölünmüş sürüm (Consistent Container Names, §10, ölçülmüş sonuç §10.5), migration'ın sessiz atlanması (fail-fast CMD, `backend/Dockerfile:64-76`). Deploy davranışı bugün öngörülebilir: sıcak deploy ~14 sn, soğuk ~4 dk (§8.8).

**Neden LOW değil:**
1. **RAM marjı ~sıfır.** Tek bir `next build` tip kontrolü makinenin tepesinde ve bir kez OOM ile düştü (§9.6, adım 8); hafifletme hazır ama uygulanmamış, swap ölçülmemiş (§6).
2. **Disk dolması tekrarlayan sınıf.** İki kez üretimi etkiledi (§9); zamanlanmış Docker temizliğinin açıldığı **doğrulanamadı** (§9.5 "kalıcı çözüm" olarak öneri hâlinde) ve DCK-01 her deploy'da diski gereksiz büyük imajlarla dolduruyor.
3. **Healthcheck zinciri eksik.** Backend healthcheck'in uygulandığı doğrulanmadı, frontend'inki kapalı (DCK-03) — "ayakta ama boş raflı" durum panelde görünmüyor.
4. **Tek makine, tam bağlaşım.** PG + iki uygulama + Coolify + Traefik aynı 3.7 GB'ta; herhangi bir bileşenin bellek tepesi OOM killer üzerinden komşusunu vurabiliyor (§2'de yaşanmış mekanizma).

Riski LOW'a indirecek en kısa yol: zamanlanmış Docker temizliğini açıp doğrulamak + DCK-01 + MEM-01'in swap/tsc kararını ölçüp uygulamak.

---

*Denetimi yürüten: Claude (Fable 5) · Parça 3/4 · Salt okuma — bu rapor dışında hiçbir dosya değiştirilmedi.*
