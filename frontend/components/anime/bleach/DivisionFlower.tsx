import type { FlowerShape } from "@/lib/anime/bleach/divisions";

/**
 * BÖLÜK ÇİÇEKLERİ — on üç line-art.
 *
 * ── BU BÖLÜMÜ ÖZEL YAPAN ŞEY ─────────────────────────────────────────────
 * Canon'da her bölüğün bir çiçeği ve o çiçeğin bir anlamı var. On üç kapı
 * aynı şablonu paylaşıyor; onları birbirinden ayıran tek GERÇEK işaret bu.
 * Çiçek olmasaydı panel "on üç aynı kart" olurdu — brief'in kaçınmak
 * istediği tam olarak bu.
 *
 * ── ÇİZİM DİLİ ───────────────────────────────────────────────────────────
 * Hepsi tek renk (`currentColor`), dolgusuz, 1.4 birim kontur, aynı
 * viewBox (0 0 64 64). Botanik illüstrasyon DEĞİL: amaç "hangi çiçek"
 * sorusunu siluetten okutmak. Aynı ölçek ve aynı çizgi kalınlığı on üçünü
 * bir AİLE yapıyor; farklı kalınlıklar on üç ayrı ikon gibi dururdu.
 *
 * ⚠️ Hiçbiri dosya değil: on üçü de inline, toplam birkaç yüz bayt.
 */

const COMMON = {
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Radyal taç yaprak üreteci — birçok çiçek aynı iskeleti paylaşıyor */
function petals(count: number, inner: number, outer: number, width: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;
    const p = (r: number, offset = 0) => {
      const angle = a + offset;
      return `${(32 + Math.cos(angle) * r).toFixed(2)} ${(32 + Math.sin(angle) * r).toFixed(2)}`;
    };
    return `M${p(inner)} Q${p(outer, -width)} ${p(outer)} Q${p(outer, width)} ${p(inner)}Z`;
  }).join(" ");
}

const SHAPES: Record<FlowerShape, React.JSX.Element> = {
  /* 菊 — çok sayıda ince taç yaprak, iç içe iki halka */
  chrysanthemum: (
    <>
      <path d={petals(16, 9, 26, 0.1)} />
      <path d={petals(12, 5, 15, 0.13)} />
      <circle cx="32" cy="32" r="3" />
    </>
  ),

  /* 翁草 — sarkık altı yaprak + tüylü sap */
  pasque: (
    <>
      <path d="M32 30q-11-4-13-14 9 1 13 9 4-8 13-9-2 10-13 14Z" />
      <path d="M32 30q-8 2-10 10 8 1 10-5 2 6 10 5-2-8-10-10Z" />
      <path d="M32 30v26M26 42q3 3 6 3M38 46q-3 3-6 3" />
    </>
  ),

  /* 金盞花 — sık, yuvarlak, katmanlı */
  marigold: (
    <>
      <path d={petals(12, 12, 25, 0.16)} />
      <circle cx="32" cy="32" r="11" />
      <circle cx="32" cy="32" r="5" />
    </>
  ),

  /* 桔梗 — beş köşeli çan */
  bellflower: (
    <>
      <path d="M32 8 46 24l-6 20H24l-6-20Z" />
      <path d="M32 8v36M18 24h28M23 32h18" />
      <path d="M32 44v12" />
    </>
  ),

  /* 鈴蘭 — saptan sarkan küçük çanlar */
  lily: (
    <>
      <path d="M34 6c-2 18-4 34-14 50" />
      <path d="M30 20q-5 0-6 5t5 5 6-5-5-5ZM26 32q-5 0-6 5t5 5 6-5-5-5ZM22 44q-5 0-6 5t5 5 6-5-5-5Z" />
      <path d="M34 6q10 6 12 18" />
    </>
  ),

  /* 椿 — beş dolgun yaprak + belirgin ortası */
  camellia: (
    <>
      <path d={petals(5, 10, 26, 0.34)} />
      <circle cx="32" cy="32" r="7" />
      <path d="M32 25v14M25 32h14" />
    </>
  ),

  /* 菖蒲 — üç yukarı, üç aşağı yaprak */
  iris: (
    <>
      <path d="M32 6q-6 12 0 22 6-10 0-22ZM32 28q-12-8-20-2 6 10 20 2ZM32 28q12-8 20-2-6 10-20 2Z" />
      <path d="M32 28q-8 8-6 20 8-6 6-20ZM32 28q8 8 6 20-8-6-6-20Z" />
      <path d="M32 48v10" />
    </>
  ),

  /* 極楽鳥花 — açılı, kuş gagası biçimli */
  strelitzia: (
    <>
      <path d="M6 44q14-6 26-4" />
      <path d="M32 40 20 22l14 6 2-16 6 15 12-6-10 18Z" />
      <path d="M32 40q10 2 18-2" />
      <path d="M6 44q10 6 26 4" />
    </>
  ),

  /* 白罌粟 — dört geniş yaprak, koyu ortası */
  poppy: (
    <>
      <path d={petals(4, 8, 26, 0.42)} />
      <circle cx="32" cy="32" r="6" />
      <path d="M32 26v12M26 32h12" />
    </>
  ),

  /* 水仙 — altı yaprak + ortada borazan */
  daffodil: (
    <>
      <path d={petals(6, 11, 26, 0.24)} />
      <circle cx="32" cy="32" r="9" />
      <circle cx="32" cy="32" r="5" />
    </>
  ),

  /* 鋸草 — testere yapraklı, yassı şemsiye */
  yarrow: (
    <>
      <path d="M10 22q22-8 44 0" />
      <path d="M14 21q4-6 8 0M22 19q4-6 8 0M30 18q4-6 8 0M38 19q4-6 8 0M46 21q4-6 8 0" />
      <path d="M32 22v34" />
      <path d="M32 34q-8 0-11-6M32 42q8 0 11-6" />
    </>
  ),

  /* 薊 — dikenli baş, sivri bırakteler */
  thistle: (
    <>
      <path d="M24 26q8-14 16 0" />
      <path d="M22 26h20l-3 12H25Z" />
      <path d="M25 26 20 16M31 24l-1-12M37 24l3-12M40 27l6-10" />
      <path d="M32 38v18M32 46q-8-1-10-7M32 50q8-1 10-7" />
    </>
  ),

  /* 待雪草 — sarkan üç yaprak, tek sap */
  snowdrop: (
    <>
      <path d="M32 6v18" />
      <path d="M20 24h24" />
      <path d="M32 24q-9 4-9 16t9 14 9-14-9-16Z" />
      <path d="M32 26v26" />
      <path d="M20 24q-6 14 2 24M44 24q6 14-2 24" />
    </>
  ),
};

/**
 * Bölüğün çiçeği. Panelin sağ üstünde, ince ve tek renkli.
 * `aria-hidden`: çiçeğin adı ve anlamı zaten metin olarak yanında.
 */
export function DivisionFlower({
  shape,
  className,
}: {
  shape: FlowerShape;
  className?: string;
}) {
  return (
    <svg {...COMMON} className={className} aria-hidden="true">
      {SHAPES[shape]}
    </svg>
  );
}
