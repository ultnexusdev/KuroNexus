/**
 * Ino Yamanaka sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §3.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif ve açıklayıcı grafik burada, saf SVG olarak
 * duruyor — emsal `components/character/itachi/SharinganEyes.tsx`. Renkler
 * yalnızca token'dan geliyor (`--ino-*`, CSS modülünün deri bloğu), bu
 * dosyada da tek hex yok.
 *
 * ── TEK BİR ÇİZİM DİLİ ───────────────────────────────────────────────────
 * Altı çiçek, üç teknik şeması ve dört tezgâh ikonu AYNI kalemle çizildi:
 *   · taşıyıcı çizgi 0.9–1.2 birim, yuvarlak uç,
 *   · dolgu yalnızca yaprakta ve yalnızca düşük opaklıkta,
 *   · "dolu daire" her zaman BİR BİLİNÇ, "ince iplik" her zaman BİR BAĞ.
 * Şemalar süs değil: üç tekniğin farkını yazıyla değil geometriyle
 * anlatıyorlar (kimin bedeni boşalıyor, kim yerinde kalıyor, kaç kişiye
 * gidiyor). Bu yüzden ikon değil, diyagram muamelesi görüyorlar.
 *
 * ── HAREKET BURADA DEĞİL ─────────────────────────────────────────────────
 * Bileşenler yalnızca `className` alıp geometriyi çiziyor; hangi çizginin
 * ne zaman görüneceğini `data-*` nitelikleri söylüyor. Böylece modülün
 * sonundaki reduced-motion battaniyesi hepsini tek yerden durdurabiliyor.
 *
 * ⚠️ Bu dosyada "use client" YOK ama istemci adaları (`MindWeb`,
 * `ShintenshinShell`) onu çağırıyor — düz JSX olduğu için istemci paketine
 * giriyor, ek bağımlılık getirmiyor. Sunucu tarafı (hero, çiçek dili,
 * laboratuvar) aynı bileşenleri kullanıyor.
 */

/* ============================================================
   ÇİÇEK ÜRETİCİSİ

   Bir yaprak: merkezden çıkan, uçta sivrilen mercek. İki quadratic
   yay — biri sağdan, biri soldan. `width` yaprağın şişkinliği, `len`
   ucun merkeze uzaklığı. Altı çiçeğin silueti bu üç sayının farkından
   çıkıyor; ayrı ayrı elle çizilen tek şey menekşe ile centiyane.
   ============================================================ */

const FX = 24;
const FY = 23;

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function petal(angle: number, inner: number, len: number, width: number): string {
  const radian = ((angle - 90) * Math.PI) / 180;
  const ux = Math.cos(radian);
  const uy = Math.sin(radian);
  /* Yaprağın enine ekseni — taşıyıcı eksene dik birim vektör */
  const px = -uy;
  const py = ux;

  const x0 = round(FX + ux * inner);
  const y0 = round(FY + uy * inner);
  const x1 = round(FX + ux * len);
  const y1 = round(FY + uy * len);
  const bulge = len * 0.42;
  const c1x = round(FX + ux * bulge + px * width);
  const c1y = round(FY + uy * bulge + py * width);
  const c2x = round(FX + ux * bulge - px * width);
  const c2y = round(FY + uy * bulge - py * width);

  return `M${x0} ${y0} Q${c1x} ${c1y} ${x1} ${y1} Q${c2x} ${c2y} ${x0} ${y0}Z`;
}

function petalRing(
  count: number,
  offset: number,
  inner: number,
  len: number,
  width: number,
): string[] {
  return Array.from({ length: count }, (_, index) =>
    petal(offset + (index * 360) / count, inner, len, width),
  );
}

/** Centiyanenin yukarı bakan borusu: düz gövde, tepede üç sivri uç. */
function trumpet(x: number, base: number, height: number, half: number): string {
  const top = base - height;
  return [
    `M${round(x - half)} ${base}`,
    `L${round(x - half * 0.86)} ${round(top + height * 0.24)}`,
    `L${round(x - half * 0.5)} ${round(top)}`,
    `L${round(x)} ${round(top + height * 0.15)}`,
    `L${round(x + half * 0.5)} ${round(top)}`,
    `L${round(x + half * 0.86)} ${round(top + height * 0.24)}`,
    `L${round(x + half)} ${base}`,
    "Z",
  ].join(" ");
}

