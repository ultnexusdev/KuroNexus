import { getTranslations } from "next-intl/server";
import { COLONIES, CULLING_RULES } from "@/lib/anime/jjk/culling";
import { pick } from "@/lib/anime/jjk/types";
import { CuratedImage, CuratedSlotPen } from "./CuratedImage";
import { ColonyMap, type ColonyView } from "./ColonyMap";
import shared from "./jjk.module.css";
import styles from "./CullingSection.module.css";

/**
 * P11 · KIYIM OYUNU (死滅回游) — koloni haritası + kural defteri.
 *
 * Japonya haritası (küratör yuvası fon) üstünde on koloni iğnesi; dördü
 * açık kayıt, altısı mühürlü. Sağda kural defteri: oyun bir turnuva değil,
 * kural üretme makinesi. Bölge derisi soğuk mavi (`data-zone="culling"`).
 */
export async function CullingSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.jjk.culling" });

  const colonies: ColonyView[] = COLONIES.map((colony) => ({
    no: colony.no,
    name: colony.name ? pick(colony.name, locale) : t("closedName"),
    jp: colony.jp,
    x: colony.x,
    y: colony.y,
    open: colony.open,
    players: colony.players ?? t("noRecord"),
    events: colony.events ? pick(colony.events, locale) : t("noRecord"),
    note: pick(colony.note, locale),
  }));

  const rules = CULLING_RULES.map((rule) => ({
    no: rule.no,
    text: pick(rule.text, locale),
  }));

  const backdrop = (
    <CuratedImage
      slotId="jjk:culling:map"
      className={styles.backdrop}
      sizes="2400px"
      decorative
      noEdit
      fill
    />
  );

  return (
    <section
      id="culling"
      aria-labelledby="jjk-culling-title"
      className={`${shared.section} ${styles.zone}`}
      data-zone="culling"
      tabIndex={-1}
    >
      <span className={shared.ghost} aria-hidden="true" lang="ja">
        死滅
      </span>

      <div className={styles.inner}>
        <header>
          <p className={shared.headNo}>10</p>
          <h2 id="jjk-culling-title" className={shared.head}>
            <span className={shared.headKanji} lang="ja">死滅回游</span>
            <span className={shared.headLatin}>{t("latin")}</span>
          </h2>
          <p className={shared.lede}>{t("lede")}</p>
        </header>

        <ColonyMap
          colonies={colonies}
          rules={rules}
          backdrop={backdrop}
          pen={<CuratedSlotPen slotId="jjk:culling:map" />}
          labels={{
            mapAria: t("mapAria"),
            mapNote: t("mapNote"),
            colony: t("colony"),
            players: t("players"),
            events: t("events"),
            rulesTitle: t("rulesTitle"),
            sealed: t("sealed"),
          }}
        />
      </div>
    </section>
  );
}
