import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCharacterImages } from "@/lib/api/characters";
import { readIsAdmin } from "@/lib/auth/session";
import { AKATSUKI_IDS, SIX_PATHS } from "@/lib/anime/akatsuki";
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
     * ⚠️ BURASI BİR SÜRE `redirect()` İDİ ve sebebi bu dosyada değildi:
     * üst ağaçtaki `anime/loading.tsx` bütün kanadı akışa çeviriyor, HTTP
     * başlıkları gövde çözülmeden gidiyor ve `notFound()` durum kodunu
     * artık değiştiremiyordu — not-found ekranı 200 gövdesinin içinde
     * kalıyordu (yerelde ölçüldü). Çare o gün ziyaretçiyi sergiye
     * yönlendirmekti.
     *
     * 30 Ağustos 2026'da kök sebep düzeltildi: `loading.tsx` bir alta,
     * `anime/(salon)/` grubuna taşındı ve bu rota akışın dışında kaldı.
     * Artık gerçek 404 verilebiliyor — olmayan anahtar var olan bir
     * sayfaya yönlenmiyor.
     */
    notFound();
  }

  const isAdmin = await readIsAdmin();
  const [images] = await Promise.all([
    getCharacterImages([AKATSUKI_IDS.pain], isAdmin),
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