/* ── Altı çiçeğin reçetesi ───────────────────────────────────────────────
   `petals` yaprak yolları, `stem` sap ve yaprak (yeşil), `core` göbek. */

interface FlowerRecipe {
  petals: string[];
  stem: string[];
  core: number;
  /** Göbeğin üstüne binen ince çizgiler — kikyō'nun yıldızı gibi */
  veins?: string[];
}

const FLOWERS: Record<string, FlowerRecipe> = {
  /* 桔梗 — beş geniş lob, ortada beş ışınlı yıldız */
  kikyo: {
    petals: petalRing(5, 0, 2.2, 16.5, 8.6),
    stem: ["M24 34 C 24 39 23 43 22.5 46.5", "M24 38 C 27.5 37 30 38.6 31.4 41.4"],
    core: 2.4,
    veins: petalRing(5, 0, 2, 12.5, 0.9),
  },
  /* 牡丹 — üç kademeli katmerli taç */
  botan: {
    petals: [
      ...petalRing(9, 0, 3.2, 16.2, 9),
      ...petalRing(7, 25, 2.6, 11, 7),
      ...petalRing(5, 12, 1.4, 6.4, 4.4),
    ],
    stem: [
      "M24 35.5 C 24 40 23.4 43.6 23 46.5",
      "M23.6 39.4 C 19.6 38.4 17.2 39.8 15.8 42.8",
      "M23.8 42.4 C 27.8 41.6 30.2 43 31.4 45.8",
    ],
    core: 1.8,
  },
  /* コスモス — sekiz dar yaprak, geniş göbek */
  kosumosu: {
    petals: petalRing(8, 0, 3.4, 17, 4.8),
    stem: ["M24 34 C 25 39 25.4 43 25.4 46.5", "M25 38.6 C 21.4 37.4 19 38.6 17.4 41.4"],
    core: 3.2,
  },
  /* 白菊 — iki halkalı ince ışın demeti */
  shiragiku: {
    petals: [
      ...petalRing(18, 0, 4.4, 16.6, 2),
      ...petalRing(18, 10, 3, 11, 1.8),
    ],
    stem: ["M24 34 C 24 39 24 43 24 46.5", "M24 38.4 C 20.4 37.4 18 38.8 16.6 41.8"],
    core: 2.6,
  },
  /* 菫 — asimetrik beşli: iki üst, iki yan, altta geniş dudak */
  sumire: {
    petals: [
      petal(-42, 2, 10.6, 5.6),
      petal(42, 2, 10.6, 5.6),
      petal(-104, 2, 11.8, 6),
      petal(104, 2, 11.8, 6),
      petal(180, 1.6, 13.4, 8),
    ],
    stem: [
      "M24 37 C 26.4 41 26.6 44 26 46.6",
      "M25.6 41 C 21.4 40.4 18.8 42 17.6 45",
    ],
    core: 1.6,
  },
  /* 竜胆 — üç yukarı bakan boru, sapta karşılıklı yapraklar */
  rindo: {
    petals: [
      trumpet(24, 32, 20, 5.2),
      trumpet(15.6, 34, 15, 4),
      trumpet(32.4, 34, 15, 4),
    ],
    stem: [
      "M24 33.4 C 24 39 24 43 24 46.6",
      "M24 38 C 20 37 17.6 38.4 16.2 41.2",
      "M24 41.4 C 28 40.6 30.4 42 31.6 44.8",
    ],
    core: 0,
  },
};

export type InoFlowerName = keyof typeof FLOWERS;

/**
 * Hanakotoba bölümünün çiçeği.
 *
 * Dekoratif: adı ve anlamı yanındaki metin taşıyor, çizim onu tekrar
 * etmiyor — bu yüzden `aria-hidden`.
 */
