import { getTranslations } from "next-intl/server";
import { GREAT_HOUSES, HOUSES } from "@/lib/anime/bleach/houses";
import { pick } from "@/lib/anime/bleach/types";
import styles from "./NobleHouses.module.css";
import world from "./world.module.css";

/**
 * P14 · ASİL HANELER.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Naruto Evreni'ndeki "Klanlar"ın karşılığı ama **bilinçli olarak daha
 * küçük**. Bleach'te klanlar Naruto'daki kadar merkezi değil ve bölüm bunu
 * tasarımla itiraf ediyor: yatay, kompakt, altı işaret. Büyük bir soy
 * ağacı YOK — brief'in açık talimatı ve bölümün toplam yüksekliği bu tezin
 * parçası.
 *
 * ── ⚠️ ALT BLOK BÖLÜMÜN ASIL SEBEBİ ──────────────────────────────────────
 * Dört Büyük Asil Hane'nin **ikisinin adı canon'da hiç açıklanmadı**.
 * Wiki'nin o iki hane için tek cümlesi var: "No information about this
 * house has been revealed." Bunu bir eksiklik gibi saklamak yerine
 * **redakte edilmiş bir kayıt** olarak göstermek hem canon'a sadık hem de
 * bu sitenin kimliğine uygun.
 *
 * Redakte bloklar hover'da titriyor ama AÇILMIYOR. Açılacak bir şey yok
 * ve bunu numaradan ibaret bir gizem gibi göstermek yalan olurdu.
 *
 * ── SIFIR JS ─────────────────────────────────────────────────────────────
 * İşaretin dolması, künyenin açılması ve redakte titremesi CSS
 * hover/odak. Tek satır istemci kodu yok.
 *
 * ── ⚠️ ARMALAR CANON DEĞİL ───────────────────────────────────────────────
 * Canon bu hanelerin çoğu için bir *mon* yayımlamıyor. Altı işaret
 * uydurulmuş bir "gerçek arma" değil; her biri hanenin **canon'daki
 * uzmanlığından** türetildi ve bölüm bunu açıkça yazıyor. Gerekçe
 * `houses.ts` başlığında.
 */

/* ══════════════════════════════════════════════════════════════════
   ALTI İŞARET — hepsi 0 0 72 72, tek `d`, `fill-rule="evenodd"`
   Sayfanın maske grameriyle aynı yazım (P07/P08/P11).
   ══════════════════════════════════════════════════════════════════ */

/** 朽木 — kayıt tutan hane: bir kiraz çiçeği (Senbonzakura) */
const BLOSSOM =
  "M36 6c5 9 5 15 0 21-5-6-5-12 0-21ZM66 28c-8 6-14 7-21 4 6-6 12-7 21-4ZM54 62c-9-3-13-8-14-15 8 2 12 7 14 15ZM18 62c2-8 6-13 14-15-1 7-5 12-14 15ZM6 28c9-3 15-2 21 4-7 3-13 2-21-4Z" +
  "M36 30a6 6 0 1 0 .01 0Z";

/** 四楓院 — dört akçaağaç yaprağı, dörtlü dönme simetrisi */
const MAPLE =
  "M36 4 44 18l10-4-4 12 14 2-10 10 10 10-14 2 4 12-10-4-8 14-8-14-10 4 4-12-14-2 10-10-10-10 14-2-4-12 10 4Z" +
  "M36 26a10 10 0 1 0 .01 0Z";

/** 志波 — havai fişek: merkezden dağılan ışınlar */
const BURST =
  "M36 36 34 4h4ZM36 36 68 34v4ZM36 36 38 68h-4ZM36 36 4 38v-4Z" +
  "M36 36 58 12l3 3ZM36 36 60 58l-3 3ZM36 36 14 60l-3-3ZM36 36 12 14l3-3Z" +
  "M36 32a4 4 0 1 0 .01 0Z";

/** 綱彌代 — gözetleme ve kayıt: açılmış bir tomar */
const SCROLL =
  "M10 14h52v44H10Zm6 6v32h40V20Z" +
  "M22 28h28v3H22ZM22 36h28v3H22ZM22 44h20v3H22Z" +
  "M6 10h8v52H6ZM58 10h8v52h-8Z";

