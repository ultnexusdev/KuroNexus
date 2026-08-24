/**
 * Chōji Akimichi sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §4.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor — emsal
 * `components/character/itachi/SharinganEyes.tsx`. Renkler yalnızca
 * token'dan geliyor (`--cho-*` ve standart set, CSS modülünün deri bloğu);
 * bu dosyada da tek hex yok.
 *
 * Hareket CSS'te: bileşenler yalnızca `className` alıp geometriyi çiziyor,
 * neyin ne zaman görüneceğini `data-*` nitelikleri söylüyor. Böylece
 * reduced-motion battaniyesi (modülün sonu) hepsini tek yerden durdurabiliyor.
 *
 * ── ÇİZİM DİLİ ───────────────────────────────────────────────────────────
 * Sayfanın tek biçim sözlüğü var: DAİRE. Klan amblemi bir spiral, teknik
 * göstergeleri iç içe halkalar, haplar küre, terazinin kefeleri yay. Dört
 * küçük işaret de aynı kalemle çizildi: 32×32 kutu, 1.5 birim çizgi, yuvarlak
 * uç. İkonların tek bir yerde ve tek bir ağırlıkta olması bilinçli.
 *
 * ⚠️ Bu dosyada "use client" YOK ama iki istemci adası (`ButterflyShell`,
 * `PillBalance`) onu çağırıyor — düz JSX olduğu için istemci paketine
 * giriyor, ek bağımlılık getirmiyor. Sunucu tarafında da (hero, cephanelik)
 * aynı bileşenler kullanılıyor.
 */

/* ── Akimichi klan amblemi: spiral ───────────────────────────────────────
   Elle nokta nokta yazmak yerine tek bir Arşimet spirali üretiliyor: yarıçap
   açıyla doğrusal büyüyor, yani sarımlar arası mesafe sabit kalıyor. Sabit
   parametrelerle çalıştığı için çıktısı her çizimde birebir aynı. */

