import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCharacterCards, getCharacterImages } from "@/lib/api/characters";
import { readIsAdmin } from "@/lib/auth/session";
import { akatsukiCharacterIds } from "@/lib/anime/akatsuki";
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
  return {
    title: `${t("title")} · ${t("subtitle")}`,
    description: t("lede"),
  };
}

export default async function AkatsukiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const ids = akatsukiCharacterIds();

  const [images, cards, isAdmin] = await Promise.all([
    getCharacterImages(ids),
    getCharacterCards(ids),
    readIsAdmin(),
  ]);

  return (
    <AkatsukiExhibit
      locale={locale}
      images={images}
      cards={cards}
      isAdmin={isAdmin}
    />
  );
}
