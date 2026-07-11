"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import {
  createWikiEntry,
  fetchAdminUniverses,
  updateWikiEntry,
  uploadImage,
  type WikiEntryInput,
} from "@/lib/admin/api";
import type {
  WikiCategory,
  WikiEntryDetail,
  WikiUniverseSummary,
} from "@/lib/api/types";
import { legacyPlainTextToHtml } from "@/lib/content/legacyPlainTextToHtml";
import { RichTextEditor } from "./RichTextEditor";
import styles from "./StoryForm.module.css";

const CATEGORIES: WikiCategory[] = [
  "CHARACTER",
  "LOCATION",
  "TERM",
  "EVENT",
  "ITEM",
  "ORGANIZATION",
  "MAGIC_SYSTEM",
];

export function WikiEntryForm({ entry }: { entry?: WikiEntryDetail }) {
  const t = useTranslations("admin.wikiForm");
  const tWiki = useTranslations("wiki");
  const router = useRouter();

  const [title, setTitle] = useState(entry?.title ?? "");
  const [content, setContent] = useState(
    entry?.content ? legacyPlainTextToHtml(entry.content) : "",
  );
  const [category, setCategory] = useState<WikiCategory>(
    entry?.category ?? "CHARACTER",
  );
  const [universeId, setUniverseId] = useState(entry?.universeId ?? "");
  const [universes, setUniverses] = useState<WikiUniverseSummary[]>([]);
  const [spoilerTier, setSpoilerTier] = useState(
    entry?.spoilerTier != null ? String(entry.spoilerTier) : "",
  );
  const [coverImage, setCoverImage] = useState(entry?.coverImage ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchAdminUniverses()
      .then(setUniverses)
      .catch(() => undefined);
  }, []);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(false);
    try {
      const result = await uploadImage(file);
      setCoverImage(result.url);
    } catch {
      setError(true);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(false);
    const input: WikiEntryInput = {
      title,
      content,
      category,
      universeId,
      coverImage: coverImage || undefined,
      spoilerTier: spoilerTier === "" ? undefined : Number(spoilerTier),
    };
    try {
      if (entry) {
        await updateWikiEntry(entry.id, input);
      } else {
        await createWikiEntry(input);
      }
      router.push("/admin/wiki");
      router.refresh();
    } catch {
      setError(true);
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>{t("title")}</span>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          maxLength={200}
        />
      </label>

      <label className={styles.field}>
        <span>{t("universe")}</span>
        <select
          value={universeId}
          onChange={(event) => setUniverseId(event.target.value)}
          required
        >
          <option value="" disabled>
            {t("selectUniverse")}
          </option>
          {universes.map((universe) => (
            <option key={universe.id} value={universe.id}>
              {universe.name}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span>{t("category")}</span>
        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as WikiCategory)
          }
        >
          {CATEGORIES.map((value) => (
            <option key={value} value={value}>
              {tWiki(`categories.${value}`)}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span>{t("spoilerTier")}</span>
        <input
          type="number"
          min={0}
          value={spoilerTier}
          onChange={(event) => setSpoilerTier(event.target.value)}
          placeholder={t("spoilerTierHint")}
        />
      </label>

      <div className={styles.field}>
        <span>{t("content")}</span>
        <RichTextEditor content={content} onChange={setContent} />
      </div>

      <div className={styles.field}>
        <span>{t("cover")}</span>
        {coverImage ? (
          <Image
            src={apiUrl(coverImage)}
            alt=""
            width={480}
            height={270}
            className={styles.coverPreview}
          />
        ) : null}
        <label className={styles.uploadLabel}>
          {uploading ? t("uploading") : t("upload")}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className={styles.fileInput}
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void handleUpload(file);
              }
            }}
          />
        </label>
      </div>

      {error ? <p className={styles.error}>{t("error")}</p> : null}

      <div className={styles.actions}>
        <button type="submit" className="btn" disabled={saving || uploading}>
          {saving ? t("saving") : t("save")}
        </button>
      </div>
    </form>
  );
}
