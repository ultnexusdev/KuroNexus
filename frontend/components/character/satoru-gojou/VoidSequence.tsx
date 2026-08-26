"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./GojoExperience.module.css";

/**
 * SATORU GOJŌ · VOID SEQUENCE — sayfanın ikinci imza bileşeni.
 *
 * 領域展開 無量空処. Tam ekran sinematik sekans; ASLA kendiliğinden
 * açılmıyor, tekrar tekrar oynatılabiliyor.
 *
 * ══ NEDEN NATIVE `<dialog>` ═══════════════════════════════════════════
 * BRIEF üç şey istiyor: `body` scroll kilidi, odak tuzağı ve kapanışta
 * odağın tetikleyen düğmeye dönmesi. `showModal()` bunların üçünü de
 * TARAYICIYA yaptırıyor:
 *   · arkadaki sayfa etkisiz (inert) — odak dışarı kaçamıyor
 *   · `Esc` yerleşik olarak kapatıyor
 *   · kapanışta odak `showModal` öncesindeki öğeye dönüyor
 *
 * ⚠️ `body`ye `overflow: hidden` YAZILMIYOR — bilinçli. O yöntem geri
 * alınması gereken bir DURUM bırakıyor ve bir hata anında kullanıcı
 * gerçekten kilitli kalabiliyor. Sayfanın hiçbir yerinde bu desen yok;
 * `npm run check:gojo` bunu denetliyor. Diyalog tam ekran ve opak
 * olduğu için arkada bir kayma olsa bile görünmüyor: görsel sonuç aynı,
 * risk sıfır. Brief'in amacı (dikkat dağılmasın) karşılanıyor, aracı
 * daha güvenli bir tanesiyle değiştirildi.
 *
 * ══ FAZLAR (toplam ~4.6sn) ════════════════════════════════════════════
 *   dark    0 →  520   ekran karartma
 *   kanji   520 → 1500  領域展開
 *   open   1500 → 3100  kozmik boşluğa açılım, bilgi akıyor
 *   freeze 3100 → 4200  FRAME FREEZE — her şey donuyor
 *   close  4200 → 4600  yavaşça normale dönüş
 *
 * ══ FLAŞ LİMİTİ ═══════════════════════════════════════════════════════
 * Gemini'nin "kör edici anlık beyaz patlamalar" yönü UYGULANMADI.
 * Parlaklık yalnızca faz sınırlarında değişiyor, her geçiş 420ms rampalı
 * (brief'in asgarisi 300ms) ve iki geçiş arası en az 980ms — yani
 * saniyede birden fazla parlaklık sıçraması matematiksel olarak imkânsız.
 * En açık kare #f2f2f2; saf beyaz hiç kullanılmıyor.
 *
 * ══ REDUCED-MOTION ════════════════════════════════════════════════════
 * Sekans HİÇ açılmıyor: tetikleyici düğme de, `D` kısayolu da o modda
 * hiç bağlanmıyor. Kayıp yok — sekansın taşıdığı her şey (alan adı,
 * gövde metni, akan bilgi parçalarının tamamı, göz kadrajı) bölümün
 * statik panosunda zaten duruyor.
 */

type Phase = "dark" | "kanji" | "open" | "freeze" | "close";

/** Faz sınırları (ms). Aralar ≥980ms: flaş limitinin garantisi. */
const TIMELINE: Array<{ phase: Phase; at: number }> = [
  { phase: "kanji", at: 520 },
  { phase: "open", at: 1500 },
  { phase: "freeze", at: 3100 },
  { phase: "close", at: 4200 },
];

/** Sekansın toplam süresi — sonunda diyalog kapanıyor. */
const TOTAL_MS = 4600;

/** Akan parçaların konumu ve hızı — deterministik, rastgele değil. */
function fragmentStyle(index: number): React.CSSProperties {
  /* Altın açı ile dağıtım: parçalar kümelenmeden, ama her yüklemede
     AYNI yerde. Rastgelelik sunucu/istemci uyuşmazlığı üretirdi. */
  const angle = index * 137.508;
  const radius = 12 + ((index * 37) % 34);
  const x = 50 + Math.cos((angle * Math.PI) / 180) * radius;
  const y = 50 + Math.sin((angle * Math.PI) / 180) * radius;
  return {
    "--fx": x.toFixed(2),
    "--fy": y.toFixed(2),
    "--fs": (0.85 + ((index * 13) % 9) / 10).toFixed(2),
    "--fd": 2600 + ((index * 311) % 2200),
    animationDelay: `${(index * 137) % 1600}ms`,
  } as React.CSSProperties;
}

