import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { shareCard } from "@/lib/seo";
import { apiUrl } from "@/lib/api/client";
import { getBookDetail } from "@/lib/api/books";
import { BookDetail } from "@/components/book/BookDetail";

// Kitap sayfası. `arsiv` statik yolu bundan önce eşleşir (Next statik segmenti
// dinamik segmentten önce dener), o yüzden çakışma yok.

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const detail = await getBookDetail(slug);
  if (!detail) {
    return {};
  }
  const title = detail.book.title;
  return {
    title,
    ...shareCard({
      title,
      locale,
      path: `/dark-stories/category/kitap/${slug}`,
      image: detail.book.coverImage ? apiUrl(detail.book.coverImage) : null,
    }),
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [detail, isAdmin] = await Promise.all([
    getBookDetail(slug),
    readIsAdmin(),
  ]);
  if (!detail) {
    notFound();
  }

  return <BookDetail detail={detail} isAdmin={isAdmin} />;
}
