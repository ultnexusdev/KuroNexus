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
import { animeHref } from "@/lib/anime/routes";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  JIRAIYA_BOOK_TITLE,
  JIRAIYA_CLOSING,
  JIRAIYA_FATE,
  JIRAIYA_FATE_TITLE,
  JIRAIYA_HERO,
  JIRAIYA_ID,
  JIRAIYA_IDENTITY,
  JIRAIYA_IMAGE_KEYS,
  JIRAIYA_LAB_TITLE,
  JIRAIYA_LEAVES,
  JIRAIYA_MINOR,
  JIRAIYA_SENNIN,
  JIRAIYA_SLOT_LABELS,
  JIRAIYA_TECHNIQUES,
} from "@/lib/characters/jiraiya-experience";
import {
  BrushRule,
  InkBlot,
  MyobokuRidge,
  SpiralMark,
  ToadMark,
} from "./JiraiyaMarks";
import { GutsyNinjaBook, type BookLeafView } from "./GutsyNinjaBook";
import { SenninShell } from "./SenninShell";
import styles from "./JiraiyaExperience.module.css";

/**
 * Jiraiya — "Yazarın El Yazması" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/2423 bu bileşene dallanır.
 * Sayfa bir parşömen: solunda cetvelli bir kenar boşluğu, üstünde fırça
 * yazısı, ortasında altı yapraklık bir el yazması var. Anlatının ekseni
 * Jiraiya'nın YAZARLIĞI — ölürken bile yazan adam.
 *
 * Akış: Kapak → Künye → Fırça ve mühür → Dokonjō Ninden (çevrilen sayfalar)
 * → Kader çizelgesi → Son yaprak.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var: `SenninShell` (tek durum —
 * sennin modu) ve `GutsyNinjaBook` (yaprak sırası). Metinler burada `pick()`
 * ile seçilip adalara düz dize olarak iner (BRIEF madde 5 ve 8).
 *
 * Görseller characterId 2423 kaydının ABILITY yuvalarından (`jiraiya:*`)
 * çözülür; yuva boşsa bölüm görselsiz ama ayakta kalır.
 */
