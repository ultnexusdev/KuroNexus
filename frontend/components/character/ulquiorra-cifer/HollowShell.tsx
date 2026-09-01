"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import styles from "./HollowExperience.module.css";

/**
 * Ulquiorra sayfasının kabuğu, TEK modu ve SAYFANIN KALBİ olan mekanik.
 *
 * Kompozisyon deseni (FAZ 2 §1): çocuklar SUNUCUDA çizilmiş gelir, bu bileşen
 * onları yalnızca taşır. İstemciye inen tek şey iki düğme ailesi ve iki küçük
 * durum: mod boolean'ı ve verilen cevapların dizisi.
 *
 * ── IZGARANIN ORTASINDAKİ GERÇEK BOŞLUK ──────────────────────────────────
 * `.grid` üç parçalı: `1fr | var(--ulq-hole) | 1fr`. ORTA PARÇA BOŞ. İçinde
 * yalnızca `.hole` var ve o da dolu bir kutu değil, iki ince halka + kenarına
 * oturmuş bir 虚. Bölümler 1. ve 3. kolonda, yani içerik gerçekten deliğin
 * etrafından dolanıyor. Delik mod kapalıyken de duruyor (dalga 1'in ikinci
 * dersi: kilitli ızgara varsayılanda da var olmalı).
 *
 * ── MEKANİK: "KALP" ──────────────────────────────────────────────────────
 * Delik bir sayaç. Her bölümün içinde bir `HeartKey` var; basıldığında o
 * bölüm deliğe bir cevap veriyor ve `data-answers` bir artıyor. CSS o
 * niteliğe bakıp `--ulq-hole`u küçültüyor — yani DÜZENİN KENDİSİ değişiyor,
 * bir gösterge değil.
 *
 * Beşinci cevapta delik KAPANMIYOR: `data-swallow="true"` oluyor ve boşluk
 * sayfanın tamamı kadar büyüyüp içeriği yutuyor. Geriye tek bir cümle
 * kalıyor.
 *
 * ── ⚠️ YUTMA ADIMININ ERİŞİLEBİLİRLİK SÖZLEŞMESİ ────────────────────────
 * Yutma, içeriği `visibility: hidden` ile gerçekten erişilebilirlik ağacından
 * ve sekme sırasından çıkarıyor (yalnızca soluklaştırmak yalan olurdu). Bu
 * yüzden üç şart birden yerine getiriliyor:
 *
 *   1. GERİ ALINABİLİR — perdedeki iki düğme (son cevabı geri al / sayfayı
 *      geri getir) durumu tersine çeviriyor.
 *   2. ODAK KAYBOLMUYOR — perde açılırken odak "geri al" düğmesine taşınıyor,
 *      kapanırken deliğin kendi düğmesine geri dönüyor. İkisi de `ref` ile,
 *      `requestAnimationFrame` içinde: nitelik değişiminin stili henüz
 *      uygulanmamışken `focus()` sessizce başarısız olur.
 *   3. DUYURULUYOR — `role="status"` taşıyan görünmez bir bölge her eylemi ve
 *      son cümleyi okutuyor. Bu bölge BİLEREK `.grid`in de perdenin de
 *      DIŞINDA: ikisi de gizlenebiliyor ve gizli bir canlı bölge duyurmaz.
 */

export interface HollowAnswer {
  key: string;
  glyph: string;
  romaji: string;
  label: string;
  note: string;
}

interface HeartState {
  /** Verilen cevapların anahtarları — veriliş sırasında */
  given: readonly string[];
  /** Aynı düğme hem verir hem geri alır */
  toggle: (key: string) => void;
  /** Perde açıkken bölümlerdeki düğmeler zaten erişilemez; yine de bildir */
  swallowed: boolean;
}

const HeartContext = createContext<HeartState | null>(null);

/**
 * Cevap düğmelerinin okuduğu durum.
 *
 * `null` dönerse düğme kendini çizmiyor — sağlayıcısız bir `HeartKey` sessiz
 * bir hata olurdu (basılır, hiçbir şey olmaz).
 */
export function useHeart(): HeartState | null {
  return useContext(HeartContext);
}

