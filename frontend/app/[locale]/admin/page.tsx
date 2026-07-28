"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import styles from "./page.module.css";

export default function AdminHomePage() {
  const t = useTranslations("admin");

  return (
    <AdminGuard>
      <section className={styles.page}>
        <h1 className={styles.heading}>{t("title")}</h1>
        <nav className={styles.menu}>
          {/* Temürkan Efsaneleri'nin yazım masası — kitabın kendi kapısı */}
          <Link href="/admin/atolye/temurkan-efsaneleri" className="card">
            {t("studio.title")}
          </Link>
          <Link href="/admin/film" className="card">
            {t("film.title")}
          </Link>
          <Link href="/admin/stories" className="card">
            {t("stories.title")}
          </Link>
          <Link href="/admin/universes" className="card">
            {t("universes.title")}
          </Link>
          <Link href="/admin/wiki" className="card">
            {t("wiki.title")}
          </Link>
          <Link href="/admin/universe-categories" className="card">
            {t("universeCategories.title")}
          </Link>
          <Link href="/admin/ambient-tracks" className="card">
            {t("ambient.title")}
          </Link>
          <Link href="/admin/transfer-news" className="card">
            {t("transferNews.title")}
          </Link>
          <Link href="/admin/squad" className="card">
            {t("squad.title")}
          </Link>
        </nav>
      </section>
    </AdminGuard>
  );
}
