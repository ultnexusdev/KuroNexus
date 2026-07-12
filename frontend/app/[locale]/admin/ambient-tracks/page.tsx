"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { AdminGuard } from "@/components/admin/AdminGuard";
import {
  createAmbientTrack,
  deleteAmbientTrack,
  fetchAdminAmbientTracks,
  fetchAdminUniverses,
  uploadImage,
} from "@/lib/admin/api";
import type { AmbientTrack, WikiUniverseSummary } from "@/lib/api/types";

export default function AmbientTracksPage() {
  const t = useTranslations("admin.ambient");
  const [tracks, setTracks] = useState<AmbientTrack[]>([]);
  const [universes, setUniverses] = useState<WikiUniverseSummary[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [universeId, setUniverseId] = useState("");

  const fetchData = () => {
    fetchAdminAmbientTracks().then(setTracks).catch(console.error);
    fetchAdminUniverses().then(setUniverses).catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string, trackTitle: string) => {
    if (!confirm(t("confirmDelete", { title: trackTitle }))) return;
    try {
      await deleteAmbientTrack(id);
      fetchData();
    } catch (e) {
      console.error(e);
      alert(t("deleteError"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !universeId) {
      alert(t("missingFields"));
      return;
    }
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert(t("missingFile"));
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload audio
      const uploadRes = await uploadImage(file);

      // 2. Create track record
      await createAmbientTrack({
        title,
        universeId,
        audioUrl: uploadRes.url,
        order: tracks.length,
      });

      // Reset
      setTitle("");
      setUniverseId("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchData();
    } catch (e) {
      console.error(e);
      alert(t("uploadError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminGuard>
      <div style={{ padding: "2rem", color: "var(--text-primary)" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "2rem", fontFamily: "var(--font-cinzel)" }}>
          {t("title")}
        </h1>

        <div style={{ background: "var(--surface)", padding: "2rem", borderRadius: "8px", border: "1px solid var(--border)", marginBottom: "2rem" }}>
          <h2>{t("addTitle")}</h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            <label>
              {t("trackTitle")}:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "4px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", color: "inherit" }}
              />
            </label>
            <label>
              {t("universe")}:
              <select
                value={universeId}
                onChange={(e) => setUniverseId(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "4px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", color: "inherit" }}
              >
                <option value="">{t("selectUniverse")}</option>
                {universes.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("file")}:
              <input
                type="file"
                accept="audio/*"
                ref={fileInputRef}
                style={{ width: "100%", padding: "8px", marginTop: "4px" }}
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ padding: "12px", background: "var(--accent)", color: "var(--bg-default)", border: "none", cursor: "pointer", fontWeight: "bold" }}
            >
              {isSubmitting ? t("submitting") : t("submit")}
            </button>
          </form>
        </div>

        <div>
          <h2>{t("existing")}</h2>
          <table style={{ width: "100%", textAlign: "left", marginTop: "1rem", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: "12px 8px" }}>{t("trackTitle")}</th>
                <th style={{ padding: "12px 8px" }}>{t("colUniverse")}</th>
                <th style={{ padding: "12px 8px" }}>{t("colDate")}</th>
                <th style={{ padding: "12px 8px" }}>{t("colAction")}</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track) => (
                <tr key={track.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 8px" }}>{track.title}</td>
                  <td style={{ padding: "12px 8px" }}>{track.universe?.name}</td>
                  <td style={{ padding: "12px 8px" }}>{new Date(track.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 8px" }}>
                    <button onClick={() => handleDelete(track.id, track.title)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>
                      {t("delete")}
                    </button>
                  </td>
                </tr>
              ))}
              {tracks.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: "12px 8px", textAlign: "center" }}>{t("empty")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminGuard>
  );
}
