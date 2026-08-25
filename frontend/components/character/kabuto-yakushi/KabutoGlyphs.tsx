/**
 * Kabuto Yakushi — sayfanın elle çizilmiş SVG seti.
 *
 * BRIEF §4.4: dışarıdan raster görsel indirmek/hotlink etmek yasak. Bu
 * sayfadaki bütün motifler burada, geometriyle çiziliyor: gözlük, pul dokusu,
 * kart sırtı, kimlik işaretleri, dikiş nişanı ve gezinme okları.
 *
 * ⚠️ Hiçbirinde `<pattern>`/`<defs>` kimliği YOK. Kart sırtı ve pul dokusu
 * sayfada onlarca kez çiziliyor; id taşıyan bir tanım her kopyada tekrar eder
 * ve belgede yinelenen id üretirdi. Dokular bu yüzden açık açık çizgi olarak
 * seriliyor — biraz daha uzun kod, sıfır id çakışması.
 *
 * Hepsi SUNUCU bileşeni: durum tutmuyorlar, `"use client"` yok. Boyayı CSS
 * veriyor (`currentColor` ve sınıf adları), bileşenler yalnızca geometri.
 */

/** Pul dokusu — üst üste binen yarım daireler. Portrenin ve kart sırtının üstünde. */
export function ScaleField({
  className,
  rows = 11,
  cols = 7,
}: {
  className?: string;
  rows?: number;
  cols?: number;
}) {
  const cell = 20;
  const drop = 13;
  const scales: string[] = [];
  for (let row = 0; row < rows; row += 1) {
    const offset = row % 2 === 0 ? 0 : cell / 2;
    for (let col = -1; col <= cols; col += 1) {
      const x = col * cell + offset;
      const y = row * drop;
      scales.push(`M ${x} ${y} q ${cell / 2} ${drop * 1.25} ${cell} 0`);
    }
  }
  return (
    <svg
      className={className}
      viewBox={`0 0 ${cols * cell} ${rows * drop}`}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {scales.map((d) => (
        <path key={d} d={d} stroke="currentColor" strokeWidth="1" />
      ))}
    </svg>
  );
}

/**
 * Yuvarlak gözlük — hero portresinin üstüne binen çerçeve.
 *
 * Üç katman: çerçeve (metal), camdaki yansıma bandı ve camın ARDINDAKİ göz.
 * Normal hâlde yansıma açık, göz kapalı: cama bakıyorsun, gözü göremiyorsun.
 * Sennin modunda CSS yansımayı söndürüp yılan gözünü açıyor.
 */
export function Spectacles({
  className,
  frameClassName,
  lensClassName,
  glareClassName,
  eyeClassName,
}: {
  className?: string;
  frameClassName?: string;
  lensClassName?: string;
  glareClassName?: string;
  eyeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 96"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {/* Cam dolgusu — çok düşük opaklıkta, camın varlığını belli eder */}
      <circle className={lensClassName} cx="76" cy="48" r="30" />
      <circle className={lensClassName} cx="164" cy="48" r="30" />

      {/* Camın ardındaki yılan gözü: yatay badem + dikey yarık gözbebeği */}
      <g className={eyeClassName}>
        <path
          d="M 150 48 q 14 -12 28 0 q -14 12 -28 0 Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M 164 40 q 3.2 8 0 16 q -3.2 -8 0 -16 Z" fill="currentColor" />
        <path
          d="M 62 48 q 14 -11 28 0 q -14 11 -28 0 Z"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.75"
        />
        <path
          d="M 76 41 q 2.8 7 0 14 q -2.8 -7 0 -14 Z"
          fill="currentColor"
          opacity="0.75"
        />
      </g>

      {/* Yansıma: iki eğik bant. Camın ardını kapatan şey bu. */}
      <g className={glareClassName}>
        <path d="M 56 66 L 84 24 L 95 24 L 67 66 Z" fill="currentColor" />
        <path d="M 90 62 L 105 39 L 110 39 L 95 62 Z" fill="currentColor" />
        <path d="M 144 66 L 172 24 L 183 24 L 155 66 Z" fill="currentColor" />
        <path d="M 178 62 L 193 39 L 198 39 L 183 62 Z" fill="currentColor" />
      </g>

      {/* Çerçeve: iki halka, köprü, iki sap */}
      <g
        className={frameClassName}
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      >
        <circle cx="76" cy="48" r="30" />
        <circle cx="164" cy="48" r="30" />
        <path d="M 106 46 q 14 -7 28 0" />
        <path d="M 46 44 L 16 34" />
        <path d="M 194 44 L 224 34" />
      </g>
    </svg>
  );
}

