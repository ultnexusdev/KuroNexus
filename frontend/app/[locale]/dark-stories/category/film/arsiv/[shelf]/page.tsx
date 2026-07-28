import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { fetchCategories } from "@/lib/api/universes";
import { getMovieArchive } from "@/lib/api/movies";
import { hallLabel, hallNumber } from "@/lib/halls";
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

async function getHallLabel(): Promise<string> {
  try {
    const categories = await fetchCategories();
    return hallLabel(hallNumber(categories, "film"));
  } catch {
    // Kategori listesi alınamazsa başlık numarasız görünür, sayfa çökmez
    return "";
  }
}

export default async function ShelfPage({
  params,
}: {
  params: Promise<{ locale: string; shelf: string }>;
}) {
  const { shelf } = await params;
  const key = shelfFromSlug(shelf);
  if (!key) {
    notFound();
  }

  const [archive, label, isAdmin] = await Promise.all([
    getMovieArchive(),
    getHallLabel(),
    readIsAdmin(),
  ]);

  return (
    <FilmShelfPage
      archive={archive}
      shelf={key}
      hallLabel={label}
      isAdmin={isAdmin}
    />
  );
}
