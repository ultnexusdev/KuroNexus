import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { shareCard } from "@/lib/seo";
import { fetchCategories } from "@/lib/api/universes";
import { getBookArchive } from "@/lib/api/books";
import { hallLabel, hallName, hallNumber } from "@/lib/halls";
import { SeriesIndexPage } from "@/components/book/ArchiveIndex";

/**
 * Arşivdeki bütün seriler (`/kitap/seriler`).
 *
 * Salon seri şeridini tek satırda kesiyor ve kullanıcı yeni kurduğu serinin
 * görünmediğini bildirdi — kesilenlerin gideceği yer burası. Tek bir serinin
 * kendi sayfası ayrı: `/kitap/seri/<slug>`.
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
  const title = t("seriesTitle");
  return {
    title,
    ...shareCard({
      title,
      locale,
      path: "/dark-stories/category/kitap/seriler",
    }),
  };
}

async function getHall(
  fallbackName: string,
  locale: string,
): Promise<{ label: string; name: string }> {
  try {
    const categories = await fetchCategories();
    return {
      label: hallLabel(hallNumber(categories, SLUG)),
      name: hallName(categories, SLUG, fallbackName, locale),
    };
  } catch {
    return { label: "", name: fallbackName };
  }
}

export default async function SeriesIndexRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const [archive, hall] = await Promise.all([
    getBookArchive(),
    getHall(t("hallName"), locale),
  ]);

  return (
    <SeriesIndexPage
      series={archive.series}
      hallLabel={hall.label}
      hallName={hall.name}
    />
  );
}
