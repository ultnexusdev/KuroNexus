import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import {
  collectAbilityImages,
  companionPortraits,
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import { pick, type LocalizedText } from "@/lib/characters/types";
import {
  NARUTO_CHRONICLE,
  NARUTO_CLOSING,
  NARUTO_COMPANION_NAMES,
  NARUTO_ERAS,
  NARUTO_HERO,
  NARUTO_ID,
  NARUTO_IDENTITY,
  NARUTO_IMAGE_KEYS,
  NARUTO_LAB,
  NARUTO_MODE_TEXT,
  NARUTO_SCALE,
  NARUTO_SLOT_LABELS,
  NARUTO_STAGES,
} from "@/lib/characters/naruto-uzumaki-experience";
import { animeHref } from "@/lib/anime/routes";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { ChakraShell, type ShellStage } from "./ChakraShell";
import {
  ChakraOrb,
  CloneTrio,
  SealMark,
  TagGlyph,
  ToadEyes,
  UzumakiSpiral,
} from "./NarutoGlyphs";
import styles from "./NarutoExperience.module.css";

/**
 * Naruto Uzumaki — interaktif deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/17 bu bileşene dallanır.
 * Akış: Hero (sarmal filigran) → Künye → DOKUZ KUYRUK ÖLÇEĞİ → Avucunda
 * taşıdıkları → Reddedilmişten kabul edilmişe → Kapanış.
 *
 * Sayfanın kalbi kuyruk rayı: kullanıcı bir kademe seçince kök öğedeki
 * `data-tail` değişiyor, CSS ondan `--nrt-heat` sayısını okuyup sayfanın
 * canlı vurgu rengini `--nrt-chakra` ile `--nrt-kurama` arasında kaydırıyor.
 * Isı eğrisi bilinçli olarak dokuz kuyrukta tepe yapıp Bijuu Modu'nda
 * düşüyor — sayfanın tezi bu (veri dosyasının başındaki nota bak).
 *
 * Bileşen SUNUCUDA çizilir; tek istemci adası `ChakraShell`. Metinler
 * burada `pick()` ile seçilip adaya düz dize olarak iner.
 *
 * Görsel çözümleme: characterId 17 kaydının `naruto-uzumaki:*` ABILITY
 * yuvaları. Aynı kayıttaki `naruto:*` anahtarları Naruto Evreni sayfasına
 * ait, buraya karışmaz. Görsel inmemişse bölüm sahnesiz ama AYAKTA kalır:
 * her kadrajın elle çizilmiş bir glif yedeği var.
 */

/** Laboratuvarın üç büyük kartının kendi grafiği. */
const BAND_GLYPH = {
  rasengan: ChakraOrb,
  kagebunshin: CloneTrio,
  sennin: ToadEyes,
} as const;

export function NarutoExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const faces = companionPortraits(companions);
  const src = (key: string): string | null => ability.get(key) ?? null;

  const portrait = primaryPortrait(detail);
  const uploaded = isUploadedPortrait(detail);
  const portraitAlt: LocalizedText = uploaded
    ? {
        tr: "Naruto Uzumaki — arşive yüklenmiş tam boy portre",
        en: "Naruto Uzumaki — full-length portrait uploaded to the archive",
      }
    : {
        tr: "Naruto Uzumaki — AniList künye portresi",
        en: "Naruto Uzumaki — AniList profile portrait",
      };

  /** Yoldaş yüzü: portre kaydı yoksa yalnız ad çizilir, bölüm çökmez. */
  const companion = (id: number) => ({
    id,
    name: NARUTO_COMPANION_NAMES[id] ?? String(id),
    src: faces.get(id) ?? null,
  });

  const slot = (key: string) =>
    isAdmin ? (
      <CuratorSlot
        characterId={NARUTO_ID}
        slot="ABILITY"
        abilityName={key}
        label={pick(NARUTO_SLOT_LABELS[key], locale)}
      />
    ) : null;

  const stages: ShellStage[] = NARUTO_STAGES.map((item) => ({
    key: item.key,
    short: pick(item.short, locale),
    mark: item.mark,
    tails: item.tails,
    node: item.node,
    native: item.native,
    name: pick(item.name, locale),
    when: pick(item.when, locale),
    text: pick(item.text, locale),
    pressure: pick(item.pressure, locale),
    cost: pick(item.cost, locale),
    image: src(item.imageKey),
    face: item.companionId
      ? {
          src: faces.get(item.companionId) ?? null,
          name: NARUTO_COMPANION_NAMES[item.companionId] ?? "",
        }
      : null,
    slot: slot(item.imageKey),
  }));

  const heroScene = src(NARUTO_IMAGE_KEYS.heroScene);

  return (
    <ChakraShell
      isAdmin={isAdmin}
      modeEnter={pick(NARUTO_MODE_TEXT.enter, locale)}
      modeExit={pick(NARUTO_MODE_TEXT.exit, locale)}
      modeNote={pick(NARUTO_MODE_TEXT.note, locale)}
      identity={{
        heading: pick(NARUTO_IDENTITY.heading, locale),
        pressureLabel: pick(NARUTO_IDENTITY.pressureLabel, locale),
        rows: NARUTO_IDENTITY.rows.map((row) => ({
          label: pick(row.label, locale),
          value: pick(row.value, locale),
        })),
      }}
      scale={{
        title: pick(NARUTO_SCALE.title, locale),
        lede: pick(NARUTO_SCALE.lede, locale),
        railLabel: pick(NARUTO_SCALE.railLabel, locale),
        hint: pick(NARUTO_SCALE.hint, locale),
        whenLabel: pick(NARUTO_SCALE.whenLabel, locale),
        costLabel: pick(NARUTO_SCALE.costLabel, locale),
        fanLabel: pick(NARUTO_SCALE.fanLabel, locale),
        pressureLabel: pick(NARUTO_IDENTITY.pressureLabel, locale),
      }}
      stages={stages}
      hero={
        <>
          <nav className={styles.crumb} aria-label="breadcrumb">
            <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
            <span className={styles.crumbSep} aria-hidden>
              /
            </span>
            <span className={styles.crumbHere}>{NARUTO_HERO.name}</span>
          </nav>

          {/* ══ 1 · HERO — SARMAL FİLİGRAN ══ */}
          <section className={styles.hero} aria-labelledby="naruto-name">
            {/* Uzumaki sarmalı: sayfanın en büyük grafiği, tamamen dekoratif */}
            <span className={styles.heroSpiral} aria-hidden>
              <UzumakiSpiral />
            </span>
            {heroScene ? (
              <span className={styles.heroScene} aria-hidden>
                <Image src={heroScene} alt="" fill sizes="100vw" priority />
              </span>
            ) : null}

            <div className={styles.heroInner}>
              <div className={styles.heroFrame}>
                {portrait ? (
                  <Image
                    src={portrait}
                    alt={pick(portraitAlt, locale)}
                    fill
                    sizes="(max-width: 900px) 62vw, 22rem"
                    priority
                    /* AniList portresi next.config remotePatterns'ta yok */
                    unoptimized={!uploaded}
                  />
                ) : (
                  <SealMark className={styles.heroFrameGlyph} />
                )}
                <SealMark className={styles.heroSeal} />
              </div>

              <div className={styles.heroType}>
                <h1 id="naruto-name" className={styles.heroName}>
                  {NARUTO_HERO.name}
                </h1>
                <p className={styles.heroNative} aria-hidden>
                  {NARUTO_HERO.nativeName}
                </p>
                <p className={styles.heroEpigraph}>
                  {pick(NARUTO_HERO.epigraph, locale)}
                </p>
                <ul className={styles.heroTags}>
                  {NARUTO_HERO.tags.map((tag) => (
                    <li key={tag.tr}>{pick(tag, locale)}</li>
                  ))}
                </ul>
              </div>
            </div>

            {isAdmin ? (
              <div className={styles.slotRow}>{slot(NARUTO_IMAGE_KEYS.heroScene)}</div>
            ) : null}
          </section>
        </>
      }
    >
      {/* ══ 4 · AVUCUNDA TAŞIDIKLARI ══ */}
      <section className={styles.lab} aria-labelledby="naruto-lab">
        <header className={styles.sectionHead}>
          <h2 id="naruto-lab" className={styles.sectionTitle}>
            {pick(NARUTO_LAB.title, locale)}
          </h2>
          <p className={styles.sectionLede}>{pick(NARUTO_LAB.lede, locale)}</p>
        </header>

        <div className={styles.bands}>
          {NARUTO_LAB.jutsu.map((jutsu) => {
            const art = src(jutsu.imageKey);
            const Glyph = BAND_GLYPH[jutsu.key];
            return (
              <article key={jutsu.key} className={styles.band} data-jutsu={jutsu.key}>
                <div className={styles.bandArt}>
                  {art ? (
                    <Image
                      src={art}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 100vw, 52vw"
                      aria-hidden
                    />
                  ) : null}
                  <Glyph
                    className={styles.bandGlyph}
                    spinClassName={styles.orbSpin}
                  />
                  <span className={styles.bandScrim} aria-hidden />
                </div>
                <div className={styles.bandBody}>
                  <p className={styles.bandNative} aria-hidden>
                    {jutsu.native}
                  </p>
                  <h3 className={styles.bandName}>{jutsu.name}</h3>
                  <p className={styles.bandTagline}>{pick(jutsu.tagline, locale)}</p>
                  <p className={styles.bandText}>{pick(jutsu.text, locale)}</p>
                  <ul className={styles.bandTraits}>
                    {jutsu.traits.map((trait) => (
                      <li key={trait.tr}>{pick(trait, locale)}</li>
                    ))}
                  </ul>
                </div>
                {slot(jutsu.imageKey)}
              </article>
            );
          })}
        </div>

        {/* Dört mühür etiketi — kâğıt fişler */}
        <ul className={styles.tags}>
          {NARUTO_LAB.tags.map((tag) => {
            const art = src(tag.imageKey);
            return (
              <li key={tag.key} className={styles.tag}>
                <span className={styles.tagArt}>
                  {art ? (
                    <Image src={art} alt="" fill sizes="240px" aria-hidden />
                  ) : null}
                  <TagGlyph kind={tag.key} className={styles.tagGlyph} />
                </span>
                <span className={styles.tagBody}>
                  <span className={styles.tagNative} aria-hidden>
                    {tag.native}
                  </span>
                  <span className={styles.tagName}>{tag.name}</span>
                  <span className={styles.tagNote}>{pick(tag.note, locale)}</span>
                </span>
                {slot(tag.imageKey)}
              </li>
            );
          })}
        </ul>
      </section>

      {/* ══ 6 · REDDEDİLMİŞTEN KABUL EDİLMİŞE ══ */}
      <section className={styles.chronicle} aria-labelledby="naruto-chronicle">
        <header className={styles.sectionHead}>
          <h2 id="naruto-chronicle" className={styles.sectionTitle}>
            {pick(NARUTO_CHRONICLE.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(NARUTO_CHRONICLE.lede, locale)}
          </p>
        </header>

        <ol className={styles.eras}>
          {NARUTO_ERAS.map((era) => {
            const art = src(era.imageKey);
            const people = era.companionIds.map(companion);
            return (
              <li key={era.key} className={styles.era} data-era={era.key}>
                <span className={styles.eraNode} aria-hidden>
                  <SealMark />
                </span>
                <div className={styles.eraCard}>
                  <p className={styles.eraAge}>{pick(era.age, locale)}</p>
                  <h3 className={styles.eraTitle}>{pick(era.title, locale)}</h3>
                  <div className={styles.eraArt}>
                    {art ? (
                      <Image
                        src={art}
                        alt=""
                        fill
                        sizes="(max-width: 900px) 100vw, 44vw"
                        aria-hidden
                      />
                    ) : null}
                    <span className={styles.eraArtScrim} aria-hidden />
                  </div>
                  <p className={styles.eraText}>{pick(era.text, locale)}</p>
                  {era.quote ? (
                    <blockquote className={styles.eraQuote}>
                      &ldquo;{pick(era.quote, locale)}&rdquo;
                    </blockquote>
                  ) : null}
                  {era.note ? (
                    <p className={styles.eraNote}>{pick(era.note, locale)}</p>
                  ) : null}
                  <div className={styles.eraPeople}>
                    <span className={styles.eraPeopleLabel}>
                      {pick(NARUTO_CHRONICLE.withLabel, locale)}
                    </span>
                    <ul>
                      {people.map((person) => (
                        <li key={person.id} className={styles.person}>
                          <span className={styles.personFace}>
                            {person.src ? (
                              <Image
                                src={person.src}
                                alt={person.name}
                                fill
                                sizes="88px"
                              />
                            ) : (
                              <SealMark className={styles.personGlyph} />
                            )}
                          </span>
                          <span className={styles.personName}>{person.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {slot(era.imageKey)}
              </li>
            );
          })}
        </ol>
      </section>

      {/* ══ 7 · KAPANIŞ ══ */}
      <section className={styles.closing} aria-labelledby="naruto-closing">
        <h2 id="naruto-closing" className={styles.visuallyHidden}>
          {NARUTO_HERO.name}
        </h2>
        <span className={styles.mottoMark} aria-hidden>
          {NARUTO_CLOSING.motto.native}
        </span>
        {NARUTO_CLOSING.quotes.map((quote) => (
          <figure key={quote.text.tr} className={styles.closingQuote}>
            <blockquote>&ldquo;{pick(quote.text, locale)}&rdquo;</blockquote>
            <figcaption>{pick(quote.note, locale)}</figcaption>
          </figure>
        ))}
        <p className={styles.mottoGloss}>{pick(NARUTO_CLOSING.motto.gloss, locale)}</p>
        <p className={styles.credit}>
          {pick(NARUTO_CLOSING.credit, locale)}
          {detail.character.siteUrl ? (
            <>
              {" "}
              <a
                className={styles.creditLink}
                href={detail.character.siteUrl}
                target="_blank"
                rel="noreferrer"
              >
                {pick(NARUTO_CLOSING.creditLink, locale)}
              </a>
            </>
          ) : null}
        </p>
      </section>
    </ChakraShell>
  );
}
