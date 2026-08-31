/**
 * Bakugō sayfasının elle çizilmiş işaretleri — SUNUCU bileşenleri, ada DEĞİL.
 *
 * Neden elle SVG: sahne/teknik görselleri üretilmiyor (SÖZLEŞME §3) ve
 * dışarıdan raster indirilmiyor. Bu üç işaret sayfanın tek grafik motifi.
 *
 * Renk buradan GELMİYOR: her çizgi `currentColor` ya da dışarıdan gelen bir
 * sınıf okuyor. Böylece hex disiplini (kural 16) bozulmuyor — dosyada tek
 * bir renk değeri yok.
 */

/**
 * Manga tarzı sivri patlama poligonu — filigranın yarısı.
 *
 * 18 uçlu, yarıçapı DÜZENSİZ bir yıldız: dış yarıçaplar 83–99, iç yarıçaplar
 * 36–50 arasında elle dağıtıldı. Düzgün bir yıldız (hep aynı yarıçap) bir
 * ikon gibi görünüyordu; patlama düzgün olmaz, o yüzden sapma bilerek
 * bırakıldı. Nokta listesi bir üretim betiğiyle hesaplandı, göz kararı
 * değil — yoksa kenarlar birbirini kesiyor.
 */
export function BlastStar({
  className,
  fillClassName,
  edgeClassName,
}: {
  className?: string;
  fillClassName?: string;
  edgeClassName?: string;
}) {
  const points =
    "100.0 4.0 108.0 54.7 130.1 17.3 119.0 67.1 163.6 24.2 138.3 67.9 172.7 58.0 138.5 86.0 191.6 83.9 144.0 100.0 195.5 116.8 145.1 116.4 174.5 143.0 127.6 123.1 161.1 172.8 122.5 139.0 130.8 184.6 107.3 141.4 100.0 198.0 91.5 148.3 71.6 178.0 81.5 132.0 39.6 172.0 67.1 127.6 16.0 148.5 55.8 116.1 14.3 115.1 61.0 100.0 9.4 84.0 58.7 85.0 14.3 50.5 61.7 67.9 45.4 34.9 80.0 65.4 68.9 14.5 92.2 55.7";

  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <polygon className={fillClassName} points={points} />
      <polygon
        className={edgeClassName}
        points={points}
        fill="none"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/**
 * Etki–tepki oku: aynı eksen üzerinde iki zıt uç.
 *
 * Geri tepme okumasının yanında duruyor. Sağa bakan uzun ok ETKİ, sola
 * bakan kısa ok TEPKİ — uzunluk farkı kasıtlı: mermi uzağa gider, atan az
 * geri gelir. Bir yön göstergesi değil bir ORAN göstergesi, o yüzden ölçüler
 * sabit.
 */
export function ThrustPair({
  className,
  actionClassName,
  reactionClassName,
  axisClassName,
}: {
  className?: string;
  actionClassName?: string;
  reactionClassName?: string;
  axisClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 40"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <path className={axisClassName} d="M80 6 L80 34" fill="none" />
      {/* Etki — uzun kol, sağa */}
      <g className={actionClassName} fill="none" strokeLinecap="square">
        <path d="M82 20 L146 20" />
        <path d="M132 8 L148 20 L132 32" />
      </g>
      {/* Tepki — kısa kol, sola */}
      <g className={reactionClassName} fill="none" strokeLinecap="square">
        <path d="M78 20 L36 20" />
        <path d="M48 10 L34 20 L48 30" />
      </g>
    </svg>
  );
}

/**
 * Avuç işareti — açık el ve içinden çıkan tek kıvılcım.
 *
 * Künye şeridinin yanında duruyor. Dolgusuz, yalnız kontur: bir amblem
 * değil bir şema. Parmaklar beş ayrı çizgi, avuç tek bir kapalı yol;
 * kıvılcım avucun tam ortasından çıkan üç kısa ışın.
 */
export function PalmSpark({
  className,
  handClassName,
  sparkClassName,
}: {
  className?: string;
  handClassName?: string;
  sparkClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 140"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g className={handClassName}>
          {/* Avuç gövdesi */}
          <path d="M34 66 C 30 92 38 116 60 130 C 84 116 92 92 88 66 Z" />
          {/* Beş parmak — ortadaki en uzun */}
          <path d="M36 66 L28 34" />
          <path d="M48 62 L44 20" />
          <path d="M61 61 L61 12" />
          <path d="M74 62 L78 20" />
          <path d="M86 66 L94 36" />
        </g>
        {/* Kıvılcım — avucun ortasından üç kısa ışın */}
        <g className={sparkClassName}>
          <path d="M61 96 L61 78" />
          <path d="M50 100 L38 90" />
          <path d="M72 100 L84 90" />
        </g>
      </g>
    </svg>
  );
}
