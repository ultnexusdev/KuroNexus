import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { animeHref } from "@/lib/anime/routes";
import { pick } from "@/lib/characters/types";
import {
  collectAbilityImages,
  companionPortraits,
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import {
  MEGUMI_ALT,
  MEGUMI_ARTS,
  MEGUMI_CLOSING,
  MEGUMI_CRUMB,
  MEGUMI_DETAILS,
  MEGUMI_DUSK_TEXT,
  MEGUMI_HERO,
  MEGUMI_ID,
  MEGUMI_IDENTITY,
  MEGUMI_IMAGE_KEYS,
  MEGUMI_MISSING_NOTE,
  MEGUMI_SECTIONS,
  MEGUMI_SHADOW_UI,
  MEGUMI_SHADOWS,
  MEGUMI_SITE_URL,
  MEGUMI_SLOT_LABELS,
  MEGUMI_TIMELINE,
} from "./data";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { DuskShell } from "./DuskShell";
import { ShadowLine } from "./ShadowLine";
import styles from "./TenShadowsExperience.module.css";

/**
 * Megumi Fushiguro — "Gölge Çizgisi" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/126635 bu bileşene çıkıyor
 * (kendi statik rota klasörü). Sayfanın fikri tek cümle: HER ŞEY AYNI
 * ÇİZGİDEN KALKAR. Sayfanın üstünden altına kadar tek bir zemin çizgisi
 * geçiyor; on gölge onun altında yatıyor ve seçilen doğruluyor. Biri
 * kırıldığı için bir daha doğrulmuyor — sayfanın taşıdığı asıl cümle bu.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   DuskShell  — ışığı alçaltan mod (tek boolean, etkinin tamamı CSS)
 *   ShadowLine — on gölgenin çizgisi (sayfanın kalbi)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 126635 kaydının ABILITY yuvaları (`meg:*`).
 * ⚠️ 25 Ağustos 2026'da bu kayıtta HİÇ görsel yok; on siluet elle çizilmiş
 * SVG olduğu için sayfanın kalbi görselden tamamen bağımsız.
 */
export function TenShadowsExperience({
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
  const portraitUploaded = isUploadedPortrait(detail);
  const heroScene = src(MEGUMI_IMAGE_KEYS.hero);
  const closingArt = src(MEGUMI_IMAGE_KEYS.closing);

  const name = detail.character.name || MEGUMI_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? MEGUMI_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? MEGUMI_SITE_URL;
  const companionSuffix = pick(MEGUMI_ALT.companionSuffix, locale);

  const stateLabel = {
    tamed: pick(MEGUMI_SHADOW_UI.stateTamed, locale),
    broken: pick(MEGUMI_SHADOW_UI.stateBroken, locale),
    untamed: pick(MEGUMI_SHADOW_UI.stateUntamed, locale),
  };

  const shadows = MEGUMI_SHADOWS.map((shadow) => ({
    key: shadow.key,
    kanji: shadow.kanji,
    name: shadow.name,
    reading: shadow.reading,
    turkish: pick(shadow.turkish, locale),
    figure: shadow.figure,
    state: shadow.state,
    stateLabel: stateLabel[shadow.state],
    role: pick(shadow.role, locale),
    text: pick(shadow.text, locale),
    ritualWarning: shadow.ritualWarning
      ? pick(shadow.ritualWarning, locale)
      : null,
  }));

  return (
    <DuskShell
      enterLabel={pick(MEGUMI_DUSK_TEXT.enter, locale)}
      exitLabel={pick(MEGUMI_DUSK_TEXT.exit, locale)}
      hint={pick(MEGUMI_DUSK_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <span className={styles.crumbHere}>
            {pick(MEGUMI_CRUMB.series, locale)}
          </span>
        </nav>

        {/* ══ 1 · HERO ═══════════════════════════════════════════════════
            Portrenin altından sayfanın tamamına inen tek çizgi burada
            başlıyor: hero'nun alt kenarı zemin çizgisinin kendisi. */}
        <section className={styles.hero} aria-labelledby="meg-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <p className={styles.heroMark} aria-hidden>
            {MEGUMI_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <p className={styles.heroHouse}>
              {pick(MEGUMI_IDENTITY.house, locale)}
            </p>
            <h1 id="meg-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {nativeName}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(MEGUMI_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(MEGUMI_HERO.lede, locale)}</p>
          </div>

          <div className={styles.heroAside}>
            <span className={styles.heroPortrait}>
              {portrait ? (
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? MEGUMI_HERO.portraitAlt
                      : MEGUMI_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="(max-width: 760px) 55vw, 360px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              ) : null}
              {/* Portrenin dibinden yana yayılan gölge — mod açıkken uzuyor */}
              <span className={styles.heroCast} aria-hidden />
            </span>
            <p className={styles.heroGroundCaption}>
              {pick(MEGUMI_HERO.groundCaption, locale)}
            </p>
          </div>

          <span className={styles.heroGround} aria-hidden />

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={MEGUMI_ID}
                slot="ABILITY"
                abilityName={MEGUMI_IMAGE_KEYS.hero}
                label={pick(MEGUMI_SLOT_LABELS[MEGUMI_IMAGE_KEYS.hero], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="meg-identity">
          <header className={styles.sectionHead}>
            <h2 id="meg-identity" className={styles.sectionTitle}>
              {pick(MEGUMI_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(MEGUMI_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {MEGUMI_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.factNote}>{pick(MEGUMI_MISSING_NOTE, locale)}</p>
        </section>

        {/* ══ 3 · ÜÇ SÜTUN ═══════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="meg-arts">
          <header className={styles.sectionHead}>
            <h2 id="meg-arts" className={styles.sectionTitle}>
              {pick(MEGUMI_SECTIONS.arts.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(MEGUMI_SECTIONS.arts.lede, locale)}
            </p>
          </header>
          <ul className={styles.arts}>
            {MEGUMI_ARTS.map((art) => {
              const scene = src(art.imageKey);
              return (
                <li key={art.key} className={styles.art}>
                  <span className={styles.artArt} aria-hidden>
                    {scene ? (
                      <Image src={scene} alt="" fill sizes="760px" />
                    ) : null}
                  </span>
                  <span className={styles.artKanji} aria-hidden>
                    {art.kanji}
                  </span>
                  <span className={styles.artBody}>
                    <span className={styles.artName}>{art.name}</span>
                    <span className={styles.artReading} aria-hidden>
                      {art.reading}
                    </span>
                    <span className={styles.artTurkish}>
                      {pick(art.turkish, locale)}
                    </span>
                    <span className={styles.artTagline}>
                      {pick(art.tagline, locale)}
                    </span>
                    <span className={styles.artText}>
                      {pick(art.text, locale)}
                    </span>
                    <span className={styles.artTraits}>
                      {art.traits.map((trait) => (
                        <span key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={MEGUMI_ID}
                      slot="ABILITY"
                      abilityName={art.imageKey}
                      label={pick(MEGUMI_SLOT_LABELS[art.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · DÖRT AYRINTI ═══════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="meg-details">
          <header className={styles.sectionHead}>
            <h2 id="meg-details" className={styles.sectionTitle}>
              {pick(MEGUMI_SECTIONS.tools.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(MEGUMI_SECTIONS.tools.lede, locale)}
            </p>
          </header>
          <ul className={styles.notes}>
            {MEGUMI_DETAILS.map((item) => {
              const scene = src(item.imageKey);
              return (
                <li key={item.key} className={styles.note}>
                  <span className={styles.noteArt} aria-hidden>
                    {scene ? (
                      <Image src={scene} alt="" fill sizes="480px" />
                    ) : null}
                  </span>
                  <span className={styles.noteKanji} aria-hidden>
                    {item.kanji}
                  </span>
                  <span className={styles.noteName}>
                    {pick(item.name, locale)}
                  </span>
                  <span className={styles.noteText}>
                    {pick(item.note, locale)}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={MEGUMI_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(MEGUMI_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · ON GÖLGE — SAYFANIN KALBİ ══════════════════════════════ */}
        <section className={styles.shadowSection} aria-labelledby="meg-shadows">
          <header className={styles.sectionHead}>
            <h2 id="meg-shadows" className={styles.sectionTitle}>
              {pick(MEGUMI_SECTIONS.shadows.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(MEGUMI_SECTIONS.shadows.lede, locale)}
            </p>
          </header>

          <ShadowLine
            shadows={shadows}
            listLabel={pick(MEGUMI_SHADOW_UI.listLabel, locale)}
            stageLabel={pick(MEGUMI_SHADOW_UI.stageLabel, locale)}
            ritualButton={pick(MEGUMI_SHADOW_UI.ritualButton, locale)}
            ritualWord={MEGUMI_SHADOW_UI.ritualWord}
            ritualWordNote={pick(MEGUMI_SHADOW_UI.ritualWordNote, locale)}
            countLabel={pick(MEGUMI_SHADOW_UI.countLabel, locale)}
            countBrokenLabel={pick(MEGUMI_SHADOW_UI.countBrokenLabel, locale)}
            statusRisen={pick(MEGUMI_SHADOW_UI.statusRisen, locale)}
            statusBroken={pick(MEGUMI_SHADOW_UI.statusBroken, locale)}
            statusUntamed={pick(MEGUMI_SHADOW_UI.statusUntamed, locale)}
            statusRitual={pick(MEGUMI_SHADOW_UI.statusRitual, locale)}
            keyboardHint={pick(MEGUMI_SHADOW_UI.keyboardHint, locale)}
          />
        </section>

        {/* ══ 6 · BEŞ DURAK ══════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="meg-fate">
          <header className={styles.sectionHead}>
            <h2 id="meg-fate" className={styles.sectionTitle}>
              {pick(MEGUMI_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(MEGUMI_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {MEGUMI_TIMELINE.map((entry) => {
              const scene = src(entry.imageKey);
              const face = entry.kin
                ? (faces.get(entry.kin.characterId) ?? null)
                : null;
              return (
                <li key={entry.key} className={styles.fateItem}>
                  <p className={styles.fateAge}>{pick(entry.age, locale)}</p>
                  <div className={styles.fateBody}>
                    <h3 className={styles.fateTitle}>
                      {pick(entry.title, locale)}
                    </h3>
                    <p className={styles.fateText}>{pick(entry.text, locale)}</p>
                    {entry.quote ? (
                      <figure className={styles.fateQuote}>
                        <blockquote lang="ja">
                          {pick(entry.quote.text, locale)}
                        </blockquote>
                        <figcaption>{pick(entry.quote.by, locale)}</figcaption>
                      </figure>
                    ) : null}
                    {entry.kin ? (
                      <p className={styles.fateKin}>
                        {face ? (
                          <span className={styles.fateKinFace}>
                            <Image
                              src={face}
                              alt={`${entry.kin.name} ${companionSuffix}`}
                              fill
                              sizes="64px"
                            />
                          </span>
                        ) : null}
                        <span className={styles.fateKinName}>
                          {entry.kin.name}
                        </span>
                        <span className={styles.fateKinRole}>
                          {pick(entry.kin.role, locale)}
                        </span>
                      </p>
                    ) : null}
                  </div>
                  <span className={styles.fateArt} aria-hidden>
                    {scene ? (
                      <Image src={scene} alt="" fill sizes="560px" />
                    ) : null}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={MEGUMI_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(MEGUMI_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 7 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="meg-closing">
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}
          <header className={styles.sectionHead}>
            <h2 id="meg-closing" className={styles.sectionTitle}>
              {pick(MEGUMI_SECTIONS.closing.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(MEGUMI_SECTIONS.closing.lede, locale)}
            </p>
          </header>

          <ul className={styles.closingQuotes}>
            {MEGUMI_CLOSING.quotes.map((quote) => (
              <li key={quote.text.tr}>
                <figure className={styles.closingQuote}>
                  <blockquote className={styles.quoteJa} lang="ja">
                    {pick(quote.text, locale)}
                  </blockquote>
                  <p className={styles.quoteReading}>
                    {pick(quote.reading, locale)}
                  </p>
                  <figcaption>
                    <span className={styles.quoteBy}>
                      {pick(quote.by, locale)}
                    </span>
                    <span className={styles.quoteNote}>
                      {pick(quote.note, locale)}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <p className={styles.motto} aria-hidden>
            {MEGUMI_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(MEGUMI_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(MEGUMI_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(MEGUMI_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={MEGUMI_ID}
                slot="ABILITY"
                abilityName={MEGUMI_IMAGE_KEYS.closing}
                label={pick(
                  MEGUMI_SLOT_LABELS[MEGUMI_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </DuskShell>
  );
}
