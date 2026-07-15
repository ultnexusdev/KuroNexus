import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import { fetchFootballSquad } from "@/lib/api/football";
import type {
  FootballSquadPlayer,
  SportBundle,
  WikiUniverse,
} from "@/lib/api/types";
import styles from "./GsHall.module.css";

async function getApiSquad(): Promise<FootballSquadPlayer[]> {
  try {
    const squad = await fetchFootballSquad();
    return squad.players ?? [];
  } catch {
    // API anahtarı yoksa / dış servis çökmüşse admin kadrosuna düşülür
    return [];
  }
}

/**
 * Galatasaray — "Stadyum Gecesi" salonu.
 * Antrasit gece zemini üzerinde tribün huzmeleri; kadro kartları
 * (hover'da istatistik çekmecesi) ve altın-varak efsane arşiv kartları.
 */
export async function GsHall({
  universe,
  bundle,
  locale,
}: {
  universe: WikiUniverse;
  bundle: SportBundle;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "sport" });
  const apiSquad = await getApiSquad();

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
        <span className={styles.floodlight} aria-hidden />
        <div className={styles.heroInner}>
          <Link href="/dark-stories/category/spor" className={styles.back}>
            ← {t("eyebrow")}
          </Link>
          <span className={styles.sub}>{t("footballSub")}</span>
          <h1 className={styles.title}>{universe.name}</h1>
          {universe.description ? (
            <p className={styles.lede}>{universe.description}</p>
          ) : null}
        </div>
      </header>

      <div className={styles.body}>
        {/* Kadro — öncelik API-Football (backend cache'li); yoksa admin verisi */}
        <section>
          <h2 className={styles.sectionLabel}>{t("squad")}</h2>
          {apiSquad.length > 0 ? (
            <ul className={styles.squad}>
              {apiSquad.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/futbol/oyuncu/${p.id}`}
                    className={styles.playerCard}
                  >
                    {p.photo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={p.photo}
                        alt=""
                        loading="lazy"
                        className={styles.playerPhoto}
                      />
                    ) : null}
                    <span className={styles.shirtNo} aria-hidden>
                      {p.number ?? "–"}
                    </span>
                    <span className={styles.playerMeta}>
                      <span className={styles.playerName}>{p.name}</span>
                      <span className={styles.playerPos}>
                        {p.position ?? ""}
                        {p.age ? ` · ${p.age}` : ""}
                      </span>
                    </span>
                    <span className={styles.drawer}>
                      <span className={styles.profileCue}>
                        {t("viewProfile")} →
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : bundle.players.length === 0 ? (
            <p className={styles.empty}>{t("squadEmpty")}</p>
          ) : (
            <ul className={styles.squad}>
              {bundle.players.map((p) => (
                <li key={p.id} className={styles.playerCard}>
                  {p.imageUrl ? (
                    <span className={styles.playerImgWrap}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={apiUrl(p.imageUrl)}
                        alt=""
                        className={styles.playerImg}
                      />
                    </span>
                  ) : null}
                  <span className={styles.shirtNo} aria-hidden>
                    {p.shirtNumber ?? "–"}
                  </span>
                  <span className={styles.playerMeta}>
                    <span className={styles.playerName}>{p.name}</span>
                    <span className={styles.playerPos}>
                      {p.position}
                      {p.nationality ? ` · ${p.nationality}` : ""}
                    </span>
                  </span>
                  {/* Hover'da açılan istatistik çekmecesi */}
                  <span className={styles.drawer}>
                    <span className={styles.stat}>
                      <b>{p.appearances}</b> {t("apps")}
                    </span>
                    <span className={styles.stat}>
                      <b>{p.goals}</b> {t("goals")}
                    </span>
                    <span className={styles.stat}>
                      <b>{p.assists}</b> {t("assists")}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
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
                  <div className={styles.legendHead}>
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
                    <div>
                      {l.era ? (
                        <span className={styles.legendEra}>{l.era}</span>
                      ) : null}
                      <h3 className={styles.legendName}>{l.name}</h3>
                      {l.title ? (
                        <span className={styles.legendTitle}>{l.title}</span>
                      ) : null}
                    </div>
                  </div>
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
