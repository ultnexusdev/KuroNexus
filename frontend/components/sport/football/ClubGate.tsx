import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import { sportHref } from "@/lib/sport/routes";
import { FOOTBALL_MEDIA } from "@/lib/sport/football-media";
import shell from "@/app/[locale]/spor/layout.module.css";
import styles from "./ClubGate.module.css";

export interface ClubGateLabels {
  /** "Arşive gir" — kartın eylemi. Hover'a bağlı DEĞİL, her zaman görünür. */
  enter: string;
  founded: string;
}

/**
 * ÖNE ÇIKAN DÜNYA — kulüp kapısı.
 *
 * ── NEDEN BİR KAPI, BİR KART DEĞİL ───────────────────────────────────────
 * Eski hâlinde bu bölüm iki satır metin ve iki ince çizgiydi: "GALATASARAY /
 * Bir kulübün değil, bir ömrün arşivi." Kanadın en önemli bağlantısı,
 * sayfadaki en sessiz nesneydi. Şimdi tam genişlikte bir bant ve içinden ışık
 * geçiyor.
 *
 * ── GÖRSEL ÖNCELİĞİ KÜRATÖRÜN ────────────────────────────────────────────
 * Arka plandaki kare önce küratörün yüklediği kapak (`club.coverImage`),
 * yoksa depodaki stadyum içi plakası (`stadiumInside`, CC0). İkisi de yoksa katman hiç
 * çizilmiyor ve CSS atmosferi tek başına çalışıyor — "kırık görsel çerçevesi"
 * hiçbir koşulda görünmüyor.
 *
 * ⚠️ YEDEK KUŞ BAKIŞI DEĞİL, ARTIK. Eskiden `stadiumAerial` kullanılıyordu ve
 * o kare CC BY künyeli; hub sayfasından atıf isteyen bütün görseller
 * kaldırılırken bu da CC0 bir kareyle değiştirildi (`page.tsx` başındaki
 * künye notu). Yorum o turda güncellenmemişti.
 *
 * `coverPosition` / `coverScale` küratörün kırpma tercihi; `null` ise CSS
 * varsayılanı geçerli (eski backend yanıtıyla da uyumlu).
 *
 * ── DOKUNMATİK ───────────────────────────────────────────────────────────
 * Bütün hover efektleri `:hover, :focus-visible` ikilisine bağlı ve hiçbiri
 * BİLGİ taşımıyor: eylem etiketi, künye ve ad dokunmatik cihazda da ilk
 * karede görünüyor. Hover yalnızca ışığı artırıyor.
 */
export function ClubGate({
  slug,
  name,
  tagline,
  foundedYear,
  cityName,
  stadiumName,
  nickname,
  coverImage,
  coverPosition,
  coverScale,
  labels,
}: {
  slug: string;
  name: string;
  tagline: string;
  foundedYear: number | null;
  cityName: string | null;
  stadiumName: string | null;
  nickname: string | null;
  coverImage: string | null;
  coverPosition?: string | null;
  coverScale?: number | null;
  labels: ClubGateLabels;
}) {
  const backdrop = coverImage
    ? apiUrl(coverImage)
    : FOOTBALL_MEDIA.stadiumInside.src;

  const meta = [
    foundedYear ? `${labels.founded} ${foundedYear}` : null,
    cityName,
    stadiumName,
  ].filter((value): value is string => Boolean(value));

  return (
    // Bölümün adı kulübün kendisi — `aria-labelledby` olmadan bu bant belge
    // taslağında adsız bir bölüm olarak duruyordu (ölçüldü).
    <section
      className={styles.gate}
      data-club={slug}
      aria-labelledby={`kulup-${slug}`}
    >
      {/* Adres elle yazılmıyor — `/spor/...` dizesinin tek kaynağı
          `lib/sport/routes.ts` (kanadın kuralı). */}
      <Link href={sportHref.club(slug)} className={styles.link}>
        <span className={styles.frame} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backdrop}
            alt=""
            className={styles.cover}
            loading="lazy"
            decoding="async"
            style={{
              objectPosition: coverPosition ?? undefined,
              // Küratörün büyütmesi yalnızca yazılmışsa uygulanıyor; yoksa
              // hover büyütmesi CSS'teki varsayılandan başlıyor.
              "--cover-scale": coverScale ? `${coverScale / 100}` : undefined,
            } as React.CSSProperties}
          />
          <span className={styles.burst} />
          <span className={styles.flare} />
          <span className={styles.smoke} />
          <span className={styles.veil} />
          <span className={styles.embers}>
            {Array.from({ length: 10 }, (_, i) => (
              <i key={i} style={{ "--i": i } as React.CSSProperties} />
            ))}
          </span>
        </span>

        <div className={styles.body}>
          <span className={styles.crest} aria-hidden="true">
            {/* Kulüp logosu telifli; onun yerine kulübün kendi geometrisi:
                iç içe iki halka ve bir dikey eksen. Soyut ama tanınır. */}
            <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <circle cx="32" cy="32" r="29" className={styles.ring1} />
              <circle cx="32" cy="32" r="21" className={styles.ring2} />
              <path d="M32 3v58" className={styles.axis} />
              <path d="M32 11a21 21 0 0 1 0 42z" className={styles.half} />
            </svg>
          </span>

          <h2 id={`kulup-${slug}`} className={`${shell.display} ${styles.name}`}>
            {name}
          </h2>

          {nickname ? (
            <span className={styles.nickname}>{nickname}</span>
          ) : null}

          {tagline ? <span className={styles.tagline}>{tagline}</span> : null}

          <span className={styles.foot}>
            {meta.length > 0 ? (
              <span className={`${shell.data} ${styles.meta}`}>
                {meta.join(" · ")}
              </span>
            ) : null}
            <span className={styles.enter}>
              {labels.enter}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </span>
          </span>
        </div>
      </Link>
    </section>
  );
}
