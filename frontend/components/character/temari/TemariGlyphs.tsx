/**
 * Temari sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §3.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor — emsal
 * `components/character/itachi/SharinganEyes.tsx`. Renkler yalnızca
 * token'dan geliyor (`--tem-*`, modülün deri bloğu); bu dosyada tek hex yok.
 *
 * ── YAYIN GEOMETRİSİ (yelpazenin nasıl açıldığı) ─────────────────────────
 * Yelpazenin ekseni (perçin) kullanıcı uzayının TAM MERKEZİNDE, (0, 0)'da.
 * Kaburgalar oradan yukarı çıkıyor; her parça yalnızca bir `rotate()` ile
 * yerine oturuyor. Yani "açılma" tek bir açı değişimi:
 *
 *   kademe 1 → yarı açı 24°   kademe 2 → 48°   kademe 3 → 72°
 *
 * Kumaş altı SABİT genişlikte (24°) dilimden oluşuyor. Yay daraldığında
 * dilimler üst üste biniyor — gerçek bir yelpazenin katlanması da tam olarak
 * bu. Böylece "kapanma" ayrı bir çizim değil, aynı geometrinin daha küçük
 * açısı.
 *
 * ⚠️ `transform-origin` CSS'te AÇIKÇA yazılı (`transform-box: view-box` +
 * piksel değeri, bkz. modül). SVG'de bu değerin varsayılanı tarayıcıya göre
 * değişiyor ve yanlış eksende dönen bir yelpaze kadrajın dışına fırlıyor —
 * eksen tahmine bırakılmadı. Dönüş açıları burada `transform` niteliği
 * olarak yazılıyor; nitelik CSS `transform` özelliğine eşlendiği için
 * geçişler (transition) doğrudan üstünde çalışıyor.
 */

/* ── Ortak ölçüler ──────────────────────────────────────────────────────── */

/** Perçin (0,0) merkezde; üst boşluk rüzgâr kesikleri için ayrıldı. */
const FAN_VIEWBOX = "-190 -230 380 288";

/** Bir kumaş diliminin gövdesi: 24° genişlik, iç 34, dış 180 birim. */
const SEGMENT_PATH =
  "M -7.07 -33.26 L -37.42 -176.07 A 180 180 0 0 1 37.42 -176.07 " +
  "L 7.07 -33.26 A 34 34 0 0 0 -7.07 -33.26 Z";

/** Yayın tam açık yarı açısı. Kademeler bunun 1/3, 2/3 ve tamamı. */
const FULL_HALF = 72;

/** Bir dilimin yarı genişliği — kumaş parçası SABİT, yalnızca yeri değişir. */
const SEGMENT_HALF = 12;

/** Yedi kaburga: tam açıkken -72° … +72°, aralarında 24°. */
const RIBS = [-72, -48, -24, 0, 24, 48, 72];

/**
 * Altı dilimin merkezleri. En dıştaki iki dilimin DIŞ KENARI her kademede
 * tam olarak uç kaburgalara oturuyor (`±half`), aradakiler eşit dağılıyor:
 * yay daraldıkça dilimler birbirinin üstüne biniyor ama kumaş hiçbir zaman
 * kaburganın dışına taşmıyor. Tam açıkken sonuç -60° … +60°, yani altı
 * dilim yayı boşluksuz döşüyor.
 */
function segmentAngles(half: number): number[] {
  const first = -half + SEGMENT_HALF;
  const step = (2 * (half - SEGMENT_HALF)) / 5;
  return [0, 1, 2, 3, 4, 5].map((index) => first + index * step);
}

const FULL_SEGMENTS = segmentAngles(FULL_HALF);

/**
 * Üç yıldız (hoshi). Açı DEĞİL oran tutuluyor: yay daraldıkça yıldızlar da
 * yayla birlikte toplanıyor, yani her zaman kumaşın üstünde kalıyorlar.
 */
const STARS = [-0.66, 0, 0.66];
const STAR_RADIUS = 118;

/**
 * Rüzgâr kesikleri — yelpazenin dışında, kademe sayısı kadarı çiziliyor.
 * Yaylar dıştan içe DEĞİL, içten dışa açılıyor: birinci kademede yalnızca
 * en dar ve en yakın olan var.
 */
