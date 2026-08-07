import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { ArchiveCharacter } from "@/lib/api/types";
import { CharacterHideButton } from "./CharacterHideButton";
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
}: {
  character: ArchiveCharacter;
  sizes: string;
  showSeries?: boolean;
  curating?: boolean;
}) {
  const t = useTranslations("character");
  const href = `/dark-stories/category/anime/karakterler/${character.characterId}`;
  const isMain = character.role === "MAIN";

  return (
    <article className={styles.plate}>
      {/* Bağlantının DIŞINDA: kart bir <a>, içine ikinci bir tıklanabilir
          öğe koymak geçersiz işaretleme olurdu */}
      {curating ? (
        <CharacterHideButton
          characterId={character.characterId}
          name={character.name}
        />
      ) : null}
      <Link
        href={href}
        className={styles.frame}
        // Görsel dekoratif (alt=""), bağlantının erişilebilir adı bu etiketten
        // gelir — yoksa ekran okuyucu yalnızca "bağlantı" diye okur
        aria-label={character.name}
      >
        {character.image ? (
          <Image
            src={character.image}
            alt=""
            fill
            sizes={sizes}
            className={styles.portrait}
            /* AniList görselleri `images.remotePatterns` içinde değil (yalnızca
               TMDB ve kendi sunucumuz var); optimizasyondan geçirilmek istenirse
               önce next.config.ts'e alan adı eklenmeli. Kanattaki bütün AniList
               görselleri aynı sebeple `unoptimized`. */
            unoptimized
          />
        ) : (
          <span className={styles.portraitFallback} aria-hidden>
            {character.name.slice(0, 1)}
          </span>
        )}
        {character.role ? (
          <span
            className={`${styles.rank} ${isMain ? styles.rankMain : ""}`}
          >
            {t(`role.${character.role}`)}
          </span>
        ) : null}
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
