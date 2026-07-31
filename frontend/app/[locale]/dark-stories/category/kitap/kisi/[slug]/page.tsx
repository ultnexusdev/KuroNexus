import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { fetchCategories } from "@/lib/api/universes";
import { getBookPerson } from "@/lib/api/books";
import { hallLabel, hallName, hallNumber } from "@/lib/halls";
import { PersonPage } from "@/components/book/PersonHall";

/**
 * Yazar / çevirmen sayfası (`/kitap/kisi/harper-lee`).
 *
 * Adres "kisi", "yazar" değil: aynı sayfa çevirmen ve editör için de
 * kullanılıyor — kişi tek tabloda, rolü kitapla ilişkisinde duruyor.
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
  const person = await getBookPerson(slug);
  return { title: person?.name ?? t("hallName") };
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

export default async function PersonRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const [person, hall] = await Promise.all([
    getBookPerson(slug),
    getHall(t("hallName")),
  ]);

  // Arşivde olmayan kişi 404; backend de bilmediği slug'a 404 veriyor
  if (!person) {
    notFound();
  }

  return (
    <PersonPage person={person} hallLabel={hall.label} hallName={hall.name} />
  );
}
