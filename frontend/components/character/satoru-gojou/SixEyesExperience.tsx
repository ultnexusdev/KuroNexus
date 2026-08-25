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
  GOJO_ALT,
  GOJO_ARTS,
  GOJO_BLINDFOLD_TEXT,
  GOJO_CLOSING,
  GOJO_CRUMB,
  GOJO_DETAILS,
  GOJO_HERO,
  GOJO_ID,
  GOJO_IDENTITY,
  GOJO_IMAGE_KEYS,
  GOJO_MERGE,
  GOJO_MISSING_NOTE,
  GOJO_POLE_UI,
  GOJO_POLES,
  GOJO_SECTIONS,
  GOJO_SITE_URL,
  GOJO_SLOT_LABELS,
  GOJO_TIMELINE,
} from "@/lib/characters/satoru-gojou-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { BlindfoldShell } from "./BlindfoldShell";
import { PoleCombiner } from "./PoleCombiner";
import { ApproachDiagram } from "./LimitGlyphs";
import styles from "./SixEyesExperience.module.css";

/**
 * Satoru Gojō — "İki Uç" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/127691 bu bileşene çıkıyor
 * (kendi statik rota klasörü). Sayfanın fikri tek cümle: GÜÇ BİR VURUŞ
 * DEĞİL BİR MESAFE. Mugegen aradaki uzaklığı sonsuza bölüyor, Rikugan o
 * uzaklığı ölçüyor. Sayfa da bu ikisini yapıyor: her bölüm bir ÖLÇÜ satırı
 * taşıyor (mod kapalıyken gizli) ve sayfanın kalbi iki ucun buluşması.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   BlindfoldShell — gözbağı modu (tek boolean, etkinin tamamı CSS)
 *   PoleCombiner   — iki yuvalı uç birleştiricisi (sayfanın kalbi)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 127691 kaydının ABILITY yuvaları (`goj:*`).
 * ⚠️ 25 Ağustos 2026'da bu kayıtta HİÇ görsel yok — sayfa öyle tasarlandı,
 * her bölüm görselsiz de tam çalışıyor.
 */
