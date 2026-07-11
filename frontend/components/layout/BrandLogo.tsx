import styles from "./BrandLogo.module.css";

// Görsel logo: fırça kaligrafisiyle 黒 (kuro) + modern dizilimli NEXUS.
// Ekran okuyucular için erişilebilir ad "KuroNexus" olarak sabittir (marka adı).
export function BrandLogo() {
  return (
    <span className={styles.logo} role="img" aria-label="KuroNexus">
      <span className={styles.kuro} aria-hidden>
        黒
      </span>
      <span className={styles.nexus} aria-hidden>
        Nexus
      </span>
    </span>
  );
}
