"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/lib/i18n/navigation";
import type { Theme } from "@/lib/theme";
import { AccountMenu } from "./AccountMenu";
import { BrandLogo } from "./BrandLogo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import styles from "./SiteHeader.module.css";

import { useTranslations } from "next-intl";
export function SiteHeader({ initialTheme, isAdmin }: { initialTheme: Theme; isAdmin?: boolean }) {
  const t = useTranslations("account");
  const pathname = usePathname();
  // Ana sayfada marka, header'da değil holdeki büyük 黒 glifinde yaşar
  const isHome = /^\/(?:en)?$/.test(pathname ?? "");

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {!isHome && (
          <Link href="/" className={styles.brand}>
            <BrandLogo />
          </Link>
        )}
        {isAdmin && (
          <nav className={styles.nav}>
            <Link href="/admin" className={styles.navLink}>
              {t("adminPanel", { fallback: "Admin Paneli" })}
            </Link>
          </nav>
        )}
      </div>
      <div className={styles.controls}>
        <LocaleSwitcher />
        <AccountMenu initialTheme={initialTheme} isAdmin={isAdmin} />
      </div>
    </header>
  );
}
