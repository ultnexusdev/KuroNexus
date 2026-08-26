import { pick } from "@/lib/characters/types";
import type { LocalizedText } from "@/lib/characters/types";
import {
  GOJO_CURATOR,
  GOJO_ID,
  GOJO_S03,
  GOJO_S03_SLOT,
} from "@/lib/characters/satoru-gojou-experience";
import { CuratedImage } from "./CuratedImage";
import { LimitlessEffects } from "./LimitlessEffects";
import { LimitlessGrid } from "./LimitlessGrid";
import styles from "./GojoExperience.module.css";

/**
 * P03 · LIMITLESS — Zeno tüneli.
 *
 * Izgara halkaları merkeze kalan mesafeyi her adımda yarıya bölerek
 * yaklaşıyor ve ASLA girmiyor (`LimitlessGrid`). Metin ızgarası 3×3 ve
 * ORTA HÜCRE hiç doldurulmuyor — orada yalnızca Gojō'nun eli var.
 *
 * ── DAĞITILMIŞ METNİN DÜZ KARŞILIĞI ──────────────────────────────────────
 * BRIEF · erişilebilirlik: "Gövde metni grid kutucuklarına dağıtılmış —
 * `sr-only` düz metin karşılığı ZORUNLU." Kutucuklar `aria-hidden`;
 * hemen üstlerinde aynı anlatının tek parça hâli `sr-only` duruyor. Yani
 * ekran okuyucu yedi kopuk parça değil bir paragraf duyuyor.
 *
 * ── SCROLL KİLİDİ ────────────────────────────────────────────────────────
 * `LimitlessEffects` ayrı bir parçada (`ssr: false`). Kilit sırasında
 * beliren cümlenin okunabilir karşılığı da bu iskelette `sr-only`:
 * kilit hiç çalışmasa bile (dokunmatik, reduced-motion, ikinci ziyaret)
 * hiçbir bilgi kaybolmuyor.
 */
export function LimitlessSection({
  locale,
  isAdmin,
  src,
}: {
  locale: string;
  isAdmin: boolean;
  src: string | null;
}) {
  const say = (text: LocalizedText) => pick(text, locale);

  return (
    <div className={styles.limitless} data-gojo-limitless>
      <div className={styles.limitlessStage}>
        <LimitlessGrid />

        <h2 className={styles.limitlessTitle} id="gojo-limitless-title">
          {say(GOJO_S03.title)}
        </h2>

        {/* Dağıtılmış metnin tek parça karşılığı + kilit cümlesi.
            Görsel katmanın tamamı silinse bile bölüm burada tam. */}
        <p className={styles.srOnly}>
          {say(GOJO_S03.srText)} {say(GOJO_S03.lockLine)}
        </p>

        {/* ⚠️ `aria-hidden` LİSTEDE DEĞİL, HÜCRELERDE. Liste komple
            gizlenseydi ortadaki görsel yuvası da ekran okuyucudan
            düşerdi — oysa gizlenmesi gereken tek şey metnin PARÇALANMIŞ
            hâli; tam hâli hemen yukarıda `sr-only` olarak duruyor. */}
        <ul className={styles.limitlessCells}>
          {/* ORTA HÜCRE. Izgarada açıkça (2,2)'ye yerleştiriliyor ki
              kutucuk metinleri onun ETRAFINA otomatik dağılsın ve
              merkeze hiçbir metin düşmesin. */}
          <li className={styles.limitlessCore}>
            <div className={styles.limitlessHand}>
              <CuratedImage
                slotId={GOJO_S03_SLOT.key}
                spec={say(GOJO_S03_SLOT.spec)}
                aspect={GOJO_S03_SLOT.aspect}
                src={src}
                alt={say(GOJO_S03_SLOT.alt)}
                isAdmin={isAdmin}
                characterId={GOJO_ID}
                curatorLabel={say(GOJO_CURATOR.upload)}
                statusLabel={say(GOJO_CURATOR.missing)}
                glyph="∞"
                sizes="288px"
              />
            </div>
          </li>

          {GOJO_S03.cells.map((cell) => (
            <li className={styles.limitlessCell} key={cell.en} aria-hidden="true">
              {say(cell)}
            </li>
          ))}
        </ul>

        <p className={styles.limitlessSubtitle}>{say(GOJO_S03.subtitle)}</p>
      </div>

      <LimitlessEffects
        line={say(GOJO_S03.lockLine)}
        escapeHint={say(GOJO_S03.lockEscape)}
      />
    </div>
  );
}
