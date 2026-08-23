# BLEACH EVRENİ — P00 KEŞİF RAPORU

> Tarih: 23 Ağustos 2026 · Kapsam: `/anime/bleach` (+ `/en/anime/bleach`)
> Bu oturumda **kod yazılmadı.** Aşağıdaki her madde depodan okundu.

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

### 8.6 Sırada

`/anime/bleach` iskelet olarak duruyor ve **hiçbir yerden linkli değil**
(`robots: noindex`). Sıradaki tur **P-TOKENS**: beş dünya paleti, derinlik
rayı, Senkaimon geçişi, dört yeni font. Manifesto o turda bölüm bölüm
büyüyecek.
