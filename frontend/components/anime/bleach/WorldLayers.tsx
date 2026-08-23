import { getTranslations } from "next-intl/server";
import {
  BLEACH_WORLDS,
  READY_SECTIONS,
  WORLD_GATES,
} from "@/lib/anime/bleach/worlds";
import { pick } from "@/lib/anime/bleach/types";
import { Atmosphere } from "./Atmospheres";
import { Senkaimon } from "./Senkaimon";
import { WorldSection } from "./WorldSection";
import styles from "./WorldLayers.module.css";
import world from "./world.module.css";

/**
 * P02 · ÜÇ DÜNYA — beş katman, üst üste.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Naruto Evreni'nde bunun karşılığı "Köyler ve Bölgeler" ızgarası: yan yana
 * kartlar, hepsi eşit, hepsi aynı anda görünür. Bleach'te dünyalar eşit
 * değil ve aynı anda görünmemeliler. Beş katman üst üste istifleniyor ve
 * kullanıcı aralarından geçerek **iniyor**.
 *
 * Katman geçişi bir kaydırma değil bir KAPI olayı: aralarda Senkaimon,
 * Garganta, Ōken ve Schatten Bereich duruyor.
 *
 * ── HER KATMAN AYNI İSKELET, FARKLI GRAMER ───────────────────────────────
 * Yerleşim ortak (`WorldSection`), görsel dil ayrı (`Atmosphere`). Beşi de
 * aynı şablonu paylaşıp yalnızca renk değiştirseydi sayfa "beş kez aynı
 * bölüm" olurdu.
 *
 * ── SIFIR JS ─────────────────────────────────────────────────────────────
 * Tema değişimi nitelik + kalıtım, geçitler CSS. Bu bölümde tek satır
 * istemci kodu yok; derinlik rayı ayrı bir ada ve o da yalnızca "hangi
 * katmandayım" göstergesini sürüyor.
 */
export async function WorldLayers({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.bleach.world" });

  return (
    <>
      {BLEACH_WORLDS.map((record) => {
        const gate = WORLD_GATES[record.id];
        /* Derin bölüm henüz yoksa bağlantı HİÇ çizilmiyor: ölü bir sayfa
           içi çapası, olmayan bir bağlantıdan kötüdür. */
        const enterReady =
          record.enter && READY_SECTIONS.has(record.enter.anchor.slice(1));

        return (
          <div key={record.id}>
            {gate ? (
              <Senkaimon to={record.id} kind={gate.kind} label={gate.label} />
            ) : null}

            <WorldSection
              layer={record.id}
              eyebrow={record.eyebrow}
              title={record.name}
              atmosphere={<Atmosphere layer={record.id} />}
            >
              <p className={`${world.body} ${styles.description}`}>
                {pick(record.description, locale)}
              </p>

              {/* Mekân listesi: kart değil, hairline ayraçlı satırlar.
                  Kutu koymak onları "içerik parçası" yapardı; bunlar
                  katmanın envanteri. */}
              <ul className={styles.places}>
                {record.places.map((place) => (
                  <li
                    key={pick(place.name, locale)}
                    className={styles.place}
                  >
                    {place.kanji ? (
                      <span className={styles.placeKanji} lang="ja">
                        {place.kanji}
                      </span>
                    ) : null}
                    <span className={`${world.meta} ${styles.placeName}`}>
                      {pick(place.name, locale)}
                    </span>
                  </li>
                ))}
              </ul>

              {enterReady && record.enter ? (
                <a className={styles.enter} href={record.enter.anchor}>
                  <span className={world.meta}>
                    {pick(record.enter.label, locale)}
                  </span>
                  <span aria-hidden="true">→</span>
                </a>
              ) : null}
            </WorldSection>
          </div>
        );
      })}

      {/* Katmanların bittiğini söyleyen tek satır. Sayfa burada durmuyor —
          Gotei 13, Zanpakutō arşivi ve kalanı sırayla gelecek. */}
      <p className={styles.next}>
        <span className={world.meta}>{t("moreComing")}</span>
      </p>
    </>
  );
}
