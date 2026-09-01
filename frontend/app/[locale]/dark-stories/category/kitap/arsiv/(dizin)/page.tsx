import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { shareCard } from "@/lib/seo";
import { getBookArchive } from "@/lib/api/books";
import { getHall } from "@/lib/halls";
import { BookHall } from "@/components/book/BookHall";

// Kitap salonunun arşiv bölümü. Statik yol, [categorySlug] dinamik yolundan
// önce eşleşir; salon girişi (lobi) bir üst seviyede kalır.

const SLUG = "kitap";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const title = t("archiveTitle");
  return {
    title,
    ...shareCard({ title, locale, path: "/dark-stories/category/kitap/arsiv" }),
  };
}

export default async function BookArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const [archive, hall, isAdmin] = await Promise.all([
    getBookArchive(),
    getHall(SLUG, t("hallName"), locale),
    readIsAdmin(),
  ]);

  return (
    <BookHall
      archive={archive}
      hallLabel={hall.label}
      hallName={hall.name}
      isAdmin={isAdmin}
    />
  );
}
