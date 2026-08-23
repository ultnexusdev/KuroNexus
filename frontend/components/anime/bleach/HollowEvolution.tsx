import { getTranslations } from "next-intl/server";
import { HOLLOW_STAGES } from "@/lib/anime/bleach/hollow";
import { pick } from "@/lib/anime/bleach/types";
import { HollowMask } from "./HollowMask";
import styles from "./HollowEvolution.module.css";
import world from "./world.module.css";

/**
 * P07 · HUECO MUNDO — MASKENİN KIRILIŞI.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Brief'in cümlesi: **"Evrim şeması bir ağaç değil, bir maskenin
 * kırılmasıdır."** Yedi aşama dallanmıyor, tek bir nesnenin başına gelenler
 * gibi sıralanıyor. Ekranın ortasında maske duruyor; kullanıcı indikçe
 * maske devleşiyor, daralıyor, çatlıyor ve kırılıyor.
 *
 * ── SAYFANIN EN CESUR KARARI ─────────────────────────────────────────────
 * Bölüm `data-layer="hueco-mundo"` taşıyor ve **sayfa negatife dönüyor**:
 * zemin beyaz, metin siyah. Buraya kadar her şey koyuydu. Renk kararı
 * `globals.css`te ve kontrastı ölçülü (kural 16) — burada tek hex yok.
 *
 * ── ÜST BÖLÜM NEREDE ─────────────────────────────────────────────────────
 * Brief P07'nin "üst bölümü" (boş beyaz ekran, kum çizgisi, kemik ağacı,
 * konturlu ay, mekân listesi) **zaten var**: P02'deki `hueco-mundo`
 * katmanı tam olarak o. İkinci bir kopyasını çizmek sayfayı iki kez aynı
 * şeyi söyler hâle getirirdi. Bu bölüm katmanın açtığı kapının ardı:
 * "Boşluğa in" bağlantısı buraya geliyor.
 *
 * ── ⚠️ NEDEN HER AŞAMA KENDİ MASKESİNİ TAŞIYOR ───────────────────────────
 * Tek bir yapışkan maske kutusu kurup yedi durumu içine yığmak daha az
 * kod olurdu, ama o zaman "hangi durum şu an" sorusunu **kardeş** bir
 * öğeye sormak gerekirdi ve bu ancak `timeline-scope` ile çözülür.
 * Desteklemeyen bir tarayıcıda hiçbir maske görünmezdi — sessiz ve tam
 * bir kayıp.
 *
 * Bunun yerine her aşama kendi maskesini kendi içinde, `position: sticky`
 * ile taşıyor. Aşama ekrandayken maske ortada duruyor; aşama biterken
 * yerini bir sonrakine bırakıyor. Destek yoksa maske tam opaklıkta kalır,
 * yalnızca geçiş yumuşaklığı gider. P06'daki dersin aynısı: göstergeyi
 * **yapıya** bağla.
 *
 * ── SIFIR JS ─────────────────────────────────────────────────────────────
 * Tek satır istemci kodu yok. Geçiş `animation-timeline: view()`;
 * başlıktaki yedi bağlantı ise düz sayfa içi çapa — hareket kısıtlı
 * kipte de, JS gelmese de aşamalar arasında gezinmenin yolu duruyor
 * (brief'in `prefers-reduced-motion` ölçütü).
 *
 * ── GÖRSEL YOK, BİLEREK ──────────────────────────────────────────────────
 * Küratör sözleşmesi "çıplak `<Image>` yok" diyor; burada hiç görsel yok.
 * Maske bir fotoğraf değil bir ŞEMA olmalı: yedi durumu aynı çizim diliyle
 * yan yana koyabilmenin tek yolu onları kendimiz çizmek.
 */
export async function HollowEvolution({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.bleach.hollow" });
  const total = String(HOLLOW_STAGES.length).padStart(2, "0");

  return (
    <section
      id="hueco"
      data-layer="hueco-mundo"
      className={styles.section}
      aria-labelledby="hueco-title"
    >
      <div className={styles.head}>
        <p className={world.eyebrow} lang="en">
          {t("eyebrow")}
        </p>
        <h2 id="hueco-title" className={world.section}>
          {t("title")}
        </h2>
        <p className={`${world.body} ${styles.lede}`}>{t("lede")}</p>

        {/* Yedi aşamanın dizini. Kaydırmaya bağlı hiçbir şeye ihtiyacı yok:
            düz sayfa içi çapalar. Hareket kısıtlı kipte bölümde gezinmenin
            yolu bu, normal kipte de bir içindekiler. */}
        <nav className={styles.index} aria-label={t("indexAria")}>
          <ol className={styles.indexList}>
            {HOLLOW_STAGES.map((stage) => (
              <li key={stage.id}>
                <a className={styles.indexLink} href={`#hollow-${stage.id}`}>
                  <span className={styles.indexKanji} lang="ja">
                    {stage.kanji}
                  </span>
                  <span className={`${world.meta} ${styles.indexName}`} lang="en">
                    {stage.en}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Düz bir `<ol>`: yedi sıralı madde. Maskenin bütün hikâyesi CSS'te,
          okuma sırası burada. */}
      <ol className={styles.stages} aria-label={t("stagesAria")}>
        {HOLLOW_STAGES.map((stage, i) => (
          <li
            key={stage.id}
            id={`hollow-${stage.id}`}
            className={styles.stage}
            data-stage={stage.id}
          >
            <div className={styles.art}>
              <div className={styles.artInner}>
                <HollowMask stage={stage.id} />
              </div>
            </div>

            <div className={styles.copy}>
              <p className={`${world.meta} ${styles.counter}`}>
                {String(i + 1).padStart(2, "0")}
                <span className={styles.counterSep} aria-hidden="true">
                  /
                </span>
                {total}
              </p>

              <p className={styles.kanji} lang="ja">
                {stage.kanji}
                {stage.kana ? (
                  <span className={styles.kana} lang="ja">
                    {stage.kana}
                  </span>
                ) : null}
              </p>

              <h3 className={styles.name} lang="en">
                {stage.en}
              </h3>
              <p className={`${world.meta} ${styles.romaji}`}>{stage.romaji}</p>

              <p className={`${world.body} ${styles.text}`}>
                {pick(stage.description, locale)}
              </p>

              {/* Evrimin bedeli. Açıklamadan ayrı duruyor çünkü bölümün asıl
                  bilgisi bu: her basamak bir yasakla korunuyor. */}
              {stage.rule ? (
                <p className={styles.rule}>{pick(stage.rule, locale)}</p>
              ) : null}

              <ul className={styles.figures}>
                {stage.figures.map((figure) => (
                  <li key={figure.name} className={styles.figure}>
                    <span className={styles.figureName}>{figure.name}</span>
                    <span className={styles.figureNote}>
                      {pick(figure.note, locale)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
