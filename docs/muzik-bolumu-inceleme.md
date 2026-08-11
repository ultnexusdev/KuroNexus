# Müzik Bölümü — Mimari İnceleme (Bölüm 10 komutunun çıktısı)

> Girdi: `docs/kuronexus-muzik-bolumu-tasarim-plani.md`
> Tarih: 11 Ağustos 2026 · Kod yazılmadı, yalnızca ölçüm ve karar.

## 0. Bu inceleme neye dayanıyor

Tahmin değil, okunan dosyalar:

| Konu | Kaynak |
| --- | --- |
| Ad çakışmaları, mevcut şema desenleri | `backend/prisma/schema.prisma` (2447 satır, 60+ model) |
| Kitap kanadı = en yakın emsal (dış kaynak + ilişkisel künye + küratör onayı) | `backend/src/books/*` |
| Arka plan senkronizasyonu | `backend/src/anime/anime.cron.ts`, `backend/src/football/football.service.ts:290-308` |
| Görsel yerelleştirme (hotlink yasağı) | `backend/src/books/book-cover.service.ts`, `backend/src/uploads/*` |
| Altyapı (Redis var mı?) | `docker-compose.yml`, `backend/package.json`, `backend/src/app.module.ts` |
| CSP / güvenlik başlıkları / yönlendirmeler | `frontend/next.config.ts` |
| Salon ekleme–kaldırma deseni | `frontend/lib/halls.ts`, `frontend/lib/sport/routes.ts`, `frontend/app/sitemap.ts` |
| Kadim Dünyalar'ın gerçek yükü | `frontend/lib/universes/book-series.ts`, `backend/src/pulse/pulse.service.ts`, `frontend/app/[locale]/dark-stories/[universeSlug]/page.tsx` |
| Kurallar | `.agents/AGENTS.md` (1–16) |

---

## 1. Mevcut plandaki eksik, hatalı ve gereksiz noktalar

### 1.1 🔴 `Role` adı şemada ZATEN VAR — bu bir derleme hatası

`schema.prisma:1079` → `enum Role { ADMIN EDITOR VIEWER }`. Prisma tek şemada model ve enum adlarını **aynı isim uzayında** tutar; `model Role` eklenirse şema derlenmez. Semantik olarak da kabul edilemez: kimlik doğrulama rolü (kural 6/12) ile müzik künye rolü aynı kelime olamaz.

**Karar:** kontrollü sözlük tablosunun adı **`MusicRole`**.

### 1.2 🔴 Ad çakışması / anlam bulanıklığı: `Person`, `Track`, `Genre`, `Album`

Projenin sarsılmaz deseni: **her kanat kendi önekini taşır** — `BookPerson`, `BookGenre`, `BookSeries`, `FootballEra`, `F1Circuit`, `SportImage`, `AnimePart`, `MovieEntry`, `ShowSeason`. Planın çıplak adları bu desene aykırı ve ikisi doğrudan çakışıyor:

- `Track` → `AmbientTrack` (`schema.prisma:1212`, evren fon sesi) zaten var; ayrıca projede "track" kelimesi F1 pisti için de kullanılıyor (`prisma/add-track-image.ts`). "Parça" anlamında çıplak `Track` üç kavramı birbirine karıştırır.
- `Person` → `BookPerson` var. Çıplak `Person` "hangi Person?" sorusunu her sorguda doğurur.
- `Genre` → `BookGenre` var.

**Karar:** `MusicPerson`, `MusicalAct`, `MusicAlbum`, `MusicTrack`, `MusicGenre`, `MusicEra`, `MusicRole`, `MusicMembership`, `MusicTrackCredit`.
Faz 6'daki birleşik Nexus katmanı bunu zorlaştırmaz — `BookPerson` de ayrı duruyor, o faz nasılsa bir birleştirme migration'ı olacak.

### 1.3 🔴 Redis/Bull bu projede YOK — Bölüm 7 başka bir projeyi anlatıyor

Plan "mevcut projedeki (ultnexus) Redis/Bull pattern'i kullanılır" diyor. **ultnexus başka bir repo.** KuroNexus'ta ölçülen gerçek:

- `docker-compose.yml`: yalnızca `postgres:16-alpine`. Redis servisi yok.
- `backend/package.json`: `bull`, `bullmq`, `ioredis`, `@nestjs/bull` — **hiçbiri yok**.
- Mevcut ve çalışan desen: `@nestjs/schedule` + `@Cron` (`app.module.ts:33`), yeniden girişi engelleyen `private running = false` bayrağı (`anime.cron.ts:34-37`), kalıcı cache tablosu `ExternalCache` (`schema.prisma:136`), elle tetikleme için admin ucu (`books.admin.controller.ts:153`).

Redis eklemek = Coolify'da üçüncü servis + yeni ortam değişkenleri + yeni arıza noktası + yeni yedekleme sorusu. Bull'un buradaki tek gerçek üstünlüğü kalıcı kuyruk ve retry; onu bir DB tablosu da veriyor — üstelik `pg_dump` yedeğine dahil oluyor (kural 15), Redis dahil olmuyor.

**Karar:** Redis/Bull **yok**. `@Cron` + `MusicSyncState` tablosu + admin elle tetikleme ucu. Plan Bölüm 7'nin *davranış* şartları (periyodik, elle tetiklenebilir, kişisel veriye dokunmaz) aynen karşılanır, aracı değişir.

### 1.4 🟠 `ExternalRef` polimorfik tablosu projenin desenine ters — hibrit lazım

Mevcut desen (`BookEntry:513-522, 597-598`): birincil dış kimlikler **entity'nin kendi sütunlarında** (`googleId`, `olKey`, `binKitapSlug`, `isbn13`), ham yanıt `externalData Json?` + `externalDataFetchedAt` (kural 4/14'ün istediği tam bu). `AnimePart.malId`, `BookPerson.binKitapId` de öyle.

Saf polimorfik `ExternalRef(entityType, entityId)` ile: gerçek FK kurulamaz, `onDelete: Cascade` çalışmaz, kayıt silinince yetim satır kalır, her okuma elle join, tip güvenliği yok (kural 7).

**Karar — hibrit:**
1. Her müzik entity'sinde `spotifyId String? @unique` + `externalData Json?` + `externalDataFetchedAt DateTime?` (günlük sorgular buradan okur).
2. Gelecekteki ikincil kaynaklar (MusicBrainz/Discogs/Wikidata/Last.fm) için dar bir **`MusicExternalRef`**, ama polimorfik değil: `Comment`/`Favorite` deseninde (`schema.prisma:1036-1077`) **nullable gerçek FK'lerle** — `personId?`, `actId?`, `albumId?`, `trackId?`. Böylece cascade ve index çalışır, şema yine açık kalır.

### 1.5 🟠 "Kişisel katman zaten fiziksel olarak ayrı" — bu mimaride DOĞRU DEĞİL

Plan Bölüm 7'nin KRİTİK KURAL'ı, ayrımın "Bölüm 4'teki ExternalRef ayrımıyla zaten garanti altına alındığını" söylüyor. Kitap kanadında öyle değil: `BookEntry.personalRating`, `personalNote`, `isFavorite`, `startedAt/finishedAt` dış metadata ile **aynı tabloda** (`schema.prisma:576-598`). Yani bu bir mevcut garanti değil, **yeni bir karar**.

Kararı destekliyorum ve gerekçesi somut: sync yazma yolu bir gün `data: { ...spotifyPayload }` biçimine dönerse aynı tablodaki kişisel alan sessizce silinir. Ayrı tabloda bu **imkânsız** olur — kural yorumla değil şemayla korunur. Bedeli: her sayfada bir `include` daha. Kabul.

### 1.6 🟠 İki dilli Notes/Memories — projede emsali YOK, desen seçilmeli

Site iki dilli (`localePrefix: "as-needed"`, `messages/tr.json|en.json`) ama **hiçbir içerik tablosunda çift dilli alan yok**; çeviriler yalnızca arayüz metinleri için. `BookEntry.personalNote` tek alan. Yani "locale-keyed" isteği yeni bir desen kuruyor.

**Karar:** ikiz sütun (`bodyTr`, `bodyEn`) — çeviri tablosu değil. Dil sayısı iki ve sabit (`routing.ts`), ikiz sütun okuma yolunu `note[locale] ?? note.tr` kadar basit tutar, join getirmez. Üçüncü dil gelirse (gelmiyor) o zaman göç edilir.
**Kullanıcı kararı bekliyor:** EN boş bırakılabilir mi? Önerim: evet — gösterimde dolu olana düşülür, "çeviri bekliyor" rozeti admin panelde görünür.

### 1.7 🟠 `NexusEdge` başlangıç seti gerçek ilişkilerle çakışıyor — kapsam daraltılmalı

