import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl, ApiError, isLocalUpload } from "@/lib/api/client";
import { fetchMusicAct, type MusicAct } from "@/lib/api/music";
import { readIsAdmin } from "@/lib/auth/session";
import { musicHref, spotifyOpenUrl } from "@/lib/music/routes";
import { upperProperName } from "@/lib/text";
import { CoverArt } from "@/components/music/CoverArt";
import { Discography } from "@/components/music/Discography";
import { MusicCuratorSwitch } from "@/components/music/MusicCuratorSwitch";
import { TrackList } from "@/components/music/TrackList";
import { NowPlaying } from "@/components/player/NowPlaying";
import shell from "../layout.module.css";
import styles from "./page.module.css";

/**
 * Salon 06 · Müzik — sanatçı sayfası (tasarım 2c).
 *
 * Kitap salonundaki kişi sayfasının müzik karşılığı.
 *
 * ── TASARIMDAN AYRILDIĞIM YERLER ──────────────────────────────────────────
 *
 * 1. **"ODA PAYI %34" YOK.** O sayı, act'in dinlemesinin odanın toplam
 *    dinlemesine oranı — hesaplanabilir ama odanın TÜM dinlemesini ayrıca
 *    sorgulamak gerekiyor ve sanatçı sayfasına bir sorgu daha bindiriyor.
 *    Yerine gerçek ve elimizde olan bir ölçü var: parça sayısı. Uydurulmuş
 *    bir yüzde göstermekten iyidir.
 *
 * 2. **"FAVORİ SANATÇI · 01" sırası YOK.** Sıra numarası bir favori sıralaması
 *    ima ediyor; `MusicFavorite` Faz 2'de geliyor. Etiket şimdilik sırasız.
 *
 * 3. **Banner küratör yüklemesi.** Spotify sanatçı görselini 640×640 kare
 *    veriyor, tasarımın istediği 2000×640 bant DEĞİL. `bannerImage` alanı
 *    şemada var ama sync onu doldurmuyor (küratör yükler). Banner yoksa
 *    kıvrım kare görsel + çizgili doku ile kuruluyor.
 */

export const dynamic = "force-dynamic";

async function getAct(slug: string, fresh?: boolean): Promise<MusicAct> {
  try {
    return await fetchMusicAct(slug, fresh);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; actSlug: string }>;
}): Promise<Metadata> {
  const { locale, actSlug } = await params;
  const t = await getTranslations({ locale, namespace: "music" });
  try {
    const act = await fetchMusicAct(actSlug);
    return {
      title: `${act.name} · ${t("name")}`,
      description: act.bio ?? t("lede"),
    };
  } catch {
    return { title: t("name") };
  }
}

/* `formatLength` buradan kalktı: parça süresi artık `TrackList` içinde
   biçimleniyor ve iki kopya bir gün ayrışırdı. */

function releaseYear(date: string | null): string {
  return date ? new Date(date).getUTCFullYear().toString() : "";
}

