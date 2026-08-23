# BLEACH EVRENİ — P00 KEŞİF RAPORU

> Tarih: 23 Ağustos 2026 · Kapsam: `/anime/bleach` (+ `/en/anime/bleach`)
> Bu oturumda **kod yazılmadı.** Aşağıdaki her madde depodan okundu.

---

## ⌂ DEVİR — SIRADAKİ OTURUM BURADAN BAŞLASIN (23 Ağustos 2026)

**Durum:** Küratör altyapısı + P-TOKENS + **P01–P17 canlıda** + **P18-a
bitti.** On altı anlatı bölümü, hub kartı ve performans turu tamam.
**Sıradaki:** **P18-b · erişilebilirlik + i18n + SEO** — sonunda
`robots: noindex` kalkıyor. Ardından **P18-c**.

⚠️ **P18 TEK OTURUMA SIĞMAZ — ÜÇE BÖLÜNDÜ** (23 Ağustos 2026'da karar
verildi; brief'in altı maddesi tek turda bitecek hacimde değil, altıncı
madde tek başına bir oturum):

| Tur | Kapsam |
|---|---|
| **P18-a** ✅ | **BİTTİ — 23 Ağustos 2026.** Ölçüldü: brief'in dört hedefinden üçü zaten tutuyordu, üç optimizasyon maddesinin ikisi ölçümde karşılıksız çıktı. Yapılan: on bölüme `content-visibility`, `pnpm check:bleach`e bütçe bekçisi. **Tutanak aşağıda — yeniden ölçme.** |
| **P18-b** | Erişilebilirlik + i18n + SEO: "bölümlere atla" landmark listesi, on altı bölümde buton/`div` denetimi, `prefers-reduced-motion` tam tarama, ekran okuyucu geçiş raporu, hreflang, meta/OG/JSON-LD — **ve en sonda `robots: noindex` kalkar** |
| **P18-c** | Brief'in "son kritik"i: sayfayı baştan sona gez, "bu Naruto'nun Bleach'le doldurulmuş hâli mi?" sorusunu bölüm bölüm cevapla, **en zayıf üç bölümü yeniden yaz** |

⚠️ **`robots: noindex` P18-b'nin SONUNDA kalkar**, önce değil — kilit
`page.tsx` içinde `generateMetadata`da yazılı.

⚠️ Kontrast betiği brief'in istediği 15 kontrolü çoktan aşıyor:
`check-bleach-contrast.mjs` bugün **80 kontrol / 8 palet** yapıyor.
P18-b'de yeniden yazma, mevcut olanı genişlet.
⚠️ **Bölüm hakkında tahmin yazma.** P15'te bu blokta duran "görsel
ağırlıklı olacak" tahmini, brief'in "görsel yok, burası nefes alma alanı"
kararıyla çelişti. Önce brief'i oku, sonra karar ver.

### P18-a · ölçüm tutanağı (23 Ağustos 2026) — YENİDEN ÖLÇME, OKU

Üretim derlemesi + `next start` 3100, backend kapalı (yuvalar yedekte).

| Hedef (brief) | Ölçülen | |
|---|---|---|
| JS < 220KB gzip | **150,2KB** — 104KB'ı her rotanın paylaştığı çerçeve, 26,8KB sayfanın kendi parçası | ✅ |
| CLS < 0,05 | **0** | ✅ |
| TBT < 200ms | uzun görev **yok** | ✅ |
| LCP < 2,5s | **ölçülemedi** — panel görünmediği için sayfa hiç kare üretmiyor, `paint`/LCP girdisi doğmuyor. TTFB 44ms, DOMContentLoaded 89ms, load 109ms | — |

Belge: **645KB ham / 140KB gzip**; bunun 372KB'ı RSC flight yükü, 257KB
gerçek DOM. Sayfanın en ağır tek kalemi JS değil, **HTML**.

**Brief'in üç performans maddesi ölçüldüğünde:**

1. **Altı bölümü `ssr: false` ile geç montaj — YAPILMADI.** Kazanç ~15KB
   gzip JS + ~19KB gzip HTML; bedeli o altı bölümün sunucu çıktısından
   tamamen çıkması. P18-b'nin sonunda `noindex` kalkıyor — o an Espada,
   Zanpakutō, Bankai, Sternritter, Hollow ve Kılıç çizelgesi aranmaz ve
   JS gelmezse görünmez olurdu. Paket zaten hedefin 70KB altında.
   Yerine `content-visibility` kondu (aşağıda).
