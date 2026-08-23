/**
 * Kenpachi işaretleri — saf SVG, sunucuda çizilir.
 *
 * Hiçbiri dışarıdan alınmadı: yara izi, göz bandı, çıngıraklar, çentik
 * ağzı, kıvılcım ve çatlaklar bu sayfa için elle çizildi (BRIEF kural 3.4 —
 * dış raster/wiki görseli yasak). Renkler yalnızca token'dan geliyor:
 * `--knp-steel`, `--knp-notch`, `--knp-scar`, `--knp-eyepatch`,
 * `--knp-spark` (globals.css).
 *
 * Hepsi dekoratif: `aria-hidden` + `focusable="false"`. Anlamı olan hiçbir
 * bilgi bu çizimlerde durmuyor, metinde duruyor.
 *
 * Çizim notu: `pathLength="1"` kullanılan yollarda dash animasyonu CSS'te
 * 0–1 aralığında yazılabiliyor — viewBox ölçüsünden bağımsız.
 */

/** Ortak nitelikler — her çizimde tekrar etmemek için. */
const DECOR = {
  "aria-hidden": true as const,
  focusable: "false" as const,
  xmlns: "http://www.w3.org/2000/svg",
};

/**
 * Yara izi — portrenin üstüne inen çizgi.
 *
 * Tek parça değil: üç kırıklı ana çizgi + altı dikiş çentiği. Dikişler
 * ana çizginin üstünde durduğu için portre değişse bile okunur kalıyor.
 */
export function ScarLine({
  className,
  strokeClassName,
}: {
  className?: string;
  /** Dash animasyonunu taşıyan modül sınıfı (Itachi'deki `spinClassName` deseni) */
  strokeClassName?: string;
}) {
  return (
    <svg
      {...DECOR}
      className={className}
      viewBox="0 0 120 300"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        fill="none"
        stroke="var(--knp-scar)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Ana çizgi — kırıklı, hiç düzgün değil */}
        <path
          className={strokeClassName}
          pathLength="1"
          d="M 34 6 L 45 58 L 37 92 L 52 146 L 44 188 L 60 244 L 55 296"
          strokeWidth="3.2"
        />
        {/* Dikişler — ana çizgiyi çapraz kesen kısa çentikler */}
        <g strokeWidth="2.2" opacity="0.85">
          <path d="M 30 44 L 50 36" />
          <path d="M 30 84 L 48 76" />
          <path d="M 38 132 L 58 124" />
          <path d="M 34 176 L 54 168" />
          <path d="M 46 226 L 66 218" />
          <path d="M 44 272 L 64 264" />
        </g>
      </g>
    </svg>
  );
}

/**
 * Göz bandı — dikdörtgen bant + iki kayış.
 *
 * Kenpachi modunda CSS bunu düşürüyor (`translate` + `rotate`); çizim
 * bunu bilmiyor, yalnızca kendi geometrisini veriyor.
 */
export function EyePatchMark({ className }: { className?: string }) {
  return (
    <svg {...DECOR} className={className} viewBox="0 0 180 120">
      {/* Kayışlar */}
      <g
        fill="none"
        stroke="var(--knp-eyepatch)"
        strokeWidth="6"
        strokeLinecap="round"
      >
        <path d="M 2 34 L 58 52" />
        <path d="M 122 52 L 178 30" />
      </g>
      {/* Bandın gövdesi — hafif eğik, köşesi kesik */}
      <path
        d="M 56 34 L 124 30 L 130 84 L 62 90 Z"
        fill="var(--knp-eyepatch)"
        stroke="var(--knp-steel)"
        strokeWidth="2"
      />
      {/* Yüzeydeki kavis — bandın gerginliği */}
      <path
        d="M 66 44 C 84 56 106 56 122 44"
        fill="none"
        stroke="var(--knp-steel)"
        strokeWidth="1.6"
        opacity="0.5"
      />
      {/* Emici çekirdek — Araştırma Enstitüsü'nün deliği */}
      <circle
        cx="93"
        cy="62"
        r="7"
        fill="none"
        stroke="var(--knp-spark)"
        strokeWidth="1.6"
        opacity="0.55"
      />
    </svg>
  );
}

/** Tek zil — çıngırak kümesinin ve kısıt levhasının paylaştığı parça. */
function Bell({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="var(--knp-notch)"
        stroke="var(--knp-steel)"
        strokeWidth="1.6"
      />
      {/* Ağız yarığı */}
      <path
        d={`M ${cx - r * 0.62} ${cy + r * 0.42} L ${cx + r * 0.62} ${cy + r * 0.42}`}
        stroke="var(--knp-eyepatch)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Parlama — çelik ışığı tek noktadan alıyor */}
      <circle
        cx={cx - r * 0.32}
        cy={cy - r * 0.34}
        r={r * 0.18}
        fill="var(--knp-steel)"
        opacity="0.7"
      />
    </g>
  );
}

