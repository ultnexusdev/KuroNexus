/**
 * Mikasa Ackerman — elle çizilmiş SVG motifleri.
 *
 * Bu dosyada `"use client"` YOK ve olmamalı: hiçbiri durum tutmuyor, hepsi
 * saf çizim. Sunucu ağacında da, istemci adasının (AngleDial) içinde de aynı
 * bileşenler kullanılıyor; istemciden çağrılanlar o adanın paketine giriyor.
 *
 * Renklerin hepsi ÇAĞIRANDAN geliyor (className olarak): CSS Modules'ün
 * sınıfları yerel olduğu için bir SVG'nin içine dışarıdan stil vermenin tek
 * yolu bu. Dosyada tek bir renk yazmıyor — kural 16.
 *
 * Faz 2 görsel politikası: dışarıdan raster indirilmiyor. Sayfadaki bütün
 * motifler burada, konturla çiziliyor.
 */

/**
 * Atkı dokusu — düz dokuma (bir alt, bir üst).
 *
 * `<pattern>` kimliği sayfada TEK KEZ kullanılmak üzere sabit: hero'nun
 * arkasındaki filigran alanı. İkinci bir yerde kullanılırsa kimlik çakışır,
 * o yüzden çağıranın da tek olduğu yorumla işaretlendi.
 */
export function WeaveField({
  className,
  warpClassName,
  weftClassName,
}: {
  className?: string;
  warpClassName?: string;
  weftClassName?: string;
}) {
  return (
    /* ⚠️ `viewBox` YOK — bilerek. viewBox verilseydi `preserveAspectRatio`
       deseni ölçekleyip kırpardı ve dokuma hero'nun eninde gerilirdi. Desen
       kullanıcı biriminde kalınca gerçekten DÖŞENİYOR: hücre her ekranda
       16 piksel. */
    <svg
      className={className}
      width="100%"
      height="100%"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      <defs>
        <pattern
          id="mks-weave"
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          {/* Çözgü: dikey iplikler */}
          <path className={warpClassName} d="M4 0 V16 M12 0 V16" />
          {/* Atkı: yatay iplikler, yarım adım kaydırılmış — dokuma hissi
              tam olarak bu kaydırmadan doğuyor */}
          <path className={weftClassName} d="M0 4 H8 M8 12 H16" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mks-weave)" />
    </svg>
  );
}

/**
 * Bölümü sol kenardaki atkı çizgisine bağlayan ODM kablosu.
 *
 * Çizim `stroke-dasharray`/`stroke-dashoffset` ile yapılıyor (dalganın
 * kilitli hareket dili). Kablonun AÇISI `--mks-angle` değişkenini okuyor:
 * kanca açısı seçicisi değiştiğinde sayfadaki bütün kablolar birlikte
 * dönüyor. Yumuşak değil — düz ve gergin.
 *
 * `overflow: visible` CSS'te veriliyor; 45 derecede kablonun ucu viewBox'ın
 * dışına taşıyor ve kırpılmaması gerekiyor.
 */
export function CableLink({
  className,
  pivotClassName,
  lineClassName,
  nodeClassName,
  tipClassName,
}: {
  className?: string;
  pivotClassName?: string;
  lineClassName?: string;
  nodeClassName?: string;
  tipClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 32"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      <g className={pivotClassName}>
        <path className={lineClassName} d="M5 6 H94" />
        <path className={tipClassName} d="M88 2 L94 6 L88 10" />
      </g>
      <circle className={nodeClassName} cx="5" cy="6" r="3.2" />
    </svg>
  );
}

/** Atkı çizgisinin başındaki ve sonundaki düğüm. */
export function ScarfKnot({
  className,
  loopClassName,
  tailClassName,
}: {
  className?: string;
  loopClassName?: string;
  tailClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 56"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      <path className={loopClassName} d="M20 6 C8 14 8 24 20 28 C32 32 32 42 20 50" />
      <path className={tailClassName} d="M12 30 L6 52 M28 30 L34 52" />
    </svg>
  );
}

