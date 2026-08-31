/**
 * Ochako Uraraka — elle çizilmiş SVG motifleri.
 *
 * ⚠️ Bu dosya bir İSTEMCİ ADASI DEĞİL: durumu yok, olay dinlemiyor, hiçbir
 * hook çağırmıyor. Sunucuda çizilip HTML olarak iniyor. Sayfanın istemci
 * bütçesi (en fazla 3 ada) `GravityShell` ve `ReleaseField` ile dolu.
 *
 * ── NEDEN ELLE ÇİZİLİYOR ─────────────────────────────────────────────────
 * Faz 2 §3: dışarıdan raster indirme/hotlink yok. Motif gerekiyorsa SVG
 * elle çizilir. Buradaki üç motif de dekoratif — hepsi `aria-hidden` ve
 * hiçbiri anlam taşımıyor; metnin yerini tutmuyorlar.
 *
 * ── FİLİGRAN: PARMAK UCU PEDİ (brief §Filigran) ──────────────────────────
 * Uraraka'nın Quirk'ü parmak uçlarındaki BEŞ pedle çalışıyor. `PadMark`
 * tek bir pedi çiziyor: dış hat + içindeki eş merkezli sırt yayları.
 * `index` (0–4) yayların kaymasını değiştiriyor, yani beş pedin hiçbiri
 * ötekinin birebir kopyası değil — sayfada her bölümün köşesinde bir
 * tanesi duruyor ve beşi sayfa boyunca sırayla geçiyor.
 */

/** Bir parmak ucu pedi. `index` 0–4: beş pedin her biri ayrı sırt deseni. */
export function PadMark({
  index = 0,
  className,
}: {
  index?: number;
  className?: string;
}) {
  /* Sırt yayları: yarıçap ve kayma indeksle değişiyor — beş ayrı iz. */
  const shift = (index % 5) * 2.1;
  const ridges = [16, 23, 30, 37].map((r, i) => ({
    r,
    /* Yay açıklığı sırt sırt farklılaşsın diye tek/çift ayrımı */
    dash: 12 + i * 4 + shift,
    gap: 7 + ((i + index) % 3) * 3,
  }));

  return (
    <svg
      className={className}
      viewBox="0 0 100 120"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {/* Pedin dış hattı — yumurtamsı, üstü dar altı geniş */}
      <path
        d="M50 8 C70 8 84 26 84 52 C84 82 68 110 50 110 C32 110 16 82 16 52 C16 26 30 8 50 8 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {ridges.map((ridge) => (
        <ellipse
          key={ridge.r}
          cx="50"
          cy={54 + ridge.r * 0.16}
          rx={ridge.r * 0.72}
          ry={ridge.r}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeDasharray={`${ridge.dash} ${ridge.gap}`}
          strokeLinecap="round"
          opacity="0.72"
        />
      ))}
      {/* Merkez: dokunuşun geçtiği nokta */}
      <circle cx="50" cy="62" r="2.6" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

/**
 * Yer çizgisinin çapası.
 *
 * Sayfadaki her bölümün altında görünmez bir "yer" var (brief §Izgara).
 * Bu işaret o çizginin nerede olduğunu söylüyor: yerçekimi kapalıyken
 * kesik ve boşta, açıkken dolu ve dayanıklı. Ağırlığın kendisi değil,
 * ağırlığın DAYANDIĞI yüzey.
 */
export function GroundMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 18"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <path
        d="M0 12 H240"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Zemine inen kısa çentikler — elle çizilmiş, eşit aralıklı değil */}
      {[14, 46, 71, 108, 137, 166, 191, 226].map((x, i) => (
        <path
          key={x}
          d={`M${x} 12 L${x - 5 - (i % 3)} 17.5`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
      ))}
    </svg>
  );
}

/**
 * Düşüş izi — bir cismin yere inerken bıraktığı dikey çizgi demeti.
 *
 * Alanın arkasında duruyor ve yalnızca kartlar düşmüşken görünüyor
 * (görünürlüğü CSS'te, `[data-fallen="true"]` altında). Çizgilerin boyu
 * eşit değil: her cisim başka yükseklikten iniyor.
 */
export function FallTrace({ className }: { className?: string }) {
  const lines = [
    { x: 18, top: 6 },
    { x: 42, top: 30 },
    { x: 63, top: 14 },
    { x: 88, top: 44 },
    { x: 112, top: 22 },
    { x: 139, top: 52 },
    { x: 161, top: 10 },
    { x: 186, top: 36 },
  ];
  return (
    <svg
      className={className}
      viewBox="0 0 200 120"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      {lines.map((line) => (
        <path
          key={line.x}
          d={`M${line.x} ${line.top} L${line.x} 116`}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeDasharray="3 9"
          opacity="0.55"
        />
      ))}
    </svg>
  );
}
