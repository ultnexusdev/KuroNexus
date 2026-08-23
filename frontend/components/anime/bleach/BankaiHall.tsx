"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { BANKAI_HALL } from "@/lib/anime/bleach/bankai";
import styles from "./BankaiHall.module.css";
import world from "./world.module.css";

export interface BankaiLabels {
  eyebrow: string;
  title: string;
  lede: string;
  corridorAria: string;
  advance: string;
  /** "Nişi aydınlat — {name}" */
  reveal: string;
}

/**
 * P05 · BANKAI SALONU.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Karanlık bir koridor, duvarlarda kapalı silüetler. Sayfanın en sinematik
 * ve en SESSİZ yeri: az eleman, çok gerilim. **Bankai bir sırdır** ve bölüm
 * bunu bilgi mimarisiyle söylüyor — niş kapalıyken kimin durduğu belli
 * değil, ad ancak ışık düşünce beliriyor.
 *
 * ── RİTİM KIRILMASI ──────────────────────────────────────────────────────
 * Sayfanın tamamı dikey bir iniş; burası tek yatay ada. Bu bilinçli: on
 * yedi bölüm boyunca aşağı inen bir okuma, bir kez yana yürüyor.
 *
 * ── ⚠️ SCROLL HIJACK YOK ─────────────────────────────────────────────────
 * Tekerlek yatayı sürüyor ama **yalnızca koridorda yer varken.** Uçlara
 * gelindiğinde olay serbest bırakılıyor ve sayfa normal dikey akışına
 * devam ediyor. Kullanıcıyı bir bölümün içine hapsetmek (klasik scroll
 * hijack) brief'in açıkça yasakladığı şey.
 *
 * ── DOKUNMATİKTE HOVER YOK ───────────────────────────────────────────────
 * Nişler `<button>` ve tıklamayla **sabitleniyor**. Hover'a bağlı bir
 * tasarım dokunmatikte adları tamamen erişilemez bırakırdı; buton hem onu
 * hem klavyeyi hem de odak halkasını tek hamlede çözüyor.
 */
export function BankaiHall({
  locale,
  labels,
  art,
}: {
  locale: string;
  labels: BankaiLabels;
  /**
   * Nişlerin silüetleri — SUNUCUDA çizilip buraya prop olarak iniyor.
   *
   * ⚠️ `CuratedImage` bir SUNUCU bileşeni (`next/headers` okuyor) ve bu
   * dosya `"use client"`. Sunucu bileşeni istemciye **import edilemez**;
   * derleme bunu hatayla durduruyor (ölçüldü). React'in izin verdiği yol
   * onu prop/children olarak geçirmek — küratör sözleşmesi böylece
   * korunuyor, sınır da ihlal edilmiyor.
   */
  art: ReactNode[];
}) {
  const corridorRef = useRef<HTMLDivElement | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);

  /**
   * Dikey tekerleği yatay kaydırmaya çeviriyor.
   *
   * ⚠️ Elle bağlanıyor çünkü `preventDefault` gerekiyor ve React'in
   * `onWheel`i pasif dinleyici olarak bağlanabiliyor — pasif bir
   * dinleyicide `preventDefault` sessizce yok sayılır.
   *
   * ⚠️ Uçlarda MÜDAHALE YOK: koridor sonuna geldiyse ve kullanıcı aşağı
   * kaydırıyorsa olay serbest bırakılıyor. Sayfa akışı kilitlenmiyor.
   */
  useEffect(() => {
    const el = corridorRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      /* Yatay tekerlek (trackpad) zaten doğru eksende: karışma. */
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft >= max - 1;
      const forward = event.deltaY > 0;

      if ((forward && atEnd) || (!forward && atStart)) return;

      event.preventDefault();
      el.scrollLeft += event.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section id="bankai" data-layer="soul-society" className={styles.section}>
      <div className={styles.head}>
        <p className={world.eyebrow} lang="en">
          {labels.eyebrow}
        </p>
        {/* Tek büyük işaret: 卍. Bölümün adı bile ondan sonra geliyor. */}
        <span className={styles.manji} lang="ja" aria-hidden="true">
          卍
        </span>
        <h2 className={world.section}>{labels.title}</h2>
        <p className={`${world.body} ${styles.lede}`}>{labels.lede}</p>
      </div>

      <div
        ref={corridorRef}
        className={styles.corridor}
        role="group"
        aria-label={labels.corridorAria}
        tabIndex={-1}
      >
        <ol className={styles.niches}>
          {BANKAI_HALL.map((niche, i) => {
            const isPinned = pinned === niche.id;
            return (
              <li
                key={niche.id}
                className={styles.slot}
                data-final={niche.final ? "" : undefined}
              >
                <button
                  type="button"
                  className={styles.niche}
                  data-pinned={isPinned ? "" : undefined}
                  data-final={niche.final ? "" : undefined}
                  aria-pressed={isPinned}
                  aria-label={`${labels.reveal} — ${niche.name}`}
                  style={{ "--reiatsu": niche.reiatsu } as React.CSSProperties}
                  onClick={() => setPinned(isPinned ? null : niche.id)}
                  onFocus={(event) => {
                    /* Odaklanan niş kendiliğinden görünür alana kayıyor —
                       klavyeyle gezen biri koridorda kaybolmasın.
                       `block: nearest`: dikey konumu BOZMA. */
                    event.currentTarget.scrollIntoView({
                      block: "nearest",
                      inline: "center",
                      behavior: "smooth",
                    });
                  }}
                >
                  {/* Işık: nişi İÇERİDEN aydınlatıyor. Hızlı geçişte iz
                      bırakması için giriş 260ms, çıkış 900ms (CSS). */}
                  <span className={styles.glow} aria-hidden="true" />

                  <span className={styles.art}>{art[i]}</span>

                  {/* Ad alttan yukarı yükseliyor. Kapalıyken DOM'da ama
                      görünmez: ekran okuyucu her zaman okuyabiliyor,
                      göz ancak ışık düşünce görüyor. */}
                  <span className={styles.plate}>
                    <span className={styles.plateKanji} lang="ja">
                      {niche.kanji}
                    </span>
                    <span className={styles.plateName}>{niche.name}</span>
                    <span className={styles.plateOwner}>{niche.owner}</span>
                    {niche.note ? (
                      <span className={styles.plateNote}>
                        {locale === "en"
                          ? (niche.note.en ?? niche.note.tr)
                          : niche.note.tr}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Zemin çizgisi: nişlerin oturduğu tek yatay iz */}
        <span className={styles.floor} aria-hidden="true" />
      </div>

      <p className={styles.advance}>
        <span className={world.meta}>{labels.advance}</span>
        <span lang="ja" aria-hidden="true">
          進む
        </span>
      </p>
    </section>
  );
}
