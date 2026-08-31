"use client";

import { useState } from "react";
import styles from "./IdleTransfigurationExperience.module.css";

/**
 * SAYFANIN KALBİ — "Beden değiştirme".
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Beş form var ve TEK bir kart var. Bir form seçildiğinde kart YER
 * DEĞİŞTİRMİYOR, ikinci bir kart açılmıyor, panel takas edilmiyor: aynı DOM
 * düğümü başka bir şeye dönüşüyor. `data-form` niteliği değişiyor, CSS de o
 * niteliğe bakıp kartın `clip-path` köşe kümesini, dört köşesinin ayrı ayrı
 * yarıçapını ve eğimini başka bir değere sürüyor. Çıktı bir gösterge değil,
 * KUTUNUN GEOMETRİSİ.
 *
 * ⚠️ Bu bir "kademe seçici" DEĞİL (Ichigo'nun beş kademeli kimlik seçicisi
 * ve Orochimaru'nun soyulan deri katmanları yayında): formlar sıralı değil,
 * biri diğerini açmıyor, bir merdiven kurmuyorlar. Beşi de her an seçilebilir
 * ve seçim geri alınabilir; anlatılan şey ilerleme değil MORFOLOJİ.
 *
 * ── ERİŞİLEBİLİRLİK SÖZLEŞMESİ ───────────────────────────────────────────
 *  · Seçiciler gerçek `<button>`; `aria-pressed` durumu taşıyor. Ok tuşu
 *    gerektiren bir `tablist` DEĞİL — beş düğme de sekmeyle geziliyor.
 *  · Kartın metni `role="status"` taşıyan bir kapta: form değişince yeni
 *    başlık ekran okuyucuya duyuruluyor.
 *  · Şeklin ne olduğu YAZIYLA da var (`shapeNote`). `prefers-reduced-motion`
 *    açıkken morph animasyonu duruyor ama seçim ve metin aynen çalışıyor —
 *    hiçbir bilgi yalnızca harekete bağlı değil.
 *  · `clip-path` kartın kendisine uygulanıyor ama iç dolgu (`--mht-pad`)
 *    kesme payından çok daha büyük: kırpma metne DEĞMİYOR. Odak halkası da
 *    kartın kendisinde değil düğmelerde, yani kırpılmıyor.
 */

export interface MorphForm {
  key: string;
  index: string;
  glyph: string;
  name: string;
  term: string;
  title: string;
  body: string;
  shapeNote: string;
}

export function FormMorph({
  forms,
  chooserLabel,
  chooserHint,
  cardLabel,
  shapeLabel,
  statusPrefix,
  reducedNote,
}: {
  forms: MorphForm[];
  chooserLabel: string;
  chooserHint: string;
  cardLabel: string;
  shapeLabel: string;
  statusPrefix: string;
  reducedNote: string;
}) {
  const [activeKey, setActiveKey] = useState(forms[0]?.key ?? "");
  const active = forms.find((form) => form.key === activeKey) ?? forms[0];

  if (!active) return null;

  return (
    <div className={styles.morph}>
      {/* ── SEÇİCİ: beş yama düğmesi ────────────────────────────────────
          Düğmelerin kendisi de yama: her birinin köşe yarıçapı ayrı ve
          seçili olan daha da düzensizleşiyor. */}
      <p className={styles.morphChooserLabel} id="mht-forms-chooser">
        {chooserLabel}
      </p>
      <ul
        className={styles.morphChooser}
        aria-labelledby="mht-forms-chooser"
      >
        {forms.map((form) => (
          <li key={form.key} className={styles.morphChoice}>
            <button
              type="button"
              className={styles.morphButton}
              data-form={form.key}
              aria-pressed={form.key === active.key}
              onClick={() => setActiveKey(form.key)}
            >
              <span className={styles.morphButtonIndex} aria-hidden>
                {form.index}
              </span>
              <span className={styles.morphButtonGlyph} lang="ja" aria-hidden>
                {form.glyph}
              </span>
              <span className={styles.morphButtonName}>{form.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className={styles.morphHint}>{chooserHint}</p>

      {/* ── TEK KART ─────────────────────────────────────────────────────
          `data-form` dışında hiçbir şeyi değişmiyor: aynı öğe, aynı yer,
          aynı ağaç konumu. Kartın etrafındaki `.morphStage` kırpılmıyor —
          kırpılan yalnızca `.morphCard`. */}
      <div className={styles.morphStage}>
        <article
          className={styles.morphCard}
          data-form={active.key}
          aria-label={cardLabel}
        >
          <div className={styles.morphBody} role="status">
            <p className={styles.morphTerm}>
              <span className={styles.morphTermIndex} aria-hidden>
                {active.index}
              </span>
              {statusPrefix}
              <span className={styles.morphTermSep} aria-hidden>
                ·
              </span>
              {active.name}
            </p>
            <h3 className={styles.morphTitle}>{active.title}</h3>
            <p className={styles.morphKind}>{active.term}</p>
            <p className={styles.morphText}>{active.body}</p>
            <p className={styles.morphShape}>
              <span className={styles.morphShapeLabel}>{shapeLabel}</span>
              {active.shapeNote}
            </p>
          </div>
        </article>
      </div>

      <p className={styles.morphReduced}>{reducedNote}</p>
    </div>
  );
}
