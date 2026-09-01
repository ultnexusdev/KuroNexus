import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { getAnimeArchive } from "@/lib/api/anime";
import { getHall } from "@/lib/halls";
import { shareCard } from "@/lib/seo";
import { AnimeHall } from "@/components/anime/AnimeHall";

// Anime salonunun bir bölümü. Statik yol, [categorySlug] dinamik yolundan
// önce eşleşir; salon girişi (lobi) bir üst seviyede kalır.

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "anime" });
  const title = t("archiveTitle");
  return {
    title,
    ...shareCard({ title, locale, path: "/dark-stories/category/anime/arsiv" }),
  };
}

export default async function AnimeArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "anime" });
  const [archive, hall, isAdmin] = await Promise.all([
    getAnimeArchive(),
    getHall("anime", t("hallName"), locale),
    readIsAdmin(),
  ]);

  return (
    <AnimeHall
      archive={archive}
      hallLabel={hall.label}
      hallName={hall.name}
      isAdmin={isAdmin}
    />
  );
}
