"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { setCuratedImage, uploadImage } from "@/lib/admin/api";
import {
  ANTHEM_FADE_MS,
  ANTHEM_VOLUME,
  SLAM_DUNK_ANTHEM_SLOT,
} from "@/lib/anime/slam-dunk/audio";
import { SLAM_DUNK_SURFACE } from "@/lib/anime/slam-dunk/slots";
import styles from "./SlamDunkAudio.module.css";

/**
 * SAYFA MÜZİĞİ — çalar + küratörün "müzik ekle" kapısı.
 *
 * ── OTOMATİK OYNATMA GERÇEĞİ ─────────────────────────────────────────────
 * Tarayıcılar etkileşimsiz sesli oynatmayı engeller. Akış Akatsuki
 * sergisiyle aynı ve bilerek: mount'ta `play()` dene → reddedilirse buton
 * "çalmıyor" durumunda bekler ve kullanıcının İLK etkileşiminde
 * (pointerdown/keydown/scroll, tek seferlik) bir kez daha denenir. Buton
 * durumu her zaman GERÇEK oynatma durumundan okunur (audio olayları),
 * tahminden değil.
 *
 * ── EVİN SES BARIŞI ──────────────────────────────────────────────────────
 * Spotify şeridi çalmaya başlayınca `kuronexus:music-started` yayınlıyor ve
 * `GlobalAmbientPlayer` susuyor. Aynı tek yönlü sözleşmeye uyuyoruz: o olayı
 * duyunca dururuz, biz başlarken aynı olayı yayınlarız. İki ayrı ses sistemi
 * kurulmuyor.
 *
 * ── KÜRATÖRÜN KAPISI ─────────────────────────────────────────────────────
 * Kullanıcı isteği (28 Ağustos 2026): parça depoya konmuyor, küratör
 * modundan yükleniyor. Düğme ses denetiminin YANINDA — "müziği açıp
 * kapattığın yerde değiştir de" isteğinin birebir karşılığı.
 *
 * Yükleme iki adım: `uploadImage` dosyayı sunucuya koyup adresini veriyor
 * (uç ses biçimlerini zaten kabul ediyor), `setCuratedImage` o adresi
 * `slam-dunk:anthem` yuvasına yazıyor. İkisinin ayrı olmasının sebebi
 * yükleme mantığının (mime/boyut denetimi) tek yerde durması.
 *
 * ⚠️ Bu bileşen YALNIZCA yönetici için `isAdmin` alıyor; kesme SUNUCUDA
 * (`AnthemControl`). Ziyaretçinin paketinde yükleme kodu da var — çünkü
 * çalar ve yükleyici aynı ada. Yükleme dalı `isAdmin` yanlışken hiç
 * çizilmiyor, yani erişilemez; bedeli birkaç yüz bayt ve karşılığında iki
 * ayrı ada + iki ayrı durum kopyası kurulmuyor.
 */
export function SlamDunkAudio({
  src,
  isAdmin,
}: {
  /** Küratörün yüklediği parçanın adresi. Yoksa `null`. */
  src: string | null;
  isAdmin: boolean;
}) {
  const t = useTranslations("slamDunk.audio");
  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  /* Kendi yayınımızı kendi kulağımızdan ayırmak için bayrak — `isTrusted`
     işe yaramaz: script'ten çıkan HER olay untrusted'dır. */
  const selfDispatchRef = useRef(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [broken, setBroken] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  function clearFade() {
    if (fadeRef.current !== null) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  }

  function fadeIn(audio: HTMLAudioElement) {
    clearFade();
    audio.volume = 0;
    const step = ANTHEM_VOLUME / (ANTHEM_FADE_MS / 100);
    fadeRef.current = window.setInterval(() => {
      audio.volume = Math.min(ANTHEM_VOLUME, audio.volume + step);
      if (audio.volume >= ANTHEM_VOLUME) clearFade();
    }, 100);
  }

  async function tryPlay() {
    const audio = audioRef.current;
    if (!audio || broken || !src) return false;
    try {
      fadeIn(audio);
      await audio.play();
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
    if (!src) return;
    let disposed = false;
    // Cleanup anında ref değişmiş olabilir — efekt içinde sabitle
    const audio = audioRef.current;

    /* `removeRetry` dışarıda tutuluyor ki unmount temizliği de dinleyicileri
       söksün. Akatsuki'de aynı sızıntı ölçülmüştü: rota değişince üç
       dinleyici arkada kalıyor ve sonraki ilk etkileşimde ölü bileşen için
       ateşleniyordu. */
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
  }, [src]);

  async function onPick(file: File) {
    setUploading(true);
    setError(false);
    try {
      const uploaded = await uploadImage(file);
      await setCuratedImage({
        surface: SLAM_DUNK_SURFACE,
        slotId: SLAM_DUNK_ANTHEM_SLOT,
        url: uploaded.url,
      });
      /* Adres SUNUCUDAN geliyor (`AnthemControl`), o yüzden yeni parçanın
         duyulması için sayfanın tazelenmesi gerekiyor. Optimistik bir
         yerel durum tutulmadı ve bilerek: küratör önizlemesi gerçeği
         maskeliyor — kayıt yazılmamışsa da çalıyormuş gibi görünürdü. */
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      {/* preload="metadata": parça birkaç MB olabilir, ilk yüklemeyi
          beklemesin. Kaynak yoksa `<audio>` hiç basılmıyor — boş `src`
          tarayıcıda bir ağ hatası üretir. */}
      {src ? (
        <audio
          ref={audioRef}
          src={src}
          loop
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setBroken(true)}
        />
      ) : null}

      {/* ── ÇAL / DURDUR ──────────────────────────────────────
          Parça yoksa ya da dosya inmiyorsa düğme HİÇ çizilmiyor:
          kırık bir düğme, olmayan bir düğmeden kötü. */}
      {src && !broken ? (
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
      ) : null}

      {/* ── KÜRATÖRÜN KAPISI ──────────────────────────────────
          `data-curator-slot`: küratör anahtarı kapalıyken CSS gizliyor
          (`CuratorFrame` mekanizması), yani yönetici de sayfanın gerçek
          hâlini görebiliyor. */}
      {isAdmin ? (
        <span className={styles.curator} data-curator-slot>
          <input
            ref={fileRef}
            type="file"
            accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
            className={styles.file}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onPick(file);
              // Aynı dosya ikinci kez seçilebilsin
              event.target.value = "";
            }}
          />
          <button
            type="button"
            className={styles.add}
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? t("uploading") : src ? t("replace") : t("add")}
          </button>
          {error ? <span className={styles.error}>{t("error")}</span> : null}
        </span>
      ) : null}
    </>
  );
}
