"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { SpeechBalloon, SpeedBeam } from "./AllMightGlyphs";
import styles from "./PlusUltraExperience.module.css";

/**
 * Toshinori Yagi sayfasının kabuğu — TEK modu ve TEK bütçesi.
 *
 * Kompozisyon deseni (FAZ 2 §1): çocuklar SUNUCUDA çizilmiş gelir, bu
 * bileşen onları yalnızca taşır. İstemciye inen tek şey mod düğmesi, bir
 * dizi harcama kaydı ve filigran.
 *
 * ── NEDEN MOD VE SAYAÇ AYNI ADADA ────────────────────────────────────────
 * Brief'te ikisi ayrı eksen (düğme = mod, mekanik = kalan süre) ama ikisi
 * AYNI durumu okuyor: süre bittiğinde altın form kilitleniyor. İkisini iki
 * ayrı adaya bölmek durumu ikiye kopyalamak olurdu. Çözüm bu dosyadaki
 * context: sayaç bölümü (`SmashMeter`) sunucudan geçen `children` ağacının
 * içinde duruyor ama çalışma anında sağlayıcının ALTINDA olduğu için
 * durumu sorunsuz okuyor — `CuratorFrame`/`CuratorSlot` ikilisiyle birebir
 * aynı desen. Sunucu bileşenleri istemciye çekilmiyor.
 *
 * ── MODUN NE YAPTIĞI (renk DEĞİL, YAPI) ──────────────────────────────────
 * `data-form="golden" | "true"` dört şeyi birden çeviriyor:
 *   --alm-stroke  → panel konturunun kalınlığı (kalın → ince)
 *   --alm-dot     → ben-day nokta deseninin görünürlüğü (açık → yok)
 *   --alm-measure → panolarının genişliği (geniş → dar)
 *   --alm-tone    → sıcak altın → soğuk mavi
 * Ayrıca hero karesi DEĞİŞİYOR: `alm:hero-golden` ↔ `alm:hero-true`.
 *
 * ⚠️ ÇİZGİ ROMAN IZGARASI İKİ DURUMDA DA DURUYOR. Düğme onu açıp
 * kapatmıyor, DERECESİNİ değiştiriyor — Dalga 1 denetiminde Onizuka sayfası
 * mod kapalıyken kilitli ızgarayı tamamen sıfırlıyordu ve varsayılan hâl
 * düz bir tek kolon yığınına dönüyordu.
 *
 * ── SAYAÇ: TÜKENEN KAYNAK ────────────────────────────────────────────────
 * `data-drain="0…5"` kalan süreden türüyor ve her kademede kontur bir
 * kademe inceliyor, noktalar soluyor, renk çekiliyor. Sıfıra inince form
 * "true"ya KİLİTLENİYOR ve düğme devre dışı kalıyor: geri dönüş yok
 * (sayfa yenilenene dek). Bu bir kısıt değil sayfanın tezi.
 *
 * Kök `<main>` DEĞİL: kök layout zaten `<main id="icerik">` çiziyor.
 */

/** Defterdeki bir satır. `over`: kalan süre maliyetten azken harcandı. */
export interface AlmLedgerEntry {
  key: string;
  over: boolean;
}

interface MightState {
  total: number;
  remaining: number;
  ledger: AlmLedgerEntry[];
  exhausted: boolean;
  spend: (key: string, cost: number) => void;
}

/**
 * ⚠️ Varsayılan `null` — ve `SmashMeter` bunu bir hata olarak ele alıyor.
 * Sayaç bölümü sağlayıcının dışında çizilirse sessizce çalışan ama hiçbir
 * şey harcamayan bir düğme kalırdı; `null` o durumu görünür kılıyor.
 */
const MightContext = createContext<MightState | null>(null);

export function useMight(): MightState | null {
  return useContext(MightContext);
}

/**
 * Kalan süreden tükenme kademesi.
 *
 * Kademeler eşit aralıklı DEĞİL: sonlara doğru sıkışıyorlar (100 · 60 · 20)
 * çünkü tükenmenin hissi de öyle — son yirmi dakika ilk seksenden daha
 * hızlı geçiyor.
 */
function drainLevel(remaining: number, total: number): number {
  if (remaining >= total) return 0;
  if (remaining > 100) return 1;
  if (remaining > 60) return 2;
  if (remaining > 20) return 3;
  if (remaining > 0) return 4;
  return 5;
}