/**
 * Kart sırtı — desteden çekilmeyi bekleyen kimlikler.
 *
 * Sırtta kimlik yok: iki çerçeve çizgisi, çapraz tarama ve ortada gözlüğün
 * iki halkası. Sennin modunda tarama sönüp yerini pul sırasına bırakıyor
 * (`hatchClassName` / `scaleClassName` CSS'te devrediliyor).
 */
export function CardBack({
  className,
  frameClassName,
  hatchClassName,
  scaleClassName,
  markClassName,
}: {
  className?: string;
  frameClassName?: string;
  hatchClassName?: string;
  scaleClassName?: string;
  markClassName?: string;
}) {
  const hatch: string[] = [];
  for (let i = -60; i <= 120; i += 12) {
    hatch.push(`M ${i} 0 L ${i + 84} 168`);
  }
  const scaleRows: string[] = [];
  for (let row = 0; row < 9; row += 1) {
    const offset = row % 2 === 0 ? 0 : 12;
    for (let col = -1; col <= 5; col += 1) {
      scaleRows.push(
        `M ${col * 24 + offset} ${18 + row * 17} q 12 15 24 0`,
      );
    }
  }
  return (
    <svg
      className={className}
      viewBox="0 0 120 168"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g className={hatchClassName}>
        {hatch.map((d) => (
          <path key={d} d={d} stroke="currentColor" strokeWidth="0.8" />
        ))}
      </g>
      <g className={scaleClassName}>
        {scaleRows.map((d) => (
          <path key={d} d={d} stroke="currentColor" strokeWidth="0.9" />
        ))}
      </g>
      <g className={frameClassName} stroke="currentColor" fill="none">
        <rect x="0.75" y="0.75" width="118.5" height="166.5" strokeWidth="1.5" />
        <rect x="7" y="7" width="106" height="154" strokeWidth="0.7" />
      </g>
      <g
        className={markClassName}
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      >
        <circle cx="49" cy="84" r="13" />
        <circle cx="81" cy="84" r="13" />
        <path d="M 62 82 q 4 -3 8 0" />
      </g>
    </svg>
  );
}

/**
 * Kimlik işaretleri — her kartın ve her tekniğin kendi nişanı.
 *
 * Tek çizgi kalınlığı (1.6), tek kutu (24×24), tek dil: hepsi aynı elden
 * çıkmış görünsün diye. Unicode simge ya da emoji kullanılmıyor.
 */
