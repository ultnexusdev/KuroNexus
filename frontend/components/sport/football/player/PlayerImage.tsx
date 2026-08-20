"use client";

import { useRef, useState } from "react";
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
 *                        etiketi. `data-placeholder` özniteliği DOM'da
 *                        duruyor, yani dışarıdan da sorgulanabilir.
 *
 * ⚠️ YER TUTUCUDA AĞ İSTEĞİ YOK. `placeholder: true` iken `<img>` hiç
 * basılmıyor — 10 yuvalık bir sayfada her açılışta 10 adet 404 üretmek hem
 * konsolu kirletir hem bağlantı havuzunu boşa harcar. Gerçek dosya `src`
 * yoluna konduğunda defterdeki bayrak `false` yapılıyor (ya da küratör
 * modundan yükleniyor, o anında geçersiz kılıyor).
 *
 * ── HATA DAVRANIŞI ───────────────────────────────────────────────────────
 * Gerçek bir kare 404 verirse (`onError`) yuva sessizce yer tutucuya
 * düşüyor. Kırık görsel simgesi hiçbir koşulda görünmüyor — brief'in
 * "broken image bırakma" kuralının uygulaması bu.
 */
export function PlayerImage({
  slot,
  className,
  fit = "cover",
  position,
  eager,
  decorative,
}: {
  slot: PlayerImageSlot;
  className?: string;
  fit?: "cover" | "contain";
  position?: string;
  /** Hero gibi ilk kıvrımdaki kareler için */
  eager?: boolean;
  /** `true` ise alt boş basılıyor (yanında zaten metin var) */
  decorative?: boolean;
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

      {curator?.curating ? <SlotEditor slot={slot} /> : null}
    </span>
  );
}

/**
 * Yuvanın düzenleyicisi — yalnızca küratör modu açıkken çiziliyor.
 *
 * İki yol, tek hedef: dosya da adres de `/admin/uploads`a gidiyor ve dönen
 * kendi adresimiz yuvaya bağlanıyor.
 */
function SlotEditor({ slot }: { slot: PlayerImageSlot }) {
  const curator = usePlayerCurator();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

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

  return (
    <span className={styles.editor} data-open={open || undefined}>
      <button
        type="button"
        className={styles.editButton}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        title={labels.edit}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 20h4L19 9a2.5 2.5 0 0 0-3.5-3.5L4 16.5V20z" />
        </svg>
        <span>{slot.id}</span>
      </button>

      {open ? (
        <span className={styles.pop}>
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

          <span className={styles.popRow}>
            <input
              type="url"
              value={url}
              placeholder={labels.urlPlaceholder}
              onChange={(event) => setUrl(event.target.value)}
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

          {error ? <span className={styles.popError}>{labels.error}</span> : null}
        </span>
      ) : null}
    </span>
  );
}
