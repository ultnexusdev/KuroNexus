# 13 Anime Karakter Deneyim Sayfası — Devir Notu

**Tarih:** 23 Ağustos 2026 · **Dal:** `anime/karakter-deneyimleri` · **Taban:** `81404c6`
**Toplam:** 99 dosya, +51 471 satır · 80 yeni bileşen/veri dosyası

Itachi (14) sayfasının emsali on üç karaktere daha uygulandı. Her sayfa **kendi
bileşen setiyle** yazıldı; şablon paylaşımı yok (küratör modu şartı).

---

## 1. Hangi sayfa nerede

| # | Karakter | AniList | Adres | Dünya derisi | Sayfanın mekaniği | Mod düğmesi |
|---|---|---|---|---|---|---|
| 1 | Naruto Uzumaki | 17 | `/karakterler/17` | `naruto-uzumaki` | Dokuz kuyruk ölçeği — kademe seçildikçe sayfa ısınır | Kurama modu |
| 2 | Sasuke Uchiha | 13 | `/karakterler/13` | `sasuke-uchiha` | İki göz iki yol — dikey yarık, intikam/kefaret | Rinnegan modu |
| 3 | Ichigo Kurosaki | 5 | `/karakterler/5` | `ichigo-kurosaki` | Maskenin çatlağı — beş kademeli "kim konuşuyor?" | Reiatsu modu |
| 4 | Kakashi Hatake | 85 | `/karakterler/85` | `kakashi-hatake` | Kopya kütüğü — beş doğa türü kartoteksi | Kamui modu |
| 5 | Sakura Haruno | 145 | `/karakterler/145` | `sakura-haruno` | Byakugō mührünün dolum ölçeği | Byakugō modu |
| 6 | Kisuke Urahara | 210 | `/karakterler/210` | `kisuke-urahara` | Dükkân — dokuz kapalı çekmece, her biri bir sır | Benihime modu |
| 7 | Shikamaru Nara | 2007 | `/karakterler/2007` | `shikamaru-nara` | Shogi tahtası — beş hamlelik gölge zinciri | Gölge modu |
| 8 | Sōsuke Aizen | 1086 | `/karakterler/1086` | `sousuke-aizen` | Kırılan ayna — "Resmî Kayıt" / "Kırılan Yansıma" katmanları | Yansımayı kır |
| 9 | Jiraiya | 2423 | `/karakterler/2423` | `jiraiya` | El yazması — çevrilen altı sayfalık *Gutsy Ninja* | Sennin modu |
| 10 | Hinata Hyūga | 1555 | `/karakterler/1555` | `hinata-hyuuga` | 360° görüş halkası + Hyūga'nın kör noktası | Byakugan modu |
| 11 | Kenpachi Zaraki | 909 | `/karakterler/909` | `kenpachi-zaraki` | Çentikli kılıç rayı — her çentik bir savaş | Kenpachi modu |
| 12 | Rock Lee | 306 | `/karakterler/306` | `rock-lee` | Sekiz kapı merdiveni — kapı açıldıkça sayfa kızarır | Sekizinci Kapı |
| 13 | Sukuna & Yuuji Itadori | 127212 **+** 133701 | `/karakterler/127212` ve `/karakterler/133701` | `sukuna-itadori` | Yirmi parmak sayacı, iki modlu tek sayfa | Kontrol kimde? |

**Kap sayfasının rotası:** iki AniList numarası da tek bileşene çıkıyor; sayfa
künyedeki numaraya bakıp açılış modunu kendisi seçiyor (127212 → Itadori,
133701 → Sukuna). Doğrulandı: `data-vessel="itadori"` / `data-vessel="sukuna"`.

---

## 2. Tamamlanan bölümler

On üç sayfanın **hepsinde** yedi durak da var:

1. **Hero** — portre + karakterin evrenine ait tipografik/ikonik filigran
   (`うずまき` sarmalı, `努力`, `鏡花水月`, `器`, `更木剣八`…), hepsi elle çizilmiş SVG.
