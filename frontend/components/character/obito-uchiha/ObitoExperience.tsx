import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { animeHref } from "@/lib/anime/routes";
import { pick, type LocalizedText } from "@/lib/characters/types";
import {
  collectAbilityImages,
  companionPortraits,
  isExperienceCharacter,
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import {
  OBITO_ALT,
  OBITO_CLOSING,
  OBITO_CRUMB,
  OBITO_FALL_TEXT,
  OBITO_HERO,
  OBITO_ID,
  OBITO_IDENTITY,
  OBITO_IMAGE_KEYS,
  OBITO_KANNABI,
  OBITO_LAB_UI,
  OBITO_LAYERS,
  OBITO_MINOR,
  OBITO_SECTIONS,
  OBITO_SITE_URL,
  OBITO_SLOT_LABELS,
  OBITO_STACK_UI,
  OBITO_TECHNIQUES,
  OBITO_TIMELINE,
  OBITO_VOICES,
  OBITO_WITNESSES,
  type VoiceText,
} from "@/lib/characters/obito-uchiha-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { MaskShell } from "./MaskShell";
import { NameStack } from "./NameStack";
import { KamuiShatter, RubbleField, ScarWeb } from "./ObitoGlyphs";
import styles from "./ObitoExperience.module.css";

/**
 * Obito Uchiha — "Maskenin Ardındaki İsim" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/3149 bu bileşene dallanır.
 * Sayfanın fikri tek cümle: BİR ADIN SOYULMASI. Ziyaretçi dört ad
 * katmanından birini seçiyor; maske o oranda çözülüyor, altındaki yüz
 * açılıyor ve sayfanın DİLİ o adın ağzına geçiyor.
 *
 * ── DÖRT SESLİ METİN NEDEN SUNUCUDA ──────────────────────────────────────
 * Beş bölümün başlığı ve giriş cümlesi dört ayrı sesle yazıldı. Dördü de
 * burada, sunucuda çiziliyor; hangisinin görüneceğine kökteki `data-voice`
 * niteliğiyle CSS karar veriyor (`display: none`). Böylece metin
 * değiştirmek için tarayıcıya tek satır JS inmiyor ve `display: none`
 * erişilebilirlik ağacından da çıkardığı için ekran okuyucu tek başlık
 * duyuyor — `aria-labelledby` hedefi ise hep aynı `<h2>` düğümü.
 *
 * ── ADIN KAYNAĞI ─────────────────────────────────────────────────────────
 * `detail.character.name` BİLEREK kullanılmıyor: AniList bu numarayı
 * "Tobi" adıyla, yani maskesiyle kaydetmiş. Sayfa gerçek adı taşıyor,
 * AniList'in adı da künye şeridinde ayrı bir satır olarak duruyor.
 *
 * ── İSTEMCİ ADALARI (iki tane) ───────────────────────────────────────────
 * MaskShell — kök; `voice` ve `fallen` durumlarını tutar, ikisi de yalnızca
 *             bir nitelik yazar.
 * NameStack — ad yığını; bağlamı kökten alır, klavyeyle gezilir.
 * Geri kalan her şey sunucuda çizilir.
 */

/** Dört sesli bir başlık. Görünen tek `<span>` başlığın adını belirler. */
function VoiceSwap({
  field,
  locale,
}: {
  field: VoiceText;
  locale: string;
}) {
  return (
    <>
      {OBITO_VOICES.map((key) => (
        <span key={key} className={styles.voiceSwap} data-voice={key}>
          {pick(field[key], locale)}
        </span>
      ))}
    </>
  );
}

export function ObitoExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const faces = companionPortraits(companions);
  const src = (key: string): string | null => ability.get(key) ?? null;
  const slotLabel = (key: string): string => {
    const label: LocalizedText | undefined = OBITO_SLOT_LABELS[key];
    return label ? pick(label, locale) : key;
  };

  const portrait = primaryPortrait(detail);
  const portraitUploaded = isUploadedPortrait(detail);
  const heroScene = src(OBITO_IMAGE_KEYS.hero);
  const closingArt = src(OBITO_IMAGE_KEYS.closing);

  /* Maskenin altındaki yüz: küratör ayrı bir dar kadraj yükleyebilsin diye
     kendi yuvası var; yoksa kapak portresine düşüyor. İkisi de yoksa
     bölüm karanlık bir alanla ayakta kalıyor. */
  const faceSlot = src(OBITO_IMAGE_KEYS.face);
  const faceSrc = faceSlot ?? portrait;
  const faceUnoptimized = faceSlot ? false : !portraitUploaded;

  const siteUrl = detail.character.siteUrl ?? OBITO_SITE_URL;

  const layers = OBITO_LAYERS.map((layer) => ({
    key: layer.key,
    label: pick(layer.label, locale),
    native: layer.native,
    role: pick(layer.role, locale),
    voice: pick(layer.voice, locale),
    note: pick(layer.note, locale),
  }));

  return (
    <MaskShell
      enterLabel={pick(OBITO_FALL_TEXT.enter, locale)}
      exitLabel={pick(OBITO_FALL_TEXT.exit, locale)}
      hint={pick(OBITO_FALL_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(OBITO_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO ════════════════════════════════════════════════════
            Arkada Kamui girdabı: kare spiralden kopan plakalar, kadrajın
            sağından taşar. Portre dar ve küçük (BRIEF §4.1) — yüzü asıl
            gösteren yer maskenin altı, burası yalnızca arşivin kaydı. */}
        <section className={styles.hero} aria-labelledby="obi-name">
          <KamuiShatter
            className={styles.heroSwirl}
            coilClassName={styles.swirlCoil}
            shardClassName={styles.swirlShards}
          />

          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <p className={styles.heroMark} aria-hidden>
            {OBITO_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <p className={styles.heroClan}>
              {pick(OBITO_IDENTITY.clan, locale)}
            </p>
            <h1 id="obi-name" className={styles.heroName}>
              {OBITO_IDENTITY.name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {OBITO_IDENTITY.nativeName}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(OBITO_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(OBITO_HERO.lede, locale)}</p>
          </div>

          <div className={styles.heroAside}>
            {portrait ? (
              <span className={styles.heroPortrait}>
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? OBITO_HERO.portraitAlt
                      : OBITO_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="320px"
                  priority
                  unoptimized={!portraitUploaded}
                />
                {/* Yara izi ağı portrenin ezilen tarafına biner */}
                <ScarWeb
                  className={styles.heroScar}
                  lineClassName={styles.scarLine}
                />
              </span>
            ) : null}
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={OBITO_ID}
                slot="ABILITY"
                abilityName={OBITO_IMAGE_KEYS.hero}
                label={slotLabel(OBITO_IMAGE_KEYS.hero)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · AD YIĞINI — SAYFANIN KALBİ ══════════════════════════════
            Bu bölümün başlığı BİLEREK dört sesli değil: sayfanın dilini
            değiştiren düğme burada, yani ziyaretçinin tutunacağı sabit
            nokta da burada olmalı. */}
        <section className={styles.stackSection} aria-labelledby="obi-stack">
          <header className={styles.sectionHead}>
            <h2 id="obi-stack" className={styles.sectionTitle}>
              {pick(OBITO_STACK_UI.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(OBITO_STACK_UI.lede, locale)}
            </p>
          </header>

          <NameStack
            layers={layers}
            faceSrc={faceSrc}
            faceAlt={pick(OBITO_ALT.faceAlt, locale)}
            faceUnoptimized={faceUnoptimized}
            maskAlt={pick(OBITO_STACK_UI.maskAlt, locale)}
            listLabel={pick(OBITO_STACK_UI.listLabel, locale)}
            layerWord={pick(OBITO_STACK_UI.layerWord, locale)}
            voiceLabel={pick(OBITO_STACK_UI.voiceLabel, locale)}
            depthLabel={pick(OBITO_STACK_UI.depthLabel, locale)}
            keyboardHint={pick(OBITO_STACK_UI.keyboardHint, locale)}
          />

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={OBITO_ID}
                slot="ABILITY"
                abilityName={OBITO_IMAGE_KEYS.face}
                label={slotLabel(OBITO_IMAGE_KEYS.face)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 3 · KÜNYE ══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="obi-identity">
          <header className={styles.sectionHead}>
            <h2 id="obi-identity" className={styles.sectionTitle}>
              <VoiceSwap field={OBITO_SECTIONS.identity.title} locale={locale} />
            </h2>
            <p className={styles.sectionLede}>
              <VoiceSwap field={OBITO_SECTIONS.identity.lede} locale={locale} />
            </p>
          </header>
          <dl className={styles.facts}>
            {OBITO_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 4 · ADINI BİLENLER ═════════════════════════════════════════
            Her kişi hangi adları duyduğuyla birlikte duruyor; seçili
            katmanı duymayanlar sönüyor. Bölüm bu yüzden dekoratif bir
            yoldaş ızgarası değil, mekaniğin bir parçası. */}
        <section className={styles.section} aria-labelledby="obi-heard">
          <header className={styles.sectionHead}>
            <h2 id="obi-heard" className={styles.sectionTitle}>
              <VoiceSwap field={OBITO_SECTIONS.heard.title} locale={locale} />
            </h2>
            <p className={styles.sectionLede}>
              <VoiceSwap field={OBITO_SECTIONS.heard.lede} locale={locale} />
            </p>
          </header>
          <ul className={styles.witnesses}>
            {OBITO_WITNESSES.map((person) => {
              const face = faces.get(person.characterId) ?? null;
              const linked = isExperienceCharacter(person.characterId);
              const body = (
                <>
                  <span className={styles.witnessArt}>
                    {face ? (
                      <Image
                        src={face}
                        alt={`${person.name} ${pick(OBITO_ALT.companionSuffix, locale)}`}
                        fill
                        sizes="240px"
                      />
                    ) : null}
                  </span>
                  <span className={styles.witnessName}>{person.name}</span>
                  <span className={styles.witnessRole}>
                    {pick(person.role, locale)}
                  </span>
                  <span className={styles.witnessNames} aria-hidden>
                    {OBITO_LAYERS.map((layer) => (
                      <span
                        key={layer.key}
                        className={styles.witnessTick}
                        data-layer={layer.key}
                        data-heard={
                          person.knew.includes(layer.key) ? "true" : undefined
                        }
                      />
                    ))}
                  </span>
                  <span className={styles.witnessNote}>
                    {pick(person.note, locale)}
                  </span>
                </>
              );
              return (
                <li
                  key={person.characterId}
                  className={styles.witness}
                  data-knew={person.knew.join(" ")}
                >
                  {linked ? (
                    <Link
                      href={animeHref.character(person.characterId)}
                      className={styles.witnessLink}
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className={styles.witnessLink}>{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · GÜÇ LABORATUVARI ═══════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="obi-lab">
          <header className={styles.sectionHead}>
            <h2 id="obi-lab" className={styles.sectionTitle}>
              <VoiceSwap field={OBITO_SECTIONS.lab.title} locale={locale} />
            </h2>
            <p className={styles.sectionLede}>
              <VoiceSwap field={OBITO_SECTIONS.lab.lede} locale={locale} />
            </p>
          </header>

          <ul className={styles.techniques}>
            {OBITO_TECHNIQUES.map((technique) => {
              const key = OBITO_IMAGE_KEYS[technique.key];
              const art = src(key);
              return (
                <li key={technique.key} className={styles.technique}>
                  <span className={styles.techniqueArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="760px" /> : null}
                  </span>
                  <span className={styles.techniqueKanji} aria-hidden>
                    {technique.kanji}
                  </span>
                  <span className={styles.techniqueBody}>
                    <span className={styles.techniqueName}>
                      {technique.name}
                    </span>
                    <span className={styles.techniqueTurkish}>
                      {pick(technique.turkish, locale)}
                    </span>
                    <span className={styles.techniqueTagline}>
                      {pick(technique.tagline, locale)}
                    </span>
                    <span className={styles.techniqueText}>
                      {pick(technique.text, locale)}
                    </span>
                    <span className={styles.traits}>
                      {technique.traits.map((trait) => (
                        <span key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={OBITO_ID}
                      slot="ABILITY"
                      abilityName={key}
                      label={slotLabel(key)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>

          <h3 className={styles.minorTitle}>
            {pick(OBITO_LAB_UI.minorTitle, locale)}
          </h3>
          <p className={styles.minorLede}>
            {pick(OBITO_LAB_UI.minorLede, locale)}
          </p>
          <ul className={styles.minors}>
            {OBITO_MINOR.map((item) => {
              const art = src(item.imageKey);
              return (
                <li key={item.key} className={styles.minor}>
                  <span className={styles.minorKanji} aria-hidden>
                    {item.kanji}
                  </span>
                  <span className={styles.minorBody}>
                    <span className={styles.minorName}>{item.name}</span>
                    <span className={styles.minorNote}>
                      {pick(item.note, locale)}
                    </span>
                  </span>
                  <span className={styles.minorArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="320px" /> : null}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={OBITO_ID}
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

        {/* ══ 6 · KANNABİ KÖPRÜSÜ — EZİLEN TARAF ═════════════════════════
            Sayfanın duygusal merkezi. Bölümün üstünde çöken bir kütlenin
            alt yüzü duruyor; metin onun altında, dar bir sütunda. */}
        <section className={styles.kannabi} aria-labelledby="obi-kannabi">
          <RubbleField
            className={styles.rubble}
            chunkClassName={styles.rubbleChunk}
          />

          <header className={styles.sectionHead}>
            <h2 id="obi-kannabi" className={styles.sectionTitle}>
              <VoiceSwap field={OBITO_SECTIONS.kannabi.title} locale={locale} />
            </h2>
            <p className={styles.sectionLede}>
              <VoiceSwap field={OBITO_SECTIONS.kannabi.lede} locale={locale} />
            </p>
          </header>

          <ol className={styles.beats}>
            {OBITO_KANNABI.beats.map((beat) => (
              <li key={beat.key} className={styles.beat}>
                <h3 className={styles.beatLabel}>{pick(beat.label, locale)}</h3>
                <p className={styles.beatText}>{pick(beat.text, locale)}</p>
              </li>
            ))}
          </ol>

          <figure className={styles.kannabiQuote}>
            <blockquote>
              &ldquo;{pick(OBITO_KANNABI.quote.text, locale)}&rdquo;
            </blockquote>
            <figcaption>{pick(OBITO_KANNABI.quote.by, locale)}</figcaption>
          </figure>

          <div className={styles.kannabiPlates}>
            {[OBITO_IMAGE_KEYS.kannabi, OBITO_IMAGE_KEYS.eye].map((key) => {
              const art = src(key);
              if (!art) {
                return null;
              }
              return (
                <span key={key} className={styles.kannabiPlate} aria-hidden>
                  <Image src={art} alt="" fill sizes="620px" />
                </span>
              );
            })}
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              {[OBITO_IMAGE_KEYS.kannabi, OBITO_IMAGE_KEYS.eye].map((key) => (
                <CuratorSlot
                  key={key}
                  characterId={OBITO_ID}
                  slot="ABILITY"
                  abilityName={key}
                  label={slotLabel(key)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 7 · KADER ÇİZELGESİ ════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="obi-fate">
          <header className={styles.sectionHead}>
            <h2 id="obi-fate" className={styles.sectionTitle}>
              <VoiceSwap field={OBITO_SECTIONS.fate.title} locale={locale} />
            </h2>
            <p className={styles.sectionLede}>
              <VoiceSwap field={OBITO_SECTIONS.fate.lede} locale={locale} />
            </p>
          </header>
          <ol className={styles.fate}>
            {OBITO_TIMELINE.map((entry) => {
              const art = src(entry.imageKey);
              return (
                <li key={entry.key} className={styles.fateItem}>
                  <p className={styles.fateAge}>{pick(entry.age, locale)}</p>
                  <div className={styles.fateBody}>
                    <h3 className={styles.fateTitle}>
                      {pick(entry.title, locale)}
                    </h3>
                    <p className={styles.fateText}>{pick(entry.text, locale)}</p>
                  </div>
                  <span className={styles.fateArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="560px" /> : null}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={OBITO_ID}
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

        {/* ══ 8 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="obi-closing">
          <h2 id="obi-closing" className={styles.visuallyHidden}>
            {OBITO_IDENTITY.name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}

          {OBITO_CLOSING.quotes.map((quote) => (
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
            {OBITO_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(OBITO_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(OBITO_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(OBITO_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={OBITO_ID}
                slot="ABILITY"
                abilityName={OBITO_IMAGE_KEYS.closing}
                label={slotLabel(OBITO_IMAGE_KEYS.closing)}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </MaskShell>
  );
}
