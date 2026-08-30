# Faz 2 · Dalga 2 — My Hero Academia (5 sayfa)

> Önce `docs/ANIME-FAZ2-SOZLESME.md` oku. Bu dosya yalnızca **senin
> karakterinin kilitli eksenleri** ve paletidir.

Dalga içi kural: bu beş sayfa **görüntü fontunu, ızgarasını, hareket dilini
ve düğme mekaniğini paylaşamaz.**

| # | Karakter | AniList | Klasör | Bileşen | Veri dosyası |
|---|---|---|---|---|---|
| 6 | Izuku Midoriya | 89028 | `izuku-midoriya` | `NotebookExperience` | `izuku-midoriya-experience.ts` |
| 7 | Katsuki Bakugō | 88892 | `katsuki-bakugou` | `DetonationExperience` | `katsuki-bakugou-experience.ts` |
| 8 | Shōto Todoroki | 89220 | `shouto-todoroki` | `HalfAndHalfExperience` | `shouto-todoroki-experience.ts` |
| 9 | Ochako Uraraka | 89221 | `ochako-uraraka` | `ZeroGravityExperience` | `ochako-uraraka-experience.ts` |
| 10 | Toshinori Yagi | 89224 | `toshinori-yagi` | `PlusUltraExperience` | `toshinori-yagi-experience.ts` |

Güç bölümünün terminolojisi bu evrende: **Quirk (個性) / Ultimate Move /
Hero Adı / Kahraman Sıralaması**. "Jutsu" ya da "teknik" yazma.

---

## 6 · Izuku Midoriya — `izuku-midoriya` · önek `--mid-`

**Fikir:** analiz defteri. Midoriya'nın gücü yumruğu değil, not tutması.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Kareli kağıt zemin** (CSS `repeating-linear-gradient` ızgara) üzerine "yapıştırılmış" kartlar. Asimetrik iki kolon: solda geniş içerik, sağda dar kenar-not sütunu. Kartlar hafif gölgeli, kağıda iğnelenmiş gibi. |
| **Tipografi** | Başlık `var(--font-inter)` en ağır kesim, sıkışık; **kenar notları `var(--font-corinthia)`** (el yazısı — bu font bu dalgada YALNIZCA sende). Gövde `var(--font-petrona)`. Ölçüm/sayı `var(--font-plexmono)`. |
| **Hareket** | **Yeşil şimşek + kalem çizgisi.** SVG `stroke-dashoffset` ile çizilen ok işaretleri ve alt çizgiler; kısa, sinirli şimşek kıvılcımları. |
| **Düğme** | **"Analiz"** — `data-analysis`. Açıkken sayfadaki her karta el yazısı kenar notları, ok işaretleri ve ölçüm etiketleri **eklenir** (kapalıyken hiç yok). İçerik artıyor, düzen aynı kalıyor. |
| **Filigran** | **Kareli defter ızgarası** + `個性` (quirk). |
| **Mekanik** | **"Vestige'ler."** One For All'ın sekiz önceki sahibi. Bir sahibe tıklandığında portrenin ARKASINDA o kişinin silueti **kümülatif** bir saydam katman olarak birikiyor, ve yanındaki "devralınan" listesi büyüyor. Sekizi de seçilince tam sıra görünür. Katmanlar **eklenir** (geri de alınabilir). |

**Yasak:** Orochimaru'nun "geriye **soyulan** deri katmanları" — sende
katmanlar **ekleniyor**, soyulmuyor. Jiraiya'nın "çevrilen sayfaları" —
sende sayfa çevrilmiyor.

```css
.page[data-world="izuku-midoriya"] {
  --bg: #0b0f0d;
  --surface: #131815;
  --surface-hover: #19201d;
  --border: #202824;
  --border-strong: #2e3833;
  --text-primary: #c7d1cc;
  --text-secondary: #7c9c8c;
  --text-muted: #699680;
  --accent: #60be79;
  --accent-hover: #86c195;
  --accent-muted: #2e4233;
  --gold: #bdae4c;
  --warn: #b88347;
  --danger: #c2665b;
  /* kendi --mid-* token'ların buraya */
}
```

---

## 7 · Katsuki Bakugō — `katsuki-bakugou` · önek `--bkg-`

**Fikir:** patlama ve geri tepme. Her patlama onu da savuruyor.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Hazard şerit ızgarası.** Bölümler diagonal sarı-siyah uyarı bantlarıyla ayrılıyor (`repeating-linear-gradient(45deg, …)`). Sert köşeler, `border-radius: 0`. Bloklar farklı genişlikte, hizasız. |
| **Tipografi** | Başlık `var(--font-numeral)` (Archivo Black), çok büyük, hafif eğik (`skewX(-4deg)`), harf aralığı **negatif**. Gövde `var(--font-jost)`. |
| **Hareket** | **Şok dalgası halkaları.** `box-shadow` / `radial-gradient` ile dışa yayılan tek darbeli halkalar. Yumuşak geçiş YOK — ani, sert, kısa. |
| **Düğme** | **"Nitrogliserin"** — `data-sweat="dry" \| "primed"`. `primed`: hazard bantları kalınlaşır, kenarlar kırılır (`clip-path` çentik), yazı tipi bir kademe büyür, palet turuncuya doyar. |
| **Filigran** | **Elle çizilmiş SVG patlama poligonu** (manga tarzı sivri yıldız) + `爆豪`. |
| **Mekanik** | **"Geri tepme."** Bakugō'nun patlaması onu da savurur. Bir tekniğe basıldığında kart **ileri fırlıyor**, ama sayfa gövdesi **ters yöne kayıyor** (`transform: translate` ile, gerçek scroll değil). Beş teknik, beş farklı geri tepme yönü. Etki ve tepki her zaman zıt. |

