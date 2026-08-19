import type { ClubNewsItem } from "@/lib/api/football-live";
import styles from "./NewsTicker.module.css";

/**
 * Haber şeridi — "GALATASARAY LIVE".
 *
 * ── KAYNAK GERÇEK VE RESMÎ ───────────────────────────────────────────────
 * Kulübün kendi RSS beslemesi (`galatasaray.org/xml/gs.rss`). Haber uydurma
 * değil, üçüncü taraf yorumu da değil — kulübün duyurusu. Sakatlık, ceza ve
 * transfer gelişmeleri de bu beslemede yayımlanıyor, bu yüzden brief'in
 * saydığı başlıklar için ayrı bir kaynak aranmadı.
 *
 * ── KAYAN YAZI NEDEN "AÇIK AMA KOŞULLU" ──────────────────────────────────
 * Brief kayan bir şerit istiyor ama aynı cümlede "mobilde kullanıcıyı
 * rahatsız etmemeli" diyor. Sürekli kayan metin okunması zor ve klasik bir
 * erişilebilirlik sorunudur. Uygulanan denge:
 *
 *   · hareket YALNIZCA `prefers-reduced-motion: no-preference` ile
 *   · üzerine gelince ve içindeki bağlantıya odaklanınca DURUYOR
 *   · dar ekranda hareket tamamen kapalı, şerit elle kaydırılıyor
 *   · içerik gerçek `<a>` listesi — animasyon yalnızca görsel bir kopyayı
 *     taşıyor, bilgi hiçbir koşulda hareketin arkasına saklanmıyor
 *
 * Kopya `aria-hidden` ve `tabIndex={-1}` taşıyor: kesintisiz döngü için iki
 * kez basılıyor ama ekran okuyucu ve klavye tek listeyi görüyor.
 */
export function NewsTicker({
  news,
  label,
}: {
  news: ClubNewsItem[];
  label: string;
}) {
  if (news.length === 0) return null;

  return (
    <section className={styles.ticker} aria-label={label}>
      <p className={styles.badge}>
        <span className={styles.dot} aria-hidden="true" />
        {label}
      </p>

      <div className={styles.viewport}>
        <div className={styles.track}>
          <NewsRun news={news} />
          <NewsRun news={news} copy />
        </div>
      </div>
    </section>
  );
}

function NewsRun({ news, copy }: { news: ClubNewsItem[]; copy?: boolean }) {
  return (
    <ul
      className={styles.run}
      aria-hidden={copy ? "true" : undefined}
      // Kopyadaki bağlantılar sekme sırasına GİRMEMELİ; aynı haber iki kez
      // odaklanılabilir olsaydı klavye gezinmesi anlamsızlaşırdı.
      // React 19 `inert`i boolean olarak tipliyor (eski sürümlerdeki boş dize
      // değil) — buradaki `inert={true}` doğru olan.
      inert={copy}
    >
      {news.map((item, index) => (
        <li key={`${item.link}-${index}`} className={styles.item}>
          <a
            className={styles.link}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={copy ? -1 : undefined}
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
}
