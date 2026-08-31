"use client";

import { useCallback, useRef, useState } from "react";
import { useRestriction } from "./RestrictionShell";
import styles from "./ArmoryExperience.module.css";

/**
 * SİLAH RAFI — sayfanın kalbi (istemci adası 2/2).
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Envanterde ALTI EŞİT GÖZ var; her gözde bir alet. Bir göz seçildiğinde
 * altındaki ÖLÇÜ ŞERİDİ o alete göre YENİDEN HESAPLANIYOR:
 *
 *   間合 menzil (cm)   → alete göre değişiyor, kısıtlama tamamlanınca artıyor
 *   重量 ağırlık (kg)  → aletin kendi kütlesi; kısıtlamayla DEĞİŞMİYOR
 *   速度 hız (0–100)   → alete göre değişiyor, kısıtlama tamamlanınca artıyor
 *   呪力 lanet enerjisi → HER SEÇİMDE 0
 *
 * Dördüncü sütun sayfanın sessiz esprisi: kullanıcı ne seçerse seçsin, hangi
 * modda olursa olsun o sayı kıpırdamıyor.
 *
 * Hiçbir göz seçili değilken şerit RAFIN TOPLAMINI okuyor (en uzun menzil,
 * taşınan toplam ağırlık, en yüksek hız) — yani boşta bile bir envanter
 * dökümü. Dördüncü sütun toplamda da sıfır.
 *
 * ── YASAK OLANDAN AYRIM ──────────────────────────────────────────────────
 * Urahara'nın "3×3 açılan çekmece ızgarası" YASAK. Burada hücreler AÇILMIYOR:
 * seçiliyor ve aşağıdaki sayıları değiştiriyor. Hücrenin içeriği baştan
 * görünür; gizli bir katman, açılan bir çekmece, ortaya çıkan bir sır yok.
 *
 * Tōji'nin envanteriyle de ayrım şart (aynı dalga): onda bir ÇANTA var ve
 * vurgu tek bir sütunun hiç değişmemesinde; burada bir RAF var ve vurgu üç
 * sütunun gerçekten yeniden hesaplanmasında. Sıfır sütunu ikisinde de duruyor
 * ama burada beş sütunun arasındaki bir sessizlik, orada sayfanın konusu.
 *
 * ── NEDEN DURUM BURADA ───────────────────────────────────────────────────
 * `data-restriction` sayfanın tamamını çeviriyor ve `RestrictionShell`de
 * duruyor; seçim ise yalnızca bu bölümü ilgilendiriyor. İkisini tek adaya
 * toplamak, mod düğmesine her basışta rafın da yeniden çizilmesi demekti.
 *
 * ── ÇEVİRİ ───────────────────────────────────────────────────────────────
 * Bu adaya `LocalizedText` İNMİYOR: her etiket sunucuda `pick()` ile düz
 * dizeye çevrilip prop olarak geliyor (FAZ 2 §1). Ölçü sütunlarının
 * başlıkları ve uyarı satırları dâhil.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Her göz gerçek bir `<button>`; sekmeyle sırayla geziliyor, ok tuşları
 * doğrusal olarak komşu göze taşıyor (kolon sayısı ekrana göre değişiyor,
 * bu yüzden ok tuşları kolon aritmetiğine BAĞLANMADI — 360 px'te iki, geniş
 * ekranda üç kolon var ve doğrusal gezinme ikisinde de doğru davranıyor),
 * Home/End uçlara atlıyor. Seçim `aria-pressed` ile bildiriliyor, değişim
 * ayrıca `role="status"` satırında seslendiriliyor.
 */

export interface RackReadings {
  reach: number;
  speed: number;
}

export interface RackCell {
  id: string;
  /** Göz numarası — çevrilmez */
  mark: string;
  kanji: string;
  /** Romaji / özel ad — çevrilmez */
  reading: string;
  name: string;
  gradeKanji: string;
  grade: string;
  note: string;
  mass: number;
  half: RackReadings;
  full: RackReadings;
  /** Kısıtlama tamamlanınca raftan kalkan göz (yalnızca gözlük) */
  retired: boolean;
  /** Sunucuda çizilmiş içerik: yüklenmiş kare ya da elle çizilmiş siluet */
  art: React.ReactNode;
  /** Sunucuda çizilmiş küratör bloğu — hücrenin HEMEN ALTINDA duruyor */
  slot: React.ReactNode;
}

