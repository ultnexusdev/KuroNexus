import type { EyeGlyph } from "@/lib/characters/itachi-experience";

/**
 * Sharingan göz glifleri — saf SVG, sunucuda çizilir (AkatsukiGlyphs'in
 * kardeşi). Renkler token'dan (kural 16): iris `--ita-iris`, desen
 * `--ita-pupil`, halka `--ita-ring`. Tomoe/Mangekyō dönüşü CSS'te
 * (`.spin` sınıfını kapsayan modül verir; reduced-motion battaniyesi
 * durdurur).
 *
 * Desenler stilize edilmiş geometri — kanonik işaretlerin okunur
 * sadeleştirmeleri: tomoe = virgül, Itachi MS = üç kanatlı çark,
 * Shisui MS = dört kanatlı şuriken, Obito MS = üç kancalı girdap,
 * EMS = altı taçyapraklı yıldız.
 */

/** Tek tomoe — merkez çevresinde döndürülerek çoğaltılır. */
function Tomoe({ angle }: { angle: number }) {
  return (
    <g transform={`rotate(${angle} 50 50)`}>
      <g transform="translate(50 29)">
        <circle r="6.2" fill="var(--ita-pupil)" />
        <path
          d="M 6.1 -1.2 C 5.2 6.4 -0.8 9.6 -7.4 7.2 C -2.4 5.6 0.6 2.4 0.4 -2.6 Z"
          fill="var(--ita-pupil)"
        />
      </g>
    </g>
  );
}

/** Itachi'nin Mangekyō'su — üç kavisli kanatlı çark. */
function ItachiBlades() {
  return (
    <g>
      {[0, 120, 240].map((angle) => (
        <path
          key={angle}
          transform={`rotate(${angle} 50 50)`}
          d="M 50 50 C 42 40 44 24 58 18 C 50 30 56 40 66 42 C 60 50 54 52 50 50 Z"
          fill="var(--ita-pupil)"
        />
      ))}
      <circle cx="50" cy="50" r="9" fill="var(--ita-pupil)" />
    </g>
  );
}

/** Shisui'nin Mangekyō'su — dört kanatlı şuriken. */
function ShisuiBlades() {
  return (
    <g>
      {[0, 90, 180, 270].map((angle) => (
        <path
          key={angle}
          transform={`rotate(${angle} 50 50)`}
          d="M 50 50 L 41 33 C 46 24 58 23 64 30 C 55 32 50 39 50 50 Z"
          fill="var(--ita-pupil)"
        />
      ))}
      <circle cx="50" cy="50" r="8" fill="var(--ita-pupil)" />
    </g>
  );
}

/** Obito'nun Mangekyō'su (Kamui) — üç kancalı girdap. */
function ObitoBlades() {
  return (
    <g>
      {[0, 120, 240].map((angle) => (
        <path
          key={angle}
          transform={`rotate(${angle} 50 50)`}
          d="M 50 50 C 38 46 32 34 38 22 C 40 32 46 38 58 38 C 66 38 70 44 68 50 C 62 46 54 46 50 50 Z"
          fill="none"
          stroke="var(--ita-pupil)"
          strokeWidth="7"
          strokeLinecap="round"
        />
      ))}
      <circle cx="50" cy="50" r="7" fill="var(--ita-pupil)" />
    </g>
  );
}

/** Ebedi Mangekyō — altı taçyapraklı yıldız (Sasuke deseni sadeleştirmesi). */
function EternalBlades() {
  return (
    <g>
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <path
          key={angle}
          transform={`rotate(${angle} 50 50)`}
          d="M 50 50 L 44 26 C 47 20 53 20 56 26 Z"
          fill="var(--ita-pupil)"
        />
      ))}
      <circle cx="50" cy="50" r="10" fill="var(--ita-pupil)" />
      <circle cx="50" cy="50" r="15" fill="none" stroke="var(--ita-pupil)" strokeWidth="2.5" />
    </g>
  );
}

function EyeContent({ glyph }: { glyph: EyeGlyph }) {
  switch (glyph) {
    case "tomoe1":
      return <Tomoe angle={0} />;
    case "tomoe2":
      return (
        <>
          <Tomoe angle={0} />
          <Tomoe angle={180} />
        </>
      );
    case "tomoe3":
      return (
        <>
          <Tomoe angle={0} />
          <Tomoe angle={120} />
          <Tomoe angle={240} />
        </>
      );
    case "mangekyoItachi":
      return <ItachiBlades />;
    case "mangekyoSasuke":
    case "eternal":
      return <EternalBlades />;
    case "mangekyoShisui":
      return <ShisuiBlades />;
    case "mangekyoObito":
      return <ObitoBlades />;
    case "rinneganLike":
      return (
        <g>
          {[10, 20, 30, 40].map((r) => (
            <circle
              key={r}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="var(--ita-pupil)"
              strokeWidth="1.6"
            />
          ))}
          <circle cx="50" cy="50" r="4" fill="var(--ita-pupil)" />
        </g>
      );
  }
}

/**
 * Dairesel göz — iris + desen. `spinClassName` desen grubuna verilir;
 * dönme animasyonu çağıranın CSS modülünde yaşar.
 */
export function SharinganDisc({
  glyph,
  className,
  spinClassName,
  title,
}: {
  glyph: EyeGlyph;
  className?: string;
  spinClassName?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <circle cx="50" cy="50" r="48" fill="var(--ita-iris)" />
      <circle cx="50" cy="50" r="48" fill="none" stroke="var(--ita-ring)" strokeWidth="3" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="var(--ita-ring)" strokeWidth="1.4" opacity="0.55" />
      <g className={spinClassName}>
        <EyeContent glyph={glyph} />
      </g>
      {/* Camsı parlama — sol üstte küçük ışık */}
      <circle cx="36" cy="32" r="7" fill="var(--ita-shine)" opacity="0.5" />
    </svg>
  );
}

/**
 * Badem göz — hero'daki yüzün üstüne oturan katman. Kapak (sclera) yok:
 * yalnızca iris diski + göz kapağı hattı; alttaki resmin gözüyle hizalanır.
 */
export function HeroEye({
  glyph,
  className,
  spinClassName,
}: {
  glyph: EyeGlyph | null;
  className?: string;
  spinClassName?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable="false"
    >
      {glyph ? (
        <>
          <circle cx="50" cy="50" r="34" fill="var(--ita-iris)" />
          <g className={spinClassName}>
            <g transform="translate(0 0) scale(0.68) translate(23.5 23.5)">
              <EyeContent glyph={glyph} />
            </g>
          </g>
          <circle cx="50" cy="50" r="34" fill="none" stroke="var(--ita-ring)" strokeWidth="2.4" />
        </>
      ) : null}
    </svg>
  );
}
