import { getTranslations } from "next-intl/server";
import {
  SHIBUYA_ACTORS,
  SHIBUYA_POSITIONS,
  SHIBUYA_STATIONS,
  SHIBUYA_STOPS,
} from "@/lib/anime/jjk/shibuya";
import { pick } from "@/lib/anime/jjk/types";
import { ShibuyaOps, type ShibuyaStopView } from "./ShibuyaOps";
import shared from "./jjk.module.css";
import styles from "./ShibuyaSection.module.css";

/**
 * P10 · SHIBUYA OLAYI (渋谷事変) — operasyon odası.
 *
 * Zaman hattı ile harita TEK oda (kullanıcı kararı): saat seçilince
 * haritadaki aktör iğneleri o âna kayar, sahnede olmayan aktör haritadan
 * düşer ve lejantta söner. Kayıt kartı aynı seçimi anlatır.
 *
 * ⚠️ Harita bir DİYAGRAM — fotoğraf yuvası bilinçli olarak yok
 * (manifesto kararı: operasyon odası dili).
 */
export async function ShibuyaSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.jjk.shibuya" });

  const stops: ShibuyaStopView[] = SHIBUYA_STOPS.map((stop) => ({
    t: stop.t,
    st: pick(stop.st, locale),
    place: pick(stop.place, locale),
    title: pick(stop.title, locale),
    body: pick(stop.body, locale),
    who: stop.who,
  }));

  const stations = SHIBUYA_STATIONS.map((station) => ({
    name: pick(station.name, locale),
    x: station.x,
    y: station.y,
  }));

  return (
    <section
      id="shibuya"
      aria-labelledby="jjk-shibuya-title"
      className={shared.section}
      tabIndex={-1}
    >
      <span className={shared.ghost} aria-hidden="true" lang="ja">
        渋谷
      </span>

      <div className={styles.inner}>
        <header>
          <p className={shared.headNo}>09</p>
          <h2 id="jjk-shibuya-title" className={shared.head}>
            <span className={shared.headKanji} lang="ja">渋谷事変</span>
            <span className={shared.headLatin}>{t("latin")}</span>
          </h2>
          <p className={shared.lede}>{t("lede")}</p>
        </header>

        <ShibuyaOps
          stops={stops}
          stations={stations}
          actors={SHIBUYA_ACTORS.map((actor) => ({ ...actor }))}
          positions={SHIBUYA_POSITIONS.map((frame) => ({ ...frame }))}
          labels={{
            lineAria: t("lineAria"),
            mapAria: t("mapAria"),
            legendAria: t("legendAria"),
            prev: t("prev"),
            next: t("next"),
            stop: t("stop"),
            place: t("place"),
            who: t("who"),
          }}
        />
      </div>
    </section>
  );
}
