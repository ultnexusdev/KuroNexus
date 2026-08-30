import type { ReactNode } from "react";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import { apiUrl, isLocalUpload } from "@/lib/api/client";
import type { CuratedSlotView } from "@/lib/curated/contract";
import { readCuratedImages } from "@/lib/api/curated-images";
import { readIsAdmin } from "@/lib/auth/session";
import {
  JJK_SURFACE,
  defaultRatio,
  resolveRatio,
  slotDef,
  SLOT_BLENDS,
  SLOT_TREATMENTS,
  type CuratedSlotDef,
  type SlotRatio,
} from "@/lib/anime/jjk/slots";
import { pick } from "@/lib/anime/jjk/types";
import { CuratedSlotMount } from "@/components/curated/CuratedSlotMount";
import styles from "./CuratedImage.module.css";

/**
 * JJK EVRENİ — TEK GÖRSEL YUVASI.
 *
 * Bleach'in `CuratedImage` bileşeninin birebir kardeşi; gerekçelerin tamamı
 * orada yazılı (sunucu bileşeni, sıfır ziyaretçi JS'i, üç durum, iki origin,
 * "geçici gizle" davranışı). Burada yalnızca yüzey ve manifesto değişiyor:
 * `JJK_SURFACE` + `lib/anime/jjk/slots.ts`.
 *
 * ⚠️ ORTAK BİLEŞENE ÇIKARILMADI, BİLİNÇLİ: iki evrenin yuva sözleşmesi bugün
 * aynı ama bağımsız evrimleşiyor (Bleach'in yuvaları `world` alanı taşıyor,
 * JJK paleti DOM kalıtımından alıyor). Ortak gövde, birinde yapılacak şema
 * değişikliğini öbürünün sayfasına sızdırırdı — `types.ts` başlığındaki
 * kopya kararının aynısı.
 */
export async function CuratedImage({
  slotId,
  className,
  sizes,
  ratio,
  glyph,
  decorative,
  noEdit,
  fallback,
  fill,
}: {
  /** `JJK_SLOTS` içindeki kimlik */
  slotId: string;
  className?: string;
  /** `next/image` sizes — SABİT px olmalı (`vw` yasak, ölçüm next.config.ts'te) */
  sizes?: string;
  /** Yuvanın varsayılan oranını BU çizimde ez */
  ratio?: SlotRatio;
  /** Oranı YOK SAY, ebeveyni doldur — devralma ekranı bunu kullanıyor (CLS sorumluluğu çağırana) */
  fill?: boolean;
  /** `typographic` yedeğinde basılacak işaret — kanji ya da tek harf */
  glyph?: string;
  /** `alt` boş basılır: yanında zaten okunabilir metin var */
  decorative?: boolean;
  /** Düzenle düğmesini BASTIR — yuva bir `<button>`/`<a>` içindeyse ZORUNLU */
  noEdit?: boolean;
  /** `silhouette` yedeği yerine bölüme özel SVG */
  fallback?: ReactNode;
}) {
  const slot = slotDef(slotId);

  /* Manifestoda karşılığı olmayan kimlik: hiçbir şey çizme (Bleach kuralı —
     yetim kayıt panelde zaten görünür, yarım çerçeve "eksik" hissi üretir). */
  if (!slot) return null;

  const [images, isAdmin, locale] = await Promise.all([
    readCuratedImages(JJK_SURFACE),
    readIsAdmin(),
    getLocale(),
  ]);

  const record = images[slotId] ?? null;

  const raw = record?.isHidden ? null : (record?.url ?? slot.src ?? null);
  const source = raw ? (isLocalUpload(raw) ? apiUrl(raw) : raw) : null;

  const shownRatio = ratio ?? resolveRatio(slot, record?.ratio);
  const treatment = safe(record?.treatment, SLOT_TREATMENTS, slot.treatment);
  const blend = safe(record?.blend, SLOT_BLENDS, "normal");
  const opacity = clamp(record?.opacity, 0, 100, 100);
  const scale = clamp(record?.scale, 100, 300, 100);

  const alt = decorative
    ? ""
    : (locale === "en" ? record?.altEn : record?.altTr) ||
      record?.altTr ||
      pick(slot.label, locale);

  return (
    <span
      className={[styles.frame, className].filter(Boolean).join(" ")}
      style={{ "--slot-ratio": shownRatio.replace(":", " / ") } as React.CSSProperties}
      data-slot={slot.id}
      data-empty={source ? undefined : ""}
      data-fill={fill ? "" : undefined}
      id={`slot-${slugify(slot.id)}`}
    >
      <span className={styles.clip} data-treatment={source ? treatment : undefined}>
        {source ? (
          <Image
            src={source}
            alt={alt}
            fill
            sizes={sizes ?? `${slot.size.w}px`}
            priority={slot.eager}
            style={{
              objectPosition: record?.position ?? undefined,
              opacity: opacity === 100 ? undefined : opacity / 100,
              mixBlendMode: blend === "normal" ? undefined : blend,
              scale: scale === 100 ? undefined : String(scale / 100),
            }}
          />
        ) : (
          <>
            {/* ZİYARETÇİNİN GÖRDÜĞÜ BOŞLUK — yazısız, tasarlanmış, saf CSS */}
            <span className={styles.veil} data-curator-veil aria-hidden="true">
              {slot.fallback === "silhouette" && fallback ? (
                <span className={styles.mark}>{fallback}</span>
              ) : null}
              {slot.fallback === "typographic" ? (
                <span className={styles.glyph}>{glyph ?? "呪"}</span>
              ) : null}
              <span className={styles.glow} />
              <span className={styles.grain} />
            </span>

            {/* KÜRATÖRÜN GÖRDÜĞÜ İSKELE — yalnızca yöneticinin DOM'unda */}
            {isAdmin ? (
              <span className={styles.holder} data-curator-slot aria-hidden="true">
                <span className={styles.holderMeta}>
                  {slot.size.w}×{slot.size.h} · {shownRatio}
                </span>
                <span className={styles.holderHint}>{pick(slot.hint, locale)}</span>
                <code className={styles.holderId}>{slot.id}</code>
              </span>
            ) : null}
          </>
        )}
      </span>

      {/* Künye — kaynak adı özel ad, çevrilmez; atıf kareyle seyahat eder */}
      {source && (record?.credit ?? (raw === slot.src ? slot.srcCredit : null)) ? (
        <span className={styles.credit}>
          {record?.credit ?? slot.srcCredit}
        </span>
      ) : null}

      {isAdmin && !noEdit ? (
        <CuratedSlotMount
          surface={JJK_SURFACE}
          slot={serialize(slot, locale)}
          record={record}
        />
      ) : null}
    </span>
  );
}

