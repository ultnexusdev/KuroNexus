import { getTranslations } from "next-intl/server";
import { ROSTER, ROSTER_BY_ID } from "@/lib/anime/slam-dunk/roster";
import { TEAM_ORDER, TEAMS } from "@/lib/anime/slam-dunk/teams";
import { pick } from "@/lib/anime/slam-dunk/types";
import { QuarterHeader } from "./QuarterHeader";
import { RosterGrid } from "./RosterGrid";
import court from "./court.module.css";
import styles from "./BenchSection.module.css";

/**
 * 3. ÇEYREK · KENAR — koçlar ve menajerler.
 *
 * ── NEDEN AYRI BİR BÖLÜM ─────────────────────────────────────────────────
 * Koçları kendi takımlarının kadrosuna karıştırmak iki şeyi bozardı: forma
 * numaralarının kesintisiz akışını ve stat barlarının anlamını (bir koçu
 * şut yüzdesiyle puanlamak veriyi uydurmaktır). Ayrı bölüm ayrıca bir tez
 * kuruyor: Anzai'nin yirmi bin şutu, Taoka'nın yanlış okuması ve
 * Domoto'nun gece boyu analizi maçları sahadaki beş kişi kadar belirledi.
 *
 * ── ⚠️ FUJIMA BURADA DEĞİL ───────────────────────────────────────────────
 * Shoyo'nun koçu aynı zamanda kaptanı ve 4 numarası. Kaydı `player` ve
 * kadro ızgarasında duruyor; buraya ikinci bir kart koymak aynı kişiyi iki
 * yerde göstermek olurdu. Bölüm bunu susmuyor — altındaki not söylüyor.
 */
export async function BenchSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "slamDunk" });

  /* Takım sırasına göre: Shohoku'nun üç kaydı önde, sonra dört rakip.
     `ROSTER`ı doğrudan süzmek, sırayı kayıt dosyasındaki tesadüfe
     bırakırdı. */
  const staff = TEAM_ORDER.flatMap((team) =>
    ROSTER.filter((member) => member.team === team && member.role !== "player"),
  );

  const fujima = ROSTER_BY_ID.fujima;

  return (
    <section
      id="bench"
      data-quarter
      className={`${court.section} ${styles.section}`}
      aria-labelledby="bench-title"
      data-team="neutral"
    >
      <QuarterHeader
        quarter={t("quarters.q3")}
        title={t("sections.bench.title")}
        lede={t("sections.bench.lede")}
        titleId="bench-title"
        score={{
          line: TEAMS.kainan.clash?.score ?? "",
          caption: `${TEAMS.kainan.name} · ${pick(
            TEAMS.kainan.clash?.stage ?? { tr: "" },
            locale,
          )}`,
          won: TEAMS.kainan.clash?.shohokuWon ?? false,
        }}
      />

      <RosterGrid
        members={staff}
        locale={locale}
        label={t("sections.bench.title")}
        noDisclaimer
      />

      {/* Fujima notu: kadro ızgarasında duran ama buraya da ait olan
          tek kayıt. Bölümün eksik olduğunu düşündürmemek için burada. */}
      <p className={`${court.body} ${styles.footnote}`} data-team="shoyo">
        {t("sections.bench.playerCoach", {
          name: fujima.name,
          team: TEAMS.shoyo.name,
        })}
      </p>
    </section>
  );
}
