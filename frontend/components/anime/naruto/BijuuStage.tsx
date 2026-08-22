"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { NarutoBijuu } from "@/lib/anime/naruto";
import styles from "./BijuuStage.module.css";

/**
 * Kuyruklu Canavarlar — sinematik sahne (22 Ağustos yeniden tasarımı).
 *
 * Eski küçük künye paneli kaldırıldı: üretilen jinchūriki + bijuu
 * illüstrasyonları sitenin en güçlü varlıklarından ve bölümün ANA görsel
 * kahramanı — tam kadraj, %100 opaklıkta çizilirler. Metin görselin
 * ÜSTÜNÜ karartmaz; okunabilirlik yalnızca alt kenardaki yerel gradient'e
 * borçlu (kural: görsel hiçbir koşulda soluk fon dekoruna düşürülmez).
 *
 * ── KADEMELİ RAY ─────────────────────────────────────────────────────────
 * Satır büyüklüğü kuyruk sayısıyla artar (01 en sade, 09 en ağır) ve her
 * satırın solunda kuyruk sayısı kadar çentik durur — liste kendisi bir güç
 * hiyerarşisi. Seçili satır o canavarın chakra rengine bürünür; bölümün
 * bütün accent'i (`--beast-accent`) 350ms'de aynı renge döner.
 *
 * ── GEÇİŞ ────────────────────────────────────────────────────────────────
 * Akatsuki portalının dili (AkatsukiPortal.module.css): eski kadraj merkeze
 * daralarak kaybolur, yenisi chakra renginde bir radyal flaşla girer.
 * Hepsi no-preference kapısında; reduced-motion'da anında değişim.
 *
 * ── PERFORMANS ───────────────────────────────────────────────────────────
 * Yalnızca seçili sahne <Image> olarak çizilir (komşular DOM'da değil);
 * önceki + sonraki sahne `window.Image` ile önceden ısıtılır. Görsel
 * yüklenene kadar chakra renginde bir perde durur, `onLoad` ile açılır.
 */
export function BijuuStage({
  bijuu,
  art,
}: {
  bijuu: NarutoBijuu[];
  /** slug → mutlak görsel adresi (yuva boşsa null — sahne perdeyle çizilir) */
  art: Record<string, string | null>;
}) {
  /* Açılışta Kurama: seri finali, en güçlü kadraj (eski davranışla aynı) */
  const [index, setIndex] = useState(bijuu.length - 1);
  const [prev, setPrev] = useState<NarutoBijuu | null>(null);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const prevTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sel = bijuu[index] ?? bijuu[0];

  /* Komşu sahneleri ısıt: bir sonraki tıklama flaşın arkasında beklemesin */
  useEffect(() => {
    for (const near of [index - 1, index + 1]) {
      const src = bijuu[near] ? art[bijuu[near].slug] : null;
      if (src) {
        const img = new window.Image();
        img.src = src;
      }
    }
  }, [index, bijuu, art]);

  useEffect(
    () => () => {
      if (prevTimer.current) clearTimeout(prevTimer.current);
    },
    [],
  );

  if (!sel) return null;

  const select = (i: number) => {
    if (i === index) return;
    setPrev(sel);
    setIndex(i);
    if (prevTimer.current) clearTimeout(prevTimer.current);
    /* Eski kadraj daralma animasyonu bitince sökülür */
    prevTimer.current = setTimeout(() => setPrev(null), 480);
  };

  const src = art[sel.slug] ?? null;
  const prevSrc = prev ? (art[prev.slug] ?? null) : null;

  return (
    <div
      className={styles.stage}
      style={{ "--beast-accent": sel.accent } as React.CSSProperties}
    >
      <ol className={styles.rail} aria-label="Kuyruklu canavarlar">
        {bijuu.map((beast, i) => (
          <li key={beast.slug}>
            <button
              type="button"
              className={styles.row}
              data-active={i === index ? "" : undefined}
              aria-pressed={i === index}
              onClick={() => select(i)}
              style={
                {
                  "--row-accent": beast.accent,
                  /* Kademeli büyüklük: 01 → 0, 09 → 1 */
                  "--t": (beast.n - 1) / 8,
                } as React.CSSProperties
              }
            >
              <span className={styles.ticks} aria-hidden>
                {Array.from({ length: beast.n }, (_, k) => (
                  <i key={k} />
                ))}
              </span>
              <span className={styles.rowNo} aria-hidden>
                {String(beast.n).padStart(2, "0")}
              </span>
              <span className={styles.rowBody}>
                <span className={styles.rowName}>{beast.name}</span>
                <span className={styles.rowJin}>{beast.jin}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className={styles.hero}>
        {/* Eski kadraj: merkeze daralarak kaybolur (portal dili) */}
        {prev && prevSrc ? (
          <span key={`prev-${prev.slug}`} className={styles.heroPrev} aria-hidden>
            <Image
              src={prevSrc}
              alt=""
              fill
              sizes="(max-width: 860px) 100vw, 66vw"
              style={{ objectPosition: prev.focus }}
            />
          </span>
        ) : null}

        {/* Yeni kadraj: chakra flaşıyla girer. key — sahne baştan kurulur */}
        <figure
          key={sel.slug}
          className={styles.heroCur}
          data-loaded={loaded[sel.slug] ? "" : undefined}
        >
          {src ? (
            <Image
              src={src}
              alt={`${sel.name} ve jinchūriki'si ${sel.jin}`}
              fill
              sizes="(max-width: 860px) 100vw, 66vw"
              style={{ objectPosition: sel.focus }}
              onLoad={() =>
                setLoaded((state) =>
                  state[sel.slug] ? state : { ...state, [sel.slug]: true },
                )
              }
            />
          ) : null}
          {/* Yüklenene kadar (ya da yuva boşsa) chakra perdesi */}
          <span className={styles.veil} aria-hidden />
          <span className={styles.flash} aria-hidden />
        </figure>

        {/* Künye: görselin ALT kenarında, yerel gradient üstünde.
            Görselin kendisi karartılmaz (kural §7). */}
        <div className={styles.plate} aria-live="polite">
          <p className={styles.plateCode}>{sel.tails}</p>
          <h3 className={styles.plateName}>{sel.name}</h3>
          <p className={styles.plateDesc}>{sel.desc}</p>
          <dl className={styles.plateSpec}>
            <div>
              <dt>Jinchūriki</dt>
              <dd>{sel.jin}</dd>
            </div>
            <div>
              <dt>Güç</dt>
              <dd>{sel.power}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
