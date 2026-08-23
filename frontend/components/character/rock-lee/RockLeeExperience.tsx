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
  LEE_CLOSING,
  LEE_CREDIT,
  LEE_CRUMB,
  LEE_DEATH_WARNING,
  LEE_GATES,
  LEE_GATES_TITLE,
  LEE_HERO,
  LEE_IDENTITY,
  LEE_IMAGE_KEYS,
  LEE_LAB_TITLE,
  LEE_MINOR,
  LEE_MODE,
  LEE_QUOTES,
  LEE_SLOT_LABELS,
  LEE_TALLIES,
  LEE_TECHNIQUES,
  LEE_TIMELINE,
  LEE_TIMELINE_TITLE,
  ROCK_LEE_ID,
  type LeeTally,
} from "@/lib/characters/rock-lee-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { BandagedFist, LotusMark, TallyMarks } from "./LeeMarks";
import { GateShell } from "./GateShell";
import styles from "./RockLeeExperience.module.css";

/**
 * Rock Lee — "Sekiz Kapı" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/306 bu bileşene dallanır.
 * Akış: şafak → künye ve takım → nilüfer (teknikler) → SEKİZ KAPI →
 * kader çizelgesi → kapanış. Bölüm aralarında Lee'nin kendine kestiği
 * cezalar bir defter kaydı gibi tekrar eder.
 *
 * Sayfa SUNUCUDA çizilir. Tek istemci adası `GateShell` (+ merdiveni
 * çizen `GateLadder`): sayfanın tamamındaki ısı, mod düğmesi ve merdiven
 * TEK bir tam sayıya (`open`, 0–8) bağlı. Gövde ona `head`/`tail` düğümü
 * olarak sunucudan iniyor — tarayıcıya ek JS yok.
 *
 * Görsel çözümleme: characterId 306 kaydının ABILITY yuvaları
 * (`rocklee:*`). Görsel inmemişse bölüm sahnesiz ama ayakta kalır.
 */

