import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import { tmdbImage } from "@/lib/api/movies";
import { hallLabel, hallWorldCount, HALL_ORDER } from "@/lib/halls";
import type { Pulse, PulseEntry, PulseHall } from "@/lib/api/types";
import styles from "./NexusHub.module.css";

/**
 * "Nexus'u Keşfet" — sitenin kalbi.
 *
 * Eskiden burası beş düz karttan ibaretti; ana sayfadaki kapı duvarının
 * gücü buraya hiç gelmemişti ve **sitenin kendi eseri Temürkan burada hiç
 * görünmüyordu** (o bir kategori değil, Kadim Dünyalar'ın içindeki bir
 * evren). Sayfa artık bir vitrin değil bir eşik:
 *
 *  1. Temürkan mühürlü baş köşe — ev sahibi,
 *  2. canlı salon kapıları — her kapı kendi salonunun nabzını taşır,
 *  3. "şu an Nexus'ta" — son izlenen/ilerleyen/yazılan,
 *  4. evrenler rafı — kategoriye girmeden doğrudan,
 *  5. künye şeridi — arşivin tek satırlık özeti.
 *
 * Tamamı sunucuda çiziliyor: hareket ve ışık CSS'te olduğu için ziyaretçiye
 * bu sayfa için tek satır JS inmiyor.
 */
