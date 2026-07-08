# KuroNexus — Proje Durumu (STATE.md)

> Bu dosya AGENTS.md kural 9 gereği her önemli aşamada güncellenir.
> Yeni bir oturuma başlayan ajan İLK İŞ olarak bu dosyayı okur.

## Mevcut Aşama
**Faz 1 — SİTE CANLIDA (2026-07-08): https://kuronexus.com + https://api.kuronexus.com. DB public erişimi kapalı, günlük yedekleme kurulu. Kalan küçük işler: geri yükleme testi, mobil taşma kontrolü, canlıda admin login/upload denemesi.**

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

## Sıradaki Adım (Faz 1 kapanışı)
1. Faz 1 "Bitti" kriterlerinden kalanlar: yedekten geri yükleme testi, mobil taşma kontrolü, canlıda admin login + kapak görseli upload denemesi (uploads volume doğrulaması)
2. Lokal geliştirme için DB: canlı DB'ye public erişim kapatıldı — lokalde çalışmak için Docker Desktop kurup `docker-compose.yml` ile lokal postgres kullanılacak (kökteki compose hazır), `backend/.env` lokal URL'e güncellenecek

## Açık Kararlar / Notlar
- CX23 (4 GB RAM) iki projeyi birden taşıyacak — build sırasında bellek sıkışırsa CX33'e rescale edilecek
- Kayıt (`/register`) Faz 2'ye kadar kapalı; tek kullanıcı = admin (seed ile)
- İlk wiki evreni: Zaman Çarkı (Wheel of Time)
- İlk karakter analizi hedefi: Zaraki Kenpachi (Bleach)
- Tasarım prensibi: glow/parlama efekti yok, düşük doygunluklu accent renkler, saf siyah zemin yok (göz yormayan dark theme)

## Ortam Bilgileri
- **GitHub reposu:** `https://github.com/ultnexusdev/KuroNexus.git` (`main` branch push edildi, origin remote ayarlı)
- Sunucu: Hetzner CX23, Helsinki (eu-central), IP `65.108.220.5`
- Deploy: Coolify — aynı repo, iki Application, root dirs `/backend` ve `/frontend`
- Veritabanı: PostgreSQL (Coolify resource, `Kuronexus > production` projesi altında) — **public erişim KAPALI (2026-07-08)**, backend internal URL ile bağlanıyor. `backend/.env`'deki eski 5433'lü URL artık çalışmaz (lokal dev için Docker Desktop + lokal postgres planı yukarıda)
- Domain: kuronexus.com (DNS/SSL yapılandırması Faz 1 deploy adımında doğrulanacak)
