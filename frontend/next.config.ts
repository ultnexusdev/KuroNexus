import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001");

/**
 * İçerik Güvenlik Politikası (CSP) — şimdilik **Report-Only**.
 *
 * Diğer başlıklardan farklı çalışır: onlar "şunu yapma" derken CSP
 * "YALNIZCA şunlara izin var" der — yani beyaz liste. Listeye yazmayı
 * unuttuğun her kaynak engellenir. Bu yüzden önce `-Report-Only` ekiyle
 * yayına alınıyor: tarayıcı kuralları bilir ama **hiçbir şeyi engellemez**,
 * yalnızca ihlalleri konsola yazar. Gerçek trafikle, kimseyi kırmadan ölçüm.
 *
 * Liste tahminle değil ÖLÇÜMLE kuruldu (2026-08-04):
 *   image.tmdb.org           → film/dizi afişleri
 *   i.ytimg.com              → YouTube küçük görselleri
 *   www.youtube-nocookie.com → fragman gömüleri (iframe)
 *   apiUrl.origin            → /uploads/* görselleri ve ambient ses dosyaları
 *   www.w3.org               → SVG isim uzayı, AĞ YÜKLEMESİ DEĞİL, listede yok
 *   fontlar                  → next/font/google derleme anında self-host ediyor
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
  // Next.js hidrasyon scriptleri satır içi; 'unsafe-eval' BİLEREK yok
  "script-src 'self' 'unsafe-inline'",
  // 16 dosyada style={{ }} kullanımı var + Next kendi stillerini satır içi basıyor
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://image.tmdb.org https://i.ytimg.com ${apiUrl.origin}`,
  `media-src 'self' ${apiUrl.origin}`,
  "font-src 'self' data:",
  `connect-src 'self' ${apiUrl.origin}`,
  "frame-src https://www.youtube-nocookie.com",
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
    // ⚠️ "-Report-Only" eki KASITLI. Kaldırıldığı anda kural zorunlu olur.
    // Kaldırmadan önce: siteyi baştan sona gez, konsolda CSP ihlali kalmasın.
    key: "Content-Security-Policy-Report-Only",
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

const nextConfig: NextConfig = {
  // Docker deploy: yalnizca gerekli dosyalari iceren .next/standalone ciktisi uretir.
  // Yalnizca Docker build'inde acik — Windows'ta pnpm + standalone symlink izni istiyor (EPERM).
  output: process.env.NEXT_OUTPUT_STANDALONE === "1" ? "standalone" : undefined,
  // "Bu bir Next.js uygulaması" bilgisini vermeye gerek yok
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
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
  },
};

export default withNextIntl(nextConfig);
