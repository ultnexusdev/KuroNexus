import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { fetchCategories, fetchUniverses } from "@/lib/api/universes";
import { getPulse } from "@/lib/api/pulse";
import type {
  CountUnit,
  Pulse,
  UniverseCategory,
  WikiUniverseSummary,
} from "@/lib/api/types";
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
  pulse: Pulse | null;
}> {
  try {
    /* `/pulse` üçüncü bir istek değil bir ÖLÇÜ kaynağı: salon başına gerçek
       arşiv sayısını yalnızca o biliyor. Kendi içinde hata yutuyor
       (`getPulse` boş nabız döndürür), o yüzden kapıları düşürmüyor. */
    const [categories, universes, pulse] = await Promise.all([
      fetchCategories(),
      fetchUniverses(),
      getPulse(),
    ]);
    return { categories, universes, pulse };
  } catch {
    // API erişilemezse hol boş kapılarla değil, yalnızca küratör metniyle açılır
    return { categories: [], universes: [], pulse: null };
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const { categories, universes, pulse } = await getData();

  const ordered = sortByHallOrder(categories);

  /**
   * Salon başına gerçek ölçü.
   *
   * Önceden `hallWorldCount` kullanılıyordu ve o **evren** sayıyordu: arşiv
   * salonlarında sonuç her zaman 1 çıkıyor, yani indeks şeridinde "01 FİLM ·
   * 1 evren" yazıyordu — 336 filmlik bir arşivin yanında. Ziyaretçi arşivi
   * olduğundan küçük sanıyordu.
   *
   * Ölçü artık `/pulse`ten: her salon kendi diliyle konuşuyor (film salonunda
   * film, Kadim Dünyalar'da evren). Nabız alınamazsa eski davranışa düşülüyor
   * — sayı yanlış olsa da kapı sayısız kalmasın.
   */
  const pulseHalls = new Map(pulse?.halls.map((h) => [h.slug, h]) ?? []);
  const measureFor = (
    slug: string,
    categoryId: string,
  ): { count: number; countUnit?: CountUnit } => {
    const hall = pulseHalls.get(slug);
    if (hall?.count != null && hall.countUnit) {
      return { count: hall.count, countUnit: hall.countUnit };
    }
    return {
      count: hallWorldCount(
        slug,
        universes.filter((u) => u.categoryId === categoryId).length,
      ),
    };
  };

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
          ...measureFor(cat.slug, cat.id),
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
          // Kategori kaydı olmayan salon (`categoryId` yok): ölçüsü yine
          // nabızdan gelebilir, gelmezse eski davranışa düşer
          ...measureFor(hall.slug, ""),
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
      /* Temürkan bir kategori değil bir evren, o yüzden `/pulse`in salon
         listesinde yok; ölçüsü baş köşe kaydından geliyor. Mühürlü kapı
         "yakında" demiyor artık — kaç bölüm yazılmış onu söylüyor. */
      count: pulse?.featured?.chapterCount,
      countUnit: pulse?.featured?.chapterCount ? "bolum" : undefined,
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
            {/* Üç satır `<br>` yerine üç BLOK: `text-wrap: balance` zorunlu
                kırılmaların olduğu bir blokta devre dışı kalıyor ve İngilizcede
                son satır "own." diye tek kelimeye düşüyordu. Blok başına
                dengeleme o dul satırı kapatıyor, ölçüldü. */}
            <h1 className={styles.manifesto}>
              <span className={styles.manifestoLine}>{t("manifestoA")}</span>
              <span className={styles.manifestoLine}>{t("manifestoB")}</span>
              <span className={styles.manifestoLine}>
                <em>{t("manifestoC")}</em>
              </span>
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
              {/* Sayı artık salonun kendi birimiyle: "336 film", "8 evren",
                  "14 bölüm". Birimi olmayan (nabız alınamamış) salon eski
                  "N evren" metnine düşüyor — sayısız kalmasın. Mühürlü kapı
                  da artık sayı gösteriyor, bölümleri varsa. */}
              {door.soon ? (
                <span className={styles.indexCount}>{t("soonSub")}</span>
              ) : door.count !== undefined ? (
                <span className={styles.indexCount}>
                  {door.countUnit
                    ? t(`unit.${door.countUnit}`, { count: door.count })
                    : t("worldsCount", { count: door.count })}
                </span>
              ) : null}
            </span>
          ))}
        </footer>
      ) : null}
    </section>
  );
}