Plan doğru kuralı koyuyor ("gerçek ilişkilerin YERİNE GEÇMEZ") ama başlangıç seti o kuralı ihlal ediyor. Planın kendi örnek zinciri **NexusEdge'e hiç ihtiyaç duymuyor**:

```
Chester → Linkin Park   = MusicMembership
Linkin Park → Meteora   = MusicAlbum.actId
Meteora → Numb          = MusicTrack.albumId
```

Family Tree görselleştirmesi bu üç gerçek ilişkiden birebir çizilir. `MEMBER_OF`, `FEATURED_IN`, `PART_OF`, `COMPOSED_FOR`, `PRODUCED` enum'da kalırsa aynı olgunun iki kaynağı olur ve ikisi kaçınılmaz olarak birbirini tutmaz.

**Karar:** `MusicNexusEdge` Faz 4'te eklenir, ama enum yalnızca **gerçek FK ile ifade edilemeyen** tipleri taşır: `RELATED_TO` (Spotify'ın kapattığı endpoint'in küratör karşılığı), `INSPIRED_BY`, `SIDE_PROJECT_OF`, `SUCCESSOR_OF`, `COLLABORATED_WITH`, `BASED_ON`. Diğerleri Faz 6'da (medya-arası) açılır.

### 1.8 🟡 Genre küratörlüğü: proje bunu çözmüş, plan yeniden icat ediyor

Plan "taksonomi Spotify etiketlerine değil kendi küratörlüğüne dayansın" diyor ama mekanizmayı söylemiyor. Mekanizma zaten yazılmış: `BookGenre` (`schema.prisma:718-743`) → `slug @unique` + `key @unique` (i18n anahtarı, çeviri buradan okunuyor) + kaynak kimliği + **`isApproved @default(false)`**: kaynaktan gelip sözlükte karşılığı olmayan tür süzgeçte görünmez, `/admin/books/genres/pending` ucunda onay bekler (`books.admin.controller.ts:90-103`). Gerekçe şemada yazılı: otomatik kabul edilseydi liste aynı kavramın varyantlarıyla dolardı.

Spotify'ın tutarsız `genres` alanı için bu **tam olarak doğru** çözüm. `MusicGenre` bu tabloyu birebir kopyalar; planın eklediği gerçek yenilik `parentId` (alt tür hiyerarşisi) — `BookGenre`'de yok.

### 1.9 🟡 Görsel yerelleştirme: `UploadsService` değil, `BookCoverService` deseni

Plan "storage/uploads/CDN katmanında cache'lensin" diyor; projede iki yol var ve doğru olan ikincisi:

| | `UploadsService` | `BookCoverService` |
| --- | --- | --- |
| `MediaAsset` kaydı | açar, **`userId` zorunlu** (`schema.prisma:904`) | açmaz — gerekçe dosyada yazılı: kapak türetilmiş veri, ayrı sahiplik taşımıyor |
| Hata davranışı | fırlatır | **asla fırlatmaz, `null` döner** |
| SSRF | ad çözümleme + özel IP reddi (beyaz liste yok) | **host beyaz listesi** + her sıçramada yeniden süzme |

Arka plan job'ında oturum açmış kullanıcı **yoktur** — `MediaAsset.userId` zorunlu olduğu için `UploadsService` yolu sync'te ya sahte bir kullanıcı kimliği uydurmayı ya şema değişikliğini gerektirirdi.

**Karar:** `MusicArtworkService`, `book-cover.service.ts`in birebir kardeşi. Hedef `UPLOAD_DIR/music/`, servis yolu `/uploads/music/…` (`app.module.ts:36` zaten 1 yıllık `immutable` cache ile sunuyor). Beyaz liste: `i.scdn.co`, `mosaic.scdn.co`, `image-cdn-*.spotifycdn.com`, `*.scdn.co`. Uzantı **içerik imzasından** seçilir, adresten değil.
Planın "retry kuyruğu" isteği ayrı tablo gerektirmez: `artworkFetchedAt` `null` bırakılır, bir sonraki cron turu eksikleri toplar (`awards/warm` ve `covers/localize` uçları bu deseni zaten uyguluyor).

### 1.10 🔴 Spotify gömülü player şu anda CSP tarafından ENGELLİ — ve sessizce

`next.config.ts:73` → `frame-src https://www.youtube-nocookie.com`. Liste beyaz liste; `open.spotify.com` yok, dolayısıyla "Spotify'da Dinle" gömüsü hiç çizilmez. Arıza **sessiz**: iframe boş kalır, konsolda ihlal görünür, sayfa çökmez.

**Karar:** `frame-src`'ye `https://open.spotify.com` eklenir. `img-src`'ye ekleme **gerekmez** (görsel yerelleştiriliyor — planın hotlink yasağının ölçülebilir kazancı tam bu), `connect-src` değişmez (canlı fetch yok), `next.config.ts` `images.remotePatterns`'a Spotify CDN'i **girmez**.

### 1.11 🟡 Bölüm 6'daki kapalı uç listesi eksik: `preview_url` de kapandı

Kasım 2024 kısıtlaması 30 saniyelik `preview_url` alanını da yeni uygulamalar için kapattı. Yani "kart üzerinde fareyle gezinince önizleme çal" gibi bir fikir baştan elenmeli — ses **yalnızca** gömülü player üzerinden. Bunu plana yazmak, ileride boşa harcanacak bir denemeyi engeller.

### 1.12 🟡 "Currently Listening" bir ops yükü, Faz 5'te birinci sınıf hata durumu istiyor

Authorization Code flow + refresh token backend `.env`'de (kural 4). İki gerçek risk: (a) refresh token iptal edilirse widget sessizce ölür, (b) Spotify Development Mode uygulamaları uzun süre kullanılmazsa askıya alınabiliyor. Kural 4 gereği dış kaynak düşünce sayfa çökmez — ama STATE.md'nin bilinen tuzağı (`bulgu Ö-8`: sessiz boş yanıt gerçek boşlukla karıştırılıyor) burada birebir tekrar eder. Widget "veri yok" ile "bağlantı koptu" durumlarını **ayırmak** zorunda.

### 1.13 🟠 Spotify "artist" ⇒ Person mi Act mi? Plan bu kararı vermiyor — sync yanlış veri yerleştirir

Spotify'ın veri modelinde kişi/grup ayrımı **yoktur**; hepsi "artist". Plan hem `MusicPerson` hem `MusicalAct` istiyor ve `actKind` alanına bir varsayılan vermiyor. Kural konmazsa Hans Zimmer sessizce `actKind: Band` olarak yerleşir ve kimse fark etmez.

**Karar:**
- Spotify'dan gelen her "artist" **`MusicalAct`** olarak açılır (kaynak öyle veriyor).
- `MusicActKind` varsayılanı **`UNCLASSIFIED`** — `BAND` değil. Sınıflandırma küratörün işi; sınıflandırılmamışlar admin panelde bir kuyrukta görünür (`BookGenre.isApproved` deseninin kardeşi).
- `MusicPerson` **yalnızca küratör** açar. Solo sanatçı (Hans Zimmer, actKind `SOLO_PROJECT`) için Person + Act **ikisi de** durur ve aralarını `MusicMembership` bağlar; aksi hâlde `/muzik/kisi/hans-zimmer` boş sayfa olur çünkü albümler `MusicAlbum.actId` üzerinden asılıdır.

### 1.14 🟡 Album/Track'te gerçek alan eksikleri

Plan `Album`'ü "MusicAct'e bağlı, eraId", `Track`'i "Album'e bağlı" diye tanımlıyor. Sayfa çizmek için yetmiyor:

- **`albumType`** (`Album | Single | EP | Compilation`) — Spotify singles'ı da albüm olarak döndürür. Bu alan yoksa albüm listesi 40 single ile dolar ve "albüm listesi" anlamını yitirir.
- **`releaseDatePrecision`** (`year | month | day`) — Spotify bunu ayrıca veriyor. Yoksa "1 Ocak 2003" diye uydurulmuş bir gün görünür.
- `MusicTrack`: `discNumber`, `trackNumber`, `durationMs`, `isExplicit` — parça listesi bunlar olmadan çizilmez.

### 1.15 🟡 `MusicAlbum.eraId` küratör formu olmadan boş kalır — ölçülmüş bir tuzak

Plan "eraId (opsiyonel, açık FK)" diyor; karar doğru (otomatik tarih eşlemesinden iyi). Ama bu projede aynı biçimde eklenmiş bir alanın akıbeti **ölçülmüş**: `BookEntry.universeId` de "opsiyonel, elle doldurulur" diye eklendi ve `lib/universes/book-series.ts` ölçümüne göre **32 serinin hiçbirinde dolu değil** — çünkü onu dolduracak bir küratör formu hiç yapılmadı. Sonuç: kod içine elle bir eşleşme tablosu yazmak zorunda kalındı.

