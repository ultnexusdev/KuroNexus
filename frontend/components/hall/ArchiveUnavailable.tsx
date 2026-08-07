"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./ArchiveUnavailable.module.css";

/**
 * "Arşive şu an ulaşılamıyor" ekranı.
 *
 * Neden var: dört salon da arşivi `catch { return EMPTY_ARCHIVE }` deseniyle
 * çekiyor ve boş yanıtı "arşiv gerçekten boş" sanıp öyle yazıyordu. Kullanıcı
 * 250 kitaplık bir arşivin önünde "arşivin boş" mesajı görüyor, üstelik
 * yenilemenin yolunu bulamıyordu — sayfa kendini hatasız sanıyordu.
 * 6 Ağustos 2026'da backend konteyneri `Exited` kaldığında tam bu yaşandı.
 *
 * `router.refresh()` sunucu bileşenlerini yeniden çizdiriyor; arşiv
 * getiricileri `no-store` olduğu için istek gerçekten tekrar atılıyor.
 * Tam sayfa yenilemeye göre farkı: kaydırma konumu ve süzgeç durumu korunuyor.
 */
export function ArchiveUnavailable() {
  const t = useTranslations("common.unavailable");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  // Denendiği hâlde hâlâ buradaysak metin değişiyor: aynı butona üçüncü kez
  // basmak yerine kullanıcı sorunun geçici olmadığını anlasın
  const [tried, setTried] = useState(false);

  return (
    <div className={styles.box} role="status">
      <p className={styles.title}>{t("title")}</p>
      <p className={styles.text}>{tried ? t("stillDown") : t("text")}</p>
      <button
        type="button"
        className={styles.retry}
        disabled={pending}
        onClick={() => {
          setTried(true);
          startTransition(() => router.refresh());
        }}
      >
        {pending ? t("retrying") : t("retry")}
      </button>
    </div>
  );
}
