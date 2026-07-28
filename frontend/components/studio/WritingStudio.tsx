"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import {
  createStory,
  createWikiEntry,
  deleteStory,
  deleteWikiEntry,
  fetchAdminStories,
  fetchAdminStory,
  fetchAdminUniverses,
  fetchAdminWikiEntries,
  fetchAdminWikiEntry,
  reorderStories,
  updateStory,
  updateWikiEntry,
} from "@/lib/admin/api";
import type {
  AdminWikiEntrySummary,
  StorySummary,
  WikiCategory,
  WikiUniverseSummary,
} from "@/lib/api/types";
import { legacyPlainTextToHtml } from "@/lib/content/legacyPlainTextToHtml";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import styles from "./WritingStudio.module.css";

const CATEGORY_ORDER: WikiCategory[] = [
  "CHARACTER",
  "LOCATION",
  "TERM",
  "EVENT",
  "ITEM",
  "ORGANIZATION",
  "MAGIC_SYSTEM",
];

const AUTOSAVE_DELAY_MS = 1500;

type NodeKind = "chapter" | "element";

interface SelectedNode {
  kind: NodeKind;
  id: string;
}

// Bölüm ve wiki kaydı tek editörle yazılır; künye alanları tipe göre değişir.
interface Draft {
  title: string;
  content: string;
  excerpt: string;
  isPublished: boolean;
  category: WikiCategory;
  spoilerTier: string;
}

type SaveState = "idle" | "saving" | "saved" | "error";

// Mobilde üç sütun tek sütuna iner; alt şeritten sütun seçilir.
type MobilePane = "tree" | "editor" | "dossier";

function countWords(html: string): number {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();
  if (!text) {
    return 0;
  }
  return text.split(/\s+/).length;
}

