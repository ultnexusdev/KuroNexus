/**
 * Satoru Gojō sayfasının elle çizilmiş SVG motifleri.
 *
 * ⚠️ DIŞARIDAN RASTER İNDİRİLMEDİ (BRIEF: lisans doğrulanamaz, CSP zaten
 * engelliyor). Sayfadaki her motif burada, yoldan yola çiziliyor.
 *
 * Hiçbiri renk yazmıyor: dolgu ve çizgi `currentColor` ya da çağıranın
 * verdiği sınıf üzerinden geliyor, yani renkler CSS modülündeki token'lardan
 * okunuyor (kural 16). Hepsi dekoratif → `aria-hidden`.
 *
 * Sunucu bileşenleri: durum yok, olay yok. İstemci adaları da bunları
 * çağırabiliyor çünkü dosyada `"use client"` yok — React her iki tarafta da
 * aynı ağacı çiziyor.
 */

/**
 * Yaklaşma diyagramı — sayfanın merkezî fikri.
 *
 * Soldan sağa doğru gelen bir dizi kısa çizgi; her biri bir öncekinin YARISI
 * kadar yol alıyor ve son çizgi hedefe hiç değmiyor. Mugegen'in tarifi bu:
 * mesafe sonsuza bölünüyor, temas gerçekleşmiyor. Sağ kenardaki dikey çizgi
 * ulaşılamayan sınır.
 *
 * `steps` çizgi sayısı; 8 varsayılan, daha fazlası göz için ayırt edilemiyor.
 */
export function ApproachDiagram({
  className,
  stepClassName,
  limitClassName,
  steps = 8,
}: {
  className?: string;
  stepClassName?: string;
  limitClassName?: string;
  steps?: number;
}) {
  /* Zeno bölmesi: her adım kalan yolun yarısını yiyor. `x` mutlak konum. */
  const marks: { x: number; width: number }[] = [];
  let x = 4;
  let remaining = 232;
  for (let i = 0; i < steps; i += 1) {
    const width = remaining / 2;
    marks.push({ x, width });
    x += width;
    remaining -= width;
  }

  return (
    <svg
      className={className}
      viewBox="0 0 248 64"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      {marks.map((mark, index) => (
        <rect
          key={mark.x}
          className={stepClassName}
          x={mark.x}
          y={30 - index}
          width={Math.max(mark.width - 2, 1)}
          height={4 + index * 0.5}
          rx="1"
          opacity={1 - index * 0.09}
        />
      ))}
      {/* Ulaşılamayan sınır — hiçbir çizgi bu hattı geçmiyor */}
      <line className={limitClassName} x1="240" y1="6" x2="240" y2="58" />
    </svg>
  );
}

/**
 * Rikugan irisi — altı iç içe halka ve merkezde bir nokta.
 *
 * Halka sayısı adın kendisinden (六 = altı). Dıştaki halkalar inceliyor:
 * göz derine doğru ölçmeye devam ediyor.
 */
export function SixEyesIris({
  className,
  ringClassName,
  pupilClassName,
}: {
  className?: string;
  ringClassName?: string;
  pupilClassName?: string;
}) {
  const rings = [46, 38, 30, 23, 16, 10];
  return (
    <svg
      className={className}
      viewBox="0 0 104 104"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      {rings.map((r, index) => (
        <circle
          key={r}
          className={ringClassName}
          cx="52"
          cy="52"
          r={r}
          strokeWidth={2.4 - index * 0.28}
          fill="none"
          opacity={0.35 + index * 0.11}
        />
      ))}
      <circle className={pupilClassName} cx="52" cy="52" r="4.5" />
      {/* Dört çeyrek işareti: ölçüm ağı */}
      <line className={ringClassName} x1="52" y1="2" x2="52" y2="14" strokeWidth="1" />
      <line className={ringClassName} x1="52" y1="90" x2="52" y2="102" strokeWidth="1" />
      <line className={ringClassName} x1="2" y1="52" x2="14" y2="52" strokeWidth="1" />
      <line className={ringClassName} x1="90" y1="52" x2="102" y2="52" strokeWidth="1" />
    </svg>
  );
}

/**
 * Gözbağı bandı — mod düğmesinin glifi.
 *
 * Kapalıyken düz bir bant, açıkken bandın ortasında bir yarık var. Fark
 * `open` ile çiziliyor çünkü düğmenin durumu bir CSS sınıfıyla değil,
 * gerçekten farklı bir şekille anlatılmalı (tek gösterge renk olmasın).
 */
export function BlindfoldBand({
  className,
  bandClassName,
  slitClassName,
  open = false,
}: {
  className?: string;
  bandClassName?: string;
  slitClassName?: string;
  open?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 32"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      <path
        className={bandClassName}
        d="M2 12 Q32 4 62 12 L62 22 Q32 30 2 22 Z"
        fill={open ? "none" : "currentColor"}
        stroke="currentColor"
        strokeWidth="1.6"
      />
      {open ? (
        <>
          <path className={slitClassName} d="M12 17 Q32 9 52 17 Q32 25 12 17 Z" />
          <circle className={slitClassName} cx="32" cy="17" r="2.6" opacity="0.55" />
        </>
      ) : null}
    </svg>
  );
}

/**
 * Uç işareti — çeken (mavi) ve iten (kırmızı) ucun şeması.
 *
 * `direction="in"` oklar merkeze bakıyor, `"out"` dışarı. Renk yok: iki uç
 * birbirinden YÖNLE ayrılıyor, renk yalnızca ikinci gösterge.
 */
export function PoleMark({
  className,
  strokeClassName,
  coreClassName,
  direction,
}: {
  className?: string;
  strokeClassName?: string;
  coreClassName?: string;
  direction: "in" | "out";
}) {
  const arrows = [0, 90, 180, 270];
  return (
    <svg
      className={className}
      viewBox="0 0 72 72"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      <circle className={coreClassName} cx="36" cy="36" r="7" />
      {arrows.map((angle) => (
        <g key={angle} transform={`rotate(${angle} 36 36)`}>
          {direction === "in" ? (
            <path
              className={strokeClassName}
              d="M36 4 L36 20 M31 15 L36 20 L41 15"
              fill="none"
              strokeWidth="2"
            />
          ) : (
            <path
              className={strokeClassName}
              d="M36 20 L36 4 M31 9 L36 4 L41 9"
              fill="none"
              strokeWidth="2"
            />
          )}
        </g>
      ))}
    </svg>
  );
}

/**
 * Çarpışma izi — iki ucun buluştuğu yerde kalan mor yarık.
 *
 * Kapalı bir şekil değil: iki kenarı da açık, çünkü sahnede kalan şey bir
 * nesne değil bir EKSİKLİK. Aşağıdaki iki çizgi "silinen yolu" gösteriyor.
 */
export function EraseTrace({
  className,
  coreClassName,
  edgeClassName,
}: {
  className?: string;
  coreClassName?: string;
  edgeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 96"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      <path
        className={coreClassName}
        d="M8 48 C60 30 92 30 120 48 C148 66 180 66 232 48 C180 60 148 60 120 48 C92 36 60 36 8 48 Z"
      />
      <path
        className={edgeClassName}
        d="M8 40 C64 20 96 20 120 40"
        fill="none"
        strokeWidth="1.4"
      />
      <path
        className={edgeClassName}
        d="M120 56 C148 76 180 76 232 56"
        fill="none"
        strokeWidth="1.4"
      />
    </svg>
  );
}
