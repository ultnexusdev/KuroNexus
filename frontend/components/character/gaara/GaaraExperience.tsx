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
  GAARA_AI,
  GAARA_ALT,
  GAARA_CLOSING,
  GAARA_COMPANIONS,
  GAARA_CRUMB,
  GAARA_HERO,
  GAARA_ID,
  GAARA_IDENTITY,
  GAARA_IMAGE_KEYS,
  GAARA_KIT,
  GAARA_LAYERS,
  GAARA_SECTIONS,
  GAARA_SHUKAKU_TEXT,
  GAARA_SITE_URL,
  GAARA_SLOT_LABELS,
  GAARA_STRATA_UI,
  GAARA_TECHNIQUES,
  GAARA_TIMELINE,
} from "@/lib/characters/gaara-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { ShukakuShell } from "./ShukakuShell";
import { SandStrata } from "./SandStrata";
import { AiKanji, DesertHorizon, SandGrains } from "./SandGlyphs";
import styles from "./GaaraExperience.module.css";

/**
 * Gaara — "Mutlak Savunma — ve Kimin İçin" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/1662 bu bileşene dallanır
 * (rota dosyasındaki `EXPERIENCES` haritası). Sayfanın fikri tek cümle:
 * KATMAN. Gaara'nın savunması üst üste binmiş beş tabaka ve sayfa da öyle
 * kurulu — kesit, birikimli aydınlanma, sonra tek bir kırmızı harf.
 *
 * Sayfa ikiye bölünüyor: 愛 bölümüne kadar "mutlak savunma", ondan sonra
 * "kimin için". Kırmızı (`--accent`) yalnızca o harfte ve tek tük kritik
 * vurguda var; geri kalan her şey kum rengi.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   ShukakuShell — "Shukaku" modu (tek boolean, etkinin tamamı CSS'te)
 *   SandStrata   — beş tabakalı kesit (sekme + klavye + birikimli yanma)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 1662 kaydının ABILITY yuvaları (`gaara:*`).
 * Hiçbiri zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır.
 */
