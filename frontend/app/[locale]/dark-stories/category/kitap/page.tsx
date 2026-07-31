import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { fetchCategories } from "@/lib/api/universes";
import { codeHall, hallLabel, hallName, hallNumber } from "@/lib/halls";
import { LobbyBanner } from "@/components/hall/LobbyBanner";
import styles from "./page.module.css";

/**
 * Salon 05 · Kitap — salon girişi.
 *
 * Statik yol olduğu için `[categorySlug]` dinamik sayfasından ÖNCE eşleşir:
 * kanat, veritabanında bir `UniverseCategory` kaydı olmasa da açılır. Kayıt
 * sonradan panelden oluşturulursa salon adı ve numarası oradan okunmaya
 * başlar; bu sayfa yine bu dosya kalır (film/dizi salonlarındaki desenin
 * aynısı).
 *
 * Arşiv ve Ödüller açıldı, ikisi de gerçek bağlantı. "Okuma Notları" hâlâ
 * "yakında" rozetiyle ve tıklanamaz — kapı, arkasında hiçbir şey olmayan bir
 * bağlantı vermesin diye.
 */

const SLUG = "kitap";

/** `href` dolu olan bölüm tıklanabilir; boş olan "yakında" rozetiyle durur. */
const SECTIONS = [
  { key: "archive", href: "/dark-stories/category/kitap/arsiv" },
  { key: "awards", href: "/dark-stories/category/kitap/oduller" },
  { key: "notes", href: null },
] as const;

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  return { title: t("hallName") };
}

/** Salon numarası ve adı tek kaynaktan: kategori kaydı (yoksa kod adı). */
async function getHall(
  fallbackName: string,
): Promise<{ label: string; name: string }> {
  try {
    const categories = await fetchCategories();
    return {
      label: hallLabel(hallNumber(categories, SLUG)),
      name: hallName(categories, SLUG, fallbackName),
    };
  } catch {
    // Kategori listesi alınamazsa başlık numarasız görünür, sayfa çökmez
    return { label: "", name: fallbackName };
  }
}

export default async function BookLobbyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  const tStories = await getTranslations({ locale, namespace: "stories" });
  const hall = await getHall(t("hallName"));
  const art = codeHall(SLUG)?.art;

  return (
    <div data-category={SLUG} className={styles.lobby}>
      {/* Kapı çizimi burada arka duvara dönüşür — eşiğin iki yanı aynı yer */}
      {art ? (
        <div className={styles.wall} aria-hidden>
          <Image
            src={art}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.wallImg}
          />
          <div className={styles.wallFade} />
        </div>
      ) : null}

      {/* Dar ekranda arka duvar çok kısık kalıyor; aynı çizim üstte bant olur.
          Tek görsel: iki yarıya aynı rafı koymak tekrar gibi görünüyordu */}
      {art ? <LobbyBanner images={[art]} /> : null}

      <header className={styles.head}>
        <Link href="/dark-stories" className={styles.back}>
          {tStories("backToList")}
        </Link>
        <span className={styles.eyebrow}>
          {t("hall", { num: hall.label, name: hall.name })}
        </span>
        <h1 className={styles.title}>{hall.name.toLocaleUpperCase(locale)}</h1>
        <span className={styles.rule}>
          <span className={styles.diamond}>❖</span>
        </span>
        <p className={styles.lede}>{t("lobbyLede")}</p>
      </header>

      <div className={styles.sections}>
        {SECTIONS.map((section) =>
          section.href ? (
            <Link
              key={section.key}
              href={section.href}
              className={styles.sectionOpen}
            >
              <span className={styles.sectionTitle}>
                {t(`sections.${section.key}.title`)}
              </span>
              <span className={styles.sectionDesc}>
                {t(`sections.${section.key}.desc`)}
              </span>
              <span className={styles.enter}>{t("enter")}</span>
            </Link>
          ) : (
            <article key={section.key} className={styles.section}>
              <span className={styles.sectionTitle}>
                {t(`sections.${section.key}.title`)}
              </span>
              <span className={styles.sectionDesc}>
                {t(`sections.${section.key}.desc`)}
              </span>
              <span className={styles.soon}>{t("soon")}</span>
            </article>
          ),
        )}
      </div>

      <p className={styles.note}>{t("note")}</p>
    </div>
  );
}