2. **Mod düğmesi** — karaktere özgü adla, tek `useState`, etkinin tamamı CSS'te.
3. **Künye şeridi** — doğum, boy, kan grubu, yaş, rütbe, takım, sembolik obje.
4. **Güç/teknik laboratuvarı** — 3 büyük + 4 küçük kart, gerçek terminolojiyle.
5. **İnteraktif evrim bölümü** — yukarıdaki tabloda "sayfanın mekaniği".
6. **Kader çizelgesi** — 5 adım, yaş etiketli, kilit anlarda orijinal replik.
7. **Kapanış** — iki replik + orijinal dil motto + kaynak künyesi.

Ölçülen yapısal veriler:

| Karakter | CSS | Veri dosyası | Sınıf | `<h2>` | Küratör yuvası |
|---|---|---|---|---|---|
| Naruto | 55,6 KB | 40,3 KB | 99 | 8 | 12 |
| Sasuke | 48,6 KB | 32,6 KB | 103 | 8 | 13 |
| Ichigo | 54,6 KB | 34,3 KB | 122 | 9 | 15 |
| Kakashi | 43,6 KB | 35,7 KB | 110 | 8 | 13 |
| Sakura | 47,6 KB | 36,1 KB | 145 | 9 | 14 |
| Urahara | 49,7 KB | 33,6 KB | 112 | 9 | 13 |
| Shikamaru | 42,7 KB | 33,7 KB | 99 | 10 | 19 |
| Aizen | 44,4 KB | 43,5 KB | 129 | 9 | 15 |
| Jiraiya | 46,5 KB | 33,1 KB | 109 | 8 | 14 |
| Hinata | 43,3 KB | 36,3 KB | 97 | 8 | 14 |
| Kenpachi | 51,8 KB | 39,4 KB | 139 | 10 | 7 |
| Rock Lee | 51,8 KB | 37,1 KB | 131 | 8 | 14 |
| Sukuna/Itadori | 51,0 KB | 45,9 KB | 133 | 11 | 25 |

Karşılaştırma: Itachi'nin CSS modülü 46 KB.

---

## 3. Görsel kaynakları ve atıflar

### 3.1 AniList API kapalıydı — nereden alındı

Görev "AniList GraphQL'den çek" diyordu; **22–23 Ağustos 2026'da AniList API'si
kapalıydı**:

```
{"errors":[{"message":"The AniList API has been temporarily disabled
 due to severe stability issues.","status":403}]}
```

Künyeler bunun yerine **kendi backend'imizin 30 günlük önbelleğinden** alındı
(`https://api.kuronexus.com/anime/characters/<id>`) — on dört karakterin hepsi
önbellekte, portre adresleriyle birlikte. Veri seti oturum sırasında
`anilist-detay.json` olarak dondurulup ajanlara verildi.

**Canlıda kesinti sorun değil:** `anilist.service.ts` hata durumunda bayat
önbelleği sunuyor (`getCharacter`, catch dalı). Sayfalar API kapalıyken de açılır.

⚠️ `getCharacterCards` ucunun stale-fallback'i **yok** ve önbellek anahtarı
istenen kimlik kümesinin tamamından türetiliyor; yeni bir küme kaynak kapalıyken
boş dönüyor. Bu yüzden deneyim sayfalarının yoldaş portreleri o uçtan değil
kendi `CharacterImage` kaydımızdan okunuyor.

### 3.2 Kullanılan görseller ve atıfları

| Kaynak | Nerede | Atıf |
|---|---|---|
| **AniList künye portresi** (`s4.anilist.co`) | 13 sayfanın hepsinde hero portresi (yüklenmiş portre yoksa) | Sayfa altında künye satırı + `anilist.co/character/<id>` bağlantısı. Her sayfada doğrulandı. |
| **Kendi yüklemelerimiz** (`/uploads/…`, `CharacterImage` PORTRAIT) | Naruto kadrosu (Naruto, Sasuke, Sakura, Kakashi, Jiraiya, Hinata, Shikamaru, Rock Lee) + Kenpachi | Küratörün kendi yüklediği görseller (22 Ağustos turu) |
| **Elle çizilmiş SVG** | Bütün motifler: Uzumaki sarmalı, Uchiha yelpazesi, Hollow maskesi, Kamui girdabı, Byakugō mührü, dükkân şeridi, gölge bağı, kırık ayna + gözlük, kurbağa/dağ, Byakugan damarları, çentikli kılıç + göz bandı, bandajlı yumruk, Sukuna'nın yüz işaretleri | Özgün çizim — dış kaynak yok |

