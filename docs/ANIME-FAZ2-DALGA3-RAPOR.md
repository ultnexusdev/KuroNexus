# Faz 2 · Dalga 3 — Bleach (6 sayfa) · BİTİŞ RAPORU

> Grup 1 raporu. Görev dokümanı `anime-gorev-B-bleach-jjk-rework.md` §7'nin
> istediği özet. Grup 2 (JJK kimlik ameliyatı) bu rapordan SONRA başladı.
> Tarih: 31 Ağustos 2026. Dal: `anime/faz2-dalga35` (taban `main` = `7e9934f`).

---

## 0. Neden taban `main`, `anime/karakter-fazi-2` değil

Devralınan entegrasyon dalı (`anime/karakter-fazi-2`, `d11ab02`) **derlenmiyor.**

`ce7692d` beş My Hero Academia rotasını ve kaydını merkeze yazmış, ama o beş
sayfanın **bileşenleri hiç commit'lenmemiş** — beş worktree'de commit'siz
duruyorlar ve ikisinin (Midoriya `NotebookExperience`, Todoroki
`HalfAndHalfExperience`) ana bileşeni hiç yazılmamış. Beş klasörün hiçbirinde
`.module.css` yok. Yani Dalga 2 yarım: rota var, bileşen yok, `tsc` beş
TS2307 veriyor.

Görev dokümanı Dalga 2'yi "tamamlandı ve push edildi" sayıyor; gerçek bu
değil. Bu dalgayı o kırık dalın üstüne kurmak, kendi işimin doğrulanmasını
başkasının yarım işine bağlardı. Bu yüzden:

- yeni dal `anime/faz2-dalga35`, tabanı `main` (`7e9934f`, son yeşil hâl)
- `d11ab02`'nin **yalnızca doküman/betik** kısmı cherry-pick edildi (`5de2d93`)
- `ce7692d` (dalga 2 kaydı) alınmadı
- Dalga 2'nin beş worktree'sine ve dalına **dokunulmadı**, kaybolmadılar

## 1. Yazılan dosyalar

| Sayfa | Klasör | Bileşenler | Toplam satır |
|---|---|---|---|
| Rukia Kuchiki #6 | `rukia-kuchiki` | `ShirayukiExperience` + `SnowShell` + `ThreeDances` + `RukiaGlyphs` | 3.738 |
| Renji Abarai #906 | `renji-abarai` | `ZabimaruExperience` + `JointShell` + `SegmentChain` + `RenjiGlyphs` | 3.693 |
| Uryū Ishida #564 | `uryuu-ishida` | `QuincyExperience` + `BlutShell` + `ReticleBoard` + `UryuuGlyphs` | 4.118 |
| Ulquiorra Cifer #1081 | `ulquiorra-cifer` | `HollowExperience` + `HollowShell` + `HeartKey` + `UlquiorraGlyphs` | 4.012 |
| Grimmjow Jaegerjaquez #1080 | `grimmjow-jaegerjaquez` | `DesgarronExperience` + `PanteraShell` + `ClawDeck` + `GrimmjowGlyphs` | 4.141 |
| Yoruichi Shihōin #908 | `yoruichi-shihouin` | `ShunkoExperience` + `FormShell` + `DualLedger` + `YoruichiGlyphs` | 3.828 |

Her klasörde **tek** `.module.css` (ölçüldü). Her sayfanın kendi
`lib/characters/<slug>-experience.ts` dosyası var.

Merkezde yazılanlar (ajanlar dokunmadı): 6 rota, `EXPERIENCE_IDS`,
`EXPERIENCE_COMPANIONS`, `roster.ts`.

Birleşme: `2f44204` · `28d95ee` · `f4f84df` · `7b903b2` · `dd57150` · `45bbda3`.

## 2. Yedi durak — altı sayfanın altısında tam

Hero · mod düğmesi · künye şeridi · güç laboratuvarı (3 büyük + 4 küçük) ·
interaktif bölüm · kader çizelgesi (5 adım) · kapanış + kaynak künyesi.
Üstte `animeHref.characters()` breadcrumb'ı.

Terminoloji altısında da Bleach'in kendi sözlüğü: Zanpakutō · Asauchi ·
Shikai · Bankai · Kidō (Hadō/Bakudō) · Shunpo · Hierro · Cero · Sonído ·
Resurrección · Segunda Etapa · Desgarrón · Heilig Bogen · Blut Vene/Arterie ·
Vollständig · Hirenkyaku · Shunkō · Onmitsukidō. Naruto/JJK terimi yok.

## 3. Küratör yuvaları — 101 ABILITY + 6 PORTRAIT

| Sayfa | ABILITY anahtarı |
|---|---|
| Rukia | 18 (`ruk:`) |
| Renji | 20 (`ren:`) |
| Uryū | 15 (`ury:`) |
| Ulquiorra | 16 (`ulq:`) |
| Grimmjow | 15 (`grm:`) |
| Yoruichi | 17 (`yor:`) |

Merkezde yazılan bağımsız denetim (`yuva-denetimi.mjs`) üç şeyi **koda
bakarak** doğruladı, ajan raporuna değil:

