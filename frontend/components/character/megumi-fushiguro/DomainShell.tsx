"use client";

import { useMemo, useState } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import {
  ShadowPoolStrip,
  ShadowRoster,
  SummonedBand,
  type PoolBeastUI,
  type PoolLabels,
} from "./ShadowPool";
import styles from "./ShadowMenagerieExperience.module.css";

/**
 * Megumi sayfasının kabuğu — istemci adası 1/2.
 *
 * Kompozisyon deseni (Faz 2 §1): bölümler SUNUCUDA çizilip prop olarak
 * geliyor; bu bileşen onları yalnızca doğru sırayla yerleştiriyor ve
 * aralarına havuzdan çıkan şikigami'yi koyuyor.
 *
 * ── NEDEN BÖLÜMLER PROP, `children` DEĞİL ────────────────────────────────
 * Izgara kilidi: "çağrılan şikigami havuzdan çıkıp BÖLÜMLERİN ARASINA
 * yerleşiyor." Tek bir `children` düğümüyle araya girmek mümkün değil;
 * bölümlerin tek tek adlandırılması şart. Altı ara boşluk var ve çağrılan
 * şikigami çağrı sırasına göre onlara dağılıyor (`index % 6`), yani sayfa
 * gerçekten AŞAĞIDAN YUKARI doluyor.
 *
 * ── İKİ DURUM ────────────────────────────────────────────────────────────
 *   `domain`     → "Alan" düğmesi. Kangō An'ei Tei: zemin tamamen gölgeye
 *                  dönüyor, bölüm kenarları kayboluyor, sayfa tek bir
 *                  sürekli karanlık alan oluyor. Kök öğede `data-domain`.
 *   havuz        → `out` (sahadaki şikigami, çağrı sırasıyla) +
 *                  `ritualRead`. Kök öğede `data-mahoraga`.
 *
 * ⚠️ Havuz şeridi `data-domain` KAPALIYKEN de duruyor (Dalga 1 · ders 2:
 * kilitli ızgara varsayılanda da var olmalı). Alan yalnızca şeridin
 * kenarını siliyor, şeridi kaldırmıyor.
 *
 * Kök `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor.
 */

export interface DomainMessages {
  statusStart: string;
  statusCalled: string;
  statusReturned: string;
  statusAllReturned: string;
  statusRefused: string;
  statusUnlocked: string;
  statusRitual: string;
  progressCalled: string;
  progressLeft: string;
}

/** Altı ara boşluk: bölümlerin arasındaki her yer bir yerleşim yeri. */
const BAND_COUNT = 6;

