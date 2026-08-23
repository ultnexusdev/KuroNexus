import styles from "./MaskFragment.module.css";

/**
 * MASKE PARÇASI — on Espada, on ayrı kalıntı.
 *
 * ── NEDEN ON AYRI ÇİZİM ──────────────────────────────────────────────────
 * P07'nin son karesi şunu söylüyordu: kalan parça hâlâ kimin ne olduğunu
 * söyler. O cümle ancak parçalar GERÇEKTEN farklıysa doğru olur. Canon her
 * biri için ayrı bir yer ve biçim yazıyor — Starrk'ın boynundaki dişli
 * çene, Baraggan'ın beş uçlu tacı, Szayelaporro'nun gözlüğü — ve on kez
 * aynı maskeyi çizmek bu bölümün tezini boşa çıkarırdı.
 *
 * ── HEPSİ `currentColor` ─────────────────────────────────────────────────
 * ⚠️ Kural 16. Parça, üzerine bindiği numaranın rengini alıyor; hover'da
 * bölüm o Espada'nın cero rengine boyandığında parça da onunla dönüyor.
 * Tek bir renk değeri yazılı değil.
 *
 * ⚠️ Hepsi `aria-hidden`: anlatıyı kaydın metni taşıyor.
 */

/** 8 dişli alt çene — Yammy'nin çenesinde duran kalıntı */
const JAW_CHIN =
  "M14 44c0 30 20 52 46 52s46-22 46-52l-10 0c0 26-16 42-36 42S24 70 24 44Z" +
  "M30 50h8v14h-8ZM42 52h8v16h-8ZM54 54h8v18h-8ZM66 54h8v18h-8ZM78 52h8v16h-8ZM90 50h8v14h-8Z";

/** Dişli alt çene, boyun boyunca yatık — Starrk */
const JAW_NECK =
  "M8 62c14 22 40 34 66 30l38-6-3-11-37 6C50 84 28 74 17 56Z" +
  "M24 66l6 12 8-6ZM40 74l5 13 9-7ZM58 80l4 13 9-8ZM76 82l3 13 9-8Z";

/** Beş uçlu taç — Baraggan */
const CROWN =
  "M18 86h84l6-56-22 22-16-38-16 38-22-22Z" +
  "M30 60l8 8 4-12ZM90 60l-8 8-4-12Z";

/** Ağzı ve yanakları örten bant — Harribel */
const MOUTH_GUARD =
  "M16 46c0 28 18 50 44 50s44-22 44-50l-12 4c0 22-14 36-32 36S28 72 28 50Z" +
  "M34 58l8 16 8-14 8 16 8-14 8 16 8-14";

/** Kırık boynuzlu miğfer, sol üst — Ulquiorra */
const HELM =
  "M22 78C14 40 30 14 60 8l14 6-10 20-8-6-12 16 6 12-14 10 4 14Z" +
  "M52 14 26 -8l30 20Z";

/** Göz bandı ve altındaki küçük çene halkası — Nnoitra */
const EYEPATCH =
  "M10 32h96l-8 56H18Z" +
  "M32 48a28 28 0 1 0 56 0a28 28 0 1 0-56 0" +
  "M46 44l6 10 6-10 6 10 6-10";

/** Sağ çene kemiği — Grimmjow */
const JAW_RIGHT =
  "M96 20c10 30 6 58-14 76l-8-9c16-15 19-38 11-63Z" +
  "M84 34l-12 4 8 9ZM90 54l-13 2 6 10ZM88 74l-13-1 4 11Z";

/** Kemik dikenlerden bir ibik — Zommari */
const SPINE_CREST =
  "M12 92 24 34l10 44 10-56 12 58 10-52 12 50 10-38 12 52Z" +
  "M18 100a7 7 0 1 0 14 0a7 7 0 1 0-14 0" +
  "M90 100a7 7 0 1 0 14 0a7 7 0 1 0-14 0";

/** Dikdörtgen çerçeveli gözlük — Szayelaporro */
const GLASSES =
  "M4 44h48v34H4Zm10 10v14h28V54Z" +
  "M68 44h48v34H68Zm10 10v14h28V54Z" +
  "M52 56h16v8H52Z";

/** Sekiz delikli uzun maske — Aaroniero */
const CAPSULE =
  "M40 6h40l10 50-10 62H40L30 56Z" +
  "M46 26h10v10H46ZM64 26h10v10H64ZM46 48h10v10H46ZM64 48h10v10H64Z" +
  "M46 70h10v10H46ZM64 70h10v10H64ZM46 92h10v10H46ZM64 92h10v10H64Z";

/**
 * ⚠️ DIŞA AÇIK. P11'in maske duvarı Ulquiorra ve Grimmjow için bu
 * yolları AYNEN kullanıyor: aynı kalıntı iki bölümde iki farklı biçimde
 * çizilseydi "kalan parça kimin ne olduğunu söyler" cümlesi bozulurdu.
 */
export const FRAGMENTS: Record<string, string> = {
  "jaw-chin": JAW_CHIN,
  "jaw-neck": JAW_NECK,
  crown: CROWN,
  "mouth-guard": MOUTH_GUARD,
  helm: HELM,
  eyepatch: EYEPATCH,
  "jaw-right": JAW_RIGHT,
  "spine-crest": SPINE_CREST,
  glasses: GLASSES,
  capsule: CAPSULE,
};

export function MaskFragment({
  shape,
  className,
}: {
  shape: string;
  className?: string;
}) {
  const d = FRAGMENTS[shape];
  if (!d) return null;
  return (
    <svg
      className={[styles.fragment, className].filter(Boolean).join(" ")}
      viewBox="0 0 120 120"
      aria-hidden="true"
      role="presentation"
    >
      <path d={d} fillRule="evenodd" />
    </svg>
  );
}