export function JiraiyaExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const faces = companionPortraits(companions);
  const portrait = primaryPortrait(detail);
  const cover = ability.get(JIRAIYA_IMAGE_KEYS.cover) ?? null;

  /** İki dilli alt metni tek yerden kur: kaynağı söyleyen künye (madde 3.5) */
  const uploadedAlt = (subject: string): string =>
    locale === "en"
      ? `${subject} — image uploaded to the archive`
      : `${subject} — arşive yüklenmiş görsel`;
  const portraitAlt = (subject: string): string =>
    locale === "en"
      ? `${subject} — portrait uploaded to the archive`
      : `${subject} — arşive yüklenmiş portre`;

  const slotLabel = (key: string): string =>
    pick(JIRAIYA_SLOT_LABELS[key], locale);

  const leaves: BookLeafView[] = JIRAIYA_LEAVES.map((leaf) => ({
    key: leaf.key,
    folio: leaf.folio,
    folioKanji: leaf.folioKanji,
    age: pick(leaf.age, locale),
    title: pick(leaf.title, locale),
    text: pick(leaf.text, locale),
    margin: pick(leaf.margin, locale),
    quote: leaf.quote
      ? { text: pick(leaf.quote.text, locale), by: pick(leaf.quote.by, locale) }
      : null,
    cipher: leaf.cipher
      ? { glyphs: leaf.cipher.glyphs, reading: pick(leaf.cipher.reading, locale) }
      : null,
    image: ability.get(leaf.imageKey) ?? null,
    imageAlt: uploadedAlt(pick(leaf.title, locale)),
  }));

  return (
    <SenninShell
      enterLabel={pick(JIRAIYA_SENNIN.enter, locale)}
      exitLabel={pick(JIRAIYA_SENNIN.exit, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>Naruto</Link>
        </nav>

        {/* ══ 1 · KAPAK ══════════════════════════════════════════════ */}
        <header className={styles.hero}>
          {cover ? (
            <div className={styles.heroScene}>
              <Image
                src={cover}
                alt={pick(JIRAIYA_HERO.coverAlt, locale)}
                fill
                sizes="100vw"
              />
              <span className={styles.heroSceneScrim} aria-hidden />
            </div>
          ) : null}

          <MyobokuRidge className={styles.heroRidge} />
          <span className={styles.heroSign} aria-hidden>
            {JIRAIYA_HERO.watermark}
          </span>
          <ToadMark className={styles.heroToad} />
          <InkBlot className={styles.heroBlot} variant={2} />

          <div className={styles.heroInner}>
            {portrait ? (
              <figure className={styles.plate}>
                <span className={styles.plateFrame}>
                  <Image
                    src={portrait}
                    alt={pick(JIRAIYA_HERO.portraitAlt, locale)}
                    fill
                    sizes="(max-width: 900px) 60vw, 21rem"
                    unoptimized={!isUploadedPortrait(detail)}
                    priority
                  />
                </span>
                <figcaption className={styles.plateCaption}>
                  {pick(JIRAIYA_HERO.plateCaption, locale)}
                </figcaption>
              </figure>
            ) : null}

            <div className={styles.heroText}>
              <h1 className={styles.heroName}>{JIRAIYA_HERO.name}</h1>
              <p className={styles.heroAlias}>
                <span className={styles.heroAliasGlyph} aria-hidden>
                  {JIRAIYA_HERO.alias}
                </span>
                <span className={styles.heroAliasNote}>
                  {pick(JIRAIYA_HERO.aliasNote, locale)}
                </span>
              </p>
              <BrushRule className={styles.heroRule} />
              <p className={styles.heroLede}>{pick(JIRAIYA_HERO.lede, locale)}</p>
            </div>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={JIRAIYA_ID}
                slot="ABILITY"
                abilityName={JIRAIYA_IMAGE_KEYS.cover}
                label={slotLabel(JIRAIYA_IMAGE_KEYS.cover)}
              />
            </div>
          ) : null}
        </header>

        {/* ══ 2 · KÜNYE ══════════════════════════════════════════════ */}
        <section className={styles.colophon} aria-labelledby="jiraiya-colophon">
          <header className={styles.sectionHead}>
            <h2 id="jiraiya-colophon" className={styles.sectionTitle}>
              {pick(JIRAIYA_IDENTITY.title, locale)}
            </h2>
            <BrushRule className={styles.sectionRule} />
            <p className={styles.sectionLede}>
              {pick(JIRAIYA_IDENTITY.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {JIRAIYA_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · FIRÇA VE MÜHÜR ═════════════════════════════════════ */}
        <section className={styles.craftSection} aria-labelledby="jiraiya-craft">
          <header className={styles.sectionHead}>
            <h2 id="jiraiya-craft" className={styles.sectionTitle}>
              {pick(JIRAIYA_LAB_TITLE.title, locale)}
            </h2>
            <BrushRule className={styles.sectionRule} />
            <p className={styles.sectionLede}>
              {pick(JIRAIYA_LAB_TITLE.lede, locale)}
            </p>
          </header>

          <ul className={styles.craftGrid}>
            {JIRAIYA_TECHNIQUES.map((technique) => {
              const key = JIRAIYA_IMAGE_KEYS[technique.key];
              const image = ability.get(key) ?? null;
              return (
                <li
                  key={technique.key}
                  className={styles.craft}
                  data-tech={technique.key}
                >
                  <span className={styles.craftPlate}>
                    {image ? (
                      <Image
                        src={image}
                        alt={uploadedAlt(technique.name)}
                        fill
                        sizes="(max-width: 900px) 88vw, 420px"
                      />
                    ) : /* Görsel bağlanmadan önce teknik kendi işaretiyle durur */
                    technique.key === "rasengan" ? (
                      <SpiralMark
                        className={styles.craftSpiral}
                        spinClassName={styles.spinSlow}
                      />
                    ) : (
                      <ToadMark className={styles.craftToad} />
                    )}
                    <span className={styles.craftPlateFx} aria-hidden />
                  </span>
                  <span className={styles.craftBody}>
                    <span className={styles.craftKanji} aria-hidden>
                      {technique.kanji}
                    </span>
                    <span className={styles.craftName}>{technique.name}</span>
                    <span className={styles.craftTagline}>
                      {pick(technique.tagline, locale)}
                    </span>
                    <span className={styles.craftText}>
                      {pick(technique.text, locale)}
                    </span>
                    <span className={styles.craftTraits}>
                      {technique.traits.map((trait) => (
                        <span key={trait.tr} className={styles.craftTrait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={JIRAIYA_ID}
                      slot="ABILITY"
                      abilityName={key}
                      label={slotLabel(key)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>

          <ul className={styles.indexList}>
            {JIRAIYA_MINOR.map((minor) => {
              const key = JIRAIYA_IMAGE_KEYS[minor.key];
              const image = ability.get(key) ?? null;
              return (
                <li key={minor.key} className={styles.indexRow}>
                  <span className={styles.indexPlate}>
                    {image ? (
                      <Image
                        src={image}
                        alt={uploadedAlt(minor.name)}
                        fill
                        sizes="160px"
                      />
                    ) : (
                      <span className={styles.indexKanji} aria-hidden>
                        {minor.kanji}
                      </span>
                    )}
                  </span>
                  <span className={styles.indexBody}>
                    <span className={styles.indexName}>
                      {minor.name}
                      <span className={styles.indexNameKanji} aria-hidden>
                        {minor.kanji}
                      </span>
                    </span>
                    <span className={styles.indexNote}>
                      {pick(minor.note, locale)}
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={JIRAIYA_ID}
                      slot="ABILITY"
                      abilityName={key}
                      label={slotLabel(key)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · DOKONJŌ NINDEN — ÇEVRİLEN SAYFALAR ═════════════════ */}
        <section className={styles.bookSection} aria-labelledby="jiraiya-book">
          <header className={styles.sectionHead}>
            <p className={styles.bookNative} aria-hidden>
              ど根性忍伝
            </p>
            <h2 id="jiraiya-book" className={styles.sectionTitle}>
              {pick(JIRAIYA_BOOK_TITLE.title, locale)}
            </h2>
            <p className={styles.bookSubtitle}>
              {pick(JIRAIYA_BOOK_TITLE.subtitle, locale)}
            </p>
            <BrushRule className={styles.sectionRule} />
            <p className={styles.sectionLede}>
              {pick(JIRAIYA_BOOK_TITLE.lede, locale)}
            </p>
            <p className={styles.bookDisclaimer}>
              {pick(JIRAIYA_BOOK_TITLE.disclaimer, locale)}
            </p>
          </header>

          <GutsyNinjaBook
            leaves={leaves}
            labels={{
              prev: pick(JIRAIYA_BOOK_TITLE.prev, locale),
              next: pick(JIRAIYA_BOOK_TITLE.next, locale),
              pageWord: pick(JIRAIYA_BOOK_TITLE.pageWord, locale),
              stackLabel: pick(JIRAIYA_BOOK_TITLE.stackLabel, locale),
              marginLabel: pick(JIRAIYA_BOOK_TITLE.marginLabel, locale),
              goTo: pick(JIRAIYA_BOOK_TITLE.goTo, locale),
            }}
          />

          {isAdmin ? (
            <div className={styles.slotRow}>
              {JIRAIYA_LEAVES.map((leaf) => (
                <CuratorSlot
                  key={leaf.imageKey}
                  characterId={JIRAIYA_ID}
                  slot="ABILITY"
                  abilityName={leaf.imageKey}
                  label={slotLabel(leaf.imageKey)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 5 · KADER ÇİZELGESİ ════════════════════════════════════ */}
        <section className={styles.fateSection} aria-labelledby="jiraiya-fate">
          <header className={styles.sectionHead}>
            <h2 id="jiraiya-fate" className={styles.sectionTitle}>
              {pick(JIRAIYA_FATE_TITLE.title, locale)}
            </h2>
            <BrushRule className={styles.sectionRule} />
            <p className={styles.sectionLede}>
              {pick(JIRAIYA_FATE_TITLE.lede, locale)}
            </p>
          </header>

          <ol className={styles.fateList}>
            {JIRAIYA_FATE.map((step) => (
              <li key={step.key} className={styles.fateStep} data-step={step.key}>
                <span className={styles.fateSeals}>
                  {step.companions.map((companion) => {
                    const face = faces.get(companion.id) ?? null;
                    return (
                      <span key={companion.id} className={styles.fateSeal}>
                        {face ? (
                          <Image
                            src={face}
                            alt={portraitAlt(companion.name)}
                            fill
                            sizes="96px"
                          />
                        ) : (
                          <span className={styles.fateSealInitial} aria-hidden>
                            {companion.name.slice(0, 1)}
                          </span>
                        )}
                      </span>
                    );
                  })}
                </span>
                <div className={styles.fateBody}>
                  <p className={styles.fateAge}>{pick(step.age, locale)}</p>
                  <h3 className={styles.fateTitle}>{pick(step.title, locale)}</h3>
                  <p className={styles.fateText}>{pick(step.text, locale)}</p>
                  {step.quote ? (
                    <figure className={styles.fateQuote}>
                      <blockquote>
                        &ldquo;{pick(step.quote.text, locale)}&rdquo;
                      </blockquote>
                      <figcaption>{pick(step.quote.by, locale)}</figcaption>
                    </figure>
                  ) : null}
                  <p className={styles.fateNames}>
                    {step.companions.map((companion) => companion.name).join(" · ")}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ══ 6 · SON YAPRAK ═════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="jiraiya-closing">
          <h2 id="jiraiya-closing" className={styles.visuallyHidden}>
            {pick(JIRAIYA_CLOSING.title, locale)}
          </h2>
          <InkBlot className={styles.closingBlot} variant={3} />

          {JIRAIYA_CLOSING.quotes.map((quote) => (
            <figure key={quote.text.tr} className={styles.closingQuote}>
              <blockquote>&ldquo;{pick(quote.text, locale)}&rdquo;</blockquote>
              <figcaption>{pick(quote.by, locale)}</figcaption>
            </figure>
          ))}

          <p className={styles.motto} aria-hidden>
            {JIRAIYA_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(JIRAIYA_CLOSING.mottoNote, locale)}
          </p>

          <ToadMark className={styles.closingToad} />

          <p className={styles.credit}>
            {pick(JIRAIYA_CLOSING.credit, locale)}
            {detail.character.siteUrl ? (
              <>
                {" "}
                <a
                  href={detail.character.siteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.creditLink}
                >
                  {pick(JIRAIYA_CLOSING.creditLink, locale)}
                </a>
              </>
            ) : null}
          </p>
        </section>
      </CuratorFrame>
    </SenninShell>
  );
}
