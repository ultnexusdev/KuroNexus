import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { fetchCategories } from "@/lib/api/universes";
import { getReadingOrders } from "@/lib/api/books";
import { hallLabel, hallName, hallNumber } from "@/lib/halls";
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
  return { title: t("readingOrder.title") };
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

export default async function ReadingOrdersRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const [orders, hall] = await Promise.all([
    getReadingOrders(),
    getHall(t("hallName")),
  ]);

  return (
    <ReadingOrderHall
      orders={orders}
      hallLabel={hall.label}
      hallName={hall.name}
    />
  );
}
