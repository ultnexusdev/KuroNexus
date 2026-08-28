import { getTranslations } from "next-intl/server";
import { TEAMS } from "@/lib/anime/slam-dunk/teams";
import { pick } from "@/lib/anime/slam-dunk/types";
import { CourtImage } from "./CourtImage";
import { QuarterHeader } from "./QuarterHeader";
import court from "./court.module.css";
import styles from "./BuzzerSection.module.css";

/**
 * 4. ÇEYREK · SON DÜDÜK — sayfanın kapanışı.
 *
 * ── NEDEN AYRI BİR BÖLÜM ─────────────────────────────────────────────────
 * Sannoh'nun kadrosu devre arasındaki seçicide zaten var. Burada tekrar
 * edilmiyor; bu bölümün konusu KADRO DEĞİL, tek bir sayı: 79-78. Üç yıllık
 * ulusal şampiyonun, adı duyulmamış bir Kanagawa takımına bir sayı farkla
 * yenildiği maç.
 *
 * Sayfanın tezi burada kapanıyor ve o yüzden bölüm bilerek SEYREK: tek
 * kadraj, tek skor, üç cümle. Bleach'te öğrenilen ders — her bölümü
 * doldurmaya çalışmak, kapanışı da bir liste hâline getiriyor.
 */
export async function BuzzerSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "slamDunk" });
  const sannoh = TEAMS.sannoh;

  return (
    <section
      id="buzzer"
      data-quarter
      className={`${court.section} ${styles.section}`}
      aria-labelledby="buzzer-title"
      data-team="shohoku"
    >
      <div className={styles.shotWrap}>
        <CourtImage
          slotId="slam-dunk:buzzer"
          className={styles.shot}
          sizes="1600px"
          fill
          decorative
        />
        <span className={styles.shotFade} aria-hidden />
      </div>

      <div className={styles.content}>
        <QuarterHeader
          quarter={t("quarters.q4")}
          title={t("sections.buzzer.title")}
          lede={t("sections.buzzer.lede")}
          titleId="buzzer-title"
        />

        {/* DEV SKOR — bölümün tek görsel olayı. `aria-hidden` DEĞİL:
            sayı bilginin kendisi ve okunmalı. Anlamını yanındaki
            künye satırı veriyor. */}
        <p className={styles.final}>
          <span className={`${court.numeral} ${styles.finalScore}`}>
            {sannoh.clash?.score}
          </span>
          <span className={styles.finalMeta}>
            <span className={styles.finalTeams}>
              {TEAMS.shohoku.name} — {sannoh.name}
            </span>
            <span className={styles.finalStage}>
              {pick(sannoh.clash?.stage ?? { tr: "" }, locale)}
            </span>
          </span>
        </p>

        <p className={`${court.body} ${styles.epilogue}`}>
          {t("sections.buzzer.epilogue")}
        </p>
      </div>
    </section>
  );
}
