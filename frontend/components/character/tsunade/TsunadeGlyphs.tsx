/**
 * Tsunade sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §3.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor — emsal
 * `components/character/itachi/SharinganEyes.tsx` ve Shikamaru'nun
 * `ShadowGlyphs.tsx`i. Renkler yalnızca token'dan geliyor (`--tsu-*` ve
 * standart set, modülün başındaki deri bloğu), bu dosyada da tek hex yok.
 *
 * ⚠️ `id` KULLANILMIYOR. Sayfada beş kart arkası, beş nişan ve iki mühür
 * aynı anda çiziliyor; `<pattern>`/`<clipPath>` kimliği tekrar ederdi ve
 * tekrarlanan id geçersiz HTML üretir. Bunun yerine desenler döngüyle
 * gerçek yollara açılıyor — dosya biraz uzuyor, belge geçerli kalıyor.
 *
 * Hareket CSS'te: bileşenler yalnızca `className` alıp geometriyi çiziyor,
 * hangi çizginin ne zaman görüneceğini `data-*` nitelikleri söylüyor. Böylece
 * modül sonundaki reduced-motion battaniyesi hepsini tek yerden durdurabiliyor.
 *
 * ⚠️ Bu dosyada "use client" YOK. Sunucu bileşeni de (hero mührü, fiş dokusu)
 * istemci adası da (kart yüzleri) aynı bileşenleri çağırıyor; düz JSX olduğu
 * için istemci paketine ek bağımlılık getirmiyor.
 */

/* ── Fiş dokusu — hero ve masa zemininde ─────────────────────────────────
   Masaya dağılmış jetonlar: her fiş bir çember + kenarındaki altı çentik.
   Çentikler gerçek fişlerdeki kenar işaretleri; onlar olmadan grafik "daire
   deseni" gibi okunuyordu. Opaklık ve ölçek elle dağıtıldı ki ızgara
   hissi vermesin. */

const CHIPS: { x: number; y: number; r: number; a: number; rot: number }[] = [
  { x: 118, y: 96, r: 34, a: 0.9, rot: 12 },
  { x: 262, y: 58, r: 22, a: 0.55, rot: 40 },
  { x: 402, y: 128, r: 44, a: 1, rot: -18 },
  { x: 556, y: 74, r: 26, a: 0.6, rot: 25 },
  { x: 688, y: 152, r: 36, a: 0.85, rot: -8 },
  { x: 842, y: 66, r: 20, a: 0.45, rot: 55 },
  { x: 946, y: 138, r: 40, a: 0.75, rot: 30 },
  { x: 196, y: 236, r: 28, a: 0.5, rot: -35 },
  { x: 486, y: 268, r: 24, a: 0.45, rot: 15 },
  { x: 772, y: 252, r: 32, a: 0.6, rot: -22 },
];

/** Bir fişin kenarındaki altı çentik — açıya göre iki uçlu kısa çizgiler. */
function chipNotches(r: number): string {
  const parts: string[] = [];
  for (let index = 0; index < 6; index += 1) {
    const angle = (Math.PI / 3) * index;
    const inner = r * 0.74;
    parts.push(
      `M${(Math.cos(angle) * inner).toFixed(2)} ${(Math.sin(angle) * inner).toFixed(2)}` +
        `L${(Math.cos(angle) * r).toFixed(2)} ${(Math.sin(angle) * r).toFixed(2)}`,
    );
  }
  return parts.join(" ");
}

