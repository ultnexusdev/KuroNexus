# KuroNexus — Proje Durumu (STATE.md)

> Bu dosya AGENTS.md kural 9 gereği her önemli aşamada güncellenir.
> Yeni bir oturuma başlayan ajan İLK İŞ olarak bu dosyayı okur.

## Mevcut Aşama
**Faz 1 — Dark Stories + admin paneli + uploads tamamlandı ve uçtan uca test edildi. Sıradaki adım: git push + Coolify deploy + yedekleme.**

## ▶️ YARIN BURADAN DEVAM (2026-07-07 sonu, oturum kapandı)
Kod tarafında Faz 1'in tüm modülleri bitti ve test edildi. Kalan tek şey **deploy** (aşağıdaki "Sıradaki Adım"). İlk yapılacaklar:
1. **Git henüz başlatılmadı** — `git init` yapılmadı, hiç commit yok. Kök dizinde bir `.gitignore` var (`.env`), `backend/.gitignore` ve `frontend/.gitignore` de mevcut. Yarın: kök dizinde `git init`, `.env` dosyalarının (kök `.env`, `backend/.env`, `frontend/.env.local`) commit'lenmediğini doğrula (gizli anahtarlar içeriyor!), ilk commit, sonra remote'a push.
2. **GitHub reposu hazır:** `https://github.com/ultnexusdev/KuroNexus.git` — proje bu repoda tutulacak. Henüz remote eklenmedi/push yapılmadı.
3. Ardından Coolify'da iki Application oluştur (deploy adımına bak).
⚠️ Push öncesi KONTROL: `.env` dosyaları asla push edilmemeli — içlerinde `DATABASE_URL` (canlı DB şifresi), `JWT_SECRET`, `ADMIN_PASSWORD` var.

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

## Sıradaki Adım (Faz 1 devamı)
0. **Git init + ilk commit + push** → `https://github.com/ultnexusdev/KuroNexus.git` (`.env`'leri hariç tut — yukarıdaki uyarı)
1. Coolify'a deploy: `kuronexus-backend`, `kuronexus-frontend` + pg_dump yedekleme yapılandırması (`kuronexus-db` zaten oluşturuldu); backend `UPLOAD_DIR` için persistent volume (`/app/uploads`); deploy sonrası db public erişimini kapatıp internal URL'e geçiş. Env değişkenleri (`DATABASE_URL` internal, `JWT_SECRET`, `ADMIN_*`, `CORS_ORIGIN`, `NEXT_PUBLIC_API_URL`) Coolify panelinden girilecek
2. Faz 1 "Bitti" kriterleri kontrolü: geri yükleme testi, mobil taşma kontrolü, rate limit prod doğrulaması

## Açık Kararlar / Notlar
- CX23 (4 GB RAM) iki projeyi birden taşıyacak — build sırasında bellek sıkışırsa CX33'e rescale edilecek
- Kayıt (`/register`) Faz 2'ye kadar kapalı; tek kullanıcı = admin (seed ile)
- İlk wiki evreni: Zaman Çarkı (Wheel of Time)
- İlk karakter analizi hedefi: Zaraki Kenpachi (Bleach)
- Tasarım prensibi: glow/parlama efekti yok, düşük doygunluklu accent renkler, saf siyah zemin yok (göz yormayan dark theme)

## Ortam Bilgileri
- **GitHub reposu:** `https://github.com/ultnexusdev/KuroNexus.git` (proje bu başlık altında tutulacak; henüz push yapılmadı)
- Sunucu: Hetzner CX23, Helsinki (eu-central), IP `65.108.220.5`
- Deploy: Coolify — aynı repo, iki Application, root dirs `/backend` ve `/frontend`
- Veritabanı: PostgreSQL (Coolify resource, `Kuronexus > production` projesi altında), public port `5433` (bağlantı bilgisi `backend/.env`'de) — **not:** bu public erişim geçici bir geliştirme kolaylığı, backend/frontend Coolify'a deploy edilince internal URL'e geçilip public erişim kapatılmalı (kural 6 güvenlik)
- Domain: kuronexus.com (DNS/SSL yapılandırması Faz 1 deploy adımında doğrulanacak)
