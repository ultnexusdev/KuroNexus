"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./Lightbox.module.css";

/**
 * Görsel büyütme penceresi.
 *
 * Projede daha önce hiç modal yoktu — `role="dialog"`, `<dialog>`,
 * `aria-modal`, `createPortal` hiçbiri kullanılmamış. En yakın desen
 * `story/LoreDossier` (sabit yan panel + Escape) ama onda ne rol, ne odak
 * tuzağı, ne kaydırma kilidi var. Dolayısıyla burası sıfırdan yazıldı ve
 * eksiksiz yazıldı; ikinci bir modal gerektiğinde kopyalanacak yer burası.
 *
 * ── NEDEN PAYLAŞILAN BİR BİLEŞEN ─────────────────────────────────────────
 * Sahne kareleri film ve dizi sayfasında birebir aynı kodla duruyor, üstelik
 * karakter dosyasındaki galeri de aynı jesti istiyor. Galeri şimdiye kadar
 * "yeni sekmede aç" yapıyordu ve gerekçesi yorumda yazılıydı; sahne
 * karelerine modal eklenince iki oda aynı işi iki farklı biçimde yapacaktı.
 * Üçü de buraya bağlandı.
 * ─────────────────────────────────────────────────────────────────────────
 */

export interface LightboxItem {
  /** Tam boy görselin adresi */
  src: string;
  alt: string;
  /** `next/image` optimizasyonundan geçirilebilir mi (remotePatterns) */
  unoptimized?: boolean;
}

export function Lightbox({
  items,
  index,
  onClose,
  onMove,
}: {
  items: LightboxItem[];
  /** `null` ise pencere kapalı */
  index: number | null;
  onClose: () => void;
  onMove: (next: number) => void;
}) {
  const open = index !== null && items.length > 0;
  const total = items.length;
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  // Kapanınca odağın geri döneceği yer — pencereyi açan düğme
  const openerRef = useRef<Element | null>(null);

  const move = useCallback(
    (delta: number) => {
      if (index === null || total === 0) {
        return;
      }
      // Uçlarda başa/sona sarıyor: son karede "sonraki" tuşunun ölü olması
      // kullanıcıyı çıkmazda bırakır (aynı davranış `BookCurator`da da var)
      onMove((index + delta + total) % total);
    },
    [index, total, onMove],
  );

  /* Klavye: Escape kapatır, ok tuşları gezinir, Tab pencere İÇİNDE döner.
     Dinleyici yalnızca pencere AÇIKKEN bağlanıyor — kapalıyken sayfanın
     ok tuşlarını yutmasın. */
  useEffect(() => {
    if (!open) {
      return;
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      } else if (event.key === "Tab") {
        /* Odak tuzağı (2026-08-22 denetimi): `aria-modal` arkadaki içeriği
           yalnızca ekran okuyucudan gizler, Tab tuşundan GİZLEMEZ — tuzaksız
           hâlde klavye kullanıcısı pencerenin altındaki sayfaya kaçıyordu.
           Penceredeki odaklanabilirler yalnızca düğmeler (kapat + oklar). */
        const dialog = dialogRef.current;
        if (!dialog) {
          return;
        }
        const focusables = dialog.querySelectorAll<HTMLElement>(
          "button:not([disabled])",
        );
        if (focusables.length === 0) {
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (event.shiftKey) {
          if (active === first || !dialog.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else if (active === last || !dialog.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, move, onClose]);

  /* Arkadaki sayfa kaymasın: pencere açıkken gövde kilitli.
     `overflow` eski değerine geri konuyor — sabit "" yazmak, sayfanın kendi
     kaydırma ayarını olan bir yerde silerdi. */
  useEffect(() => {
    if (!open) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /* Odak yönetimi: açılınca kapatma düğmesine gider, kapanınca pencereyi
     açan düğmeye döner. Bunu yapmayan bir modal, klavye kullanıcısını
     arkadaki sayfanın ortasında bırakır. */
  useEffect(() => {
    if (!open) {
      return;
    }
    openerRef.current = document.activeElement;
    closeRef.current?.focus();
    return () => {
      const opener = openerRef.current;
      if (opener instanceof HTMLElement) {
        opener.focus();
      }
    };
  }, [open]);

  const t = useTranslations("lightbox");

  if (!open || index === null) {
    return null;
  }

  const item = items[index];

  return (
    <div
      ref={dialogRef}
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={t("label")}
      /* Karartmaya tıklayınca kapanır. `document`'e dinleyici bağlamak
         yerine hedef karşılaştırması: aksi hâlde pencereyi açan tıklamanın
         kendisi onu anında kapatabilirdi. */
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.stage}>
        <Image
          key={item.src}
          src={item.src}
          alt={item.alt}
          fill
          sizes="100vw"
          className={styles.image}
          unoptimized={item.unoptimized ?? true}
          priority
        />
      </div>

      <button
        ref={closeRef}
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label={t("close")}
      >
        <span aria-hidden>✕</span>
      </button>

      {total > 1 ? (
        <>
          <button
            type="button"
            className={`${styles.nav} ${styles.prev}`}
            onClick={() => move(-1)}
            aria-label={t("prev")}
          >
            <span aria-hidden>‹</span>
          </button>
          <button
            type="button"
            className={`${styles.nav} ${styles.next}`}
            onClick={() => move(1)}
            aria-label={t("next")}
          >
            <span aria-hidden>›</span>
          </button>
          <p className={styles.counter} aria-live="polite">
            {t("counter", { index: index + 1, total })}
          </p>
        </>
      ) : null}
    </div>
  );
}
