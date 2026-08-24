import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { fetchCategories } from "@/lib/api/universes";
import { getShowArchive } from "@/lib/api/shows";
import { hallLabel, hallName, hallNumber } from "@/lib/halls";
import { ShowHall } from "@/components/show/ShowHall";
import { shareCard } from "@/lib/seo";

// Dizi salonunun bir bölümü — film salonundaki aynı desen. Statik yol,
// [categorySlug] dinamik yolundan önce eşleşir; salon girişi (lobi) bir üst
// seviyede kalır.

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "show" });
  const title = t("title");
  return {
    title,
    ...shareCard({ title, locale, path: "/dark-stories/category/dizi/arsiv" }),
  };
}

/** Salon numarası ve adı tek kaynaktan: kategori kaydı. */
async function getHall(
  fallbackName: string,
  locale: string,
): Promise<{ label: string; name: string }> {
  try {
    const categories = await fetchCategories();
    return {
      label: hallLabel(hallNumber(categories, "dizi")),
      name: hallName(categories, "dizi", fallbackName, locale),
    };
  } catch {
    return { label: "", name: fallbackName };
  }
}

export default async function ShowArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "show" });
  const [archive, hall, isAdmin] = await Promise.all([
    getShowArchive(),
    getHall(t("hallName"), locale),
    readIsAdmin(),
  ]);

  return (
    <ShowHall
      archive={archive}
      locale={locale}
      hallLabel={hall.label}
      hallName={hall.name}
      isAdmin={isAdmin}
    />
  );
}
