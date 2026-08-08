import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { fetchCategories } from "@/lib/api/universes";
import { fetchSportOverview } from "@/lib/api/sport-archive";
import { hallLabel, hallNumber } from "@/lib/halls";
import { sportHref } from "@/lib/sport/routes";
import { Reveal } from "@/components/sport/Reveal";
import shell from "./layout.module.css";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sportArchive" });
  return { title: t("football.name") + " · " + t("f1.name"), description: t("lede") };
}

/**
 * Salon numarası kategori kaydından — iki yerde ayrı hesaplanmasın diye
 * `lib/halls.ts` tek kaynak. Kitap salonunun deseni birebir: liste alınamazsa
 * başlık numarasız görünür, sayfa ÇÖKMEZ.
 *
 * `[categorySlug]` sayfası bu try/catch'i taşımadığı için backend her
 * tökezlediğinde 500 veriyordu (Faz 0 denetimi). Aynı hatayı yeni ağaca
 * taşımıyoruz.
 */
async function getHallLabel(): Promise<string> {
  try {
    return hallLabel(hallNumber(await fetchCategories(), "spor"));
  } catch {
    return "";
  }
}

/**
 * Sayfa 1 — `/spor`.
 *
 * Makro-yapı: Marquee Hero. Kıvrım üstü TEK bir tipografik ifade; kıvrım
 * altında sayfa başka bir şeye dönüşüyor. Brief'in açık yasağı: "hero → kart
 * ızgarası → istatistik sayıları → kart ızgarası → footer".
 *
 * İki dünya bandı birbirinin AYNA GÖRÜNTÜSÜ DEĞİL — futbol sola dayalı ve
 * anlatı diliyle, F1 sağa dayalı ve ölçüm diliyle yazılıyor. Simetri kurmak
 * eski `SportSplit`in (iki eşit kart) daha büyük hâlini üretirdi — o bileşen
 * bu yüzden taşınmadı, silindi.
 */
export default async function SportLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sportArchive" });

  // Boş oda yasağı: sayım sıfırsa o dünyanın bandı HİÇ çizilmiyor.
  // Backend düşerse iki dünya da gizlenir — yarım sayfa göstermektense
  // hero ile yetinmek yeğ.
  let overview = { footballClubs: 0, f1Circuits: 0 };
  try {
    overview = await fetchSportOverview();
  } catch {
    // sessiz: hero yine de açılır
  }

  const label = await getHallLabel();

  return (
    <main className={styles.page}>
      {/* ── Kıvrım 1: tam ekran, içerik alt-sol üçte birde ── */}
      <header className={styles.fold}>
        <div className={styles.foldInner}>
          {label ? (
            <p className={shell.eyebrow}>{t("eyebrow", { num: label })}</p>
          ) : null}
          <h1 className={`${shell.display} ${shell.marquee} ${styles.word}`}>
            {t("football.name") === "Futbol" ? "SPOR" : "SPORT"}
          </h1>
          <p className={`${shell.lede} ${styles.lede}`}>{t("lede")}</p>
        </div>
      </header>

      {/* ── Kıvrım 2: futbol — sola dayalı, anlatı dili ── */}
      {overview.footballClubs > 0 ? (
        <Reveal as="section" className={styles.band}>
          <Link href={sportHref.football()} className={styles.bandLink}>
            <h2 className={`${shell.display} ${shell.world}`}>
              {t("football.name")}
            </h2>
            <p className={`${shell.lede} ${styles.bandLede}`}>
              {t("football.tagline")}
            </p>
            <span className={styles.rule} aria-hidden />
            <span className={`${shell.data} ${styles.enter}`}>{t("enter")}</span>
          </Link>
        </Reveal>
      ) : null}

      {/* ── Kıvrım 3: F1 — sağa dayalı, ölçüm dili. Ayna değil. ── */}
      {overview.f1Circuits > 0 ? (
        <Reveal as="section" className={`${styles.band} ${styles.bandRight}`}>
          <Link href={sportHref.f1()} className={styles.bandLink}>
            <h2 className={`${shell.display} ${shell.world}`}>{t("f1.name")}</h2>
            <p className={`${shell.lede} ${styles.bandLede}`}>
              {t("f1.tagline")}
            </p>
            <span className={`${styles.rule} ${styles.ruleF1}`} aria-hidden />
            <span className={`${shell.data} ${styles.enter}`}>
              {overview.f1Circuits}
              <span className={styles.unit}>
                {" · "}
                {t("circuit.index")}
              </span>
            </span>
          </Link>
        </Reveal>
      ) : null}
    </main>
  );
}
