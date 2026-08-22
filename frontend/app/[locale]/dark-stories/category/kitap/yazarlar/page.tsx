import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { shareCard } from "@/lib/seo";
import { fetchCategories } from "@/lib/api/universes";
import { getBookArchive } from "@/lib/api/books";
import { hallLabel, hallName, hallNumber } from "@/lib/halls";
import { AuthorsPage } from "@/components/book/ArchiveIndex";

/**
 * Arşivdeki bütün yazarlar (`/kitap/yazarlar`).
 *
 * Salon yazar panelini iki sırada kesiyor; kalanların gideceği yer burası
 * (kullanıcı isteği). Ayrı bir uç YOK: arşiv zaten tek istekte bütün yazar
 * kartlarını taşıyor, ikinci bir sorgu boşuna olurdu.
 */

const SLUG = "kitap";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const title = t("authorsTitle");
  return {
    title,
    ...shareCard({
      title,
      locale,
      path: "/dark-stories/category/kitap/yazarlar",
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

export default async function AuthorsRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const [archive, hall] = await Promise.all([
    getBookArchive(),
    getHall(t("hallName")),
  ]);

  return (
    <AuthorsPage
      authors={archive.authors}
      hallLabel={hall.label}
      hallName={hall.name}
    />
  );
}
