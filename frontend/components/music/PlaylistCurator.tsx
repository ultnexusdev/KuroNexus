"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import {
  deleteMusicPlaylist,
  listMusicGenres,
  reorderPlaylist,
  updateMusicPlaylist,
  uploadImage,
  type MusicGenreRecord,
} from "@/lib/admin/api";
import styles from "./MusicCurator.module.css";

/**
 * Çalma listesi küratör paneli — liste sayfasında, mod açıkken.
 *
 * Kullanıcı isteği (13 Ağustos 2026): *"oluşturduğum listelerde de küratör
 * modu olmalı… SPOR yazısının solunda kalan kısma bir kapak görseli
 * yerleştirebilmeliyim."*
 *
 * ── B8'İ KULLANILABİLİR YAPAN YER BURASI ──────────────────────────────────
 * `MusicPlaylist.genreId` alanı ve doğrulaması bir önceki turda geldi ama
 * küratörün odayı SEÇEBİLECEĞİ tek yer yoktu; liste ancak tarayıcı
 * konsolundan bir odaya bağlanabiliyordu. Aşağıdaki oda kutusu o boşluğu
 * kapatıyor.
 *
 * ⚠️ Yalnızca **yerel** listelerde tam anlamlı. Spotify'dan gelen bir listenin
 * adı/kapağı buradan değiştirilebilir ama bir sonraki tazelemede kaynaktan
 * geri gelir — panel o durumda uyarı gösteriyor.
 */

export interface CuratorPlaylist {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  artwork: string | null;
  isFavorite: boolean;
  isLocal: boolean;
  genreSlug: string | null;
  /** Sıralama için: listedeki parçaların arşiv kimlikleri, mevcut sırayla */
  trackIds: string[];
  trackTitles: string[];
}

