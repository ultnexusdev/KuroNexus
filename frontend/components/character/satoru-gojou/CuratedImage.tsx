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
  noEdit,
  fill,
  optional,
  ariaHidden,
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
  /**
   * Yükleme düğmesini BASTIR.
   *
   * Yuva bir `<button>` ya da `<a>` içindeyse zorunlu: iç içe etkileşimli
   * öğe hem geçersiz HTML hem de tıklamanın yanlış yere gitmesi demek.
   * ⚠️ Bunu kullanan yer, aynı yuvayı düzenlenebilir hâlde BAŞKA bir
   * konumda da çizmek zorunda — yoksa küratörün o yuvaya erişimi hiç
   * kalmaz. Emsal: P08'in düğüm siluetleri (düğmede `noEdit`, küratör
   * şeridinde düzenlenebilir).
   */
  noEdit?: boolean;
  /**
   * Oranı YOK SAY, ebeveyni doldur.
   *
   * Kadrajı dışarıdaki düzen belirlediğinde gerekiyor. İlk kullanıcı
   * hero'nun iki durumlu yığını: üç katman aynı kutuda üst üste duruyor
   * ve kutunun oranını yığın veriyor.
   *
   * ⚠️ CLS sorumluluğu çağırana geçiyor — oran artık yuvadan gelmediği
   * için ebeveynin kendi yüksekliğini bilmesi şart.
   */
  fill?: boolean;
  /**
   * Yuva BOŞSA hiçbir şey çizme.
   *
   * Varsayılan davranış boş yuvada tasarlanmış boşluğu ve (yöneticide)
   * manifesto panelini çizmek — çünkü eksik varlık sessizce geçilmemeli.
   * Ama bazı yuvalar gerçekten isteğe bağlı ve eksikliği bir kusur değil;
   * onlarda "EKSİK VARLIK" uyarısı yanlış alarm olurdu. İlk kullanıcı
   * hero'nun aura katmanı.
   *
   * ⚠️ Küratörün o yuvaya erişebilmesi için çağıranın yükleyiciyi BAŞKA
   * bir yerde çizmesi şart (hero'da yönetici şeridi).
   */
  optional?: boolean;
  /**
   * Yuvayı erişilebilirlik ağacından tamamen gizle.
   *
   * Kadraj TEK BAŞINA bir figür değil, daha büyük bir figürün katmanıysa
   * gerekiyor: hero'nun iki durumlu portresinde üç katman var ve ekran
   * okuyucuya tek bir ad verilmeli. `role="img"` taşıyan kap alt ağacı
   * zaten yaprak yapıyor, ama bunu ayrıca yazmak davranışı tarayıcı
   * yorumuna bırakmıyor.
   */
  ariaHidden?: boolean;
  className?: string;
}) {
  /* İsteğe bağlı ve boş: ne boşluk ne panel. Hiç yokmuş gibi. */
  if (optional && !src) return null;

  return (
    <div
      className={[styles.slotWrap, fill ? styles.slotWrapFill : null, className]
        .filter(Boolean)
        .join(" ")}
      aria-hidden={ariaHidden ? "true" : undefined}
    >
      <span
        className={styles.slot}
        style={{ "--slot-ratio": aspect } as React.CSSProperties}
        data-slot={slotId}
        data-empty={src ? undefined : ""}
        data-fill={fill ? "" : undefined}
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
            {/* `data-curator-veil`: kürator modu AÇIKKEN bu tasarlanmış
                boşluk gizleniyor ve yerini iskele alıyor (`CuratorFrame`
                mekanizması). İşaret eksikti — ikisi üst üste görünüyordu. */}
            <span
              className={styles.slotVeil}
              data-curator-veil
              aria-hidden="true"
            >
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
      </span>

      {/* ⚠️ YÜKLEYİCİ KADRAJIN DIŞINDA, NORMAL AKIŞTA.
          İlk sürümde `.slot`un İÇİNDEYDİ ve hiç görünmüyordu — iki
          sebepten: (1) `.slotClip` mutlak konumlu olduğu için akıştaki
          yükleyicinin ÜSTÜNE boyanıyordu, (2) `CuratorSlot` bir `<div>`
          çiziyor ve `<span>` içinde `<div>` geçersiz HTML. Ev emsali de
          böyle: çalışan sayfalar yükleyiciyi kadrajın yanında ayrı bir
          satırda çiziyor (`RatioExperience` → `.slotRow`).

          Yuva doluyken de çiziliyor: küratörün beğenmediği kareyi
          değiştirebilmesi gerekiyor. */}
      {isAdmin && !noEdit ? (
        <div className={styles.slotEditor}>
          <CuratorSlot
            characterId={characterId}
            slot="ABILITY"
            abilityName={slotId}
            label={curatorLabel}
          />
        </div>
      ) : null}
    </div>
  );
}