/** Binlik ayracı elle: ICU'ya bağlı kalmadan iki dilde de aynı sonuç. */
function groupNumber(value: number, locale: string): string {
  const separator = locale === "en" ? "," : ".";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/**
 * Tekrar motifi: bölüm aralarındaki ceza satırı.
 *
 * Mizah değil, defter kaydı — bu yüzden biçimi bir kartın değil, bir
 * SATIRIN biçimi: koşul solda küçük, sayı sağda büyük, altında çetele.
 */
function TallyRow({ tally, locale }: { tally: LeeTally; locale: string }) {
  return (
    /* <aside> DEĞİL: dört ceza satırı sayfaya dört "complementary"
       yer imi eklerdi ve ekran okuyucunun yer imi listesi anlamsızlaşırdı. */
    <div className={styles.tally}>
      <p className={styles.tallyCondition}>{pick(tally.condition, locale)}</p>
      <p className={styles.tallyCount}>
        <span className={styles.tallyNum}>
          {groupNumber(tally.count, locale)}
        </span>
        <span className={styles.tallyUnit}>{pick(tally.unit, locale)}</span>
      </p>
      <TallyMarks className={styles.tallyMarks} />
      <p className={styles.tallyCadence}>{pick(tally.cadence, locale)}</p>
    </div>
  );
}

export function RockLeeExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const faces = companionPortraits(companions);
  const portrait = primaryPortrait(detail);
  const uploaded = isUploadedPortrait(detail);
  const src = (key: string): string | null => ability.get(key) ?? null;
  const slotLabel = (key: string): string => pick(LEE_SLOT_LABELS[key], locale);

  const dawn = src(LEE_IMAGE_KEYS.dawn);
  const faceAlt = pick(LEE_IDENTITY.faceAlt, locale);

  /* ── Sunucuda çizilen gövde: merdivenin ÜSTÜ ────────────────────── */
  const head = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        <span className={styles.crumbSep} aria-hidden>
          /
        </span>
        <Link href={animeHref.naruto()}>{pick(LEE_CRUMB.universe, locale)}</Link>
      </nav>

      {/* ══ 1 · ŞAFAK ══ */}
      <section className={styles.hero} aria-labelledby="lee-name">
        <div className={styles.heroSky}>
          {dawn ? (
            <Image
              className={styles.heroBand}
              src={dawn}
              alt={pick(LEE_HERO.dawnAlt, locale)}
              fill
              sizes="100vw"
              priority
            />
          ) : null}
          <span className={styles.heroSun} aria-hidden />
          <span className={styles.heroDust} aria-hidden />
          <span className={styles.heroHorizon} aria-hidden />
        </div>

        <p className={styles.heroWatermark} aria-hidden>
          {LEE_HERO.watermark}
        </p>

        <div className={styles.heroInner}>
          <div className={styles.heroFigure}>
            {portrait ? (
              <span className={styles.heroPortrait}>
                <Image
                  src={portrait}
                  alt={pick(
                    uploaded
                      ? LEE_HERO.portraitAltUploaded
                      : LEE_HERO.portraitAltAnilist,
                    locale,
                  )}
                  fill
                  sizes="(max-width: 980px) 60vw, 26rem"
                  unoptimized={!uploaded}
                  priority
                />
              </span>
            ) : null}
            <BandagedFist className={styles.heroFist} />
          </div>

          <div className={styles.heroText}>
            <h1 id="lee-name" className={styles.heroName}>
              {LEE_HERO.name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {LEE_HERO.nativeName}
            </p>
            <ul className={styles.heroAliases}>
              {LEE_HERO.aliases.map((alias) => (
                <li key={alias.tr} className={styles.heroAlias}>
                  {pick(alias, locale)}
                </li>
              ))}
            </ul>
            <p className={styles.heroEpigraph}>
              {pick(LEE_HERO.epigraph, locale)}
            </p>
            <p className={styles.heroStandfirst}>
              {pick(LEE_HERO.standfirst, locale)}
            </p>
            <p className={styles.heroReading}>
              <span aria-hidden>{LEE_HERO.watermark}</span>
              {pick(LEE_HERO.watermarkReading, locale)}
            </p>
          </div>
        </div>

        {isAdmin ? (
          <div className={styles.slotRow}>
            <CuratorSlot
              characterId={ROCK_LEE_ID}
              slot="ABILITY"
              abilityName={LEE_IMAGE_KEYS.dawn}
              label={slotLabel(LEE_IMAGE_KEYS.dawn)}
            />
          </div>
        ) : null}
      </section>

      {/* ══ 2 · KÜNYE + TAKIM ══ */}
      <section className={styles.identity} aria-labelledby="lee-identity">
        <header className={styles.sectionHead}>
          <h2 id="lee-identity" className={styles.sectionTitle}>
            {pick(LEE_IDENTITY.title, locale)}
          </h2>
          <p className={styles.sectionLede}>{pick(LEE_IDENTITY.lede, locale)}</p>
        </header>

        <dl className={styles.facts}>
          {LEE_IDENTITY.facts.map((fact) => (
            <div key={fact.label.tr} className={styles.fact}>
              <dt>{pick(fact.label, locale)}</dt>
              <dd>{pick(fact.value, locale)}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.team}>
          <h3 className={styles.teamTitle}>
            {pick(LEE_IDENTITY.teamTitle, locale)}
          </h3>
          <p className={styles.teamNote}>
            {pick(LEE_IDENTITY.teamNote, locale)}
          </p>
          <ul className={styles.teamRow}>
            {LEE_IDENTITY.team.map((member) => {
              const face = faces.get(member.characterId) ?? null;
              return (
                <li key={member.characterId} className={styles.teamMember}>
                  <span className={styles.teamFace}>
                    {face ? (
                      <Image
                        src={face}
                        alt={`${member.name} — ${faceAlt}`}
                        fill
                        sizes="120px"
                      />
                    ) : null}
                  </span>
                  <span className={styles.teamName}>{member.name}</span>
                  <span className={styles.teamRole}>
                    {pick(member.role, locale)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <TallyRow tally={LEE_TALLIES[0]} locale={locale} />

      {/* ══ 3 · NİLÜFER — TEKNİK LABORATUVARI ══ */}
      <section className={styles.lab} aria-labelledby="lee-lab">
        <header className={styles.sectionHead}>
          <LotusMark className={styles.labLotus} />
          <h2 id="lee-lab" className={styles.sectionTitle}>
            {pick(LEE_LAB_TITLE.title, locale)}
          </h2>
          <p className={styles.sectionLede}>{pick(LEE_LAB_TITLE.lede, locale)}</p>
        </header>

        <ul className={styles.labGrid}>
          {LEE_TECHNIQUES.map((tech) => {
            const art = src(tech.imageKey);
            return (
              <li key={tech.key} className={styles.tech} data-tech={tech.key}>
                <span className={styles.techArt}>
                  {art ? (
                    <Image
                      src={art}
                      alt={pick(tech.altText, locale)}
                      fill
                      sizes={
                        tech.key === "omote"
                          ? "(max-width: 980px) 100vw, 620px"
                          : "(max-width: 980px) 100vw, 520px"
                      }
                    />
                  ) : (
                    <LotusMark className={styles.techFallback} />
                  )}
                  <span className={styles.techVeil} aria-hidden />
                </span>
                <span className={styles.techBody}>
                  <span className={styles.techKanji} aria-hidden>
                    {tech.kanji}
                  </span>
                  <span className={styles.techName}>{tech.name}</span>
                  <span className={styles.techGloss}>
                    {pick(tech.gloss, locale)}
                  </span>
                  <span className={styles.techTagline}>
                    {pick(tech.tagline, locale)}
                  </span>
                  {tech.quote ? (
                    <span className={styles.techQuote}>
                      &ldquo;{pick(tech.quote, locale)}&rdquo;
                    </span>
                  ) : null}
                  <span className={styles.techText}>
                    {pick(tech.text, locale)}
                  </span>
                  <span className={styles.techTraits}>
                    {tech.traits.map((trait) => (
                      <span key={trait.tr} className={styles.techTrait}>
                        {pick(trait, locale)}
                      </span>
                    ))}
                  </span>
                </span>
                {isAdmin ? (
                  <CuratorSlot
                    characterId={ROCK_LEE_ID}
                    slot="ABILITY"
                    abilityName={tech.imageKey}
                    label={slotLabel(tech.imageKey)}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>

        <ul className={styles.minorRow}>
          {LEE_MINOR.map((minor) => {
            const art = src(minor.imageKey);
            return (
              <li key={minor.key} className={styles.minor}>
                <span className={styles.minorArt}>
                  {art ? (
                    <Image
                      src={art}
                      alt={pick(minor.altText, locale)}
                      fill
                      sizes="200px"
                    />
                  ) : null}
                </span>
                <span className={styles.minorBody}>
                  <span className={styles.minorName}>
                    {minor.name ?? pick(minor.label, locale)}
                    {minor.kanji ? (
                      <span className={styles.minorKanji} aria-hidden>
                        {minor.kanji}
                      </span>
                    ) : null}
                  </span>
                  {minor.name ? (
                    <span className={styles.minorGloss}>
                      {pick(minor.label, locale)}
                    </span>
                  ) : null}
                  <span className={styles.minorNote}>
                    {pick(minor.note, locale)}
                  </span>
                </span>
                {isAdmin ? (
                  <CuratorSlot
                    characterId={ROCK_LEE_ID}
                    slot="ABILITY"
                    abilityName={minor.imageKey}
                    label={slotLabel(minor.imageKey)}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <TallyRow tally={LEE_TALLIES[1]} locale={locale} />
    </>
  );

  /* ── Sunucuda çizilen gövde: merdivenin ALTI ────────────────────── */
  const tail = (
    <>
      <TallyRow tally={LEE_TALLIES[2]} locale={locale} />

      {/* ══ 5 · KADER ÇİZELGESİ ══ */}
      <section className={styles.timeline} aria-labelledby="lee-timeline">
        <header className={styles.sectionHead}>
          <h2 id="lee-timeline" className={styles.sectionTitle}>
            {pick(LEE_TIMELINE_TITLE.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(LEE_TIMELINE_TITLE.lede, locale)}
          </p>
        </header>

        <ol className={styles.eraList}>
          {LEE_TIMELINE.map((era) => {
            const art = src(era.imageKey);
            const face = era.companionId
              ? (faces.get(era.companionId) ?? null)
              : null;
            return (
              <li key={era.key} className={styles.era} data-era={era.key}>
                <span className={styles.eraNode} aria-hidden />
                <div className={styles.eraBody}>
                  <p className={styles.eraMeta}>
                    {face ? (
                      <span className={styles.eraFace}>
                        <Image src={face} alt="" fill sizes="64px" />
                      </span>
                    ) : null}
                    <span className={styles.eraAge}>
                      {pick(era.age, locale)}
                    </span>
                  </p>
                  <h3 className={styles.eraTitle}>{pick(era.title, locale)}</h3>
                  {art ? (
                    <span className={styles.eraArt}>
                      <Image
                        src={art}
                        alt={pick(era.altText, locale)}
                        fill
                        sizes="(max-width: 980px) 100vw, 780px"
                      />
                      <span className={styles.eraScrim} aria-hidden />
                    </span>
                  ) : null}
                  <p className={styles.eraText}>{pick(era.text, locale)}</p>
                  {era.quote ? (
                    <figure className={styles.eraQuote}>
                      <blockquote>
                        &ldquo;{pick(era.quote, locale)}&rdquo;
                      </blockquote>
                      {era.quoteBy ? (
                        <figcaption>{era.quoteBy}</figcaption>
                      ) : null}
                    </figure>
                  ) : null}
                </div>
                {isAdmin ? (
                  <CuratorSlot
                    characterId={ROCK_LEE_ID}
                    slot="ABILITY"
                    abilityName={era.imageKey}
                    label={slotLabel(era.imageKey)}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </section>

      <TallyRow tally={LEE_TALLIES[3]} locale={locale} />

      {/* ══ 6 · KAPANIŞ ══ */}
      <section className={styles.closing} aria-labelledby="lee-closing">
        <h2 id="lee-closing" className={styles.visuallyHidden}>
          {LEE_HERO.name}
        </h2>
        <span className={styles.closingSun} aria-hidden />

        {LEE_QUOTES.map((quote) => (
          <figure key={quote.by} className={styles.closingQuote}>
            <blockquote>&ldquo;{pick(quote.text, locale)}&rdquo;</blockquote>
            <figcaption>{quote.by}</figcaption>
          </figure>
        ))}

        <p className={styles.closingMotto} aria-hidden>
          {LEE_CLOSING.motto}
        </p>
        <p className={styles.closingReading}>
          {pick(LEE_CLOSING.mottoReading, locale)}
        </p>
        <LotusMark className={styles.closingLotus} />
        <p className={styles.closingCoda}>{pick(LEE_CLOSING.coda, locale)}</p>

        <footer className={styles.credit}>
          <h3 className={styles.creditTitle}>{pick(LEE_CREDIT.title, locale)}</h3>
          <p className={styles.creditText}>{pick(LEE_CREDIT.text, locale)}</p>
          <a
            className={styles.creditLink}
            href={LEE_CREDIT.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            {pick(LEE_CREDIT.linkLabel, locale)}
          </a>
        </footer>
      </section>
    </>
  );

  return (
    <CuratorFrame isAdmin={isAdmin}>
      <GateShell
        rows={LEE_GATES.map((gate) => ({
          key: gate.key,
          index: gate.index,
          name: gate.name,
          kanji: gate.kanji,
          gloss: pick(gate.gloss, locale),
          site: pick(gate.site, locale),
          limit: pick(gate.limit, locale),
          cost: pick(gate.cost, locale),
          unlocks: gate.unlocks ? pick(gate.unlocks, locale) : undefined,
          fatal: gate.fatal,
        }))}
        copy={{
          title: pick(LEE_GATES_TITLE.title, locale),
          kanji: LEE_GATES_TITLE.kanji,
          lede: pick(LEE_GATES_TITLE.lede, locale),
          meterLabel: pick(LEE_GATES_TITLE.meterLabel, locale),
          openAction: pick(LEE_GATES_TITLE.openAction, locale),
          closeAction: pick(LEE_GATES_TITLE.closeAction, locale),
          limitLabel: pick(LEE_GATES_TITLE.limitLabel, locale),
          costLabel: pick(LEE_GATES_TITLE.costLabel, locale),
          unlockLabel: pick(LEE_GATES_TITLE.unlockLabel, locale),
          siteLabel: pick(LEE_GATES_TITLE.siteLabel, locale),
          rungLabel: pick(LEE_GATES_TITLE.rungLabel, locale),
          warningTitle: pick(LEE_DEATH_WARNING.title, locale),
          warningText: pick(LEE_DEATH_WARNING.text, locale),
        }}
        modeEnter={pick(LEE_MODE.enter, locale)}
        modeExit={pick(LEE_MODE.exit, locale)}
        modeHint={pick(LEE_MODE.hint, locale)}
        characterId={ROCK_LEE_ID}
        eighthImage={src(LEE_IMAGE_KEYS.gateEighth)}
        eighthAlt={pick(LEE_GATES_TITLE.eighthAlt, locale)}
        curatorLabel={
          isAdmin ? slotLabel(LEE_IMAGE_KEYS.gateEighth) : undefined
        }
        head={head}
        tail={tail}
      />
    </CuratorFrame>
  );
}
