import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { getCharacterCards, getCharacterDetail } from "@/lib/api/characters";
import { getCharacterOverlay } from "@/lib/characters";
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
  params: Promise<{ characterId: string }>;
}): Promise<Metadata> {
  const { characterId } = await params;
  const detail = await getCharacterDetail(characterId);
  if (!detail) {
    return {};
  }
  const { character } = detail;
  // Açıklamanın spoiler'sız ilk parçası özet olur; spoiler'lı parça arama
  // sonucunda görünürse kapının hiçbir anlamı kalmaz
  const summary = character.description.find((segment) => !segment.spoiler);
  return {
    title: character.name,
    description: summary ? summary.text.slice(0, 160) : undefined,
  };
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const { characterId } = await params;
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

  // Elle tasarlanmış katman varsa sayfa onunla zenginleşir; yoksa yalnızca
  // AniList künyesiyle açılır (lib/characters/index.ts)
  const overlay = getCharacterOverlay(detail.character.characterId);

  /*
   * Savaş ve ilişki satırlarında adı geçen karakterlerin portreleri.
   * Kimlikler katmandan çıkarılıp TEK istekte çekiliyor; her biri için ayrı
   * çağrı altı ayrı AniList turu demekti. Katman yoksa istek hiç atılmıyor.
   */
  const referencedIds = [
    ...(overlay?.battles ?? []).map((battle) => battle.opponentCharacterId),
    ...(overlay?.bonds ?? []).map((bond) => bond.characterId),
  ].filter((id): id is number => typeof id === "number");
  const cards = await getCharacterCards(referencedIds);

  return (
    <CharacterDossier
      detail={detail}
      overlay={overlay}
      cards={cards}
      isAdmin={isAdmin}
    />
  );
}
