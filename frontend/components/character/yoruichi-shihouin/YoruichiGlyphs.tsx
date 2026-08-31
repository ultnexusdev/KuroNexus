/**
 * Yoruichi sayfasının elle çizilmiş işaretleri — SUNUCU bileşenleri.
 *
 * Neden elle SVG: sahne/teknik görselleri üretilmiyor (FAZ 2 §3) ve dışarıdan
 * raster indirilmiyor. Sayfanın grafik malzemesi bu iki işaretten ibaret.
 *
 * Renk buradan GELMİYOR: her `stroke` `currentColor` okuyor ve sınıflar
 * dışarıdan geliyor. Hex disiplini (kural 16) böyle korunuyor.
 *
 * ⚠️ ARMA CANON DEĞİL. Arşivin kendi Bleach defteri bunu açıkça yazıyor
 * (`components/anime/bleach/NobleHouses.tsx` başlığı): canon bu haneler için
 * bir *mon* yayımlamıyor, oradaki altı işaret hanenin uzmanlığından
 * türetilmiş. Buradaki de öyle — dört akçaağaç yaprağı ve dörtlü dönme
 * simetrisi. O dosyadaki dolgulu `d` KOPYALANMADI: bu işaret dolgusuz,
 * yalnız kontur, ve kendi geometrisiyle çizildi (sayfalar arası bileşen
 * paylaşımı yasak).
 */

/**
 * 四楓院 — dört akçaağaç yaprağı, merkezde bir halka.
 *
 * Tek yaprak çizildi; diğer üçü 90°'lik dönüşlerle alındı. Dolgu yok:
 * filigran bir amblem değil, konağın duvarındaki bir iz gibi durmalı.
 */
export function ShihoinMon({
  className,
  leafClassName,
  ringClassName,
}: {
  className?: string;
  leafClassName?: string;
  ringClassName?: string;
}) {
  /* Yaprağın konturu: sap merkezden çıkıyor, beş uç dışa açılıyor. */
  const leaf =
    "M100 100 L100 74 L92 62 L100 64 L100 40 L108 64 L116 62 L108 74 Z";

  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g className={leafClassName}>
          <path d={leaf} />
          <path d={leaf} transform="rotate(90 100 100)" />
          <path d={leaf} transform="rotate(180 100 100)" />
          <path d={leaf} transform="rotate(270 100 100)" />
        </g>
        <g className={ringClassName}>
          <circle cx="100" cy="100" r="14" />
          <circle cx="100" cy="100" r="58" />
        </g>
      </g>
    </svg>
  );
}

/**
 * Art-görüntü işareti — 空蝉'nin şeması.
 *
 * Üç dikey iz: soldaki en soluk (en eski kopya), sağdaki tam. Sayfanın
 * hareket dilinin duran hâli; bölüm ayıracı olarak kullanılıyor. Dekoratif
 * değil ama bilgi de taşımıyor, o yüzden `aria-hidden`.
 */
export function AfterimageMark({
  className,
  ghostClassName,
  bodyClassName,
}: {
  className?: string;
  ghostClassName?: string;
  bodyClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 32"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="round">
        <g className={ghostClassName}>
          <path d="M8 22 L20 10" />
          <path d="M30 24 L46 8" />
        </g>
        <g className={bodyClassName}>
          <path d="M58 26 L80 6" />
          <path d="M86 6 L112 6" />
        </g>
      </g>
    </svg>
  );
}
