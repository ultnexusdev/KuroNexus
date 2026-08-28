"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SLAM_DUNK_ANCHORS } from "@/lib/anime/slam-dunk/anchors";
import { QUARTER_SCORES } from "@/lib/anime/slam-dunk/scoreboard";
import { TEAMS } from "@/lib/anime/slam-dunk/teams";
import styles from "./Scoreboard.module.css";

/**
 * NEON SKORBORD — sayfanın gezinme omurgası.
 *
 * ── SİTE BAŞLIĞININ ALTINDA, ONUN YERİNE DEĞİL ───────────────────────────
 * Kullanıcı kararı (28 Ağustos 2026): skorbord sitenin kendi başlığının
 * ALTINDA yapışkan duruyor. Referans tasarımda sayfanın en üstündeydi ve
 * orada kalsaydı ziyaretçi iki ayrı menü görürdü — biri arşivin, biri
 * sayfanın. Şimdi ikisi üst üste binmiyor: skorbord bir SAYFA İÇİ menü.
 *
 * ── NEDEN İSTEMCİ BİLEŞENİ ───────────────────────────────────────────────
 * Tek sebep kaydırma takibi: hangi çeyrekteysen skorbord onun skorunu
 * yazıyor. Bu sayfadaki üç istemci adasından biri ve en küçüğü
 * (`IntersectionObserver` + iki `useState`).
 *
 * ── SKOR SÜS DEĞİL ───────────────────────────────────────────────────────
 * Her çeyrek o bölümün anlattığı maçın GERÇEK skorunu gösteriyor: açılışta
 * 0-0, Shohoku bölümünde Shoyo galibiyeti, devre arasında Ryonan, kenar
 * bölümünde Kainan yenilgisi, kapanışta Sannoh'nun bir sayısı. Ziyaretçi
 * sayfada indikçe skorbord sezonu sırayla oynuyor.
 *
 * ── ⚠️ JS GELMEZSE ───────────────────────────────────────────────────────
 * Menü `<a href="#...">` bağlantılarından ibaret ve sunucuda çiziliyor:
 * JS hiç gelmese bile gezinme çalışıyor, yalnızca skor açılış değerinde
 * kalıyor. Bu bilinçli — gezinmeyi JS'e bağlamak, bir betik hatasında
 * sayfayı gezilemez yapardı.
 */
export function Scoreboard({ audio }: { audio?: React.ReactNode }) {
  const t = useTranslations("slamDunk");
  const [active, setActive] = useState(0);

  useEffect(() => {
    /* Bölümün "aktif" sayıldığı an: üst kenarı skorbordun hemen altını
       geçtiğinde. `rootMargin`in üst değeri skorbordun kendi yüksekliği
       kadar — yoksa bölüm başlığı barın ARDINDA kalırken skor çoktan
       değişmiş oluyor. */
    const sections = SLAM_DUNK_ANCHORS.map((a) =>
      document.getElementById(a.anchor),
    ).filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    /* ⚠️ DURUM CALLBACK'İN DIŞINDA TUTULUYOR.
       `IntersectionObserver` her seferinde yalnızca DEĞİŞEN bölümleri
       veriyor. Karar yalnız o listeye bakılarak verilseydi, "bir bölüm
       görünmez oldu" bilgisini taşıyan bir çağrıda görünür hiçbir şey
       kalmaz ve skorbord eski çeyrekte donardı. Tam harita tutulunca
       karar her zaman sayfanın gerçek durumundan okunuyor. */
    const seen = new Map<HTMLElement, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          seen.set(entry.target as HTMLElement, entry.isIntersecting);
        }
        /* `sections` belge sırasında, yani ilk görünür olan EN ÜSTTEKİ. */
        const index = sections.findIndex((section) => seen.get(section));
        if (index >= 0) setActive(index);
      },
      { rootMargin: "-84px 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const score = QUARTER_SCORES[active] ?? QUARTER_SCORES[0];
  const opponent = score.opponent ? TEAMS[score.opponent].name : t("visitor");
  const leading =
    score.home === score.away
      ? "tie"
      : score.home > score.away
        ? "home"
        : "away";

  return (
    <nav
      className={styles.board}
      aria-label={t("nav.aria")}
      data-team="shohoku"
    >
      <div className={styles.inner}>
        <ul className={styles.quarters}>
          {SLAM_DUNK_ANCHORS.map((anchor, index) => (
            <li key={anchor.anchor}>
              <a
                href={`#${anchor.anchor}`}
                className={styles.quarter}
                data-active={index === active ? "" : undefined}
                aria-current={index === active ? "true" : undefined}
              >
                <span className={styles.quarterLabel}>
                  {t(`quarters.${anchor.key}`)}
                </span>
                {/* LED şeridi: aktif çeyrekte doluyor. Dekoratif. */}
                <span className={styles.led} aria-hidden />
              </a>
            </li>
          ))}
        </ul>

        {/* ── SKOR PANELİ ────────────────────────────────────────
            `aria-live` YOK ve bilerek: kaydırma sırasında değişen bir
            skoru ekran okuyucuya duyurmak, okumayı sürekli kesen bir
            gürültü olurdu. Panel `aria-hidden` değil — istenirse
            okunabiliyor, kendiliğinden konuşmuyor. */}
        <div className={styles.panel} data-leading={leading}>
          <div className={styles.side}>
            <span className={styles.sideLabel}>{t("home")}</span>
            <span className={styles.team}>Shohoku</span>
          </div>
          <span className={styles.digits}>
            {String(score.home).padStart(2, "0")}
          </span>
          <span className={styles.colon} aria-hidden>
            ·
          </span>
          <span className={styles.digits}>
            {String(score.away).padStart(2, "0")}
          </span>
          <div className={styles.side}>
            <span className={styles.sideLabel}>{t("visitor")}</span>
            <span className={styles.team}>{opponent}</span>
          </div>
        </div>

        {/* Ses denetimi ve küratörün "müzik ekle" düğmesi sağ uçta.
            Sunucuda çizilip prop olarak geliyor: bu bileşen ses
            mantığını hiç bilmiyor. */}
        {audio ? <div className={styles.audio}>{audio}</div> : null}
      </div>
    </nav>
  );
}
