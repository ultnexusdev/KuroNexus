import type { ShopGlyph } from "@/lib/characters/kisuke-urahara-experience";

/**
 * Urahara Dükkânı'nın çizim seti — saf SVG, sunucuda çizilir.
 *
 * Neden elle çizildi: BRIEF kural 3 dışarıdan raster görsel indirmeyi ve
 * hotlink'i yasaklıyor (lisans doğrulanamıyor, CSP zaten engelliyor).
 * Bleach evreninin nesneleri de bu yüzden burada tek tek çizildi —
 * `SharinganEyes.tsx` ve `ClanEmblems.tsx` emsali.
 *
 * Ortak dil (set olarak okunsun diye):
 *   · 64×64 kutu, tek kalem kalınlığı (1.8), yuvarlak uç ve köşe
 *   · dolgu YOK, yalnız kontur — dükkânın mürekkep etiketleri gibi
 *   · renk `currentColor`: bağlam veriyor, dosyada tek hex yok (kural 16)
 *
 * Dokuz çekmecenin dokuz nesnesi + dükkânın kendi işaretleri (şapka,
 * fener, çekmece halkası, geta) aynı setten çıkıyor.
 */

const STROKE = 1.8;

/** 崩玉 — Hōgyoku: küre, çekirdeği ve etrafındaki eğik halka. */
function Orb() {
  return (
    <>
      <circle cx="32" cy="32" r="17" />
      <ellipse cx="32" cy="32" rx="25" ry="8" transform="rotate(-24 32 32)" />
      <circle cx="32" cy="32" r="5.5" />
      <path d="M32 15v5M32 44v5" />
    </>
  );
}

/** 義骸 — Gigai: içi boş beden, ortasından geçen dikiş. */
function Gigai() {
  return (
    <>
      <circle cx="32" cy="15" r="7" />
      <path d="M18 54V38c0-8 6-14 14-14s14 6 14 14v16" />
      <path d="M18 44h28" />
      <path d="M32 24v6M32 34v6M32 44v6" strokeDasharray="0.1 5" />
    </>
  );
}

/** 転神体 — Tenshintai: kılıcın saplandığı tahta gövde ve şeridi. */
function Tenshintai() {
  return (
    <>
      <path d="M26 56V16h12v40" />
      <path d="M20 22h24" />
      <path d="M52 8 30 30" />
      <path d="M45 11l4 4" />
      <path d="M26 40c-6 2-9 6-9 10" />
    </>
  );
}

/** 紅姫 — Benihime: bastonun içinden çıkan kılıç. */
function Blade() {
  return (
    <>
      <path d="M10 54l20-20" />
      <path d="M14 58l20-20" />
      <path d="M28 28l8 8" />
      <path d="M34 24l20-16-6 22-12 2z" />
      <path d="M10 54l4 4" />
    </>
  );
}

/** 地下訓練場 — yeraltı: kaya tavan, çizilmiş gökyüzü, ufuktaki kayalar. */
function Sky() {
  return (
    <>
      <path d="M4 14l7 6 6-6 7 6 6-6 7 6 6-6 7 6 6-6" />
      <circle cx="42" cy="30" r="7" />
      <path d="M4 50h56" />
      <path d="M12 50c0-5 4-8 8-8s8 3 8 8" />
      <path d="M36 50c0-3 3-5 6-5s6 2 6 5" />
    </>
  );
}

/** 仮面の軍勢 — Hollow maskesi: dişli ağız, iki boş göz. */
function Mask() {
  return (
    <>
      <path d="M32 6c12 0 19 9 19 21s-8 31-19 31S13 39 13 27 20 6 32 6z" />
      <path d="M21 26l7-4 3 6M43 26l-7-4-3 6" />
      <path d="M17 38l5 5 5-5 5 5 5-5 5 5 5-5" />
    </>
  );
}

