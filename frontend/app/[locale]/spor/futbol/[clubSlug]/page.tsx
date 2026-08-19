import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { fetchClub, pick, type FootballEra } from "@/lib/api/sport-archive";
import { fetchClubLive } from "@/lib/api/football-live";
import { readIsAdmin } from "@/lib/auth/session";
import { sportHref } from "@/lib/sport/routes";
import { Reveal } from "@/components/sport/Reveal";
import { LiveSeason } from "@/components/sport/football/LiveSeason";
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
 * ── SAYFANIN İKİ YARISI ──────────────────────────────────────────────────
 * ÜST: yaşayan sezon. Maç günü hero'su, haber şeridi, fikstür, puan durumu,
 *      istatistik, kadro, stadyum. Kaynağı `football-live` ucu.
 * ALT: arşiv. Dönem omurgası, efsaneler, anlar, alıntılar. Kaynağı küratör.
 *
 * Bu ayrım brief'in omurgası: "RAMS Park'a dijital olarak girmişim ve
 * 2026-27 sezonunu canlı deneyimliyorum" hissi üstte, kulüp kimliği ve tarih
 * altta. Görsel dil de bu ayrımı izliyor — üstte sinematik ve markanın tam
 * doygunluğu, altta kanadın sessiz editoryal sesi.
 *
 * ── ESKİ KARARIN GERİ ALINMASI ───────────────────────────────────────────
 * Bu dosyada daha önce şu not vardı: "Veri katmanı (kadro/puan durumu/
 * fikstür) YOK: API-Football ücretsiz planı 2026 sezonunu vermiyor
 * (ölçüldü)". Ölçüm doğruydu ve HÂLÂ doğru — ama yanlış sonuca varmıştı:
 * eksik olan sezon verisi değil, DOĞRU KAYNAKTI. 19 Ağustos 2026'da beş
 * kaynak ölçüldü ve ligin resmî kayıt tutucusu (TFF) 34 haftanın tamamını,
 * 18 takımlık puan cetvelini ve maç detaylarını ücretsiz, anahtarsız ve bot
 * korumasız veriyor. Veri katmanı o kaynağın üstüne kuruldu.
 *
 * ── HATA DAVRANIŞI ───────────────────────────────────────────────────────
 * Arşiv verisi ZORUNLU: yoksa 404 (sayfanın konusu o kulüp). Canlı veri
 * İSTEĞE BAĞLI: ucu düşerse `LiveSeason` null dönüyor, sayfa arşiv düzeniyle
 * açılıyor. Bir veri kaynağının kesintisi kürasyonu görünmez yapmamalı.
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

  // ⚠️ CANLI VERİ ÖNCE BAŞLATILIYOR, SONRA BEKLENİYOR — arşiv isteğiyle
  // paralel koşsun diye. `.catch()` hemen bağlanıyor: `notFound()` önce
  // fırlarsa bu promise sahipsiz kalmasın (unhandled rejection).
  const livePromise = fetchClubLive(clubSlug).catch(() => null);
  // Küratör düğmesinin görünürlüğü; yetkinin kapısı backend'de.
  const isAdmin = await readIsAdmin();

  const { club, eras, quotes } = data;
  const t = await getTranslations({ locale, namespace: "sportArchive" });

  // Tek bir "şimdi": sunucu ve istemci aynı ana baksın diye render başında
  // bir kez alınıp aşağıya prop olarak veriliyor. Bileşen içinde `Date.now()`
  // çağırmak hidrasyon uyuşmazlığı üretirdi.
  const now = Date.now();

  // `filter(Boolean)` tipi daraltmıyor — TS sonucu hâlâ (string|null)[]
  // sayıyor. Tip koruyucu yazmak, `as string[]` demekten iyi: burada gerçekten
  // null eleniyor ve derleyici bunu doğruluyor.
  const meta = [
    club.foundedYear ? `${t("club.founded")} ${club.foundedYear}` : null,
    club.cityName,
    club.stadiumName,
  ].filter((value): value is string => Boolean(value));

  const intro = pick(locale, club.narrativeTr, club.narrativeEn);

  return (
    <main className={styles.page} data-club={clubSlug.toLowerCase()}>
      <nav className={shell.crumb} aria-label="breadcrumb">
        <Link href={sportHref.root()}>{t("backToSport")}</Link>
        <span className={shell.sep}>/</span>
        <Link href={sportHref.football()}>{t("backToFootball")}</Link>
      </nav>

      {/* ══════════ ÜST YARI — YAŞAYAN SEZON ══════════

          ⚠️ `<Suspense>` YOK ve bu ÖLÇÜLMÜŞ bir karar.

          Önce bir iskelet + Suspense sınırı yazıldı (brief 28). İki tur ölçüm
          onu geri aldırdı:

          1. İlk deneme `loading.tsx` idi. Segmentin tamamı akmaya başlayınca
             statü 200 gönderiliyor ve sonra çalışan `notFound()` arayüzü
             çiziyor ama statüyü değiştiremiyordu: `/spor/futbol/olmayan-kulup`
             404 yerine 200 döndü (kardeş sayfalar doğru 404 verirken).
          2. İkinci deneme sayfa içinde `<Suspense>` idi; 404 düzeldi ama bu
             sefer canlı yarının HTML'i `<div hidden>` bloklarına düştü ve
             ancak istemci JS'i onları yerine koyuyordu. Yani JS çalışmayan
             ziyaretçi sayfanın YARISINI hiç görmüyordu — bu kanat tam da
             bunu önlemek için `PodiumStage`i salt-CSS yazmış.

          Karar ölçüye dayanıyor: `/football-live/club/...` ucu **3-4 ms**
          sürüyor (backend dış API'ye çıkmıyor, tek Postgres cache okuması —
          kural 4/14), sayfanın tamamı 37 ms. 3 ms'lik bir bekleme için
          gösterilecek iskelet hiçbir zaman görünmez; karşılığında JS'siz
          ziyaretçiye içeriğin yarısını kaybettirirdi.

          Kulüpte canlı katman yoksa (arşivdeki başka bir kulüp ya da uç
          kesintisi) `LiveSeason` sade künye hero'sunu çiziyor — sayfanın
          `<h1>`'i her koşulda orada. */}
      <LiveSeason
        isAdmin={isAdmin}
        overviewPromise={livePromise}
        locale={locale}
        clubSlug={clubSlug}
        clubName={club.name}
        clubMeta={meta}
        now={now}
      />

      {/* ══════════ ALT YARI — ARŞİV ══════════
          ⚠️ BAŞLIK YOK ve bu bilinçli: sayfanın tek `<h1>`'i `LiveSeason`da
          (gerekçesi orada yazılı — iki `<h1>` ölçümle bulunmuş bir hataydı).
          Buradaki blok küratörün açılış metni; kendi başlığını taşımıyor,
          çünkü altındaki dönem omurgası zaten `<h2>` başlıklarla ilerliyor. */}
      {intro ? (
        <section className={styles.introBlock}>
          <p className={`${shell.prose} ${styles.intro}`}>{intro}</p>
        </section>
      ) : null}

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
