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
  KABUTO_ALT,
  KABUTO_CARDS,
  KABUTO_CLOSING,
  KABUTO_CRUMB,
  KABUTO_DECK_UI,
  KABUTO_FACTS,
  KABUTO_ID,
  KABUTO_IDENTITY,
  KABUTO_IMAGE_KEYS,
  KABUTO_INFO_CARDS,
  KABUTO_INFO_UI,
  KABUTO_JUTSU,
  KABUTO_SAGE_TEXT,
  KABUTO_SECTIONS,
  KABUTO_SITE_URL,
  KABUTO_SLOT_LABELS,
  KABUTO_TIMELINE,
  KABUTO_TOOLS,
} from "@/lib/characters/kabuto-yakushi-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { SageShell } from "./SageShell";
import { IdentityDeck, type DeckCardView } from "./IdentityDeck";
import { CardMark, ScaleField, Spectacles, StitchMark } from "./KabutoGlyphs";
import styles from "./KabutoExperience.module.css";

/**
 * Kabuto Yakushi — "Kim Olduğumu Biliyorum" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/2405 bu bileşene dallanır.
 * Sayfanın fikri tek cümle: KİMLİK BİR DESTEDİR. Düzen bir dosya kâğıdı gibi
 * kurulu — solda dar bir kenar boşluğu ve boydan boya bir cetvel çizgisi,
 * sağda içerik. Bölümlerin kenarına düşülen not süs değil, sayım.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   SageShell    — "Sennin modu — yılan" (tek boolean, etkinin tamamı CSS'te)
 *   IdentityDeck — kimlik destesi (kart çekme + yığın + klavye)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 2405 kaydının ABILITY yuvaları (`kabuto:*`). Hiçbiri
 * zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır. Bu karakterin
 * arşivde yüklenmiş tam boy portresi YOK; kapak AniList'in ~230 piksellik
 * künye portresi, bu yüzden portre büyütülmüyor, künye fotoğrafı ölçüsünde
 * bir kimlik kartı çerçevesinde duruyor (BRIEF §4.1).
 */
