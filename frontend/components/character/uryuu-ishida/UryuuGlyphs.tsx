/**
 * Uryū Ishida sayfasının elle çizilmiş işaretleri — SUNUCU bileşenleri.
 *
 * Neden elle SVG: sahne/teknik görselleri üretilmiyor (FAZ 2 §3) ve dışarıdan
 * raster indirilmiyor. Sayfanın üç grafik motifi de burada, kendi konturuyla
 * çizildi; hiçbiri bir dosyaya bağlı değil.
 *
 * Renk buradan GELMİYOR: her `stroke` `currentColor` okuyor, sınıflar
 * dışarıdan geliyor. Böylece hex disiplini (kural 16) bozulmuyor ve
 * `data-blut` durumu bu şekilleri de çevirebiliyor.
 *
 * ⚠️ `"use client"` YOK ve olmamalı: üç bileşen de saf geometri. İstemci
 * adası bütçesi (en fazla 3) `BlutShell` ve `ReticleBoard` için ayrıldı.
 */

/**
 * QUINCY HAÇI — beş uçlu, dolgusuz.
 *
 * Geometri: uzun dikey mızrak, ondan kısa yatay kol, merkezde bir halka ve
 * beşinci uç olarak sol alta inen ince bir çıkıntı. Dört tanesi eksenlerde,
 * beşincisi kırık — simetriyi bilerek bozuyor, çünkü Quincy nişanı düzgün
 * bir artı değil.
 *
 * Sayfanın filigranı: çok büyük, çok soluk, `aria-hidden`.
 */
export function QuincyCross({
  className,
  strokeClassName,
  ringClassName,
}: {
  className?: string;
  strokeClassName?: string;
  ringClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="square" strokeLinejoin="miter">
        <g className={strokeClassName}>
          {/* Dikey mızrak — iki uç (1, 2) */}
          <path d="M100 6 L107 100 L100 194 L93 100 Z" />
          {/* Yatay kol — iki uç (3, 4) */}
          <path d="M26 100 L100 93 L174 100 L100 107 Z" />
          {/* Beşinci uç — sol alta inen kırık çıkıntı */}
          <path d="M42 158 L97 103 L103 109 Z" />
        </g>
        {/* Merkez halkası: nişangâhın kendisiyle aynı geometri */}
        <circle className={ringClassName} cx="100" cy="100" r="15" />
        <circle className={ringClassName} cx="100" cy="100" r="27" />
      </g>
    </svg>
  );
}

/**
 * TEYEL ÇİZGİSİ — dikiş ayracı.
 *
 * Bölümleri ayıran tek çizgi bir kural çizgisi değil, bir DİKİŞ: kesikli
 * desen `stroke-dasharray` ile teyel gibi atılıyor ve `stroke-dashoffset`
 * animasyonu onu soldan sağa ilerletiyor (`uryStitch`). İğnenin girip çıktığı
 * noktalar iki uçtaki küçük çentikler.
 *
 * Sayfanın ikinci ekseni — nişan ve dikiş — görsel karşılığını burada
 * buluyor; ızgara ölçüyor, teyel birleştiriyor.
 */
export function StitchRule({
  className,
  threadClassName,
  needleClassName,
}: {
  className?: string;
  threadClassName?: string;
  needleClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 12"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="butt">
        <path className={threadClassName} d="M4 6 H396" />
        <path className={needleClassName} d="M4 1 L4 11 M396 1 L396 11" />
      </g>
    </svg>
  );
}

/**
 * ÖLÇÜ EKSENİ — kısa bir cetvel.
 *
 * Dört alet kartının üstünde duruyor: on çentik, ortada bir uzun çentik.
 * Dekoratif değil, bölümün dilini söylüyor — bu sayfada her şey önce
 * ölçülüyor. `preserveAspectRatio` yok: cetvel kartın genişliğine uzuyor,
 * çünkü bir cetvel zaten uzayan bir şey.
 */
export function MeasureAxis({
  className,
  railClassName,
  tickClassName,
  majorClassName,
}: {
  className?: string;
  railClassName?: string;
  tickClassName?: string;
  majorClassName?: string;
}) {
  const ticks = [40, 80, 120, 160, 240, 280, 320, 360];
  return (
    <svg
      className={className}
      viewBox="0 0 400 16"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="butt">
        <path className={railClassName} d="M0 15 H400" />
        {ticks.map((x) => (
          <path key={x} className={tickClassName} d={`M${x} 9 L${x} 15`} />
        ))}
        <path className={majorClassName} d="M200 1 L200 15" />
      </g>
    </svg>
  );
}
