import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001");

/**
 * İçerik Güvenlik Politikası (CSP) — **ZORUNLU** (2026-08-04 akşamı).
 *
 * Diğer başlıklardan farklı çalışır: onlar "şunu yapma" derken CSP
 * "YALNIZCA şunlara izin var" der — yani beyaz liste. Listeye yazmayı
 * unuttuğun her kaynak engellenir. Bu yüzden önce `-Report-Only` ekiyle
 * yayına alındı: tarayıcı kuralları bilir ama hiçbir şeyi engellemez,
 * yalnızca ihlalleri raporlar. Gerçek trafikle, kimseyi kırmadan ölçüm.
 *
 * Liste tahminle değil ÖLÇÜMLE kuruldu (2026-08-04):
 *   image.tmdb.org           → film/dizi afişleri
 *   i.ytimg.com              → YouTube küçük görselleri
 *   www.youtube-nocookie.com → fragman gömüleri (iframe)
 *   apiUrl.origin            → kitap kapakları, /uploads/*, ambient ses
 *   www.w3.org               → SVG isim uzayı, AĞ YÜKLEMESİ DEĞİL, listede yok
 *
 * Report-Only turunun sonucu (2026-08-04 akşamı) — ölçüm yöntemi: her sayfada
 * `performance.getEntriesByType('resource')` ile GERÇEKTEN yüklenen kaynaklar
 * listelenip beyaz listeyle karşılaştırıldı. Konsol ihlal mesajları adresleri
 * `<URL>` diye gizlediği için tek başına yetmiyor. Genel sayfalar + 10 admin
 * sayfası tarandı; **üç eksik** bulundu ve eklendi:
 *
 *   s4.anilist.co        → anime kapak/banner görselleri (172 ihlal)
 *   fonts.googleapis.com → globals.css 1. satırdaki @import (stil dosyası)
 *   fonts.gstatic.com    → o @import'un çektiği font dosyaları (29 ihlal)
 *
 * ✅ FONT GİRDİLERİ KALDIRILDI (2026-08-05). O üç font (Cormorant Garamond,
 * Corinthia, Noto Sans Old Turkic) `next/font/google`'a taşındı ve artık
 * self-host ediliyor; `globals.css` 1. satırdaki `@import` silindi. Projede
 * artık **tek** font yöntemi var — eskiden ikisi vardı ve buradaki "fontlar
 * self-host" notu yalnızca `layout.tsx`teki dördü için doğruydu.
 *
 * Kaldırmadan önce ölçüldü (tahmin edilmedi): canlı sitede 4 rota
 * (`/`, `/dark-stories`, `/dark-stories/category/kitap`, `/en`) ve her birinin
 * yüklediği CSS paketleri indirilip tarandı → `fonts.googleapis.com` ve
 * `fonts.gstatic.com` için **0 referans**. Kazanç: ziyaretçi IP'si artık
 * Google'a gitmiyor, render engelleyen bir dış istek turu eksildi.
 *
 * ⚠️ BİLİNEN ZAYIFLIK — `script-src 'unsafe-inline'`
 * Next.js App Router, hidrasyon için satır içi script üretiyor. Bunları
 * nonce ile imzalamak mümkün (middleware üzerinden) ama nonce yanlış
 * yayılırsa sitedeki BÜTÜN scriptler ölür. Kademeli gidiyoruz:
 *   şimdi → 'unsafe-inline' ile kaynak listesini doğrula
 *   sonra → script-src'yi nonce tabanlı hale getir (ayrı adım)
 *
 * 'unsafe-inline' ile bile kazanç var: dış script enjeksiyonu
 * (`<script src="https://kotu.site/x.js">`), `eval`, `<object>` gömüleri,
 * `<base>` ele geçirme ve form yönlendirme saldırıları engelleniyor.
 * Engellenmeyen tek şey satır içi script enjeksiyonu — o, nonce adımında.
 */
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  /**
   * Next.js hidrasyon scriptleri satır içi; 'unsafe-eval' BİLEREK yok.
   *
   * ⚠️ `open.spotify.com` 12 Ağustos 2026'da eklendi ve **kullanıcıya
   * sorularak** eklendi. Sebebi tek bir dosya: `components/player/
   * MusicPlayerBar.tsx`. Gömülü çalar başka bir origin'de bir iframe, yani
   * parçanın bittiğini göremiyoruz; Spotify'ın `embed/iframe-api` betiği bunu
   * bildiren tek resmî yol ve o olmadan çalma listesi kendiliğinden
   * ilerleyemiyor (her parçada elle "ileri" gerekirdi).
   *
   * ⚠️ SPOTIFY BURADA YOK VE OLMAYACAK. 12 Ağustos'ta bir gün için
   * `https://open.spotify.com` eklenmişti; 13 Ağustos'ta ölçüm iki şey
   * gösterdi ve karar değişti:
   *   1. `open.spotify.com/embed/iframe-api/v1` yalnızca **1292 baytlık bir
   *      önyükleyici** — gerçek API'yi `embed-cdn.spotifycdn.com`dan ikinci
   *      bir `<script>` ile çekiyor (dosya indirilip okundu).
   *   2. O betik `eval` istiyor. `'unsafe-eval'` olmadan ilk satırda
   *      `EvalError` alıp ölüyor, kontrolcü hiç kurulmuyor.
   * Yani çalışması için siteye `'unsafe-eval'` vermek gerekiyordu. Bunun
   * yerine çalar karantinaya alındı: `app/api/music-player/route.ts` ve
   * aşağıdaki `PLAYER_SECURITY_HEADERS`. İzin o mini sayfanın dışına
   * çıkmıyor, site geneli politika ESKİ KATI HÂLİNDE kaldı.
   *
   * (Bu, devir notu §4.5'teki tekrarlayan hata sınıfının dördüncüsüydü:
   * kendi kurduğum bir değerin dış servis tarafından kabul edileceğini
   * varsaymak. Bu kez tahmin edilmedi, betik indirilip okundu.)
   */
  /**
   * ⚠️ `'unsafe-eval'` YALNIZCA GELİŞTİRME SUNUCUSUNDA — 21 Ağustos 2026.
   *
   * Üretimde eklenmiyor ve eklenmeyecek; yukarıdaki gerekçe aynen geçerli.
   * Ama `next dev` sıcak yenileme (HMR) için modülleri `eval` ile
   * çalıştırıyor ve bu politika onu engelliyordu. Sonuç ölçüldü: yerelde
   * `main-app.js` ilk satırda `EvalError` alıyor, React HİÇ hidrasyon
   * yapmıyor — yani geliştirme sunucusunda sayfalar tamamen statik
   * görünüyor. Küratör modu açılmıyor, ray okları çalışmıyor, film perdesi
   * tıklanmıyor. Hata konsola düşüyor ama sayfa "çalışıyor" göründüğü için
   * kolayca gözden kaçıyor.
   *
   * Koşul derleme anında çözülüyor: `next build` NODE_ENV'i "production"
   * yapıyor, yani üretim paketine bu dize hiç girmiyor.
   */
  `script-src 'self' 'unsafe-inline'${
    process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"
  }`,
  // 16 dosyada style={{ }} kullanımı var + Next kendi stillerini satır içi basıyor
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://image.tmdb.org https://i.ytimg.com https://s4.anilist.co ${apiUrl.origin}`,
  `media-src 'self' ${apiUrl.origin}`,
  // Tüm fontlar next/font ile self-host — dış font kaynağı yok
  "font-src 'self' data:",
  `connect-src 'self' ${apiUrl.origin}`,
  /**
   * Gömü kaynakları.
   *
   * ⚠️ `open.spotify.com` 11 Ağustos 2026'da eklendi (Salon 06 · Müzik).
   * Eksikliği **sessiz** bir arızaydı: CSP bir beyaz liste olduğu için
   * listede olmayan gömü hiç çizilmez — sayfa çökmez, iframe boş kalır,
   * ihlal yalnızca konsola düşer. Tasarımın dört ekranının (2a/2b/2c/2d)
   * dördünde de Spotify çaları var.
   *
   * Gömü player Web API'den AYRI bir mekanizma; Kasım 2024'teki uç
   * kapanmalarından etkilenmiyor ve OAuth istemiyor.
   */
  /**
   * `'self'` 13 Ağustos'ta eklendi: müzik çaları artık kendi origin'imizdeki
   * bir karantina sayfası (`/api/music-player`) ve onu iframe'lememiz gerek.
   *
   * ⚠️ `open.spotify.com` aynı gün BURADAN ÇIKARILDI. Sayfalar artık doğrudan
   * Spotify gömüsü çizmiyor: `SpotifyEmbed` bileşeni silindi (tek çalar
   * kararı — iki gömü birbirinden habersiz çalıyordu). Spotify iframe'i
   * yalnızca karantina sayfasının İÇİNDE kuruluyor ve izni onun kendi
   * CSP'sinde (`PLAYER_CSP`). Site geneli politikada Spotify'a ait tek bir
   * satır kalmadı.
   */
  "frame-src 'self' https://www.youtube-nocookie.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  // Yanlışlıkla http:// kalmış bir alt kaynak varsa tarayıcı https'e yükseltsin
  "upgrade-insecure-requests",
].join("; ");

