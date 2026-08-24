/**
 * Neji sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §3.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor — emsal
 * `components/character/itachi/SharinganEyes.tsx`. Renkler yalnızca token'dan
 * geliyor (`--nej-*` ailesi, modülün başındaki deri bloğu); bu dosyada da tek
 * hex yok.
 *
 * Hareket CSS'te: bileşenler yalnızca `className` alıp geometriyi çiziyor,
 * hangi çizginin ne zaman görüneceğini `data-*` nitelikleri söylüyor. Böylece
 * reduced-motion battaniyesi (modülün sonu) hepsini tek yerden durdurabiliyor.
 *
 * ⚠️ Bu dosyada "use client" YOK ama istemci adaları (`TrigramCounter`,
 * `CageShell`) onu çağırıyor — düz JSX olduğu için istemci paketine giriyor,
 * ek bağımlılık getirmiyor. Sunucu tarafında da (hero damarları, mühür)
 * aynı bileşenler kullanılıyor.
 *
 * ⚠️ MÜHÜR BİR KOPYA DEĞİL: yan dal mührünün özgün işareti çizilmedi. Buradaki
 * grafik arşivin kendi soyutlaması — parmaklık, kuş ve kancalı bir çapraz.
 * Sayfadaki künye satırı da bunu açıkça söylüyor (NEJI_SEAL.caption).
 */

/* ── Hero: alından geriye açılan damar ağı ───────────────────────────────
   Kaynak nokta viewBox'ın tam ortası (100, 104). Bileşen portrenin alnına
   ORTALANARAK yerleştiriliyor (bkz. `.heroVeins`), yani hangi boyutta
   çizilirse çizilsin ağ hep aynı noktadan açılıyor. Aşağıya doğru dal yok:
   orası yüzün kendisi. */

const VEINS: { d: string; w: number }[] = [
  { d: "M100 104 C 86 101 74 97 60 90 C 50 85 42 78 33 68", w: 2.4 },
  { d: "M74 97 C 70 88 66 80 60 70", w: 1.5 },
  { d: "M60 90 C 52 92 44 93 32 92", w: 1.4 },
  { d: "M86 101 C 82 110 78 118 70 128", w: 1.2 },
  { d: "M33 68 C 26 63 20 60 12 57", w: 0.9 },
  { d: "M100 104 C 114 101 126 97 140 90 C 150 85 158 78 167 68", w: 2.4 },
  { d: "M126 97 C 130 88 134 80 140 70", w: 1.5 },
  { d: "M140 90 C 148 92 156 93 168 92", w: 1.4 },
  { d: "M114 101 C 118 110 122 118 130 128", w: 1.2 },
  { d: "M167 68 C 174 63 180 60 188 57", w: 0.9 },
  { d: "M100 104 C 98 90 96 78 92 62 C 90 52 88 44 86 32", w: 1.6 },
  { d: "M100 104 C 104 90 108 78 114 64", w: 1.1 },
  { d: "M92 62 C 84 56 78 52 70 46", w: 0.8 },
  { d: "M114 64 C 122 58 128 54 136 48", w: 0.8 },
];

export function VeinBranches({
  className,
  pathClassName,
}: {
  className?: string;
  pathClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g stroke="var(--nej-vein)" strokeLinecap="round" fill="none">
        {VEINS.map((vein, index) => (
          <path
            key={vein.d}
            className={pathClassName}
            data-strand={index % 5}
            d={vein.d}
            strokeWidth={vein.w}
            pathLength={1}
          />
        ))}
      </g>
    </svg>
  );
}

/* ── Yan dal mührü: parmaklık, kuş, kancalı çapraz ───────────────────────
   Üç katman: (1) kafes ve kuş, (2) mührün kancalı çaprazı, (3) alın bandı.
   Çatlaklar `crackClassName` ile ayrı: kafes kırıldığında çizilirler. */

/** Kafesin parmaklıkları — x konumu ve kemerin altındaki tepe noktası. */
const SEAL_BARS: [number, number][] = [
  [74, 41],
  [86, 34],
  [100, 31],
  [114, 34],
  [126, 41],
];

/** Mühür çatlakları — kafes kırıldığında sırayla çizilir. */
const SEAL_CRACKS = [
  "M100 58 L93 73 L103 85 L97 104",
  "M100 58 L112 49 L107 34",
  "M84 60 L70 67 L59 60 L48 69",
  "M118 62 L133 68 L146 61",
];

