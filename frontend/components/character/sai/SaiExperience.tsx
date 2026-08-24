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
  SAI_ALT,
  SAI_CLOSING,
  SAI_CRUMB,
  SAI_FIGURES,
  SAI_ID,
  SAI_IDENTITY,
  SAI_IMAGE_KEYS,
  SAI_JUTSU,
  SAI_KIT,
  SAI_LEXICON,
  SAI_LEXICON_UI,
  SAI_PEOPLE,
  SAI_SCROLL_UI,
  SAI_SECTIONS,
  SAI_SITE_URL,
  SAI_SLOT_LABELS,
  SAI_SUMI_TEXT,
  SAI_TIMELINE,
} from "@/lib/characters/sai-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { SumiShell } from "./SumiShell";
import { InkScroll } from "./InkScroll";
import { BrushSeal, BrushStrokes, InkBlot } from "./InkFigures";
import styles from "./SaiExperience.module.css";

/**
 * Sai — "Mürekkep ve Duygu" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/1901 bu bileşene dallanır
 * (rota dosyasındaki harita). Sayfanın fikri tek cümle: RENKSİZLİK.
 * On beş kardeşinin en renksizi bilinçli olarak bu sayfa — palet neredeyse
 * siyah-beyaz, accent bile bir kâğıt kremi. Tek sıcak nokta mühür kızılı
 * (`--sai-seal`) ve o da sayaç gibi kullanılıyor: bir çizim canlandığında
 * kâğıda basılıyor, Sumi modunda griye düşüyor.
 *
 * Sayfada IŞIK yalnızca iki yerde: canlanan çizim tomarı ve duygu
 * sözlüğünün kâğıt fişleri. İkisi de Sai'nin kendi ürettiği/okuduğu
 * şeyler; geri kalan her şey karanlık odada duruyor. Bu ayrım tasarımın
 * omurgası, süs değil.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var (BRIEF §8 sınırı üç):
 *   SumiShell — "Sumi modu" (tek boolean, etkinin tamamı CSS)
 *   InkScroll — beş duraklı tomar (sekme + klavye + çizim animasyonu)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 1901 kaydının ABILITY yuvaları (`sai:*`). Hiçbiri
 * zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır. Sayfadaki
 * bütün grafik (leke, fırça darbeleri, mühür, beş hayvan) elle çizilmiş
 * SVG; dışarıdan tek raster görsel gelmiyor (BRIEF §4.4).
 */
