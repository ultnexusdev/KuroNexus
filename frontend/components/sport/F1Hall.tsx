import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import type { SportBundle, WikiUniverse } from "@/lib/api/types";
import styles from "./F1Hall.module.css";

/**
 * Formula 1 — "Gece Yarışı" salonu.
 * Karbon doku + kerb şeridi; GP takvim kartları (pist konturu SVG),
 * dijital gösterge tarzı şampiyona tablosu ve kask galerisi efsaneler.
 */
export async function F1Hall({
  universe,
  bundle,
  locale,
}: {
  universe: WikiUniverse;
  bundle: SportBundle;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "sport" });
  const dateFmt = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  });
  const maxPoints = Math.max(1, ...bundle.standings.map((s) => s.points));

  return (
    <div data-category="spor" className={styles.hall}>
      {/* Hero */}
      <header className={styles.hero}>
        {universe.coverImage ? (
          <Image
            src={apiUrl(universe.coverImage)}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.heroImg}
          />
        ) : null}
        <span className={styles.carbon} aria-hidden />
        <span className={styles.kerb} aria-hidden />
        <div className={styles.heroInner}>
          <Link href="/dark-stories/category/spor" className={styles.back}>
            ← {t("eyebrow")}
          </Link>
          <span className={styles.sub}>{t("f1Sub")}</span>
          <h1 className={styles.title}>{universe.name}</h1>
          {universe.description ? (
            <p className={styles.lede}>{universe.description}</p>
          ) : null}
        </div>
      </header>

      <div className={styles.body}>
        {/* Takvim */}
        <section>
          <h2 className={styles.sectionLabel}>{t("calendar")}</h2>
          {bundle.races.length === 0 ? (
            <p className={styles.empty}>{t("calendarEmpty")}</p>
          ) : (
            <ul className={styles.races}>
              {bundle.races.map((r) => (
                <li key={r.id} className={styles.raceCard}>
                  <span className={styles.round}>
                    {t("round")} {String(r.round).padStart(2, "0")}
                  </span>
                  {r.trackSvgPath ? (
                    <svg
                      className={styles.track}
                      viewBox="0 0 100 60"
                      fill="none"
                      aria-hidden
                    >
                      <path d={r.trackSvgPath} className={styles.trackPath} />
                    </svg>
                  ) : (
                    <span className={styles.trackFallback} aria-hidden>
                      ⌁
                    </span>
                  )}
                  <span className={styles.raceName}>{r.name}</span>
                  <span className={styles.raceMeta}>
                    {r.circuit}
                    {r.country ? ` · ${r.country}` : ""}
                  </span>
                  {r.raceDate ? (
                    <time className={styles.raceDate}>
                      {dateFmt.format(new Date(r.raceDate))}
                    </time>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Şampiyona */}
        <section>
          <h2 className={styles.sectionLabel}>{t("standings")}</h2>
          {bundle.standings.length === 0 ? (
            <p className={styles.empty}>{t("standingsEmpty")}</p>
          ) : (
            <ol className={styles.standings}>
              {bundle.standings.map((s) => (
                <li key={s.id} className={styles.standRow}>
                  <span className={styles.standPos}>
                    P{String(s.position).padStart(2, "0")}
                  </span>
                  <span
                    className={styles.teamStripe}
                    // Takımın gerçek dünya rengi: veri, tema token'ı değil
                    style={s.teamColor ? { background: s.teamColor } : undefined}
                    aria-hidden
                  />
                  <span className={styles.standDriver}>
                    {s.driver}
                    {s.team ? (
                      <span className={styles.standTeam}> {s.team}</span>
                    ) : null}
                  </span>
                  <span className={styles.standBarWrap} aria-hidden>
                    <span
                      className={styles.standBar}
                      style={{ width: `${(s.points / maxPoints) * 100}%` }}
                    />
                  </span>
                  <span className={styles.standPts}>{s.points}</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* Efsaneler */}
        <section>
          <h2 className={styles.sectionLabel}>{t("legends")}</h2>
          {bundle.legends.length === 0 ? (
            <p className={styles.empty}>{t("legendsEmpty")}</p>
          ) : (
            <ul className={styles.legends}>
              {bundle.legends.map((l) => (
                <li key={l.id} className={styles.legendCard}>
                  {l.imageUrl ? (
                    <span className={styles.legendImgWrap}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={apiUrl(l.imageUrl)}
                        alt=""
                        className={styles.legendImg}
                      />
                    </span>
                  ) : null}
                  {l.era ? (
                    <span className={styles.legendEra}>{l.era}</span>
                  ) : null}
                  <h3 className={styles.legendName}>{l.name}</h3>
                  {l.title ? (
                    <span className={styles.legendTitle}>{l.title}</span>
                  ) : null}
                  <p className={styles.legendStory}>{l.story}</p>
                  {l.achievements ? (
                    <ul className={styles.achievements}>
                      {l.achievements
                        .split("\n")
                        .filter(Boolean)
                        .map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
