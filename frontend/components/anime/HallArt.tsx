import Image from "next/image";
import { getLocale } from "next-intl/server";
import { apiUrl, isLocalUpload } from "@/lib/api/client";
import { readCuratedImages } from "@/lib/api/curated-images";
import { readIsAdmin } from "@/lib/auth/session";
import {
  SLOT_BLENDS,
  type CuratedSlotView,
  type SlotBlend,
} from "@/lib/curated/contract";
import {
  ANIME_HALL_SURFACE,
  hallPick,
  hallRatio,
  hallSlotDef,
  type HallSlotDef,
} from "@/lib/anime/hall-slots";
import { CuratedSlotMount } from "@/components/curated/CuratedSlotMount";
import styles from "./HallArt.module.css";

/**
 * ANİME SALONU — KART FONU YUVASI.
 *
 * ── NEDEN BLEACH'İN `CuratedImage`I DEĞİL ────────────────────────────────
 * O bileşen yuvanın KENDİ kutusunu çiziyor: oranı, tasarlanmış boşluğu,
 * künye satırı, kap sorgusu. Salon kartlarında bunların hiçbiri
 * istenmiyor — kare kartın ARKA FONU, kartın kendi yüksekliğini dolduruyor
 * ve boşken kart zaten tasarlanmış (kanji rozeti + metin). Yuva orada bir
 * çerçeve çizseydi kartın içine ikinci bir kutu girerdi.
 *
 * Bu yüzden burada yalnızca `fill` bir `<Image>` var. Paylaşılan tek şey
 * küratör aracı: `CuratedSlotMount` → `CuratedSlotEditor`.
 *
 * ── ⚠️ ESKİ KARELERE DÜŞÜYOR ─────────────────────────────────────────────
 * `fallbackUrl` geçişin tamamı: salonun hero'su ve üç kart, karakter
 * görselleri mekanizmasından (`EXHIBIT_IMAGE_KEYS`) geliyordu. Yeni yüzey
 * boşken o kareler çizilmeye devam ediyor; küratör üstüne yazdığı anda
 * kayıt kazanıyor. Yani hiçbir şey kaybolmuyor ve geçiş tek yönlü.
 *
 * ── NEDEN SUNUCU BİLEŞENİ ────────────────────────────────────────────────
 * Ziyaretçiye tek bayt JS inmiyor. Düzenleme yeteneği ayrı bir istemci
 * adasında (`HallSlotPen`) ve o ada YALNIZCA `isAdmin` iken çiziliyor.
 */
export async function HallArt({
  slotId,
  fallbackUrl,
  className,
  sizes,
  priority,
}: {
  /** `ANIME_HALL_SLOTS` içindeki kimlik */
  slotId: string;
  /** Küratör yuvası boşken çizilecek ESKİ kare (`EXHIBIT_IMAGE_KEYS`) */
  fallbackUrl?: string | null;
  className?: string;
  /**
   * `next/image` sizes — SABİT px olmalı.
   *
   * ⚠️ `vw` yasak: `next.config.ts`teki ölçüm, `vw` değerlerinin gereğinden
   * büyük basamak seçtirdiğini gösteriyor.
   */
  sizes: string;
  priority?: boolean;
}) {
  const src = await hallArtSrc(slotId, fallbackUrl);
  if (!src) return null;

  return (
    <span
      className={[styles.art, className].filter(Boolean).join(" ")}
      aria-hidden
    >
      <Image
        src={src.url}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        style={src.style}
      />
    </span>
  );
}

/**
 * YALNIZCA KÜRATÖR KALEMİ — kare çizmeden.
 *
 * ── NEDEN AYRI ───────────────────────────────────────────────────────────
 * Kartların hepsi bir `<a>`. Kalem de bir `<button>` olduğu için içine
 * konamaz: iç içe etkileşimli öğe hem geçersiz HTML hem de tıklamanın
 * yanlış yere gitmesi demek. Kalem bu yüzden kartın KARDEŞİ olarak
 * çiziliyor (Bleach'teki `CuratedSlotPen`in aynı gerekçesi).
 *
 * ⚠️ KARE OLMASA DA ÇİZİLİYOR. Slam Dunk kartında hiç görsel yok ve
 * kullanıcının bildirdiği sorun tam olarak buydu: bağlanacak bir `<img>`
 * olmadığı için o karta hiçbir yerden kare konamıyordu. Kalem kareye değil
 * YUVAYA bağlı, yani boş kart da doldurulabiliyor.
 */
