import { getTranslations } from "next-intl/server";
import { teamRoster } from "@/lib/anime/slam-dunk/roster";
import { teamSlotId } from "@/lib/anime/slam-dunk/slots";
import { TEAMS } from "@/lib/anime/slam-dunk/teams";
import { pick } from "@/lib/anime/slam-dunk/types";
import { CourtImage } from "./CourtImage";
import { QuarterHeader } from "./QuarterHeader";
import { RosterGrid } from "./RosterGrid";
import court from "./court.module.css";
import styles from "./TeamSection.module.css";

/**
 * 2. ÇEYREK · SHOHOKU — tam kadro.
 *
 * ── NEDEN İLK BEŞ BURADA DA VAR ──────────────────────────────────────────
 * Hero'daki beş kart bir SPOT, bu ızgara bir KADRO LİSTESİ. Beşini
 * çıkarmak, `#shohoku` bağlantısıyla gelen kişiye eksik bir takım
 * göstermek olurdu — forma numaraları 4'ten 15'e kesintisiz akmalı.
 * Tekrarın bedeli beş küçük kart; karşılığı bölümün kendi kendine
 * yetmesi.
 *
 * ⚠️ Koç, menajer ve ikinci menajer BURADA DEĞİL. Onlar kenar bölümünde
 * (3. çeyrek), beş takımın kenarı bir arada — sayfanın tezi orada
 * "maçı sahadaki beş kişi kazanmıyor".
 */
export async function ShohokuSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "slamDunk" });
  const team = TEAMS.shohoku;
  const players = teamRoster("shohoku").filter(
    (member) => member.role === "player",
  );

  return (
    <section
      id="shohoku"
      data-quarter
      className={`${court.section} ${styles.section}`}
      aria-labelledby="shohoku-title"
      data-team="shohoku"
    >
      {/* Takım bandı: başlığın arkasında, duotone. Kadraj yoksa saha
          çizgisi yedeği geliyor ve bölüm görselsiz de ayakta duruyor. */}
      <div className={styles.band} aria-hidden>
        <CourtImage
          slotId={teamSlotId("shohoku")}
          className={styles.bandShot}
          sizes="1600px"
          fill
          decorative
        />
        <span className={styles.bandFade} />
      </div>

      <QuarterHeader
        quarter={t("quarters.q2")}
        title={t("sections.shohoku.title")}
        lede={t("sections.shohoku.lede", { count: players.length })}
        titleId="shohoku-title"
        score={{
          line: TEAMS.shoyo.clash?.score ?? "",
          caption: `${TEAMS.shoyo.name} · ${pick(
            TEAMS.shoyo.clash?.stage ?? { tr: "" },
            locale,
          )}`,
          won: TEAMS.shoyo.clash?.shohokuWon ?? false,
        }}
      />

      <p className={`${court.body} ${styles.blurb}`}>{pick(team.blurb, locale)}</p>

      <RosterGrid
        members={players}
        locale={locale}
        label={t("sections.shohoku.title")}
      />
    </section>
  );
}
