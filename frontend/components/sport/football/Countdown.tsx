"use client";

import { useEffect, useState } from "react";
import styles from "./Countdown.module.css";

/**
 * İlk vuruşa geri sayım.
 *
 * ── NEDEN SUNUCUDAN BAŞLANGIÇ DEĞERİ ALIYOR ──────────────────────────────
 * `now` prop olarak geliyor ve ilk render TAM OLARAK onunla yapılıyor.
 * Bileşen kendi `Date.now()`unu ilk render'da çağırsaydı sunucu ve istemci
 * farklı saniyeleri yazar, React hidrasyon uyuşmazlığı verirdi.
 *
 * ── JS GELMEZSE NE OLUYOR ────────────────────────────────────────────────
 * Bu depoda `next dev` sırasında CSP `'unsafe-eval'` vermediği için istemci
 * JS'i ÇALIŞMIYOR (karar next.config.ts'te yazılı). O durumda geri sayım
 * ilerlemez ama YANLIŞ da olmaz: sunucunun hesapladığı doğru anlık değerde
 * durur. Üretimde JS çalışır ve saniyede bir ilerler.
 *
 * ── HAREKETİ AZALT ───────────────────────────────────────────────────────
 * Saniye ilerlemesi bir "animasyon" değil bilgi güncellemesi; bu yüzden
 * reduced-motion'da da çalışıyor. Kapatılan tek şey rakam geçiş efekti
 * (CSS tarafında).
 */
export function Countdown({
  targetIso,
  now,
  labels,
}: {
  targetIso: string;
  /** Sunucunun render anı (ms) — ilk kare bununla çiziliyor */
  now: number;
  labels: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    kickoff: string;
  };
}) {
  const target = Date.parse(targetIso);
  const [remaining, setRemaining] = useState(() => Math.max(0, target - now));

  useEffect(() => {
    if (!Number.isFinite(target)) return;

    // İlk etki anında gerçek saate hizalanıyor: sunucu render'ı ile
    // tarayıcının bu sayfayı gösterdiği an arasında saniyeler geçmiş olabilir
    // (ağ + hidrasyon). Hizalamadan ilerlemek geri sayımı sürekli geri
    // bırakırdı.
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();

    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (!Number.isFinite(target)) return null;

  const total = Math.floor(remaining / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  // Süre bittiğinde geri sayım "00:00:00" diye donmuyor — maç başlamış
  // demektir ve o durumu yazmak daha doğru bilgi.
  if (remaining <= 0) {
    return <p className={styles.started}>{labels.kickoff}</p>;
  }

  return (
    <div
      className={styles.countdown}
      // Ekran okuyucu için tek ve okunabilir bir cümle; rakam rakam
      // okutmak (D-H-M-S dört ayrı sayı) anlaşılmaz oluyor.
      role="timer"
      aria-label={`${days} ${labels.days} ${hours} ${labels.hours} ${minutes} ${labels.minutes}`}
    >
      <Unit value={days} label={labels.days} />
      <Unit value={hours} label={labels.hours} pad />
      <Unit value={minutes} label={labels.minutes} pad />
      <Unit value={seconds} label={labels.seconds} pad />
    </div>
  );
}

function Unit({
  value,
  label,
  pad,
}: {
  value: number;
  label: string;
  pad?: boolean;
}) {
  return (
    <div className={styles.unit} aria-hidden="true">
      <span className={styles.value}>
        {pad ? String(value).padStart(2, "0") : value}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
