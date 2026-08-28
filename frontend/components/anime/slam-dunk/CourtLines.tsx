/**
 * KUŞ BAKIŞI SAHA — sayfanın zemin çizimi.
 *
 * ── NEDEN SVG, NEDEN BİLEŞEN ─────────────────────────────────────────────
 * Saha üç yerde çiziliyor (hero zemini, imleçle parlayan üst kopya, devre
 * arası bandı) ve üçünde de AYNI çizgiler olmak zorunda. Bir dosya olsaydı
 * üç istek giderdi; üç ayrı CSS gradyanı olsaydı üçü ayrışırdı. Tek bileşen,
 * tek kaynak.
 *
 * ── ÖLÇÜLER GERÇEK ───────────────────────────────────────────────────────
 * `viewBox` 280×150 ve 10 birim = 1 metre: FIBA sahası 28×15 m. Orta daire
 * 1,8 m yarıçap, boyalı alan 5,8×4,9 m, üç sayı yayı 6,75 m. Yani bu bir
 * "basketbol sahasına benzeyen desen" değil, ölçekli bir kroki.
 *
 * ⚠️ `aria-hidden`: çizim dekoratif. Yanındaki metin sahnenin ne olduğunu
 * zaten söylüyor ve bir ekran okuyucuya saha çizgilerini tarif etmek
 * gürültüden başka bir şey olmazdı.
 */
export function CourtLines({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 280 150"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {/* Bütün çizgiler tek grupta: kalınlık ve renk tek yerden.
          `vector-effect` ölçekten bağımsız ince çizgi veriyor — saha
          ekranı kapladığında çizgiler kalınlaşmıyor. */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
        vectorEffect="non-scaling-stroke"
      >
        {/* Dış sınır */}
        <rect x="2" y="2" width="276" height="146" />

        {/* Orta çizgi ve orta daire */}
        <line x1="140" y1="2" x2="140" y2="148" />
        <circle cx="140" cy="75" r="18" />

        {/* ── SOL YARI ── */}
        {/* Boyalı alan (5,8 × 4,9 m) */}
        <rect x="2" y="50.5" width="58" height="49" />
        {/* Serbest atış dairesi */}
        <circle cx="60" cy="75" r="18" />
        {/* Üç sayı yayı: köşe düzlükleri + 6,75 m yay */}
        <path d="M2 9 H15.75 A66 66 0 0 1 15.75 141 H2" />
        {/* Pota ve çember */}
        <line x1="9" y1="66" x2="9" y2="84" />
        <circle cx="13" cy="75" r="2.3" />

        {/* ── SAĞ YARI (ayna) ── */}
        <rect x="220" y="50.5" width="58" height="49" />
        <circle cx="220" cy="75" r="18" />
        <path d="M278 9 H264.25 A66 66 0 0 0 264.25 141 H278" />
        <line x1="271" y1="66" x2="271" y2="84" />
        <circle cx="267" cy="75" r="2.3" />
      </g>
    </svg>
  );
}