**Karar:** `eraId` eklenir, ama Faz 3 "albüm düzenleme ekranında dönem açılır listesi" **olmadan bitmiş sayılmaz**. Aksi hâlde timeline boş çizer.

### 1.16 Gereksiz / ertelenecek bulduklarım

- **`ExternalRef`in `provider` kümesindeki `wikidata` ve `lastfm`**: hiçbir sayfa konsepti bunları kullanmıyor. Enum'a yazılabilir (bedava) ama sync yazılmaz.
- **Bölüm 3'teki "Genre sayfası"** Faz 3'e ait; Faz 1'de tür alanı sadece veri olarak durur, ayrı sayfa açılmaz.
- **`MusicMemory` ayrı tablo olarak gereksiz**: `Notes` ve `Memories` her alanı paylaşıyor (iki dilli gövde, entity bağı, sıra). İki tablo, iki dilli + nullable-FK makinesini iki kez kurmak demek. **Karar:** tek `MusicNote` + `kind: NOTE | MEMORY` enum + opsiyonel `happenedAt` (anının tarihi). Proje "tür ayıran enum" desenini zaten kullanıyor (`MovieStatus`, `BookStatus`, `BookPersonRole`, `CharacterImageSlot`).

### 1.17 Plandan eksik olan zorunlu kurallar (AGENTS.md)

Plan hiç bahsetmiyor, hepsi zorunlu:

- **Kural 3 · yumuşak silme:** her müzik entity'sinde `isDeleted Boolean @default(false)`, `createdAt`, `updatedAt`.
- **Kural 14 · slug:** her sayfası olan entity'de `slug String @unique`; rota **slug** üstünden (`/muzik/linkin-park`), Spotify kimliği üstünden değil. Silmede `-deleted-{timestamp}` soneki.
- **Kural 14 · index:** her FK'ye açık `@@index` (Prisma koymuyor). Şemada bildirilmemiş index'in bedeli bu projede bir kez yaşanmış (`schema.prisma:123-130`): `prisma migrate dev` üretimdeki index'i düşüren bir migration üretiyordu.
- **Kural 6/12 · `userId`:** arşiv kişisel kalıyor (STATE.md kararı) ama şema çok kullanıcıya hazır kurulur — her kişisel kayıt `userId` taşır ve `@@unique([userId, <entity>Id])` ile tekrar korunur (`Favorite` deseni).
- **Kural 15 · arama:** sanatçı/albüm/parça araması Postgres full-text (`tsvector`) ile. `contains` ile başlanıp sonra dönülmez.
- **Kural 1 · metin:** hiçbir görünür dize kodda değil; `messages/tr.json|en.json` içinde yeni `music` isim alanı.
- **Kural 16 · deri:** yeni salon `globals.css`e `[data-category="muzik"]` deri bloğu **eksiksiz token setiyle** eklenir. Derisiz rota bu projede yaşanmış bir hata (`globals.css:225-237`: `dizi` derisi hiç yoktu, dört giriş noktası tanımsız token okuyordu).
- **Kural 4 · gizli anahtar:** `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` yalnızca backend `.env`; `NEXT_PUBLIC_` öneki **yasak**.

### 1.18 Spotify Geliştirici Şartları — bilinçli kabul edilecek artık risk

Spotify'ın geliştirici politikası metadata ve kapak görselinin süresiz yerel kopyalanmasına sıcak bakmaz; kapak görselinin değiştirilmemesi ve içeriğin Spotify'a atıfla sunulması beklenir. Bu kişisel, ticari olmayan bir arşiv olduğu için risk orantılı — ama mimari kararı **geri alınabilir** tutmak bedava:

- Orijinal Spotify kapak adresi her kayıtta ayrıca saklanır (plan bunu zaten istiyor) → gerekirse hotlink'e dönmek tek satırlık bir okuma değişikliği olur.
- Yerelleştirme bir **ortam değişkeniyle** kapatılabilir olsun (`MUSIC_ARTWORK_LOCALIZE=1`), koda gömülü bir karar olmasın.
- Her sanatçı/albüm sayfasında "Spotify'da Aç" bağlantısı zorunlu alan sayılır (plan zaten istiyor, artık gerekçesi de var).

---

## 2. Nihai entity / ilişki listesi

Adlandırma: `Music*` öneki (§1.1, §1.2). Ortak alanlar her modelde: `id cuid`, `createdAt`, `updatedAt`, `isDeleted` (kural 3) — aşağıda tekrar yazılmadı.

### 2.1 Katalog (Faz 1)

```
MusicPerson                  gerçek kişi — yalnızca küratör açar (§1.13)
  slug @unique               rota anahtarı
  name, sortName?            "Bennington, Chester" — listeleme sırası
  birthDate?, deathDate?, originCountry?
  bio? @db.Text              küratör metni (dış veri DEĞİL)
  photo?                     /uploads/music/… (yerelleştirilmiş)
  photoSourceUrl?, photoFetchedAt?
  spotifyId? @unique         Spotify kişi/act ayrımı yapmaz; genelde null
  externalData? Json, externalDataFetchedAt?
  memberships MusicMembership[]
  trackCredits MusicTrackCredit[]
  externalRefs MusicExternalRef[]
  @@index([slug]) @@index([isDeleted])

MusicalAct                   grup / solo proje / orkestra
  slug @unique, name, sortName?
  actKind MusicActKind @default(UNCLASSIFIED)     ← ontolojik tür (§1.13)
  formedYear?, disbandedYear?, originCity?, originCountry?
  bio? @db.Text                                   küratör metni
  image?, imageSourceUrl?, imageFetchedAt?
  popularity? Int, followers? Int                 Spotify metriği (metadata)
  spotifyId? @unique
  externalData? Json, externalDataFetchedAt?
  albums MusicAlbum[]
  memberships MusicMembership[]
  genres MusicGenreOnAct[]
  eras MusicEra[]
  trackCredits MusicTrackCredit[]
  externalRefs MusicExternalRef[]
  @@index([actKind, isDeleted]) @@index([isDeleted])

MusicRole                    KONTROLLÜ SÖZLÜK — tamamen bizim (Spotify vermiyor)
  key @unique                i18n anahtarı: "vocalist", "composer" (BookGenre.key deseni)
  slug @unique
  orderIndex Int @default(0)
  memberships MusicMembership[]
  trackCredits MusicTrackCredit[]
  ⚠️ isApproved YOK: dış kaynaktan gelmiyor, seed ile kurulur
  seed: vocalist, guitarist, bassist, drummer, keyboardist, dj, turntablist,
        composer, songwriter, producer, arranger, conductor, mixing_engineer,
        mastering_engineer, featured_artist, primary_artist

MusicMembership              MusicPerson ↔ MusicalAct
  personId → MusicPerson, actId → MusicalAct, roleId → MusicRole
  startedAt?, endedAt?, isCurrent Boolean @default(true)
  orderIndex Int @default(0), note?
  ⚠️ Bileşik @@id KULLANILMAZ (BookPersonOnEntry'den ayrıldığı yer): ayrılıp
     geri dönen üye aynı (act, person, role) üçlüsünü iki tarih aralığıyla
     taşır. `id cuid()` + @@unique([actId, personId, roleId, startedAt])
  @@index([personId]) @@index([actId, orderIndex]) @@index([roleId])

MusicAlbum
  actId → MusicalAct, slug @unique, title, originalTitle?
  albumType MusicAlbumType @default(ALBUM)        ← §1.14 (Single/EP dolgusu)
  releaseDate?, releaseDatePrecision?             ← §1.14 (uydurma gün yok)
  totalTracks?, label?, popularity?
  artwork?                                        /uploads/music/… (yerel)
  artworkSourceUrl?                               orijinal Spotify adresi (§1.18)
  artworkFetchedAt?                               null = indirilemedi, cron tekrar dener
  spotifyId? @unique
  externalData? Json, externalDataFetchedAt?
  eraId? → MusicEra                               açık FK (§1.15)
  tracks MusicTrack[]
  @@index([actId, releaseDate]) @@index([actId, albumType, isDeleted]) @@index([eraId])

MusicTrack
  albumId → MusicAlbum, slug @unique, title
  discNumber Int @default(1), trackNumber Int @default(0)   ← §1.14
  durationMs?, isExplicit Boolean @default(false), popularity?
  spotifyId? @unique
  externalData? Json, externalDataFetchedAt?
  credits MusicTrackCredit[]
  ⚠️ previewUrl EKLENMEZ (§1.11 — kaynak kapandı)
  @@index([albumId, discNumber, trackNumber]) @@index([isDeleted])

MusicTrackCredit             Track ↔ (Person VEYA Act)
  trackId → MusicTrack, roleId → MusicRole
  personId? → MusicPerson, actId? → MusicalAct
  orderIndex Int @default(0)
  ⚠️ "tam olarak biri dolu" kuralı Prisma'da ifade edilemez → servis katmanında
     doğrulanır (Comment/Favorite deseninin bilinen bedeli, schema.prisma:1048)
  @@index([trackId, orderIndex]) @@index([personId]) @@index([actId]) @@index([roleId])
```

