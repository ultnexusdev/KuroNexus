/**
 * Akatsuki bulutu — kod içinde çizilen vektör motif.
 *
 * Neden SVG, neden kodda: bu bir İÇERİK görseli değil, kanadın süsleme
 * malzemesi (❖ ayracı ya da spor bayrak şeritleri sınıfı). Dosya yok,
 * dış istek yok; renkler token'dan okunur (kural 16) — tema/deri değişince
 * bulut da uyar.
 *
 * Kontur + dolgu iki ayrı token: dolgu `--aka-crimson`, kontur `--aka-paper`.
 * Kullanan yer `color`/`opacity` ile yalnızca yoğunluğu ayarlar.
 */
export function AkatsukiCloud({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 76"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      <path
        d="M20 52
           C11 52 5 46 5 38
           C5 30 11 24 19 24
           C20 14 29 7 39 9
           C44 3 53 0 60 4
           C68 -1 78 2 82 9
           C92 7 101 14 102 24
           C110 26 115 33 114 41
           C113 49 105 55 97 54
           C95 61 89 65 82 64
           C79 70 71 74 64 70
           C57 75 47 74 43 67
           C34 70 25 65 24 57
           C22 55 21 53 20 52 Z"
        fill="var(--aka-crimson)"
        stroke="var(--aka-paper)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Bulutun karakteristik alt kıvrımı — küçük iç bükey çentik */}
      <path
        d="M50 70 C54 62 62 60 68 64"
        fill="none"
        stroke="var(--aka-paper)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
