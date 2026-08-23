import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { animeHref } from "@/lib/anime/routes";
import { pick } from "@/lib/characters/types";
import {
  collectAbilityImages,
  companionPortraits,
  isExperienceCharacter,
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import {
  ICHIGO_ARTS,
  ICHIGO_BONDS,
  ICHIGO_BONDS_TITLE,
  ICHIGO_CLOSING,
  ICHIGO_FACTS,
  ICHIGO_FATE,
  ICHIGO_FATE_TITLE,
  ICHIGO_HERO,
  ICHIGO_ID,
  ICHIGO_IDENTITY_TITLE,
  ICHIGO_IMAGE_KEYS,
  ICHIGO_LAB_TITLE,
  ICHIGO_MINOR_ARTS,
  ICHIGO_REIATSU_TEXT,
  ICHIGO_SLOT_LABELS,
  ICHIGO_STAGES,
  ICHIGO_VOICE_TITLE,
} from "@/lib/characters/ichigo-kurosaki-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { HollowMask, MoonSlash, PageCrack } from "./MaskCrack";
import { ReiatsuShell } from "./ReiatsuShell";
import { VoicePanel } from "./VoicePanel";
import styles from "./IchigoExperience.module.css";

/**
 * Ichigo Kurosaki — deneyim sayfası. Konsept: **MASKENİN ÇATLAĞI**.
 *
 * Sayfayı baştan aşağı elle çizilmiş kırık bir çatlak iniyor (`PageCrack`).
 * Çatlağın SOLU Shinigami (siyah/kızıl), SAĞI Hollow (kemik beyazı);
 * bölümler `data-lean` ile bir yana kayıyor, çatlak bölüm sınırlarında
 * yanal bir sıçramayla kırılıyor. Anlatı ekseni tek soru: **kim
 * konuşuyor?**
 *
 * Yedi durak: Hero → Künye → Üç Kılıç → Kim konuşuyor? → Kader çizelgesi →
 * Çatlağın iki yanı → Kapanış.
 *
 * Sayfa SUNUCUDA çiziliyor; iki istemci adası var:
 *   ReiatsuShell — tek durum (`data-reiatsu`), etkinin tamamı CSS'te
 *   VoicePanel   — beş kademeli maske denetimi (sekme deseni, klavyeli)
 * İkisi de gövdeyi `children` olarak alıyor, yani `next/image` çizimleri
 * ve bütün metin tarayıcıya JS olarak inmiyor.
 *
 * Görseller: characterId 5 kaydının ABILITY yuvaları (`ichigo:*`,
 * son-kazanır). Yuva boşken bölüm görselsiz ama AYAKTA kalıyor — hiçbir
 * düzen görselin varlığına bağlı değil.
 */
export function IchigoExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const src = (key: string): string | null => ability.get(key) ?? null;

  const portrait = primaryPortrait(detail);
  const portraitUnoptimized = !isUploadedPortrait(detail);
  const faces = companionPortraits(companions);

  const name = detail.character.name || ICHIGO_HERO.name;
  const nativeName = detail.character.nameNative ?? ICHIGO_HERO.nativeName;

  const slotLabel = (key: string) => pick(ICHIGO_SLOT_LABELS[key], locale);
  const slot = (key: string) =>
    isAdmin ? (
      <CuratorSlot
        characterId={ICHIGO_ID}
        slot="ABILITY"
        abilityName={key}
        label={slotLabel(key)}
      />
    ) : null;

  const heroScene = src(ICHIGO_IMAGE_KEYS.hero);
  const voiceBackdrop = src(ICHIGO_IMAGE_KEYS.voiceBackdrop);

  /* Kademe metinleri istemciye DÜZ DİZE iner — LocalizedText sınırı geçmez */
  const stageViews = ICHIGO_STAGES.map((stage) => ({
    key: stage.key,
    name: pick(stage.name, locale),
    kanji: stage.kanji,
    cover: stage.cover,
    who: pick(stage.who, locale),
    text: pick(stage.text, locale),
    lines: stage.lines.map((line) => ({
      label: pick(line.label, locale),
      value: pick(line.value, locale),
    })),
  }));

  const bondColumns = [
    { side: "left" as const, label: pick(ICHIGO_BONDS_TITLE.leftLabel, locale) },
    { side: "right" as const, label: pick(ICHIGO_BONDS_TITLE.rightLabel, locale) },
  ];

  return (
    <ReiatsuShell
      enterLabel={pick(ICHIGO_REIATSU_TEXT.enter, locale)}
      exitLabel={pick(ICHIGO_REIATSU_TEXT.exit, locale)}
      note={pick(ICHIGO_REIATSU_TEXT.note, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        {/* Sayfanın omurgası: kırık çatlak + Hollow tarafının yıkaması */}
        <PageCrack />

        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            /
          </span>
          <span className={styles.crumbHere}>Bleach</span>
        </nav>

        {/* ══ 1 · HERO ══════════════════════════════════════════════ */}
        <section className={styles.hero} aria-labelledby="ich-name">
          <span className={styles.heroScene} aria-hidden>
            {heroScene ? (
              <Image src={heroScene} alt="" fill sizes="100vw" priority />
            ) : null}
            <span className={styles.heroScrim} />
          </span>
          <p className={styles.heroWatermark} aria-hidden>
            {ICHIGO_HERO.watermark}
          </p>

          <div className={styles.heroInner}>
            <figure className={styles.portraitFrame}>
              <span className={styles.portraitBox}>
                {portrait ? (
                  <Image
                    src={portrait}
                    alt={pick(ICHIGO_HERO.portraitAlt, locale)}
                    fill
                    sizes="(max-width: 780px) 46vw, 216px"
                    priority
                    unoptimized={portraitUnoptimized}
                  />
                ) : (
                  <MoonSlash className={styles.portraitEmpty} />
                )}
                {/* Portrenin üstünden geçen kılcal kırık */}
                <span className={styles.portraitFracture} aria-hidden />
              </span>
              <figcaption className={styles.portraitNote}>
                {pick(ICHIGO_HERO.frameNote, locale)}
              </figcaption>
            </figure>

            <div className={styles.heroText}>
              <p className={styles.heroNative} aria-hidden>
                {nativeName}
              </p>
              <h1 id="ich-name" className={styles.heroName}>
                {name}
              </h1>
              <p className={styles.heroTitle}>
                {pick(ICHIGO_HERO.title, locale)}
                <span className={styles.heroRomaji} aria-hidden>
                  {ICHIGO_HERO.watermarkRomaji}
                </span>
              </p>
              <p className={styles.heroEpigraph}>
                {pick(ICHIGO_HERO.epigraph, locale)}
              </p>
            </div>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>{slot(ICHIGO_IMAGE_KEYS.hero)}</div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ═════════════════════════════════════════════ */}
        <section
          className={styles.section}
          data-lean="right"
          aria-labelledby="ich-identity"
        >
          <div className={styles.sectionInner}>
            <header className={styles.sectionHead}>
              <MoonSlash className={styles.sectionMark} />
              <h2 id="ich-identity" className={styles.sectionTitle}>
                {pick(ICHIGO_IDENTITY_TITLE.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(ICHIGO_IDENTITY_TITLE.lede, locale)}
              </p>
            </header>
            <dl className={styles.facts}>
              {ICHIGO_FACTS.map((fact) => (
                <div key={fact.label.tr} className={styles.fact}>
                  <dt>{pick(fact.label, locale)}</dt>
                  <dd>{pick(fact.value, locale)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ══ 3 · LABORATUVAR — ÜÇ KILIÇ ════════════════════════════ */}
        <section
          className={styles.section}
          data-lean="left"
          aria-labelledby="ich-lab"
        >
          <div className={styles.sectionInner}>
            <header className={styles.sectionHead}>
              <MoonSlash className={styles.sectionMark} />
              <h2 id="ich-lab" className={styles.sectionTitle}>
                {pick(ICHIGO_LAB_TITLE.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(ICHIGO_LAB_TITLE.lede, locale)}
              </p>
            </header>

            <ul className={styles.artList}>
              {ICHIGO_ARTS.map((art) => {
                const image = src(art.imageKey);
                return (
                  <li key={art.key} className={styles.artCard} data-art={art.key}>
                    <span className={styles.artArt} aria-hidden>
                      {image ? (
                        <Image src={image} alt="" fill sizes="820px" />
                      ) : null}
                      <span className={styles.artFx} />
                    </span>
                    <span className={styles.artBody}>
                      <span className={styles.artKanji} aria-hidden>
                        {art.kanji}
                      </span>
                      <span className={styles.artName}>{art.name}</span>
                      <span className={styles.artTagline}>
                        {pick(art.tagline, locale)}
                      </span>
                      <span className={styles.artRelease}>
                        {pick(art.release, locale)}
                      </span>
                      <span className={styles.artText}>
                        {pick(art.text, locale)}
                      </span>
                      <span className={styles.artTraits}>
                        {art.traits.map((trait) => (
                          <span key={trait.tr} className={styles.artTrait}>
                            {pick(trait, locale)}
                          </span>
                        ))}
                      </span>
                    </span>
                    {slot(art.imageKey)}
                  </li>
                );
              })}
            </ul>

            <ul className={styles.minorList}>
              {ICHIGO_MINOR_ARTS.map((minor) => {
                const image = src(minor.imageKey);
                return (
                  <li
                    key={minor.name}
                    className={styles.minorChip}
                    data-side={minor.side}
                  >
                    <span className={styles.minorArt} aria-hidden>
                      {image ? (
                        <Image src={image} alt="" fill sizes="420px" />
                      ) : null}
                    </span>
                    <span className={styles.minorBody}>
                      <span className={styles.minorKanji} aria-hidden>
                        {minor.kanji}
                      </span>
                      <span className={styles.minorName}>{minor.name}</span>
                      <span className={styles.minorNote}>
                        {pick(minor.note, locale)}
                      </span>
                    </span>
                    {slot(minor.imageKey)}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ══ 4 · KİM KONUŞUYOR? — sayfanın kalbi ═══════════════════ */}
        <section
          className={styles.voiceSection}
          data-lean="wide"
          aria-labelledby="ich-voice"
        >
          <div className={styles.sectionInner}>
            <header className={styles.sectionHead} data-align="center">
              <MoonSlash className={styles.sectionMark} />
              <h2 id="ich-voice" className={styles.sectionTitle}>
                {pick(ICHIGO_VOICE_TITLE.title, locale)}
              </h2>
              <p className={styles.voiceQuestion}>
                {pick(ICHIGO_VOICE_TITLE.question, locale)}
              </p>
              <p className={styles.sectionLede}>
                {pick(ICHIGO_VOICE_TITLE.lede, locale)}
              </p>
            </header>

            <VoicePanel
              stages={stageViews}
              railLabel={pick(ICHIGO_VOICE_TITLE.railLabel, locale)}
              hint={pick(ICHIGO_VOICE_TITLE.hint, locale)}
              coverLabel={pick(ICHIGO_VOICE_TITLE.coverLabel, locale)}
            >
              <span className={styles.stageBackdrop} aria-hidden>
                {voiceBackdrop ? (
                  <Image src={voiceBackdrop} alt="" fill sizes="900px" />
                ) : null}
              </span>
              <span className={styles.stagePortrait}>
                {portrait ? (
                  <Image
                    src={portrait}
                    alt={pick(ICHIGO_HERO.portraitAlt, locale)}
                    fill
                    sizes="(max-width: 980px) 62vw, 340px"
                    unoptimized={portraitUnoptimized}
                  />
                ) : (
                  <MoonSlash className={styles.portraitEmpty} />
                )}
              </span>
            </VoicePanel>

            {isAdmin ? (
              <div className={styles.slotRow}>
                {slot(ICHIGO_IMAGE_KEYS.voiceBackdrop)}
                {slot(ICHIGO_IMAGE_KEYS.mask)}
              </div>
            ) : null}
          </div>
        </section>

        {/* ══ 5 · KADER ÇİZELGESİ ═══════════════════════════════════ */}
        <section
          className={styles.section}
          data-lean="wide"
          aria-labelledby="ich-fate"
        >
          <div className={styles.sectionInner}>
            <header className={styles.sectionHead}>
              <MoonSlash className={styles.sectionMark} />
              <h2 id="ich-fate" className={styles.sectionTitle}>
                {pick(ICHIGO_FATE_TITLE.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(ICHIGO_FATE_TITLE.lede, locale)}
              </p>
            </header>

            <ol className={styles.fateList}>
              {ICHIGO_FATE.map((step) => {
                const image = src(step.imageKey);
                return (
                  <li
                    key={step.key}
                    className={styles.fateStep}
                    data-side={step.side}
                  >
                    <span className={styles.fateArt} aria-hidden>
                      {image ? (
                        <Image src={image} alt="" fill sizes="820px" />
                      ) : null}
                      <span className={styles.fateVignette} />
                    </span>
                    <div className={styles.fateBody}>
                      <span className={styles.fateMeta}>
                        <span className={styles.fateAge}>
                          {pick(step.age, locale)}
                        </span>
                        <span className={styles.fateMark} aria-hidden>
                          {step.mark}
                        </span>
                      </span>
                      <h3 className={styles.fateTitle}>
                        {pick(step.title, locale)}
                      </h3>
                      <p className={styles.fateText}>{pick(step.text, locale)}</p>
                    </div>
                    {slot(step.imageKey)}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ══ 6 · ÇATLAĞIN İKİ YANI ═════════════════════════════════ */}
        <section
          className={styles.section}
          data-lean="wide"
          aria-labelledby="ich-bonds"
        >
          <div className={styles.sectionInner}>
            <header className={styles.sectionHead}>
              <MoonSlash className={styles.sectionMark} />
              <h2 id="ich-bonds" className={styles.sectionTitle}>
                {pick(ICHIGO_BONDS_TITLE.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(ICHIGO_BONDS_TITLE.lede, locale)}
              </p>
            </header>

            <div className={styles.bondSplit}>
              {bondColumns.map((column) => (
                <div
                  key={column.side}
                  className={styles.bondColumn}
                  data-side={column.side}
                >
                  <h3 className={styles.bondColumnTitle}>{column.label}</h3>
                  <ul className={styles.bondList}>
                    {ICHIGO_BONDS.filter(
                      (bond) => bond.side === column.side,
                    ).map((bond) => {
                      const face = faces.get(bond.characterId) ?? null;
                      const linked = isExperienceCharacter(bond.characterId);
                      const inner = (
                        <>
                          <span className={styles.bondFace} aria-hidden>
                            {face ? (
                              <Image src={face} alt="" fill sizes="88px" />
                            ) : (
                              <MoonSlash className={styles.bondFaceMark} />
                            )}
                          </span>
                          <span className={styles.bondText}>
                            <span className={styles.bondName}>{bond.name}</span>
                            <span className={styles.bondNote}>
                              {pick(bond.note, locale)}
                            </span>
                          </span>
                        </>
                      );
                      return (
                        <li key={bond.characterId} className={styles.bond}>
                          {linked ? (
                            <Link
                              href={animeHref.character(bond.characterId)}
                              className={styles.bondLink}
                            >
                              {inner}
                            </Link>
                          ) : (
                            <span className={styles.bondStatic}>{inner}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 7 · KAPANIŞ ═══════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="ich-closing">
          <h2 id="ich-closing" className={styles.visuallyHidden}>
            {pick(ICHIGO_CLOSING.title, locale)}
          </h2>

          {ICHIGO_CLOSING.quotes.map((quote) => (
            <figure key={quote.text.tr} className={styles.closingQuote}>
              <blockquote>&ldquo;{pick(quote.text, locale)}&rdquo;</blockquote>
              <figcaption>{pick(quote.note, locale)}</figcaption>
            </figure>
          ))}

          <div className={styles.mottoBlock}>
            <span className={styles.mottoMask} aria-hidden>
              <HollowMask />
            </span>
            <p className={styles.motto} aria-hidden>
              {ICHIGO_CLOSING.motto}
            </p>
            <p className={styles.mottoGloss}>
              {pick(ICHIGO_CLOSING.mottoGloss, locale)}
            </p>
          </div>

          <p className={styles.credit}>
            {pick(ICHIGO_CLOSING.credit, locale)}{" "}
            <a
              className={styles.creditLink}
              href={ICHIGO_CLOSING.creditHref}
              target="_blank"
              rel="noreferrer"
            >
              {pick(ICHIGO_CLOSING.creditLink, locale)}
            </a>
          </p>
        </section>
      </CuratorFrame>
    </ReiatsuShell>
  );
}
