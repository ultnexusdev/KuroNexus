"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import styles from "./LocaleSwitcher.module.css";

export function LocaleSwitcher() {
  const t = useTranslations("locale");
  const locale = useLocale();
  const pathname = usePathname();

  const targetLocale = locale === "tr" ? "en" : "tr";
  const flagSrc = targetLocale === "en" ? "/flags/gb.svg" : "/flags/tr.svg";

  return (
    <Link
      href={pathname}
      locale={targetLocale}
      className={styles.link}
      aria-label={t("switch")}
      title={t("switch")}
    >
      <Image
        src={flagSrc}
        alt=""
        width={24}
        height={16}
        className={styles.flag}
      />
    </Link>
  );
}
