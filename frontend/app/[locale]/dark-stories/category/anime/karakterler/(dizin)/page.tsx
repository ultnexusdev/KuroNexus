import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { getCharacterIndex } from "@/lib/api/characters";
import { fetchCategories } from "@/lib/api/universes";
import { hallLabel, hallName, hallNumber } from "@/lib/halls";
import { shareCard } from "@/lib/seo";
import { CharacterGallery } from "@/components/character/CharacterGallery";

// Portre kanadı — anime salonunun ikinci odası. Statik yol, `[slug]` dinamik
// yolundan önce eşleşir (Next statik segmenti önce dener), `arsiv` ile aynı
// kural — çakışma yok.

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "character" });
  const title = t("title");
  const description = t("lede");
  return {
    title,
    description,
    ...shareCard({
      title,
      description,
      locale,
      path: "/dark-stories/category/anime/karakterler",
    }),
  };
}

/** Salon numarası ve adı tek kaynaktan: kategori kaydı (arşiv sayfasıyla aynı). */
async function getHall(
  fallbackName: string,
): Promise<{ label: string; name: string }> {
  try {
    const categories = await fetchCategories();
    return {
      label: hallLabel(hallNumber(categories, "anime")),
      name: hallName(categories, "anime", fallbackName),
    };
  } catch {
    // Kategori listesi alınamazsa başlık numarasız görünür, sayfa çökmez
    return { label: "", name: fallbackName };
  }
}

export default async function CharacterGalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "anime" });
  const [index, hall, isAdmin] = await Promise.all([
    getCharacterIndex(),
    getHall(t("hallName")),
    readIsAdmin(),
  ]);

  return (
    <CharacterGallery
      index={index}
      hallLabel={hall.label}
      hallName={hall.name}
      isAdmin={isAdmin}
    />
  );
}
