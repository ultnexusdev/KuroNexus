"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { apiUrl, isLocalUpload } from "@/lib/api/client";
import { useMusicQueue } from "./MusicQueue";
import { PlaylistPicker } from "./PlaylistPicker";
import styles from "./MusicPlayerBar.module.css";

/**
 * Site geneli ince çalar şeridi.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ÇALAR NEDEN KARANTİNADA BİR IFRAME
 *
 * Gömülü çalar başka bir origin'de bir iframe: içini okuyamıyoruz, parçanın
 * bittiğini göremiyoruz. Düz `<iframe src>` ile kuyruk yapılamaz — her
 * parçadan sonra elle "ileri"ye basmak gerekirdi. Spotify'ın
 * `embed/iframe-api` betiği bunu bildiren tek resmî yol, **ama `eval`
 * istiyor** (13 Ağustos ölçümü). Bizim CSP'mizde `'unsafe-eval'` bilerek yok.
 *
 * Çözüm: betik siteye değil, **yalnızca kendi mini sayfasına** alındı —
 * `app/api/music-player/route.ts`. Bu bileşen o sayfayı iframe'liyor ve
 * `postMessage` ile konuşuyor. `eval` izni oranın dışına çıkmıyor; sitenin
 * geri kalanı `script-src 'self' 'unsafe-inline'` ile kalıyor.
 * (Karar kullanıcıya soruldu ve seçildi, 13 Ağustos 2026.)
 *
 * ⚠️ Köprü düşerse ÇALAR SESSİZCE ÖLMEZ: mini sayfa 12 saniye içinde hazır
 * olmazsa `failed` yolluyor, şerit "çalar yüklenemedi" diyor ve ileri/geri
 * çalışmaya devam ediyor. Sessiz bozulma bu projede defalarca teşhisi uzattı.
 *
 * ── ÖNİZLEME UYARISI ──────────────────────────────────────────────────────
 * Tarayıcıda Spotify oturumu açık ve hesap Premium değilse gömü parçanın
 * yalnızca ~30 saniyesini çalar. Bizim tarafımızda çözülemez
 * (`MusicTrack.previewUrl` de bilerek yok — Spotify önizleme adreslerini
 * Kasım 2024'te yeni uygulamalara kapattı).
 * ══════════════════════════════════════════════════════════════════════════
 */

/** Karantina sayfası. `middleware.ts` matcher'ı `/api`yi dışarıda bırakıyor. */
const PLAYER_SRC = "/api/music-player";

/** Köprü mesajlarının kimliği — `route.ts` içindeki değerlerle aynı olmalı. */
const HOST_TAG = "kuronexus-host";
const PLAYER_TAG = "kuronexus-player";

/** Parça sonu payı: `position` süreye bu kadar yaklaşınca sıradakine geçiliyor. */
const END_SLACK_MS = 1200;

/** Ses seviyesi kullanıcıya ait, listeye değil — cihazda kalıyor. */
const VOLUME_KEY = "kuronexus.music.volume";

interface PlayerMessage {
  source?: string;
  type?: "ready" | "update" | "failed";
  position?: number;
  duration?: number;
  isPaused?: boolean;
  reason?: string;
  /** Kontrolcüde `setVolume` gerçekten var mı — bkz. `route.ts` */
  canSetVolume?: boolean;
}

/* Çizgi ikonlar — ortam sesi çalarındakiyle aynı dil (`GlobalAmbientPlayer`),
   iki çalar aynı sitede yan yana görünüyor ve farklı çizilmeleri için sebep yok. */
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconShuffle() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" {...stroke} aria-hidden>
      <path d="M3 7h3.5c1.5 0 2.5.6 3.4 1.8l4.2 6.4c.9 1.2 1.9 1.8 3.4 1.8H21" />
      <path d="M3 17h3.5c1 0 1.8-.3 2.5-.9M21 7h-3.5c-1 0-1.8.3-2.5.9" />
      <path d="M18.5 4.5 21 7l-2.5 2.5M18.5 14.5 21 17l-2.5 2.5" />
    </svg>
  );
}

