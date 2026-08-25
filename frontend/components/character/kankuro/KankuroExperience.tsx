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
  KANKURO_ALT,
  KANKURO_CHEST_UI,
  KANKURO_CLOSING,
  KANKURO_CRAFT,
  KANKURO_CRUMB,
  KANKURO_HERO,
  KANKURO_ID,
  KANKURO_IDENTITY,
  KANKURO_IMAGE_KEYS,
  KANKURO_MODE_TEXT,
  KANKURO_POISON,
  KANKURO_PUPPETS,
  KANKURO_SECTIONS,
  KANKURO_SITE_URL,
  KANKURO_SLOT_LABELS,
  KANKURO_STRINGS,
  KANKURO_TIMELINE,
  KANKURO_TOOLS,
} from "@/lib/characters/kankuro-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { StringRig } from "./StringRig";
import { PuppetChest } from "./PuppetChest";
import {
  KumadoriChart,
  PoisonTable,
  PuppetSilhouette,
  StringKnot,
  ToolGlyph,
} from "./KankuroGlyphs";
import styles from "./KankuroExperience.module.css";

/**
 * Kankurō — "Kukla Sandığı" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/4694 bu bileşene dallanır.
 * Sayfanın fikri tek cümle: BU SAYFA YUKARIDAN ASILI. Üst kenardan inen
 * ince ipler bütün bölümleri geçip sahnedeki dört kuklaya bağlanıyor; kukla
 * seçilince o ipin gerilimi artıyor ve gövde eklem eklem ayrılıp içindeki
 * gizli silahları gösteriyor. Açılan bir kap değil, dağılan bir beden.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var (BRIEF §8: en fazla üç):
 *   StringRig   — "İpler sende değil" modu (tek boolean, etkinin tamamı CSS)
 *   PuppetChest — dört kuklalık sahne (sekme + klavye + açılan şema)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 4694 kaydının ABILITY yuvaları (`kankuro:*`).
 * Hiçbiri zorunlu değil — yuva boşken bölüm görselsiz ama AYAKTA kalır.
 * Kankurō'nun arşivde tam boy portresi yok; kapak portresi AniList'in ~230
 * piksellik künye görseli, bu yüzden dar bir kadrajda kullanılıyor ve büyük
 * bir kutuya yayılmıyor (BRIEF §4.1).
 */
