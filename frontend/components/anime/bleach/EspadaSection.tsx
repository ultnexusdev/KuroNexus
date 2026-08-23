import { getTranslations } from "next-intl/server";
import { ESPADA, SCENE_ESPADA_RANK } from "@/lib/anime/bleach/espada";
import { pick } from "@/lib/anime/bleach/types";
import { EspadaCourt, type CourtItem } from "./EspadaCourt";
import styles from "./EspadaCourt.module.css";
import world from "./world.module.css";

/**
 * `EspadaCourt`in SUNUCU sarmalayıcısı — `Gotei13Section` / `BankaiSection`
 * ile aynı desen ve aynı gerekçe: istemci bileşenleri `getTranslations`
 * çağıramaz.
 *
 * ── ⚠️ NEDEN VERİ DE BURADA ÇÖZÜLÜYOR ────────────────────────────────────
 * `ESPADA` kaydı iki dili birden taşıyor. `EspadaCourt`a ham hâliyle
 * verilseydi kayıt istemci paketine girer ve okunmayan dil de kullanıcıya
 * inerdi. Burada seçilen dile indirgeniyor: aşağı yalnızca ekranda
 * görünecek dizeler geçiyor.
 *
 * ⚠️ Sonuç düz bir nesne dizisi — RSC sınırından işlev geçirilemiyor
 * (`Gotei13Section`de bir kez yaşandı).
 */
export async function EspadaSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.bleach.espada" });

  const items: CourtItem[] = ESPADA.map((record) => ({
    rank: record.rank,
    releasedRank: record.releasedRank,
    ordinal: record.ordinal,
    name: record.name,
    aspectKanji: record.aspect.kanji,
    aspectRomaji: record.aspect.romaji,
    aspectLabel: pick(record.aspect.label, locale),
    tattoo: record.tattoo ? pick(record.tattoo, locale) : null,
    ceroName: pick(record.cero.name, locale),
    ceroHex: record.cero.hex,
    ceroAttested: record.cero.attested,
    fragment: record.fragment,
    fragmentNote: pick(record.fragmentNote, locale),
    stages: record.stages.map((stage) => ({
      id: stage.id,
      kanji: stage.kanji,
      name: stage.name,
      text: pick(stage.text, locale),
    })),
  }));

  return (
    <section
      id="espada"
      /* P07'nin negatif derisi burada devam ediyor: Las Noches Hueco
         Mundo'nun içinde ve tema katman değiştirmiyor. */
      data-layer="hueco-mundo"
      className={styles.section}
      aria-labelledby="espada-title"
    >
      <div className={styles.head}>
        <p className={world.eyebrow} lang="en">
          {t("eyebrow")}
        </p>
        <h2 id="espada-title" className={world.section}>
          {t("title")}
        </h2>
        <p className={`${world.body} ${styles.lede}`}>{t("lede")}</p>
      </div>

      <EspadaCourt
        items={items}
        sceneRank={SCENE_ESPADA_RANK}
        labels={{
          throneName: t("throneName"),
          throneRole: t("throneRole"),
          courtAria: t("courtAria"),
          aspectOf: t("aspectOf"),
          cero: t("cero"),
          ceroUnknown: t("ceroUnknown"),
          tattoo: t("tattoo"),
          unknown: t("unknown"),
          fragmentLabel: t("fragmentLabel"),
          close: t("close"),
          sceneOpen: t("sceneOpen"),
          sceneAria: t("sceneAria"),
          sceneLine: t("sceneLine"),
          sceneClose: t("sceneClose"),
        }}
      />
    </section>
  );
}
