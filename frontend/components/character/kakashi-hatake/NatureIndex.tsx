"use client";

import { useCallback, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import type { FicheKind, NatureKey } from "@/lib/characters/kakashi-hatake-experience";
import { CopyStamp, NatureSeal } from "./LedgerMarks";
import styles from "./KakashiExperience.module.css";

/**
 * DOĞA TÜRÜ KARTOTEKSİ — sayfanın kalbi.
 *
 * Beş çekmece, beş sekme. Sekme seçilince çekmece açılır ve fişler
 * yeniden dizilir: fişin adı, kimden kopyalandığı ve tek cümlelik not.
 *
 * ── NEDEN role="tab" YOK ─────────────────────────────────────────────
 * Yönerge sade `button` + `aria-pressed` istiyor ve bu doğru karar:
 * gerçek bir tablist sözleşmesi tek sekmeyi odakta tutup diğerlerini
 * `tabindex="-1"` yapmayı ZORUNLU kılar. Burada beş düğmenin beşi de
 * Tab ile gezilebilir kalıyor — klavye kullanıcısı çekmeceleri hem
 * Tab'la hem ok tuşlarıyla dolaşabiliyor. `aria-controls` ile çekmeceye
 * bağlılar, yani ekran okuyucu ilişkiden haberdar.
 *
 * ── METİNLER ─────────────────────────────────────────────────────────
 * Hepsi sunucuda `pick` edilip düz dize olarak iniyor (BRIEF kural 5):
 * bu adaya `LocalizedText` geçmiyor.
 *
 * ── FİŞLERİN YENİDEN DİZİLMESİ ───────────────────────────────────────
 * Liste `key={active}` taşıyor: çekmece değişince React düğümleri
 * söküp yeniden takıyor, böylece CSS'teki giriş animasyonu (kademeli
 * `--i` gecikmesiyle) her açılışta baştan koşuyor. Durum sayaçlarıyla
 * animasyon tetiklemeye gerek kalmıyor.
 */

export interface FicheView {
  code: string;
  name: string;
  kanji: string;
  kind: FicheKind;
  source: string;
  note: string;
}

export interface DrawerView {
  key: NatureKey;
  kanji: string;
  name: string;
  label: string;
  lede: string;
  /** Boş fiş hariç gerçek kayıt sayısı — sekmenin altındaki rakam */
  filed: number;
  fiches: FicheView[];
}

export interface IndexLabels {
  rail: string;
  source: string;
  copied: string;
  blank: string;
  count: string;
  hint: string;
}

const DRAWER_ID = "kakashi-kartoteks-cekmece";

export function NatureIndex({
  drawers,
  labels,
}: {
  drawers: DrawerView[];
  labels: IndexLabels;
}) {
  const [active, setActive] = useState<NatureKey>(drawers[0].key);
  const tabRefs = useRef(new Map<NatureKey, HTMLButtonElement | null>());

  const move = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
      if (!keys.includes(event.key)) {
        return;
      }
      const current = drawers.findIndex((drawer) => drawer.key === active);
      let next = current;
      if (event.key === "ArrowRight") {
        next = (current + 1) % drawers.length;
      } else if (event.key === "ArrowLeft") {
        next = (current - 1 + drawers.length) % drawers.length;
      } else if (event.key === "Home") {
        next = 0;
      } else {
        next = drawers.length - 1;
      }
      event.preventDefault();
      const target = drawers[next].key;
      setActive(target);
      tabRefs.current.get(target)?.focus();
    },
    [active, drawers],
  );

  const open = drawers.find((drawer) => drawer.key === active) ?? drawers[0];

  return (
    <div className={styles.cabinet}>
      {/* Tuş dinleyici sarmalayıcıda: olay içerideki gerçek düğmelerden
          kabararak buraya geliyor, sarmalayıcının kendisi odak almıyor. */}
      <div
        className={styles.tabRail}
        onKeyDown={move}
        role="group"
        aria-label={labels.rail}
      >
        {drawers.map((drawer) => {
          const isOpen = drawer.key === active;
          return (
            <button
              key={drawer.key}
              type="button"
              ref={(node) => {
                tabRefs.current.set(drawer.key, node);
              }}
              className={styles.tab}
              data-nature={drawer.key}
              data-open={isOpen || undefined}
              aria-pressed={isOpen}
              aria-controls={DRAWER_ID}
              onClick={() => setActive(drawer.key)}
            >
              <NatureSeal nature={drawer.key} className={styles.tabSeal} />
              <span className={styles.tabKanji} aria-hidden>
                {drawer.kanji}
              </span>
              <span className={styles.tabName}>{drawer.name}</span>
              <span className={styles.tabCount}>
                {drawer.filed} {labels.count}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id={DRAWER_ID}
        className={styles.drawer}
        data-nature={open.key}
      >
        <div className={styles.drawerHead}>
          <h3 className={styles.drawerTitle}>
            {open.name}
            <span className={styles.drawerLabel}> · {open.label}</span>
          </h3>
          <p className={styles.drawerLede}>{open.lede}</p>
          <p className={styles.drawerHint}>{labels.hint}</p>
        </div>

        <ul className={styles.ficheGrid} key={open.key}>
          {open.fiches.map((fiche, i) => (
            <li
              key={fiche.code}
              className={styles.fiche}
              data-kind={fiche.kind}
              style={{ "--i": i } as CSSProperties}
            >
              <span className={styles.ficheCode} aria-hidden>
                {fiche.code}
              </span>

              {fiche.kind === "kayip" ? (
                <p className={styles.ficheBlank}>
                  <span className={styles.ficheBlankLabel}>{labels.blank}</span>
                  {fiche.note}
                </p>
              ) : (
                <>
                  {/* Damga yalnızca iz: okunur karşılığı aşağıdaki
                      "Kopyalandı" etiketinde, kaynağın yanı başında */}
                  {fiche.kind === "kopya" ? (
                    <CopyStamp className={styles.ficheStamp} />
                  ) : null}
                  <span className={styles.ficheKanji} aria-hidden lang="ja">
                    {fiche.kanji}
                  </span>
                  <h4 className={styles.ficheName}>{fiche.name}</h4>
                  <p className={styles.ficheSource}>
                    {fiche.kind === "kopya" ? (
                      <span className={styles.ficheFlag}>{labels.copied}</span>
                    ) : null}
                    <span className={styles.ficheSourceLabel}>
                      {labels.source}
                    </span>
                    {fiche.source}
                  </p>
                  <p className={styles.ficheNote}>{fiche.note}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
