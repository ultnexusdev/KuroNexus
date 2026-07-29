import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { fetchCategories } from "@/lib/api/universes";
import { getAnimeArchive } from "@/lib/api/anime";
import { hallLabel, hallName, hallNumber } from "@/lib/halls";
import { shelfFromSlug } from "@/lib/anime/shelves";
import { AnimeShelfPage } from "@/components/anime/AnimeShelfPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; shelf: string }>;
}): Promise<Metadata> {
  const { locale, shelf } = await params;
  const key = shelfFromSlug(shelf);
  if (!key) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "anime" });
  return { title: t(`shelf.${key}`) };
}

export default async function AnimeShelfRoute({
  params,
}: {
  params: Promise<{ locale: string; shelf: string }>;
}) {
  const { locale, shelf } = await params;
  const key = shelfFromSlug(shelf);
  if (!key) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "anime" });
  const [archive, categories, isAdmin] = await Promise.all([
    getAnimeArchive(),
    fetchCategories().catch(() => []),
    readIsAdmin(),
  ]);

  return (
    <AnimeShelfPage
      archive={archive}
      shelf={key}
      hallLabel={hallLabel(hallNumber(categories, "anime"))}
      hallName={hallName(categories, "anime", t("hallName"))}
      isAdmin={isAdmin}
    />
  );
}
