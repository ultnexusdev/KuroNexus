import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { ReliquaryExperience } from "@/components/character/suguru-getou/ReliquaryExperience";

/**
 * Suguru Getou — AniList #133699 (Jujutsu Kaisen).
 *
 * Elle tasarlanmış deneyim sayfası. Kendi statik rota klasöründe, çünkü App
 * Router bir rotanın stil dosyalarını modül grafiğinden topluyor (ölçüm ve
 * gerekçe: lib/characters/experience-page.tsx). Statik parça dinamik
 * parçadan önce eşleştiği için adres değişmedi.
 * 30 Ağustos 2026'da bileşen seti YENİDEN yazıldı (Faz 2, Dalga 5).
 * Eski set 2026-09-01'de silindi (denetim B-06); git geçmişinde duruyor.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return experienceMetadata(locale, 133699);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(133699);
  return (
    <ReliquaryExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