### 2.2 Tür ve dönem (Faz 3)

```
MusicGenre                   BookGenre'ın birebir kardeşi (§1.8)
  slug @unique, name
  key? @unique               ön yüzdeki sabit tür listesinin i18n anahtarı
  parentId? → MusicGenre     ← planın gerçek yeniliği: alt tür hiyerarşisi
  children MusicGenre[]
  isApproved Boolean @default(false)   ← Spotify'dan gelen tür ONAY BEKLER
  acts MusicGenreOnAct[]
  @@index([isApproved]) @@index([parentId])

MusicGenreOnAct              many-to-many
  actId, genreId  →  @@id([actId, genreId])  @@index([genreId])

MusicEra                     BANDIN KENDİ TARİHİ — nesnel (plan: ArtistEra)
  actId → MusicalAct, slug @unique, name
  startedAt?, endedAt?, description? @db.Text
  orderIndex Int @default(0)
  albums MusicAlbum[]
  @@index([actId, orderIndex])
```

### 2.3 Kişisel katman (Faz 2) — sync buraya ASLA yazmaz

Fiziksel olarak ayrı tablolar (§1.5). Hepsi `userId` taşır (kural 6/12), nullable gerçek FK'lerle bağlanır (`Favorite` deseni, `schema.prisma:1059`).

```
MusicRating
  userId, score Float, ratedAt DateTime @default(now())
  personId? / actId? / albumId? / trackId?
  @@unique([userId, actId]) @@unique([userId, albumId])
  @@unique([userId, trackId]) @@unique([userId, personId])

MusicNote                    NOT ve ANI tek tabloda (§1.16)
  userId, kind MusicNoteKind @default(NOTE)    NOTE | MEMORY
  bodyTr? @db.Text, bodyEn? @db.Text           ← ikiz sütun, çeviri tablosu değil (§1.6)
  happenedAt?                                  yalnızca MEMORY'de anlamlı
  orderIndex Int @default(0)
  personId? / actId? / albumId? / trackId?
  @@index([userId, kind, isDeleted])
  @@index([actId]) @@index([albumId]) @@index([trackId]) @@index([personId])

MusicFavorite
  userId, personId? / actId? / albumId? / trackId?
  @@unique([userId, trackId]) @@unique([userId, albumId])
  @@unique([userId, actId]) @@unique([userId, personId])

MusicPersonalEra             KULLANICININ kendi dönemi (plan: PersonalChronology)
  userId, slug @unique, title, startedAt?, endedAt?
  bodyTr? @db.Text, bodyEn? @db.Text
  orderIndex Int
  ⚠️ MusicEra ile HİÇBİR ilişkisi yok, hiçbir sorguda birleştirilmez.
     MusicEra actId'ye bağlıdır (bandın tarihi); bu userId'ye (senin tarihin).
     Aynı tabloda birleştirme önerisi gelirse REDDEDİLİR.
  @@index([userId, startedAt])
```

### 2.4 Dış kaynak ve sync (Faz 1)

```
MusicExternalRef             ikincil kaynaklar — polimorfik DEĞİL (§1.4)
  provider MusicProvider                SPOTIFY | MUSICBRAINZ | DISCOGS | WIKIDATA | LASTFM
  entityKind MusicEntityKind            PERSON | ACT | ALBUM | TRACK
  externalId, url?, lastSyncedAt?
  personId? / actId? / albumId? / trackId?     ← gerçek FK, cascade çalışır
  @@unique([provider, entityKind, externalId])
  @@index([actId]) @@index([albumId]) @@index([trackId]) @@index([personId])

MusicSyncState               Bull yerine (§1.3)
  entityKind MusicEntityKind, entityId String
  status MusicSyncStatus     PENDING | RUNNING | OK | FAILED
  attempts Int @default(0), lastError?, lastRunAt?, nextRunAt?
  @@unique([entityKind, entityId])
  @@index([status, nextRunAt])
```

### 2.5 Nexus (Faz 4) — yalnızca müzik-içi

```
MusicNexusEdge
  sourceKind/sourceId, targetKind/targetId   (MusicEntityKind)
  relationType MusicNexusRelationType
  noteTr?, noteEn?, orderIndex
  @@unique([sourceKind, sourceId, targetKind, targetId, relationType])
  @@index([sourceKind, sourceId]) @@index([targetKind, targetId])

enum MusicNexusRelationType   ← daraltıldı (§1.7)
  RELATED_TO, INSPIRED_BY, SIDE_PROJECT_OF, SUCCESSOR_OF,
  COLLABORATED_WITH, BASED_ON
  ⚠️ MEMBER_OF / FEATURED_IN / PART_OF / COMPOSED_FOR / PRODUCED YOK:
     gerçek tablolarda (Membership, TrackCredit, Album.actId) zaten var.
```

### 2.6 Enum'lar

```
MusicActKind      UNCLASSIFIED | BAND | SOLO_PROJECT | DUO | GROUP | ORCHESTRA
MusicAlbumType    ALBUM | SINGLE | EP | COMPILATION | LIVE | SOUNDTRACK
MusicNoteKind     NOTE | MEMORY
MusicProvider     SPOTIFY | MUSICBRAINZ | DISCOGS | WIKIDATA | LASTFM
MusicEntityKind   PERSON | ACT | ALBUM | TRACK
MusicSyncStatus   PENDING | RUNNING | OK | FAILED
```

**Toplam:** 15 model + 6 enum. Mevcut şemaya hiçbir dokunuş yok — tamamı additive (kural 12).

### 2.6.1 Tasarımdan gelen eklemeler (11 Ağustos 2026)

Kullanıcının `claude.ai/design` projesindeki **2a–2d** ekranları okundu (`Kuronexus müzik sayfası tasarımı`, dosya `Muzik Sayfasi.dc.html`). Tasarım, §2.1–2.6'daki modelin karşılamadığı dört şey istiyor; dördü de Faz 1 migration'ına alındı (migration henüz hiçbir veritabanına uygulanmamıştı, ikinci bir migration açmak yerine aynısı yeniden üretildi):

```
MusicPlaylist            2a "Favori Listelerim", 2b "Odanın çalma listesi", 2d
  slug/name/description, trackCount, durationMs, artwork(+source/fetchedAt),
  orderIndex, isFavorite, spotifyId, externalData
  ⚠️ Tür karışım yüzdesi SAKLANMAZ, türetilir: parça→albüm→act→tür zinciri
     zaten var. Sütuna yazmak, tür onayı değişince yanlış kalacak ikinci bir
     gerçek üretirdi.

MusicPlaylistTrack       position, addedAt  →  @@id([playlistId, trackId])

MusicPlay                2d'nin TEK kaynağı — dinleme kaydı
  userId, playedAt, msPlayed, spotifyTrackUri,
  trackName/artistName/albumName (düz metin), source, trackId?
  @@unique([userId, playedAt, spotifyTrackUri])

MusicalAct.bannerImage   2c'nin 2000×640 üst bandı (kare `image`den ayrı)
MusicGenre.accentKey     2b'nin oda rengi — TOKEN ANAHTARI, hex değil
MusicPlaySource enum     IMPORT | RECENTLY_PLAYED
```

**🔴 Neden `MusicPlay` zorunlu:** Spotify Web API'sinde **çalma sayısı ucu yok.** Tasarımdaki "1.842 dinleme", "61s 24d dinleme süresi", "en yoğun gün: Cuma", "%23 yeni keşif" hiçbir istekle gelmiyor. Gelen iki şey de yetersiz: `/me/top/*` sıralama verir sayı vermez, `/me/player/recently-played` yalnızca son 50 kaydı verir ve geçmişi yoktur. Sayılar ancak kendi biriktirdiğimiz kayıttan çıkar.

