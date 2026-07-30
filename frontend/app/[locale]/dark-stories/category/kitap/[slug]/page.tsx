import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { getBookDetail } from "@/lib/api/books";
import { BookDetail } from "@/components/book/BookDetail";

// Kitap sayfası. `arsiv` statik yolu bundan önce eşleşir (Next statik segmenti
// dinamik segmentten önce dener), o yüzden çakışma yok.

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getBookDetail(slug);
  return detail ? { title: detail.book.title } : {};
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
