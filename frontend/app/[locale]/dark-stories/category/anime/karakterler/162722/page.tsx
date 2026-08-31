import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { HeavenRestrictionExperience } from "@/components/character/touji-fushiguro/HeavenRestrictionExperience";

/**
 * Tōji Fushiguro — AniList #162722 (Jujutsu Kaisen).
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
  return experienceMetadata(locale, 162722);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(162722);
  return (
    <HeavenRestrictionExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