1. her anahtarın `SLOT_LABELS` + `SLOT_SIZES` + `SLOT_SPECS` karşılığı var
2. her anahtar sayfada gerçekten çiziliyor (ölü anahtar yok)
3. `CuratorGaps` satırları `Object.values(IMAGE_KEYS)` ile tamamını geziyor

Sonuç: **101/101 temiz.** Yuvaların hepsi kendi kadrajının hemen altında;
sayfa sonunda yalnızca düzenleyicisiz `CuratorGaps`, `isAdmin` ile kesilmiş.

## 4. Kaynak atıfları

Altı sayfanın altısında sayfa altında AniList künyesi +
`https://anilist.co/character/<id>` bağlantısı. Her `alt` metninde kaynak
yazılı. Portreler repoda (`/assets/anime/karakterler/<slug>/anilist-portrait.*`,
230×345/346), `next/image`de `unoptimized` yok çünkü kendi kaynağımız.

**Hotlink taraması: sıfır.** Altı klasörde de `s4.anilist.co` ya da dışarıya
giden herhangi bir raster adresi yok. Filigranların, arma ve desenlerin
tamamı elle çizilmiş SVG.

## 5. Ayrışma — altı eksen

| Sayfa | Izgara | Tipografi | Hareket | Düğme | Filigran | accent |
|---|---|---|---|---|---|---|
| Rukia | ortalanmış dar tek kolon + genişleyen kar bantları | shippori ince + cormorant, satır aralığı 2.4–2.8 | kar taneciği + `clip-path` kristal | `data-moon` — zemin **aydınlanıyor** | Kuchiki monu + 袖白雪 | `#c2c7d1` |
| Renji | **zikzak**, bölümler dönüşümlü kayık | brush (Yuji Boku) BÜYÜK + inter | eklem `scaleX` zinciri + `stroke-dashoffset` | `data-release` — zikzağın **genliği** artıyor | dövme bandı + 蛇尾丸 | `#db3624` |
| Uryū | katı görünür blueprint ızgarası, 12 kolon | **blackletter** + plexmono | nişangâh kilitlenmesi (sıçramalı) + teyel | `data-blut` — ızgara kalınlığı/hücre | Quincy haçı + 滅却師 | `#4a5fb5` |
| Ulquiorra | ortada **gerçek boşluk**, içerik etrafından dolanıyor | cormorant 300, çok büyük, geniş aralık | tek `@keyframes`: gözyaşı izi | `data-heart` — metin hiyerarşisi | boşluğun kendisi + 虚 | `#4acf97` |
| Grimmjow | yırtılmış bantlar, dokuz farklı `clip-path` | Archivo Black düz + kırpılmış | `clip-path` yırtma, **fade yok** | `data-ressurect` — yırtık derinliği | pençe izi + 破面 + 6 | `#3fa0d5` |
| Yoruichi | **yatay kayan şeritler** (dikey akış + yatay okuma) | petrona **italik** + inter + plexmono | art-görüntü (afterimage) | `data-form` — künye **verisi** değişiyor | Shihōin arması + 瞬神 | `#a74ab5` |

Altı sayfanın **altısı da** altı eksenin en az beşinde ayrışıyor (şart: 4).

Makineyle ölçüm — `check-karakter-ayrisma.mjs`, 48 sayfa, **1.128 çift**:
altı yeni sayfanın hiçbiri tek bir yakın çiftte bile geçmiyor (ne hata, ne
uyarı eşiğinde). Yayındaki Dalga 1 sayfalarıyla (Eren/Mikasa/Armin/Levi/
Onizuka) ve dört eski Bleach sayfasıyla (Ichigo/Urahara/Aizen/Kenpachi)
karşılaştırma da bu ölçümün içinde.

Palet: altı accent de yeni. En yakın komşuluk Ulquiorra `#4acf97` ~ Sakura
`#4cbc88` = **24 birim** (hata eşiği 15, uyarı eşiği 20). Kontrast denetimi
50 paleti ölçtü, yeni hiçbir uyarı doğmadı.

## 6. Nexus bağları — hepsi kuruldu, eksik hedef YOK

Görev dokümanı Uryū'nün Quincy hedefini "yoksa link kurma" diye işaretlemişti.
Merkezde `lib/anime/bleach/anchors.ts` okundu: hedef **var**, adı `empire`
(Wandenreich, Quincy imparatorluğu). Altı ajana da doğrulanmış çapa listesi
gönderildi, böylece hiçbiri tahminle link kurmadı ve hiçbiri yanlışlıkla
"eksik hedef" yazmadı.

