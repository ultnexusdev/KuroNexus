"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import {
  addMusicAct,
  addMusicPlaylist,
  backfillListening,
  createMusicGenre,
  enrichMusicAct,
  importListeningHistory,
  listMusicGenres,
  localizeMusicArtwork,
  musicStatus,
  refreshMusicAct,
  searchSpotifyArtists,
  seedMusicRoles,
  setMusicActGenres,
  updateMusicAct,
  updateMusicGenre,
  uploadImage,
  type MusicAdminStatus,
  type MusicGenreRecord,
  type SpotifyArtistResult,
} from "@/lib/admin/api";
import type { CuratorAct } from "./MusicCuratorSwitch";
import styles from "./MusicCurator.module.css";

/**
 * Salon 06 · Müzik — küratör kontrolleri.
 *
 * Yalnızca admin için, yalnızca küratör modu açıkken indirilir
 * (`MusicCuratorSwitch` içinde `next/dynamic`). Ziyaretçinin tarayıcısına bu
 * dosyadan tek satır inmez.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * BU PANELİN VAR OLMA SEBEBİ (11 Ağustos 2026 ölçümü)
 *
 * Bu uygulamanın gördüğü Spotify sanatçı nesnesi sadeleştirilmiş:
 *   gelen:    external_urls, href, id, images, name, type, uri
 *   gelmeyen: genres, popularity, followers
 *
 * Yani **tür taksonomisi Spotify'dan HİÇ gelmiyor.** MusicBrainz çoğunu
 * getiriyor ama o da yalnızca boş alanları dolduruyor. Odaları kuran,
 * sanatçıyı odaya koyan ve künyeyi yazan tek şey bu panel.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ── KAYDETTİKTEN SONRA NEDEN `router.refresh()` ───────────────────────────
 * Salonun getiricileri `revalidate: 300` ile önbellekli (`lib/api/music.ts`).
 * Küratör bir tür onayladığında ya da sanatçı eklediğinde sayfa beş dakikaya
 * kadar eski hâlini gösterirdi ve bu "kaydedilmedi" gibi okunurdu.
 * `router.refresh()` sunucu bileşenlerini yeniden çalıştırıyor ve
 * `no-store` işaretli küratör isteklerinin yanında salon verisi de tazeleniyor.
 * Yerel durumu elle güncellemek yerine sayfayı tazelemek kitap kanadındaki
 * kararla aynı: sayaçlar ve odalar tek kaynaktan doğru kalıyor.
 */

/** Canlı arama bekleme süresi — Spotify yanıtları 200–900 ms bandında. */
const DEBOUNCE_MS = 300;

/** Bu uzunluğun altında istek atılmıyor (Spotify de 2 karakterin altını elemiyor). */
const MIN_QUERY = 2;

/**
 * `globals.css` içinde `[data-genre="…"]` bloğu olan anahtarlar.
 *
 * ⚠️ Backend'deki `KNOWN_ACCENT_KEYS` ile AYNI olmak zorunda
 * (`music-curator.service.ts`). Serbest metin kutusu değil seçim kutusu
 * olmasının sebebi bu: karşılığı olmayan bir anahtar yazılsa oda sessizce
 * salonun varsayılan rengiyle çizilirdi — hata görünmezdi.
 */
const ACCENT_KEYS = [
  "pop",
  "rock",
  "metal",
  "hiphop",
  "electronic",
  "rnb",
  "jazz",
  "blues",
  "classical",
  "folk",
  "country",
  "latin",
  "reggae",
  "world",
  "gospel",
  "soundtrack",
  "experimental",
] as const;

const ACT_KINDS = [
  "UNCLASSIFIED",
  "BAND",
  "SOLO_PROJECT",
  "DUO",
  "GROUP",
  "ORCHESTRA",
] as const;

