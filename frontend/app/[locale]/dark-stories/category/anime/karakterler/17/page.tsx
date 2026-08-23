import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { NarutoExperience } from "@/components/character/naruto-uzumaki/NarutoExperience";

/**
 * Naruto Uzumaki — AniList #17.
 *
 * Elle tasarlanmış deneyim sayfası. Kendi rota klasöründe, çünkü App Router
 * bir rotanın stil dosyalarını modül grafiğinden topluyor: on dört sayfa tek
 * `[characterId]` rotasında toplandığında her karakter sayfası on dokuz stil
 * dosyası indiriyordu (ölçüm ve gerekçe: lib/characters/experience-page.tsx).
 * Statik parça dinamik parçadan önce eşleştiği için adres değişmedi.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return experienceMetadata(locale, 17);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(17);
  return (
    <NarutoExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
