"use client";

import { useState } from "react";
import { SnowCrystal } from "./RukiaGlyphs";
import { useSnow, type DanceKey } from "./SnowShell";
import styles from "./ShirayukiExperience.module.css";

/**
 * ÜÇ DANS — sayfanın kalbi.
 *
 * ── MEKANİK ──────────────────────────────────────────────────────────────
 * Üç düğme: *Some no mai, Tsukishiro* / *Tsugi no mai, Hakuren* /
 * *San no mai, Shirafune*. Her çağrı sayfaya KALICI bir kar katmanı bırakıyor
 * (kökteki `data-snow` 0→3). Üçü de düştüğünde zemin bembeyaz oluyor ve
 * kontrast TERSİNE dönüyor: koyu zeminde açık metin okuyan ziyaretçi kendini
 * açık zeminde koyu metin okurken buluyor.
 *
 * Fikrin tamamı bu: kar bir şeyi SİLMİYOR, ÜSTÜNÜ ÖRTÜYOR. Sayfadaki hiçbir
 * bölüm kaybolmuyor, hiçbir metin gitmiyor — hepsinin zemini değişiyor.
 *
 * ── NEDEN YAYINDAKİ HİÇBİRİYLE AYNI DEĞİL ────────────────────────────────
 * Sayaçlar (Neji'nin 2→64'ü, Naruto'nun dokuz kademesi, Rock Lee'nin sekiz
 * kapısı) hep TEK YÖNLÜ ve ARTAN bir ray; buradaki üç çağrı sıralı değil ve
 * geri alınabiliyor. Katman ekleyen sayfalar da var (Gaara'nın kum kesiti,
 * Orochimaru'nun soyulan derileri) ama onlarda katman bir GÖRSEL kutunun
 * içinde birikiyor; burada katman SAYFANIN KENDİ ZEMİNİ ve üçüncüsünde
 * okumanın kutbunu çeviriyor. Getō'nun haznesi geri alınamıyordu; buradaki
 * geri alma tam da "katman katman" olduğu için mekaniğin bir parçası.
 *
 * ── ERİŞİLEBİLİRLİK ──────────────────────────────────────────────────────
 * Üç çağrı ve geri alma gerçek `<button>`; sekmeyle geziliyor, Enter/boşluk
 * çalıştırıyor. Durum `role="status"` ile SESLİ de veriliyor — kontrastın
 * tersine dönmesi ekran okuyucuda görünmez bir olay olurdu.
 *
 * ⚠️ Bu ada `ShirayukiExperience.module.css` okuyor; klasörde ikinci bir
 * `.module.css` YOK (sözleşme).
 */

export interface DanceCopy {
  key: DanceKey;
  call: string;
  reading: string;
  name: string;
  summary: string;
  layerNote: string;
  /** Kadraj + yuva — sunucuda çizilip prop olarak iniyor */
  frame: React.ReactNode;
}

