import { getLocale, getTranslations } from "next-intl/server";
import KuroLoader from "@/components/ui/KuroLoader";

/**
 * Müzik kanadının yükleme ekranı.
 *
 * ── ⚠️ İSKELET GİTTİ, LOADER GELDİ (30 Ağustos 2026) ─────────────────────
 * Burada `HallSkeleton category="muzik"` duruyordu. Kullanıcı kararı:
 * sitede tek bir yükleme kimliği olsun, hangi bağlantıya basılırsa
 * basılsın aynı 黒 ekranı açsın.
 *
 * ⚠️ Bir segmentte `loading.tsx` varsa Next.js geçişi ANINDA commit edip
 * bu yedeği basıyor; `useLinkStatus().pending` daha 180ms dolmadan
 * `false`a dönüyor ve küresel katman (`RouteLoader`) bu rotada HİÇ
 * doğmuyor. Buradaki gövde neyse kullanıcının gördüğü yükleme ekranı odur.
 *
 * ⚠️ BU DOSYA ZATEN VARDI — yani akış (streaming) davranışı ve onun
 * `notFound()` üzerindeki etkisi DEĞİŞMEDİ; yeni bir `loading.tsx`
 * eklenmedi. (Bilinen açık iş: `/muzik/tur/<yok>` bu yüzden 404 yerine
 * 200 dönüyor ve bu değişiklikten ÖNCE de öyleydi.)
 */
export default async function MusicLoading() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });

  return <KuroLoader overlay label={t("routeLoading")} />;
}