export function CageSeal({
  className,
  cageClassName,
  birdClassName,
  markClassName,
  crackClassName,
  bandClassName,
  label,
}: {
  className?: string;
  cageClassName?: string;
  birdClassName?: string;
  markClassName?: string;
  crackClassName?: string;
  bandClassName?: string;
  /** Ekran okuyucuya inen açıklama; boşsa şema tamamen dekoratiftir */
  label?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 150"
      fill="none"
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {/* 1 · Kafes */}
      <g
        className={cageClassName}
        stroke="var(--nej-seal)"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M62 112 L62 66 C 62 44 79 30 100 30 C 121 30 138 44 138 66 L138 112" strokeWidth="2.6" />
        <path d="M54 112 L146 112" strokeWidth="3.4" />
        {SEAL_BARS.map(([x, top]) => (
          <path key={x} d={`M${x} 112 L${x} ${top}`} strokeWidth="1.7" />
        ))}
      </g>

      {/* 2 · Kuş — kafesin içinde, kanadı kapalı */}
      <g className={birdClassName}>
        <path
          d="M91 92 C 90 84 95 77 102 77 C 108 77 112 82 112 88 C 112 94 107 98 100 97 Z"
          fill="var(--nej-seal)"
          fillOpacity="0.85"
        />
        <circle cx="109" cy="74" r="3.6" fill="var(--nej-seal)" />
        <path d="M112 72 L119 74 L112 76 Z" fill="var(--nej-seal)" />
        <path d="M91 92 L79 99 L88 93 Z" fill="var(--nej-seal)" fillOpacity="0.7" />
        <path
          d="M96 84 C 100 82 105 83 108 87"
          stroke="var(--bg)"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* 3 · Mührün kancalı çaprazı — kafesin üstüne basılmış işaret */}
      <g
        className={markClassName}
        stroke="var(--nej-seal)"
        strokeLinecap="square"
        fill="none"
      >
        <path d="M44 58 L156 58" strokeWidth="5" />
        <path d="M44 58 L44 42" strokeWidth="5" />
        <path d="M156 58 L156 76" strokeWidth="5" />
        <path d="M100 22 L100 58" strokeWidth="3.2" />
      </g>

      {/* 4 · Çatlaklar — normalde çizilmemiş, kafes kırıldığında çiziliyor */}
      <g stroke="var(--nej-byaku)" strokeLinecap="round" fill="none">
        {SEAL_CRACKS.map((d, index) => (
          <path
            key={d}
            className={crackClassName}
            data-crack={index}
            d={d}
            strokeWidth="1.4"
            pathLength={1}
          />
        ))}
      </g>

      {/* 5 · Alın bandı — mührün üstünü örten bez ve metal plaka */}
      <g className={bandClassName}>
        <path d="M0 118 L200 118 L200 140 L0 140 Z" fill="var(--surface)" />
        <path
          d="M0 118 L200 118"
          stroke="var(--border-strong)"
          strokeWidth="1.4"
        />
        <path
          d="M0 140 L200 140"
          stroke="var(--border-strong)"
          strokeWidth="1.4"
        />
        <rect
          x="72"
          y="120"
          width="56"
          height="18"
          rx="2"
          fill="var(--surface-hover)"
          stroke="var(--border-strong)"
          strokeWidth="1"
        />
        {/* Konoha plakasının spirali — tek çizgi, sade */}
        <path
          d="M108 129 C 108 125 104 123 100 124 C 95 125 93 130 96 133 C 99 136 105 135 106 131"
          stroke="var(--text-muted)"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M96 133 L88 137"
          stroke="var(--text-muted)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/* ── Mod düğmesinin gliffi ───────────────────────────────────────────────
   Küçük kafes + kuş. Parmaklıkların ortadaki parçası ayrı bir düğüm:
   düğme basılıyken CSS onu iki yana çekiyor. */

export function CageBirdMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g stroke="currentColor" strokeLinecap="round" fill="none">
        <path d="M7 26 L7 13 C 7 8 11 5 16 5 C 21 5 25 8 25 13 L25 26" strokeWidth="1.8" />
        <path d="M4 26 L28 26" strokeWidth="2.2" />
        <path data-bar="left" d="M11.5 26 L11.5 8.6" strokeWidth="1.3" />
        <path data-bar="right" d="M20.5 26 L20.5 8.6" strokeWidth="1.3" />
      </g>
      <circle cx="16" cy="17" r="3.1" fill="currentColor" />
      <path d="M18.6 14.4 L22 15.2 L18.6 16.2 Z" fill="currentColor" />
    </svg>
  );
}

/* ── Sekiz trigram çubukları ─────────────────────────────────────────────
   Trigram bir daire üstünde DEĞİL, üç yatay çubuk olarak çiziliyor: hem
   I Ching'in kendi gösterimi bu, hem de sayfanın parmaklık geometrisiyle
   aynı dili konuşuyor. Sekiz grup = üç bitin sekiz kombinasyonu. */

/** Yukarıdan aşağıya üç çizgi: true = tam, false = kırık. */
export const TRIGRAMS: readonly (readonly [boolean, boolean, boolean])[] = [
  [true, true, true],
  [true, true, false],
  [true, false, true],
  [true, false, false],
  [false, true, true],
  [false, true, false],
  [false, false, true],
  [false, false, false],
];

