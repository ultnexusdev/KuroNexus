# Faz 2 · Dalga 4 — Jujutsu Kaisen, sekiz yeni sayfa · RAPOR

> Brief: `docs/ANIME-FAZ2-DALGA4.md` · Sözleşme: `docs/ANIME-FAZ2-SOZLESME.md`
> Dal: `anime/faz2-dalga4` (`main` tabanlı) · Tarih: 31 Ağustos 2026

---

## 0. Dalganın kurulumu

Dalga 4 `main`'den (`1a6a267`) dallandı. **Dalga 2'nin yarım işi alınmadı** —
`anime/faz2-dalga2` üzerindeki `bb36a2d` beş My Hero Academia rotasını ve
kaydını içeriyor ama bileşenleri yok; o dalda `tsc` beş TS2307 veriyor. Dalga
4 o dala hiç dokunmadı, ondan dallanmadı.

**Mevcut JJK sayfalarına dokunulmadı:** Gojō, Megumi, Nobara, Nanami, Getō,
Sukuna/Itadori. Ne bileşenleri kullanıldı ne değiştirildi.

### İskele (merkezde, ajanlar girmeden önce)

Commit `5341c19` — ajanların paylaşılan hiçbir dosyaya dokunmaması için
rota + kayıt + palet blokları önceden yazıldı:

- `EXPERIENCE_IDS` + `EXPERIENCE_COMPANIONS` — sekiz numara
- `roster.ts` — sekiz kadro satırı, yerel yazımlar `kaynak.json`'dan
- Sekiz statik rota klasörü
- Sekiz bileşen klasörü: palet bloğu brief'ten **birebir**, üstüne geçici iskelet

### AniList numaraları

Sekizinin de numarası doğrulanmış durumda; dördü tur başında bilinmiyordu ve
**adla arandı, Jujutsu Kaisen medya süzgeciyle doğrulandı.** Doğrulamanın
kopyası her karakterin
`frontend/public/assets/anime/karakterler/<slug>/kaynak.json` dosyasındaki
`yapimlar` alanında duruyor.

| Karakter | AniList | Nasıl bulundu |
|---|---|---|
| Chōsō | 157116 | biliniyordu |
| Maki Zen'in | 134167 | biliniyordu |
| Mahito | 133702 | biliniyordu |
| Aoi Tōdō | 137975 | biliniyordu |
| **Panda** | **137974** | adla arandı; arama Shirokuma Café'nin pandasına ve One Piece'in Pandaman'ine de çarpıyor, tek ayıraç medya listesi |
| **Tōji Fushiguro** | **162722** | adla arandı; AniList'te "Touji Fushiguro". **"Toji Zenin" varyantı AniList'te kayıtlı değil** |
| **Jōgo** | **156991** | adla arandı; AniList'te "Jougo" |
| **Yūta Okkotsu** | **129571** | adla arandı; AniList'te "Yuuta Okkotsu" |

Dördünde de uzun ünlü AniList romanizasyonunda yazılı (Gojou/Getou emsali) —
ad ayrışması değil, yazım tercihi. Klasör adları o yazımı izliyor, `roster.ts`
satırlarında doğru yazım kullanılıyor.

### Görsel politikası

Sekiz portrenin sekizi de **repoda**, hotlink yok:
`public/assets/anime/karakterler/<slug>/anilist-portrait.(png|jpg)` +
`kaynak.json`. Portreler **230×345** — hero için küçük, bu yüzden madalyon /
portre kartı ölçüsünde kullanılıyor; büyük hero karesi **küratör yuvası**
olarak boş bırakıldı. Sahne/teknik görselleri üretilmedi; her biri için bir
`<önek>:<anahtar>` ABILITY yuvası açıldı ve motifler **elle SVG** çizildi.

---

## 1. GRUP 1 — ID'si bilinen dört karakter

Dört ayrı worktree, dört ayrı dal, dört ayrı ajan. Her ajana **farklı bir
referans sayfa** verildi (Rukia / Uryū / Ulquiorra / Grimmjow) ki dördü aynı
ev desenine yakınsamasın — Faz 1'in kopya sorununa karşı ek önlem.

| # | Karakter | Dal | Bileşen | Commit |
|---|---|---|---|---|
| 17 | Chōsō | `chousou-redesign` | `BloodlineExperience` | `9dc8a25` |
| 18 | Maki Zen'in | `maki-redesign` | `ArmoryExperience` | `53cca12` |
| 19 | Mahito | `mahito-redesign` | `IdleTransfigurationExperience` | `b981e3e` |
| 20 | Aoi Tōdō | `toudou-redesign` | `BoogieWoogieExperience` | `c81941f` |

### 17 · Chōsō — `chousou` · `--chs-`

**Dosyalar:** `BloodlineExperience.tsx` (669) · `.module.css` (1676) ·
`NineWombs.tsx` (istemci, 286) · `BloodShell.tsx` (istemci, 114) ·
`ChousouGlyphs.tsx` (sunucu SVG, 194) · `lib/characters/chousou-experience.ts` (1055)

**Yedi durak:** hepsi tamam. Laboratuvar 3 büyük (赤血操術 / 赤鱗躍動 / 穿血)
+ 4 küçük (超新星 / 呪力 / 領域展開 / 呪具).

