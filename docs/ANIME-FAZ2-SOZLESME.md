# Anime Karakter Sayfaları — Faz 2 Sözleşmesi (28 sayfa)

> **Bu dosya bir ajanın tek başına bir sayfayı bitirebilmesi için yazıldı.**
> Önce `docs/KARAKTER-SAYFASI-EKLEME.md` oku (sistemin nasıl çalıştığı),
> sonra buradaki kendi bölümünü. İkisi çelişirse **bu dosya kazanır** —
> Faz 2'nin ek şartları burada.

---

## 0. Faz 1'in hatası ve bu fazın tek başarı ölçüsü

25 Ağustos'ta üretilen Gojo / Megumi / Nobara / Nanami / Getō setinde beş
sayfa birbirinin neredeyse birebir kopyası çıktı ve **reddedildi**. Aynı
ızgara, aynı başlık ölçeği, aynı kart yapısı, aynı geçişler.

Bu fazın tek numaralı ölçüsü şu: **rastgele iki sayfanın ekran görüntüsü
yan yana konduğunda ortak bir şablondan çıktıkları anlaşılmamalı.**

Aynı yedi durak, tamamen farklı beden.

### Ayrışma ekseni tablosu — HER SAYFA EN AZ 4'ÜNDE FARKLI

| # | Eksen | Ne demek |
|---|---|---|
| 1 | **Izgara / düzen** | tek kolon / iki kolon / diagonal / dikey şerit / kart kolajı / ufuk bandı |
| 2 | **Tipografi** | görüntü fontu + gövde fontu + büyüklük/harf aralığı/büyük-küçük harf muamelesi |
| 3 | **Hareket dili** | duman / kar / kıvılcım / parçacık / kırık cam / mürekkep / tarama / titreşim |
| 4 | **Palet** | aşağıda karakter başına VERİLDİ, değiştirme |
| 5 | **Mod düğmesi mekaniği** | düğmenin sayfada ne yaptığı — ışık değil, YAPI değişmeli |
| 6 | **Filigran nesnesi** | kanji / arma / silüet / desen / doku |

Aşağıdaki karakter bölümlerinde altı eksenin **hepsi** kilitlendi. Kilidin
dışına çıkma; içinde istediğin kadar zenginleştir.

**Dalga içi ek kural:** aynı dalgadaki sayfalar **görüntü fontunu,
ızgarasını, hareket dilini ve düğme mekaniğini paylaşamaz.** Dalgalar arası
font tekrarı, muamele (ölçek/aralık/harf durumu) belirgin farklıysa kabul.

---

## 1. Bozulamaz sözleşmeler

Bunların hepsi `docs/KARAKTER-SAYFASI-EKLEME.md`'de gerekçesiyle yazılı;
burada yalnızca liste:

- **Dört kayıt.** `experiences.ts`, `roster.ts`, rota klasörü ve bileşen
  klasörü. **İlk üçü SENİN İŞİN DEĞİL** — merkezde yazıldı, dokunma.
  Sen yalnızca `components/character/<slug>/` ve
  `lib/characters/<slug>-experience.ts` yazıyorsun.
- **Giriş bileşeni sunucu bileşeni.** Dosyanın başında `"use client"` YOK.
  Adlandırılmış export, dosya adıyla aynı; default export yok.
- **Kök öğe** `className={styles.page}` **+** `data-world="<slug>"` taşır.
  Kök `<main>` OLMAZ — kök layout zaten `<main id="icerik">` çiziyor.
- **Klasörde TEK `.module.css`.** İkinci bir modül eklersen denetim
  betikleri yanlış dosyayı seçer ve o klasördeki bütün `styles.X`
  okumaları "tanımsız sınıf" olarak patlar (26 Ağustos'ta Gojo'da oldu).
- **Palet dosyanın EN BAŞINDA**, `.page[data-world="…"]` bloğunda.
  `:global([data-world=…])` çalışmaz (CSS Modules "pure selector").
- **Deri bloğu dışında TEK hex yok.** Ara ton →
  `color-mix(in srgb, var(--x) 40%, transparent)`.
- **Yardımcı token adlandırması:** `--<önek>-…`. Küçük metinde
  kullanacağın her rengin `-text` ekli bir kardeşi olmalı ve metin ONU
  okumalı (`--ern-steam-text` gibi) — ölçüm yalnızca `-text` ekli
  olanlara bakıyor.
- **Görünen her metin `LocalizedText`** (`{ tr, en }`), bileşende
  `pick(text, locale)`. İstemci adalarına **düz dize** iner.
- **Erişilebilirlik:** her bölüm `aria-labelledby`; sayfada **tek `<h1>`**;
  tıklanabilir her şey gerçek `<button>`/`<a>`; dokunma hedefi
  ≥ `var(--touch-min)`; görünür `:focus-visible`; klavyeyle gezilebilir.
- **Hareket** ya `@media (prefers-reduced-motion: no-preference)` kapısında
  ya da dosya sonunda bir `reduce` battaniyesiyle kapanır.
- **360 px'te yatay taşma olmaz.** Taşabilecek her blok kendi
  `overflow-x: auto` kabında.
