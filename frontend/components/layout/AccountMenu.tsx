"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Theme } from "@/lib/theme";
import { ThemeSwitcher } from "./ThemeSwitcher";
import styles from "./AccountMenu.module.css";

export function AccountMenu({ initialTheme }: { initialTheme: Theme }) {
  const t = useTranslations("account");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {t("preferences")}
      </button>
      {open ? (
        <div className={styles.panel}>
          <div className={styles.content}>
            <div style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              {t("appearanceTab")}
            </div>
            <ThemeSwitcher initialTheme={initialTheme} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