export function VoidSequence({
  open,
  onClose,
  kanji,
  kanjiGloss,
  freezeLine,
  skipLabel,
  escapeLabel,
  fragments,
}: {
  open: boolean;
  onClose: () => void;
  kanji: string;
  kanjiGloss: string;
  freezeLine: string;
  skipLabel: string;
  escapeLabel: string;
  fragments: ReadonlyArray<{ text: string; lang: string | null }>;
}) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const [phase, setPhase] = useState<Phase>("dark");
  const timers = useRef<number[]>([]);

  /**
   * Sekans açılmadan önceki odak.
   *
   * ⚠️ NEDEN ELLE SAKLANIYOR. `<dialog>` kapanışta odağı kendi geri
   * veriyor — ama YALNIZCA öğe DOM'da kaldığında. Burada sekans
   * kapanınca bileşen tamamen sökülüyor (tetikleyici `open` false
   * olunca çiziminden vazgeçiyor), yani tarayıcının geri vereceği bir
   * bağlam kalmıyor. Ölçüldü: odak `<body>`ye düşüyordu ve klavye
   * kullanıcısı sayfanın başına dönmek zorunda kalıyordu.
   * BRIEF şartı: "kapanınca focus tetikleyen butona döner."
   */
  const returnFocus = useRef<HTMLElement | null>(null);

  /** Kapanış mandalı — `close()` kendi olayıyla geri çağırıyor. */
  const closing = useRef(false);

  const clearTimers = useCallback(() => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }, []);

  /* ⚠️ Effect'ten ÖNCE tanımlı: sekans doğal olarak bittiğinde de aynı
     kapanış yolundan geçmeli, yoksa odak yalnızca Skip/Esc ile geri
     dönerdi. */
  const handleClose = useCallback(() => {
    /* `close()` kendi `close` olayını tetikliyor ve o da buraya geri
       geliyor; mandal olmazsa sonsuz döngü olurdu. */
    if (closing.current) return;
    closing.current = true;
    try {
      clearTimers();

      /* ⚠️ SIRA KRİTİK: ÖNCE DİYALOG KAPANIR, SONRA ODAK VERİLİR.
         İlk sürüm tersini yapıyordu ve odak SESSİZCE kayboluyordu:
         modal bir `<dialog>` açıkken dışarıdaki bir öğeyi
         odaklayamıyorsun — arka plan inert. `focus()` hata vermiyor,
         sadece hiçbir şey yapmıyor. Ölçüldü: odak `<body>`de kalıyordu.
         Kapattıktan sonra inert kalkıyor ve odak gerçekten dönüyor. */
      const node = ref.current;
      if (node?.open) node.close();

      const target = returnFocus.current;
      returnFocus.current = null;
      onClose();

      /* `isConnected` kontrolü şart: tetikleyici bu arada sökülmüş
         olabilir ve kopmuş bir düğümü odaklamak `<body>`ye düşerdi. */
      if (target?.isConnected) target.focus();
    } finally {
      closing.current = false;
    }
  }, [clearTimers, onClose]);

  /* Açılış/kapanış — diyalogun kendi API'si üzerinden. */
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!open) {
      clearTimers();
      if (node.open) node.close();
      return;
    }

    setPhase("dark");
    /* `showModal` odak tuzağını, inert arka planı ve `Esc`i tarayıcıya
       devrediyor. Desteklenmiyorsa sekans hiç açılmıyor — sessizce
       vazgeçmek, yarım bir modal göstermekten iyi. */
    if (typeof node.showModal !== "function") {
      onClose();
      return;
    }
    /* Açmadan ÖNCE nereden gelindiğini sakla. */
    const previous = document.activeElement;
    returnFocus.current =
      previous instanceof HTMLElement ? previous : null;
    if (!node.open) node.showModal();

    for (const step of TIMELINE) {
      timers.current.push(
        window.setTimeout(() => setPhase(step.phase), step.at),
      );
    }
    timers.current.push(window.setTimeout(handleClose, TOTAL_MS));

    return clearTimers;
  }, [open, onClose, handleClose, clearTimers]);

  return (
    <dialog
      ref={ref}
      className={styles.sequence}
      data-phase={phase}
      aria-label={kanjiGloss}
      onClose={handleClose}
      onCancel={handleClose}
    >
      <div className={styles.sequenceStage}>
        <span className={styles.sequenceNebula} aria-hidden="true" />

        {/* Akan bilgi — görsel katman. Aynı parçaların okunabilir
            listesi bölümün statik panosunda duruyor. */}
        <ul className={styles.sequenceFlow} aria-hidden="true">
          {fragments.map((fragment, index) => (
            <li
              key={fragment.text}
              className={styles.sequenceFragment}
              lang={fragment.lang ?? undefined}
              style={fragmentStyle(index)}
            >
              {fragment.text}
            </li>
          ))}
        </ul>

        <p className={styles.sequenceKanji} lang="ja">
          {kanji}
        </p>

        <p className={styles.sequenceFreeze}>{freezeLine}</p>

        {/* ⚠️ HER ZAMAN GÖRÜNÜR. Fazdan bağımsız, hiçbir koşulda
            gizlenmiyor (brief şartı). */}
        <div className={styles.sequenceExit}>
          <button
            type="button"
            className={styles.sequenceSkip}
            onClick={handleClose}
          >
            {skipLabel}
          </button>
          <span className={styles.sequenceEscape}>{escapeLabel}</span>
        </div>
      </div>
    </dialog>
  );
}
