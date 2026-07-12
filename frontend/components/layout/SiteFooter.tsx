import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { fetchUniverses } from "@/lib/api/universes";
import type { WikiUniverseSummary } from "@/lib/api/types";
import { BrandLogo } from "./BrandLogo";
import styles from "./SiteFooter.module.css";

export async function SiteFooter() {
  const t = await getTranslations("footer");

  let universes: WikiUniverseSummary[] = [];
  try {
    universes = await fetchUniverses();
  } catch {
    // API erişilemezse footer evren sütunu olmadan render edilir, sayfa çökmez
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandColumn}>
          <Link href="/" className={styles.brandLink}>
            <BrandLogo />
          </Link>
          <p className={styles.about}>{t("about")}</p>
        </div>

        <div className={styles.column}>
          <h2 className={styles.columnTitle}>{t("explore")}</h2>
          <ul className={styles.linkList}>
            <li>
              <Link href="/" className={styles.link}>
                {t("home")}
              </Link>
            </li>
            <li>
              <Link href="/dark-stories" className={styles.link}>
                {t("darkStories")}
              </Link>
            </li>
          </ul>
        </div>

        {universes.length > 0 && (
          <div className={styles.column}>
            <h2 className={styles.columnTitle}>{t("universes")}</h2>
            <ul className={styles.linkList}>
              {universes.slice(0, 8).map((universe) => (
                <li key={universe.id}>
                  <Link
                    href={`/dark-stories/${universe.slug}`}
                    className={styles.link}
                  >
                    {universe.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={styles.bottomBar}>
        <span>
          © {new Date().getFullYear()} KuroNexus — {t("tagline")}
        </span>
      </div>
    </footer>
  );
}
