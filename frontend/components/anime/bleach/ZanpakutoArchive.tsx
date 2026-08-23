"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ZANPAKUTO, type ZanpakutoRecord } from "@/lib/anime/bleach/zanpakuto";
import { BladeSilhouette } from "./BladeSilhouette";
import { InnerWorldScene } from "./InnerWorldScene";
import styles from "./ZanpakutoArchive.module.css";
import world from "./world.module.css";

export interface ZanpakutoLabels {
  eyebrow: string;
  title: string;
  lede: string;
  command: string;
  noCommand: string;
  unnamed: string;
  stages: Record<string, string>;
  enterInner: string;
  back: string;
  innerAria: string;
  stripAria: string;
}

/**
 * P04 · ZANPAKUTŌ ARŞİVİ.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Naruto Evreni'nde bunun karşılığı bir teknik listesi. Burada tez farklı:
 * **Zanpakutō bir silah değil, yaşayan bir ruhtur.** O yüzden bu bir
 * katalog değil, bir CANLILAR kataloğu — her kılıcın bir dönüşüm hattı,
 * altısının kendi iç dünyası var.
 *
 * ── İKİ KATMAN ───────────────────────────────────────────────────────────
 * 1. DÖNÜŞÜM ŞERİDİ — mühürlü → shikai → bankai → gerçek. Durak
 *    değiştikçe silüet MORPH ediyor, ad/komut/not değişiyor.
 * 2. İÇ DÜNYA — şeridin sonundaki düğme kart açmıyor; **sayfa ruh
 *    dünyasına giriyor.** Tam ekran, o kılıcın kendi paleti, iki üç cümle
 *    ve tek bir çıkış. Başka hiçbir şey: boşluk = güç.
 *
 * ── AŞAMA SEÇİMİ NEDEN `radiogroup` ──────────────────────────────────────
 * "Hangi aşamadayım" bir seçim, bir gezinme değil. Radyo grubu semantiği
 * ekran okuyucuya bunu doğru söylüyor ve ok tuşları (brief'in şartı) o
 * modelin doğal davranışı. Bir kaydırıcı (`input[type=range]`) da klavye
 * verirdi ama aşamaların ADI olduğu için ayrık seçim daha doğru.
 */
export function ZanpakutoArchive({
  locale,
  labels,
}: {
  locale: string;
  labels: ZanpakutoLabels;
}) {
  const [inner, setInner] = useState<ZanpakutoRecord | null>(null);
  /** İç dünyayı açan düğme — kapanışta odak buraya dönüyor */
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const closeInner = useCallback(() => {
    setInner(null);
    triggerRef.current?.focus();
  }, []);

  return (
    <section
      id="zanpakuto"
      data-layer="soul-society"
      className={`${styles.section} ${world.deferPaint}`}
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={world.eyebrow} lang="en">
            {labels.eyebrow}
          </p>
          <h2 className={world.section}>{labels.title}</h2>
          <p className={`${world.body} ${styles.lede}`}>{labels.lede}</p>
        </header>

        <ul className={styles.strips} aria-label={labels.stripAria}>
          {ZANPAKUTO.map((record) => (
            <ZanpakutoStrip
              key={record.id}
              record={record}
              locale={locale}
              labels={labels}
              onEnterInner={(button) => {
                triggerRef.current = button;
                setInner(record);
              }}
            />
          ))}
        </ul>
      </div>

      {inner ? (
        <InnerWorld
          record={inner}
          locale={locale}
          labels={labels}
          onClose={closeInner}
        />
      ) : null}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   KATMAN 1 · DÖNÜŞÜM ŞERİDİ
   ══════════════════════════════════════════════════════════════════ */

function ZanpakutoStrip({
  record,
  locale,
  labels,
  onEnterInner,
}: {
  record: ZanpakutoRecord;
  locale: string;
  labels: ZanpakutoLabels;
  onEnterInner: (button: HTMLButtonElement) => void;
}) {
  const [index, setIndex] = useState(0);
  const stopsRef = useRef<HTMLDivElement | null>(null);
  const stage = record.stages[index];
  const pick = (value: { tr: string; en?: string }) =>
    locale === "en" ? (value.en ?? value.tr) : value.tr;

  /** Ok tuşlarıyla duraklar arasında gezinme — brief'in şartı */
  const move = (delta: number) => {
    const next = Math.min(
      record.stages.length - 1,
      Math.max(0, index + delta),
    );
    setIndex(next);
    const buttons = stopsRef.current?.querySelectorAll("button");
    (buttons?.[next] as HTMLButtonElement | undefined)?.focus();
  };

  return (
    <li className={styles.strip}>
      {/* Silüet: durak değiştikçe morph ediyor */}
      <span className={styles.art}>
        <BladeSilhouette form={stage.form} />
      </span>

      <div className={styles.body}>
        <p className={styles.owner}>
          <span className={styles.name} lang="ja">
            {record.kanji}
          </span>
          <span className={`${world.meta} ${styles.romaji}`}>{record.name}</span>
          <span className={styles.ownerName}>{record.owner}</span>
        </p>

        {/* Duraklar: mühürlü → shikai → bankai → gerçek */}
        <div
          ref={stopsRef}
          className={styles.stops}
          role="radiogroup"
          aria-label={record.name}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
              event.preventDefault();
              move(1);
            } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
              event.preventDefault();
              move(-1);
            }
          }}
        >
          {record.stages.map((item, i) => (
            <button
              key={item.kind + i}
              type="button"
              role="radio"
              aria-checked={i === index}
              tabIndex={i === index ? 0 : -1}
              className={styles.stop}
              data-on={i === index ? "" : undefined}
              onClick={() => setIndex(i)}
              onFocus={() => setIndex(i)}
            >
              <span className={styles.stopDot} aria-hidden="true" />
              <span className={styles.stopLabel}>{labels.stages[item.kind]}</span>
            </button>
          ))}
        </div>

        {/* Aşamanın kimliği: ad + kanji. Canon'da adı yoksa "kayıt yok". */}
        <p className={styles.stageName}>
          {stage.name ? (
            <>
              <span lang="ja" className={styles.stageKanji}>
                {stage.kanji}
              </span>
              <span>{stage.name}</span>
            </>
          ) : (
            <span className={styles.unnamed}>{labels.unnamed}</span>
          )}
        </p>

        {/* ── SERBEST BIRAKMA KOMUTU ──────────────────────────────
            ⚠️ HER ZAMAN GÖRÜNÜR, yalnızca shikai durağında değil.

            İlk sürüm brief'i harfiyen uygulayıp komutu shikai durağına
            saklıyordu. Ölçüldü ve geri alındı: varsayılan durak "mühürlü"
            olduğu için sunucu çıktısında ON komutun HİÇBİRİ görünmüyordu.
            Yani bölümün en ikonik canon verisi ("Chire, Senbonzakura")
            JS gelmeden hiç okunmuyor ve JS gelse bile her şerit için ayrı
            tıklama istiyordu.

            Komut kılıcın kendisine ait, bir aşamaya değil. Şimdi hep
            duruyor; shikai durağı seçiliyken VURGULANIYOR — brief'in
            "geçişte belirir" niyeti korunuyor, bilgi saklanmıyor. */}
        <p className={styles.command} data-active={stage.kind === "shikai" ? "" : undefined}>
          <span className={world.meta}>{labels.command}</span>
          {record.command ? (
            <>
              <span className={styles.commandKanji} lang="ja">
                「{record.command.kanji}」
              </span>
              <span className={styles.commandRomaji}>
                {record.command.romaji}
              </span>
            </>
          ) : (
            <span className={styles.unnamed}>{labels.noCommand}</span>
          )}
        </p>

        <p className={`${world.body} ${styles.note}`}>{pick(stage.note)}</p>

        {record.innerWorld ? (
          <button
            type="button"
            className={styles.enterInner}
            onClick={(event) => onEnterInner(event.currentTarget)}
          >
            <span lang="ja">内なる世界</span>
            <span className={world.meta}>{labels.enterInner}</span>
          </button>
        ) : null}
      </div>
    </li>
  );
}

