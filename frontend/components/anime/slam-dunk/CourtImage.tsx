import Image from "next/image";
import { getLocale } from "next-intl/server";
import { apiUrl, isLocalUpload } from "@/lib/api/client";
import { readCuratedImages } from "@/lib/api/curated-images";
import { readIsAdmin } from "@/lib/auth/session";
import {
  SLOT_BLENDS,
  SLOT_TREATMENTS,
  type CuratedSlotView,
} from "@/lib/curated/contract";
import {
  SLAM_DUNK_SURFACE,
  defaultRatio,
  resolveRatio,
  slotDef,
  type CuratedSlotDef,
} from "@/lib/anime/slam-dunk/slots";
import { pick } from "@/lib/anime/slam-dunk/types";
import type { SlotRatio } from "@/lib/curated/contract";
import { CuratedSlotMount } from "@/components/curated/CuratedSlotMount";
import styles from "./CourtImage.module.css";

/**
 * SLAM DUNK EVRENİ — TEK GÖRSEL YUVASI.
 *
 * Sayfadaki HER kadraj bundan geçiyor; çıplak `<Image>` hiçbir yerde
 * kullanılmıyor. Sebep Bleach'tekiyle aynı: küratörün her yuvayı tek tek
 * düzenleyebilmesi, yuvanın tek bir kapıdan geçmesine bağlı.
 *
 * ── NEDEN BLEACH'İN `CuratedImage`I İMPORT EDİLMEDİ ──────────────────────
 * O bileşen `BLEACH_SURFACE`ı ve Bleach'in yuva manifestosunu SABİT olarak
 * içeriyor; yüzey bir prop değil. Daha önemlisi kullanıcı kararı
 * (28 Ağustos 2026): **Slam Dunk Bleach'in tasarım dilini paylaşmıyor.**
 * Yedek çizimler burada tamamen farklı — forma numarası, saha çizgisi,
 * takım paleti — ve o farklar bu dosyanın var olma sebebi.
 *
 * Paylaşılan tek şey KÜRATÖR ARACI: `CuratedSlotMount` → `CuratedSlotEditor`
 * (`components/curated/`). O ada zaten yüzeyi prop olarak alıyordu.
 *
 * ── NEDEN SUNUCU BİLEŞENİ ────────────────────────────────────────────────
 * Ziyaretçiye TEK BAYT JS indirmiyor. Düzenleme yeteneği ayrı bir istemci
 * adasında ve o ada YALNIZCA `isAdmin` iken çiziliyor.
 *
 * ── ÜÇ DURUM ─────────────────────────────────────────────────────────────
 *   1 GÖRSEL VAR   → kayıt çiziliyor: odak, büyütme, oran, işlem biçimi,
 *                    opaklık, blend hepsi kayıttan.
 *   2 BOŞ / GİZLİ  → yuvanın TASARLANMIŞ yedeği (forma / saha / ışık).
 *   3 KÜRATÖR MODU → yedeğin üstünde iskele: kadraj notu, boyut, kimlik.
 *
 * ⚠️ 2 ve 3'te `<img>` HİÇ BASILMIYOR. Elli dört yuvalık bir sayfada her
 * açılışta elli dört 404 üretmek hem konsolu kirletir hem bağlantı havuzunu
 * boşa harcar (futbol kanadında ölçüldü).
 */
