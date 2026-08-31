import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import type { ArchiveCharacter } from "@/lib/api/types";
import { CharacterHideButton } from "./CharacterHideButton";
import { CharacterPortraitSlot } from "./CharacterPortraitSlot";
import styles from "./CharacterPlate.module.css";

/**
 * Karakter levhası — dizinde ve karakter dosyasının "yakındaki karakterler"
 * şeridinde aynı bileşen kullanılır.
 *
 * Bilinçli olarak **medya-bağımsız**: props'ta `anilistId` yok, `characterId`
 * var. Film/dizi karakterleri TMDB'den geldiğinde bu bileşen değişmeden aynı
 * şekli doldurabilir — tek gereken `ArchiveCharacter` üretmek.
 *
 * "use client" YOK: kart hiçbir durum tutmuyor, sadece çiziyor. Karakter
 * dosyasından (sunucu bileşeni) çağrıldığında sunucuda kalıyor ve tarayıcıya
 * hiç JS gitmiyor; dizinden (süzgeç yüzünden istemci) çağrıldığında istemci
 * paketine giriyor. Tek bileşen, iki bağlam — ikisinde de çalışması için
 * sunucuya özgü API kullanmıyor.
 */
export function CharacterPlate({
  character,
  sizes,
  /** Kartın altında seri adı yazılsın mı (dosya sayfasında zaten belli). */
  showSeries = true,
  /** Küratör modu açıkken portrenin sağ üstünde "kaldır" düğmesi çıkar. */
  curating = false,
  /** Küratör bu karakteri zaten kaldırdıysa düğme "geri al" olarak açılır. */
  hidden = false,
  /**
   * Gizleme/geri alma isteği BAŞARIYLA bittiğinde çağrılır.
   *
   * Kart bunu kendi başına kullanmıyor, yalnızca yukarı taşıyor: hangi
   * karakterin ızgaradan düşeceğine listeyi kuran bileşen karar veriyor
   * (`CharacterGallery`). Kartın dosya sayfasındaki kullanımı bu prop'u hiç
   * vermiyor — küratör düğmesi orada zaten çizilmiyor.
   */
  onHiddenChange,
}: {
  character: ArchiveCharacter;
  sizes: string;
  showSeries?: boolean;
  curating?: boolean;
  hidden?: boolean;
  onHiddenChange?: (characterId: number, hidden: boolean) => void;
}) {
  const href = `/dark-stories/category/anime/karakterler/${character.characterId}`;

  /*
   * Portre iki kaynaktan gelebiliyor: küratörün yüklediği kare (kendi
   * sunucumuz, `/uploads/...` göreli) ya da AniList kartı (mutlak adres).
   * Backend yükleme varsa `image` alanına ONU yazıyor (`withPortraits`),
   * yani buradaki tek iş göreli adresi çözmek.
   *
   * ⚠️ `unoptimized` AYRIMI GEREKLİ: kendi alan adımız `remotePatterns`
   * listesinde, AniList değil. Yüklenen kareyi optimize etmemek boşuna
   * bant genişliği, AniList'i optimize etmeye kalkmak ise çalışma
   * zamanında hata. Aynı ayrım rafta da yazılı (`CuratedShelf`).
   */
  const kendiYuklememiz = (character.image ?? "").startsWith("/uploads/");
  const portrait = kendiYuklememiz
    ? apiUrl(character.image as string)
    : character.image;

  /* ROL ROZETİ YOK (24 Ağustos 2026, kullanıcı kararı: "başrol/yardımcı
     yazan kısımların bir önemi yok"). `character.role` alanı veri modelinde
     duruyor — AniList'ten geliyor ve künye sayfası onu başka yerde
     kullanabilir — ama kartta çizilmiyor. */

  return (
    <article className={styles.plate}>
      {/* Bağlantının DIŞINDA: kart bir <a>, içine ikinci bir tıklanabilir
          öğe koymak geçersiz işaretleme olurdu */}
      {curating ? (
        <CharacterHideButton
          characterId={character.characterId}
          name={character.name}
          defaultHidden={hidden}
          onChange={onHiddenChange}
        />
      ) : null}
      {/* Portre yuvası — kaldırma düğmesinin karşı köşesinde. Küratör
          kartın boş olduğunu gördüğü yerde dolduruyor; eskiden karakterin
          kendi sayfasına gitmek gerekiyordu ve künye kartlarının sayfası
          zaten yok (kullanıcı isteği, 31 Ağustos 2026). */}
      {curating ? (
        <CharacterPortraitSlot
          characterId={character.characterId}
          name={character.name}
          curating
        />
      ) : null}
      <Link
        href={href}
        className={styles.frame}
        // Görsel dekoratif (alt=""), bağlantının erişilebilir adı bu etiketten
        // gelir — yoksa ekran okuyucu yalnızca "bağlantı" diye okur
        aria-label={character.name}
      >
        {portrait ? (
          <Image
            src={portrait}
            alt=""
            fill
            sizes={sizes}
            className={styles.portrait}
            /* AniList görselleri `images.remotePatterns` içinde değil (yalnızca
               TMDB ve kendi sunucumuz var); optimizasyondan geçirilmek istenirse
               önce next.config.ts'e alan adı eklenmeli. Kanattaki bütün AniList
               görselleri aynı sebeple `unoptimized`. Kendi yüklediğimiz kare
               ise listede: o optimizasyondan GEÇİYOR — küratörün yüklediği
               tam boy dosya ızgarada 150 px'e inecek. */
            unoptimized={!kendiYuklememiz}
          />
        ) : (
          <span className={styles.portraitFallback} aria-hidden>
            {character.name.slice(0, 1)}
          </span>
        )}
      </Link>

      <div className={styles.label}>
        <h3 className={styles.name}>
          <Link href={href} className={styles.nameLink}>
            {character.name}
          </Link>
        </h3>
        {character.nameNative ? (
          // lang işareti şart: ekran okuyucu ve tarayıcı, 漢字'yi Japonca
          // olarak ele alsın (satır kesme kuralları da buna bağlı)
          <span className={styles.native} lang="ja">
            {character.nameNative}
          </span>
        ) : null}
        {showSeries && character.series.length > 0 ? (
          <p className={styles.series}>
            {character.series.map((item) => item.title).join(" · ")}
          </p>
        ) : null}
      </div>
    </article>
  );
}
