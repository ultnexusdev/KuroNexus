import type { MegumiSigil } from "@/lib/characters/megumi-fushiguro-experience";

/**
 * Megumi sayfasının elle çizilmiş SVG'leri — SUNUCU bileşeni.
 *
 * `"use client"` YOK ve olmayacak: burada durum yok, yalnızca yol verisi var.
 * İstemci adası sayısı (en fazla 3) bu dosyayı saymıyor — kendi başına bir
 * ada açmıyor. Sunucudan da (`ShadowMenagerieExperience`) istemciden de
 * (`ShadowPool`) çağrılıyor; ikinci durumda o adanın paketine giriyor ama
 * bir sınır AÇMIYOR, çünkü kanca ve olay taşımıyor.
 *
 * ── NEDEN ÇİZİM, NEDEN RASTER DEĞİL ──────────────────────────────────────
 * Faz 2 §3: sahne/teknik görselleri ÜRETİLMİYOR ve dışarıdan raster
 * indirilmiyor. Motif gerekiyorsa elle çizilir. Sayfadaki bütün mühürler,
 * gölge kütleleri ve on yaratık işareti buradan geliyor.
 *
 * ── FİLİGRAN: ÇAĞIRMA MÜHRÜ ──────────────────────────────────────────────
 * `SummonSeal` bir el işareti mührü: ortada iki elin birleştiği kavuşma
 * noktası (iki yay), etrafında mühür halkası ve halkadan dışarı taşan
 * dokuz kısa vuruş. Dokuz, çağrılabilir dokuz kapının sayısı; onuncu vuruş
 * bilerek yok (魔虚羅 kilitli).
 *
 * ── YARATIK İŞARETLERİ ───────────────────────────────────────────────────
 * `BeastSigil` on ayrı MÜHÜR çiziyor — ayakta duran siluet değil. Eski
 * sayfa (`.deprecated/`) yaratıkları bir zemin çizgisinin üstünde duran
 * siluetler olarak çiziyordu; o dil yasak listesinde. Buradaki dil damga:
 * dairesel bir mühür alanı ve içinde birkaç fırça vuruşu.
 */

export function SummonSeal({
  className,
  ringClassName,
  strokeClassName,
  coreClassName,
}: {
  className?: string;
  ringClassName?: string;
  strokeClassName?: string;
  coreClassName?: string;
}) {
  /* Halkadan dışarı taşan dokuz vuruş — açıları elle dağıtıldı, eşit
     aralıklı değil: mühür basılmış gibi görünsün, üretilmiş gibi değil. */
  const ticks = [8, 46, 84, 130, 168, 212, 254, 296, 334];
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      role="presentation"
      focusable="false"
    >
      <circle className={ringClassName} cx="100" cy="100" r="78" fill="none" />
      <circle className={ringClassName} cx="100" cy="100" r="62" fill="none" />
      {ticks.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            className={strokeClassName}
            x1={100 + Math.cos(rad) * 79}
            y1={100 + Math.sin(rad) * 79}
            x2={100 + Math.cos(rad) * 94}
            y2={100 + Math.sin(rad) * 94}
          />
        );
      })}
      {/* İki elin kavuşması: iki yay, uçları birbirine değiyor */}
      <path
        className={coreClassName}
        d="M62 118 C 62 84, 84 62, 118 62"
        fill="none"
      />
      <path
        className={coreClassName}
        d="M138 82 C 138 116, 116 138, 82 138"
        fill="none"
      />
      <path className={strokeClassName} d="M74 74 L 126 126" fill="none" />
      <path className={strokeClassName} d="M126 74 L 74 126" fill="none" />
    </svg>
  );
}

/**
 * Gölge kütlesi — havuz şeridinin üst kenarındaki akışkan sınır.
 *
 * Tek bir kapalı yol; kenarı düz değil, üç tümsekli. Deformasyon CSS'te
 * (`border-radius` animasyonu) yapılıyor, bu yol yalnızca durgun hâli
 * veriyor ki hareket kapalıyken de bir kenar görünsün.
 */
export function ShadowEdge({
  className,
  fillClassName,
}: {
  className?: string;
  fillClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 40"
      preserveAspectRatio="none"
      role="presentation"
      focusable="false"
    >
      <path
        className={fillClassName}
        d="M0 40 L0 22 C 60 4, 110 30, 168 20 C 226 10, 258 32, 316 26 C 374 20, 410 2, 468 14 C 520 25, 556 12, 600 20 L600 40 Z"
      />
    </svg>
  );
}

