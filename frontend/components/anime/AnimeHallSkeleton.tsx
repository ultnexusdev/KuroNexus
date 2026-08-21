import styles from "./AnimeHallSkeleton.module.css";

/**
 * Salon 04 · Anime — kanadın kendi yükleme iskeleti (`/anime/loading.tsx`).
 *
 * Paylaşılan `HallSkeleton` yerine ayrı bir bileşen olmasının iki sebebi
 * var ve ikisi de ölçülebilir:
 *
 *  1. **Düzen uyuşmuyordu.** Paylaşılan iskelet poster ızgarası çiziyor;
 *     `/anime` sayfasında poster ızgarası yok — hero, iki oda satırı ve
 *     dört dünya kartı var (biri geniş). Veri inince kutular yer
 *     değiştiriyordu. Buradaki ölçüler `page.module.css`ten birebir kopya.
 *
 *  2. **Deri uyuşmuyordu.** Anime kanadı 16 Ağustos'ta glow istisnasına
 *     geçti; paylaşılan iskeleti oraya çekmek film/dizi/kitap/müzik
 *     salonlarını da değiştirirdi. O yüzden `HallSkeleton` dokunulmadan
 *     duruyor — bu bileşen yalnızca anime kanadının.
 *
 * Ekran okuyucu tarafı `HallSkeleton` ile aynı sözleşmede: kap `role=status`
 * + `aria-busy`, iskelet parçaları anlamsız olduğu için ağaçtan çıkarılıyor.
 */
export function AnimeHallSkeleton() {
  return (
    <div
      className={styles.hall}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <div aria-hidden>
        {/* ══ 1 · AÇILIŞ ══ */}
        <header className={styles.opening}>
          <span className={styles.openingPool} />

          <div className={styles.openingInner}>
            <div className={`${styles.bar} ${styles.eyebrow}`} />
            <div className={`${styles.bar} ${styles.title}`} />
            <div className={`${styles.bar} ${styles.lede}`} />
          </div>

          {/* Markalı işaret: 黒 — sayfanın kime ait olduğunu söyler,
              iskeletin dikkatini çalmaz (küçük, köşede, nefes alan). */}
          <span className={styles.mark}>
            <span className={styles.markGlyph}>黒</span>
          </span>
        </header>

        {/* ══ 2 · ODALAR ══ — ANIME_SECTIONS iki kayıt taşıyor */}
        <div className={styles.rooms}>
          {Array.from({ length: 2 }, (_, index) => (
            <div key={index} className={styles.room}>
              <div className={`${styles.bar} ${styles.roomTitle}`} />
              <div className={`${styles.bar} ${styles.roomDesc}`} />
            </div>
          ))}
        </div>

        {/* ══ 3 · DÜNYALAR ══ — Akatsuki (geniş) + üç kart */}
        <section className={styles.worlds}>
          <div className={`${styles.bar} ${styles.worldsLabel}`} />

          <ul className={styles.worldGrid}>
            {Array.from({ length: 4 }, (_, index) => (
              <li
                key={index}
                className={styles.worldItem}
                {...(index === 0 ? { "data-featured": "" } : {})}
              >
                <div className={styles.card}>
                  <span className={styles.cardMeter} />
                  <span className={styles.cardName} />
                  <span className={styles.cardLine} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
