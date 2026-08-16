"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { AkatsukiCloud } from "./AkatsukiCloud";
import styles from "./AkatsukiPortal.module.css";

/**
 * Portal geçişi (kullanıcı fikri, 16 Ağustos v2): Akatsuki kartına tıklama
 * anı — bulut büyüyüp ekranı kaplar, kızıl bir parlama, sonra sayfa.
 * Kartın "özel alan" vaadini tıklama anına taşır.
 *
 * Doğal davranış korunur: orta tık / Ctrl / Shift / Alt ve
 * `prefers-reduced-motion` doğrudan gider — animasyon bir kapı süsü,
 * gezinmenin şartı değil. Süre 460ms: geçiş hissedilir ama bekletmez.
 */
export function AkatsukiPortalLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return; // tarayıcının kendi davranışı (yeni sekme vb.)
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // animasyonsuz doğrudan gezinme
    }
    event.preventDefault();
    setOpen(true);
    window.setTimeout(() => router.push(href), 460);
  }

  return (
    <>
      <Link
        href={href}
        className={className}
        onClick={onClick}
        data-world="akatsuki"
      >
        {children}
      </Link>
      {open ? (
        <span className={styles.portal} data-world="akatsuki" aria-hidden>
          <AkatsukiCloud className={styles.portalCloud} />
          <span className={styles.flash} />
        </span>
      ) : null}
    </>
  );
}
