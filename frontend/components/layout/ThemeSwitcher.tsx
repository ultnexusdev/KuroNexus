"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { THEMES, THEME_COOKIE, type Theme } from "@/lib/theme";
import styles from "./ThemeSwitcher.module.css";

const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 yıl

export function ThemeSwitcher({ initialTheme }: { initialTheme: Theme }) {
  const t = useTranslations("theme");
  const [activeTheme, setActiveTheme] = useState<Theme>(initialTheme);

  function applyTheme(theme: Theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.cookie = `${THEME_COOKIE}=${theme};path=/;max-age=${THEME_COOKIE_MAX_AGE};samesite=lax`;
    setActiveTheme(theme);
  }

  return (
    <div className={styles.group} role="group" aria-label={t("label")}>
      {THEMES.map((theme) => (
        <button
          key={theme}
          type="button"
          className={theme === activeTheme ? styles.active : styles.button}
          aria-pressed={theme === activeTheme}
          aria-label={t(theme)}
          title={t(theme)}
          onClick={() => applyTheme(theme)}
        >
          <span className={styles.swatch} data-swatch={theme} />
        </button>
      ))}
    </div>
  );
}
