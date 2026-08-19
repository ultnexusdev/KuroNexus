import { apiUrl } from "@/lib/api/client";
import {
  isHomeGame,
  opponentOf,
  resultOf,
  type ClubLiveOverview,
  type LiveMatch,
  type LiveStandings,
  type LiveTeamSeasonStats,
  type PositionPoint,
} from "@/lib/api/football-live";
import { Reveal } from "@/components/sport/Reveal";
import shell from "@/app/[locale]/spor/layout.module.css";
import styles from "./SeasonBoard.module.css";

/**
 * Sezon panosu — fikstür, puan durumu, sıralama eğrisi, istatistik, golcüler.
 *
 * Hepsi AYRI bölüm ama tek dosyada duruyorlar çünkü tek bir veri nesnesini
 * paylaşıyorlar ve hiçbiri kendi başına başka bir sayfada kullanılmıyor.
 * Beşini beş dosyaya bölmek, aralarındaki tek bağı (aynı `overview`) beş
 * ayrı prop sözleşmesine çevirmekten başka bir şey yapmazdı.
 *
 * ── BOŞ ODA YASAĞI ───────────────────────────────────────────────────────
 * Her bölüm kendi verisi VARSA çiziliyor. Sezonun 2. haftasında golcü tablosu
 * ve sıralama eğrisi anlamsız; o durumda bölüm hiç görünmüyor, "veri yok"
 * yazan boş bir kutu görünmüyor. Kanadın mevcut kuralı bu ve brief'in
 * "asla uydurma veri" maddesinin görsel karşılığı.
 */

export function SeasonBoard({
  overview,
  clubKey,
  labels,
}: {
  overview: ClubLiveOverview;
  clubKey: string;
  labels: BoardLabels;
}) {
  return (
    <>
      {overview.fixtures.length > 0 ? (
        <FixtureTimeline
          fixtures={overview.fixtures}
          clubKey={clubKey}
          labels={labels}
        />
      ) : null}

      {overview.teamStats ? (
        <SeasonStats stats={overview.teamStats} labels={labels} />
      ) : null}

      {overview.standings ? (
        <StandingsSection
          standings={overview.standings}
          history={overview.positionHistory}
          clubKey={clubKey}
          labels={labels}
        />
      ) : null}

      {overview.scorers.length > 0 ? (
        <Scorers scorers={overview.scorers} labels={labels} />
      ) : null}
    </>
  );
}

/* ============================================================
   FİKSTÜR — yatay zaman ekseni
   ============================================================ */