**Kullanıcı kararları (11 Ağustos):**
- **Dinleme verisi:** Spotify hesap ayarlarından istenecek **"Extended streaming history"** dosyaları bir kez içe aktarılır (tüm zamanlar → 2d ilk günden gerçek), sonrası Faz 5'te `recently-played` yoklamasıyla güncel kalır.
- **Çalma listeleri herkese açık** → Client Credentials ile Faz 1'de okunabiliyor, kullanıcı girişi gerekmiyor. ⚠️ Spotify'ın kendi editoryal/algoritmik listeleri (Discover Weekly vb.) yeni uygulamalara kapalı; yalnızca kullanıcının kendi listeleri.
- **Fontlar:** Cinzel + Bebas Neue + JetBrains Mono `next/font` ile self-host edilir; tasarımdaki Instrument Sans → mevcut sans, Cormorant → zaten kurulu Cormorant Garamond'a eşlenir. Dış font kaynağı **eklenmez** (CSP `font-src 'self' data:`; bu proje font `@import`'unu ölçerek kaldırmıştı).

**Tasarımın düzeltilecek iki yeri:**
1. Tasarım "**SALON 07 · MÜZİK**" yazıyor — salon numarası kararından (§3.2.1) önce çizilmiş. **06** olacak; 07 Temürkan.
2. Renkler sabit hex (`#0d1412`, `#5f9c8a`, `#b89968`) ve tek görünüşe bağlı. Kural 16 bileşende hex yasaklıyor → `[data-category="muzik"]` deri bloğunda **eksiksiz token setiyle** kurulur ve iki temanın (mor/lacivert) altında da çalışır. Tür odası renkleri `[data-genre="rock|pop|rnb|electronic"]` olarak, `MusicGenre.accentKey` üstünden bağlanır.

### 2.7 Sync'in yazma izni — tek cümlelik değişmez kural

> **Katalog sync'i** (act/album/track/playlist tazeleme) **yalnızca** şu tablolara yazar: `MusicPerson`, `MusicalAct`, `MusicAlbum`, `MusicTrack`, `MusicTrackCredit`, `MusicGenre` (`isApproved: false` ile), `MusicGenreOnAct`, `MusicPlaylist`, `MusicPlaylistTrack`, `MusicExternalRef`, `MusicSyncState`.
> `MusicRating`, `MusicNote`, `MusicFavorite`, `MusicPersonalEra`, `MusicEra`, `MusicRole`, **`MusicPlay`** tablolarına **hiçbir kod yolundan** yazmaz. `MusicPlay`e yalnızca dinleme içe aktarımı ve `recently-played` yoklaması yazar — o da katalog sync'inden ayrı bir servis. Bu, `music-sync.service.ts` başındaki yorumda ve bir birim testinde (`expect(prisma.musicRating.update).not.toHaveBeenCalled()`, `expect(prisma.musicPlay.deleteMany).not.toHaveBeenCalled()`) sabitlenir.

---

## 3. Kadim Dünyalar'ın kaldırılması — URL / redirect / SEO göç planı

### 3.0 Faz 0 — canlı ölçüm sonucu (11 Ağustos 2026)

Kaynak: `https://api.kuronexus.com` — `GET /universe-categories`, `GET /universes`, `GET /universes/:slug`, `GET /universes/:slug/wiki`.

**Kategoriler: 5 kayıt.** `film`, `dizi`, `spor`, `anime`, `kadim-dunyalar`. **`kitap` kategorisi yok** — `CODE_HALLS` (`halls.ts:35`) doğrulandı, Kitap bir kod salonu. Kapı duvarı bu yüzden 6 kapı çiziyor (5 kategori + kod salonu Kitap), Temürkan sonuna eklenince 07 oluyor. §3.2.1'deki numaralandırma canlı veriyle teyitli.

**Evrenler: 10 kayıt.** 2'si spor kanadında (`galatasaray`, `formula-1` — taşınmış), **8'i kadim-dunyalar'da**. §3.1/3'teki 8 evren listesi (kod yorumundan okunmuştu) birebir doğrulandı.

**🔴 Beklenmeyen sonuç — evrenlerin 6'sı tamamen boş:**

| Evren | Yayımlanmış bölüm | Wiki girdisi | Kamuya açık URL |
| --- | --- | --- | --- |
| `temurkan-efsaneleri` | 1 | 4 (CHARACTER 2, LOCATION 1, TERM 1) | 7 |
| `zaman-carki` | 0 | 2 (CHARACTER 1, TERM 1) | 4 |
| `dune` | 0 | 0 | 2 |
| `malazan-yitikler` | 0 | 0 | 2 |
| `firtinaisigi-arsivi` | 0 | 0 | 2 |
| `buz-ve-atesin-sarkisi` | 0 | 0 | 2 |
| `kral-katili-guncesi` | 0 | 0 | 2 |
| `yuzuklerin-efendisi` | 0 | 0 | 2 |
| **Toplam** | **1** | **6** | **23** |

⚠️ `GET /universes/:slug` `isPublished: true` süzüyor (`universes.service.ts:58-61`) — yayımlanmamış taslaklar bu ölçümde **görünmüyor**. Atölyesi olan tek evren Temürkan; diğer yedisinde taslak olma olasılığı düşük ama kesinlik için admin ucundan bakılmalı (bu ölçüm kamuya açık uçlardan yapıldı, yönetici oturumu açılmadı).

**Bunun göç planına iki etkisi var:**

1. **SEO kaybı riski neredeyse yok.** Kaldırılacak kapının ardındaki 8 evrenden 6'sı içeriksiz kabuk. Planın Bölüm 8'i "301 redirect, internal link taraması, sitemap" diye ciddi bir SEO işi öngörüyordu; ölçüm bunun **iki adet 301**'e indiğini gösteriyor (§3.2) ve kaybedilen indekslenebilir içerik **sıfır**.
2. **"Şimdi taşı" kararının dayanağı çöktü.** §5.1/3'teki karar benim "evren sayfaları kendi wiki içeriğini zaten taşıyor, boş değiller" önermesine dayanıyordu — **ölçüm bu önermeyi yalanladı**. 6 boş kabuğu `kitap` kategorisine taşımak, Kitap kapısının altına "9 evren" yazdırıp altısını boş açtırır. Yeniden karar gerekiyor, bkz. §5.3.

**Yan bulgu (bu işin kapsamı dışında, ayrı madde):** `sitemap.ts` yalnızca evren sayfalarını listeliyor; wiki girdileri (`/dark-stories/:u/wiki/:e`) ve yayımlanmış bölümler (`/dark-stories/:u/:story`) sitemap'te **hiç yok**. Yani bugün 6 wiki girdisi + 1 bölüm arama motoruna bildirilmiyor.

### 3.1 🔴 En önemli bulgu: Kadim Dünyalar planın anlattığı şey değil

Plan onu "çok-kitaplı evren galerisi (Dune, Wheel of Time)" diye tarif ediyor ve "bu işi kitap serisi sayfaları karşılıyor" diyor. Kod başka bir şey söylüyor:

1. **`WikiUniverse` sitenin taşıyıcı kolonu.** `Story`, `WikiEntry`, `AmbientTrack`, `SportPlayer`, `SportLegend`, `RaceEvent`, `DriverStanding`, `TransferNews`, `BookEntry`, `FootballClub` — onu **hepsi** referans alıyor (`schema.prisma:110-121`). Model olarak kaldırılması söz konusu değil; kaldırılan şey **salon kapısı**.
2. **`temurkan-efsaneleri` bir Kadim Dünyalar evreni, ana sayfanın baş köşesi — ama kapısı kategori sistemine bağlı DEĞİL.** `pulse.service.ts` → `FEATURED_UNIVERSE_SLUG = 'temurkan-efsaneleri'`. Üstelik sitenin **kendi kurgusu**: `/admin/atolye/[universeSlug]` el yazması editörü ve `Story.orderIndex` okuma sırası oraya bağlı.
   Kapı duvarındaki yeri ölçüldü (`app/[locale]/page.tsx:135-150`): Temürkan **sentetik bir mühürlü kapı** olarak listenin sonuna elle ekleniyor (`slug: "temurkan-muhru"`, `sealed: true`, `hall: doors.length + 1`), bir `UniverseCategory` kaydı **değil** — yorumu da bunu söylüyor: "Temürkan bir kategori değil bir evren". Bugün 6 salon + Temürkan = **Salon 07**.
   **Sonuç (iyi haber):** `kadim-dunyalar` kategorisi yumuşak silinip yerine `muzik` konduğunda Temürkan'ın kapısı **kendiliğinden** yerinde kalır ve numarası 07 olarak korunur. Ona ayrı bir salon açmak için hiçbir iş yapılmasına gerek yok — zaten kendi kapısı var.
   ⚠️ Temürkan `HALL_ORDER`'a **eklenmez**: o liste kategori slug'larını tutuyor ve `hallNumber`/`mergeCodeHalls` oradan sayıyor; kategori olmayan bir slug'ı listeye koymak salon numaralarını kaydırır.
