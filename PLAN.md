# PLAN — Anime Salonu + Akatsuki Sinematik Yeniden Tasarım

> Komut: `anime-salonu-akatsuki-komutu-v5.md` (16 Ağustos 2026). Otonom mod.
> Bu dosya komutun 0. bölümünün çıktısı; "Kararlar" ve "Görsel Kaynakları"
> bölümleri uygulama sırasında güncellenir. Final rapor en sona eklenir.

---

## 1 · İNCELEME ÖZETİ (ölçüldü, tahmin değil)

- **`/anime` adresi bugün YOK.** Ziyaretçi `/dark-stories/category/anime`
  kullanıyor; lobi `category/[categorySlug]/page.tsx`teki `slug === "anime"`
  dalından `AnimeLobby` olarak çiziliyor. Adres mekanizması
  `lib/halls.ts:hallHref()` — `MOVED_HALLS`'a girmeyen salon
  `/dark-stories/category/<slug>`a düşüyor. Spor 8 Ağustos'ta bu haritayla
  `/spor`a taşındı; şablon `next.config.ts` redirects() içinde duruyor.
- **Nexus Graph şeması YOK.** `Character`, `Person`, `Group`, `Membership`,
  `Relationship` Prisma modeli yok. Karakterler AniList'ten `ExternalCache`
  üzerinden geliyor; veritabanındaki tek karakter tablosu `CharacterImage`
  (characterId = AniList numarası, slot: PORTRAIT/GALLERY/ABILITY+abilityName)
  ve `HiddenCharacter`. `WikiEntryRelation` şemada var ama hiçbir servis
  okumuyor/yazmıyor (ölü).
- **Yazılı karakter içeriği bilinçli olarak KODDA** (kullanıcı kararı,
  6 Ağustos 2026): `lib/characters/zaraki-kenpachi.ts` emsali — iki dilli
  metin kodda, görseller DB'de. "Yeni karakter = yeni veri dosyası +
  index.ts'e bir satır."
- **Medya hattı hazır:** `POST /admin/uploads(/from-url)` (SSRF savunmalı
  `RemoteImageService`), dosyalar `/uploads/<ts>-<hex>.<ext>` (düz ad,
  365 gün immutable cache), `POST /admin/character-images` ile karaktere
  bağlanıyor. `CreateCharacterImageDto` URL regex'i alt dizin KABUL ETMİYOR.
- **Kurulum işleri admin ucundan** (`prisma db seed` konteynerde ESM yüzünden
  çalışmıyor) — emsal: `POST /admin/music/genres/seed-taxonomy`.
- **Anime derisi "Faz A"da kalmış:** `[data-category="anime"]` mürekkep moru
  taban paleti var, tam görsel kimlik ("Faz D") hiç yapılmamış — bu komutun
  doldurduğu boşluk tam olarak o. Kapı turuncu sızdırıyor
  (`--door-anime-a #f0731e`), deri mor — çelişki bilinçli çözülecek.
- **Spor kalite dili:** gölge yok, yuvarlak köşe yok, ikon yok, glow yasak
  (kural 16); hareket `animation-timeline: view()` ile JS'siz;
  `prefers-reduced-motion` çift taraflı; hover'da tek jest; boş oda yasağı;
  görselde iki katman (maske dışta, ölçek içte) deseni.

## 2 · KARARLAR

