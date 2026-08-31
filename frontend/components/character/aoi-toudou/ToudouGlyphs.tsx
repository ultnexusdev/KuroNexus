/**
 * Aoi Tōdō sayfasının elle çizilmiş motifleri.
 *
 * ⚠️ SUNUCU BİLEŞENİ. `"use client"` YOK ve olmayacak: burada durum yok,
 * yalnızca `path` verisi var. İstemci adaları (`BrotherStage`, `ClapStage`)
 * bu dosyayı **import etmiyor** — ihtiyaç duydukları motif onlara `ReactNode`
 * olarak prop'la iniyor. Import etselerdi bu dosya da istemci paketine
 * girerdi ve dört SVG boşuna indirilirdi.
 *
 * Hiçbiri raster değil, hiçbiri dışarıdan indirilmedi (Faz 2 §3: sahne
 * görseli üretilmez, motif gerekiyorsa elle çizilir).
 *
 * Renk YOK: her çizim boyasını `className` / `strokeClassName` ile gelen
 * CSS modülü sınıfından alıyor, o sınıflar da yalnızca token okuyor
 * (kural 16). Böylece "Kardeşim!" modu paleti fuşyaya doyurduğunda motifler
 * de kendiliğinden dönüyor.
 *
 * Hepsi dekoratif: kullanan taraf `aria-hidden` koyuyor, okunabilir
 * karşılıkları metin olarak zaten sayfada.
 */

/** Dört parmaklı, yukarı bakan stilize el silueti — iki kez kullanılıyor. */
const HAND_PATH =
  "M 14 132 C 6 118 4 96 8 76 C 10 66 20 64 24 72 L 30 88 L 24 30 " +
  "C 23 21 35 19 37 28 L 45 84 L 44 14 C 44 5 56 5 56 14 L 57 84 " +
  "L 64 22 C 65 13 77 15 76 24 L 70 86 L 74 66 C 76 57 87 60 85 69 " +
  "L 76 108 C 70 126 58 136 42 136 L 26 136 C 21 136 17 135 14 132 Z";

/**
 * ALKIŞ — sayfanın filigranı.
 *
 * İki el tabanları ortada buluşacak şekilde birbirine doğru eğik; aralarında
 * temas anını gösteren beş kısa çizgi var. Eller aynı `path`ten geliyor,
 * sağdaki `scale(-1, 1)` ile aynalanmış.
 */
export function ClapHands({
  className,
  handClassName,
  sparkClassName,
}: {
  className?: string;
  handClassName?: string;
  sparkClassName?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 300 210" fill="none" focusable="false">
      <g transform="translate(150 178)">
        <g transform="rotate(-15) translate(-98 -142)">
          <path className={handClassName} d={HAND_PATH} />
        </g>
        <g transform="rotate(15) scale(-1 1) translate(-98 -142)">
          <path className={handClassName} d={HAND_PATH} />
        </g>
        {/* Temas kıvılcımları — elin uçlarının buluştuğu noktadan yukarı */}
        <g className={sparkClassName}>
          <path d="M 0 -152 L 0 -196" />
          <path d="M -34 -146 L -52 -184" />
          <path d="M 34 -146 L 52 -184" />
          <path d="M -62 -126 L -92 -152" />
          <path d="M 62 -126 L 92 -152" />
        </g>
      </g>
    </svg>
  );
}

/**
 * IŞIK PATLAMASI — boş poster kadrajlarının içinde duran motif.
 *
 * Kadraj görselsiz kaldığında blok çökmüyor: on iki ışın ve ortadaki yıldız
 * "burada bir kare olacak" diyor, ama ziyaretçiye piksel ölçüsü SÖYLEMİYOR
 * (üretim metadatası yalnızca küratör dalında).
 */
export function StarBurst({
  className,
  rayClassName,
  starClassName,
}: {
  className?: string;
  rayClassName?: string;
  starClassName?: string;
}) {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" focusable="false">
      <g transform="translate(100 100)">
        <g className={rayClassName}>
          {rays.map((deg) => (
            <path
              key={deg}
              d={deg % 60 === 0 ? "M 0 -44 L 0 -92" : "M 0 -46 L 0 -74"}
              transform={`rotate(${deg})`}
            />
          ))}
        </g>
        <path
          className={starClassName}
          d="M 0 -34 L 9 -11 L 33 -9 L 15 6 L 21 30 L 0 17 L -21 30 L -15 6 L -33 -9 L -9 -11 Z"
        />
      </g>
    </svg>
  );
}

/**
 * İDOL SİLUETİ — Takada-chan'ın kadrajında duran yer tutucu.
 *
 * ⚠️ Bu bir portre DEĞİL ve öyle görünmemesi bilinçli: hatlar kapanmıyor,
 * yüz yok, mikrofon bir daire. Arşivde Takada-chan'ın karesi yok ve bu
 * boşluğu gerçekçi bir çizimle doldurmak, olmayan bir kaynağı varmış gibi
 * göstermek olurdu.
 */
export function IdolSilhouette({
  className,
  bodyClassName,
  lineClassName,
}: {
  className?: string;
  bodyClassName?: string;
  lineClassName?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 180 240" fill="none" focusable="false">
      {/* Saç + baş */}
      <path
        className={bodyClassName}
        d="M 90 26 C 62 26 48 46 50 72 C 51 88 56 98 64 104 C 58 112 54 118 50 126 L 130 126 C 126 118 122 112 116 104 C 124 98 129 88 130 72 C 132 46 118 26 90 26 Z"
      />
      {/* Omuzlar */}
      <path
        className={bodyClassName}
        d="M 62 132 C 38 140 24 160 20 196 L 160 196 C 156 160 142 140 118 132 C 110 146 70 146 62 132 Z"
      />
      {/* Mikrofon — kol yerine tek çizgi ve bir daire */}
      <g className={lineClassName}>
        <path d="M 132 176 L 150 132" />
        <circle cx="153" cy="122" r="11" />
        <path d="M 30 208 L 150 208" />
      </g>
    </svg>
  );
}

/**
 * TAKAS OKLARI — alkış düğmesinin ve takas alanlarının işareti.
 *
 * İki yay birbirinin üstünden geçiyor: biri soldan sağa üstten, öbürü sağdan
 * sola alttan. Tekniğin yaptığı işin tek karelik özeti.
 */
export function SwapArrows({
  className,
  arcClassName,
  headClassName,
}: {
  className?: string;
  arcClassName?: string;
  headClassName?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 120 72" fill="none" focusable="false">
      <g className={arcClassName}>
        <path d="M 16 44 C 28 12 92 12 104 40" />
        <path d="M 104 30 C 92 62 28 62 16 34" />
      </g>
      <g className={headClassName}>
        <path d="M 104 44 L 96 28 L 112 30 Z" />
        <path d="M 16 30 L 24 46 L 8 44 Z" />
      </g>
    </svg>
  );
}
