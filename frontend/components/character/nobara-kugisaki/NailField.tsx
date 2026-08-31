"use client";

import { useMemo, useState } from "react";
import { NailMark } from "./NobaraGlyphs";
import styles from "./StrawDollExperience.module.css";

/**
 * "ÜÇ ÇİVİ" — sayfanın kalbi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Tek düzlemde altı SABİT çivi noktası var. Ziyaretçi üçünü seçiyor. Seçilen
 * üçlü belirli bir üçgeni kuruyorsa REZONANS oluyor ve o üçlüye ait kayıt
 * açılıyor; kurmuyorsa hiçbir şey olmuyor.
 *
 * Nobara'nın kuralı bu: bağ yoksa etki yok. Ama "hiçbir şey olmuyor" sessiz
 * kalmak demek değil — yanlış her üçlü NEDEN çalışmadığını söylüyor
 * (`misses` kuralları sırayla değerlendiriliyor, ilk eşleşen konuşuyor).
 *
 * ⚠️ Eski Nobara sayfasının mekaniği (iki pano: solda vuruyorsun, sağda
 * oluyor) YASAK listesinde. Buradaki fark yalnızca görsel değil yapısal:
 * orada iki düzlem ve bir AYNA vardı, burada tek düzlem ve KONUM SEÇİMİ var.
 * Seçim sırası önemsiz, seçim KÜMESİ belirleyici.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * · Her nokta gerçek `<button>`; seçili durum `aria-pressed` ile okunuyor.
 * · "Rezonans oldu / olmadı" sonucu `role="status"` ile duyuruluyor —
 *   yalnızca görsel geri bildirim yetmez (kullanıcı şartı).
 * · Dokunma hedefi `var(--touch-min)`; odak halkası `:focus-visible`.
 * · Üç çivi doluyken dördüncüye basmak SESSİZ kalmıyor: durum satırı
 *   "önce birini sök" diyor.
 *
 * ── HAREKET ──────────────────────────────────────────────────────────────
 * Her tıklamada `strike` sayacı artıyor; sayaç ses dalgası halkasının React
 * `key`i olduğu için öğe yeniden mount ediliyor ve animasyon BAŞTAN oynuyor
 * (aynı elemana sınıf ekleyip çıkarmak, art arda tıklamalarda ikinci
 * animasyonu yutuyor). Sarsıntı ve halka `prefers-reduced-motion` kapısında.
 *
 * İstemciye YALNIZCA düz dize iniyor — `LocalizedText` sunucuda çözülüyor.
 */

export interface NailFieldPoint {
  key: string;
  order: number;
  x: number;
  y: number;
  kanji: string;
  reading: string;
  label: string;
  note: string;
}

export interface NailFieldTriad {
  key: string;
  members: string[];
  name: string;
  kanji: string;
  reading: string;
  turkish: string;
  title: string;
  text: string;
}

export interface NailFieldMiss {
  key: string;
  has: string[];
  lacks: string[];
  text: string;
}

