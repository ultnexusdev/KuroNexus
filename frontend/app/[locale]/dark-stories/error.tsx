"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import styles from "@/components/hall/PageMessage.module.css";

/**
 * Kanat içi hata ekranı.
 *
 * Bu dosya yokken beklenmeyen bir hata (ör. `fetchCategories()` — o çağrının
 * try/catch'i yok) Next'in varsayılan hata sayfasını gösteriyordu.
 *
 * `error.tsx` istemci bileşeni olmak **zorunda**: `reset` bir olay
 * işleyicisidir ve sunucuda çalışamaz.
 */
export default function DarkStoriesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("pageState.error");

  useEffect(() => {
    // Sunucu tarafındaki iz zaten Coolify loglarında; buradaki kayıt
    // tarayıcı konsolunda hangi rotanın düştüğünü görmek için
    console.error("dark-stories hata sınırı:", error);
  }, [error]);

  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <span className={styles.mark} aria-hidden>
          !
        </span>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.text}>{t("text")}</p>
        {/* `digest` üretimde hatanın kimliği — kullanıcı bunu bildirdiğinde
            sunucu logunda karşılığı bulunabiliyor. Mesajın kendisi bilinçli
            olarak gösterilmiyor: iç ayrıntı sızdırabilir. */}
        {error.digest ? (
          <p className={styles.detail}>{t("code", { digest: error.digest })}</p>
        ) : null}
        <div className={styles.actions}>
          <button type="button" className={styles.action} onClick={reset}>
            {t("retry")}
          </button>
        </div>
      </div>
    </div>
  );
}
