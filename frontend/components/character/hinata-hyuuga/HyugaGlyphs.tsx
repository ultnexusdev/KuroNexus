import type { HinataMark } from "@/lib/characters/hinata-hyuuga-experience";

/**
 * Hyūga çizim seti — saf SVG, elle yazıldı.
 *
 * Sayfada dışarıdan alınmış tek bir grafik yok (BRIEF §3.4): damar ağı,
 * göz, sekiz trigram, koruyucu kubbe, kafesteki kuş mührü ve dalga
 * halkaları burada yaşıyor. Hepsi sunucuda çiziliyor — bu dosyada
 * `"use client"` yok; istemci adaları da aynı bileşenleri kullanabiliyor.
 *
 * ── ÇİZİM SÖZLEŞMESİ ─────────────────────────────────────────────────────
 * · Kontur her zaman `currentColor`: rengi çağıran CSS `color:` ile verir,
 *   böylece hover/etkin durum geçişleri tek bir özellikte olur.
 * · Kalınlık 1.5 (100 birimlik kutuda), uçlar ve köşeler yuvarlak — su
 *   motifinin çizgi karşılığı. İnce, kesintisiz, sert köşesiz.
 * · Dolgu yalnızca gözde ve mühürde; gerisi çizgi.
 * · Hepsi dekoratif → `aria-hidden`. Anlam taşıyan tek çizim halkanın
 *   göbeğindeki göz; oraya çağıran `title` veriyor.
 */

interface GlyphProps {
  className?: string;
}

/** Ortak SVG iskeleti — tekrar eden altı özniteliği tek yerde tutar. */
function Glyph({
  viewBox,
  className,
  title,
  children,
}: {
  viewBox: string;
  className?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {children}
    </svg>
  );
}

/* ── Damar ağı ──────────────────────────────────────────────────────── */

/**
 * Gözden dışa dallanan damarlar — hero'nun arkasındaki desen.
 *
 * Dört ana gövde ve onlardan ayrılan kılcallar; her `d` birden çok alt
 * yol taşıyor (tek düğümde çok çizgi — DOM ucuz kalsın diye). Alt yarı
 * ayna: aynı yollar y ekseninde çevrilerek tekrar çiziliyor, yani desen
 * elle iki kez yazılmıyor.
 */
const VEIN_BRANCHES = [
  "M12 60 C 42 56 64 48 96 34 M60 50 C 70 41 80 36 96 27 M84 39 C 92 30 100 25 116 18",
  "M12 60 C 40 60 68 58 104 54 M70 58 C 84 54 94 50 112 44 M96 56 C 108 53 118 50 134 46",
  "M12 60 C 34 62 52 66 78 76 M50 65 C 60 71 68 76 82 86 M66 70 C 74 78 80 84 90 96",
  "M12 60 C 44 58 74 53 118 42 M100 47 C 112 43 122 40 140 36 M118 42 C 128 36 136 32 150 26",
  "M12 60 C 30 55 44 47 62 34 M40 49 C 46 41 52 35 62 25 M52 41 C 56 33 60 27 66 18",
];

export function VeinFan({ className }: GlyphProps) {
  return (
    <Glyph viewBox="0 0 160 120" className={className}>
      <g strokeWidth="0.9">
        {VEIN_BRANCHES.map((d) => (
          <path key={d} d={d} />
        ))}
        {/* Ayna: aynı beş gövde alt yarıya çevrilir */}
        <g transform="matrix(1 0 0 -1 0 120)">
          {VEIN_BRANCHES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>
      {/* Dallanma noktalarında tenketsu tohumları */}
      <g strokeWidth="0" fill="currentColor" opacity="0.55">
        {[
          [60, 50],
          [96, 34],
          [70, 58],
          [112, 44],
          [50, 65],
          [82, 86],
          [118, 42],
          [62, 34],
          [60, 70],
          [96, 86],
          [112, 76],
          [62, 86],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.1" />
        ))}
      </g>
    </Glyph>
  );
}

/**
 * Köşe damarı — Byakugan modunda sayfanın dört kenarına yayılan ağ.
 *
 * Kadraj kare: köşelere aynı çizim dört kez konur, CSS `rotate` ile
 * çevirir. Tek bir SVG dosyası dört köşeyi karşılar.
 */
