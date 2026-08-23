import { getTranslations } from "next-intl/server";
import { SOUL_HIERARCHY } from "@/lib/anime/bleach/hierarchy";
import { READY_SECTIONS } from "@/lib/anime/bleach/worlds";
import { pick } from "@/lib/anime/bleach/types";
import styles from "./SoulHierarchy.module.css";
import world from "./world.module.css";

/**
 * P06 · RUH HİYERARŞİSİ.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Bu bölüm bir liste değil, YUKARIDAN AŞAĞI BİR İNİŞ. Kullanıcı ruh
 * dünyasının tepesinden dibine düşüyor ve düştükçe **görsel kalite bilinçli
 * olarak bozuluyor**: Ruh Kralı'nın katı kusursuz hizalı, ince ve bol
 * boşluklu; Rukongai'ninki sıkışık, kaymış hizalı, dokusu gürültülü.
 * Eşitsizlik metinle SÖYLENMİYOR, tipografiyle gösteriliyor.
 *
 * ── SIFIR JS ─────────────────────────────────────────────────────────────
 * Bölümde tek satır istemci kodu yok. Kayan işaret düz `position: sticky`;
 * "şu an bu kattasın" vurgusu **scroll-driven CSS** ile (`animation-
 * timeline: view()`), depoda kanıtlanmış desen (`AkatsukiExhibit`).
 * Desteklemeyen tarayıcıda vurgu sönük durumda kalıyor, işaret çalışmaya
 * devam ediyor ve İÇERİK hiç etkilenmiyor — sunucu çıktısında zaten sekiz
 * katın hepsi tam metniyle var.
 *
 * ── ⚠️ RAY HESAPLA DEĞİL, YAPIYLA DOĞRU ──────────────────────────────────
 * İlk kurulumda duraklar rayda ÖNCEDEN HESAPLANMIŞ yüzdelere oturuyordu:
 * her kata svh cinsinden bir pay verilip kümülatif sınırlar çıkarılmıştı.
 * Ölçüldü ve tutmadı — katların gerçek yüksekliği içeriğe bağlı (Royal
 * Guard beş kayıt taşıyor, Rukongai dört) ve `min-height` çoğu katta
 * bağlayıcı olmuyor. Üçüncü kattan sonra ray bir durak ileri kayıyordu.
 *
 * Şimdiki kurulum hiçbir şey hesaplamıyor:
 *   • Durak, KATIN KENDİ İÇİNDE duruyor (mutlak konumlu, rayın çizgisine
 *     oturuyor). Kat nereye düşerse durak da oraya düşer.
 *   • Kayan işaret `position: sticky` ile ekranın ortasına çakılı; duraklar
 *     onun önünden geçiyor. Hangi iki durak arasındaysan oradasın.
 * İkisi de yüksekliklerden bağımsız, yani içerik büyüyünce bozulmuyor.
 *
 * ── NEDEN SUNUCU BİLEŞENİ ────────────────────────────────────────────────
 * `Gotei13Section` / `BankaiSection` sarmalayıcı deseni burada GEREKMİYOR:
 * istemci kodu olmadığı için `getTranslations` doğrudan çağrılabiliyor
 * (`WorldLayers` ile aynı).
 *
 * ── GÖRSEL YOK, BİLEREK ──────────────────────────────────────────────────
 * Sayfanın küratör sözleşmesi "çıplak `<Image>` yok" diyor; burada hiç
 * görsel yok. Bölümün argümanı tipografik ve bir portre onu zayıflatırdı —
 * hiyerarşiyi yüzlerle anlatmak, onu bir kadro listesine indirger.
 */