export async function CourtImage({
  slotId,
  className,
  sizes,
  ratio,
  decorative,
  noEdit,
  fill,
}: {
  /** `SLAM_DUNK_SLOTS` içindeki kimlik */
  slotId: string;
  className?: string;
  /**
   * `next/image` sizes — SABİT px olmalı.
   *
   * ⚠️ `vw` yasak: `next.config.ts`teki ölçüm, `vw` değerlerinin gereğinden
   * büyük basamak seçtirdiğini gösteriyor. Verilmezse yuvanın önerilen
   * genişliği kullanılıyor.
   */
  sizes?: string;
  /** Yuvanın varsayılan oranını BU çizimde ez */
  ratio?: SlotRatio;
  /**
   * Oranı YOK SAY, ebeveyni doldur.
   *
   * ⚠️ CLS sorumluluğu çağırana geçiyor: oran artık yuvadan gelmediği için
   * ebeveynin kendi yüksekliğini bilmesi gerekiyor. Kart ızgarasında
   * kullanılıyor — kartın yüksekliği satırın en uzun kartından geliyor.
   */
  fill?: boolean;
  /** `alt` boş basılır: yanında zaten okunabilir metin var */
  decorative?: boolean;
  /**
   * Düzenle düğmesini BASTIR.
   *
   * Yuva bir `<button>` ya da `<a>` içindeyse zorunlu: iç içe etkileşimli
   * öğe hem geçersiz HTML hem de tıklamanın yanlış yere gitmesi demek.
   * Yerine kardeş olarak `<CourtSlotPen>` çiziliyor.
   */
  noEdit?: boolean;
}) {
  const slot = slotDef(slotId);

  /* Manifestoda karşılığı olmayan kimlik: hiçbir şey çizme. Yuva listeden
     çıkarılmış olabilir ve yarım bir çerçeve "eksik" hissi üretirdi.
     ⚠️ Bu sessiz düşüş Bleach'te bir kez GERÇEK bir arızayı sakladı
     (kimlik iki yerde ayrı yazılmıştı). Burada kimlikler `ROSTER`dan
     türetiliyor, yani o sınıf hata doğamıyor. */
  if (!slot) return null;

  const [images, isAdmin, locale] = await Promise.all([
    readCuratedImages(SLAM_DUNK_SURFACE),
    readIsAdmin(),
    getLocale(),
  ]);

  const record = images[slotId] ?? null;

  /* ⚠️ "Geçici gizle" kaydı susturuyor: niyet "bu yuvayı şimdilik gösterme",
     "veritabanı satırını sil" değil. */
  const raw = record?.isHidden ? null : (record?.url ?? null);
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
      data-team={slot.team}
      data-empty={source ? undefined : ""}
      data-fill={fill ? "" : undefined}
      id={`slot-${slugify(slot.id)}`}
    >
      {/* Kırpma YALNIZCA burada. `.frame` taşmaya izin veriyor ki küratör
          paneli küçük yuvalarda kesilmesin — futbol kanadında ölçülmüş
          arıza, aynı çözüm. */}
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
            {/* ZİYARETÇİNİN GÖRDÜĞÜ BOŞLUK — tasarlanmış, yazısız.
                Katmanların tamamı saf CSS: hiçbir dosya inmiyor. */}
            <span className={styles.veil} data-curator-veil aria-hidden="true">
              {slot.fallback === "jersey" && slot.glyph ? (
                <span className={styles.jersey}>{slot.glyph}</span>
              ) : null}
              {slot.fallback === "court" ? (
                <span className={styles.courtLines} />
              ) : null}
              <span className={styles.glow} />
              <span className={styles.grain} />
            </span>

            {/* KÜRATÖRÜN GÖRDÜĞÜ İSKELE. Yalnızca yöneticinin DOM'unda;
                anahtar kapalıyken CSS gizliyor (`CuratorFrame` mekanizması). */}
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

      {/* Künye satırı — kaynak adı bir özel ad, çevrilmiyor. Serbest lisanslı
          kareler atıf istiyor ve atıf görselle birlikte seyahat etmeli. */}
      {source && record?.credit ? (
        <span className={styles.credit}>{record.credit}</span>
      ) : null}

      {isAdmin && !noEdit ? (
        <CuratedSlotMount
          surface={SLAM_DUNK_SURFACE}
          slot={serialize(slot, locale)}
          record={record}
        />
      ) : null}
    </span>
  );
}

/**
 * YALNIZCA KÜRATÖR KALEMİ — görsel çizmeden.
 *
 * Yuva bir `<button>` ya da `<a>` İÇİNDE olduğunda kalem oraya konamıyor
 * (iç içe etkileşimli öğe). Kalem yuvanın KARDEŞİ olarak çiziliyor: HTML
 * geçerli kalıyor, yükleme alanı görselin hemen üstünde açılıyor.
 *
 * ⚠️ Bu, Bleach'te ölçülmüş bir arızanın çözümü: eskiden küratör sayfanın
 * en altındaki manifestoya inip oradan yüklüyor, sonuca bakmak için yukarı
 * çıkıyordu. Kırk beş kartlık bir sayfada aynı tur kırk beş kez tekrarlanırdı.
 */
export async function CourtSlotPen({
  slotId,
  className,
}: {
  slotId: string;
  className?: string;
}) {
  const slot = slotDef(slotId);
  if (!slot) return null;

  const [images, isAdmin, locale] = await Promise.all([
    readCuratedImages(SLAM_DUNK_SURFACE),
    readIsAdmin(),
    getLocale(),
  ]);

  /* Ziyaretçinin paketinde bu ada HİÇ yok — kesme sunucuda. */
  if (!isAdmin) return null;

  return (
    <span className={[styles.pen, className].filter(Boolean).join(" ")}>
      <CuratedSlotMount
        surface={SLAM_DUNK_SURFACE}
        slot={serialize(slot, locale)}
        record={images[slotId] ?? null}
      />
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Yardımcılar
   ══════════════════════════════════════════════════════════════════ */

/**
 * Kayıttaki değer tanınmıyorsa varsayılana düş.
 *
 * Doğrulama yazma anında da var (`SetCuratedImageDto`), ama eski bir kayıt
 * ya da listeden çıkarılmış bir değer buraya düşebilir. Sessizce varsayılana
 * dönmek doğru olan: çizim kırılmıyor, kayıt bozulmuyor.
 */
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

/** `slam-dunk:player:rukawa` → `slam-dunk-player-rukawa` (HTML `id` iki nokta sevmiyor) */
function slugify(id: string): string {
  return id.replace(/:/g, "-");
}

/** Yuva tanımının istemci adasına inen hâli — iki dilli alanlar TEK dile iner. */
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
