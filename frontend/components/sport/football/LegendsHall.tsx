import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import { sportHref } from "@/lib/sport/routes";
import {
  LEGEND_PLATES,
  LEGEND_PORTRAIT_FALLBACK,
} from "@/lib/sport/football-media";
import shell from "@/app/[locale]/spor/layout.module.css";
import styles from "./LegendsHall.module.css";

export interface LegendEntry {
  slug: string;
  name: string;
  epithet: string;
  countryCode: string | null;
  yearsFrom: number | null;
  yearsTo: number | null;
  portraitImage: string | null;
}

export interface LegendsHallLabels {
  title: string;
  lede: string;
  /** "Efsaneye git" — kart eylemi, dokunmatikte de görünür */
  open: string;
  years: string;
}

/**
 * Portre kaynağı: ÖNCE küratörün yüklediği kare, sonra depodaki yedek.
 *
 * Küratör yüklemesinin piksel ölçüsü sunucuda bilinmiyor; kutu `aspect-ratio`
 * ile sabitlendiği için `width`/`height` yazılmıyor — yanlış ölçü yazmak
 * yerinden oynatır, hiç yazmamak `aspect-ratio` sayesinde zaten yer ayırıyor.
 */
function portraitOf(legend: LegendEntry): { src: string; alt: string } | null {
  if (legend.portraitImage) {
    return { src: apiUrl(legend.portraitImage), alt: legend.name };
  }
  const fallback = LEGEND_PORTRAIT_FALLBACK[legend.slug];
  return fallback ? { src: fallback.src, alt: fallback.alt } : null;
}

/**
 * EFSANELER SALONU.
 *
 * ── NEDEN İLK KAYIT DAHA BÜYÜK ───────────────────────────────────────────
 * Eski sayfada bu bölüm tek kayıtlıyken bir ızgarada YALNIZ BİR KART olarak
 * duruyordu ve "burası boş" diyordu. Çözüm ızgarayı doldurmak değil,
 * hiyerarşiyi kabul etmek: ilk efsane tam bant bir sahne, sonrakiler onun
 * altında daha sıkı bir sıra. Tek kayıtla da, altı kayıtla da kompozisyon
 * ayakta kalıyor.
 *
 * ── ESKİ GÖRÜNTÜDEN RENGE ────────────────────────────────────────────────
 * Portre durgun hâlde sepya + düşük doygunluk (arşiv kasedi), hover/odakta
 * tam renge açılıyor. İki ayrı görsel değil, tek görsel + `filter` geçişi:
 * ikinci bir dosya indirmeden aynı anlatı.
 *
 * Dokunmatikte hover yok; o yüzden `@media (hover: none)` altında portre
 * BAŞTAN renkli geliyor — efekt bir süs, bilgi değil.
 */
export function LegendsHall({
  legends,
  labels,
}: {
  legends: LegendEntry[];
  labels: LegendsHallLabels;
}) {
  if (legends.length === 0) return null;

  const [lead, ...rest] = legends;
  const leadPortrait = portraitOf(lead);
  const leadPlate = LEGEND_PLATES[lead.slug] ?? null;

  const span = (legend: LegendEntry) =>
    legend.yearsFrom
      ? `${legend.yearsFrom}–${legend.yearsTo ?? ""}`
      : null;

  return (
    <section className={styles.hall} aria-labelledby="futbol-efsaneler">
      <div className={styles.atmosphere} aria-hidden="true">
        {leadPlate ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={leadPlate.src}
            alt=""
            className={styles.plate}
            width={leadPlate.width}
            height={leadPlate.height}
            loading="lazy"
            decoding="async"
          />
        ) : null}
        <span className={styles.wash} />
        <span className={styles.scan} />
      </div>

      <header className={styles.head}>
        <h2
          id="futbol-efsaneler"
          className={`${shell.display} ${styles.heading}`}
        >
          {labels.title}
        </h2>
        <p className={styles.lede}>{labels.lede}</p>
      </header>

      {/* ---- Baş efsane: tam bant sahne ---- */}
      <Link href={sportHref.legend(lead.slug)} className={styles.lead}>
        {leadPortrait ? (
          <span className={styles.leadPortrait}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={leadPortrait.src}
              alt={leadPortrait.alt || lead.name}
              loading="lazy"
              decoding="async"
            />
            <span className={styles.grain} aria-hidden="true" />
          </span>
        ) : null}

        <div className={styles.leadBody}>
          <h3 className={`${shell.display} ${styles.leadName}`}>
            {lead.name}
          </h3>
          {lead.epithet ? (
            <span className={styles.leadEpithet}>{lead.epithet}</span>
          ) : null}

          <span className={styles.leadMeta}>
            {span(lead) ? (
              <span className={styles.stat}>
                <em className={shell.figure}>{span(lead)}</em>
                <i>{labels.years}</i>
              </span>
            ) : null}
            {lead.countryCode ? (
              <span className={styles.stat}>
                <em className={shell.figure}>{lead.countryCode}</em>
                <i>ISO</i>
              </span>
            ) : null}
          </span>

          <span className={styles.open}>
            {labels.open}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </Link>

      {/* ---- Diğer efsaneler ---- */}
      {rest.length > 0 ? (
        <ul className={styles.row}>
          {rest.map((legend) => {
            const portrait = portraitOf(legend);
            return (
              <li key={legend.slug}>
                <Link
                  href={sportHref.legend(legend.slug)}
                  className={styles.card}
                >
                  <span className={styles.cardPortrait}>
                    {portrait ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={portrait.src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span className={styles.cardFallback} aria-hidden="true" />
                    )}
                  </span>
                  <h3 className={`${shell.display} ${styles.cardName}`}>
                    {legend.name}
                  </h3>
                  {legend.epithet ? (
                    <span className={styles.cardEpithet}>{legend.epithet}</span>
                  ) : null}
                  {span(legend) ? (
                    <span className={`${shell.data} ${styles.cardYears}`}>
                      {span(legend)}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
