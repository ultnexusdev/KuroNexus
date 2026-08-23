import styles from "./IchigoExperience.module.css";

/**
 * Ichigo sayfasının elle çizilmiş SVG seti.
 *
 * Üç parça var ve üçü de bu arşiv için çizildi (kural: dışarıdan raster
 * görsel indirme/hotlink yok, wiki desenleri kopyalanmaz):
 *
 *   PageCrack   — sayfayı baştan aşağı inen kırık çatlak. Yedi parçaya
 *                 bölünmüş; parçalar bölüm sınırlarında yanal bir sıçramayla
 *                 KIRILIYOR. Aynı gövde ikinci kez, kapalı bir çokgen olarak
 *                 çiziliyor: çatlağın SAĞI Hollow tarafı, kemik tonuna
 *                 yıkanıyor.
 *   HollowMask  — Ichigo'nun KENDİ maskesi: kemik plaka, sol yanında iki
 *                 kızıl şerit, açılı göz boşlukları, dişler. Boynuzlar ve
 *                 siyah sargı ayrı katmanlar — kademeyi CSS açıp kapatıyor.
 *   MoonSlash   — 斬月 ("kesen ay") işareti: hilal + kesik.
 *
 * Bütün renkler CSS modülünden token'la geliyor (`fill: var(--…)`), SVG
 * özniteliğinde ham renk yok — dosyada tek hex bulunmaması kuralının
 * çizim tarafındaki karşılığı.
 */

/* ── Çatlağın gövdesi ───────────────────────────────────────────────────
   viewBox 100×1000, `preserveAspectRatio="none"`: yatayda sayfanın
   genişliğine, dikeyde sayfanın boyuna geriliyor. Çizgi kalınlığı
   `vector-effect="non-scaling-stroke"` ile sabit kalıyor, yani sayfa ne
   kadar uzarsa uzasın çatlak hep aynı kılcallıkta.

   Parçaların arasındaki y boşluğu (146→152 gibi) ve x sıçraması (47→41)
   bilinçli: bölüm sınırında çatlak kırılıyor. */
const CRACK_SEGMENTS: readonly (readonly (readonly [number, number])[])[] = [
  /* 1 · hero */
  [
    [52, 0], [50, 14], [55, 28], [48, 44], [53, 58], [45, 72],
    [50, 86], [57, 100], [49, 116], [54, 130], [47, 146],
  ],
  /* 2 · künye */
  [
    [41, 152], [47, 166], [43, 182], [50, 196], [45, 212],
    [52, 226], [46, 242], [51, 258], [44, 272],
  ],
  /* 3 · laboratuvar */
  [
    [56, 278], [49, 292], [54, 308], [47, 322], [52, 338], [58, 352],
    [50, 368], [55, 384], [48, 398], [53, 412], [46, 426],
  ],
  /* 4 · kim konuşuyor */
  [
    [39, 432], [46, 446], [41, 462], [48, 476], [43, 492], [50, 506],
    [44, 522], [51, 538], [45, 554], [52, 568], [46, 584], [53, 598], [47, 616],
  ],
  /* 5 · kader çizelgesi */
  [
    [58, 622], [51, 636], [56, 652], [49, 666], [54, 682], [47, 696],
    [52, 712], [57, 726], [50, 742], [55, 756], [48, 772], [53, 786],
  ],
  /* 6 · bağlar */
  [
    [42, 792], [49, 806], [44, 822], [51, 836], [45, 852],
    [52, 866], [46, 882], [50, 896],
  ],
  /* 7 · kapanış */
  [
    [55, 902], [48, 916], [53, 932], [47, 948], [52, 962], [46, 978], [50, 1000],
  ],
];

/** Ana çatlaktan ayrılan kılcal kollar — kırığın "yayıldığı" hissi. */
const CRACK_SPURS: readonly (readonly (readonly [number, number])[])[] = [
  [[50, 86], [62, 96], [68, 112]],
  [[45, 212], [33, 222], [27, 240]],
  [[50, 506], [64, 518], [71, 536]],
  [[50, 742], [36, 754], [30, 776]],
];

const toPoints = (pairs: readonly (readonly [number, number])[]): string =>
  pairs.map(([x, y]) => `${x},${y}`).join(" ");

/** Hollow tarafının dolgusu: çatlağın gövdesi + sağ kenar, kapalı çokgen. */
const HOLLOW_FIELD = `${CRACK_SEGMENTS.map(toPoints).join(" ")} 100,1000 100,0`;

/**
 * Sayfa çatlağı.
 *
 * `.page` içinde mutlak konumlu, tıklama geçirmeyen bir katman; bölümler
 * onun üstünde duruyor. Dar ekranda CSS grubu yatayda sıkıştırıp çatlağı
 * sol kenara çekiyor (tek yol, iki düzen).
 */
