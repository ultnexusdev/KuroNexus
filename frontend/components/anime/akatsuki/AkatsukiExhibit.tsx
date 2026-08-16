import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import type { CharacterCard, CharacterImageRow } from "@/lib/api/types";
import {
  AKATSUKI_IDS,
  AKATSUKI_MEMBERS,
  AKATSUKI_PARTNERS,
  AKATSUKI_RELATIONS,
  AKATSUKI_SYMBOL_KEYS,
  AKATSUKI_TIMELINE_KEYS,
  EXHIBIT_IMAGE_KEYS,
  SIX_PATHS,
} from "@/lib/anime/akatsuki";
import { animeHref } from "@/lib/anime/routes";
import { AkatsukiCloud } from "@/components/anime/AkatsukiCloud";
import { AkatsukiSetup } from "./AkatsukiSetup";
import { RinneganMotif } from "./RinneganMotif";
import shell from "@/app/[locale]/anime/layout.module.css";
import styles from "./AkatsukiExhibit.module.css";

/**
 * Akatsuki — aşağı doğru keşfedilen dijital sergi (komut §4).
 *
 * ── HİYERARŞİ KURALI ─────────────────────────────────────────────────────
 * Pain sayfanın AÇIK ARA en büyük görsel öğesi: hero'nun tamamı onun.
 * Başka hiçbir karakter, hiçbir bölümde bu ağırlığa yaklaşmaz — üyeler üç
 * sütunlu arşiv kartları, Pain tam ekran bir portre. Bu bir grup posteri
 * değil; Pain merkez, geri kalan herkes onun etrafında açılan arşiv.
 *
 * ── GÖRSEL ÇÖZÜMLEME SIRASI ─────────────────────────────────────────────
 * küratör/kurulum görseli (kendi diskimiz) → AniList portresi (küçük ama
 * var) → dokulu yuva (hiç görselsiz de sergi ayakta). Kurulum ucu henüz
 * koşmadıysa sayfa kırılmaz — komut §1'in fallback şartı.
 *
 * Sayfa saf sunucu bileşeni; tek istemci adası admin'e görünen kurulum
 * düğmesi (`AkatsukiSetup`).
 */

interface ImageSources {
  /** slot PORTRAIT → karakter kimliğiyle */
  portraits: Map<number, CharacterImageRow>;
  /** slot ABILITY → sergi anahtarıyla ("path:deva", "akatsuki:sky"…) */
  exhibit: Map<string, CharacterImageRow>;
  /** AniList portre yedeği */
  anilist: Map<number, string>;
}

function collectSources(
  images: CharacterImageRow[],
  cards: CharacterCard[],
): ImageSources {
  const portraits = new Map<number, CharacterImageRow>();
  const exhibit = new Map<string, CharacterImageRow>();
  for (const row of images) {
    if (row.slot === "PORTRAIT" && !portraits.has(row.characterId)) {
      portraits.set(row.characterId, row);
    }
    if (row.slot === "ABILITY" && row.abilityName) {
      if (!exhibit.has(row.abilityName)) {
        exhibit.set(row.abilityName, row);
      }
    }
  }
  const anilist = new Map<number, string>();
  for (const card of cards) {
    if (card.image) {
      anilist.set(card.characterId, card.image);
    }
  }
  return { portraits, exhibit, anilist };
}

/**
 * Çözülmüş görsel: adres + kaynağı. `local` bayrağı `next/image`
 * optimizasyonunun kapısı — AniList adresleri `remotePatterns`ta yok,
 * `unoptimized` çizilmek zorunda (CharacterDossier deseni).
 */
interface ResolvedImage {
  src: string;
  local: boolean;
}

/** Portre adresi: kendi diskimiz önce, AniList yedek. `null` → dokulu yuva. */
function portraitSrc(
  sources: ImageSources,
  characterId: number,
): ResolvedImage | null {
  const own = sources.portraits.get(characterId);
  if (own) return { src: apiUrl(own.url), local: true };
  const fallback = sources.anilist.get(characterId);
  return fallback ? { src: fallback, local: false } : null;
}

