import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { getCharacterIndex } from "@/lib/api/characters";
import type { CharacterIndex } from "@/lib/api/types";
import { CURATED_IDS, loadCuratedRoster } from "@/lib/characters/roster";
import { CuratedShelf } from "@/components/character/CuratedShelf";
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
  locale: string,
): Promise<{ label: string; name: string }> {
  try {
    const categories = await fetchCategories();
    return {
      label: hallLabel(hallNumber(categories, "anime")),
      name: hallName(categories, "anime", fallbackName, locale),
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
  const [index, hall, isAdmin, roster] = await Promise.all([
    getCharacterIndex(),
    getHall(t("hallName"), locale),
    readIsAdmin(),
    loadCuratedRoster(),
  ]);

  /*
   * Elle tasarlanmış sayfası olup dizinde HİÇ görünmeyenler ızgaraya
   * ekleniyor (24 Ağustos 2026).
   *
   * Dizin, arşivdeki serilerin AniList kadro listelerinden derleniyor ve o
   * listeler yalnızca başrol/yardımcı kadroyu taşıyor. Iruka, Konohamaru,
   * Minato, Kushina, Tenten, Temari, Sai, Yamato, Kankurō ve Kabuto hiçbir
   * kadro listesine girmiyor — yani sayfaları yazıldığı hâlde dizinden
   * ulaşılamıyordu. Arama ve seri süzgeci de onları bulamıyordu.
   *
   * Eklenenler listenin BAŞINA konuyor: elle yazılmış dosyalar üstte dursun.
   * Zaten dizinde olanlara dokunulmuyor — AniList'ten gelen rolü, seslendireni
   * ve seri bağları korunuyor, yalnızca kartlarına işaret ekleniyor.
   */
  const mevcut = new Set(index.characters.map((c) => c.characterId));
  const eksikler = roster.filter((c) => !mevcut.has(c.characterId));
  const zenginIndex: CharacterIndex = {
    ...index,
    characters: [...eksikler, ...index.characters],
    stats: {
      ...index.stats,
      characters: index.stats.characters + eksikler.length,
      /* `main` DEĞİŞMİYOR: eklenenlerin rolü yok (bkz. roster.ts) ve
         "başrol" AniList'in kadro ölçüsü — sayaç o ölçüye sadık kalmalı. */
    },
  };

  return (
    <CharacterGallery
      index={zenginIndex}
      hallLabel={hall.label}
      hallName={hall.name}
      isAdmin={isAdmin}
      curatedIds={CURATED_IDS}
      shelf={<CuratedShelf roster={roster} />}
    />
  );
}
