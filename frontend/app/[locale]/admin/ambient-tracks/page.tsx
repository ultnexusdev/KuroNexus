"use client";

import { useEffect, useState, useRef } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { apiFetch, apiUrl } from "@/lib/api/client";

export default function AmbientTracksPage() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [universes, setUniverses] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [universeId, setUniverseId] = useState("");

  const fetchData = () => {
    apiFetch<any[]>("/ambient-tracks")
      .then(setTracks)
      .catch(console.error);
    apiFetch<any[]>("/admin/universes")
      .then(setUniverses)
      .catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Emin misiniz?")) return;
    try {
      await apiFetch(`/ambient-tracks/${id}`, { method: "DELETE" });
      fetchData();
    } catch (e) {
      console.error(e);
      alert("Hata oluştu.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !universeId) {
      alert("Lütfen başlık ve evren seçin.");
      return;
    }
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert("Lütfen bir ses dosyası seçin (mp3/wav/ogg).");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload audio
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await apiFetch<{ url: string }>("/admin/uploads", {
        method: "POST",
        body: formData,
      });

      // 2. Create track record
      await apiFetch("/ambient-tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          universeId,
          audioUrl: uploadRes.url,
          order: tracks.length,
        }),
      });

      // Reset
      setTitle("");
      setUniverseId("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchData();
    } catch (e) {
      console.error(e);
      alert("Yüklenirken hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminGuard>
      <div style={{ padding: "2rem", color: "var(--text-primary)" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "2rem", fontFamily: "var(--font-cinzel)" }}>
          Müzik Kütüphanesi
        </h1>

        <div style={{ background: "var(--surface)", padding: "2rem", borderRadius: "8px", border: "1px solid var(--border)", marginBottom: "2rem" }}>
          <h2>Yeni Müzik Ekle</h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            <label>
              Başlık:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "4px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", color: "inherit" }}
              />
            </label>
            <label>
              Evren:
              <select
                value={universeId}
                onChange={(e) => setUniverseId(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "4px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", color: "inherit" }}
              >
                <option value="">-- Seçiniz --</option>
                {universes.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Ses Dosyası (Max 50MB):
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
              {isSubmitting ? "Yükleniyor..." : "Yükle ve Ekle"}
            </button>
          </form>
        </div>

        <div>
          <h2>Mevcut Müzikler</h2>
          <table style={{ width: "100%", textAlign: "left", marginTop: "1rem", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: "12px 8px" }}>Başlık</th>
                <th style={{ padding: "12px 8px" }}>Evren</th>
                <th style={{ padding: "12px 8px" }}>Tarih</th>
                <th style={{ padding: "12px 8px" }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 8px" }}>{t.title}</td>
                  <td style={{ padding: "12px 8px" }}>{t.universe?.name}</td>
                  <td style={{ padding: "12px 8px" }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 8px" }}>
                    <button onClick={() => handleDelete(t.id)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
              {tracks.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: "12px 8px", textAlign: "center" }}>Kayıtlı müzik yok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminGuard>
  );
}
