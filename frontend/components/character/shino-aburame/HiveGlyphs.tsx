/**
 * Shino sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §3.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor — emsal
 * `components/character/itachi/SharinganEyes.tsx`. Renkler yalnızca
 * token'dan geliyor (`--shi-*`, CSS modülünün başındaki deri bloğu); bu
 * dosyada da tek hex yok.
 *
 * Hareket CSS'te: bileşenler yalnızca `className` alıp geometriyi çiziyor,
 * neyin ne zaman canlanacağını `data-*` nitelikleri söylüyor. Böylece
 * reduced-motion battaniyesi (modülün sonu) hepsini tek yerden durdurabiliyor.
 *
 * ── ALTIGEN GEOMETRİSİ (bütün dosyanın tek ölçüsü) ───────────────────────
 * Sivri tepeli (pointy-top) altıgen, genişlik 100 birim:
 *   yükseklik      = 115.47   (100 · 2/√3)
 *   satır aralığı  =  86.60   (yüksekliğin 3/4'ü)
 *   komşu merkezi  = 100 birim uzakta, altı yönde
 * Bu üç sayı hem peteğin hem sayfa zeminindeki dokunun temeli. Ondalıkları
 * yuvarlamak kenarları örtüşmez hâle getirdiği için sabit tutuluyorlar.
 */

/** Altıgen yarı ölçüleri — merkezden köşeye. */
const HEX_W = 50; // yarım genişlik
const HEX_A = 28.8675; // dikey kenarın yarısı (yüksekliğin 1/4'ü)
const HEX_B = 57.735; // merkezden sivri tepeye (yüksekliğin 1/2'si)
const ROW = 86.6025; // iki satır arası dikey mesafe

/** Verilen merkez için sivri tepeli altıgenin kapalı yolu. */
function hexPath(cx: number, cy: number, scale = 1): string {
  const w = HEX_W * scale;
  const a = HEX_A * scale;
  const b = HEX_B * scale;
  return [
    `M${cx} ${cy - b}`,
    `L${cx + w} ${cy - a}`,
    `L${cx + w} ${cy + a}`,
    `L${cx} ${cy + b}`,
    `L${cx - w} ${cy + a}`,
    `L${cx - w} ${cy - a}`,
    "Z",
  ].join(" ");
}

/**
 * Sabit tohumlu sayı üreteci (LCG).
 *
 * ⚠️ `Math.random` KULLANILMIYOR: nokta bulutu sunucuda çiziliyor ve
 * istemcide aynı işaretlemeyi üretmek zorunda. Rastgele bir dizi hidrasyon
 * uyuşmazlığı üretirdi; bu üreteç her çağrıda aynı bulutu veriyor.
 */
function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/* ══ 1 · SAYFA ZEMİNİ — petek dokusu ═══════════════════════════════════════
   Sayfanın tamamına yayılan altıgen ağ. Normalde neredeyse görünmez;
   "Kovan modu" açıldığında CSS opaklığı yükseltiyor.

   `slice`: katman sabit konumlu ve tam ekran; altıgenler ezilmeden kırpılır. */

const LATTICE_W = 1200;
const LATTICE_H = 900;
/** Zemin peteği daha iri: hem daha sakin okunuyor hem ~90 yol yetiyor. */
const LATTICE_SCALE = 1.5;

