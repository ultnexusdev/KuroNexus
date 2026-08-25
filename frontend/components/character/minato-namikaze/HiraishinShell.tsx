"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FlashMark, MarkSeal } from "./MinatoGlyphs";
import styles from "./MinatoExperience.module.css";

/**
 * İŞARET SÜTUNU — sayfanın kalbi ve TEK istemci adası.
 *
 * `ShadowShell` emsalinin kardeşi (kompozisyon deseni): çocuklar SUNUCUDA
 * çizilmiş gelir, bu bileşen onları yalnızca taşır. Sayfanın gövdesi
 * tarayıcıya JS olarak inmez; inen tek şey bu sütun ve üç durum.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Kenarda sabit duran yedi mühür var, her biri bir bölüme bağlı. Bir mühre
 * basıldığında sayfa o bölüme IŞINLANIR:
 *
 *   scrollIntoView({ behavior: "instant" })
 *
 * ⚠️ Buradaki "instant" pazarlık konusu değil. "smooth" yazmak mekaniğin
 * anlamını yok eder: Hiraishin bir hız tekniği değil, mesafeyi iptal eden
 * bir teknik. Aradaki yolu göstermek tam olarak yapmamamız gereken şey.
 * Kaydırma davranışı CSS'teki `scroll-behavior`ı da ezer, yani sayfa ya da
 * tarayıcı yumuşak kaydırma istiyorsa bile burada anlık kalır.
 *
 * Varışta o bölümün kenarında bir an sarı bir çizgi parlıyor: kökteki
 * `data-arrive` niteliği bölüm anahtarını taşıyor, flaşın kendisi CSS'te
 * (`.page[data-arrive="…"] [data-mark="…"]::after`) ve yalnızca
 * `prefers-reduced-motion: no-preference` kapısının arkasında. Reduce'ta
 * flaş yok — sıçrama yine anlık.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Mühürlerin hepsi gerçek `<button>`; her birinin görünür adı var (masaüstünde
 * imlece/odağa gelince açılan etiket, dar ekranda görsel olarak gizli ama
 * erişim ağacında duran ad). Okunan bölümün mührü `aria-current="true"`
 * taşıyor. Işınlanmadan sonra odak hedef bölüme veriliyor (`tabIndex={-1}`),
 * yani klavye kullanıcısı vardığı yerden devam ediyor — yoksa odak sütunda
 * kalır ve Tab tuşu onu sayfanın en başına geri götürürdü.
 *
 * Mod düğmesinin adı DEĞİŞMİYOR (hep "Hiraishin"): durumu `aria-pressed`
 * söylüyor, etkisini `role="status"` satırı anlatıyor.
 */

export interface MarkView {
  key: string;
  /** Hedef bölümün DOM kimliği */
  targetId: string;
  /** Mühür setindeki glif numarası (0-6) */
  glyph: number;
  /** Düğmenin erişilebilir adı ve imleçte açılan etiket */
  title: string;
}

/** Varış flaşının süresi — CSS'teki `--min-flash-dur` ile aynı olmalı. */
const FLASH_MS = 560;

export function HiraishinShell({
  marks,
  railLabel,
  railHint,
  modeLabel,
  modeHint,
  children,
}: {
  marks: MarkView[];
  railLabel: string;
  railHint: string;
  modeLabel: string;
  modeHint: string;
  children: React.ReactNode;
}) {
  const [lit, setLit] = useState(false);
  const [active, setActive] = useState(marks[0]?.key ?? "");
  const [arrived, setArrived] = useState<string | null>(null);

  const timer = useRef<number | null>(null);
  const frame = useRef<number | null>(null);

  /* Okunmakta olan bölüm. Görüş alanının ortasında ince bir şerit açıyoruz
     (üstten %42, alttan %52 kırpılmış): o şeride giren ilk bölüm aktif
     sayılıyor. Şerit dar olduğu için iki bölüm aynı anda "aktif" görünmüyor;
     hiçbiri girmiyorsa son aktif kalıyor (uzun boşluklarda titremesin). */
  useEffect(() => {
    const nodes: HTMLElement[] = [];
    for (const mark of marks) {
      const node = document.getElementById(mark.targetId);
      if (node) {
        nodes.push(node);
      }
    }
    if (nodes.length === 0) {
      return;
    }

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }
        const first = marks.find((mark) => visible.has(mark.targetId));
        if (first) {
          setActive(first.key);
        }
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 },
    );

    for (const node of nodes) {
      observer.observe(node);
    }
    return () => observer.disconnect();
  }, [marks]);

  /* Sayfadan çıkılırken bekleyen flaş zamanlayıcıları temizlenir. */
  useEffect(
    () => () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }
      if (frame.current !== null) {
        window.cancelAnimationFrame(frame.current);
      }
    },
    [],
  );

  const teleport = useCallback((mark: MarkView) => {
    const node = document.getElementById(mark.targetId);
    if (!node) {
      return;
    }

    /* Anlık sıçrama. `behavior: "instant"` çok eski bir motorda geçersiz
       değer sayılıp atardı; o durumda niteliksiz çağrı aynı yere götürür. */
    try {
      node.scrollIntoView({ behavior: "instant", block: "start" });
    } catch {
      node.scrollIntoView(true);
    }
    node.focus({ preventScroll: true });
    setActive(mark.key);

    /* Aynı mühre arka arkaya basıldığında flaş yeniden başlasın diye önce
       nitelik kaldırılıp bir kare sonra geri konuyor: CSS animasyonu ancak
       eşleşme kopup yeniden kurulunca baştan çalışır. */
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
    }
    if (frame.current !== null) {
      window.cancelAnimationFrame(frame.current);
    }
    setArrived(null);
    frame.current = window.requestAnimationFrame(() => {
      frame.current = null;
      setArrived(mark.key);
    });
    timer.current = window.setTimeout(() => {
      timer.current = null;
      setArrived(null);
    }, FLASH_MS);
  }, []);

  return (
    <div
      className={styles.page}
      data-world="minato-namikaze"
      data-hiraishin={lit || undefined}
      data-arrive={arrived ?? undefined}
    >
      <div className={styles.rail}>
        <button
          type="button"
          className={styles.railToggle}
          aria-pressed={lit}
          onClick={() => setLit((value) => !value)}
        >
          <FlashMark className={styles.railToggleGlyph} />
          <span className={styles.railToggleLabel}>{modeLabel}</span>
        </button>

        <nav className={styles.railNav} aria-label={railLabel}>
          <span className={styles.railThread} aria-hidden />
          <ul className={styles.markList}>
            {marks.map((mark) => (
              <li key={mark.key} className={styles.markItem}>
                <button
                  type="button"
                  className={styles.mark}
                  aria-current={active === mark.key ? "true" : undefined}
                  onClick={() => teleport(mark)}
                >
                  <MarkSeal variant={mark.glyph} className={styles.markGlyph} />
                  <span className={styles.markName}>{mark.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Sütunun ne olduğunu söyleyen satır ve mod durumu. İkisi de dar
          ekranda gizli: orada sütun zaten alt şeride iniyor ve İşaretler
          bölümü mekaniği yazıyla anlatıyor. */}
      <p className={styles.railHint}>{railHint}</p>
      <p className={styles.railStatus} role="status">
        {lit ? modeHint : ""}
      </p>

      {children}
    </div>
  );
}
