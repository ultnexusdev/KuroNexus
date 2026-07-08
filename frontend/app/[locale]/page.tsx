import { useTranslations } from "next-intl";
import styles from "./page.module.css";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>{t("title")}</h1>
      <p className={styles.tagline}>{t("tagline")}</p>
      <p className={styles.intro}>{t("intro")}</p>
    </section>
  );
}
