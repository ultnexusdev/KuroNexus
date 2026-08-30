import { getTranslations } from "next-intl/server";
import { SOCIETY } from "@/lib/anime/jjk/society";
import { pick } from "@/lib/anime/jjk/types";
import { animeHref } from "@/lib/anime/routes";
import { societySlotId } from "@/lib/anime/jjk/slots";
import { CuratedImage, CuratedSlotPen } from "./CuratedImage";
import { SocietyBoard, type SocietyBranchView } from "./SocietyBoard";
import shared from "./jjk.module.css";
import styles from "./SocietySection.module.css";

/**
 * P03 · JUJUTSU TOPLUMU (呪術社会) — üç kurum, yirmi yedi dosya.
 *
 * Kurum seçilir → kadro listesi + KÂĞIT DOSYA açılır: koyu arşivin içinde
 * tek açık yüzey, seçili üyenin sicil kartı (mockup'taki Nobara kartı).
 * Kâğıt bilinçli: karargâh her şeyi kâğıda yazar, kimseye hesap vermez.
 *
 * Kurum kareleri küratör yuvası; sunucuda çizilip adaya `ReactNode`
 * olarak iniyor (RSC sınırı). Kalem kartın DIŞINDA kardeş olarak duruyor —
 * yuva görünürlüğü istemci durumuna bağlı olduğu için kalemleri sabit bir
 * sırada, panelin altında basıyoruz; üçü de her an erişilebilir.
 */
export async function SocietySection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.jjk.society" });

  const branches: SocietyBranchView[] = SOCIETY.map((branch) => ({
    key: branch.key,
    jp: branch.jp,
    en: branch.en,
    note: pick(branch.note, locale),
    stats: branch.stats.map((stat) => ({
      label: pick(stat.label, locale),
      value: stat.value,
    })),
    people: branch.people.map((person) => ({
      name: person.name,
      grade: pick(person.grade, locale),
      tech: pick(person.tech, locale),
      domain: person.domain,
      status: pick(person.status, locale),
      line: pick(person.line, locale),
      href: person.characterId ? animeHref.character(person.characterId) : null,
    })),
  }));

  const frames = SOCIETY.map((branch) => (
    <CuratedImage
      key={branch.key}
      slotId={societySlotId(branch.key)}
      className={styles.frame}
      sizes="1600px"
      glyph={branch.jp.slice(0, 2)}
      decorative
      noEdit
    />
  ));

  return (
    <section
      id="society"
      aria-labelledby="jjk-society-title"
      className={shared.section}
      tabIndex={-1}
    >
      <span className={shared.ghost} aria-hidden="true" lang="ja">
        高専
      </span>

      <div className={styles.inner}>
        <header>
          <p className={shared.headNo}>03</p>
          <h2 id="jjk-society-title" className={shared.head}>
            <span className={shared.headKanji} lang="ja">呪術社会</span>
            <span className={shared.headLatin}>{t("latin")}</span>
          </h2>
          <p className={shared.lede}>{t("lede")}</p>
        </header>

        <SocietyBoard
          branches={branches}
          frames={frames}
          labels={{
            branchesAria: t("branchesAria"),
            rosterAria: t("rosterAria"),
            grade: t("grade"),
            tech: t("tech"),
            domain: t("domain"),
            status: t("status"),
            file: t("file"),
          }}
        />

        {/* Küratör kalemleri — yuvalar hangi sekmede olursa olsun buradan
            düzenlenir; ziyaretçi DOM'unda bu blok hiç yok. */}
        <div className={styles.pens}>
          {SOCIETY.map((branch) => (
            <span key={branch.key} className={styles.penSeat}>
              <CuratedSlotPen slotId={societySlotId(branch.key)} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
