import { getLocale, getTranslations } from "next-intl/server";
import KuroLoader from "@/components/ui/KuroLoader";

/**
 * Anime salonunun yükleme ekranı — YALNIZCA `/anime`.
 *
 * ── ⚠️ `(salon)` GRUBUNUN İÇİNDE OLMASI ZORUNLU (30 Ağustos 2026) ────────
 * Bu dosya bir üstte, `app/[locale]/anime/` altında duruyordu. Oradayken
 * kanadın BÜTÜN alt rotalarını Suspense'e sarıp yanıtı akışa (streaming)
 * çeviriyordu; akışta HTTP başlıkları gövde çözülmeden gönderildiği için
 * alttaki `notFound()` durum kodunu artık değiştiremiyordu. Bedeli
 * `six-paths/[pathKey]` sayfasında görüldü: gerçek 404 veremediği için
 * bilinmeyen anahtarı sergiye yönlendirmek zorunda kalmıştı.
 *
 * Parantezli klasör adı adresi DEĞİŞTİRMEZ (`/anime` hâlâ `/anime`),
 * yalnızca segment ağacında ayrı bir dal açar. `akatsuki`, `naruto`,
 * `bleach`, `slam-dunk` artık bu dalın dışında — hem gerçek 404'lerini
 * geri aldılar hem de geçişlerinde küresel katman (`RouteLoader`) devreye
 * giriyor. Aynı desen arşivlerde `(dizin)` adıyla zaten kurulu.
 *
 * ⚠️ BURAYA GERİ TAŞIMA. Bir üst klasör, kanadın tamamı demek.
 *
 * ── ⚠️ İSKELET GİTTİ, LOADER GELDİ (29 Ağustos 2026) ─────────────────────
 * Burada `AnimeHallSkeleton` duruyordu: kanadın gerçek düzenini birebir
 * taklit eden bir içerik iskeleti. Kullanıcı kararı onun yerine markanın
 * kendi yükleme ekranını istedi — 黒 ve dönen halkalar. Bileşen duruyor
 * (`components/anime/AnimeHallSkeleton.tsx`) ama artık çağrılmıyor;
 * silinmedi, yazılma gerekçesi (poster ızgarası uyuşmuyordu) hâlâ geçerli.
 *
 * ── ⚠️ TEK BAYT JS YOK ───────────────────────────────────────────────────
 * Sunucu bileşeni: SVG + CSS. Titreme kalkanı da (180ms) saf CSS gecikmesi
 * — bir istemci kancası bu yedeği hidrasyona kadar gizlerdi ve sert
 * yüklemede ekran boş kalırdı (gerekçe `KuroLoader.tsx`te).
 */
export default async function AnimeHallLoading() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });

  return <KuroLoader overlay label={t("routeLoading")} />;
}
