"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { apiFetch, apiUrl } from "@/lib/api/client";
import { uploadImage, uploadImageFromUrl } from "@/lib/admin/api";
import type { LiveSquadPlayer } from "@/lib/api/football-live";
import styles from "./LineupCurator.module.css";

/**
 * Favori 11 düzenleyici — küratör paneli.
 *
 * ── NEDEN SAYFANIN İÇİNDE ────────────────────────────────────────────────
 * Kanadın yerleşik kuralı (bkz. `SportCurator` başlığı): kürasyon, sonucun
 * GÖRÜLDÜĞÜ yerde yapılır. Ayrı bir yönetim ekranında 11 seçmek, dizilişin
 * sahada nasıl durduğunu ancak kaydettikten sonra görmek olurdu.
 *
 * ── YETKİ ────────────────────────────────────────────────────────────────
 * ⚠️ Bu bileşen YALNIZCA DÜĞMEYİ gösteriyor. Yetkinin gerçek kapısı backend:
 * `PUT /admin/football-live/lineup` `@Roles('ADMIN')` arkasında ve çerezdeki
 * token her istekte doğrulanıyor. Bileşeni elle render etmek hiçbir kapı
 * açmaz.
 *
 * ── KAYITTAN SONRA `router.refresh()` ────────────────────────────────────
 * Panel kendi kopyasını güncelleyip sayfayı eski hâlinde bırakmıyor: küratör
 * seçtiği oyuncuyu SAHADA anında görüyor. (Karakter yükleyicisinde öğrenilen
 * ders, kanattaki diğer küratör panellerinde de aynı.)
 */

/** Yuva sırası sahadaki dizilime göre: önce forvet, sonra geriye doğru. */
const SLOTS = [
  { key: "ST", line: "forward" },
  { key: "LAM", line: "attacking" },
  { key: "CAM", line: "attacking" },
  { key: "RAM", line: "attacking" },
  { key: "LDM", line: "holding" },
  { key: "RDM", line: "holding" },
  { key: "LB", line: "defence" },
  { key: "LCB", line: "defence" },
  { key: "RCB", line: "defence" },
  { key: "RB", line: "defence" },
  { key: "GK", line: "keeper" },
] as const;

interface CuratorPayload {
  formation: string;
  slots: Array<{ slot: string; playerId: string | null }>;
  noteTr: string | null;
  noteEn: string | null;
  squad: LiveSquadPlayer[];
}

export function LineupCurator() {
  const t = useTranslations("sportArchive.live.eleven");
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [data, setData] = useState<CuratorPayload | null>(null);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<CuratorPayload>("/admin/football-live/lineup")
      .then((payload) => {
        setData(payload);
        const initial: Record<string, string> = {};
        for (const s of payload.slots) {
          if (s.playerId) initial[s.slot] = s.playerId;
        }
        setPicks(initial);
        setNote(payload.noteTr ?? "");
      })
      .catch(() => setError(t("loadError")));
  }, [t]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await apiFetch("/admin/football-live/lineup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formation: "4-2-3-1",
          slots: picks,
          noteTr: note.trim() || undefined,
        }),
      });
      startTransition(() => router.refresh());
    } catch {
      setError(t("saveError"));
    } finally {
      setSaving(false);
    }
  };

  if (error && !data) return <p className={styles.error}>{error}</p>;
  if (!data) return <p className={styles.loading}>…</p>;

  // Aynı oyuncuyu iki yuvaya koymak engelleniyor: seçili olduğu yuva dışında
  // listelerden düşüyor. 11 kişilik bir dizilişte bir kişinin iki yerde
  // durması bariz bir hata ve kaydedildikten sonra fark edilmesi zor.
  const takenBy = new Map(Object.entries(picks).map(([slot, id]) => [id, slot]));

  return (
    <div className={styles.panel}>
      <SyncButton />

      <p className={styles.hint}>{t("curatorHint")}</p>

      <div className={styles.grid}>
        {SLOTS.map(({ key, line }) => (
          <label key={key} className={styles.field} data-line={line}>
            <span className={styles.slotName}>{key}</span>
            <select
              className={styles.select}
              value={picks[key] ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                setPicks((current) => {
                  const next = { ...current };
                  if (value) next[key] = value;
                  else delete next[key];
                  return next;
                });
              }}
            >
              <option value="">— {t("emptySlot")} —</option>
              {data.squad
                .filter((p) => {
                  const owner = takenBy.get(p.id);
                  return owner === undefined || owner === key;
                })
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.shirtNumber !== null ? `${p.shirtNumber} · ` : ""}
                    {p.name}
                    {p.detailedPosition ? ` (${p.detailedPosition})` : ""}
                  </option>
                ))}
            </select>
          </label>
        ))}
      </div>

      <label className={styles.noteField}>
        <span className={styles.slotName}>{t("noteLabel")}</span>
        <textarea
          className={styles.textarea}
          value={note}
          maxLength={400}
          rows={2}
          onChange={(event) => setNote(event.target.value)}
          placeholder={t("notePlaceholder")}
        />
      </label>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.save}
          onClick={() => void save()}
          disabled={saving}
        >
          {saving ? t("saving") : t("save")}
        </button>
        <span className={styles.count}>
          {Object.keys(picks).length} / 11
        </span>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <ImageSection />
    </div>
  );
}