export function SaiExperience({
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
  const heroScene = src(SAI_IMAGE_KEYS.hero);
  const closingArt = src(SAI_IMAGE_KEYS.closing);

  const name = detail.character.name || SAI_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? SAI_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? SAI_SITE_URL;

  const figures = SAI_FIGURES.map((figure) => ({
    key: figure.key,
    glyph: figure.glyph,
    name: pick(figure.name, locale),
    alt: pick(figure.alt, locale),
    drew: pick(figure.drew, locale),
    purpose: pick(figure.purpose, locale),
    image: src(figure.imageKey),
  }));

  return (
    <SumiShell
      enterLabel={pick(SAI_SUMI_TEXT.enter, locale)}
      exitLabel={pick(SAI_SUMI_TEXT.exit, locale)}
      hint={pick(SAI_SUMI_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>{pick(SAI_CRUMB.naruto, locale)}</Link>
        </nav>

        {/* ══ 1 · HERO — LEKE VE AD ═══════════════════════════════════════
            Portre lekenin İÇİNDEN çıkıyor: önce mürekkep, sonra figür.
            Filigran 根 (kök) sağ kenarda dikey, adın ölçüsünden büyük. */}
        <section className={styles.hero} aria-labelledby="sai-name">
          <div className={styles.heroArt}>
            <InkBlot className={styles.blot} />
            <BrushStrokes className={styles.strokes} />
            {heroScene ? (
              <span className={styles.heroScene}>
                <Image src={heroScene} alt="" fill priority sizes="900px" />
              </span>
            ) : null}
            {portrait ? (
              <span className={styles.heroPortrait}>
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded ? SAI_ALT.portrait : SAI_ALT.portraitFallback,
                    locale,
                  )}
                  fill
                  sizes="360px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              </span>
            ) : null}
          </div>

          <p className={styles.heroMark} aria-hidden>
            {SAI_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <h1 id="sai-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative}>
              <span className={styles.heroNativeText} aria-hidden>
                {nativeName}
              </span>
              <BrushSeal className={styles.heroSeal} />
            </p>
            <p className={styles.heroDivision}>
              {pick(SAI_IDENTITY.division, locale)}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(SAI_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(SAI_IDENTITY.lede, locale)}</p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={SAI_ID}
                slot="ABILITY"
                abilityName={SAI_IMAGE_KEYS.hero}
                label={pick(SAI_SLOT_LABELS[SAI_IMAGE_KEYS.hero], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KAYIT (KÜNYE) ══════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="sai-record">
          <header className={styles.sectionHead}>
            <div className={styles.sectionHeadText}>
              <h2 id="sai-record" className={styles.sectionTitle}>
                {pick(SAI_SECTIONS.identity.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(SAI_SECTIONS.identity.lede, locale)}
              </p>
            </div>
            <p className={styles.sectionGlyph} aria-hidden>
              {SAI_SECTIONS.identity.glyph}
            </p>
          </header>
          <dl className={styles.facts}>
            {SAI_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · ADLARINI ÖĞRENDİĞİ YÜZLER ══════════════════════════════
            Portre kaydı olmayan kişi de çizilir: kart adla ayakta kalır. */}
        <section className={styles.section} aria-labelledby="sai-names">
          <header className={styles.sectionHead}>
            <div className={styles.sectionHeadText}>
              <h2 id="sai-names" className={styles.sectionTitle}>
                {pick(SAI_SECTIONS.names.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(SAI_SECTIONS.names.lede, locale)}
              </p>
            </div>
            <p className={styles.sectionGlyph} aria-hidden>
              {SAI_SECTIONS.names.glyph}
            </p>
          </header>
          <ul className={styles.people}>
            {SAI_PEOPLE.map((person) => {
              const face = faces.get(person.characterId) ?? null;
              const linked = isExperienceCharacter(person.characterId);
              const body = (
                <>
                  <span className={styles.personArt}>
                    {face ? (
                      <Image
                        src={face}
                        alt={`${person.name} ${pick(SAI_ALT.personSuffix, locale)}`}
                        fill
                        sizes="240px"
                      />
                    ) : null}
                  </span>
                  <span className={styles.personBody}>
                    <span className={styles.personCallsign}>
                      {pick(person.callsign, locale)}
                    </span>
                    <span className={styles.personName}>{person.name}</span>
                    <span className={styles.personNote}>
                      {pick(person.note, locale)}
                    </span>
                  </span>
                </>
              );
              return (
                <li
                  key={person.characterId}
                  className={styles.person}
                  data-side={person.side}
                >
                  {linked ? (
                    <Link
                      className={styles.personLink}
                      href={animeHref.character(person.characterId)}
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className={styles.personLink} data-static="true">
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · MÜREKKEBİN ÜÇ ÖLÇEĞİ ═══════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="sai-jutsu">
          <header className={styles.sectionHead}>
            <div className={styles.sectionHeadText}>
              <h2 id="sai-jutsu" className={styles.sectionTitle}>
                {pick(SAI_SECTIONS.jutsu.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(SAI_SECTIONS.jutsu.lede, locale)}
              </p>
            </div>
            <p className={styles.sectionGlyph} aria-hidden>
              {SAI_SECTIONS.jutsu.glyph}
            </p>
          </header>
          <ul className={styles.forms}>
            {SAI_JUTSU.map((jutsu) => {
              const key = SAI_IMAGE_KEYS[jutsu.key];
              const art = src(key);
              return (
                <li key={jutsu.key} className={styles.form}>
                  <span className={styles.formGlyph} aria-hidden>
                    {jutsu.glyph}
                  </span>
                  <span className={styles.formBody}>
                    <span className={styles.formName}>{jutsu.name}</span>
                    <span className={styles.formTurkish}>
                      {pick(jutsu.turkish, locale)}
                    </span>
                    <span className={styles.formTagline}>
                      {pick(jutsu.tagline, locale)}
                    </span>
                    <span className={styles.formText}>
                      {pick(jutsu.text, locale)}
                    </span>
                    <span className={styles.formTraits}>
                      {jutsu.traits.map((trait) => (
                        <span key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className={styles.formArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="520px" /> : null}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={SAI_ID}
                      slot="ABILITY"
                      abilityName={key}
                      label={pick(SAI_SLOT_LABELS[key], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · ÇANTANIN İÇİ ═══════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="sai-kit">
          <header className={styles.sectionHead}>
            <div className={styles.sectionHeadText}>
              <h2 id="sai-kit" className={styles.sectionTitle}>
                {pick(SAI_SECTIONS.kit.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(SAI_SECTIONS.kit.lede, locale)}
              </p>
            </div>
            <p className={styles.sectionGlyph} aria-hidden>
              {SAI_SECTIONS.kit.glyph}
            </p>
          </header>
          <ul className={styles.kit}>
            {SAI_KIT.map((item) => {
              const art = src(item.imageKey);
              return (
                <li key={item.key} className={styles.kitItem}>
                  <span className={styles.kitArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="420px" /> : null}
                  </span>
                  <span className={styles.kitGlyph} aria-hidden>
                    {item.glyph}
                  </span>
                  <span className={styles.kitName}>{pick(item.name, locale)}</span>
                  <span className={styles.kitNote}>{pick(item.note, locale)}</span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={SAI_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(SAI_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 6 · CANLANAN ÇİZİM — SAYFANIN KALBİ ════════════════════════ */}
        <section className={styles.scrollSection} aria-labelledby="sai-scroll">
          <header className={styles.sectionHead}>
            <div className={styles.sectionHeadText}>
              <h2 id="sai-scroll" className={styles.sectionTitle}>
                {pick(SAI_SECTIONS.scroll.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(SAI_SECTIONS.scroll.lede, locale)}
              </p>
            </div>
            <p className={styles.sectionGlyph} aria-hidden>
              {SAI_SECTIONS.scroll.glyph}
            </p>
          </header>
          <InkScroll
            figures={figures}
            listLabel={pick(SAI_SCROLL_UI.listLabel, locale)}
            stepWord={pick(SAI_SCROLL_UI.stepWord, locale)}
            prevLabel={pick(SAI_SCROLL_UI.prev, locale)}
            nextLabel={pick(SAI_SCROLL_UI.next, locale)}
            drewLabel={pick(SAI_SCROLL_UI.drewLabel, locale)}
            purposeLabel={pick(SAI_SCROLL_UI.purposeLabel, locale)}
            keyboardHint={pick(SAI_SCROLL_UI.keyboardHint, locale)}
            sealLabel={pick(SAI_SCROLL_UI.sealLabel, locale)}
          />
          {isAdmin ? (
            <div className={styles.slotRow}>
              {SAI_FIGURES.map((figure) => (
                <CuratorSlot
                  key={figure.imageKey}
                  characterId={SAI_ID}
                  slot="ABILITY"
                  abilityName={figure.imageKey}
                  label={pick(SAI_SLOT_LABELS[figure.imageKey], locale)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 7 · DUYGU SÖZLÜĞÜ — SAYFANIN DUYGUSAL MERKEZİ ══════════════
            Kâğıt fişler: sayfanın ikinci ve son ışıklı yüzeyi. Her fişte
            Kök'ün tarifi ile karşılığın gerçekte ne çıktığı yan yana. */}
        <section className={styles.lexiconSection} aria-labelledby="sai-lexicon">
          <header className={styles.sectionHead}>
            <div className={styles.sectionHeadText}>
              <h2 id="sai-lexicon" className={styles.sectionTitle}>
                {pick(SAI_SECTIONS.lexicon.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(SAI_SECTIONS.lexicon.lede, locale)}
              </p>
            </div>
            <p className={styles.sectionGlyph} aria-hidden>
              {SAI_SECTIONS.lexicon.glyph}
            </p>
          </header>
          <ul className={styles.lexicon}>
            {SAI_LEXICON.map((entry) => (
              <li key={entry.key} className={styles.slip}>
                <p className={styles.slipHead}>
                  <span className={styles.slipGlyph} aria-hidden>
                    {entry.glyph}
                  </span>
                  <span className={styles.slipNames}>
                    <span className={styles.slipName}>
                      {pick(entry.name, locale)}
                    </span>
                    <span className={styles.slipReading}>{entry.reading}</span>
                  </span>
                </p>
                <div className={styles.slipBlock}>
                  <p className={styles.slipLabel}>
                    {pick(SAI_LEXICON_UI.taughtLabel, locale)}
                  </p>
                  <p className={styles.slipTaught}>{pick(entry.taught, locale)}</p>
                </div>
                <div className={styles.slipBlock} data-kind="learned">
                  <p className={styles.slipLabel}>
                    {pick(SAI_LEXICON_UI.learnedLabel, locale)}
                  </p>
                  <p className={styles.slipLearned}>
                    {pick(entry.learned, locale)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ══ 8 · KADER ÇİZELGESİ ════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="sai-fate">
          <header className={styles.sectionHead}>
            <div className={styles.sectionHeadText}>
              <h2 id="sai-fate" className={styles.sectionTitle}>
                {pick(SAI_SECTIONS.fate.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(SAI_SECTIONS.fate.lede, locale)}
              </p>
            </div>
            <p className={styles.sectionGlyph} aria-hidden>
              {SAI_SECTIONS.fate.glyph}
            </p>
          </header>
          <ol className={styles.fate}>
            {SAI_TIMELINE.map((entry) => {
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
                        <blockquote>{pick(entry.quote.text, locale)}</blockquote>
                        <figcaption>{pick(entry.quote.by, locale)}</figcaption>
                      </figure>
                    ) : null}
                    <span className={styles.fateArt} aria-hidden>
                      {art ? <Image src={art} alt="" fill sizes="520px" /> : null}
                    </span>
                  </div>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={SAI_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(SAI_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 9 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="sai-closing">
          <h2 id="sai-closing" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1280px" />
            </span>
          ) : null}
          {SAI_CLOSING.quotes.map((quote) => (
            <figure key={quote.by.tr} className={styles.closingQuote}>
              <blockquote>&ldquo;{pick(quote.text, locale)}&rdquo;</blockquote>
              <figcaption>
                <span className={styles.quoteBy}>{pick(quote.by, locale)}</span>
                <span className={styles.quoteNote}>{pick(quote.note, locale)}</span>
              </figcaption>
            </figure>
          ))}

          <p className={styles.motto} aria-hidden>
            {SAI_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(SAI_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(SAI_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(SAI_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={SAI_ID}
                slot="ABILITY"
                abilityName={SAI_IMAGE_KEYS.closing}
                label={pick(SAI_SLOT_LABELS[SAI_IMAGE_KEYS.closing], locale)}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </SumiShell>
  );
}
