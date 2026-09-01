import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { getMovieArchive } from "@/lib/api/movies";
import { getHall } from "@/lib/halls";
import { shelfFromSlug } from "@/lib/film/shelves";
import { FilmShelfPage } from "@/components/film/FilmShelfPage";
import { shareCard } from "@/lib/seo";

// Tek bir rafın tam sayfası (izlediklerim, izleyeceklerim, favorilerim…).
// Süzgeçler URL'de olduğu için sayfa dinamik.

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; shelf: string }>;
}): Promise<Metadata> {
  const { locale, shelf } = await params;
  const key = shelfFromSlug(shelf);
  const t = await getTranslations({ locale, namespace: "film" });
  const title = key ? t(`shelf.${key}`) : t("title");
  return {
    title,
    ...shareCard({
      title,
      locale,
      path: `/dark-stories/category/film/arsiv/${shelf}`,
    }),
  };
}

export default async function ShelfPage({
  params,
}: {
  params: Promise<{ locale: string; shelf: string }>;
}) {
  const { locale, shelf } = await params;
  const key = shelfFromSlug(shelf);
  if (!key) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "film" });
  const [archive, hall, isAdmin] = await Promise.all([
    getMovieArchive(),
    getHall("film", t("hallName"), locale),
    readIsAdmin(),
  ]);

  return (
    <FilmShelfPage
      archive={archive}
      shelf={key}
      hallLabel={hall.label}
      hallName={hall.name}
      isAdmin={isAdmin}
    />
  );
}