/** 大前田 — varlık: üst üste dizilmiş külçeler */
const COIN =
  "M20 44h32l6 12H14Zm6 4-2 4h24l-2-4Z" +
  "M26 30h20l5 10H21Zm5 4-2 2h10l-2-2Z" +
  "M31 18h10l4 8H27Z";

/** 伊勢 — şinto ayinleri: bir torii ve sarkan shide */
const TORII =
  "M6 14h60v6H6ZM12 24h48v5H12Z" +
  "M18 24h6v44h-6ZM48 24h6v44h-6Z" +
  "M34 30h4v10h-4ZM32 42h8v4h-8ZM34 48h4v8h-4Z";

const MON: Record<string, string> = {
  blossom: BLOSSOM,
  maple: MAPLE,
  burst: BURST,
  scroll: SCROLL,
  coin: COIN,
  torii: TORII,
};

export async function NobleHouses({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.bleach.houses" });

  return (
    <section
      id="houses"
      data-layer="soul-society"
      className={`${styles.section} ${world.deferPaint}`}
      aria-labelledby="houses-title"
    >
      <div className={styles.head}>
        <p className={world.eyebrow} lang="en">
          {t("eyebrow")}
        </p>
        <h2 id="houses-title" className={world.section}>
          {t("title")}
        </h2>
        <p className={`${world.body} ${styles.lede}`}>{t("lede")}</p>
      </div>

      <ul className={styles.row} aria-label={t("rowAria")}>
        {HOUSES.map((house) => (
          <li key={house.id} className={styles.house}>
            <svg
              className={styles.mon}
              viewBox="0 0 72 72"
              aria-hidden="true"
              role="presentation"
            >
              <path d={MON[house.mon]} fillRule="evenodd" />
            </svg>

            <p className={styles.houseName} lang="en">
              {house.name}
            </p>
            <p className={styles.houseKanji} lang="ja">
              {house.kanji}
            </p>

            {/* ⚠️ Sarmalayıcı ŞART: kapanmayı taşıyan ızgaranın tek çocuğu
                olmalı ve o çocukta `min-height: 0` bulunmalı. İkisinden
                biri eksikse kapanma sessizce olmuyor (P11'de ölçüldü). */}
            <div className={styles.detailWrap}>
              <div className={styles.detail}>
                <p className={styles.role}>{pick(house.role, locale)}</p>
                {house.note ? (
                  <p className={styles.note}>{pick(house.note, locale)}</p>
                ) : null}
                <p className={styles.members}>
                  <span className={world.meta}>{t("members")}</span>
                  {house.members.join(" · ")}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* ── ALT BLOK: DÖRT BÜYÜK ASİL HANE ──────────────────────────────
          Ayrı, daha karanlık ve daha küçük. Bölümün asıl sebebi burada. */}
      <div className={styles.great}>
        <p className={styles.greatKanji} lang="ja">
          {GREAT_HOUSES.kanji}
        </p>
        <p className={`${world.eyebrow} ${styles.greatTitle}`}>
          {t("greatTitle")}
        </p>

        <ul className={styles.greatList}>
          {GREAT_HOUSES.named.map((name) => (
            <li key={name} className={styles.greatName}>
              {name}
            </li>
          ))}
          {Array.from({ length: GREAT_HOUSES.redacted }, (_, i) => (
            <li
              key={`redacted-${i}`}
              className={styles.redacted}
              /* ⚠️ Brief'in kabul ölçütü: ekran okuyucu bir blok görmüyor,
                 bir KAYIT DURUMU duyuyor. */
              aria-label={t("redactedAria")}
            >
              <span aria-hidden="true">▓▓▓▓▓▓▓</span>
            </li>
          ))}
        </ul>

        <p className={`${world.body} ${styles.greatNote}`}>{t("greatNote")}</p>
      </div>

      <p className={`${world.meta} ${styles.monNote}`}>{t("monNote")}</p>
    </section>
  );
}
