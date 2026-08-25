/**
 * Minato sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §4.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor — emsal
 * `components/character/itachi/SharinganEyes.tsx`. Renk YALNIZCA `currentColor`
 * üzerinden geliyor: çağıran öğe rengini token'dan alıyor, glif ona uyuyor.
 * Böylece bu dosyada da, CSS modülünde de tek hex yok ve aktif/pasif işaret
 * ayrımı tek bir `color` satırıyla yapılabiliyor.
 *
 * Hareket burada YOK: bileşenler yalnızca `className` alıp geometriyi çiziyor,
 * ne zaman ne olacağını CSS söylüyor. Modülün sonundaki reduced-motion
 * battaniyesi hepsini tek yerden durdurabiliyor.
 *
 * ⚠️ Bu dosyada "use client" YOK ama `HiraishinShell` (istemci adası) onu
 * çağırıyor — düz JSX olduğu için istemci paketine giriyor, ek bağımlılık
 * getirmiyor. Sunucu tarafında da (alev eteği, formül şeması) aynı set
 * kullanılıyor.
 */

/* ════════════════════════════════════════════════════════════════════════
   1 · İŞARET MÜHÜRLERİ — sütundaki yedi glif

   Aile kuralı: hepsi 24×24 kutuda, hepsi aynı kalınlıkta (1.5) çizgiyle,
   hepsinde AYNI iki köşe ayracı var (sol üst / sağ alt). Değişen tek şey
   ortadaki figür. Yan yana dizildiklerinde tek bir mühür takımı gibi
   okunsunlar, tek tek bakıldığında ayırt edilsinler diye.
   ════════════════════════════════════════════════════════════════════════ */

/** Ortak çerçeve: formülün iki köşesi. Her mühürde birebir aynı. */
const FRAME = "M3.2 7.4V3.2h4.2M20.8 16.6v4.2h-4.2";

/** Yedi mührün iç figürleri. Sıra `MINATO_MARKS` ile birebir aynı. */
const MARK_FIGURES: { d: string; dots?: [number, number][] }[] = [
  // 0 · Üç uçlu kunai başı — sayfanın başı
  { d: "M12 6.4v11.2M12 11.2 7.9 7.4M12 11.2l4.1-3.8" },
  // 1 · Künye — üç satır, üçü de farklı uzunlukta
  { d: "M7.2 9h9.6M7.2 12h6.4M7.2 15h9.6" },
  // 2 · Formülün kendisi — kare ve içindeki nokta
  { d: "M8.2 8.2h7.6v7.6H8.2z", dots: [[12, 12]] },
  // 3 · Sarmal — avuçta dönen çakra
  {
    d: "M12.5 12a.75.75 0 1 0-1.2-.6 2.4 2.4 0 1 0 3.5 1 4.2 4.2 0 1 0-6.6.9",
  },
  // 4 · Kesişen iki çizgi ve ortada bir bıçak ağzı
  { d: "M12 6.2v11.6M6.2 12h11.6M12 9.4l2.6 2.6-2.6 2.6-2.6-2.6z" },
  // 5 · Bir hat üstünde beş durak
  {
    d: "M6.4 12h11.2",
    dots: [
      [6.4, 12],
      [9.2, 12],
      [12, 12],
      [14.8, 12],
      [17.6, 12],
    ],
  },
  // 6 · Halka ve içine dolanan sarmal — mühürleme gecesi
  {
    d: "M12 7.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2M12 12c1.5 0 1.5-2.4 0-2.4-2.2 0-2.2 4.8 0 4.8",
  },
];

