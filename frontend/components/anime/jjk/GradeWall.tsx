import { getTranslations } from "next-intl/server";
import { GRADE_ROSTER, GRADE_TIERS } from "@/lib/anime/jjk/grades";
import { pick } from "@/lib/anime/jjk/types";
import { animeHref } from "@/lib/anime/routes";
import { GradeBoard, type GradeTierView } from "./GradeBoard";
import shared from "./jjk.module.css";
import styles from "./GradeWall.module.css";

/**
 * P05 · DERECE DUVARI (呪術師) — resmî kayıt ↔ gerçek tehdit.
 *
 * Anahtar çevrilir, aynı isimler duvarda BAŞKA basamağa düşer. İki listede
 * aynı yerde durmayan isim kızıl çerçeve + fark notu taşır — bölümün tezi
 * ("derecelendirme idari bir karardır") tek bir düğmeyle yaşatılıyor.
 *
 * İki kip sunucuda ÖNCEDEN kurulup adaya iniyor: ada yalnızca hangisinin
 * görüneceğini seçiyor, hesap yapmıyor.
 */
export async function GradeWall({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.jjk.grades" });

  const tierName = new Map(GRADE_TIERS.map((tier) => [tier.key, pick(tier.name, locale)]));

  const buildMode = (mode: "official" | "real"): GradeTierView[] =>
    GRADE_TIERS.map((tier) => ({
      jp: tier.key,
      name: pick(tier.name, locale),
      people: GRADE_ROSTER.filter(
        (entry) => (mode === "official" ? entry.official : entry.real) === tier.key,
      ).map((entry) => ({
        name: entry.name,
        mismatch: entry.official !== entry.real,
        note:
          entry.official !== entry.real
            ? mode === "official"
              ? `${t("realShort")}: ${tierName.get(entry.real) ?? entry.real}`
              : `${t("officialShort")}: ${tierName.get(entry.official) ?? entry.official}`
            : null,
        href: entry.characterId ? animeHref.character(entry.characterId) : null,
      })),
    })).filter((tier) => tier.people.length > 0);

  return (
    <section
      id="grades"
      aria-labelledby="jjk-grades-title"
      className={shared.section}
      tabIndex={-1}
    >
      <span className={shared.ghost} aria-hidden="true" lang="ja">
        六眼
      </span>

      <div className={styles.inner}>
        <header>
          <p className={shared.headNo}>04</p>
          <h2 id="jjk-grades-title" className={shared.head}>
            <span className={shared.headKanji} lang="ja">呪術師</span>
            <span className={shared.headLatin}>{t("latin")}</span>
          </h2>
          <p className={shared.lede}>{t("lede")}</p>
        </header>

        <GradeBoard
          official={buildMode("official")}
          real={buildMode("real")}
          labels={{
            switchAria: t("switchAria"),
            official: t("official"),
            real: t("real"),
            records: t("records"),
          }}
        />
      </div>
    </section>
  );
}
