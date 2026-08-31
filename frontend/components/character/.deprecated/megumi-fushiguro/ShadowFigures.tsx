import type { MegumiFigure } from "./data";

/**
 * Megumi Fushiguro sayfasının elle çizilmiş SVG siluetleri.
 *
 * ⚠️ DIŞARIDAN RASTER İNDİRİLMEDİ (BRIEF: lisans doğrulanamaz, CSP zaten
 * engelliyor). On gölgenin hepsi burada, yoldan yola çiziliyor.
 *
 * Çizim dili bilinçli olarak GÖLGE OYUNU: her figür tek renkli, dolu bir
 * gövde ve dışına taşan hiçbir ayrıntı yok. Renk yazılmıyor — dolgu
 * çağıranın verdiği sınıftan (yani CSS modülündeki token'dan) geliyor.
 * Hepsi dekoratif → `aria-hidden`; anlam listedeki metinlerde.
 *
 * Sunucu bileşenleri: durum yok, olay yok. `"use client"` olmadığı için
 * istemci adaları da bunları çağırabiliyor.
 */

/** Bütün siluetler aynı taban çizgisine (y = 96) oturuyor. */
const VIEW_BOX = "0 0 160 100";

const PATHS: Record<MegumiFigure, string[]> = {
  /* Dört ayak, çekik gövde, dikilmiş kulaklar — koku alan hayvan */
  dog: [
    "M14 96 L20 72 L28 62 L46 56 L74 54 L96 58 L112 50 L118 34 L126 40 L134 30 L138 44 L132 56 L136 70 L130 96 L120 96 L120 74 L104 78 L96 96 L86 96 L88 76 L62 76 L54 96 L44 96 L48 74 L32 68 L26 96 Z",
  ],
  /* Yayvan gövde, öne çıkan dil */
  toad: [
    "M8 96 C10 74 26 56 52 52 C78 48 106 56 122 70 C134 80 140 88 142 96 Z",
    "M58 60 C68 44 92 40 108 30 L118 24 L120 30 L106 40 C92 50 78 58 66 62 Z",
  ],
  /* Kıvrımlı uzun gövde, açık ağız */
  serpent: [
    "M4 96 C18 92 22 76 14 64 C6 52 12 38 28 34 C46 30 60 42 58 56 C56 68 44 70 40 62 C48 62 50 54 44 48 C36 40 24 46 26 58 C28 74 48 80 68 74 C96 66 108 44 138 40 L156 38 L150 48 L134 52 C110 58 100 78 74 88 C56 94 40 96 32 96 Z",
  ],
  /* Ağır gövde, sütun bacaklar, kalkık hortum */
  elephant: [
    "M10 96 L12 62 C12 44 30 32 58 32 L94 32 C118 32 132 44 132 62 L134 96 L120 96 L118 70 L98 70 L96 96 L84 96 L84 70 L58 70 L56 96 L44 96 L44 68 L26 66 L24 96 Z",
    "M120 40 C136 34 148 22 152 8 L158 12 C154 30 142 44 124 52 Z",
  ],
  /* Küçük gövde, iki uzun kulak */
  rabbit: [
    "M40 96 C40 78 50 66 66 64 C82 62 96 70 98 84 L100 96 Z",
    "M62 66 L56 30 L64 28 L72 62 Z",
    "M78 66 L84 30 L92 32 L86 64 Z",
  ],
  /* Geniş kanat açıklığı, kısa gövde, uzun kuyruk */
  nue: [
    "M78 96 C68 88 66 76 72 66 C78 56 92 54 98 62 C104 70 100 82 92 88 Z",
    "M72 68 C50 56 26 50 4 52 C24 40 52 40 76 54 Z",
    "M98 66 C120 52 146 48 158 52 C138 40 112 42 94 54 Z",
    "M90 88 C104 92 122 92 138 84 C126 96 106 100 88 96 Z",
  ],
  /* Alçak baş, geniş omuz, öne dönük boynuzlar */
  ox: [
    "M12 96 L18 68 C22 54 38 46 62 46 L96 46 C116 46 128 56 130 70 L134 96 L122 96 L118 72 L100 74 L98 96 L86 96 L88 74 L58 74 L54 96 L42 96 L46 70 L28 68 L24 96 Z",
    "M124 50 C136 44 142 32 140 20 L148 24 C150 40 142 54 128 58 Z",
    "M120 46 C122 34 118 24 108 18 L114 12 C128 20 134 34 130 50 Z",
  ],
  /* İnce bacaklar, halka biçiminde boynuz */
  deer: [
    "M28 96 L34 70 C38 56 52 48 72 48 L96 48 C112 48 122 56 124 68 L128 96 L120 96 L116 72 L102 74 L100 96 L92 96 L94 74 L64 74 L60 96 L52 96 L56 70 L42 68 L38 96 Z",
    "M112 52 L124 30 L134 34 L122 54 Z",
    "M128 34 A16 16 0 1 0 128 33.9 Z M128 40 A10 10 0 1 1 128 39.9 Z",
  ],
  /* Çark: sekiz dilimli halka, gövde yok — henüz doğrulmamış olanın işareti */
  wheel: [
    "M80 8 A44 44 0 1 0 80 7.9 Z M80 24 A28 28 0 1 1 80 23.9 Z",
    "M76 4 L84 4 L84 96 L76 96 Z",
    "M36 46 L124 46 L124 54 L36 54 Z",
    "M46 14 L52 8 L118 92 L112 98 Z",
    "M112 8 L118 14 L52 98 L46 92 Z",
  ],
};

/**
 * Bir shikigami silueti.
 *
 * `variant` doğrudan veri dosyasındaki `figure` alanı. İki köpek AYNI
 * silueti paylaşıyor — çünkü fark renkte değil, kayıtta: biri kırılmış.
 */
export function ShikigamiSilhouette({
  variant,
  className,
  bodyClassName,
}: {
  variant: MegumiFigure;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox={VIEW_BOX}
      role="presentation"
      aria-hidden
      focusable="false"
    >
      {PATHS[variant].map((d) => (
        <path key={d.slice(0, 24)} className={bodyClassName} d={d} fillRule="evenodd" />
      ))}
    </svg>
  );
}

/**
 * El işareti — Megumi'nin iki elini birleştirdiği şekil.
 *
 * Mod düğmesinin glifi. `deep` açıkken parmaklar arasındaki boşluk
 * doluyor: gölge uzadıkça işaretin içi kararıyor.
 */
export function HandSign({
  className,
  strokeClassName,
  fillClassName,
  deep = false,
}: {
  className?: string;
  strokeClassName?: string;
  fillClassName?: string;
  deep?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 40"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      {deep ? (
        <path className={fillClassName} d="M24 8 L38 22 L24 36 L10 22 Z" />
      ) : null}
      <path
        className={strokeClassName}
        d="M24 4 L42 22 L24 38 L6 22 Z"
        fill="none"
        strokeWidth="1.6"
      />
      <path
        className={strokeClassName}
        d="M24 4 L24 38 M6 22 L42 22"
        fill="none"
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
  );
}

/**
 * Kırık işareti — kırılmış gölgenin satırındaki çentik.
 *
 * Renkle değil ŞEKİLLE anlatıyor: kesik bir çizgi ve arasında bir boşluk.
 * (Tek gösterge renk olmasın kuralı.)
 */
export function BreakMark({
  className,
  lineClassName,
}: {
  className?: string;
  lineClassName?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      <path
        className={lineClassName}
        d="M3 12 L9 12 M11 6 L13 18 M15 12 L21 12"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
