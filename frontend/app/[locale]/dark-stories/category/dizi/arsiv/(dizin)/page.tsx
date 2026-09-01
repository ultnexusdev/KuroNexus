import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { getShowArchive } from "@/lib/api/shows";
import { getHall } from "@/lib/halls";
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

export default async function ShowArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "show" });
  const [archive, hall, isAdmin] = await Promise.all([
    getShowArchive(),
    getHall("dizi", t("hallName"), locale),
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
