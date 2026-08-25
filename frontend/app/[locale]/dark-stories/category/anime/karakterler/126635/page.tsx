import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { TenShadowsExperience } from "@/components/character/megumi-fushiguro/TenShadowsExperience";

/**
 * Megumi Fushiguro — AniList #126635.
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
  return experienceMetadata(locale, 126635);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(126635);
  return (
    <TenShadowsExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
