import type { CSSProperties } from "react";
import styles from "./SakuraExperience.module.css";

/**
 * Sakura sayfasının elle çizilmiş SVG seti.
 *
 * Bu sayfada üretilmiş ya da dışarıdan alınmış TEK BİR raster görsel yok
 * (BRIEF kural 3.4). Grafik yükün tamamı burada: mühür, taçyaprakları,
 * çatlaklar ve Byakugō modunun kenar damarları. Renkler yalnızca token'dan
 * (`--skr-seal`, `--skr-blossom`, `--skr-crack`, `--accent`) — dosyada hex
 * yok.
 *
 * `"use client"` YOK: bileşenler durum tutmuyor, sunucuda çiziliyorlar.
 * İstemci adası (`ByakugoShell`) bunları import ettiğinde parça istemci
 * paketine giriyor — SharinganEyes emsalinin aynısı.
 *
 * ── MÜHÜR NASIL BÜYÜYOR ──────────────────────────────────────────────
 * Kademe değiştikçe SVG değişmiyor: bütün çizgiler her zaman DOM'da. Her
 * çizginin `--from` değeri var (hangi kademede belirir) ve CSS
 * `stroke-dashoffset`i `--seal-stage` ile hesaplıyor. Böylece geçiş
 * gerçek bir çizim hareketi oluyor, düğüm takas etmek değil — ve
 * reduced-motion battaniyesi tek satırda durduruyor.
 */

/** Mühür çizgisi: yol + hangi kademede belirdiği + aynalanıp aynalanmadığı. */
interface SealStroke {
  d: string;
  from: number;
  /** true ise çizgi bir de dikey eksende aynalanarak çizilir */
  mirror?: boolean;
}

/*
 * Kutu 240×240, merkez (120,120). Eşkenar dörtgen x:104→136, y:96→144.
 * Dallar merkezden çıkıp yüze yayılıyor; simetri kasıtlı olarak TAM
 * DEĞİL — iki çizgi (A1, A2) aynalanmıyor, çünkü tamamen simetrik bir
 * mühür makine çizimi gibi duruyordu.
 */
const SEAL_STROKES: SealStroke[] = [
  { d: "M133 116 C 150 108 164 112 172 124", from: 1, mirror: true },
  { d: "M133 128 C 152 134 162 148 165 164", from: 1, mirror: true },
  { d: "M129 102 C 141 84 158 76 176 78", from: 2, mirror: true },
  { d: "M131 137 C 146 158 148 180 140 200", from: 2, mirror: true },
  { d: "M135 120 C 166 112 196 120 218 140", from: 3, mirror: true },
  { d: "M128 99 C 148 66 186 56 214 66", from: 3, mirror: true },
  { d: "M133 133 C 172 156 202 178 228 176", from: 4, mirror: true },
  { d: "M136 122 C 178 118 214 100 236 74", from: 4, mirror: true },
  /* Kancalar: dalların ucundaki küçük kıvrımlar — fırça izini taklit eder */
  { d: "M172 124 C 179 127 181 134 176 139", from: 2, mirror: true },
  { d: "M218 140 C 226 143 229 150 225 157", from: 4, mirror: true },
  /* Aynalanmayan iki çizgi */
  { d: "M112 146 C 101 172 87 190 63 197", from: 3 },
  { d: "M126 149 C 133 179 127 206 109 227", from: 4 },
];

/** Kademe kutusundaki eşkenar dörtgen — sayfanın şekil dili. */
const RHOMBUS_PATH = "M120 96 L136 120 L120 144 L104 120 Z";

/**
 * Mührün kendisi — disk ve çizelge aynı geometriyi paylaşsın diye ayrı
 * bir `<g>`. `--seal-stage` 0–4 arası; CSS bütün görünürlüğü ondan türetir.
 */
