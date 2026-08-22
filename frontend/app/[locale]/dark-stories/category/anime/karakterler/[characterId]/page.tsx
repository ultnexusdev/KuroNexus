import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { getCharacterCards, getCharacterDetail } from "@/lib/api/characters";
import { getCharacterOverlay } from "@/lib/characters";
import { shareCard } from "@/lib/seo";
import { ITACHI_ID } from "@/lib/characters/itachi-experience";
import { CharacterDossier } from "@/components/character/CharacterDossier";
import { ItachiExperience } from "@/components/character/itachi/ItachiExperience";

// Karakter dosyası. Adres AniList karakter numarası: başlıktan slug türetmek
// burada işe yaramaz — aynı adı taşıyan karakterler yaygın ("Ichigo" hem
// Bleach'te hem başka yapımlarda) ve numara kaynağın kendi kimliği.

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; characterId: string }>;
}): Promise<Metadata> {
  const { locale, characterId } = await params;
  const detail = await getCharacterDetail(characterId);
  if (!detail) {
    return {};
  }
  const { character } = detail;
  // Açıklamanın spoiler'sız ilk parçası özet olur; spoiler'lı parça arama
  // sonucunda görünürse kapının hiçbir anlamı kalmaz
  const summary = character.description.find((segment) => !segment.spoiler);
  const description = summary ? summary.text.slice(0, 160) : undefined;
  return {
    title: character.name,
    description,
    ...shareCard({
      title: character.name,
      description,
      locale,
      path: `/dark-stories/category/anime/karakterler/${characterId}`,
      image: character.image,
    }),
  };
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const { characterId } = await params;

  /*
   * Katman ve referans kartları detay isteğini BEKLEMEZ (2026-08-22): katman
   * haritasının anahtarı adresteki AniList numarasının kendisi, yani detay
   * yanıtına gerek yok. Eskiden kartlar detaydan SONRA çekiliyordu — katmanlı
   * karakter sayfalarında ikinci bir tam ağ turu. `getCharacterCards` hiçbir
   * koşulda reject etmez ve boş listeyle hiç istek atmaz (lib/api/characters.ts),
   * Itachi dalı için de aynı güvence geçerli (ITACHI_ID katmanı yok sayılıyor).
   */
  const numericId = Number(characterId);
  const overlay = numericId === ITACHI_ID ? null : getCharacterOverlay(numericId);
  const referencedIds = [
    ...(overlay?.battles ?? []).map((battle) => battle.opponentCharacterId),
    ...(overlay?.bonds ?? []).map((bond) => bond.characterId),
  ].filter((id): id is number => typeof id === "number");
  const cardsPromise = getCharacterCards(referencedIds);

  const [detail, isAdmin] = await Promise.all([
    getCharacterDetail(characterId),
    readIsAdmin(),
  ]);
  if (!detail) {
    notFound();
  }

  /*
   * Itachi (14): klasik dossier'in YERİNE interaktif deneyim sayfası
   * (kullanıcı komutu, 18 Ağustos 2026). İçerik lib/characters/
   * itachi-experience.ts'te; görselleri kendi kaydının images alanından
   * okur, referans kartı istekleri bu dala hiç girmez.
   */
  if (detail.character.characterId === ITACHI_ID) {
    return <ItachiExperience detail={detail} isAdmin={isAdmin} />;
  }

  /*
   * Elle tasarlanmış katman varsa sayfa onunla zenginleşir; yoksa yalnızca
   * AniList künyesiyle açılır (lib/characters/index.ts). Katman ve savaş/ilişki
   * satırlarındaki karakterlerin portreleri yukarıda, detayla PARALEL yola
   * çıktı — kimlikler katmandan TEK istekte çekiliyor; her biri için ayrı
   * çağrı altı ayrı AniList turu demekti. Katman yoksa istek hiç atılmıyor.
   */
  const cards = await cardsPromise;

  return (
    <CharacterDossier
      detail={detail}
      overlay={overlay}
      cards={cards}
      isAdmin={isAdmin}
    />
  );
}
