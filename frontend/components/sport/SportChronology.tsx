"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import { sportHref } from "@/lib/sport/routes";
import { pick, type SportChronologyEntry } from "@/lib/api/sport-archive";
import styles from "./SportChronology.module.css";

type World = "all" | "football" | "f1";

/**
 * Zaman şeridi — YATAY, İKİ ŞERİTLİ, SÜZGEÇLİ.
 *
 * ── NEDEN YATAY ───────────────────────────────────────────────────────────
 * Dikey liste bir sıralamadır; yatay eksen bir ZAMANDIR. Kayıt sayısı arttıkça
 * (küratör 1950 sonrasını doldurdukça) dikey liste sayfayı uzatıp okunmaz
 * hâle gelirdi; yatay eksen ise uzunluğu KENDİ İÇİNDE taşıyor.
 *
 * ── ORANTILI ARALIK: SAYFANIN TEK "İCADI" ─────────────────────────────────
 * Kartlar arası mesafe sabit değil, iki kayıt arasındaki YIL FARKIYLA
 * orantılı. 1905 ile 1950 arasındaki 45 yıl ekranda gerçekten uzun; 1996 ile
 * 2000 arasındaki 4 yıl gerçekten kısa. Arşivin SESSİZ yılları da bilgidir ve
 * eşit aralıklı bir liste bunu gizleyerek yalan söyler.
 *
 * Hesap CSS'e bırakılıyor, piksele değil: her kart iki sayı taşıyor —
 * `--x-min` (kaçıncı sırada) ve `--x-span` (o ana kadar biriken yıl oranı).
 * Konum `calc(--x-min * adım-tabanı + --x-span * adım-payı)`. Böylece dar
 * ekranda iki değişkeni küçültmek yetiyor; JavaScript yeniden hesap yapmıyor.
 *
 * ⚠️ `--step-min` ÇAKIŞMA SİGORTASI. Aynı şeritteki iki kart en az bir
 * kart genişliği kadar ayrılmak zorunda; orantı yalnızca bunun ÜSTÜNE
 * ekleniyor. Saf orantı, aynı yıla düşen iki kaydı üst üste bindirirdi.
 *
 * ── İKİ ŞERİT ─────────────────────────────────────────────────────────────
 * "Hepsi" seçiliyken futbol eksenin üstünde, Formula 1 altında ve İKİSİ DE
 * AYNI ZAMAN EKSENİNE hizalı — 1964 Ali Sami Yen ile 1971 Monza arasındaki
 * yedi yıl ekranda gerçek uzaklığında duruyor. Tek şeritte karıştırmak
 * kronolojiyi verir ama iki dünyanın aynı yüzyılı paylaştığını göstermez.
 * Süzgeç tek dünyaya inince şerit sayısı bire düşüyor ve eksen dibe kayıyor.
 */
