"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { PuppetFigure, PuppetString } from "./KankuroGlyphs";
import styles from "./KankuroExperience.module.css";

/**
 * Kukla sandığı — sayfanın kalbi.
 *
 * Dört kukla sahnede yan yana, her biri yukarıdan inen kendi ipine asılı.
 * Biri seçilince o ipin gerilimi artar (çizgi kalınlaşır, hafifçe titrer) ve
 * kukla EKLEMLERİNDEN AYRILIR: baş yukarı, kalça ve bacaklar aşağı, kollar
 * ve kabuklar yana kayar; aradaki boşluklarda gizli silahlar görünür.
 * Şemadaki numaralı işaretler aşağıdaki listenin sırasıyla birebir aynı.
 *
 * Metin sunucuda seçilmiş düz dize olarak iniyor (BRIEF §5): bu ada
 * `LocalizedText` görmüyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Desen: tek panelli sekme listesi (otomatik etkinleştirme). Her kukla bir
 * sekme, panel tek ve etkin sekmeye bağlı. Gezinme:
 *   ← → : önceki/sonraki kukla      Home/End : ilk/son kukla
 * Roving tabindex: yalnızca etkin sekme tab sırasında.
 *
 * Şemalar sekmenin İÇİNDE dekoratif (`title` verilmiyor): düğmenin adını
 * kendi metni taşıyor. Şemanın anlatımı panelde, görünmez bir satır olarak
 * ve zaten silah listesinin kendisinde duruyor.
 */

export interface PuppetWeaponView {
  name: string;
  note: string;
}

export interface PuppetView {
  key: "karasu" | "kuroari" | "sanshouo" | "sasori";
  kanji: string;
  name: string;
  turkish: string;
  role: string;
  maker: string;
  summary: string;
  figureAlt: string;
  image: string | null;
  weapons: PuppetWeaponView[];
}

export function PuppetChest({
  puppets,
  listLabel,
  roleLabel,
  makerLabel,
  weaponsLabel,
  tautLabel,
  slackLabel,
  keyboardHint,
}: {
  puppets: PuppetView[];
  listLabel: string;
  roleLabel: string;
  makerLabel: string;
  weaponsLabel: string;
  tautLabel: string;
  slackLabel: string;
  keyboardHint: string;
}) {
  const [index, setIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = puppets[index];
  if (!active) {
    return null;
  }

  /* Sekmeler arası geçişte odak da taşınır — klavye kullanıcısı seçtiği
     sekmenin üstünde kalmalı (roving tabindex şartı). */
  const focusTab = (next: number) => {
    const clamped = (next + puppets.length) % puppets.length;
    setIndex(clamped);
    tabRefs.current[clamped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusTab(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusTab(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(puppets.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.chest} data-puppet={active.key}>
      <div
        className={styles.stage}
        role="tablist"
        aria-label={listLabel}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
      >
        {puppets.map((puppet, position) => {
          const selected = position === index;
          return (
            <button
              key={puppet.key}
              type="button"
              role="tab"
              id={`kan-puppet-tab-${puppet.key}`}
              aria-selected={selected}
              aria-controls="kan-puppet-panel"
              tabIndex={selected ? 0 : -1}
              ref={(node) => {
                tabRefs.current[position] = node;
              }}
              className={styles.hanger}
              data-open={selected || undefined}
              onClick={() => setIndex(position)}
            >
              {/* İp: sahnenin üst kenarından kuklanın başına iner. Seçili
                  olanınki gerilir — kalınlaşır ve titrer. */}
              <PuppetString
                className={styles.hangerString}
                strandClassName={styles.strand}
                taut={selected}
              />
              <span className={styles.hangerFigure}>
                <PuppetFigure
                  kind={puppet.key}
                  open={selected}
                  partClassName={styles.part}
                  weaponClassName={styles.weaponMark}
                  markClassName={styles.markRing}
                  markTextClassName={styles.markText}
                  stringClassName={styles.figureString}
                />
              </span>
              <span className={styles.hangerLabel}>
                <span className={styles.hangerKanji} aria-hidden>
                  {puppet.kanji}
                </span>
                <span className={styles.hangerName}>{puppet.name}</span>
                <span className={styles.hangerRole}>{puppet.role}</span>
                <span className={styles.hangerState} aria-hidden>
                  {selected ? tautLabel : slackLabel}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="kan-puppet-panel"
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`kan-puppet-tab-${active.key}`}
        className={styles.dossier}
      >
        {active.image ? (
          <span className={styles.dossierArt} aria-hidden>
            <Image src={active.image} alt="" fill sizes="720px" />
          </span>
        ) : null}

        {/* Şemanın sözle karşılığı: görsel diyagram dekoratif kaldığı için
            açıklaması buraya, görünmez bir satır olarak iniyor. */}
        <p className={styles.visuallyHidden}>{active.figureAlt}</p>

        <div className={styles.dossierHead}>
          <span className={styles.dossierKanji} aria-hidden>
            {active.kanji}
          </span>
          <div className={styles.dossierTitles}>
            <h3 className={styles.dossierName}>{active.name}</h3>
            <p className={styles.dossierTurkish}>{active.turkish}</p>
          </div>
        </div>

        <dl className={styles.dossierMeta}>
          <div>
            <dt>{roleLabel}</dt>
            <dd>{active.role}</dd>
          </div>
          <div>
            <dt>{makerLabel}</dt>
            <dd>{active.maker}</dd>
          </div>
        </dl>

        <p className={styles.dossierSummary}>{active.summary}</p>

        <p className={styles.dossierLabel}>{weaponsLabel}</p>
        <ol className={styles.weaponList}>
          {active.weapons.map((weapon, position) => (
            <li key={weapon.name} className={styles.weapon}>
              <span className={styles.weaponNo} aria-hidden>
                {position + 1}
              </span>
              <span className={styles.weaponBody}>
                <span className={styles.weaponName}>{weapon.name}</span>
                <span className={styles.weaponNote}>{weapon.note}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <p className={styles.chestHint}>{keyboardHint}</p>
    </div>
  );
}
