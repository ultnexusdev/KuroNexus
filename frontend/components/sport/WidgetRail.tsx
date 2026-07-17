import { getTranslations } from "next-intl/server";
import { fetchNextMatch, fetchSuperLigStandings } from "@/lib/api/football";
import type {
  FootballSquadPlayer,
  NextMatch,
  SuperLigRow,
} from "@/lib/api/types";
import { NextMatchCountdown } from "./NextMatchCountdown";
import styles from "./WidgetRail.module.css";

const GS = "Galatasaray";

/** Sezon başlangıç yılı: Temmuz'dan itibaren yeni sezon sayılır (2025 = 2025/26). */
function currentSeason(now = new Date()) {
  return now.getUTCMonth() >= 6
    ? now.getUTCFullYear()
    : now.getUTCFullYear() - 1;
}

function seasonLabel(season: number) {
  return `${season}/${String((season + 1) % 100).padStart(2, "0")}`;
}

/** GS + üstündeki/altındaki komşular — tablo dolu değilse baştan keser. */
function gsNeighbours(table: SuperLigRow[]) {
  const i = table.findIndex((r) => r.teamName === GS);
  if (i === -1) return table.slice(0, 5);
  const start = Math.max(0, i - 2);
  return table.slice(start, start + 5);
}

async function getStandings() {
  try {
    return await fetchSuperLigStandings();
  } catch {
    return null;
  }
}

async function getNextMatch(): Promise<NextMatch | null> {
  try {
    const res = await fetchNextMatch();
    return res.match;
  } catch {
    return null;
  }
}

/**
 * GS salonunun sağ rafı: sonraki maç geri sayımı, Süper Lig puan durumu ve
 * kadro künyesi.
 *
 * Puan tablosu YALNIZCA içinde bulunduğumuz sezona aitse gösterilir. Veri
 * kaynağı (Apify actor) geçmiş bir sezonda takılı kalırsa widget bayat tabloyu
 * güncelmiş gibi sunmak yerine "sezon yaklaşıyor" durumuna düşer; kaynak güncel
 * sezonu vermeye başladığında kendiliğinden dolar.
 */
export async function WidgetRail({
  squad,
  locale,
}: {
  squad: FootballSquadPlayer[];
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "sport" });
  const [standings, nextMatch] = await Promise.all([
    getStandings(),
    getNextMatch(),
  ]);

  const season = currentSeason();
  const isCurrent = standings?.season === season;
  const table = isCurrent ? (standings?.table ?? []) : [];
  const tableLabels: TableLabels = {
    team: t("colTeam"),
    played: t("colPlayed"),
    goalDiff: t("colGoalDiff"),
    points: t("colPoints"),
  };

  const ages = squad
    .map((p) => p.age)
    .filter((a): a is number => typeof a === "number" && a > 0);
  const avgAge =
    ages.length > 0
      ? (ages.reduce((sum, a) => sum + a, 0) / ages.length).toFixed(1)
      : null;
  const byPosition = squad.reduce<Record<string, number>>((acc, p) => {
    const key = p.position?.trim();
    if (key) acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <aside className={styles.rail} aria-label={t("railLabel")}>
      {/* Sonraki maç */}
      <section className={styles.widget}>
        <h2 className={styles.widgetTitle}>{t("nextMatch")}</h2>
        {nextMatch ? (
          <>
            <p className={styles.fixture}>
              <span
                className={styles.team}
                data-gs={nextMatch.home === GS ? "true" : undefined}
              >
                {nextMatch.home}
              </span>
              <span className={styles.vs}>{t("vs")}</span>
              <span
                className={styles.team}
                data-gs={nextMatch.away === GS ? "true" : undefined}
              >
                {nextMatch.away}
              </span>
            </p>
            <p className={styles.fixtureMeta}>
              {nextMatch.league}
              {nextMatch.round ? ` · ${t("round")} ${nextMatch.round}` : ""}
            </p>
            <NextMatchCountdown
              match={nextMatch}
              labels={{
                days: t("cdDays"),
                hours: t("cdHours"),
                minutes: t("cdMinutes"),
                seconds: t("cdSeconds"),
              }}
            />
          </>
        ) : (
          <p className={styles.empty}>{t("nextMatchEmpty")}</p>
        )}
      </section>

      {/* Süper Lig puan durumu */}
      <section className={styles.widget}>
        <h2 className={styles.widgetTitle}>{t("leagueTable")}</h2>
        {table.length > 0 ? (
          <>
            <p className={styles.seasonTag}>{seasonLabel(season)}</p>
            <StandingsTable rows={gsNeighbours(table)} labels={tableLabels} />
            <details className={styles.more}>
              <summary className={styles.moreSummary}>
                {t("fullTable")}
              </summary>
              <StandingsTable rows={table} labels={tableLabels} />
            </details>
          </>
        ) : (
          <p className={styles.empty}>{t("tableEmpty")}</p>
        )}
      </section>

      {/* Kadro künyesi */}
      <section className={styles.widget}>
        <h2 className={styles.widgetTitle}>{t("dossier")}</h2>
        {squad.length > 0 ? (
          <dl className={styles.dossier}>
            <div className={styles.dossierRow}>
              <dt>{t("dossierSize")}</dt>
              <dd>{squad.length}</dd>
            </div>
            {avgAge ? (
              <div className={styles.dossierRow}>
                <dt>{t("dossierAvgAge")}</dt>
                <dd>{avgAge}</dd>
              </div>
            ) : null}
            {Object.entries(byPosition)
              .sort((a, b) => b[1] - a[1])
              .map(([pos, count]) => (
                <div key={pos} className={styles.dossierRow}>
                  <dt>{pos}</dt>
                  <dd>{count}</dd>
                </div>
              ))}
          </dl>
        ) : (
          <p className={styles.empty}>{t("squadEmpty")}</p>
        )}
      </section>
    </aside>
  );
}

interface TableLabels {
  team: string;
  played: string;
  goalDiff: string;
  points: string;
}

function StandingsTable({
  rows,
  labels,
}: {
  rows: SuperLigRow[];
  labels: TableLabels;
}) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col" className={styles.numCol}>
              #
            </th>
            <th scope="col">{labels.team}</th>
            <th scope="col" className={styles.numCol}>
              {labels.played}
            </th>
            <th scope="col" className={styles.numCol}>
              {labels.goalDiff}
            </th>
            <th scope="col" className={styles.numCol}>
              {labels.points}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.teamName} data-gs={r.teamName === GS ? "true" : undefined}>
              <td className={styles.numCol}>{r.position}</td>
              <td>{r.teamName}</td>
              <td className={styles.numCol}>{r.played}</td>
              <td className={styles.numCol}>
                {r.goalDifference > 0 ? `+${r.goalDifference}` : r.goalDifference}
              </td>
              <td className={styles.numCol}>
                <b>{r.points}</b>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
