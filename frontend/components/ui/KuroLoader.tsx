/**
 * KuroLoader — rota gecisinin gorsel karsiligi.
 *
 * Ortada markanin 黒'si, etrafinda iki ince halka: biri saat yonunde
 * 2.6sn, digeri tersine 4.2sn. Ucuncu halka hic donmuyor -- donen ikisinin
 * uzerinde durdugu ray.
 *
 * ── ⚠️ PATH URETILMEDI, MARKA VARLIGINDAN ALINDI ─────────────────────────
 * Asagidaki `KURO_PATH` `public/brand/icon.svg` ile BIREBIR ayni glif.
 * Sadelestirme, yeniden uretme, `<text>`e cevirme YOK: `<text>` sistem
 * fontuna bagimli olurdu ve 黒 cihazdan cihaza farkli cizilirdi.
 *
 * ── NEDEN SUNUCU BILESENI ────────────────────────────────────────────────
 * Tek satir istemci kodu yok: her sey SVG + CSS. Bu bilincli -- bir
 * yukleme gostergesinin kendisi yuklenmeyi beklerse isini yapmiyor
 * demektir. Ayni gerekceyle GIF/WebP/video/Lottie de yok: hepsi ek ag
 * istegi.
 *
 * ── RENK `currentColor`DAN GELIYOR ───────────────────────────────────────
 * Katmanin rengini `.overlay` kurali seciyor, kanji ve halkalar onu miras
 * aliyor. Deger `globals.css`teki `--loader-mark` token'inda (kural 16) ve
 * TEK: bilesenin ton secen bir prop'u yok, gerekce asagida.
 */
