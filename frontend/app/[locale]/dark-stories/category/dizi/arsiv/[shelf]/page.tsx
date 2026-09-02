import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { getShowArchive } from "@/lib/api/shows";
import { getHall } from "@/lib/halls";
import { shelfFromSlug } from "@/lib/show/shelves";
import { ShowShelfPage } from "@/components/show/ShowShelfPage";
import { shareCard } from "@/lib/seo";

// Tek bir rafın tam sayfası (izlediklerim, izleyeceklerim, Kore Dramaları…).
// Süzgeçler URL'de olduğu için sayfa dinamik.

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; shelf: string }>;
}): Promise<Metadata> {
  const { locale, shelf } = await params;
  const key = shelfFromSlug(shelf);
  const t = await getTranslations({ locale, namespace: "show" });
  const title = key ? t(`shelf.${key}`) : t("title");
  return {
    title,
    ...shareCard({
      title,
      locale,
      path: `/dark-stories/category/dizi/arsiv/${shelf}`,
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

  const t = await getTranslations({ locale, namespace: "show" });
  const isAdmin = await readIsAdmin();
  const [archive, hall] = await Promise.all([
    getShowArchive(isAdmin),
    getHall("dizi", t("hallName"), locale),
  ]);

  return (
    <ShowShelfPage
      archive={archive}
      shelf={key}
      hallLabel={hall.label}
      hallName={hall.name}
      isAdmin={isAdmin}
    />
  );
}