function SealMark({ stage }: { stage: number }) {
  return (
    <g
      className={styles.sealMark}
      style={{ "--seal-stage": stage } as CSSProperties}
    >
      {/* Kademe 0: henüz mühür yok, yalnızca bulunmuş nokta */}
      <circle className={styles.sealDot} cx="120" cy="120" r="4.5" />
      <path
        className={styles.sealRhombus}
        d={RHOMBUS_PATH}
        pathLength={100}
        style={{ "--from": 1 } as CSSProperties}
      />
      <path className={styles.sealRhombusFill} d={RHOMBUS_PATH} />
      {SEAL_STROKES.map((stroke) => (
        <g key={stroke.d}>
          <path
            className={styles.sealStroke}
            d={stroke.d}
            pathLength={100}
            style={{ "--from": stroke.from } as CSSProperties}
          />
          {stroke.mirror ? (
            <path
              className={styles.sealStroke}
              d={stroke.d}
              pathLength={100}
              transform="translate(240 0) scale(-1 1)"
              style={{ "--from": stroke.from } as CSSProperties}
            />
          ) : null}
        </g>
      ))}
    </g>
  );
}

/** Yalnız mühür — kader çizelgesinde her durağın yanında kullanılıyor. */
export function ByakugoSeal({
  stage,
  className,
}: {
  stage: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      aria-hidden
      focusable="false"
    >
      <SealMark stage={stage} />
    </svg>
  );
}

/* Beş kademe halkanın üstünde 72°'lik aralıklarla; ilk çentik tepede. */
const TICK_ANGLES = [-90, -18, 54, 126, 198];
const RING_RADIUS = 104;

/**
 * Dolum diski — ölçeğin görünen yüzü.
 *
 * Halka yayı `pathLength=100` ile normalize edildi: dolum yüzdesi
 * doğrudan `stroke-dashoffset` hesabına giriyor, yarıçap değişse bile
 * matematik bozulmuyor.
 */
export function SealDisc({
  stage,
  className,
}: {
  stage: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      style={{ "--seal-stage": stage } as CSSProperties}
      aria-hidden
      focusable="false"
    >
      <circle className={styles.discRingOuter} cx="120" cy="120" r="112" />
      <circle className={styles.discRingInner} cx="120" cy="120" r="62" />
      <circle
        className={styles.discTrack}
        cx="120"
        cy="120"
        r={RING_RADIUS}
        pathLength={100}
      />
      <circle
        className={styles.discFill}
        cx="120"
        cy="120"
        r={RING_RADIUS}
        pathLength={100}
      />
      {TICK_ANGLES.map((angle, index) => {
        const radians = (angle * Math.PI) / 180;
        const cx = 120 + RING_RADIUS * Math.cos(radians);
        const cy = 120 + RING_RADIUS * Math.sin(radians);
        return (
          <rect
            key={angle}
            className={styles.discTick}
            x={cx - 4.5}
            y={cy - 4.5}
            width="9"
            height="9"
            transform={`rotate(45 ${cx} ${cy})`}
            style={{ "--tick": index } as CSSProperties}
          />
        );
      })}
      <SealMark stage={stage} />
    </svg>
  );
}

/** Küçük eşkenar dörtgen — madde imi, çizelge işareti, mod düğmesi ikonu. */
export function RhombusMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path className={styles.markOutline} d="M12 2 L20 12 L12 22 L4 12 Z" />
      <path className={styles.markFill} d="M12 6.5 L16.8 12 L12 17.5 L7.2 12 Z" />
    </svg>
  );
}

/*
 * Taçyaprakları. Kar tanesi gibi dikey düşmüyorlar: rüzgâr onları yana
 * savuruyor, dönerek. Konumlar elle dağıtıldı (rastgele üretim her
 * çizimde farklı sonuç verir ve sunucu/istemci uyuşmazlığı üretirdi).
 */
