import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchCategories, fetchUniverses } from "@/lib/api/universes";
import { ContentCard } from "@/components/ContentCard";
import { CodexCard } from "@/components/kadim/CodexCard";
import { CornerFiligree, RunicMargin } from "@/components/kadim/CodexOrnaments";
import { FilmLobby } from "@/components/film/FilmLobby";
import { AnimeLobby } from "@/components/anime/AnimeLobby";
import { ShowLobby } from "@/components/show/ShowLobby";
import { getMovieArchive, getMovieShowcase } from "@/lib/api/movies";
import { getAnimeArchive, getAnimeShowcase } from "@/lib/api/anime";
import { getShowArchive, getShowShowcase } from "@/lib/api/shows";
import { hallLabel, hallNumber } from "@/lib/halls";
import { apiUrl } from "@/lib/api/client";
import { Link } from "@/lib/i18n/navigation";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  try {
    const categories = await fetchCategories();
    const category = categories.find((c) => c.slug === categorySlug);
    if (!category) return {};
    return { title: category.name };
  } catch {
    return {};
  }
}

export const dynamic = "force-dynamic";

export default async function CategoryUniversesPage({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>;
}) {
  const { locale, categorySlug } = await params;
  const t = await getTranslations({ locale, namespace: "stories" });

  const [categories, allUniverses] = await Promise.all([
    fetchCategories(),
    fetchUniverses(),
  ]);

  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) {
    notFound();
  }

  const universes = allUniverses.filter((u) => u.categoryId === category.id);
  // Kategori derisi: yalnızca derisi tanımlı kategoriler dönüşür
  const isCodex = category.slug === "kadim-dunyalar";

  // Film kapısı doğrudan arşive değil, salon girişine açılır — buraya yeni
  // başlıklar eklenebilsin diye (bkz. lib/film/sections.ts)
  if (category.slug === "film") {
    const [archive, showcase] = await Promise.all([
      getMovieArchive(),
      getMovieShowcase(),
    ]);
    return (
      <FilmLobby
        locale={locale}
        hallLabel={hallLabel(hallNumber(categories, category.slug))}
        categoryName={category.name}
        archive={archive}
        showcase={showcase}
      />
    );
  }

  // Anime kapısı da salon girişine açılır (film salonuyla aynı desen)
  if (category.slug === "anime") {
    const [archive, showcase] = await Promise.all([
      getAnimeArchive(),
      getAnimeShowcase(),
    ]);
    return (
      <AnimeLobby
        locale={locale}
        hallLabel={hallLabel(hallNumber(categories, category.slug))}
        categoryName={category.name}
        archive={archive}
        showcase={showcase}
      />
    );
  }

  // Dizi kapısı da salon girişine açılır (film salonuyla aynı desen)
  if (category.slug === "dizi") {
    const [archive, showcase] = await Promise.all([
      getShowArchive(),
      getShowShowcase(),
    ]);
    return (
      <ShowLobby
        locale={locale}
        hallLabel={hallLabel(hallNumber(categories, category.slug))}
        categoryName={category.name}
        archive={archive}
        showcase={showcase}
      />
    );
  }

  return (
    <div data-category={category.slug} className={isCodex ? styles.wing : undefined}>
      {isCodex ? (
        <>
          {category.coverImage ? (
            <header className={styles.hero}>
              <Image
                src={apiUrl(category.coverImage)}
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
                <span className={styles.eyebrow}>
                  {t("worldCount", { count: universes.length })}
                </span>
                <h1 className={styles.title}>
                  {category.name.toLocaleUpperCase(locale)}
                </h1>
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
                <h1 className={styles.title}>
                  {category.name.toLocaleUpperCase(locale)}
                </h1>
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

            {category.description ? (
              <p className={styles.lede}>{category.description}</p>
            ) : null}

            {universes.length === 0 ? (
              <p className={styles.empty}>{t("emptyCategory")}</p>
            ) : (
              <ul className={styles.list}>
                {universes.map((universe) => (
                  <li key={universe.id}>
                    <CodexCard
                      href={`/dark-stories/${universe.slug}`}
                      coverImage={universe.coverImage}
                      title={universe.name}
                      subtitle={universe.description}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : (
        <section className={styles.page}>
          <Link href="/dark-stories" className={styles.backLink}>
            {t("backToList")}
          </Link>

          {category.coverImage && (
            <div className={styles.bannerWrapper}>
              <Image
                src={apiUrl(category.coverImage)}
                alt={category.name}
                fill
                className={styles.bannerImage}
                priority
              />
              <div className={styles.bannerOverlay}>
                <h1 className={styles.bannerTitle}>{category.name}</h1>
                {category.description && (
                  <p className={styles.bannerDesc}>{category.description}</p>
                )}
              </div>
            </div>
          )}

          {!category.coverImage && (
            <h1 className={styles.heading}>{category.name}</h1>
          )}

          {universes.length === 0 ? (
            <p className={styles.empty}>{t("emptyCategory")}</p>
          ) : (
            <ul className={styles.list}>
              {universes.map((universe) => (
                <li key={universe.id}>
                  <ContentCard
                    href={`/dark-stories/${universe.slug}`}
                    coverImage={universe.coverImage}
                    title={universe.name}
                    subtitle={universe.description}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
