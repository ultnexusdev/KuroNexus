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
  KUSHINA_ALT,
  KUSHINA_ARTS,
  KUSHINA_BOND_UI,
  KUSHINA_BONDS,
  KUSHINA_CLOSING,
  KUSHINA_CRUMB,
  KUSHINA_HABANERO_TEXT,
  KUSHINA_HERO,
  KUSHINA_ID,
  KUSHINA_IDENTITY,
  KUSHINA_IMAGE_KEYS,
  KUSHINA_LAST_WORDS,
  KUSHINA_NOTES,
  KUSHINA_SECTIONS,
  KUSHINA_SITE_URL,
  KUSHINA_SLOT_LABELS,
  KUSHINA_TIMELINE,
} from "@/lib/characters/kushina-uzumaki-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { HabaneroShell } from "./HabaneroShell";
import { BondChain } from "./BondChain";
import { HairFall, WhirlCrest } from "./UzumakiGlyphs";
import styles from "./KushinaExperience.module.css";

/**
 * Kushina Uzumaki — "Çakra Zincirleri" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/7302 bu bileşene dallanır
 * (rota dosyasındaki `EXPERIENCES` haritası). Sayfanın fikri tek cümle:
 * BAĞ. Sayfanın sol kenarından beş halkalı bir zincir iniyor ve her halka
 * Kushina'nın bağlı olduğu bir şeye karşılık geliyor; son halkada zincir
 * kopuyor. Sayfanın duygusal merkezi ise en sonda: kesilmeyen, uzun,
 * sakin bir konuşma.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   HabaneroShell — "Kızıl Habanero" modu (tek boolean, etkinin tamamı CSS)
 *   BondChain     — beş halkalı bağ zinciri (sekme + klavye + kopuş)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 7302 kaydının ABILITY yuvaları (`kushina:*`).
 * Hiçbiri zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır.
 */
