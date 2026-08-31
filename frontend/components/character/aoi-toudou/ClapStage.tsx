"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import styles from "./BoogieWoogieExperience.module.css";

/**
 * ALKIŞ — sayfanın kalbi ve sayfanın esprisi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Boogie Woogie (不義遊戯) tek bir iş yapıyor: alkışla, menzil içindeki iki
 * şeyin YERİNİ değiştiriyor. Bu ada da tam olarak onu yapıyor. Kullanıcı
 * önce iki paneli İŞARETLİYOR, sonra alkış düğmesine basıyor ve iki panel
 * **gerçekten** yer değiştiriyor: `order` dizisi takas ediliyor, yani DOM
 * sırası değişiyor. Görsel bir kaydırma değil — sekme sırası da, ekran
 * okuyucunun okuma sırası da yeni sıraya uyuyor.
 *
 * Ada sayfada ÜÇ KEZ kuruluyor (üç büyük kart, dört küçük not, altı panellik
 * sahne) ve üçü birbirinden bağımsız: her alanın kendi işareti, kendi alkışı
 * ve kendi canlı bölgesi var.
 *
 * ── NİYE YAYINDAKİ 41 MEKANİKTEN AYRI ────────────────────────────────────
 * Listedeki hiçbir mekanik SAYFANIN KENDİ DÜZENİNİ değiştirmiyor: hepsi bir
 * kademeyi ilerletiyor (Naruto, Neji, Rock Lee), bir kapağı açıyor (Urahara,
 * Sai), bir kartı çeviriyor (Tsunade, Kabuto) ya da bir katmanı soyuyor
 * (Orochimaru, Grimmjow). Madara'nın "ölçek değişimi" en yakını ama orada da
 * öğeler yerinde duruyor, yalnızca büyüyor. Burada içerik AYNI kalıyor ve
 * yalnızca KONUM değişiyor — eksen yer değiştirme.
 *
 * ── HAREKET: FLIP, ve niye `useLayoutEffect` YOK ─────────────────────────
 * Takas anındaki sıçrama gerçek bir FLIP: takastan önce her panelin ekran
 * konumu ölçülüyor, `flushSync` ile yeni sıra SENKRON çiziliyor, sonra her
 * panel eski konumundan yenisine Web Animations API ile taşınıyor. `flushSync`
 * sayesinde ölçüm-çizim-canlandırma üçlüsü tek olay işleyicisinde bitiyor;
 * `useLayoutEffect`e gerek kalmıyor (o kanca sunucuda uyarı üretiyor).
 *
 * ⚠️ `prefers-reduced-motion: reduce` iken sıçrama da parlama da HİÇ
 * kurulmuyor — ama TAKASIN KENDİSİ çalışmaya devam ediyor. Hareket
 * duyarlılığı olan biri mekaniği kaybetmiyor, yalnızca zıplamayı kaybediyor.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 *  · İşaret düğmesi gerçek `<button>` ve `aria-pressed` taşıyor.
 *  · Alkış düğmesi hiçbir zaman `disabled` DEĞİL: iki hedef yoksa da basılıyor
 *    ve canlı bölge "tam olarak iki hedef gerekiyor" diyor. Devre dışı bir
 *    düğme odaklanamaz ve klavye kullanıcısı sebebini hiç duyamazdı.
 *  · Takastan sonra `role="status"` + `aria-live="polite"` neyin neyle yer
 *    değiştirdiğini adlarıyla söylüyor.
 *  · ⚠️ ODAK KAYBOLMUYOR: takas edilen ilk panelin işaret düğmesine
 *    taşınıyor. React panelleri kararlı `key` ile TAŞIYOR (yeniden
 *    kurmuyor), yani düğüm hayatta kalıyor; yine de odak açıkça veriliyor
 *    ki kullanıcı taşınan panelin üstünde bıraksın.
 */
export interface ClapPanel {
  /** Kararlı kimlik — DOM sırası değişse de `key` sabit kalıyor. */
  key: string;
  /** Düğmede ve canlı bölgede okunan ad */
  name: string;
  /** Panelin gövdesi — SUNUCUDA çizilmiş, buraya hazır iniyor */
  node: ReactNode;
}

/** `{a}` / `{b}` yer tutucularını dolduruyor. Şablonlar iki dilde de aynı. */
function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in vars ? vars[key] : whole,
  );
}

