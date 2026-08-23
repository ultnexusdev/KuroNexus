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
  SAKURA_BONDS,
  SAKURA_BONDS_TITLE,
  SAKURA_BREAK_MAJOR,
  SAKURA_BREAK_MINOR,
  SAKURA_CLOSING,
  SAKURA_GAUGE_TITLE,
  SAKURA_HEAL_MAJOR,
  SAKURA_HEAL_MINOR,
  SAKURA_ID,
  SAKURA_IDENTITY,
  SAKURA_IMAGE_KEYS,
  SAKURA_KEYSTONE,
  SAKURA_MODE_TEXT,
  SAKURA_SCALE_TITLE,
  SAKURA_SLOT_LABELS,
  SAKURA_STAGES,
  SAKURA_TIMELINE,
  SAKURA_TIMELINE_TITLE,
  type SakuraMinorTechnique,
  type SakuraTechnique,
} from "@/lib/characters/sakura-haruno-experience";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  ByakugoSeal,
  CrackField,
  PetalDrift,
  RhombusMark,
} from "./SakuraGlyphs";
import { ByakugoShell } from "./ByakugoShell";
import styles from "./SakuraExperience.module.css";

/**
 * Sakura Haruno — interaktif deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/145 bu bileşene dallanır.
 * Konsept: **Byakugō — Üç Yıllık Birikim.** Sayfanın omurgası bir dolum
 * ölçeği; her bölüm o ölçeğin başka bir okuması:
 *
 *   Hero → Künye → Dolum Ölçeği (kalp) → İki Kefe → Bağlar →
 *   Kader Çizelgesi → Son söz
 *
 * Sayfa SUNUCUDA çizilir. Tek istemci adası `ByakugoShell`: mod düğmesi
 * ve ölçek kademesi. Gövdenin tamamı sunucudan düğüm olarak geçiyor,
 * yani tarayıcıya JS olarak inmiyor.
 *
 * Görseller characterId 145 kaydının ABILITY yuvalarından (`sakura:*`).
 * Hiçbiri zorunlu değil: yuva boşsa bölüm elle çizilmiş mühürle ayakta
 * kalır (bkz. `SakuraGlyphs.tsx`).
 */