const PETALS = [
  { x: 90, y: 120, s: 1.15, r: -18 },
  { x: 260, y: 60, s: 0.8, r: 34 },
  { x: 420, y: 210, s: 1.35, r: -52 },
  { x: 560, y: 90, s: 0.7, r: 12 },
  { x: 705, y: 300, s: 1.05, r: -30 },
  { x: 840, y: 140, s: 0.9, r: 66 },
  { x: 980, y: 45, s: 1.25, r: -8 },
  { x: 1105, y: 235, s: 0.75, r: 40 },
  { x: 150, y: 420, s: 0.95, r: 24 },
  { x: 335, y: 560, s: 1.4, r: -44 },
  { x: 610, y: 470, s: 0.85, r: 58 },
  { x: 790, y: 640, s: 1.1, r: -22 },
  { x: 1030, y: 520, s: 0.8, r: 16 },
  { x: 1160, y: 690, s: 1.2, r: -60 },
];

const PETAL_PATH =
  "M0 0 C 2 -7 9 -11 15 -8 C 12 -6 11 -3 13 -1 C 10 3 3 3 0 0 Z";

/** Hero'nun ardındaki savrulan taçyaprakları — dekoratif, `aria-hidden`. */
export function PetalDrift({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
      focusable="false"
    >
      {PETALS.map((petal, index) => (
        <g key={`${petal.x}-${petal.y}`} transform={`translate(${petal.x} ${petal.y})`}>
          <path
            className={styles.petal}
            d={PETAL_PATH}
            transform={`rotate(${petal.r}) scale(${petal.s})`}
            style={{ "--i": index } as CSSProperties}
          />
        </g>
      ))}
    </svg>
  );
}

/*
 * Yıkım kefesinin zemin çatlakları. Tek bir temas noktasından (alt orta)
 * dallanıyor — Ōkashō'nun vuruş izi. Uzunluklar `pathLength=100` ile
 * normalize: kart üstüne gelindiğinde çatlaklar uzuyor.
 */
const CRACKS = [
  "M300 200 L286 168 L296 140 L278 104 L288 66 L272 22",
  "M300 200 L262 176 L240 150 L206 132 L178 100 L142 82 L108 44",
  "M300 200 L338 178 L360 152 L396 138 L424 108 L462 92 L494 56",
  "M300 200 L318 162 L312 128 L330 96 L322 58 L340 24",
  "M300 200 L244 194 L200 176 L148 168 L98 146 L48 140",
  "M300 200 L356 196 L402 180 L452 174 L500 154 L552 148",
  "M286 168 L256 156 L232 128",
  "M338 178 L370 168 L392 142",
];

/** Ōkashō'nun zemininde açılan çatlaklar — dekoratif, `aria-hidden`. */
export function CrackField({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 200"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden
      focusable="false"
    >
      {CRACKS.map((d, index) => (
        <path
          key={d}
          className={styles.crack}
          d={d}
          pathLength={100}
          style={{ "--i": index } as CSSProperties}
        />
      ))}
    </svg>
  );
}

/*
 * Byakugō modunda sayfanın kenarlarına yayılan mühür damarları. Kutu
 * `preserveAspectRatio="none"` ile geriliyor: eğriler soyut olduğu için
 * esneme okunmuyor, buna karşılık damarlar her ekran boyunda kenarı
 * baştan sona takip ediyor.
 */
const VEINS = [
  "M2 0 C 8 14 3 26 9 38 C 15 50 6 64 11 78 C 15 90 5 96 6 100",
  "M9 0 C 14 12 22 20 18 34 C 14 48 24 58 20 72 C 16 86 22 94 18 100",
  "M98 0 C 92 14 97 26 91 38 C 85 50 94 64 89 78 C 85 90 95 96 94 100",
  "M91 0 C 86 12 78 20 82 34 C 86 48 76 58 80 72 C 84 86 78 94 82 100",
];

/** Byakugō modu açıkken kenarlardan yayılan mühür çizgileri. */
export function SealVeins({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
      focusable="false"
    >
      {VEINS.map((d, index) => (
        <path
          key={d}
          className={styles.vein}
          d={d}
          pathLength={100}
          style={{ "--i": index } as CSSProperties}
        />
      ))}
    </svg>
  );
}
