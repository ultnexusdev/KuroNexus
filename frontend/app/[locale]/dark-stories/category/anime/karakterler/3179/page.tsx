import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { KonanExperience } from "@/components/character/konan/KonanExperience";

/**
 * Konan — AniList #3179.
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
  return experienceMetadata(locale, 3179);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(3179);
  return (
    <KonanExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
