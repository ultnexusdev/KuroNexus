import { KuroMark, NexusWordmark } from "@/components/brand/KuroMark";
import styles from "./HeroGlyph.module.css";

/**
 * Holün mührü — marka kilidinin dikey hâli: 黒 konturu, altın ayraç, NEXUS.
 *
 * 12 Ağustos 2026'da değişti. Eskiden glif bir fırça fontuyla (Yuji Boku)
 * yazılıyor, imleç sayfada gezindikçe 3B eğiliyor ve arkasındaki ışık imleci
 * takip ediyordu. Artık kimlik paketindeki gerçek işaret basılıyor ve **hiçbir
 * şey hareket etmiyor**: ne parallax, ne giriş animasyonu, ne imleç takibi.
 * Bunun iki kazancı var — logo her ekranda birebir aynı görünüyor (font
 * yüklenmezse bozulmuyor) ve sayfa artık `pointermove` dinlemiyor.
 *
 * Kalan tek hareket, kullanıcının açıkça istediği hover: mühür üzerine
 * gelindiğinde altın hâle güçlenir ve kilit çok az büyür. Tamamı CSS —
 * bu yüzden bileşen istemci tarafına inmiyor (`"use client"` yok).
 */
export function HeroGlyph() {
  return (
    <div className={styles.glyphCol} role="img" aria-label="KuroNexus">
      <span className={styles.aura} aria-hidden />
      <span className={styles.lockup} aria-hidden>
        <KuroMark className={styles.mark} strokeWidth={1.8} />
        <span className={styles.rule} />
        <NexusWordmark className={styles.word} />
      </span>
    </div>
  );
}