/** 追放 — hüküm: tomar ve kırılmış mühür. */
function Seal() {
  return (
    <>
      <path d="M14 14h30a4 4 0 0 1 0 8H14z" />
      <path d="M14 50h30a4 4 0 0 0 0-8H14z" />
      <path d="M14 14v36" />
      <path d="M22 30h18" />
      <circle cx="46" cy="36" r="8" />
      <path d="M40 30l12 12" />
    </>
  );
}

/** 黒崎家 — bir ev: saçak, kapı, kapının yanında fener. */
function House() {
  return (
    <>
      <path d="M8 28L32 10l24 18" />
      <path d="M14 28v26h36V28" />
      <path d="M26 54V38h12v16" />
      <path d="M46 30v6" />
      <rect x="43" y="36" width="6" height="8" rx="2" />
    </>
  );
}

/** 全部計画 — yelpaze: kapalı yüzün ardındaki plan. */
function Fan() {
  return (
    <>
      <path d="M3.8 41.7A30 30 0 0 1 60.2 41.7" />
      <path d="M22.6 48.6A10 10 0 0 1 41.4 48.6" />
      <path d="M32 52L3.8 41.7M32 52L9 32.7M32 52L17 26M32 52L26.8 22.5M32 52L37.2 22.5M32 52L47 26M32 52L55 32.7M32 52L60.2 41.7" />
      <path d="M28 56h8" />
    </>
  );
}

/** Şapka — yeşil-beyaz şeritli, dükkânın imzası. */
function Hat() {
  return (
    <>
      <ellipse cx="32" cy="44" rx="27" ry="8" />
      <path d="M12 44c0-18 8-27 20-27s20 9 20 27" />
      <path d="M24 18.4C22 26 21 34 21 43M32 17c-1 8-1.5 17-1.5 26M40 18.4c2 7.6 3 15.6 3 24.6" />
    </>
  );
}

/** Fener (chōchin) — dükkânın ışığı; parlaklığı CSS'ten geliyor. */
function Lantern() {
  return (
    <>
      <path d="M32 4v6" />
      <rect x="23" y="10" width="18" height="5" rx="1.5" />
      <path d="M25 15c-6 6-6 24 0 30h14c6-6 6-24 0-30z" />
      <path d="M21.5 24h21M20.5 32h23M21.5 40h21" />
      <rect x="26" y="45" width="12" height="5" rx="1.5" />
      <path d="M32 50v6" />
    </>
  );
}

/** Çekmece halkası — pirinç plaka ve sarkan halka. */
function Pull() {
  return (
    <>
      <rect x="16" y="18" width="32" height="7" rx="3.5" />
      <path d="M23 25a9 9 0 0 0 18 0" />
      <path d="M28 21h8" />
    </>
  );
}

/** Geta — takunya; künyedeki sembolik obje. */
function Geta() {
  return (
    <>
      <path d="M8 28h48a3 3 0 0 1 0 6H8a3 3 0 0 1 0-6z" />
      <path d="M17 34v14M47 34v14" />
      <path d="M20 28c4-8 10-12 12-12s8 4 12 12" />
      <path d="M32 16v12" />
    </>
  );
}

function GlyphBody({ name }: { name: ShopGlyph }) {
  switch (name) {
    case "orb":
      return <Orb />;
    case "gigai":
      return <Gigai />;
    case "tenshintai":
      return <Tenshintai />;
    case "blade":
      return <Blade />;
    case "sky":
      return <Sky />;
    case "mask":
      return <Mask />;
    case "seal":
      return <Seal />;
    case "house":
      return <House />;
    case "fan":
      return <Fan />;
    case "hat":
      return <Hat />;
    case "lantern":
      return <Lantern />;
    case "pull":
      return <Pull />;
    case "geta":
      return <Geta />;
  }
}

/**
 * Tek çizim. `title` verilirse erişilebilir bir resim olur; verilmezse
 * dekoratif (`aria-hidden`) — çağıran yerin metni zaten anlamı taşıyor.
 */
export function ShopGlyphMark({
  name,
  className,
  title,
}: {
  name: ShopGlyph;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <GlyphBody name={name} />
    </svg>
  );
}