function exhibitSrc(sources: ImageSources, key: string): ResolvedImage | null {
  const row = sources.exhibit.get(key);
  return row ? { src: apiUrl(row.url), local: true } : null;
}

/**
 * Sergi görseli — hepsi kaplama (`fill`) düzeninde, kırpma üstteki kapta.
 * `sizes` SABİT px (vw yasak — next.config.ts'teki ölçülmüş tuzak).
 */
function ExhibitImage({
  image,
  alt,
  sizes,
  priority,
  className,
}: {
  image: ResolvedImage;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={image.src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!image.local}
      className={className}
    />
  );
}

/** Dokulu yuva — portresi inmemiş karakter (spor panteonu deseni). */
function Hatch({ initial }: { initial: string }) {
  return (
    <span className={styles.hatch} aria-hidden>
      <span className={styles.hatchInitial}>{initial}</span>
    </span>
  );
}

export async function AkatsukiExhibit({
  locale,
  images,
  cards,
  isAdmin,
}: {
  locale: string;
  images: CharacterImageRow[];
  cards: CharacterCard[];
  isAdmin: boolean;
}) {
  const t = await getTranslations({ locale, namespace: "akatsuki" });
  const sources = collectSources(images, cards);

  const painPortrait = portraitSrc(sources, AKATSUKI_IDS.pain);
  const sky = exhibitSrc(sources, EXHIBIT_IMAGE_KEYS.sky);
  const six = exhibitSrc(sources, EXHIBIT_IMAGE_KEYS.six);
  const origins = exhibitSrc(sources, EXHIBIT_IMAGE_KEYS.origins);

  const memberByKey = new Map(
    AKATSUKI_MEMBERS.map((member) => [member.key, member]),
  );

  return (
    <main className={styles.page} data-world="akatsuki">
      <nav className={shell.crumb} aria-label="breadcrumb">
        <Link href="/dark-stories">KuroNexus</Link>
        <span className={shell.sep}>/</span>
        <Link href={animeHref.hall()}>Anime</Link>
        <span className={shell.sep}>/</span>
        <span>{t("title")}</span>
      </nav>

      {/* ══ HERO — PAIN. Sayfanın en büyük görsel öğesi; pazarlıksız. ══ */}
      <header className={styles.hero}>
        {sky ? (
          <span className={styles.sky} aria-hidden>
            <ExhibitImage image={sky} alt="" sizes="1920px" priority />
          </span>
        ) : null}
        <span className={styles.rain} aria-hidden />
        <RinneganMotif className={styles.rinnegan} />

        {painPortrait ? (
          <span className={styles.heroPortrait} aria-hidden>
            <ExhibitImage image={painPortrait} alt="" sizes="760px" priority />
          </span>
        ) : null}

        <div className={styles.heroInner}>
          <p className={`${shell.eyebrow} ${styles.heroEyebrow}`}>
            {t("title")} · {t("subtitle")} — {t("eyebrow")}
          </p>
          {/* Özel ad — TR büyütme "PAİN" üretir (LINKIN PARK dersi); Bebas
              kapitali zaten görsel olarak basıyor */}
          <h1 className={`${shell.display} ${styles.heroName}`}>
            {t("hero.name")}
          </h1>
          <p className={`${shell.serif} ${styles.epigraph}`}>
            {t("hero.epigraph")}
          </p>

          <dl className={styles.heroMeta}>
            {(
              [
                ["realName", "realNameValue"],
                ["village", "villageValue"],
                ["eye", "eyeValue"],
                ["role", "roleValue"],
                ["bodies", "bodiesValue"],
              ] as const
            ).map(([labelKey, valueKey]) => (
              <div key={labelKey} className={styles.heroMetaRow}>
                <dt className={`${shell.data} ${styles.heroMetaLabel}`}>
                  {t(`hero.meta.${labelKey}`)}
                </dt>
                <dd className={styles.heroMetaValue}>
                  {t(`hero.meta.${valueKey}`)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <p className={`${shell.data} ${styles.scrollHint}`} aria-hidden>
          {t("scrollHint")} ↓
        </p>
      </header>

      {/* ══ AKATSUKI HAKKINDA ══ */}
      <section className={styles.about} aria-labelledby="akatsuki-about">
        <h2
          id="akatsuki-about"
          className={`${shell.display} ${shell.section} ${styles.sectionTitle}`}
        >
          {t("about.title")}
        </h2>
        <p className={`${shell.lede} ${styles.aboutLede}`}>{t("lede")}</p>
        <div className={styles.aboutBody}>
          <p className={shell.prose}>{t("about.p1")}</p>
          <p className={shell.prose}>{t("about.p2")}</p>
          <p className={shell.prose}>{t("about.p3")}</p>
        </div>
        <AkatsukiCloud className={styles.divider} />
      </section>

      {/* ══ SIX PATHS OF PAIN ══ */}
      <section className={styles.paths} aria-labelledby="akatsuki-paths">
        {six ? (
          <span className={styles.pathsBand} aria-hidden>
            <ExhibitImage image={six} alt="" sizes="1920px" />
          </span>
        ) : null}
        <header className={styles.sectionHead}>
          <h2
            id="akatsuki-paths"
            className={`${shell.display} ${shell.section} ${styles.sectionTitle}`}
          >
            {t("paths.title")}
          </h2>
          <p className={shell.lede}>{t("paths.lede")}</p>
        </header>

        <ul className={styles.pathGrid}>
          {SIX_PATHS.map((path) => {
            const src = exhibitSrc(sources, path.imageKey);
            return (
              <li key={path.key} className={styles.path}>
                <span className={styles.pathArt}>
                  {src ? (
                    <ExhibitImage
                      image={src}
                      alt={t(`paths.${path.key}.name`)}
                      sizes="480px"
                    />
                  ) : (
                    <Hatch initial={path.kanji.slice(0, 1)} />
                  )}
                  <span className={`${shell.brush} ${styles.pathKanji}`} aria-hidden>
                    {path.kanji}
                  </span>
                </span>
                <span className={styles.pathBody}>
                  <span className={`${shell.display} ${styles.pathName}`}>
                    {t(`paths.${path.key}.name`)}
                  </span>
                  <span className={`${shell.data} ${styles.pathRomaji}`}>
                    {path.romaji}
                  </span>
                  <span className={styles.pathDesc}>
                    {t(`paths.${path.key}.desc`)}
                  </span>
                  <span className={`${shell.data} ${styles.pathAbility}`}>
                    {t(`paths.${path.key}.ability`)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ══ AKATSUKI ÜYELERİ ══ */}
      <section className={styles.members} aria-labelledby="akatsuki-members">
        <header className={styles.sectionHead}>
          <h2
            id="akatsuki-members"
            className={`${shell.display} ${shell.section} ${styles.sectionTitle}`}
          >
            {t("members.title")}
          </h2>
          <p className={shell.lede}>{t("members.lede")}</p>
        </header>

        <ul className={styles.memberGrid}>
          {AKATSUKI_MEMBERS.map((member) => {
            const src = portraitSrc(sources, member.characterId);
            return (
              <li key={member.key} className={styles.member}>
                <Link
                  href={animeHref.character(member.characterId)}
                  className={styles.memberLink}
                  aria-label={member.name}
                >
                  <span className={styles.memberFrame} data-member={member.key}>
                    {src ? (
                      <ExhibitImage
                        image={src}
                        alt={member.name}
                        sizes="440px"
                        className={styles.memberPortrait}
                      />
                    ) : (
                      <Hatch initial={member.name.slice(0, 1)} />
                    )}
                    {member.ring ? (
                      <span
                        className={styles.memberRing}
                        title={`${t("labels.ring")} · ${member.ring.romaji}`}
                      >
                        <span className={shell.brush}>{member.ring.kanji}</span>
                      </span>
                    ) : null}
                  </span>

                  <span className={styles.memberBody}>
                    <span className={`${shell.display} ${styles.memberName}`}>
                      {member.name}
                    </span>
                    <span
                      className={`${shell.brush} ${styles.memberNative}`}
                      aria-hidden
                    >
                      {member.nativeName}
                    </span>
                    <span
                      className={`${shell.serif} ${styles.memberAlias}`}
                    >
                      {t(`members.${member.key}.alias`)}
                    </span>
                    <span className={`${shell.data} ${styles.memberRole}`}>
                      {t(`members.${member.key}.role`)}
                    </span>
                    <span className={`${shell.data} ${styles.memberAbility}`}>
                      {t(`members.${member.key}.ability`)}
                    </span>
                    <span className={styles.memberBio}>
                      {t(`members.${member.key}.bio`)}
                    </span>
                    <span className={`${shell.data} ${styles.memberEnter}`}>
                      {t("labels.dossier")}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ══ PARTNERLER ══ */}
      <section className={styles.partners} aria-labelledby="akatsuki-partners">
        <header className={styles.sectionHead}>
          <h2
            id="akatsuki-partners"
            className={`${shell.display} ${shell.section} ${styles.sectionTitle}`}
          >
            {t("partners.title")}
          </h2>
          <p className={shell.lede}>{t("partners.lede")}</p>
        </header>

        <ul className={styles.partnerGrid}>
          {AKATSUKI_PARTNERS.map((pair) => {
            const a =
              pair.aKey === "pain"
                ? {
                    name: t("hero.name"),
                    characterId: AKATSUKI_IDS.pain,
                  }
                : memberByKey.get(pair.aKey)!;
            const b = memberByKey.get(pair.bKey)!;
            const aSrc = portraitSrc(sources, a.characterId);
            const bSrc = portraitSrc(sources, b.characterId);
            return (
              <li key={pair.key} className={styles.pair}>
                <span className={styles.pairFaces} aria-hidden>
                  <span className={styles.pairFace}>
                    {aSrc ? (
                      <ExhibitImage image={aSrc} alt="" sizes="96px" />
                    ) : (
                      <Hatch initial={a.name.slice(0, 1)} />
                    )}
                  </span>
                  <span className={`${styles.pairFace} ${styles.pairFaceB}`}>
                    {bSrc ? (
                      <ExhibitImage image={bSrc} alt="" sizes="96px" />
                    ) : (
                      <Hatch initial={b.name.slice(0, 1)} />
                    )}
                  </span>
                </span>
                <span className={styles.pairBody}>
                  <span className={`${shell.display} ${styles.pairNames}`}>
                    {a.name} <span className={styles.pairX}>×</span> {b.name}
                  </span>
                  <span className={styles.pairNote}>
                    {t(`partners.${pair.key}`)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ══ AKATSUKI'NİN TARİHİ ══ */}
      <section className={styles.history} aria-labelledby="akatsuki-history">
        {origins ? (
          <span className={styles.historyBand} aria-hidden>
            <ExhibitImage image={origins} alt="" sizes="1920px" />
          </span>
        ) : null}
        <header className={styles.sectionHead}>
          <h2
            id="akatsuki-history"
            className={`${shell.display} ${shell.section} ${styles.sectionTitle}`}
          >
            {t("history.title")}
          </h2>
          <p className={shell.lede}>{t("history.lede")}</p>
        </header>

        <ol className={styles.timeline}>
          {AKATSUKI_TIMELINE_KEYS.map((key) => (
            <li key={key} className={styles.era}>
              <span className={`${shell.data} ${styles.eraLabel}`}>
                {t(`history.${key}.era`)}
              </span>
              <span className={`${shell.display} ${styles.eraTitle}`}>
                {t(`history.${key}.title`)}
              </span>
              <p className={`${shell.prose} ${styles.eraText}`}>
                {t(`history.${key}.text`)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ══ ÖNEMLİ İLİŞKİLER ══ */}
      <section className={styles.relations} aria-labelledby="akatsuki-relations">
        <header className={styles.sectionHead}>
          <h2
            id="akatsuki-relations"
            className={`${shell.display} ${shell.section} ${styles.sectionTitle}`}
          >
            {t("relations.title")}
          </h2>
          <p className={shell.lede}>{t("relations.lede")}</p>
        </header>

        <ul className={styles.relationList}>
          {AKATSUKI_RELATIONS.map((relation) => {
            const src = relation.imageKey
              ? (exhibitSrc(sources, relation.imageKey) ??
                portraitSrc(sources, relation.characterId))
              : portraitSrc(sources, relation.characterId);
            return (
              <li key={relation.key} className={styles.relation}>
                <span className={styles.relationFace} aria-hidden>
                  {src ? (
                    <ExhibitImage image={src} alt="" sizes="128px" />
                  ) : (
                    <Hatch initial={relation.name.slice(0, 1)} />
                  )}
                </span>
                <span className={styles.relationBody}>
                  <span className={`${shell.display} ${styles.relationName}`}>
                    {relation.name}
                  </span>
                  <span className={`${shell.data} ${styles.relationRole}`}>
                    {t(`relations.${relation.key}.role`)}
                  </span>
                  <p className={`${shell.prose} ${styles.relationText}`}>
                    {t(`relations.${relation.key}.text`)}
                  </p>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ══ SEMBOLİZM ══ */}
      <section className={styles.symbols} aria-labelledby="akatsuki-symbols">
        <header className={styles.sectionHead}>
          <h2
            id="akatsuki-symbols"
            className={`${shell.display} ${shell.section} ${styles.sectionTitle}`}
          >
            {t("symbols.title")}
          </h2>
          <p className={shell.lede}>{t("symbols.lede")}</p>
        </header>

        <ul className={styles.symbolGrid}>
          {AKATSUKI_SYMBOL_KEYS.map((key) => (
            <li key={key} className={styles.symbol}>
              <span className={styles.symbolArt} aria-hidden>
                {key === "cloud" ? (
                  <AkatsukiCloud className={styles.symbolCloud} />
                ) : null}
                {key === "rings" ? (
                  <span className={styles.ringRow}>
                    <span className={`${shell.brush} ${styles.ringChip}`}>
                      零
                    </span>
                    {AKATSUKI_MEMBERS.filter(
                      (member, index, all) =>
                        member.ring &&
                        all.findIndex(
                          (m) => m.ring?.kanji === member.ring?.kanji,
                        ) === index,
                    ).map((member) => (
                      <span
                        key={member.key}
                        className={`${shell.brush} ${styles.ringChip}`}
                      >
                        {member.ring?.kanji}
                      </span>
                    ))}
                  </span>
                ) : null}
                {key === "cloak" ? (
                  <span className={styles.cloak}>
                    <AkatsukiCloud className={styles.cloakCloud} />
                    <AkatsukiCloud
                      className={`${styles.cloakCloud} ${styles.cloakCloudB}`}
                    />
                  </span>
                ) : null}
              </span>
              <span className={`${shell.display} ${styles.symbolName}`}>
                {t(`symbols.${key}.name`)}
              </span>
              <p className={styles.symbolText}>{t(`symbols.${key}.text`)}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ══ SON — MİRAS ══ */}
      <section className={styles.legacy} aria-labelledby="akatsuki-legacy">
        <AkatsukiCloud className={styles.legacyCloud} />
        <h2
          id="akatsuki-legacy"
          className={`${shell.display} ${shell.section} ${styles.sectionTitle}`}
        >
          {t("legacy.title")}
        </h2>
        <p className={`${shell.serif} ${styles.legacyText}`}>{t("legacy.p1")}</p>
        <p className={`${shell.serif} ${styles.legacyText}`}>{t("legacy.p2")}</p>
      </section>

      {/* Küratör kuşağı — ziyaretçi bu adayı hiç indirmiyor; yetkinin
          gerçek kapısı backend'de (@Roles). */}
      {isAdmin ? (
        <section className={styles.curator}>
          <AkatsukiSetup />
        </section>
      ) : null}
    </main>
  );
}
