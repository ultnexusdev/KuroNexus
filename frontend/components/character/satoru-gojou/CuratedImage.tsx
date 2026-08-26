import Image from "next/image";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import styles from "./GojoExperience.module.css";

/**
 * SATORU GOJŌ · TEK GÖRSEL YUVASI.
 *
 * Sayfadaki HER kadraj bundan geçiyor; çıplak `<Image>` hiçbir yerde
 * kullanılmıyor. Sebep BRIEF · görsel politikası: bu sayfadaki hiçbir
 * görsel indirilmiyor, üretilmiyor ya da adresi tahmin edilmiyor —
 * hepsi küratörün elle dolduracağı yuvalar.
 *
 * ── NEDEN BLEACH'İNKİ KULLANILMADI ───────────────────────────────────────
 * `components/anime/bleach/CuratedImage.tsx` aynı sözleşmeyi zaten
 * uyguluyor ve iyi uyguluyor, ama başka bir veri kaynağına bağlı:
 * `curated_images` tablosu + `BLEACH_SURFACE` yüzeyi + `BLEACH_SLOTS`
 * manifestosu. Karakter sayfaları görsellerini BAŞKA yerden okuyor —
 * karakter kaydının `ABILITY` yuvalarından (`goj:*` anahtarları,
 * `collectAbilityImages`). Bleach bileşenini buraya bağlamak ya onu
 * ikinci bir kaynağı bilecek şekilde değiştirmeyi (paylaşılan dosya,
 * sözleşme dışı) ya da Gojō'nun görsellerini yanlış tabloya yazmayı
 * gerektirirdi. Sözleşme aynı, kaynak farklı: ayrı bileşen doğru olan.
 *
 * ── ÜÇ DURUM ─────────────────────────────────────────────────────────────
 *   1 GÖRSEL VAR   → kayıt çiziliyor, oran yuvadan.
 *   2 BOŞ          → tasarlanmış boşluk. Boş kutu ya da kırık ikon YOK.
 *   3 KÜRATÖR MODU → boşluğun üstünde MANİFESTO PANELİ: yuva kimliği,
 *                    istenen kadrajın tarifi ve "eksik varlık" durumu.
 *                    Sessizce boş bırakmıyor (BRIEF şartı).
 *
 * ⚠️ 2 ve 3'te `<img>` HİÇ BASILMIYOR. Yuvaların neredeyse tamamı bugün
 * boş; her açılışta N tane 404 üretmek konsolu kirletir ve bağlantı
 * havuzunu boşa harcar (futbol kanadında ölçülmüş arıza).
 *
 * ── LAYOUT KAYMASI ───────────────────────────────────────────────────────
 * `aspect` ZORUNLU ve CSS'e `--slot-ratio` olarak iniyor. Yuva boşken de
 * tam yerini kaplıyor, yani küratör görseli bağladığında sayfa
 * zıplamıyor (CLS ≈ 0, BRIEF · kabul kriteri).
 */
export function CuratedImage({
  slotId,
  spec,
  aspect,
  src,
  alt,
  isAdmin,
  characterId,
  curatorLabel,
  statusLabel,
  glyph = "空",
  sizes,
  priority,
  unoptimized,
  className,
}: {
  /** `goj:hero` gibi kararlı, benzersiz kimlik */
  slotId: string;
  /** İstenen görselin tarifi — dönem, kadraj, açı (dile göre seçilmiş) */
  spec: string;
  /** `"16 / 9"` — layout kaymasını önleyen sabit oran */
  aspect: string;
  /** Çözülmüş mutlak adres; yoksa `null` */
  src: string | null;
  /** Boş bırakılırsa dekoratif sayılır (yanında okunabilir metin var) */
  alt?: string;
  isAdmin: boolean;
  characterId: number;
  /** Yükleme düğmesinin etiketi */
  curatorLabel: string;
  /** "eksik varlık" durum yazısı */
  statusLabel: string;
  /** Boşlukta basılan işaret — kanji ya da tek harf */
  glyph?: string;
  /**
   * `next/image` sizes — SABİT px olmalı.
   * ⚠️ `vw` yasak: ölçüm, `vw` değerlerinin gereğinden büyük basamak
   * seçtirdiğini gösteriyor (ev kuralı, next.config.ts).
   */
  sizes?: string;
  priority?: boolean;
  /**
   * AniList portresi optimize EDİLMEZ (uzak kaynak, ev kuralı).
   * Küratörün yüklediği kareler edilir.
   */
  unoptimized?: boolean;
  className?: string;
}) {
  return (
    <span
      className={[styles.slot, className].filter(Boolean).join(" ")}
      style={{ "--slot-ratio": aspect } as React.CSSProperties}
      data-slot={slotId}
      data-empty={src ? undefined : ""}
    >
      <span className={styles.slotClip}>
        {src ? (
          <Image
            className={styles.slotImage}
            src={src}
            alt={alt ?? ""}
            fill
            sizes={sizes}
            priority={priority}
            unoptimized={unoptimized}
          />
        ) : (
          <>
            {/* ZİYARETÇİNİN GÖRDÜĞÜ BOŞLUK — yazısız, tasarlanmış.
                Katmanların tamamı saf CSS: hiçbir dosya inmiyor. */}
            <span className={styles.slotVeil} aria-hidden="true">
              <span className={styles.slotGlyph}>{glyph}</span>
            </span>

            {/* KÜRATÖRÜN GÖRDÜĞÜ MANİFESTO PANELİ.
                Yalnızca yöneticinin DOM'unda; anahtar kapalıyken
                `CuratorFrame` mekanizması CSS ile gizliyor. */}
            {isAdmin ? (
              <span className={styles.slotHolder} data-curator-slot>
                <span className={styles.slotHolderMeta}>{statusLabel}</span>
                <span className={styles.slotHolderHint}>{spec}</span>
                <code className={styles.slotHolderId}>{slotId}</code>
              </span>
            ) : null}
          </>
        )}
      </span>

      {/* Yükleyici ayrı: yuva doluyken de görselin ÜSTÜNE yazabilmek
          gerekiyor, yoksa küratör beğenmediği kareyi değiştiremezdi. */}
      {isAdmin ? (
        <CuratorSlot
          characterId={characterId}
          slot="ABILITY"
          abilityName={slotId}
          label={curatorLabel}
        />
      ) : null}
    </span>
  );
}