export async function SoulHierarchy({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.bleach.hierarchy" });

  return (
    <section
      id="hierarchy"
      /* İniş TEPEDEN başlıyor: bölümün derisi Reiōkyū. Central 46'dan
         aşağısı kendi `data-layer`ını taşıyor ve sayfa okurken Seireitei
         mürekkebine dönüyor — aksan kemik beyazından haori kızılına
         geçtiği an, iktidarın el değiştirdiği yer. */
      data-layer="royal"
      className={styles.section}
      aria-labelledby="hierarchy-title"
    >
      <div className={styles.head}>
        <p className={world.eyebrow} lang="en">
          {t("eyebrow")}
        </p>
        <h2 id="hierarchy-title" className={world.section}>
          {t("title")}
        </h2>
        <p className={`${world.body} ${styles.lede}`}>{t("lede")}</p>
      </div>

      <div className={styles.column}>
        {/* ── RAY ──────────────────────────────────────────────────────
            Yalnızca çizgi ve kayan işaret. Duraklar aşağıda, katların
            KENDİ içinde: yerleri içerikten geliyor, hesaptan değil.

            Tamamen dekoratif — ekran okuyucu aşağıdaki `<ol>`u zaten düz
            bir liste olarak okuyor, ray ikinci bir gezinme sunmuyor. */}
        <div className={styles.spine} aria-hidden="true">
          <span className={styles.line} />
          <span className={styles.marker} />
        </div>

        {/* ⚠️ DÜZ `<ol>`: brief'in kabul ölçütü. Görsel bozulmanın tamamı
            CSS; ekran okuyucu için sekiz sıralı madde, hepsi eşit
            okunaklılıkta. */}
        <ol className={styles.tiers} aria-label={t("descentAria")}>
          {SOUL_HIERARCHY.map((tier, i) => {
            const enterReady =
              tier.enter && READY_SECTIONS.has(tier.enter.anchor.slice(1));

            return (
              <li
                key={tier.id}
                className={styles.tier}
                data-tier={tier.id}
                data-voice={tier.voice}
                data-layer={tier.layer}
                style={
                  {
                    "--decay": `${decay(i)}`,
                    "--span": `${SPANS[i]}`,
                  } as React.CSSProperties
                }
              >
                {/* Rayın durağı ve katı raya bağlayan kısa çizgi. İkisi de
                    katın İÇİNDE: kat nereye düşerse durak da oraya düşüyor
                    (hesaplanmış bir yüzde tutmuyordu, bkz. dosya başlığı). */}
                <span className={styles.station} aria-hidden="true">
                  <span className={styles.dot} />
                  <span className={styles.stationKanji} lang="ja">
                    {tier.kanji}
                  </span>
                </span>
                <span className={styles.tick} aria-hidden="true" />

                <div className={styles.tierHead}>
                  <span className={styles.kanji} lang="ja">
                    {tier.kanji}
                  </span>
                  <div className={styles.names}>
                    <h3 className={styles.name} lang="en">
                      {tier.en}
                    </h3>
                    <p className={`${world.meta} ${styles.romaji}`}>
                      {tier.romaji}
                      {tier.also ? (
                        <>
                          <span className={styles.dotSep} aria-hidden="true">
                            /
                          </span>
                          <span lang="ja">{tier.also}</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>

                <p className={`${world.body} ${styles.text}`}>
                  {pick(tier.description, locale)}
                </p>

                {tier.scale ? (
                  <p className={`${world.meta} ${styles.scale}`}>
                    {pick(tier.scale, locale)}
                  </p>
                ) : null}

                {/* Adlandırılmamış katta (Central 46) liste hiç çizilmiyor:
                    boş bir başlık, olmayan bir kayıttan kötüdür. */}
                {tier.figures.length > 0 ? (
                  <ul className={styles.figures}>
                    {tier.figures.map((figure) => (
                      <li key={figure.name} className={styles.figure}>
                        <span className={styles.figureName}>{figure.name}</span>
                        <span className={styles.figureNote}>
                          {pick(figure.note, locale)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {enterReady && tier.enter ? (
                  <a className={styles.enter} href={tier.enter.anchor}>
                    <span className={world.meta}>
                      {pick(tier.enter.label, locale)}
                    </span>
                    <span aria-hidden="true">↓</span>
                  </a>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   BOZULMA ÖLÇEĞİ

   Tek sayı: `--decay`. 0 = tepe (kusursuz), 1 = dip (bozuk). Boşluk,
   hizalama, harf aralığı, çizgi ve doku hepsi CSS'te ondan açılıyor.

   `--span` ise katın en az ne kadar yer kaplayacağı: tepede yarım ekran,
   dipte bir el. En az — çünkü içerik taşarsa kat büyüyor ve büyümesi
   gerekiyor. Ray artık bu sayılara bağlı DEĞİL (bkz. dosya başlığı),
   yani taşma bir hizalama hatasına dönüşmüyor.
   ══════════════════════════════════════════════════════════════════════ */

/** Kat sayısı — sekiz. */
const N = SOUL_HIERARCHY.length;

/** 0 (tepe, kusursuz) → 1 (dip, bozuk). Bütün bozulma bundan türüyor. */
function decay(i: number): number {
  return N > 1 ? i / (N - 1) : 0;
}

/** En üst katın taban payı (svh) — yarım ekrandan biraz fazlası. */
const TOP_SPAN = 52;
/** En alt katın taban payı (svh) — yalnızca içeriği kadar. */
const BOTTOM_SPAN = 10;

/** Kat başına dikey taban pay. */
const SPANS = SOUL_HIERARCHY.map((_, i) =>
  Number((TOP_SPAN - (TOP_SPAN - BOTTOM_SPAN) * decay(i)).toFixed(3)),
);
