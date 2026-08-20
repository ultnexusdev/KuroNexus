import { Link } from "@/lib/i18n/navigation";
import type { PlayerImageSlot } from "@/lib/sport/favourite-players";
import { PlayerImage } from "./player/PlayerImage";
import shell from "@/app/[locale]/spor/layout.module.css";
import styles from "./LegendsHall.module.css";

export interface LegendEntry {
  key: string;
  name: string;
  epithet: string;
  countryCode: string | null;
  yearsFrom: number | null;
  yearsTo: number | null;
  /** Adres SAYFADA kuruluyor: arşiv efsanesi bir yere, favori futbolcu başka bir yere gider. */
  href: string;
  portrait: PlayerImageSlot;
  /**
   * Portre küratör modundan değiştirilebilir mi?
   *
   * Arşiv efsanelerinin portresi backend'de kendi kaydında duruyor ve kendi
   * küratör ekranından yönetiliyor — buradan da yazılabilseydi aynı görselin
   * iki ayrı kaynağı olurdu. Favori futbolcularınki ise bu tablodan geliyor,
   * o yüzden burada düzenlenebiliyor.
   */
  editable: boolean;
}

export interface LegendsHallLabels {
  title: string;
  lede: string;
  open: string;
  years: string;
}

/**
 * EFSANELER SALONU.
 *
 * ── İKİ KAYNAK, TEK SALON ────────────────────────────────────────────────
 * Buradaki yüzlerin bir kısmı arşiv kaydı (`FootballLegend`, backend), bir
 * kısmı defterdeki favori futbolcu. İkisi aynı salonda görünüyor ama
 * ADRESLERİ farklı: efsane kendi efsane sayfasına, futbolcu kendi profiline
 * gidiyor. Bu yüzden `href` bileşende kurulmuyor, sayfadan geliyor.
 *
 * ── NEDEN İLK KAYIT DAHA BÜYÜK ───────────────────────────────────────────
 * Tek kayıtlı bir ızgarada YALNIZ BİR KART "burası boş" der. Çözüm ızgarayı
 * doldurmak değil, hiyerarşiyi kabul etmek: ilk efsane tam bant bir sahne,
 * sonrakiler onun altında daha sıkı bir sıra.
 *
 * ── FAVORİ ŞERİDİNDEN FARKI ──────────────────────────────────────────────
 * Favori futbolcular yatay bir POSTER rayı: kart poster boyunda, isim dev,
 * renk oyuncunun kendi paletinden. Burası bir SALON: portre dikey ve sabit,
 * ses bordo-altın (arşiv kasedi), lakap italik. Aynı kişi iki yerde de
 * görünebiliyor ama iki farklı ışıkta.
 *
 * ── ESKİ GÖRÜNTÜDEN RENGE ────────────────────────────────────────────────
 * Portre durgun hâlde sepya + düşük doygunluk, hover/odakta tam renge
 * açılıyor. Tek görsel + `filter` geçişi; ikinci bir dosya inmiyor.
 * Dokunmatikte hover yok, o yüzden orada portre BAŞTAN renkli geliyor.
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

  const span = (legend: LegendEntry) =>
    legend.yearsFrom ? `${legend.yearsFrom}–${legend.yearsTo ?? ""}` : null;

  return (
    <section className={styles.hall} aria-labelledby="futbol-efsaneler">
      <div className={styles.atmosphere} aria-hidden="true">
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

      {/* ---- Baş efsane: tam bant sahne ----
          Portre bağlantının DIŞINDA: küratör düğmesi bir `<a>` içinde
          kalırsa hem geçersiz HTML olur hem de dosya/adres alanına basınca
          sayfa değişir (galeri karelerinde ölçülen hata). */}
      <div className={styles.lead}>
        <span className={styles.leadPortrait}>
          <PlayerImage
            slot={lead.portrait}
            position="50% 22%"
            noEdit={!lead.editable}
          />
          <span className={styles.grain} aria-hidden="true" />
        </span>

        <div className={styles.leadBody}>
          <h3 className={`${shell.display} ${styles.leadName}`}>
            <Link href={lead.href}>{lead.name}</Link>
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

          <Link href={lead.href} className={styles.open}>
            {labels.open}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ---- Diğer efsaneler ---- */}
      {rest.length > 0 ? (
        <ul className={styles.row}>
          {rest.map((legend) => (
            <li key={legend.key}>
              <div className={styles.card}>
                <span className={styles.cardPortrait}>
                  <PlayerImage
                    slot={legend.portrait}
                    position="50% 22%"
                    decorative
                    noEdit={!legend.editable}
                  />
                </span>
                <h3 className={`${shell.display} ${styles.cardName}`}>
                  <Link href={legend.href}>{legend.name}</Link>
                </h3>
                {legend.epithet ? (
                  <span className={styles.cardEpithet}>{legend.epithet}</span>
                ) : null}
                {span(legend) ? (
                  <span className={`${shell.data} ${styles.cardYears}`}>
                    {span(legend)}
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
