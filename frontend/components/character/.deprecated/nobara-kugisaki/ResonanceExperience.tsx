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
  NOBARA_ALT,
  NOBARA_ARTS,
  NOBARA_ASSERT_TEXT,
  NOBARA_BENCH_UI,
  NOBARA_CLOSING,
  NOBARA_CRUMB,
  NOBARA_DETAILS,
  NOBARA_HERO,
  NOBARA_ID,
  NOBARA_IDENTITY,
  NOBARA_IMAGE_KEYS,
  NOBARA_MISSING_NOTE,
  NOBARA_POINTS,
  NOBARA_SECTIONS,
  NOBARA_SITE_URL,
  NOBARA_SLOT_LABELS,
  NOBARA_TIMELINE,
} from "./data";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { AssertShell } from "./AssertShell";
import { ResonanceBench } from "./ResonanceBench";
import styles from "./ResonanceExperience.module.css";

/**
 * Nobara Kugisaki — "Rezonans" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/133700 bu bileşene çıkıyor
 * (kendi statik rota klasörü). Sayfanın fikri tek cümle: SEBEP BURADA,
 * SONUÇ ORADA. Sayfanın kalbi iki panolu bir tezgâh — soldakine vuruyorsun,
 * sağdakinde çıkıyor, ve aralarında bir bağ yoksa hiçbir şey olmuyor.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   AssertShell    — sayfanın sesini yükselten mod (tek boolean, etkisi CSS)
 *   ResonanceBench — rezonans tezgâhı (sayfanın kalbi)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 133700 kaydının ABILITY yuvaları (`nob:*`).
 * ⚠️ 25 Ağustos 2026'da bu kayıtta HİÇ görsel yok; tezgâhın tamamı elle
 * çizilmiş SVG olduğu için sayfanın kalbi görselden bağımsız.
 */
