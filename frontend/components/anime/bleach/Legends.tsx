import { Fragment } from "react";
import { getTranslations } from "next-intl/server";
import { LEGEND_RECORDS } from "@/lib/anime/bleach/legends";
import { legendSlotId } from "@/lib/anime/bleach/slots";
import { pick } from "@/lib/anime/bleach/types";
import { CuratedImage } from "./CuratedImage";
import styles from "./Legends.module.css";
import world from "./world.module.css";

/**
 * P13 · BLEACH EFSANELERİ.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Naruto Evreni'nde bunun karşılığı **numaralı** bir kart dizisi. Burada
 * numara YOK: on isim arasında bir sıra değil bir **denge** var. Kart da
 * yok — tam genişlik satırlar, aralarında yalnızca birer hairline.
 *
 * ── İMZA ETKİLEŞİM: REİATSU ATMOSFERİ ────────────────────────────────────
 * Bir isme gelindiğinde satır değil **bütün bölüm** değişiyor: zemin o
 * karakterin reiatsu rengine doğru kayıyor (%12), diğer isimler geriye
 * çekiliyor, satırın arkasında dev kanji beliriyor ve sağda portresi
 * açılıyor.
 *
 * ── ⚠️ SIFIR JS — VE BUNU MÜMKÜN KILAN ŞEY BİR RADYO GRUBU ───────────────
 * Satırlar bir yere gitmiyor, yani `<a>` değiller; tıklayınca hiçbir şey
 * yapmayan bir `<button>` de yanlış olurdu. Doğru semantik **seçim**:
 * gizli bir radyo grubu + `<label>`. Kazanç üç katlı —
 *   • klavye desteği bedava (ok tuşlarıyla gezinme, seçim atmosferi sürer),
 *   • dokunmatikte hover olmadan da çalışıyor (dokun = seç),
 *   • aynı anda yalnızca birinin seçili olması tarayıcının garantisi.
 * P10'daki Blut anahtarının aynı deseni.
 *
 * ── ⚠️ %25 DEĞİL %55 ─────────────────────────────────────────────────────
 * Brief seçili olmayan isimlerin %25 opaklığa düşmesini istiyor. Ölçüldü:
 * kemik beyazı metin siyah zeminde %25'te ~2,4:1 veriyor, yani okunmuyor.
 * %55'te 4,95:1 — hâlâ belirgin biçimde "geride" ama okunabilir. Geri
 * çekilme hissinin ağırlığı ayraçlara ve künyelere yüklendi (onlar
 * metin değil, kırpılabilirler).
 *
 * ── PORTRELER KÜRATÖR YUVASINDA ──────────────────────────────────────────
 * Sayfanın sözleşmesi: çıplak `<Image>` yok. On yuva manifestoda zaten
 * tanımlı (`bleach:legend:<slug>`); boşken `typographic` yedeği çiziliyor,
 * yani bölüm ilk günden eksiksiz görünüyor.
 */
export async function Legends({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.bleach.legends" });

  /* On reiatsu rengi kökte: `:has()` kuralları bunları okuyor (P08'deki
     cero boyamasıyla aynı mekanizma). */
  const auraVars = Object.fromEntries(
    LEGEND_RECORDS.map((legend, i) => [`--aura-${i}`, legend.reiatsu]),
  ) as React.CSSProperties;

  return (
    <section id="legends" className={styles.section} aria-labelledby="legends-title">
      <div className={styles.head}>
        <p className={world.eyebrow} lang="en">
          {t("eyebrow")}
        </p>
        <h2 id="legends-title" className={world.section}>
          {t("title")}
        </h2>
        <p className={`${world.body} ${styles.lede}`}>{t("lede")}</p>
      </div>

      <div className={styles.stage} style={auraVars}>
        {/* Atmosfer katmanı: seçilen ismin rengi bütün sahneye yayılıyor.
            Açılış 500ms, geri dönüş 900ms — brief'in değerleri, asimetri
            kasıtlı (gelmesi hızlı, gitmesi ağır). */}
        <span className={styles.aura} aria-hidden="true" />

        <ol className={styles.names} aria-label={t("listAria")}>
          {LEGEND_RECORDS.map((legend, i) => (
            <li key={legend.slug} className={styles.row} data-i={i}>
              {/* Dev kanji satırın ARKASINDA ve satırdan taşıyor. */}
              <span className={styles.ghost} aria-hidden="true" lang="ja">
                {legend.kanji}
              </span>

              <input
                type="radio"
                name="legend"
                id={`legend-${legend.slug}`}
                className={styles.pick}
              />
              <label className={styles.line} htmlFor={`legend-${legend.slug}`}>
                <span className={styles.kanji} lang="ja">
                  {legend.kanji}
                </span>
                <span className={styles.name} lang="en">
                  {legend.name}
                </span>
                <span className={styles.epithet}>
                  {pick(legend.epithet, locale)}
                </span>
              </label>
            </li>
          ))}
        </ol>

        {/* ── PORTRE PANELİ ────────────────────────────────────────────
            Yapışkan: liste boyunca ekranda kalıyor. On panel de DOM'da
            (sayfanın "JS olmadan boş görünmez" kuralı); CSS yalnızca
            hangisinin görüneceğini seçiyor. */}
        <div className={styles.panels}>
          <div className={styles.panelBox}>
            <p className={`${world.meta} ${styles.hint}`}>{t("hint")}</p>

            {LEGEND_RECORDS.map((legend, i) => (
              <Fragment key={legend.slug}>
                <article className={styles.panel} data-i={i}>
                  <div className={styles.portrait}>
                    {/* ⚠️ `noEdit` KALKTI (29 Ağustos 2026, kullanıcı
                        bildirimi: "Efsaneler'de küratör modunda ekleme
                        görünmüyor"). İki ayrı sebeple görünmüyordu:

                          1. Kalem `noEdit` ile bastırılmıştı. Gerekçesi
                             yanlıştı — yuva bir `<button>`/`<a>` içinde
                             DEĞİL, panelin içinde duruyor; iç içe
                             etkileşimli öğe sorunu burada hiç yoktu.
                          2. Kalem çizilseydi bile ulaşılamazdı: on panelin
                             onu da `opacity: 0; visibility: hidden` ve
                             yalnızca satıra hover/seçim ile açılıyor.
                             Küratör kalemi görmek için satırın üstünde
                             durmak, yüklemek içinse fareyi panele
                             götürmek zorunda kalırdı — panel o an
                             kapanıyor.

                        Çözüm ikinci maddede: küratör modu açıkken on
                        portre yan yana, hepsi görünür bir ızgaraya
                        açılıyor (`Legends.module.css`). Ziyaretçinin
                        gördüğü davranış zerre değişmiyor. */}
                    <CuratedImage
                      slotId={legendSlotId(legend.slug)}
                      decorative
                      glyph={legend.kanji}
                      sizes="420px"
                    />
                  </div>
                  <p className={`${world.body} ${styles.bio}`}>
                    {pick(legend.bio, locale)}
                  </p>
                  <ul className={styles.tags}>
                    {legend.tags.map((tag) => (
                      <li key={tag} className={styles.tag} lang="ja">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </article>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
