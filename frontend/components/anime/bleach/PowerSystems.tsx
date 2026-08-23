import { Fragment } from "react";
import { getTranslations } from "next-intl/server";
import {
  BLUT_MODES,
  CORE_TRIO,
  HOLLOW_POWERS,
  KIDO_SPELLS,
  QUINCY_NODES,
  SHINIGAMI_ARTS,
  SHINIGAMI_BLADE,
} from "@/lib/anime/bleach/powers";
import { pick } from "@/lib/anime/bleach/types";
import styles from "./PowerSystems.module.css";
import world from "./world.module.css";

/**
 * P10 · RUHSAL GÜÇ SİSTEMİ.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Naruto Evreni'nde bunun karşılığı tek bir şema: chakra ve doğa
 * dönüşümü. Bleach'te **üç ırk, üç güç sistemi ve üç ayrı tasarım dili**
 * var. Aynı bölümde üç farklı görsel gramerin bulunması bölümün tezi:
 * bu güçler birbirine benzemiyor ve benzer gösterilmemeli.
 *
 * ── ⚠️ ÜÇ SÜTUN, ÜÇ MEVCUT DERİ ──────────────────────────────────────────
 * Yeni bir palet icat edilmedi. Sütunlar sayfanın zaten ölçülmüş
 * katmanlarını giyiyor:
 *   死神   → `soul-society` (mürekkep + haori kızılı)
 *   虚     → `hueco-mundo`  (NEGATİF: beyaz zemin, siyah metin)
 *   滅却師 → `wandenreich`  (gotik buz + altın)
 * Bölümün kendisi katmansız — brief'in "dünya: nötr" şartı — ve taban
 * deri `[data-world="bleach"]`. Üç sütunun üç farklı token seti var ama
 * hepsi aynı `--measure`ı ve aynı dikey ritmi kullanıyor: kaos değil,
 * disiplinli farklılık.
 *
 * ── ⚠️ SIFIR JS — BLUT DAHİL ─────────────────────────────────────────────
 * Brief Blut için "iki düğümlü bir toggle, biri açıkken diğeri söner"
 * istiyor. Canon kuralı Urahara'nın ağzından: saldırı ve savunma iki ayrı
 * reishi sistemi ve **aynı anda açılamıyorlar**.
 *
 * Bu kural bir `<input type="radio">` grubunun ta kendisi. Tarayıcı zaten
 * "biri açılınca diğeri kapanır" diye çalışıyor; kuralı JS'le taklit etmek
 * yerine semantiğe bırakmak hem daha az kod hem de klavyeyle (ok tuşları)
 * kendiliğinden gezilebilir. Bölümde tek satır istemci kodu yok.
 *
 * ── DOKUNMATİKTE HOVER YOK ───────────────────────────────────────────────
 * Kidō formülleri geniş ekranda hover/odakla açılıyor; `hover: none` olan
 * cihazlarda **baştan açık** duruyor. `BankaiHall`de öğrenilen ders:
 * yalnızca hover'la görünen bilgi dokunmatikte hiç yok demektir.
 */