/* ══════════════════════════════════════════════════════════════════
   KATMAN 2 · İÇ DÜNYA — imza etkileşim
   ══════════════════════════════════════════════════════════════════ */

/**
 * Kart açılmıyor: SAYFA RUH DÜNYASINA GİRİYOR.
 *
 * Tam ekran, o Zanpakutō'nun kendi paleti, ruhun adı, iki üç cümle ve tek
 * bir çıkış. Başka hiçbir şey — brief: "Boşluk = güç."
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * `aria-modal="true"` ile açılıyor: ekran okuyucu arkadaki içeriği
 * kendiliğinden dışarıda bırakıyor. Brief "arkadaki içerik aria-hidden"
 * diyor; `aria-modal` bunun modern ve daha güvenli karşılığı — elle
 * `aria-hidden` yazmak, kapanışta temizlenmezse sayfayı kalıcı olarak
 * okunamaz bırakır.
 *
 * Escape kapatıyor, odak açan düğmeye dönüyor, gövde kaydırması
 * kilitleniyor.
 */
function InnerWorld({
  record,
  locale,
  labels,
  onClose,
}: {
  record: ZanpakutoRecord;
  locale: string;
  labels: ZanpakutoLabels;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const inner = record.innerWorld;
  const pick = (value: { tr: string; en?: string }) =>
    locale === "en" ? (value.en ?? value.tr) : value.tr;

  /* Gövde kaydırması kilitleniyor; kapanışta ESKİ değer geri veriliyor
     (boş dizeye sıfırlamak, sayfanın kendi ayarını ezerdi). */
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!inner) return null;

  return (
    <div
      className={styles.innerWorld}
      role="dialog"
      aria-modal="true"
      aria-label={labels.innerAria}
      style={
        {
          "--iw-ink": inner.palette.ink,
          "--iw-accent": inner.palette.accent,
          "--iw-paper": inner.palette.paper,
        } as React.CSSProperties
      }
    >
      <InnerWorldScene scene={inner.scene} />

      <div className={styles.innerBody}>
        <p className={`${world.eyebrow} ${styles.innerEyebrow}`} lang="ja">
          内なる世界
        </p>
        <h3 className={styles.innerTitle}>{pick(inner.title)}</h3>
        {inner.spirit ? (
          <p className={styles.innerSpirit}>{inner.spirit}</p>
        ) : null}
        <p className={styles.innerText}>{pick(inner.description)}</p>

        <button
          ref={closeRef}
          type="button"
          className={styles.back}
          onClick={onClose}
        >
          {labels.back}
        </button>
      </div>
    </div>
  );
}
