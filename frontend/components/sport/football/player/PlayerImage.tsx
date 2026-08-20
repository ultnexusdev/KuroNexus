"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { apiUrl } from "@/lib/api/client";
import { uploadImage, uploadImageFromUrl } from "@/lib/admin/api";
import type { PlayerImageSlot } from "@/lib/sport/favourite-players";
import { usePlayerCurator } from "./PlayerCurator";
import styles from "./PlayerImage.module.css";

/**
 * TEK GÖRSEL YUVASI.
 *
 * Sayfadaki her fotoğraf bundan geçiyor ve üç durumdan birinde oluyor:
 *
 *   1 KÜRATÖR KOPYASI  — `overrides[slot.id]` doluysa o çiziliyor.
 *   2 GERÇEK FOTOĞRAF  — `slot.placeholder` false ise `slot.src` çiziliyor.
 *   3 YER TUTUCU       — ikisi de yoksa TASARLANMIŞ bir çerçeve: köşegen
 *                        tarama dokusu, kadraj notu ve "FOTO EKLENECEK"
 *                        etiketi. `data-placeholder` DOM'da duruyor.
 *
 * ⚠️ YER TUTUCUDA AĞ İSTEĞİ YOK. `placeholder: true` iken `<img>` hiç
 * basılmıyor — 17 yuvalık bir sayfada her açılışta 17 adet 404 üretmek hem
 * konsolu kirletir hem bağlantı havuzunu boşa harcar.
 *
 * ── İKİ KATMAN: `frame` + `clip` (20 Ağustos 2026 düzeltmesi) ────────────
 * Kırpma eskiden `.frame` üzerindeydi ve küratör düzenleyicisi de onun
 * içindeydi. Sonuç: 36 pikselik arma yuvasında düzenle düğmesi ve açılan
 * panel KIRPILIYORDU — kullanıcı bildirimi, "bağlantı ile yükleme
 * görünmüyor". Artık kırpma içteki `.clip` katmanında; `.frame` taşmaya
 * izin veriyor ve düzenleyici dışarı çıkabiliyor. Görselin kendisi yine
 * kırpılıyor, yani hiçbir düzen bozulmuyor.
 */
export function PlayerImage({
  slot,
  className,
  fit = "cover",
  position,
  eager,
  decorative,
  noEdit,
}: {
  slot: PlayerImageSlot;
  className?: string;
  fit?: "cover" | "contain";
  position?: string;
  /** Hero gibi ilk kıvrımdaki kareler için */
  eager?: boolean;
  /** `true` ise alt boş basılıyor (yanında zaten metin var) */
  decorative?: boolean;
  /**
   * Küratör düğmesini BASTIRMA.
   *
   * Yuva bir `<button>` ya da `<a>` içindeyse gerekli: iç içe etkileşimli öğe
   * hem geçersiz HTML hem de tıklamanın yanlış yere gitmesi demek. Aynı yuva
   * sayfada başka bir yerde düzenlenebiliyorsa burada bastırmak kayıp değil.
   */
  noEdit?: boolean;
}) {
  const curator = usePlayerCurator();
  const override = curator?.overrides[slot.id];
  const [failed, setFailed] = useState(false);

  const source = override
    ? apiUrl(override)
    : slot.placeholder
      ? null
      : slot.src;

  const showPlaceholder = !source || failed;

  return (
    <span
      className={[styles.frame, className].filter(Boolean).join(" ")}
      data-placeholder={showPlaceholder ? "" : undefined}
      data-slot={slot.id}
    >
      {/* Kırpma YALNIZCA burada. `.frame` taşmaya izin veriyor ki küratör
          paneli küçük yuvalarda kesilmesin. */}
      <span className={styles.clip}>
        {showPlaceholder ? (
          <span className={styles.holder} aria-hidden="true">
            <span className={styles.holderMark}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="1.5" />
                <circle cx="8.5" cy="10" r="1.6" />
                <path d="m4 17 5-5 4 4 3-2.5 4 3.5" />
              </svg>
            </span>
            <span className={styles.holderLabel}>FOTO EKLENECEK</span>
            {slot.hint ? (
              <span className={styles.holderHint}>{slot.hint}</span>
            ) : null}
            <span className={styles.holderPath}>{slot.src}</span>
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={source}
            alt={decorative ? "" : slot.alt}
            width={slot.width}
            height={slot.height}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : undefined}
            decoding="async"
            onError={() => setFailed(true)}
            style={{ objectFit: fit, objectPosition: position }}
          />
        )}
      </span>

      {curator?.curating && !noEdit ? <SlotEditor slot={slot} /> : null}
    </span>
  );
}

