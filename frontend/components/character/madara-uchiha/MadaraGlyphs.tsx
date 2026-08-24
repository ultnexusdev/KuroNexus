/**
 * Madara Uchiha — sayfanın elle çizilmiş SVG seti.
 *
 * BRIEF §4.4: dışarıdan raster görsel indirilmiyor, hotlink edilmiyor.
 * Sayfadaki motiflerin tamamı burada, `currentColor` ile çiziliyor — rengi
 * çağıran CSS sınıfı veriyor, yani dosyada tek bir renk değeri yok.
 *
 * Hepsi SUNUCU bileşeni: hareketin tamamı CSS'te, JS inmiyor. Hiçbiri
 * ekran okuyucuya görünmüyor (`aria-hidden`), çünkü hepsi dekoratif; anlam
 * taşıyan her şey metinde yazılı.
 *
 * ⚠️ Bu sayfanın motifleri bilerek GÖZ DEĞİL: Sasuke sayfası (yayında) göz
 * ve dikey yarık kullanıyor. Madara'nın meselesi ölçek olduğu için buradaki
 * işaretler kül, saç, ay, kaburga ve yelpaze.
 */

/** Kül serpintisi — el ile konumlanmış üç bantlık nokta bulutu. */
const ASH_FLECKS: ReadonlyArray<readonly [number, number, number, 1 | 2 | 3]> = [
  [14, 38, 1.6, 1],
  [47, 12, 1.1, 2],
  [63, 96, 2.1, 1],
  [88, 44, 1.3, 3],
  [102, 158, 1.7, 2],
  [126, 22, 1, 1],
  [141, 118, 2.4, 3],
  [158, 71, 1.4, 2],
  [173, 196, 1.2, 1],
  [190, 33, 1.9, 3],
  [206, 132, 1.1, 2],
  [222, 88, 1.5, 1],
  [239, 178, 2.2, 3],
  [255, 27, 1.3, 2],
  [271, 112, 1.7, 1],
  [287, 63, 1.1, 3],
  [304, 206, 1.9, 2],
  [321, 41, 1.4, 1],
  [338, 149, 1.2, 3],
  [355, 84, 2, 2],
  [371, 18, 1.5, 1],
  [388, 124, 1.1, 3],
  [22, 214, 1.8, 2],
  [58, 262, 1.2, 3],
  [94, 236, 1.6, 1],
  [131, 288, 2.3, 2],
  [167, 246, 1.1, 3],
  [203, 302, 1.4, 1],
  [240, 258, 1.9, 2],
  [276, 324, 1.2, 3],
  [312, 276, 1.7, 1],
  [349, 332, 1.3, 2],
  [383, 268, 2.1, 3],
  [9, 352, 1.4, 1],
  [45, 398, 1.1, 3],
  [81, 366, 2.2, 2],
  [118, 424, 1.3, 1],
  [154, 378, 1.6, 3],
  [191, 438, 1.1, 2],
  [227, 392, 2, 1],
  [263, 452, 1.4, 3],
  [299, 406, 1.2, 2],
  [336, 462, 1.8, 1],
  [372, 414, 1.1, 3],
  [17, 486, 1.6, 2],
  [54, 542, 1.2, 1],
  [91, 502, 2.1, 3],
  [128, 566, 1.3, 2],
  [165, 514, 1.5, 1],
  [201, 578, 1.1, 3],
  [238, 528, 1.9, 2],
  [274, 592, 1.2, 1],
  [311, 546, 1.7, 3],
  [347, 604, 1.3, 2],
  [384, 558, 1.4, 1],
];

/**
 * Kül yağmuru. Üç bant ayrı hızda süzülüyor (`data-band`), böylece tek
 * katman gibi değil derinlikli bir serpinti okunuyor.
 */
