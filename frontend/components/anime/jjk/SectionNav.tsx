import { getTranslations } from "next-intl/server";
import { JJK_ANCHORS } from "@/lib/anime/jjk/anchors";
import styles from "./SectionNav.module.css";

/**
 * BÖLÜMLERE ATLA — sekmeyle gelen kişinin ilk durağı.
 *
 * Bleach `SectionNav` deseninin aynısı: görünmez `<nav>`, içine odak
 * girince açılır (`:focus-within`). ⚠️ `.srOnly`/`clip-path` KULLANILMAZ —
 * çocukları da kırpar, odaklanan bağlantı görünmez kalırdı (P18-b ölçümü).
 * On bir bağlantı `JJK_ANCHORS` defterinden; sıra sayfayla aynı.
 */
export async function SectionNav({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.jjk.toc" });

  return (
    <nav className={styles.nav} aria-label={t("aria")}>
      <ol className={styles.list}>
        {JJK_ANCHORS.map((anchor) => (
          <li key={anchor.anchor}>
            <a className={styles.link} href={`#${anchor.anchor}`}>
              {t(anchor.key)}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
