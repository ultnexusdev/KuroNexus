# KuroNexus — Kişisel Karanlık Evren Portalı (v3)

Japonca "Kuro" (暗/黒 — karanlık, siyah) temalı, tamamen kişisel zevklere yönelik bir dijital evren. Dark stories, fandom wikileri, anime/film arşivi ve karakter analizlerini bir arada barındıran, **tek kullanıcılı başlayıp çoklu kullanıcıya büyümeye hazır** bir kişisel site.

> Bu belge, önceki taslağın ultnexus.com'da kanıtlanmış mimari desen ve konuşma boyunca netleşen ürün kararlarına göre güncellenmiş halidir.
>
> **v3 değişiklikleri:** Wiki çapraz linkleme modeli (`WikiEntryRelation`), performans indexleri, soft delete + unique slug çözümü, Favorite tekrar koruması, dış API cache tazelik alanı, email doğrulama alanları, dosya/görsel yükleme modülü (Faz 1), yedekleme stratejisi, rate limiting (Faz 1), site içi arama (Faz 2/4), pnpm komut düzeltmeleri.

## Kullanıcının İstekleri (Temel Modüller)

| Modül | Açıklama |
|---|---|
| 🏠 Ana Sayfa | Dark temalı, atmosferik landing page |
| 📖 Dark Stories | Kısa karanlık hikayeler yazma/yayınlama (admin) |
| ⚙️ Zaman Çarkı (Wheel of Time) Wiki | Karakterler, terimler, şehirler — fandom wiki |
| 🎬 Anime/Film Arşivi | TMDB/Anilist entegrasyonu + incelemeler, yorumlar |
| 🗡️ Karakter Analizleri | Zaraki Kenpachi gibi derinlemesine karakter incelemeleri |

---

## Ek Öneriler (Kabul Edilen)

| # | Özellik | Faz |
|---|---|---|
| 1 | 🎵 Ambiyans Sistemi (arka plan ses/müzik) | 4 |
| 2 | 📊 Kişisel İstatistik Panosu | 4 |
| 3 | 🌑 Mood Board / Estetik Galeri | 4 |
| 4 | 💬 Alıntı Defteri (Quote Vault) | 4 |
| 5 | 🗺️ İnteraktif Haritalar (wiki evrenleri için) | 4 |
| 6 | 📅 Okuma/İzleme Günlüğü | 4 |
| 7 | 🏷️ Evrensel Etiket Sistemi | 1 (temel şema), 4 (tag cloud UI) |
| 8 | 🔮 "Portal" Navigasyonu | 2-3 |

---

## Kararlaştırılan Açık Sorular

1. **Teknoloji ve mimari:** UltNexus'ta kanıtlanmış desen aynen kullanılacak — **monorepo, Turborepo YOK**, `backend/` (NestJS) ve `frontend/` (Next.js 15) aynı repoda bağımsız klasörler. Coolify'da iki ayrı Application, aynı repo, farklı root directory.
2. **Kullanıcı modeli:** Site **tek kullanıcılı (admin) olarak başlar**, ancak şema en baştan çoklu kullanıcı senaryosuna hazır kurulur (bkz. "Çoklu Kullanıcı Büyüme Yolu"). Kayıt endpoint'i ilk fazlarda kapalı tutulur.
3. **İlk faz öncelikleri:** Aşağıdaki "Fazlı Yol Haritası" bölümüne bakınız.
4. **Admin paneli:** Ayrı bir `/admin` route'u ile web tabanlı panel (WYSIWYG + markdown desteği karışımı) — Git-tabanlı markdown yönetimi tercih edilmedi, çünkü ileride kullanıcı gönderimli içerik (community stories) için veritabanı tabanlı bir moderasyon akışı zaten gerekecek.
5. **Domain/hosting:** kuronexus.com ve Hetzner/Coolify kurulumu kullanıcı tarafından ayrıca doğrulanacak; UltNexus'takiyle aynı Coolify projesi altında yeni Resource'lar (`kuronexus-backend`, `kuronexus-frontend`, `kuronexus-db`) olarak eklenecek.

