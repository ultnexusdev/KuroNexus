"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MaskFragment } from "./MaskFragment";
import { AshHand } from "./AshHand";
import styles from "./EspadaCourt.module.css";
import world from "./world.module.css";

/**
 * P08 · ESPADA — CEVAP VEREN ON.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Naruto Evreni'ndeki karşılığı Akatsuki sergisi ve tasarım kararı ona
 * göre TERS kuruldu: orada merkez portre, burada merkez **numara**.
 * Baraggan'ın cümlesi bölümün tamamını taşıyor — her Espada ölümün ayrı
 * bir yüzüne hükmediyor. Kadro bir karakter galerisi değil, bir tipoloji.
 *
 * ── NEDEN DAİRE DEĞİL ────────────────────────────────────────────────────
 * Espada bir eşitler meclisi değil bir hiyerarşi. Onu bir çembere dizmek
 * "hepsi eşit uzaklıkta" derdi. Tahtın çevresinde ASİMETRİK duruyorlar:
 * Bir ve İki tahtın hemen yanında, Dokuz ve On en dışarıda.
 *
 * ── ⚠️ GÖRSEL SIRA CSS'TE, OKUMA SIRASI DOM'DA ───────────────────────────
 * `grid-area` yerleşimi tamamen görsel; DOM'daki sıra **güç sırası**
 * (Primera'dan Diez'e). Klavyeyle gezen biri kadroyu sıralı okuyor,
 * gözle bakan biri tahtın çevresinde dağınık görüyor. Brief'in kabul
 * ölçütü tam olarak bu ayrım.
 *
 * ── ⚠️ RENK BOYAMASI SAF CSS ─────────────────────────────────────────────
 * Hover/odakta bölümün `--world-glow`u o Espada'nın cero rengine dönüyor.
 * Bu JS ile yapılmıyor: on `--cero-N` değeri kökte satır içi duruyor ve
 * `:has()` hangi kartın etkin olduğunu CSS'e söylüyor. Geçiş 400ms —
 * değişken anında dönüyor ama onu OKUYAN özellikler geçişli, yani
 * boyanma yumuşak. Fare çıkınca kendiliğinden geri alınıyor; temizlenmesi
 * gereken bir durum kalmıyor (brief'in kabul ölçütü).
 *
 * ── PANELLER SUNUCUDA ÇİZİLİYOR ──────────────────────────────────────────
 * On kaydın dönüşüm dizisi de DOM'da: JS yalnızca hangisinin görüneceğini
 * seçiyor. Sayfanın kuralı "hiçbir bölüm JS olmadan boş görünmez" ve
 * kadronun tamamı — numara, ad, ölüm yüzü, Resurrección, dövme yeri —
 * ilk boyamada orada.
 */

export interface CourtStage {
  id: string;
  kanji: string | null;
  name: string | null;
  text: string;
}

export interface CourtItem {
  rank: number;
  releasedRank?: number;
  ordinal: string;
  name: string;
  aspectKanji: string;
  aspectRomaji: string;
  aspectLabel: string;
  /** Canon dövme yerini yazmıyorsa `null` — arayüz "kayıt yok" çiziyor */
  tattoo: string | null;
  ceroName: string;
  ceroHex: string;
  ceroAttested: boolean;
  fragment: string;
  fragmentNote: string;
  stages: CourtStage[];
  imageNode?: React.ReactNode;
  /**
   * Küratör kalemi — kartın KARDEŞİ olarak çiziliyor, içinde değil.
   *
   * ⚠️ Kart bir `<button>` ve kalem de bir `<button>`: iç içe konsalardı
   * hem HTML geçersiz olurdu hem de tıklama karta değil kaleme giderdi.
   * Kadraj bu yüzden `noEdit` ile geliyor ve kalem ayrı bir düğüm.
   * Yönetici değilken sunucuda kesiliyor, ziyaretçinin DOM'unda hiç yok.
   */
  penNode?: React.ReactNode;
}

export interface CourtLabels {
  throneName: string;
  throneRole: string;
  courtAria: string;
  aspectOf: string;
  cero: string;
  ceroUnknown: string;
  tattoo: string;
  unknown: string;
  fragmentLabel: string;
  close: string;
  /** Ulquiorra sahnesini açan düğme */
  sceneOpen: string;
  sceneAria: string;
  sceneLine: string;
  sceneClose: string;
}

