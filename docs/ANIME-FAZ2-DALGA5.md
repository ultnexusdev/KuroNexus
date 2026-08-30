# Faz 2 · Dalga 5 — Jujutsu Kaisen, kimlik ameliyatı (4 sayfa)

> Önce `docs/ANIME-FAZ2-SOZLESME.md` oku.

Bu dördü **zaten yayında** ve Faz 1'in "hepsi birbirinin kopyası" sorununun
kaynağı. Sıfırdan yeniden tasarlanıyor.

| # | Karakter | AniList | Klasör | Yeni bileşen | Yeni veri dosyası |
|---|---|---|---|---|---|
| 25 | Megumi Fushiguro | 126635 | `megumi-fushiguro` | `ShadowMenagerieExperience` | `megumi-fushiguro-experience.ts` |
| 26 | Nobara Kugisaki | 133700 | `nobara-kugisaki` | `StrawDollExperience` | `nobara-kugisaki-experience.ts` |
| 27 | Kento Nanami | 133704 | `kento-nanami` | `OvertimeExperience` | `kento-nanami-experience.ts` |
| 28 | Suguru Getō | 133699 | `suguru-getou` | `ReliquaryExperience` | `suguru-getou-experience.ts` |

## Eski dosyalar — MERKEZDE TAŞINDI, sen dokunma

Eski bileşen setleri ve eski veri dosyaları
`components/character/.deprecated/<slug>/` altına taşındı ve orada
derlenmeye devam ediyor. **Silme, geri getirme, oradan import etme.**

Klasörün kendisi (`components/character/<slug>/`) senin için **boşaltıldı**.
Yeni bileşen setini oraya yaz. Klasörde **tek** `.module.css` olacak.

Rota dosyaları yeni bileşen adına **zaten bağlandı**.

## İçerik korunabilir, kimlik korunamaz

Eski sayfaların **metinleri** (biyografi, teknik açıklamaları, kronoloji,
replikler) doğruysa yeniden kullanabilirsin — `.deprecated/<slug>/` altındaki
eski veri dosyasını **okuyup** kendi yeni dosyana taşıyabilirsin (import
etme, kopyala ve gerekiyorsa düzelt). Ama **görsel kimlik komple değişecek**:
ızgara, tipografi, hareket, palet, düğme, filigran ve mekanik yeni.

Eski mekanikler artık **yasak listesinde**:
- Megumi: ortak zemin çizgisi, seçim üç ayrı cevap veriyor
- Nobara: iki pano, solda vuruyorsun sağda oluyor
- Nanami: tahmin → ölç → kes, hep %70
- Getō: tek yönlü hazne, al-biriktir-bir kere boşalt

---

## 25 · Megumi Fushiguro — `megumi-fushiguro` · önek `--meg-`

**Fikir:** On Gölge. Gölge tek bir havuz ve her çağrı ondan eksiltiyor.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Alttan yukarı dolan sayfa.** Sayfanın alt kenarında sabit duran bir **gölge havuzu** şeridi var (`position: sticky; bottom: 0`); bölümler onun üstünde akıyor ve çağrılan shikigami havuzdan çıkıp bölümlerin arasına yerleşiyor. |
| **Tipografi** | Başlık `var(--font-brush)` (Yuji Boku, fırça) — Renji'de büyük ve taşkın kullanıldı; sende **küçük, sıkı ve dikey** (mühür yazısı gibi). Gövde `var(--font-inter)`. |
| **Hareket** | **Gölge birikintisi (fluid blob).** Havuz kenarları yavaşça deforme oluyor (`border-radius` animasyonu); shikigami çıkarken gölge yukarı **uzayıp kopuyor**. |
| **Düğme** | **"Alan"** — `data-domain`. Açıkken Chimera Shadow Garden: zemin tamamen gölgeye dönüyor, bölüm kenarları kayboluyor, sayfa tek bir sürekli karanlık alan oluyor. |
| **Filigran** | **Shikigami çağırma mühürleri** (elle çizilmiş SVG el işareti/mühür deseni) + `十種影法術`. |
| **Mekanik** | **"Gölge havuzu."** Sayfanın altında tek bir havuz var ve on shikigami onu paylaşıyor. Bir shikigami çağrıldığında **havuz küçülüyor** ve yaratık sayfada kalıyor. Havuz bitince yenisi çağrılamıyor — çağrılanlardan birini **geri göndermek** gerekiyor. Mahoraga kilitli: yalnızca havuz tamamen boşken ve diğer dokuzu da çağrılmışken açılıyor, ve açıldığında sayfa geri dönülmez şekilde değişiyor. Paylaşılan kaynak havuzu. |

