import styles from "./HorizonExperience.module.css";

/**
 * Armin sayfasının elle çizilmiş SVG malzemesi.
 *
 * Faz 2 §3: sahne/dönem görselleri ÜRETİLMEZ, dışarıdan raster indirilmez.
 * Motif gerekiyorsa elle çizilir. Bu dosyadaki üç şekil de o kuralın
 * karşılığı — hepsi `path` verisi, hiçbiri dış kaynak.
 *
 * ⚠️ Bu dosya İSTEMCİ ADASI DEĞİL: `"use client"` yok, durum tutmuyor.
 * Sunucuda çiziliyor ve istemci adası bütçesini (en fazla 3) harcamıyor.
 * Renkler CSS modülünden geliyor; burada tek bir renk değeri yok.
 */

/* Enlem çentikleri — harita kenarındaki ölçek. Elle yazmak yerine
   üretiliyor; sayı değişirse tek yerde değişsin. */
const TICKS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

/**
 * Hero filigranı: kıyı çizgisi + izohips (eşyükselti eğrileri).
 *
 * Armin'in dünyası bir haritadır — dedesinin kitabındaki dünya da, duvarın
 * dışındaki dünya da. Filigran bir arma ya da kanji değil, tam olarak bu:
 * ölçülmüş, çizilmiş, henüz gidilmemiş bir kıyı.
 */
export function CoastMap() {
  return (
    <svg
      className={styles.mapArt}
      viewBox="0 0 640 420"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* İzohips — üç iç içe kontur, dıştan içe daralıyor */}
      <path
        className={styles.mapContour}
        d="M300 92c48-15 100 2 123 35 22 32 12 77-23 100-40 26-100 25-136-3-33-25-35-73-7-102 12-13 26-23 43-30Z"
      />
      <path
        className={styles.mapContour}
        d="M312 126c33-10 68 2 83 24 15 22 7 52-16 68-26 18-67 17-92-2-22-17-23-49-4-69 8-8 18-15 29-21Z"
      />
      <path
        className={styles.mapContour}
        d="M326 158c18-5 38 1 46 14 9 12 4 28-9 37-15 9-38 9-52-1-12-10-13-28-2-38 4-5 10-9 17-12Z"
      />
      <path
        className={styles.mapPeak}
        d="M340 186c8-2 17 1 21 7 4 6 2 13-4 17-7 5-18 4-24 0-6-5-6-14-1-19 2-2 5-4 8-5Z"
      />

      {/* Kıyı çizgisi — iki katman: asıl çizgi ve altındaki sığ su */}
      <path
        className={styles.mapCoast}
        d="M18 300c46 5 68-23 112-27 44-4 62 27 108 23 46-4 62-40 108-40s68 31 114 27c46-4 64-31 110-27"
      />
      <path
        className={styles.mapShallow}
        d="M18 330c46 5 68-23 112-27 44-4 62 27 108 23 46-4 62-40 108-40s68 31 114 27c46-4 64-31 110-27"
      />
      <path
        className={styles.mapShallow}
        d="M18 358c46 5 68-23 112-27 44-4 62 27 108 23 46-4 62-40 108-40s68 31 114 27c46-4 64-31 110-27"
      />

      {/* Kenar ölçeği */}
      <g className={styles.mapTicks}>
        {TICKS.map((i) => (
          <path key={i} d={`M${28 + i * 54} 34v${i % 3 === 0 ? 18 : 10}`} />
        ))}
      </g>

      {/* Yön işareti — kuzey değil, "dışarı" */}
      <path className={styles.mapBearing} d="M566 60l14 34-14-9-14 9Z" />
    </svg>
  );
}

/**
 * Mod düğmesinin işareti: yükselen üç buhar kıvrımı.
 *
 * `hot` açıkken kıvrımlar yayılıyor (CSS'te), kapalıyken toplu duruyor.
 * Renk tek gösterge değil — düğmenin yanında durum ayrıca YAZIYLA yazılı.
 */
export function SteamMark({ hot }: { hot: boolean }) {
  return (
    <svg
      className={styles.steamArt}
      data-hot={hot ? "true" : "false"}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className={styles.steamGround} d="M6 33h28" />
      <path
        className={styles.steamCurl}
        d="M14 30c-4-5-1-8 1-11 2-3 3-6 0-9"
      />
      <path
        className={styles.steamCurl}
        d="M20 31c-5-7-1-11 2-15 3-4 4-8 0-12"
      />
      <path
        className={styles.steamCurl}
        d="M26 30c-4-5-1-8 1-11 2-3 3-6 0-9"
      />
    </svg>
  );
}

/**
 * Bölüm ayracı: ince bir ufuk çizgisi.
 *
 * `preserveAspectRatio="none"` bilinçli — çizgi kabına göre yatayda geriliyor,
 * dikeyde kalınlığını koruyor. Kutu değil, çizgi.
 */
export function HorizonRule() {
  return (
    <svg
      className={styles.ruleArt}
      viewBox="0 0 360 12"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className={styles.ruleLine}
        d="M0 7c30-4 60 4 90 1s60-6 90-2 60 6 90 3 60-5 90-2"
      />
    </svg>
  );
}
