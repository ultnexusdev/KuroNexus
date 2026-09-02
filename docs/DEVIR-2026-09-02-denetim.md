# DEVİR NOTU — 2 Eylül 2026 · Denetim Uygulaması (1-2 Eylül)

> Bir önceki not: `docs/DEVIR-2026-08-24-karakter-sayfalari-2.md`. Bu not
> ondan bağımsız: 1 Eylül'de yapılan dört parçalık denetimin
> (`docs/audit/0*-2026-09-01.md`) iki günlük uygulamasını devrediyor.
> **Bulgu bazında durum tablosu** `docs/audit/00-sentez-ve-oncelik-2026-09-01.md`
> §0'da — bu not onu tekrar etmez, "nereden devam edilir"i anlatır.

---

## 0 · YENİ OTURUMDA İLK İŞ

1. **Canlıyı doğrula** — hepsi 200 dönmeli (`-L` şart: `/tr` → `/` 307 atıyor):
   ```bash
   for u in /tr /tr/dark-stories/category/kitap/arsiv /tr/dark-stories/category/film/arsiv /tr/dark-stories/category/anime/arsiv /tr/dark-stories/category/kitap/korluk /en/muzik/the-weeknd/after-hours-2020; do printf "%-52s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' -L -m 15 "https://kuronexus.com$u")"; done; curl -s https://api.kuronexus.com/health
   ```
   Beklenen son satır: `{"status":"ok","db":"up"}`.
2. **Sunucu sağlığı** — SSH (`root@ultnexus-prod`), komutlar `|` içerir, SSH'ta sorun yok:
   ```bash
   df -h /; free -h; docker ps --format "{{.Names}}\t{{.Status}}" | grep -E "xpvhr95|qy5pum"
   ```
   Disk **%85 üstündeyse push ETME** (§4.1). Backend satırında `(healthy)` görünmeli.
3. ~~Yarınki İLK deploy MEM-01'in soğuk-build sınavıdır~~ → **ÖLÇÜLDÜ, GEÇTİ
   (2 Eylül 16:00–16:14 UTC).** Push'tan hemen önce `docker builder prune -af`
   koşmuştu (cache sıfır) ve `frontend/package.json` değişmişti (kurulum katmanı
   soğuk): backend 4m41s, frontend push→canlı **5 dk 11 sn** (16:08:44 →
   16:13:55, parça imzası değişimiyle ölçüldü). Bu iki koşul en kötü senaryo;
   MEM-01 kapalı, §4.2'deki "sıradaki kaldıraç" gerekmiyor. Deploy sırasında
   site ve API kesintisiz 200 döndü. Disk push öncesi %90 → temizlikle %78.
4. **Geri dönüş noktası**

| Etiket | Nereye döner |
| --- | --- |
| `yedek-denetim-oncesi-2026-09-01` | Denetim uygulamasından ÖNCE (`83870ff`, B-06 sonrası) |

`main`'in tamamı canlıda ve doğrulanmış; pushlanmamış commit yok. Tek takipsiz
şey: `frontend/public/assets/jujutsu-kaisen/` (15 MB, karar §3.2).

---

## 1 · BU İKİ GÜNDE NE OLDU (özet)

**Denetim:** dört parça (kod yapısı, runtime/UX, deploy/production, sentez).
**Uygulama:** ~35 commit, hepsi canlıda tek tek doğrulandı.

| Sınıf | Kapanan |
|---|---|
| Critical | 2/2 — CORS fail-open (`a73ee56`), compose varsayılan parolası (`fa27e5c`) |
| High | 16 — env kapısı (H-B4), devDeps'siz imaj (DCK-01), SSR timeout/throttle/cache() (API-01/02/03), ödül uçları (API-06), ISR (API-04/05), MEM-01, SSRF klonu (D-B2), slug (D-B5), normalizeUrl (D-B6), getHall ×22 (D-F4), filtre ikizi (D-F1), detay ikizleri (D-F3), suggestions (D-B1), süre i18n (H-F1), kitap rotaları (H-F3 kitap ayağı) |
| Medium/Low | SEC-01/02, DCK-02/03/04, API-10, D-B8, D-F6/D-F8, H-F2/H-F4, P-09/P-11 |
| Sunucu/panel | Disk temizliği + zamanlanmış temizlik (03:00), backend healthcheck `(healthy)`, journald tavanı 200M, UltNexus'un internete açık Postgres portu kapatıldı |

Ölçülebilir sonuç: ~1.800 satır tekrar silindi, **62 yeni test** (öncesinde 0),
backend imajı 996 → 842 MB, `/books` gibi 558 KB'lık yanıtlar artık ziyaretçiye
Data Cache'ten, deploy 15 dk → 4 dk.