export default async function MusicActPage({
  params,
}: {
  params: Promise<{ actSlug: string }>;
}) {
  const { actSlug } = await params;
  /* Arşiv isteğinden ÖNCE: küratör sayfayı taze okuyor (gerekçe
     `lib/api/music.ts`), ziyaretçi önbellekten. Çerez yoksa istek yapılmıyor */
  const isAdmin = await readIsAdmin();
  const [act, t] = await Promise.all([
    getAct(actSlug, isAdmin),
    getTranslations("music"),
  ]);

  const primaryGenre = act.genres[0] ?? null;
  const trackTotal = act.albums.reduce(
    (total, album) => total + (album.totalTracks ?? 0),
    0,
  );
  const years =
    act.formedYear && act.disbandedYear
      ? t("act.activeBetween", {
          from: act.formedYear,
          to: act.disbandedYear,
        })
      : act.formedYear
        ? t("act.formedIn", { year: act.formedYear })
        : null;

  const banner = isLocalUpload(act.bannerImage) ? act.bannerImage : null;

  return (
    <div
      className={styles.page}
      data-genre={primaryGenre?.accentKey ?? undefined}
    >
      {/* ── Kırıntı ────────────────────────────────────────────────────── */}
      <nav className={styles.crumbs} aria-label={t("name")}>
        <Link href={musicHref.root()}>{t("name")}</Link>
        {primaryGenre ? (
          <>
            <span aria-hidden="true"> / </span>
            <Link href={musicHref.room(primaryGenre.slug)}>
              {primaryGenre.name}
            </Link>
          </>
        ) : null}
        <span aria-hidden="true"> / </span>
        <span className={styles.crumbCurrent}>{act.name}</span>
      </nav>

      {/* ── Kıvrım ─────────────────────────────────────────────────────── */}
      <header
        className={styles.hero}
        /**
         * ⚠️ `backgroundPosition` küratörden geliyor ama satır içi stile
         * yazılıyor, yani doğrulanmamış bir dize CSS enjeksiyonu olurdu.
         * Backend `"<sayı>% <sayı>%"` kalıbına karşı doğruluyor
         * (`music-curator.service.ts`); burada ikinci savunma olarak aynı
         * kalıp bir kez daha sınanıyor — kalıba uymayan değer görmezden
         * geliniyor ve CSS varsayılanı ("50% 50%") geçerli kalıyor.
         *
         * Neden gerekli: bant 2000×640 oranında kırpılıyor ve grup
         * fotoğraflarında yüzler üst üçte birde olduğu için ortadan kırpma
         * yüzleri kesiyordu (kullanıcı bildirimi).
         */
        style={
          banner
            ? {
                backgroundImage: `url(${apiUrl(banner)})`,
                backgroundPosition:
                  act.bannerPosition &&
                  /^\d{1,3}% \d{1,3}%$/.test(act.bannerPosition)
                    ? act.bannerPosition
                    : undefined,
              }
            : undefined
        }
        data-has-banner={banner ? "true" : "false"}
      >
        <div className={styles.heroInner}>
          <div className={styles.heroMain}>
            {!banner ? (
              <CoverArt src={act.image} alt={act.name} size={96} rounded="full" />
            ) : null}
            <span className={styles.eyebrow}>
              {t("act.favorite").toLocaleUpperCase("tr-TR")}
            </span>
            <h1 className={`${shell.carved} ${styles.title}`}>{act.name}</h1>
            <ul className={styles.chips}>
              {act.genres.slice(0, 3).map((genre) => (
                <li key={genre.slug}>
                  <Link href={musicHref.room(genre.slug)} className={styles.chip}>
                    {upperProperName(genre.name)}
                  </Link>
                </li>
              ))}
              {years ? <li className={styles.chipStatic}>{years}</li> : null}
              {act.actKind !== "UNCLASSIFIED" ? (
                <li className={styles.chipStatic}>
                  {t(`actKind.${act.actKind}`)}
                </li>
              ) : null}
            </ul>
          </div>

          <dl className={styles.stats}>
            {act.playCount > 0 ? (
              <div className={styles.stat}>
                <dt className={shell.label}>{t("act.myPlays")}</dt>
                <dd className={styles.statValue}>
                  {act.playCount.toLocaleString("tr-TR")}
                </dd>
              </div>
            ) : null}
            <div className={styles.stat}>
              <dt className={shell.label}>{t("counts.albums")}</dt>
              <dd className={styles.statValue}>{act.albums.length}</dd>
            </div>
            {trackTotal > 0 ? (
              <div className={styles.stat}>
                <dt className={shell.label}>{t("counts.tracks")}</dt>
                <dd className={styles.statValue}>{trackTotal}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </header>

      {/* Küratör anahtarı. Sanatçının türü ve künyesi (grup/solo, kuruluş
          yılı, köken) Spotify'dan GELMİYOR — bu panel olmadan act'i bir odaya
          koymanın yolu yok. Ziyaretçiye render edilmiyor */}
      {isAdmin ? (
        <MusicCuratorSwitch
          scope="act"
          act={{
            id: act.id,
            slug: act.slug,
            name: act.name,
            actKind: act.actKind,
            bio: act.bio,
            formedYear: act.formedYear,
            disbandedYear: act.disbandedYear,
            originCity: act.originCity,
            originCountry: act.originCountry,
            bannerImage: act.bannerImage,
            spotifyId: act.spotifyId,
            /* Sayfa verisi tür KİMLİĞİ değil slug taşıyor (okuma yolunda
               kimliğe gerek yok). Panel eşlemeyi tür listesi indikten sonra
               kuruyor */
            genreSlugs: act.genres.map((genre) => genre.slug),
          }}
        />
      ) : null}

      {/* ── Parçalar + çalar ───────────────────────────────────────────── */}
      <div className={styles.split}>
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={shell.label}>{t("act.topTracks")}</h2>
            <span className={styles.badge}>
              {act.topTracks[0]?.measured
                ? t("acts.measured")
                : t("acts.unmeasured")}
            </span>
          </div>
          {act.topTracks.length === 0 ? (
            <p className={styles.empty}>{t("act.noAlbums")}</p>
          ) : (
            /* Satırlar artık çalınabilir ve küratör için "listeye ekle"
               taşıyor. Kuyruk kök düzende yaşadığı için sayfadan ayrılınca
               müzik kesilmiyor. */
            <TrackList
              tracks={act.topTracks.map((track) => ({
                id: track.id,
                title: track.title,
                spotifyId: track.spotifyId,
                durationMs: track.durationMs,
                artist: act.name,
                album: {
                  title: track.album.title,
                  artwork: track.album.artwork,
                },
                playCount: track.playCount,
              }))}
              context={act.name}
              isAdmin={isAdmin}
              showAlbum
              showPlays={act.topTracks[0]?.measured ?? false}
            />
          )}
        </section>

        {/* Sağ sütun kuyruğun görünümü (gerekçe `NowPlaying.tsx`). Sanatçı
            sayfasında tohum "en çok dinlediğim parçalar" — sayfada çizilen
            liste neyse çalınan da o olsun. */}
        <aside className={styles.side}>
          <NowPlaying
            seed={{
              tracks: act.topTracks.map((track) => ({
                spotifyId: track.spotifyId ?? "",
                title: track.title,
                artist: act.name,
                album: track.album.title,
                artwork: track.album.artwork,
              })),
              context: act.name,
              contextHref: musicHref.act(act.slug),
            }}
          />
          {act.spotifyId ? (
            <a
              className={styles.spotifyLink}
              href={spotifyOpenUrl("artist", act.spotifyId)}
              target="_blank"
              rel="noreferrer noopener"
            >
              {t("openInSpotify")}
            </a>
          ) : null}
        </aside>
      </div>

      {/* ── Biyografi ──────────────────────────────────────────────────────
             Eskiden çalar kutusunun altında küçük bir paragraftı ve okunmuyordu
             (kullanıcı isteği: "biyografi kısmı da olsa güzel olur"). Artık
             kendi bölümü. Metin küratörün kendi sesi — MusicBrainz de Spotify
             de biyografi vermiyor, `enrichFromMusicBrainz` bu alana bilerek
             dokunmuyor. */}
      {act.bio ? (
        <section className={styles.section}>
          <h2 className={shell.label}>{t("act.biography")}</h2>
          <p className={`${shell.prose} ${styles.bio}`}>{act.bio}</p>
        </section>
      ) : null}

      {/* ── Diskografi ─────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className={shell.label}>{t("act.discography")}</h2>
        {act.albums.length === 0 ? (
          <p className={styles.empty}>{t("act.noAlbums")}</p>
        ) : (
          /* Izgara 3/4/6 sütun ve ilk 12 albümle açılıyor; gerekçesi
             `Discography.tsx` başlığında (iki kullanıcı bildirimi) */
          <Discography actSlug={act.slug} albums={act.albums} />
        )}

        {act.roomMates.length > 0 ? (
          <div className={styles.roomMates}>
            <span className={shell.label}>{t("act.roomMates")}</span>
            <ul className={styles.chipList}>
              {act.roomMates.map((mate) => (
                <li key={mate.slug}>
                  <Link href={musicHref.act(mate.slug)} className={styles.chip}>
                    {mate.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {/* ── Single ve EP'ler: diskografiden AYRI ────────────────────────────
             Tasarım (2c) yalnızca albüm ızgarası gösteriyor. Ama Spotify
             single'ı da albüm olarak döndürüyor ve `MusicAlbumType` ikisini
             ayırıyor; aynı ızgaraya karıştırmak "8 albüm" diyen künyeyle
             çelişen kırk kutu üretirdi. Ayrı ve daha küçük bir şeritte. */}
      {act.singles.length > 0 ? (
        <section className={styles.section}>
          <h2 className={shell.label}>{t("act.singles")}</h2>
          <ul className={styles.chipList}>
            {act.singles.map((single) => (
              <li key={single.slug} className={styles.chipStatic}>
                {single.title}
                {single.releaseDate ? (
                  <span className={styles.chipYear}>
                    {releaseYear(single.releaseDate)}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ── Dönemler: küratör verisi (Faz 3'te timeline olacak) ─────────── */}
      {act.eras.length > 0 ? (
        <section className={styles.section}>
          <h2 className={shell.label}>{t("act.eras")}</h2>
          <ul className={styles.eraList}>
            {act.eras.map((era) => (
              <li key={era.slug} className={styles.eraRow}>
                <span className={styles.eraName}>{era.name}</span>
                <span className={shell.mono}>
                  {[era.startedAt, era.endedAt]
                    .map((date) => (date ? releaseYear(date) : ""))
                    .filter(Boolean)
                    .join(" — ")}
                </span>
                {era.description ? (
                  <span className={`${shell.prose} ${styles.eraNote}`}>
                    {era.description}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ── Kadro (Faz 2'de kişi sayfaları gelince bağlantılı olacak) ──── */}
      {act.memberships.length > 0 ? (
        <section className={styles.section}>
          <h2 className={shell.label}>{t("act.members")}</h2>
          <ul className={styles.memberList}>
            {act.memberships.map((membership) => (
              <li
                key={`${membership.person.slug}-${membership.role.key}`}
                className={styles.memberRow}
              >
                <CoverArt
                  src={membership.person.photo}
                  alt=""
                  size={40}
                  rounded="full"
                />
                <span className={styles.memberName}>
                  {membership.person.name}
                </span>
                <span className={styles.memberRole}>
                  {t(`roles.${membership.role.key}`)}
                </span>
                <span className={shell.mono}>
                  {membership.isCurrent ? "" : "—"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
