# KuroNexus — Proje Durumu (STATE.md)

> Bu dosya AGENTS.md kural 9 gereği her önemli aşamada güncellenir.
> Yeni bir oturuma başlayan ajan İLK İŞ olarak bu dosyayı okur.

## Mevcut Aşama

> **📌 7 AĞUSTOS 2026 — DEVİR NOTU: `docs/DEVIR-2026-08-07.md`**
> Sohbetin bağlamı dolduğu için yazıldı. Sıradaki işler, tuzaklar ve
> kullanıcıdan bekleyen adımlar orada. **Bu bölümden sonra ilk onu oku.**
>
> Kısa özet: karakter kanadı + görsel yükleme + sahne karesi büyütme
> penceresi + "arşive ulaşılamıyor" ekranı canlıda. Bekleyen: karakter
> galerisini yeni Lightbox'a taşımak, benzer içerik küratör düğmeleri,
> kart eşit yüksekliği, `unoptimized` temizliği.
> ⚠️ Kullanıcıdan bekleyen: Coolify'dan `SITE_BASIC_AUTH_*` değişkenlerini
> silmek (şifre kapısını kaldırma) + filtre sağlayıcısına başvuru.

> **6 AĞUSTOS 2026 (evden) — otonom oturum. 15 commit, HEPSİ `main`'de ve
> CANLIDA.** Kullanıcı oturum sırasında push yetkisi verdi.
> Geri dönüş noktası: `git reset --hard yedek-oturum-oncesi-2026-08-06`
> (etiket `origin`'de de duruyor).
>
> **1 · Karakter kanadı (yeni)**
> `/dark-stories/category/anime/karakterler` (dizin, 195 karakter) ve
> `…/karakterler/:characterId` (karakter dosyası). Veri AniList'ten,
> `ExternalCache` üzerinden. Bileşenler `frontend/components/character/`
> altında ve **medya-bağımsız** — film/dizi karakterleri TMDB'den aynı şekli
> doldurabilir. Yeni uçlar: `/anime/characters`, `/anime/characters/:id`,
> `/anime/characters/cards?ids=`.
>
> **Zaraki Kenpachi (#909) elle tasarlandı.** Yazılı içerik (Zanpakutō,
> replikler, güç profili, savaşlar, rehber, ilişkiler) `lib/characters/
> zaraki-kenpachi.ts` içinde, **iki dilli**. Bölümler veriyle sürülüyor:
> `abilities.title` Bleach'te "Zanpakutō", Naruto'da "Jutsu" olacak, bileşen
> değişmeyecek. **Yeni karakter = yeni veri dosyası + `index.ts`'e bir satır.**
>
> **2 · Görseller veritabanında** — `CharacterImage` tablosu (migration
> `20260806200000`, üretimde koştu). Kürator modunda yüklenen görsel anında
> sayfada; kapak portresi, Shikai/Bankai kareleri ve galeri aynı tablodan.
> Yükleme iki yolla: dosya seçme ya da **adres yapıştırma** (görsel indirilip
> yerelleştiriliyor, SSRF savunması `remote-image.service.ts`).
> ⚠️ Yazılı içerik bilinçli olarak KODDA kaldı — her karakter sayfası kendine
> özel tasarlanıyor, esnek bölümleri forma sığdırmak tasarımı kısıtlardı.
>
> **3 · Kadim Dünyalar ↔ kitap serisi** — evren sayfasının altında kitap
> serisi bölümü (Zaman Çarkı 15 cilt, Malazan 7, Dune 9, Fırtınaışığı 6).
> Eşleşme `lib/universes/book-series.ts`'te; veri modelinde iki taraf
> arasında bağ yok, ölçüldü.
>
> **4 · Kapanan gerçek hatalar** — tanımsız `--pad-xl`/`--gap-xl`/`--gap-xs`
> (beş sayfada padding tamamen sıfırlanıyordu), tanımsız `--surface-2`,
> **hiç var olmayan `[data-category="dizi"]` derisi**, kitap kanadının
> derisiz yedi rotası, 901–1019px'te yatay kaydırma çubuğu, raflarda kart
> hizası. Erişilebilirlik: global `:focus-visible`, "ana içeriğe atla",
> yükleme iskeleti + 404 + hata ekranı.
>
> ⚠️ **Gözden geçirilmeli:** `--text-muted` dokuz palette açıklaştırıldı ve
> lacivert temanın `--accent`i `#9b4a4a` → `#c06a6a` oldu. İkisi de WCAG
> gerekçeli ama görünüşü değiştiriyor; ikisi de `1a6ffef` içinde, tek
> `git revert` ile geri alınır.
>
> **YARIN NEREDEN DEVAM:**
> 1. **Backend düşünce kullanıcı "arşivin boş" yazısı görüyor** — dört
>    getirici `catch` içinde boş dizi döndürüyor, salon bunu gerçek boşlukla
>    karıştırıyor. Bugün iki kez yaşandı, en güçlü aday.
> 2. Yeni karakter sayfaları (kullanıcı talebiyle: "Naruto'yu yap" → jutsu
>    kartları)
> 3. Paylaşılan `PosterCard` / `EmptyState` bileşenleri (dört salonun kart
>    kabuğu dört ayrı görsel dilde)
> 4. `unoptimized` temizliği (53 yer; `s4.anilist.co`yu `remotePatterns`a
>    eklemek yeterli)
>
> **Ayrıntı:** `docs/2-saat-oturumu.md`.
>
> **Altyapı notu:** gün içinde iki Coolify arızası oldu — backend konteyneri
> `Exited` kaldı, frontend deploy'u `/artifacts` klasörü dolu diye düştü.
> İkisi de kod kaynaklı değildi. Tekrarlarsa önce `df -h`.

> **1000KİTAP KAYNAĞI — FAZ 1 BİTTİ, 31 Temmuz 2026 (evden).**
> Kullanıcı "bu şekilde kitap eklemek yararlı olmadı, yayınevlerinden scrape
> edelim" dedi; ölçüm sonucu **1000kitap.com** tek kaynakla her şeyi veriyor.
> Toplu tarama YOK (kullanıcı kararı: "saatlerce sürecek iş istemiyorum") —
> yalnızca aranan kitap çekiliyor: arama başına 1, ekleme başına 1 istek.
>
> **Neden bu kaynak:** (1) **çevirmen** geliyor — şemada "hiçbir API güvenilir
> vermiyor" diye not düşülen alan; (2) **önek araması** çalışıyor (`"bül"` →
> Bülbülü Öldürmek, aksan katlıyor) — aşağıda "AÇIK BÜYÜK İŞ" diye duran ve
> Open Library dump'ı indirmeyi gerektiren madde **bu sayede kapandı**;
> (3) Türkçe baskı adı/kapağı/ISBN'i doğrudan geliyor.
>
> **Scrape değil okuma:** site Next.js, tüm veri `__NEXT_DATA__` etiketinde
> hazır JSON. HTML ayrıştırıcı yok, **yeni bağımlılık eklenmedi**.
> `robots.txt` kitap/arama sayfalarına izin veriyor (`Allow: /`).
>
> **Yazılanlar:**
> - `backend/src/books/bin-kitap.service.ts` — arama + künye, `ExternalCache`
>   (arama 24 sa, künye 30 gün), tek sıralı istek kuyruğu + 1 sn boşluk,
>   10 sn timeout.
> - `backend/src/books/book-cover.service.ts` — kapak **indiriliyor**, hotlink
>   yok. `UPLOAD_DIR/books/` altına, `/uploads/books/…` olarak sunuluyor.
>   SSRF savunması: beyaz liste sunucu, yönlendirme takibi KAPALI, boyut
>   sınırı, dosya imzası doğrulaması, rastgele ad.
> - `google-books.service.ts` — **dördüncü bacak**. Google ve Open Library
>   AYNEN duruyor, `allSettled` korundu; 1000Kitap `BINKITAP_SLOTS = 8` ile
>   listenin başında. Şartlı ("bulunamazsa ötekiler") yapılMADI — o davranış
>   daha önce ölçümle terk edilmişti.
> - `books.service.ts` — künye önce 1000Kitap'tan tohumlanıyor; tekrar
>   kontrolü yeni sırayla: kaynak kimliği → **eser** (orijinal ad + yazar) →
>   ISBN. ISBN bilerek sonda: baskı kimliği, eser kimliği değil.
> - `bin-kitap.service.spec.ts` — 16 test, ağsız.
> - Admin ucu: `POST /admin/books/covers/localize` — eski dış adresli
>   kapakları tek seferde indirir.
>
> **CANLIDA ÖLÇÜLDÜ (derlenmiş servisle, sahte cache):** `"bül"` → 15 sonuç,
> Bülbülü Öldürmek 4. sırada; künye tam (Ülker İnce / Sel Yayınları /
> 9789755706849 / 355 s. / 1960 / 4 tür); ikinci arama 0 ms (cache);
> kapak 37.668 bayt geçerli JPEG indi; izinsiz sunucu ve iç ağ adresi
> reddedildi; sahte seri ("Bülbülü Öldürmek #1") künyeye yazılmadı.
>
> **TUZAK — koda da yazıldı:** Node'un `fetch`i (undici) bu sitede
> **başlıktan bağımsız 403** alıyor; `node:https` + sade başlık şart.
> `fetch`e çevirmek servisi sessizce öldürür. Kapak CDN'i (`1k-cdn.com`) bu
> korumanın arkasında değil, orada `fetch` kullanılıyor.
>
> **FAZ 2a BİTTİ — ilişkisel künye (şema + yazma yolu).**
> Kullanıcı kararı: yazar/çevirmen/editör **ayrı tablolar değil**, tek
> `BookPerson` + rollü join (`BookPersonRole`). Sebep: aynı kişi sık sık iki
> rolde birden (Sabahattin Ali, Can Yücel) ve kaynağın kendi modeli de tek
> kimlik uzayı kullanıyor — ayrı tablolarda `binKitapId` eşleştirmesi kırılır.
>
> Yeni tablolar: `BookPerson`, `BookPersonOnEntry`, `BookPublisher`,
> `BookSeries`, `BookGenre`, `BookGenreOnEntry`. `BookEntry`ye `publisherId`,
> `seriesId`, `binKitapSlug` eklendi. Migration:
> `20260731210000_add_book_relational_credits` — **tamamen eklemeli**, hiçbir
> sütun düşmüyor. Migration lokalde çalıştırılamadı (DB erişilemiyor),
> `prisma migrate diff` ile çevrimdışı üretildi; **sunucuda uygulanacak**.
>
> Yeni dosyalar: `book-credits.service.ts` (ilişki çözme/kurma),
> `data/genres.data.ts` (tür sözlüğü + eşleştirme).
> Admin ucu: `POST /admin/books/credits/backfill` — mevcut kayıtların düz
> metin künyesinden ilişkileri kurar.
>
> **Eşleştirme sırası:** kaynak kimliği (`binKitapId`) → aksan katlanmış ad
> (`slug`). Kişi ve tür kimlik taşıyor; yayınevi ve seri düz metin (ölçüldü),
> onlar yalnızca ada göre eşleşiyor.
>
> **Tür politikası (kullanıcı kararı):** sözlükte karşılığı olan ad onaylı
> türe düşer; olmayan `isApproved = false` ile açılır, süzgeçte GÖRÜNMEZ,
> onay bekler. Bir ad birden çok türe düşebiliyor — "Fiction / Science
> Fiction / General" hem `novel` hem `scifi` (ölçüldü); ilk eşleşmede
> durulsaydı o kitap bilimkurgu süzgecinde hiç görünmezdi.
>
> **CANLIDA ÖLÇÜLEN İKİ HATA DÜZELTİLDİ (test yazarken çıktı):**
> 1. Site **iki ayrı seri biçimi** kullanıyor: `"Malazan Yitikler Kitabı #1"`
>    ve `"Dune 2. Kitap"`. İkincisi tanınmıyordu; *Dune Mesihi* için seri adı
>    "Dune 2. Kitap" çıkıyor ve **her cilt ayrı seri** oluyordu.
> 2. `altbaslik` alanı seri bilgisini DE düz alt başlığı DA taşıyor
>    ("Başkaldıran Bedenler" → "Türkiye'de Transgender, Aktivizm ve
>    Altkültürel Pratikler"). Artık kural: **cilt işareti yoksa seri yoktur**;
>    işaretsiz alt başlık `subtitle` alanına gidiyor. Yoksa `BookSeries`
>    alt başlıklarla dolardı.
>
> Doğrulandı (canlı): Ay Bahçeleri → Malazan Yitikler Kitabı #1 · Dune Mesihi
> → Dune #2 · Başkaldıran Bedenler → seri yok, alt başlık korundu · Kürk
> Mantolu Madonna → ikisi de yok. Kişiler kimlik + fotoğrafla geliyor
> (Harper Lee 566, Ülker İnce 35562, Bilge Sancı 72979).
>
> **FAZ 2b BİTTİ — yazar sayfası, tıklanabilir künye, admin bakım ekranı.**
> Kullanıcının canlı geri bildirimi üzerine yapıldı: "kapak da geldi, sadece
> yazar tıklanmıyor".
>
> - **Kitap sayfasında yazar, çevirmen ve yayınevi tıklanabilir.** Bağ ancak
>   ilişkisi olan kayıtta kuruluyor; olmayanda düz metin gösteriliyor. Böylece
>   Google/Open Library'den eklenmiş kitaplar eksiksiz görünmeye devam ediyor
>   (`CreditNames`, `BookDetail.tsx`).
> - **Yazar/çevirmen sayfası** `/kitap/kisi/<slug>`: fotoğraf, biyografi,
>   roller ve o kişinin arşivdeki kitapları. **Yayınevi sayfası**
>   `/kitap/yayinevi/<slug>`. İkisi `PersonHall.tsx`te.
> - **Biyografi ve fotoğraf kaynaktan otomatik geliyor**, ilk ziyarette bir kez
>   çekilip DB'ye yazılıyor — kişi eklenirken çekilseydi her kitap eklemesi bir
>   istek daha atardı ve çoğu yazarın sayfası hiç açılmayacaktı.
> - **Admin bakım ekranı** `/admin/kitap`: "Kapakları kendi sunucuma indir" ve
>   "Eski kitapların künyesini yeni düzene aktar" düğmeleri (kullanıcı `curl`
>   ile uğraşmasın diye) + **onay bekleyen türler** listesi (onayla / sil).
>
> **CANLIDA ÖLÇÜLEN HATA — 200 yanıltmıştı.** Yazar sayfası **yalnızca**
> kaynağın kendi `seo_adi`siyle açılıyor: `/yazar/harper-lee` çalışıyor, ama
> `/yazar/harper-lee--566` ve `/yazar/566` **200 dönüp BOŞ sayfa** veriyor.
> İlk doğrulamada yalnızca durum koduna bakıp "üç biçim de çalışıyor" sanmıştım;
> gerçek istekte biyografi boş gelince ortaya çıktı. Bu yüzden `BookPerson`a
> `binKitapSeoName` sütunu eklendi (migration
> `20260731230000_add_person_seo_name`, eklemeli).
> Doğrulandı: Harper Lee, Ülker İnce ve Sabahattin Ali için biyografi + fotoğraf
> geliyor. Çevirmenin de biyografisi gelmesi tek kişi tablosu kararının karşılığı.
>
> **2b DÜZELTMESİ — yazar adı tıklanmıyordu (kullanıcı canlıda bildirdi).**
> Kök sebep: kitap sayfasını `getDetail()` besliyor ve o kendi sorgusunu
> `CREDITS_INCLUDE` olmadan yapıyordu; `entry.people` boş geliyor, arayüz de
> tasarım gereği düz metne düşüyordu. Yani hata sessizdi — hiçbir yerde
> patlamıyor, sadece bağ kurulmuyordu.
>
> **Asıl kusur tipteydi:** `BookEntryWithCredits` içinde ilişkiler *isteğe
> bağlı* tanımlanmıştı, bu yüzden `include` almayan sorgu derlemeden geçiyordu.
> Alanlar **zorunlu** yapıldı ve derleyici aynı hatanın ÜÇ ayrı yerde
> olduğunu gösterdi: `getDetail`, `getPerson`, `getPublisher`. Üçü de
> düzeltildi. Bundan sonra `include` unutulursa derleme kırılır.
>
> **FAZ 2c — ÖDÜLLER 1000KİTAP'A TAŞINDI + KAYNAK KÜNYE SAYFASI.**
> Kullanıcı iki şey bildirdi: "ödüllerdeki kitaplar tıklanmıyor, bunları da
> 1000Kitap'tan çekelim" ve "Jon Fosse *Septology* İngilizce görünüyor, oysa
> sitede *Septoloji I-II* olarak var".
>
> **KAYNAĞIN ESER/BASKI MODELİ ÇÖZÜMÜN ANAHTARI (ölçüldü).** Orijinal adla
> arayınca kaynak **yabancı baskıyı** döndürüyor: `"Septology Jon Fosse"` →
> *The Other Name* (Fitzcarraldo, `dil: en`). Ama o kaydın `anaKitap`ı
> **Öteki İsim** (Monokl, `tr`) ve `digerBaskilar` listesindeki her girdi
> kendi künyesini `baskiBilgileriArray` içinde taşıyor — **dil kodu dahil**,
> yani Türkçe baskıyı seçmek için baskıları tek tek açmak gerekmiyor. Open
> Library tarafında "eser vs. baskı" ayrımıyla çözülen sorunun bu kaynaktaki
> karşılığı. `raw.editions` + `pickEdition()` bunun için eklendi.
>
> **`orijinalAdi` bu kayıtta YOK** — yani orijinal adla eşleştirme tek başına
> yetmiyor. Bağ ancak İngilizce baskının **alt başlığından** kuruluyor:
> `altBaslik: "Septology I-II"`. `confirmMatch` bu yüzden ada değil, ad
> kümesine bakıyor: baskının adı + alt başlığı + orijinal adı + **öteki
> baskıların adları ve alt başlıkları**.
>
> **Sorgu sırası Google'ın TERSİ:** 1000Kitap'ta Türkçe ad birinci sorgu.
> Sebep ölçüldü — çeviriler kaynakta ayrı kayıt olabiliyor ve orijinaliyle
> bağlı olmayabiliyor (*Flights* → *Koşucular*, iki ayrı kayıt, `digerBaskilar`
> boş). Google'da gerekçe hâlâ tersine işliyor, o kural değişmedi.
>
> **CANLI ÖLÇÜM — 99 tekil kitap** (235 kazananın tamamı denendi, kaynak hız
> sınırı yüzünden yarısında kesildi): **52 doğrudan Türkçe baskı**, **9 baskı
> atlama**, 16 yalnızca yabancı baskı, 22 ıska. Yani ölçülenlerin **%62'si**
> Türkçe baskıya oturuyor. Baskı atlamayla kurtulanlar: Septology → Öteki
> İsim · The Testaments → Ahitler · Less → Bay Less · Lincoln in the Bardo →
> Arafta · Prophet Song → Peygamberin Şarkısı · The Birthday Party →
> Doğumgünü Partisi · The Finkler Question → Finkler Sorunu · Accidental
> Death of an Anarchist → Bir Anarşistin Kaza Sonucu Ölümü · The Seven Moons
> of Maali Almeida → Maali Almeida'nın Yedi Ay Dönümü.
>
> **ÖLÇÜM İKİ GERÇEK HATA YAKALADI:**
> 1. **Yanlış eşleşme:** *Wolf Hall* (Booker 2009) aynı üçlemenin ikinci
>    cildi *Bring Up the Bodies*'e eşleşiyordu — üçlemenin adı da "Wolf Hall"
>    ve künyeye `altbaslik`ten girip `seriesName`e düşüyor. **Seri adı
>    `confirmMatch` anahtarlarından çıkarıldı**: seri adı kitabın adı değil ve
>    listede eseriyle aynı adı taşıyan seriler var (Dune, Wolf Hall).
> 2. **Aksan katlanmıyordu.** Ödül eşleştirmesinin kendi `normalize`ı
>    `\p{L}`yi koruyordu; kaynak "Kenzaburo Oe" yazarken liste "Kenzaburō Ōe"
>    diyor ve yazar tutmuyordu (Szymborska, Kertész, Le Clézio aynı sebeple).
>    Artık kod tabanının geri kalanıyla aynı katlayıcı kullanılıyor
>    (`slugify`). **Guard şart:** `slugify` ASCII dışı yazıyı tamamen eliyor,
>    iki boş anahtar "birebir aynı" sayılmasın diye `titleRank` boşu atlıyor.
>
> **HIZ SINIRI — YENİ VE ÖNEMLİ.** Saniyede bir istekle ~25 istekten sonra
> site **429** dönmeye başlıyor ve ısrar yalnızca yeni 429 getiriyor. Tek bir
> küratör aramasında görünmez, toplu ödül eşleştirmesinde hemen çıkar.
> Eklenenler: `BinKitapRateLimitError` (ayrı tür — "aradık bulamadık" ile
> "soramadık" ayrımı şart), kuyrukta **60 sn soğuma**, ve ödüllerde 429
> görülünce **tur bitiyor**, cache'e hiçbir şey yazılmıyor. Yutulsaydı 429
> yiyen kitap Google'ın İngilizce cildine 90 gün çakılırdı.
> `BACKFILL_PER_REQUEST` 6 → **3** (bir kazanan artık 2–4 sayfa açıyor).
>
> **KAYNAK KÜNYE SAYFASI — `/kitap/kaynak/<slug>` (kullanıcı kararı).**
> Ödül kartı üç hâlli: arşivdeyse kendi kitap sayfası → değilse kaynak künye
> sayfası → hiç eşleşmemişse tıklanmaz. Sayfa **arşive kayıt AÇMIYOR**
> (kullanıcı kararı: arşiv küratörün seçtiklerinin yeri) ve kitap sayfasının
> kopyası değil — puan, not, alıntı, okuma durumu yok. Künye kaynağın kendi
> 30 günlük cache'inden okunuyor. Yazar/çevirmen/yayınevi bağı **yalnızca o
> kayıt arşivde varsa** kuruluyor, yoksa düz metin (olmayan kişinin sayfası
> 404 verirdi — kitap sayfasındaki aynı karar).
> Yeni: `BooksService.getSourceBook`, `GET /books/kaynak/:slug`,
> `SourceBook.tsx`, `ArchiveBook.binKitapSlug` (arşiv eşleşmesi için).
>
> **Cache sürümleri artırıldı:** `books:award:v1` → **v2** (eşleştirme kaynağı
> değişti, v1'de çakılı 90 günlük yanlış eşleşmeler yeni kaynağın önünü
> keserdi), `books:1k:book:v1` → **v2** (`raw.editions` eklendi, v1 kayıtları
> o alanı taşımıyor ve Türkçe baskı seçimi sessizce boşa düşerdi).
>
> **YOL ÜSTÜNDE BULUNAN AYRI HATA:** `book.person.*` çeviri anahtarları
> `book.sections.person` altına yuvalanmıştı; `PersonHall` `t("person.…")`
> okuyor. Yazar/çevirmen ve yayınevi sayfası etiketlerini bulamıyordu. tr ve
> en'de doğru yere taşındı.
>
> **YAPILMADI / AÇIK:**
> - Ölçüm 235 kazananın **99'unda** kesildi (site 429 vermeye başladı, ısrar
>   edilmedi). Kalanlar canlıda arka planda dolacak — tasarım zaten bu.
> - **Iska listesi elde:** `titleTr` yazılı olduğu hâlde ıskalayan kitaplar
>   var (İkinci El Zaman, Açlık Meleği, Çöl, Kadersizlik, Kişisel Bir Sorun,
>   Oscar Wao'nun Tuhaf Kısa Yaşamı, Kayıp Mirası). Bunların bir kısmı aksan
>   düzeltmesiyle kendiliğinden düzelmiş olabilir — **ölçülemedi**, site o
>   sırada 429 veriyordu. `titleTr` uydurulmadı (kural: doğrulanmamış ad
>   künye gibi davranmaz).
> - Wolf Hall hatasının `seriesName` üzerinden geldiği **çıkarım**; kaynak
>   aynı adı cilt işaretsiz yazarsa `subtitle`a düşer ve yine geçer. Canlıda
>   sınanamadı.
> - Ödül ısıtma cron'u hâlâ yazılmadı (`awards.service.warm()` hazır).
>
> **FAZ 2d — GEZİNME: YAZAR PANELİ, SERİ SAYFASI, HİZALAMA, ÖDÜL YAZAR BAĞI.**
> Kullanıcı beş şey bildirdi: salondaki yazar kartları tıklanmıyor, raftaki
> kitaplar düzensiz duruyor, seri kartı serinin sayfasını açmıyor, ödül
> kapakları ancak elle yenileyince doluyor, ve ödüldeki yazara tıklanamıyor.
>
> **Yazar paneli tıklanmıyordu çünkü iki ayrı kaynaktan besleniyordu.** Panel
> düz metin `authors` sütunundan kuruluyor, sayfa adresi ise ilişkisel kişi
> kaydından geliyor — kart hiçbir zaman ikisini birleştirmemişti, yalnızca
> arşivi o adla süzüyordu. `buildAuthors` artık künyedeki `AUTHOR` rollerinden
> ad→slug köprüsü kuruyor (anahtar hem adın kendisi hem katlanmış hâli).
> İlişkisi olmayan yazarda kart **eski davranışta kalıyor**: olmayan kişinin
> sayfası 404 verirdi.
>
> **Raf hizalaması iki ayrı sebepten bozuktu, biri yetmiyordu.** (1) Cilt
> boyları `nth-child` ile bilerek farklıydı (gerçek kitaplık imzası) — kaldırıldı,
> hepsi 174px. (2) Asıl sebep buydu: `.volumes` **alt kenardan** hizalıyordu ve
> iki satırlık adı olan cilt bütün bloğu yukarı çekiyordu. Üst kenardan
> hizalamaya geçildi ve kitap adı iki satıra kilitlendi (`line-clamp`, sabit
> 2.375rem) — yazar satırları artık aynı hizada.
>
> **Seri sayfası: `/kitap/seri/<slug>`.** Yeni uç `GET /books/seri/:slug`,
> `BooksService.getSeriesPage`. Ciltler **iki yoldan** toplanıyor: ilişkisel
> `series.slug` ve düz metin `seriesName`in katlanmış hâli. Yalnızca ilişkiye
> bakılsaydı Faz 2a öncesi ciltler serilerinin sayfasında görünmezdi. Sayfa
> `PersonHall.tsx`e eklendi (o dosyanın kendi gerekçesi: aynı düzeni paylaşan
> sayfalar tek CSS'i paylaşsın).
>
> **Ödül kapakları artık kendiliğinden doluyor.** `AwardDetail.pending` eklendi
> — henüz **hiç denenmemiş** kazanan sayısı (eşleşmesi bulunamayanlar sayılmıyor,
> yoksa tazeleme sonsuza dönerdi). Ön yüzdeki `AutoFill` 20 sn'de bir
> `router.refresh()` çağırıyor, en fazla 30 tur (~10 dk). **Tur sayacı şart:**
> `pending` bir turda hiç azalmayabiliyor (kaynak 429 verince tur boş biter) ve
> yalnızca ona bakan bir `useEffect` orada sessizce dururdu. `BACKFILL_PER_REQUEST`
> **3'te bırakıldı** — ölçülmüş hız sınırı bu, tazeleme sıklığı onun altında.
>
> **Ödül kartında yazar bağı — üç kademe.** (1) arşivdeki kişi kaydı, (2)
> kaynağın kendi adres anahtarı (`seo_adi`), (3) adın katlanmış hâli. İkincisi
> için eşleşme cache'ine `authorSeo` eklendi ama **cache sürümü ARTIRILMADI**:
> alan eski kayıtlarda yok ve yokluğunda üçüncü kademeye düşüyor — sürüm
> artsaydı ölçülmüş 90 günlük eşleşmelerin tamamı çöpe giderdi.
>
> **Kişi sayfası artık arşiv dışı yazarı da çiziyor** (isteğin gerektirdiği
> şey buydu: ödüldeki kitap çevrilmemiş olsa bile yazar sayfası açılsın).
> `getPerson` sırayla: kendi slug'ımız → `binKitapSeoName` → kaynağın yazar
> sayfası → kod içi ödül listesi; hepsi susarsa 404. Kaydı olmayan kişide
> **hiçbir şey yazılmıyor** (kayıt da, fotoğraf da — fotoğraf kalıcı yola
> yazılmadıkça her ziyarette yeniden inerdi). Sayfa boş kalmasın diye ödül
> listesindeki geçtiği yerler gösteriliyor; **rol uydurulmuyor**, yalnızca
> ödül listesi yazarlığı kanıtlıyorsa "Yazar" yazıyor.
>
> **HEMEN ARDINDAN ÇIKAN HATA — KUYRUK AÇLIĞI (aynı gün düzeltildi).**
> Kullanıcı küratörde "buçuk" arayınca **arama simgesi dönüp duruyor, sonuç
> hiç gelmiyordu.** Sebep tek bir satırda değil, üç kararın birleşiminde:
>
> 1. `BinKitapService.queue` **paylaşımlı ve tek sıra** — istekler arasında en
>    az 1 sn boşluk var.
> 2. Ödül doldurması bir turda 3 kazanan × 2–4 sayfa açıyor, yani kuyruğa bir
>    seferde ~12 istek diziyor.
> 3. Yeni `AutoFill` bunu **20 saniyede bir** tetikliyordu.
>
> Kuyruk dolduğundan hızlı büyüyor; küratör aramasının 1000Kitap bacağı sıranın
> arkasına düşüyor ve `google-books.service` dört bacağı `allSettled` ile
> beklediği için **HTTP yanıtı hiç dönmüyor**. 429 görülürse daha da beter:
> kuyruktaki her iş 60 sn soğumayı ayrı ayrı bekliyor.
>
> **Üç yerden birden düzeltildi:**
> - `fetchNextData(path, foreground)` eklendi. Ön plandaki çağrı (küratör
>   araması, kişi sayfası) soğumada **hiç sıraya girmiyor** ve bekleyişi
>   `FOREGROUND_DEADLINE_MS` (6 sn) ile sınırlı. Süre dolunca yalnızca
>   *beklemekten* vazgeçiliyor — sıradaki iş çalışıp cache'i dolduruyor.
>   Bacak düşünce arama Google + Open Library ile dönüyor (kural 4).
> - `BinKitapService.isCoolingDown()` eklendi; ödül doldurması soğumadayken
>   turu **hiç başlatmıyor**.
> - `AutoFill` 20 sn → **45 sn**, üst sınır 30 tur → 20 tur.
>
> Ders: paylaşımlı bir kuyruğa arka plan işi dizerken ön plandaki çağrının o
> sıranın arkasında kalıp kalmadığı **ayrıca** düşünülmeli. `allSettled`
> bacakları birbirinden yalıtıyor ama **süreden yalıtmıyor** — en yavaş bacak
> yanıtın süresini belirlemeye devam ediyor.
>
> **İKİNCİ HATA — YANLIŞ KİTABIN KÜNYESİ YAZILIYORDU (aynı gün düzeltildi).**
> Kullanıcı Open Library'den *Miras* (R. A. Salvatore) seçip ekledi; arşive
> **Kültürel Miras Duyarlılığı ve Somut Olmayan Kültürel Miras Tutumları**
> (Fatih Dursun, Detay Yayıncılık, 101 sayfa) girdi. Kapak, ISBN, arka kapak,
> yazar — hepsi o kitabın.
>
> **Sebep `seed()`te iki eksik.** (1) `binKitapSlug` ve `googleId` için dal
> vardı ama **`olKey` için hiç yoktu** — Open Library seçimi hep en alttaki
> "ada göre ara" dalına düşüyordu. (2) O dal `this.source.search(dto.title)`
> yapıp **`results[0]`ı körü körüne** alıyordu. Sorgu yalnızca "Miras"tı
> (yazar DTO'da hiç yoktu) ve 1000Kitap bacağı listenin başında olduğu için
> ilk sonuç o akademik çalışma çıkıyordu. Hata Faz 1'den beri duruyordu ama
> 1000Kitap arama sonuçlarına eklenene kadar görünür olmamıştı.
>
> **Düzeltme:**
> - DTO'ya `author` eklendi — künyeye **yazılmıyor**, yalnızca doğru kitabı
>   bulmak için. Sorgu artık "Miras R. A. Salvatore".
> - `pickSeed()` (dışa açık, saf, sınanıyor): önce **kimlik**
>   (`olKey`/`googleId`/`binKitapSlug`), sonra **ad + yazar** doğrulaması. Ad
>   **birebir** aranıyor — gevşek eşleşme *Dune* yerine *Dune Mesihi*'ni
>   getirirdi (ödül tarafında ölçülmüş tuzağın aynısı). Hiçbiri tutmazsa
>   `null`: kayıt yalnızca adıyla açılır, künyeyi küratör doldurur.
>   **Doğrulanmamış künye yazmaktansa boş bırakmak doğru.**
> - `books.service.spec.ts` açıldı; ilk sınama kullanıcının bildirdiği
>   senaryonun kendisi.
>
> Ders: "ilk sonucu al" bir eşleştirme değil, bir tahmindir. Kod tabanında
> ödül tarafı bu dersi zaten öğrenmişti (`pickBest`, `confirmMatch`); kayıt
> açma yolu aynı dersi almamıştı.
>
> **ELDE KALAN BOZUK KAYIT:** Kullanıcının arşivindeki "Miras" kaydı yanlış
> künyeyle duruyor. "⟳ tazele" yalnızca **boş** alanları doldurduğu için
> düzeltmez — kayıt silinip yeniden eklenmeli.
>
> **ÜÇÜNCÜ HATA — BOŞ ARAMA SONUCU 24 SAAT CACHE'LENİYORDU.**
> Kullanıcı "sessiz kılıç" arayınca listede **tek bir `1K` kaydı** yoktu, oysa
> 1000Kitap'ta ilk üç sonuç *Sessiz Kılıç* (R. A. Salvatore).
>
> **Kaynak canlıda ölçüldü ve veri yerindeydi:** `/ara?q=sessiz kılıç&
> bolum=kitaplar` **20 kayıt** dönüyor, ilk üçü *Sessiz Kılıç*, `resim` ve
> `yazarlar` dolu, `toSearchResult`ın istediği üç alan (`adi`, `seo_adi`,
> `id`) da yerinde. Yani ayrıştırma değil, **cache** suçluydu:
>
> `BinKitapService.search` sonucu **her hâlükârda** yazıyordu — boş listeyi
> bile. Bacak geçici bir sebeple boş dönerse (kuyruk açlığı, okunamayan sayfa,
> `fetchNextData` null) o sorgu **24 saat** boyunca boş kalıyordu. Aynı ders
> ödül eşleştirmesinde `sawResults` ile zaten alınmıştı ("hiç sonuç gelmedi
> bir cevap değildir"); arama bacağı almamıştı. Artık boş sonuç
> **cache'lenmiyor**, uyarı basılıyor.
>
> **KURATÖRDE DOĞRUDAN ADRES (kullanıcı isteği).** Arama kutusuna 1000Kitap
> kitap adresi yapıştırılınca künye doğrudan o **baskıdan** geliyor:
> `binKitapSlug()` adresi çözüyor, `BooksService.searchOrResolve` normal arama
> yerine `getByUrl` çağırıyor. Gerekliliği ölçümle de doğrulandı — aynı eserin
> kaynakta birden çok baskısı var (*Sessiz Kılıç*: `--308785` ISBN
> 9786258487534, `--498745` ISBN 9789758518791) ve arama hangisini öne
> çıkaracağını küratör adına seçiyor.
>
> **Kimlik eki (`--308785`) ZORUNLU, ölçüldü:** `/kitap/sessiz-kilic--308785`
> künyeyi veriyor, `/kitap/sessiz-kilic` **200 dönüp boş sayfa** veriyor.
> Yazar sayfasındaki tuzağın aynısı; yalnızca durum koduna bakan bir doğrulama
> ikisini de "çalışıyor" sanır.
>
> **"Daha fazla göster"** eklendi: liste ilk 10 kayıtla açılıyor, kalanı tek
> tıkla iniyor. Kaynaklar 20 kayda kadar dönüyor ve sessizce kesmek "aradığım
> kitap yok" izlenimi veriyordu.
>
> **FAZ 2e — SALON DÜZENİ: PORTRELİ YAZAR PANELİ, DİZİN SAYFALARI, RAF SIRASI.**
> Kullanıcı bildirimleri: yazar kartı komşusunun üstüne biniyor, yazar
> panelinde portre yok, yeni kurulan Sissoylu serisi görünmüyor, raflarda
> satırın sağı boş, "Şu an okuyorum" en altta kalıyor.
>
> **Kart taşması bir REGRESYONDU (Faz 2d'de ben yaptım).** Yazar kartı
> `<button>`ken tarayıcı ona `box-sizing: border-box` veriyordu; sayfaya bağ
> kurmak için `<a>`ya çevrilince bu kayboldu ve `width:100%` + dolgu +
> kenarlık hücreyi 26px taşırıp komşu karta bindi. `box-sizing` artık açıkça
> yazılı.
>
> **Sissoylu görünmüyordu çünkü liste altıda kesiliyordu** (`SERIES_LIMIT`),
> Sissoylu 7. sıradaydı ve **kesildiği hiç söylenmiyordu**. İki taraflı
> düzeltildi: şerit 9 seri gösteriyor ve kesilme varsa "Tümünü gör" çıkıyor.
> Yazar paneli de aynı: 16 (8×2), kalanı kendi sayfasında. `AUTHOR_LIMIT`
> backend'den **kaldırıldı** — dizin sayfasının tam listeye ihtiyacı var,
> arşiv zaten bütün kitaplarıyla geliyor.
>
> **Yeni dizin sayfaları:** `/kitap/yazarlar` ve `/kitap/seriler`
> (`ArchiveIndex.tsx`). **Yeni uç yok** — arşiv tek istekte zaten hepsini
> taşıyor. Kartlar salonunkiyle **aynı bileşen** (`AuthorCard`, `SeriesCard`
> `BookCard.tsx`e taşındı): iki kopya kart iki ayrı görünüme kayardı.
>
> **Rafın sağı boştu çünkü ciltler sabit 116px genişlikteydi** ve esnek satır
> kalanı boş bırakıyordu. Raf artık **ızgara**, sütunlar `1fr` — her genişlikte
> tam doluyor. `SHELF_ROW` 7 → **9** ve sütun sayıları 9'un bölenlerinden
> seçildi (3 ve 9) ki satır tam olsun; tabletteki 5'li kademede son satır
> yarım kalıyor, telefonda zaten öyleydi. `.spine` sabit yükseklikten
> **orana** (2/3) geçti: sütun genişliği artık ekrana göre değişiyor.
>
> **Yazar portreleri.** `BookAuthorCard.photo` eklendi; portresi olmayan
> yazarda kart baş harflerden madalyon çiziyor (kapaksız kitapta adın kapağın
> yerini tutmasıyla aynı karar). Portre normalde **kişi sayfası ilk
> açıldığında** iniyor, yani hiç ziyaret edilmemiş yazarda yok — bakım
> ekranına üçüncü düğme eklendi (`POST /admin/books/people/photos`).
> **Elle tetikleniyor, arka planda değil:** kaynağın kuyruğu paylaşımlı ve
> saniyede bir istek geçiriyor, onlarca yazarı sayfa açılışında yüklemek
> küratör aramasını yine askıya alırdı.
>
> **Raf sırası:** "Şu an okuyorum" en üste alındı (kullanıcı kararı — sayfaya
> girildiğinde ilk görülmek istenen şey aktif okuma).
>
> **FAZ 2f — OKUMA SIRALARI (yeni bölüm).** Kullanıcı internette bulduğu bir
> "Vakıf Evreni Okuma Sırası" tablosunu getirdi ve **yalnızca oradaki
> bilgilerle** kendi tablomuzun kurulmasını, benzerinin başka evrenlerde de
> kullanılabilmesini istedi. Hazırlayan adı bilerek alınmadı.
>
> **Liste kod içinde küratörlü** (`data/reading-orders.data.ts`), ödül
> listeleriyle aynı gerekçe: bu kişisel bir seçki, dış kaynaktan çekilemez.
> Yeni evren eklemek için oraya bir tanım yazmak yeterli — servis, sayfa,
> tablo, renk şeridi hepsi ortak.
>
> **Servisin tek işi listeyi ARŞİVLE buluşturmak:** hangi durak sende var,
> hangisini okudun. Sayfanın asıl sorusu bu; yoksa sabit bir tablodan ibaret
> kalırdı. Eşleştirme **bütün adlar** üzerinden — orijinal ad(lar) ve Türkçe
> adların hepsi. Tek ada bakmak yetmiyor: aynı kitap arşive hangi baskıyla
> eklendiyse o adla duruyor ("Çıplak Güneş" ile "Güneşin Tanrıları" aynı
> kitap) ve listedeki adların hangisi olduğu **bilinmiyor**. Orijinal ad
> sütunundaki eğik çizgi de iki ayrı İngilizce adı ayırıyor, o da bölünüyor.
>
> **Adlar düzeltilmiyor.** Türkçe sütunundaki eğik çizgiler farklı
> yayınevlerinin ayrı adları; hangisinin hangi baskı olduğu tabloda yazmıyor
> ve **tahmin edilmiyor** — arayüz hepsini yan yana gösteriyor.
>
> **Tablo bir YOL olarak çiziliyor**, ızgara olarak değil: numaralı duraklar,
> aralarında çizgi, serinin rengi kartın sol kenarında. "Okuma sırası /
> yayım yılı" düğmesi listenin asıl iddiasını görünür kılıyor (sıra yayım
> sırası değil); seri rozetleri süzgeç olarak da çalışıyor.
>
> **Sol ray: yazar.** Portre ve biyografi **kişi sayfasının kendi yolundan**
> geliyor (`BooksService.getPerson`), buraya kopyalanmıyor. Asimov arşivde
> olmadığı için bu kaynağın yazar sayfasına düşüyor — Faz 2d'de yazılan
> "arşivde olmayan kişiyi kaynaktan çiz" yolu tam da burada işe yaradı.
> Ek olarak `sourcePerson` artık **portreyi de indiriyor**: `BookPerson`
> kaydı açmadan, `ExternalCache`e yazarak (hem hotlink yok, hem her ziyarette
> yeniden inmiyor, hem arşive sahte kişi kaydı düşmüyor).
>
> **FAZ 2f-b — OKUMA SIRASININ DÖRT EKİ (kullanıcı hepsini seçti).**
>
> **17 durağın kaynak anahtarı TEK TEK ÖLÇÜLDÜ.** Kaynakta arandı, yazarı
> doğrulandı, dönen anahtar veri dosyasına yazıldı (`sourceSlug`). İlk turda
> 15/17 tuttu; kalan ikisi alternatif adla bulundu. Ölçüm bir şeyi daha
> gösterdi: kaynak *Foundation's Edge*'i **"Vakıf'ın Sınırı"** yazıyor, liste
> ise "Vakfın Sınırı" — kesme işareti yüzünden ad anahtarları tutmuyordu.
> Bu yüzden arşiv eşleşmesi artık **iki kademeli**: önce kaynak anahtarı
> (kesin), sonra adlar. Anahtarların çalıştığı da ölçüldü:
> `/kitap/sessiz-kilic--308785` biçimi künyeyi veriyor, kimliksiz biçim
> **200 dönüp boş sayfa**.
>
> 1. **"Buradayım" imi.** Yeni tablo `ReadingOrderProgress` (migration elle
>    yazıldı, lokalde DB yok). Sıra başına tek kayıt; `0` imi kaldırıyor ve
>    satır **silinmiyor** — im koyup kaldırmak sık yapılan bir şey. İmden
>    önceki duraklar soluklaşıyor, imin kendisi altın halkayla işaretleniyor.
>    İm yalnızca **okuma sırası** görünümünde çiziliyor: yayım sırasında
>    "geçilmiş durak" diye bir şey yok.
> 2. **Eksik durak → künye sayfası.** Ölçülmüş anahtar sayesinde arşivde
>    olmayan durak da `/kitap/kaynak/<slug>` sayfasına gidiyor. Arka planda
>    eşleştirme YOK, yani kuyruğa hiç yük binmiyor (ödül rafından farkı bu).
> 3. **Kitap sayfasında geri bağ.** `readingOrders` alanı `BookDetail`e
>    eklendi ama **`BooksService`in içinde değil, controller'da**: kitap
>    servisi okuma sıralarını bilmiyor ve bilmemeli — bağımlılık tek yönlü
>    kalsın.
> 4. **Tek tıkla arşive ekle.** Küratör modunda eksik durakta "Arşive ekle";
>    künye ölçülmüş anahtardan geliyor, arama yapılmıyor. `status: TO_READ`
>    gönderiliyor — sıradaki kitap "okudum" olarak eklenmemeli.
>
> **YAPILMADI / AÇIK:**
> - **Migration elle yazıldı ve lokalde ÇALIŞTIRILAMADI** (DB erişimi yok).
>   Deploy'da `prisma migrate deploy` ile inecek; tablo açılmazsa "buradayım"
>   düğmesi 500 verir, sayfanın geri kalanı çalışmaya devam eder.
> - Sayfa canlıda **hiç görülmedi**. Özellikle iki şey ölçülmeli: Asimov'un
>   `isaac-asimov` slug'ıyla kaynakta bulunup bulunmadığı (bulunmazsa ray
>   yalnızca adla çizilir) ve arşiv eşleşmesinin hangi duraklarda tuttuğu.
> - Yazar portrelerinin çoğu canlıda **boş gelecek**; bakım ekranındaki
>   "Yazar portrelerini indir" bir kez çalıştırılmalı. Kaç kişide tuttuğu
>   ölçülmedi (kişinin `binKitapSeoName`i yoksa kendi slug'ımız deneniyor).
> - Yeni ızgaraların gerçek ekranda nasıl durduğu görülmedi, yalnızca derleme
>   temiz.
> - "sessiz kılıç" sorgusunun cache'i **canlıda hâlâ boş olabilir** (24 saatlik
>   TTL). Düzeltme yeni sorguları koruyor ama eskisini silmiyor —
>   `ExternalCache`ten `books:1k:search:v1:sessiz-kilic` elle silinebilir ya da
>   bir gün beklenir.
> - Kuyruk açlığının bu üç düzeltmeyle bittiği **canlıda ölçülmedi**.
> - Open Library seçiminin artık doğru kitabı getirdiği canlıda ölçülmedi;
>   kimlik dalı arama sonucunda `olKey`in görünmesine bağlı (arama "ad +
>   yazar" ile yapılıyor, aynı kayıt listede olmalı). Tutmazsa ad + yazar
>   doğrulaması devreye giriyor, o da tutmazsa kayıt künyesiz açılıyor.
> - Üçüncü kademe yazar bağı bir **tahmin**: kaynağın `seo_adi`si adın
>   katlanmış hâlinden farklıysa kişi sayfası 404 verir. Kart yine tıklanır
>   hâlde — hangi adlarda tuttuğu **ölçülmedi** (lokalden kaynağa çıkılamıyor).
> - `AutoFill` canlıda sınanmadı: turun gerçekten 20 sn'de bittiği ve 429
>   yemediği ölçülmeli.
> - Hizalama yalnızca derlemede doğrulandı, ekranda görülmedi.
>
> **SIRADAKİ — Faz 2c'nin kalanı (YAZILMADI, acil değil):** düz metin sütunlarını
> (`authors`, `publisher`, `translator`, `genres`, `seriesName`) düşür,
> `publisherRef` ilişkisini `publisher` olarak yeniden adlandır, ön yüzdeki
> `lib/book/genres.ts` kopyasını sil ve türleri API'den okut.
>
> **EVDE DOĞRULANACAK (lokalden admin API'sine bağlanılamıyor):**
> 1. Küratörde ara: **"bül"** → `1K` rozetli *Bülbülü Öldürmek* listenin
>    başında görünmeli. Seç ve ekle → çevirmen **Ülker İnce** künyeye
>    yazılmış mı?
> 2. Eklenen kitabın kapağı `/uploads/books/…` mi (dış adres değil)?
> 3. Aynı kitabı tekrar eklemeyi dene → "arşivinizde var" uyarısı gelmeli.
> 4. `POST /admin/books/covers/localize` → eski kapaklar yerelleşiyor mu?

> **DEVİR NOTU — 31 Temmuz 2026, iş yeri kapanışı. EVDEN DEVAM EDİLECEK:
> ilk iş `git pull`.** Çalışma dizini temiz, her şey `origin/main`de
> (`bbe27d9`). Bugün altı push gitti: `f7eb57c` mobil raflar → `5c614b2`
> allSettled + durum notu → `9febf16` **Faz B · Ödüller** → `5095fa8` tür
> süzgeci sabit liste → `4424b9e` çift kaynaklı canlı arama → `bbe27d9`
> Open Library Türkçe baskı + küratör araçları.
>
> **EVDE İLK YAPILACAKLAR (gerçek admin girişiyle; hiçbiri lokalden
> denenemiyor, admin API'sine lokalden bağlanılamıyor):**
> 1. Küratör modunda ara: **"bülbülü öldürmek"**. Listede `OL` rozetli,
>    **Türkçe adlı ve Türkçe kapaklı** kayıt görünmeli. Onu seçip ekle →
>    kapak gerçekten geliyor mu? (Bugünkü işin asıl sınavı bu.)
> 2. Küratör modunda bir kitabın altındaki **✕** → kitap gerçekten
>    siliniyor mu? Düzen hatası düzeltildi ama canlıda denenmedi. Silmiyorsa
>    sıradaki şüpheli `router.refresh()` sonrası yeniden çizim.
> 3. `/dark-stories/category/kitap/oduller` → dokuz ödül kartı. **İlk
>    açılışta kapakların çoğu boş gelecek, bu beklenen** (eşleşme arka
>    planda, her istekte 6 kayıt). Birkaç kez yenileyince dolmalı.
> 4. Sol raydaki **Tür** süzgeci (Dönem'in altında): 20 tür listeleniyor,
>    hepsinin sayacı şu an sıfır çünkü iki kitabının da `genres` alanı boş.
>    Küratörden tür girersen sayaçlar dolmaya başlar.
>
> **SIRADAKİ İŞ — Faz B'nin kalanı:** Keşfet rafları (Goodreads Top 250,
> NYT, Türk Edebiyatı, Modern/Antik Klasikler — ödüllerle **aynı makineyi**
> kullanacak, ucuza gelir), kitap sayfasında spoilersız/spoiler inceleme +
> karakterler + farklı baskılar, yazar paneline biyografi/tüm eserler,
> kitap kanadının `pulse` uçlarına eklenmesi. Ayrıca **ödül ısıtma cron'u**:
> `awards.service.warm()` hazır, çağıran cron yazılmadı (`anime.cron.ts`
> deseni izlenecek) — o olmadan ödül kapakları yalnızca sayfa gezildikçe
> doluyor.
>
> **AÇIK BÜYÜK İŞ (kullanıcı istedi, yapılmadı):** gerçek önek araması
> ("bül" → Bülbülü Öldürmek). Google Books önek motoru değil (ölçüldü),
> `pg_trgm` de kendi satırlarımızı aradığı için çözmez. Open Library
> dump'ının kendi Postgres'imize indirilmesi gerekir — ayrı ve büyük bir iş.

> **OPEN LIBRARY TÜRKÇE BASKI + KÜRATÖR ARAÇLARI — 31 Temmuz 2026 (2).**
> Kullanıcı iki şey bildirdi: Open Library'de Türkçe kapaklı sayfa varken
> aramada İngilizce sürüm geliyor; küratör modunda ✕ kitabı kaldırmıyor.
>
> **(1) Open Library artık Türkçe BASKIYI getiriyor.** Kritik ayrım:
> `search.json` **eser** döndürüyor ve eser kaydı hep orijinal dilde ("To
> Kill a Mockingbird" + İngilizce kapak). Kullanıcının gördüğü Türkçe
> kapaklı sayfa bir **baskı** kaydı. Çözüm: arama artık **iki sorgu**
> yapıyor — `language=tur` + `editions,editions.*` alt alanlarıyla Türkçe
> baskı, bir de düz eser sorgusu. Türkçe baskı bulunursa ad, kapak ve
> `olKey` ondan alınıyor, eserin adı `originalTitle`a yazılıyor; bulunamazsa
> eser kaydı kalıyor (çevrilmemiş kitap kaybolmasın).
> Ölçüldü: "bülbülü öldürmek" → `Bülbülü Öldürmek` + `cover_i 15153566`
> (39 KB gerçek kapak). "dune frank herbert" → Dune, Dune Mesihi, Dune
> Sapkınları, Dune Rahibeler Meclisi, hepsi Türkçe adı ve kapağıyla.
> `olKey` bir **baskı** anahtarı olabiliyor artık (`/books/OL…M`) — sorun
> değil, yalnızca saklanıp yinelenen kayıt kontrolünde kullanılıyor,
> tekrar sorgulanmıyor.
>
> **Alaka süzgeci artık Open Library'ye de uygulanıyor.** Önce uygulanamıyordu
> çünkü eser orijinal adıyla dönüyor ve süzgeç tam da istenen kaydı eliyordu;
> Türkçe baskı desteğiyle bu engel kalktı. `isRelevant` samanlığına
> `originalTitle` da katıldı. Kazanç: "dune frank herbert" sorgusuna gelen
> "Bir Yaz Gecesi Rüyası" gürültüsü temizlendi.
>
> **(2) ✕ neden çalışmıyordu — kök sebep DÜZEN.** Backend silme, CORS
> (`OPTIONS` ön kontrolü canlıda sınandı: `DELETE` izinli), i18n anahtarları
> ve `router.refresh()` zincirinin hepsi doğruydu. Sorun `CuratorCardTools`
> şeridinin salon rafındaki **98px'lik** sütuna sığmamasıydı: durum seçkisi
> kendi metnine göre ~190px'e uzayıp sütunun dışına taşıyor, komşu cildin
> üstüne biniyordu ve dokunuşlar yanlış öğeye gidiyordu. Düzeltme:
> `.tools`'a `min-width:0; max-width:100%`, `.statusSelect`'e
> `flex:1 1 100%` + `max-width:100%`, düğmelerin taban ölçüsü **44px**
> (640px üstünde 32px'e dönüyor), `.remove` ayrı renkle ve `margin-left:auto`
> ile ayrıldı.
> **Doğrulandı (375px):** sütun 98px, araçlar 98px, taşma yok, ✕ 44×44 ve
> `elementFromPoint` düğmenin merkezinde **düğmenin kendisini** döndürüyor
> (yani dokunuş artık ona gidiyor). 1600px: 116px sütun, ✕ 32px, taşma yok.
>
> **NOT:** ✕'in canlıda gerçekten sildiği hâlâ gerçek admin girişiyle
> denenmedi — lokalden admin API'sine bağlanılamıyor. Düzen hatası kesin ve
> düzeltildi; sorun sürerse sıradaki şüpheli `router.refresh()` sonrası
> yeniden çizim.

> **ARAMA DÜZELTMESİ — 31 Temmuz 2026, telefondan gelen geri bildirim.**
> Kullanıcı canlıda iki sorun bildirdi: (a) listede **hiç Open Library
> sonucu yok**, (b) alakasız kitaplar üstte (Notos Öykü, ULAK 5. Sayı,
> Bakî Divanı Sözlüğü). İkisinin de sebebi ölçüldü ve düzeltildi.
>
> **(a) Open Library kesiliyordu.** Google iki bacaktan 40 kayıt döndürüyor,
> hepsi Türkçe olduğu için "Türkçe önce" sıralamasında başa geçiyor ve Open
> Library'nin 2 kaydı **40–41. sıraya** düşüyordu; `slice(0, 20)` onları
> tamamen siliyordu. Çözüm: `OPENLIBRARY_SLOTS = 5` — Open Library'ye
> **ayrılmış kontenjan**, Google'ın hacminden bağımsız.
>
> **(b) Alaka süzgeci eklendi.** Sorgunun anlamlı sözcüklerinden (≥3 harf,
> aksan katlanmış) en az biri başlık/yazar/seri içinde geçmiyorsa kayıt
> eleniyor. **Yalnızca Google bacaklarına uygulanıyor** — Open Library
> bilerek süzülmüyor, çünkü Türkçe adla arandığında eseri orijinal adıyla
> döndürüyor ("bülbülü öldürmek" → "To Kill a Mockingbird") ve süzgeç tam
> da görmek istediğimiz kaydı elerdi.
>
> **Google'a tek yeniden deneme (429/5xx, 250ms).** Ölçümde `503`'ler çok
> sık: bir turda "dune frank herbert" sonucundan Dune'un kendisi tamamen
> kayboldu çünkü iki Google bacağı da o an düşmüştü. Kalıcı hatalarda
> (`400` vb.) tekrar denenmiyor.
>
> **Open Library dil alanı düzeltildi.** Kayıt bir **esere** ait, `language`
> bütün baskıların dillerini taşıyor ve ilk eleman rastgele — "To Kill a
> Mockingbird" için `kor` dönüyor ve arayüzde İngilizce esere **KOR** rozeti
> takılıyordu. Artık tek soruya cevap veriliyor: Türkçe baskısı var mı →
> `tr`, yoksa `null`.
>
> **Ölçüm sonrası:** "bülbülü öldürmek" 42 karışık kayıt yerine **6 temiz
> sonuç**, hepsi Harper Lee baskısı, Open Library'nin kapaklı kaydı 5.
> sırada ve TR rozetli. "bulbulu oldurmek" (aksansız) 4 sonuç. "dune frank
> herbert" 20 sonuç, Dune'un kendisi listede.

> **ARAMA ÇİFT KAYNAĞA GEÇTİ + CANLI DROPDOWN — 31 Temmuz 2026 (kullanıcı
> isteği).**
>
> **1) Open Library artık her aramada devrede.** Eskiden yalnızca Google
> sıfır sonuç verince sorulurdu; kullanıcı "Bülbülü Öldürmek"in Google'da
> kapaksız, Open Library'de kapaklı geldiğini bildirdi (doğrulandı:
> `cover_i` 14351077, 213 baskı). Üç bacak (`langRestrict=tr`, Google genel,
> Open Library) `allSettled` ile birlikte koşuyor, hepsi tek listede
> gösteriliyor. Tekilleştirme **kaynak içinde**, kaynaklar arasında DEĞİL:
> aynı eserin iki kaydı bilerek yan yana duruyor, küratör kapaklı olanı
> seçsin diye.
>
> **2) PUANLA SIRALAMA DENENDİ VE GERİ ALINDI — tekrar denemeyin.** Kapak +
> popülerlik puanına göre sıralama alakayı yok etti: "bülbülü öldürmek"te
> Harper Lee ilk sekizden düştü, yerine kapağı olan alakasız dergiler
> (İçtiğim Deniz, Notos Öykü) çıktı; "dune frank herbert"te Dune kaybolup
> Children of Dune tepeye oturdu. Kaynakların alaka sırası bizim
> üretebileceğimiz her puandan iyi. **Tek sıralama kuralı: Türkçe baskılar
> başa** (`sort` kararlı, grup içi sıra korunur). `popularity` alanı duruyor
> ama **yalnızca arayüzde bilgi** ("213 baskı") — sıralamada kullanılmıyor.
>
> **3) Canlı arama dropdown'u.** Enter/Ara gerekmiyor: 350ms debounce, önceki
> istek `AbortController` ile iptal (Google yanıtları 550–2900ms arasında
> değişiyor, iptal olmazsa geç dönen eski yanıt listeyi yanlış sonuçla
> donduruyor), `MIN_QUERY = 4`. Satırda kapak + ad + yazar + yıl + sayfa +
> baskı sayısı, **kaynak rozeti (G / OL)** ve dil rozeti. Klavye: ↑/↓ (başa
> sarar), Enter, Esc; dışarı tıklayınca kapanır. `role="combobox"` +
> `aria-activedescendant`.
>
> **ÖNEK ARAMASI YAPILAMIYOR — kullanıcı istedi, ölçüldü, mümkün değil.**
> Google Books bir önek motoru değil: "bül" → koro düzenlemeleri,
> "bülbülü öl" → Divan şiiri, "tutunamay" → Akkoyunlular tarihi, "dune" →
> The Science of Dune. Anlamlı sonuç ancak sözcük tamamlanınca geliyor.
> `MIN_QUERY = 4` bu yüzden var. **`unaccent`/`pg_trgm` bunu çözmez**:
> o araçlar kendi Postgres satırlarımızı arar, aranan kitaplar dışarıda.
> Gerçek "bül → Bülbülü Öldürmek" için Open Library dump'ının kendi
> veritabanımıza indirilmesi gerekir — ayrı ve büyük bir iş, yapılmadı.
> **Aksan toleransı zaten var:** "bulbulu oldurmek" Google'da doğru sonucu
> getiriyor (ölçüldü), ek iş gerekmedi.
>
> **4) Arşiv aramasına aksan katlaması.** `matchesSearch` düz `includes`
> yapıyordu, "bulbulu" yazınca "Bülbülü" bulunmuyordu. `foldTr` eklendi
> (`ı` elle `i`ye, kalan aksanlar NFD ile) ve arama **sözcük sözcük**
> yapılıyor: "herbert dune" de tutuyor, sıra önemli değil.
>
> **5) Salon raflarında silme.** Raflar `BookCard` kullanmadığı için küratör
> araçları oraya hiç inmiyordu; yanlış eklenen kitabı silmek için raf alt
> sayfasına gitmek gerekiyordu (kullanıcı bildirdi). `.volume` altına
> `CuratorCardTools` eklendi — 12 ciltte de doğrulandı.
>
> **Doğrulama (lokal, geçici yamalarla):** kısa sorguda istek atılmıyor, tam
> sorguda liste açılıyor, Open Library kaydı "213 baskı + OL" rozetiyle
> görünüyor, arşivdeki kitap "Arşivde" ile kilitli; klavye gezinmesi başa
> sarıyor; Esc kapatıyor. Aksan: "kurk mantolu" ve "suc ceza" buluyor.
> Mobil 375px: kutu 309px/44px, satırlar 63px, taşma yok.
> **Yakalanan gerileme:** kutu `.searchForm`dan çıkınca genişlik kuralı
> düşmüş ve 177px'e inmişti; `.searchBox input` eklendi.
> Üç geçici yama (arşiv fixture'ı, `isAdmin` zorlaması, `searchBooks` sahte
> verisi) **commit öncesi geri alındı.**
> backend `nest build` + `eslint src/books` + 11 test temiz; frontend `tsc` +
> `eslint` + `next build` temiz.
>
> **AÇIK:** küratör araması canlıda gerçek girişle hâlâ denenmedi (lokalden
> admin API'sine bağlanılamıyor). Ayrıca Google bu oturumda sık sık `503`
> verdi; `allSettled` sayesinde arama ölmüyor ama tek istek için **yeniden
> deneme yok** — eklenebilir.

> **TÜR SÜZGECİ SABİT LİSTEYE GEÇTİ — 31 Temmuz 2026 (kullanıcı isteği).**
> Sol rayda **Tür artık Dönem'in altında ve her zaman çizili.** Eskiden yalnızca
> arşivden türetiliyordu ve arşivde tür yoksa hiç görünmüyordu — canlıdaki iki
> kitabın da `genres` alanı boş olduğu için kullanıcı süzgeci hiç göremiyordu.
> Liste artık `frontend/lib/book/genres.ts` içinde **20 tür**, ödül
> listelerindeki kararın aynısı (kaynak vermiyorsa liste kodda durur).
> Süzgeç tür ADIYLA değil **anahtarıyla** çalışıyor (`scifi`), görünen ad
> `book.genreName.<key>` çevirisinden geliyor.
>
> **Eşleştirme takma adlı, çünkü `genres` serbest metin:** ilk değeri Google
> dolduruyor ve BISAC etiketi geliyor ("Fiction / Science Fiction / General"),
> küratör ise Türkçe yazıyor ("Bilimkurgu"). Her tür bir anahtar kelime kümesi
> taşıyor.
>
> **Arama KELİME BAŞINDAN yapılıyor — bu ölçümle bulundu, değiştirmeyin:**
> - düz alt dize: "din" ifadesi "aydınlanma"nın ortasında bulunuyordu,
> - tam kelime: Türkçe eklemeli olduğu için "Klasikler"→`klasik`,
>   "Türk Edebiyatı"→`türk edebiyat` eşleşmeleri düşüyordu (Türk Edebiyatı
>   sayacının sıfırlandığı lokalde görüldü),
> - kelime başı ikisini de çözüyor. İç içe geçen türler için ayrıca `not`
>   alanı var: "bilim" ifadesi "bilimkurgu"nun, "science" ise "science
>   fiction"ın başında da duruyor — o yüzden bilimkurgu kitapları "Bilim"
>   sayılıyordu (ölçümde yakalandı).
>
> Sayacı sıfır olan tür de listede kalır ama **sayı yazılmaz**; sıfırlar sütunu
> gürültüye boğuyordu. `\b` kullanılmıyor: JavaScript'te yalnızca ASCII harf
> sayar, "şiir"/"tıp" kenarını yanlış bulur.
>
> **Doğrulama (lokal, 10 kitaplık fixture):** sayaçlar birebir doğru
> (Bilimkurgu 4, Klasik 2, Türk Edebiyatı 2, Roman 2, Korku 2, Distopya 1),
> Bilimkurgu'ya tıklayınca 12 cilt → 4 cilt. Mobil 375px: taşma yok, özet ve
> her satır 44px dokunma alanı. `tsc` + `eslint` + `next build` temiz.

> **FAZ B BAŞLADI — 31 Temmuz 2026. İlk parça: ÖDÜLLER (bitti).**
>
> Dokuz ödül, **212 kayıt**: Nobel · Pulitzer · Booker · Hugo · Nebula ·
> World Fantasy · Locus · Bram Stoker · Edgar.
> `backend/src/books/data/awards.data.ts` (kod içi küratörlü liste, kullanıcı
> kararı), `awards.service.ts`, `GET /books/awards` + `/books/awards/:key`,
> `frontend/components/book/AwardHall.tsx` + `category/kitap/oduller[/[key]]`.
> Salon lobisine "Ödüller" kartı, arşivin sol rayına bağlantı eklendi.
>
> **Nobel ayrı modellendi:** ödül yazara veriliyor, kitaba değil
> (`grantedTo: 'AUTHOR'`). Kartın başlığı yazar, altında temsilci eser.
>
> **MİMARİ — sayfa dış isteği BEKLEMEZ, bu bilinçli.** 212 kitabı Google'da
> eşleştirmek yüzlerce istek; açılışta yapılsaydı sayfa onlarca saniye sürer
> ve kotayı bir seferde yerdi. Uç `ExternalCache`de ne varsa onu döner, her
> istek arkada **6** kayıt doldurur, ikinci açılışta kapaklar yerindedir.
> Eşleşme **kitap başına** cache'lenir (ödül başına değil): Ancillary Justice
> hem Hugo hem Nebula'da, tek eşleşme iki rafı doldurur. TTL 90 gün.
>
> **Ölçümle bulunan üç şey (hepsi düzeltildi):**
> 1. Sorgu Türkçe addan kuruluyordu → isabet 30/36. `titleTr` yanlışsa Google
>    sıfır sonuç dönüyor ve kitap 90 gün "eşleşmedi" kalıyordu. Sorgu
>    **orijinal addan** kurulup Türkçe yedeğe alındı → **33/36**.
> 2. Geçici Google hatası kalıcı hasara dönüşüyordu: iki kitap bir turda
>    eşleşip sonrakinde ıskalandı, sorgular aynıyken. Artık "sonuç geldi ama
>    tutmadı" (yazılır) ile "hiç sonuç gelmedi" (yazılmaz) ayrı.
> 3. **`titleTr` doğrulanamıyor ve artık EKRANDA GÖSTERİLMİYOR.** 112 Türkçe
>    ad Google'a denendi, 61'i "yok" döndü — oysa çoğu gerçek çeviri ("İngiliz
>    Hasta", "Küçük Şeylerin Tanrısı", "Bay Mercedes"). Google Türkçe
>    baskıların çoğunu indekslemiyor, yani bu adların doğruluğu **ölçülemez**.
>    Elle derlenmiş doğrulanamaz bir adı künye diye göstermek uydurma veri
>    olurdu. `titleTr` artık yalnızca **arama ipucu**; ekranda görünen Türkçe
>    ad eşleşen gerçek cildin adı. Bu kuralı bozmayın.
>
> **Kapaksız cilt boş kare DEĞİL**, adı kapağın yerini tutuyor
> (`BookCard.Cover` ile aynı karar) — ödül rafında ilk açılışta ciltlerin
> çoğu kapaksız gelir, boş kareler duvarı okunmaz olurdu. Kapaklarda
> `unoptimized` şart: `next.config.ts` yalnızca kendi sunucumuzu ve TMDB'yi
> tanıyor, Google/Open Library host'ları kayıtlı değil — lokalde 500 ile
> yakalandı.
>
> **Doğrulama:** backend `nest build` + `npx eslint src/books` temiz,
> **11 birim testi** geçiyor (`awards.service.spec.ts` — eşleştirme mantığı ve
> liste tutarlılığı). Frontend `tsc` + `eslint` + `next build` temiz. Görünüm
> lokalde gerçek ödül verisi ve gerçek kapaklarla fixture üstünden denendi,
> **fixture commit'ten önce geri alındı.** Ölçüm (375px): ızgara 3 kolon, kart
> 109px (film salonuyla birebir), yatay taşma yok, dokunma alanı 198–214px;
> 1600px'te 7 kolon.
>
> **Uçlar canlıda DENENMEDİ:** bu makinede veritabanı yok, gerçek yanıt ancak
> deploy sonrası görülecek. İlk açılışta kapakların çoğu boş gelecek, bu
> beklenen — birkaç kez yenileyince dolar.
>
> **FAZ B'de sırada:** Keşfet rafları (Goodreads Top 250, NYT, Türk Edebiyatı,
> Modern/Antik Klasikler — ödüllerle aynı makineyi kullanacak), kitap
> sayfasında spoilersız/spoiler inceleme + karakterler + farklı baskılar,
> yazar paneline biyografi/tüm eserler, kitap kanadının `pulse` uçlarına
> eklenmesi. Ayrıca **haftalık ısıtma cron'u** (`awards.service.warm()` hazır,
> çağıran cron henüz yok — `anime.cron.ts` deseni izlenecek).

> **OTURUM NOTU — 31 Temmuz 2026, iş yeri makinesi. Kitap kanadı Faz A
> KAPANDI.**
>
> **Google Books anahtarı eklendi ve doğrulandı.** Kullanıcı Coolify'da
> backend'e `GOOGLE_BOOKS_API_KEY` tanımladı. Doğrulama: anahtarsız istek
> `429`, anahtarlı istek `200`. `langRestrict=tr` + "bülbülü öldürmek harper
> lee" aramasında **ilk iki sonuç Türkçe baskılar** — yani `b34a62a`'nın
> getirdiği Türkçe-önce sıralaması gerçekten çalışıyor. Aşağıdaki eski
> "anahtar gerekiyor / Open Library'ye düşülüyor" uyarısı **artık geçersiz**,
> güncellendi.
>
> **`Promise.all` → `Promise.allSettled` (arama dayanıklılığı).** Test
> sırasında genel aramadan bir kez `503` geldi. Eski kodda iki bacak tek
> `try` içinde `Promise.all` ile çalıştığı için genel bacağın anlık hatası
> **Türkçe bacağı da çöpe atıyor** ve arama Open Library'ye düşüyordu — yani
> anahtar tanımlıyken bile küratör ara sıra Türkçe baskıyı hiç göremiyordu.
> Artık ayakta kalan bacak kullanılıyor, düşen bacak yalnızca loglanıyor.
>
> **Mobil düzeltmesi (`f7eb57c`).** Kitap salonu `4f5b73f` sonrasında
> yazıldığı için afiş ızgaralarının mobil kuralını almamıştı: telefonda rafa
> **iki cilt** sığıyor, sağda ~95px boşluk kalıyordu. `.volume` tabanda
> `calc((100% - 2*gap)/3)`, `.grid` tabanda `repeat(3, minmax(0,1fr))`;
> 640px üstünde ikisi de eski ölçüsüne dönüyor. Ölçüm (375px): kart 98px,
> satır başına 3 cilt, yatay taşma yok, dokunma alanı 166–190px. 1600px'te
> salon 116px ve raf sayfası 6 kolon — masaüstü değişmedi.
>
> **Görünüm 10 kitapla lokalde denendi (canlı veritabanına DOKUNULMADI).**
> `getBookArchive` geçici olarak bir fixture'a bağlandı, fixture gerçek Google
> Books künyeleriyle üretildi (kapaklar tek tek indirilip doğrulandı: 5–26 KB,
> hiçbiri 1269 baytlık sahte kapak değil). Raflar, cilt boyu farkı, raf
> tahtası, seriler, yazar paneli, sağ ray istatistikleri (2.233 sayfa, 8.8
> ortalama, %17 hedef halkası), günün alıntısı ve boş raf metinleri doğru
> çalışıyor. Puan yıldızları da doğru ölçekleniyor (8.5 → dört dolu + yarım).
> **Fixture commit'ten önce geri alındı**, `frontend/lib/api/books.ts` el
> değmemiş hâlinde.
>
> **HÂLÂ DENENMEDİ:** küratör modunda **gerçek girişle** kitap ekleme, elle
> kapak yükleme ve "Boş alanları tazele". Bunlar admin jetonu gerektiriyor;
> ajan parolayla giriş yapmıyor, kullanıcının kendisinin yapması gerek.
>
> **Doğrulama:** backend `prisma validate` + `prisma generate` + `nest build`
> temiz, `npx eslint src/books` temiz (fix'siz); frontend `tsc --noEmit` +
> `eslint` + `next build` temiz.
>
> **NOT — bu makinede `src/generated/prisma` yoktu**, `nest build` 30 hatayla
> düşüyordu. `npx prisma generate` çözüyor; yeni makinede ilk iş bu.

> **DEVİR NOTU — 30 Temmuz 2026 akşamı, ev makinesi. İŞ YERİNDEN DEVAM
> EDİLECEK: ilk iş `git pull`.** Çalışma dizini temiz, her şey `origin/main`de.
> Bu oturumda altı push gitti: `a011627` kitap Faz A → `c34b696` arama Open
> Library yedeği → `db31c5e` durum notu → `1f68799` raflar alt alta + süzgeç
> sadeleşmesi → `b34a62a` Türkçe baskı önceliği → `60e4d82` elle kapak yolu.
>
> **İŞ YERİNDE İLK YAPILACAKLAR (kod yazmadan önce, canlı doğrulama):**
> 1. ~~`/dark-stories/category/kitap/arsiv` → küratör modu → **"bülbülü
>    öldürmek harper lee"** ara.~~ **31 Temmuz: kaynak tarafı doğrulandı** —
>    anahtarla Türkçe baskılar aramada başa geliyor. Geriye yalnızca arayüzde
>    **TR rozetinin** göründüğünü gözle teyit etmek kaldı.
> 2. Arşivdeki iki kitabın (Bülbülü Öldürmek, Hücrenin Şarkısı) sayfasını aç →
>    küratör modu → künye formundaki **"Kapak adresi"** kutusuna adres yapıştır
>    ya da **"Ya da kapak yükle"** ile dosya yükle → Kaydet. Kapağın hem
>    kitaplık rafında hem sağ rayda çıktığını doğrula.
> 3. Aynı iki kitapta **"Boş alanları tazele"**ye bas: yeni ISBN zinciri
>    (`60e4d82`) ilk yayım yılını ve orijinal adı doldurabilir. Kapak
>    muhtemelen yine gelmez — o iki baskının kapağı hiçbir kaynakta yok.
> 4. Birkaç kitap daha eklendikten sonra rafların gerçek hâline bak: raf
>    tahtasının kalınlığı, cilt boy farkı, kapak genişliği. Ayar gerekirse
>    `frontend/components/book/BookHall.module.css` içinde `.spine` yükseklik
>    kuralları ve `.plank`.
> 5. Sol raydaki **Tür** ve **Dil** açılır bölümleri kitap eklendikçe dolar
>    (arşivden türetiliyor) — boşken hiç çizilmiyor, bu beklenen davranış.
>
> **KAPAK MESELESİ — kapanmış bir tartışma, tekrar açılmasın.** Türkçe basılı
> çevirilerin çoğunun kapağı **hiçbir kaynakta yok**: Google Books o ciltler
> için `imageLinks` döndürmüyor, `books.google.com/books/content` ucu ise 200
> dönüp 1269 baytlık "kapak yok" görselini veriyor (iki farklı kitapta birebir
> aynı bayt boyutu — placeholder olduğunun kanıtı). Open Library'de de Türkçe
> ISBN'ler çoğunlukla kayıtlı değil (9786051983127 → 404). Bu yüzden `content`
> ucu **bilerek kullanılmıyor**: kullanılsaydı arşiv boş çerçeve yerine aynı
> gri lekeyle dolar ve küratör hangi kitaba elle kapak koyacağını göremezdi.
> Çözüm elle kapak (adres kutusu + yükleme, `60e4d82`).
>
> **Kitap kanadında bu turda düzeltilen üç şey:**
> 1. `country=TR` parametresi Google isteklerinden **kaldırıldı**. Dil ipucu
>    sanılmıştı; oysa Play Kitaplar **mağaza uygunluğu** demek ve TR
>    mağazasında olmayan Türkçe basılı çevirileri eliyordu — "Bülbülü
>    Öldürmek" aranınca yalnızca İngilizcesinin gelmesinin sebebi buydu.
> 2. Arama sonucu artık **tamamı üzerinde** Türkçe-önce sıralanıyor.
>    `langRestrict=tr` bazı çevirileri hiç bulamıyor (Google o cildin dilini
>    işaretlememiş oluyor) ama aynı cilt genel aramanın alt sıralarında
>    duruyor; eski hâlde (iki listeyi arka arkaya ekleme) oradan yukarı
>    çıkamıyordu. `sort` kararlı olduğu için grup içi alaka sırası bozulmuyor.
> 3. Open Library zinciri iki adımlı oldu: Türkçe adla eser bulunamazsa
>    ISBN'den **baskı** kaydına gidiliyor, `translation_of` ile orijinal ad
>    öğreniliyor ve eser araması onunla tekrarlanıyor. İlk yayım yılının boş
>    kalmasının sebebi de buydu.
>
> **Arayüz bu turda baştan düzenlendi (kullanıcı "sayfa çok amatör görünüyor"
> dedi):** ortadaki durum **sekmeleri kaldırıldı**, yerine film salonundaki
> gibi **alt alta raflar** geldi — ama kitaplık hissiyatıyla: bir raftaki
> ciltler ortak zemine basıyor, boyları birbirini tutmuyor (158–190px,
> `nth-child` ile sıradan türetiliyor — rastgele DEĞİL ki sunucuyla istemci
> aynı boyu çizsin ve açılışta kitaplar zıplamasın), kapak sol kenarında cilt
> sırtı çizgisi var ve altlarında raf tahtası (`.plank`) duruyor. Salonun
> imzası bu (film salonununki 35mm şerit). Sol raydan **puan** ve **sayfa
> sayısı** süzgeçleri kaldırıldı (puan rozetleri başlığın üstüne taşıyordu),
> yıl aralığı kutuları tek bir **Dönem** seçkisine dönüştü — kitap ölçeğinde:
> yakın onluklar tek tek, sonra 1900–1949, 19. yüzyıl, Daha eski. Tür ve dil
> artık kapalı açılır bölümler (`<details>`). Raf sayfaları ayrı bileşen
> değil: `BookHall`a `shelf` verilince bütün rafları dizmek yerine o rafın
> tamamını ızgara olarak çiziyor.
>
> **Lokal doğrulama yöntemi (bu turda kullanıldı, işe yaradı):**
> `getBookArchive`in catch dalına geçici `DEV_FIXTURE` konup dev sunucu
> açıldı; `read_page`/`javascript_tool` ile ölçüldü (üç sütun 252/949/312,
> yatay taşma yok, mobilde tek sütun, 44px altı dokunma alanı yok, cilt
> boyları 160–190) ve **commit öncesi `git checkout` ile geri alındı.**
> Ekran görüntüsü alınamıyor (tarayıcı paneli görünmüyor), ölçüm metin
> araçlarıyla yapılıyor.
>
> **FAZ B (sıradaki iş — henüz başlanmadı):** ödüller (Nobel/Pulitzer/Hugo/
> Nebula/Booker/Locus/World Fantasy/Bram Stoker/Edgar — kodda yıl+kitap
> listesi, açılışta Google Books ile eşleşip cache'lenecek), Keşfet rafları
> (Goodreads Top 250, NYT, Türk Edebiyatı, Modern/Antik Klasikler), kitap
> sayfasında spoilersız/spoiler inceleme + karakterler + farklı baskılar,
> yazar paneline biyografi/tüm eserler. Kullanıcının ayrıca beğendiği
> fikirler: "Bu akşam ne okusam?", seri boşluk uyarısı ("Zaman Çarkı'nın 7.
> cildi arşivde yok"), çevirisi çıkanı haber verme (çevrilmemiş ciltler için
> ayda bir Türkçe baskı taraması).
>
> **OTURUM NOTU — 30 Temmuz 2026 (3). Salon 05 · Kitap arşivi — FAZ A yazıldı.**
> Ayrıca anime sayfasına **küratör modu anahtarı** eklendi: künye formu ve
> bölüm ızgarasındaki işaretleme artık admin olmak için değil, **modu açmak**
> için gerekiyor (film/dizi sayfalarındaki desen; kullanıcı geri bildirimi —
> sayfa okuma ekranı olarak açılmalı). `AnimeDetail` içindeki `isAdmin`
> dallarının yerini `editing = isAdmin && curating` aldı.
>
> **Kitap kanadında alınan kararlar (kullanıcıya soruldu):**
> 1. Ödül ve keşfet listeleri **kod içinde küratörlü liste** olacak — Google
>    Books/Open Library bunların hiçbirini vermiyor. **FAZ B.**
> 2. Çeviri **cilt bazlı**: `BookTranslation` enum'u (TRANSLATED /
>    UNTRANSLATED / IN_PROGRESS / ORIGINAL). Çevrilmemiş cilt arşivde durur
>    ("seri eksik görünmesin"), okuma sayılarına girmez, seri kartında
>    "5 kitaptan 3'ü Türkçe" satırını besler.
> 3. İki faz: **Faz A bu oturumda** (veri modeli + kaynak servisi + küratör +
>    tam genişlikte arşiv + kitap sayfası), Faz B sonra.
> 4. Ekstralardan seçilenler: sayfa ilerlemesi, yıllık okuma hedefi, alıntı
>    defteri. (Okuma günlüğü/zaman şeridi seçilmedi.)
>
> **Kitap kanadının film/dizi/animeden yapısal farkı (bilinçli):** orada künye
> tamamen `externalData` anlık görüntüsünden okunur, **burada okunmaz.**
> Kullanıcı kararı: "Google Books sadece ilk veriyi doldursun, sonrasını kendi
> tablona ekle." Gösterilen bütün alanlar (`title`, `authors`, `translator`,
> `publisher`, `pageCount`, `genres`, `seriesName`…) `BookEntry`in kendi
> sütunları; dış kaynak yalnızca kayıt açılırken tohumluyor ve `refresh`
> **yalnızca boş alanları** dolduruyor — elle yazılan Türkçe ad/çevirmen asla
> ezilmiyor. Sebebi kitaba özgü: Google'ın Türkçe künyesi eksik, çevirmen çoğu
> baskıda hiç yok, sayfa sayısı baskıya göre değişiyor.
>
> **Backend:** `BookEntry` + `BookQuote` + `ReadingGoal` modelleri, enum'lar
> `BookStatus`/`BookTranslation`, migration elle yazıldı
> (`20260730200000_add_book_entry`, DB'siz makinede `prisma validate` +
> `generate` ile doğrulandı). `src/books/*`: `google-books.service`
> (Google Books ana kaynak → `langRestrict=tr` ile önce Türkçe baskı; Open
> Library `enrich` ile ilk yayım yılı/seri/orijinal ad; ikisi de
> `ExternalCache`e yazılıyor, kural 4/14), `books.service`, iki controller,
> beş DTO. Uçlar: `GET /books`, `/books/showcase`, `/books/:slug`;
> `GET|POST|PATCH|DELETE /admin/books*`, `PATCH /admin/books/:id/refresh`,
> `POST /admin/books/:id/quotes`, `PATCH|DELETE /admin/books/quotes/:id`,
> `PUT /admin/books/goal`.
>
> **Frontend:** `components/book/*` (BookHall/BookCard/BookDetail/BookCurator)
> + `lib/book/{filters,shelves}` + `lib/api/books.ts` + rotalar
> `category/kitap/arsiv`, `arsiv/[shelf]`, `[slug]`. Düzen film salonundan
> **ayrıldı** (kullanıcı isteği "her şeyi ortada birleştirmeyelim, tüm alanı
> doldursun"): sabit tek sütun yerine **üç sütun** — sol ray süzgeç (tür,
> puan, yıl aralığı, sayfa kovaları, dil, çeviri), orta durum sekmeleri +
> kapak ızgarası + seriler + yazar paneli, sağ ray istatistikler + hedef
> halkası (`conic-gradient`, hex yok) + son eklenenler + günün alıntısı.
> Raf sayfaları ayrı bileşen DEĞİL: aynı salon `initialShelf` ile açılıyor.
> Kitap lobisinde "Kitap Arşivi" kartı artık gerçek bağlantı; `CODE_HALLS`
> kitap `soon: false` ve `ARCHIVE_SECTIONS`e `kitap: 1` eklendi (kapı altında
> "yakında" yerine evren sayısı).
>
> **FAZ B (yapılacak):** ödüller (Nobel/Pulitzer/Hugo/Nebula/Booker/Locus/
> World Fantasy/Bram Stoker/Edgar — kodda yıl+kitap listesi, açılışta Google
> Books ile eşleşip cache'lenecek), Keşfet rafları (Goodreads Top 250, NYT,
> Türk Edebiyatı, Modern/Antik Klasikler), kitap sayfasında spoilersız/spoiler
> inceleme + karakterler + farklı baskılar, yazar paneline biyografi/tüm
> eserler. Ayrıca kitap kanadının `pulse` uçlarına eklenmesi (kitap
> `UniverseCategory` kaydı olmadığı için "Nexus'u Keşfet"te sayaç kod
> tarafından geliyor).
>
> **DİKKAT — `npm run lint` backend'de `--fix` içeriyor ve zararlı.**
> Bu oturumda çalıştırıldığında `@typescript-eslint/no-unnecessary-type-assertion`
> kuralı, dokunulmamış on bir dosyadan (`tmdb-tv.service`, `movies.service`,
> `shows.service`, `anime.service`…) TypeScript'in **gerçekten gerektirdiği**
> `as unknown as object` dönüşümlerini sildi ve derleme 16 hatayla kırıldı;
> hepsi `git checkout` ile geri alındı. Kural ile derleyici bu repoda çelişiyor.
> Backend'de lint çalıştırılacaksa `npx eslint <yol>` (fix'siz) kullanılmalı.
> Kitap modülünde bu çelişkiye hiç girilmedi: `BookShowcaseCover` bilinçli
> olarak `interface` değil **tür takma adı** — örtük index imzası sayesinde
> Prisma'nın `InputJsonValue`ına dönüşümsüz geçiyor.
>
> **GOOGLE BOOKS ANAHTARI — EKLENDİ, mesele kapandı (31 Temmuz 2026).**
> Anahtar Coolify'da backend'e `GOOGLE_BOOKS_API_KEY` olarak tanımlı ve
> doğrulandı (anahtarsız `429`, anahtarlı `200`, Türkçe baskılar aramada
> başta). Geçmişi: anahtarsız istekler Google'ın anonim kotasına takılıp
> **429** dönüyordu, bu yüzden `c34b696` ile arama Open Library'ye düşüyor —
> o yedek **yerinde duruyor ve durmalı**, ama artık normal yol Google.
> **Türkçe baskı önceliği yalnızca Google ile geliyor**; Open Library'de
> Türkçe baskıların çoğu kayıtlı değil, o yüzden anahtar silinirse adlar
> yeniden İngilizceye döner.
>
> **Doğrulama:** backend `prisma validate` + `generate` + `nest build` temiz,
> `npx eslint src/books` temiz; frontend `tsc --noEmit` + `eslint` + `next
> build` temiz. **Canlıda doğrulandı** (`a011627` + `c34b696`): `GET /books`
> 200 (migration çalıştı, tablolar var), `/books/showcase` 200 ve dolu,
> `/dark-stories/category/kitap`, `.../kitap/arsiv`, `.../arsiv/okuduklarim`
> üçü de 200; arşiv sayfasının başlığı ve sol süzgeç rayı HTML'de görünüyor.
> **Gerçek girişle (küratör modu) denenmedi.**
>
> **Kullanıcının canlıda bakacakları:** (1) kapı duvarında Kitap kapısının
> altında "yakında" yerine evren sayısı, (2) küratör modunda kitap araması —
> anahtar yokken Open Library sonuçları geliyor, adlar İngilizce olacak,
> (3) kitap eklendikten sonra sekme sayaçları ve sağ ray istatistikleri,
> (4) anime sayfasında küratör modu kapalıyken künye formunun görünmemesi.

> **OTURUM NOTU — 30 Temmuz 2026 (2).** **Salon 05 · Kitap kapısı açıldı.**
> Salon sırası artık Film·Dizi·Spor·Anime·**Kitap**·Kadim Dünyalar, Temürkan
> mühürlü baş köşe olarak sonda (07'ye kendiliğinden kaydı — numarası
> "kategori sayısı + 1" formülünden geliyor). Kitap kategorisinin
> veritabanında kaydı YOK; `lib/halls.ts` içine **kod tanımlı salon**
> (`CODE_HALLS` + `mergeCodeHalls`) kavramı eklendi: kapı duvarı ve Nexus
> kapıları veritabanı kategorileriyle bu listeyi birleştiriyor, kategori
> sonradan panelden açılırsa veritabanı kazanıyor ve kapı iki kez çizilmiyor.
> `hallNumber` de merge-aware yapıldı — yoksa Kitap numarasız kalıyordu
> (lokalde "Salon · Kitap" hatası yakalandı ve düzeltildi).
> Kapı görseli **elle çizilmiş SVG**: `public/halls/kitap.svg` (loş kütüphane
> duvarı, dört raf, yaldızlı sırtlar). Palet: `--door-kitap-a/b` ex-libris
> moru — beş kanadın sarı/turkuaz/kırmızı/turuncu/altın aileleri doluydu, mor
> boştaydı. `[data-category="kitap"]` derisi mor yüzey + yaldız accent (anime
> derisi mor accent taşıdığı için burada accent mor DEĞİL). Kapı arkasında
> gerçek bir sayfa var: `category/kitap` statik lobi ("Kitap Arşivi" ve
> "Okuma Notları" bölümleri "Yakında" rozetiyle, tıklanamaz) — statik yol
> `[categorySlug]`ten önce eşleştiği için kategori kaydı olmadan da açılıyor.
> Yedi kapı sıkışmasın diye orta kolon genişletildi (82rem→94rem, küratör payı
> %40→%33) ve kapı asimetri döngüsü 5n'den 7n'ye çekildi + 64px taban genişlik.
> Lokalde uçtan uca doğrulandı (kapı duvarı 01–07 doğru sırada, Nexus kapıları
> aynı, film/dizi/anime salon numaraları 01/02/04 bozulmadı, SVG 200,
> lobi 200, konsol temiz). **Kitap arşivinin kendisi (okuma ilerlemesi, dış
> API) HENÜZ YAPILMADI — kullanıcı kapsamı ayrıca kararlaştıracak.**

> **30 TEMMUZ — ikinci push: dizi kanadına "İzliyorum" + sezon/bölüm
> ilerlemesi.** Kullanıcının geri bildirimi: dizide filmden farklı olarak
> *devam eden* yapımlar var, hem ayrı bir durum hem de animedeki gibi bölüm
> takibi gerekiyor. Eklenenler: `ShowStatus`a **WATCHING** (migration
> `ALTER TYPE ... ADD VALUE BEFORE 'WATCHED'`), `AnimePart`ın karşılığı
> **`ShowSeason`** modeli (sezon başına `watchedEpisodes`/`isCompleted`/
> `episodeMarks`). Animeden tek yapısal fark: sezon zinciri **elle
> kurulmuyor** — TMDB künyesi `seasons` dizisini zaten veriyor, dizi arşive
> eklenince sezonlar kendiliğinden oluşuyor, künye tazelenince yeni sezon
> ekleniyor (ilerleme asla ezilmiyor, TMDB'den düşen sezon silinmiyor).
> Özel bölümler (TMDB sezon 0) alınmıyor. Yeni uçlar:
> `PATCH /admin/shows/seasons/:id` (delta ±1 + doğrudan atama + atlandı
> işareti), `POST /admin/shows/seasons/:id/complete-through`,
> `GET /shows/seasons/:id/episodes` (bölüm ızgarası, sezon açılınca iniyor).
> Durum kendiliğinden güncelleniyor: bütün sezonlar bitti **ve** dizi de
> bitti (`Ended`/`Canceled`) → "izledim"; sırada bekleyen dizide ilerleme
> başladı → "izliyorum". Arayüz: İzliyorum rafı (en üstte), kartlarda
> "S2 · 4/10" satırı + ilerleme çubuğu, dizi sayfasında sezon listesi
> (kaldığım sezon açık gelir) + tıklanabilir bölüm ızgarası, künye kartı
> "İzlenen Bölüm" artık gerçek sayaç toplamı. "Nexus'u Keşfet"te dizi
> kapısının satırı da anime gibi *şu an izlediğim dizinin adı* oldu.
> Backend+frontend build/lint/tsc temiz. **Canlıda gerçek girişle
> denenmedi.**
>
> **OTURUM NOTU — 30 Temmuz 2026.** **Salon 02 · Dizi arşivi** yazıldı —
> film salonunun bire bir aynısı, kaynak TMDB'nin tv uçları. Backend:
> `ShowEntry`/`ShowSuggestionDismissal` (migration elle yazıldı, DB'siz
> makinede `prisma generate` ile doğrulandı), `backend/src/shows/*`
> (tmdb-tv.service, service, controller, admin controller, dto'lar) —
> arama/keşif/trend/öneri sonuçlarında **Animasyon + Japonya kökenli**
> kayıtlar otomatik elenir (anime salonuyla çakışmasın diye). Kore Dramaları
> bir durum değil rafın kendisi: TMDB `origin_country` "KR" olan her dizi
> otomatik olarak o rafta da görünür (favoriler gibi diğer raflarla kesişir).
> Salon girişi afişleri (`GET /shows/showcase`) anime lobisindeki desenle
> aynı — solda Game of Thrones, sağda Spartacus, TMDB'de aranıp cache'leniyor,
> yol koda gömülü değil. Frontend: `components/show/*` (ShowHall/ShowCard/
> ShowDetail/ShowBackdrop/ShowCurator/ShowLobby/ShowShelfPage), `lib/show/*`,
> `lib/api/shows.ts`, `app/.../category/dizi/*` rotaları, `[categorySlug]`
> sayfasına dizi dalı. Künye levhasında filmin bütçe/hâsılatının yerini
> sezon/bölüm sayısı ve yayın durumu aldı (TMDB'de dizide o ikisinin
> karşılığı yok). "Nexus'u Keşfet" pulse uç noktasına da dizi kapısı sayacı
> ve `DIZI` künye türü eklendi — dizi kapısı artık "0 evren" değil gerçek
> sayı gösterecek. Backend+frontend build/lint/tsc temiz. **Kullanıcı onayıyla
> push edildi, canlıda henüz gerçek girişle denenmedi** — bakılacaklar: dizi
> kapısı → salon → arşiv → dizi sayfası akışı, küratör modunda TMDB'de dizi
> arama/ekleme, Kore Dramaları rafının dolması, sol/sağ afişlerin görünmesi.
>
> **GÜN KAPANIŞI — 29 Temmuz 2026 gecesi, iş yeri makinesi.** Altı push gitti,
> hepsi canlıda doğrulandı: `7ece552` anime sekmeleri + sabit banner + dış
> bağlantılar → `8bb5960` film sayfası + "en üste git" + öneriler havuz kadar →
> `189f7a0` eski film künyeleri kendiliğinden tazelensin → `5e6de24` üç sütunlu
> film sayfası + tıklanabilir raflar + küratör kısayolları → `000fcf7` "Nexus'u
> Keşfet" baştan yazıldı (`GET /pulse`) → `720a5d7` film kapısı sayı düzeltmesi.
> Çalışma dizini temiz, bekleyen değişiklik yok.
>
> **Bu turda alınan çalışma tarzı kararı:** kullanıcı lokalde kontrol edemiyor,
> lokal görsel doğrulamaya token harcanmayacak — build/lint temizse push edilip
> canlıda `curl` ile doğrulanıyor, kullanıcıya nelere bakacağı söyleniyor.
>
> **Kullanıcının canlıda bakacakları (henüz gerçek girişle denenmedi):**
> 1. Anime ve film sayfalarındaki **küratör künyesi** — banner/RT/IMDb/fragman
>    adresi kaydediliyor mu, afiş üstündeki hızlı düğmeler (İzledim/İzleyeceğim/
>    Favori) çalışıyor mu.
> 2. "En üste git" düğmesinin yumuşak kaydırması (lokal panelde ölçülemedi).
> 3. Geniş ekranda (≥1500px) film sayfasının üç sütunu.
>
> **Açık öneri (kullanıcıya soruldu, yanıt bekliyor):** Dizi salonu tamamen boş
> (0 evren, kapı altında söyleyecek veri yok) — ya "yakında" rozetiyle
> işaretlenecek ya da film salonundaki desenle TMDB'li bir dizi arşivi kurulacak.
>
> **OTURUM NOTU — 28 Temmuz 2026, iş yeri makinesi.** Gün içinde dört push gitti,
> hepsi canlıda: `5621ec0` yazım atölyesi adım 1 → `752f773` metin↔lore bağı →
> `b312d96` film salonu → `ebf9a5f` film düzeltmeleri. Çalışma dizini temiz,
> bekleyen değişiklik yok. **Akşam evdeki makineden devam edilecek — önce `git pull`.**
>
> **Evde ilk iş (kod yazmadan önce, canlı doğrulama):**
> 1. `/admin/atolye/temurkan-efsaneleri` → bir karaktere takma ad ekle, bölümde
>    `@` yazıp öneriden bağla, imleci işaretin üstüne getir (sağda künye açılmalı),
>    adı bağlamadan yaz ("Bu Bölümde Geçenler"de soluk noktayla çıkmalı).
> 2. Bölümü yayınla → okuma ekranında işarete tıkla, künye paneli açılmalı.
> 3. `/admin/film` → TMDB araması sonuç veriyor mu (anahtarın doğru okunduğunun
>    tek gerçek testi). Şu an arşivde 1 film var: Yüzüklerin Efendisi (favori, 10).
> 4. Header'daki "Admin Paneli" bağlantısı panele götürüyor mu (eskiden 404'tü).
>
> **Evdeki makinede gerekenler:** `frontend/.env.local` içinde
> `NEXT_PUBLIC_API_URL=https://api.kuronexus.com` (gitignore'da, her makinede elle).
> Dev proxy sayesinde admin paneli lokalde de çalışır — ama **canlı veritabanına yazar**.
>
> **Bekleyen fikirler:** film lobisine yeni başlıklar (kullanıcı ekleyecek);
> arşiv için "Bu akşam ne izlesem?", şeritte zaman ayracı, ok tuşlarıyla sekme geçişi.
>
> **AKŞAM OTURUMU KAPANDI (28 Temmuz, ev makinesi).** Beş push gitti, hepsi
> canlıda ve doğrulandı: `2a836c3` küratör modu → `6fc01db` giriş düzeltmeleri →
> `c8a9698`+`c9eebbe` admin tespiti kök hatası → `307352e` salon duvarları +
> bölüm düzeni → `8e70809` öneriler/raf sayfaları/süzgeç → `296a62a` lobi
> afişleri + öneri davranışı. Çalışma dizini temiz.
>
> **Ev makinesi kısıtı (bu turda tekrar doğrulandı):** dev sunucusu (Node
> süreci) **dışarı çıkamıyor** — `api.kuronexus.com` PowerShell'den 200 dönerken
> Next'in fetch'i ECONNREFUSED alıyor, Google Fonts de "Retrying" veriyor.
> Sonuç: lokalde yalnızca **düzen/etkileşim** doğrulanabiliyor, o da geçici
> fikstürle (`getMovieArchive`in catch dalına konup commit öncesi geri alınıyor).
> Gerçek veriyle doğrulama push sonrası canlıda yapılıyor.
>
> **Yarın ilk iş:** aşağıdaki "Sıradaki Adım" listesinde 0g (öneriler rafı canlı
> kontrol) ve 0d (yazım atölyesi — HÂLÂ hiç doğrulanmadı).
>
> **29 TEMMUZ (iş yeri makinesi).** Kullanıcı canlıda önerileri kullandı, iki
> geri bildirim geldi: (1) ✕ ile elenen filmler yenileyince geri geliyordu,
> (2) öneriler dar kalıyordu (hep aynı gişe filmleri). İkisi de düzeltildi ve
> `5a555dc` ile canlıya çıktı — bkz. "Öneri havuzu genişledi + eleme kalıcı".
> Ardından **anime kanadı başladı**: plan konuşuldu, kararlar alındı (kart
> birimi = seri, ilerleme = sayaç + bölüm ızgarası, arc'lar elle) ve **Faz A**
> yazıldı — bkz. "Salon 04 · Anime — Faz A çekirdeği". **Canlıda doğrulanacak.**

> **3 AĞUSTOS — KULLANICININ CANLIDA BİLDİRDİĞİ ÜÇ HATA DÜZELTİLDİ.**
>
> **(1) Kaynağın adı sayfada geçmiyor artık.** Künye sayfası "Bu kitap
> arşivimde değil. Künye 1000Kitap'tan geliyor." diyor, üst şeritte de
> "KÜNYE · 1000KİTAP" yazıyordu. Kullanıcı kararı: **dışarıdan okuduğumuz
> belli olmasın.** Değişen yalnızca üç çeviri anahtarı (`book.source.eyebrow`,
> `book.source.notInArchive`, `book.person.notInArchive`) — kaynak adı
> **küratör ekranında duruyor**, orası admin ve adminin hangi kaynaktan
> geldiğini bilmesi gerekiyor.
>
> **(2) "Bu kitap arşivimde" bağı BAŞKA kitaba gidiyordu.** *Doğumgünü
> Partisi*nin (Pinter, 1965) künye sayfası arşivde olduğunu söyleyip
> *Zamandan Kaçış*a (Asimov) götürüyordu. **Kök sebep boş dize:** numarası
> olmayan eski baskılarda kaynak `isbn` alanını atlamak yerine boş dize
> gönderiyor, `??` bunu yakalamıyor ve boş dize kayda iniyor.
> `findArchivedBySource` de `isbn13 !== null` diye baktığı için iki boş dize
> alakasız iki kitabı aynı baskı sayıyordu; sıralama en son biteni öne aldığı
> için hep aynı yanlış kitaba çıkıyordu. **Üç yerden birden kapatıldı:**
> `blankToNull` (kaynak okuma, `bin-kitap.service`), boş ISBN'i eleyen
> karşılaştırma (`findArchivedBySource` — arşivde zaten boş dizeyle duran
> kayıtlar var, kalıcı savunma burada) ve `refresh`'te `??` yerine `||`
> (kayıt tazelendikçe kendini onarıyor). Testi yazıldı.
>
> **(3) Ödül kapakları artık kendi diskimizde.** Kullanıcı "sayfa yeniledikçe
> kapaklar yükleniyor, kapakları veritabanımıza indirelim" dedi. Eskiden
> cache'e kaynağın CDN adresi yazılıyordu ve raf her açılışta dışarıdan
> çekiyordu. Şimdi eşleşme yazılırken kapak `BookCoverService` ile
> `/uploads/books/` altına iniyor (arşivdeki kitaplarda zaten böyleydi).
> **Geriye dönük de çalışıyor:** cache'te 90 gündür dış adresle duran
> eşleşmeler `localizeCovers` kuyruğuna giriyor; `pending` sayacı bunları da
> sayıyor, yoksa arayüz "her şey hazır" deyip tazelemeyi durdururdu.
> Tur başına **12 kapak** (eşleştirmedeki 3 değil): kapak indirmek
> `1k-cdn.com`'den dosya çekmek, o adres hız sınırının arkasında değil —
> bu yüzden soğuma sırasında bile çalışıyor. `fetchedAt`e dokunulmuyor
> (`patchCache`): kapak indirmek eşleşmeyi tazelemek değil, yoksa 90 günlük
> TTL her turda baştan başlardı. Kalıcı inmeyen adres süreç ömrü boyunca
> hatırlanıyor (`coverFailures`) — yoksa arayüz yirmi tur boşuna dönerdi.
> Admin ucu: `POST /admin/books/awards/warm?limit=40` — sabırsız olan için
> tek çağrıda hem eşleştirir hem kapakları indirir.
>
> **CANLIDA ÖLÇÜLDÜ, BİR EKSİK ÇIKTI VE KAPATILDI.** Nobel rafında 35
> kapağın 32'si iki turda (~25 sn) indi, üçü inmedi: Open Library kapağı
> **kendi sunmuyor**, `covers.openlibrary.org` 302 ile `archive.org`a
> gönderiyor ve indirici yönlendirmeyi tümden reddediyordu
> (`redirect: 'error'`, SSRF savunması). Koddaki "kapak adresleri zaten
> doğrudan dosyayı gösteriyor" varsayımı yanlışmış. Çözüm savunmayı
> gevşetmeden: `redirect: 'manual'` ile hedef elle okunuyor ve **her sıçrama
> aynı beyaz listeden yeniden geçiyor**; `archive.org` listeye eklendi.
> `coverFailures` bu arada doğru çalıştı — üç kapak `pending`i sonsuza dek
> açık tutmadı.
>
> **Zincir tek adım değil, İKİ adımmış** (ilk düzeltme bu yüzden canlıda
> tutmadı, ölçüm yine yakaladı): `covers.openlibrary.org` →
> `archive.org/download/…zip/…jpg` → `ia801009.us.archive.org/view_archive.php`.
> Son adımın sunucu numarası değişken; `.archive.org` soneki karşılıyor.
> `MAX_REDIRECTS = 3` ile sınırlı döngüye çevrildi.
>
> **Doğrulama:** backend `tsc` + `eslint` temiz, `jest src/books` **82 test
> geçti** (3 yeni: boş ISBN, `remoteCovers` süzgeci ×2); frontend `tsc` temiz.
> Lokalde görsel doğrulama YOK (dev sunucusu dışarı çıkamıyor), **canlıda
> ölçüldü ve üçü de geçti**:
> - Künye sayfasında kaynak adı geçmiyor (şerit "KÜNYE").
> - `/books/kaynak/dogumgunu-partisi--131112` → `inArchive: false`,
>   `archiveSlug: null`. (Künye cache'i 30 günlük olduğu için `isbn13` hâlâ
>   boş dize dönüyor — **savunmanın karşılaştırma tarafında da olmasının
>   sebebi tam bu**; cache dolunca kaynak tarafı da null verecek.)
> - **Dokuz rafın tamamında kapakların hepsi yerel**: nobel 35/35,
>   pulitzer 29/29, booker 9/9, hugo 23/23, nebula 30/30, world-fantasy
>   19/19, locus-sf 15/15, bram-stoker 10/10, edgar 10/10. Raf başına 2–3
>   tazeleme yetti.
>
> **Kalan `pending` kapak değil, eşleşme:** pulitzer 6, booker 28, hugo 22
> kazanan hiç eşleştirilmemiş durumda (bu iş önceden de bekliyordu, hız
> sınırı yüzünden tur başına 3 ilerliyor). Ziyaret ettikçe doluyor;
> `POST /admin/books/awards/warm?limit=40` ile de kapatılabilir.


**Yazım Atölyesi (adım 1+2) ve Salon 02 · Film push edildi (2026-07-28) — ikisi de canlıda doğrulanmayı bekliyor: `/admin/atolye/temurkan-efsaneleri` (bölüm ağacı, tek editör, `@` ile lore bağlama, okuma ekranında künye paneli) ve `/dark-stories/category/film` + `/admin/film` (TMDB'li kişisel film arşivi). Lokalde admin geliştirmesi artık dev proxy ile mümkün. Faz 2 BAŞLADI (2026-07-11): Wiki modülü çekirdeği CANLIDA — evren içi wiki sayfaları (kategori gruplu) + spoiler seviyesi sistemi. Site: https://kuronexus.com + https://api.kuronexus.com. Webhook ile otomatik deploy çalışıyor (push = yayın). Faz 1'den kalan küçük işler: yedekten geri yükleme testi, mobil taşma kontrolü, www DNS kaydı.**

## Tamamlananlar
- [x] implementation_plan.md v3 kesinleşti (şema, mimari, fazlı yol haritası)
- [x] AGENTS.md kuralları kesinleşti (16 kural — kural 16: çoklu dark tema sistemi eklendi)
- [x] Hetzner CX23 sunucu + Coolify + PostgreSQL altyapısı hazır (ultnexus-prod sunucusu, Helsinki)
- [x] Tema kararı verildi: üç dark tema (Mor varsayılan / Siyah+Turuncu / Lacivert+Bordo), token'lar `globals.css` olarak hazır
- [x] Faz 1 adım 1: `backend/` (NestJS 11 + pnpm) ve `frontend/` (Next.js 15.5.20 App Router + React 19 + pnpm) iskeletleri oluşturuldu, ikisi de `pnpm install`, `pnpm run build` ve `pnpm run lint` ile temiz geçiyor (pnpm global kurulu değil — `npx pnpm` ile çalıştırılıyor, her klasörde `pnpm-workspace.yaml` yalnızca `onlyBuiltDependencies`/`allowBuilds` için var, gerçek workspace paket bağı YOK — kural 10 korunuyor)
- [x] `globals.css` kök dizinden kanonik konumu olan `frontend/styles/globals.css`'e taşındı, scaffold'ın varsayılan `frontend/app/globals.css`'i silindi, `layout.tsx` import'u güncellendi
- [x] Kök dizinde lokal geliştirme için `docker-compose.yml` (yalnızca `db` servisi, postgres:16-alpine) + `.env`/`.env.example` eklendi — şu an kullanılmıyor (bkz. not), ileride Docker Desktop kurulunca lokal fallback olarak durabilir
- [x] Backend'e Prisma 7.8.0 kuruldu (`prisma.config.ts` + `prisma/schema.prisma`), implementation_plan.md v3'teki tüm modeller/enumlar (User, Story, WikiUniverse, WikiEntry, WikiEntryRelation, Review, CharacterAnalysis, Quote, MediaAsset, Tag + join tabloları, Comment, Favorite) birebir kuruldu, `prisma validate` başarılı
- [x] **Coolify'da `Kuronexus > production` altında ayrı bir PostgreSQL resource'u oluşturuldu** (Docker Desktop bu makinede kurulu olmadığından yerel yerine bu kullanıldı) — public port `5433` (5432 UltNexus'ta kullanımda olduğu için), `backend/.env`'deki `DATABASE_URL` bu kaynağa (`65.108.220.5:5433`) işaret ediyor
- [x] `prisma migrate dev --name init` başarıyla çalıştı (`prisma/migrations/20260707185446_init`) — şema artık gerçek veritabanında kurulu. Prisma client `backend/src/generated/prisma`'ya üretiliyor (generator: `moduleFormat = "cjs"` + `importFileExtension = ""` — NestJS CommonJS derlediği için zorunlu; `src/` altında olması `nest build`'in `dist/main.js` yapısını koruması için gerekli; `tsconfig.build.json` `prisma/` ve `prisma.config.ts`'i exclude ediyor)
- [x] **Auth modülü tamamlandı ve canlı test edildi**: `POST /auth/login` (JWT döner) + `GET /auth/me`; global guard zinciri ThrottlerGuard → JwtAuthGuard → RolesGuard (`app.module.ts`'de APP_GUARD); rol her istekte DB'den doğrulanır (kural 6), endpoint'ler varsayılan korumalı, `@Public()` ile açılır; login `@Throttle` 5/dk (test edildi: 429 dönüyor); `/register` YOK (404 doğrulandı); tüm hata mesajları çeviri anahtarı (`AUTH.INVALID_CREDENTIALS` vb., kural 1); global `ValidationPipe` (whitelist + forbidNonWhitelisted); bcrypt 12 round
- [x] Admin seed: `prisma db seed` (`prisma/seed.ts`, upsert ile idempotent) — admin kullanıcı oluşturuldu: `admin@kuronexus.com` (şifre `backend/.env` içinde `ADMIN_PASSWORD`; kullanıcı şifre yöneticisine kaydetmeli). `JWT_SECRET`, `PORT=3001`, `CORS_ORIGIN` da `backend/.env`'de

- [x] **i18n + tema sistemi tamamlandı ve canlı test edildi**: next-intl 4 kuruldu (`lib/i18n/{routing,navigation,request}.ts` + `middleware.ts` + `messages/{tr,en}.json`); **varsayılan dil TR** (kullanıcı kararı), `localePrefix: "as-needed"` → `/` = TR, `/en` = EN; sayfa yapısı `app/[locale]/` altına taşındı; tema cookie'si (`kuronexus-theme`) SSR'da `app/[locale]/layout.tsx` içinde okunup `<html data-theme>`'e yazılıyor (flash yok, geçersiz cookie değeri `purple`'a düşer); `SiteHeader` + `ThemeSwitcher` (üç renk yuvarlağı, swatch renkleri `--swatch-*` token'ları olarak globals.css'te — bileşenlerde hex yok, kural 16) + `LocaleSwitcher` (bayraklı tek tık geçiş: TR'deyken İngiliz bayrağı → `/en`, EN'deyken TR bayrağı → `/`; bayrak SVG'leri `public/flags/`); tüm metinler `t()` ile, dokunma alanları min 44px; canlı doğrulandı (lang/data-theme attribute'ları, TR/EN içerik, cookie fallback, bayrak asset'leri 200)

- [x] **Dark Stories modülü (backend) tamamlandı ve canlı test edildi**: `stories` modülü — public `GET /stories` + `GET /stories/:slug` (yalnızca yayında + silinmemiş + community olmayan), admin `GET/POST/PATCH/DELETE /admin/stories[/:id]` (`@Roles('ADMIN')`); Türkçe karaktere duyarlı `slugify` (`common/utils/slugify.ts`, "Gölgelerin Şarkısı" → "golgelerin-sarkisi" doğrulandı); soft delete slug'a `-deleted-{timestamp}` ekler, slug yeniden kullanılabilir (test edildi); ilk yayınlamada `publishedAt` set edilir; slug çakışmasında `-2`, `-3`… eklenir
- [x] **Uploads modülü (backend) tamamlandı ve canlı test edildi**: `POST /admin/uploads` (multipart `file` alanı) — mime kontrolü (jpeg/png/webp/gif, geçersiz tip 400 döner — test edildi), boyut limiti `MAX_UPLOAD_BYTES` (varsayılan 10MB), dosyalar `UPLOAD_DIR`'e (varsayılan `./uploads`, .gitignore'da) rastgele adla yazılır, `MediaAsset` metadata DB'ye; DB kaydı başarısızsa disk dosyası geri silinir; `/uploads/*` ServeStaticModule ile public servis edilir (200 doğrulandı). Deploy'da `UPLOAD_DIR` Coolify persistent volume'e işaret etmeli (kural 15)
- [x] **Frontend Dark Stories + admin paneli tamamlandı ve uçtan uca test edildi**: public `/dark-stories` (kart listesi) + `/dark-stories/[slug]` (detay; 404 çalışıyor; backend kapalıysa liste boş durum gösterir, çökmez); admin `/admin` → `/admin/stories` (liste + sil onayı) + `/admin/stories/new` + `/admin/stories/[id]` (düzenleme); `AdminGuard` client-side login formu (token `kuronexus-token` cookie'sinde, 1 gün), `StoryForm` kapak görseli yükleme + yayınla checkbox'ı içerir; API istemcisi `lib/api/` + `lib/admin/` (`NEXT_PUBLIC_API_URL`, `frontend/.env.local`); header'a Dark Stories nav linki eklendi; `next/image` remotePatterns API URL'inden türetiliyor; tüm metinler `t()` ile TR/EN

- [x] **Git init + ilk commit + push tamamlandı (2026-07-08)**: `main` branch → `https://github.com/ultnexusdev/KuroNexus.git` (commit `6f82c58`, 104 dosya). Gizli `.env`'lerin (kök, `backend/.env`, `frontend/.env.local`) staged OLMADIĞI push öncesi doğrulandı; yalnızca `.env.example` şablonları repoda. `frontend/.gitignore`'a `!.env.example` istisnası eklendi. Git kimliği (repo-local): `ultnexusdev` + `ultnexusdev@users.noreply.github.com`

- [x] **Coolify deploy (2026-07-08)**: `kuronexus-backend` (Dockerfile, `/backend`, port 3001, domain `https://api.kuronexus.com`, volume `kuronexus-uploads` → `/app/uploads`) + `kuronexus-frontend` (Dockerfile, `/frontend`, domain `https://kuronexus.com`, `NEXT_PUBLIC_API_URL` build variable). Backend env: PORT, JWT_EXPIRES_IN, CORS_ORIGIN, UPLOAD_DIR, MAX_UPLOAD_BYTES + kullanıcı tarafından DATABASE_URL (internal) ve JWT_SECRET (yeni üretildi — eski dev token'ları geçersiz). DNS Porkbun'da: kuronexus.com + api → 65.108.220.5. Backend canlı doğrulandı: `GET https://api.kuronexus.com/stories` → 200 + veri. Not: ilk deploy'da DATABASE_URL'e yanlışlıkla panel URL'i yapıştırılmıştı (P1013 crash loop) — düzeltildi.

- [x] **Deploy sonrası güvenlik + yedekleme (2026-07-08)**: DB public erişimi kapatıldı (5433 dışarıdan erişilemez — doğrulandı), günlük pg_dump yedekleme kuruldu (cron `0 3 * * *` UTC, saklama 7 yedek, manuel test yedeği Success — 42.95 KB, `/data/coolify/backups/...` altında). Rate limit canlıda doğrulandı: 6. login denemesi 429. Canlı smoke test: ana sayfa 200, /dark-stories 200 + API verisi SSR'da, /en 200.
- [x] **Canlıda admin login + upload testi (2026-07-09) — bug bulundu ve düzeltildi**: `POST /auth/login` canlıda doğrulandı (JWT dönüyor). `POST /admin/uploads` dosyayı doğru yazıyordu ve `MediaAsset` kaydı oluşuyordu (201) ama public `GET /uploads/*` 404 dönüyordu — `app.module.ts`'teki `ServeStaticModule` `join(process.cwd(), UPLOAD_DIR)` kullanıyordu; Coolify'da `UPLOAD_DIR` mutlak yol (`/app/uploads`, volume mount ile eşleşsin diye) olduğundan sonuç `/app/app/uploads` oluyordu (`node:path`'in `join`'i absolute segment'i resetlemiyor). Düzeltme: `resolve(UPLOAD_DIR)` kullanıldı (commit `ce97305`). Push sonrası Coolify otomatik deploy tetiklenmedi, kullanıcı manuel deploy etti; deploy sonrası uçtan uca (login → upload → public fetch) 200 doğrulandı. Not: Coolify auto-deploy webhook'u kontrol edilmeli — otomatik tetiklenmedi. Test sırasında oluşan 2 küçük (1x1 px) test görseli DB/diskte temizlenmedi (kullanıcıya soruldu, yanıt alınmadı) — istenirse sonra temizlenebilir.

- [x] **Dark Stories → "Kadim Dünyalar" rename + kart/editör iyileştirmeleri (2026-07-09) — commit `e097c2c` ile birlikte push edildi**: Bölüm adı yalnızca görünen etiket olarak değişti (`nav.darkStories`, `stories.listTitle`, `home.intro` — TR "Kadim Dünyalar", EN "Ancient Worlds"; route/slug/model `dark-stories`/`Story` aynı kaldı). Liste sayfası kartları tam genişlik/serbest oranlı kapaktan responsive grid + 16:9 `object-fit:cover` thumbnail'e geçti (`frontend/app/[locale]/dark-stories/page.module.css`); detay sayfası `max-width` 44rem→54rem büyütüldü. Admin içerik alanı düz `<textarea>`'dan Tiptap tabanlı zengin metin editörüne geçti (`frontend/components/admin/RichTextEditor.tsx` — kalın/italik/altı-üstü çizili, H2/H3, liste, alıntı, link, hizalama, içerik-içi görsel yükleme, geri/ileri al); içerik artık HTML olarak saklanıyor, backend'de `sanitize-story-content.ts` (sanitize-html, whitelist) ile temizleniyor. Var olan düz-metin hikâyeler (`legacyPlainTextToHtml.ts` — hem admin editöründe hem public detay sayfasında kullanılıyor) satır satır `<p>` paragrafına çevrilerek geriye dönük uyumlu render ediliyor, DB migrasyonu gerekmedi. Dev sırasında bir CSS bug bulundu ve düzeltildi: `.cover` için `height: auto` unutulmuştu, `aspect-ratio` HTML `width`/`height` attribute'ları yüzünden etkisizdi (next/image intrinsic boyutu eziyordu). Preview'da (`.claude/launch.json` "frontend" config, `npx pnpm --dir frontend run dev`) canlı prod API'ye bağlanarak (`.env.local` geçici olarak `https://api.kuronexus.com`'a çevrilip sonra geri alındı) doğrulandı: liste/detay görünümü, i18n rename, editör toolbar'ı (bold toggle test edildi) ve legacy-to-HTML dönüşümü çalışıyor. Admin login/CRUD localhost'tan test edilemedi (prod CORS_ORIGIN localhost:3000'i kabul etmiyor — beklenen davranış). `frontend`+`backend` build/lint temiz. **Henüz commit/push edilmedi.**

- [x] **Kadim Dünyalar evren yapısı + header/homepage iyileştirmeleri (2026-07-09) — commit `e097c2c`, deploy edildi ve canlı doğrulandı**: "Kadim Dünyalar" artık gerçek bir içerik hiyerarşisi — `/dark-stories` evren listesi (yeni `WikiUniverse` public/admin CRUD, `backend/src/universes/*`, Stories modülüyle birebir aynı desen), `/dark-stories/[universeSlug]` evren detayı (içindeki hikâyeleri listeler), `/dark-stories/[universeSlug]/[storySlug]` hikâye detayı (eski `/dark-stories/[slug]` kaldırıldı). Şema: `Story.universeId` (nullable, `WikiUniverse`'e FK) eklendi — migration elle yazıldı (`backend/prisma/migrations/20260709220000_add_story_universe/migration.sql`), push sonrası Dockerfile'daki `prisma migrate deploy` ile otomatik uygulandı, `GET /universes` canlıda 200 döndü (doğrulandı). Admin `StoryForm`'a evren seçici eklendi. Header: anonim ziyaretçiler için tema seçici değişmedi, admin login'liyken locale bayrağının sağında kullanıcı adı + `Profil Bilgileri`/`Görünüm` sekmeli panel (`AccountMenu.tsx`) görünüyor. Ana sayfaya "Yönetim Paneli" linki, yeni tagline, RichTextEditor'da net SVG hizalama ikonları eklendi.
  - **Deploy**: Push sonrası Coolify auto-deploy yine tetiklenmedi, kullanıcı manuel deploy etti (backend + frontend); ~3 dakika içinde `/universes` 200 döndü.
  - **Veri adımları canlıda tamamlandı**: 8 evren `POST /admin/universes` ile oluşturuldu — **ilk denemede Türkçe karakterler bozuldu (mojibake: "Tem?rkan", "zaman-ark" gibi hatalı slug'lar)** çünkü bash'te shell string interpolation'ı UTF-8'i doğru taşımadı; bozuk 6 kayıt soft-delete edilip JSON payload'ları dosyaya (Write tool ile, garantili UTF-8) yazılıp `curl --data-binary @file` ile yeniden gönderilerek düzeltildi (doğru sonuç: temurkan-efsaneleri, zaman-carki, kral-katili-guncesi, firtinaisigi-arsivi, yuzuklerin-efendisi, buz-ve-atesin-sarkisi + baştan doğru gelen malazan-yitikler, dune). "Gölgesiz Topraklar" → Temürkan Efsaneleri'ne `universeId` ile bağlandı (doğrulandı: evren detayında görünüyor). "Gölgelerin Şarkısı" soft-delete edildi (public `/stories`'te artık yok, doğrulandı).
  - **Ders**: Türkçe karakter içeren veriyi canlıya API ile göndereceğinde bash shell içinde string enjekte etmek yerine dosyaya (Write tool) yazıp `curl --data-binary @file` kullan — shell UTF-8'i sessizce bozabiliyor.

- [x] **Evren detay sayfasına banner + liste başlığı ortalama (2026-07-09)**: `dark-stories/[universeSlug]/page.tsx`'e evrenin `coverImage`'ı varsa sayfa üstünde tam genişlik, altta `--bg`'ye doğru gradient ile yumuşayan bir banner eklendi (`next/image fill` + `sizes="100vw"`); mobilde 200px, ≥768px'te 320px yükseklik. `dark-stories/page.tsx`'teki "Kadim Dünyalar" başlığı ortalandı. Prod API'ye geçici bağlanıp bir evrene geçici kapak atanarak (sonra `null`'a geri alındı) görsel doğrulandı. **Not**: Kullanıcının "Buz ve Ateşin Şarkısı" için sohbette paylaştığı görsel dosyaya erişilemediği için yüklenemedi — kapak görselleri `/admin/universes` üzerinden (UniverseForm'daki mevcut yükleme butonu) elle eklenmeli.
- [x] **`www.kuronexus.com` DNS eksikliği tespit edildi (2026-07-09)**: Kullanıcı Yandex'te `www.kuronexus.com`'a ulaşamadığını bildirdi; `www` için Porkbun'da hiç DNS kaydı yok (yalnızca kök alan adı + `api` var) — kod/deploy ile ilgisi yok. Kullanıcıya CNAME (`www` → `kuronexus.com`) eklemesi ve Coolify frontend Domains alanına `https://kuronexus.com,https://www.kuronexus.com` + "Allow www & non-www" direction ayarı önerildi. **Kullanıcı tarafında henüz uygulanıp uygulanmadığı doğrulanmadı.**

- [x] **Operasyon düzeltmeleri + hesap işleri (2026-07-10/11)**: (1) **GitHub webhook kuruldu, otomatik deploy artık çalışıyor** — repo "Public GitHub" kaynağıyla bağlı olduğundan Coolify webhook kuramıyordu; iki uygulamaya da aynı "GitHub Webhook Secret" girildi, GitHub repo Settings → Webhooks'a `http://65.108.220.5:8000/webhooks/source/github/events/manual` payload URL'i eklendi. O günden beri her push iki uygulamayı da otomatik deploy ediyor (defalarca doğrulandı). (2) **trust proxy bug'ı düzeltildi** (`main.ts`: `NestExpressApplication` + `app.set('trust proxy', 1)`) — önceden ThrottlerGuard tüm ziyaretçileri proxy IP'si olarak görüyor, login limiti (5/dk) herkes arasında paylaşılıyordu; kullanıcının "giriş yapamıyorum" şikayetinin köklerinden biri buydu. Login formu artık 429'u ayrı mesajla gösteriyor. (3) **Şifre göster/gizle** butonu login formuna eklendi — asıl sorunun Chrome'un yanlış kayıtlı şifreyi autofill etmesi olduğu ortaya çıktı. (4) **`PATCH /auth/password`** endpoint'i eklendi (JWT + mevcut şifre doğrulamalı); admin şifresi kullanıcının istediği değerle değiştirildi, `backend/.env` senkron.

- [x] **Wiki modülü çekirdeği (2026-07-11) — commit `e1bc78f`, deploy edildi ve canlıda uçtan uca doğrulandı**: Faz 2 başladı. Backend: `backend/src/wiki/*` (stories/universes deseni) — public `GET /universes/:slug/wiki` + `/:entrySlug`, admin `/admin/wiki-entries` CRUD (`?universeId=` filtreli); slug evren başına benzersiz (`@@unique([universeId, slug])`), içerik `sanitizeStoryContent` ile temizleniyor; şema değişikliği GEREKMEDİ (WikiEntry tablosu init migration'dan beri vardı). Frontend: evren detay sayfasında kategoriye göre gruplu wiki bölümü (`components/wiki/WikiSection.tsx` — 7 kategori sabit sıralı, yalnızca dolu olanlar), spoiler seviyesi seçici (cookie: `kuronexus-spoiler-{universeSlug}`, seçenekler entry'lerin max tier'ından türetilir, varsayılan 0 = güvenli taraf), seviye üstü kartlar blur + "Spoiler" rozetli ve tap-to-reveal (ilk tıklama gezinmez, açar), wiki detay sayfası (`[universeSlug]/wiki/[entrySlug]` — kategori rozeti gold token'la, `SpoilerGate` uyarı + "Yine de göster"), admin panelde wiki CRUD (`/admin/wiki` — evren filtresi; form: evren/kategori/spoiler tier/kapak/RichTextEditor). Canlı smoke test: Zaman Çarkı'na 2 örnek sayfa eklendi (Rand al'Thor — CHARACTER spoiler'sız, Tel'aran'rhiod — TERM `spoilerTier:2`; Türkçe içerik dosyadan `--data-binary` ile, mojibake yok) — liste gruplaması, blur/rozet, tap-to-reveal, detay kapısı ve reveal canlıda doğrulandı. Örnek sayfalar canlıda duruyor (gerçek içerik başlangıcı olarak kalabilir/düzenlenebilir). **Sonraki wiki adımı: `WikiEntryRelation` çapraz link yönetimi (bilinçli ertelendi).**

- [x] **Okuma Deneyimi ve Landing Page İyileştirmeleri (2026-07-11/12)**: 
  - Editör için **Corinthia** (şiirsel/fantastik) fontu ve Göktürkçe (Orhun) eklentileri (Caveat yerine daha görkemli) sisteme entegre edildi.
  - Okuma ekranında sayfa numaraları URL'e eklendi (`?page=15` formatı); sayfayı yenileyince/link atınca kalınan yerden açılma sağlandı.
  - Okuma ekranı için **Parşömen Modu (Parchment Mode)** eklendi. Arka plan nostaljik yaprak rengi, metinler ve tüm okuma içi renkler (rünler, drop-cap vb.) koyu kahverengiye dönüştürülüyor. Sağ alt köşedeki (📜) butonu ile geçiş yapılıyor. Sayfalandırma butonları köşeli ve temaya uygun "Cinzel" fontlu bir tasarıma geçirildi.
  - **Landing Page (Ana sayfa) yenilendi**: Ziyaretçilerin doğrudan yönetim paneli butonunu görmesi engellendi; "Yönetim Paneli" butonu "Evrenleri Keşfet" (doğrudan `/dark-stories` listesi) olarak değiştirildi. Sağ üst köşedeki "Admin" kullanıcı menüsü kaldırılarak ziyaretçi dostu evrensel "Tercihler" sekmesine (sadece görünüm ve dil ayarı) dönüştürüldü.
  - Ana sayfaya 9MB 4K MP4 **arka plan videosu** (hero-bg.mp4) animasyonlu sis efekti ile entegre edildi. Kadim Dünyalar evren listesinde kapak görselleri için yatay/dikey oran iyileştirmesi (`aspect-ratio: 2/3`, `object-fit: cover`) yapıldı.
- [x] **`www.kuronexus.com` canlıya alındı (2026-07-12)**: Kullanıcı Porkbun'a CNAME (`www` → `kuronexus.com`) ekledi. Doğrulandı: DNS çözümleniyor (65.108.220.5), `https://www.kuronexus.com` 200 dönüyor, `www.kuronexus.com` için geçerli TLS sertifikası var (bitiş 2026-10-07), HTTP→HTTPS 307 yönlendirmesi çalışıyor. Ardından SEO için kanonik host yönlendirmesi eklendi (commit `748f366`): `frontend/middleware.ts` www isteklerini yol korunarak 301 ile `kuronexus.com`'a yönlendiriyor (`x-forwarded-proto` ile tek atlamada https). Canlıda doğrulandı: `https://www.kuronexus.com/en/dark-stories` → 301 → `https://kuronexus.com/en/dark-stories`, tek hop.
- [x] **8 evrene kapak görselleri eklendi (2026-07-12)**: Kullanıcı `/admin/universes` üzerinden tüm evrenlere kapak yükledi. Canlıda doğrulandı: `/dark-stories` liste kartlarında 8 kapak da 200 dönüyor ve render oluyor; evren detay banner'ı (Zaman Çarkı ile test edildi) gradient + başlık overlay ile çalışıyor; konsol hatasız.
- [x] **Global Ambient Müzik Çalar ve Müzik Kütüphanesi (2026-07-12)**:
  - Backend: `AmbientTrack` modeli (`universeId` ilişkili) Prisma'ya eklendi, uploads limiti 50MB audio dosyaları (mp3/wav/ogg) destekleyecek şekilde güncellendi.
  - Admin: `/admin/ambient-tracks` sayfası yapıldı, müziğin başlığı, dosyası ve ait olduğu evren seçilerek sisteme eklenebiliyor.
  - Public: Layout köküne yerleştirilen, düz/sade tasarımlı ve site temasına uyan `GlobalAmbientPlayer` yapıldı. Okuyucu bir evren içine (örn: Temürkan) girdiğinde o evrenin çalma listesi yükleniyor, müzik sitenin her yerinde kesintisiz devam ediyor. Play/Pause/Prev/Next/Shuffle/Repeat özellikleri eklendi. TypeScript build hataları düzeltildi ve başarılı deploy alındı.
  - **Canlıda uçtan uca doğrulandı (2026-07-12)**: test WAV'ı API ile yüklendi (login → `/admin/uploads` → `POST /ambient-tracks`, Türkçe başlık `--data-binary` ile bozulmadan), public `GET /ambient-tracks/universe/temurkan-efsaneleri` 200; tarayıcıda player evren sayfasında belirdi, oynatma çalıştı ve **client-side gezinme sırasında müzik kesilmeden devam etti** (zaman damgalı ölçümle kanıtlandı). Test kaydı sonrasında DELETE ile temizlendi (yüklenen test .wav dosyası + MediaAsset kaydı diskte/DB'de duruyor — temizlik listesine eklendi). Testte bulunan küçük kusurlar: (1) başlangıç ses seviyesi efekti uygulanmıyor — slider 0.3 gösterirken gerçek volume 1 (audio elementi ilk render'da yokken effect çalışıyor); (2) tek şarkı bitince buton "Durdur" görünürken ses duruyor (playNext tek parçada no-op, isPlaying true kalıyor); (3) AGENTS.md kural 1 ihlali: `GlobalAmbientPlayer.tsx` ve `admin/ambient-tracks/page.tsx`'te hardcoded Türkçe metinler (t() kullanılmıyor) + admin sayfası inline style kullanıyor.
  - **Okuma Ekranı Ayraç Bug Fix (2026-07-12)**: `PaginatedReader` bileşeninin `<hr>` etiketlerini sayfa bölücü olarak yutması engellendi. Hem editörün ürettiği `<hr>` etiketleri hem de düz metin olarak girilen `---` ifadeleri artık okuma ekranında doğru şekilde görsel rün ayracı (`❖`) olarak render ediliyor.

- [x] **Admin müzik bug fix + player görünürlüğü + site footer (2026-07-12, commit `163705e`) — canlıda doğrulandı**: (1) Admin müzik sayfası token'sız public `apiFetch` kullandığından `/admin/universes` 401 dönüyor, evren seçici boş kalıyordu → sayfa `lib/admin/api.ts`'e taşınan `fetchAdminAmbientTracks/createAmbientTrack/deleteAmbientTrack` + `fetchAdminUniverses`/`uploadImage`'a geçirildi (JWT header'lı); canlıda doğrulandı: 8 evren açılır listede, mevcut parçalar tablosu doluyor. (2) Player artık evren sayfaları dışında (ana sayfa vb.) yalnızca aktif dinleme oturumu varsa görünüyor (`isPlaying || currentTime > 0`); canlıda üç senaryo doğrulandı: evren sayfasında görünür, çalmadan ana sayfaya dönünce gizli, müzik çalarken ana sayfada görünür + müzik kesintisiz. (3) UltNexus tarzı `SiteFooter` eklendi (layout'ta, tüm sayfalarda): marka + tanıtım metni, "Keşfet" sütunu, dinamik "Evrenler" sütunu (SSR `fetchUniverses`, hata durumunda sütun gizlenir), telif satırı; tüm metinler `footer.*` i18n. Canlıda 8 evren linkiyle SSR'da geliyor.
- [x] **Player konumu + hikâye başlığı + evren bazlı çalma listeleri (2026-07-12) — canlıda doğrulandı**: (1) `GlobalAmbientPlayer` alt-sabit (`position: fixed`) konumdan sayfa akışına alındı (`margin: 2.5rem auto`), artık footer'ın üstünde, sayfalandırma kontrollerinin altında görünüyor (canlıda konum doğrulandı: player top < footer top, `position: static`). (2) Okuma sayfasında kapak görseli varken görünen `<h1>` başlık kaldırıldı (kapakta zaten yazıyor) — ekran okuyucular için `srOnly` sınıfıyla erişilebilir tutuluyor (`PaginatedReader`). (3) Evren bazlı çalma listesi sistemi: backend `GET /ambient-tracks/playlists` (parça içeren evrenleri döner, `:id` route'undan ÖNCE tanımlı) + player çalma listesi menüsünde aktif evren adı başlık olarak, altında o evrenin parçaları, en altta "Diğer çalma listeleri" bölümüyle başka evrenlere geçiş; müzik çalarken liste değiştirince kaldığı akış korunuyor. Canlıda `/ambient-tracks/playlists` 200 (Temürkan listeleniyor).
- [x] **Nexus'u Keşfet: Kategori → Evren hiyerarşisi (2026-07-12, Antigravity oturumu) — canlıda**: Keşif yapısı düz evren listesinden iki katmanlı hiyerarşiye geçti — yeni `UniverseCategory` modeli + migration, public `GET /universe-categories` (`@Public()`), admin CRUD; evrenler kategorilere atanabiliyor (`universes.service`'te `categoryId` güncelleme + kategoriyi kaldırma). Canlıda kategoriler oluşturuldu (ANİME/DİZİ/FİLM/KİTAP, kapak görselli). Yan işler: SSG'nin boş kategori state'ini cache'lememesi için fetch cache kapatıldı, hero videosuna smooth loop (opacity geçişi), admin login'liyken SiteHeader'da dinamik "Admin Paneli" linki, footer konum/i18n düzeltmeleri.
- [x] **Hata çözümleri ve Admin UX İyileştirmeleri (2026-07-12)**: 
  - Kategorilerin evrenlere atanamaması sorunu çözüldü (Kategoriler API endpoint'ine `@Public()` eklendi; hatalı test dosyası silinerek build düzeltildi ve yeni kod canlıya yansıdı). 
  - Ana sayfadaki (hero) 8 saniyelik videoya "Smooth Loop" (CSS opacity transition ve React timeupdate event'i ile) eklendi, böylece videonun başa sararken aniden atlaması (ping-pong eksiği) yumuşak bir karanlık geçişiyle çözüldü. 
  - Admin kullanıcısı giriş yaptığında (token cookie'si `layout.tsx`'te SSR olarak decode edilerek) sitenin genelinde SiteHeader'a dinamik "Admin Paneli" bağlantısı eklendi; böylece URL'ye manuel `/admin` yazma zorunluluğu ortadan kalktı.

- [x] **Tasarım becerileri kuruldu + çok-kanatlı yeniden tasarım başladı (2026-07-13)**:
  - İki beceri `.claude/skills/`'e kuruldu: **`frontend-design`** (Anthropic resmi — özgün görsel kimlik/süreç rehberi, commit `98b0275`) + **`ui-ux-pro-max`** (NextLevelBuilder — 161 palet / 57 font eşleşmesi / 50+ stil / 99 UX kuralı CSV veritabanı, commit `44c1e5a`). Not: makinede **Python yok** → becerinin arama betikleri çalışmaz ama CSV'ler doğrudan okunuyor. Ağır canvas TTF fontları gitignore'landı. npx kurulumu çalıştırılmadı; repo klonlanıp dosyalar elle kopyalandı, betikler incelendi (yalnızca yerel CSV I/O, ağ/exec yok).
  - **Vizyon**: KuroNexus = "çok-kanatlı arşiv" — her kategori (Kadim Dünyalar/Spor/Anime/Film/Dizi/Kitap) kendi bağımsız görsel kimliğine sahip, ortak kabuk (黒 mühür, keşif hub'ı) sabit. Kullanıcı onayladı. Tasarım planı hazırlandı (palet+tipografi+layout+imza per kategori, AI-klişe eleştirisiyle), referans siteler: LOTR/One Piece/FlixStream/Victory United.
  - **Pilot: Kadim Dünyalar "Sisli Codex" (commit `1881fc6`, canlıya push edildi)**: `data-category="kadim-dunyalar"` mevcut `data-theme` sistemine eklemeli deri (globals.css token override, kural 16). Sisli çam-arduvaz palet + altın yaldız accent, Cinzel başlık + **Cormorant Garamond** gövde (yeni @import), sisli hero + oyulmuş başlık + ❖ ayraç, **imza: Orhun/Göktürk runik marjı** (zaten yüklü Noto Sans Old Turkic, >900px'te görünür), köşe filigranları (`components/kadim/CodexOrnaments.tsx`), tezhipli drop-cap, "Ciltler" section label. **Şimdilik yalnızca evren detay sayfası** (`dark-stories/[universeSlug]`); liste + okuma ekranı kullanıcı onayı sonrası yapılacak. Build/lint temiz, lokalde doğrulandı. Kullanıcı canlıda görüp karar verecek.

- [x] **Kategori sayfası codex'e geçti + Docker 29 deploy arızası çözüldü (2026-07-13/14)**:
  - **Kategori sayfası** (`/dark-stories/category/kadim-dunyalar`, commit `847de88`): codex kimliği kategori sayfasına yayıldı — sisli hero + "8 Evren" dinamik eyebrow + oyulmuş başlık + runik marj/filigran + yeni `CodexCard` (❖ Cinzel başlık, Cormorant alt metin, hover'da altın üst çizgi + görsel zoom, `components/kadim/CodexCard.tsx`). Deri `data-category={slug}` ile sürülüyor; diğer kategoriler (anime/dizi/film/spor) kendi derileri gelene kadar eski jenerik düzende. **Canlıda doğrulandı (2026-07-14)**: 8 CodexCard, eyebrow, filigran, evren detay + ana sayfa 200.
  - **Deploy arızası (2026-07-13) ve çözümü**: (1) İlk hata Docker Hub 500 kesintisi — Dockerfile'lardaki gereksiz `# syntax=docker/dockerfile:1` satırı kaldırıldı (commit `051c085`, build artık bu dış imaja bağımlı değil). (2) İkinci hata: sunucudaki Docker otomatik güncellemeyle **29.1.3**'e sıçramış, Coolify tanımıyor ("does not support BuildKit"); build bitiyor ama attestation'lı OCI imajı "unpacking" adımında `broken pipe` ile patlıyordu. **Çözüm**: `daemon.json`'a `"features": {"containerd-snapshotter": true}` eklendi (imajlar kaybolmasın), Docker `28.5.2`'ye downgrade edildi ve `apt-mark hold` ile kilitlendi (docker-ce/cli/rootless-extras). Doğrulandı: 13 container sağlam, sonraki redeploy 45 sn'de başarılı. **Ders**: sunucuda docker-ce hold'da tutulmalı; Coolify'ın desteklediği sürüm aralığı dışına çıkma.
  - Not: ultnexus.com Basic Auth (401 "Secure Area") arkasında — KuroNexus işlemleriyle ilgisiz, kullanıcının bilinçli ayarı olup olmadığı sorulmadı.

- [x] **"Gece Müzesi" ana sayfa hero'su (2026-07-14, commit `bdda48e`) — canlıda doğrulandı**: Ortalanmış video-hero şablonu kaldırıldı; yerine asimetrik "giriş holü": SOL küratör sütunu (Cinzel eyebrow "Kişisel Kültür Arşivi", Cormorant manifesto "Gölgede kalan her tutkunun *bir odası var.*" — kullanıcı onaylı metin, italik+altın dönüş; tek CTA "Arşive gir" mühür-kızıl alt çizgili; **黒 damgası kullanıcı isteğiyle SİYAH mürekkep** kâğıt pulu üstünde, yüklemede basılma animasyonu) + SAĞ kapı duvarı (`components/home/DoorWall.tsx`, client): kategori başına ışık sızan dikey kapı (hover'da aralık genişler/flex, imleç takip ışığı, dikey→yatay ad dönüşü; atmosfer renkleri slug→token map ile `globals.css`'ten: film=marki altını, dizi=camgöbeği, spor=kırmızı, anime=kor, kadim=codex altını; bilinmeyen slug→default, modüler) + en sonda **Temürkan mühürlü baş köşe kapısı** (en karanlık, balmumu mühür SVG'sinde Orhun 𐱅) + altta gerçek verili Arşiv İndeksi şeridi (salon no + evren sayaçları). Yükleme: kapılar soldan sağa sırayla yanar; `prefers-reduced-motion` destekli. Canlıda doğrulandı: 6 kapı, 6 salon, manifesto, damga, mühür, "8 evren" sayacı. Sonraki revizyonlar (2026-07-15, kullanıcı istekleri): büyük altın-konturlu 黒 glifi + "nexus" sol sütunda ana karakter oldu (header logosu yalnızca ana sayfada gizli, `SiteHeader` client'a çevrildi), CTA "Nexus'a gir", kapı asimetrisi yumuşatıldı (0.96–1.15) ve salon numaraları kapı adları gibi dikey yazılıp hover'da yatay dönüyor (commit `8debcdc`) — etiket sığma sorunu kökten çözüldü. Not: film/dizi/spor/anime kapıları "0 evren" — o kategorilere evren atandıkça sayaçlar dolar. `HeroVideo` bileşeni artık kullanılmıyor (dosya duruyor, hero-bg.mp4 public'te).

- [x] **Spor kanadı: Salon 03 + iç salonlar (2026-07-15, commit'ler `502a02f` + `3daf1fd`) — canlıda doğrulandı**: 
  - **Spor ana sayfası** (`/dark-stories/category/spor`): diyagonal ikiye bölünmüş salon (`components/sport/SportSplit.tsx`) — solda GS "Stadyum Gecesi" (antrasit + altın huzme + saha çizgisi), sağda F1 "Gece Yarışı" (CSS karbon doku + kerb şeridi); hover'da yarı genişler, "Salona gir" belirir. Bebas Neue eklendi (`--font-bebas`). `galatasaray` + `formula-1` evrenleri spor kategorisinde oluşturuldu.
  - **Faz A backend** (kullanıcı kararı: veri admin'den, dış API Faz B): `SportPlayer/SportLegend/RaceEvent/DriverStanding` modelleri eklendi.
  - **Faz B (Transfermarkt Entegrasyonu) tamamlandı**: `API-Football` kaldırılarak `dcaribou/transfermarkt-datasets` (CSV) entegre edildi. `TmCompetition`, `TmClub`, `TmPlayer`, `TmGame`, `TmTransfer` modelleri Prisma'da oluşturuldu (index'ler ile). Node.js stream, `csv-parser` ve `createMany({ skipDuplicates: true })` kullanılarak yerel DB senkronizasyon scripti yazıldı (`sync-transfermarkt.ts`). `FootballService` doğrudan yerel DB'yi (Galatasaray id=141) kullanacak şekilde yenilendi.
  - **GS salonu** (`/dark-stories/galatasaray`, `GsHall.tsx`): tribün huzmeli hero, kadro grid'i (dev forma no + hover istatistik çekmecesi), altın-varak efsane arşiv kartları (drop-cap'li). **F1 salonu** (`/dark-stories/formula-1`, `F1Hall.tsx`): karbon hero, GP takvim kartları (pist SVG konturu + hover "ışık turu" animasyonu, `trackSvgPath` alanına SVG path girilir), takım şeritli/puan barlı şampiyona tablosu, madalyon efsane galerisi. Boş durumlar davetkâr metinlerle (i18n). 
  - **Tohum verisi canlıda**: GS efsaneleri (Metin Oktay, Hagi) + F1 efsaneleri (Senna, Schumacher, Hamilton) API ile yüklendi, sayfalarda render doğrulandı. Kadro (artık TM'den gelecek), takvim/sıralama boş — **admin UI henüz YOK** (bkz. sıradaki adım).

- [x] **Backend crash-loop kurtarması + Transfermarkt sync altyapısı (2026-07-15 akşam)**: Antigravity'nin TM geçişi (`4ebe689`…`c4c372a`) sonrası site çökmüştü — kök neden: `backend/scripts/sync-transfermarkt.ts` derlemeye girince `nest build` çıktısı `dist/src/main.js`'e kaydı, container `node dist/main` bulamayıp crash-loop'a girdi (tüm API 503). **Düzeltme `0ccaff6`**: `tsconfig.build.json` exclude'una `"scripts"` eklendi (bu tuzak init notlarında vardı — `src/` dışına .ts koyarken dikkat!). Ardından `6c224ed`: admin-tetiklemeli arka plan kadro sync'i eklendi (`POST/GET /admin/football/sync`, players.csv'yi stream edip yalnızca TM_TEAM_ID=141/GS oyuncularını upsert eder, sonucu ExternalCache'e yazar). **BLOKER**: Antigravity'nin CSV URL'leri ölü — transfermarkt-datasets CSV'leri git'te değil (DVC); HuggingFace dataseti 401 (gated), Kaggle yayını var ama indirme için ücretsiz Kaggle API token'ı şart; felipeall/transfermarkt-api demo örneği 500 veriyor. Veri kaynağı kararı kullanıcıda (Kaggle token / API-Football'a dönüş / self-host scraper). Site şu an tamamen sağlıklı; GS kadrosu boş-durum metniyle bekliyor. Not: API-Football dönemi env'leri (FOOTBALL_API_KEY vb.) backend/.env'de duruyor, TM_TEAM_ID/TM_SEASON kullanımda.

- [x] **Kaggle kadro sync CANLIDA + haftalık otomatik (2026-07-16)**: Kullanıcı `KAGGLE_API_TOKEN` (KGAT_… Bearer) env'i ekledi. Sync ilk kez elle tetiklendi (`POST /admin/football/sync`) → **36 güncel GS oyuncusu** DB'ye yazıldı (Icardi, Osimhen, Sané…), GS sayfası fotoğraflı kartlarla doldu (canlı doğrulandı). Ders: env eklemek + redeploy sync'i otomatik çalıştırmaz, komut tetiklenmeli. Cache bug'ı düzeltildi (`63dcff2`): kadro/oyuncu fetch'leri `no-store` (backend DB kaynak-doğruluk, frontend cache'lemez — sync sonrası anında yansır; yalnızca galatasaray render yolu dinamikleşir). **Haftalık otomatik sync eklendi** (`c850f96`): `@nestjs/schedule` + `@Cron('0 4 * * 1', UTC)` — her Pazartesi 04:00 UTC kadroyu tazeler (kimlik yoksa uyarıyla atlar, `syncRunning` guard'ı elle sync'le çakışmayı önler). Not: kadro butonu istenmedi, yalnızca zamanlama.

- [~] **GS sayfası zenginleştirme — YARIM KALDI (2026-07-16 akşam, yarın devam)**: Kullanıcı GS sayfasına sol "yaldızlı kenar indeksi" (dikey scroll-spy nav: 01 Genel Bakış / 02 Mevcut Kadro / 03 Efsaneler / 04 Unutulmaz Anlar) + sağ widget rafı (sonraki maç geri sayımı, Süper Lig puan durumu, + benim önerim kadro künyesi/piyasa değeri) istedi. Bu tur kapsamı: "önce iskelet (sol nav + sağ raf)".
  - **Veri kararı**: API-Football ücretsiz planı GÜNCEL sezonu vermiyor (2022-2024 sınırı + `next` param kapalı — test edildi), TheSportsDB ücretsiz kırpıyor. Kullanıcı **Apify**'ı seçti, `APIFY_TOKEN`'ı backend env'e ekledi. Actor: **`trovevault/turkey-football-results-tables`** (input `{leagues:["super-lig"], season, includeMatches, includeStandings, maxMatches}`; output: Matches [matchDate/homeTeam/awayTeam/homeScore/awayScore/status/winner] + Standings [position/teamName/points/played/won/drawn/lost/goalsFor/goalsAgainst/goalDifference]).
  - **Backend KURULDU (commit'ler `b73fc10` + `36db37e`, canlıda)**: `football.service`'e Apify sync eklendi — `POST/GET /admin/football/sync-league` (arka planda `run-sync-get-dataset-items` çağırır, standings + GS sonraki maçı ExternalCache'e yazar), public `GET /football/standings` + `/football/next-match`, günlük 05:00 UTC cron. `?season=` override + sezon boşsa bir öncekine otomatik geri-düşüş + ham şema teşhisi (`diag`: sampleKeys/sample) eklendi.
  - **AÇIK SORUN**: İlk sync (sezon 2026 türetildi — Temmuz'da 2026/2027 yok) **0 takım** döndürdü. Sezon 2025 ile tekrar tetikleyip actor'ın gerçek şemasını (`diag`) görmek gerekiyor — filtrelerim (`teamName`/`position`/`matchDate`) actor çıktısıyla eşleşiyor mu doğrulanmadı. **Deploy notu**: `b73fc10` deploy'u ilk denemede build-sonrası başarısız oldu (Docker HÂLÂ 28.5.2, sebep belirsiz — muhtemelen geçici), sonra kendiliğinden/redeploy ile geçti; `36db37e` deploy durumu doğrulanmadı.
  - **YARIN İLK İŞ**: admin login → `POST /admin/football/sync-league?season=2025` → `GET /admin/football/sync-league`'deki `diag.sample`'a bak → şema doğruysa `/football/standings` + `/football/next-match` dolmuş olur → sonra **frontend** (GsHall'u 3 sütuna böl: sol GiltNav scroll-spy + sağ WidgetRail: NextMatchCountdown + StandingsWidget [GS + komşuları, açılır] + SquadDossier [bizim TM piyasa değeri verisinden]). Şema farklıysa football.service filtrelerini `diag`'a göre düzelt. `APIFY_TR_SEASON=2025` env'i Coolify'a eklenirse sezon otomatik doğru olur.

- [x] **AÇIK SORUN çözüldü: Apify şeması doğrulandı, standings artık maçlardan hesaplanıyor (2026-07-17, iş yeri makinesi)**:
  - **Teşhis**: `season=2025` sync'i **306 satır** döndürdü (= 18 takım × 34 hafta, tam sezon maçları), `standings: 0`. Alan adları tahminimizle birebir uyuşuyor (`matchDate/homeTeam/awayTeam/homeScore/awayScore/status/winner/round/leagueName`) — yani filtre isimleri doğruydu. **Kök neden**: actor README'sinde net — *"The actor creates two output tables: **Matches** and **Standings**"*. `run-sync-get-dataset-items` yalnızca **default (Matches)** dataset'ini döndürüyor; standings satırları ikinci, ayrı dataset'te olduğu için `position`/`teamName` filtresi hiçbir zaman eşleşmiyordu. Actor input şeması (`/builds/default` ile public okundu) `includeStandings` dahil tüm anahtarlarımızı doğruladı — sorun input'ta değil, okunan dataset'te.
  - **Karar/Düzeltme**: İkinci dataset'i kovalamak yerine (isimsiz/hesap-kapsamlı, `datasetId` ile append edilirse tekrarlı satır birikir) puan tablosu **maç sonuçlarından yerelde hesaplanıyor** — actor'ın kendisi de zaten aynısını yapıyor ("calculates standings from completed matches"). Yeni `computeStandings()` (`football.service.ts`): yalnızca `status: finished` maçlar, 3-1-0 puan, sıralama puan → averaj → atılan gol → ad. **Not**: TFF'nin resmî eşitlik bozma kuralı ikili averaj; burada genel averaj kullanılıyor, eşit puanlılarda sıra resmî tablodan sapabilir (kod içinde yorumda belirtildi). Actor ileride standings'i default dataset'e düşürürse onlar tercih edilir (kod iki yolu da destekler).
  - **Sezon geri-düşüşü düzeltildi**: koşul `!hasStandings(items)` idi — standings hiç gelmediği için otomatik sync'te HER ZAMAN tetikleniyor, gereksiz ikinci actor koşusu yapıyordu. Artık `items.length === 0`.
  - **`season=2026` testi: totalItems 0** — 2026/27 fikstürü bu kaynakta henüz yok (Temmuz ortası, beklenen). Yani **sonraki-maç widget'ı şu an hangi kodla olursa olsun boş kalır**; fikstür yayımlanınca günlük cron kendiliğinden doldurur. Puan tablosu 2025/26 final tablosundan gelir. Otomatik sync'te türetilen sezon 2026 → 0 satır → 2025'e düşer → tablo dolu gelir.
  - **Cache şekli değişti**: `football:standings` payload'ı artık `{ season, table }` (eskiden düz dizi olacaktı — ama bu anahtar hiç yazılmamıştı, legacy veri YOK). `GET /football/standings` artık `{ season, table, updatedAt }` döner; widget "2025/26 final tablosu" diye etiketleyebilsin diye.
  - **Canlıda doğrulandı**: commit'ler `9efb701` (asıl düzeltme) + `e17f4ed` + `8093750` (teşhis). İlk deploy **TS4053 ile patladı** (`getStandings()` dönüş tipi `ApifyStandingRow`'a atıf yapıyor ama interface export edilmemişti) — Coolify yeni sürümü kaldırdı, canlı hiç etkilenmedi; `export` eklenip geçildi. Sonra sezon override'sız (cron yolu) sync: türetilen 2026 → 0 satır → **2025'e düştü** → 306 maç → **18 takım hesaplandı** (geri-düşüş düzeltmesi gerçek koşulda çalıştı). **Ders**: Node'suz makinede `nest build`'in tip hatalarını yakalayamıyoruz; public metot dönüş tiplerinde kullanılan interface'ler export edilmeli.
  - **YENİ BLOKER — kaynak verisi bayat (2026-07-17)**: `diag.statusCounts` kesin sonucu verdi → sezon 2025 için **finished: 90, scheduled: 216**, `lastScoredRound: 11`. Yani filtre bir şey elemiyor; **kaynakta 2025/26'nın yalnızca 11. haftaya kadarki sonuçları var** (~Kasım 2025'te donmuş), Mayıs 2026'da biten maçlar hâlâ "scheduled". Kontrol: **sezon 2024 eksiksiz** (342 satır, 19 takım, 36 maç, GS 95 puanla şampiyon — gerçek tabloyla birebir) → actor ve `computeStandings` doğru çalışıyor, sorun actor'ın 2025/26 kapsamında. Sonuç: **bu actor güncel sezon verisi vermiyor**; sonraki-maç da bu yüzden boş (216 "scheduled" maçın tarihi geçmişte kaldı, "yaklaşan" filtresi hiçbirini seçmiyor).
  - **Kullanıcı kararı**: bugün yanlış/bayat tablo yayınlanmayacak. İskelet kurulacak, **veri kaynağına Ağustos'ta (2026/27 başlayınca) tekrar bakılacak** — actor güncel sezonu veriyorsa widget kendiliğinden dolar, vermiyorsa kaynak değişir (ücretli API-Football planı / başka actor / actor'ın Issues sekmesine bildirim).

- [x] **GS salonu 3 sütuna geçti: yaldızlı indeks + widget rafı (2026-07-17, commit `31624fd`) — canlıda doğrulandı**: `GsHall` artık `.body` grid'i ile üç sütun (≥1100px: `11rem / 1fr / 19rem`; altında tek sütun — nav gizlenir, raf içeriğin altına düşer).
  - **Sol `GiltNav`** (client, `components/sport/GiltNav.tsx`): IntersectionObserver scroll-spy, bölümler `01 Genel Bakış / 02 Mevcut Kadro / 03 Efsaneler`, numaralar dikey (kapı adları deseni), aktif madde altın. `rootMargin: -20%/-70%` ile "ekranın üst üçte birindeki bölüm aktif".
  - **Sağ `WidgetRail`** (server, `components/sport/WidgetRail.tsx`): (1) **Sonraki maç** + `NextMatchCountdown` (client, hydration uyumsuzluğu olmasın diye ilk render'da boş, sayaç mount sonrası başlar); (2) **Süper Lig tablosu** — GS + komşuları (±2), tam tablo `<details>` içinde (JS'siz), GS satırı altın vurgulu; (3) **Kadro künyesi** — mevcut/yaş ortalaması/mevki dağılımı, TM sync verisinden hesaplanır.
  - **Bayat-veri koruması (önemli)**: tablo YALNIZCA `standings.season === içinde bulunduğumuz sezon` ise render edilir (sezon Temmuz'dan itibaren döner). Bugün cache 2025, türetilen sezon 2026 → widget "Sezon yaklaşıyor" boş-durumunda. Kaynak 2026/27'yi vermeye başlayınca **kod değişmeden** kendiliğinden dolar; kaynak bayat kalırsa boş-durumda kalır (bayat tabloyu canlıymış gibi göstermez).
  - Evren açıklaması hero'dan "Genel Bakış" bölümüne taşındı (nav hedefinin içeriği olsun + metin iki kez görünmesin diye); `.lede` sınıfı artık kullanılmıyor.
  - **Canlı doğrulama** (1440px + mobil): üç sütun render oluyor, scroll-spy aktif maddeyi değiştiriyor (Genel Bakış → Mevcut Kadro), raf sticky, künye gerçek veriyle dolu (36 oyuncu, yaş ort. 24.2, 11 orta saha / 11 defans / 10 forvet / 4 kaleci), iki widget da doğru boş-durumda. Mobilde (375px) nav `display:none`, raf altta, **yatay taşma yok**.
  - **Kapsam dışı bırakıldı**: kullanıcının istediği **"04 Unutulmaz Anlar"** — veri modeli YOK (`SportBundle` = players/legends/races/standings). Boş nav maddesi koymak yerine ertelendi; model + admin UI gerekiyor. **Piyasa değeri** künyeye konulamadı: `/football/squad` yanıtı (`SquadPlayer`) `marketValueInEur` taşımıyor — TM tablosunda veri var, backend'in DTO'suna eklenmesi gerekir.
  - **Küçük i18n açığı**: kadro kartlarındaki mevki etiketleri TM verisinden geldiği için İngilizce ("ATTACK/DEFENDER/MIDFIELD/GOALKEEPER") — künye dağılımında da öyle. Kural 1 için mevki→çeviri anahtarı eşlemesi gerekir (mevcut davranış, bu turda değişmedi).

- [x] **Kadro kompaktlaştırma + Transfer Haberleri modülü (2026-07-17, commit `66a7c54`) — canlıda uçtan uca doğrulandı**:
  - **Kadro**: kartlar 210×150'den ~148×104'e küçüldü (fotoğraf 72→44px sağ üste, forma no 4.4rem→2.4rem alta, isim 1.35→1.05rem). Grid `minmax(210px→148px)` — **telefonda tek sütuna düşme sorunu bunun sonucuydu**, artık 375px'te 2 sütun (166px kart, taşma yok). Yeni `SquadGrid.tsx` (client) ilk **5 oyuncuyu** gösterir, "Tümünü göster (36)" ile tam kadroya açılır. Lokalde doğrulandı: 5 → 36 → 5, masaüstü 4 sütun / mobil 2 sütun. Not: toggle yalnızca API (TM) kadro yolunda; admin `bundle.players` fallback'i (şu an kullanılmıyor) eski haliyle duruyor.
  - **Haberler → Transfer Haberleri**: yeni `TransferNews` Prisma modeli (evrene bağlı, `tmPlayerId` ile TM oyuncusuna **isteğe bağlı** bağlantı, `body` sanitize edilmiş HTML, `sourceUrl`, `publishedAt`). Migration elle yazıldı (`20260717120000_add_transfer_news`) ve **`prisma migrate diff` çıktısıyla birebir eşleştiği doğrulandı**. Backend `src/transfer-news/*` (ambient-tracks deseni): public `GET /transfer-news/universe/:slug`, admin CRUD + `GET /transfer-news/players?q=` (form oyuncu seçici, yerel TM kadrosundan). **Tasarım kararı**: fotoğraf/mevki/yaş/piyasa değeri habere KOPYALANMAZ, TM kaydından okunur → kadro sync'i tazelendiğinde künye kendiliğinden güncellenir (tek kaynak-doğruluk).
  - Frontend: `components/sport/TransferNews.tsx` (künye + tarih + başlık + metin + kaynak linki), GsHall'da `#haberler` bölümü (`Haberler` başlığı + `Transfer Haberleri` alt başlığı) ve nav 03'e eklendi (sıralama: Genel Bakış / Mevcut Kadro / Haberler / Efsaneler). Admin: `/admin/transfer-news` (RichTextEditor + evren + oyuncu seçici + kaynak linki), admin ana sayfasına link. Tüm metinler i18n (TR/EN).
  - **Canlı test**: İcardi'ye bağlı Türkçe karakterli test haberi oluşturuldu (`--data-binary` yerine PowerShell'de açık UTF-8 bayt gönderimi — mojibake yok), sayfada "Mauro Icardi · Centre-Forward · 33 · 6 M € · 17 Temmuz 2026 · başlık + metin" olarak render edildi, **sonra silindi** (canlıda test içeriği kalmadı).
  - **Bu tur lokalde denetlendi**: frontend lint + build temiz, backend `prisma generate` + `nest build` temiz (Node kurulduğu için artık deploy'dan önce yakalanıyor).

- [x] **Kadro 5'li tek sıra + oyuncu künye sayfası + elle kadro/haber düzeltmeleri (2026-07-17 öğleden sonra) — lokalde doğrulandı, canlı kontrol EVDE yapılacak**:
  - **Kadro tek sıra**: `minmax(148px→120px)`. İçerik sütunu ≥1360px'te ~768px'e sabit (body 84rem − 11rem indeks − 19rem raf), 120px orada tam **5 sütun × 144px = tek satır** verir. Sabit `repeat(5,1fr)` YAZILMADI: 1100–1250px'te kartlar 110px'e inip okunmaz olurdu; `minmax` dar ekranda kendiliğinden 4/3/2'ye düşüyor. Mobil 375px → 2 sütun (166px).
  - **Alt başlık düzeltildi**: `Transfer Haberleri` 0.62rem + `--text-muted` idi → ölçüldüğünde **9.92px soluk gri**, kullanıcı bulamadı (haklı olarak). Artık 0.8rem + `--gs-cream` + altın gradient çizgi.
  - **Oyuncu künye sayfası (`/futbol/oyuncu/[id]`) — 3 ayrı hata düzeltildi**: (1) `getPlayer` **her zaman** `statistics: []` döndürüyordu (TM geçişinde yarım kalmış, kodda "şimdilik boş tablo" notu vardı) → sayfa hangi oyuncuda olursa olsun "{sezon} sezonu için istatistik bulunamadı" gösteriyordu. Bu bir VERİ sorunu değil, kod sorunuydu. (2) "2024" gerçek sezon değil, `TM_SEASON` env varsayılanı. (3) **"181 CM CM"**: backend `"181 cm"` döndürüyor, frontend bir `cm` daha ekliyordu. **Çözüm**: `getPlayer` artık `{ player: {...} }` döndürüyor (`season`/`statistics` alanları KALDIRILDI — API kontratı değişti), sayfa gerçek künyeyi gösteriyor: kulüp, mevki, doğum tarihi, boy, ayak, piyasa değeri + TM profil linki. Maç istatistikleri TM'de var (`TmGame`) ama sync edilmiyor — sıradaki iş, bkz. 0c.
  - **Transfer haberine kulüpte olmayan oyuncu**: kullanıcı uyardı — transfer hedefleri TM kadromuzda bulunmaz (sync yalnızca mevcut kadroyu tutar). `TransferNews`'e `manualPlayerName/Photo/Facts` eklendi (migration `20260717133000`), admin formunda "Kadroda yok — künyeyi elle gir" seçeneği (ad + fotoğraf yükleme + serbest künye satırı). TM kaydı varsa o kazanır.
  - **KAYNAK VERİ BULGUSU — Kaggle da geride**: Kullanıcı "İcardi kulüpten ayrıldı ama kadroda görünüyor" dedi. **Elle taze sync tetiklendi (2026-07-17 10:51) → yine 36 oyuncu, İcardi hâlâ GS'de.** Sync kodu DOĞRU (ayrılanları `currentClubId: null` yapan mantık var, kontrol edildi); **Kaggle `player-scores` veri setinin kendisi 2026 yaz transferlerini yansıtmıyor**. Yani hem Apify (Süper Lig, 11. haftada donmuş) hem Kaggle (kadro) ücretsiz kaynakları güncel sezonda geride — **ortak kalıp**.
  - **Çözüm: `SquadOverride` (kullanıcı kararı)** — migration `20260717140000`. `getSquad` artık TM sync'inin **ÜSTÜNE** düzeltme uyguluyor: `tmPlayerId` dolu kayıt → o oyuncu gizlenir (ayrıldı); `name` dolu kayıt → kadroya elle eklenir (yeni transfer, id `manual:<id>` — TM id'leriyle çakışmaz, profil sayfası yok). **Sync bunları EZMEZ** — "sadece İcardi'yi DB'den kaldır" seçeneği reddedildi çünkü bir sonraki sync geri getirirdi. Admin: `/admin/squad` (kadro listesi + "Kadrodan çıkar", "Yeni Transfer Ekle" formu, yapılan düzeltmeler geri alınabilir). Admin uçları: `GET/POST/DELETE /admin/football/squad-overrides`.
  - **Denetim**: backend `prisma generate` + `nest build` temiz, frontend lint + `tsc --noEmit` temiz, **iki migration da `prisma migrate diff` çıktısıyla eşleşiyor**, JSON'lar geçerli. Lokalde: GS/oyuncu/ana sayfa 200, kadro 5 kart tek sıra, künye sayfası eski API'ye karşı bile çökmüyor.
  - **EVDE İLK İŞ — CANLI DOĞRULAMA YAPILMADI**: (1) Deploy başarılı mı (2 migration uygulanacak); (2) `/futbol/oyuncu/68863` künyesi dolu geliyor mu (kulüp/mevki/boy/ayak/değer); (3) `/admin/squad`'dan **İcardi kadrodan çıkarılacak** (asıl istek); (4) `/admin/transfer-news`'te "elle gir" seçeneğiyle bir transfer hedefi haberi denenecek. Admin panel lokalde ÇALIŞMAZ (prod CORS localhost'u kabul etmiyor) — bunlar canlıda yapılmalı.

- [x] **Yazım Atölyesi — adım 1 (2026-07-28)**: Campfire benzeri yazım/lore ortamının çekirdeği. `/admin/atolye/[universeSlug]` (yönetim panelinin ilk kartı → Temürkan Efsaneleri). Üç sütun: **sol** El Yazması (bölümler, seçili satırda ↑↓ ile sıralama, taslak noktası) + 7 wiki kategorisi, her birinde `+` ile anında yeni kayıt; **orta** başlık satırı + mevcut TipTap editörü — **bölüm ve wiki kaydı aynı editörde** yazılır (lore için ayrı forma gitmek gerekmez), yazım durunca 1,5 sn'de otomatik kayıt, odak modu yan sütunları gizler; **sağ** künye paneli (bölümde özet/yayın/sıra/kelime sayısı, kayıtta kategori/spoiler seviyesi, tam forma link). Mobilde tek sütun + alttan Ağaç/Yazı/Künye şeridi (44px).
  - **Şema**: `Story.orderIndex` (+ `@@index([universeId, orderIndex])`, migration `20260728090000_add_story_order_index`) — bölümler artık yayın tarihine göre değil okuma sırasına göre. Migration mevcut bölümleri `publishedAt`/`createdAt` sırasına göre numaralandırır, yani deploy sonrası sıra bugünküyle aynı kalır. Evren detay sayfası da bu sıraya geçti.
  - **Uçlar**: `PATCH /admin/stories/reorder` (`{ids: []}`, tek transaction; `':id'` rotasından ÖNCE tanımlı), `GET /admin/stories?universeId=` (süzgeç + sıraya göre listeleme). `StorySummary` tipine `orderIndex`/`universeId` eklendi.
  - **Denetim**: backend `prisma generate` + `tsc --noEmit` temiz, frontend `tsc --noEmit` + lint + `next build` temiz. Lokalde atölye kabuğu (üç sütun, ağaç, boş durumlar) doğrulandı; **veri gelmiyor** çünkü prod CORS localhost'u kabul etmiyor — kullanıcı bunu bilerek push dedi, **canlıda doğrulanacak**.
- [x] **Yazım Atölyesi — adım 2 (2026-07-28)**: metin ↔ lore bağı kuruldu.
  - **Şema**: `WikiEntry.aliases String[]` (takma adlar — yalnızca tarama/öneri içindir, ilişki kaynağı DEĞİL) + `StoryEntryLink` join tablosu (migration `20260728140000_add_lore_links`). Elle yazılan migration `prisma migrate diff --from-empty --to-schema` çıktısıyla birebir doğrulandı (Prisma 7'de `--to-schema-datamodel` KALDIRILDI, `--to-schema` kullanılıyor).
  - **Editör**: `frontend/lib/editor/loreMention.ts` — özel TipTap Mark, `<span class="lore-mention" data-entry-id data-entry-slug>` yazar. **RichTextEditor'da her zaman kayıtlı** (yalnızca atölyede değil): eski hikâye/wiki formlarında bir bölüm açıldığında tanınmayan mark olarak düşürülüp bağlantıların silinmemesi için şart. `@tiptap/core` doğrudan bağımlılık değil — `@tiptap/react` üzerinden import edilir. Yeni paket KURULMADI (`@tiptap/extension-mention` + suggestion + tippy yerine kendi öneri UI'ımız: `MENTION_QUERY` regex + `coordsAtPos` + `editorProps.handleKeyDown`).
  - **Atölye sağ paneli**: imleç bir işaretin üstündeyken kaydın künyesi (kategori/takma ad/metin önizlemesi, önizleme tek sefer çekilip cache'lenir) + **"Bu Bölümde Geçenler"**: ❖ bağlanmış işaretler, soluk nokta = adı/takma adı metinde geçiyor ama bağlanmamış (`findMentionedEntries`, Türkçe I/İ için `toLocaleLowerCase("tr")`, sözcük başı kontrolü var, ek almış hâller sayılır). Element künyesine takma ad alanı eklendi.
  - **Backend**: sanitizasyon `span`da `data-entry-id`/`data-entry-slug`a izin veriyor; `stories.service` kayıtta içerikten bağları türetip `StoryEntryLink`i senkronluyor (başka evrenin kaydına yapılan işaret bağ üretmez — kural 6); genel bölüm ucu (`GET /stories/:slug`) bağlı kayıtların künyesini `entries` olarak döndürüyor (okuma panelinde ikinci istek yok).
  - **Okuyucu**: `LoreDossier` — belge düzeyinde tıklama dinleyicisi (sayfalı okuyucu hangi sayfada olursa olsun çalışır), masaüstünde 340px sağ çekmece / mobilde alttan yaprak, Esc ile kapanır, spoiler kapısı `lib/wiki/spoiler` kuralını izler. `.lore-mention` stili `globals.css`te (hem editör hem sunucudan gelen HTML aynı sınıfı kullanıyor, CSS module kapsamı işe yaramaz): link mavisi değil, noktalı ince iz.
  - **Denetim**: backend `prisma generate` + `tsc` temiz, frontend `tsc` + lint + `next build` temiz. Lokalde okuma ekranında doğrulandı (işaret görünümü, tıklayınca panel, masaüstü/mobil ölçüler). **Atölyenin içi lokalde denenemedi** — prod CORS localhost'u kabul etmiyor, `@` önerisi ve sağ panel canlıda test edilecek.

- [x] **Lokal geliştirme köprüsü — dev proxy (2026-07-28)**: `frontend/app/api/dev-proxy/[...path]/route.ts`. Sorunun kökü: genel sayfalar veriyi **Next sunucusundan** çeker (CORS yok, lokalde gerçek veriyle açılırlar), admin ekranları ise **tarayıcıdan** çeker ve prod `CORS_ORIGIN` `http://localhost:3000`'i tanımadığı için tarayıcı isteği düşürür. Bu yeni bir kısıt değildi — ilk kez admin tarafında bir şey geliştirdiğimiz için görünür oldu. Çözüm prod'a dokunmadan: `apiFetchUrl()` (client.ts) geliştirmede + tarayıcıda `/api/dev-proxy/...` döndürür, sunucu tarafı ve üretim doğrudan API'ye gider. Rota üretimde 404; istemci dalı prod derlemesinde tamamen eliniyor (build çıktısında `dev-proxy` izi yok, doğrulandı). Ölçüm: proxy üzerinden genel uç 200, korumalı uç 401 `AUTH.TOKEN_MISSING` (yani istek API'ye ULAŞIYOR — öncesi "Failed to fetch" idi).
  - **UYARI**: lokal admin artık **canlı veritabanına** yazar. Lokalde bir bölümü silmek gerçekten siler, yüklenen görsel sunucunun diskine gider.
  - **Lokalde ne çalışır**: tüm genel sayfalar + admin/atölyenin tamamı (giriş, yazma, otomatik kayıt, `@` bağlama, yükleme). **Ne çalışmaz**: backend (NestJS/Prisma) — `DATABASE_URL` yok, DB dışarı kapalı, Docker yok. Backend değişiklikleri yazılıp `tsc`/`build` ile doğrulanır, gerçek çalışması ancak push sonrası görülür.
- [x] **Salon 02 · Film — "Projeksiyon Salonu" (2026-07-28)**: film kapısı (`/dark-stories/category/film`) artık kişisel film arşivi salonunu açıyor (kategori sayfasında `slug === "film"` dalı, spor derisiyle aynı desen).
  - **Şema**: `MovieEntry` (tmdbId, `MovieStatus` WATCHED/WATCHLIST/REWATCH, `isFavorite` bayrak — favori bir durum DEĞİL, izlenmiş film aynı anda favori olabilir; personalRating/Note, watchedAt, externalData snapshot) + migration `20260728170000_add_movie_entry`, Prisma çıktısıyla birebir doğrulandı. `Review`un yerine geçmez: Review uzun yazılmış inceleme, bu koleksiyon takibi (kural 13 ruhu).
  - **TMDB**: `movies/tmdb.service.ts`, mevcut `ExternalCache` üzerinden 7 gün TTL; dış istek başarısızsa bayat cache sunulur, kullanıcıya hata gösterilmez (kural 4/14). **Anahtar sırası**: `TMDB_READ_ACCESS_TOKEN` → `TMDB_API_KEY`. **Biçim otomatik ayırt edilir**: `eyJ` ile başlıyorsa v4 jetonu → `Authorization: Bearer`, değilse v3 anahtarı → `api_key` sorgu parametresi. Anahtar UltNexus'takiyle aynı olabilir (TMDB anahtarı uygulamaya bağlı değil). Kullanıcı 2026-07-28'de Coolify'a girdi.
  - **UltNexus'un TMDB uçlarını kullanma seçeneği REDDEDİLDİ** (kullanıcı kararı): iki uygulamanın aynı Coolify ağında olduğu doğrulanamadı ve UltNexus çökerse film salonu da düşerdi. Kendi backend'imiz + kendi cache'imiz.
  - **Tasarım kararları (prompt'tan bilerek sapılan yerler)**: accent mor `#7c5cff` değil **kehribar `#d9a13f`** — ana sayfadaki film kapısından zaten kehribar ışık sızıyor (`--door-film-a`), mor kapının verdiği sözü bozardı. 4 istatistik kartı yerine **tek künye satırı**. "Coolify Connected" rozeti kaldırıldı (altyapı bilgisi, arayüz bilgisi değil). Poster oranı 4:5 değil **2:3** (gerçek poster oranı, kırpma yok). Tür çipleri ve yönetmen listesi **arşivden türetiliyor**, elle yazılmıyor (yönetmenlerde favoriler ×2 ağırlıklı). Tailwind/shadcn KURULMADI — CSS Modules + token sistemi korundu (kullanıcı onayı).
  - **İmza öğesi**: "Son İzlenenler" yatay poster sırası değil, perforasyonlu **35 mm film şeridi** (CSS radial-gradient ile delikler).
  - **Yönetim**: `/admin/film` — TMDB'de ada göre ara, sonuçtan seç, durum + tarih + puan + not + favori ile ekle; listeden durum/favori değiştir, sil.
  - **Denetim**: backend `tsc` temiz, frontend `tsc` + lint + `next build` temiz. Örnek veriyle lokalde doğrulandı: masaüstü 6 sütun / favoriler duvarı 4 sütun / mobil 2 sütun, yatay taşma yok, TMDB posterleri yükleniyor, sekme sayaçları doğru. **Gerçek veriyle canlıda denenmedi.**

- [x] **Film salonu — ilk kullanım düzeltmeleri (2026-07-28, kullanıcı geri bildirimi)**: dördü de kök sebebiyle bulundu, tahminle değil.
  - **Salon numarası çelişkisi** (ana sayfada 01, içeride 02): numara iki yerde ayrı hesaplanıyordu. `lib/halls.ts` tek kaynak oldu (`HALL_ORDER`, `sortByHallOrder`, `hallNumber`, `hallLabel`); ana sayfa da salon başlıkları da oradan okuyor. `FilmHall` artık `hallLabel` prop'u alıyor, sabit metin yok.
  - **"Eklediğim film sayfada yok"**: film ASLINDA arşivdeydi (API'de görüldü) — `fetchMovieArchive` `next: { revalidate: 300 }` ile 5 dk önbellekliydi. `cache: "no-store"` yapıldı; istek kendi DB'mize gidiyor, dış maliyet yok.
  - **"Admin özelliklerim kayboluyor"**: header'daki "Admin Paneli" bağlantısı `/admin/dashboard`'a gidiyordu — **öyle bir sayfa hiç yoktu** (canlıda 404 doğrulandı, `/admin` 200). `/admin`'e çevrildi; admin çerezli istekle `href="/admin"` doğrulandı. Header nav mobilde de görünüyor (gizleyen media query yok).
  - **Salon girişi (lobi)**: film kapısı artık doğrudan arşive değil `FilmLobby`ye açılıyor; arşiv `…/category/film/arsiv` statik alt yolunda (statik segment `[categorySlug]` dinamik yolundan önce eşleşir, ayrı bir route ağacı veya redirect gerekmedi). **Yeni başlık eklemek = `lib/film/sections.ts`'e bir satır + o yolda bir sayfa**; lobi kendini günceller. Her bölüm kartı canlı sayısını taşır ("Film Arşivi · 1 film · 0 sırada") — tek bölümle bile yer tutucu gibi durmasın diye.
  - **Denetim**: `tsc` + lint + `next build` temiz; lobi/arşiv lokalde 200, "Salon 01 · Film" ikisinde de doğru, eklenen film rafta görünüyor.

- [x] **Küratör modu — film salonu pilotu (2026-07-28 akşam, ev makinesi)**: Düzenleme artık `/admin`'e gitmeden sayfanın üstünde yapılabiliyor. Kullanıcı sorusu: "filmi doğrudan arşiv sekmesinden ekleyemez miyim, /admin yerine siteden giriş yapamaz mıyım?" — **kayıt (`/register`) AÇILMADI** (bilinçli kapalı, tek kullanıcı admin); istenen şey aslında giriş + yerinde düzenlemeydi.
  - **İş bölümü kararı**: sık/tek adımlık/bağlamı önemli işler sayfa üstünde (film ekleme, favori, durum), nadir/yapısal/toplu işler `/admin`'de (evren-kategori, wiki listesi, silme dökümü). `/admin/film` KALDIRILMADI — ikisi aynı uçları çağırıyor.
  - **Oturum tek kaynağa alındı**: `lib/auth/session.ts` → `readIsAdmin()`. `layout.tsx`teki satır içi JWT çözme oraya taşındı, film arşiv sayfası da aynı yardımcıyı kullanıyor. **İmza DOĞRULANMIYOR** (dosyada yazılı): bu bilgi yalnızca kontrolleri gösterip gizlemek için; gerçek yetki her istekte backend'de (kural 6). Sahte çerezle düğmeleri gören biri işlem yapamaz — bu daldan gizli veri geçirilmemeli.
  - **Header'dan giriş**: `AccountMenu` artık tema + oturum taşıyor — ziyaretçide "Giriş yap" (form panelin içinde açılır), adminde "Admin Paneli" + "Çıkış yap". Giriş sonrası `router.refresh()` → sunucu `isAdmin`i yeniden hesaplar, bulunulan sayfadaki küratör kontrolleri belirir (yeniden yükleme gerekmez). `AdminGuard` (tam sayfa kapısı) olduğu gibi bırakıldı; giriş mantığı iki yerde duruyor, bilinçli (çalışan ekrana dokunulmadı).
  - **Salonda küratör modu**: `FilmHall`e `isAdmin` prop'u + başlık altında anahtar. Açıkken `components/film/FilmCurator.tsx` (TMDB arama şeridi + kart altı favori/durum/çıkarma) **`next/dynamic` ile tembel** yüklenir — ziyaretçinin tarayıcısına bu JS inmez (build: `/dark-stories/category/film/arsiv` 5.5 kB, küratör ayrı chunk). Ekleme şeridi boş salonda da görünür (ilk film oradan eklenir). Mutasyondan sonra yerel durum güncellenmez, `router.refresh()` çağrılır → sayaçlar/istatistikler tek kaynaktan doğru kalır.
  - **Denetim**: `tsc --noEmit` + lint + `next build` temiz. Lokalde doğrulandı: ziyaretçide küratör anahtarı YOK ve menüde giriş formu var; sahte `role:ADMIN` çereziyle anahtar beliriyor, mod açılınca arama şeridi yükleniyor ve ipucu metni çıkıyor; hata yolu mesaj veriyor; 375px'te yatay taşma yok.
  - **LOKALDE DOĞRULANAMADI (ev makinesi ağ kısıtı)**: dev sunucusunun dışarı çıkışı kapalı (`next build` sırasındaki "Retrying" satırları ve dev-proxy 502 aynı sebep) — PowerShell'den `https://api.kuronexus.com/movies` 200 dönüyor ama Node süreci erişemiyor. Bu yüzden **gerçek giriş, gerçek TMDB araması ve gerçek ekleme canlıda denenecek**.

- [x] **KÖK SEBEP: admin tespiti hiç çalışmıyormuş (2026-07-28 gece, commit `c8a9698`)**: Kullanıcı canlıda giriş yaptı, menü hâlâ "Yönetici girişi" diyordu ve küratör düğmesi gelmiyordu.
  - **Sebep**: `auth.service.ts:37` JWT payload'ına yalnızca `{ sub, email }` koyuyor; rol her istekte DB'den doğrulanıyor (kural 6 — `jwt-auth.guard.ts`'in kendi yorumu: "token payload'ındaki role güvenilmez"). Sunucu tarafındaki `isAdmin` ise `payload.role === "ADMIN"` bakıyordu → **gerçek girişten sonra HER ZAMAN false**.
  - **Bu kontrol 2026-07-12'de `layout.tsx`'e eklendiğinden beri kırıkmış**; o gün ve 2026-07-28'de "elle üretilmiş admin çerezi" ile test edildiği için sahte token `role` taşıyor ve doğru çalışıyor görünüyordu. Yani header'daki "Admin Paneli" linki hiçbir zaman gerçek girişle belirmedi — kullanıcının 28 Temmuz'daki "admin özelliklerim kayboluyor" şikâyetinin asıl sebebi büyük ihtimalle buydu (o gün yalnızca linkin `/admin/dashboard`'a gitmesi düzeltilmişti, görünürlük sorunu değil).
  - **Düzeltme**: `readIsAdmin()` artık çerezdeki token'la `GET /auth/me` çağırıyor — rolü kaynağından okuyor. Token yoksa istek yapılmaz (ziyaretçiye maliyet sıfır), geçersiz/süresi dolmuş token 401 → ziyaretçi. `react cache()` ile layout + sayfa aynı render'da tek istek yapar.
  - **DERS**: kimlik/rol içeren bir arayüz dalını **elle üretilmiş çerezle test etme** — sahte token gerçek token'ın taşımadığı alanları taşıyabilir, test yeşil yanar ama üretimde çalışmaz. Gerçek giriş akışıyla doğrula.
  - Yanında: girişli durum artık menü düğmesinin kendisinden belli ("Tercihler" yerine accent renkli **"Admin"**), formu açan düğme "Yönetici girişi" (submit'le aynı metni taşıyordu), tazeleme `try` bloğundan çıkarıldı (orada oluşan hata "şifren yanlış" gibi görünüyordu) ve giriş/çıkış sonrası tam sayfa yenileme yapılıyor.

- [x] **Film salonu görsel yeniden tasarım — yan duvarlar + bölüm düzeni (2026-07-28 gece)**: Kullanıcı isteği: geniş ekranda sağ/sol boşluk düz renk kalmasın, sayfa "Letterboxd + Netflix + modern sinema arşivi" hissi versin; küratör modu bozulmasın.
  - **Düzen**: `.hall` tam genişlikte sarmalayıcı → içinde `position: fixed` yan duvarlar (`FilmBackdrop`) + ortalanmış `.page` sütunu (1180px, tek değişken `--film-content-w`, duvar genişliği ondan türetiliyor: `(100vw − sütun)/2 + 80px` — duvar içeriğin altına biraz girer, maske orayı soldurur, kesik kenar olmaz).
  - **Yan duvarlar dış görsel KULLANMIYOR**: arşivin kendi TMDB posterlerinden eğik iki sütunlu mozaik (opacity .22, blur 3px, saturate .6). Poster sayısı 4'ten azken mozaik hiç basılmıyor — tek poster on iki kez tekrar edince duvar değil duvar kâğıdı oluyor. Altta her hâlükârda CSS ile kurulmuş sahne var: perde kıvrımları (`--film-curtain`), projeksiyon huzmesi (conic-gradient + `--film-dust`), dış kenarda dikey 35 mm perforasyon rayı (şeritteki desenin devamı), vinyet ve SVG feTurbulence greni (`mix-blend-mode: overlay`). Stok/telifli film karesi indirilmedi, dış host eklenmedi.
  - **Bölümler**: sekmeler kaldırıldı, raflar üst üste bölüm oldu — künye kartları (İzlediğim/İzleyeceklerim/Favorilerim/Toplam Süre; süre ve favori sayısı istemcide `runtime`/`isFavorite`'ten hesaplanıyor, backend'e alan eklenmedi) → 35 mm şerit → tür süzgeci (artık tüm bölümlere birden uygulanıyor) → İzlediğim Filmler → İzleyeceklerim → **Tekrar İzlenecekler (yalnızca doluyken)** → Favoriler duvarı → yönetmenler. Rewatch bölümü kullanıcının listesinde yoktu ama bırakıldı: kaldırılsa o durumdaki filmler sayfadan tamamen kaybolurdu.
  - **Ölçekler**: ≤1440px duvar opacity .62, ≤1100px `display: none` (mobilde hiç çizilmez). Kartlar `color-mix(... transparent)` + `backdrop-filter: blur()` ile yarı saydam.
  - **Küratör moduna dokunulmadı** — `CuratorBar` künye kartlarının altında, `CuratorCardTools` hem poster kartında hem favori levhasında duruyor.
  - **Doğrulama**: `tsc` + lint + `next build` temiz. Lokalde **geçici bir fikstürle** (14 film, commit'ten önce geri alındı) ölçüldü: 1680px'te iki duvar 330px ve tam yükseklik, `position: fixed` (kaydırınca sabit kaldı), `pointer-events: none`, 24 mozaik karesi yüklendi, içerik sütunu 1180px ve ortalanmış (z-index 1); 1280px'te opacity .62; 375px'te duvar yok, 2 sütun, yatay taşma yok. **Ekran görüntüsü alınamadı** (tarayıcı paneli bu oturumda görüntülenmiyor) — gerçek arşivle görsel onay kullanıcıda.

- [x] **Film salonu: Öneriler rafı + raf sayfaları + süzgeç/sıralama (2026-07-28 gece)**: Kullanıcı istekleri, dördü de eklendi (öneriler yalnızca küratör modunda, kaynak "popüler + sana benzeyen" karışık — kullanıcı kararı).
  - **Backend**: `GET /admin/movies/suggestions`. `TmdbService`e cache'li liste uçları eklendi (`trending`, `popular(page)`, `recommendations(id)`; listeler için 24 saat TTL, öneriler 7 gün — künye okumasıyla aynı bayat-cache davranışı). `MoviesService.suggestions()` gündem (trend+popüler×2) ile zevk (favorilere benzeyenler, en fazla 3 tohum) havuzlarını ayrı karıştırıp **dönüşümlü** diziyor. **Arşivde bir kez yer almış her tmdbId elenir — soft-delete edilmişler dahil** (çıkardığın filmi geri önermesin). Havuz ~40 döner; onluk seçim, "Yenile" ve "ilgilenmiyorum" istemcide → her yenilemede TMDB'ye gidilmez.
  - **Raf sayfaları**: `/dark-stories/category/film/arsiv/[shelf]` (`izlediklerim`, `izleyeceklerim`, `favorilerim`, `tekrar-izlenecekler`). Salon sayfasında her raf artık **tek satır (6 afiş)** + sağ altta "Tümünü göster"; raf başlıkları kendi sayfasına link. Raf sayfasında 60 afiş, sağ altta "Daha fazla" bir 60 daha ekler. Süzgeçler (tür çipleri + sıralama + dönem) **URL'e yazılıyor** (`?tur=&sirala=&donem=&sayfa=`), süzgeç değişince sayfa sayacı sıfırlanıyor. Sıralama: TMDB puanı ↓↑, kendi puanım ↓, yıl ↓↑, ad (tr locale). Dönem: 2026→2020 tek tek, sonra 2010'lar/2000'ler/1990'lar/1980'ler/daha eski ("2020'ler" YOK — tek tek yıllarla çakışırdı). Sayfalama istemcide: arşiv zaten tek istekte geliyor.
  - **Ekstralar**: "Bu akşam ne izlesem?" (izleyeceklerim'den rastgele), küratör modunda sırada bekleyen filmde tek tıkla ✓ "izledim" (tarih bugün).
  - **Paylaşılan parçalar**: `components/film/MovieCard.tsx` (Poster + MovieCard, iki sayfa da kullanıyor), `lib/film/shelves.ts` (raf anahtarı ↔ URL parçası tek yerde), `lib/film/filters.ts` (sıralama/dönem kuralları). Puanı olmayan film hangi yönde sıralanırsa sıralansın sona düşer.
  - **BULUNAN TUZAK (önemli)**: Raf sayfası ilk sürümde `<Suspense>` ile sarılmıştı (useSearchParams için refleks) — **fallback'siz Suspense sınırı alt ağacın hidrasyonunu tamamen engelledi**: sayfa görünüyordu ama hiçbir düğme çalışmıyordu (`.hall` düğümünde React fiber yok). Sayfa zaten `force-dynamic` olduğu için sınır gereksizdi; kaldırılınca düzeldi. Teşhis, DOM'da `__react*` anahtarlarına bakarak yapıldı — "tıklıyorum bir şey olmuyor" belirtisinin doğru testi bu.
  - **Doğrulama**: backend `tsc` temiz, frontend `tsc` + lint + `next build` temiz. Lokalde **geçici 70 filmlik fikstürle** (commit'ten önce geri alındı) ölçüldü: salonda her raf 6 afiş + doğru sayaç + "Tümünü göster"; raf sayfasında 60 → "Daha fazla" → 64 ve `?sayfa=2`; tür çipi sayfayı sıfırlıyor (`?tur=Korku`, 13 film); sıralama ve dönem URL'e ekleniyor (`&sirala=ratingDesc&donem=1990s` → 4 film, hepsi 1990'lar); "Bu akşam" rastgele film seçiyor; raf sayfalarında da yan duvarlar var; mobilde taşma yok. **Öneriler rafı lokalde denenemedi** (admin + backend gerekiyor) — canlıda doğrulanacak.

- [x] **Öneriler davranışı + salon girişi görselleştirme + salon adı tek kaynağa (2026-07-28 gece)**: Kullanıcı canlıda önerileri denedi, çalışıyor; üç istek geldi.
  - **Öneriler artık tıklayınca yenilenmiyor**: eskiden ekleme/eleme kartı listeden düşürüp havuzdan yedek çekiyor ve `router.refresh()` çağırıyordu → her tıklamada bütün ızgara kayıyordu. Artık kart **yerinde kalıyor**, yalnızca sönükleşip "✓ Eklendi" / "Elendi" oluyor; art arda birkaç film işaretlenebiliyor. Liste ve arşiv tazelemesi **yalnızca "Yenile"** ile: o an elden geçenler havuzdan düşürülüp yeni onluk çekiliyor ve `router.refresh()` orada çağrılıyor. Altta "{n} film eklendi — Yenile'ye basınca listelere işlenir" uyarısı var.
  - **Salon girişi (lobi) görselleştirildi**: `LobbyPosters` — iki yanda **tam boy tek afiş** (sol Matrix, sağ Yüzüklerin Efendisi). Arşiv duvarlarından bilinçli olarak daha canlı: mozaik yok, opaklık .62 (arşivde .22), bulanıklık yok, üstünde ince zemin karartması + huzme + vinyet + gren. İçerik dikeyde ortalandı (sayfa üstte toplanıp altta kocaman boşluk bırakıyordu), bölüm kartı yarı saydam + `backdrop-filter`.
  - **Afiş yolları koda GÖMÜLMEDİ**: yeni public uç `GET /movies/showcase` başlıkla TMDB'de arayıp yılı doğruluyor ve sonucu 30 gün cache'liyor (`movies:showcase:v1`). Anahtar yoksa/arama düşerse boş döner, lobi CSS sahnesiyle açılır. Afişi değiştirmek = `movies.service.ts`teki iki başlık sabitini değiştirmek.
  - **Salon adı tek kaynağa alındı**: `film.hall` çevirisi artık `"Salon {num} · {name}"` — "Film" kelimesi koddan çıktı. Ad `lib/halls.ts`teki yeni `hallName()` ile **kategori kaydından** okunuyor (lobi zaten öyleydi). **KARAR: ad "Film" olarak KALIYOR** — "Sinema" fikri kullanıcı tarafından geri alındı (2026-07-28). Yeniden adlandırma istenirse tek adım: `/admin/universe-categories`ten kategori adını değiştirmek; kapı, lobi ve salon başlıkları birlikte değişir, slug (`film`) ve rotalar etkilenmez. `film.hallName` yalnızca kategori okunamazsa devreye giren yedek (TR "Sinema", EN "Cinema") — bu yedek metin canlıda görünmüyor.
  - **Doğrulama**: backend `tsc` temiz, frontend `tsc` + lint + `next build` temiz. Lobi lokalde açılamadı (kategori listesi API'den geliyor, dev sunucusu ağa çıkamıyor) → **canlıda doğrulandı**: `GET /movies/showcase` iki afişi de çözüyor (Matrix `/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg`, YE `/37kdeAEyw8YlVLaAhYazBRAni9S.jpg`), lobide iki panel 550px genişlik + tam yükseklik, görseller yükleniyor, yatay taşma yok, başlık "Salon 01 · FİLM".

- [x] **Öneri havuzu genişledi + "ilgilenmiyorum" kalıcı oldu (2026-07-29, iş yeri makinesi)**: Kullanıcının iki geri bildirimi.
  - **Eleme artık veritabanında**: yeni `MovieSuggestionDismissal` modeli (`userId`+`tmdbId` benzersiz, migration `20260729100000_add_movie_suggestion_dismissal`) + `POST /admin/movies/suggestions/dismiss` ve `DELETE /admin/movies/suggestions/dismiss/:tmdbId`. Eskiden eleme yalnızca istemci belleğindeydi: sayfa yenilenince (ya da havuz yeniden çekilince) elenen filmler geri geliyordu. Artık elenen tmdbId havuz sorgusunda arşiv kayıtlarıyla aynı torbada (`known`) süzülüyor — bir daha hiç önerilmiyor. **Arşive dokunmaz**: elenen film arama ile her zaman eklenebilir. Yanlışlıkla elenirse aynı düğme (✕ → ↩) geri alıyor.
  - **Havuz üç ayaklı ve geniş**: `TmdbService.discover()` eklendi (`/discover/movie`, tür + dönem + sayfa + `vote_count.gte=200`, 7 gün cache). `suggestions()` her istekte 16 türden 6'sını, 7 dönem kovasından (tüm zamanlar / ≤1979 / 80'ler / 90'lar / 2000'ler / 2010'lar / 2020+) rastgele seçip 1–5 arası rastgele sayfa tarıyor. Dizim **keşif, zevk, keşif, gündem** dönüşümlü — keşif ağır basıyor, havuz 40'tan **60**'a çıktı. Zevk tohumları da artık karıştırılıyor (hep aynı 3 favoriden beslenmiyor, 4 tohum).
  - **Not**: Sonuçlar TMDB'de cache'lendiği için (tür/dönem/sayfa başına ayrı anahtar) her "Yenile" dış istek atmıyor; havuz tur tur genişliyor.
  - **Doğrulama**: backend `tsc` + prettier temiz, frontend `tsc` + lint + `next build` temiz. **Lokalde denenemez** (öneriler admin + backend istiyor, backend bu makinede çalışmıyor; yeni uçlar canlıda deploy olmadan dev proxy üzerinden de yok) → canlıda doğrulanacak.

- [x] **Salon 04 · Anime — Faz A çekirdeği (2026-07-29)**: Anime kanadı film salonunun deseniyle kuruldu; kapı → salon girişi (lobi) → **Anime Arşivim**.
  - **İki eksenli durum (tasarımın kalbi)**: "benim durumum" (`AnimeWatchStatus`: izliyorum/bitirdim/izleyeceğim/ara verdim/bıraktım/yeniden izliyorum) ile **yapımın durumu** (`airingState`: yayında/bekleniyor/tamamlandı/ara verildi/iptal) ayrı. İkincisi AniList'ten **türetilir**, elle işaretlenmez. "MHA bitti ama JJK devam ediyor" ancak böyle anlatılabiliyor; kartta iki ayrı rozet var.
  - **Kartın birimi seri, ilerlemenin birimi sezon**: `AnimeEntry` (franchise) + `AnimePart` (sezon/film/OVA). Ekleme sırasında AniList `relations` zinciri genişlik öncelikli gezilip (SEQUEL/PREQUEL/PARENT/SIDE_STORY, en fazla 14 halka) her halka bir part olur; sıra yayın tarihinden gelir. Serinin ilerlemesi ve yayın durumu part'lardan türetilir — iki yerde ayrı tutulmaz.
  - **Veri kaynağı AniList** (GraphQL, **anahtar gerektirmez** — TMDB gibi env kurulumu yok): durum, bölüm sayısı, `nextAiringEpisode` geri sayımı, stüdyo, kapak/banner, tür + **etiket** ve manga bağı. Cache deseni TMDB servisinin aynısı (`ExternalCache`, bayat kayıt yedeği); devam eden yapımlarda TTL 6 saat, bitmişlerde 7 gün.
  - **Tür süzgeci**: AniList'te "Shounen" bir **genre değil tag** (genre listesi 19 kalem; JJK yalnızca Action/Drama/Supernatural). Süzgeç genre + tag'i birlikte kullanıyor, çipler kullanım sıklığına göre sıralı, ilk 8 görünür, gerisi **"+N tür"** ile açılıyor (kullanıcı isteği).
  - **Raflar**: İzliyorum (en üstte, boşken bile görünür) → **Devamı Gelecek** (bitirdiğin ama yeni sezonu duyurulmuş seriler) → Bitirdiklerim → İzleyeceklerim → Ara Verdiklerim → Favorilerim → stüdyolar. Her raf salonda tek satır, tamamı `/arsiv/[shelf]` sayfasında (sayfalama yok — seri sayısı film sayısından bir mertebe küçük).
  - **Küratör modu**: AniList'te ara → ekle (sezonlar kendiliğinden iner); kartta **"+1 bölüm"** (günlük asıl eylem), favori, durum seçici, künye tazeleme (yeni sezon duyurulunca), arşivden çıkarma. Bütün parçalar bitmiş **ve** seri final yapmışsa durum kendiliğinden "bitirdim"e geçiyor (yayını süren seride geçmiyor).
  - **Şema Faz B'ye hazır**: `AnimePart.episodeMarks` (bölüm bölüm işaretleme: izledim/geçildi) ve `mangaChapter` ("S2 sonu = manga 137") alanları şimdiden var — Faz B'de yeni migration gerekmesin diye. Migration: `20260729140000_add_anime_archive`.
  - **Deri**: `[data-category="anime"]` taban paleti (mürekkep moru accent) + rozet token'ları (`--anime-airing-ink` soluk yeşil, `--anime-upcoming-ink` kehribar). Mockup'lardaki neon yeşil/sarı bilinçli olarak alınmadı (parlama yok ilkesi). Kanadın tam görsel kimliği Faz D.
  - **Doğrulama**: backend `tsc` + prettier temiz, frontend `tsc` + lint + `next build` temiz. Lokalde **geçici 5 serilik fikstürle** (commit öncesi geri alındı) ölçüldü: künye şeridi (5 seri / 1.502 bölüm / Shounen), 8 çip + "+9 tür", altı rafın hepsi doğru dolduruluyor, rozetler doğru (JJK BEKLENİYOR, One Piece YAYINDA + "1172. bölüme 4 gün", MHA TAMAMLANDI), raf sayfası ve lobi açılıyor, mobilde (375px) 2 sütun ve yatay taşma yok, konsol hatasız. Bulunan iki kusur düzeltildi: tek sezonluk yapımda başlık iki kez yazılıyordu, lobi metninde "izlediğim" tekrarı vardı. **Gerçek veriyle (AniList çağrıları, ekleme, +1 bölüm) doğrulama canlıda yapılacak** — backend bu makinede çalışmıyor.

- [x] **Anime Faz B — anime sayfası, bölüm ızgarası, filler (2026-07-29)**: Kullanıcı Faz A'yı canlıda kullandı (MHA + Naruto + JJK ekledi), üç geri bildirim geldi; üçü de yapıldı.
  - **Elle bölüm girişi**: 220 bölümlük Naruto'yu "+1 bölüm" ile ilerletmek işkenceydi. Artık küratör modunda sayaç (`14/23`) bir düğme: tıklayınca kutuya dönüşüyor, sayıyı yazıp Enter'a basınca ilerleme oraya atlıyor (Esc iptal). Sayıyı düşürmek de aynı yoldan. Bölüm ızgarasında bir bölüme tıklamak da "oraya kadar izledim" demek; izlenmiş bölüme tekrar tıklamak bir geri alıyor.
  - **Anime sayfası** (`/dark-stories/category/anime/[slug]`): banner + kapak + iki eksen rozet + künye (stüdyo/yıl/parça sayısı/puanlar) + **"Nerede kaldım"** şeridi + konu + **izleme sırası zaman çizelgesi** (her parça **kendi posteriyle**, açılır-kapanır) + **karakterler ve seslendirenler** (AniList, 12 kayıt, 30 gün cache) + **manga bağı**. Slug veritabanında tutulmuyor: backend başlıktan türetiyor, çakışırsa AniList numarası ekliyor — şema sade kalsın ve başlık değişince adres kendini düzeltsin diye.
  - **Bölüm ızgarası + filler**: yeni `JikanService` (`/anime/{malId}/episodes`, sayfalı, 400 ms aralıklı, en fazla 12 sayfa = 1200 bölüm). Filler bölümler soluk ve turuncu çerçeveli, "geçildi" kesik çerçeve + üstü çizili. **"Filler'ları geçildi say"** düğmesi hepsini tek hamlede işaretliyor ve üstte **kanon ilerlemesi** (`Kanon ilerlemen: 15/19`) ayrı gösteriliyor — Naruto'da 500 bölümün 200'ü filler, sayaç bunu ayırmazsa ilerleme yanlış okunuyor. Kaynak düşerse ızgara yine çiziliyor, yalnızca filler bilgisi olmuyor (`hasSourceData: false`).
  - **Zincir kotası düzeltildi (canlı veriden çıkan hata)**: ilk sürümde tek bir 14 halka sınırı vardı ve **filmler/OVA'lar kotayı doldurup sezonları dışarıda bırakıyordu** — canlıda MHA'nın 7. sezonu, Naruto'da Shippuden sonrası hiç inmemişti. Artık TV sezonları ayrı sırada ve önce geziliyor (`CHAIN_MAX_NODES` 34, yan yapımlara ayrı 14'lük kota). **Mevcut kayıtlarda eksik sezonları getirmek için kart üzerindeki ⟳ (künyeyi tazele) düğmesine basmak gerekiyor** — zincir yalnızca ekleme ve tazelemede kuruluyor.
  - **Doğrulama**: backend `tsc` + prettier temiz, frontend `tsc` + lint + `next build` temiz. Lokalde geçici fikstürle (commit öncesi geri alındı) ölçüldü: sayfa banner + 4 parça + her parçada kendi posteri, ızgarada 24 kare (18 izlendi, 5 filler), kanon ilerlemesi doğru hesaplanıyor, karakterler ve manga bölümü render oluyor, mobilde (375px) 9 sütunluk ızgara ve yatay taşma yok, konsol hatasız. **Gerçek Jikan verisiyle doğrulama canlıda.**

- [x] **Anime Faz B+ — hero, 3 katmanlı süzgeç, toplu işaretleme, haftalık sync (2026-07-29)**: Kullanıcı canlıda kullanıp beş geri bildirim + üç karar verdi.
  - **Güvenlik doğrulandı (soru üzerine)**: bölüm yazan uçlara token'sız `401 AUTH.TOKEN_MISSING`, sahte token'la da `401`. Yazma uçları `@Roles('ADMIN')` arkasında, rol her istekte DB'den okunuyor; ızgaradaki düğmelerin ziyaretçide "disabled" olması yalnızca kozmetik. **Not: arşivin kendisi herkese açık** (ne izlediğin görünür) — film arşivinde de böyle, gizlilik istenirse ayrı iş.
  - **Zincir kotası ikinci düzeltme**: `SPIN_OFF` da zincire dahil (kullanıcı kararı — MHA: Vigilantes gibi yan seriler aynı kartta). MHA'da AniList'te S1–S7 + FINAL SEASON = **8 sezon** var, S7→FINAL SEASON `SEQUEL` bağıyla ulaşılıyor; eski kayıtlarda görünmesi için ⟳ gerekiyor.
  - **"Bitirdim" ile eklemek bütün bölümleri işaretliyor** (`markAllPartsWatched`), durumu sonradan "bitirdim"e çevirmek de aynı şeyi yapıyor. Ayrıca sezon satırında **"Bu sezonu bitirdim"** ve **"Buraya kadar hepsini izledim"** (`PATCH /admin/anime/parts/:id/complete-through` — bu parça ve öncekiler) var.
  - **Son izlenen bölüm vurgusu**: ızgarada izlenen kareler dolu accent, **son izlenen kehribar çerçeve + ▶**, izlenmeyenler soluk, filler turuncu çerçeveli. İlerleme çubuğu tek başına "nerede kaldım"ı anlatmıyordu (kullanıcı geri bildirimi).
  - **Hero alanı** (salon üstü): şu an izlediğin serinin banner'ı + başlık + "S2 · 18/23" + ilerleme çubuğu + **"Kaldığın yerden devam et →"**. Dekoratif değil işlevsel olması kullanıcı kararı.
  - **Üç katmanlı süzgeç** (kullanıcı kararı): **Tür** (AniList genre'ları) / **Kitle** (Shounen, Seinen, Shoujo, Josei, Kids — bunlar AniList'te *tag*'tir) / **Tema** (kalan tag'ler, ilk 8 + "+N daha"). Üçü birlikte uygulanıyor. Raf sayfalarında da aynı düzen, çipler o rafın içeriğinden türetiliyor.
  - **Manga bölümü girişi**: sezon satırında küçük kutu (`mangaChapter`), doldurulunca anime sayfasında "S2 mangada 137'de bitiyor — devamı 138'den" satırı çıkıyor. Eşleme hiçbir API'de yok, elle girilir.
  - **Haftalık cron** (`anime.cron.ts`, Pazartesi 05:00 UTC): yalnızca **hareketli** kayıtlar (yayında / devamı duyurulmuş / izlediklerim) tazeleniyor + cache'i olmayan bölüm listeleri sessizce dolduruluyor (Jikan ilk denemede düşerse hafta içinde yerine oturur). Biten serilere dokunulmuyor.
  - **Canlı veriden çıkan iki hata düzeltildi**: (1) "nerede kaldım" araya giren tek bölümlük özeli seçiyordu (MHA'da 5. sezon yerine "Heroes:Rising Epilogue Plus") → sıralama artık *elde kalan parça → bitmemiş ilk TV sezonu → herhangi bir parça*. (2) Kart altındaki parça adı seri adı körlemesine kırpıldığı için Naruto'da `", the Genie, and the Three Wishes…"` diye başlıyordu → kırpma yalnızca kalan kısım gerçek bir sezon işaretiyse yapılıyor.
  - **Doğrulama**: backend `tsc` + prettier temiz, frontend `tsc` + lint + `next build` temiz. **Lokal dev sunucusu bu makinede canlı API'ye bağlandığı için gerçek arşivle ölçüldü** (fikstür gerekmedi): 10 seri, hero + CTA render oluyor, üç filtre satırı (Tür/Kitle/Tema) doğru dolduruluyor, MHA sayfasında 14 parça + gerçek sinopsis, **S5 bölüm ızgarası gerçek Jikan verisiyle 25 bölüm + 1 filler + "Kanon ilerlemen: 24/24" + ▶ işareti**, Naruto kart adı düzeldi, mobilde (375px) taşma yok, konsol hatasız.

- [x] **Anime Faz B++ — sekme düzeni, sabit banner, dış bağlantılar (2026-07-29 akşam, iş yeri makinesi)**: Kullanıcı sekme listesini ve anime sayfasının eksiklerini yazdı; hepsi yapıldı.
  - **Raflar kullanıcının verdiği sıraya geçti**: ▶️ İzliyorum · ⏳ Beklemede · 📅 Devamı Gelecek · ✅ Bitirdiklerim · ❤️ Favorilerim · 📌 Planlıyorum. İki ad değişti (**"Ara Verdiklerim" → Beklemede**, **"İzleyeceklerim" → Planlıyorum**) ve URL'leri de değişti (`/arsiv/beklemede`, `/arsiv/planliyorum`). Favori ayrı durum DEĞİL, işaret olarak kaldı — bitirdiğin bir seri hem "Bitirdiklerim"de hem "Favorilerim"de görünsün diye. `DROPPED` kayıtlar da "Beklemede"de duruyor: ayrı raf istenmedi, hiçbir rafa düşmezlerse arşivden kaybolurlardı. Raf işaretleri (emoji) `SHELF_ICONS` ile tek yerden geliyor.
  - **Stüdyo kaldırıldı** (kullanıcı isteği): salondaki "Stüdyolar" şeridi, anime sayfasındaki künye satırı, backend'deki `topStudios` hesabı ve `ArchiveAnime.studios` alanı gitti.
  - **Sabit banner**: `AnimeEntry.bannerImage` (küratör seçimi) eklendi; çözüm sırası *küratör seçimi → kök yapımın AniList banner'ı → sezonların banner'ı (sıralı ilk dolu olan, önce TV)*. Üçüncü adım **sıralı**, rastgele değil — banner'ın her açılışta değişmemesi kullanıcı şikâyetiydi. Alan boşaltılırsa AniList'inkine dönülüyor. Küratör adres yapıştırabiliyor ya da uploads modülüyle kendi görselini yükleyebiliyor.
  - **Dış bağlantı kartları** (anime sayfasının altı): Manga · Fragman · Opening · Ending · Resmi Site · AniList · MyAnimeList. Fragman ve resmi site AniList'ten geliyor (`MEDIA_FIELDS`e `trailer { id site }` + `externalLinks` eklendi, media cache anahtarı **v2 → v3**), AniList/MAL adresleri id'den kuruluyor; **Manga/Opening/Ending elle giriliyor** (`AnimeEntry.links` JSON) — hiçbir API vermiyor. Elle girilen adres AniList'inkini eziyor, adresi olmayan tür hiç kart açmıyor. Şemasız yapıştırılan adrese `https://` ekleniyor (`normalizeUrl`), `/uploads/...` yolları olduğu gibi kalıyor.
  - **Küratör Künyesi** bölümü anime sayfasında (yalnızca admin): banner + beş bağlantı alanı tek formda, `PATCH /admin/anime/:id`. DTO'ya `bannerImage` + iç içe `AnimeLinksDto` eklendi (whitelist açık, bilinmeyen alan 400).
  - **Yol boyunca bulunan hata**: anime sayfasının `.inner` kabı dar ekranda **yatay kaydırıyordu** — projede genel bir `box-sizing` sıfırlaması yok, yan boşluk genişliğin üstüne biniyordu. `box-sizing: border-box` eklendi (375px'te taşma yok, ölçüldü).
  - **Deploy penceresi savunması**: frontend `links`/`customLinks` alanları gelmediğinde de çökmüyor (bölüm hiç çizilmiyor, form boş açılıyor) — iki uygulama aynı anda deploy olmuyor.
  - **Doğrulama**: backend `nest build` + `eslint src/anime` temiz (kalan 3 uyarı bu turdan önce de vardı), frontend `tsc` + lint + `next build` temiz. **Bu turda dev sunucusu canlı API'ye ÇIKAMADI** (curl 200 dönerken Node'un fetch'i 502 — sabahki turda çıkabiliyordu, ağ değişmiş olmalı), o yüzden düzen **geçici fikstürle** doğrulandı ve fikstür silindi: raf sırası/adları, kart ızgarası (masaüstü 4 sütun, mobil 2), 50px dokunma alanı, `target="_blank" rel="noopener noreferrer"`, mobilde taşma yok. **Küratör künyesinin kaydetmesi ve görsel yüklemesi canlıda gerçek girişle denenmedi.**
  - Migration: `20260729190000_add_anime_banner_links` (`bannerImage` TEXT + `links` JSONB).

- [x] **Film salonu — film sayfası, "en üste git", öneri sayısı (2026-07-29 gece, iş yeri makinesi)**: Kullanıcının üç isteği + bir karar turu.
  - **Film sayfası** (`/dark-stories/category/film/[slug]`, yeni): afişe tıklayınca açılıyor. Slug backend'de başlıktan türetiliyor (anime deseni; çakışırsa yıl, sonra TMDB numarası). Düzen **iki sütun** (kullanıcı kararı: "her şey alt alta gelmesin, sağ taraf boş"): üstte tam genişlikte backdrop (aşağı doğru zemine karışır, künye üstüne biner), solda kendi notun (TMDB özetinden ÖNCE, altın kenar çizgili) + konu + fragman + kadro, sağda **sticky ray** (nerede izlenir / bağlantılar / benzer filmler).
  - **Fragman**: `youtube-nocookie` gömülü oynatıcı ama **tıklayana kadar iframe inmiyor** — önce YouTube kapak görseli. Her film sayfası açılışında YouTube'a istek gitmesin diye.
  - **Bağlantılar**: TMDB ve IMDb künyeden kesin (TMDB `imdb_id` veriyor). **Rotten Tomatoes'un kaynağı yok** → varsayılan olarak RT arama adresi üretiliyor ve kartta "ARAMA" etiketiyle **açıkça belirtiliyor**; küratör doğru adresi girince etiket düşüyor. `MovieEntry.links` (JSON: rt/imdb/trailer) + film sayfasındaki küratör künyesi.
  - **TMDB künyesi v2**: `append_to_response=credits,videos,watch/providers` + `include_video_language=tr,en,null`. Yeni alanlar: `tagline`, `imdbId`, `homepage`, `cast` (12 kişi), `trailerKey`, `providers` (TR, abonelik/kiralık/satın alma; JustWatch verisi) ve `providerLink`. Cache anahtarı `tmdb:movie:` → `tmdb:movie:v2:` — **eski kayıtların künyesi ilk açılışta yeniden çekilir**.
  - **"En üste git"** (`components/BackToTop.tsx`, paylaşılan): 700px kaydırınca beliriyor, sağ altta sabit, 44px dokunma alanı, mobilde yalnızca ok. Film salonu + film rafları + anime salonu + anime raflarına bağlandı. `prefers-reduced-motion` açıksa anında zıplıyor.
  - **Öneriler artık havuzun tamamı** (kullanıcı isteği): istemcideki 10'luk kırpma kaldırıldı, havuz kaç film taşıyorsa (60) hepsi karışık sırayla listeleniyor. "Yenile" davranışı aynı.
  - **Doğrulama**: iki tarafta da build/lint temiz. Lokalde fikstürle ölçüldü (sonra silindi): 1280px'te iki sütun (824 + 300 sticky ray), 375px'te tek sütun, ikisinde de yatay taşma yok; fragman tıklayınca iframe iniyor; posterden film sayfasına geçiş çalışıyor; "en üste git" 128×44 sağ altta. **Not: tarayıcı paneli kare üretmediği için `behavior:"smooth"` kaydırma orada hiç ilerlemiyor** (`auto` çalışıyor) — kod doğru, gerçek tarayıcıda kontrol edilecek.
  - Migration: `20260729210000_add_movie_links` (`links` JSONB).
  - **Çalışma tarzı kararı (kullanıcı, 2026-07-29)**: kullanıcı lokalde kontrol edemiyor; lokal görsel doğrulamaya fazla token harcanmayacak. Kısa dene → build/lint temizse push → canlıda doğrula.

- [x] **"Nexus'u Keşfet" yeniden yazıldı (2026-07-29 gece)**: Sayfa beş düz karttan ibaretti; ana sayfadaki kapı duvarının gücü buraya hiç gelmemişti ve **sitenin kendi eseri Temürkan burada hiç görünmüyordu** (kategori değil, Kadim Dünyalar içindeki bir evren olduğu için). Kullanıcı fikir turu istedi, sekiz modül sunuldu, dördü + atmosfer seçildi.
  - **Tek uç**: yeni `GET /pulse` (`backend/src/pulse/*`) sayfanın tamamını tek istekte döndürüyor — baş köşe, salon kapıları, "şu an" şeridi, evrenler rafı ve künye sayaçları. **Dış API'ye hiç çıkmıyor**, her sayı veritabanından; TMDB/AniList düşse de sayfa eksiksiz açılır.
  - **Temürkan baş köşesi**: kendi kapağı zemin, Orhun 𐱅 mührü, bölüm + wiki sayacı, "son yazılan: 3 gün önce", iki giriş (Son bölümü oku / Evrene gir). `FEATURED_UNIVERSE_SLUG` sabiti — evren yoksa bölüm hiç çizilmiyor.
  - **Canlı salon kapıları**: kapak görseli kapının aralığından sızan ışık gibi; altındaki satır gerçek veri (Film: "63 film · bu yıl 12", Anime: "13 seri · izliyorum: BAKI", diğerleri: "N evren"). Sıra ana sayfayla aynı kaynaktan (`HALL_ORDER`).
  - **"Şu an Nexus'ta"**: son izlenen film, son ilerleyen anime (hangi sezon/bölümde kaldığım dahil), son yazılan bölüm — tarihe göre sıralı, "3 gün önce" biçiminde.
  - **Evrenler rafı** (8 evren, kategoriye girmeden) + **künye şeridi** (evren/bölüm/film/anime bölümü/wiki sayıları).
  - **Atmosfer**: zeminde çok yavaş süzülen iki katmanlı toz + ışık havuzu, `prefers-reduced-motion`'da tamamen duruyor. Parlama yok (kural 16).
  - **Tamamı sunucuda çiziliyor** — bu sayfa için ziyaretçiye tek satır JS inmiyor (hareket ve hover CSS'te).

## Sıradaki Adım
0f. **Nexus'u Keşfet — canlı kontrol**: baş köşede Temürkan görünüyor mu, kapı satırlarındaki sayılar doğru mu, "şu an" şeridi dolu mu, evrenler rafı kayıyor mu, mobilde taşma var mı.
0g. **Film — canlı kontrol**: bir afişe tıkla (film sayfası açılmalı), fragman oynuyor mu, "nerede izlenir" rozetleri geliyor mu (TMDB künyesi v2'ye geçtiği için ilk açılış biraz yavaş olabilir), RT kartı arama sayfasına gidiyor mu, küratör künyesinden RT adresi kaydedilebiliyor mu, "en üste git" raf sayfasında beliriyor mu.
0h. **Anime — canlı kontrol (ilk iş)**: (1) Küratör Künyesi'nden bir animeye banner ve manga/OP/ED bağlantısı gir, kaydet, kartlar çıkıyor mu bak. (2) Raf adresleri değişti — `/arsiv/beklemede` ve `/arsiv/planliyorum` açılıyor mu. (3) Bir animenin banner'ı artık sabit mi (⟳ tazeledikten sonra da).
0i. **Anime Faz B kalanları**: (0) **Karakter detay sayfası** (kullanıcı isteği, bilinçli ertelendi): anime sayfasındaki karakter şeridi tıklanabilir olacak, karakter sayfasında sağ/sol büyük banner + ortada açıklama/künye. AniList `Character` sorgusu (`image.large`, `description`, `media`) ayrı cache ile çekilir. (1) **Ekran görüntüleri kararı bekliyor**: kendi yüklediklerim (uploads modülü, güvenilir) / TMDB eşlemesi (anime başlıklarında isabet düşük) / hiç. (2) Parça sırasını elle düzeltme (şu an yalnızca yayın tarihi). (3) Arşivin gizliliği: şu an ne izlediğin herkese açık — istenirse ziyaretçiye kapatılabilir.
0j. **Anime Faz C — arc'lar**: `AnimeArc` modeli + admin'den bölüm listesinden aralık seçerek arc tanımlama, arc ilerlemesi ve arc bazlı puan. Kartın "Shibuya Incident Arc" satırı bu fazla dolacak (şimdilik sezon adı yazıyor).
0k. **Anime Faz D**: haftanın yayın takvimi + geri sayım şeridi, mevsimlik keşif/öneri rafı (film salonundaki öneriler deseni), tam istatistik sayfası, anime kanadının görsel kimliği.
0g. **Öneriler rafı — canlı doğrulama (29 Temmuz sürümü)**: küratör modunu aç → ✕ ile birkaç film ele, **sayfayı tamamen yenile** (F5): elenenler bir daha gelmemeli. ↩ ile birini geri al → havuza dönmeli. Listede tür çeşitliliği var mı (komedi/korku/macera/eski filmler karışık), "Yenile" gerçekten başka filmler getiriyor mu. Deploy sonrası ilk istek yavaş olabilir (6 tür taraması cache'siz).
0f. **Küratör modu — canlı doğrulama (İLK İŞ)**: `/dark-stories/category/film/arsiv` → header "Tercihler → Giriş yap" (mail+şifre) → sayfa kendiliğinden küratör anahtarını göstermeli → mod aç → TMDB'de film ara → ekle → poster raf'ta belirmeli; kart altındaki ★ ile favori, durum seçici ve ✕ ile çıkarma denenmeli. Beğenilirse aynı desen GS salonuna (transfer haberi/kadro düzeltmesi) taşınacak.
0e. **Film salonu — canlı doğrulama (İLK İŞ)**: `/admin/film`'den TMDB araması çalışıyor mu (anahtar doğru okunuyor mu), bir film ekle → `/dark-stories/category/film` salonunda görünüyor mu, favori işaretle → favoriler duvarında künye levhası doğru mu.
0d. **Yazım Atölyesi — canlı doğrulama (İLK İŞ)**: `/admin/atolye/temurkan-efsaneleri`de (1) bir karaktere takma ad ekle, (2) bölümde `@` yazıp öneri listesinden bağla, (3) imleci işaretin üstüne getirince sağda künye açılıyor mu, (4) adı bağlamadan yaz → "Bu Bölümde Geçenler"de soluk noktayla çıkıyor mu, (5) bölümü yayınlayıp okuma ekranında işarete tıkla → künye paneli.
0c. **Oyuncu maç istatistikleri**: TM veri setinde `TmGame`/appearances var ama sync edilmiyor; künye sayfası şimdilik yalnızca künye gösteriyor (`futbol.dossierNote` bunu açıkça söylüyor). İstenirse `sync-transfermarkt` deseniyle aktarılır.
0. **AĞUSTOS 2026 — Süper Lig veri kaynağını tekrar değerlendir** (2026/27 başlayınca, ~Ağustos ortası): `POST /admin/football/sync-league` tetikle → `diag.statusCounts`'a bak. `finished` sayısı oynanan hafta sayısıyla uyumlu artıyorsa actor güncel demektir, widget'lar kendiliğinden dolar (kod değişikliği GEREKMEZ). Hâlâ donuksa kaynak değiştir: ücretli API-Football planı / başka Apify actor'ı / actor'ın Issues sekmesine bildir. `APIFY_TR_SEASON=2026` env'i Coolify'a eklenirse türetme tartışması biter.
0b. **GS salonu — kalan işler**: "Unutulmaz Anlar" için veri modeli (`SportMoment`?) + admin UI + nav maddesi; sağ raftaki kadro künyesine **piyasa değeri** (backend `SquadPlayer` DTO'suna `marketValueInEur` eklenmeli — TM tablosunda veri hazır ve `transfer-news` servisi zaten okuyor, oradaki `PLAYER_SELECT` desen olarak kullanılabilir); mevki etiketlerinin i18n'i (TM'den İngilizce geliyor: "Centre-Forward" vb. — hem kadro kartlarında hem haber künyesinde).
0a. **Spor admin UI**: `/admin/sport` sayfası (4 veri kümesi için form+tablo, ambient-tracks deseni) — kullanıcı kadro/takvim/sıralama girebilsin; admin ana sayfasına link.
0b. **Kadim Dünyalar kanadını bütünle**: hikâye okuma ekranı hâlâ eski temada — okuma ekranı codex'e geçirilecek; sonra Anime/Film/Dizi derileri tasarım planına göre.
1. **Wiki devamı (Faz 2)**: çapraz linkler (`WikiEntryRelation` — admin'den sayfalar arası ilişki kurma + detayda "İlişkili Sayfalar"), sonra site içi arama (PostgreSQL full-text, önce wiki kapsamında — plan Faz 2)
2. Faz 1 "Bitti" kriterlerinden kalanlar: yedekten geri yükleme testi, mobil taşma kontrolü
3. 8 evrene açıklama metni eklenmesi (`/admin/universes`) — kapaklar tamamlandı (2026-07-12), açıklamalar bekliyor
4. (İsteğe bağlı) Test upload'larını DB/diskten temizle: 2 eski test görseli (`cmrduiuco00021qs01pshvngg`, `cmrduzd3w00001qrxd664ngh4`) + ambient player testinden kalan `1783861953005-6b08c4870b375ed1.wav` (MediaAsset `cmrhtck5500001pqubljlm8rd`)
4b. ~~Ambient player küçük düzeltmeleri~~ TAMAMLANDI (2026-07-12, commit `f6cab18`): player kompakt ortalanmış tasarıma geçti (`min(520px, 100vw-24px)`, alt-orta sabit, köşeli + border, tema token'lı inline SVG ikonlar, emoji yok), şarkı başlığı tıklanınca çalma listesi açılıyor (parça seçimi çalışıyor), başlangıç volume bug'ı düzeltildi (ref callback ile 0.3 uygulanıyor — canlıda doğrulandı), tek parçada bitişte isPlaying sıfırlanıyor, player + admin müzik sayfası tüm metinleri i18n'e taşındı (`player.*`, `admin.ambient.*`). Canlıda DOM üzerinden doğrulandı (browser panelinde ekran görüntüsü alınamadı — panel sorunu). Temürkan'da 2 test parçası duruyor ("Bozkır Rüzgârı (test)", "Kadim Yankılar (test)") — kullanıcı yeni player'ı deneyip gerçek müzik yükleyince silinecek. Kullanıcının fikri: player'ın altına ayrıca Spotify embed eklemek (henüz karar verilmedi).
5. Lokal geliştirme için DB: Docker Desktop + lokal postgres (kökteki compose hazır), `backend/.env` lokal URL'e güncellenecek

## Açık Kararlar / Notlar
- CX23 (4 GB RAM) iki projeyi birden taşıyacak — build sırasında bellek sıkışırsa CX33'e rescale edilecek
- Kayıt (`/register`) Faz 2'ye kadar kapalı; tek kullanıcı = admin (seed ile)
- İlk wiki evreni: Zaman Çarkı (Wheel of Time)
- İlk karakter analizi hedefi: Zaraki Kenpachi (Bleach)
- Tasarım prensibi: glow/parlama efekti yok, düşük doygunluklu accent renkler, saf siyah zemin yok (göz yormayan dark theme)

## Ortam Bilgileri
- **İş yeri makinesi (2026-07-17)**: `C:\Users\SER_5881079544\Desktop\Kuronexus` — repo klonlu. Tarayıcıda kuronexus.com engelli görünse de **curl/PowerShell ile hem site hem API 200** dönüyor.
  - **Engelin sebebi kesinleşti (2026-07-29)**: kurumsal filtre alan adını engelliyor. Chrome `ERR_SSL_VERSION_OR_CIPHER_MISMATCH` gösteriyor ama **sertifikayla ilgisi yok** — sunucu TLS 1.2 ve 1.3'ü standart şifre setleriyle sunuyor, sertifika geçerli Let's Encrypt (kuronexus.com + www + api, otomatik yenilemeli, Ekim 2026'ya kadar). Gizli sekmede de "BT tarafından engellendi" uyarısı geliyor. Aynı oturumda git de kurumsal SSL kesmesine (`CN=ssl-decryption.tanap.local, O=TANAP`) takılmıştı; ağ değişince düzeldi. **Araçlar etkilenmiyor**: curl/PowerShell, git push ve dev sunucusunun canlı API'ye bağlanması çalışıyor — yalnızca siteyi bu makinenin tarayıcısında görmek mümkün değil. Görsel doğrulama telefondan/ev makinesinden ya da lokal dev sunucusundan (localhost engelli değil) yapılır. Kalıcı çözüm BT'de: alan adını beyaz listeye almaları gerekir.
  - **Node kuruldu** (winget, `OpenJS.NodeJS.LTS` v24.18.0 — yönetici gerekmedi, zip olarak `%LOCALAPPDATA%\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_*\node-v24.18.0-win-x64\` altına açıldı; Docker'daki `node:24-slim` ile aynı major). **Frontend build + lint + dev server bu makinede çalışıyor** (doğrulandı).
  - **PATH tuzağı**: winget PATH'i kalıcı güncelledi ama bu oturumdaki süreçler eski ortamı miras alıyor → her yeni kabukta `$env:Path = "$([Environment]::GetEnvironmentVariable('Path','User'));$env:Path"` gerekiyor. Uygulama yeniden başlatılınca bu gereksiz kalır.
  - **pnpm sürüm tuzağı (önemli)**: `npx pnpm@10 install` ile kurup `npx pnpm` (sürümsüz → **v11** çeker) ile çalıştırmak `node_modules`'ü her seferinde yeniden kurduruyor (~5 dk, "Recreating node_modules"). **Tek bir sürümde kal**. Ayrıca pnpm TTY'siz ortamda temizlik onayı isteyip `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` ile ölüyor → `CI=true` gerekiyor.
  - **`.claude/launch.json` bu oturumda çalışmadı**: `runtimeExecutable: "npx"` → PATH eski olduğu için `spawn npx ENOENT`; mutlak `npx.cmd` yolu verilince süreç sessizce anında ölüyor (Windows'ta `.cmd` spawn sorunu). **Çözüm**: `runtimeExecutable` = mutlak `node.exe`, `runtimeArgs` = `["frontend/node_modules/next/dist/bin/next", "dev", "frontend"]` → çalıştı. Bu makineye özgü olduğu için **repoya commit EDİLMEDİ**; launch.json orijinal (`npx`) halinde bırakıldı — uygulama yeniden başlatılıp PATH tazelenince orijinali zaten çalışmalı.
  - **`frontend/.env.local` gerekli** (gitignore'da, her makinede elle oluşturulur): `NEXT_PUBLIC_API_URL=https://api.kuronexus.com` → dev server **canlı API'ye** bağlanır, SSR içerik gerçek veriyle gelir.
  - **~~İstemci tarafı fetch'ler lokalde çalışmaz~~ ÇÖZÜLDÜ (2026-07-28, dev proxy)**: `/api/dev-proxy` ile tarayıcıdan giden istekler Next sunucusundan geçiyor, CORS devre dışı kalıyor. **Admin paneli ve yazım atölyesi artık lokalde tam çalışıyor** (giriş dahil). Ayrıntı yukarıdaki "Lokal geliştirme köprüsü" maddesinde. **UYARI: lokal admin canlı veritabanına yazar.**
  - **Backend lokalde ÇALIŞTIRILAMAZ**: `backend/.env` yok (gitignore'da, doğru) → `DATABASE_URL`/`JWT_SECRET`/`APIFY_TOKEN` elde yok; DB'nin public erişimi kapalı; Docker Desktop yok → lokal postgres de yok. Apify'a doğrudan çağrı yapılamaz, yalnızca kendi admin uçlarımız üzerinden.
- **GitHub reposu:** `https://github.com/ultnexusdev/KuroNexus.git` (`main` branch push edildi, origin remote ayarlı)
- Sunucu: Hetzner CX23, Helsinki (eu-central), IP `65.108.220.5`
- Deploy: Coolify — aynı repo, iki Application, root dirs `/backend` ve `/frontend`
- Veritabanı: PostgreSQL (Coolify resource, `Kuronexus > production` projesi altında) — **public erişim KAPALI (2026-07-08)**, backend internal URL ile bağlanıyor. `backend/.env`'deki eski 5433'lü URL artık çalışmaz (lokal dev için Docker Desktop + lokal postgres planı yukarıda)
- Domain: kuronexus.com (DNS/SSL yapılandırması Faz 1 deploy adımında doğrulanacak)
