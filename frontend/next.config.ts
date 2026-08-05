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
  // Next.js hidrasyon scriptleri satır içi; 'unsafe-eval' BİLEREK yok
  "script-src 'self' 'unsafe-inline'",
  // 16 dosyada style={{ }} kullanımı var + Next kendi stillerini satır içi basıyor
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://image.tmdb.org https://i.ytimg.com https://s4.anilist.co ${apiUrl.origin}`,
  `media-src 'self' ${apiUrl.origin}`,
  // Tüm fontlar next/font ile self-host — dış font kaynağı yok
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
