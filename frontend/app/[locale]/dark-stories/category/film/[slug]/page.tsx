import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { getMovieDetail } from "@/lib/api/movies";
import { MovieDetail } from "@/components/film/MovieDetail";

// Film sayfası. `arsiv` statik yolu bundan önce eşleşir (Next statik segmenti
// dinamik segmentten önce dener), o yüzden çakışma yok — anime salonundaki
// düzenin aynısı.

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getMovieDetail(slug);
  return detail ? { title: detail.movie.title } : {};
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
