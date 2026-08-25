/**
 * Suguru Getō sayfasının elle çizilmiş SVG motifleri.
 *
 * ⚠️ DIŞARIDAN RASTER İNDİRİLMEDİ (BRIEF: lisans doğrulanamaz, CSP zaten
 * engelliyor). Haznedeki her şey burada, yoldan yola çiziliyor.
 *
 * Renk yazılmıyor: dolgu ve çizgi çağıranın verdiği sınıf üzerinden geliyor,
 * yani CSS modülündeki token'lardan okunuyor (kural 16). Hepsi dekoratif →
 * `aria-hidden`; anlam düğmelerin etiketlerinde ve durum satırında.
 *
 * Sunucu bileşenleri: durum yok, olay yok.
 */

/**
 * Lanet küresi — yenilmiş bir lanetin sıkıştırılmış hâli.
 *
 * Düzgün bir küre DEĞİL: kenarları içeri çökmüş, yüzeyi düzensiz. Sıkıştırma
 * temiz bir işlem değil ve çizim bunu söylüyor. `weight` arttıkça yüzeydeki
 * düğüm sayısı artıyor — ağır olan daha kalabalık.
 */
export function CurseOrb({
  weight,
  className,
  shellClassName,
  knotClassName,
}: {
  weight: number;
  className?: string;
  shellClassName?: string;
  knotClassName?: string;
}) {
  /* Düğümler sabit bir çember üstünde; sayı ağırlıktan geliyor, konum
     rastgele DEĞİL — aynı ağırlık her zaman aynı deseni çiziyor. */
  const knots = Array.from({ length: Math.min(weight * 2 + 2, 10) }, (_, i) => {
    const angle = (i / Math.min(weight * 2 + 2, 10)) * Math.PI * 2;
    return {
      cx: 24 + Math.cos(angle) * 11,
      cy: 24 + Math.sin(angle) * 11,
      r: 2.2 + (i % 3) * 0.7,
    };
  });

  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      <path
        className={shellClassName}
        d="M24 3 C33 3 39 8 42 15 C45 22 45 30 40 37 C35 44 27 46 20 44 C13 42 7 37 5 29 C3 21 6 12 12 7 C16 4 20 3 24 3 Z
           M24 8 C19 8 15 10 12 14 C9 19 9 26 12 32 C15 38 21 41 26 40 C33 39 38 33 39 26 C40 18 34 8 24 8 Z"
        fillRule="evenodd"
      />
      {knots.map((knot) => (
        <circle
          key={`${knot.cx}-${knot.cy}`}
          className={knotClassName}
          cx={knot.cx}
          cy={knot.cy}
          r={knot.r}
        />
      ))}
    </svg>
  );
}

/**
 * Girdap — 極ノ番「うずまき」 işareti.
 *
 * Tek bir spiral: hazneye inen her şeyin tek bir şeye dönüşmesi. Çizgi
 * kalınlığı merkeze doğru artıyor, yani girdap dışarıdan içeri değil
 * içeriden dışarı büyüyor.
 */
export function VortexMark({
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
      viewBox="0 0 96 96"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      {[0, 120, 240].map((angle) => (
        <path
          key={angle}
          className={armClassName}
          transform={`rotate(${angle} 48 48)`}
          d="M48 48 C48 34 58 24 72 22 C84 20 92 28 92 38 C92 50 82 58 70 56"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
      <circle className={coreClassName} cx="48" cy="48" r="7" />
    </svg>
  );
}

/**
 * Kesa deseni — mod düğmesinin glifi.
 *
 * Getō'nun giydiği rahip kesasının şematik dikişi. `after` açıkken desen
 * kapanıyor: örtü artık bir kıyafet değil bir üniforma.
 */
export function KesaMark({
  className,
  clothClassName,
  seamClassName,
  after = false,
}: {
  className?: string;
  clothClassName?: string;
  seamClassName?: string;
  after?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 32"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      <path
        className={clothClassName}
        d="M4 6 L20 2 L36 6 L34 30 L6 30 Z"
        fill={after ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <g className={seamClassName}>
        <line x1="12" y1="4" x2="10" y2="30" strokeWidth="1" />
        <line x1="20" y1="2.5" x2="20" y2="30" strokeWidth="1" />
        <line x1="28" y1="4" x2="30" y2="30" strokeWidth="1" />
        {after ? null : <line x1="5" y1="16" x2="35" y2="16" strokeWidth="1" />}
      </g>
    </svg>
  );
}

/**
 * Hazne şeması — dolan bir kap değil, İNEN bir seviye.
 *
 * Kap dikey; yutulan her şey üstten giriyor ve dibe çöküyor. Dolduğu için
 * yukarı çıkan bir sıvı yok — bilerek: hazne bir ölçek değil bir mide.
 */
export function VaultShape({
  className,
  wallClassName,
  throatClassName,
}: {
  className?: string;
  wallClassName?: string;
  throatClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 160"
      role="presentation"
      aria-hidden
      focusable="false"
      preserveAspectRatio="none"
    >
      {/* Boğaz */}
      <path
        className={throatClassName}
        d="M24 2 L40 2 L38 26 L26 26 Z"
        fill="none"
        strokeWidth="2"
      />
      {/* Gövde */}
      <path
        className={wallClassName}
        d="M26 26 L38 26 L56 62 L56 148 Q56 158 46 158 L18 158 Q8 158 8 148 L8 62 Z"
        fill="none"
        strokeWidth="2"
      />
    </svg>
  );
}