export async function HallSlotPen({
  slotId,
  className,
}: {
  slotId: string;
  className?: string;
}) {
  const slot = hallSlotDef(slotId);
  if (!slot) return null;

  const [images, isAdmin, locale] = await Promise.all([
    readCuratedImages(ANIME_HALL_SURFACE),
    readIsAdmin(),
    getLocale(),
  ]);

  /* Ziyaretçinin paketinde bu ada HİÇ yok — kesme sunucuda. */
  if (!isAdmin) return null;

  return (
    <span className={[styles.pen, className].filter(Boolean).join(" ")}>
      <CuratedSlotMount
        surface={ANIME_HALL_SURFACE}
        slot={serialize(slot, locale)}
        record={images[slotId] ?? null}
      />
    </span>
  );
}

/**
 * Yuvanın çizilecek adresi ve kayıttan gelen görünüm ayarları.
 *
 * ⚠️ AYRI BİR DIŞA AKTARIM ÇÜNKÜ BLEACH KARTI KAREYİ İKİ KEZ ÇİZİYOR:
 * hover'da yarılan iki yarı aynı görselin iki kopyası ve her biri kendi
 * `clip-path`ini taşıyor. `HallArt` tek bir kare çizdiği için orada
 * kullanılamıyor; kart adresi buradan alıp kendi iki kopyasını çiziyor.
 * Aynı `cache()`li okumayı paylaşıyorlar, yani ek istek yok.
 */
export async function hallArtSrc(
  slotId: string,
  fallbackUrl?: string | null,
): Promise<{ url: string; style: React.CSSProperties } | null> {
  const slot = hallSlotDef(slotId);
  if (!slot) return null;

  const images = await readCuratedImages(ANIME_HALL_SURFACE);
  const record = images[slotId] ?? null;

  /* ⚠️ "Geçici gizle" ESKİ KAREYİ DE susturuyor: niyet "bu kartta şimdilik
     görsel olmasın", "veritabanı kaydını atla" değil. Aksi hâlde küratör
     yuvayı gizler, kart yine dolu görünürdü. */
  const raw = record?.isHidden ? null : (record?.url ?? fallbackUrl ?? null);
  if (!raw) return null;

  const opacity = clamp(record?.opacity, 0, 100, 100);
  const scale = clamp(record?.scale, 100, 300, 100);
  /* Kayıttaki değer tanınmıyorsa sessizce varsayılana düş: eski bir kayıt
     ya da listeden çıkarılmış bir kip buraya düşebilir ve çizimi kırmamalı. */
  const blend: SlotBlend =
    record?.blend && (SLOT_BLENDS as readonly string[]).includes(record.blend)
      ? (record.blend as SlotBlend)
      : "normal";

  /* ⚠️ `treatment` ve `ratio` BU YÜZEYDE UYGULANMIYOR ve bu bilinçli:
     kare kartın arka fonu, kendi kutusu yok — yükseklik kartın kendisinden
     geliyor ve `object-fit: cover` kırpıyor. İşlem biçimlerini (siluet /
     duotone) uygulamak da yanlış olurdu: kartların üstünde zaten sayfanın
     kendi karartma maskesi ve doygunluk filtresi var, ikisi çarpışırdı.
     Panelde o iki sekme yine görünüyor ama sonucu değiştirmiyor — kayıt
     bozulmuyor, yalnızca burada okunmuyor. */
  return {
    url: isLocalUpload(raw) ? apiUrl(raw) : raw,
    style: {
      objectPosition: record?.position ?? undefined,
      opacity: opacity === 100 ? undefined : opacity / 100,
      mixBlendMode: blend === "normal" ? undefined : blend,
      scale: scale === 100 ? undefined : String(scale / 100),
    },
  };
}

/* ══════════════════════════════════════════════════════════════════
   Yardımcılar
   ══════════════════════════════════════════════════════════════════ */

function clamp(
  value: number | null | undefined,
  min: number,
  max: number,
  fallback: number,
): number {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

/**
 * Yuva tanımının istemci adasına inen hâli. İki dilli alanlar burada TEK
 * dile iniyor — adaya sözlük göndermek gereksiz bayt olurdu.
 */
function serialize(slot: HallSlotDef, locale: string): CuratedSlotView {
  return {
    id: slot.id,
    label: hallPick(slot.label, locale),
    hint: hallPick(slot.hint, locale),
    size: slot.size,
    ratios: [...slot.ratios],
    defaultRatio: hallRatio(slot, null),
    defaultTreatment: "photo",
  };
}
