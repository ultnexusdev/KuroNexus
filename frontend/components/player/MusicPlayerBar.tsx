"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { apiUrl, isLocalUpload } from "@/lib/api/client";
import { useMusicQueue } from "./MusicQueue";
import styles from "./MusicPlayerBar.module.css";

/**
 * Site geneli ince çalar şeridi.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * NEDEN SPOTIFY'IN KENDİ KONTROL BETİĞİ
 *
 * Gömülü çalar bir iframe ve **başka bir origin'de**: içinde ne olduğunu
 * okuyamıyoruz, parçanın bittiğini de göremiyoruz. Yani düz bir `<iframe src>`
 * ile kuyruk yapılamaz — her parçadan sonra kullanıcı elle "ileri"ye basmak
 * zorunda kalırdı. Spotify'ın `embed/iframe-api` betiği bu boşluğu kapatan tek
 * resmî yol: `loadUri` ile parça değiştiriyor, `playback_update` olayıyla
 * konumu bildiriyor, biz de parça bitince sıradakine geçiyoruz.
 *
 * ⚠️ BEDELİ ÖDENDİ VE YAZILI: `next.config.ts` CSP'sinde `script-src` artık
 * `https://open.spotify.com` içeriyor — sayfamızda dış kaynaklı bir betik
 * çalışıyor. Karar kullanıcıya soruldu ve onaylandı (12 Ağustos 2026).
 *
 * ⚠️ Betik düşerse ÇALAR SESSİZCE ÖLMEZ: kontrolcü kurulamadığında şerit
 * "çalar yüklenemedi" diyor ve ileri/geri düğmeleri çalışmaya devam ediyor
 * (parça değişir, çalmayı kullanıcı başlatır). Sessiz bozulma bu projede
 * defalarca teşhisi uzattı.
 *
 * ── ÖNİZLEME UYARISI ──────────────────────────────────────────────────────
 * Gömülü çalar, tarayıcıda Spotify oturumu AÇIK ve hesap Premium değilse
 * parçanın yalnızca ~30 saniyesini çalar. Bu bizim tarafımızda çözülebilecek
 * bir şey değil (`MusicTrack.previewUrl` de bilerek yok — Spotify önizleme
 * adreslerini Kasım 2024'te yeni uygulamalara kapattı).
 * ══════════════════════════════════════════════════════════════════════════
 */

const SCRIPT_SRC = "https://open.spotify.com/embed/iframe-api/v1";
const SCRIPT_ID = "spotify-iframe-api";

/** Parça sonu payı: `position` süreye bu kadar yaklaşınca sıradakine geçiliyor. */
const END_SLACK_MS = 1200;

/**
 * Betik yükleme üst sınırı.
 *
 * ⚠️ `onerror` yalnızca istek **başarısız olursa** tetikleniyor; ağ isteği
 * asılı kalırsa (kısıtlı ağ, engelleyici eklenti) hiç çağrılmıyor ve şerit
 * sonsuza kadar "yükleniyor" hâlinde kalırdı — tam olarak bu projede üç kez
 * teşhisi uzatan sessiz bozulma. Süre dolunca uyarı yazılıyor.
 */
const SCRIPT_TIMEOUT_MS = 10_000;

interface SpotifyController {
  loadUri: (uri: string) => void;
  play: () => void;
  togglePlay: () => void;
  destroy: () => void;
  addListener: (
    event: "playback_update" | "ready",
    callback: (payload: {
      data: { position: number; duration: number; isPaused: boolean };
    }) => void,
  ) => void;
}

interface SpotifyIframeApi {
  createController: (
    element: HTMLElement,
    options: { uri: string; width: string | number; height: string | number },
    callback: (controller: SpotifyController) => void,
  ) => void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
    /** Betik bir kez yükleniyor; ikinci mount'ta hazır olan API buradan alınıyor */
    __spotifyIframeApi?: SpotifyIframeApi;
  }
}

function loadIframeApi(): Promise<SpotifyIframeApi> {
  if (window.__spotifyIframeApi) {
    return Promise.resolve(window.__spotifyIframeApi);
  }
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("SPOTIFY_IFRAME_API_TIMEOUT")),
      SCRIPT_TIMEOUT_MS,
    );
    const previous = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = (api) => {
      clearTimeout(timer);
      window.__spotifyIframeApi = api;
      previous?.(api);
      resolve(api);
    };
    if (document.getElementById(SCRIPT_ID)) {
      return; // betik zaten yolda; yukarıdaki geri çağırma çözecek
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onerror = () => {
      clearTimeout(timer);
      reject(new Error("SPOTIFY_IFRAME_API_FAILED"));
    };
    document.body.appendChild(script);
  });
}

