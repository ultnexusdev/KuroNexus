import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { getAnimeArchive } from "@/lib/api/anime";
import { getHall } from "@/lib/halls";
import { shareCard } from "@/lib/seo";
import { AnimeHall } from "@/components/anime/AnimeHall";
import { animeHref } from "@/lib/anime/routes";

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
    ...shareCard({ title, locale, path: animeHref.archive() }),
  };
}

export default async function AnimeArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "anime" });
  const isAdmin = await readIsAdmin();
  const [archive, hall] = await Promise.all([
    getAnimeArchive(isAdmin),
    getHall("anime", t("hallName"), locale),
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
