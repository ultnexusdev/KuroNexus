import type { VesselMode } from "@/lib/characters/sukuna-itadori-experience";

/**
 * Kap sayfasının grafik seti — hepsi elle çizilmiş, saf SVG, SUNUCUDA çizilir.
 *
 * Dışarıdan tek bir raster görsel alınmadı (BRIEF kural 3): Jujutsu Kaisen
 * görsellerinin lisansı doğrulanamıyor ve CSP dış kaynağı zaten engelliyor.
 * Buradaki her yol elle yazıldı; hiçbiri bir eserin kopyası değil, kanonik
 * işaretlerin okunur sadeleştirmeleri.
 *
 * Renkler token'dan geliyor. Bazı biçimler token'ı doğrudan değil, çağıran
 * CSS modülünün yerel takma adları üzerinden okuyor (`--vsl-fg-*`) — böylece
 * aynı glif "yutulmuş / yutulmamış / seçili" hâllerinde farklı çiziliyor ve
 * her hâl için ayrı bir SVG yazmak gerekmiyor (Itachi'deki `--era-tint`
 * deseninin kardeşi).
 */

/**
 * Kimlik mührü — mod düğmesinin ve künye sütunlarının işareti.
 *
 * Itadori: tek göz, tek dikiş. Sukuna: iki göz (dört gözün okunur hâli),
 * çift dikiş ve halkanın dışında dört kolu işaret eden dört kısa çentik.
 */
