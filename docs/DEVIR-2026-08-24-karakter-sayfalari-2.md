# 22 Anime Karakter Sayfası Daha + Dizin Sergisi — Devir Notu

**Tarih:** 24 Ağustos 2026 · **Dal:** `main` · **Taban:** `a8bb72f` öncesi
**Bu tur:** 178 dosya, +95 081 satır · **Toplam elle tasarlanmış sayfa: 36 karakter / 37 adres**

İlk turun (23 Ağustos, `docs/DEVIR-2026-08-23-karakter-deneyim-sayfalari.md`)
devamı. Naruto evreninden 22 kişi daha; ayrıca hepsini karakter dizininde
sergileyen bir raf.

---

## 1. Yeni sayfalar

| # | Karakter | AniList | Sayfanın mekaniği | Mod düğmesi |
|---|---|---|---|---|
| 1 | Sai | 1901 | Adım adım açılan mürekkep tomarı, çizilen SVG figürler | Sumi modu |
| 2 | Yamato | 2006 | Yükselen ahşap gövde, beş büyüme kademesi | Mokuton modu |
| 3 | Iruka Umino | 2011 | Kara tahta, tebeşirle yazılan beş ders | Ders bitti |
| 4 | Konohamaru Sarutobi | 3889 | Devir zinciri, son halka boş | Hokage'nin torunu |
| 5 | Chōji Akimichi | 2008 | İki kefeli hap terazisi (güç ↔ bedel) | Kelebek Modu |
| 6 | Ino Yamanaka | 2009 | Dairesel zihin ağı + çiçek dili | Shintenshin |
| 7 | Kiba Inuzuka | 3495 | İki sütun → tek sütuna kilitlenen düzen | Beast Human Clone |
| 8 | Shino Aburame | 3428 | Altıgen kovan ızgarası, komşuya yayılan seçim | Kovan modu |
| 9 | Neji Hyūga | 1694 | 2→64 ardışık vuruş sayacı + kafes mührü | Kafes kırılıyor |
| 10 | Tenten | 3710 | Aşağı açılan silah parşömeni, mühür kareleri | Sōryū Tensakai |
| 11 | Gaara | 1662 | Yandan kesit, üst üste beş kum tabakası | Shukaku |
| 12 | Temari | 2174 | Yay hâlinde açılan yelpaze, üç yıldız | Kamaitachi |
| 13 | Kankurō | 4694 | Yukarıdan inen chakra ipleri, parçalarına ayrılan kuklalar | İpler sende değil |
| 14 | Tsunade Senju | 2767 | Bahis masası, çevrilen kartlar | Sōzō Saisei |
| 15 | Orochimaru | 2455 | Üst üste binen, geriye açılan deri katmanları | Yılan modu |
| 16 | Kabuto Yakushi | 2405 | Çekilen kimlik kartları destesi, son kart boş | Sennin modu — yılan |
| 17 | Obito Uchiha | 3149 | Şeffaflaşan maske, dört isim katmanı | Maske düşüyor |
| 18 | Madara Uchiha | 53901 | Yükselen basamaklar — sayfanın **ölçeği** değişiyor | Sonsuz Tsukuyomi |
| 19 | Nagato | 3180 | Üç soru + yoğunlaşan yağmur | Yağmur |
| 20 | Konan | 3179 | Origami katlama adımları | Melek |
| 21 | Minato Namikaze | 2535 | Hiraishin işaretleriyle **anlık** gezinme | Hiraishin |
| 22 | Kushina Uzumaki | 7302 | Gerilen ve kopan chakra zinciri halkaları | Kızıl Habanero |

Her sayfa kendi bileşen setiyle yazıldı; 36 sayfanın hiçbiri diğeriyle
bileşen paylaşmıyor (küratör modu şartı).

---

## 2. AniList numaraları — üç sürpriz

API 23 Ağustos'ta yeniden açıldı, numaralar doğrudan GraphQL'den doğrulandı.
Ad tek başına güvenilmez olduğu için her aramada medya listesinde
Naruto/Boruto süzgeci uygulandı.

| Karakter | Numara | Not |
|---|---|---|
| Kankurō | 4694 | "Kankurou" yazımıyla bulundu |
| **Obito Uchiha** | 3149 | AniList'teki adı **"Tobi"** — ayrı Obito kaydı yok |
| **Nagato** | 3180 | AniList'teki adı **"Pain"** — ayrı Nagato kaydı yok |