export function EspadaCourt({
  items,
  labels,
  sceneRank,
}: {
  items: CourtItem[];
  labels: CourtLabels;
  /** Tekil sahneye sahip kaydın numarası — kayıttan geliyor, elle değil */
  sceneRank: number;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const [scene, setScene] = useState(false);

  const triggers = useRef(new Map<number, HTMLButtonElement | null>());
  const panelRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);

  /* On cero rengi kökte: `:has()` kuralları bunları okuyor. */
  const ceroVars = Object.fromEntries(
    items.map((item) => [`--cero-${item.rank}`, item.ceroHex]),
  ) as React.CSSProperties;

  const close = useCallback(() => {
    setOpen((current) => {
      if (current !== null) triggers.current.get(current)?.focus();
      return null;
    });
  }, []);

  const closeScene = useCallback(() => {
    setScene(false);
    /* Odak sahneyi AÇAN düğmeye dönüyor; o düğme panelin içinde ve panel
       hâlâ açık (brief: "focus geri döner"). */
    panelRef.current?.querySelector<HTMLButtonElement>("[data-scene-open]")?.focus();
  }, []);

  /* Escape: önce sahne, sonra panel. İç içe iki katman varsa dıştakini
     kapatmak içtekini görünmez bırakırdı. */
  useEffect(() => {
    if (open === null && !scene) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      if (scene) closeScene();
      else close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, scene, close, closeScene]);

  /* Panel açılınca odak panele: klavyeyle açan biri içeriğin başına düşsün. */
  useEffect(() => {
    if (open === null) return;
    panelRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!scene) return;
    sceneRef.current?.focus();
  }, [scene]);

  return (
    <>
      <div className={styles.courtWrap} style={ceroVars}>
        <ul
          className={styles.court}
          data-open={open ?? undefined}
          aria-label={labels.courtAria}
        >
          {/* ⚠️ Taht listenin İÇİNDE değil: bir Espada değil, onların
              baktığı yer. Izgarada kendi alanı var, listede yok. */}
          {items.map((item) => {
            const isOpen = open === item.rank;
            return (
              <li
                key={item.rank}
                className={styles.slot}
                data-rank={item.rank}
                style={{ gridArea: `s${item.rank}` }}
              >
                <button
                  type="button"
                  ref={(node) => {
                    triggers.current.set(item.rank, node);
                  }}
                  className={styles.card}
                  aria-expanded={isOpen}
                  aria-controls="espada-panel"
                  onClick={() => (isOpen ? close() : setOpen(item.rank))}
                >
                  <span className={styles.numberWrap}>
                    <span className={`${world.numeral} ${styles.number}`}>
                      {item.rank}
                    </span>
                    {item.imageNode && (
                      <span className={styles.portrait}>
                        {item.imageNode}
                      </span>
                    )}
                    {/* Maske parçası numaranın ÜSTÜNE biniyor: kimliğin
                        iki yarısı üst üste — neydin ve nesin. */}
                    <MaskFragment
                      shape={item.fragment}
                      className={styles.fragment}
                    />
                  </span>

                  <span className={`${world.meta} ${styles.cardName}`}>
                    {item.name}
                  </span>

                  {/* ⚠️ Yer AYRILMIŞ durumda duruyor. Hover'da beliren metin
                      düzeni itseydi kadro her fare hareketinde zıplardı;
                      burada CLS = 0. */}
                  <span className={styles.reveal}>
                    <span className={styles.aspect}>
                      <span lang="en">{labels.aspectOf}</span>
                      <span aria-hidden="true"> — </span>
                      {item.aspectLabel}
                    </span>
                    {item.stages.length > 1 && item.stages[1].name ? (
                      <span className={styles.res}>{item.stages[1].name}</span>
                    ) : null}
                  </span>
                </button>

                {/* Küratör kalemi kartın DIŞINDA — gerekçe `CourtItem`
                    tipindeki `penNode` başlığında. */}
                {item.penNode}
              </li>
            );
          })}

          {/* Taht: dolu siyah dikdörtgen, içinde tek kanji. Bölümün tek
              "boyanmayan" öğesi — Aizen cero rengi taşımıyor. */}
          <li className={styles.throne} aria-hidden="true">
            <span className={styles.throneKanji} lang="ja">
              藍
            </span>
          </li>
        </ul>

        {/* Tahtın künyesi ızgaranın DIŞINDA: `aria-hidden` bir kanjinin
            yanına okunabilir bir ad koymanın tek dürüst yolu. */}
        <p className={`${world.meta} ${styles.throneCaption}`}>
          <span lang="ja">藍染惣右介</span>
          <span aria-hidden="true"> · </span>
          {labels.throneName}
          <span className={styles.throneRole}>{labels.throneRole}</span>
        </p>
      </div>

      {/* ── DÖNÜŞÜM DİZİSİ ───────────────────────────────────────────────
          On panel de DOM'da; JS yalnızca hangisinin görüneceğini seçiyor. */}
      <div
        id="espada-panel"
        ref={panelRef}
        className={styles.panel}
        data-shown={open !== null ? "" : undefined}
        tabIndex={-1}
      >
        {items.map((item) => {
          const isOpen = open === item.rank;
          return (
            <article
              key={item.rank}
              className={styles.sheet}
              data-on={isOpen ? "" : undefined}
              style={{ "--cero": item.ceroHex } as React.CSSProperties}
            >
              <header className={styles.sheetHead}>
                <p className={styles.sheetRank}>
                  <span className={`${world.numeral} ${styles.sheetNumber}`}>
                    {item.rank}
                  </span>
                  <span className={`${world.meta} ${styles.sheetOrdinal}`}>
                    {item.ordinal}
                  </span>
                </p>
                <div>
                  <h3 className={styles.sheetName}>{item.name}</h3>
                  <p className={`${world.meta} ${styles.sheetAspect}`}>
                    <span lang="ja">{item.aspectKanji}</span>
                    <span aria-hidden="true"> · </span>
                    {item.aspectRomaji}
                    <span aria-hidden="true"> · </span>
                    {item.aspectLabel}
                  </p>
                </div>
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={close}
                >
                  {labels.close}
                </button>
              </header>

              <dl className={styles.facts}>
                <div className={styles.fact}>
                  <dt className={world.meta}>{labels.cero}</dt>
                  <dd>
                    <span className={styles.swatch} aria-hidden="true" />
                    {item.ceroName}
                    {item.ceroAttested ? null : (
                      <span className={styles.footnote}>
                        {labels.ceroUnknown}
                      </span>
                    )}
                  </dd>
                </div>
                <div className={styles.fact}>
                  <dt className={world.meta}>{labels.tattoo}</dt>
                  <dd>{item.tattoo ?? labels.unknown}</dd>
                </div>
                <div className={styles.fact}>
                  <dt className={world.meta}>{labels.fragmentLabel}</dt>
                  <dd>{item.fragmentNote}</dd>
                </div>
              </dl>

              {/* Yatay duraklar: BASE → RESURRECCIÓN → (SEGUNDA) */}
              <ol className={styles.stops}>
                {item.stages.map((stage, i) => (
                  <li key={stage.id} className={styles.stop}>
                    <p className={styles.stopMark}>
                      <span className={`${world.numeral} ${styles.stopIndex}`}>
                        {i + 1}
                      </span>
                      {stage.kanji ? (
                        <span className={styles.stopKanji} lang="ja">
                          {stage.kanji}
                        </span>
                      ) : (
                        <MaskFragment
                          shape={item.fragment}
                          className={styles.stopFragment}
                        />
                      )}
                    </p>
                    {stage.name ? (
                      <p className={styles.stopName}>{stage.name}</p>
                    ) : null}
                    <p className={`${world.body} ${styles.stopText}`}>
                      {stage.text}
                    </p>
                  </li>
                ))}
              </ol>

              {/* ⚠️ TEKİL SAHNE. Brief: "Başka hiçbir yerde böyle bir sahne
                  YAPMA — tekil olduğu için değerli." Koşul bir isim
                  karşılaştırması değil kayıttan gelen bir numara. */}
              {item.rank === sceneRank ? (
                <button
                  type="button"
                  data-scene-open=""
                  className={styles.sceneButton}
                  onClick={() => setScene(true)}
                >
                  <span lang="ja">「心か」</span>
                  <span className={world.meta}>{labels.sceneOpen}</span>
                </button>
              ) : null}
            </article>
          );
        })}
      </div>

      {/* ── TEKİL SAHNE ──────────────────────────────────────────────────
          Sayfanın tek duygusal doruk noktası: tam ekran, tek renk. */}
      {scene ? (
        <div
          ref={sceneRef}
          className={styles.scene}
          role="dialog"
          aria-modal="true"
          aria-label={labels.sceneAria}
          tabIndex={-1}
          onClick={closeScene}
        >
          <p className={styles.sceneKanji} lang="ja">
            「心か」
          </p>
          <p className={styles.sceneLine}>{labels.sceneLine}</p>
          <AshHand />
          <button
            type="button"
            className={styles.sceneCloseButton}
            onClick={closeScene}
          >
            {labels.sceneClose}
          </button>
        </div>
      ) : null}
    </>
  );
}
