import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { ItachiExperience } from "@/components/character/itachi/ItachiExperience";

/**
 * Itachi Uchiha — AniList #14.
 *
 * Elle tasarlanmış deneyim sayfası. Kendi rota klasöründe, çünkü App Router
 * bir rotanın stil dosyalarını modül grafiğinden topluyor: on dört sayfa tek
 * `[characterId]` rotasında toplandığında her karakter sayfası on dokuz stil
 * dosyası indiriyordu (ölçüm ve gerekçe: lib/characters/experience-page.tsx).
 * Statik parça dinamik parçadan önce eşleştiği için adres değişmedi.
 *
 * Itachi'nin bileşeni `companions` almayan daha eski imzayı taşıyor —
 * kullanıcı komutu o dosyalara dokunulmamasını şart koştu (18/22 Ağustos 2026).
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return experienceMetadata(locale, 14);
}

export default async function Page() {
  const { detail, isAdmin } = await loadExperiencePage(14);
  return <ItachiExperience detail={detail} isAdmin={isAdmin} />;
}