- `"use client"` yalnızca durum tutan küçük adalarda — **en fazla 3**.

### Sayfalar arası bileşen paylaşımı YASAK

Kendi klasöründeki dosyalar dışında hiçbir karakter bileşeni import etme.
Paylaşılabilecek TEK şey altyapı:

```
@/components/character/CuratorFrame   → CuratorFrame
@/components/character/CuratorSlot    → CuratorSlot
@/components/character/CuratorGaps    → CuratorGaps, CuratorGapRow
@/lib/characters/experiences          → yardımcılar + CharacterExperienceProps
@/lib/characters/types                → LocalizedText, pick, CharacterFact…
```

Başka bir karakterin `lib/characters/<başka>-experience.ts` dosyasını da
import etme. Kendi veri dosyanı kendin yaz.

---

## 2. Kullanılmış mekanikler — HİÇBİRİNİ TEKRARLAMA

Aşağıdaki 41 mekanik yayında. Seninki bunların hiçbiriyle **yapısal olarak**
aynı olmamalı. "Aynı ray, başka etiket" kabul değil.

| Sayfa | Mekanik |
|---|---|
| Itachi | karanlıkta fener + tıklanabilir Sharingan paneli |
| Naruto | dokuz kademeli "ısınan" ray |
| Sasuke | dikey yarık, sayfayı ikiye bölme |
| Ichigo | maske çatlağı + beş kademeli kimlik seçici |
| Kakashi | sekmeli kartoteks |
| Sakura | dolan mühür göstergesi |
| Urahara | 3×3 açılan çekmece ızgarası |
| Shikamaru | tahtada ilerleyen 5 hamlelik zincir |
| Aizen | iki gerçeklik katmanı + kırık ayna parçaları |
| Jiraiya | çevrilen el yazması sayfaları |
| Hinata | dairesel görüş halkası + kör nokta |
| Kenpachi | çentikli kılıç rayı |
| Rock Lee | sekiz kapılı dikey merdiven |
| Sukuna/Itadori | iki modlu kap + yirmi parmak sayacı |
| Sai | adım adım açılan mürekkep tomarı |
| Yamato | yükselen gövde + beş büyüme kademesi |
| Iruka | **kara tahta, tebeşirle yazılan beş ders** |
| Konohamaru | dikey devir zinciri, son halka boş |
| Chōji | iki kefeli hap terazisi |
| Ino | dairesel düğüm ağı |
| Kiba | iki sütun → tek sütuna kilitlenen düzen |
| Shino | altıgen petek ızgarası, komşuya yayılan seçim |
| Neji | 2→64 ardışık vuruş sayacı + kafes mührü |
| Tenten | aşağı açılan parşömen, mühür kareleri |
| Gaara | yandan kesit, üst üste beş kum tabakası |
| Temari | yay hâlinde açılan yelpaze |
| Kankurō | yukarıdan inen ipler, parçalarına ayrılan kuklalar |
| Tsunade | bahis masası, çevrilen kartlar |
| Orochimaru | üst üste binen, **geriye soyulan** deri katmanları |
| Kabuto | çekilen kimlik kartları destesi, son kart boş |
| Obito | şeffaflaşan maske, dört isim katmanı |
| Madara | yükselen basamaklar — sayfanın **ölçeği** değişiyor |
| Nagato | üç soru + yoğunlaşan yağmur |
| Konan | origami katlama adımları |
| Minato | Hiraishin işaretleriyle **anlık** gezinme |
| Kushina | gerilen ve kopan chakra zinciri halkaları |
| Gojō | iki boş yuva; sonucu miktar değil ZITLIK belirliyor |
| Megumi (eski) | ortak zemin çizgisi, üç ayrı cevap |
| Nobara (eski) | iki pano: solda vuruyorsun, sağda oluyor |
| Nanami (eski) | tahmin → ölç → kes; hep %70 |
| Getō (eski) | tek yönlü hazne: al, biriktir, bir kere boşalt |

⚠️ **Onizuka'ya dikkat:** Iruka zaten "kara tahta + tebeşir" mekaniğini
kullanıyor. Onizuka'da kara tahta yalnızca **doku** olabilir; mekanik
başka bir şey (kendi bölümünde yazılı).

---

## 3. Görsel politikası (Faz 2'de DEĞİŞTİ)

Eski kural "dışarıdan raster indirme yok" idi. Faz 2'de kullanıcı kararı
farklı:

- **Resmî portre REPODA.** Her karakterin AniList portresi indirildi:
  `public/assets/anime/karakterler/<slug>/anilist-portrait.(png|jpg)`
  Aynı klasörde `kaynak.json` var: künye, ölçü ve kaynak adresi.
  **Hotlink YOK** — `next/image`e bu yerel yolu ver.
- ⚠️ **Ölçüldü: bu portre 230×345.** Yani tam kanama (full-bleed) bir
  hero için KÜÇÜK. Onu küçük/orta bir kadrajda kullan (portre kartı,
  madalyon, künye yanı). Büyük hero karesi **küratör yuvası** olarak
  kalsın — kullanıcı 1200×1600'ü kendi yükleyecek.
