"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CardBack, CardMark, Chevron } from "./KabutoGlyphs";
import styles from "./KabutoExperience.module.css";

/**
 * KİMLİK DESTESİ — sayfanın kalbi.
 *
 * Mekanik: kartlar yüzü aşağı duran bir DESTEDE bekler. "Kart çek" desteden
 * bir kimlik alır; çekilen kart ortaya gelir, önceki kartlar yana YIĞILIR ve
 * "kalan kimlik" sayacı azalır. Son kart boştur ve üstünde tek bir soru
 * vardır. İleri atlanamaz — kimlikler ancak sırayla öğrenilir; geri dönmek
 * ise serbest, yığındaki her kart bir düğme.
 *
 * ⚠️ Aizen sayfasındaki kırık ayna parçalarıyla karıştırılmamalı: orada TEK
 * gerçeklik kırılıp dağılıyor, burada kimlikler ÜST ÜSTE yığılıyor. Zıt
 * hareket: biri parçalanma, öbürü birikme.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Tıklanabilir her şey gerçek `<button>`. Yığındaki kartlar normal sekme
 * sırasında (roving tabindex YOK — yedi kartlık bir yığında gizli odak
 * sırası kullanıcıyı yanıltır); ayrıca ok tuşları yığın içinde gezdirir.
 * Çekilen kimlik `role="status"` satırıyla ekran okuyucuya duyurulur.
 *
 * Metinler sunucuda `pick` ile seçilmiş düz dize olarak iner (BRIEF §5):
 * bu ada `LocalizedText` görmüyor.
 */

export interface DeckCardView {
  key: string;
  mark: string;
  era: string;
  title: string;
  text: string;
  use: string;
  residue: string;
  blank: boolean;
  question: string | null;
  face: string | null;
  faceAlt: string;
  faceName: string | null;
  image: string | null;
}

