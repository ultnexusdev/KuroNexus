"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "@/lib/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { tmdbImage } from "@/lib/api/tmdb";
import type { TmdbSearchResult } from "@/lib/api/types";
import { today } from "@/lib/format";
import styles from "./TmdbCurator.module.css";

/**
 * TMDB'den beslenen salonların (film, dizi) ortak küratör kontrolleri — D-F2.
 *
 * `FilmCurator.tsx` ile `ShowCurator.tsx` 2 Eylül 2026'ya kadar ~600 satırlık
 * iki kopyaydı; fark yalnızca kaynak uçlar, durum listesi ve sözlük ad alanı.
 * Üçü de `TmdbCuratorWing` ile dışarıdan geliyor; bu dosya salon bilmez.
 *
 * Sözlük ad alanı da dışarıdan `t` olarak gelir: `scripts/check-i18n-client.mjs`
 * `useTranslations("...")` argümanının literal olmasını zorunlu tutuyor
 * (bütçe statik analizle kurulur). Bu yüzden `useTranslations` burada değil,
 * salonun ince sarmalayıcısında çağrılır ve sonucu buraya prop'la iner.
 *
 * Yalnızca admin için, yalnızca küratör modu açıkken yüklenir (salonlarda
 * next/dynamic ile). Ziyaretçinin tarayıcısına bu dosyadan tek satır inmez.
 *
 * Kaydettikten sonra yerel durum güncellenmez, sayfa tazelenir: arşiv sunucudan
 * yeniden gelir, böylece raf sayaçları/istatistikler tek kaynaktan doğru kalır.
 */

/**
 * `useTranslations("…")` çıktısı — sarmalayıcıdan gelir, burada üretilmez.
 * Bilerek gevşek: `statusLabel.${S}` gibi jenerik anahtarları next-intl'in
 * şablon tipi çözemiyor; anahtar kümesi zaten iki salonda birebir aynı
 * (`check:i18n` + sözlük karşılaştırması, 2 Eylül 2026).
 */
export type Translator = (
  key: string,
  values?: Record<string, string | number>,
) => string;

/** Salonun arşive yazarken kullandığı asgari kayıt biçimi. */
export interface TmdbCuratorEntryInput<S extends string> {
  tmdbId: number;
  status?: S;
  isFavorite?: boolean;
  personalRating?: number;
  personalNote?: string;
  watchedAt?: string;
}

/** Kart araçlarının bir kayıttan okuduğu alanlar (`ArchiveMovie`/`ArchiveShow`). */
export interface TmdbCuratorEntry<S extends string> {
  id: string;
  title: string;
  status: S;
  isFavorite: boolean;
}

/**
 * Salonun kimliği: durum kümesi + admin uçları. `watched` ve `watchlist`
 * ayrıca adlandırılıyor çünkü akış bu ikisine özel davranır (sırada
 * bekleyene tarih yazılmaz, tek tıkla izlenmişe taşınır).
 */
export interface TmdbCuratorWing<S extends string> {
  statuses: readonly S[];
  watched: S;
  watchlist: S;
  search(query: string): Promise<TmdbSearchResult[]>;
  create(input: TmdbCuratorEntryInput<S>): Promise<unknown>;
  update(
    id: string,
    input: Partial<Omit<TmdbCuratorEntryInput<S>, "tmdbId">>,
  ): Promise<unknown>;
  remove(id: string): Promise<unknown>;
  suggestions(): Promise<TmdbSearchResult[]>;
  dismiss(tmdbId: number): Promise<unknown>;
  restore(tmdbId: number): Promise<unknown>;
}

interface WingProps<S extends string> {
  wing: TmdbCuratorWing<S>;
  t: Translator;
}

/**
 * Öneriler rafı havuzun **tamamını** gösterir (kullanıcı kararı): havuz zaten
 * arşivde olanlar ve elenenler ayıklanmış hâlde geliyor, onda birini
 * göstermek listeyi yapay olarak kısaltıyordu. Sıra her açılışta karışıyor —
 * hep aynı yapımlarla karşılaşmamak için.
 */