```css
.page[data-world="megumi-fushiguro"] {
  --bg: #08090c;
  --surface: #0f1017;
  --surface-hover: #15171f;
  --border: #1b1d27;
  --border-strong: #292b38;
  --text-primary: #c7c9d1;
  --text-secondary: #7c829c;
  --text-muted: #7980a2;
  --accent: #7275c5;
  --accent-hover: #9798c9;
  --accent-muted: #383951;
  --gold: #777b9c;
  --warn: #b88347;
  --danger: #c06056;
  /* kendi --meg-* token'ların buraya */
}
```

---

## 26 · Nobara Kugisaki — `nobara-kugisaki` · önek `--nob-`

**Fikir:** Tokyo moda dergisi düzeni + saman bebek ve çivi.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Dergi sayfası.** Büyük görsel blokları, üstüne binen tipografi (`z-index` katmanları), asimetrik sütunlar, geniş kenar boşlukları ve tam kanama görseller. Kart ızgarası YOK — editoryal serbestlik. |
| **Tipografi** | Başlık `var(--font-bebas)` — dev, ALL CAPS, dergi kapağı ölçeğinde. (Levi de Bebas kullandı ama orada **küçük ve sessiz**; sende **devasa ve gürültülü**.) Gövde `var(--font-petrona)`. Etiketler mono. |
| **Hareket** | **Çekiç vuruşu.** Tıklamada kısa ve sert bir titreşim (`translate` sarsıntısı) + merkezden yayılan tek bir ses dalgası halkası. Yumuşak fade YOK. |
| **Düğme** | **"Rezonans"** — `data-resonance`. Açıkken çiviler arası bağ çizgileri görünür oluyor, palet sıcak pembeye doyuyor, dergi düzeni sıkışıyor. |
| **Filigran** | **Elle çizilmiş SVG saman bebek + çivi** silueti + `芻霊呪法`. |
| **Mekanik** | **"Üç çivi."** Sayfada altı sabit çivi noktası var. Kullanıcı **üçünü** seçiyor. Seçilen üçlü belirli bir üçgen oluşturuyorsa "rezonans" gerçekleşiyor ve o üçlüye ait içerik açılıyor; oluşturmuyorsa hiçbir şey olmuyor (Nobara'nın kuralı: bağ yoksa etki yok). Yanlış üçlüler de anlamlı bir geri bildirim versin. |

**Yasak:** eski Nobara'nın "iki pano" mekaniği. Sende tek düzlem ve
**konum seçimi** var.

```css
.page[data-world="nobara-kugisaki"] {
  --bg: #0f0c0b;
  --surface: #181513;
  --surface-hover: #201b19;
  --border: #282220;
  --border-strong: #38312e;
  --text-primary: #d1cac7;
  --text-secondary: #9c877c;
  --text-muted: #9c7f70;
  --accent: #dc89b7;
  --accent-hover: #e0aec9;
  --accent-muted: #76425e;
  --gold: #b87e51;
  --warn: #b88347;
  --danger: #c2665b;
  /* kendi --nob-* token'ların buraya */
}
```

---

## 27 · Kento Nanami — `kento-nanami` · önek `--nan-`

**Fikir:** kurumsal estetik. **Layout'un kendisi 7:3 oranında bölünsün.**

| Eksen | Kilit |
|---|---|
| **Izgara** | **Sabit 7:3 bölünme.** Sayfanın tamamı boyunca `grid-template-columns: 7fr 3fr`. Sol %70 içerik, sağ %30 "mesai defteri" (saat, notlar, sayaçlar). Oran hiçbir bölümde değişmiyor — Nanami'nin katılığı bu. Mobilde 7:3 dikeye döner (üst %70 / alt %30), tek kolona **çökmez**. |
| **Tipografi** | Başlık `var(--font-jost)`, orta ağırlık, **kravat gibi dar ve düzenli**, ALL CAPS değil. Gövde ve sayılar `var(--font-plexmono)` (ofis raporu hissi). |
| **Hareket** | **Saat ibresi.** Tek yönlü, ölçülü, `steps()` ile kademeli geçişler — akrep gibi. Hiçbir şey serbest hareket etmiyor. |
| **Düğme** | **"Mesai bitti"** — `data-overtime`. Açıkken kurumsal katman düşüyor: lacivert koyulaşıyor, altın vurgu öne çıkıyor, sağ sütun bir "fazla mesai" kaydına dönüşüyor. |
| **Filigran** | **Elle çizilmiş SVG kravat çizgisi deseni** (Nanami'nin çizgili kravatı) + `七海建人`. |
| **Mekanik** | **"Mesai saati."** Sağ sütunda 09:00–18:00 arası bir saat şeridi. **Kullanıcı saati doğrudan çeviremiyor** — her bölüm okunduğunda (açıldığında) saat ilerliyor. Yani zamanı harcayan şey ilerlemenin kendisi. 18:00'e gelindiğinde sayfa "mesai bitti" durumuna geçiyor: kalan bölümler kilitleniyor ve Nanami'nin son günü açılıyor. |

**Yasak:** eski Nanami'nin "tahmin → ölç → kes / hep %70" mekaniği.
Dalga 1'deki Onizuka'nın VHS scrubber'ı da bir zaman şeridi — **fark:
sende zaman geri alınamıyor ve kullanıcı onu doğrudan sürükleyemiyor.**

```css
.page[data-world="kento-nanami"] {
  --bg: #090b10;
  --surface: #10131b;
  --surface-hover: #161a23;
  --border: #1c212b;
  --border-strong: #2a2f3c;
  --text-primary: #c7cad1;
  --text-secondary: #7c869c;
  --text-muted: #7683a0;
  --accent: #cfbb6e;
  --accent-hover: #d1c594;
  --accent-muted: #595236;
  --gold: #6380ab;
  --warn: #b88347;
  --danger: #c26459;
  /* kendi --nan-* token'ların buraya */
}
```

---

## 28 · Suguru Getō — `suguru-getou` · önek `--get-`

**Fikir:** tapınak ve ihanet. Aynı adam iki yol ayrımında.

| Eksen | Kilit |
|---|---|
| **Izgara** | **Dallanan yol.** Sayfa yukarıdan aşağı bir yol; her kilit anda **ikiye ayrılıyor** ve seçilen dal devam ediyor, seçilmeyen dal soluk bir kol olarak yanda kalıyor. Bölümler bu yolun düğümlerinde. |
| **Tipografi** | Başlık `var(--font-shippori)` (mincho) — tapınak kitabesi gibi, orta boy, dikey ritimli. Gövde `var(--font-cormorant)`. |
| **Hareket** | **Mor duman.** Yavaş yükselen, dağılan duman katmanları (`filter: blur` + `translateY`, düşük opaklık). Sert hiçbir şey yok; her şey dağılıyor. |
| **Düğme** | **"Maymun"** — `data-monkey`. Getō'nun sıradan insanlara verdiği ad. Açıkken sayfadaki "koruduğu insanlar" dili "maymunlar" diline dönüyor (metinler gerçekten değişiyor) ve palet soğuyor. Bu düğme **içeriği** çeviriyor, biçimi değil. |
| **Filigran** | **Elle çizilmiş SVG tapınak kapısı (torii) + tespih** deseni + `呪霊操術`. |
| **Mekanik** | **"İhanet çizelgesi."** Kader çizelgesi ihanet ekseninde kurulu: her adımda kullanıcı **"kal" ya da "git"** seçiyor. Seçimler bir yol çiziyor ve sayfa sonunda hangi yolu seçtiysen Getō'nun o versiyonu anlatılıyor (öğretmen kalan Getō / Yıldız Vebası'ndan sonra kopan Getō). İki sonuç da yazılı ve ikisi de gerçek — çünkü Getō'nun trajedisi bu. Dallanan seçim. |

**Yasak:** eski Getō'nun "tek yönlü haznesi", Yūta'nın "kopyalanan
teknikler destesi" (Dalga 4). Sende koleksiyon değil **karar** var.

```css
.page[data-world="suguru-getou"] {
  --bg: #0c0a0d;
  --surface: #151217;
  --surface-hover: #1c181f;
  --border: #241f26;
  --border-strong: #332d37;
  --text-primary: #cec7d1;
  --text-secondary: #927c9c;
  --text-muted: #9479a2;
  --accent: #a46bc2;
  --accent-hover: #b390c6;
  --accent-muted: #43344b;
  --gold: #857b8e;
  --warn: #b88347;
  --danger: #c26459;
  /* kendi --get-* token'ların buraya */
}
```

---

## Nexus bağları (bu dalgada zorunlu)

- **Getō ↔ Gojō** (#127691) — çift yönlü, görev listesinde ayrıca istendi
- **Megumi ↔ Tōji** (#162722) — çift yönlü
- Megumi ↔ Yūji (#127212) ↔ Nobara (Takım Gojō, üçü de birbirine)
- Nanami ↔ Yūji, Nanami ↔ Mahito (#133702)
- Getō ↔ Yūta (#129571)
