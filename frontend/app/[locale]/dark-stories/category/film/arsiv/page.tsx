import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { fetchCategories } from "@/lib/api/universes";
import { getMovieArchive } from "@/lib/api/movies";
import { hallLabel, hallNumber } from "@/lib/halls";
import { FilmHall } from "@/components/film/FilmHall";

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
  return { title: t("title") };
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

export default async function FilmArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [archive, label, isAdmin] = await Promise.all([
    getMovieArchive(),
    getHallLabel(),
    readIsAdmin(),
  ]);

  return (
    <FilmHall
      archive={archive}
      locale={locale}
      hallLabel={label}
      isAdmin={isAdmin}
    />
  );
}
