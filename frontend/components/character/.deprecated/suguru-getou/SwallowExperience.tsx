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
  GETO_AFTER_TEXT,
  GETO_ALT,
  GETO_ARTS,
  GETO_CLOSING,
  GETO_CRUMB,
  GETO_CURSES,
  GETO_DETAILS,
  GETO_HERO,
  GETO_ID,
  GETO_IDENTITY,
  GETO_IMAGE_KEYS,
  GETO_MISSING_NOTE,
  GETO_SECTIONS,
  GETO_SITE_URL,
  GETO_SLOT_LABELS,
  GETO_TIMELINE,
  GETO_UZUMAKI_THRESHOLD,
  GETO_VAULT_UI,
} from "./data";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { AfterShell } from "./AfterShell";
import { SwallowVault } from "./SwallowVault";
import styles from "./SwallowExperience.module.css";

/**
 * Suguru Getō — "Yutulan" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/133699 bu bileşene çıkıyor
 * (kendi statik rota klasörü). Sayfanın fikri tek cümle: AL, BİRİKTİR,
 * BİR KERE BOŞALT. Sayfanın kalbi tek yönlü bir hazne — yutulan geri
 * verilmiyor ve haznenin tek çıkışı hepsini birden harcamak.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   AfterShell   — dönem modu (rengi sayfadan çeken tek boolean)
 *   SwallowVault — yutma haznesi (sayfanın kalbi)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * ⚠️ Getō bir kötü karakter ve sayfa onu öyle anlatıyor: sorusunun haklı,
 * cevabının haklı olmadığı yerler açıkça yazılı (veri dosyasının başındaki
 * "anlatım disiplini" notu). Anlatmak onaylamak değil.
 *
 * Görseller: characterId 133699 kaydının ABILITY yuvaları (`get:*`).
 * ⚠️ 25 Ağustos 2026'da bu kayıtta HİÇ görsel yok; haznenin tamamı elle
 * çizilmiş SVG olduğu için sayfanın kalbi görselden bağımsız.
 */
