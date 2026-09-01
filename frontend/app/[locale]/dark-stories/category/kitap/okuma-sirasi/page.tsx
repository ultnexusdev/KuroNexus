import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { shareCard } from "@/lib/seo";
import { getReadingOrders } from "@/lib/api/books";
import { getHall } from "@/lib/halls";
import { ReadingOrderHall } from "@/components/book/ReadingOrderHall";

/**
 * Okuma sıraları listesi (`/kitap/okuma-sirasi`).
 *
 * Liste backend'de kod içi küratörlü (`data/reading-orders.data.ts`); yeni bir
 * evren eklemek için oraya bir tanım yazmak yeterli, bu sayfa değişmez.
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
  const title = t("readingOrder.title");
  return {
    title,
    ...shareCard({
      title,
      locale,
      path: "/dark-stories/category/kitap/okuma-sirasi",
    }),
  };
}

export default async function ReadingOrdersRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const [orders, hall] = await Promise.all([
    getReadingOrders(),
    getHall(SLUG, t("hallName"), locale),
  ]);

  return (
    <ReadingOrderHall
      orders={orders}
      hallLabel={hall.label}
      hallName={hall.name}
    />
  );
}