export function InoFlower({
  name,
  className,
}: {
  name: InoFlowerName;
  className?: string;
}) {
  const recipe = FLOWERS[name];
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g
        stroke="var(--ino-stem)"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      >
        {recipe.stem.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g
        fill="var(--ino-petal)"
        fillOpacity="0.16"
        stroke="var(--ino-petal)"
        strokeWidth="0.9"
        strokeLinejoin="round"
      >
        {recipe.petals.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {recipe.veins ? (
        <g stroke="var(--ino-petal)" strokeWidth="0.55" strokeOpacity="0.5">
          {recipe.veins.map((d) => (
            <path key={`v${d}`} d={d} fill="none" />
          ))}
        </g>
      ) : null}
      {recipe.core > 0 ? (
        <circle cx={FX} cy={FY} r={recipe.core} fill="var(--gold)" />
      ) : null}
    </svg>
  );
}

/* ============================================================
   HERO — AÇILAN ÇİÇEK DESENİ

   Üç eş merkezli taç, her biri bir öncekinden dönmüş. Çok düşük
   opaklıkta duruyor (`--ino-bloom` ailesi): kadrajın arkasında
   açılan bir çiçek hissi, okunacak bir grafik değil.
   ============================================================ */

const BLOOM_RINGS = [
  { petals: petalRing(12, 0, 4, 22, 7.4), width: 0.7 },
  { petals: petalRing(10, 18, 3, 15.5, 6), width: 0.6 },
  { petals: petalRing(8, 8, 2, 9.5, 4.4), width: 0.5 },
];

export function BloomField({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {BLOOM_RINGS.map((ring, index) => (
        <g
          key={ring.width}
          data-ring={index}
          fill="var(--ino-petal)"
          fillOpacity="0.05"
          stroke="var(--ino-petal)"
          strokeWidth={ring.width}
          strokeOpacity="0.3"
        >
          {ring.petals.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      ))}
      <circle cx={FX} cy={FY} r="2.4" fill="var(--gold)" fillOpacity="0.4" />
    </svg>
  );
}

/* ============================================================
   MOD DÜĞMESİNİN GLİFİ — Shintenshin

   İki daire: soldaki boşalıyor (kesikli), sağdaki doluyor. Aradaki
   nokta yolda olan bilinç. Düğme basılıyken CSS noktayı sağa taşıyor.
   ============================================================ */

export function SwitchGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 20"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <circle
        cx="6.5"
        cy="10"
        r="5"
        stroke="var(--ino-mind)"
        strokeWidth="1.2"
        strokeDasharray="2 2.2"
      />
      <circle
        cx="25.5"
        cy="10"
        r="5"
        fill="var(--ino-mind)"
        fillOpacity="0.24"
        stroke="var(--ino-mind)"
        strokeWidth="1.2"
      />
      <path
        d="M12 10 H20"
        stroke="var(--ino-mind)"
        strokeWidth="1"
        strokeDasharray="1.4 2"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Yolda olan bilinç. Sınıf değil `data-part`: CSS Modules sınıf
          adlarını karıştırıyor, nitelik seçicisi karışmıyor. */}
      <circle data-part="spark" cx="16" cy="10" r="2.1" fill="var(--ino-petal)" />
    </svg>
  );
}

/* ============================================================
   TEKNİK ŞEMALARI — üç ayarın farkı

   Ortak dil: r=9 daire bir bilinç. DOLU = orada biri var,
   KESİKLİ = beden boş. İnce iplik bağ, ok yok — bu teknikler
   itmiyor, bağlanıyor.
   ============================================================ */

export type MindDiagramKind = "switch" | "puppet" | "broadcast";

/** Yayılma şemasının kişi noktaları — beş alıcı, elle yerleştirildi. */
const BROADCAST_DOTS = [
  [58, 8],
  [64, 20],
  [58, 32],
  [47, 13.5],
  [47, 26.5],
];

/** Kukla ipliklerinin uçları — hedefin uzuvlarına gidiyor */
const PUPPET_THREADS = [
  "M25 16 C 36 11 44 10 49.5 12.5",
  "M25 20 C 37 20 44 20 48 20",
  "M25 24 C 36 29 44 30 49.5 27.5",
];

