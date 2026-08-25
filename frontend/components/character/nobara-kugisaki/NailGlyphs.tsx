/**
 * Nobara Kugisaki sayfasının elle çizilmiş SVG motifleri.
 *
 * ⚠️ DIŞARIDAN RASTER İNDİRİLMEDİ (BRIEF: lisans doğrulanamaz, CSP zaten
 * engelliyor). Tezgâhtaki her şey burada, yoldan yola çiziliyor.
 *
 * Renk yazılmıyor: dolgu ve çizgi çağıranın verdiği sınıf üzerinden geliyor,
 * yani CSS modülündeki token'lardan okunuyor (kural 16). Hepsi dekoratif →
 * `aria-hidden`; anlam düğmelerin `aria-label`ında ve durum satırında.
 *
 * Sunucu bileşenleri: durum yok, olay yok. `"use client"` olmadığı için
 * istemci adaları da bunları çağırabiliyor.
 */

/**
 * Gövde şeması — tezgâhın İKİ yanında da AYNI çizim.
 *
 * Mekaniğin bütün fikri bu: soldaki saman bebek ile sağdaki hedef aynı
 * koordinat sistemini paylaşıyor. `variant` yalnızca dokuyu değiştiriyor —
 * bebekte saman telleri, hedefte düz bir gövde. Oran değişmiyor, çünkü
 * değişirse "aynı nokta" cümlesi yalan olur.
 */
export function BodyDiagram({
  variant,
  className,
  bodyClassName,
  weaveClassName,
}: {
  variant: "doll" | "target";
  className?: string;
  bodyClassName?: string;
  weaveClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 140"
      role="presentation"
      aria-hidden
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Baş */}
      <circle className={bodyClassName} cx="50" cy="18" r="13" />
      {/* Gövde */}
      <path
        className={bodyClassName}
        d="M42 32 L58 32 L62 42 L62 72 L38 72 L38 42 Z"
      />
      {/* Kollar */}
      <path className={bodyClassName} d="M38 42 L14 48 L12 56 L38 54 Z" />
      <path className={bodyClassName} d="M62 42 L86 48 L88 56 L62 54 Z" />
      {/* Bacaklar */}
      <path className={bodyClassName} d="M40 72 L48 72 L46 122 L36 122 Z" />
      <path className={bodyClassName} d="M52 72 L60 72 L64 122 L54 122 Z" />

      {variant === "doll" ? (
        <g className={weaveClassName}>
          {/* Saman örgüsü: gövdeyi saran yatay teller */}
          {[38, 46, 54, 62].map((y) => (
            <line key={y} x1="38" y1={y} x2="62" y2={y} strokeWidth="0.8" />
          ))}
          {/* Bağlama ipi — boyunda ve belde */}
          <line x1="40" y1="34" x2="60" y2="34" strokeWidth="1.6" />
          <line x1="38" y1="70" x2="62" y2="70" strokeWidth="1.6" />
          {/* Başın örgüsü */}
          <line x1="38" y1="18" x2="62" y2="18" strokeWidth="0.8" />
        </g>
      ) : (
        <g className={weaveClassName}>
          {/* Hedefte doku yok — yalnızca dış hattın gölgesi */}
          <path
            d="M42 32 L58 32 L62 42 L62 72 L38 72 L38 42 Z"
            fill="none"
            strokeWidth="1"
            opacity="0.5"
          />
        </g>
      )}
    </svg>
  );
}

/**
 * Çivi — bebeğe çakılmış hâli.
 *
 * Şapkası üstte, gövdesi aşağı doğru. Sahnede yukarıdan aşağı iniyormuş
 * gibi durması için taban noktası altta.
 */
export function NailMark({
  className,
  bodyClassName,
  headClassName,
}: {
  className?: string;
  bodyClassName?: string;
  headClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 32"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      <path className={bodyClassName} d="M6.4 5 L9.6 5 L8.6 28 L8 31 L7.4 28 Z" />
      <ellipse className={headClassName} cx="8" cy="4" rx="6" ry="2.6" />
      <path className={headClassName} d="M2 4 L14 4 L14 6 L2 6 Z" opacity="0.7" />
    </svg>
  );
}

/**
 * Çatlak — hedefte açılan iz.
 *
 * Çiviyle AYNI şey değil: bu tarafta metal yok, yalnızca ayrılan bir yüzey.
 * Fark bilinçli — vuruş solda, sonuç sağda ve ikisi aynı görünmüyor.
 */
export function CrackMark({
  className,
  lineClassName,
}: {
  className?: string;
  lineClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      <path
        className={lineClassName}
        d="M16 2 L13 12 L18 14 L12 30 M13 12 L5 9 M18 14 L27 11 M12 30 L7 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Çekiç — mod düğmesinin glifi.
 *
 * `raised` açıkken kaldırılmış (vurmaya hazır), kapalıyken yatık.
 * Durum farkı ŞEKİLDE, yalnızca renkte değil.
 */
export function HammerMark({
  className,
  headClassName,
  handleClassName,
  raised = false,
}: {
  className?: string;
  headClassName?: string;
  handleClassName?: string;
  raised?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 32"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      <g transform={raised ? "rotate(-32 20 26)" : "rotate(8 20 26)"}>
        <rect className={handleClassName} x="17" y="8" width="4" height="21" rx="1.4" />
        <path
          className={headClassName}
          d="M8 5 L30 5 L32 9 L30 14 L22 14 L21 9 L17 9 L16 14 L8 14 L6 9 Z"
        />
      </g>
    </svg>
  );
}

/**
 * Bağ işareti — bebeğin içine konan parça.
 *
 * Kapalı bir kese: bağ kurulmadıysa boş, kurulduysa içinde bir düğüm var.
 */
export function LinkMark({
  className,
  shellClassName,
  coreClassName,
  linked = false,
}: {
  className?: string;
  shellClassName?: string;
  coreClassName?: string;
  linked?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      <path
        className={shellClassName}
        d="M10 10 L22 10 L26 22 A10 10 0 0 1 6 22 Z"
        fill="none"
        strokeWidth="1.8"
      />
      <path
        className={shellClassName}
        d="M11 10 L13 4 L19 4 L21 10"
        fill="none"
        strokeWidth="1.6"
      />
      {linked ? <circle className={coreClassName} cx="16" cy="20" r="4.5" /> : null}
    </svg>
  );
}
