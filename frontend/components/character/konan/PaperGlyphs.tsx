/**
 * Konan sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §3.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor —
 * emsal `components/character/itachi/SharinganEyes.tsx`. Renkler yalnızca
 * token'dan geliyor (`--knn-*` ve standart aile, modülün deri bloğunda);
 * bu dosyada da tek hex yok.
 *
 * Hareket CSS'te: bileşenler yalnızca `className` alıp geometriyi çiziyor,
 * hangi çizginin ne zaman görüneceğini `data-*` nitelikleri söylüyor.
 * Böylece reduced-motion battaniyesi (modülün sonu) hepsini tek yerden
 * durdurabiliyor.
 *
 * ⚠️ HİÇBİR YERDE `Math.random` YOK. Düşen yapraklar ve etiket tarlası
 * dağınık görünmeli ama SUNUCUDA ve TARAYICIDA aynı çıkmalı; rastgelelik
 * hidrasyon uyuşmazlığı üretirdi. Dağınıklık `jitter()` ile — saf, indeks
 * tabanlı, her koşuda aynı diziyi veren küçük bir doğrusal üreteç.
 *
 * ⚠️ Bu dosyada "use client" YOK ama istemci adaları (PaperShell, FoldTable)
 * onu çağırıyor — düz JSX olduğu için istemci paketine giriyor, ek bağımlılık
 * getirmiyor. Sunucu tarafında da (hero çiçeği) aynı bileşenler kullanılıyor.
 */

/** Saf, indeks tabanlı sözde-rastgele: 0 ile 1 arasında, her zaman aynı. */
function jitter(index: number, salt: number): number {
  const value = (index * 9301 + salt * 49297 + 233280) % 233280;
  return value / 233280;
}

/* ── Kâğıt çiçek — sayfanın imzası ───────────────────────────────────────
   Saçındaki mavi origamiyi altı yapraklı bir katlama olarak çiziyoruz.
   Her yaprak bir uçurtma dörtgeni; ortadan geçen kat çizgisi yaprağın iki
   yarısını ayırıyor ve sol yarım bir tık koyu — kâğıdın ışığı böyle tutar.
   Tek kaynak geometri: 60 derecelik altı dönüş. */

const FLOWER_PETALS = [0, 60, 120, 180, 240, 300];

export function PaperFlower({
  className,
  petalClassName,
  shadeClassName,
  creaseClassName,
  coreClassName,
}: {
  className?: string;
  petalClassName?: string;
  shadeClassName?: string;
  creaseClassName?: string;
  coreClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {FLOWER_PETALS.map((angle) => (
        <g key={angle} transform={`rotate(${angle} 60 60)`}>
          {/* Yaprağın tam gövdesi */}
          <path className={petalClassName} d="M60 60 L43 32 L60 11 L77 32 Z" />
          {/* Katın gölgede kalan yarısı */}
          <path className={shadeClassName} d="M60 60 L43 32 L60 11 Z" />
          {/* Kat çizgisi */}
          <path className={creaseClassName} d="M60 60 L60 11" />
        </g>
      ))}
      {/* Göbek: altıgen bir tomar, yaprakların birleştiği yer */}
      <path
        className={coreClassName}
        d="M60 49 L69.5 54.5 L69.5 65.5 L60 71 L50.5 65.5 L50.5 54.5 Z"
      />
    </svg>
  );
}

/* ── Kat çizgisi tarlası — sayfanın zemini ───────────────────────────────
   Sayfa tek bir kâğıdın üstüne basılmış gibi dursun diye kırışıklar
   GÖRÜNTÜ ALANINA sabitlenmiş bir katman olarak çiziliyor (bileşenin
   kendisi `position: fixed`). Beş demet var; katlama masasında kaçıncı
   adımdaysak o kadarı görünür — kâğıt açıldıkça izleri artıyor. */

const CREASE_BUNDLES: string[][] = [
  ["M-6 34 L126 22", "M-6 96 L126 108", "M18 -6 L26 126"],
  ["M-6 61 L126 47", "M92 -6 L104 126", "M-6 12 L126 4"],
  ["M-6 78 L126 90", "M44 -6 L38 126", "M-6 118 L126 104", "M66 -6 L74 126"],
  [
    "M-6 8 L126 30",
    "M-6 52 L126 74",
    "M8 -6 L54 126",
    "M112 -6 L70 126",
    "M-6 110 L126 92",
  ],
  [
    "M-6 24 L126 66",
    "M-6 88 L126 42",
    "M30 -6 L96 126",
    "M96 -6 L30 126",
    "M-6 70 L126 118",
    "M58 -6 L58 126",
  ],
];

