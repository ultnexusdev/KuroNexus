"use client";

import { useEffect, useState } from "react";
import { FlowStem } from "./ChousouGlyphs";
import styles from "./BloodlineExperience.module.css";

/**
 * DOKUZ KARDEŞ — sayfanın kalbi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Damar sütunu boyunca dokuz halka sıralı. Bir halkaya basıldığında kan
 * ONDAN AŞAĞI akmaya başlıyor: halkanın solundaki `FlowStem` yolunda
 * `stroke-dashoffset` 100'den 0'a iniyor. Akış TAMAMLANDIĞINDA o kardeşin
 * anısı açılıyor ve yandaki "kan bağı" göstergesi bir kademe doluyor.
 * Dokuzu da açıldığında onuncu kadraj beliriyor.
 *
 * Akış tek yönlü: açılan halka kapanmıyor, gösterge geri inmiyor, kan
 * yukarı gitmiyor. Sayfanın ızgarası da (damardan sağa/sola dallanan
 * bölümler) aynı kuralın üstüne kuruldu.
 *
 * ── NEDEN `setTimeout`, `animationend` DEĞİL ─────────────────────────────
 * Akış CSS animasyonuyla çiziliyor ama anının açılması ona bağlanamaz:
 * `prefers-reduced-motion: reduce` durumunda animasyon hiç koşmuyor, yani
 * `animationend` HİÇ TETİKLENMİYOR ve dokuz düğme de sessizce ölü kalırdı
 * (bu, yakalanması en zor hata türü — ne tsc ne eslint görür). Zamanlayıcı
 * ikisinde de çalışıyor: hareket kapalıysa süre sıfıra iniyor, anı anında
 * açılıyor.
 *
 * ── NEDEN YAYINDAKİ HİÇBİRİYLE AYNI DEĞİL ────────────────────────────────
 * Yayındaki sayaçlar (Naruto'nun dokuz kademesi, Rock Lee'nin sekiz kapısı,
 * Neji'nin 2→64'ü) SIRALI bir ray: bir sonraki ancak bir öncekinden sonra
 * açılıyor ve hepsi aynı gövdenin şiddetini artırıyor. Buradaki dokuz halka
 * SIRASIZ — hangisine önce basılacağı serbest — ve her biri ayrı bir
 * KAYIT açıyor, güç kademesi değil. Ino'nun dairesel düğüm ağı yasak:
 * buradaki ağ dairesel değil dikey ve akış tek yönlü. Getō'nun haznesi tek
 * seferde boşalıyordu; bu gösterge hiç boşalmıyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Dokuz halkanın hepsi gerçek `<button>`: sekmeyle geziliyor, Enter/boşluk
 * çalıştırıyor. Açılmış ya da akış sürerken düğme `disabled` YAPILMIYOR —
 * `aria-disabled` + koruma kullanılıyor, çünkü gerçek `disabled` düğmeyi
 * sekme sırasından atar ve klavyeyle basan kişi tam bastığı anda odağını
 * kaybeder. Durum ayrıca `role="status"` ile SESLİ veriliyor.
 *
 * ⚠️ Bu ada `BloodlineExperience.module.css` okuyor; klasörde ikinci bir
 * `.module.css` YOK (sözleşme).
 */

/** Akışın süresi (ms). Ağır ve viskoz — bu sayfada hızlı hiçbir şey yok. */
const FLOW_MS = 1700;

export interface WombCopy {
  key: string;
  /** 一…九 — dekoratif sıra işareti */
  index: string;
  order: number;
  /** Adı kayıtta olmayan halkalarda `null` */
  name: string | null;
  native: string | null;
  title: string;
  memory: string;
  /** Kadraj + yuva — sunucuda çizilip prop olarak iniyor (varsa) */
  frame: React.ReactNode;
}

export interface TenthCopy {
  index: string;
  markFrom: string;
  markTo: string;
  markNote: string;
  /** Ad düğümü sunucuda çiziliyor: bağlantılıysa `Link`, değilse düz metin */
  name: React.ReactNode;
  native: string;
  title: string;
  text: string;
  note: string;
  frame: React.ReactNode;
}

