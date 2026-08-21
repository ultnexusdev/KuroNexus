import type { FavouritePlayer } from "@/lib/sport/favourite-players";
import { PlayerImage } from "./PlayerImage";
import styles from "./PlayerStory.module.css";

/**
 * HİKÂYESİ.
 *
 * ── NEDEN KULÜP KARTLARI BURADA YOK ──────────────────────────────────────
 * Tasarım referansı bu bölümde üç kulüp kartı (Inter / PSG / Galatasaray)
 * gösteriyordu ve hemen altında AYNI kulüpleri tekrar sıralayan bir kariyer
 * şeridi vardı. Aynı veri iki kez, iki farklı biçimde: ikisi de zayıflıyor.
 * Kulüp kırılımı (yıllar, maç, gol, fotoğraf) tek yere — `PlayerJourney`
 * şeridine — toplandı; burası anlatının kendisi olarak kaldı.
 *
 * ── DÜZEN ────────────────────────────────────────────────────────────────
 * Solda iki satırlık Anton başlığı ve giriş cümlesi, sağda okuma sütunu.
 * Aralarında dikey bir altın hat: sayfanın sash motifinin sakin karşılığı.
 * Metnin ortasında tam bant bir kare — sütunun ölçüsünü kırıyor ve bölüme
 * nefes veriyor.
 */
export function PlayerStory({
  player,
  labels,
}: {
  player: FavouritePlayer;
  labels: { eyebrow: string };
}) {
  const plate = player.career.find((stop) => stop.current)?.image;

  /**
   * Başlığın en uzun KELİMESİ — puntoyu sütuna sığdırmak için.
   *
   * Hero'daki adla aynı arıza buradaydı: `overflow-wrap: anywhere` dev
   * puntoda özel adı kelime ortasından kırıyordu ("Köstence'de / n").
   * Kural kaldırıldı; sığmama artık kırılmayla değil KÜÇÜLMEYLE çözülüyor.
   * Hesabın gerekçesi `PlayerHero.tsx` başında, pay tablosu sayfanın
   * kökünde (`--advance`).
   */
  const enUzun = Math.max(
    1,
    ...player.storyTitle.flatMap((p) => p.split(/\s+/).map((w) => w.length)),
  );
  const head = player.story.slice(0, 2);
  const tail = player.story.slice(2);

  return (
    <section
      className={styles.story}
      aria-labelledby="oyuncu-hikaye"
      style={{ "--story-len": enUzun } as React.CSSProperties}
    >
      <div className={styles.top}>
        <div className={styles.headSide}>
          <p className={styles.eyebrow}>{labels.eyebrow}</p>
          {/* ⚠️ `aria-label` ZORUNLU: başlık iki blok `span`e bölünmüş ve
              aralarında metin düğümü yok (olsaydı flex sütununda fazladan bir
              satır açardı). Etiketsiz hâlinde ekran okuyucu "Rosario'dan
              İstanbul'a" yerine bitişik okuyor — ölçüldü. */}
          <h2
            id="oyuncu-hikaye"
            className={styles.title}
            aria-label={player.storyTitle.join(" ")}
          >
            <span>{player.storyTitle[0]}</span>
            <span>{player.storyTitle[1]}</span>
          </h2>
        </div>

        <div className={styles.column}>
          <p className={styles.lede}>{player.storyLede}</p>
          {head.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      {plate ? (
        <div className={styles.band}>
          <PlayerImage slot={plate} position="50% 26%" decorative />
          <span className={styles.bandLight} aria-hidden="true" />
        </div>
      ) : null}

      {tail.length > 0 ? (
        <div className={`${styles.column} ${styles.tail}`}>
          {tail.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      ) : null}
    </section>
  );
}
