# Faz 2 · Dalga 2 — My Hero Academia (5 sayfa) · RAPOR

> Brief: `docs/ANIME-FAZ2-DALGA2.md` · Sözleşme: `docs/ANIME-FAZ2-SOZLESME.md`
> Dal: `anime/faz2-dalga2-bitir` (`main` tabanlı) · Tarih: 31 Ağustos 2026
>
> **Faz 2'nin son dalgası.** Bununla 29 sayfanın hepsi bitti.

---

## 0. Bu dalga neden ayrı bir hikâye

Dalga 2 iki kez yarıda kaldı. Devir notu durumu "worktree'lerde commit'siz
duruyor" diye kaydetmişti; **ölçünce farklı çıktı** — sonraki bir oturum beş
worktree'nin işini `wip(...)` commit'i olarak toplamıştı. Yani kayıp yoktu,
yalnızca iş yarımdı.

### Gerçek durum (ölçüldü, devralınmadı)

| Karakter | Veri | Ana bileşen | Adalar | CSS modülü |
|---|---|---|---|---|
| Midoriya | ✅ 1170 | ❌ **hiç yazılmamış** | ✅ 3 | ❌ |
| Bakugō | ✅ 1004 | ✅ 693 | ✅ 3 | ❌ |
| Todoroki | ✅ 970 | ❌ **hiç yazılmamış** | ✅ 2 | ❌ |
| Uraraka | ✅ 962 | ✅ 704 | ✅ 3 | ❌ |
| All Might | ✅ 954 | ✅ 782 | ✅ 3 | ❌ |

Eksik iş **502 tanımsız CSS sınıfı** ve **iki hiç yazılmamış ana bileşen**di.
Sayı tahmin değil: `check-karakter-sinif.mjs` her `styles.X` okumasını CSS'te
arıyor ve eksikleri tek tek listeliyor — ajanların kontrol listesi bu oldu.

### `ce7692d` / `bb36a2d` neden merge edilmedi

Devir notunun uyarısı haklıydı. O commit beş rotayı ve kaydı yazmıştı ama
bileşenler yoktu: `tsc` beş TS2307 veriyordu, `check-karakter-kayit` beş
"bileşen dosyası YOK" basıyordu. **Kayıt bir sözdür** — "bu adres çalışıyor"
demektir.

Bunun yerine: `anime/faz2-dalga2-bitir` dalı güncel `main`'den (`146cb4d`)
açıldı, beş `wip` commit'i **cherry-pick** edildi (yalnızca bileşen/veri
dosyalarına dokunuyorlar, çakışma çıkmadı), kayıt ve rota **bileşenler
tamamlandıktan sonra** yazıldı. `ce7692d`'nin *içeriği* korundu — o commit'in
yoldaş listeleri ve numaraları doğruydu, yalnızca zamanlaması yanlıştı.

---

## 1. Beş sayfa

Beş ayrı worktree, beş ayrı dal, beş ajan. Her ajana **farklı bir referans
sayfa** verildi (Nanami / Nobara / Getō / Eren / Onizuka) ki beşi aynı ev
desenine yakınsamasın.

| # | Karakter | Dal | Bileşen | CSS | Commit |
|---|---|---|---|---|---|
| 6 | Izuku Midoriya | `midoriya-bitir` | `NotebookExperience` | 1723 | `94010af` |
| 7 | Katsuki Bakugō | `bakugou-bitir` | `DetonationExperience` | 1879 | `a4db2c9` |
| 8 | Shōto Todoroki | `todoroki-bitir` | `HalfAndHalfExperience` | 2090 | `db6ed77` |
| 9 | Ochako Uraraka | `uraraka-bitir` | `ZeroGravityExperience` | 2043 | `48e02e9` |
| 10 | Toshinori Yagi | `allmight-bitir` | `PlusUltraExperience` | 2316 | `9c77673` |

