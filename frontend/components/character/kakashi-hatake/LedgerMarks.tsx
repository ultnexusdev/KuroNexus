import type { NatureKey } from "@/lib/characters/kakashi-hatake-experience";

/**
 * Kopya Kütüğü'nün işaret takımı — saf SVG, sunucuda çizilir.
 *
 * Hepsi bu arşiv için elle çizildi (BRIEF kural 3.4: dışarıdan raster
 * görsel yok, wiki deseni kopyalanmaz). Renkler `currentColor` ya da
 * `--kks-*` token'ları üzerinden gelir; dosyada tek hex yok.
 *
 * Çizgi sözlüğü tek: doğa mühürleri ve ANBU maskesi 1,6 birim konturla,
 * yuvarlak uç ve birleşimle çizilir — beş mühür yan yana durduğunda aynı
 * kalemden çıkmış görünsün diye (kalınlık `vectorEffect` ile değil, kutu
 * ölçüsüyle sabit tutuluyor: hepsi 24'lük kutuda).
 */

/* ============================================================
   KAMUI GİRDABI — hero'nun üst bandı
   ============================================================ */

/**
 * Merkeze çekilen eş merkezli yaylar.
 *
 * Yaylar `<ellipse>` + dasharray ile DEĞİL, tek tek örneklenmiş nokta
 * dizileriyle çiziliyor: her halkanın başlangıç açısı bir öncekinden
 * kayıyor ve kapsadığı yay daralıyor. Sonuç, dönme animasyonu olmadan da
 * okunan bir burulma — Kakashi'nin modu sessiz olmalı (yönerge), yani
 * girdabın hareketi geometride, zamanda değil.
 *
 * Odak noktası bilerek merkezde değil (%38): bant boyunca asimetrik bir
 * çekim, kadrajın sağ tarafını boş bırakıp başlığa yer açıyor.
 */
const VORTEX_RINGS = 20;
const FOCUS_X = 456;
const FOCUS_Y = 150;

function ringPath(index: number): string {
  const t = index / (VORTEX_RINGS - 1);
  /* Yarıçap geometrik daralıyor: dışarıda seyrek, merkezde sık halkalar */
  const rx = 620 * Math.pow(0.8, index) + 6;
  const ry = rx * (0.3 + t * 0.16);
  /* Her halka bir öncekinden 14° kayık → burulma */
  const rot = (index * 14 * Math.PI) / 180;
  /* Yay kapsamı dışarıda 320°, merkezde 210° */
  const sweep = ((320 - t * 110) * Math.PI) / 180;
  const start = (index * 37 * Math.PI) / 180;
  const steps = 44;
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  let d = "";
  for (let s = 0; s <= steps; s += 1) {
    const a = start + (sweep * s) / steps;
    const ex = Math.cos(a) * rx;
    const ey = Math.sin(a) * ry;
    const x = FOCUS_X + ex * cos - ey * sin;
    const y = FOCUS_Y + ex * sin + ey * cos;
    d += `${s === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

/** Merkeze doğru kısa radyal çentikler — "emiliyor" hissi, hareketsiz. */
function suctionTicks(): { d: string; opacity: number }[] {
  const ticks: { d: string; opacity: number }[] = [];
  for (let i = 0; i < 16; i += 1) {
    const a = (i * 360) / 16 + 11;
    const rad = (a * Math.PI) / 180;
    const outer = 96 + (i % 5) * 34;
    const inner = outer - 22 - (i % 3) * 9;
    const x1 = FOCUS_X + Math.cos(rad) * outer * 1.9;
    const y1 = FOCUS_Y + Math.sin(rad) * outer * 0.5;
    const x2 = FOCUS_X + Math.cos(rad) * inner * 1.9;
    const y2 = FOCUS_Y + Math.sin(rad) * inner * 0.5;
    ticks.push({
      d: `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`,
      opacity: 0.5 - (i % 4) * 0.09,
    });
  }
  return ticks;
}

export function KamuiVortex({ className }: { className?: string }) {
  const rings = Array.from({ length: VORTEX_RINGS }, (_, i) => i);
  const ticks = suctionTicks();
  return (
    <svg
      viewBox="0 0 1200 300"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable="false"
    >
      <defs>
        <radialGradient id="kks-vortex-core" cx="38%" cy="50%" r="42%">
          <stop offset="0" stopColor="var(--kks-kamui)" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="var(--kks-kamui)" stopOpacity="0.12" />
          <stop offset="1" stopColor="var(--kks-kamui)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Bandın kenarları zemine karışsın diye maske CSS'te
          (`mask-image`, modül dosyası): SVG `<mask>` parlaklıkla çalışır
          ve maske dikdörtgenini beyazla boyamak gerekirdi — palet dışı bir
          renk. Kenar yumuşatma bir görünüm işi, geometri değil. */}
      <g>
        <ellipse cx={FOCUS_X} cy={FOCUS_Y} rx="330" ry="132" fill="url(#kks-vortex-core)" />
        {rings.map((i) => (
          <path
            key={i}
            d={ringPath(i)}
            fill="none"
            stroke="var(--kks-kamui)"
            strokeWidth={i < 6 ? 1.5 : 1}
            strokeOpacity={0.14 + i * 0.028}
            strokeLinecap="round"
          />
        ))}
        {ticks.map((tick) => (
          <path
            key={tick.d}
            d={tick.d}
            stroke="var(--kks-steel)"
            strokeWidth="1"
            strokeOpacity={tick.opacity * 0.5}
            strokeLinecap="round"
          />
        ))}
        {/* Girdabın gözü: yayların kaybolduğu delik */}
        <ellipse cx={FOCUS_X} cy={FOCUS_Y} rx="17" ry="7" fill="var(--kks-mask)" />
      </g>
    </svg>
  );
}

/**
 * Girdabın küçük kardeşi — mod kolunun işareti.
 *
 * Aynı logaritmik spiral, 24'lük kutuda ve tek kolla: büyük bantla aynı
 * dili konuşsun diye noktalar yine hesaplanıyor, elle yuvarlatılmış bir
 * "S" çizilmiyor.
 */
function spiralPath(turns: number, r0: number, decay: number): string {
  const steps = 96;
  const total = turns * 2 * Math.PI;
  let d = "";
  for (let s = 0; s <= steps; s += 1) {
    const a = (total * s) / steps;
    const r = r0 * Math.pow(decay, a / (2 * Math.PI));
    const x = 12 + Math.cos(a) * r;
    const y = 12 + Math.sin(a) * r;
    d += `${s === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

const KAMUI_SPIRAL = spiralPath(2.6, 9.4, 0.44);

export function KamuiGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
      focusable="false"
    >
      <path d={KAMUI_SPIRAL} />
    </svg>
  );
}

/* ============================================================
   DOĞA MÜHÜRLERİ — kartoteks sekmelerinin işareti
   ============================================================ */

const SEAL_PATHS: Record<NatureKey, React.ReactNode> = {
  /* Ateş: üç dilli alev — dıştaki dil içteki alevi sarar */
  katon: (
    <>
      <path d="M12 3c.4 3.2 2.1 4.4 3.6 6.1 1.4 1.6 2.4 3.2 2.4 5.4A6 6 0 0 1 6 14.5c0-2.5 1.5-4.3 2.9-5.6" />
      <path d="M12 20a3.2 3.2 0 0 1-2.4-5.3c1.1-1.2 2-2.2 2.1-3.9 1.3 1.3 2.4 2.3 2.6 3.9A3.2 3.2 0 0 1 12 20z" />
    </>
  ),
  /* Su: üç dalga, ortadaki bir faz kaymış */
  suiton: (
    <>
      <path d="M3 7.5q2.6-2.6 5.2 0t5.2 0 5.2 0" />
      <path d="M3 12.5q2.6-2.6 5.2 0t5.2 0 5.2 0" />
      <path d="M3 17.5q2.6-2.6 5.2 0t5.2 0 5.2 0" />
    </>
  ),
  /* Toprak: katmanlar + yükselen bir kırık */
  doton: (
    <>
      <path d="M3.5 18.5h17" />
      <path d="M5.5 14.5h13" />
      <path d="M7.5 10.5l4.5-4 4.5 4" />
      <path d="M12 6.5v8" />
    </>
  ),
  /* Yıldırım: tek kırık çizgi, kapalı gövde */
  raiton: (
    <path d="M13.6 2.5 6.4 13.2h4.3l-1.5 8.3 8.4-11.6h-4.6z" />
  ),
  /* Yin-Yang: daire + S ekseni + iki göz */
  yin: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 1 0 9" />
      <circle cx="12" cy="7.5" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="12" cy="16.5" r="1.15" fill="currentColor" stroke="none" />
    </>
  ),
};