Son ikisi sitedeki mevcut `NARUTO_PEOPLE` eşleşmesiyle zaten uyumluydu.

⚠️ **Bunun bir yan etkisi vardı ve düzeltildi:** paylaşım kartı ve sekme adı
`character.name`den geliyordu, yani "Tobi | KuroNexus" / "Pain | KuroNexus"
yazıyordu — sayfanın kendi başlığıyla çelişiyor ve arama sonucunda yanlış
adla görünüyordu. `experienceMetadata` artık kadro kaydındaki adı tercih
ediyor (`lib/characters/experience-page.tsx`).

---

## 3. Mimari borç kapatıldı: paletler globals.css'ten çıktı

**Ölçüm:** 13 palet `globals.css`'te 16,5 KB ham / **5,4 KB gzip** yer
tutuyordu ve sitenin *her* sayfasında iniyordu. 22 tane daha eklenince
35 palet ≈ 14,5 KB gzip olacaktı — ortak stil dosyası %43 büyüyecekti,
üstelik hiçbir sayfa kendi dışındaki 34 paleti okumuyor.

Rotalar 23 Ağustos'ta sayfa başına ayrıldığı için (`2f0855a`) palet artık
karakterin **kendi CSS modülünde** durabiliyor. Derlenmiş çıktı doğrulandı:
35 dünyanın her biri kendi CSS parçasında; paylaşılan çekirdekte yalnızca
`itachi`, `akatsuki`, `bleach` kaldı (19 KB).

Seçici `.page[data-world=…]` — CSS Modules'ün "pure selector" kuralı çıplak
`:global([data-world])`i derlemede reddediyor. Kök öğe ikisini birlikte
taşıyor, özgüllüğü kategori derisini de geçiyor.

**Doğrulama:** taşınan 14 bloğun 331 token değerinin tamamı taşıma öncesi
tabanla birebir aynı (dosyadan karşılaştırıldı) **ve** çalışan üretim
sunucusunda 14 sayfanın hesaplanmış `--bg`/`--accent`/`--text-*` değerleri
okunup doğrulandı. Itachi'ye dokunulmadı (kullanıcı şartı).

---

## 4. Renk sistemi

22 palet + yardımcı token ailesi kontrast **ölçülerek** seçildi:

- metin ailesi (primary/secondary/muted) `--bg`, `--surface` ve
  `--surface-hover` üzerinde **AA (4.5:1) üstü**
- birincil metin **AAA (7:1) üstü**
- accent zeminde en az **3:1**, accent-hover yüzeyde AA üstü
- yardımcı **düz** renkler de AA üstü (yalnız `--sai-ink` dolgu amaçlı,
  bilerek ölçüm dışı ve dosyada öyle işaretli)

Ayrıca **35 paletin accent'leri** birbirine RGB uzaklığına göre denetlendi;
15'ten yakın yedi çift düzeltildi:

| Çift | Ne yapıldı |
|---|---|
| Sai ~ Jiraiya (5) | Sai'nin accent'i kâğıt kremine çevrildi (35 palet içinde tek beyaza yakın accent) |
| Urahara ~ Kiba (8) | Kiba maroon'a kaydı |
| Rock Lee ~ Iruka (9) | Iruka kehribara kaydı |
| Urahara ~ Madara (11) | Madara soğuk çelik-mora kaydı |
| Kenpachi ~ Kiba (12) | yukarıdaki Kiba değişikliğiyle çözüldü |
| Kankurō ~ Obito (13) | Kankurō daha derin mora kaydı |
| Kakashi ~ Konohamaru (14) | Konohamaru yaprak yeşiline kaydı |

**Kalan bilinen yakınlıklar** (kabul edildi, zeminleri ve yapıları çok
farklı): Urahara ~ Jiraiya (10), Urahara ~ Kenpachi (18), Tenten ~ Kushina
(18). İlk ikisi ilk turdan geliyor, canlı sayfalar kurcalanmadı.

---

## 5. Dizin sergisi (kullanıcı isteği)