export function HollowShell({
  isAdmin,
  answers,
  modeTitle,
  modeNative,
  modeEnter,
  modeExit,
  modeHintOn,
  modeHintOff,
  holeLabel,
  holeGlyph,
  holeGlyphReading,
  counterLabel,
  resetLabel,
  statusGiven,
  statusTaken,
  statusReset,
  swallowTitle,
  swallowLine,
  swallowUndo,
  swallowReset,
  ring,
  hero,
  children,
}: {
  isAdmin: boolean;
  answers: HollowAnswer[];
  modeTitle: string;
  modeNative: string;
  modeEnter: string;
  modeExit: string;
  modeHintOn: string;
  modeHintOff: string;
  holeLabel: string;
  holeGlyph: string;
  holeGlyphReading: string;
  counterLabel: string;
  resetLabel: string;
  statusGiven: string;
  statusTaken: string;
  statusReset: string;
  swallowTitle: string;
  swallowLine: string;
  swallowUndo: string;
  swallowReset: string;
  /** Filigran halkası — sunucuda çizilmiş SVG, istemciye JS olarak inmiyor */
  ring: React.ReactNode;
  hero: React.ReactNode;
  children: React.ReactNode;
}) {
  const [heart, setHeart] = useState(false);
  const [given, setGiven] = useState<string[]>([]);
  const [live, setLive] = useState("");

  const total = answers.length;
  const swallowed = given.length === total && total > 0;

  const undoRef = useRef<HTMLButtonElement | null>(null);
  const resetRef = useRef<HTMLButtonElement | null>(null);
  const wasSwallowed = useRef(false);

  const labelOf = useCallback(
    (key: string) => answers.find((a) => a.key === key)?.label ?? key,
    [answers],
  );

  /* ⚠️ Durum güncelleyicinin İÇİNDE `setLive` çağrılmıyor: güncelleyici saf
     olmak zorunda (StrictMode onu iki kez çalıştırıyor). Okuma `given`in
     kendisinden yapılıyor — düğmeler yalnızca olay işleyicilerinden
     çağrıldığı için kapanış her zaman güncel. */
  const toggle = useCallback(
    (key: string) => {
      const has = given.includes(key);
      setLive(`${labelOf(key)} — ${has ? statusTaken : statusGiven}`);
      setGiven((current) =>
        current.includes(key)
          ? current.filter((k) => k !== key)
          : [...current, key],
      );
    },
    [given, labelOf, statusGiven, statusTaken],
  );

  const heartValue = useMemo(
    () => ({ given, toggle, swallowed }),
    [given, toggle, swallowed],
  );

  const reset = useCallback(() => {
    setGiven([]);
    setLive(statusReset);
  }, [statusReset]);

  const undoLast = useCallback(() => {
    const last = given[given.length - 1];
    if (last) setLive(`${labelOf(last)} — ${statusTaken}`);
    setGiven((current) => current.slice(0, -1));
  }, [given, labelOf, statusTaken]);

  /* Odak yönetimi — yutma adımının ikinci şartı (dosya başı).
     `requestAnimationFrame`: nitelik değişimi commit edilmiş ama stil henüz
     uygulanmamışken `focus()` görünmez bir öğeye çağrılır ve sessizce düşer. */
  useEffect(() => {
    if (swallowed === wasSwallowed.current) return;
    wasSwallowed.current = swallowed;
    const target = swallowed ? undoRef : resetRef;
    const id = requestAnimationFrame(() => target.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [swallowed]);

  /* Son cümle canlı bölgeye ayrıca yazılıyor: perde açıldığında duyurulacak
     şey "cevap verildi" değil, geriye kalan tek cümle. */
  useEffect(() => {
    if (swallowed) setLive(swallowLine);
  }, [swallowed, swallowLine]);

  return (
    <div
      className={styles.page}
      data-world="ulquiorra-cifer"
      data-heart={heart ? "true" : "false"}
      data-answers={String(given.length)}
      data-swallow={swallowed ? "true" : "false"}
    >
      {/* ── HAREKET: gözyaşı izi ────────────────────────────────────────
          Sayfanın TEK animasyonu. Dikey, yavaş, tek yönlü; beş ince çizgi
          yukarıdan aşağı akıyor ve başka hiçbir şey kıpırdamıyor. CSS'te
          `prefers-reduced-motion` kapısında. */}
      <span className={styles.tears} aria-hidden>
        <span className={styles.tear} />
        <span className={styles.tear} />
        <span className={styles.tear} />
        <span className={styles.tear} />
        <span className={styles.tear} />
      </span>

      {/* Görünmez canlı bölge — `.grid`in de perdenin de DIŞINDA (dosya başı,
          üçüncü şart). Gizlenebilen bir kapta olsaydı hiçbir şey duyurmazdı. */}
      <p className={styles.live} role="status">
        {live}
      </p>

      <CuratorFrame isAdmin={isAdmin}>
        {/* `toggle` zaten useCallback'li; obje de memo'lanmazsa her render
            yeni referans üretip tüketicileri boşa çiziyordu (P-09). */}
        <HeartContext.Provider value={heartValue}>
          {hero}

          {/* ══ 2 · MOD DÜĞMESİ ═══════════════════════════════════════════
              "Kalp nerede?" — açıkken anlatı bir kademe geri çekiliyor ve
              sayfanın soruları öne çıkıyor. Sorular varsayılanda DA sayfada
              duruyor; mod onları yaratmıyor, öne alıyor. */}
          <section className={styles.mode} aria-labelledby="ulq-mode">
            <h2 id="ulq-mode" className={styles.modeTitle}>
              {modeTitle}
            </h2>
            <p className={styles.modeNative} lang="ja" aria-hidden>
              {modeNative}
            </p>

            <button
              type="button"
              className={styles.modeButton}
              aria-pressed={heart}
              onClick={() => setHeart((value) => !value)}
            >
              <span className={styles.modeMark} aria-hidden />
              <span className={styles.modeLabel}>
                {heart ? modeExit : modeEnter}
              </span>
            </button>

            {/* Durum yalnızca yapıyla değil YAZIYLA da veriliyor ve mod
                açıkken solmuyor — bu satır `.aside` ailesinde değil. */}
            <p className={styles.modeHint}>{heart ? modeHintOn : modeHintOff}</p>
          </section>

          <div className={styles.grid}>
            {/* ══ IZGARANIN ORTASINDAKİ DELİK ═════════════════════════════
                İkinci kolonun kendisi. `grid-row: 1 / span 4` ile bütün
                satırları kaplıyor, `position: sticky` ile kaydırma boyunca
                ortada kalıyor: bölümler gerçekten onun etrafından dolanıyor. */}
            <div className={styles.hole}>
              <span className={styles.holeRing} aria-hidden>
                {ring}
              </span>
              {/* Filigran: 虚 halkanın KENARINDA, yarısı dışarıda. Dolu bir
                  simge değil — boşluğun kenarına yazılmış bir işaret. */}
              <span className={styles.holeGlyph} lang="ja" aria-hidden>
                {holeGlyph}
              </span>

              <p className={styles.holeLabel}>{holeLabel}</p>
              <p className={styles.holeCount}>
                <span className={styles.holeCountNum}>
                  {given.length}
                  <span className={styles.holeCountSep} aria-hidden>
                    /
                  </span>
                  {total}
                </span>
                <span className={styles.holeCountWord}>{counterLabel}</span>
              </p>
              <p className={styles.holeReading} aria-hidden>
                {holeGlyphReading}
              </p>

              <button
                type="button"
                className={styles.holeReset}
                onClick={reset}
                ref={resetRef}
                disabled={given.length === 0}
              >
                {resetLabel}
              </button>
            </div>

            {children}
          </div>
        </HeartContext.Provider>

        {/* ══ PERDE: boşluk sayfayı alıyor ═══════════════════════════════
            Her zaman mount, `visibility` ile kapalı: geçişi mümkün kılıyor ve
            kapalıyken gerçekten sekme sırasının dışında tutuyor. */}
        <div className={styles.swallow}>
          <div className={styles.swallowInner}>
            <p className={styles.swallowGlyph} lang="ja" aria-hidden>
              {holeGlyph}
            </p>
            <h2 className={styles.swallowTitle}>{swallowTitle}</h2>
            <p className={styles.swallowLine}>{swallowLine}</p>
            <div className={styles.swallowActions}>
              <button
                type="button"
                className={styles.swallowButton}
                onClick={undoLast}
                ref={undoRef}
              >
                {swallowUndo}
              </button>
              <button
                type="button"
                className={styles.swallowButtonQuiet}
                onClick={reset}
              >
                {swallowReset}
              </button>
            </div>
          </div>
        </div>
      </CuratorFrame>
    </div>
  );
}
