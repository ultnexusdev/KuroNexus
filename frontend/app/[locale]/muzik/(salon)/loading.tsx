import { getLocale, getTranslations } from "next-intl/server";
import KuroLoader from "@/components/ui/KuroLoader";

/**
 * Müzik salonunun yükleme ekranı — YALNIZCA `/muzik`.
 *
 * ── ⚠️ `(salon)` GRUBUNUN İÇİNDE OLMASI ZORUNLU (30 Ağustos 2026) ────────
 * Bu dosya bir üstte, `app/[locale]/muzik/` altında duruyordu. Oradayken
 * kanadın BÜTÜN alt rotalarını Suspense'e sarıp yanıtı akışa (streaming)
 * çeviriyordu; akışta HTTP başlıkları gövde çözülmeden gönderildiği için
 * alttaki `notFound()` durum kodunu artık değiştiremiyordu. Dört rota
 * birden zarar görüyordu — `tur/[genreSlug]`, `[actSlug]`,
 * `[actSlug]/[albumSlug]`, `liste/[slug]`: olmayan tür/sanatçı/albüm/liste
 * adresleri 404 yerine 200 dönüyor, yani indekslenebiliyordu.
 *
 * Parantezli klasör adı adresi DEĞİŞTİRMEZ (`/muzik` hâlâ `/muzik`),
 * yalnızca segment ağacında ayrı bir dal açar. Kardeş rotalar bu dalın
 * dışında kaldığı için gerçek 404'lerini geri aldılar; geçişlerinde de
 * küresel katman (`RouteLoader`) devreye giriyor. Aynı desen arşivlerde
 * `(dizin)` adıyla zaten kurulu.
 *
 * ⚠️ BURAYA GERİ TAŞIMA. Bir üst klasör, kanadın tamamı demek.
 *
 * ── ⚠️ İSKELET GİTTİ, LOADER GELDİ (30 Ağustos 2026) ─────────────────────
 * Burada `HallSkeleton category="muzik"` duruyordu. Kullanıcı kararı:
 * sitede tek bir yükleme kimliği olsun, hangi bağlantıya basılırsa
 * basılsın aynı 黒 ekranı açsın.
 */
export default async function MusicLoading() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });

  return <KuroLoader overlay label={t("routeLoading")} />;
}