export function MindDiagram({
  kind,
  className,
}: {
  kind: MindDiagramKind;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 40"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {kind === "switch" ? (
        <g>
          {/* Boşalan beden */}
          <circle
            cx="16"
            cy="20"
            r="9"
            stroke="var(--ino-mind)"
            strokeWidth="1.2"
            strokeDasharray="2.6 3"
            strokeOpacity="0.75"
          />
          {/* Yolda olan bilinç */}
          <path
            d="M25.5 20 C 32 15.5 40 15.5 46 19"
            stroke="var(--ino-mind)"
            strokeOpacity="0.7"
            strokeWidth="1"
            strokeDasharray="1.6 2.4"
            strokeLinecap="round"
          />
          <circle cx="36" cy="16.6" r="2.6" fill="var(--ino-petal)" />
          {/* Ele geçirilen beden */}
          <circle
            cx="56"
            cy="20"
            r="9"
            fill="var(--ino-mind)"
            fillOpacity="0.26"
            stroke="var(--ino-mind)"
            strokeWidth="1.2"
          />
        </g>
      ) : null}

      {kind === "puppet" ? (
        <g>
          {/* Ino yerinde: dolu kalıyor */}
          <circle
            cx="16"
            cy="20"
            r="9"
            fill="var(--ino-mind)"
            fillOpacity="0.26"
            stroke="var(--ino-mind)"
            strokeWidth="1.2"
          />
          <g
            stroke="var(--ino-mind)"
            strokeOpacity="0.7"
            strokeWidth="0.9"
            strokeLinecap="round"
            fill="none"
          >
            {PUPPET_THREADS.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          {/* Hedef de dolu — bilinci açık, iradesi alınmış */}
          <circle
            cx="56"
            cy="20"
            r="9"
            fill="var(--ino-mind)"
            fillOpacity="0.14"
            stroke="var(--ino-mind)"
            strokeWidth="1.2"
          />
          <g stroke="var(--ino-petal)" strokeWidth="1.2" strokeLinecap="round">
            <path d="M56 11 V6.5" />
            <path d="M56 29 V33.5" />
            <path d="M65 20 H69.5" />
          </g>
        </g>
      ) : null}

      {kind === "broadcast" ? (
        <g>
          <circle
            cx="16"
            cy="20"
            r="9"
            fill="var(--ino-mind)"
            fillOpacity="0.26"
            stroke="var(--ino-mind)"
            strokeWidth="1.2"
          />
          <g
            stroke="var(--ino-mind)"
            strokeOpacity="0.7"
            strokeWidth="0.9"
            fill="none"
            strokeLinecap="round"
          >
            <path d="M27.5 12 A 13 13 0 0 1 27.5 28" />
            <path d="M34.5 8.5 A 20 20 0 0 1 34.5 31.5" />
            <path d="M41 5.6 A 27 27 0 0 1 41 34.4" />
          </g>
          <g fill="var(--ino-petal)">
            {BROADCAST_DOTS.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" />
            ))}
          </g>
        </g>
      ) : null}
    </svg>
  );
}

/* ============================================================
   TEZGÂH İKONLARI — dört küçük

   Aynı kalem, daha az çizgi. 40×40, taşıyıcı çizgi 1.2.
   ============================================================ */

export type BenchGlyphKind = "sensor" | "kumite" | "shears" | "trio";

