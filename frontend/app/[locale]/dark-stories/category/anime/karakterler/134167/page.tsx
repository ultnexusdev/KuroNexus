import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { ArmoryExperience } from "@/components/character/maki-zenin/ArmoryExperience";

/**
 * Maki Zen'in — AniList #134167 (Jujutsu Kaisen).
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
  return experienceMetadata(locale, 134167);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(134167);
  return (
    <ArmoryExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
