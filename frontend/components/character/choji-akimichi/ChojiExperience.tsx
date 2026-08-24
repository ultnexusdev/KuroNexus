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
  CHOJI_ALT,
  CHOJI_BUTTERFLY_TEXT,
  CHOJI_CLOSING,
  CHOJI_CRUMB,
  CHOJI_HAND,
  CHOJI_HERO,
  CHOJI_ID,
  CHOJI_IDENTITY,
  CHOJI_IMAGE_KEYS,
  CHOJI_PILLS,
  CHOJI_SCALE_UI,
  CHOJI_SECTIONS,
  CHOJI_SITE_URL,
  CHOJI_SLOT_LABELS,
  CHOJI_TABLE,
  CHOJI_TECHNIQUES,
  CHOJI_TIMELINE,
  CHOJI_WEIGHT,
} from "@/lib/characters/choji-akimichi-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { ButterflyShell } from "./ButterflyShell";
import { PillBalance } from "./PillBalance";
import {
  AkimichiSpiral,
  ButterflyWings,
  HandMark,
  MassRing,
  MeasureRule,
} from "./ChojiGlyphs";
import styles from "./ChojiExperience.module.css";

/**
 * Chōji Akimichi — "Üç Renkli Hap" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/2008 bu bileşene dallanır (rota
 * dosyasındaki `EXPERIENCES` haritası). Sayfanın fikri tek cümle: KAZANÇ VE
 * BEDEL AYNI ANDA DEĞİŞİR. Akimichi hidenı kaloriyi çakraya çeviriyor; üç
 * renkli hap o çevrimi üçe, ona ve yüze katlıyor — ve her kademede ödenen
 * şey kazanılandan daha hızlı büyüyor. Sayfanın kalbi bu yüzden bir sekme
 * dizisi değil, bir TERAZİ.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   ButterflyShell — "Kelebek Modu" (tek boolean, etkinin tamamı CSS'te)
 *   PillBalance    — hap terazisi (radio grubu + klavye + terazi şeması)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 2008 kaydının ABILITY yuvaları (`choji:*`).
 * Hiçbiri zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır.
 */
