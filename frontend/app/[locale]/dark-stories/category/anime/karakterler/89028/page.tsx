import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { NotebookExperience } from "@/components/character/izuku-midoriya/NotebookExperience";

/**
 * Izuku Midoriya — AniList #89028 (My Hero Academia).
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
  return experienceMetadata(locale, 89028);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(89028);
  return (
    <NotebookExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