| Sayfa | Evren çapaları | Karakter bağları |
|---|---|---|
| Rukia | `#gotei` `#zanpakuto` `#bankai` `#houses` | Renji ↔, Ichigo, Byakuya (sayfa yok → düz ad) |
| Renji | `#gotei` `#bankai` `#zanpakuto` `#houses` | Rukia ↔, Ichigo, Byakuya (düz ad), Aizen, Kenpachi |
| Uryū | `#empire` `#powers` `#war` | Ichigo, Ulquiorra; Orihime/Chad/Ryūken düz ad |
| Ulquiorra | `#espada` `#hueco` `#hierarchy` | Grimmjow ↔, Ichigo, Aizen; Orihime düz ad |
| Grimmjow | `#espada` `#hueco` `#hierarchy` | Ulquiorra ↔, Ichigo, Aizen, Kenpachi |
| Yoruichi | `#gotei` `#houses` `#powers` `#legends` | Urahara, Ichigo, Aizen, Rukia; Suì-Fēng düz ad |

Adresler elle yazılmadı, `animeHref.bleach()` ile birleşti. Sayfası olmayan
karakter `isExperienceCharacter()` false döndüğü için düz adla çiziliyor.

Yoldaş listeleri `EXPERIENCE_COMPANIONS` ile **birebir** aynı — Dalga 1'in
dördüncü dersi (Armin sayfası Levi'yi çiziyordu ama listede yoktu) altısında
da baştan doğru yapıldı.

## 7. Denetim çıktıları (merkezde, birleşme sonrası)

```
npx tsc --noEmit            → 4 hata, hepsi Dalga 5'in henüz yazılmamış
                              bileşenleri (126635/133699/133700/133704).
                              Altı Bleach sayfasından SIFIR hata.
npx eslint <12 yol>         → temiz, exit 0
check-karakter-kayit        → 4 sorun (aynı dört Dalga 5 bileşeni)
check-karakter-sinif        → TEMIZ (48 modul)
check-karakter-hex          → TEMIZ (48 modul)
check-karakter-kontrast     → TEMIZ (50 palet)
check-karakter-ayrisma      → TEMIZ (48 sayfa, 1128 cift)
yuva-denetimi (merkez)      → TEMIZ (101 anahtar)
tekdil-denetimi (merkez)    → TEMIZ (6 sayfa)
```

`next build` **bu aşamada koşulamaz**: Dalga 5'in dört bileşeni yazılana
kadar rotalar çözülmüyor. Tam derleme Grup 2 bittikten sonra bir kez alınacak
(görev §7'nin build şartı oraya ertelendi, sebebiyle birlikte).

## 8. Placeholder kalan görseller — 101 kadraj

101 ABILITY kadrajının **tamamı** boş. Sayfada gerçek raster tek: depodaki
230×345 AniList portresi ve o da yalnızca dar madalyon kadrajında. Büyük hero
kareleri bilerek boş küratör yuvası (Faz 2 §3: portre hero için küçük).

Ziyaretçi bu boşlukları **yazısız** görüyor — üretim metadatası (`1600×900 ·
webp`) altı sayfada da `isAdmin` ile kesildi. Bu Dalga 1'in birinci dersiydi
(Levi'de ziyaretçi 15 etiketli kutu görüyordu) ve bu turda hiç doğmadı;
merkezde tek tek `frame()` yardımcılarına bakılarak doğrulandı.

Doldurulacak yuvaların tam listesi her sayfanın kendi `CuratorGaps` panelinde,
küratör modunda.

## 9. Bilinçli sapmalar — kullanıcının bilmesi gereken üç karar

1. **Üç sayfada tırnak içinde diyalog yok** (Uryū, Ulquiorra, Yoruichi).
   Yedinci durak "iki replik" istiyor; üç ajan da o karakterin Japonca
   repliğini bu turda doğrulayamadı ve Dalga 1'in beşinci dersi
   ("emin olmadığın cümleyi tırnağa alma") uyarınca **uydurmak yerine
   boş bıraktı**. Yerine doğrulanmış özgün *terim* ve *kayıt* blokları var,
   her birinin altında kaynağı yazılı, ve sayfa bunun neden böyle olduğunu
   görünür bir notta söylüyor. Rukia'da beş, Renji'de iki, Grimmjow'da iki
   özgün blok var — Rukia ve Grimmjow'unkiler de diyalog değil komut/ad.
   **Karar sizin:** gerçek replik isteniyorsa kanon kaynağa karşı ayrı bir
   doğrulama turu gerekiyor.
2. **Yoldaş portrelerinin altında yükleme yuvası yok** (altı sayfada da).
   Oraya bir `<önek>:` ABILITY yuvası koymak, başka bir karakterin yüzünü bu
   karakterin kaydına yazmak olurdu. Yoldaş kareleri arşivin kendi
   `CharacterImage` kaydından geliyor ve kayıt girildiğinde kendiliğinden
   yerine oturuyor.
3. **Ulquiorra'nın Hollow deliği boğaz dibinde**, göğsünde değil. Görev
   dokümanı "göğsündeki delik" diyor; göğsünde olan 4 numarası. Layout'taki
   boşluk kavramsal olduğu için tasarım değişmedi, yalnızca metin doğru yazıldı.

## 10. Sırada

Grup 2 — Dalga 5, Jujutsu Kaisen kimlik ameliyatı: Megumi, Nobara, Nanami,
Getō. Eski bileşen setleri `components/character/.deprecated/` altına taşındı
(silinmedi), rotalar yeni bileşen adlarına bağlandı, Gojo'ya dokunulmadı.
