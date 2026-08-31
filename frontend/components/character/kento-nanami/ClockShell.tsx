"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { ClockDial, TieStripes } from "./NanamiGlyphs";
import styles from "./OvertimeExperience.module.css";

/**
 * Nanami sayfasının kabuğu, vardiya durumu ve tek mod düğmesi.
 *
 * ── KOMPOZİSYON ──────────────────────────────────────────────────────────
 * Faz 2 §1 deseni: çocuklar SUNUCUDA çizilmiş gelir, bu bileşen onları
 * yalnızca taşır ve altına bir context serer. Sunucudan geçen ağaç
 * sağlayıcının `children`'ı olduğu için, o ağacın içindeki istemci
 * bileşenleri (`ShiftEntry`, `ShiftClock`) context'i sorunsuz okuyor —
 * sunucu bileşenleri istemciye çekilmiyor.
 *
 * ── MEKANİK: SAATİ SEN ÇEVİRMİYORSUN ─────────────────────────────────────
 * Vardiya 09:00'da açılıyor, 18:00'de kapanıyor: dokuz saat. Sayfada on iki
 * açılabilir kayıt var ve her biri BİR SAAT harcıyor. Yani gün, sayfayı
 * bitirmeye yetmiyor — bu bir hata değil, mekaniğin tezi.
 *
 * Kullanıcının saate doğrudan erişimi YOK: sürüklenebilir bir kol, ileri-geri
 * bir düğme, tıklanabilir bir saat dilimi yok. Zamanı harcayan tek şey
 * ilerlemenin kendisi. (Dalga 1'deki Onizuka'nın VHS şeridi de bir zaman
 * şeridiydi; farkı burada: orada zaman geri sarılabiliyor ve doğrudan
 * sürükleniyordu.)
 *
 * ── İKİ AYRI KAVRAM: KİLİT ve DERİ ───────────────────────────────────────
 * `closed` (saat 18:00'e geldi) KİLİDİ belirliyor: açılmamış kayıtlar
 * bugünlük kapanıyor, Shibuya kaydı açılıyor.
 * `overtime` yalnızca DERİYİ çeviriyor (lacivert koyulaşıyor, altın öne
 * çıkıyor). Saat 18:00'e geldiğinde deri kendiliğinden düşüyor, ama düğme
 * ondan sonra da serbest: kullanıcı görünüşü geri alabilir, kilitler
 * değişmez. İkisini tek bayrağa bağlamak düğmeyi 18:00'den sonra kilitli
 * gösterirdi.
 */

export interface ShiftLogRow {
  id: string;
  label: string;
  hour: number;
}

interface ShiftValue {
  hour: number;
  start: number;
  end: number;
  /** Saat sona erdi mi — KİLİTLERİ bu belirliyor */
  closed: boolean;
  log: ShiftLogRow[];
  isOpen: (id: string) => boolean;
  open: (id: string, label: string) => void;
  reset: () => void;
}

const ShiftContext = createContext<ShiftValue | null>(null);

/**
 * Vardiya durumu. `null` dönerse bileşen kabuğun dışında çiziliyor demektir —
 * çağıranlar bunu "etkileşim yok, metin yerinde" olarak yorumluyor, hata
 * atmıyor: bir kayıt kutusunun sayfayı düşürmesi kabul edilemez.
 */
export function useShift(): ShiftValue | null {
  return useContext(ShiftContext);
}

