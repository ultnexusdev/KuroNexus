import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import {
  fetchMusicListening,
  type ListeningRange,
  type MusicListening,
} from "@/lib/api/music";
import { genreColorVar, musicHref } from "@/lib/music/routes";
import { CoverArt } from "@/components/music/CoverArt";
import { GenreMixBar } from "@/components/music/GenreMixBar";
import shell from "../layout.module.css";
import styles from "./page.module.css";

/**
 * Salon 06 · Müzik — dinleme kaydı (tasarım 2d).
 *
 * ── BU EKRANIN VERİSİ NEREDEN GELİYOR ─────────────────────────────────────
 * Spotify Web API'sinde çalma sayısı ucu YOK. Bu sayfadaki her sayı, Spotify
 * hesap ayarlarından istenen **"Extended streaming history"** dosyalarının
 * küratör panelinden içe aktarılmasıyla `MusicPlay` tablosuna yazılan
 * kayıtlardan çıkıyor. Aktarım yapılmadıysa sayfa boş grafik çizmiyor —
 * ne yapılması gerektiğini yazıyor (`hasData: false`).
 *
 * ── TASARIMDAN AYRILDIĞIM İKİ YER ─────────────────────────────────────────
 *
 * 1. **"YENİ KEŞİF %23" YOK.** O oran "bu dönemde ilk kez dinlediğim sanatçı
 *    yüzdesi" demek ve dönemden ÖNCEKİ tüm geçmişe bakmayı gerektiriyor —
 *    yani dönem süzgecinin dışına çıkan ikinci bir sorgu. Yerine gerçek ve
 *    elimizde olan bir ölçü var: toplam dinleme sayısı.
 *
 * 2. **Alt şeritteki çalma ilerlemesi YOK.** O bar canlı çalma verisi ima
 *    ediyor (Faz 5). Sayfanın altındaki "son dinlenenler" listesi aynı işi
 *    yalan söylemeden yapıyor.
 *
 * Dönem seçicisi Spotify'ın top-items aralıklarıyla aynı üçlü (4 hafta /
 * 6 ay / tüm zamanlar) — tasarımı çizen bunu kaynağın modelinden almış.
 */

export const dynamic = "force-dynamic";

const RANGES: ListeningRange[] = ["FOUR_WEEKS", "SIX_MONTHS", "ALL_TIME"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "music.listening" });
  return { title: t("title") };
}

function parseRange(value: string | undefined): ListeningRange {
  const upper = (value ?? "").toUpperCase() as ListeningRange;
  return RANGES.includes(upper) ? upper : "FOUR_WEEKS";
}

