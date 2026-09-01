import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { shareCard } from "@/lib/seo";
import { apiUrl } from "@/lib/api/client";
import { getReadingOrder } from "@/lib/api/books";
import { getHall } from "@/lib/halls";
import { ReadingOrderPage } from "@/components/book/ReadingOrderHall";

/**
 * Tek bir okuma sırası (`/kitap/okuma-sirasi/vakif`).
 *
 * Solda yazar rayı, ortada yol (kullanıcı isteği). Tablo kod içi küratörlü;
 * "hangi durak arşivimde" canlı hesaplanıyor, o yüzden önbellek yok.
 */

const SLUG = "kitap";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; key: string }>;
}): Promise<Metadata> {
  const { locale, key } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const order = await getReadingOrder(key);
  const title = order?.name ?? t("readingOrder.title");
  return {
    title,
    ...shareCard({
      title,
      locale,
      path: `/dark-stories/category/kitap/okuma-sirasi/${key}`,
      image: order?.coverImage ? apiUrl(order.coverImage) : null,
    }),
  };
}

export default async function ReadingOrderRoute({
  params,
}: {
  params: Promise<{ locale: string; key: string }>;
}) {
  const { locale, key } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const [order, hall, isAdmin] = await Promise.all([
    getReadingOrder(key),
    getHall(SLUG, t("hallName"), locale),
    readIsAdmin(),
  ]);

  // Bilinmeyen anahtar 404; backend de öyle veriyor
  if (!order) {
    notFound();
  }

  return (
    <ReadingOrderPage
      order={order}
      hallLabel={hall.label}
      hallName={hall.name}
      isAdmin={isAdmin}
    />
  );
}
