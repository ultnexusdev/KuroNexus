import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAnimeArchive } from "@/lib/api/anime";
import { getCharacterCards, getCharacterImages } from "@/lib/api/characters";
import { readIsAdmin } from "@/lib/auth/session";
import { akatsukiCharacterIds } from "@/lib/anime/akatsuki";
import { shareCard } from "@/lib/seo";
import { AkatsukiExhibit } from "@/components/anime/akatsuki/AkatsukiExhibit";

/**
 * `/anime/akatsuki` — salonun içinde ayrı bir dünya.
 *
 * Sayfa iki istekle çizilir: kadro görselleri (kendi diskimiz) ve AniList
 * portre yedekleri. İkisi de düşerse sergi dokulu yuvalarla yine açılır —
 * yazılı içerik i18n'de, görsele borçlu değil.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "akatsuki" });
  const title = `${t("title")} · ${t("subtitle")}`;
  const description = t("lede");
  return {
    title,
    description,
    ...shareCard({ title, description, locale, path: "/anime/akatsuki" }),
  };
}

export default async function AkatsukiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const ids = akatsukiCharacterIds();

  const [images, cards, isAdmin, archive] = await Promise.all([
    getCharacterImages(ids),
    getCharacterCards(ids),
    readIsAdmin(),
    // Nexus paneli kapısı: arşivdeki Naruto serisi. Alınamazsa kapı
    // çizilmez, sergi çökmez (getirici boş arşive düşüyor).
    getAnimeArchive(),
  ]);

  const naruto = archive.entries
    .filter((entry) => entry.title.toLowerCase().includes("naruto"))
    .sort((a, b) => a.title.length - b.title.length)[0];

  return (
    <AkatsukiExhibit
      locale={locale}
      images={images}
      cards={cards}
      isAdmin={isAdmin}
      narutoSlug={naruto?.slug ?? null}
    />
  );
}