/**
 * Mahoraga'nın çarkı — sekiz kollu, dışı sekizgen.
 *
 * Yalnızca kilit açıldığında ve ritüel okunduğunda çiziliyor; dönmesi CSS
 * animasyonuyla (`prefers-reduced-motion` kapısında).
 */
export function WheelMark({
  className,
  rimClassName,
  spokeClassName,
}: {
  className?: string;
  rimClassName?: string;
  spokeClassName?: string;
}) {
  const spokes = [0, 45, 90, 135, 180, 225, 270, 315];
  const rim = spokes
    .map((deg) => {
      const rad = (deg * Math.PI) / 180;
      return `${100 + Math.cos(rad) * 70},${100 + Math.sin(rad) * 70}`;
    })
    .join(" ");
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      role="presentation"
      focusable="false"
    >
      <polygon className={rimClassName} points={rim} fill="none" />
      <circle className={rimClassName} cx="100" cy="100" r="26" fill="none" />
      {spokes.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            className={spokeClassName}
            x1={100 + Math.cos(rad) * 26}
            y1={100 + Math.sin(rad) * 26}
            x2={100 + Math.cos(rad) * 70}
            y2={100 + Math.sin(rad) * 70}
          />
        );
      })}
    </svg>
  );
}

/* ── On mühür ─────────────────────────────────────────────────────────────
   Her biri 0 0 64 64 kutusunda, birkaç vuruş. Damga dili: dış halka her
   zaman aynı, içerideki vuruş her yaratıkta başka. */

const SIGIL_PATHS: Record<MegumiSigil, string[]> = {
  /* İki köpek: aynı gövde, beyaz olanın çenesi KIRIK (yol yarıda kesik) */
  dogWhite: ["M18 40 L28 26 L40 26 L48 36", "M40 26 L44 18", "M22 44 L30 44"],
  dogBlack: [
    "M16 42 L26 24 L42 24 L50 38 L44 46 L22 46 Z",
    "M42 24 L47 15",
    "M26 24 L21 15",
  ],
  /* Kurbağa: geniş taban + uzayan dil */
  toad: ["M16 44 Q32 22 48 44 Z", "M32 36 L32 18 L46 12"],
  /* Yılan: tek uzun kıvrım */
  serpent: ["M12 46 C 24 18, 40 50, 52 20", "M52 20 L56 16"],
  /* Fil: gövde + hortum */
  elephant: ["M18 44 L18 28 Q32 16 46 28 L46 44", "M32 44 C 32 54, 44 54, 44 44"],
  /* Tavşan: küçük gövde + iki uzun kulak, çoğul olduğu için ikinci siluet */
  rabbit: [
    "M22 46 Q26 34 34 34 Q42 34 42 46",
    "M28 34 L26 16",
    "M36 34 L40 16",
    "M46 46 Q48 40 52 40",
  ],
  /* Nue: açık iki kanat + gövde */
  nue: ["M10 26 L30 38 L54 24", "M30 38 L30 50", "M22 44 L38 44"],
  /* Öküz: tek yönlü koşu — gövde ve öne uzayan iki boynuz */
  ox: ["M16 42 L44 42 L50 32", "M44 42 L52 46", "M18 32 L28 24 L38 32"],
  /* Geyik: halka boynuz */
  deer: [
    "M32 48 L32 30",
    "M32 30 C 20 30, 18 16, 30 18",
    "M32 30 C 44 30, 46 16, 34 18",
  ],
  /* Çark: sekizgen ipucu */
  wheel: ["M32 14 L46 22 L46 42 L32 50 L18 42 L18 22 Z", "M32 22 L32 42", "M22 27 L42 37"],
};

export function BeastSigil({
  sigil,
  className,
  ringClassName,
  strokeClassName,
}: {
  sigil: MegumiSigil;
  className?: string;
  ringClassName?: string;
  strokeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role="presentation"
      focusable="false"
    >
      <circle className={ringClassName} cx="32" cy="32" r="29" fill="none" />
      {SIGIL_PATHS[sigil].map((d) => (
        <path key={d} className={strokeClassName} d={d} fill="none" />
      ))}
    </svg>
  );
}
