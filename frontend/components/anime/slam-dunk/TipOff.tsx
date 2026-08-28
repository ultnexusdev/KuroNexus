import { getTranslations } from "next-intl/server";
import { teamStarters } from "@/lib/anime/slam-dunk/roster";
import { TEAMS } from "@/lib/anime/slam-dunk/teams";
import { pick } from "@/lib/anime/slam-dunk/types";
import { CourtImage } from "./CourtImage";
import { PlayerCard } from "./PlayerCard";
import { ReactiveCourt } from "./ReactiveCourt";
import court from "./court.module.css";
import styles from "./TipOff.module.css";

/**
 * 1. ÇEYREK · HAVA ATIŞI — sayfanın açılışı.
 *
 * ── SAHNE ────────────────────────────────────────────────────────────────
 * Üç katman üst üste: en altta imleçle yanan kuş bakışı saha, ortada
 * küratörün açılış kadrajı, üstte SHOHOKU yazısı ve ilk beş.
 *
 * ── İLK BEŞ NEDEN BURADA ─────────────────────────────────────────────────
 * Referans tasarımda beş kart açılış ekranında duruyor ve doğru yer orası:
 * sayfaya gelen kişi önce "kim bunlar" sorusunun cevabını görüyor, kadro
 * listesini sonra. Tam kadro bir sonraki çeyrekte.
 *
 * ⚠️ Beş kart `stage` boyunda ve her birinin kendi hover efekti var
 * (`PlayerCard` → `data-fx`). Efektler ızgara kartlarına verilmedi: kırk
 * kartta aynı anda dönen efekt hem pil hem dikkat yer.
 */
export async function TipOff({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "slamDunk" });
  const starters = teamStarters("shohoku");
  const shohoku = TEAMS.shohoku;

  return (
    <section
      id="tipoff"
      data-quarter
      className={`${court.section} ${styles.hero}`}
      aria-labelledby="tipoff-title"
      data-team="shohoku"
    >
      {/* ── ZEMİN ────────────────────────────────────────────────
          Saha imleci dinliyor; kadraj onun üstünde, karartma en üstte.
          Üçü de dekoratif ve okuma sırasında yok. */}
      <div className={styles.stageBg} aria-hidden>
        <ReactiveCourt className={styles.courtLayer} />
        <CourtImage
          slotId="slam-dunk:hero"
          className={styles.heroShot}
          sizes="1920px"
          fill
          decorative
        />
        <span className={styles.vignette} />
      </div>

      <header className={styles.intro}>
        <p className={court.eyebrow}>
          {shohoku.prefecture} · {t("quarters.q1")}
        </p>

        <h1 id="tipoff-title" className={styles.title}>
          {/* Okul adı Latin harfle ve kanjiyle iki kez: biri okunuyor,
              öteki sahnenin kendisi. Kanji ÇEVRİLMİYOR. */}
          <span className={`${court.display} ${court.neon} ${styles.wordmark}`}>
            {shohoku.name}
          </span>
          <span className={`${court.kanji} ${styles.wordmarkKanji}`} lang="ja">
            {shohoku.kanji}
          </span>
        </h1>

        <p className={styles.tagline}>{t("tagline")}</p>
        <p className={`${court.body} ${styles.lede}`}>
          {pick(shohoku.blurb, locale)}
        </p>

        <p className={styles.standing}>
          <span className={styles.standingKey}>{t("standing")}</span>
          <span className={styles.standingValue}>
            {pick(shohoku.standing, locale)}
          </span>
        </p>
      </header>

      {/* ── İLK BEŞ ──────────────────────────────────────────────
          Yatay kayan şerit: mobilde beş kart alt alta dizilmiyor,
          parmakla kaydırılıyor — sahne hissi dar ekranda da duruyor. */}
      <ul className={styles.five} aria-label={t("startingFive")}>
        {starters.map((member) => (
          <li key={member.id} className={styles.fiveItem}>
            <PlayerCard member={member} locale={locale} size="stage" />
          </li>
        ))}
      </ul>
    </section>
  );
}
