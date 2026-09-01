import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { shareCard } from "@/lib/seo";
import { apiUrl } from "@/lib/api/client";
import { getSourceBook } from "@/lib/api/books";
import { getHall } from "@/lib/halls";
import { SourceBook } from "@/components/book/SourceBook";

/**
 * Arşivde olmayan kitabın künye sayfası
 * (`/kitap/kaynak/oteki-isim--520400`).
 *
 * Adres 1000Kitap'ın kendi anahtarı, bizim slug'ımız değil: bu kaydın
 * veritabanında karşılığı yok. Arşiv adresleriyle karışmaması için ayrı bir
 * yol altında duruyor ("kisi" ve "yayinevi" ile aynı desen).
 */

const SLUG = "kitap";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const book = await getSourceBook(slug);
  const title = book?.title ?? t("hallName");
  return {
    title,
    ...shareCard({
      title,
      locale,
      path: `/dark-stories/category/kitap/kaynak/${slug}`,
      image: book?.coverImage ? apiUrl(book.coverImage) : null,
    }),
  };
}

export default async function SourceBookRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const [book, hall] = await Promise.all([
    getSourceBook(slug),
    getHall(SLUG, t("hallName"), locale),
  ]);

  // Kaynağın bilmediği anahtar 404; backend de bilmediğine 404 veriyor
  if (!book) {
    notFound();
  }

  return (
    <SourceBook book={book} hallLabel={hall.label} hallName={hall.name} />
  );
}
