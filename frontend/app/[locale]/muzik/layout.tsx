import type { ReactNode } from "react";
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
export default function MusicLayout({ children }: { children: ReactNode }) {
  return (
    <div data-category="muzik" className={styles.wing}>
      {children}
    </div>
  );
}