export function NailField({
  points,
  triads,
  misses,
  limit,
  fieldLabel,
  counterLabel,
  selectHint,
  resetLabel,
  statusIdle,
  statusOne,
  statusTwo,
  statusFull,
  statusReset,
  hitPrefix,
  missPrefix,
  missDefault,
  linesOn,
  linesOff,
  foundLabel,
  openedTitle,
  scene,
}: {
  points: NailFieldPoint[];
  triads: NailFieldTriad[];
  misses: NailFieldMiss[];
  limit: number;
  fieldLabel: string;
  counterLabel: string;
  selectHint: string;
  resetLabel: string;
  statusIdle: string;
  statusOne: string;
  statusTwo: string;
  statusFull: string;
  statusReset: string;
  hitPrefix: string;
  missPrefix: string;
  missDefault: string;
  linesOn: string;
  linesOff: string;
  foundLabel: string;
  openedTitle: string;
  /** `nob:kugiba` kadrajı + küratör yuvası — sunucuda çizilip prop olarak iniyor */
  scene: React.ReactNode;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [strike, setStrike] = useState(0);
  const [refused, setRefused] = useState(false);
  const [cleared, setCleared] = useState(false);

  const byKey = useMemo(() => {
    const map = new Map<string, NailFieldPoint>();
    for (const point of points) map.set(point.key, point);
    return map;
  }, [points]);

  /** Seçili küme tam olarak bir üçlüye eşitse o üçlü; değilse null. */
  const hit = useMemo(() => {
    if (selected.length !== limit) return null;
    const set = new Set(selected);
    return (
      triads.find(
        (triad) =>
          triad.members.length === set.size &&
          triad.members.every((member) => set.has(member)),
      ) ?? null
    );
  }, [selected, triads, limit]);

  /** Rezonans olmadıysa hangi kural konuşuyor. */
  const miss = useMemo(() => {
    if (selected.length !== limit || hit) return null;
    const set = new Set(selected);
    return (
      misses.find(
        (rule) =>
          rule.has.every((key) => set.has(key)) &&
          rule.lacks.every((key) => !set.has(key)),
      ) ?? null
    );
  }, [selected, misses, hit, limit]);

  /**
   * ⚠️ Bütün hesap `setSelected`in DIŞINDA yapılıyor. İlk hâlinde
   * `setRefused`/`setFound` çağrıları güncelleyici fonksiyonun içindeydi;
   * React güncelleyicileri saf olmak zorunda ve StrictMode onları iki kez
   * koşuyor. Olay işleyicisinde `selected`ı doğrudan okumak burada güvenli:
   * tek bir tıklama tek bir geçiş üretiyor.
   */
  const toggle = (key: string) => {
    setCleared(false);
    setStrike((value) => value + 1);

    if (selected.includes(key)) {
      setRefused(false);
      setSelected(selected.filter((item) => item !== key));
      return;
    }

    if (selected.length >= limit) {
      /* Dördüncü çivi reddediliyor — ama sessizce değil. */
      setRefused(true);
      return;
    }

    const next = [...selected, key];
    setRefused(false);
    setSelected(next);

    if (next.length === limit) {
      const set = new Set(next);
      const match = triads.find(
        (triad) =>
          triad.members.length === set.size &&
          triad.members.every((member) => set.has(member)),
      );
      if (match && !found.includes(match.key)) {
        setFound([...found, match.key]);
      }
    }
  };

  const reset = () => {
    setSelected([]);
    setRefused(false);
    setCleared(true);
    setStrike((value) => value + 1);
  };

  /** Ekran okuyucuya giden tek cümle. Görsel geri bildirim tek başına yetmez. */
  const statusText = (() => {
    if (refused) return statusFull;
    if (cleared && selected.length === 0) return statusReset;
    if (hit) return `${hitPrefix} ${hit.kanji} · ${hit.turkish}. ${hit.title}`;
    if (miss) return `${missPrefix} ${miss.text}`;
    if (selected.length === limit) return `${missPrefix} ${missDefault}`;
    if (selected.length === 2) return statusTwo;
    if (selected.length === 1) return statusOne;
    return statusIdle;
  })();

  /** Üçgenin köşeleri — `points` yüzdeleri doğrudan viewBox koordinatı. */
  const polygon = (members: string[]) =>
    members
      .map((member) => {
        const point = byKey.get(member);
        return point ? `${point.x},${point.y}` : "";
      })
      .filter(Boolean)
      .join(" ");

  return (
    <div className={styles.field} data-state={hit ? "hit" : "idle"}>
      {/* ⚠️ `data-strike` "a" ↔ "b" arasında gidip geliyor ve sarsıntı
          animasyonu iki değere ayrı ayrı bağlı. Tek bir sınıf ekleyip
          çıkarmak art arda tıklamalarda ikinci vuruşu yutuyordu: tarayıcı
          aynı animasyonu yeniden başlatmıyor. İlk çizimde değer "none",
          yani sayfa açılışında hiçbir şey sarsılmıyor. */}
      <div
        className={styles.fieldPlane}
        data-strike={strike === 0 ? "none" : strike % 2 === 1 ? "a" : "b"}
      >
        {/* Bağ çizgileri: üç geçerli üçgen. Varsayılanda GÖRÜNMÜYOR;
            `data-resonance="true"` bunları açıyor (mod düğmesinin işi).
            SVG bir sarmalayıcının içinde: mutlak konumlanmış bir yerleşik
            öğeye dört yandan `inset` vermek ("width:auto" + left + right)
            aşırı kısıtlama sayılıyor ve tarayıcı `right`ı atıyor — kutu
            noktalarla aynı çerçeveye oturmuyordu. */}
        <span className={styles.fieldLinesBox} aria-hidden>
          <svg
            className={styles.fieldLines}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            focusable="false"
            aria-hidden="true"
          >
            {triads.map((triad) => (
              <polygon
                key={triad.key}
                className={styles.fieldLink}
                points={polygon(triad.members)}
                data-found={found.includes(triad.key) ? "true" : "false"}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {selected.length === limit ? (
              <polygon
                className={styles.fieldPick}
                points={polygon(selected)}
                data-hit={hit ? "true" : "false"}
                vectorEffect="non-scaling-stroke"
              />
            ) : null}
          </svg>
        </span>

        {/* Ses dalgası: TEK halka, merkezden. `key` her vuruşta değişiyor,
            böylece animasyon art arda tıklamalarda da baştan oynuyor. */}
        {strike > 0 ? (
          <span key={strike} className={styles.fieldWave} aria-hidden />
        ) : null}

        <p className={styles.fieldCaption} aria-hidden>
          {fieldLabel}
        </p>

        <ul className={styles.fieldPoints}>
          {points.map((point) => {
            const on = selected.includes(point.key);
            return (
              <li
                key={point.key}
                className={styles.fieldPointItem}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              >
                <button
                  type="button"
                  className={styles.fieldPoint}
                  aria-pressed={on}
                  onClick={() => toggle(point.key)}
                >
                  <span className={styles.fieldPointNail} aria-hidden>
                    <NailMark
                      className={styles.fieldPointArt}
                      headClassName={styles.fieldPointHead}
                      shaftClassName={styles.fieldPointShaft}
                    />
                  </span>
                  <span className={styles.fieldPointBody}>
                    <span className={styles.fieldPointIndex} aria-hidden>
                      {String(point.order).padStart(2, "0")}
                    </span>
                    <span className={styles.fieldPointKanji} lang="ja">
                      {point.kanji}
                    </span>
                    {/* ⚠️ Dar ekranda GÖRSEL olarak kırpılıyor ama erişilebilirlik
                        ağacından çıkmıyor: düğmenin adı her ölçüde tam.
                        Okunabilir karşılığı aşağıdaki numaralı künyede. */}
                    <span className={styles.fieldPointLabel}>{point.label}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {scene}

      <div className={styles.fieldPanel}>
        <div className={styles.fieldMeters}>
          <p className={styles.fieldMeter}>
            <span className={styles.fieldMeterLabel}>{counterLabel}</span>
            <span className={styles.fieldMeterValue}>
              {selected.length}/{limit}
            </span>
          </p>
          <p className={styles.fieldMeter}>
            <span className={styles.fieldMeterLabel}>{foundLabel}</span>
            <span className={styles.fieldMeterValue}>
              {found.length}/{triads.length}
            </span>
          </p>
          <button type="button" className={styles.fieldReset} onClick={reset}>
            {resetLabel}
          </button>
        </div>

        <p className={styles.fieldStatus} role="status">
          {statusText}
        </p>

        {/* Numaralı künye — dergi infografiğinin altındaki okuma listesi.
            Alandaki 01…06 rozetlerinin karşılığı burada; dar ekranda
            noktaların adı yalnızca burada okunuyor. Seçili olan satır
            `data-on` ile işaretli (renk tek işaret değil: rozet de dolu). */}
        <ol className={styles.fieldLegend}>
          {points.map((point) => (
            <li
              key={point.key}
              className={styles.fieldLegendItem}
              data-on={selected.includes(point.key) ? "true" : "false"}
            >
              <span className={styles.fieldLegendIndex} aria-hidden>
                {String(point.order).padStart(2, "0")}
              </span>
              <span className={styles.fieldLegendKanji} lang="ja">
                {point.kanji}
              </span>
              <span className={styles.fieldLegendReading} lang="ja">
                {point.reading}
              </span>
              <span className={styles.fieldLegendLabel}>{point.label}</span>
              <span className={styles.fieldLegendNote}>{point.note}</span>
            </li>
          ))}
        </ol>

        {hit ? (
          <article className={styles.fieldOpen}>
            <p className={styles.fieldOpenKicker}>{openedTitle}</p>
            <h3 className={styles.fieldOpenName} lang="ja">
              {hit.kanji}
            </h3>
            <p className={styles.fieldOpenReading} lang="ja">
              {hit.reading}
            </p>
            <p className={styles.fieldOpenTurkish}>
              {hit.name} · {hit.turkish}
            </p>
            <p className={styles.fieldOpenTitle}>{hit.title}</p>
            <p className={styles.fieldOpenText}>{hit.text}</p>
          </article>
        ) : null}

        <p className={styles.fieldHint}>{selectHint}</p>
        <p className={styles.fieldLineHint} data-on="true">
          {linesOn}
        </p>
        <p className={styles.fieldLineHint} data-on="false">
          {linesOff}
        </p>
      </div>
    </div>
  );
}
