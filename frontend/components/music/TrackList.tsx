"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { apiUrl, ApiError, isLocalUpload } from "@/lib/api/client";
import {
  addTrackToPlaylist,
  createMusicPlaylist,
  listMusicPlaylists,
  removeTrackFromPlaylist,
  type PlaylistRecord,
} from "@/lib/admin/api";
import { useMusicQueue, type QueueTrack } from "@/components/player/MusicQueue";
import styles from "./TrackList.module.css";

/**
 * Parça listesi — albüm sayfası, çalma listesi sayfası ve sanatçı sayfası
 * aynı satırı çiziyor.
 *
 * İki iş yapıyor:
 *  1. **Çal** — satıra basınca kuyruk bu listeyle doluyor ve şerit çalar o
 *     paçadan başlıyor. Kuyruk kök düzende yaşadığı için sayfadan ayrılınca
 *     müzik kesilmiyor.
 *  2. **Listeye ekle** — küratör (admin) her parçayı istediği listeye
 *     ekleyebiliyor; liste yoksa buradan kurulabiliyor.
 *
 * ⚠️ `spotifyId`i olmayan parça kuyruğa GİRMİYOR: gömülü çalar yalnızca
 * Spotify kimliğiyle çalışıyor. Satır yine çiziliyor (parça arşivde var) ama
 * çal düğmesi kapalı — sessizce hiçbir şey yapan bir düğmeden iyidir.
 */

export interface PlayableTrack {
  /** Arşiv kimliği (cuid) — listeye ekleme bunu kullanıyor */
  id: string;
  title: string;
  spotifyId: string | null;
  durationMs: number | null;
  /** Satırda gösterilen sanatçı adı */
  artist: string;
  album: { title: string; artwork: string | null } | null;
  playCount?: number;
}

