import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { KenpachiExperience } from "@/components/character/kenpachi-zaraki/KenpachiExperience";

/**
 * Kenpachi Zaraki — AniList #909.
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
  return experienceMetadata(locale, 909);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(909);
  return (
    <KenpachiExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
