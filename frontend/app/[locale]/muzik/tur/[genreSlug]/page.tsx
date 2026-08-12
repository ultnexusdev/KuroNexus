import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { fetchGenreRoom, type GenreRoom } from "@/lib/api/music";
import { readIsAdmin } from "@/lib/auth/session";
import { musicHref } from "@/lib/music/routes";
import { upperProperName } from "@/lib/text";
import { CoverArt } from "@/components/music/CoverArt";
import shell from "../../layout.module.css";
import styles from "./page.module.css";

/**
 * Salon 06 · Müzik — tür odası (tasarım 2b).
 *
 * ── ODA DERİSİ ────────────────────────────────────────────────────────────
 * `data-genre` bu sayfanın kökünde açılıyor, kanat kabuğunda DEĞİL: yalnızca
 * burada geçerli. `globals.css`teki `[data-category="muzik"][data-genre="…"]`
 * bloğu accent ailesini ve zemin sıcaklığını devralıyor; token setinin geri
 * kalanı müzik derisinden geliyor.
 *
 * Değer veritabanındaki `accentKey` — bir **token anahtarı**, renk değeri
 * değil (kural 16). Bilinmeyen anahtar hiçbir kuralla eşleşmez ve oda salonun
 * kendi teal accent'iyle çizilir: sessiz bozulma değil, kabul edilebilir
 * varsayılan.
 *
 * ── SIRALAMA ──────────────────────────────────────────────────────────────
 * Tasarım üç seçenek gösteriyor: dinlemeye göre / yıla göre / alfabetik.
 * Faz 1'de yalnızca **yıla göre** gerçek: "dinlemeye göre" dinleme kaydı
 * aktarıldıktan sonra anlam kazanıyor. Çalışmayan bir düğmeyi seçilebilir
 * göstermek yerine sıralama şeridi şimdilik yalnızca aktif ölçüyü yazıyor.
 */

export const dynamic = "force-dynamic";

async function getRoom(slug: string, fresh?: boolean): Promise<GenreRoom> {
  try {
    return await fetchGenreRoom(slug, fresh);
  } catch (error) {
    // Onay bekleyen ya da var olmayan tür: backend de 404 diyor
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; genreSlug: string }>;
}): Promise<Metadata> {
  const { locale, genreSlug } = await params;
  const t = await getTranslations({ locale, namespace: "music" });
  try {
    const room = await fetchGenreRoom(genreSlug);
    return {
      title: `${room.genre.name} · ${t("name")}`,
      description: t("paths.roomsLede"),
    };
  } catch {
    // Künye alınamazsa sayfa yine açılır; başlık salonun adına düşer
    return { title: t("name") };
  }
}

/* `releaseYear` buradan kalktı: albüm ızgarası kaldırıldığı için tek çağıranı
   kalmamıştı. Aynı yardımcının çalışan kopyası albüm sayfasında duruyor. */