/**
 * Yuvanın düzenleyicisi — yalnızca küratör modu açıkken çiziliyor.
 *
 * ── PANEL NEDEN PORTAL ───────────────────────────────────────────────────
 * Panel `document.body`ye taşınıyor ve `position: fixed` ile düğmenin yanına
 * konumlanıyor. Sebebi ölçülmüş bir arıza: sayfadaki kaplar (galeri karesi,
 * kariyer karesi, gece kartı, hero) `overflow: hidden` taşıyor ve panel
 * bunların içinde kalırsa KESİLİYOR. Portal bütün kırpma ve yığın bağlamı
 * sorunlarını tek hamlede kapatıyor.
 *
 * ⚠️ PORTAL OLAY BALONCUĞUNU DURDURMAZ. React sentetik olayları DOM ağacında
 * değil BİLEŞEN ağacında yükselir; panel `body`de dursa bile tıklama yine
 * ebeveyn `<button>`a ulaşır. Galeri karesinde bunun sonucu şuydu: adres
 * kutusuna basınca ışık kutusu açılıyor ve yazmak imkânsız hâle geliyordu
 * (kullanıcı bildirimi). O yüzden panel kökü olayları AÇIKÇA durduruyor.
 */
function SlotEditor({ slot }: { slot: PlayerImageSlot }) {
  const curator = usePlayerCurator();
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const urlRef = useRef<HTMLInputElement | null>(null);
  /* Adres kutusuna odak YALNIZCA BİR KEZ. `useEffect` ile yapılamıyordu:
     panel açıldığı ilk render'da `pos` henüz null, yani portal DOM'da yok ve
     ref boş. Konum yerleştikten sonra tetiklemek için `pos`a bağlamak ise
     her kaydırmada odağı geri çalardı. Callback ref ikisini de çözüyor. */
  const focusedRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  const POP_WIDTH = 268;

  const place = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // Görünür alanın dışına taşmasın: sağdan ve alttan kelepçeleniyor.
    const left = Math.min(
      Math.max(8, r.left),
      Math.max(8, window.innerWidth - POP_WIDTH - 8),
    );
    const top = Math.min(r.bottom + 6, window.innerHeight - 220);
    setPos({ top: Math.max(8, top), left });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    window.addEventListener("scroll", place, { passive: true, capture: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, { capture: true });
      window.removeEventListener("resize", place);
    };
  }, [open, place]);

  // Panel kapanınca odak bayrağı sıfırlanıyor (aşağıdaki callback ref okuyor).
  useEffect(() => {
    if (!open) focusedRef.current = false;
  }, [open]);

  if (!curator) return null;
  const { labels, setSlot, clearSlot, overrides } = curator;

  async function run(action: () => Promise<{ url: string }>) {
    setBusy(true);
    setError(false);
    try {
      const result = await action();
      setSlot(slot.id, result.url);
      setOpen(false);
      setUrl("");
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  /** Tıklama/klavye olayları ebeveyn düğmeye ya da bağlantıya ULAŞMASIN. */
  const swallow = {
    onClick: (e: React.SyntheticEvent) => e.stopPropagation(),
    onPointerDown: (e: React.SyntheticEvent) => e.stopPropagation(),
    onMouseDown: (e: React.SyntheticEvent) => e.stopPropagation(),
    onKeyDown: (e: React.KeyboardEvent) => e.stopPropagation(),
  };

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        className={styles.editButton}
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          setOpen((v) => !v);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        aria-expanded={open}
        title={`${labels.edit} — ${slot.id}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 20h4L19 9a2.5 2.5 0 0 0-3.5-3.5L4 16.5V20z" />
        </svg>
        <span>{slot.id}</span>
      </button>

      {open && pos
        ? createPortal(
            <div
              className={styles.pop}
              style={{ top: pos.top, left: pos.left, width: POP_WIDTH }}
              {...swallow}
            >
              <div className={styles.popHead}>
                <code>{slot.id}</code>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={labels.close}
                >
                  ×
                </button>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void run(() => uploadImage(file));
                  event.target.value = "";
                }}
              />
              <button
                type="button"
                className={styles.popPrimary}
                disabled={busy}
                onClick={() => fileRef.current?.click()}
              >
                {busy ? labels.busy : labels.fromFile}
              </button>

              <label className={styles.popField}>
                <span>{labels.fromUrl}</span>
                <span className={styles.popRow}>
                  <input
                    ref={(el) => {
                      urlRef.current = el;
                      if (el && !focusedRef.current) {
                        focusedRef.current = true;
                        el.focus();
                      }
                    }}
                    type="url"
                    value={url}
                    placeholder={labels.urlPlaceholder}
                    onChange={(event) => setUrl(event.target.value)}
                    onKeyDown={(event) => {
                      event.stopPropagation();
                      if (event.key === "Enter" && url.trim()) {
                        event.preventDefault();
                        void run(() => uploadImageFromUrl(url.trim()));
                      }
                    }}
                    disabled={busy}
                  />
                  <button
                    type="button"
                    disabled={busy || url.trim().length === 0}
                    onClick={() => void run(() => uploadImageFromUrl(url.trim()))}
                  >
                    {labels.fetch}
                  </button>
                </span>
              </label>

              {overrides[slot.id] ? (
                <button
                  type="button"
                  className={styles.popReset}
                  onClick={() => {
                    clearSlot(slot.id);
                    setOpen(false);
                  }}
                >
                  {labels.reset}
                </button>
              ) : null}

              {error ? (
                <span className={styles.popError}>{labels.error}</span>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
