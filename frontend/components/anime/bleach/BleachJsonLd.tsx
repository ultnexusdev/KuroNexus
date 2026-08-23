import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/site";
import { BLEACH_ANCHORS } from "@/lib/anime/bleach/anchors";

/**
 * JSON-LD — `CollectionPage` + `ItemList` (P18-b, brief §4).
 *
 * ── NEDEN ITEMLIST ───────────────────────────────────────────────────────
 * Sayfa tek bir belge ama on altı bağımsız bölümden oluşuyor ve her
 * bölümün kendi çapası var. `ItemList` arama motoruna bu iç yapıyı
 * söylüyor: sonuçta bölüm bağlantıları (sitelink) çıkabiliyor ve sayfa
 * "uzun bir metin" değil "on altı başlıklı bir arşiv" olarak okunuyor.
 *
 * ── TEK KAYNAK ───────────────────────────────────────────────────────────
 * Liste `BLEACH_ANCHORS`tan geliyor — "Bölümlere atla" listesiyle AYNI
 * defter. İkisi ayrı yazılsaydı biri güncellenir, öteki sessizce yalan
 * söylerdi; üstelik `check-bleach-anchors.mjs` yalnızca deftere bakıyor.
 *
 * ⚠️ CSP: `script-src 'self' 'unsafe-inline'` (next.config.ts) — satır içi
 * JSON-LD geçiyor. Nonce tabanlı CSP'ye geçilirse (o dosyada açık iş
 * olarak yazılı) buranın da nonce alması gerekecek.
 *
 * ⚠️ `dangerouslySetInnerHTML` mecburi: React `<script>` içeriğini metin
 * çocuğu olarak basmıyor. Değer `JSON.stringify` çıktısı — kullanıcı
 * girdisi yok, hepsi sözlükten ve manifestodan geliyor. `<` kaçışı yine de
 * yapılıyor: bir çeviri dizesine `</script>` girerse belge kırılmasın.
 */
export async function BleachJsonLd({ locale }: { locale: string }) {
  const [tMeta, tToc] = await Promise.all([
    getTranslations({ locale, namespace: "anime.bleach.meta" }),
    getTranslations({ locale, namespace: "anime.bleach.toc" }),
  ]);

  const path = "/anime/bleach";
  const url = locale === "en" ? `${SITE_URL}/en${path}` : `${SITE_URL}${path}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#page`,
    url,
    name: tMeta("title"),
    description: tMeta("description"),
    inLanguage: locale === "en" ? "en" : "tr",
    isPartOf: {
      "@type": "WebSite",
      name: "KuroNexus",
      url: SITE_URL,
    },
    /* Sayfanın KONUSU eserin kendisi; arşiv onun hakkında. */
    about: {
      "@type": "CreativeWorkSeries",
      name: "Bleach",
      alternateName: "ブリーチ",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: BLEACH_ANCHORS.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: BLEACH_ANCHORS.map(({ anchor, key }, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: tToc(key),
        url: `${url}#${anchor}`,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\u003c"),
      }}
    />
  );
}
