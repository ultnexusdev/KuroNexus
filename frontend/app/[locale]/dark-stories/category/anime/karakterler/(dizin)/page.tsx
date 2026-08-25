import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { readIsAdmin } from "@/lib/auth/session";
import { getCharacterIndex } from "@/lib/api/characters";
import type { CharacterIndex } from "@/lib/api/types";
import { loadCuratedRoster } from "@/lib/characters/roster";
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
   * Sayfa İKİYE ayrılıyor (24 Ağustos 2026, kullanıcı kararı):
   *   üstte  → "Elle Tasarlanmış Dosyalar" rafı (kendi sayfası olan 37 adres)
   *   altta  → künye ızgarası: SAYFASI OLMAYAN karakterler
   *
   * Önce ikisi iç içeydi — raftaki karakterler ızgarada da görünüyor, aynı
   * portre sayfada iki kez çıkıyordu. Ayrıca hangi karakterin sayfası
   * olduğunu kartın üstündeki bir işaret söylüyordu. İkisi de kalktı: elle
   * tasarlanmış olanlar ızgaradan tamamen düşürülüyor, böylece ızgarada
   * görünen HER kart "bunun henüz sayfası yok" demek oluyor ve işarete
   * gerek kalmıyor.
   *
   * Sayaçlar bütünü anlatmaya devam ediyor: raf + ızgara = toplam karakter.
   * "Başrol" sayacı yerine "elle tasarlanmış" geçti — rol etiketleri
   * kartlardan kalktığı için o sayı ekranda karşılıksız kalıyordu.
   */
  const rafta = new Set(roster.map((c) => c.characterId));
  const kunyeKartlari = index.characters.filter(
    (c) => !rafta.has(c.characterId),
  );
  const zenginIndex: CharacterIndex = {
    ...index,
    characters: kunyeKartlari,
    stats: {
      ...index.stats,
      characters: kunyeKartlari.length + roster.length,
    },
  };

  return (
    <CharacterGallery
      index={zenginIndex}
      hallLabel={hall.label}
      hallName={hall.name}
      isAdmin={isAdmin}
      curatedCount={roster.length}
      shelf={<CuratedShelf roster={roster} />}
    />
  );
}
