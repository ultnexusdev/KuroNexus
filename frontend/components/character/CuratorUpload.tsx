"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  addCharacterImage,
  deleteCharacterImage,
  uploadImage,
  uploadImageFromUrl,
} from "@/lib/admin/api";
import type { CharacterImageSlotName } from "@/lib/api/types";
import styles from "./CuratorUpload.module.css";

/**
 * Kürator yükleme yuvası.
 *
 * Görsel yüklenir yüklenmez **veritabanına bağlanıyor** ve sayfa tazeleniyor;
 * kürator adresi kopyalayıp kimseye iletmiyor. (İlk sürümde yalnızca adresi
 * gösteriyordu — kullanıcı haklı olarak "sürekli sana haber mi vermeliyim"
 * dedi, 6 Ağustos 2026.)
 *
 * İKİ YOL: dosya seçmek ya da bir adres yapıştırmak. İkincisinde görsel
 * sunucuya **indiriliyor**; dış adres saklanmıyor çünkü CSP `img-src`
 * yabancı sunucuya izin vermiyor ve dış adres bir gün ölürse görsel de
 * ölürdü.
 *
 * Karakterin YAZILI içeriği (Shikai açıklaması, replikler) hâlâ kodda —
 * yalnızca görseller veritabanında. Ayrım bilinçli: yazılı bölümler her
 * karaktere özel tasarlanıyor, görseller ise tek biçimli.
 */
export function CuratorUpload({
  characterId,
  slot,
  abilityName,
  label,
  current,
  size,
}: {
  characterId: number;
  slot: CharacterImageSlotName;
  /** `ABILITY` yuvasında hangi yetenek kartı */
  abilityName?: string;
  /** Yuvanın ekranda görünen adı */
  label: string;
  /**
   * Yuvada ŞU AN duran kare.
   *
   * ⚠️ Bunu almadan önce yükleyici DOLU bir yuvada da boş bir kutu
   * çiziyordu: küratör sayfayı aşağı kaydırırken hangi yuvanın dolu
   * hangisinin boş olduğunu göremiyor, dolmuş bir yuvayı yeniden
   * doldurmaya kalkışıyordu (kullanıcı isteği, 29 Ağustos 2026). Kayıt
   * varken artık kutu değil KARENİN KENDİSİ duruyor.
   */
  current?: { id: string; url: string } | null;
  /**
   * Önerilen piksel boyutu.
   *
   * Küratör kareleri kendisi üretiyor; hangi oranda üreteceğini bilmesi
   * gerekiyor. Sayı manifestodan geliyor (`narutoSlotSpec`), bileşende
   * yazılı değil — aynı yuva iki yerde farklı boyut söylememeli.
   */
  size?: { w: number; h: number };
}) {
  const t = useTranslations("character.uploader");
  const router = useRouter();
  const [remote, setRemote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  /** Dolu yuvada "Değiştir"e basıldı: yükleme yolları açılıyor */
  const [replacing, setReplacing] = useState(false);
  const [, startTransition] = useTransition();

  async function run(upload: () => Promise<{ url: string }>) {
    setBusy(true);
    setError(null);
    setDone(false);
    try {
      const uploaded = await upload();
      await addCharacterImage({
        characterId,
        slot,
        abilityName,
        url: uploaded.url,
        altText: label,
      });
      setRemote("");
      setDone(true);
      setReplacing(false);
      // Sunucu bileşenlerini yeniden çizdirir: görsel anında yerine oturur
      startTransition(() => router.refresh());
    } catch {
      setError(t("error"));
    } finally {
      setBusy(false);
    }
  }

  /** Yumuşak silme: kayıt işaretleniyor, diskteki dosyaya dokunulmuyor
      (AGENTS.md kural 3). Onay istenmiyor çünkü geri alınabilir —
      `CharacterImageDelete`in aynı gerekçesi. */
  async function remove(id: string) {
    setBusy(true);
    setError(null);
    try {
      await deleteCharacterImage(id);
      startTransition(() => router.refresh());
    } catch {
      setError(t("error"));
    } finally {
      setBusy(false);
    }
  }

  const inputId = `curator-url-${slot}-${abilityName ?? "main"}`;

  /* Yükleme yolları YALNIZCA yuva boşken ya da "Değiştir" açıkken.
     Dolu bir yuvada iki dosya seçicinin altında duran bir önizleme,
     küratöre "burada iki ayrı kare var" hissi veriyordu. */
  const showWays = !current || replacing;

  return (
    <div className={styles.box}>
      <p className={styles.slot}>
        {label}
        {size ? (
          /* Önerilen ölçü — küratör kareyi üretmeden önce görsün.
             Oran da yazılı: 1280×720 tek başına "16:9" demiyor. */
          <span className={styles.spec}>
            {size.w}×{size.h} · {ratioOf(size)}
          </span>
        ) : null}
      </p>

      {current ? (
        <figure className={styles.preview}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.url} alt="" loading="lazy" />
          {/* Kaplama hover ve klavye odağıyla açılıyor: fareyle
              gelinmediği sürece kare temiz görünüyor. */}
          <figcaption className={styles.previewBar}>
            <button
              type="button"
              className={styles.previewAction}
              disabled={busy}
              onClick={() => setReplacing((value) => !value)}
              aria-expanded={replacing}
            >
              {replacing ? t("cancel") : t("replace")}
            </button>
            <button
              type="button"
              className={`${styles.previewAction} ${styles.previewRemove}`}
              disabled={busy}
              onClick={() => void remove(current.id)}
            >
              {t("remove")}
            </button>
          </figcaption>
        </figure>
      ) : null}

      <div className={styles.ways} hidden={!showWays}>
        <label className={styles.fileWay}>
          <span className={styles.wayLabel}>{t("fromFile")}</span>
          <input
            type="file"
            accept="image/*"
            className={styles.file}
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void run(() => uploadImage(file));
              }
            }}
          />
        </label>

        <div className={styles.urlWay}>
          <label className={styles.wayLabel} htmlFor={inputId}>
            {t("fromUrl")}
          </label>
          <div className={styles.urlRow}>
            <input
              id={inputId}
              type="url"
              inputMode="url"
              className={styles.urlInput}
              placeholder={t("urlPlaceholder")}
              value={remote}
              disabled={busy}
              onChange={(event) => setRemote(event.target.value)}
            />
            <button
              type="button"
              className={styles.fetch}
              disabled={busy || remote.trim().length === 0}
              onClick={() => {
                const value = remote.trim();
                if (value) {
                  void run(() => uploadImageFromUrl(value));
                }
              }}
            >
              {t("fetch")}
            </button>
          </div>
        </div>
      </div>

      {busy ? <p className={styles.note}>{t("busy")}</p> : null}
      {done && !busy ? (
        <p className={styles.done} role="status">
          {t("added")}
        </p>
      ) : null}
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * En sade kesirli oran — 1280×720 → "16:9".
 *
 * Yazıyla değil HESAPLA: manifestoya elle "16:9" yazmak, boyut
 * değiştiğinde iki alandan birinin unutulması demekti (aynı sınıf hata
 * `slots.ts` başlığında da yazılı). Kesir sadeleşmiyorsa ham oran
 * basılıyor — uydurma bir yakınsama, yanlış bir söz olurdu.
 */
function ratioOf({ w, h }: { w: number; h: number }): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const d = gcd(w, h) || 1;
  return `${w / d}:${h / d}`;
}
