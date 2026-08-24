/**
 * Konohamaru sayfasının elle çizilmiş SVG seti.
 *
 * Kural (BRIEF §3.4): dışarıdan raster görsel indirilmez, hotlink edilmez.
 * Sayfadaki bütün dekoratif grafik burada, saf SVG olarak duruyor —
 * emsal `components/character/itachi/SharinganEyes.tsx`. Renkler yalnızca
 * token'dan geliyor (`--knh-*`), bu dosyada da tek hex yok.
 *
 * Hareket CSS'te: bileşenler yalnızca `className` alıp geometriyi çiziyor,
 * neyin yandığını `data-*` nitelikleri söylüyor. Böylece modülün sonundaki
 * reduced-motion battaniyesi hepsini tek yerden durdurabiliyor.
 *
 * ⚠️ Bu dosyada "use client" YOK ama `TorchChain` (istemci adası) onu
 * çağırıyor — düz JSX olduğu için istemci paketine giriyor, ek bağımlılık
 * getirmiyor. Atkı ve yapraklar sunucu tarafında çiziliyor.
 */

/* ── Hero: uzun mavi atkı ────────────────────────────────────────────────
   İki şerit: kalın gövde ve onun altından çıkan ince kuyruk. Kadrajın
   sağından çıkıp sayfadan sarkıyor — kırpma işini CSS yapıyor (.page'de
   overflow-x: clip). preserveAspectRatio "none" DEĞİL: şerit gerilirse
   kumaş kıvrımları düzleşiyor, bu yüzden dilim (slice) kullanıldı. */

export function ScarfBand({
  className,
  bandClassName,
  tailClassName,
}: {
  className?: string;
  bandClassName?: string;
  tailClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 220"
      fill="none"
      preserveAspectRatio="xMinYMid slice"
      aria-hidden
      focusable="false"
    >
      {/* Gövde: boyundan çıkar, iki kıvrım yapar, sağ kenardan taşar */}
      <path
        className={bandClassName}
        d="M0 74 C 96 26 188 128 300 100 C 412 72 508 150 640 104 L 640 152 C 508 198 412 120 300 148 C 188 176 96 74 0 122 Z"
        fill="var(--knh-scarf)"
      />
      {/* Üst kenarın ışığı — kumaşın katlandığı yer */}
      <path
        className={bandClassName}
        d="M0 74 C 96 26 188 128 300 100 C 412 72 508 150 640 104"
        stroke="var(--knh-sky)"
        strokeOpacity="0.55"
        strokeWidth="2"
        fill="none"
      />
      {/* Uçtaki saçaklar: şeridin bittiği yerden sarkan üç iplik */}
      <g
        className={tailClassName}
        stroke="var(--knh-scarf)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M614 140 C 622 162 616 182 624 200" />
        <path d="M628 132 C 638 156 630 176 640 196" />
        <path d="M600 146 C 606 166 598 180 604 198" />
      </g>
    </svg>
  );
}

/* ── Hero: düşen yapraklar ───────────────────────────────────────────────
   Tek yaprak biçimi, sekiz kez farklı ölçek ve gecikmeyle. Konumlar ve
   gecikmeler SABİT (rastgele değil): sunucu ve istemci aynı ağacı çizmeli,
   yoksa hidrasyon uyuşmazlığı olur. */

const LEAVES = [
  { left: "6%", scale: 1, delay: "0s" },
  { left: "17%", scale: 0.7, delay: "-9s" },
  { left: "29%", scale: 1.15, delay: "-4s" },
  { left: "41%", scale: 0.62, delay: "-14s" },
  { left: "56%", scale: 0.9, delay: "-6s" },
  { left: "68%", scale: 1.25, delay: "-17s" },
  { left: "79%", scale: 0.75, delay: "-2s" },
  { left: "91%", scale: 1, delay: "-11s" },
];

export function LeafFall({
  className,
  leafClassName,
}: {
  className?: string;
  leafClassName?: string;
}) {
  return (
    <span className={className} aria-hidden>
      {LEAVES.map((leaf, index) => (
        <span
          key={leaf.left}
          className={leafClassName}
          data-leaf={index % 4}
          style={{
            left: leaf.left,
            scale: String(leaf.scale),
            animationDelay: leaf.delay,
          }}
        >
          <LeafGlyph />
        </span>
      ))}
    </span>
  );
}

/** Tek yaprak — sivri uçlu, orta damarlı. */
export function LeafGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 26"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M12 1 C 19 6 23 13 12 25 C 1 13 5 6 12 1 Z"
        fill="var(--knh-leafFall)"
        stroke="var(--accent-muted)"
        strokeWidth="0.8"
      />
      <path
        d="M12 4 L 12 23"
        stroke="var(--accent-muted)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Mod düğmesinin gliffi: meşale ──────────────────────────────────────── */

