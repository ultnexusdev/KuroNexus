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
  OROCHIMARU_ALT,
  OROCHIMARU_CLOSING,
  OROCHIMARU_CRUMB,
  OROCHIMARU_HERO,
  OROCHIMARU_ID,
  OROCHIMARU_IDENTITY,
  OROCHIMARU_IMAGE_KEYS,
  OROCHIMARU_JUTSU,
  OROCHIMARU_MARGIN,
  OROCHIMARU_SECTIONS,
  OROCHIMARU_SERPENT_TEXT,
  OROCHIMARU_SHED_UI,
  OROCHIMARU_SHELF_UI,
  OROCHIMARU_SITE_URL,
  OROCHIMARU_SKINS,
  OROCHIMARU_SLOT_LABELS,
  OROCHIMARU_TIMELINE,
  OROCHIMARU_TUBES,
} from "@/lib/characters/orochimaru-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { SerpentShell } from "./SerpentShell";
import { ShedStack } from "./ShedStack";
import { MoltRing, SerpentCoil, SerpentEyes, TestTube } from "./OrochimaruGlyphs";
import styles from "./OrochimaruExperience.module.css";

/**
 * Orochimaru — "Deri Değiştirme" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/2455 bu bileşene çıkıyor. Sayfanın
 * fikri tek cümle: bu ömür yıllarla değil BEDENLERLE ölçülüyor. Sayfanın
 * kalbi üst üste binmiş beş deri; ikinci yapısal fikir laboratuvar camı,
 * beş tüpte beş merak. Tezi de o raf söylüyor — onu tehlikeli yapan zulüm
 * değil, hiçbir cevapta durmayan merak.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   SerpentShell — "Yılan modu" (tek boolean, etkinin tamamı CSS'te)
 *   ShedStack    — beş derinin yığını (menteşeden açılma + klavye)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 2455 kaydının ABILITY yuvaları (`orochimaru:*`).
 * Hiçbiri zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır;
 * kıvrım, gözler, tüpler ve deriler zaten elle çizilmiş SVG.
 */
