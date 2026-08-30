/**
 * Levi sayfasının elle çizilmiş işaretleri — SUNUCU bileşenleri.
 *
 * Neden elle SVG: sahne/teknik görselleri üretilmiyor (BRIEF §3) ve dışarıdan
 * raster indirilmiyor. Sayfanın tek grafik motifi bu kanat arması; kendi
 * konturuyla çizildi, hiçbir dosyaya bağlı değil.
 *
 * ⚠️ Bu sayfada JAPONCA FİLİGRAN YOK (dalga kilidi). Kanat arması tek başına
 * duruyor ve dolgusuz — yalnız kontur, çok büyük, çok soluk.
 *
 * Renk buradan GELMİYOR: her stroke `currentColor` okuyor, sınıflar dışarıdan
 * geliyor. Böylece hex disiplini (kural 16) bozulmuyor.
 */

/**
 * Keşif Birliği'nin kanat arması — "özgürlüğün kanatları".
 *
 * İki kanat aynı geometriden: sağ kanat çizildi, sol kanat `scale(-1 1)` ile
 * aynadan alındı. Her kanat beş tüy: üç yukarı, iki aşağı. Dolgu yok, yalnız
 * kontur — arma bir amblem değil bir iz.
 */
export function WingsMark({
  className,
  featherClassName,
  spineClassName,
}: {
  className?: string;
  featherClassName?: string;
  spineClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 120"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g className={featherClassName}>
          {/* Sağ kanat — üç yukarı tüy */}
          <path d="M100 58 C 126 54 154 42 182 18 C 160 40 130 52 100 58 Z" />
          <path d="M100 62 C 124 60 150 53 174 37 C 152 55 126 61 100 62 Z" />
          <path d="M100 66 C 122 66 144 63 166 54 C 146 66 122 68 100 66 Z" />
          {/* Sağ kanat — iki aşağı tüy */}
          <path d="M100 70 C 120 73 140 79 160 93 C 138 83 118 77 100 70 Z" />
          <path d="M100 74 C 116 78 132 86 146 100 C 128 90 112 82 100 74 Z" />
        </g>
        <g className={featherClassName} transform="translate(200 0) scale(-1 1)">
          {/* Sol kanat — aynı geometrinin aynası */}
          <path d="M100 58 C 126 54 154 42 182 18 C 160 40 130 52 100 58 Z" />
          <path d="M100 62 C 124 60 150 53 174 37 C 152 55 126 61 100 62 Z" />
          <path d="M100 66 C 122 66 144 63 166 54 C 146 66 122 68 100 66 Z" />
          <path d="M100 70 C 120 73 140 79 160 93 C 138 83 118 77 100 70 Z" />
          <path d="M100 74 C 116 78 132 86 146 100 C 128 90 112 82 100 74 Z" />
        </g>
        {/* İki kanadın birleştiği dikey iz */}
        <path className={spineClassName} d="M100 46 L100 104" />
      </g>
    </svg>
  );
}

/**
 * Ense ölçüsü — 1 m × 10 cm şeridinin şematik gösterimi.
 *
 * Donanım bölümündeki "ense" kartının yanında duruyor: uzun bir dikdörtgen ve
 * iki uçtaki ölçü çentikleri. Dekoratif değil — kartın metninde geçen ölçünün
 * görsel karşılığı, o yüzden `aria-hidden` ama boş kadraj gibi de değil.
 */
export function NapeMeasure({
  className,
  barClassName,
  tickClassName,
}: {
  className?: string;
  barClassName?: string;
  tickClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 24"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="square">
        <rect className={barClassName} x="14" y="8" width="172" height="8" />
        <path className={tickClassName} d="M14 2 L14 22 M186 2 L186 22" />
      </g>
    </svg>
  );
}
