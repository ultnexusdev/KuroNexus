import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { fetchClub, pick, type FootballEra } from "@/lib/api/sport-archive";
import { sportHref } from "@/lib/sport/routes";
import { Reveal } from "@/components/sport/Reveal";
import shell from "../../layout.module.css";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; clubSlug: string }>;
}): Promise<Metadata> {
  const { locale, clubSlug } = await params;
  try {
    const { club } = await fetchClub(clubSlug);
    return {
      title: club.name,
      description: pick(locale, club.taglineTr, club.taglineEn) || undefined,
    };
  } catch {
    return {};
  }
}

/** "1905 — 1959" / "2003 —" (süregelen). Tire biçimi ön yüzde üretiliyor. */
function eraRange(era: FootballEra): string {
  return era.endYear ? `${era.startYear} — ${era.endYear}` : `${era.startYear} —`;
}

/**
 * Sayfa 3 — `/spor/futbol/[clubSlug]`.
 *
 * Makro-yapı: Narrative Workflow, kronolojik omurga olarak yorumlandı.
 * Bir kulüp özünde zaman demek; bilgi mimarisi de bunu söylemeli. Efsaneler
 * ve anlar ayrı bir "efsaneler ızgarası"nda DEĞİL, ait oldukları dönemin
 * İÇİNDE yaşıyor.
 *
 * Hero'da istatistik YOK — kupa sayacı, arma duvarı, puan tablosu yok.
 * Veri katmanı (kadro/puan durumu/fikstür) da yok: API-Football ücretsiz
 * planı 2026 sezonunu vermiyor (ölçüldü) ve brief veriyi üst üçte birde
 * yasaklıyor. Veri gelince sayfanın ALT bölümünde kendi kapalı alanında
 * duracak; gelmediği sürece bölüm hiç çizilmiyor.
 */
