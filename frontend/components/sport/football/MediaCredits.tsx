import type { MediaCredit } from "@/lib/sport/football-media";
import styles from "./MediaCredits.module.css";

/**
 * GÖRSEL KÜNYESİ.
 *
 * ── NEDEN ZORUNLU ────────────────────────────────────────────────────────
 * Sayfadaki fotoğrafların çoğu Wikimedia Commons'tan ve lisansları CC BY /
 * CC BY-SA. Bu lisanslar atıf ister; atıfsız gösterim telif ihlalidir.
 * Kanadın F1 tarafında aynı kural veri katmanında uygulanıyor
 * (`portraitLicense` + `portraitAuthor` + `portraitSourceUrl` üçü birden
 * doluysa künye görselin altında ÇİZİLMEK ZORUNDA); bu bileşen onun statik
 * görsellerdeki karşılığı.
 *
 * ── NEDEN SESSİZ ─────────────────────────────────────────────────────────
 * Künye yasal bir gereklilik, bir içerik bölümü değil. O yüzden sayfanın
 * dibinde, küçük punto ve düşük kontrastla duruyor — ama kontrast oranı
 * hâlâ okunur bandın içinde (`--text-muted`, gövde metni değil ikincil metin
 * eşiği). Görünmez yapmak atıfı yapmamakla aynı şey olurdu.
 *
 * Künyesi olmayan kare (CC0 / kamu malı / küratörün kendi yüklemesi) listeye
 * hiç girmiyor; liste boşsa bileşen HİÇ çizilmiyor.
 */
export function MediaCredits({
  credits,
  label,
}: {
  credits: MediaCredit[];
  label: string;
}) {
  if (credits.length === 0) return null;

  return (
    <aside className={styles.credits}>
      <h2 className={styles.label}>{label}</h2>
      <ul>
        {credits.map((credit) => (
          <li key={`${credit.author}-${credit.license}`}>
            <a
              href={credit.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {credit.author}
            </a>
            <span>{credit.license}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