function spiralPath(
  turns: number,
  startRadius: number,
  growth: number,
  centre: number,
): string {
  const steps = Math.round(turns * 56);
  const points: string[] = [];
  for (let index = 0; index <= steps; index += 1) {
    const angle = (index / steps) * turns * Math.PI * 2;
    const radius = startRadius + growth * angle;
    const x = centre + Math.cos(angle) * radius;
    const y = centre + Math.sin(angle) * radius;
    points.push(`${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return points.join(" ");
}

const SPIRAL_D = spiralPath(3.1, 5, 4.7, 100);

export function AkimichiSpiral({
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
      <circle
        cx="100"
        cy="100"
        r="96"
        stroke="var(--cho-wing)"
        strokeOpacity="0.35"
        strokeWidth="1.4"
      />
      <path
        className={pathClassName}
        d={SPIRAL_D}
        stroke="var(--cho-wing)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* ── Kelebek kanatları ───────────────────────────────────────────────────
   Sağ kanat çizilip sol kanat aynalanıyor (translate + scale(-1 1)): tek
   geometri, iki kanat. Damarlar ayrı sınıf alıyor çünkü mod açıldığında
   yalnızca onlar "çiziliyor" (stroke-dashoffset). */

const WING_UPPER =
  "M120 74 C 150 34 196 6 224 12 C 240 16 236 52 214 72 C 196 88 156 92 120 82 Z";
const WING_LOWER =
  "M120 84 C 148 88 186 96 200 116 C 212 134 196 154 172 150 C 146 146 126 118 120 88 Z";
const WING_VEINS = [
  "M122 78 C 152 58 190 34 218 26",
  "M122 80 C 150 70 188 60 216 56",
  "M124 82 C 148 82 180 84 206 78",
  "M122 88 C 140 100 166 118 186 132",
  "M123 90 C 136 106 148 128 164 142",
];

function WingHalf({ veinClassName }: { veinClassName?: string }) {
  return (
    <g>
      <path d={WING_UPPER} fill="var(--cho-wing)" fillOpacity="0.22" />
      <path d={WING_LOWER} fill="var(--cho-wing)" fillOpacity="0.16" />
      <path
        d={WING_UPPER}
        stroke="var(--cho-wing)"
        strokeOpacity="0.7"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d={WING_LOWER}
        stroke="var(--cho-wing)"
        strokeOpacity="0.6"
        strokeWidth="1.2"
        fill="none"
      />
      <g
        stroke="var(--cho-wing)"
        strokeOpacity="0.5"
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
      >
        {WING_VEINS.map((d, index) => (
          <path
            key={d}
            className={veinClassName}
            data-vein={index + 1}
            d={d}
            pathLength={1}
          />
        ))}
      </g>
    </g>
  );
}

export function ButterflyWings({
  className,
  veinClassName,
}: {
  className?: string;
  veinClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 160"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <WingHalf veinClassName={veinClassName} />
      <g transform="translate(240 0) scale(-1 1)">
        <WingHalf veinClassName={veinClassName} />
      </g>
      {/* Gövde: kanatları birbirine bağlayan ince mil */}
      <ellipse
        cx="120"
        cy="82"
        rx="3.6"
        ry="26"
        fill="var(--cho-wing)"
        fillOpacity="0.4"
      />
    </svg>
  );
}

/* ── Cephanelik göstergesi: iç içe halkalar ──────────────────────────────
   Üç sabit halka, içinde büyüyen bir çekirdek. Baika'nın kendisi: dışarısı
   aynı kalır, içerideki kütle şişer. */

const RING_CORES = [6.5, 13, 22];

export function MassRing({
  level,
  className,
  coreClassName,
}: {
  /** 0 tabanlı teknik sırası (0 Baika, 1 Nikudan, 2 Kelebek) */
  level: number;
  className?: string;
  coreClassName?: string;
}) {
  const core = RING_CORES[Math.min(Math.max(level, 0), 2)] ?? RING_CORES[0];
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <circle
        cx="32"
        cy="32"
        r="29"
        stroke="var(--border-strong)"
        strokeWidth="1"
      />
      <circle
        cx="32"
        cy="32"
        r="21"
        stroke="var(--border-strong)"
        strokeWidth="0.8"
        strokeDasharray="2 4"
      />
      <circle
        cx="32"
        cy="32"
        r="13"
        stroke="var(--border-strong)"
        strokeWidth="0.8"
        strokeDasharray="2 4"
      />
      <circle
        className={coreClassName}
        cx="32"
        cy="32"
        r={core}
        fill="var(--accent)"
        fillOpacity="0.55"
      />
      <circle
        className={coreClassName}
        cx="32"
        cy="32"
        r={core}
        stroke="var(--accent)"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

/* ── Ölçü cetveli ────────────────────────────────────────────────────────
   "Ağırlık meselesi" bölümünün yanındaki dikey cetvel. Sayılar SVG'de DEĞİL:
   iki dilli olmaları ve seçilebilmeleri gerekiyor, o yüzden HTML tarafında
   duruyorlar. Buradaki iki işaret yalnızca onların hizasını gösteriyor. */

const RULE_TICKS = Array.from({ length: 19 }, (_, index) => 10 + index * 10);

export function MeasureRule({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 200"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <line
        x1="12"
        y1="6"
        x2="12"
        y2="194"
        stroke="var(--border-strong)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <g stroke="var(--border-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke">
        {RULE_TICKS.map((y) => (
          <line key={y} x1="12" y1={y} x2={y % 50 === 0 ? 22 : 17} y2={y} />
        ))}
      </g>
      {/* İki künye ölçüsünün hizası: üstteki 172,3 — alttaki 156,3 */}
      <g className={markClassName} stroke="var(--accent)" fill="var(--accent)">
        <line
          x1="4"
          y1="48"
          x2="22"
          y2="48"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="4"
          y1="132"
          x2="22"
          y2="132"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}

/* ── Dört küçük işaret ───────────────────────────────────────────────────
   Hepsi 32×32 kutuda, 1.5 birim çizgi, yuvarlak uç ve köşe. Emoji ya da
   Unicode karakter kullanılmadı: dört işaret de aynı kalemden çıkma. */

const HAND_MARKS = {
  /** Üç gözlü hap kutusu */
  case: (
    <>
      <path d="M8 12V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" />
      <rect x="4" y="12" width="24" height="14" rx="3" />
      <path d="M12 12v14M20 12v14" />
      <circle cx="8" cy="19" r="2.2" fill="var(--cho-pillGreen)" stroke="none" />
      <circle cx="16" cy="19" r="2.2" fill="var(--accent)" stroke="none" />
      <circle cx="24" cy="19" r="2.2" fill="var(--cho-pillRed)" stroke="none" />
    </>
  ),
  /** Kısmî büyüme: tek yumruk, iki yanında genişleme yayı */
  fist: (
    <>
      <rect x="11" y="12" width="12" height="12" rx="4" />
      <path d="M13 16h8M14 20h6" />
      <path d="M7 12a13 13 0 0 0 0 12" strokeDasharray="2 3" />
      <path d="M27 12a13 13 0 0 1 0 12" strokeDasharray="2 3" />
    </>
  ),
  /** Ino-Shika-Chō: üç hanafuda kartı */
  cards: (
    <>
      <rect x="3" y="9" width="8" height="16" rx="1.6" />
      <rect x="12" y="6" width="8" height="19" rx="1.6" />
      <rect x="21" y="9" width="8" height="16" rx="1.6" />
      <path d="M7 14v1M16 11v1M25 14v1" />
    </>
  ),
  /** Cips paketi: üstte dişli kapatma bandı */
  packet: (
    <>
      <path d="M9 9h14l3 17a2 2 0 0 1-2 2.4H8a2 2 0 0 1-2-2.4z" />
      <path d="M9 9l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2" />
      <path d="M12 16h8M11 21h10" strokeDasharray="2 3" />
    </>
  ),
} as const;

export type HandMarkName = keyof typeof HAND_MARKS;

export function HandMark({
  name,
  className,
}: {
  name: HandMarkName;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {HAND_MARKS[name]}
    </svg>
  );
}

/* ── Uyarı işareti: düzleşen kalp atışı ──────────────────────────────────
   Kırmızı hapın bedeli tek cümleyle "kalp durur". Üçgen-ünlem yerine tam
   olarak onu çizen bir işaret: iki atış, sonra düz çizgi. */

export function Flatline({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 44 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      <path d="M2 12h4l2.5-7 3.5 14 2.5-7h3" />
      <path d="M17.5 12h1.5l2-4 2 8 2-4h1.5" />
      <path d="M26.5 12H42" />
    </svg>
  );
}

/* ── Terazi şeması — sayfanın kalbi ──────────────────────────────────────
   Geometri: mil (60,88)→(60,30), mesnet (60,30), kiriş uçları x=26 ve x=94,
   kol uzunluğu 34. Kefeler kirişten 30 birim aşağıda.

   ⚠️ KİRİŞİN DÖNÜŞÜ CSS'TE: SVG öğelerinde transform-origin varsayılanı
   kullanıcı uzayının başlangıcı (0 0) olduğu için `rotate` doğrudan
   yazıldığında kiriş sayfanın dışına fırlar. Modülde `transform-box:
   view-box` + `transform-origin: 60px 30px` yazılı; burada yalnızca sınıf
   veriliyor.

   Kefeler kirişle birlikte DÖNMÜYOR, yalnızca ÖTELENİYOR (`translate`):
   gerçek bir terazide kefe daima yatay kalır. Öteleme miktarları da modülde,
   kademe başına yazılı — açının sinüsü ve kosinüsü elle hesaplandı
   (5° → 2,96 · 11° → 6,49 · 19° → 11,07 birim düşüş). */

/** Sağ kefedeki bedel taşları — aşağıdan yukarı diziliyor. */
const COST_WEIGHTS = [
  { step: 0, x: 84, y: 54.5, width: 20, height: 5 },
  { step: 1, x: 86, y: 49, width: 16, height: 5 },
  { step: 2, x: 88, y: 43.5, width: 12, height: 5 },
];

export function BalanceDiagram({
  step,
  title,
  className,
  frameClassName,
  beamClassName,
  panClassName,
  gainClassName,
  costClassName,
}: {
  /** 0 tabanlı hap sırası (0 yeşil, 1 sarı, 2 kırmızı) */
  step: number;
  /** Ekran okuyucuya inen açıklama; boşsa şema tamamen dekoratiftir */
  title?: string;
  className?: string;
  frameClassName?: string;
  beamClassName?: string;
  panClassName?: string;
  gainClassName?: string;
  costClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 108"
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {/* Gövde: ayak, mil, mesnet */}
      <g
        className={frameClassName}
        stroke="var(--border-strong)"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M44 98h32" strokeWidth="2.6" />
        <path d="M53 90h14l6 8H47z" fill="var(--surface)" />
        <path d="M60 90V32" />
      </g>
      <path
        d="M60 24l6.5 9h-13z"
        fill="var(--accent)"
        fillOpacity="0.75"
        stroke="var(--accent)"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Kiriş — kademeye göre sağa yatar */}
      <g className={beamClassName}>
        <path
          d="M26 30h68"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="26" cy="30" r="2" fill="var(--accent)" />
        <circle cx="94" cy="30" r="2" fill="var(--accent)" />
      </g>

      {/* SOL KEFE — kazanılan çakra */}
      <g className={panClassName} data-side="gain">
        <g
          stroke="var(--border-strong)"
          strokeWidth="0.9"
          strokeLinecap="round"
        >
          <path d="M26 30L17 59M26 30l9 29" />
        </g>
        <g className={gainClassName}>
          <circle cx="26" cy="52" r="9" fill="var(--accent)" fillOpacity="0.3" />
          <circle
            cx="26"
            cy="52"
            r="9"
            stroke="var(--accent)"
            strokeWidth="1.2"
          />
        </g>
        <path
          d="M14 60a14 9 0 0 0 24 0"
          stroke="var(--border-strong)"
          strokeWidth="1.4"
          fill="var(--surface)"
          fillOpacity="0.75"
        />
        <path d="M13 60h26" stroke="var(--border-strong)" strokeWidth="1.4" />
      </g>

      {/* SAĞ KEFE — ödenen bedel */}
      <g className={panClassName} data-side="cost">
        <g
          stroke="var(--border-strong)"
          strokeWidth="0.9"
          strokeLinecap="round"
        >
          <path d="M94 30l-9 29M94 30l9 29" />
        </g>
        <g fill="var(--cho-pillRed)" fillOpacity="0.55">
          {COST_WEIGHTS.map((weight) => (
            <rect
              key={weight.step}
              className={costClassName}
              data-on={step >= weight.step ? "true" : undefined}
              x={weight.x}
              y={weight.y}
              width={weight.width}
              height={weight.height}
              rx="1.2"
            />
          ))}
        </g>
        <path
          d="M82 60a14 9 0 0 0 24 0"
          stroke="var(--border-strong)"
          strokeWidth="1.4"
          fill="var(--surface)"
          fillOpacity="0.75"
        />
        <path d="M81 60h26" stroke="var(--border-strong)" strokeWidth="1.4" />
      </g>
    </svg>
  );
}