export function CardMark({
  mark,
  className,
}: {
  mark: string;
  className?: string;
}) {
  const shape = () => {
    switch (mark) {
      /* Adı olmayan çocuk: tamamlanmamış halka */
      case "ring":
        return (
          <>
            <path d="M 12 3 a 9 9 0 1 1 -6.4 2.7" />
            <path d="M 12 3 l -2.6 2.4" opacity="0.5" />
          </>
        );
      /* Sınav adayı: açılan kart yelpazesi */
      case "fan":
        return (
          <>
            <rect x="8.5" y="6" width="8" height="13" rx="0.8" />
            <path d="M 7.4 7.6 L 4.2 12.2 L 10.6 20" />
            <path d="M 17.6 7.6 L 20.6 12" />
          </>
        );
      /* Kök ajanı: aşağı dallanan kök */
      case "root":
        return (
          <>
            <path d="M 12 3 L 12 12" />
            <path d="M 12 12 q -5 3 -6 9" />
            <path d="M 12 12 q 5 3 6 9" />
            <path d="M 12 12 L 12 21" />
          </>
        );
      /* Tıbbi ninja: dikişle kapatılmış kesik */
      case "suture":
        return (
          <>
            <path d="M 4 12 L 20 12" />
            <path d="M 7 8.5 L 9.5 15.5" />
            <path d="M 11 8.5 L 13.5 15.5" />
            <path d="M 15 8.5 L 17.5 15.5" />
          </>
        );
      /* Orochimaru'nun gölgesi: kıvrılan yılan */
      case "coil":
        return (
          <>
            <path d="M 19 6 q -9 -1 -9 5 q 0 5 5 5 q 4 0 4 -3 q 0 -2.4 -2.6 -2.4" />
            <path d="M 19 6 l -3.4 -2" />
            <path d="M 19 6 l -3.4 2" />
            <path d="M 5 18.5 q 5 2.6 11 1.4" />
          </>
        );
      /* Ortaklık: iç içe geçen iki halka */
      case "pact":
        return (
          <>
            <circle cx="9" cy="12" r="6" />
            <circle cx="15" cy="12" r="6" />
          </>
        );
      /* Edo Tensei: kapağı aralanmış tabut */
      case "coffin":
        return (
          <>
            <path d="M 8 3 L 16 3 L 18.5 12 L 16 21 L 8 21 L 5.5 12 Z" />
            <path d="M 6.4 8 L 17.6 8" />
            <path d="M 12 11 L 12 17" opacity="0.6" />
          </>
        );
      /* Kimlik değiştirme: yüzü ikiye bölen maske */
      case "mask":
        return (
          <>
            <path d="M 12 3 q 7 0 7 7 q 0 8 -7 11 q -7 -3 -7 -11 q 0 -7 7 -7 Z" />
            <path d="M 12 3 L 12 21" opacity="0.55" />
            <path d="M 7.6 10.5 q 2.2 -1.6 3.4 0" />
          </>
        );
      /* Dead Soul: iplerle kaldırılan gövde */
      case "puppet":
        return (
          <>
            <path d="M 6 3 L 9.5 9" />
            <path d="M 18 3 L 14.5 9" />
            <circle cx="12" cy="11" r="2.6" />
            <path d="M 12 13.6 L 12 18" />
            <path d="M 12 18 L 9 21.5" />
            <path d="M 12 18 L 15 21.5" />
          </>
        );
      /* Nakil: gövdeye dikilen ikinci parça */
      case "graft":
        return (
          <>
            <path d="M 4 12 q 4 -7 8 0 q 4 7 8 0" />
            <path d="M 12 4.5 L 12 19.5" strokeDasharray="2.6 2.4" />
          </>
        );
      /* Boş kart: yalnızca çerçeve */
      case "blank":
        return <rect x="5" y="3.5" width="14" height="17" rx="1" />;
      default:
        return null;
    }
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {shape()}
    </svg>
  );
}

/** Dikiş nişanı — çizelgenin her kaydını hatta bağlayan tek dikiş. */
export function StitchMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden
      focusable="false"
    >
      <path d="M 3.5 4 L 12.5 12" />
      <path d="M 12.5 4 L 3.5 12" />
    </svg>
  );
}

/** Gezinme oku — ok işareti yerine çizilmiş chevron (unicode simge yok). */
export function Chevron({
  direction = "right",
  className,
}: {
  direction?: "left" | "right";
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {direction === "left" ? (
        <path d="M 10 3 L 5 8 L 10 13" />
      ) : (
        <path d="M 6 3 L 11 8 L 6 13" />
      )}
    </svg>
  );
}
