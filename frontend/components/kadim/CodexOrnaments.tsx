import styles from "./CodexOrnaments.module.css";

/**
 * Kadim Dünyalar kanadının imza süslemeleri.
 * - CornerFiligree: dört köşeye yerleşen ince altın flourish (SVG, stroke=currentColor).
 * - RunicMargin: sayfa kenarında akan soluk Orhun (Göktürk) glifleri — dekor değil,
 *   evrenin "yaşayan yazısı" hissini veren yapısal doku. Ekran okuyuculardan gizli.
 */

type Corner = "tl" | "tr" | "bl" | "br";

export function CornerFiligree({ corner }: { corner: Corner }) {
  return (
    <svg
      className={`${styles.filigree} ${styles[corner]}`}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M2 2v18" />
      <path d="M2 2h18" />
      <path d="M2 12c8 0 10 2 10 10" />
      <path d="M12 2c0 8 2 10 10 10" />
      <path d="M2 24c14 0 22-8 22-22" opacity="0.55" />
      <circle cx="24" cy="24" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Orhun (U+10C00–) glifleri — evrenin kadim yazısı dokusu
const RUNES = "𐰀𐰁𐰆𐰇𐰈𐰋𐰑𐰒𐰓𐰔𐰗𐰚𐰛𐰜𐰞𐰠𐰢𐰣𐰦𐰧𐰭𐰮𐰯𐰰𐰱𐰴𐰵𐰶𐰸𐰺𐰼𐰽𐱁𐱂𐱃𐱄";

function runeColumn(seed: number, count: number): string {
  let out = "";
  for (let i = 0; i < count; i++) {
    out += RUNES[(seed + i * 7) % RUNES.length];
  }
  return out;
}

export function RunicMargin({ side }: { side: "left" | "right" }) {
  return (
    <span className={`${styles.margin} ${styles[side]}`} aria-hidden>
      {runeColumn(side === "left" ? 3 : 17, 60)}
    </span>
  );
}