/**
 * Çıngıraklar — saç uçlarındaki üç zil.
 *
 * Üçü de farklı boyda ve farklı uzunlukta telde: simetri Kenpachi'ye
 * yabancı.
 */
export function BellCluster({
  className,
  swingClassName,
}: {
  className?: string;
  /** Sallanma animasyonunu taşıyan modül sınıfı */
  swingClassName?: string;
}) {
  /* Askı noktası her zilde farklı: sallanma ekseni telin başlangıcı */
  const swing = (x: number): React.CSSProperties => ({
    transformOrigin: `${x}px 4px`,
    transformBox: "view-box",
  });
  return (
    <svg {...DECOR} className={className} viewBox="0 0 160 110">
      <g
        fill="none"
        stroke="var(--knp-steel)"
        strokeWidth="1.6"
        opacity="0.6"
      >
        <path d="M 30 2 L 34 40" />
        <path d="M 82 2 L 78 56" />
        <path d="M 128 2 L 124 30" />
      </g>
      <g className={swingClassName} style={swing(30)} data-bell="1">
        <Bell cx={34} cy={50} r={11} />
      </g>
      <g className={swingClassName} style={swing(82)} data-bell="2">
        <Bell cx={78} cy={68} r={14} />
      </g>
      <g className={swingClassName} style={swing(128)} data-bell="3">
        <Bell cx={124} cy={40} r={9} />
      </g>
    </svg>
  );
}

/**
 * Çentik — kılıç ağzından kopmuş kama.
 *
 * Kama `--bg` ile dolu, yani "eksik metal" gerçekten eksik görünüyor;
 * iki yanındaki parlak kenar çeliğin kesildiği yeri veriyor. Derinleşme
 * CSS'te: `.notchBite` grubunun `scale`'i büyüyor (transform-origin üstte).
 */
