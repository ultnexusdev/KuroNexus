import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { fetchCategories } from "@/lib/api/universes";
import { getBookSeries } from "@/lib/api/books";
import { hallLabel, hallName, hallNumber } from "@/lib/halls";
import { SeriesPage } from "@/components/book/PersonHall";

/**
 * Seri sayfası (`/kitap/seri/zaman-carki`).
 *
 * Adres serinin adından türetiliyor (`slugify`), sütun değil: seri kartı da
 * aynı anahtarı üretiyor ve iki taraf tek yerden anlaşıyor.
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
  const series = await getBookSeries(slug);
  return { title: series?.name ?? t("hallName") };
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

export default async function SeriesRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const [series, hall] = await Promise.all([
    getBookSeries(slug),
    getHall(t("hallName")),
  ]);

  // Arşivde cildi olmayan ve kaydı da bulunmayan seri 404 (backend de öyle)
  if (!series) {
    notFound();
  }

  return (
    <SeriesPage series={series} hallLabel={hall.label} hallName={hall.name} />
  );
}
