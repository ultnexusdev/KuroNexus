import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * `/robots.txt` — bugüne kadar hiç yoktu (404 dönüyordu).
 *
 * İki işi var: tarayıcılara sitemap'in yerini söylemek ve yönetim ekranlarını
 * dizine girmekten çıkarmak. Yönetim uçları zaten kimlik doğrulaması istiyor,
 * yani bu bir güvenlik önlemi DEĞİL — amacı arama sonuçlarında anlamsız
 * "giriş yapın" sayfalarının belirmesini engellemek.
 *
 * Yol iki kez yazılıyor çünkü varsayılan dil (tr) URL'de önek almıyor:
 * `/admin` Türkçe, `/en/admin` İngilizce aynı sayfa.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/en/admin", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
