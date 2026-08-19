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

/**
 * Itachi'nin Mangekyō'su — KANONİK desen.
 *
 * Elle çizilmiş yaklaşıklık değil: Wikimedia Commons'taki
 * "Mangekyou_Sharingan_Itachi.svg" dosyasının yol verisi birebir alındı
 * (kullanıcı isteği, 19 Ağustos 2026). Kaynak 300×300 kutuda çizilmiş,
 * burada 100×100 kutuya ölçekleniyor — üç kollu çark tek kapalı yol.
 *
 * ⚠️ Eser: ShounenSuki (Narutopedia), CC BY-SA 3.0. Atıf zorunlu ve
 * sayfada görünür durumda (Gözler bölümünün künye satırı). Yol verisi
 * değiştirilirse atıf da korunmalı.
 */
function ItachiBlades() {
  return (
    <g transform="scale(0.333333)">
      <path
        d="M 177.6,10.7 C 135,68.4 155.4,100.7 179.8,118.5 C 260.9,160.6 274.8,214.5 255.9,244.9 C 237.3,191.9 198,172.4 158.5,194.9 C 86.9,238.6 40.7,231.2 15.7,196.6 C 58.2,203.1 109.1,193.5 107.9,128.3 C 109.5,97.6 111.5,16.6 177.6,10.7 z"
        fill="var(--ita-pupil)"
      />
      {/* Merkezdeki kızıl göz bebeği — kaynakta desenin üstünde duruyor */}
      <circle cx="150" cy="150" r="20" fill="var(--ita-iris-edge)" />
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
 * İris gradyanının TEK tanımı.
 *
 * Sayfa kökünde bir kez çizilir; bütün gözler `url(#…)` ile buna bakar.
 * Her SVG'ye kendi `<defs>`ini koymak aynı kimliği sayfada onlarca kez
 * çoğaltırdı (geçersiz HTML). Tanım bulunamazsa `fill` yedeği düz iris
 * rengine düşer — göz her hâlükârda kızıl çizilir.
 */
export const IRIS_GRADIENT_ID = "ita-iris-grad";

export function SharinganDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden
      focusable="false"
      style={{ position: "absolute" }}
    >
      <defs>
        <radialGradient id={IRIS_GRADIENT_ID}>
          <stop offset="0" stopColor="var(--ita-iris-deep)" />
          <stop offset="0.5" stopColor="var(--ita-iris)" />
          <stop offset="1" stopColor="var(--ita-iris-edge)" />
        </radialGradient>
      </defs>
    </svg>
  );
}

const IRIS_FILL = `url(#${IRIS_GRADIENT_ID}) var(--ita-iris)`;

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
    /* Ölçüler kaynak dosyanın 300'lük kutusundan birebir: iris r=145,
       kontur 10 → 100'lük kutuda 48.33 ve 3.33. Süsleme YOK (dekoratif
       iç halka ve camsı parlama kaldırıldı — kullanıcı "birebir aynısı"
       dedi, 19 Ağustos 2026). */
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <circle cx="50" cy="50" r="48.33" fill={IRIS_FILL} />
      <circle
        cx="50"
        cy="50"
        r="48.33"
        fill="none"
        stroke="var(--ita-ring)"
        strokeWidth="3.33"
      />
      <g className={spinClassName}>
        <EyeContent glyph={glyph} />
      </g>
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
          <circle cx="50" cy="50" r="34" fill={IRIS_FILL} />
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
