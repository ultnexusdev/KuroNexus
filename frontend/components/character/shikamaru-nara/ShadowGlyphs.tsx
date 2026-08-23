/**
 * Shikamaru sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §3.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor —
 * emsal `components/character/itachi/SharinganEyes.tsx`. Renkler yalnızca
 * token'dan geliyor (`--shk-*`, globals.css), bu dosyada da tek hex yok.
 *
 * Hareket CSS'te: bileşenler yalnızca `className` alıp geometriyi çiziyor,
 * hangi çizginin ne zaman görüneceğini `data-*` nitelikleri söylüyor.
 * Böylece reduced-motion battaniyesi (modülün sonu) hepsini tek yerden
 * durdurabiliyor.
 *
 * ⚠️ Bu dosyada "use client" YOK ama `MoveChain` (istemci adası) onu
 * çağırıyor — düz JSX olduğu için istemci paketine giriyor, ek bağımlılık
 * getirmiyor. Sunucu tarafında da (hero dumanı) aynı bileşen kullanılıyor.
 */

/** Shogi taşının silueti — dar tepe, geniş taban (koma). */
const KOMA_PATH = "M0 -4.4 L3 -2.3 L3.7 4.2 L-3.7 4.2 L-3 -2.3 Z";

/* ── Hero: yükselen duman ────────────────────────────────────────────────
   Dört ayrı eğri; kalınlık ve opaklık farkı derinlik veriyor. Kaynak
   noktası kordur (sağ alt) — sayfanın tek sıcak noktası. */

export function SmokePlume({
  className,
  pathClassName,
}: {
  className?: string;
  pathClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 420"
      fill="none"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
      focusable="false"
    >
      <g
        stroke="var(--shk-smoke)"
        strokeLinecap="round"
        fill="none"
        vectorEffect="non-scaling-stroke"
      >
        <path
          className={pathClassName}
          data-strand="1"
          strokeWidth="1.6"
          d="M80 414 C 80 372 66 352 70 322 C 74 292 96 276 92 244 C 88 212 62 196 68 160 C 73 128 98 112 94 78 C 91 52 78 36 80 8"
        />
        <path
          className={pathClassName}
          data-strand="2"
          strokeWidth="2.6"
          d="M80 414 C 82 380 94 362 90 336 C 86 308 66 292 72 262 C 78 232 100 218 96 190 C 92 162 74 148 78 118"
        />
        <path
          className={pathClassName}
          data-strand="3"
          strokeWidth="1"
          d="M80 414 C 76 386 60 372 64 348 C 68 322 88 310 84 288 C 80 264 62 254 66 230"
        />
        <path
          className={pathClassName}
          data-strand="4"
          strokeWidth="0.8"
          d="M80 414 C 88 384 104 370 100 344 C 96 316 76 300 82 274 C 87 252 104 242 102 220 C 100 198 88 188 90 166"
        />
      </g>
    </svg>
  );
}

/* ── Mod düğmesinin gliffi: bağlanmış iki gölge ─────────────────────────── */

