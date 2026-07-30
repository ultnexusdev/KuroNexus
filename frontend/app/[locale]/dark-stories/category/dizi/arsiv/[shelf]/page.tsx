import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { fetchCategories } from "@/lib/api/universes";
import { getShowArchive } from "@/lib/api/shows";
import { hallLabel, hallName, hallNumber } from "@/lib/halls";
import { shelfFromSlug } from "@/lib/show/shelves";
import { ShowShelfPage } from "@/components/show/ShowShelfPage";

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
  return { title: key ? t(`shelf.${key}`) : t("title") };
}

async function getHall(
  fallbackName: string,
): Promise<{ label: string; name: string }> {
  try {
    const categories = await fetchCategories();
    return {
      label: hallLabel(hallNumber(categories, "dizi")),
      name: hallName(categories, "dizi", fallbackName),
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

  const t = await getTranslations({ locale, namespace: "show" });
  const [archive, hall, isAdmin] = await Promise.all([
    getShowArchive(),
    getHall(t("hallName")),
    readIsAdmin(),
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
