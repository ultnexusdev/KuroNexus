# Faz 2 · Dalga 5 — Jujutsu Kaisen kimlik ameliyatı (4 sayfa) · BİTİŞ RAPORU

> Grup 2 raporu. Grup 1 (`docs/ANIME-FAZ2-DALGA3-RAPOR.md`) yazıldıktan
> SONRA başladı — görev dokümanının sıra kuralı.
> Tarih: 31 Ağustos 2026. Dal: `anime/faz2-dalga35`.

---

## 1. Yazılan dosyalar

| Sayfa | Yeni bileşen seti | Toplam satır | Merge |
|---|---|---|---|
| Megumi Fushiguro #126635 | `ShadowMenagerieExperience` + `DomainShell` + `ShadowPool` + `MegumiGlyphs` | 4.808 | `aff104f` |
| Nobara Kugisaki #133700 | `StrawDollExperience` + `ResonanceShell` + `NailField` + `NobaraGlyphs` | 4.719 | `4318fc2` |
| Kento Nanami #133704 | `OvertimeExperience` + `ClockShell` + `ShiftLedger` + `NanamiGlyphs` | 4.358 | `5ab06f2` |
| Suguru Getō #133699 | `ReliquaryExperience` + `MonkeyShell` + `BetrayalPath` + `GetouGlyphs` | 4.541 | `c4010ff` |

Dördünün de commit kapsamı **tam olarak altı dosya** — tek tek doğrulandı
(`git show --name-only`). Hiçbiri `satoru-gojou/` klasörüne ve hiçbiri
`.deprecated/` altına dokunmadı.

## 2. Emeklilik — eski setler silinmedi

`components/character/.deprecated/` altında, derlenmeye devam ederek duruyor:

```
.deprecated/megumi-fushiguro/  TenShadowsExperience + DuskShell + ShadowLine
                              + ShadowFigures + data.ts
.deprecated/nobara-kugisaki/   ResonanceExperience + AssertShell + ResonanceBench
                              + NailGlyphs + data.ts
.deprecated/kento-nanami/      RatioExperience + OvertimeShell + RatioBench
                              + RatioGlyphs + data.ts
.deprecated/suguru-getou/      SwallowExperience + AfterShell + SwallowVault
                              + CurseGlyphs + data.ts
```

Veri dosyaları bileşenlerin **yanına** taşındı (`<slug>-experience.ts` →
`data.ts`) ve eski bileşenlerin tek import satırı göreli yola çevrildi. Üçü de
şart: veri dosyası yerinde kalsaydı eski bileşen yeni veriyi görür ve `tsc`
patlardı; modül yerinde kalsaydı aynı `data-world` için **iki palet bloğu**
olur ve kontrast denetimi "accent COK YAKIN" hatası verirdi (uzaklık 0).

Denetim betiklerinin `.deprecated`'ı atladığı ölçüldü: 52 modül taranıyor,
dördü listede yok.

## 3. Yedi durak — dördünde de tam

Terminoloji dördünde de JJK'nın kendi sözlüğü: 呪術 · 呪力 · 呪術式 ·
領域展開 · 反転術式 · 十種影法術 · 式神 · 芻霊呪法 · 共鳴り · 十劃呪法 ·
黒閃 · 呪霊操術 · 特級呪詛師 · 一級呪術師. Bleach ya da Naruto terimi yok.

## 4. Küratör yuvaları — 63 ABILITY + 4 PORTRAIT

| Sayfa | Anahtar |
|---|---|
| Megumi | 16 (`meg:`) |
| Nobara | 17 (`nob:`) |
| Nanami | 15 (`nan:`) |
| Getō | 15 (`get:`) |

Merkezdeki bağımsız denetim (`yuva-denetimi.mjs`) dördünde de temiz: her
anahtarın etiketi + ölçüsü + spec'i var, her anahtar gerçekten çiziliyor,
`CuratorGaps` tamamını geziyor. Yuvalar kendi kadrajının hemen altında;
sayfa sonunda yalnızca düzenleyicisiz özet, `isAdmin` ile kesilmiş.

**Getō'da sekiz anahtar bilerek eski adları koruyor** — küratörün önceki
sayfaya yüklediği kareler yeni sayfada da yerine oturuyor.

## 5. Ayrışma