/**
 * Güvenlik başlıkları.
 *
 * CSP dışındakiler sayfanın çalışmasına karışmaz; tarayıcıya yalnızca ek
 * kısıt koyarlar. CSP ise Report-Only olduğu için o da şu an bir şeyi
 * engellemiyor — ölçüm aşamasında.
 */
const SECURITY_HEADERS = [
  {
    // ZORUNLU (2026-08-04 akşamı). Report-Only turu tamamlandı, üç eksik
    // bulunup eklendi. Bir şey kırılırsa geri alış: anahtarın sonuna
    // "-Report-Only" eklemek yeterli — kural yeniden yalnızca raporlar.
    key: "Content-Security-Policy",
    value: CSP_DIRECTIVES,
  },
  {
    // Tarayıcı bu alan adına bir yıl boyunca yalnızca HTTPS ile bağlanır.
    // Araya girme (MITM) ve HTTP'ye düşürme saldırılarını kapatır.
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    // Tarayıcı dosya türünü içeriğe bakıp "tahmin etmez", sunucunun dediğine
    // uyar. Yüklenmiş bir dosyanın script gibi çalıştırılmasını engeller.
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Siteyi başkasının iframe'ine gömmeyi engeller (clickjacking).
    // NOT: Bu, BİZİM YouTube fragmanı gömmemizi etkilemez — o ilişkide
    // biz ebeveyniz, bu başlık ise "beni kim gömebilir" sorusunu yanıtlar.
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Dış bir siteye giderken tam adres sızmasın; yalnızca alan adı gitsin.
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Kullanılmayan tarayıcı API'leri kapatılır. Bir XSS gerçekleşse bile
    // kamera/mikrofon/konum erişimi baştan reddedilir.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

/**
 * ÇALAR KARANTİNASI — yalnızca `/api/music-player` için.
 *
 * Spotify'ın kontrol betiği `eval` istiyor (ölçüm: `route.ts` başlığı).
 * Bütün siteye `'unsafe-eval'` vermek yerine izin **tek bir mini sayfaya**
 * veriliyor: içinde oturum yok, çerez okuyan kod yok, kullanıcı verisi yok —
 * yalnızca Spotify gömüsü ve on satırlık `postMessage` köprüsü.
 *
 * Farklar (global politikaya göre) ve HER BİRİNİN sebebi:
 *   script-src   + 'unsafe-eval'          → betiğin tek gerçek ihtiyacı
 *                + spotify origin'leri    → önyükleyici + CDN'deki asıl betik
 *   frame-src    open.spotify.com         → betiğin kurduğu gömü iframe'i
 *   frame-ancestors 'self'                → bu sayfayı YALNIZCA biz gömebiliriz
 *   connect-src  'none'                   → sayfanın kendi ağ isteği yok
 *   img/font/media 'none' benzeri daralt  → gerekmiyor, kapalı kalsın
 *
 * ⚠️ CSP'yi ayrıca `route.ts` içinde YAZMA. İki `Content-Security-Policy`
 * başlığı olursa tarayıcı ikisinin KESİŞİMİNİ uygular ve `unsafe-eval` yine
 * engellenir. Tek kaynak burası.
 */
const PLAYER_CSP = [
  "default-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  // Yalnızca biz gömebiliriz — X-Frame-Options: SAMEORIGIN'in modern karşılığı
  "frame-ancestors 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://open.spotify.com https://embed-cdn.spotifycdn.com",
  "style-src 'unsafe-inline'",
  "frame-src https://open.spotify.com",
  "img-src data: https://i.scdn.co https://image-cdn-ak.spotifycdn.com https://image-cdn-fa.spotifycdn.com",
].join("; ");

const PLAYER_SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: PLAYER_CSP },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Global kural DENY yazıyor; kendi sayfamıza gömebilmek için gevşetiliyor
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

/**
 * "Bu bir Docker derlemesi" bayrağı. Aynı bayrak iki şeyi birden belirliyor:
 * standalone çıktı VE sunucuda tip/lint kontrolünün atlanması.
 *
 * ── NEDEN SUNUCUDA TİP KONTROLÜ YOK (2 Eylül 2026, ölçüldü) ────────────────
 * `next build`in "Linting and checking validity of types" adımı 3.7 GB'lık
 * makinenin tepe noktası. Bugün altı dakikalık bir deploy 15+ dakika sürdü,
 * o pencerede Coolify paneli cevapsız kaldı ve site 504 verdi — 13-14
 * Ağustos'taki krizin aynısı (docs/deploy-duzeni.md §9.6.1'de "ölçmeden
 * uygulama" notuyla bekleyen çözüm buydu). Güvenlik kaybı yok: aynı kontrol
 * her push öncesi yerelde koşuyor (`tsc --noEmit`, `eslint`, `check:i18n`,
 * `check:karakter`) ve YEREL `next build` bayrak kapalı olduğu için tam
 * kontrolle çalışmaya devam ediyor. Sunucuda ikinci kez yapmanın tek getirisi
 * deploy'u düşürmek ve kutuyu boğmaktı.
 */
const isDockerBuild = process.env.NEXT_OUTPUT_STANDALONE === "1";

const nextConfig: NextConfig = {
  // Docker deploy: yalnizca gerekli dosyalari iceren .next/standalone ciktisi uretir.
  // Yalnizca Docker build'inde acik — Windows'ta pnpm + standalone symlink izni istiyor (EPERM).
  output: isDockerBuild ? "standalone" : undefined,
  typescript: { ignoreBuildErrors: isDockerBuild },
  eslint: { ignoreDuringBuilds: isDockerBuild },
  // "Bu bir Next.js uygulaması" bilgisini vermeye gerek yok
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      /**
       * SIRA ÖNEMLİ: aynı başlık anahtarını iki kural da yazıyor ve **sonraki
       * kazanıyor.** Bu satır yukarıdakinden önce gelirse çalar sayfası
       * global CSP'yi alır, `eval` engellenir ve çalar sessizce ölür.
       * Doğrulaması ölçümle: yanıt başlığında TEK bir CSP olmalı ve içinde
       * `'unsafe-eval'` geçmeli.
       */
      { source: "/api/music-player", headers: PLAYER_SECURITY_HEADERS },
    ];
  },

  /**
   * Spor kanadının taşınması — kalıcı yönlendirmeler (8 Ağustos 2026).
   *
   * ── NEDEN BURADA, MIDDLEWARE'DE DEĞİL ────────────────────────────────────
   * Next istek sırası: headers → **config redirects** → middleware → rewrites
   * → dosya sistemi. Yani bu yönlendirmeler next-intl middleware'ine HİÇ
   * ulaşmadan biter; locale mantığıyla temas etmiyorlar ve döngü riski sıfır.
   * Alternatif (middleware içinde) `/en` önekini elle korumayı gerektirirdi ve
   * yanlış yazılırsa next-intl'in kendi 307'siyle döngü üretebilirdi:
   * `/en/spor` → 301 → `/spor` → 307 → `/en/spor`.
   *
   * Dahası: `middleware.ts` canlı sitenin www kanonikleştirmesini ve yapım
   * aşaması kapısını taşıyor — en kırılgan dosya. Bu iş için açılması gerekmiyor.
   *
   * ── NEDEN `statusCode: 301`, `permanent: true` DEĞİL ─────────────────────
   * Next'te `permanent: true` **308** döner. Brief 301 istiyor ve middleware'deki
   * mevcut www yönlendirmesi de 301; tutarlılık için açıkça yazıldı.
   * (İkisi aynı anda yazılamaz.)
   *
   * ── `/en` SATIRLARI NEDEN AYRI ───────────────────────────────────────────
   * `/:locale/...` deseni `en` dışındaki HER ŞEYİ de yakalar
   * (`/foo/dark-stories/galatasaray` gibi). Sekiz satır yazmak, yanlış eşleşen
   * tek bir joker'den ucuz.
   *
   * ── ⚠️ JOKER YASAK ───────────────────────────────────────────────────────
   * `/dark-stories/galatasaray/:path*` YAZILMAYACAK: o dünyanın altında hâlâ
   * çalışan wiki girdileri ve bölümler var (`/wiki/[entrySlug]`,
   * `/[storySlug]`) ve yeni ağaçta karşılıkları YOK — joker onları 404'e
   * gömerdi. Faz 1'de tek yönlü bir köprü kuruluyor: eski alt sayfalar
   * çalışmaya devam ediyor, geri bağlantıları yeni dünyaya düşüyor.
   */
  async redirects() {
    return [
      // Salon kapısı
      { source: "/dark-stories/category/spor", destination: "/spor", statusCode: 301 },
      { source: "/en/dark-stories/category/spor", destination: "/en/spor", statusCode: 301 },

      /**
       * ── SALON 04 · ANİME GİRİŞİ TAŞINDI (16 Ağustos 2026) ───────────────
       * Spor deseninin aynısı: yalnızca LOBİ yönlendiriliyor, joker YOK —
       * derin odalar (arşiv, karakterler, [slug]) eski ağaçta yaşamaya
       * devam ediyor ve kendi adresleri çalışıyor.
       */
      { source: "/dark-stories/category/anime", destination: "/anime", statusCode: 301 },
      {
        source: "/en/dark-stories/category/anime",
        destination: "/en/anime",
        statusCode: 301,
      },

      // İki dünya (WikiUniverse kayıtları)
      {
        source: "/dark-stories/galatasaray",
        destination: "/spor/futbol/galatasaray",
        statusCode: 301,
      },
      {
        source: "/en/dark-stories/galatasaray",
        destination: "/en/spor/futbol/galatasaray",
        statusCode: 301,
      },
      { source: "/dark-stories/formula-1", destination: "/spor/formula-1", statusCode: 301 },
      {
        source: "/en/dark-stories/formula-1",
        destination: "/en/spor/formula-1",
        statusCode: 301,
      },

      /**
       * ── SALON 06 · KADİM DÜNYALAR KALDIRILDI (11 Ağustos 2026) ───────────
       *
       * Kapı kalktı, yerini Müzik aldı. Evrenler üç gruba ayrıldı (ölçüm
       * `docs/muzik-bolumu-inceleme.md` §3.0):
       *   temurkan-efsaneleri  1 bölüm + 4 wiki + atölye → DURUYOR
       *   zaman-carki          2 wiki                    → DURUYOR (kitap kat.)
       *   kalan altısı         0 bölüm, 0 wiki           → yumuşak silindi
       *
       * Altı evrenin üçünün arşivde kitap serisi var, hedef o seri sayfası.
       * Kalan üçünün yok; hedef Kitap kapısı. İlgisiz bir sayfaya 301 atmak
       * Google'da soft-404 sayıldığı için tür sayfası ya da müzik salonu
       * hedef YAPILMADI.
       *
       * ⚠️ ALT YOLLAR YÖNLENDİRİLMEDİ (`/dark-stories/dune/wiki` gibi).
       * Bilinçli: o evrenlerde sıfır wiki girdisi ve sıfır bölüm var, hiçbir
       * yerden linkli değiller ve sitemap'te hiç yoklardı. Kalıcı olarak
       * kaldırılmış ince bir sayfa için **404 doğru cevaptır**; joker
       * yönlendirme ise spor göçünde özellikle kaçınılan şey (aşağıdaki
       * "JOKER YASAK" notu).
       *
       * Evren KÖKLERİ yönlendirildi çünkü onlar her sayfanın footer'ındaki
       * evren sütununda ve `NexusHub` evren rafında LİNKLİYDİ — taranmış
       * olma olasılıkları yüksek. Hedefler silme günü doğrulandı (üçü 200).
       */
      {
        source: "/dark-stories/category/kadim-dunyalar",
        destination: "/dark-stories/category/kitap",
        statusCode: 301,
      },
      {
        source: "/en/dark-stories/category/kadim-dunyalar",
        destination: "/en/dark-stories/category/kitap",
        statusCode: 301,
      },
      // Arşivde serisi olan üç evren → kendi seri sayfası
      {
        source: "/dark-stories/dune",
        destination: "/dark-stories/category/kitap/seri/dune-serisi",
        statusCode: 301,
      },
      {
        source: "/en/dark-stories/dune",
        destination: "/en/dark-stories/category/kitap/seri/dune-serisi",
        statusCode: 301,
      },
      {
        source: "/dark-stories/malazan-yitikler",
        destination: "/dark-stories/category/kitap/seri/malazan-yitikler",
        statusCode: 301,
      },
      {
        source: "/en/dark-stories/malazan-yitikler",
        destination: "/en/dark-stories/category/kitap/seri/malazan-yitikler",
        statusCode: 301,
      },
      {
        source: "/dark-stories/firtinaisigi-arsivi",
        destination: "/dark-stories/category/kitap/seri/firtinaisigi-arsivi",
        statusCode: 301,
      },
      {
        source: "/en/dark-stories/firtinaisigi-arsivi",
        destination: "/en/dark-stories/category/kitap/seri/firtinaisigi-arsivi",
        statusCode: 301,
      },
      // Serisi olmayan üç evren → Kitap kapısı
      {
        source: "/dark-stories/buz-ve-atesin-sarkisi",
        destination: "/dark-stories/category/kitap",
        statusCode: 301,
      },
      {
        source: "/en/dark-stories/buz-ve-atesin-sarkisi",
        destination: "/en/dark-stories/category/kitap",
        statusCode: 301,
      },
      {
        source: "/dark-stories/kral-katili-guncesi",
        destination: "/dark-stories/category/kitap",
        statusCode: 301,
      },
      {
        source: "/en/dark-stories/kral-katili-guncesi",
        destination: "/en/dark-stories/category/kitap",
        statusCode: 301,
      },
      {
        source: "/dark-stories/yuzuklerin-efendisi",
        destination: "/dark-stories/category/kitap",
        statusCode: 301,
      },
      {
        source: "/en/dark-stories/yuzuklerin-efendisi",
        destination: "/en/dark-stories/category/kitap",
        statusCode: 301,
      },

      // Öksüz kalan üst seviye oyuncu rotası. Brief'te yoktu ama zorunlu:
      // `/futbol/oyuncu/[playerId]` bugün canlı ve `SquadGrid` her kadro
      // kartından oraya bağlanıyor — yeni ağaç kurulunca ortada kalırdı.
      {
        source: "/futbol/oyuncu/:playerId",
        destination: "/spor/futbol/oyuncu/:playerId",
        statusCode: 301,
      },
      {
        source: "/en/futbol/oyuncu/:playerId",
        destination: "/en/spor/futbol/oyuncu/:playerId",
        statusCode: 301,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol === "https:" ? "https" : "http",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/uploads/**",
      },
      // Salon 02: film posterleri TMDB'nin kendi CDN'inden gelir
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],

    /**
     * Yalnızca WebP — **AVIF bilerek yok** (2026-08-09).
     *
     * AVIF önce eklendi ("genelde daha küçük" kabulüyle), sonra ölçüldü ve
     * geri alındı. Gerçek bir kapak (350×540 JPEG, 36.5 KB) üretim
     * derlemesinde her basamakta ikisiyle de üretildi:
     *
     *   genişlik │  AVIF  │  WebP  │ kazanan
     *      32    │   994  │   740  │ WebP
     *      64    │  2334  │  1954  │ WebP
     *     128    │  5894  │  5308  │ WebP
     *     176    │  9043  │  8234  │ WebP
     *     256    │ 15393  │ 14360  │ WebP
     *     384    │ 25509  │ 25962  │ AVIF
     *
     * AVIF ancak 384 px'te öne geçiyor; kapaklarımız en fazla ~176 px
     * genişlikte çiziliyor, yani o basamağa hiç çıkmıyoruz. Küçük görsellerde
     * AVIF'in kap (container) yükü kazancını yiyor.
     *
     * Yani AVIF bu arşivde HEM daha büyük dosya HEM daha pahalı kodlama
     * demekti. Listeye eklemeden önce yeniden ölçün — kapak boyutları
     * büyürse (örn. künye sayfasında tam boy kapak) cevap değişebilir.
     */
    formats: ["image/webp"],

    /**
     * Üretilen boyut merdiveni. Varsayılan liste 128'den doğrudan 256'ya
     * atlıyor; ölçülen kutu genişliklerimiz (kart 106–135 px, cilt sırtı
     * ~150 px'e kadar) tam o boşluğa düşüyordu ve 135 px'lik bir kutu için
     * 256 px'lik dosya üretiliyordu. 144 ve 176 o boşluğu kapatıyor;
     * 288, 144'ün retina (DPR 2) karşılığı — o olmadan retina telefon
     * doğrudan 384'e sıçrıyor (25.9 KB yerine ~18 KB).
     *
     * ⚠️ `sizes` prop'larında `vw` KULLANMAYIN (bkz. bileşenlerdeki notlar).
     * Next, `sizes` içinde bir yüzde görürse aday listesini
     * `deviceSizes[0] × en_küçük_yüzde` (yani 640 × 0.33 ≈ 211) ALTINDAKİ
     * bütün basamakları eleyerek kuruyor — buradaki 128/144/176 basamakları
     * o durumda erişilemez hâle geliyor ve tarayıcı mecburen 256 seçiyor.
     * Kitap ızgaraları kapakları her ekran genişliğinde dar bir banda
     * sıkıştırdığı için sabit px yazmak hem doğru hem de bu tuzağı kapatıyor.
     */
    imageSizes: [16, 32, 48, 64, 96, 128, 144, 176, 256, 288, 384],

    /**
     * Optimize edilmiş kopyanın disk önbelleğinde kalma alt sınırı.
     * Kaynak `/uploads/*` artık `Cache-Control: public, max-age=365d,
     * immutable` ile geliyor (`backend/src/app.module.ts`) — Next yukarı
     * akıştaki bu süreyi zaten dikkate alıyor, buradaki alt sınır ikisini
     * hizalıyor ki tek bir kapak bile gereksiz yere yeniden kodlanmasın.
     */
    minimumCacheTTL: 31_536_000,
  },
};

export default withNextIntl(nextConfig);