function IconPrev() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" {...stroke} aria-hidden>
      <path d="M6 5v14" />
      <path d="M18 6.5v11L9.5 12z" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" {...stroke} aria-hidden>
      <path d="M18 5v14" />
      <path d="M6 6.5v11l8.5-5.5z" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" {...stroke} aria-hidden>
      <path d="M8 5.5v13l10-6.5z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" {...stroke} aria-hidden>
      <path d="M9 5.5v13M15 5.5v13" />
    </svg>
  );
}

/** Tek parça tekrarında ortaya "1" düşüyor — Spotify'daki ayrım. */
function IconRepeat({ one }: { one: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" {...stroke} aria-hidden>
      <path d="M4 12V9.5A3.5 3.5 0 0 1 7.5 6H20" />
      <path d="M17.5 3.5 20 6l-2.5 2.5" />
      <path d="M20 12v2.5a3.5 3.5 0 0 1-3.5 3.5H4" />
      <path d="M6.5 20.5 4 18l2.5-2.5" />
      {one ? (
        <text x="12" y="14.5" fontSize="8" fill="currentColor" stroke="none" textAnchor="middle">
          1
        </text>
      ) : null}
    </svg>
  );
}

function IconVolume({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" {...stroke} aria-hidden>
      <path d="M4 9.5h3L11 6v12l-4-3.5H4z" />
      {muted ? (
        <path d="M15 9.5l4.5 5M19.5 9.5l-4.5 5" />
      ) : (
        <path d="M15 9.2a4 4 0 0 1 0 5.6M17.6 7a7.5 7.5 0 0 1 0 10" />
      )}
    </svg>
  );
}

/**
 * "Sıradakiler" — liste + oynat üçgeni.
 *
 * ⚠️ Liste seçicinin ikonuyla AYNI OLMAMALI. İlk sürümde ikisi de "çizgiler +
 * nota" siluetindeydi ve şeritte yan yana durdukları için ayırt edilmiyorlardı
 * (kullanıcı bildirimi, 13 Ağustos). İkisi ayrı kavram: bu "sırada ne var",
 * öteki "hangi listeyi çalayım". Siluetleri de ayrı: burada üçgen, orada
 * üst üste yığılmış kartlar (`PlaylistPicker`).
 */
function IconQueue() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" {...stroke} aria-hidden>
      <path d="M4 7h16M4 12h10M4 17h10" />
      <path d="M15.5 14.2v6l5-3z" />
    </svg>
  );
}

