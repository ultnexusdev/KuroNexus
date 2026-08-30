"use client";

import styles from "./CuratorDock.module.css";

/**
 * KÜRATÖR HAPI — sitenin TEK küratör anahtarı görünümü.
 *
 * ── NEDEN ORTAK BİR BİLEŞEN ──────────────────────────────────────────────
 * Anahtar on altı yerde ayrı ayrı yazılmıştı (yedi salon × kendi CSS'i) ve
 * hepsi sayfanın BAŞINDA, akışın içinde duruyordu. Uzun sayfalarda —
 * evrenler, futbolcu dosyaları, arşiv rafları — modu kapatmak için en başa
 * dönmek gerekiyordu (kullanıcı bildirimi, 30 Ağustos 2026).
 *
 * Artık hepsi bu hapı çiziyor: sağ altta sabit, her an görünür, her salonda
 * AYNI. Kaynak desen futbolcu sayfasının `PlayerCurator.toggle`'ıydı —
 * kullanıcının işaret ettiği "spordaki gibi" olan buydu.
 *
 * ── NEDEN ÇAĞIRANIN SARMALAYICISI DURUYOR ────────────────────────────────
 * Hap `position: fixed`, yani akıştan çıkıyor. Çağıran taraftaki eski
 * sarmalayıcılar (`.switchRow`, `.curatorSwitch`) yerinde bırakıldı ve artık
 * yalnızca PANELİ tutuyorlar: panelin sayfa akışındaki yeri değişmedi,
 * yalnızca düğme oradan ayrıldı.
 *
 * ── RENK ─────────────────────────────────────────────────────────────────
 * Token'lar `globals.css` `:root`ta ve LİTERAL: hap bir araç, içerik değil —
 * yedi salonda da aynı görünmeli (gerekçe orada yazılı).
 */
export function CuratorDock({
  on,
  onToggle,
  label,
  expanded,
  hint,
}: {
  /** Küratör modu açık mı — hapın dolu hâli */
  on: boolean;
  onToggle: () => void;
  /** Düğmenin metni. Açık/kapalı ayrımını çağıran yapıyor. */
  label: string;
  /** Düğme bir panel açıyorsa `aria-expanded` basılsın */
  expanded?: boolean;
  /** Açıkken hapın ÜSTÜNDE beliren tek satırlık açıklama */
  hint?: string;
}) {
  return (
    <div className={styles.dock}>
      {on && hint ? <p className={styles.hint}>{hint}</p> : null}
      <button
        type="button"
        className={styles.button}
        data-on={on || undefined}
        aria-pressed={on}
        aria-expanded={expanded}
        onClick={onToggle}
      >
        {/* Kalem — çizilmiş SVG, emoji değil (ikon sistemi kuralı) */}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 20h4L19 9a2.5 2.5 0 0 0-3.5-3.5L4 16.5V20z" />
          <path d="M14 6.5 17.5 10" />
        </svg>
        <span>{label}</span>
      </button>
    </div>
  );
}
