"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { apiFetch, apiUrl } from "../../lib/api/client";
import styles from "./GlobalAmbientPlayer.module.css";

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

interface AmbientTrack {
  id: string;
  title: string;
  audioUrl: string;
  order: number;
  universeId: string;
  createdAt: string;
  universe?: { name: string; slug: string };
}

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconShuffle() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...strokeProps} aria-hidden>
      <path d="M3 7h3.5c1.5 0 2.5.6 3.4 1.8l4.2 6.4c.9 1.2 1.9 1.8 3.4 1.8H21" />
      <path d="M3 17h3.5c1 0 1.8-.3 2.5-.9M21 7h-3.5c-1 0-1.8.3-2.5.9" />
      <path d="M18.5 4.5 21 7l-2.5 2.5M18.5 14.5 21 17l-2.5 2.5" />
    </svg>
  );
}

function IconPrev() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...strokeProps} aria-hidden>
      <path d="M6 5v14" />
      <path d="M18 6.5v11L9.5 12z" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...strokeProps} aria-hidden>
      <path d="M18 5v14" />
      <path d="M6 6.5v11l8.5-5.5z" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...strokeProps} aria-hidden>
      <path d="M8 5.5v13l10-6.5z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...strokeProps} aria-hidden>
      <path d="M9 5.5v13M15 5.5v13" />
    </svg>
  );
}

function IconRepeat() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...strokeProps} aria-hidden>
      <path d="M4 12V9.5A3.5 3.5 0 0 1 7.5 6H20" />
      <path d="M17.5 3.5 20 6l-2.5 2.5" />
      <path d="M20 12v2.5a3.5 3.5 0 0 1-3.5 3.5H4" />
      <path d="M6.5 20.5 4 18l2.5-2.5" />
    </svg>
  );
}

interface Playlist {
  id: string;
  name: string;
  slug: string;
}

