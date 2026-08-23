import { getTranslations } from "next-intl/server";
import { LOCATION_GROUPS } from "@/lib/anime/bleach/locations";
import { pick } from "@/lib/anime/bleach/types";
import styles from "./KeyLocations.module.css";
import world from "./world.module.css";

/**
 * P15 · MEKÂNLAR.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Mekânlar dünyalarına göre gruplanıyor ve **her grup kendi dünyasının
 * derisini giyiyor**. Tek bölümde beş tema kayması: sayfanın mini bir
 * özeti, sonuna yakın bir yerde hepsini bir kez daha hatırlatan bir
 * durak.
 *
 * ── ⚠️ GÖRSEL YOK, BİLİNÇLİ ──────────────────────────────────────────────
 * Brief'in açık kararı: "Sayfada zaten çok görsel var; burası nefes alma
 * alanı." Bölüm tamamen tipografik ve manifestoya `locations` yuvası
 * eklenmedi — eklenseydi küratör panelinde sonsuza kadar "eksik görsel"
 * satırı olarak dururdu.
 *
 * ── ⚠️ RAY BU BÖLÜMÜ TAKİP EDİYOR ────────────────────────────────────────
 * Brief'in kabul ölçütü: "Grup geçişlerinde tema kayması Depth Rail'i de
 * günceller." Beş grubun beş kimliği `DEEP_SECTION_LAYERS`e eklendi;
 * ray zaten o defteri okuyor (P07'de kurulan mekanizma). Yeni kod
 * yazılmadı — bölüm kendini deftere yazdırdı, o kadar.
 *
 * ── SIFIR JS ─────────────────────────────────────────────────────────────
 * Tema değişimi nitelik + kalıtım; tek satır istemci kodu yok.
 */
export async function KeyLocations({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.bleach.locations" });

  return (
    <section
      id="locations"
      className={styles.section}
      aria-labelledby="locations-title"
    >
      <div className={styles.head}>
        <p className={world.eyebrow} lang="en">
          {t("eyebrow")}
        </p>
        <h2 id="locations-title" className={world.section}>
          {t("title")}
        </h2>
        <p className={`${world.body} ${styles.lede}`}>{t("lede")}</p>
      </div>

      {LOCATION_GROUPS.map((group) => (
        <div
          key={group.id}
          id={group.id}
          /* Grubun derisi: `globals.css` bu nitelikte bütün token setini
             yeniden bağlıyor ve derinlik rayı da aynı kimliği gözlüyor. */
          data-layer={group.layer}
          className={styles.group}
        >
          <div className={styles.groupInner}>
            <header className={styles.groupHead}>
              <span className={styles.groupKanji} lang="ja">
                {group.kanji}
              </span>
              <h3 className={`${world.eyebrow} ${styles.groupName}`} lang="en">
                {group.eyebrow}
              </h3>
            </header>

            {/* Kart yok: iki sütun, hairline ayraçlı liste. */}
            <ul className={styles.places}>
              {group.places.map((place) => (
                <li key={place.name} className={styles.place}>
                  <p className={styles.placeHead}>
                    <span className={styles.placeKanji} lang="ja">
                      {place.kanji}
                    </span>
                    <span className={styles.placeName}>{place.name}</span>
                  </p>
                  <p className={`${world.body} ${styles.placeText}`}>
                    {pick(place.text, locale)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </section>
  );
}