export function SwallowExperience({
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
  const heroScene = src(GETO_IMAGE_KEYS.hero);
  const closingArt = src(GETO_IMAGE_KEYS.closing);

  const name = detail.character.name || GETO_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? GETO_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? GETO_SITE_URL;
  const companionSuffix = pick(GETO_ALT.companionSuffix, locale);
  const beforeTag = pick(GETO_AFTER_TEXT.beforeTag, locale);
  const afterTag = pick(GETO_AFTER_TEXT.afterTag, locale);

  const curses = GETO_CURSES.map((curse) => ({
    key: curse.key,
    kanji: curse.kanji,
    grade: pick(curse.grade, locale),
    weight: curse.weight,
    name: pick(curse.name, locale),
    origin: pick(curse.origin, locale),
  }));

  return (
    <AfterShell
      enterLabel={pick(GETO_AFTER_TEXT.enter, locale)}
      exitLabel={pick(GETO_AFTER_TEXT.exit, locale)}
      hint={pick(GETO_AFTER_TEXT.hint, locale)}
      beforeTag={beforeTag}
      afterTag={afterTag}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <span className={styles.crumbHere}>
            {pick(GETO_CRUMB.series, locale)}
          </span>
        </nav>

        {/* ══ 1 · HERO ═══════════════════════════════════════════════════ */}
        <section className={styles.hero} aria-labelledby="get-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <p className={styles.heroMark} aria-hidden>
            {GETO_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <p className={styles.heroHouse}>
              {pick(GETO_IDENTITY.house, locale)}
            </p>
            <h1 id="get-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {nativeName}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(GETO_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(GETO_HERO.lede, locale)}</p>
          </div>

          <div className={styles.heroAside}>
            <span className={styles.heroPortrait}>
              {portrait ? (
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? GETO_HERO.portraitAlt
                      : GETO_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="(max-width: 760px) 55vw, 340px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              ) : null}
              {/* Portrenin altından yükselen lanet dokusu — dekoratif */}
              <span className={styles.heroSwarm} aria-hidden />
            </span>
            <p className={styles.heroTasteCaption}>
              {pick(GETO_HERO.tasteCaption, locale)}
            </p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={GETO_ID}
                slot="ABILITY"
                abilityName={GETO_IMAGE_KEYS.hero}
                label={pick(GETO_SLOT_LABELS[GETO_IMAGE_KEYS.hero], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="get-identity">
          <header className={styles.sectionHead}>
            <h2 id="get-identity" className={styles.sectionTitle}>
              {pick(GETO_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(GETO_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {GETO_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.factNote}>{pick(GETO_MISSING_NOTE, locale)}</p>
        </section>

        {/* ══ 3 · ÜÇ SÜTUN ═══════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="get-arts">
          <header className={styles.sectionHead}>
            <h2 id="get-arts" className={styles.sectionTitle}>
              {pick(GETO_SECTIONS.arts.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(GETO_SECTIONS.arts.lede, locale)}
            </p>
          </header>
          <ul className={styles.arts}>
            {GETO_ARTS.map((art) => {
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
                      characterId={GETO_ID}
                      slot="ABILITY"
                      abilityName={art.imageKey}
                      label={pick(GETO_SLOT_LABELS[art.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · DÖRT AYRINTI ═══════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="get-details">
          <header className={styles.sectionHead}>
            <h2 id="get-details" className={styles.sectionTitle}>
              {pick(GETO_SECTIONS.tools.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(GETO_SECTIONS.tools.lede, locale)}
            </p>
          </header>
          <ul className={styles.notes}>
            {GETO_DETAILS.map((item) => {
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
                      characterId={GETO_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(GETO_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · YUTMA HAZNESİ — SAYFANIN KALBİ ═════════════════════════ */}
        <section className={styles.vaultSection} aria-labelledby="get-vault">
          <header className={styles.sectionHead}>
            <h2 id="get-vault" className={styles.sectionTitle}>
              {pick(GETO_SECTIONS.vault.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(GETO_SECTIONS.vault.lede, locale)}
            </p>
          </header>

          <SwallowVault
            curses={curses}
            threshold={GETO_UZUMAKI_THRESHOLD}
            offerLabel={pick(GETO_VAULT_UI.offerLabel, locale)}
            vaultLabel={pick(GETO_VAULT_UI.vaultLabel, locale)}
            swallowVerb={pick(GETO_VAULT_UI.swallowVerb, locale)}
            swallowedTag={pick(GETO_VAULT_UI.swallowedTag, locale)}
            gaugeLabel={pick(GETO_VAULT_UI.gaugeLabel, locale)}
            tasteLabel={pick(GETO_VAULT_UI.tasteLabel, locale)}
            taste={pick(GETO_VAULT_UI.taste, locale)}
            uzumakiButton={pick(GETO_VAULT_UI.uzumakiButton, locale)}
            uzumakiLocked={pick(GETO_VAULT_UI.uzumakiLocked, locale)}
            resetButton={pick(GETO_VAULT_UI.resetButton, locale)}
            statusIdle={pick(GETO_VAULT_UI.statusIdle, locale)}
            statusSwallowed={pick(GETO_VAULT_UI.statusSwallowed, locale)}
            statusReady={pick(GETO_VAULT_UI.statusReady, locale)}
            statusSpent={pick(GETO_VAULT_UI.statusSpent, locale)}
            statusEmptyOffer={pick(GETO_VAULT_UI.statusEmptyOffer, locale)}
            keyboardHint={pick(GETO_VAULT_UI.keyboardHint, locale)}
          />

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={GETO_ID}
                slot="ABILITY"
                abilityName={GETO_IMAGE_KEYS.smallBall}
                label={pick(
                  GETO_SLOT_LABELS[GETO_IMAGE_KEYS.smallBall],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 6 · BEŞ DURAK ══════════════════════════════════════════════
            Her durak hangi döneme ait olduğunu YAZIYLA taşıyor; mod
            düğmesi bunu değiştirmiyor, yalnızca sayfanın rengini alıyor. */}
        <section className={styles.section} aria-labelledby="get-fate">
          <header className={styles.sectionHead}>
            <h2 id="get-fate" className={styles.sectionTitle}>
              {pick(GETO_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(GETO_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {GETO_TIMELINE.map((entry) => {
              const scene = src(entry.imageKey);
              const face = entry.kin
                ? (faces.get(entry.kin.characterId) ?? null)
                : null;
              return (
                <li key={entry.key} className={styles.fateItem} data-era={entry.era}>
                  <p className={styles.fateAge}>
                    <span className={styles.fateAgeValue}>
                      {pick(entry.age, locale)}
                    </span>
                    <span className={styles.fateEra}>
                      {entry.era === "after" ? afterTag : beforeTag}
                    </span>
                  </p>
                  <div className={styles.fateBody}>
                    <h3 className={styles.fateTitle}>
                      {pick(entry.title, locale)}
                    </h3>
                    <p className={styles.fateText}>{pick(entry.text, locale)}</p>
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
                      characterId={GETO_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(GETO_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 7 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="get-closing">
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}
          <header className={styles.sectionHead}>
            <h2 id="get-closing" className={styles.sectionTitle}>
              {pick(GETO_SECTIONS.closing.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(GETO_SECTIONS.closing.lede, locale)}
            </p>
          </header>

          <ul className={styles.closingQuotes}>
            {GETO_CLOSING.quotes.map((quote) => (
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
            {GETO_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(GETO_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(GETO_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(GETO_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={GETO_ID}
                slot="ABILITY"
                abilityName={GETO_IMAGE_KEYS.closing}
                label={pick(GETO_SLOT_LABELS[GETO_IMAGE_KEYS.closing], locale)}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </AfterShell>
  );
}
