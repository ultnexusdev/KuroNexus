import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { shareCard } from "@/lib/seo";
import { fetchCategories } from "@/lib/api/universes";
import { getBookArchive } from "@/lib/api/books";
import { hallLabel, hallName, hallNumber } from "@/lib/halls";
import { shelfFromSlug } from "@/lib/book/shelves";
import { BookHall } from "@/components/book/BookHall";

/**
 * Bir rafın kendi sayfası (`/arsiv/okuduklarim` gibi).
 *
 * Ayrı bir bileşen yok: salonun kendisi, `shelf` verilerek açılıyor — o zaman
 * bütün rafları alt alta dizmek yerine yalnızca o rafın tamamını ızgara olarak
 * çiziyor. Film kanadında raf sayfası ayrı bir bileşendi ve süzgeç davranışı
 * iki yerde ayrışmıştı; burada tekrarlanmıyor.
 */

const SLUG = "kitap";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; shelf: string }>;
}): Promise<Metadata> {
  const { locale, shelf } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const key = shelfFromSlug(shelf);
  const title = key ? t(`shelf.${key}`) : t("archiveTitle");
  return {
    title,
    ...shareCard({
      title,
      locale,
      path: `/dark-stories/category/kitap/arsiv/${shelf}`,
    }),
  };
}

async function getHall(
  fallbackName: string,
): Promise<{ label: string; name: string }> {
  try {
    const categories = await fetchCategories();
    return {
      label: hallLabel(hallNumber(categories, SLUG)),
      name: hallName(categories, SLUG, fallbackName),
    };
  } catch {
    return { label: "", name: fallbackName };
  }
}

export default async function BookShelfRoute({
  params,
}: {
  params: Promise<{ locale: string; shelf: string }>;
}) {
  const { locale, shelf } = await params;
  const key = shelfFromSlug(shelf);
  if (!key) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "book" });
  const [archive, hall, isAdmin] = await Promise.all([
    getBookArchive(),
    getHall(t("hallName")),
    readIsAdmin(),
  ]);

  return (
    <BookHall
      archive={archive}
      hallLabel={hall.label}
      hallName={hall.name}
      shelf={key}
      isAdmin={isAdmin}
    />
  );
}
