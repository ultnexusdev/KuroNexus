/**
 * Renji sayfasının elle çizilmiş SVG motifleri.
 *
 * ⚠️ SUNUCU BİLEŞENİ — `"use client"` YOK. Bu dosya yalnızca geometri
 * üretiyor, durum tutmuyor; istemciye inmesi için hiçbir sebep yok
 * (istemci ada bütçesi üç ve ikisi zaten `JointShell` + `SegmentChain`).
 *
 * ── NEDEN SVG, NEDEN RASTER DEĞİL ────────────────────────────────────────
 * Faz 2 §3: sahne/teknik/dönem görselleri ÜRETİLMİYOR ve dışarıdan raster
 * indirilmiyor. Motif gerekiyorsa elle çizilir. Buradaki üç motif de
 * sayfanın kilitli eksenlerinden geliyor:
 *
 *   TattooBand  → filigran (Renji'nin alnındaki/gövdesindeki çizgiler)
 *   TattooRule  → bölüm ayıracı; `stroke-dashoffset` ile ÇİZİLİYOR
 *   SpineMotif  → bankai'de beliren kemik beyazı omurga
 *
 * Renkler burada YOK: her parça bir `className` alıyor ve boyayı CSS
 * modülü veriyor (kural 16 — bileşende hex yasak, hatta SVG içinde de).
 */

/**
 * Dövme filigranı — alın bandının soyutlanmış hâli.
 *
 * Beş yatay kama üst üste: her biri ortada yukarı kırılıyor, aşağı indikçe
 * daralıyor ve inceliyor. Yanlarda iki sivri uç bandı kapatıyor. Şekiller
 * KONTUR değil DOLGU, çünkü Renji'nin dövmesi kalın ve uçları sivrilen bir
 * fırça izi; eşit kalınlıkta bir `stroke` onu bir çizim şablonuna çevirirdi.
 */
export function TattooBand({
  className,
  strokeClassName,
  spikeClassName,
}: {
  className?: string;
  strokeClassName?: string;
  spikeClassName?: string;
}) {
  const rows = [0, 1, 2, 3, 4].map((i) => {
    const y = 46 + i * 42;
    const lift = 30 - i * 4;
    const thick = 19 - i * 2.4;
    const half = 172 - i * 16;
    return {
      i,
      d:
        `M ${200 - half} ${y} ` +
        `L 200 ${y - lift} ` +
        `L ${200 + half} ${y} ` +
        `L ${200 + half} ${y + thick} ` +
        `L 200 ${y - lift + thick} ` +
        `L ${200 - half} ${y + thick} Z`,
    };
  });

  return (
    <svg
      className={className}
      viewBox="0 0 400 260"
      role="presentation"
      focusable="false"
      aria-hidden
    >
      {rows.map((row) => (
        <path key={row.i} className={strokeClassName} d={row.d} />
      ))}
      {/* Bandı kapatan iki sivri uç — dövmenin şakaklara doğru inceldiği yer */}
      <path className={spikeClassName} d="M 18 44 L 44 58 L 20 74 Z" />
      <path className={spikeClassName} d="M 382 44 L 356 58 L 380 74 Z" />
      <path className={spikeClassName} d="M 54 214 L 92 200 L 78 226 Z" />
      <path className={spikeClassName} d="M 346 214 L 308 200 L 322 226 Z" />
    </svg>
  );
}

/**
 * Bölüm ayıracı — tek bir dövme çizgisi, ortasında bir EKLEM kırığı.
 *
 * `preserveAspectRatio="none"`: çizgi kabının enine yayılıyor, kalınlık
 * `vector-effect="non-scaling-stroke"` sayesinde sabit kalıyor. Çizilme
 * animasyonu (`stroke-dashoffset`) CSS tarafında; buradaki tek iş
 * `pathLength="100"` vermek, böylece CSS dash değerlerini yüzde olarak
 * yazabiliyor ve genişlik değişse de animasyon aynı kalıyor.
 */
export function TattooRule({
  className,
  lineClassName,
  nodeClassName,
}: {
  className?: string;
  lineClassName?: string;
  nodeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 14"
      preserveAspectRatio="none"
      role="presentation"
      focusable="false"
      aria-hidden
    >
      <path
        className={lineClassName}
        pathLength="100"
        vectorEffect="non-scaling-stroke"
        fill="none"
        d="M 0 7 H 96 L 106 2 L 118 12 L 128 7 H 240"
      />
      <path
        className={nodeClassName}
        vectorEffect="non-scaling-stroke"
        fill="none"
        d="M 112 1 V 13"
      />
    </svg>
  );
}

/**
 * Kemik beyazı omurga — yalnızca `data-release="bankai"` iken görünür.
 *
 * Hihiō Zabimaru'nun gövdesi eklemli bir kemik dizisi; motif onu dikey bir
 * şerit hâline indirgiyor. Sekiz omur + ortadan geçen bir kordon. Omurlar
 * aşağı indikçe büyüyor: bankai'de zincir aşağı doğru uzuyor.
 */
export function SpineMotif({
  className,
  boneClassName,
  cordClassName,
}: {
  className?: string;
  boneClassName?: string;
  cordClassName?: string;
}) {
  const bones = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
    const y = 24 + i * 46;
    const w = 13 + i * 1.6;
    const h = 15 + i * 0.9;
    return { i, y, w, h };
  });

  return (
    <svg
      className={className}
      viewBox="0 0 64 400"
      role="presentation"
      focusable="false"
      aria-hidden
    >
      <path
        className={cordClassName}
        fill="none"
        vectorEffect="non-scaling-stroke"
        d="M 32 8 V 392"
      />
      {bones.map((bone) => (
        <g key={bone.i} style={{ "--ren-bone": bone.i } as React.CSSProperties}>
          <rect
            className={boneClassName}
            x={32 - bone.w / 2}
            y={bone.y}
            width={bone.w}
            height={bone.h}
            rx={3}
          />
          {/* Yanal çıkıntılar — omurun kaburgaya bağlandığı yer */}
          <rect
            className={boneClassName}
            x={32 - bone.w / 2 - 9}
            y={bone.y + bone.h / 2 - 2}
            width={9}
            height={4}
            rx={2}
          />
          <rect
            className={boneClassName}
            x={32 + bone.w / 2}
            y={bone.y + bone.h / 2 - 2}
            width={9}
            height={4}
            rx={2}
          />
        </g>
      ))}
    </svg>
  );
}
