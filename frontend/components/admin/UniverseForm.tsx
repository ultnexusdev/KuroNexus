"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import {
  createUniverse,
  updateUniverse,
  uploadImage,
  fetchAdminCategories,
  type UniverseInput,
} from "@/lib/admin/api";
import type { WikiUniverseSummary, UniverseCategory } from "@/lib/api/types";
import { useEffect, useCallback } from "react";
import styles from "./UniverseForm.module.css";

export function UniverseForm({
  universe,
}: {
  universe?: WikiUniverseSummary;
}) {
  const t = useTranslations("admin.universeForm");
  const router = useRouter();

  const [name, setName] = useState(universe?.name ?? "");
  const [description, setDescription] = useState(universe?.description ?? "");
  const [coverImage, setCoverImage] = useState(universe?.coverImage ?? "");
  const [categoryId, setCategoryId] = useState(universe?.categoryId ?? "");
  const [categories, setCategories] = useState<UniverseCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setCategories(await fetchAdminCategories());
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

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
    const input: UniverseInput = {
      name,
      description: description || undefined,
      coverImage: coverImage || undefined,
      categoryId: categoryId === "" ? null : categoryId,
    };
    try {
      if (universe) {
        await updateUniverse(universe.id, input);
      } else {
        await createUniverse(input);
      }
      router.push("/admin/universes");
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
        <span>{t("category")}</span>
        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          <option value="">{t("noCategory")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
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
