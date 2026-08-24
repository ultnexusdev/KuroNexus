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
  NEJI_ALT,
  NEJI_ARTS,
  NEJI_BONDS,
  NEJI_CAGE_TEXT,
  NEJI_CLOSING,
  NEJI_COUNTER_UI,
  NEJI_CRUMB,
  NEJI_HERO,
  NEJI_ID,
  NEJI_IDENTITY,
  NEJI_IMAGE_KEYS,
  NEJI_SEAL,
  NEJI_SECTIONS,
  NEJI_SITE_URL,
  NEJI_SLOT_LABELS,
  NEJI_SMALL,
  NEJI_STAGES,
  NEJI_TIMELINE,
} from "@/lib/characters/neji-hyuga-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { CageShell } from "./CageShell";
import { TrigramCounter } from "./TrigramCounter";
import { CageSeal, VeinBranches } from "./HyugaSigils";
import styles from "./NejiExperience.module.css";

/**
 * Neji Hyūga — "Kafesteki Kuş" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/1694 bu bileşene dallanır.
 * Sayfanın fikri tek kelime: KADER. Bölüm başlıkları değiştirilemezlik
 * iddiasını taşıyan bir ön sözle açılıyor, "Kafes kırılıyor" modu o ön sözleri
 * başlıklardan çekiyor, sayfanın kapanışı ise dili kalıcı olarak kırıyor.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   CageShell      — "Kafes kırılıyor" (tek boolean, etkinin tamamı CSS'te)
 *   TrigramCounter — sekiz trigram sayacı (2 → 4 → 8 → 16 → 32 → 64, ayrıca 128)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner (BRIEF §5).
 *
 * Görseller: characterId 1694 kaydının ABILITY yuvaları (`neji:*`). Hiçbiri
 * zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır. Mühür, damar
 * ağı, trigram çubukları ve tenketsu şeması elle çizilmiş SVG (HyugaSigils).
 */

/**
 * Bölüm başlığı: KADER ön sözü + başlığın kendisi.
 *
 * İkisi ayrı düğüm çünkü mod açıldığında yalnız ön söz siliniyor
 * (`.page[data-broken] .fateWord`). Boşluk ön sözün İÇİNDE (bölünemez boşluk):
 * ön söz genişliğini kaybettiğinde boşluk da onunla birlikte gidiyor.
 */
function SectionHead({
  id,
  fate,
  title,
  lede,
}: {
  id: string;
  fate: string;
  title: string;
  lede: string;
}) {
  return (
    <header className={styles.sectionHead}>
      <h2 id={id} className={styles.sectionTitle}>
        <span className={styles.fateWord}>
          {fate}
          {" "}
        </span>
        <span className={styles.titleCore}>{title}</span>
      </h2>
      <p className={styles.sectionLede}>{lede}</p>
    </header>
  );
}