**Dış raster görsel kullanılmadı.** Fandom/wiki görselleri bilerek dışarıda
bırakıldı: lisansları doğrulanamıyor ve CSP zaten dış kaynağı engelliyor
(bkz. `commons-gorsel-kaynagi` notu — hotlink imkânsız, indirip depoya koymak
gerekir). Itachi sayfasındaki Wikimedia kaynaklı Mangekyō deseni (CC BY-SA 3.0)
**kopyalanmadı**; her sayfa kendi geometrisini çizdi.

### 3.3 Placeholder kalan görseller — elle yüklenecek

Sahne, dönem ve teknik görselleri **üretilmedi**. Her biri için bir `ABILITY`
yuvası tanımlı; küratör modunda yükleme kutusu görünüyor, görsel yokken bölüm
**görselsiz ama ayakta** çiziliyor. Toplam **188 boş yuva**:

- `naruto-uzumaki:*` (12) — hero, dokuz kuyruk kademesi, jutsu kartları
- `sasuke:*` (13) — hero, chidori/amaterasu/rinnegan, beş dönem, dört küçük teknik
- `ichigo:*` (15) — hero, maske, beş kademe, zanpakutō/bankai, beş dönem
- `kakashi:*` (13) — hero, kamui, chidori, ninken, beş dönem, dört teknik
- `sakura:*` (14) — hero, mühür, byakugō, beş dönem, dört teknik
- `urahara:*` (13) — dükkân, benihime, bankai, hōgyoku, beş dönem
- `shikamaru:*` (19) — hero, beş hamle, üç gölge tekniği, beş dönem, dört çip
- `aizen:*` (15) — iki katmanlı hero, ayna sahnesi, kyōka suigetsu, beş dönem
- `jiraiya:*` (14) — kapak, altı el yazması sayfası, jutsu kartları
- `hinata:*` (14) — hero, kör nokta, byakugan menzili, beş dönem, teknikler
- `kenpachi:*` (7) — hero bandı, beş çentik, ham reiatsu *(portre, dört galeri
  ve Bankai/Shikai görselleri zaten yüklü — ezilmedi)*
- `rocklee:*` (14) — şafak, sekizinci kapı, iki renge, beş dönem, dört çip
- `vessel:*` (25) — iki portre, parmak, kesiş/yarma/tapınak, yedi çevre portresi,
  beş kader adımı

Yükleme yolu: sayfada **küratör modunu aç** → ilgili yuvanın kutusuna görseli
bırak. Yüklenen görsel anında görünür (`no-store`).

---

## 4. Derleme ve lint

| Kontrol | Sonuç |
|---|---|
| `npx tsc --noEmit` | ✅ temiz |
| `npx eslint .` | ✅ 0 hata · 1 uyarı (**önceden var olan**: `components/book/BookDetail.tsx` kullanılmayan `ArchiveBook` importu) |
| `npx next build` | ✅ başarılı |
| CSS'te hex | ✅ **13 sayfanın hiçbirinde tek hex yok** (rule 16) |
| Tanımsız `styles.X` | ✅ 0 (1519 referansın hepsi karşılandı) |
| 360 px yatay taşma | ✅ 15 sayfada da 0 px |
| Sayfa başına tek `<h1>` | ✅ 15/15 |
| `prefers-reduced-motion` | ✅ her sayfada battaniye + kapılı animasyonlar |
| `:focus-visible` | ✅ her sayfada 3–8 kural |
| JSX'te sabit Türkçe metin | ✅ 0 (hepsi `LocalizedText` + `pick()`) |
| TR/EN çalışma | ✅ 14 adres × 2 dil = 28 sayfa, hepsi 200 |

