import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { VesselExperience } from "@/components/character/sukuna-itadori/VesselExperience";

/**
 * Yuuji Itadori — AniList #127212.
 *
 * Elle tasarlanmış deneyim sayfası. Kendi rota klasöründe, çünkü App Router
 * bir rotanın stil dosyalarını modül grafiğinden topluyor: on dört sayfa tek
 * `[characterId]` rotasında toplandığında her karakter sayfası on dokuz stil
 * dosyası indiriyordu (ölçüm ve gerekçe: lib/characters/experience-page.tsx).
 * Statik parça dinamik parçadan önce eşleştiği için adres değişmedi.
 *
 * KAP SAYFASININ İKİ ADRESİNDEN BİRİ. 127212 ve 133701 aynı bileşene
 * çıkıyor; bileşen künyedeki numaraya bakıp hangi modda açılacağını
 * kendisi seçiyor (bu adres Itadori modunda açar).
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return experienceMetadata(locale, 127212);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(127212);
  return (
    <VesselExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
