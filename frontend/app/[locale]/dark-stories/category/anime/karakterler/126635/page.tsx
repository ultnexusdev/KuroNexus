import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { ShadowMenagerieExperience } from "@/components/character/megumi-fushiguro/ShadowMenagerieExperience";

/**
 * Megumi Fushiguro — AniList #126635 (Jujutsu Kaisen).
 *
 * Elle tasarlanmış deneyim sayfası. Kendi statik rota klasöründe, çünkü App
 * Router bir rotanın stil dosyalarını modül grafiğinden topluyor (ölçüm ve
 * gerekçe: lib/characters/experience-page.tsx). Statik parça dinamik
 * parçadan önce eşleştiği için adres değişmedi.
 * 30 Ağustos 2026'da bileşen seti YENİDEN yazıldı (Faz 2, Dalga 5).
 * Eski set silinmedi: components/character/.deprecated/megumi-fushiguro/ altında duruyor.
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
    <ShadowMenagerieExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
