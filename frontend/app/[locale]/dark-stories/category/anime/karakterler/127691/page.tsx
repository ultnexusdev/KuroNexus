import type { Metadata } from "next";
import {
  experienceMetadata,
  loadExperiencePage,
} from "@/lib/characters/experience-page";
import { GojoExperience } from "@/components/character/satoru-gojou/GojoExperience";

/**
 * Satoru Gojou — AniList #127691.
 *
 * Elle tasarlanmış deneyim sayfası. Kendi rota klasöründe, çünkü App Router
 * bir rotanın stil dosyalarını modül grafiğinden topluyor (ölçüm ve gerekçe:
 * lib/characters/experience-page.tsx). Statik parça dinamik parçadan önce
 * eşleştiği için adres değişmedi.
 *
 * ⚠️ Sayfa 26 Ağustos 2026'da yeniden kuruluyor ("UNTOUCHABLE", P00–P11).
 * Önceki kompozisyon ("İki Uç", 蒼+赫→茈 birleştirici) commit aabd4c9'da
 * duruyor — bir bölüm oradan bir parça devralacaksa kaynak orası.
 * Adres, metadata sözleşmesi ve kadro kaydı DEĞİŞMEDİ.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return experienceMetadata(locale, 127691);
}

export default async function Page() {
  const { detail, isAdmin, companions } = await loadExperiencePage(127691);
  return (
    <GojoExperience detail={detail} isAdmin={isAdmin} companions={companions} />
  );
}