/** Arşive ekleme şeridi: TMDB'de ara → seç → künyeyi gir. */
export function TmdbCuratorBar<S extends string>({ wing, t }: WingProps<S>) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbSearchResult[] | null>(null);
  const [picked, setPicked] = useState<TmdbSearchResult | null>(null);
  const [status, setStatus] = useState<S>(wing.watched);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState("");
  const [note, setNote] = useState("");
  const [watchedAt, setWatchedAt] = useState(today());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      setResults(await wing.search(query));
    } catch {
      setError(t("searchError"));
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setPicked(null);
    setStatus(wing.watched);
    setIsFavorite(false);
    setRating("");
    setNote("");
    setWatchedAt(today());
  }

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    if (!picked) {
      return;
    }
    setBusy(true);
    setError(null);
    const parsedRating = Number.parseFloat(rating.replace(",", "."));
    try {
      await wing.create({
        tmdbId: picked.tmdbId,
        status,
        isFavorite,
        personalRating: Number.isFinite(parsedRating) ? parsedRating : undefined,
        personalNote: note.trim() || undefined,
        // Sırada bekleyen yapım henüz izlenmedi — tarih yazmak yanlış olur
        watchedAt:
          status === wing.watchlist || !watchedAt
            ? undefined
            : new Date(watchedAt).toISOString(),
      });
      reset();
      setQuery("");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 409
          ? t("duplicate")
          : t("error"),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.bar}>
      <h2 className={styles.barTitle}>{t("addTitle")}</h2>

      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          type="search"
          value={query}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchLabel")}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit" className={styles.primary} disabled={busy}>
          {busy ? t("searching") : t("search")}
        </button>
      </form>

      {error ? <p className={styles.error}>{error}</p> : null}

      {results !== null && !picked ? (
        results.length === 0 ? (
          <p className={styles.muted}>{t("noResults")}</p>
        ) : (
          <ul className={styles.results}>
            {results.slice(0, 8).map((result) => {
              const poster = tmdbImage(result.posterPath, "w185");
              return (
                <li key={result.tmdbId}>
                  <button
                    type="button"
                    className={styles.result}
                    onClick={() => {
                      setPicked(result);
                      setResults(null);
                    }}
                  >
                    <span className={styles.resultPoster}>
                      {poster ? (
                        <Image
                          src={poster}
                          alt=""
                          fill
                          sizes="48px"
                          className={styles.resultImg}
                          unoptimized
                        />
                      ) : null}
                    </span>
                    <span className={styles.resultInfo}>
                      <span className={styles.resultTitle}>{result.title}</span>
                      <span className={styles.resultMeta}>
                        {result.releaseDate?.slice(0, 4) ?? "—"}
                        {result.voteAverage
                          ? ` · TMDB ${result.voteAverage.toFixed(1)}`
                          : ""}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )
      ) : null}

      {picked ? (
        <form className={styles.addForm} onSubmit={handleAdd}>
          <p className={styles.picked}>
            {picked.title}
            {picked.releaseDate ? ` (${picked.releaseDate.slice(0, 4)})` : ""}
          </p>

          <div className={styles.fields}>
            <label className={styles.field}>
              <span>{t("status")}</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as S)}
              >
                {wing.statuses.map((value) => (
                  <option key={value} value={value}>
                    {t(`statusLabel.${value}`)}
                  </option>
                ))}
              </select>
            </label>

            {status !== wing.watchlist ? (
              <label className={styles.field}>
                <span>{t("watchedAt")}</span>
                <input
                  type="date"
                  value={watchedAt}
                  onChange={(event) => setWatchedAt(event.target.value)}
                />
              </label>
            ) : null}

            <label className={styles.field}>
              <span>{t("rating")}</span>
              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={rating}
                onChange={(event) => setRating(event.target.value)}
              />
            </label>
          </div>

          <label className={styles.field}>
            <span>{t("note")}</span>
            <textarea
              value={note}
              rows={2}
              maxLength={500}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>

          <label className={styles.checkField}>
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(event) => setIsFavorite(event.target.checked)}
            />
            <span>{t("markFavorite")}</span>
          </label>

          <div className={styles.addActions}>
            <button type="submit" className={styles.primary} disabled={busy}>
              {busy ? t("saving") : t("add")}
            </button>
            <button type="button" className={styles.ghost} onClick={reset}>
              {t("cancel")}
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}

/**
 * Öneriler rafı — küratör modunun "aramadan ekle" yolu.
 *
 * **Liste yalnızca "Yenile" ile değişir.** Bir yapıma "İzledim" demek ya da
 * elemek kartı yerinde bırakır, sadece görünümünü değiştirir; art arda birkaç
 * yapım işaretleyebilmek için böyle (kullanıcı geri bildirimi). Sayfanın geri
 * kalanı da o sırada tazelenmez — arşiv tazelemesi Yenile'ye ertelenir.
 *
 * **Eleme kalıcıdır**: sunucuya yazılır, elenen yapım havuza bir daha girmez
 * (yanlışlıkla elendiyse aynı düğme geri alır). Havuz (~60 yapım, tür ve dönem
 * taramasıyla geniş) bir kez çekilir, onluk seçim istemcide yapılır: her
 * yenilemede TMDB'ye gidilmez. Arşivde olanlar havuza zaten girmiyor.
 */
export function TmdbSuggestionShelf<S extends string>({
  wing,
  t,
}: WingProps<S>) {
  const router = useRouter();

  const [pool, setPool] = useState<TmdbSearchResult[]>([]);
  const [shown, setShown] = useState<TmdbSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Bu turda elden geçenler: eklenenler ve elenenler. Liste bunlar yüzünden
  // DEĞİŞMEZ — kartlar yerinde durur, yalnızca görünümleri değişir. Böylece
  // arka arkaya birkaç yapım işaretlenebilir; yenileme kullanıcının elinde.
  const [added, setAdded] = useState<Set<number>>(new Set());
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  /** Havuzun tamamını karışık sırayla dizer. */
  const draw = useCallback((from: TmdbSearchResult[]) => {
    const copy = [...from];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShown(copy);
  }, []);

  const { suggestions } = wing;
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const items = await suggestions();
        if (!cancelled) {
          setPool(items);
          draw(items);
        }
      } catch {
        if (!cancelled) {
          setError(t("error"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [draw, suggestions, t]);

  /**
   * Eleme/geri alma. Kart yerinde kalır, sönükleşir; liste kaymaz.
   *
   * Eleme **sunucuya yazılır**: yapım öneri havuzundan kalıcı olarak düşer,
   * sayfa yenilense de bir daha gelmez. Yanlışlıkla elendiyse aynı düğme
   * geri alır. Arşiv etkilenmez — istenirse arama ile eklenebilir.
   */
  async function toggleDismiss(tmdbId: number) {
    const isDismissed = dismissed.has(tmdbId);
    setBusyId(tmdbId);
    setError(null);
    // İyimser güncelleme: kart hemen tepki versin, hata olursa geri alınır
    setDismissed((current) => {
      const next = new Set(current);
      if (isDismissed) {
        next.delete(tmdbId);
      } else {
        next.add(tmdbId);
      }
      return next;
    });
    try {
      if (isDismissed) {
        await wing.restore(tmdbId);
      } else {
        await wing.dismiss(tmdbId);
      }
    } catch {
      setDismissed((current) => {
        const next = new Set(current);
        if (isDismissed) {
          next.add(tmdbId);
        } else {
          next.delete(tmdbId);
        }
        return next;
      });
      setError(t("error"));
    } finally {
      setBusyId(null);
    }
  }

  /**
   * Yenile: elden geçenleri havuzdan düşürüp kalanı yeniden karar ve arşivi
   * tazeler — eklediğin yapımlar sayfanın alt bölümlerine burada yansır.
   */
  function refresh() {
    const touched = new Set([...added, ...dismissed]);
    const next = pool.filter((item) => !touched.has(item.tmdbId));
    setPool(next);
    setAdded(new Set());
    setDismissed(new Set());
    draw(next);
    router.refresh();
  }

  async function add(item: TmdbSearchResult, status: S) {
    setBusyId(item.tmdbId);
    setError(null);
    try {
      await wing.create({
        tmdbId: item.tmdbId,
        status,
        // Sırada bekleyen yapım henüz izlenmedi — tarih yazmak yanlış olur
        watchedAt:
          status === wing.watchlist ? undefined : new Date().toISOString(),
      });
      // Kart listede kalır, "eklendi" olarak işaretlenir (router.refresh YOK)
      setAdded((current) => new Set(current).add(item.tmdbId));
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 409
          ? t("duplicate")
          : t("error"),
      );
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <section className={styles.suggestions}>
        <h2 className={styles.suggestionsTitle}>{t("title")}</h2>
        <p className={styles.muted}>{t("loading")}</p>
      </section>
    );
  }

  return (
    <section className={styles.suggestions}>
      <h2 className={styles.suggestionsTitle}>{t("title")}</h2>
      <p className={styles.suggestionsLede}>{t("lede")}</p>

      {error ? <p className={styles.error}>{error}</p> : null}

      {shown.length === 0 ? (
        <p className={styles.muted}>{t("empty")}</p>
      ) : (
        <ul className={styles.suggestionGrid}>
          {shown.map((item) => {
            const poster = tmdbImage(item.posterPath, "w342");
            const busy = busyId === item.tmdbId;
            const isAdded = added.has(item.tmdbId);
            const isDismissed = dismissed.has(item.tmdbId);
            const done = isAdded || isDismissed;
            return (
              <li
                key={item.tmdbId}
                className={done ? styles.suggestionDone : styles.suggestion}
              >
                <div className={styles.suggestionPoster}>
                  {poster ? (
                    <Image
                      src={poster}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 45vw, 160px"
                      className={styles.resultImg}
                      unoptimized
                    />
                  ) : null}
                  {/* Eklenmiş yapımda eleme anlamsız; elenmişte aynı düğme geri alır */}
                  {!isAdded ? (
                    <button
                      type="button"
                      className={styles.dismiss}
                      title={isDismissed ? t("undo") : t("dismiss")}
                      aria-label={isDismissed ? t("undo") : t("dismiss")}
                      aria-pressed={isDismissed}
                      disabled={busy}
                      onClick={() => void toggleDismiss(item.tmdbId)}
                    >
                      {isDismissed ? "↩" : "✕"}
                    </button>
                  ) : null}
                </div>
                <p className={styles.suggestionTitle}>{item.title}</p>
                <p className={styles.suggestionMeta}>
                  <span>{item.releaseDate?.slice(0, 4) ?? "—"}</span>
                  {item.voteAverage ? (
                    <span className={styles.suggestionScore}>
                      {item.voteAverage.toFixed(1)}
                    </span>
                  ) : null}
                </p>
                {done ? (
                  <p className={styles.suggestionState}>
                    {isAdded ? t("added") : t("dismissed")}
                  </p>
                ) : (
                  <div className={styles.suggestionActions}>
                    <button
                      type="button"
                      className={styles.addWatched}
                      disabled={busy}
                      onClick={() => void add(item, wing.watched)}
                    >
                      {t("addWatched")}
                    </button>
                    <button
                      type="button"
                      className={styles.addWatchlist}
                      disabled={busy}
                      onClick={() => void add(item, wing.watchlist)}
                    >
                      {t("addWatchlist")}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className={styles.suggestionFooter}>
        <button type="button" className={styles.primary} onClick={refresh}>
          {t("refresh")}
        </button>
        {added.size > 0 ? (
          <span className={styles.suggestionPending}>
            {t("pending", { count: added.size })}
          </span>
        ) : null}
        <span className={styles.muted}>
          {t("poolLeft", { count: pool.length })}
        </span>
      </div>
    </section>
  );
}

/** Poster altındaki hızlı kontroller: favori, durum, arşivden çıkarma. */
export function TmdbCuratorCardTools<S extends string>({
  wing,
  t,
  entry,
}: WingProps<S> & { entry: TmdbCuratorEntry<S> }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setFailed(false);
    try {
      await action();
      router.refresh();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.tools}>
      <button
        type="button"
        className={entry.isFavorite ? styles.favOn : styles.favOff}
        aria-pressed={entry.isFavorite}
        title={entry.isFavorite ? t("favoriteOn") : t("favoriteOff")}
        disabled={busy}
        onClick={() =>
          void run(() =>
            wing.update(entry.id, { isFavorite: !entry.isFavorite }),
          )
        }
      >
        ★
      </button>

      {/* Sırada bekleyeni tek tıkla izlenmişe taşır — tarih bugün düşer */}
      {entry.status === wing.watchlist ? (
        <button
          type="button"
          className={styles.markWatched}
          title={t("markWatched")}
          disabled={busy}
          onClick={() =>
            void run(() =>
              wing.update(entry.id, {
                status: wing.watched,
                watchedAt: new Date().toISOString(),
              }),
            )
          }
        >
          ✓
        </button>
      ) : null}

      <select
        className={styles.statusSelect}
        value={entry.status}
        aria-label={t("status")}
        disabled={busy}
        onChange={(event) =>
          void run(() =>
            wing.update(entry.id, { status: event.target.value as S }),
          )
        }
      >
        {wing.statuses.map((value) => (
          <option key={value} value={value}>
            {t(`statusLabel.${value}`)}
          </option>
        ))}
      </select>

      <button
        type="button"
        className={styles.remove}
        title={t("remove")}
        disabled={busy}
        onClick={() => {
          if (!window.confirm(t("confirmRemove", { title: entry.title }))) {
            return;
          }
          void run(() => wing.remove(entry.id));
        }}
      >
        ✕
      </button>

      {failed ? <span className={styles.toolError}>{t("error")}</span> : null}
    </div>
  );
}