export function GaaraExperience({
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
  const heroScene = src(GAARA_IMAGE_KEYS.hero);
  const aiScene = src(GAARA_IMAGE_KEYS.ai);
  const closingArt = src(GAARA_IMAGE_KEYS.closing);

  const name = detail.character.name || GAARA_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? GAARA_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? GAARA_SITE_URL;

  const layers = GAARA_LAYERS.map((layer) => ({
    key: layer.key,
    kanji: layer.kanji,
    name: layer.name,
    turkish: pick(layer.turkish, locale),
    tag: pick(layer.tag, locale),
    text: pick(layer.text, locale),
    cost: pick(layer.cost, locale),
    image: src(layer.imageKey),
  }));

  return (
    <ShukakuShell
      enterLabel={pick(GAARA_SHUKAKU_TEXT.enter, locale)}
      exitLabel={pick(GAARA_SHUKAKU_TEXT.exit, locale)}
      hint={pick(GAARA_SHUKAKU_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(GAARA_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO — ÇÖL UFKU ═════════════════════════════════════════
            Arkada iki eğri hat (uzak sırt + yakın tepe), portrenin
            kenarlarından savrulan taneler, üstte dev 我愛羅 filigranı. */}
        <section className={styles.hero} aria-labelledby="gaa-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}
          <DesertHorizon
            className={styles.horizon}
            ridgeClassName={styles.ridge}
          />

          <p className={styles.heroMark} aria-hidden>
            {GAARA_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <p className={styles.heroVillage}>
              {pick(GAARA_IDENTITY.village, locale)}
            </p>
            <h1 id="gaa-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {nativeName}
            </p>
            <p className={styles.heroEpithet}>
              {pick(GAARA_IDENTITY.epithet, locale)}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(GAARA_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(GAARA_HERO.lede, locale)}</p>
          </div>

          <div className={styles.heroAside}>
            <span className={styles.portraitWrap}>
              {portrait ? (
                <span className={styles.heroPortrait}>
                  <Image
                    src={portrait}
                    alt={pick(
                      portraitUploaded
                        ? GAARA_HERO.portraitAlt
                        : GAARA_HERO.portraitAltFallback,
                      locale,
                    )}
                    fill
                    sizes="360px"
                    priority
                    unoptimized={!portraitUploaded}
                  />
                </span>
              ) : null}
              {/* Taneler portrenin İKİ kenarından da savruluyor */}
              <SandGrains
                className={styles.grains}
                grainClassName={styles.grain}
              />
            </span>
            <p className={styles.horizonCaption}>
              {pick(GAARA_HERO.horizonCaption, locale)}
            </p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={GAARA_ID}
                slot="ABILITY"
                abilityName={GAARA_IMAGE_KEYS.hero}
                label={pick(GAARA_SLOT_LABELS[GAARA_IMAGE_KEYS.hero], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="gaa-identity">
          <header className={styles.sectionHead}>
            <h2 id="gaa-identity" className={styles.sectionTitle}>
              {pick(GAARA_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(GAARA_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {GAARA_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · KUM KATMANLARI — SAYFANIN KALBİ ════════════════════════ */}
        <section className={styles.strataSection} aria-labelledby="gaa-strata">
          <header className={styles.sectionHead}>
            <h2 id="gaa-strata" className={styles.sectionTitle}>
              {pick(GAARA_SECTIONS.strata.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(GAARA_SECTIONS.strata.lede, locale)}
            </p>
          </header>
          <SandStrata
            layers={layers}
            listLabel={pick(GAARA_STRATA_UI.listLabel, locale)}
            layerWord={pick(GAARA_STRATA_UI.layerWord, locale)}
            costLabel={pick(GAARA_STRATA_UI.costLabel, locale)}
            litLabel={pick(GAARA_STRATA_UI.litLabel, locale)}
            keyboardHint={pick(GAARA_STRATA_UI.keyboardHint, locale)}
            sectionAlt={pick(GAARA_STRATA_UI.sectionAlt, locale)}
          />
          {isAdmin ? (
            <div className={styles.slotRow}>
              {GAARA_LAYERS.map((layer) => (
                <CuratorSlot
                  key={layer.imageKey}
                  characterId={GAARA_ID}
                  slot="ABILITY"
                  abilityName={layer.imageKey}
                  label={pick(GAARA_SLOT_LABELS[layer.imageKey], locale)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 4 · KUMUN GRAMERİ — üç büyük ═══════════════════════════════ */}
        <section className={styles.section} aria-labelledby="gaa-lab">
          <header className={styles.sectionHead}>
            <h2 id="gaa-lab" className={styles.sectionTitle}>
              {pick(GAARA_SECTIONS.lab.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(GAARA_SECTIONS.lab.lede, locale)}
            </p>
          </header>
          <ul className={styles.forms}>
            {GAARA_TECHNIQUES.map((form) => {
              const art = src(form.imageKey);
              return (
                <li key={form.key} className={styles.form}>
                  <span className={styles.formArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="720px" /> : null}
                  </span>
                  <span className={styles.formKanji} aria-hidden>
                    {form.kanji}
                  </span>
                  <span className={styles.formBody}>
                    <span className={styles.formName}>{form.name}</span>
                    <span className={styles.formTurkish}>
                      {pick(form.turkish, locale)}
                    </span>
                    <span className={styles.formTagline}>
                      {pick(form.tagline, locale)}
                    </span>
                    <span className={styles.formText}>
                      {pick(form.text, locale)}
                    </span>
                    <span className={styles.formTraits}>
                      {form.traits.map((trait) => (
                        <span key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={GAARA_ID}
                      slot="ABILITY"
                      abilityName={form.imageKey}
                      label={pick(GAARA_SLOT_LABELS[form.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · TAŞIDIKLARI — dört küçük ═══════════════════════════════ */}
        <section className={styles.section} aria-labelledby="gaa-kit">
          <header className={styles.sectionHead}>
            <h2 id="gaa-kit" className={styles.sectionTitle}>
              {pick(GAARA_SECTIONS.kit.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(GAARA_SECTIONS.kit.lede, locale)}
            </p>
          </header>
          <ul className={styles.kit}>
            {GAARA_KIT.map((item) => {
              const art = src(item.imageKey);
              return (
                <li key={item.key} className={styles.kitItem}>
                  <span className={styles.kitArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="480px" /> : null}
                  </span>
                  <span className={styles.kitName}>{pick(item.name, locale)}</span>
                  <span className={styles.kitNote}>{pick(item.note, locale)}</span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={GAARA_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(GAARA_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 6 · 愛 — SAYFANIN MENTEŞESİ ════════════════════════════════
            Buraya kadar "mutlak savunma", buradan sonra "kimin için".
            Sayfadaki TEK kırmızı kütle bu harf. */}
        <section className={styles.aiSection} aria-labelledby="gaa-ai">
          {aiScene ? (
            <span className={styles.aiScene} aria-hidden>
              <Image src={aiScene} alt="" fill sizes="1440px" />
            </span>
          ) : null}
          <h2 id="gaa-ai" className={styles.aiTitle}>
            {pick(GAARA_SECTIONS.ai.title, locale)}
          </h2>
          <AiKanji
            className={styles.aiGlyph}
            strokeClassName={styles.aiStroke}
            grooveClassName={styles.aiGroove}
            title={pick(GAARA_AI.glyphLabel, locale)}
          />
          <div className={styles.aiLines}>
            <p className={styles.aiLine}>{pick(GAARA_AI.firstLine, locale)}</p>
            <p className={styles.aiLine}>{pick(GAARA_AI.secondLine, locale)}</p>
          </div>
          <p className={styles.aiFootnote}>{pick(GAARA_AI.footnote, locale)}</p>
          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={GAARA_ID}
                slot="ABILITY"
                abilityName={GAARA_IMAGE_KEYS.ai}
                label={pick(GAARA_SLOT_LABELS[GAARA_IMAGE_KEYS.ai], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 7 · KİMİN İÇİN — dört portre ═══════════════════════════════ */}
        <section className={styles.section} aria-labelledby="gaa-forwhom">
          <header className={styles.sectionHead}>
            <h2 id="gaa-forwhom" className={styles.sectionTitle}>
              {pick(GAARA_SECTIONS.forWhom.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(GAARA_SECTIONS.forWhom.lede, locale)}
            </p>
          </header>
          <ul className={styles.people}>
            {GAARA_COMPANIONS.map((person) => {
              const face = faces.get(person.characterId) ?? null;
              const linked = isExperienceCharacter(person.characterId);
              return (
                <li
                  key={person.characterId}
                  className={styles.person}
                  data-distance={person.distance}
                >
                  <span className={styles.personArt}>
                    {face ? (
                      <Image
                        src={face}
                        alt={`${person.name} ${pick(GAARA_ALT.companionSuffix, locale)}`}
                        fill
                        sizes="240px"
                      />
                    ) : null}
                  </span>
                  <span className={styles.personBody}>
                    <span className={styles.personRole}>
                      {pick(person.role, locale)}
                    </span>
                    <span className={styles.personName}>
                      {linked ? (
                        <Link href={animeHref.character(person.characterId)}>
                          {person.name}
                        </Link>
                      ) : (
                        person.name
                      )}
                    </span>
                    <span className={styles.personNote}>
                      {pick(person.note, locale)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 8 · KADER ÇİZELGESİ ════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="gaa-fate">
          <header className={styles.sectionHead}>
            <h2 id="gaa-fate" className={styles.sectionTitle}>
              {pick(GAARA_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(GAARA_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {GAARA_TIMELINE.map((entry) => {
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
                          &ldquo;{pick(entry.quote.text, locale)}&rdquo;
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
                      characterId={GAARA_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(GAARA_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 9 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="gaa-closing">
          <h2 id="gaa-closing" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}
          {GAARA_CLOSING.quotes.map((quote) => (
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
            {GAARA_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(GAARA_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(GAARA_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(GAARA_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={GAARA_ID}
                slot="ABILITY"
                abilityName={GAARA_IMAGE_KEYS.closing}
                label={pick(
                  GAARA_SLOT_LABELS[GAARA_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </ShukakuShell>
  );
}