export function VeinCorner({ className }: GlyphProps) {
  return (
    <Glyph viewBox="0 0 100 100" className={className}>
      <g strokeWidth="0.8">
        <path d="M-2 6 C 22 12 38 22 54 44 M26 15 C 34 24 40 32 48 46 M40 22 C 52 30 62 40 74 58" />
        <path d="M6 -2 C 12 22 22 38 44 54 M15 26 C 24 34 32 40 46 48 M22 40 C 30 52 40 62 58 74" />
        <path d="M-2 24 C 16 30 28 40 40 60 M10 34 C 18 42 24 50 30 62" />
        <path d="M24 -2 C 30 16 40 28 60 40 M34 10 C 42 18 50 24 62 30" />
      </g>
      <g strokeWidth="0" fill="currentColor" opacity="0.7">
        {[
          [26, 15],
          [15, 26],
          [40, 22],
          [22, 40],
          [54, 44],
          [44, 54],
          [30, 62],
          [62, 30],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.3" />
        ))}
      </g>
    </Glyph>
  );
}

/* ── Göz ────────────────────────────────────────────────────────────── */

/**
 * Byakugan — badem göz, solgun iris, göz bebeği YOK.
 *
 * `veined` açıkken göz kenarlarına damarlar biner (Byakugan etkinken
 * şakaklarda kabaran damarların işareti). İris dolgusu token'dan gelir,
 * kontur `currentColor`.
 */
export function ByakuganEye({
  className,
  veined,
  title,
}: GlyphProps & { veined?: boolean; title?: string }) {
  return (
    <Glyph viewBox="0 0 120 72" className={className} title={title}>
      {/* Göz kapağı — üst yay daha dik, alt yay daha yayvan (badem) */}
      <path d="M8 38 C 30 8 90 8 112 38 C 90 62 30 62 8 38 Z" />
      {/* İris: solgun, kenarı belirgin, göz bebeği yok */}
      <circle cx="60" cy="38" r="17" fill="var(--hnt-byakugan)" opacity="0.16" />
      <circle cx="60" cy="38" r="17" />
      <circle cx="60" cy="38" r="9" strokeWidth="0.8" opacity="0.6" />
      {/* İrisin içindeki ince ışıma çizgileri */}
      <g strokeWidth="0.7" opacity="0.5">
        <path d="M60 23 V29 M60 47 V53 M45 38 H51 M69 38 H75" />
      </g>
      {veined ? (
        <g strokeWidth="0.9" opacity="0.85">
          <path d="M8 38 C 2 30 0 22 2 14 M8 38 C 1 40 -2 46 -1 54" />
          <path d="M112 38 C 118 30 120 22 118 14 M112 38 C 119 40 122 46 121 54" />
          <path d="M18 26 C 12 20 10 14 11 8 M102 26 C 108 20 110 14 109 8" />
        </g>
      ) : null}
    </Glyph>
  );
}

/* ── Halka kadranı ──────────────────────────────────────────────────── */

/**
 * Görüş halkasının zemini: iki eş merkezli halka, derece taksimatı ve
 * sekiz ince ışın. Noktaların kendisi SVG'de DEĞİL — onlar gerçek
 * `<button>` düğümleri (erişilebilirlik şartı), halkanın üstüne
 * konumlandırılıyor.
 */
export function RingDial({ className }: GlyphProps) {
  return (
    <Glyph viewBox="0 0 400 400" className={className}>
      <circle cx="200" cy="200" r="168" strokeWidth="1" opacity="0.55" />
      <circle cx="200" cy="200" r="138" strokeWidth="0.8" opacity="0.35" />
      {/* Derece taksimatı — noktalı çember (tek düğüm, 5°'lik ritim) */}
      <circle
        cx="200"
        cy="200"
        r="153"
        strokeWidth="6"
        strokeDasharray="0.6 12.75"
        opacity="0.5"
      />
      <g strokeWidth="0.6" opacity="0.22">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="200"
            y1="200"
            x2="200"
            y2="32"
            transform={`rotate(${angle} 200 200)`}
          />
        ))}
      </g>
      {/* Kürenin kapanmadığı yer: alt ortadaki yay kesik çizilir */}
      <path
        d="M172 366 A 168 168 0 0 0 228 366"
        strokeWidth="2"
        strokeDasharray="3 7"
        opacity="0.9"
      />
    </Glyph>
  );
}

/* ── Teknik işaretleri ──────────────────────────────────────────────── */

/** Jūken — açık avuç ve eklem noktaları. */
function PalmMark() {
  return (
    <>
      <path d="M30 62 C 26 44 34 34 50 34 C 66 34 74 44 70 62 C 70 77 61 85 50 85 C 39 85 30 77 30 62 Z" />
      <path d="M37 36 V16 M46 34 V10 M55 34 V11 M64 37 V18" />
      <path d="M31 57 C 22 51 16 46 12 39" />
      <g strokeWidth="0" fill="currentColor">
        {[
          [37, 24],
          [46, 20],
          [55, 21],
          [64, 26],
          [50, 52],
          [40, 66],
          [60, 66],
          [50, 74],
          [20, 45],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" />
        ))}
      </g>
    </>
  );
}

