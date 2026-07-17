import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import { fetchFootballSquad, fetchTransferNews } from "@/lib/api/football";
import type {
  FootballSquadPlayer,
  SportBundle,
  TransferNewsItem,
  WikiUniverse,
} from "@/lib/api/types";
import { GiltNav } from "./GiltNav";
import { SquadGrid } from "./SquadGrid";
import { TransferNews } from "./TransferNews";
import { WidgetRail } from "./WidgetRail";
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

async function getNews(slug: string): Promise<TransferNewsItem[]> {
  try {
    return await fetchTransferNews(slug);
  } catch {
    // Haber ucu çökerse salonun geri kalanı açılmaya devam etsin
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
  const [apiSquad, news] = await Promise.all([
    getApiSquad(),
    getNews(universe.slug),
  ]);

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
          {/* Açıklama artık "Genel Bakış" bölümünde — hero'da tekrar etmesin */}
        </div>
      </header>

      <div className={styles.body}>
        {/* Sol: yaldızlı kenar indeksi (scroll-spy). Bölüm id'leri aşağıdaki
            <section>'larla eşleşmeli. */}
        <GiltNav
          sections={[
            { id: "genel-bakis", label: t("navOverview") },
            { id: "kadro", label: t("navSquad") },
            { id: "haberler", label: t("navNews") },
            { id: "efsaneler", label: t("navLegends") },
          ]}
        />

        <div className={styles.main}>
          {/* Genel bakış */}
          <section id="genel-bakis" className={styles.section}>
            <h2 className={styles.sectionLabel}>{t("navOverview")}</h2>
            <p className={styles.overview}>
              {universe.description ?? t("overviewFallback")}
            </p>
          </section>

          {/* Kadro — öncelik API-Football (backend cache'li); yoksa admin verisi */}
          <section id="kadro" className={styles.section}>
            <h2 className={styles.sectionLabel}>{t("squad")}</h2>
          {apiSquad.length > 0 ? (
            <SquadGrid
              players={apiSquad}
              labels={{
                showAll: t("showAll"),
                showLess: t("showLess"),
                viewProfile: t("viewProfile"),
              }}
            />
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

        {/* Haberler → Transfer Haberleri (ileride başka alt başlıklar eklenebilir) */}
        <section id="haberler" className={styles.section}>
          <h2 className={styles.sectionLabel}>{t("navNews")}</h2>
          <h3 className={styles.subLabel}>{t("transferNews")}</h3>
          <TransferNews news={news} locale={locale} />
        </section>

        {/* Efsaneler */}
        <section id="efsaneler" className={styles.section}>
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

        {/* Sağ: sonraki maç · puan durumu · kadro künyesi */}
        <WidgetRail squad={apiSquad} locale={locale} />
      </div>
    </div>
  );
}