/**
 * Veri tazeleme düğmesi.
 *
 * ── NEDEN BURADA ─────────────────────────────────────────────────────────
 * Senkron şimdiye kadar yalnızca cron'la (04:20 UTC) ya da tarayıcı
 * konsoluna elle `fetch` yazarak tetiklenebiliyordu. Kadro ya da skor
 * eskidiğinde küratörün DevTools açması gerekiyordu — bir arşiv panelinde
 * kabul edilebilir bir iş akışı değil.
 *
 * ── DURUM YOKLAMASI ──────────────────────────────────────────────────────
 * Senkron arka planda koşuyor ve uç anında `{status:'STARTED'}` dönüyor
 * (kanadın uzun iş deseni). Düğme bittiğini anlamak için durum ucunu üç
 * saniyede bir yokluyor; `running: false` görünce sayfayı yeniliyor ki
 * küratör yeni veriyi ANINDA görsün.
 */
function SyncButton() {
  const t = useTranslations("sportArchive.live.sync");
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [state, setState] = useState<"idle" | "running" | "done" | "error">(
    "idle",
  );
  const [detail, setDetail] = useState<string | null>(null);

  /* Yoklama döngüsünün canlılık bayrağı: küratör senkronu başlatıp başka
     rotaya geçerse döngü 3 dakikaya kadar sürüyor, sökülmüş bileşen için
     istek atmaya devam ediyor ve dönüşte alakasız sayfayı router.refresh()
     ile tazeliyordu (2026-09-01 denetimi, M-01). Senkronun kendisi arka
     planda sürer — kesilen yalnızca bu bileşenin yoklaması. */
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const run = async () => {
    setState("running");
    setDetail(null);
    try {
      await apiFetch("/admin/football-live/sync", { method: "POST" });

      // Bitene kadar yokla. Üst sınır var: senkron takılırsa düğme sonsuza
      // kadar "çalışıyor" demesin.
      for (let i = 0; i < 60; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        if (!alive.current) {
          return;
        }
        const status = await apiFetch<{
          running: boolean;
          last?: { ok?: boolean; diag?: Record<string, unknown> } | null;
        }>("/admin/football-live/sync");
        if (!alive.current) {
          return;
        }

        if (!status.running) {
          const diag = status.last?.diag ?? {};
          setDetail(
            [
              `${t("squad")}: ${String(diag.officialSquad ?? "–")}`,
              `${t("fixtures")}: ${String(diag.fixtureCount ?? "–")}`,
              `${t("standings")}: ${String(diag.standingsRows ?? "–")}`,
              `${t("news")}: ${String(diag.news ?? "–")}`,
            ].join(" · "),
          );
          setState(status.last?.ok === false ? "error" : "done");
          startTransition(() => router.refresh());
          return;
        }
      }
      setState("error");
      setDetail(t("timeout"));
    } catch {
      setState("error");
      setDetail(t("error"));
    }
  };

  return (
    <div className={styles.syncRow}>
      <button
        type="button"
        className={styles.syncButton}
        onClick={() => void run()}
        disabled={state === "running"}
      >
        {state === "running" ? t("running") : t("action")}
      </button>
      <span className={styles.syncHint}>
        {detail ?? t("hint")}
      </span>
    </div>
  );
}

interface ClubImage {
  id: string;
  url: string;
  captionTr: string | null;
  sourceNote: string | null;
}

