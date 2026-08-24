/**
 * Gaara sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §3.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor — emsal
 * `components/character/itachi/SharinganEyes.tsx`. Renkler yalnızca
 * token'dan geliyor (`--gaa-*`, modülün başındaki deri bloğu); bu dosyada da
 * tek hex yok.
 *
 * Hareket CSS'te: bileşenler yalnızca `className` alıp geometriyi çiziyor,
 * neyin ne zaman görüneceğini `data-*` nitelikleri söylüyor. Böylece
 * reduced-motion battaniyesi (modülün sonu) hepsini tek yerden durduruyor.
 *
 * ⚠️ Bu dosyada "use client" YOK ama iki istemci adası da (`ShukakuShell`,
 * `SandStrata`) onu çağırıyor — düz JSX olduğu için istemci paketine
 * giriyor, ek bağımlılık getirmiyor. Hero'daki ufuk ve taneler sunucuda
 * çiziliyor.
 */

/* ── Hero: çöl ufku ──────────────────────────────────────────────────────
   İki eğri hat. Alttaki yakın kum tepesi, üstteki uzak sırt; ikisinin
   arasındaki boşluk sayfanın "sıcak" nefesi. Yatayda esnetiliyor
   (preserveAspectRatio="none"), o yüzden çizgiler ölçeklenmeyen kalemle. */

