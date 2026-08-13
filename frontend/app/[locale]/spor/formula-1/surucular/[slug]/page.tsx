import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import { fetchDriver, pick } from "@/lib/api/sport-archive";
import { sportHref } from "@/lib/sport/routes";
import { flagGradient, sportFlag } from "@/lib/sport/flags";
import { Reveal } from "@/components/sport/Reveal";
import shell from "../../../layout.module.css";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const { driver } = await fetchDriver(slug);
    return {
      title: driver.name,
      description:
        pick(locale, driver.nicknameTr, driver.nicknameEn) || undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Sayfa 7 — `/spor/formula-1/surucular/[slug]`.
 *
 * Futbol efsanesinin karşılığı ama AYNI SAYFA DEĞİL ve olmamalı: futbolda
 * omurga anlatı ve dönemler, burada omurga KAYIT. Sürücünün podyum satırları
 * senkronizasyondan geliyor; küratör anlatısı yazıldığında onun ÜSTÜNE
 * oturuyor, yerine değil.
 *
 * ⚠️ BU SAYFA HENÜZ TASARLANMADI — düzen kuruldu, kompozisyon küratörün
 * sonraki turunda. Bugünkü hâli dürüst bir künye: elde ne varsa onu gösteren,
 * uydurmayan, boş bölüm açmayan bir iskelet. Bölümlerin hepsi "boş oda
 * yasağı"na tabi; anlatısı yazılmamış bir sürücüde yalnızca kayıt görünür.
 */
export default async function DriverPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "sportArchive" });

  let page;
  try {
    page = await fetchDriver(slug);
  } catch {
    notFound();
  }

  const { driver, results, moments, lapRecords } = page;

  /**
   * Künye boşluklarını yarış kaydı kapatıyor.
   *
   * `sync-f1-results.ts` sürücü satırına yalnızca ad, slug ve portre yazıyor;
   * `countryCode` ve `activeFrom/To` boş kalıyor. Aynı bilgi podyum
   * satırlarında duruyor — uydurmak değil, yedekten okumak. Küratör alanı
   * doldurduğu an kayıt kazanıyor (`??` sırası).
   */
  const seasons = results.map((row) => row.seasonYear);
  const activeFrom = driver.activeFrom ?? (seasons.length ? Math.min(...seasons) : null);
  const activeTo = driver.activeTo ?? (seasons.length ? Math.max(...seasons) : null);
  const flag = sportFlag(driver.countryCode, results[0]?.driverNationality);
  const nickname = pick(locale, driver.nicknameTr, driver.nicknameEn);
  const narrative = pick(locale, driver.narrativeTr, driver.narrativeEn);
  const personalNote = pick(
    locale,
    driver.personalNoteTr,
    driver.personalNoteEn,
  );

  /**
   * Portre künyesi ZORUNLU (Commons görselleri CC BY / CC BY-SA). Üçü birden
   * dolu değilse görsel HİÇ çizilmiyor — atıfsız yayın, telifli görseli
   * izinsiz kullanmakla aynı kapıya çıkar. Küratörün kendi yüklediği portrede
   * lisans alanı boş gelir ve o zaman künye aranmıyor.
   */
  const needsCredit = Boolean(driver.portraitLicense);
  const creditComplete =
    Boolean(driver.portraitLicense) &&
    Boolean(driver.portraitAuthor) &&
    Boolean(driver.portraitSourceUrl);
  const showPortrait =
    Boolean(driver.photo) && (!needsCredit || creditComplete);

  const wins = results.filter((row) => row.position === 1);

  // Künye satırları: DEĞERİ OLMAYAN satır hiç yazılmıyor
  const facts = (
    [
      [driver.championships, t("driver.championships")],
      [driver.wins, t("driver.wins")],
      [driver.poles, t("driver.poles")],
      [results.length, t("driver.podiumRows")],
    ] as const
  ).filter(([value]) => value > 0);

  return (
    <main className={styles.page}>
      <nav className={shell.crumb} aria-label="breadcrumb">
        <Link href={sportHref.root()}>{t("backToSport")}</Link>
        <span className={shell.sep}>/</span>
        <Link href={sportHref.f1()}>{t("backToF1")}</Link>
      </nav>

      <header className={styles.head}>
        {flag ? (
          <span
            className={styles.flag}
            aria-hidden
            style={{ backgroundImage: flagGradient(flag) }}
          />
        ) : null}

        <div className={styles.headBody}>
          <h1 className={`${shell.display} ${shell.world}`}>{driver.name}</h1>
          {nickname ? <p className={styles.nickname}>{nickname}</p> : null}

          <p className={`${shell.data} ${styles.meta}`}>
            {[
              driver.fullName !== driver.name ? driver.fullName : null,
              activeFrom ? `${activeFrom}–${activeTo ?? ""}` : null,
              driver.permanentNumber ? `#${driver.permanentNumber}` : null,
              driver.personalRank
                ? t("legend.rank", { n: driver.personalRank })
                : null,
            ]
              .filter(Boolean)
              .join("  ·  ")}
          </p>
        </div>

        {showPortrait ? (
          <figure className={styles.portraitBox}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.portrait}
              src={apiUrl(driver.photo as string)}
              alt={driver.name}
            />
            {creditComplete ? (
              <figcaption className={styles.credit}>
                <a
                  href={driver.portraitSourceUrl as string}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  {driver.portraitLicense}
                </a>
                {" · "}
                {driver.portraitAuthor}
              </figcaption>
            ) : null}
          </figure>
        ) : null}
      </header>

      {/* Künye — ölçüm dili: Bebas rakam, mono etiket, kılcal çizgi */}
      {facts.length > 0 ? (
        <Reveal as="section" className={styles.block}>
          <dl className={styles.facts}>
            {facts.map(([value, unit]) => (
              <div key={unit} className={styles.factCell}>
                <dt className={`${shell.figure} ${styles.factValue}`}>
                  {value}
                </dt>
                <dd className={styles.factUnit}>{unit}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      ) : null}

      {narrative ? (
        <Reveal as="section" className={styles.block} delay={60}>
          <h2 className={shell.eyebrow}>{t("driver.narrative")}</h2>
          <p className={shell.prose}>{narrative}</p>
        </Reveal>
      ) : null}

      {/* Tur rekorları — FK sayesinde sürücü ucundan sorulabiliyor */}
      {lapRecords.length > 0 ? (
        <Reveal as="section" className={styles.block} delay={90}>
          <h2 className={shell.eyebrow}>{t("driver.lapRecords")}</h2>
          <ul className={styles.records}>
            {lapRecords.map((record) => (
              <li key={record.slug} className={styles.record}>
                <Link
                  href={sportHref.circuit(record.slug)}
                  className={styles.recordLink}
                >
                  {record.name}
                </Link>
                <span className={`${shell.figure} ${styles.recordTime}`}>
                  {record.lapRecordTime}
                </span>
                <span className={`${shell.data} ${styles.recordYear}`}>
                  {record.lapRecordYear}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      {moments.length > 0 ? (
        <Reveal as="section" className={styles.block} delay={120}>
          <h2 className={shell.eyebrow}>{t("driver.moments")}</h2>
          <ul className={styles.moments}>
            {moments.map((moment) => (
              <li key={moment.id} className={styles.moment}>
                <span className={`${shell.figure} ${styles.momentYear}`}>
                  {moment.seasonYear}
                </span>
                <div className={styles.momentBody}>
                  <h3 className={`${shell.display} ${styles.momentTitle}`}>
                    {pick(locale, moment.titleTr, moment.titleEn)}
                  </h3>
                  {pick(locale, moment.narrativeTr, moment.narrativeEn) ? (
                    <p className={shell.prose}>
                      {pick(locale, moment.narrativeTr, moment.narrativeEn)}
                    </p>
                  ) : null}
                  {moment.circuit ? (
                    <Link
                      href={sportHref.circuit(moment.circuit.slug)}
                      className={`${shell.data} ${styles.momentCircuit}`}
                    >
                      {moment.circuit.name}
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      {/* Arşivdeki pistlerdeki podyum kayıtları — sayfanın omurgası */}
      {results.length > 0 ? (
        <Reveal as="section" className={styles.block} delay={150}>
          <h2 className={shell.eyebrow}>{t("driver.record")}</h2>
          <p className={`${shell.data} ${styles.recordNote}`}>
            {t("driver.recordNote", {
              podiums: results.length,
              wins: wins.length,
            })}
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col" className={styles.num}>
                    {t("driver.colYear")}
                  </th>
                  <th scope="col">{t("driver.colCircuit")}</th>
                  <th scope="col" className={styles.num}>
                    {t("driver.colPosition")}
                  </th>
                  <th scope="col">{t("driver.colTeam")}</th>
                  <th scope="col" className={styles.num}>
                    {t("driver.colTime")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((row) => (
                  <tr key={row.id} data-win={row.position === 1 ? "" : undefined}>
                    <td className={styles.num}>{row.seasonYear}</td>
                    <td>
                      <Link
                        href={sportHref.circuit(row.circuit.slug)}
                        className={styles.circuitLink}
                      >
                        {row.circuit.name}
                      </Link>
                    </td>
                    <td className={styles.num}>{row.position}</td>
                    <td className={styles.muted}>{row.constructorName ?? "—"}</td>
                    <td className={styles.num}>{row.timeText ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={`${shell.data} ${styles.provenance}`}>
            {t("circuit.source")}
          </p>
        </Reveal>
      ) : null}

      {personalNote ? (
        <Reveal as="section" className={styles.block} delay={180}>
          <h2 className={shell.eyebrow}>{t("legend.personalNote")}</h2>
          <p className={shell.prose}>{personalNote}</p>
        </Reveal>
      ) : null}
    </main>
  );
}
