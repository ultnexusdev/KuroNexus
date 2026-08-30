import { getTranslations } from "next-intl/server";
import { FINGERS, FINGER_STATUS_LABEL } from "@/lib/anime/jjk/fingers";
import { pick } from "@/lib/anime/jjk/types";
import { FingerVault, type FingerView } from "./FingerVault";
import shared from "./jjk.module.css";
import styles from "./FingersSection.module.css";

/**
 * P09 · SUKUNA'NIN 20 PARMAĞI (両面宿儺の指) — açılan arşiv.
 *
 * Yirmi karo; dokunmak dosyayı açar. Açılan dosyalar ziyaretçiye özel
 * `localStorage`ta tutulur (kullanıcı kararı) — "RECORDS OPENED 07/20"
 * sayacı ziyaretler arasında korunur ve arşivi açma hissi gerçek olur.
 */
export async function FingersSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.jjk.fingers" });

  const fingers: FingerView[] = FINGERS.map((finger) => ({
    n: finger.n,
    title: pick(finger.title, locale),
    place: pick(finger.place, locale),
    holder: pick(finger.holder, locale),
    arc: pick(finger.arc, locale),
    note: pick(finger.note, locale),
    status: finger.status,
    statusLabel: pick(FINGER_STATUS_LABEL[finger.status], locale),
  }));

  return (
    <section
      id="fingers"
      aria-labelledby="jjk-fingers-title"
      className={`${shared.section} ${shared.deferPaint}`}
      tabIndex={-1}
    >
      <span className={shared.ghost} aria-hidden="true" lang="ja">
        指
      </span>

      <div className={styles.inner}>
        <header>
          <p className={shared.headNo}>08</p>
          <h2 id="jjk-fingers-title" className={shared.head}>
            <span className={shared.headKanji} lang="ja">両面宿儺の指</span>
            <span className={shared.headLatin}>{t("latin")}</span>
          </h2>
          <p className={shared.lede}>{t("lede")}</p>
        </header>

        <FingerVault
          fingers={fingers}
          labels={{
            counter: t("counter"),
            reset: t("reset"),
            gridAria: t("gridAria"),
            place: t("place"),
            holder: t("holder"),
            arc: t("arc"),
            status: t("status"),
          }}
        />
      </div>
    </section>
  );
}
