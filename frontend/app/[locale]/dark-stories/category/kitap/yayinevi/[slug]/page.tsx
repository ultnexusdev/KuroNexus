import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { shareCard } from "@/lib/seo";
import { getBookPublisher } from "@/lib/api/books";
import { getHall } from "@/lib/halls";
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
  const title = publisher?.name ?? t("hallName");
  return {
    title,
    ...shareCard({
      title,
      locale,
      path: `/dark-stories/category/kitap/yayinevi/${slug}`,
    }),
  };
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
    getHall(SLUG, t("hallName"), locale),
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
