import type { RosterMember } from "@/lib/anime/slam-dunk/types";
import { PlayerCard } from "./PlayerCard";
import styles from "./RosterGrid.module.css";

/**
 * KADRO IZGARASI — üç bölümün paylaştığı tek düzen.
 *
 * Shohoku'nun on iki oyuncusu, seçili rakibin kadrosu ve kenar bölümündeki
 * koç/menajer kayıtları aynı ızgarayı kullanıyor. Üç ayrı ızgara yazmak,
 * bir gün kart boyu değiştiğinde ikisinin unutulması demekti.
 *
 * ── ⚠️ STAT UYARISI KALDIRILDI (29 Ağustos 2026) ─────────────────────────
 * Izgaranın altında, bar değerlerinin canon olmadığını anlatan altı
 * satırlık bir not duruyordu. Kullanıcı kararıyla kaldırıldı: not
 * kartlardan uzun kalıyor ve kadronun bittiği yerde göz onu bir dipnot
 * değil ayrı bir bölüm sanıyordu.
 *
 * Bilgi kaybolmadı — barların nereden çıktığı `StatBars.tsx` başlığında ve
 * `lib/anime/slam-dunk/` kayıtlarında yazılı. Kaynakta olmayan alan hâlâ
 * uydurulmuyor, "kayıt yok" yazıyor.
 *
 * ⚠️ `noDisclaimer` prop'u da gitti: tek kullanıcısı (koç/menajer ızgarası)
 * artık kapatacak bir şey bulamıyordu. Kapatacağı şey olmayan bir anahtar,
 * bir sonraki okuyucuya "burada bir uyarı var" der.
 */
export async function RosterGrid({
  members,
  locale,
  label,
}: {
  members: RosterMember[];
  locale: string;
  /** Izgaranın erişilebilir adı — bölüm başlığından farklı olabilir */
  label: string;
}) {
  if (members.length === 0) return null;

  return (
    <ul className={styles.grid} aria-label={label}>
      {members.map((member) => (
        <li key={member.id}>
          <PlayerCard member={member} locale={locale} size="grid" />
        </li>
      ))}
    </ul>
  );
}
