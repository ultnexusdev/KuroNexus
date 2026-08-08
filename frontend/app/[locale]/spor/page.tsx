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
  return {
    title: t("football.name") + " · " + t("f1.name"),
    description: t("lede"),
  };
}

/**
 * Salon numarası kategori kaydından — `lib/halls.ts` tek kaynak. Kitap
 * salonunun deseni: liste alınamazsa numarasız görünür, sayfa ÇÖKMEZ.
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
 * ── YENİDEN DÜZENLENDİ (8 Ağustos 2026) ──────────────────────────────────
 * Önceki sürüm "SPOR" kelimesini 288px'te tek başına gösteriyordu; üstünde
 * 461px ölü boşluk vardı ve başlıkla alt metin arasındaki oran 13:1'di.
 * Squint testinde tek bir leke görünüyordu — ikincil öğe yok, grup yok.
 * Bu bir kompozisyon değil, büyütülmüş bir etiketti.
 *
 * Üç yapısal değişiklik:
 *
 * 1. ETİKET GİTTİ. "SALON 03 · SPOR" göz kırpması başlığın üstünden kalktı
 *    (craft floor bunu kesin yasak sayıyor: başlık kendi ağırlığını taşır).
 *    Salon kimliği artık üstteki kırıntıda — dekorasyon değil, gezinme.
 *
 * 2. CÜMLE BAŞLIK OLDU. Sayfanın ne olduğunu söyleyen şey "SPOR" değil,
 *    "Oyunların, efsanelerin, rekabetin ve hızın kişisel arşivi." Etiket
 *    zaten sekmede ve kırıntıda duruyor; onu ikinci kez ve dev puntoda
 *    tekrarlamak bilgi taşımıyordu.
 *
 * 3. KIVRIM KISALDI. Artık tam ekran değil — ilk dünya bandı ilk ekrana
 *    sızıyor. Ziyaretçi arşivden bir şey GÖREREK karşılanıyor, boş bir
 *    duvarla değil. Kaydırma daveti kompozisyonun parçası.
 *
 * İki dünya bandı ağırlığını punto yerine ALAN ve IŞIKtan alıyor: cümle
 * okuma sırasını açıyor, bantlar ekranı dolduruyor.
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
  // açılış cümlesiyle yetinmek yeğ.
  let overview = { footballClubs: 0, f1Circuits: 0 };
  try {
    overview = await fetchSportOverview();
  } catch {
    // sessiz
  }

  const label = await getHallLabel();

  return (
    <main className={styles.page}>
      {/* Kırıntı: salon kimliğini taşıyan gezinme satırı. Diğer beş spor
          sayfasıyla aynı desen — başlık üstü süs değil. */}
      <nav className={shell.crumb} aria-label="breadcrumb">
        <Link href="/dark-stories">KuroNexus</Link>
        <span className={shell.sep}>/</span>
        {/* Bulunduğun yerin adı SALONUN adı — Futbol ve Formula 1 onun
            içindeki iki dünya. Salon numarası alınamazsa numarasız "Spor"a
            düşüyor; önceki yedek yanlışlıkla "Futbol" yazıyordu. */}
        <span>{label ? t("eyebrow", { num: label }) : t("name")}</span>
      </nav>

      {/* ── Açılış: cümle başlıktır ── */}
      <header className={styles.opening}>
        <h1 className={`${shell.display} ${styles.statement}`}>{t("lede")}</h1>
      </header>

      {/* ── Futbol: sola dayalı, anlatı dili ── */}
      {overview.footballClubs > 0 ? (
        <Reveal as="section" className={styles.band}>
          <Link href={sportHref.football()} className={styles.bandLink}>
            <h2 className={`${shell.display} ${styles.world}`}>
              {t("football.name")}
            </h2>
            <p className={styles.tagline}>{t("football.tagline")}</p>
            <span className={styles.rule} aria-hidden />
            <span className={`${shell.data} ${styles.enter}`}>{t("enter")}</span>
          </Link>
        </Reveal>
      ) : null}

      {/* ── Formula 1: sağa dayalı, ölçüm dili. Ayna değil. ── */}
      {overview.f1Circuits > 0 ? (
        <Reveal as="section" className={`${styles.band} ${styles.bandRight}`}>
          <Link href={sportHref.f1()} className={styles.bandLink}>
            <h2 className={`${shell.display} ${styles.world}`}>{t("f1.name")}</h2>
            <p className={styles.tagline}>{t("f1.tagline")}</p>
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
