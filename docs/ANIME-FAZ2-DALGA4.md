# Faz 2 · Dalga 4 — Jujutsu Kaisen, yeni sayfalar (8 sayfa)

> Önce `docs/ANIME-FAZ2-SOZLESME.md` oku. Bu dosya yalnızca **senin
> karakterinin kilitli eksenleri** ve paletidir.

Dalga içi kural: bu sekiz sayfa **görüntü fontunu, ızgarasını, hareket
dilini ve düğme mekaniğini paylaşamaz.**

| # | Karakter | AniList | Klasör | Bileşen | Veri dosyası |
|---|---|---|---|---|---|
| 17 | Chōsō | 157116 | `chousou` | `BloodlineExperience` | `chousou-experience.ts` |
| 18 | Maki Zen'in | 134167 | `maki-zenin` | `ArmoryExperience` | `maki-zenin-experience.ts` |
| 19 | Mahito | 133702 | `mahito` | `IdleTransfigurationExperience` | `mahito-experience.ts` |
| 20 | Aoi Tōdō | 137975 | `aoi-toudou` | `BoogieWoogieExperience` | `aoi-toudou-experience.ts` |
| 21 | Panda | **137974** | `panda` | `ThreeCoresExperience` | `panda-experience.ts` |
| 22 | Tōji Fushiguro | **162722** | `touji-fushiguro` | `HeavenRestrictionExperience` | `touji-fushiguro-experience.ts` |
| 23 | Jōgo | **156991** | `jougo` | `VolcanoExperience` | `jougo-experience.ts` |
| 24 | Yūta Okkotsu | **129571** | `yuuta-okkotsu` | `RikaExperience` | `yuuta-okkotsu-experience.ts` |

**Kalın yazılan dört numara** görev başlangıcında bilinmiyordu; AniList'te
adla arandı ve Jujutsu Kaisen medya süzgeciyle doğrulandı. Rotalar bu
numaralarla kuruldu.

Terminoloji: **Jujutsu (呪術) · Lanet Enerjisi (呪力) · Lanetli Teknik
(術式) · Genişletilmiş Alan / Alan Genişletme (領域展開) · Lanetli Ruh
(呪霊) · Lanetli Alet (呪具) · Ters Lanet Tekniği (反転術式) · Bağlayıcı
Söz (束縛)**. Naruto ya da Bleach terminolojisi kullanma.

⚠️ Yayında olan JJK sayfaları ve mekanikleri: Sukuna/Itadori (iki modlu kap
+ yirmi parmak sayacı), Gojō (iki boş yuva, sonucu zıtlık belirliyor),
Megumi (ortak zemin çizgisi), Nobara (iki pano), Nanami (%70), Getō (tek
yönlü hazne). Hiçbirine yaklaşma. Dalga 5'te bu dördü **yeniden**
yazılıyor, yani onların yeni mekanikleri de sana yasak: gölge havuzu,
serbest çivi yerleştirme, mesai saati, dallanan ihanet yolu.

---

## 17 · Chōsō — `chousou` · önek `--chs-`

