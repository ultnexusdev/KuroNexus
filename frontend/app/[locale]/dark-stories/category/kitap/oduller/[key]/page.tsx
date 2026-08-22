import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { shareCard } from "@/lib/seo";
import { apiUrl } from "@/lib/api/client";
import { fetchCategories } from "@/lib/api/universes";
import { getAward } from "@/lib/api/books";
import { hallLabel, hallName, hallNumber } from "@/lib/halls";
import { AwardShelf } from "@/components/book/AwardHall";

/**
 * Tek bir ödülün rafı (`/oduller/hugo` gibi).
 *
 * Ödül adı çeviri dosyasında DEĞİL, backend'den geliyor: liste kodda
 * küratörlü ve ödülün adı listenin bir parçası. Aynı adı iki yerde tutmak
 * `titleTr` meselesindeki hatanın aynısı olurdu.
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
  const award = await getAward(key);
  const title = award?.name ?? t("awards.title");
  return {
    title,
    ...shareCard({
      title,
      locale,
      path: `/dark-stories/category/kitap/oduller/${key}`,
      image: award?.coverImage ? apiUrl(award.coverImage) : null,
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

export default async function AwardRoute({
  params,
}: {
  params: Promise<{ locale: string; key: string }>;
}) {
  const { locale, key } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const [award, hall] = await Promise.all([
    getAward(key),
    getHall(t("hallName")),
  ]);

  // Tanınmayan ödül anahtarı 404; backend de bilmediği anahtara 404 veriyor
  if (!award) {
    notFound();
  }

  return (
    <AwardShelf award={award} hallLabel={hall.label} hallName={hall.name} />
  );
}
