/**
 * Grimmjow sayfasının elle çizilmiş işaretleri — SUNUCU bileşenleri.
 *
 * Neden elle SVG: sahne/teknik görselleri üretilmiyor (FAZ 2 §3) ve dışarıdan
 * raster indirilmiyor. Sayfanın bütün grafik malzemesi bu dosyada ve iki
 * parçadan ibaret: dört paralel pençe yırtığı ve sırttaki ÇARPIK 6.
 *
 * Renk buradan GELMİYOR: her stroke/fill `currentColor` okuyor, sınıflar
 * dışarıdan geliyor. Böylece hex disiplini (kural 16) bozulmuyor.
 *
 * Üçü de `aria-hidden`: filigran bir bilgi değil bir doku. Okunabilir
 * karşılıkları (破面, Sexta Espada, altıncı sıra) künye şeridinde metin
 * olarak zaten var.
 */

/**
 * Pençe izi — dört paralel yırtık.
 *
 * Her yırtık iki kenardan kapalı ince bir mekik: ortada geniş, iki uçta
 * sivri. Dördü aynı geometrinin farklı uzunluk ve eğimdeki hâli, çünkü
 * gerçek bir pençede parmaklar aynı derinliğe inmiyor — en uzunu ikinci,
 * en kısası dördüncü. Dolgu var (yırtık bir çizgi değil bir AÇIKLIK), ama
 * kontur yok: kenarların kendisi zaten düzensiz.
 */
export function ClawMark({
  className,
  ripClassName,
}: {
  className?: string;
  ripClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 300"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g className={ripClassName}>
        {/* 1 — en dıştaki, en sığ */}
        <path d="M34 18 C 44 74 52 138 56 206 C 57 232 54 258 46 282 C 48 252 46 222 42 192 C 36 140 30 78 34 18 Z" />
        {/* 2 — en uzun, ortada en geniş */}
        <path d="M86 6 C 100 70 110 142 112 216 C 113 248 109 274 100 294 C 104 258 102 224 97 188 C 90 132 80 66 86 6 Z" />
        {/* 3 — kısa, ucu erken kapanıyor */}
        <path d="M140 26 C 154 84 163 148 165 210 C 166 236 163 258 156 276 C 159 246 157 216 152 186 C 146 138 136 84 140 26 Z" />
        {/* 4 — en kısa ve en ince */}
        <path d="M194 46 C 205 96 212 148 213 198 C 214 218 211 236 205 250 C 208 226 206 202 202 178 C 197 138 190 92 194 46 Z" />
      </g>
    </svg>
  );
}

/**
 * Sırttaki ÇARPIK 6.
 *
 * Künye tek bir ayrıntıyı özellikle söylüyor: "A crooked number 6 is
 * tattooed on his back". Bu yüzden rakam bir fontla değil elle çizildi ve
 * bilerek eğri: gövde dikey değil, halka merkezde değil, uç kapanmıyor.
 * Sayfada Archivo Black'in düz rakamları varken bu tek rakamın eğri
 * olması bir tutarsızlık değil, künyedeki cümlenin karşılığı.
 *
 * Dolgu yok — yalnız kontur, çünkü dövme bir leke değil bir çizik.
 */
export function CrookedSix({
  className,
  strokeClassName,
}: {
  className?: string;
  strokeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 160"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g
        className={strokeClassName}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Üstten inen gövde — dikey değil, sola yatık ve ortada kırık */}
        <path d="M78 14 C 62 40 48 62 40 82 C 33 100 30 114 31 124" />
        {/* Halka — merkezi kaçık, kapanışı eksik (uç birleşmiyor) */}
        <path d="M31 124 C 33 142 48 152 66 150 C 84 148 95 134 92 118 C 89 102 74 94 58 98 C 46 101 38 110 36 121" />
      </g>
    </svg>
  );
}

/**
 * Bölüm kenarındaki yırtığın ALTINDA duran lif çizgisi.
 *
 * Bandın kendisi `clip-path` ile kesiliyor; kesik kenar tek başına fazla
 * temiz kalıyor. Bu ince, düzensiz kırık çizgi kesiğin altına giriyor ve
 * yırtığın "lif" hissini veriyor — kâğıt yırtıldığında kenarda kalan tüy.
 *
 * `preserveAspectRatio="none"`: çizgi bandın bütün genişliğine geriliyor,
 * yani dar ekranda da geniş ekranda da kenarı boydan boya takip ediyor.
 */
export function TearFibre({
  className,
  strokeClassName,
}: {
  className?: string;
  strokeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className={strokeClassName}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0 22 L 74 8 L 146 26 L 212 11 L 268 30 L 349 13 L 402 27 L 486 6 L 548 24 L 623 10 L 688 29 L 761 14 L 826 31 L 897 12 L 962 27 L 1041 9 L 1108 25 L 1200 15"
      />
    </svg>
  );
}
