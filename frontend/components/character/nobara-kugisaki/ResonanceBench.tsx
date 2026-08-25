"use client";

import { useState } from "react";
import { BodyDiagram, CrackMark, LinkMark, NailMark } from "./NailGlyphs";
import styles from "./ResonanceExperience.module.css";

/**
 * Rezonans tezgâhı — sayfanın kalbi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * İki pano yan yana duruyor ve AYNI koordinat sistemini paylaşıyor. Soldaki
 * saman bebek TIKLANABİLİR; sağdaki hedef tıklanamaz. Yani ziyaretçi hiçbir
 * zaman sonucun olduğu yere dokunmuyor:
 *
 *     sol panoda çivi çak  →  sağ panoda aynı noktada çatlak açılır
 *
 * Ama tek bir şart var: BAĞ. Bağ kurulmadan çakılan çivi yalnızca samanı
 * deliyor ve sağ pano hiç kıpırdamıyor. Bağ sonradan kurulduğunda önceden
 * çakılmış bütün çiviler aynı anda karşı tarafta beliriyor — sebep zaten
 * oradaydı, eksik olan aradaki şeydi.
 *
 * Üçüncü hâl simetriyi bozuyor: 簪 (Kanzashi) çivileri içeriden patlatıyor.
 * O anda soldaki bebek boşalıyor ama sağdaki izler kalıyor — sayfanın kendi
 * kuralının tek istisnası, ve tekniğin de öyle çalışması.
 *
 * Arşivde eşi yok: bir ray, bir ızgara, bir zincir ya da bir sekme listesi
 * değil — etkisi BAŞKA BİR YERDE çıkan bir tezgâh.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Noktaların hepsi gerçek `<button>` ve dokunma hedefi `--touch-min`.
 * Her düğmenin `aria-label`ı hem noktanın adını hem yapılacak işi söylüyor
 * ("Göğüs — çivi çak" / "Göğüs — çiviyi sök") ve `aria-pressed` çivinin
 * yerinde olup olmadığını taşıyor. Sağ pano `role="img"` + `aria-label`:
 * kaç izin açık olduğunu METİN olarak söylüyor, yalnızca çizmiyor.
 * Durum satırı `role="status"`.
 *
 * Metin sunucuda seçilmiş düz dize olarak iniyor (BRIEF §5).
 */

export interface BenchPoint {
  key: string;
  x: number;
  y: number;
  name: string;
}

type Phase = "idle" | "struck" | "pulled" | "linked" | "unlinked" | "hairpin";