---

## Proposed Architecture

### Monorepo Yapısı (UltNexus Deseni — Turborepo Yok)

```
KURONEXUS/
├── .agents/
│   └── AGENTS.md
├── backend/                     # NestJS Backend (bağımsız package.json)
│   ├── src/
│   │   ├── auth/                # JWT authentication
│   │   ├── stories/              # Dark Stories CRUD (+ community submission)
│   │   ├── wiki/                 # Wiki universe/entry CRUD
│   │   ├── reviews/               # İncelemeler CRUD
│   │   ├── character-analyses/    # Karakter analizleri CRUD
│   │   ├── media/                # TMDB/Anilist proxy + cache
│   │   ├── quotes/                # Alıntı defteri
│   │   ├── tags/                  # Etiket sistemi
│   │   ├── comments/              # Yorum sistemi (moderasyonlu)
│   │   ├── favorites/             # Favori sistemi
│   │   ├── uploads/               # Görsel/dosya yükleme (kapak görselleri, harita dosyaları)
│   │   ├── search/                # Site içi arama (PostgreSQL full-text) — Faz 2+
│   │   ├── common/
│   │   │   ├── guards/            # Auth & Role guards
│   │   │   ├── filters/           # Exception filters
│   │   │   ├── interceptors/      # Logging, transform
│   │   │   └── decorators/
│   │   └── prisma/
│   └── prisma/
│       └── schema.prisma
│
├── frontend/                    # Next.js 15 Frontend (bağımsız package.json)
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx                  # Ana Sayfa (Portal)
│   │   │   ├── dark-stories/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── community-stories/        # Faz 3+ — kullanıcı gönderimleri
│   │   │   ├── wiki/
│   │   │   │   └── [universe]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── characters/
│   │   │   │       ├── locations/
│   │   │   │       └── terms/
│   │   │   ├── reviews/
│   │   │   │   ├── anime/
│   │   │   │   ├── movies/
│   │   │   │   └── characters/
│   │   │   └── admin/
│   │   └── api/                          # Route handlers (BFF katmanı, TMDB/Anilist için ince proxy)
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── stories/
│   │   ├── wiki/
│   │   └── reviews/
│   ├── lib/
│   │   ├── i18n/
│   │   ├── api/                          # Backend API client
│   │   ├── tmdb/
│   │   └── anilist/
│   ├── messages/
│   │   ├── en.json
│   │   └── tr.json
│   ├── styles/
│   │   └── globals.css
│   └── types/
│
├── docker-compose.yml
├── STATE.md
└── README.md
```

### Teknoloji Stack

| Katman | Teknoloji |
|---|---|
| Frontend Framework | Next.js 15 (App Router, React 19) |
| Backend Framework | NestJS |
| ORM | Prisma |
| Veritabanı | PostgreSQL (Hetzner/Coolify) |
| Styling | Vanilla CSS (CSS Custom Properties + modern features) |
| i18n | next-intl |
| Auth | JWT (NestJS custom) |
| Monorepo | Yok — bağımsız `backend/` + `frontend/` klasörleri (UltNexus deseni) |
| Dış API'ler | TMDB API v3, Anilist GraphQL |
| Email (Faz 2+) | Resend |
| Deployment | Docker + Hetzner/Coolify |
| Paket Yöneticisi | pnpm (her klasörde bağımsız) |

## Design System (Çoklu Dark Theme — AGENTS.md kural 16)

Site üç dark tema ile gelir; kullanıcı aralarında geçiş yapabilir. Tüm temalar aynı
token setini override eder, bileşenler yalnızca `var(--token)` okur. Glow/parlama
efekti yasaktır; tüm accent renkleri düşük doygunlukta, göz yormayan tonlardır.
Kanonik tanımlar: `frontend/styles/globals.css`