export function OrochimaruExperience({
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
  const heroScene = src(OROCHIMARU_IMAGE_KEYS.hero);
  const closingArt = src(OROCHIMARU_IMAGE_KEYS.closing);

  const name = detail.character.name || OROCHIMARU_IDENTITY.name;
  const nativeName =
    detail.character.nameNative ?? OROCHIMARU_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? OROCHIMARU_SITE_URL;

  const skins = OROCHIMARU_SKINS.map((skin) => ({
    key: skin.key,
    ordinal: pick(skin.ordinal, locale),
    name: pick(skin.name, locale),
    held: pick(skin.held, locale),
    shed: pick(skin.shed, locale),
    text: pick(skin.text, locale),
    image: src(skin.imageKey),
    witness: skin.witness
      ? {
          name: skin.witness.name,
          note: pick(skin.witness.note, locale),
          portrait: faces.get(skin.witness.characterId) ?? null,
        }
      : null,
  }));

  return (
    <SerpentShell
      enterLabel={pick(OROCHIMARU_SERPENT_TEXT.enter, locale)}
      exitLabel={pick(OROCHIMARU_SERPENT_TEXT.exit, locale)}
      hint={pick(OROCHIMARU_SERPENT_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(OROCHIMARU_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO — KIVRIM VE İKİ GÖZ ═══════════════════════════════
            Portre dar kadrajda ve gri; kıvrılan gövde onun arkasında,
            sayfanın tek renkli noktası da gözler. */}
        <section className={styles.hero} aria-labelledby="oro-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <SerpentCoil
            className={styles.heroCoil}
            bodyClassName={styles.coilBody}
            ribClassName={styles.coilRibs}
          />

          <p className={styles.heroMark} aria-hidden>
            {OROCHIMARU_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <h1 id="oro-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {nativeName}
            </p>
            <p className={styles.heroAffiliation}>
              {pick(OROCHIMARU_IDENTITY.affiliation, locale)}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(OROCHIMARU_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>
              {pick(OROCHIMARU_HERO.lede, locale)}
            </p>
          </div>

          <div className={styles.heroAside}>
            {portrait ? (
              <span className={styles.heroPortrait}>
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? OROCHIMARU_HERO.portraitAlt
                      : OROCHIMARU_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="360px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              </span>
            ) : null}
            <SerpentEyes className={styles.heroEyes} />
            <p className={styles.heroEyesCaption}>
              {pick(OROCHIMARU_HERO.eyesCaption, locale)}
            </p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={OROCHIMARU_ID}
                slot="ABILITY"
                abilityName={OROCHIMARU_IMAGE_KEYS.hero}
                label={pick(
                  OROCHIMARU_SLOT_LABELS[OROCHIMARU_IMAGE_KEYS.hero],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KAYIT — numune künyesi ═════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="oro-record">
          <header className={styles.sectionHead}>
            <h2 id="oro-record" className={styles.sectionTitle}>
              {pick(OROCHIMARU_SECTIONS.record.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(OROCHIMARU_SECTIONS.record.lede, locale)}
            </p>
          </header>
          <div className={styles.recordPlate}>
            <p className={styles.recordStamp} aria-hidden>
              № {OROCHIMARU_ID}
            </p>
            <dl className={styles.facts}>
              {OROCHIMARU_IDENTITY.facts.map((fact) => (
                <div key={fact.label.tr} className={styles.fact}>
                  <dt>{pick(fact.label, locale)}</dt>
                  <dd>{pick(fact.value, locale)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ══ 3 · RAFTAKİ BEŞ MERAK — laboratuvar camı ═══════════════════
            Beş tüp, beş soru. Sıvı seviyesi "ne kadarını gerçekten aldı"
            demek; en boş tüp sayfanın tezini taşıyor. */}
        <section className={styles.shelfSection} aria-labelledby="oro-shelf">
          <header className={styles.sectionHead}>
            <h2 id="oro-shelf" className={styles.sectionTitle}>
              {pick(OROCHIMARU_SECTIONS.shelf.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(OROCHIMARU_SECTIONS.shelf.lede, locale)}
            </p>
          </header>
          <ul
            className={styles.rack}
            role="img"
            aria-label={pick(OROCHIMARU_SHELF_UI.rackAlt, locale)}
          >
            {OROCHIMARU_TUBES.map((tube) => (
              <li key={tube.key} className={styles.tube}>
                <TestTube
                  level={tube.level}
                  className={styles.tubeGlass}
                  glassClassName={styles.glass}
                  liquidClassName={styles.liquid}
                  bubbleClassName={styles.bubbles}
                />
                <div className={styles.tubeBody}>
                  <h3 className={styles.tubeName}>{pick(tube.name, locale)}</h3>
                  <p className={styles.tubeNote}>{pick(tube.note, locale)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ══ 4 · ÜÇ TEKNİK, ÜÇ İHLAL ════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="oro-lab">
          <header className={styles.sectionHead}>
            <h2 id="oro-lab" className={styles.sectionTitle}>
              {pick(OROCHIMARU_SECTIONS.lab.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(OROCHIMARU_SECTIONS.lab.lede, locale)}
            </p>
          </header>
          <ul className={styles.works}>
            {OROCHIMARU_JUTSU.map((jutsu) => {
              const art = src(jutsu.imageKey);
              return (
                <li key={jutsu.key} className={styles.work}>
                  <span className={styles.workArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="900px" /> : null}
                  </span>
                  <span className={styles.workKanji} aria-hidden>
                    {jutsu.kanji}
                  </span>
                  <span className={styles.workBody}>
                    <span className={styles.workName}>{jutsu.name}</span>
                    <span className={styles.workTurkish}>
                      {pick(jutsu.turkish, locale)}
                    </span>
                    <span className={styles.workTagline}>
                      {pick(jutsu.tagline, locale)}
                    </span>
                    <span className={styles.workText}>
                      {pick(jutsu.text, locale)}
                    </span>
                    <span className={styles.workTraits}>
                      {jutsu.traits.map((trait) => (
                        <span key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={OROCHIMARU_ID}
                      slot="ABILITY"
                      abilityName={jutsu.imageKey}
                      label={pick(OROCHIMARU_SLOT_LABELS[jutsu.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · DEFTERİN KENARI — dört küçük kayıt ═════════════════════ */}
        <section className={styles.section} aria-labelledby="oro-margin">
          <header className={styles.sectionHead}>
            <h2 id="oro-margin" className={styles.sectionTitle}>
              {pick(OROCHIMARU_SECTIONS.margin.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(OROCHIMARU_SECTIONS.margin.lede, locale)}
            </p>
          </header>
          <ul className={styles.notes}>
            {OROCHIMARU_MARGIN.map((entry) => {
              const art = src(entry.imageKey);
              return (
                <li key={entry.key} className={styles.note}>
                  <span className={styles.noteArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="520px" /> : null}
                  </span>
                  <span className={styles.noteHead}>
                    <span className={styles.noteName}>
                      {pick(entry.name, locale)}
                    </span>
                    {entry.kanji ? (
                      <span className={styles.noteKanji} aria-hidden>
                        {entry.kanji}
                      </span>
                    ) : null}
                  </span>
                  <span className={styles.noteText}>
                    {pick(entry.note, locale)}
                  </span>
                  {entry.companions ? (
                    <span className={styles.noteFaces}>
                      {entry.companions.map((person) => {
                        const face = faces.get(person.characterId) ?? null;
                        return (
                          <span key={person.characterId} className={styles.noteFace}>
                            {face ? (
                              <Image
                                src={face}
                                alt={`${person.name} ${pick(OROCHIMARU_ALT.companionSuffix, locale)}`}
                                fill
                                sizes="72px"
                              />
                            ) : null}
                            <span className={styles.noteFaceName}>
                              {person.name}
                            </span>
                          </span>
                        );
                      })}
                    </span>
                  ) : null}
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={OROCHIMARU_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(OROCHIMARU_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 6 · DÖKÜLEN DERİLER — SAYFANIN KALBİ ══════════════════════ */}
        <section className={styles.shedSection} aria-labelledby="oro-shed">
          <header className={styles.sectionHead}>
            <h2 id="oro-shed" className={styles.sectionTitle}>
              {pick(OROCHIMARU_SECTIONS.shed.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(OROCHIMARU_SECTIONS.shed.lede, locale)}
            </p>
          </header>
          <ShedStack
            skins={skins}
            listLabel={pick(OROCHIMARU_SHED_UI.listLabel, locale)}
            stackAlt={pick(OROCHIMARU_SHED_UI.stackAlt, locale)}
            heldLabel={pick(OROCHIMARU_SHED_UI.heldLabel, locale)}
            shedLabel={pick(OROCHIMARU_SHED_UI.shedLabel, locale)}
            witnessLabel={pick(OROCHIMARU_SHED_UI.witnessLabel, locale)}
            newestLabel={pick(OROCHIMARU_SHED_UI.newest, locale)}
            oldestLabel={pick(OROCHIMARU_SHED_UI.oldest, locale)}
            prevLabel={pick(OROCHIMARU_SHED_UI.prev, locale)}
            nextLabel={pick(OROCHIMARU_SHED_UI.next, locale)}
            keyboardHint={pick(OROCHIMARU_SHED_UI.keyboardHint, locale)}
          />
          {isAdmin ? (
            <div className={styles.slotRow}>
              {OROCHIMARU_SKINS.map((skin) => (
                <CuratorSlot
                  key={skin.imageKey}
                  characterId={OROCHIMARU_ID}
                  slot="ABILITY"
                  abilityName={skin.imageKey}
                  label={pick(OROCHIMARU_SLOT_LABELS[skin.imageKey], locale)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 7 · BEŞ DÖNEMEÇ ════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="oro-fate">
          <header className={styles.sectionHead}>
            <h2 id="oro-fate" className={styles.sectionTitle}>
              {pick(OROCHIMARU_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(OROCHIMARU_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {OROCHIMARU_TIMELINE.map((entry) => {
              const art = src(entry.imageKey);
              return (
                <li key={entry.key} className={styles.fateItem}>
                  <MoltRing className={styles.fateRing} />
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
                    <span className={styles.fateArt} aria-hidden>
                      {art ? <Image src={art} alt="" fill sizes="620px" /> : null}
                    </span>
                  </div>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={OROCHIMARU_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(OROCHIMARU_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 8 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="oro-closing">
          <h2 id="oro-closing" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}
          {OROCHIMARU_CLOSING.quotes.map((quote) => (
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
            {OROCHIMARU_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(OROCHIMARU_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(OROCHIMARU_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(OROCHIMARU_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={OROCHIMARU_ID}
                slot="ABILITY"
                abilityName={OROCHIMARU_IMAGE_KEYS.closing}
                label={pick(
                  OROCHIMARU_SLOT_LABELS[OROCHIMARU_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </SerpentShell>
  );
}
