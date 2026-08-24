import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { ShinoExperience } from "@/components/character/shino-aburame/ShinoExperience";

/**
 * Shino Aburame — AniList #3428.
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
  return experienceMetadata(locale, 3428);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(3428);
  return (
    <ShinoExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
