"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { fetchMe } from "@/lib/admin/api";
import { getToken } from "@/lib/admin/auth";
import type { AuthenticatedUser } from "@/lib/api/types";
import type { Theme } from "@/lib/theme";
import { ThemeSwitcher } from "./ThemeSwitcher";
import styles from "./AccountMenu.module.css";

type Tab = "profile" | "appearance";

export function AccountMenu({ initialTheme }: { initialTheme: Theme }) {
  const t = useTranslations("account");
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("profile");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!getToken()) {
      return;
    }
    fetchMe()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    // Anonim ziyaretçiler için tema seçimi herkese açık kalır (AGENTS.md kural 16)
    return <ThemeSwitcher initialTheme={initialTheme} />;
  }

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {user.name}
      </button>
      {open ? (
        <div className={styles.panel}>
          <div className={styles.tabs} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "profile"}
              className={tab === "profile" ? styles.tabActive : styles.tab}
              onClick={() => setTab("profile")}
            >
              {t("profileTab")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "appearance"}
              className={tab === "appearance" ? styles.tabActive : styles.tab}
              onClick={() => setTab("appearance")}
            >
              {t("appearanceTab")}
            </button>
          </div>
          <div className={styles.content}>
            {tab === "profile" ? (
              <dl className={styles.profile}>
                <dt>{t("name")}</dt>
                <dd>{user.name}</dd>
                <dt>{t("email")}</dt>
                <dd>{user.email}</dd>
              </dl>
            ) : (
              <ThemeSwitcher initialTheme={initialTheme} />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
