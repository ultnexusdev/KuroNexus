import styles from "./HallSkeleton.module.css";

/**
 * Salon iskeleti — `loading.tsx` dosyalarının gövdesi.
 *
 * Gerçek salonun iskeletini taklit ediyor (künye şeridi + poster ızgarası),
 * çünkü amaç "bir şey yükleniyor" demek değil, **gelecek şeyin yerini şimdiden
 * tutmak**: veri indiğinde sayfa zıplamıyor.
 *
 * `category` prop'u derinin doğru inmesi için: iskelet varsayılan mor paletle
 * çizilip sonra kanadın rengine atlarsa geçiş, hiç iskelet olmamasından daha
 * rahatsız edici olur.
 */
export function HallSkeleton({
  category,
  tiles = 12,
  stats = 4,
}: {
  category?: "film" | "dizi" | "anime" | "kitap" | "spor" | "kadim-dunyalar";
  /** Izgaradaki poster yer tutucusu sayısı */
  tiles?: number;
  /** Künye şeridindeki kutu sayısı; 0 verilirse şerit hiç çizilmez */
  stats?: number;
}) {
  return (
    <div
      className={styles.hall}
      data-category={category}
      /* Ekran okuyucuya "burası şu an değişiyor" bilgisi; iskelet parçalarının
         kendisi anlamsız olduğu için ağaçtan çıkarılıyor */
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <div className={styles.page} aria-hidden>
        <div className={`${styles.bar} ${styles.eyebrow} ${styles.pulse}`} />
        <div className={`${styles.bar} ${styles.title} ${styles.pulse}`} />
        <div className={`${styles.bar} ${styles.lede} ${styles.pulse}`} />

        {stats > 0 ? (
          <div className={styles.stats}>
            {Array.from({ length: stats }, (_, index) => (
              <div
                key={index}
                className={`${styles.tile} ${styles.stat} ${styles.pulse}`}
              />
            ))}
          </div>
        ) : null}

        <div className={styles.grid}>
          {Array.from({ length: tiles }, (_, index) => (
            <div
              key={index}
              className={`${styles.tile} ${styles.poster} ${styles.pulse}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
