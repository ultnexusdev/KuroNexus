# Faz 2 · Dalga 1 — Attack on Titan + GTO (5 sayfa)

> Önce `docs/ANIME-FAZ2-SOZLESME.md` oku. Bu dosya yalnızca **senin
> karakterinin kilitli eksenleri** ve paletidir. Kilidin dışına çıkma;
> içinde istediğin kadar zenginleştir.

Dalga içi kural: bu beş sayfa **görüntü fontunu, ızgarasını, hareket dilini
ve düğme mekaniğini paylaşamaz.** Aşağıda hepsi ayrı ayrı verildi.

| # | Karakter | AniList | Klasör | Bileşen | Veri dosyası |
|---|---|---|---|---|---|
| 1 | Eren Yeager | 40882 | `eren-yeager` | `RumblingExperience` | `eren-yeager-experience.ts` |
| 2 | Mikasa Ackerman | 40881 | `mikasa-ackerman` | `ScarfExperience` | `mikasa-ackerman-experience.ts` |
| 3 | Armin Arlert | 46494 | `armin-arlert` | `HorizonExperience` | `armin-arlert-experience.ts` |
| 4 | Levi Ackerman | 45627 | `levi` | `PrecisionExperience` | `levi-experience.ts` |
| 5 | Eikichi Onizuka | 434 | `eikichi-onizuka` | `TrackingExperience` | `eikichi-onizuka-experience.ts` |

Rota dosyaları **zaten yazıldı** — bileşeni yukarıdaki adla export etmen
yeterli. Rotaya dokunma.

---

## 1 · Eren Yeager — `eren-yeager` · önek `--ern-`

**Fikir:** özgürlük ile yıkımın aynı şey olması. Sayfa duvarın içinde dar
başlıyor, dışarı çıktıkça genişliyor ve genişlik bir bedelle geliyor.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Ufuk bandı.** Sayfa boyunca sabit yükseklikte yatay bir "duvar üstü" çizgisi; bölümler dönüşümlü olarak çizginin ÜSTÜNDE ve ALTINDA. Tek kolon değil, iki kolon değil — yatay şerit. |
| **Tipografi** | Başlık `var(--font-anton)`, ALL CAPS, sıkışık (`letter-spacing: -0.01em`), çok büyük. Gövde `var(--font-petrona)`. |
| **Hareket** | **Titan buharı + kristalleşme.** Bölüm girişlerinde alttan yükselen sıcak buhar katmanı (`mask-image` + `translateY`); kartların kenarı `clip-path` poligonla kristal kırılması. |
| **Düğme** | **"Duvarın ardı"** — `data-beyond="wall" \| "sea"`. `wall`: dar ölçü, sepya, ufuk yüksek. `sea`: ölçü genişler, ufuk yukarı kayar, palet kızıla döner. Sadece renk değil **genişlik ve oran** değişecek. |
| **Filigran** | Dikey `進撃` + **elle çizilmiş SVG duvar dişleri** (dolgusuz kontur, `aria-hidden`). |
| **Mekanik** | **"Yürüyüş."** Beş adım. Her adımda arka plandaki dev siluetlerin **SAYISI** katlanıyor (1 → 10 → 100 → 1000 → sayısız) ve metin sütunu daralıyor. Yani ilerledikçe söz azalıyor, kalabalık artıyor. |

**Yasak:** "ısınan ray" (Naruto), "yükselen basamaklar/ölçek" (Madara).
Senin ekseni **yoğunluk**, ölçek ya da sıcaklık değil.

```css
.page[data-world="eren-yeager"] {
  --bg: #0e0b09;
  --surface: #181310;
  --surface-hover: #201a16;
  --border: #28211c;
  --border-strong: #39302a;
  --text-primary: #d1cbc7;
  --text-secondary: #9c897c;
  --text-muted: #9a7f6d;
  --accent: #b13e2f;
  --accent-hover: #c36255;
  --accent-muted: #361f1c;
  --gold: #b68e54;
  --warn: #b88347;
  --danger: #c26459;
  /* kendi --ern-* token'ların buraya */
}
```

---

## 2 · Mikasa Ackerman — `mikasa-ackerman` · önek `--mks-`

**Fikir:** kırmızı atkı sayfanın tek renk aksanı ve tek sürekli çizgisi.
Palet çelik grisi; skarlat yalnızca atkıda ve accent'te.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Sol kenarda sayfa boyunca inen tek dikey çizgi** (atkı). Bütün bölümler o çizgiye asılı, tek kolon, sol boşluk sabit. |
| **Tipografi** | Başlık `var(--font-jost)`, ALL CAPS, **geniş harf aralığı** (`0.18em`), orta ağırlık — soğuk ve düzenli. Gövde `var(--font-cormorant)`; alıntılar italik. |
| **Hareket** | **ODM kablo geometrisi.** Bölümler arası bağlantılar SVG çizgi; `stroke-dasharray`/`stroke-dashoffset` ile çiziliyor. Yumuşak değil, gergin ve düz. |
| **Düğme** | **"Ackerman uyanışı"** — `data-awake`. Açıkken `filter: contrast(1.25) saturate(0.6)`, gri tonlar çekilir, atkı çizgisi kalınlaşır, kart kenarları keskinleşir. |
| **Filigran** | `家族` (aile) + **SVG örgü/dokuma deseni** (`<pattern>`, atkı dokusu). |
| **Mekanik** | **"Kanca açısı."** Üç kademeli dairesel açı seçici (0° / 22° / 45°). Seçilen açı `--mks-angle` CSS değişkenini değiştiriyor ve **bölüm kartlarının dizilim eğimi** onunla dönüyor. Tek kontrol, sayfa geneli geometri. |

