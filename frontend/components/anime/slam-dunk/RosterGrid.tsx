import { getTranslations } from "next-intl/server";
import type { RosterMember } from "@/lib/anime/slam-dunk/types";
import { PlayerCard } from "./PlayerCard";
import court from "./court.module.css";
import styles from "./RosterGrid.module.css";

/**
 * KADRO IZGARASI — üç bölümün paylaştığı tek düzen.
 *
 * Shohoku'nun on iki oyuncusu, seçili rakibin kadrosu ve kenar bölümündeki
 * koç/menajer kayıtları aynı ızgarayı kullanıyor. Üç ayrı ızgara yazmak,
 * bir gün kart boyu değiştiğinde ikisinin unutulması demekti.
 *
 * ── STAT UYARISI BURADA, KARTTA DEĞİL ────────────────────────────────────
 * Bar değerlerinin canon olmadığı uyarısı ızgaranın ALTINDA bir kez
 * basılıyor. Kırk beş kartın her birine koymak, uyarıyı okunmaz bir dipnot
 * gürültüsüne çevirir ve kartın kendi verisini boğardı.
 *
 * ⚠️ Uyarı `noDisclaimer` ile kapatılabiliyor: koç/menajer ızgarasında hiç
 * bar yok ve orada "bu sayılar arşivin değerlendirmesi" demek anlamsız.
 */
export async function RosterGrid({
  members,
  locale,
  noDisclaimer,
  label,
}: {
  members: RosterMember[];
  locale: string;
  noDisclaimer?: boolean;
  /** Izgaranın erişilebilir adı — bölüm başlığından farklı olabilir */
  label: string;
}) {
  const t = await getTranslations({ locale, namespace: "slamDunk" });

  if (members.length === 0) return null;

  return (
    <>
      <ul className={styles.grid} aria-label={label}>
        {members.map((member) => (
          <li key={member.id}>
            <PlayerCard member={member} locale={locale} size="grid" />
          </li>
        ))}
      </ul>

      {noDisclaimer ? null : (
        <p className={`${court.body} ${styles.disclaimer}`}>
          {t("stats.disclaimer")}
        </p>
      )}
    </>
  );
}