export function TorchGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {/* Sap */}
      <path d="M14.6 30 L17.4 30 L16.7 18 L15.3 18 Z" fill="var(--border-strong)" />
      {/* Bilezik */}
      <rect x="12.4" y="15.4" width="7.2" height="3.2" rx="0.8" fill="var(--gold)" />
      {/* Alev */}
      <path
        d="M16 2 C 21 8 23.6 11 22.6 15.2 C 21.8 18.6 19 20 16 20 C 13 20 10.2 18.6 9.4 15.2 C 8.4 11 11 8 16 2 Z"
        fill="var(--knh-flame)"
      />
      <path
        d="M16 8.6 C 18.4 12 19.6 13.4 19.1 15.4 C 18.7 17 17.4 17.8 16 17.8 C 14.6 17.8 13.3 17 12.9 15.4 C 12.4 13.4 13.6 12 16 8.6 Z"
        fill="var(--gold)"
      />
    </svg>
  );
}

/* ── Zincir: meşale halkası ──────────────────────────────────────────────
   Portre halkanın ALTINDA duruyor (CSS), bu SVG onun üstüne biniyor:
   iki eşmerkezli çember, aralarında on iki radyal çentik (halat örgüsü)
   ve tepede bir alev dili. Alev yalnızca ateşin geldiği halkada görünür —
   opaklığı CSS'te `data-lit` ile açılıyor. */

const RING_R_OUTER = 54;
const RING_R_INNER = 49.5;
const NOTCHES = Array.from({ length: 12 }, (_, index) => (index * 360) / 12);

function notchPoints(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x1: 60 + cos * RING_R_INNER,
    y1: 60 + sin * RING_R_INNER,
    x2: 60 + cos * RING_R_OUTER,
    y2: 60 + sin * RING_R_OUTER,
  };
}

export function TorchRing({
  className,
  ringClassName,
  flameClassName,
  empty,
}: {
  className?: string;
  ringClassName?: string;
  flameClassName?: string;
  /** Boş halka: kesikli çember, çentik yok, alev yok */
  empty?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <g className={ringClassName}>
        <circle
          cx="60"
          cy="60"
          r={RING_R_OUTER}
          stroke="var(--border-strong)"
          strokeWidth="1.6"
          strokeDasharray={empty ? "5 7" : undefined}
        />
        {empty ? null : (
          <>
            <circle
              cx="60"
              cy="60"
              r={RING_R_INNER}
              stroke="var(--border-strong)"
              strokeWidth="1.2"
            />
            <g stroke="var(--border-strong)" strokeWidth="1.2" strokeLinecap="round">
              {NOTCHES.map((angle) => {
                const point = notchPoints(angle);
                return (
                  <line
                    key={angle}
                    x1={point.x1}
                    y1={point.y1}
                    x2={point.x2}
                    y2={point.y2}
                  />
                );
              })}
            </g>
          </>
        )}
      </g>

      {empty ? null : (
        <g className={flameClassName}>
          <path
            d="M60 1 C 67 10 71.5 14 70.5 20.5 C 69.6 26.4 65.2 29.5 60 29.5 C 54.8 29.5 50.4 26.4 49.5 20.5 C 48.5 14 53 10 60 1 Z"
            fill="var(--knh-flame)"
          />
          <path
            d="M60 10 C 63.6 15 65.6 17 65.1 20.4 C 64.6 23.5 62.4 25 60 25 C 57.6 25 55.4 23.5 54.9 20.4 C 54.4 17 56.4 15 60 10 Z"
            fill="var(--gold)"
          />
        </g>
      )}
    </svg>
  );
}

/* ── Zincir: halkalar arası halat ────────────────────────────────────────
   İki bükümlü iplik + üstlerinde tek bir ateş çizgisi. Ateş çizgisi
   AŞAĞIDAN yukarı çiziliyor (`pathLength=1` + dashoffset): zincir aşağıdan
   yukarı okunduğu için alev de aşağıdan yukarı tırmanıyor. Sayfanın tek
   yazılmış anı bu.

   preserveAspectRatio="none": halat boşluğu doldurmak için geriliyor;
   çizgi kalınlığı `vectorEffect` ile sabit kalıyor. */

const CORD_A = "M10 100 C 4 82 16 66 10 50 C 4 34 16 18 10 0";
const CORD_B = "M10 100 C 16 82 4 66 10 50 C 16 34 4 18 10 0";

export function TorchCord({
  className,
  strandClassName,
  fireClassName,
  lit,
}: {
  className?: string;
  strandClassName?: string;
  fireClassName?: string;
  lit?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 100"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <g
        className={strandClassName}
        stroke="var(--border-strong)"
        strokeWidth="1.6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        fill="none"
      >
        <path d={CORD_A} vectorEffect="non-scaling-stroke" />
        <path d={CORD_B} vectorEffect="non-scaling-stroke" />
      </g>
      {/* Ateş: halatın bir ipliğini takip eder */}
      <path
        className={fireClassName}
        data-on={lit ? "true" : undefined}
        d={CORD_A}
        pathLength={1}
        stroke="var(--knh-flame)"
        strokeWidth="2.6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        fill="none"
      />
    </svg>
  );
}

/* ── Devir çizgisi: "kimden kaldığı" satırının ucundaki kıvılcım ────────── */

export function HandoverMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 12"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M0 6 L28 6"
        stroke="var(--border-strong)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M33 0.6 C 36.4 4 38 5.6 37.4 8 C 36.9 10 35.2 11.2 33 11.2 C 30.8 11.2 29.1 10 28.6 8 C 28 5.6 29.6 4 33 0.6 Z"
        fill="var(--knh-flame)"
      />
    </svg>
  );
}
