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
  TEMARI_ALT,
  TEMARI_BONDS,
  TEMARI_CLOSING,
  TEMARI_CRUMB,
  TEMARI_FAN_UI,
  TEMARI_HERO,
  TEMARI_ID,
  TEMARI_IDENTITY,
  TEMARI_IMAGE_KEYS,
  TEMARI_JUTSU,
  TEMARI_KIT,
  TEMARI_MODE,
  TEMARI_SECTIONS,
  TEMARI_SITE_URL,
  TEMARI_SLOT_LABELS,
  TEMARI_STARS,
  TEMARI_TIMELINE,
} from "@/lib/characters/temari-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { KamaitachiShell } from "./KamaitachiShell";
import { FanArc } from "./FanArc";
import { FanSilhouette, GustField } from "./TemariGlyphs";
import styles from "./TemariExperience.module.css";

/**
 * Temari — "Üç Yıldız" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/2174 bu bileşene dallanır (rota
 * dosyasındaki `EXPERIENCES` haritası). Sayfanın fikri tek cümle: ÖLÇÜ.
 * Temari'nin gücü ne kadar rüzgâr çağırabildiği değil, ne kadarını
 * çağırmaya karar verdiği — ve o karar yelpazesinin üstünde üç mor yıldız
 * olarak yazılı. Sayfanın kalbi de o: yay açıldıkça yıldızlar görünür,
 * kesikler çizilir, metin savrulan yöne kayar.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   KamaitachiShell — "Kamaitachi" modu (tek boolean, etkinin tamamı CSS)
 *   FanArc          — açılan yelpaze (üç kademe + klavye + elle çizilmiş şema)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 2174 kaydının ABILITY yuvaları (`temari:*`).
 * Hiçbiri zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır.
 */
