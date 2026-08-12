import {
  KURO_MARK_PATH,
  KURO_MARK_VIEWBOX,
  NEXUS_WORD_PATH,
  NEXUS_WORD_VIEWBOX,
} from "./paths";

/**
 * 黒 mührü. Aynı vektör iki şekilde çizilebilir:
 *
 *   variant="outline" → kontur (fill yok, stroke var). Kimlik paketindeki
 *                       "asıl" hâl. **Yaklaşık 40px altında okunmaz olur**:
 *                       konturlar birbirine değip glifi lekeye çevirir.
 *                       Bu yüzden yalnızca ana sayfa holünde kullanılıyor.
 *   variant="solid"    → dolgu. Küçük boyutta net kalır; header, footer ve
 *                       favicon bunu kullanır (paketin favicon'u da dolgu).
 *
 * Renk verilmez: `currentColor` ile çağıranın CSS'inden gelir, böylece aynı
 * işaret header'da `var(--accent)`, holde `var(--hub-gold)` olabilir
 * (AGENTS.md kural 16 — bileşen hex yazmaz, token okur).
 *
 * `strokeWidth` viewBox birimindedir (200x200): işaret büyütülünce çizgi de
 * orantılı kalınlaşır, oran her boyutta korunur.
 */
export function KuroMark({
  className,
  variant = "outline",
  strokeWidth = 1.8,
}: {
  className?: string;
  variant?: "outline" | "solid";
  strokeWidth?: number;
}) {
  const isSolid = variant === "solid";
  return (
    <svg
      className={className}
      viewBox={KURO_MARK_VIEWBOX}
      fill={isSolid ? "currentColor" : "none"}
      stroke={isSolid ? undefined : "currentColor"}
      strokeWidth={isSolid ? undefined : strokeWidth}
      strokeLinejoin={isSolid ? undefined : "round"}
      aria-hidden
      focusable="false"
    >
      <path fillRule="evenodd" d={KURO_MARK_PATH} />
    </svg>
  );
}

/**
 * NEXUS kelime işareti — dolgu çizim. Rengi yine `currentColor`.
 */
export function NexusWordmark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={NEXUS_WORD_VIEWBOX}
      fill="currentColor"
      aria-hidden
      focusable="false"
    >
      <path fillRule="evenodd" d={NEXUS_WORD_PATH} />
    </svg>
  );
}
