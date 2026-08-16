import type { ReactNode } from "react";
import styles from "./layout.module.css";

/**
 * Salon 04 · Anime — kanat kabuğu.
 *
 * Spor/müzik kabuklarıyla birebir aynı iki iş:
 *
 * 1. `data-category="anime"` — kategori derisi (mürekkep moru) BİR KEZ
 *    burada açılıyor. Eski ağaçta altı bileşen bunu kendi kökünde tekrar
 *    yazıyordu; kanat kendi ağacına taşınırken deri tek kaynağa alındı
 *    (dizi derisinin hiç açılmaması bu projede yaşanmış hata sınıfı).
 *
 * 2. Anime-yerel tipografi ölçeği (`layout.module.css`). Kanadın display
 *    sesi BEBAS — kanat zaten sayı/raf dilini Bebas'la konuşuyor ve afiş
 *    kapitali anime posterinin doğal sesi. Spor'un Petrona'sı bilinçli
 *    olarak ödünç alınMIYOR (kanatlar birbirinin sesini almaz,
 *    `app/[locale]/layout.tsx`teki font gerekçesi).
 *
 * ⚠️ Akatsuki derisi (`data-world="akatsuki"`) BURADA DEĞİL: yalnızca sergi
 * sayfasının kökünde açılıyor — müzikteki `data-genre` deseni.
 */
export default function AnimeLayout({ children }: { children: ReactNode }) {
  return (
    <div data-category="anime" className={styles.wing}>
      {children}
    </div>
  );
}