**Yasak:** Getō'nun "biriktir sonra bir kere boşalt" haznesi, Shino'nun
"komşuya yayılan seçimi". Senin ekseni **etki-tepki**.

```css
.page[data-world="katsuki-bakugou"] {
  --bg: #0d0b0a;
  --surface: #161412;
  --surface-hover: #1e1b19;
  --border: #26221f;
  --border-strong: #36322e;
  --text-primary: #d1ccc7;
  --text-secondary: #9c8c7c;
  --text-muted: #95816d;
  --accent: #f2a650;
  --accent-hover: #edb97d;
  --accent-muted: #764d1e;
  --gold: #c56249;
  --warn: #b88347;
  --danger: #c26459;
  /* kendi --bkg-* token'ların buraya */
}
```

---

## 8 · Shōto Todoroki — `shouto-todoroki` · önek `--tdr-`

**Fikir:** sayfa **dikey olarak ikiye bölünmüş**. Sol buz, sağ ateş.
Bölünme çizgisi sayfa boyunca devam ediyor.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Dikey ikiye bölünme.** Sayfanın tamamı boyunca inen tek bir bölünme çizgisi; HER bölüm bu çizginin iki yanına yerleşiyor. Sol yarı soğuk (buz), sağ yarı sıcak (ateş). Bölünme oranı bir CSS değişkeni (`--tdr-split`). |
| **Tipografi** | Başlık `var(--font-cinzel)`, büyük harf, ağırbaşlı ve simetrik (bölünmüş kimliğe uygun tören havası). Gövde `var(--font-inter)`. |
| **Hareket** | **Kırağı ve ısı titremesi.** Sol yarıda kristal büyümesi (`clip-path` ilerlemesi), sağ yarıda sıcak hava titremesi (hafif `filter` dalgalanma). İki yarı **farklı** hareket ediyor. |
| **Düğme** | **"Yarım güç"** — `data-power="half" \| "full"`. `half`: yalnız bir taraf çalışır, diğer yarı donuk gri. `full`: iki taraf da canlı. |
| **Filigran** | `半分` (yarım) — **bölünme çizgisinin iki yanında yarısı buz, yarısı ateş renginde**. Ek olarak elle çizilmiş SVG kar tanesi / alev konturu. |
| **Mekanik** | **"Bölünme oranı."** Bölünme çizgisi **sürüklenebilir** (`<input type="range">`, 0–100). Oran değiştikçe sayfadaki **her** bölümün iki yarısının genişliği birlikte değişiyor. Tek kontrol, sayfanın tamamı. Uçlarda (%0 / %100) özel metin: tek tarafla yaşamanın bedeli. |

⚠️ Sasuke sayfasında da "dikey yarık" var. Fark: **Sasuke'de yarık sabit
bir bölme; sende oran SÜREKLİ ve kullanıcı kontrolünde, üstelik iki taraf
farklı hareket diline sahip.** Kullanıcının açık isteği bu — uygula, ama
kalan beş eksende Sasuke'den net ayrış.

```css
.page[data-world="shouto-todoroki"] {
  --bg: #0b0d0e;
  --surface: #131618;
  --surface-hover: #1a1e1f;
  --border: #202527;
  --border-strong: #2f3437;
  --text-primary: #c7ced1;
  --text-secondary: #7c929c;
  --text-muted: #708a97;
  --accent: #4aa1b5;
  --accent-hover: #72aab6;
  --accent-muted: #212d30;
  --gold: #ca6242;
  --warn: #b88347;
  --danger: #c2665b;
  /* kendi --tdr-* token'ların buraya; ateş tarafı için --tdr-flame,
     --tdr-flame-text gibi bir aile tanımla */
}
```

---

## 9 · Ochako Uraraka — `ochako-uraraka` · önek `--urk-`

