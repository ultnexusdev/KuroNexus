# 🤖 AI Agent Rules & Architecture Constraints — kuronexus.com

> [!IMPORTANT]
> YOU MUST STRICTLY ADHERE TO THESE RULES FOR EVERY CODE GENERATION, REFACTORING, OR MODIFICATION TASK. DO NOT VIOLATE THE ARCHITECTURAL BOUNDARIES DEFINED BELOW.

## 1. 🌐 Localization & Language Rule (CRITICAL)
- **Zero Hardcoded Text:** Forbidden to hardcode any user-facing strings, labels, logs, button texts, or email templates in Turkish or any language other than English in the source code.
- **Default Language:** The default and native language of this entire codebase is strictly **English**.
- **i18n Readiness:** All user-facing components must use a translation wrapper (e.g., `{t("key")}`). Dynamic feedback or validation errors must return a translation key (e.g., `VALIDATION.INVALID_EMAIL`) rather than raw text.
- **Türkçe Karakter Hassasiyeti:** Çeviri dosyalarında ve görünür arayüz metinlerinde Türkçe karakterler (ı, ş, ğ, ç, ö, ü) eksiksiz ve doğru kullanılmalıdır.

## 2. 📱 Mobile-First & Responsiveness
- **Mobile-First Responsiveness:** Every UI component must be fully responsive and visually optimized for mobile viewports first. Menüler, butonlar ve formlar mobil ekranlarda taşmadan çalışmalıdır.
- **Mobil Akordiyon Kart Deseni:** Geniş veri tabloları (wiki listeleri, inceleme arşivleri) mobilde (`lg:hidden` ile) dikey akordiyon kart listelerine dönüştürülmelidir.
- **Dokunma Boyutları (Touch Targets):** Mobil butonlar, kart başlıkları ve aksiyon alanları en az 44px olmalı, parmakla kolay basılabilir spacing/padding değerlerine sahip olmalıdır.
- **Spoiler UI Davranışı:** Wiki/inceleme sayfalarındaki spoiler bloklarının mobilde de dokunarak açılabilir (tap-to-reveal) olması, yanlışlıkla açılmaması gerekir.

## 3. 🗄️ Veritabanı ve Kimlik Doğrulama
- Veritabanı işlemleri Prisma ORM üzerinden, Hetzner/Coolify üzerindeki PostgreSQL sunucusu kullanılarak yapılmalıdır. Supabase kullanılmayacaktır.
- Kimlik doğrulama işlemleri (JWT vb.) kendi backend'imiz (NestJS) üzerinden yönetilmelidir.
- **Yumuşak Silme (Soft Delete):** Hikaye, wiki sayfası veya inceleme kayıtları fiziksel olarak silinmemelidir. Yerine `isDeleted: true` bayrağı eklenmeli ve tüm Prisma `findMany` sorgularında bu kayıtlar filtrelenmelidir.
- **Zaman Damgaları:** Her veride `createdAt` ve `updatedAt` alanları standart olarak tutulmalı ve güncellenmelidir.

## 4. 🎬 Harici API Entegrasyonu (TMDB / AniList)
- TMDB ve AniList'ten çekilen veriler (poster, özet, oyuncu/karakter listesi) **cache'lenmelidir** — her sayfa yüklemesinde dış API'ye istek atılmamalı, veritabanında veya bir cache katmanında tutulmalıdır.
- Harici API'den çekilen veri ile sitede yazılan özel içerik (inceleme, karakter analizi, kişisel puan) **ayrı modellerde** tutulmalı; dış veri güncellenirse (ör. TMDB açıklaması değişirse) kendi yazdığın içerik etkilenmemelidir.
- API anahtarları (`TMDB_API_KEY` vb.) yalnızca backend `.env` içinde tutulmalı, frontend'e asla expose edilmemelidir.
- Dış API isteği başarısız olursa (rate limit, timeout vb.) sayfa çökmemeli, en azından kendi yazdığın içerik (inceleme, analiz) gösterilmeye devam etmelidir.

