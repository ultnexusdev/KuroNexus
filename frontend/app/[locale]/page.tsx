import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { HeroVideo } from "@/components/home/HeroVideo";
import styles from "./page.module.css";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <section className={styles.hero}>
      <HeroVideo className={styles.heroVideo} />
      <div className={styles.heroOverlay}></div>
      
      <div className={styles.heroContent}>
        <h1 className={styles.title}>
        <BrandLogo />
      </h1>
      <p className={styles.tagline}>{t("tagline")}</p>
      <p className={styles.intro}>{t("intro")}</p>
      <Link href="/dark-stories" className={styles.adminLink}>
        {t("explore")}
      </Link>
      </div>
    </section>
  );
}
