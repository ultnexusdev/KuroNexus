"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEEP_SECTION_LAYERS,
  LAYER_IDS,
  LAYER_KANJI,
  type LayerId,
} from "./WorldSection";
import styles from "./DepthRail.module.css";

/**
 * DERİNLİK RAYI — sayfanın imza elemanı.
 *
 * Sayfanın tamamı bir dikey iniş olduğu için kullanıcı hangi katmanda
 * olduğunu her an görmeli. Sağ kenarda sticky bir ray, üzerinde beş düğüm:
 * 現世 / 尸魂界 / 虚圏 / 霊王宮 / 見えざる帝国.
 *
 * Brief'in cümlesi: "Bu, sayfanın hatırlanacağı tek şey. Cesareti buraya
 * harca; geri kalan sakin." Sayfadaki üç cesur karardan biri.
 *
 * ── NEDEN İSTEMCİ ADASI ──────────────────────────────────────────────────
 * Tema değişimi CSS ile çözülüyor ve JS gerektirmiyor (`WorldSection`).
 * Ray ise "hangi katmandayım" sorusunu cevaplıyor ve bu, kaydırma
 * konumuna bağlı — sunucuda bilinemez. Ada küçük: gözlemci, aktif katman
 * ve bir çapa listesi.
 *
 * ── NEDEN ORTA BANT, `threshold: 0.5` DEĞİL ──────────────────────────────
 * Brief 0.5 eşiği söylüyor ama katmanlar `min-height: 100svh` ve içerik
 * geldikçe ekrandan UZUN olacaklar. Ekrandan uzun bir bölümün kesişme
 * oranı hiçbir zaman 0.5'e ulaşmaz — ray o katmanı hiç görmezdi.
 *
 * Bunun yerine görünür alanın ORTASINDA bir bant kuruluyor
 * (`rootMargin: -50% 0px -50% 0px`). O bandı hangi bölüm kesiyorsa aktif
 * olan odur; aynı anda en fazla biri kesebilir, yani titreme de yok.
 *
 * ── theme-color ──────────────────────────────────────────────────────────
 * Katman değişince tarayıcı çubuğu da dönüyor (brief P02 kabul ölçütü).
 * Renk elle yazılmıyor: aktif bölümün HESAPLANMIŞ `--bg` değeri okunuyor,
 * yani tek doğruluk kaynağı `globals.css` (kural 16).
 */
export function DepthRail({
  labels,
  ariaLabel,
}: {
  /** Katman adı — rayda Jost ile beliriyor. Çevrilen tek metin. */
  labels: Record<LayerId, string>;
  ariaLabel: string;
}) {
  const [active, setActive] = useState<LayerId | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  /**
   * ⚠️ Gözlenen küme beş katmandan İBARET DEĞİL: derin bölümler de
   * (`#gotei`, `#hueco`…) sayılıyor ve hangi katmanın derisini
   * giydikleri `DEEP_SECTION_LAYERS`te yazılı. Böyle olmasaydı okuyucu
   * derin bir bölümdeyken ray son katmanın rengini giyerdi — Hueco
   * Mundo'nun beyaz zemininde ray okunmuyordu (ölçüldü, 23 Ağustos 2026).
   */
  useEffect(() => {
    const owner = new Map<string, LayerId>();
    for (const id of LAYER_IDS) owner.set(id, id);
    for (const [id, layer] of Object.entries(DEEP_SECTION_LAYERS)) {
      owner.set(id, layer);
    }

    const sections = [...owner.keys()]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const layer = owner.get(entry.target.id);
            if (layer) setActive(layer);
          }
        }
      },
      // Görünür alanın tam ortasında sıfır yükseklikte bir bant.
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /* Tarayıcı çubuğu aktif katmanın zeminine dönüyor. Değer bölümün
     hesaplanmış stilinden okunuyor — renk kararı CSS'te kalıyor. */
  useEffect(() => {
    if (!active) return;
    const section = document.getElementById(active);
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (!section || !meta) return;
    const bg = getComputedStyle(section).backgroundColor;
    const previous = meta.content;
    if (bg) meta.content = bg;
    return () => {
      meta.content = previous;
    };
  }, [active]);

  const jump = useCallback((id: LayerId) => {
    const section = document.getElementById(id);
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
    /* Odak da gitsin: klavyeyle gezen biri "gittim" geri bildirimini
       yalnızca kaydırmadan alamıyor. `tabindex="-1"` bölümde duruyor. */
    section.focus({ preventScroll: true });
  }, []);

  return (
    <nav
      ref={navRef}
      className={styles.rail}
      aria-label={ariaLabel}
      /* ⚠️ Ray aktif katmanın DERİSİNİ giyiyor: `data-layer` globals.css'te
         bütün token seti yeniden bağlıyor, yani ray "o an bulunduğun
         dünyanın" rengini kendiliğinden alıyor. İkinci bir renk haritası
         tutulmuyor. */
      data-layer={active ?? undefined}
    >
      <ol className={styles.list}>
        {LAYER_IDS.map((id) => (
          <li key={id} className={styles.item}>
            <button
              type="button"
              className={styles.node}
              data-on={active === id ? "" : undefined}
              aria-current={active === id ? "true" : undefined}
              onClick={() => jump(id)}
            >
              {/* Reiatsu halkası: SVG stroke, box-shadow değil — daha temiz
                  ve blur maliyeti yok (brief P03'teki aynı gerekçe). */}
              <span className={styles.ring} aria-hidden="true" />
              <span className={styles.kanji} aria-hidden="true">
                {LAYER_KANJI[id]}
              </span>
              <span className={styles.name}>{labels[id]}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
