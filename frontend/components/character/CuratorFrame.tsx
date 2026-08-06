"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./CuratorFrame.module.css";

/**
 * Kürator modu anahtarı.
 *
 * Yükleme yuvaları sayfaya dağılmış durumda (kapak portresi, her yetenek
 * kartı, galeri) — kullanıcı onları "mevcut yuvaların altında" istedi.
 * Dağınık yuvaları tek bir anahtardan açıp kapatmanın en ucuz yolu bu:
 * sarmalayıcı `data-curating` niteliği taşıyor, yuvalar da
 * `[data-curator-slot]` işaretini; kapalıyken CSS onları gizliyor.
 *
 * Neden React context değil: yuvalar SUNUCU bileşenlerinin içinde çiziliyor.
 * Bir context sağlayıcısı onları istemci sınırına çekerdi ve sayfanın
 * tamamı tarayıcıya JS olarak inerdi. Nitelik + CSS, sunucu çizimini
 * bozmadan aynı işi yapıyor.
 *
 * Anahtarın kendisi bu bileşenle birlikte yalnızca yöneticiye iniyor;
 * ziyaretçi bu JS'i hiç almıyor (çizim `isAdmin` ile sunucuda kesiliyor).
 */
export function CuratorFrame({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  const t = useTranslations("character.curator");
  const [curating, setCurating] = useState(false);

  // Ziyaretçide sarmalayıcı hiç çizilmiyor: ne anahtar, ne nitelik.
  // `children` sunucuda çizilmiş olarak geçtiği için buradan geçmesi ona
  // ek maliyet getirmiyor.
  if (!isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className={styles.frame} data-curating={curating ? "true" : "false"}>
      <div className={styles.bar}>
        <button
          type="button"
          className={curating ? styles.on : styles.off}
          onClick={() => setCurating((value) => !value)}
          aria-pressed={curating}
        >
          {curating ? t("on") : t("off")}
        </button>
        {curating ? <span className={styles.hint}>{t("hint")}</span> : null}
      </div>
      {children}
    </div>
  );
}
