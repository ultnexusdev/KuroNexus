import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { shareCard } from "@/lib/seo";
import { getAwards } from "@/lib/api/books";
import { getHall } from "@/lib/halls";
import { AwardHall } from "@/components/book/AwardHall";

// Kitap salonunun ödüller bölümü (Faz B). Liste backend'de kod içi küratörlü;
// kapaklar Google eşleşmesinden gecikmeli dolar, sayfa onları beklemez.

const SLUG = "kitap";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const title = t("awards.title");
  return {
    title,
    ...shareCard({
      title,
      locale,
      path: "/dark-stories/category/kitap/oduller",
    }),
  };
}

export default async function BookAwardsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const [awards, hall] = await Promise.all([
    getAwards(),
    getHall(SLUG, t("hallName"), locale),
  ]);

  return (
    <AwardHall awards={awards} hallLabel={hall.label} hallName={hall.name} />
  );
}