export function IdentityDeck({
  cards,
  drawLabel,
  resetLabel,
  drawnListLabel,
  remainingLabel,
  emptyDeckLabel,
  deckAlt,
  useLabel,
  residueLabel,
  cardWord,
  hint,
}: {
  cards: DeckCardView[];
  drawLabel: string;
  resetLabel: string;
  drawnListLabel: string;
  remainingLabel: string;
  emptyDeckLabel: string;
  deckAlt: string;
  useLabel: string;
  residueLabel: string;
  cardWord: string;
  hint: string;
}) {
  const total = cards.length;
  const [drawn, setDrawn] = useState(1);
  const [active, setActive] = useState(0);
  const pileRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const card = cards[active];
  if (!card) {
    return null;
  }

  const remaining = total - drawn;
  const empty = remaining <= 0;

  const draw = () => {
    if (empty) {
      return;
    }
    setActive(drawn);
    setDrawn(drawn + 1);
  };

  const reset = () => {
    setDrawn(1);
    setActive(0);
  };

  /* Yığında gezinme: odak seçilen kartın üstünde kalır. */
  const focusCard = (next: number) => {
    const clamped = (next + drawn) % drawn;
    setActive(clamped);
    pileRefs.current[clamped]?.focus();
  };

  const onPileKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusCard(active + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusCard(active - 1);
        break;
      case "Home":
        event.preventDefault();
        focusCard(0);
        break;
      case "End":
        event.preventDefault();
        focusCard(drawn - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.deck}>
      {/* ── Sahne: çekilen kart ─────────────────────────────────────────── */}
      <div className={styles.stage}>
        <article
          /* key: kart değişince "masaya konma" animasyonu baştan oynar —
             sayfanın tek yazılmış hareket anı */
          key={card.key}
          className={styles.card}
          data-blank={card.blank || undefined}
        >
          {card.image ? (
            <span className={styles.cardArt} aria-hidden>
              <Image src={card.image} alt="" fill sizes="420px" />
            </span>
          ) : null}

          <header className={styles.cardHead}>
            <CardMark mark={card.mark} className={styles.cardMark} />
            <p className={styles.cardIndex}>
              <span className={styles.cardIndexWord}>{cardWord}</span>
              <span className={styles.cardIndexNumber}>{active + 1}</span>
              <span className={styles.cardIndexTotal}>/ {total}</span>
            </p>
          </header>

          <p className={styles.cardEra}>{card.era}</p>

          {card.blank && card.question ? (
            <p className={styles.cardQuestion}>{card.question}</p>
          ) : (
            <h3 className={styles.cardTitle}>{card.title}</h3>
          )}

          {/* Künye fotoğrafı köşesi: kimliğin kurulduğu kişi. Kart bu köşeyi
              her zaman boş bırakıyor (sağ üst iç boşluk), portre olmadığında
              da düzen kaymasın diye. */}
          {card.face && card.faceName ? (
            <figure className={styles.cardFigure}>
              <span className={styles.cardFace}>
                <Image src={card.face} alt={card.faceAlt} fill sizes="88px" />
              </span>
              <figcaption className={styles.cardFaceName}>
                {card.faceName}
              </figcaption>
            </figure>
          ) : null}

          <p className={styles.cardText}>{card.text}</p>

          <dl className={styles.cardFields}>
            <div className={styles.cardField}>
              <dt>{useLabel}</dt>
              <dd>{card.use}</dd>
            </div>
            <div className={styles.cardField}>
              <dt>{residueLabel}</dt>
              <dd>{card.residue}</dd>
            </div>
          </dl>
        </article>
      </div>

      {/* ── Deste: yüzü aşağı bekleyen kimlikler ────────────────────────── */}
      <div className={styles.deckSide}>
        <p className={styles.deckCount}>
          <span className={styles.deckCountNumber}>{remaining}</span>
          <span className={styles.deckCountLabel}>{remainingLabel}</span>
        </p>

        <div className={styles.deckStack}>
          {!empty ? (
            <>
              {cards.slice(drawn).map((item, position) => (
                <span
                  key={item.key}
                  className={styles.deckBack}
                  style={{ "--kab-i": position } as React.CSSProperties}
                  aria-hidden
                >
                  <CardBack
                    className={styles.deckBackArt}
                    frameClassName={styles.backFrame}
                    hatchClassName={styles.backHatch}
                    scaleClassName={styles.backScales}
                    markClassName={styles.backMark}
                  />
                </span>
              ))}
              <span className={styles.visuallyHidden}>{deckAlt}</span>
            </>
          ) : (
            <p className={styles.deckEmpty}>{emptyDeckLabel}</p>
          )}
        </div>

        {/* TEK düğme, iki iş: deste bitince aynı DOM düğümü "topla"ya döner.
            İki ayrı düğme yazılsaydı son kart çekildiğinde düğüm sökülür ve
            klavye kullanıcısının odağı gövdeye düşerdi. */}
        <button
          type="button"
          className={styles.drawButton}
          data-kind={empty ? "reset" : undefined}
          onClick={empty ? reset : draw}
        >
          {empty ? (
            <Chevron direction="left" className={styles.drawChevron} />
          ) : null}
          {empty ? resetLabel : drawLabel}
          {empty ? null : <Chevron className={styles.drawChevron} />}
        </button>
      </div>

      {/* ── Yığın: çekilmiş kimlikler ───────────────────────────────────── */}
      <div className={styles.pileWrap}>
        <p className={styles.pileLabel} id="kab-pile-label">
          {drawnListLabel}
        </p>
        <ul
          className={styles.pile}
          aria-labelledby="kab-pile-label"
          onKeyDown={onPileKeyDown}
        >
          {cards.slice(0, drawn).map((item, position) => (
            <li key={item.key} className={styles.pileItem}>
              <button
                type="button"
                className={styles.pileCard}
                data-active={position === active || undefined}
                data-blank={item.blank || undefined}
                aria-current={position === active ? "true" : undefined}
                ref={(node) => {
                  pileRefs.current[position] = node;
                }}
                onClick={() => setActive(position)}
              >
                <CardMark mark={item.mark} className={styles.pileMark} />
                <span className={styles.pileTitle}>
                  {item.blank && item.question ? item.question : item.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className={styles.deckHint}>{hint}</p>
      </div>

      <p className={styles.visuallyHidden} role="status">
        {`${active + 1} / ${total} — ${
          card.blank && card.question ? card.question : card.title
        }`}
      </p>
    </div>
  );
}