export interface RackGauge {
  id: "reach" | "mass" | "speed" | "energy";
  kanji: string;
  label: string;
  /** Birim — çevrilmez */
  unit: string;
  max: number;
}

export interface RackLabels {
  rackLabel: string;
  rackHint: string;
  stripTitle: string;
  idleName: string;
  idleNote: string;
  selectedLabel: string;
  retiredLabel: string;
  zeroNote: string;
  massNote: string;
  measureNote: string;
  statusPrefix: string;
  statusCleared: string;
}

/** Ondalık gerekmiyorsa yazılmıyor: 6.4 kg ama 0 kg. */
function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0$/, "");
}

export function WeaponRack({
  cells,
  gauges,
  labels,
}: {
  cells: readonly RackCell[];
  gauges: readonly RackGauge[];
  labels: RackLabels;
}) {
  const restriction = useRestriction();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [announced, setAnnounced] = useState<string>("");
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const selected = cells.find((cell) => cell.id === selectedId) ?? null;

  const readingsOf = (cell: RackCell): RackReadings =>
    restriction === "after" ? cell.full : cell.half;

  /* Boşta: rafın toplamı. En uzun menzil, taşınan toplam ağırlık, en yüksek
     hız — üçü de moda göre yeniden hesaplanıyor, çünkü menzil ve hız moda
     bağlı. Dördüncü sütun toplamda da sıfır. */
  const totals = {
    reach: Math.max(...cells.map((cell) => readingsOf(cell).reach)),
    mass: cells.reduce((sum, cell) => sum + cell.mass, 0),
    speed: Math.max(...cells.map((cell) => readingsOf(cell).speed)),
    energy: 0,
  };

  const valueOf = (gaugeId: RackGauge["id"]): number => {
    if (gaugeId === "energy") return 0;
    if (!selected) return totals[gaugeId];
    if (gaugeId === "mass") return selected.mass;
    return readingsOf(selected)[gaugeId];
  };

  const toggle = (cell: RackCell) => {
    if (cell.id === selectedId) {
      setSelectedId(null);
      setAnnounced(labels.statusCleared);
      return;
    }
    setSelectedId(cell.id);
    setAnnounced(`${labels.statusPrefix} ${cell.name} · ${cell.kanji}`);
  };

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const last = buttons.current.length - 1;
      let next = -1;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        next = index === last ? 0 : index + 1;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        next = index === 0 ? last : index - 1;
      } else if (event.key === "Home") {
        next = 0;
      } else if (event.key === "End") {
        next = last;
      }
      if (next < 0) return;
      event.preventDefault();
      buttons.current[next]?.focus();
    },
    [],
  );

  /* Sayı değiştiğinde kısa bir takırtı çalsın diye `key` değere bağlı:
     React düğümü söküp yeniden takıyor, `steps()` animasyonu baştan
     başlıyor. Hareketin tamamı CSS'te `no-preference` kapısında. */
  const numberKey = (gaugeId: string, value: number) =>
    `${gaugeId}-${selectedId ?? "total"}-${restriction}-${value}`;

  return (
    <div className={styles.rack}>
      {/* ── ENVANTER IZGARASI ───────────────────────────────────────────── */}
      <p className={styles.rackHint} id="mki-rack-hint">
        {labels.rackHint}
      </p>

      <ul
        className={styles.grid}
        aria-label={labels.rackLabel}
        aria-describedby="mki-rack-hint"
      >
        {cells.map((cell, index) => {
          const readings = readingsOf(cell);
          const isSelected = cell.id === selectedId;
          const isRetired = cell.retired && restriction === "after";
          return (
            <li key={cell.id} className={styles.gridItem}>
              <button
                ref={(node) => {
                  buttons.current[index] = node;
                }}
                type="button"
                className={styles.cell}
                aria-pressed={isSelected}
                data-retired={isRetired ? "true" : "false"}
                onClick={() => toggle(cell)}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                <span className={styles.cellMark} aria-hidden>
                  {cell.mark}
                </span>
                <span className={styles.cellArt}>{cell.art}</span>
                {/* Raftan kalkan gözün üstündeki X — filigranın küçük hâli */}
                <span className={styles.cellStrike} aria-hidden />
                <span className={styles.cellKanji} lang="ja" aria-hidden>
                  {cell.kanji}
                </span>
                <span className={styles.cellName}>{cell.name}</span>
                <span className={styles.cellReading}>{cell.reading}</span>
                <span className={styles.cellGrade} lang="ja" aria-hidden>
                  {cell.gradeKanji}
                </span>
                <span className={styles.cellFoot}>
                  <span className={styles.cellFig}>
                    {formatNumber(readings.reach)}
                    <i className={styles.cellUnit}>cm</i>
                  </span>
                  <span className={styles.cellFig}>
                    {formatNumber(cell.mass)}
                    <i className={styles.cellUnit}>kg</i>
                  </span>
                  <span className={styles.cellFig} data-zero="true">
                    0
                    <i className={styles.cellUnit}>呪力</i>
                  </span>
                </span>
                {isRetired ? (
                  <span className={styles.cellFlag}>{labels.retiredLabel}</span>
                ) : null}
                {isSelected ? (
                  <span className={styles.cellFlag} data-on="true">
                    {labels.selectedLabel}
                  </span>
                ) : null}
              </button>

              {/* Hücrenin HEMEN ALTINDA kendi küratör yuvası (kullanıcı
                  şartı: sayfa sonunda toplu yuva bloğu yasak). Ziyaretçide
                  bu düğüm boş geliyor — sunucu `isAdmin` ile kesti. */}
              {cell.slot}
            </li>
          );
        })}
      </ul>

      {/* ── ÖLÇÜ ŞERİDİ ─────────────────────────────────────────────────── */}
      <section className={styles.strip} aria-labelledby="mki-strip">
        <h3 id="mki-strip" className={styles.stripTitle}>
          {labels.stripTitle}
        </h3>

        <p className={styles.stripName}>
          {selected ? selected.name : labels.idleName}
          {selected ? (
            <span className={styles.stripKanji} lang="ja" aria-hidden>
              {selected.kanji}
            </span>
          ) : null}
        </p>
        <p className={styles.stripNote}>
          {selected ? selected.note : labels.idleNote}
        </p>
        {selected ? (
          <p className={styles.stripGrade}>
            {selected.grade}
            <span className={styles.stripGradeKanji} lang="ja" aria-hidden>
              {selected.gradeKanji}
            </span>
          </p>
        ) : null}

        <ul className={styles.gauges}>
          {gauges.map((gauge) => {
            const value = valueOf(gauge.id);
            const fill = Math.min(100, Math.round((value / gauge.max) * 100));
            const isZero = gauge.id === "energy";
            return (
              <li
                key={gauge.id}
                className={styles.gauge}
                data-zero={isZero ? "true" : "false"}
              >
                <span className={styles.gaugeKanji} lang="ja" aria-hidden>
                  {gauge.kanji}
                </span>
                <span className={styles.gaugeLabel}>{gauge.label}</span>
                <span
                  key={numberKey(gauge.id, value)}
                  className={styles.gaugeValue}
                >
                  {formatNumber(value)}
                  <i className={styles.gaugeUnit}>{gauge.unit}</i>
                </span>
                <span className={styles.gaugeTrack} aria-hidden>
                  <span
                    className={styles.gaugeFill}
                    style={{ width: `${fill}%` }}
                  />
                </span>
              </li>
            );
          })}
        </ul>

        <p className={styles.stripZero}>{labels.zeroNote}</p>
        <p className={styles.stripMass}>{labels.massNote}</p>
        <p className={styles.stripMeasure}>{labels.measureNote}</p>

        {/* Ekran okuyucu duyurusu: seçim de bir olay, seçimin kalkması da */}
        <p className={styles.stripStatus} role="status">
          {announced}
        </p>
      </section>
    </div>
  );
}