2. **`<symbol>` + `<use>` — YAPILMADI.** Tekrar eden BÜTÜN SVG yolları
   tekilleştirildiğinde ham kazanç 15,3KB, ama **kablodaki kazanç 0,3KB
   gzip**: gzip o tekrarı zaten yiyor. (En büyük tekrar Bleach'in bile
   değil — header+footer'daki marka logosu, 12,9KB.) Ölçüldü, reddedildi.
3. **Font stratejisi — ZATEN YAPILMIŞ.** Dört Bleach fontu da
   `preload: false`, `latin`/`latin-ext` dilimli, `display: swap`;
   gerekçeleri `app/[locale]/layout.tsx` içinde yazılı. Yapacak iş yoktu.

**Yapılan iki şey:**

- **`world.deferPaint`** (`world.module.css`) — `content-visibility: auto`
  + `contain-intrinsic-size: auto 140vh`. HTML değişmiyor (sunucu çıktısı
  aynen yerinde), yalnızca ekran dışı bölümün düzen/boyama işi erteleniyor.
  On bölüme verildi: gotei, zanpakuto, bankai, espada, empire, powers,
  masks, war, houses, locations.
  ⚠️ Altısına **bilerek verilmedi** — hero, WorldLayers/Senkaimon,
  hierarchy, hueco, legends, story: yapışkan sahne ya da
  `animation-timeline: view()` boyut sınırlamasıyla takışıyor. Yeni bir
  bölüme eklemeden önce o bölümde `position: sticky` ya da
  `animation-timeline` var mı diye BAK.
  ⚠️ `140vh` bir **ilk geçiş tahmini**; `auto` anahtar kelimesi bölüm bir
  kez çizildikten sonra gerçek yüksekliği hatırlıyor, o yüzden yanlış
  olması düzen kayması üretmiyor — yalnızca kaydırma çubuğu ilk inişte
  kendini düzeltiyor. **Gerçek yükseklikler canlıda ölçülüp yazılmalı.**
- **`scripts/check-bleach-budget.mjs`** — `pnpm check:bleach`in üçüncü
  adımı. JS 220KB gzip **sert** sınır (aşarsa çıkış 1); CSS 40KB ve HTML
  168KB **yumuşak** (yalnızca uyarı — brief'in hedefi değil, gerileme
  görülsün diye konmuş çizgiler). ⚠️ `next build` koşmamışsa atlıyor.
  HTML'i de ölçmek için:
  `BLEACH_URL=http://localhost:3100/anime/bleach node scripts/check-bleach-budget.mjs`

⚠️ **Tarayıcı paneli DÜZEN ölçemiyor.** `document.hidden` sürekli `true`,
ekran görüntüsü "pane is not displayed" diyor, her
`getBoundingClientRect` 0 dönüyor ve `paint` girdisi hiç doğmuyor.
Panelden alınabilen tek şey **hesaplanmış stil ve DOM sayımı** — bunlar
güvenilir (P18-a'da on bölümün `content-visibility`si böyle doğrulandı).
Yükseklik, LCP ve görsel doğrulama ya sunucu çıktısı üzerinden ya canlıda.


### Yerleşik konvansiyonlar — bunları yeniden keşfetme

| | |
|---|---|
| Sayfa | `app/[locale]/anime/bleach/page.tsx` — `force-dynamic`, `robots: noindex` |
| Bölüm deseni | `XSection.tsx` (sunucu, i18n çözer) → `X.tsx` (istemci ya da sunucu) + `X.module.css` |
| Veri | `lib/anime/bleach/<konu>.ts`, konu başına bir dosya |
| Tipografi | `world.module.css` — `.hero .section .eyebrow .body .meta .kubo .numeral .gothic .band .rule .ghostKanji` |
| Renk | `globals.css` — `[data-world="bleach"]` + beş `[data-layer="..."]`. **Bileşende hex YOK** (kural 16) |
| Görsel | **Çıplak `<Image>` yasak.** Her kadraj `<CuratedImage slotId>`; yuva `lib/anime/bleach/slots.ts` manifestosunda |
| Denetim | `pnpm check:bleach` — gotik font + 60 kontrast kontrolü. Commit öncesi koştur |

### Tekrarlayan tuzaklar (hepsi bir kez yaşandı)

1. **Sunucu bileşeni istemciye import edilemez.** `CuratedImage` `next/headers`
   okuyor; bir `"use client"` dosyasına import edersen derleme durur.
   Çözüm: sunucu sarmalayıcıda çizip **prop olarak** geçir (`BankaiSection`).
2. **Sunucudan istemciye işlev geçirilemez** (RSC serileştirme). Hazır dizi
   ya da dize geçir (`Gotei13Section.gateLabels`).
3. **Varsayılan durumda görünmeyen veri = SSR'da yok.** P04'te komutlar
   shikai durağına saklanmıştı ve sunucu çıktısında hiçbiri görünmüyordu.
   Bir bilgi JS'e bağımlıysa dur ve yeniden düşün.
4. **Canon'u fandom'dan doğrula.** Üç turda üç kez hata yakalandı (bölük
   çiçekleri, Zangetsu'nun "komutu", Renji'nin Bankai adı). Yöntem:
   `api.php?action=parse&page=<SAHİP>&prop=wikitext` — Zanpakutō sayfaları
   sahibine yönleniyor, sayfa HTML'i 403 veriyor. Emin olmadığını
   **uydurma**, `null` bırak; arayüz "kayıt yok" çiziyor.
5. **`prefers-reduced-motion` her bölümde ayrıca ele alınıyor.**
5b. **Konum göstergesini içerik yüksekliği varsayımıyla kurma.** P06'da ray
   önceden hesaplanmış yüzdelere oturtulmuştu; içerik taştığı için üçüncü
   kattan sonra bir durak kayıyordu. Doğru yol: göstergeyi **yapıya** bağla
   (`position: sticky` + öğenin kendi içinde duran durak), hesaba değil.
5c. **Kaydırma zaman çizelgesinde yedeği ÖNCE seç.** `@property`nin
   `initial-value`ı destek yokken tek gerçek: P06'da 0 doğru (sönük ama
   görünür), P07'de 1 doğru (maske görünmezse bölüm yok olur). Kardeş bir
   öğeye "hangisi aktif" sormak `timeline-scope` gerektirir ve yedeği
   sessiz kayıptır — bunun yerine öğeyi kendi kapsayıcısının içine koy.
5d. **Yapışkan bir sahne, kapsayıcısı ekrandan UZUNSA durur.** `100svh`
   bölüm + `100svh` yapışkan kutu = sıfır pencere. P07'de aşamalar
   `130svh`.
6. **Deploy:** Consistent Container Names AÇIK, rolling update yok, ~14 sn.
   Sorun çıkarsa `docs/deploy-duzeni.md` §8–§10.

### Doğrulama alışkanlığı

Tarayıcı paneli akışlı sayfaları açmıyor (Suspense sınırı çözülmüyor), o
yüzden doğrulama **sunucu çıktısı üzerinden**: yerel PG + yerel backend
(3099) + `next start` (3100), sonra `curl` ile belirteç sayımı. Görsel
teslim için sayfa tek dosyaya gömülüp gönderiliyor.

---

## 0 · ÜÇ CÜMLELİK ÖZET

1. Naruto Evreni **tek dosyalık bir sunucu bileşeni** (1087 satır) + tek CSS modülü (1560 satır); veri `lib/anime/naruto/` altında yedi dosyada, görseller `CharacterImage` tablosunda "sahte yetenek" anahtarlarıyla duruyor.
2. Depoda **iki ayrı küratör modu** var (anime kanadı: nitelik+CSS, sıfır JS; futbol kanadı: context + yuva başına kalem düğmesi). Bleach'in istediği şey ikisinin **melezi**: futbolun yuva başına düzenlemesi, animenin sıfır-JS sunucu çizimi.
3. Brief'in istediği sekiz alanın (odak, oran, alt TR/EN, künye, işlem biçimi, opaklık, blend, gizle) **hiçbiri** mevcut iki tabloda yok → yeni bir tablo şart, ve o tablo Bleach'e değil **yüzeye** (`surface`) bağlanmalı ki One Piece sayfası aynı altyapıyı devralsın.

---

## 1 · KONVANSİYON RAPORU

### 1.1 Rota ve dosya düzeni

| Soru | Cevap |
|---|---|
| Naruto rotası | [page.tsx](frontend/app/[locale]/anime/naruto/page.tsx) — `export const dynamic = "force-dynamic"`, async sunucu bileşeni |
| Stil | [page.module.css](frontend/app/[locale]/anime/naruto/page.module.css) — 1560 satır, tek dosya |
| Bölüm bileşenleri | `components/anime/naruto/` (`NarutoSelectors`, `BijuuStage`, `NarutoFace`, `ClanEmblems`) — yalnızca **etkileşim gereken** parçalar ayrı bileşen; geri kalan sayfanın içinde `<Section>` yardımcısıyla |
| Kanat kabuğu | [layout.tsx](frontend/app/[locale]/anime/layout.tsx) → `data-category="anime"` + anime-yerel tipografi ölçeği (`--an-*`) |
| Adres kaynağı | [lib/anime/routes.ts](frontend/lib/anime/routes.ts) — `animeHref.*`. Hiçbir bileşen elle `/anime/...` yazmıyor. `RESERVED_ANIME_SLUGS` seti var |

### 1.2 Veri nerede duruyor

`lib/anime/naruto/` — **saf TypeScript, CMS yok, MDX yok:**

```
types.ts      sözleşme
geography.ts  uluslar, köyler, mekânlar
history.ts    dönemler, savaşlar, misyonlar
people.ts     NARUTO_PEOPLE (slug → { name, characterId }), takımlar, Hokage
power.ts      chakra, dōjutsu, bijuu, jutsu
images.ts     küratör yuva anahtarları + manifesto
index.ts      yeniden dışa aktarım
```

Futbol kanadı aynı deseni bir adım ileri götürmüş: kayıt başına bir dosya (`lib/sport/players/<slug>.ts`) + `players/index.ts` defteri. Gerekçesi dosyanın başında yazılı (**6.500 satırlık tek dosya** ve **paralel ajan çakışması**). Bleach 18 bölüm + ~60 karakter + 26 Sternritter taşıyacağı için **futbol deseni** doğru olan.

### 1.3 i18n — ⚠️ EN BÜYÜK ÇATLAK

- Altyapı: `next-intl`, [routing.ts](frontend/lib/i18n/routing.ts) → `locales: ["tr","en"]`, `localePrefix: "as-needed"` (TR öneksiz, EN `/en`).
- Sözlükler: `messages/tr.json` / `messages/en.json`, 25 üst düzey ad alanı (`anime`, `character`, `sportArchive`, `music`…).
- `/anime` hub'ı düzgün: `getTranslations({ locale, namespace: "anime" })`.
- **Naruto Evreni sayfasında tek bir `t()` çağrısı yok.** Bütün metin Türkçe gömülü. Yani `/en/anime/naruto` bugün **Türkçe** açılıyor. Bu, AGENTS kural 1'in bilinen bir ihlali ve Bleach'in bunu tekrarlamaması gerekiyor (brief P18 §3 açıkça EN istiyor).

**Önerilen bölüşüm:** UI etiketleri (`Keşfet`, `dünyaya gir`, küratör metinleri) → `messages/*.json`; içerik metinleri (bio, mekân açıklaması, olay anlatısı) → veri kaydında `{ tr, en }` çifti; kanji/romaji/Zanpakutō/Schrift adları → **tek alan, çevrilmez.**

### 1.4 Görseller

- Sunucu bileşenlerinde `next/image`: `<Image src={apiUrl(row.url)} alt="" fill sizes="1920px" />`. **`sizes` sabit px** — `vw` next.config.ts'te ölçülüp yasaklanmış.
- Futbol kanadında düz `<img>` ([PlayerImage.tsx](frontend/components/sport/football/player/PlayerImage.tsx)) — çünkü yuva `placeholder` iken **hiç ağ isteği yapmamak** gerekiyor ve iki farklı origin var (`/uploads/…` API'de, `/assets/…` ön yüzde → `isLocalUpload()` ayırıyor).
- **Hotlink imkânsız:** CSP `img-src` beyaz liste (`'self' data: blob: tmdb ytimg anilist <api-origin>`). Küratör adres yapıştırdığında backend görseli **indirip** kendi diskimize yazıyor.
- `next.config.ts` → `remotePatterns` yalnızca `<api>/uploads/**` + tmdb. `formats: ["image/webp"]` (AVIF ölçülüp reddedilmiş).

### 1.5 Tema / token katmanı

- **Tailwind YOK.** Saf **CSS Modules** + tek global token dosyası [globals.css](frontend/styles/globals.css) (1445 satır).
- Kural 16: bileşende hex yasak, yalnızca `var(--token)`.
- **Brief'in `data-world` mekanizması zaten kurulu:** `[data-category="anime"]`, `[data-world="akatsuki"]` ve **13 karakter dünyası** aynı token setini yeniden bağlıyor. Bleach'in beş dünyası bu desenin doğrudan devamı.
- Sayfa kökünde nitelik açılıyor: `<main className={styles.page} data-world="akatsuki">`.
- ⚠️ Bugün **bütün** dünyalar koyu. Hueco Mundo'nun negatif teması bu dosyadaki **ilk açık palet** olacak — token setinin tamamı doldurulmalı (kural 16 son madde) ve kontrast ölçülmeli.

### 1.6 Tipografi

`next/font/google` ile **self-host**, kök layout'ta tanımlı: Bebas Neue (`--font-bebas`), Cinzel, Cormorant, Petrona, Anton, **Inter (`--font-inter`)**, Yuji Boku (fırça), Corinthia, Orhun.

- CSP: `font-src 'self' data:` → **Google Fonts CDN engelli**, yeni font `next/font/google` üzerinden gelmek zorunda.
- Eklenecek dördü: **Shippori Mincho B1**, **Jost**, **Archivo Black**, **UnifrakturMaguntia**. Inter zaten var.
- ⚠️ Anime kanadının display sesi **Bebas** ve `layout.module.css` içindeki `.display` sınıfı bunu dayatıyor. Bleach `shell.display` sınıfını **kullanmayacak**, kendi `--an-*` ölçeğini kökünde ezecek.

### 1.7 Hareket / scroll

- **Kütüphane yok.** framer-motion yok, GSAP yok. `package.json` toplam 12 bağımlılık.
- `IntersectionObserver` 6 bileşende elle kuruluyor; spor kanadı bunu tek bileşende toplamış: [Reveal.tsx](frontend/components/sport/Reveal.tsx) (bir kez tetiklenir, `prefers-reduced-motion`'da gözlemci hiç kurulmaz, JS gelmezse içerik görünür kalır).
- **Scroll-driven CSS zaten kullanımda:** `AkatsukiExhibit.module.css` içinde `@supports (animation-timeline: view())` + `@supports not (...)` yedek dalı. Brief'in P07'deki tercihi (`animation-timeline: view()` varsa o, yoksa IO+rAF) depoda kanıtlanmış bir desen.
- CSP `'unsafe-eval'` yalnızca dev'de; **dev sunucusunda istemci JS çalışmıyorsa** üretim derlemesiyle test edilecek (bilinen tuzak).

### 1.8 `/anime` hub kartlarının kaynağı (P17)

[app/[locale]/anime/page.tsx](frontend/app/[locale]/anime/page.tsx) — kartlar **elle yazılmış `<li>`**, üç kaynaktan besleniyor:

| Parça | Kaynak |
|---|---|
| Başlık / tagline | `messages/*.json` → `anime.worlds.<key>.title` / `.tagline` |
| Adres | `animeHref.naruto()` / `.akatsuki()` / `.archive()` |
| Görsel | `EXHIBIT_IMAGE_KEYS.worldNaruto` → Pain'in `CharacterImage` satırı |

Akatsuki kartı ayrıcalıklı: `AkatsukiPortalLink` (bulut portalı). Bleach kartının "dikey yarılma" hover'ı aynı ayrıcalık düzeyinde ve aynı yere oturuyor.

---

## 2 · KÜRATÖR MODU ENVANTERİ

### 2.1 İki ayrı sistem var

**A · ANİME KANADI** — [CuratorFrame](frontend/components/character/CuratorFrame.tsx) + [CuratorSlot](frontend/components/character/CuratorSlot.tsx) + [CuratorUpload](frontend/components/character/CuratorUpload.tsx)

- Açma/kapama: sarmalayıcıda `data-curating="true|false"`, yuvalar `[data-curator-slot]`; kapalıyken **CSS gizliyor**. React context **bilinçli olarak kullanılmamış** — context, sunucuda çizilen bölümleri istemci sınırına çekerdi.
- `isAdmin` false ise sarmalayıcı hiç çizilmiyor → **ziyaretçi bu JS'i indirmiyor.**
- Yükleyici `next/dynamic` + `ssr:false`.
- Kalıcılık: `CharacterImage` tablosu, `slot="ABILITY"` + `abilityName="naruto:hero"`, sahip `NARUTO_OWNER_ID`. Yeni tablo/migration gerekmeden sınırsız kadraj.
- Okuma: `getCharacterImagesBulk()` (50'lik parçalara bölünüyor), `cache: "no-store"`.
- Manifesto: `NARUTO_IMAGE_SLOTS` — `{ key, label, hint }`, sayfanın altında admin'e özel toplu kuşak olarak çiziliyor.

**B · FUTBOL KANADI** — [PlayerCurator](frontend/components/sport/football/player/PlayerCurator.tsx) + [PlayerImage](frontend/components/sport/football/player/PlayerImage.tsx)

- React context sağlayıcısı; sayfadaki **her görselin köşesinde kalem düğmesi**.
- Düzenleyici `createPortal` ile `document.body`ye çıkıyor (kapsayıcıların `overflow:hidden`ı paneli kesiyordu) ve olay balonlarını **açıkça yutuyor** (galeri karesinde ışık kutusu açılıyordu).
- Optimistic: `setImages` haritayı yerinde güncelliyor, `router.refresh()` yok — panel anında doğru.
- İki katlı sahiplik: `images[owner][slotId]`; `slot.owner ??= slug` damgası hub'daki "23 kart aynı görsel oldu" arızasını kapatmış.
- **Boş yuvanın iki yüzü:** ziyaretçiye `.veil` (yazısız, tasarlanmış boşluk — kulüp renginde ışık + doku), küratöre `.holder` (kadraj notu + dosya yolu + "FOTO EKLENECEK"). İkisinde de **`<img>` hiç basılmıyor.**
- Kalıcılık: `FavouritePlayerImage(playerSlug, slotId, url)`, `@@unique([playerSlug, slotId])`, soft delete.
- Uçlar: `PATCH /admin/sport-archive/player-image` (yazma) · `GET /sport-archive/football/players/images` (toplu okuma) · tekil uç yedeği ([curator-images.ts](frontend/lib/sport/curator-images.ts) — iki servis aynı anda ayağa kalkmadığı için **404 yedeği** var).

### 2.2 Yetki nasıl çalışıyor

- Sunucuda: [readIsAdmin()](frontend/lib/auth/session.ts) — `cache()`li, `kuronexus-session` çerezini okuyup `GET /auth/me` soruyor. **Rol JWT'de yok**, her istekte veritabanından doğrulanıyor.
- Backend'de: `@Roles('ADMIN')` **sınıf düzeyinde**; açık uçlar ayrı dosyada ve `@Public()`.
- `isAdmin` yalnızca **düğmeyi** gösteriyor; gerçek kapı backend'de.

### 2.3 Brief'in istediği 8 alan — mevcut durum

| İstenen | Bugün var mı? | Nerede |
|---|---|---|
| Görseli değiştir (dosya/URL) | ✅ | Her iki sistem |
| **Odak noktası (sürüklenen artı)** | ⚠️ kısmen | `coverPosition` + `coverScale` **kayıt üzerinde** (`FootballClub`, `F1Circuit`), yuva üzerinde değil; arayüz **üç slider**, sürükleme yok |
| **Kırpma oranı seçimi** | ❌ | — |
| **Alt metin TR + EN** | ⚠️ kısmen | `SportImage.altTr/altEn` var; yuva tablolarında yok (`CharacterImage.altText` tek dilli, otomatik dolduruluyor) |
| **Kaynak / telif satırı** | ⚠️ kısmen | `SportImage.sourceNote` ve `MediaCredit` tipi var; yuva tablolarında yok |
| **İşlem biçimi (foto/silüet/duotone)** | ❌ | — |
| **Opaklık + blend mode** | ❌ | — |
| **Geçici gizle** | ⚠️ benzeri | `CharacterHideButton` (karakteri **dizinden** çıkarır), görsel yuvası için yok |
| **Slot manifestosu** | ✅ | `NARUTO_IMAGE_SLOTS`, `HUB_HERO_SLOT`, `slotsOf()` |
| **"Eksik görseller" paneli** | ⚠️ | Naruto kuşağı hepsini listeliyor ama **boş/dolu ayrımı yapmıyor**; kadro portrelerinde yapıyor (`" · portre boş"`) |

---

## 3 · BLEACH İÇİN ÖNERİLEN MİMARİ

### 3.1 Ana karar — sunucu bileşeni + admin adası

Brief'in "kuratör modu kapalıyken **sıfır ekstra JS**" şartı, futbol desenini olduğu gibi kopyalamayı imkânsız kılıyor: `PlayerImage` `"use client"` ve sayfadaki her görseli istemci yaprağına çeviriyor.

Çözüm ikisinin melezi:

```
<CuratedImage>            SUNUCU bileşeni. Görseli, odak noktasını, oranı,
                          işlem biçimini, opaklığı, blend'i ve fallback'i
                          çizer. Ziyaretçiye SIFIR JS iner.
   └─ <CuratedSlotEditor> İSTEMCİ adası. Yalnızca isAdmin true iken
                          çiziliyor (sunucuda kesiliyor), next/dynamic ile
                          geliyor. Kalem düğmesi + portal panel.
<CuratorFrame>            Nitelik + CSS anahtarı (anime kanadı deseni).
                          Context YOK.
```

`CuratedImage` prop dropping yapmıyor: `readIsAdmin()` ve `readBleachImages()` ikisi de `cache()`li, yani her `CuratedImage` kendi başına çağırabiliyor ve istek başına **tek** tur atılıyor. Bu, `readIsAdmin`'in zaten `cache()` ile sarılmış olmasının doğrudan sonucu.

### 3.2 Tip sözleşmesi

```ts
// lib/anime/bleach/slots.ts

export type BleachWorld =
  | "living" | "soul-society" | "hueco-mundo" | "wandenreich" | "royal" | "hell";

/** İlk eleman slotun VARSAYILAN oranı */
export type SlotRatio = "21:9" | "2:1" | "16:9" | "3:2" | "1:1" | "4:5" | "9:16";

/** Görselin işlenme biçimi — dünya paletine bağlanır */
export type SlotTreatment = "photo" | "silhouette" | "duotone";

export type SlotBlend =
  | "normal" | "multiply" | "screen" | "overlay" | "soft-light" | "luminosity";

/** Görsel yokken (ya da gizliyken) ne çizilecek */
export type SlotFallback = "silhouette" | "typographic" | "void";

/** TASARIMIN yuva hakkında bildiği her şey — kodda, veritabanında değil. */
export interface CuratedSlotDef {
  /** ⚠️ KARARLI kimlik. Değiştirmek küratörün yüklemesini koparır. */
  id: string;
  /** Manifestoda hangi bölüm başlığı altında listelenecek */
  section: BleachSectionId;
  /** Küratör panelinde görünen ad */
  label: string;
  /** "Ne bulmam gerek" notu — YALNIZCA küratör modunda görünür */
  hint: string;
  /** Önerilen piksel boyutu — manifestoda yazılı, tek ekrandan okunur */
  size: { w: number; h: number };
  /** İzin verilen oranlar; küratör yalnızca bunlar arasından seçebilir */
  ratios: [SlotRatio, ...SlotRatio[]];
  /** Slot hangi dünyanın paletinde çiziliyor — duotone rengini bu belirler */
  world: BleachWorld | "neutral";
  /** Varsayılan işlem biçimi (küratör ezebilir) */
  treatment: SlotTreatment;
  /** Görsel yokken devreye giren tasarım */
  fallback: SlotFallback;
  /** Depoda hazır bir kare/SVG varsa (silüet katmanları) */
  src?: string;
  /** İlk kıvrım — priority + fetchPriority high */
  eager?: boolean;
}

/** Veritabanından gelen kayıt — küratörün YAZDIĞI her şey. */
export interface CuratedImageRecord {
  slotId: string;
  url: string | null;
  /** CSS object-position, "50% 30%" */
  position: string | null;
  /** Büyütme yüzdesi, 100–300 (100'ün altı kutuda boşluk bırakır) */
  scale: number | null;
  ratio: SlotRatio | null;
  altTr: string | null;
  altEn: string | null;
  /** "Getty Images", "IHA", "Shueisha resmî arşiv" — ÇEVRİLMEZ */
  credit: string | null;
  treatment: SlotTreatment | null;
  /** 0–100 */
  opacity: number | null;
  blend: SlotBlend | null;
  /** "Geçici gizle" — fallback devreye girer, kayıt silinmez */
  isHidden: boolean;
}

export type CuratedImageMap = Record<string, CuratedImageRecord>;
```

### 3.3 `<CuratedImage>` API

```tsx
export async function CuratedImage(props: {
  /** BLEACH_SLOTS içindeki kimlik. Tanımsız kimlik derleme hatası verir. */
  slotId: BleachSlotId;
  className?: string;
  /** next/image sizes — SABİT px. `vw` yasak (next.config.ts ölçümü). */
  sizes?: string;
  /** Slot tanımının varsayılan oranını bu çizimde ez */
  ratio?: SlotRatio;
  /** alt boş basılır — yanında zaten okunabilir metin var */
  decorative?: boolean;
  /** Yuva bir <button>/<a> içindeyse kalem düğmesini bastır */
  noEdit?: boolean;
  /** fallback yerine bu düğüm çizilsin (bölüme özel silüet) */
  fallback?: ReactNode;
}): Promise<JSX.Element>;
```

**Çizim sırası (sunucuda):**

1. `readBleachImages()` haritasından kaydı al.
2. `record.isHidden || !record.url` → **fallback çiz.** Boş kutu asla yok:
   `silhouette` → bölümün inline SVG silüeti · `typographic` → dev kanji + Jost eyebrow · `void` → tasarlanmış boşluk (`.veil` deseni).
   ⚠️ Bu dalda `<img>` **hiç basılmaz** (futbol kanadının ölçülmüş kararı).
3. Görsel varsa `<Image>`; `objectPosition` = `record.position`, `scale` = `record.scale/100`, `opacity`, `mixBlendMode`, `data-treatment` niteliği (duotone/silüet CSS filtresi token'lardan okuyor).
4. Oran `--slot-ratio` CSS değişkeniyle `aspect-ratio` olarak veriliyor → **CLS 0.**
5. `alt` = locale'e göre `altTr`/`altEn` (`decorative` ise boş).
6. `credit` doluysa `<figcaption>` künye satırı.
7. `isAdmin` → `<CuratedSlotEditor slotId={...} />` (dynamic, ssr:false).

### 3.4 `<CuratedSlotEditor>` — istemci adası

Futbolun portal panelini devralıyor, **beş yeni sekme** ekliyor:

| Sekme | İçerik |
|---|---|
| GÖRSEL | dosya seç · adres yapıştır · kaldır |
| ODAK | görselin küçük önizlemesi üzerinde **sürüklenen artı imleci** → `object-position`; klavye: ok tuşları %1, Shift+ok %10; ayrıca büyütme slider'ı (100–300) |
| KADRAJ | slotun `ratios` listesinden seçim (radio) |
| METİN | alt TR · alt EN · künye satırı |
| GÖRÜNÜM | işlem biçimi (foto/silüet/duotone) · opaklık · blend · **geçici gizle** anahtarı |

- **Optimistic + geri alınabilir:** kaydetmeden önceki kayıt adanın state'inde tutuluyor; `router.refresh()` dönene kadar yeni kare panelin üstünde **önizleme katmanı** olarak çiziliyor (sunucu bileşeni kendi başına anında değişemez). Kaydetme sonrası 10 saniye "Geri al" düğmesi — bir önceki kaydı geri yazar.
- Portal + olay yutma (`stopPropagation`) futbolda ölçülmüş; birebir devralınıyor.
- Panel `document.body`ye çıkıyor — Bleach'te bu **zorunlu**: kapılar, nişler ve Sternritter hücreleri `overflow:hidden` + `clip-path` taşıyor.

### 3.5 Slot manifestosu ve "eksik görseller" paneli

```ts
export const BLEACH_SLOTS: readonly CuratedSlotDef[] = [ /* … */ ];
export const BLEACH_SLOT_IDS = BLEACH_SLOTS.map((s) => s.id);
export type BleachSlotId = (typeof BLEACH_SLOTS)[number]["id"];

/** Bölüm bölüm gruplanmış — manifesto paneli bunu okur */
export function slotsBySection(): Record<BleachSectionId, CuratedSlotDef[]>;
/** Yalnızca boş olanlar */
export function missingSlots(images: CuratedImageMap): CuratedSlotDef[];
```

Panel (`<CuratorManifest />`, sunucu bileşeni, admin'e özel, sayfanın sonunda):

```
EKSİK GÖRSELLER · 34 / 61 yuva boş

P01 HERO ────────────────────────────────────────── 1/2
  ● bleach:hero:ichigo     2560×1440 · 16:9      DOLU
  ○ bleach:hero:crack       1600×2400 · 2:3      BOŞ   [düzenle]
     "Dikey Garganta yarığı — SVG silüet, fotoğraf değil"

P03 GOTEI 13 ────────────────────────────────────── 0/13
  ○ bleach:gotei:1          720×960 · 3:4        BOŞ   [düzenle]
     "Kaptan silüeti, tek renk, arka plan şeffaf"
  …
```

Her satır sayfadaki yuvaya `#slot-<id>` çapasıyla bağlı — küratör tıklayınca ilgili bölüme iner.

### 3.6 Kalıcılık — yeni tablo

Mevcut iki tablo da yetmiyor (bkz. §2.3). Öneri, **yüzeye** bağlı genel bir tablo:

```prisma
/// **Küratör görsel yuvası — yüzey bazlı.**
///
/// FavouritePlayerImage'ın genelleştirilmiş hâli: orası `playerSlug`
/// ile futbol defterine kilitliydi, burası herhangi bir SAYFAYA
/// ("anime/bleach") bağlanıyor. One Piece evreni geldiğinde tek satır
/// veri değişikliğiyle aynı altyapıyı devralır.
model CuratedImage {
  id String @id @default(cuid())

  /// Hangi yüzey — "anime/bleach". Sayfa başına tek ad.
  surface String
  /// Yuvanın KARARLI kimliği ("bleach:gotei:8").
  /// ⚠️ Kodda yeniden adlandırılırsa küratörün yüklemesi kopar.
  slotId  String

  /// Kendi sunucumuzdaki yol (/uploads/…). Dış adres saklanmıyor:
  /// CSP yabancı sunucuya izin vermiyor ve dış adres bir gün ölebilir.
  url       String?
  /// CSS object-position ("50% 30%") — odak noktası
  position  String?
  /// Büyütme yüzdesi 100–300
  scale     Int?
  /// Kırpma oranı ("16:9") — slotun izin verdikleri arasından
  ratio     String?
  /// Erişilebilirlik metni ÇEVRİLİR
  altTr     String?
  altEn     String?
  /// "Getty Images / Shueisha arşivi" — künye, ÇEVRİLMEZ
  credit    String?
  /// photo | silhouette | duotone
  treatment String?
  /// 0–100
  opacity   Int?
  /// CSS mix-blend-mode değeri
  blend     String?
  /// "Geçici gizle" — görsel yerine fallback devreye girer, kayıt durur
  isHidden  Boolean @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  /// Kural 3: fiziksel silme yok
  isDeleted Boolean @default(false)

  /// Yuva başına TEK kayıt — upsert'in dayanağı
  @@unique([surface, slotId])
  /// Sayfa açılışının tek sorgusu
  @@index([surface, isDeleted])
}
```

**Uçlar** (`src/curated-images/`, `sport-archive` deseninin aynısı — açık ve yönetici uçları **ayrı dosyada**):

| Uç | Yetki | İş |
|---|---|---|
| `GET /curated-images/:surface` | `@Public()` | `Record<slotId, CuratedImageRecord>` |
| `PATCH /admin/curated-images` | `@Roles('ADMIN')` | upsert; `url: ""` → `isDeleted: true` |

⚠️ Ön yüz okuması `readCuratorImages` desenini devralacak: **uç 404 verirse boş harita**, sayfa yer tutucularla ayakta kalır. Bu süs değil — main'e push iki servisi birden deploy ediyor ve **aynı anda ayağa kalkmıyorlar.**

---

## 4 · EKLENECEK / DEĞİŞECEK DOSYALAR

### 4.1 Backend

| Dosya | İşlem |
|---|---|
| `backend/prisma/schema.prisma` | **DEĞİŞ** — `CuratedImage` modeli |
| `backend/prisma/migrations/<ts>_curated_image/` | **EKLE** — ⚠️ push öncesi `K:\postgres` portatif PG 16'da koşturulacak |
| `backend/src/curated-images/curated-images.module.ts` | EKLE |
| `backend/src/curated-images/curated-images.controller.ts` | EKLE (`@Public()`) |
| `backend/src/curated-images/curated-images.admin.controller.ts` | EKLE (`@Roles('ADMIN')`) |
| `backend/src/curated-images/curated-images.service.ts` | EKLE |
| `backend/src/curated-images/dto/set-curated-image.dto.ts` | EKLE (`class-validator`) |
| `backend/src/app.module.ts` | **DEĞİŞ** — modül kaydı |

### 4.2 Frontend — altyapı

| Dosya | İşlem |
|---|---|
| `lib/api/curated-images.ts` | EKLE — `readCuratedImages(surface)`, `no-store`, 404 yedeği |
| `lib/admin/api.ts` | **DEĞİŞ** — `setCuratedImage()` |
| `components/anime/bleach/CuratedImage.tsx` + `.module.css` | EKLE — **sunucu** bileşeni |
| `components/anime/bleach/CuratedSlotEditor.tsx` + `.module.css` | EKLE — **istemci** adası (dynamic, ssr:false) |
| `components/anime/bleach/CuratorManifest.tsx` + `.module.css` | EKLE — eksik görseller paneli |
| `styles/globals.css` | **DEĞİŞ** — `[data-world="bleach"]` + 5 katman paleti + duotone/silüet filtre token'ları |
| `app/[locale]/layout.tsx` | **DEĞİŞ** — Shippori Mincho B1, Jost, Archivo Black, UnifrakturMaguntia (`preload:false`) |
| `app/[locale]/anime/layout.module.css` | **DEĞİŞ** — `.wing::before` opaklığı `--an-noise` token'ına alınacak (Hueco Mundo'nun beyaz zemininde doku istenmiyor; alt ağaç ebeveynin pseudo-elementini başka türlü ezemiyor) |
| `frontend/scripts/check-display-fonts.mjs` | EKLE — Türkçe dize display font'una geçerse derlemede uyarı (brief P-TOKENS §2) |

### 4.3 Frontend — Bleach verisi

`lib/anime/bleach/` (futbol deseni: konu başına bir dosya)

| Dosya | İçerik |
|---|---|
| `types.ts` | `World`, `Character`, `Zanpakuto`, `Division`, `Location`, `TimelineEvent`, `Schrift` — brief'teki şema |
| `slots.ts` | `BLEACH_SLOTS` manifestosu + yardımcılar |
| `worlds.ts` | 5 dünya kaydı, kanji, palet adı, katman sırası |
| `divisions.ts` | Gotei 13 — çiçek + anlam, klasik/TYBW kadro |
| `zanpakuto.ts` | Dönüşüm aşamaları + 6 inner world |
| `bankai.ts` | Bankai Hall nişleri |
| `hierarchy.ts` | Ruh hiyerarşisi 8 katman |
| `espada.ts` | 0–9, aspect of death, resurrección |
| `sternritter.ts` | 26 harf, açılmamış mühürler `null` |
| `powers.ts` | Shinigami / Hollow / Quincy güç sistemleri |
| `masks.ts`, `houses.ts`, `locations.ts` | P11, P14, P15 |
| `timeline.ts` | TYBW olayları + Zangetsu evrimi |
| `legends.ts` | 10 isim + reiatsu renkleri |
| `index.ts` | yeniden dışa aktarım |

### 4.4 Frontend — rota ve bölümler

| Dosya | İşlem |
|---|---|
| `app/[locale]/anime/bleach/page.tsx` + `page.module.css` | EKLE — `dynamic = "force-dynamic"` |
| `app/[locale]/anime/bleach/_playground/page.tsx` | EKLE — P-TOKENS demosu (geçici) |
| `components/anime/bleach/WorldProvider.tsx` · `WorldSection.tsx` · `DepthRail.tsx` · `Senkaimon.tsx` | EKLE — P-TOKENS çıktısı |
| `components/anime/bleach/<P03…P16>.tsx` | EKLE — 16 bölüm bileşeni; ağır olanlar `next/dynamic` + IO ile geç monte |
| `lib/anime/routes.ts` | **DEĞİŞ** — `bleach()` + `RESERVED_ANIME_SLUGS`'a `"bleach"` |
| `app/[locale]/anime/page.tsx` | **DEĞİŞ** — P17 Bleach kartı |
| `messages/tr.json` · `messages/en.json` | **DEĞİŞ** — `anime.worlds.bleach.*`, `anime.bleach.*` (UI etiketleri), küratör sekme etiketleri |
| `STATE.md` · `docs/DEVIR-…` | **DEĞİŞ** — kural 9 |

---

## 5 · ÇATIŞMALAR VE RİSKLER

| # | Konu | Not |
|---|---|---|
| 1 | **i18n** | Naruto TR-gömülü; Bleach EN istiyor. Sayfa metinlerinin `{tr,en}` çiftine bağlanması **veri kaydı yazılmadan** kararlaştırılmalı — sonradan dönüştürmek 18 bölümü birden açmak demek |
| 2 | **Tipografi çakışması** | Anime kanadının display sesi Bebas; Bleach Jost/Shippori istiyor. Bleach kökü `--an-*` ölçeğini ezecek ve `shell.display` sınıfını kullanmayacak |
| 3 | **Kanat dokusu** | `.wing::before` film graini `opacity: 0.05` sabit; Hueco Mundo'nun beyaz zemininde istenmiyor → token'a alınmalı (2 satır, yalnızca anime kanadı) |
| 4 | **İlk açık palet** | `[data-world="hueco-mundo"]` globals.css'teki ilk açık zemin olacak; token setinin **tamamı** doldurulup kontrast ölçülmeli (kural 16 + brief AA 7:1) |
| 5 | **theme-color meta** | Katman değişiminde güncellenmesi istemci JS gerektiriyor → DepthRail adasının içine, ayrı bileşen değil |
| 6 | **Paket boyutu** | 18 bölüm tek rotada. Naruto dersi: sayfa başına stil dosyası sayısı ölçülmüş bir sorun; ağır bölümler `next/dynamic` + IO ile geç monte edilecek (brief P18 §1 zaten böyle diyor) |
| 7 | **Migration** | Push öncesi `K:\postgres` portatif PG 16'da koşturulacak, `--output` ile |
| 8 | **Deploy penceresi** | Ön yüz yeni + backend eski penceresinde uç 404 döner → boş harita yedeği zorunlu |
| 9 | **Dev sunucusu** | CSP `unsafe-eval` yalnızca dev'de açık ama tarayıcı panelinde rAF donması bilinen tuzak; etkileşim testi üretim derlemesiyle (port 3100) |
| 10 | **Font Türkçe kapsamı** | Shippori Mincho B1 ve UnifrakturMaguntia'da ş/ğ/ı/İ eksik olabilir → derleme kontrolü (§4.2 son satır) |

---

## 6 · ÖNERİLEN SIRA

```
P00 (bu rapor)  →  KARAR (§7)  →  MIGRATION + UÇLAR  →  CuratedImage + Editor + Manifest
                                                              ↓
                                   P-TOKENS (5 palet, DepthRail, Senkaimon, _playground)
                                                              ↓
                                   P01 → P02 → [worktree paralel: P03…P16] → P17 → P18
```

Küratör altyapısı **P-TOKENS'tan önce** kurulacak: playground zaten `<CuratedImage>` ile çizilirse token oturmadan yuva sözleşmesi de sınanmış olur.

---

## 7 · VERİLEN KARARLAR (23 Ağustos 2026, kullanıcı onayı)

1. **Kalıcılık → yeni `CuratedImage` tablosu.** Sekiz alanın tamamı taşınıyor; migration `K:\postgres` portatif PG 16'da sınandıktan sonra push edilecek. One Piece ve sonraki evren sayfaları aynı yüzey mekanizmasını devralır.
2. **i18n → TR + EN çift kayıt.** İçerik kayıtlarında `{ tr, en }`; kanji/romaji/Zanpakutō/Schrift/Resurrección adları tek alan, çevrilmez. `/en/anime/bleach` gerçekten İngilizce açılacak — Naruto'nun TR-gömülü davranışı **tekrarlanmayacak.**
3. **Hub kartı → mevcut `EXHIBIT_IMAGE_KEYS`.** `/anime` sayfasında tek görsel sistemi kalıyor; yalnızca `worldBleach` anahtarı eklenecek. Kartın "dikey yarılma" hover'ı tasarım tarafında, veri tarafında değil.

### Bu kararların dosya listesine etkisi

- §4.1 aynen geçerli (tablo + modül + migration).
- §4.3 içindeki her kayıt dosyası `{ tr, en }` çiftli yazılacak; `types.ts` bunu tek bir `Localized<T>` yardımcı tipiyle sözleşmeye bağlayacak.
- §4.4'e ek: `lib/anime/akatsuki.ts` **DEĞİŞ** — `EXHIBIT_IMAGE_KEYS.worldBleach`.

---

## 8 · UYGULAMA TURU 1 — KÜRATÖR ALTYAPISI (23 Ağustos 2026) ✅

### 8.1 Ne kuruldu

**Backend** — `CuratedImage` tablosu + `src/curated-images/` modülü.
Migration `K:\postgres` portatif PG 16'da koşturuldu, sürüklenme kontrolü
temiz (`migrate diff --from-config-datasource` → *No difference detected*).

| Uç | Yetki | İş |
|---|---|---|
| `GET /curated-images?surface=anime/bleach` | `@Public()` | yüzeyin bütün yuvaları, tek sorgu |
| `PATCH /admin/curated-images` | `@Roles('ADMIN')` | kısmi güncelleme; `url:""` görseli kaldırır, `reset:true` yuvayı sıfırlar |

⚠️ **Yüzey adı sorgu parametresi, rota parametresi DEĞİL** — "anime/bleach"
eğik çizgi taşıyor ve rota parametresi onu bölüm ayracı sayar.

**Ön yüz** — üç bileşen:

- `CuratedImage` (**sunucu**) — sayfadaki her kadraj bundan geçiyor.
  Ziyaretçiye tek bayt JS indirmiyor. Yuva haritasını ve yönetici bayrağını
  prop olarak almıyor; ikisi de `cache()`li olduğu için her yuva kendisi
  okuyor ve istek başına tek tur atılıyor.
- `CuratedSlotMount` → `CuratedSlotEditor` (**istemci**) — yalnızca `isAdmin`
  iken çiziliyor, `next/dynamic` + `ssr:false`. Beş sekme: görsel · odak ·
  kadraj · metin · görünüm. Odak sekmesinde **sürüklenen artı imleci**
  (klavye: ok %1, Shift+ok %10).
- `CuratorManifest` (**sunucu, admin'e özel**) — 65 yuva, bölüm bölüm,
  dolu/boş sayacıyla; her satırda önerilen boyut, oran, kadraj notu ve
  sayfadaki yuvaya çapa.

Anahtar mevcut `CuratorFrame` (nitelik + CSS, context yok). Tek eklenti:
boş yuvanın iki yüzünü ayıran `[data-curator-veil]` kuralı.

### 8.2 Ölçülen davranışlar

Yerel Postgres + yerel backend + **gerçek giriş akışı** ile:

| Kontrol | Sonuç |
|---|---|
| Ziyaretçi: küratör işareti, iskele, düzenleyici | **hiçbiri yok** |
| Boş yuva için `<img>` isteği | **yok** (60 yuvalık sayfada 60 adet 404 üretilmiyor) |
| Odak / oran / opaklık / blend / büyütme / işlem biçimi | hepsi kayıttan çiziliyor |
| Alt metin TR ↔ EN | `/anime/bleach` → "Ichigo dort kimlik", `/en/…` → "Ichigo four identities" |
| Künye satırı | çiziliyor |
| Geçici gizle | görsel gidiyor, tasarlanmış yedek geliyor, **kayıt duruyor** |
| Yuvayı sıfırla | satır boşalıyor (soft-delete, kural 3) |
| Yetkisiz yazma | 401 |
| Dış adres · tanınmayan blend · `scale < 100` | 400 |
| Manifesto sayacı | "0 / 65 yuva dolu · 65 görsel eksik" |

**Bulunan ve düzeltilen hata:** `reset` yalnızca `isDeleted` işaretliyordu.
Upsert aynı yuvaya yeni kare bağlandığında satırı diriltiyor ve
gönderilmeyen alanlar kalıyor — yani "geçici gizle" açıkken sıfırlanan bir
yuva, yeni görsel yüklendiğinde **gizli olarak geri geliyordu**: küratör
kareyi yüklüyor, sayfada hiçbir şey görünmüyor ve sebebi hiçbir yerde
yazmıyor. `reset` artık satırın bütün alanlarını boşaltıyor.

### 8.3 Doğrulanamayan tek şey

Düzenleyicinin **tarayıcıdaki etkileşimi** (sekme geçişi, artı sürükleme,
geri alma penceresi). Tarayıcı paneli akışlı (streaming) sayfalarda Suspense
sınırını açmıyor — `<template id="B:1">` yerinde kalıyor, `$RC` çağrısı
etkisiz. Bu panelin bilinen davranışı, sayfaya ait bir arıza değil: sunucu
çıktısı curl ile eksiksiz doğrulandı. **Etkileşim canlıda doğrulanacak.**

### 8.4 Not: sözlük her sayfaya iniyor

`NextIntlClientProvider` bütün `messages` demetini istemciye gönderiyor;
yeni `anime.bleach.curator` anahtarları da her sayfanın yükünde. Bu YENİ bir
durum değil — `character.curator`, `sportArchive.curator` ve müzik anahtarları
zaten aynı yoldan iniyor. Kapsam dışı bırakıldı; sağlayıcıyı daraltmak bütün
salonlara dokunur ve ayrı bir tur ister.

### 8.5 Düzeltme turu — canlı geri bildirim (23 Ağustos 2026)

**① SİYAH KUTU (asıl arıza).** Küratör bir kare yüklüyor, modu kapatıyor ve
yerinde **siyah bir dikdörtgen** buluyordu. İki hata üst üste binmişti:

- `silhouette` işlem biçimi `brightness(0)` uyguluyordu. Şeffaf zeminli bir
  PNG'de doğru sonuç (saf siyah şekil), **opak bir fotoğrafta tuvalin
  tamamı siyah**. Dünya katmanlarının varsayılanı `silhouette` idi, yani
  yüklenen her manzara siyaha dönüyordu.
- Düzenleyicinin optimistik önizlemesi `draft.url` varken **her zaman**
  çiziliyordu. Filtresiz olduğu için küratöre "her şey yolunda" gösteriyor,
  gerçek çizimi maskeliyordu. Mod kapanınca altındaki sonuç ortaya
  çıkıyordu — bu, hatayı görünmez kılan asıl mekanizmaydı.

Düzeltme: filtre `brightness(.3)` (opak fotoğrafta da okunur bir gölge),
dünya katmanlarının varsayılanı `photo`, önizleme yalnızca kaydetme
uçuştayken (`pendingPreview`, altı saniyelik güvenlik zaman aşımı).

**② DEPODAKİ VARSAYILAN KARE.** `CuratedSlotDef.src` tipte vardı ama çizimde
kullanılmıyordu. Artık üç basamaklı sıra işliyor: küratör kaydı → depo
varsayılanı → tasarlanmış yedek. Futbol defterindeki `PlayerImageSlot.src`
deseninin aynısı.

Dört dünya katmanına serbest lisanslı Commons karesi kondu (Tokyo gecesi,
Himeji Kalesi, Little Sahara, Münster Katedrali). ⚠️ **Reiōkyū bilinçli
olarak boş** — brief'te "renksiz, en sessiz katman, kasıtlı olarak" yazıyor.
Künye `srcCredit` ile görselle birlikte seyahat ediyor (CC BY-SA atıf
istiyor).

⚠️ İki görsel üreticisi de o gün kapalıydı: Gemini ücretsiz kotası 429, fal
hesabı 403 `TOP_UP`. Commons'a geçildi ve beş katmanın hepsi zaten MEKÂN
olduğu için gerçek fotoğraf iş gördü.

**③ MANİFESTO ÜÇ DURUMLU OLDU.** `default` durumu eklendi: sayaç dört görsel
ekranda dururken "0 / 65 dolu" diyordu. Küratörün bilmesi gereken "dolu mu"
değil **kimin doldurduğu**. Artık `0 / 65 dolu · 61 eksik · 4 geçici kare`
ve yer tutucu satırlarda "kendi karenle değiştir" notu duruyor.

**④ HUB KARTI.** `/anime` → Bleach Evreni kartı eklendi (`world:bleach`
anahtarı, boşsa depodaki Seireitei karesine düşüyor). Kartın ayrımı: hover'da
görsel ortadan **dikey olarak yarılıyor** ve aradan ince bir ışık geçiyor —
Senkaimon'un mikro hâli. Diğer kartlar ölçekleniyor, bu yarılıyor;
`prefers-reduced-motion`'da yarık yok, yalnızca aydınlanma.

### 8.6 P-TOKENS — tasarım sistemi (23 Ağustos 2026) ✅

**BEŞ PALET, ÖLÇÜLEREK.** Brief her dünya için dört renk veriyor
(ink / accent / glow / paper); ev token seti on dört istiyor ve kural 16
"her tema aynı seti eksiksiz doldurur" diyor. Ara tonlar tahmin edilmedi,
**türetildi**: `ink` = zemin, `paper` = metin, arası yüzdelik karışım. Tek
kural beş dünyada da çalışıyor — Hueco Mundo dahil, çünkü orada ink beyaz
ve paper siyah, karışım kendiliğinden ters yöne gidiyor. Negatif tema için
ayrı formül gerekmedi.

Ara tonlar hedefe **çözüldü** (eşiği geçen en düşük karışım), böylece soluk
metin gerçekten soluk kaldı. `scripts/check-bleach-contrast.mjs`
`globals.css`i okuyup 60 kontrol yapıyor: birincil metin AAA, ikincil ve
soluk AA, accent ≥3:1. Hepsi geçiyor.

⚠️ **Tek sapma:** Seireitei aksanı brief'te `#B8121B` ve zemin üzerinde
2.94:1 veriyor — eşiğin altında. `#BA1B23` yapıldı (gözle ayırt edilemez).

⚠️ **`data-layer`, `data-world` değil.** Brief `data-world` diyor ama o
nitelik dolu: 13 karakter deneyim sayfası ve Akatsuki sergisi kendi
derilerini onunla açıyor. Bleach katmanları bir seviye daha iç
(`[data-category="anime"]` → `[data-world="bleach"]` → `[data-layer="living"]`).
Aynı niteliğe iki anlam yüklemek, bir gün "royal" adlı bir karakter derisi
eklendiğinde sessizce çarpışırdı.

⚠️ **`--surface-2` türev kuralına `[data-layer]` eklendi.** Katman kendi
`--surface`/`--bg` değerlerini bağlıyor; seçici listesinde olmasaydı ara ton
SAYFANIN paletinden hesaplanırdı ve Hueco Mundo'da beyaz zemine koyu bir
ton düşerdi.

**DÖRT FONT.** Shippori Mincho B1 (`--font-shippori`), Jost (`--font-jost`),
Archivo Black (`--font-numeral`), UnifrakturMaguntia (`--font-gothic`).
Dördü de `preload: false` — yalnızca Bleach'te kullanılıyorlar ve kök düzen
siteyi sarıyor; brief "Jost'u preload et" diyor ama o karar Bleach'i tek
başına bir site sanıyor, bedeli diğer altı salon öderdi. Ölçüldü: hiçbir
sayfada `<link rel="preload">` sızmıyor.

Türkçe kapsamı `font-data.json`dan **ölçüldü**: Shippori, Jost ve Archivo
`latin-ext` taşıyor (Türkçe güvenli); **yalnızca UnifrakturMaguntia
`latin`** — ş/ğ/İ/ı yok. Yani brief'in uyarısı yalnız sonuncusu için
geçerli. `scripts/check-bleach-fonts.mjs` gotik aileye Türkçe dize
geçmesini denetliyor; denetimin gerçekten düştüğü sınandı.

Shippori kanji taşıyor: `subsets` bilinçli yazılmadı (Yuji Boku deseni) →
245 unicode-range dilimi, tarayıcı yalnızca geçen karakterin dilimini
indiriyor.

**ÜÇ BİLEŞEN.**
- `WorldSection` — sunucu bileşeni. Katman kendi `data-layer`ını taşıyor,
  tema değişimi tamamen CSS: JS kapalıyken de çalışıyor.
- `DepthRail` — küçük istemci adası. ⚠️ Aktif katman `threshold: 0.5` ile
  DEĞİL, görünür alanın ortasındaki sıfır yükseklikli bantla bulunuyor
  (`rootMargin: -50% 0px -50% 0px`): katmanlar ekrandan uzun olacak ve
  uzun bir bölümün kesişme oranı 0.5'e hiç ulaşmaz — ray o katmanı hiç
  görmezdi. Ray aktif katmanın `data-layer`ını kendi üzerinde taşıyor,
  yani rengini token'dan alıyor; ikinci bir renk haritası yok.
  `theme-color` metası bölümün hesaplanmış `--bg` değerinden güncelleniyor.
- `Senkaimon` — **sıfır JS**. `animation-timeline: view()` destekleniyorsa
  yarık kaydırmaya bağlı açılıyor; desteklenmiyorsa (bugün Firefox) yarık
  açık hâlde duruyor. `prefers-reduced-motion`'da sahne kısalıyor ve yarık
  doğrudan açık — brief'in kendi kararı ("kesme de güzel durur").

**GEÇİŞ CLS = 0.** Hem sayfa kökü hem katman yalnızca `background-color` ve
`color` geçişi taşıyor; layout'a dokunan tek özellik yok.

⚠️ **`playground`, `_playground` değil.** Brief alt çizgi öneriyor ama App
Router'da `_` önekli klasör ÖZEL KLASÖRDÜR ve rotadan tamamen çıkarılır —
ölçüldü, derleme çıktısında rota hiç görünmedi. Ön ek düşürüldü; "kalıcı
değil" mesajını `robots: noindex` taşıyor.

**Kanat dokusu token'a alındı** (`--an-noise`). Sabit değer alt ağaçtan
ezilemiyordu (pseudo-element ebeveynde). Bleach dokuyu kapatıyor: Kubo'nun
negatif alanı dokusuz ve Hueco Mundo'nun beyaz zemininde gürültü kirli bir
kâğıt izlenimi veriyordu.

### 8.7 P01 — RUHLARIN DENGESİ (23 Ağustos 2026) ✅

**TEZ.** Naruto Evreni bir karakter görseliyle açılıyor; Bleach böyle
açılmıyor. Hero bir **denge tablosu**: tek bedende dört ruhsal kimlik.
Görsel dört dikey şeride bölünüyor, her şerit bir kimliğin rengini alıyor
ve şeritler hafifçe kaymış (0 / −6 / +4 / −2 px) — kırık ayna.

**TEK GÖRSEL, DÖRT ŞERİT.** Dört `<CuratedImage>` **aynı yuvayı** çiziyor
(`bleach:hero:ichigo`); her şerit %25 genişlikte, içindeki çerçeve %400 ve
kendi payı kadar sola kaydırılmış. Tarayıcı tek dosya indiriyor. Kalem
düğmesi yalnızca ilk şeritte — dört kalem aynı yuvayı düzenlerdi.

Bunun için `CuratedImage`'a **`fill`** eklendi: yuvanın oranını yok say,
ebeveyni doldur. Kadraj dışarıdan geldiğinde gerekiyor; aynı ihtiyaç
Bankai nişlerinde ve Espada maske parçalarında da olacak.

**GÖRSEL YOKKEN.** Dört şerit dört **ışık kolonuna** dönüyor: kimlik rengi
üstte, dibe doğru boşluğa karışıyor. İlk sürüm düz renk dolgusuydu ve
sonuç "dört gri kutu" gibi okunuyordu — renkler doğruydu ama yan yana dört
dikdörtgen bir kompozisyon kurmuyordu.

**ARKA SAHNE.** Üç katman tek yapışkan kutunun içinde: dört dünya silüeti
(Karakura → Seireitei → Las Noches → Silbern, inline SVG), Garganta yarığı
ve 40 reishi parçacığı. Ayrı ayrı yapışkan yapılsalardı üçü birbirinden
bağımsız kayardı.

⚠️ **İki tasarım hatası yakalandı ve düzeltildi:**
1. Dünya evrimi `animation-timeline: scroll()` kullanıyordu — o çizelge
   **belgenin** kaydırmasını ölçüyor, hero'nunkini değil; dört dünya sayfanın
   tamamına yayılıyor ve hero'dan çıkıldıktan sonra hâlâ geçiş yapıyorlardı.
   Hero'ya adlandırılmış `view-timeline: --hero` verildi.
2. Reishi konumları CSS'te `mod()` ile türetiliyordu. `mod()` desteklenmeyen
   tarayıcıda bildirim tümden geçersiz olur ve **kırk parçacık aynı noktaya
   yığılır**. Konum/süre artık bileşende hesaplanıyor — deterministik
   formül, `Math.random` yok (hidrasyon uyuşmazlığı).

**TEK İSTEMCİ ADASI** imleç paralaksı: `pointermove` → rAF ile kısılmış iki
CSS değişkeni. React state'i kullanılmadı; her harekette dört `<Image>`
taşıyan bir ağacı yeniden çizmek anlamsızdı. Kaba işaretçide ve
`prefers-reduced-motion`'da **hiç kurulmuyor**.

**Kabul ölçütleri.** JS gelmezse hero eksiksiz çiziliyor (paralaks
değişkenleri 0 kalır). Boş yuvada `<img>` hiç basılmıyor — sayfada tek
`<img>` var, o da site logosu. 360px'te şerit ~80px (alt sınır 44px).
`reduced-motion`'da paralaks yok, partikül yok, dünya evrimi ilk silüette
donuyor; kırık ayna kayması **kalıyor** — o hareket değil, kompozisyon.

⚠️ **LCP:** yuva `eager: true` taşıyor, yani görsel geldiğinde `priority`
ile inecek. Bugün yuva boş; LCP elemanı wordmark.

### 8.8 P02 — ÜÇ DÜNYA (23 Ağustos 2026) ✅

**TEZ.** Naruto Evreni'nde bunun karşılığı "Köyler ve Bölgeler" ızgarası:
yan yana kartlar, hepsi eşit, hepsi aynı anda görünür. Bleach'te dünyalar
eşit değil ve aynı anda görünmemeliler. Beş katman üst üste istifleniyor,
kullanıcı aralarından geçerek **iniyor**; her geçiş bir kapı olayı.

**BEŞ AYRI GÖRSEL GRAMER.** Yerleşim ortak (`WorldSection`), atmosfer ayrı
(`Atmospheres`). Beşi aynı şablonu paylaşıp yalnız renk değiştirseydi sayfa
"beş kez aynı bölüm" olurdu:

| Katman | Gramer |
|---|---|
| 現世 Karakura | eğik yağmur (tek kaplama, kırk damla elemanı değil), elektrik direği, üç soluk kader zinciri, sodyum lambası havuzu |
| 尸魂界 Seireitei | sumi mürekkep dokusu, haori dokuması, yatay kaligrafi fırça vuruşu |
| 虚圏 Hueco Mundo | **TAM BOŞLUK** — ay (dolgusuz daire), kırık kemik ağacı, tek yatay kum çizgisi. Doku yok, gradient yok |
| 霊王宮 Reiōkyū | yalnızca geometri: ince çizgilerden bir tapınak planı, çok az mor sis |
| 見えざる帝国 Silbern | gotik sivri kemer (`clip-path`), altın hairline, soldan sağa uzayan gölgeler |

Hepsi saf CSS + inline SVG: tek dosya inmiyor, tek istek gitmiyor.

⚠️ **GEÇİT SIRASI CANON'A GÖRE DÜZELTİLDİ.** Brief'in şeması Garganta'yı
Hueco Mundo ile Reiōkyū arasına koyuyor. Canon'da Garganta Hollow geçididir
ve Hueco Mundo'ya **girerken** kullanılır; Reiōkyū'ya Ōken ile çıkılır.
Sıra: 現世 →senkaimon→ 尸魂界 →garganta→ 虚圏 →ōken→ 霊王宮 →schatten→ 見えざる帝国.

⚠️ **AÇIK KATMANIN YARIĞI TERS ÇALIŞIYORDU — ölçülüp düzeltildi.** Senkaimon
yarığı "gidilen dünyanın rengini" sızdırıyor ve bunu `--world-accent` +
`--world-paper`dan alıyordu. Hueco Mundo negatif: zemini beyaz, aksanı ve
kâğıdı **koyu**. Sonuç, karanlık geçitte siyah üstüne siyah — Garganta
yarığı hiç görünmüyordu. Açık katmanda sızan şey artık `--world-ink`
(zeminin kendisi). `LIGHT_LAYERS` kümesi tek doğruluk kaynağı; "bu katman
açık mı" sorusunu soran her yer oraya soruyor.

**"DÜNYAYA GİR" BAĞLANTISI KOŞULLU.** Derin bölümler (Gotei 13, Hueco,
Wandenreich) henüz yok. Bağlantı yalnızca hedef sayfada varsa çiziliyor
(`READY_SECTIONS`) — ölü bir sayfa içi çapası, olmayan bir bağlantıdan
kötüdür. Bölüm yayına girdiğinde kümeye tek satır ekleniyor.

**DERİNLİK RAYI ANA SAYFAYA BAĞLANDI.** P-TOKENS'ta yalnızca playground'da
duruyordu; artık gerçek katmanlara işaret ediyor ve `theme-color` metası
katmanla dönüyor.

**Denetim betiği körlükten kurtarıldı.** Gotik font kontrolü `.gothic`
sınıf adını arıyordu ve `Atmospheres.module.css` içindeki `.gothicMark`
denetimin **dışında** kalmıştı (`\b` sınırı eşleşmiyor). Artık sınıf adı
sabit yazılmıyor: gotik aileyi *uygulayan* sınıflar CSS'ten türetiliyor ve
çıktı hangilerinin izlendiğini yazıyor. Bir yan bulgu: seçici yakalaması
önündeki yorumu yutup `.mjs` diye hayalî bir sınıf üretiyordu — yorumlar
artık önce ayıklanıyor.

**Bu bölümde tek satır istemci kodu yok.** Tema değişimi nitelik + kalıtım,
geçitler CSS.

### 8.9 P03 — GOTEI 13 (23 Ağustos 2026) ✅

**TEZ.** On üç bölük, on üç kart değil on üç **kapı**. Seireitei'nin dairesel
planına sadık: ortada Sōkyoku Tepesi, çevresinde bir daire üzerinde on üç
kapı. Mobilde daire çöküyor, kapılar dikey bir koridora dönüyor.

⚠️ **ÇİÇEKLER FANDOM'DAN DOĞRULANDI — ve doğrulama işe yaradı.** Brief'in
kuralı gereği `bleach.fandom.com/wiki/Gotei_13` okundu. Sayfanın HTML'i 403
veriyor; MediaWiki API'si (`api.php?action=parse&prop=wikitext`) veriyor.
Hafızadan yazılsaydı **en az üçü yanlış olurdu**:

| | hafıza | canon |
|---|---|---|
| 11. bölük | porsuk ağacı (yew) | **civanperçemi (yarrow)** |
| 2. bölük | mor erik | **dağ lalesi (pasque flower)** |
| 9. bölüğün anlamı | "boşluk" | **"unutuş" (oblivion)** |

On üç çiçek, anlamları ve TYBW kadrosu artık `divisions.ts` içinde.

**BİLİNMEYEN `null`.** Aizen'in Bankai'ı, Ukitake'nin Bankai'ı, Kenpachi'nin
Bankai adı, Iba'nın kılıcı canon'da açıklanmadı — uydurulmadı, `null`
bırakıldı ve panel "kayıt yok" gösteriyor. Brief'in kendi kuralı.

**İKİ ZAMAN KİPİ.** Klasik dizilim ↔ TYBW sonrası. Hiçbir wiki bu iki
tabloyu yan yana göstermiyor; sayfanın "arşivci" kimliğini kanıtlayan şey
bu. 13. bölük Ukitake → Rukia, 5. bölük Aizen → Shinji, 1. bölük Yamamoto →
Kyōraku.

⚠️ **SVG DEĞİL, HTML.** Brief bir SVG koordinat sistemi öneriyor. Kapılar
gerçek `<button>` ve daire üzerine CSS custom property ile yerleştirildi
(konumlar `gatePosition()` ile önceden, deterministik olarak hesaplanıyor —
hidrasyon uyuşmazlığı yok). Klavye gezinmesi, odak halkası, `aria-expanded`
ve dokunma hedefi kendiliğinden geliyor; SVG içinde etkileşimli öğe kurmak
üçünü de elle yeniden yazmak ve birini unutmak demekti.

**Kapının üç durumu:** kapalı (yalnız kanji), hover/odak (kanatlar ortadan
6px aralanıyor, ardından kaptan adı yükseliyor, reiatsu halkası yayılıyor —
`box-shadow` değil kenarlık), açık (kanatlar tamamen çekiliyor, panel
merkezde). Aynı anda tek kapı açık; adres `#gotei-8` olarak güncelleniyor
(`replaceState` — `location.hash` yazmak sayfayı zıplatırdı).

**Klavye:** gezinen sekme indeksi. Kapı grubu sekme sırasında TEK durak,
içinde ok tuşlarıyla dolaşılıyor — on üç ayrı durak, sayfayı klavyeyle
gezen birini bölümün içinde on üç kez durdururdu. Home/End uçlara,
Escape kapatıyor ve odak kapıya dönüyor.

⚠️ **İki hata yakalandı:**
1. `gateLabel` bir **işlev** olarak sunucudan istemciye geçiriliyordu — RSC
   sınırında serileştirilemez. On üç dize sunucuda üretilip dizi olarak
   iniyor.
2. Kapatma düğmesi `className="sr-only"` kullanıyordu ve **depoda öyle bir
   yardımcı sınıf yok** — etiket ekrana basılırdı. `aria-label`e alındı.

**No-JS durumu:** on üç kapı, kanji numaraları, İngilizce satırları, zaman
kipi başlığı ve (hover'da) kaptan adları çiziliyor — bölüm boş değil.
Panelin açılması JS gerektiriyor; bu bilinçli, brief'in tasarımı bir JS
etkileşimi.

### 8.10 P04 — ZANPAKUTŌ ARŞİVİ (23 Ağustos 2026) ✅

**TEZ.** Naruto Evreni'nde bunun karşılığı bir teknik listesi. Burada tez
farklı: **Zanpakutō bir silah değil, yaşayan bir ruhtur.** O yüzden bu bir
katalog değil bir *canlılar* kataloğu — on kılıcın dönüşüm hattı, altısının
kendi iç dünyası.

**KOMUTLAR FANDOM'DAN DOĞRULANDI.** Zanpakutō sayfaları sahiplerine
yönleniyor; veri `===Zanpakutō===` bölümünde
`{{translation|"..."|kanji|romaji}}` biçiminde duruyor. Onun onu da
hafızadakiyle birebir uyuştu — ama Gotei 13 turunda üç hata çıktığı için
doğrulama atlanmadı.

⚠️ **Zangetsu'nun komutu yok** ve bu bir eksiklik değil: Ichigo'nun kılıcı
sürekli serbest hâlde. Brief'in şeması bu noktada 「月牙天衝」 yazıyor ama o
bir **saldırı** adı (Getsuga Tenshō), serbest bırakma komutu değil.
`command: null`, arayüz "komut yok" çiziyor. Aynı biçimde Kenpachi'nin
Bankai adı da canon'da yok → `name: null`.

⚠️ **SİLÜET ÜRETİLİYOR, ELLE ÇİZİLMİYOR — teknik zorunluluk.** Morph için
iki path'in **aynı düğüm dizisine** sahip olması şart. Kırk aşama (on kılıç
× dört durak) elle çizilseydi hiçbiri diğerine dönüşemezdi. Şablon tek ve
sabit; aşamalar yalnızca **altı sayıyla** ayrışıyor (`BladeForm`), böylece
her geçiş kendiliğinden morph edilebilir oluyor.

Bedeli açıkça yazıldı: silüet bir **şema**, illüstrasyon değil.
Senbonzakura'nın bin bıçağı ve Ryūjin Jakka'nın alevi burada soyut bir
biçim değişimi. Anlatıyı ad, komut ve tek cümlelik not taşıyor.

Morph **CSS'te** (`transition: d`), JS'te değil — kompozisyon katmanında,
ana iş parçacığına dokunmadan. Desteklemeyen tarayıcıda geçiş anlık olur;
brief'in izin verdiği yedek de zaten buydu.

⚠️ **ÖLÇÜLDÜ VE GERİ ALINDI: komut artık her zaman görünür.** İlk sürüm
brief'i harfiyen uygulayıp komutu shikai durağına saklıyordu. Varsayılan
durak "mühürlü" olduğu için sunucu çıktısında **on komutun hiçbiri
görünmüyordu** — bölümün en ikonik canon verisi ("Chire, Senbonzakura") JS
gelmeden hiç okunmuyordu ve JS gelse bile her şerit için ayrı tıklama
istiyordu. Komut kılıcın kendisine ait, bir aşamaya değil: şimdi hep
duruyor, shikai durağı seçiliyken vurgulanıyor.

**İÇ DÜNYA — imza etkileşim.** Kart açılmıyor: sayfa ruh dünyasına giriyor.
Tam ekran, o kılıcın **canon paleti** (veri olarak, kural 16 istisnası),
ruhun adı, iki üç cümle ve tek bir çıkış. Altı sahne: yan yatmış gökdelen
şehri (Zangetsu — sahne 90° döndürülüyor), düşen bıçaklar (Senbonzakura),
donmuş gökyüzü, kar, yıkık savaş alanı, kırmızı perde.

⚠️ `aria-modal="true"` kullanıldı, elle `aria-hidden` **değil**: brief
ikincisini söylüyor ama elle yazılan `aria-hidden` kapanışta
temizlenmezse sayfayı kalıcı olarak okunamaz bırakır. Escape kapatıyor,
odak açan düğmeye dönüyor, gövde kaydırması kilitlenip **eski değerine**
geri veriliyor (boş dizeye sıfırlamak sayfanın kendi ayarını ezerdi).

### 8.11 P05 — BANKAI SALONU (23 Ağustos 2026) ✅

**TEZ.** Karanlık bir koridor, duvarlarda kapalı silüetler. Sayfanın en
sinematik ve en **sessiz** yeri: az eleman, çok gerilim. **Bankai bir
sırdır** ve bölüm bunu bilgi mimarisiyle söylüyor — niş kapalıyken kimin
durduğu belli değil, ad ancak ışık düşünce beliriyor.

Sayfanın tamamı dikey bir iniş; burası **tek yatay ada**. On yedi bölüm
boyunca aşağı inen bir okuma, bir kez yana yürüyor.

⚠️ **ADLAR DOĞRULANDI — ve yine bir şey çıktı.** Renji'nin Bankai'ı canon'un
şu anki hâlinde **双王蛇尾丸 Sōō Zabimaru**; brief'in yazdığı *Hihiō
Zabimaru* TYBW öncesi form. İkisi de doğru, farklı dönemler — Zabimaru
TYBW'de yeniden dövüldü. Koridorda serinin çoğunda geçerli olan form
duruyor, ikinci ad not olarak yanında. Ayrıca romanizasyon düzeltildi:
Kokujō Tengen **Myō'ō** (kesme işaretiyle), hem burada hem `divisions.ts`te.

⚠️ **SCROLL HIJACK YOK.** Tekerlek yatayı sürüyor ama **yalnızca koridorda
yer varken**; uçlara gelindiğinde olay serbest bırakılıyor ve sayfa normal
dikey akışına devam ediyor. Dinleyici elle bağlanıyor (`{ passive: false }`)
çünkü `preventDefault` gerekiyor ve pasif bir dinleyicide sessizce yok
sayılır. Yatay tekerleğe (trackpad) hiç karışılmıyor.

**IŞIK: giriş 260ms, çıkış 900ms.** Asimetri kasıtlı — fare hızlı geçerse
arkasında sönen bir iz bırakıyor ve aynı anda birden fazla niş yanıyor
görünüyor. Tek bir süreyle bu his elde edilemez. Tamamı CSS; JS yok.

**DOKUNMATİKTE HOVER YOK** — nişler `<button>` ve tıklamayla sabitleniyor.
Hover'a bağlı bir tasarım dokunmatikte adları tamamen erişilemez
bırakırdı; buton hem onu, hem klavyeyi, hem odak halkasını çözüyor.
Odaklanan niş `scrollIntoView({ block: "nearest", inline: "center" })` ile
kendiliğinden ortalanıyor — `block: nearest` dikey konumu bozmuyor.

**SON NİŞ ÖZEL.** Tensa Zangetsu iki kat büyük ve aydınlandığında koridorun
tamamı sönüyor. `:has()` ile — çocuktan ebeveyne çıkan tek CSS yolu.

⚠️ **SUNUCU/İSTEMCİ SINIRI İHLALİ — derleme yakaladı.** `BankaiHall` bir
istemci bileşeni ve `CuratedImage`ı import ediyordu; o ise `next/headers`
okuyan bir **sunucu** bileşeni. Derleme durdu. React'in izin verdiği yol
onu **prop olarak** geçirmek: on silüet `BankaiSection`da (sunucu)
çizilip diziyle aşağı iniyor. Küratör sözleşmesi korunuyor, sınır ihlal
edilmiyor.

`noEdit` zorunlu: niş bir `<button>` ve içine küratör kalemi (ikinci bir
`<button>`) koymak geçersiz HTML olurdu. Yuvalar manifesto panelinden
düzenlenebiliyor.

**`--slot-mark-opacity` eklendi** (`CuratedImage`): niş kapalıyken silüet
%8, ışık düşünce %70 olmalı. Sabit bir değer iç içe opaklıklarla çarpılıp
hesaplanamaz hâle gelirdi.

### 8.12 P06 — RUH HİYERARŞİSİ (23 Ağustos 2026) ✅

**TEZ.** Bir liste değil, **yukarıdan aşağı bir iniş**: 霊王 → 零番隊 →
中央四十六 → 護廷十三隊 → 隠密機動 → 鬼道衆 → 真央霊術院 → 流魂街.
Aşağı indikçe görsel kalite **bilinçli olarak bozuluyor** — tepede kusursuz
hiza, bol boşluk ve fısıltı gibi bir tipografi; dipte sıkışık aralık, kaymış
hiza, kaba bir aile ve kirli bir doku. Eşitsizlik metinle söylenmiyor,
tipografiyle gösteriliyor (brief'in kendi talimatı).

Bütün bozulma tek bir sayıdan açılıyor: `--decay` (0 tepe, 1 dip). Kaydın
kendi **sesi** de veride: `voice: "fine" | "plain" | "coarse"` → Jost 200 /
Jost 300 / Inter 700. Hangi katın ince, hangisinin kaba konuştuğu bir CSS
indeksinden değil kayıttan geliyor.

**DERİ KATIN İÇİNDE DEĞİŞİYOR.** Bölüm `data-layer="royal"` ile açılıyor;
Central 46'dan itibaren her `<li>` `data-layer="soul-society"` taşıyor.
Aksan kemik beyazından haori kızılına döndüğü an, iktidarın el değiştirdiği
yer. Ölçüldü: ilk iki kat `rgb(6,6,10)`, kalan altısı `rgb(11,11,13)`.

⚠️ **RAY HESAPLA KURULDU, TUTMADI — YENİDEN YAZILDI.** İlk kurulumda kat
başına `svh` cinsinden pay veriliyor, kümülatif yüzdeler çıkarılıyor ve
duraklar yapışkan rayda o yüzdelere oturuyordu. Matematik doğruydu ama
**varsayım yanlıştı**: katın gerçek yüksekliği içeriğe bağlı (Royal Guard
beş kayıt taşıyor, Rukongai dört) ve `min-height` çoğu katta bağlayıcı
olmuyor. Ölçüm: beklenen `414/370/327/…`, gerçek `487/682/368/…` →
**üçüncü kattan sonra ray bir durak ileri kayıyordu.**

Yeni kurulum hiçbir şey hesaplamıyor:
- **Durak katın kendi içinde** (mutlak konumlu, rayın çizgisine oturuyor).
  Kat nereye düşerse durak da oraya düşüyor.
- **Kayan işaret düz `position: sticky; top: 50svh`** — ekranın ortasına
  çakılı, duraklar önünden geçiyor. Kaydırmaya bağlı zaman çizelgesi
  gerektirmiyor, Firefox'ta da çalışıyor.
- Kat sola kayarken durağın çizgide kalması için tek bir `--drift`
  değişkeni hem `margin-inline-start`'ta hem durağın `left`inde kullanılıyor
  (sekiz durağın hepsi ölçüldü: aynı 116.0px'te).

**DERS:** Ekranda konum gösteren bir şeyi **içerik yüksekliğine dair bir
varsayımla** kurma. Yapıyla doğru olan, hesapla doğru olandan üstün.

**`@property --hier-lit`** — "şu an bu kattasın" anahtarı. Kat başına tek
bir `animation-timeline: view()` animasyonu bu sayıyı 0→1 sürüyor; durak,
durak kanjisi ve bağlantı çizgisi üçü de onu okuyor. Üç ayrı animasyon
yazılsaydı birbirinden kayabilirlerdi. Desteklenmeyen tarayıcıda başlangıç
değeri 0'da kalıyor (`var(--hier-lit, 0)` yazımı `@property` desteği
olmayanı da kapsıyor) — her şey sönük ama görünür.

⚠️ **CANON YİNE ÜÇ HATA YAKALADI** (`api.php?action=parse&prop=wikitext`):
1. Junrinan kuzey değil **batı** Rukongai 1. bölge (Hitsugaya, Hinamori).
2. Central 46 → **中央四十六**; brief'in yazdığı 中央四十六**室** külliyenin
   adı, kurumun değil.
3. Royal Guard'ın resmî adı **王属特務** (Ōzokutokumu); 零番隊 ikinci ad.

Central 46'nın kırk bilgesi ve altı yargıcı canon'da **hiç adlandırılmadı**
→ `figures: []` ve arayüz o satırı hiç çizmiyor. Kidō Birliği'nin
Tessai'den sonraki komutası bilinmiyor ve künye bunu açıkça yazıyor.

⚠️ **BRIEF'TEN TEK SAPMA.** Brief Ruh Kralı katı için "opacity .35 —
dokunulmazlık" diyor. Değer yalnızca **kanjiye ve durak noktasına**
uygulandı; katın açıklaması tam kontrastta bırakıldı. Aksi hâlde brief'in
kendi kalite tabanı ("hiçbir içerik erişilemez hâle gelmez") çiğnenirdi.

**GÖRSEL YOK, BİLEREK.** Bölümün argümanı tipografik; bir portre onu
hiyerarşi olmaktan çıkarıp kadro listesine indirgerdi.

**SIFIR JS.** Sunucu bileşeni, sarmalayıcı gerekmedi (`WorldLayers` gibi).
Rota paketi 20.5 kB → 20.4 kB.

**900px altı:** ray kalkıyor, düz dikey akış, `--decay` gradyanı duruyor.
360px'te yatay taşma yok (ölçüldü).

`READY_SECTIONS` defterine `zanpakuto`, `bankai` ve `hierarchy` eklendi;
Reiōkyū katmanı artık `#hierarchy`ye kapı açıyor.

### 8.13 P07 — HUECO MUNDO · MASKENİN KIRILIŞI (23 Ağustos 2026) ✅

**TEZ.** Brief'in cümlesi: *"Evrim şeması bir ağaç değil, bir maskenin
kırılmasıdır."* Yedi aşama dallanmıyor, tek bir nesnenin başına gelenler
gibi sıralanıyor: 整 (zincir, maske yok) → 虚 → 最下大虚 → 中級大虚 →
最上大虚 → 破面 → 十刃.

**SAYFA NEGATİFE DÖNÜYOR.** Bölüm `data-layer="hueco-mundo"` taşıyor; zemin
`#EFEDE7`, metin `#1A1A1A` (ölçüldü). Buraya kadar her şey koyuydu.

⚠️ **BRIEF'İN "ÜST BÖLÜM"Ü ZATEN VARDI.** P07 promptu boş beyaz ekran + kum
çizgisi + kemik ağacı + konturlu ay + mekân listesi istiyor — bunların
hepsi **P02'deki `hueco-mundo` katmanı**. İkinci bir kopya sayfayı iki kez
aynı şeyi söyler hâle getirirdi. Bu bölüm katmanın açtığı kapının ardı;
katmanın "Boşluğa in" bağlantısı artık çiziliyor (`READY_SECTIONS`).

**KANJİ'LER BİR TASARIM HEDİYESİ ÇIKTI.** Üç Menos sınıfı aynı 大虚
çekirdeğini paylaşıp önüne derece ekliyor: **最下**大虚 → **中級**大虚 →
**最上**大虚. Hiyerarşi kelimenin kendi içinde yazılı; punto onu görünür
kılıyor. ⚠️ Doğrulama düzeltti: Gillian'ın kanji'si ギリアン değil
**最下大虚** (katakana yalnızca okunuş). Aynısı Adjuchas ve Vasto Lorde'da.

**MASKE TEK PARÇA PATH.** Göz ve ağız ayrı renkli parçalar değil, aynı `d`
dizesinde `fill-rule="evenodd"` ile açılan oyuklar. İki faydası var:
maske gerçekten tek siluet (zemin neyse gözün içi de o) ve negatif temada
iki rengi elle takip etmek gerekmiyor (kural 16). Ağız — beyaz bant +
içinden yukarı bakan dişler — tek bir alt-yol dizisiyle üretiliyor.

⚠️ **`overflow: visible` DENENDİ, GERİ ALINDI.** Gillian kadraja bilerek
sığmıyor; taşma serbest bırakılınca maske komşu sütuna bindi (ölçüldü:
446px genişlik, 300 birimlik viewBox'ta). SVG'nin varsayılan kırpması geri
konuldu — Gillian artık gerçekten **kesiliyor**, ki "devleşir" cümlesi
zaten bu.

⚠️ **`timeline-scope` DÜŞÜNÜLDÜ, KULLANILMADI.** Tek yapışkan bir maske
kutusuna yedi durumu yığmak daha az kod olurdu ama "hangi durum şu an"
sorusunu **kardeş** bir öğeye sormayı gerektirirdi. Desteklemeyen bir
tarayıcıda hiçbir maske görünmezdi — sessiz ve tam bir kayıp. Bunun yerine
**her aşama kendi maskesini kendi içinde `position: sticky` ile taşıyor.**
P06'nın dersinin devamı: göstergeyi yapıya bağla.

⚠️ **AŞAMA EKRANDAN UZUN OLMAK ZORUNDA.** `min-height: 130svh`. 100svh'de
yapışkan pencere sıfır olur ve maske içerikle birlikte kayar — 30svh'lik
fazlalık maskeyi okuma süresince ortada tutuyor. Bölüm bu yüzden ~9,8
ekran; başlıktaki yedi çapa atlama yolu.

**`@property --hollow-lit` başlangıç değeri 1, 0 DEĞİL.** P06'daki
`--hier-lit` 0'da başlıyor çünkü orada yedek "sönük ama görünür". Burada
yedek "tam opak" olmalı: 0'da başlasaydı kaydırma zaman çizelgesi
desteklenmeyen tarayıcıda **yedi maske birden görünmez** olurdu.

⚠️ **DERİNLİK RAYI ONARILDI (P07 görünür kıldı).** Ray yalnızca beş katmanı
gözlüyordu; okuyucu derin bir bölümdeyken son katmanın (Wandenreich)
derisini giyiyordu. Sayfa beyaza döndüğünde ray koyu tema token'larıyla
çizilip **okunmaz hâle geldi**. `DEEP_SECTION_LAYERS` eklendi
(`WorldSection.tsx`): gotei/zanpakuto/bankai → soul-society, hierarchy →
royal, hueco → hueco-mundo. `theme-color` da doğru katmandan okunuyor.
Bu düzeltme P03–P06'yı da kapsıyor.

**HAREKET KISITLI KİP.** Brief "7 aşamalı yatay adım göstergesi, kullanıcı
tıklayarak değiştirir" diyor. Karşılığı: başlıktaki **yedi düz sayfa içi
çapa**. JS yok, hareket yok, her kipte aynı şekilde çalışıyor ve
`reduce`ta maskeler tam opaklıkta duruyor.

**METİN HİÇBİR ZAMAN SÖNMÜYOR.** Maske kaydırmayla yanıp sönüyor, okunacak
şey değişmiyor — P06'nın kuralı.

**GÖRSEL YOK.** Maske bir fotoğraf değil bir ŞEMA; yedi durumu aynı çizim
diliyle yan yana koymanın tek yolu onları çizmek. Sıfır istemci JS; rota
paketi 20,4 kB → 21 kB (artış rayın haritası).

Canon: Plus 整, Chain of Fate 因果の鎖, çürüme 侵食, Hollow 虚, Arrancar 破面
"yırtılmış maske", Espada 十刃 "on kılıç" (numara 0–9, dövme). Adjuchas'ın
Vasto Lorde'a nasıl çıktığı canon'da **hiç açıklanmadı** → `rule` bunu
açıkça yazıyor. Espada karesine **rakam dövmesi çizilmedi**: herhangi bir
rakam belirli bir Espada'yı işaret ederdi, kadro ayrı bir kayıt (P08).

### 8.14 P08 — ESPADA · CEVAP VEREN ON (23 Ağustos 2026) ✅

**TEZ.** Naruto Evreni'ndeki karşılığı Akatsuki sergisi ve karar ona göre
**ters** kuruldu: orada merkez portre, burada merkez **numara**. Baraggan'ın
cümlesi bölümün tamamını taşıyor — her Espada ölümün ayrı bir yüzüne
hükmediyor, yani kadro bir galeri değil bir **tipoloji**.

**ASİMETRİ BİR SÜS DEĞİL ARGÜMAN.** Espada bir eşitler meclisi değil;
çembere dizmek "hepsi eşit uzaklıkta" derdi. Taht ortada (5×4 ızgarada
3×2 alan), Bir ve İki tahtın hemen yanında, Dokuz ve On en dışarıda.
Ölçüldü: satır 1 → 5·4·3, satır 2 → 6 … 2, satır 3 → 7 … 1, satır 4 →
8·9·10; taht 319–1033 px arasında ortalanmış.

⚠️ **GÖRSEL SIRA CSS'TE, OKUMA SIRASI DOM'DA.** `grid-area` yerleşimi
tamamen görsel; DOM güç sırası (Primera → Diez). Klavyeyle gezen kadroyu
sıralı okuyor. 900px altında ızgara düz listeye iniyor ve sıra DOM sırası
kalıyor — brief'in "1'den 0'a" kuralı kendiliğinden sağlanıyor.

**CERO BOYAMASI SAF CSS.** Hover/odakta bölümün `--world-glow`u o
Espada'nın cero rengine dönüyor. JS yok: on `--cero-N` kökte satır içi,
on `:has()` kuralı hangi kartın etkin olduğunu söylüyor. Ölçüldü:
`data-open="4"` → `--world-glow` `#7A0F14` iken `#1C7A3C` oluyor. Fare
çıkınca kendiliğinden geri alınıyor, temizlenecek durum kalmıyor
(brief'in kabul ölçütü). Geçiş 400ms — değişken anında dönüyor ama onu
**okuyan özellikler** geçişli.

⚠️ **CANON YİNE ÜÇ HATA YAKALADI:**
1. **Yammy 0 değil 10.** Dövmesi sol omzunda "10"; Resurrección'da "1"
   eriyor ve "0" kalıyor. Kayıt ikisini birden tutuyor (`rank` /
   `releasedRank`) — brief onu doğrudan 0 yazmıştı.
2. **Ulquiorra'nın yüzü "boşluk" değil 虚無 — hiçlik.**
3. **Sıra adları canon'un kendi içinde tutarsız:** Primera, Segunda,
   *Tres*, *Cuatro*, Quinta… Üç ve dört sıra sayısı değil asıl sayı.
   Düzeltilmedi.

**“reiatsuColor” DİYE BİR CANON VERİSİ YOK.** Brief onu istiyor ama canon
reiatsu rengini kaydetmiyor; kaydettiği şey **cero rengi** ve on kişinin
yedisi için yazılı (`Template:CeroColors`). Kalan üçü `attested: false` ve
arayüz bunu açıkça söylüyor: "canon yazmıyor — cero'ların varsayılanı
kızıl". Renk **adları** canon'dan, **değerleri** koyulaştırıldı: bölüm
beyaz zeminde geçiyor ve altın sarısı bir cero orada okunmuyordu.

**ON AYRI MASKE PARÇASI.** P07'nin son cümlesi "kalan parça hâlâ kimin ne
olduğunu söyler"di; o cümle parçalar gerçekten farklıysa doğru olur. Canon
her biri için ayrı bir yer yazıyor ve hepsi çizildi: Starrk'ın boynundaki
dişli çene, Baraggan'ın beş uçlu tacı, Nnoitra'nın göz bandı altındaki diş
halkası, Szayelaporro'nun gözlüğü, Aaroniero'nun sekiz delikli kapsülü.
**Dövmenin yeri de kayıtta** — Nnoitra'nınki dilinin üstünde, Starrk'ınki
sol elinin sırtında, Baraggan ve Szayelaporro'nunki bilinmiyor (`null`).

⚠️ **TEKİL SAHNE KENDİLİĞİNDEN AÇILMIYOR.** Brief "Ulquiorra'ya
tıklandığında" diyor; habersiz bir tam ekran devralma klavye ve ekran
okuyucu için tuzaktır. Kapı Ulquiorra panelinin sonunda açık bir düğme:
`「心か」`. Escape ile kapanıyor, odak düğmeye dönüyor.

⚠️ **4 SANİYELİK OTOMATİK ÇIKIŞ UYGULANMADI.** Kül dağılma animasyonu o
sürede etkisini tamamlıyor ama sahne kapanmıyor. Kendiliğinden kaybolan
metin yavaş okuyanı dışarıda bırakır ve brief'in kendi kalite tabanına
("hiçbir içerik erişilemez hâle gelmez") aykırı. Çıkış üç yoldan: tıkla,
Escape, kapat düğmesi.

**Sahnenin iki hex'i token'a çevrildi** (`--void` / `--bone`). Ölçüldü:
`rgb(7,7,10)` zemin + `rgb(233,228,217)` metin ≈ 16:1.

**On panel de DOM'da**, JS yalnızca hangisinin görüneceğini seçiyor —
sayfanın "JS olmadan boş görünmez" kuralı. Kül zerreleri `Math.random()`
ile değil deterministik bir karışımla üretiliyor (hidrasyon uyuşmazlığı
olmasın); `prefers-reduced-motion`'da dağılmış hâlleriyle sabit.

Rota paketi 21 kB → 24 kB (bölümün etkileşim adası).

### 8.15 P09 — WANDENREICH · GÖRÜNMEZ İMPARATORLUK (23 Ağustos 2026) ✅

**TEZ.** Sayfanın geri kalanı Japon estetiği; burası Avrupa gotiği ve
**çarpışmanın kendisi tasarım kararı**. Sivri kemer (`clip-path`, aynı
reçete `Atmospheres.arch` ile paylaşılıyor), altın hairline `#C9A227`, buz
mavisi `#8FB8D6`, derin lacivert zemin `#0C1016` — üçü de token, tek hex
bileşende yok. Her blokta soldan sağa uzayan **sert, blursuz gölge**
(Schatten Bereich).

Yapı yatay bir kadro değil **dikey bir hiyerarşi**: tepede Yhwach tek
başına, ortada beş kişilik Schutzstaffel, altta yirmi altı harf.

⚠️ **BRIEF'İN SCHRIFT LİSTESİ DÖRT YERDE YANLIŞTI.** Doğrulama olmasa
dördü de sayfaya girecekti:
1. **C · The Compulsory** PePe Waccabrada değil **Pernida Parnkgjas**.
2. **L · The Love** NaNaNa Najahkoop değil **PePe Waccabrada**.
3. **U · The Underbelly** brief'te hiç yok; taşıyıcısı **NaNaNa
   Najahkoop** — yani ikisi yer değiştirmiş.
4. Berenike değil **Berenice** Gabrielli.

⚠️ **"BOŞ HÜCRE" VARSAYIMI DA YANLIŞTI.** Brief K, N, R, W'nin boş
kalacağını varsayıyor. Oysa **yirmi altı harfin hepsinin taşıyıcısı
biliniyor**; açıklanmamış olan yalnızca **K ve N'nin Schrift ADI** (BG9 ve
Robert Accutrone). Yani hücre boş değil: taşıyıcı var, mührün adı yok.
Arayüz bunu kesikli çerçeve + "Mühür açılmadı" olarak çiziyor. Ölçüldü:
kesikli çerçeveli tam iki hücre var, K ve N.

⚠️ **ALFABE BİR EŞLEME DEĞİL.** Dört harfin iki taşıyıcısı var: A (Yhwach
*The Almighty* **ve** Uryū *Antithesis*), S (Mask + James), V (Gremmy +
Guenael), Y (Loyd + Royd). Kayıt bunu düzeltmiyor, gösteriyor.

⚠️ **KİMLİK ÇAKIŞMASI YAKALANDI.** Derin bölüm `#wandenreich` olamazdı —
o kimlik P02'deki **katmanın** kendisinde. Katmanın "İmparatorluğa gir"
bağlantısı da `#wandenreich`e, yani kendisine işaret ediyordu; hedef
`READY_SECTIONS`te olmadığı için bugüne kadar hiç çizilmemişti ve hata
görünmemişti. Bölüm **`#empire`** adını aldı, çapa düzeltildi,
`DEEP_SECTION_LAYERS`e eklendi.

**KLAVYE — brief'in "bu bölümü gerçekten kullanılır yapan" ayrıntısı.**
Roving tabindex (ızgaranın tamamı TEK sekme durağı; yirmi altı ayrı durak
sayfayı gezen birini boğardı), ok tuşlarıyla gezinme, Home/End ve **A–Z
tuşuyla doğrudan o mühre atlama**.

⚠️ **SÜTUN SAYISI SABİT YAZILMADI.** Izgara 13 → 7 → 4 sütuna iniyor ve
yukarı/aşağı ok tuşları o anki sütun sayısını **DOM'dan ölçüyor** (ilk
hücreyle aynı `offsetTop`u paylaşan hücreleri sayarak). Ölçüm iki
kırılmada da doğrulandı: 1440px'te 13, 360px'te 4. Sabit yazılsaydı dar
ekranda ok tuşları yanlış hücreye giderdi — P06'daki dersin aynısı.

⚠️ **OKUMA PLAKASI HÜCRENİN İÇİNDE DEĞİL.** Brief Schrift adını ve
taşıyıcıyı hücreye koyuyor; on üç sütunda hücre 84px ve o metin 7px'e
düşüyordu. Kayıt ızgaranın altındaki sabit plakada açılıyor (yer ayrılmış,
CLS = 0). Plaka `aria-hidden`: her hücre zaten kendi kaydını **erişilebilir
adı** olarak taşıyor ("F · The Fear · Äs Nödt"), yoksa ekran okuyucu her
harfte aynı şeyi iki kez duyardı.

**DOKUNMATİK:** hücre `<button>` ve tıklamayla sabitleniyor
(`aria-pressed`) — `BankaiHall`de öğrenilen ders.

**GOTİK DENETİM KENDİ YORUMUMU KIRMIZIYA DÜŞÜRDÜ.** `check-bleach-fonts`
gotik sınıfı **anan** her satırda Türkçe karakter arıyor ve yorum olup
olmadığına bakmıyor; `WandenreichSection` başlığındaki açıklama satırı
düştü. Yorum yeniden yazıldı. Betik işini yapıyor — commit öncesi koştur.

Hücreler 1440px'te 84×84, 360px'te 77×77 — ikisi de 44px dokunma hedefinin
üstünde. Rota paketi 24 kB → 25,1 kB.

⚠️ **DOĞRULANAMAYAN TEK ŞEY:** klavye gezinmesinin kendisi. Anlık görüntü
statik HTML (React yok) ve tarayıcı paneli gerçek uygulamayı hidre
edemiyor. Tip denetimi ve lint temiz, riskli kısım olan sütun ölçümü
gerçek DOM'da iki kırılmada doğrulandı; ok tuşlarının canlıda elle
sınanması gerekiyor.

### 8.16 P10 — RUHSAL GÜÇ SİSTEMİ (23 Ağustos 2026) ✅

**TEZ.** Naruto Evreni'nde karşılığı tek bir şema (chakra + doğa
dönüşümü). Bleach'te **üç ırk, üç sistem, üç ayrı tasarım dili** ve aynı
bölümde üç görsel gramerin bulunması bölümün tezi.

⚠️ **YENİ PALET İCAT EDİLMEDİ.** Sütunlar sayfanın zaten ölçülmüş
katmanlarını giyiyor: 死神 → `soul-society` (mürekkep + haori kızılı),
虚 → `hueco-mundo` (**negatif**: beyaz zemin, siyah metin),
滅却師 → `wandenreich` (gotik buz + altın). Bölümün kendisi **katmansız**
(brief'in "dünya: nötr" şartı) ve taban deri `[data-world="bleach"]`.
Ölçüldü: bölüm `rgb(7,7,10)`, sütunlar sırasıyla `#0B0B0D` / `#EFEDE7` /
`#0C1016`, aksanlar `#BA1B23` / `#0A0A0A` / `#C9A227`.

**ORTAK RİTİM.** Üç ayrı palet ama tek `--rhythm` değişkeni ve tek
`--measure`: kaos değil disiplinli farklılık (brief'in kabul ölçütü).
Sütunlar arasında **dikey hairline yok** — birbirine değmeyen üç ada.
`transition: none` ölçüldü: geçiş ani, fade yok.

**ÜÇ SÖZCÜK OMURGA.** Bölümün adı "ruhsal güç" ve canon bunu üçe ayırıyor:
霊力 gücün kendisi, 霊子 maddesi, 霊圧 dışarı vuran ağırlığı. Üçü
sütunlardan önce geliyor çünkü karıştırıldıklarında geri kalan her şey
bulanıklaşıyor.

⚠️ **BRIEF'İN BİRİNCİ SÜTUNU DÜZELTİLDİ.** Brief 斬魄刀'yu dört sanattan
biri gibi listeliyor; Zanpakutō bir **silah**, sanat değil. Dört sanat
斬術 · 白打 · 歩法 · 鬼道 ve kılıç ayrı bir blokta duruyor. Kazanç:
canon'da dördünün toplu adı var — **「斬」「拳」「走」「鬼」 Zankensoki**.

⚠️ **Blut Arterie 滅血装 DEĞİL 動血装.** Hafızadan yazılsaydı yanlış kanji
girecekti.

**⚡ BÖLÜMÜN EN İYİ KARARI: CANON KURALINI SEMANTİĞE BIRAKMAK.** Brief
Blut için "iki düğümlü toggle, biri açıkken diğeri söner" istiyor. Canon
kuralı (Urahara, ch. 499): saldırı ve savunma iki ayrı reishi sistemi ve
**aynı anda açılamıyorlar**. Bu, bir `<input type="radio">` grubunun
tanımının ta kendisi. JS ile taklit edilmedi: tarayıcı zaten böyle
çalışıyor, klavye gezinmesi (ok tuşları) bedava geliyor ve **bölümde tek
satır istemci kodu yok**.

⚠️ **YANLIŞ SİNYALLE BİR DEĞİŞİKLİK YAPILDI, SONRA DOĞRUSU ANLAŞILDI.**
İlk yazımda girdi etiketin içindeydi ve `:has(:checked)` gerekiyordu;
panelde stil güncellenmediği görülünce kardeş yazıma (`input:checked +
label`) geçildi. Sonra ölçüldü: **kardeş yazım da aynı şekilde
güncellenmiyordu** — sorun `:has()` değil, tarayıcı panelinin durum
değişiminde stili tazelememesi. Yani sinyal bir ortam artefaktıydı.
Karar yine de korundu (daha az seçici bağımlılığı), ama koddaki yorum
gerçeğe göre düzeltildi. **Ders: bu panelde `getComputedStyle` durum
değişiminden sonra bayat; doğrulamayı `element.matches()` ile yap.**
Öyle yapıldı: kural metni ve her iki durumda doğru etiketin eşleştiği
doğrulandı.

**DOKUNMATİK:** Kidō formülleri geniş ekranda hover/odakla açılıyor,
`hover: none` cihazlarda **baştan açık** (ölçüldü: 360px'te üç satır da
gerçek yükseklikte). BankaiHall'de öğrenilen ders.

**360px:** üç sütun yığılıyor, pentagram 480px altında gizleniyor
(düğümlerin metni zaten şemanın altında ayrı duruyor), taşma yok.

Rota paketi 25,1 kB → 25,8 kB — artışın tamamı sunucu tarafı; bölüm
istemciye tek satır JS eklemiyor.

### 8.17 P11 — MASKE DUVARI (23 Ağustos 2026) ✅

**TEZ.** Bleach denince akla maske gelir. Bu bölüm bir kadro değil bir
**duvar**: bir çizgiye asılı sekiz maske, altlarında kısa gölgeler. Küçük
(748px masaüstünde) ama sayfanın en fotojenik parçası.

⚠️ **ÜÇÜNCÜ BİR MASKE GRAMERİ İCAT EDİLMEDİ** — devir notunun kendi
uyarısı. `eye()` ve `mouth()` ilkelleri `HollowMask`tan **dışa açıldı** ve
buradan kullanıldı; Ulquiorra ile Grimmjow'un kalıntıları ise
`MaskFragment`taki path'lerin **ta kendisi**. Aynı kalıntıyı iki bölümde
iki farklı biçimde çizmek, P07'nin "kalan parça kimin ne olduğunu söyler"
cümlesini yalanlardı.

⚠️ **İTHAL PATH'LER YENİDEN ÇİZİLMEDİ, YENİDEN ÇERÇEVELENDİ.** Ölçüldü:
P08'de dev bir rakamın üstüne oturmak üzere yazılmış oldukları için
Ulquiorra'nın boynuzu kadrajın 8 birim dışında kalıp kırpılıyor,
Grimmjow'un çenesi sağa yaslanıyordu. Çözüm bir `transform` — aynı çizim,
farklı çerçeve. Doğrulandı: sekiz maskenin sekizi de 120×120 kutunun
içinde.

**MASKELER CANON'DAN ÇİZİLDİ.** Dört Visored maskesinin tarifi fandom'dan
alındı ve her biri gerçekten ayırt edilebilir oldu: Ichigo'nun **sol**
yanındaki üç şerit, Shinji'nin firavun başlığı, Kensei'nin **iki sütun
hâlinde altı yarık gözü**, Hiyori'nin alnının **ortasındaki** tek boynuzu
ve kaş üstü baklava dizisi, Nelliel'in **sol** çatlağı ve **kırılmış dört
dişi**. Hafızadan çizilseydi hiçbiri bu kadar belirgin olmazdı.

⚠️ **NELLIEL'İN AĞZI `mouth()` İLE ÜRETİLMEDİ** ve bu bilinçli: yardımcı
dişleri eşit dağıtıyor, oysa maskesinin ayırt edici yanı dişlerin **sol
yarıda olmaması**. Bant elle yazıldı.

**SEKİZİNCİ MASKENİN SAHİBİ YOK.** 名も無き — Rukongai'de ölen ve kimsenin
aramadığı ruhlar. Yedi tanınmış yüzün yanına bir isimsiz koymak duvarı bir
hayran vitrininden bir kayda çeviriyor. Künyesi **hep açık**: bölümün alt
metni bir hover'ın arkasında beklemez.

**AD HOVER'DA BELİRMİYOR, HEP DURUYOR.** Brief adı hover'a saklıyor; sekiz
maskede bu, kimin kim olduğunu öğrenmek için hepsinin üstünden geçmek ve
dokunmatikte hiç öğrenememek demekti. Hover yalnızca parlatıyor.

**Bağlantı yalnızca hedef varsa:** üçünün `#espada` karşılığı var, kalan
beşi bağlantısız `<div>` — tıklanınca hiçbir yere gitmeyen bir `<a>`,
bağlantı olmayan bir şeyden kötüdür.

**Sıfır JS.** Sallanma (0 → −2° → 1,5° → 0, 900ms) ve dolgu CSS hover/odak;
`prefers-reduced-motion`'da sallanma yok, dolgu kalıyor. Masaüstü 8'li tek
sıra → 1100px altında 4×2 → 640px altında **yatay kaydırmalı duvar**
(sayfa taşmıyor, duvar kendi içinde kayıyor: 1381px içerik, 320px pencere).

⚠️ **İKİ CSS HATASI ÖLÇÜMLE YAKALANDI — biri P10'da.**
1. `grid-template-rows: 0fr` ile kapanma, çocuğa **`min-height: 0`**
   yazılmadan çalışmıyor: ızgara ögesinin otomatik en-az boyutu blok
   ekseninde içeriğe göre hesaplanıyor ve `overflow: hidden` tek başına
   onu sıfırlamıyor. Kapalı olması gereken künye 89px duruyordu.
2. **Daha kötüsü P10'daydı:** `grid-template-rows: 0fr` yalnızca **ilk**
   satırı boyutlandırıyor. Kidō formüllerinin üç `<li>`si doğrudan ızgara
   ögesiydi, diğer ikisi **örtük** satır olarak `auto` boyutta açık
   kalıyordu — liste hiç kapanmıyordu (102px). Kapanmayı taşıyan ızgaranın
   **tek çocuğu** olmalı; bir sarmalayıcı eklendi.

**DERS:** `0fr` daralması iki şart istiyor — kapanan ızgaranın tek çocuğu
olacak ve o çocukta `min-height: 0` bulunacak. İkisinden biri eksikse
kapanma sessizce olmuyor; gözle fark edilmiyor, `getBoundingClientRect`
ile fark ediliyor.

Rota paketi 25,8 kB → 26 kB.

### 8.18 P12 — BİN YILLIK KAN SAVAŞI (23 Ağustos 2026) ✅

**TEZ.** Naruto Evreni'ndeki "Dönemler" halkasının karşılığı ama bir halka
değil bir savaş. Asıl fikir renk: bölüm boyunca sayfa **siyahtan kana**
dönüyor — `#0B0B0D` → `#EFEDE7` → `#4A0D12` → `#7A0F14`. Soldaki çizgi
aynı sırada parçalanıyor (40/0 → 22/6 → 12/10 → 5/14 px) ve düğüm biçim
değiştiriyor: **nokta → çentik → çatlak → yarık** (8 → 14 → 14 → 18px).
Hepsi ölçüldü.

⚠️ **BRIEF'İN İNTERPOLASYONU MATEMATİKSEL OLARAK İMKÂNSIZ.** Brief geçişin
scroll ilerlemesine bağlı olarak ara kareleri interpole etmesini istiyor
**ve** aynı listede "hiçbir noktada kontrast 4.5:1'in altına düşmez"
diyor. İkisi bir arada olamaz: siyah zeminde metin açık, beyaz zeminde
koyu olmak zorunda; ikisini eşzamanlı çapraz geçirirseniz yolun ortasında
hem zemin hem metin orta griye gelir ve kontrast **1:1**'e iner. Ara
değer seçmek bunu kurtarmıyor — geçişin kendisi kurtarılamaz.

**Karar:** zemin **dört durakta sert kesiliyor**, her durağın kendi
eksiksiz token seti var. Kayıp yalnızca yumuşaklık; kazanç, okunmayan
bir metnin İMKÂNSIZ olması. Sert kesme zaten sayfanın P10'da verdiği
karar. Brief'in `reduced-motion` yedeği de tam olarak bu ("4 sabit adım"),
yani ayrı bir dal bile gerekmedi.

⚠️ **YENİ PALETLER DENETİME BAĞLANDI.** İlk iki durak için yeni renk
yazılmadı: `#0B0B0D` ve beyaz zaten `soul-society` ile `hueco-mundo`
katmanları. Yalnızca iki kan zemini yeni ve `[data-layer]` değil
**`[data-blood]`** kimliğinde — kan bir dünya değil, bir bölümün
ilerleyişi; seçici `[data-world="bleach"]` altına kilitli.

**`scripts/check-bleach-contrast.mjs` genişletildi: 60 kontrol / 6 palet →
80 kontrol / 8 palet.** Sayfanın en riskli iki zemini (kırmızı üzerine
metin) artık gözle değil betikle garanti. İlk çalıştırmada temiz geçti.

⚠️ **`<time>` KULLANILMADI.** Brief `<ol>` + `<time>` istiyor. `<ol>`
yerinde; `<time>` ise ya makine okur bir `datetime` ister ya da içeriğinin
geçerli bir tarih dizesi olmasını. Buradaki değerler göreli ("bin yıl
önce") ya da sayı bile değil (九〇〇 · 九〇 · 九). Uydurma bir `datetime`
etiketi yalancı yapardı; sıralamayı `<ol>` zaten taşıyor.

**CANON — sayılar üslup değil kayıt.** Yhwach mühürlendikten sonra **900**
yılda nabzını, **90** yılda aklını, **9** yılda gücünü geri aldı; Kaiser
Gesang'ın ikinci kıtası "**9 günde** dünyayı" diyor. Bölümün ritmi bu
diziden çıkıyor. ⚠️ Brief Yamamoto–Yhwach karşılaşmasıyla Quincy
soykırımını aynı satırda anıyor; kayıt ayırıyor — biri **bin yıl** önce,
diğeri **iki yüz yıldan fazla** önce, aralarında sekiz yüz yıl var.

**Düğüm ve çizgi hizası ölçüldü:** dokuz düğümün merkezi de tek bir
dikeyde (masaüstünde 81px, 360px'te 29px) ve çizginin merkeziyle aynı.
Sıfır JS; 360px'te taşma yok.

Rota paketi 26 kB → 26,2 kB.

### 8.19 P13 — EFSANELER (23 Ağustos 2026) ✅

**TEZ.** Naruto Evreni'nde bunun karşılığı **numaralı** bir kart dizisi
(01, 02, 03…). Burada numara yok, kart da yok: on isim arasında bir sıra
değil bir **denge** var. Tam genişlik satırlar, aralarında yalnızca birer
hairline.

**İMZA ETKİLEŞİM.** Bir isme gelindiğinde satır değil **bütün bölüm**
değişiyor: zemin o karakterin reiatsu rengine kayıyor (%12), diğerleri
geriye çekiliyor, satırın arkasında dev kanji beliriyor, sağdaki yapışkan
panelde portresi ve biyografisi açılıyor. Geçiş asimetrik — gelmesi
500ms, gitmesi 900ms (brief'in değerleri).

⚠️ **SIFIR JS, VE BUNU MÜMKÜN KILAN ŞEY SEMANTİK.** Satırlar bir yere
gitmiyor (`<a>` olamaz) ve tıklanınca bir şey yapmayan `<button>` de
yanlış olurdu. Doğru semantik **seçim**: gizli radyo grubu + `<label>`.
Klavye desteği, dokunmatik ve "aynı anda yalnızca biri" kuralı üçü de
tarayıcıdan bedava geliyor. P10'daki Blut anahtarının aynı deseni —
o turda öğrenilen şey burada bütün bölümü taşıdı.

⚠️ **%25 DEĞİL %55.** Brief seçili olmayan isimlerin %25 opaklığa
düşmesini istiyor. Hesaplandı: kemik beyazı metin siyah zeminde %25'te
~2,4:1, yani okunmuyor. %55'te 4,95:1 — hâlâ belirgin biçimde geride ama
okunabilir. Geri çekilme hissinin ağırlığı **künyeye** yüklendi; o metin
değil bir etiket ve kırpılabilir.

⚠️ **İKİ HATA SSR ÇIKTISINDA VE DOĞRULAMADA YAKALANDI:**
1. **Türkçe, İngilizce sayfaya sızmıştı.** Kenpachi'nin etiketine
   "Bankai · kayıt yok" yazılmıştı; `tags` alanı çevrilmeyen özel adlar
   için ve oraya Türkçe bir ibare koymak `/en` sayfasında Türkçe basmak
   demek. Etiket kaldırıldı — bilgi zaten iki dilde de biyografide.
   **Denetim yöntemi devralınabilir:** `/en` çıktısında bölümü kesip
   Türkçe diyakritik ara, kanji içerenleri ele.
2. **Ichibē'nin tekniği 白打 değil しら筆一文字.** Hafızadan yazılmıştı;
   白打 Hakuda'nın kanjisi. Fandom düzeltti.

**Brief'in "Sonsuz Hüzün" unvanı canon'da bulunamadı** → yerine Kyōka
Suigetsu'nun canon'daki yeteneği kondu: **完全催眠**, tam hipnoz. Uydurma
bir unvan, doğru bir yetenekten zayıftır.

**İki "kayıt yok" gizlenmedi:** Aizen'in Bankai'ı canon'da hiç
açıklanmadı, Kenpachi'ninki adsız. İkisi de biyografide açıkça yazıyor.

**Reiatsu renklerinden ikisi neredeyse siyah** (Yhwach `#1A1A20`, Ichibē
`#0A0A0A`) ve koyu zeminde atmosfer onlarda neredeyse susuyor. Arıza
değil: biri gölge, diğeri mürekkep.

**Portreler küratör yuvasında** — on yuva manifestoda zaten tanımlıydı
(`bleach:legend:<slug>`), boşken `typographic` yedeği çiziliyor.

⚠️ **DOĞRULAMA YÖNTEMİ (P10'un dersi uygulandı):** tarayıcı panelinde
durum değişiminden sonra `getComputedStyle` bayat. Onun yerine
`element.matches(seçici)` kullanıldı ve şunlar kanıtlandı: 13 `:has()`
kuralı ayrıştı, Yamamoto seçiliyken `panel[2]` gösterme kuralına uyuyor
ve `panel[0]` uymuyor, `row[0]` sönme kuralına uyuyor, `row[2]` etkin
kuralına uyuyor.

360px'te tek sütun, panel yapışkanlıktan çıkıyor, etiket yüksekliği
113px (dokunma hedefi tamam), taşma yok. Rota paketi 26,2 → 26,5 kB.

### 8.20 P14 — ASİL HANELER (23 Ağustos 2026) ✅

**TEZ.** Naruto Evreni'ndeki "Klanlar"ın karşılığı ama **bilinçli olarak
daha küçük**. Bleach'te klanlar o kadar merkezi değil ve bölüm bunu
tasarımla itiraf ediyor: altı işaret, tek satır, kısa. Büyük bir soy
ağacı yok.

⚠️ **BRIEF'İN ALT BLOĞU İKİ YERDE YANLIŞTI — VE DÜZELTMESİ HİKÂYEYİ DAHA
İYİ YAPTI.**
1. Canon'da **五大貴族 değil 四大貴族**: beş değil **DÖRT** Büyük Asil Hane.
2. Brief üçünü adlandırıp ikisini redakte ediyor. Canon yalnızca **ikisini**
   adlandırıyor (Kuchiki, Shihōin); üçüncü ve dördüncü için wiki'nin tek
   cümlesi var: *"No information about this house has been revealed."*

Ve sayı meselesinin canon'daki çözümü brief'in sezgisini haklı çıkarıyor:
**Shiba hanesi bir zamanlar BEŞİNCİ büyük haneydi** ve Kaien'in ölümünden
sonra düştü. Beş vardı, dördü kaldı, o dördün ikisinin adı arşivde yok.
Redakte blok bir üslup numarası değil, kaydın gerçek hâli — ve hover'da
titriyor ama **açılmıyor**, çünkü açılacak bir şey yok.

⚠️ Tsunayashiro'nun kanji'si 津奈木代 değil **綱彌代**; ayrıca ana seride
değil yan eserlerde geçiyor ve kayıt bunu söylüyor.

⚠️ **ARMALAR CANON DEĞİL VE BÖLÜM BUNU YAZIYOR.** Canon bu haneler için
mon yayımlamıyor. Altı işaret her hanenin **canon'daki uzmanlığından**
türetildi (Kuchiki'nin kayıt tutuculuğu, Shiba'nın havai fişeği, Ise'nin
şinto ayinleri…) ve bölümün altında tek satırlık bir künye bunu söylüyor.
Arşiv uydurmaz; uydurduğunda da söyler.

⚠️ **`0fr` DARALMASI BURADA TUTMADI.** P10 ve P11'de çalışan
`grid-template-rows: 0fr` yöntemi — tek çocuk ve `min-height: 0` şartları
sağlandığı hâlde — künyeleri **119–155px açık** bıraktı (ölçüldü,
`getBoundingClientRect`). Sebebi aranmadı: bu bölümün yüksekliği tezin
parçası, yani kapanmanın çalıştığı **kesin** olmalı. `max-height` kaba ama
belirlenimci; tavan ölçülerek seçildi (en uzun künye 155px → 16rem).
Fixten sonra altı kutunun altısı da **0px**.

⚠️ **70vh ŞARTI TAM TUTTURULAMADI — sayı olduğu gibi:** bölüm 1440×900'de
**732px = 81vh**. Başlangıçta 1089px (121vh) idi; kapanma düzeltmesi ve
metin/boşluk sıkılaştırmasıyla buraya indi. Daha aşağısı ya sayfanın on
dört bölümde paylaştığı başlık ölçeğini bozmayı ya da armaların canon
olmadığını söyleyen satırı atmayı gerektiriyordu; ikisi de yapılmadı.
1080px yüksekliğinde aynı bölüm 68vh, yani ölçüt ekran boyuna bağlı.
Sayfadaki **en kısa bölüm** olması hedefi tutturuyor.

⚠️ **ÖLÇÜM TUZAĞI (yeni ve yazılmalı):** tarayıcı paneli **yeniden
boyutlandırmadan sonra medya sorgusu kurallarını her özellik için
yeniden uygulamıyor.** 360px'e küçültünce sütun sayısı değişti ama
`max-height` eski değerinde kaldı; **sayfayı o genişlikte yeniden
yükleyince** doğru değer (256px) geldi. Dar ekran doğrulaması yaparken
resize değil **yeniden yükleme** kullan.

360px'te iki sütun, künyeler baştan açık (hover yok), taşma yok.
Rota paketi 26,5 → 26,8 kB. Sıfır JS.

### 8.21 P15 — MEKÂNLAR (23 Ağustos 2026) ✅

**TEZ.** Mekânlar dünyalarına göre gruplanıyor ve **her grup kendi
dünyasının derisini giyiyor**: tek bölümde beş tema kayması, yani sayfanın
mini bir özeti. Ölçüldü — beş grubun beş ayrı zemini var (`#0A0E14` /
`#0B0B0D` / `#06060A` / `#EFEDE7` / `#0C1016`), aksanlar sırasıyla sodyum
turuncusu, haori kızılı, kemik beyazı, siyah ve altın. 23 mekân.

⚠️ **DEVİR NOTUM YANLIŞTI, BRIEF DÜZELTTİ.** Not "bu bölüm görsel
ağırlıklı olacak, küratör sözleşmesini hatırla" diyordu. Brief'in kendi
kabul ölçütü tam tersi: **"Görsel yok (bilinçli): bu bölüm tamamen
tipografik. Sayfada zaten çok görsel var; burası nefes alma alanı."**
Manifestoya `locations` yuvası **eklenmedi** — eklenseydi küratör
panelinde sonsuza kadar "eksik görsel" satırı olarak dururdu.
**Ders: devir notundaki tahmini brief'e sormadan uygulama.**

**RAY KRİTERİ SIFIR YENİ KODLA KARŞILANDI.** Brief: "Grup geçişlerinde
tema kayması Depth Rail'i de günceller." Beş grubun kimliği
`DEEP_SECTION_LAYERS`e yazıldı; ray zaten o defteri gözlüyor (P07'de
kurulan mekanizma). Bölüm kendini deftere yazdırdı, o kadar.

⚠️ **BRIEF'İN REIŌKYŪ LİSTESİNDE BİR SARAY OLMAYAN AD VARDI:**
**Ichimonji bir saray değil**, Ichibē Hyōsube'nin Zanpakutō'su (P13'te de
öyle kayıtlı). Kraliyet katındaki üç saray canon'da: **麒麟殿** (Kirinji,
şifa kaplıcaları) · **臥豚殿** (Hikifune, mutfak) · **鳳凰殿** (Nimaiya,
her Zanpakutō'nun doğduğu yer).

⚠️ **İki ad daha düzeldi:**
  • Karakura Lisesi 空座高校 değil **空座一校** (Karakura Ikkō).
  • Kurosaki Kliniği'nin tabelası kanji değil **katakana**: クロサキ医院.
    (Bu bir hata değil canon'un kendi ayrıntısı ve metne girdi.)

⚠️ **Wahrwelt bir Wandenreich şehri değil, REIŌKYŪ'NUN KENDİSİ:** Yhwach
kraliyet sarayını ele geçirip 真世界城'e dönüştürdü. Kayıt onu Wandenreich
grubunda tutuyor ama bunu açıkça söylüyor — aynı sarayı iki gruba birden
koymak okuyucuyu kaybettirirdi.

**Sıfır JS.** Tema değişimi nitelik + kalıtım. 900px altında iki sütun teke
iniyor, beş deri aynen kalıyor (tema kayması bölümün tezi), taşma yok.
Rota paketi 26,8 → 27 kB.

### 8.22 P16 — KILICIN ÇİZELGESİ (23 Ağustos 2026) ✅

**TEZ.** Klasik bir arc zaman çizelgesi DEĞİL. Hikâye **Ichigo'nun
kılıcının değişimi** üzerinden anlatılıyor: zaman çizelgesi ve karakter
gelişimi tek tasarımda birleşiyor. Beş arc, beş kılıç, beş renk — ve
sayfanın kapanışı.

⚠️ **KILIÇ GERÇEKTEN MORPH EDİYOR VE BUNU MÜMKÜN KILAN ŞEY P04'TÜ.**
Ekranın ortasında **tek bir path** var; `d` özelliği kaydırmaya bağlı bir
animasyonla beş biçim arasında geçiyor. Beş biçimi ayrı ayrı çizmek bunu
imkânsız kılardı — iki path ancak **aynı komut dizisine** sahipse
birbirine dönüşür. Bu yüzden yeni bir kılıç grameri yazılmadı:
`BladeSilhouette`in `bladePath()` şablonu (dokuz düğüm, altı sayı) aynen
kullanıldı. **O dosya tam olarak bunun için vardı.**

⚠️ **VERİ `@keyframes`E SATIR İÇİ DEĞİŞKENLE GİRDİ.** Arc renkleri bir
tema token'ı değil VERİ ve veri CSS dosyasına yazılmaz (kural 16). Çözüm:
`--blade-0…4` ve `--arc-0…4` bileşenden satır içi geliyor, keyframes
`var()` ile okuyor. Doğrulandı — beş keyframe de
`d: var(--blade-N); fill: var(--arc-N)` olarak ayrıştı, `--blade-0`
gerçek bir `path("M46.6 200 …")` değerine çözüldü ve path'e **bir
animasyon bağlandı**.

**Zemin arc'a göre kayıyor** ve geçişler sert (P12/P15'in aynı kararı).
Ölçüldü: living → soul-society → hueco (beyaz) → **living** →
wandenreich. ⚠️ Dördüncüsü tekrar `living` ve bu bir hata değil arc'ın
kendisi: The Lost Agent baştan sona Karakura'da geçiyor — Ichigo gücünü
kaybediyor ve hikâye eve dönüyor.

⚠️ **ARC'LAR EKRANDAN UZUN OLMAK ZORUNDA** (`min-height: 120svh`):
yapışkan kılıcın sabit durduğu bir pencere ancak öyle oluşuyor. P07'de
ölçülen aynı kural.

**MOTTO EKRANI DOLDURULMADI.** Brief: "en az 60vh boşluk taşır,
doldurmaya çalışma." Ölçüldü: masaüstünde **78vh**, 360px'te **62vh**, ve
içinde iki satırdan başka hiçbir şey yok.

**Sıfır JS.** Morph `animation-timeline: view()`, zemin nitelik +
kalıtım, arc'lar arası geçiş başlıktaki beş çapa — brief'in
`reduced-motion` yedeği ("beş sabit görsel, tıklayarak arc değiştirme")
her kipte zaten karşılanıyor. Rota paketi 27 → 27,4 kB.

### 8.23 P17 — ANİME HUB GİRİŞ KARTI (23 Ağustos 2026) ✅

⚠️ **BU BÖLÜMÜN BÜYÜK KISMI ZATEN YAPILMIŞTI.** Kart, altyapı turunda
(23 Ağustos, kullanıcı isteğiyle) `/anime` hub'ına konmuştu ve brief'in
istediklerinin çoğunu zaten karşılıyordu. Bu tur bir **denetim** turu
oldu: brief madde madde mevcut kodla karşılaştırıldı.

**Zaten yerinde olanlar** (ölçüldü, değiştirilmedi):
- Dikey yarılma: iki yarı `clip-path: inset(0 50% 0 0)` / `inset(0 0 0 50%)`,
  hover'da ±8px ters yönlere kayıyor.
- Yarıktan sızan ışık: `riftSeam`, kapalıyken 0 genişlik ve 0 opaklık,
  geçiş süresi **0,42s** — brief'in 420ms değeri, `cubic-bezier(.16,1,.3,1)`.
- Yarılma ölçeklemenin YERİNE geçiyor (`.bleach:hover { scale: 1 }`):
  ikisi aynı anda çalışırsa hareket bulanık bir "büyüyüp açılma"ya
  dönüşüyor ve yarık okunmuyor.
- `prefers-reduced-motion`: kayma yok, yalnızca aydınlanma.
- Metinler brief'le birebir aynı (TR ve EN), her iki dilde de doğru
  adrese bağlı (`/anime/bleach`, `/en/anime/bleach`).

**Eksik olan tek şey ve bu turda eklendi: 卍 rozeti.** Akatsuki kartındaki
`.kanji` deseninin aynısı kullanıldı (fırça ailesi, %14 → hover %26) —
hub'ın kart dili tek olmalı; Bleach kartını ayıran şey rozet değil
yarılma. Doğrulandı: rozet iki dilde de basılıyor, Yuji Boku ile
diziliyor, 128px.

⚠️ **BRIEF'İN İKİ MADDESİ ARAŞTIRILDI VE İŞ ÇIKMADI:**
1. *"Görsel: Ichigo'nun hero görselinin kırpılmış hâli (aynı varlığı
   yeniden kullan — LCP avantajı)."* Hero **bir küratör yuvası** ve
   depoda karşılığı yok (`bleach:hero:ichigo` içinde `src` tanımlı değil),
   yani yeniden kullanılacak bir dosya yok. Kart bunun yerine Bleach
   sayfasının **Seireitei katmanıyla aynı** depo karesini kullanıyor —
   brief'in asıl amacı (tek indirme + kart ile sayfa arasında görsel bağ)
   zaten sağlanmış durumda.
2. *"Sol menüdeki 'Evrenler' listesine ekleme YAPMA — önce mevcut
   konvansiyonu doğrula."* Doğrulandı: o liste `SiteFooter` içinde ve
   **`fetchUniverses()` ile backend'den** geliyor, elle tutulan bir menü
   değil. Yani eklenecek bir şey yok; konvansiyon kararı kendisi veriyor.

### 8.24 Sırada

`/anime/bleach` iskelet olarak duruyor ve **hiçbir yerden linkli değil**
(`robots: noindex`). Sıradaki tur **P-TOKENS**: beş dünya paleti, derinlik
rayı, Senkaimon geçişi, dört yeni font. Manifesto o turda bölüm bölüm
büyüyecek.