**İki üretim krizi yaşandı, ikisi de belgelendi:**
- 1 Eylül akşamı: 12 ardışık deploy diski %100'e çıkardı → Postgres PANIC döngüsü
  (~40 dk kesinti). Reçete: `deploy-duzeni.md` §9.5 + hafıza.
- 2 Eylül: günün ilk (soğuk) deploy'u 15 dk sürdü, kutu swap'a düştü, site 504.
  Çözüm uygulandı ve sıcak build'de ölçüldü (4 dk); soğukta yarın ölçülecek.

---

## 2 · MİMARİ DEĞİŞİKLİKLER — yeni kod yazarken uyulacak sözleşmeler

### 2.1 Tazelik: `fresh` deseni (API-04/05, `c005f26`)
- Tek kaynak `lib/api/freshness.ts`: `freshness(fresh)` → küratör `no-store`,
  ziyaretçi `revalidate: 300`.
- **Küratör yüzeyi taşıyan HER sayfa:** `const isAdmin = await readIsAdmin();`
  Promise.all'dan ÖNCE, sonra getiriciye `isAdmin` geçir. Geçirmezsen küratör
  "kaydettim ama gelmedi" görür (music.ts, 11 Ağustos ölçümü). Ziyaretçi için
  sıralama bedava — çerez yoksa `readIsAdmin` ağa çıkmıyor.
- `cache()` sarmalayıcıları `fresh === true` ile normalize: `undefined`/`false`
  ayrı anahtar olurdu, API-03 dedupe'u kaybolurdu.
- **Bilerek dışarıda:** `getBookPerson`, ödül rafları, okuma sıraları (ziyaretçiye
  dönük gecikmeli doldurma; `pending` döngüsü önbellekle kilitlenir),
  curated-images, spor görselleri. `force-dynamic` bildirimlerine dokunulmadı.