export function MusicPlayerBar() {
  const t = useTranslations("player");
  const {
    current,
    tracks,
    index,
    context,
    next,
    previous,
    jumpTo,
    clear,
    autoplay,
    shuffle,
    repeat,
    toggleShuffle,
    cycleRepeat,
    isPlaying,
    setIsPlaying,
  } = useMusicQueue();

  const frameRef = useRef<HTMLIFrameElement | null>(null);
  /** Aynı parça için "bitti" iki kez tetiklenmesin */
  const endedForRef = useRef<string | null>(null);
  /**
   * Köprü dinleyicisi BİR KEZ kuruluyor (iframe'i yeniden yüklememek için),
   * o yüzden içindeki taze değerlere ref üzerinden bakılıyor. Bağımlılığa
   * eklenselerdi dinleyici her tekrar/karışık değişiminde sökülüp kurulurdu.
   */
  const nextRef = useRef(next);
  nextRef.current = next;
  const repeatRef = useRef(repeat);
  repeatRef.current = repeat;
  const currentIdRef = useRef(current?.spotifyId ?? null);
  currentIdRef.current = current?.spotifyId ?? null;

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [openQueue, setOpenQueue] = useState(false);
  /**
   * `null` = henüz bilinmiyor, `false` = kontrolcüde `setVolume` YOK.
   * Çubuk yalnızca `true` iken çiziliyor: çalışmayan bir kaydırıcı
   * göstermek, hiç göstermemekten kötü.
   */
  const [canSetVolume, setCanSetVolume] = useState<boolean | null>(null);
  const [volume, setVolume] = useState(1);

  const hasTrack = current !== null;

  /** Karantina sayfasına komut yollar. Hedef origin AÇIKÇA veriliyor ('*' değil). */
  const post = useCallback((message: Record<string, unknown>) => {
    frameRef.current?.contentWindow?.postMessage(
      { source: HOST_TAG, ...message },
      window.location.origin,
    );
  }, []);
  const postRef = useRef(post);
  postRef.current = post;

  /* ── Köprü: mini sayfadan gelen olaylar ───────────────────────────────── */
  useEffect(() => {
    function onMessage(event: MessageEvent<PlayerMessage>) {
      // ⚠️ Origin kontrolü şart: herhangi bir pencere bu sayfaya mesaj atabilir
      if (event.origin !== window.location.origin) {
        return;
      }
      const data = event.data;
      if (!data || data.source !== PLAYER_TAG) {
        return;
      }
      if (data.type === "ready") {
        setFailed(false);
        setReady(true);
        setCanSetVolume(data.canSetVolume === true);
        return;
      }
      if (data.type === "failed") {
        setFailed(true);
        return;
      }
      if (data.type === "update") {
        setIsPlaying(data.isPaused === false);
        const duration = data.duration ?? 0;
        const position = data.position ?? 0;
        // Parça sonu: Spotify ayrı bir "ended" olayı yayınlamıyor, o yüzden
        // konum süreye yaklaşınca sıradakine geçiliyor.
        if (duration > 0 && position >= duration - END_SLACK_MS) {
          const key = `${duration}:${position}`;
          if (endedForRef.current !== key) {
            endedForRef.current = key;
            if (repeatRef.current === "one" && currentIdRef.current) {
              /**
               * Tek parça tekrarı kuyrukta YAPILAMIYOR: `index` değişmediği
               * için React hiçbir şey görmez ve tekrar sessizce çalışmazdı.
               * Parça doğrudan yeniden yükleniyor.
               */
              postRef.current({
                type: "load",
                spotifyId: currentIdRef.current,
                autoplay: true,
              });
            } else {
              nextRef.current();
            }
          }
        }
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [setIsPlaying]);

  /* ── Parça değişince yükle ────────────────────────────────────────────── */
  useEffect(() => {
    if (!ready || !current) {
      return;
    }
    endedForRef.current = null;
    /**
     * `autoplay` ilk "çal" düğmesiyle açılıyor; tarayıcı otomatik oynatma
     * politikası ilk sefer kullanıcı hareketi istiyor ve o hareket zaten
     * düğmenin kendisi. Sonraki parçalar aynı iframe içinde devam ettiği için
     * engellenmiyor.
     */
    post({ type: "load", spotifyId: current.spotifyId, autoplay });
    if (autoplay) {
      window.dispatchEvent(new CustomEvent("kuronexus:music-started"));
    }
  }, [current, autoplay, ready, post]);

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

  const onToggle = useCallback(() => post({ type: "toggle" }), [post]);

  /* Kayıtlı ses seviyesi — cihaz başına, kuyruktan bağımsız */
  useEffect(() => {
    const saved = Number(window.localStorage.getItem(VOLUME_KEY));
    if (Number.isFinite(saved) && saved >= 0 && saved <= 1) {
      setVolume(saved);
    }
  }, []);

  /* Çalar hazır olunca kayıtlı seviyeyi uygula ve her değişimde ilet */
  useEffect(() => {
    if (canSetVolume === true) {
      post({ type: "volume", value: volume });
    }
  }, [volume, canSetVolume, post]);

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

        {/* ── Orta bölge: kumanda ─────────────────────────────────────────
            13 Ağustos'ta sağ uçtan BURAYA alındı (kullanıcı isteği, ekran
            görüntüsüyle işaretlendi): kumanda en sağda kalıyordu, gömünün
            ortasındaki geniş boşluk ise boş duruyordu. Spotify'ın kendi düzeni
            de bu — solda künye, ortada kumanda, sağda ikincil araçlar.

            Sıra da Spotify'ınkiyle aynı: karışık · önceki · çal · sonraki ·
            tekrar. Alışkanlık kasında duran bir sıra; kendi sıramızı icat
            etmenin kazancı yok. Çal/duraklat gömünün içinde de var ve ikisi
            aynı köprüye bağlı, yani ayrışamıyorlar. */}
        <div className={styles.controls}>
          <button
            type="button"
            className={shuffle ? styles.controlOn : styles.control}
            onClick={toggleShuffle}
            aria-pressed={shuffle}
            aria-label={t("shuffle")}
            title={t("shuffle")}
          >
            <IconShuffle />
          </button>
          <button
            type="button"
            className={styles.control}
            onClick={previous}
            disabled={index === 0}
            aria-label={t("previous")}
            title={t("previous")}
          >
            <IconPrev />
          </button>
          <button
            type="button"
            className={styles.playButton}
            onClick={onToggle}
            aria-label={isPlaying ? t("pause") : t("play")}
            title={isPlaying ? t("pause") : t("play")}
          >
            {isPlaying ? <IconPause /> : <IconPlay />}
          </button>
          <button
            type="button"
            className={styles.control}
            onClick={next}
            disabled={
              // "all"/"one" modunda kuyruğun sonu bir duvar değil
              repeat === "off" && index + 1 >= tracks.length
            }
            aria-label={t("next")}
            title={t("next")}
          >
            <IconNext />
          </button>
          <button
            type="button"
            className={repeat === "off" ? styles.control : styles.controlOn}
            onClick={cycleRepeat}
            aria-label={t(`repeatMode.${repeat}`)}
            title={t(`repeatMode.${repeat}`)}
          >
            <IconRepeat one={repeat === "one"} />
          </button>
        </div>

        {/* ── Sağ bölge: gömü + ikincil araçlar ────────────────────────────
            Karantina sayfası. İçinde Spotify'ın kendi gömüsü var: ilerleme
            çubuğu ve süre onun. Kendi kopyamızı çizmek, iframe'in gerçek
            durumundan sapabilecek ikinci bir gerçek üretirdi.

            ⚠️ Bu iframe kuyruk boşalana kadar SÖKÜLMÜYOR — sökülürse ses
            kesilir. Dar ekranda `display: none` ile gizleniyor, kaldırılmıyor. */}
        <div className={styles.embed}>
          <iframe
            ref={frameRef}
            src={PLAYER_SRC}
            title={t("musicBar")}
            height={80}
            /* ⚠️ Gerçek sınır bu öznitelik DEĞİL, mini sayfanın kendi CSP'si
               (`next.config.ts` → `PLAYER_CSP`). Aynı origin'de `allow-scripts`
               ile `allow-same-origin` birlikte verildiğinde sandbox zaten
               anlamlı bir hapis kurmuyor — burada işe yarayan tarafı form
               gönderimini ve üst pencereyi yönlendirmeyi kapatması.
               `allow-same-origin` postMessage köprüsü için zorunlu. */
            sandbox="allow-scripts allow-same-origin allow-popups"
            allow="autoplay; encrypted-media"
          />
          {failed ? <span className={styles.warn}>{t("embedFailed")}</span> : null}
        </div>

        <div className={styles.tools}>
          {/* Liste seçici: sayfaya gitmeden başka bir listeye geçmek için */}
          <PlaylistPicker />

          {/* ⚠️ SES ÇUBUĞU BUGÜN ÇİZİLMİYOR — ölçüldü (13 Ağustos 2026):
              Spotify'ın gömü kontrolcüsünde `setVolume` YOK. Yetenek
              `route.ts` içinde soruluyor ve `false` dönüyor.

              Kod duruyor çünkü ölçümün kendisi bu: yarın Spotify metodu
              eklerse çubuk kendiliğinden görünür, kaldırıp yeniden yazmak
              gerekmez. Koşulsuz çizilseydi hiçbir şey yapmayan bir kaydırıcı
              olurdu — bu projede sessiz bozulma defalarca teşhisi uzattı.

              Gerçek ses denetimi için tek yol Spotify **Web Playback SDK**:
              Premium hesap + OAuth (Authorization Code) gerektiriyor, yani
              ayrı bir faz. Bugünkü karşılığı sekme/işletim sistemi sesi. */}
          {canSetVolume ? (
            <label className={styles.volume}>
              <span className={styles.srOnly}>{t("volume")}</span>
              <IconVolume muted={volume === 0} />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                title={t("volume")}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setVolume(value);
                  try {
                    window.localStorage.setItem(VOLUME_KEY, String(value));
                  } catch {
                    // Depolama kapalı: seviye yine çalışır, sadece kalıcı olmaz
                  }
                }}
              />
            </label>
          ) : null}

          <button
            type="button"
            className={styles.control}
            onClick={() => setOpenQueue((value) => !value)}
            aria-expanded={openQueue}
            aria-label={t("queue")}
            title={t("queue")}
          >
            <IconQueue />
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
