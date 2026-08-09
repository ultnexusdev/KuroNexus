"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { ApiError, isLocalUpload } from "@/lib/api/client";
import {
  addBookQuote,
  createBookEntry,
  deleteBookEntry,
  deleteBookQuote,
  refreshBookEntry,
  searchBooks,
  updateBookEntry,
  uploadImage,
  upsertReadingGoal,
} from "@/lib/admin/api";
import type {
  ArchiveBook,
  BookListItem,
  BookArchiveStats,
  BookQuote,
  BookSearchResult,
  BookStatus,
  BookTranslation,
} from "@/lib/api/types";
import styles from "./BookCurator.module.css";

/**
 * Kitap salonunun küratör kontrolleri — yalnızca admin için, yalnızca küratör
 * modu açıkken yüklenir (BookHall'da next/dynamic ile). Ziyaretçinin
 * tarayıcısına bu dosyadan tek satır inmez.
 *
 * Kaydettikten sonra yerel durum güncellenmez, sayfa tazelenir: arşiv
 * sunucudan yeniden gelir, böylece raf sayaçları ve istatistikler tek
 * kaynaktan doğru kalır (film kanadındaki aynı karar).
 */

const STATUSES: BookStatus[] = ["READ", "READING", "TO_READ", "ABANDONED"];

const TRANSLATIONS: BookTranslation[] = [
  "TRANSLATED",
  "UNTRANSLATED",
  "IN_PROGRESS",
  "ORIGINAL",
];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Canlı aramanın bekleme süresi. 350ms ölçüme dayanıyor: Google yanıtları
 * 550–2900ms arasında geliyor, daha kısa bekleme her harfte istek atıp
 * sonuçları titretiyor, daha uzunu yazmayı bitirmiş kullanıcıyı bekletiyor.
 */
const DEBOUNCE_MS = 350;

/**
 * Bu uzunluğun altında istek atılmıyor. Sebep ölçülmüş bir gerçek: Google
 * Books bir **önek** motoru değil. "bül" araması koro düzenlemeleri,
 * "tutunamay" ise Akkoyunlular tarihi getiriyor; anlamlı sonuç ancak sözcük
 * tamamlanınca geliyor. Kısa sorguyu göndermek kotayı gürültüye harcamak
 * olurdu.
 */
const MIN_QUERY = 4;

/**
 * Listede ilk anda kaç sonuç görünür. Kalanı "daha fazla göster" ile açılıyor:
 * kaynaklar 20 kayda kadar dönebiliyor ve hepsini birden çizmek açılır listeyi
 * ekranın dışına taşırıyordu — ama kesip atmak da doğru değil, aradığı kitap
 * 11. sırada olabilir (kullanıcı isteği).
 */
const RESULT_PAGE = 10;

