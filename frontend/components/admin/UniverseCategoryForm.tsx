"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import {
  createCategory,
  updateCategory,
  uploadImage,
  type CategoryInput,
} from "@/lib/admin/api";
import type { UniverseCategory } from "@/lib/api/types";
import styles from "./UniverseForm.module.css"; // Reuse existing styles

export function UniverseCategoryForm({
  category,
}: {
  category?: UniverseCategory;
}) {
  const t = useTranslations("admin.universeCategories.form");
  const router = useRouter();

  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [coverImage, setCoverImage] = useState(category?.coverImage ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

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
    const input: CategoryInput = {
      name,
      description: description || undefined,
      coverImage: coverImage || undefined,
    };
    try {
      if (category) {
        await updateCategory(category.id, input);
      } else {
        await createCategory(input);
      }
      router.push("/admin/universe-categories");
      router.refresh();
    } catch {
      setError(true);
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>{t("name")}</span>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={200}
        />
      </label>

      <label className={styles.field}>
        <span>{t("description")}</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={5}
        />
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

      {error ? <p className={styles.error}>{t("error")}</p> : null}

      <div className={styles.actions}>
        <button type="submit" className="btn" disabled={saving || uploading}>
          {saving ? t("saving") : t("save")}
        </button>
      </div>
    </form>
  );
}