## 5. 📖 İçerik Modeli Kuralları (Wiki / Hikaye / İnceleme)
- **Spoiler Seviyesi:** Kitap wikisi sayfalarında (ör. Zaman Çarkı) içerik parçaları bir "spoiler seviyesi" alanına (ör. hangi kitaba kadar güvenli) sahip olmalı ve kullanıcı seçimine göre gösterilip gizlenmelidir.
- **Çapraz Linkleme:** Karakter, terim ve şehir sayfaları birbirine referans verebilmeli (ör. bir karakter sayfasından ilgili terim sayfasına link) — bu ilişkiler veri modelinde tutulmalı, düz metin linki olarak hardcode edilmemelidir.
- **Kişisel Puanlama:** İncelemelerdeki kişisel puan alanı (ör. 1-10) harici kaynağın (TMDB/AniList) puanından ayrı bir alan olarak tutulmalı, ikisi karıştırılmamalıdır.

## 6. 🔒 Security Checklist
- Tüm input endpoint'leri XSS ve SQL injection'a karşı sıkı sanitizasyon uygulamalıdır.
- NestJS'te `class-validator` ve DTO kullanılarak doğrulanmamış payload alanları düşürülmelidir.
- Şifreler güvenli hashing pipeline'ları (`bcrypt`) ile işlenmeli, asla expose edilmemeli veya loglanmamalıdır.
- **Kullanıcı Veri İzolasyonu:** Her kayıt (hikaye, wiki düzenlemesi, inceleme taslağı vb.) ait olduğu kullanıcının ID'sini (`userId`) barındırmalıdır. Başkalarının verisine erişim backend (NestJS) kontrolleri ve Prisma sorgu filtreleri ile engellenmelidir.
- **Rol ve İzin Yönetimi:** Kullanıcı rolleri (Standart Üye, Admin vb.) veritabanından doğrulanmalı, kullanıcıların kendi rollerini yetkisiz değiştirmesi backend Guard'ları ile engellenmelidir.
- **Hata Yakalama:** Tüm veritabanı/API işlemleri try-catch ile sarılmalı, hatalar konsola raporlanırken kullanıcıya anlaşılır, temiz mesajlar gösterilmelidir.

## 7. 🛠️ TypeScript ve Kod Kalitesi
- **Sıfır Implicit "any" Politikası:** Hiçbir değişken/parametre örtülü `any` bırakılmamalıdır.
- **Şema Senkronizasyonu:** `schema.prisma` içindeki her değişiklik, UI tarafında kullanılan interface/type tanımlarıyla senkronize edilmelidir.

## 8. 🤖 Ajan Davranış ve Değişiklik Kuralları
- **Önce Anla, Sonra Değiştir:** Dosyalarda değişiklik yapmadan önce mevcut yapıyı oku, gereksiz kod eklemekten kaçın.
- **Kapsam Sınırlarına Sadık Kal:** İstenmeyen hiçbir ek özelliği veya şemayı projeye dahil etme. Görsel zenginlik (motion, mikro-etkileşim, glow, kompozisyon çeşitliliği) bu kısıtlamanın kapsamı dışındadır — bir sayfa/bölüm için tasarım skilleri (taste-skill, soft-skill vb.) çağrıldığında veya "zengin/sinematik tasarım" talep edildiğinde bu, görevin doğal bir parçasıdır, kapsam dışı ek özellik sayılmaz.
- **Kısa, Odaklı Cevaplar [KRİTİK]:** Her işlemden sonra geçmiş turların özetlerini birleştirerek devasa raporlar sunma. Sadece son isteğe doğrudan, net ve sade cevap ver.
- **Türkçe İletişim [KRİTİK]:** Açıklamalarında ve iletişiminde kesinlikle Türkçe kullan. Kod içi değişkenler İngilizce kalabilir.

## 9. 📝 Oturum Özeti (Session State) Kuralı
- **Durum Takibi:** Ajan, projenin hangi aşamada olduğunu unutmamak için kök dizindeki `STATE.md` dosyasını güncel tutmakla yükümlüdür.
- **Okuma:** Yeni bir sohbete/oturuma başlandığında ilk iş olarak `STATE.md` dosyası okunmalı ve bağlam kurulmalıdır.
- **Güncelleme:** Önemli bir aşama geçildiğinde veya oturum sonlandırılırken, tamamlanan işlemler ve bir sonraki adım `STATE.md` içerisine kaydedilmelidir.

