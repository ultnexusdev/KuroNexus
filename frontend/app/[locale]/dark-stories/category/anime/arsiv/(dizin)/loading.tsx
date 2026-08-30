import { getLocale, getTranslations } from "next-intl/server";
import KuroLoader from "@/components/ui/KuroLoader";

/**
 * Anime arşivi — yükleme ekranı.
 *
 * ── ⚠️ İSKELET GİTTİ, LOADER GELDİ (30 Ağustos 2026) ─────────────────────
 * Burada `HallSkeleton` duruyordu. Kullanıcı kararı: sitede tek bir
 * yükleme kimliği olsun, hangi bağlantıya basılırsa basılsın aynı 黒
 * ekranı açsın.
 *
 * ⚠️ SEBEP YALNIZCA ZEVK DEĞİL, GÖRÜNÜRLÜK: bir segmentte `loading.tsx`
 * varsa Next.js geçişi ANINDA commit edip bu yedeği basıyor. Böylece
 * `useLinkStatus().pending` daha 180ms dolmadan `false`a dönüyor ve
 * küresel katman (`RouteLoader`) bu rotada HİÇ doğmuyor. Yani buradaki
 * gövde neyse kullanıcının gördüğü yükleme ekranı odur — küresel katmanı
 * beklemek boşuna.
 *
 * ⚠️ Bu dosyanın `(dizin)` rota grubunun İÇİNDE olması ZORUNLU.
 *
 * `loading.tsx` bulunduğu segmentin bütün alt rotalarını Suspense'e sarar ve
 * yanıtı akışa (streaming) çevirir. Akışta HTTP başlıkları, sayfa gövdesi
 * çözülmeden önce gönderilir — dolayısıyla alttaki dinamik rotanın
 * `notFound()` çağrısı artık durum kodunu değiştiremez ve **404 yerine 200
 * dönerdi** (ölçüldü, 2026-08-06: aynı adres loading.tsx varken 200, yokken
 * 404). Arama motorları için bu "yumuşak 404" demek: olmayan sayfalar
 * indekslenir.
 *
 * Parantezli klasör adı adresi değiştirmez, yalnızca segment ağacında ayrı bir
 * dal açar. Kardeş dinamik rota bu dalın dışında kaldığı için gerçek 404'ünü
 * korur.
 *
 * ⚠️ Gecikme prop'u verilmiyor: `KuroLoader`in kendi 180ms'lik saf CSS
 * kalkanı burada DOĞRU olan. Sunucuda çiziliyor ve sert yüklemede ilk
 * HTML'de bulunuyor; bir istemci kancası onu hidrasyona kadar gizlerdi.
 */
export default async function AnimeArchiveLoading() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });

  return <KuroLoader overlay label={t("routeLoading")} />;
}