3. **"Kitap serisi zaten karşılıyor" önermesi 8 evrenin yalnızca 4'ü için doğru.** `lib/universes/book-series.ts` ölçümü: `zaman-carki`, `malazan-yitikler`, `firtinaisigi-arsivi`, `dune` → arşivde serisi var. `buz-ve-atesin-sarkisi`, `kral-katili-guncesi`, `yuzuklerin-efendisi`, `temurkan-efsaneleri` → **karşılığı yok**. Bunları "kitap serisine 301'lemek" hedefsiz bir yönlendirme olur; Google bunu soft-404 sayar.
4. **Evren sayfalarının altında canlı içerik var:** `/dark-stories/[universeSlug]/wiki`, `/wiki/[entrySlug]`, `/[storySlug]`. Spor göçünde bu tuzağa özellikle dikkat edilmiş (`next.config.ts:161-166`: "⚠️ JOKER YASAK").

### 3.2 Kararlaştırılan göç: kapı ölür, adresler yaşar

Salon kapısı kaldırılır. Faz 0 ölçümünden (§3.0) sonra evrenler **üç gruba** ayrıldı — karar §5.3'te verildi (11 Ağustos 2026):

| Evren | İçerik | Ne olur | Yönlendirme hedefi |
| --- | --- | --- | --- |
| `temurkan-efsaneleri` | 1 bölüm, 4 wiki, atölye | **durur**, `categoryId: null`, mühürlü kapı ve Salon 07 korunur | — |
| `zaman-carki` | 2 wiki | **durur**, `categoryId` → `kitap` | — |
| `dune` | boş | **yumuşak silinir** | `/dark-stories/category/kitap/seri/dune-serisi` |
| `malazan-yitikler` | boş | **yumuşak silinir** | `…/seri/malazan-yitikler` |
| `firtinaisigi-arsivi` | boş | **yumuşak silinir** | `…/seri/firtinaisigi-arsivi` |
| `buz-ve-atesin-sarkisi` | boş | **yumuşak silinir** | `/dark-stories/category/kitap` |
| `kral-katili-guncesi` | boş | **yumuşak silinir** | `/dark-stories/category/kitap` |
| `yuzuklerin-efendisi` | boş | **yumuşak silinir** | `/dark-stories/category/kitap` |

Üç seri sayfası hedefi **canlıda doğrulandı** (11 Ağustos, `curl -o /dev/null -w %{http_code}`): `dune-serisi`, `malazan-yitikler`, `firtinaisigi-arsivi` → 200. Serisi olmayan üç evren için hedef Kitap kapısı; ilgisiz bir sayfaya 301 atmak Google'da soft-404 sayıldığı için tür sayfası ya da müzik salonu hedef **yapılmaz**.

**Ölen URL ve yönlendirme sayısı:**

| | Adet | Not |
| --- | --- | --- |
| Salon kapısı (TR + EN) | 2 | `→ /dark-stories/category/kitap` |
| Silinen 6 evren kökü (× 2 dil) | 12 | tablodaki hedeflere |
| **Toplam 301** | **14** | jokersiz, her satır elle |
| Silinen evrenlerin `/wiki` alt yolu | 0 | yönlendirilMEZ — sıfır girdi, hiçbir yerden linklenmiyor, sitemap'te yok; kalıcı olarak kaldırılmış ince bir sayfa için **404 doğru cevaptır** |

Evren köklerinin yönlendirilme gerekçesi: bugün her sayfanın footer'ındaki evren sütununda ve `NexusHub` evren rafında **linkli** duruyorlar, yani taranmış olma olasılıkları yüksek. `/wiki` alt yolu hiçbir yerden linkli değil.

Veri tarafı: `kitap` şu an bir **kod salonu** — Faz 0 ölçümü doğruladı, canlıda `UniverseCategory` kaydı yok (`halls.ts:35`). Bu yüzden önce panelden `kitap` kategorisi oluşturulur; `mergeCodeHalls` "veritabanı kazanır" diyor, kapı iki kez çizilmez. Sonra `zaman-carki` o kategoriye taşınır, altı boş evren ve `kadim-dunyalar` kategorisi yumuşak silinir (`isDeleted: true`, kural 3 — fiziksel silme yok), Temürkan'ın `categoryId`'si `null`'a çekilir.

⚠️ **Silme öncesi zorunlu adım:** altı evrende **yayımlanmamış taslak** olup olmadığı yönetici oturumuyla kontrol edilir. Faz 0 ölçümü kamuya açık uçtan yapıldı ve o uç `isPublished: true` süzüyor (`universes.service.ts:58-61`) — taslağı olan bir evren silinmez.
⚠️ Kural 14: slug'lı bir kayıt yumuşak silinirken slug'a `-deleted-{timestamp}` soneki eklenir. Bu evrenlerin slug'ları yönlendirme hedefi **değil kaynağı** olduğu için sorun yok, ama sonek uygulanmazsa aynı slug ileride yeniden kullanılamaz.

### 3.2.1 Salon numaraları — kullanıcı kararı (11 Ağustos 2026)

Müzik, Kadim Dünyalar'ın **yerini** alır; Temürkan yerinde kalır:

```
01 Sinema   02 Dizi   03 Spor   04 Anime   05 Kitap   06 MÜZİK   07 Temürkan (mühürlü)
                                                      ↑ eski Kadim Dünyalar
```

Uygulaması tek satır: `HALL_ORDER` (`halls.ts:10`) içindeki `"kadim-dunyalar"` → `"muzik"`. Numaralar bu listenin sırasından türetiliyor (`page.tsx:125` → `hall: i + 1`), Temürkan de sonuna eklendiği için (`page.tsx:143` → `doors.length + 1`) kendiliğinden 07 kalır. `FALLBACK_SLUGS` de aynı listeyi okuyor (`page.tsx:28` → `= HALL_ORDER`), yani backend düştüğünde çizilen yedek kapı kadrosu da kendiliğinden doğru olur — bu proje o yedek kadroyu bir kez unutmuş ve hatayı yalnızca backend çökünce görmüştü (`halls.ts:143-145`).

### 3.3 Dokunulacak yüzeyler — tam liste

Kaldırma:
1. `frontend/lib/halls.ts:10` — `HALL_ORDER` içindeki `"kadim-dunyalar"` **yerine** `"muzik"` (§3.2.1). `MOVED_HALLS`'a (`halls.ts:153`) `muzik: "/muzik"` satırı; haritanın yorumu "taşınmış" değil "kendi ağacı olan salonlar" diye güncellenir.
2. `frontend/next.config.ts:168` — **14 adet 301** (§3.2 tablosu). `statusCode: 301` yazılır, `permanent: true` **yazılmaz** (308 döner, projede 301 kararı var: `next.config.ts:151-154`). `/en` satırları ayrı ayrı yazılır, `/:locale` jokeri **yasak** (`next.config.ts:156-160`: o desen `en` dışındaki her şeyi de yakalar).
3. `frontend/app/sitemap.ts` — `hallHref` süzgeci ölmüş kapıyı zaten eliyor; `STATIC_PATHS`'e müzik yolları eklenir. Silinen altı evren API'den artık gelmediği için (`isDeleted: false` süzgeci, `universes.service.ts:47`) evren döngüsü **kendiliğinden** doğru kalır — orada elle bir süzgeç gerekmez. `zaman-carki` ve `temurkan-efsaneleri` listede kalmaya devam eder.
3b. **Veri göçü** (`prisma/` altında tek seferlik betik ya da admin panelden elle): `kitap` kategorisi oluşturulur → `zaman-carki.categoryId` ona bağlanır → `temurkan-efsaneleri.categoryId = null` → altı boş evren ve `kadim-dunyalar` kategorisi `isDeleted: true` + slug'a `-deleted-{timestamp}` (kural 14). ⚠️ Prisma betikleri `src/` altından import **edemez** (üretimde derlenmiş `dist/` var) — mevcut betiklerin (`prisma/seed-sport-archive.ts`, `sync-f1-results.ts`) deseni izlenir.
4. `messages/tr.json|en.json` — `home.halls`'a `"muzik"` anahtarı eklenir, `"kadim-dunyalar"` kaldırılır (bu anahtar `t('halls.${slug}')` ile okunuyor: `page.tsx:115,128`). `nav`/`footer` içindeki Kadim Dünyalar metinleri de temizlenir; ölü anahtar bırakılmaz (kural 1).
5. `frontend/app/[locale]/dark-stories/category/[categorySlug]/` — kadim kapı sayfası ve `page.module.css`'i. Rota dinamik olduğu için dosya silinmez, kategori kaydı kalkınca kendiliğinden çizilmez; `kadim` özel dalları varsa temizlenir.
6. `frontend/components/hall/HallSkeleton.tsx:19` — `category` birleşim tipine `"muzik"` eklenir, `"kadim-dunyalar"` çıkarılır.
7. `frontend/app/[locale]/page.tsx` — `FALLBACK_SLUGS = HALL_ORDER` olduğu için **elle dokunulmaz**; yalnızca müzik kapısının ölçü satırının (`measureFor`) nabızda karşılığı olduğu doğrulanır.

