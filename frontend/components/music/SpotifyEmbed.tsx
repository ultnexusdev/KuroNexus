import { getTranslations } from "next-intl/server";
import { spotifyEmbedSrc, type SpotifyEmbedKind } from "@/lib/music/routes";
import styles from "./SpotifyEmbed.module.css";

/**
 * Gömülü Spotify çalar (tasarım 2a/2b/2c/2d — dört ekranda da var).
 *
 * ── NEDEN GÖMÜ, NEDEN KENDİ ÇALARIMIZ DEĞİL ───────────────────────────────
 * Spotify Kasım 2024'te `preview_url` alanını yeni uygulamalara kapattı, yani
 * 30 saniyelik önizlemeyi kendi çalarımızda çalmak artık mümkün değil. Gömü
 * player Web API'den AYRI bir mekanizma: bu kapanmalardan etkilenmiyor ve
 * OAuth istemiyor.
 *
 * ── CSP ───────────────────────────────────────────────────────────────────
 * ⚠️ `open.spotify.com` `next.config.ts` içindeki `frame-src` listesinde
 * OLMAK ZORUNDA. Eksikliği **sessiz** bir arıza: CSP beyaz liste olduğu için
 * iframe hiç çizilmez, sayfa çökmez, ihlal yalnızca konsola düşer. Liste
 * 11 Ağustos 2026'da genişletildi.
 *
 * `spotifyId` yoksa hiç çizilmiyor: boş bir iframe kutusu, olmayan bir
 * özelliği varmış gibi göstermekten iyidir.
 */
export async function SpotifyEmbed({
  kind,
  spotifyId,
  height,
  note = false,
}: {
  kind: SpotifyEmbedKind;
  spotifyId: string | null | undefined;
  /** Tasarımdan ölçülen yükseklikler: 80 (compact), 152, 352 */
  height: 80 | 152 | 352;
  /** "30 sn önizleme" açıklaması gösterilsin mi */
  note?: boolean;
}) {
  if (!spotifyId) {
    return null;
  }
  const t = await getTranslations("music");

  return (
    <div className={styles.wrap}>
      <iframe
        src={spotifyEmbedSrc(kind, spotifyId)}
        title={t("embedTitle")}
        height={height}
        className={styles.frame}
        /* `loading="lazy"` bilinçli: dört ekranın bazılarında çalar kıvrımın
           altında ve ilk boyamayı bekletmemeli. */
        loading="lazy"
        /* Spotify gömüsünün istediği izinler; fazlası verilmiyor. */
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        /* Referrer sızdırma yok — site genelindeki politikayla aynı hizada */
        referrerPolicy="strict-origin-when-cross-origin"
      />
      {note ? <p className={styles.note}>{t("embedNote")}</p> : null}
    </div>
  );
}