export function ResonanceBench({
  points,
  dollLabel,
  targetLabel,
  dollKanji,
  targetKanji,
  strikeVerb,
  pullVerb,
  linkButton,
  linkedTag,
  unlinkedTag,
  hairpinButton,
  hairpinNote,
  resetButton,
  nailsLabel,
  statusIdle,
  statusUnlinked,
  statusLinked,
  statusStruck,
  statusPulled,
  statusHairpin,
  keyboardHint,
}: {
  points: BenchPoint[];
  dollLabel: string;
  targetLabel: string;
  dollKanji: string;
  targetKanji: string;
  strikeVerb: string;
  pullVerb: string;
  linkButton: string;
  linkedTag: string;
  unlinkedTag: string;
  hairpinButton: string;
  hairpinNote: string;
  resetButton: string;
  nailsLabel: string;
  statusIdle: string;
  statusUnlinked: string;
  statusLinked: string;
  statusStruck: string;
  statusPulled: string;
  statusHairpin: string;
  keyboardHint: string;
}) {
  const [nails, setNails] = useState<string[]>([]);
  const [linked, setLinked] = useState(false);
  const [burst, setBurst] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");

  /* Sağ panodaki izler: patlamış olanlar bebekten çıktıktan sonra da
     kalıyor, çünkü hasar zaten verilmiş oldu. */
  const marks = linked ? [...new Set([...nails, ...burst])] : burst;

  /* İki durum da BURADA hesaplanıyor, `setNails`in güncelleyicisinin
     İÇİNDE değil: bir state güncelleyicisinin içinden başka bir state'i
     set etmek React'te güncelleyicinin saf kalması kuralını bozuyor
     (geliştirme kipinde güncelleyici iki kez çağrılıyor ve `phase` iki
     kez yazılıyordu). Olay işleyicisinde `nails` zaten güncel. */
  const toggleNail = (key: string) => {
    const driven = nails.includes(key);
    setNails(
      driven ? nails.filter((item) => item !== key) : [...nails, key],
    );
    setPhase(driven ? "pulled" : linked ? "struck" : "unlinked");
  };

  const makeLink = () => {
    setLinked(true);
    setPhase("linked");
  };

  const hairpin = () => {
    setBurst((current) => [...new Set([...current, ...nails])]);
    setNails([]);
    setPhase("hairpin");
  };

  const reset = () => {
    setNails([]);
    setBurst([]);
    setLinked(false);
    setPhase("idle");
  };

  const status =
    phase === "hairpin"
      ? statusHairpin
      : phase === "linked"
        ? statusLinked
        : phase === "pulled"
          ? statusPulled
          : phase === "unlinked"
            ? statusUnlinked
            : phase === "struck"
              ? statusStruck
              : statusIdle;

  return (
    <div className={styles.bench}>
      <div className={styles.benchPanes}>
        {/* ── SOL: vurulan taraf. Tıklanabilir olan tek pano. ── */}
        <div className={styles.pane} data-side="doll">
          <p className={styles.paneHead}>
            <span className={styles.paneKanji} aria-hidden>
              {dollKanji}
            </span>
            <span className={styles.paneLabel}>{dollLabel}</span>
          </p>

          <div className={styles.figure}>
            <BodyDiagram
              variant="doll"
              className={styles.figureArt}
              bodyClassName={styles.figureBodyDoll}
              weaveClassName={styles.figureWeave}
            />

            {points.map((point) => {
              const driven = nails.includes(point.key);
              return (
                <button
                  key={point.key}
                  type="button"
                  className={styles.point}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  aria-pressed={driven}
                  aria-label={`${point.name} — ${driven ? pullVerb : strikeVerb}`}
                  onClick={() => toggleNail(point.key)}
                >
                  <span className={styles.pointDot} aria-hidden />
                  <span className={styles.pointNail} aria-hidden>
                    <NailMark
                      className={styles.nailArt}
                      bodyClassName={styles.nailBody}
                      headClassName={styles.nailHead}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── ARADAKİ ŞEY: bağ. Kurulmadan sağ taraf hiç kıpırdamıyor. ── */}
        <div className={styles.link} data-linked={linked ? "true" : undefined}>
          <LinkMark
            className={styles.linkGlyph}
            shellClassName={styles.linkShell}
            coreClassName={styles.linkCore}
            linked={linked}
          />
          <span className={styles.linkTag}>{linked ? linkedTag : unlinkedTag}</span>
          <span className={styles.linkThread} aria-hidden />
        </div>

        {/* ── SAĞ: acıyan taraf. Hiçbir düğmesi yok. ── */}
        <div
          className={styles.pane}
          data-side="target"
          role="img"
          aria-label={`${targetLabel} — ${marks.length}/${points.length}`}
        >
          <p className={styles.paneHead}>
            <span className={styles.paneKanji} aria-hidden>
              {targetKanji}
            </span>
            <span className={styles.paneLabel}>{targetLabel}</span>
          </p>

          <div className={styles.figure}>
            <BodyDiagram
              variant="target"
              className={styles.figureArt}
              bodyClassName={styles.figureBodyTarget}
              weaveClassName={styles.figureOutline}
            />

            {points.map((point) => (
              <span
                key={point.key}
                className={styles.mark}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                data-open={marks.includes(point.key) ? "true" : undefined}
                data-burst={burst.includes(point.key) ? "true" : undefined}
                aria-hidden
              >
                <CrackMark
                  className={styles.crackArt}
                  lineClassName={styles.crackLine}
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sayaç ve kararlar ── */}
      <div className={styles.benchBar}>
        <p className={styles.count}>
          <span className={styles.countLabel}>{nailsLabel}</span>
          <span className={styles.countValue}>
            {nails.length}
            <span className={styles.countTotal}> / {points.length}</span>
          </span>
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionMain}
            disabled={linked}
            onClick={makeLink}
          >
            {linkButton}
          </button>
          <button
            type="button"
            className={styles.actionBurst}
            disabled={!linked || nails.length === 0}
            onClick={hairpin}
          >
            {hairpinButton}
          </button>
          <button
            type="button"
            className={styles.actionGhost}
            disabled={!linked && nails.length === 0 && burst.length === 0}
            onClick={reset}
          >
            {resetButton}
          </button>
        </div>
      </div>

      <p className={styles.benchStatus} role="status">
        {status}
      </p>

      {burst.length > 0 ? (
        <p className={styles.benchNote}>{hairpinNote}</p>
      ) : null}

      <p className={styles.benchHint}>{keyboardHint}</p>
    </div>
  );
}
