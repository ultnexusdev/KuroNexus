import { getTranslations } from "next-intl/server";
import { genreColorVar } from "@/lib/music/routes";
import type { GenreShare } from "@/lib/api/music";
import styles from "./GenreMixBar.module.css";

/**
 * Tür karışım çubuğu (tasarım 2a "%44 rock · %26 r&b", 2d "odaların payı").
 *
 * Yüzdeler veritabanında SAKLANMIYOR, backend'de parça → albüm → act → tür
 * zincirinden türetiliyor. Sütuna yazılsaydı bir tür onayı değiştiğinde
 * (`MusicGenre.isApproved`) çubuk sessizce yanlış kalırdı.
 *
 * ── ERİŞİLEBİLİRLİK ───────────────────────────────────────────────────────
 * Renk tek başına bilgi taşımıyor: altındaki metin satırı aynı bilgiyi
 * yazıyla veriyor ("%44 rock · %26 r&b"). Çubuğun kendisi `aria-hidden`,
 * çünkü ekran okuyucuya iki kez okutmanın anlamı yok.
 *
 * Renkler `--genre-*` token'larından geliyor; bileşen hex okumuyor (kural 16).
 * Bilinmeyen bir `accentKey` nötr griye düşüyor — sessiz bozulma yok.
 */
export async function GenreMixBar({
  mix,
  showLegend = true,
}: {
  mix: GenreShare[];
  showLegend?: boolean;
}) {
  const t = await getTranslations("music.playlists");

  if (mix.length === 0) {
    return <p className={styles.unknown}>{t("mixUnknown")}</p>;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.bar} aria-hidden="true">
        {mix.map((share) => (
          <span
            key={share.slug}
            className={styles.segment}
            style={{
              width: `${share.percent}%`,
              background: genreColorVar(share.accentKey),
            }}
          />
        ))}
      </div>
      {showLegend ? (
        <p className={styles.legend}>
          {mix.map((share, index) => (
            <span key={share.slug}>
              {index > 0 ? <span className={styles.sep}> · </span> : null}%
              {share.percent} {share.name.toLocaleLowerCase("tr-TR")}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}
