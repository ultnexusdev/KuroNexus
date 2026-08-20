"use client";

import { useEffect, useState } from "react";
import styles from "./PlayerRoute.module.css";

export interface RouteStop {
  id: string;
  label: string;
}

/**
 * DİKEY BÖLÜM RAYI — sayfanın sağ kenarında.
 *
 * ── NE İŞ YAPIYOR ────────────────────────────────────────────────────────
 * İki şey: nerede olduğunu söylüyor ve atlamayı sağlıyor. Bir profil sayfası
 * beş sahneden geçiyor ve arada geri dönmek isteyen kişinin tek seçeneği
 * kaydırmak olmamalı.
 *
 * ── NEDEN YALNIZCA GENİŞ EKRAN ───────────────────────────────────────────
 * Dar ekranda kenarda duracak yatay yer yok; alta yapıştırılan bir şerit ise
 * içeriğin üstünü kapatır ve mobil tarayıcı çubuklarıyla çakışır. Dar ekranda
 * bölüm başlıkları zaten sırayla geçiyor — ray orada bir sorunu çözmüyor,
 * o yüzden hiç çizilmiyor (`display: none`, DOM'dan da çıkarılmıyor ki
 * ekran genişleyince yeniden gözlemci kurmak gerekmesin).
 *
 * ── AKTİF BÖLÜM ──────────────────────────────────────────────────────────
 * `IntersectionObserver`, ekranın üst yarısına giren son bölüm aktif. Çapa
 * bağlantıları normal `<a href="#...">` — JS gelmezse de çalışıyorlar.
 */
export function PlayerRoute({
  stops,
  label,
}: {
  stops: RouteStop[];
  label: string;
}) {
  const [active, setActive] = useState(stops[0]?.id ?? "");

  useEffect(() => {
    const targets = stops
      .map((stop) => document.getElementById(stop.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, [stops]);

  if (stops.length === 0) return null;

  return (
    <nav className={styles.route} aria-label={label}>
      <ol>
        {stops.map((stop) => (
          <li key={stop.id} data-active={stop.id === active ? "" : undefined}>
            <a href={`#${stop.id}`}>
              <i aria-hidden="true" />
              <span>{stop.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