export function SakuraExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const src = (key: string): string | null => ability.get(key) ?? null;
  const faces = companionPortraits(companions);

  const portrait = primaryPortrait(detail);
  const uploaded = isUploadedPortrait(detail);
  /* Alt metni kaynağı söylüyor (BRIEF kural 3.5): yüklenen portre ile
     AniList'in ~230 piksellik künye portresi aynı şey değil. */
  const portraitAlt = pick(
    uploaded
      ? {
          tr: "Sakura Haruno — arşivin portre kaydı",
          en: "Sakura Haruno — the archive's portrait record",
        }
      : {
          tr: "Sakura Haruno — AniList künye portresi",
          en: "Sakura Haruno — AniList profile portrait",
        },
    locale,
  );

  /** Kürator yuvası — yalnızca yöneticide çizilir. */
  const slotFor = (key: string) =>
    isAdmin ? (
      <CuratorSlot
        characterId={SAKURA_ID}
        slot="ABILITY"
        abilityName={key}
        label={pick(SAKURA_SLOT_LABELS[key], locale)}
      />
    ) : null;

  /** İki kefenin büyük kartı — aynı iskelet, taraf `data-side` ile ayrışır. */
  const majorCard = (technique: SakuraTechnique, side: "heal" | "break") => {
    const art = src(technique.imageKey);
    return (
      <article className={styles.major} data-side={side}>
        <span className={styles.majorArt} aria-hidden>
          {art ? (
            <Image
              src={art}
              alt=""
              fill
              sizes="(max-width: 900px) 92vw, 460px"
            />
          ) : null}
          {side === "break" ? <CrackField className={styles.cracks} /> : null}
          <span className={styles.majorGlow} />
        </span>
        <span className={styles.majorBody}>
          <span className={styles.majorNative} lang="ja">
            {technique.native}
          </span>
          <h4 className={styles.majorName}>{technique.name}</h4>
          <p className={styles.majorTagline}>
            {pick(technique.tagline, locale)}
          </p>
          <p className={styles.majorText}>{pick(technique.text, locale)}</p>
          <ul className={styles.traitRow}>
            {technique.traits.map((trait) => (
              <li key={trait.tr} className={styles.trait}>
                {pick(trait, locale)}
              </li>
            ))}
          </ul>
        </span>
        {slotFor(technique.imageKey)}
      </article>
    );
  };

  /** Küçük teknik satırı — kefelerin altındaki ikişerli dizi. */
  const minorCard = (technique: SakuraMinorTechnique) => {
    const art = src(technique.imageKey);
    return (
      <li key={technique.name} className={styles.minor}>
        <span className={styles.minorArt} aria-hidden>
          {art ? (
            <Image
              src={art}
              alt=""
              fill
              sizes="(max-width: 900px) 46vw, 220px"
            />
          ) : (
            <RhombusMark className={styles.minorMark} />
          )}
        </span>
        <span className={styles.minorBody}>
          <span className={styles.minorNative} lang="ja">
            {technique.native}
          </span>
          <h4 className={styles.minorName}>{technique.name}</h4>
          <p className={styles.minorNote}>{pick(technique.note, locale)}</p>
        </span>
        {slotFor(technique.imageKey)}
      </li>
    );
  };

  const heroArt = src(SAKURA_IMAGE_KEYS.hero);
  const keystoneArt = src(SAKURA_KEYSTONE.imageKey);
  const anilistHref =
    detail.character.siteUrl ?? `https://anilist.co/character/${SAKURA_ID}`;

  /* ══ ÖLÇEĞİN ÜSTÜNDE KALAN GÖVDE ══════════════════════════════════ */
  const head = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        <span className={styles.crumbSep} aria-hidden>
          ◆
        </span>
        <Link href={animeHref.naruto()}>Naruto</Link>
      </nav>

      {/* ══ 1 · HERO ══ */}
      <section className={styles.hero} aria-labelledby="sakura-name">
        {heroArt ? (
          <span className={styles.heroScene} aria-hidden>
            <Image src={heroArt} alt="" fill priority sizes="1600px" />
          </span>
        ) : null}
        <PetalDrift className={styles.petals} />
        <p className={styles.watermark} lang="ja" aria-hidden>
          {SAKURA_IDENTITY.watermark}
        </p>
        <div className={styles.heroInner}>
          <div className={styles.portraitFrame}>
            {portrait ? (
              <Image
                src={portrait}
                alt={portraitAlt}
                fill
                priority
                sizes="(max-width: 720px) 58vw, 280px"
                unoptimized={!uploaded}
                className={styles.portrait}
              />
            ) : (
              <ByakugoSeal stage={4} className={styles.portraitVoid} />
            )}
            {/* Portrenin üstündeki mühür: alın hizasında, çok düşük opaklık */}
            <ByakugoSeal stage={2} className={styles.portraitSeal} />
            <span className={styles.portraitEdge} aria-hidden />
          </div>
          <div className={styles.heroText}>
            <h1 id="sakura-name" className={styles.heroName}>
              {SAKURA_IDENTITY.name}
            </h1>
            <p className={styles.heroNative} lang="ja">
              {SAKURA_IDENTITY.nativeName}
            </p>
            <ul className={styles.heroTags}>
              {SAKURA_IDENTITY.tags.map((tag) => (
                <li key={tag.tr} className={styles.heroTag}>
                  {pick(tag, locale)}
                </li>
              ))}
            </ul>
            <p className={styles.heroEpigraph}>
              {pick(SAKURA_IDENTITY.epigraph, locale)}
            </p>
          </div>
        </div>
        {isAdmin ? (
          <div className={styles.slotRow}>
            {slotFor(SAKURA_IMAGE_KEYS.hero)}
          </div>
        ) : null}
      </section>

      {/* ══ 2 · KÜNYE ŞERİDİ ══ */}
      <section className={styles.identity} aria-labelledby="sakura-identity">
        <header className={styles.sectionHead}>
          <h2 id="sakura-identity" className={styles.sectionTitle}>
            {pick(SAKURA_IDENTITY.factsTitle, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(SAKURA_IDENTITY.factsLede, locale)}
          </p>
        </header>
        <dl className={styles.facts}>
          {SAKURA_IDENTITY.facts.map((fact) => (
            <div key={fact.label.tr} className={styles.fact}>
              <dt>{pick(fact.label, locale)}</dt>
              <dd>{pick(fact.value, locale)}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );

  return (
    <ByakugoShell
      isAdmin={isAdmin}
      enterLabel={pick(SAKURA_MODE_TEXT.enter, locale)}
      exitLabel={pick(SAKURA_MODE_TEXT.exit, locale)}
      head={head}
      gauge={{
        title: pick(SAKURA_GAUGE_TITLE.title, locale),
        lede: pick(SAKURA_GAUGE_TITLE.lede, locale),
        ladderLabel: pick(SAKURA_GAUGE_TITLE.ladderLabel, locale),
        readoutLabel: pick(SAKURA_GAUGE_TITLE.readoutLabel, locale),
        gainsLabel: pick(SAKURA_GAUGE_TITLE.gainsLabel, locale),
        costLabel: pick(SAKURA_GAUGE_TITLE.costLabel, locale),
        stages: SAKURA_STAGES.map((item) => ({
          key: item.key,
          native: item.native,
          name: pick(item.name, locale),
          span: pick(item.span, locale),
          lede: pick(item.lede, locale),
          text: pick(item.text, locale),
          gains: item.gains.map((gain) => pick(gain, locale)),
          cost: pick(item.cost, locale),
        })),
        slot: isAdmin ? (
          <div className={styles.slotRow}>
            {slotFor(SAKURA_IMAGE_KEYS.seal)}
          </div>
        ) : null,
      }}
    >
      {/* ══ 4 · İKİ KEFE ══ */}
      <section className={styles.scale} aria-labelledby="sakura-scale">
        <header className={styles.sectionHead}>
          <h2 id="sakura-scale" className={styles.sectionTitle}>
            {pick(SAKURA_SCALE_TITLE.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(SAKURA_SCALE_TITLE.lede, locale)}
          </p>
        </header>

        <div className={styles.beam}>
          <span className={styles.beamLine} aria-hidden />

          <div className={styles.pan} data-side="heal">
            <h3 className={styles.panTitle}>
              {pick(SAKURA_SCALE_TITLE.healTitle, locale)}
            </h3>
            {majorCard(SAKURA_HEAL_MAJOR, "heal")}
            <ul className={styles.minorList}>
              {SAKURA_HEAL_MINOR.map(minorCard)}
            </ul>
          </div>

          <div className={styles.fulcrum}>
            <RhombusMark className={styles.fulcrumMark} />
            <p className={styles.fulcrumNative} lang="ja" aria-hidden>
              百豪の印
            </p>
            <figure className={styles.fulcrumFigure}>
              <blockquote className={styles.fulcrumQuote}>
                &ldquo;{pick(SAKURA_SCALE_TITLE.fulcrumQuote, locale)}&rdquo;
              </blockquote>
              <figcaption className={styles.fulcrumSource}>
                {pick(SAKURA_SCALE_TITLE.fulcrumSource, locale)}
              </figcaption>
            </figure>
          </div>

          <div className={styles.pan} data-side="break">
            <h3 className={styles.panTitle}>
              {pick(SAKURA_SCALE_TITLE.breakTitle, locale)}
            </h3>
            {majorCard(SAKURA_BREAK_MAJOR, "break")}
            <ul className={styles.minorList}>
              {SAKURA_BREAK_MINOR.map(minorCard)}
            </ul>
          </div>
        </div>

        <article className={styles.keystone}>
          <div className={styles.keystoneBody}>
            <h3 className={styles.keystoneTitle}>
              {pick(SAKURA_SCALE_TITLE.keystoneTitle, locale)}
            </h3>
            <p className={styles.keystoneNative} lang="ja">
              {SAKURA_KEYSTONE.native}
            </p>
            <p className={styles.keystoneName}>{SAKURA_KEYSTONE.name}</p>
            <p className={styles.keystoneText}>
              {pick(SAKURA_KEYSTONE.text, locale)}
            </p>
            <ul className={styles.traitRow}>
              {SAKURA_KEYSTONE.traits.map((trait) => (
                <li key={trait.tr} className={styles.trait}>
                  {pick(trait, locale)}
                </li>
              ))}
            </ul>
          </div>
          <span className={styles.keystoneArt} aria-hidden>
            {keystoneArt ? (
              <Image
                src={keystoneArt}
                alt=""
                fill
                sizes="(max-width: 900px) 92vw, 420px"
              />
            ) : null}
            <ByakugoSeal stage={4} className={styles.keystoneSeal} />
          </span>
          {slotFor(SAKURA_KEYSTONE.imageKey)}
        </article>
      </section>

      {/* ══ 5 · BAĞLAR ══ */}
      <section className={styles.bonds} aria-labelledby="sakura-bonds">
        <header className={styles.sectionHead}>
          <h2 id="sakura-bonds" className={styles.sectionTitle}>
            {pick(SAKURA_BONDS_TITLE.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(SAKURA_BONDS_TITLE.lede, locale)}
          </p>
        </header>
        <ul className={styles.bondRow}>
          {SAKURA_BONDS.map((bond) => {
            const face = faces.get(bond.characterId) ?? null;
            return (
              <li key={bond.characterId} className={styles.bond}>
                <Link
                  href={animeHref.character(bond.characterId)}
                  className={styles.bondLink}
                >
                  <span className={styles.bondArt}>
                    {face ? (
                      <Image
                        src={face}
                        alt={pick(
                          {
                            tr: `${bond.name} — arşivin portre kaydı`,
                            en: `${bond.name} — the archive's portrait record`,
                          },
                          locale,
                        )}
                        fill
                        sizes="(max-width: 900px) 40vw, 200px"
                      />
                    ) : (
                      <RhombusMark className={styles.bondMark} />
                    )}
                  </span>
                  <span className={styles.bondName}>{bond.name}</span>
                </Link>
                <p className={styles.bondRole}>{pick(bond.role, locale)}</p>
                <p className={styles.bondNote}>{pick(bond.note, locale)}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ══ 6 · KADER ÇİZELGESİ ══ */}
      <section className={styles.fate} aria-labelledby="sakura-fate">
        <header className={styles.sectionHead}>
          <h2 id="sakura-fate" className={styles.sectionTitle}>
            {pick(SAKURA_TIMELINE_TITLE.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(SAKURA_TIMELINE_TITLE.lede, locale)}
          </p>
        </header>
        <ol className={styles.eraList}>
          {SAKURA_TIMELINE.map((era) => {
            const art = src(era.imageKey);
            return (
              <li key={era.key} className={styles.era} data-era={era.key}>
                <span className={styles.eraRail} aria-hidden>
                  <RhombusMark className={styles.eraNode} />
                </span>
                <div className={styles.eraBody}>
                  <p className={styles.eraAge}>{pick(era.age, locale)}</p>
                  <h3 className={styles.eraTitle}>{pick(era.title, locale)}</h3>
                  <p className={styles.eraText}>{pick(era.text, locale)}</p>
                  {era.quote ? (
                    <figure className={styles.eraFigure}>
                      <blockquote className={styles.eraQuote}>
                        &ldquo;{pick(era.quote, locale)}&rdquo;
                      </blockquote>
                      {era.quoteSource ? (
                        <figcaption className={styles.eraSource}>
                          {pick(era.quoteSource, locale)}
                        </figcaption>
                      ) : null}
                    </figure>
                  ) : null}
                </div>
                {/* Çizelgedeki mühür o günkü dolumu gösteriyor — ölçeğin
                    ikinci okuması; görsel inmişse ardına biner */}
                <span className={styles.eraArt} aria-hidden>
                  {art ? (
                    <Image
                      src={art}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 92vw, 300px"
                    />
                  ) : null}
                  <ByakugoSeal stage={era.stage} className={styles.eraSeal} />
                </span>
                {slotFor(era.imageKey)}
              </li>
            );
          })}
        </ol>
      </section>

      {/* ══ 7 · SON SÖZ ══ */}
      <section className={styles.closing} aria-labelledby="sakura-closing">
        <h2 id="sakura-closing" className={styles.closingTitle}>
          {pick({ tr: "Son söz", en: "Last word" }, locale)}
        </h2>
        <div className={styles.closingQuotes}>
          {SAKURA_CLOSING.quotes.map((quote) => (
            <figure key={quote.text.tr} className={styles.closingFigure}>
              <blockquote className={styles.closingQuote}>
                &ldquo;{pick(quote.text, locale)}&rdquo;
              </blockquote>
              <figcaption className={styles.closingSource}>
                {pick(quote.source, locale)}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className={styles.motto} lang="ja">
          {SAKURA_CLOSING.motto.native}
        </p>
        <p className={styles.mottoReading}>
          {SAKURA_CLOSING.motto.reading} —{" "}
          {pick(SAKURA_CLOSING.motto.note, locale)}
        </p>
        <p className={styles.credit}>
          {pick(SAKURA_CLOSING.credit, locale)}{" "}
          <a
            className={styles.creditLink}
            href={anilistHref}
            target="_blank"
            rel="noreferrer"
          >
            {pick(SAKURA_CLOSING.creditLink, locale)}
          </a>
        </p>
      </section>
    </ByakugoShell>
  );
}