export function ChipField({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1040 320"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable="false"
    >
      <g stroke="var(--tsu-chip)" fill="none" strokeWidth="1.5">
        {CHIPS.map((chip) => (
          <g
            key={`${chip.x}-${chip.y}`}
            transform={`translate(${chip.x} ${chip.y}) rotate(${chip.rot})`}
            opacity={chip.a}
          >
            <circle r={chip.r} />
            <circle r={chip.r * 0.68} strokeDasharray="3 5" />
            <path d={chipNotches(chip.r)} />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ── Byakugō no In — alındaki eşkenar dörtgen ────────────────────────────
   İki katman: mührün kendisi (her zaman görünür) ve ondan yayılan sekiz
   çizgi (yalnızca Sōzō Saisei modunda çizilir). Çizgilerin hepsinde
   `pathLength="1"` var — böylece uzunlukları farklı olsa da CSS tek bir
   `stroke-dasharray: 1` ile hepsini aynı anda ve aynı hızda çizebiliyor. */

const SEAL_LINES = [
  "M60 46 C 58 32 44 26 30 24 C 18 22 10 16 6 6",
  "M60 46 C 62 32 76 26 90 24 C 102 22 110 16 114 6",
  "M50 60 C 36 60 26 68 18 78 C 10 88 4 92 0 94",
  "M70 60 C 84 60 94 68 102 78 C 110 88 116 92 120 94",
  "M56 72 C 50 88 52 102 58 114",
  "M64 72 C 70 88 68 102 62 114",
  "M52 54 C 38 48 26 48 14 52",
  "M68 54 C 82 48 94 48 106 52",
];

export function ByakugoSeal({
  className,
  lineClassName,
}: {
  className?: string;
  lineClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g stroke="var(--tsu-seal)" strokeLinecap="round" fill="none">
        {SEAL_LINES.map((line, index) => (
          <path
            key={line}
            className={lineClassName}
            data-line={index + 1}
            d={line}
            pathLength="1"
            strokeWidth="1.4"
          />
        ))}
      </g>
      {/* Mühür: dolu eşkenar dörtgen + içinde bir tık küçüğü, ikisi arasında
          bir nefes payı. Tsunade'de mühür tek bir baklava; Sakura'nınki de
          aynı biçim — ayrım renkte değil, sayfanın ona yüklediği anlamda. */}
      <path d="M60 42 L74 60 L60 78 L46 60 Z" fill="var(--tsu-seal)" />
      <path
        d="M60 50 L68 60 L60 70 L52 60 Z"
        fill="none"
        stroke="var(--bg)"
        strokeWidth="1.2"
      />
    </svg>
  );
}

/** Mod düğmesinin gliffi — mührün küçük hâli, iki yayılma çizgisiyle. */
export function SealMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path d="M12 4 L18 12 L12 20 L6 12 Z" fill="currentColor" />
      <path
        d="M12 8.4 L15.4 12 L12 15.6 L8.6 12 Z"
        fill="none"
        stroke="var(--bg)"
        strokeWidth="1.1"
      />
    </svg>
  );
}

/* ── Masanın kenarı ──────────────────────────────────────────────────────
   Kumar masasının önündeki yay: bir dış kenar, bir de oyuncuların önünde
   duran ikinci hat. Bölümün üstünde durur ve "burası bir masa" der. */

export function TableRail({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 90"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <g stroke="var(--gold)" fill="none" strokeLinecap="round">
        <path d="M0 84 C 210 18 420 2 600 2 C 780 2 990 18 1200 84" strokeWidth="1.4" />
        <path
          d="M0 88 C 210 30 420 16 600 16 C 780 16 990 30 1200 88"
          strokeWidth="1"
          opacity="0.5"
          strokeDasharray="2 8"
        />
      </g>
    </svg>
  );
}

/* ── Kart arkası ─────────────────────────────────────────────────────────
   Mühürün baklavası bir dokuya çevrildi: yedi sıra, sıralar arası kaydırma.
   Kartın kendi kenarı da burada (çift çerçeve — gerçek iskambil kenarı). */

const LATTICE: { x: number; y: number }[] = [];
for (let row = 0; row < 8; row += 1) {
  for (let col = 0; col < 5; col += 1) {
    LATTICE.push({
      x: 14 + col * 18 + (row % 2 === 0 ? 0 : 9),
      y: 16 + row * 15,
    });
  }
}

export function CardBack({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 140"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <rect
        x="1"
        y="1"
        width="98"
        height="138"
        rx="5"
        fill="var(--surface)"
        stroke="var(--border-strong)"
        strokeWidth="1.5"
      />
      <rect
        x="6.5"
        y="6.5"
        width="87"
        height="127"
        rx="3"
        fill="none"
        stroke="var(--tsu-seal)"
        strokeWidth="0.8"
        opacity="0.45"
      />
      <g fill="var(--tsu-seal)" opacity="0.3">
        {LATTICE.map((cell) => (
          <path
            key={`${cell.x}-${cell.y}`}
            d={`M${cell.x} ${cell.y - 4.4} L${cell.x + 3.2} ${cell.y} L${cell.x} ${cell.y + 4.4} L${cell.x - 3.2} ${cell.y} Z`}
          />
        ))}
      </g>
    </svg>
  );
}

/* ── Kart yüzlerinin nişanları ───────────────────────────────────────────
   Beş nişan, beş bahis. Hiçbiri iskambil sembolü değil — hepsi Tsunade'nin
   kendi eşyaları: kolyenin taşı, bir damla kan, yılan, Uzumaki sarmalı ve
   ikiye ayrılan Katsuyu. */

type SuitKey = "crystal" | "drop" | "serpent" | "spiral" | "slug";

function SuitShape({ suit }: { suit: SuitKey }) {
  switch (suit) {
    case "crystal":
      /* Birinci'nin kolyesindeki taş — dış baklava, iki faseta çizgisi */
      return (
        <g stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="none">
          <path d="M12 2.6 L18.4 12 L12 21.4 L5.6 12 Z" />
          <path d="M5.6 12 L18.4 12" strokeWidth="0.9" />
          <path d="M12 2.6 L9 12 L12 21.4" strokeWidth="0.9" />
        </g>
      );
    case "drop":
      /* Dan'ın kanı — tek damla, dolu */
      return (
        <path
          d="M12 2.4 C 12 2.4 18.8 11 18.8 15.2 A 6.8 6.8 0 0 1 5.2 15.2 C 5.2 11 12 2.4 12 2.4 Z"
          fill="currentColor"
        />
      );
    case "serpent":
      /* Orochimaru — tek çizgide bir yılan, başında bir göz */
      return (
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none">
          <path d="M4.6 19.6 C 10.6 19.6 6.8 13.4 11.8 12 C 16.8 10.6 12.6 6.2 18.4 4.8" />
          <circle cx="19.1" cy="4.6" r="1.5" fill="currentColor" stroke="none" />
        </g>
      );
    case "spiral":
      /* Naruto — Uzumaki sarmalı, ardışık yarım çemberlerle */
      return (
        <g
          transform="translate(-1.3 0.4)"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M12 12 a1.5 1.5 0 0 1 3 0 a2.4 2.4 0 0 1 -4.8 0 a3.3 3.3 0 0 1 6.6 0 a4.2 4.2 0 0 1 -8.4 0 a5.1 5.1 0 0 1 10.2 0" />
        </g>
      );
    case "slug":
    default:
      /* Katsuyu — gövde, iki göz sapı ve bölündüğü hat */
      return (
        <g stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="none">
          <path d="M4 17.6 C 4 13.2 7.6 10.2 12 10.2 C 16.4 10.2 20 12.6 20 16 C 20 18.4 18.4 19.6 16 19.6 L6.4 19.6 C 4.9 19.6 4 18.8 4 17.6 Z" />
          <path d="M9.4 10.6 C 8.6 7.8 7.6 6.4 6.6 5.2" strokeLinecap="round" />
          <path d="M13.4 10.4 C 13.8 7.6 14.6 6 15.6 4.6" strokeLinecap="round" />
          <circle cx="6.4" cy="4.6" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="15.8" cy="4" r="1.1" fill="currentColor" stroke="none" />
          <path d="M12 10.4 L12 19.4" strokeWidth="0.9" strokeDasharray="1.6 2" />
        </g>
      );
  }
}

/**
 * Kartın ön yüzü. Gerçek bir iskambil gibi kurulu: iki köşede rakam ve
 * nişan (biri 180° dönük), ortada büyük nişan. Rakam metin olarak SVG'de
 * DEĞİL — HTML katmanında duruyor ki font ailesi ve tabular rakamlar
 * sayfanın geri kalanıyla aynı olsun; burada yalnızca çizim var.
 */
export function CardFaceArt({
  suit,
  className,
}: {
  suit: SuitKey;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 140"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <rect
        x="1"
        y="1"
        width="98"
        height="138"
        rx="5"
        fill="var(--tsu-slug)"
        stroke="var(--border-strong)"
        strokeWidth="1.5"
      />
      <rect
        x="6.5"
        y="6.5"
        width="87"
        height="127"
        rx="3"
        fill="none"
        stroke="var(--bg)"
        strokeWidth="0.7"
        opacity="0.28"
      />
      <g color="var(--bg)">
        {/* Köşe nişanları — küçük, rakamın hemen altında */}
        <g transform="translate(9 22) scale(0.62)" opacity="0.85">
          <SuitShape suit={suit} />
        </g>
        <g transform="translate(91 118) scale(0.62) rotate(180)" opacity="0.85">
          <SuitShape suit={suit} />
        </g>
        {/* Merkez nişanı */}
        <g transform="translate(24 44) scale(2.17)">
          <SuitShape suit={suit} />
        </g>
      </g>
    </svg>
  );
}

/* ── Kan korkusu bölümünün tek gliffi ────────────────────────────────────
   Sayfada hareket etmeyen tek grafik. Bölümün fikri sessizlik: damla
   titremiyor, parlamıyor, nefes almıyor. Duruyor. */

export function BloodDrop({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 40"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M16 2 C 16 2 29 17.5 29 25 A 13 13 0 0 1 3 25 C 3 17.5 16 2 16 2 Z"
        fill="var(--tsu-luck)"
      />
      <path
        d="M11 24.5 C 11 20.5 13 17.5 15 15"
        stroke="var(--bg)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}