```
TEMA 1 — Mor (VARSAYILAN) [data-theme="purple"]
├── Background     : #14141a  (yumuşak antrasit — saf siyah değil)
├── Surface        : #1b1b23
├── Surface Hover  : #22222c
├── Border         : #2c2c36
├── Text Primary   : #d8d6d2  (kırık beyaz)
├── Text Secondary : #8a8990
├── Text Muted     : #5f5c72
├── Accent         : #9d97b8  (soluk mor-gri)
├── Accent Hover   : #b0aac9
├── Gold           : #b89968  (wiki kategori etiketleri)
└── Warn/Danger    : #b8564f  (toprak tonu kırmızı)

TEMA 2 — Siyah + Turuncu [data-theme="orange"]
├── Background     : #121212
├── Surface        : #1a1a1a
├── Surface Hover  : #202020
├── Border         : #2b2b2b
├── Text Primary   : #e2e0da
├── Text Secondary : #8f8f8a
├── Text Muted     : #68655f
├── Accent         : #d97a3f  (toprak turuncusu — neon değil)
├── Accent Hover   : #e28a54
├── Gold           : #d99b52
└── Warn/Danger    : #c25a3c

TEMA 3 — Lacivert + Bordo [data-theme="navy"]
├── Background     : #10141c  (koyu lacivert)
├── Surface        : #171d29
├── Surface Hover  : #1c2330
├── Border         : #26303f
├── Text Primary   : #dcdde0
├── Text Secondary : #868c99
├── Text Muted     : #5c6270
├── Accent         : #9b4a4a  (soluk bordo — cart kırmızı değil)
├── Accent Hover   : #b05858
├── Gold           : #b08a5a
└── Warn/Danger    : #a64545
```

Tema geçişi:
- Tercih cookie'de saklanır (`kuronexus-theme`), SSR'da `<html data-theme="...">`
  olarak ilk boyamadan önce uygulanır (FOUC/tema flash'ı engellenir).
- Tema geçiş bileşeni (ThemeSwitcher) Faz 1 kapsamındadır.
```

### Veritabanı Şeması (Güncellenmiş)

```prisma
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  passwordHash      String    // asla düz "password" adıyla tutulmaz
  name              String
  role              Role      @default(ADMIN)
  emailVerified     Boolean   @default(false) // Faz 2 kayıt akışı için hazır
  verificationToken String?   // email doğrulama token'ı (hash'lenmiş saklanır)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  isDeleted         Boolean   @default(false)

  stories           Story[]
  wikiEntries       WikiEntry[]
  reviews           Review[]
  characterAnalyses CharacterAnalysis[]
  quotes            Quote[]
  comments          Comment[]
  favorites         Favorite[]
}

model Story {
  id                String    @id @default(cuid())
  title             String
  slug              String    @unique
  content           String    @db.Text
  excerpt           String?
  coverImage        String?
  isPublished       Boolean   @default(false)
  publishedAt       DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  isDeleted         Boolean   @default(false)

  // Faz 3: Community Stories desteği — admin içeriğiyle asla aynı listede karışmaz
  isCommunitySubmission Boolean          @default(false)
  submissionStatus      SubmissionStatus @default(APPROVED) // admin için varsayılan APPROVED

  userId      String
  user        User        @relation(fields: [userId], references: [id])

  tags        TagOnStory[]
  comments    Comment[]
  favorites   Favorite[]

  @@index([userId])
  @@index([isPublished, isDeleted])
  @@index([submissionStatus])
}
// NOT (soft delete + unique slug): Bir kayıt soft-delete edildiğinde slug'ı
// serbest bırakmak için silme anında slug'a suffix eklenir:
// slug = `${slug}-deleted-${Date.now()}`. Bu kural tüm slug'lı modeller için geçerlidir.

model WikiUniverse {
  id          String      @id @default(cuid())
  name        String      // "Wheel of Time", "Lord of the Rings" vb.
  slug        String      @unique
  description String?     @db.Text
  coverImage  String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  isDeleted   Boolean     @default(false)

  entries     WikiEntry[]
}