| # | Karar | Gerekçe |
| --- | --- | --- |
| K1 | **Anime `/anime`e terfi ediyor** — `MOVED_HALLS`'a `anime: "/anime"`, yeni ağaç `app/[locale]/anime/` (lobi + akatsuki), eski lobi adresine 301 (TR + /en, joker YOK). Derin odalar (`arsiv`, `karakterler`, `[slug]`) YERİNDE kalıyor — spor Faz 1 deseni (tek yönlü köprü). | Komut `/anime/akatsuki` istiyor; `hallHref` tam bu iş için kurulmuş; kapı duvarı/footer/Nexus kendiliğinden güncelleniyor. Derin odaları taşımak bu turun kapsamı değil (kural 8). |
| K2 | **Şema değişikliği YOK, migration YOK.** Akatsuki yapısı `frontend/lib/anime/akatsuki.ts` (AniList kimlikleri, partnerler, yüzükler, Path listesi, ilişki ağı, kronoloji İSKELETİ); bütün görünür metin `messages/tr.json + en.json` `akatsuki` namespace'inde. | Ev deseni: yazılı içerik kodda (Zaraki emsali, kullanıcı kararı), metin i18n'de (kural 1). Tek sergi için graph şeması kurmak duplikasyon/aşırı mühendislik olurdu. |
| K3 | **Görseller `CharacterImage` üzerinden** (mevcut şema alanı): üye portreleri = PORTRAIT, Six Paths = Pain'e ABILITY (`abilityName: "path:deva"` vb.), hero/atmosfer = Pain'e GALLERY (caption ile işaretli). Frontend görseli DB'den okur; yoksa AniList portresine, o da yoksa dokulu yuvaya düşer (zarif fallback). | Komut §1: hotlink yok, kod içinde URL yok, veri katmanından değiştirilebilir. Küratör mevcut dossier arayüzüyle görseli değiştirebilir. |
| K4 | **İki küçük backend ucu** (anime modülüne, migration'sız): `GET /anime/characters/images?ids=…` (herkese açık; verilen kimliklerin CharacterImage kayıtları, tek istek) ve `POST /admin/anime/akatsuki/setup` (idempotent kurulum: manifest'teki kaynak URL'lerden `RemoteImageService` ile indir → `/uploads` → `CharacterImage`; var olan slotu ATLAR, küratörün elle yüklediğini ezmez). | Sergi sayfası tek istekle çizilmeli; kurulum admin ucundan (seed konteynerde kırık). Rota sırası: `characters/images` `characters/:characterId`den ÖNCE. |
| K5 | **Sergi derisi token'la:** `globals.css`e `[data-world="akatsuki"]` bloğu (siyah/koyu kırmızı: --accent kıymık kırmızısı, --aka-* yardımcıları). Bileşende hex yok (kural 16), glow yok — ışık yıkamaları radial-gradient. | Müzik `[data-genre]` emsali. Anime salon derisi (mor) bozulmadan sergiye kendi atmosferi veriliyor. |
| K6 | **Kapı çelişkisi çözümü:** anime kapısının turuncu sızıntısı KORUNUYOR (`--door-anime-a` dokunulmuyor) — kapı ayrı bir vaat, salon içi kimlik mor kalıyor; Akatsuki dünyası kendi kırmızısını taşıyor. Üç katman üç ayrı dünya. | Kapı rengini değiştirmek ana sayfanın dengesini bozar; bu turun işi salon içi. |
| K7 | **Naruto Evreni / One Piece kartları** arşivdeki seriye bağlanır (başlık eşleşmesi; `entries` içinde yoksa kart bağlantısız/metinli çizilir, sayfa kırılmaz). Anime Arşivi kartı arsiv odasına gider. | Boş oda yasağı; olmayan sayfa uydurulmaz. |
| K8 | **Hareket dili:** kaydırma reveal'ları CSS `animation-timeline: view()` (JS yok, @supports arkasında); mikro-animasyonlar (Rinnegan nabzı, Sharingan tomoe, Konan kağıtları, bulut sisi) saf CSS/SVG; `prefers-reduced-motion`'da tamamen kapalı. Video/GIF YOK (komut §5 önceliği). | Spor emsali; CSP dev kısıtından etkilenmez; performans ucuz. |
| K9 | **Ambans ses eklenmiyor.** `GlobalAmbientPlayer` yalnızca `/dark-stories/<evren>` desenini tanıyor; mekanizmayı genişletmek ayrı karar. | Komut §6 "düşünülebilir" diyor; kural 8 kapsam disiplini. |
| K10 | **Push sırası:** önce backend commit'i push → Coolify yeşil → frontend push (deploy alışkanlığı). Kurulum ucunu canlıda admin tetikler (tek tık/istek; adımı STATE.md'ye yazıyorum). | Watch Paths + 2 çekirdek/3.7GB gerçeği; frontend yeni ucu çağırmadan önce uç canlıda olmalı. |
| K11 | Eski `AnimeLobby` bileşeni ve kategori dalı bu turda SİLİNMİYOR; yeni sayfa canlıda doğrulanınca ayrı bir temizlik turunda kaldırılacak (spor emsali: önce kur → canlıda doğrula → sonra temizle). | Kesinti riskini sıfırlamak. |

## 3 · UYGULAMA SIRASI (commit başına)

1. ✅ PLAN.md (bu dosya)
2. **Backend:** `GET /anime/characters/images` + `POST /admin/anime/akatsuki/setup` + manifest — `anime: karakter gorsel ucu ve akatsuki kurulum ucu`
3. **Veri katmanı:** `lib/anime/routes.ts` (animeHref, tek adres kaynağı), `lib/anime/akatsuki.ts`, `lib/api/characters.ts`e getirici, i18n anahtarları — `anime: akatsuki veri katmani ve adres kaynagi`
4. **Salon girişi:** `app/[locale]/anime/` (layout + page + error + loading), ANİME DÜNYALARI kartları, `MOVED_HALLS`, 301'ler, sitemap — `anime: salon kendi agacina tasindi, sinematik giris`
5. **Akatsuki sayfası:** `app/[locale]/anime/akatsuki/` + `components/anime/akatsuki/*` + `[data-world="akatsuki"]` token bloğu — `anime: akatsuki dijital sergisi`
6. **Mikro-animasyon:** göz/kağıt/sis katmanı — `anime: akatsuki mikro animasyon katmani`
7. **Responsive + performans** — `anime: akatsuki responsive ve performans`
8. Test: `npm run build` (frontend), `nest build` (backend), `npx eslint <yollar>`, yerel üretim derlemesiyle (3100) hızlı doğrulama + kurulum ucunu yerelde koşturma
9. Push (önce backend, sonra frontend) + canlı doğrulama + STATE.md + final rapor

## 4 · GÖRSEL KAYNAKLARI

