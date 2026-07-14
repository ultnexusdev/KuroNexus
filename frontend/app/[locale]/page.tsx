import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { fetchCategories, fetchUniverses } from "@/lib/api/universes";
import type { UniverseCategory, WikiUniverseSummary } from "@/lib/api/types";
import { DoorWall, type Door } from "@/components/home/DoorWall";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

// Salon sıralaması: kullanıcının müze kurgusu (bilinmeyen yeni kategoriler sona eklenir)
const HALL_ORDER = ["film", "dizi", "spor", "anime", "kadim-dunyalar"];

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

  const ordered = [...categories].sort((a, b) => {
    const ia = HALL_ORDER.indexOf(a.slug);
    const ib = HALL_ORDER.indexOf(b.slug);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  const countFor = (categoryId: string) =>
    universes.filter((u) => u.categoryId === categoryId).length;

  const doors: Door[] = ordered.map((cat, i) => ({
    slug: cat.slug,
    name: cat.name,
    href: `/dark-stories/category/${cat.slug}`,
    coverImage: cat.coverImage,
    hall: i + 1,
    count: countFor(cat.id),
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
  }

  return (
    <section className={styles.hall}>
      <div className={styles.grid}>
        {/* Sol: 黒 glifi + küratör sütunu */}
        <div className={styles.curator}>
          {/* Karanlıkta altın konturuyla beliren mühür — holün ana karakteri */}
          <div className={styles.glyphCol} role="img" aria-label="KuroNexus">
            <span className={styles.glyph} aria-hidden>
              黒
            </span>
            <span className={styles.glyphWord} aria-hidden>
              nexus
            </span>
          </div>

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
              {!door.sealed && door.count !== undefined ? (
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