**Küratör:** 23 yuva (17 ABILITY + 1 PORTRAIT + 5 yoldaş PORTRAIT), her biri
kendi kadrajının altında. Anahtarlar: `hero`, `sekketsu`, `sekirin`,
`senketsu`, `choushinsei`, `juryoku`, `column`, `kin-esou`, `kin-kechizu`,
`recognition`, `fate-kamo`, `fate-seal`, `fate-release`, `fate-loss`,
`fate-turn`, `bonds`, `closing`.
`領域展開` ve `呪具` kartlarına **bilerek yuva açılmadı** — ikisi de "kayıtta
yok" cevabı veriyor, olmayan tekniğe kadraj açmak sonsuza kadar dolmayacak bir
boşluk üretirdi.

**Ayrışma — altı eksenin altısı:**
- *Izgara:* dikey damar sütunu; telefonda solda, 64rem üstünde tam ortada,
  bölümler sağa/sola dönüşümlü dallanıyor, dallanma noktaları görünür.
  Ino'nun yasaklı dairesel düğüm ağı değil — dikey ve tek yönlü.
- *Tipografi:* Rukia ile **aynı aile** (`--font-shippori`), **tam ters
  muamele**: 700 kesim, satır aralığı 0.9–1.06, harf aralığı −0.035…−0.045em,
  hero adında `scaleX(0.93)`. (Rukia: 600, satır aralığı 2.4–2.8, geniş aralık.)
- *Hareket:* `stroke-dashoffset` 100→0 viskoz akış + 9–13 sn nabız. En kısa
  geçiş 420 ms; tanecik yok, `steps()` yok.
- *Düğme:* "Kan Bağı" yapıyı çeviriyor — altı kılcal uzuyor, dallanma
  noktalarının yan kolları beliriyor, dokuz bölüme kardeş adı yazılıyor.
- *Filigran:* elle çizilmiş damar + dikey yazımda 脹相.
- *Palet:* deri birebir; üstüne kan/damar/kılcal/pıhtı/zar/ichor ailesi ve
  yedi `-text` kardeşi.