/**
 * YALNIZCA KÜRATÖR KALEMİ — görsel çizmeden. Yuva bir `<button>`/`<a>`
 * içindeyken kalem etkileşimli öğenin KARDEŞİ olarak çiziliyor
 * (Bleach'in 27 Ağustos ölçümü; `noEdit` + sayfa sonu manifesto turu
 * ölçülmüş bir arızaydı).
 */
export async function CuratedSlotPen({
  slotId,
  className,
}: {
  slotId: string;
  className?: string;
}) {
  const slot = slotDef(slotId);
  if (!slot) return null;

  const [images, isAdmin, locale] = await Promise.all([
    readCuratedImages(JJK_SURFACE),
    readIsAdmin(),
    getLocale(),
  ]);

  if (!isAdmin) return null;

  return (
    <span className={[styles.pen, className].filter(Boolean).join(" ")}>
      <CuratedSlotMount
        surface={JJK_SURFACE}
        slot={serialize(slot, locale)}
        record={images[slotId] ?? null}
      />
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Yardımcılar — Bleach'in birebir kardeşleri
   ══════════════════════════════════════════════════════════════════ */

function safe<T extends string>(
  value: string | null | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  return value && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

function clamp(
  value: number | null | undefined,
  min: number,
  max: number,
  fallback: number,
): number {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

/** `jjk:domain:gojo` → `jjk-domain-gojo` (HTML `id` içinde iki nokta kaçış ister) */
function slugify(id: string): string {
  return id.replace(/:/g, "-");
}

function serialize(slot: CuratedSlotDef, locale: string): CuratedSlotView {
  return {
    id: slot.id,
    label: pick(slot.label, locale),
    hint: pick(slot.hint, locale),
    size: slot.size,
    ratios: [...slot.ratios],
    defaultRatio: defaultRatio(slot),
    defaultTreatment: slot.treatment,
  };
}
