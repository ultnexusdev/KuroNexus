import type { CSSProperties } from "react";

/**
 * Naruto Uzumaki sayfasının glif seti — hepsi elle çizilmiş SVG.
 *
 * Neden vektör: sayfada hiçbir dekoratif raster görsel yok (brief kural 3 —
 * dışarıdan görsel indirmek/hotlink etmek yasak, CSP de zaten engelliyor).
 * Buradaki her şey ya üretilmiş geometriden (Uzumaki sarmalı: Arşimet
 * spiralinin kübik Bézier yaklaşımı) ya da tek kalınlıkta elle çizilmiş
 * konturdan geliyor.
 *
 * Renk: hepsi `currentColor`. Ton kararını çağıran CSS veriyor (`color`),
 * böylece aynı glif hem soğuk hem sıcak kademede doğru rengi alır.
 *
 * Bu dosya SUNUCUDA çizilir; `ChakraShell` (istemci adası) içinden de
 * çağrıldığı için istemci sınırına geçebilir — durum tutmuyor, güvenli.
 *
 * ⚠️ Bu set yalnızca bu sayfaya ait. `components/anime/naruto/ClanEmblems`
 * ile paylaşım YOK: on üç deneyim sayfasının hiçbiri bir diğeriyle bileşen
 * paylaşmıyor (küratör modu şartı).
 */

/** Tek kalınlık — bütün konturlu glifler bunu kullanır (100'lük kutuda). */
const STROKE = 5.5;

interface GlyphProps {
  className?: string;
  /** Verilirse glif anlamlı (role="img"); verilmezse dekoratif. */
  title?: string;
}

function Shell({
  viewBox,
  className,
  title,
  style,
  children,
}: GlyphProps & {
  viewBox: string;
  style?: CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {children}
    </svg>
  );
}

/* ============================================================
   UZUMAKI SARMALI — hero filigranı
   ============================================================ */

/**
 * 4,35 turluk Arşimet spirali (r = 7 + kθ, rMax 138), turu sekiz kübik
 * Bézier parçasına bölünerek üretildi: her parçanın kontrol noktaları
 * eğrinin türevinden geliyor, yani yol gerçek spiralden gözle ayırt
 * edilemez. Merkezden dışarı doğru çizilir — `stroke-dasharray` ile
 * "sarılma" animasyonuna hazır.
 */
const UZUMAKI_PATH =
  "M150 143C151.8 141.7 154.7 141.3 157.6 142.4C160.5 143.5 163.3 146.2 164.5 150C165.8 153.8 165.4 158.7 162.9 162.9C160.4 167.2 155.8 170.8 150 172.1C144.2 173.3 137.4 172.2 131.7 168.3C126.1 164.4 121.7 157.7 120.4 150C119.2 142.3 121.1 133.5 126.4 126.4C131.7 119.4 140.3 114.1 150 112.9C159.7 111.6 170.5 114.4 178.9 121.1C187.4 127.8 193.4 138.3 194.6 150C195.9 161.7 192.3 174.4 184.2 184.2C176.2 194.1 163.7 200.9 150 202.2C136.3 203.4 121.7 199 110.4 189.6C99.2 180.1 91.6 165.6 90.3 150C89 134.4 94.3 117.8 105.1 105.1C116 92.5 132.4 84 150 82.8C167.6 81.5 186.2 87.5 200.2 99.8C214.2 112.1 223.5 130.4 224.8 150C226 169.6 219.2 190.1 205.5 205.5C191.9 220.9 171.5 231 150 232.3C128.5 233.5 106 225.9 89.2 210.8C72.3 195.8 61.4 173.5 60.2 150C58.9 126.5 67.4 102 83.8 83.8C100.3 65.6 124.5 53.9 150 52.7C175.5 51.4 201.9 60.7 221.5 78.5C241.1 96.3 253.6 122.5 254.9 150C256.1 177.5 246 205.8 226.8 226.8C207.6 247.8 179.4 261.1 150 262.4C120.6 263.7 90.2 252.8 67.9 232.1C45.5 211.5 31.3 181.4 30.1 150C28.8 118.6 40.5 86.3 62.5 62.5C84.5 38.7 116.6 23.8 150 22.5C183.4 21.3 217.6 33.8 242.8 57.2C268 80.6 283.7 114.7 285 150C286 178.3 277.8 207.1 261.6 231.1";

