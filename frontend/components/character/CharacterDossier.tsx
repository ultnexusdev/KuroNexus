import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type {
  CharacterAppearance,
  CharacterDetail,
  CharacterTrait,
} from "@/lib/api/types";
import { CharacterPlate } from "./CharacterPlate";
import { SpoilerReveal } from "./SpoilerReveal";
import styles from "./CharacterDossier.module.css";

/**
 * Karakter dosyası.
 *
 * Sunucu bileşeni: sayfada tek bir durum var (spoiler kapısı) ve o da kendi
 * küçük istemci bileşenine ayrıldı. Portreler, künye tablosu ve yapım
 * ızgarası tarayıcıya JS olarak hiç inmiyor.
 *
 * **Medya-bağımsız kurgu:** bileşen `CharacterDetail` alıyor; içinde AniList'e
 * özgü tek bir alan adı yok. Film/dizi karakterleri TMDB'den geldiğinde aynı
 * şekil doldurulur ve bu dosya değişmez. Sayfaya özgü tek şey, arşiv
 * bağlantılarının anime kanadına çıkması (`archiveHref`).
 */
export function CharacterDossier({ detail }: { detail: CharacterDetail }) {
  const t = useTranslations("character");
  const { character, appearances, related } = detail;
  const isMain = appearances.some((item) => item.role === "MAIN");

  // Arşivde karşılığı olan yapımlar önce: ziyaretçinin geri dönebileceği
  // kapılar listenin başında dursun
  const orderedAppearances = [...appearances].sort((a, b) => {
    const inArchive = Number(Boolean(b.archiveSlug)) - Number(Boolean(a.archiveSlug));
    if (inArchive !== 0) {
      return inArchive;
    }
    return (b.seasonYear ?? 0) - (a.seasonYear ?? 0);
  });

  const archiveSeries = dedupeArchiveSeries(appearances);
  const traits = buildTraits(detail, t);
  const voice = appearances.find((item) => item.voiceActor);

  return (
    <div className={styles.hall} data-category="anime">
      <div className={styles.page}>
        <Link
          href="/dark-stories/category/anime/karakterler"
          className={styles.back}
        >
          {t("backToGallery")}
        </Link>

        {/* --- Künye levhası --- */}
        <header className={styles.hero}>
          <div className={styles.portraitBlock}>
            <div className={styles.frame}>
              {character.image ? (
                <Image
                  src={character.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 34vw, 220px"
                  className={styles.portrait}
                  /* Sayfanın LCP görseli — beklemeden inmeli */
                  priority
                  unoptimized
                />
              ) : (
                <span className={styles.portraitFallback} aria-hidden>
                  {character.name.slice(0, 1)}
                </span>
              )}
            </div>
            {character.nameNative ? (
              <span className={styles.nativeColumn} lang="ja" aria-hidden>
                {character.nameNative}
              </span>
            ) : null}
          </div>

          <div className={styles.identity}>
            <div className={styles.rankRow}>
              <span
                className={`${styles.rank} ${isMain ? styles.rankMain : ""}`}
              >
                {t(isMain ? "role.MAIN" : "role.SUPPORTING")}
              </span>
              {character.favourites ? (
                <span className={styles.favourites}>
                  ♥ {formatCount(character.favourites)}
                </span>
              ) : null}
            </div>

            <h1 className={styles.name}>{character.name}</h1>

            {/* Ana dildeki ad görsel olarak dikey sütunda (aria-hidden);
                ekran okuyucu için burada bir kez daha, düz akışta */}
            {character.nameNative ? (
              <p className={styles.aliases} lang="ja">
                {character.nameNative}
              </p>
            ) : null}

            {character.alternativeNames.length > 0 ? (
              <p className={styles.aliases}>
                {t("aliases")}: {character.alternativeNames.join(" · ")}
              </p>
            ) : null}

            {archiveSeries.length > 0 ? (
              <ul className={styles.seriesRow}>
                {archiveSeries.map((series) => (
                  <li key={series.slug}>
                    <Link
                      href={`/dark-stories/category/anime/${series.slug}`}
                      className={styles.seriesLink}
                    >
                      {series.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </header>

        <div className={styles.columns}>
          {/* --- Sol sütun: künye --- */}
          <aside>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t("sections.profile")}</h2>
              {traits.length > 0 ? (
                <dl className={styles.traits}>
                  {traits.map((trait) => (
                    <div
                      key={`${trait.label}-${trait.value}`}
                      className={styles.traitRow}
                    >
                      <dt className={styles.traitLabel}>{trait.label}</dt>
                      <dd className={styles.traitValue}>{trait.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className={styles.sectionEmpty}>{t("empty.profile")}</p>
              )}
            </section>

            {voice?.voiceActor ? (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t("sections.voice")}</h2>
                <div className={styles.voice}>
                  {voice.voiceActorImage ? (
                    <span className={styles.voiceFace}>
                      <Image
                        src={voice.voiceActorImage}
                        alt=""
                        fill
                        sizes="48px"
                        className={styles.voiceImg}
                        unoptimized
                      />
                    </span>
                  ) : null}
                  <span className={styles.voiceText}>
                    <span className={styles.voiceRole}>{t("voiceActor")}</span>
                    <span className={styles.voiceName}>{voice.voiceActor}</span>
                  </span>
                </div>
              </section>
            ) : null}
          </aside>

          {/* --- Sağ sütun: metin ve yapımlar --- */}
          <div>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t("sections.about")}</h2>
              {character.description.length > 0 ? (
                character.description.map((segment, index) =>
                  segment.spoiler ? (
                    <SpoilerReveal key={index}>
                      <p className={styles.prose}>{segment.text}</p>
                    </SpoilerReveal>
                  ) : (
                    <p key={index} className={styles.prose}>
                      {segment.text}
                    </p>
                  ),
                )
              ) : (
                <p className={styles.sectionEmpty}>{t("empty.about")}</p>
              )}
            </section>

            {orderedAppearances.length > 0 ? (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  {t("sections.appearances")}
                </h2>
                <ul className={styles.appearances}>
                  {orderedAppearances.map((appearance) => (
                    <li
                      key={appearance.anilistId}
                      className={`${styles.appearance} ${appearance.archiveSlug ? styles.inArchive : ""}`}
                    >
                      <AppearanceFrame appearance={appearance} />
                      <span className={styles.appearanceTitle}>
                        {appearance.archiveSlug ? (
                          <Link
                            href={`/dark-stories/category/anime/${appearance.archiveSlug}`}
                            className={styles.appearanceLink}
                          >
                            {appearance.title}
                          </Link>
                        ) : (
                          appearance.title
                        )}
                      </span>
                      <span className={styles.appearanceMeta}>
                        {[
                          appearance.role ? t(`role.${appearance.role}`) : null,
                          appearance.seasonYear,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </div>

        {related.length > 0 ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("sections.related")}</h2>
            <ul className={styles.relatedGrid}>
              {related.map((item) => (
                <li key={item.characterId}>
                  <CharacterPlate
                    character={item}
                    sizes="(max-width: 640px) 40vw, 120px"
                    showSeries={false}
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className={styles.source}>
          {t("source")}
          {character.siteUrl ? (
            <>
              {" — "}
              <a
                href={character.siteUrl}
                className={styles.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                AniList
              </a>
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}

/** Kapak çerçevesi; arşivde olan yapım tıklanır, olmayan yalnızca durur. */
function AppearanceFrame({ appearance }: { appearance: CharacterAppearance }) {
  const cover = appearance.coverImage ? (
    <Image
      src={appearance.coverImage}
      alt=""
      fill
      sizes="(max-width: 640px) 40vw, 128px"
      className={styles.appearanceImg}
      unoptimized
    />
  ) : null;

  if (!appearance.archiveSlug) {
    return (
      <span
        className={`${styles.appearanceFrame} ${styles.appearanceFrameStatic}`}
      >
        {cover}
      </span>
    );
  }

  return (
    <Link
      href={`/dark-stories/category/anime/${appearance.archiveSlug}`}
      className={styles.appearanceFrame}
      aria-label={appearance.title}
    >
      {cover}
    </Link>
  );
}

/** Aynı seri birden çok sezonla geldiğinde künye satırı tekrarlanmasın. */
function dedupeArchiveSeries(
  appearances: CharacterAppearance[],
): Array<{ slug: string; title: string }> {
  const seen = new Map<string, string>();
  for (const appearance of appearances) {
    if (appearance.archiveSlug && !seen.has(appearance.archiveSlug)) {
      seen.set(appearance.archiveSlug, appearance.title);
    }
  }
  return [...seen].map(([slug, title]) => ({ slug, title }));
}

/**
 * Künye tablosu: AniList'in yapısal alanları önce, açıklama metninden
 * ayıklanan satırlar sonra.
 *
 * Spoiler işaretli künye satırları **hiç gösterilmiyor** (tabloya kapı
 * koymak satır hizasını bozar ve bir künye satırı zaten tek kelime — kapıyı
 * açmadan bile "gizli bir şey var" bilgisi sızar).
 */
function buildTraits(
  detail: CharacterDetail,
  t: (key: string) => string,
): CharacterTrait[] {
  const { character } = detail;
  const rows: CharacterTrait[] = [];

  const push = (label: string, value: string | null | undefined) => {
    if (value) {
      rows.push({ label, value, spoiler: false });
    }
  };

  push(t("traits.gender"), character.gender);
  push(t("traits.age"), character.age);
  push(t("traits.bloodType"), character.bloodType);
  push(t("traits.birthday"), formatBirthday(character.dateOfBirth));

  const known = new Set(rows.map((row) => row.label.toLocaleLowerCase("tr")));
  for (const trait of character.traits) {
    if (trait.spoiler || known.has(trait.label.toLocaleLowerCase("tr"))) {
      continue;
    }
    rows.push(trait);
    // Aynı anahtar kaynakta iki kez yazılmış olabilir; ilki kalır
    known.add(trait.label.toLocaleLowerCase("tr"));
  }

  return rows;
}

/**
 * Doğum günü. Yıl çoğu karakterde yok (kurgu evreninde takvim başka işler) —
 * o zaman yalnızca gün/ay yazılır. Ay adı yerine sayı kullanılıyor ki çeviri
 * dosyasına on iki ay adı eklemek gerekmesin ve tarih her dilde aynı okunsun.
 */
function formatBirthday(
  date: { year: number | null; month: number | null; day: number | null } | null,
): string | null {
  if (!date) {
    return null;
  }
  const { year, month, day } = date;
  if (day && month) {
    const base = `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}`;
    return year ? `${base}.${year}` : base;
  }
  if (year) {
    return String(year);
  }
  return null;
}

/** 2400 → "2.4K". Künyede beş haneli sayı satırı taşırıyor. */
function formatCount(value: number): string {
  if (value < 1000) {
    return String(value);
  }
  const thousands = value / 1000;
  return `${thousands >= 10 ? Math.round(thousands) : thousands.toFixed(1)}K`;
}
