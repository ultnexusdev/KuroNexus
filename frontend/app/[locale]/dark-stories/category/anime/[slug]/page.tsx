import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { getAnimeDetail } from "@/lib/api/anime";
import { AnimeDetail } from "@/components/anime/AnimeDetail";

// Anime sayfası. `arsiv` statik yolu bundan önce eşleşir (Next statik
// segmenti dinamik segmentten önce dener), o yüzden çakışma yok.

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getAnimeDetail(slug);
  return detail ? { title: detail.anime.title } : {};
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
