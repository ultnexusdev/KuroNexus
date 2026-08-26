import { pick } from "@/lib/characters/types";
import type { LocalizedText } from "@/lib/characters/types";
import { GOJO_EGGS, GOJO_S11 } from "@/lib/characters/satoru-gojou-experience";
import { DiscoveryLog } from "./DiscoveryLog";
import styles from "./GojoExperience.module.css";

/**
 * P11 · KEŞİF KAYDI bölümü.
 *
 * Boş-uzay estetiğinde bir pano: ilk bakışta neredeyse boş, buldukça
 * doluyor. Bulunmayanlar ipucu vermiyor.
 *
 * ⚠️ GERÇEK KEŞİFLER BU BÖLÜMDE DEĞİL. Sayfanın tamamına dağılmış
 * durumdalar (S/D/P kısayolları, hero'daki işaret, Konami kodu ve üç
 * mikro obje). Burası yalnızca kayıt — brief'in kendi düzeltmesi.
 */
export function EggsSection({ locale }: { locale: string }) {
  const say = (text: LocalizedText) => pick(text, locale);

  const eggs = GOJO_EGGS.map((egg) => ({
    key: egg.key,
    name: say(egg.name),
    how: say(egg.how),
    note: say(egg.note),
  }));

  return (
    <div className={styles.eggs}>
      <div className={styles.eggsInner}>
        <h2 className={styles.eggsTitle} id="gojo-eggs-title">
          {say(GOJO_S11.title)}
        </h2>
        <p className={styles.eggsLede}>{say(GOJO_S11.lede)}</p>

        <DiscoveryLog
          eggs={eggs}
          lockedLabel={say(GOJO_S11.locked)}
          counterLabel={say(GOJO_S11.counter)}
          completeLabel={say(GOJO_S11.complete)}
          resetLabel={say(GOJO_S11.reset)}
        />
      </div>
    </div>
  );
}
