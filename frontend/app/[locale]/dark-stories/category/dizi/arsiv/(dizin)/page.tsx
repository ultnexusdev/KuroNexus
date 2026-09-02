import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { getShowArchive } from "@/lib/api/shows";
import { getHall } from "@/lib/halls";
import { ShowHall } from "@/components/show/ShowHall";
import { shareCard } from "@/lib/seo";
import { showHref } from "@/lib/show/routes";

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
    ...shareCard({ title, locale, path: showHref.archive() }),
  };
}

export default async function ShowArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "show" });
  const isAdmin = await readIsAdmin();
  const [archive, hall] = await Promise.all([
    getShowArchive(isAdmin),
    getHall("dizi", t("hallName"), locale),
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
