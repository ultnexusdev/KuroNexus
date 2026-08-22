"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { sportHref } from "@/lib/sport/routes";
import { nameLangOf, type FavouritePlayer } from "@/lib/sport/players/types";
import { PlayerImage } from "./player/PlayerImage";
import { usePlayerCurator } from "./player/PlayerCurator";
import shell from "@/app/[locale]/spor/layout.module.css";
import styles from "./PlayerRail.module.css";

export interface PlayerRailLabels {
  title: string;
  lede: string;
  open: string;
  prev: string;
  next: string;
}

/**
 * FAVORİ FUTBOLCULAR — yatay kart rayı.
 *
 * ── NEDEN IZGARA DEĞİL ───────────────────────────────────────────────────
 * Brief açıkça "standart küçük kart grid'i" istemiyor ve haklı: ızgara
 * kayıtları EŞİT gösterir, bu bölüm ise bir SEÇKİ — eşitlik burada anlam
 * kaybı. Yatay ray hem seçkinin sırasını görünür kılıyor hem de kartların
 * poster boyunda kalmasına izin veriyor.
 *
 * ── TEK KAYITLA DA ÇALIŞMASI ─────────────────────────────────────────────
 * Bugün defterde bir futbolcu var. Tek kartlık bir ray "bozuk ray" gibi
 * görünürdü — efsaneler ızgarasında yaşanan hatanın aynısı. Çözüm: İLK kart
 * her zaman çift genişlikte. Tek kayıtta bant dolu görünüyor, ikinci kayıt
 * eklendiğinde ray kendiliğinden ray oluyor.
 *
 * ── KAYDIRMA KONTROLLERİ ─────────────────────────────────────────────────
 * Oklar yalnızca kaydırılacak bir şey VARSA çiziliyor ve durumları gerçek
 * kaydırma konumundan okunuyor (`scrollLeft`), tahmin edilmiyor. Dokunmatik
 * cihaz zaten parmakla kaydırıyor; oklar orada gizlenmiyor ama gerekmiyor da.
 * Klavye: ray `tabindex` almıyor, kartların kendisi odaklanabilir ve tarayıcı
 * odaklanan kartı görünür alana kendisi getiriyor.
 */
function CardShell({
  curating,
  href,
  className,
  style,
  children,
}: {
  curating: boolean;
  href: string;
  className: string;
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  if (curating) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  );
}