## 10. 🏗️ Monorepo Yapısı (UltNexus Deseni)
- Proje, `ultnexus.com` projesinde kanıtlanmış basit monorepo desenini takip eder: **Turborepo/pnpm-workspaces YOKTUR.** Tek repo içinde iki bağımsız klasör:
  ```
  KURONEXUS/
  ├── .agents/AGENTS.md
  ├── backend/     # NestJS + Prisma (bağımsız package.json)
  ├── frontend/    # Next.js 15 App Router (bağımsız package.json)
  ├── docker-compose.yml
  └── STATE.md
  ```
- Coolify tarafında iki ayrı "Application" (`kuronexus-backend`, `kuronexus-frontend`) aynı repoya, farklı root directory (`/backend`, `/frontend`) ile bağlanır. Ayrı bir `packages/shared` paketi zorunlu değildir; gerekirse basit tip kopyalama ile ilerlenir.
- Bu kararı değiştirmeden önce (ör. Turborepo'ya geçiş) kullanıcıya danışılmalıdır — mevcut haliyle bilinçli bir sadelik tercihidir.

## 11. 🏷️ Etiket (Tag) Sistemi
- Etiketler asla düz `String[]` alanı olarak modellenmez. Cross-content tag cloud ve keşif özelliklerinin çalışabilmesi için ayrı ilişkisel bir `Tag` modeli ve içerik tiplerine bağlı join tabloları kullanılmalıdır.
- Yeni bir içerik tipi eklenirken (Story, WikiEntry, Review, CharacterAnalysis, Quote) o tipin etiketlerle ilişkisi join tablosu üzerinden kurulmalı, doğrudan array alanı eklenmemelidir.

## 12. 🧑‍🤝‍🧑 Çoklu Kullanıcı Büyüme Yolu (Kritik — Erken Karar Bozmayın)
- Site **tek kullanıcılı (yalnızca admin) olarak başlar** ancak şema en baştan çoklu kullanıcıya hazır kurulur: her içerik `userId` taşır, `Role` enum'u (ADMIN/EDITOR/VIEWER) mevcuttur.
- Kayıt (`/register`) endpoint'i ilk fazlarda **kapalı** tutulur; yalnızca admin hesabı seed ile oluşturulur.
- İleride açılacak kullanıcı etkileşimleri şu sıraya ve prensiplere göre eklenir:
  1. **Comment** — her içerik tipine (Story, Review, WikiEntry) nullable foreign key ile bağlanır; mutlaka bir moderasyon alanı (`isApproved`/`isFlagged`) taşır.
  2. **Favorite** — içerikle kullanıcı arasında basit ilişki, moderasyon gerektirmez.
  3. **Kullanıcı hikaye gönderimi (Community Stories)** — asla admin'in "Dark Stories" içeriğiyle aynı listede/aynı modelde karışmaz. Ayrı bir gönderim durumu (`submissionStatus: PENDING/APPROVED/REJECTED`) zorunludur; onay olmadan yayına alınamaz.
- Bu üç adımın hiçbiri mevcut çekirdek şemayı (Story/WikiEntry/Review modelleri) bozacak şekilde uygulanmaz; yalnızca üstüne eklenir (additive).

## 13. 🗡️ Karakter Modeli Netliği
- `WikiEntry` (category: CHARACTER) ve `CharacterAnalysis` birbirinin yerine geçmez ama birbirine bağlanabilir: `WikiEntry` bir fandom evrenindeki karakterin lore/ansiklopedik bilgisidir; `CharacterAnalysis` o karaktere dair kişisel, derinlemesine yazılmış inceleme metnidir.
- `CharacterAnalysis` hem bir `Review`'a (anime/film incelemesi altındaki karakter) hem opsiyonel olarak bir `WikiEntry`'e (kitap evrenindeki karakter) referans verebilmelidir — ikisi de nullable foreign key olarak tutulur, hangi içerik tipinden geldiği karışmaz.
- Wiki sayfaları arası çapraz linkler `WikiEntryRelation` join tablosu üzerinden kurulur; içerik metnine gömülü düz link ilişkinin kaynağı olamaz.

## 14. 🗃️ Veri Bütünlüğü ve Performans
- **Index Zorunluluğu:** Prisma, PostgreSQL'de foreign key'lere otomatik index koymaz. Listeleme/filtreleme sorgularında kullanılan her alan (`userId`, `universeId`, `isPublished + isDeleted` kombinasyonları vb.) `@@index` ile işaretlenmelidir.
- **Soft Delete + Unique Slug:** Slug'lı bir kayıt soft-delete edilirken slug'a `-deleted-{timestamp}` suffix'i eklenir; böylece aynı slug yeni içerikte tekrar kullanılabilir. Bu davranış silme servis katmanında merkezi olarak uygulanır.
- **Favorite Tekrar Koruması:** Kullanıcı-içerik favori ilişkileri `@@unique([userId, contentId])` kısıtlarıyla korunur.
- **Cache Tazeliği:** Dış API cache'i (`externalData`) her zaman `externalDataFetchedAt` ile birlikte yazılır; TTL (varsayılan 7 gün) dolduğunda arka planda yenilenir, kullanıcıya asla bayat veri yüzünden hata gösterilmez.

## 15. 📤 Dosya Yükleme, Yedekleme ve Operasyon
- **Görsel Yükleme:** Kapak görselleri ve harita dosyaları backend `uploads` modülü üzerinden Coolify persistent volume'e (`/app/uploads`) yazılır; veritabanında yalnızca `MediaAsset` metadata'sı tutulur. Dosya tipi (yalnızca görsel mime tipleri) ve boyut (örn. max 10MB) backend'de doğrulanır.
- **Yedekleme:** Hetzner sunucu backup'ları tek başına yeterli DEĞİLDİR. Coolify zamanlanmış `pg_dump` yedekleri sunucu dışı bir S3 hedefe (Hetzner Storage Box / Cloudflare R2) gönderilmelidir. Yedekleme yapılandırmasını bozan hiçbir değişiklik yapılamaz.
- **Rate Limiting:** `/login` başta olmak üzere auth endpoint'leri `@nestjs/throttler` ile korunur. Bu koruma hiçbir refactor sırasında kaldırılamaz.
- **Site İçi Arama:** Arama PostgreSQL full-text (`tsvector`) ile çözülür; ayrı bir arama servisi (Meilisearch, Elasticsearch vb.) kullanıcıya danışılmadan eklenemez.

## 16. 🎨 Tema Sistemi (Çoklu Dark Theme)
- Site üç dark tema ile gelir: **Mor** (varsayılan, `data-theme="purple"`), **Siyah + Turuncu** (`data-theme="orange"`), **Lacivert + Bordo** (`data-theme="navy"`). Kullanıcı bu üçü arasında geçiş yapabilir.
- Temalar CSS custom properties ile `<html>` etiketindeki `[data-theme]` attribute'u üzerinden tanımlanır. Bileşenler **asla** doğrudan hex değeri kullanmaz; yalnızca token değişkenlerini (`var(--accent)`, `var(--surface)` vb.) okur.
- Tüm temalar **aynı token setini** (birebir aynı değişken isimleri) override eder; layout ve bileşen kodu tema değişiminden etkilenmez, yalnızca değişken değerleri değişir.
- Accent renkleri temanın kimliğine uygun olmalı; düşük doygunluk zorunlu değildir — bölüme özgü canlılık (Anime Salonu, Akatsuki gibi atmosferik sayfalar) teşvik edilir.
- Glow/parlama (box-shadow ışıması) efekti varsayılan olarak kısıtlı değildir; token sistemine bağlı, ölçülü ve performansı gözeten şekilde kullanılabilir. Sayfa/bölüm bazında "sinematik" yoğunluk artırılabilir, ancak layout ve bileşen kodu yine token değişkenlerinden bağımsız olmamalıdır.
- Kullanıcının tema tercihi kalıcı saklanır (cookie tercih edilir) ve SSR'da yanlış tema flash'ı olmaması için `<html>` etiketine ilk boyamadan önce uygulanır.
- Yeni tema eklemek isteyen ajan mevcut token setini eksiksiz doldurmalıdır; eksik token bırakılamaz.
- Kanonik token tanımları `frontend/styles/globals.css` dosyasındadır; renk kararı değişiklikleri yalnızca bu dosyada yapılır.

