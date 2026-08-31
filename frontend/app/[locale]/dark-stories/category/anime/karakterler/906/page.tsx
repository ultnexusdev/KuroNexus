import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { ZabimaruExperience } from "@/components/character/renji-abarai/ZabimaruExperience";

/**
 * Renji Abarai — AniList #906 (Bleach).
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
  return experienceMetadata(locale, 906);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(906);
  return (
    <ZabimaruExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
