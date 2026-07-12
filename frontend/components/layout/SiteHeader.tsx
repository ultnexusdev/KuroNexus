import { Link } from "@/lib/i18n/navigation";
import type { Theme } from "@/lib/theme";
import { AccountMenu } from "./AccountMenu";
import { BrandLogo } from "./BrandLogo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import styles from "./SiteHeader.module.css";

export function SiteHeader({ initialTheme }: { initialTheme: Theme }) {

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/" className={styles.brand}>
          <BrandLogo />
        </Link>
      </div>
      <div className={styles.controls}>
        <LocaleSwitcher />
        <AccountMenu initialTheme={initialTheme} />
      </div>
    </header>
  );
}
