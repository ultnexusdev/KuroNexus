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

function marketValue(eur: number | null, locale: string) {
  if (!eur || eur <= 0) return null;
  const millions = eur / 1_000_000;
  const value = millions >= 10 ? Math.round(millions) : Number(millions.toFixed(1));
  return `${new Intl.NumberFormat(locale).format(value)} M €`;
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
  const { player } = detail;

  const birth = player.birthDate
    ? new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(player.birthDate))
    : null;

  // Künye satırları — yalnızca gerçekten veri olanlar basılır
  const facts: Array<[string, string]> = [];
  if (player.clubName) facts.push([t("club"), player.clubName]);
  if (player.position) facts.push([t("position"), player.position]);
  if (birth) facts.push([t("birthDate"), birth]);
  if (player.heightInCm) facts.push([t("height"), `${player.heightInCm} cm`]);
  if (player.foot) facts.push([t("foot"), player.foot]);
  const value = marketValue(player.marketValueInEur, locale);
  if (value) facts.push([t("marketValue"), value]);

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
              <span className={styles.eyebrow}>{t("dossier")}</span>
              <h1 className={styles.name}>{player.name}</h1>
              <ul className={styles.chips}>
                {player.position ? <li>{player.position}</li> : null}
                {player.age ? <li>{t("age", { age: player.age })}</li> : null}
                {value ? <li>{value}</li> : null}
              </ul>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.body}>
        <section>
          <h2 className={styles.sectionLabel}>{t("dossier")}</h2>
          <dl className={styles.facts}>
            {facts.map(([label, val]) => (
              <div key={label} className={styles.factRow}>
                <dt>{label}</dt>
                <dd>{val}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.note}>{t("dossierNote")}</p>
          {player.tmUrl ? (
            <a
              href={player.tmUrl}
              className={styles.tmLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("tmProfile")} →
            </a>
          ) : null}
        </section>
      </div>
    </div>
  );
}