function formatLength(ms: number | null): string {
  if (!ms || ms <= 0) {
    return "";
  }
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function toQueueTrack(track: PlayableTrack): QueueTrack {
  return {
    spotifyId: track.spotifyId as string,
    title: track.title,
    artist: track.artist,
    album: track.album?.title ?? null,
    artwork: track.album?.artwork ?? null,
  };
}

export function TrackList({
  tracks,
  context,
  isAdmin = false,
  showAlbum = false,
  showPlays = false,
  contextHref,
  playlistId = null,
  numbered = true,
}: {
  tracks: PlayableTrack[];
  /** Şeritte "nereden çalıyor" yazısı — albüm ya da liste adı */
  context: string;
  /** Varsa kaynağın adresi; şeritten ve panelden geri dönmek için */
  contextHref?: string;
  isAdmin?: boolean;
  showAlbum?: boolean;
  /** Dinleme kaydı aktarılmadıysa sütun hiç çizilmiyor (0 ≠ ölçüm yok) */
  showPlays?: boolean;
  /** Liste sayfasında dolu — satıra "listeden çıkar" düğmesi ekliyor */
  playlistId?: string | null;
  numbered?: boolean;
}) {
  const t = useTranslations("music.tracks");
  const router = useRouter();
  const { play, current } = useMusicQueue();
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const playable = tracks.filter((track) => Boolean(track.spotifyId));

  function startAt(track: PlayableTrack) {
    const index = playable.findIndex((item) => item.id === track.id);
    play(playable.map(toQueueTrack), Math.max(0, index), context, contextHref);
  }

  async function remove(track: PlayableTrack) {
    if (!playlistId) {
      return;
    }
    setBusy(track.id);
    try {
      await removeTrackFromPlaylist(playlistId, track.id);
      router.refresh();
    } catch (error) {
      setNote(error instanceof ApiError ? error.message : t("error"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      {playable.length > 0 ? (
        <button
          type="button"
          className={styles.playAll}
          onClick={() => startAt(playable[0])}
        >
          {t("playAll", { count: playable.length })}
        </button>
      ) : null}

      <ol className={styles.list}>
        {tracks.map((track, index) => {
          const isCurrent =
            current !== null && current.spotifyId === track.spotifyId;
          return (
            <li
              key={track.id}
              className={isCurrent ? styles.rowOn : styles.row}
              aria-current={isCurrent ? "true" : undefined}
            >
              {numbered ? (
                <span className={styles.no}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              ) : null}

              <button
                type="button"
                className={styles.play}
                disabled={!track.spotifyId}
                aria-label={t("play", { title: track.title })}
                title={track.spotifyId ? t("play", { title: track.title }) : t("noSpotify")}
                onClick={() => startAt(track)}
              >
                ▶
              </button>

              {showAlbum && track.album ? (
                isLocalUpload(track.album.artwork) ? (
                  /* 32px tek kapak; kaynak zaten kendi sunucumuz. `next/image`
                     optimizasyon turu bu boyutta kazançtan çok yük. */
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className={styles.cover}
                    src={apiUrl(track.album.artwork as string)}
                    alt=""
                    width={32}
                    height={32}
                  />
                ) : (
                  <span className={styles.coverEmpty} aria-hidden="true" />
                )
              ) : null}

              <span className={styles.title}>{track.title}</span>

              {showAlbum ? (
                <span className={styles.album}>{track.album?.title ?? ""}</span>
              ) : null}

              {showPlays ? (
                <span className={styles.plays}>
                  {t("plays", { count: track.playCount ?? 0 })}
                </span>
              ) : null}

              <span className={styles.length}>
                {formatLength(track.durationMs)}
              </span>

              {isAdmin ? (
                <AddToPlaylist trackId={track.id} title={track.title} />
              ) : null}

              {isAdmin && playlistId ? (
                <button
                  type="button"
                  className={styles.remove}
                  disabled={busy === track.id}
                  aria-label={t("removeFromPlaylist")}
                  title={t("removeFromPlaylist")}
                  onClick={() => remove(track)}
                >
                  ✕
                </button>
              ) : null}
            </li>
          );
        })}
      </ol>

      {note ? <p className={styles.note}>{note}</p> : null}
    </>
  );
}

/**
 * "+" düğmesi: parçayı bir listeye ekler ya da yeni liste kurar.
 *
 * Listeler **ilk açılışta** çekiliyor, bileşen mount olduğunda değil: bir
 * albüm sayfasında yirmi parça satırı var ve her biri açılışta liste isteği
 * atsaydı sayfa yirmi kez aynı şeyi sorardı.
 *
 * ⚠️ Yalnızca **yerel** listeler seçilebiliyor. Spotify'dan gelen bir listeye
 * eklenen parça bir sonraki tazelemede kaybolurdu (sync listenin içeriğini
 * kaynaktan yeniden yazıyor) — sessizce kaybolan bir kayıt, eklenememekten
 * kötüdür.
 */
function AddToPlaylist({ trackId, title }: { trackId: string; title: string }) {
  const t = useTranslations("music.tracks");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState<PlaylistRecord[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const boxRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(() => {
    listMusicPlaylists()
      .then(setPlaylists)
      .catch((error: unknown) =>
        setMessage(error instanceof ApiError ? error.message : t("error")),
      );
  }, [t]);

  useEffect(() => {
    if (open && playlists === null) {
      load();
    }
  }, [open, playlists, load]);

  /* Dışarı tıklanınca kapanır — açık kalıp alttaki satırları örtmesin */
  useEffect(() => {
    if (!open) {
      return;
    }
    function onPointerDown(event: PointerEvent) {
      if (!boxRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  async function add(playlist: PlaylistRecord) {
    setBusy(true);
    setMessage(null);
    try {
      const result = await addTrackToPlaylist(playlist.id, trackId);
      setMessage(
        result.added
          ? t("added", { playlist: playlist.name })
          : t("alreadyIn", { playlist: playlist.name }),
      );
      router.refresh();
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : t("error"));
    } finally {
      setBusy(false);
    }
  }

  async function createAndAdd() {
    const name = newName.trim();
    if (!name) {
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const created = await createMusicPlaylist({ name });
      await addTrackToPlaylist(created.id, trackId);
      setNewName("");
      setPlaylists(null);
      setMessage(t("added", { playlist: created.name }));
      router.refresh();
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : t("error"));
    } finally {
      setBusy(false);
    }
  }

  const local = (playlists ?? []).filter((playlist) => playlist.isLocal);

  return (
    <div className={styles.addBox} ref={boxRef}>
      <button
        type="button"
        className={styles.add}
        aria-label={t("addTo", { title })}
        title={t("addTo", { title })}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        +
      </button>

      {open ? (
        <div className={styles.menu}>
          <span className={styles.menuHead}>{t("addToTitle")}</span>

          {playlists === null ? (
            <span className={styles.menuNote}>{t("loading")}</span>
          ) : local.length === 0 ? (
            <span className={styles.menuNote}>{t("noPlaylists")}</span>
          ) : (
            <ul className={styles.menuList}>
              {local.map((playlist) => (
                <li key={playlist.id}>
                  <button
                    type="button"
                    className={styles.menuRow}
                    disabled={busy}
                    onClick={() => add(playlist)}
                  >
                    <span>{playlist.name}</span>
                    <span className={styles.menuCount}>
                      {playlist.trackCount}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className={styles.menuNew}>
            <input
              type="text"
              value={newName}
              placeholder={t("newPlaylistPlaceholder")}
              aria-label={t("newPlaylist")}
              onChange={(event) => setNewName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void createAndAdd();
                }
              }}
            />
            <button
              type="button"
              disabled={busy || newName.trim().length === 0}
              onClick={() => void createAndAdd()}
            >
              {t("newPlaylist")}
            </button>
          </div>

          {message ? <span className={styles.menuNote}>{message}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