export function GlobalAmbientPlayer() {
  const pathname = usePathname();
  const t = useTranslations("player");
  const [universeSlug, setUniverseSlug] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [tracks, setTracks] = useState<AmbientTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  // Audio elementi listeye bağlı olarak sonradan mount olur; ilk ses seviyesi burada uygulanır
  const setAudioEl = useCallback((el: HTMLAudioElement | null) => {
    audioRef.current = el;
    if (el) el.volume = volumeRef.current;
  }, []);

  // Parça içeren evrenler = seçilebilir çalma listeleri
  useEffect(() => {
    apiFetch<Playlist[]>("/ambient-tracks/playlists")
      .then(setPlaylists)
      .catch(console.error);
  }, []);

  const loadPlaylist = useCallback(
    (slug: string, autoplay: boolean) => {
      setUniverseSlug(slug);
      apiFetch<AmbientTrack[]>(`/ambient-tracks/universe/${slug}`)
        .then((res) => {
          if (res && res.length > 0) {
            setTracks(res);
            setCurrentIndex(0);
            if (autoplay) setIsPlaying(true);
          } else {
            setTracks([]);
          }
        })
        .catch(console.error);
    },
    [],
  );

  // Pathname'den universeSlug çıkarma (örn: /tr/dark-stories/temurkan-efsaneleri/...)
  useEffect(() => {
    if (!pathname) return;
    const match = pathname.match(/\/dark-stories\/([^\/]+)/);
    if (match && match[1] && match[1] !== universeSlug) {
      // Yeni evrene girildi: müzik çalmıyorsa listeyi sessizce değiştir;
      // çalıyorsa mevcut liste bitene/değiştirilene kadar devam eder (kesinti yok)
      if (!isPlaying) {
        loadPlaylist(match[1], false);
      }
    }
  }, [pathname, universeSlug, isPlaying, loadPlaylist]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  /**
   * Müzik salonunun şerit çaları başlayınca ortam sesi susuyor.
   *
   * İkisi ayrı mekanizma (burası `<audio>`, öteki Spotify iframe'i) ve
   * birbirlerinin durumunu okuyamıyorlar; aynı anda çalarlarsa ziyaretçi iki
   * sesi üst üste duyar ve hangisini kısacağını bulamaz. Olay tek yönlü:
   * ortam sesi müziği durdurMUYOR — hikâye okurken ortam sesi açmak müziği
   * kesmeyi gerektirmiyor, tersi ise gerekiyor.
   */
  useEffect(() => {
    function onMusicStarted() {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
    window.addEventListener("kuronexus:music-started", onMusicStarted);
    return () =>
      window.removeEventListener("kuronexus:music-started", onMusicStarted);
  }, []);

  useEffect(() => {
    if (audioRef.current && isPlaying && tracks.length > 0) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex, tracks, isPlaying]);

  if (tracks.length === 0) return null;

  // Evren sayfalarının dışında (ana sayfa, evren listesi vb.) çalar yalnızca
  // aktif bir dinleme oturumu varsa görünür — ilk gezinmede araya girmez.
  const inUniverse = /\/dark-stories\/.+/.test(pathname ?? "");
  const hasActiveSession = isPlaying || currentTime > 0;
  if (!inUniverse && !hasActiveSession) return null;

  const currentTrack = tracks[currentIndex];

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (tracks.length === 0) return;
    if (isShuffle) {
      setCurrentIndex(Math.floor(Math.random() * tracks.length));
    } else {
      setCurrentIndex((prev) => (prev + 1) % tracks.length);
    }
  };

  const playPrev = () => {
    if (tracks.length === 0) return;
    if (isShuffle) {
      setCurrentIndex(Math.floor(Math.random() * tracks.length));
    } else {
      setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    }
  };

  const handleEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
    } else if (tracks.length <= 1) {
      // Tek parçada liste başa saramaz; durum düğmesi tutarlı kalsın
      setIsPlaying(false);
      setCurrentTime(0);
      if (audioRef.current) audioRef.current.currentTime = 0;
    } else {
      playNext();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  return (
    <div className={styles.playerWrapper}>
      <audio
        ref={setAudioEl}
        src={currentTrack ? apiUrl(currentTrack.audioUrl) : ""}
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onEnded={handleEnded}
      />

      <div className={styles.progressBar} onClick={handleProgressClick}>
        <div
          className={styles.progressFill}
          style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.trackInfo}>
          <button
            type="button"
            className={styles.trackTitle}
            onClick={() => setShowPlaylist(!showPlaylist)}
            title={t("playlist")}
            aria-expanded={showPlaylist}
          >
            <span className={styles.trackTitleText}>
              {currentTrack?.title || t("unknownTrack")}
            </span>
            <span className={styles.chevron} aria-hidden>
              {showPlaylist ? "▾" : "▴"}
            </span>
          </button>
          {showPlaylist && (
            <div className={styles.playlistMenu}>
              <div className={styles.playlistHeader}>
                {playlists.find((p) => p.slug === universeSlug)?.name ??
                  t("playlist")}
              </div>
              {tracks.map((track, idx) => (
                <button
                  type="button"
                  key={track.id}
                  className={`${styles.playlistItem} ${idx === currentIndex ? styles.activeTrack : ""}`}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsPlaying(true);
                    setShowPlaylist(false);
                  }}
                >
                  {track.title}
                </button>
              ))}
              {playlists.filter((p) => p.slug !== universeSlug).length > 0 && (
                <>
                  <div className={styles.playlistSectionLabel}>
                    {t("otherPlaylists")}
                  </div>
                  {playlists
                    .filter((p) => p.slug !== universeSlug)
                    .map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        className={styles.playlistSwitchItem}
                        onClick={() => {
                          loadPlaylist(p.slug, isPlaying);
                          setShowPlaylist(false);
                        }}
                      >
                        {p.name}
                      </button>
                    ))}
                </>
              )}
            </div>
          )}
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.controlBtn} ${isShuffle ? styles.active : ""}`}
            onClick={() => setIsShuffle(!isShuffle)}
            title={t("shuffle")}
            aria-label={t("shuffle")}
          >
            <IconShuffle />
          </button>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={playPrev}
            title={t("previous")}
            aria-label={t("previous")}
          >
            <IconPrev />
          </button>
          <button
            type="button"
            className={`${styles.controlBtn} ${styles.playBtn}`}
            onClick={handlePlayPause}
            title={isPlaying ? t("pause") : t("play")}
            aria-label={isPlaying ? t("pause") : t("play")}
          >
            {isPlaying ? <IconPause /> : <IconPlay />}
          </button>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={playNext}
            title={t("next")}
            aria-label={t("next")}
          >
            <IconNext />
          </button>
          <button
            type="button"
            className={`${styles.controlBtn} ${isRepeat ? styles.active : ""}`}
            onClick={() => setIsRepeat(!isRepeat)}
            title={t("repeat")}
            aria-label={t("repeat")}
          >
            <IconRepeat />
          </button>
        </div>

        <div className={styles.rightControls}>
          <span className={styles.time}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className={styles.volumeSlider}
            title={t("volume")}
            aria-label={t("volume")}
          />
        </div>
      </div>
    </div>
  );
}
