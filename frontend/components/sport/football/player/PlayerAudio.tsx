"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./PlayerAudio.module.css";

/**
 * FUTBOLCU SAYFASININ TEMASI.
 *
 * ── AKATSUKI DESENİNİN AYNISI, BİLEREK ───────────────────────────────────
 * `components/anime/akatsuki/AkatsukiAudio.tsx` bu işi zaten çözmüş ve
 * çözümü burada tekrar edilmedi, KOPYALANDI — çünkü aradaki tek fark ses
 * dosyası ve etiketler. Ortak bir bileşene çıkarmak iki kanadı birbirine
 * bağlardı; sergiye özgü ses sergiye özgü kalmalı.
 *
 * ── OTOMATİK OYNATMA GERÇEĞİ ─────────────────────────────────────────────
 * Tarayıcılar etkileşimsiz sesli oynatmayı engeller. Akış: mount'ta `play()`
 * dene → reddedilirse düğme "çalmıyor" durumunda bekler ve kullanıcının İLK
 * etkileşiminde (pointerdown/keydown/scroll, tek seferlik) bir kez daha
 * denenir. Düğme durumu her zaman GERÇEK oynatma durumundan okunur (audio
 * olayları), tahminden değil.
 *
 * ── EVİN SES BARIŞI ──────────────────────────────────────────────────────
 * Site genelinde tek bir sözleşme var: çalmaya başlayan `kuronexus:music-
 * started` yayınlar, duyan susar. Spotify şeridi ve `GlobalAmbientPlayer` bu
 * sözleşmeye uyuyor; biz de uyuyoruz. İki ayrı ses sistemi kurulmuyor.
 *
 * Rota değişince bileşen unmount olur → cleanup sesi keser; başka sayfada
 * çalmaya devam etmez. Dosya inmezse (`onError`) kontrol tamamen gizlenir.
 */

const TARGET_VOLUME = 0.32;
const FADE_MS = 2000;

export function PlayerAudio({
  src,
  labels,
}: {
  src: string;
  labels: { play: string; pause: string; title: string };
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  /* Kendi yayınımızı kendi kulağımızdan ayıran bayrak — `isTrusted` işe
     yaramaz: script'ten çıkan HER olay untrusted'dır. dispatchEvent senkron,
     bayrak açılıp hemen kapanıyor. */
  const selfDispatchRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [broken, setBroken] = useState(false);

  const clearFade = useCallback(() => {
    if (fadeRef.current !== null) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    try {
      clearFade();
      audio.volume = 0;
      const step = TARGET_VOLUME / (FADE_MS / 100);
      fadeRef.current = window.setInterval(() => {
        audio.volume = Math.min(TARGET_VOLUME, audio.volume + step);
        if (audio.volume >= TARGET_VOLUME) clearFade();
      }, 100);

      await audio.play();
      selfDispatchRef.current = true;
      window.dispatchEvent(new Event("kuronexus:music-started"));
      selfDispatchRef.current = false;
      return true;
    } catch {
      clearFade();
      return false;
    }
  }, [clearFade]);

  useEffect(() => {
    let disposed = false;
    const audio = audioRef.current;

    void tryPlay().then((ok) => {
      if (ok || disposed) return;
      const retry = () => {
        void tryPlay();
        remove();
      };
      const remove = () => {
        window.removeEventListener("pointerdown", retry);
        window.removeEventListener("keydown", retry);
        window.removeEventListener("scroll", retry);
      };
      window.addEventListener("pointerdown", retry, { once: true });
      window.addEventListener("keydown", retry, { once: true });
      window.addEventListener("scroll", retry, { once: true, passive: true });
    });

    const onForeignMusic = () => {
      if (selfDispatchRef.current) return;
      audioRef.current?.pause();
    };
    window.addEventListener("kuronexus:music-started", onForeignMusic);

    return () => {
      disposed = true;
      clearFade();
      window.removeEventListener("kuronexus:music-started", onForeignMusic);
      audio?.pause();
    };
  }, [tryPlay, clearFade]);

  if (broken) return null;

  return (
    <>
      {/* preload="metadata": 10 MB'lık dosya ilk boyamayı beklemesin */}
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setBroken(true)}
      />
      <button
        type="button"
        className={styles.toggle}
        data-playing={playing || undefined}
        aria-label={playing ? labels.pause : labels.play}
        aria-pressed={playing}
        title={labels.title}
        onClick={() => {
          const audio = audioRef.current;
          if (!audio) return;
          if (playing) audio.pause();
          else void tryPlay();
        }}
      >
        {playing ? (
          <span className={styles.wave} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        ) : (
          <span className={styles.playIcon} aria-hidden="true" />
        )}
        <span className={styles.label}>{labels.title}</span>
      </button>
    </>
  );
}
