/**
 * Izuku Midoriya sayfasının elle çizilmiş işaretleri.
 *
 * Neden elle SVG: sahne/teknik görselleri üretilmiyor (FAZ 2 §3) ve dışarıdan
 * raster indirilmiyor. Sayfanın bütün grafik dili buradan çıkıyor: kalem
 * çizgisi, ok işareti, şimşek kıvılcımı, ataş ve sekiz vestige silueti.
 *
 * ⚠️ Bu dosyada `"use client"` YOK ve durum da yok — hepsi saf JSX. Hem
 * sunucu bileşeni (`NotebookExperience`) hem istemci adaları
 * (`AnalysisShell`, `VestigeStack`) buradan import ediyor; Eren sayfasında
 * `ErenGlyphs` ile kurulan emsal bu.
 *
 * Renk buradan GELMİYOR: her stroke/fill `currentColor` okuyor ya da
 * dışarıdan gelen sınıfı taşıyor. Böylece hex disiplini (kural 16)
 * bozulmuyor — bu dosyada tek bir renk değeri yok.
 */

/**
 * Kalemle çizilmiş ok — kenar notundan içeriğe uzanan işaret.
 *
 * Hareket dilinin taşıyıcısı: `stroke-dasharray`/`stroke-dashoffset` CSS'te
 * animasyona bağlanıyor, yani ok Analiz açıldığında ÇİZİLİYOR. Uzunluk
 * yaklaşık 120 birim; CSS bu sayıyı biliyor (`--mid-draw`).
 */
export function ArrowMark({
  className,
  strokeClassName,
}: {
  className?: string;
  strokeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 40"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g
        className={strokeClassName}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Gövde: hafif elle çizilmiş bir yay */}
        <path d="M4 30 C 26 30 40 8 62 10 C 82 12 92 20 112 18" />
        {/* Uç: iki kısa çizgi */}
        <path d="M112 18 L100 12 M112 18 L101 26" />
      </g>
    </svg>
  );
}

/**
 * Elle çizilmiş alt çizgi — bir terimin altını çizmek için.
 *
 * Düz değil: iki kez geçilmiş bir kalem izi gibi hafif kaymış iki çizgi.
 */
export function UnderlineMark({
  className,
  strokeClassName,
}: {
  className?: string;
  strokeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g className={strokeClassName} fill="none" strokeLinecap="round">
        <path d="M3 6 C 48 3 92 9 138 5 C 164 3 182 6 197 5" />
        <path d="M8 9 C 54 7 96 11 140 8" />
      </g>
    </svg>
  );
}

/**
 * Yeşil şimşek kıvılcımı — sayfanın hareket dilinin ikinci yarısı.
 *
 * Kısa ve sinirli: uzun bir yıldırım değil, gövdeden sıçrayan üç küçük
 * çentik. Animasyon CSS'te (`midSpark`), burada yalnızca geometri var.
 */
export function SparkMark({
  className,
  strokeClassName,
}: {
  className?: string;
  strokeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 60"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g
        className={strokeClassName}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M34 4 L20 27 L31 28 L22 56" />
        <path d="M48 16 L40 26 L46 27 L41 38" />
        <path d="M14 20 L8 29 L13 30 L9 40" />
      </g>
    </svg>
  );
}

/**
 * Ataş — deftere iliştirilmiş kadrajın köşesinde duruyor.
 *
 * Boş kadrajın ziyaretçiye görünen TEK süsü bu: yazı yok, ölçü yok
 * (Dalga 1 dersi — üretim metadatası ziyaretçiye sızmayacak).
 */
export function ClipMark({
  className,
  strokeClassName,
}: {
  className?: string;
  strokeClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 64"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g
        className={strokeClassName}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 56 L13 16 A 7 7 0 0 1 27 16 L27 48 A 4.5 4.5 0 0 1 18 48 L18 22" />
      </g>
    </svg>
  );
}

/**
 * Sekiz vestige silueti.
 *
 * ⚠️ PORTRE DEĞİL: yüz yok, saç yok, kıyafet yok. Sekiz kişi birbirinden
 * yalnızca BOY, OMUZ ve ETEK payıyla ayrılıyor — arşivin elinde bu
 * kişilerin doğrulanmış bir görseli yok ve bir tane uydurmak yerine
 * hepsi aynı geometrik ilkeden türetildi.
 *
 * Ölçüler bir tabloda, gövde eğrisi o tablodan hesaplanıyor: her siluet
 * omuzdan eteğe açılan iki simetrik Bézier. `index` 0–7.
 */
const VESTIGE_FIGURES = [
  /* 1 — küçük ve ince: zincirin başlangıcı, taşımayan taşıyıcı */
  { head: 8.5, headY: 34, sy: 50, sw: 19, hw: 23 },
  /* 2 — geniş omuz, dar etek */
  { head: 10, headY: 30, sy: 47, sw: 30, hw: 27 },
  /* 3 — orta, en nötr geometri: kayıttaki boşluğun karşılığı */
  { head: 9.5, headY: 27, sy: 45, sw: 25, hw: 26 },
  /* 4 — çok uzun ve ince */
  { head: 9, headY: 21, sy: 39, sw: 21, hw: 21 },
  /* 5 — ağır gövde */
  { head: 11, headY: 32, sy: 50, sw: 34, hw: 36 },
  /* 6 — omuz dar, etek geniş: aşağı doğru açılan bir gövde */
  { head: 9.5, headY: 28, sy: 46, sw: 24, hw: 34 },
  /* 7 — ince omuz, çok geniş etek */
  { head: 9, headY: 27, sy: 45, sw: 21, hw: 38 },
  /* 8 — en geniş omuz, daralan etek: sekizin en büyüğü */
  { head: 11, headY: 23, sy: 42, sw: 39, hw: 29 },
] as const;

export function VestigeFigure({
  index,
  className,
  headClassName,
  bodyClassName,
}: {
  index: number;
  className?: string;
  headClassName?: string;
  bodyClassName?: string;
}) {
  const f = VESTIGE_FIGURES[index % VESTIGE_FIGURES.length];
  const body =
    `M${60 - f.sw} ${f.sy}` +
    ` C${60 - f.sw - 4} ${f.sy + 46} ${60 - f.hw} 150 ${60 - f.hw} 214` +
    ` L${60 + f.hw} 214` +
    ` C${60 + f.hw} 150 ${60 + f.sw + 4} ${f.sy + 46} ${60 + f.sw} ${f.sy}` +
    " Z";

  return (
    <svg
      className={className}
      viewBox="0 0 120 220"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <circle className={headClassName} cx="60" cy={f.headY} r={f.head} />
      <path className={bodyClassName} d={body} />
    </svg>
  );
}
