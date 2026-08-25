"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { AngelMark, AngelWing, CreaseField } from "./PaperGlyphs";
import styles from "./KonanExperience.module.css";

/**
 * "Kâğıt Melek" kabuğu — sayfanın kökü ve İKİ durumu.
 *
 * `ShadowShell` emsalinin kardeşi (kompozisyon deseni): çocuklar SUNUCUDA
 * çizilmiş gelir, bu bileşen onları yalnızca taşır. Sayfanın gövdesi
 * tarayıcıya JS olarak inmez; istemciye inen tek şey bu kabuk, katlama
 * masası ve iki sayı.
 *
 * ── NEDEN BURADA CONTEXT VAR ─────────────────────────────────────────────
 * Katlama adımı iki yeri birden ilgilendiriyor: masanın kendisi (sayfanın
 * ortasında, ayrı bir istemci adası) ve SAYFANIN ZEMİNİ — kâğıt açıldıkça
 * kırışıklar artıyor. İkisi kardeş düğüm, aralarında prop yolu yok. Durumu
 * kökte tutup küçük bir context'le paylaşmak, zemini masaya taşımaktan da
 * masayı köke taşımaktan da ucuz.
 *
 * ⚠️ Bu context sunucu çizimini BOZMUYOR: sağlayıcı istemci bileşeni,
 * `children` ise sunucuda çizilmiş elemanlar olarak PROP hâlinde geçiyor.
 * Sağlayıcının altında olmak bir düğümü istemci bileşenine çevirmez —
 * yalnızca `useContext` çağıran (FoldTable) istemcide.
 *
 * Modun bütün görsel etkisi CSS'te (`.page[data-angel]`): kanatlar iki
 * kenardan açılır, zemin bir tık aydınlanır, kat izleri düzelir. JS hiçbir
 * stil hesaplamıyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 */

interface FoldState {
  /** 0 tabanlı katlama adımı */
  fold: number;
  setFold: (next: number) => void;
}

const FoldContext = createContext<FoldState>({ fold: 0, setFold: () => {} });

/** Katlama adımını okuyan/yazan istemci adaları için. */
export function useFold(): FoldState {
  return useContext(FoldContext);
}

export function PaperShell({
  enterLabel,
  exitLabel,
  hint,
  children,
}: {
  enterLabel: string;
  exitLabel: string;
  hint: string;
  children: React.ReactNode;
}) {
  const [angel, setAngel] = useState(false);
  const [fold, setFold] = useState(0);
  const value = useMemo<FoldState>(() => ({ fold, setFold }), [fold]);

  return (
    <FoldContext.Provider value={value}>
      <div
        className={styles.page}
        data-world="konan"
        data-angel={angel || undefined}
        data-fold={fold}
      >
        {/* Zemin: sayfa tek bir kâğıdın üstüne basılmış gibi dursun diye
            kırışıklar görüntü alanına sabit. Katlama masası ilerledikçe
            yeni demetler açılıyor. */}
        <CreaseField
          step={fold}
          className={styles.creases}
          lineClassName={styles.crease}
        />

        {/* Melek modunun kanatları — iki kenardan açılır, aynı SVG aynalı */}
        <span className={styles.wings} aria-hidden>
          <AngelWing
            side="left"
            className={styles.wing}
            featherClassName={styles.feather}
            creaseClassName={styles.featherCrease}
          />
          <AngelWing
            side="right"
            className={styles.wing}
            featherClassName={styles.feather}
            creaseClassName={styles.featherCrease}
          />
        </span>
        <span className={styles.lift} aria-hidden />

        <button
          type="button"
          className={styles.angelToggle}
          aria-pressed={angel}
          onClick={() => setAngel((current) => !current)}
        >
          <AngelMark
            className={styles.angelToggleGlyph}
            creaseClassName={styles.angelToggleCrease}
          />
          <span className={styles.angelToggleLabel}>
            {angel ? exitLabel : enterLabel}
          </span>
        </button>
        {/* Mod açıkken ne olduğunu söyleyen satır: ekran okuyucu için de
            canlı bölge — düğmenin aria-pressed'i durumu, bu satır anlamı
            veriyor */}
        <p className={styles.angelHint} role="status">
          {angel ? hint : ""}
        </p>

        {children}
      </div>
    </FoldContext.Provider>
  );
}
