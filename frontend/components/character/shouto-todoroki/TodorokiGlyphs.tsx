/**
 * Todoroki sayfasının elle çizilmiş işaretleri — SUNUCU bileşenleri.
 *
 * Neden elle SVG: sahne/Quirk görselleri üretilmiyor (FAZ 2 §3) ve dışarıdan
 * raster indirilmiyor. Sayfanın iki grafik motifi bu dosyada: soğuk tarafın
 * kar tanesi, sıcak tarafın alev konturu. İkisi de aynı 200×200 kutuda,
 * aynı çizgi kalınlığında ve aynı merkezde — çünkü sayfanın iddiası "iki
 * ayrı şey" değil, "aynı gövdenin iki yarısı".
 *
 * Bu dosya bir İSTEMCİ ADASI DEĞİL: durumu yok, `"use client"` yok.
 *
 * Renk buradan GELMİYOR: her `stroke` `currentColor` okuyor ya da sınıf
 * dışarıdan geliyor. Böylece hex disiplini (kural 16) bozulmuyor.
 */

/**
 * Kar tanesi — altı kollu, dolgusuz.
 *
 * Altı kol tek bir kolun 60°'lik dönüşleriyle üretildi: gövde çizgisi, iki
 * yan dal ve uçtaki çatal. Buzun kendisi gibi tekrarla büyüyor.
 */
export function FrostMark({
  className,
  armClassName,
  coreClassName,
}: {
  className?: string;
  armClassName?: string;
  coreClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <g
            key={angle}
            className={armClassName}
            transform={`rotate(${angle} 100 100)`}
          >
            {/* Gövde */}
            <path d="M100 100 L100 18" />
            {/* Alt dal çifti */}
            <path d="M100 66 L84 50 M100 66 L116 50" />
            {/* Üst dal çifti */}
            <path d="M100 40 L89 29 M100 40 L111 29" />
            {/* Uçtaki çatal */}
            <path d="M100 18 L94 11 M100 18 L106 11" />
          </g>
        ))}
        {/* Merkezdeki altıgen çekirdek */}
        <path
          className={coreClassName}
          d="M100 88 L110 94 L110 106 L100 112 L90 106 L90 94 Z"
        />
      </g>
    </svg>
  );
}

/**
 * Alev konturu — dolgusuz, tek kontur + iki iç dil.
 *
 * Kar tanesiyle AYNI kutuda ve aynı merkezde duruyor: yan yana
 * konduklarında iki motifin gövdeleri üst üste biniyor. Bilerek —
 * bölünme çizgisinin iki yanında aynı yüksekliğe oturuyorlar.
 */
export function FlameMark({
  className,
  outlineClassName,
  tongueClassName,
}: {
  className?: string;
  outlineClassName?: string;
  tongueClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Dış kontur: tabandan yükselen, tepede sola kıvrılan tek çizgi */}
        <path
          className={outlineClassName}
          d="M100 182 C 58 168 42 132 58 100 C 62 118 72 126 78 128
             C 68 96 78 58 112 18 C 106 54 120 68 134 86
             C 152 110 154 152 100 182 Z"
        />
        {/* İç dil — daha kısa, aynı eğri ailesinden */}
        <path
          className={tongueClassName}
          d="M100 168 C 78 156 72 132 84 112 C 86 126 92 132 96 134
             C 90 110 98 86 116 62 C 112 88 122 100 128 112
             C 138 132 132 156 100 168 Z"
        />
        {/* Çekirdek dil — kar tanesinin altıgen çekirdeğiyle aynı yükseklikte */}
        <path
          className={tongueClassName}
          d="M100 150 C 90 142 88 128 96 116 C 100 128 108 134 110 142
             C 112 148 108 150 100 150 Z"
        />
      </g>
    </svg>
  );
}

/**
 * Oran şeridi işareti — bölünme çizgisinin başına oturan çentik.
 *
 * Bölüm başlıklarının yanında, çizginin tam üstünde duruyor: iki üçgen
 * birbirine bakıyor. Kaydırağın sayfadaki her bölümde bir karşılığı
 * olduğunu gösteren tek işaret.
 */
export function SeamNotch({
  className,
  iceClassName,
  flameClassName,
}: {
  className?: string;
  iceClassName?: string;
  flameClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 12"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <path className={iceClassName} d="M0 0 L11 6 L0 12 Z" />
      <path className={flameClassName} d="M24 0 L13 6 L24 12 Z" />
    </svg>
  );
}
