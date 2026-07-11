"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { apiFetch, apiUrl } from "../../lib/api/client";
import styles from "./GlobalAmbientPlayer.module.css";
import {
  PlayIcon,
  PauseIcon,
  NextIcon,
  PrevIcon,
  ShuffleIcon,
  RepeatIcon,
  ListIcon,
} from "../admin/icons"; // Varsayılan ikonlarımız yoksa react-icons veya basit svg kullanabiliriz.
// Şimdilik kendi SVG'lerimizi koyalım.

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function GlobalAmbientPlayer() {
  const pathname = usePathname();
  const [universeSlug, setUniverseSlug] = useState<string | null>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pathname'den universeSlug çıkarma (örn: /tr/dark-stories/temurkan-efsaneleri/...)
  useEffect(() => {
    if (!pathname) return;
    const match = pathname.match(/\/dark-stories\/([^\/]+)/);
    if (match && match[1]) {
      const newSlug = match[1];
      if (newSlug !== universeSlug) {
        setUniverseSlug(newSlug);
        // Yeni evren için müzikleri çek
        apiFetch<any[]>(`/ambient-tracks/universe/${newSlug}`)
          .then((res) => {
            if (res && res.length > 0) {
              setTracks(res);
              // Eğer geçerli listede yoksa başa dön
              // Müzik çalıyorsa durdurup yenisini başlatma işini kullanıcıya bırakabiliriz 
              // veya sessizce listeyi değiştirebiliriz.
              if (res.length > 0) {
                // Şimdilik listeyi yenile ama anında şarkıyı değiştirme (kesintiyi önlemek için)
                // Ancak eski şarkı biterse yenisine geçer. Veya direkt ilk şarkıyı hazırlarız.
                // Basitlik için listeyi yeniliyoruz.
                if (!isPlaying) {
                  setCurrentIndex(0);
                }
              }
            } else {
              setTracks([]);
            }
          })
          .catch(console.error);
      }
    }
  }, [pathname, universeSlug, isPlaying]);

  // Ses ayarı
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Şarkı değiştiğinde oynatma
  useEffect(() => {
    if (audioRef.current && isPlaying && tracks.length > 0) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex, tracks, isPlaying]);

  if (tracks.length === 0) return null; // Müzik yoksa gizle

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
        ref={audioRef}
        src={currentTrack ? apiUrl(currentTrack.audioUrl) : ""}
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onEnded={handleEnded}
      />

      <div className={styles.topRow}>
        <div className={styles.trackInfo}>
          <div className={styles.trackTitle}>
            {currentTrack?.title || "Bilinmeyen Şarkı"}
          </div>
        </div>

        <div className={styles.controls}>
          <button
            className={`${styles.controlBtn} ${isShuffle ? styles.active : ""}`}
            onClick={() => setIsShuffle(!isShuffle)}
            title="Karışık Çal"
          >
            🔀
          </button>
          <button className={styles.controlBtn} onClick={playPrev} title="Önceki">
            ⏮
          </button>
          <button
            className={`${styles.controlBtn} ${styles.playBtn}`}
            onClick={handlePlayPause}
            title={isPlaying ? "Durdur" : "Oynat"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button className={styles.controlBtn} onClick={playNext} title="Sonraki">
            ⏭
          </button>
          <button
            className={`${styles.controlBtn} ${isRepeat ? styles.active : ""}`}
            onClick={() => setIsRepeat(!isRepeat)}
            title="Tekrarla"
          >
            🔁
          </button>
        </div>

        <div className={styles.rightControls}>
          <div className={styles.playlistBtn} onClick={() => setShowPlaylist(!showPlaylist)}>
            <button className={styles.controlBtn} title="Müzik Listesi">
              🎵
            </button>
            {showPlaylist && (
              <div className={styles.playlistMenu}>
                {tracks.map((t, idx) => (
                  <div
                    key={t.id}
                    className={`${styles.playlistItem} ${idx === currentIndex ? styles.activeTrack : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                      setIsPlaying(true);
                      setShowPlaylist(false);
                    }}
                  >
                    {t.title}
                  </div>
                ))}
              </div>
            )}
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className={styles.volumeSlider}
            title="Ses Seviyesi"
          />
        </div>
      </div>

      <div className={styles.progressRow}>
        <span>{formatTime(currentTime)}</span>
        <div className={styles.progressBar} onClick={handleProgressClick}>
          <div
            className={styles.progressFill}
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
