import { getTranslations } from "next-intl/server";
import { LOSSES, STORY_ARCS } from "@/lib/anime/jjk/finale";
import { pick } from "@/lib/anime/jjk/types";
import shared from "./jjk.module.css";
import styles from "./FinalArchive.module.css";

/**
 * P12 · SON KAYIT (最終記録) — yaylar ↔ kayıplar.
 *
 * Saf sunucu bölümü, sıfır JS: solda yedi yay, sağda yapışkan kayıplar
 * sicili. "Liste eksiktir" kapanışı tasarımın kendisi (kapsam kararı).
 */
export async function FinalArchive({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.jjk.finale" });

  return (
    <section
      id="finale"
      aria-labelledby="jjk-finale-title"
      className={shared.section}
      tabIndex={-1}
    >
      <span className={shared.ghost} aria-hidden="true" lang="ja">
        記録
      </span>

      <div className={styles.inner}>
        <header>
          <p className={shared.headNo}>11</p>
          <h2 id="jjk-finale-title" className={shared.head}>
            <span className={shared.headKanji} lang="ja">最終記録</span>
            <span className={shared.headLatin}>{t("latin")}</span>
          </h2>
          <p className={shared.lede}>{t("lede")}</p>
        </header>

        <div className={styles.split}>
          <ol className={styles.arcs}>
            {STORY_ARCS.map((arc, i) => (
              <li key={arc.jp} className={styles.arc}>
                <span className={styles.arcNo}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className={styles.arcBody}>
                  <h3 className={styles.arcName}>{pick(arc.name, locale)}</h3>
                  <p className={styles.arcJp} lang="ja">
                    {arc.jp}
                  </p>
                  <p className={styles.arcText}>{pick(arc.body, locale)}</p>
                </div>
              </li>
            ))}
          </ol>

          <aside className={styles.losses} aria-labelledby="jjk-losses-title">
            <h3 id="jjk-losses-title" className={styles.lossesTitle}>
              {t("lossesTitle")}
            </h3>
            <ul className={styles.lossList}>
              {LOSSES.map((loss) => (
                <li key={loss.name} className={styles.loss}>
                  <span className={styles.lossName}>{loss.name}</span>
                  <span className={styles.lossWhere}>{pick(loss.where, locale)}</span>
                </li>
              ))}
            </ul>
            <p className={styles.lossNote}>{t("lossesNote")}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
