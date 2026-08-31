"use client";

import { useState } from "react";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CoreDeck, type DeckCore, type DeckUi } from "./CoreDeck";
import styles from "./ThreeCoresExperience.module.css";

/**
 * Panda sayfasının kabuğu ve İKİ durumu.
 *
 * Kompozisyon deseni (FAZ 2 §1): çocuklar SUNUCUDA çizilmiş gelir, bu bileşen
 * onları yalnızca taşır. İstemciye inen tek şey iki durum ve düz dizeler.
 *
 * ── NEDEN DURUM KÖKTE ────────────────────────────────────────────────────
 * Sayfanın TAMAMI üç sütun üzerine kurulu ve seçili çekirdeğin sütunu her
 * bölümde genişliyor. Oran kök öğedeki `data-core` niteliğinden okunuyor
 * (`--pnd-c1/2/3` özel özellikleri), yani seçim durumu kökte olmak zorunda.
 * Bölümlerin kendisi sunucu bileşeni olarak kalıyor: hiçbiri istemciye
 * inmiyor, yalnızca CSS onlara bakıyor.
 *
 * ── İKİ DURUM ────────────────────────────────────────────────────────────
 *   corpse  → "Lanetli ceset" düğmesi. Sayfanın TONUNU çeviriyor: renkler
 *             soluyor, çekirdek göstergesi anatomik çizime dönüyor, alt
 *             metin öne çıkıyor. ⚠️ IZGARAYI AÇIP KAPATMIYOR — üç sütun
 *             varsayılan durumda da, ceset kipinde de yerinde duruyor ve
 *             çekirdek durumu SIFIRLANMIYOR (Dalga 1'de Onizuka'da mod
 *             düğmesi kilitli ızgarayı sıfırlıyordu; burada olmuyor).
 *   spent   → tükenmiş çekirdekler. Tek yönlü: bir daha dolmuyor.
 *
 * `active` durum değil bir OKUMA işareti: hangi sütunun okuması açık.
 * Tükenmiş bir çekirdeğin okuması yeniden açılabiliyor — tüketmeden.
 */
export function CoreShell({
  isAdmin,
  hero,
  middle,
  tail,
  anatomy,
  rings,
  lockedGlyph,
  modeFrame,
  mode,
  deck,
}: {
  isAdmin: boolean;
  /** 1 · hero — mod düğmesinin ÜSTÜNDE duruyor (yedi durağın sırası) */
  hero: React.ReactNode;
  /** 3 · künye şeridi + 4 · lanet laboratuvarı */
  middle: React.ReactNode;
  /** 6 · kader çizelgesi + 7 · kapanış + küratör özeti */
  tail: React.ReactNode;
  /** Anatomik kesit — ceset kipinde görünüyor (sunucuda çizilmiş SVG) */
  anatomy: React.ReactNode;
  /** Üç halka — sıcak kipte görünüyor (sunucuda çizilmiş SVG) */
  rings: React.ReactNode;
  /** Kırık bambu — kilit panelinin işareti */
  lockedGlyph: React.ReactNode;
  /** Ceset kipinin kadrajı + HEMEN ALTINDAKİ küratör yuvası (sunucuda) */
  modeFrame: React.ReactNode;
  mode: {
    title: string;
    native: string;
    enter: string;
    exit: string;
    hintWarm: string;
    hintCorpse: string;
    subtext: string;
    anatomyLabel: string;
  };
  deck: {
    title: string;
    lede: string;
    cores: DeckCore[];
    ui: DeckUi;
    announceIgnite: string;
    announceReopen: string;
    announceLocked: string;
  };
}) {
  const [corpse, setCorpse] = useState(false);
  const [spent, setSpent] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const locked = spent.length === deck.cores.length;

  const pick = (key: string) => {
    const core = deck.cores.find((row) => row.key === key);
    if (!core) return;

    /* Tükenmiş çekirdek: okuma yeniden açılıyor, TÜKETİLMİYOR. */
    if (spent.includes(key)) {
      setActive(key);
      setMessage(deck.announceReopen.replace("{ad}", core.name));
      return;
    }

    const next = [...spent, key];
    setSpent(next);
    setActive(key);

    const kalan = deck.cores.length - next.length;
    const yakildi = deck.announceIgnite
      .replace("{ad}", core.name)
      .replace("{sayi}", String(kalan));
    setMessage(kalan === 0 ? `${yakildi} ${deck.announceLocked}` : yakildi);
  };

  return (
    <div
      className={styles.page}
      data-world="panda"
      data-corpse={corpse ? "true" : "false"}
      data-core={active ?? "none"}
      data-locked={locked ? "true" : "false"}
    >
      {/* Küratör çerçevesi kabuğun İÇİNDE: `.page` kök öğe olarak kalmalı
          (sözleşme) ama mod düğmesi hero ile içerik arasına girdiği için
          çerçeveyi sunucu tarafında sarmak mümkün değil. */}
      <CuratorFrame isAdmin={isAdmin}>
        {hero}

        {/* ══ 2 · MOD DÜĞMESİ — "Lanetli ceset" ═══════════════════════════ */}
        <section className={styles.mode} aria-labelledby="pnd-mode">
          <div className={styles.modeCol}>
            <h2 id="pnd-mode" className={styles.modeTitle}>
              {mode.title}
            </h2>
            <p className={styles.modeNative} lang="ja" aria-hidden>
              {mode.native}
            </p>

            <button
              type="button"
              className={styles.modeButton}
              aria-pressed={corpse}
              onClick={() => setCorpse((value) => !value)}
            >
              <span className={styles.modeMark} aria-hidden />
              <span className={styles.modeLabel}>
                {corpse ? mode.exit : mode.enter}
              </span>
            </button>

            <p className={styles.modeHint} role="status">
              {corpse ? mode.hintCorpse : mode.hintWarm}
            </p>
          </div>

          {/* Çekirdek göstergesi: sıcak kipte üç halka, ceset kipinde
              anatomik kesit. İkisi de dekoratif (`aria-hidden`), bilgi
              yandaki metinde duruyor. */}
          <div className={styles.modeArtCol}>
            <span className={styles.modeArt} data-art="rings" aria-hidden>
              {rings}
            </span>
            <span className={styles.modeArt} data-art="anatomy" aria-hidden>
              {anatomy}
            </span>
            <p className={styles.modeArtCap}>{mode.anatomyLabel}</p>
          </div>

          {/* Alt metin HER İKİ KİPTE DE okunuyor; ceset kipinde öne çıkıyor.
              Gizlenmiyor — vurgusu değişiyor. */}
          <p className={styles.modeSubtext}>{mode.subtext}</p>

          <div className={styles.modeFrame}>{modeFrame}</div>
        </section>

        {middle}

        {/* ══ 5 · ÜÇ ÇEKİRDEK — SAYFANIN KALBİ ════════════════════════════ */}
        <section className={styles.band} aria-labelledby="pnd-cores">
          <div className={styles.bandHead}>
            <h2 id="pnd-cores" className={styles.bandTitle}>
              {deck.title}
            </h2>
            <p className={styles.bandLede}>{deck.lede}</p>
          </div>

          <CoreDeck
            cores={deck.cores}
            ui={deck.ui}
            spent={spent}
            active={active}
            locked={locked}
            message={message}
            lockedGlyph={lockedGlyph}
            onPick={pick}
          />
        </section>

        {tail}
      </CuratorFrame>
    </div>
  );
}