export default async function ClubWorldPage({
  params,
}: {
  params: Promise<{ locale: string; clubSlug: string }>;
}) {
  const { locale, clubSlug } = await params;

  let data;
  try {
    data = await fetchClub(clubSlug);
  } catch {
    notFound();
  }

  const { club, eras, quotes } = data;
  const t = await getTranslations({ locale, namespace: "sportArchive" });

  const meta = [
    club.foundedYear ? `${t("club.founded")} ${club.foundedYear}` : null,
    club.cityName,
    club.stadiumName,
  ].filter(Boolean);

  const intro = pick(locale, club.narrativeTr, club.narrativeEn);

  return (
    <main className={styles.page}>
      <nav className={shell.crumb} aria-label="breadcrumb">
        <Link href={sportHref.root()}>{t("backToSport")}</Link>
        <span className={shell.sep}>/</span>
        <Link href={sportHref.football()}>{t("backToFootball")}</Link>
      </nav>

      {/* ── Hero: künye, istatistik değil ── */}
      <header className={styles.hero}>
        <h1 className={`${shell.display} ${shell.world}`}>{club.name}</h1>
        {meta.length > 0 ? (
          <p className={shell.data}>{meta.join(" · ")}</p>
        ) : null}
        {intro ? <p className={`${shell.prose} ${styles.intro}`}>{intro}</p> : null}
      </header>

      {/* ── Omurga: dönemler ── */}
      {eras.length > 0 ? (
        <div className={styles.spine}>
          {eras.map((era, index) => {
            const narrative = pick(locale, era.narrativeTr, era.narrativeEn);
            const context = pick(locale, era.contextTr, era.contextEn);
            const personal = pick(locale, era.personalNoteTr, era.personalNoteEn);
            const subtitle = pick(locale, era.subtitleTr, era.subtitleEn);

            return (
              <Reveal
                as="section"
                key={era.id}
                className={styles.era}
                delay={index === 0 ? 0 : 40}
              >
                {/* Çapa: /spor/futbol/galatasaray#avrupaya-acilan-kapi */}
                <span id={era.slug} className={styles.anchor} aria-hidden />

                {/* Yıl BAŞLIĞIN ÜSTÜNDE, aynı sütunda.
                    Etiket-sol / başlık-sağ (hanging header) deseni bilinçli
                    olarak kullanılmıyor — editoryal tasarımın en tanınan
                    şablon izi odur. */}
                <p className={`${shell.figure} ${styles.eraYear}`}>
                  {eraRange(era)}
                </p>
                <h2 className={`${shell.display} ${shell.title}`}>
                  {pick(locale, era.titleTr, era.titleEn)}
                </h2>
                {subtitle ? (
                  <p className={styles.eraSubtitle}>{subtitle}</p>
                ) : null}

                {narrative ? <p className={shell.prose}>{narrative}</p> : null}
                {context ? (
                  <p className={`${shell.prose} ${styles.context}`}>{context}</p>
                ) : null}

                {/* Dönemin isimleri — DÖNEMİN İÇİNDE */}
                {era.figures.length > 0 ? (
                  <div className={styles.sub}>
                    <h3 className={shell.eyebrow}>{t("era.figures")}</h3>
                    <ul className={styles.figures}>
                      {era.figures.map((figure) => (
                        <li key={figure.legend.slug}>
                          <Link
                            href={sportHref.legend(figure.legend.slug)}
                            className={styles.figureLink}
                          >
                            <span className={styles.figureName}>
                              {figure.legend.name}
                            </span>
                            {pick(locale, figure.roleTr, figure.roleEn) ? (
                              <span className={styles.figureRole}>
                                {pick(locale, figure.roleTr, figure.roleEn)}
                              </span>
                            ) : null}
                          </Link>
                          {pick(locale, figure.noteTr, figure.noteEn) ? (
                            <p className={styles.figureNote}>
                              {pick(locale, figure.noteTr, figure.noteEn)}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {/* Anlar — DÖNEMİN İÇİNDE */}
                {era.moments.length > 0 ? (
                  <div className={styles.sub}>
                    <h3 className={shell.eyebrow}>{t("era.moments")}</h3>
                    <ol className={styles.moments}>
                      {era.moments.map((moment) => {
                        const body = pick(
                          locale,
                          moment.narrativeTr,
                          moment.narrativeEn,
                        );
                        const score =
                          moment.match &&
                          moment.match.homeGoals !== null &&
                          moment.match.awayGoals !== null
                            ? `${moment.match.homeGoals}–${moment.match.awayGoals}` +
                              (moment.match.homePenalties !== null &&
                              moment.match.awayPenalties !== null
                                ? ` (${moment.match.homePenalties}–${moment.match.awayPenalties} p)`
                                : "")
                            : null;

                        return (
                          <li key={moment.id} className={styles.moment}>
                            <span className={`${shell.figure} ${styles.momentYear}`}>
                              {moment.year}
                            </span>
                            <div className={styles.momentBody}>
                              <h4 className={styles.momentTitle}>
                                {pick(locale, moment.titleTr, moment.titleEn)}
                              </h4>
                              {/* Skor künyedir, anlatı değil — bu yüzden
                                  sessiz mono satırda ve başlığın ALTINDA */}
                              {score ? (
                                <p className={shell.data}>
                                  {[
                                    moment.match?.homeName,
                                    score,
                                    moment.match?.awayName,
                                  ]
                                    .filter(Boolean)
                                    .join(" ")}
                                </p>
                              ) : null}
                              {body ? (
                                <p className={styles.momentText}>{body}</p>
                              ) : null}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                ) : null}

                {/* Küratörün sesi — dönemin en sessiz, en kişisel parçası */}
                {personal ? (
                  <blockquote className={styles.personal}>
                    <p>{personal}</p>
                  </blockquote>
                ) : null}
              </Reveal>
            );
          })}
        </div>
      ) : null}

      {/* ── Kişisel arşiv: alıntılar ── */}
      {quotes.length > 0 ? (
        <Reveal as="section" className={styles.quotes}>
          <h2 className={shell.eyebrow}>{t("quotes")}</h2>
          <ul className={styles.quoteList}>
            {quotes.map((quote) => (
              <li key={quote.id}>
                <blockquote className={styles.quote}>
                  <p>{pick(locale, quote.textTr, quote.textEn)}</p>
                  {quote.attribution || quote.year ? (
                    <footer className={shell.data}>
                      {[quote.attribution, quote.year].filter(Boolean).join(" · ")}
                    </footer>
                  ) : null}
                </blockquote>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}
    </main>
  );
}