**Yasak:** "kopan zincir halkaları" (Kushina) — senin çizgin kopmuyor,
**eğiliyor**.

```css
.page[data-world="mikasa-ackerman"] {
  --bg: #0b0b0c;
  --surface: #131416;
  --surface-hover: #191b1d;
  --border: #202225;
  --border-strong: #2f3235;
  --text-primary: #c8ccd0;
  --text-secondary: #818c98;
  --text-muted: #768593;
  --accent: #bc5c66;
  --accent-hover: #bf8288;
  --accent-muted: #3f2c2e;
  --gold: #768593;
  --warn: #b88347;
  --danger: #c26459;
  /* kendi --mks-* token'ların buraya */
}
```

---

## 3 · Armin Arlert — `armin-arlert` · önek `--arm-`

**Fikir:** strateji ve deniz. Aynı olay, beş farklı okuma.

| Eksen | Kilit |
|---|---|
| **Izgara** | **İki kolon, asimetrik.** Solda dar, **yapışkan** (`position: sticky`) bir not defteri sütunu; sağda geniş içerik. 900 px altında tek kolona iner (not sütunu üste). |
| **Tipografi** | Not sütunu `var(--font-plexmono)`, küçük, satır numaralı hissi. Gövde `var(--font-inter)`. Başlıklar gövde fontunun ağır kesimi — büyük değil, **sakin**. |
| **Hareket** | **Dalga + kum.** Yatay `background-position` kayması (deniz), üstünde ince bir tanecik (noise) katmanı. Ani hiçbir şey yok. |
| **Düğme** | **"Kolosal buhar"** — `data-mode="analysis" \| "ruin"`. `analysis`: iki kolon, soluk mavi, harita çizgileri. `ruin`: iki kolon **tek kolona çöker**, palet ısınır, not sütunu kaybolur. Düzen değişikliği zorunlu. |
| **Filigran** | **Elle çizilmiş SVG harita konturları** (kıyı çizgisi, izohips) + `海`. |
| **Mekanik** | **"Aynı olay, beş okuma."** Sol sütunda beş hipotez. Bir hipoteze tıklandığında **sağdaki aynı olayın metni baştan yazılıyor** — düzen sabit kalır, yorum değişir. Beşi de okununca "hangisi doğruydu" satırı açılır. |

**Yasak:** "çevrilen el yazması sayfaları" (Jiraiya). Sende sayfa
çevrilmiyor, **metin yerinde değişiyor**.

⚠️ **Accent 30 Ağustos'ta DÜZELTİLDİ.** İlk değer `#8eadc2` idi ve
yayındaki Megumi sayfasının accent'ine (`#8fa6bf`) yalnızca **8 birim**
uzaktaydı — `check-karakter-kontrast.mjs` bunu HATA sayıyor (eşik 15).
Megumi Dalga 5'te yeniden yazılacak ama o zamana kadar eski palet yerinde
duruyor, yani çakışma gerçek. Yeni değer bütün 65 accent'e en az **38**
birim uzakta. Aşağıdaki blok geçerli olan.

```css
.page[data-world="armin-arlert"] {
  --bg: #0b0d0f;
  --surface: #121619;
  --surface-hover: #191d20;
  --border: #1f2428;
  --border-strong: #2d3439;
  --text-primary: #c7cdd1;
  --text-secondary: #7c8f9c;
  --text-muted: #6f889b;
  --accent: #7cc0d5;
  --accent-hover: #a0ccd9;
  --accent-muted: #355964;
  --gold: #ae925b;
  --warn: #b88347;
  --danger: #c2665b;
  /* kendi --arm-* token'ların buraya */
}
```

---

## 4 · Levi Ackerman — `levi` · önek `--lvi-`

