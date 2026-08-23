import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { fetchCategories, fetchUniverses } from "@/lib/api/universes";
import type { UniverseCategory, WikiUniverseSummary } from "@/lib/api/types";
import { hallHref, mergeCodeHalls, sortByHallOrder } from "@/lib/halls";
import { universeHref } from "@/lib/sport/routes";
import { BrandLogo } from "./BrandLogo";
import styles from "./SiteFooter.module.css";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const tHome = await getTranslations("home");
  const locale = await getLocale();

  /* Veritabanındaki kategori adı TÜRKÇE (panelden verilen ad). Varsayılan
     dilde kaynak o kalıyor — panelden yeniden adlandırma footer'a da yansısın
     diye (bkz. lib/halls.ts `hallName` notu). İngilizcede ise DB adı
     çevrilemez: sözlükte karşılığı olan salonlar `home.halls.*`ten okunur;
     sözlüğe henüz girmemiş yepyeni bir kategori Türkçe adıyla düşer — yanlış
     dilde bir ad, boş satırdan yeğ. */
  const localizedHallName = (slug: string, dbName: string): string =>
    locale === routing.defaultLocale || !tHome.has(`halls.${slug}`)
      ? dbName
      : tHome(`halls.${slug}`);

  /* İki istek AYRI değerlendiriliyor (`Promise.all` değil): kategori isteği
     düşerse evren sütunu da kaybolurdu, oysa ikisinin birbiriyle işi yok.
     API erişilemezse footer o sütun olmadan render edilir, sayfa çökmez. */
  const [universeResult, categoryResult] = await Promise.allSettled([
    fetchUniverses(),
    fetchCategories(),
  ]);
  const universes: WikiUniverseSummary[] =
    universeResult.status === "fulfilled" ? universeResult.value : [];
  const categories: UniverseCategory[] =
    categoryResult.status === "fulfilled" ? categoryResult.value : [];

  /* Salon kadrosu ana sayfadaki kapı duvarının birebir aynı yolundan:
     veritabanı kategorileri sıraya dizilip kod tanımlı kanatlarla
     birleştiriliyor. Kategori isteği düştüyse liste boş kalır ve sütun hiç
     çizilmez — uydurma bağlantı üretmektense eksik kalmak yeğ. */
  const halls = mergeCodeHalls(
    sortByHallOrder(categories).map((category) => ({
      slug: category.slug,
      name: localizedHallName(category.slug, category.name),
    })),
    (hall) => hall.slug,
    (hall) => ({
      slug: hall.slug,
      name: tHome(`halls.${hall.slug}`),
    }),
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandColumn}>
          <Link href="/" className={styles.brandLink}>
            <BrandLogo />
          </Link>
          <p className={styles.about}>{t("about")}</p>
        </div>

        <div className={styles.column}>
          <h2 className={styles.columnTitle}>{t("explore")}</h2>
          <ul className={styles.linkList}>
            <li>
              <Link href="/" className={styles.link}>
                {t("home")}
              </Link>
            </li>
            <li>
              {/* AYNI ADRESİN İKİ ADI, tek ada indirildi.
                  `/dark-stories` hero'da "Nexus'a gir", burada "Nexus'u
                  Keşfet" diye anılıyordu; ziyaretçi iki farklı yere gittiğini
                  sanabilirdi. Değişen taraf FOOTER oldu, hero değil: hero'nun
                  "kapıdan girme" metaforu holün bütün dilini kuruyor (kapı
                  duvarı, mühürlü kapı, "Kapıyı arala"), footer etiketi ise
                  yalnızca bir liste satırı. Metafor kalıp etiket ona yaklaştı;
                  çeviri anahtarı `footer.darkStories` aynı, metni değişti. */}
              <Link href="/dark-stories" className={styles.link}>
                {t("darkStories")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Salon listesi: markanın gerçek içindekiler tablosu.
            Kadro ana sayfadaki kapı duvarıyla AYNI kaynaktan kuruluyor —
            veritabanı kategorileri + kod tanımlı kanatlar (Kitap gibi).
            `HALL_ORDER` yalnızca SIRA kaynağı (bkz. lib/halls.ts notu:
            "listede olmayan yeni kategoriler sona eklenir"); ondan liste
            üretmek panelden açılan yeni bir salonu footer'da görünmez
            bırakır, kapatılan bir salonu da ölü bağlantı olarak bırakırdı. */}
        {halls.length > 0 ? (
          <div className={styles.column}>
            <h2 className={styles.columnTitle}>{t("halls")}</h2>
            <ul className={styles.linkList}>
              {halls.map((hall) => (
                <li key={hall.slug}>
                  <Link
                    href={hallHref(hall.slug)}
                    className={styles.link}
                  >
                    {hall.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {universes.length > 0 && (
          <div className={styles.column}>
            <h2 className={styles.columnTitle}>{t("universes")}</h2>
            <ul className={styles.linkList}>
              {universes.slice(0, 8).map((universe) => (
                <li key={universe.id}>
                  <Link
                    href={universeHref(universe.slug)}
                    className={styles.link}
                  >
                    {universe.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={styles.bottomBar}>
        <span>
          © {new Date().getFullYear()} KuroNexus — {t("tagline")}
        </span>
      </div>
    </footer>
  );
}
