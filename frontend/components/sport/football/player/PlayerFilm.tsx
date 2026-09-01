"use client";

import { useEffect, useRef, useState } from "react";
import type { PlayerFilm as FilmRecord } from "@/lib/sport/favourite-players";
import { youtubeEmbedUrl } from "@/lib/youtube";
import styles from "./PlayerFilm.module.css";

/**
 * ══════════════════════════════════════════════════════════════════════════
 * SİNEMA BÖLÜMÜ — spot ışıkları altında tek perde.
 *
 * THESIS: Sayfadaki hiçbir bölüm "gömülü video" gibi durmamalı. Kategorinin
 *   varsayılanı — beyaz bir dikdörtgen ve YouTube'un kendi kabuğu — bu
 *   arşivin diline yabancı. Burası bir SAHNE: perde karanlıkta duruyor,
 *   üstüne üç spot düşüyor, zeminde ışık havuzu var.
 * STORY: Ziyaretçi karanlık bir salona giriyor, perde ışık altında bekliyor,
 *   dokununca salon kararıyor ve film başlıyor.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ── GÖMÜ NEDEN AÇILIŞTA YÜKLENMİYOR ──────────────────────────────────────
 * Sayfa açıldığında YouTube'a TEK İSTEK gitmiyor. Perde o ana kadar saf CSS:
 * ışıklar, çerçeve, oynat düğmesi. Gömü yalnızca ziyaretçi dokununca DOM'a
 * giriyor.
 *
 * İki gerekçe, ikisi de ölçülebilir:
 *   1. Bir YouTube gömüsü yarım megabaytın üstünde üçüncü taraf betiği
 *      indiriyor ve bu bölüm sayfanın ALTINDA — çoğu ziyaretçi oraya hiç
 *      inmiyor.
 *   2. Gömü, video hiç oynatılmasa bile çerez yazmayı deniyor. Ziyaretçi
 *      istemediği sürece bunun olmaması doğru olan.
 *
 * ── NEDEN `youtube-nocookie.com` ─────────────────────────────────────────
 * CSP'nin `frame-src` beyaz listesinde YALNIZCA o alan adı var
 * (`next.config.ts`). `www.youtube.com` yazılsaydı gömü tarayıcıda sessizce
 * engellenirdi — konsola bir satır düşer, ziyaretçi boş bir kutu görürdü.
 * Adres bu yüzden kayıtta değil BURADA kuruluyor: kayıt yalnızca video
 * kimliğini taşıyor, yanlış alan adı yazmak imkânsız.
 *
 * ── AUTOPLAY ─────────────────────────────────────────────────────────────
 * `autoplay=1` burada tarayıcı politikasına takılmıyor: gömü ziyaretçinin
 * KENDİ tıklamasının ardından ekleniyor, yani kullanıcı etkileşimi zaten
 * gerçekleşmiş durumda. Kullanıcının isteği birebir buydu — "tıklayınca
 * doğrudan bu video oynasın".
 */
export function PlayerFilm({
  film,
  labels,
}: {
  film: FilmRecord;
  labels: { eyebrow: string; play: string; note: string };
}) {
  const [playing, setPlaying] = useState(false);
  const screenRef = useRef<HTMLDivElement | null>(null);

  /**
   * ⚠️ ODAK KURTARMA. Oynat'a basıldığında düğme DOM'dan tamamen kalkıyor ve
   * yerine `<iframe>` geliyor; odaklanmış öğe yok olunca tarayıcı odağı
   * `<body>`ye düşürüyor ve klavye kullanıcısı sayfanın en başına geri
   * dönmüş oluyor.
   *
   * Odak `iframe`e verilmiyor: çapraz kaynak bir çerçeveye odak vermek
   * kontrolü YouTube'un içine bırakır ve geri çıkmak zorlaşır. Onun yerine
   * perdeyi taşıyan KARARLI kaba odaklanılıyor — orası durum değişiminde
   * yeniden monte olmuyor ve `tabIndex={-1}` ile yalnızca program yoluyla
   * odaklanabiliyor (sekme sırasına yeni bir durak eklemiyor).
   */
  useEffect(() => {
    if (playing) screenRef.current?.focus();
  }, [playing]);

  /* Kimlikten adres: parametreler de burada. `rel=0` video bittiğinde YABANCI
     kanalların video duvarını basmasını engelliyor, `modestbranding=1`
     oynatıcının kendi logosunu kısıyor — ikisi de sahnenin karanlığını
     koruyor. */
  const src = youtubeEmbedUrl(
    film.youtubeId,
    "autoplay=1&rel=0&modestbranding=1&playsinline=1",
  );

  return (
    <section
      className={styles.film}
      aria-labelledby="film-baslik"
      data-playing={playing || undefined}
    >
      {/* ── Salon ──
          Katmanların tamamı saf CSS ve `aria-hidden`: hiçbiri dosya
          indirmiyor, hiçbiri ekran okuyucuya bir şey söylemiyor. */}
      <div className={styles.house} aria-hidden="true">
        <span className={styles.haze} />
        <span className={`${styles.beam} ${styles.beamLeft}`} />
        <span className={`${styles.beam} ${styles.beamMid}`} />
        <span className={`${styles.beam} ${styles.beamRight}`} />
        <span className={styles.pool} />
        <span className={styles.dust} />
      </div>

      <header className={styles.head}>
        <p className={styles.eyebrow}>{labels.eyebrow}</p>
        {/* Başlık iki blok `span`; aralarında metin düğümü yok, o yüzden
            ekran okuyucu için `aria-label` zorunlu (aynı gerekçe
            `PlayerStory` başlığında da yazılı). */}
        <h2
          id="film-baslik"
          className={styles.title}
          aria-label={film.title.join(" ")}
        >
          <span>{film.title[0]}</span>
          <span>{film.title[1]}</span>
        </h2>
        <p className={styles.lede}>{film.lede}</p>
      </header>

      <div className={styles.stage}>
        <div className={styles.screen} ref={screenRef} tabIndex={-1}>
          {playing ? (
            <iframe
              className={styles.frame}
              src={src}
              title={film.label}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className={styles.curtain}
              onClick={() => setPlaying(true)}
              aria-label={`${labels.play} — ${film.label}`}
            >
              <span className={styles.curtainGlow} aria-hidden="true" />
              <span className={styles.curtainScan} aria-hidden="true" />

              <span className={styles.knob} aria-hidden="true">
                <span className={styles.knobRing} />
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 6.5v11l9-5.5-9-5.5z" />
                </svg>
              </span>

              <span className={styles.cta} aria-hidden="true">
                {labels.play}
              </span>
            </button>
          )}

          {/* Çerçevenin dört köşesindeki vizör işaretleri. Oynatma başlayınca
              sönüyorlar (CSS) — perdenin kenarını kesmesinler. */}
          <span className={styles.corners} aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>

        {film.meta ? <p className={styles.meta}>{film.meta}</p> : null}
        <p className={styles.note}>{labels.note}</p>
      </div>
    </section>
  );
}