export function VesselSigil({
  mode,
  className,
}: {
  mode: VesselMode;
  className?: string;
}) {
  const stroke = mode === "sukuna" ? "var(--vsl-curse)" : "var(--vsl-human)";
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
        r="27"
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        opacity="0.75"
      />
      {mode === "sukuna" ? (
        <>
          {/* dört kol — halkanın dışına taşan çentikler */}
          {[38, 142, 218, 322].map((angle) => (
            <line
              key={angle}
              x1="32"
              y1="32"
              x2="32"
              y2="2"
              stroke={stroke}
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${angle} 32 32)`}
              opacity="0.55"
              /* yalnızca halkanın dışındaki uç görünsün */
              strokeDasharray="6 24"
            />
          ))}
          {/* üst göz */}
          <path
            d="M 17 26 Q 32 17 47 26 Q 32 34 17 26 Z"
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="26" r="3.4" fill={stroke} />
          {/* alt göz — Sukuna'nın ikinci yüzü */}
          <path
            d="M 20 41 Q 32 34 44 41 Q 32 47 20 41 Z"
            fill="none"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinejoin="round"
            opacity="0.85"
          />
          <circle cx="32" cy="41" r="2.6" fill={stroke} opacity="0.85" />
          {/* iki yüzü ayıran dikiş */}
          <line
            x1="32"
            y1="7"
            x2="32"
            y2="57"
            stroke={stroke}
            strokeWidth="1"
            opacity="0.35"
            strokeDasharray="2 4"
          />
        </>
      ) : (
        <>
          <path
            d="M 16 32 Q 32 22 48 32 Q 32 42 16 32 Z"
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="32" r="3.8" fill={stroke} />
          <line
            x1="32"
            y1="7"
            x2="32"
            y2="20"
            stroke={stroke}
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.5"
          />
          <line
            x1="32"
            y1="44"
            x2="32"
            y2="57"
            stroke={stroke}
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.5"
          />
        </>
      )}
    </svg>
  );
}

/**
 * Sukuna'nın yüz işaretleri — hero portresinin ÜSTÜNE binen katman.
 *
 * Kadraj kararı bilinçli: işaretler yüze "yapıştırılmış bir çıkartma" gibi
 * hizalanmaya çalışmıyor (portre kaynağı değişince o hizalama her seferinde
 * kayardı). Bunun yerine bantlar kutunun bir kenarından diğerine geçiyor —
 * lanetin kabı baştan sona işaretlemesi. Göz hizasında ikişer paralel çizgi,
 * burun köprüsünde kısa bir çift, çenede tek bir hat.
 *
 * `drawClassName` çizgilere veriliyor: `pathLength="1"` sayesinde CSS tek bir
 * `stroke-dashoffset` animasyonuyla işaretleri "çizdiriyor".
 */
export function VesselFaceMarks({
  className,
  drawClassName,
}: {
  className?: string;
  drawClassName?: string;
}) {
  const marks = [
    /* sol göz — ikili */
    "M 4 50 Q 24 45.5 45 49",
    "M 5 57 Q 25 52.5 45 56",
    /* sağ göz — ikili */
    "M 55 49 Q 76 45.5 96 50",
    "M 55 56 Q 75 52.5 95 57",
    /* burun köprüsü */
    "M 39 68 Q 50 65.5 61 68",
    /* çene hattı */
    "M 27 87 Q 50 82.5 73 87",
  ];
  return (
    <svg
      viewBox="0 0 100 140"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable="false"
    >
      {/* alt katman: lanetin halesi — işaretlerin çevresine sızan kızıl */}
      <g opacity="0.55">
        {marks.map((d) => (
          <path
            key={`glow-${d}`}
            className={drawClassName}
            d={d}
            pathLength="1"
            fill="none"
            stroke="var(--vsl-curse)"
            strokeWidth="4.6"
            strokeLinecap="round"
          />
        ))}
      </g>
      {/* üst katman: işaretin kendisi */}
      {marks.map((d) => (
        <path
          key={d}
          className={drawClassName}
          d={d}
          pathLength="1"
          fill="none"
          stroke="var(--vsl-mark)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

/**
 * Mühürlü parmak — parmak sayacının birimi.
 *
 * Lanet nesnesi hâli: parmağın üstüne sarılmış bant ve bir mühür şeridi.
 * Renkler çağıranın yerel takma adlarından okunuyor, çünkü aynı glif rayda
 * üç ayrı durumda çiziliyor: yutulmuş, yutulmamış, imleç altında.
 */
export function FingerGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 48"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable="false"
    >
      {/* parmağın gövdesi */}
      <path
        d="M 12 3 C 16.8 3 19 7.6 19 13.4 L 19 35.5 C 19 41.4 16 44.6 12 44.6 C 8 44.6 5 41.4 5 35.5 L 5 13.4 C 5 7.6 7.2 3 12 3 Z"
        fill="var(--vsl-fg-skin)"
        stroke="var(--vsl-fg-line)"
        strokeWidth="1"
      />
      {/* tırnak */}
      <path
        d="M 8.6 8.4 Q 12 5.8 15.4 8.4 Q 12 11.6 8.6 8.4 Z"
        fill="var(--vsl-fg-line)"
        opacity="0.6"
      />
      {/* sarım bantları */}
      {[18.5, 25.5, 32.5].map((y) => (
        <rect
          key={y}
          x="3.4"
          y={y}
          width="17.2"
          height="3.6"
          rx="1.8"
          fill="var(--vsl-fg-wrap)"
        />
      ))}
      {/* mühür şeridi — hafif eğik, ucunda tek işaret */}
      <g transform="rotate(-7 12 28)">
        <rect
          x="2"
          y="26.4"
          width="20"
          height="6.4"
          rx="0.8"
          fill="var(--vsl-fg-seal)"
        />
        <line
          x1="6"
          y1="29.6"
          x2="18"
          y2="29.6"
          stroke="var(--vsl-fg-line)"
          strokeWidth="0.9"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}

/**
 * Tapınak mührü — Malevolent Shrine kartının işareti.
 * Basık bir çatı, iki direk ve çatının altında kesişen iki kesik.
 */
export function ShrineSigil({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable="false"
    >
      <g
        fill="none"
        stroke="var(--vsl-shrine)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 4 25 L 32 8 L 60 25" />
        <path d="M 9 30 L 55 30" />
        <path d="M 18 30 L 18 55" />
        <path d="M 46 30 L 46 55" />
        <path d="M 11 57 L 53 57" />
      </g>
      {/* içerideki iki kesik — Kesiş ve Yarma */}
      <g stroke="var(--vsl-curse)" strokeWidth="1.8" strokeLinecap="round">
        <line x1="23" y1="36" x2="41" y2="51" />
        <line x1="41" y1="36" x2="23" y2="51" />
      </g>
    </svg>
  );
}

/**
 * Kesik işareti — bölüm dikişinin düğüm noktası ve kader çizelgesinin
 * madde imi. Üç eşit olmayan çizgi: bir el savrulmuş gibi.
 */
export function CleaveMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable="false"
    >
      <g
        stroke="var(--vsl-cleave)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      >
        <line x1="6" y1="19" x2="18" y2="4" />
        <line x1="11" y1="21" x2="21" y2="8.5" />
        <line x1="2.5" y1="16" x2="10" y2="6.5" />
      </g>
    </svg>
  );
}