export function MusicPlayerBar() {
  const t = useTranslations("player");
  const { current, tracks, index, context, next, previous, jumpTo, clear, autoplay } =
    useMusicQueue();

  const hostRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  /** Aynı parça için "bitti" iki kez tetiklenmesin */
  const endedForRef = useRef<string | null>(null);
  const nextRef = useRef(next);
  nextRef.current = next;

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [openQueue, setOpenQueue] = useState(false);

  const hasTrack = current !== null;

  /* ── Kontrolcüyü bir kez kur ──────────────────────────────────────────── */
  useEffect(() => {
    if (!hasTrack || controllerRef.current) {
      return;
    }
    const host = hostRef.current;
    if (!host) {
      return;
    }
    let cancelled = false;

    loadIframeApi()
      .then((api) => {
        if (cancelled || !hostRef.current) {
          return;
        }
        api.createController(
          hostRef.current,
          { uri: "", width: "100%", height: 80 },
          (controller) => {
            if (cancelled) {
              controller.destroy();
              return;
            }
            controllerRef.current = controller;
            controller.addListener("playback_update", ({ data }) => {
              // Parça sonu: Spotify ayrı bir "ended" olayı yayınlamıyor, o
              // yüzden konum süreye yaklaşınca sıradakine geçiliyor.
              if (
                data.duration > 0 &&
                data.position >= data.duration - END_SLACK_MS
              ) {
                const key = `${data.duration}:${data.position}`;
                if (endedForRef.current !== key) {
                  endedForRef.current = key;
                  nextRef.current();
                }
              }
            });
            setReady(true);
          },
        );
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [hasTrack]);

  /* ── Parça değişince yükle ────────────────────────────────────────────── */
  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller || !current) {
      return;
    }
    endedForRef.current = null;
    controller.loadUri(`spotify:track:${current.spotifyId}`);
    if (autoplay) {
      /**
       * `loadUri` hemen ardından `play()`: tarayıcı otomatik oynatma
       * politikası ilk sefer için kullanıcı hareketi istiyor ve o hareket
       * zaten "çal" düğmesi. Sonraki parçalar aynı iframe içinde devam
       * ettiği için engellenmiyor.
       */
      controller.play();
      window.dispatchEvent(new CustomEvent("kuronexus:music-started"));
    }
  }, [current, autoplay, ready]);

  /**
   * Şerit sabit konumlu ve içeriğin üstüne biniyor; sayfanın son satırı
   * (footer) altında kalmasın diye `body`ye tam şerit boyu kadar alt boşluk
   * veriliyor. Değişken burada yazılıyor çünkü şerit yalnızca kuyruk doluyken
   * var — `globals.css`e sabit bir `padding` yazmak her sayfanın altında
   * kalıcı bir boşluk bırakırdı.
   */
  useEffect(() => {
    if (!hasTrack) {
      return;
    }
    const root = document.documentElement;
    root.style.setProperty("--music-bar", "5.25rem");
    return () => {
      root.style.removeProperty("--music-bar");
    };
  }, [hasTrack]);

  const onToggle = useCallback(() => {
    controllerRef.current?.togglePlay();
  }, []);

  if (!current) {
    return null;
  }

  const cover = isLocalUpload(current.artwork) ? current.artwork : null;

  return (
    <aside
      className={styles.bar}
      aria-label={t("musicBar")}
      data-open={openQueue ? "true" : "false"}
    >
      {openQueue ? (
        <div className={styles.queue}>
          <div className={styles.queueHead}>
            <span className={styles.queueTitle}>
              {context ?? t("queue")}
            </span>
            <span className={styles.queueCount}>
              {t("queueCount", { done: index + 1, total: tracks.length })}
            </span>
          </div>
          <ol className={styles.queueList}>
            {tracks.map((track, position) => (
              <li key={track.spotifyId}>
                <button
                  type="button"
                  className={
                    position === index ? styles.queueRowOn : styles.queueRow
                  }
                  onClick={() => jumpTo(position)}
                >
                  <span className={styles.queueNo}>
                    {String(position + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.queueName}>{track.title}</span>
                  <span className={styles.queueArtist}>{track.artist}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <div className={styles.row}>
        {cover ? (
          /* Şerit her sayfada duruyor; 40px'lik tek kapak için `next/image`
             optimizasyon turu çalıştırmak kazançtan çok yük. Kaynak zaten
             kendi sunucumuz. */
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.cover} src={apiUrl(cover)} alt="" width={40} height={40} />
        ) : (
          <span className={styles.coverEmpty} aria-hidden="true" />
        )}

        <div className={styles.meta}>
          <span className={styles.title}>{current.title}</span>
          <span className={styles.artist}>
            {[current.artist, context].filter(Boolean).join(" · ")}
          </span>
        </div>

        {/* Spotify'ın kendi gömüsü: çal/duraklat ve ilerleme çubuğu onun
            içinde. Kendi kopyamızı çizmek, iframe'in gerçek durumundan
            sapabilecek ikinci bir gerçek üretirdi. */}
        <div className={styles.embed}>
          <div ref={hostRef} />
          {failed ? <span className={styles.warn}>{t("embedFailed")}</span> : null}
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.control}
            onClick={previous}
            disabled={index === 0}
            aria-label={t("previous")}
            title={t("previous")}
          >
            ‹‹
          </button>
          <button
            type="button"
            className={styles.control}
            onClick={onToggle}
            aria-label={t("play")}
            title={t("play")}
          >
            ⏯
          </button>
          <button
            type="button"
            className={styles.control}
            onClick={next}
            disabled={index + 1 >= tracks.length}
            aria-label={t("next")}
            title={t("next")}
          >
            ››
          </button>
          <button
            type="button"
            className={styles.control}
            onClick={() => setOpenQueue((value) => !value)}
            aria-expanded={openQueue}
            aria-label={t("queue")}
            title={t("queue")}
          >
            ☰
          </button>
          <button
            type="button"
            className={styles.control}
            onClick={clear}
            aria-label={t("close")}
            title={t("close")}
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
}