Çalışma yöntemi: 13 ayrı git worktree + istenen dal adları
(`naruto-redesign` … `sukuna-itadori-redesign`), her biri paralel bir ajanla.
*tmux Windows'ta yok; izolasyon worktree + ayrı dalla sağlandı.*

---

## 5. Yol boyunca düzeltilen iki şey

### 5.1 Stil dosyası patlaması (ölçüldü, düzeltildi)

On dört sayfa ilk kurulumda tek bir `[characterId]` rotasının altında bir
haritayla dağıtılıyordu. Üretim derlemesi `next start` ile sunulup HTML'deki
`<link>` etiketleri sayıldı:

```
canlı sürüm (yalnız Itachi sayfası)   ->  7 stil dosyası
on dört sayfa tek rotada              -> 19 stil dosyası / 718 KB
düzeltmeden sonra                     ->  7 stil dosyası / ~240 KB
```

App Router bir rotanın stillerini **modül grafiğinden** topluyor: Sasuke'yi açan
ziyaretçi Kenpachi'nin, Aizen'in ve diğer on birinin stilini de indiriyordu —
dahası, elle tasarlanmış sayfası **olmayan** 180+ karakterin künye sayfası da
aynı yükü taşıyordu.

`import()` ile dinamik yükleme **çözmedi** (sayı 19'da kaldı). Çözüm Next'in
kendi kuralı oldu: *statik parça dinamik parçadan önce eşleşir.* Her deneyim
karakteri kendi numarasıyla bir klasör aldı (`karakterler/17/`), yalnızca kendi
bileşenini import ediyor. **Adresler değişmedi.**

Yan kazanç — rota JS'i: `[characterId]` 54,2 kB → **6,1 kB**; deneyim sayfaları
4,9–9,2 kB.

### 5.2 Kenpachi'de tanımsız sınıf

`KenpachiShell` `styles.modeLabel` okuyordu, CSS'te karşılığı yoktu
(`className={undefined}`). Denetim betiği yakaladı; sabit hap iki satıra çıkıp
içeriğin üstüne biniyordu.

---

## 6. Merkezî değişiklikler (ajanların dokunmadığı)

- `lib/characters/experiences.ts` — numara kaydı, ortak prop imzası, yoldaş
  portresi listeleri, görsel çözümleyicileri
- `lib/characters/experience-page.tsx` — deneyim rotalarının ortak sunucu işi
- `app/…/karakterler/<id>/page.tsx` × 15 — statik rota parçaları
- `app/…/karakterler/[characterId]/page.tsx` — yeniden **yalnız** künye dossier'i
- `styles/globals.css` — 13 `[data-world]` derisi + yardımcı token aileleri
  (bütün renkler kontrast ölçülerek seçildi: metin ailesi bg/surface/surface-hover
  üzerinde AA üstü, birincil metin AAA üstü, accent zeminde ≥3:1)
- `app/sitemap.ts` — 14 deneyim adresi sitemap'e girdi

**Itachi'nin dosyalarına dokunulmadı.** Rota onu ayrı bir dalda karşılıyor,
çünkü bileşeni `companions` almayan eski imzayı taşıyor.

---

## 7. Bir sonraki adım

- [ ] Dalı `main`'e al ve deploy et *(⚠️ tek push iki servisi de tetikler;
      `deploy-iki-build-rami-bitiriyor` notundaki kök sebep 15 Ağustos'ta
      kapatıldı, yine de deploy sonrası siteyi kontrol et)*
- [ ] Canlıda 14 adresi aç, mod düğmelerini ve interaktif bölümleri dene
- [ ] 188 boş yuvayı küratör modundan doldur (öncelik: 13 hero görseli)
- [ ] Karakter dizininde "elle tasarlanmış sayfa" rozeti — `curatedCharacterIds()`
      hâlâ tüketilmiyor, `EXPERIENCE_IDS` ile birleştirilebilir *(öneri)*