export function NineWombs({
  wombs,
  tenth,
  gaugeLabel,
  gaugeUnit,
  openLabel,
  openedLabel,
  flowingLabel,
  namelessLabel,
  idleHint,
  flowHint,
  midHint,
  doneHint,
  statusFlowing,
  statusOpened,
  statusDone,
  keyboardHint,
}: {
  wombs: WombCopy[];
  tenth: TenthCopy;
  gaugeLabel: string;
  gaugeUnit: string;
  openLabel: string;
  openedLabel: string;
  flowingLabel: string;
  namelessLabel: string;
  idleHint: string;
  flowHint: string;
  midHint: string;
  doneHint: string;
  statusFlowing: string;
  statusOpened: string;
  statusDone: string;
  keyboardHint: string;
}) {
  const [opened, setOpened] = useState<readonly string[]>([]);
  const [flowing, setFlowing] = useState<string | null>(null);
  /** Ekran okuyucuya en son NE olduğunu söylemek için: sayı tek başına yetmez */
  const [last, setLast] = useState<string | null>(null);

  const total = wombs.length;
  const count = opened.length;
  const done = count === total;

  useEffect(() => {
    if (!flowing) return;
    /* Hareket kapalıysa akış çizilmiyor; anı beklemeden açılıyor. */
    const reduce =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const id = window.setTimeout(
      () => {
        setOpened((list) => (list.includes(flowing) ? list : [...list, flowing]));
        setFlowing(null);
      },
      reduce ? 0 : FLOW_MS,
    );
    return () => window.clearTimeout(id);
  }, [flowing]);

  const onOpen = (womb: WombCopy) => {
    /* Akış sürerken ikinci bir halkaya basmak yutuluyor: iki kan aynı anda
       akmıyor, sayfanın kuralı bu. Açılmış halka da yeniden açılmıyor. */
    if (flowing || opened.includes(womb.key)) return;
    setLast(womb.name ?? `${womb.index} · ${namelessLabel}`);
    setFlowing(womb.key);
  };

  const status = done
    ? statusDone
    : flowing
      ? `${statusFlowing} ${last ?? ""}`.trim()
      : last
        ? `${statusOpened} ${last} — ${count}/${total}`
        : idleHint;

  const hint = done ? doneHint : flowing ? flowHint : count > 0 ? midHint : idleHint;

  return (
    <div className={styles.wombs} data-done={done ? "true" : "false"}>
      <ol className={styles.wombRail}>
        {wombs.map((womb) => {
          const isOpen = opened.includes(womb.key);
          const isFlowing = flowing === womb.key;
          return (
            <li
              key={womb.key}
              className={styles.womb}
              data-state={isOpen ? "open" : isFlowing ? "flowing" : "idle"}
              data-nameless={womb.name ? "false" : "true"}
            >
              {/* Akış gövdesi: kan bu yolda YUKARIDAN AŞAĞI yürüyor */}
              <span className={styles.wombStem} aria-hidden>
                <FlowStem
                  className={styles.wombStemArt}
                  bedClassName={styles.wombStemBed}
                  streamClassName={styles.wombStemStream}
                />
              </span>

              <p className={styles.wombIndex} lang="ja" aria-hidden>
                {womb.index}
              </p>

              {womb.name ? (
                <>
                  <h3 className={styles.wombName}>{womb.name}</h3>
                  {womb.native ? (
                    <p className={styles.wombNative} lang="ja">
                      {womb.native}
                    </p>
                  ) : null}
                </>
              ) : (
                <h3 className={styles.wombNameless}>{namelessLabel}</h3>
              )}

              <p className={styles.wombTitle}>{womb.title}</p>

              <button
                type="button"
                className={styles.wombButton}
                aria-pressed={isOpen}
                aria-disabled={isOpen || flowing !== null}
                onClick={() => onOpen(womb)}
              >
                <span className={styles.wombButtonMark} aria-hidden />
                <span className={styles.wombButtonLabel}>
                  {isOpen ? openedLabel : isFlowing ? flowingLabel : openLabel}
                </span>
              </button>

              {isOpen ? (
                <div className={styles.wombMemory}>
                  <p className={styles.wombMemoryText}>{womb.memory}</p>
                  {womb.frame}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      {/* Kan bağı göstergesi — YANDA, sütunun kendisiyle aynı yönde dolan
          dikey bir sütun. Sayı yazıyla da veriliyor: dolgu tek başına
          ekran okuyucuda görünmez bir olay olurdu. */}
      <div className={styles.gauge}>
        <p className={styles.gaugeLabel}>{gaugeLabel}</p>
        <p className={styles.gaugeValue}>
          {count}/{total}
        </p>
        <span
          className={styles.gaugeTube}
          data-full={done ? "true" : "false"}
          aria-hidden
        >
          {wombs.map((womb) => (
            <span
              key={womb.key}
              className={styles.gaugeCell}
              data-filled={opened.includes(womb.key) ? "true" : "false"}
            />
          ))}
        </span>
        <p className={styles.gaugeUnit}>{gaugeUnit}</p>
        <p className={styles.gaugeHint}>{hint}</p>
        <p className={styles.gaugeKeyboard}>{keyboardHint}</p>
      </div>

      <p className={styles.wombStatus} role="status">
        {status}
      </p>

      {/* ══ ONUNCU KADRAJ — yalnızca dokuzu da açıldığında ═════════════════ */}
      {done ? (
        <section className={styles.tenth} aria-labelledby="chs-tenth">
          <p className={styles.tenthIndex} lang="ja" aria-hidden>
            {tenth.index}
          </p>

          <p className={styles.tenthMark} lang="ja">
            <span className={styles.tenthMarkFrom}>{tenth.markFrom}</span>
            <span className={styles.tenthMarkArrow} aria-hidden>
              →
            </span>
            <span className={styles.tenthMarkTo}>{tenth.markTo}</span>
          </p>
          <p className={styles.tenthMarkNote}>{tenth.markNote}</p>

          <h3 id="chs-tenth" className={styles.tenthName}>
            {tenth.name}
          </h3>
          <p className={styles.tenthNative} lang="ja">
            {tenth.native}
          </p>
          <p className={styles.tenthTitle}>{tenth.title}</p>
          <p className={styles.tenthText}>{tenth.text}</p>
          <p className={styles.tenthNote}>{tenth.note}</p>

          {tenth.frame}
        </section>
      ) : null}
    </div>
  );
}
