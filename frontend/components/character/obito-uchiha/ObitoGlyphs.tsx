/**
 * Obito sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §4.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor — emsal
 * `components/character/itachi/SharinganEyes.tsx`. Renkler yalnızca
 * token'dan geliyor (`--obi-*`, modülün başındaki deri bloğu); bu dosyada
 * da tek hex yok.
 *
 * ── GEOMETRİ NEDEN KODDA ÜRETİLİYOR ──────────────────────────────────────
 * Spiral, kare spiral ve moloz alanı elle yazılmış path dizeleri yerine
 * saf fonksiyonlarla üretiliyor. Üçü de DETERMİNİST: `Math.random` yok,
 * girdi yok, modül yüklenirken bir kez hesaplanıyor. Sunucu ve istemci
 * aynı dizeyi üretiyor, yani hidrasyon uyuşmazlığı imkânsız. Kazanç:
 * spiralin sıklığını tek bir sayıyla ayarlayabiliyoruz — 180 noktalık bir
 * path'i elle düzeltmek mümkün değil.
 *
 * ── HAREKET CSS'TE ───────────────────────────────────────────────────────
 * Bileşenler yalnızca `className` alıp geometriyi çiziyor. Maskenin
 * çözülmesi `stroke-dashoffset` ile yapılıyor (`pathLength={1}`): spiral
 * MERKEZDEN dışa doğru çizildiği için offset arttıkça DIŞ uç geri çekilir,
 * yani maske dıştan içe çözülür. Bunun tek yeri modülün `.maskCoil` kuralı.
 *
 * ⚠️ Bu dosyada "use client" YOK; düz JSX olduğu için hem sunucu (hero)
 * hem istemci adaları (maske, mod düğmesi) aynı bileşenleri çağırabiliyor.
 *
 * ⚠️ `<mask>`/`<clipPath>` kimlikleri belge genelinde benzersiz olmak
 * zorunda — sayfada iki ayrı spiral maske var (büyük maske ve mod
 * düğmesinin gliffi). Bu yüzden kimlik üreten her bileşen `idPrefix`
 * istiyor; `useId` kullanılmadı, çünkü bu dosya sunucuda da çiziliyor.
 */

/* ── Yardımcı: Arşimet spirali ───────────────────────────────────────────
   r = b·θ. Merkezden dışa doğru yürüyor; nokta sayısı adım açısıyla
   belirleniyor. Dönen dize `M x y L x y …` biçiminde, tek ondalıklı. */