⚠️ **Beş ajanın beşi de oturum limitine takılıp düştü** ve hiçbiri commit'e
ulaşamadı. Ama işleri diskteydi: dördü kendi sayfasında **sıfır tanımsız
sınıf**la bitmişti. Denetlenip merkezde commit'lendiler; yalnızca Todoroki'nin
CSS modülü kalmıştı ve ikinci bir ajanla tamamlandı. **Bu yüzden aşağıdaki
sayılar ajan raporlarından değil, koddan ölçülmüştür** — dört ajanın raporu
limitle birlikte kayboldu.

### 6 · Izuku Midoriya — `izuku-midoriya` · `--mid-`

`NotebookExperience.tsx` (736, **yeni yazıldı**) · `.module.css` (1723, yeni) ·
`AnalysisShell.tsx` (131, istemci) · `VestigeStack.tsx` (267, istemci) ·
`MidoriyaGlyphs.tsx` (215, sunucu SVG) · veri (1170)

**Küratör:** 16 `mid:` anahtarı — `hero`, `defter`, `one-for-all`, `full-cowl`,
`shoot-style`, `vestige`, `detroit`, `delaware`, `manchester`, `st-louis`,
`kader-teshis`, `kader-kurbagcik`, `kader-ua`, `kader-plaj`,
`kader-yapiskan`, `closing`.

**Ayrışma:** kareli kağıt zemin + **asimetrik iki kolon** (solda geniş içerik,
sağda dar kenar-not sütunu). Font kümesi `petrona/inter/plexmono/corinthia` —
**`--font-corinthia` (el yazısı) bu dalgada yalnızca burada**. Düğme
(`data-analysis`) düzeni değil **içeriği** çoğaltıyor: kapalıyken hiç olmayan
kenar notları, ok işaretleri ve ölçüm etiketleri ekleniyor. Mekanik: sekiz
vestige **kümülatif** birikiyor ve **geri alınabiliyor** (Orochimaru'nun
soyulan katmanlarının tersi, Jiraiya'da sayfa çevriliyordu — burada
çevrilmiyor).

### 7 · Katsuki Bakugō — `katsuki-bakugou` · `--bkg-`

`DetonationExperience.tsx` (693) · `.module.css` (1879, **yeni**) ·
`DetonationShell.tsx` (169, istemci) · `RecoilDeck.tsx` (234, istemci) ·
`BakugouGlyphs.tsx` (138, sunucu SVG) · veri (1004)

**Küratör:** 16 `bkg:` anahtarı — `hero`, `hero-adi`, `bakuha`, `suishin`,
`bracer`, `sezgi`, `mutfak`, `notlar`, `rakipler`, `stage`,
`fate-ortaokul`, `fate-avuc`, `fate-festival`, `fate-kamino`,
`fate-dynamight`, `closing`.

**Ayrışma:** hazard şerit ızgarası (45° uyarı bantları), **sert köşeler,
hizasız bloklar**. Font kümesi `jost/shippori/numeral` — Archivo Black **dolu,
eğik, negatif harf aralıklı**. Şok dalgası halkaları; yumuşak geçiş yok.
Mekanik **etki-tepki**: kart ileri fırlarken sayfa gövdesi ters yöne kayıyor.

### 8 · Shōto Todoroki — `shouto-todoroki` · `--tdr-`

`HalfAndHalfExperience.tsx` (740, **yeni yazıldı**) · `.module.css` (2090,
yeni) · `SplitShell.tsx` (istemci, bölünme oranı mekaniği) ·
`TodorokiGlyphs.tsx` (144, sunucu SVG) · veri (970+)

**Küratör:** 17 `tdr:` anahtarı — `portrait`, `hero`, `hanrei`, `hannen`,
`taion`, `daihyokaisho`, `heroname`, `rank`, `suisenwaku`, `wariai`,
`fate-kessaku`, `fate-gosai`, `fate-yakedo`, `fate-taiikusai`,
`fate-sonogo`, `kizuna`, `closing`.