Hepsi Naruto Wiki (naruto.fandom.com), dosya adresleri MediaWiki API'sinden
doğrulandı (16 Ağustos 2026). Kurulum manifesti:
`backend/src/anime/akatsuki-setup.service.ts`. `POST /admin/anime/akatsuki/setup`
bunları indirip `/uploads`a koyar ve `CharacterImage` kaydı açar (idempotent).

| Karakter (AniList) | Yuva | Dosya (static.wikia.nocookie.net/naruto/images/…) | Boyut |
| --- | --- | --- | --- |
| Pain (3180) | PORTRAIT | e/e3/Deva_Path.png | 1440×1080 |
| Pain (3180) | ABILITY akatsuki:sky | 2/27/Pain_at_Konoha.png | 1920×1080 |
| Pain (3180) | ABILITY akatsuki:six | 3/3a/Six_Paths_Pain.png | 1920×1080 |
| Pain (3180) | ABILITY akatsuki:origins | d/d1/Akatsuki_original.png | 1920×1080 |
| Pain (3180) | ABILITY akatsuki:nagato | 4/46/Nagato.png | 1376×872 |
| Pain (3180) | ABILITY path:deva | 3/33/Yahiko_Turned_Deva.png | 1915×1076 |
| Pain (3180) | ABILITY path:asura | c/c5/Asura_Path.png | 1440×1080 |
| Pain (3180) | ABILITY path:human | 7/7e/Ningendo.png | 1912×1080 |
| Pain (3180) | ABILITY path:animal | c/cd/Animal_Path.png | 1440×1080 |
| Pain (3180) | ABILITY path:preta | 2/20/Preta_Path.png | 1440×1080 |
| Pain (3180) | ABILITY path:naraka | 8/81/Naraka_Path.png | 1440×1080 |
| Itachi (14) | PORTRAIT | b/bb/Itachi.png | 1440×1080 |
| Kisame (2672) | PORTRAIT | f/f7/Kisame_Hoshigaki_full.png | 759×1541 |
| Deidara (1902) | PORTRAIT | 0/06/Deidara.png | 1440×1080 |
| Sasori (1900) | PORTRAIT | f/f7/Sasori.png | 1460×1197 |
| Kakuzu (3178) | PORTRAIT | 5/57/Kakuzu.png | 1440×1080 |
| Hidan (2792) | PORTRAIT | e/e3/Hidan.png | 1440×1080 |
| Konan (3179) | PORTRAIT | 5/58/Konan_Infobox.png | 1440×1080 |
| Tobi (3149) | PORTRAIT | 7/72/Tobi.png | 1440×1076 |
| Tobi (3149) | ABILITY akatsuki:obito | 4/4a/Obito_Uchiha.png | 1440×1080 |
| Zetsu (3150) | PORTRAIT | b/b6/Black_and_White_Zetsu.png | 1920×1080 |
| Madara (53901) | PORTRAIT | f/fd/Madara.png | 1440×1080 |
| Yahiko (23050) | PORTRAIT | 7/76/Yahiko.png | 1440×1076 |

Not: AniList kimlik eşlemesi — Nagato AniList'te ayrı kayıt değil, "Pain"
(3180) içinde; Obito da "Tobi" (3149) içinde. Madara ve Yahiko sergide
"önemli ilişkiler" bölümü için var.

## 5 · FİNAL RAPOR (16 Ağustos 2026, gün sonu)

### Ne yapıldı

Yedi commit: `15bbbc4` (backend uçları) → `da9fa09` (veri katmanı + i18n) →
`e105517` (salon girişi + terfi) → `b3f415c` (sergi) → `b68e8e9`
(mikro-animasyon) → `34640c7` (performans + özel ad düzeltmeleri) + kapanış.

- **Backend:** `GET /anime/characters/images?ids=` (herkese açık, tek istek)
  ve `POST /admin/anime/akatsuki/setup` (idempotent görsel kurulumu, 23
  görsel, SSRF savunmalı). Migration YOK.
- **`/anime`:** kanat kabuğu (deri tek yerde, Bebas display sesi) + üç
  hareketli sinematik giriş + ANİME DÜNYALARI (Akatsuki öne çıkan kart:
  kendi derisi, bulut SVG, Pain silüeti, fırça kanjisi). `MOVED_HALLS` +
  301 (yalnız lobi) + sitemap.
- **`/anime/akatsuki`:** hero (Pain — sayfanın açık ara en büyük öğesi) →
  hakkında → Six Paths → 9 üye → 4 ikili → zaman şeridi → ilişkiler →
  sembolizm → miras. Bütün metin TR+EN i18n'de; görseller DB'den, üç
  kademeli fallback (kendi disk → AniList → dokulu yuva).
- **Mikro-animasyon:** yağmur (iki hız), Ken Burns, Rinnegan nabzı, bulut
  süzülmesi — hepsi CSS, `prefers-reduced-motion`'da tamamen kapalı.

### Ölçülen doğrulama (yerel üretim derlemesi, 3100 + yerel PG)