/** Sütundaki bir mühür. `variant` 0-6; aralık dışı değer başa döner. */
export function MarkSeal({
  variant,
  className,
}: {
  variant: number;
  className?: string;
}) {
  const figure = MARK_FIGURES[variant % MARK_FIGURES.length] ?? MARK_FIGURES[0];
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {/* Köşe ayraçları ailenin imzası: mühür değişse de çerçeve değişmiyor */}
      <path d={FRAME} opacity="0.55" />
      <path d={figure.d} />
      {figure.dots?.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   2 · MOD DÜĞMESİNİN GLİFİ — şimşek

   Sekiz ışın: dördü uzun, dördü kısa. Ortada dolu bir nokta — işaretin
   durduğu yer. Mod açıkken CSS ışınları parlatıyor.
   ════════════════════════════════════════════════════════════════════════ */

const FLASH_RAYS = [
  "M12 1.6v5.2",
  "M12 17.2v5.2",
  "M1.6 12h5.2",
  "M17.2 12h5.2",
  "M4.9 4.9 8 8",
  "M16 16l3.1 3.1",
  "M19.1 4.9 16 8",
  "M8 16l-3.1 3.1",
];

export function FlashMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
      focusable="false"
    >
      {FLASH_RAYS.map((d, index) => (
        <path key={d} d={d} opacity={index < 4 ? 1 : 0.5} />
      ))}
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   3 · CÜBBE ETEĞİNİN ALEV DESENİ

   Hokage cübbesinin eteğindeki alev şeridi. Diller EŞİT DEĞİL: gerçeğinde
   de değiller ve eşit olsalar dalga gibi okunurlardı. Tepe yükseklikleri
   sabit bir dizi — her açılışta aynı şerit çizilsin diye rastgelelik yok.
   ════════════════════════════════════════════════════════════════════════ */

const HEM_PEAKS = [26, 8, 20, 4, 30, 14, 22, 6, 28, 12, 18, 9];
const HEM_SEGMENT = 100;
const HEM_BASE = 62;

function hemPath(): string {
  let d = `M0 100 L0 ${HEM_BASE}`;
  HEM_PEAKS.forEach((peak, index) => {
    const x = index * HEM_SEGMENT;
    const mid = x + HEM_SEGMENT / 2;
    const end = x + HEM_SEGMENT;
    d +=
      ` C${x + 16} ${HEM_BASE - 14}, ${mid - 16} ${peak + 18}, ${mid} ${peak}` +
      ` C${mid + 16} ${peak + 18}, ${end - 16} ${HEM_BASE - 14}, ${end} ${HEM_BASE}`;
  });
  d += ` L${HEM_PEAKS.length * HEM_SEGMENT} 100 Z`;
  return d;
}

const HEM_PATH = hemPath();

/**
 * Alev şeridi.
 *
 * `preserveAspectRatio="xMidYMax slice"`: dar ekranda diller SIKIŞMASIN,
 * şerit kenarlardan kırpılsın. `none` verilseydi 360 pikselde alevler
 * iğneye dönerdi.
 */
export function FlameHem({
  className,
  flipped,
}: {
  className?: string;
  /** Ters çevrilmiş şerit: kapanışta yukarı bakan diller */
  flipped?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 100"
      preserveAspectRatio="xMidYMax slice"
      fill="currentColor"
      aria-hidden
      focusable="false"
      style={flipped ? { transform: "scaleY(-1)" } : undefined}
    >
      <path d={HEM_PATH} />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   4 · HIRAISHIN FORMÜLÜ — İşaretler bölümünün büyük şeması

   Kunai sapına bırakılan formülün şematik hâli: dış çerçeve, iç halka,
   ortada üç uçlu işaret, dört kenarda birer yazı öbeği. Yazı öbekleri
   gerçek bir kanji DEĞİL — okunabilir bir şey yazmak, uydurulmuş bir
   metni belge gibi göstermek olurdu; onun yerine çizgi kümesi.
   ════════════════════════════════════════════════════════════════════════ */

/** Kenar yazı öbekleri: (döndürme açısı) → dört kenara aynı küme. */
const FORMULA_SIDES = [0, 90, 180, 270];

export function HiraishinFormula({
  className,
  title,
}: {
  className?: string;
  /** Ekran okuyucuya inen açıklama; boşsa şema tamamen dekoratiftir */
  title?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {/* Dış çerçeve — iki kat, ikisinin arası formülün "kâğıdı" */}
      <rect x="10" y="10" width="180" height="180" strokeWidth="1" opacity="0.42" />
      <rect x="22" y="22" width="156" height="156" strokeWidth="1.6" />

      {/* Dört kenardaki yazı öbekleri */}
      {FORMULA_SIDES.map((angle) => (
        <g key={angle} transform={`rotate(${angle} 100 100)`} opacity="0.72">
          <path
            d="M78 34h44M84 40h32M90 46h20M100 34v14"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* İç halka: işaretin durduğu alan */}
      <circle cx="100" cy="100" r="46" strokeWidth="1" opacity="0.5" />
      <circle cx="100" cy="100" r="34" strokeWidth="1.8" />

      {/* Ortadaki üç uçlu işaret — sütundaki ilk mührün büyütülmüş hâli */}
      <path
        d="M100 74v52M100 96 84 80M100 96l16-16"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="100" cy="126" r="4.5" fill="currentColor" stroke="none" />

      {/* Köşe ayraçları — mühür ailesinin imzası, burada da var */}
      <path
        d="M30 44V30h14M170 156v14h-14M30 156v14h14M170 44V30h-14"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   5 · SEKİZ TRİGRAM SARMALI — mühürleme gecesinin tek grafiği

   Naruto'nun karnındaki mührün şeması: bir halka, sekiz kısa çizgi ve
   içeri dolanan bir sarmal. Bölümün geri kalanı gibi hareketsiz.
   ════════════════════════════════════════════════════════════════════════ */

const TRIGRAM_TICKS = Array.from({ length: 8 }, (_, index) => index * 45);

/** İçe doğru kapanan sarmal — yarım daire yaylarıyla kuruldu. */
const SEAL_SPIRAL =
  "M100 34a66 66 0 0 1 0 132 54 54 0 0 1 0-108 42 42 0 0 1 0 84 30 30 0 0 1 0-60 18 18 0 0 1 0 36 6 6 0 0 1 0-12";

export function SealingSpiral({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={SEAL_SPIRAL} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="100" cy="100" r="78" strokeWidth="1" opacity="0.4" />
      {TRIGRAM_TICKS.map((angle) => (
        <path
          key={angle}
          d="M100 14v12"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.65"
          transform={`rotate(${angle} 100 100)`}
        />
      ))}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   6 · DÖRT KÜÇÜK KAYDIN GLİFLERİ

   Kunai, mühür kâğıdı, cephe emri işareti, kurbağa sözleşmesi. Hepsi aynı
   kalınlıkta ve aynı 48'lik kutuda — mühür ailesinin büyük boy kardeşleri.
   ════════════════════════════════════════════════════════════════════════ */

const KIT_FIGURES = [
  // 0 · Üç uçlu kunai: sap, sargı ve üç ağız
  "M24 44V16M24 22l-9-8M24 22l9-8M15 14l-3 5M33 14l3 5M19.5 30h9M19.5 35h9",
  // 1 · Mühür kâğıdı: dikdörtgen, üstünde sarmal
  "M13 8h22v32H13zM24 18a6 6 0 1 1-4.4 10M24 18v6",
  // 2 · Cephe emri: iki yatay hat, arasında geri çekilen ok
  "M8 14h32M8 34h32M32 24H14M20 18l-6 6 6 6",
  // 3 · Sözleşme tomarı: rulo ve iki mühür halkası
  "M10 12h28v24H10zM10 12a4 4 0 0 0 0 24M38 12a4 4 0 0 1 0 24M18 20h12M18 26h8",
];

export function KitGlyph({
  variant,
  className,
}: {
  variant: number;
  className?: string;
}) {
  const d = KIT_FIGURES[variant % KIT_FIGURES.length] ?? KIT_FIGURES[0];
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}
