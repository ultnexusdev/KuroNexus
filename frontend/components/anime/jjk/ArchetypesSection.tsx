import { getTranslations } from "next-intl/server";
import { ARCHETYPES } from "@/lib/anime/jjk/archetypes";
import { pick } from "@/lib/anime/jjk/types";
import { animeHref } from "@/lib/anime/routes";
import { archeSlotId } from "@/lib/anime/jjk/slots";
import { CuratedImage, CuratedSlotPen } from "./CuratedImage";
import { ArchetypeIndex, type ArchetypeView } from "./ArchetypeIndex";
import shared from "./jjk.module.css";
import styles from "./ArchetypesSection.module.css";

/**
 * P08 · ARKETİPLER (最強) — isim değil, işlev.
 *
 * Solda yedi rolün dizini, sağda seçili rolün dosyası: portre yuvası,
 * künye alanları ve kenar notu. Sayfası olan karakterlerde dosya adı
 * karakter sayfasına köprü (kullanıcı kararı: karakter köprüleri).
 */
export async function ArchetypesSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.jjk.archetypes" });

  const archetypes: ArchetypeView[] = ARCHETYPES.map((arche) => ({
    slug: arche.slug,
    role: pick(arche.role, locale),
    jp: arche.jp,
    name: arche.name,
    tech: pick(arche.tech, locale),
    domain: arche.domain,
    affiliation: pick(arche.affiliation, locale),
    fight: pick(arche.fight, locale),
    arc: pick(arche.arc, locale),
    line: pick(arche.line, locale),
    href: arche.characterId ? animeHref.character(arche.characterId) : null,
  }));

  const portraits = ARCHETYPES.map((arche) => (
    <CuratedImage
      key={arche.slug}
      slotId={archeSlotId(arche.slug)}
      className={styles.portrait}
      sizes="800px"
      glyph={arche.jp.slice(0, 1)}
      decorative
      noEdit
    />
  ));

  const pens = ARCHETYPES.map((arche) => (
    <CuratedSlotPen key={arche.slug} slotId={archeSlotId(arche.slug)} />
  ));

  return (
    <section
      id="archetypes"
      aria-labelledby="jjk-archetypes-title"
      className={shared.section}
      tabIndex={-1}
    >
      <span className={shared.ghost} aria-hidden="true" lang="ja">
        最強
      </span>

      <div className={styles.inner}>
        <header>
          <p className={shared.headNo}>07</p>
          <h2 id="jjk-archetypes-title" className={shared.head}>
            <span className={shared.headKanji} lang="ja">最強</span>
            <span className={shared.headLatin}>{t("latin")}</span>
          </h2>
          <p className={shared.lede}>{t("lede")}</p>
        </header>

        <ArchetypeIndex
          archetypes={archetypes}
          portraits={portraits}
          pens={pens}
          labels={{
            listAria: t("listAria"),
            tech: t("tech"),
            domain: t("domain"),
            affiliation: t("affiliation"),
            fight: t("fight"),
            arc: t("arc"),
            openFile: t("openFile"),
          }}
        />
      </div>
    </section>
  );
}