**Fikir:** minimalizm ve kesinlik. Sayfa neredeyse boş; boşluk tasarımın
kendisi. Bu, dalganın **en az öğe taşıyan** sayfası olmalı.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Dar tek kolon** (`max-width: 34rem`), bölümler arasında **çok büyük** dikey boşluk (`clamp(8rem, 20vh, 14rem)`). Kart yok, kutu yok — yalnız çizgi ve metin. |
| **Tipografi** | Başlık `var(--font-bebas)`, ALL CAPS, dar ve sıkı, **küçük** (diğer sayfaların aksine başlık büyük değil). Gövde `var(--font-jost)`, küçük punto, yüksek satır aralığı. |
| **Hareket** | **Dönen ODM bulanıklığı.** Geçişte kısa bir `rotate` + `blur`, sonra **tam durgunluk**. Sayfada sürekli hareket eden hiçbir şey olmayacak. |
| **Düğme** | **"Pişmanlıksız seçim"** — `data-clean`. Açıkken sayfadaki **ikinci dereceden bilgi tamamen kaldırılır** (yardımcı metin, etiketler, ikonlar); yalnız çekirdek cümleler kalır. |
| **Filigran** | **Tek ince SVG kanat arması** (Survey Corps), yalnız kontur, dolgusuz, çok büyük ve çok soluk. Kanji YOK — bu sayfada Japonca filigran kullanma. |
| **Mekanik** | **"Boşluk."** Sayfa tek bir cümleyle açılıyor. Her tıklama bir bilgi **ekliyor**, ama görünürde **en fazla üç şey** durabiliyor: dördüncü geldiğinde en eskisi siliniyor. Kullanıcı neyi tutacağını seçiyor. Sabit kapasiteli görünüm. |

**Yasak:** "karanlıkta fener" (Itachi), "5 hamlelik zincir" (Shikamaru).
Senin ekseni **kapasite ve unutma**.

```css
.page[data-world="levi"] {
  --bg: #0c0d0d;
  --surface: #141516;
  --surface-hover: #1b1d1e;
  --border: #222425;
  --border-strong: #313335;
  --text-primary: #c9cccf;
  --text-secondary: #848c94;
  --text-muted: #7b8691;
  --accent: #989ea4;
  --accent-hover: #9db1c8;
  --accent-muted: #3b4754;
  --gold: #7b858e;
  --warn: #b88347;
  --danger: #c26459;
  /* kendi --lvi-* token'ların buraya */
}
```

---

## 5 · Eikichi Onizuka — `eikichi-onizuka` · önek `--onz-`

**Fikir:** **bu sayfa listedeki en aykırı olan olmalı.** Fantezi yok, güç
yok, gerçek dünya ve komedi. 90'lar yankee/manga estetiği.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Kart kolajı.** Düzensiz, hafifçe döndürülmüş (`rotate(-1.5deg)`, `rotate(2deg)`…) manga panelleri / polaroidler. Hizalı ızgara YOK — bilerek dağınık ama 360 px'te taşmayan. |
| **Tipografi** | Başlık `var(--font-numeral)` (Archivo Black), çok kalın, hafif eğik, **halftone dokulu**. Gövde `var(--font-inter)`. Ara notlar el yazısı hissi için `var(--font-corinthia)` KULLANMA — o Midoriya'nın; bunun yerine mono etiketler. |
| **Hareket** | **VHS gren + tarama.** Yatay kayma bandı (tracking), halftone nokta deseni, hafif renk kayması (chromatic). Yumuşak fade YOK — sert kesme. |
| **Düğme** | **"Ders zili"** — `data-bell="class" \| "street"`. `class`: paneller düzleşir (döndürme sıfırlanır), palet sararır, mono etiketler. `street`: paneller daha çok döner, gren artar, asfalt tonu basar. |
| **Filigran** | **Elle çizilmiş SVG motosiklet silueti** + kara tahta dokusu (yalnızca DOKU). Kanji: `鬼塚`. |
| **Mekanik** | **"VHS izleme çubuğu."** Yatay bir kaset scrubber (gerçek `<input type="range">` ya da beş `<button>`); pozisyon değiştikçe o pozisyondaki olay beliriyor, aralarda tracking gürültüsü geçiyor. |

⚠️ **Iruka zaten "kara tahta + tebeşirle yazılan beş ders" mekaniğini
kullanıyor.** Sende kara tahta **yalnızca doku**; mekanik kaset çubuğu.

```css
.page[data-world="eikichi-onizuka"] {
  --bg: #12110f;
  --surface: #1c1a17;
  --surface-hover: #23211e;
  --border: #2b2924;
  --border-strong: #3b3833;
  --text-primary: #d1cec7;
  --text-secondary: #9a917e;
  --text-muted: #948871;
  --accent: #ccb333;
  --accent-hover: #c9b85e;
  --accent-muted: #37321b;
  --gold: #ba814f;
  --warn: #b88347;
  --danger: #c4695f;
  /* kendi --onz-* token'ların buraya */
}
```

---

## Nexus bağları (bu dalgada zorunlu)

Sayfalar birbirine bağ versin — `isExperienceCharacter(id)` ile kontrol
edip `/dark-stories/category/anime/karakterler/<id>` adresine `Link`:

- Eren ↔ Mikasa ↔ Armin (çocukluk üçlüsü) ↔ Levi
- Onizuka'nın bağı yok (GTO kadrosunda tek) — bunun yerine anime arşivindeki
  seri sayfasına bağ ver.