export function UzumakiSpiral({ className }: GlyphProps) {
  return (
    <Shell viewBox="0 0 300 300" className={className}>
      <path
        d={UZUMAKI_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </Shell>
  );
}

/* ============================================================
   MÜHÜR — sekiz uçlu desen (八卦の封印式 yorumu)
   ============================================================ */

/** Merkez sarmalı: dört çeyrek yay, yarıçap her çeyrekte büyüyor. */
const SEAL_SWIRL =
  "M50 44A7.5 7.5 0 0 1 59 50A10.5 10.5 0 0 1 50 62A13.5 13.5 0 0 1 35 50A16.5 16.5 0 0 1 50 32";

const SEAL_TICKS = [0, 45, 90, 135, 180, 225, 270, 315];

export function SealMark({ className, title }: GlyphProps) {
  return (
    <Shell viewBox="0 0 100 100" className={className} title={title}>
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <circle cx="50" cy="50" r="45" strokeWidth="2.4" opacity="0.55" />
        <circle cx="50" cy="50" r="33" strokeWidth={STROKE} />
        {SEAL_TICKS.map((angle) => (
          <line
            key={angle}
            x1="50"
            y1="14"
            x2="50"
            y2="4.5"
            strokeWidth="3.4"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
        <path d={SEAL_SWIRL} strokeWidth={STROKE} />
      </g>
    </Shell>
  );
}

/* ============================================================
   KUYRUK YELPAZESİ — rayın karşılığı
   ============================================================ */

/**
 * Dokuz kuyruk, AÇILMA sırasında dizili: önce ortadaki, sonra çiftler
 * hâlinde dışa doğru. Böylece bir kuyruktan dokuza geçiş simetrik açılır.
 * Görünürlük CSS'te: `--tails` (aktif kademe) ile `--i` (kuyruk sırası)
 * karşılaştırılır — JS her kuyruğu ayrı ayrı yönetmez.
 */
const TAIL_LAYOUT: Array<{ angle: number; scale: number }> = [
  { angle: 0, scale: 1 },
  { angle: -21, scale: 0.97 },
  { angle: 21, scale: 0.97 },
  { angle: -42, scale: 0.93 },
  { angle: 42, scale: 0.93 },
  { angle: -60, scale: 0.88 },
  { angle: 60, scale: 0.88 },
  { angle: -76, scale: 0.82 },
  { angle: 76, scale: 0.82 },
];

/** Tek kuyruk: tabanda kalın, ucunda sivri, hafif S kıvrımlı. */
const TAIL_PATH =
  "M-10 2C-14 -22 -13 -52 -4 -74C0 -84 4 -88 7 -84C11 -78 12 -56 8 -34C5 -18 4 -6 4 2Z";

export function TailFan({
  tails,
  className,
  tailClassName,
}: GlyphProps & {
  tails: number;
  /** Tek kuyruğun sınıfı — açılma animasyonu çağıranın CSS'inde yaşar */
  tailClassName?: string;
}) {
  return (
    <Shell
      viewBox="0 0 240 132"
      className={className}
      style={{ "--tails": tails } as CSSProperties}
    >
      <g transform="translate(120 128)">
        {TAIL_LAYOUT.map((tail, index) => (
          <path
            key={tail.angle}
            className={tailClassName}
            style={{ "--i": index + 1 } as CSSProperties}
            d={TAIL_PATH}
            transform={`rotate(${tail.angle}) scale(${tail.scale})`}
            fill="currentColor"
          />
        ))}
      </g>
    </Shell>
  );
}

/* ============================================================
   KADEME DÜĞÜMLERİ — rayın üstündeki dokuz işaret
   ============================================================ */

export type StageNodeKind = "seal" | "ember" | "cloak" | "beast" | "sage" | "fusion";

const NODE_CONTENT: Record<StageNodeKind, React.ReactNode> = {
  /* Kapalı mühür: tam halka + merkez sarmalı */
  seal: (
    <>
      <circle cx="50" cy="50" r="33" strokeWidth={STROKE} />
      <path d={SEAL_SWIRL} strokeWidth="4.5" />
    </>
  ),
  /* İlk çatlak: halka açık, boşluktan bir kor damlası çıkıyor */
  ember: (
    <>
      <path d="M62 20A33 33 0 1 0 74 43" strokeWidth={STROKE} />
      <path
        d="M70 30C74 22 78 18 80 12C82 18 86 22 86 29C86 34 82 37 78 37C74 37 70 34 70 30Z"
        strokeWidth="4"
      />
      <path d={SEAL_SWIRL} strokeWidth="4.5" opacity="0.55" />
    </>
  ),
  /* Manto: halkanın içinde dışarı taşan bir kabuk silueti */
  cloak: (
    <>
      <path d="M64 21A33 33 0 1 1 36 21" strokeWidth={STROKE} />
      <path
        d="M50 26C61 34 66 45 65 56C64 66 58 73 50 76C42 73 36 66 35 56C34 45 39 34 50 26Z"
        strokeWidth="4.2"
      />
      <path d="M42 12C45 18 45 22 43 27M58 12C55 18 55 22 57 27" strokeWidth="4.2" />
    </>
  ),
  /* Canavar: halka + dikey yarıklı göz */
  beast: (
    <>
      <circle cx="50" cy="50" r="33" strokeWidth="4" opacity="0.6" />
      <path d="M22 50C32 34 68 34 78 50C68 66 32 66 22 50Z" strokeWidth={STROKE} />
      <path d="M50 39V61" strokeWidth="6.5" />
    </>
  ),
  /* Sennin: dış altın halka + iki yatay kurbağa gözü çubuğu */
  sage: (
    <>
      <circle cx="50" cy="50" r="44" strokeWidth="2.6" opacity="0.6" />
      <circle cx="50" cy="50" r="31" strokeWidth="4" opacity="0.5" />
      <path d="M28 43H72" strokeWidth="7" />
      <path d="M28 59H72" strokeWidth="7" />
      <path d="M50 43V59" strokeWidth="3" opacity="0.6" />
    </>
  ),
  /* Füzyon: iki yörünge iç içe, merkezde tek çekirdek */
  fusion: (
    <>
      <ellipse
        cx="50"
        cy="50"
        rx="42"
        ry="19"
        strokeWidth="4.4"
        transform="rotate(-38 50 50)"
      />
      <ellipse
        cx="50"
        cy="50"
        rx="42"
        ry="19"
        strokeWidth="4.4"
        transform="rotate(38 50 50)"
      />
      <circle cx="50" cy="50" r="9" fill="currentColor" stroke="none" />
    </>
  ),
};

export function StageNode({
  kind,
  className,
  title,
}: GlyphProps & { kind: StageNodeKind }) {
  return (
    <Shell viewBox="0 0 100 100" className={className} title={title}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {NODE_CONTENT[kind]}
      </g>
    </Shell>
  );
}

/* ============================================================
   MOD DÜĞMESİ — tilki gözü
   ============================================================ */

export function FoxSigil({ className, title }: GlyphProps) {
  return (
    <Shell viewBox="0 0 100 100" className={className} title={title}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 50C24 28 76 28 92 50C76 72 24 72 8 50Z" strokeWidth="5" />
        <path d="M50 33V67" strokeWidth="8" />
        <path d="M16 26L27 36M84 26L73 36" strokeWidth="4" opacity="0.7" />
      </g>
    </Shell>
  );
}

/* ============================================================
   LABORATUVAR GLİFLERİ
   ============================================================ */

/** Rasengan: dönen kabuk — üç yörünge yayı + merkez sarmalı. */
export function ChakraOrb({ className, spinClassName }: GlyphProps & { spinClassName?: string }) {
  return (
    <Shell viewBox="0 0 100 100" className={className}>
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <circle cx="50" cy="50" r="40" strokeWidth="2.4" opacity="0.5" />
        <g className={spinClassName} style={{ transformOrigin: "50% 50%" }}>
          <ellipse cx="50" cy="50" rx="40" ry="15" strokeWidth="3.2" transform="rotate(-24 50 50)" />
          <ellipse cx="50" cy="50" rx="40" ry="15" strokeWidth="3.2" transform="rotate(36 50 50)" />
          <path d={SEAL_SWIRL} strokeWidth="5" />
        </g>
      </g>
    </Shell>
  );
}

/** Kage Bunshin: aynı işaretin üç kopyası, arkadakiler soluklaşarak. */
export function CloneTrio({ className }: GlyphProps) {
  return (
    <Shell viewBox="0 0 140 100" className={className}>
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        {[
          { x: 0, o: 0.28 },
          { x: 22, o: 0.55 },
          { x: 44, o: 1 },
        ].map((copy) => (
          <g key={copy.x} transform={`translate(${copy.x} 0)`} opacity={copy.o}>
            <circle cx="26" cy="50" r="22" strokeWidth="4" />
            <path
              d="M26 40A5 5 0 0 1 32 46A7 7 0 0 1 26 54A9 9 0 0 1 16 46A11 11 0 0 1 26 34"
              strokeWidth="3.6"
            />
          </g>
        ))}
      </g>
    </Shell>
  );
}

/** Sennin Modo: kurbağa gözü — iki yatay çubuk, üstünde doğa halkası. */
export function ToadEyes({ className }: GlyphProps) {
  return (
    <Shell viewBox="0 0 140 100" className={className}>
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M14 38H62" strokeWidth="9" />
        <path d="M14 58H62" strokeWidth="9" />
        <path d="M78 38H126" strokeWidth="9" />
        <path d="M78 58H126" strokeWidth="9" />
        <path d="M38 38V58M102 38V58" strokeWidth="3.4" opacity="0.55" />
        <path d="M62 22C68 14 72 14 78 22" strokeWidth="4" opacity="0.7" />
      </g>
    </Shell>
  );
}

/* ============================================================
   MÜHÜR ETİKETİ GLİFLERİ — dört küçük kart
   ============================================================ */

export type TagGlyphKind = "rasenshuriken" | "bond" | "seal" | "gamakichi";

const TAG_CONTENT: Record<TagGlyphKind, React.ReactNode> = {
  /* Rüzgâr şurikeni: dört sivrilen kanat + sarmal göbek */
  rasenshuriken: (
    <>
      {[0, 90, 180, 270].map((angle) => (
        <path
          key={angle}
          d="M50 38C58 30 74 18 86 14C82 26 70 42 62 50Z"
          strokeWidth="4"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      <path d={SEAL_SWIRL} strokeWidth="4.6" />
    </>
  ),
  /* Bağ: iki halka birbirine geçmiş */
  bond: (
    <>
      <circle cx="36" cy="50" r="24" strokeWidth="5" />
      <circle cx="66" cy="50" r="24" strokeWidth="5" />
      <path d="M50 34V66" strokeWidth="3" opacity="0.5" />
    </>
  ),
  /* Mühür: sekiz uçlu desenin sade hâli */
  seal: (
    <>
      <circle cx="50" cy="50" r="42" strokeWidth="2.6" opacity="0.55" />
      <circle cx="50" cy="50" r="30" strokeWidth="4.6" />
      {SEAL_TICKS.map((angle) => (
        <line
          key={angle}
          x1="50"
          y1="17"
          x2="50"
          y2="9"
          strokeWidth="3.2"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      <path d={SEAL_SWIRL} strokeWidth="4.4" />
    </>
  ),
  /* Gamakichi: geniş gövde, tepede iki göz, önde iki pençe */
  gamakichi: (
    <>
      <path d="M16 74C16 54 30 42 50 42C70 42 84 54 84 74Z" strokeWidth="4.6" />
      <circle cx="36" cy="34" r="10" strokeWidth="4.4" />
      <circle cx="64" cy="34" r="10" strokeWidth="4.4" />
      <path d="M36 34H36.5M64 34H64.5" strokeWidth="7" />
      <path d="M22 74C18 80 14 82 10 82M78 74C82 80 86 82 90 82" strokeWidth="4" />
    </>
  ),
};

export function TagGlyph({ kind, className }: GlyphProps & { kind: TagGlyphKind }) {
  return (
    <Shell viewBox="0 0 100 100" className={className}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {TAG_CONTENT[kind]}
      </g>
    </Shell>
  );
}
