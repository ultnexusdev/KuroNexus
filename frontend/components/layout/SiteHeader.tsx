import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { Theme } from "@/lib/theme";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LocaleSwitcher } from "./LocaleSwitcher";
import styles from "./SiteHeader.module.css";

export function SiteHeader({ initialTheme }: { initialTheme: Theme }) {
  const t = useTranslations();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/" className={styles.brand}>
          {t("common.siteName")}
        </Link>
        <nav className={styles.nav}>
          <Link href="/dark-stories" className={styles.navLink}>
            {t("nav.darkStories")}
          </Link>
        </nav>
      </div>
      <div className={styles.controls}>
        <ThemeSwitcher initialTheme={initialTheme} />
        <LocaleSwitcher />
      </div>
    </header>
  );
}
