import { getTranslations } from "next-intl/server";
import { LOCATION_GROUPS } from "@/lib/anime/bleach/locations";
import { placeSlotId } from "@/lib/anime/bleach/slots";
import { pick } from "@/lib/anime/bleach/types";
import { CuratedImage } from "./CuratedImage";
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
 * ── ⚠️ GÖRSELLER GELDİ (29 Ağustos 2026) ─────────────────────────────────
 * Brief bu bölümü görselsiz istiyordu ("burası nefes alma alanı") ve
 * manifestoda hiç yuvası yoktu. Kullanıcı kararı geri aldı: "Mekânlar
 * kısmında da fotoğrafla görselliği artıralım, mesela Karakura Town resmi
 * de olsun, diğer mekânlarında."
 *
 * ⚠️ BÖLÜM YİNE DE IZGARAYA DÖNMEDİ. Kart yok, kutu yok — eklenen şey iki
 * ölçekte bir kadraj:
 *
 *   AÇILIŞ KARESİ  Her grubun İLK mekânı. Grubun tam genişliğinde, 16:9,
 *                  ayraç çizgisinin üstünde. Grubun kimliği bu kare.
 *   KÜÇÜK KARE     Kalan mekânlar. Satırın solunda küçük bir kadraj;
 *                  hairline ritmi ve iki sütunlu liste aynen duruyor.
 *
 * Yani bölüm hâlâ bir liste — resimlenmiş bir liste. "Nefes alma alanı"
 * fikri de duruyor: kareler grubun rengine indirgeniyor (`duotone`), yani
 * yirmi üç ayrı fotoğraf bölümü gürültüye çevirmiyor.
 *
 * ── ⚠️ BOŞKEN DE EKSİKSİZ ────────────────────────────────────────────────
 * Yirmi üç yuva bir günde dolmayacak. Yuvaların yedeği `typographic` ve
 * her biri MEKÂNIN KENDİ KANJİSİNİ basıyor: boş bir kadraj yerine dev bir
 * 空座町 duruyor. Bölüm ilk günden tasarlanmış görünüyor.
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
      className={`${styles.section} ${world.deferPaint}`}
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
              {group.places.map((place, i) => {
                /* Grubun açılış karesi KONUMDAN geliyor: veri dosyasında
                   her grup zaten tanımlayıcı mekânla başlıyor. Bayrağı
                   veriye eklemek aynı bilgiyi iki kez yazmak olurdu ve
                   manifesto da (`slots.ts` → `PLACES`) aynı kuralı
                   okuyor — ikisi ayrışamaz. */
                const lead = i === 0;

                return (
                  <li
                    key={place.slug}
                    className={styles.place}
                    data-lead={lead ? "" : undefined}
                  >
                    {/* ⚠️ `decorative`: karenin anlattığı şey hemen yanındaki
                        iki cümlede zaten yazılı. Ekran okuyucuya mekânın
                        adını iki kez okutmak gürültü. */}
                    <div className={styles.placeShot}>
                      <CuratedImage
                        slotId={placeSlotId(place.slug)}
                        decorative
                        glyph={place.kanji}
                        sizes={lead ? "1328px" : "220px"}
                      />
                    </div>

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
                );
              })}
            </ul>
          </div>
        </div>
      ))}
    </section>
  );
}
