import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { getMovieDetail, tmdbImage } from "@/lib/api/movies";
import { MovieDetail } from "@/components/film/MovieDetail";
import { shareCard } from "@/lib/seo";

// Film sayfası. `arsiv` statik yolu bundan önce eşleşir (Next statik segmenti
// dinamik segmentten önce dener), o yüzden çakışma yok — anime salonundaki
// düzenin aynısı.

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const detail = await getMovieDetail(slug);
  if (!detail) {
    return {};
  }
  const title = detail.movie.title;
  return {
    title,
    ...shareCard({
      title,
      locale,
      path: `/dark-stories/category/film/${slug}`,
      image: tmdbImage(detail.movie.posterPath, "w780"),
    }),
  };
}

export default async function MoviePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [detail, isAdmin] = await Promise.all([
    getMovieDetail(slug),
    readIsAdmin(),
  ]);
  if (!detail) {
    notFound();
  }

  return <MovieDetail detail={detail} isAdmin={isAdmin} />;
}