model WikiEntry {
  id          String        @id @default(cuid())
  title       String
  slug        String
  content     String        @db.Text
  category    WikiCategory  // CHARACTER, LOCATION, TERM, EVENT, ITEM, ORGANIZATION, MAGIC_SYSTEM
  coverImage  String?
  metadata    Json?         // Esnek ek veri (doğum tarihi, güç seviyesi vb.)
  spoilerTier Int?          // Örn. hangi kitaba kadar spoiler-safe (null = spoiler yok)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  isDeleted   Boolean       @default(false)

  universeId  String
  universe    WikiUniverse  @relation(fields: [universeId], references: [id])
  userId      String
  user        User          @relation(fields: [userId], references: [id])

  tags               TagOnWikiEntry[]
  comments           Comment[]
  favorites          Favorite[]
  characterAnalyses  CharacterAnalysis[] // Faz 4: kitap karakterine dair derin analiz de mümkün

  // Çapraz linkleme (AGENTS.md kural 5): karakter → terim → şehir ilişkileri
  outgoingRelations  WikiEntryRelation[] @relation("outgoing")
  incomingRelations  WikiEntryRelation[] @relation("incoming")

  @@unique([universeId, slug])
  @@index([userId])
  @@index([universeId, category, isDeleted])
}

// Wiki sayfaları arası ilişkiler veri modelinde tutulur — düz metin linki DEĞİL.
// Örn. "Rand al'Thor" (CHARACTER) → "Tel'aran'rhiod" (TERM), relationType: "RELATED_TERM"
model WikiEntryRelation {
  fromId       String
  from         WikiEntry @relation("outgoing", fields: [fromId], references: [id])
  toId         String
  to           WikiEntry @relation("incoming", fields: [toId], references: [id])
  relationType String?   // opsiyonel etiket: "ALLY", "LOCATION_OF", "RELATED_TERM" vb.
  createdAt    DateTime  @default(now())

  @@id([fromId, toId])
  @@index([toId])
}

model Review {
  id           String      @id @default(cuid())
  title        String
  slug         String      @unique
  content      String      @db.Text
  rating       Float?      // Kişisel puan — TMDB/Anilist puanından bağımsız
  mediaType    MediaType   // ANIME, MOVIE, TV_SERIES, BOOK, MANGA, GAME
  externalId   String?     // TMDB ID veya Anilist ID
  externalData Json?       // Cache'lenmiş TMDB/Anilist verisi (poster, özet vb.)
  externalDataFetchedAt DateTime? // Cache tazeliği — TTL bazlı yenileme için (örn. 7 gün)
  coverImage   String?
  isPublished  Boolean     @default(false)
  publishedAt  DateTime?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  isDeleted    Boolean     @default(false)

  userId       String
  user         User        @relation(fields: [userId], references: [id])

  tags               TagOnReview[]
  comments           Comment[]
  favorites          Favorite[]
  characterAnalyses  CharacterAnalysis[]

  @@index([userId])
  @@index([mediaType, isPublished, isDeleted])
}

// Karakter analizi, Review (anime/film) veya WikiEntry (kitap karakteri) üzerinden
// tetiklenebilir — ikisi de opsiyonel, hangi kaynaktan geldiği karışmaz.
model CharacterAnalysis {
  id          String      @id @default(cuid())
  name        String      // "Zaraki Kenpachi"
  slug        String      @unique
  content     String      @db.Text
  series      String      // "Bleach"
  coverImage  String?
  isPublished Boolean     @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  isDeleted   Boolean     @default(false)

  reviewId    String?
  review      Review?     @relation(fields: [reviewId], references: [id])
  wikiEntryId String?
  wikiEntry   WikiEntry?  @relation(fields: [wikiEntryId], references: [id])

  userId      String
  user        User        @relation(fields: [userId], references: [id])

  tags        TagOnCharacterAnalysis[]

  @@index([userId])
  @@index([reviewId])
  @@index([wikiEntryId])
}