/**
 * Hata mesajını okunur hâle getirir.
 *
 * Backend anahtar döndürüyor (`MUSIC.GENRE_SLUG_TAKEN`). Çevirisi varsa o,
 * yoksa **anahtarın kendisi** gösteriliyor — "İşlem yapılamadı" deyip sebebi
 * yutmak bu projede üç kez teşhisi bir tur uzattı (devir notu §4.5). Sebep
 * çağırana kadar taşınır; arayüz de onu gösterir.
 */
function useErrorText(): (error: unknown) => string {
  const t = useTranslations("music.curator");
  return useCallback(
    (error: unknown) => {
      if (error instanceof ApiError) {
        const key = error.message;
        const translated = t.has(`errors.${key}`)
          ? t(`errors.${key}`)
          : `${t("errorGeneric")} (${key} · HTTP ${error.status})`;
        return translated;
      }
      return error instanceof Error ? error.message : t("errorGeneric");
    },
    [t],
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SALON PANELİ
   ══════════════════════════════════════════════════════════════════════════ */

export function HallCurator() {
  const t = useTranslations("music.curator");

  return (
    <div className={styles.panel}>
      <StatusStrip />
      <ArtistSearch />
      <PasteBox />
      <GenreDictionary />
      <Maintenance />
      <p className={styles.footnote}>{t("hallFootnote")}</p>
    </div>
  );
}

/**
 * Durum şeridi. İlk baktığı şey "Spotify bağlı mı": anahtar yoksa arama ve
 * ekleme uçlarının hepsi hata veriyor ve sebebi panelde görünmüyordu.
 *
 * Başarısız senkronizasyonlar da burada: `MusicSyncState` satırındaki
 * `lastError` konteyner logunda aranmasın diye.
 */
function StatusStrip() {
  const t = useTranslations("music.curator");
  const toText = useErrorText();
  const [status, setStatus] = useState<MusicAdminStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    musicStatus()
      .then((value) => {
        if (alive) setStatus(value);
      })
      .catch((err: unknown) => {
        if (alive) setError(toText(err));
      });
    return () => {
      alive = false;
    };
  }, [toText]);

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }
  if (!status) {
    return <p className={styles.muted}>{t("loading")}</p>;
  }

  const failed = status.syncState.filter((row) => row.status === "FAILED");

  return (
    <div className={styles.statusStrip}>
      <span
        className={status.spotifyConfigured ? styles.pillOk : styles.pillWarn}
      >
        {status.spotifyConfigured ? t("spotifyOn") : t("spotifyOff")}
      </span>
      <span className={status.roleVocabulary > 0 ? styles.pillOk : styles.pillWarn}>
        {t("roleCount", { count: status.roleVocabulary })}
      </span>
      {failed.length > 0 ? (
        <details className={styles.failBox}>
          <summary className={styles.pillWarn}>
            {t("syncFailed", { count: failed.length })}
          </summary>
          <ul className={styles.failList}>
            {failed.map((row) => (
              <li key={`${row.entityKind}:${row.entityId}`}>
                <code>
                  {row.entityKind} {row.entityId}
                </code>{" "}
                — {row.lastError ?? "—"}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

/**
 * Sanatçı arama ve ekleme.
 *
 * ⚠️ **Arama yalnızca SANATÇI arıyor** ve bu bilinçli: bir sanatçıyı eklemek
 * diskografisinin tamamını getiriyor (Linkin Park'ta 63 albüm, 610 parça).
 * Albüm ya da parça araması ayrı bir ekleme yolu açardı ve albümü sahipsiz
 * bırakırdı — arşivde albüm her zaman bir act'e bağlı. Elinde albüm/parça
 * adresi olan küratör aşağıdaki yapıştırma kutusunu kullanıyor.
 *
 * Canlı arama üç şeye dikkat ediyor (kitap salonundaki desen):
 *  - debounce: her harfte değil, yazma durunca istek,
 *  - eski yanıtı yok say: kullanıcı yazmaya devam ederse önceki isteğin yanıtı
 *    geldiğinde yazılmıyor. Kitap salonu bunu `AbortController` ile yapıyor
 *    ama `searchSpotifyArtists` sinyal almıyor; istek yolda kalıyor, sonucu
 *    ise düşürülüyor — görünen davranış aynı (liste yeni sorguyu gösteriyor),
 *    kazanılmayan tek şey iptal edilmiş bir ağ isteği. Sinyali uca kadar
 *    taşımak ayrı bir iş,
 *  - kısa sorgu: `MIN_QUERY` altında hiç istek yok.
 */
function ArtistSearch() {
  const t = useTranslations("music.curator");
  const toText = useErrorText();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifyArtistResult[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY) {
      setResults(null);
      return;
    }
    let current = true;
    const timer = setTimeout(() => {
      setBusy(true);
      setError(null);
      searchSpotifyArtists(trimmed)
        .then((found) => {
          if (current) setResults(found);
        })
        .catch((err: unknown) => {
          if (current) setError(toText(err));
        })
        .finally(() => {
          if (current) setBusy(false);
        });
    }, DEBOUNCE_MS);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [query, toText]);

  /**
   * Ekleme UZUN sürüyor: albüm başına bir Spotify isteği + kapak indirmesi.
   * Gerçek sanatçılarda 30 saniyeyi aşıyor, o yüzden düğme kilitleniyor ve
   * "sürüyor" metni gerçek bir bekleyişi anlatıyor.
   */
  async function add(artist: SpotifyArtistResult) {
    setAdding(artist.spotifyId);
    setError(null);
    setDone(null);
    try {
      const result = await addMusicAct(artist.spotifyId);
      /**
       * Ekledikten hemen sonra MusicBrainz: tür, grup/solo, kuruluş yılı ve
       * köken YALNIZCA oradan geliyor (Spotify hiçbirini vermiyor). Ayrı bir
       * düğme olsaydı küratör her sanatçı için iki adımı hatırlamak zorunda
       * kalırdı; hata verirse akış kesilmiyor, sebebi yazılıp geçiliyor.
       */
      let note = t("added", {
        name: result.name,
        albums: result.albumsCreated + result.albumsUpdated,
        tracks: result.tracks,
      });
      try {
        const enriched = await enrichMusicAct(result.actId);
        note += enriched.matched
          ? ` · ${t("enriched", { count: enriched.filled.length })}`
          : ` · ${t("enrichFailed", { reason: enriched.reason ?? "—" })}`;
      } catch (err: unknown) {
        note += ` · ${toText(err)}`;
      }
      setDone(note);
      setQuery("");
      setResults(null);
      router.refresh();
    } catch (err: unknown) {
      setError(toText(err));
    } finally {
      setAdding(null);
    }
  }

  return (
    <section className={styles.block}>
      <h3 className={styles.blockTitle}>{t("searchTitle")}</h3>
      <p className={styles.blockLede}>{t("searchLede")}</p>

      <input
        type="search"
        className={styles.input}
        value={query}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchTitle")}
        onChange={(event) => setQuery(event.target.value)}
      />

      {busy ? <p className={styles.muted}>{t("searching")}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      {done ? <p className={styles.ok}>{done}</p> : null}

      {results && results.length === 0 && !busy ? (
        <p className={styles.muted}>{t("noResults")}</p>
      ) : null}

      {results && results.length > 0 ? (
        <ul className={styles.resultList}>
          {results.map((artist) => (
            <li key={artist.spotifyId} className={styles.resultRow}>
              <span className={styles.resultName}>{artist.name}</span>
              {/* Tür/popülerlik alanları Spotify'dan gelmiyor (ölçüm yukarıda);
                  boş yeri sanatçı kimliğiyle dolduruyoruz — küratör doğru
                  kaydı seçtiğinden emin olmak için adrese bakabiliyor */}
              <code className={styles.resultId}>{artist.spotifyId}</code>
              <button
                type="button"
                className={styles.action}
                disabled={adding !== null}
                onClick={() => add(artist)}
              >
                {adding === artist.spotifyId ? t("addingLong") : t("add")}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

/**
 * Adres yapıştırma kutusu.
 *
 * Küratörün elinde genelde tarayıcı adresi oluyor. Tür (sanatçı / çalma
 * listesi) elle seçiliyor: adresten tahmin etmek "yanlış uca gitti" hatasını
 * sessiz yapardı; backend zaten `extractSpotifyId(…, kind)` ile türü
 * doğruluyor ve uyuşmazsa anlaşılır hata veriyor.
 */
function PasteBox() {
  const t = useTranslations("music.curator");
  const toText = useErrorText();
  const router = useRouter();

  const [kind, setKind] = useState<"artist" | "playlist">("artist");
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    setBusy(true);
    setError(null);
    setDone(null);
    try {
      if (kind === "artist") {
        const result = await addMusicAct(trimmed);
        setDone(
          t("added", {
            name: result.name,
            albums: result.albumsCreated + result.albumsUpdated,
            tracks: result.tracks,
          }),
        );
      } else {
        const result = await addMusicPlaylist(trimmed);
        setDone(
          t("playlistAdded", {
            name: result.name,
            linked: result.tracksLinked,
            missing: result.tracksMissing,
          }),
        );
      }
      setValue("");
      router.refresh();
    } catch (err: unknown) {
      setError(toText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.block}>
      <h3 className={styles.blockTitle}>{t("pasteTitle")}</h3>
      <form className={styles.row} onSubmit={submit}>
        <select
          className={styles.select}
          value={kind}
          aria-label={t("pasteKind")}
          onChange={(event) =>
            setKind(event.target.value as "artist" | "playlist")
          }
        >
          <option value="artist">{t("kindArtist")}</option>
          <option value="playlist">{t("kindPlaylist")}</option>
        </select>
        <input
          type="text"
          className={styles.input}
          value={value}
          placeholder={t("pastePlaceholder")}
          aria-label={t("pasteTitle")}
          onChange={(event) => setValue(event.target.value)}
        />
        <button type="submit" className={styles.action} disabled={busy}>
          {busy ? t("working") : t("send")}
        </button>
      </form>
      {error ? <p className={styles.error}>{error}</p> : null}
      {done ? <p className={styles.ok}>{done}</p> : null}
    </section>
  );
}

/**
 * Tür sözlüğü — odaları kuran yer.
 *
 * Bir tür `parentId` almazsa **oda** olur (`/muzik/tur/<slug>`); alırsa üst
 * türün altında bir alt tür olarak durur. Linkin Park'ta gelen altı türden
 * yalnızca biri oda yapıldı, beşi alt tür — kalabalık bir kapı duvarı yerine
 * bir oda ve içinde ayrıntı.
 */
function GenreDictionary() {
  const t = useTranslations("music.curator");
  const toText = useErrorText();
  const router = useRouter();

  const [genres, setGenres] = useState<MusicGenreRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [name, setName] = useState("");
  const [accentKey, setAccentKey] = useState("");
  const [parentId, setParentId] = useState("");

  const load = useCallback(() => {
    listMusicGenres()
      .then(setGenres)
      .catch((err: unknown) => setError(toText(err)));
  }, [toText]);

  useEffect(load, [load]);

  async function create(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await createMusicGenre({
        name: name.trim(),
        accentKey: accentKey || undefined,
        parentId: parentId || undefined,
      });
      setName("");
      setAccentKey("");
      setParentId("");
      load();
      router.refresh();
    } catch (err: unknown) {
      setError(toText(err));
    } finally {
      setBusy(false);
    }
  }

  async function patch(id: string, input: Parameters<typeof updateMusicGenre>[1]) {
    setBusy(true);
    setError(null);
    try {
      await updateMusicGenre(id, input);
      load();
      router.refresh();
    } catch (err: unknown) {
      setError(toText(err));
    } finally {
      setBusy(false);
    }
  }

  const rooms = (genres ?? []).filter((genre) => genre.parentId === null);

  return (
    <section className={styles.block}>
      <h3 className={styles.blockTitle}>{t("genreTitle")}</h3>
      <p className={styles.blockLede}>{t("genreLede")}</p>

      {/* ⚠️ Üç kutu 13 Ağustos'a kadar ETİKETSİZDİ ve yan yana duruyordu;
          kullanıcı "hangisi ne işe yarıyor anlamadım" dedi. `aria-label`
          vardı — yani ekran okuyucu biliyordu, gözle bakan bilmiyordu.
          Görünür etiket erişilebilirlik için değil ANLAŞILIRLIK için. */}
      <form className={styles.createGrid} onSubmit={create}>
        <label className={styles.field}>
          <span className={styles.fileLabel}>{t("genreName")}</span>
          <input
            type="text"
            className={styles.input}
            value={name}
            placeholder={t("genreNamePlaceholder")}
            onChange={(event) => setName(event.target.value)}
          />
          <span className={styles.hint}>{t("genreNameHint")}</span>
        </label>

        <label className={styles.field}>
          <span className={styles.fileLabel}>{t("accentKey")}</span>
          <select
            className={styles.select}
            value={accentKey}
            onChange={(event) => setAccentKey(event.target.value)}
          >
            <option value="">{t("accentNone")}</option>
            {ACCENT_KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <span className={styles.hint}>{t("accentKeyHint")}</span>
        </label>

        <label className={styles.field}>
          <span className={styles.fileLabel}>{t("parentGenre")}</span>
          <select
            className={styles.select}
            value={parentId}
            onChange={(event) => setParentId(event.target.value)}
          >
            <option value="">{t("parentNone")}</option>
            {rooms.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          <span className={styles.hint}>{t("parentGenreHint")}</span>
        </label>

        <button type="submit" className={styles.action} disabled={busy}>
          {t("createGenre")}
        </button>
      </form>

      {error ? <p className={styles.error}>{error}</p> : null}

      {genres === null ? (
        <p className={styles.muted}>{t("loading")}</p>
      ) : genres.length === 0 ? (
        <p className={styles.muted}>{t("genreEmpty")}</p>
      ) : (
        <ul className={styles.genreList}>
          {genres.map((genre) => (
            /* Alt tür GİRİNTİYLE ayrılıyor, karakterle değil. Önce "↳" (U+21B3)
               kullanılmıştı ama satır başlıkları Cinzel ile çiziliyor ve o
               fontta bu glif yok — yedek fontta bambaşka bir işaret çıkıyordu
               (kullanıcı ekran görüntüsü, 13 Ağustos). Girinti her fontta
               çalışıyor ve hiyerarşiyi zaten daha iyi anlatıyor. */
            <li
              key={genre.id}
              className={styles.genreRow}
              data-sub={genre.parentId ? "true" : undefined}
            >
              <span className={styles.genreName}>
                                {genre.name}
              </span>
              <code className={styles.genreSlug}>{genre.slug}</code>
              <span className={styles.genreMeta}>
                {t("genreActs", { count: genre._count?.acts ?? 0 })}
                {genre.accentKey ? ` · ${genre.accentKey}` : ""}
              </span>
              <button
                type="button"
                className={genre.isApproved ? styles.actionQuiet : styles.action}
                disabled={busy}
                onClick={() =>
                  patch(genre.id, { isApproved: !genre.isApproved })
                }
              >
                {genre.isApproved ? t("unapprove") : t("approve")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Bakım işleri: kapak yerelleştirme, rol sözlüğü, dinleme geçmişi. */
function Maintenance() {
  const t = useTranslations("music.curator");
  const toText = useErrorText();
  const router = useRouter();

  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function run(key: string, work: () => Promise<string>) {
    setBusy(key);
    setError(null);
    setDone(null);
    try {
      setDone(await work());
      router.refresh();
    } catch (err: unknown) {
      setError(toText(err));
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className={styles.block}>
      <h3 className={styles.blockTitle}>{t("maintenanceTitle")}</h3>
      <div className={styles.row}>
        <button
          type="button"
          className={styles.actionQuiet}
          disabled={busy !== null}
          onClick={() =>
            run("artwork", async () => {
              const result = await localizeMusicArtwork();
              return t("artworkDone", {
                albums: result.albums,
                acts: result.acts,
                failed: result.failed,
              });
            })
          }
        >
          {busy === "artwork" ? t("working") : t("localizeArtwork")}
        </button>

        <button
          type="button"
          className={styles.actionQuiet}
          disabled={busy !== null}
          onClick={() =>
            run("roles", async () => {
              const result = await seedMusicRoles();
              return t("rolesDone", {
                created: result.created,
                existing: result.existing,
              });
            })
          }
        >
          {busy === "roles" ? t("working") : t("seedRoles")}
        </button>

        <button
          type="button"
          className={styles.actionQuiet}
          disabled={busy !== null}
          onClick={() =>
            run("backfill", async () => {
              const result = await backfillListening();
              return t("backfillDone", { count: result.linked });
            })
          }
        >
          {busy === "backfill" ? t("working") : t("backfill")}
        </button>
      </div>

      {/* Dinleme geçmişi: Spotify'ın "Extended streaming history" zip'inden
          çıkan JSON dosyaları TEK TEK yükleniyor. Aynı dosyayı iki kez
          yüklemek zararsız — `@@unique([userId, playedAt, spotifyTrackUri])`
          kopyayı engelliyor. */}
      <label className={styles.fileField}>
        <span className={styles.fileLabel}>{t("historyLabel")}</span>
        <input
          type="file"
          accept="application/json,.json"
          disabled={busy !== null}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) {
              return;
            }
            void run("history", async () => {
              const result = await importListeningHistory(file);
              return t("historyDone", {
                inserted: result.inserted,
                duplicate: result.duplicate,
                matched: result.matched,
              });
            });
            event.target.value = "";
          }}
        />
      </label>
      <p className={styles.hint}>{t("historyHint")}</p>

      {error ? <p className={styles.error}>{error}</p> : null}
      {done ? <p className={styles.ok}>{done}</p> : null}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SANATÇI PANELİ
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Sanatçı sayfasının küratör paneli: tür ataması + künye.
 *
 * ⚠️ Sync'in yazdığı alanlar (ad, görsel, Spotify kimliği) BURADA YOK: bir
 * sonraki tazelemede üzerlerine yazılırlardı ve "değişikliğim kayboldu"
 * derdik. Burada yalnızca sync'in ASLA dokunmadığı alanlar var.
 */
export function ActCurator({ act }: { act: CuratorAct }) {
  const t = useTranslations("music.curator");
  /** Grup/solo etiketleri salonun kendi sözlüğünden — künye çipiyle aynı metin */
  const tMusic = useTranslations("music");
  const toText = useErrorText();
  const router = useRouter();

  const [genres, setGenres] = useState<MusicGenreRecord[] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const [actKind, setActKind] = useState(act.actKind);
  const [formedYear, setFormedYear] = useState(
    act.formedYear ? String(act.formedYear) : "",
  );
  const [disbandedYear, setDisbandedYear] = useState(
    act.disbandedYear ? String(act.disbandedYear) : "",
  );
  const [originCity, setOriginCity] = useState(act.originCity ?? "");
  const [originCountry, setOriginCountry] = useState(act.originCountry ?? "");
  const [bio, setBio] = useState(act.bio ?? "");
  const [bannerImage, setBannerImage] = useState(act.bannerImage ?? "");
  /**
   * Bant odagi iki eksene ayrilmis halde tutuluyor; kaydedilirken
   * backend`in bekledigi "X% Y%" kalibina birlestiriliyor. Kayitli deger
   * kaliba uymuyorsa ortaya dusuluyor (50/50) — bozuk bir deger yuzunden
   * kaydiricilar bos kalmasin.
   */
  const savedPosition = /^(\d{1,3})% (\d{1,3})%$/.exec(act.bannerPosition ?? "");
  const [bannerX, setBannerX] = useState(Number(savedPosition?.[1] ?? 50));
  const [bannerY, setBannerY] = useState(Number(savedPosition?.[2] ?? 50));

  /**
   * Seçili türler act'in slug'larından kuruluyor: sayfa verisi kimlik değil
   * slug taşıyor (okuma yolunda kimliğe gerek yok ve ortaya çıkarmanın da
   * anlamı yok). Eşleme tür listesi indikten sonra kuruluyor.
   */
  useEffect(() => {
    let alive = true;
    listMusicGenres()
      .then((list) => {
        if (!alive) return;
        setGenres(list);
        setSelected(
          list
            .filter((genre) => act.genreSlugs.includes(genre.slug))
            .map((genre) => genre.id),
        );
      })
      .catch((err: unknown) => {
        if (alive) setError(toText(err));
      });
    return () => {
      alive = false;
    };
  }, [act.genreSlugs, toText]);

  async function run(key: string, work: () => Promise<string>) {
    setBusy(key);
    setError(null);
    setDone(null);
    try {
      setDone(await work());
      router.refresh();
    } catch (err: unknown) {
      setError(toText(err));
    } finally {
      setBusy(null);
    }
  }

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }

  /** Yıl kutuları boş kalabilir; boş dizeyi 0 yapıp göndermek yanlış olurdu. */
  function year(value: string): number | undefined {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return (
    <div className={styles.panel}>
      <section className={styles.block}>
        <h3 className={styles.blockTitle}>{t("actGenresTitle")}</h3>
        <p className={styles.blockLede}>{t("actGenresLede")}</p>

        {genres === null ? (
          <p className={styles.muted}>{t("loading")}</p>
        ) : (
          <ul className={styles.chipList}>
            {genres.map((genre) => (
              <li key={genre.id}>
                <button
                  type="button"
                  className={
                    selected.includes(genre.id) ? styles.chipOn : styles.chip
                  }
                  aria-pressed={selected.includes(genre.id)}
                  onClick={() => toggle(genre.id)}
                >
                                    {genre.name}
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          className={styles.action}
          disabled={busy !== null || genres === null}
          onClick={() =>
            run("genres", async () => {
              const result = await setMusicActGenres(act.id, selected);
              return t("actGenresSaved", { count: result.genres.length });
            })
          }
        >
          {busy === "genres" ? t("working") : t("saveGenres")}
        </button>
      </section>

      <section className={styles.block}>
        <h3 className={styles.blockTitle}>{t("actInfoTitle")}</h3>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span className={styles.fileLabel}>{t("actKind")}</span>
            <select
              className={styles.select}
              value={actKind}
              onChange={(event) => setActKind(event.target.value)}
            >
              {ACT_KINDS.map((kind) => (
                <option key={kind} value={kind}>
                  {tMusic(`actKind.${kind}`)}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.fileLabel}>{t("formedYear")}</span>
            <input
              type="number"
              className={styles.input}
              value={formedYear}
              min={1850}
              max={2200}
              onChange={(event) => setFormedYear(event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.fileLabel}>{t("disbandedYear")}</span>
            <input
              type="number"
              className={styles.input}
              value={disbandedYear}
              min={1850}
              max={2200}
              onChange={(event) => setDisbandedYear(event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.fileLabel}>{t("originCity")}</span>
            <input
              type="text"
              className={styles.input}
              value={originCity}
              onChange={(event) => setOriginCity(event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.fileLabel}>{t("originCountry")}</span>
            <input
              type="text"
              className={styles.input}
              value={originCountry}
              onChange={(event) => setOriginCountry(event.target.value)}
            />
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.fileLabel}>{t("bio")}</span>
          <textarea
            className={styles.textarea}
            value={bio}
            rows={4}
            onChange={(event) => setBio(event.target.value)}
          />
        </label>

        {/* Banner yalnızca KENDİ sunucumuzdaki bir yol olabilir: dış adresi
            CSP `img-src` engeller ve görsel sessizce çizilmez. Yükleme
            `/admin/uploads`a gidiyor, dönen yol kutuya yazılıyor. */}
        <label className={styles.field}>
          <span className={styles.fileLabel}>{t("banner")}</span>
          <input
            type="text"
            className={styles.input}
            value={bannerImage}
            placeholder="/uploads/…"
            onChange={(event) => setBannerImage(event.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            disabled={busy !== null}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }
              void run("banner", async () => {
                const uploaded = await uploadImage(file);
                setBannerImage(uploaded.url);
                return t("bannerUploaded");
              });
              event.target.value = "";
            }}
          />
        </label>
        <p className={styles.hint}>{t("bannerHint")}</p>

        {/* BANT ODAK NOKTASI — kullanıcı bildirimi: yüklenen poster ortadan
            kırpıldığı için yüzler görünmüyordu. İki kaydırıcı, çünkü değer
            CSS `background-position` ve iki eksenli. Serbest metin kutusu
            olsaydı backend'in kalıbına uymayan bir dize yazılabilirdi. */}
        <div className={styles.grid}>
          <label className={styles.field}>
            <span className={styles.fileLabel}>
              {t("bannerPosition")} · X {bannerX}%
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={bannerX}
              onChange={(event) => setBannerX(Number(event.target.value))}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fileLabel}>
              {t("bannerPosition")} · Y {bannerY}%
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={bannerY}
              onChange={(event) => setBannerY(Number(event.target.value))}
            />
          </label>
        </div>
        <p className={styles.hint}>{t("bannerPositionHint")}</p>

        <div className={styles.row}>
          <button
            type="button"
            className={styles.action}
            disabled={busy !== null}
            onClick={() =>
              run("info", async () => {
                await updateMusicAct(act.id, {
                  actKind,
                  formedYear: year(formedYear),
                  disbandedYear: year(disbandedYear),
                  originCity,
                  originCountry,
                  bio,
                  bannerImage,
                  bannerPosition: `${bannerX}% ${bannerY}%`,
                });
                return t("saved");
              })
            }
          >
            {busy === "info" ? t("working") : t("save")}
          </button>

          {/* Spotify'dan tazele: kimlik act'in Spotify kimliği (arşiv kimliği
              DEĞİL) — kardeş uçların aldığı kimlik farklı ve karışırsa hata
              404 olarak görünür */}
          {act.spotifyId ? (
            <button
              type="button"
              className={styles.actionQuiet}
              disabled={busy !== null}
              onClick={() =>
                run("refresh", async () => {
                  const result = await refreshMusicAct(act.spotifyId!);
                  return t("refreshed", {
                    albums: result.albumsCreated + result.albumsUpdated,
                    tracks: result.tracks,
                  });
                })
              }
            >
              {busy === "refresh" ? t("addingLong") : t("refreshFromSpotify")}
            </button>
          ) : null}

          <button
            type="button"
            className={styles.actionQuiet}
            disabled={busy !== null}
            onClick={() =>
              run("enrich", async () => {
                const result = await enrichMusicAct(act.id);
                return result.matched
                  ? t("enriched", { count: result.filled.length })
                  : t("enrichFailed", { reason: result.reason ?? "—" });
              })
            }
          >
            {busy === "enrich" ? t("working") : t("enrich")}
          </button>
        </div>

        <p className={styles.hint}>{t("enrichHint")}</p>

        {error ? <p className={styles.error}>{error}</p> : null}
        {done ? <p className={styles.ok}>{done}</p> : null}
      </section>
    </div>
  );
}
