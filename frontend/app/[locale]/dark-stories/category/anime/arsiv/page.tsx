import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { fetchCategories } from "@/lib/api/universes";
import { getAnimeArchive } from "@/lib/api/anime";
import { hallLabel, hallName, hallNumber } from "@/lib/halls";
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
  return { title: t("archiveTitle") };
}

/** Salon numarası ve adı tek kaynaktan: kategori kaydı. */
async function getHall(
  fallbackName: string,
): Promise<{ label: string; name: string }> {
  try {
    const categories = await fetchCategories();
    return {
      label: hallLabel(hallNumber(categories, "anime")),
      name: hallName(categories, "anime", fallbackName),
    };
  } catch {
    // Kategori listesi alınamazsa başlık numarasız görünür, sayfa çökmez
    return { label: "", name: fallbackName };
  }
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
    getHall(t("hallName")),
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