model Quote {
  id          String    @id @default(cuid())
  text        String    @db.Text
  source      String    // Kitap/anime/film adı
  character   String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  isDeleted   Boolean   @default(false)

  userId      String
  user        User      @relation(fields: [userId], references: [id])

  tags        TagOnQuote[]

  @@index([userId])
}

// --- Dosya/Görsel Yükleme (Faz 1) ---
// Kapak görselleri, wiki harita dosyaları, mood board görselleri buradan yönetilir.
// Dosyalar Coolify persistent volume'e yazılır (/app/uploads), DB yalnızca metadata tutar.
model MediaAsset {
  id          String    @id @default(cuid())
  filename    String    // sunucudaki benzersiz dosya adı
  originalName String   // kullanıcının yüklediği ad
  mimeType    String
  sizeBytes   Int
  altText     String?   // erişilebilirlik + SEO
  createdAt   DateTime  @default(now())
  isDeleted   Boolean   @default(false)

  userId      String

  @@index([userId])
}

// --- Etiket Sistemi (ilişkisel, String[] DEĞİL) ---
model Tag {
  id    String @id @default(cuid())
  name  String @unique
  slug  String @unique

  stories            TagOnStory[]
  wikiEntries        TagOnWikiEntry[]
  reviews            TagOnReview[]
  characterAnalyses  TagOnCharacterAnalysis[]
  quotes             TagOnQuote[]
}

model TagOnStory {
  tagId   String
  tag     Tag    @relation(fields: [tagId], references: [id])
  storyId String
  story   Story  @relation(fields: [storyId], references: [id])
  @@id([tagId, storyId])
}

model TagOnWikiEntry {
  tagId       String
  tag         Tag       @relation(fields: [tagId], references: [id])
  wikiEntryId String
  wikiEntry   WikiEntry @relation(fields: [wikiEntryId], references: [id])
  @@id([tagId, wikiEntryId])
}

model TagOnReview {
  tagId    String
  tag      Tag     @relation(fields: [tagId], references: [id])
  reviewId String
  review   Review  @relation(fields: [reviewId], references: [id])
  @@id([tagId, reviewId])
}

model TagOnCharacterAnalysis {
  tagId               String
  tag                 Tag                @relation(fields: [tagId], references: [id])
  characterAnalysisId String
  characterAnalysis   CharacterAnalysis  @relation(fields: [characterAnalysisId], references: [id])
  @@id([tagId, characterAnalysisId])
}

model TagOnQuote {
  tagId   String
  tag     Tag    @relation(fields: [tagId], references: [id])
  quoteId String
  quote   Quote  @relation(fields: [quoteId], references: [id])
  @@id([tagId, quoteId])
}

// --- Faz 2+: Kullanıcı Etkileşimi ---
model Comment {
  id          String    @id @default(cuid())
  content     String    @db.Text
  isApproved  Boolean   @default(false) // moderasyon zorunlu
  isFlagged   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  isDeleted   Boolean   @default(false)

  userId      String
  user        User      @relation(fields: [userId], references: [id])

  storyId     String?
  story       Story?     @relation(fields: [storyId], references: [id])
  reviewId    String?
  review      Review?    @relation(fields: [reviewId], references: [id])
  wikiEntryId String?
  wikiEntry   WikiEntry? @relation(fields: [wikiEntryId], references: [id])

  @@index([userId])
  @@index([isApproved, isDeleted])
}

model Favorite {
  id          String    @id @default(cuid())
  createdAt   DateTime  @default(now())

  userId      String
  user        User      @relation(fields: [userId], references: [id])

  storyId     String?
  story       Story?     @relation(fields: [storyId], references: [id])
  reviewId    String?
  review      Review?    @relation(fields: [reviewId], references: [id])
  wikiEntryId String?
  wikiEntry   WikiEntry? @relation(fields: [wikiEntryId], references: [id])

  // Aynı kullanıcı aynı içeriği yalnızca bir kez favorileyebilir
  @@unique([userId, storyId])
  @@unique([userId, reviewId])
  @@unique([userId, wikiEntryId])
}

