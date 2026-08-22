import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { fetchF1Hub, pick, type F1LedgerRow } from "@/lib/api/sport-archive";
import { sportHref } from "@/lib/sport/routes";
import { shareCard } from "@/lib/seo";
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
  const title = t("f1.name");
  const description = t("f1.lede");
  return {
    title,
    description,
    ...shareCard({ title, description, locale, path: sportHref.f1() }),
  };
}

/** 5793 → "5.793 km" — km'ye çevirip yerel ayırıcıyla yazar. */
function km(meters: number | null, locale: string): string | null {
  if (meters == null) return null;
  return `${(meters / 1000).toLocaleString(locale === "en" ? "en-GB" : "tr-TR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })} km`;
}

/** "1996–2001" · tek yıla düşen kayıt tire almıyor. */
function span(from: number | null, to: number | null): string | null {
  if (from == null) return null;
  if (to == null || to === from) return String(from);
  return `${from}–${to}`;
}

/**
 * Sayfa 5 — `/spor/formula-1`.
 *
 * Makro-yapı: Index-First. Sayfanın KENDİSİ bir dizin. Futbol hub'ıyla
 * kategorik olarak zıt: orada anlatı yüzeyleri, burada ölçüm.
 *
 * ── DEFTER EKLENDİ (13 Ağustos 2026) ─────────────────────────────────────
 * Sayfa tek bir pist tablosuydu; "Formula 1 arşivi" değil "bir pist tablosu"
 * gibi okunuyordu. Eksik olan içerik DEĞİLDİ — `F1RaceResult` senkronize
 * edilmiş yüzlerce podyum satırı taşıyor ve hiçbir sayfa onu okumuyordu.
 *
 * Şimdi üç dizin var ve üçü de aynı biçimde DEĞİL:
 *   · PİSTLER      künye tablosu   — hizalı sütun, satır başına bir kapı
 *   · KAZANANLAR   sıralı defter   — ad + galibiyeti kadar uzayan kılcal çizgi
 *   · TAKIMLAR     yoğun liste     — çizgi yok; aynı formu iki kez kullanmamak
 *                                    için kasten daha sıkı ve sessiz
 *
 * ⚠️ SÜRÜCÜ VE TAKIM SATIRLARI TÜRETİLMİŞ. Elle yazılmış tek sayı yok;
 * hepsi podyum kayıtlarından `position = 1` süzgeciyle sayıldı. Sayfa bunu
 * altındaki künyede AÇIKÇA söylüyor — türetilmiş bir sayıyı küratör kararı
 * gibi göstermek arşivin en pahalı yalanı olurdu.
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

  const ledger = hub.ledger;
  const winners = ledger?.winners ?? [];
  const constructors = ledger?.constructors ?? [];
  // Çizgi uzunluğunun ölçeği: listedeki en çok galibiyet tam eni alıyor
  const topWins = Math.max(1, ...winners.map((w) => w.wins));

  return (
    <main className={styles.page}>
      <nav className={shell.crumb} aria-label="breadcrumb">
        <Link href={sportHref.root()}>{t("backToSport")}</Link>
      </nav>

      <header className={styles.head}>
        <h1 className={`${shell.display} ${shell.title}`}>{t("f1.name")}</h1>
        <p className={shell.lede}>{t("f1.lede")}</p>

        {/* Kapsam satırı: sayfanın neyi kapsadığını daha okumaya başlamadan
            söyler. Ölçüm dili — Bebas rakam, mono etiket, kılcal ayraç. */}
        {ledger && ledger.raceCount > 0 ? (
          <dl className={styles.scope}>
            <div className={styles.scopeCell}>
              <dt className={`${shell.figure} ${styles.scopeValue}`}>
                {ledger.raceCount}
              </dt>
              <dd className={styles.scopeUnit}>{t("ledger.races")}</dd>
            </div>
            {ledger.seasonFrom && ledger.seasonTo ? (
              <div className={styles.scopeCell}>
                <dt className={`${shell.figure} ${styles.scopeValue}`}>
                  {ledger.seasonFrom}–{ledger.seasonTo}
                </dt>
                <dd className={styles.scopeUnit}>{t("ledger.seasons")}</dd>
              </div>
            ) : null}
            <div className={styles.scopeCell}>
              <dt className={`${shell.figure} ${styles.scopeValue}`}>
                {ledger.podiumNameCount}
              </dt>
              <dd className={styles.scopeUnit}>{t("ledger.names")}</dd>
            </div>
          </dl>
        ) : null}
      </header>

      {/* ══ Dizin 1 · PİSTLER — künye tablosu ══
          Tek satır varken bile tablo başlığı duruyor: dizinin ŞEKLİ arşivin
          sözü, satır sayısı değil. */}
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
                <th scope="col" className={styles.num}>
                  {t("circuit.lapRecord")}
                </th>
              </tr>
            </thead>
            <tbody>
              {hub.circuits.map((circuit) => {
                const nickname = pick(
                  locale,
                  circuit.nicknameTr,
                  circuit.nicknameEn,
                );
                return (
                  <tr key={circuit.slug}>
                    <td>
                      <Link
                        href={sportHref.circuit(circuit.slug)}
                        className={styles.circuitLink}
                      >
                        {circuit.name}
                      </Link>
                      {/* Takma ad pistin RUHU (bkz. şema yorumu) — künyenin
                          içinde, adın altında, sessiz. Ayrı sütun olsaydı
                          ölçüm sütunlarıyla aynı ağırlığa çıkardı. */}
                      {nickname ? (
                        <span className={styles.circuitNick}>{nickname}</span>
                      ) : null}
                    </td>
                    <td className={styles.muted}>{circuit.countryCode ?? "—"}</td>
                    <td className={styles.num}>
                      {km(circuit.lengthMeters, locale) ?? "—"}
                    </td>
                    <td className={styles.num}>{circuit.cornerCount ?? "—"}</td>
                    <td className={styles.num}>
                      {circuit.firstGrandPrixYear ?? "—"}
                    </td>
                    <td className={styles.num}>
                      {circuit.lapRecordTime ? (
                        <>
                          {circuit.lapRecordTime}
                          {circuit.lapRecordYear ? (
                            <span className={styles.recordYear}>
                              {circuit.lapRecordYear}
                            </span>
                          ) : null}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* ══ Dizin 2 · KAZANANLAR — sıralı defter ══
          Çizgi uzunluğu galibiyet sayısı. Grafik değil: kanadın zaten
          kullandığı kılcal çizginin (bantlardaki `.rule`) ölçü taşıyan
          hâli. Yabancı bir dil sayfaya girmiyor. */}
      {winners.length > 0 ? (
        <Reveal as="section" className={styles.block} delay={60}>
          <h2 className={shell.eyebrow}>{t("ledger.winners")}</h2>

          <ol className={styles.tally}>
            {winners.map((row: F1LedgerRow, i) => (
              <li key={row.name} className={styles.tallyRow}>
                <span className={`${shell.data} ${styles.tallyRank}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.tallyName}>{row.name}</span>
                <span className={`${shell.data} ${styles.tallyMeta}`}>
                  {[row.nationality, span(row.firstYear, row.lastYear)]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
                <span
                  className={styles.tallyBar}
                  aria-hidden
                  style={{ "--tally": row.wins / topWins } as CSSProperties}
                />
                <span className={`${shell.figure} ${styles.tallyValue}`}>
                  {row.wins}
                  <span className={styles.tallyUnit}>{t("ledger.wins")}</span>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      ) : null}

      {/* ══ Dizin 3 · TAKIMLAR — yoğun liste ══
          Çizgi YOK ve bu bilinçli: üstteki defterle aynı biçim, sayfayı
          "aynı listenin iki kopyası" yapardı. Aynı veri, farklı yoğunluk. */}
      {constructors.length > 0 ? (
        <Reveal as="section" className={styles.block} delay={120}>
          <h2 className={shell.eyebrow}>{t("ledger.constructors")}</h2>

          <ul className={styles.teams}>
            {constructors.map((row: F1LedgerRow) => (
              <li key={row.name} className={styles.teamRow}>
                <span className={`${shell.figure} ${styles.teamValue}`}>
                  {row.wins}
                </span>
                <span className={styles.teamName}>{row.name}</span>
                <span className={`${shell.data} ${styles.teamSpan}`}>
                  {span(row.firstYear, row.lastYear)}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      {/* Künye: iki defterin de TÜRETİLMİŞ olduğunu söyleyen satır.
          Kaynağı yazmayan bir arşiv, arşiv değildir. */}
      {ledger && ledger.raceCount > 0 ? (
        <p className={`${shell.data} ${styles.provenance}`}>
          {t("ledger.derived")} {t("circuit.source")}
        </p>
      ) : null}
    </main>
  );
}