export function NotchGlyph({
  className,
  biteClassName,
}: {
  className?: string;
  /** Derinleşmeyi taşıyan modül sınıfı */
  biteClassName?: string;
}) {
  return (
    /* `preserveAspectRatio="none"`: kama kutusunu tam dolduruyor —
       kutunun oranı masaüstünde ve mobilde farklı, kama ikisinde de
       ağzın tepesine oturmalı. */
    <svg
      {...DECOR}
      className={className}
      viewBox="0 0 64 48"
      preserveAspectRatio="none"
    >
      <g
        className={biteClassName}
        style={{ transformOrigin: "32px 0px", transformBox: "view-box" }}
      >
        <path d="M 8 0 L 32 26 L 56 0 Z" fill="var(--bg)" />
        <path
          d="M 8 0 L 32 26 L 56 0"
          fill="none"
          stroke="var(--knp-steel)"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        {/* İç gölge — kesiğin dibi */}
        <path
          d="M 17 3 L 32 19 L 47 3"
          fill="none"
          stroke="var(--knp-notch)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/**
 * Kıvılcım — çentiğe basıldığında çeliğe vuran ışık.
 *
 * Dokuz çizgi + üç zerre; her birinin açısı ve uzunluğu elle yazıldı
 * (rastgele üretim sunucu/istemci uyuşmazlığı üretirdi). Animasyon
 * tamamen CSS'te ve `--spark-i` sırasıyla gecikiyor.
 */
export function SparkBurst({
  className,
  shardClassName,
  dotClassName,
}: {
  className?: string;
  /** Kıvılcım çizgilerinin animasyon sınıfı (modülden) */
  shardClassName?: string;
  /** Zerrelerin animasyon sınıfı (modülden) */
  dotClassName?: string;
}) {
  const shards = [
    { d: "M 32 32 L 6 12", w: 2.4 },
    { d: "M 32 32 L 14 40", w: 1.6 },
    { d: "M 32 32 L 30 2", w: 2 },
    { d: "M 32 32 L 52 8", w: 2.6 },
    { d: "M 32 32 L 62 26", w: 1.8 },
    { d: "M 32 32 L 56 48", w: 2.2 },
    { d: "M 32 32 L 38 60", w: 1.6 },
    { d: "M 32 32 L 12 56", w: 2 },
    { d: "M 32 32 L 2 34", w: 1.4 },
  ];
  return (
    <svg {...DECOR} className={className} viewBox="0 0 64 64">
      <g
        stroke="var(--knp-spark)"
        strokeLinecap="round"
        fill="none"
      >
        {shards.map((shard, index) => (
          <path
            key={shard.d}
            className={shardClassName}
            style={{ "--spark-i": index } as React.CSSProperties}
            d={shard.d}
            strokeWidth={shard.w}
          />
        ))}
      </g>
      <g fill="var(--knp-spark)">
        <circle
          className={dotClassName}
          style={{ "--spark-i": 2 } as React.CSSProperties}
          cx="52"
          cy="18"
          r="2.2"
        />
        <circle
          className={dotClassName}
          style={{ "--spark-i": 5 } as React.CSSProperties}
          cx="16"
          cy="48"
          r="1.8"
        />
        <circle
          className={dotClassName}
          style={{ "--spark-i": 8 } as React.CSSProperties}
          cx="46"
          cy="52"
          r="1.4"
        />
      </g>
    </svg>
  );
}

/** Kısıt levhalarının işaretleri — dördü de aynı 96×96 kutuda. */
export type RestraintMarkKind = "blade" | "bells" | "patch" | "title";

export function RestraintMark({
  kind,
  className,
}: {
  kind: RestraintMarkKind;
  className?: string;
}) {
  return (
    <svg {...DECOR} className={className} viewBox="0 0 96 96">
      {kind === "blade" ? (
        <g>
          {/* Tek elle tutulan ağız: kabza + tek bar (ikinci el yok) */}
          <path
            d="M 22 78 L 74 20 L 84 30 L 32 88 Z"
            fill="var(--knp-notch)"
            stroke="var(--knp-steel)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M 74 20 L 84 30"
            stroke="var(--knp-spark)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M 14 86 L 30 70"
            stroke="var(--knp-steel)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Boşta kalan ikinci el — kesik çizgi */}
          <path
            d="M 40 88 L 56 72"
            stroke="var(--knp-steel)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="4 7"
            opacity="0.42"
          />
        </g>
      ) : null}

      {kind === "bells" ? (
        <g>
          <g fill="none" stroke="var(--knp-steel)" strokeWidth="1.8" opacity="0.6">
            <path d="M 30 8 L 32 34" />
            <path d="M 64 8 L 62 44" />
          </g>
          <Bell cx={32} cy={46} r={13} />
          <Bell cx={62} cy={58} r={17} />
          {/* Ses dalgaları — zilin duyulduğu mesafe */}
          <g
            fill="none"
            stroke="var(--knp-spark)"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.5"
          >
            <path d="M 84 44 C 90 52 90 64 84 72" />
            <path d="M 12 44 C 6 52 6 64 12 72" />
          </g>
        </g>
      ) : null}

      {kind === "patch" ? (
        <g>
          <g
            fill="none"
            stroke="var(--knp-eyepatch)"
            strokeWidth="6"
            strokeLinecap="round"
          >
            <path d="M 4 30 L 32 42" />
            <path d="M 66 42 L 92 26" />
          </g>
          <path
            d="M 30 28 L 68 24 L 72 66 L 34 70 Z"
            fill="var(--knp-eyepatch)"
            stroke="var(--knp-steel)"
            strokeWidth="2"
          />
          {/* Emilen reiatsu — bandın içine akan üç çizgi */}
          <g
            fill="none"
            stroke="var(--knp-spark)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          >
            <path d="M 42 82 L 46 70" />
            <path d="M 52 86 L 54 72" />
            <path d="M 62 82 L 62 70" />
          </g>
        </g>
      ) : null}

      {kind === "title" ? (
        <g
          stroke="var(--knp-steel)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        >
          {/* Sayaç: dört dik çizgi + üstünü çizen beşinci — unvan bir sayı */}
          <path d="M 20 24 L 20 72" />
          <path d="M 34 24 L 34 72" />
          <path d="M 48 24 L 48 72" />
          <path d="M 62 24 L 62 72" />
          <path d="M 12 68 L 74 28" stroke="var(--knp-scar)" />
        </g>
      ) : null}
    </svg>
  );
}

/**
 * Çatlaklar — yalnızca Kenpachi modunda görünür.
 *
 * Sayfanın kenarına oturuyor ve `preserveAspectRatio="none"` ile geriliyor:
 * çatlak çizgileri gerildiğinde bozulmuyor, uzuyor — istenen şey de bu.
 */
export function CrackOverlay({ className }: { className?: string }) {
  return (
    <svg
      {...DECOR}
      className={className}
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
    >
      <g
        fill="none"
        stroke="var(--knp-scar)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      >
        <path d="M 0 96 L 78 132 L 52 168 L 156 214 L 128 248 L 244 300" />
        <path d="M 1200 60 L 1108 108 L 1146 142 L 1032 196 L 1064 236 L 948 290" />
        <path d="M 0 704 L 96 664 L 70 630 L 188 580" />
        <path d="M 1200 744 L 1092 700 L 1130 664 L 1010 612" />
        <path d="M 600 0 L 574 54 L 616 88 L 588 148" />
        <path d="M 640 800 L 668 742 L 624 706 L 656 646" />
      </g>
    </svg>
  );
}