/**
 * Görsel bölümü — hero arka planı ve stadyum sahneleri.
 *
 * ── İKİ ADIM, BİLİNÇLİ ───────────────────────────────────────────────────
 * Önce dosya `/admin/uploads`a yükleniyor, sonra dönen `/uploads/...` yolu
 * bu kulübün yuvasına bağlanıyor. Deponun yerleşik deseni; yükleme mantığı
 * (SSRF savunması, mime, boyut) tek yerde dursun diye ayrılmış.
 *
 * Dış adresten de alınabiliyor (`/admin/uploads/from-url`): görsel indirilip
 * bizim sunucumuza yazılıyor, adres SAKLANMIYOR. CSP yabancı origin'i
 * engelliyor ve dış adres bir gün ölüyor.
 */
function ImageSection() {
  const t = useTranslations("sportArchive.live.images");
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [images, setImages] = useState<{ hero: ClubImage[]; stadium: ClubImage[] } | null>(
    null,
  );
  const [kind, setKind] = useState<"HERO" | "STADIUM">("STADIUM");
  const [caption, setCaption] = useState("");
  const [source, setSource] = useState("");
  const [remoteUrl, setRemoteUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = () =>
    apiFetch<{ hero: ClubImage[]; stadium: ClubImage[] }>(
      "/admin/football-live/images",
    )
      .then(setImages)
      .catch(() => setError(t("loadError")));

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const attach = async (url: string) => {
    await apiFetch("/admin/football-live/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        url,
        captionTr: caption.trim() || undefined,
        sourceNote: source.trim() || undefined,
      }),
    });
    setCaption("");
    setSource("");
    setRemoteUrl("");
    await reload();
    startTransition(() => router.refresh());
  };

  const onFile = async (file: File | null) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const uploaded = await uploadImage(file);
      await attach(uploaded.url);
    } catch {
      setError(t("uploadError"));
    } finally {
      setBusy(false);
    }
  };

  const onRemote = async () => {
    if (!remoteUrl.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const uploaded = await uploadImageFromUrl(remoteUrl.trim());
      await attach(uploaded.url);
    } catch {
      setError(t("uploadError"));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm(t("confirmRemove"))) return;
    try {
      await apiFetch(`/admin/football-live/images/${id}`, { method: "DELETE" });
      await reload();
      startTransition(() => router.refresh());
    } catch {
      setError(t("removeError"));
    }
  };

  return (
    <section className={styles.images}>
      <p className={styles.slotName}>{t("title")}</p>
      <p className={styles.hint}>{t("hint")}</p>

      <div className={styles.imageForm}>
        <label className={styles.field}>
          <span className={styles.slotName}>{t("kind")}</span>
          <select
            className={styles.select}
            value={kind}
            onChange={(e) => setKind(e.target.value as "HERO" | "STADIUM")}
          >
            <option value="STADIUM">{t("kindStadium")}</option>
            <option value="HERO">{t("kindHero")}</option>
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.slotName}>{t("caption")}</span>
          <input
            className={styles.select}
            value={caption}
            maxLength={200}
            onChange={(e) => setCaption(e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.slotName}>{t("source")}</span>
          <input
            className={styles.select}
            value={source}
            maxLength={200}
            placeholder={t("sourcePlaceholder")}
            onChange={(e) => setSource(e.target.value)}
          />
        </label>
      </div>

      <div className={styles.imageActions}>
        <label className={styles.fileButton}>
          {busy ? t("uploading") : t("pickFile")}
          <input
            type="file"
            accept="image/*"
            className={styles.srOnly}
            disabled={busy}
            onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <span className={styles.orText}>{t("or")}</span>

        <input
          className={styles.select}
          value={remoteUrl}
          placeholder={t("urlPlaceholder")}
          onChange={(e) => setRemoteUrl(e.target.value)}
        />
        <button
          type="button"
          className={styles.save}
          disabled={busy || !remoteUrl.trim()}
          onClick={() => void onRemote()}
        >
          {t("fetch")}
        </button>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      {images ? (
        <div className={styles.thumbs}>
          {[...images.hero, ...images.stadium].map((img) => (
            <figure key={img.id} className={styles.thumb}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={apiUrl(img.url)} alt="" loading="lazy" />
              <figcaption>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => void remove(img.id)}
                >
                  {t("remove")}
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </section>
  );
}
