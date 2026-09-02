import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { getCharacterDetail, getCharacterImages } from "@/lib/api/characters";
import type { CharacterDetail, CharacterImageRow } from "@/lib/api/types";
import { shareCard } from "@/lib/seo";
import { experienceCompanionIds } from "./experiences";
import { EXPERIENCE_ROSTER } from "./roster";
import { animeHref } from "@/lib/anime/routes";

/**
 * Deneyim sayfalarının ortak sunucu işi — künye, yönetici bayrağı, yoldaş
 * portreleri ve paylaşım kartı.
 *
 * ── NEDEN HER KARAKTERİN AYRI ROTA KLASÖRÜ VAR ───────────────────────────
 * On dört deneyim sayfası önce tek bir `[characterId]` rotasının altında
 * bir haritayla dağıtılıyordu. Ölçüldü (23 Ağustos 2026, üretim derlemesi
 * + `next start` ile sunulan HTML sayılarak):
 *
 *     canlı sürüm (tek Itachi sayfası)   →  7 stil dosyası
 *     tek rota + 13 sayfa                → 19 stil dosyası / 718 KB
 *
 * Sebep App Router'ın stil toplama kuralı: bir rotanın modül grafiğindeki
 * BÜTÜN CSS modülleri o rotanın HTML'ine `<link>` olarak giriyor. Yani
 * Sasuke'yi açan ziyaretçi Kenpachi'nin, Aizen'in ve diğer on birinin
 * stilini de indiriyordu — dahası, elle tasarlanmış sayfası OLMAYAN 180+
 * karakterin künye sayfası da aynı yükü taşıyordu. `import()` ile dinamik
 * yükleme bunu ÇÖZMEDİ (ölçüldü: sayı 19'da kaldı); stil toplama modül
 * grafiğinden yapılıyor, çağrı anından değil.
 *
 * Çözüm Next'in kendi kuralı: **statik parça dinamik parçadan önce eşleşir.**
 * Her deneyim karakteri kendi numarasıyla bir klasör (`karakterler/17/`),
 * yalnızca kendi bileşenini import ediyor; `[characterId]` ise yeniden
 * yalnızca künye dosyası (`CharacterDossier`) rotası oldu. Adresler
 * değişmedi — aynı kural anime arşivinde de kullanılıyor (`arsiv` ve
 * `karakterler` statik parçaları `[slug]`den önce eşleşir).
 */

export interface ExperiencePageData {
  detail: CharacterDetail;
  isAdmin: boolean;
  companions: CharacterImageRow[];
}

/**
 * Sayfanın ihtiyacı olan üç şeyi TEK turda getirir.
 *
 * Yoldaş portreleri AniList kartlarından değil kendi veritabanımızdan
 * geliyor (gerekçe `experiences.ts`te). Künye alınamazsa 404 — bu, adres
 * elle yazıldığında da doğru cevap.
 */
export async function loadExperiencePage(
  characterId: number,
): Promise<ExperiencePageData> {
  // Önce kimlik, sonra veri: küratör taze okur (`lib/api/freshness.ts`).
  // Ziyaretçi için sıralama bedava — çerez yoksa `readIsAdmin` ağa çıkmıyor.
  const isAdmin = await readIsAdmin();
  const [detail, companions] = await Promise.all([
    getCharacterDetail(String(characterId), isAdmin),
    getCharacterImages(experienceCompanionIds(characterId), isAdmin),
  ]);
  if (!detail) {
    notFound();
  }
  return { detail, isAdmin, companions };
}

/**
 * Paylaşım kartı ve başlık — `[characterId]` rotasındakiyle birebir aynı
 * davranış, tek yerde.
 *
 * Açıklamanın spoiler'sız ilk parçası özet olur; spoiler'lı parça arama
 * sonucunda görünürse kapının hiçbir anlamı kalmaz.
 */
export async function experienceMetadata(
  locale: string,
  characterId: number,
): Promise<Metadata> {
  const detail = await getCharacterDetail(String(characterId));
  if (!detail) {
    return {};
  }
  const { character } = detail;
  const summary = character.description.find((segment) => !segment.spoiler);
  const description = summary ? summary.text.slice(0, 160) : undefined;

  /*
   * Başlık AniList'in adını DEĞİL sayfanın adını taşır (24 Ağustos 2026).
   *
   * İki kayıtta ikisi ayrışıyor: #3149 AniList'te "Tobi", #3180 ise "Pain".
   * Bunlar karakterin kendi adı değil taktığı maske ve personası; sayfa
   * Obito'yu ve Nagato'yu anlatıyor. Ölçüldü: düzeltmeden önce sekme adı
   * ve paylaşım kartı "Tobi | KuroNexus" / "Pain | KuroNexus" diyordu —
   * yani sayfanın başlığıyla çelişiyordu ve arama sonucunda yanlış adla
   * görünüyordu. Kadro kaydındaki ad tek doğruluk kaynağı; kayıtta
   * yoksa AniList'inki kullanılıyor (davranış değişmiyor).
   */
  const displayName =
    EXPERIENCE_ROSTER.find((entry) => entry.characterId === characterId)?.name ??
    character.name;

  return {
    title: displayName,
    description,
    ...shareCard({
      title: displayName,
      description,
      locale,
      path: animeHref.character(characterId),
      image: character.image,
    }),
  };
}
