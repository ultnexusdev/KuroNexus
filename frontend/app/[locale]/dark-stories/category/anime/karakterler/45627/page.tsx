import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { PrecisionExperience } from "@/components/character/levi/PrecisionExperience";

/**
 * Levi Ackerman — AniList #45627 (Attack on Titan).
 *
 * Elle tasarlanmış deneyim sayfası. Kendi statik rota klasöründe, çünkü App
 * Router bir rotanın stil dosyalarını modül grafiğinden topluyor (ölçüm ve
 * gerekçe: lib/characters/experience-page.tsx). Statik parça dinamik
 * parçadan önce eşleştiği için adres değişmedi.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return experienceMetadata(locale, 45627);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(45627);
  return (
    <PrecisionExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