**Kaldırılmayacaklar — silinirse kırılır:**
- ❌ `frontend/styles/globals.css:104` `[data-category="kadim-dunyalar"]` deri bloğu. `app/[locale]/dark-stories/[universeSlug]/page.tsx:81` bu değeri **elle** yazıyor; blok silinirse sekiz evren sayfası tanımsız token okur — projede yaşanmış hata (`globals.css:225-237`).
- ❌ `frontend/components/kadim/CodexCard.tsx`, `CodexOrnaments.tsx` — evren sayfasının görsel dili, kapıya ait değil.
- ❌ `WikiUniverse` / `UniverseCategory` modelleri, `/admin/universes`, `/admin/atolye`.
- ❌ `backend/src/pulse/pulse.service.ts` baş köşesi.

### 3.4 SEO kontrol listesi (planın Bölüm 8'inin yerine)

- [ ] 301: 14 satır (2 kapı + 6 evren × 2 dil), `next.config.ts` `redirects()` içinde, jokersiz
- [ ] Silme öncesi yönetici oturumuyla taslak kontrolü (§3.2 uyarısı) — taslağı olan evren silinmez
- [ ] Üç seri sayfası hedefi silme **gününde** yeniden doğrulanır (`curl -I`); Faz 0'da 200'dü ama arşiv değişebilir
- [ ] `hallHref`/`HALL_ORDER` tek kaynağı güncel → kapı duvarı, `NexusHub`, `SiteFooter` **kendiliğinden** doğru (üçü de oradan okuyor, `halls.ts:137-159`)
- [ ] `sitemap.xml`: ölü kapı adresi listede yok, müzik yolları var, evren adresleri **dokunulmadı**
- [ ] `robots.ts`: `/muzik` taranabilir, `/admin/*` kapalı (mevcut durum korunur)
- [ ] Kadim Dünyalar'a işaret eden iç bağlantı taraması: 25 dosyalık liste `grep -ri kadim` ile üretildi, kod bağlantısı yalnızca `halls.ts` + `messages/*.json` üzerinden
- [ ] `hreflang`: `localizedEntries` deseni korunur — her adres kendisi dahil tüm dil eşlerini bildirir
- [ ] Canlıda doğrulama (yerelde ölçülemez, uzak DB erişilemez): `curl -I` ile iki 301, sonra Search Console'da "Yönlendirmeli sayfa" sayısı
- [ ] Kapı düşmeden önce **canlı ölçüm**: `GET /universes` ile `kadim-dunyalar` kategorisindeki evrenlerin gerçek listesi + her birinin wiki girdisi/bölüm sayısı. §3.1'deki 8 evren kod yorumundan okundu; yönlendirme yazmadan önce canlı veriyle doğrulanmalı.

### 3.5 Müzik salonunun kendi ağacı

Spor, `/dark-stories/category/spor`'dan `/spor`'a taşınan **ilk** salon oldu ve desen kuruldu (`lib/sport/routes.ts`). Müzik doğduğu andan itibaren o desende kurulur — sonradan taşınmaz:

```
/muzik                              salon girişi (istatistik, favoriler, Currently Listening)
/muzik/[actSlug]                    sanatçı/grup sayfası + My Archive bloğu
/muzik/[actSlug]/[albumSlug]        Album Room
/muzik/kisi/[personSlug]            kişi sayfası (Chester, Hans Zimmer)
/muzik/tur/[genreSlug]              tür sayfası (Faz 3)
```

`frontend/lib/music/routes.ts` → `musicHref` tek adres kaynağı; hiçbir bileşen `/muzik/...` dizesini elle yazmaz. `halls.ts`teki `MOVED_HALLS` haritası `muzik: "/muzik"` satırıyla genişler (harita artık "taşınmış" değil "kendi ağacı olan" salonları tutuyor — yorumu güncellenir).
Ayrılmış slug listesi: `RESERVED_ACT_SLUGS = { kisi, tur, albumler, parcalar, sanatcilar }` — `RESERVED_CLUB_SLUGS` deseni; dinamik segmentin statik segmenti gölgeleme tuzağı (`lib/sport/routes.ts` yorumu).

---

## 4. Uygulama komutu (kodlama oturumuna verilecek)

> Aşağıdaki metin, bu incelemenin onaylanmasından sonra Claude Code'a verilecek komuttur. §5'teki kararlar cevaplanmadan Faz 2 ve Faz 3'e başlanmaz.

---

**KuroNexus Müzik Salonu — uygulama komutu**

`docs/kuronexus-muzik-bolumu-tasarim-plani.md` ve `docs/muzik-bolumu-inceleme.md` ikisini de oku; **çelişki olursa inceleme dosyası kazanır** (plan Redis/Bull ve çıplak entity adları gibi bu projede geçersiz varsayımlar içeriyor). `.agents/AGENTS.md` kuralları ve `STATE.md` her şeyin üstünde.

Mevcut Film/Dizi/Anime/Kitap/Spor sistemlerine **hiç dokunmadan**, yalnızca ekleyerek çalış (kural 12: additive). Her fazın sonunda dur, çıktıyı bildir, onay bekle.

**Faz 0 — Ölçüm** ✅ **TAMAMLANDI** (11 Ağustos 2026, §3.0). Sonuç: 5 kategori, 8 kadim evreni, bunların 6'sı tamamen boş. Kararlar §5.1 ve §5.3'te. Tekrar çalıştırılmasına gerek yok — yalnızca Faz 6 öncesi taslak kontrolü (yönetici oturumu) ve seri hedeflerinin gün-içi doğrulaması kaldı.

