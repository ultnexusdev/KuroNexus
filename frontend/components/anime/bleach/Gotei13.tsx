"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  DIVISIONS,
  gatePosition,
  type DivisionRecord,
  type Era,
} from "@/lib/anime/bleach/divisions";
import { DivisionFlower } from "./DivisionFlower";
import styles from "./Gotei13.module.css";
import world from "./world.module.css";

/**
 * P03 · GOTEI 13 — ON ÜÇ KAPI.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * On üç bölük, on üç KART değil on üç KAPI. Naruto'daki "Takımlar"
 * ızgarasının karşılığı ama ızgara değil: Seireitei'nin dairesel planına
 * sadık, ortada Sōkyoku Tepesi ve çevresinde bir daire üzerinde on üç kapı.
 *
 * ── NEDEN SVG DEĞİL, HTML ────────────────────────────────────────────────
 * Brief bir SVG koordinat sistemi öneriyor. Kapılar HTML `<button>` olarak
 * kuruldu ve daire üzerine CSS custom property ile yerleştirildi:
 * klavye gezinmesi, odak halkası, `aria-expanded` ve dokunma hedefi
 * kendiliğinden geliyor. SVG içinde etkileşimli öğe kurmak üçünü de elle
 * yeniden yazmak demekti — ve bir tanesini unutmak yeterdi.
 *
 * Konumlar `gatePosition()` ile ÖNCEDEN hesaplanıyor (deterministik):
 * sunucu ve istemci aynı değerleri üretiyor, hidrasyon uyuşmazlığı yok.
 *
 * ── SUNUCUDA ÇİZİLİYOR ───────────────────────────────────────────────────
 * `"use client"` yalnızca etkileşim demek; ilk boyama yine sunucuda.
 * JS gelmezse on üç kapı, numaraları ve zaman kipi başlığıyla duruyor —
 * bölüm boş görünmüyor (kabul ölçütü).
 *
 * ── KLAVYE ───────────────────────────────────────────────────────────────
 * Gezinen sekme indeksi (roving tabindex): kapı grubu sekme sırasında TEK
 * durak, içinde ok tuşlarıyla dolaşılıyor. On üç ayrı sekme durağı,
 * klavyeyle sayfayı gezen birini bölümün içinde on üç kez durdururdu.
 * Enter/Space açıyor, Escape kapatıyor.
 *
 * ── PANEL DAİRENİN MERKEZİNDE ────────────────────────────────────────────
 * Panel DOM'da kapının yanında duruyor (ekran okuyucu ve `aria-controls`
 * için doğru olan) ama EKRANDA Sōkyoku Tepesi'ne, yani dairenin ortasına
 * konumlanıyor. Bu ayrım gerekli: `.slot` mutlak konumlu olduğu için
 * panelin `left: 50%` yazması onu KAPININ ortasına koyuyordu — açılan panel
 * kaptanın karesini ve iki komşu kapıyı kapatıyordu (kullanıcı bildirimi,
 * 27 Ağustos 2026). Kapsayıcı sorgusu (`cqw`) planın genişliğini ölçüyor;
 * kapının daire üzerindeki yeri `--gx`/`--gy` ile SAYI olarak iniyor ve
 * fark CSS'te kapatılıyor. Ayrıntı: `Gotei13.module.css`.
 */
