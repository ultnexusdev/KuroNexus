import styles from "./AshHand.module.css";

/**
 * KÜLE DÖNEN EL — sayfanın tek duygusal doruk noktasının tek görseli.
 *
 * ── NEDEN EL ─────────────────────────────────────────────────────────────
 * Ulquiorra'nın bütün tezi "göremediğim şey yoktur" üzerine kurulu ve
 * sonunda uzattığı şey tam olarak bir el. Sahne bunu bir cümleyle
 * anlatmıyor; el açık duruyor ve parmak uçlarından başlayarak dağılıyor.
 *
 * ── PARÇACIKLAR VERİDEN DEĞİL, DÜZENDEN ──────────────────────────────────
 * Yirmi dört kül zerresi elle yazılmadı; bir dizi indeksinden türüyor.
 * ⚠️ `Math.random()` YOK: sunucu ile istemcinin ürettiği değerler
 * ayrışırsa hidrasyon uyuşmazlığı olur. Dağınıklık deterministik bir
 * karışımdan geliyor — her yüklemede aynı, ama düzenli görünmüyor.
 *
 * ⚠️ Hareket `prefers-reduced-motion`'da tamamen duruyor: zerreler
 * dağılmış hâlleriyle sabit kalıyor (brief'in kabul ölçütü). Sahne
 * hareketsizken de okunuyor.
 */

const MOTES = Array.from({ length: 24 }, (_, i) => {
  /* Deterministik "rastgelelik": iki asal çarpanla kırılan bir tarama.
     Aynı girdiyle hep aynı çıktı — hidrasyon güvenli. */
  const a = (i * 37) % 24;
  const b = (i * 53) % 17;
  return {
    x: 22 + a * 3.4,
    y: 44 - b * 1.9,
    size: 1.4 + (b % 4) * 0.7,
    delay: (i % 8) * 0.35,
    drift: (b % 5) - 2,
  };
});

export function AshHand() {
  return (
    <svg
      className={styles.ash}
      viewBox="0 0 160 150"
      aria-hidden="true"
      role="presentation"
    >
      {/* Avuç: açık, yukarı bakıyor. Tek kontur — sahne tek renkli. */}
      <path
        className={styles.hand}
        d="M50 148c-6-18-10-34-10-48 0-10 3-16 9-16 5 0 8 5 9 13l2 12V60c0-9 4-14 10-14s10 5 10 14v46l3-14c2-9 6-13 11-12 6 1 9 7 8 16l-3 22c4-6 9-9 13-7 6 2 8 8 5 16l-9 21"
      />
      {/* Parmak uçları çoktan gitmiş: kontur yukarıda kesiliyor ve
          yerini zerreler alıyor. */}
      {MOTES.map((mote, i) => (
        <rect
          key={i}
          className={styles.mote}
          x={mote.x}
          y={mote.y}
          width={mote.size}
          height={mote.size}
          style={
            {
              "--delay": `${mote.delay}s`,
              "--drift": `${mote.drift}`,
            } as React.CSSProperties
          }
        />
      ))}
    </svg>
  );
}
