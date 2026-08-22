import Image from "next/image";
import { apiUrl, isLocalUpload } from "@/lib/api/client";
import type { F1RaceResult } from "@/lib/api/sport-archive";
import styles from "./PodiumStage.module.css";

/**
 * Podyum tarihi — yıl seçmeli, gerçek podyum düzeninde.
 *
 * ── NEDEN ALT ALTA LİSTE DEĞİL ────────────────────────────────────────────
 * İlk sürüm 75 yılı üst üste açılır satır olarak diziyordu; kullanıcı haklı
 * olarak "çok uzun, çok yer kaplıyor" dedi. Şimdi tek seferde TEK yıl
 * görünüyor: solda yıl sütunu, sağda o yılın podyumu.
 *
 * Podyum da liste değil: ikinci solda, birinci ORTADA ve YÜKSEKTE, üçüncü
 * sağda — gerçek kürsü düzeni. Birincinin portresi belirgin şekilde daha
 * büyük; sıralamayı yazıdan önce KOMPOZİSYON söylüyor.
 *
 * ── NEDEN İSTEMCİ JS'İ YOK ────────────────────────────────────────────────
 * Seçim gizli radio düğmeleriyle çalışıyor. Gerekçe pratik: dev modunda CSP
 * istemci JS'ini engelliyor, yani `useState` ile yazılsaydı kullanıcı kendi
 * makinesinde çalışmadığını görürdü. Radio + CSS her yerde çalışıyor,
 * klavyeyle gezilebiliyor ve JS hiç gelmese bile bozulmuyor.
 *
 * Radio'lar etiketin İÇİNDE (sol sütunda): odak tıklanan yerde kalıyor,
 * sayfa görünmeyen bir öğeye zıplamıyor.
 */
export function PodiumStage({
  results,
  narratedYears,
  idPrefix,
  labels,
}: {
  results: F1RaceResult[];
  /** Anlatısı yazılmış yıllar — veri katmanı anlatıya işaret etsin */
  narratedYears: Set<number>;
  /** Aynı sayfada iki podyum olursa id'ler çakışmasın */
  idPrefix: string;
  labels: { podiums: string; range: string; source: string; narrated: string };
}) {
  const byYear = new Map<number, F1RaceResult[]>();
  for (const row of results) {
    const list = byYear.get(row.seasonYear) ?? [];
    list.push(row);
    byYear.set(row.seasonYear, list);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);
  if (years.length === 0) return null;
  const latest = years[0];

  /**
   * Hangi panelin görüneceği CSS'te seçiliyor ama kural yıla özgü olmak
   * zorunda (`:has(#y-1998:checked)`), yani CSS modülüne statik yazılamaz.
   * Üretilen bu blok tam olarak o eksiği kapatıyor — sayfa başına ~75 kısa
   * kural. CSP `style-src 'self' 'unsafe-inline'` izniyle uyumlu.
   */
  const kurallar = years
    .map(
      (y) =>
        `.${styles.wrap}:has(#${idPrefix}-${y}:checked) .${styles.panel}[data-year="${y}"]{display:grid}`,
    )
    .join("");

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>{labels.podiums}</h2>
      <p className={styles.range}>{labels.range}</p>

      <style dangerouslySetInnerHTML={{ __html: kurallar }} />

      <div className={styles.wrap}>
        {/* Sol: yıl sütunu — kaydırılabilir, seçili yıl altın */}
        <div className={styles.years} role="group" aria-label={labels.podiums}>
          {years.map((year) => (
            <label
              key={year}
              className={`${styles.yearLabel} ${
                narratedYears.has(year) ? styles.narrated : ""
              }`}
              title={narratedYears.has(year) ? labels.narrated : undefined}
            >
              <input
                type="radio"
                name={`${idPrefix}-year`}
                id={`${idPrefix}-${year}`}
                defaultChecked={year === latest}
                className={styles.radio}
              />
              <span>{year}</span>
            </label>
          ))}
        </div>

        {/* Sağ: seçili yılın kürsüsü */}
        <div className={styles.stage}>
          {years.map((year) => {
            const rows = (byYear.get(year) ?? []).sort(
              (a, b) => a.position - b.position,
            );
            const race = rows[0];
            return (
              <div key={year} className={styles.panel} data-year={year}>
                <p className={styles.raceName}>
                  {[race?.raceName, race?.raceDate?.slice(0, 10)]
                    .filter(Boolean)
                    .join(" · ")}
                </p>

                <div className={styles.plinths}>
                  {rows.map((row) => {
                    // Lisans + sanatçı yoksa görsel ÇİZİLMEZ (telif).
                    const portrait =
                      row.driver?.photo &&
                      row.driver.portraitLicense &&
                      row.driver.portraitAuthor
                        ? row.driver
                        : null;
                    return (
                      <div
                        key={row.id}
                        className={styles.plinth}
                        data-pos={row.position}
                      >
                        <span className={styles.face}>
                          {portrait ? (
                            /* next/image'e 2026-08-22'de çevrildi: portreler
                               /uploads/* dosyaları ve ham <img> orijinali
                               indiriyordu. Yüz kutusu 56-128 px'lik kare —
                               sizes sabit px (ev kuralı). */
                            <Image
                              src={apiUrl(portrait.photo as string)}
                              alt=""
                              width={128}
                              height={128}
                              sizes="128px"
                              className={styles.faceImg}
                              /* ⚠️ Karar apiUrl()'den GEÇMEMİŞ ham yoldan:
                                 küratör ucu DB'ye dış URL de yazabiliyor
                                 (setImage dto.url) ve öyle bir adres
                                 optimizer'a girerse sayfa çöker — kitap
                                 kanadındaki desenle aynı (PersonHall). */
                              unoptimized={
                                !isLocalUpload(portrait.photo as string)
                              }
                            />
                          ) : null}
                        </span>

                        <span className={styles.who}>
                          <span className={styles.driver}>{row.driverName}</span>
                          <span className={styles.team}>
                            {row.constructorName}
                          </span>
                          <span className={styles.time}>{row.timeText}</span>
                          {portrait ? (
                            <a
                              className={styles.credit}
                              href={portrait.portraitSourceUrl ?? "#"}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                            >
                              {portrait.portraitAuthor} ·{" "}
                              {portrait.portraitLicense}
                            </a>
                          ) : null}
                        </span>

                        {/* Kürsü bloğu — yüksekliği basamağa göre */}
                        <span className={styles.block} aria-hidden>
                          <span className={styles.blockNo}>{row.position}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className={styles.source}>{labels.source}</p>
    </div>
  );
}
