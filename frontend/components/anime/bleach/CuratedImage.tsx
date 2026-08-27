import type { ReactNode } from "react";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import { apiUrl, isLocalUpload } from "@/lib/api/client";
import { readCuratedImages } from "@/lib/api/curated-images";
import { readIsAdmin } from "@/lib/auth/session";
import {
  BLEACH_SURFACE,
  defaultRatio,
  resolveRatio,
  slotDef,
  SLOT_BLENDS,
  SLOT_TREATMENTS,
  type CuratedSlotDef,
  type SlotRatio,
} from "@/lib/anime/bleach/slots";
import { pick } from "@/lib/anime/bleach/types";
import { CuratedSlotMount } from "./CuratedSlotMount";
import styles from "./CuratedImage.module.css";

/**
 * BLEACH EVRENİ — TEK GÖRSEL YUVASI.
 *
 * Sayfadaki HER kadraj bundan geçiyor. Çıplak `<Image>` hiçbir yerde
 * kullanılmıyor (kullanıcı komutu, 23 Ağustos 2026) — çünkü küratörün her
 * yuvayı tek tek düzenleyebilmesi, yuvanın tek bir kapıdan geçmesine bağlı.
 *
 * ── NEDEN SUNUCU BİLEŞENİ ────────────────────────────────────────────────
 * Futbol kanadının `PlayerImage`ı `"use client"` ve sayfadaki her görseli bir
 * istemci yaprağına çeviriyor. Bleach'in şartı "küratör modu kapalıyken sıfır
 * ekstra JS" olduğu için o desen olduğu gibi alınamazdı.
 *
 * Bu bileşen sunucuda çiziliyor ve ziyaretçiye TEK BAYT JS indirmiyor.
 * Düzenleme yeteneği ayrı bir istemci adasında (`CuratedSlotMount` →
 * `CuratedSlotEditor`) ve o ada YALNIZCA `isAdmin` iken çiziliyor — yani
 * ziyaretçinin paketinde hiç yok.
 *
 * ── PROP DRILLING YOK, CONTEXT DE YOK ────────────────────────────────────
 * Yuva haritasını ve yönetici bayrağını prop olarak almıyor; ikisini de
 * kendisi okuyor. İkisi de `cache()`li (`readCuratedImages`, `readIsAdmin`),
 * yani altmış yuva tek istek ediyor. Context kullanmak sayfayı istemci
 * sınırına çekerdi — `CuratorFrame` başlığındaki aynı gerekçe.
 *
 * ── ÜÇ DURUM ─────────────────────────────────────────────────────────────
 *   1 GÖRSEL VAR      → kayıt çiziliyor: odak noktası, büyütme, oran, işlem
 *                       biçimi, opaklık, blend hepsi kayıttan.
 *   2 BOŞ / GİZLİ     → yuvanın TASARLANMIŞ yedeği. Boş kutu asla yok.
 *   3 KÜRATÖR MODU    → yedeğin yerine iskele: kadraj notu, önerilen boyut,
 *                       oran ve yuva kimliği. Yalnızca yöneticinin DOM'unda.
 *
 * ⚠️ 2 ve 3'te `<img>` HİÇ BASILMIYOR. Altmış yuvalık bir sayfada her
 * açılışta altmış 404 üretmek hem konsolu kirletir hem bağlantı havuzunu
 * boşa harcar (futbol kanadında ölçüldü).
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
  /** `BLEACH_SLOTS` içindeki kimlik */
  slotId: string;
  className?: string;
  /**
   * `next/image` sizes — SABİT px olmalı.
   *
   * ⚠️ `vw` yasak: next.config.ts'teki ölçüm, `vw` değerlerinin gereğinden
   * büyük basamak seçtirdiğini gösteriyor. Verilmezse yuvanın önerilen
   * genişliği kullanılıyor.
   */
  sizes?: string;
  /** Yuvanın varsayılan oranını BU çizimde ez (aynı görsel iki farklı kutuda) */
  ratio?: SlotRatio;
  /**
   * Oranı YOK SAY, ebeveyni doldur.
   *
   * Kadrajı dışarıdaki düzen belirlediğinde gerekiyor. İlk kullanıcı hero:
   * tek görsel dört dikey şeride bölünüyor ve her şerit görselin dörtte
   * birini gösteriyor — yani şeridin oranı yuvanın oranı DEĞİL. Aynı
   * ihtiyaç Bankai nişlerinde ve Espada maske parçalarında da olacak.
   *
   * ⚠️ CLS sorumluluğu çağırana geçiyor: oran artık yuvadan gelmediği için
   * ebeveynin kendi yüksekliğini bilmesi gerekiyor.
   */
  fill?: boolean;
  /** `typographic` yedeğinde basılacak işaret — kanji ya da tek harf */
  glyph?: string;
  /** `alt` boş basılır: yanında zaten okunabilir metin var */
  decorative?: boolean;
  /**
   * Düzenle düğmesini BASTIR.
   *
   * Yuva bir `<button>` ya da `<a>` içindeyse gerekli: iç içe etkileşimli öğe
   * hem geçersiz HTML hem de tıklamanın yanlış yere gitmesi demek. Aynı yuva
   * manifesto panelinden zaten düzenlenebiliyor, yani kayıp yok.
   */
  noEdit?: boolean;
  /** `silhouette` yedeği yerine bölüme özel SVG */
  fallback?: ReactNode;
}) {
  const slot = slotDef(slotId);

  /* Manifestoda karşılığı olmayan kimlik: hiçbir şey çizme.
     Sessiz düşmek doğru olan — yuva listeden çıkarılmış olabilir ve yarım
     bir çerçeve göstermek "eksik" hissi üretirdi. Küratör panelinde yetim
     kayıt olarak zaten görünüyor. */
  if (!slot) return null;

  const [images, isAdmin, locale] = await Promise.all([
    readCuratedImages(BLEACH_SURFACE),
    readIsAdmin(),
    getLocale(),
  ]);

  const record = images[slotId] ?? null;

  /* ⚠️ İKİ FARKLI ORIGIN. Küratörün yüklediği kareler (`/uploads/…`) API
     sunucusunda, depodaki varlıklar (`/assets/…`) ön yüzde. `isLocalUpload`
     ayrımı tek yerden yapıyor — kitap kapakları ve futbolcu kareleri de aynı
     yardımcıyı bu gerekçeyle kullanıyor.

     ── ÜÇ KAYNAK, TEK SIRA ────────────────────────────────────────────────
       1. Küratörün yüklediği kare  (veritabanı)
       2. DEPODAKİ varsayılan       (`slot.src`)
       3. Hiçbiri                   → tasarlanmış yedek

     İkinci basamak, futbol defterindeki `PlayerImageSlot.src` deseninin
     aynısı: sayfa ilk günden görselli açılabiliyor ve küratör beğenmezse
     üstüne yazıyor. Küratör kaydı DAİMA kazanıyor — depoya konan kare bir
     varsayılan, bir kilit değil.

     ⚠️ "Geçici gizle" ikisini birden susturuyor: niyet "bu yuvayı şimdilik
     gösterme", "veritabanı kaydını atla" değil. */
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
      {/* Kırpma YALNIZCA burada. `.frame` taşmaya izin veriyor ki küratör
          paneli küçük yuvalarda (maske, arma) kesilmesin — futbol kanadında
          ölçülmüş arıza, aynı çözüm. */}
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
            {/* ZİYARETÇİNİN GÖRDÜĞÜ BOŞLUK — yazısız, tasarlanmış.
                Katmanların tamamı saf CSS: hiçbir dosya inmiyor. */}
            <span className={styles.veil} data-curator-veil aria-hidden="true">
              {slot.fallback === "silhouette" && fallback ? (
                <span className={styles.mark}>{fallback}</span>
              ) : null}
              {slot.fallback === "typographic" ? (
                <span className={styles.glyph}>{glyph ?? "空"}</span>
              ) : null}
              <span className={styles.glow} />
              <span className={styles.grain} />
            </span>

            {/* KÜRATÖRÜN GÖRDÜĞÜ İSKELE — kadraj notu, boyut, oran, kimlik.
                Yalnızca yöneticinin DOM'unda; anahtar kapalıyken CSS gizliyor
                (`CuratorFrame` mekanizması). */}
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

      {/* Künye satırı — kaynak adı bir özel ad, çevrilmiyor.
          Küratörün yazdığı künye önce gelir; yoksa depodaki varsayılan
          karenin künyesi basılır. ⚠️ Serbest lisanslı kareler atıf
          istiyor ve atıf görselle birlikte seyahat etmeli. */}
      {source && (record?.credit ?? (raw === slot.src ? slot.srcCredit : null)) ? (
        <span className={styles.credit}>
          {record?.credit ?? slot.srcCredit}
        </span>
      ) : null}

      {isAdmin && !noEdit ? (
        <CuratedSlotMount
          surface={BLEACH_SURFACE}
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
 * ── NEDEN AYRI BİR BİLEŞEN ───────────────────────────────────────────────
 * Bazı yuvalar bir `<button>` ya da `<a>` İÇİNDE duruyor (Gotei kapıları,
 * Bankai nişleri). Kalemin kendisi de bir `<button>` olduğu için oraya
 * konamıyor — iç içe etkileşimli öğe hem geçersiz HTML hem de tıklamanın
 * yanlış yere gitmesi demek. Çözüm o güne kadar `noEdit` idi: yuva sayfada
 * düzenlenemiyor, küratör sayfanın EN ALTINDAKİ manifestoya inip oradan
 * yüklüyordu.
 *
 * ⚠️ Bu, ölçülmüş bir arıza: on altı bölümlük bir sayfada "yükle → yukarı
 * çık → sonuca bak → aşağı in" turu her kare için tekrarlanıyordu
 * (kullanıcı bildirimi, 27 Ağustos 2026). Kalem artık yuvanın YANINDA,
 * etkileşimli öğenin KARDEŞİ olarak çiziliyor: HTML geçerli kalıyor,
 * yükleme alanı görselin hemen üstünde açılıyor ve sayfa hiç kaymıyor.
 *
 * Görseli çizmiyor: kadraj yine `<CuratedImage … noEdit />` ile geliyor.
 * İkisi aynı `cache()`li okumayı paylaşıyor, yani ek istek yok.
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
    readCuratedImages(BLEACH_SURFACE),
    readIsAdmin(),
    getLocale(),
  ]);

  /* Ziyaretçinin paketinde bu ada HİÇ yok — kesme sunucuda. */
  if (!isAdmin) return null;

  return (
    <span className={[styles.pen, className].filter(Boolean).join(" ")}>
      <CuratedSlotMount
        surface={BLEACH_SURFACE}
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

/** `bleach:gotei:8` → `bleach-gotei-8` (HTML `id` içinde iki nokta kaçış ister) */
function slugify(id: string): string {
  return id.replace(/:/g, "-");
}

/**
 * Yuva tanımının istemci adasına inen hâli.
 *
 * Tanımın tamamı geçmiyor: ada yalnızca etiketleri, izin verilen oranları ve
 * varsayılanları kullanıyor. İki dilli alanlar burada TEK dile indiriliyor —
 * adaya sözlük göndermek gereksiz bayt olurdu.
 */
function serialize(slot: CuratedSlotDef, locale: string) {
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

export type CuratedSlotView = ReturnType<typeof serialize>;
