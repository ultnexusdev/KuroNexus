import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { TentenExperience } from "@/components/character/tenten/TentenExperience";

/**
 * Tenten — AniList #3710.
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
  return experienceMetadata(locale, 3710);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(3710);
  return (
    <TentenExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
