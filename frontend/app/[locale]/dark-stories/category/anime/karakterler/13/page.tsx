import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { SasukeExperience } from "@/components/character/sasuke-uchiha/SasukeExperience";

/**
 * Sasuke Uchiha — AniList #13.
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
  return experienceMetadata(locale, 13);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(13);
  return (
    <SasukeExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