Kurulum ucu **23/23 indirdi, 0 hata** (8.8 sn; wikia içerik pazarlığıyla
WebP verdi). Sergi 33 görsel, 0 kırık, hepsi `/_next/image` basamaklı.
TR+EN içerik tam; `/dark-stories/category/anime` → 301 → `/anime`; arşiv
ve karakter odaları dokunulmamış (200); ana sayfa kapısı `/anime`e bakıyor.

### Seçilen varsayımlar

K1-K11 (yukarıda) + şunlar: Nagato AniList'te "Pain" (3180), Obito "Tobi"
(3149) içinde; Zetsu portresi birleşik kare; Konan kağıdı ve Sharingan
tomoe animasyonları BİLEREK atlandı (ucuz görünme riski, komut §5.3 izni);
ambans ses eklenmedi (K9).

### ⏭ CANLIDA TEK MANUEL ADIM

**`/anime/akatsuki` → en altta "Küratör — Görsel Kurulumu" → "Görselleri
kur".** Admin girişiyle tek tık; 23 görseli sunucuya indirir. Basılana dek
sergi AniList küçük portreleriyle (fallback) çizilir — kırılmaz.

### Kalan TODO'lar (ayrı tur)

1. Eski ağaçtaki ~12 dosyada elle yazılmış `/dark-stories/category/anime/...`
   adreslerini `animeHref`e süpürmek.
2. `AnimeLobby` + kategori dalı ölü kod temizliği (canlı doğrulamadan sonra
   — spor emsali).
3. Derin odaların (arşiv/karakterler) `/anime` altına tam göçü (istenirse).
4. Kapı turuncu/deri mor çelişkisi bilinçli korundu (K6) — kullanıcı isterse
   kapı Akatsuki kızılına çekilebilir.

## 5b · V2 GÜNCELLEMESİ (16 Ağustos akşamı — 4K/glow/müzik + beş kullanıcı fikri)

Komut: `anime-salonu-4k-parlaklik-glow-muzik-komutu-v2.md`. Commit'ler:
`fea3be9` (manifest +3), `6b7303c` (müzik, ayrı commit — v2 §6), `30bdcf5`
(görsel+etkileşim katmanı).