/** "61s 24d" — tasarımdaki biçim. */
function formatListeningTime(ms: number): string {
  const totalMinutes = Math.round(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}s ${String(minutes).padStart(2, "0")}d` : `${minutes}d`;
}

export default async function ListeningPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rawRange } = await searchParams;
  const range = parseRange(rawRange);
  const [data, t] = await Promise.all([
    fetchMusicListening(range),
    getTranslations("music"),
  ]);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div>
          <Link href={musicHref.root()} className={styles.back}>
            ← {t("name")}
          </Link>
          <span className={styles.eyebrow}>
            {t("name").toLocaleUpperCase("tr-TR")}
          </span>
          <h1 className={`${shell.carved} ${styles.title}`}>
            {t("listening.title").toLocaleUpperCase("tr-TR")}
          </h1>
        </div>

        {/* Dönem seçicisi: sunucu tarafında çalışan düz bağlantılar.
            İstemci durumu gerekmiyor — her seçim yeni bir sorgu. */}
        <nav className={styles.ranges} aria-label={t("listening.title")}>
          {RANGES.map((option) => (
            <Link
              key={option}
              href={`${musicHref.listening()}?range=${option}`}
              className={
                option === range ? styles.rangeActive : styles.rangeOption
              }
              aria-current={option === range ? "page" : undefined}
            >
              {t(`listening.range.${option}`)}
            </Link>
          ))}
        </nav>
      </header>

      {!data.hasData ? (
        /* Boş grafik çizmek yerine ne yapılacağını söylüyor. STATE.md bulgu
           Ö-8: sessiz boş yanıt gerçek boşlukla karışıyor. */
        <div className={`${shell.panel} ${styles.emptyState}`}>
          <p className={styles.emptyTitle}>{t("listening.empty")}</p>
          <p className={`${shell.prose} ${styles.emptyHint}`}>
            {t("listening.emptyHint")}
          </p>
        </div>
      ) : (
        <>
          <ListeningStats data={data} />

          <div className={styles.split}>
            <section className={`${shell.panel} ${styles.card}`}>
              <h2 className={shell.label}>{t("listening.topActs")}</h2>
              <ul className={styles.barList}>
                {data.topActs.map((act) => {
                  const top = data.topActs[0]?.playCount || 1;
                  const width = Math.max(
                    4,
                    Math.round((act.playCount / top) * 100),
                  );
                  return (
                    <li key={act.name} className={styles.barRow}>
                      <div className={styles.barHead}>
                        {act.slug ? (
                          <Link href={musicHref.act(act.slug)}>{act.name}</Link>
                        ) : (
                          <span>{act.name}</span>
                        )}
                        <span className={styles.barValue}>
                          {act.playCount.toLocaleString("tr-TR")}
                        </span>
                      </div>
                      <div className={styles.barTrack} aria-hidden="true">
                        <span
                          className={styles.barFill}
                          style={{
                            width: `${width}%`,
                            background: genreColorVar(act.accentKey),
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <div className={styles.sideStack}>
              <section className={`${shell.panel} ${styles.card}`}>
                <h2 className={shell.label}>{t("listening.roomShare")}</h2>
                <GenreMixBar mix={data.genreShare} showLegend={false} />
                <ul className={styles.shareList}>
                  {data.genreShare.map((share) => (
                    <li key={share.slug} className={styles.shareRow}>
                      <Link href={musicHref.room(share.slug)}>{share.name}</Link>
                      <span className={styles.shareValue}>%{share.percent}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {data.playlists.length > 0 ? (
                <section className={`${shell.panel} ${styles.card}`}>
                  <h2 className={shell.label}>{t("listening.playlists")}</h2>
                  <ul className={styles.playlistList}>
                    {data.playlists.map((playlist) => (
                      <li key={playlist.slug} className={styles.playlistRow}>
                        <CoverArt src={playlist.artwork} alt="" size={36} />
                        <span className={styles.playlistName}>
                          {playlist.name}
                        </span>
                        <span className={shell.label}>
                          {playlist.trackCount
                            ? t("playlists.trackCount", {
                                count: playlist.trackCount,
                              })
                            : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </div>

          {data.recentPlays.length > 0 ? (
            <section className={styles.section}>
              <h2 className={shell.label}>{t("listening.recent")}</h2>
              <ul className={styles.recentList}>
                {data.recentPlays.map((play, index) => (
                  <li
                    key={`${play.playedAt}-${index}`}
                    className={styles.recentRow}
                  >
                    <CoverArt src={play.track?.album.artwork} alt="" size={36} />
                    <span className={styles.recentTitle}>{play.trackName}</span>
                    <span className={styles.recentMeta}>
                      {play.artistName ?? ""}
                    </span>
                    <span className={styles.recentAlbum}>
                      {play.albumName ?? ""}
                    </span>
                    <span className={shell.mono}>
                      {new Date(play.playedAt).toLocaleString("tr-TR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}

async function ListeningStats({ data }: { data: MusicListening }) {
  const t = await getTranslations("music.listening");
  const day =
    data.busiestDay !== null
      ? t(`days.${data.busiestDay.dayOfWeek}` as "days.0")
      : "—";

  const cards = [
    { key: "time", label: t("totalTime"), value: formatListeningTime(data.totals.msPlayed) },
    {
      key: "artists",
      label: t("distinctArtists"),
      value: data.totals.distinctArtists.toLocaleString("tr-TR"),
    },
    {
      key: "plays",
      label: t("totalPlays"),
      value: data.totals.plays.toLocaleString("tr-TR"),
    },
    { key: "day", label: t("busiestDay"), value: day },
  ];

  return (
    <ul className={styles.statGrid}>
      {cards.map((card) => (
        <li key={card.key} className={`${shell.panel} ${styles.statCard}`}>
          <span className={shell.label}>{card.label}</span>
          <span className={styles.statValue}>{card.value}</span>
        </li>
      ))}
    </ul>
  );
}