export function PlaylistCurator({ playlist }: { playlist: CuratorPlaylist }) {
  const t = useTranslations("music.curator");
  const router = useRouter();

  const [genres, setGenres] = useState<MusicGenreRecord[] | null>(null);
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description ?? "");
  const [artwork, setArtwork] = useState(playlist.artwork ?? "");
  const [isFavorite, setIsFavorite] = useState(playlist.isFavorite);
  const [genreId, setGenreId] = useState("");
  const [order, setOrder] = useState<string[]>(playlist.trackIds);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  /**
   * Oda seçimi slug üzerinden eşleniyor: sayfa verisi tür KİMLİĞİ taşımıyor
   * (okuma yolunda gerek yok). Eşleme tür listesi indikten sonra kuruluyor —
   * act panelindeki desenin aynısı.
   */
  useEffect(() => {
    let alive = true;
    listMusicGenres()
      .then((list) => {
        if (!alive) return;
        setGenres(list);
        const match = list.find((genre) => genre.slug === playlist.genreSlug);
        setGenreId(match?.id ?? "");
      })
      .catch((err: unknown) =>
        setError(err instanceof ApiError ? err.message : t("errorGeneric")),
      );
    return () => {
      alive = false;
    };
  }, [playlist.genreSlug, t]);

  const run = useCallback(
    async (key: string, work: () => Promise<string>) => {
      setBusy(key);
      setError(null);
      setDone(null);
      try {
        setDone(await work());
        router.refresh();
      } catch (err: unknown) {
        // Sebep yutulmuyor: backend anahtarı olduğu gibi gösteriliyor
        setError(err instanceof ApiError ? err.message : t("errorGeneric"));
      } finally {
        setBusy(null);
      }
    },
    [router, t],
  );

  function move(index: number, delta: number) {
    const next = [...order];
    const target = index + delta;
    if (target < 0 || target >= next.length) {
      return;
    }
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void run("info", async () => {
      await updateMusicPlaylist(playlist.id, {
        name,
        description,
        artwork,
        isFavorite,
        genreId,
      });
      return t("saved");
    });
  }

  const titleOf = (id: string) =>
    playlist.trackTitles[playlist.trackIds.indexOf(id)] ?? id;
  const orderChanged = order.join("|") !== playlist.trackIds.join("|");

  return (
    <div className={styles.panel}>
      {!playlist.isLocal ? (
        <p className={styles.error}>{t("playlistFromSpotify")}</p>
      ) : null}

      <form className={styles.block} onSubmit={submit}>
        <h3 className={styles.blockTitle}>{t("playlistInfoTitle")}</h3>

        <label className={styles.field}>
          <span className={styles.fileLabel}>{t("playlistName")}</span>
          <input
            type="text"
            className={styles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fileLabel}>{t("playlistDescription")}</span>
          <textarea
            className={styles.textarea}
            rows={2}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        {/* ODA — B8'in küratör kararı. Boş seçenek "odasız" demek. */}
        <label className={styles.field}>
          <span className={styles.fileLabel}>{t("playlistRoom")}</span>
          <select
            className={styles.select}
            value={genreId}
            onChange={(event) => setGenreId(event.target.value)}
          >
            <option value="">{t("playlistNoRoom")}</option>
            {(genres ?? [])
              .filter((genre) => genre.parentId === null)
              .map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
          </select>
        </label>
        <p className={styles.hint}>{t("playlistRoomHint")}</p>

        {/* KAPAK — kullanıcının açık isteği: "SPOR yazısının solundaki kutu" */}
        <label className={styles.field}>
          <span className={styles.fileLabel}>{t("playlistCover")}</span>
          <input
            type="text"
            className={styles.input}
            value={artwork}
            placeholder="/uploads/…"
            onChange={(event) => setArtwork(event.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            disabled={busy !== null}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }
              void run("cover", async () => {
                const uploaded = await uploadImage(file);
                setArtwork(uploaded.url);
                return t("bannerUploaded");
              });
              event.target.value = "";
            }}
          />
        </label>
        <p className={styles.hint}>{t("playlistCoverHint")}</p>

        <label className={styles.fileField}>
          <span>
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(event) => setIsFavorite(event.target.checked)}
            />{" "}
            {t("playlistFavorite")}
          </span>
        </label>

        <div className={styles.row}>
          <button type="submit" className={styles.action} disabled={busy !== null}>
            {busy === "info" ? t("working") : t("save")}
          </button>
          <button
            type="button"
            className={styles.actionQuiet}
            disabled={busy !== null}
            onClick={() => {
              if (!window.confirm(t("playlistDeleteConfirm", { name: playlist.name }))) {
                return;
              }
              void run("delete", async () => {
                await deleteMusicPlaylist(playlist.id);
                return t("playlistDeleted");
              });
            }}
          >
            {t("playlistDelete")}
          </button>
        </div>
      </form>

      {/* SIRALAMA — sürükleme yerine ok düğmeleri: dokunmatikte ve klavyeyle
          sürükleme ayrı ayrı çözülmesi gereken bir iş, oklar ikisinde de
          çalışıyor ve `PUT …/tracks` zaten son hâli bekliyor. */}
      {playlist.trackIds.length > 1 ? (
        <section className={styles.block}>
          <h3 className={styles.blockTitle}>{t("playlistOrderTitle")}</h3>
          <ol className={styles.genreList}>
            {order.map((id, index) => (
              <li key={id} className={styles.genreRow}>
                <span className={styles.genreName}>
                  {String(index + 1).padStart(2, "0")} · {titleOf(id)}
                </span>
                <button
                  type="button"
                  className={styles.actionQuiet}
                  disabled={index === 0}
                  aria-label={t("moveUp")}
                  onClick={() => move(index, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={styles.actionQuiet}
                  disabled={index + 1 === order.length}
                  aria-label={t("moveDown")}
                  onClick={() => move(index, 1)}
                >
                  ↓
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className={styles.action}
            disabled={busy !== null || !orderChanged}
            onClick={() =>
              void run("order", async () => {
                const result = await reorderPlaylist(playlist.id, order);
                return t("playlistOrderSaved", { count: result.count });
              })
            }
          >
            {busy === "order" ? t("working") : t("playlistOrderSave")}
          </button>
        </section>
      ) : null}

      {error ? <p className={styles.error}>{error}</p> : null}
      {done ? <p className={styles.ok}>{done}</p> : null}
    </div>
  );
}
