import type { FavouritePlayer } from "@/lib/sport/favourite-players";
import { PlayerImage } from "./PlayerImage";
import styles from "./PlayerHero.module.css";

/**
 * FUTBOLCU HERO'SU.
 *
 * ── HUB HERO'SUNDAN NEDEN AYRI ───────────────────────────────────────────
 * Önceki sürümde bu sayfa `/spor/futbol` hero'sunun aynı stadyum plakasını
 * kullanıyordu; iki sayfa aynı geceye bakıyordu ve profil sayfası hub'ın
 * devamı gibi duruyordu. Buradaki kompozisyon PAYLAŞILAN hiçbir görsel
 * kullanmıyor — taşıyıcı öğe oyuncunun kendi karesi, arka plan ise formanın
 * geometrisinden çıkarılmış bir işaret.
 *
 * ── GÖRSEL İMZA: SASH ────────────────────────────────────────────────────
 * Galatasaray forması dikey değil ÇAPRAZ bölünür (sarı yarı / kırmızı yarı).
 * Sayfanın imzası o bölünme: kadrajı çapraz kesen bir bant, sarıdan kırmızıya
 * geçiyor ve fotoğrafın arkasından çıkıyor. Bir "dekoratif şerit" değil,
 * kulübün kendi geometrisi — ve `--accent` / `--warm` üzerinden çalıştığı
 * için başka bir kulübün oyuncusu eklendiğinde onun renklerini giyiyor.
 *
 * ── FORMA NUMARASI ───────────────────────────────────────────────────────
 * "9" bir rozet değil, kompozisyonun zemin katmanı: kadrajın sağ altından
 * taşan, yalnızca konturu çizilmiş dev bir rakam. `aria-hidden` — ekran
 * okuyucu için künye şeridinde zaten yazıyor.
 *
 * ── TAŞMA GÜVENLİĞİ ──────────────────────────────────────────────────────
 * Hem sash hem rakam kadrajın dışına taşıyor; `.hero` üzerinde
 * `overflow: hidden` var, yani hiçbiri yatay kaydırma üretmiyor. Mobilde
 * ikisi de yeniden konumlanıyor (aşağıdaki media sorgusu) — küçültülmüş
 * masaüstü değil, kendi düzeni.
 */
export function PlayerHero({
  player,
  labels,
}: {
  player: FavouritePlayer;
  labels: { scroll: string; crumb: string };
}) {
  return (
    <header className={styles.hero}>
      {/* ── Zemin katmanları ── */}
      <div className={styles.field} aria-hidden="true" />
      <div className={styles.sash} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <span className={styles.jersey} aria-hidden="true">
        {player.shirt ?? ""}
      </span>

      {/* ── Üst şerit: arma + kırıntı ── */}
      <div className={styles.top}>
        <span className={styles.crest} aria-hidden="true">
          <PlayerImage
            slot={player.stats.club.crest}
            fit="contain"
            decorative
          />
        </span>
        <span className={styles.crumb}>{labels.crumb}</span>
      </div>

      {/* ── Fotoğraf ── */}
      <div className={styles.portrait}>
        <PlayerImage
          slot={player.hero}
          eager
          position="50% 22%"
          className={styles.portraitImage}
        />
        <span className={styles.portraitFade} aria-hidden="true" />
      </div>

      {/* ── Metin ── */}
      <div className={styles.body}>
        <p className={styles.kicker}>
          <span className={styles.kickerLine} aria-hidden="true" />
          {player.badges.join(" · ")}
        </p>

        <h1 className={styles.name} aria-label={player.name}>
          <span>{player.firstName}</span>
          <em>{player.lastName}</em>
        </h1>

        <p className={styles.role}>
          <span>{player.birthPlace}</span>
          <i aria-hidden="true" />
          <span>{player.height}</span>
          <i aria-hidden="true" />
          <span>{player.club}</span>
        </p>

        <blockquote className={styles.quote}>{player.quote}</blockquote>

        <dl className={styles.vitals}>
          {player.vitals.map((vital) => (
            <div key={vital.label}>
              <dt>{vital.label}</dt>
              <dd>{vital.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <span className={styles.scroll} aria-hidden="true">
        {labels.scroll}
      </span>
    </header>
  );
}
