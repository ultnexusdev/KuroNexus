import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { fetchCircuit, pick } from "@/lib/api/sport-archive";
import { sportHref } from "@/lib/sport/routes";
import { Reveal } from "@/components/sport/Reveal";
import { PodiumStage } from "@/components/sport/PodiumStage";
import { flagBands } from "@/lib/sport/flags";
import shell from "../../../layout.module.css";
import styles from "./page.module.css";
import { apiUrl } from "@/lib/api/client";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const { circuit } = await fetchCircuit(slug);
    return {
      title: circuit.name,
      description: pick(locale, circuit.nicknameTr, circuit.nicknameEn) || undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Sayfa 6 — `/spor/formula-1/pistler/[slug]`.
 *
 * Makro-yapı: Map / Diagram. Brief'in açık isteği: "Pistler basit metin
 * tablosu olmamalı. Pist çizimi kompozisyonun merkezinde olsun."
 *
 * Çizim `trackSvgPath` + `trackSvgViewBox`ten geliyor; virajlar kendi
 * `markerX/markerY` konumlarıyla ÇİZİMİN ÜSTÜNE oturuyor — yani SVG bir
 * resim olmaktan çıkıp okunabilir bir metne dönüşüyor. Path yoksa çizim
 * bölümü HİÇ çizilmiyor (boş oda yasağı); künye ve anlatı yine durur.
 */
export default async function CircuitPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  let data;
  try {
    data = await fetchCircuit(slug);
  } catch {
    notFound();
  }

  const { circuit, moments, quotes, results, images } = data;
  const t = await getTranslations({ locale, namespace: "sportArchive" });

  /**
   * Ülke şeridi — hero'nun zemini.
   * Bayrak GÖRSELİ değil, bayrağın geometrisi: koyu zemine düşük yoğunlukta
   * alanlar. Ülke listede yoksa şerit hiç çizilmiyor.
   */
  const flag = flagBands(circuit.countryCode);

  /**
   * PİST ÇİZİMİ — DEĞİŞTİRİLEBİLİR OLMASI İSTENEN YER.
   *
   * İki kaynak, öncelik sırasıyla:
   *   1. `SportImage` (slot = "TRACK") — panelden yüklenen bir görsel.
   *      Beğenilmeyen çizimi değiştirmenin yolu bu: yeni görseli TRACK
   *      yuvasına yükle, kod değişmeden yerine geçer.
   *   2. `F1Circuit.trackSvgPath` + `trackSvgViewBox` — tek çizgi SVG.
   *
   * İkisi de yoksa çizim bölümü HİÇ çizilmiyor; künye ve anlatı yine durur.
   */
  const trackImage = (images ?? []).find((image) => image.slot === "TRACK");
  const hasSvg = Boolean(circuit.trackSvgPath && circuit.trackSvgViewBox);
  const hasDrawing = Boolean(trackImage) || hasSvg;

  /**
   * VERİ KATMANI — podyum tarihi.
   *
   * Brief: "Veri katmanı asla hero'da veya sayfanın üst üçte birinde yer
   * almaz. Sayfanın alt bölümünde, sessiz tipografiyle, kendi kapalı
   * alanında durur." Bu bölüm sayfanın en altında ve varsayılan olarak
   * KAPALI (`<details>`) — açmak ziyaretçinin kararı.
   *
   * 75 yılı tabloya çevirmemek için: her yıl tek bir satır, sayfada üst
   * üste 75 satır. Bu bir "veri ızgarası" değil, bir DOKU — taş levhaya
   * kazınmış isimler gibi okunuyor. Sayının çokluğu kusur değil, ifadenin
   * kendisi.
   *
   * Anlatısı yazılmış yıllar işaretli: veri katmanı böylece anlatının
   * rakibi olmaktan çıkıp ona hizmet ediyor — "bu 75 yılın şunları hakkında
   * yazdım" demenin görsel yolu.
   *
   * `<details>` bilinçli: istemci JS'i gerekmiyor, CSP engeli etkilemiyor,
   * klavyeyle çalışıyor.
   */
  const anlatisiOlanYillar = new Set(moments.map((m) => m.seasonYear));
  /* `?? []` süs değil: yanıtlar `revalidate: 300` ile önbelleklenıyor, yani
     backend'e yeni bir alan eklendiğinde ön yüz bir süre ESKİ biçimi okumaya
     devam ediyor. Bu tam olarak burada patladı (TypeError: results is not
     iterable). Yeni alanlar her zaman yokmuş gibi karşılanmalı. */
  const yillar = new Map<number, NonNullable<typeof results>>();
  for (const row of results ?? []) {
    const liste = yillar.get(row.seasonYear) ?? [];
    liste.push(row);
    yillar.set(row.seasonYear, liste);
  }

  const nickname = pick(locale, circuit.nicknameTr, circuit.nicknameEn);
  const narrative = pick(locale, circuit.narrativeTr, circuit.narrativeEn);
  const context = pick(locale, circuit.contextTr, circuit.contextEn);
  const personal = pick(locale, circuit.personalNoteTr, circuit.personalNoteEn);

  const lengthKm =
    circuit.lengthMeters != null
      ? `${(circuit.lengthMeters / 1000).toLocaleString(
          locale === "en" ? "en-GB" : "tr-TR",
          { minimumFractionDigits: 3, maximumFractionDigits: 3 },
        )} km`
      : null;

  // Künye satırı: ülke · uzunluk · viraj — kutu değil, tek satır
  const meta = [circuit.countryCode, lengthKm, circuit.cornerCount ? `${circuit.cornerCount} ${t("circuit.corners").toLowerCase()}` : null]
    .filter(Boolean)
    .join(" · ");

  // Çizimin üstüne oturabilecek virajlar: konumu olanlar
  const placed = circuit.corners.filter(
    (c) => c.markerX != null && c.markerY != null,
  );

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
            data-dir={flag.direction}
            aria-hidden
            style={{
              backgroundImage: `linear-gradient(${flag.direction === "vertical" ? "to right" : "to bottom"}, ${flag.colors
                .map((c, i) => {
                  const from = (i / flag.colors.length) * 100;
                  const to = ((i + 1) / flag.colors.length) * 100;
                  return `${c} ${from}%, ${c} ${to}%`;
                })
                .join(", ")})`,
            }}
          />
        ) : null}
        <h1 className={`${shell.display} ${shell.world}`}>{circuit.name}</h1>
        {nickname ? <p className={styles.nickname}>{nickname}</p> : null}
        {meta ? <p className={shell.data}>{meta}</p> : null}
      </header>

      {/* ── Çizim: kompozisyonun merkezi ── */}
      {hasDrawing ? (
        <Reveal as="section" className={styles.diagram}>
          <figure className={styles.figure}>
            {trackImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={apiUrl(trackImage.url)}
                alt={pick(locale, trackImage.altTr, trackImage.altEn) || circuit.name}
                className={styles.trackPhoto}
              />
            ) : (
            <svg
              viewBox={circuit.trackSvgViewBox ?? undefined}
              className={styles.track}
              role="img"
              aria-label={`${circuit.name} — ${t("circuit.index")}`}
            >
              <path
                d={circuit.trackSvgPath ?? undefined}
                className={styles.trackPath}
              />
              {placed.map((corner) => (
                <g key={corner.id}>
                  <circle
                    cx={corner.markerX ?? 0}
                    cy={corner.markerY ?? 0}
                    r={5}
                    className={styles.marker}
                  />
                  {/* Numara çizimin üstünde: SVG bir resim olmaktan çıkıp
                      aşağıdaki viraj listesiyle konuşan bir şemaya dönüşüyor */}
                  {corner.number ? (
                    <text
                      x={(corner.markerX ?? 0) + 12}
                      y={(corner.markerY ?? 0) + 5}
                      className={styles.markerNo}
                    >
                      {corner.number}
                    </text>
                  ) : null}
                </g>
              ))}
            </svg>
            )}
            <figcaption className={shell.data}>
              {[
                circuit.officialName,
                circuit.isClockwise === null
                  ? null
                  : circuit.isClockwise
                    ? t("circuit.clockwise")
                    : t("circuit.counterClockwise"),
              ]
                .filter(Boolean)
                .join(" · ")}
            </figcaption>
          </figure>

          {/* Künye çizimin yanında, sessiz mono sütun */}
          <dl className={styles.specs}>
            {circuit.firstGrandPrixYear ? (
              <div>
                <dt>{t("circuit.firstGp")}</dt>
                <dd className={shell.figure}>{circuit.firstGrandPrixYear}</dd>
              </div>
            ) : null}
            {circuit.lapRecordTime ? (
              <div>
                <dt>{t("circuit.lapRecord")}</dt>
                <dd className={shell.figure}>
                  {circuit.lapRecordTime}
                  {circuit.lapRecordDriver ? (
                    <span className={styles.recordHolder}>
                      {circuit.lapRecordDriver.name}
                      {circuit.lapRecordYear ? ` · ${circuit.lapRecordYear}` : ""}
                    </span>
                  ) : null}
                </dd>
              </div>
            ) : null}
            {circuit.drsZones ? (
              <div>
                <dt>{t("circuit.drsZones")}</dt>
                <dd className={shell.figure}>{circuit.drsZones}</dd>
              </div>
            ) : null}
          </dl>
        </Reveal>
      ) : null}

      <div className={styles.body}>
        {narrative ? (
          <Reveal as="section" className={styles.section}>
            <p className={shell.prose}>{narrative}</p>
            {context ? (
              <p className={`${shell.prose} ${styles.context}`}>{context}</p>
            ) : null}
          </Reveal>
        ) : null}

        {/* Adı olan virajlar */}
        {circuit.corners.length > 0 ? (
          <Reveal as="section" className={styles.section}>
            <h2 className={`${shell.display} ${shell.section}`}>
              {t("circuit.cornerList")}
            </h2>
            <ul className={styles.corners}>
              {circuit.corners.map((corner) => (
                <li key={corner.id}>
                  <span className={`${shell.figure} ${styles.cornerNo}`}>
                    {corner.number ?? "—"}
                  </span>
                  <div>
                    <h3 className={styles.cornerName}>
                      {corner.name ??
                        pick(locale, corner.nicknameTr, corner.nicknameEn)}
                    </h3>
                    {pick(locale, corner.noteTr, corner.noteEn) ? (
                      <p className={styles.cornerNote}>
                        {pick(locale, corner.noteTr, corner.noteEn)}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {/* Burada yaşananlar */}
        {moments.length > 0 ? (
          <Reveal as="section" className={styles.section}>
            <h2 className={`${shell.display} ${shell.section}`}>
              {t("circuit.moments")}
            </h2>
            <ol className={styles.moments}>
              {moments.map((moment) => (
                <li key={moment.id} className={styles.moment}>
                  <span className={`${shell.figure} ${styles.momentYear}`}>
                    {moment.seasonYear}
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

        {personal ? (
          <Reveal as="section" className={styles.section}>
            <h2 className={shell.eyebrow}>{t("legend.personalNote")}</h2>
            <blockquote className={styles.personal}>
              <p>{personal}</p>
            </blockquote>
          </Reveal>
        ) : null}

        {/* ── VERİ KATMANI — sayfanın en altı, kendi kapalı alanı ── */}
        {(results ?? []).length > 0 ? (
          <Reveal as="section" className={styles.section}>
            <PodiumStage
              results={results ?? []}
              narratedYears={anlatisiOlanYillar}
              idPrefix={`podyum-${circuit.slug}`}
              labels={{
                podiums: t("circuit.podiums"),
                range: t("circuit.podiumRange", {
                  from: Math.min(...yillar.keys()),
                  to: Math.max(...yillar.keys()),
                  count: yillar.size,
                }),
                source: t("circuit.source"),
                narrated: t("circuit.narratedYear"),
              }}
            />
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
                    {quote.attribution ? (
                      <footer className={shell.data}>{quote.attribution}</footer>
                    ) : null}
                  </blockquote>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </div>
    </main>
  );
}
