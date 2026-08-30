import { getTranslations } from "next-intl/server";
import { JJK_ANCHORS } from "@/lib/anime/jjk/anchors";
import { SITE_URL } from "@/lib/site";

/**
 * ARAMA MOTORUNA SAYFANIN İÇ YAPISI — Bleach `BleachJsonLd` deseninin
 * kardeşi: `CollectionPage` + on bir bölümlük `ItemList`, iki dilde.
 * Liste `JJK_ANCHORS` defterinden — atla listesi, ray ve JSON-LD aynı
 * sırayı görür.
 */
export async function JjkJsonLd({ locale }: { locale: string }) {
  const [meta, toc] = await Promise.all([
    getTranslations({ locale, namespace: "anime.jjk.meta" }),
    getTranslations({ locale, namespace: "anime.jjk.toc" }),
  ]);

  const base = locale === "en" ? `${SITE_URL}/en` : SITE_URL;
  const url = `${base}/anime/jujutsu-kaisen`;

  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: meta("title"),
    description: meta("description"),
    url,
    inLanguage: locale === "en" ? "en" : "tr",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: JJK_ANCHORS.map((anchor, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: toc(anchor.key),
        url: `${url}#${anchor.anchor}`,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
