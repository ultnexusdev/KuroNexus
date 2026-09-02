import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { getMovieArchive } from "@/lib/api/movies";
import { getHall } from "@/lib/halls";
import { FilmHall } from "@/components/film/FilmHall";
import { shareCard } from "@/lib/seo";
import { filmHref } from "@/lib/film/routes";

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
    ...shareCard({ title, locale, path: filmHref.archive() }),
  };
}

export default async function FilmArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "film" });
  const isAdmin = await readIsAdmin();
  const [archive, hall] = await Promise.all([
    getMovieArchive(isAdmin),
    getHall("film", t("hallName"), locale),
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