/**
 * Doğa mührü. Renk `currentColor`dan gelir: sekme kendi tonunu
 * (`--nature-tint`) `color` ile verir, mühür ona uyar.
 */
export function NatureSeal({
  nature,
  className,
}: {
  nature: NatureKey;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {SEAL_PATHS[nature]}
    </svg>
  );
}

/* ============================================================
   KOPYA DAMGASI — "写" mührü
   ============================================================ */

/**
 * Kopyalanmış fişin köşesindeki lastik damga izi.
 *
 * Halka bilerek kesintili (`strokeDasharray` düzensiz): mürekkep her
 * yerde tutmaz. Dekoratif — okunur karşılığı fişin "Kaynak" satırında
 * yazıyor, o yüzden `aria-hidden`.
 */
export function CopyStamp({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable="false"
    >
      <circle
        cx="32"
        cy="32"
        r="29"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeDasharray="44 5 29 4 58 6 22 3"
        strokeLinecap="round"
      />
      <circle
        cx="32"
        cy="32"
        r="23.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="30 6 52 5"
        strokeOpacity="0.7"
      />
      <text
        x="32"
        y="33"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="27"
        fill="currentColor"
        style={{ fontFamily: "var(--font-brush), var(--font-sans)" }}
      >
        写
      </text>
    </svg>
  );
}

/* ============================================================
   ANBU MASKESİ — kaydı tutulmayan yılların işareti
   ============================================================ */

/**
 * Kurt maskesi. Kakashi'nin ANBU dönemi için elle çizilmiş çizgi resim:
 * o bölümün görseli bilerek yok (kütükte boş sayfa), yerinde bu maske
 * duruyor.
 */
export function AnbuMask({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      <path d="M24 4.5c9.4 0 14.6 4.8 14.6 12.9 0 11.4-6.2 21.9-14.6 26.1C15.6 39.3 9.4 28.8 9.4 17.4 9.4 9.3 14.6 4.5 24 4.5z" />
      {/* Göz yarıkları */}
      <path d="M13.8 21.4c2.4-2.3 5.6-2.3 8 0-2.4 2.3-5.6 2.3-8 0z" />
      <path d="M26.2 21.4c2.4-2.3 5.6-2.3 8 0-2.4 2.3-5.6 2.3-8 0z" />
      {/* Ağız hattı ve üç şerit */}
      <path d="M18.4 33.5c3.4 1.8 7.8 1.8 11.2 0" />
      <path d="M17.6 11.2 24 8l6.4 3.2" />
      <path d="M14.6 28.2h5.2" />
      <path d="M28.2 28.2h5.2" />
    </svg>
  );
}
