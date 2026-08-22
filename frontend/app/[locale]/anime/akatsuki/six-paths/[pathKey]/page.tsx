import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/lib/i18n/navigation";
import { getCharacterImages } from "@/lib/api/characters";
import { readIsAdmin } from "@/lib/auth/session";
import { AKATSUKI_IDS, SIX_PATHS } from "@/lib/anime/akatsuki";
import { animeHref } from "@/lib/anime/routes";
import { shareCard } from "@/lib/seo";
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
  const title = `${t(`paths.${path.key}.name`)} · ${t("pathPage.eyebrow")}`;
  const description = t(`paths.${path.key}.short`);
  return {
    title,
    description,
    ...shareCard({
      title,
      description,
      locale,
      path: `/anime/akatsuki/six-paths/${pathKey}`,
    }),
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
    /*
     * `notFound()` DEĞİL, bilinçli: üst ağaçtaki loading.tsx kabuğu akışla
     * erken 200 gönderiyor ve not-found ekranı 200 gövdesinde kalıyordu
     * (yerelde ölçüldü). Bilinmeyen anahtar elle yazılmış bir adrestir —
     * doğru cevap ziyaretçiyi serginin kendisine götürmek.
     */
    redirect({ href: animeHref.akatsuki(), locale });
    // next-intl'in redirect'i `never` tiplenmediği için TS daraltması elle
    return null;
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
