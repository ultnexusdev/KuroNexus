import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getCharacterImages } from "@/lib/api/characters";
import { readIsAdmin } from "@/lib/auth/session";
import { AKATSUKI_IDS, SIX_PATHS } from "@/lib/anime/akatsuki";
import { AkatsukiPathDetail } from "@/components/anime/akatsuki/AkatsukiPathDetail";

/**
 * Six Paths detay sayfası — `/anime/akatsuki/six-paths/[pathKey]`.
 *
 * Kimlik SIX_PATHS anahtarı (deva…naraka); tanınmayan anahtar 404.
 * Metinler i18n'de (kullanıcının verdiği çeviri olduğu gibi), görsel
 * sergiyle AYNI yuvadan (`path:<key>`) okunur — kürasyondan değiştirilen
 * portre karta da detaya da birlikte iner.
 */

export const dynamic = "force-dynamic";

function findPath(pathKey: string) {
  return SIX_PATHS.find((path) => path.key === pathKey) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pathKey: string }>;
}): Promise<Metadata> {
  const { locale, pathKey } = await params;
  const path = findPath(pathKey);
  if (!path) return {};
  const t = await getTranslations({ locale, namespace: "akatsuki" });
  return {
    title: `${t(`paths.${path.key}.name`)} · ${t("pathPage.eyebrow")}`,
    description: t(`paths.${path.key}.short`),
  };
}

export default async function AkatsukiPathPage({
  params,
}: {
  params: Promise<{ locale: string; pathKey: string }>;
}) {
  const { locale, pathKey } = await params;
  const path = findPath(pathKey);
  if (!path) {
    notFound();
  }

  const [images, isAdmin] = await Promise.all([
    getCharacterImages([AKATSUKI_IDS.pain]),
    readIsAdmin(),
  ]);

  return (
    <AkatsukiPathDetail
      locale={locale}
      path={path}
      images={images}
      isAdmin={isAdmin}
    />
  );
}
