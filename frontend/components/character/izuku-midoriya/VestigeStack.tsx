"use client";

import { useMemo, useState } from "react";
import { SparkMark, VestigeFigure } from "./MidoriyaGlyphs";
import styles from "./NotebookExperience.module.css";

/**
 * "Vestige'ler" — sayfanın kalbi (brief §Mekanik).
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * One For All'ın sekiz önceki sahibi sekiz düğme. Bir sahibe basıldığında
 * onun silueti PORTRENİN ARKASINA saydam bir katman olarak biniyor ve
 * yanındaki "devralınan" listesi büyüyor. Katmanlar KÜMÜLATİF: ikinci
 * seçim birinciyi kaldırmıyor, üstüne biniyor. Sekizi de seçilince tam
 * sıra görünüyor.
 *
 * Katmanlar EKLENİYOR ve geri de alınabiliyor — Orochimaru'nun "geriye
 * SOYULAN deri katmanları" mekaniğinin tam tersi (brief §Yasak): orada
 * kaldırdığın katman bir alttakini AÇIYOR, burada kaldırdığın katman
 * yalnızca kendi izini götürüyor, sıra bozulmuyor. Jiraiya'nın "çevrilen
 * sayfası" da yok: hiçbir şey yer değiştirmiyor, yalnızca üst üste biniyor.
 *
 * ── NEDEN SAYI DEĞİL ASİMETRİ ────────────────────────────────────────────
 * Sekiz katmanın yalnızca BEŞİ bir quirk adı getiriyor: üçüncü sahibin
 * quirk'i seride hiç adlandırılmadı, birinci ve sekizinci sahip ise
 * devralınacak ikinci bir quirk taşımıyor. Okuma satırı bu yüzden iki ayrı
 * sayaç gösteriyor (katman ve ad) — mekanik "daha çok bas daha çok kazan"
 * değil, "kaydın neresi dolu neresi boş".
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Sekiz düğme gerçek `<button>`, `aria-pressed` taşıyor, sekmeyle
 * geziliyor. Sahne tamamen dekoratif (`aria-hidden` siluetler): bütün
 * bilgi metinde — devralınan listesi, iki sayaç ve `role="status"` satırı.
 */
export interface VestigeView {
  key: string;
  ordinal: string;
  order: number;
  name: string;
  quirkName: string | null;
  quirkKanji: string | null;
  /**
   * `quirkName` boşken yazılacak metin. Sunucuda seçiliyor, çünkü iki ayrı
   * sebep var ve ikisi aynı şey değil: üçüncü sahibin quirk'i KAYITTA
   * ADSIZ, birinci ve sekizinci sahipte ise devralınacak ikinci bir quirk
   * HİÇ YOK. Adaya düz dize iniyor (FAZ 2 §1).
   */
  quirkFallback: string;
  role: string;
  note: string;
  silhouette: number;
}

