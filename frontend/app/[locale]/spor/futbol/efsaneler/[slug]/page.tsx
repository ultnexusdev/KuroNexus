import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link, redirect } from "@/lib/i18n/navigation";
import { fetchLegend, pick } from "@/lib/api/sport-archive";
import { apiUrl } from "@/lib/api/client";
import { isInNotebook } from "@/lib/sport/favourite-players";
import { sportHref } from "@/lib/sport/routes";
import { shareCard } from "@/lib/seo";
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
    const { legend } = await fetchLegend(slug);
    const title = legend.name;
    const description =
      pick(locale, legend.epithetTr, legend.epithetEn) || undefined;
    return {
      title,
      description,
      ...shareCard({
        title,
        description,
        locale,
        path: sportHref.legend(slug),
        ...(legend.portraitImage
          ? { image: apiUrl(legend.portraitImage) }
          : {}),
      }),
    };
  } catch {
    return {};
  }
}

/**
 * Sayfa 4 — `/spor/futbol/efsaneler/[slug]`.
 *
 * Makro-yapı: Long Document. Sürekli anlatı + satır içi bölüm başlıkları.
 * Brief'in cümlesi: "Wikipedia sayfası gibi değil, ARŞİV KAYDI gibi
 * görünmelidir."
 *
 * Bunun somut karşılığı: İSTATİSTİK KUTUSU YOK. Ne maç sayısı rozeti, ne gol
 * grafiği, ne infobox. Sayılar — varsa — cümlenin içinde geçer. Şema da bunu
 * destekliyor: `FootballLegend` bilinçle `appearances/goals/assists`
 * taşımıyor, o künye `FootballPlayer`da duruyor.
 */