- Yerel görsel `next/image`de `unoptimized` DEĞİL (kendi kaynağımız).
  Küratörün yüklediği portre için `isUploadedPortrait(detail)` kuralı
  geçerli.
- **Sahne/teknik/dönem görselleri üretilmez.** Her biri için bir
  `<önek>:<anahtar>` ABILITY yuvası tanımla; görsel yokken bölüm
  **görselsiz ama ayakta** kalsın. Motif gerekiyorsa **elle SVG çiz**.
- Her `alt` metnine kaynak bilgisi yaz (örn.
  `"Levi Ackerman — AniList resmî portresi"`). Yalnızca dekoratif
  SVG/filigran `aria-hidden` + boş `alt`.
- **Sayfanın altına kaynak künyesi** (`LocalizedText`): AniList künyesi +
  `https://anilist.co/character/<id>` bağlantısı. Portre dışında görsel
  kullandıysan onun kaynağını da yaz.

### Küratör yuvaları — kullanıcının açık şartı

1. **Her görselin HEMEN ALTINDA** bir `CuratorSlot`. Sayfa sonunda toplu
   yuva bloğu **YASAK**. Görsel yoksa da (boş kadraj) yuva o kadrajın
   altında durur.
2. Her yuvaya `size={{ w, h }}` **ve** beklenen tipi anlatan bir `label`
   ver — `CuratorUpload` ölçüyü ve oranı kendisi yazıyor:

```tsx
<CuratorSlot
  characterId={EREN_ID}
  slot="ABILITY"
  abilityName={EREN_IMAGE_KEYS.hero}
  label={pick(EREN_SLOT_LABELS[EREN_IMAGE_KEYS.hero], locale)}
  size={{ w: 1200, h: 1600 }}
/>
```
   `label` metni tipi söylesin: `"Hero — dikey portre, webp"`.
3. **Sayfanın en altında** `CuratorGaps` — düzenleyicisiz özet:

```tsx
<CuratorGaps
  title={pick(EREN_GAPS.title, locale)}
  emptyLabel={pick(EREN_GAPS.empty, locale)}
  filledLabel={pick(EREN_GAPS.filled, locale)}
  allFilledLabel={pick(EREN_GAPS.allFilled, locale)}
  rows={gapRows}
/>
```
   `gapRows` her yuva için `{ key, label, spec, filled }`; `filled`
   `ability.has(key)` ile hesaplanır. `CuratorGaps` küratör modu kapalıyken
   kendini çizmiyor, ama çağrıyı yine de `isAdmin ? … : null` ile kes.

---

## 4. Yedi durak

Sıra ve biçim karaktere göre; **hepsi bulunsun**:

1. **Hero** — portre + evrene ait büyük filigran (`aria-hidden`)
2. **Mod düğmesi** — karaktere özgü adlı, sayfanın tamamını çeviren tek durum
3. **Künye şeridi** — doğum, boy, kan grubu, yaş, rütbe/unvan, takım, sembolik obje
   (veriler `kaynak.json`'da: `dogum`, `kanGrubu`, `yas`, `aciklama` içinde boy)
4. **Güç laboratuvarı** — 3 büyük + 4 küçük kart, evrenin **gerçek**
   terminolojisiyle (Titan Gücü / ODM · Quirk / Ultimate Move ·
   Zanpakutō / Kidō · Jujutsu / Lanetli Teknik)
5. **İnteraktif bölüm** — sayfanın kalbi; tıklanabilir + klavyeyle gezilebilir
6. **Kader çizelgesi** — 5 adım, yaş etiketli, kilit anlarda orijinal replik
7. **Kapanış** — iki replik + orijinal dil motto + kaynak künyesi

Üstte breadcrumb: `animeHref.characters()` → `t("backToGallery")`.

---

## 5. Bitirme ve rapor

```bash
# nerede: <worktree>\frontend
npx tsc --noEmit
npx eslint components/character/<slug> lib/characters/<slug>-experience.ts
node scripts/check-karakter-sinif.mjs
node scripts/check-karakter-hex.mjs
node scripts/check-karakter-kontrast.mjs
```

- `tsc` **proje geneli** koşuyor: bu dalgada henüz yazılmamış BAŞKA
  karakterlerin rotalarından hata görebilirsin. **Yalnızca kendi dosya
  yollarını içeren hataları düzelt.**
- `next build` **ÇALIŞTIRMA** — RAM yetmiyor, tam derleme merkezde bir kez
  alınıyor.
- İşin bitince kendi dalında commit et:
  `git add` ile **dosyaları tek tek** ekle (`git add -A` kullanma).

Raporunda şunlar olsun:
1. Yazılan dosyalar
2. Yedi durağın hepsi tamam mı
3. Küratör yuvası sayısı + `ABILITY` anahtar listesi
4. Kaynak atıfları
5. **Ayrışma: altı eksenden hangilerinde nasıl ayrıştın** (en az 4)
6. Denetim çıktıları (tsc / eslint / sinif / hex / kontrast)
