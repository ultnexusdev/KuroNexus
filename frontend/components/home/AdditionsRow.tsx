"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import { tmdbImage } from "@/lib/api/movies";
import type { PulseAddition } from "@/lib/api/types";
import { ScrollStrip } from "@/components/hall/ScrollStrip";
import styles from "./AdditionsRow.module.css";

/**
 * Ana sayfa · "Son Eklenenler" şeridi — kapı duvarının altında, indeks
 * şeridinin üstünde.
 *
 * ── NEDEN VAR ─────────────────────────────────────────────────────────────
 * Hol yalnızca kapılar ve sayılarla konuşuyordu: ziyaretçi "336 film" yazısını
 * görüyor ama arşivin YAŞADIĞINA dair hiçbir iz göremiyordu. Bu şerit, içeri
 * girmeden önce arşivin son nefesini gösteriyor — dün ne girdi, bu hafta ne
 * eklendi. Kapıya tıklama kararı somut bir kanıtla veriliyor.
 *
 * ── NEDEN İSTEMCİ BİLEŞENİ ────────────────────────────────────────────────
 * Kaydırma kabuğu (`ScrollStrip`) render prop alıyor; fonksiyon prop'u sunucu
 * bileşeninden istemciye geçirilemez. Bu yüzden şerit "use client" ve çeviriler
 * `useTranslations` üzerinden okunuyor.
 *
 * ── NEDEN KENDİ BAŞLIĞINI KENDİ ÇİZİYOR ───────────────────────────────────
 * Başlık ana sayfada dursaydı, boş nabızda (backend kapalı / henüz kayıt yok)
 * ekranda başlıksız değil BAŞLIK VAR ŞERİT YOK durumu kalırdı. Bölümün tamamı
 * — başlık, alt satır, şerit — tek bir "hiç çizme" kararına bağlı.
 */
export function AdditionsRow({ additions }: { additions: PulseAddition[] }) {
  const t = useTranslations("home");
  // Ok düğmelerinin erişilebilir adları; film/dizi salonlarıyla aynı kaynak
  const tNav = useTranslations("player");

  // Kayıt yoksa bölüm hiç yok: boş başlık "burada bir şey olmalıydı" der
  if (additions.length === 0) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby="additions-title">
      <header className={styles.head}>
        <h2 id="additions-title" className={styles.sectionTitle}>
          {t("additions.title")}
        </h2>
        <p className={styles.lede}>{t("additions.lede")}</p>
      </header>

      <ScrollStrip
        className={styles.strip}
        prevLabel={tNav("previous")}
        nextLabel={tNav("next")}
      >
        {(trackRef) => (
          <ul
            ref={trackRef}
            className={styles.track}
            /* Klavyeyle kaydırılabilsin: odaklanabilir olmayan bir kaydırma
               kutusu fare olmadan erişilemez kalıyor (bkz. ScrollStrip) */
            tabIndex={0}
            aria-label={t("additions.title")}
          >
            {additions.map((addition) => (
              <AdditionCard key={addition.href} addition={addition} />
            ))}
          </ul>
        )}
      </ScrollStrip>
    </section>
  );
}

function AdditionCard({ addition }: { addition: PulseAddition }) {
  const t = useTranslations("home");

  /* Kapak çözümü `PulseEntry` ile AYNI sözleşme (bkz. NexusHub `PulseCard`):
     film/dizi posteri TMDB göreli yolu, anime kapağı tam adres, kitap kapağı
     bizim yükleme klasörümüz. */
  const image =
    addition.kind === "FILM" || addition.kind === "DIZI"
      ? tmdbImage(addition.image, "w185")
      : addition.kind === "ANIME"
        ? addition.image
        : addition.image
          ? apiUrl(addition.image)
          : null;

  /* "Film · 2014" / "Kitap · Ursula K. Le Guin". Tür adı çeviriden: kartın
     hangi salondan geldiğini söyleyen tek işaret o. Künye satırı boşsa
     (yılı bilinmeyen yapım) yalnızca tür yazılır, sarkan "·" kalmaz. */
  const line = [t(`additions.kind.${addition.kind}`), addition.meta]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className={styles.card}>
      <Link href={addition.href} className={styles.cardLink}>
        {/* Kapak yoksa kutu yine çiziliyor: şeridin ritmi bir eksik kapak
            yüzünden bozulmasın, kart tıklanabilir kalsın */}
        <span className={styles.cover}>
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 640px) 30vw, 132px"
              className={styles.coverImg}
              /* Optimizasyon kapalı: AniList konağı `remotePatterns`ta yok,
                 kitap kapağı da kaynağın CDN'inden gelebiliyor. Kitap
                 kanadının her yerinde olduğu gibi ham servis ediliyor. */
              unoptimized
            />
          ) : null}
        </span>
        <span className={styles.cardTitle}>{addition.title}</span>
        <span className={styles.cardMeta}>{line}</span>
      </Link>
    </li>
  );
}