export function ClockShell({
  isAdmin,
  start,
  end,
  title,
  native,
  enterLabel,
  exitLabel,
  hintOn,
  hintOff,
  autoNote,
  meterNowLabel,
  meterSpentLabel,
  meterLeftLabel,
  openBanner,
  closedBanner,
  hero,
  children,
}: {
  isAdmin: boolean;
  start: number;
  end: number;
  title: string;
  native: string;
  enterLabel: string;
  exitLabel: string;
  hintOn: string;
  hintOff: string;
  autoNote: string;
  meterNowLabel: string;
  meterSpentLabel: string;
  meterLeftLabel: string;
  openBanner: string;
  closedBanner: string;
  hero: React.ReactNode;
  children: React.ReactNode;
}) {
  const [log, setLog] = useState<ShiftLogRow[]>([]);
  const [overtime, setOvertime] = useState(false);

  const span = end - start;
  const hour = Math.min(start + log.length, end);
  const closed = hour >= end;

  const open = useCallback(
    (id: string, label: string) => {
      setLog((rows) => {
        if (rows.some((row) => row.id === id)) return rows;
        if (rows.length >= span) return rows;
        const next = [...rows, { id, label, hour: start + rows.length + 1 }];
        /* Deri, saat dolduğu ANDA düşüyor — bir effect'e bırakılmadı:
           render sonrası senkronizasyon burada gereksiz bir kare gecikmesi
           ve iki ayrı doğruluk kaynağı üretirdi. */
        if (next.length >= span) setOvertime(true);
        return next;
      });
    },
    [span, start],
  );

  const reset = useCallback(() => {
    setLog([]);
    setOvertime(false);
  }, []);

  const isOpen = useCallback(
    (id: string) => log.some((row) => row.id === id),
    [log],
  );

  const value = useMemo<ShiftValue>(
    () => ({ hour, start, end, closed, log, isOpen, open, reset }),
    [hour, start, end, closed, log, isOpen, open, reset],
  );

  const spent = log.length;
  const left = span - spent;
  const clock = (h: number) => `${String(h).padStart(2, "0")}:00`;

  return (
    <div
      className={styles.page}
      data-world="kento-nanami"
      data-overtime={overtime ? "true" : "false"}
    >
      {/* Küratör çerçevesi kabuğun İÇİNDE: `.page` kök öğe olarak kalmak
          zorunda (sözleşme), ama mod düğmesi hero ile içerik arasına giriyor
          ve bu yüzden çerçeve sunucu tarafında sarılamıyor. */}
      <CuratorFrame isAdmin={isAdmin}>
        <ShiftContext.Provider value={value}>
          <div className={styles.shell}>
            {hero}

            {/* ══ 2 · MOD DÜĞMESİ ══════════════════════════════════════════
                Bant, sayfadaki her bant gibi 7:3. Sol yedi: düğme ve
                gerekçesi. Sağ üç: küçük kadran — defterin ilk satırı. */}
            <section className={styles.band} aria-labelledby="nan-mode">
              <div className={styles.bandMain}>
                <p className={styles.bandCode} aria-hidden>
                  00
                </p>
                <h2 id="nan-mode" className={styles.bandTitle}>
                  {title}
                </h2>
                <p className={styles.bandNative} lang="ja" aria-hidden>
                  {native}
                </p>

                <button
                  type="button"
                  className={styles.modeButton}
                  aria-pressed={overtime}
                  onClick={() => setOvertime((value) => !value)}
                >
                  <span className={styles.modeSwitch} aria-hidden />
                  <span className={styles.modeLabel}>
                    {overtime ? exitLabel : enterLabel}
                  </span>
                </button>

                <p className={styles.modeHint} role="status">
                  {overtime ? hintOn : hintOff}
                </p>
                <p className={styles.modeNote}>{autoNote}</p>
              </div>

              <div className={styles.bandSide}>
                <p className={styles.sideLabel}>{meterNowLabel}</p>
                <p className={styles.sideClock}>{clock(hour)}</p>

                <ClockDial
                  hour={hour}
                  start={start}
                  end={end}
                  className={styles.dial}
                  faceClassName={styles.dialFace}
                  tickClassName={styles.dialTick}
                  tickPastClassName={styles.dialTickPast}
                  handClassName={styles.dialHand}
                  pivotClassName={styles.dialPivot}
                />

                <dl className={styles.meter}>
                  <div className={styles.meterRow}>
                    <dt className={styles.meterKey}>{meterSpentLabel}</dt>
                    <dd className={styles.meterValue}>{spent}</dd>
                  </div>
                  <div className={styles.meterRow}>
                    <dt className={styles.meterKey}>{meterLeftLabel}</dt>
                    <dd className={styles.meterValue}>{left}</dd>
                  </div>
                </dl>

                <p className={styles.sideBanner} data-closed={closed ? "true" : "false"}>
                  {closed ? closedBanner : openBanner}
                </p>

                {/* Defterin boş kalan yüksekliği: gerilen kravat çizgisi.
                    Mobilde 7:3 dikeye döndüğünde alttaki üç birimlik satırın
                    fazlası da bununla doluyor — boşluk yerine desen. */}
                <span className={styles.sideFill} aria-hidden>
                  <TieStripes
                    className={styles.tieArt}
                    stripeClassName={styles.tieBand}
                    fineClassName={styles.tieFine}
                  />
                </span>
              </div>
            </section>

            {children}
          </div>
        </ShiftContext.Provider>
      </CuratorFrame>
    </div>
  );
}