export function AshFall({
  className,
  fleckClassName,
}: {
  className?: string;
  fleckClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 620"
      fill="none"
      aria-hidden
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      {ASH_FLECKS.map(([x, y, r, band]) => (
        <circle
          key={`${x}-${y}`}
          className={fleckClassName}
          data-band={band}
          cx={x}
          cy={y}
          r={r}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

/**
 * Uzun saç silueti — kadrajı kesen altı tel.
 *
 * Dolgu `currentColor`: hero'da zeminin kendisiyle aynı aileden bir ton
 * verilir, yani saç bir "çizim" gibi değil kadrajın kesildiği yer gibi
 * okunur.
 */
export function HairFall({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 520"
      fill="none"
      aria-hidden
      focusable="false"
      preserveAspectRatio="none"
    >
      <path
        d="M0 0 C 10 130 26 250 62 352 C 86 420 118 470 148 520 L 96 520 C 66 462 40 396 24 322 C 8 244 0 122 0 0 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M46 0 C 58 118 76 226 116 318 C 140 374 170 438 196 520 L 158 520 C 132 452 106 388 84 320 C 60 244 46 124 40 0 Z"
        fill="currentColor"
        opacity="0.72"
      />
      <path
        d="M104 0 C 112 106 128 208 164 296 C 188 356 218 428 240 520 L 210 520 C 190 448 166 380 144 316 C 118 240 104 122 98 0 Z"
        fill="currentColor"
        opacity="0.54"
      />
      <path
        d="M164 0 C 170 96 184 190 214 272 C 238 336 264 412 282 520 L 256 520 C 240 440 220 372 200 310 C 178 238 166 118 158 0 Z"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M226 0 C 230 92 242 178 266 256 C 288 326 306 410 318 520 L 296 520 C 284 436 268 366 250 302 C 232 234 226 116 220 0 Z"
        fill="currentColor"
        opacity="0.28"
      />
      <path
        d="M284 0 C 286 84 294 164 310 236 C 316 268 319 300 320 332 L 320 0 Z"
        fill="currentColor"
        opacity="0.18"
      />
    </svg>
  );
}

/**
 * Ay işareti — mod düğmesinin ve kapanışın simgesi.
 *
 * Hilal + üç kök: Sonsuz Tsukuyomi'nin iki yarısı (gökteki ay, yerdeki
 * ağaç). Bilerek daire değil hilal: dolu bir daire göz gibi okunurdu.
 */
export function MoonMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M20.4 3.2a11.6 11.6 0 1 0 5.4 20.9 9.4 9.4 0 0 1-5.4-17.3 9.4 9.4 0 0 1 4.6-1.2 11.5 11.5 0 0 0-4.6-2.4Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M16 24.5v5M16 27.2l-4.4 2.6M16 27.2l4.4 2.6"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

/**
 * Rüya kökleri — mod açıkken kenarlardan içeri giren kök/dal deseni.
 *
 * Tek bileşen iki kenarda da kullanılıyor; sağ kenarda CSS `scaleX(-1)`
 * uyguluyor, yani ikinci bir çizim yok.
 */
export function DreamRoots({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 720"
      fill="none"
      aria-hidden
      focusable="false"
      preserveAspectRatio="none"
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M0 40 C 30 70 44 118 46 176 C 48 240 34 300 38 366 C 42 442 66 498 74 566 C 80 618 74 668 58 716" strokeWidth="1.6" opacity="0.8" />
        <path d="M46 176 C 66 168 84 152 96 128" strokeWidth="1.1" opacity="0.6" />
        <path d="M96 128 C 104 120 112 116 120 114" strokeWidth="0.9" opacity="0.45" />
        <path d="M38 366 C 60 372 80 366 98 348" strokeWidth="1.1" opacity="0.6" />
        <path d="M98 348 C 106 342 113 340 120 340" strokeWidth="0.9" opacity="0.45" />
        <path d="M74 566 C 90 560 102 546 110 526" strokeWidth="1" opacity="0.5" />
        <path d="M0 232 C 22 244 34 270 36 302" strokeWidth="1" opacity="0.5" />
        <path d="M0 470 C 26 480 44 506 52 540" strokeWidth="1" opacity="0.5" />
        <path d="M0 664 C 20 668 34 682 42 704" strokeWidth="0.9" opacity="0.4" />
        <path d="M0 108 C 16 112 26 122 32 138" strokeWidth="0.8" opacity="0.35" />
      </g>
    </svg>
  );
}

/**
 * Susanoo iskeleti — tam bedenin soyut hâli.
 *
 * Amaç bir figür çizmek değil ÖLÇEĞİ göstermek: omuz kavisleri, kaburga
 * dizisi ve tek bir uzun kılıç hattı. Kartın arkasında, metnin altında
 * durur; okunurluğu bozmasın diye ince kalem ve düşük opaklık.
 */
export function SusanooFrame({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 400"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* omuz hattı ve baş */}
        <path d="M74 96 C 96 72 144 72 166 96" strokeWidth="2" opacity="0.9" />
        <path d="M104 74 C 112 56 128 56 136 74" strokeWidth="1.6" opacity="0.75" />
        <path d="M112 58 L 120 34 L 128 58" strokeWidth="1.4" opacity="0.6" />
        {/* omurga */}
        <path d="M120 96 L 120 268" strokeWidth="1.6" opacity="0.7" />
        {/* kaburgalar */}
        <path d="M120 118 C 96 122 80 138 74 160" strokeWidth="1.5" opacity="0.8" />
        <path d="M120 118 C 144 122 160 138 166 160" strokeWidth="1.5" opacity="0.8" />
        <path d="M120 150 C 92 154 74 172 68 198" strokeWidth="1.4" opacity="0.68" />
        <path d="M120 150 C 148 154 166 172 172 198" strokeWidth="1.4" opacity="0.68" />
        <path d="M120 184 C 94 188 78 206 74 230" strokeWidth="1.3" opacity="0.56" />
        <path d="M120 184 C 146 188 162 206 166 230" strokeWidth="1.3" opacity="0.56" />
        <path d="M120 218 C 100 222 88 236 84 254" strokeWidth="1.2" opacity="0.44" />
        <path d="M120 218 C 140 222 152 236 156 254" strokeWidth="1.2" opacity="0.44" />
        {/* kollar */}
        <path d="M74 96 C 48 122 34 162 30 208" strokeWidth="1.8" opacity="0.7" />
        <path d="M166 96 C 192 122 206 162 210 208" strokeWidth="1.8" opacity="0.7" />
        <path d="M30 208 C 28 236 32 262 42 286" strokeWidth="1.4" opacity="0.5" />
        <path d="M210 208 C 212 236 208 262 198 286" strokeWidth="1.4" opacity="0.5" />
        {/* kılıç — kadrajı boydan boya kesen tek uzun hat */}
        <path d="M206 24 L 44 330" strokeWidth="2.2" opacity="0.85" />
        <path d="M196 40 L 214 30" strokeWidth="1.4" opacity="0.6" />
        {/* eteklenen alt gövde, sisin içine giriyor */}
        <path d="M84 268 C 76 306 66 342 52 372" strokeWidth="1.2" opacity="0.34" />
        <path d="M156 268 C 164 306 174 342 188 372" strokeWidth="1.2" opacity="0.34" />
      </g>
    </svg>
  );
}

/**
 * Gunbai — zincirli savaş yelpazesi.
 *
 * Yüzündeki üç işaret yelpazenin kendi süsü; klan armasının kopyası değil
 * (arma başka bileşenlerde var, burada tekrar edilmiyor).
 */
export function Gunbai({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 220"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M46 18 C 62 10 98 10 114 18 C 126 24 130 38 128 58 C 126 82 118 104 104 122 L 56 122 C 42 104 34 82 32 58 C 30 38 34 24 46 18 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M56 122 L 104 122 L 96 140 L 64 140 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <path
        d="M74 140 L 74 202 M 86 140 L 86 202"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M74 202 C 66 208 60 214 58 220 M 86 202 C 94 208 100 214 102 220"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.45"
      />
      <circle cx="80" cy="44" r="7" stroke="currentColor" strokeWidth="1.6" opacity="0.75" />
      <circle cx="60" cy="82" r="7" stroke="currentColor" strokeWidth="1.6" opacity="0.75" />
      <circle cx="100" cy="82" r="7" stroke="currentColor" strokeWidth="1.6" opacity="0.75" />
      {/* zincir — yelpazenin sapından kadrajın dışına */}
      <path
        d="M58 220 C 40 212 26 198 18 180"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="3 6"
        opacity="0.5"
      />
    </svg>
  );
}