### 2.2 Ortaklaşan hatlar (kopyalama, buradan al)
| Ne | Nerede | Not |
|---|---|---|
| Salon numarası/adı | `lib/halls.ts` → `getHall`, `getHallLabel` | 22 kopya buraya indi |
| Raf süzgeçleri | `lib/archive/filters.ts` (jenerik) | film/dizi yeniden dışa aktarıyor; kitabın `SORT_KEYS`'i ayrı |
| Kitap rotaları | `lib/book/routes.ts` | `BOOK_HALL_HREF` ≠ `BOOK_ARCHIVE_HREF` — eski `KITAP_HREF` iki değerdeydi |
| Fragman/kadro | `components/media/{Trailer,CastCard}` + `Media.module.css` | metinler prop, tip yapısal |
| `formatDate/languageName/today/initials` | `lib/format.ts` | BookHall'un sözlük tabanlı `languageName`'i bilerek ayrı |
| YouTube adresleri | `lib/youtube.ts` | CSP ile senkron tek yer |
| `tmdbImage` | `lib/api/tmdb.ts` | movies/shows yeniden dışa aktarıyor |
| Backend: JSON daraltma | `common/prisma/json-projection.ts` → `projectedColumns`, `attachChildren`; kanat başına `readArchiveEntries` + `ARCHIVE_JSON_KEYS` | liste sorgusu `externalData`'dan yeni alan okuyacaksa anahtarı listeye ekle; sütun listesi `ScalarFieldEnum`'dan gelir, elle yazma |
| Backend: env kapısı | `common/env.validation.ts` | üretimde `CORS_ORIGIN` zorunlu; eksik özellik anahtarı yalnız uyarır |
| Backend: throttle | `common/guards/app-throttler.guard.ts` | iç ağ (XFF yok + özel IP) muaf |
| Backend: SSRF indirici | `common/media/image-downloader.ts` | beş katman, 11 test |
| Backend: slug | `common/utils/unique-slug.ts` (callback'li), `books/archive-slug.ts` | ikisi de testli |
| Backend: küçükler | `common/utils/{normalize-url,sleep,slugify(slugKey,TURKISH_CHAR_MAP)}.ts`, `common/tmdb/suggestion-mixer.ts` | |

### 2.3 Deploy sözleşmeleri
- Backend imajında **curl var** (`00714ef`) — healthcheck onu istiyor; silme.
- Frontend Docker build'inde tip/lint kontrolü **kapalı** (`isDockerBuild`),
  `NODE_OPTIONS=--max-old-space-size=2048`. Bu yüzden push öncesi yerelde
  `tsc --noEmit` + `eslint` + `check:i18n` + `check:karakter` **zorunlu**.
- `NEXT_PUBLIC_API_URL` boşsa build düşer (kapı).
- Frontend konteyneri `USER node`; `.next/cache` node'a devredilmiş.

---

## 3 · AÇIK İŞLER

### 3.1 Sıradaki adaylar (öneri sırasıyla)
1. ~~Dependabot 26 açık~~ → **YAPILDI, 2 Eylül akşamı, iki commit halinde
   (backend + frontend ayrı — Watch Paths tek push'ta iki build açmasın diye).**
   Ayrıntı sentez §0 son madde. **Push sırası:** `df -h /` → önce backend
   commit'i (`git push origin <sha>:main`, ~5 dk) → canlı `/health` → sonra
   frontend commit'i. ⚠️ `frontend/package.json` değişti: kurulum katmanı soğuk,
   MEM-01 sonrası ilk ölçüm bu — 10+ dk normal, 504 görürsen §4.2.
   Yerelde `pnpm audit` yeniden koşturmak için: `npx pnpm@11 audit` (pnpm PATH'te
   yok, yerel node_modules pnpm 11 ile kurulu; Docker pnpm 10 aynı lockfile
   biçimini okuyor).
2. ~~API-08~~ → **YAPILDI (2 Eylül gecesi), JSON projeksiyonu, migration yok.**
   Ayrıntı sentez §0. Yeni sözleşme (§2.2'ye eklendi): liste sorgusu yazarken
   `externalData` okuyan mapper'ın anahtarlarını `ARCHIVE_JSON_KEYS`e ekle —
   eklemezsen alan sessizce `null` gelir (`satisfies keyof …` yalnız yazımı
   denetler, eksikliği değil). Entegrasyon testi yerel PG ister:
   `prisma db push --url <test-db>` → `TEST_DATABASE_URL=<test-db> pnpm test
   archive-readers`; iş bitince `DROP DATABASE`. Son açık kod High'ı buydu.
3. **D-F2** FilmCurator↔ShowCurator (~450 satır, %89 aynı) — küratör akışı
   yalnız canlıda gerçek girişle sınanır; kullanıcıyla birlikte.

### 3.2 Kullanıcı kararı bekleyenler
- **F-4** öksüz `/spor/futbol/oyuncu/[playerId]`: link ver ya da 301 ile emekli et.
- **H-F6** `anime/naruto/page.tsx` hiç çeviri kullanmıyor (sanatsal metin):
  bleach desenine hizala ya da bilinçli istisna olarak belgele.
- **`frontend/public/assets/jujutsu-kaisen/`** (15 MB, takipsiz, kodda referans
  yok): commit mi, `K:\KURONEXUS-uretim\`e mi taşınsın?
- **Küratör sınavı** (2 dk): giriş → kayıt değiştir → yenile → anında görünmeli.
  2 Eylül akşamı sonucu bildirilmedi.

### 3.3 ~~Backend'de önceden düşen 6 test paketi~~ → KAPANDI (2 Eylül gecesi)
`pnpm test` artık **20/20 paket yeşil** (entegrasyon paketi `TEST_DATABASE_URL`
yoksa atlanır). İki sebep, iki düzeltme:
- Kitap ×4 (`htmlparser2@12` yalnız-ESM) ve Prisma 7 istemcisinin iç dinamik
  import'u aynı ilacı istiyordu: `test` betiği artık
  `node --experimental-vm-modules node_modules/jest/bin/jest.js`
  (`NODE_OPTIONS=` biçimi Windows'ta pnpm altında güvenilir değil).
  `npx jest` doğrudan koşturursan bayrağı sen ver.
- Kategori ×2: iskelet testlerine boş `PrismaService`/`CategoriesService`
  taklidi verildi.

### 3.4 Medium/Low kümesi (sentez §0'da tam liste)
B-04 `lib/admin/api.ts` bölünmesi (44 importer), D-B4 movies↔shows kalan
ikizler (TMDB istemci soyutlaması ister), H-F3 film/dizi/anime rota literalleri,
API-07/09/11/12/13, D-B7 `externalCache` (22 nokta; "fetchedAt eksik" YANLIŞ
ALARM), i18n ölü anahtarlar (15×2), ölü exportlar (GOJO_* hariç — dal açık),
`music-playlist`/`music-sync` slug varyantları, P-04/05/10 animasyon hijyeni
(tasarımı değiştirir — kullanıcıyla).

---

## 4 · ÖLÇÜLMÜŞ TUZAKLAR (bu iki günde yaşananlar)

### 4.1 Disk: ard arda push YOK
12 deploy → %100 → Postgres `PANIC: could not write ... No space left on device`
→ reinitializing döngüsü. **Deploy öncesi `df -h /`.** Yanıltıcı işaret: ana
sayfa DOLU görünür (`/pulse` 300 sn önbellekli), arşivler boşalır. Temizlik
reçetesi ve güvenli imaj silme komutu: `deploy-duzeni.md` §9.5, hafıza
`deploy-iki-build-rami-bitiriyor`.

### 4.2 RAM: günün ilk deploy'u soğuk
Temizlik 03:00'te cache'i süpürüyor → ilk build soğuk → tip-kontrol tepesi
3.7 GB'ı aşıp swap'a düşürüyor → panel + site (504) boğuluyor, konteyner
ayakta. Çözüm `7861c41` (sıcakta 4 dk ölçüldü). Soğukta yine 10+ dk sürerse:
CX33 büyütme ya da build'i dışarıda alıp hazır imaj çekmek.

### 4.3 Healthcheck: Coolify HTTP tipini bile konteyner İÇİNDEN curl'le atıyor
İlk deneme "needs curl or wget" ile düştü, rollback çalıştı (site düşmedi).
`node:*-slim`e curl eklendi. §8.7'deki "HTTP tipi imajsız çalışır" varsayımı
yanlıştı — düzeltildi.

### 4.4 `git stash` KULLANMA
Depoda `stash@{0}: gojo: yarim kalan yeniden yazim` duruyor; argümansız
`git stash pop` onu açıyor (yaşandı, kurtarıldı). O stash'in `characters.ts`i
üretimde de çalışan bir "DEV MODE mock" bloğu taşıyor — açılırsa ayıklanmalı.

### 4.5 Betikle toplu dönüşüm
JSDoc-kesme regex'i dosyanın ilk `/**`'ından itibaren her şeyi yuttu (20 dosya,
419 satır — commit'lenmeden geri alındı). Kural: dosya başına değişim boyutu
şartı + tek blok şartı koy; tutmazsa dokunma. CRLF: regex'te `\r?\n`.

### 4.6 Küçükler
`/tr` → `/` 307 (yoklamada `-L`); `docker inspect` env dökme (`DATABASE_URL`
sızar — `printenv` ile seçili değişken); PowerShell tek tırnak `deploy'u`
kelimesinde kırılır (Edit aracı kullan); `docker system df` bu sunucuda
bozuk (`du -xh --max-depth=2 /var` + `docker buildx du` kullan).

---

## 5 · DOSYA HARİTASI (bu iki günde eklenen)

```
backend/src/common/env.validation.ts (+spec)      boot kapısı
backend/src/common/duration.ts (+spec)            JWT süre parser
backend/src/common/guards/app-throttler.guard.ts  iç ağ muafiyeti (+spec)
backend/src/common/media/image-downloader.ts      SSRF hattı (+spec)
backend/src/common/utils/{normalize-url,unique-slug,sleep}.ts (+spec'ler)
backend/src/common/tmdb/suggestion-mixer.ts (+spec)
backend/src/books/archive-slug.ts (+spec)
frontend/lib/api/freshness.ts                     tazelik tek kaynağı
frontend/lib/api/tmdb.ts · lib/archive/filters.ts · lib/format.ts · lib/youtube.ts
frontend/lib/book/routes.ts (genişledi) · lib/halls.ts (getHall eklendi)
frontend/components/media/{Trailer,CastCard}.tsx + Media.module.css
frontend/app/[locale]/error.tsx                   kök hata sınırı
docs/audit/0{0,1,2,3}-*-2026-09-01.md             denetim + sentez (§0 durum)
```

---

## 6 · REDDEDİLEN / BİLİNÇLİ ATLANAN (tekrar önerilmesin)
- **D-F7 shelves fabrikası:** ortak kısım 6 satır, gövde kanada özgü ve belgeli — soyutlama zarar.
- **`gs-official.slugify` gövdesi:** kanonik `slugify`'dan farklı (NFKD/kesme yok); "Häcken" farklı anahtar üretir → yalnız `TURKISH_CHAR_MAP` ortaklaştı.
- **`findByIdOrFail` ×4:** farklı tablo + farklı i18n anahtarı; jenerikleştirme tip cambazlığına değmez.
- **`docker image prune -a`:** Coolify yardımcı imajlarını da süpürür — çalışanları hariç tutan `docker rmi` zinciri kullan (§4.1 reçetesi).
- **API-12:** gerekçesi (kova tüketimi) API-02 ile ortadan kalktı.
- **D-B7 "fetchedAt eksik":** şemada `@default(now())` var — yanlış alarm.
