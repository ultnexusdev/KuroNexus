"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { createMusicPlaylist } from "@/lib/admin/api";
import styles from "./PlaylistCreator.module.css";

/**
 * Liste dizinindeki "yeni liste" satırı — yalnızca admin görüyor.
 *
 * Parça satırlarındaki "+" menüsü de liste kurabiliyor; bu ayrı kutu boş bir
 * listeyi önceden kurmak için: küratör önce listeyi adlandırıp sonra
 * albümlerde gezerek doldurabiliyor.
 *
 * ⚠️ Kurulan liste **yerel**: `spotifyId` yazılmıyor ve sync ona asla
 * dokunmuyor. Gerekçenin uzunu `backend/src/music/music-playlist.service.ts`
 * başlığında.
 */
export function PlaylistCreator() {
  const t = useTranslations("music.playlists");
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await createMusicPlaylist({
        name: trimmed,
        description: description.trim() || undefined,
      });
      setName("");
      setDescription("");
      router.refresh();
    } catch (err: unknown) {
      // Sebep yutulmuyor: backend anahtarı olduğu gibi gösteriliyor
      setError(err instanceof ApiError ? err.message : t("createError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.box} onSubmit={submit}>
      <span className={styles.label}>{t("createTitle")}</span>
      <div className={styles.row}>
        <input
          type="text"
          className={styles.input}
          value={name}
          placeholder={t("namePlaceholder")}
          aria-label={t("nameLabel")}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          type="text"
          className={styles.input}
          value={description}
          placeholder={t("descriptionPlaceholder")}
          aria-label={t("descriptionLabel")}
          onChange={(event) => setDescription(event.target.value)}
        />
        <button
          type="submit"
          className={styles.action}
          disabled={busy || name.trim().length === 0}
        >
          {busy ? t("creating") : t("create")}
        </button>
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
    </form>
  );
}
