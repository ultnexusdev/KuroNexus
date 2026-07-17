"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import {
  createTransferNews,
  deleteTransferNews,
  fetchAdminTransferNews,
  fetchAdminUniverses,
  searchTransferNewsPlayers,
} from "@/lib/admin/api";
import type {
  TransferNewsItem,
  TransferNewsPlayer,
  WikiUniverseSummary,
} from "@/lib/api/types";
import styles from "./page.module.css";

export default function TransferNewsPage() {
  const t = useTranslations("admin.transferNews");
  const [news, setNews] = useState<TransferNewsItem[]>([]);
  const [universes, setUniverses] = useState<WikiUniverseSummary[]>([]);
  const [players, setPlayers] = useState<TransferNewsPlayer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [universeId, setUniverseId] = useState("");
  const [tmPlayerId, setTmPlayerId] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  const refresh = () => {
    fetchAdminTransferNews().then(setNews).catch(console.error);
  };

  useEffect(() => {
    refresh();
    fetchAdminUniverses().then(setUniverses).catch(console.error);
    // Oyuncu seçici yerel TM kadrosundan beslenir (sync ile güncellenir)
    searchTransferNewsPlayers().then(setPlayers).catch(console.error);
  }, []);

  const handleDelete = async (id: string, newsTitle: string) => {
    if (!confirm(t("confirmDelete", { title: newsTitle }))) return;
    try {
      await deleteTransferNews(id);
      refresh();
    } catch (e) {
      console.error(e);
      alert(t("deleteError"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body || !universeId) {
      alert(t("missingFields"));
      return;
    }
    setIsSubmitting(true);
    try {
      await createTransferNews({
        title,
        body,
        universeId,
        tmPlayerId: tmPlayerId || undefined,
        sourceUrl: sourceUrl || undefined,
      });
      setTitle("");
      setBody("");
      setTmPlayerId("");
      setSourceUrl("");
      refresh();
    } catch (err) {
      console.error(err);
      alert(t("createError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminGuard>
      <div className={styles.page}>
        <h1 className={styles.title}>{t("title")}</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="news-title">
              {t("newsTitle")}
            </label>
            <input
              id="news-title"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="news-universe">
                {t("universe")}
              </label>
              <select
                id="news-universe"
                className={styles.select}
                value={universeId}
                onChange={(e) => setUniverseId(e.target.value)}
              >
                <option value="">{t("selectUniverse")}</option>
                {universes.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="news-player">
                {t("player")}
              </label>
              <select
                id="news-player"
                className={styles.select}
                value={tmPlayerId}
                onChange={(e) => setTmPlayerId(e.target.value)}
              >
                <option value="">{t("noPlayer")}</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                    {p.position ? ` — ${p.position}` : ""}
                  </option>
                ))}
              </select>
              <span className={styles.hint}>{t("playerHint")}</span>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="news-source">
              {t("sourceUrl")}
            </label>
            <input
              id="news-source"
              className={styles.input}
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>

          <div className={styles.field}>
            <span className={styles.label}>{t("body")}</span>
            <RichTextEditor content={body} onChange={setBody} />
          </div>

          <button
            type="submit"
            className={styles.submit}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("saving") : t("publish")}
          </button>
        </form>

        <h2 className={styles.title}>{t("existing")}</h2>
        {news.length === 0 ? (
          <p className={styles.empty}>{t("empty")}</p>
        ) : (
          <ul className={styles.list}>
            {news.map((item) => (
              <li key={item.id} className={styles.item}>
                {item.player?.photo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.player.photo} alt="" className={styles.photo} />
                ) : null}
                <span className={styles.itemMeta}>
                  <span className={styles.itemTitle}>{item.title}</span>
                  <span className={styles.itemSub}>
                    {[
                      item.player?.name,
                      new Date(item.publishedAt).toLocaleDateString(),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
                <button
                  type="button"
                  className={styles.delete}
                  onClick={() => handleDelete(item.id, item.title)}
                >
                  {t("delete")}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminGuard>
  );
}
