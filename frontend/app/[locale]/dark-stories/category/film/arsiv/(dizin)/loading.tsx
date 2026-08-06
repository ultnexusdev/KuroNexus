import { HallSkeleton } from "@/components/hall/HallSkeleton";

/**
 * Film arsivi — yükleme iskeleti.
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
 */
export default function Loading() {
  return <HallSkeleton category="film" tiles={12} stats={4} />;
}
