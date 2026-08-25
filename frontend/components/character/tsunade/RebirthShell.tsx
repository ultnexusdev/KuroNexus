"use client";

import { useState } from "react";
import { ChipField, SealMark } from "./TsunadeGlyphs";
import styles from "./TsunadeExperience.module.css";

/**
 * "Sōzō Saisei" kabuğu — sayfanın kökü ve mod düğmesi.
 *
 * Kompozisyon deseni (BRIEF §8): çocuklar SUNUCUDA çizilmiş gelir, bu bileşen
 * onları yalnızca taşır. Tarayıcıya inen JS bir düğme ve bir boolean'dan
 * ibaret; sayfanın gövdesi istemci paketine hiç girmiyor.
 *
 * Modun bütün görsel etkisi CSS'te (`.page[data-rebirth]`): alındaki mühürden
 * çıkan sekiz çizgi çizilir, başlıklar accent'e döner, çuha ve fişler
 * belirginleşir, portrenin rengi geri gelir. JS hiçbir stil hesaplamıyor.
 *
 * ⚠️ Doygunluk `filter` ile YAPILMIYOR. Kökte bir filtre, içindeki
 * `position: fixed` düğmeyi `.page`e göre konumlandırır ve düğme sayfayla
 * birlikte kaydırılırdı (ölçüldü). Onun yerine etkilenen her öğe kendi
 * `[data-rebirth]` kuralını taşıyor — hem doğru çalışıyor hem de geçiş
 * yumuşak, çünkü her biri kendi `transition`ını zaten yazıyor.
 *
 * Kök <main> DEĞİL: kök layout zaten <main id="icerik"> çiziyor.
 */
export function RebirthShell({
  enterLabel,
  exitLabel,
  hint,
  costLabel,
  children,
}: {
  enterLabel: string;
  exitLabel: string;
  hint: string;
  costLabel: string;
  children: React.ReactNode;
}) {
  const [released, setReleased] = useState(false);

  return (
    <div
      className={styles.page}
      data-world="tsunade"
      data-rebirth={released || undefined}
    >
      {/* Masaya dağılmış fişler: sayfanın en alt katmanı, çok düşük
          opaklıkta. Mühür çözülünce bir tık belirginleşiyor. */}
      <span className={styles.chipWash} aria-hidden>
        <ChipField className={styles.chipArt} />
      </span>

      <button
        type="button"
        className={styles.rebirthToggle}
        aria-pressed={released}
        onClick={() => setReleased((value) => !value)}
      >
        <SealMark className={styles.rebirthGlyph} />
        <span className={styles.rebirthLabel}>
          {released ? exitLabel : enterLabel}
        </span>
      </button>

      {/* Modun ne yaptığını söyleyen satır — ekran okuyucu için canlı bölge.
          Düğmenin aria-pressed'i DURUMU, bu satır ANLAMI veriyor. Bedel
          cümlesi bilerek onun altında: teknik bedava değil. */}
      <div className={styles.rebirthNote} role="status">
        {released ? (
          <>
            <span className={styles.rebirthHint}>{hint}</span>
            <span className={styles.rebirthCost}>{costLabel}</span>
          </>
        ) : null}
      </div>

      {children}
    </div>
  );
}
