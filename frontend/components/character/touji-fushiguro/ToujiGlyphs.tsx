/**
 * Tōji sayfasının elle çizilmiş SVG'leri — SUNUCU bileşenleri.
 *
 * `"use client"` YOK: hiçbiri durum tutmuyor, hepsi statik `path`. İstemci
 * adalarına inmiyorlar, yani sayfanın JavaScript bütçesine bir bayt bile
 * eklemiyorlar.
 *
 * ── NEDEN ELLE ÇİZİLDİ ───────────────────────────────────────────────────
 * Faz 2 §3: sahne/alet görselleri ÜRETİLMİYOR ve dışarıdan raster
 * indirilmiyor. Motif gerekiyorsa çizilir. Bu sayfada motif ayrıca bir
 * gereklilik: on üç kadrajın hepsi boş ve boş kadraj ziyaretçiye YAZI
 * göstermiyor (küratör metni sızmasın kuralı), yani boşken orada duracak
 * tek şey bu siluetler.
 *
 * ── ORTAK KURAL ──────────────────────────────────────────────────────────
 * Hepsi DOLGUSUZ (`fill="none"`), yalnızca kontur. Renk ve kalınlık
 * çağıran taraftan `className` ile geliyor — bu dosyada tek renk değeri
 * yok (kural 16). Hepsi dekoratif: çağıran taraf `aria-hidden` sarmalıyor.
 */

/**
 * Ufuk — gökyüzü boşluğunun tek çizgisi.
 *
 * Üç neredeyse yatay çizgi: ufuk, ufkun üstünde iki soluk bulut hattı.
 * Sayfanın TEK sürekli hareketi bu öğenin çok yavaş yatay kayması
 * (CSS'te `tojDrift`, 150 saniye, `prefers-reduced-motion` kapısında).
 * Genişliği bilerek viewBox'tan taşkın çiziliyor ki kayarken kenarda
 * boşluk açılmasın.
 */
export function HorizonRule({
  className,
  lineClassName,
  hazeClassName,
}: {
  className?: string;
  lineClassName?: string;
  hazeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 1600 160"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path className={hazeClassName} d="M-60 54 H520 M600 54 H1010 M1090 54 H1660" />
      <path className={hazeClassName} d="M-60 92 H300 M380 92 H760 M900 92 H1660" />
      <path className={lineClassName} d="M-60 130 H1660" />
    </svg>
  );
}

/**
 * Ters Mızrak (天逆鉾) — sayfanın büyük filigranı.
 *
 * Dikey, çok uzun, dolgusuz. Uç aşağı bakıyor: "ters" olan da bu. Sapın
 * üstünde bir sarım bandı, dibinde geri çağırma ipinin halkası var
 * (mızrak atılıp ipten geri çekiliyor).
 */
export function SpearMark({
  className,
  bladeClassName,
  shaftClassName,
  cordClassName,
}: {
  className?: string;
  bladeClassName?: string;
  shaftClassName?: string;
  cordClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 640"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {/* Sap — tek uzun çizgi, üstte hafif incelen */}
      <path className={shaftClassName} d="M100 34 V470" />
      {/* Sarım bandı — üç kısa çapraz */}
      <path
        className={shaftClassName}
        d="M84 96 L116 84 M84 118 L116 106 M84 140 L116 128"
      />
      {/* Ağız — aşağı bakan, tek tarafı çentikli */}
      <path
        className={bladeClassName}
        d="M100 470 L74 516 L84 566 L100 606 L116 566 L126 516 Z"
      />
      <path className={bladeClassName} d="M100 496 V596" />
      {/* Geri çağırma ipi — sapın dibinden çıkan halka */}
      <path
        className={cordClassName}
        d="M100 34 C64 30 40 48 44 76 C48 104 78 108 92 92"
      />
    </svg>
  );
}

/**
 * Playful Cloud (遊雲) — zincirle bağlı üç parça.
 *
 * Yatay çizildi: filigranın dikeyliğine karşı ikinci bir yön. Üç dikdörtgen
 * gövde ve aralarında ikişer halka.
 */
export function ChainMark({
  className,
  segmentClassName,
  linkClassName,
}: {
  className?: string;
  segmentClassName?: string;
  linkClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 140"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path className={segmentClassName} d="M18 54 H182 V86 H18 Z" />
      <path className={segmentClassName} d="M238 54 H402 V86 H238 Z" />
      <path className={segmentClassName} d="M458 54 H622 V86 H458 Z" />
      <ellipse className={linkClassName} cx="199" cy="70" rx="13" ry="9" />
      <ellipse className={linkClassName} cx="221" cy="70" rx="13" ry="9" />
      <ellipse className={linkClassName} cx="419" cy="70" rx="13" ry="9" />
      <ellipse className={linkClassName} cx="441" cy="70" rx="13" ry="9" />
    </svg>
  );
}

/**
 * Boş bölme — çantanın açık ağzı.
 *
 * Envanter bölümünün ve doldurulmamış küçük kadrajların motifi. Kapak
 * açık, iç taraf boş: sayfanın konusunun tek çizgilik hâli.
 */
export function PocketMark({
  className,
  clothClassName,
  seamClassName,
}: {
  className?: string;
  clothClassName?: string;
  seamClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 260 170"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {/* Gövde */}
      <path className={clothClassName} d="M26 62 H234 V150 H26 Z" />
      {/* Açık kapak — geriye kıvrılmış */}
      <path className={clothClassName} d="M26 62 L52 22 H208 L234 62" />
      {/* Dikiş — teyel çizgisi */}
      <path className={seamClassName} d="M42 78 H218" />
      <path className={seamClassName} d="M42 134 H218" />
    </svg>
  );
}
