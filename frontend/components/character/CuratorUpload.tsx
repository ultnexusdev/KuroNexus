"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { uploadImage, uploadImageFromUrl } from "@/lib/admin/api";
import styles from "./CuratorUpload.module.css";

/**
 * Kürator yükleme yuvası.
 *
 * Sayfada birden çok yerde duruyor — galeri, her yetenek kartının altı,
 * kapak portresi — ve her biri farklı bir alana yazılacak. Bu yüzden bileşen
 * hangi alana ait olduğunu `slot` metniyle söylüyor: dönen adresin nereye
 * gideceği ekranda yazılı, kürator hangi görselin nereye ait olduğunu
 * karıştırmıyor.
 *
 * İKİ YOL: dosya seçmek ya da bir adres yapıştırmak. İkincisinde görsel
 * sunucuya **indiriliyor**; adres olduğu gibi saklanmıyor çünkü CSP
 * `img-src` yabancı sunucuya izin vermiyor ve dış adres bir gün ölürse
 * görsel de ölürdü.
 *
 * İçerik veritabanında değil versiyonlanan bir veri dosyasında durduğu için
 * (kullanıcı kararı, 6 Ağustos 2026) bileşen görseli kendisi eklemiyor:
 * kalıcı adresi kopyalanabilir biçimde veriyor.
 */
export function CuratorUpload({ slot }: { slot: string }) {
  const t = useTranslations("character.uploader");
  const [url, setUrl] = useState<string | null>(null);
  const [remote, setRemote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function run(work: () => Promise<{ url: string }>) {
    setBusy(true);
    setError(null);
    setCopied(false);
    try {
      const result = await work();
      setUrl(result.url);
    } catch {
      setError(t("error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.box}>
      <p className={styles.slot}>{slot}</p>

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
          <label className={styles.wayLabel} htmlFor={`url-${slot}`}>
            {t("fromUrl")}
          </label>
          <div className={styles.urlRow}>
            <input
              id={`url-${slot}`}
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

      {url ? (
        <div className={styles.result}>
          <input
            className={styles.resultUrl}
            value={url}
            readOnly
            aria-label={t("resultLabel")}
            onFocus={(event) => event.currentTarget.select()}
          />
          <button
            type="button"
            className={styles.copy}
            onClick={() => {
              void navigator.clipboard.writeText(url).then(() => setCopied(true));
            }}
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
      ) : null}

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