export function PageCrack() {
  return (
    <svg
      className={styles.crack}
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <g className={styles.crackGroup}>
        {/* Hollow tarafı: kemik tonlu çok hafif bir yıkama */}
        <polygon className={styles.crackField} points={HOLLOW_FIELD} />

        <g className={styles.crackSpurs}>
          {CRACK_SPURS.map((spur) => (
            <polyline
              key={`spur-${spur[0][1]}`}
              points={toPoints(spur)}
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* Ayrı grup: parçaların kaydırma sırasında ÇİZİLME sırası CSS'te
            `:nth-child` ile veriliyor, yani sıra kılcal kollardan bağımsız */}
        <g className={styles.crackSegments}>
          {CRACK_SEGMENTS.map((segment) => (
            <polyline
              key={`seg-${segment[0][1]}`}
              points={toPoints(segment)}
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      </g>
    </svg>
  );
}

/* ── Maske ──────────────────────────────────────────────────────────── */

/** Plaka konturu — hem çizim hem de şeritlerin kırpma yolu. */
const PLATE_PATH =
  "M 50 2 C 72 2 88 20 88 46 C 88 68 81 86 68 100 L 64 112 C 60 118 40 118 36 112 L 32 100 C 19 86 12 68 12 46 C 12 20 28 2 50 2 Z";

/**
 * Ichigo'nun Vizard maskesi — elle çizilmiş, stilize.
 *
 * Desen bilinçli olarak ONUN maskesi: kemik plaka, SOL yanında iki kızıl
 * şerit (başka bir Vizard'ın deseni değil), açılı ve kızgın göz boşlukları,
 * üst-alt diş sırası. Boynuzlar yalnızca tam hollowlaşma kademesinde,
 * siyah sargı yalnızca Son Getsuga kademesinde görünür — ikisini de CSS
 * `data-stage` üzerinden açıyor, bileşen her kademede aynı ağacı çiziyor.
 */
export function HollowMask() {
  return (
    <svg
      className={styles.mask}
      viewBox="-22 -30 144 160"
      aria-hidden
      focusable="false"
    >
      <defs>
        <clipPath id="ich-mask-plate">
          <path d={PLATE_PATH} />
        </clipPath>
      </defs>

      {/* Boynuzlar — plakanın ARDINDA, tam hollowlaşmada açılır */}
      <g className={styles.maskHorns}>
        <path d="M 33 8 C 22 -8 6 -20 -14 -24 C -2 -12 8 2 22 20 Z" />
        <path d="M 67 8 C 78 -8 94 -20 114 -24 C 102 -12 92 2 78 20 Z" />
      </g>

      <path className={styles.maskPlate} d={PLATE_PATH} />

      {/* Kızıl şeritler — plakayla kırpılıyor, göz boşluğu üstlerini kesiyor */}
      <g className={styles.maskStripes} clipPath="url(#ich-mask-plate)">
        <path d="M 19 20 L 30 12 L 31 116 L 21 116 Z" />
        <path d="M 36 6 L 46 4 L 46 116 L 38 116 Z" />
      </g>

      {/* Göz boşlukları — maskenin ardındaki boşluk */}
      <g className={styles.maskVoid}>
        <path d="M 21 44 L 44 37 L 47 53 L 24 58 Z" />
        <path d="M 79 44 L 56 37 L 53 53 L 76 58 Z" />
        <path d="M 19 72 L 81 72 L 74 102 L 26 102 Z" />
      </g>

      {/* Dişler */}
      <g className={styles.maskTeeth}>
        <path d="M 19 72 L 81 72 L 78 86 L 72 74 L 66 86 L 60 74 L 54 86 L 48 74 L 42 86 L 36 74 L 30 86 L 24 74 L 21 86 Z" />
        <path d="M 24 102 L 76 102 L 73 90 L 67 102 L 61 90 L 55 102 L 49 90 L 43 102 L 37 90 L 31 102 L 27 90 Z" />
      </g>

      {/* Maskenin kendi çatlağı — sayfanınkinin küçük kardeşi */}
      <polyline
        className={styles.maskCrack}
        points="50,2 46,22 54,40 47,62 55,84 48,106 51,118"
        vectorEffect="non-scaling-stroke"
      />

      {/* Siyah sargı — Son Getsuga kademesi; maske düşer, bunlar kalır */}
      <g className={styles.maskShroud}>
        <path d="M 4 32 L 96 16 L 99 34 L 7 50 Z" />
        <path d="M 2 58 L 94 42 L 97 62 L 5 78 Z" />
        <path d="M 8 84 L 92 68 L 95 88 L 11 104 Z" />
      </g>
    </svg>
  );
}

/* ── 斬月 işareti ───────────────────────────────────────────────────── */

/**
 * "Kesen ay" — hilal ve içinden geçen kesik.
 *
 * Bölüm başlıklarında ve kart madalyonlarında tekrarlanan tek işaret;
 * sayfanın ikonografisi bundan ibaret (Unicode glif ya da emoji yok).
 */
export function MoonSlash({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      aria-hidden
      focusable="false"
    >
      <path
        className={styles.moonBody}
        d="M 64 6 A 44 44 0 1 0 64 94 A 36 36 0 1 1 64 6 Z"
      />
      <path
        className={styles.moonSlash}
        d="M 8 80 C 32 60 56 36 86 10 L 94 21 C 64 47 38 70 14 90 Z"
      />
    </svg>
  );
}