/** Hakke Rokujūyon Shō — sekizgen, sekiz ışın, ikiye katlanan vuruş dizisi. */
function TrigramMark() {
  const octagon = Array.from({ length: 8 }, (_, index) => {
    const angle = ((index * 45 - 90) * Math.PI) / 180;
    return `${(50 + 38 * Math.cos(angle)).toFixed(1)} ${(50 + 38 * Math.sin(angle)).toFixed(1)}`;
  }).join(" L ");
  return (
    <>
      <path d={`M ${octagon} Z`} opacity="0.85" />
      <circle cx="50" cy="50" r="24" strokeWidth="0.9" opacity="0.6" />
      <circle cx="50" cy="50" r="11" strokeWidth="0.9" opacity="0.45" />
      <g strokeWidth="0.8" opacity="0.7">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="50"
            y1="39"
            x2="50"
            y2="12"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
      </g>
      {/* İkiye katlanan vuruş: her ışının ucunda artan çentik sayısı */}
      <g strokeWidth="0" fill="currentColor">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
          <g key={angle} transform={`rotate(${angle} 50 50)`}>
            {Array.from({ length: Math.min(index + 1, 5) }, (_, dot) => (
              <circle key={dot} cx={50} cy={44 - dot * 4} r="1.4" />
            ))}
          </g>
        ))}
      </g>
      <circle cx="50" cy="50" r="2.6" strokeWidth="0" fill="currentColor" />
    </>
  );
}

/**
 * Shugohakke Rokujūyon Shō — koruyucu kubbe.
 *
 * Sekiz trigramın tersi: bıçaklar İÇERİ değil DIŞARI bakar, merkezde
 * korunan kişi durur. Bu ters yön tekniğin bütün fikri, çizim de onu
 * söylüyor.
 */
function DomeMark() {
  return (
    <>
      <path d="M10 74 A 40 40 0 0 1 90 74" />
      <path d="M18 74 A 32 32 0 0 1 82 74" strokeWidth="0.9" opacity="0.55" />
      <line x1="6" y1="74" x2="94" y2="74" strokeWidth="0.9" opacity="0.5" />
      <g strokeWidth="1.2">
        {[-72, -54, -36, -18, 0, 18, 36, 54, 72].map((angle) => (
          <line
            key={angle}
            x1="50"
            y1="30"
            x2="50"
            y2="16"
            transform={`rotate(${angle} 50 74)`}
          />
        ))}
      </g>
      {/* Korunan kişi: merkezdeki küçük dik işaret */}
      <path d="M50 74 V58" strokeWidth="2" />
      <circle cx="50" cy="53" r="4" strokeWidth="1.4" />
      <g strokeWidth="0" fill="currentColor" opacity="0.8">
        {[-60, -30, 0, 30, 60].map((angle) => (
          <circle
            key={angle}
            cx="50"
            cy="42"
            r="1.6"
            transform={`rotate(${angle} 50 74)`}
          />
        ))}
      </g>
    </>
  );
}

/** Jūho Sōshiken — iki elin çevresindeki aslan başları. */
function LionMark() {
  return (
    <>
      {[32, 68].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="50" r="14" />
          <g strokeWidth="1.1" opacity="0.8">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1={cx}
                y1="34"
                x2={cx}
                y2="26"
                transform={`rotate(${angle} ${cx} 50)`}
              />
            ))}
          </g>
          <path
            d={`M${cx - 6} 47 L${cx - 3} 47 M${cx + 3} 47 L${cx + 6} 47 M${cx - 4} 56 Q${cx} 59 ${cx + 4} 56`}
            strokeWidth="1.2"
          />
        </g>
      ))}
    </>
  );
}

