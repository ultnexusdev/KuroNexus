import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { fetchCategories } from "@/lib/api/universes";
import { getMovieArchive } from "@/lib/api/movies";
import { hallLabel, hallName, hallNumber } from "@/lib/halls";
import { FilmHall } from "@/components/film/FilmHall";
import { shareCard } from "@/lib/seo";

// Film salonunun bir bölümü. Statik yol, [categorySlug] dinamik yolundan
// önce eşleşir; salon girişi (lobi) bir üst seviyede kalır.

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "film" });
  const title = t("title");
  return {
    title,
    ...shareCard({ title, locale, path: "/dark-stories/category/film/arsiv" }),
  };
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
    // Kategori listesi alınamazsa başlık numarasız görünür, sayfa çökmez
    return { label: "", name: fallbackName };
  }
}

export default async function FilmArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "film" });
  const [archive, hall, isAdmin] = await Promise.all([
    getMovieArchive(),
    getHall(t("hallName")),
    readIsAdmin(),
  ]);

  return (
    <FilmHall
      archive={archive}
      locale={locale}
      hallLabel={hall.label}
      hallName={hall.name}
      isAdmin={isAdmin}
    />
  );
}
