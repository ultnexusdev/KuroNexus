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

/**
 * Ebedi Mangekyō (Sasuke) — KANONİK desen.
 *
 * Kaynak: Wikimedia Commons "Mangekyou_Sharingan_Sasuke_(Eternal).svg"
 * (ShounenSuki / Narutopedia, CC BY-SA 3.0 — atıf künyede). Kaynak dosya
 * `<use xlink:href>` ile tekrar ediyor; burada geometri satır içine
 * alındı: aynı kimlikleri sayfada onlarca kez çoğaltmamak için üç kol
 * doğrudan `rotate` ile çizilir.
 */
const EMS_PETAL =
  "M200,150 C 200,215 170,275 150,295 C 130,275 100,215 100,150 C 100,85 130,25 150,5 C 170,25 200,85 200,150 z";
const EMS_HOOK =
  "M 275,77.5 C 260,40 200,0 150,5 C 170,30 183.4,55.1 190,80 C 215,75 244.2,71.7 275,77.5 z";
const EMS_SPINE =
  "M 150,258.7 C 141,244 131.5,195.8 128.6,162.4 L 150,150 171.4,162.4 C 168.5,195.8 159,244 150,258.7 z";

function EternalBlades() {
  return (
    <g transform="scale(0.333333)">
      {[0, 120, -120].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 150 150)`}>
          <path
            d={EMS_PETAL}
            fill="none"
            stroke="var(--ita-pupil)"
            strokeWidth="5"
          />
          <path d={EMS_HOOK} fill="var(--ita-pupil)" />
          <path
            d={EMS_HOOK}
            transform="rotate(180 150 150)"
            fill="var(--ita-pupil)"
          />
          <path d={EMS_SPINE} fill="var(--ita-pupil)" />
        </g>
      ))}
      <circle cx="150" cy="150" r="20" fill="var(--ita-iris-edge)" />
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

/* (HeroEye kaldırıldı — hero'da gözlerin üstünde SVG katmanı yok;
   sahnedeki yüz kendi gözleriyle, üstünde yalnız ışık halesi var.) */