function FixtureTimeline({
  fixtures,
  clubKey,
  labels,
}: {
  fixtures: LiveMatch[];
  clubKey: string;
  labels: BoardLabels;
}) {
  // "Şimdi" çizgisi: oynanmamış ilk maç. Liste bu maça kaydırılmış açılıyor
  // (CSS `scroll-snap` + `data-current` üzerinden), yani kullanıcı sezonun
  // başına değil BUGÜNE bakarak başlıyor.
  const currentIndex = fixtures.findIndex((m) => m.status !== "FINISHED");

  return (
    <Reveal as="section" className={styles.section}>
      <header className={styles.head}>
        <h2 className={`${shell.display} ${shell.title}`}>{labels.fixtures}</h2>
        <p className={`${shell.data} ${styles.hint}`}>{labels.scrollHint}</p>
      </header>

      <ol className={styles.timeline}>
        {fixtures.map((match, index) => {
          const result = resultOf(match, clubKey);
          const foe = opponentOf(match, clubKey);
          const home = isHomeGame(match, clubKey);

          return (
            <li
              key={match.id}
              className={styles.fixture}
              data-result={result ?? undefined}
              data-current={index === currentIndex ? "" : undefined}
            >
              <p className={`${shell.data} ${styles.fixtureRound}`}>
                {match.round ?? match.competition}
              </p>

              <p className={styles.fixtureFoe}>
                <span className={styles.venueFlag} aria-hidden="true">
                  {home ? labels.homeShort : labels.awayShort}
                </span>
                {foe.crest ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={apiUrl(foe.crest)}
                    alt=""
                    className={styles.fixtureCrest}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <span className={styles.fixtureFoeName}>{foe.name}</span>
              </p>

              {match.status === "FINISHED" &&
              match.homeGoals !== null &&
              match.awayGoals !== null ? (
                <p className={`${shell.figure} ${styles.fixtureScore}`}>
                  {home ? match.homeGoals : match.awayGoals}
                  <span className={styles.fixtureDash}>–</span>
                  {home ? match.awayGoals : match.homeGoals}
                </p>
              ) : (
                <p className={styles.fixtureWhen}>
                  {/* Üç kademe, hepsi GERÇEK veri:
                      1. saat açıklandıysa gün + saat
                      2. yalnızca gün belliyse gün (sezonun çoğu böyle)
                      3. ikisi de yoksa açıkça "saat yok" — uydurma tarih yok */}
                  {match.kickoffAt ? (
                    <time dateTime={match.kickoffAt}>
                      {labels.formatShort(match.kickoffAt)}
                    </time>
                  ) : match.kickoffDate ? (
                    <time dateTime={match.kickoffDate}>
                      {labels.formatDay(match.kickoffDate)}
                    </time>
                  ) : (
                    <span className={styles.tba}>{labels.tba}</span>
                  )}
                </p>
              )}

              {match.venue ? (
                <p className={`${shell.data} ${styles.fixtureVenue}`}>
                  {match.venue}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </Reveal>
  );
}

/* ============================================================
   SEZON İSTATİSTİKLERİ
   ============================================================ */

function SeasonStats({
  stats,
  labels,
}: {
  stats: LiveTeamSeasonStats;
  labels: BoardLabels;
}) {
  // xG ve topa sahip olma BİLİNÇLE YOK: hiçbir ücretsiz kaynağımız vermiyor.
  // "Ortalama" diye bir sayı uydurmak brief'in ilk yasağını çiğnerdi.
  const cells: Array<{ label: string; value: string; tone?: "good" | "bad" }> = [
    { label: labels.stat.played, value: String(stats.played) },
    { label: labels.stat.won, value: String(stats.won), tone: "good" },
    { label: labels.stat.drawn, value: String(stats.drawn) },
    { label: labels.stat.lost, value: String(stats.lost), tone: "bad" },
    { label: labels.stat.goalsFor, value: String(stats.goalsFor) },
    { label: labels.stat.goalsAgainst, value: String(stats.goalsAgainst) },
    {
      label: labels.stat.goalDifference,
      value: stats.goalDifference > 0 ? `+${stats.goalDifference}` : String(stats.goalDifference),
    },
    ...(stats.cleanSheets !== null
      ? [{ label: labels.stat.cleanSheets, value: String(stats.cleanSheets) }]
      : []),
    ...(stats.goalsForPerMatch !== null
      ? [
          {
            label: labels.stat.goalsForPerMatch,
            value: stats.goalsForPerMatch.toFixed(2),
          },
        ]
      : []),
    ...(stats.goalsAgainstPerMatch !== null
      ? [
          {
            label: labels.stat.goalsAgainstPerMatch,
            value: stats.goalsAgainstPerMatch.toFixed(2),
          },
        ]
      : []),
  ];

  return (
    <Reveal as="section" className={styles.section}>
      <header className={styles.head}>
        <h2 className={`${shell.display} ${shell.title}`}>{labels.seasonStats}</h2>
      </header>

      <dl className={styles.statGrid}>
        {cells.map((cell) => (
          <div key={cell.label} className={styles.stat} data-tone={cell.tone}>
            <dt className={shell.eyebrow}>{cell.label}</dt>
            <dd className={`${shell.figure} ${styles.statValue}`}>{cell.value}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

/* ============================================================
   PUAN DURUMU + SIRALAMA EĞRİSİ
   ============================================================ */

function StandingsSection({
  standings,
  history,
  clubKey,
  labels,
}: {
  standings: LiveStandings;
  history: PositionPoint[];
  clubKey: string;
  labels: BoardLabels;
}) {
  return (
    <Reveal as="section" className={styles.section}>
      <header className={styles.head}>
        <h2 className={`${shell.display} ${shell.title}`}>{labels.standings}</h2>
        {standings.updateNote ? (
          <p className={`${shell.data} ${styles.hint}`}>
            {labels.updated}: {standings.updateNote}
          </p>
        ) : null}
      </header>

      {/* Sıralama eğrisi — en az üç hafta oynanmadan çizilmiyor. İki noktalı
          bir "eğri" bilgi vermez, yalnızca grafik gibi görünür. */}
      {history.length >= 3 ? (
        <PositionCurve history={history} labels={labels} />
      ) : null}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption className={styles.srOnly}>
            {labels.standings} — {standings.seasonLabel}
          </caption>
          <thead>
            <tr>
              <th scope="col" className={styles.colRank}>
                {labels.col.rank}
              </th>
              <th scope="col" className={styles.colTeam}>
                {labels.col.team}
              </th>
              <th scope="col">{labels.col.played}</th>
              <th scope="col">{labels.col.won}</th>
              <th scope="col">{labels.col.drawn}</th>
              <th scope="col">{labels.col.lost}</th>
              <th scope="col">{labels.col.goalsFor}</th>
              <th scope="col">{labels.col.goalsAgainst}</th>
              <th scope="col">{labels.col.goalDifference}</th>
              <th scope="col" className={styles.colPoints}>
                {labels.col.points}
              </th>
            </tr>
          </thead>
          <tbody>
            {standings.rows.map((row) => (
              <tr
                key={row.team.key}
                data-mine={row.team.key === clubKey ? "" : undefined}
              >
                <td className={styles.colRank}>{row.position}</td>
                <th scope="row" className={styles.colTeam}>
                  {row.team.crest ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={apiUrl(row.team.crest)}
                      alt=""
                      className={styles.rowCrest}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className={styles.crestGap} aria-hidden="true" />
                  )}
                  <span className={styles.rowName}>{row.team.name}</span>
                </th>
                <td>{row.played}</td>
                <td>{row.won}</td>
                <td>{row.drawn}</td>
                <td>{row.lost}</td>
                <td>{row.goalsFor}</td>
                <td>{row.goalsAgainst}</td>
                <td>
                  {row.goalDifference > 0
                    ? `+${row.goalDifference}`
                    : row.goalDifference}
                </td>
                <td className={styles.colPoints}>{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Atıf ZORUNLU ve gizlenmiyor: veri resmî kaynaktan geliyor ve
          Vikipedi'ye düşüldüğünde lisans (CC BY-SA) atıf şart koşuyor. */}
      <p className={`${shell.data} ${styles.attribution}`}>
        {labels.source}: {standings.attribution}
      </p>
    </Reveal>
  );
}

/**
 * Sıralama eğrisi — hafta hafta kaçıncı olduğu.
 *
 * SVG elle çiziliyor; depoda grafik kütüphanesi yok ve bu iş için eklemek
 * gereksiz (tek bir polyline). Y ekseni TERS: 1. sıra yukarıda olmalı, ve
 * futbol tablosunda "yükselmek" sıralamada AŞAĞI inmek demek — grafik bu
 * sezgiye uymalı, matematiğe değil.
 */
function PositionCurve({
  history,
  labels,
}: {
  history: PositionPoint[];
  labels: BoardLabels;
}) {
  const width = 100;
  const height = 34;
  const maxPosition = Math.max(18, ...history.map((p) => p.position));
  const lastWeek = Math.max(...history.map((p) => p.week));
  const firstWeek = Math.min(...history.map((p) => p.week));
  const span = Math.max(1, lastWeek - firstWeek);

  const x = (week: number) => ((week - firstWeek) / span) * width;
  const y = (position: number) => ((position - 1) / (maxPosition - 1)) * height;

  const points = history.map((p) => `${x(p.week).toFixed(2)},${y(p.position).toFixed(2)}`);
  const latest = history[history.length - 1];

  return (
    <figure className={styles.curve}>
      <figcaption className={`${shell.eyebrow} ${styles.curveCaption}`}>
        {labels.positionCurve}
        <span className={styles.curveNow}>
          {labels.currentPosition}: {latest.position}
        </span>
      </figcaption>
      <svg
        viewBox={`-2 -3 ${width + 4} ${height + 6}`}
        className={styles.curveSvg}
        role="img"
        aria-label={history
          .map((p) => `${p.week}. ${labels.week}: ${p.position}`)
          .join(", ")}
      >
        <polyline className={styles.curveLine} points={points.join(" ")} />
        {history.map((p) => (
          <circle
            key={p.week}
            cx={x(p.week)}
            cy={y(p.position)}
            r={p.week === lastWeek ? 1.6 : 0.9}
            className={styles.curveDot}
            data-latest={p.week === lastWeek ? "" : undefined}
          />
        ))}
      </svg>
    </figure>
  );
}

/* ============================================================
   GOL KRALLIĞI
   ============================================================ */

function Scorers({
  scorers,
  labels,
}: {
  scorers: Array<{ name: string; team: string | null; goals: number }>;
  labels: BoardLabels;
}) {
  const top = scorers[0].goals;

  return (
    <Reveal as="section" className={styles.section}>
      <header className={styles.head}>
        <h2 className={`${shell.display} ${shell.title}`}>{labels.scorers}</h2>
      </header>

      <ol className={styles.scorerList}>
        {scorers.map((scorer, index) => (
          <li key={`${scorer.name}-${index}`} className={styles.scorer}>
            <span className={styles.scorerName}>{scorer.name}</span>
            {scorer.team ? (
              <span className={`${shell.data} ${styles.scorerTeam}`}>
                {scorer.team}
              </span>
            ) : null}
            {/* Çubuk genişliği liderin golüne ORANLI — mutlak bir ölçek
                kullanmak sezon başında bütün çubukları görünmez yapardı. */}
            <span
              className={styles.scorerBar}
              style={{ "--fill": `${(scorer.goals / top) * 100}%` } as React.CSSProperties}
              aria-hidden="true"
            />
            <span className={`${shell.figure} ${styles.scorerGoals}`}>
              {scorer.goals}
            </span>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

export interface BoardLabels {
  fixtures: string;
  scrollHint: string;
  homeShort: string;
  awayShort: string;
  tba: string;
  seasonStats: string;
  standings: string;
  updated: string;
  source: string;
  scorers: string;
  positionCurve: string;
  currentPosition: string;
  week: string;
  col: {
    rank: string;
    team: string;
    played: string;
    won: string;
    drawn: string;
    lost: string;
    goalsFor: string;
    goalsAgainst: string;
    goalDifference: string;
    points: string;
  };
  stat: {
    played: string;
    won: string;
    drawn: string;
    lost: string;
    goalsFor: string;
    goalsAgainst: string;
    goalDifference: string;
    cleanSheets: string;
    goalsForPerMatch: string;
    goalsAgainstPerMatch: string;
  };
  /** "21/08 21:30" — saat açıklanmış maçlar için */
  formatShort: (iso: string) => string;
  /** "06 Eyl" — yalnızca gün bilindiğinde; saat gösterilmiyor */
  formatDay: (iso: string) => string;
}
