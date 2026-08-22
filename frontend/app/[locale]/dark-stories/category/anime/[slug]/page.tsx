import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { getAnimeDetail } from "@/lib/api/anime";
import { shareCard } from "@/lib/seo";
import { AnimeDetail } from "@/components/anime/AnimeDetail";

// Anime sayfası. `arsiv` statik yolu bundan önce eşleşir (Next statik
// segmenti dinamik segmentten önce dener), o yüzden çakışma yok.

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const detail = await getAnimeDetail(slug);
  if (!detail) return {};
  const title = detail.anime.title;
  return {
    title,
    ...shareCard({
      title,
      locale,
      path: `/dark-stories/category/anime/${slug}`,
      image: detail.anime.coverImage,
    }),
  };
}

export default async function AnimePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [detail, isAdmin] = await Promise.all([
    getAnimeDetail(slug),
    readIsAdmin(),
  ]);
  if (!detail) {
    notFound();
  }

  return (
    <AnimeDetail
      anime={detail.anime}
      characters={detail.characters}
      isAdmin={isAdmin}
    />
  );
}
