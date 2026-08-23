import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { fetchCategories } from "@/lib/api/universes";
import Image from "next/image";
import { apiUrl, isLocalUpload } from "@/lib/api/client";
import { fetchSportOverview } from "@/lib/api/sport-archive";
import { readIsAdmin } from "@/lib/auth/session";
import { hallLabel, hallNumber } from "@/lib/halls";
import { legendHref, sportHref } from "@/lib/sport/routes";
import { shareCard } from "@/lib/seo";
import { flagGradient, sportFlag } from "@/lib/sport/flags";
import { Reveal } from "@/components/sport/Reveal";
import { SportChronology } from "@/components/sport/SportChronology";
import { SportCuratorSwitch } from "@/components/sport/SportCuratorSwitch";
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
  const title = t("football.name") + " · " + t("f1.name");
  const description = t("lede");
  return {
    title,
    description,
    ...shareCard({ title, description, locale, path: sportHref.root() }),
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
 * Bant görselinin kırpma ayarları → CSS değişkenleri.
 *
 * ⚠️ KALIP BURADA DA DOĞRULANIYOR. Değer backend'de zaten doğrulanıyor
 * (`SetSportCoverFocusDto`) ama buraya veritabanından geliyor ve doğrudan
 * `style` niteliğine yazılıyor. Veriye "nasılsa yazarken denetlendi" diye
 * güvenmek, denetimin eklendiği tarihten ESKİ satırları ve elle yazılmış
 * kayıtları atlar. Müzik kanadındaki bant da aynı sebeple iki kez denetliyor.
 *
 * Bozuk değer sessizce yok sayılıyor: bant yine çiziliyor, yalnızca
 * varsayılan kırpmayla. Boş oda yasağının kırpma hâli.
 */
function coverVars(
  cover: string,
  position?: string | null,
  scale?: number | null,
): CSSProperties {
  const vars: Record<string, string> = {
    "--art": `url("${apiUrl(cover)}")`,
  };
  if (position && /^\d{1,3}% \d{1,3}%$/.test(position)) {
    vars["--art-pos"] = position;
  }
  // 100 = büyütme yok; altına inen değer bandın altını açardı
  if (typeof scale === "number" && scale >= 100 && scale <= 300) {
    vars["--art-zoom"] = String(scale / 100);
  }
  return vars as CSSProperties;
}

/** 5793 → "5.793 km". F1 tarafının ölçüm dili — km'ye çevirip yerelleştirir. */
function km(meters: number | null | undefined, locale: string): string | null {
  if (meters == null) return null;
  return `${(meters / 1000).toLocaleString(locale === "en" ? "en-GB" : "tr-TR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })} km`;
}

/**
 * Sayfa 1 — `/spor`.
 *
 * ── DÖRT HAREKET, DÖRDÜ DE YAPI OLARAK FARKLI ────────────────────────────
 *   1. AÇILIŞ      cümle + koleksiyon künyesi   (metin, sola dayalı, sessiz)
 *   2. DÜNYALAR    iki tam-en bant + görsel     (gürültülü, dönüşümlü hizalı)
 *   3. KRONOLOJİ   yatay, iki şeritli, süzgeçli (ölçülü, uzun, sakin)
 *   4. PANTEON     portre kapakları             (kapanış, ortalanmış)
 *
 * Ritim bilinçli: sessiz → gürültülü → uzun/sakin → gürültülü.
 *
 * ── UCU AÇIK KÜNYE ───────────────────────────────────────────────────────
 * Künye "1905 – ∞" yazıyor, "1905–2025" değil. Sebep küratörün kendi
 * cümlesi: arşiv güncelleniyor. Kapalı bir aralık, bitmiş bir koleksiyon
 * anlamına gelirdi; sonsuz işareti bir süs değil, doğru bilgi.
 *
 * ── BOŞ ODA YASAĞI HER YERDE ─────────────────────────────────────────────
 * Her hareket kendi verisi geldiyse çiziliyor. Backend eski sürümdeyse
 * (iki servis tek push'ta deploy oluyor, pencere kaçınılmaz) sayfa sessizce
 * cümle + iki kapıya düşüyor, çökmüyor.
 */
export default async function SportLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sportArchive" });

  // Üç kaynak birbirinden bağımsız — tek turda, paralel (2026-08-22; eskiden
  // overview bitmeden etiket ve admin okuması başlamıyordu).
  const [overview, label, isAdmin] = await Promise.all([
    fetchSportOverview().catch(
      (): Awaited<ReturnType<typeof fetchSportOverview>> => ({
        // sessiz — açılış cümlesi tek başına da bir sayfadır
        footballClubs: 0,
        f1Circuits: 0,
      }),
    ),
    getHallLabel(),
    readIsAdmin(),
  ]);

  const counts = overview.counts;
  const club = overview.football?.featuredClub ?? null;
  const legend = overview.football?.featuredLegend ?? null;
  const circuit = overview.f1?.featuredCircuit ?? null;
  const chronology = overview.chronology ?? [];
  const legends = overview.legends ?? [];

  // Koleksiyon künyesi: SIFIR OLAN SATIR HİÇ YAZILMIYOR. "0 efsane" yazan bir
  // arşiv künyesi, o satırın orada olmamasından daha çok boşluk anlatır.
  const ledgerRows = counts
    ? ([
        [counts.worlds, t("index.worlds")],
        [counts.clubs, t("index.clubs")],
        [counts.legends, t("index.legends")],
        [counts.circuits, t("index.circuits")],
        [counts.moments, t("index.moments")],
      ] as const).filter(([n]) => n > 0)
    : [];

  /**
   * Arşivin BAŞLANGICI. Ucu bilinçli olarak yazılmıyor — künye "∞" basıyor.
   * En erken tarih hem kronolojiden hem senkronize sezonlardan hem kulübün
   * kuruluşundan aranıyor: yalnızca anlatıyı sayan bir başlangıç, elindeki
   * verinin bir bölümünü görünmez yapardı.
   */
  const reach = [
    chronology.length ? chronology[0].year : null,
    overview.f1?.seasonFrom ?? null,
    club?.foundedYear ?? null,
  ].filter((y): y is number => typeof y === "number");
  const archiveFrom = reach.length ? Math.min(...reach) : null;

  const clubCover = club?.coverImage ?? null;
  const circuitCover = circuit?.coverImage ?? null;

  return (
    <div className={styles.page}>
      {/* Kırıntı: salon kimliğini taşıyan gezinme satırı. Diğer spor
          sayfalarıyla aynı desen — başlık üstü süs değil. */}
      <nav className={shell.crumb} aria-label="breadcrumb">
        <Link href="/dark-stories">KuroNexus</Link>
        <span className={shell.sep}>/</span>
        <span>{label ? t("eyebrow", { num: label }) : t("name")}</span>
      </nav>

      {/* ══ 1. AÇILIŞ — cümle başlıktır, künye onu ölçer ══ */}
      <header className={styles.opening}>
        <h1 className={`${shell.display} ${styles.statement}`}>{t("lede")}</h1>

        {/* Müze duvarındaki "bu salonda ne var" satırı.
            ⚠️ 4'lü istatistik ızgarası DEĞİL: bugün değerlerin çoğu "1" ve
            dev puntolu kutularda üç tane "1" arşivi büyük değil BOŞ gösterir.
            Tek satırlık künye ölçüyü dürüstçe verir ve veri arttıkça (17
            efsane, 26 pist) aynı biçim büyümeyi kendiliğinden taşır. */}
        {ledgerRows.length > 0 ? (
          <dl className={styles.ledger}>
            {ledgerRows.map(([value, unit]) => (
              <div key={unit} className={styles.ledgerCell}>
                <dt className={`${shell.figure} ${styles.ledgerValue}`}>
                  {value}
                </dt>
                <dd className={styles.ledgerUnit}>{unit}</dd>
              </div>
            ))}
            {archiveFrom != null ? (
              <div className={`${styles.ledgerCell} ${styles.ledgerSpan}`}>
                <dt
                  className={`${shell.figure} ${styles.ledgerValue}`}
                  aria-label={`${archiveFrom} — ${t("club.ongoing")}`}
                >
                  {archiveFrom}
                  <span className={styles.forever} aria-hidden>
                    –∞
                  </span>
                </dt>
                <dd className={styles.ledgerUnit}>{t("index.span")}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}
      </header>

      {/* ══ 2. DÜNYALAR ══ */}
      {overview.footballClubs > 0 || overview.f1Circuits > 0 ? (
        <h2 className={`${shell.eyebrow} ${styles.worldsLabel}`}>
          {t("worlds")}
        </h2>
      ) : null}

      {/* Futbol: metin solda, görsel SAĞDA ve sola doğru soluklaşıyor */}
      {overview.footballClubs > 0 ? (
        <Reveal as="section" className={styles.band}>
          {clubCover ? (
            <span className={styles.bandArt} aria-hidden>
              <span
                className={styles.bandArtInner}
                style={coverVars(
                  clubCover,
                  club?.coverPosition,
                  club?.coverScale,
                )}
              />
            </span>
          ) : null}

          <Link href={sportHref.football()} className={styles.bandLink}>
            <h3 className={`${shell.display} ${styles.world}`}>
              {t("football.name")}
            </h3>
            <p className={styles.tagline}>{t("football.tagline")}</p>
            <span className={styles.rule} aria-hidden />

            {/* Kapının ardındaki İSİMLER. Bant artık "Futbol → Gir" demiyor,
                ne bulacağını söylüyor. */}
            {club || legend ? (
              <span className={`${shell.data} ${styles.contents}`}>
                {[club?.name, legend?.name].filter(Boolean).join(" · ")}
              </span>
            ) : null}

            <span className={`${shell.data} ${styles.enter}`}>{t("enter")}</span>
          </Link>
        </Reveal>
      ) : null}

      {/* Formula 1: metin sağda, görsel SOLDA ve sağa doğru soluklaşıyor */}
      {overview.f1Circuits > 0 ? (
        <Reveal as="section" className={`${styles.band} ${styles.bandRight}`}>
          {circuitCover ? (
            <span className={styles.bandArt} aria-hidden>
              <span
                className={styles.bandArtInner}
                style={coverVars(
                  circuitCover,
                  circuit?.coverPosition,
                  circuit?.coverScale,
                )}
              />
            </span>
          ) : null}

          <Link href={sportHref.f1()} className={styles.bandLink}>
            <h3 className={`${shell.display} ${styles.world}`}>{t("f1.name")}</h3>
            <p className={styles.tagline}>{t("f1.tagline")}</p>
            <span className={`${styles.rule} ${styles.ruleF1}`} aria-hidden />

            {/* Futbol İSİM veriyor, F1 ÖLÇÜ veriyor — iki dünyanın dili
                burada da ayrışıyor. Sezon aralığı da ucu açık: senkronizasyon
                her yıl bir satır daha getiriyor. */}
            {circuit || overview.f1?.seasonFrom ? (
              <span className={`${shell.data} ${styles.contents}`}>
                {[
                  circuit?.name,
                  km(circuit?.lengthMeters, locale),
                  overview.f1?.seasonFrom
                    ? `${overview.f1.seasonFrom}–∞`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            ) : null}

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

      {/* ══ 3. KRONOLOJİ — yatay, iki şeritli, süzgeçli ══ */}
      {chronology.length > 1 ? (
        <Reveal as="section" className={styles.chronology}>
          <header className={styles.chronoHead}>
            <h2 className={`${shell.display} ${shell.section}`}>
              {t("chronology.title")}
            </h2>
            <p className={`${shell.data} ${styles.chronoNote}`}>
              {t("chronology.note", {
                count: chronology.length,
                from: chronology[0].year,
                to: chronology[chronology.length - 1].year,
              })}
            </p>
          </header>

          <SportChronology entries={chronology} />
        </Reveal>
      ) : null}

      {/* ══ 4. PANTEON — kapanış ══ */}
      {legends.length > 0 ? (
        <Reveal as="section" className={styles.pantheon}>
          <header className={styles.pantheonHead}>
            <h2 className={`${shell.display} ${shell.section}`}>
              {t("hub.legends")}
            </h2>
            <p className={styles.pantheonLede}>{t("pantheon.lede")}</p>
          </header>

          <ul className={styles.faces} data-count={Math.min(legends.length, 4)}>
            {legends.map((person) => {
              // Küratörün ülke kodu yoksa uyruk sözcüğünden aranıyor —
              // senkronizasyon sürücüye kod yazmıyor (bkz. flags.ts)
              const bands = sportFlag(person.countryCode, person.nationality);
              /**
               * ⚠️ KÜNYESİ EKSİK COMMONS PORTRESİ ÇİZİLMEZ.
               * Lisans + sanatçı + kaynak üçü birden dolu değilse görsel
               * gösterilmiyor; atıfsız yayın, telifli görseli izinsiz
               * kullanmakla aynı kapıya çıkar. Küratörün kendi yüklediği
               * portrede üçü de boş gelir — o görselin sahibi arşivin kendisi,
               * `needsCredit` yalnızca lisans alanı DOLUYKEN devreye giriyor.
               */
              const needsCredit = Boolean(person.portraitLicense);
              const creditComplete =
                Boolean(person.portraitLicense) &&
                Boolean(person.portraitAuthor) &&
                Boolean(person.portraitSourceUrl);
              const showPortrait =
                Boolean(person.portrait) && (!needsCredit || creditComplete);

              return (
                <li key={`${person.world}-${person.slug}`} className={styles.face}>
                  <Link
                    href={legendHref(person.world, person.slug)}
                    className={styles.faceLink}
                    /* Künye filigranı bağlantının İÇİNDE (çerçeveye
                       gömülü) — açık ad verilmezse ekran okuyucu
                       bağlantıyı 'OGL 3 · Number 10 LEWIS HAMILTON' diye
                       okur. Ölçüldü, 14 Ağustos. Künye DOM'da kalıyor
                       (lisans şartı), yalnızca bağlantının adı olmaktan
                       çıkıyor. */
                    aria-label={person.name}
                  >
                    <span className={styles.frame} data-world={person.world}>
                      {showPortrait ? (
                        /* next/image'e 2026-08-22'de çevrildi: ham <img>
                           orijinal dosyayı indiriyordu. Çerçeve 3/4 oranlı
                           ~150-200 px kutu → sizes sabit px (ev kuralı);
                           karar ham yoldan (PersonHall deseni). */
                        <Image
                          className={styles.portrait}
                          src={apiUrl(person.portrait as string)}
                          alt={person.name}
                          fill
                          sizes="200px"
                          unoptimized={!isLocalUpload(person.portrait as string)}
                        />
                      ) : (
                        /* Portresi inmemiş efsane: boş kutu değil DOKU.
                           Müzik salonundaki "kapağı inmemiş albüm" deseninin
                           aynısı — yuva görünür kalıyor, görsel gelince
                           kod değişmeden yerine oturuyor. */
                        <span className={styles.hatch} aria-hidden>
                          <span className={styles.initial}>
                            {person.name.slice(0, 1)}
                          </span>
                        </span>
                      )}

                      {bands ? (
                        <span
                          className={styles.faceFlag}
                          aria-hidden
                          style={{
                            backgroundImage: flagGradient(bands, "across"),
                          }}
                        />
                      ) : null}

                      {/* Künye artık kartın altında değil GÖRSELİN ÜSTÜNDE,
                          filigran gibi. Kart "sadece ad" olsun diye taşındı
                          (kullanıcı isteği) ama SİLİNEMEZ: CC BY / OGL atfı
                          lisans şartı. Bağlantı DEĞİL düz metin — çerçeve
                          zaten bir <a> içinde ve iç içe iki bağlantı geçersiz
                          HTML olurdu. Kaynağa giden bağlantılı tam künye
                          efsanenin kendi sayfasında duruyor. */}
                      {showPortrait && creditComplete ? (
                        <span className={styles.credit}>
                          {person.portraitLicense}
                          {" · "}
                          {person.portraitAuthor}
                        </span>
                      ) : null}
                    </span>

                    {/* Levhada YALNIZCA AD. Lakap, kulüp ve yıl aralığı
                        efsanenin kendi sayfasında zaten var; panteon bir
                        künye listesi değil, kapanış duvarı. */}
                    <span className={`${shell.display} ${styles.faceName}`}>
                      {person.name}
                    </span>
                  </Link>

                </li>
              );
            })}
          </ul>
        </Reveal>
      ) : null}

      {/* Küratör anahtarı — ziyaretçi bu bileşeni HİÇ indirmiyor. Yetkinin
          gerçek kapısı backend'de (`@Roles('ADMIN')`); bu yalnızca düğme. */}
      {isAdmin ? (
        <section className={styles.curator}>
          <SportCuratorSwitch />
        </section>
      ) : null}
    </div>
  );
}