/** Arşive kitap ekleme şeridi: ara → seç → künyeyi gir. */
export function CuratorBar() {
  const t = useTranslations("book.curator");
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookSearchResult[] | null>(null);
  const [picked, setPicked] = useState<BookSearchResult | null>(null);
  const [status, setStatus] = useState<BookStatus>("READ");
  const [translation, setTranslation] = useState<BookTranslation>("TRANSLATED");
  const [title, setTitle] = useState("");
  const [seriesName, setSeriesName] = useState("");
  const [seriesIndex, setSeriesIndex] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState("");
  const [note, setNote] = useState("");
  const [finishedAt, setFinishedAt] = useState(today());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Klavyeyle gezinilen satır; -1 = hiçbiri seçili değil */
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  /** "Daha fazla göster"e basıldı mı — her yeni aramada sıfırlanır */
  const [showAll, setShowAll] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  /**
   * Canlı arama: Enter'a ya da "Ara"ya basmaya gerek yok.
   *
   * Üç şeye birden dikkat ediyor:
   *  - **debounce**: her harfte değil, yazma durunca istek atılır,
   *  - **iptal**: kullanıcı yazmaya devam edince önceki istek `abort` edilir.
   *    Yoksa geç dönen eski yanıt yeninin üstüne yazıp listeyi yanlış
   *    sonuçla dondurur (Google yanıtları 550–2900ms arasında değişiyor),
   *  - **kısa sorgu**: `MIN_QUERY` altında hiç istek atılmaz.
   */
  useEffect(() => {
    const trimmed = query.trim();
    if (picked || trimmed.length < MIN_QUERY) {
      setResults(null);
      setOpen(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setBusy(true);
      setError(null);
      searchBooks(trimmed, controller.signal)
        .then((found) => {
          setResults(found);
          setActive(-1);
          // Yeni sorgu yeni liste: önceki aramanın "hepsini göster"i taşınmasın
          setShowAll(false);
          setOpen(true);
        })
        .catch(() => {
          // İptal bir hata değil: kullanıcı yazmaya devam etti
          if (controller.signal.aborted) {
            return;
          }
          setError(t("searchError"));
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setBusy(false);
          }
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, picked, t]);

  /** Dışarı tıklanınca liste kapanır — açık kalıp formu örtmesin */
  useEffect(() => {
    if (!open) {
      return;
    }
    function onPointerDown(event: PointerEvent) {
      if (!boxRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const all = results ?? [];
  const visible = showAll ? all : all.slice(0, RESULT_PAGE);
  const hidden = all.length - visible.length;

  /** Yukarı/aşağı ile gezinme, Enter ile seçme, Esc ile kapatma. */
  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || visible.length === 0) {
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((current) => {
        const next = current + step;
        // Uçlarda başa/sona sarılıyor: uzun listede kaybolmayı önlüyor
        if (next < 0) return visible.length - 1;
        if (next >= visible.length) return 0;
        return next;
      });
      return;
    }
    if (event.key === "Enter" && active >= 0) {
      event.preventDefault();
      const choice = visible[active];
      if (choice && !choice.inArchive) {
        pick(choice);
      }
    }
  }

  function pick(result: BookSearchResult) {
    setPicked(result);
    setResults(null);
    setOpen(false);
    setActive(-1);
    // Türkçe ad kutusu kaynaktan gelenle dolu açılır: küratör çoğu zaman
    // yalnızca düzeltecek, sıfırdan yazmayacak
    setTitle(result.title);
    setSeriesName(result.seriesName ?? "");
    setSeriesIndex(result.seriesIndex ? String(result.seriesIndex) : "");
    // Baskı dili Türkçe değilse varsayılan "henüz çevrilmedi"
    setTranslation(result.language === "tr" ? "TRANSLATED" : "UNTRANSLATED");
  }

  function reset() {
    setPicked(null);
    setStatus("READ");
    setTranslation("TRANSLATED");
    setTitle("");
    setSeriesName("");
    setSeriesIndex("");
    setIsFavorite(false);
    setRating("");
    setNote("");
    setFinishedAt(today());
  }

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    if (!picked) {
      return;
    }
    setBusy(true);
    setError(null);
    const parsedRating = Number.parseFloat(rating.replace(",", "."));
    const parsedIndex = Number.parseInt(seriesIndex, 10);
    try {
      await createBookEntry({
        googleId: picked.googleId ?? undefined,
        olKey: picked.olKey ?? undefined,
        binKitapSlug: picked.binKitapSlug ?? undefined,
        title: title.trim() || picked.title,
        /**
         * Seçilen kaydın yazarı — künyeye yazılmıyor, **doğru kitabı bulmak
         * için**. Open Library kaydının tek kayıt ucu yok; backend künyeyi
         * ada göre arayarak tohumluyor ve yalnızca ad yeterli değil:
         * "Miras" sorgusu bambaşka bir kitap getirip onun künyesini
         * yazmıştı (kullanıcı bildirimi).
         */
        author: picked.authors[0] ?? undefined,
        status,
        translationState: translation,
        seriesName: seriesName.trim() || undefined,
        seriesIndex: Number.isFinite(parsedIndex) ? parsedIndex : undefined,
        isFavorite,
        personalRating: Number.isFinite(parsedRating) ? parsedRating : undefined,
        personalNote: note.trim() || undefined,
        // Okunmamış kitabın bitiş tarihi olmaz
        finishedAt:
          status === "READ" && finishedAt
            ? new Date(finishedAt).toISOString()
            : undefined,
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
      <p className={styles.barLede}>{t("addLede")}</p>

      {/* Canlı arama: yazmaya başlayınca liste kendiliğinden açılır, Enter
          ya da "Ara" gerekmez. Kutu ile liste aynı sarmalayıcıda çünkü liste
          mutlak konumlu ve dışarı tıklamayı bu sarmalayıcı ölçüyor */}
      <div className={styles.searchBox} ref={boxRef}>
        <input
          type="search"
          value={query}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchLabel")}
          role="combobox"
          aria-expanded={open}
          aria-controls="book-search-listbox"
          aria-autocomplete="list"
          aria-activedescendant={
            active >= 0 ? `book-search-option-${active}` : undefined
          }
          autoComplete="off"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => {
            if (visible.length > 0) {
              setOpen(true);
            }
          }}
        />
        {busy ? <span className={styles.searchSpinner} aria-hidden /> : null}

        {open && !picked ? (
          <ul
            className={styles.results}
            id="book-search-listbox"
            role="listbox"
          >
            {visible.length === 0 ? (
              <li className={styles.resultEmpty}>{t("noResults")}</li>
            ) : (
              visible.map((result, index) => (
                <li
                  key={`${result.provider}-${result.googleId ?? result.olKey ?? result.binKitapSlug ?? index}`}
                >
                  <button
                    type="button"
                    id={`book-search-option-${index}`}
                    role="option"
                    aria-selected={index === active}
                    className={
                      index === active ? styles.resultActive : styles.result
                    }
                    disabled={result.inArchive}
                    onPointerEnter={() => setActive(index)}
                    onClick={() => pick(result)}
                  >
                    <span className={styles.resultCover}>
                      {result.coverImage ? (
                        <Image
                          src={result.coverImage}
                          alt=""
                          fill
                          /* `.resultCover` sabit 34px (BookCurator.module.css) */
                          sizes="34px"
                          className={styles.resultImg}
                          /**
                           * Kitap kanadının geri kalanıyla aynı kural
                           * (2026-08-09): karar `apiUrl()`den GEÇMEMİŞ ham
                           * yoldan veriliyor — `isLocalUpload` "/uploads/"
                           * önekine bakıyor, mutlak adres verilseydi hep
                           * `false` derdi (sessiz başarısızlık).
                           *
                           * Burada sonuç pratikte `true` kalıyor ve kalmalı:
                           * arama sonuçları henüz arşive girmemiş kitaplar,
                           * kapakları 1000Kitap/Google CDN'inde duruyor ve o
                           * host'lar `next.config.ts` `remotePatterns`ta yok.
                           * Kapak ancak arşive eklenirken indirilip
                           * `/uploads/books/` altına kopyalanıyor.
                           */
                          unoptimized={!isLocalUpload(result.coverImage)}
                        />
                      ) : null}
                    </span>
                    <span className={styles.resultInfo}>
                      <span className={styles.resultTitle}>{result.title}</span>
                      <span className={styles.resultMeta}>
                        {[
                          result.authors.join(", "),
                          result.firstPublishedYear ?? result.publishedYear,
                          result.pageCount
                            ? t("pageCount", { count: result.pageCount })
                            : null,
                          /* Popülerlik ipucu: aynı eserin iki kaydı arasında
                             seçim yaparken ayırt edici oluyor. Sayının anlamı
                             kaynağa göre değişiyor — 1000Kitap'ta kaç kişinin
                             okuduğu, ötekilerde baskı/değerlendirme sayısı;
                             ikisi aynı etiketle gösterilirse yanıltıcı olur. */
                          result.popularity > 0
                            ? t(
                                result.provider === "BINKITAP"
                                  ? "readers"
                                  : "editions",
                                { count: result.popularity },
                              )
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                    {/* Kaynak rozeti: kullanıcı iki kaynağı ayırt edip
                        kapağı olanı seçebilsin diye (kullanıcı isteği) */}
                    <span
                      className={
                        result.provider === "OPENLIBRARY"
                          ? styles.srcOpenLibrary
                          : result.provider === "BINKITAP"
                            ? styles.srcBinKitap
                            : styles.srcGoogle
                      }
                      title={t(`source.${result.provider}`)}
                    >
                      {result.provider === "OPENLIBRARY"
                        ? "OL"
                        : result.provider === "BINKITAP"
                          ? "1K"
                          : "G"}
                    </span>
                    {/* Türkçe baskı rozeti: aynı kitabın hangi baskısı olduğunu
                        ayırt etmenin tek yolu */}
                    <span
                      className={
                        result.language === "tr"
                          ? styles.langTr
                          : styles.langOther
                      }
                    >
                      {(result.language ?? "?").toLocaleUpperCase("tr")}
                    </span>
                    {result.inArchive ? (
                      <span className={styles.inArchive}>{t("inArchive")}</span>
                    ) : null}
                  </button>
                </li>
              ))
            )}

            {/* Kalan sonuçlar. Liste kesilmiş olduğunu söylemeden kesmek
                "aradığım kitap yok" izlenimi veriyordu (kullanıcı isteği) */}
            {hidden > 0 ? (
              <li>
                <button
                  type="button"
                  className={styles.moreResults}
                  onClick={() => setShowAll(true)}
                >
                  {t("moreResults", { count: hidden })}
                </button>
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      {picked ? (
        <form className={styles.addForm} onSubmit={handleAdd}>
          <p className={styles.picked}>
            {picked.title}
            {picked.authors.length > 0 ? ` — ${picked.authors.join(", ")}` : ""}
            <button type="button" className={styles.ghost} onClick={reset}>
              {t("changePick")}
            </button>
          </p>

          <div className={styles.fields}>
            <label className={styles.field}>
              <span>{t("turkishTitle")}</span>
              <input
                type="text"
                value={title}
                maxLength={300}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>{t("status")}</span>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as BookStatus)
                }
              >
                {STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {t(`statusLabel.${value}`)}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>{t("translation")}</span>
              <select
                value={translation}
                onChange={(event) =>
                  setTranslation(event.target.value as BookTranslation)
                }
              >
                {TRANSLATIONS.map((value) => (
                  <option key={value} value={value}>
                    {t(`translationLabel.${value}`)}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>{t("seriesName")}</span>
              <input
                type="text"
                value={seriesName}
                maxLength={200}
                onChange={(event) => setSeriesName(event.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>{t("seriesIndex")}</span>
              <input
                type="number"
                min={0}
                max={999}
                value={seriesIndex}
                onChange={(event) => setSeriesIndex(event.target.value)}
              />
            </label>

            {status === "READ" ? (
              <label className={styles.field}>
                <span>{t("finishedAt")}</span>
                <input
                  type="date"
                  value={finishedAt}
                  onChange={(event) => setFinishedAt(event.target.value)}
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
              maxLength={1000}
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

/** Kart üstündeki hızlı işaretleme: favori, durum, sayfa ilerlemesi, sil. */
// Kart araçları listeden açılıyor; künye metnini ne okuyor ne yazıyor.
// `DossierEditor` ise metni DÜZENLİYOR, o yüzden orada `ArchiveBook` kalıyor.
export function CuratorCardTools({ book }: { book: BookListItem }) {
  const t = useTranslations("book.curator");
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
        className={book.isFavorite ? styles.favOn : styles.favOff}
        aria-pressed={book.isFavorite}
        title={book.isFavorite ? t("favoriteOn") : t("favoriteOff")}
        disabled={busy}
        onClick={() =>
          void run(() =>
            updateBookEntry(book.id, { isFavorite: !book.isFavorite }),
          )
        }
      >
        ★
      </button>

      {/* Sırada bekleyeni ya da elde olanı tek tıkla bitirir */}
      {book.status !== "READ" ? (
        <button
          type="button"
          className={styles.markRead}
          title={t("markRead")}
          disabled={busy}
          onClick={() =>
            void run(() =>
              updateBookEntry(book.id, {
                status: "READ",
                finishedAt: new Date().toISOString(),
              }),
            )
          }
        >
          ✓
        </button>
      ) : null}

      <select
        className={styles.statusSelect}
        value={book.status}
        aria-label={t("status")}
        disabled={busy}
        onChange={(event) =>
          void run(() =>
            updateBookEntry(book.id, {
              status: event.target.value as BookStatus,
            }),
          )
        }
      >
        {STATUSES.map((value) => (
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
          if (!window.confirm(t("confirmRemove", { title: book.title }))) {
            return;
          }
          void run(() => deleteBookEntry(book.id));
        }}
      >
        ✕
      </button>

      {failed ? <span className={styles.error}>{t("error")}</span> : null}
    </div>
  );
}

/**
 * Okuma ilerlemesi. Animedeki bölüm sayacının kitap karşılığı: doğrudan sayfa
 * yazılır ya da +10/+25 ile ilerlenir. Sayfa sayısı bilinmiyorsa yalnızca
 * doğrudan yazma kalıyor — yüzde çizilmiyor.
 */
export function ProgressTools({ book }: { book: BookListItem }) {
  const t = useTranslations("book.curator");
  const router = useRouter();
  const [page, setPage] = useState(String(book.currentPage));
  const [busy, setBusy] = useState(false);

  async function save(value: number) {
    setBusy(true);
    try {
      const next = Math.max(0, value);
      await updateBookEntry(book.id, {
        currentPage: next,
        // İlerleme başlayınca kitap kendiliğinden "okuyorum"a geçsin: iki ayrı
        // işlem yapmak zorunda kalmamak için
        ...(book.status === "TO_READ" && next > 0
          ? { status: "READING" as const }
          : {}),
      });
      setPage(String(next));
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.progressTools}>
      <label className={styles.pageField}>
        <span>{t("currentPage")}</span>
        <input
          type="number"
          min={0}
          max={book.pageCount ?? undefined}
          value={page}
          disabled={busy}
          onChange={(event) => setPage(event.target.value)}
          onBlur={() => {
            const parsed = Number.parseInt(page, 10);
            if (Number.isFinite(parsed) && parsed !== book.currentPage) {
              void save(parsed);
            }
          }}
        />
      </label>
      <button
        type="button"
        className={styles.stepButton}
        disabled={busy}
        onClick={() => void save(book.currentPage + 10)}
      >
        +10
      </button>
      <button
        type="button"
        className={styles.stepButton}
        disabled={busy}
        onClick={() => void save(book.currentPage + 25)}
      >
        +25
      </button>
      {book.pageCount ? (
        <button
          type="button"
          className={styles.stepButton}
          disabled={busy}
          onClick={() => void save(book.pageCount!)}
        >
          {t("finishBook")}
        </button>
      ) : null}
    </div>
  );
}

/** Yıllık okuma hedefi kurma/güncelleme — sağ rayda, küratör modunda. */
export function GoalEditor({ goal }: { goal: BookArchiveStats["goal"] }) {
  const t = useTranslations("book.curator");
  const router = useRouter();
  const [books, setBooks] = useState(goal ? String(goal.targetBooks) : "");
  const [pages, setPages] = useState(
    goal?.targetPages ? String(goal.targetPages) : "",
  );
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    const targetBooks = Number.parseInt(books, 10);
    if (!Number.isFinite(targetBooks) || targetBooks < 1) {
      return;
    }
    const targetPages = Number.parseInt(pages, 10);
    setBusy(true);
    setFailed(false);
    try {
      await upsertReadingGoal({
        targetBooks,
        targetPages: Number.isFinite(targetPages) ? targetPages : undefined,
      });
      router.refresh();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.goalForm} onSubmit={handleSave}>
      <h3 className={styles.goalTitle}>{t("goalTitle")}</h3>
      <div className={styles.goalFields}>
        <label className={styles.field}>
          <span>{t("goalBooks")}</span>
          <input
            type="number"
            min={1}
            max={1000}
            value={books}
            onChange={(event) => setBooks(event.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span>{t("goalPages")}</span>
          <input
            type="number"
            min={1}
            value={pages}
            onChange={(event) => setPages(event.target.value)}
          />
        </label>
      </div>
      <button type="submit" className={styles.primary} disabled={busy}>
        {busy ? t("saving") : t("saveGoal")}
      </button>
      {failed ? <span className={styles.error}>{t("error")}</span> : null}
    </form>
  );
}

/**
 * Alıntı defteri düzenleyicisi — kitap sayfasında.
 *
 * Alıntı kişisel içerik: hiçbir dış kaynaktan gelmiyor, tamamı elle giriliyor
 * (kural 4: dış veriden ayrı model).
 */
export function QuoteEditor({
  entryId,
  quotes,
}: {
  entryId: string;
  quotes: BookQuote[];
}) {
  const t = useTranslations("book.curator");
  const router = useRouter();
  const [text, setText] = useState("");
  const [page, setPage] = useState("");
  const [context, setContext] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    if (text.trim().length < 2) {
      return;
    }
    const parsedPage = Number.parseInt(page, 10);
    setBusy(true);
    setFailed(false);
    try {
      await addBookQuote(entryId, {
        text: text.trim(),
        page: Number.isFinite(parsedPage) ? parsedPage : undefined,
        context: context.trim() || undefined,
      });
      setText("");
      setPage("");
      setContext("");
      router.refresh();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    setBusy(true);
    try {
      await deleteBookQuote(id);
      router.refresh();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.quoteEditor}>
      <form className={styles.quoteForm} onSubmit={handleAdd}>
        <label className={styles.field}>
          <span>{t("quoteText")}</span>
          <textarea
            value={text}
            rows={3}
            maxLength={2000}
            onChange={(event) => setText(event.target.value)}
          />
        </label>
        <div className={styles.goalFields}>
          <label className={styles.field}>
            <span>{t("quotePage")}</span>
            <input
              type="number"
              min={1}
              value={page}
              onChange={(event) => setPage(event.target.value)}
            />
          </label>
          <label className={styles.field}>
            <span>{t("quoteContext")}</span>
            <input
              type="text"
              value={context}
              maxLength={300}
              onChange={(event) => setContext(event.target.value)}
            />
          </label>
        </div>
        <button type="submit" className={styles.primary} disabled={busy}>
          {busy ? t("saving") : t("addQuote")}
        </button>
        {failed ? <span className={styles.error}>{t("error")}</span> : null}
      </form>

      {quotes.length > 0 ? (
        <ul className={styles.quoteAdminList}>
          {quotes.map((quote) => (
            <li key={quote.id} className={styles.quoteAdminRow}>
              <span className={styles.quoteAdminText}>{quote.text}</span>
              <button
                type="button"
                className={styles.remove}
                title={t("removeQuote")}
                disabled={busy}
                onClick={() => void handleDelete(quote.id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * Kitap sayfasındaki künye düzeltme formu — Türkçe ad, çevirmen, yayıncı ve
 * **kapak**.
 *
 * Kapak alanı süs değil, zorunluluk: Türkçe basılı çevirilerin çoğunun
 * kapağı ne Google Books'ta ne Open Library'de var (ikisi de o baskıyı
 * yalnızca künye olarak tutuyor). Kapağı olmayan kitap için tek yol elle
 * adres yapıştırmak ya da görsel yüklemek.
 */
export function DossierEditor({ book }: { book: ArchiveBook }) {
  const t = useTranslations("book.curator");
  const router = useRouter();
  const [title, setTitle] = useState(book.title);
  const [coverImage, setCoverImage] = useState(book.coverImage ?? "");
  const [uploading, setUploading] = useState(false);
  const [originalTitle, setOriginalTitle] = useState(book.originalTitle ?? "");
  const [translator, setTranslator] = useState(book.translator ?? "");
  const [publisher, setPublisher] = useState(book.publisher ?? "");
  const [pageCount, setPageCount] = useState(
    book.pageCount ? String(book.pageCount) : "",
  );
  const [seriesName, setSeriesName] = useState(book.seriesName ?? "");
  const [seriesIndex, setSeriesIndex] = useState(
    book.seriesIndex !== null ? String(book.seriesIndex) : "",
  );
  const [translation, setTranslation] = useState<BookTranslation>(
    book.translationState,
  );
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<"idle" | "saved" | "error">("idle");

  /** Yüklenen görselin adresi kutuya düşer; kaydetmek yine "Kaydet" ile. */
  async function handleUpload(file: File) {
    setUploading(true);
    setState("idle");
    try {
      const result = await uploadImage(file);
      setCoverImage(result.url);
    } catch {
      setState("error");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setState("idle");
    const parsedPages = Number.parseInt(pageCount, 10);
    const parsedIndex = Number.parseInt(seriesIndex, 10);
    try {
      await updateBookEntry(book.id, {
        title: title.trim() || book.title,
        coverImage: coverImage.trim(),
        originalTitle: originalTitle.trim(),
        translator: translator.trim(),
        publisher: publisher.trim(),
        pageCount: Number.isFinite(parsedPages) ? parsedPages : undefined,
        seriesName: seriesName.trim(),
        seriesIndex: Number.isFinite(parsedIndex) ? parsedIndex : undefined,
        translationState: translation,
      });
      setState("saved");
      router.refresh();
    } catch {
      setState("error");
    } finally {
      setBusy(false);
    }
  }

  async function handleRefresh() {
    setBusy(true);
    setState("idle");
    try {
      await refreshBookEntry(book.id);
      router.refresh();
    } catch {
      setState("error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.dossier} onSubmit={handleSave}>
      <div className={styles.fields}>
        <label className={styles.field}>
          <span>{t("turkishTitle")}</span>
          <input
            type="text"
            value={title}
            maxLength={300}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span>{t("originalTitle")}</span>
          <input
            type="text"
            value={originalTitle}
            maxLength={300}
            onChange={(event) => setOriginalTitle(event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>{t("coverField")}</span>
          <input
            type="text"
            value={coverImage}
            disabled={uploading}
            placeholder="https://…"
            onChange={(event) => setCoverImage(event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>{uploading ? t("uploading") : t("coverUpload")}</span>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void handleUpload(file);
              }
            }}
          />
        </label>
        <label className={styles.field}>
          <span>{t("translator")}</span>
          <input
            type="text"
            value={translator}
            maxLength={200}
            onChange={(event) => setTranslator(event.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span>{t("publisher")}</span>
          <input
            type="text"
            value={publisher}
            maxLength={200}
            onChange={(event) => setPublisher(event.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span>{t("pageCountField")}</span>
          <input
            type="number"
            min={1}
            value={pageCount}
            onChange={(event) => setPageCount(event.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span>{t("seriesName")}</span>
          <input
            type="text"
            value={seriesName}
            maxLength={200}
            onChange={(event) => setSeriesName(event.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span>{t("seriesIndex")}</span>
          <input
            type="number"
            min={0}
            max={999}
            value={seriesIndex}
            onChange={(event) => setSeriesIndex(event.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span>{t("translation")}</span>
          <select
            value={translation}
            onChange={(event) =>
              setTranslation(event.target.value as BookTranslation)
            }
          >
            {TRANSLATIONS.map((value) => (
              <option key={value} value={value}>
                {t(`translationLabel.${value}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.addActions}>
        <button type="submit" className={styles.primary} disabled={busy}>
          {busy ? t("saving") : t("save")}
        </button>
        {/* Tazeleme yalnızca BOŞ alanları doldurur; elle yazdığın hiçbir şey
            değişmez (backend kararı) */}
        <button
          type="button"
          className={styles.ghost}
          disabled={busy}
          onClick={() => void handleRefresh()}
        >
          {t("refresh")}
        </button>
        {state === "saved" ? (
          <span className={styles.saved}>{t("saved")}</span>
        ) : null}
        {state === "error" ? (
          <span className={styles.error}>{t("error")}</span>
        ) : null}
      </div>
    </form>
  );
}
