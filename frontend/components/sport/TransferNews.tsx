import { getTranslations } from "next-intl/server";
import type { TransferNewsItem } from "@/lib/api/types";
import styles from "./TransferNews.module.css";

/** 12.5M € gibi kısa gösterim; değer yoksa null. */
function marketValue(eur: number | null, locale: string) {
  if (!eur || eur <= 0) return null;
  const millions = eur / 1_000_000;
  const formatted =
    millions >= 10
      ? Math.round(millions).toString()
      : millions.toFixed(1).replace(/\.0$/, "");
  return `${new Intl.NumberFormat(locale).format(Number(formatted))} M €`;
}

/**
 * Transfer Haberleri — her haber, bağlı TM oyuncusunun künyesiyle (fotoğraf,
 * mevki, yaş, piyasa değeri) birlikte gösterilir. Künye verisi TM sync'inden
 * gelir; haber metnine kopyalanmadığı için sync tazelendiğinde kendiliğinden
 * güncellenir. Oyuncu bağlanmamış haberler yalnızca metinle görünür.
 */
export async function TransferNews({
  news,
  locale,
}: {
  news: TransferNewsItem[];
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "sport" });
  const dateFmt = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (news.length === 0) {
    return <p className={styles.empty}>{t("newsEmpty")}</p>;
  }

  return (
    <ul className={styles.list}>
      {news.map((item) => {
        const value = marketValue(item.player?.marketValueInEur ?? null, locale);
        return (
          <li key={item.id} className={styles.card}>
            {item.player ? (
              <div className={styles.dossier}>
                {item.player.photo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.player.photo}
                    alt=""
                    loading="lazy"
                    className={styles.photo}
                  />
                ) : null}
                <div className={styles.dossierMeta}>
                  <span className={styles.playerName}>{item.player.name}</span>
                  <span className={styles.playerFacts}>
                    {/* Kulüpte olmayan oyuncularda künye elle girilir (`facts`);
                        TM kaydı olanlarda alanlardan derlenir. */}
                    {item.player.facts ??
                      [
                        item.player.position,
                        item.player.age ? `${item.player.age}` : null,
                        value,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                  </span>
                </div>
              </div>
            ) : null}

            <div className={styles.content}>
              <time className={styles.date} dateTime={item.publishedAt}>
                {dateFmt.format(new Date(item.publishedAt))}
              </time>
              <h4 className={styles.title}>{item.title}</h4>
              {/* Backend'de sanitize-html whitelist'inden geçirilmiş HTML */}
              <div
                className={styles.body}
                dangerouslySetInnerHTML={{ __html: item.body }}
              />
              {item.sourceUrl ? (
                <a
                  href={item.sourceUrl}
                  className={styles.source}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("newsSource")} →
                </a>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
