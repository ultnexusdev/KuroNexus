import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { getCharacterDetail } from "@/lib/api/characters";
import { getCharacterOverlay } from "@/lib/characters";
import { CharacterDossier } from "@/components/character/CharacterDossier";

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

  // Elle tasarlanmış katman varsa sayfa onunla zenginleşir; yoksa yalnızca
  // AniList künyesiyle açılır (lib/characters/index.ts)
  const overlay = getCharacterOverlay(detail.character.characterId);

  return (
    <CharacterDossier detail={detail} overlay={overlay} isAdmin={isAdmin} />
  );
}
