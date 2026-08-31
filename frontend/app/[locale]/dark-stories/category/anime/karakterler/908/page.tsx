import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { ShunkoExperience } from "@/components/character/yoruichi-shihouin/ShunkoExperience";

/**
 * Yoruichi Shihouin — AniList #908 (Bleach).
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
  return experienceMetadata(locale, 908);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(908);
  return (
    <ShunkoExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
