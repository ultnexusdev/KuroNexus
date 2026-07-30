import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { fetchCategories } from "@/lib/api/universes";
import { getBookArchive } from "@/lib/api/books";
import { hallLabel, hallName, hallNumber } from "@/lib/halls";
import { BookHall } from "@/components/book/BookHall";

// Kitap salonunun arşiv bölümü. Statik yol, [categorySlug] dinamik yolundan
// önce eşleşir; salon girişi (lobi) bir üst seviyede kalır.

const SLUG = "kitap";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  return { title: t("archiveTitle") };
}

/** Salon numarası ve adı tek kaynaktan: kategori kaydı (yoksa kod adı). */
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
    // Kategori listesi alınamazsa başlık numarasız görünür, sayfa çökmez
    return { label: "", name: fallbackName };
  }
}

export default async function BookArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const [archive, hall, isAdmin] = await Promise.all([
    getBookArchive(),
    getHall(t("hallName")),
    readIsAdmin(),
  ]);

  return (
    <BookHall
      archive={archive}
      hallLabel={hall.label}
      hallName={hall.name}
      isAdmin={isAdmin}
    />
  );
}