export function SportChronology({ entries }: { entries: SportChronologyEntry[] }) {
  const t = useTranslations("sportArchive");
  const locale = useLocale();
  const [world, setWorld] = useState<World>("all");
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [overflows, setOverflows] = useState(false);
  // Şeridin uçları: başa/sona gelindiğinde o yöndeki ok sönüyor.
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const visible = useMemo(
    () => (world === "all" ? entries : entries.filter((e) => e.world === world)),
    [entries, world],
  );

  /**
   * Konum hesabı. Süzgeç değişince YENİDEN yapılıyor ve bu kasıtlı: üç kayıt
   * kalmışsa aralarındaki mesafe de o üç kaydın yıl farkına göre ölçülmeli.
   * Süzgeçten önceki ölçeği korumak, filtrelenmiş şeritte anlamsız boşluklar
   * bırakırdı.
   */
  const laid = useMemo(() => {
    const gaps = visible.map((e, i) => (i === 0 ? 0 : e.year - visible[i - 1].year));
    const maxGap = Math.max(1, ...gaps);
    let span = 0;
    return visible.map((entry, i) => {
      span += gaps[i] / maxGap;
      return { entry, xMin: i, xSpan: span, gapYears: gaps[i] };
    });
  }, [visible]);

  const totalSpan = laid.length ? laid[laid.length - 1].xSpan : 0;
  const lanes = world === "all" ? 2 : 1;

  /**
   * Şerit yüksekliği içeriğe göre: fotoğraflı bir kart, fotoğrafsızından
   * ~5rem uzun. Yüksekliği sabit tutmak, hiç fotoğrafı olmayan bir şeridin
   * altında sürekli boş bant bırakırdı. Görünen kayıtlardan EN AZ BİRİNDE
   * fotoğraf varsa şerit büyüyor; süzgeç fotoğrafsız bir dünyaya inince
   * kendiliğinden toparlanıyor.
   */
  const hasMedia = visible.some((entry) => Boolean(entry.imageUrl));

  // Ok düğmeleri yalnızca kaydıracak bir şey varsa. Şerit ekrana sığıyorken
  // duran iki ok, tıklanınca hiçbir şey yapmayan iki düğmedir.
  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const slack = el.scrollWidth - el.clientWidth;
    setOverflows(slack > 4);
    // 2px tolerans: tarayıcılar kesirli kaydırma değeri döndürüyor ve tam
    // sona gelindiğinde scrollLeft sondan bir tık eksik kalabiliyor.
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= slack - 2);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, laid.length]);

  // Süzgeç değişince başa dön: kullanıcı yeni bir şeride ortasından girmesin
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [world]);

  function nudge(direction: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: reduced ? "auto" : "smooth",
    });
  }

  const filters: Array<{ key: World; label: string }> = [
    { key: "all", label: t("chronology.all") },
    { key: "football", label: t("football.name") },
    { key: "f1", label: t("f1.name") },
  ];

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <div className={styles.filters} role="group" aria-label={t("chronology.filterLabel")}>
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              className={styles.filter}
              data-on={world === filter.key ? "" : undefined}
              data-world={filter.key}
              aria-pressed={world === filter.key}
              onClick={() => setWorld(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* SAHNE: şerit + iki kenar oku. Konumlanma kabı burası — oklar
          şeridin İÇİNDE olamaz, kaydırılan içerikle birlikte kayarlardı. */}
      <div className={styles.stage}>
      {/* `tabIndex` + `role="region"`: klavye kullanıcısı şeridi ok tuşlarıyla
          kaydırabilsin. Kaydırılabilir bir kabın odaklanabilir olmaması,
          içeriğin klavyeyle ulaşılamaz kalması demek. */}
      <div
        ref={trackRef}
        className={styles.track}
        data-lanes={lanes}
        data-media={hasMedia ? "" : undefined}
        tabIndex={0}
        role="region"
        aria-label={t("chronology.title")}
        onScroll={measure}
      >
        <ol
          className={styles.rail}
          style={
            {
              "--x-total": totalSpan,
              "--x-count": Math.max(0, laid.length - 1),
            } as CSSProperties
          }
        >
          {/* Zaman ekseni — bütün kayıtları taşıyan kesintisiz çizgi */}
          <span className={styles.axis} aria-hidden />

          {laid.map(({ entry, xMin, xSpan, gapYears }, i) => {
            const href =
              entry.world === "football" && entry.clubSlug
                ? entry.eraSlug
                  ? `${sportHref.club(entry.clubSlug)}#${entry.eraSlug}`
                  : sportHref.club(entry.clubSlug)
                : entry.world === "f1" && entry.circuitSlug
                  ? sportHref.circuit(entry.circuitSlug)
                  : null;

            const title = pick(locale, entry.titleTr, entry.titleEn);
            // "Hepsi"de futbol üstte (0), F1 altta (1); süzgeçliyken tek şerit
            const lane = world === "all" && entry.world === "f1" ? 1 : 0;

            /* Yıl KARTIN İÇİNDE, eksenin üstünde değil. İki şeritli düzende
               eksene yazılan yıl etiketleri birbirine yakın iki kayıtta üst
               üste biniyordu; kartın içinde hem çakışma yok hem de yıl
               başlığın ölçüsüyle birlikte okunuyor. */
            const body = (
              <>
                {/* Arşiv fotoğrafı şeridi. Sinematik oran (≈2.2:1) bilinçli:
                    kare bir küçük resim "kart" hissi verirdi; şerit ise
                    fotoğrafın KESİLMİŞ bir parçası gibi okunuyor — arşiv
                    kutusundan çıkmış bir kupür. */}
                {entry.imageUrl ? (
                  <span className={styles.cardArt}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={apiUrl(entry.imageUrl)}
                      alt=""
                      loading="lazy"
                      className={styles.cardImg}
                    />
                  </span>
                ) : null}
                <span className={styles.cardYear}>{entry.year}</span>
                <span className={styles.cardTitle}>{title}</span>
                {entry.subject ? (
                  <span className={styles.cardSubject}>{entry.subject}</span>
                ) : null}
              </>
            );

            return (
              <li
                key={`${entry.year}-${entry.world}-${i}`}
                className={styles.item}
                data-world={entry.world}
                data-lane={lane}
                style={{ "--x-min": xMin, "--x-span": xSpan } as CSSProperties}
              >
                {/* Sessiz yılların ölçüsü: 10 yıldan uzun boşluk kendini yazar.
                    Bu olmadan orantılı aralık "rastgele boşluk" gibi okunuyor. */}
                {gapYears >= 10 ? (
                  <span className={styles.gap} aria-hidden>
                    {t("chronology.gap", { n: gapYears })}
                  </span>
                ) : null}

                <span className={styles.stem} aria-hidden />
                <span className={styles.dot} aria-hidden />

                {href ? (
                  <Link href={href} className={styles.card}>
                    {body}
                  </Link>
                ) : (
                  <span className={styles.card} data-static="">
                    {body}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>

        {/* Kenar okları. Kaydırma çubuğu gizlendiği için (bkz. .track)
            şeridin devam ettiğini SÖYLEYEN şey bunlar — süs değil, tek
            görünür ipucu. O yüzden dokunmatikte kalıcı, farede imleç
            sahneye girince beliriyor (bkz. modül CSS'i).

            Uca gelince o yöndeki ok `disabled`: görünür duran ama hiçbir
            şey yapmayan düğme, bozuk düğmedir. */}
        {overflows ? (
          <>
            <button
              type="button"
              className={styles.edge}
              data-side="start"
              onClick={() => nudge(-1)}
              disabled={atStart}
              aria-label={t("chronology.prev")}
            >
              <span aria-hidden>←</span>
            </button>
            <button
              type="button"
              className={styles.edge}
              data-side="end"
              onClick={() => nudge(1)}
              disabled={atEnd}
              aria-label={t("chronology.next")}
            >
              <span aria-hidden>→</span>
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
