# KuroNexus — Denetim Sentezi ve Öncelik Sırası · Parça 4/4

**Tarih:** 2026-09-01 · **Girdiler:** `01-kod-yapisi-2026-09-01.md` (Parça 1), `02-runtime-ux-2026-09-01.md` (Parça 2), `03-deploy-production-2026-09-01.md` (Parça 3)
**Mod:** Yalnızca sentez — bu belge yeni analiz içermez; her madde üç rapordan birinin bulgu kimliğine (F-*, D-*, H-*, R*, P-*, M-*, B-*, API-*, DCK-*, MEM-*, SEC-*) dayanır.

**Durum notu (sentez anındaki gerçek):** Parça 2'nin öncelik 1–7 maddeleri denetimle aynı gün **düzeltilip pushlandı** (`cd5ebf0`), `.deprecated` seti de silindi (`83870ff`). Bu belge o düzeltmeleri "kapandı" sayar; sayımlarda hem tespit hem açık-kalan sütunu verilir.

---

## 0 · UYGULAMA DURUMU (1 Eylül 2026, denetimle aynı gün)

Sentez yazıldıktan sonra Kademe 1 ve Kademe 2 aynı gün uygulandı. Kapananlar:

| Bulgu | Commit | Not |
|---|---|---|
| **Disk krizi** (planın önüne geçti) | — (sunucuda) | Disk %95 / 2.2 GB boş bulundu; builder cache (3.45 GB) + journald (1.2 GB) + eski deploy imajları (1.2 GB) → **%78 / 8 GB boş**. Ölçüldü: disk ~400 MB/gün büyüyor, yani bu iş periyodik. |
| **İnternete açık Postgres** (raporlarda yok) | — (panelden) | `0.0.0.0:5432` yayını UltNexus'un DB'sindeydi (KuroNexus'unki zaten kapalıydı); kapatıldı, doğrulandı. |
| **MEM-01** kısmen | — | "swap ölçülmedi" belirsizliği kapandı: **4 GB swap var**. Ama makine durağan hâlde 2 GB kullanıyor, `available` ~549 MB — marj hâlâ dar. |
| **H-B1** (Critical) + **H-B4** (3×High) | `a73ee56` | CORS fail-open kapatıldı, `ConfigModule`'e `validate` kapısı, çerez ömrü `JWT_EXPIRES_IN`'den türetiliyor, upload sınırı eşitlendi, `.env.example`'a eksik 13 değişken. 13 test. |
| **DCK-01** (High) | `bd0e084` | `prisma`+`dotenv` → `dependencies`, build'de `pnpm prune --prod`. Prune'un doğruluğu build sırasında kanıtlanıyor (`prisma --version` + `require('dotenv')`). |
| **API-01, API-02, API-03** (3×High) + **SEC-02** | `5b31565` | SSR timeout (10 sn), iç ağ throttle muafiyeti (7 test), 24 getirici `cache()` ile sarıldı, API hataları artık loglanıyor. |
| **SEC-01** + **DCK-04** | `0fc068d` | Kök `error.tsx` (+ `pageState.error.home` iki dilde), `NEXT_PUBLIC_API_URL` build kapısı. |
| **API-06** (High) + **API-10** | `8543cd4` | Ödül/okuma-sırası uçları artık `getArchive()` değil ince `getArchiveIndex()` okuyor; slug kuralı `deriveArchiveSlug`'da tekleşti (7 test). Ödül cache'i tek sorguya indi. **Canlı doğrulandı:** ödül rozeti `korluk` slug'ını üretti ve o slug doğru kitap sayfasını açtı — iki yol aynı slug'ı üretiyor. |
| **DCK-02** | `58ccfb1` | Frontend konteyneri artık root değil; `next/image` önbelleği `node`'a devredildi. Canlı doğrulandı: `/_next/image` isteği `image/jpeg` döndürüyor, izin hatası yok. |
| **H-B2** (Critical) | `fa27e5c` | Compose'da varsayılan PG parolası kaldırıldı (`:?` ile zorunlu), port `127.0.0.1`'e bağlandı. |
| **D-B6** (High) | `58a1c7c` | `normalizeUrl`'ün dört kopyasından yalnız anime'dekinde olan düzeltme ortaklaştırıldı. Diğer üçü `/uploads/kapak.jpg` gibi yerel yolları `https:///uploads/...`e çevirip **kırıyordu** — bakım borcu değil, aktif hataydı. 5 test. |
| **H-F1** (High) | `d4ad372` | Süre etiketi i18n'e taşındı; beş sayfadaki gömülü `sa`/`dk` metni sözlüğe alındı. Dinleme sayfasının kompakt biçimi (belgelenmiş tasarım kararı) korundu, yalnız harfleri çevrildi. **Canlı doğrulandı:** aynı albüm EN'de "Length — 56 min", TR'de "Süre — 56 dk". |
| **D-B2** (High) | `2e0f927` | SSRF indirici klonu (268×2 satır) `common/media/image-downloader.ts`'te tekleşti. Kopyayken hiç testi yoktu; 11 test eklendi — en önemlisi sonek tuzağı (`archive.org.evil.com` reddediliyor) ve uzantının adresten değil içerik imzasından seçilmesi. Davranış değişikliği yok. |
| **D-B5** (High) | `9f532d1` | `buildUniqueSlug` dört serviste tekleşti. **İki gerçek sapma düzeltildi:** categories sayacı 1'den başlıyordu (ötekiler 2) ve yedek adı olmadığı için boş slug kaydedebiliyordu. Dördünde de eksik olan sonsuz-döngü koruması eklendi (200 deneme + zaman damgası). 6 test. |

**Canlı doğrulama:** `/health` → `{"status":"ok","db":"up"}`; ana sayfa, kitap ve film salonları dolu (418 film, 253 kitap) — boş raf sınıfı yok. Watch Paths'in çalıştığı da ölçüldü: iki servis farklı commit'lerde olabiliyor ve bu arıza değil.

**Bu belgenin geri kalanı denetim anındaki durumu anlatır** — yukarıdaki maddeler artık kapalıdır.

**Kapanış durumu:** İki Critical'ın **ikisi de** kapandı. Parça 3'ün (deploy/production) yedi High'ından altısı kapandı — açık kalan tek High **API-08**. Parça 2'nin dört High'ı zaten `cd5ebf0` ile kapanmıştı. Parça 1'in kalan High'ları (duplicate ve yapı borcu: D-B1/D-B2/D-B5/D-B6/D-B7, D-F1–D-F4, H-F1, H-F3, F-4) henüz açık — bunlar üretimi düşürmüyor, sessiz ayrışma üretiyor.

**Sıradaki açık işler:**
- **API-08** (High) — film/dizi/anime/pulse uçları `externalData`'yı budamadan çekiyor. ⚠️ Kitaptaki `ARCHIVE_OMIT` çözümü BURADA İŞE YARAMAZ: kitap `externalData`'yı hiç okumuyordu, bu üç kanat ise ondan 10 alan okuyor. JSON projeksiyonu (raw SQL) ya da alanları sütuna terfi (migration) gerekir.
- **API-04/05** (Medium) — ISR geçişi. ⚠️ Ürün kararı: ziyaretçi 60–300 sn eski veri görür. Küratör tazeliği `isAdmin` yolunda korunabilir (`pulse.ts`'teki `fresh` deseni), ama kullanıcı onayı alınmadan uygulanmadı.
- **Kademe 3–4'ten kalanlar** (Parça 1) — `externalCache` kalıbı 22 noktada, biri `fetchedAt` eksik (D-B7); `suggestions()` movies↔shows (D-B1); frontend duplicate dörtlüsü (D-F1–D-F4, ~1.100 satır); rota literalleri + **çelişen `KITAP_HREF`** (H-F3); öksüz oyuncu sayfası (F-4, karar gerektirir). Ayrıca `music-playlist` ve `music-sync`'teki iki `buildUniqueSlug` varyantı kendi imzalarıyla duruyor — aynı hatta çekilebilir ama sözleşmeleri farklı.
- **Panel işleri (kullanıcıda):** DCK-03 healthcheck, Coolify zamanlanmış Docker temizliği, journald üst sınırı — sonuncusu olmadan disk ~16 günde yine dolar.
- **Kapsam dışı:** 26 Dependabot açığı (16 high).

---

## 1 · Genel sağlık tablosu

| Ölçüt | Değer | Kaynak | Not |
|---|---|---|---|
| **Mobil uyumluluk** | **87 / 100** | Parça 2 §7.3 | Ölçüm, düzeltmeler ÖNCESİNE ait. Puanı kıran kalemlerin en ağırları (R-01 −5; R-02/R-04, RP-01, RC-01/02/04, RP-04 gruplarının çoğu) `cd5ebf0` ile kapandı — yeniden ölçülmedi, ama açık kalan responsive bulgular yalnızca Medium/Low. |
| **Production readiness** | **74 / 100** | Parça 3 | Puanı düşüren alan API & Database (17/30): no-store + force-dynamic + cache()'siz getiriciler = ölçek borcu. Security & Production 22/25 ile en güçlü alan. |
| **Coolify deploy riski** | **MEDIUM** | Parça 3 | HIGH değil çünkü üç büyük arıza sınıfı ölçülüp kapatılmış (çift build, rolling update, migration fail-fast). LOW değil çünkü: RAM marjı ~sıfır (bir build OOM'la düştü), disk dolması iki kez üretim arızası çıkardı, healthcheck zinciri doğrulanmadı, tek makinede tam bağlaşım. |
| Kod yapısı (Parça 1, puansız) | ~12.100 ölü satır (silindi ✅), backend'de sistemik movies↔shows ikizliği, 2 Critical config bulgusu | Parça 1 | İki dil sözlüğü tam senkron (2.523 anahtar, 0 eksik); JWT fallback yok; `.env` sızıntısı yok — hijyen tabanı yüksek. |

Üç raporun ortak teşhisi: **kod disiplini ortalamanın belirgin üstünde** (karar gerekçeleri kodda belgeli, güvenlik duruşu güçlü, leak tablosu istisnai temiz); zayıf halka **ölçek ve ortam** — "her şey taze" mimarisi + 3.7 GB / 2 çekirdeklik tek makine.

---

## 2 · Önceliklendirilmiş yapılacaklar (tüm Critical/High — deploy'u çökertme riski en üstte)

### Kademe 0 — Zaten kapandı (sayım için)

`cd1: cd5ebf0` + `cd2: 83870ff` ile: **B-02** (i18n payload, High), **P-02** (küratör editörleri dynamic, High), **R-01/R-02** (müzik şeridi + 44px, High/Medium), **P-01** (Getou blur, High), **RP-01** (Kadim taşma, Medium), **RC-01/RC-02/RC-04 + RP-04** (grid sertleştirme), **R-04/R-05** (hap çakışması/safe-area), **M-01** (LineupCurator iptal), **B-06 = F-1** (`.deprecated` silindi). Parça 2'nin dört High bulgusunun **dördü de kapalı**.

### Kademe 1 — Deploy'u/üretimi fiilen çökertebilecekler (önce bunlar)

1. **MEM-01 · Build RAM tepesi** (Parça 3, High) — swap'ı ölç, yoksa 2 GB ekle; build yine `Linting and checking validity of types` satırında düşerse `docs/deploy-duzeni.md` §9.6.1'deki hazır çözümü uygula; `NODE_OPTIONS=--max-old-space-size` ile tavanı bilinçli sınırla. *Neden ilk sıra:* tek `next build` makinenin belgelenmiş tepesinde, bir deploy bu yüzden düştü ve OOM killer çalışan servisleri vurabiliyor (yaşanmış mekanizma); iki commit'in art arda push'unda çift deploy penceresi hâlâ açık iş.
2. **DCK-01 · Üretim imajında devDependencies** (Parça 3, High) — `prisma` + `dotenv`'i `dependencies`'e taşı, deploy aşamasından önce `pnpm prune --prod`. *Neden:* disk dolması bu sunucuda **iki kez** üretim arızası çıkardı; her deploy diski ~250-350 MB gereksiz büyütüyor. Eşlik: zamanlanmış Docker temizliğinin açıldığını panelden doğrula (§9.5 — riski MEDIUM'dan LOW'a indiren en kısa yolun parçası).
3. **H-B1 · CORS fail-open + H-B4 · env şema doğrulaması** (Parça 1, Critical + 3×High) — tek hamle: `ConfigModule`'e `validate` fonksiyonu; üretimde `CORS_ORIGIN` boşsa boot'ta hata (fallback `true` olmasın). Aynı şema, H-B4'ün diğer iki High'ını da kapatır: çerez ömrünü `JWT_EXPIRES_IN`'den türet, upload sınırı varsayılanını `.env.example` ile eşitle. *Neden Critical:* deploy'da tek unutulmuş env, oturum çerezini her origin'e açar — bugün aktif bir açık değil, "tek env" mesafesinde bir tuzak.
4. **H-B2 · compose'da varsayılan PG parolası + host'a açık port** (Parça 1 Critical; Parça 3'te DCK-07 olarak Low — dev kapsamı gerekçesiyle) — varsayılanı kaldır, binding'i `127.0.0.1:5432:5432` yap. *Uzlaştırma:* dosya dev amaçlı olduğu için günlük risk düşük; ama sunucuda yanlışlıkla koşturulursa PG internete varsayılan parolayla açılır ve düzeltme bir satır — ucuz sigorta, Kademe 1'de kalır.

### Kademe 2 — Trafik altında kendini boğan sistem (üretim kararlılığı)

5. **API-01 · SSR fetch timeout'u** (High) — `apiFetch`'e `AbortSignal.timeout(10_000)` (1 satır). Backend asılırsa 120 `force-dynamic` sayfanın render'ı kilitleniyor; backend'in kendi 21 dış çağrısının tamamı timeout'lu, aynı disiplin ön yüze gelmeli.
6. **API-02 · Paylaşılan throttle kovası** (High) — SSR isteklerini iç-ağ muafiyetine al (özel `getTracker`/`skipIf` ya da gizli başlık). Bütün ziyaretçilerin SSR'ı tek IP kovasında; dakikada ~20-30 sayfada 429 başlıyor ve `catch { return [] }` bunu **sessiz boş rafa** (bilinen Ö-8 sınıfı) çeviriyor. Parça 1'in "throttle env'e alınsın" notu (H-B5, Low) bu işin şemsiyesine girer — Parça 3'ün açısı esastır.
7. **API-03 · 25 sayfada çift fetch** (High) — getiricileri React `cache()` ile sar (~15 dosyada birer satır; desen `curated-images.ts:61`'de hazır). Backend istek sayısı yarıya iner, 6. maddedeki kovayı iki kat geç doldurur.
8. **API-06 + API-08 · Tam-arşiv okuyan / budanmamış uçlar** (2×High) — ödül/okuma-sırası uçlarına ince "arşiv dizini" sorgusu; film/dizi/anime/pulse'a kitaptaki `ARCHIVE_OMIT` emsalinin karşılığı. Devamı (Medium ama kök çözüm): **API-04/05** — arşiv getiricilerine `pulse.ts`'teki `fresh` deseniyle ziyaretçi önbelleği; bu oturunca `force-dynamic`'lerin gerekçesi de gözden geçirilir (MEM-03'ün çözümü de bu).
   *Kademeye eşlik eden deploy-görünürlük Medium'ları:* **DCK-03** (healthcheck'i panelden doğrula/aç — "ayakta ama boş raflı" durum görünür olsun), **DCK-04** (build-arg kapısı: `NEXT_PUBLIC_API_URL` boşsa build düşsün), **SEC-02** (catch bloklarına `console.error` — Ö-8 sessizlikten çıksın), **SEC-01** (`app/[locale]/error.tsx`).

### Kademe 3 — Güvenlik bakım hattı (High; çökertmez ama yama kaybettirir)

9. **D-B2 · SSRF indirici klonu** — `BookCoverService` ≡ `MusicArtworkService` (268'er satır, `isAllowedHost` birebir): `createImageDownloader` fabrikasında tekleştir. Güvenlik bileşeninde yamanın tek kopyaya gitme riski gerçek.
10. **D-B6 · `normalizeUrl` düzeltme kaybı** — anime'deki `/uploads/...` koruması diğer üç kopyaya taşınmamış; anime sürümünü `common/utils`'e al, üç tanımı sil (potansiyel aktif hata).
11. **H-B3 · Apify token'ı URL query'sinde** (Medium ama aynı hat) — `Authorization: Bearer` başlığına taşı.

### Kademe 4 — Davranış birliği ve yapı borcu (High; üretimi düşürmez, sessiz ayrışma üretir)

12. **D-B5 · `buildUniqueSlug` 6 yeniden yazım, 4 farklı davranış** — URL sözleşmesinin kalbi; `common/utils/unique-slug.ts`'te tekleştir (music-sync'teki callback'li imza esas).
13. **D-B7 · `externalCache` kalıbı 22 noktada** (birinde `fetchedAt` eksik — sessiz sapma) — `external-cache.service.ts` soyutlaması.
14. **D-B1 · `suggestions()` movies↔shows ~100 satır birebir** — `suggestion-mixer.ts` + test edilebilir `interleave()`.
15. **H-F1 · "sa/dk" süre etiketi 5 sayfada gömülü** — EN sayfalarda Türkçe görünüyor; `music.duration` anahtarı + tek format yardımcısı (D-F8 ile birlikte).
16. **H-F3 · Rota literalleri + çelişen `KITAP_HREF`** — aynı adlı sabit iki farklı değerde; film/show routes modülleri yok, `/dark-stories` 154 dosyada literal. Önce `KITAP_HREF` tekleştir, sonra routes modülleri.
17. **F-4 · Öksüz oyuncu sayfası** (`/spor/futbol/oyuncu/[playerId]`) — karar gerektirir: kadrodan yeniden link ver ya da emekli edip 301 at. (CSS'inin 20/36 class'ı zaten ölü; API-03'ün çift-fetch listesinde de aynı sayfa var — karar iki raporu birden kapatır.)
18. **D-F1–D-F4 · Frontend duplicate dörtlüsü** — en mekaniği D-F4 (`getHall` ×22 → `lib/halls.ts`, ~290 satır); sonra D-F1 (filters), D-F2 (TmdbCuratorBar), D-F3 (`components/media/` parçaları). Toplam ~1.100+ satır.

### Sıraya girmeyen ama kayıtta duran Medium/Low kümeleri

Parça 2 kalanları: P-04/P-05/P-10 (animasyon hijyeni — kullanıcıya ertelenmiş iş olarak zaten notlu), P-03 (GlobalAmbientPlayer), B-04 (admin API bölünmesi), B-05 (salon verisi server'a), M-02–M-07 (küçük cleanup'lar), R-03/R-06–R-10, RC-03/RC-05, RP-02/RP-03/RP-05–07. Parça 1 kalanları: ölü export/CSS/i18n temizlikleri (1.2–1.6), D-F5–D-F9, D-B3/D-B4/D-B8, H-F2/H-F4/H-F6, H-B5, B-2 uçları, devDeps 2 aday. Parça 3 kalanları: API-07/09/10/11/12/13, DCK-02 (frontend root — DCK-01 ile aynı Dockerfile turunda alınabilir), DCK-05/06, MEM-02, SEC-03–06.

---

## 3 · Sayım özeti

Sayım kuralı: her **etiketli** bulgu bir kez sayıldı; çok kalemli tablolar (ölü exportlar, CSS class grupları, H-B4/H-B5 satırları) rapordaki etiket/satır düzeyinde sayıldı — bu yüzden Parça 1'in Medium/Low sayıları gruplamaya duyarlıdır (≈ işareti). Çapraz-rapor mükerrerleri (F-1=B-06, H-B2≈DCK-07) ilk tespit edildiği raporda sayıldı.

| Rapor | Critical | High | Medium | Low | Kapanan |
|---|---|---|---|---|---|
| Parça 1 · Kod Yapısı | **2** | 15 | ≈20 | ≈18 | 1 (F-1) |
| Parça 2 · Runtime & UX | **0** | 4 | 16 | 21 | 14 (4 High + 6 Medium + 4 Low) |
| Parça 3 · Deploy & Production | **0** | 7 | 13 | 11 | 0 |
| **Toplam tespit** | **2** | **26** | **≈49** | **≈50** | **15** |
| **Açık kalan** | **2** | **22** | **≈42** | **≈46** | — |

- Açık iki Critical'ın ikisi de **konfigürasyon tuzağı** sınıfı (H-B1: env unutulursa; H-B2: dev dosyası sunucuda koşturulursa) — bugün aktif olarak sömürülebilir durumda değiller, düzeltmeleri toplam birkaç satır.
- Açık 22 High'ın dağılımı: 7'si üretim kararlılığı (Parça 3'ün tamamı), 6'sı backend duplicate/davranış ayrışması, 5'i frontend yapı borcu, 3'ü env/config drift (H-B4), 1'i öksüz rota.
- **Rapor kapsamı dışı kayıt:** GitHub'ın bildirdiği 26 Dependabot açığı (16 high) üç raporun hiçbirinde incelenmedi; ayrı bir iş olarak masada duruyor.
- **Doğrulanamayanlar:** panel-tarafı healthcheck durumu (DCK-03), üretim `DATABASE_URL` havuz ayarı (SEC-06), canlı responsive teyidi (Parça 2 §8), canlı kırık-link taraması — hepsi ilgili raporlarda açıkça işaretli.

---

## 4 · Kapanış: Bu repository şu an production deploy için hazır mı?

**EVET** — üç denetim de deploy'u engelleyecek aktif bir davranış hatası bulmadı, deploy zinciri ölçülüp öngörülebilir hâle getirilmiş (sıcak ~14 sn, üç büyük arıza sınıfı kapatılmış) ve site zaten bu hâliyle canlıda sorunsuz yayında; ancak bu "hazır", Kademe 1 kapanana dek **marjsız bir hazır**dır — RAM tepesi ve disk büyümesi her deploy'u küçük bir kumara çeviriyor ve iki Critical, tek unutulmuş env/yanlış komut mesafesinde bekliyor.

---

*Sentezi yürüten: Claude (Fable 5) · Parça 4/4 · Yalnızca üç mevcut rapor birleştirildi; kod değişikliği yapılmadı.*
