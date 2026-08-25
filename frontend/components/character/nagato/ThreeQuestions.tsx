"use client";

import { useState } from "react";
import { RippleRings } from "./NagatoGlyphs";
import { useRainDepth } from "./RainShell";
import styles from "./NagatoExperience.module.css";

/**
 * Üç soru — sayfanın kalbi.
 *
 * Sayfa bir tartışma gibi kurulu. Her soru bir açılır bölüm: açıldığında
 * SOLDA Nagato'nun cevabı, SAĞDA ona verilen karşı cevap yan yana geliyor.
 * Üçüncü sorunun karşı sütunu bilerek boş — arşiv orada taraf tutmuyor.
 *
 * ── SAYFAYA BAĞLANMASI ───────────────────────────────────────────────────
 * Açık soru sayısı `RainShell`e context üzerinden bildiriliyor ve kökteki
 * `data-step` niteliğine iniyor: 1 → çiseler, 2 → bastırır, 3 → DİNER.
 * Yağmurun kendisi CSS'te; burada yalnızca sayı var.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Desen: WAI-ARIA "disclosure" — her soru gerçek bir `<button>`
 * (`aria-expanded` + `aria-controls`), her cevap bir `region`. Sekme
 * tuşuyla gezilir, Enter/boşlukla açılır; ok tuşu gerektiren gizli bir
 * kısayol YOK. Kapalı bölüm `hidden` ile DOM dışı davranıyor: yarı görünür
 * ama odaklanılabilir bir "hayalet panel" bırakmıyor.
 *
 * Metin sunucuda `pick` ile seçilip düz dize olarak iniyor (BRIEF §5):
 * bu ada `LocalizedText` görmüyor.
 */

export interface QuestionView {
  key: string;
  order: string;
  question: string;
  /** Sol sütunda konuşan — üçüncü soruda Nagato değil, arşivin kendisi */
  who: string;
  answerLabel: string;
  answer: string;
  counter: {
    who: string;
    label: string;
    text: string;
    quote: { text: string; by: string } | null;
  } | null;
  silence: { headline: string; text: string } | null;
}

export function ThreeQuestions({
  questions,
  listLabel,
  hint,
  gaugeLabel,
  weather,
}: {
  questions: QuestionView[];
  listLabel: string;
  hint: string;
  gaugeLabel: string;
  /** Dört satır: 0 kuru, 1 çiseliyor, 2 bastırıyor, 3 dindi */
  weather: string[];
}) {
  const [opened, setOpened] = useState<string[]>([]);
  const { setDepth } = useRainDepth();

  const depth = Math.min(opened.length, 3);

  /* Güncelleyicinin İÇİNDE ikinci bir setState çağırmıyoruz: sonraki
     listeyi burada, saf biçimde hesaplayıp iki durumu da onunla
     besliyoruz (React güncelleyicileri iki kez çağırabilir). */
  const toggle = (key: string) => {
    const next = opened.includes(key)
      ? opened.filter((item) => item !== key)
      : [...opened, key];
    setOpened(next);
    setDepth(Math.min(next.length, 3));
  };

  return (
    <div className={styles.debate}>
      <div className={styles.gauge}>
        <span className={styles.gaugeLabel}>{gaugeLabel}</span>
        <span className={styles.gaugeBars} aria-hidden>
          {[1, 2, 3].map((level) => (
            <span
              key={level}
              className={styles.gaugeBar}
              data-on={depth >= level ? "true" : undefined}
              data-still={depth === 3 ? "true" : undefined}
            />
          ))}
        </span>
        {/* Yağmurun durumu görsel değil METİN olarak da bildiriliyor:
            gösterge çubukları dekoratif, anlam bu satırda. */}
        <span className={styles.gaugeState} role="status">
          {weather[depth] ?? weather[0]}
        </span>
      </div>

      {/* `list-style: none` bazı tarayıcılarda liste anlamını siliyor;
          `role="list"` etiketin kaybolmamasını garantiliyor. */}
      <ol className={styles.questions} role="list" aria-label={listLabel}>
        {questions.map((item) => {
          const isOpen = opened.includes(item.key);
          return (
            <li
              key={item.key}
              className={styles.question}
              data-open={isOpen || undefined}
              data-final={item.silence ? "true" : undefined}
            >
              <h3 className={styles.questionHead}>
                <button
                  type="button"
                  id={`nag-q-${item.key}`}
                  className={styles.questionButton}
                  aria-expanded={isOpen}
                  aria-controls={`nag-a-${item.key}`}
                  onClick={() => toggle(item.key)}
                >
                  {/* Halkaların ortasındaki damla ÇİZİLMİYOR (çekirdek
                      sınıfı geçilmiyor): o boşluğa sorunun sırası
                      oturuyor. */}
                  <span className={styles.questionMark} aria-hidden>
                    <RippleRings
                      className={styles.rippleArt}
                      ringClassName={styles.rippleRing}
                    />
                    <span className={styles.questionOrder}>{item.order}</span>
                  </span>
                  <span className={styles.questionText}>{item.question}</span>
                </button>
              </h3>

              <div
                id={`nag-a-${item.key}`}
                className={styles.answers}
                role="region"
                aria-labelledby={`nag-q-${item.key}`}
                hidden={!isOpen}
              >
                <div
                  className={styles.answer}
                  data-voice={item.silence ? "archive" : "nagato"}
                >
                  <p className={styles.answerWho}>{item.who}</p>
                  <p className={styles.answerLabel}>{item.answerLabel}</p>
                  <p className={styles.answerText}>{item.answer}</p>
                </div>

                {item.counter ? (
                  <div className={styles.answer} data-voice="counter">
                    <p className={styles.answerWho}>{item.counter.who}</p>
                    <p className={styles.answerLabel}>{item.counter.label}</p>
                    <p className={styles.answerText}>{item.counter.text}</p>
                    {item.counter.quote ? (
                      <figure className={styles.answerQuote}>
                        <blockquote>
                          &ldquo;{item.counter.quote.text}&rdquo;
                        </blockquote>
                        <figcaption>{item.counter.quote.by}</figcaption>
                      </figure>
                    ) : null}
                  </div>
                ) : null}

                {item.silence ? (
                  <div className={styles.silence}>
                    <p className={styles.silenceHeadline}>
                      {item.silence.headline}
                    </p>
                    <p className={styles.silenceText}>{item.silence.text}</p>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <p className={styles.debateHint}>{hint}</p>
    </div>
  );
}