export function HiveLattice({ className }: { className?: string }) {
  const cells: string[] = [];
  const step = HEX_W * 2 * LATTICE_SCALE;
  const rowStep = ROW * LATTICE_SCALE;
  const rows = Math.ceil(LATTICE_H / rowStep) + 2;
  const cols = Math.ceil(LATTICE_W / step) + 2;

  for (let row = -1; row < rows; row += 1) {
    for (let col = -1; col < cols; col += 1) {
      const cx = col * step + (row % 2 === 0 ? 0 : step / 2);
      cells.push(hexPath(cx, row * rowStep, LATTICE_SCALE));
    }
  }

  return (
    <svg
      className={className}
      viewBox={`0 0 ${LATTICE_W} ${LATTICE_H}`}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g stroke="var(--shi-hive)" strokeWidth="1.1">
        {cells.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}

/* ══ 2 · HERO — dağılan böcek bulutu ═══════════════════════════════════════
   Kaynak sol altta; yoğunluk oradan sağ üste doğru seyreliyor. Üç kuşak
   (`data-band`) var: yakın noktalar iri ve yavaş, uzaktakiler küçük ve
   hızlı sürükleniyor. Hareketin tamamı CSS'te. */

interface Drone {
  x: number;
  y: number;
  r: number;
  band: number;
}

const CLOUD_W = 620;
const CLOUD_H = 720;

function buildCloud(count: number): Drone[] {
  const rand = seeded(0x5b17a0);
  const drones: Drone[] = [];
  for (let index = 0; index < count; index += 1) {
    /* Kaynaktan uzaklık üstel dağılıyor: kökte kalabalık, uçta tek tük */
    const spread = Math.pow(rand(), 0.55);
    const angle = -0.15 - rand() * 1.15; // sol alttan sağ üste doğru koni
    const radius = spread * 760;
    const x = 96 + Math.cos(angle) * radius * 0.92;
    const y = 660 + Math.sin(angle) * radius;
    if (x < -30 || x > CLOUD_W + 30 || y < -30 || y > CLOUD_H + 30) {
      continue;
    }
    drones.push({
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      r: Math.round((2.6 - spread * 1.9 + rand() * 0.7) * 100) / 100,
      band: spread < 0.34 ? 0 : spread < 0.68 ? 1 : 2,
    });
  }
  return drones;
}

const CLOUD = buildCloud(190);

/**
 * Kuşak opaklıkları — derinlik RENK değiştirilerek değil opaklıkla
 * veriliyor, palet tek token'da kalsın diye.
 */
const BAND_OPACITY = [0.85, 0.5, 0.28] as const;

export function DroneCloud({
  className,
  dotClassName,
}: {
  className?: string;
  dotClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${CLOUD_W} ${CLOUD_H}`}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {/* ⚠️ Noktalar kuşak kuşak GRUPLANIYOR ve hareket gruba veriliyor:
          yüz doksan ayrı animasyon SVG'de birleştirilemez ve dar cihazda
          kare düşürür. Üç grup, üç animasyon. */}
      {BAND_OPACITY.map((opacity, band) => (
        <g
          key={band}
          className={dotClassName}
          data-band={band}
          fill="var(--shi-chitin)"
          fillOpacity={opacity}
        >
          {CLOUD.filter((drone) => drone.band === band).map((drone, index) => (
            <circle
              key={`${drone.x}-${drone.y}-${index}`}
              cx={drone.x}
              cy={drone.y}
              r={drone.r}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

/* ══ 3 · MOD DÜĞMESİNİN GLİFİ ══════════════════════════════════════════════ */

export function HiveMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d={hexPath(16, 16, 0.26)}
        stroke="var(--shi-carapace)"
        strokeWidth="1.4"
      />
      <g fill="var(--shi-swarm)">
        <circle cx="16" cy="12.6" r="1.5" />
        <circle cx="13" cy="18" r="1.5" />
        <circle cx="19" cy="18" r="1.5" />
      </g>
    </svg>
  );
}

/* ══ 4 · PETEK ŞEMASI — sayfanın kalbi ═════════════════════════════════════
   Altı hücre bir HALKA kuruyor; ortada kovan çekirdeği duruyor. Halkanın
   dışında ikinci bir sıra daha var ve kadrajın kenarında kırpılıyor —
   "kovan çerçevenin dışında da devam ediyor" hissi bundan geliyor.

   Şema yalnızca ÇİZİYOR. Tıklanabilir hücreler gerçek <button> öğeleri
   (bkz. HiveComb.tsx) ve bu şemanın üstüne yüzde koordinatlarıyla
   oturuyorlar; yüzdeler aşağıdaki `CELL_CENTERS` ile birebir aynı.

   Kutu: viewBox halkanın 1.5 katı, halka tam ortada. Böylece ikinci sıra
   `overflow: visible` gerektirmeden kadrajın içinde kalıyor. */

/** Halka hücrelerinin merkezleri — sıra 0'dan başlayıp saat yönünde döner. */
const CELL_CENTERS: readonly (readonly [number, number])[] = [
  [100, 57.74], // 0 · üst sol
  [200, 57.74], // 1 · üst sağ
  [250, 144.34], // 2 · sağ
  [200, 231.0], // 3 · alt sağ
  [100, 231.0], // 4 · alt sol
  [50, 144.34], // 5 · sol
];

const CORE: readonly [number, number] = [150, 144.34];

/** Kadraj: halkanın 1.5 katı, halka ortada. */
const COMB_VIEW = "-75 -72.2 450 433.1";

/** İkinci sıra — altıgen ızgarada merkeze 2 adım uzaktaki 12 hücre. */
const OUTER_CENTERS: readonly (readonly [number, number])[] = [
  [50, -28.86],
  [150, -28.86],
  [250, -28.86],
  [300, 57.74],
  [350, 144.34],
  [300, 230.94],
  [250, 317.54],
  [150, 317.54],
  [50, 317.54],
  [0, 230.94],
  [-50, 144.34],
  [0, 57.74],
];

/** Halka mesafesi: 0..3. Halka olduğu için 5 ile 0 komşudur. */
export function ringDistance(from: number, to: number): number {
  const raw = Math.abs(from - to) % 6;
  return Math.min(raw, 6 - raw);
}

/** Her hücrenin içine serpilmiş dört küçük böcek — sabit tohumlu. */
const CELL_DOTS: readonly (readonly (readonly [number, number, number])[])[] =
  CELL_CENTERS.map((_, cellIndex) => {
    const rand = seeded(0x9e37 + cellIndex * 7919);
    return Array.from({ length: 4 }, () => {
      const angle = rand() * Math.PI * 2;
      const radius = 9 + rand() * 21;
      return [
        Math.round(Math.cos(angle) * radius * 10) / 10,
        Math.round(Math.sin(angle) * radius * 0.86 * 10) / 10,
        Math.round((1 + rand() * 1.1) * 100) / 100,
      ] as const;
    });
  });

export function CombDiagram({
  selected,
  title,
  className,
  cellClassName,
  outerClassName,
  linkClassName,
  spokeClassName,
  dotClassName,
  coreClassName,
}: {
  /** 0 tabanlı hücre sırası */
  selected: number;
  /** Ekran okuyucuya inen açıklama */
  title: string;
  className?: string;
  cellClassName?: string;
  outerClassName?: string;
  linkClassName?: string;
  spokeClassName?: string;
  dotClassName?: string;
  coreClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox={COMB_VIEW}
      fill="none"
      role="img"
      aria-label={title}
      focusable="false"
    >
      {/* İkinci sıra: kadrajın kenarında kırpılan hücreler */}
      <g stroke="var(--shi-hive)" strokeWidth="1.4">
        {OUTER_CENTERS.map(([cx, cy]) => (
          <path
            key={`outer-${cx}-${cy}`}
            className={outerClassName}
            d={hexPath(cx, cy)}
          />
        ))}
      </g>

      {/* Çekirdekten hücrelere giden altı parmak */}
      <g strokeWidth="1.6" strokeLinecap="round">
        {CELL_CENTERS.map(([cx, cy], index) => (
          <line
            key={`spoke-${index}`}
            className={spokeClassName}
            data-dist={ringDistance(index, selected)}
            x1={CORE[0]}
            y1={CORE[1]}
            x2={cx}
            y2={cy}
            stroke="var(--shi-chitin)"
          />
        ))}
      </g>

      {/* Halkanın kenarları: uyanma dalgası bu hatlar üzerinden yayılıyor */}
      <g strokeWidth="2" strokeLinecap="round">
        {CELL_CENTERS.map(([cx, cy], index) => {
          const next = CELL_CENTERS[(index + 1) % 6];
          if (!next) {
            return null;
          }
          const dist = Math.min(
            ringDistance(index, selected),
            ringDistance((index + 1) % 6, selected),
          );
          return (
            <line
              key={`link-${index}`}
              className={linkClassName}
              data-dist={dist}
              x1={cx}
              y1={cy}
              x2={next[0]}
              y2={next[1]}
              stroke="var(--shi-swarm)"
            />
          );
        })}
      </g>

      {/* Altı hücrenin altıgen çerçevesi */}
      <g strokeWidth="1.8">
        {CELL_CENTERS.map(([cx, cy], index) => (
          <path
            key={`cell-${index}`}
            className={cellClassName}
            data-dist={ringDistance(index, selected)}
            d={hexPath(cx, cy)}
            stroke="var(--shi-carapace)"
          />
        ))}
      </g>

      {/* Hücrelerin içindeki böcekler */}
      <g fill="var(--shi-swarm)">
        {CELL_CENTERS.map(([cx, cy], index) =>
          (CELL_DOTS[index] ?? []).map(([dx, dy, r], dotIndex) => (
            <circle
              key={`dot-${index}-${dotIndex}`}
              className={dotClassName}
              data-dist={ringDistance(index, selected)}
              cx={cx + dx}
              cy={cy + dy}
              r={r}
            />
          )),
        )}
      </g>

      {/* Kovan çekirdeği */}
      <path
        className={coreClassName}
        d={hexPath(CORE[0], CORE[1], 0.62)}
        stroke="var(--shi-chitin)"
        strokeWidth="1.6"
        fill="var(--shi-hive)"
      />
    </svg>
  );
}
