import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl, ApiError } from "@/lib/api/client";
import { fetchUniverseBySlug } from "@/lib/api/universes";
import { fetchWikiEntries } from "@/lib/api/wiki";
import { getBookSeries } from "@/lib/api/books";
import { bookSeriesSlugFor } from "@/lib/universes/book-series";
import type { WikiEntrySummary, WikiUniverse } from "@/lib/api/types";
import { ContentCard } from "@/components/ContentCard";
import { WikiSection } from "@/components/wiki/WikiSection";
import { CodexCard } from "@/components/kadim/CodexCard";
import {
  CornerFiligree,
  RunicMargin,
} from "@/components/kadim/CodexOrnaments";
import { GsHall } from "@/components/sport/GsHall";
import { F1Hall } from "@/components/sport/F1Hall";
import { fetchSportBundle } from "@/lib/api/sport";
import type { SportBundle } from "@/lib/api/types";
import styles from "./page.module.css";

// Spor kanadının özel salonları (slug → salon bileşeni)
const SPORT_HALLS = new Set(["galatasaray", "formula-1"]);

async function getSportBundle(slug: string): Promise<SportBundle> {
  try {
    return await fetchSportBundle(slug);
  } catch {
    // Spor verisi alınamazsa salon boş bölümlerle açılır, sayfa çökmez
    return { players: [], legends: [], races: [], standings: [] };
  }
}

async function getUniverse(slug: string): Promise<WikiUniverse | null> {
  try {
    return await fetchUniverseBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

async function getWikiEntries(slug: string): Promise<WikiEntrySummary[]> {
  try {
    return await fetchWikiEntries(slug);
  } catch {
    // Wiki listesi alınamazsa evren sayfası çökmez (kural 4 ruhu)
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; universeSlug: string }>;
}): Promise<Metadata> {
  const { universeSlug } = await params;
  const universe = await getUniverse(universeSlug);
  return { title: universe?.name ?? "KuroNexus" };
}

export default async function UniverseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; universeSlug: string }>;
}) {
  const { locale, universeSlug } = await params;
  /*
   * Kitap serisi üçüncü çağrı olarak buraya girdi: "Kadim Dünyalar"daki
   * Zaman Çarkı ile kitap arşivindeki Zaman Çarkı aynı şey ve serinin bu
   * sayfada da görünmesi istendi. Eşleşme kuralı `lib/universes/book-series`
   * içinde (veri modelinde iki taraf arasında bağ yok, gerekçesi orada).
   * `getBookSeries` hata durumunda `null` döndüğü için ek try/catch gerekmiyor.
   */
  const [universe, wikiEntries, bookSeries] = await Promise.all([
    getUniverse(universeSlug),
    getWikiEntries(universeSlug),
    getBookSeries(bookSeriesSlugFor(universeSlug)),
  ]);
  if (!universe) {
    notFound();
  }

  // Spor salonları kendi tam sayfa tasarımlarını kullanır
  if (SPORT_HALLS.has(universeSlug)) {
    const bundle = await getSportBundle(universeSlug);
    if (universeSlug === "galatasaray") {
      return <GsHall universe={universe} bundle={bundle} locale={locale} />;
    }
    return <F1Hall universe={universe} bundle={bundle} locale={locale} />;
  }

  const t = await getTranslations({ locale, namespace: "stories" });
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });

  const title = universe.name.toLocaleUpperCase(locale);

  return (
    <div data-category="kadim-dunyalar" className={styles.wing}>
      {universe.coverImage ? (
        <header className={styles.hero}>
          <Image
            src={apiUrl(universe.coverImage)}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.heroImg}
          />
          <div className={styles.heroOverlay} />
          <div className={styles.heroInner}>
            <Link href="/dark-stories" className={styles.back}>
              {t("backToList")}
            </Link>
            <span className={styles.eyebrow}>{t("wingAncient")}</span>
            <h1 className={styles.title}>{title}</h1>
            <span className={styles.rule}>
              <span className={styles.diamond}>❖</span>
            </span>
          </div>
        </header>
      ) : (
        <header className={`${styles.hero} ${styles.heroPlain}`}>
          <div className={styles.heroInner}>
            <Link href="/dark-stories" className={styles.back}>
              {t("backToList")}
            </Link>
            <span className={styles.eyebrow}>{t("wingAncient")}</span>
            <h1 className={styles.title}>{title}</h1>
            <span className={styles.rule}>
              <span className={styles.diamond}>❖</span>
            </span>
          </div>
        </header>
      )}

      <section className={styles.codex}>
        <RunicMargin side="left" />
        <RunicMargin side="right" />
        <CornerFiligree corner="tl" />
        <CornerFiligree corner="tr" />
        <CornerFiligree corner="bl" />
        <CornerFiligree corner="br" />

        {universe.description ? (
          <p className={styles.description}>{universe.description}</p>
        ) : null}

        {universe.stories.length === 0 ? (
          <p className={styles.empty}>{t("empty")}</p>
        ) : (
          <>
            <h2 className={styles.sectionLabel}>{t("volumes")}</h2>
            <ul className={styles.list}>
              {universe.stories.map((story) => (
                <li key={story.id}>
                  <ContentCard
                    href={`/dark-stories/${universeSlug}/${story.slug}`}
                    coverImage={story.coverImage}
                    title={story.title}
                    subtitle={story.excerpt}
                    dateTime={story.publishedAt}
                    dateLabel={
                      story.publishedAt
                        ? dateFormatter.format(new Date(story.publishedAt))
                        : null
                    }
                    variant="vertical"
                  />
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Kitap serisi — kanadın kendi dokusuyla: CodexCard, altın ❖ işareti,
            Cinzel başlık. Kart kitap sayfasına açılıyor, yani tıklanan cildin
            mevcut künyesi görünüyor. */}
        {bookSeries && bookSeries.books.length > 0 ? (
          <>
            <h2 className={styles.sectionLabel}>{t("bookSeries")}</h2>
            <p className={styles.sectionNote}>
              {t("bookSeriesNote", { count: bookSeries.count })}{" "}
              <Link
                href={`/dark-stories/category/kitap/seri/${bookSeries.slug}`}
                className={styles.sectionLink}
              >
                {t("bookSeriesAll")}
              </Link>
            </p>
            <ul className={styles.list}>
              {bookSeries.books.map((book) => (
                <li key={book.id}>
                  <CodexCard
                    href={`/dark-stories/category/kitap/${book.slug}`}
                    coverImage={book.coverImage}
                    title={book.title}
                    subtitle={[
                      book.seriesIndex
                        ? t("bookVolume", { index: book.seriesIndex })
                        : null,
                      book.authors.join(", ") || null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                    portrait
                  />
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <WikiSection universeSlug={universeSlug} entries={wikiEntries} />
      </section>
    </div>
  );
}