export default async function GenreRoomPage({
  params,
}: {
  params: Promise<{ genreSlug: string }>;
}) {
  const { genreSlug } = await params;
  /* Küratör odayı taze okuyor: yeni atanan sanatçı beş dakika görünmezdi
     (gerekçe `lib/api/music.ts`). Ziyaretçi önbellekten alıyor */
  const isAdmin = await readIsAdmin();
  const [room, t] = await Promise.all([
    getRoom(genreSlug, isAdmin),
    getTranslations("music"),
  ]);

  const measured = room.acts.some((act) => act.playCount > 0);

  return (
    <div className={styles.page} data-genre={room.genre.accentKey ?? undefined}>
      <header className={styles.hero}>
        <div className={styles.heroMain}>
          <Link href={musicHref.root()} className={styles.back}>
            ← {t("name")}
          </Link>
          <span className={styles.eyebrow}>
            {t("room.label").toLocaleUpperCase("tr-TR")} ·{" "}
            {upperProperName(room.genre.name)}
          </span>
          <h1 className={`${shell.carved} ${styles.title}`}>
            {upperProperName(room.genre.name)}
          </h1>
          <ul className={styles.counts}>
            <li className={shell.label}>
              {t("counts.albums")} · {room.counts.albums}
            </li>
            <li className={shell.label}>
              {t("counts.tracks")} · {room.counts.tracks}
            </li>
            <li className={shell.label}>
              {t("counts.acts")} · {room.counts.acts}
            </li>
          </ul>
          {room.genre.subgenres.length > 0 ? (
            <div className={styles.subgenres}>
              <span className={shell.label}>{t("room.subgenres")}</span>
              <ul className={styles.chipList}>
                {room.genre.subgenres.map((sub) => (
                  <li key={sub.slug}>
                    <Link href={musicHref.room(sub.slug)} className={styles.chip}>
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </header>

      {/* ── Odanın sanatçıları ─────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={shell.label}>{t("room.favoriteActs")}</h2>
          <span className={styles.badge}>
            {measured ? t("acts.measured") : t("acts.unmeasured")}
          </span>
        </div>
        {room.acts.length === 0 ? (
          <p className={styles.empty}>{t("room.empty")}</p>
        ) : (
          <ul className={styles.actGrid}>
            {room.acts.map((act) => (
              <li key={act.slug} className={`${shell.panel} ${styles.actCard}`}>
                <Link href={musicHref.act(act.slug)} className={styles.actLink}>
                  <CoverArt
                    src={act.image}
                    alt={act.name}
                    size={52}
                    rounded="full"
                  />
                  <span className={styles.actBody}>
                    <span className={styles.actName}>{act.name}</span>
                    <span className={styles.actMeta}>
                      {act.genres
                        .map((genre) => genre.name)
                        .slice(0, 2)
                        .join(" · ")}
                    </span>
                    <span className={shell.label}>
                      {act.playCount > 0
                        ? t("acts.plays", { count: act.playCount })
                        : t("counts.albums") + " · " + act.albumCount}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Odanın çalma listeleri ──────────────────────────────────────────
             ⚠️ Burada eskiden ALBÜM ızgarası vardı ve kaldırıldı (kullanıcı
             isteği, 13 Ağustos 2026: *"tür odalarında sanatçılar ve çalma
             listeleri bulunsun, albümler bulunmasın"*). Gerekçesi de anlaşılır:
             albümler zaten sanatçı sayfasında diskografi olarak duruyor ve
             odada ikinci kez listelenmeleri aynı kapakları iki yerde
             gösteriyordu. Oda artık "kimler ve hangi listeler" sorusunu
             yanıtlıyor.

             Listenin hangi odada görüneceğine KÜRATÖR karar veriyor
             (`MusicPlaylist.genreId`); içerikten türetilmiyor. */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={shell.label}>{t("paths.playlistsTitle")}</h2>
        </div>
        {room.playlists.length === 0 ? (
          <p className={styles.empty}>{t("room.noPlaylists")}</p>
        ) : (
          <ul className={styles.playlistGrid}>
            {room.playlists.map((playlist) => (
              <li key={playlist.id}>
                <Link
                  href={musicHref.playlist(playlist.slug)}
                  className={`${shell.panel} ${styles.playlistCard}`}
                >
                  <CoverArt src={playlist.artwork} alt={playlist.name} size={56} />
                  <span className={styles.playlistBody}>
                    <span className={styles.playlistName}>{playlist.name}</span>
                    <span className={shell.label}>
                      {t("playlists.trackCount", { count: playlist.trackCount })}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Bu odadan son dinlenenler ──────────────────────────────────── */}
      {room.recentPlays.length > 0 ? (
        <section className={styles.section}>
          <h2 className={shell.label}>{t("room.recent")}</h2>
          <ul className={styles.recentList}>
            {room.recentPlays.map((play, index) => (
              <li key={`${play.playedAt}-${index}`} className={styles.recentRow}>
                <CoverArt
                  src={play.track?.album.artwork}
                  alt=""
                  size={40}
                />
                <span className={styles.recentTitle}>{play.trackName}</span>
                <span className={styles.recentMeta}>{play.artistName ?? ""}</span>
                <span className={styles.recentAlbum}>{play.albumName ?? ""}</span>
                <span className={shell.mono}>
                  {new Date(play.playedAt).toLocaleDateString("tr-TR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
