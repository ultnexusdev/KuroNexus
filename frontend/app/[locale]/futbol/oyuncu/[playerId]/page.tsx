import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/lib/i18n/navigation";
import { fetchFootballPlayer } from "@/lib/api/football";
import type { FootballPlayerDetail } from "@/lib/api/types";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

async function getPlayer(id: string): Promise<FootballPlayerDetail | null> {
  try {
    return await fetchFootballPlayer(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ playerId: string }>;
}): Promise<Metadata> {
  const { playerId } = await params;
  const detail = await getPlayer(playerId);
  return { title: detail?.player?.name ?? "KuroNexus" };
}

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ locale: string; playerId: string }>;
}) {
  const { locale, playerId } = await params;
  const t = await getTranslations({ locale, namespace: "futbol" });
  const detail = await getPlayer(playerId);

  if (!detail || !detail.player) {
    notFound();
  }
  const { player, statistics, season } = detail;

  // Çekirdek toplamlar tüm turnuvaların toplamı; detay paneli en çok
  // süre alınan turnuvadan gelir (etiketiyle birlikte — dürüst gösterim)
  const totals = statistics.reduce(
    (acc, s) => ({
      apps: acc.apps + (s.appearances ?? 0),
      goals: acc.goals + (s.goals ?? 0),
      assists: acc.assists + (s.assists ?? 0),
      minutes: acc.minutes + (s.minutes ?? 0),
      yellow: acc.yellow + (s.cardsYellow ?? 0),
      red: acc.red + (s.cardsRed ?? 0),
    }),
    { apps: 0, goals: 0, assists: 0, minutes: 0, yellow: 0, red: 0 },
  );
  const primary =
    statistics.length > 0
      ? statistics.reduce((a, b) => (b.minutes > a.minutes ? b : a))
      : null;
  const accuracy = primary?.passAccuracy ?? null;

  return (
    <div data-category="spor" className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.floodlight} aria-hidden />
        <div className={styles.heroInner}>
          <Link href="/dark-stories/galatasaray" className={styles.back}>
            ← {t("backToTeam")}
          </Link>
          <div className={styles.identity}>
            {player.photo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={player.photo} alt="" className={styles.photo} />
            ) : null}
            <div>
              <span className={styles.eyebrow}>
                {t("seasonLabel", { season })}
              </span>
              <h1 className={styles.name}>{player.name}</h1>
              <ul className={styles.chips}>
                {primary?.position ? <li>{primary.position}</li> : null}
                {player.nationality ? <li>{player.nationality}</li> : null}
                {player.age ? <li>{t("age", { age: player.age })}</li> : null}
                {player.height ? <li>{player.height} cm</li> : null}
                {player.weight ? <li>{player.weight} kg</li> : null}
              </ul>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.body}>
        {statistics.length === 0 ? (
          <p className={styles.empty}>{t("noStats", { season })}</p>
        ) : (
          <>
            {/* Sezon çekirdek istatistikleri */}
            <section>
              <h2 className={styles.sectionLabel}>{t("seasonStats")}</h2>
              <ul className={styles.tiles}>
                <li className={styles.tile}>
                  <b>{totals.apps}</b>
                  <span>{t("apps")}</span>
                </li>
                <li className={styles.tile}>
                  <b>{totals.goals}</b>
                  <span>{t("goals")}</span>
                </li>
                <li className={styles.tile}>
                  <b>{totals.assists}</b>
                  <span>{t("assists")}</span>
                </li>
                <li className={styles.tile}>
                  <b>{totals.minutes.toLocaleString(locale)}</b>
                  <span>{t("minutes")}</span>
                </li>
              </ul>
            </section>

            {/* Detaylı performans — birincil turnuva */}
            {primary ? (
              <section>
                <h2 className={styles.sectionLabel}>
                  {t("performance")}
                  <span className={styles.sectionNote}>
                    {primary.team} · {primary.league}
                  </span>
                </h2>
                <div className={styles.perfGrid}>
                  {primary.rating ? (
                    <div className={styles.perfCard}>
                      <span className={styles.perfLabel}>{t("rating")}</span>
                      <b className={styles.perfValue}>
                        {Number(primary.rating).toFixed(2)}
                      </b>
                      <span className={styles.meter} aria-hidden>
                        <span
                          className={styles.meterFill}
                          style={{
                            width: `${Math.min(100, (Number(primary.rating) / 10) * 100)}%`,
                          }}
                        />
                      </span>
                    </div>
                  ) : null}
                  {accuracy !== null ? (
                    <div className={styles.perfCard}>
                      <span className={styles.perfLabel}>
                        {t("passAccuracy")}
                      </span>
                      <b className={styles.perfValue}>%{accuracy}</b>
                      <span className={styles.meter} aria-hidden>
                        <span
                          className={styles.meterFill}
                          style={{ width: `${Math.min(100, accuracy)}%` }}
                        />
                      </span>
                    </div>
                  ) : null}
                  {primary.passesTotal !== null ? (
                    <div className={styles.perfCard}>
                      <span className={styles.perfLabel}>{t("passes")}</span>
                      <b className={styles.perfValue}>
                        {primary.passesTotal.toLocaleString(locale)}
                      </b>
                      {primary.passesKey !== null ? (
                        <span className={styles.perfSub}>
                          {t("keyPasses", { count: primary.passesKey })}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                  {primary.shotsTotal !== null ? (
                    <div className={styles.perfCard}>
                      <span className={styles.perfLabel}>{t("shots")}</span>
                      <b className={styles.perfValue}>{primary.shotsTotal}</b>
                      {primary.shotsOn !== null ? (
                        <span className={styles.perfSub}>
                          {t("shotsOn", { count: primary.shotsOn })}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                  {primary.saves !== null ? (
                    <div className={styles.perfCard}>
                      <span className={styles.perfLabel}>{t("saves")}</span>
                      <b className={styles.perfValue}>{primary.saves}</b>
                      {primary.conceded !== null ? (
                        <span className={styles.perfSub}>
                          {t("conceded", { count: primary.conceded })}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                  <div className={styles.perfCard}>
                    <span className={styles.perfLabel}>{t("cards")}</span>
                    <span className={styles.cardsRow}>
                      <b className={`${styles.cardChip} ${styles.yellow}`}>
                        {totals.yellow}
                      </b>
                      <b className={`${styles.cardChip} ${styles.red}`}>
                        {totals.red}
                      </b>
                    </span>
                  </div>
                </div>
              </section>
            ) : null}

            {/* Turnuva dökümü */}
            <section>
              <h2 className={styles.sectionLabel}>{t("byCompetition")}</h2>
              <ul className={styles.compList}>
                {statistics
                  .filter((s) => (s.appearances ?? 0) > 0 || s.minutes > 0)
                  .map((s, i) => (
                    <li key={i} className={styles.compRow}>
                      <span className={styles.compName}>
                        {s.league ?? "—"}
                        <span className={styles.compTeam}>{s.team}</span>
                      </span>
                      <span className={styles.compStat}>
                        {s.appearances} {t("apps")}
                      </span>
                      <span className={styles.compStat}>
                        {s.goals} {t("goals")}
                      </span>
                      <span className={styles.compStat}>
                        {s.assists} {t("assists")}
                      </span>
                      <span className={styles.compStat}>
                        {s.minutes.toLocaleString(locale)}&#8217;
                      </span>
                    </li>
                  ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
