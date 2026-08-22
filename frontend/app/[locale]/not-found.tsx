import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import styles from "@/components/hall/PageMessage.module.css";

/**
 * Site geneli 404 — dark-stories dışındaki kanatlar için.
 *
 * Bu dosya yokken `notFound()` çağıran 18 nokta (13'ü sporda: kulüp, efsane,
 * futbolcu, F1 pist/sürücü sayfaları; 4'ü müzikte; 1'i animede) Next'in
 * çıplak varsayılan 404 ekranına düşüyordu: İngilizce, temasız, başlıksız
 * (2026-08-22 denetim bulgusu). Dark-stories kendi `not-found.tsx`ini koruyor
 * — Next en yakın sınırı seçtiği için bu dosya ona karışmaz.
 *
 * Desen `dark-stories/not-found.tsx` ile aynı; tek fark dönüş bağlantısının
 * kanata değil Nexus girişine gitmesi — buradan hangi kanadın 404'üne
 * düşüldüğü bilinemez. Etiket mevcut `home.cta` anahtarından, yeni çeviri
 * anahtarı eklenmedi.
 */
export default function LocaleNotFound() {
  const t = useTranslations("pageState.notFound");
  const tHome = useTranslations("home");

  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <span className={styles.mark} aria-hidden>
          ✕
        </span>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.text}>{t("text")}</p>
        <div className={styles.actions}>
          <Link href="/" className={styles.action}>
            {tHome("cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