export function KushinaExperience({
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
  const heroScene = src(KUSHINA_IMAGE_KEYS.hero);
  const lastWordsArt = src(KUSHINA_IMAGE_KEYS.lastWords);
  const closingArt = src(KUSHINA_IMAGE_KEYS.closing);

  const name = detail.character.name || KUSHINA_IDENTITY.name;
  const nativeName =
    detail.character.nameNative ?? KUSHINA_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? KUSHINA_SITE_URL;
  const companionSuffix = pick(KUSHINA_ALT.companionSuffix, locale);

  const bonds = KUSHINA_BONDS.map((bond) => ({
    key: bond.key,
    tag: pick(bond.tag, locale),
    name: bond.name,
    kanji: bond.kanji,
    turkish: pick(bond.turkish, locale),
    pull: pick(bond.pull, locale),
    text: pick(bond.text, locale),
    strain: pick(bond.strain, locale),
    breakText: bond.breakText ? pick(bond.breakText, locale) : null,
    face: bond.companionId ? (faces.get(bond.companionId) ?? null) : null,
    faceAlt: `${bond.name} ${companionSuffix}`,
    glyph: bond.glyph ?? null,
    image: src(bond.imageKey),
  }));

  return (
    <HabaneroShell
      enterLabel={pick(KUSHINA_HABANERO_TEXT.enter, locale)}
      exitLabel={pick(KUSHINA_HABANERO_TEXT.exit, locale)}
      hint={pick(KUSHINA_HABANERO_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(KUSHINA_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO ═══════════════════════════════════════════════════
            Arkada Uzumaki girdap amblemi, portrenin üstünden kadrajın
            dışına taşan kızıl teller, sol kenarda zincirin sayfaya giren
            ilk parçası. Portre tam boy (arşivin kendi yüklemesi). */}
        <section className={styles.hero} aria-labelledby="kus-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <WhirlCrest className={styles.heroCrest} />

          <p className={styles.heroMark} aria-hidden>
            {KUSHINA_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <p className={styles.heroClan}>
              {pick(KUSHINA_IDENTITY.clan, locale)}
            </p>
            <h1 id="kus-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {nativeName}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(KUSHINA_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(KUSHINA_HERO.lede, locale)}</p>
          </div>

          <div className={styles.heroAside}>
            <span className={styles.heroPortrait}>
              {portrait ? (
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? KUSHINA_HERO.portraitAlt
                      : KUSHINA_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="(max-width: 760px) 60vw, 400px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              ) : null}
              {/* Teller portrenin üstünden geçip kutunun dışına çıkıyor —
                  kadrajın kesmediği tek şey saç. */}
              <HairFall className={styles.heroHair} />
            </span>
            <p className={styles.heroHairCaption}>
              {pick(KUSHINA_HERO.hairCaption, locale)}
            </p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={KUSHINA_ID}
                slot="ABILITY"
                abilityName={KUSHINA_IMAGE_KEYS.hero}
                label={pick(
                  KUSHINA_SLOT_LABELS[KUSHINA_IMAGE_KEYS.hero],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="kus-identity">
          <header className={styles.sectionHead}>
            <h2 id="kus-identity" className={styles.sectionTitle}>
              {pick(KUSHINA_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KUSHINA_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {KUSHINA_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · KANIN GETİRDİĞİ ÜÇ ŞEY ═════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="kus-arts">
          <header className={styles.sectionHead}>
            <h2 id="kus-arts" className={styles.sectionTitle}>
              {pick(KUSHINA_SECTIONS.arts.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KUSHINA_SECTIONS.arts.lede, locale)}
            </p>
          </header>
          <ul className={styles.arts}>
            {KUSHINA_ARTS.map((art) => {
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
                      characterId={KUSHINA_ID}
                      slot="ABILITY"
                      abilityName={art.imageKey}
                      label={pick(KUSHINA_SLOT_LABELS[art.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · DÖRT NOT ═══════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="kus-notes">
          <header className={styles.sectionHead}>
            <h2 id="kus-notes" className={styles.sectionTitle}>
              {pick(KUSHINA_SECTIONS.tools.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KUSHINA_SECTIONS.tools.lede, locale)}
            </p>
          </header>
          <ul className={styles.notes}>
            {KUSHINA_NOTES.map((item) => {
              const scene = src(item.imageKey);
              const face = item.companionId
                ? (faces.get(item.companionId) ?? null)
                : null;
              return (
                <li key={item.key} className={styles.note}>
                  <span className={styles.noteArt} aria-hidden>
                    {scene ? (
                      <Image src={scene} alt="" fill sizes="480px" />
                    ) : null}
                  </span>
                  <span className={styles.noteName}>
                    {pick(item.name, locale)}
                  </span>
                  <span className={styles.noteText}>
                    {pick(item.note, locale)}
                  </span>
                  {face && item.companionName && item.companionRole ? (
                    <span className={styles.noteKin}>
                      <span className={styles.noteKinFace}>
                        <Image
                          src={face}
                          alt={`${item.companionName} ${companionSuffix}`}
                          fill
                          sizes="72px"
                        />
                      </span>
                      <span className={styles.noteKinBody}>
                        <span className={styles.noteKinName}>
                          {item.companionName}
                        </span>
                        <span className={styles.noteKinRole}>
                          {pick(item.companionRole, locale)}
                        </span>
                      </span>
                    </span>
                  ) : null}
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={KUSHINA_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(KUSHINA_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · ZİNCİRİN HALKALARI — SAYFANIN KALBİ ════════════════════ */}
        <section className={styles.chainSection} aria-labelledby="kus-bonds">
          <header className={styles.sectionHead}>
            <h2 id="kus-bonds" className={styles.sectionTitle}>
              {pick(KUSHINA_SECTIONS.bonds.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KUSHINA_SECTIONS.bonds.lede, locale)}
            </p>
          </header>
          <BondChain
            bonds={bonds}
            listLabel={pick(KUSHINA_BOND_UI.listLabel, locale)}
            linkWord={pick(KUSHINA_BOND_UI.linkWord, locale)}
            prevLabel={pick(KUSHINA_BOND_UI.prev, locale)}
            nextLabel={pick(KUSHINA_BOND_UI.next, locale)}
            pullLabel={pick(KUSHINA_BOND_UI.pullLabel, locale)}
            strainLabel={pick(KUSHINA_BOND_UI.strainLabel, locale)}
            breakLabel={pick(KUSHINA_BOND_UI.breakLabel, locale)}
            keyboardHint={pick(KUSHINA_BOND_UI.keyboardHint, locale)}
            railAlt={pick(KUSHINA_BOND_UI.railAlt, locale)}
            statusTaut={pick(KUSHINA_BOND_UI.statusTaut, locale)}
            statusBroken={pick(KUSHINA_BOND_UI.statusBroken, locale)}
          />
          {isAdmin ? (
            <div className={styles.slotRow}>
              {KUSHINA_BONDS.map((bond) => (
                <CuratorSlot
                  key={bond.imageKey}
                  characterId={KUSHINA_ID}
                  slot="ABILITY"
                  abilityName={bond.imageKey}
                  label={pick(KUSHINA_SLOT_LABELS[bond.imageKey], locale)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 6 · YİRMİ DÖRT YILIN BEŞ DURAĞI ════════════════════════════ */}
        <section className={styles.section} aria-labelledby="kus-fate">
          <header className={styles.sectionHead}>
            <h2 id="kus-fate" className={styles.sectionTitle}>
              {pick(KUSHINA_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KUSHINA_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {KUSHINA_TIMELINE.map((entry) => {
              const scene = src(entry.imageKey);
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
                    {scene ? (
                      <Image src={scene} alt="" fill sizes="560px" />
                    ) : null}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={KUSHINA_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(KUSHINA_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 7 · SON SÖZLER ═════════════════════════════════════════════
            Sayfanın en geniş, en sakin bloğu. Konuşma KESİLMİYOR: araya
            görsel, kart, rakam ya da başlık girmiyor; tek bir sütun,
            tek bir ses. Zemin görseli varsa çok düşük opaklıkta. */}
        <section className={styles.lastWords} aria-labelledby="kus-lastwords">
          {lastWordsArt ? (
            <span className={styles.lastWordsArt} aria-hidden>
              <Image src={lastWordsArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}
          <header className={styles.lastWordsHead}>
            <h2 id="kus-lastwords" className={styles.lastWordsTitle}>
              {pick(KUSHINA_SECTIONS.lastWords.title, locale)}
            </h2>
            <p className={styles.lastWordsLede}>
              {pick(KUSHINA_SECTIONS.lastWords.lede, locale)}
            </p>
            <p className={styles.lastWordsIntro}>
              {pick(KUSHINA_LAST_WORDS.intro, locale)}
            </p>
          </header>

          <figure className={styles.speech}>
            <blockquote className={styles.speechBody}>
              {KUSHINA_LAST_WORDS.paragraphs.map((paragraph) => (
                <p key={paragraph.tr} className={styles.speechLine}>
                  {pick(paragraph, locale)}
                </p>
              ))}
            </blockquote>
            <figcaption className={styles.speechBy}>
              {`${pick(KUSHINA_LAST_WORDS.by, locale)} — ${pick(KUSHINA_LAST_WORDS.toWhom, locale)}`}
            </figcaption>
          </figure>

          <figure className={styles.coda}>
            <blockquote>
              &ldquo;{pick(KUSHINA_LAST_WORDS.coda.text, locale)}&rdquo;
            </blockquote>
            <figcaption>
              <span className={styles.codaBy}>
                {pick(KUSHINA_LAST_WORDS.coda.by, locale)}
              </span>
              <span className={styles.codaNote}>
                {pick(KUSHINA_LAST_WORDS.coda.note, locale)}
              </span>
            </figcaption>
          </figure>

          <p className={styles.speechSource}>
            {pick(KUSHINA_LAST_WORDS.source, locale)}
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={KUSHINA_ID}
                slot="ABILITY"
                abilityName={KUSHINA_IMAGE_KEYS.lastWords}
                label={pick(
                  KUSHINA_SLOT_LABELS[KUSHINA_IMAGE_KEYS.lastWords],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 8 · KAPANIŞ ════════════════════════════════════════════════
            Bilerek küçük tutuldu: sayfanın tepe noktası bir üstteki
            konuşma; buradaki iki replik onunla yarışmıyor, künyeyi ve
            kaynağı taşıyor. */}
        <section className={styles.closing} aria-labelledby="kus-closing">
          <h2 id="kus-closing" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}

          <ul className={styles.closingQuotes}>
            {KUSHINA_CLOSING.quotes.map((quote) => (
              <li key={quote.text.tr}>
                <figure className={styles.closingQuote}>
                  <blockquote>
                    &ldquo;{pick(quote.text, locale)}&rdquo;
                  </blockquote>
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
            {KUSHINA_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(KUSHINA_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(KUSHINA_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(KUSHINA_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={KUSHINA_ID}
                slot="ABILITY"
                abilityName={KUSHINA_IMAGE_KEYS.closing}
                label={pick(
                  KUSHINA_SLOT_LABELS[KUSHINA_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </HabaneroShell>
  );
}