enum Role {
  ADMIN
  EDITOR
  VIEWER
}

enum WikiCategory {
  CHARACTER
  LOCATION
  TERM
  EVENT
  ITEM
  ORGANIZATION
  MAGIC_SYSTEM
}

enum MediaType {
  ANIME
  MOVIE
  TV_SERIES
  BOOK
  MANGA
  GAME
}

enum SubmissionStatus {
  PENDING
  APPROVED
  REJECTED
}
```

---

## Fazlı Yol Haritası

| Faz | Kapsam |
|---|---|
| **1** | Monorepo iskeleti (backend/frontend), auth (yalnızca admin seed) + **rate limiting (`@nestjs/throttler`)**, i18n, dark theme temel bileşenleri, Dark Stories modülü, **dosya/görsel yükleme modülü (MediaAsset + Coolify persistent volume)**, Tag şeması (boş da olsa kurulu), **yedekleme kurulumu (Hetzner Backups + Coolify pg_dump → sunucu dışı S3 hedef)** |
| **2** | Zaman Çarkı Wiki (WikiUniverse/WikiEntry, spoiler tier, `WikiEntryRelation` ile çapraz linkleme), **site içi arama (PostgreSQL full-text, önce wiki kapsamında)**, kayıt (`/register`) email doğrulamalı açılır, Comment + Favorite modülleri |
| **3** | Anime/Film Arşivi (TMDB/Anilist proxy + cache + TTL yenileme), Karakter Analizleri, Community Stories (moderasyon akışıyla), "Portal" navigasyon tasarımı |
| **4** | Ambiyans sistemi (yalnızca CC lisanslı / telifi temiz sesler), mood board, alıntı defteri, istatistik panosu, interaktif haritalar, okuma/izleme günlüğü, tag cloud UI, aramanın tüm içerik tiplerine genişletilmesi |

### Faz 1 "Bitti" Kriterleri
- Admin seed hesabıyla giriş yapılabiliyor, `/register` kapalı
- Admin panelinden hikaye CRUD + kapak görseli yükleme çalışıyor
- Login endpoint'i rate-limit'li (örn. 5 deneme/dk)
- Günlük otomatik `pg_dump` sunucu dışı hedefe gidiyor ve **bir kez geri yükleme testi yapıldı**
- TR/EN dil geçişi çalışıyor, hardcoded metin yok
- Tüm sayfalar mobilde taşmasız görüntüleniyor

---

## Verification Plan

### Automated Tests
```bash
# Backend
cd backend && pnpm lint && pnpm test && pnpm build
cd backend && pnpm prisma validate

# Frontend
cd frontend && pnpm lint && pnpm type-check && pnpm build
```

### Manual Verification
- Tüm sayfaların mobile responsive olduğunu Chrome DevTools ile doğrulama
- Dark theme'in tutarlı olduğunu görsel kontrol
- i18n'in TR/EN arasında sorunsuz geçiş yaptığını test
- TMDB/Anilist API çağrılarının cache'lendiğini ve hata durumunda sayfanın çökmediğini doğrulama
- Admin panelinden içerik CRUD işlemlerini test
- (Faz 2+) Kayıt/giriş akışının ve email doğrulamanın çalıştığını test
- (Faz 3+) Community story gönderiminin moderasyon onayı olmadan yayınlanmadığını doğrulama
- Görsel yükleme akışının çalıştığını ve dosyaların container yeniden başlatıldığında kaybolmadığını (persistent volume) doğrulama
- Veritabanı yedeğinin sunucu dışı hedefe düştüğünü ve bir dump'ın test ortamına geri yüklenebildiğini doğrulama
- Login endpoint'inde rate limit'in devrede olduğunu test (art arda hatalı denemelerde 429 dönmeli)