function spiralPath(
  cx: number,
  cy: number,
  b: number,
  thetaStart: number,
  thetaEnd: number,
  step: number,
): string {
  const parts: string[] = [];
  for (let theta = thetaStart; theta <= thetaEnd; theta += step) {
    const r = b * theta;
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    parts.push(`${parts.length === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return parts.join(" ");
}

/* ── Yardımcı: kare spiral ───────────────────────────────────────────────
   Kamui girdabının iskeleti. Kakashi sayfasındaki eş merkezli YAYLARDAN
   bilinçli olarak farklı: burada dönüş noktaları dik açı, yani girdap
   organik değil MEKANİK okunuyor — boyutun kendisi bir oda gibi. */
function squareSpiralPath(cx: number, cy: number, unit: number, legs: number): string {
  const dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  let x = cx;
  let y = cy;
  const parts = [`M${x.toFixed(1)} ${y.toFixed(1)}`];
  for (let leg = 0; leg < legs; leg += 1) {
    const [dx, dy] = dirs[leg % 4]!;
    const length = unit * (Math.floor(leg / 2) + 1);
    x += dx * length;
    y += dy * length;
    parts.push(`L${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return parts.join(" ");
}

/* ── Yardımcı: dağılan parçalar ──────────────────────────────────────────
   Kare spiralin dış turlarından kopmuş plakalar. Açı ve yarıçap sabit bir
   tablodan geliyor, boyut oradan türetiliyor: aynı girdi hep aynı çıktı. */
const SHARD_SEEDS: [angle: number, radius: number, size: number][] = [
  [0.35, 168, 26],
  [1.02, 205, 19],
  [1.74, 152, 31],
  [2.31, 232, 15],
  [2.88, 186, 23],
  [3.52, 258, 18],
  [4.11, 174, 28],
  [4.68, 221, 14],
  [5.24, 196, 21],
  [5.81, 264, 16],
  [6.15, 148, 12],
];

function shardPoints(cx: number, cy: number, angle: number, radius: number, size: number): string {
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  /* Plakanın dik ekseni — kopan parça girdabın teğetine yaslanıyor */
  const px = -uy;
  const py = ux;
  const x = cx + ux * radius;
  const y = cy + uy * radius;
  const half = size / 2;
  const skew = size * 0.32;
  const corners: [number, number][] = [
    [x - ux * half - px * half, y - uy * half - py * half],
    [x + ux * half - px * (half - skew), y + uy * half - py * (half - skew)],
    [x + ux * half + px * half, y + uy * half + py * half],
    [x - ux * half + px * (half - skew), y - uy * half + py * (half - skew)],
  ];
  return corners.map(([px2, py2]) => `${px2.toFixed(1)},${py2.toFixed(1)}`).join(" ");
}

/* ══ 1 · SPİRAL MASKE ══════════════════════════════════════════════════════
   Sayfanın kalbi. Maske bir dolgu değil, KALIN ÇİZGİLİ TEK BİR SPİRAL:
   ardışık turlar birbirine değecek kadar yakın olduğu için uzaktan düz bir
   plaka gibi okunuyor, yakından oluğu görünüyor. Bunun tek sebebi
   mekaniktir — plaka çözülemez, spiral çözülür.

   Silüet ve göz deliği tek bir `<mask>` ile: beyaz elips maskenin dış
   hattı, siyah daire göz deliği. Spiral bu maskeden geçiyor, yani deliğin
   içinde hiç boya yok ve altındaki yüz oradan görünüyor. */

const MASK_SPIRAL = spiralPath(118, 104, 3.3, 1.1, 54, 0.28);

export function SpiralMask({
  idPrefix,
  className,
  coilClassName,
  rimClassName,
  eyeClassName,
  title,
}: {
  idPrefix: string;
  className?: string;
  coilClassName?: string;
  rimClassName?: string;
  eyeClassName?: string;
  /** Ekran okuyucuya inen açıklama; boşsa şema tamamen dekoratiftir */
  title?: string;
}) {
  const maskId = `${idPrefix}-silhouette`;
  return (
    <svg
      className={className}
      viewBox="0 0 200 240"
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <mask id={maskId}>
          {/* Beyaz = boya geçer. Maskenin dış hattı hafif yumurta biçimli:
              üstte dar, altta geniş. */}
          <path
            d="M100 4 C148 4 196 44 196 116 C196 190 152 236 100 236 C48 236 4 190 4 116 C4 44 52 4 100 4 Z"
            fill="white"
          />
          {/* Siyah = boya kesilir. Tek göz deliği — Tobi maskesinin imzası. */}
          <circle cx="118" cy="104" r="21" fill="black" />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        <path
          className={coilClassName}
          d={MASK_SPIRAL}
          pathLength={1}
          stroke="var(--obi-mask)"
          strokeWidth="17.5"
          strokeLinecap="butt"
          fill="none"
        />
      </g>

      {/* Dış hat — spiral çözülürken bile maskenin nerede durduğunu
          hatırlatan ince çizgi */}
      <path
        className={rimClassName}
        d="M100 4 C148 4 196 44 196 116 C196 190 152 236 100 236 C48 236 4 190 4 116 C4 44 52 4 100 4 Z"
        stroke="var(--obi-mask)"
        strokeWidth="1.4"
        fill="none"
      />

      {/* Göz deliğinin çemberi */}
      <circle
        className={eyeClassName}
        cx="118"
        cy="104"
        r="21"
        stroke="var(--obi-mask)"
        strokeWidth="2.4"
        fill="none"
      />
    </svg>
  );
}

/* ══ 2 · MOD DÜĞMESİNİN GLİFİ ══════════════════════════════════════════════
   Aynı geometrinin 24 piksellik hâli: üç turluk spiral, tek göz deliği.
   Düğme basılıyken CSS spiralin dashoffset'ini açıyor — ikon da düşüyor. */

const GLYPH_SPIRAL = spiralPath(19, 15, 1.5, 1.2, 14.5, 0.3);

export function MaskGlyph({
  idPrefix,
  className,
  coilClassName,
}: {
  idPrefix: string;
  className?: string;
  coilClassName?: string;
}) {
  const maskId = `${idPrefix}-glyph-mask`;
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <defs>
        <mask id={maskId}>
          <ellipse cx="16" cy="16" rx="13" ry="15" fill="white" />
          <circle cx="19" cy="15" r="3.4" fill="black" />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <path
          className={coilClassName}
          d={GLYPH_SPIRAL}
          pathLength={1}
          stroke="var(--obi-mask)"
          strokeWidth="2.6"
          fill="none"
        />
      </g>
      <ellipse
        cx="16"
        cy="16"
        rx="13"
        ry="15"
        stroke="var(--obi-mask)"
        strokeWidth="1.1"
        fill="none"
      />
    </svg>
  );
}

/* ══ 3 · KAMUI GİRDABI ═════════════════════════════════════════════════════
   Hero'nun arkasındaki büyük dekoratif katman. Kare spiral + ondan kopmuş
   plakalar. Kakashi sayfasının eş merkezli yaylarıyla akrabalığı yok:
   burada dönüşler dik, parçalar düz kenarlı ve girdabın dışına doğru
   savruluyor — bir odanın parçalanması gibi. */

const KAMUI_COIL = squareSpiralPath(300, 300, 22, 15);

export function KamuiShatter({
  className,
  coilClassName,
  shardClassName,
  title,
}: {
  className?: string;
  coilClassName?: string;
  shardClassName?: string;
  title?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 600"
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path
        className={coilClassName}
        d={KAMUI_COIL}
        stroke="var(--obi-swirl)"
        strokeWidth="2.4"
        strokeLinejoin="miter"
        fill="none"
      />
      <g className={shardClassName}>
        {SHARD_SEEDS.map(([angle, radius, size], index) => (
          <polygon
            key={`${angle}-${radius}`}
            data-shard={index % 4}
            points={shardPoints(300, 300, angle, radius, size)}
            fill="var(--obi-swirl)"
            stroke="var(--obi-swirl)"
            strokeWidth="1.2"
          />
        ))}
      </g>
    </svg>
  );
}

/* ══ 4 · YARA İZİ AĞI ══════════════════════════════════════════════════════
   Portrenin bir yarısına binen ince çizgi ağı. Elle yazıldı, üretilmedi:
   ezilme izleri düzenli bir desen değil, bir kırılma haritasıdır.

   ⚠️ Hangi yarıya bindiği CSS'te ayarlanıyor. Karakterin ezilen tarafı SAĞ
   tarafıdır; bize dönük bir portrede o taraf ekranın SOLUNA düşer. Ağ
   anatomik bir çizim gibi değil, portrenin üstüne düşmüş bir katman gibi
   duruyor — yüklenen portrenin kadrajını bilmediğimiz için tek doğru
   davranış bu. */

export function ScarWeb({
  className,
  lineClassName,
}: {
  className?: string;
  lineClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 260"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <g
        stroke="var(--obi-rubble)"
        strokeLinecap="round"
        fill="none"
        vectorEffect="non-scaling-stroke"
      >
        {/* Üç uzun kırık hattı */}
        <path className={lineClassName} data-vein="1" strokeWidth="1.5" d="M34 -4 C40 32 28 58 36 92 C44 126 30 154 38 188 C44 214 34 238 40 264" />
        <path className={lineClassName} data-vein="2" strokeWidth="1.1" d="M68 -4 C62 40 76 66 68 104 C60 142 74 168 66 204 C60 230 70 246 64 264" />
        <path className={lineClassName} data-vein="3" strokeWidth="0.8" d="M100 8 C92 44 104 72 96 108 C88 144 100 176 92 212 C86 238 96 250 92 264" />
        {/* Bağlantı çizgileri — ağın kendisi */}
        <path className={lineClassName} data-vein="4" strokeWidth="0.7" d="M35 46 L67 58" />
        <path className={lineClassName} data-vein="4" strokeWidth="0.7" d="M32 78 L70 88" />
        <path className={lineClassName} data-vein="4" strokeWidth="0.6" d="M69 66 L99 82" />
        <path className={lineClassName} data-vein="5" strokeWidth="0.7" d="M36 112 L67 122" />
        <path className={lineClassName} data-vein="5" strokeWidth="0.6" d="M68 130 L95 140" />
        <path className={lineClassName} data-vein="5" strokeWidth="0.7" d="M33 148 L71 158" />
        <path className={lineClassName} data-vein="6" strokeWidth="0.6" d="M70 176 L96 186" />
        <path className={lineClassName} data-vein="6" strokeWidth="0.7" d="M37 194 L67 202" />
        <path className={lineClassName} data-vein="6" strokeWidth="0.6" d="M38 226 L65 234" />
      </g>
    </svg>
  );
}

/* ══ 5 · MOLOZ ALANI ═══════════════════════════════════════════════════════
   Kannabi bölümünün dokusu. Çöken bir kütlenin ALT yüzü: parçalar üstten
   sarkıyor, aşağı doğru sivriliyor. Boyutlar deterministik bir formülden
   geliyor (sinüs tabanlı), çünkü on altı kaya parçasını elle yazmak
   bakımı imkânsız bir koordinat listesi olurdu. */

const RUBBLE_CHUNKS = Array.from({ length: 17 }, (_, index) => {
  const x = index * 24;
  const width = 20 + Math.sin(index * 1.7) * 7;
  const drop = 26 + Math.sin(index * 2.4 + 1.1) * 20;
  const notch = 10 + Math.cos(index * 1.3) * 6;
  const points = [
    [x, 0],
    [x + width, 0],
    [x + width * 0.72, notch + 6],
    [x + width * 0.46, drop],
    [x + width * 0.14, notch],
  ];
  return {
    key: `chunk-${index}`,
    depth: index % 3,
    points: points.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(" "),
  };
});

export function RubbleField({
  className,
  chunkClassName,
}: {
  className?: string;
  chunkClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 64"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      {RUBBLE_CHUNKS.map((chunk) => (
        <polygon
          key={chunk.key}
          className={chunkClassName}
          data-depth={chunk.depth}
          points={chunk.points}
          fill="var(--obi-crush)"
          stroke="var(--obi-rubble)"
          strokeWidth="0.5"
          strokeOpacity="0.35"
        />
      ))}
    </svg>
  );
}
