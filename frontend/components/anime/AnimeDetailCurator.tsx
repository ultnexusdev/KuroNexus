"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import {
  completeAnimeThrough,
  updateAnimeEntry,
  updateAnimePart,
  uploadImage,
} from "@/lib/admin/api";
import type { ArchiveAnime, ArchiveAnimePart } from "@/lib/api/types";
import styles from "./AnimeDetail.module.css";

/*
 * AnimeDetail'in küratör panelleri — AYRI DOSYADA bilerek (2026-09-01
 * denetimi, P-02): bu bileşenler yalnızca `isAdmin && curating` iken çiziliyor
 * ama AnimeDetail'in içinde durdukları sürece `lib/admin/api` importlarıyla
 * birlikte HER ziyaretçinin sayfa chunk'ına giriyorlardı. AnimeDetail bunları
 * `next/dynamic` + `ssr: false` ile yalnızca küratör modunda indiriyor
 * (BookDetail'deki desen).
 */

/** Küratörün elle girdiği alanlar — form durumunun anahtarları. */
const LINK_FIELDS = ["manga", "opening", "ending", "trailer", "official"] as const;

type LinkField = (typeof LINK_FIELDS)[number];

/**
 * Küratör künyesi: sayfanın sabit banner'ı ve elle girilen bağlantılar.
 *
 * Banner burada duruyor çünkü seçim seriye ait: AniList'ten gelen banner bazı
 * serilerde düşük çözünürlüklü ya da hiç yok. Buraya girilen görsel künye
 * tazelendiğinde de değişmez — alan boşaltılırsa AniList'inkine geri dönülür.
 */
export function CuratorDossier({ anime }: { anime: ArchiveAnime }) {
  const t = useTranslations("anime");
  const router = useRouter();
  const [banner, setBanner] = useState(anime.customBanner ?? "");
  const [links, setLinks] = useState<Record<LinkField, string>>(() => {
    // Eski backend yanıtında bu alan yok (deploy penceresi) — boş formla açılır
    const custom = anime.customLinks ?? {};
    return {
      manga: custom.manga ?? "",
      opening: custom.opening ?? "",
      ending: custom.ending ?? "",
      trailer: custom.trailer ?? "",
      official: custom.official ?? "",
    };
  });
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<"idle" | "saved" | "error">("idle");

  async function handleUpload(file: File) {
    setBusy(true);
    setState("idle");
    try {
      const result = await uploadImage(file);
      setBanner(result.url);
    } catch {
      setState("error");
    } finally {
      setBusy(false);
    }
  }

  async function handleSave() {
    setBusy(true);
    setState("idle");
    try {
      await updateAnimeEntry(anime.id, { bannerImage: banner, links });
      setState("saved");
      router.refresh();
    } catch {
      setState("error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t("detail.curatorTitle")}</h2>
      <p className={styles.sectionLede}>{t("detail.curatorLede")}</p>

      <div className={styles.dossier}>
        <label className={styles.dossierField}>
          <span>{t("detail.bannerField")}</span>
          <input
            type="text"
            value={banner}
            disabled={busy}
            placeholder="https://…"
            onChange={(event) => setBanner(event.target.value)}
          />
        </label>

        <label className={styles.dossierUpload}>
          <span>{t("detail.bannerUpload")}</span>
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void handleUpload(file);
              }
            }}
          />
        </label>

        {LINK_FIELDS.map((field) => (
          <label key={field} className={styles.dossierField}>
            <span>{t(`detail.linkField.${field}`)}</span>
            <input
              type="url"
              value={links[field]}
              disabled={busy}
              placeholder="https://…"
              onChange={(event) =>
                setLinks({ ...links, [field]: event.target.value })
              }
            />
          </label>
        ))}
      </div>

      <div className={styles.dossierActions}>
        <button
          type="button"
          className={styles.partTool}
          disabled={busy}
          onClick={() => void handleSave()}
        >
          {busy ? t("detail.saving") : t("detail.save")}
        </button>
        {state === "saved" ? (
          <span className={styles.dossierNote}>{t("detail.saved")}</span>
        ) : null}
        {state === "error" ? (
          <span className={styles.dossierError}>{t("detail.saveError")}</span>
        ) : null}
      </div>
    </section>
  );
}

/**
 * Sezon satırının küratör kontrolleri: tek tıkla bitirme, "buraya kadar
 * hepsini izledim" ve manga bölümü. Üçü de uzun serilerde tek tek
 * işaretlemekten kurtarıyor.
 */
export function PartTools({ part }: { part: ArchiveAnimePart }) {
  const t = useTranslations("anime");
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [chapter, setChapter] = useState(
    part.mangaChapter ? String(part.mangaChapter) : "",
  );

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    try {
      await action();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.partTools}>
      {part.episodes ? (
        <button
          type="button"
          className={styles.partTool}
          disabled={busy || part.isCompleted}
          onClick={() =>
            void run(() =>
              updateAnimePart(part.id, {
                watchedEpisodes: part.episodes ?? 0,
                isCompleted: true,
              }),
            )
          }
        >
          {part.isCompleted ? t("detail.partDone") : t("detail.finishPart")}
        </button>
      ) : null}

      <button
        type="button"
        className={styles.partTool}
        disabled={busy}
        title={t("detail.completeThroughHint")}
        onClick={() => void run(() => completeAnimeThrough(part.id))}
      >
        {t("detail.completeThrough")}
      </button>

      {/* Anime → manga eşlemesi hiçbir API'de yok; tek sayı, elle girilir */}
      <label className={styles.mangaField}>
        <span>{t("detail.mangaChapter")}</span>
        <input
          type="number"
          min={0}
          value={chapter}
          disabled={busy}
          placeholder="137"
          onChange={(event) => setChapter(event.target.value)}
          onBlur={() => {
            const parsed = Number.parseInt(chapter, 10);
            if (!Number.isFinite(parsed) || parsed === part.mangaChapter) {
              return;
            }
            void run(() =>
              updateAnimePart(part.id, { mangaChapter: Math.max(0, parsed) }),
            );
          }}
        />
      </label>
    </div>
  );
}
