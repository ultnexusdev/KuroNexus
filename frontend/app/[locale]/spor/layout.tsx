import type { ReactNode } from "react";
import styles from "./layout.module.css";

/**
 * Salon 06 · Spor — kanat kabuğu.
 *
 * İki iş yapıyor, ikisi de tek yerde olsun diye burada:
 *
 * 1. `data-category="spor"` — kategori derisini açıyor. `globals.css`teki
 *    `[data-category="spor"]` bloğu bütün token setini (zemin, yüzey, altın
 *    aksan, kırmızı) bu öznitelikle devralıyor. Eskiden her spor sayfası bunu
 *    kendi kökünde tekrar yazıyordu; kanadın tamamı tek kapıdan geçtiği için
 *    artık bir kez yazılıyor.
 *
 * 2. Spor-yerel tipografi ölçeği (`layout.module.css`). Değişkenler `.wing`
 *    üzerinde tanımlı, alt ağaç kalıtımla okuyor — kanat dışına sızmıyor.
 */
export default function SportLayout({ children }: { children: ReactNode }) {
  return (
    <div data-category="spor" className={styles.wing}>
      {children}
    </div>
  );
}
