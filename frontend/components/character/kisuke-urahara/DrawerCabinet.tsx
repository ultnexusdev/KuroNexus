"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ShopGlyph } from "@/lib/characters/kisuke-urahara-experience";
import { ShopGlyphMark } from "./ShopGlyphs";
import { useBenihime } from "./ShopShell";
import styles from "./UraharaExperience.module.css";

/**
 * Çekmece dolabı — sayfanın kalbi.
 *
 * Dokuz çekmece 3×3 bir tansu gövdesinde duruyor ve HEPSİ kapalı açılıyor.
 * Her çekmece gerçek bir `<button>`: klavyeyle gezilebiliyor,
 * `aria-expanded` durumu söylüyor, açılan panel `aria-controls` ile
 * düğmeye bağlı. Kapalı panel `hidden` — ekran okuyucu kapalı çekmecenin
 * içini okumuyor (kapalı olması bu sayfanın konusu).
 *
 * Açık çekmece sayısı dükkânın ışığını belirliyor: `--shop-open` sayacı
 * hem fenerin parlaklığını hem de bütün sayfaya yayılan sıcak yıkamayı
 * (`.lampWash`, tam ekran sabit katman) besliyor. Sayı CSS'e inen tek
 * durum; ışığın tamamı CSS'te.
 *
 * Benihime modu açıldığında çekmeceler GERÇEKTEN kapanıyor (durum
 * sıfırlanıyor, `aria-expanded` da kapanıyor) — sahte bir görsel kapanış
 * ekran okuyucuya yalan söylerdi.
 *
 * Metinler sunucuda seçilip düz dize olarak iniyor (BRIEF §5).
 */

export interface DrawerItem {
  key: string;
  numeral: string;
  kanji: string;
  glyph: ShopGlyph;
  teaser: string;
  name: string;
  title: string;
  text: string;
  /** Düğmenin erişilebilir adı: "3. çekmece — kazık" */
  aria: string;
}

const NONE: readonly string[] = [];

export function DrawerCabinet({
  drawers,
  statusTemplate,
  lampLabel,
}: {
  drawers: DrawerItem[];
  /** "{n}" sayıya dönüşür — role="status" ile duyurulur */
  statusTemplate: string;
  lampLabel: string;
}) {
  const [open, setOpen] = useState<readonly string[]>(NONE);
  const benihime = useBenihime();
  const wasDark = useRef(false);

  /* Işıklar sönerken bütün çekmeceler kapanır; yanarken kendiliğinden
     açılmaz — ziyaretçi hangisini açacağına yeniden karar verir */
  useEffect(() => {
    if (benihime && !wasDark.current) {
      setOpen(NONE);
    }
    wasDark.current = benihime;
  }, [benihime]);

  const toggle = useCallback((key: string) => {
    setOpen((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  }, []);

  const count = open.length;

  return (
    <div
      className={styles.cabinet}
      style={{ "--shop-open": count } as React.CSSProperties}
    >
      {/* Fener yıkaması: tam ekran, sıcak, tıklama geçirmez. Açık çekmece
          arttıkça dükkânın tamamı aydınlanıyor. */}
      <span className={styles.lampWash} aria-hidden />

      <p className={styles.visuallyHidden} role="status">
        {statusTemplate.replace("{n}", String(count))}
      </p>

      <ul className={styles.drawerGrid}>
        {drawers.map((drawer, index) => {
          const isOpen = open.includes(drawer.key);
          const panelId = `urahara-drawer-${drawer.key}`;
          return (
            <li
              key={drawer.key}
              className={styles.drawer}
              data-open={isOpen || undefined}
              /* Sıra numarası kilit gecikmesini besliyor (açılış dalgası) */
              style={{ "--drawer-i": index } as React.CSSProperties}
            >
              <h3 className={styles.drawerHeading}>
                <button
                  type="button"
                  className={styles.drawerFront}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-label={drawer.aria}
                  onClick={() => toggle(drawer.key)}
                >
                  <span className={styles.drawerNumeral} aria-hidden>
                    {drawer.numeral}
                  </span>
                  <span className={styles.drawerFace} aria-hidden>
                    <span className={styles.drawerKanji}>{drawer.kanji}</span>
                    <span className={styles.drawerTeaser}>{drawer.teaser}</span>
                  </span>
                  <ShopGlyphMark name="pull" className={styles.drawerPull} />
                </button>
              </h3>
              <div id={panelId} className={styles.drawerBox} hidden={!isOpen}>
                <div className={styles.drawerObject}>
                  <ShopGlyphMark
                    name={drawer.glyph}
                    className={styles.drawerObjectMark}
                  />
                </div>
                <p className={styles.drawerName}>{drawer.name}</p>
                <p className={styles.drawerTitle}>{drawer.title}</p>
                <p className={styles.drawerText}>{drawer.text}</p>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Dolabın altındaki fener — açık çekmece sayısını taşıyan gösterge */}
      <div className={styles.lamp} aria-hidden>
        <ShopGlyphMark name="lantern" className={styles.lampGlyph} />
        <span className={styles.lampMeter}>
          {Array.from({ length: drawers.length }, (_, index) => (
            <span
              key={index}
              className={styles.lampTick}
              data-lit={index < count || undefined}
            />
          ))}
        </span>
        <span className={styles.lampLabel}>
          {lampLabel} · {count}/{drawers.length}
        </span>
      </div>
    </div>
  );
}