**Faz 1 — Çekirdek katalog + sync altyapısı**
1. `schema.prisma`'ya §2.1, §2.4 ve §2.6'daki modeller/enum'lar eklenir. `MusicRole` adı zorunlu — `Role` enum'u `schema.prisma:1079`'da mevcut, `model Role` şemayı derletmez. Her FK'ye açık `@@index`, her entity'de `slug @unique` + `isDeleted` + zaman damgaları.
2. Migration adı `20260810HHMMSS_add_music_core`. Mevcut hiçbir tabloya `ALTER` çıkmadığını `migration.sql`i okuyarak doğrula ve raporla.
3. `backend/src/music/` modülü: `music.module.ts`, `music.service.ts`, `music.controller.ts` (herkese açık okuma), `music.admin.controller.ts` (`@Roles('ADMIN')`), `dto/` (class-validator, kural 6).
4. `spotify.service.ts` — Client Credentials flow. Token bellekte, süresi dolmadan yenilenir. `SPOTIFY_CLIENT_ID`/`SPOTIFY_CLIENT_SECRET` yalnızca backend `.env`, `NEXT_PUBLIC_` öneki yasak. `ExternalCache` (`schema.prisma:136`) ham yanıt cache'i için kullanılır. Kapalı uçlara **hiç dokunma**: Related Artists, Recommendations, Audio Features/Analysis, `preview_url`.
5. `music-artwork.service.ts` — `books/book-cover.service.ts`in birebir kardeşi: host beyaz listesi (`*.scdn.co`, `image-cdn-*.spotifycdn.com`), `redirect: 'manual'` + her sıçramada yeniden süzme, uzantı **içerik imzasından**, boyut sınırı, timeout, **asla fırlatmaz — `null` döner**. Hedef `UPLOAD_DIR/music/`, servis yolu `/uploads/music/…`. `MediaAsset` kaydı açma (arka plan job'ında `userId` yok). Yerelleştirme `MUSIC_ARTWORK_LOCALIZE` ile kapatılabilir olsun; `artworkSourceUrl` her zaman saklanır.
6. `music-sync.service.ts` + `music.cron.ts` — `anime/anime.cron.ts` deseni: `@Cron` + `private running = false` bayrağı, tek kayıt düşerse tur devam eder. **Redis/Bull kurma.** Kuyruk `MusicSyncState` tablosu. Servisin başına §2.7'deki yazma-izni kuralını yorum olarak yaz ve `expect(prisma.musicRating.update).not.toHaveBeenCalled()` biçiminde bir birim testiyle sabitle.
7. Elle tetikleme: `POST /admin/music/acts/:id/refresh`, `POST /admin/music/albums/:id/refresh`, `POST /admin/music/artwork/localize` (`books.admin.controller.ts` deseni).
8. Spotify'dan gelen her "artist" `MusicalAct` olarak açılır, `actKind: UNCLASSIFIED` ile. `MusicPerson` otomatik açılmaz. Türler `MusicGenre.isApproved: false` ile açılır ve `GET /admin/music/genres/pending` ucunda onay bekler.
9. `MusicRole` sözlüğü `prisma/seed.ts`e eklenir (§2.1'deki 16 anahtar). Etiketler `messages/*.json` içindeki `music.roles.<key>` üzerinden okunur, tabloda görünen metin tutulmaz (kural 1).
10. Ön yüz: `frontend/lib/music/routes.ts` (`musicHref` + `RESERVED_ACT_SLUGS`), `frontend/lib/api/music.ts`, `/muzik` ve `/muzik/[actSlug]` rotaları, `globals.css`e `[data-category="muzik"]` deri bloğu **eksiksiz token setiyle** (kural 16, glow yasak), `messages/tr.json|en.json` içinde `music` isim alanı. `next.config.ts` CSP: `frame-src`'ye `https://open.spotify.com` eklenir; `img-src` ve `remotePatterns` **değişmez**.
11. Faz 1 salt okunur — kişisel katman yok.

**Faz 2 — Kişisel katman**
§2.3'teki dört tablo, ayrı migration. Artist sayfasında "My Archive" bloğu. Notlar `bodyTr`/`bodyEn` ikiz sütun; boş dil dolu olana düşer. Kural 6/12: her kayıt `userId` + `@@unique([userId, <entity>Id])`.

**Faz 3 — Tür & Dönem**
§2.2. `MusicAlbum.eraId`'yi dolduran **admin formu bu fazın çıkış şartı** — form olmadan alan boş kalır (`BookEntry.universeId` böyle boş kaldı, `lib/universes/book-series.ts` ölçümü). Arama Postgres full-text (`tsvector`, kural 15).

**Faz 4 — Nexus (müzik-içi)**
§2.5. Daraltılmış enum. Family Tree görselleştirmesi **gerçek ilişkilerden** çizilir (Membership/Album.actId/Track.albumId); `MusicNexusEdge` yalnızca FK ile ifade edilemeyen bağları taşır.

**Faz 5 — Salon girişi**
İstatistik paneli. Currently Listening: Authorization Code flow + refresh token backend `.env`'de. "Veri yok" ile "bağlantı koptu" **ayrı** durumlar olsun (STATE.md bulgu Ö-8: sessiz boş yanıt gerçek boşlukla karışıyor).

**Faz 6 — Kadim Dünyalar kapısının kaldırılması**
§3.2, §3.2.1, §3.3 ve §3.4'ü uygula. **14 adet 301**, jokersiz, `/en` satırları ayrı. Salon 06 müzik olur, Temürkan 07'de kalır ve kapısına **hiç dokunulmaz** (kategori sisteminden bağımsız; yalnızca `categoryId` `null`'a çekilir). Altı boş evren yumuşak silinir — **ama önce yönetici oturumuyla yayımlanmamış taslak kontrolü yapılır, taslağı olan evren silinmez.** `zaman-carki` silinmez, `kitap` kategorisine taşınır. `globals.css` kadim deri bloğu ve `components/kadim/*` **silinmez** (evren sayfasının görsel dili, `page.tsx:81` o değeri elle yazıyor). Wildcard yönlendirme **yasak**.

**Her fazın sonunda:** `cd backend && npx tsc --noEmit` ve `cd frontend && npx tsc --noEmit`. Backend'de `npm run lint` **çalıştırma** (içindeki `--fix` gerekli tip dönüşümlerini siliyor); `npx eslint <yol>` kullan. `STATE.md`'yi güncelle (kural 9).

---

## 5. Kararlar

### 5.1 Verilen kararlar (11 Ağustos 2026, kullanıcı)

1. ✅ **Salon numaraları:** Müzik, Kadim Dünyalar'ın yerini alır → **Salon 06**. Temürkan Efsaneleri **Salon 07**'de kalır. Bkz. §3.2.1.
2. ✅ **Temürkan kendi salonu olarak durur** — ölçüldü: zaten öyle. Mühürlü kapısı `page.tsx:135-150`'de kategori sisteminden bağımsız olarak eklendiği için ek iş gerektirmiyor; yalnızca `categoryId` `null`'a çekilir.
3. ✅ **Boş evrenler yumuşak silinir** (§5.3'te yeniden karar verildi). İlk karar "hepsini `kitap`a taşı" idi; Faz 0 ölçümü altısının tamamen boş olduğunu gösterince değişti. Kalan iki evren: `zaman-carki` → `kitap`, `temurkan-efsaneleri` → `categoryId: null`, kapısı yerinde.
4. ✅ **Redis/Bull yok.** `@Cron` + `MusicSyncState` (§1.3).
5. ✅ **Salonun görünen adı "Müzik".** `messages/tr.json` → `home.halls.muzik = "Müzik"`, `messages/en.json` → `home.halls.muzik = "Music"`. Mevcut altı salonun deseni birebir korunuyor: Sinema/Cinema, Dizi/Series, Spor/Sports, Anime/Anime, Kitap/Books — hepsi tek kelime. Kategori kaydının `name` alanı da "Müzik" olarak açılır; `hallName` (`halls.ts:124`) veritabanı adını okuduğu için panelden yeniden adlandırma tüm yüzeyleri birlikte değiştirir.

### 5.2 Hâlâ açık olanlar

Faz 2 başlamadan cevaplanmalı:

6. **İngilizce not zorunlu mu?** Önerim: hayır — TR yazılır, EN boş kalabilir, gösterimde dolu olana düşülür, admin panelde "çeviri bekliyor" rozeti görünür.
7. **Faz 1'e hangi sanatçılarla başlanacak?** Sync'i 3–5 gerçek sanatçıyla (Linkin Park + Dead by Sunrise + Hans Zimmer gibi) doğrulamak, hem solo/grup ayrımını hem `MusicMembership`'i hem çoklu-act'li kişiyi tek turda sınar.

### 5.3 Yeniden karar: 6 boş evren — ✅ YUMUŞAK SİLME (11 Ağustos 2026)

Faz 0 ölçümü (§3.0): `dune`, `malazan-yitikler`, `firtinaisigi-arsivi`, `buz-ve-atesin-sarkisi`, `kral-katili-guncesi`, `yuzuklerin-efendisi` → **sıfır bölüm, sıfır wiki girdisi**. Bugün kapı duvarında, `NexusHub` evren rafında ve her sayfanın footer'ındaki evren sütununda görünüyorlar; tıklayan boş bir sayfa buluyor.

| | Ne olur | Bedel |
| --- | --- | --- |
| **(a) Yumuşak sil** (`isDeleted: true`, kural 3) | Altı boş kabuk kaybolur. Kitap kapısı yalnızca gerçek serileri sayar, footer/Nexus rafı temizlenir. Kayıp içerik: **sıfır**. Geri alınabilir — bayrak geri çevrilir. | 6 URL ölür → 6 × 2 dil = 12 adet 301 gerekir (`/dark-stories/category/kitap`e). Toplam yönlendirme 2 → 14. |
| **(b) `kitap` kategorisine taşı** (mevcut karar) | Adresler yaşar, yönlendirme sayısı 2'de kalır. | Kitap kapısı "9 evren" der, altısı boş açar — ziyaretçiye verilen sayı yalan olur. Bugünkü sorun Kitap kapısına taşınmış olur. |
| **(c) Taşımadan yerinde bırak** (`categoryId: null`) | Kapı ölür, evrenler kimsesiz kalır: adres yaşar, hiçbir kapıdan girilmez, footer rafında görünmeye devam eder. Yönlendirme: 2. | "Ne kapıda ne silinmiş" ara durum; en açıklaması zor hâl. |

**Önerim: (a) — yumuşak sil, ama iki evreni ayır.** `zaman-carki` (2 wiki girdisi var) ve `temurkan-efsaneleri` (1 bölüm + 4 wiki + atölye) durur; `zaman-carki` `kitap` kategorisine taşınır (arşivde serisi var), Temürkan `categoryId: null` ile kendi mühürlü kapısında kalır. Altı boş kabuk yumuşak silinir.
Gerekçe: 14 yönlendirme yazmak 12 boş sayfayı canlı tutmaktan ucuz, geri alınabilir ve ziyaretçiye söylenen evren sayısı doğru kalır. Boş sayfa Google'da "thin content" olarak da bir yük.
⚠️ Silmeden önce yönetici oturumuyla **yayımlanmamış taslak** kontrolü yapılmalı (§3.0 notu): taslağı olan bir evren silinmez.
