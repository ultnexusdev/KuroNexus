/**
 * Kento Nanami sayfasının elle çizilmiş SVG motifleri.
 *
 * ⚠️ DIŞARIDAN RASTER İNDİRİLMEDİ (BRIEF: lisans doğrulanamaz, CSP zaten
 * engelliyor). Tezgâhtaki her şey burada, yoldan yola çiziliyor.
 *
 * Renk yazılmıyor: dolgu ve çizgi çağıranın verdiği sınıf üzerinden geliyor,
 * yani CSS modülündeki token'lardan okunuyor (kural 16). Hepsi dekoratif →
 * `aria-hidden`; anlam düğmelerin etiketlerinde ve durum satırında.
 *
 * Sunucu bileşenleri: durum yok, olay yok.
 */

/**
 * Kör satır — Nanami'nin aleti ve tezgâhın kesme işareti.
 *
 * Ağzı bilerek DÜZ çizildi: keskinlik çizimde de yok. `raised` açıkken
 * kaldırılmış hâlde duruyor.
 */
export function CleaverMark({
  className,
  bladeClassName,
  gripClassName,
  raised = false,
}: {
  className?: string;
  bladeClassName?: string;
  gripClassName?: string;
  raised?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 56 24"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      <g transform={raised ? "translate(0 -2)" : undefined}>
        {/* Sap */}
        <rect className={gripClassName} x="2" y="9" width="14" height="6" rx="1.5" />
        <rect className={gripClassName} x="16" y="8" width="3" height="8" rx="1" />
        {/* Ağız — uç kısmı yuvarlatılmış, kesici kenar düz */}
        <path
          className={bladeClassName}
          d="M19 8 L48 8 Q54 8 54 12 Q54 16 48 16 L19 16 Z"
        />
        {/* Ağzın "keskin olmayan" alt kenarı: ikinci bir düz çizgi */}
        <rect className={gripClassName} x="19" y="15" width="33" height="1.4" opacity="0.5" />
      </g>
    </svg>
  );
}

/**
 * Saat kadranı — mod düğmesinin glifi.
 *
 * `off` (mesai dışı) durumunda akrep saatin ötesine geçiyor. Fark ŞEKİLDE,
 * yalnızca renkte değil.
 */
export function ClockMark({
  className,
  ringClassName,
  handClassName,
  wedgeClassName,
  off = false,
}: {
  className?: string;
  ringClassName?: string;
  handClassName?: string;
  wedgeClassName?: string;
  off?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      {/* Mesai dilimi — kadranın yüzde yetmişi */}
      <path
        className={wedgeClassName}
        d="M16 16 L16 3 A13 13 0 1 1 6.8 25.2 Z"
        opacity={off ? 0.25 : 0.55}
      />
      <circle
        className={ringClassName}
        cx="16"
        cy="16"
        r="13"
        fill="none"
        strokeWidth="1.6"
      />
      {/* Yelkovan sabit; akrep mesai dışında saatin ötesine geçiyor */}
      <line
        className={handClassName}
        x1="16"
        y1="16"
        x2="16"
        y2="7"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        className={handClassName}
        x1="16"
        y1="16"
        x2={off ? 8 : 23}
        y2={off ? 21 : 19}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle className={handClassName} cx="16" cy="16" r="1.6" stroke="none" />
    </svg>
  );
}

/**
 * Oran cetveli — bir çizginin yüzde yetmişte kırıldığını gösteren şema.
 *
 * Hero'da ve bölüm başlıklarının altında geçen motifin şematik hâli:
 * uzun parça yedi, kısa parça üç, aralarında bir çentik.
 */
export function RatioRule({
  className,
  majorClassName,
  minorClassName,
  notchClassName,
}: {
  className?: string;
  majorClassName?: string;
  minorClassName?: string;
  notchClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 20"
      role="presentation"
      aria-hidden
      focusable="false"
      preserveAspectRatio="none"
    >
      {/* Yedi */}
      <rect className={majorClassName} x="0" y="9" width="138" height="2" />
      {/* Üç */}
      <rect className={minorClassName} x="142" y="9" width="58" height="2" />
      {/* Kırılma noktası */}
      <rect className={notchClassName} x="138" y="2" width="2" height="16" />
      <rect className={notchClassName} x="140" y="6" width="2" height="8" opacity="0.5" />
    </svg>
  );
}

/**
 * Hedef çubuğu — tezgâhtaki gövde.
 *
 * `variant` yalnızca dokuyu değiştiriyor; ORAN değişmiyor, çünkü sayfanın
 * cümlesi tam olarak bu: hedef değişse de bölme noktası yerinde kalıyor.
 */
export function TargetBar({
  variant,
  className,
  bodyClassName,
  grainClassName,
}: {
  variant: "curse" | "special" | "wall" | "small";
  className?: string;
  bodyClassName?: string;
  grainClassName?: string;
}) {
  const grain =
    variant === "wall"
      ? [22, 44, 66, 88, 110, 132, 154, 176]
      : variant === "special"
        ? [30, 70, 110, 150]
        : variant === "small"
          ? [60, 120]
          : [40, 90, 140];

  return (
    <svg
      className={className}
      viewBox="0 0 200 40"
      role="presentation"
      aria-hidden
      focusable="false"
      preserveAspectRatio="none"
    >
      <rect
        className={bodyClassName}
        x="0"
        y="4"
        width="200"
        height="32"
        rx={variant === "wall" ? 0 : 6}
      />
      <g className={grainClassName}>
        {grain.map((x) => (
          <line key={x} x1={x} y1="8" x2={x} y2="32" strokeWidth="1" />
        ))}
      </g>
    </svg>
  );
}
