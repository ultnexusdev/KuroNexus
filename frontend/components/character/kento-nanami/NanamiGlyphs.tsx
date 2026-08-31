import type { CSSProperties } from "react";

/**
 * Nanami sayfasının elle çizilmiş işaretleri.
 *
 * Bu dosyada `"use client"` YOK ve olmayacak: hepsi saf SVG, durum tutmuyor.
 * `ClockDial` bir istemci adasından (ShiftLedger) çağrıldığı için derleyici
 * onu istemci grafiğine katıyor — bu bir ada DEĞİL, yalnızca paylaşılan bir
 * çizim. Sayfanın istemci adası sayısı ikide kalıyor (ClockShell, ShiftLedger).
 *
 * ── NEDEN ÜRETİLMİŞ GÖRSEL YOK ───────────────────────────────────────────
 * Faz 2 §3: sahne/teknik görselleri üretilmiyor, hotlink yasak. Motif
 * gerekiyorsa elle çiziliyor. Nanami'nin iki işareti var ve ikisi de burada:
 *   · çizgili kravat deseni (filigran ve mesai defterinin dolgusu)
 *   · saat kadranı (mekaniğin kendisi — 09:00'dan 18:00'e)
 */

/**
 * Çizgili kravat deseni.
 *
 * `preserveAspectRatio="none"` bilinçli: desen dar bir kenar şeridinde de,
 * mesai defterinin boş kalan yüksekliğinde de gerilerek dolduruyor. Kravat
 * dokusu zaten gerilmiş bir kumaş — orantısı korunmak zorunda değil.
 *
 * Çizgiler eşit aralıklı DEĞİL: repp kravatta bantlar kalın-ince-kalın gider
 * ve elle çizilmiş hissi tam olarak o düzensizlikten geliyor.
 */
export function TieStripes({
  className,
  stripeClassName,
  fineClassName,
}: {
  className?: string;
  stripeClassName?: string;
  fineClassName?: string;
}) {
  /* Bant başlangıçları ve kalınlıkları — elle seçildi, üretilmedi. */
  const bands: Array<[number, number]> = [
    [-60, 13],
    [-38, 4],
    [-28, 13],
    [-6, 5],
    [5, 12],
    [26, 4],
    [36, 13],
    [58, 5],
    [69, 12],
    [90, 4],
    [100, 13],
  ];

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      focusable="false"
      aria-hidden
    >
      {bands.map(([x, w]) => (
        <path
          key={`${x}-${w}`}
          className={w > 8 ? stripeClassName : fineClassName}
          d={`M ${x} 100 L ${x + 62} 0 L ${x + 62 + w} 0 L ${x + w} 100 Z`}
        />
      ))}
    </svg>
  );
}

/**
 * Mesai kadranı — 09:00'dan 18:00'e.
 *
 * Gerçek bir on iki saatlik kadran: akrep 09:00'da sola bakıyor (270°) ve
 * saat başına 30° dönerek 18:00'de aşağıyı gösteriyor (540° = 180°). Yani
 * dokuz saatlik vardiya, kadranın dörtte üçlük bir turu.
 *
 * Açı `--nan-dial-angle` olarak dışarı veriliyor; dönüşün kendisi CSS'te ve
 * `steps()` ile kademeli — ibre akrep gibi atlıyor, süzülmüyor.
 */
export function ClockDial({
  hour,
  start,
  end,
  className,
  faceClassName,
  tickClassName,
  tickPastClassName,
  handClassName,
  pivotClassName,
}: {
  hour: number;
  start: number;
  end: number;
  className?: string;
  faceClassName?: string;
  tickClassName?: string;
  tickPastClassName?: string;
  handClassName?: string;
  pivotClassName?: string;
}) {
  const angle = 270 + (hour - start) * 30;
  const style = { "--nan-dial-angle": `${angle}deg` } as CSSProperties;

  const ticks: number[] = [];
  for (let h = start; h <= end; h += 1) ticks.push(h);

  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      focusable="false"
      aria-hidden
      style={style}
    >
      {/* Kadran — tam daire değil: elle çizilmiş bir kayıt kaşesi gibi
          hafifçe eksik kapanıyor. */}
      <path
        className={faceClassName}
        d="M 60 8 A 52 52 0 1 1 59.4 8.02"
        fill="none"
      />

      {ticks.map((h) => {
        const a = ((270 + (h - start) * 30) * Math.PI) / 180;
        const x1 = 60 + Math.cos(a - Math.PI / 2) * 44;
        const y1 = 60 + Math.sin(a - Math.PI / 2) * 44;
        const x2 = 60 + Math.cos(a - Math.PI / 2) * 51;
        const y2 = 60 + Math.sin(a - Math.PI / 2) * 51;
        return (
          <line
            key={h}
            className={h <= hour ? tickPastClassName : tickClassName}
            x1={x1.toFixed(2)}
            y1={y1.toFixed(2)}
            x2={x2.toFixed(2)}
            y2={y2.toFixed(2)}
          />
        );
      })}

      {/* Akrep. Dönme merkezi kadranın ortası; açıyı CSS okuyor. */}
      <g className={handClassName}>
        <line x1="60" y1="60" x2="60" y2="22" />
      </g>
      <circle className={pivotClassName} cx="60" cy="60" r="3.4" />
    </svg>
  );
}

/**
 * Kayıt kaşesi — açılmış bir defter satırının yanına basılan işaret.
 * Dikdörtgen bilerek eğri: elle basılmış bir kaşe düz oturmaz.
 */
export function StampMark({
  className,
  frameClassName,
  slashClassName,
}: {
  className?: string;
  frameClassName?: string;
  slashClassName?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 40 24" focusable="false" aria-hidden>
      <path
        className={frameClassName}
        d="M 2.5 3.2 L 37.4 2.1 L 37.9 21.4 L 3.1 22.3 Z"
        fill="none"
      />
      <path className={slashClassName} d="M 8 17.6 L 32 6.4" fill="none" />
    </svg>
  );
}