**Ayrışma:** sayfanın tamamını yöneten **tek sürekli oran**. `.split` iki iz,
`gap` yok — yüzdeler tam 100 ediyor (`gap` 360 px'te taşırırdı), nefes payı
sütunların kendi dolgusundan. Ölçüldü: çizgi 632 px, buz sütunu sağ kenarı
633, alev sütunu sol kenarı 633 — birebir çakışıyor. Sayfada **aynı anda iki
ayrı hareket dili**: solda `clip-path` ile büyüyüp eriyen kristal, sağda
`filter: blur()` + mikro `scaleY` ile yerinde titreyen ısı. Filigran tek
kelimenin ikiye bölünmüş hâli: 半 solda buz, 分 sağda alev renginde.

**Sasuke'nin dikey yarığından ayrım (brief'in özel uyarısı):** Sasuke'de yarık
**sabit bir bölme** — konumu değişmez, kullanıcı dokunamaz, iki taraf aynı
davranır; yarık bir *dekor*. Burada yarık bir **değer**: `--tdr-split` 0–100
sürekli, sürüklenebilir, klavyeyle beşer beşer gezilebilir, ve değiştiği anda
her bölümün iki yarısı, bölüm çentikleri, oran şeridi, portrenin yatay konumu
ve on yedi kadrajdan geçen çizgi **birlikte** yeniden yerleşiyor. Uçlarda
(%0 / %100) kapanan sütun `display: none` ile **layout'tan ve erişilebilirlik
ağacından gerçekten düşüyor**, yerini "kapanan tarafın bedeli" metni alıyor.

⚠️ `<h1>` bilinçli olarak **sütunların dışında**: bir sütunun içinde olsaydı
uçlarda sayfadan tamamen silinirdi. Gerekçe kodda yorum olarak yazılı.

### 9 · Ochako Uraraka — `ochako-uraraka` · `--urk-`

`ZeroGravityExperience.tsx` (704) · `.module.css` (2043, **yeni**) ·
`GravityShell.tsx` (102, istemci) · `ReleaseField.tsx` (212, istemci) ·
`UrarakaGlyphs.tsx` (157, sunucu SVG) · veri (962)

**Küratör:** 16 `urk:` anahtarı — `hero`, `mujuryoku`, `uravity`, `alan`,
`release`, `bulanti`, `home-run-comet`, `gunhead`, `ehliyet`, `sinif`,
`fate-sinav`, `fate-festival`, `fate-staj`, `fate-ehliyet`, `fate-ryukyu`,
`closing`.

**Ayrışma:** serbest yüzen kart alanı — hizalı ızgara **değil**, farklı
yüksekliklerde ve **farklı fazlarda** salınan kartlar; ızgara sinyali **5**
(dalganın en düşüğü, çünkü ızgara yok). Cormorant **300 italik** dev başlık
(`--font-cormorant` değişken font + `style: ["normal","italic"]` yüklü, yani
kilit gerçekten çalışıyor). Mekanik: Release'te tüm kartlar ivmelenerek düşüp
alt kenarda **yığılıyor** ve orada **ayrı bir okuma sırası** veriyor; üçüncü
kaldırışta Uraraka'nın bulantısı bir "yeter" uyarısı çıkarıyor.

### 10 · Toshinori Yagi — `toshinori-yagi` · `--alm-`

`PlusUltraExperience.tsx` (782) · `.module.css` (2316, **yeni** — dalganın en
büyük CSS işi) · `PlusUltraShell.tsx` (253, istemci) · `SmashMeter.tsx` (198,
istemci) · `AllMightGlyphs.tsx` (174, sunucu SVG) · veri (954)

**Küratör:** 17 `alm:` anahtarı — **`hero-golden` ve `hero-true` ayrı ayrı**
(brief "true formda hero görseli değişir" diyor, iki form iki yuva),
`one-for-all`, `symbol`, `kalan-sure`, `detroit`, `oklahoma`, `carolina`,
`texas`, `united-states`, `fate-nana`, `fate-yara`, `fate-kamino`,
`fate-birnumara`, `fate-halef`, `bonds`, `closing`.