/** Kaiten — kendi ekseninde dönen kalkan. */
function KaitenMark() {
  return (
    <>
      <circle cx="50" cy="50" r="30" strokeWidth="0.9" opacity="0.55" />
      <g strokeWidth="1.5">
        {[0, 120, 240].map((angle) => (
          <path
            key={angle}
            d="M50 50 C 62 44 74 46 82 56"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
      </g>
      <g strokeWidth="1" opacity="0.6">
        {[60, 180, 300].map((angle) => (
          <path
            key={angle}
            d="M50 50 C 58 46 66 47 72 53"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="4" strokeWidth="0" fill="currentColor" />
    </>
  );
}

/**
 * Byakugan menzili — merkezdeki gözden dışa açılan yaylar.
 *
 * Yaylar alt ortada KAPANMAZ: kör nokta çizimin kendisinde duruyor.
 */
function RangeMark() {
  return (
    <>
      <path d="M34 50 C 42 40 58 40 66 50 C 58 60 42 60 34 50 Z" />
      <circle cx="50" cy="50" r="6" strokeWidth="1" />
      {[20, 30, 40].map((radius, index) => (
        <path
          key={radius}
          d={`M ${50 - radius * 0.82} ${50 + radius * 0.57} A ${radius} ${radius} 0 1 1 ${50 + radius * 0.82} ${50 + radius * 0.57}`}
          strokeWidth={1.1 - index * 0.2}
          opacity={0.75 - index * 0.18}
        />
      ))}
    </>
  );
}

/** Merhem ve şifalı ot. */
function HerbMark() {
  return (
    <>
      <path d="M34 56 H66 A 4 4 0 0 1 70 60 V76 A 6 6 0 0 1 64 82 H36 A 6 6 0 0 1 30 76 V60 A 4 4 0 0 1 34 56 Z" />
      <path d="M38 56 V50 H62 V56" strokeWidth="1.1" />
      <path d="M50 44 C 50 32 42 24 30 22 C 30 34 38 42 50 44 Z" />
      <path d="M50 44 C 50 34 56 27 66 25 C 66 35 60 42 50 44 Z" opacity="0.7" />
      <path d="M50 50 V44" strokeWidth="1.1" />
    </>
  );
}

/** Teknik kartlarının işareti — anahtar veri dosyasından gelir. */
export function TechniqueMark({
  mark,
  className,
}: GlyphProps & { mark: HinataMark }) {
  return (
    <Glyph viewBox="0 0 100 100" className={className}>
      {mark === "palm" ? <PalmMark /> : null}
      {mark === "trigram" ? <TrigramMark /> : null}
      {mark === "dome" ? <DomeMark /> : null}
      {mark === "lion" ? <LionMark /> : null}
      {mark === "kaiten" ? <KaitenMark /> : null}
      {mark === "range" ? <RangeMark /> : null}
      {mark === "herb" ? <HerbMark /> : null}
    </Glyph>
  );
}

/* ── Kafesteki kuş ──────────────────────────────────────────────────── */

/**
 * Yan dal mührünün adı: 籠の中の鳥 — kafesteki kuş.
 *
 * Kanonik mühür işareti BİLEREK çizilmedi: o işaret manji biçiminde ve
 * bağlamından koparıldığında bambaşka bir şey okunuyor. Buradaki çizim
 * mührün ADINI resmediyor — parmaklıkların arkasındaki kuş. Anlamı da
 * daha doğrudan söylüyor.
 */
export function CagedBirdSeal({ className }: GlyphProps) {
  return (
    <Glyph viewBox="0 0 100 100" className={className}>
      <path d="M22 84 V44 A 28 28 0 0 1 78 44 V84" />
      <line x1="14" y1="84" x2="86" y2="84" />
      <g strokeWidth="1.1" opacity="0.75">
        <path d="M33 84 V40" />
        <path d="M44 84 V33" />
        <path d="M56 84 V33" />
        <path d="M67 84 V40" />
      </g>
      {/* Kuş: gövde, kanat, gaga — parmaklıkların ardında */}
      <g strokeWidth="1.4">
        <path d="M40 68 C 40 58 47 52 55 52 C 62 52 66 57 66 62 C 66 70 58 74 50 74 C 44 74 40 72 40 68 Z" />
        <path d="M47 60 C 52 57 58 58 62 62" strokeWidth="1" opacity="0.8" />
        <path d="M66 58 L 72 55" />
        <path d="M44 73 L 40 79 M54 74 L 52 80" strokeWidth="1" opacity="0.8" />
      </g>
    </Glyph>
  );
}

/* ── Su ─────────────────────────────────────────────────────────────── */

/** Bölüm geçişlerindeki dalga halkaları — Nazik Yumruk'un akışkanlığı. */
export function RippleMark({ className }: GlyphProps) {
  return (
    <Glyph viewBox="0 0 200 80" className={className}>
      <g strokeWidth="1">
        <ellipse cx="100" cy="40" rx="14" ry="5" />
        <ellipse cx="100" cy="40" rx="38" ry="12" opacity="0.7" />
        <ellipse cx="100" cy="40" rx="66" ry="20" opacity="0.45" />
        <ellipse cx="100" cy="40" rx="94" ry="28" opacity="0.25" />
      </g>
    </Glyph>
  );
}