export function TrigramBars({
  pattern,
  className,
}: {
  pattern: readonly [boolean, boolean, boolean];
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 18"
      fill="currentColor"
      aria-hidden
      focusable="false"
    >
      {pattern.map((solid, row) =>
        solid ? (
          <rect key={row} x="1" y={row * 6 + 1.5} width="22" height="3" rx="0.6" />
        ) : (
          <g key={row}>
            <rect x="1" y={row * 6 + 1.5} width="9" height="3" rx="0.6" />
            <rect x="14" y={row * 6 + 1.5} width="9" height="3" rx="0.6" />
          </g>
        ),
      )}
    </svg>
  );
}

/* ── Altmış dört tenketsu ────────────────────────────────────────────────
   Soyut bir gövde ve üstünde 64 nokta. Noktalar SEKİZ gruba bölünmüş, her
   grupta sekiz nokta: sekiz trigram, altmış dört kapı. Vuruş sırası dizinin
   kendi sırası — göğüs orta hattından başlıyor, başla bitiyor.

   Koordinatlar viewBox 0 0 120 210 içinde. Şema anatomik değil şematik:
   amaç bir insanı çizmek değil, chakra ağının kapılarını göstermek. */

const TENKETSU: readonly (readonly [number, number])[] = [
  /* 1 · göğüs orta hattı */
  [60, 54], [60, 60], [60, 66], [60, 72], [60, 78], [60, 84], [60, 90], [60, 96],
  /* 2 · sol kol */
  [41, 55], [37, 62], [34, 70], [31, 78], [28, 86], [26, 94], [24, 102], [22, 110],
  /* 3 · sağ kol */
  [79, 55], [83, 62], [86, 70], [89, 78], [92, 86], [94, 94], [96, 102], [98, 110],
  /* 4 · omuz ve üst göğüs */
  [48, 55], [72, 55], [44, 63], [76, 63], [50, 70], [70, 70], [46, 77], [74, 77],
  /* 5 · karın */
  [52, 86], [68, 86], [49, 93], [71, 93], [53, 100], [67, 100], [56, 107], [64, 107],
  /* 6 · sol bacak */
  [50, 124], [49, 134], [48, 144], [47, 154], [46, 164], [46, 172], [45, 180], [45, 188],
  /* 7 · sağ bacak */
  [70, 124], [71, 134], [72, 144], [73, 154], [74, 164], [74, 172], [75, 180], [75, 188],
  /* 8 · baş ve boyun */
  [55, 44], [65, 44], [54, 36], [66, 36], [52, 28], [68, 28], [56, 20], [64, 20],
];

/** Bir gruptaki nokta sayısı — sekiz trigramın her biri sekiz kapı. */
export const TENKETSU_GROUP = 8;
/** Şemadaki toplam nokta — dizinin adı da bu sayı. */
export const TENKETSU_TOTAL = TENKETSU.length;

/** Gövdenin dış hattı ve chakra yolları. */
const BODY_OUTLINE = [
  "M38 52 C 44 48 51 46 60 46 C 69 46 76 48 82 52 L 86 96 C 85 111 78 118 60 118 C 42 118 35 111 34 96 Z",
  "M38 52 C 30 59 26 71 24 84 C 22 96 21 105 20 113",
  "M82 52 C 90 59 94 71 96 84 C 98 96 99 105 100 113",
  "M50 117 C 48 135 47 158 46 192",
  "M70 117 C 72 135 73 158 74 192",
  "M55 41 L55 47",
  "M65 41 L65 47",
];

const BODY_PATHS = [
  "M60 47 L60 118",
  "M42 54 C 34 66 28 86 22 110",
  "M78 54 C 86 66 92 86 98 110",
  "M52 118 C 49 140 47 166 45 188",
  "M68 118 C 71 140 73 166 75 188",
  "M60 26 L60 46",
];

export function TenketsuFigure({
  struck,
  second,
  className,
  outlineClassName,
  pathClassName,
  pointClassName,
  label,
}: {
  /** Kaç nokta işaretli (0–64) */
  struck: number;
  /** Kaç nokta İKİNCİ kez vuruldu (0–64) — yalnız 128 kademesinde */
  second: number;
  className?: string;
  outlineClassName?: string;
  pathClassName?: string;
  pointClassName?: string;
  label?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 210"
      fill="none"
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {/* Gövde silueti — dolgu yok, yalnız hat */}
      <g
        className={outlineClassName}
        stroke="var(--nej-vein)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        fill="none"
      >
        {BODY_OUTLINE.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* Chakra yolları — Byakugan'ın gördüğü ağ */}
      <g
        className={pathClassName}
        stroke="var(--nej-vein)"
        strokeLinecap="round"
        strokeWidth="0.7"
        fill="none"
      >
        {BODY_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* Altmış dört kapı */}
      <g>
        {TENKETSU.map(([x, y], index) => (
          <circle
            key={`${x}-${y}-${index}`}
            className={pointClassName}
            data-group={Math.floor(index / TENKETSU_GROUP)}
            data-struck={index < struck ? "true" : undefined}
            data-second={index < second ? "true" : undefined}
            cx={x}
            cy={y}
            r="2.2"
          />
        ))}
      </g>
    </svg>
  );
}
