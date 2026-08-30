# Faz 2 · Dalga 3 — Bleach (6 sayfa)

> Önce `docs/ANIME-FAZ2-SOZLESME.md` oku. Bu dosya yalnızca **senin
> karakterinin kilitli eksenleri** ve paletidir.

Dalga içi kural: bu altı sayfa **görüntü fontunu, ızgarasını, hareket
dilini ve düğme mekaniğini paylaşamaz.**

| # | Karakter | AniList | Klasör | Bileşen | Veri dosyası |
|---|---|---|---|---|---|
| 11 | Rukia Kuchiki | 6 | `rukia-kuchiki` | `ShirayukiExperience` | `rukia-kuchiki-experience.ts` |
| 12 | Renji Abarai | 906 | `renji-abarai` | `ZabimaruExperience` | `renji-abarai-experience.ts` |
| 13 | Uryū Ishida | 564 | `uryuu-ishida` | `QuincyExperience` | `uryuu-ishida-experience.ts` |
| 14 | Ulquiorra Cifer | 1081 | `ulquiorra-cifer` | `HollowExperience` | `ulquiorra-cifer-experience.ts` |
| 15 | Grimmjow Jaegerjaquez | 1080 | `grimmjow-jaegerjaquez` | `DesgarronExperience` | `grimmjow-jaegerjaquez-experience.ts` |
| 16 | Yoruichi Shihōin | 908 | `yoruichi-shihouin` | `ShunkoExperience` | `yoruichi-shihouin-experience.ts` |

Bu evrenin terminolojisi: **Zanpakutō · Asauchi · Shikai · Bankai · Kidō
(Hadō / Bakudō) · Shunpo · Hollow / Arrancar / Espada · Resurrección ·
Cero · Hierro · Quincy: Blut, Vollständig, Heilig Pfeil**. Naruto ya da
JJK terminolojisi kullanma.

⚠️ Bu dalgada **dört Bleach sayfası zaten yayında** (Ichigo, Urahara,
Aizen, Kenpachi). Onların mekanikleri: maske çatlağı + beş kademeli kimlik
seçici / 3×3 açılan çekmece / iki gerçeklik katmanı + kırık ayna / çentikli
kılıç rayı. Hiçbirine yaklaşma.

---

## 11 · Rukia Kuchiki — `rukia-kuchiki` · önek `--ruk-`