/**
 * Kanca açısı şeması — sayfanın kalbindeki tek kontrolün resmi.
 *
 * Ölçü sistemi: sol kenardaki dikey çizgi ATKI, üstündeki nokta ÇIKIŞ
 * NOKTASI. Üç ışın da o noktadan çıkıyor ve açıları DİKEYDEN ölçülüyor —
 * yani 0° atkının kendisiyle çakışıyor (hiç sapma yok), 45° en geniş sapma.
 *
 * Uzunluk sabit (110 birim): kanca uzamıyor, yalnızca yön değiştiriyor.
 * Uç noktalar burada elle hesaplandı ki tarayıcıda `tan()` desteğine
 * bağımlılık doğmasın.
 */
const RAY_LENGTH = 110;
const ANCHOR = { x: 16, y: 30 };

function rayEnd(deg: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: ANCHOR.x + RAY_LENGTH * Math.sin(rad),
    y: ANCHOR.y + RAY_LENGTH * Math.cos(rad),
  };
}

export function HookDiagram({
  active,
  degrees,
  className,
  railClassName,
  rayClassName,
  activeRayClassName,
  nodeClassName,
  targetClassName,
  arcClassName,
  title,
}: {
  /** Seçili açı (derece) */
  active: number;
  /** Şemada çizilecek bütün açılar */
  degrees: number[];
  className?: string;
  railClassName?: string;
  rayClassName?: string;
  activeRayClassName?: string;
  nodeClassName?: string;
  targetClassName?: string;
  arcClassName?: string;
  /** Ekran okuyucu için şemanın adı */
  title: string;
}) {
  const tip = rayEnd(active);
  /* Açı yayının bitiş noktası — 0 derecede yay hiç çizilmiyor (başlangıç ve
     bitiş çakışınca SVG yayı atlıyor), o yüzden ayrıca soluklaştırılıyor. */
  const arcX = ANCHOR.x + 34 * Math.sin((active * Math.PI) / 180);
  const arcY = ANCHOR.y + 34 * Math.cos((active * Math.PI) / 180);

  return (
    <svg
      className={className}
      viewBox="0 0 160 156"
      role="img"
      aria-label={title}
      focusable="false"
    >
      {/* Atkı: şemanın da sol kenarında, sayfanınkiyle aynı çizgi */}
      <path className={railClassName} d={`M${ANCHOR.x} 4 V152`} />

      {/* Bütün açılar soluk; seçili olan ayrıca üstte çiziliyor */}
      {degrees.map((deg) => {
        const end = rayEnd(deg);
        return (
          <path
            key={deg}
            className={rayClassName}
            d={`M${ANCHOR.x} ${ANCHOR.y} L${end.x.toFixed(2)} ${end.y.toFixed(2)}`}
          />
        );
      })}

      {/* Açı yayı: dikeyden sapmanın kendisi */}
      <path
        className={arcClassName}
        d={`M${ANCHOR.x} ${ANCHOR.y + 34} A34 34 0 0 0 ${arcX.toFixed(2)} ${arcY.toFixed(2)}`}
        data-flat={active === 0 ? "true" : "false"}
      />

      {/* ⚠️ `key` seçili açıya bağlı: açı değiştiğinde bu düğüm yeniden
          mount ediliyor ve çizim animasyonu (dashoffset) baştan koşuyor.
          CSS animasyonu tek başına yeniden tetiklenmezdi. */}
      <g key={active}>
        <path
          className={activeRayClassName}
          d={`M${ANCHOR.x} ${ANCHOR.y} L${tip.x.toFixed(2)} ${tip.y.toFixed(2)}`}
        />
        <circle
          className={targetClassName}
          cx={tip.x.toFixed(2)}
          cy={tip.y.toFixed(2)}
          r="5.5"
        />
      </g>

      <circle
        className={nodeClassName}
        cx={ANCHOR.x}
        cy={ANCHOR.y}
        r="4.2"
      />
    </svg>
  );
}
