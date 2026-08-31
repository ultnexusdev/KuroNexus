/**
 * Getō sayfasının elle çizilmiş işaretleri — SUNUCU BİLEŞENİ.
 *
 * `"use client"` YOK ve olmamalı: bunlar durum tutmayan saf SVG'ler, istemci
 * paketine inmelerinin hiçbir karşılığı olmaz (Levi'nin `LeviGlyphs`
 * emsalinin aynısı).
 *
 * ── NEDEN ELLE ÇİZİLDİ ───────────────────────────────────────────────────
 * FAZ 2 §3: sahne/teknik/motif görselleri ÜRETİLMİYOR ve dışarıdan raster
 * indirilmiyor. Motif gerekiyorsa çizilecek. Bu dosyadaki üç işaret de
 * `currentColor` yerine dışarıdan gelen sınıflarla boyanıyor, yani renk
 * kararı CSS modülünde kalıyor (kural 16: bileşende hex yok).
 *
 * Üçü de DEKORATİF: çağıran taraf `aria-hidden` sarmalayıcı kullanıyor,
 * `focusable="false"` ve `role="presentation"` burada.
 */

/**
 * Torii — tapınak kapısı.
 *
 * İki direk, üstte kavisli kasagi (笠木), altında düz nuki (貫) ve ortada
 * gakuzuka (額束). Kavis bilerek asimetrik: matematiksel bir kapı değil,
 * elle çizilmiş bir kapı istendi.
 */
export function ToriiGate({
  className,
  postClassName,
  beamClassName,
  glowClassName,
}: {
  className?: string;
  postClassName?: string;
  beamClassName?: string;
  glowClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 200"
      role="presentation"
      focusable="false"
      aria-hidden="true"
    >
      {/* Kapının arkasındaki duman lekesi — dolgusu çok düşük opaklıkta */}
      <path
        className={glowClassName}
        d="M56 178 C 62 120, 74 84, 120 62 C 166 84, 178 120, 184 178 Z"
      />

      {/* Kasagi: üst kiriş, uçları hafifçe yukarı kalkıyor */}
      <path
        className={beamClassName}
        d="M22 44 C 62 33, 178 33, 218 44"
        fill="none"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Shimaki: kasaginin hemen altındaki ince ikinci kiriş */}
      <path
        className={beamClassName}
        d="M32 57 L 208 57"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Nuki: alt kiriş, direkleri aşarak iki yana taşıyor */}
      <path
        className={beamClassName}
        d="M40 92 L 200 92"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Gakuzuka: iki kiriş arasındaki dikey blok */}
      <path
        className={beamClassName}
        d="M120 57 L 120 92"
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Direkler — dipte hafifçe açılıyor */}
      <path
        className={postClassName}
        d="M62 57 L 55 186"
        fill="none"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        className={postClassName}
        d="M178 57 L 185 186"
        fill="none"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Tespih (juzu) deseni — kapalı bir halka boncuk + sarkan püskül.
 *
 * Boncuklar elle konumlandırıldı (döngüyle değil), çünkü eşit aralıklı bir
 * halka çizim değil bir grafik olurdu; aradaki küçük sapmalar deseni el
 * işine yaklaştırıyor.
 */
export function BeadStrand({
  className,
  cordClassName,
  beadClassName,
  knotClassName,
}: {
  className?: string;
  cordClassName?: string;
  beadClassName?: string;
  knotClassName?: string;
}) {
  const beads: Array<[number, number, number]> = [
    [60, 14, 5.2],
    [86, 20, 4.6],
    [104, 40, 5.4],
    [110, 66, 4.4],
    [104, 92, 5.1],
    [86, 112, 4.7],
    [60, 119, 5.5],
    [34, 112, 4.5],
    [16, 92, 5.3],
    [10, 66, 4.6],
    [16, 40, 5.2],
    [34, 20, 4.4],
  ];

  return (
    <svg
      className={className}
      viewBox="0 0 120 190"
      role="presentation"
      focusable="false"
      aria-hidden="true"
    >
      <ellipse
        className={cordClassName}
        cx="60"
        cy="66"
        rx="50"
        ry="53"
        fill="none"
        strokeWidth="1.6"
      />
      {beads.map(([cx, cy, r]) => (
        <circle
          key={`${cx}-${cy}`}
          className={beadClassName}
          cx={cx}
          cy={cy}
          r={r}
        />
      ))}
      {/* Ana boncuk (oyadama) ve püskül */}
      <circle className={knotClassName} cx="60" cy="121" r="8" />
      <path
        className={cordClassName}
        d="M60 129 C 58 146, 63 158, 60 176"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        className={cordClassName}
        d="M60 129 C 66 148, 55 160, 58 180"
        fill="none"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Yol çatalı — sayfanın ızgarasının işareti.
 *
 * Tek gövde yukarıdan geliyor, aşağıda ikiye ayrılıyor. `taken` kolu koyu,
 * `ghost` kolu soluk çiziliyor; hangisinin hangisi olduğunu ÇAĞIRAN taraf
 * sınıf vererek söylüyor, çünkü karar CSS'te (`[data-branch]`).
 */
export function ForkMark({
  className,
  stemClassName,
  leftClassName,
  rightClassName,
  nodeClassName,
}: {
  className?: string;
  stemClassName?: string;
  leftClassName?: string;
  rightClassName?: string;
  nodeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 96"
      role="presentation"
      focusable="false"
      aria-hidden="true"
    >
      <path
        className={stemClassName}
        d="M30 0 L 30 38"
        fill="none"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        className={leftClassName}
        d="M30 38 C 30 58, 16 62, 8 92"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        className={rightClassName}
        d="M30 38 C 30 58, 44 62, 52 92"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle className={nodeClassName} cx="30" cy="38" r="4.2" />
    </svg>
  );
}