const KURO_PATH = "M144.98 4.00L149.80 4.16L154.46 5.55L157.94 6.93L162.12 8.02L165.90 7.87L170.75 11.41L174.72 13.75L179.67 17.62L181.22 19.33L182.31 21.35L182.93 24.21L181.84 26.08L180.75 27.17L179.81 27.64L176.38 28.12L173.09 28.12L171.53 28.43L170.29 29.06L168.89 30.14L167.49 31.70L166.40 33.25L165.17 35.73L163.46 40.69L162.07 46.87L158.97 70.27L156.96 81.71L155.41 87.13L153.39 91.48L150.56 91.96L148.05 91.80L143.55 90.41L136.36 87.48L131.70 86.71L127.66 86.71L120.42 87.79L119.30 87.79L114.23 88.71L109.27 89.02L109.13 89.18L105.09 89.18L104.88 89.37L105.02 89.56L105.02 94.52L104.87 94.66L104.71 97.79L104.41 98.68L104.29 101.69L113.73 99.54L119.78 98.61L122.89 98.45L123.02 98.30L126.91 98.30L129.09 98.61L131.41 99.23L134.67 100.47L137.45 101.86L143.49 105.58L144.89 106.83L145.68 108.55L145.68 110.29L145.36 111.42L140.99 112.52L138.66 112.83L136.47 112.83L136.34 112.99L127.66 112.99L127.53 112.83L112.36 112.99L108.94 113.45L104.60 114.69L104.25 114.91L104.56 116.45L104.41 122.97L103.79 126.85L104.92 127.21L107.57 127.52L112.69 127.52L131.53 125.35L135.26 125.35L139.43 125.97L142.92 123.36L146.95 121.03L148.36 120.56L150.54 120.25L154.29 120.56L159.70 121.64L165.43 123.35L172.54 126.13L177.34 128.61L180.90 130.93L181.42 131.52L183.22 132.79L184.93 134.50L186.49 136.67L187.26 138.22L187.56 139.71L184.90 140.50L182.56 140.81L180.69 140.81L180.55 140.97L174.50 140.81L166.91 139.57L163.36 138.64L160.47 137.57L159.51 137.57L159.37 137.72L135.39 138.49L135.26 138.65L90.87 139.73L90.73 139.88L80.05 140.35L79.91 140.50L76.34 140.66L76.20 140.81L64.90 141.89L56.07 143.13L43.39 145.45L42.58 146.09L41.96 147.03L41.01 149.44L39.75 150.23L38.40 150.45L40.40 153.99L41.33 156.63L41.95 159.74L41.95 163.47L41.18 167.66L39.94 172.61L38.54 177.10L38.25 177.49L37.31 180.66L36.54 182.45L36.38 183.74L35.76 185.45L34.06 188.85L32.04 191.96L29.10 195.06L27.86 195.99L27.32 196.00L26.92 195.70L25.60 195.37L22.81 193.98L20.17 191.80L18.47 189.48L17.52 187.53L17.22 187.31L15.52 182.81L12.89 173.17L16.24 172.81L18.42 172.03L19.10 171.43L19.67 171.25L21.69 169.23L24.17 165.20L26.79 159.94L30.97 149.52L27.38 147.31L22.51 145.29L21.20 144.53L20.81 144.51L18.34 143.28L15.08 141.26L13.68 139.86L12.74 138.30L12.43 137.36L12.59 136.82L14.00 135.26L16.33 134.02L19.59 133.24L37.07 130.92L49.92 129.99L50.06 129.84L62.14 129.22L62.27 129.06L65.23 129.06L65.36 128.91L76.67 128.60L76.80 128.44L90.73 128.29L90.96 127.76L90.96 120.63L90.80 120.49L90.61 115.31L88.72 115.00L85.15 115.00L77.87 116.39L72.51 117.93L68.80 118.70L66.31 119.01L61.02 118.70L58.39 118.08L55.90 117.15L52.64 115.29L49.66 112.69L49.40 112.66L48.42 111.61L48.16 111.58L46.57 109.91L46.30 109.88L42.58 105.99L42.64 105.72L50.85 105.72L50.99 105.57L59.51 105.26L59.64 105.10L63.37 104.95L63.51 104.79L66.77 104.64L66.91 104.48L76.67 103.71L76.80 103.56L89.82 102.63L90.03 102.42L90.34 100.55L90.18 90.93L88.09 90.88L87.95 91.03L83.29 91.34L68.94 93.51L63.35 93.66L63.22 93.82L58.25 93.66L53.29 92.89L48.48 91.34L45.84 89.78L42.89 86.99L40.71 83.70L41.49 82.62L41.34 77.79L41.97 76.53L42.87 75.69L42.88 74.71L42.72 74.58L41.95 63.58L41.80 63.45L40.87 45.50L39.94 38.37L39.17 34.50L38.84 34.00L34.40 31.04L30.80 27.67L30.54 27.64L27.74 24.69L27.71 24.43L26.82 23.61L24.03 20.05L23.39 18.86L22.94 18.50L22.94 18.14L24.63 15.87L24.79 14.73L24.50 13.61L38.48 13.58L38.62 13.43L43.74 13.28L43.87 13.12L45.90 13.12L46.04 12.97L47.91 12.97L48.05 12.81L49.77 12.81L55.47 12.19L72.18 10.96L79.74 10.03L91.97 9.10L93.81 8.79L95.68 8.79L95.82 8.64L98.00 8.64L98.14 8.48L101.40 8.48L101.54 8.33L127.68 8.48L127.82 8.33L130.46 8.33L134.04 7.71L136.68 6.78L139.84 5.24L142.95 4.31ZM138.35 17.60L134.64 18.07L107.10 17.91L106.97 18.07L105.03 18.10L106.56 20.42L107.49 22.28L108.42 25.07L108.73 26.95L108.73 30.06L108.43 32.84L107.34 39.04L106.74 41.23L111.72 42.95L113.32 43.27L120.29 45.44L125.24 47.76L127.89 49.94L130.07 53.23L130.00 53.62L106.59 56.27L106.11 57.69L105.64 61.57L105.80 72.42L105.06 77.42L110.83 77.12L119.16 75.88L122.43 75.73L124.26 75.42L130.46 75.57L133.11 76.04L134.48 76.50L135.93 74.77L136.71 72.90L136.87 69.92L137.19 68.81L137.98 67.71L139.19 67.02L138.52 66.61L137.38 66.76L136.89 66.59L136.71 66.21L138.41 61.77L140.58 53.57L142.13 44.90L142.74 39.33L142.74 37.00L142.90 36.86L142.90 30.81L142.12 24.77L141.66 22.91L140.73 20.58L139.33 18.40ZM80.07 21.31L74.31 22.09L67.51 23.48L62.15 24.87L60.24 25.03L59.75 25.19L58.66 26.29L57.73 27.84L57.26 29.25L57.10 33.61L57.26 33.75L57.26 35.93L57.41 36.07L57.72 40.42L58.18 42.87L58.34 46.14L58.67 47.43L66.91 45.89L71.41 45.58L71.55 45.43L81.15 44.97L90.63 43.71L90.18 41.03L89.72 33.13L89.26 29.27L88.94 27.24L88.01 24.13L87.08 22.42L86.28 21.48ZM84.40 57.80L72.82 60.11L67.39 60.89L62.43 60.73L59.44 60.13L59.42 67.78L59.57 67.91L59.90 80.03L61.94 80.52L64.74 80.83L69.56 80.83L69.69 80.68L73.57 80.52L84.07 78.98L90.31 78.81L90.34 60.18L90.18 60.05L90.18 58.16L88.72 57.80ZM142.81 139.42L145.92 139.57L148.88 140.20L151.52 141.13L153.68 142.21L162.04 148.09L168.43 153.32L173.85 156.73L176.88 158.14L179.37 160.93L181.69 164.35L183.70 168.36L185.25 172.86L186.49 178.43L187.27 184.63L187.42 188.98L186.77 189.50L185.91 189.67L185.27 190.15L184.95 190.66L185.08 192.12L183.93 192.14L180.21 191.51L178.03 190.89L174.32 189.19L171.52 187.17L167.80 183.30L165.17 179.90L160.68 172.78L156.05 163.50L156.03 163.11L154.65 160.56L154.64 160.17L152.95 156.85L152.17 154.76L149.23 148.73L146.59 144.39L143.81 140.68L143.07 140.01ZM108.18 140.81L110.09 141.44L112.88 142.84L115.51 144.69L118.30 147.48L120.94 151.21L123.72 156.93L125.74 163.90L126.51 168.07L126.98 172.11L127.13 181.25L126.32 187.34L121.91 185.79L119.27 184.39L116.64 182.54L114.78 180.83L112.77 178.20L110.44 173.55L108.89 168.28L108.12 162.54L107.96 143.20L108.12 143.06ZM67.99 142.98L70.36 144.07L73.77 146.39L77.49 150.11L79.20 152.60L80.59 155.38L82.61 161.58L83.69 168.40L83.85 174.44L83.69 174.58L83.69 177.85L83.54 177.98L83.23 183.26L82.45 188.53L81.48 192.75L79.57 192.44L75.69 190.89L72.74 188.87L70.10 186.08L67.16 181.75L65.92 179.27L61.74 169.36L61.76 169.12L63.58 167.69L64.82 165.99L66.22 162.40L67.15 155.43L67.15 153.25L67.46 150.79L67.46 146.60L67.61 146.46L67.77 143.35Z";