const CUTS = [
  "M -108.5 -160.8 A 194 194 0 0 1 108.5 -160.8",
  "M -137.8 -153.1 A 206 206 0 0 1 137.8 -153.1",
  "M -167.0 -140.1 A 218 218 0 0 1 167.0 -140.1",
];

/* ── Açılan yelpaze — sayfanın kalbi ────────────────────────────────────── */

export function WarFan({
  stars,
  className,
  segmentClassName,
  ribClassName,
  starClassName,
  cutClassName,
  title,
}: {
  /** 1, 2 veya 3 — görünen yıldız sayısı, yayın genişliğini de bu belirler */
  stars: 1 | 2 | 3;
  className?: string;
  segmentClassName?: string;
  ribClassName?: string;
  starClassName?: string;
  cutClassName?: string;
  /** Ekran okuyucuya inen açıklama; boşsa şema tamamen dekoratiftir */
  title?: string;
}) {
  const spread = stars / 3;

  return (
    <svg
      className={className}
      viewBox={FAN_VIEWBOX}
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {/* Rüzgâr kesikleri: kademe sayısı kadarı çizilir. `pathLength=1` ile
          kesikler açılırken ÇİZİLİYOR (bkz. modüldeki .fanCut). */}
      <g
        strokeLinecap="round"
        stroke="var(--tem-wind)"
        strokeOpacity="0.55"
        fill="none"
      >
        {CUTS.map((d, index) => (
          <path
            key={d}
            className={cutClassName}
            data-cut={index + 1}
            data-on={stars > index ? "true" : undefined}
            d={d}
            strokeWidth={2.4 - index * 0.5}
            pathLength={1}
          />
        ))}
      </g>

      {/* Kumaş: altı dilim. Tek/çift dilimin dolgusu bir tık farklı —
          üst üste bindiklerinde kat çizgileri okunsun diye. */}
      <g>
        {FULL_SEGMENTS.map((base, index) => (
          <path
            key={base}
            className={segmentClassName}
            data-pleat={index % 2 === 0 ? "a" : "b"}
            d={SEGMENT_PATH}
            transform={`rotate(${(base * spread).toFixed(2)})`}
          />
        ))}
      </g>

      {/* Kaburgalar: demir çıtalar ve uçlarındaki topuzlar.
          Boya niteliklerde, CSS'te DEĞİL: kökteki `fill="none"` miras yoluyla
          iniyor ve topuzu görünmez bırakırdı. */}
      <g>
        {RIBS.map((base) => (
          <g
            key={base}
            className={ribClassName}
            transform={`rotate(${(base * spread).toFixed(2)})`}
          >
            <path
              d="M 0 -28 L 0 -182"
              stroke="var(--tem-moon)"
              strokeOpacity="0.55"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <circle
              cx="0"
              cy="-184"
              r="3.4"
              fill="var(--tem-moon)"
              fillOpacity="0.75"
            />
          </g>
        ))}
      </g>

      {/* Üç yıldız. Dönüş + öteleme + ölçek TEK nitelikte: geçiş bütün
          zinciri birden yumuşatıyor, yıldız hem yayla açılıyor hem büyüyor. */}
      <g>
        {STARS.map((fraction, index) => {
          const on = stars > index;
          const angle = (fraction * 72 * spread).toFixed(2);
          const scale = on ? 1 : 0.3;
          return (
            <g
              key={fraction}
              className={starClassName}
              data-star={index + 1}
              data-on={on ? "true" : undefined}
              transform={`rotate(${angle}) translate(0 ${-STAR_RADIUS}) scale(${scale})`}
            >
              <circle cx="0" cy="0" r="13" fill="var(--tem-fan)" />
              <circle
                cx="0"
                cy="0"
                r="17.5"
                fill="none"
                stroke="var(--tem-fan)"
                strokeOpacity="0.45"
                strokeWidth="1.4"
              />
            </g>
          );
        })}
      </g>

      {/* Perçin ve sap — yayın döndüğü nokta, kadranın merkezi */}
      <g>
        <path
          d="M 0 4 L 0 42"
          stroke="var(--tem-moon)"
          strokeOpacity="0.35"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <circle cx="0" cy="0" r="10.5" fill="var(--tem-moon)" fillOpacity="0.5" />
        <circle cx="0" cy="0" r="4.5" fill="var(--bg)" />
      </g>
    </svg>
  );
}

/* ── Hero'daki dev siluet ───────────────────────────────────────────────── */

