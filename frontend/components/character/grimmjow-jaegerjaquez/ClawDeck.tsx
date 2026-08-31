"use client";

import { useState } from "react";
import styles from "./DesgarronExperience.module.css";

/**
 * DESGARRÓN — sayfanın kalbi. Beş pençe, beş kart.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Her pençe bir KATMANIN (stratum) üstünde duruyor. Pençeye basıldığında o
 * katmanın kapağı `clip-path` ile fiziksel olarak yırtılıyor ve yırtığın
 * altından kart çıkıyor. Yırtıklar BİRİKİMLİ: ikinci pençe birinciyi
 * kapatmıyor, üstüne biniyor. Beşi de açıldığında katmanların hepsi kendi
 * açısına kayıyor (`--grm-shear`) ve bölüm parçalı bir kolaja dönüşüyor.
 *
 * ── NİYE MEVCUT MEKANİKLERDEN AYRI ───────────────────────────────────────
 * Yayındaki 41 mekanikte "kademe ilerleten ray" (Naruto, Neji, Rock Lee),
 * "açılan çekmece" (Urahara), "çevrilen kart" (Tsunade, Kabuto) ve
 * "soyulan katman" (Orochimaru) var. Buradaki fark yönde: Orochimaru'da
 * katman GERİYE SOYULUYOR ve altındaki bütün kalıyor; burada katman
 * YIRTILIYOR ve yırtık kalıcı — kapatılsa bile sayfanın ızgarası her
 * yırtıkta bir kademe daha bozuluyor. Sıra da yok: beş pençe birbirinden
 * bağımsız, istenen sırayla inebiliyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * ⚠️ Yırtık DEKORASYON. Kesen `clip-path` yalnızca `aria-hidden` kapak
 * katmanına uygulanıyor; kartın kendisi hiçbir zaman kırpılmıyor, çünkü
 * kırpılmış bir kabın içindeki odak halkası görünmez olurdu.
 *
 * Kapalı kart `grid-template-rows: 0fr` + `visibility: hidden` ile hem
 * layout'tan hem erişilebilirlik ağacından çıkıyor (Levi emsali) — yani
 * ekran okuyucunun gördüğü şey ile ekranda görünen şey aynı. Yalnızca
 * gizlemek yalan olurdu.
 *
 * Pençeler gerçek `<button>`, `aria-expanded` + `aria-controls` taşıyor;
 * durum değişikliği ayrıca `role="status"` ile yazıya dökülüyor.
 */
export interface ClawItem {
  key: string;
  index: string;
  native: string;
  reading: string;
  claw: string;
  torn: string;
  cardTitle: string;
  cardText: string;
}

export function ClawDeck({
  items,
  rackLabel,
  counterLabel,
  sealedBadge,
  tornBadge,
  tearAction,
  sealAction,
  resetLabel,
  keyboardHint,
  emptyState,
  statusTorn,
  statusSealed,
  statusReset,
  completeLine,
}: {
  items: ClawItem[];
  rackLabel: string;
  counterLabel: string;
  sealedBadge: string;
  tornBadge: string;
  tearAction: string;
  sealAction: string;
  resetLabel: string;
  keyboardHint: string;
  emptyState: string;
  statusTorn: string;
  statusSealed: string;
  statusReset: string;
  completeLine: string;
}) {
  /* Açık yırtıkların anahtar kümesi. Dizi değil Set: sıra taşımıyor —
     pençeler birbirinden bağımsız ve hangi sırayla indikleri önemsiz. */
  const [torn, setTorn] = useState<ReadonlySet<string>>(new Set());
  const [status, setStatus] = useState("");

  const openCount = torn.size;
  const allOpen = openCount === items.length;

  const toggle = (item: ClawItem) => {
    setTorn((current) => {
      const next = new Set(current);
      if (next.has(item.key)) {
        next.delete(item.key);
      } else {
        next.add(item.key);
      }
      return next;
    });
    setStatus(
      `${item.claw} — ${
        torn.has(item.key) ? statusSealed : statusTorn
      }`,
    );
  };

  const reset = () => {
    setTorn(new Set());
    setStatus(statusReset);
  };

  return (
    <div
      className={styles.deck}
      /* Kaç yırtık açık: katmanların kayma açısı ve bölümün toplam
         dağılması buradan okunuyor (CSS `[data-open]` seçicileri). */
      data-open={String(openCount)}
      data-all={allOpen ? "true" : "false"}
    >
      <div className={styles.deckHead}>
        <p className={styles.deckRack}>{rackLabel}</p>
        <p className={styles.deckCount}>
          <span className={styles.deckCountLabel}>{counterLabel}</span>
          <span className={styles.deckCountValue}>
            {openCount} / {items.length}
          </span>
        </p>
        <button
          type="button"
          className={styles.deckReset}
          onClick={reset}
          disabled={openCount === 0}
        >
          {resetLabel}
        </button>
      </div>

      <p className={styles.deckHint}>{keyboardHint}</p>

      <ol className={styles.strata}>
        {items.map((item, position) => {
          const isTorn = torn.has(item.key);
          const cardId = `grm-claw-card-${item.key}`;
          return (
            <li
              key={item.key}
              className={styles.stratum}
              data-torn={isTorn ? "true" : "false"}
              /* Katmanın sırası: kayma yönü ve derinliği bundan türüyor,
                 böylece beş parça birbirinin aynısı olmuyor. */
              data-slot={String(position % 5)}
            >
              {/* ── KAPAK — TAMAMEN DEKORATİF ──────────────────────────
                  Yırtılan şey bu. `aria-hidden`, çünkü ekran okuyucuya
                  "bir kapak var" demenin bir karşılığı yok: kapağın
                  taşıdığı bilgi (kaçıncı pençe, ne yırtılıyor) zaten
                  düğmenin kendi metninde. */}
              <span className={styles.lid} aria-hidden>
                <span className={styles.lidSkin} />
                <span className={styles.lidGash} />
              </span>

              <button
                type="button"
                className={styles.claw}
                aria-expanded={isTorn}
                aria-controls={cardId}
                onClick={() => toggle(item)}
              >
                <span className={styles.clawIndex} aria-hidden>
                  {item.index}
                </span>
                <span className={styles.clawBody}>
                  <span className={styles.clawName}>{item.claw}</span>
                  <span className={styles.clawNative} lang="ja">
                    {item.native}
                  </span>
                  <span className={styles.clawReading}>{item.reading}</span>
                  <span className={styles.clawTorn}>{item.torn}</span>
                </span>
                <span className={styles.clawState}>
                  <span className={styles.clawBadge}>
                    {isTorn ? tornBadge : sealedBadge}
                  </span>
                  <span className={styles.clawAction}>
                    {isTorn ? sealAction : tearAction}
                  </span>
                </span>
              </button>

              {/* ── KART — YIRTIĞIN ALTINDAN ÇIKAN ────────────────────
                  Kapalıyken `0fr` + `visibility: hidden`: layout'tan da
                  sekme sırasından da gerçekten çıkıyor. Kırpılmıyor. */}
              <div className={styles.card} id={cardId}>
                <div className={styles.cardInner}>
                  <h4 className={styles.cardTitle}>{item.cardTitle}</h4>
                  <p className={styles.cardText}>{item.cardText}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <p className={styles.deckStatus} role="status">
        {status || emptyState}
      </p>

      {allOpen ? <p className={styles.deckComplete}>{completeLine}</p> : null}
    </div>
  );
}
