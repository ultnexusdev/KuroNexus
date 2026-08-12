import type { ReactNode } from "react";
import { fetchMusicPlaylists } from "@/lib/api/music";
import { readIsAdmin } from "@/lib/auth/session";
import { PlaylistRail } from "@/components/music/PlaylistRail";
import styles from "./layout.module.css";

/**
 * Salon 06 · Müzik — kanat kabuğu.
 *
 * İki iş yapıyor, spor kabuğuyla (`app/[locale]/spor/layout.tsx`) birebir aynı
 * gerekçeyle:
 *
 * 1. `data-category="muzik"` — kategori derisini açıyor. `globals.css`teki
 *    `[data-category="muzik"]` bloğu bütün token setini (yeşil-siyah zemin,
 *    teal aksan, eskitilmiş altın) bu öznitelikle devralıyor. Her sayfa bunu
 *    kendi kökünde tekrar yazsaydı, bir sayfada unutulduğunda o rota derisiz
 *    kalırdı — bu projede yaşanmış hata (`[data-category="dizi"]` derisi hiç
 *    yoktu, dört giriş noktası tanımsız token okuyordu).
 *
 * 2. Müzik-yerel tipografi ölçeği (`layout.module.css`). Değişkenler `.wing`
 *    üzerinde tanımlı, alt ağaç kalıtımla okuyor — kanat dışına sızmıyor.
 *
 * ⚠️ Tür odası derisi (`data-genre`) BURADA DEĞİL: o, oda sayfasının kendi
 * kökünde açılıyor, çünkü yalnızca o sayfada geçerli.
 */
export default async function MusicLayout({
  children,
}: {
  children: ReactNode;
}) {
  /**
   * Sol ray listeleri BURADA çekiliyor, rayın kendisinde değil: ray yalnızca
   * hangi satırın açık olduğunu bilmek için istemci bileşeni. Veriyi oraya
   * taşımak her müzik sayfasında bir istemci isteği daha demek olurdu.
   *
   * ⚠️ Liste alınamazsa ray BOŞ çiziliyor, kanat çökmüyor: bir yan gezinme
   * öğesi yüzünden bütün salonu kaybetmek orantısız (kitap salonundaki
   * `getHallLabel` kararının aynısı).
   */
  const isAdmin = await readIsAdmin();
  const playlists = await fetchMusicPlaylists(isAdmin).catch(() => []);

  return (
    <div data-category="muzik" className={styles.wing}>
      <div className={styles.shell}>
        <PlaylistRail playlists={playlists} />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
