"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AKATSUKI_THEME_SRC } from "@/lib/anime/akatsuki";
import styles from "./AkatsukiAudio.module.css";

/**
 * Akatsuki fon müziği (v2 §5) — sergiye özgü, salona yayılmıyor.
 *
 * ── OTOMATİK OYNATMA GERÇEĞİ ─────────────────────────────────────────────
 * Tarayıcılar etkileşimsiz sesli oynatmayı engeller. Akış: mount'ta
 * `play()` dene → reddedilirse buton "çalmıyor" durumunda bekler ve
 * kullanıcının İLK etkileşiminde (pointerdown/keydown/scroll, tek seferlik)
 * bir kez daha denenir. Buton durumu her zaman GERÇEK oynatma durumundan
 * okunur (audio olayları), tahminden değil.
 *
 * ── EVİN SES BARIŞI ─────────────────────────────────────────────────────
 * Spotify şeridi çalmaya başlayınca `kuronexus:music-started` yayınlıyor ve
 * `GlobalAmbientPlayer` susuyor — aynı tek yönlü sözleşmeye uyuyoruz:
 * o olayı duyunca dururuz, biz başlarken aynı olayı yayınlarız (ambiyans
 * çalar varsa o da sussun). İki ayrı ses sistemi kurulmuyor.
 *
 * Rota değişince bileşen unmount olur → cleanup sesi keser (App Router
 * sergiden çıkışta bu bileşeni söker; başka sayfada çalmaya devam etmez).
 * Dosya inmezse (`onError`) kontrol tamamen gizlenir — kırık düğme yok.
 */

const TARGET_VOLUME = 0.35;
const FADE_MS = 1800;

export function AkatsukiAudio() {
  const t = useTranslations("akatsuki.audio");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  /* Kendi yayınımızı kendi kulağımızdan ayırmak için bayrak — `isTrusted`
     işe yaramaz: script'ten çıkan HER olay untrusted'dır, Spotify
     şeridininki de. dispatchEvent senkron; bayrak açılıp hemen kapanır. */
  const selfDispatchRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [broken, setBroken] = useState(false);

  function clearFade() {
    if (fadeRef.current !== null) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  }

  function fadeIn(audio: HTMLAudioElement) {
    clearFade();
    audio.volume = 0;
    const step = TARGET_VOLUME / (FADE_MS / 100);
    fadeRef.current = window.setInterval(() => {
      audio.volume = Math.min(TARGET_VOLUME, audio.volume + step);
      if (audio.volume >= TARGET_VOLUME) clearFade();
    }, 100);
  }

  async function tryPlay() {
    const audio = audioRef.current;
    if (!audio || broken) return false;
    try {
      fadeIn(audio);
      await audio.play();
      // Ambiyans çalar varsa sussun — evin tek yönlü olay sözleşmesi
      selfDispatchRef.current = true;
      window.dispatchEvent(new Event("kuronexus:music-started"));
      selfDispatchRef.current = false;
      return true;
    } catch {
      // Tarayıcı reddetti: sessizce beklet, ilk etkileşimde tekrar denenecek
      clearFade();
      return false;
    }
  }

  useEffect(() => {
    let disposed = false;
    // Cleanup anında ref değişmiş olabilir — efekt içinde sabitle
    const audio = audioRef.current;

    // Mount'ta dene; reddedilirse ilk etkileşimde TEK SEFER tekrar dene.
    // `removeRetry` dışarıda tutuluyor ki unmount temizliği de dinleyicileri
    // söksün (2026-08-22 denetimi) — eskiden rota değişince üç dinleyici
    // arkada kalıyor ve sonraki ilk etkileşimde ölü bileşen için ateşleniyordu
    // (PlayerAudio'da daha önce kapatılan sızıntı sınıfının aynısı).
    let removeRetry: (() => void) | null = null;
    void tryPlay().then((ok) => {
      if (ok || disposed) return;
      const retry = () => {
        void tryPlay();
        remove();
      };
      const remove = () => {
        removeRetry = null;
        window.removeEventListener("pointerdown", retry);
        window.removeEventListener("keydown", retry);
        window.removeEventListener("scroll", retry);
      };
      removeRetry = remove;
      window.addEventListener("pointerdown", retry, { once: true });
      window.addEventListener("keydown", retry, { once: true });
      window.addEventListener("scroll", retry, { once: true, passive: true });
    });

    // Spotify şeridi (ya da başka bir kaynak) başlarsa biz susarız
    const onForeignMusic = () => {
      if (selfDispatchRef.current) return; // kendi yayınımız — yut
      audioRef.current?.pause();
    };
    window.addEventListener("kuronexus:music-started", onForeignMusic);

    return () => {
      disposed = true;
      clearFade();
      removeRetry?.();
      window.removeEventListener("kuronexus:music-started", onForeignMusic);
      // Rota değişimi = unmount = sessizlik
      audio?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (broken) return null;

  return (
    <>
      {/* preload="metadata": 6.6MB dosya ilk yüklemeyi beklemesin */}
      <audio
        ref={audioRef}
        src={AKATSUKI_THEME_SRC}
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
        aria-label={playing ? t("pause") : t("play")}
        aria-pressed={playing}
        title={t("title")}
        onClick={() => {
          const audio = audioRef.current;
          if (!audio) return;
          if (playing) audio.pause();
          else void tryPlay();
        }}
      >
        {playing ? (
          /* Ses dalgası — çalarken üç çubuk nefes alır */
          <span className={styles.wave} aria-hidden>
            <span />
            <span />
            <span />
          </span>
        ) : (
          <span className={styles.playIcon} aria-hidden />
        )}
      </button>
    </>
  );
}
