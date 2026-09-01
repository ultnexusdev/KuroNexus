"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import styles from "@/components/hall/PageMessage.module.css";

/**
 * Kök hata sınırı — 1 Eylül 2026 denetiminde eklendi (bulgu SEC-01).
 *
 * Öncesinde hata ekranı yalnızca dört alt ağaçta vardı (anime, dark-stories,
 * muzik, spor). Ana sayfanın kendisi (`force-dynamic`, üç API çağrısı),
 * `/karakterler/*` rotaları ve layout seviyesindeki her hata Next'in çıplak
 * varsayılanına düşüyordu: markasız, tek dilli, kullanıcıya çıkış yolu
 * göstermeyen bir ekran.
 *
 * Desen bilinçli olarak `dark-stories/error.tsx`ten alındı — o dosya kanat
 * özel CSS yazmak yerine paylaşılan `PageMessage` modülünü kullanıyor; üç
 * kanadın 53'er satırlık ikiz `error.module.css` dosyalarını çoğaltmamak için
 * aynı yol seçildi.
 *
 * `error.tsx` istemci bileşeni olmak **zorunda**: `reset` bir olay
 * işleyicisidir ve sunucuda çalışamaz. Bu sınır layout'un ALTINDA kalır; kök
 * layout'un kendisi patlarsa `app/global-error.tsx` gerekir — o ayrı bir iş.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("pageState.error");

  useEffect(() => {
    console.error("kök hata sınırı:", error);
  }, [error]);

  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <span className={styles.mark} aria-hidden>
          !
        </span>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.text}>{t("text")}</p>
        {/* Yalnızca `digest`: mesajın kendisi iç ayrıntı sızdırabilir. */}
        {error.digest ? (
          <p className={styles.detail}>{t("code", { digest: error.digest })}</p>
        ) : null}
        <div className={styles.actions}>
          <button type="button" className={styles.action} onClick={reset}>
            {t("retry")}
          </button>
          {/* Kök sınırda çıkış yolu ayrıca gerekli: alt kanat hatasında
              kullanıcı geri gidebiliyor, ana sayfa düştüğünde gidemez. */}
          <Link href="/" className={styles.action}>
            {t("home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