export function CreaseField({
  step,
  className,
  lineClassName,
}: {
  /** 0 tabanlı katlama adımı — kaç demet görünecek */
  step: number;
  className?: string;
  lineClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {CREASE_BUNDLES.map((bundle, bundleIndex) => (
        <g key={bundleIndex} data-on={step >= bundleIndex ? "true" : undefined}>
          {bundle.map((d, lineIndex) => (
            <path
              key={lineIndex}
              className={lineClassName}
              d={d}
              strokeWidth={lineIndex % 2 === 0 ? 0.34 : 0.22}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

/* ── Düşen kâğıt yaprakları ──────────────────────────────────────────────
   On dört küçük dörtgen; hepsi aynı yaprak, farklı açıdan görülmüş hâli.
   Konum ve gecikme indeksten türüyor (jitter), yani sunucu ve tarayıcı
   aynı diziyi çiziyor. Düşme hareketi CSS'te, no-preference kapısında. */

const SCRAP_SHAPES = [
  "M0 0 L11 2.6 L8.4 13 L-2.4 9.6 Z",
  "M0 0 L9.6 -1.4 L12 8.6 L2 10.4 Z",
  "M0 0 L13 3.4 L9.4 11 L-1.6 7 Z",
];

export function PaperFall({
  className,
  pieceClassName,
}: {
  className?: string;
  pieceClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 480"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {Array.from({ length: 14 }, (_, index) => {
        const x = 6 + jitter(index, 7) * 306;
        const y = -20 + jitter(index, 23) * 470;
        const scale = 0.7 + jitter(index, 41) * 0.9;
        return (
          <g key={index} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
            <g
              className={pieceClassName}
              data-piece={index % 5}
              transform={`scale(${scale.toFixed(2)})`}
            >
              <path
                d={SCRAP_SHAPES[index % SCRAP_SHAPES.length]}
                fill="var(--knn-paperFall)"
              />
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Melek kanadı ────────────────────────────────────────────────────────
   Yedi kâğıt şerit, omuzdan aşağı doğru yelpaze gibi açılıyor. Tek kanat
   çiziliyor; sayfanın öbür kenarındaki kanat CSS'te aynalanıyor
   (`scale: -1 1`). Şeritlerin her biri ayrı gecikmeyle açılsın diye
   `data-feather` taşıyor. */

const WING_FEATHERS: { d: string; crease: string }[] = [
  { d: "M186 26 L74 66 L60 92 L182 46 Z", crease: "M182 38 L68 80" },
  { d: "M188 52 L48 112 L36 142 L186 74 Z", crease: "M186 64 L44 126" },
  { d: "M190 80 L30 162 L22 194 L188 104 Z", crease: "M188 93 L28 178" },
  { d: "M192 110 L22 216 L18 248 L190 136 Z", crease: "M190 124 L22 232" },
  { d: "M192 142 L26 268 L28 298 L190 168 Z", crease: "M190 156 L28 283" },
  { d: "M190 174 L40 314 L48 340 L188 198 Z", crease: "M188 187 L44 327" },
  { d: "M188 206 L64 352 L78 372 L186 228 Z", crease: "M186 218 L72 362" },
];

export function AngelWing({
  side,
  className,
  featherClassName,
  creaseClassName,
}: {
  /** Hangi kenardan açılıyor — CSS aynalamayı buradan okuyor */
  side: "left" | "right";
  className?: string;
  featherClassName?: string;
  creaseClassName?: string;
}) {
  return (
    <svg
      className={className}
      data-side={side}
      viewBox="0 0 200 400"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {WING_FEATHERS.map((feather, index) => (
        <g key={index} className={featherClassName} data-feather={index}>
          <path d={feather.d} />
          <path className={creaseClassName} d={feather.crease} />
        </g>
      ))}
    </svg>
  );
}

/* ── Mod düğmesinin glifi: katlanmış bir çift kanat ─────────────────────── */

export function AngelMark({
  className,
  creaseClassName,
}: {
  className?: string;
  creaseClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path d="M14 6 L3 12 L5 17 L14 13 Z" />
      <path d="M14 6 L25 12 L23 17 L14 13 Z" />
      <path d="M14 13 L6 19 L8.6 22.6 L14 19.4 Z" />
      <path d="M14 13 L22 19 L19.4 22.6 L14 19.4 Z" />
      <path className={creaseClassName} d="M14 6 L14 22.6" />
    </svg>
  );
}

/* ── Origami notasyonu ───────────────────────────────────────────────────
   Gerçek diyagram dili: vadi katı (谷折り) kesik çizgi, dağ katı (山折り)
   nokta-kesik çizgi, ok katlamanın yönünü gösterir. "core" katlanmamış
   tomarın kendisi. */

export function FoldMark({
  kind,
  className,
}: {
  kind: "core" | "valley" | "mountain";
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {kind === "core" ? (
        <>
          <path d="M6 8 H22 V20 H6 Z" />
          <path d="M6 8 L14 14 L22 8" />
        </>
      ) : null}
      {kind === "valley" ? (
        <>
          <path d="M3 14 H25" strokeDasharray="5 3" />
          <path d="M8 8 C 12 5 18 5 21 8" />
          <path d="M21 8 L17.6 8.4 M21 8 L20.4 11.4" />
        </>
      ) : null}
      {kind === "mountain" ? (
        <>
          <path d="M3 14 H25" strokeDasharray="6 2.4 1 2.4" />
          <path d="M8 20 C 12 23 18 23 21 20" />
          <path d="M21 20 L17.6 19.6 M21 20 L20.4 16.6" />
        </>
      ) : null}
    </svg>
  );
}

/* ── Yaprakların üstündeki şemalar ───────────────────────────────────────
   Katlama masasında açılan her yaprağın üstüne o dönemin şeması basılı.
   İnce çizgi, tek renk, hepsi dekoratif (yaprakların tamamı aria-hidden;
   anlam sekmelerde ve panelde). */

export function LeafDiagram({
  variant,
  className,
  lineClassName,
  markClassName,
}: {
  variant: "flower" | "wings" | "sea" | "tags" | "last";
  className?: string;
  lineClassName?: string;
  markClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {variant === "flower" ? (
        <g className={lineClassName}>
          <path d="M50 50 L34 26 L50 12 L66 26 Z" />
          <path d="M50 50 L26 34 L12 50 L26 66 Z" />
          <path d="M50 50 L66 74 L50 88 L34 74 Z" />
          <path d="M50 50 L74 66 L88 50 L74 34 Z" />
          <path d="M50 12 L50 88 M12 50 L88 50" />
        </g>
      ) : null}

      {variant === "wings" ? (
        <g className={lineClassName}>
          <path d="M50 20 L50 82" />
          <path d="M50 30 L14 46 L20 60 L50 48" />
          <path d="M50 30 L86 46 L80 60 L50 48" />
          <path d="M50 50 L22 68 L30 78 L50 66" />
          <path d="M50 50 L78 68 L70 78 L50 66" />
        </g>
      ) : null}

      {variant === "sea" ? (
        <g className={lineClassName}>
          {[0, 1, 2, 3].map((row) => (
            <path
              key={row}
              d={`M8 ${58 + row * 9} C 26 ${52 + row * 9} 40 ${64 + row * 9} 58 ${58 + row * 9} C 74 ${52 + row * 9} 82 ${62 + row * 9} 92 ${57 + row * 9}`}
            />
          ))}
          {[0, 1, 2, 3, 4, 5].map((tick) => (
            <path
              key={tick}
              d={`M${16 + tick * 14} 12 L${12 + tick * 14} 40`}
            />
          ))}
        </g>
      ) : null}

      {variant === "tags" ? (
        <g className={markClassName}>
          {Array.from({ length: 40 }, (_, index) => {
            const column = index % 8;
            const row = Math.floor(index / 8);
            const x = 10 + column * 10.6 + jitter(index, 13) * 2.4;
            const y = 14 + row * 15 + jitter(index, 29) * 3;
            return (
              <rect
                key={index}
                x={x.toFixed(1)}
                y={y.toFixed(1)}
                width="4.6"
                height="7.4"
                rx="0.6"
              />
            );
          })}
        </g>
      ) : null}

      {variant === "last" ? (
        <g className={lineClassName}>
          <path d="M16 14 H84 V86 H16 Z" />
          <path d="M16 50 H84" strokeDasharray="5 4" />
          <path d="M64 62 L58 70 L64 78 L70 70 Z" />
          <path d="M70 70 L82 70" />
        </g>
      ) : null}
    </svg>
  );
}

/* ── Etiket tarlası — sayı bandının zemini ───────────────────────────────
   Yüz altmış küçük patlayıcı etiket. Sayının arkasında duruyor ve maskeyle
   söndüğü için okunabilirliği hiç düşürmüyor; işi rakamı bir tarlanın
   üstüne oturtmak. */

export function TagField({
  className,
  tagClassName,
}: {
  className?: string;
  tagClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 480 180"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g className={tagClassName}>
        {Array.from({ length: 160 }, (_, index) => {
          const column = index % 20;
          const row = Math.floor(index / 20);
          const x = 4 + column * 24 + jitter(index, 11) * 12;
          const y = 2 + row * 22 + jitter(index, 37) * 9;
          const tilt = -14 + jitter(index, 53) * 28;
          return (
            <rect
              key={index}
              x={x.toFixed(1)}
              y={y.toFixed(1)}
              width="6.4"
              height="10.6"
              rx="0.8"
              transform={`rotate(${tilt.toFixed(1)} ${(x + 3.2).toFixed(1)} ${(y + 5.3).toFixed(1)})`}
            />
          );
        })}
      </g>
    </svg>
  );
}
