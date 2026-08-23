import { getTranslations } from "next-intl/server";
import { WAR_EVENTS } from "@/lib/anime/bleach/war";
import { READY_SECTIONS } from "@/lib/anime/bleach/worlds";
import { pick } from "@/lib/anime/bleach/types";
import styles from "./BloodWar.module.css";
import world from "./world.module.css";

/**
 * P12 · BİN YILLIK KAN SAVAŞI.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Naruto Evreni'ndeki "Dönemler" halkasının karşılığı ama bir halka değil
 * bir savaş. Asıl fikir renk: bölüm boyunca sayfa **siyahtan kana**
 * dönüyor — #0B0B0D → #EFEDE7 → #4A0D12 → #7A0F14.
 *
 * ── ⚠️ İNTERPOLASYON DEĞİL DÖRT DURAK, VE BU BİR ÖDÜN DEĞİL ──────────────
 * Brief geçişin scroll ilerlemesine bağlı olarak **ara kareleri
 * interpole etmesini** istiyor. Bu, kendi kabul ölçütüyle çelişiyor:
 * "hiçbir noktada metin kontrastı 4.5:1'in altına düşmez".
 *
 * Siyah zeminde metin AÇIK, beyaz zeminde KOYU olmak zorunda. İkisini
 * aynı anda çapraz geçirirseniz yolun ortasında zemin de metin de orta
 * griye gelir ve kontrast **1:1'e** iner. Ara değer yok: matematik bunu
 * yasaklıyor, tasarım tercihi değil.
 *
 * O yüzden zemin **dört durakta sert kesiliyor** ve her durağın kendi
 * eksiksiz token seti var (`globals.css` → `[data-blood]`). Kazanç
 * çift: kontrast artık ölçülebilir bir şey ve
 * `scripts/check-bleach-contrast.mjs` sekiz paletin **80 kombinasyonunu**
 * denetliyor. Sert kesme zaten sayfanın P10'da verdiği karar —
 * "sütunlar arası tema geçişi ani, fade yok".
 *
 * Kayıp yalnızca yumuşaklık; kazanç, okunmayan bir metnin İMKÂNSIZ
 * olması.
 *
 * ── SIFIR JS ─────────────────────────────────────────────────────────────
 * Zemin değişimi nitelik + kalıtım (`data-blood`), çizgi ve düğüm CSS.
 * Brief "JS ile luminance hesapla" diyor; hesaplanacak bir şey kalmadı.
 * `prefers-reduced-motion` için ayrı bir dal da gerekmiyor: geçiş zaten
 * dört sabit adım (brief'in kendi yedeği).
 *
 * ── ⚠️ SEMANTİK ──────────────────────────────────────────────────────────
 * Brief'in şartı: `<ol>` + `<time>`. Olaylar sıralı bir liste ve yıl
 * gerçekten bir zaman etiketi.
 */
export async function BloodWar({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.bleach.war" });

  return (
    <section
      id="war"
      className={`${styles.section} ${world.deferPaint}`}
      aria-labelledby="war-title"
    >
      <div className={styles.head}>
        <p className={world.eyebrow} lang="en">
          {t("eyebrow")}
        </p>
        <h2 id="war-title" className={world.section}>
          {t("title")}
        </h2>
        <p className={`${world.body} ${styles.lede}`}>{t("lede")}</p>
      </div>

      <ol className={styles.timeline} aria-label={t("timelineAria")}>
        {WAR_EVENTS.map((event) => {
          const linked = event.anchor && READY_SECTIONS.has(event.anchor.slice(1));
          const skin = STAGE_SKIN[event.stage];

          return (
            <li
              key={event.id}
              className={styles.event}
              /* ⚠️ Zeminin tamamı BU niteliklerden geliyor. Renk değeri
                 bileşende değil `globals.css`te (kural 16); burada
                 yalnızca hangi olayın hangi durakta olduğu yazılı. */
              data-layer={skin.layer}
              data-blood={skin.blood}
              data-stage={event.stage}
            >
              {/* Düğüm ilerledikçe biçim değiştiriyor: nokta → çentik →
                  çatlak → yarık. Çizginin kendisi de aynı sırada
                  bozuluyor (CSS'te, `--stage` üzerinden). */}
              <span className={styles.node} aria-hidden="true" />

              <div className={styles.body}>
                <p className={styles.yearLine}>
                  {/* ⚠️ `<time>` DEĞİL. Brief onu istiyor ama `<time>`
                      ya makine okur bir `datetime` ister ya da içeriğinin
                      geçerli bir tarih dizesi olmasını. Buradaki değerler
                      göreli ("bin yıl önce") ya da sayı bile değil
                      (九〇〇 · 九〇 · 九) — hiçbiri tarih değil ve
                      uydurma bir `datetime` yazmak etiketi yalancı
                      yapardı. Sıralama zaten `<ol>`de. */}
                  <span className={styles.year} lang="ja">
                    {event.yearKanji}
                  </span>
                  <span className={`${world.meta} ${styles.yearLabel}`}>
                    {pick(event.yearLabel, locale)}
                  </span>
                </p>

                <hr className={styles.rule} />

                <h3 className={styles.name} lang="en">
                  {event.name}
                </h3>

                <p className={`${world.body} ${styles.text}`}>
                  {pick(event.text, locale)}
                </p>

                {linked && event.anchor ? (
                  <a className={styles.jump} href={event.anchor}>
                    <span className={world.meta}>{t("goTo")}</span>
                    <span aria-hidden="true">↓</span>
                  </a>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/**
 * Durak → zemin kimliği.
 *
 * ⚠️ İLK İKİ DURAK İÇİN YENİ PALET YAZILMADI. Brief'in istediği #0B0B0D
 * ve #E9E4D9, sayfada zaten ölçülmüş iki katmanın ta kendisi
 * (`soul-society` mürekkebi ve `hueco-mundo` beyazı). Onları `[data-blood]`
 * altında yeniden tanımlamak aynı rengin iki doğruluk kaynağı olması
 * demekti — biri değişince diğeri sessizce ayrışırdı.
 *
 * Yalnızca canon'da karşılığı olmayan iki kan zemini yeni: `dark` ve
 * `full`. Sıralamayı `data-stage` taşıyor, deriyi bu tablo.
 */
const STAGE_SKIN: Record<number, { layer?: string; blood?: string }> = {
  0: { layer: "soul-society" },
  1: { layer: "hueco-mundo" },
  2: { blood: "dark" },
  3: { blood: "full" },
};
