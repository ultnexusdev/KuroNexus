/**
 * Yamato sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §3.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor — emsal
 * `components/character/itachi/SharinganEyes.tsx`. Renkler yalnızca CSS
 * modülünün deri bloğundaki token'lardan geliyor (`--yam-*`), bu dosyada da
 * tek hex yok.
 *
 * Hareket CSS'te: bileşenler yalnızca `className` alıp geometriyi çiziyor,
 * hangi çizginin ne zaman görüneceğini `data-*` nitelikleri söylüyor. Böylece
 * reduced-motion battaniyesi (modülün sonu) hepsini tek yerden durdurabiliyor.
 *
 * ⚠️ Bu dosyada rastgelelik YOK. Yıllık halkaların "elle çizilmiş" düzensizliği
 * sabit bir sapma tablosundan (`RING_JITTER`) türetiliyor: `Math.random()`
 * sunucu ile istemcide farklı yol üretir ve hidrasyon uyuşmazlığı verirdi.
 *
 * ⚠️ "use client" YOK ama `GrowthRail` (istemci adası) `GrowthTrunk`u
 * çağırıyor — düz JSX olduğu için istemci paketine giriyor, ek bağımlılık
 * getirmiyor. Geri kalan dördü yalnızca sunucuda çiziliyor.
 */

/* ═══════════════════════════════════════════════════════════════════════
   1 · YILLIK HALKALAR — hero zemini
   Bir kütüğün enine kesiti. Öz merkez bilerek kaçık: gerçek bir gövdede
   halkalar eşmerkezli değildir, rüzgârın estiği yöne doğru sıkışır.
   ═══════════════════════════════════════════════════════════════════════ */

/** Dairenin dört yaylı bezier yaklaştırması (Kappa sabiti). */
const KAPPA = 0.5523;

/** Sabit sapma tablosu — halkaların düzensizliği buradan geliyor. */
const RING_JITTER = [1.04, 0.95, 1.06, 0.93, 1.02, 0.97, 1.05, 0.94, 1.01];

/** Halka yarıçapları: dıştan içe daralan, eşit olmayan aralıklar. */
const RING_RADII: [number, number][] = [
  [34, 30],
  [53, 47],
  [74, 66],
  [97, 86],
  [123, 109],
  [151, 134],
  [182, 161],
  [216, 191],
  [253, 224],
  [293, 259],
];

/**
 * Kapalı, dört yaylı bir halka yolu üretir. Her çeyreğin yarıçapı sapma
 * tablosundan farklı bir çarpanla ölçekleniyor, yani halka hafifçe
 * yamuk kapanıyor — pergelle değil elle çizilmiş gibi.
 */
function ringPath(index: number, rx: number, ry: number): string {
  const jitter = (offset: number) =>
    RING_JITTER[(index * 3 + offset) % RING_JITTER.length];
  const top = ry * jitter(0);
  const right = rx * jitter(1);
  const bottom = ry * jitter(2);
  const left = rx * jitter(3);
  const n = (value: number) => value.toFixed(1);

  return [
    `M0 ${n(-top)}`,
    `C${n(right * KAPPA)} ${n(-top)} ${n(right)} ${n(-top * KAPPA)} ${n(right)} 0`,
    `C${n(right)} ${n(bottom * KAPPA)} ${n(right * KAPPA)} ${n(bottom)} 0 ${n(bottom)}`,
    `C${n(-left * KAPPA)} ${n(bottom)} ${n(-left)} ${n(bottom * KAPPA)} ${n(-left)} 0`,
    `C${n(-left)} ${n(-top * KAPPA)} ${n(-left * KAPPA)} ${n(-top)} 0 ${n(-top)}`,
    "Z",
  ].join(" ");
}

/** Özden dışa doğru üç çatlak — kuruyan kütüğün yarıkları. */
const RING_CRACKS = [
  "M2 -6 C 14 -48 8 -104 26 -158 C 34 -196 30 -232 42 -262",
  "M-4 4 C -30 34 -52 76 -66 128 C -78 168 -96 196 -112 226",
  "M6 2 C 46 18 88 30 132 52 C 172 72 208 84 244 96",
];

