"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/hall/Lightbox";
import { CharacterImageDelete } from "./CharacterImageDelete";
import styles from "./CharacterSections.module.css";

/**
 * Karakter galerisinin tıklanabilir katmanı.
 *
 * Galeri (`CharacterSections.Gallery`) bir SUNUCU bileşeni ve öyle kalmalı —
 * karakter dosyasındaki bütün bölümler sunucuda çiziliyor, hepsini istemciye
 * indirmenin bedeli sayfanın tamamı olurdu. Açılıp kapanan bir pencere için
 * gereken tek şey "hangi görsel açık" bilgisi; o yüzden yalnızca bu ince
 * katman istemciye iniyor. Veri hazırlığı (dil seçimi, adres kurma) hâlâ
 * sunucuda kalıyor, buraya hazır liste geliyor.
 *
 * Pencerenin kendisi film/dizi salonlarındaki `hall/Lightbox`: ikinci bir
 * modal yazmak, aynı jestin sitenin iki odasında iki farklı şey yapması
 * demekti. Sözleşmesine dokunulmuyor, burada yalnızca çağrılıyor.
 */

export interface CharacterGalleryItem {
  /** Liste anahtarı */
  key: string;
  /** Silinebilir kayıt kimliği; koddaki varsayılan görsellerde `null` */
  id: string | null;
  /**
   * Görselin TAM adresi.
   *
   * `apiUrl` sunucuda uygulanıyor: Lightbox ham `/uploads/...` yolunu
   * çözemez, ona her zaman eksiksiz adres verilmeli.
   */
  src: string;
  alt: string;
  caption: string | null;
  /** `next/image` optimizasyonu dışında mı (bkz. `isLocalUpload`) */
  unoptimized: boolean;
}

export function CharacterGalleryLightbox({
  items,
  isAdmin = false,
}: {
  items: CharacterGalleryItem[];
  isAdmin?: boolean;
}) {
  /* Açık görselin SIRASI tutuluyor, görselin kendisi değil — ileri/geri
     tuşları o sıradan yürüyor. Film sayfasındaki sahne kareleriyle birebir
     aynı sözleşme, iki yerde iki farklı durum şekli olmasın. */
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ul className={styles.gallery}>
        {items.map((item, index) => (
          <li key={item.key}>
            {/* Kutu artık bir DÜĞME: tıklayınca görselin tam boyu aynı
                sayfada açılıyor. Eskiden yeni sekmeye çıkan düz bir bağlantıydı
                — gerekçesi "sayfaya JS eklememek"ti; sahne karelerine pencere
                gelince o gerekçe düştü (bkz. `Gallery` yorumu).

                Erişilebilir ad: `alt` boşsa altyazıya düşülüyor. Küratör alt
                metni yazmadan görsel yükleyebiliyor ve adsız bir düğme, ekran
                okuyucuda yalnızca "düğme" diye okunur. */}
            <button
              type="button"
              className={styles.galleryItem}
              onClick={() => setOpenIndex(index)}
              aria-label={item.alt || item.caption || undefined}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 45vw, 220px"
                className={styles.galleryImg}
                unoptimized={item.unoptimized}
              />
            </button>
            {item.caption ? (
              <span className={styles.galleryCaption}>{item.caption}</span>
            ) : null}
            {/* Silme yalnızca veritabanı kayıtlarında: koddaki varsayılanlar
                buradan kaldırılamaz, onlar veri dosyasında duruyor. */}
            {isAdmin && item.id ? (
              <span data-curator-slot>
                <CharacterImageDelete id={item.id} />
              </span>
            ) : null}
          </li>
        ))}
      </ul>

      {/* Pencere ızgaranın KARDEŞİ, `<li>` içinde değil: her küçük hâlin
          içine bir tane koymak aynı modalı N kez çizerdi. Kaydırma kilidi,
          odak tuzağı ve Escape'in tamamı Lightbox'ın kendisinde. */}
      <Lightbox
        items={items.map((item) => ({
          src: item.src,
          alt: item.alt,
          unoptimized: item.unoptimized,
        }))}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onMove={setOpenIndex}
      />
    </>
  );
}
