import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { fetchF1Hub } from "@/lib/api/sport-archive";
import { sportHref } from "@/lib/sport/routes";
import { Reveal } from "@/components/sport/Reveal";
import shell from "../layout.module.css";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sportArchive" });
  return { title: t("f1.name"), description: t("f1.lede") };
}

/** 5793 → "5.793 km" — km'ye çevirip yerel ayırıcıyla yazar. */
function km(meters: number | null, locale: string): string | null {
  if (meters == null) return null;
  return `${(meters / 1000).toLocaleString(locale === "en" ? "en-GB" : "tr-TR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })} km`;
}

/**
 * Sayfa 5 — `/spor/formula-1`.
 *
 * Makro-yapı: Index-First. Sayfanın KENDİSİ bir dizin. Futbol hub'ıyla
 * kategorik olarak zıt: orada anlatı yüzeyleri, burada ölçüm.
 *
 * Hero görseli YOK, kart YOK. Hizalı rakamlar, kılcal çizgiler, mono künye —
 * brief'in "teknik, geometrik, hassas" dediği yer burası. Tek satır varken
 * bile tablo başlığı duruyor: dizinin ŞEKLİ arşivin sözü, satır sayısı değil.
 */
export default async function F1HubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sportArchive" });

  let hub;
  try {
    hub = await fetchF1Hub();
  } catch {
    notFound();
  }

  // Boş oda yasağı: yazılmış tek pist yoksa sayfa hiç açılmıyor
  if (hub.circuits.length === 0) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <nav className={shell.crumb} aria-label="breadcrumb">
        <Link href={sportHref.root()}>{t("backToSport")}</Link>
      </nav>

      <header className={styles.head}>
        <h1 className={`${shell.display} ${shell.title}`}>{t("f1.name")}</h1>
        <p className={shell.lede}>{t("f1.lede")}</p>
      </header>

      <Reveal as="section" className={styles.block}>
        <h2 className={shell.eyebrow}>{t("circuit.index")}</h2>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">{t("circuit.colCircuit")}</th>
                <th scope="col">{t("circuit.colCountry")}</th>
                <th scope="col" className={styles.num}>
                  {t("circuit.colLength")}
                </th>
                <th scope="col" className={styles.num}>
                  {t("circuit.colCorners")}
                </th>
                <th scope="col" className={styles.num}>
                  {t("circuit.colFirstGp")}
                </th>
              </tr>
            </thead>
            <tbody>
              {hub.circuits.map((circuit) => (
                <tr key={circuit.slug}>
                  <td>
                    <Link
                      href={sportHref.circuit(circuit.slug)}
                      className={styles.circuitLink}
                    >
                      {circuit.name}
                    </Link>
                  </td>
                  <td className={styles.muted}>{circuit.countryCode ?? "—"}</td>
                  <td className={styles.num}>
                    {km(circuit.lengthMeters, locale) ?? "—"}
                  </td>
                  <td className={styles.num}>{circuit.cornerCount ?? "—"}</td>
                  <td className={styles.num}>
                    {circuit.firstGrandPrixYear ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </main>
  );
}