**Ayrışma:** çizgi roman paneli düzeni, oluklu gutter, ben-day nokta deseni.
Anton **konturlu** (`-webkit-text-stroke`) — Eren'in dolu/bodur kullanımının
tersi. Mekanik: **azalan süre sayacı**, geri dönüşü yok; sayaç düştükçe sayfa
kademeli olarak gerçek forma dönüyor ve ben-day deseni **kayboluyor** — yani
nokta deseni dekor değil **durum göstergesi**.

---

## 2. İki çakışma riski — ikisi de çözüldü

Brief'te kilitli eksenler iki yerde birbirine yaklaşıyordu ve ajanlara açıkça
yazıldı:

**Bakugō ↔ All Might (poster tipografisi).** İkisi de dev poster başlığına
gidiyor. Ayrım: Bakugō `--font-numeral` (Archivo Black) **dolu, eğik**;
All Might `--font-anton` **içi boş kontur**. Betiğin ölçtüğü font kümeleri
`jost/shippori/numeral` ve `inter/sans/shippori/anton` — ortak yalnızca
`shippori` (Japonca dizeler için, ikisinde de yardımcı rol).

**Uraraka ↔ All Might (tükenme).** İkisinde de sınır var. Ayrım: All Might'ınki
**geri dönüşü olmayan azalan sayaç**; Uraraka'nınki **geri alınabilir** ve
sınır bir kilit değil **uyarı** (bulantı). Izgara sinyalleri 5 ve 16.

---

## 3. Merkezde bulunan ve düzeltilen iş

### `data-curator-slot` işareti eksikti — Levi sızıntısının bir kat derini

Todoroki'nin ajanı kendi kapsamı dışında bir sorun bildirdi ve **haklıydı**.
Doğrulandı ve merkezde düzeltildi.

Küratör mekanizmasında **iki ayrı kapı** var ve ikisi aynı şey değil:

| Kapı | Sorduğu soru | Nerede |
|---|---|---|
| `isAdmin` | "Bu kişi yönetici mi?" | Bileşende, sunucuda |
| `data-curator-slot` | "Küratör anahtarı AÇIK mı?" | `CuratorFrame.module.css:14` → `.frame[data-curating="false"] :global([data-curator-slot])` |

`CuratorSlot` anahtarı **kendi okuyor** ve kapalıyken hiç çizilmiyor. Ama
yanındaki **sunucu-tarafı notlar** (ölçü satırları, kadraj künyeleri) okumuyor.
İşaretsiz bırakılırsa: yönetici küratör anahtarını kapatıp "sayfanın gerçek
hâline" baktığında **yükleme kutusu kayboluyor ama üretim notu ekranda
kalıyor.**

Düzeltilen yerler:
- `HalfAndHalfExperience.tsx` — üç `.plateSlot` kabı + `.plateNote`
- `SplitShell.tsx` — `.plateCaption` (gerekçe yorum olarak yazıldı)
- `PlusUltraExperience.tsx` — `.gapsWrap`. `CuratorGaps` kendini gizliyordu ama
  sarmalayıcı üst boşluğunu (`margin-top`) sayfaya bırakıyordu.

**Diğer üç sayfa ölçüldü ve temiz çıktı:** Midoriya zaten üç yerde işareti
kullanıyordu; Bakugō ve Uraraka'nın `isAdmin` bloklarında `CuratorSlot`tan
başka bir şey yok, yani sızacak sunucu metni yok.

### Todoroki'nin ajanının bulduğu iki hata

1. **`shouto-todoroki-experience.ts` — `TDR_TIMELINE`'da yarım sözleşme.**
   Dizi `as const`; `memory` alanı yalnızca son durakta vardı, üçünde yoktu.
   Bir alan yalnızca bazı üyelerde geçtiğinde birleşim tipinde o alan hiç
   oluşmuyor → `step.memory` **dört tsc hatası** veriyordu. Üç durağa
   `memory: null` eklendi.
