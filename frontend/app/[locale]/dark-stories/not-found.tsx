import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import styles from "@/components/hall/PageMessage.module.css";

/**
 * Kanat içi 404.
 *
 * Bu dosya yokken `notFound()` çağıran sekizden fazla nokta (film/dizi/anime/
 * kitap detayları, evren ve hikâye sayfaları) Next'in çıplak varsayılan 404
 * ekranına düşüyordu: sayfanın dili yok, geri dönüş yolu yok, sitenin
 * görünüşüyle ilgisi yok.
 *
 * ⚠️ Bilinen sınır: detay getiricileri (`getMovieDetail`, `getAnimeDetail` …)
 * `catch` içinde `null` döndürüyor, yani backend 500 verse bile kullanıcı
 * "böyle bir şey yok" görüyor. Doğrusu yalnızca gerçek 404'te `null` dönmek —
 * bu ayrı ve daha geniş bir iş, `docs/2-saat-oturumu.md` içinde listeli.
 */
export default function DarkStoriesNotFound() {
  const t = useTranslations("pageState.notFound");
  const tStories = useTranslations("stories");

  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <span className={styles.mark} aria-hidden>
          ✕
        </span>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.text}>{t("text")}</p>
        <div className={styles.actions}>
          <Link href="/dark-stories" className={styles.action}>
            {tStories("backToList")}
          </Link>
        </div>
      </div>
    </div>
  );
}