Makineyle ölçüm — **52 sayfa, 1.326 çift**: dördü de tek bir yakın çiftte
geçmiyor (ne hata ne uyarı).

Brief'te öngördüğüm tek risk Getō ↔ Rukia'ydı (ikisi de `--font-shippori` +
`--font-cormorant` kilitli). Ajana bu çifti özellikle ölçtürdüm:
**yapı 0.23 · hareket 0.00 · ızgara 0.29 · durum 0.10**, font 1.00.
Hata eşiği "font 1 **ve** durum 1 **ve** ızgara ≥ 0.9" istiyor; yakın bile değil.
Ayrım muamelede: Rukia ince kesim + 2.4–2.8 satır aralığı + ortalanmış dar
kolon; Getō 500–700 ağırlık + 1.62 satır aralığı + dikey kanji rayları +
dallanan yol.

| Sayfa | Izgara | Tipografi | Hareket | Düğme | Mekanik |
|---|---|---|---|---|---|
| Megumi | altta sabit havuz şeridi, bölümler üstünde akıyor | fırça **küçük/sıkı/dikey** (Renji'nin tersi) | gölge blob deformasyonu + kopma | `data-domain` | paylaşılan havuz |
| Nobara | asimetrik 12 kolonlu dergi serimi, tam kanama plakalar | Bebas **11rem kapak ölçeği** (Levi'nin 1.15rem'inin tersi) | çekiç darbesi, `steps()` sarsıntı | `data-resonance` | altı çividen üçünü seç |
| Nanami | **her bantta sabit 7:3**, mobilde dikey 7:3 | Jost 300 + Plex Mono, ALL CAPS değil | saat ibresi, yalnız `steps()` | `data-overtime` | zamanı ilerleme harcıyor |
| Getō | dallanan yol: hayalet kol / omurga / gövde | Shippori 500–700, dikey ritim | mor duman, metnin arkasında | `data-monkey` (**içeriği** çevirir) | kal/git, iki sonuç da gerçek |

Paletler: dördü de brief'in yeni bloğu. Eskiler `.deprecated/`de kaldı, yani
ölçüme girmiyor. 54 palet ölçüldü, yeni yakınlık uyarısı doğmadı.

## 6. Denetim çıktıları (merkezde, dört merge sonrası)

```
npx tsc --noEmit          → 0 hata
npx eslint <20 yol>       → temiz, exit 0
check-karakter-kayit      → TEMIZ (53 adres, 53 kadro satiri)
check-karakter-sinif      → TEMIZ (52 modul)
check-karakter-hex        → TEMIZ (52 modul)
check-karakter-kontrast   → TEMIZ (54 palet)
check-karakter-ayrisma    → TEMIZ (52 sayfa, 1326 cift)
yuva-denetimi (merkez)    → TEMIZ (164 anahtar, 10 sayfa)
tekdil-denetimi (merkez)  → TEMIZ (10 sayfa)
next build                → ✓ Compiled successfully; 10 rotanın onu da listede
```

Görev §7'nin build şartı burada karşılandı: Grup 1'de derleme alınamıyordu
çünkü Dalga 5'in dört bileşeni henüz yoktu.

## 7. Nexus bağları

| Sayfa | Evren çapası | Bağlı | Düz ad (sayfa yok) |
|---|---|---|---|
| Megumi | `#domain` `#society` `#grades` | **Gojō** ✔, Yūji, Nobara, Sukuna | Tōji, Tsumiki |
| Nobara | `#society` `#grades` `#shibuya` | Yūji, **Megumi** ✔, Gojō, Nanami | Mahito |
| Nanami | `#grades` `#spirits` `#shibuya` `#energy` `#archetypes` | Yūji, Gojō, Nobara | Mahito, Junpei |
| Getō | `#spirits` `#archetypes` `#society` | **Gojō** ✔ (çift yönlü), Yūji, Sukuna | Yūta, Riko, Kenjaku |

Görev listesinin üç zorunlu bağı da kuruldu: **Megumi → Gojō**,
**Getō → Gojō**, **Nobara → Megumi**. Çapalar `lib/anime/jjk/anchors.ts`ten
merkezde doğrulanıp ajanlara verildi; hiçbiri tahminle link kurmadı.
**Eksik hedef yok.**

Tōji (#162722) ve Yūta (#129571) Dalga 4'te yazılacak; bugün sayfaları
olmadığı için `isExperienceCharacter()` false döndürüyor ve düz adla
çiziliyorlar. Dalga 4 girdiğinde bağ kendiliğinden kurulacak.

## 8. Placeholder kalan görseller — 63 kadraj

63 ABILITY kadrajının tamamı boş. Sayfadaki tek gerçek raster her karakterin
230×345 AniList portresi, yalnızca dar madalyon kadrajında. Ziyaretçi
boşlukları **yazısız** görüyor; üretim metadatası dördünde de `isAdmin` ile
kesildi.

İki sayfa boşluğu tasarıma çevirdi: Nanami'de boş kadraj 16:9 delik değil
**ince çizgili form alanı** (15 boş kutu sol sütunu duvara çevirirdi),
Nobara'da kanamayı fotoğraf değil renk plakaları ve tipografi taşıyor.

## 9. Ajanların bulduğu ve düzelttiği hatalar

Bu turda ajanlar **brief'in kendisinde** üç hata buldu. Üçünü de doğruladım:

1. **極ノ番「うずまき」** brief'te "Uzayan Karanlık" diye çevrilmişti.
   `うずまき` **girdap** demek, karanlık değil. Düzeltildi.
2. **星漿体** brief'te "Yıldız Vebası" (Star *Plague*) yazıyordu. Doğrusu
   **Yıldız Kabı** (Star Plasma Vessel), Riko Amanai'nin unvanı. Eski veri
   dosyası zaten doğru yazmıştı; yayına o gitti.
3. **領域展開** brief'te Getō'nun teknikleri arasında sayılmıştı. Getō'nun
   **kayıtlı bir alan genişletmesi yok**; onun yüzüyle açılan alan Kenjaku'ya
   ait. Uydurmak yerine kartta **yokluğu** anlatıldı.

Ek olarak Nanami ajanı brief'in `呪術師一級` yazımını **`一級呪術師`** olarak
düzeltti (sıfat önce gelir) ve Megumi ajanı **mekanikte ölü bir kural** buldu:

> Brief "havuz boşalsın **ve** diğer dokuzu da çağrılmış olsun" diyordu. Sekiz
> çağrılabilir şikigami havuzun tamamına eşit maliyetteyse, hangi altkümeyi
> seçerseniz seçin kalan bakiye kalanları hep karşılar — yani "havuz bitti"
> durumu **matematiksel olarak ulaşılamaz** ve kimse hiçbir şeyi geri
> göndermek zorunda kalmaz.

Ajan maliyetleri yeniden fiyatladı. Merkezde doğruladım: havuz **20**, kırık
玉犬・白'nin kalıcı payı **2**, yani kullanılabilir **18**; sekiz çağrılabilirin
toplamı **2+1+2+6+1+4+2+2 = 20 > 18**. Duvar gerçek, kilit yalnızca birini geri
göndererek açılıyor. Kayıp göstergede görünüyor ve nedeni sayfada yazılı.

Eski veri dosyalarından da beş kanon hatası düzeltildi: `嵌合暗翳庭`ın
romanizasyonu (Kangō An'ei Tei), `調伏の儀`nın okunuşu (chōbuku), Nobara'nın
kronolojisindeki mevsim etiketleri (kış Kara Şimşeği Shibuya'dan sonraya
düşüyordu), uydurulmuş `形見` terimi, ve Nanami'nin adsız bırakılmış iki kişisi
(Yū Haibara, Mahito).

## 10. Kapanmayan iki iş

1. **Üç Bleach sayfasında tırnak içinde diyalog yok** (Uryū, Ulquiorra,
   Yoruichi) — Grup 1 raporunun 9. maddesi. Gerçek replik istenirse kanon
   kaynağa karşı ayrı bir doğrulama turu gerekiyor.
2. **`lib/characters/sukuna-itadori-experience.ts` iki AniList adresine
   hotlink yapıyor** (satır 62 ve 64). Bu sayfa bu görevin kapsamında değil
   ve başka bir turda yazıldı; Faz 2'nin "hotlink yok" kuralı ondan sonra
   geldi. Bu turdaki on sayfada hotlink taraması **sıfır**. Düzeltmek ayrı
   bir iş: iki kareyi indirip `public/assets/anime/karakterler/` altına koymak.