export function KabutoExperience({
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
  const heroScene = src(KABUTO_IMAGE_KEYS.hero);
  const closingArt = src(KABUTO_IMAGE_KEYS.closing);

  const name = detail.character.name || KABUTO_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? KABUTO_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? KABUTO_SITE_URL;
  const faceSuffix = pick(KABUTO_ALT.faceSuffix, locale);

  const deckCards: DeckCardView[] = KABUTO_CARDS.map((card) => ({
    key: card.key,
    mark: card.mark,
    era: pick(card.era, locale),
    title: pick(card.title, locale),
    text: pick(card.text, locale),
    use: pick(card.use, locale),
    residue: pick(card.residue, locale),
    blank: card.blank ?? false,
    question: card.question ? pick(card.question, locale) : null,
    face: card.faceId ? (faces.get(card.faceId) ?? null) : null,
    faceAlt: card.faceName ? `${card.faceName} ${faceSuffix}` : "",
    faceName: card.faceName ?? null,
    image: card.imageKey ? src(card.imageKey) : null,
  }));

  return (
    <SageShell
      enterLabel={pick(KABUTO_SAGE_TEXT.enter, locale)}
      exitLabel={pick(KABUTO_SAGE_TEXT.exit, locale)}
      hint={pick(KABUTO_SAGE_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(KABUTO_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO — CAMIN ARDINDAKİ GÖZ ══════════════════════════════
            Portre küçük ve bir künye fotoğrafı gibi çerçeveli; üstünde elle
            çizilmiş gözlük duruyor ve camdaki yansıma gözü kapatıyor.
            Sennin modunda yansıma sönüyor, pullar iniyor, göz açılıyor. */}
        <section className={styles.hero} aria-labelledby="kab-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <p className={styles.watermark} aria-hidden>
            {KABUTO_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <h1 id="kab-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {nativeName}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(KABUTO_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>
              {pick(KABUTO_IDENTITY.lede, locale)}
            </p>
          </div>

          <div className={styles.heroAside}>
            <div className={styles.portraitFrame}>
              {portrait ? (
                <span className={styles.portrait}>
                  <Image
                    src={portrait}
                    alt={pick(
                      portraitUploaded
                        ? KABUTO_IDENTITY.portraitAltUploaded
                        : KABUTO_IDENTITY.portraitAlt,
                      locale,
                    )}
                    fill
                    sizes="240px"
                    priority
                    unoptimized={!portraitUploaded}
                  />
                </span>
              ) : null}
              <ScaleField
                className={styles.portraitScales}
                rows={13}
                cols={6}
              />
              <Spectacles
                className={styles.spectacles}
                frameClassName={styles.specFrame}
                lensClassName={styles.specLens}
                glareClassName={styles.specGlare}
                eyeClassName={styles.specEye}
              />
            </div>
            <p className={styles.portraitCaption}>
              {pick(KABUTO_IDENTITY.portraitCaption, locale)}
            </p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={KABUTO_ID}
                slot="ABILITY"
                abilityName={KABUTO_IMAGE_KEYS.hero}
                label={pick(
                  KABUTO_SLOT_LABELS[KABUTO_IMAGE_KEYS.hero],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · DOSYA — KÜNYE ═══════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="kab-file">
          <header className={styles.head}>
            <p className={styles.marginNote}>
              {pick(KABUTO_SECTIONS.identity.margin, locale)}
            </p>
            <div className={styles.headBody}>
              <h2 id="kab-file" className={styles.title}>
                {pick(KABUTO_SECTIONS.identity.title, locale)}
              </h2>
              <p className={styles.lede}>
                {pick(KABUTO_SECTIONS.identity.lede, locale)}
              </p>
            </div>
          </header>

          <div className={styles.body}>
            <dl className={styles.facts}>
              {KABUTO_FACTS.map((fact) => (
                <div key={fact.label.tr} className={styles.fact}>
                  <dt className={styles.factLabel}>{pick(fact.label, locale)}</dt>
                  <dd className={styles.factValue}>
                    <span
                      className={styles.factText}
                      data-struck={fact.struck || undefined}
                    >
                      {pick(fact.value, locale)}
                    </span>
                    {fact.note ? (
                      <span className={styles.factNote}>
                        {pick(fact.note, locale)}
                      </span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ══ 3 · LABORATUVAR — ÜÇ BÜYÜK ══════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="kab-lab">
          <header className={styles.head}>
            <p className={styles.marginNote}>
              {pick(KABUTO_SECTIONS.lab.margin, locale)}
            </p>
            <div className={styles.headBody}>
              <h2 id="kab-lab" className={styles.title}>
                {pick(KABUTO_SECTIONS.lab.title, locale)}
              </h2>
              <p className={styles.lede}>
                {pick(KABUTO_SECTIONS.lab.lede, locale)}
              </p>
            </div>
          </header>

          <div className={styles.body}>
            <ul className={styles.jutsuList}>
              {KABUTO_JUTSU.map((jutsu) => {
                const art = src(jutsu.imageKey);
                return (
                  <li key={jutsu.key} className={styles.jutsu}>
                    <div className={styles.jutsuSign} aria-hidden>
                      <CardMark
                        mark={jutsu.mark}
                        className={styles.jutsuGlyph}
                      />
                      <span className={styles.jutsuKanji}>{jutsu.kanji}</span>
                    </div>

                    <div className={styles.jutsuBody}>
                      <h3 className={styles.jutsuName}>{jutsu.name}</h3>
                      <p className={styles.jutsuTurkish}>
                        {pick(jutsu.turkish, locale)}
                      </p>
                      <p className={styles.jutsuTagline}>
                        {pick(jutsu.tagline, locale)}
                      </p>
                      <p className={styles.jutsuText}>
                        {pick(jutsu.text, locale)}
                      </p>
                      <ul className={styles.traits}>
                        {jutsu.traits.map((trait) => (
                          <li key={trait.tr} className={styles.trait}>
                            {pick(trait, locale)}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {art ? (
                      <span className={styles.jutsuArt} aria-hidden>
                        <Image src={art} alt="" fill sizes="640px" />
                      </span>
                    ) : null}

                    {isAdmin ? (
                      <CuratorSlot
                        characterId={KABUTO_ID}
                        slot="ABILITY"
                        abilityName={jutsu.imageKey}
                        label={pick(KABUTO_SLOT_LABELS[jutsu.imageKey], locale)}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ══ 4 · KÜÇÜK ALETLER — DÖRT ════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="kab-tools">
          <header className={styles.head}>
            <p className={styles.marginNote}>
              {pick(KABUTO_SECTIONS.tools.margin, locale)}
            </p>
            <div className={styles.headBody}>
              <h2 id="kab-tools" className={styles.title}>
                {pick(KABUTO_SECTIONS.tools.title, locale)}
              </h2>
              <p className={styles.lede}>
                {pick(KABUTO_SECTIONS.tools.lede, locale)}
              </p>
            </div>
          </header>

          <div className={styles.body}>
            <ul className={styles.tools}>
              {KABUTO_TOOLS.map((tool) => {
                const art = src(tool.imageKey);
                return (
                  <li key={tool.key} className={styles.tool}>
                    {art ? (
                      <span className={styles.toolArt} aria-hidden>
                        <Image src={art} alt="" fill sizes="360px" />
                      </span>
                    ) : null}
                    <CardMark mark={tool.mark} className={styles.toolGlyph} />
                    <h3 className={styles.toolName}>{pick(tool.name, locale)}</h3>
                    <p className={styles.toolNote}>{pick(tool.note, locale)}</p>
                    {isAdmin ? (
                      <CuratorSlot
                        characterId={KABUTO_ID}
                        slot="ABILITY"
                        abilityName={tool.imageKey}
                        label={pick(KABUTO_SLOT_LABELS[tool.imageKey], locale)}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ══ 5 · KİMLİK DESTESİ — SAYFANIN KALBİ ═════════════════════════ */}
        <section className={styles.deckSection} aria-labelledby="kab-deck">
          <header className={styles.head}>
            <p className={styles.marginNote}>
              {pick(KABUTO_SECTIONS.deck.margin, locale)}
            </p>
            <div className={styles.headBody}>
              <h2 id="kab-deck" className={styles.title}>
                {pick(KABUTO_SECTIONS.deck.title, locale)}
              </h2>
              <p className={styles.lede}>
                {pick(KABUTO_SECTIONS.deck.lede, locale)}
              </p>
            </div>
          </header>

          <div className={styles.body}>
            <IdentityDeck
              cards={deckCards}
              drawLabel={pick(KABUTO_DECK_UI.drawLabel, locale)}
              resetLabel={pick(KABUTO_DECK_UI.resetLabel, locale)}
              drawnListLabel={pick(KABUTO_DECK_UI.drawnListLabel, locale)}
              remainingLabel={pick(KABUTO_DECK_UI.remainingLabel, locale)}
              emptyDeckLabel={pick(KABUTO_DECK_UI.emptyDeckLabel, locale)}
              deckAlt={pick(KABUTO_DECK_UI.deckAlt, locale)}
              useLabel={pick(KABUTO_DECK_UI.useLabel, locale)}
              residueLabel={pick(KABUTO_DECK_UI.residueLabel, locale)}
              cardWord={pick(KABUTO_DECK_UI.cardWord, locale)}
              hint={pick(KABUTO_DECK_UI.hint, locale)}
            />

            {isAdmin ? (
              <div className={styles.slotRow}>
                {KABUTO_CARDS.map((card) =>
                  card.imageKey ? (
                    <CuratorSlot
                      key={card.imageKey}
                      characterId={KABUTO_ID}
                      slot="ABILITY"
                      abilityName={card.imageKey}
                      label={pick(KABUTO_SLOT_LABELS[card.imageKey], locale)}
                    />
                  ) : null,
                )}
              </div>
            ) : null}
          </div>
        </section>

        {/* ══ 6 · BİLGİ KARTLARI ══════════════════════════════════════════
            Kartın yüzü dolu, arkası boş. Üçüncü kayıt Kabuto'nun kendisi ve
            alanları da boş — bölümün bütün iddiası o boşlukta. */}
        <section className={styles.section} aria-labelledby="kab-info">
          <header className={styles.head}>
            <p className={styles.marginNote}>
              {pick(KABUTO_SECTIONS.info.margin, locale)}
            </p>
            <div className={styles.headBody}>
              <h2 id="kab-info" className={styles.title}>
                {pick(KABUTO_SECTIONS.info.title, locale)}
              </h2>
              <p className={styles.lede}>
                {pick(KABUTO_SECTIONS.info.lede, locale)}
              </p>
            </div>
          </header>

          <div className={styles.body}>
            <ul className={styles.infoCards}>
              {KABUTO_INFO_CARDS.map((entry) => (
                <li
                  key={entry.key}
                  className={styles.infoCard}
                  data-self={entry.self || undefined}
                >
                  <div className={styles.infoFront}>
                    <p className={styles.infoLabel}>
                      {pick(KABUTO_INFO_UI.subjectLabel, locale)}
                    </p>
                    <h3 className={styles.infoSubject}>{entry.subject}</h3>
                    <p className={styles.infoLabel}>
                      {pick(KABUTO_INFO_UI.squadLabel, locale)}
                    </p>
                    <p className={styles.infoSquad}>{pick(entry.squad, locale)}</p>
                    <p className={styles.infoLabel}>
                      {pick(KABUTO_INFO_UI.lineLabel, locale)}
                    </p>
                    <p className={styles.infoLine}>{pick(entry.line, locale)}</p>
                  </div>
                  <div className={styles.infoBack}>
                    <p className={styles.infoLabel}>
                      {pick(KABUTO_INFO_UI.backLabel, locale)}
                    </p>
                    <p className={styles.infoBackWord}>
                      {pick(KABUTO_INFO_UI.backEmpty, locale)}
                    </p>
                  </div>
                  <p className={styles.infoNote}>{pick(entry.note, locale)}</p>
                </li>
              ))}
            </ul>

            {isAdmin ? (
              <div className={styles.slotRow}>
                <CuratorSlot
                  characterId={KABUTO_ID}
                  slot="ABILITY"
                  abilityName={KABUTO_IMAGE_KEYS.infoCards}
                  label={pick(
                    KABUTO_SLOT_LABELS[KABUTO_IMAGE_KEYS.infoCards],
                    locale,
                  )}
                />
              </div>
            ) : null}
          </div>
        </section>

        {/* ══ 7 · DOSYANIN BEŞ SAYFASI ════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="kab-fate">
          <header className={styles.head}>
            <p className={styles.marginNote}>
              {pick(KABUTO_SECTIONS.fate.margin, locale)}
            </p>
            <div className={styles.headBody}>
              <h2 id="kab-fate" className={styles.title}>
                {pick(KABUTO_SECTIONS.fate.title, locale)}
              </h2>
              <p className={styles.lede}>
                {pick(KABUTO_SECTIONS.fate.lede, locale)}
              </p>
            </div>
          </header>

          <div className={styles.body}>
            <ol className={styles.fate}>
              {KABUTO_TIMELINE.map((entry) => {
                const art = src(entry.imageKey);
                const face = entry.faceId
                  ? (faces.get(entry.faceId) ?? null)
                  : null;
                return (
                  <li key={entry.key} className={styles.fateItem}>
                    <StitchMark className={styles.fateStitch} />
                    <p className={styles.fateAge}>{pick(entry.age, locale)}</p>
                    <div className={styles.fateBody}>
                      <h3 className={styles.fateTitle}>
                        {pick(entry.title, locale)}
                      </h3>
                      <p className={styles.fateText}>{pick(entry.text, locale)}</p>
                      {art ? (
                        <span className={styles.fateArt} aria-hidden>
                          <Image src={art} alt="" fill sizes="560px" />
                        </span>
                      ) : null}
                      {isAdmin ? (
                        <CuratorSlot
                          characterId={KABUTO_ID}
                          slot="ABILITY"
                          abilityName={entry.imageKey}
                          label={pick(
                            KABUTO_SLOT_LABELS[entry.imageKey],
                            locale,
                          )}
                        />
                      ) : null}
                    </div>
                    {face && entry.faceName ? (
                      <figure className={styles.fateFace}>
                        <span className={styles.fateFaceArt}>
                          <Image
                            src={face}
                            alt={`${entry.faceName} ${faceSuffix}`}
                            fill
                            sizes="96px"
                          />
                        </span>
                        <figcaption>{entry.faceName}</figcaption>
                      </figure>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ══ 8 · KAPANIŞ ═════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="kab-closing">
          <h2 id="kab-closing" className={styles.visuallyHidden}>
            {name}
          </h2>

          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}

          {KABUTO_CLOSING.quotes.map((quote) => (
            <figure key={quote.text.tr} className={styles.closingQuote}>
              <blockquote>&ldquo;{pick(quote.text, locale)}&rdquo;</blockquote>
              {quote.original ? (
                <p className={styles.quoteOriginal} aria-hidden>
                  {quote.original}
                </p>
              ) : null}
              <figcaption>
                <span className={styles.quoteBy}>{pick(quote.by, locale)}</span>
                <span className={styles.quoteNote}>
                  {pick(quote.note, locale)}
                </span>
              </figcaption>
            </figure>
          ))}

          <p className={styles.motto} aria-hidden>
            {KABUTO_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(KABUTO_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(KABUTO_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(KABUTO_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={KABUTO_ID}
                slot="ABILITY"
                abilityName={KABUTO_IMAGE_KEYS.closing}
                label={pick(
                  KABUTO_SLOT_LABELS[KABUTO_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </SageShell>
  );
}
