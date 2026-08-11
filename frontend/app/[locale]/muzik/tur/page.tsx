import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { fetchMusicRooms } from "@/lib/api/music";
import { genreColorVar, musicHref } from "@/lib/music/routes";
import shell from "../layout.module.css";
import styles from "./page.module.css";

/**
 * Tür odaları dizini — `/muzik/tur`.
 *
 * Tasarımda ayrı bir ekran olarak yok; 2a'daki "YOL 01 · Tür Odaları" kartı
 * buraya bağlanıyor. Kart bir yere bağlanmak zorunda ve doğrudan tek bir odaya
 * göndermek keyfi olurdu.
 *
 * ⚠️ Yalnızca ONAYLI türler listeleniyor (`isApproved`). Spotify'ın `genres`
 * alanı tutarsız olduğu için onay bekleyen tür sayısı yüksek olur ve onları
 * burada göstermek dizini varyant çöplüğüne çevirirdi ("rock", "hard rock",
 * "album rock", "post-grunge"…). Süzgeç backend'de.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "music" });
  return { title: t("paths.roomsTitle"), description: t("paths.roomsLede") };
}

export default async function MusicRoomsPage() {
  const [rooms, t] = await Promise.all([
    fetchMusicRooms(),
    getTranslations("music"),
  ]);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <Link href={musicHref.root()} className={styles.back}>
          ← {t("name")}
        </Link>
        <h1 className={`${shell.carved} ${styles.title}`}>
          {t("paths.roomsTitle")}
        </h1>
        <p className={`${shell.prose} ${styles.lede}`}>{t("paths.roomsLede")}</p>
      </header>

      {rooms.length === 0 ? (
        <p className={styles.empty}>{t("room.empty")}</p>
      ) : (
        <ul className={styles.grid}>
          {rooms.map((room) => (
            <li key={room.slug}>
              <Link
                href={musicHref.room(room.slug)}
                className={`${shell.panel} ${styles.card}`}
                style={{ borderLeftColor: genreColorVar(room.accentKey) }}
              >
                <span className={styles.name}>{room.name}</span>
                <span className={shell.label}>
                  {t("acts.count", { count: room.actCount })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
