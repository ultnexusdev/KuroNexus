import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { VesselExperience } from "@/components/character/sukuna-itadori/VesselExperience";

/**
 * Sukuna — AniList #133701.
 *
 * Elle tasarlanmış deneyim sayfası. Kendi rota klasöründe, çünkü App Router
 * bir rotanın stil dosyalarını modül grafiğinden topluyor: on dört sayfa tek
 * `[characterId]` rotasında toplandığında her karakter sayfası on dokuz stil
 * dosyası indiriyordu (ölçüm ve gerekçe: lib/characters/experience-page.tsx).
 * Statik parça dinamik parçadan önce eşleştiği için adres değişmedi.
 *
 * KAP SAYFASININ İKİ ADRESİNDEN BİRİ — bu adres Sukuna modunda açar.
 * Bileşen ve stil dosyası 127212 ile ORTAK; iki rota aynı parçayı yükler.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return experienceMetadata(locale, 133701);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(133701);
  return (
    <VesselExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
