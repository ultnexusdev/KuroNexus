"use client";

import { useEffect, useState } from "react";
import { fetchLiveScore, type LiveMatch } from "@/lib/api/football-live";
import styles from "./LiveScore.module.css";

/**
 * Canlı maç merkezi.
 *
 * ── NEDEN İSTEMCİ ADASI ──────────────────────────────────────────────────
 * Sayfanın geri kalanı sunucu bileşeni ve günde bir tazeleniyor. Skor ise
 * dakikada değişiyor; sayfanın tamamını yeniden çekmek yerine yalnızca bu
 * kutu backend'in küçük `/football-live/live` ucunu yokluyor.
 *
 * ── YOKLAMA SIKLIĞI VE NEDEN DAHA SIK DEĞİL ──────────────────────────────
 * 30 saniye. Backend zaten cache'ten okuyor ve o cache'i dakikada bir cron
 * tazeliyor — yani 30 saniyeden sık yoklamak YENİ BİLGİ getirmez, yalnızca
 * kendi sunucumuza yük olur. Sekme arkaplandayken yoklama tamamen duruyor
 * (`visibilitychange`): kimsenin bakmadığı bir skoru tazelemek pil ve trafik
 * harcamaktan ibaret.
 *
 * ── SUNUCUDAN GELEN İLK DEĞER ────────────────────────────────────────────
 * `initial` sayfa render'ında zaten dolu geliyor; bu bileşen boş başlamıyor
 * ve JS hiç çalışmazsa bile doğru bir skor gösteriyor (yalnızca ilerlemiyor).
 */
export function LiveScore({
  initial,
  clubKey,
  labels,
}: {
  initial: LiveMatch;
  clubKey: string;
  labels: { live: string; minute: string };
}) {
  const [match, setMatch] = useState<LiveMatch>(initial);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const poll = async () => {
      try {
        const next = await fetchLiveScore();
        if (cancelled || !next.match) return;
        setMatch((previous) => {
          // Gol anı: skor değiştiyse kısa bir vurgu tetikleniyor. "Sinematik
          // flash" brief'te var ama abartısı yasak — 900 ms'lik tek bir
          // parlama, ekranı kaplayan bir efekt değil.
          const scored =
            previous.homeGoals !== next.match!.homeGoals ||
            previous.awayGoals !== next.match!.awayGoals;
          if (scored) {
            setFlash(true);
            window.setTimeout(() => setFlash(false), 900);
          }
          return next.match!;
        });
      } catch {
        // Yoklama başarısızsa ekranda duran skor korunuyor. Hata mesajı
        // basmak, saniyelik bir ağ kesintisinde maç merkezini bozardı.
      }
    };

    const start = () => {
      if (timer !== undefined) return;
      timer = window.setInterval(() => void poll(), 30_000);
    };
    const stop = () => {
      if (timer === undefined) return;
      window.clearInterval(timer);
      timer = undefined;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else {
        void poll();
        start();
      }
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const isHome = match.home.key === clubKey;

  return (
    <section
      className={styles.live}
      data-flash={flash ? "" : undefined}
      aria-live="polite"
    >
      <p className={styles.badge}>
        <span className={styles.pulse} aria-hidden="true" />
        {labels.live}
        {match.minute !== null ? (
          <span className={styles.minute}>
            {match.minute}
            {labels.minute}
          </span>
        ) : null}
      </p>

      <p className={styles.score}>
        <span data-mine={isHome || undefined}>{match.home.name}</span>
        <strong>
          {match.homeGoals ?? 0}
          <span className={styles.dash}>–</span>
          {match.awayGoals ?? 0}
        </strong>
        <span data-mine={!isHome || undefined}>{match.away.name}</span>
      </p>
    </section>
  );
}
