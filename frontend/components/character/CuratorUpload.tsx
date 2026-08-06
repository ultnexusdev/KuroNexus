"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  addCharacterImage,
  uploadImage,
  uploadImageFromUrl,
} from "@/lib/admin/api";
import type { CharacterImageSlotName } from "@/lib/api/types";
import styles from "./CuratorUpload.module.css";

/**
 * Kürator yükleme yuvası.
 *
 * Görsel yüklenir yüklenmez **veritabanına bağlanıyor** ve sayfa tazeleniyor;
 * kürator adresi kopyalayıp kimseye iletmiyor. (İlk sürümde yalnızca adresi
 * gösteriyordu — kullanıcı haklı olarak "sürekli sana haber mi vermeliyim"
 * dedi, 6 Ağustos 2026.)
 *
 * İKİ YOL: dosya seçmek ya da bir adres yapıştırmak. İkincisinde görsel
 * sunucuya **indiriliyor**; dış adres saklanmıyor çünkü CSP `img-src`
 * yabancı sunucuya izin vermiyor ve dış adres bir gün ölürse görsel de
 * ölürdü.
 *
 * Karakterin YAZILI içeriği (Shikai açıklaması, replikler) hâlâ kodda —
 * yalnızca görseller veritabanında. Ayrım bilinçli: yazılı bölümler her
 * karaktere özel tasarlanıyor, görseller ise tek biçimli.
 */
export function CuratorUpload({
  characterId,
  slot,
  abilityName,
  label,
}: {
  characterId: number;
  slot: CharacterImageSlotName;
  /** `ABILITY` yuvasında hangi yetenek kartı */
  abilityName?: string;
  /** Yuvanın ekranda görünen adı */
  label: string;
}) {
  const t = useTranslations("character.uploader");
  const router = useRouter();
  const [remote, setRemote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [, startTransition] = useTransition();

  async function run(upload: () => Promise<{ url: string }>) {
    setBusy(true);
    setError(null);
    setDone(false);
    try {
      const uploaded = await upload();
      await addCharacterImage({
        characterId,
        slot,
        abilityName,
        url: uploaded.url,
        altText: label,
      });
      setRemote("");
      setDone(true);
      // Sunucu bileşenlerini yeniden çizdirir: görsel anında yerine oturur
      startTransition(() => router.refresh());
    } catch {
      setError(t("error"));
    } finally {
      setBusy(false);
    }
  }

  const inputId = `curator-url-${slot}-${abilityName ?? "main"}`;

  return (
    <div className={styles.box}>
      <p className={styles.slot}>{label}</p>

      <div className={styles.ways}>
        <label className={styles.fileWay}>
          <span className={styles.wayLabel}>{t("fromFile")}</span>
          <input
            type="file"
            accept="image/*"
            className={styles.file}
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void run(() => uploadImage(file));
              }
            }}
          />
        </label>

        <div className={styles.urlWay}>
          <label className={styles.wayLabel} htmlFor={inputId}>
            {t("fromUrl")}
          </label>
          <div className={styles.urlRow}>
            <input
              id={inputId}
              type="url"
              inputMode="url"
              className={styles.urlInput}
              placeholder={t("urlPlaceholder")}
              value={remote}
              disabled={busy}
              onChange={(event) => setRemote(event.target.value)}
            />
            <button
              type="button"
              className={styles.fetch}
              disabled={busy || remote.trim().length === 0}
              onClick={() => {
                const value = remote.trim();
                if (value) {
                  void run(() => uploadImageFromUrl(value));
                }
              }}
            >
              {t("fetch")}
            </button>
          </div>
        </div>
      </div>

      {busy ? <p className={styles.note}>{t("busy")}</p> : null}
      {done && !busy ? (
        <p className={styles.done} role="status">
          {t("added")}
        </p>
      ) : null}
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
