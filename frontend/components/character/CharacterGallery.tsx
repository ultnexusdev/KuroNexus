"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/lib/i18n/navigation";
import type { CharacterIndex } from "@/lib/api/types";
import { CharacterPlate } from "./CharacterPlate";
import styles from "./CharacterGallery.module.css";

/**
 * Portre kanadı — arşivdeki bütün serilerin kadroları tek ızgarada.
 *
 * Süzgeçleme tarayıcıda: liste birkaç yüz kayıt, sunucuya gidip gelmek her
 * tuş vuruşunda ağ turu demek olurdu. Aynı karar anime salonunda da alınmış
 * (`AnimeHall`), aynı sebeple.
 */
export function CharacterGallery({
  index,
  hallLabel,
  hallName,
}: {
  index: CharacterIndex;
  hallLabel: string;
  hallName: string;
}) {
  const t = useTranslations("character");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState<string | null>(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr");
    return index.characters.filter((character) => {
      if (series && !character.series.some((item) => item.slug === series)) {
        return false;
      }
      if (!needle) {
        return true;
      }
      // Ana dildeki ad ve seslendiren de aranıyor: "更木" ya da bir seiyuu
      // adıyla arayan biri sonuç bulamazsa arama kutusu bozuk görünür
      return (
        character.name.toLocaleLowerCase("tr").includes(needle) ||
        (character.nameNative ?? "").includes(needle) ||
        (character.voiceActor ?? "").toLocaleLowerCase("tr").includes(needle) ||
        character.series.some((item) =>
          item.title.toLocaleLowerCase("tr").includes(needle),
        )
      );
    });
  }, [index.characters, query, series]);

  /**
   * "Rastgele bir dosya çek" — müzenin kendi jesti: çekmeceden gelişigüzel
   * bir künye. Süzgeç açıksa **görünen** listeden seçer; yoksa buton bir
   * seriyi süzüp başka seriden karakter açardı.
   */
  const openRandom = () => {
    if (visible.length === 0) {
      return;
    }
    const pick = visible[Math.floor(Math.random() * visible.length)];
    router.push(
      `/dark-stories/category/anime/karakterler/${pick.characterId}`,
    );
  };

  const isFiltered = query.trim().length > 0 || series !== null;

  return (
    <div className={styles.hall} data-category="anime">
      <div className={styles.page}>
        <header className={styles.head}>
          {/* Salon girişine döner, arşive değil: bu oda oraya bağlı
              (lobideki bölüm listesi bu sayfanın kapısı) */}
          <Link href="/dark-stories/category/anime" className={styles.back}>
            {t("backToArchive")}
          </Link>
          <span className={styles.eyebrow}>
            {hallLabel ? `${hallLabel} · ${hallName}` : hallName}
          </span>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.lede}>{t("lede")}</p>
        </header>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{t("stats.characters")}</span>
            <span className={styles.statValue}>{index.stats.characters}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{t("stats.main")}</span>
            <span className={styles.statValue}>{index.stats.main}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{t("stats.series")}</span>
            <span className={styles.statValue}>{index.stats.series}</span>
          </div>
        </div>

        {index.characters.length > 0 ? (
          <>
            <div className={styles.tools}>
              <label className={styles.searchLabel} htmlFor="character-search">
                {t("searchLabel")}
              </label>
              <input
                id="character-search"
                type="search"
                className={styles.search}
                placeholder={t("searchPlaceholder")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button
                type="button"
                className={styles.dice}
                onClick={openRandom}
                disabled={visible.length === 0}
              >
                {t("random")}
              </button>
            </div>

            {index.series.length > 1 ? (
              <ul className={styles.seriesRow}>
                <li>
                  <button
                    type="button"
                    className={`${styles.seriesChip} ${series === null ? styles.seriesChipOn : ""}`}
                    onClick={() => setSeries(null)}
                    aria-pressed={series === null}
                  >
                    {t("allSeries")}
                  </button>
                </li>
                {index.series.map((item) => (
                  <li key={item.slug}>
                    <button
                      type="button"
                      className={`${styles.seriesChip} ${series === item.slug ? styles.seriesChipOn : ""}`}
                      onClick={() =>
                        setSeries(series === item.slug ? null : item.slug)
                      }
                      aria-pressed={series === item.slug}
                    >
                      {item.title}
                      <span className={styles.chipCount}>{item.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : null}

        {visible.length > 0 ? (
          <ul className={styles.grid}>
            {visible.map((character) => (
              <li key={character.characterId} className={styles.gridItem}>
                <CharacterPlate
                  character={character}
                  sizes="(max-width: 640px) 44vw, (max-width: 1100px) 22vw, 14vw"
                />
              </li>
            ))}
          </ul>
        ) : (
          /* İki ayrı boşluk, iki ayrı cevap: arşiv gerçekten boş mu, yoksa
             süzgeç mi hiçbir şey bırakmadı? Tek bir "sonuç yok" ekranı
             ikincisinde kullanıcıyı çıkmazda bırakır. */
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>
              {isFiltered ? t("empty.filteredTitle") : t("empty.title")}
            </p>
            <p className={styles.emptyText}>
              {isFiltered ? t("empty.filteredText") : t("empty.text")}
            </p>
            {isFiltered ? (
              <button
                type="button"
                className={styles.emptyAction}
                onClick={() => {
                  setQuery("");
                  setSeries(null);
                }}
              >
                {t("empty.clear")}
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