export function Gotei13({
  locale,
  art,
  pens,
  labels,
}: {
  locale: string;
  /**
   * Kapı aralığından görünen kaptan kareleri — SUNUCUDA çizilip prop
   * olarak iniyor (`Gotei13Section` başlığındaki gerekçe).
   */
  art: ReactNode[];
  /** Küratör kalemleri — kapının KARDEŞİ, içinde değil (iç içe buton olmaz) */
  pens: ReactNode[];
  labels: {
    eyebrow: string;
    title: string;
    lede: string;
    eraClassic: string;
    eraTybw: string;
    eraAria: string;
    gatesAria: string;
    captain: string;
    lieutenant: string;
    zanpakuto: string;
    bankai: string;
    specialty: string;
    flower: string;
    unknown: string;
    close: string;
    center: string;
    /** Kapı başına ekran okuyucu adı — sunucuda üretilmiş hazır dizi */
    gateLabels: string[];
  };
}) {
  const [era, setEra] = useState<Era>("classic");
  const [open, setOpen] = useState<number | null>(null);
  const [focused, setFocused] = useState(0);
  const gatesRef = useRef<HTMLDivElement | null>(null);

  /* Açılan kapı adrese yazılıyor: bölüm paylaşılabilir olmalı (#gotei-8).
     `replaceState` — `location.hash` yazmak sayfayı zıplatırdı ve kapı
     zaten görünür durumda. */
  useEffect(() => {
    if (open === null) return;
    window.history.replaceState(null, "", `#gotei-${open}`);
  }, [open]);

  /* Adresle gelen ziyaretçi doğrudan o kapıyı açık bulsun */
  useEffect(() => {
    const match = /^#gotei-(\d{1,2})$/.exec(window.location.hash);
    if (!match) return;
    const n = Number(match[1]);
    if (n >= 1 && n <= DIVISIONS.length) {
      setOpen(n);
      setFocused(n - 1);
    }
  }, []);

  const focusGate = useCallback((index: number) => {
    const next = (index + DIVISIONS.length) % DIVISIONS.length;
    setFocused(next);
    const el = gatesRef.current?.querySelectorAll("button")[next];
    (el as HTMLButtonElement | undefined)?.focus();
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      focusGate(focused + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      focusGate(focused - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusGate(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusGate(DIVISIONS.length - 1);
    } else if (event.key === "Escape" && open !== null) {
      event.preventDefault();
      setOpen(null);
    }
  };

  return (
    <section
      id="gotei"
      data-layer="soul-society"
      className={`${styles.section} ${world.deferPaint}`}
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={world.eyebrow} lang="en">
            {labels.eyebrow}
          </p>
          <h2 className={world.section}>{labels.title}</h2>
          <p className={`${world.body} ${styles.lede}`}>{labels.lede}</p>

          {/* ZAMAN KİPİ ANAHTARI — hiçbir wiki'nin yan yana göstermediği
              iki tablo. Sayfanın "arşivci" kimliğini kanıtlayan şey bu. */}
          <div
            className={styles.era}
            role="radiogroup"
            aria-label={labels.eraAria}
          >
            <button
              type="button"
              role="radio"
              aria-checked={era === "classic"}
              className={styles.eraOption}
              data-on={era === "classic" ? "" : undefined}
              onClick={() => setEra("classic")}
            >
              {labels.eraClassic}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={era === "tybw"}
              className={styles.eraOption}
              data-on={era === "tybw" ? "" : undefined}
              onClick={() => setEra("tybw")}
            >
              {labels.eraTybw}
            </button>
          </div>
        </header>

        <div
          ref={gatesRef}
          className={styles.plan}
          role="group"
          aria-label={labels.gatesAria}
          onKeyDown={onKeyDown}
        >
          {/* Sōkyoku Tepesi — dairenin merkezi. Kapı açıkken panel bunun
              üstüne biniyor: daire gezinme, merkez içerik. */}
          <span className={styles.sokyoku} aria-hidden="true">
            <span className={styles.sokyokuKanji}>双殛</span>
            <span className={world.meta}>{labels.center}</span>
          </span>

          {DIVISIONS.map((division, i) => {
            const position = gatePosition(i);
            const isOpen = open === division.n;
            return (
              <div
                key={division.n}
                className={styles.slot}
                style={
                  {
                    "--x": `${position.x}%`,
                    "--y": `${position.y}%`,
                    /* Aynı konum BİRİMSİZ de iniyor: panel dairenin
                       merkezine oturacak ve merkez ile kapı arasındaki
                       farkı CSS `calc()` ile hesaplıyor. Yüzdeyle bu
                       hesap yapılamıyor — yüzde kapının kutusuna göre
                       çözülürdü. */
                    "--gx": position.x,
                    "--gy": position.y,
                    "--reiatsu": division.reiatsu,
                  } as React.CSSProperties
                }
              >
                <button
                  type="button"
                  className={styles.gate}
                  data-open={isOpen ? "" : undefined}
                  aria-expanded={isOpen}
                  aria-controls={`gotei-panel-${division.n}`}
                  aria-label={labels.gateLabels[i]}
                  tabIndex={focused === i ? 0 : -1}
                  onFocus={() => setFocused(i)}
                  onClick={() => setOpen(isOpen ? null : division.n)}
                >
                  {/* Kapının ARDINDAKİ kare: kanatların ALTINDA duruyor,
                      yani kapı açılınca ortaya çıkıyor. Yuva boşken
                      `CuratedImage` kendi tasarlanmış boşluğunu çiziyor —
                      burada ek bir yedek gerekmiyor. */}
                  <span className={styles.art} aria-hidden="true">
                    {art[i]}
                  </span>

                  {/* Kapı iki panel: hover'da ortadan aralanıyor, tıklamada
                      tamamen açılıyor. */}
                  <span className={styles.leaf} data-side="left" aria-hidden="true" />
                  <span className={styles.leaf} data-side="right" aria-hidden="true" />

                  {/* Reiatsu halkası — box-shadow değil kenarlık: blur yok,
                      kompozisyon katmanı yok (brief'in tercihi). */}
                  <span className={styles.ring} aria-hidden="true" />

                  <span className={styles.number} lang="ja" aria-hidden="true">
                    {division.kanji}
                  </span>
                  <span className={`${world.meta} ${styles.roman}`} lang="en">
                    {DIVISION_WORDS[division.n]}
                  </span>

                  {/* Aralıktan görünen kaptanın adı — brief'te siluet;
                      siluet yuvası henüz boş olduğu için AD yükseliyor.
                      Görsel geldiğinde bu satır onun altına geçecek. */}
                  <span className={styles.peek} aria-hidden="true">
                    {division[era].captain.name}
                  </span>
                </button>

                {/* Küratör kalemi — kapının İÇİNDE değil KARDEŞİ.
                    Küratör modu kapalıyken CSS onu tamamen gizliyor
                    (`CuratorFrame`), ziyaretçinin paketinde hiç yok. */}
                {pens[i]}

                {isOpen ? (
                  <DivisionPanel
                    id={`gotei-panel-${division.n}`}
                    division={division}
                    era={era}
                    locale={locale}
                    labels={labels}
                    onClose={() => {
                      setOpen(null);
                      focusGate(i);
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   BÖLÜK PANELİ
   ══════════════════════════════════════════════════════════════════ */

/**
 * Açık kapının arkasındaki panel.
 *
 * ⚠️ DIALOG DEĞİL. Brief'in kararı: satır içi genişleme. Bir dialog odağı
 * hapseder, arkayı `aria-hidden` yapar ve tarayıcı geri tuşunu anlamsız
 * kılar; burada kullanıcı hâlâ sayfada ve on üç kapı hâlâ orada.
 */
function DivisionPanel({
  id,
  division,
  era,
  locale,
  labels,
  onClose,
}: {
  id: string;
  division: DivisionRecord;
  era: Era;
  locale: string;
  labels: Parameters<typeof Gotei13>[0]["labels"];
  onClose: () => void;
}) {
  const officers = division[era];
  const pickText = (value: { tr: string; en?: string } | null) =>
    value ? (locale === "en" ? (value.en ?? value.tr) : value.tr) : labels.unknown;

  /** Canon'da açıklanmamış alan: "kayıt yok", uydurma yok */
  const orNone = (value: string | null) => value ?? labels.unknown;

  return (
    <div id={id} className={styles.panel}>
      <header className={styles.panelHead}>
        <span className={styles.panelNumber} lang="ja" aria-hidden="true">
          {division.kanji}
        </span>
        <span className={`${world.meta} ${styles.panelRoman}`} lang="en">
          {DIVISION_WORDS[division.n]}
        </span>

        {/* Bölük çiçeği — bu bölümü özel yapan şey. Canon'da her bölüğün
            bir çiçeği ve o çiçeğin bir anlamı var. */}
        <span className={styles.flower}>
          <DivisionFlower shape={division.flower.shape} className={styles.flowerArt} />
          <span className={styles.flowerText}>
            <span className={styles.flowerJa} lang="ja">
              {division.flower.ja}
            </span>
            <span className={styles.flowerMeaning}>
              {pickText(division.flower.meaning)}
            </span>
          </span>
        </span>

        {/* ⚠️ Etiket `aria-label` ile, görsel olarak gizli bir `<span>`
            ile DEĞİL: depoda `sr-only` diye bir yardımcı sınıf yok ve
            olmayan bir sınıfa güvenmek metni ekrana basar (ölçüldü). */}
        <button
          type="button"
          className={styles.close}
          aria-label={labels.close}
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>
      </header>

      {/* Bölüğün KAYDI (P18-c). Adlardan ÖNCE geliyor: panel artık
          önce bölüğün ne olduğunu söylüyor, sonra kimlerden oluştuğunu.
          Kart-hissini kıran şey tam olarak bu cümle — altındaki liste bir
          künye, anlatı yükünü bu paragraf taşıyor. */}
      <p className={styles.panelAbout}>{pickText(division.about)}</p>

      <dl className={styles.rows}>
        <Row label={labels.captain} value={officers.captain.name} strong />
        <Row label={labels.lieutenant} value={orNone(officers.lieutenant)} />
        <Row label={labels.zanpakuto} value={orNone(officers.captain.zanpakuto)} />
        <Row label={labels.bankai} value={orNone(officers.captain.bankai)} />
        <Row label={labels.specialty} value={pickText(division.specialty)} />
        <Row label={labels.flower} value={division.flower.en} />
      </dl>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className={styles.row}>
      <dt className={`${world.meta} ${styles.rowLabel}`}>{label}</dt>
      <dd className={styles.rowValue} data-strong={strong ? "" : undefined}>
        {value}
      </dd>
    </div>
  );
}

/**
 * Kapının altındaki İngilizce satır (Jost caps).
 *
 * ⚠️ ÇEVRİLMİYOR: sayfanın imza sesi İngilizce ve on üç satır boyunca öyle
 * kalıyor. Rakamla yazmak ("DIVISION 8") daha kolaydı ama Jost'un geniş
 * aralıklı kapitali harfle nefes alıyor, rakamla tıkanıyor.
 */
const DIVISION_WORDS: Record<number, string> = {
  1: "DIVISION ONE",
  2: "DIVISION TWO",
  3: "DIVISION THREE",
  4: "DIVISION FOUR",
  5: "DIVISION FIVE",
  6: "DIVISION SIX",
  7: "DIVISION SEVEN",
  8: "DIVISION EIGHT",
  9: "DIVISION NINE",
  10: "DIVISION TEN",
  11: "DIVISION ELEVEN",
  12: "DIVISION TWELVE",
  13: "DIVISION THIRTEEN",
};
