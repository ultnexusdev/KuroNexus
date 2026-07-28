import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { fetchCategories } from "@/lib/api/universes";
import { getMovieArchive } from "@/lib/api/movies";
import { hallLabel, hallName, hallNumber } from "@/lib/halls";
import { shelfFromSlug } from "@/lib/film/shelves";
import { FilmShelfPage } from "@/components/film/FilmShelfPage";

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
  return { title: key ? t(`shelf.${key}`) : t("title") };
}

/** Salon numarası ve adı tek kaynaktan: kategori kaydı. */
async function getHall(
  fallbackName: string,
): Promise<{ label: string; name: string }> {
  try {
    const categories = await fetchCategories();
    return {
      label: hallLabel(hallNumber(categories, "film")),
      name: hallName(categories, "film", fallbackName),
    };
  } catch {
    return { label: "", name: fallbackName };
  }
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
    getHall(t("hallName")),
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
