import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001");

/**
 * Güvenlik başlıkları — CSP HARİÇ.
 *
 * Buradakilerin hiçbiri sayfanın çalışmasına karışmaz; tarayıcıya yalnızca
 * ek kısıt koyarlar. CSP bilinçli olarak ayrı tutuldu: o, yanlış yazılırsa
 * siteyi bozabilen tek başlık ve önce Report-Only modda ölçülecek.
 */
const SECURITY_HEADERS = [
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