/**
 * Tam açık yelpazenin çizgi silueti. Kalbin şemasıyla AYNI geometriden
 * çiziliyor (aynı dilim yolu, aynı açılar) — hero'daki gölge ile aşağıdaki
 * şema aynı nesne olsun diye. Yıldız yok: siluet henüz bir karar değil.
 */
export function FanSilhouette({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={FAN_VIEWBOX}
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g
        stroke="var(--tem-moon)"
        strokeWidth="1.1"
        fill="var(--tem-moon)"
        fillOpacity="0.04"
      >
        {FULL_SEGMENTS.map((base) => (
          <path key={base} d={SEGMENT_PATH} transform={`rotate(${base})`} />
        ))}
      </g>
      <g stroke="var(--tem-moon)" strokeWidth="2" strokeLinecap="round">
        {RIBS.map((base) => (
          <path
            key={base}
            d="M 0 -28 L 0 -182"
            transform={`rotate(${base})`}
          />
        ))}
      </g>
      <circle cx="0" cy="0" r="10.5" fill="var(--tem-moon)" fillOpacity="0.18" />
    </svg>
  );
}

/* ── Mod düğmesinin glifi: kesen rüzgâr ─────────────────────────────────── */

export function WindGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g
        stroke="var(--tem-wind)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M2 8 H16 a3.2 3.2 0 1 0 -3.2 -3.2" />
        <path d="M2 14 H20 a3.6 3.6 0 1 1 -3.6 3.6" />
        <path d="M4 20 H13" />
      </g>
    </svg>
  );
}

/* ── Hero'da savrulan kum ────────────────────────────────────────────────
   On iki yatay şerit, hafif eğimli ve farklı kalınlıkta. Sürüklenme
   CSS'te (`.gustLine`), hepsi ayrı hızda — kum tek parça hâlinde
   kaymasın diye. */

const GUST_LINES: { d: string; width: number; band: number }[] = [
  { d: "M -40 46 C 220 38 420 52 760 40 C 980 32 1120 44 1260 36", width: 1.6, band: 1 },
  { d: "M -40 92 C 180 86 360 96 700 88", width: 1, band: 2 },
  { d: "M -40 128 C 300 118 560 134 900 120 C 1060 113 1180 124 1260 118", width: 2.2, band: 3 },
  { d: "M -40 168 C 160 164 300 172 520 166", width: 1, band: 1 },
  { d: "M -40 206 C 260 198 520 212 840 200 C 1020 193 1160 204 1260 198", width: 1.4, band: 2 },
  { d: "M -40 244 C 140 240 260 248 460 242", width: 0.9, band: 3 },
  { d: "M -40 282 C 300 274 620 288 960 276 C 1100 271 1200 280 1260 276", width: 2.6, band: 1 },
  { d: "M -40 318 C 200 314 380 322 660 314", width: 1.2, band: 2 },
  { d: "M -40 352 C 260 344 500 356 820 346", width: 1.6, band: 3 },
  { d: "M -40 386 C 120 384 240 390 420 384", width: 0.8, band: 1 },
  { d: "M -40 414 C 320 406 640 418 980 408 C 1120 404 1210 410 1260 408", width: 1.8, band: 2 },
  { d: "M -40 446 C 180 442 340 450 600 444", width: 1, band: 3 },
];

/** Kum taneleri — şeritlerin arasına serpilmiş, kaymayan noktalar. */
const GRAINS = [
  [96, 64], [318, 110], [534, 78], [742, 148], [908, 96], [1124, 132],
  [178, 224], [402, 262], [618, 196], [846, 268], [1042, 232],
  [128, 336], [352, 398], [576, 362], [788, 424], [996, 372], [1186, 340],
];

export function GustField({
  className,
  lineClassName,
}: {
  className?: string;
  lineClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 1220 480"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g stroke="var(--tem-wind)" strokeLinecap="round" fill="none">
        {GUST_LINES.map((line) => (
          <path
            key={line.d}
            className={lineClassName}
            data-band={line.band}
            d={line.d}
            strokeWidth={line.width}
            strokeOpacity={0.1 + line.width * 0.06}
          />
        ))}
      </g>
      <g fill="var(--tem-moon)" fillOpacity="0.16">
        {GRAINS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" />
        ))}
      </g>
    </svg>
  );
}