export function ThreeDances({
  dances,
  commandLabel,
  commandText,
  commandReading,
  callLabel,
  calledLabel,
  layerCountLabel,
  undoLabel,
  undoHint,
  idleHint,
  invertedHint,
  statusCalled,
  statusLifted,
  statusInverted,
  keyboardHint,
}: {
  dances: DanceCopy[];
  commandLabel: string;
  commandText: string;
  commandReading: string;
  callLabel: string;
  calledLabel: string;
  layerCountLabel: string;
  undoLabel: string;
  undoHint: string;
  idleHint: string;
  invertedHint: string;
  statusCalled: string;
  statusLifted: string;
  statusInverted: string;
  keyboardHint: string;
}) {
  const { fallen, call, lift } = useSnow();
  const count = fallen.length;
  const inverted = count === 3;

  /* Son eylemin YÖNÜ. Yalnız sayıya bakmak yetmiyor: 2 katman "biri düştü"
     ile "biri kalktı" durumlarının ikisinde de görülüyor ve ekran okuyucu
     için o iki olay aynı cümleyle duyurulamaz. */
  const [lastAction, setLastAction] = useState<"call" | "lift" | null>(null);

  /* ⚠️ `disabled` DEĞİL, `aria-disabled` + koruma.
     Gerçek `disabled` düğmeyi sekme sırasından atıyor: üçüncü dansı
     klavyeyle çağıran kişi tıkladığı anda odağını kaybediyordu (üçü de
     bir anda erişilemez oluyor ve odak `body`ye düşüyor). Bu hâlde
     düğmeler odakta kalıyor, durumları `aria-pressed`/`aria-disabled`
     ile duyuruluyor ve ikinci tıklama sessizce yutuluyor. */
  const onCall = (key: DanceKey) => {
    if (fallen.includes(key)) return;
    setLastAction("call");
    call(key);
  };
  const onLift = () => {
    if (count === 0) return;
    setLastAction("lift");
    lift();
  };

  /* Boş dizi → yönerge; üç katman → tersine dönme cümlesi; arası sayılı. */
  const status =
    lastAction === null
      ? idleHint
      : inverted
        ? statusInverted
        : lastAction === "lift"
          ? `${statusLifted} ${count}/3`
          : `${statusCalled} ${count}/3`;

  return (
    <div className={styles.dances}>
      {/* Serbest bırakma komutu — üç dansın hepsinin önkoşulu */}
      <p className={styles.commandLabel}>{commandLabel}</p>
      <p className={styles.commandText} lang="ja">
        {commandText}
      </p>
      <p className={styles.commandReading}>{commandReading}</p>

      <ol className={styles.danceList}>
        {dances.map((dance, index) => {
          const done = fallen.includes(dance.key);
          const order = fallen.indexOf(dance.key);
          return (
            <li
              key={dance.key}
              className={styles.dance}
              data-fallen={done ? "true" : "false"}
            >
              <span className={styles.danceCrystal} aria-hidden>
                <SnowCrystal
                  className={styles.crystalArt}
                  armClassName={styles.crystalArm}
                />
              </span>

              <p className={styles.danceIndex} aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </p>

              <p className={styles.danceCall} lang="ja">
                {dance.call}
              </p>
              <p className={styles.danceReading}>{dance.reading}</p>
              <h3 className={styles.danceName}>{dance.name}</h3>
              <p className={styles.danceText}>{dance.summary}</p>

              <button
                type="button"
                className={styles.danceButton}
                aria-pressed={done}
                aria-disabled={done}
                onClick={() => onCall(dance.key)}
              >
                <span className={styles.danceButtonMark} aria-hidden />
                <span className={styles.danceButtonLabel}>
                  {done ? `${order + 1}. ${calledLabel}` : callLabel}
                </span>
              </button>

              {/* Katman düştüğünde o dansın kendi cümlesi açılıyor */}
              {done ? <p className={styles.danceLayerNote}>{dance.layerNote}</p> : null}

              {dance.frame}
            </li>
          );
        })}
      </ol>

      <div className={styles.danceFoot}>
        <p className={styles.danceCount}>
          <span className={styles.danceCountLabel}>{layerCountLabel}</span>
          <span className={styles.danceCountValue}>{count}/3</span>
        </p>

        <button
          type="button"
          className={styles.liftButton}
          onClick={onLift}
          aria-disabled={count === 0}
        >
          {undoLabel}
        </button>

        <p className={styles.danceHint}>{count === 0 ? keyboardHint : undoHint}</p>
      </div>

      <p className={styles.danceStatus} role="status">
        {status}
      </p>

      {/* Tersine dönme bir sonuç cümlesiyle KAPANIYOR: mekanik ne yaptığını
          kendi söylemezse üç tıklama yalnızca bir renk oyunu olurdu. */}
      {inverted ? <p className={styles.danceInverted}>{invertedHint}</p> : null}
    </div>
  );
}
