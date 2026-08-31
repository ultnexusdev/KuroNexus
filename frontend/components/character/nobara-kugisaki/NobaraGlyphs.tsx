/**
 * Nobara sayfasının elle çizilmiş SVG glifleri — SUNUCU bileşeni.
 *
 * `"use client"` YOK ve olmamalı: burada durum yok, yalnızca yol verisi var.
 * Sayfanın üç istemci adası (`ResonanceShell`, `NailField`) bu dosyayı
 * çağırabiliyor çünkü prop olarak inen `className`ler dışında hiçbir şey
 * taşımıyor.
 *
 * ── NEDEN ELLE ÇİZİLDİ ───────────────────────────────────────────────────
 * Faz 2 §3: sahne/teknik/motif görselleri ÜRETİLMEZ ve dışarıdan raster
 * indirilmez. Filigran gerekiyorsa çizilir. Buradaki üç glif de öyle:
 *
 *   StrawDoll   — saman bebek: bağlanmış saman demeti, göğsünde bir çivi
 *   NailMark    — tek çivi silueti (baş + gövde + uç)
 *   HammerMark  — çekiç silueti (mod düğmesinin işareti)
 *
 * Hepsi dekoratif: çağıran taraf `aria-hidden` sarmalayıcı koyuyor ve
 * SVG'lerin kendisi de `focusable="false"` taşıyor. Renk gelmiyor —
 * `stroke="currentColor"` / sınıf üzerinden CSS boyuyor, böylece deri
 * bloğu dışında hex doğmuyor (kural 16).
 */

/**
 * Saman bebek. Bir moda dergisinin sayfa filigranı gibi kullanılıyor: çok
 * büyük, çok soluk, kontur.
 *
 * Çizim mantığı: üç saman demeti (gövde + iki kol) iki bağla tutturulmuş,
 * baş ayrı bir düğüm. Saman lifleri düz çizgi değil — hafif kırık, çünkü
 * saman düz durmaz.
 */
export function StrawDoll({
  className,
  bodyClassName,
  bindClassName,
  nailClassName,
}: {
  className?: string;
  bodyClassName?: string;
  bindClassName?: string;
  nailClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 300"
      fill="none"
      focusable="false"
      aria-hidden="true"
    >
      {/* Baş — saman düğümü */}
      <g className={bodyClassName}>
        <path d="M100 18 L92 46 M100 18 L100 48 M100 18 L108 46" />
        <path d="M86 30 L94 44 M114 30 L106 44" />
        <path d="M78 40 L90 50 M122 40 L110 50" />
      </g>
      <path className={bindClassName} d="M84 52 Q100 60 116 52" />
      <path className={bindClassName} d="M85 58 Q100 65 115 58" />

      {/* Gövde — düşey saman demeti, lifler hafif kırık */}
      <g className={bodyClassName}>
        <path d="M100 62 L98 130 L100 214" />
        <path d="M90 64 L86 132 L88 206" />
        <path d="M110 64 L114 132 L112 206" />
        <path d="M81 70 L76 134 L79 196" />
        <path d="M119 70 L124 134 L121 196" />
      </g>

      {/* Kollar — iki yana açılmış demetler */}
      <g className={bodyClassName}>
        <path d="M96 88 L44 108 L30 118" />
        <path d="M96 96 L46 118 L32 128" />
        <path d="M104 88 L156 108 L170 118" />
        <path d="M104 96 L154 118 L168 128" />
      </g>

      {/* Bel bağı — iki tur */}
      <path className={bindClassName} d="M78 128 Q100 138 122 128" />
      <path className={bindClassName} d="M79 136 Q100 145 121 136" />

      {/* Bacak ayrımı — demet aşağıda ikiye ayrılıyor */}
      <g className={bodyClassName}>
        <path d="M94 176 L84 240 L80 268" />
        <path d="M106 176 L116 240 L120 268" />
        <path d="M88 180 L74 244 L70 264" />
        <path d="M112 180 L126 244 L130 264" />
      </g>
      <path className={bindClassName} d="M84 186 Q100 194 116 186" />

      {/* Göğse çakılmış çivi — bebeğin tek yabancı parçası */}
      <g className={nailClassName}>
        <path d="M86 104 L114 104" />
        <path d="M100 104 L100 152" />
        <path d="M96 148 L100 160 L104 148" />
      </g>
    </svg>
  );
}

/**
 * Tek çivi. Çivi noktalarının rozetinde ve kayıt satırlarında kullanılıyor.
 * Baş yatay bir çubuk, gövde dikey, uç sivri üçgen.
 */
export function NailMark({
  className,
  headClassName,
  shaftClassName,
}: {
  className?: string;
  headClassName?: string;
  shaftClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 48"
      fill="none"
      focusable="false"
      aria-hidden="true"
    >
      <path className={headClassName} d="M4 6 L20 6" />
      <path className={shaftClassName} d="M12 6 L12 36" />
      <path className={shaftClassName} d="M9 34 L12 44 L15 34" />
    </svg>
  );
}

/**
 * Çekiç. Mod düğmesinin işareti — düğmeye basınca CSS onu bir kez
 * indiriyor (hareket dili: çekiç vuruşu).
 */
export function HammerMark({
  className,
  headClassName,
  handleClassName,
}: {
  className?: string;
  headClassName?: string;
  handleClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      focusable="false"
      aria-hidden="true"
    >
      <path className={headClassName} d="M6 9 L28 9 L28 17 L6 17 Z" />
      <path className={headClassName} d="M28 10 L34 13 L34 13.5 L28 16.5 Z" />
      <path className={handleClassName} d="M16 17 L16 35" />
    </svg>
  );
}