import styles from "./KuroLoader.module.css";

/**
 * ⚠️ `tone` PROP'U YOK VE GERI GELMEMELI (30 Agustos 2026).
 *
 * Once vardi (`"gold" | "anime"`) ve yalnizca anime kanadi digerinden
 * farkli yukluyordu. Kullanici karari tek bir yukleme kimligi: ayni jest
 * -- bir baglantiya basmak -- sayfadan sayfaya farkli renkte bir ekran
 * acmasin. Renk artik tek token'da (`--loader-mark`, `globals.css`).
 */
type KuroLoaderProps = {
  /** Kenar uzunlugu (px). Overlay icinde 96-140 arasi iyi durur. */
  size?: number;
  /** Ekran okuyucular icin metin. TR/EN sayfaya gore gec. */
  label?: string;
  /** Tum ekrani kaplayan katman olarak render et. */
  overlay?: boolean;
  /**
   * Katman gorunmeden ONCE beklenecek sure (ms).
   *
   * ⚠️ SAF CSS, JS DEGIL -- ve bu bilincli. `loading.tsx` yedegi hem
   * sunucuda cizilir hem de sert yuklemede ilk HTML'de bulunur; gecikmeyi
   * bir istemci kancasina baglasaydik o yedek HIDRASYONA KADAR hic
   * gorunmezdi, yani en yavas senaryoda ekran bos kalirdi.
   *
   * Gecikmeli bir `animation` ikisini birden veriyor: sayfa 180ms'den once
   * gelirse dugum hic boyanmadan sokuluyor, gec gelirse kendiliginde
   * beliriyor. Tek bayt JS yok.
   *
   * Kuresel katman (`RouteLoader`) bunu 0'a cekiyor: orada zamanlamayi
   * `useDelayedVisible` yapiyor ve iki gecikme ust uste binerse 360ms
   * olurdu.
   */
  enterDelay?: number;
  /**
   * Katman cikisa gecti: 250ms solup gidecek.
   *
   * Dugumu ayakta tutan sey bu prop DEGIL cagiran taraf
   * (`useDelayedVisible`); burasi yalnizca CSS'e hangi animasyonu
   * kosacagini soyluyor.
   */
  leaving?: boolean;
};

export default function KuroLoader({
  size = 120,
  label = "Yükleniyor",
  overlay = false,
  enterDelay = 180,
  leaving = false,
}: KuroLoaderProps) {
  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 280 280"
      /* Katman kipinde isaret DEKOR: erisilebilir ad sarmalayicidaki
         `role="status"` bolgesinde bir kez duyuruluyor. Ikisi birden
         acik kalsaydi ekran okuyucu ayni metni iki kez okurdu. */
      role={overlay ? undefined : "img"}
      aria-label={overlay ? undefined : label}
      aria-hidden={overlay ? true : undefined}
      className={styles.loader}
    >
      <circle className={`${styles.arc} ${styles.rest}`} cx="140" cy="140" r="129" />
      <circle
        className={`${styles.arc} ${styles.outer}`}
        cx="140"
        cy="140"
        r="129"
        strokeDasharray="150 661"
      />
      <circle
        className={`${styles.arc} ${styles.inner}`}
        cx="140"
        cy="140"
        r="118"
        strokeDasharray="46 695"
      />

      <g transform="translate(140 140) scale(0.84) translate(-100 -100)">
        <path className={styles.ink} fillRule="evenodd" d={KURO_PATH} />
      </g>
    </svg>
  );

  if (!overlay) return mark;

  return (
    <div
      role="status"
      aria-live="polite"
      className={styles.overlay}
      data-phase={leaving ? "leaving" : undefined}
      style={{ "--kn-enter-delay": `${enterDelay}ms` } as React.CSSProperties}
    >
      {mark}
      <span className="srOnly">{label}</span>
    </div>
  );
}
