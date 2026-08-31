"use client";

import { useMemo, useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import type { GetoVoicePair } from "@/lib/characters/suguru-getou-experience";
import styles from "./ReliquaryExperience.module.css";

/**
 * İHANET ÇİZELGESİ — sayfanın kalbi, ve aynı zamanda kader çizelgesi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Beş durak, her durakta bir yol ayrımı: KAL ya da GİT. Seçilen dal yolu
 * sürdürüyor, seçilmeyen dal yanda SOLUK ama OKUNUR kalıyor. Beş durak da
 * seçildiğinde, üç ve üzeri "git" seçimi kopuş sonucunu, aksi hâlde
 * öğretmen sonucunu açıyor.
 *
 * ⚠️ İki sonuç da yazılı ve ikisi de sayfada duruyor. Bu bir "doğru cevap"
 * oyunu değil: Getō'nun trajedisi ikisinin de gerçekten önünde olmasıydı.
 * Bu yüzden `otherShown` düğmesi var — kullanıcı seçimlerini bozmadan öbür
 * sonucu da okuyabiliyor — ve `canon` satırı hangi dalın KAYITTA olduğunu
 * açıkça söylüyor, yani karşı-olgusal olan tarih diye sunulmuyor.
 *
 * ── NEDEN "KOLEKSİYON" DEĞİL "KARAR" ─────────────────────────────────────
 * Yasak listesi: eski Getō'nun tek yönlü haznesi (al-biriktir-boşalt) ve
 * Yūta'nın kopyalanan teknik destesi. İkisi de BİRİKTİRME mekaniği. Burada
 * biriken hiçbir şey yok: beş bağımsız ikili karar var, hepsi geri
 * alınabiliyor ve toplam bir sayı değil bir YOL üretiyor.
 *
 * ── İKİ SES ──────────────────────────────────────────────────────────────
 * Adaya `GetoVoicePair` iniyor: dil çoktan seçilmiş, geriye iki düz dize
 * kalıyor (`plain` / `monkey`). Hangisinin görüneceğine kökteki
 * `data-monkey` karar veriyor — ada modun ne olduğunu BİLMİYOR, bilmesine
 * gerek de yok. Durum satırı bilerek tek sesli: canlı bölge iki versiyonu
 * arka arkaya okumamalı.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * · İki dal da gerçek `<button>`, `aria-pressed` ile durumlu
 * · Her ayrım `role="group"` + `aria-label` (hangi durağın ayrımı olduğu)
 * · Tek `role="status"` satırı: son eylem + ilerleme + sonucun adı
 * · Hedefler `var(--touch-min)` üstünde, odak halkası CSS'te
 */

export interface PathStepView {
  key: string;
  index: string;
  age: string;
  when: string;
  title: string;
  text: GetoVoicePair;
  original?: {
    kindLabel: string;
    isQuote: boolean;
    text: string;
    reading: string;
    note: string;
  };
  kin?: { name: string; role: string; href: string | null };
  stayLabel: string;
  leaveLabel: string;
  stayLine: GetoVoicePair;
  leaveLine: GetoVoicePair;
}

export interface PathOutcomeView {
  key: "stayed" | "left";
  kanji: string;
  title: string;
  text: GetoVoicePair;
  canon: string;
}

type Branch = "stay" | "leave";

/** İki versiyonu da çizen küçük yardımcı — görünürlüğe CSS karar veriyor. */
function Voice({ pair, tone }: { pair: GetoVoicePair; tone?: string }) {
  const plain = tone ? `${styles.voicePlain} ${tone}` : styles.voicePlain;
  const monkey = tone ? `${styles.voiceMonkey} ${tone}` : styles.voiceMonkey;
  return (
    <>
      <span className={plain}>{pair.plain}</span>
      <span className={monkey}>{pair.monkey}</span>
    </>
  );
}

export function BetrayalPath({
  steps,
  frames,
  outcomes,
  threshold,
  labels,
}: {
  steps: PathStepView[];
  /** Her durağın kadrajı + kendi küratör yuvası — SUNUCUDA çizilip geliyor */
  frames: React.ReactNode[];
  outcomes: PathOutcomeView[];
  threshold: number;
  labels: {
    stepLabel: string;
    forkLabel: string;
    chosenBadge: string;
    ghostBadge: string;
    pendingBadge: string;
    progressLabel: string;
    outcomeTitle: string;
    otherOutcome: string;
    ownOutcome: string;
    reset: string;
    idle: string;
    partial: string;
    ready: string;
    announceStay: string;
    announceLeave: string;
    announceReset: string;
    keyboardHint: string;
  };
}) {
  const [choices, setChoices] = useState<Record<string, Branch>>({});
  const [otherShown, setOtherShown] = useState(false);
  const [lastAction, setLastAction] = useState("");

  const chosenCount = Object.keys(choices).length;
  const leaveCount = Object.values(choices).filter((c) => c === "leave").length;
  const complete = chosenCount === steps.length;

  /** Kullanıcının kendi yolu; tamamlanmadan sonuç okunmuyor. */
  const ownOutcome = useMemo(
    () => (leaveCount >= threshold ? "left" : "stayed"),
    [leaveCount, threshold],
  );
  const shownKey = otherShown
    ? ownOutcome === "left"
      ? "stayed"
      : "left"
    : ownOutcome;
  const shown = outcomes.find((o) => o.key === shownKey) ?? outcomes[0];

  const progress = complete
    ? labels.ready
    : chosenCount === 0
      ? labels.idle
      : labels.partial;

  const choose = (stepKey: string, branch: Branch) => {
    setChoices((prev) => ({ ...prev, [stepKey]: branch }));
    setLastAction(
      branch === "stay" ? labels.announceStay : labels.announceLeave,
    );
  };

  const reset = () => {
    setChoices({});
    setOtherShown(false);
    setLastAction(labels.announceReset);
  };

  /* Durum satırı TEK SESLİ ve tek satır: canlı bölge ne kadar sadeyse o
     kadar okunur. Sonucun adı ancak beş durak da seçilince ekleniyor. */
  const statusLine = [
    lastAction,
    `${labels.progressLabel}: ${chosenCount}/${steps.length}.`,
    complete ? `${labels.outcomeTitle}: ${shown.title}` : progress,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.ledger} data-complete={complete ? "true" : "false"}>
      <p className={styles.ledgerHint}>{labels.keyboardHint}</p>

      <ol className={styles.ledgerList}>
        {steps.map((step, i) => {
          const choice = choices[step.key];
          const stayState = choice === "stay";
          const leaveState = choice === "leave";
          return (
            <li
              key={step.key}
              className={styles.ledgerStep}
              data-branch={choice ?? "none"}
            >
              {/* ── yolun gövdesi: işaret sütunu ───────────────────────── */}
              <span className={styles.stepRail} aria-hidden>
                <span className={styles.stepNode} />
                <span className={styles.stepStemLeft} />
                <span className={styles.stepStemRight} />
              </span>

              {/* ── düğümün gövdesi ───────────────────────────────────── */}
              <div className={styles.stepBody}>
                <p className={styles.stepMeta}>
                  <span className={styles.stepIndex}>
                    {labels.stepLabel} {step.index}
                  </span>
                  <span className={styles.stepAge}>{step.age}</span>
                  <span className={styles.stepWhen}>{step.when}</span>
                </p>

                <h3 className={styles.stepTitle}>{step.title}</h3>

                <p className={styles.stepText}>
                  <Voice pair={step.text} />
                </p>

                {step.original ? (
                  <figure
                    className={styles.original}
                    data-kind={step.original.isQuote ? "quote" : "record"}
                  >
                    <p className={styles.originalKind}>
                      {step.original.kindLabel}
                    </p>
                    <blockquote className={styles.originalText} lang="ja">
                      {step.original.text}
                    </blockquote>
                    <p className={styles.originalReading}>
                      {step.original.reading}
                    </p>
                    {/* `figcaption` figure'un SON çocuğu olmak zorunda */}
                    <figcaption className={styles.originalNote}>
                      {step.original.note}
                    </figcaption>
                  </figure>
                ) : null}

                {step.kin ? (
                  <p className={styles.stepKin}>
                    {step.kin.href ? (
                      /* Yerel bilinçli bağlantı: `next/link` DOĞRUDAN
                         kullanılmıyor (ev kuralı), sarmalayıcı hem sunucu
                         hem istemci bileşenlerinden çağrılabiliyor. */
                      <Link className={styles.stepKinLink} href={step.kin.href}>
                        {step.kin.name}
                      </Link>
                    ) : (
                      <span className={styles.stepKinPlain}>
                        {step.kin.name}
                      </span>
                    )}
                    <span className={styles.stepKinRole}>{step.kin.role}</span>
                  </p>
                ) : null}

                {/* ── YOL AYRIMI ────────────────────────────────────────
                    İki dal da her zaman yazılı. Seçilmeyen dal SOLUK ama
                    silinmiyor — "seçilmeyen dal yanda kalıyor" kilidi
                    tam olarak bu. */}
                <div
                  className={styles.fork}
                  role="group"
                  aria-label={`${step.title} — ${labels.forkLabel}`}
                >
                  <div
                    className={styles.forkArm}
                    data-state={
                      choice === undefined
                        ? "open"
                        : stayState
                          ? "taken"
                          : "ghost"
                    }
                  >
                    <button
                      type="button"
                      className={styles.forkButton}
                      aria-pressed={stayState}
                      onClick={() => choose(step.key, "stay")}
                    >
                      <span className={styles.forkGlyph} aria-hidden>
                        留
                      </span>
                      <span className={styles.forkWord}>{step.stayLabel}</span>
                    </button>
                    <p className={styles.forkBadge}>
                      {choice === undefined
                        ? labels.pendingBadge
                        : stayState
                          ? labels.chosenBadge
                          : labels.ghostBadge}
                    </p>
                    <p className={styles.forkLine}>
                      <Voice pair={step.stayLine} />
                    </p>
                  </div>

                  <div
                    className={styles.forkArm}
                    data-state={
                      choice === undefined
                        ? "open"
                        : leaveState
                          ? "taken"
                          : "ghost"
                    }
                  >
                    <button
                      type="button"
                      className={styles.forkButton}
                      aria-pressed={leaveState}
                      onClick={() => choose(step.key, "leave")}
                    >
                      <span className={styles.forkGlyph} aria-hidden>
                        去
                      </span>
                      <span className={styles.forkWord}>{step.leaveLabel}</span>
                    </button>
                    <p className={styles.forkBadge}>
                      {choice === undefined
                        ? labels.pendingBadge
                        : leaveState
                          ? labels.chosenBadge
                          : labels.ghostBadge}
                    </p>
                    <p className={styles.forkLine}>
                      <Voice pair={step.leaveLine} />
                    </p>
                  </div>
                </div>

                {frames[i] ?? null}
              </div>
            </li>
          );
        })}
      </ol>

      <p className={styles.ledgerStatus} role="status">
        {statusLine}
      </p>

      {complete ? (
        <div className={styles.outcome} data-outcome={shown.key}>
          <p className={styles.outcomeKanji} lang="ja" aria-hidden>
            {shown.kanji}
          </p>
          <h3 className={styles.outcomeTitle}>{shown.title}</h3>
          <p className={styles.outcomeText}>
            <Voice pair={shown.text} />
          </p>
          <p className={styles.outcomeCanon}>{shown.canon}</p>

          <div className={styles.outcomeActions}>
            <button
              type="button"
              className={styles.ledgerButton}
              aria-pressed={otherShown}
              onClick={() => setOtherShown((v) => !v)}
            >
              {otherShown ? labels.ownOutcome : labels.otherOutcome}
            </button>
            <button
              type="button"
              className={styles.ledgerButton}
              onClick={reset}
            >
              {labels.reset}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.outcomeActions}>
          <button
            type="button"
            className={styles.ledgerButton}
            onClick={reset}
            disabled={chosenCount === 0}
          >
            {labels.reset}
          </button>
        </div>
      )}
    </div>
  );
}
