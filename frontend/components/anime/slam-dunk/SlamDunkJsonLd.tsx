import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/site";
import { SLAM_DUNK_ANCHORS } from "@/lib/anime/slam-dunk/anchors";
import { ROSTER } from "@/lib/anime/slam-dunk/roster";

/**
 * JSON-LD — `CollectionPage` + `ItemList`.
 *
 * ── NEDEN ITEMLIST ───────────────────────────────────────────────────────
 * Sayfa tek bir belge ama beş bağımsız çeyrekten oluşuyor ve her çeyreğin
 * kendi çapası var. `ItemList` arama motoruna bu iç yapıyı söylüyor.
 *
 * ── TEK KAYNAK ───────────────────────────────────────────────────────────
 * Liste `SLAM_DUNK_ANCHORS`tan geliyor — skorbord menüsüyle AYNI defter.
 * İkisi ayrı yazılsaydı biri güncellenir, öteki sessizce yalan söylerdi.
 *
 * ⚠️ CSP: `script-src 'self' 'unsafe-inline'` (next.config.ts) — satır içi
 * JSON-LD geçiyor. Nonce tabanlı CSP'ye geçilirse buranın da nonce alması
 * gerekecek.
 *
 * ⚠️ `<` KAÇIŞI GERÇEKTEN KAÇIRIYOR. Bir çeviri dizesine `</script>`
 * girerse belge kırılırdı; `<` karakteri JSON içinde `<` olarak
 * yazılıyor ve tarayıcı script etiketini orada kapatmıyor.
 *
 * Değiştirme dizesi `"\\u003c"` — TERS BÖLÜ ÇİFT. `"<"` yazmak
 * derleme anında `<` karakterinin kendisine çözülür ve değiştirme hiçbir
 * şey yapmaz. (Bleach'in aynı satırı bugün tam olarak bu yüzden etkisiz;
 * oradaki dizeler sözlükten geldiği için zararsız kalmış.)
 */
export async function SlamDunkJsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "slamDunk" });

  const path = "/anime/slam-dunk";
  const url = locale === "en" ? `${SITE_URL}/en${path}` : `${SITE_URL}${path}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#page`,
    url,
    name: t("meta.title"),
    description: t("meta.description"),
    inLanguage: locale === "en" ? "en" : "tr",
    isPartOf: {
      "@type": "WebSite",
      name: "KuroNexus",
      url: SITE_URL,
    },
    /* Sayfanın KONUSU eserin kendisi; arşiv onun hakkında. */
    about: {
      "@type": "CreativeWorkSeries",
      name: "Slam Dunk",
      alternateName: "スラムダンク",
      author: {
        "@type": "Person",
        name: "Takehiko Inoue",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: SLAM_DUNK_ANCHORS.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: SLAM_DUNK_ANCHORS.map(({ anchor, key }, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t(`quarters.${key}`),
        url: `${url}#${anchor}`,
      })),
    },
    /* Kadro sayısı yapılandırılmış veride de yazılı: sayfanın ne kadar
       kayıt taşıdığı arama sonucunda görünen bir bilgi. */
    numberOfItems: ROSTER.length,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
