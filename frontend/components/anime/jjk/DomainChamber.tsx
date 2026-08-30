"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import styles from "./DomainSection.module.css";

/**
 * ALAN ODASI — istemci adası (sayfanın en büyük adası, bilinçli).
 *
 * Bölüm kökü burada: `data-domain` niteliği globals.css'teki paleti
 * çevirir. Devralma native `<dialog>` — odak tuzağı, ESC ve üst katman
 * tarayıcıdan geliyor; biz yalnızca kaydırma kilidini yönetiyoruz.
 *
 * ── KAYDIRMA KİLİDİ TEK KAPIDAN ──────────────────────────────────────────
 * Kilit `open()` içinde DEĞİL, diyaloğun `close` olayında çözülüyor:
 * ESC, ✕ ve zemine tıklama üçü de aynı olaydan geçer, kilit hiçbir yoldan
 * asılı kalamaz (Gojo scroll-kilidi arızasının dersi). Bileşen sökülürse
 * cleanup aynı işi yapar.
 */
export interface DomainView {
  slug: string;
  caster: string;
  jp: string;
  en: string;
  grade: string;
  hit: string;
  body: string;
  tag: string;
  glyph: string;
}

export function DomainChamber({
  domains,
  frames,
  takeoverStills,
  pens,
  labels,
}: {
  domains: DomainView[];
  frames: ReactNode[];
  takeoverStills: ReactNode[];
  pens: ReactNode[];
  labels: {
    no: string;
    kanji: string;
    latin: string;
    lede: string;
    listAria: string;
    caster: string;
    grade: string;
    hit: string;
    enter: string;
    exit: string;
    active: string;
    titleId: string;
  };
}) {
  const [active, setActive] = useState(0);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const domain = domains[active];

  /* Kilidi çözen TEK yer. Diyalog nasıl kapanırsa kapansın koşar. */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const unlock = () => {
      document.documentElement.style.removeProperty("overflow");
    };
    dialog.addEventListener("close", unlock);
    return () => {
      dialog.removeEventListener("close", unlock);
      unlock();
    };
  }, []);

  const enter = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();
  };

  return (
    <section
      id="domain"
      aria-labelledby={labels.titleId}
      className={styles.chamber}
      data-domain={domain.slug}
      tabIndex={-1}
    >
      {/* Alanın doku katmanı + dev hayalet kanji — dekor */}
      <span className={styles.weave} aria-hidden="true" />
      <span className={styles.ghost} aria-hidden="true" lang="ja">
        領
      </span>

      <div className={styles.inner}>
        <div className={styles.detail}>
          <header>
            <p className={styles.no}>{labels.no}</p>
            <h2 id={labels.titleId} className={styles.head}>
              <span className={styles.headKanji} lang="ja">{labels.kanji}</span>
              <span className={styles.headLatin}>{labels.latin}</span>
            </h2>
            <p className={styles.lede}>{labels.lede}</p>
          </header>

          <h3 className={styles.domJp} lang="ja">
            {domain.jp}
          </h3>
          <p className={styles.domEn} lang="en">
            {domain.en}
          </p>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.body}>{domain.body}</p>

          <dl className={styles.meta}>
            <div>
              <dt>{labels.caster}</dt>
              <dd>{domain.caster}</dd>
            </div>
            <div>
              <dt>{labels.grade}</dt>
              <dd>{domain.grade}</dd>
            </div>
            <div>
              <dt>{labels.hit}</dt>
              <dd>{domain.hit}</dd>
            </div>
          </dl>

          <button type="button" className={styles.enter} onClick={enter}>
            <span lang="ja" aria-hidden="true">領域展開</span> — {labels.enter}
          </button>

          {/* Bölüm içi kadraj — seçili alanın yuvası */}
          <div className={styles.stillSeat}>
            {frames.map((node, i) => (
              <span
                key={domains[i].slug}
                className={styles.seatFrame}
                data-on={i === active ? "" : undefined}
              >
                {node}
                {pens[i]}
              </span>
            ))}
          </div>
        </div>

        {/* Alan listesi */}
        <div
          className={styles.list}
          role="tablist"
          aria-label={labels.listAria}
          aria-orientation="vertical"
        >
          {domains.map((item, i) => (
            <button
              key={item.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              className={styles.pick}
              data-on={i === active ? "" : undefined}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  const delta = e.key === "ArrowDown" ? 1 : -1;
                  const next = (i + delta + domains.length) % domains.length;
                  setActive(next);
                  (
                    e.currentTarget.parentElement?.children[next] as HTMLElement
                  )?.focus();
                }
              }}
            >
              <span className={styles.pickCaster}>{item.caster}</span>
              <span className={styles.pickEn} lang="en">
                {item.en}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── DEVRALMA — tam ekran alan ─────────────────────────────────────
          Diyalog bölümün İÇİNDE: üst katmana çıksa da DOM'da burada durur,
          yani `data-domain` paleti kalıtımla üstünde. */}
      <dialog
        ref={dialogRef}
        className={styles.take}
        aria-label={`${domain.jp} — ${domain.en}`}
        onClick={(e) => {
          /* Zemine tıklama kapatır; içerik tıklaması kapatmaz */
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className={styles.takeFx} aria-hidden="true" />
        <div className={styles.takeShape} aria-hidden="true" />
        <div className={styles.takeVignette} aria-hidden="true" />
        <span className={styles.takeGhost} aria-hidden="true" lang="ja">
          {domain.glyph}
        </span>

        <div className={styles.takeInner}>
          <div className={styles.takeText}>
            <p className={styles.takeEyebrow}>
              <span lang="ja">領域展開</span> — {labels.active}
              <button
                type="button"
                className={styles.exit}
                onClick={() => dialogRef.current?.close()}
              >
                {labels.exit} ✕
              </button>
            </p>
            <p className={styles.takeJp} lang="ja">
              {domain.jp}
            </p>
            <p className={styles.takeEn} lang="en">
              {domain.en}
            </p>
            <span className={styles.takeRule} aria-hidden="true" />
            <p className={styles.takeBody}>{domain.body}</p>
            <p className={styles.takeTag}>{domain.tag}</p>
            <dl className={styles.takeMeta}>
              <div>
                <dt>{labels.caster}</dt>
                <dd>{domain.caster}</dd>
              </div>
              <div>
                <dt>{labels.grade}</dt>
                <dd>{domain.grade}</dd>
              </div>
              <div>
                <dt>{labels.hit}</dt>
                <dd>{domain.hit}</dd>
              </div>
            </dl>
          </div>

          <div className={styles.takeSeat}>
            {takeoverStills.map((node, i) => (
              <span
                key={domains[i].slug}
                className={styles.seatFrame}
                data-on={i === active ? "" : undefined}
              >
                {node}
              </span>
            ))}
          </div>
        </div>
      </dialog>
    </section>
  );
}