export default async function LegendPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  /**
   * ⚠️ DEFTER KAZANIYOR. Bir efsane deftere taşındıysa (Hagi, 21 Ağustos
   * 2026) asıl sayfası artık poster düzenindeki profil; bu belge düzeni onun
   * eski hâli. Eski adres ölmüyor, yeni sayfaya yönleniyor — dışarıdan
   * verilmiş bağlantılar ve arama motoru kayıtları kırılmasın diye.
   *
   * Yönlendirme `next-intl` üzerinden: dil ön eki korunuyor, yani
   * `/en/spor/futbol/efsaneler/hagi` de `/en/...` olarak devam ediyor.
   */
  if (isInNotebook(slug)) {
    redirect({ href: sportHref.favouritePlayer(slug), locale });
  }

  let data;
  try {
    data = await fetchLegend(slug);
  } catch {
    notFound();
  }

  const { legend, moments, eraFigures, quotes } = data;
  const t = await getTranslations({ locale, namespace: "sportArchive" });

  const narrative = pick(locale, legend.narrativeTr, legend.narrativeEn);
  const context = pick(locale, legend.contextTr, legend.contextEn);
  const personal = pick(locale, legend.personalNoteTr, legend.personalNoteEn);
  const achievements = pick(
    locale,
    legend.achievementsTr,
    legend.achievementsEn,
  );
  const epithet = pick(locale, legend.epithetTr, legend.epithetEn);

  /**
   * Künye satırı: ülke · doğum—ölüm · kulüpteki yıllar. Kutu değil, tek satır.
   *
   * ⚠️ `role` BİLEREK YOK. Alan bir enum ham değeri taşıyor
   * (`PLAYER | COACH | ...`, `schema.prisma`) ve çevrilmemiş; basılsaydı
   * künyede İngilizce bir sabit görünürdü. Yorumun eski hâli "mevcut/rol"
   * diyordu ama kod onu hiç okumuyordu — yorum koda uyduruldu.
   *
   * ⚠️ SARKAN TİRE KASITLI: bitiş yılı boşsa "1996–" yazıyor ve bu "devam
   * ediyor" demek. Burada eskiden bir `.replace(/–$/, "–")` vardı; arama ve
   * değiştirme dizesi AYNI karakter (U+2013) olduğu için hiçbir şey yapmayan
   * ölü koddu. Aynı aralık ifadesi efsaneler salonunda ve hub şeridinde de
   * replace'siz yazılı — kaldırıldı, davranış değişmedi.
   */
  const meta = [
    legend.countryCode,
    legend.birthYear
      ? `${legend.birthYear} — ${legend.deathYear ?? ""}`.trim()
      : null,
    legend.yearsFrom ? `${legend.yearsFrom}–${legend.yearsTo ?? ""}` : null,
  ].filter(Boolean);

  return (
    <main className={styles.page}>
      <nav className={shell.crumb} aria-label="breadcrumb">
        <Link href={sportHref.root()}>{t("backToSport")}</Link>
        <span className={shell.sep}>/</span>
        <Link href={sportHref.football()}>{t("backToFootball")}</Link>
        {legend.club ? (
          <>
            <span className={shell.sep}>/</span>
            <Link href={sportHref.club(legend.club.slug)}>
              {legend.club.name}
            </Link>
          </>
        ) : null}
      </nav>

      <article className={styles.doc}>
        <header className={styles.head}>
          <h1 className={`${shell.display} ${shell.world}`}>{legend.name}</h1>
          {legend.fullName && legend.fullName !== legend.name ? (
            <p className={styles.fullName}>{legend.fullName}</p>
          ) : null}
          {meta.length > 0 ? (
            <p className={shell.data}>{meta.join(" · ")}</p>
          ) : null}
          {legend.personalRank ? (
            <p className={styles.rank}>
              {t("legend.rank", { n: legend.personalRank })}
            </p>
          ) : null}
        </header>

        {/* ── EFSANE ── sayfanın özü, sürekli metin */}
        {narrative ? (
          <section className={styles.section}>
            <h2 className={shell.eyebrow}>
              {epithet || t("legend.title")}
            </h2>
            <p className={shell.prose}>{narrative}</p>
            {context ? (
              <p className={`${shell.prose} ${styles.context}`}>{context}</p>
            ) : null}
          </section>
        ) : null}

        {/* Dönemler: hangi dönemde ne yaptığı — kulüp sayfasına geri bağ */}
        {eraFigures.length > 0 ? (
          <Reveal as="section" className={styles.section}>
            <h2 className={`${shell.display} ${shell.section}`}>
              {t("legend.eras")}
            </h2>
            <ul className={styles.eras}>
              {eraFigures.map((entry) => (
                <li key={entry.era.slug}>
                  <p className={`${shell.figure} ${styles.eraYear}`}>
                    {entry.era.startYear} —{" "}
                    {entry.era.endYear ?? t("club.ongoing")}
                  </p>
                  {legend.club ? (
                    <Link
                      href={`${sportHref.club(legend.club.slug)}#${entry.era.slug}`}
                      className={styles.eraTitle}
                    >
                      {pick(locale, entry.era.titleTr, entry.era.titleEn)}
                    </Link>
                  ) : (
                    <span className={styles.eraTitle}>
                      {pick(locale, entry.era.titleTr, entry.era.titleEn)}
                    </span>
                  )}
                  {pick(locale, entry.roleTr, entry.roleEn) ? (
                    <p className={styles.role}>
                      {pick(locale, entry.roleTr, entry.roleEn)}
                    </p>
                  ) : null}
                  {pick(locale, entry.noteTr, entry.noteEn) ? (
                    <p className={shell.prose}>
                      {pick(locale, entry.noteTr, entry.noteEn)}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {/* Kazanılanlar — satır satır, tablo değil */}
        {achievements ? (
          <Reveal as="section" className={styles.section}>
            <h2 className={`${shell.display} ${shell.section}`}>
              {t("legend.achievements")}
            </h2>
            <ul className={styles.achievements}>
              {achievements
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
            </ul>
          </Reveal>
        ) : null}

        {/* Unutulmaz anlar — dönemler arasından toplanıyor */}
        {moments.length > 0 ? (
          <Reveal as="section" className={styles.section}>
            <h2 className={`${shell.display} ${shell.section}`}>
              {t("legend.moments")}
            </h2>
            <ol className={styles.moments}>
              {moments.map((moment) => (
                <li key={moment.id} className={styles.moment}>
                  <span className={`${shell.figure} ${styles.momentYear}`}>
                    {moment.year}
                  </span>
                  <div>
                    <h3 className={styles.momentTitle}>
                      {pick(locale, moment.titleTr, moment.titleEn)}
                    </h3>
                    {pick(locale, moment.narrativeTr, moment.narrativeEn) ? (
                      <p className={styles.momentText}>
                        {pick(locale, moment.narrativeTr, moment.narrativeEn)}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        ) : null}

        {/* Kişisel notlar — sayfanın en sessiz yeri */}
        {personal ? (
          <Reveal as="section" className={styles.section}>
            <h2 className={shell.eyebrow}>{t("legend.personalNote")}</h2>
            <blockquote className={styles.personal}>
              <p>{personal}</p>
            </blockquote>
          </Reveal>
        ) : null}

        {quotes.length > 0 ? (
          <Reveal as="section" className={styles.section}>
            <h2 className={shell.eyebrow}>{t("quotes")}</h2>
            <ul className={styles.quoteList}>
              {quotes.map((quote) => (
                <li key={quote.id}>
                  <blockquote className={styles.quote}>
                    <p>{pick(locale, quote.textTr, quote.textEn)}</p>
                    {quote.attribution || quote.year ? (
                      <footer className={shell.data}>
                        {[quote.attribution, quote.year]
                          .filter(Boolean)
                          .join(" · ")}
                      </footer>
                    ) : null}
                  </blockquote>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </article>
    </main>
  );
}
