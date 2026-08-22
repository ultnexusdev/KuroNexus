import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import {
  getCharacterCards,
  getCharacterDetail,
  getCharacterImages,
} from "@/lib/api/characters";
import { getCharacterOverlay } from "@/lib/characters";
import { shareCard } from "@/lib/seo";
import { ITACHI_ID } from "@/lib/characters/itachi-experience";
import {
  EXPERIENCE_IDS,
  experienceCompanionIds,
  isExperienceCharacter,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import { CharacterDossier } from "@/components/character/CharacterDossier";
import { ItachiExperience } from "@/components/character/itachi/ItachiExperience";
import { NarutoExperience } from "@/components/character/naruto-uzumaki/NarutoExperience";
import { SasukeExperience } from "@/components/character/sasuke-uchiha/SasukeExperience";
import { IchigoExperience } from "@/components/character/ichigo-kurosaki/IchigoExperience";
import { KakashiExperience } from "@/components/character/kakashi-hatake/KakashiExperience";
import { SakuraExperience } from "@/components/character/sakura-haruno/SakuraExperience";
import { UraharaExperience } from "@/components/character/kisuke-urahara/UraharaExperience";
import { ShikamaruExperience } from "@/components/character/shikamaru-nara/ShikamaruExperience";
import { AizenExperience } from "@/components/character/sousuke-aizen/AizenExperience";
import { JiraiyaExperience } from "@/components/character/jiraiya/JiraiyaExperience";
import { HinataExperience } from "@/components/character/hinata-hyuuga/HinataExperience";
import { KenpachiExperience } from "@/components/character/kenpachi-zaraki/KenpachiExperience";
import { RockLeeExperience } from "@/components/character/rock-lee/RockLeeExperience";
import { VesselExperience } from "@/components/character/sukuna-itadori/VesselExperience";

// Karakter dosyası. Adres AniList karakter numarası: başlıktan slug türetmek
// burada işe yaramaz — aynı adı taşıyan karakterler yaygın ("Ichigo" hem
// Bleach'te hem başka yapımlarda) ve numara kaynağın kendi kimliği.

export const dynamic = "force-dynamic";

/**
 * Elle tasarlanmış deneyim sayfaları — numara → bileşen.
 *
 * Itachi (14) bu haritada YOK ve olmayacak: onun bileşeni `companions`
 * almayan daha eski bir imza taşıyor ve kullanıcı komutu o dosyaların
 * değiştirilmemesini şart koştu (22 Ağustos 2026). Aşağıdaki dal onu ayrıca
 * karşılıyor; `isExperienceCharacter` ise katman atlamada ikisini de kapsar.
 *
 * Sukuna (133701) ve Yuuji Itadori (127212) AYNI bileşene çıkıyor: kap
 * (vessel) ilişkisi tek sayfada anlatılıyor, iki adres aynı sayfayı açıyor
 * ve sayfa hangi numaradan gelindiğine bakarak hangi modda açılacağını
 * kendisi seçiyor.
 */
const EXPERIENCES: ReadonlyMap<
  number,
  ComponentType<CharacterExperienceProps>
> = new Map([
  [EXPERIENCE_IDS.narutoUzumaki, NarutoExperience],
  [EXPERIENCE_IDS.sasukeUchiha, SasukeExperience],
  [EXPERIENCE_IDS.ichigoKurosaki, IchigoExperience],
  [EXPERIENCE_IDS.kakashiHatake, KakashiExperience],
  [EXPERIENCE_IDS.sakuraHaruno, SakuraExperience],
  [EXPERIENCE_IDS.kisukeUrahara, UraharaExperience],
  [EXPERIENCE_IDS.shikamaruNara, ShikamaruExperience],
  [EXPERIENCE_IDS.sousukeAizen, AizenExperience],
  [EXPERIENCE_IDS.jiraiya, JiraiyaExperience],
  [EXPERIENCE_IDS.hinataHyuuga, HinataExperience],
  [EXPERIENCE_IDS.kenpachiZaraki, KenpachiExperience],
  [EXPERIENCE_IDS.rockLee, RockLeeExperience],
  [EXPERIENCE_IDS.yuujiItadori, VesselExperience],
  [EXPERIENCE_IDS.sukuna, VesselExperience],
]);

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
   * deneyim sayfaları için de aynı güvence geçerli (katmanları yok sayılıyor).
   */
  const numericId = Number(characterId);
  const experience = EXPERIENCES.get(numericId);
  const overlay = isExperienceCharacter(numericId)
    ? null
    : getCharacterOverlay(numericId);
  const referencedIds = [
    ...(overlay?.battles ?? []).map((battle) => battle.opponentCharacterId),
    ...(overlay?.bonds ?? []).map((bond) => bond.characterId),
  ].filter((id): id is number => typeof id === "number");
  const cardsPromise = getCharacterCards(referencedIds);

  /*
   * Deneyim sayfalarının yoldaş portreleri KENDİ veritabanımızdan geliyor,
   * AniList'ten değil. Sebep ölçüldü (22 Ağustos 2026): `cards` ucu her yeni
   * kimlik kümesi için canlı bir AniList turu atıyor ve kaynak kapalıyken boş
   * dönüyor; `CharacterImage` kaydı ise her zaman ayakta ve Naruto kadrosunun
   * portreleri orada zaten tam boy duruyor. Deneyim sayfası yoksa liste boş,
   * yani hiç istek atılmıyor.
   */
  const companionsPromise = getCharacterImages(
    experience ? experienceCompanionIds(numericId) : [],
  );

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
   * Diğer on üç deneyim sayfası (22 Ağustos 2026). Her biri kendi bileşen
   * setiyle çiziliyor — aralarında paylaşılan tek şey `CuratorFrame`
   * altyapısı ve `lib/characters/experiences.ts`teki görsel çözümleyicileri
   * (kurator modu şartı: şablon paylaşımı yok).
   */
  if (experience) {
    const Experience = experience;
    const companions = await companionsPromise;
    return (
      <Experience
        detail={detail}
        isAdmin={isAdmin}
        companions={companions}
      />
    );
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
