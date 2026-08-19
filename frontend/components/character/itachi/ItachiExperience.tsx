import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import type { CharacterDetail, CharacterImage } from "@/lib/api/types";
import { pick } from "@/lib/characters/types";
import {
  ITACHI_GENJUTSU_TEXT,
  ITACHI_HERO_TEXT,
  ITACHI_ID,
  ITACHI_IDENTITY,
  ITACHI_IMAGE_KEYS,
  ITACHI_EYES_TITLE,
  ITACHI_JUTSU,
  ITACHI_JUTSU_TITLE,
  ITACHI_MINOR_JUTSU,
  ITACHI_QUOTES,
  ITACHI_SHARINGAN,
  ITACHI_SLOT_LABELS,
  ITACHI_TIMELINE,
  ITACHI_TIMELINE_TITLE,
} from "@/lib/characters/itachi-experience";
import { animeHref } from "@/lib/anime/routes";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { SharinganDisc } from "./SharinganEyes";
import { ItachiHero } from "./ItachiHero";
import { EyesPanel } from "./EyesPanel";
import { GenjutsuShell } from "./GenjutsuShell";
import styles from "./ItachiExperience.module.css";

/**
 * Itachi Uchiha — interaktif deneyim sayfası.
 *
 * /karakterler/14 bu bileşene dallanır (klasik dossier'in yerine; rota
 * dosyasındaki not). Akış — kullanıcı komutundaki döngü:
 * Karanlık → Gözler → Sharingan → Kargalar → Genjutsu → Jutsu → Fedakârlık.
 *
 * Sayfa sunucuda çizilir; üç istemci adası var: GenjutsuShell (tek durum),
 * ItachiHero (fener + kargalar), EyesPanel (tıklanabilir Sharingan).
 * Metinler sunucuda seçilir (`pick`), istemciye düz dize iner.
 *
 * Görsel çözümleme: characterId 14 kaydının ABILITY yuvaları
 * (`itachi:*`, son-kazanır). Görsel inmemişse bölüm sahnesiz ama ayakta
 * kalır — Akatsuki sergisinin fallback şartı burada da geçerli.
 */

function collectAbility(images: CharacterImage[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const row of images) {
    /* Satırlar orderIndex+createdAt artan sıralı: son yazan kazanır */
    if (row.slot === "ABILITY" && row.abilityName) {
      map.set(row.abilityName, row.url);
    }
  }
  return map;
}