**Fikir:** yerçekimi. Sayfadaki her şey ya yüzüyor ya düşüyor.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Serbest yüzen kart alanı.** Kartlar hizalı bir ızgarada değil; farklı yüksekliklerde, hafifçe kaydırılmış (`translateY` farklı değerlerle) ve **salınıyor**. Alt kenarda görünmez bir "yer" çizgisi var. |
| **Tipografi** | Başlık `var(--font-cormorant)`, **hafif (300) ve italik**, çok büyük — havada asılı duran bir zarafet. Gövde `var(--font-inter)`. |
| **Hareket** | **Salınım ve düşüş.** Yüzerken yavaş `translateY` salınımı (farklı fazlarla, hepsi aynı anda değil); düşerken **ivmeli** (`cubic-bezier` ile hızlanan) ve yere çarpınca küçük bir sekme. |
| **Düğme** | **"Zero Gravity"** — `data-gravity="off" \| "on"`. `off` (varsayılan): kartlar yüzüyor, salınıyor. `on`: yerçekimi geri gelir. |
| **Filigran** | **Parmak ucu pedleri motifi** — beş daire (elle çizilmiş SVG), her bölümün köşesinde bir tanesi. Ek olarak `無重力`. |
| **Mekanik** | **"Release."** Ekranda bir "Release" düğmesi. Basılınca yüzen **tüm** kartlar aynı anda ivmelenerek düşüyor, alt kenarda yığılıyor ve orada üst üste binmiş hâlde okunuyor (düşmüş dizilim ayrı bir okuma sırası veriyor). Tekrar basınca kalkıyorlar. Uraraka'nın bulantısı: üçüncü kez üst üste kaldırınca bir "yeter" uyarısı çıkıyor. |

```css
.page[data-world="ochako-uraraka"] {
  --bg: #0e0b0d;
  --surface: #181315;
  --surface-hover: #1f1a1d;
  --border: #272024;
  --border-strong: #372f33;
  --text-primary: #d1c7cc;
  --text-secondary: #9c7c8c;
  --text-muted: #9f7a8c;
  --accent: #cd84a1;
  --accent-hover: #d2a7b8;
  --accent-muted: #60434f;
  --gold: #a98960;
  --warn: #b88347;
  --danger: #c26459;
  /* kendi --urk-* token'ların buraya */
}
```

---

## 10 · Toshinori Yagi — `toshinori-yagi` · önek `--alm-`

**Fikir:** Amerikan çizgi roman posteri. Ama posterin arkasında tükenmiş
bir adam var ve sayfanın mekaniği tam olarak o tükenme.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Çizgi roman paneli düzeni.** Kalın siyah konturlu, farklı boyutta paneller (bazıları iki sütun genişliğinde), aralarında beyaz "oluk" (gutter). Panel içi ben-day noktaları (`radial-gradient` deseni). |
| **Tipografi** | Başlık `var(--font-anton)` ama **kontur muamelesiyle** (`-webkit-text-stroke` ya da katmanlı `text-shadow` ile içi boş görünen dev harfler) — Eren'in dolu/bodur kullanımının tam tersi. Gövde `var(--font-inter)`. |
| **Hareket** | **Panel patlaması + ben-day kayması.** Bölüm girişinde panel kenarları kısa süre "çatlıyor" (`clip-path`), nokta deseni hafifçe kayıyor. Bir de düşen "kum saati" hissi: sayaç azalırken renk doygunluğu düşüyor. |
| **Düğme** | **"Plus Ultra"** — `data-form="golden" \| "true"`. Bu düğme sayfanın **kalbi**: `golden`'da palet altın, tipografi kalın konturlu, paneller büyük; `true`'da kontur incelir, ben-day kaybolur, paneller daralır, palet soğuk maviye kayar, hero görseli değişir. |
| **Filigran** | **Elle çizilmiş SVG konuşma balonu + ışın (speed line) demeti** + `平和の象徴` (barışın sembolü). |
| **Mekanik** | **"Kalan süre."** All Might günde yalnızca birkaç dakika All Might olabiliyor. Sayfada bir süre sayacı var (örn. 50 dakika). Kullanıcı bir gücü/anıyı "kullandıkça" sayaç **azalıyor** ve sayaç düştükçe sayfa kademeli olarak gerçek forma dönüyor (renk çekiliyor, kontur inceliyor). Sıfıra inince yalnızca "true" form kalıyor ve bir daha altın forma geçilemiyor (sayfa yenilenene dek). Tükenen kaynak. |

**Yasak:** Ichigo'nun "beş kademeli kimlik seçici"si — sende kademe yok,
**azalan bir sayaç** var ve geri dönüşü yok.

```css
.page[data-world="toshinori-yagi"] {
  --bg: #0b0c0f;
  --surface: #131418;
  --surface-hover: #191b20;
  --border: #202228;
  --border-strong: #2e3138;
  --text-primary: #c7c9d1;
  --text-secondary: #7c849c;
  --text-muted: #7983a2;
  --accent: #e1b847;
  --accent-hover: #dec173;
  --accent-muted: #594a21;
  --gold: #5488b6;
  --warn: #b88347;
  --danger: #c26459;
  /* kendi --alm-* token'ların buraya */
}
```

---

## Nexus bağları (bu dalgada zorunlu)

- Midoriya ↔ Toshinori (One For All devri) — **çift yönlü**
- Midoriya ↔ Bakugō (rekabet), Bakugō ↔ Todoroki, Uraraka ↔ Midoriya
- Sayfada adı geçen ama kendi sayfası olmayan karakterler için
  `isExperienceCharacter(id)` `false` dönecek — o zaman bağ verme, yalnız ad yaz.
