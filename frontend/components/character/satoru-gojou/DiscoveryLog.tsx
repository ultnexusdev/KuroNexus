"use client";

import { useDiscovery } from "./DiscoveryProvider";
import styles from "./GojoExperience.module.css";

/**
 * P11 · KEŞİF KAYDI.
 *
 * ⚠️ KİLİTLİ YUVA İPUCU VERMİYOR. Bulunmamış bir keşif yalnızca bir çizgi
 * olarak duruyor: ne adı ne nasıl bulunacağı yazıyor. Bulununca üçü birden
 * açılıyor — ad, yol ve Gojō'nun alaycı notu.
 *
 * ⚠️ AMA KISAYOLLAR ERİŞİLEMEZ DEĞİL. `S`, `D` ve `P` sayfadaki `sr-only`
 * kısayol listesinde tanımlı; mikro objeler gerçek `<button>` ve sekmeyle
 * bulunuyor. Yani gizlilik bir ENGEL değil bir OYUN — ekran okuyucu
 * kullanıcısı için kapalı kalan hiçbir şey yok.
 *
 * ── NEDEN İSTEMCİ BİLEŞENİ ───────────────────────────────────────────────
 * Kayıt, keşif durumunu okuyor ve o durum tamamen tarayıcıda. Sunucuda
 * çizilecek bir hâli yok; bu yüzden bölüm iskeleti (başlık, açıklama)
 * sunucuda, yalnızca liste burada.
 */
export interface EggView {
  key: string;
  name: string;
  how: string;
  note: string;
}

export function DiscoveryLog({
  eggs,
  lockedLabel,
  counterLabel,
  completeLabel,
  resetLabel,
}: {
  eggs: EggView[];
  lockedLabel: string;
  counterLabel: string;
  completeLabel: string;
  resetLabel: string;
}) {
  const { found, reset } = useDiscovery();
  const total = eggs.length;
  const count = eggs.filter((egg) => found.has(egg.key)).length;

  return (
    <>
      <p className={styles.eggsCount}>
        {counterLabel} {count} / {total}
      </p>

      <ol className={styles.eggsLog}>
        {eggs.map((egg, index) => {
          const isFound = found.has(egg.key);
          return (
            <li className={styles.eggRow} key={egg.key}>
              <span className={styles.eggIndex}>
                {String(index + 1).padStart(2, "0")}
              </span>
              {isFound ? (
                <span>
                  <span className={styles.eggName}>{egg.name}</span>
                  <span className={styles.eggHow}> · {egg.how}</span>
                  <p className={styles.eggNote}>{egg.note}</p>
                </span>
              ) : (
                /* İPUCU YOK. Yalnızca kilitli olduğu yazıyor. */
                <span className={styles.eggLocked}>— {lockedLabel} —</span>
              )}
            </li>
          );
        })}
      </ol>

      {count === total ? (
        <p className={styles.eggsComplete} role="status">
          {completeLabel}
        </p>
      ) : null}

      {count > 0 ? (
        <button type="button" className={styles.eggsReset} onClick={reset}>
          {resetLabel}
        </button>
      ) : null}
    </>
  );
}
