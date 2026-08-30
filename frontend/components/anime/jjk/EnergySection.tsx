import { getTranslations } from "next-intl/server";
import { ENERGY_LAYERS } from "@/lib/anime/jjk/energy";
import { pick } from "@/lib/anime/jjk/types";
import { EnergyLadder } from "./EnergyLadder";
import shared from "./jjk.module.css";
import styles from "./EnergySection.module.css";

/**
 * P02 · LANETLİ ENERJİ (呪力) — on basamaklı merdiven.
 *
 * Solda katman listesi, sağda seçili katmanın dosyası. Liste bir menü
 * değil, güç sisteminin kendisi: temelden (呪力) zirveye (領域展開) on
 * kural üst üste. Bölge derisi mor (`data-zone="energy"`).
 *
 * Ada yalnızca seçim durumunu taşıyor; metinler sunucuda dile indirilip
 * düz dizi olarak geçiyor (RSC sınırı — işlev değil, hazır veri geçir).
 */
export async function EnergySection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.jjk.energy" });

  const layers = ENERGY_LAYERS.map((layer) => ({
    jp: layer.jp,
    name: pick(layer.name, locale),
    cost: pick(layer.cost, locale),
    who: pick(layer.who, locale),
    body: pick(layer.body, locale),
  }));

  return (
    <section
      id="energy"
      aria-labelledby="jjk-energy-title"
      className={`${shared.section} ${styles.zone}`}
      data-zone="energy"
      tabIndex={-1}
    >
      <span className={shared.ghost} aria-hidden="true" lang="ja">
        呪力
      </span>

      <div className={styles.inner}>
        <header>
          <p className={shared.headNo}>02</p>
          <h2 id="jjk-energy-title" className={shared.head}>
            <span className={shared.headKanji} lang="ja">呪力</span>
            <span className={shared.headLatin}>{t("latin")}</span>
          </h2>
          <p className={shared.lede}>{t("lede")}</p>
        </header>

        <EnergyLadder
          layers={layers}
          labels={{
            listAria: t("listAria"),
            cost: t("cost"),
            who: t("who"),
            index: t("index"),
          }}
        />
      </div>
    </section>
  );
}
