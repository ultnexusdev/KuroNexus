"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { uploadImage } from "@/lib/admin/api";
import styles from "./CharacterSections.module.css";

/**
 * Kürator galeri yükleyicisi.
 *
 * Karakter içeriği veritabanında değil, versiyonlanan bir veri dosyasında
 * duruyor (kullanıcı kararı, 6 Ağustos 2026) — dolayısıyla bu kutu görseli
 * sunucuya **yükler** ama galeriye kendisi eklemez. Dönen kalıcı adresi
 * kopyalanabilir biçimde gösterir; adres `lib/characters/<karakter>.ts`
 * içindeki `gallery` dizisine yazılınca görsel sayfada belirir.
 *
 * Neden böyle: her karakter sayfası kendi başına tasarlanıyor. Galeriyi
 * veritabanına almak tek başına işe yarardı ama bölümlerin geri kalanı yine
 * kodda kalacağı için iki ayrı içerik kaynağı doğardı.
 *
 * Yalnızca kürator moduna iniyor — ziyaretçi bu JS'i hiç almıyor.
 */
export function GalleryUploader() {
  const t = useTranslations("character.uploader");
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) {
      return;
    }
    setBusy(true);
    setError(null);
    setCopied(false);
    try {
      const result = await uploadImage(file);
      setUrl(result.url);
    } catch {
      // Hata anahtarı gösterilmiyor: yükleme uçları teknik anahtar döndürüyor
      // (UPLOAD.TOO_LARGE gibi) ve hepsini çeviriye taşımak bu kutu için fazla
      setError(t("error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.uploader}>
      <p className={styles.uploaderTitle}>{t("title")}</p>
      <p className={styles.uploaderHint}>{t("hint")}</p>

      <input
        type="file"
        accept="image/*"
        className={styles.uploaderInput}
        disabled={busy}
        onChange={(event) => void handleFile(event.target.files?.[0])}
        aria-label={t("title")}
      />

      {url ? (
        <div className={styles.uploaderResult}>
          <input
            className={styles.uploaderUrl}
            value={url}
            readOnly
            aria-label={t("resultLabel")}
            // Tıklayınca tamamı seçilsin: bu alanın tek işi kopyalanmak
            onFocus={(event) => event.currentTarget.select()}
          />
          <button
            type="button"
            className={styles.uploaderCopy}
            onClick={() => {
              void navigator.clipboard.writeText(url).then(() => setCopied(true));
            }}
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
      ) : null}

      {busy ? <p className={styles.uploaderHint}>{t("busy")}</p> : null}
      {error ? (
        <p className={styles.uploaderError} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