export function BenchGlyph({
  kind,
  className,
}: {
  kind: BenchGlyphKind;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {kind === "sensor" ? (
        <g>
          <circle cx="9" cy="31" r="3" fill="var(--ino-mind)" fillOpacity="0.6" />
          <g
            stroke="var(--ino-mind)"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M9 23.5 A 7.5 7.5 0 0 1 16.5 31" />
            <path d="M9 16 A 15 15 0 0 1 24 31" />
            <path d="M9 8.5 A 22.5 22.5 0 0 1 31.5 31" />
          </g>
          <circle cx="30" cy="10" r="2.4" fill="var(--ino-petal)" />
        </g>
      ) : null}

      {kind === "kumite" ? (
        <g>
          <circle
            cx="12"
            cy="14"
            r="6"
            fill="var(--ino-mind)"
            fillOpacity="0.24"
            stroke="var(--ino-mind)"
            strokeWidth="1.2"
          />
          <path
            d="M17 18 C 22 22 24 26 24.5 30"
            stroke="var(--ino-mind)"
            strokeOpacity="0.7"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
          <circle
            cx="27"
            cy="30"
            r="6"
            fill="var(--ino-mind)"
            fillOpacity="0.12"
            stroke="var(--ino-mind)"
            strokeWidth="1.2"
          />
          <g stroke="var(--ino-petal)" strokeWidth="1.2" strokeLinecap="round">
            <path d="M31.4 25.8 L35.4 21.6" />
            <path d="M22.6 34.2 L18.8 38" />
          </g>
        </g>
      ) : null}

      {kind === "shears" ? (
        <g
          stroke="var(--ino-stem)"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M12.5 5.5 L24 24.5" />
          <path d="M27.5 5.5 L16 24.5" />
          <circle cx="26.4" cy="30.4" r="4.6" />
          <circle cx="13.6" cy="30.4" r="4.6" />
          <circle cx="20" cy="21.4" r="1.5" fill="var(--gold)" stroke="none" />
        </g>
      ) : null}

      {kind === "trio" ? (
        <g>
          <g
            stroke="var(--ino-mind)"
            strokeOpacity="0.6"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M20 11.5 L10.4 28" />
            <path d="M20 11.5 L29.6 28" />
            <path d="M10.4 28 L29.6 28" />
          </g>
          <circle cx="20" cy="9" r="5" fill="var(--ino-petal)" fillOpacity="0.55" />
          <circle
            cx="10"
            cy="29.5"
            r="4.4"
            fill="var(--text-primary)"
            fillOpacity="0.18"
            stroke="var(--text-secondary)"
            strokeWidth="1"
          />
          <circle
            cx="30"
            cy="29.5"
            r="5.2"
            fill="var(--gold)"
            fillOpacity="0.4"
            stroke="var(--gold)"
            strokeWidth="1"
          />
        </g>
      ) : null}
    </svg>
  );
}

/* ============================================================
   ZİHİN AĞI — SAYFANIN KALBİ

   Geometri TEK YERDE, burada. `MindWeb` (istemci adası) düğme
   konumlarını da bu kayıttan okuyor: şemadaki hat ile üstündeki
   düğme her zaman aynı noktada durur.

   Yerleşim: beş kişisel düğüm soldan sağa bir TAÇ çiziyor (17,54 →
   84,50), ittifak düğümü ise altta, tek başına ve daha büyük.
   Sıra hem uzamsal hem anlatısal olarak ileri gidiyor — ok tuşuyla
   gezen kişi hikâyeyi de sırayla geçiyor:
     tek zihin → takım → düşman → hat → baba → ordu
   ============================================================ */

export interface WebPoint {
  key: string;
  /** Sahne kutusunun yüzdesi (viewBox 0–100 ile birebir) */
  x: number;
  y: number;
  /** Merkezden düğüme akan hat */
  link: string;
}

export const INO_WEB_GEOMETRY: WebPoint[] = [
  { key: "sakura", x: 17, y: 54, link: "M50 50 C 40 51.6 30 51.6 17 54" },
  { key: "team", x: 27, y: 25, link: "M50 50 C 42 43 34 34 27 25" },
  { key: "enemy", x: 51, y: 15, link: "M50 50 C 51.4 39 51.4 27 51 15" },
  { key: "relay", x: 75, y: 27, link: "M50 50 C 58 44 68 35 75 27" },
  { key: "father", x: 84, y: 50, link: "M50 50 C 60 49 72 48.4 84 50" },
  { key: "army", x: 50, y: 85, link: "M50 50 C 48.6 62 49.4 74 50 85" },
];

/**
 * Düğümleri birbirine bağlayan hatlar. Bir kiriş yalnızca İKİ ucu da
 * bağlıyken görünür — ağ birikerek örülüyor, hazır çizili durmuyor.
 * İlk altı kiriş tacın kendisi, son ikisi ortadan geçen çaprazlar.
 */