export function DomainShell({
  isAdmin,
  hero,
  mode,
  identity,
  arts,
  kit,
  poolHead,
  poolTail,
  fate,
  bonds,
  closing,
  gaps,
  beasts,
  labels,
  messages,
  total,
  scar,
}: {
  isAdmin: boolean;
  hero: React.ReactNode;
  mode: {
    title: string;
    native: string;
    enter: string;
    exit: string;
    hintOn: string;
    hintOff: string;
    note: string;
  };
  identity: React.ReactNode;
  arts: React.ReactNode;
  kit: React.ReactNode;
  poolHead: React.ReactNode;
  poolTail: React.ReactNode;
  fate: React.ReactNode;
  bonds: React.ReactNode;
  closing: React.ReactNode;
  gaps: React.ReactNode;
  beasts: PoolBeastUI[];
  labels: PoolLabels;
  messages: DomainMessages;
  total: number;
  scar: number;
}) {
  const [domain, setDomain] = useState(false);
  const [out, setOut] = useState<string[]>([]);
  /**
   * En az bir kez çağrılmış olanlar — geri gönderilse bile listede kalıyor.
   *
   * ⚠️ Mahoraga'nın kilidi "sekizi aynı anda sahada" OLAMAZ: bedellerin
   * toplamı (20) kullanılabilir hazneden (18) büyük, yani öyle bir durum
   * hiç doğmuyor. Şart bu yüzden "her biri en az bir kez çağrılmış + havuz
   * tamamen boş" — ikisi ancak geri gönderme kullanılarak sağlanıyor ve
   * mekanik böylece gerçekten paylaşılan bir kaynak havuzu oluyor.
   */
  const [seen, setSeen] = useState<string[]>([]);
  const [ritualRead, setRitualRead] = useState(false);
  const [status, setStatus] = useState(messages.statusStart);

  const byKey = useMemo(
    () => new Map(beasts.map((beast) => [beast.key, beast])),
    [beasts],
  );
  const callableKeys = useMemo(
    () =>
      beasts.filter((beast) => beast.state === "callable").map((b) => b.key),
    [beasts],
  );

  /* Kullanılabilir hazne = toplam − kırılan pay. Kırılan pay geri gelmiyor;
     ölçek onu da çiziyor ama ondan harcanamıyor. */
  const usable = total - scar;
  const spent = out.reduce((sum, key) => sum + (byKey.get(key)?.cost ?? 0), 0);
  const remaining = usable - spent;

  const isUnlocked = (called: string[], left: number) =>
    left === 0 && callableKeys.every((key) => called.includes(key));

  const unlocked = isUnlocked(seen, remaining);

  const lockProgress = `${messages.progressCalled}: ${
    seen.filter((key) => callableKeys.includes(key)).length
  }/${callableKeys.length} · ${remaining} ${messages.progressLeft}`;

  const toggle = (key: string) => {
    if (ritualRead) return;
    const beast = byKey.get(key);
    if (!beast || beast.state !== "callable") return;

    if (out.includes(key)) {
      const next = out.filter((item) => item !== key);
      const left =
        usable - next.reduce((s, k) => s + (byKey.get(k)?.cost ?? 0), 0);
      setOut(next);
      setStatus(`${beast.turkish} ${messages.statusReturned} ${left}.`);
      return;
    }

    if (beast.cost > remaining) {
      setStatus(messages.statusRefused);
      return;
    }

    const next = [...out, key];
    const called = seen.includes(key) ? seen : [...seen, key];
    const left = remaining - beast.cost;
    setOut(next);
    setSeen(called);

    if (isUnlocked(called, left)) {
      setStatus(messages.statusUnlocked);
      return;
    }

    /* Duvara TAM ÇARPTIĞI anda söyle: kalanla hiçbir şey çağrılamıyorsa
       kuralı burada öğreniyor, düğmeleri tek tek deneyerek değil. */
    const stillIn = beasts.filter(
      (item) => item.state === "callable" && !next.includes(item.key),
    );
    const cheapest = stillIn.reduce<number | null>(
      (min, item) => (min === null || item.cost < min ? item.cost : min),
      null,
    );
    const wall = cheapest !== null && cheapest > left;

    setStatus(
      `${beast.turkish} ${messages.statusCalled} ${left}.${
        wall ? ` ${messages.statusRefused}` : ""
      }`,
    );
  };

  const returnAll = () => {
    if (ritualRead || out.length === 0) return;
    setOut([]);
    setStatus(messages.statusAllReturned);
  };

  const readRitual = () => {
    if (ritualRead || !unlocked) return;
    setRitualRead(true);
    setStatus(messages.statusRitual);
  };

  /* Çağrı sırasına göre ara boşluklara dağıtım. */
  const bands: PoolBeastUI[][] = Array.from({ length: BAND_COUNT }, () => []);
  out.forEach((key, index) => {
    const beast = byKey.get(key);
    if (beast) bands[index % BAND_COUNT].push(beast);
  });
  const band = (index: number) => (
    <SummonedBand beasts={bands[index]} label={labels.bandLabel} />
  );

  return (
    <div
      className={styles.page}
      data-world="megumi-fushiguro"
      data-domain={domain ? "true" : "false"}
      data-mahoraga={ritualRead ? "true" : "false"}
    >
      {/* Alanın zemini — tıklamayı engellemiyor (`pointer-events: none`) */}
      <span className={styles.field} aria-hidden />

      <CuratorFrame isAdmin={isAdmin}>
        {hero}

        {/* ══ 2 · MOD DÜĞMESİ — "Alan" ════════════════════════════════════ */}
        <section className={styles.mode} aria-labelledby="meg-mode">
          <div className={styles.rail} aria-hidden>
            <span className={styles.railSeal} lang="ja">
              領域
            </span>
          </div>
          <div className={styles.modeBody}>
            <h2 id="meg-mode" className={styles.sectionTitle}>
              {mode.title}
            </h2>
            <p className={styles.modeNative} lang="ja" aria-hidden>
              {mode.native}
            </p>
            <button
              type="button"
              className={styles.modeButton}
              aria-pressed={domain}
              onClick={() => setDomain((value) => !value)}
            >
              <span className={styles.modeMark} aria-hidden />
              <span className={styles.modeLabel}>
                {domain ? mode.exit : mode.enter}
              </span>
            </button>
            <p className={styles.modeHint} role="status">
              {domain ? mode.hintOn : mode.hintOff}
            </p>
            <p className={styles.modeNote}>{mode.note}</p>
          </div>
        </section>

        {identity}
        {band(0)}

        {arts}
        {band(1)}

        {kit}
        {band(2)}

        {/* ══ 5 · GÖLGE HAVUZU — SAYFANIN KALBİ ═════════════════════════ */}
        <section className={styles.poolSection} aria-labelledby="meg-pool">
          {poolHead}
          <ShadowRoster
            beasts={beasts}
            labels={labels}
            out={out}
            remaining={remaining}
            unlocked={unlocked}
            ritualRead={ritualRead}
            lockProgress={lockProgress}
            onToggle={toggle}
            onRitual={readRitual}
          />
          {poolTail}
        </section>
        {band(3)}

        {fate}
        {band(4)}

        {bonds}
        {band(5)}

        {closing}
        {gaps}

        {/* Alt kenarda sabit duran şerit — `data-domain` kapalıyken de var */}
        <ShadowPoolStrip
          labels={labels}
          total={total}
          scar={scar}
          usable={usable}
          remaining={remaining}
          out={out}
          beasts={beasts}
          ritualRead={ritualRead}
          status={status}
          onReturn={toggle}
          onReturnAll={returnAll}
        />
      </CuratorFrame>
    </div>
  );
}
