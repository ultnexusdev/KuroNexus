import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { fetchCategories } from "@/lib/api/universes";
import { getBookPublisher } from "@/lib/api/books";
import { hallLabel, hallName, hallNumber } from "@/lib/halls";
import { PublisherPage } from "@/components/book/PersonHall";

/** Yayınevi sayfası (`/kitap/yayinevi/sel-yayinlari`). */

const SLUG = "kitap";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const publisher = await getBookPublisher(slug);
  return { title: publisher?.name ?? t("hallName") };
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

export default async function PublisherRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const [publisher, hall] = await Promise.all([
    getBookPublisher(slug),
    getHall(t("hallName")),
  ]);

  if (!publisher) {
    notFound();
  }

  return (
    <PublisherPage
      publisher={publisher}
      hallLabel={hall.label}
      hallName={hall.name}
    />
  );
}