- **4K:** kaynak wiki taranarak ölçüldü — gerçek 4K yalnızca sahne
  karelerinde var. Üç yenisi eklendi (salt ekleme, kurulum idempotent):
  kadro 3840×2151 (üyeler bandı), ikililer 3424×1572 (partnerler bandı,
  Konan'ın kağıt kanatları), yağmurda Nagato 2560×1440 (miras kapanışı).
  Portreler kaynağın tam çözünürlüğü (1440-1540) — daha büyüğü yok;
  `next/image` responsive basamaklar korunuyor.
- **Parlaklık/glow:** kural 16'nın glow yasağına **salon-lokal istisna**
  (kullanıcı kararı, komutta açık). Token'lar `globals.css`te
  (`--aka-glow-soft/strong`, `--aka-ember*`), kapsam anime kanadı dışına
  taşınamaz. Filtre parlaklıkları yükseltildi, kırmızı+altın ışık
  kaynakları ve kor tanecikleri eklendi; hedef ışıklı sinema, neon değil.
- **Hero sanat yönü** (kullanıcının görsel referansı): kızıl serif
  AKATSUKI + 暁・あかつき fırça satırı; PAIN metin olarak ikincil ama
  figür sayfanın en büyük görseli — v1 hiyerarşi kuralı bozulmadı.
- **Beş kullanıcı fikri:** ① Nexus düğümü (Jiraiya 2423 + Naruto 17
  dosya kartları + üç kapı), ② portal geçişi (bulut ekranı yutar; orta
  tık/ctrl/reduced-motion doğrudan gider), ③ imza sözler (9 üye, TR+EN),
  ④ 4 eksenli güç profili (küratör tahmini rozetli, view() ile dolan
  çubuklar), ⑤ scroll() zaman çizelgeli ilerleme çubuğu (JS'siz).
- **Müzik (ayrı commit):** kullanıcının sağladığı parça
  `public/audio/akatsuki-theme.mp3`; autoplay reddi ilk etkileşimde tek
  sefer yeniden denenir, durum gerçek oynatma olaylarından okunur; sabit
  44px toggle (aria-pressed); rota değişiminde unmount sesi keser;
  `kuronexus:music-started` sözleşmesiyle Spotify şeridi/ambiyansla tek
  çalar barışı. Yalnızca `/anime/akatsuki`ta.

⏭ Canlıda: admin **"Görselleri kur"a bir kez daha basar** → yalnızca 3
yeni bant iner (yerelde ölçüldü: +3 / 23 atlandı / 0 hata).

## 5c · V3 DÜZELTME + YARATICI ZENGİNLEŞTİRME (16 Ağustos gece)

Komut: `anime-salonu-duzeltme-komutu-v3.md` + iki stil referansı görsel
(taş kabartma "Hakkında" paneli, zigzag dönem kartları). Kullanıcı notu:
karakter görselleri birebir indirilmek zorunda değil — kendim
oluşturabilirim (SVG/CSS üretimi serbest).

### A kusurları — düzeltildi + nasıl

- **A1 ✓** Hero ortası: afişler merkeze genişletildi (45%, feather 97%),
  merkeze ışık havuzu (kızıl sis + mor mürekkep) + %5 opaklıkta asanoha
  deseni (üretilmiş SVG). Düz siyah dikdörtgen kalmadı. (`e3b8b61`)
- **A2 ✓** Başlıklarda text-glow; bölüm sınırları ortadan parlayan gradyan
  çizgi + üstten ışık yıkaması; anime accent/gold ve Akatsuki kızılları
  canlandırıldı (globals'ta gerekçeli salon-lokal istisna). (`eb77c0b`)
- **A3 ✓** Kartlarda hover: scale 1.03 + yoğunlaşan glow + nth-child süre/
  gecikme varyasyonları; KEŞFET/dosya CTA'ları 0.4rem kayıyor; dokunmatikte
  :active karşılıkları. (`eb77c0b`)
- **A4 ✓** Bindirmeli iki bulut katmanı kaldırıldı; bulut metin bloğunun
  rozeti oldu (tam görünür); siluet üstten başlıyor, görsel-metin geçişi
  alt zemin gradyanı. (`f66d492`)
- **A5 ✓** Çözünürlük denetimi (aşağıda). Kaynak wiki'de karakter
  PORTRELERİ 1920'yi geçmiyor — ekran görüntülerinde "düşük çözünürlük"
  hissinin ana sebebi AniList yedeklerinin (≈230px) kurulum düğmesine
  basılana dek görünmesiydi; kurulumdan sonra 1440-1540px kaynaklar +
  next/image basamakları devrede. ≥1920 gereken hero/büyük bantların
  hepsi ≥1920 kaynaktan:

| Yuva | Kaynak çözünürlük | ≥1920 şartı |
| --- | --- | --- |
| Hero gök (sky) | 1920×1080 | ✓ |
| Six Paths bandı | 1920×1080 | ✓ |
| Kadro bandı (legion) | 3840×2151 | ✓ |
| İkililer bandı (horror) | 3424×1572 | ✓ |
| Miras bandı (dawn) | 2560×1440 | ✓ |
| Kuruluş (origins) | 1920×1080 | ✓ |
| Üye portreleri | 1440-1540 genişlik | kart ≤440px çizim — yeterli; daha iyisi A6 kürasyonundan |
| Path kartları | 1440-1920 | ✓ (kart ~480px) |

  Manuel değiştirilmesi mantıklı olanlar (istenirse, A6 ile): üye
  portrelerinin resmi sanat/afiş versiyonları.

### A6 · Kürasyon modu ✓

Dossier'in `CuratorFrame`/`CuratorSlot` altyapısı sergiye taşındı: admin
anahtarı açınca 29 görsel yuvasının altında "Görseli Değiştir" (URL +
dosya) beliriyor; yükleme mevcut medya hattından geçiyor (`/admin/uploads`
→ `CharacterImage`), çözümleyici SON-KAZANIR olduğu için değişiklik
deploy'suz anında yansıyor. Yuva kimliği `characterId+slot+abilityName`
(örn. `3180/ABILITY/akatsuki:sky` = hero gökyüzü). ⚠️ İlk sürümde yuvalar
ziyaretçiye sızıyordu — yerel sonda yakaladı, kapı eklendi ve GERÇEK admin
girişiyle ölçüldü: ziyaretçi 0 yuva, admin 29 yuva.

### B1 ✓ / B2 ✓ / B3 ✓

- **B1** Hakkında sağ paneli: kadro görseli (legion) sola feather maskeyle
  sönümleniyor + kızıl ışık yıkaması + arka planda %5 bulut filigranı;
  mobilde metnin altına iniyor.
- **B2** Zigzag şerit: beş dönem merkez ekseninin iki yanında; merkez
  çizgi kaydırmayla doluyor (`view()`, JS'siz; desteksiz/reduced'ta dolu
  durur); dönem başına malzeme: soğuk taş / amber / Rinnegan halkaları /
  çatlamış ateş / soluk şafak (token + fraktal gürültü overlay); kartlarda
  bindirmeli dairesel avatarlar + 2-3 glif; kendi tarafından kayarak giriş;
  hover'da doku parlar, avatarlar büyür; mobilde eksen solda tek sütun.
- **B3** Üretim hattı YOK (ölçüldü: repoda Flux/fal/Replicate entegrasyonu
  bulunamadı) → komutun 2. önceliği: 8 özgün çizgi-stil SVG glif + CSS
  malzeme dokuları + mevcut portrelerden dairesel avatar kırpımları.
  Referans görseller (kullanıcının chibi/kabartma mockup'ları) diske
  kaydedilmemişti — stil hedefi olarak kullanıldı; istenirse kürasyon
  modundan (A6) gerçek dosyaları herhangi bir yuvaya yüklenebilir.

### C · Doğrulama listesi (nasıl doğrulandı)

- [x] Hero'da boş siyah alan yok — ışık havuzu + asanoha + genişletilmiş
  afişler; yerel üretim HTML'inde `openingPool` ölçüldü
- [x] Bölüm başlıklarında glow — `mastTitle`/`sectionTitle`/`roomTitle`
  text-shadow (CSS'te; snapshot'ta görünür)
- [x] Kart kenarlarında glow — Akatsuki kartı sürekli, diğerleri hover
- [x] Kart hover zoom+glow — scale 1.03 + shadow; nth-child süre/gecikme
  varyasyonları (birebir aynı ritim yok)
- [x] CTA hover — KEŞFET/dosya bağlantıları 0.4rem kayma + renk
- [x] Akatsuki bulutu kesik/bindirmeli değil — rozet bulut; `cloudChip`
  ölçüldü, serbest katmanlar silindi
- [x] Hero/büyük bantlar ≥1920 — §A5 tablosu (1920/2560/3424/3840)
- [x] Kürasyonda her görselde kontrol — admin SSR'da 29 yuva ölçüldü
- [x] Kürasyon public'te görünmüyor — ziyaretçi HTML'inde 0 yuva/çerçeve
  (gerçek girişle ölçüldü)
- [x] Hakkında sağında grup görseli — `aboutArt` ölçüldü
- [x] Zigzag + dönem kimlikleri — `data-era` beş doku, `data-side`
  dönüşümlü; ölçüldü
- [x] Scroll animasyonu + merkez çizgi — `zigFill` view() dolgusu (kodda;
  desteksiz tarayıcıda dolu durur, bilgi kaybolmaz)
- [x] Mobil — 760/980 kırılımları: tek sütun, eksen solda, paneller alta
- [x] Portal + güç çubukları korundu — `portal` ve `statFill` ölçüldü
- [x] `prefers-reduced-motion` — blanket kapatma + zigFill statik dolu
- [x] Build + typecheck + lint temiz — üç komut da sıfır hata

## 5d · V6 — ÜRETİLMİŞ İLLÜSTRASYON KATMANI (17 Ağustos, gece)

Komut: `anime-salonu-duzeltme-komutu-v6.md` (v3'ün üstüne görsel üretim
skill'leri). A1-A6/B1/B2 v3'te kapanmıştı; bu turun işi B3'ün gerçek
üretimi ve yerleşimi.

### Üretim günlüğü

- **Ücretsiz skill (gemini-image-gen):** 3 deneme, 3×429 — günlük kota
  dolu (0 görsel). Kullanıcı talimatı: "ücretsizden yanıt alamıyorsan
  ücretliyi kullan."
- **Ücretli skill (anime-character-gen / fal nano-banana-2):** **7 çağrı,
  7 başarı, 0 yeniden deneme ≈ $0.56.** `FAL_KEY` kabuğa inmemişti;
  Windows kullanıcı ortamından okunup geçildi.
- Ortak stil eki: `"dark cinematic anime illustration style, muted red
  and black palette, painterly texture, volumetric light"` — set kopuk
  görünmüyor (komutun tutarlılık şartı).

| Görsel | Boyut | Yerleşim (yuva) |
| --- | --- | --- |
| Tapınak sahnesi (taş tomoe + tomar + fener) | 2752×1536 | `akatsuki:about` — Hakkında TAM ŞERİT kadraj, metin solda ışık perdesinde |
| Özgün salon hero'su (üç siluet, kızıl sis) | 2752×1536 | `akatsuki:hall-hero` — /anime açılışı; afişlerin yerini aldı |
| Kuruluş (üç yetim yağmurda) | 1200×896 | `era:founding` — zigzag kart paneli |
| Yahiko (bulut sancağı) | 1200×896 | `era:yahiko` |
| Nagato (kızıl kristal + altı gölge) | 1200×896 | `era:nagato` |
| Savaş (spiral maske + yanan alan) | 1200×896 | `era:war` |
| Son (şafakta veda + kelebek) | 1200×896 | `era:end` |

Hepsi hem yerel hem **üretim** medya sistemine yüklendi ve yuvalara
bağlandı (7/7; kürasyon akışının otomasyonu — upload → bind). Görseller
kürasyon modundan değiştirilebilir; görsel silinirse bölümler eski
düzenlerine (v3) kendiliğinden döner. ≥1920 şartı iki banner'da sağlandı;
dönem panelleri kart içi (~640px çizim) olduğundan 1200px yeterli.
Glif çipleri referanstaki gibi dairesel glow rozetlere dönüştü.

## 5e · V7 — SIX PATHS DETAYLARI + PORTRE YENİLEME (17 Ağustos)

Komut: `six-paths-ve-portre-guncelleme-komutu.md`. Tarihçe yapısına
dokunulmadı (şart).

- **Six Paths detayları:** `/anime/akatsuki/six-paths/[deva…naraka]` —
  hero=Path görseli (sergiyle AYNI yuva; kürasyon ikisini birden değiştirir),
  altında verilen uzun metinlerin tamamı + Etkiler. TR metinler olduğu gibi;
  EN karşılıkları bu turda yazıldı. Kartlar tıklanabilir, kısa cümle kartta,
  portreler küçüldü (2:1). Bilinmeyen anahtar → sergiye redirect
  (`notFound()` akış yüzünden 200 gövdesinde kalıyordu — ölçüldü; akışta
  redirect talimatı doğrulandı, ziyaretçi sergiye iner).
- **Çerçeve revizyonu:** duvar 4 sütun (portreler küçüldü), 3px kızıl
  kenar + KALICI glow + köşe bulut mühürleri + üretilmiş kızıl bulut frizi
  (screen blend). **Pain lider kartıyla duvarda:** `AKATSUKI_LEADER` ayrı
  sabit; 4px altın-kızıl kenar, çift glow, büyük 零 mührü.
- **Üretim günlüğü (bu tur):** ücretsiz kota yine kapalıydı (2 deneme
  429). Kullanıcının KALICI talimatı geldi: "ücretsiz kapalı ise ücretliyi
  kullan her zaman" (hafızaya yazıldı). Ücretli fal nano-banana-2:
  **14 çağrı ≈ $1.12** — 12 karakter portresi (Pain 2K, diğerleri 1K,
  3:4, tutarlı stil eki) + bulut frizi + canlı Amegakure göğü (2K, eski
  hero göğünün yerine, son-kazanır). Hepsi yerel + üretim medya sistemine
  bağlandı; kürasyondan değiştirilebilir. Oturum toplamı: 21 ücretli çağrı
  ≈ $1.68.
- **Canlılık:** bant opaklık/parlaklıkları bir basamak yukarı (Tarihçe
  kart yapısı değişmeden).

## 5f · V8 — DUVAR SAHNESİ + PATH FİGÜRLERİ + DOSSIER DÜZELTMESİ (17 Ağustos)

Kullanıcı bildirimleri üzerine; tema serbestliği bu sayfada kullanıldı.

- **Üye duvarı:** kadro görseli portrelerle yarışıyordu → portreler İÇİN
  üretilmiş loş galeri sahnesi (soluk bulut duvar kağıdı + üç spot havuzu,
  boş sahne). Düzen **2+4+4**: Pain + Itachi üstte ortada geniş (4:3),
  yetim kart kalmadı.
- **Six Paths figürleri:** altı beden ücretli skill ile yeniden üretildi
  (16:9 2K) — kartlar ve detay hero'ları aynı yuvadan birlikte yenilendi.
- **Anime Dünyaları:** Naruto Evreni (Konoha kapısı alacakaranlıkta) ve
  Anime Arşivi (ışıyan tomar rafları) kartlarına üretilmiş fonlar.
- **İlişkiler:** Obito satırı üretilen Tobi portresine geçti (sabit sergi
  karesi bırakıldı); gerçek Nagato yeniden üretildi (`akatsuki:nagato`,
  son-kazanır). Madara v7'de üretilmişti — satır zaten yeni portreyi
  gösteriyor (ekran görüntüsü deploy öncesine denkti).
- **🔴 DOSSIER HATASI DÜZELTİLDİ:** karakter sayfası portre çözümlemesi
  İLK kaydı alıyordu (şema sözleşmesi "sonuncusu kazanır") — yeni portreler
  dossier'de görünmüyordu. `find` → `filter().at(-1)` (yetenek kartı
  görselleri dahil). Ölçüldü: Pain dossier'i artık son portreyi basıyor.
- **Üretim:** 10 çağrı ≈ $0.80 (6 Path + duvar + 2 dünya kartı + Nagato).
  **Oturum toplamı: 31 ücretli çağrı ≈ $2.48**, ücretsiz 5 deneme 5×429.

## 5g · V9 — PATH SADAKATİ + REFERANS YOĞUNLUĞU (18 Ağustos)

Kullanıcı dört Path'in gerçek karakter görünümlerini referans karelerle
verdi ("karakterleri kendi kararına bırakma") + referans tasarım görseli
("bu yoğunlukta bilgi mimarisi, bu kalitede hiyerarşi; daha canlı, daha
glow, daha sinematik"). Talep edilen skill'ler fiilen yüklendi: taste,
soft, composition-patterns, visual-hierarchy, dark-mode-design,
motion-system.

- **Path portreleri (ücretli fal, 5 çağrı ≈ $0.60):** Preta (2 deneme —
  ilkinde alın bandına Konoha sembolü çizildi, Amegakure çentikleri tarif
  edilerek yeniden üretildi), Naraka, Asura, İnsan. 16:9 2K, v7 stil eki.
  Deva ve Hayvan yuvalarına DOKUNULMADI (kullanıcı şartı: mevcut üye +
  ilişki portreleri değişmez). Yerel + üretim medyasına API'den bağlandı
  (login→upload→bind, 4/4+4/4; kurulum düğmesi gerekmiyor, son-kazanır).
- **V9 tasarım katmanı** (TSX + module.css sonuna katman + 26 i18n
  anahtarı × 2 dil): kızıl ay halesi (gradient, nefes), dikey kanji
  şeridi (暁はここに…), hero CTA (kaydırma ipucunun yerine — taste
  kuralı), yapışkan bölüm çubuğu (8 çapa, sticky+blur, JS'siz), Hakkında
  sağ sütunu (Amaçları paneli: flame/rinnegan/dawn glifleriyle 3 satır +
  Yahiko söz kartı), sayı bandı (10+ / 9 / ∞), zigzag'a Roma rakamı
  kronoloji mührü, Nexus'a sinematik kapanış bandı (söz + dev Rinnegan;
  ikinci buton bilinçli YOK — çift CTA yasağı, kapılar hemen altında),
  glow bir basamak yukarı (çift katman text-shadow, 6 kor zerresi, path
  kartlarına kızıl vinyet). Hareket token'ları tanımlandı (--aka-dur-*/
  --aka-ease-*); reduced-motion battaniyesi yeni katmanı da kapsıyor.
- **Ölçüm:** üretim derlemesi + eslint temiz; yerel 3100'de SSR doğrulandı
  (yeni bölümler + TR/EN anahtarlar + yeni görsel adresleri sayfada).
  Tarayıcı paneli kapalı olduğundan ekran görüntüsü alınamadı — canlı
  doğrulama push sonrası.

## 5h · ITACHI DENEYİM SAYFASI (18-19 Ağustos)

Kullanıcı komutu: /karakterler/14 klasik dossier yerine "Interactive Itachi
Experience" — karanlıkta fener/reveal, dinamik Sharingan gözleri, karga
katmanları, Genjutsu modu, Jutsu laboratuvarı, tıklanabilir Sharingan
paneli (referans infografik içeriği, "Sharingan Explained" başlığı YOK),
Fedakârlık zaman çizelgesi. Ultracode: keşif (4 okuyucu) + inceleme
(4 boyut × çürütme paneli) workflow'larıyla.

- **Mimari:** rota dalı (page.tsx, characterId 14 → ItachiExperience);
  içerik lib/characters/itachi-experience.ts (Zaraki deseni, LocalizedText);
  ince overlay kaydı (itachi-uchiha.ts → OVERLAYS). Üç istemci adası:
  GenjutsuShell (data-genjutsu), ItachiHero, EyesPanel. Deri
  [data-world="itachi"] + --ita-* yardımcıları (globals). Repo'nun İLK
  rAF/canvas kodu (CSP unsafe-eval'siz üretimde serbest; emsal yoktu).
- **Hero mekaniği:** parlak sahne tek katman + ortası delik "karanlık
  örtü" (sabit gradient, yalnız transform — compositor-only; ilk maske
  mimarisi incelemede repaint bulgusuyla değiştirildi). SVG göz katmanı
  kalibre koordinatlarda (desktop/mobile ayrı; dikey set yalnızca dikey
  görsel bağlıyken). Aşamalar yalnız GERÇEK girdiyle: karanlık→kor→
  Sharingan→(bekle/tıkla)→Mangekyō. Kargalar tek canvas, 3 derinlik;
  hero ekran dışı + sekme gizliyken İKİ rAF döngüsü de durur (paylaşılan
  IO). Klavye: eyeKey ok tuşlarıyla fener, Enter'la aşama. Dokunmatik:
  açılış taraması + salınım, dokununca kullanıcı devralır.
- **Görseller (fal, 12 çağrı ≈ $1.04):** hero 16:9 + 9:16 2K (gözler
  karanlıkta — SVG katmanı hizalanır), 3 jutsu (Tsukuyomi/Amaterasu/
  Susanoo), 5 dönem, Sasuke+Shisui portreleri; Itachi/Madara v7 portreleri
  aynı upload'a yeni ABILITY satırıyla YENİDEN bağlandı (kopya yok).
  14 anahtar (itachi:*) yerel + üretimde bağlı; kurulum düğmesi gerekmez.
- **İnceleme (33 ajan, ~3M token):** 2+26 bulgu onaylandı, 19 çürütüldü.
  Kritikler: hidden'ı ezen display:flex, cursorDot koordinat uzayı,
  yaz-sonra-oku layout, maske repaint'i, otomatik Mangekyō, role=status
  spam'i, reduced-motion'da işlevsiz eyeKey, AA kontrast (--text-muted
  #92847f, --ita-crimson-text/--ita-ember-text), müzik çubuğu çakışması
  (--music-bar), iç içe main (Itachi'de düzeltildi; Akatsuki'ninki ayrı
  iş çipi). Hepsi uygulandı.
- **Ölçüm:** derleme+eslint temiz; 3100'de TR/EN SSR, panel aç/kapa,
  evrim glif değişimi, Genjutsu modu, mobil 9:16 sanat yönü ve taşmasızlık
  tarayıcıdan doğrulandı (rAF görselleri panel kısıtı gereği canlıda).

## 6 · AÇIK RİSKLER

- Kurulum ucu canlıda admin tetiklemesi bekler; o güne kadar sergi AniList
  portre fallback'iyle çizilir (küçük ~230px görseller — kabul edilebilir ilk
  hâl, komut §1 fallback şartı).
- `characters/images` ucu deploy penceresinde henüz yokken frontend canlıya
  çıkarsa getirici boş dizi döndürür (opsiyonel alan kuralı) — sayfa çökmez.
