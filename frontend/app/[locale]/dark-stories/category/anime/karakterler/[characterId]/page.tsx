import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { getCharacterCards, getCharacterDetail } from "@/lib/api/characters";
import { getCharacterOverlay } from "@/lib/characters";
import { shareCard } from "@/lib/seo";
import { CharacterDossier } from "@/components/character/CharacterDossier";
import { animeHref } from "@/lib/anime/routes";

// Karakter dosyası. Adres AniList karakter numarası: başlıktan slug türetmek
// burada işe yaramaz — aynı adı taşıyan karakterler yaygın ("Ichigo" hem
// Bleach'te hem başka yapımlarda) ve numara kaynağın kendi kimliği.
//
// ⚠️ ELLE TASARLANMIŞ SAYFALAR BURADA DEĞİL. On dört karakterin (Itachi,
// Naruto, Sasuke, Ichigo, Kakashi, Sakura, Urahara, Shikamaru, Aizen,
// Jiraiya, Hinata, Kenpachi, Rock Lee ve kap sayfasının iki adresi) kendi
// rota klasörü var — `karakterler/17/`, `karakterler/13/` gibi. Statik parça
// dinamik parçadan önce eşleştiği için adresler aynı; ayrılmalarının sebebi
// stil dosyalarının rota başına toplanması (ölçüm:
// lib/characters/experience-page.tsx). Bu dosya artık YALNIZCA künye
// dossier'i çiziyor.

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
      path: animeHref.character(characterId),
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
   * koşulda reject etmez ve boş listeyle hiç istek atmaz (lib/api/characters.ts).
   */
  const numericId = Number(characterId);
  const overlay = getCharacterOverlay(numericId);
  const referencedIds = [
    ...(overlay?.battles ?? []).map((battle) => battle.opponentCharacterId),
    ...(overlay?.bonds ?? []).map((bond) => bond.characterId),
  ].filter((id): id is number => typeof id === "number");
  const cardsPromise = getCharacterCards(referencedIds);

  const isAdmin = await readIsAdmin();
  const [detail] = await Promise.all([
    getCharacterDetail(characterId, isAdmin),
  ]);
  if (!detail) {
    notFound();
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