export function NejiExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const faces = companionPortraits(companions);
  const src = (key: string): string | null => ability.get(key) ?? null;
  const slotLabel = (key: string): string =>
    pick(NEJI_SLOT_LABELS[key], locale);

  const portrait = primaryPortrait(detail);
  const portraitUploaded = isUploadedPortrait(detail);
  const heroScene = src(NEJI_IMAGE_KEYS.hero);
  const sealScene = src(NEJI_IMAGE_KEYS.seal);
  const closingArt = src(NEJI_IMAGE_KEYS.closing);

  const nativeName = detail.character.nameNative ?? NEJI_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? NEJI_SITE_URL;

  const stages = NEJI_STAGES.map((stage) => ({
    key: stage.key,
    strikes: stage.strikes,
    separate: Boolean(stage.separate),
    label: pick(stage.label, locale),
    note: pick(stage.note, locale),
  }));

  return (
    <CageShell
      enterLabel={pick(NEJI_CAGE_TEXT.enter, locale)}
      exitLabel={pick(NEJI_CAGE_TEXT.exit, locale)}
      hint={pick(NEJI_CAGE_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>{pick(NEJI_CRUMB.naruto, locale)}</Link>
        </nav>

        {/* ══ 1 · HERO — ALINDAN AÇILAN AĞ ═══════════════════════════════
            Portre dar bir sütunda; damar ağı portrenin alnına ortalanmış ve
            kadrajın dışına taşıyor. Filigran klan adı. */}
        <section className={styles.hero} aria-labelledby="neji-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <p className={styles.heroMark} aria-hidden>
            {NEJI_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <p className={styles.heroBranch}>
              {pick(NEJI_IDENTITY.branch, locale)}
            </p>
            <h1 id="neji-name" className={styles.heroName}>
              <span className={styles.heroGiven}>{NEJI_IDENTITY.givenName}</span>{" "}
              <span className={styles.heroClan}>{NEJI_IDENTITY.clanName}</span>
            </h1>
            <p className={styles.heroNative} aria-hidden lang="ja">
              {nativeName}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(NEJI_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(NEJI_HERO.lede, locale)}</p>
          </div>

          <div className={styles.heroAside}>
            <div className={styles.heroPortrait} data-small={!portraitUploaded || undefined}>
              {portrait ? (
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? NEJI_HERO.portraitAlt
                      : NEJI_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="(max-width: 760px) 60vw, 340px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              ) : null}
              {/* Damar ağı: alına ortalanmış, kadrajın dışına taşan katman */}
              <span className={styles.heroVeins} aria-hidden>
                <VeinBranches
                  className={styles.veinArt}
                  pathClassName={styles.vein}
                />
              </span>
            </div>
            <p className={styles.veinCaption}>
              {pick(NEJI_HERO.veinCaption, locale)}
            </p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={NEJI_ID}
                slot="ABILITY"
                abilityName={NEJI_IMAGE_KEYS.hero}
                label={slotLabel(NEJI_IMAGE_KEYS.hero)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KAFES MÜHRÜ — SAYFANIN DUYGUSAL MERKEZİ ════════════════
            Sayfada tek bir yerde duruyor ve TIKLANABİLİR DEĞİL. Yanında dal
            ayrımı ve babasının ölümü. */}
        <section className={styles.sealSection} aria-labelledby="neji-seal">
          <SectionHead
            id="neji-seal"
            fate={pick(NEJI_SECTIONS.seal.fate, locale)}
            title={pick(NEJI_SECTIONS.seal.title, locale)}
            lede={pick(NEJI_SECTIONS.seal.lede, locale)}
          />

          <div className={styles.sealBody}>
            <figure className={styles.sealFigure}>
              {sealScene ? (
                <span className={styles.sealScene} aria-hidden>
                  <Image src={sealScene} alt="" fill sizes="520px" />
                </span>
              ) : null}
              <CageSeal
                className={styles.sealArt}
                cageClassName={styles.sealCage}
                birdClassName={styles.sealBird}
                markClassName={styles.sealMark}
                crackClassName={styles.sealCrack}
                bandClassName={styles.sealBand}
                label={pick(NEJI_SEAL.figureLabel, locale)}
              />
              <figcaption className={styles.sealCaption}>
                <span className={styles.sealNative} lang="ja">
                  {NEJI_SEAL.native}
                </span>
                <span className={styles.sealName}>{NEJI_SEAL.name}</span>
                <span className={styles.sealGloss}>
                  {pick(NEJI_SEAL.gloss, locale)}
                </span>
                <span className={styles.sealNote}>
                  {pick(NEJI_SEAL.caption, locale)}
                </span>
              </figcaption>
            </figure>

            <div className={styles.sealText}>
              {NEJI_SEAL.paragraphs.map((paragraph) => (
                <p key={paragraph.tr} className={styles.sealParagraph}>
                  {pick(paragraph, locale)}
                </p>
              ))}
            </div>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={NEJI_ID}
                slot="ABILITY"
                abilityName={NEJI_IMAGE_KEYS.seal}
                label={slotLabel(NEJI_IMAGE_KEYS.seal)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 3 · KÜNYE ══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="neji-identity">
          <SectionHead
            id="neji-identity"
            fate={pick(NEJI_SECTIONS.identity.fate, locale)}
            title={pick(NEJI_SECTIONS.identity.title, locale)}
            lede={pick(NEJI_SECTIONS.identity.lede, locale)}
          />
          <dl className={styles.facts}>
            {NEJI_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 4 · AVUCUN ÜÇ BİÇİMİ ═══════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="neji-arts">
          <SectionHead
            id="neji-arts"
            fate={pick(NEJI_SECTIONS.arts.fate, locale)}
            title={pick(NEJI_SECTIONS.arts.title, locale)}
            lede={pick(NEJI_SECTIONS.arts.lede, locale)}
          />
          <ul className={styles.arts}>
            {NEJI_ARTS.map((art) => {
              const image = src(art.imageKey);
              return (
                <li key={art.key} className={styles.art}>
                  <span className={styles.artArt} aria-hidden>
                    {image ? (
                      <Image src={image} alt="" fill sizes="720px" />
                    ) : null}
                  </span>
                  <span className={styles.artNative} aria-hidden lang="ja">
                    {art.native}
                  </span>
                  <span className={styles.artBody}>
                    <span className={styles.artName}>{art.name}</span>
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
                      characterId={NEJI_ID}
                      slot="ABILITY"
                      abilityName={art.imageKey}
                      label={slotLabel(art.imageKey)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · DÖRT KÜÇÜK KESİNLİK ════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="neji-small">
          <SectionHead
            id="neji-small"
            fate={pick(NEJI_SECTIONS.small.fate, locale)}
            title={pick(NEJI_SECTIONS.small.title, locale)}
            lede={pick(NEJI_SECTIONS.small.lede, locale)}
          />
          <ul className={styles.smallGrid}>
            {NEJI_SMALL.map((item) => {
              const image = src(item.imageKey);
              return (
                <li key={item.key} className={styles.smallItem}>
                  <span className={styles.smallArt} aria-hidden>
                    {image ? (
                      <Image src={image} alt="" fill sizes="480px" />
                    ) : null}
                  </span>
                  <span className={styles.smallNative} aria-hidden lang="ja">
                    {item.native}
                  </span>
                  <span className={styles.smallName}>
                    {pick(item.name, locale)}
                  </span>
                  <span className={styles.smallNote}>
                    {pick(item.note, locale)}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={NEJI_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={slotLabel(item.imageKey)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 6 · SEKİZ TRİGRAM SAYACI — SAYFANIN KALBİ ══════════════════ */}
        <section className={styles.counterSection} aria-labelledby="neji-counter">
          <SectionHead
            id="neji-counter"
            fate={pick(NEJI_SECTIONS.counter.fate, locale)}
            title={pick(NEJI_SECTIONS.counter.title, locale)}
            lede={pick(NEJI_SECTIONS.counter.lede, locale)}
          />

          {/* Sayacın üstünde Neji'nin kendi sayımı */}
          <figure className={styles.shout}>
            <blockquote>
              &ldquo;{pick(NEJI_COUNTER_UI.shout.text, locale)}&rdquo;
            </blockquote>
            <figcaption>{pick(NEJI_COUNTER_UI.shout.by, locale)}</figcaption>
          </figure>

          <TrigramCounter
            stages={stages}
            railLabel={pick(NEJI_COUNTER_UI.railLabel, locale)}
            strikeWord={pick(NEJI_COUNTER_UI.strikeWord, locale)}
            sealedLabel={pick(NEJI_COUNTER_UI.sealedLabel, locale)}
            emptyNote={pick(NEJI_COUNTER_UI.emptyNote, locale)}
            hint={pick(NEJI_COUNTER_UI.hint, locale)}
            figureLabel={pick(NEJI_COUNTER_UI.figureLabel, locale)}
            scene={src(NEJI_IMAGE_KEYS.counter)}
          />

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={NEJI_ID}
                slot="ABILITY"
                abilityName={NEJI_IMAGE_KEYS.counter}
                label={slotLabel(NEJI_IMAGE_KEYS.counter)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 7 · KAFESİN DIŞINDAKİLER ═══════════════════════════════════
            Portreler dar dikey şeritlerde: parmaklıkların arasından
            görünen insanlar. */}
        <section className={styles.section} aria-labelledby="neji-bonds">
          <SectionHead
            id="neji-bonds"
            fate={pick(NEJI_SECTIONS.bonds.fate, locale)}
            title={pick(NEJI_SECTIONS.bonds.title, locale)}
            lede={pick(NEJI_SECTIONS.bonds.lede, locale)}
          />
          <ul className={styles.bonds}>
            {NEJI_BONDS.map((bond) => {
              const face = faces.get(bond.characterId) ?? null;
              const linked = isExperienceCharacter(bond.characterId);
              const inner = (
                <>
                  <span className={styles.bondArt}>
                    {face ? (
                      <Image
                        src={face}
                        alt={`${bond.name} ${pick(NEJI_ALT.bondSuffix, locale)}`}
                        fill
                        sizes="(max-width: 760px) 44vw, 220px"
                      />
                    ) : null}
                  </span>
                  <span className={styles.bondRole}>
                    {pick(bond.role, locale)}
                  </span>
                  <span className={styles.bondName}>{bond.name}</span>
                  <span className={styles.bondNote}>
                    {pick(bond.note, locale)}
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
                    <span className={styles.bondLink} data-static>
                      {inner}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 8 · KADER ÇİZELGESİ ════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="neji-fate">
          <SectionHead
            id="neji-fate"
            fate={pick(NEJI_SECTIONS.fate.fate, locale)}
            title={pick(NEJI_SECTIONS.fate.title, locale)}
            lede={pick(NEJI_SECTIONS.fate.lede, locale)}
          />
          <ol className={styles.fate}>
            {NEJI_TIMELINE.map((entry) => {
              const image = src(entry.imageKey);
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
                        <blockquote>
                          &ldquo;{pick(entry.quote.text, locale)}&rdquo;
                        </blockquote>
                        <figcaption>{pick(entry.quote.by, locale)}</figcaption>
                      </figure>
                    ) : null}
                  </div>
                  <span className={styles.fateArt} aria-hidden>
                    {image ? (
                      <Image src={image} alt="" fill sizes="560px" />
                    ) : null}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={NEJI_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={slotLabel(entry.imageKey)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 9 · KAPANIŞ — KADER DİLİNİN KIRILDIĞI YER ══════════════════ */}
        <section className={styles.closing} aria-labelledby="neji-closing">
          <h2 id="neji-closing" className={styles.visuallyHidden}>
            {`${NEJI_IDENTITY.givenName} ${NEJI_IDENTITY.clanName}`}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}

          <div className={styles.closingQuotes}>
            {NEJI_CLOSING.quotes.map((quote) => (
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
          </div>

          <p className={styles.motto} aria-hidden lang="ja">
            {NEJI_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(NEJI_CLOSING.mottoNote, locale)}
          </p>

          {/* Sayfanın kader dilini geçersiz kılan üç cümle */}
          <div className={styles.breakText}>
            {NEJI_CLOSING.breaks.map((line) => (
              <p key={line.tr} className={styles.breakLine}>
                {pick(line, locale)}
              </p>
            ))}
          </div>

          <p className={styles.credit}>
            {pick(NEJI_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(NEJI_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={NEJI_ID}
                slot="ABILITY"
                abilityName={NEJI_IMAGE_KEYS.closing}
                label={slotLabel(NEJI_IMAGE_KEYS.closing)}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </CageShell>
  );
}
