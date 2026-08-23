import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { pick } from "@/lib/characters/types";
import {
  collectAbilityImages,
  companionPortraits,
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import {
  SASUKE_ANILIST_URL,
  SASUKE_CLOSING,
  SASUKE_HERO,
  SASUKE_ID,
  SASUKE_IDENTITY,
  SASUKE_IMAGE_KEYS,
  SASUKE_LAB,
  SASUKE_MINOR_TECHNIQUES,
  SASUKE_MODE_TEXT,
  SASUKE_PATHS,
  SASUKE_PATHS_TEXT,
  SASUKE_SLOT_LABELS,
  SASUKE_TECHNIQUES,
  SASUKE_TIMELINE,
  SASUKE_TIMELINE_TEXT,
  walkerAlt,
  type SasukePath,
} from "@/lib/characters/sasuke-uchiha-experience";
import { animeHref } from "@/lib/anime/routes";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { SasukeEyeDefs, UchihaCrest } from "./SasukeEyes";
import { SasukeSigilMark } from "./SasukeSigils";
import { RiftShell } from "./RiftShell";
import styles from "./SasukeExperience.module.css";

/**
 * Sasuke Uchiha — deneyim sayfası.
 *
 * /karakterler/13 bu bileşene dallanır. Konsept: **İKİ GÖZ, İKİ YOL.**
 * Sayfayı boydan boya dikey bir yarık ikiye böler; solda intikam kanadı
 * (Sharingan kızılı), sağda kefaret kanadı (Rinnegan moru). Bölümler
 * eksenin iki yanına asimetrik yerleşir, çift göz diski seçimi yaptırır
 * ve yarık o yana kayar.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   RiftShell — mod + yol durumu, yarık, kara alev örtüsü
 *   TwinEyes  — iki göz düğmesi ve panel kabuğu
 * Panellerin ve bütün bölümlerin İÇERİĞİ burada, sunucuda çizilip adalara
 * ReactNode olarak giriyor: tarayıcıya inen JS iki `useState` kadar.
 *
 * Görseller characterId 13 kaydının ABILITY yuvalarından (`sasuke:*`).
 * Hiçbir bölüm görsele bağımlı değil — yuva boşken kart elle çizilmiş
 * işaretiyle ayakta kalır, kürator modunda yerinde bir yükleme kutusu görür.
 */
export function SasukeExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");
  const ability = collectAbilityImages(detail.images);
  const faces = companionPortraits(companions);
  const portrait = primaryPortrait(detail);
  const heroScene = ability.get(SASUKE_IMAGE_KEYS.hero) ?? null;

  /** Yükleme yuvası — yalnızca kürator modunda çizilir. */
  const slot = (key: string) =>
    isAdmin ? (
      <CuratorSlot
        characterId={SASUKE_ID}
        slot="ABILITY"
        abilityName={key}
        label={pick(SASUKE_SLOT_LABELS[key], locale)}
      />
    ) : null;

  /* ── Çift göz panelinin içeriği: sunucuda çizilir ─────────────────── */
  const pathPanel = (path: SasukePath) => (
    <>
      <p className={styles.pathTagline}>{pick(path.tagline, locale)}</p>
      <p className={styles.pathLede}>{pick(path.lede, locale)}</p>
      <ol className={styles.momentList}>
        {path.moments.map((moment) => (
          <li key={moment.key} className={styles.moment}>
            <span className={styles.momentAge}>{pick(moment.age, locale)}</span>
            <h3 className={styles.momentTitle}>{pick(moment.title, locale)}</h3>
            <p className={styles.momentText}>{pick(moment.text, locale)}</p>
          </li>
        ))}
      </ol>
      <div className={styles.walkers}>
        <h3 className={styles.walkersTitle}>
          {pick(path.walkersTitle, locale)}
        </h3>
        <ul className={styles.walkerRow}>
          {path.walkers.map((walker) => {
            const face = faces.get(walker.characterId) ?? null;
            return (
              <li key={walker.characterId} className={styles.walker}>
                <Link
                  href={animeHref.character(walker.characterId)}
                  className={styles.walkerLink}
                >
                  <span className={styles.walkerFace}>
                    {face ? (
                      <Image
                        src={face}
                        alt={walkerAlt(walker.name, locale)}
                        fill
                        sizes="120px"
                      />
                    ) : (
                      <UchihaCrest
                        className={styles.walkerFallback}
                        topClassName={styles.crestTop}
                        baseClassName={styles.crestBase}
                      />
                    )}
                  </span>
                  <span className={styles.walkerName}>{walker.name}</span>
                  <span className={styles.walkerNote}>
                    {pick(walker.note, locale)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );

  const twin = {
    headingId: "sasuke-yollar",
    title: pick(SASUKE_PATHS_TEXT.title, locale),
    lede: pick(SASUKE_PATHS_TEXT.lede, locale),
    idleHint: pick(SASUKE_PATHS_TEXT.idleHint, locale),
    activeHint: pick(SASUKE_PATHS_TEXT.activeHint, locale),
    idleBody: pick(SASUKE_PATHS_TEXT.idleBody, locale),
    eyes: SASUKE_PATHS.map((path) => ({
      key: path.key,
      word: path.word,
      reading: path.reading,
      label: pick(path.label, locale),
      eyeLabel: pick(path.eyeLabel, locale),
      tagline: pick(path.tagline, locale),
    })),
    panels: SASUKE_PATHS.map((path) => ({
      key: path.key,
      node: pathPanel(path),
    })),
  };

  /* ── 1–4 · Yarığın üstündeki yarı ─────────────────────────────────── */
  const head = (
    <>
      {/* İris gradyanlarının TEK tanımı. Sayfa derisinin İÇİNDE olmak
          zorunda: gradyan durakları `--accent-hover` gibi dünyaya ait
          token'ları okuyor ve bunlar `[data-world]` alt ağacında tanımlı. */}
      <SasukeEyeDefs />

      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        <span className={styles.crumbSep} aria-hidden>
          /
        </span>
        <Link href={animeHref.naruto()}>Naruto</Link>
      </nav>

      {/* ══ 1 · HERO — yarığın iki yanında portre ve ad ══ */}
      <section className={styles.hero} aria-labelledby="sasuke-ad">
        <UchihaCrest
          className={styles.heroCrest}
          topClassName={styles.crestTop}
          baseClassName={styles.crestBase}
        />
        {heroScene ? (
          <span className={styles.heroScene} aria-hidden>
            <Image src={heroScene} alt="" fill sizes="1920px" />
          </span>
        ) : null}

        <div className={styles.heroPortrait}>
          {portrait ? (
            <Image
              src={portrait}
              alt={pick(SASUKE_HERO.portraitAlt, locale)}
              fill
              sizes="(max-width: 900px) 72vw, 30rem"
              priority
              /* AniList portresi optimize edilemiyor (remotePatterns'te yok);
                 arşive yüklenen tam boy portre edilebiliyor */
              unoptimized={!isUploadedPortrait(detail)}
            />
          ) : null}
          <span className={styles.heroPortraitEdge} aria-hidden />
        </div>

        <div className={styles.heroBody}>
          <p className={styles.heroAxis} aria-hidden>
            {SASUKE_HERO.axisKanji}
          </p>
          <h1 id="sasuke-ad" className={styles.heroName}>
            {SASUKE_HERO.name}
          </h1>
          <p className={styles.heroNative} aria-hidden>
            {SASUKE_HERO.nativeName}
          </p>
          <p className={styles.heroEpigraph}>
            {pick(SASUKE_HERO.epigraph, locale)}
          </p>
          <ul className={styles.heroTags}>
            {SASUKE_HERO.tags.map((tag) => (
              <li key={tag.tr} className={styles.heroTag}>
                {pick(tag, locale)}
              </li>
            ))}
          </ul>
        </div>

        {isAdmin ? (
          <div className={styles.slotRow}>{slot(SASUKE_IMAGE_KEYS.hero)}</div>
        ) : null}
      </section>

      {/* ══ 2 · KÜNYE — yarığın üstüne kurulmuş defter ══ */}
      <section className={styles.identity} aria-labelledby="sasuke-kunye">
        <header className={styles.sectionHead} data-align="center">
          <h2 id="sasuke-kunye" className={styles.sectionTitle}>
            {pick(SASUKE_IDENTITY.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(SASUKE_IDENTITY.lede, locale)}
          </p>
        </header>
        {/* Etiketler solda sağa dayalı, değerler sağda sola dayalı:
            satırlar yarığın iki yanında buluşuyor */}
        <dl className={styles.ledger}>
          {SASUKE_IDENTITY.facts.map((fact) => (
            <div key={fact.label.tr} className={styles.ledgerRow}>
              <dt>{pick(fact.label, locale)}</dt>
              <dd>{pick(fact.value, locale)}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ══ 3 · LABORATUVAR ══ */}
      <section className={styles.lab} aria-labelledby="sasuke-lab">
        <header className={styles.sectionHead}>
          <h2 id="sasuke-lab" className={styles.sectionTitle}>
            {pick(SASUKE_LAB.title, locale)}
          </h2>
          <p className={styles.sectionLede}>{pick(SASUKE_LAB.lede, locale)}</p>
        </header>

        <ul className={styles.techGrid}>
          {SASUKE_TECHNIQUES.map((tech) => {
            const art = ability.get(tech.imageKey) ?? null;
            return (
              <li
                key={tech.key}
                className={styles.techCard}
                data-wing={tech.wing}
                data-tech={tech.key}
              >
                <span className={styles.techArt} aria-hidden>
                  {art ? (
                    <Image
                      src={art}
                      alt=""
                      fill
                      sizes={tech.wing === "rift" ? "1200px" : "720px"}
                    />
                  ) : (
                    <SasukeSigilMark
                      sigil={tech.sigil}
                      className={styles.techSigilBig}
                    />
                  )}
                  <span className={styles.techArtFx} />
                </span>
                <span className={styles.techBody}>
                  <span className={styles.techHead}>
                    <SasukeSigilMark
                      sigil={tech.sigil}
                      className={styles.techSigil}
                    />
                    <span className={styles.techKanji} aria-hidden>
                      {tech.kanji}
                    </span>
                  </span>
                  <span className={styles.techName}>{tech.name}</span>
                  <span className={styles.techTagline}>
                    {pick(tech.tagline, locale)}
                  </span>
                  <span className={styles.techText}>
                    {pick(tech.text, locale)}
                  </span>
                  <span className={styles.techTraits}>
                    {tech.traits.map((trait) => (
                      <span key={trait.tr} className={styles.techTrait}>
                        {pick(trait, locale)}
                      </span>
                    ))}
                  </span>
                </span>
                {slot(tech.imageKey)}
              </li>
            );
          })}
        </ul>

        <ul className={styles.minorRow}>
          {SASUKE_MINOR_TECHNIQUES.map((minor) => {
            const art = ability.get(minor.imageKey) ?? null;
            return (
              <li key={minor.name} className={styles.minorChip}>
                <span className={styles.minorArt} aria-hidden>
                  {art ? (
                    <Image src={art} alt="" fill sizes="420px" />
                  ) : (
                    <SasukeSigilMark
                      sigil={minor.sigil}
                      className={styles.minorSigil}
                    />
                  )}
                </span>
                <span className={styles.minorBody}>
                  <span className={styles.minorName}>{minor.name}</span>
                  <span className={styles.minorKanji} aria-hidden>
                    {minor.kanji}
                  </span>
                  <span className={styles.minorNote}>
                    {pick(minor.note, locale)}
                  </span>
                </span>
                {slot(minor.imageKey)}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );

  /* ── 5–7 · Yarığın altındaki yarı ─────────────────────────────────── */
  const tail = (
    <>
      {/* ══ 6 · KADER ÇİZELGESİ ══ */}
      <section className={styles.timeline} aria-labelledby="sasuke-kader">
        <header className={styles.sectionHead}>
          <h2 id="sasuke-kader" className={styles.sectionTitle}>
            {pick(SASUKE_TIMELINE_TEXT.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(SASUKE_TIMELINE_TEXT.lede, locale)}
          </p>
        </header>
        <ol className={styles.eraList}>
          {SASUKE_TIMELINE.map((era) => {
            const art = ability.get(era.imageKey) ?? null;
            return (
              <li
                key={era.key}
                className={styles.era}
                data-wing={era.wing}
                data-era={era.key}
                /* Görsel yoksa kadraj hiç çizilmez, metin kanadında
                   genişler — boş bir 16:9 kutu bırakmaktan iyi */
                data-art={art ? "true" : "false"}
              >
                <span className={styles.eraArt} aria-hidden>
                  {art ? <Image src={art} alt="" fill sizes="900px" /> : null}
                  <span className={styles.eraArtEdge} />
                </span>
                <div className={styles.eraBody}>
                  <span className={styles.eraAge}>{pick(era.age, locale)}</span>
                  <h3 className={styles.eraTitle}>{pick(era.title, locale)}</h3>
                  <p className={styles.eraText}>{pick(era.text, locale)}</p>
                  {era.quote ? (
                    <figure className={styles.eraQuote}>
                      <blockquote>
                        &ldquo;{pick(era.quote.text, locale)}&rdquo;
                      </blockquote>
                      <figcaption>{pick(era.quote.source, locale)}</figcaption>
                    </figure>
                  ) : null}
                </div>
                {slot(era.imageKey)}
              </li>
            );
          })}
        </ol>
      </section>

      {/* ══ 7 · KAPANIŞ ══ */}
      <section className={styles.closing} aria-labelledby="sasuke-kapanis">
        <h2 id="sasuke-kapanis" className={styles.visuallyHidden}>
          {pick(SASUKE_CLOSING.headingSr, locale)}
        </h2>
        {SASUKE_CLOSING.quotes.map((quote) => (
          <figure key={quote.text.tr} className={styles.closingQuote}>
            <blockquote>&ldquo;{pick(quote.text, locale)}&rdquo;</blockquote>
            <figcaption>{pick(quote.source, locale)}</figcaption>
          </figure>
        ))}

        <p className={styles.motto} aria-hidden>
          {SASUKE_CLOSING.motto.words.map((word) => (
            <span key={word} className={styles.mottoWord}>
              {word}
            </span>
          ))}
        </p>
        <p className={styles.mottoNote}>
          {pick(SASUKE_CLOSING.motto.note, locale)}
        </p>

        <p className={styles.credit}>
          {pick(SASUKE_CLOSING.credit, locale)}{" "}
          <a href={SASUKE_ANILIST_URL} rel="noreferrer noopener" target="_blank">
            {pick(SASUKE_CLOSING.creditLink, locale)}
          </a>
        </p>
      </section>
    </>
  );

  return (
    <RiftShell
      isAdmin={isAdmin}
      modeEnterLabel={pick(SASUKE_MODE_TEXT.enter, locale)}
      modeExitLabel={pick(SASUKE_MODE_TEXT.exit, locale)}
      head={head}
      twin={twin}
      tail={tail}
    />
  );
}