export function PlusUltraShell({
  isAdmin,
  total,
  formLabel,
  formNative,
  toGolden,
  toTrue,
  stateGolden,
  stateTrue,
  hintGolden,
  hintTrue,
  lockedTitle,
  lockedText,
  sectionTitle,
  sectionLede,
  watermark,
  crumb,
  hero,
  children,
}: {
  isAdmin: boolean;
  /** Günün bütçesi, dakika */
  total: number;
  formLabel: string;
  formNative: string;
  toGolden: string;
  toTrue: string;
  stateGolden: string;
  stateTrue: string;
  hintGolden: string;
  hintTrue: string;
  lockedTitle: string;
  lockedText: string;
  sectionTitle: string;
  sectionLede: string;
  /** Filigranın kanji yarısı — dekoratif */
  watermark: string;
  crumb: React.ReactNode;
  hero: React.ReactNode;
  children: React.ReactNode;
}) {
  const [golden, setGolden] = useState(true);
  const [remaining, setRemaining] = useState(total);
  const [ledger, setLedger] = useState<AlmLedgerEntry[]>([]);

  /**
   * Bir kalemi harca.
   *
   * ⚠️ İki durum TEK turda kuruluyor ve "sınır aşıldı" işareti harcamadan
   * ÖNCEKİ kalan süreye bakıyor (`cost > remaining`). İşareti `setRemaining`
   * güncelleyicisinin içinde hesaplamak yanlış olurdu: React güncelleyicileri
   * sıraya alıyor ve okunan değer o noktada zaten düşmüş oluyor.
   *
   * Kalan süre maliyetten AZSA kalem yine de harcanıyor; sayaç sıfıra iniyor
   * ve satır "sınır aşıldı" işaretini alıyor. Bu bir hata durumu değil,
   * karakterin kendisi — All Might sınırını defalarca aştı.
   */
  const spend = useCallback(
    (key: string, cost: number) => {
      setLedger((rows) => {
        if (rows.some((row) => row.key === key)) return rows;
        return [...rows, { key, over: cost > remaining }];
      });
      setRemaining((value) => Math.max(0, value - cost));
    },
    [remaining],
  );

  const exhausted = remaining <= 0;
  const form = exhausted || !golden ? "true" : "golden";
  const drain = drainLevel(remaining, total);

  const state = useMemo<MightState>(
    () => ({ total, remaining, ledger, exhausted, spend }),
    [total, remaining, ledger, exhausted, spend],
  );

  return (
    <MightContext.Provider value={state}>
      <div
        className={styles.page}
        data-world="toshinori-yagi"
        data-form={form}
        data-drain={drain}
      >
        {/* Zemin yıkaması: altın formda sıcak, gerçek formda soğuk. Hiçbir
            metnin üstünde değil — kontrast ölçümü bozulmasın diye yalnızca
            zeminde duruyor. */}
        <span className={styles.wash} aria-hidden />

        {/* Filigran: ışın demeti + konuşma balonu + 平和の象徴 */}
        <span className={styles.watermark} aria-hidden>
          <SpeedBeam className={styles.watermarkBeam} />
          <SpeechBalloon className={styles.watermarkBalloon} />
          <span className={styles.watermarkKanji}>{watermark}</span>
        </span>

        <CuratorFrame isAdmin={isAdmin}>
          {crumb}

          <div className={styles.board}>
            {hero}

            {/* ══ 2 · MOD DÜĞMESİ — kâğıdın ortasındaki afiş paneli ══════ */}
            <section
              className={styles.panel}
              data-span="full"
              data-kind="banner"
              aria-labelledby="alm-form"
            >
              <span className={styles.ben} aria-hidden />
              <div className={styles.panelBody}>
                <div className={styles.formHead}>
                  <h2 id="alm-form" className={styles.formTitle}>
                    {sectionTitle}
                  </h2>
                  <p className={styles.formNative} lang="ja" aria-hidden>
                    {formNative}
                  </p>
                </div>
                <p className={styles.formLede}>{sectionLede}</p>

                <div className={styles.formRow}>
                  <p className={styles.formLabel}>{formLabel}</p>
                  <button
                    type="button"
                    className={styles.formToggle}
                    aria-pressed={form === "golden"}
                    disabled={exhausted}
                    onClick={() => setGolden((value) => !value)}
                  >
                    <span className={styles.formToggleMark} aria-hidden>
                      <span className={styles.formToggleBar} />
                      <span className={styles.formToggleBar} />
                      <span className={styles.formToggleBar} />
                    </span>
                    <span className={styles.formToggleText}>
                      {form === "golden" ? toTrue : toGolden}
                    </span>
                  </button>
                  <p className={styles.formState}>
                    {form === "golden" ? stateGolden : stateTrue}
                  </p>
                </div>

                {/* Durum satırı: modun etkisini YAZIYLA da söylüyor —
                    renk tek gösterge olamaz. */}
                <p className={styles.formHint} role="status">
                  {form === "golden" ? hintGolden : hintTrue}
                </p>

                {exhausted ? (
                  <div className={styles.formLocked}>
                    <p className={styles.formLockedTitle}>{lockedTitle}</p>
                    <p className={styles.formLockedText}>{lockedText}</p>
                  </div>
                ) : null}
              </div>
            </section>

            {children}
          </div>
        </CuratorFrame>
      </div>
    </MightContext.Provider>
  );
}