2. **Kontrast hatası (gözle değil, ölçümle).** `.fateIndex` — kader
   çizelgesindeki durak numarası — malzeme rengini (%52 saydam) okuyordu ve
   **1.08:1** çıkıyordu. O sayı süs değil, durağın sıra numarası. `-text`
   ailesine çevrildi: en kötü durumda 5.20:1.

---

## 4. Denetimler

```
npx tsc --noEmit                          → temiz (exit 0)
npx eslint <beş klasör + beş veri dosyası> → temiz
node scripts/check-karakter-kayit.mjs     → TEMIZ (66 adres, 66 kadro satiri)
node scripts/check-karakter-sinif.mjs     → TEMIZ (65 modul) — 502 → 0
node scripts/check-karakter-hex.mjs       → TEMIZ (65 modul)
node scripts/check-karakter-kontrast.mjs  → TEMIZ (67 palet)
node scripts/check-karakter-ayrisma.mjs   → TEMIZ (65 sayfa, 2080 cift)
NEXT_PUBLIC_API_URL=… npx next build      → exit 0
```

### Ayrışma

Betik 2080 çiftin bir kısmını eşiğe yakın diye listeliyor. **Dalga 2'nin beş
sayfasının hiçbiri o listede yok** — ne birbirleriyle ne yayındaki 24 sayfayla.

Beş sayfanın parmak izleri (betiğin kendi çıktısı):

| Sayfa | Font kümesi | `data-*` | keyframe | Izgara sinyali |
|---|---|---|---|---|
| `izuku-midoriya` | petrona / inter / plexmono / **corinthia** | analysis | 1/3 | 15 |
| `katsuki-bakugou` | jost / shippori / **numeral** | sweat | 2/3 | 13 |
| `shouto-todoroki` | inter / **cinzel** | power | 4/4 | 7 |
| `ochako-uraraka` | inter / shippori / **cormorant** | gravity | 1/4 | 5 |
| `toshinori-yagi` | inter / sans / shippori / **anton** | drain / form | 3/5 | 16 |

Beşinin görüntü fontu da farklı — dalga içi kural karşılandı.

### Elle denetimler

- **Sayfalar arası bileşen paylaşımı: yok.** Beş klasörün hiçbiri başka bir
  karakterin bileşenini ya da `-experience.ts` dosyasını import etmiyor.
- **Klasör başına `.module.css`: beşinde de 1.**
- **`<h1>`: beşinde de tek.** (Todoroki'de ikinci eşleşme bir yorum satırı.)
- **İstemci adası:** Todoroki 1, diğer dördü 2 (sınır 3).
- **Küratör metni sızıntısı: yok** — §3'teki düzeltmeden sonra.
- **Palet bütünlüğü:** beş deri bloğunun standart 14 token'ı brief'teki
  değerlerle birebir.

---

## 5. Kalan iş

- [ ] **Görseller:** beş sayfa toplam **82 küratör yuvası** çiziyor
      (16 + 16 + 17 + 16 + 17 ABILITY, artı PORTRAIT yuvaları) ve neredeyse
      hepsi bugün boş. Öncelik: beş **hero** karesi. All Might'ta **iki** hero
      yuvası var (`alm:hero-golden`, `alm:hero-true`).
- [ ] **Yoldaş portreleri:** MHA kadrosunun kendi veritabanımızda portresi yok,
      yani bağlar bölümleri bugün **adla** çiziliyor. Bölümler bu hâlde
      tasarlandı.
- [ ] `lib/characters/sukuna-itadori-experience.ts` satır 62 ve 64 AniList'e
      **hotlink** yapıyor (Faz 2 öncesinden kalma, ayrı iş).
- [ ] **Inter `font-weight: 300`:** Inter okuyan üç modül (`bleach/world`,
      Gojō, Ulquiorra) `300` yazıyor ama aile o kesimi bildirmiyor, yani 400
      çiziliyor. Üç **yayın** sayfasının görünüşünü değiştireceği için bu
      turda yapılmadı — ayrı bir karar. (Dalga 4 raporu §5.)
