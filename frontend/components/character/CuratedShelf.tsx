import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { ArchiveCharacter } from "@/lib/api/types";
import { animeHref } from "@/lib/anime/routes";
import { CharacterPortraitSlot } from "./CharacterPortraitSlot";
import styles from "./CuratedShelf.module.css";

/**
 * "Elle Tasarlanmış Dosyalar" rafı — karakter dizininin üst bandı.
 *
 * Dizinin ızgarası AniList'in kadro listelerinden geliyor ve arşivdeki
 * serilerin oyuncularıyla sınırlı. Elle tasarladığımız sayfaların çoğu o
 * listede yok (Iruka, Konohamaru, Minato, Kushina, Tenten…), olanlar da
 * yüzlerce kartın arasında kayboluyordu. Bu raf onları öne çıkarıyor:
 * ziyaretçi salona girer girmez "burada gerçekten yazılmış sayfalar
 * hangileri" sorusunun cevabını görüyor.
 *
 * SUNUCU bileşeni — durum yok, tarayıcıya JS inmiyor. Dizin bileşeni
 * (`CharacterGallery`) istemci tarafında olduğu için bu düğüm ona
 * **prop olarak** geçiyor: sunucuda çizilmiş bir ağaç istemci bileşeninin
 * içinden geçebilir ve istemci paketine girmez.
 *
 * Portre çözümleme sırası `lib/characters/roster.ts`te: önce kendi
 * yüklediğimiz tam boy portre, sonra AniList kartı, ikisi de yoksa harf.
 */
export function CuratedShelf({
  roster,
  isAdmin = false,
}: {
  roster: ArchiveCharacter[];
  /**
   * Küratör yuvası ziyaretçiye HİÇ çizilmesin diye: kesme sunucuda
   * yapılıyor, yükleyici JS'i ziyaretçiye inmiyor. Yuvanın açık mı kapalı
   * mı olduğuna ise `CuratorFrame` context'i karar veriyor — dizinin
   * anahtarı bu düğümün ÜSTÜNDE (`CharacterGallery`) ve raf sunucuda
   * çizildiği için prop olarak inemez.
   */
  isAdmin?: boolean;
}) {
  const t = useTranslations("character.curated");

  if (roster.length === 0) {
    return null;
  }

  return (
    <section className={styles.shelf} aria-labelledby="curated-title">
      <header className={styles.head}>
        <div>
          <h2 id="curated-title" className={styles.title}>
            {t("title")}
          </h2>
          <p className={styles.lede}>{t("lede")}</p>
        </div>
        <span className={styles.count}>{t("count", { count: roster.length })}</span>
      </header>

      <ul className={styles.grid}>
        {roster.map((character) => {
          /* Kendi yüklediğimiz portreler `next/image`den geçebilir (kendi
             alan adımız `remotePatterns` listesinde). AniList görselleri
             listede olmadığı için `unoptimized` kalmak ZORUNDA. */
          const kendiYuklememiz = (character.image ?? "").includes("/uploads/");
          return (
            <li key={character.characterId} className={styles.item}>
              {/* Bağlantının DIŞINDA: kart bir <a>, içine ikinci bir
                  tıklanabilir öğe koymak geçersiz işaretleme olurdu
                  (künye kartındaki kaldırma düğmesiyle aynı gerekçe). */}
              {isAdmin ? (
                <CharacterPortraitSlot
                  characterId={character.characterId}
                  name={character.name}
                />
              ) : null}
              <Link
                href={animeHref.character(character.characterId)}
                className={styles.card}
                aria-label={character.name}
              >
                <span className={styles.frame} aria-hidden>
                  {character.image ? (
                    <Image
                      src={character.image}
                      alt=""
                      fill
                      sizes="(max-width: 620px) 44vw, (max-width: 1100px) 22vw, 12vw"
                      className={styles.portrait}
                      unoptimized={!kendiYuklememiz}
                    />
                  ) : (
                    <span className={styles.fallback}>
                      {character.name.slice(0, 1)}
                    </span>
                  )}
                  <span className={styles.scrim} />
                </span>
                <span className={styles.body}>
                  <span className={styles.name}>{character.name}</span>
                  <span className={styles.native} lang="ja">
                    {character.nameNative}
                  </span>
                  <span className={styles.series}>
                    {character.series.map((item) => item.title).join(" · ")}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