export function VestigeStack({
  vestiges,
  portrait,
  scene,
  slot,
  stageLabel,
  listLabel,
  layersLabel,
  namedLabel,
  inheritedTitle,
  emptyInherited,
  selectAll,
  clear,
  statusSuffix,
  fullLine,
  keyboardHint,
  note,
}: {
  vestiges: VestigeView[];
  /** Sunucuda çizilmiş portre — sahnenin ÖNÜNDE duruyor */
  portrait: React.ReactNode;
  /** `mid:vestige` yuvasındaki sahne; yoksa arka plan yalnızca siluetler */
  scene: React.ReactNode;
  /** Sahnenin HEMEN ALTINDAKİ küratör yuvası (sunucudan geliyor) */
  slot: React.ReactNode;
  stageLabel: string;
  listLabel: string;
  layersLabel: string;
  namedLabel: string;
  inheritedTitle: string;
  emptyInherited: string;
  selectAll: string;
  clear: string;
  statusSuffix: string;
  fullLine: string;
  keyboardHint: string;
  note: string;
}) {
  const [picked, setPicked] = useState<string[]>([]);

  const namedTotal = useMemo(
    () => vestiges.filter((item) => item.quirkName !== null).length,
    [vestiges],
  );

  /* Sıra HER ZAMAN kronolojik: seçim sırası değil, sahiplik sırası.
     Kullanıcı yedinciyi önce seçse bile liste 一代目'den başlıyor —
     katmanlar bir yığın değil bir KAYIT. */
  const chosen = useMemo(
    () => vestiges.filter((item) => picked.includes(item.key)),
    [vestiges, picked],
  );
  const namedChosen = chosen.filter((item) => item.quirkName !== null);
  const full = picked.length === vestiges.length;

  const toggle = (key: string) =>
    setPicked((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );

  return (
    <div className={styles.vestige} data-full={full ? "true" : "false"}>
      {/* ── Sahne: arkada biriken katmanlar, önde portre ─────────────── */}
      <div className={styles.stage}>
        <div className={styles.stageScene}>{scene}</div>

        <div className={styles.stageLayers} aria-hidden>
          {vestiges.map((item, i) => (
            <span
              key={item.key}
              className={styles.stageLayer}
              data-on={picked.includes(item.key) ? "true" : "false"}
              /* Her siluet sahnede biraz farklı yerde ve biraz farklı
                 ölçekte duruyor; `--mid-i` sırayı CSS'e taşıyor. */
              style={{ "--mid-i": i } as React.CSSProperties}
            >
              <VestigeFigure
                index={item.silhouette}
                className={styles.stageFigure}
                headClassName={styles.figureHead}
                bodyClassName={styles.figureBody}
              />
            </span>
          ))}
        </div>

        <div className={styles.stagePortrait}>{portrait}</div>

        <SparkMark
          className={styles.stageSpark}
          strokeClassName={styles.sparkStroke}
        />
        <p className={styles.stageCaption}>{stageLabel}</p>
      </div>

      {/* Yuva sahnenin HEMEN ALTINDA (kullanıcı şartı) */}
      {slot}

      {/* ── Okuma satırı ─────────────────────────────────────────────── */}
      <dl className={styles.readout}>
        <div className={styles.readItem}>
          <dt>{layersLabel}</dt>
          <dd>
            {picked.length} / {vestiges.length}
          </dd>
        </div>
        <div className={styles.readItem}>
          <dt>{namedLabel}</dt>
          <dd>
            {namedChosen.length} / {namedTotal}
          </dd>
        </div>
      </dl>

      <p className={styles.readStatus} role="status">
        {`${picked.length} ${statusSuffix}`}
        {full ? ` — ${fullLine}` : ""}
      </p>

      <div className={styles.vestigeBody}>
        {/* ── Devralınan: seçtikçe büyüyen liste ────────────────────── */}
        <div className={styles.inherited}>
          <h3 className={styles.inheritedTitle}>{inheritedTitle}</h3>
          {chosen.length === 0 ? (
            <p className={styles.inheritedEmpty}>{emptyInherited}</p>
          ) : (
            <ol className={styles.inheritedList}>
              {chosen.map((item) => (
                <li key={item.key} className={styles.inheritedRow}>
                  <span className={styles.inheritedOrdinal} lang="ja">
                    {item.ordinal}
                  </span>
                  <span className={styles.inheritedName}>{item.name}</span>
                  <span
                    className={styles.inheritedQuirk}
                    data-named={item.quirkName ? "true" : "false"}
                  >
                    {item.quirkName ? (
                      <>
                        {item.quirkName}
                        {item.quirkKanji ? (
                          <span className={styles.inheritedKanji} lang="ja">
                            {item.quirkKanji}
                          </span>
                        ) : null}
                      </>
                    ) : (
                      item.quirkFallback
                    )}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* ── Sekiz sahip ───────────────────────────────────────────── */}
        <ul className={styles.holders} aria-label={listLabel}>
          {vestiges.map((item) => {
            const on = picked.includes(item.key);
            return (
              <li key={item.key} className={styles.holder}>
                <button
                  type="button"
                  className={styles.holderButton}
                  aria-pressed={on}
                  data-on={on ? "true" : "false"}
                  onClick={() => toggle(item.key)}
                >
                  <span className={styles.holderOrdinal} lang="ja">
                    {item.ordinal}
                  </span>
                  <span className={styles.holderText}>
                    <span className={styles.holderName}>{item.name}</span>
                    <span className={styles.holderRole}>{item.role}</span>
                  </span>
                  <span className={styles.holderQuirk}>
                    {item.quirkName ?? "—"}
                  </span>
                </button>
                <p className={styles.holderNote}>{item.note}</p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Kumanda ──────────────────────────────────────────────────── */}
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.controlPrimary}
          onClick={() => setPicked(vestiges.map((item) => item.key))}
          disabled={full}
        >
          {selectAll}
        </button>
        <button
          type="button"
          className={styles.controlGhost}
          onClick={() => setPicked([])}
          disabled={picked.length === 0}
        >
          {clear}
        </button>
      </div>

      <p className={styles.vestigeNote}>{note}</p>
      <p className={styles.vestigeHint}>{keyboardHint}</p>
    </div>
  );
}