**Fikir:** Sode no Shirayuki, "en güzel zanpakutō". Beyaz üstüne beyaz.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Ortalanmış, dar, dikey ritimli tek kolon** — ama bölümler arasında **kar birikintisi** gibi genişleyen yatay bantlar var. Bölüm başları sayfanın tam ortasında, gövde metni hafifçe sola kaçık (kar üzerinde iz gibi). |
| **Tipografi** | Başlık `var(--font-shippori)` (mincho — Japon serif'i), ince kesim, **çok geniş satır aralığı**. Gövde `var(--font-cormorant)`. Sayfa ışıklı ve hafif görünmeli. |
| **Hareket** | **Kar taneciği.** Yavaş, seyrek, aşağı süzülen küçük parçacıklar (CSS animasyon, en fazla ~14 tanecik). Ayrıca kenarlarda buz kristali büyümesi (`clip-path`). Sert hiçbir şey yok. |
| **Düğme** | **"Ay ışığı"** — `data-moon`. Açıkken zemin bir kademe **açılıyor** (koyudan aydınlığa; bu dalgada tersine giden tek sayfa), gölgeler mavileşiyor, kar taneleri yoğunlaşıyor. |
| **Filigran** | **Kuchiki klan arması** (elle çizilmiş SVG, ince kontur) + `袖白雪`. |
| **Mekanik** | **"Üç dans."** *Some no mai, Tsukishiro* / *Tsugi no mai, Hakuren* / *San no mai, Shirafune* — tıklanabilir. Her dans sayfaya **kalıcı bir kar katmanı** ekliyor; üçü de yapılınca zemin tamamen beyazlaşıyor ve **kontrast tersine dönüyor** (koyu metin, açık zemin). Geri alma var ama katman katman. |

⚠️ Kontrast tersine döndüğünde metnin okunabilirliği bozulmamalı: ters
durum için `--ruk-*-text` ailesi tanımla ve o durumda metin onları okusun.

```css
.page[data-world="rukia-kuchiki"] {
  --bg: #0b0c0e;
  --surface: #131517;
  --surface-hover: #1a1c1f;
  --border: #212327;
  --border-strong: #2f3237;
  --text-primary: #c7cad1;
  --text-secondary: #7e889a;
  --text-muted: #7b869b;
  --accent: #c2c7d1;
  --accent-hover: #d5dbe7;
  --accent-muted: #5e6c87;
  --gold: #737fa5;
  --warn: #b88347;
  --danger: #c26459;
  /* kendi --ruk-* token'ların buraya */
}
```

---

## 12 · Renji Abarai — `renji-abarai` · önek `--ren-`

**Fikir:** Zabimaru eklemli bir kılıç — **sayfa düzeni de eklemli aksın.**

| Eksen | Kilit |
|---|---|
| **Izgara** | **Zikzak.** Bölümler sırayla sola ve sağa kayık (`margin-inline-start` dönüşümlü), aralarında onları bağlayan **eklem** parçaları var. Sayfayı yukarıdan aşağı okurken göz zikzak çiziyor. Dövme çizgileri bölüm ayıracı olarak kullanılıyor. |
| **Tipografi** | Başlık `var(--font-brush)` (Yuji Boku — fırça), büyük. Gövde `var(--font-inter)`. Fırça yalnız başlıkta; gövde temiz kalsın. |
| **Hareket** | **Eklem açılması.** Yeni bölüm gelirken eklem parçaları sırayla uzuyor (`scaleX` zinciri, kısa gecikmelerle). Ayrıca dövme çizgileri `stroke-dashoffset` ile çiziliyor. |
| **Düğme** | **"Bankai"** — `data-release="shikai" \| "bankai"`. `shikai`: eklemler kısa, zikzak dar. `bankai`: eklemler uzuyor, zikzağın genliği **artıyor** (sayfa daha geniş salınıyor), kemik beyazı omurga motifi beliriyor. |
| **Filigran** | **Elle çizilmiş SVG dövme deseni** (Renji'nin alnındaki/gövdesindeki çizgiler) + `蛇尾丸`. |
| **Mekanik** | **"Uzat."** Her tıklamada zincir **bir eklem daha uzuyor** ve o eklem sayfada **yeni bir bölüm açıyor**; zikzağın yönü her eklemde değişiyor. Yani mekanik sayfanın kendi düzenini uzatıyor. Altı eklem = Renji'nin altı kademesi. |

**Yasak:** Neji'nin "2→64 ardışık vuruş sayacı", Konohamaru'nun "dikey
devir zinciri", Kenpachi'nin "çentikli kılıç rayı". Seninkinde uzayan şey
**sayfanın düzeninin kendisi** ve yön değiştiriyor.

```css
.page[data-world="renji-abarai"] {
  --bg: #0d0b0a;
  --surface: #171312;
  --surface-hover: #1f1918;
  --border: #26201f;
  --border-strong: #372f2d;
  --text-primary: #d1c9c7;
  --text-secondary: #9c837c;
  --text-muted: #9e7c73;
  --accent: #db3624;
  --accent-hover: #d65f51;
  --accent-muted: #3c1a16;
  --gold: #9d8e6c;
  --warn: #b88347;
  --danger: #c26459;
  /* kendi --ren-* token'ların buraya */
}
```

---

## 13 · Uryū Ishida — `uryuu-ishida` · önek `--ury-`

**Fikir:** Quincy geometrisi ve terzilik. İki hassasiyet: nişan ve dikiş.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Katı hassas ızgara.** Görünür ince ızgara çizgileri (blueprint gibi), her bölüm ızgaraya tam oturuyor, hiçbir şey serbest değil. Köşelerde artı (+) işaretleri. Uraraka'nın serbest yüzen alanının tam zıddı. |
| **Tipografi** | Başlık `var(--font-gothic)` (UnifrakturMaguntia — blackletter; Quincy'nin Alman kimliği). Gövde ve etiketler `var(--font-plexmono)`. İkisinin çelişkisi sayfanın kimliği: gotik + teknik. |
| **Hareket** | **Nişangâh kilitlenmesi.** Reticle halkaları dönerek daralıyor ve hedefe "kilitleniyor" (kısa, mekanik, sıçramalı). Ayrıca dikiş çizgisi (`stroke-dasharray` ile teyel deseni) ilerliyor. |
| **Düğme** | **"Blut"** — `data-blut="vene" \| "arterie"`. `vene` (savunma): ızgara çizgileri kalınlaşır, kutular kapanır. `arterie` (saldırı): ızgara inceliyor, nişangâhlar açılıyor, mavi haçlar keskinleşiyor. |
| **Filigran** | **Quincy haçı** (elle çizilmiş SVG, beş uçlu) + `滅却師`. |
| **Mekanik** | **"Nişangâh."** Sayfa bir hedefleme arayüzü. Beş hedef var; bir hedefe tıklandığında reticle ona kilitleniyor, hedef **büyütülüp ölçüleniyor** (mesafe, açı, ok sayısı okumaları yan panelde beliriyor) ve o hedefin metni açılıyor. Zoom + ölçüm ekseni. |

```css
.page[data-world="uryuu-ishida"] {
  --bg: #0a0b0f;
  --surface: #111319;
  --surface-hover: #181a21;
  --border: #1e2029;
  --border-strong: #2c2f3a;
  --text-primary: #c7c9d1;
  --text-secondary: #7c839c;
  --text-muted: #7b83a3;
  --accent: #4a5fb5;
  --accent-hover: #727fb6;
  --accent-muted: #212430;
  --gold: #7d828c;
  --warn: #b88347;
  --danger: #c26459;
  /* kendi --ury-* token'ların buraya */
}
```

---

## 14 · Ulquiorra Cifer — `ulquiorra-cifer` · önek `--ulq-`

**Fikir:** boşluk. Göğsündeki delik layout'ta **gerçek bir boşluk** olacak.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Kasıtlı büyük negatif alanlar.** Sayfanın ortasında, bölümlerin etrafından dolandığı **gerçek bir boşluk** var (grid'de boş hücre / `shape-outside` ya da grid alanı boş bırakılarak). İçerik deliğin çevresine yerleşiyor. Bu dalganın en boş sayfası. |
| **Tipografi** | Başlık `var(--font-cormorant)`, **çok büyük ve çok ince** (300), harf aralığı geniş. Gövde `var(--font-inter)`, küçük. Sessiz ve soğuk. |
| **Hareket** | **Gözyaşı izi.** Dikey, yavaş, tek yönlü akan ince çizgiler (Ulquiorra'nın yeşil gözyaşı hatları). Başka hiçbir hareket yok — sayfa neredeyse hareketsiz. |
| **Düğme** | **"Kalp nerede?"** — `data-heart`. Açıkken sayfadaki tüm metinler bir kademe soluyor ve **soru** metinleri öne çıkıyor (Ulquiorra'nın cevap değil soru soran hâli). |
| **Filigran** | **Delik** — filigran nesnesi bizzat boşluğun kendisi: deliğin kenarında `虚` (hollow) ve ince bir SVG halka. Dolu bir simge kullanma. |
| **Mekanik** | **"Kalp."** Ortadaki delik bir sayaç. Her bölüm deliğe bir **cevap** veriyor (tıklanınca); cevap biriktikçe delik **küçülüyor**. Ama son cevapta delik kapanmıyor — **sayfanın tamamı kadar büyüyor** ve içeriği yutuyor, geriye tek bir cümle kalıyor. Negatif alanın kendisi değişken. |

```css
.page[data-world="ulquiorra-cifer"] {
  --bg: #0b0b0b;
  --surface: #141414;
  --surface-hover: #1b1b1b;
  --border: #222222;
  --border-strong: #323232;
  --text-primary: #cccccc;
  --text-secondary: #8f8a8a;
  --text-muted: #8c8282;
  --accent: #4acf97;
  --accent-hover: #73cea8;
  --accent-muted: #244738;
  --gold: #858585;
  --warn: #b88347;
  --danger: #c26459;
  /* kendi --ulq-* token'ların buraya */
}
```

---

## 15 · Grimmjow Jaegerjaquez — `grimmjow-jaegerjaquez` · önek `--grm-`

**Fikir:** vahşilik. Pençe yırtıkları bölümleri **fiziksel olarak** yırtsın.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Yırtılmış katmanlar.** Bölümler tam genişlikte üst üste binmiş bantlar; her bandın alt kenarı `clip-path` ile **düzensiz yırtık**. Hizalı kutu yok, her kenar kırık. |
| **Tipografi** | Başlık `var(--font-numeral)` (Archivo Black) — ama Bakugō'daki eğik kullanımın aksine **düz, çok büyük ve kırpılmış** (üstten/alttan `clip-path` ile kesilmiş harfler). Gövde `var(--font-jost)`. |
| **Hareket** | **Yırtma.** Geçişler `clip-path` ile yırtılarak açılıyor (fade YOK). Kısa, sert, düzensiz zamanlama. |
| **Düğme** | **"Resurrección"** — `data-ressurect`. Açıkken yırtıklar derinleşir, elektrik mavisi doygunlaşır, kenarlarda pençe izi gölgeleri belirir, başlıklar bir kademe büyür. |
| **Filigran** | **Elle çizilmiş SVG pençe izi** (üç/dört paralel yırtık) + `破面` ve Espada numarası `6`. |
| **Mekanik** | **"Desgarrón."** Beş pençe, beş kart. Her pençeye basıldığında sayfa `clip-path` ile **fiziksel olarak yırtılıyor** ve yırtığın altından bir sonraki kart görünüyor. Yırtıklar **birikimli** — beşi de açılınca sayfa parçalı bir kolaja dönüşüyor. |

```css
.page[data-world="grimmjow-jaegerjaquez"] {
  --bg: #090c0e;
  --surface: #111517;
  --surface-hover: #171c1f;
  --border: #1d2327;
  --border-strong: #2b3338;
  --text-primary: #c7cdd1;
  --text-secondary: #7c8f9c;
  --text-muted: #6d879a;
  --accent: #3fa0d5;
  --accent-hover: #6aaed2;
  --accent-muted: #203946;
  --gold: #609da9;
  --warn: #b88347;
  --danger: #c26459;
  /* kendi --grm-* token'ların buraya */
}
```

---

## 16 · Yoruichi Shihōin — `yoruichi-shihouin` · önek `--yor-`

**Fikir:** iki beden, tek kişi. Künyenin bir kısmı kedi formunda anlamsız
hâle geliyor — sayfanın esprisi bu.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Yatay kayan şeritler.** Bölümler tam genişlikte yatay bantlar; her bant kendi içinde **yatay kaydırılabilir** bir içerik dizisi taşıyor (`overflow-x: auto`, kaydırma yakalama). Dikey akış + yatay okuma. |
| **Tipografi** | Başlık `var(--font-petrona)`, **italik** ve büyük — hız hissi. Gövde `var(--font-inter)`. Künye satırları `var(--font-plexmono)` (tablo hissi). |
| **Hareket** | **Art-görüntü (afterimage).** Hareket eden öğe arkasında 2–3 soluk kopya bırakıyor (`box-shadow` katmanları ya da sözde öğeler). Shunpo hissi: başlangıç ve bitiş görünüyor, ara yok. |
| **Düğme** | **"Kedi formu"** — `data-form="human" \| "cat"`. Bu düğme künye şeridini ve hero kadrajını **değiştiriyor**. |
| **Filigran** | **Shihōin klan arması** (elle çizilmiş SVG) + `瞬神` (shunshin). |
| **Mekanik** | **"İki beden, tek künye."** Form değiştiğinde künye şeridindeki satırlar **tek tek** çevriliyor (boy, kilo, ses, hız…). Ama bazı satırlar kedi formunda **anlamsız** hâle geliyor ve griye düşüp "—" gösteriyor (kıyafet bedeni, kılıç ölçüsü gibi). Veri tablosunun geçerliliğini kaybetmesi. Espri buradan çıkıyor: aynı kişi, ölçülemeyen yarısı. |

**Yasak:** Minato'nun "Hiraishin ile anlık gezinme"si. Sende gezinme yok;
art-görüntü yalnızca **hareket dili**, mekanik künye tablosunda.

```css
.page[data-world="yoruichi-shihouin"] {
  --bg: #0e0b0f;
  --surface: #171219;
  --surface-hover: #1f1920;
  --border: #261f28;
  --border-strong: #362d39;
  --text-primary: #cfc7d1;
  --text-secondary: #947c9c;
  --text-muted: #9879a2;
  --accent: #a74ab5;
  --accent-hover: #ad72b6;
  --accent-muted: #2e2130;
  --gold: #d0ad39;
  --warn: #b88347;
  --danger: #c26459;
  /* kendi --yor-* token'ların buraya */
}
```

---

## Nexus bağları (bu dalgada zorunlu)

- Renji ↔ Rukia (çocukluk arkadaşları) — **çift yönlü**
- Rukia ↔ Ichigo (#5), Renji ↔ Ichigo, Uryū ↔ Ichigo
- Ulquiorra ↔ Grimmjow (Espada), Grimmjow ↔ Ichigo
- Yoruichi ↔ Urahara (#210), Yoruichi ↔ Aizen (#1086)