export function TemariExperience({
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
  const heroScene = src(TEMARI_IMAGE_KEYS.hero);
  const siblingScene = src(TEMARI_IMAGE_KEYS.siblings);
  const closingArt = src(TEMARI_IMAGE_KEYS.closing);

  const name = detail.character.name || TEMARI_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? TEMARI_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? TEMARI_SITE_URL;

  const stages = TEMARI_STARS.map((stage) => ({
    key: stage.key,
    stars: stage.stars,
    title: pick(stage.title, locale),
    call: stage.call,
    opens: pick(stage.opens, locale),
    measure: pick(stage.measure, locale),
    image: src(stage.imageKey),
  }));

  return (
    <KamaitachiShell
      enterLabel={pick(TEMARI_MODE.enter, locale)}
      exitLabel={pick(TEMARI_MODE.exit, locale)}
      hint={pick(TEMARI_MODE.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(TEMARI_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO — ÇÖL VE SİLUET ════════════════════════════════════
            Arkada tam açık yelpazenin çizgi silueti (aşağıdaki şemayla aynı
            geometri), önünde savrulan kum, solda dev 風. Portre dar kadraj
            ve kenarda: gövde tipografinin. */}
        <section className={styles.hero} aria-labelledby="tem-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <FanSilhouette className={styles.heroFan} />
          <GustField className={styles.heroGust} lineClassName={styles.gustLine} />

          <p className={styles.heroMark} aria-hidden>
            {TEMARI_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <h1 id="tem-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroLine}>
              <span className={styles.heroNative} lang="ja">
                {nativeName}
              </span>
              <span className={styles.heroDot} aria-hidden>
                ·
              </span>
              <span className={styles.heroHouse}>
                {pick(TEMARI_IDENTITY.house, locale)}
              </span>
            </p>
            <p className={styles.heroEpigraph}>
              {pick(TEMARI_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(TEMARI_HERO.lede, locale)}</p>
          </div>

          <div className={styles.heroAside}>
            {portrait ? (
              <span className={styles.heroPortrait}>
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? TEMARI_HERO.portraitAlt
                      : TEMARI_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="360px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              </span>
            ) : null}
            <p className={styles.heroPortraitNote}>
              {pick(TEMARI_HERO.portraitNote, locale)}
            </p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={TEMARI_ID}
                slot="ABILITY"
                abilityName={TEMARI_IMAGE_KEYS.hero}
                label={pick(TEMARI_SLOT_LABELS[TEMARI_IMAGE_KEYS.hero], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ═══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="tem-identity">
          <header className={styles.sectionHead}>
            <h2 id="tem-identity" className={styles.sectionTitle}>
              {pick(TEMARI_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(TEMARI_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <div className={styles.sectionBody}>
            <dl className={styles.facts}>
              {TEMARI_IDENTITY.facts.map((fact) => (
                <div key={fact.label.tr} className={styles.fact}>
                  <dt>{pick(fact.label, locale)}</dt>
                  <dd>{pick(fact.value, locale)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ══ 3 · ABLANIN İŞİ ═════════════════════════════════════════════
            Kartlar değil kayıtlar: her bağ bir satır, portresi yelpaze
            dilimine kırpılmış. Kendi sayfası olan karakterin adı bağlantı. */}
        <section className={styles.section} aria-labelledby="tem-siblings">
          <header className={styles.sectionHead}>
            <h2 id="tem-siblings" className={styles.sectionTitle}>
              {pick(TEMARI_SECTIONS.siblings.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(TEMARI_SECTIONS.siblings.lede, locale)}
            </p>
          </header>
          <div className={styles.sectionBody}>
            {siblingScene ? (
              <span className={styles.siblingScene} aria-hidden>
                <Image src={siblingScene} alt="" fill sizes="960px" />
              </span>
            ) : null}
            <ul className={styles.bonds}>
              {TEMARI_BONDS.map((bond) => {
                const face = faces.get(bond.characterId) ?? null;
                const linked = isExperienceCharacter(bond.characterId);
                return (
                  <li key={bond.characterId} className={styles.bond}>
                    <span className={styles.bondArt}>
                      {face ? (
                        <Image
                          src={face}
                          alt={`${bond.name} ${pick(TEMARI_ALT.bondSuffix, locale)}`}
                          fill
                          sizes="200px"
                        />
                      ) : null}
                    </span>
                    <span className={styles.bondBody}>
                      <span className={styles.bondRole}>
                        {pick(bond.role, locale)}
                      </span>
                      <span className={styles.bondName}>
                        {linked ? (
                          <Link href={animeHref.character(bond.characterId)}>
                            {bond.name}
                          </Link>
                        ) : (
                          bond.name
                        )}
                      </span>
                      <span className={styles.bondNote}>
                        {pick(bond.note, locale)}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
            {isAdmin ? (
              <div className={styles.slotRow}>
                <CuratorSlot
                  characterId={TEMARI_ID}
                  slot="ABILITY"
                  abilityName={TEMARI_IMAGE_KEYS.siblings}
                  label={pick(
                    TEMARI_SLOT_LABELS[TEMARI_IMAGE_KEYS.siblings],
                    locale,
                  )}
                />
              </div>
            ) : null}
          </div>
        </section>

        {/* ══ 4 · RÜZGÂRIN ÜÇ ÖLÇÜSÜ — üç büyük ═══════════════════════════ */}
        <section className={styles.section} aria-labelledby="tem-jutsu">
          <header className={styles.sectionHead}>
            <h2 id="tem-jutsu" className={styles.sectionTitle}>
              {pick(TEMARI_SECTIONS.jutsu.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(TEMARI_SECTIONS.jutsu.lede, locale)}
            </p>
          </header>
          <div className={styles.sectionBody}>
            <ul className={styles.forms}>
              {TEMARI_JUTSU.map((jutsu) => {
                const key = TEMARI_IMAGE_KEYS[jutsu.key];
                const art = src(key);
                return (
                  <li key={jutsu.key} className={styles.form}>
                    <span className={styles.formArt} aria-hidden>
                      {art ? <Image src={art} alt="" fill sizes="720px" /> : null}
                    </span>
                    <div className={styles.formBody}>
                      {/* Kanji adın ARKASINDA: negatif margin ile üst üste
                          biniyorlar, ad fırça izinin üstüne yazılmış gibi */}
                      <p className={styles.formKanji} aria-hidden lang="ja">
                        {jutsu.kanji}
                      </p>
                      <h3 className={styles.formName}>{jutsu.name}</h3>
                      <p className={styles.formTurkish}>
                        {pick(jutsu.turkish, locale)}
                      </p>
                      <p className={styles.formTagline}>
                        {pick(jutsu.tagline, locale)}
                      </p>
                      <p className={styles.formText}>{pick(jutsu.text, locale)}</p>
                      <p className={styles.formTraits}>
                        {jutsu.traits.map((trait) => (
                          <span key={trait.tr} className={styles.trait}>
                            {pick(trait, locale)}
                          </span>
                        ))}
                      </p>
                    </div>
                    {isAdmin ? (
                      <CuratorSlot
                        characterId={TEMARI_ID}
                        slot="ABILITY"
                        abilityName={key}
                        label={pick(TEMARI_SLOT_LABELS[key], locale)}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ══ 5 · YANINDA TAŞIDIKLARI — dört küçük ════════════════════════ */}
        <section className={styles.section} aria-labelledby="tem-kit">
          <header className={styles.sectionHead}>
            <h2 id="tem-kit" className={styles.sectionTitle}>
              {pick(TEMARI_SECTIONS.kit.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(TEMARI_SECTIONS.kit.lede, locale)}
            </p>
          </header>
          <div className={styles.sectionBody}>
            <ul className={styles.kit}>
              {TEMARI_KIT.map((item) => {
                const art = src(item.imageKey);
                return (
                  <li key={item.key} className={styles.kitItem}>
                    <span className={styles.kitArt} aria-hidden>
                      {art ? <Image src={art} alt="" fill sizes="480px" /> : null}
                    </span>
                    <h3 className={styles.kitName}>{pick(item.name, locale)}</h3>
                    <p className={styles.kitNote}>{pick(item.note, locale)}</p>
                    {isAdmin ? (
                      <CuratorSlot
                        characterId={TEMARI_ID}
                        slot="ABILITY"
                        abilityName={item.imageKey}
                        label={pick(TEMARI_SLOT_LABELS[item.imageKey], locale)}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ══ 6 · ÜÇ YILDIZ — SAYFANIN KALBİ ══════════════════════════════ */}
        <section className={styles.fanSection} aria-labelledby="tem-fan">
          <header className={styles.sectionHead}>
            <h2 id="tem-fan" className={styles.sectionTitle}>
              {pick(TEMARI_SECTIONS.fan.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(TEMARI_SECTIONS.fan.lede, locale)}
            </p>
          </header>
          <FanArc
            stages={stages}
            listLabel={pick(TEMARI_FAN_UI.listLabel, locale)}
            starWord={pick(TEMARI_FAN_UI.starWord, locale)}
            openLabel={pick(TEMARI_FAN_UI.openLabel, locale)}
            foldLabel={pick(TEMARI_FAN_UI.foldLabel, locale)}
            opensLabel={pick(TEMARI_FAN_UI.opensLabel, locale)}
            measureLabel={pick(TEMARI_FAN_UI.measureLabel, locale)}
            callLabel={pick(TEMARI_FAN_UI.callLabel, locale)}
            keyboardHint={pick(TEMARI_FAN_UI.keyboardHint, locale)}
            fanAlt={pick(TEMARI_FAN_UI.fanAlt, locale)}
          />
          {isAdmin ? (
            <div className={styles.slotRow}>
              {TEMARI_STARS.map((stage) => (
                <CuratorSlot
                  key={stage.imageKey}
                  characterId={TEMARI_ID}
                  slot="ABILITY"
                  abilityName={stage.imageKey}
                  label={pick(TEMARI_SLOT_LABELS[stage.imageKey], locale)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 7 · YELPAZENİN AÇILDIĞI BEŞ YER ═════════════════════════════ */}
        <section className={styles.section} aria-labelledby="tem-fate">
          <header className={styles.sectionHead}>
            <h2 id="tem-fate" className={styles.sectionTitle}>
              {pick(TEMARI_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(TEMARI_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <div className={styles.sectionBody}>
            <ol className={styles.fate}>
              {TEMARI_TIMELINE.map((entry) => {
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
                        characterId={TEMARI_ID}
                        slot="ABILITY"
                        abilityName={entry.imageKey}
                        label={pick(TEMARI_SLOT_LABELS[entry.imageKey], locale)}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ══ 8 · KAPANIŞ ═════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="tem-closing">
          <h2 id="tem-closing" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}

          {TEMARI_CLOSING.lines.map((line) => (
            <figure key={line.text.tr} className={styles.closingQuote}>
              <blockquote>{pick(line.text, locale)}</blockquote>
              <figcaption>
                <span className={styles.quoteBy}>{pick(line.by, locale)}</span>
                <span className={styles.quoteNote}>{pick(line.note, locale)}</span>
              </figcaption>
            </figure>
          ))}

          <p className={styles.motto} aria-hidden lang="ja">
            {TEMARI_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(TEMARI_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(TEMARI_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(TEMARI_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={TEMARI_ID}
                slot="ABILITY"
                abilityName={TEMARI_IMAGE_KEYS.closing}
                label={pick(
                  TEMARI_SLOT_LABELS[TEMARI_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </KamaitachiShell>
  );
}
