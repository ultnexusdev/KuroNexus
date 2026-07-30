import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { fetchCategories, fetchUniverses } from "@/lib/api/universes";
import type { UniverseCategory, WikiUniverseSummary } from "@/lib/api/types";
import { DoorWall, type Door } from "@/components/home/DoorWall";
import { HeroGlyph } from "@/components/home/HeroGlyph";
import {
  codeHall,
  HALL_ORDER,
  hallWorldCount,
  mergeCodeHalls,
  sortByHallOrder,
} from "@/lib/halls";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

// API erişilemezse (ör. local'de backend kapalı) hol boş kalmasın diye
// statik kapı kadrosu. Sayı/kapak yok — yalnızca kanat kimliği + atmosfer.
const FALLBACK_SLUGS = HALL_ORDER;
const FALLBACK_SEALED_SLUG = "temurkan-efsaneleri";

async function getData(): Promise<{
  categories: UniverseCategory[];
  universes: WikiUniverseSummary[];
}> {
  try {
    const [categories, universes] = await Promise.all([
      fetchCategories(),
      fetchUniverses(),
    ]);
    return { categories, universes };
  } catch {
    // API erişilemezse hol boş kapılarla değil, yalnızca küratör metniyle açılır
    return { categories: [], universes: [] };
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const { categories, universes } = await getData();

  const ordered = sortByHallOrder(categories);

  // Arşiv salonlarının açtığı bölüm de bir evren sayılır (bkz. hallWorldCount)
  const countFor = (slug: string, categoryId: string) =>
    hallWorldCount(
      slug,
      universes.filter((u) => u.categoryId === categoryId).length,
    );

  const hasData = ordered.length > 0;

  /**
   * Kapı kadrosu: veritabanı kategorileri + kod tanımlı salonlar (Kitap gibi
   * kategori kaydı henüz açılmamış kanatlar). Numaralar bu birleşik listenin
   * sırasından geliyor, o yüzden yeni kapı araya girince Kadim Dünyalar ve
   * Temürkan kendiliğinden bir aşağı kayar.
   */
  const doors: Door[] = hasData
    ? mergeCodeHalls<Door>(
        ordered.map((cat) => ({
          slug: cat.slug,
          name: cat.name,
          href: `/dark-stories/category/${cat.slug}`,
          coverImage: cat.coverImage,
          art: codeHall(cat.slug)?.art ?? null,
          hall: 0,
          count: countFor(cat.slug, cat.id),
          soon: codeHall(cat.slug)?.soon,
        })),
        (door) => door.slug,
        (hall) => ({
          slug: hall.slug,
          name: t(`halls.${hall.slug}`),
          href: `/dark-stories/category/${hall.slug}`,
          coverImage: null,
          art: hall.art,
          hall: 0,
          soon: hall.soon,
        }),
      ).map((door, i) => ({ ...door, hall: i + 1 }))
    : FALLBACK_SLUGS.map((slug, i) => ({
        slug,
        name: t(`halls.${slug}`),
        href: `/dark-stories/category/${slug}`,
        art: codeHall(slug)?.art ?? null,
        hall: i + 1,
        soon: codeHall(slug)?.soon,
      }));

  // Baş köşe: Temürkan'ın mühürlü kapısı — duvarın en sonunda
  const temurkan = universes.find((u) => u.slug === "temurkan-efsaneleri");
  if (temurkan) {
    doors.push({
      slug: "temurkan-muhru",
      name: t("sealedTitle"),
      href: `/dark-stories/${temurkan.slug}`,
      coverImage: temurkan.coverImage,
      hall: doors.length + 1,
      sealed: true,
    });
  } else if (!hasData) {
    // Fallback: mühürlü baş köşe de gösterilsin (duvar tam hissetsin)
    doors.push({
      slug: "temurkan-muhru",
      name: t("sealedTitle"),
      href: `/dark-stories/${FALLBACK_SEALED_SLUG}`,
      hall: doors.length + 1,
      sealed: true,
    });
  }

  return (
    <section className={styles.hall}>
      <div className={styles.grid}>
        {/* Sol: 黒 glifi + küratör sütunu */}
        <div className={styles.curator}>
          {/* Karanlıkta altın konturuyla beliren mühür — imlece tepki verir */}
          <HeroGlyph word="nexus" />

          <div className={styles.textCol}>
            <p className={styles.eyebrow}>{t("eyebrow")}</p>
            <h1 className={styles.manifesto}>
              {t("manifestoA")}
              <br />
              {t("manifestoB")}
              <br />
              <em>{t("manifestoC")}</em>
            </h1>
            <p className={styles.sub}>{t("sub")}</p>
            <Link href="/dark-stories" className={styles.cta}>
              {t("cta")}
              <span className={styles.ctaArrow} aria-hidden>
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Sağ: kapı duvarı */}
        {doors.length > 0 ? <DoorWall doors={doors} /> : null}
      </div>

      {/* Arşiv indeksi: gerçek verili katalog şeridi */}
      {doors.length > 0 ? (
        <footer className={styles.index} aria-label={t("indexTitle")}>
          {doors.map((door) => (
            <span key={door.slug} className={styles.indexItem}>
              <span className={styles.indexNo}>
                {String(door.hall).padStart(2, "0")}
              </span>
              <span className={styles.indexName}>{door.name}</span>
              {door.sealed ? null : door.soon ? (
                <span className={styles.indexCount}>{t("soonSub")}</span>
              ) : door.count !== undefined ? (
                <span className={styles.indexCount}>
                  {t("worldsCount", { count: door.count })}
                </span>
              ) : null}
            </span>
          ))}
        </footer>
      ) : null}
    </section>
  );
}