Karakter dizini AniList'in **kadro listelerinden** deriliyor ve o listeler
yalnızca başrol/yardımcı kadroyu taşıyor. Iruka, Konohamaru, Minato, Kushina,
Tenten, Temari, Sai, Yamato, Kankurō ve Kabuto **hiçbir listeye girmiyor** —
yani sayfaları yazılsa bile dizinden ulaşılamıyordu, arama da bulmuyordu.

- **`lib/characters/roster.ts`** — 37 adresin kadro kaydı. Ad ve ana dildeki
  ad kodda (dış kaynağa bağlı değil); portre önce kendi veritabanımızdan
  (`CharacterImage` PORTRAIT), yoksa AniList kartından çözülüyor. İki getirici
  de hata durumunda boş dizi döndürüyor, yani kaynak düşse bile raf adlarla
  ayakta kalır.
- **`CuratedShelf`** — dizinin üstünde "Elle Tasarlanmış Dosyalar" rafı.
  Sunucu bileşeni; istemci olan dizine **prop** olarak geçiyor, istemci
  paketine girmiyor.
- Eklenenlerin **rolü boş bırakıldı**: "başrol" AniList'in kadro ölçüsü,
  Kankurō'ya ya da Iruka'ya başrol rozeti takmak yanlış olurdu.

### ⚠️ Aynı gün revize edildi — sayfa ikiye ayrıldı

İlk sürümde raftaki karakterler ızgarada DA görünüyordu (aynı portre sayfada
iki kez) ve hangisinin sayfası olduğunu kartın üstündeki bir işaret
söylüyordu. Kullanıcı geri bildirimiyle üçü birden değişti:

| Önce | Sonra |
|---|---|
| Raf + ızgara iç içe, çift portre | Elle tasarlanmışlar ızgaradan **tamamen düşürüldü** |
| Kartta "kendi sayfası var" işareti | İşaret **kaldırıldı** — ızgarada görünen her kart zaten "sayfası yok" demek |
| Kartlarda "Başrol / Yardımcı" çipi | **Kaldırıldı** (dizinde ve künye sayfasının hero'sunda) |
| Sayaç: Karakter / Başrol / Seri | Sayaç: Karakter / **Elle tasarlanmış** / Seri |

Izgaranın üstüne açıklayıcı bir başlık eklendi (`character.rest.*`):
**"Künye Dosyaları — henüz kendi sayfası yazılmamış karakterler."** Böylece
"kimin sayfası yok" sorusunu ızgaranın kendisi cevaplıyor; işaret gereksiz.

Rol yalnızca **bir** yerde kaldı: künye sayfasındaki "Göründüğü Yapımlar"
listesinde her yapımın kendi satırında ("bu seride rolü neydi"). Orası
kimliğe yapıştırılmış bir etiket değil, o yapıma ait bir veri.

Sonuç: raf **37 dosya**, ızgara **50 kart**, sayaç **87 / 37 / 9**.

---

## 6. Görsel kaynakları ve placeholder'lar

| Kaynak | Nerede | Atıf |
|---|---|---|
| **AniList künye portresi** | Iruka, Konohamaru, Kankurō, Kabuto (kendi yüklememiz yok) | Sayfa altında künye + `anilist.co/character/<id>` bağlantısı |
| **Kendi yüklemelerimiz** (`/uploads/`, PORTRAIT) | Kalan 18 karakter — Naruto kadrosunun 22 Ağustos'ta yüklenen tam boy portreleri | Küratörün kendi görselleri |
| **Elle çizilmiş SVG** | Bütün motifler: mürekkep figürleri, ahşap damarı, tebeşir, meşale, kelebek/hap, zihin ağı, diş/pençe, altıgen petek, trigram/kafes, silah parşömeni, kum tabakaları, yelpaze, kukla ipleri, bahis kartları, deri katmanları, kimlik kartları, spiral maske, kül yağmuru, yağmur/çubuklar, origami, Hiraishin mühürleri, chakra zinciri | Özgün çizim — dış kaynak yok |

**Dış raster görsel kullanılmadı.** Fandom/wiki görselleri bilerek dışarıda:
lisansları doğrulanamıyor ve CSP zaten dış kaynağı engelliyor.

**Placeholder kalan görseller: 417 yeni `ABILITY` yuvası** (ilk turdaki 188
ile birlikte toplam **605**). Sahne, dönem ve teknik görselleri üretilmedi;
her biri için yuva tanımlı, küratör modunda yükleme kutusu görünüyor, görsel
yokken bölüm görselsiz ama ayakta çiziliyor.

Sayfa başına yuva sayısı: Sai 19 · Yamato 21 · Iruka 16 · Konohamaru 20 ·
Chōji 18 · Ino 20 · Kiba 20 · Shino 20 · Neji 16 · Tenten 23 · Gaara 20 ·
Temari 18 · Kankurō 20 · Tsunade 19 · Orochimaru 19 · Kabuto 21 · Obito 17 ·
Madara 19 · Nagato 15 · Konan 20 · Minato 16 · Kushina 20.

---

## 7. Denetim

| Kontrol | Sonuç |
|---|---|
| `npx tsc --noEmit` | ✅ temiz |
| `npx eslint .` | ✅ 0 hata · 1 uyarı (**önceden var olan**: `components/book/BookDetail.tsx`) |
| `npx next build` | ✅ başarılı |
| CSS'te fazladan hex | ✅ **sıfır** — 22 modülün her birinde tam olarak deri bloğunun hex sayısı |
| Tanımsız `styles.X` | ✅ 0 (36 klasör tarandı) |
| 360 px yatay taşma | ✅ 21/21 yeni sayfada 0 px (Madara'da `overflow-x: clip` koruması) |
| Sayfa başına tek `<h1>` | ✅ 37/37 adres |
| `prefers-reduced-motion` + `:focus-visible` | ✅ hepsinde |
| Çalışma zamanı | ✅ 37 adres × 200, hepsi doğru `data-world` ve doğru başlıkla |

### Denetimde yakalanan ve düzeltilen yedi hata

1. **Ino** — `MindWeb`in klavye işleyicisi `HTMLDivElement` tipiyle yazılmıştı
   ama `button`'lara bağlıydı (tsc hatası).
2. **Kiba** — refactor sonrası kalan `HalfStitches` ölü koddu.
3. **Chōji** — `styles.ruleMark` okunuyordu, CSS'te karşılığı yoktu.
4. **Temari** — `TemariGlyphs` iki yerde `SEGMENTS` çağırıyordu; sabitin adı
   `FULL_SEGMENTS` (tsc hatası).
5. **Kankurō** — `styles.kumadoriLine` ve `styles.markRing` tanımsızdı.
6. **Minato** — `styles.railHint` tanımsızdı.
7. **Madara** — (ajanın kendi denetiminde) aynı replik hem kader çizelgesinde
   hem kapanışta basılıyordu; ayrıca ≤560 px'te mod düğmesinin etiketi
   `display: none` ile gizlenip **erişilebilir adını kaybediyordu** (WCAG
   4.1.2) — görsel gizleme desenine çevrildi.

---

## 8. Çalışma yöntemi

22 ayrı git worktree + istenen dal adları (`sai-redesign` …
`kushina-redesign`), iki dalga hâlinde 11'er paralel ajan. *tmux Windows'ta
yok; izolasyon worktree + ayrı dalla sağlandı.*

⚠️ **Her iki dalga da oturum limitine takıldı** (dalga 1: 2,79M token /
31 dk; dalga 2: 2,93M token / 31 dk) ve ajanlar raporlarını döndüremedi —
**ama dosyalar diskteydi.** Worktree'ler tarandı, iş commit'lendi, birleştirildi.
Madara'nın işi de aslında tamamlanmış ve commit edilmişti; `git status`
temiz göründüğü için önce "hiç üretmemiş" sanıldı, ikinci bir ajan denetleyip
iki gerçek hata buldu.

**Ders (bir sonraki tur için):** ajan raporu gelmese bile önce
`git status --short` **ve** `git log` ile worktree'yi tara — iş orada olabilir.

---

## 9. Bir sonraki adım

- [ ] Canlıda 37 adresi aç, mod düğmelerini ve interaktif bölümleri dene
- [ ] Dizinde rafı ve rozetleri kontrol et
- [ ] 605 boş yuvayı küratör modundan doldur (öncelik: 36 hero görseli)
- [ ] `curatedRosterGaps()` şu an yalnızca geliştirmede okunuyor; yeni
      deneyim sayfası açılırken kadro kaydına satır eklenmezse sayfa
      dizinde görünmez — istenirse derleme zamanı kontrolüne bağlanabilir