export function WritingStudio({ universeSlug }: { universeSlug: string }) {
  const t = useTranslations("admin.studio");
  const tCategories = useTranslations("wiki.categories");

  const [universe, setUniverse] = useState<WikiUniverseSummary | null>(null);
  const [chapters, setChapters] = useState<StorySummary[]>([]);
  const [elements, setElements] = useState<AdminWikiEntrySummary[]>([]);
  const [selected, setSelected] = useState<SelectedNode | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [loadError, setLoadError] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [mobilePane, setMobilePane] = useState<MobilePane>("tree");
  const [busy, setBusy] = useState(false);

  // Otomatik kayıt kapanış/geçiş anında son hâli göndersin diye ref'te tutulur
  const draftRef = useRef<Draft | null>(null);
  const selectedRef = useRef<SelectedNode | null>(null);
  draftRef.current = draft;
  selectedRef.current = selected;

  const load = useCallback(async () => {
    setLoadError(false);
    try {
      const universes = await fetchAdminUniverses();
      const found = universes.find((item) => item.slug === universeSlug);
      if (!found) {
        setLoadError(true);
        return;
      }
      setUniverse(found);
      const [storyList, entryList] = await Promise.all([
        fetchAdminStories(found.id),
        fetchAdminWikiEntries(found.id),
      ]);
      setChapters(storyList);
      setElements(entryList);
    } catch {
      setLoadError(true);
    }
  }, [universeSlug]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(async (): Promise<void> => {
    const node = selectedRef.current;
    const current = draftRef.current;
    if (!node || !current) {
      return;
    }
    setDirty(false);
    setSaveState("saving");
    try {
      if (node.kind === "chapter") {
        await updateStory(node.id, {
          title: current.title,
          content: current.content,
          excerpt: current.excerpt || undefined,
          isPublished: current.isPublished,
        });
        setChapters((list) =>
          list.map((item) =>
            item.id === node.id
              ? {
                  ...item,
                  title: current.title,
                  isPublished: current.isPublished,
                }
              : item,
          ),
        );
      } else {
        const tier = Number.parseInt(current.spoilerTier, 10);
        await updateWikiEntry(node.id, {
          title: current.title,
          content: current.content,
          category: current.category,
          spoilerTier: Number.isFinite(tier) && tier > 0 ? tier : undefined,
        });
        setElements((list) =>
          list.map((item) =>
            item.id === node.id
              ? { ...item, title: current.title, category: current.category }
              : item,
          ),
        );
      }
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }, []);

  // Yazım durunca otomatik kayıt — kaydet düğmesi aramaya gerek yok
  useEffect(() => {
    if (!dirty) {
      return;
    }
    const timer = setTimeout(() => {
      void save();
    }, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [dirty, draft, save]);

  const openNode = useCallback(
    async (node: SelectedNode) => {
      if (dirty) {
        await save();
      }
      setBusy(true);
      setSaveState("idle");
      try {
        if (node.kind === "chapter") {
          const story = await fetchAdminStory(node.id);
          setDraft({
            title: story.title,
            content: story.content ? legacyPlainTextToHtml(story.content) : "",
            excerpt: story.excerpt ?? "",
            isPublished: story.isPublished,
            category: "CHARACTER",
            spoilerTier: "",
          });
        } else {
          const entry = await fetchAdminWikiEntry(node.id);
          setDraft({
            title: entry.title,
            content: entry.content ? legacyPlainTextToHtml(entry.content) : "",
            excerpt: "",
            isPublished: true,
            category: entry.category,
            spoilerTier: entry.spoilerTier ? String(entry.spoilerTier) : "",
          });
        }
        setSelected(node);
        setDirty(false);
        setMobilePane("editor");
      } catch {
        setLoadError(true);
      } finally {
        setBusy(false);
      }
    },
    [dirty, save],
  );

  function patchDraft(patch: Partial<Draft>) {
    setDraft((current) => (current ? { ...current, ...patch } : current));
    setDirty(true);
  }

  async function handleNewChapter() {
    if (!universe) {
      return;
    }
    setBusy(true);
    try {
      const story = await createStory({
        title: t("newChapterTitle"),
        content: "<p></p>",
        universeId: universe.id,
      });
      setChapters((list) => [...list, story]);
      await openNode({ kind: "chapter", id: story.id });
    } catch {
      setLoadError(true);
    } finally {
      setBusy(false);
    }
  }

  async function handleNewElement(category: WikiCategory) {
    if (!universe) {
      return;
    }
    setBusy(true);
    try {
      const entry = await createWikiEntry({
        title: t("newElementTitle"),
        content: "<p></p>",
        category,
        universeId: universe.id,
      });
      const summary: AdminWikiEntrySummary = {
        id: entry.id,
        title: entry.title,
        slug: entry.slug,
        category: entry.category,
        coverImage: entry.coverImage,
        spoilerTier: entry.spoilerTier,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
        universe: { id: universe.id, name: universe.name, slug: universe.slug },
      };
      setElements((list) => [...list, summary]);
      await openNode({ kind: "element", id: entry.id });
    } catch {
      setLoadError(true);
    } finally {
      setBusy(false);
    }
  }

  async function handleMoveChapter(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= chapters.length) {
      return;
    }
    const next = [...chapters];
    [next[index], next[target]] = [next[target], next[index]];
    setChapters(next);
    try {
      await reorderStories(next.map((item) => item.id));
    } catch {
      setLoadError(true);
      await load();
    }
  }

  async function handleDeleteNode() {
    const node = selected;
    const current = draft;
    if (!node || !current) {
      return;
    }
    if (!window.confirm(t("confirmDelete", { title: current.title }))) {
      return;
    }
    setBusy(true);
    try {
      if (node.kind === "chapter") {
        await deleteStory(node.id);
        setChapters((list) => list.filter((item) => item.id !== node.id));
      } else {
        await deleteWikiEntry(node.id);
        setElements((list) => list.filter((item) => item.id !== node.id));
      }
      setSelected(null);
      setDraft(null);
      setDirty(false);
      setSaveState("idle");
      setMobilePane("tree");
    } catch {
      setLoadError(true);
    } finally {
      setBusy(false);
    }
  }

  const wordCount = useMemo(
    () => (draft ? countWords(draft.content) : 0),
    [draft],
  );

  const elementsByCategory = useMemo(() => {
    const map = new Map<WikiCategory, AdminWikiEntrySummary[]>();
    for (const category of CATEGORY_ORDER) {
      map.set(
        category,
        elements
          .filter((entry) => entry.category === category)
          .sort((a, b) => a.title.localeCompare(b.title)),
      );
    }
    return map;
  }, [elements]);

  const saveLabel =
    saveState === "saving"
      ? t("saving")
      : saveState === "error"
        ? t("saveError")
        : dirty
          ? t("unsaved")
          : saveState === "saved"
            ? t("saved")
            : "";

  const selectedChapterIndex = selected
    ? chapters.findIndex((item) => item.id === selected.id)
    : -1;

  return (
    <div
      className={`${styles.studio} ${focusMode ? styles.focused : ""}`}
      data-pane={mobilePane}
    >
      <header className={styles.topBar}>
        <div className={styles.topLeft}>
          <Link href="/admin" className={styles.backLink}>
            {t("back")}
          </Link>
          <h1 className={styles.workTitle}>{universe?.name ?? t("title")}</h1>
        </div>
        <div className={styles.topRight}>
          {saveLabel ? (
            <span
              className={
                saveState === "error" ? styles.statusError : styles.status
              }
              role="status"
            >
              {saveLabel}
            </span>
          ) : null}
          <button
            type="button"
            className={styles.topButton}
            aria-pressed={focusMode}
            onClick={() => setFocusMode((value) => !value)}
          >
            {focusMode ? t("focusOff") : t("focusOn")}
          </button>
        </div>
      </header>

      {loadError ? <p className={styles.error}>{t("loadError")}</p> : null}

      <div className={styles.columns}>
        {/* Sol: el yazması ağacı + evren kayıtları */}
        <aside className={styles.tree} aria-label={t("treeAria")}>
          <div className={styles.treeGroup}>
            <div className={styles.treeGroupHead}>
              <span className={styles.treeGroupTitle}>{t("manuscript")}</span>
              <button
                type="button"
                className={styles.addButton}
                aria-label={t("newChapter")}
                title={t("newChapter")}
                disabled={busy || !universe}
                onClick={() => void handleNewChapter()}
              >
                +
              </button>
            </div>
            {chapters.length === 0 ? (
              <p className={styles.treeEmpty}>{t("noChapters")}</p>
            ) : (
              <ul className={styles.treeList}>
                {chapters.map((chapter, index) => {
                  const isActive =
                    selected?.kind === "chapter" && selected.id === chapter.id;
                  return (
                    <li key={chapter.id}>
                      <div
                        className={
                          isActive ? styles.treeRowActive : styles.treeRow
                        }
                      >
                        <button
                          type="button"
                          className={styles.treeItem}
                          onClick={() =>
                            void openNode({ kind: "chapter", id: chapter.id })
                          }
                        >
                          <span className={styles.chapterNo}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className={styles.treeItemText}>
                            {chapter.title}
                          </span>
                          {!chapter.isPublished ? (
                            <span
                              className={styles.draftDot}
                              title={t("draft")}
                              aria-label={t("draft")}
                            />
                          ) : null}
                        </button>
                        {isActive ? (
                          <span className={styles.moveGroup}>
                            <button
                              type="button"
                              className={styles.moveButton}
                              aria-label={t("moveUp")}
                              title={t("moveUp")}
                              disabled={index === 0}
                              onClick={() => void handleMoveChapter(index, -1)}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              className={styles.moveButton}
                              aria-label={t("moveDown")}
                              title={t("moveDown")}
                              disabled={index === chapters.length - 1}
                              onClick={() => void handleMoveChapter(index, 1)}
                            >
                              ↓
                            </button>
                          </span>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {CATEGORY_ORDER.map((category) => {
            const group = elementsByCategory.get(category) ?? [];
            return (
              <div key={category} className={styles.treeGroup}>
                <div className={styles.treeGroupHead}>
                  <span className={styles.treeGroupTitle}>
                    {tCategories(category)}
                  </span>
                  <span className={styles.treeCount}>{group.length}</span>
                  <button
                    type="button"
                    className={styles.addButton}
                    aria-label={t("newElement")}
                    title={t("newElement")}
                    disabled={busy || !universe}
                    onClick={() => void handleNewElement(category)}
                  >
                    +
                  </button>
                </div>
                {group.length > 0 ? (
                  <ul className={styles.treeList}>
                    {group.map((entry) => {
                      const isActive =
                        selected?.kind === "element" &&
                        selected.id === entry.id;
                      return (
                        <li key={entry.id}>
                          <div
                            className={
                              isActive ? styles.treeRowActive : styles.treeRow
                            }
                          >
                            <button
                              type="button"
                              className={styles.treeItem}
                              onClick={() =>
                                void openNode({
                                  kind: "element",
                                  id: entry.id,
                                })
                              }
                            >
                              <span className={styles.treeItemText}>
                                {entry.title}
                              </span>
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </aside>

        {/* Orta: yazım alanı */}
        <section className={styles.desk} aria-label={t("deskAria")}>
          {draft && selected ? (
            <>
              <input
                type="text"
                className={styles.deskTitle}
                value={draft.title}
                maxLength={200}
                aria-label={t("nodeTitle")}
                onChange={(event) => patchDraft({ title: event.target.value })}
              />
              <RichTextEditor
                key={`${selected.kind}:${selected.id}`}
                content={draft.content}
                onChange={(html) => patchDraft({ content: html })}
              />
            </>
          ) : (
            <p className={styles.deskEmpty}>{t("pickNode")}</p>
          )}
        </section>

        {/* Sağ: künye paneli */}
        <aside className={styles.dossier} aria-label={t("dossierAria")}>
          {draft && selected ? (
            <>
              <p className={styles.dossierKind}>
                {selected.kind === "chapter"
                  ? t("chapterDossier")
                  : t("elementDossier")}
              </p>

              {selected.kind === "chapter" ? (
                <>
                  <label className={styles.field}>
                    <span>{t("excerpt")}</span>
                    <textarea
                      value={draft.excerpt}
                      rows={3}
                      maxLength={500}
                      onChange={(event) =>
                        patchDraft({ excerpt: event.target.value })
                      }
                    />
                  </label>
                  <label className={styles.checkField}>
                    <input
                      type="checkbox"
                      checked={draft.isPublished}
                      onChange={(event) =>
                        patchDraft({ isPublished: event.target.checked })
                      }
                    />
                    <span>{t("publish")}</span>
                  </label>
                  {selectedChapterIndex >= 0 ? (
                    <p className={styles.meta}>
                      {t("chapterPosition", {
                        position: selectedChapterIndex + 1,
                        total: chapters.length,
                      })}
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  <label className={styles.field}>
                    <span>{t("category")}</span>
                    <select
                      value={draft.category}
                      onChange={(event) =>
                        patchDraft({
                          category: event.target.value as WikiCategory,
                        })
                      }
                    >
                      {CATEGORY_ORDER.map((category) => (
                        <option key={category} value={category}>
                          {tCategories(category)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>{t("spoilerTier")}</span>
                    <input
                      type="number"
                      min={1}
                      value={draft.spoilerTier}
                      onChange={(event) =>
                        patchDraft({ spoilerTier: event.target.value })
                      }
                    />
                    <small className={styles.hint}>{t("spoilerHint")}</small>
                  </label>
                </>
              )}

              <p className={styles.meta}>{t("wordCount", { count: wordCount })}</p>

              <div className={styles.dossierActions}>
                <Link
                  href={
                    selected.kind === "chapter"
                      ? `/admin/stories/${selected.id}`
                      : `/admin/wiki/${selected.id}`
                  }
                  className={styles.secondaryLink}
                >
                  {t("openFullForm")}
                </Link>
                <button
                  type="button"
                  className={styles.deleteButton}
                  disabled={busy}
                  onClick={() => void handleDeleteNode()}
                >
                  {t("delete")}
                </button>
              </div>
            </>
          ) : (
            <p className={styles.deskEmpty}>{t("dossierEmpty")}</p>
          )}
        </aside>
      </div>

      {/* Mobil sütun geçişi (kural 2: tek sütun + 44px dokunma alanı) */}
      <nav className={styles.paneBar} aria-label={t("paneBarAria")}>
        <button
          type="button"
          className={mobilePane === "tree" ? styles.paneActive : styles.paneTab}
          onClick={() => setMobilePane("tree")}
        >
          {t("paneTree")}
        </button>
        <button
          type="button"
          className={
            mobilePane === "editor" ? styles.paneActive : styles.paneTab
          }
          onClick={() => setMobilePane("editor")}
        >
          {t("paneEditor")}
        </button>
        <button
          type="button"
          className={
            mobilePane === "dossier" ? styles.paneActive : styles.paneTab
          }
          onClick={() => setMobilePane("dossier")}
        >
          {t("paneDossier")}
        </button>
      </nav>
    </div>
  );
}
