import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

import { fetchMusicOverview } from "@/lib/api/music";
import { readIsAdmin } from "@/lib/auth/session";
import { getHallLabel } from "@/lib/halls";
import { musicHref, genreColorVar, spotifyOpenUrl } from "@/lib/music/routes";
import { formatDuration } from "@/lib/music/format";
import { shareCard } from "@/lib/seo";
import { CoverArt } from "@/components/music/CoverArt";
import { GenreMixBar } from "@/components/music/GenreMixBar";
import { MusicCuratorSwitch } from "@/components/music/MusicCuratorSwitch";
import shell from "../layout.module.css";
import styles from "./page.module.css";

/**
 * Salon 06 · Müzik — kavşak sayfası (tasarım 2a).
 *
 * ── TASARIMDAN AYRILDIĞIM ÜÇ YER, HEPSİ GEREKÇELİ ─────────────────────────
 *
 * 1. **"SALON 07" → "SALON 06".** Tasarım 07 yazıyordu; o, salon numarası
 *    kararından önce çizilmişti. Karar (11 Ağustos 2026): Müzik Kadim
 *    Dünyalar'ın yerini alıyor (06), Temürkan 07'de kalıyor.
 *
 * 2. **Alt şerit "şu an çalan" değil "en son dinlenen".** Canlı çalma verisi
 *    Faz 5'e ait (Authorization Code + refresh token). Tasarımdaki
 *    eşitleyici animasyonunu gerçek olmayan bir veriyle çizmek ziyaretçiye
 *    yanlış bir şey söylerdi; şerit gerçek son kaydı gösteriyor ve kayıt
 *    yoksa hiç çizilmiyor.
 *
 * 3. **Sayaç üçlüsü "albüm · sanatçı · liste"** — tasarımdaki sırayla aynı ama
 *    değerler gerçek sayımdan geliyor, sabit değil.
 *
 * ── VERİ ──────────────────────────────────────────────────────────────────
 * Tek istek (`/music/overview`). Hata YAKALANMIYOR: `error.tsx`e düşüyor.
 * Gerekçe STATE.md bulgu Ö-8 — `catch` içinde boş dizi döndüren getiriciler
 * yüzünden salon "arşiv boş" yazıyordu ve ziyaretçi gerçek boşlukla arızayı
 * ayırt edemiyordu.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "music" });
  const title = t("name");
  const description = t("lede");
  return {
    title,
    description,
    ...shareCard({ title, description, locale, path: musicHref.root() }),
  };
}



export default async function MusicHallPage() {
  /**
   * Arşiv isteğinden ÖNCE soruluyor, iki iş için birden:
   *  - küratör anahtarını göstermek (yetkinin gerçek kapısı bu değil; bütün
   *    küratör uçları `@Roles('ADMIN')` arkasında ve çerezdeki token her
   *    istekte veritabanından doğrulanıyor — JWT'de rol YOK),
   *  - **arşivi taze okumak.** Küratör bir şey kaydettiğinde beş dakikalık
   *    önbellek yüzünden sayfa eski hâlinde kalıyordu (gerekçesi
   *    `lib/api/music.ts`te). Ziyaretçi için önbellek yerinde duruyor.
   *
   * Çerez yoksa istek hiç yapılmıyor, yani ziyaretçiye bekleme çıkmıyor.
   */
  const isAdmin = await readIsAdmin();
  const [overview, hall, t] = await Promise.all([
    fetchMusicOverview(isAdmin),
    getHallLabel("muzik"),
    getTranslations("music"),
  ]);

  const paths = [
    {
      key: "rooms",
      title: t("paths.roomsTitle"),
      lede: t("paths.roomsLede"),
      href: musicHref.rooms(),
      accent: "var(--genre-rock)",
    },
    {
      key: "acts",
      title: t("paths.actsTitle"),
      lede: t("paths.actsLede"),
      /**
       * ⚠️ Burada `overview.acts[0]` YAZILIYDI, yani kart **her zaman aynı
       * sanatçıyı** açıyordu. Arşivde tek sanatçı varken fark edilmedi;
       * ikincisi eklenince yeni sanatçıya ulaşmanın tek yolu tür odası
       * olurdu (kullanıcı bildirimi, 12 Ağustos 2026). Artık dizine gidiyor.
       */
      href: musicHref.acts(),
      accent: "var(--accent)",
    },
    {
      key: "playlists",
      title: t("paths.playlistsTitle"),
      lede: t("paths.playlistsLede"),
      href: musicHref.playlists(),
      accent: "var(--genre-pop)",
    },
    {
      key: "listening",
      title: t("paths.listeningTitle"),
      lede: t("paths.listeningLede"),
      href: musicHref.listening(),
      accent: "var(--gold)",
    },
  ];

  return (
    <div className={styles.page}>
      {/* ── Kıvrım: künye + sayaçlar ───────────────────────────────────── */}
      <header className={styles.hero}>
        <div className={styles.heroMain}>
          <Link href="/" className={styles.back}>
            ← {t("backToNexus")}
          </Link>
          <span className={styles.eyebrow}>
            {hall ? `${t("hall")} ${hall} · ` : ""}
            {t("name").toLocaleUpperCase("tr-TR")}
          </span>
          <h1 className={`${shell.carved} ${styles.title}`}>
            {t("name").toLocaleUpperCase("tr-TR")}
          </h1>
          <p className={`${shell.prose} ${styles.lede}`}>{t("lede")}</p>
        </div>

        <aside className={styles.heroSide}>
          <span className={shell.label}>
            {t("lastSync")}
            {overview.lastSyncedAt
              ? ` · ${new Date(overview.lastSyncedAt).toLocaleDateString("tr-TR")}`
              : ` · ${t("neverSynced")}`}
          </span>
          <div className={styles.stats}>
            <div className={`${shell.panel} ${styles.stat}`}>
              <span className={styles.statValue}>{overview.counts.albums}</span>
              <span className={shell.label}>{t("counts.albums")}</span>
            </div>
            <div className={`${shell.panel} ${styles.stat}`}>
              <span className={styles.statValue}>{overview.counts.acts}</span>
              <span className={shell.label}>{t("counts.acts")}</span>
            </div>
            <div className={`${shell.panel} ${styles.stat}`}>
              <span className={styles.statValue}>
                {overview.counts.playlists}
              </span>
              <span className={shell.label}>{t("counts.playlists")}</span>
            </div>
          </div>
        </aside>
      </header>

      {/* Küratör anahtarı kıvrımın hemen altında: mod açılınca panel buraya
          iniyor ve salonun kalanı yerinde kalıyor. Ziyaretçiye render
          EDİLMİYOR — dolayısıyla panelin JavaScript'i de hiç istenmiyor */}
      {isAdmin ? <MusicCuratorSwitch scope="hall" /> : null}

      {/* ── Favori listeler ────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={shell.label}>{t("playlists.title")}</h2>
          {overview.rooms.length > 0 ? (
            <ul className={styles.legend}>
              {overview.rooms.map((room) => (
                <li key={room.slug} className={styles.legendItem}>
                  <span
                    className={styles.swatch}
                    style={{ background: genreColorVar(room.accentKey) }}
                    aria-hidden="true"
                  />
                  {room.name.toLocaleLowerCase("tr-TR")}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {overview.playlists.length === 0 ? (
          <p className={styles.empty}>{t("playlists.empty")}</p>
        ) : (
          <ul className={styles.playlistGrid}>
            {overview.playlists.map((playlist) => {
              const duration = formatDuration(playlist.durationMs, t);
              return (
                /* ⚠️ Kart 13 Ağustos'a kadar BAĞLANTISIZDI: tıklanınca hiçbir
                   şey olmuyordu (kullanıcı bildirimi — "SPOR listesi var ama
                   ona tıklanmıyor"). Liste sayfası ve `musicHref.playlist`
                   zaten vardı, yalnızca kart onlara bağlanmamıştı. */
                <li key={playlist.id}>
                  <Link
                    href={musicHref.playlist(playlist.slug)}
                    className={`${shell.panel} ${styles.playlistCard}`}
                  >
                  <CoverArt src={playlist.artwork} alt={playlist.name} size={56} />
                  <div className={styles.playlistBody}>
                    <div className={styles.playlistTop}>
                      <span className={styles.playlistName}>
                        {playlist.name}
                      </span>
                      <span className={shell.label}>
                        {t("playlists.trackCount", {
                          count: playlist.trackCount,
                        })}
                        {duration ? ` · ${duration}` : ""}
                      </span>
                    </div>
                    <GenreMixBar mix={playlist.genreMix} />
                  </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Favori sanatçılar: tipografik liste ────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={shell.label}>{t("acts.title")}</h2>
          <span className={styles.hint}>
            {t("acts.hint")} →
            {overview.acts[0]?.measured === false ? (
              /* Ölçüm gerçek değilse etiket bunu söylüyor: dinleme kaydı
                 aktarılmadan "en çok dinlediklerim" demek yanlış olurdu */
              <span className={styles.badge}>{t("acts.unmeasured")}</span>
            ) : (
              <span className={styles.badge}>{t("acts.measured")}</span>
            )}
          </span>
        </div>

        {overview.acts.length === 0 ? (
          <p className={styles.empty}>{t("acts.empty")}</p>
        ) : (
          <ul className={styles.actList}>
            {overview.acts.map((act) => {
              const row = (
                <>
                  <span className={styles.actName}>{act.name}</span>
                  <span className={styles.actGenre}>{act.genreName ?? ""}</span>
                  <span className={shell.label}>
                    {act.measured
                      ? t("acts.plays", { count: act.playCount })
                      : ""}
                  </span>
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </>
              );
              return (
                <li key={act.name} className={styles.actRow}>
                  {act.slug ? (
                    <Link href={musicHref.act(act.slug)} className={styles.actLink}>
                      {row}
                    </Link>
                  ) : (
                    /* Arşivde act kaydı yok: satır görünür ama bağlantısız.
                       Dinleme kaydında adı geçen her sanatçıyı arşive
                       eklemek zorunda değiliz. */
                    <div className={styles.actLink}>{row}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Üç yol ─────────────────────────────────────────────────────── */}
      <section className={styles.paths}>
        {paths.map((path, index) => (
          <Link
            key={path.key}
            href={path.href}
            className={`${shell.panel} ${styles.pathCard}`}
            style={{ borderLeftColor: path.accent }}
          >
            <span className={shell.label}>
              {t("paths.step", { index: String(index + 1).padStart(2, "0") })}
            </span>
            <span className={styles.pathTitle}>{path.title}</span>
            <span className={`${shell.prose} ${styles.pathLede}`}>
              {path.lede}
            </span>
          </Link>
        ))}
      </section>

      {/* ── Alt şerit: en son dinlenen (tasarımdaki "şu an çalan"ın
             dürüst karşılığı — bkz. dosya başındaki not) ──────────────── */}
      {overview.lastPlay ? (
        <footer className={`${shell.panel} ${styles.nowBar}`}>
          <CoverArt
            src={overview.lastPlay.track?.album.artwork}
            alt=""
            size={44}
          />
          <div className={styles.nowText}>
            <span className={styles.nowTitle}>
              {overview.lastPlay.trackName}
            </span>
            <span className={styles.nowMeta}>
              {[
                overview.lastPlay.artistName,
                overview.lastPlay.albumName,
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </div>
          <span className={shell.mono}>
            {new Date(overview.lastPlay.playedAt).toLocaleString("tr-TR", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </span>
          {overview.lastPlay.track?.spotifyId ? (
            <a
              className={styles.spotifyLink}
              href={spotifyOpenUrl("track", overview.lastPlay.track.spotifyId)}
              target="_blank"
              rel="noreferrer noopener"
            >
              {t("openInSpotify")}
            </a>
          ) : null}
        </footer>
      ) : null}
    </div>
  );
}