**Fikir:** kan ve kardeşlik. Dokuz Ölü Rahim Ölüm Sancağı'nın en büyüğü.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Dikey damar sütunu.** Sayfanın ortasından aşağı inen kalın bir damar; bölümler o damardan **sağa ve sola dallanıyor** (dallanma noktaları görünür). Akış her zaman yukarıdan aşağı, tek yönlü. |
| **Tipografi** | Başlık `var(--font-shippori)` (mincho) — ama **kalın kesim ve sıkışık** (Rukia'daki ince/havadar kullanımın tam tersi). Gövde `var(--font-petrona)`. |
| **Hareket** | **Akışkan kırmızı sıvı.** SVG `path` boyunca ilerleyen dolgu (`stroke-dashoffset`) + damar dallarında yavaş nabız (`opacity` salınımı). Ağır ve viskoz — hızlı hiçbir şey yok. |
| **Düğme** | **"Kan Bağı"** — `data-blood`. Açıkken damar ağı sayfanın **tamamına** yayılıyor (bölüm kenarlarına kılcal damarlar uzuyor), palet doyuyor, kardeş adları beliriyor. |
| **Filigran** | **Elle çizilmiş SVG damar/dallanma deseni** + `脹相`. |
| **Mekanik** | **"Dokuz kardeş."** Damar sütunu boyunca dokuz kardeş sıralı. Birine tıklandığında **ondan aşağıya doğru kan akıyor** (path animasyonu); akış tamamlanınca o kardeşin anısı açılıyor ve yanda bir "kan bağı" göstergesi doluyor. Dokuzu da açılınca Chōsō'nun Yūji'yi kardeşi olarak tanıdığı an açılıyor. |

**Yasak:** Ino'nun "dairesel düğüm ağı, merkeze bağlanan çizgiler". Senin
ağın **dairesel değil dikey** ve akış **tek yönlü**.

```css
.page[data-world="chousou"] {
  --bg: #0e090a;
  --surface: #181012;
  --surface-hover: #201719;
  --border: #281d20;
  --border-strong: #392b2e;
  --text-primary: #d1c7c9;
  --text-secondary: #9c7c84;
  --text-muted: #a17882;
  --accent: #cc5c78;
  --accent-hover: #cd8496;
  --accent-muted: #4d2d35;
  --gold: #ae775b;
  --warn: #b88347;
  --danger: #c16257;
  /* kendi --chs-* token'ların buraya */
}
```

---

## 18 · Maki Zen'in — `maki-zenin` · önek `--mki-`

**Fikir:** lanet enerjisi yok — saf fizik ve alet. Zen'in klanının reddi.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Envanter ızgarası.** Katı, eşit hücreli bir silah rafı (oyun envanteri gibi); her hücrede bir lanetli alet. Bölümler bu ızgaranın etrafında düz bloklar. Süs yok, işlev var. |
| **Tipografi** | Başlık `var(--font-plexmono)`, ALL CAPS, **geniş harf aralığı, stencil hissi** (Armin'deki küçük not kullanımının tam tersi: burada mono çok büyük ve askeri). Gövde `var(--font-inter)`. |
| **Hareket** | **Çelik takırtısı.** Kısa, sert, mekanik geçişler (`steps()` easing ile kademeli). Organik hiçbir hareket yok — Maki'nin sayfası yumuşamaz. |
| **Düğme** | **"Cennetsel Kısıtlama"** — `data-restriction="before" \| "after"`. `before`: palet soluk, gözlük var, istatistikler düşük. `after`: palet keskinleşir (doygunluk artar), gözlük gider, istatistikler yükselir, ızgara çizgileri kalınlaşır. |
| **Filigran** | **Zen'in klan arması — üstü SVG ile çizilmiş bir X ile çizilmiş** (reddediliş). Kanji: `禪院`. |
| **Mekanik** | **"Silah rafı."** Envanterden bir alet seçildiğinde **künye/stat şeridi o alete göre yeniden hesaplanıyor** (menzil, ağırlık, hız, lanet enerjisi hep 0). Sayılar gerçekten değişiyor. Lanet enerjisi sütunu her seçimde **sıfır kalıyor** — sayfanın sessiz esprisi bu. |

**Yasak:** Urahara'nın "3×3 açılan çekmece ızgarası". Sende hücreler
açılmıyor, **seçiliyor** ve sayıları değiştiriyor.

```css
.page[data-world="maki-zenin"] {
  --bg: #0d0e0b;
  --surface: #161813;
  --surface-hover: #1d1f1a;
  --border: #242720;
  --border-strong: #34372f;
  --text-primary: #cdd1c7;
  --text-secondary: #8f9c7c;
  --text-muted: #83946b;
  --accent: #7a9852;
  --accent-hover: #8eab69;
  --accent-muted: #2a3021;
  --gold: #788991;
  --warn: #b88347;
  --danger: #c3675d;
  /* kendi --mki-* token'ların buraya */
}
```

---

## 19 · Mahito — `mahito` · önek `--mht-`

**Fikir:** ruhun şekli bedenin şeklidir. Hiçbir şey sabit kalmıyor.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Düzensiz, dikişli parçalar.** Bölümler farklı boy ve şekilde (`border-radius` her köşede farklı), aralarında **dikiş çizgileri** (`stroke-dasharray` teyel) var. Hiçbir kenar diğerine paralel değil. |
| **Tipografi** | Başlık `var(--font-cormorant)` — ama **her kelime farklı puntoda** (deforme tipografi; `<span>` başına farklı `font-size`). Gövde `var(--font-jost)`. |
| **Hareket** | **Morph.** Kartlar hover/odakta `border-radius` ve `clip-path` değiştirerek **deforme oluyor**. Yumuşak ve tedirgin edici — hızlı değil, sürünen. |
| **Düğme** | **"Ruhun şekli"** — `data-soul`. Açıkken bütün kenarlar daha da düzensizleşir, dikişler görünür hâle gelir, ten tonları öne çıkar. |
| **Filigran** | **Elle çizilmiş SVG dikiş/yama deseni** (Mahito'nun yüzündeki dikişler) + `無為転変`. |
| **Mekanik** | **"Beden değiştirme."** Beş "form" var. Bir form seçildiğinde **aynı kart** başka bir şekle **dönüşüyor** (morph) ve içindeki metin de değişiyor — kart yer değiştirmiyor, yeni kart açılmıyor: aynı kutu başka bir şey oluyor. Morfoloji ekseni. |

```css
.page[data-world="mahito"] {
  --bg: #0c0d0e;
  --surface: #141617;
  --surface-hover: #1b1e1f;
  --border: #212526;
  --border-strong: #303536;
  --text-primary: #c8cfd0;
  --text-secondary: #819498;
  --text-muted: #708a8f;
  --accent: #9fc0c1;
  --accent-hover: #b4d4d5;
  --accent-muted: #496869;
  --gold: #a67468;
  --warn: #b88347;
  --danger: #c2665b;
  /* kendi --mht-* token'ların buraya */
}
```

---

## 20 · Aoi Tōdō — `aoi-toudou` · önek `--tdo-`

**Fikir:** Boogie Woogie — alkışla yer değiştirme. Sayfanın esprisi bu.

| Eksen | Kilit |
|---|---|
| **Izgara** | **İdol posteri ızgarası.** Parlak, ortalanmış, simetrik bloklar; büyük görsel alanları, kalın çerçeveler, poster tipografisi. Bu dalganın **en parlak ve en neşeli** sayfası. |
| **Tipografi** | Başlık `var(--font-numeral)` (Archivo Black) — dev, ortalanmış, poster gibi. Gövde `var(--font-inter)`. Takada-chan bölümünde pop etiketleri. |
| **Hareket** | **Takas (swap).** Öğeler yer değiştirirken kısa bir `translate` + `scale` sıçraması (FLIP hissi). Ayrıca alkış anında tek kareli bir parlama. |
| **Düğme** | **"Kardeşim!"** — `data-brother`. Açıkken Tōdō'nun "en iyi dostum" çerçevesi devreye giriyor: sayfadaki ikinci kişi (Yūji) her bölümde yanında beliriyor, palet fuşyaya doyuyor. |
| **Filigran** | **Elle çizilmiş SVG alkış/el silueti** + `不義遊戯` (Boogie Woogie). |
| **Mekanik** | **"Alkış."** Sayfada bir alkış düğmesi. Basıldığında **iki bölüm/görsel yer değiştiriyor** (gerçekten: DOM sırası ya da grid alanı takas ediliyor). Hangi ikisinin takas edileceğini kullanıcı önceden **işaretliyor** (iki hedef seç, sonra alkışla). Yer değiştirme ekseni. |

```css
.page[data-world="aoi-toudou"] {
  --bg: #0f0a0f;
  --surface: #191219;
  --surface-hover: #211821;
  --border: #291f29;
  --border-strong: #392d39;
  --text-primary: #d1c7d1;
  --text-secondary: #9c7c9c;
  --text-muted: #a076a0;
  --accent: #d666c0;
  --accent-hover: #d78ec9;
  --accent-muted: #5e3155;
  --gold: #dac32f;
  --warn: #b88347;
  --danger: #c26459;
  /* kendi --tdo-* token'ların buraya */
}
```

---

## 21 · Panda — `panda` · önek `--pnd-`

**Fikir:** lanetli ceset, üç çekirdek. Sıcak ve komik ama alt metni karanlık:
her çekirdek bir yaşam ve tükeniyor.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Üç dikey sütun** — Gorilla / Kardeş / Üçgen. Sayfanın tamamı üç sütun üzerine kurulu; seçili çekirdeğin sütunu genişliyor, diğer ikisi daralıyor (akordiyon değil, **oran** değişimi). Mobilde üst üste. |
| **Tipografi** | Başlık `var(--font-jost)`, **yuvarlak ve dost** (Mikasa'daki soğuk/geniş kullanımın tersi: burada sıkı ve sıcak). Gövde `var(--font-petrona)`. |
| **Hareket** | **Bambu salınımı.** Dikey çizgiler hafifçe eğilip düzeliyor; geçişler yumuşak ve elastik (`cubic-bezier` ile hafif geri sekme). |
| **Düğme** | **"Lanetli ceset"** — `data-corpse`. Açıkken sıcak-komik ton çekiliyor: renkler soluyor, çekirdek göstergeleri anatomik bir çizime dönüşüyor, alt metin (Panda'nın bir insan olmadığı) öne çıkıyor. |
| **Filigran** | **Elle çizilmiş SVG bambu deseni** + üç çekirdeği gösteren üç halka. Kanji: `呪骸`. |
| **Mekanik** | **"Üç çekirdek."** Gorilla / Kardeş / Üçgen seçilebilir; her modda stat, palet vurgusu ve gövde silueti değişiyor. **Ama seçim kalıcı değil — her kullanım o çekirdeği TÜKETİYOR.** Üçü de kullanılınca sayfa kilitleniyor ve Panda'nın "üç kere ölebilirim" gerçeği açılıyor. Sayfa yenilenene dek geri gelmiyor. |

**Yasak:** Ichigo'nun "beş kademeli kimlik seçici"si. Sende seçim
**tükeniyor** — kademe değil, kaynak. |

```css
.page[data-world="panda"] {
  --bg: #0f0f0d;
  --surface: #181915;
  --surface-hover: #20201b;
  --border: #272822;
  --border-strong: #373831;
  --text-primary: #cfd1c7;
  --text-secondary: #959a7e;
  --text-muted: #8b916e;
  --accent: #adb569;
  --accent-hover: #b8bd89;
  --accent-muted: #40422e;
  --gold: #b18559;
  --warn: #b88347;
  --danger: #c4695f;
  /* kendi --pnd-* token'ların buraya */
}
```

---

## 22 · Tōji Fushiguro — `touji-fushiguro` · önek `--toj-`

**Fikir:** sıfır lanet enerjisi. Boş gökyüzü. Bir şeyin **yokluğu** üzerine
kurulu sayfa.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Üstte çok geniş boş alan** ("boş gökyüzü") — sayfanın üst üçte biri bilinçli olarak neredeyse boş. İçerik alt bölgeye toplanmış, yatay ve alçak. Her bölümde bu üst boşluk korunuyor. |
| **Tipografi** | Başlık `var(--font-inter)` **çok ince (200) ve çok büyük**, geniş harf aralığı. Gövde `var(--font-cormorant)`. Kirli beyaz üstüne yazılmış gibi. |
| **Hareket** | **Neredeyse hiç.** Yalnızca çok yavaş bir yatay kayma (gökyüzü) ve alet seçildiğinde kısa, kesin bir çizgi. Bu, Dalga 4'ün **en hareketsiz** sayfası. |
| **Düğme** | **"Cennetsel Kısıtlama"** — `data-restriction`. ⚠️ Maki'de de aynı kavram var ama **düğmenin yaptığı iş farklı olmalı**: Maki'de palet ve istatistik değişiyor; sende düğme **lanet enerjisi sütununu görünür kılıyor** ve o sütun sayfa boyunca boş bir şerit olarak beliriyor (yokluğun görselleşmesi). |
| **Filigran** | **Elle çizilmiş SVG lanetli alet silueti** (Zincir/İnverted Spear) — dolgusuz, çok soluk. Kanji: `伏黒甚爾`. |
| **Mekanik** | **"Envanter."** Lanetli alet çantasından bir alet seçiliyor; her alet bir **fiziksel** istatistiği yükseltiyor (hız, güç, menzil). Yanındaki **lanet enerjisi sütunu hiç kıpırdamıyor** — her seçimde `0` yazıyor. Kullanıcı ne yaparsa yapsın sıfır kalıyor. Değişmeyen sıfır + artan karşıt. |

⚠️ Maki'nin mekaniği de envanter tabanlı. **Ayrım şart:** Maki'de ızgara
bir **raf** ve seçim stat şeridini yeniden hesaplıyor; sende bir **çanta**
ve vurgu tek bir sütunun hiç değişmemesinde. Maki'nin sayfası dolu ve
askeri, seninki boş ve sessiz. Kalan beş eksende net ayrış.

```css
.page[data-world="touji-fushiguro"] {
  --bg: #0a0a0b;
  --surface: #121314;
  --surface-hover: #191a1b;
  --border: #202123;
  --border-strong: #2e3032;
  --text-primary: #c9cbcf;
  --text-secondary: #838995;
  --text-muted: #7b8393;
  --accent: #bfb9b0;
  --accent-hover: #dacebe;
  --accent-muted: #72634f;
  --gold: #738596;
  --warn: #b88347;
  --danger: #c16257;
  /* kendi --toj-* token'ların buraya */
}
```

---

## 23 · Jōgo — `jougo` · önek `--jgo-`

**Fikir:** volkan. Okudukça kül birikiyor ve okumayı zorlaştırıyor.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Katmanlı yer kesiti.** Bölümler yatay jeolojik katmanlar gibi üst üste; aralarında **magma çatlakları** (SVG düzensiz çizgiler) var ve aşağı indikçe katmanlar koyulaşıp ısınıyor. |
| **Tipografi** | Başlık `var(--font-anton)` — ama Eren'in bodur/sıkışık kullanımının aksine **çok geniş harf aralığı ve büyük satır aralığı** (yayılan ısı). Gövde `var(--font-plexmono)`. |
| **Hareket** | **Kül ve kıvılcım.** Yukarıdan aşağı süzülen kül parçacıkları + çatlaklarda nabız gibi parlayan turuncu. |
| **Düğme** | **"Erime noktası"** — `data-molten`. Açıkken çatlaklar genişler, obsidyen zemin kızarır, kül daha koyu düşer. |
| **Filigran** | **Tek göz motifi** (elle çizilmiş SVG, Jōgo'nun tek gözü) + `漏瑚`. |
| **Mekanik** | **"Kül."** Sayfa okundukça (bölüm açıldıkça) yukarıdan **kül birikiyor** ve metnin üstünü kısmen kapatıyor. Kullanıcı bir "üfle" düğmesiyle külü temizliyor — ama **her temizlemeden sonra kül daha hızlı birikiyor**. Dördüncüde artık temizlenemiyor ve Jōgo'nun yenilgisi metni açılıyor. Birikip geri gelen engel. |

**Yasak:** Naruto'nun "dokuz kademeli ısınan ray"ı, Itachi'nin "karanlıkta
fener"i, Levi'nin "toz silme"si (Dalga 1). Levi'de toz **kalıcı**
temizleniyordu; sende kül **geri geliyor ve hızlanıyor** — ve bu bir
kaybediş anlatısı.

⚠️ Kül metni kapatırken erişilebilirliği bozma: kül katmanı
`aria-hidden` + `pointer-events: none` olmalı, metin ekran okuyucuda tam
okunmalı ve `prefers-reduced-motion`'da kül hiç birikmemeli.

```css
.page[data-world="jougo"] {
  --bg: #0c0909;
  --surface: #161110;
  --surface-hover: #1e1816;
  --border: #251f1d;
  --border-strong: #362e2b;
  --text-primary: #d1c9c7;
  --text-secondary: #9c847c;
  --text-muted: #9c7b70;
  --accent: #e3581c;
  --accent-hover: #dd774b;
  --accent-muted: #3e2014;
  --gold: #d5aa34;
  --warn: #b88347;
  --danger: #c16257;
  /* kendi --jgo-* token'ların buraya */
}
```

---

## 24 · Yūta Okkotsu — `yuuta-okkotsu` · önek `--yut-`

**Fikir:** monokrom bir sayfa ve Rika'nın olduğu yerde tek renk taşması.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Ortalanmış tek kolon, ama sağ kenarda Rika'ya ait dar bir "taşma" şeridi** var; o şerit sayfanın tek renkli bölgesi ve bölümlerin dışına taşıyor (`overflow` görünür, negatif `margin`). |
| **Tipografi** | Başlık `var(--font-cinzel)` — tören havası (yüzük, yemin). Gövde `var(--font-cormorant)`. Todoroki de Cinzel kullanıyor ama orada **simetrik ve bölünmüş**; sende **ortalanmış ve tek**. |
| **Hareket** | **Renk taşması.** Monokrom alandan renkli alana geçişte renk **sızıyor** (`mask-image` ile ilerleyen bir gradyan). Ayrıca yüzük halkası yavaşça dönüyor. |
| **Düğme** | **"Rika"** — `data-rika="alone" \| "bound"`. `alone`: sayfa tamamen monokrom, sağ şerit boş. `bound`: şerit doluyor, renk sayfaya sızıyor, istatistikler yükseliyor. |
| **Filigran** | **Elle çizilmiş SVG yüzük** (Rika'nın verdiği) — çok büyük, ince kontur. Kanji: `里香`. |
| **Mekanik** | **"Kopyalanan teknikler."** Yūta başkalarının tekniklerini kopyalar. Bir kart destesi var; kullanıcı bir teknik "kopyaladığında" o kart desteye ekleniyor ve **sayfadaki monokrom alan azalıyor, renk yayılıyor**. Deste büyüdükçe sayfa renkleniyor. Koleksiyon → renk yayılımı. |

**Yasak:** eski Getō'nun "topla-biriktir-boşalt" haznesi ve Dalga 5'te
Getō'ya yazılan **dallanan ihanet yolu**. Sende toplama **geri
alınabilir** ve görsel sonucu **rengin yayılması**.

```css
.page[data-world="yuuta-okkotsu"] {
  --bg: #0d0d0d;
  --surface: #151515;
  --surface-hover: #1d1d1d;
  --border: #242424;
  --border-strong: #333333;
  --text-primary: #cccccc;
  --text-secondary: #8f8a8a;
  --text-muted: #8d8484;
  --accent: #8a63bf;
  --accent-hover: #a189c2;
  --accent-muted: #393045;
  --gold: #858585;
  --warn: #b88347;
  --danger: #c26459;
  /* kendi --yut-* token'ların buraya */
}
```

---

## Nexus bağları (bu dalgada zorunlu)

- **Tōji ↔ Megumi** (#126635) — baba/oğul, çift yönlü. Görev listesinde
  ayrıca istendi.
- Chōsō ↔ Yūji (#127212), Chōsō ↔ Mahito (kardeşini öldüren)
- Maki ↔ Tōji (Zen'in klanı), Maki ↔ Yūta
- Mahito ↔ Nanami (#133704), Mahito ↔ Jōgo
- Tōdō ↔ Yūji, Tōdō ↔ Gojō (#127691)
- Panda ↔ Maki ↔ Yūta (Kyoto/Tokyo ikinci sınıflar)
- Jōgo ↔ Sukuna (#133701), Jōgo ↔ Gojō
- Yūta ↔ Gojō, Yūta ↔ Getō (#133699)
