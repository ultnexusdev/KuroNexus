"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import {
  createStory,
  fetchAdminUniverses,
  updateStory,
  uploadImage,
  type StoryInput,
} from "@/lib/admin/api";
import type { Story, WikiUniverseSummary } from "@/lib/api/types";
import { legacyPlainTextToHtml } from "@/lib/content/legacyPlainTextToHtml";
import { RichTextEditor } from "./RichTextEditor";
import styles from "./StoryForm.module.css";

export function StoryForm({ story }: { story?: Story }) {
  const t = useTranslations("admin.form");
  const router = useRouter();

  const [title, setTitle] = useState(story?.title ?? "");
  const [excerpt, setExcerpt] = useState(story?.excerpt ?? "");
  const [content, setContent] = useState(
    story?.content ? legacyPlainTextToHtml(story.content) : "",
  );
  const [coverImage, setCoverImage] = useState(story?.coverImage ?? "");
  const [universeId, setUniverseId] = useState(story?.universeId ?? "");
  const [universes, setUniverses] = useState<WikiUniverseSummary[]>([]);
  const [isPublished, setIsPublished] = useState(story?.isPublished ?? false);
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
    const input: StoryInput = {
      title,
      content,
      excerpt: excerpt || undefined,
      coverImage: coverImage || undefined,
      universeId: universeId || undefined,
      isPublished,
    };
    try {
      if (story) {
        await updateStory(story.id, input);
      } else {
        await createStory(input);
      }
      router.push("/admin/stories");
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
        <span>{t("excerpt")}</span>
        <textarea
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          rows={2}
          maxLength={500}
        />
      </label>

      <div className={styles.field}>
        <span>{t("content")}</span>
        <RichTextEditor content={content} onChange={setContent} />
      </div>

      <label className={styles.field}>
        <span>{t("universe")}</span>
        <select
          value={universeId}
          onChange={(event) => setUniverseId(event.target.value)}
        >
          <option value="">{t("noUniverse")}</option>
          {universes.map((universe) => (
            <option key={universe.id} value={universe.id}>
              {universe.name}
            </option>
          ))}
        </select>
      </label>

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

      <label className={styles.checkboxField}>
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(event) => setIsPublished(event.target.checked)}
        />
        <span>{t("publish")}</span>
      </label>

      {error ? <p className={styles.error}>{t("error")}</p> : null}

      <div className={styles.actions}>
        <button type="submit" className="btn" disabled={saving || uploading}>
          {saving ? t("saving") : t("save")}
        </button>
      </div>
    </form>
  );
}
