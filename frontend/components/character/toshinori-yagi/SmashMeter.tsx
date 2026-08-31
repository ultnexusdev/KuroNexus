"use client";

import { SmashGauge } from "./AllMightGlyphs";
import { useMight } from "./PlusUltraShell";
import styles from "./PlusUltraExperience.module.css";

/**
 * "Kalan süre" — sayfanın kalbi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Günün bütçesi 180 dakika. Beş kalem var, her biri bir kez harcanabiliyor
 * ve sıra SERBEST. Harcandıkça sayaç düşüyor, `data-drain` bir kademe
 * ilerliyor ve sayfa kendiliğinden gerçek forma doğru çekiliyor. Sıfıra
 * inince altın form KİLİTLENİYOR — geri alma yok (sayfa yenilenene dek).
 *
 * Kalan süre bir kalemin maliyetinden azsa kalem yine de harcanabiliyor;
 * sayaç sıfıra iniyor ve satır "sınır aşıldı" işareti alıyor. Bütün
 * mekaniğin cümlesi bu: bu adamın sözlüğünde "yetmiyor" yok.
 *
 * ── NEDEN İCHIGO'NUN KADEME SEÇİCİSİ DEĞİL ───────────────────────────────
 * Brief'in yasağı açık: Ichigo'da beş kademeli bir kimlik SEÇİCİ var —
 * ileri gidip geri gelebiliyorsun ve her kademe bir DURUM. Burada kademe
 * yok; tek yönlü, geri alınamayan ve TÜKENEN bir kaynak var. İki mekaniğin
 * ortak yanı yalnızca "beş" sayısı.
 *
 * ── DURUM NEREDE ─────────────────────────────────────────────────────────
 * Durum bu adada değil `PlusUltraShell`'de: mod düğmesi de aynı sayacı
 * okuyor (süre bitince kilitleniyor) ve iki ayrı kopya tutmak durumu ikiye
 * bölerdi. Buradaki bileşen context'ten okuyor.
 */
export function SmashMeter({
  items,
  budgetLabel,
  remainingLabel,
  unit,
  costLabel,
  spendLabel,
  spentLabel,
  overLabel,
  ledgerTitle,
  ledgerEmpty,
  ledgerNote,
  keyboardHint,
  emptyTitle,
  emptyText,
  statusPrefix,
  gaugeLabel,
  closingNote,
}: {
  items: {
    key: string;
    cost: number;
    native: string;
    title: string;
    text: string;
    after: string;
  }[];
  budgetLabel: string;
  remainingLabel: string;
  unit: string;
  costLabel: string;
  spendLabel: string;
  spentLabel: string;
  overLabel: string;
  ledgerTitle: string;
  ledgerEmpty: string;
  ledgerNote: string;
  keyboardHint: string;
  emptyTitle: string;
  emptyText: string;
  statusPrefix: string;
  gaugeLabel: string;
  closingNote: string;
}) {
  const might = useMight();

  /* Sağlayıcı yoksa harcama yapamayan bir düğme dizisi kalırdı; bölüm
     başlığı sunucuda çizildiği için boşluk görünür oluyor ve sessizce
     "çalışıyormuş gibi" duran bir arayüz doğmuyor. */
  if (!might) return null;

  const { total, remaining, ledger, exhausted, spend } = might;
  const spentKeys = new Map(ledger.map((row) => [row.key, row.over]));
  const lit = Math.max(0, Math.min(24, Math.round((remaining / total) * 24)));

  return (
    <div className={styles.meter}>
      {/* ── Sayaç başlığı: dev rakam + ışın göstergesi ── */}
      <div className={styles.meterHead}>
        <p className={styles.meterBudget}>
          {budgetLabel}
          <span className={styles.meterBudgetValue}>
            {total} {unit}
          </span>
        </p>

        <p className={styles.meterBig}>
          <span className={styles.meterBigLabel}>{remainingLabel}</span>
          <span className={styles.meterBigValue}>{remaining}</span>
          <span className={styles.meterBigUnit}>{unit}</span>
        </p>

        <SmashGauge lit={lit} className={styles.meterGauge} />
        <p className={styles.meterGaugeLabel}>{gaugeLabel}</p>
      </div>

      {/* ── Beş kalem ── */}
      <ul className={styles.spends}>
        {items.map((item) => {
          const used = spentKeys.has(item.key);
          const over = spentKeys.get(item.key) === true;
          return (
            <li
              key={item.key}
              className={styles.spend}
              data-used={used ? "true" : "false"}
              data-over={over ? "true" : "false"}
            >
              <div className={styles.spendHead}>
                <p className={styles.spendNative} lang="ja" aria-hidden>
                  {item.native}
                </p>
                <h3 className={styles.spendTitle}>{item.title}</h3>
                <p className={styles.spendCost}>
                  <span className={styles.spendCostLabel}>{costLabel}</span>
                  <span className={styles.spendCostValue}>
                    −{item.cost} {unit}
                  </span>
                </p>
              </div>

              <p className={styles.spendText}>{item.text}</p>

              {used ? (
                <p className={styles.spendAfter}>{item.after}</p>
              ) : null}

              <button
                type="button"
                className={styles.spendButton}
                disabled={used}
                onClick={() => spend(item.key, item.cost)}
              >
                <span className={styles.spendButtonRing} aria-hidden />
                <span className={styles.spendButtonText}>
                  {used ? (over ? overLabel : spentLabel) : spendLabel}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* ── Defter ── */}
      <div className={styles.ledger}>
        <h3 className={styles.ledgerTitle}>{ledgerTitle}</h3>
        {ledger.length === 0 ? (
          <p className={styles.ledgerEmpty}>{ledgerEmpty}</p>
        ) : (
          <ol className={styles.ledgerList}>
            {ledger.map((row, index) => {
              const item = items.find((entry) => entry.key === row.key);
              if (!item) return null;
              return (
                <li key={row.key} className={styles.ledgerRow}>
                  <span className={styles.ledgerIndex}>{index + 1}</span>
                  <span className={styles.ledgerName}>{item.title}</span>
                  <span className={styles.ledgerCost}>
                    −{item.cost} {unit}
                  </span>
                  {row.over ? (
                    <span className={styles.ledgerOver}>{overLabel}</span>
                  ) : null}
                </li>
              );
            })}
          </ol>
        )}
        <p className={styles.ledgerNote}>{ledgerNote}</p>
      </div>

      {/* Durum satırı: sayacın değeri renkle değil YAZIYLA da veriliyor */}
      <p className={styles.meterStatus} role="status">
        {statusPrefix}: {remaining} {unit}
      </p>

      {exhausted ? (
        <div className={styles.meterEmpty}>
          <p className={styles.meterEmptyTitle}>{emptyTitle}</p>
          <p className={styles.meterEmptyText}>{emptyText}</p>
        </div>
      ) : null}

      <p className={styles.meterHint}>{keyboardHint}</p>
      <p className={styles.meterNote}>{closingNote}</p>
    </div>
  );
}