export function ItachiExperience({
  detail,
  isAdmin,
}: {
  detail: CharacterDetail;
  isAdmin: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("character");
  const ability = collectAbility(detail.images ?? []);
  const src = (key: string): string | null => {
    const url = ability.get(key);
    return url ? apiUrl(url) : null;
  };

  const heroLabels = {
    hint: pick(ITACHI_HERO_TEXT.hint, locale),
    hintTouch: pick(ITACHI_HERO_TEXT.hintTouch, locale),
    eyesLabel: pick(ITACHI_HERO_TEXT.eyesLabel, locale),
    stageNames: {
      dark: pick(ITACHI_HERO_TEXT.stageNames.dark, locale),
      ember: pick(ITACHI_HERO_TEXT.stageNames.ember, locale),
      sharingan: pick(ITACHI_HERO_TEXT.stageNames.sharingan, locale),
      mangekyo: pick(ITACHI_HERO_TEXT.stageNames.mangekyo, locale),
    },
  };

  const sharingan = ITACHI_SHARINGAN;
  const eyesPanelProps = {
    title: pick(sharingan.title, locale),
    kanji: sharingan.kanji,
    subtitle: pick(sharingan.subtitle, locale),
    intro: pick(sharingan.intro, locale),
    quoteText: pick(sharingan.introQuote.text, locale),
    quoteBy: sharingan.introQuote.by,
    openHint: pick(sharingan.openHint, locale),
    closeLabel: pick(sharingan.closeLabel, locale),
    evolutionTitle: pick(sharingan.evolutionTitle, locale),
    evolution: sharingan.evolution.map((stage) => ({
      key: stage.key,
      glyph: stage.glyph,
      name: pick(stage.name, locale),
      text: pick(stage.text, locale),
    })),
    abilitiesTitle: pick(sharingan.abilitiesTitle, locale),
    abilities: sharingan.abilities.map((row) => ({
      key: row.key,
      name: pick(row.name, locale),
      text: pick(row.text, locale),
    })),
    mangekyoTitle: pick(sharingan.mangekyoTitle, locale),
    mangekyo: sharingan.mangekyo.map((row) => ({
      key: row.key,
      glyph: row.glyph,
      name: row.name,
      user: row.user,
      text: pick(row.text, locale),
    })),
    usersTitle: pick(sharingan.usersTitle, locale),
    users: sharingan.users.map((user) => ({
      name: user.name,
      image: src(user.imageKey),
      glyph: user.glyph,
      note: pick(user.note, locale),
    })),
    strengthsTitle: pick(sharingan.strengthsTitle, locale),
    strengths: sharingan.strengths.map((item) => pick(item, locale)),
    weaknessesTitle: pick(sharingan.weaknessesTitle, locale),
    weaknesses: sharingan.weaknesses.map((item) => pick(item, locale)),
    closing: pick(sharingan.closing.text, locale),
  };

  return (
    <GenjutsuShell
      enterLabel={pick(ITACHI_GENJUTSU_TEXT.enter, locale)}
      exitLabel={pick(ITACHI_GENJUTSU_TEXT.exit, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        {/* Kaydırma ilerlemesi — kızıl iplik (scroll(), JS'siz) */}
        <span className={styles.progress} aria-hidden />

        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            /
          </span>
          <Link href={animeHref.akatsuki()}>Akatsuki</Link>
        </nav>

        {/* ══ 1 · KARANLIKTAKİ GÖZLER ══ */}
        <ItachiHero
          desktopSrc={src(ITACHI_IMAGE_KEYS.hero)}
          mobileSrc={src(ITACHI_IMAGE_KEYS.heroMobile)}
          labels={heroLabels}
        />

        {/* ══ 2 · KİMLİK ══ */}
        <section className={styles.identity} aria-labelledby="itachi-identity">
          <div className={styles.identityHead}>
            <p className={styles.identityClan} aria-hidden>
              うちは一族
            </p>
            <h1 id="itachi-identity" className={styles.identityName}>
              {ITACHI_IDENTITY.name}
            </h1>
            <p className={styles.identityNative} aria-hidden>
              {ITACHI_IDENTITY.nativeName}
            </p>
            <p className={styles.identityEpigraph}>
              &ldquo;{pick(ITACHI_IDENTITY.epigraph, locale)}&rdquo;
            </p>
          </div>
          <dl className={styles.identityFacts}>
            {ITACHI_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.identityFact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={ITACHI_ID}
                slot="ABILITY"
                abilityName={ITACHI_IMAGE_KEYS.hero}
                label={pick(ITACHI_SLOT_LABELS[ITACHI_IMAGE_KEYS.hero], locale)}
              />
              <CuratorSlot
                characterId={ITACHI_ID}
                slot="ABILITY"
                abilityName={ITACHI_IMAGE_KEYS.heroMobile}
                label={pick(ITACHI_SLOT_LABELS[ITACHI_IMAGE_KEYS.heroMobile], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 3 · JUTSU LABORATUVARI ══ */}
        <section className={styles.jutsu} aria-labelledby="itachi-jutsu">
          <header className={styles.sectionHead}>
            <h2 id="itachi-jutsu" className={styles.sectionTitle}>
              {pick(ITACHI_JUTSU_TITLE.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(ITACHI_JUTSU_TITLE.lede, locale)}
            </p>
          </header>
          <ul className={styles.jutsuGrid}>
            {ITACHI_JUTSU.map((jutsu) => {
              const image = src(ITACHI_IMAGE_KEYS[jutsu.key]);
              return (
                <li
                  key={jutsu.key}
                  className={styles.jutsuCard}
                  data-jutsu={jutsu.key}
                >
                  <span className={styles.jutsuArt} aria-hidden>
                    {image ? (
                      <Image
                        src={image}
                        alt=""
                        fill
                        /* Susanoo tam satır — daha geniş türev ister */
                        sizes={jutsu.key === "susanoo" ? "1080px" : "720px"}
                      />
                    ) : null}
                    <span className={styles.jutsuVeilFx} />
                  </span>
                  <span className={styles.jutsuBody}>
                    <span className={styles.jutsuKanji} aria-hidden>
                      {jutsu.kanji}
                    </span>
                    <span className={styles.jutsuName}>{jutsu.name}</span>
                    <span className={styles.jutsuTagline}>
                      {pick(jutsu.tagline, locale)}
                    </span>
                    <span className={styles.jutsuText}>
                      {pick(jutsu.text, locale)}
                    </span>
                    <span className={styles.jutsuTraits}>
                      {jutsu.traits.map((trait) => (
                        <span key={trait.tr} className={styles.jutsuTrait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={ITACHI_ID}
                      slot="ABILITY"
                      abilityName={ITACHI_IMAGE_KEYS[jutsu.key]}
                      label={pick(ITACHI_SLOT_LABELS[ITACHI_IMAGE_KEYS[jutsu.key]], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
          <ul className={styles.minorRow}>
            {ITACHI_MINOR_JUTSU.map((minor) => (
              <li key={minor.name} className={styles.minorChip}>
                <span className={styles.minorName}>{minor.name}</span>
                <span className={styles.minorNote}>{pick(minor.note, locale)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ══ 4 · GÖZLER ══ */}
        <section className={styles.eyes} aria-labelledby="itachi-eyes">
          <header className={styles.sectionHead}>
            <h2 id="itachi-eyes" className={styles.sectionTitle}>
              {pick(ITACHI_EYES_TITLE.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(ITACHI_EYES_TITLE.lede, locale)}
            </p>
          </header>
          <EyesPanel {...eyesPanelProps} />
          {isAdmin ? (
            <div className={styles.slotRow}>
              {sharingan.users.map((user) => (
                <CuratorSlot
                  key={user.imageKey}
                  characterId={ITACHI_ID}
                  slot="ABILITY"
                  abilityName={user.imageKey}
                  label={pick(ITACHI_SLOT_LABELS[user.imageKey], locale)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 5 · FEDAKÂRLIK ÇİZELGESİ ══ */}
        <section className={styles.timeline} aria-labelledby="itachi-timeline">
          <header className={styles.sectionHead}>
            <h2 id="itachi-timeline" className={styles.sectionTitle}>
              {pick(ITACHI_TIMELINE_TITLE.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(ITACHI_TIMELINE_TITLE.lede, locale)}
            </p>
          </header>
          <ol className={styles.eraList}>
            {ITACHI_TIMELINE.map((era, index) => {
              const image = src(era.imageKey);
              return (
                <li
                  key={era.key}
                  className={styles.era}
                  data-era={era.key}
                  data-side={index % 2 === 0 ? "left" : "right"}
                >
                  <span className={styles.eraArt} aria-hidden>
                    {image ? (
                      /* Tam genişlik bant — sabit px, akatsuki bant deseni
                         (next.config vw tuzağı; inceleme: 960px dardı) */
                      <Image src={image} alt="" fill sizes="1920px" />
                    ) : null}
                    <span className={styles.eraScrim} />
                  </span>
                  <div className={styles.eraBody}>
                    <span className={styles.eraMeta}>
                      <SharinganDisc
                        glyph={era.glyph}
                        className={styles.eraEye}
                        spinClassName={styles.eyeSpinSlow}
                      />
                      <span className={styles.eraAge}>{pick(era.age, locale)}</span>
                    </span>
                    <h3 className={styles.eraTitle}>{pick(era.title, locale)}</h3>
                    <p className={styles.eraText}>{pick(era.text, locale)}</p>
                    {era.quote ? (
                      <p className={styles.eraQuote}>
                        &ldquo;{pick(era.quote, locale)}&rdquo;
                      </p>
                    ) : null}
                  </div>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={ITACHI_ID}
                      slot="ABILITY"
                      abilityName={era.imageKey}
                      label={pick(ITACHI_SLOT_LABELS[era.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 6 · MİRAS ══ */}
        <section className={styles.legacy} aria-labelledby="itachi-legacy">
          <h2 id="itachi-legacy" className={styles.visuallyHidden}>
            {ITACHI_IDENTITY.name}
          </h2>
          {ITACHI_QUOTES.map((quote) => (
            <figure key={quote.text.tr} className={styles.legacyQuote}>
              <blockquote>&ldquo;{pick(quote.text, locale)}&rdquo;</blockquote>
              {quote.note ? (
                <figcaption className={styles.legacyNative} aria-hidden>
                  {pick(quote.note, locale)}
                </figcaption>
              ) : null}
            </figure>
          ))}
          <SharinganDisc
            glyph="mangekyoItachi"
            className={styles.legacyEye}
            spinClassName={styles.eyeSpinSlow}
          />
        </section>
      </CuratorFrame>
    </GenjutsuShell>
  );
}