export function KankuroExperience({
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
  const heroScene = src(KANKURO_IMAGE_KEYS.hero);
  const closingArt = src(KANKURO_IMAGE_KEYS.closing);

  /* Başlıkta AniList'in makronsuz "Kankuro"su değil arşivin yazımı var —
     gerekçe veri dosyasının başındaki AD YAZIMI notunda. */
  const name = KANKURO_IDENTITY.name;
  const nativeName =
    detail.character.nameNative ?? KANKURO_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? KANKURO_SITE_URL;

  const puppets = KANKURO_PUPPETS.map((puppet) => ({
    key: puppet.key,
    kanji: puppet.kanji,
    name: puppet.name,
    turkish: pick(puppet.turkish, locale),
    role: pick(puppet.role, locale),
    maker: pick(puppet.maker, locale),
    summary: pick(puppet.summary, locale),
    figureAlt: pick(puppet.figureAlt, locale),
    image: src(puppet.imageKey),
    weapons: puppet.weapons.map((weapon) => ({
      name: pick(weapon.name, locale),
      note: pick(weapon.note, locale),
    })),
  }));

  return (
    <StringRig
      enterLabel={pick(KANKURO_MODE_TEXT.enter, locale)}
      exitLabel={pick(KANKURO_MODE_TEXT.exit, locale)}
      hint={pick(KANKURO_MODE_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(KANKURO_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO — LAKE GÖVDE, DAR PORTRE, KUMADORI PLANI ═══════════
            Portre küçük ve bilerek dar: AniList künye görseli ~230 piksel,
            büyük kutuya yayılırsa dağılır. Kadrajı taşıyan şey tipografi ve
            arkadaki lake kukla gövdesi. */}
        <section className={styles.hero} aria-labelledby="kan-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <PuppetSilhouette className={styles.heroSilhouette} />

          <p className={styles.heroMark} aria-hidden>
            {KANKURO_IDENTITY.watermark}
          </p>

          <div className={styles.heroText}>
            <h1 id="kan-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative}>
              <span aria-hidden>{nativeName}</span>
              <span className={styles.heroAttribution}>
                {pick(KANKURO_IDENTITY.attribution, locale)}
              </span>
            </p>
            <p className={styles.heroEpigraph}>
              {pick(KANKURO_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(KANKURO_HERO.lede, locale)}</p>
          </div>

          <div className={styles.heroAside}>
            {portrait ? (
              <span className={styles.heroPortrait}>
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? KANKURO_HERO.portraitAlt
                      : KANKURO_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="260px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              </span>
            ) : null}

            {/* Kumadori planı: portrenin üstüne bindirilmiyor, yanına
                asılıyor. Kılavuz çizgiler CSS'te. */}
            <figure className={styles.kumadori}>
              <KumadoriChart
                className={styles.kumadoriChart}
                lineClassName={styles.kumadoriLine}
                title={pick(KANKURO_HERO.kumadoriChartAlt, locale)}
              />
              <figcaption className={styles.kumadoriCaption}>
                <span className={styles.kumadoriTitle}>
                  {pick(KANKURO_HERO.kumadoriTitle, locale)}
                  <span aria-hidden>{KANKURO_HERO.kumadoriNative}</span>
                </span>
                <span className={styles.kumadoriNote}>
                  {pick(KANKURO_HERO.kumadoriNote, locale)}
                </span>
              </figcaption>
            </figure>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={KANKURO_ID}
                slot="ABILITY"
                abilityName={KANKURO_IMAGE_KEYS.hero}
                label={pick(
                  KANKURO_SLOT_LABELS[KANKURO_IMAGE_KEYS.hero],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="kan-identity">
          <header className={styles.sectionHead}>
            <h2 id="kan-identity" className={styles.sectionTitle}>
              {pick(KANKURO_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KANKURO_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {KANKURO_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · ATÖLYE — üç büyük tezgâh, dört alet ════════════════════ */}
        <section className={styles.section} aria-labelledby="kan-workshop">
          <header className={styles.sectionHead}>
            <h2 id="kan-workshop" className={styles.sectionTitle}>
              {pick(KANKURO_SECTIONS.workshop.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KANKURO_SECTIONS.workshop.lede, locale)}
            </p>
          </header>

          <ul className={styles.benches}>
            {KANKURO_CRAFT.map((entry) => {
              const art = src(entry.imageKey);
              return (
                <li key={entry.key} className={styles.bench}>
                  <span className={styles.benchArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="720px" /> : null}
                  </span>
                  <span className={styles.benchKanji} aria-hidden>
                    {entry.kanji}
                  </span>
                  <span className={styles.benchBody}>
                    <span className={styles.benchName}>{entry.name}</span>
                    <span className={styles.benchTurkish}>
                      {pick(entry.turkish, locale)}
                    </span>
                    <span className={styles.benchTagline}>
                      {pick(entry.tagline, locale)}
                    </span>
                    <span className={styles.benchText}>
                      {pick(entry.text, locale)}
                    </span>
                    {"call" in entry ? (
                      <span className={styles.benchCall}>
                        <span className={styles.benchCallKanji} aria-hidden>
                          {entry.call.text}
                        </span>
                        <span className={styles.benchCallRomaji}>
                          {entry.call.romaji}
                        </span>
                      </span>
                    ) : null}
                    <span className={styles.benchTraits}>
                      {entry.traits.map((trait) => (
                        <span key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={KANKURO_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(KANKURO_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>

          <ul className={styles.tools}>
            {KANKURO_TOOLS.map((tool) => {
              const art = src(tool.imageKey);
              return (
                <li key={tool.key} className={styles.tool}>
                  <span className={styles.toolArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="420px" /> : null}
                  </span>
                  <ToolGlyph kind={tool.glyph} className={styles.toolGlyph} />
                  <span className={styles.toolName}>
                    {pick(tool.name, locale)}
                  </span>
                  <span className={styles.toolNote}>
                    {pick(tool.note, locale)}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={KANKURO_ID}
                      slot="ABILITY"
                      abilityName={tool.imageKey}
                      label={pick(KANKURO_SLOT_LABELS[tool.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · KUKLA SANDIĞI — SAYFANIN KALBİ ════════════════════════ */}
        <section className={styles.chestSection} aria-labelledby="kan-chest">
          <header className={styles.sectionHead}>
            <h2 id="kan-chest" className={styles.sectionTitle}>
              {pick(KANKURO_SECTIONS.chest.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KANKURO_SECTIONS.chest.lede, locale)}
            </p>
          </header>

          <PuppetChest
            puppets={puppets}
            listLabel={pick(KANKURO_CHEST_UI.listLabel, locale)}
            roleLabel={pick(KANKURO_CHEST_UI.roleLabel, locale)}
            makerLabel={pick(KANKURO_CHEST_UI.makerLabel, locale)}
            weaponsLabel={pick(KANKURO_CHEST_UI.weaponsLabel, locale)}
            tautLabel={pick(KANKURO_CHEST_UI.tautLabel, locale)}
            slackLabel={pick(KANKURO_CHEST_UI.slackLabel, locale)}
            keyboardHint={pick(KANKURO_CHEST_UI.keyboardHint, locale)}
          />

          {isAdmin ? (
            <div className={styles.slotRow}>
              {KANKURO_PUPPETS.map((puppet) => (
                <CuratorSlot
                  key={puppet.imageKey}
                  characterId={KANKURO_ID}
                  slot="ABILITY"
                  abilityName={puppet.imageKey}
                  label={pick(KANKURO_SLOT_LABELS[puppet.imageKey], locale)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 5 · ZEHİR MASASI ══════════════════════════════════════════ */}
        <section className={styles.poison} aria-labelledby="kan-poison">
          <header className={styles.sectionHead}>
            <h2 id="kan-poison" className={styles.sectionTitle}>
              {pick(KANKURO_SECTIONS.poison.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KANKURO_SECTIONS.poison.lede, locale)}
            </p>
          </header>

          <PoisonTable
            className={styles.poisonPlate}
            coatClassName={styles.poisonCoat}
            title={pick(KANKURO_POISON.bladeAlt, locale)}
          />

          <div className={styles.vials}>
            {KANKURO_POISON.vials.map((vial) => {
              const art = src(vial.imageKey);
              return (
                <article
                  key={vial.key}
                  className={styles.vial}
                  data-vial={vial.key}
                >
                  <span className={styles.vialArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="520px" /> : null}
                  </span>
                  <span className={styles.vialKanji} aria-hidden>
                    {vial.kanji}
                  </span>
                  <h3 className={styles.vialLabel}>{pick(vial.label, locale)}</h3>
                  <p className={styles.vialBy}>{pick(vial.by, locale)}</p>
                  <p className={styles.vialText}>{pick(vial.text, locale)}</p>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={KANKURO_ID}
                      slot="ABILITY"
                      abilityName={vial.imageKey}
                      label={pick(KANKURO_SLOT_LABELS[vial.imageKey], locale)}
                    />
                  ) : null}
                </article>
              );
            })}
          </div>

          <p className={styles.poisonClosing}>
            {pick(KANKURO_POISON.closingLine, locale)}
          </p>
        </section>

        {/* ══ 6 · ÖBÜR UÇTAKİ ELLER ═════════════════════════════════════
            Sahnedeki dört kuklanın tersi: burada portreler ÜSTTE, ipler
            onlardan aşağı iniyor. Kankurō'yu tutan uçlar. */}
        <section className={styles.section} aria-labelledby="kan-strings">
          <header className={styles.sectionHead}>
            <h2 id="kan-strings" className={styles.sectionTitle}>
              {pick(KANKURO_SECTIONS.strings.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KANKURO_SECTIONS.strings.lede, locale)}
            </p>
          </header>

          <ul className={styles.hands}>
            {KANKURO_STRINGS.map((person) => {
              const face = faces.get(person.characterId) ?? null;
              const linked = isExperienceCharacter(person.characterId);
              const inner = (
                <>
                  <span className={styles.handFace}>
                    {face ? (
                      <Image
                        src={face}
                        alt={`${person.name} ${pick(KANKURO_ALT.companionSuffix, locale)}`}
                        fill
                        sizes="220px"
                      />
                    ) : null}
                  </span>
                  <span className={styles.handBody}>
                    <span className={styles.handRole}>
                      {pick(person.role, locale)}
                    </span>
                    <span className={styles.handName}>{person.name}</span>
                    <span className={styles.handNote}>
                      {pick(person.note, locale)}
                    </span>
                  </span>
                </>
              );
              return (
                <li key={person.characterId} className={styles.hand}>
                  <StringKnot className={styles.handKnot} />
                  {linked ? (
                    <Link
                      href={animeHref.character(person.characterId)}
                      className={styles.handLink}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <span className={styles.handStatic}>{inner}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 7 · KADER ÇİZELGESİ ═══════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="kan-fate">
          <header className={styles.sectionHead}>
            <h2 id="kan-fate" className={styles.sectionTitle}>
              {pick(KANKURO_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KANKURO_SECTIONS.fate.lede, locale)}
            </p>
          </header>

          <ol className={styles.fate}>
            {KANKURO_TIMELINE.map((entry) => {
              const art = src(entry.imageKey);
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
                          <span className={styles.quoteKanji} aria-hidden>
                            {entry.quote.text}
                          </span>
                          <span className={styles.quoteRomaji}>
                            {entry.quote.romaji}
                          </span>
                        </blockquote>
                        <figcaption>{pick(entry.quote.by, locale)}</figcaption>
                      </figure>
                    ) : null}
                  </div>
                  <span className={styles.fateArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="560px" /> : null}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={KANKURO_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(KANKURO_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 8 · KAPANIŞ ═══════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="kan-closing">
          <h2 id="kan-closing" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}

          {KANKURO_CLOSING.quotes.map((quote) => (
            <figure key={quote.romaji} className={styles.closingQuote}>
              <blockquote>
                <span className={styles.quoteKanji} aria-hidden>
                  {quote.text}
                </span>
                <span className={styles.quoteRomaji}>{quote.romaji}</span>
                <span className={styles.quoteGloss}>
                  {pick(quote.gloss, locale)}
                </span>
              </blockquote>
              <figcaption>
                <span className={styles.quoteBy}>{pick(quote.by, locale)}</span>
                <span className={styles.quoteNote}>
                  {pick(quote.note, locale)}
                </span>
              </figcaption>
            </figure>
          ))}

          <p className={styles.motto} aria-hidden>
            {KANKURO_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(KANKURO_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(KANKURO_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(KANKURO_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={KANKURO_ID}
                slot="ABILITY"
                abilityName={KANKURO_IMAGE_KEYS.closing}
                label={pick(
                  KANKURO_SLOT_LABELS[KANKURO_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </StringRig>
  );
}
