"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  fetchMusicPlaylist,
  fetchMusicPlaylists,
  type MusicPlaylistSummary,
} from "@/lib/api/music";
import { musicHref } from "@/lib/music/routes";
import { useMusicQueue } from "./MusicQueue";
import styles from "./PlaylistPicker.module.css";

/**
 * Şeritteki çalma listesi seçici.
 *
 * Kullanıcı isteği: *"alttaki playerda çalma listesi seçilebilmeli."* Yani
 * liste sayfasına gitmeden, ne dinliyorsan onu bırakıp başka listeye
 * geçebilmek.
 *
 * ── İKİ İSTEK, TEK ÇAĞRI DEĞİL ────────────────────────────────────────────
 * Liste DİZİNİ parça taşımıyor (`/music/playlists` yalnızca künye veriyor).
 * Seçilen listenin parçaları ayrı bir istekle geliyor (`/music/playlists/:slug`).
 * Dizini önden çekip parçaları da taşımak, kırk listelik bir arşivde şeridin
 * açılışını kilitlerdi — parçalar yalnızca seçilen liste için isteniyor.
 *
 * Dizin de **ilk açılışta** çekiliyor, bileşen mount olduğunda değil: şerit
 * her sayfada duruyor ve hiç açılmayacak bir menü için her gezinmede istek
 * atmak boşuna.
 */
export function PlaylistPicker() {
  const t = useTranslations("player");
  const { play } = useMusicQueue();

  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState<MusicPlaylistSummary[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(() => {
    fetchMusicPlaylists(true)
      .then(setPlaylists)
      .catch(() => setError(t("playlistLoadFailed")));
  }, [t]);

  useEffect(() => {
    if (open && playlists === null) {
      load();
    }
  }, [open, playlists, load]);

  /* Dışarı tıklanınca kapanır — şeridin üstünde açık kalıp sayfayı örtmesin */
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

  async function pick(playlist: MusicPlaylistSummary) {
    setBusy(playlist.slug);
    setError(null);
    try {
      const detail = await fetchMusicPlaylist(playlist.slug, true);
      const tracks = detail.tracks.map((track) => ({
        spotifyId: track.spotifyId ?? "",
        title: track.title,
        artist: track.album.act.name,
        album: track.album.title,
        artwork: track.album.artwork,
      }));
      if (tracks.every((track) => !track.spotifyId)) {
        // Sebep yutulmuyor: liste dolu ama hiçbiri çalınamıyor olabilir
        setError(t("playlistUnplayable"));
        return;
      }
      play(tracks, 0, detail.name, musicHref.playlist(detail.slug));
      setOpen(false);
    } catch {
      setError(t("playlistLoadFailed"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className={styles.box} ref={boxRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-label={t("choosePlaylist")}
        title={t("choosePlaylist")}
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden
          fill="none" stroke="currentColor" strokeWidth={1.6}
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h10M4 11h10M4 16h6" />
          <path d="M17 5.5v9.2" />
          <circle cx="15.2" cy="15.4" r="1.9" />
        </svg>
      </button>

      {open ? (
        <div className={styles.menu}>
          <span className={styles.head}>{t("choosePlaylist")}</span>
          {error ? <span className={styles.note}>{error}</span> : null}
          {playlists === null && !error ? (
            <span className={styles.note}>{t("loading")}</span>
          ) : null}
          {playlists?.length === 0 ? (
            <span className={styles.note}>{t("noPlaylists")}</span>
          ) : null}
          <ul className={styles.list}>
            {(playlists ?? []).map((playlist) => (
              <li key={playlist.id}>
                <button
                  type="button"
                  className={styles.row}
                  disabled={busy !== null}
                  onClick={() => void pick(playlist)}
                >
                  <span className={styles.name}>{playlist.name}</span>
                  <span className={styles.count}>
                    {busy === playlist.slug
                      ? t("loading")
                      : t("trackCount", { count: playlist.trackCount })}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
