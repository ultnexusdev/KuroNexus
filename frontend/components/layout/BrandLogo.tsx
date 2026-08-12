import { KuroMark, NexusWordmark } from "@/components/brand/KuroMark";
import styles from "./BrandLogo.module.css";

/**
 * Header/footer marka logosu — kimlik paketinin yatay kilidi:
 * 黒 mührü | ince ayraç | NEXUS kelime işareti.
 *
 * 12 Ağustos 2026'da metin tabanlı hâlin (fırça fontuyla yazılmış 黒 +
 * letter-spacing'li "Nexus") yerini aldı. Metin sürümü fontun yüklenmesine
 * bağlıydı ve tarayıcıya göre kayıyordu; vektör işaret her yerde aynı.
 *
 * İşaretin DOLGU hâli kullanılıyor, kontur değil: bu boyutta (~33px) kontur
 * çizgileri birbirine değip glifi okunmaz bir lekeye çeviriyor. Kontur hâli
 * yalnızca ana sayfadaki büyük kilitte duruyor (bkz. HeroGlyph).
 *
 * Ölçüler `em` cinsinden: logo, içinde bulunduğu bağlamın `font-size`'ıyla
 * büyür (header 1.15rem, footer varsayılan). Ekran okuyucular için erişilebilir
 * ad "KuroNexus" olarak sabittir (marka adı).
 */
export function BrandLogo() {
  return (
    <span className={styles.logo} role="img" aria-label="KuroNexus">
      <KuroMark className={styles.mark} variant="solid" />
      <span className={styles.divider} aria-hidden />
      <NexusWordmark className={styles.word} />
    </span>
  );
}
