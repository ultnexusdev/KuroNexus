import { getTranslations } from "next-intl/server";
import { SPIRITS } from "@/lib/anime/jjk/spirits";
import { pick } from "@/lib/anime/jjk/types";
import { spiritSlotId } from "@/lib/anime/jjk/slots";
import { CuratedImage, CuratedSlotPen } from "./CuratedImage";
import { SpiritCatalog, type SpiritView } from "./SpiritCatalog";
import shared from "./jjk.module.css";
import styles from "./SpiritArchive.module.css";

/**
 * P06 · LANET ARŞİVİ (呪霊) — karanlıkta tutulan katalog.
 *
 * On dosya kapalı açılır: kart bulanık, ad "???", sınıf "sınıflandırılmadı".
 * Silüete dokunmak dosyayı açar; sağdaki yapışkan panel tehdit
 * değerlendirmesini basar. Açılmamış dosyanın paneli de mühürlüdür.
 *
 * Bölge derisi bataklık yeşili (`data-zone="spirits"`). Portre yuvası
 * PANELDE durur — katalog silüet dilinde kalır (manifesto kararı).
 *
 * ⚠️ Yapışkan panel var: bu bölüme `deferPaint` VERİLMEZ (Bleach P18-a).
 */
export async function SpiritArchive({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.jjk.spirits" });

  const spirits: SpiritView[] = SPIRITS.map((spirit) => ({
    slug: spirit.slug,
    name: spirit.name,
    jp: spirit.jp,
    cls: pick(spirit.cls, locale),
    threat: spirit.threat,
    intel: spirit.intel,
    energy: spirit.energy,
    note: pick(spirit.note, locale),
  }));

  const portraits = SPIRITS.map((spirit) => (
    <CuratedImage
      key={spirit.slug}
      slotId={spiritSlotId(spirit.slug)}
      className={styles.portrait}
      sizes="720px"
      glyph={spirit.jp}
      decorative
      noEdit
    />
  ));

  const pens = SPIRITS.map((spirit) => (
    <CuratedSlotPen key={spirit.slug} slotId={spiritSlotId(spirit.slug)} />
  ));

  return (
    <section
      id="spirits"
      aria-labelledby="jjk-spirits-title"
      className={`${shared.section} ${styles.zone}`}
      data-zone="spirits"
      tabIndex={-1}
    >
      <span className={shared.ghost} aria-hidden="true" lang="ja">
        呪霊
      </span>

      <div className={styles.inner}>
        <header>
          <p className={shared.headNo}>05</p>
          <h2 id="jjk-spirits-title" className={shared.head}>
            <span className={shared.headKanji} lang="ja">呪霊</span>
            <span className={shared.headLatin}>{t("latin")}</span>
          </h2>
          <p className={shared.lede}>{t("lede")}</p>
        </header>

        <SpiritCatalog
          spirits={spirits}
          portraits={portraits}
          pens={pens}
          labels={{
            catalogAria: t("catalogAria"),
            panelTitle: t("panelTitle"),
            unknownName: t("unknownName"),
            unknownCls: t("unknownCls"),
            sealedNote: t("sealedNote"),
            threat: t("threat"),
            intel: t("intel"),
            energy: t("energy"),
          }}
        />
      </div>
    </section>
  );
}
