import type { MetadataRoute } from "next";
import { fetchCategories, fetchUniverses } from "@/lib/api/universes";
import { SITE_URL } from "@/lib/site";

/**
 * `/sitemap.xml` — bugüne kadar hiç yoktu (404 dönüyordu).
 *
 * Saatte bir yeniden üretilir. Derleme anında sabitlenmemesi bilinçli: yeni bir
 * evren ya da kategori eklendiğinde yeni bir deploy beklemeden listeye girer.
 */
export const revalidate = 3600;

/**
 * Parametresiz, herkese açık sayfalar. Yönetim ekranları burada YOK — onlar
 * `robots.txt`te de kapalı.
 */
const STATIC_PATHS = [
  "",
  "/dark-stories",
  "/dark-stories/category/kitap",
  "/dark-stories/category/kitap/arsiv",
  "/dark-stories/category/kitap/seriler",
  "/dark-stories/category/kitap/yazarlar",
  "/dark-stories/category/kitap/oduller",
  "/dark-stories/category/kitap/okuma-sirasi",
  "/dark-stories/category/anime/arsiv",
  "/dark-stories/category/dizi/arsiv",
  "/dark-stories/category/film/arsiv",
];

/**
 * Bir yolu iki dilli girdiye çevirir.
 *
 * `localePrefix: "as-needed"` (bkz. lib/i18n/routing.ts): Türkçe öneksiz,
 * İngilizce `/en` önekli. Her iki adres de listeye ayrı ayrı girer ve ikisi de
 * aynı `alternates` haritasını taşır — hreflang'in doğru kullanımı bu:
 * her URL, kendisi dahil tüm dil eşlerini bildirir.
 */
function localizedEntries(
  path: string,
  lastModified: Date,
  priority: number,
): MetadataRoute.Sitemap {
  const tr = `${SITE_URL}${path}`;
  const en = `${SITE_URL}/en${path}`;
  const languages = { tr, en };
  return [
    { url: tr, lastModified, priority, alternates: { languages } },
    { url: en, lastModified, priority, alternates: { languages } },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    entries.push(...localizedEntries(path, now, path === "" ? 1 : 0.8));
  }

  /**
   * Dinamik bölümler API'den geliyor. `allSettled` bilinçli: API'ye
   * ulaşılamazsa sitemap **boş dönmez**, sabit sayfalarla yayınlanır.
   * Bu projede sessiz boş yanıt bilinen bir tuzak (bulgu Ö-8) — burada
   * kabul edilebilir olmasının sebebi, alternatifin hiç sitemap olmaması.
   */
  const [categories, universes] = await Promise.allSettled([
    fetchCategories(),
    fetchUniverses(),
  ]);

  if (categories.status === "fulfilled") {
    for (const category of categories.value) {
      entries.push(
        ...localizedEntries(
          `/dark-stories/category/${category.slug}`,
          new Date(category.updatedAt),
          0.7,
        ),
      );
    }
  }

  if (universes.status === "fulfilled") {
    for (const universe of universes.value) {
      entries.push(
        ...localizedEntries(
          `/dark-stories/${universe.slug}`,
          new Date(universe.updatedAt),
          0.7,
        ),
      );
    }
  }

  // Kategori listesi sabit yollarla çakışabilir (ör. "kitap" hem elle yazılı
  // hem API'den geliyor); son yazan kazanır, tekrar eden adres kalmaz.
  const unique = new Map(entries.map((entry) => [entry.url, entry]));
  return [...unique.values()];
}