export function ShadowKnot({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <circle cx="8" cy="9" r="3.4" fill="var(--shk-piece)" />
      <circle cx="24" cy="23" r="3.4" fill="var(--shk-piece)" />
      <path
        d="M8 12.4 C 8 20 14 20 16 22 C 18 24 20 23 24 19.6"
        stroke="var(--shk-shadow)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M8 12.4 C 8 20 14 20 16 22 C 18 24 20 23 24 19.6"
        stroke="var(--shk-tether)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* ── Hamle zincirinin tahtası ────────────────────────────────────────────
   9×9 kare, 10 birimlik hücre. Bir karenin merkezi: (sütun*10+5, satır*10+5).
   Satır 0 karşı tarafın kenarı, satır 8 Shikamaru'nun kenarı. */

const CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
/** Shogi tahtasının yıldız noktaları (3-3 kesişimleri) */
const STAR_POINTS = [
  [30, 30],
  [60, 30],
  [30, 60],
  [60, 60],
];

/** Gölge bağının beş kademesi — her hamlede bir kademe daha çizilir. */
const STRANDS: { step: number; d: string; width: number }[] = [
  { step: 0, d: "M45 89 C 44 84 46 80 45 74", width: 2.6 },
  { step: 1, d: "M45 74 C 46.4 69 43.4 65 45 60", width: 2.4 },
  { step: 2, d: "M45 60 C 46.6 54 42.6 47 45 38 C 45.6 32 44.4 26 45 20.4", width: 2.2 },
  { step: 3, d: "M45 41 C 55 40.4 64 37 72.5 30", width: 1.9 },
  { step: 3, d: "M45 41 C 35 43 27.5 39 19.5 31.5", width: 1.9 },
  { step: 4, d: "M72.5 30 C 65 24 56 18.6 48.6 16.4", width: 1.6 },
  { step: 4, d: "M19.5 31.5 C 27 25 35.5 19 41.6 16.4", width: 1.6 },
];

/** Ormandaki yanıcı etiketler — dördüncü hamlede tutuşur. */
const TAG_MARKS = [
  [62, 36],
  [71, 29],
  [78, 22],
  [28, 38],
  [21, 31],
  [14, 24],
];

export function ShadowBoard({
  move,
  className,
  gridClassName,
  strandClassName,
  pieceClassName,
  emberClassName,
  title,
}: {
  /** 0 tabanlı hamle sırası */
  move: number;
  className?: string;
  gridClassName?: string;
  strandClassName?: string;
  pieceClassName?: string;
  emberClassName?: string;
  /** Ekran okuyucuya inen açıklama; boşsa şema tamamen dekoratiftir */
  title?: string;
}) {
  /* Taşın karesi veriden değil buradan gelmiyor: koordinatlar veri
     dosyasında (SHIKAMARU_MOVES[].piece) — çağıran onu prop olarak
     geçirmek yerine sıra numarasını veriyor, tablo burada sabit kalsın
     diye. İkisini ayrı tutmanın sebebi: metin küratör tarafından
     değişebilir, şemanın geometrisi değişmemeli. */
  const piece = [
    { x: 45, y: 75 },
    { x: 45, y: 65 },
    { x: 45, y: 55 },
    { x: 55, y: 45 },
    { x: 45, y: 35 },
  ][Math.min(Math.max(move, 0), 4)];

  const ritual = move === 1 || move === 2;
  const cursed = move === 1;
  const broken = move >= 3;
  const buried = move >= 4;

  return (
    <svg
      className={className}
      viewBox="-2 -2 94 96"
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {/* Tahta zemini */}
      {/* Opaklık `fill-opacity` ile: sunum niteliğinde color-mix() yazmak
          eski tarayıcılarda sessizce düşerdi, token + opaklık her yerde
          aynı sonucu veriyor */}
      <rect
        x="0"
        y="0"
        width="90"
        height="90"
        fill="var(--shk-board)"
        fillOpacity="0.22"
        stroke="var(--shk-piece)"
        strokeOpacity="0.34"
        strokeWidth="0.7"
      />

      <g className={gridClassName} stroke="var(--shk-grid)" strokeWidth="0.4">
        {CELLS.slice(1).map((index) => (
          <line key={`v${index}`} x1={index * 10} y1="0" x2={index * 10} y2="90" />
        ))}
        {CELLS.slice(1).map((index) => (
          <line key={`h${index}`} x1="0" y1={index * 10} x2="90" y2={index * 10} />
        ))}
      </g>
      <g fill="var(--shk-piece)" fillOpacity="0.45">
        {STAR_POINTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" />
        ))}
      </g>

      {/* Çukur — beşinci hamlede kapanan toprak */}
      <rect
        className={emberClassName}
        data-part="pit"
        data-on={buried ? "true" : undefined}
        x="40"
        y="10"
        width="10"
        height="10"
        fill="var(--shk-shadow)"
      />

      {/* Yanıcı etiketler */}
      <g
        className={emberClassName}
        data-part="tags"
        data-on={move >= 3 ? "true" : undefined}
        fill="var(--shk-ember)"
      >
        {TAG_MARKS.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x - 1.1} y={y - 1.6} width="2.2" height="3.2" rx="0.4" />
        ))}
      </g>

      {/* Tören dairesi — kanın bağladığı kare */}
      <circle
        className={emberClassName}
        data-part="ritual"
        data-on={ritual ? "true" : undefined}
        cx="45"
        cy="15"
        r="7.4"
        stroke="var(--shk-ember)"
        strokeWidth="0.7"
        strokeDasharray={move === 2 ? "3 3" : undefined}
        fill="none"
      />

      {/* Lanet ipliği: Hidan'dan Shikamaru'ya — üçüncü hamlede kopar */}
      <path
        className={emberClassName}
        data-part="curse"
        data-on={cursed ? "true" : undefined}
        d="M45 22.6 C 46.6 36 43.4 50 45 60.6"
        stroke="var(--shk-ember)"
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
      />

      {/* Gölge bağı — kalın siyah gövde, üstünde ince ışık kenarı */}
      <g strokeLinecap="round" fill="none">
        {STRANDS.map((strand, index) => (
          <g key={`${strand.step}-${index}`}>
            <path
              className={strandClassName}
              data-step={strand.step}
              data-on={move >= strand.step ? "true" : undefined}
              d={strand.d}
              stroke="var(--shk-shadow)"
              strokeWidth={strand.width}
              pathLength={1}
            />
            <path
              className={strandClassName}
              data-step={strand.step}
              data-on={move >= strand.step ? "true" : undefined}
              d={strand.d}
              stroke="var(--shk-tether)"
              strokeWidth={strand.width * 0.35}
              pathLength={1}
            />
          </g>
        ))}
      </g>

      {/* Karşı taraf: Hidan sabit, Kakuzu ikinci hamleden itibaren tahtanın dışında */}
      <g
        className={pieceClassName}
        data-side="enemy"
        data-state={buried ? "buried" : broken ? "broken" : undefined}
        transform="translate(45 15) rotate(180)"
      >
        <path d={KOMA_PATH} fill="var(--shk-board)" stroke="var(--shk-piece)" strokeWidth="0.5" />
      </g>
      <g
        className={pieceClassName}
        data-side="enemy"
        data-away={move >= 1 ? "true" : undefined}
        transform="translate(65 15) rotate(180)"
      >
        <path d={KOMA_PATH} fill="var(--shk-board)" stroke="var(--shk-piece)" strokeWidth="0.5" />
      </g>

      {/* Shikamaru'nun taşı — hamleyle birlikte ilerler */}
      <g
        className={pieceClassName}
        data-side="ally"
        transform={`translate(${piece.x} ${piece.y})`}
      >
        <path d={KOMA_PATH} fill="var(--shk-piece)" />
      </g>
    </svg>
  );
}