export function DesertHorizon({
  className,
  ridgeClassName,
}: {
  className?: string;
  ridgeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 320"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      {/* Uzak sırt — ince, neredeyse düz */}
      <path
        className={ridgeClassName}
        data-ridge="far"
        d="M0 168 C 168 140, 322 152, 470 132 C 636 110, 742 138, 884 124 C 1006 112, 1104 130, 1200 118"
        stroke="var(--gaa-gourd)"
        strokeWidth="1.4"
        vectorEffect="non-scaling-stroke"
      />
      {/* Yakın tepe — daha kalın, daha yüksek genlikli */}
      <path
        className={ridgeClassName}
        data-ridge="near"
        d="M0 268 C 152 220, 268 254, 424 222 C 588 188, 700 240, 856 214 C 998 190, 1092 232, 1200 206"
        stroke="var(--gaa-sand)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ── Hero: dağılan kum taneleri ──────────────────────────────────────────
   Portrenin kenarından savrulan tane bulutu. Koordinatlar elle dizildi:
   sol kenarda yoğun, sağa doğru seyreliyor — rüzgâr yönü tek. `data-band`
   üç derinlik kademesi veriyor, hareket CSS'te ona göre gecikiyor. */

const GRAINS: { x: number; y: number; r: number; band: 1 | 2 | 3 }[] = [
  { x: 6, y: 18, r: 1.9, band: 1 },
  { x: 14, y: 46, r: 1.2, band: 2 },
  { x: 11, y: 74, r: 2.3, band: 1 },
  { x: 22, y: 30, r: 1, band: 3 },
  { x: 27, y: 62, r: 1.6, band: 2 },
  { x: 24, y: 92, r: 1.1, band: 3 },
  { x: 36, y: 14, r: 1.4, band: 2 },
  { x: 39, y: 51, r: 2.1, band: 1 },
  { x: 34, y: 80, r: 1, band: 3 },
  { x: 48, y: 34, r: 1.2, band: 3 },
  { x: 52, y: 68, r: 1.7, band: 2 },
  { x: 46, y: 96, r: 1.3, band: 1 },
  { x: 61, y: 22, r: 1.5, band: 1 },
  { x: 64, y: 57, r: 1, band: 3 },
  { x: 58, y: 86, r: 1.8, band: 2 },
  { x: 73, y: 40, r: 1.1, band: 2 },
  { x: 78, y: 72, r: 1.4, band: 1 },
  { x: 71, y: 12, r: 1, band: 3 },
  { x: 86, y: 28, r: 1.3, band: 3 },
  { x: 90, y: 62, r: 1, band: 2 },
  { x: 83, y: 94, r: 1.6, band: 1 },
  { x: 96, y: 44, r: 1.1, band: 3 },
];

export function SandGrains({
  className,
  grainClassName,
}: {
  className?: string;
  grainClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 110"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable="false"
    >
      <g fill="var(--gaa-sand)">
        {GRAINS.map((grain) => (
          <circle
            key={`${grain.x}-${grain.y}`}
            className={grainClassName}
            data-band={grain.band}
            cx={grain.x}
            cy={grain.y}
            r={grain.r}
            fillOpacity={grain.band === 1 ? 0.5 : grain.band === 2 ? 0.32 : 0.2}
          />
        ))}
      </g>
    </svg>
  );
}

/* ── Mod düğmesinin gliffi: Shukaku'nun tek gözü ─────────────────────────
   Badem göz + halka iris + dört uçlu yıldız gözbebeği (Ichibi'nin işareti).
   Kapalıyken gözbebeği küçük, modda CSS onu büyütüyor. */

export function ShukakuEye({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M2.5 16 C 8 8.4, 24 8.4, 29.5 16 C 24 23.6, 8 23.6, 2.5 16 Z"
        fill="var(--gaa-shukaku)"
        fillOpacity="0.22"
        stroke="var(--gaa-sand)"
        strokeWidth="1.4"
      />
      <circle cx="16" cy="16" r="5.4" stroke="var(--gaa-sand)" strokeWidth="1.2" />
      <path
        d="M16 9.8 L17.5 14.5 L22 16 L17.5 17.5 L16 22.2 L14.5 17.5 L10 16 L14.5 14.5 Z"
        fill="var(--gaa-gourd)"
      />
    </svg>
  );
}

/* ── Shukaku modunun kenar silueti ───────────────────────────────────────
   Sayfanın kenarında beliren tek gözlü baş: iki sivri kulak, geniş bir
   çene ve tek bir göz. Kapalıyken hiç çizilmiyor (CSS opaklığı 0), açıkken
   kenardan içeri sızıyor. Sağdaki kopya CSS'te aynalanıyor. */

export function ShukakuWatcher({
  className,
  eyeClassName,
}: {
  className?: string;
  eyeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 420"
      fill="none"
      preserveAspectRatio="xMinYMid meet"
      aria-hidden
      focusable="false"
    >
      {/* Baş — kenardan çıkan kaba kütle */}
      <path
        d="M-40 40 L58 12 L84 78 L142 46 L166 128 C 204 176, 214 244, 178 306 C 142 368, 62 404, -40 402 Z"
        fill="var(--gaa-shukaku)"
        fillOpacity="0.1"
        stroke="var(--gaa-gourd)"
        strokeWidth="1.2"
        strokeOpacity="0.45"
      />
      {/* Yüzdeki çizgiler — tanuki işaretleri */}
      <g stroke="var(--gaa-gourd)" strokeOpacity="0.35" strokeWidth="1.1">
        <path d="M18 196 C 62 186, 104 190, 138 204" />
        <path d="M8 268 C 56 262, 100 268, 132 282" />
      </g>
      {/* Tek göz */}
      <g className={eyeClassName}>
        <path
          d="M44 214 C 74 190, 128 190, 152 218 C 128 246, 74 246, 44 214 Z"
          fill="var(--gaa-shukaku)"
          fillOpacity="0.5"
        />
        <circle cx="98" cy="217" r="17" fill="var(--gaa-gourd)" fillOpacity="0.85" />
        <path
          d="M98 196 L103 211 L118 217 L103 223 L98 238 L93 223 L78 217 L93 211 Z"
          fill="var(--bg)"
        />
      </g>
    </svg>
  );
}

/* ── Kum kesiti: bir tabakanın bandı ─────────────────────────────────────
   Beş bandın her biri kendi düğmesinin içinde duruyor; kesit bu bantların
   üst üste yığılmasıyla oluşuyor. Üst kenar dalgalı, alt kenar düz — yani
   her bant bir sonrakinin tabanına oturuyor.

   Derinlik dalgayı düzleştiriyor: alttaki tabaka (0) neredeyse düz —
   sıkışmış, yaşlı kum; en üstteki (4) tepe genliğinde — gevşek yüzey kumu.
   Bant yatayda esnetiliyor, o yüzden çizgiler ölçeklenmeyen kalemle. */

const BAND_EDGES = [
  "M0 30 C 100 27, 200 33, 300 30 C 400 27, 500 33, 600 30",
  "M0 30 C 96 22, 186 38, 292 30 C 398 22, 496 37, 600 29",
  "M0 32 C 88 18, 180 42, 284 30 C 392 18, 500 40, 600 28",
  "M0 34 C 82 14, 176 46, 286 28 C 396 12, 502 44, 600 26",
  "M0 38 C 76 8, 168 52, 282 26 C 398 6, 508 48, 600 22",
];

/** Bandın içindeki iri taneler — her bant için ayrı dizi, elle dizildi. */
const BAND_GRAINS = [
  [72, 104, 198, 246, 337, 402, 461, 528, 571],
  [46, 118, 176, 233, 305, 366, 428, 499, 556],
  [88, 141, 205, 268, 322, 391, 447, 512, 583],
  [58, 126, 188, 252, 316, 379, 434, 505, 561],
  [96, 152, 214, 275, 331, 398, 456, 519, 578],
];

export function SandBand({
  index,
  className,
  edgeClassName,
  grainClassName,
}: {
  /** 0 tabanlı tabaka sırası (0 en alt, 4 en üst) */
  index: number;
  className?: string;
  edgeClassName?: string;
  grainClassName?: string;
}) {
  const step = Math.min(Math.max(index, 0), 4);
  const edge = BAND_EDGES[step] ?? BAND_EDGES[0];
  const grains = BAND_GRAINS[step] ?? BAND_GRAINS[0];

  return (
    <svg
      className={className}
      viewBox="0 0 600 100"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      {/* Bandın gövdesi: dalgalı üst kenar + düz taban */}
      <path d={`${edge} L600 100 L0 100 Z`} fill="var(--gaa-shield)" />
      {/* Üst kenar çizgisi — tabakalar arasındaki ayrım */}
      <path
        className={edgeClassName}
        d={edge}
        stroke="var(--gaa-sand)"
        strokeWidth="1.2"
        strokeOpacity="0.5"
        vectorEffect="non-scaling-stroke"
      />
      <g className={grainClassName} fill="var(--gaa-sand)" fillOpacity="0.35">
        {grains.map((x, position) => (
          <circle
            key={x}
            cx={x}
            cy={52 + ((position * 13) % 38)}
            r={position % 3 === 0 ? 2.6 : 1.7}
          />
        ))}
      </g>
    </svg>
  );
}

/* ── 愛 — sayfanın duygusal merkezi ──────────────────────────────────────
   ⚠️ Bu bir font değil: on üç ayrı fırça yolu, elle dizilmiş. Sebebi
   sayfanın kendisi — Gaara bu harfi YAZMADI, KAZIDI. Yazı tipinden gelen
   temiz bir glif o cümleyi anlatamazdı; burada her stroke önce bir oluk
   (kaydırılmış koyu kopya), sonra kenarı (açık kopya) olarak çiziliyor,
   yani harf yüzeye batıyor.

   `pathLength={1}` her strokea aynı normalize uzunluğu veriyor: kazınma
   animasyonu (CSS `--gaa-carve`) böylece uzunluktan bağımsız, düzenli bir
   sırayla ilerliyor. Sıra gerçek yazım sırası: 爫 → 冖 → 心 → 夂.

   Harf DEKORATİF DEĞİL, anlam taşıyor: `role="img"` + iki dilli etiket
   çağırandan geliyor. */

const AI_STROKES: { d: string; w: number }[] = [
  /* 爫 — tırnak radikali */
  { d: "M53 10 C 49 17, 45 22, 40 27", w: 5 },
  { d: "M62 14 L58 27", w: 4.4 },
  { d: "M75 13 L71 27", w: 4.4 },
  { d: "M87 13 L84 27", w: 4.4 },
  /* 冖 — örtü */
  { d: "M24 31 L29 39", w: 4 },
  { d: "M20 43 H95 C 99 43, 100 46, 99 50 L98 55", w: 5 },
  /* 心 — kalp, sıkıştırılmış */
  { d: "M39 54 C 37 59, 37 63, 39 67", w: 4 },
  { d: "M49 53 C 47 62, 52 70, 62 70 C 68 70, 72 67, 74 62", w: 5 },
  { d: "M57 54 L60 61", w: 3.8 },
  { d: "M70 50 L75 58", w: 3.8 },
  /* 夂 — ayaklar */
  { d: "M46 76 C 42 80, 38 84, 34 87", w: 4.4 },
  { d: "M80 74 C 68 86, 50 98, 22 110", w: 5.4 },
  { d: "M50 86 C 63 93, 78 101, 100 111", w: 5.4 },
];

export function AiKanji({
  className,
  strokeClassName,
  grooveClassName,
  title,
}: {
  className?: string;
  strokeClassName?: string;
  grooveClassName?: string;
  /** Ekran okuyucuya inen iki dilli açıklama */
  title: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      role="img"
      aria-label={title}
      focusable="false"
    >
      {/* Oluk: kaydırılmış koyu kopya — harfin battığı yer */}
      <g
        className={grooveClassName}
        stroke="var(--bg)"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(1.6 2)"
        opacity="0.75"
      >
        {AI_STROKES.map((stroke) => (
          <path key={stroke.d} d={stroke.d} strokeWidth={stroke.w + 1.2} />
        ))}
      </g>
      {/* Harfin kendisi — tek kırmızı, sayfanın tek --accent kütlesi */}
      <g strokeLinecap="round" strokeLinejoin="round">
        {AI_STROKES.map((stroke, position) => (
          <path
            key={stroke.d}
            className={strokeClassName}
            data-stroke={position}
            d={stroke.d}
            stroke="var(--accent)"
            strokeWidth={stroke.w}
            pathLength={1}
          />
        ))}
      </g>
    </svg>
  );
}
