import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { getShowDetail, tmdbImage } from "@/lib/api/shows";
import { ShowDetail } from "@/components/show/ShowDetail";
import { shareCard } from "@/lib/seo";

// Dizi sayfası. `arsiv` statik yolu bundan önce eşleşir (Next statik
// segmenti dinamik segmentten önce dener) — film salonundaki düzenin aynısı.

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const detail = await getShowDetail(slug);
  if (!detail) {
    return {};
  }
  const title = detail.show.title;
  return {
    title,
    ...shareCard({
      title,
      locale,
      path: `/dark-stories/category/dizi/${slug}`,
      image: tmdbImage(detail.show.posterPath, "w780"),
    }),
  };
}

export default async function ShowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [detail, isAdmin] = await Promise.all([
    getShowDetail(slug),
    readIsAdmin(),
  ]);
  if (!detail) {
    notFound();
  }

  return <ShowDetail detail={detail} isAdmin={isAdmin} />;
}