export function ChojiExperience({
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
  const heroScene = src(CHOJI_IMAGE_KEYS.hero);
  const weightArt = src(CHOJI_WEIGHT.imageKey);
  const closingArt = src(CHOJI_IMAGE_KEYS.closing);

  const name = detail.character.name || CHOJI_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? CHOJI_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? CHOJI_SITE_URL;

  const pills = CHOJI_PILLS.map((pill) => ({
    key: pill.key,
    mark: pill.mark,
    name: pill.name,
    title: pick(pill.title, locale),
    multiplier: pill.multiplier,
    gain: pick(pill.gain, locale),
    cost: pick(pill.cost, locale),
    danger: "danger" in pill ? pick(pill.danger, locale) : null,
    image: src(pill.imageKey),
  }));

  return (
    <ButterflyShell
      enterLabel={pick(CHOJI_BUTTERFLY_TEXT.enter, locale)}
      exitLabel={pick(CHOJI_BUTTERFLY_TEXT.exit, locale)}
      hint={pick(CHOJI_BUTTERFLY_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(CHOJI_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO ═══════════════════════════════════════════════════
            Arkada klanın spirali, portrenin ardında soluk duran kelebek
            kanatları, sağ kenarda 秋道 filigranı. Kanatlar Kelebek
            Modu'nda canlanıyor. */}
        <section className={styles.hero} aria-labelledby="cho-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <AkimichiSpiral
            className={styles.heroSpiral}
            pathClassName={styles.heroSpiralPath}
          />

          <p className={styles.heroMark} aria-hidden>
            {CHOJI_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <h1 id="cho-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative}>
              <span aria-hidden>{nativeName}</span>
              <span className={styles.heroClan}>
                {pick(CHOJI_IDENTITY.clan, locale)}
              </span>
            </p>
            <p className={styles.heroEpigraph}>
              {pick(CHOJI_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(CHOJI_HERO.lede, locale)}</p>
          </div>

          <div className={styles.heroAside}>
            <span className={styles.heroWings} aria-hidden>
              <ButterflyWings
                className={styles.heroWingsArt}
                veinClassName={styles.heroWingsVein}
              />
            </span>
            {portrait ? (
              <span className={styles.heroPortrait}>
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? CHOJI_HERO.portraitAlt
                      : CHOJI_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="440px"
                  priority
                  unoptimized={!portraitUploaded}
                />
                {/* Göğsündeki tek kelime: 食 */}
                <span className={styles.heroShoku} aria-hidden>
                  食
                </span>
              </span>
            ) : null}
            <p className={styles.heroCaption}>
              {pick(CHOJI_HERO.wingCaption, locale)}
            </p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={CHOJI_ID}
                slot="ABILITY"
                abilityName={CHOJI_IMAGE_KEYS.hero}
                label={pick(
                  CHOJI_SLOT_LABELS[CHOJI_IMAGE_KEYS.hero],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE — hap kutusunun etiketi ══════════════════════════ */}
        <section className={styles.section} aria-labelledby="cho-identity">
          <header className={styles.sectionHead}>
            <h2 id="cho-identity" className={styles.sectionTitle}>
              {pick(CHOJI_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(CHOJI_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.label}>
            {CHOJI_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.labelRow}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · AĞIRLIK MESELESİ ═══════════════════════════════════════
            Sayfanın ikinci yapısal fikri: klişenin üstüne şaka yapmayan,
            tersini söyleyen kısa bir bölüm. Yanında künyedeki tek ölçüyü
            gösteren bir cetvel var. */}
        <section className={styles.weight} aria-labelledby="cho-weight">
          <header className={styles.sectionHead}>
            <h2 id="cho-weight" className={styles.sectionTitle}>
              {pick(CHOJI_SECTIONS.weight.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(CHOJI_SECTIONS.weight.lede, locale)}
            </p>
          </header>

          <div className={styles.weightGrid}>
            <div className={styles.weightBody}>
              {CHOJI_WEIGHT.paragraphs.map((paragraph) => (
                <p key={paragraph.tr} className={styles.weightText}>
                  {pick(paragraph, locale)}
                </p>
              ))}
              <figure className={styles.weightQuote}>
                <blockquote>
                  &ldquo;{pick(CHOJI_WEIGHT.quote.text, locale)}&rdquo;
                </blockquote>
                <figcaption>{pick(CHOJI_WEIGHT.quote.by, locale)}</figcaption>
              </figure>
            </div>

            <aside className={styles.rule}>
              <p className={styles.ruleTitle}>
                {pick(CHOJI_WEIGHT.measureLabel, locale)}
              </p>
              <div className={styles.ruleStack}>
                <MeasureRule
                  className={styles.ruleArt}
                  markClassName={styles.ruleMark}
                />
                <ol className={styles.ruleList}>
                  {CHOJI_WEIGHT.marks.map((mark) => (
                    <li key={mark.key} className={styles.ruleItem}>
                      <span className={styles.ruleValue}>
                        {pick(mark.value, locale)}
                      </span>
                      <span className={styles.ruleLabel}>
                        {pick(mark.label, locale)}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <p className={styles.ruleDelta}>
                <span className={styles.ruleDeltaLabel}>
                  {pick(CHOJI_WEIGHT.delta.label, locale)}
                </span>
                <span className={styles.ruleDeltaValue}>
                  {pick(CHOJI_WEIGHT.delta.value, locale)}
                </span>
              </p>
              <p className={styles.ruleNote}>
                {pick(CHOJI_WEIGHT.delta.note, locale)}
              </p>
              {weightArt ? (
                <span className={styles.weightArt} aria-hidden>
                  <Image src={weightArt} alt="" fill sizes="480px" />
                </span>
              ) : null}
              {isAdmin ? (
                <CuratorSlot
                  characterId={CHOJI_ID}
                  slot="ABILITY"
                  abilityName={CHOJI_WEIGHT.imageKey}
                  label={pick(CHOJI_SLOT_LABELS[CHOJI_WEIGHT.imageKey], locale)}
                />
              ) : null}
            </aside>
          </div>
        </section>

        {/* ══ 4 · CEPHANELİK — üç büyük ══════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="cho-arsenal">
          <header className={styles.sectionHead}>
            <h2 id="cho-arsenal" className={styles.sectionTitle}>
              {pick(CHOJI_SECTIONS.arsenal.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(CHOJI_SECTIONS.arsenal.lede, locale)}
            </p>
          </header>
          <ul className={styles.forms}>
            {CHOJI_TECHNIQUES.map((technique, position) => {
              const art = src(technique.imageKey);
              return (
                <li key={technique.key} className={styles.form}>
                  <div className={styles.formSigil}>
                    <MassRing
                      level={position}
                      className={styles.formRing}
                      coreClassName={styles.formCore}
                    />
                    <span className={styles.formKanji} aria-hidden>
                      {technique.kanji}
                    </span>
                  </div>
                  <div className={styles.formBody}>
                    <p className={styles.formName}>{technique.name}</p>
                    <p className={styles.formTurkish}>
                      {pick(technique.turkish, locale)}
                    </p>
                    <p className={styles.formTagline}>
                      {pick(technique.tagline, locale)}
                    </p>
                    <p className={styles.formText}>
                      {pick(technique.text, locale)}
                    </p>
                    <p className={styles.formTraits}>
                      {technique.traits.map((trait) => (
                        <span key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </p>
                  </div>
                  <span className={styles.formArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="640px" /> : null}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={CHOJI_ID}
                      slot="ABILITY"
                      abilityName={technique.imageKey}
                      label={pick(
                        CHOJI_SLOT_LABELS[technique.imageKey],
                        locale,
                      )}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · EL ALTINDAKİLER — dört küçük ═══════════════════════════ */}
        <section className={styles.section} aria-labelledby="cho-hand">
          <header className={styles.sectionHead}>
            <h2 id="cho-hand" className={styles.sectionTitle}>
              {pick(CHOJI_SECTIONS.hand.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(CHOJI_SECTIONS.hand.lede, locale)}
            </p>
          </header>
          <ul className={styles.hand}>
            {CHOJI_HAND.map((item) => {
              const art = src(item.imageKey);
              return (
                <li key={item.key} className={styles.handItem}>
                  <span className={styles.handArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="420px" /> : null}
                  </span>
                  <HandMark name={item.glyph} className={styles.handGlyph} />
                  <p className={styles.handKanji} aria-hidden>
                    {item.kanji}
                  </p>
                  <p className={styles.handName}>{pick(item.name, locale)}</p>
                  <p className={styles.handNote}>{pick(item.note, locale)}</p>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={CHOJI_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(CHOJI_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 6 · SOFRADAKİLER ═══════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="cho-table">
          <header className={styles.sectionHead}>
            <h2 id="cho-table" className={styles.sectionTitle}>
              {pick(CHOJI_SECTIONS.table.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(CHOJI_SECTIONS.table.lede, locale)}
            </p>
          </header>
          <ul className={styles.seats}>
            {CHOJI_TABLE.map((seat) => {
              const face = faces.get(seat.characterId) ?? null;
              return (
                <li key={seat.characterId} className={styles.seat}>
                  <span className={styles.seatArt}>
                    {face ? (
                      <Image
                        src={face}
                        alt={`${seat.name} ${pick(CHOJI_ALT.companionSuffix, locale)}`}
                        fill
                        sizes="260px"
                      />
                    ) : null}
                    {seat.mark ? (
                      <span className={styles.seatMark} aria-hidden>
                        {seat.mark}
                      </span>
                    ) : null}
                  </span>
                  <p className={styles.seatRole}>{pick(seat.role, locale)}</p>
                  <p className={styles.seatName}>{seat.name}</p>
                  <p className={styles.seatNote}>{pick(seat.note, locale)}</p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 7 · HAP TERAZİSİ — SAYFANIN KALBİ ══════════════════════════ */}
        <section className={styles.scaleSection} aria-labelledby="cho-scale">
          <header className={styles.sectionHead}>
            <h2 id="cho-scale" className={styles.sectionTitle}>
              {pick(CHOJI_SECTIONS.scale.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(CHOJI_SECTIONS.scale.lede, locale)}
            </p>
          </header>
          <PillBalance
            pills={pills}
            listLabel={pick(CHOJI_SCALE_UI.listLabel, locale)}
            doseWord={pick(CHOJI_SCALE_UI.doseWord, locale)}
            gainLabel={pick(CHOJI_SCALE_UI.gainLabel, locale)}
            costLabel={pick(CHOJI_SCALE_UI.costLabel, locale)}
            chakraLabel={pick(CHOJI_SCALE_UI.chakraLabel, locale)}
            dangerLabel={pick(CHOJI_SCALE_UI.dangerLabel, locale)}
            keyboardHint={pick(CHOJI_SCALE_UI.keyboardHint, locale)}
            balanceAlt={pick(CHOJI_SCALE_UI.balanceAlt, locale)}
            wingNote={pick(CHOJI_SCALE_UI.wingNote, locale)}
            coda={pick(CHOJI_SCALE_UI.coda, locale)}
          />
          {isAdmin ? (
            <div className={styles.slotRow}>
              {CHOJI_PILLS.map((pill) => (
                <CuratorSlot
                  key={pill.imageKey}
                  characterId={CHOJI_ID}
                  slot="ABILITY"
                  abilityName={pill.imageKey}
                  label={pick(CHOJI_SLOT_LABELS[pill.imageKey], locale)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 8 · KADER ÇİZELGESİ ════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="cho-fate">
          <header className={styles.sectionHead}>
            <h2 id="cho-fate" className={styles.sectionTitle}>
              {pick(CHOJI_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(CHOJI_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {CHOJI_TIMELINE.map((entry, position) => {
              const art = src(entry.imageKey);
              return (
                <li
                  key={entry.key}
                  className={styles.fateItem}
                  data-step={position}
                >
                  <p className={styles.fateAge}>
                    <span className={styles.fateDot} aria-hidden />
                    {pick(entry.age, locale)}
                  </p>
                  <div className={styles.fateBody}>
                    <h3 className={styles.fateTitle}>
                      {pick(entry.title, locale)}
                    </h3>
                    <p className={styles.fateText}>{pick(entry.text, locale)}</p>
                    {entry.quote ? (
                      <figure className={styles.fateQuote}>
                        <blockquote>
                          &ldquo;{pick(entry.quote.text, locale)}&rdquo;
                        </blockquote>
                        <figcaption>{pick(entry.quote.by, locale)}</figcaption>
                      </figure>
                    ) : null}
                    <span className={styles.fateArt} aria-hidden>
                      {art ? (
                        <Image src={art} alt="" fill sizes="560px" />
                      ) : null}
                    </span>
                    {isAdmin ? (
                      <CuratorSlot
                        characterId={CHOJI_ID}
                        slot="ABILITY"
                        abilityName={entry.imageKey}
                        label={pick(CHOJI_SLOT_LABELS[entry.imageKey], locale)}
                      />
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 9 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="cho-closing">
          <h2 id="cho-closing" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}
          <AkimichiSpiral
            className={styles.closingSpiral}
            pathClassName={styles.closingSpiralPath}
          />

          {CHOJI_CLOSING.quotes.map((quote) => (
            <figure key={quote.text.tr} className={styles.closingQuote}>
              <blockquote>&ldquo;{pick(quote.text, locale)}&rdquo;</blockquote>
              <figcaption>
                <span className={styles.quoteBy}>{pick(quote.by, locale)}</span>
                <span className={styles.quoteNote}>
                  {pick(quote.note, locale)}
                </span>
              </figcaption>
            </figure>
          ))}

          <p className={styles.motto} aria-hidden>
            {CHOJI_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(CHOJI_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(CHOJI_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(CHOJI_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={CHOJI_ID}
                slot="ABILITY"
                abilityName={CHOJI_IMAGE_KEYS.closing}
                label={pick(
                  CHOJI_SLOT_LABELS[CHOJI_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </ButterflyShell>
  );
}
