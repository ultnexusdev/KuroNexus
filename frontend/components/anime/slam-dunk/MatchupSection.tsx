import { getTranslations } from "next-intl/server";
import { teamRoster } from "@/lib/anime/slam-dunk/roster";
import { teamSlotId } from "@/lib/anime/slam-dunk/slots";
import { RIVAL_ORDER, TEAMS } from "@/lib/anime/slam-dunk/teams";
import { pick, type TeamId } from "@/lib/anime/slam-dunk/types";
import { CourtImage, CourtSlotPen } from "./CourtImage";
import { MatchupSelector, type MatchupTab } from "./MatchupSelector";
import { QuarterHeader } from "./QuarterHeader";
import { RosterGrid } from "./RosterGrid";
import court from "./court.module.css";
import styles from "./MatchupSection.module.css";
import team from "./TeamSection.module.css";

/**
 * DEVRE ARASI · RAKİPLER — sahanın ortasındaki seçici.
 *
 * ── YAPI ─────────────────────────────────────────────────────────────────
 * Dört rakibin paneli BURADA, sunucuda çiziliyor ve hazır JSX olarak
 * istemci adasına (`MatchupSelector`) geçiyor. Ada hangisinin görüneceğine
 * karar veriyor, içeriği hiç bilmiyor — sunucu bileşenini istemciye import
 * etmenin yasak olduğu yerde tek doğru desen bu.
 *
 * ── HER PANEL KENDİ PALETİNİ TAŞIYOR ─────────────────────────────────────
 * Panelin kökünde `data-team` var ve `court.module.css` o niteliği görünce
 * `--team-accent` / `--team-glow` değerlerini yeniden tanımlıyor. Yani
 * Ryonan seçilince kartlar, barlar, kenarlıklar ve parıltı hep birlikte
 * deniz mavisine dönüyor — hiçbir bileşen renk bilmiyor.
 */
export async function MatchupSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "slamDunk" });

  const tabs: MatchupTab[] = RIVAL_ORDER.map((id) => ({
    id,
    name: TEAMS[id].name,
    kanji: TEAMS[id].kanji,
    meta: pick(TEAMS[id].standing, locale),
  }));

  /* ⚠️ Panellerin sırası `tabs` ile AYNI olmak zorunda — ada ikisini
     indeksle eşliyor. İkisi de `RIVAL_ORDER`dan türediği için ayrışamaz. */
  const panels = await Promise.all(
    RIVAL_ORDER.map((id) => RivalPanel({ id, locale })),
  );

  return (
    <section
      id="matchup"
      data-quarter
      className={`${court.section} ${styles.section}`}
      aria-labelledby="matchup-title"
      data-team="neutral"
    >
      {/* Salon: seçicinin arkasında, çok sönük. Kadraj yoksa saha çizgisi
          yedeği geliyor ve bölüm görselsiz de ayakta duruyor. */}
      <div className={styles.gym} aria-hidden>
        <CourtImage
          slotId="slam-dunk:gym"
          className={styles.gymShot}
          sizes="1600px"
          fill
          decorative
          noEdit
        />
        <span className={styles.gymFade} />
      </div>

      {/* ⚠️ Kalem salonun DIŞINDA: `.gym` `pointer-events: none` +
          `z-index: -1` taşıyor, içine konan kalem tıklanamıyordu. */}
      <CourtSlotPen slotId="slam-dunk:gym" backdrop />

      <QuarterHeader
        quarter={t("quarters.half")}
        title={t("sections.matchup.title")}
        lede={t("sections.matchup.lede")}
        titleId="matchup-title"
      />

      <MatchupSelector tabs={tabs} panels={panels} />
    </section>
  );
}

/**
 * TEK RAKİBİN PANELİ.
 *
 * Bileşen olarak DEĞİL doğrudan çağrılıyor (`await RivalPanel(...)`): dört
 * paneli bir dizi hâlinde istemci adasına geçirmek gerekiyor ve JSX
 * elemanları `Promise` döndüremiyor. Sunucu bileşeni sonuçta bir async
 * fonksiyon; doğrudan çağırmak onu bir kez çizip sonucu vermekten başka bir
 * şey yapmıyor.
 */
async function RivalPanel({ id, locale }: { id: TeamId; locale: string }) {
  const t = await getTranslations({ locale, namespace: "slamDunk" });
  const record = TEAMS[id];
  const roster = teamRoster(id).filter((member) => member.role === "player");

  return (
    <div className={styles.panelBody} data-team={id}>
      <div className={team.band} aria-hidden>
        <CourtImage
          slotId={teamSlotId(id)}
          className={team.bandShot}
          sizes="1200px"
          fill
          decorative
          noEdit
        />
        <span className={team.bandFade} />
      </div>

      {/* Rakibin kendi bandının kalemi — bandın DIŞINDA, panelin sağ üstünde.
          Panel `position: relative`, yani kalem doğru rakibe asılıyor. */}
      <CourtSlotPen slotId={teamSlotId(id)} backdrop />

      <header className={styles.panelHead}>
        <h3 className={`${court.display} ${styles.panelTitle}`}>
          {record.school}
        </h3>
        <p className={styles.panelMeta}>
          <span lang="ja" className={court.kanji}>
            {record.kanji}
          </span>
          <span aria-hidden>·</span>
          <span>{record.prefecture}</span>
        </p>
        <p className={`${court.body} ${styles.panelBlurb}`}>
          {pick(record.blurb, locale)}
        </p>

        {record.clash ? (
          <p className={styles.clash} data-won={record.clash.shohokuWon ? "" : undefined}>
            <span className={styles.clashLabel}>{t("versus")}</span>
            <span className={`${court.numeral} ${styles.clashScore}`}>
              {record.clash.score}
            </span>
            <span className={styles.clashStage}>
              {pick(record.clash.stage, locale)}
            </span>
            <span className={styles.clashResult}>
              {record.clash.shohokuWon ? t("result.win") : t("result.loss")}
            </span>
          </p>
        ) : null}
      </header>

      <RosterGrid members={roster} locale={locale} label={record.school} />
    </div>
  );
}
