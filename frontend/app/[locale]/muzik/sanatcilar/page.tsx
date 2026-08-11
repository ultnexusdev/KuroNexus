import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { fetchMusicActs } from "@/lib/api/music";
import { readIsAdmin } from "@/lib/auth/session";
import { genreColorVar, musicHref } from "@/lib/music/routes";
import { CoverArt } from "@/components/music/CoverArt";
import shell from "../layout.module.css";
import styles from "./page.module.css";

/**
 * Sanatçı dizini — `/muzik/sanatcilar`.
 *
 * ⚠️ NEDEN VAR: salon kavşağındaki "YOL 02 · Sanatçı sayfaları" kartı
 * `overview.acts[0]`e, yani **her zaman aynı sanatçıya** gidiyordu. Arşivde
 * tek sanatçı (Linkin Park) varken fark edilmedi; ikinci sanatçı eklenince
 * kart yine birinciyi açardı ve yeni sanatçıya ulaşmanın tek yolu tür odası
 * olurdu (kullanıcı bildirimi, 12 Ağustos 2026).
 *
 * Sıralama albüm sayısına göre — `popularity` bu uygulamaya hiç gelmiyor.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "music" });
  return { title: t("paths.actsTitle"), description: t("paths.actsLede") };
}

export default async function MusicActsPage() {
  const isAdmin = await readIsAdmin();
  const [acts, t] = await Promise.all([
    fetchMusicActs(isAdmin),
    getTranslations("music"),
  ]);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <Link href={musicHref.root()} className={styles.back}>
          ← {t("name")}
        </Link>
        <h1 className={`${shell.carved} ${styles.title}`}>
          {t("paths.actsTitle")}
        </h1>
        <p className={`${shell.prose} ${styles.lede}`}>{t("paths.actsLede")}</p>
        <span className={shell.label}>
          {t("acts.total", { count: acts.length })}
        </span>
      </header>

      {acts.length === 0 ? (
        <p className={styles.empty}>{t("acts.empty")}</p>
      ) : (
        <ul className={styles.grid}>
          {acts.map((act) => (
            <li key={act.slug}>
              <Link
                href={musicHref.act(act.slug)}
                className={`${shell.panel} ${styles.card}`}
                style={{
                  borderLeftColor: genreColorVar(act.genres[0]?.accentKey),
                }}
              >
                <CoverArt src={act.image} alt={act.name} size={64} rounded="full" />
                <span className={styles.cardBody}>
                  <span className={styles.name}>{act.name}</span>
                  <span className={shell.label}>
                    {[
                      act.actKind !== "UNCLASSIFIED"
                        ? t(`actKind.${act.actKind}`)
                        : null,
                      act.formedYear ? String(act.formedYear) : null,
                      act.originCountry,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                  <span className={styles.meta}>
                    {t("acts.albumCount", { count: act.albumCount })}
                    {act.genres.length > 0
                      ? ` · ${act.genres.map((genre) => genre.name).join(", ")}`
                      : ""}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