**Mekanik ayrımı:** dokuz halka **sırasız** (Naruto'nun dokuz kademeli rayı,
Rock Lee'nin sekiz kapısı, Neji'nin 2→64'ü hep sıralı ve artan). Gösterge hiç
boşalmıyor (Getō'nun tek seferde boşalan haznesinin tersi). 9/9 dolduğunda bile
**altı yüz adsız kalıyor** ve eklenen ad dokuzdan biri değil, onuncu.

### 18 · Maki Zen'in — `maki-zenin` · `--mki-`

**Dosyalar:** `ArmoryExperience.tsx` (692) · `.module.css` (1486) ·
`WeaponRack.tsx` (istemci, 306) · `RestrictionShell.tsx` (istemci, 134) ·
`MakiGlyphs.tsx` (sunucu SVG, 167) · `lib/characters/maki-zenin-experience.ts` (1118)

**Yedi durak:** hepsi tamam. Laboratuvarın dört küçük kartı bilinçli olarak
**olumsuz**: 術式 YOK · 領域展開 YOK · 反転術式 YOK · 束縛 "karıştırma"
(kısıtlama pazarlık değil, doğum).

**Küratör:** 15 yuva (1 PORTRAIT + 14 ABILITY). Anahtarlar: `hero`,
`manifest`, `restriction`, `tools`, `energy`, `rack`, `tool-playful-cloud`,
`tool-dragon-bone`, `tool-naginata`, `tool-katana`, `tool-glasses`,
`tool-fist`, `timeline`, `closing`.

**Ayrışma — altı eksenin altısı:**
- *Izgara:* eşit hücreli envanter rafı; sayfanın **tamamı** aynı hücre
  modülünde (künye 12 göz, laboratuvar 3+4, mekanik 6). Yuvarlak köşe, gölge,
  degrade yok.
- *Tipografi:* `--font-plexmono` ALL CAPS, 0.10–0.32em harf aralığı, h1 5rem.
- *Hareket:* **bütün** geçişler `steps()` (2–10 basamak); dört keyframe.
  Organik eğri yok.
- *Düğme:* `data-restriction` yapıyı çeviriyor — ray 1→2px, hücre 3.25→2.75rem,
  boşluk 0.6→0.35rem, doygunluk artıyor, gözlük silueti kalkıyor.
  ⚠️ **Izgara `before`'da da tam olarak yerinde** (Onizuka dersi uygulandı).
- *Filigran:* soyut Zen'in mührü + üstüne SVG X + 禪院.
- *Mekanik:* hücreler **açılmıyor, seçiliyor** ve ölçü şeridini yeniden
  hesaplıyor (Urahara'nın çekmece ızgarası ihlal edilmedi).

**Tōji'den ayrım** (aynı dalga, aynı kavram, brief'in özel uyarısı): Maki'de
bir **raf** ve konu üç sütunun gerçekten yeniden hesaplanması; sıfır sütunu
dört sütun arasında sessiz bir espri. Boşta bile şerit raf toplamını okuyor
(en uzun menzil, taşınan toplam ağırlık, en yüksek hız) — **sayfa dolu ve
askeri.** Tōji'nin kurgusu için §2'ye bak.

**Dürüstlük işaretleri:** menzil/ağırlık/hız sütunları "arşivin atölye ölçüsü"
diye sayfada açıkça işaretli (kaynak sayı vermiyor); kanon olan tek sütun 呪力=0.
Doğrulanamayan replik alıntılanmadı; kapanışın iki bloğu eserin kendi terimleri
+ arşivin okuması ve bu ziyaretçiye söyleniyor. Kan grubu **kayıt yok** —
uydurulmadı.

### 19 · Mahito — `mahito` · `--mht-`

**Dosyalar:** `IdleTransfigurationExperience.tsx` (741) · `.module.css` (1839) ·
`FormMorph.tsx` (istemci, 138) · `SoulShell.tsx` (istemci, 93) ·
`MahitoGlyphs.tsx` (sunucu SVG, 133) · `lib/characters/mahito-experience.ts` (1106)

**Yedi durak:** hepsi tamam. Yaş/doğum/kan grubu/boy dördü de kaynakta `null`;
satırlar duruyor ama "bilinmiyor" yazmıyor — karakterizasyona çevrildi
("lanetli ruhların takvimi yok") ve altında dördünün de kaynakta boş olduğunu
söyleyen bir dipnot var.

**Küratör:** 21 yuva (20 ABILITY + 1 PORTRAIT). Anahtarlar: `hero`, `seams`,
`idle-transfiguration`, `self-embodiment`, `domain-amplification`,
`transfigured-humans`, `reversal-absent`, `cursed-tool-absent`, `binding-vow`,
`form-raw`, `form-made`, `form-self`, `form-domain`, `form-evolved`,
`fate-birth`, `fate-vessel`, `fate-shibuya`, `fate-black-flash`, `fate-end`,
`closing`.

**Ayrışma — altı eksenin altısı:**
- *Izgara:* yedi yamanın her birinin dört köşesinin yarıçapı ayrı, gövdesi
  sekiz köşeli `clip-path` ile eğik kesik; hiçbir kenar diğerine paralel değil.
  ⚠️ Çokgenler **yüzde değil piksel** — 2000 px'lik bir bölümde `12%` metni
  keserdi.
- *Tipografi:* Cormorant, **her kelime başka puntoda**; temel çizgiler kayık.
- *Hareket:* yalnızca morph — kutular 1.1 sn'de sürünüyor. Uçan/kayan/parlayan
  hiçbir şey yok.
- *Düğme:* `data-soul` yedi yamayı ikinci ve çok daha düzensiz kesim kümesine
  geçiriyor, dikişler teyelden düz çizgiye yaklaşıyor.
- *Filigran:* elle çizilmiş beş yama + teyel deseni + 無為転変.
- *Mekanik:* formlar **sıralı değil**, merdiven kurmuyor, panel takas
  edilmiyor — **aynı DOM düğümünün geometrisi** çıktının kendisi.

**Ajanın kendi bulduğu iki erişilebilirlik düzeltmesi:** deforme olan kartların
`clip-path`i gövdeye değil `::before` zemin katmanına uygulandı (içindeki
`CuratorSlot` yükleme kutusu kırpılmıyor); form seçici `li`lerdeki
`display: contents` gerçek esnek kutuyla değiştirildi (bazı tarayıcılarda
listeyi a11y ağacından siliyor).

### 20 · Aoi Tōdō — `aoi-toudou` · `--tdo-`

**Dosyalar:** `BoogieWoogieExperience.tsx` (946) · `.module.css` (1529) ·
`ClapStage.tsx` (istemci, 302) · `BrotherStage.tsx` (istemci, 102) ·
`ToudouGlyphs.tsx` (sunucu SVG, 171) · `lib/characters/aoi-toudou-experience.ts` (1046)

**Yedi durak:** hepsi tamam. Laboratuvara ek olarak bir JJK sözlüğü
(術式 / 呪力 / 領域展開 / 反転術式 / 呪具 / 束縛).

**Küratör:** 13 yuva (12 ABILITY + 1 PORTRAIT). Anahtarlar: `hero`,
`boogie-woogie`, `black-flash`, `physique`, `takada`, `stage`, `kyoto`,
`goodwill`, `brother`, `shibuya`, `phantom-clap`, `closing`.
Üç büyük güç kartının kadrajı **ve** yuvası tek bir `frame()` parçasında —
yuva takas sırasında kadrajla birlikte taşınıyor.

**Ayrışma — beş eksen:**
- *Izgara:* idol posteri — ortalanmış, simetrik, kalın dış çerçeve + ince altın
  iç çizgi. Dalga 4'te başka hiçbir sayfa ortalanmış/simetrik değil.
- *Tipografi:* Archivo Black dev, ortalanmış, büyük harf, sıkı aralık; poster
  yığını (eyebrow / billing / tagline).
- *Hareket:* gerçek FLIP — ölç, `flushSync`, Web Animations API ile
  translate+scale sıçraması; alkışta tek kareli parlama.
- *Düğme:* "Kardeşim!" yapıyı çeviriyor — Yūji altı bölüme yeni bir şerit
  olarak giriyor, palet fuşyaya bağlanıyor (deri bloğu dışında sıfır hex).
- *Filigran:* elle çizilmiş alkış/el silueti + 不義遊戯 (+ üç motif daha).

**Mekanik ayrımı:** yayındaki 41 mekaniğin hiçbiri sayfanın **kendi düzenini**
değiştirmiyor — ray ilerletiyor, kapak açıyor, kart çeviriyor, katman
soyuyor ya da ölçek değiştiriyor. Burada içerik aynı kalıyor ve yalnızca
**konum** değişiyor. Üç bağımsız takas alanı.

**Alıntı disiplini:** yalnızca sabit terimler Japonca tırnakta (不義遊戯,
黒閃, 親友, 拍手, 一級呪術師). Tōdō'nun imza sorusu **dolaylı anlatımla** ve
açık bir notla verildi, çünkü Japonca söylenişi kaynaklar arasında değişiyor.
`領域展開` kartı bilerek "kayıtta yok" diyor.

---

## 2. Merkezde bulunan ve düzeltilen iş

### `--font-numeral` Türkçe diyakritikleri basmıyordu

Brief Tōdō'nun başlıklarını `var(--font-numeral)`e (Archivo Black) kilitledi.
Ama o aile `app/[locale]/layout.tsx`'te **yalnızca `latin`** alt kümesiyle
yükleniyordu ve dosyadaki yorum kullanım amacını açıkça yazıyordu: *"Yalnızca
0–9 basılıyor."* `latin` alt kümesinde **ş/ğ/İ/ı yok** — Tōdō'nun poster
başlıkları tek satırda iki ayrı tipografiyle çizilecekti (yarısı Archivo Black,
Türkçe harfleri yedek fonttan).

Düzeltme: `subsets: ["latin", "latin-ext"]`. **Rakamları etkilemiyor** — 0–9
zaten `latin` içinde ve o alt küme aynen duruyor, yani Espada/Bölük sayfaları
değişiklikten önce ne çiziyorsa aynısını çiziyor. Bu bir **brief hatasıydı**,
ajan hatası değil; ajan sorunu fark edip dosyaya yedek font notu düşmüştü,
kök çözüm merkezde uygulandı.

### Denetimler (Grup 1 birleştikten sonra, merkezde)

```
npx tsc --noEmit                          → temiz (exit 0)
npx eslint <dört klasör + dört veri dosyası + layout.tsx>
                                          → temiz
node scripts/check-karakter-kayit.mjs     → TEMIZ (61 adres, 61 kadro satiri)
node scripts/check-karakter-sinif.mjs     → TEMIZ (60 modul)
node scripts/check-karakter-hex.mjs       → TEMIZ (60 modul)
node scripts/check-karakter-kontrast.mjs  → TEMIZ (62 palet)
node scripts/check-karakter-ayrisma.mjs   → TEMIZ (60 sayfa, 1770 cift)
```

**Ayrışma sonucu — dalganın tek numaralı ölçüsü.** Betik eşiğin üstündeki her
çifti listeliyor. Dört yeni sayfanın **hiçbiri** o listede yok: ne birbirleriyle
ne yayındaki 56 sayfayla eşiğe yaklaşan bir çift kurmuyorlar. Listede görünen
uyarıların hepsi (kushina-uzumaki ailesi, naruto~sukuna-itadori) bu dalgadan
**önce** vardı.

**Ek denetimler (merkezde, elle):**
- Sayfalar arası bileşen paylaşımı: **yok.** Dört klasörün hiçbiri başka bir
  karakterin bileşenini ya da `-experience.ts` dosyasını import etmiyor.
- Küratör metni sızıntısı: **yok.** Dördünde de ölçü/spec metni `isAdmin`
  dalında; ziyaretçinin gördüğü boş kadraj yazısız (Dalga 1'in Levi hatası
  tekrarlanmadı).
- İstemci adası sayısı: dördünde de **2** (sınır 3).
- Klasör başına `.module.css`: dördünde de **1**.

---

## 3. GRUP 2 — AniList numarası doğrulanan dört karakter

Grup 1'in raporu yazıldıktan sonra başlatıldı (görev şartı). Yine dört ayrı
worktree, dört ayrı dal, dört farklı referans sayfa (Yoruichi / Levi / Renji /
Mikasa). Ajanlara Grup 1'in dört kimliği **yazıyla** bildirildi ki aynı yere
düşmesinler; klasörlerini açmaları yasaklandı.

| # | Karakter | Dal | Bileşen | Commit |
|---|---|---|---|---|
| 21 | Panda | `panda-redesign` | `ThreeCoresExperience` | `ff16a72` |
| 22 | Tōji Fushiguro | `toji-redesign` | `HeavenRestrictionExperience` | `c2f7d0d` |
| 23 | Jōgo | `jogo-redesign` | `VolcanoExperience` | `a3a73f3` |
| 24 | Yūta Okkotsu | `yuta-redesign` | `RikaExperience` | `8b5e2b2` |

### 21 · Panda — `panda` · `--pnd-`

**Dosyalar:** `ThreeCoresExperience.tsx` (756) · `.module.css` (2011) ·
`CoreDeck.tsx` (istemci, 257) · `CoreShell.tsx` (istemci, 197) ·
`PandaGlyphs.tsx` (sunucu SVG, 266) · `lib/characters/panda-experience.ts` (1258)

**Küratör:** 15 yuva (1 PORTRAIT + 14 ABILITY). Anahtarlar: `hero`, `corpse`,
`corpse-body`, `mutation`, `cursed-energy`, `core-gorilla`, `core-brother`,
`core-triangle`, `fate-workshop`, `fate-sentience`, `fate-class`,
`fate-gorilla`, `fate-cost`, `closing`.

**Ayrışma:** sayfanın **tamamı** tek bir üç sütunlu omurgada ve oranı kök
`data-core` sürüyor (`1.9fr / 0.72fr / 0.72fr`) — akordiyon değil, oran.
Jost 200/300, **karışık kutu ve negatif harf aralığı** (Slam Dunk'taki geniş
ALL CAPS Jost'un tam tersi). Bambu salınımı: SVG saplar `transform-box:
fill-box` üzerinde sapa göre gecikmeyle dönüyor, oran geçişi
`cubic-bezier(0.34, 1.46, 0.64, 1)` ile elastik. `data-corpse` paleti
soldurup üç halka amblemini anatomik kesite çeviriyor, **ızgaraya ve
çekirdek durumuna dokunmuyor** (Onizuka dersi).

**Mekanik ayrımı:** tükenme, kademe değil (Ichigo'nun beş kademeli kimlik
seçicisinin tersi). Erişilebilirlik: her yakma/geri açma/kilit
`aria-live="polite"` ile duyuruluyor; tükenmiş düğme `disabled` değil
`aria-disabled` + `aria-describedby` (odak kaybolmuyor); tükenmiş bir
çekirdeğin kaydı yeniden **tüketmeden** açılabiliyor; kilit bir panel
**ekliyor**, hiçbir şeyi gizlemiyor.

**Dürüstlük işaretleri:** üçüncü çekirdeğin kaynakta **adı yok** — sayfa
"Üçgen"in arşivin işareti olduğunu, kanon olmadığını açıkça yazıyor. O
sütunun stat çubukları **bilerek boş**: kayıt o çekirdeği hiç iş başında
göstermiyor. Yaş/kan grubu karakterizasyona çevrildi ("bir lanetli cesedin
kan grubu olmaz, çünkü kanı yok").

### 22 · Tōji Fushiguro — `touji-fushiguro` · `--toj-`

**Dosyalar:** `HeavenRestrictionExperience.tsx` (748) · `.module.css` (1669) ·
`ToolSatchel.tsx` (istemci, 249) · `EmptySkyShell.tsx` (istemci, 128) ·
`ToujiGlyphs.tsx` (sunucu SVG, 169) ·
`lib/characters/touji-fushiguro-experience.ts` (1078)

**Küratör:** 14 yuva (1 PORTRAIT + 13 ABILITY). Anahtarlar: `hero`,
`restriction`, `zero`, `tools`, `sakahoko`, `yuun`, `satchel`, `fate-zenin`,
`fate-fushiguro`, `fate-kaigyoku`, `fate-gyokusetsu`, `fate-shibuya`,
`closing`. Üç "yok" kartına (術式 / 領域展開 / 反転術式) **bilerek yuva
verilmedi** — olmayan tekniğin kadrajı doldurulmayı bekleyen bir eksik gibi
görünürdü.

**Ayrışma:** üst üçte bir boş gökyüzü her bölümde `.sky` öğesiyle korunuyor
(mobilde 15rem→6.5rem düşüyor ama **sıfırlanmıyor**); içerik 68rem'lik alçak
yatay bantta. Inter 200 + `clamp(2.1rem, 9vw, 6.6rem)`. Sayfada **yalnızca iki
hareket** var: 150 sn'lik gökyüzü kayması ve seçimde çizilen 180 ms'lik tek
çizgi — dalganın en hareketsiz sayfası. `data-restriction` lanet enerjisi
sütununu **çiziyor**; sütun sayfa boyunca inen boş bir şerit ve açıldığında
gerçekten yer kaplıyor (içerik sağa kayıyor). Hiçbir sayı, hiçbir renk
değişmiyor.

**Maki'den ayrım (brief'in özel uyarısı, karşılandı):** Maki'de eşit hücreli
bir **raf**, plexmono ALL CAPS stencil, bütün geçişler `steps()`, dolu ve
askeri. Tōji'de hücre yok — `.pockets` bir **rulo** ve satır yükseklikleri
metin uzunluğuna göre bilerek eşitsiz. Seçim tekli değil **birikimli** ve geri
konabiliyor; stat şeridi yeniden hesaplanmıyor, üç okuma **büyüyor**. Sıfır
sütunu espri değil **tez**: tezgâhın sol kolonunun tamamı o, `clamp(4.5rem,
15vh, 9rem)` boyunda tek bir "0" ve altında hiç dolmayan tik çizgili bir
kanal — sayfadaki en büyük tek öğe. Beş bölmenin ikisi hiçbir şeyi
değiştirmiyor ve **iki farklı sebeple**. Maki'de düğme paleti doyuruyor ve
istatistikleri yükseltiyor; Tōji'de düğme hiçbir sayıya dokunmuyor.

**Alıntı disiplini:** sayfada tırnak içinde söylenmiş **tek cümle yok** —
Tōji'nin Japonca repliklerinin birebir yazımı doğrulanamadı ve hiçbiri
uydurulmadı. Kapanıştaki iki blok **ad**: 呪術師殺し ve 伏黒; motto bir
terim: 天与呪縛. Gerekçe hem veri dosyasında hem sayfada görünür bir notta.

### 23 · Jōgo — `jougo` · `--jgo-`

**Dosyalar:** `VolcanoExperience.tsx` (705) · `.module.css` (1712) ·
`AshFall.tsx` (istemci, 270) · `CrustShell.tsx` (istemci, 125) ·
`JougoGlyphs.tsx` (sunucu SVG, 224) · `lib/characters/jougo-experience.ts` (997)

**Küratör:** 16 yuva (1 PORTRAIT + 15 ABILITY). Anahtarlar: `hero`, `teknik`,
`alan`, `meteor`, `lanet-enerjisi`, `baglayici-soz`, `lanetli-alet`,
`ters-teknik`, `kul`, `katman-1`…`katman-5`, `kapanis`.

**Ayrışma:** katmanlı yer kesiti — bölümler yatay jeolojik katman, `data-depth`
0→9 ile zemin `--jgo-deep`e karışıp koyulaşıyor; aralarında negatif marjla
sınırı yaran düzensiz SVG magma çatlağı. **Kart yok, kolon yok, hiçbir bölüm
bir diğerinin yanında değil.** Anton, ama Eren'in bodur kullanımının tersi:
harf aralığı `clamp(0.16em, 0.9vw, 0.3em)`, satır aralığı 1.6+ (Eren: −0.01em
/ 1.02). Kader çizelgesi yaş yerine **derinlik** etiketli — bir lanetli ruhun
yaşı yok, katmanı var.

**Levi'nin toz silmesinden ayrım (brief'in yasağı, karşılandı):** Levi'de toz
**kalıcı** temizleniyordu — sildiğin yer temiz kalıyor, sayfa adım adım
açılıyor, yani bir ilerleme çubuğu. Jōgo'da temizlik **geçici** ve her
temizlik bir sonrakini yaklaştırıyor: birikme hızı ×1→×2→×3→×4, dördüncüde
hiç kalkmıyor ve yenilgi metni orada açılıyor. **Levi'de kazanıyorsun,
burada kaybediyorsun.**

**Kül katmanının erişilebilirliği (brief'in özel şartı) — ölçüldü:**
- Perde ayrı bir `<span aria-hidden>`, `pointer-events: none`; metin normal
  DOM'da ve ekran okuyucuda **her zaman tam** okunuyor.
- Perdenin opaklığı **yalnızca** `no-preference` içinde tanımlı; `reduce`
  battaniyesinde `opacity: 0` + `display: none` → hareket kapalıyken **kül
  hiç birikmiyor**.
- Örtü altında ölçülen kontrast: ana metin **6.63:1**, ikincil **5.14:1**;
  erime noktası açıkken **6.48:1** ve **5.03:1**. Perde aşağı doğru
  şeffaflaşıyor — örtü gerçekten "kısmi".
- İki düğme de gerçek `<button>` ve **hiçbiri `disabled` değil**;
  kullanılamaz durumlar `aria-disabled` + `aria-describedby` ile veriliyor.
- Küratör çakışması iki güvenlikle engellendi: kül panelinde hiç kadraj yok
  **ve** `.ash [data-curator-slot]` perdenin üstünde bir `z-index` taşıyor.

### 24 · Yūta Okkotsu — `yuuta-okkotsu` · `--yut-`

**Dosyalar:** `RikaExperience.tsx` (992) · `.module.css` (1766) ·
`CopyDeck.tsx` (istemci, 189) · `RikaShell.tsx` (istemci, 121) ·
`RikaToggle.tsx` (istemci, 78) · `YuutaGlyphs.tsx` (sunucu SVG, 146) ·
`lib/characters/yuuta-okkotsu-experience.ts` (1079)
⚠️ **Üç istemci adası — sınırda** (sözleşme en fazla 3 diyor).

**Küratör:** 17 yuva (1 PORTRAIT + 16 ABILITY). Anahtarlar: `hero`, `rika`,
`copy`, `queen`, `reserve`, `domain`, `reverse`, `tool`, `vow`, `deck`,
`promise`, `accident`, `school`, `geto`, `order`, `closing`.

**Monokrom nasıl kuruldu — `filter: grayscale()` KULLANILMADI.** İki gerekçe
kodda yazılı: küçük metnin kontrastını düşürürdü ve küratör yüklediği kareyi
gri görüp yanlış karar verirdi. Grilik paletin **nötr ailesini kullanmaktan**
geliyor (`--text-*`, `--gold: #858585`, `--border*`, `--surface*`); renk
yalnızca `--accent` / `--yut-rika`dan ve yalnızca Rika'nın bulunduğu yerlerde,
`--yut-spread = color × (0.26 + 0.74 × take)` katsayısıyla açılıyor.

**Ayrışma:** ortalanmış tek kolon + kolonun **dışında** sağ kenarda Rika'nın
şeridi (negatif `margin-inline-end`). Mikasa'da çizgi ızgaranın kendisiydi ve
bölümler ona asılıydı; burada şerit ızgaranın parçası değil. Cinzel ALL CAPS
**ortalanmış ve tek** (Todoroki'deki simetrik/bölünmüş kullanımın tersi).
`data-rika` şeridi **yaratmıyor, dolduruyor** — `alone` hâlinde altı çentik
boş kontur olarak yerinde (Onizuka dersi).

**Getō'nun iki mekaniğinden ayrım (brief'in yasağı, karşılandı):** eski hazne
tek yönlüydü (al · biriktir · bir kere boşalt). Burada **kapasite yok,
boşaltma yok, sıra yok** — altı kaynağın her biri bağımsız ve aynı düğmeyle
**geri verilebiliyor**; görsel sonuç bir göstergenin dolması değil **rengin
sayfaya yayılması**. Dalga 5'in dallanan ihanet yoluyla ilgisi yok: dal, yol,
geri alınamaz seçim yok. Kabuto'nun kart destesinden de ayrı: kartlar sırayla
çekilmiyor, hepsi aynı anda ortada ve hepsi geri konabiliyor.

**Renk tek başına bilgi taşımıyor:** DESTEDE/DIŞARIDA rozeti, `aria-pressed`,
adlarıyla deste listesi, sayaç ve `aria-live="polite"` cümlesi aynı durumu
metinle söylüyor.

**360 px ölçümü (gerçek ölçüm, tahmin değil):** en kötü durumda
(`data-rika="bound"` + deste 6/6) `documentElement.scrollWidth = 360`,
`clientWidth = 360` → **yatay kaydırma yok**; görünüm alanının dışına çıkan
öğe sıfır. Tasarlanan 28 px'lik taşma `.page { overflow-x: clip }` ile
kırpılıyor. Ölçüm sırasında **iki gerçek hata bulunup düzeltildi**:
`writing-mode: vertical-rl` taşıyan `railKanji`'de mantıksal özellikler
öğenin kendi yazma kipine göre çözülüyordu — `margin-inline: auto` yatayda
değil **dikeyde** ortalıyor ve 360 px'te 14 px taşırıyordu; `inset-block-end`
de "alt" değil "sol" anlamına gelip kanjiyi şeridin tepesine düşürüyordu.
Blok fiziksel özelliklere çevrildi.

---

## 4. Sekiz sayfa birlikte — final denetimi

```
npx tsc --noEmit                          → temiz (exit 0)
npx eslint <sekiz klasör + sekiz veri dosyası + layout.tsx>
                                          → temiz
node scripts/check-karakter-kayit.mjs     → TEMIZ (61 adres, 61 kadro satiri)
node scripts/check-karakter-sinif.mjs     → TEMIZ (60 modul)
node scripts/check-karakter-hex.mjs       → TEMIZ (60 modul)
node scripts/check-karakter-kontrast.mjs  → TEMIZ (62 palet)
node scripts/check-karakter-ayrisma.mjs   → TEMIZ (60 sayfa, 1770 cift)
NEXT_PUBLIC_API_URL=… npx next build      → exit 0, sekiz rotanın sekizi de derlendi
```

### Ayrışma — dalganın tek numaralı ölçüsü

Betik 1770 çiftin **94'ünü** eşiğe yakın diye listeliyor. Dalga 4'ün sekiz
sayfasının **hiçbiri o 94 çiftin içinde yok** — ne birbirleriyle ne yayındaki
52 sayfayla. Listedeki uyarıların tamamı bu dalgadan önce vardı.

Sekiz sayfanın font kümeleri de birbirinden **tamamen ayrı** (betiğin kendi
parmak izi çıktısı):

| Sayfa | Font kümesi | `data-*` durumu | Izgara sinyali |
|---|---|---|---|
| `chousou` | petrona / shippori | blood | 11 |
| `maki-zenin` | inter / sans / plexmono | restriction | 9 |
| `mahito` | jost / cormorant | soul | 10 |
| `aoi-toudou` | inter / numeral | brother | 10 |
| `panda` | jost / petrona | core / corpse | 9 |
| `touji-fushiguro` | cormorant / inter | restriction | 16 |
| `jougo` | plexmono / anton / inter | molten | 9 |
| `yuuta-okkotsu` | cormorant / shippori / plexmono / cinzel | rika | 15 |

Maki ve Tōji'nin `data-*` adı aynı (`restriction`) — kavram brief'te ikisine
de kilitlendi. Ama betik ikisini **hiçbir eksende** yakın bulmuyor: font
kümesi farklı (9 vs 16 ızgara sinyali), hareket dili zıt (`steps()` vs
neredeyse hiç hareket), düğmenin yaptığı iş farklı (palet+ölçü vs sütun
çizme).

### Elle yapılan ek denetimler

- **Sayfalar arası bileşen paylaşımı: yok.** Sekiz klasörün hiçbiri başka bir
  karakterin bileşenini ya da `-experience.ts` dosyasını import etmiyor.
  Paylaşılan tek şey altyapı (`CuratorFrame` / `CuratorSlot` / `CuratorGaps` /
  `experiences` / `types`).
- **Küratör metni sızıntısı: yok.** Sekizinde de ölçü/spec metni `isAdmin`
  dalında; ziyaretçinin gördüğü boş kadraj yazısız (Dalga 1'in Levi hatası
  tekrarlanmadı).
- **İstemci adası:** yedisinde 2, Yūta'da 3 (sınır 3).
- **Klasör başına `.module.css`:** sekizinde de 1.
- **Palet bütünlüğü:** sekiz deri bloğunun standart 14 token'ı brief'teki
  değerlerle **birebir**; ajanlar yalnızca işaretli yer tutucuya kendi
  `--<önek>-*` ailelerini ekledi.
- **Mevcut JJK sayfaları değişmedi:** Gojō, Megumi, Nobara, Nanami, Getō,
  Sukuna/Itadori — `git diff` bu klasörlerde sıfır satır gösteriyor.

### Nexus bağları

| Bağ | Durum |
|---|---|
| Tōji → Megumi (#126635) | ✔ kuruldu, çift yönlü |
| **Megumi → Tōji** | ✔ **kendiliğinden canlandı** — Megumi'nin veri dosyası zaten `162722` taşıyordu ve `isExperienceCharacter()` ile çiziyordu; Tōji kayıt olunca düz ad bağlantıya döndü |
| Tōji → Maki (#134167) | ✔ |
| Maki → Zen'in klanı | ✔ (klan bir karakter değil; sayfa içi bölüm olarak, Tōji bağlantılı) |
| Chōsō → Itadori (#127212) | ✔ |
| Mahito → Nanami (#133704) | ✔ |
| Jōgo → Sukuna (#133701) | ✔ |
| Yūta → Gojō (#127691) | ✔ |
| **Getō → Yūta** | ✔ **kendiliğinden canlandı** (aynı mekanizma, `129571`) |

**Eksik hedef (link kurulmadı, düz ad yazıldı):** Mai Zen'in, Toge Inumaki,
Masamichi Yaga, Takada-chan, Rika Orimoto, Riko Amanai, Shiu Kong, Hanami,
Dagon, Kechizu (#210832) ve Eso (#210831). Son ikisinin AniList numarası var
ve `EXPERIENCE_COMPANIONS`'a yazıldı (portre girilirse kadraj dolar) ama
kendi sayfaları yok, o yüzden bağlantı kurulmadı.

---

## 5. Merkezde bulunan ve düzeltilen ikinci iş

### `--font-inter` 200 ağırlığını basmıyordu

Tōji'nin brief'i başlıkları **Inter 200** diye kilitledi; incelik o sayfanın
kimliğinin (yokluk, boş gökyüzü) taşıyıcısı. Ama aile `layout.tsx`'te statik
kesimlerle yükleniyordu (`weight: ["400","600","700"]`) ve **bildirilmeyen bir
ağırlık sessizce en yakınına düşüyor** — yani `font-weight: 200` yazan kural
400 çiziliyordu. Bunu ne `tsc`, ne `eslint`, ne de beş denetim betiği görüyor.

Düzeltme: `weight: ["200","400","600","700"]`.

**Ölçüldü, tahmin edilmedi:** `font-weight: 200` yazan 12 modülün **hiçbiri**
`--font-inter` okumuyor (Bleach salonu, Konan, Minato, Tenten — hepsi
Jost/Cormorant/Shippori ailesinde), yani bu ekleme yayındaki hiçbir sayfanın
görünüşünü değiştirmiyor.

⚠️ **AÇIK İŞ, bu turda bilerek düzeltilmedi:** Inter okuyan **üç** modül
`font-weight: 300` yazıyor (`bleach/world`, Gojō, Ulquiorra) ve onlar da bugün
400 çiziliyor. `"300"` eklemek üç **yayın** sayfasının görünüşünü değiştirirdi;
bu görevin kapsamı dışında ve ayrı bir karar. Not `layout.tsx`'te de duruyor.

---

## 6. Kalan iş

- [x] Grup 1 ve Grup 2 birleşti, denetimler temiz, build temiz
- [x] `docs/KARAKTER-SAYFASI-EKLEME.md` §3 (8 yeni mekanik satırı) ve §4
      (8 yeni palet satırı + açılan renk aileleri notu) güncellendi
- [x] Worktree sökümü — junction **önce** `rmdir`, sonra `git worktree remove`
- [ ] **Görseller:** sekiz sayfa toplam **134 küratör yuvası** çiziyor ve
      neredeyse hepsi bugün **boş**. Ölçüldü (kaynaktan sayıldı):

      | Sayfa | `ABILITY` anahtarı | + PORTRAIT | Toplam yuva |
      |---|---|---|---|
      | `chousou` (`chs`) | 17 | 1 + 5 yoldaş | 23 |
      | `maki-zenin` (`mki`) | 14 | 1 | 15 |
      | `mahito` (`mht`) | 20 | 1 | 21 |
      | `aoi-toudou` (`tdo`) | 12 | 1 | 13 |
      | `panda` (`pnd`) | 14 | 1 | 15 |
      | `touji-fushiguro` (`toj`) | 13 | 1 | 14 |
      | `jougo` (`jgo`) | 15 | 1 | 16 |
      | `yuuta-okkotsu` (`yut`) | 16 | 1 | 17 |
      | **Toplam** | **121** | **13** | **134** |

      Sayfalar görselsiz tam çalışıyor; küratör modundan yüklenen kare anında
      görünüyor (`no-store`). Öncelik sırası: sekiz **hero** karesi
      (1200×1600 dikey portre), sonra teknik/sahne kadrajları.
- [ ] **Yoldaş portreleri:** JJK kadrosunun kendi veritabanımızda hâlâ portresi
      yok, yani sekiz sayfanın bağlar bölümü bugün **adla** çiziliyor. Bölümler
      bu hâlde tasarlandı; portre girildiğinde kendiliğinden yerine oturur.
- [ ] **Dalga 2'nin yarım işi** duruyor (bu görevin kapsamı dışında):
      `anime/faz2-dalga2` üzerindeki `bb36a2d` beş MHA rotasını ve kaydını
      taşıyor ama bileşenleri yok.
- [ ] `lib/characters/sukuna-itadori-experience.ts` satır 62 ve 64 AniList'e
      **hotlink** yapıyor (bu görevden önce yazılmış, ayrı iş).