export function ResonanceExperience({
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
  const heroScene = src(NOBARA_IMAGE_KEYS.hero);
  const closingArt = src(NOBARA_IMAGE_KEYS.closing);

  const name = detail.character.name || NOBARA_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? NOBARA_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? NOBARA_SITE_URL;
  const companionSuffix = pick(NOBARA_ALT.companionSuffix, locale);

  const points = NOBARA_POINTS.map((point) => ({
    key: point.key,
    x: point.x,
    y: point.y,
    name: pick(point.name, locale),
  }));

  return (
    <AssertShell
      enterLabel={pick(NOBARA_ASSERT_TEXT.enter, locale)}
      exitLabel={pick(NOBARA_ASSERT_TEXT.exit, locale)}
      hint={pick(NOBARA_ASSERT_TEXT.hint, locale)}
      banner={NOBARA_ASSERT_TEXT.banner}
      bannerNote={pick(NOBARA_ASSERT_TEXT.bannerNote, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <span className={styles.crumbHere}>
            {pick(NOBARA_CRUMB.series, locale)}
          </span>
        </nav>

        {/* ══ 1 · HERO ═══════════════════════════════════════════════════ */}
        <section className={styles.hero} aria-labelledby="nob-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <p className={styles.heroMark} aria-hidden>
            {NOBARA_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <p className={styles.heroHouse}>
              {pick(NOBARA_IDENTITY.house, locale)}
            </p>
            <h1 id="nob-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {nativeName}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(NOBARA_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(NOBARA_HERO.lede, locale)}</p>
          </div>

          <div className={styles.heroAside}>
            <span className={styles.heroPortrait}>
              {portrait ? (
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? NOBARA_HERO.portraitAlt
                      : NOBARA_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="(max-width: 760px) 55vw, 360px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              ) : null}
              {/* Portrenin kenarına çakılmış çivi sırası — dekoratif */}
              <span className={styles.heroNails} aria-hidden />
            </span>
            <p className={styles.heroToolCaption}>
              {pick(NOBARA_HERO.toolCaption, locale)}
            </p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={NOBARA_ID}
                slot="ABILITY"
                abilityName={NOBARA_IMAGE_KEYS.hero}
                label={pick(NOBARA_SLOT_LABELS[NOBARA_IMAGE_KEYS.hero], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="nob-identity">
          <header className={styles.sectionHead}>
            <h2 id="nob-identity" className={styles.sectionTitle}>
              {pick(NOBARA_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NOBARA_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {NOBARA_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.factNote}>{pick(NOBARA_MISSING_NOTE, locale)}</p>
        </section>

        {/* ══ 3 · ÜÇ SÜTUN ═══════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="nob-arts">
          <header className={styles.sectionHead}>
            <h2 id="nob-arts" className={styles.sectionTitle}>
              {pick(NOBARA_SECTIONS.arts.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NOBARA_SECTIONS.arts.lede, locale)}
            </p>
          </header>
          <ul className={styles.arts}>
            {NOBARA_ARTS.map((art) => {
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
                      characterId={NOBARA_ID}
                      slot="ABILITY"
                      abilityName={art.imageKey}
                      label={pick(NOBARA_SLOT_LABELS[art.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · DÖRT AYRINTI ═══════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="nob-details">
          <header className={styles.sectionHead}>
            <h2 id="nob-details" className={styles.sectionTitle}>
              {pick(NOBARA_SECTIONS.tools.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NOBARA_SECTIONS.tools.lede, locale)}
            </p>
          </header>
          <ul className={styles.notes}>
            {NOBARA_DETAILS.map((item) => {
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
                      characterId={NOBARA_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(NOBARA_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · REZONANS TEZGÂHI — SAYFANIN KALBİ ══════════════════════ */}
        <section className={styles.benchSection} aria-labelledby="nob-bench">
          <header className={styles.sectionHead}>
            <h2 id="nob-bench" className={styles.sectionTitle}>
              {pick(NOBARA_SECTIONS.bench.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NOBARA_SECTIONS.bench.lede, locale)}
            </p>
          </header>

          <ResonanceBench
            points={points}
            dollLabel={pick(NOBARA_BENCH_UI.dollLabel, locale)}
            targetLabel={pick(NOBARA_BENCH_UI.targetLabel, locale)}
            dollKanji={NOBARA_BENCH_UI.dollKanji}
            targetKanji={NOBARA_BENCH_UI.targetKanji}
            strikeVerb={pick(NOBARA_BENCH_UI.strikeVerb, locale)}
            pullVerb={pick(NOBARA_BENCH_UI.pullVerb, locale)}
            linkButton={pick(NOBARA_BENCH_UI.linkButton, locale)}
            linkedTag={pick(NOBARA_BENCH_UI.linkedTag, locale)}
            unlinkedTag={pick(NOBARA_BENCH_UI.unlinkedTag, locale)}
            hairpinButton={pick(NOBARA_BENCH_UI.hairpinButton, locale)}
            hairpinNote={pick(NOBARA_BENCH_UI.hairpinNote, locale)}
            resetButton={pick(NOBARA_BENCH_UI.resetButton, locale)}
            nailsLabel={pick(NOBARA_BENCH_UI.nailsLabel, locale)}
            statusIdle={pick(NOBARA_BENCH_UI.statusIdle, locale)}
            statusUnlinked={pick(NOBARA_BENCH_UI.statusUnlinked, locale)}
            statusLinked={pick(NOBARA_BENCH_UI.statusLinked, locale)}
            statusStruck={pick(NOBARA_BENCH_UI.statusStruck, locale)}
            statusPulled={pick(NOBARA_BENCH_UI.statusPulled, locale)}
            statusHairpin={pick(NOBARA_BENCH_UI.statusHairpin, locale)}
            keyboardHint={pick(NOBARA_BENCH_UI.keyboardHint, locale)}
          />

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={NOBARA_ID}
                slot="ABILITY"
                abilityName={NOBARA_IMAGE_KEYS.smallPiece}
                label={pick(
                  NOBARA_SLOT_LABELS[NOBARA_IMAGE_KEYS.smallPiece],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 6 · BEŞ DURAK ══════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="nob-fate">
          <header className={styles.sectionHead}>
            <h2 id="nob-fate" className={styles.sectionTitle}>
              {pick(NOBARA_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NOBARA_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {NOBARA_TIMELINE.map((entry) => {
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
                      characterId={NOBARA_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(NOBARA_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 7 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="nob-closing">
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}
          <header className={styles.sectionHead}>
            <h2 id="nob-closing" className={styles.sectionTitle}>
              {pick(NOBARA_SECTIONS.closing.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NOBARA_SECTIONS.closing.lede, locale)}
            </p>
          </header>

          <ul className={styles.closingQuotes}>
            {NOBARA_CLOSING.quotes.map((quote) => (
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
            {NOBARA_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(NOBARA_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(NOBARA_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(NOBARA_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={NOBARA_ID}
                slot="ABILITY"
                abilityName={NOBARA_IMAGE_KEYS.closing}
                label={pick(
                  NOBARA_SLOT_LABELS[NOBARA_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </AssertShell>
  );
}