export function GrainRings({
  className,
  ringClassName,
}: {
  className?: string;
  ringClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 600"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable="false"
    >
      <g
        stroke="var(--yam-grain)"
        strokeWidth="1.4"
        fill="none"
        vectorEffect="non-scaling-stroke"
      >
        {RING_RADII.map(([rx, ry], index) => (
          <path
            key={`${rx}-${ry}`}
            className={ringClassName}
            data-ring={index}
            /* Öz merkez halka sayısıyla birlikte kayıyor: dışa doğru
               sağa-aşağıya sürüklenen bir gövde kesiti */
            transform={`translate(${296 + index * 2.6} ${312 - index * 1.4})`}
            d={ringPath(index, rx, ry)}
          />
        ))}
      </g>
      <g stroke="var(--yam-grain)" strokeWidth="1" fill="none" transform="translate(296 312)">
        {RING_CRACKS.map((crack) => (
          <path key={crack} d={crack} strokeLinecap="round" />
        ))}
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   2 · KÖK YELPAZESİ — sayfanın dibi
   Sayfa boyunca yükselen gövdenin nereden beslendiğini gösteren kapanış
   grafiği. Kapanış bölümünün altında, tamamen dekoratif.
   ═══════════════════════════════════════════════════════════════════════ */

const ROOT_PATHS = [
  { d: "M200 0 C 198 22 190 40 176 58 C 160 78 140 92 118 104", width: 3 },
  { d: "M200 0 C 202 24 210 42 226 60 C 244 80 266 94 288 106", width: 2.6 },
  { d: "M200 6 C 196 30 184 50 164 70 C 142 92 116 106 88 118", width: 2 },
  { d: "M200 6 C 204 32 218 52 240 72 C 262 92 288 106 314 118", width: 1.8 },
  { d: "M200 10 C 199 40 196 66 192 96 C 190 112 188 122 186 132", width: 2.2 },
  { d: "M176 58 C 168 62 156 62 142 58", width: 1.2 },
  { d: "M226 60 C 236 64 248 64 262 60", width: 1.2 },
  { d: "M164 70 C 152 78 142 88 134 100", width: 1 },
  { d: "M240 72 C 252 80 262 90 270 102", width: 1 },
];

export function RootFan({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 140"
      fill="none"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden
      focusable="false"
    >
      <g stroke="var(--yam-bark)" strokeLinecap="round" fill="none">
        {ROOT_PATHS.map((root) => (
          <path key={root.d} d={root.d} strokeWidth={root.width} />
        ))}
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   3 · DAL ÇIKINTISI — her bölüm başlığının gövdeye bağlandığı yer
   Sayfanın omurgası bir gövde; bölümler onun dalları. Bu grafik o bağın
   kendisi: soldaki gövdeden çıkıp başlığa uzanan kısa bir dal.
   ═══════════════════════════════════════════════════════════════════════ */

export function BranchStub({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 28"
      fill="none"
      preserveAspectRatio="xMinYMid meet"
      aria-hidden
      focusable="false"
    >
      <path
        d="M0 22 C 12 21 20 17 28 12 C 38 6 48 4 60 4"
        stroke="var(--yam-bark)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M28 12 C 30 8 30 4 28 0"
        stroke="var(--yam-bark)"
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="60" cy="4" r="2.2" fill="var(--yam-leaf)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   4 · FİLİZ — mod düğmesinin gliffi
   ═══════════════════════════════════════════════════════════════════════ */

export function Sprout({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M16 29 C 16 24 15 20 16 15 C 16.6 11 16 8 16 5"
        stroke="var(--yam-bark)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M16 16 C 11 16 7 13 5.5 8 C 11 7 15 10 16 16 Z"
        fill="var(--yam-leaf)"
      />
      <path
        d="M16 12 C 20.5 12 24 9.4 25.5 5 C 20.6 4.2 17 7 16 12 Z"
        fill="var(--yam-leaf)"
        fillOpacity="0.66"
      />
      <ellipse cx="16" cy="29.4" rx="5.4" ry="2.2" fill="var(--yam-bark)" fillOpacity="0.4" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   5 · BÜYÜME GÖVDESİ — sayfanın kalbi
   viewBox 120 × 300. Toprak çizgisi y = 286. Beş boğum yukarı doğru
   45 birim aralıkla diziliyor: y = 272, 227, 182, 137, 92.

   ⚠️ Bu sayılar CSS'teki `.node[data-node]` yüzdeleriyle EŞLEŞMEK ZORUNDA
   (272/300 = %90,67 … 92/300 = %30,67). Düğme HTML tarafında, çünkü gerçek
   bir <button> olmalı ve 44 pikselik dokunma alanını taşımalı; SVG yalnızca
   gövdeyi çiziyor. İkisini birbirine bağlayan şey kabın `aspect-ratio`su.
   ═══════════════════════════════════════════════════════════════════════ */

/** Boğumların viewBox içindeki y değerleri — CSS yüzdelerinin kaynağı. */
export const TRUNK_NODES = [272, 227, 182, 137, 92] as const;

/** Gövde boğumları: her kademe bir parça daha çiziyor. */
const TRUNK_SEGMENTS = [
  { step: 0, d: "M60 286 C 58.6 281 61.4 277 60 272", width: 5.8 },
  { step: 1, d: "M60 272 C 62.6 258 56.8 242 60 227", width: 5.2 },
  { step: 2, d: "M60 227 C 56.4 213 63.4 197 60 182", width: 4.5 },
  { step: 3, d: "M60 182 C 63.6 168 57.4 151 60 137", width: 3.8 },
  {
    step: 4,
    d: "M60 137 C 56.6 122 62.8 104 60 92 C 58.6 78 61.4 68 60 56",
    width: 3.1,
  },
];

/** Dallar — kademe yükseldikçe çoğalıyor. */
const BRANCHES = [
  { step: 1, d: "M60 252 C 50 249 43 244 36 236", width: 2.2 },
  { step: 1, d: "M60 244 C 70 242 77 237 84 230", width: 2 },
  { step: 2, d: "M60 210 C 49 207 42 201 34 192", width: 2 },
  { step: 2, d: "M60 200 C 71 198 79 192 87 184", width: 1.9 },
  { step: 3, d: "M60 166 C 48 163 41 156 33 147", width: 1.8 },
  { step: 3, d: "M60 156 C 72 154 80 147 88 139", width: 1.7 },
  { step: 3, d: "M60 148 C 52 144 47 138 43 130", width: 1.3 },
  { step: 4, d: "M60 124 C 47 121 39 113 31 103", width: 1.7 },
  { step: 4, d: "M60 114 C 73 112 82 104 90 94", width: 1.6 },
  { step: 4, d: "M60 104 C 50 100 44 93 39 84", width: 1.3 },
  { step: 4, d: "M60 96 C 70 93 77 86 82 78", width: 1.2 },
  { step: 4, d: "M60 84 C 52 81 47 75 44 68", width: 1.1 },
  { step: 4, d: "M60 74 C 68 71 73 65 76 58", width: 1 },
];

/** Kökler — toprağın altı da büyüyor, ama sessizce. */
const ROOTS = [
  { step: 0, d: "M60 286 C 57 291 53 293 48 295", width: 1.8 },
  { step: 0, d: "M60 286 C 63 291 67 293 72 295", width: 1.6 },
  { step: 1, d: "M60 288 C 52 292 45 294 37 297", width: 1.5 },
  { step: 1, d: "M60 288 C 68 292 75 294 83 297", width: 1.4 },
  { step: 2, d: "M60 289 C 49 292 38 295 26 298", width: 1.2 },
  { step: 3, d: "M60 289 C 71 292 82 295 94 298", width: 1.2 },
  { step: 4, d: "M60 290 C 44 293 29 296 12 299", width: 1 },
  { step: 4, d: "M60 290 C 76 293 91 296 108 299", width: 1 },
];

/**
 * Kademelerin yapıları. Her biri gövdenin dibinde beliriyor; kademe
 * geçildiğinde silinmiyor, arkada soluk bir iz olarak kalıyor — "büyüyen
 * yapı" fikri birikimli olmasaydı sadece bir slayt gösterisi olurdu.
 */
const STRUCTURES: { shape: number; parts: { d: string; width?: number; fill?: boolean }[] }[] = [
  {
    /* 0 — tohum: toprakta bir çekirdek, üstünde iki çenek yaprağı */
    shape: 0,
    parts: [
      { d: "M53 290 C 53 286.4 56.2 284 60 284 C 63.8 284 67 286.4 67 290 C 67 293.6 63.8 296 60 296 C 56.2 296 53 293.6 53 290 Z", fill: true },
      { d: "M60 276 C 52 274 47.4 269 46 262 C 53 261.4 58.6 267 60 276 Z", fill: true },
      { d: "M60 274 C 68 272.4 72.6 267.6 74 261 C 67 260.4 61.4 265.6 60 274 Z", fill: true },
    ],
  },
  {
    /* 1 — dört sütun ve üstlerindeki hatıl */
    shape: 1,
    parts: [
      { d: "M24 286 C 23.4 268 24.6 250 24 232", width: 3.4 },
      { d: "M44 286 C 44.6 268 43.4 250 44 232", width: 3.4 },
      { d: "M76 286 C 75.4 268 76.6 250 76 232", width: 3.4 },
      { d: "M96 286 C 96.6 268 95.4 250 96 232", width: 3.4 },
      { d: "M19 232 C 46 230.6 74 230.6 101 232", width: 2.4 },
      { d: "M19 286 C 46 285 74 285 101 286", width: 1.4 },
    ],
  },
  {
    /* 2 — kubbe: sütunlar tepeden birbirine bağlanınca oda kapanıyor */
    shape: 2,
    parts: [
      { d: "M18 286 C 18 214 36 192 60 192 C 84 192 102 214 102 286", width: 3 },
      { d: "M32 286 C 32 226 44 208 60 208 C 76 208 88 226 88 286", width: 1.5 },
      { d: "M18 250 C 32 244 46 241 60 241 C 74 241 88 244 102 250", width: 1.2 },
      { d: "M24 286 C 24 275 22 268 18 262", width: 1.1 },
      { d: "M96 286 C 96 275 98 268 102 262", width: 1.1 },
    ],
  },
  {
    /* 3 — ev: aynı iskelet, duvarında pencere ve kapı */
    shape: 3,
    parts: [
      { d: "M28 286 C 27.4 264 28.6 240 28 216", width: 3 },
      { d: "M92 286 C 92.6 264 91.4 240 92 216", width: 3 },
      { d: "M18 216 C 32 205 46 193 60 182 C 74 193 88 205 102 216", width: 3 },
      { d: "M22 216 C 46 214.6 74 214.6 98 216", width: 1.6 },
      { d: "M51 286 C 51 272 51 258 51.5 250 C 57 249 63 249 68.5 250 C 69 258 69 272 69 286", width: 1.8 },
      { d: "M35 232 L48 232 L48 245 L35 245 Z M41.5 232 L41.5 245 M35 238.5 L48 238.5", width: 1.2 },
      { d: "M72 232 L85 232 L85 245 L72 245 Z M78.5 232 L78.5 245 M72 238.5 L85 238.5", width: 1.2 },
      { d: "M28 286 C 46 285 74 285 92 286", width: 1.2 },
    ],
  },
  {
    /* 4 — orman: yapı biter, arazi başlar */
    shape: 4,
    parts: [
      { d: "M14 286 C 13.4 262 14.6 234 14 208", width: 2.4 },
      { d: "M34 286 C 34.6 258 33.4 226 34 196", width: 2 },
      { d: "M86 286 C 85.4 258 86.6 226 86 200", width: 2 },
      { d: "M106 286 C 106.6 262 105.4 234 106 212", width: 2.4 },
      { d: "M14 208 C 4 204 0 192 6 182 C 12 172 24 174 26 184 C 30 194 24 208 14 208 Z", width: 1.4 },
      { d: "M34 196 C 24 191 21 178 28 169 C 35 160 46 164 47 174 C 50 185 44 197 34 196 Z", width: 1.4 },
      { d: "M86 200 C 76 195 73 182 80 173 C 87 164 98 168 99 178 C 102 189 96 201 86 200 Z", width: 1.4 },
      { d: "M106 212 C 98 208 95 197 101 189 C 107 181 116 184 117 192 C 120 201 115 213 106 212 Z", width: 1.4 },
      { d: "M14 236 C 24 232 32 228 34 222", width: 1 },
      { d: "M106 240 C 96 236 89 232 86 226", width: 1 },
    ],
  },
];

/** Toprak çizgisi — düz değil, hafif dalgalı. */
const GROUND = "M2 286 C 22 284.6 42 287.4 60 286 C 78 284.6 98 287.4 118 286";

export function GrowthTrunk({
  stage,
  title,
  className,
  groundClassName,
  segmentClassName,
  branchClassName,
  rootClassName,
  structureClassName,
}: {
  /** 0 tabanlı kademe sırası */
  stage: number;
  /** Ekran okuyucuya inen açıklama; boşsa şema tamamen dekoratiftir */
  title?: string;
  className?: string;
  groundClassName?: string;
  segmentClassName?: string;
  branchClassName?: string;
  rootClassName?: string;
  structureClassName?: string;
}) {
  const at = Math.min(Math.max(stage, 0), TRUNK_NODES.length - 1);

  return (
    <svg
      className={className}
      viewBox="0 0 120 300"
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {/* Toprak */}
      <path
        className={groundClassName}
        d={GROUND}
        stroke="var(--yam-bark)"
        strokeOpacity="0.5"
        strokeWidth="1"
        fill="none"
      />

      {/* Kademelerin yapıları — geçmiş olanlar soluk iz olarak kalıyor */}
      {STRUCTURES.map((structure) => (
        <g
          key={structure.shape}
          className={structureClassName}
          data-shape={structure.shape}
          data-state={
            structure.shape === at
              ? "now"
              : structure.shape < at
                ? "past"
                : "next"
          }
        >
          {structure.parts.map((part) =>
            part.fill ? (
              <path key={part.d} d={part.d} fill="var(--yam-sap)" />
            ) : (
              <path
                key={part.d}
                d={part.d}
                stroke="var(--yam-bark)"
                strokeWidth={part.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ),
          )}
        </g>
      ))}

      {/* Kökler */}
      <g strokeLinecap="round" fill="none" stroke="var(--yam-bark)">
        {ROOTS.map((root) => (
          <path
            key={root.d}
            className={rootClassName}
            data-step={root.step}
            data-on={at >= root.step ? "true" : undefined}
            d={root.d}
            strokeWidth={root.width}
            pathLength={1}
          />
        ))}
      </g>

      {/* Dallar */}
      <g strokeLinecap="round" fill="none" stroke="var(--yam-bark)">
        {BRANCHES.map((branch) => (
          <path
            key={branch.d}
            className={branchClassName}
            data-step={branch.step}
            data-on={at >= branch.step ? "true" : undefined}
            d={branch.d}
            strokeWidth={branch.width}
            pathLength={1}
          />
        ))}
      </g>

      {/* Gövde — sayfanın tek yazılmış hareketi: kademe değişince ÇİZİLİR */}
      <g strokeLinecap="round" fill="none">
        {TRUNK_SEGMENTS.map((segment) => (
          <path
            key={segment.step}
            className={segmentClassName}
            data-step={segment.step}
            data-on={at >= segment.step ? "true" : undefined}
            d={segment.d}
            stroke="var(--yam-bark)"
            strokeWidth={segment.width}
            pathLength={1}
          />
        ))}
      </g>
    </svg>
  );
}