export function SixEyesExperience({
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
  const heroScene = src(GOJO_IMAGE_KEYS.hero);
  const closingArt = src(GOJO_IMAGE_KEYS.closing);

  const name = detail.character.name || GOJO_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? GOJO_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? GOJO_SITE_URL;
  const companionSuffix = pick(GOJO_ALT.companionSuffix, locale);
  const readoutLabel = pick(GOJO_BLINDFOLD_TEXT.readoutLabel, locale);

  const poles = GOJO_POLES.map((pole) => ({
    key: pole.key,
    kanji: pole.kanji,
    name: pole.name,
    reading: pole.reading,
    turkish: pick(pole.turkish, locale),
    sign: pick(pole.sign, locale),
    text: pick(pole.text, locale),
    image: src(pole.imageKey),
  }));

  return (
    <BlindfoldShell
      enterLabel={pick(GOJO_BLINDFOLD_TEXT.enter, locale)}
      exitLabel={pick(GOJO_BLINDFOLD_TEXT.exit, locale)}
      hint={pick(GOJO_BLINDFOLD_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <span className={styles.crumbHere}>
            {pick(GOJO_CRUMB.series, locale)}
          </span>
        </nav>

        {/* ══ 1 · HERO ═══════════════════════════════════════════════════
            Kadrajın çoğu BOŞLUK: sayfanın konusu zaten aradaki mesafe.
            Portre sağda küçük duruyor, soldaki yaklaşma diyagramı ona
            doğru geliyor ve hiç değmiyor. */}
        <section className={styles.hero} aria-labelledby="goj-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <p className={styles.heroMark} aria-hidden>
            {GOJO_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <p className={styles.heroHouse}>
              {pick(GOJO_IDENTITY.house, locale)}
            </p>
            <h1 id="goj-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {nativeName}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(GOJO_IDENTITY.epigraph, locale)}
            </p>

            {/* Yaklaşma diyagramı: her çizgi bir öncekinin yarısı kadar
                yol alıyor ve sağdaki sınıra hiç varmıyor. */}
            <span className={styles.heroApproach} aria-hidden>
              <ApproachDiagram
                className={styles.heroApproachArt}
                stepClassName={styles.heroApproachStep}
                limitClassName={styles.heroApproachLimit}
              />
            </span>

            <p className={styles.heroLede}>{pick(GOJO_HERO.lede, locale)}</p>
          </div>

          <div className={styles.heroAside}>
            <span className={styles.heroPortrait}>
              {portrait ? (
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? GOJO_HERO.portraitAlt
                      : GOJO_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="(max-width: 760px) 55vw, 360px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              ) : null}
              <span className={styles.heroBand} aria-hidden />
            </span>
            <p className={styles.heroBandCaption}>
              {pick(GOJO_HERO.bandCaption, locale)}
            </p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={GOJO_ID}
                slot="ABILITY"
                abilityName={GOJO_IMAGE_KEYS.hero}
                label={pick(GOJO_SLOT_LABELS[GOJO_IMAGE_KEYS.hero], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="goj-identity">
          <header className={styles.sectionHead}>
            <h2 id="goj-identity" className={styles.sectionTitle}>
              {pick(GOJO_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(GOJO_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {GOJO_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.factNote}>{pick(GOJO_MISSING_NOTE, locale)}</p>
        </section>

        {/* ══ 3 · ÜÇ SÜTUN ═══════════════════════════════════════════════
            Her kartın altında bir OKUMA satırı var; gözbağı takılıyken
            CSS onu erişilebilirlik ağacından da çıkarıyor. */}
        <section className={styles.section} aria-labelledby="goj-arts">
          <header className={styles.sectionHead}>
            <h2 id="goj-arts" className={styles.sectionTitle}>
              {pick(GOJO_SECTIONS.arts.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(GOJO_SECTIONS.arts.lede, locale)}
            </p>
          </header>
          <ul className={styles.arts}>
            {GOJO_ARTS.map((art) => {
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
                    <span className={styles.readout}>
                      <span className={styles.readoutInner}>
                        <span className={styles.readoutLabel}>
                          {readoutLabel}
                        </span>
                        <span className={styles.readoutValue}>
                          {pick(art.readout, locale)}
                        </span>
                      </span>
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={GOJO_ID}
                      slot="ABILITY"
                      abilityName={art.imageKey}
                      label={pick(GOJO_SLOT_LABELS[art.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · DÖRT AYRINTI ═══════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="goj-details">
          <header className={styles.sectionHead}>
            <h2 id="goj-details" className={styles.sectionTitle}>
              {pick(GOJO_SECTIONS.tools.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(GOJO_SECTIONS.tools.lede, locale)}
            </p>
          </header>
          <ul className={styles.notes}>
            {GOJO_DETAILS.map((item) => {
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
                  <span className={styles.readout}>
                    <span className={styles.readoutInner}>
                      <span className={styles.readoutLabel}>{readoutLabel}</span>
                      <span className={styles.readoutValue}>
                        {pick(item.readout, locale)}
                      </span>
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={GOJO_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(GOJO_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · İKİ UÇ — SAYFANIN KALBİ ════════════════════════════════ */}
        <section className={styles.poleSection} aria-labelledby="goj-poles">
          <header className={styles.sectionHead}>
            <h2 id="goj-poles" className={styles.sectionTitle}>
              {pick(GOJO_SECTIONS.poles.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(GOJO_SECTIONS.poles.lede, locale)}
            </p>
          </header>

          <PoleCombiner
            poles={poles}
            merge={{
              kanji: GOJO_MERGE.kanji,
              name: GOJO_MERGE.name,
              reading: GOJO_MERGE.reading,
              turkish: pick(GOJO_MERGE.turkish, locale),
              text: pick(GOJO_MERGE.text, locale),
              image: src(GOJO_MERGE.imageKey),
            }}
            slotsLabel={pick(GOJO_POLE_UI.slotsLabel, locale)}
            slotALabel={pick(GOJO_POLE_UI.slotA, locale)}
            slotBLabel={pick(GOJO_POLE_UI.slotB, locale)}
            emptyLabel={pick(GOJO_POLE_UI.empty, locale)}
            pickLabel={pick(GOJO_POLE_UI.pickLabel, locale)}
            clearLabel={pick(GOJO_POLE_UI.clear, locale)}
            collideLabel={pick(GOJO_POLE_UI.collide, locale)}
            againLabel={pick(GOJO_POLE_UI.again, locale)}
            fieldLabel={pick(GOJO_POLE_UI.fieldLabel, locale)}
            keyboardHint={pick(GOJO_POLE_UI.keyboardHint, locale)}
            resultLabel={pick(GOJO_POLE_UI.resultLabel, locale)}
            statusIdle={pick(GOJO_POLE_UI.statusIdle, locale)}
            statusHalf={pick(GOJO_POLE_UI.statusHalf, locale)}
            statusSame={pick(GOJO_POLE_UI.statusSame, locale)}
            statusReady={pick(GOJO_POLE_UI.statusReady, locale)}
            statusDone={pick(GOJO_POLE_UI.statusDone, locale)}
          />

          {isAdmin ? (
            <div className={styles.slotRow}>
              {[...GOJO_POLES.map((pole) => pole.imageKey), GOJO_MERGE.imageKey].map(
                (key) => (
                  <CuratorSlot
                    key={key}
                    characterId={GOJO_ID}
                    slot="ABILITY"
                    abilityName={key}
                    label={pick(GOJO_SLOT_LABELS[key], locale)}
                  />
                ),
              )}
            </div>
          ) : null}
        </section>

        {/* ══ 6 · BEŞ DURAK ══════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="goj-fate">
          <header className={styles.sectionHead}>
            <h2 id="goj-fate" className={styles.sectionTitle}>
              {pick(GOJO_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(GOJO_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {GOJO_TIMELINE.map((entry) => {
              const scene = src(entry.imageKey);
              const face = entry.kin ? (faces.get(entry.kin.characterId) ?? null) : null;
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
                        <blockquote>{pick(entry.quote.text, locale)}</blockquote>
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
                      characterId={GOJO_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(GOJO_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 7 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="goj-closing">
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}
          <header className={styles.sectionHead}>
            <h2 id="goj-closing" className={styles.sectionTitle}>
              {pick(GOJO_SECTIONS.closing.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(GOJO_SECTIONS.closing.lede, locale)}
            </p>
          </header>

          <ul className={styles.closingQuotes}>
            {GOJO_CLOSING.quotes.map((quote) => (
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
            {GOJO_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(GOJO_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(GOJO_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(GOJO_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={GOJO_ID}
                slot="ABILITY"
                abilityName={GOJO_IMAGE_KEYS.closing}
                label={pick(GOJO_SLOT_LABELS[GOJO_IMAGE_KEYS.closing], locale)}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </BlindfoldShell>
  );
}
