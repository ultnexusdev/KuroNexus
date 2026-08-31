/**
 * Ulquiorra sayfasının elle çizilmiş işaretleri — SUNUCU bileşenleri.
 *
 * Neden elle SVG: sahne/teknik görselleri üretilmiyor (FAZ 2 §3) ve dışarıdan
 * raster indirilmiyor. Sayfanın bütün grafik malzemesi bu dosyada.
 *
 * ⚠️ DOLU SİMGE YOK — dalga kilidi. Bu sayfanın filigran nesnesi bir amblem
 * değil, BOŞLUĞUN KENDİSİ: aşağıdaki şekillerin hiçbirinde `fill` yok, hepsi
 * saç inceliğinde kontur ve hepsinin ortası açık. Bir halka bir daire değil;
 * bir daire dolu bir şeydir, halka ise etrafını çevirdiği boşluktur.
 *
 * Renk buradan GELMİYOR: her stroke `currentColor` okuyor, sınıflar dışarıdan
 * geliyor. Böylece hex disiplini (kural 16) bozulmuyor.
 */

/**
 * Deliğin kenarındaki ince halka — sayfanın filigranı.
 *
 * İki halka var ve ikisi de kapalı DEĞİL: dış halka üstte, iç halka altta
 * kesik (`stroke-dasharray` ile değil, yayları elle çizerek — böylece kesiğin
 * yeri ölçüye bağlı kalmıyor). Kesikler boşluğun "kapanmadığını" söylüyor.
 *
 * viewBox 0 0 200 200, merkez (100,100). Dış yarıçap 92, iç yarıçap 78.
 */
export function VoidRing({
  className,
  outerClassName,
  innerClassName,
  tickClassName,
}: {
  className?: string;
  outerClassName?: string;
  innerClassName?: string;
  tickClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="round">
        {/* Dış halka — tepede açık (yay 100°'den 80°'ye kadar dolanıyor) */}
        <path
          className={outerClassName}
          d="M 91.98 8.39 A 92 92 0 1 1 108.02 8.39"
        />
        {/* İç halka — altta açık, dış halkanın kesiğinin tam karşısında */}
        <path
          className={innerClassName}
          d="M 108.16 177.32 A 78 78 0 1 1 91.84 177.32"
        />
        {/* Dört ölçü çentiği: boşluğun ölçülebilir olduğunu iddia eden
            işaretler. Ulquiorra'nın bütün yöntemi bu. */}
        <path
          className={tickClassName}
          d="M100 2 L100 14 M198 100 L186 100 M100 198 L100 186 M2 100 L14 100"
        />
      </g>
    </svg>
  );
}

/**
 * Kırık boynuzlu miğfer parçası — künye şeridinin yanındaki tek motif.
 *
 * Arşivin kendi Bleach defterine göre parça başın SOL ÜST yanında ve boynuzu
 * KIRIK (`lib/anime/bleach/espada.ts`, dördüncü sıra). Çizim o iki bilgiyi
 * taşıyor: tek boynuz, ucu yok, kesik yüzey açıkta.
 */
export function HelmShard({
  className,
  edgeClassName,
  breakClassName,
}: {
  className?: string;
  edgeClassName?: string;
  breakClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 80"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Miğferin kavisi */}
        <path className={edgeClassName} d="M8 70 C 18 34 44 12 74 10" />
        <path className={edgeClassName} d="M18 74 C 28 42 50 22 76 20" />
        {/* Boynuz — ucu YOK, kesikle bitiyor */}
        <path className={edgeClassName} d="M74 10 C 88 12 100 20 108 32" />
        {/* Kırık yüzey */}
        <path className={breakClassName} d="M108 32 L96 30 L104 22 L94 20" />
      </g>
    </svg>
  );
}

/**
 * Yarasa kanadının tek konturu — güç laboratuvarının başındaki iz.
 *
 * Murciélago'nun iki kanadından YALNIZCA BİRİ çiziliyor. Simetrik bir çift
 * dolu bir amblem gibi okunurdu; tek kanat bir eksiklik gibi okunuyor ve bu
 * sayfada doğru olan o.
 */
export function WingOutline({
  className,
  strokeClassName,
}: {
  className?: string;
  strokeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 90"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g className={strokeClassName}>
          {/* Kanadın üst kenarı, omuzdan uca */}
          <path d="M6 22 C 46 10 108 12 158 34 C 176 42 188 54 194 68" />
          {/* Üç parmak — her biri kenara kadar iniyor, aralar boş */}
          <path d="M60 16 C 62 34 70 52 84 66" />
          <path d="M104 20 C 108 38 118 56 134 70" />
          <path d="M148 30 C 154 46 166 60 182 72" />
          {/* Alt kenar: parmakların uçlarını birleştiren kavisli hat */}
          <path d="M6 22 C 20 44 48 60 84 66 C 112 70 152 74 194 68" />
        </g>
      </g>
    </svg>
  );
}
