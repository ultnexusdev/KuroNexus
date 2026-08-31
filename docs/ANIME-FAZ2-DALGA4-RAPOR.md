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

## 3. Kalan iş

- [ ] Grup 2: Panda, Tōji, Jōgo, Yūta
- [ ] Sekizi birleştikten sonra tam `next build`
- [ ] Nexus doğrulaması: Tōji↔Megumi ve Yūta↔Getō bağları Dalga 4 girince
      kendiliğinden kurulmalı
- [ ] `docs/KARAKTER-SAYFASI-EKLEME.md` §3 (mekanik tablosu) ve §4 (palet
      tablosu) güncellemesi
- [ ] Worktree sökümü — junction **önce** `rmdir`, sonra `git worktree remove`
