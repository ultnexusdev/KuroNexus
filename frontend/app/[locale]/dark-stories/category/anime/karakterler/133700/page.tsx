import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { ResonanceExperience } from "@/components/character/nobara-kugisaki/ResonanceExperience";

/**
 * Nobara Kugisaki — AniList #133700.
 *
 * Elle tasarlanmış deneyim sayfası. Kendi rota klasöründe, çünkü App Router
 * bir rotanın stil dosyalarını modül grafiğinden topluyor (ölçüm ve gerekçe:
 * lib/characters/experience-page.tsx). Statik parça dinamik parçadan önce
 * eşleştiği için adres değişmedi.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return experienceMetadata(locale, 133700);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(133700);
  return (
    <ResonanceExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