export async function PowerSystems({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.bleach.powers" });

  return (
    <section
      id="powers"
      /* ⚠️ `data-layer` YOK: bölüm nötr, deri sütunların kendisinde. */
      className={styles.section}
      aria-labelledby="powers-title"
    >
      <div className={styles.head}>
        <p className={world.eyebrow} lang="en">
          {t("eyebrow")}
        </p>
        <h2 id="powers-title" className={world.section}>
          {t("title")}
        </h2>
        <p className={`${world.body} ${styles.lede}`}>{t("lede")}</p>
      </div>

      {/* ── OMURGA: ÜÇ SÖZCÜK ───────────────────────────────────────────
          Sütunlardan önce geliyorlar çünkü üçü karıştırıldığında geri
          kalan her şey bulanıklaşıyor. */}
      <dl className={styles.trio}>
        {CORE_TRIO.map((item) => (
          <div key={item.kanji} className={styles.trioItem}>
            <dt>
              <span className={styles.trioKanji} lang="ja">
                {item.kanji}
              </span>
              <span className={`${world.meta} ${styles.trioRomaji}`}>
                {item.romaji}
              </span>
            </dt>
            <dd className={`${world.body} ${styles.trioText}`}>
              {pick(item.text, locale)}
            </dd>
          </div>
        ))}
      </dl>

      {/* ── ÜÇ ADA ──────────────────────────────────────────────────────
          Aralarında dikey hairline YOK: birbirine değmeyen üç ada,
          aralarında boşluk (brief). */}
      <div className={styles.columns}>
        {/* ── 死神 — MÜREKKEP ────────────────────────────────────────── */}
        <article className={styles.column} data-layer="soul-society" data-race="shinigami">
          <header className={styles.columnHead}>
            <span className={styles.columnKanji} lang="ja">
              死神
            </span>
            <h3 className={styles.columnName} lang="en">
              SHINIGAMI
            </h3>
            <p className={`${world.meta} ${styles.columnNote}`}>
              {t("shinigamiNote")}
            </p>
          </header>

          {/* Kılıç ayrı: bir sanat değil, bir silah. */}
          <div className={styles.blade}>
            <p className={styles.powerHead}>
              <span className={styles.powerKanji} lang="ja">
                {SHINIGAMI_BLADE.kanji}
              </span>
              <span className={styles.powerRomaji}>
                {SHINIGAMI_BLADE.romaji}
              </span>
            </p>
            <p className={styles.powerText}>
              {pick(SHINIGAMI_BLADE.text, locale)}
            </p>
          </div>

          <p className={`${world.meta} ${styles.artsLabel}`}>
            <span lang="ja">「斬」「拳」「走」「鬼」</span>
            <span aria-hidden="true"> · </span>
            {t("zankensoki")}
          </p>

          <ul className={styles.powers}>
            {SHINIGAMI_ARTS.map((art) => (
              <li key={art.kanji} className={styles.power}>
                <p className={styles.powerHead}>
                  <span className={styles.powerKanji} lang="ja">
                    {art.kanji}
                  </span>
                  <span className={styles.powerRomaji}>{art.romaji}</span>
                </p>
                <p className={styles.powerText}>{pick(art.text, locale)}</p>

                {/* Kidō'ya özel: numaralı formüller. Geniş ekranda
                    hover/odakla açılıyor, dokunmatikte baştan açık. */}
                {/* ⚠️ SARMALAYICI ŞART. Kapanmayı taşıyan ızgaranın TEK
                    çocuğu olmalı: `grid-template-rows: 0fr` yalnızca ilk
                    satırı boyutlandırıyor, üç `<li>`nin diğer ikisi örtük
                    satır olarak açık kalıyordu (ölçüldü: kapalı olması
                    gereken liste 102px yüksekliğindeydi). */}
                {art.romaji === "Kidō" ? (
                  <div className={styles.spellsWrap}>
                  <ul className={styles.spells}>
                    {KIDO_SPELLS.map((spell) => (
                      <li key={spell.romaji} className={styles.spell}>
                        <span className={`${world.numeral} ${styles.spellNo}`}>
                          {spell.number}
                        </span>
                        <span className={styles.spellBranch} lang="ja">
                          {spell.branch === "hado" ? "破道" : "縛道"}
                        </span>
                        <span className={styles.spellKanji} lang="ja">
                          {spell.kanji}
                        </span>
                        <span className={styles.spellName}>{spell.romaji}</span>
                        <span className={styles.spellMeaning}>
                          {pick(spell.meaning, locale)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </article>

        {/* ── 虚 — BOŞLUK (NEGATİF) ──────────────────────────────────── */}
        <article className={styles.column} data-layer="hueco-mundo" data-race="hollow">
          <header className={styles.columnHead}>
            <span className={styles.columnKanji} lang="ja">
              虚
            </span>
            <h3 className={styles.columnName} lang="en">
              HOLLOW
            </h3>
            <p className={`${world.meta} ${styles.columnNote}`}>
              {t("hollowNote")}
            </p>
          </header>

          {/* Güçler daire içinde değil DELİKTEN çıkıyor: her satırın
              solunda bir Hollow deliği duruyor ve ad ondan doğuyor. */}
          <ul className={`${styles.powers} ${styles.holes}`}>
            {HOLLOW_POWERS.map((item) => (
              <li key={item.kanji} className={styles.power}>
                <p className={styles.powerHead}>
                  <span className={styles.hole} aria-hidden="true" />
                  <span className={styles.powerKanji} lang="ja">
                    {item.kanji}
                  </span>
                  <span className={styles.powerRomaji}>{item.romaji}</span>
                </p>
                <p className={styles.powerText}>{pick(item.text, locale)}</p>
              </li>
            ))}
          </ul>
        </article>

        {/* ── 滅却師 — GEOMETRİ ──────────────────────────────────────── */}
        <article className={styles.column} data-layer="wandenreich" data-race="quincy">
          <header className={styles.columnHead}>
            <span className={styles.columnKanji} lang="ja">
              滅却師
            </span>
            <h3 className={styles.columnName} lang="en">
              QUINCY
            </h3>
            <p className={`${world.meta} ${styles.columnNote}`}>
              {t("quincyNote")}
            </p>
          </header>

          {/* Pentagram: yalnızca çizgiler. Adlar SVG'nin içinde değil
              üstünde — SVG metni ölçekle birlikte okunmaz hâle gelirdi. */}
          <div className={styles.star}>
            <svg
              className={styles.starLines}
              viewBox="0 0 100 100"
              aria-hidden="true"
              role="presentation"
            >
              <polygon
                className={styles.starPentagon}
                points="50,10 88,37.6 73.5,82.4 26.5,82.4 12,37.6"
              />
              <polygon
                className={styles.starPentagram}
                points="50,10 73.5,82.4 12,37.6 88,37.6 26.5,82.4"
              />
            </svg>

            <ul className={styles.nodes}>
              {QUINCY_NODES.map((node) => (
                <li
                  key={node.id}
                  className={styles.node}
                  style={
                    { "--x": `${node.x}%`, "--y": `${node.y}%` } as React.CSSProperties
                  }
                >
                  <span className={styles.nodeDot} aria-hidden="true" />
                  <span className={styles.nodeKanji} lang="ja">
                    {node.kanji}
                  </span>
                  <span className={styles.nodeName}>{node.romaji}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Düğümlerin metni şemanın altında: yıldızın üstünde beş
              paragraf okunmazdı. */}
          <ul className={styles.powers}>
            {QUINCY_NODES.map((node) => (
              <li key={node.id} className={styles.power}>
                <p className={styles.powerHead}>
                  <span className={styles.powerKanji} lang="ja">
                    {node.kanji}
                  </span>
                  <span className={styles.powerRomaji}>{node.romaji}</span>
                </p>
                <p className={styles.powerText}>{pick(node.text, locale)}</p>
              </li>
            ))}
          </ul>

          {/* ── BLUT ANAHTARI ────────────────────────────────────────
              ⚠️ Canon kuralı doğrudan semantiğe bırakıldı: bir radyo
              grubunda ikisi aynı anda açık olamaz. JS ile taklit
              edilmedi. */}
          <fieldset className={styles.blut}>
            <legend className={`${world.meta} ${styles.blutLegend}`}>
              {t("blutLegend")}
            </legend>
            {/* ⚠️ GİRDİ ETİKETİN İÇİNDE DEĞİL, KARDEŞİ. Sarmalanmış bir
                girdiyle etiketi boyamak `:has()` gerektiriyor; kardeş
                yazımda `input:checked + label` yetiyor. İkisi de doğru
                çalışıyor, kardeş olan tercih edildi: hiçbir yeni seçici
                özelliğine bağlı değil. */}
            <div className={styles.blutModes}>
              {BLUT_MODES.map((mode, i) => (
                <Fragment key={mode.id}>
                  <input
                    type="radio"
                    id={`blut-${mode.id}`}
                    name="blut"
                    value={mode.id}
                    defaultChecked={i === 0}
                    className={styles.blutInput}
                  />
                  <label className={styles.blutMode} htmlFor={`blut-${mode.id}`}>
                    <span className={styles.blutKanji} lang="ja">
                      {mode.kanji}
                    </span>
                    <span className={styles.blutName}>{mode.romaji}</span>
                    <span className={styles.blutRole}>
                      {pick(mode.role, locale)}
                    </span>
                  </label>
                </Fragment>
              ))}
            </div>
            <p className={styles.blutRule}>{t("blutRule")}</p>
          </fieldset>
        </article>
      </div>
    </section>
  );
}