export function PlayerRail({
  players,
  labels,
}: {
  players: FavouritePlayer[];
  labels: PlayerRailLabels;
}) {
  const curator = usePlayerCurator();
  const curating = curator?.curating ?? false;
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [overflow, setOverflow] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const slack = el.scrollWidth - el.clientWidth;
    setOverflow(slack > 8);
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft >= slack - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure]);

  const nudge = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    /* Bir kart genişliği kadar: sabit piksel yazmak kart boyu clamp'lendiği
       için yanlış olurdu.

       ⚠️ İLK KART ÖLÇÜLMÜYOR. `li[data-lead]` bilerek çift genişlikte
       (`clamp(19rem, 88vw, 38rem)` — normal kart `clamp(16rem, 74vw, 21rem)`);
       onu ölçmek adımı neredeyse iki katına çıkarıyor ve ok her basışta bir
       kart atlıyordu. Ölçü NORMAL bir karttan alınıyor, yoksa ilkinden.

       Boşluk da sabit yazılmıyor: CSS'te `clamp(0.75rem, 2vw, 1.5rem)`, yani
       12-24 px arasında değişiyor ve sabit 24 dar ekranda fazla itiyordu. */
    const card =
      el.querySelector("li:not([data-lead])") ?? el.querySelector("li");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = card
      ? card.getBoundingClientRect().width + gap
      : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  if (players.length === 0) return null;

  return (
    <section className={styles.band} aria-labelledby="futbol-favoriler">
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={styles.wash} />
        <span className={styles.grid} />
      </div>

      <header className={styles.head}>
        <div className={styles.headText}>
          <h2
            id="futbol-favoriler"
            className={`${shell.display} ${styles.heading}`}
          >
            {labels.title}
          </h2>
          <p className={styles.lede}>{labels.lede}</p>
        </div>

        {overflow ? (
          <div className={styles.controls}>
            <button
              type="button"
              onClick={() => nudge(-1)}
              disabled={atStart}
              aria-label={labels.prev}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              disabled={atEnd}
              aria-label={labels.next}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : null}
      </header>

      {/* `data-sig` kartın BOŞ hâlini oyuncuya özel kılıyor: fotoğrafı
          yüklenmemiş yuvada `PlayerImage` tasarlanmış bir boşluk çiziyor ve o
          boşluğun motifi bu öznitelikten okunuyor. Paletle birlikte yirmi üç
          kart yirmi üç ayrı boşluk gösteriyor, aynı gri kutu değil. */}
      <ul className={styles.track} ref={trackRef}>
        {players.map((player, i) => (
          <li
            key={player.slug}
            data-lead={i === 0 ? "" : undefined}
            data-sig={player.design.signature}
          >
            {/* ⚠️ Kürator modunda kart bir <a> DEĞİL: düzenleyicinin dosya ve
                adres alanları bağlantının içinde kalırsa hem geçersiz HTML olur
                hem de alana basınca sayfa değişir (galeri karelerinde ölçüldü). */}
            <CardShell
              curating={curating}
              href={sportHref.favouritePlayer(player.slug)}
              className={styles.card}
              style={
                {
                  "--ink": player.palette.ink,
                  "--accent": player.palette.accent,
                  "--warm": player.palette.warm,
                  "--glow": player.palette.glow,
                  "--neon": player.palette.neon,
                } as React.CSSProperties
              }
            >
              <span className={styles.scene} aria-hidden="true">
                <span className={styles.spot} />
                <span className={styles.beam} />
                {/* Dev soyad, figürün ARKASINDA. Bir başlık değil,
                    kompozisyonun zemin katmanı — o yüzden aria-hidden. */}
                <span className={`${shell.display} ${styles.ghost}`}>
                  {player.lastName}
                </span>
              </span>

              {/* Kart görseli bir YUVA: fotoğrafı yoksa `PlayerImage`
                  tasarlanmış yer tutucuyu çiziyor, kırık kutu değil. */}
              <span className={styles.figure} aria-hidden="true">
                <PlayerImage slot={player.card} position="50% 20%" decorative />
              </span>

              <span className={styles.shade} aria-hidden="true" />

              <div className={styles.body}>
                {player.shirt !== null ? (
                  <span
                    className={`${shell.figure} ${styles.shirt}`}
                    aria-hidden="true"
                  >
                    {player.shirt}
                  </span>
                ) : null}

                <span className={styles.role}>
                  {player.position} · {player.club}
                </span>

                {/* ⚠️ `lang` SÜS DEĞİL. Bu başlık CSS'te büyütülüyor ve
                    sayfanın dili Türkçe: Türkçe büyütme kuralı `i` harfini
                    `İ` yapıyor ve "Victor Osimhen" kartta VİCTOR OSİMHEN
                    olarak çıkıyordu (kullanıcı bildirimi, 21 Ağustos 2026).
                    Öznitelik tarayıcıya hangi dilin kuralıyla büyüteceğini
                    söylüyor; dize hiç değişmiyor. Gerekçe `nameLangOf`. */}
                <h3
                  className={`${shell.display} ${styles.name}`}
                  lang={nameLangOf(player)}
                >
                  {player.name}
                </h3>

                <span className={styles.tagline}>{player.tagline}</span>

                <span className={styles.foot}>
                  <span className={`${shell.data} ${styles.origin}`}>
                    {player.country}
                  </span>
                  <span className={styles.open}>
                    {labels.open}
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 12h15M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </span>
              </div>
            </CardShell>
          </li>
        ))}
      </ul>
    </section>
  );
}