export async function NexusHub({
  pulse,
  locale,
}: {
  pulse: Pulse;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "nexus" });
  // Salon sırası ana sayfadaki kapı duvarıyla aynı kaynaktan okunur
  const halls = [...pulse.halls].sort((a, b) => {
    const ia = HALL_ORDER.indexOf(a.slug);
    const ib = HALL_ORDER.indexOf(b.slug);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  return (
    <div className={styles.hub}>
      {/* Atmosfer: zeminde çok yavaş süzülen toz/ışık. Hareket kısıtlıysa
          CSS tarafında tamamen duruyor. */}
      <div className={styles.veil} aria-hidden />
      <div className={styles.dust} aria-hidden />

      <header className={styles.head}>
        <span className={styles.eyebrow}>{t("eyebrow")}</span>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.lede}>{t("lede")}</p>
      </header>

      {pulse.featured ? (
        <Featured featured={pulse.featured} locale={locale} />
      ) : null}

      {halls.length > 0 ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("halls")}</h2>
          <ul className={styles.doors}>
            {halls.map((hall, index) => (
              <Door
                key={hall.slug}
                hall={hall}
                label={hallLabel(index + 1)}
                locale={locale}
              />
            ))}
          </ul>
        </section>
      ) : null}

      {pulse.recent.length > 0 ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("nowPlaying")}</h2>
          <ul className={styles.pulseRow}>
            {pulse.recent.map((entry) => (
              <PulseCard
                key={`${entry.kind}-${entry.title}`}
                entry={entry}
                locale={locale}
              />
            ))}
          </ul>
        </section>
      ) : null}

      {pulse.universes.length > 0 ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("universes")}</h2>
          <ul className={styles.rail}>
            {pulse.universes.map((universe) => (
              <li key={universe.slug} className={styles.railItem}>
                <Link
                  href={`/dark-stories/${universe.slug}`}
                  className={styles.railCard}
                >
                  <span className={styles.railCover}>
                    {universe.coverImage ? (
                      <Image
                        src={apiUrl(universe.coverImage)}
                        alt=""
                        fill
                        sizes="200px"
                        className={styles.railImg}
                      />
                    ) : null}
                  </span>
                  <span className={styles.railName}>{universe.name}</span>
                  {universe.storyCount > 0 ? (
                    <span className={styles.railMeta}>
                      {t("chapterCount", { count: universe.storyCount })}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className={styles.stats}>
        <Stat value={pulse.totals.universes} label={t("stat.universes")} />
        <Stat value={pulse.totals.chapters} label={t("stat.chapters")} />
        <Stat value={pulse.totals.films} label={t("stat.films")} />
        <Stat
          value={pulse.totals.animeEpisodes}
          label={t("stat.animeEpisodes")}
        />
        <Stat value={pulse.totals.wikiEntries} label={t("stat.wikiEntries")} />
      </footer>
    </div>
  );
}

/**
 * Baş köşe: Temürkan Efsaneleri. Sayfanın en üstünde, kendi kapağı zemin
 * olacak şekilde. Balmumu mührü ana sayfadaki kapı duvarından tanıdık —
 * aynı dil, burada büyümüş hâli.
 */
async function Featured({
  featured,
  locale,
}: {
  featured: NonNullable<Pulse["featured"]>;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "nexus" });

  return (
    <section className={styles.featured}>
      {featured.coverImage ? (
        <Image
          src={apiUrl(featured.coverImage)}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.featuredImg}
        />
      ) : null}
      <div className={styles.featuredShade} />

      <div className={styles.featuredInner}>
        <span className={styles.seal} aria-hidden>
          {/* Orhun 𐱅 — Temürkan'ın kadim harfi, mühür baskısı */}
          𐱅
        </span>
        <span className={styles.featuredEyebrow}>{t("featuredEyebrow")}</span>
        <h2 className={styles.featuredTitle}>{featured.name}</h2>
        {featured.description ? (
          <p className={styles.featuredLede}>{featured.description}</p>
        ) : null}

        <p className={styles.featuredMeta}>
          <span>{t("chapterCount", { count: featured.chapterCount })}</span>
          {featured.entryCount > 0 ? (
            <span>{t("entryCount", { count: featured.entryCount })}</span>
          ) : null}
          {featured.latestChapter?.at ? (
            <span>
              {t("lastWritten", {
                when: relativeTime(featured.latestChapter.at, locale),
              })}
            </span>
          ) : null}
        </p>

        <div className={styles.featuredActions}>
          {featured.latestChapter ? (
            <Link
              href={`/dark-stories/${featured.slug}/${featured.latestChapter.slug}`}
              className={styles.primaryAction}
            >
              {t("readLatest")}
              <span className={styles.actionArrow} aria-hidden>
                →
              </span>
            </Link>
          ) : null}
          <Link
            href={`/dark-stories/${featured.slug}`}
            className={styles.secondaryAction}
          >
            {t("enterUniverse")}
          </Link>
        </div>

        {featured.latestChapter ? (
          <p className={styles.featuredChapter}>
            {t("latestChapter", { title: featured.latestChapter.title })}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/**
 * Salon kapısı. Kapak görseli kapının aralığından sızan ışık gibi duruyor;
 * altındaki satır o salonun **gerçek** verisi — kapı bir logo değil nabız.
 */
async function Door({
  hall,
  label,
  locale,
}: {
  hall: PulseHall;
  label: string;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "nexus" });

  // Salona göre değişen canlı satır; veri yoksa hiç yazılmaz
  let live: string | null = null;
  if (hall.slug === "film" && hall.count !== null) {
    live = t("hallLine.film", {
      count: hall.count,
      year: Number(hall.line ?? 0),
    });
  } else if (hall.slug === "anime" && hall.count !== null) {
    live = hall.line
      ? t("hallLine.animeWatching", { count: hall.count, title: hall.line })
      : t("hallLine.anime", { count: hall.count });
  } else {
    // Arşiv bölümü de evren sayılır — dizi gibi kendi satırı olmayan
    // salonlar "0 evren" değil gerçek sayıyı gösterir (bkz. hallWorldCount)
    const worlds = hallWorldCount(hall.slug, hall.universeCount);
    if (worlds > 0) {
      live = t("hallLine.universes", { count: worlds });
    }
  }

  return (
    <li className={styles.doorItem} data-category={hall.slug}>
      <Link
        href={`/dark-stories/category/${hall.slug}`}
        className={styles.door}
      >
        <span className={styles.doorFrame}>
          {hall.coverImage ? (
            <Image
              src={apiUrl(hall.coverImage)}
              alt=""
              fill
              sizes="(max-width: 700px) 100vw, 33vw"
              className={styles.doorImg}
            />
          ) : null}
          <span className={styles.doorLeak} aria-hidden />
        </span>

        <span className={styles.doorText}>
          <span className={styles.doorNo}>{label}</span>
          <span className={styles.doorName}>{hall.name}</span>
          {live ? <span className={styles.doorLive}>{live}</span> : null}
        </span>
      </Link>
    </li>
  );
}

/** "Şu an Nexus'ta" kartı: türüne göre işaret, başlık, alt satır ve zaman. */
async function PulseCard({
  entry,
  locale,
}: {
  entry: PulseEntry;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "nexus" });
  // Film posteri TMDB yolu, anime kapağı tam adres, bölüm kapağı bizim yükleme
  const image =
    entry.kind === "FILM" || entry.kind === "DIZI"
      ? tmdbImage(entry.image, "w185")
      : entry.kind === "ANIME"
        ? entry.image
        : entry.image
          ? apiUrl(entry.image)
          : null;

  return (
    <li className={styles.pulseItem}>
      <Link href={entry.href} className={styles.pulseCard}>
        <span className={styles.pulseCover}>
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              sizes="64px"
              className={styles.pulseImg}
              unoptimized={entry.kind !== "CHAPTER"}
            />
          ) : null}
        </span>
        <span className={styles.pulseText}>
          <span className={styles.pulseKind}>{t(`kind.${entry.kind}`)}</span>
          <span className={styles.pulseTitle}>{entry.title}</span>
          {entry.subtitle ? (
            <span className={styles.pulseSub}>{entry.subtitle}</span>
          ) : null}
        </span>
        {entry.at ? (
          <span className={styles.pulseWhen}>
            {relativeTime(entry.at, locale)}
          </span>
        ) : null}
      </Link>
    </li>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <span className={styles.stat}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </span>
  );
}

/**
 * "3 gün önce" — mutlak tarih yerine mesafe, çünkü buradaki soru "ne zaman"
 * değil "ne kadar taze". Bir yıldan eskiler yıl olarak yazılır.
 */
function relativeTime(iso: string, locale: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) {
    return "";
  }
  const diffMs = Date.now() - then;
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 365 * 24 * 60 * 60 * 1000],
    ["month", 30 * 24 * 60 * 60 * 1000],
    ["day", 24 * 60 * 60 * 1000],
    ["hour", 60 * 60 * 1000],
    ["minute", 60 * 1000],
  ];
  for (const [unit, ms] of units) {
    const value = Math.round(diffMs / ms);
    if (Math.abs(value) >= 1) {
      return formatter.format(-value, unit);
    }
  }
  return formatter.format(0, "minute");
}
