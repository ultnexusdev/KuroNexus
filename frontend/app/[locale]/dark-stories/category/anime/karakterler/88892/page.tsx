import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { DetonationExperience } from "@/components/character/katsuki-bakugou/DetonationExperience";

/**
 * Katsuki Bakugō — AniList #88892 (My Hero Academia).
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
  return experienceMetadata(locale, 88892);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(88892);
  return (
    <DetonationExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
