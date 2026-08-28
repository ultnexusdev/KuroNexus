import { apiUrl, isLocalUpload } from "@/lib/api/client";
import { readCuratedImages } from "@/lib/api/curated-images";
import { readIsAdmin } from "@/lib/auth/session";
import { SLAM_DUNK_ANTHEM_SLOT } from "@/lib/anime/slam-dunk/audio";
import { SLAM_DUNK_SURFACE } from "@/lib/anime/slam-dunk/slots";
import { SlamDunkAudio } from "./SlamDunkAudio";

/**
 * SES DENETİMİNİN SUNUCU KAPISI.
 *
 * Tek işi var: parçanın adresini ve yönetici bayrağını SUNUCUDA okuyup
 * istemci adasına vermek. İkisi de `cache()`li (`readCuratedImages`,
 * `readIsAdmin`), yani sayfadaki elli dört yuvayla aynı isteği paylaşıyor —
 * ses için ayrı bir ağ turu yok.
 *
 * ⚠️ İki farklı origin: küratörün yüklediği dosyalar (`/uploads/…`) API
 * sunucusunda, depodaki varlıklar ön yüzde. `isLocalUpload` ayrımı tek
 * yerden yapıyor — kitap kapakları ve futbolcu kareleri de aynı yardımcıyı
 * bu gerekçeyle kullanıyor.
 *
 * ⚠️ "Geçici gizle" burada da geçerli: küratör parçayı susturmak istediğinde
 * kaydı silmek zorunda kalmıyor.
 */
export async function AnthemControl() {
  const [images, isAdmin] = await Promise.all([
    readCuratedImages(SLAM_DUNK_SURFACE),
    readIsAdmin(),
  ]);

  const record = images[SLAM_DUNK_ANTHEM_SLOT] ?? null;
  const raw = record?.isHidden ? null : (record?.url ?? null);
  const src = raw ? (isLocalUpload(raw) ? apiUrl(raw) : raw) : null;

  /* Ne parça var ne yönetici: hiçbir şey çizme. Ziyaretçi boş bir ses
     düğmesi görmesin — sayfada bir müzik yoksa müzik denetimi de yok. */
  if (!src && !isAdmin) return null;

  return <SlamDunkAudio src={src} isAdmin={isAdmin} />;
}