export function ClapStage({
  items,
  variant,
  fieldLabel,
  clapGlyph,
  markAction,
  unmarkAction,
  clapAction,
  resetAction,
  hintPick,
  hintOne,
  hintReady,
  statusNeedTwo,
  statusMarked,
  statusUnmarked,
  statusSwapped,
  statusReset,
  keyboardHint,
}: {
  items: ClapPanel[];
  /** Izgara sıklığı — CSS `[data-variant]` ile okunuyor */
  variant: "powers" | "kit" | "stage";
  fieldLabel: string;
  clapGlyph: ReactNode;
  markAction: string;
  unmarkAction: string;
  clapAction: string;
  resetAction: string;
  hintPick: string;
  hintOne: string;
  hintReady: string;
  statusNeedTwo: string;
  statusMarked: string;
  statusUnmarked: string;
  statusSwapped: string;
  statusReset: string;
  keyboardHint: string;
}) {
  const initial = useMemo(() => items.map((item) => item.key), [items]);
  const byKey = useMemo(
    () => new Map(items.map((item) => [item.key, item])),
    [items],
  );

  const [order, setOrder] = useState<readonly string[]>(initial);
  const [marked, setMarked] = useState<readonly string[]>([]);
  const [status, setStatus] = useState("");
  /** Parlamanın tekrar oynaması için artan sayaç — `key` olarak kullanılıyor. */
  const [flash, setFlash] = useState(0);

  const panelRefs = useRef(new Map<string, HTMLLIElement>());
  const markRefs = useRef(new Map<string, HTMLButtonElement>());

  const nameOf = (key: string) => byKey.get(key)?.name ?? key;

  const reduced = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Takastan ÖNCEKİ ekran konumları — FLIP'in "First"ü. */
  const measure = () => {
    const rects = new Map<string, DOMRect>();
    for (const [key, el] of panelRefs.current) {
      rects.set(key, el.getBoundingClientRect());
    }
    return rects;
  };

  /** FLIP'in "Invert + Play"i. Ortada hafif bir `scale` sıçraması var. */
  const play = (before: Map<string, DOMRect>) => {
    for (const [key, el] of panelRefs.current) {
      const from = before.get(key);
      if (!from || typeof el.animate !== "function") continue;
      const to = el.getBoundingClientRect();
      const dx = from.left - to.left;
      const dy = from.top - to.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
      el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) scale(1)`, offset: 0 },
          {
            transform: `translate(${dx * 0.45}px, ${dy * 0.45}px) scale(1.07)`,
            offset: 0.55,
          },
          { transform: "translate(0px, 0px) scale(1)", offset: 1 },
        ],
        { duration: 460, easing: "cubic-bezier(0.34, 1.16, 0.64, 1)" },
      );
    }
  };

  const toggleMark = (key: string) => {
    const already = marked.includes(key);
    /* Üçüncü işaret en eskisini düşürüyor: Boogie Woogie her zaman İKİ
       hedefle çalışıyor, üçüncüsü diye bir durum yok. */
    const next = already
      ? marked.filter((k) => k !== key)
      : [...marked, key].slice(-2);
    setMarked(next);
    setStatus(
      fill(already ? statusUnmarked : statusMarked, { a: nameOf(key) }),
    );
  };

  const clap = () => {
    if (marked.length !== 2) {
      setStatus(statusNeedTwo);
      return;
    }
    const [first, second] = marked;
    const soft = reduced();
    const before = soft ? null : measure();

    /* ⚠️ `flushSync`: yeni sıra bu satırda, boyamadan ÖNCE çiziliyor.
       Böylece aşağıdaki ölçüm yeni konumları görüyor ve FLIP'te ara kare
       kaçmıyor. Olay işleyicisinin içindeyiz, yani uyarı üretmiyor. */
    flushSync(() => {
      setOrder((current) => {
        const next = [...current];
        const i = next.indexOf(first);
        const j = next.indexOf(second);
        if (i < 0 || j < 0) return current;
        next[i] = second;
        next[j] = first;
        return next;
      });
      setMarked([]);
      setStatus(
        fill(statusSwapped, { a: nameOf(first), b: nameOf(second) }),
      );
    });

    if (before) {
      play(before);
      setFlash((n) => n + 1);
    }
    markRefs.current.get(first)?.focus();
  };

  const reset = () => {
    const soft = reduced();
    const before = soft ? null : measure();
    flushSync(() => {
      setOrder(initial);
      setMarked([]);
      setStatus(statusReset);
    });
    if (before) play(before);
  };

  const hint =
    marked.length === 0 ? hintPick : marked.length === 1 ? hintOne : hintReady;
  const moved = order.join("|") !== initial.join("|");

  return (
    <div className={styles.field} data-variant={variant}>
      <div className={styles.fieldHead}>
        <p className={styles.fieldLabel}>{fieldLabel}</p>
        <p className={styles.fieldHint}>{hint}</p>
      </div>

      <ol className={styles.fieldGrid} data-variant={variant} aria-label={fieldLabel}>
        {order.map((key, index) => {
          const item = byKey.get(key);
          if (!item) return null;
          const isMarked = marked.includes(key);
          return (
            <li
              key={key}
              className={styles.panel}
              data-marked={isMarked ? "true" : "false"}
              ref={(el) => {
                if (el) panelRefs.current.set(key, el);
                else panelRefs.current.delete(key);
              }}
            >
              <div className={styles.panelBar}>
                <span className={styles.panelPos} aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  className={styles.mark}
                  aria-pressed={isMarked}
                  onClick={() => toggleMark(key)}
                  ref={(el) => {
                    if (el) markRefs.current.set(key, el);
                    else markRefs.current.delete(key);
                  }}
                >
                  <span className={styles.markDot} aria-hidden />
                  <span className={styles.markText}>
                    {isMarked ? unmarkAction : markAction}
                    <span className={styles.markName}>{item.name}</span>
                  </span>
                </button>
              </div>
              <div className={styles.panelBody}>{item.node}</div>
            </li>
          );
        })}
      </ol>

      <div className={styles.clapRow}>
        <button
          type="button"
          className={styles.clap}
          data-armed={marked.length === 2 ? "true" : "false"}
          onClick={clap}
        >
          <span className={styles.clapGlyph} aria-hidden>
            {clapGlyph}
          </span>
          <span className={styles.clapWord}>{clapAction}</span>
          {flash > 0 ? (
            <span key={flash} className={styles.flash} aria-hidden />
          ) : null}
        </button>

        {moved ? (
          <button type="button" className={styles.reset} onClick={reset}>
            {resetAction}
          </button>
        ) : null}
      </div>

      <p className={styles.status} role="status" aria-live="polite">
        {status}
      </p>
      <p className={styles.fieldKeys}>{keyboardHint}</p>
    </div>
  );
}