export const INO_WEB_CHORDS: { a: string; b: string; d: string }[] = [
  { a: "sakura", b: "team", d: "M17 54 C 16 41 20 32 27 25" },
  { a: "team", b: "enemy", d: "M27 25 C 34 17 43 14 51 15" },
  { a: "enemy", b: "relay", d: "M51 15 C 60 15 69 20 75 27" },
  { a: "relay", b: "father", d: "M75 27 C 82 33 85 41 84 50" },
  { a: "father", b: "army", d: "M84 50 C 82 66 68 80 50 85" },
  { a: "army", b: "sakura", d: "M50 85 C 32 80 19 68 17 54" },
  { a: "team", b: "relay", d: "M27 25 C 42 33.5 60 33.5 75 27" },
  { a: "sakura", b: "father", d: "M17 54 C 34 66 66 66 84 50" },
];

/** İttifak halkası: 48 küçük nokta, r = 47. */
const RING_DOTS = Array.from({ length: 48 }, (_, index) => {
  const radian = ((index * 360) / 48 - 90) * (Math.PI / 180);
  return {
    index,
    x: round(50 + Math.cos(radian) * 47),
    y: round(50 + Math.sin(radian) * 47),
  };
});

/** Merkezdeki Ino: sekiz yapraklı küçük taç. */
const CENTRE_PETALS = petalRing(8, 0, 1.6, 8.4, 3.4);

export function MindWebArt({
  linked,
  filled,
  title,
  className,
  linkClassName,
  chordClassName,
  dotClassName,
  coreClassName,
}: {
  /** Bağı kurulmuş düğümlerin anahtarları */
  linked: ReadonlySet<string>;
  /** İttifak halkasında yanacak nokta sayısı (0–48) */
  filled: number;
  /** Ekran okuyucuya inen açıklama; boşsa şema tamamen dekoratiftir */
  title?: string;
  className?: string;
  linkClassName?: string;
  chordClassName?: string;
  dotClassName?: string;
  coreClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {/* İttifak halkası — dıştaki 48 nokta. Sekiz kuşağa bölündü:
          yeni bağ kurulduğunda dalga hâlinde aydınlanıyor. */}
      <g className={dotClassName} fill="var(--ino-mind)">
        {RING_DOTS.map((dot) => (
          <circle
            key={dot.index}
            cx={dot.x}
            cy={dot.y}
            r="0.85"
            data-band={dot.index % 8}
            data-on={dot.index < filled ? "true" : undefined}
          />
        ))}
      </g>

      {/* Kirişler: iki ucu da bağlıyken beliren ağ */}
      <g strokeLinecap="round" fill="none">
        {INO_WEB_CHORDS.map((chord) => (
          <path
            key={`${chord.a}-${chord.b}`}
            className={chordClassName}
            d={chord.d}
            data-on={
              linked.has(chord.a) && linked.has(chord.b) ? "true" : undefined
            }
            stroke="var(--ino-mind)"
            strokeWidth="0.5"
          />
        ))}
      </g>

      {/* Merkezden düğüme akan hat — sayfanın tek yazılmış hareketi.
          `pathLength` 1: dashoffset 1 → 0, yani çizim HER ZAMAN
          merkezden başlıyor (yolun ilk noktası 50 50). */}
      <g strokeLinecap="round" fill="none">
        {INO_WEB_GEOMETRY.map((point) => (
          <g key={point.key}>
            <path
              className={linkClassName}
              d={point.link}
              data-on={linked.has(point.key) ? "true" : undefined}
              stroke="var(--ino-link)"
              strokeWidth="3.2"
              pathLength={1}
            />
            <path
              className={linkClassName}
              d={point.link}
              data-on={linked.has(point.key) ? "true" : undefined}
              stroke="var(--ino-petal)"
              strokeWidth="0.55"
              pathLength={1}
            />
          </g>
        ))}
      </g>

      {/* Merkez: Ino'nun kendisi */}
      <g className={coreClassName}>
        <circle
          cx="50"
          cy="50"
          r="13.5"
          stroke="var(--ino-mind)"
          strokeOpacity="0.22"
          strokeWidth="0.4"
        />
        <g
          fill="var(--ino-petal)"
          fillOpacity="0.2"
          stroke="var(--ino-petal)"
          strokeWidth="0.5"
          transform="translate(26 27)"
        >
          {CENTRE_PETALS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <circle cx="50" cy="50" r="2" fill="var(--gold)" />
      </g>
    </svg>
  );
}
