import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { pick } from "@/lib/characters/types";
import {
  collectAbilityImages,
  companionPortraits,
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import { animeHref } from "@/lib/anime/routes";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  VESSEL_ANILIST_LINKS,
  VESSEL_ANILIST_PORTRAITS,
  VESSEL_CIRCLE,
  VESSEL_CIRCLE_TITLE,
  VESSEL_CLOSING,
  VESSEL_COLUMNS,
  VESSEL_DOSSIER_TITLE,
  VESSEL_HERO,
  VESSEL_IDS,
  VESSEL_IMAGE_KEYS,
  VESSEL_ITADORI_TECHNIQUES,
  VESSEL_LAB_TITLE,
  VESSEL_MINOR,
  VESSEL_RAIL,
  VESSEL_SLOT_LABELS,
  VESSEL_SUKUNA_TECHNIQUES,
  VESSEL_SWITCH,
  VESSEL_TIMELINE,
  VESSEL_TIMELINE_TITLE,
  VESSEL_VOW,
  vesselModeFor,
  type VesselMode,
  type VesselTechnique,
} from "@/lib/characters/sukuna-itadori-experience";
import { VesselShell } from "./VesselShell";
import { CleaveMark, ShrineSigil, VesselFaceMarks, VesselSigil } from "./VesselGlyphs";
import styles from "./VesselExperience.module.css";

/**
 * Sukuna & Yuuji Itadori — "KAP" deneyim sayfası.
 *
 * İKİ ADRES, TEK SAYFA: /karakterler/127212 ve /karakterler/133701 aynı
 * bileşene çıkıyor (rota haritası). Fark yalnızca açılış modunda:
 * Sukuna'nın adresinden gelen sayfayı Sukuna'nın tarafında açıyor.
 * Karar burada, SUNUCUDA veriliyor — istemciye yalnızca başlangıç değeri
 * iniyor, böylece ilk boyada doğru palet çiziliyor.
 *
 * Sayfa sunucu bileşeni; iki istemci adası var: `VesselShell` (mod +
 * parmak sayısı) ve `FingerRail` (rayın kendisi). Gövdenin tamamı burada
 * çiziliyor ve kabuğa DÜĞÜM olarak geçiyor, yani tarayıcıya JS olarak
 * inmiyor.
 *
 * Görseller characterId 127212 kaydının ABILITY yuvalarında (`vessel:*`).
 * Yuva boşken bölüm görselsiz ama ayakta kalıyor — hiçbir bölüm görsele
 * bağımlı değil.
 */

/** Hero'daki iki portre katmanından biri. */
interface PortraitLayer {
  src: string;
  uploaded: boolean;
}

/**
 * Bir tarafın portresi — en iyi kaynaktan.
 *
 * Sıra: küratörün `vessel:portre-*` yuvasına yüklediği tam boy görsel →
 * adresten gelen karakterin kendi künye portresi → AniList sabiti. Son
 * basamak sayesinde hero HER ZAMAN iki katmanlı çiziliyor: karşı tarafın
 * portresi `companions` üzerinden gelmiyor (JJK kadrosunun bizde PORTRAIT
 * kaydı yok, 22 Ağustos 2026 ölçümü).
 */
function resolvePortrait(
  mode: VesselMode,
  detail: CharacterExperienceProps["detail"],
  ability: Map<string, string>,
): PortraitLayer {
  const curated = ability.get(
    mode === "sukuna"
      ? VESSEL_IMAGE_KEYS.portraitSukuna
      : VESSEL_IMAGE_KEYS.portraitItadori,
  );
  if (curated) {
    return { src: curated, uploaded: true };
  }
  if (vesselModeFor(detail.character.characterId) === mode) {
    const own = primaryPortrait(detail);
    if (own) {
      return { src: own, uploaded: isUploadedPortrait(detail) };
    }
  }
  return { src: VESSEL_ANILIST_PORTRAITS[mode], uploaded: false };
}

export function VesselExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");
  const ability = collectAbilityImages(detail.images);
  const portraits = companionPortraits(companions);
  const src = (key: string): string | null => ability.get(key) ?? null;

  const initialVessel = vesselModeFor(detail.character.characterId);
  const itadori = resolvePortrait("itadori", detail, ability);
  const sukuna = resolvePortrait("sukuna", detail, ability);

  /* Yükleme kutusu — etiketi yuvanın kendi sözlüğünden okunur */
  const slot = (key: string) =>
    isAdmin ? (
      <CuratorSlot
        characterId={VESSEL_IDS.itadori}
        slot="ABILITY"
        abilityName={key}
        label={pick(VESSEL_SLOT_LABELS[key], locale)}
      />
    ) : null;

  const sideName = {
    itadori: VESSEL_SWITCH.itadori.name,
    sukuna: VESSEL_SWITCH.sukuna.name,
  };

  /** Laboratuvar kartı. `primary` olanlar görsel bandı ve büyük tipografi alır. */
  const renderCard = (technique: VesselTechnique, primary: boolean) => {
    const art = src(technique.imageKey);
    return (
      <li
        key={technique.key}
        className={styles.card}
        data-technique={technique.key}
        data-primary={primary ? "" : undefined}
      >
        {art ? (
          <span className={styles.cardArt} aria-hidden>
            <Image src={art} alt="" fill sizes="720px" />
            <span className={styles.cardArtVeil} />
          </span>
        ) : null}
        <span className={styles.cardBody}>
          <span className={styles.cardKanji} aria-hidden>
            {technique.kanji}
          </span>
          <span className={styles.cardName}>{technique.name}</span>
          <span className={styles.cardTagline}>
            {pick(technique.tagline, locale)}
          </span>
          <span className={styles.cardText}>{pick(technique.text, locale)}</span>
          <span className={styles.cardTraits}>
            {technique.traits.map((trait) => (
              <span key={trait.tr} className={styles.cardTrait}>
                {pick(trait, locale)}
              </span>
            ))}
          </span>
        </span>
        {technique.key === "shrine" ? (
          <ShrineSigil className={styles.cardSigil} />
        ) : null}
        {slot(technique.imageKey)}
      </li>
    );
  };

  /* ══ HERO ══════════════════════════════════════════════════════════ */
  const hero = (
    <header className={styles.hero}>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        <span className={styles.crumbSep} aria-hidden>
          /
        </span>
        <span className={styles.crumbHere}>Jujutsu Kaisen</span>
      </nav>

      <div className={styles.heroStage}>
        <p className={styles.heroWatermark} aria-hidden>
          {VESSEL_HERO.watermark}
        </p>

        {/* Tek portre kutusu, iki katman: mod değişince çapraz geçiş */}
        <div className={styles.portrait}>
          <span className={styles.portraitLayer} data-layer="itadori">
            <Image
              src={itadori.src}
              alt={pick(
                VESSEL_HERO.portraitAlt.itadori[
                  itadori.uploaded ? "uploaded" : "anilist"
                ],
                locale,
              )}
              fill
              sizes="420px"
              priority
              unoptimized={!itadori.uploaded}
            />
          </span>
          <span className={styles.portraitLayer} data-layer="sukuna">
            <Image
              src={sukuna.src}
              alt={pick(
                VESSEL_HERO.portraitAlt.sukuna[
                  sukuna.uploaded ? "uploaded" : "anilist"
                ],
                locale,
              )}
              fill
              sizes="420px"
              unoptimized={!sukuna.uploaded}
            />
          </span>
          {/* Lanetin işaretleri — yalnızca sukuna modunda çizilir */}
          <VesselFaceMarks
            className={styles.marks}
            drawClassName={styles.markStroke}
          />
          <span className={styles.portraitEdge} aria-hidden />
        </div>

        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroName} data-side="itadori">
              Yuuji Itadori
            </span>
            <span className={styles.heroSeamGlyph} aria-hidden />
            <span className={styles.heroName} data-side="sukuna">
              Ryōmen Sukuna
            </span>
          </h1>
          <p className={styles.heroNative} aria-hidden>
            虎杖悠仁 <span className={styles.heroNativeSep}>·</span> 宿儺
          </p>
          <p className={styles.heroLede}>{pick(VESSEL_HERO.lede, locale)}</p>
          <p className={styles.heroHint}>{pick(VESSEL_HERO.scrollHint, locale)}</p>
        </div>
      </div>

      {isAdmin ? (
        <div className={styles.slotRow}>
          {slot(VESSEL_IMAGE_KEYS.portraitItadori)}
          {slot(VESSEL_IMAGE_KEYS.portraitSukuna)}
        </div>
      ) : null}
    </header>
  );

  /* ══ KÜNYE + LABORATUVAR + KAP ANLAŞMASI ═══════════════════════════ */
  const vowArt = src(VESSEL_IMAGE_KEYS.vow);
  const dossier = (
    <>
      <section className={styles.dossier} aria-labelledby="vessel-dossier-title">
        <header className={styles.sectionHead}>
          <h2 id="vessel-dossier-title" className={styles.sectionTitle}>
            {pick(VESSEL_DOSSIER_TITLE.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(VESSEL_DOSSIER_TITLE.lede, locale)}
          </p>
        </header>
        <div className={styles.columns}>
          {VESSEL_COLUMNS.map((column) => (
            <article
              key={column.mode}
              className={styles.column}
              data-side={column.mode}
            >
              <VesselSigil mode={column.mode} className={styles.columnSigil} />
              <p className={styles.columnNative} aria-hidden>
                {column.native}
              </p>
              <h3 className={styles.columnName}>{column.name}</h3>
              <p className={styles.columnAliases}>
                {pick(column.aliases, locale)}
              </p>
              <p className={styles.columnLine}>{pick(column.line, locale)}</p>
              <dl className={styles.facts}>
                {column.facts.map((fact) => (
                  <div key={fact.label.tr} className={styles.fact}>
                    <dt>{pick(fact.label, locale)}</dt>
                    <dd>{pick(fact.value, locale)}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.lab} aria-labelledby="vessel-lab-title">
        <header className={styles.sectionHead}>
          <h2 id="vessel-lab-title" className={styles.sectionTitle}>
            {pick(VESSEL_LAB_TITLE.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(VESSEL_LAB_TITLE.lede, locale)}
          </p>
          <a className={styles.jumpLink} href="#kontrol">
            {pick(VESSEL_SWITCH.backLink, locale)}
          </a>
        </header>

        <div className={styles.labColumns}>
          <div className={styles.labColumn} data-side="itadori">
            <h3 className={styles.labHeading}>
              {pick(VESSEL_LAB_TITLE.itadoriHeading, locale)}
            </h3>
            <ul className={styles.cardStack}>
              {VESSEL_ITADORI_TECHNIQUES.map((technique, index) =>
                /* Itadori'nin birincili İLK kart: onun gücü zemin, zirve değil */
                renderCard(technique, index === 0),
              )}
            </ul>
          </div>
          <div className={styles.labColumn} data-side="sukuna">
            <h3 className={styles.labHeading}>
              {pick(VESSEL_LAB_TITLE.sukunaHeading, locale)}
            </h3>
            <ul className={styles.cardStack}>
              {VESSEL_SUKUNA_TECHNIQUES.map((technique, index) =>
                /* Sukuna'nın birincili SON kart: tapınak bir crescendo */
                renderCard(
                  technique,
                  index === VESSEL_SUKUNA_TECHNIQUES.length - 1,
                ),
              )}
            </ul>
          </div>
        </div>

        <ul className={styles.minorRow}>
          {VESSEL_MINOR.map((minor) => {
            const art = src(minor.imageKey);
            return (
              <li
                key={minor.key}
                className={styles.minor}
                data-owner={minor.owner}
              >
                {art ? (
                  <span className={styles.minorArt} aria-hidden>
                    <Image src={art} alt="" fill sizes="420px" />
                  </span>
                ) : null}
                <span className={styles.minorKanji} aria-hidden>
                  {minor.kanji}
                </span>
                <span className={styles.minorName}>{minor.name}</span>
                <span className={styles.minorNote}>
                  {pick(minor.note, locale)}
                </span>
                {slot(minor.imageKey)}
              </li>
            );
          })}
        </ul>
      </section>

      {/* İki sütunu tek gövdede birleştiren bölüm */}
      <section className={styles.vow} aria-labelledby="vessel-vow-title">
        <header className={styles.vowHead}>
          <p className={styles.vowKanji} aria-hidden>
            {VESSEL_VOW.kanji}
          </p>
          <h2 id="vessel-vow-title" className={styles.sectionTitle}>
            {pick(VESSEL_VOW.title, locale)}
          </h2>
          <p className={styles.sectionLede}>{pick(VESSEL_VOW.lede, locale)}</p>
        </header>

        {vowArt ? (
          <span className={styles.vowArt} aria-hidden>
            <Image src={vowArt} alt="" fill sizes="1280px" />
            <span className={styles.vowArtVeil} />
          </span>
        ) : null}

        <ol className={styles.clauses}>
          {VESSEL_VOW.clauses.map((clause) => (
            <li key={clause.key} className={styles.clause}>
              <span className={styles.clauseIndex} aria-hidden>
                {clause.index}
              </span>
              <h3 className={styles.clauseTitle}>{pick(clause.title, locale)}</h3>
              <p className={styles.clauseText}>{pick(clause.text, locale)}</p>
            </li>
          ))}
        </ol>

        {isAdmin ? (
          <div className={styles.slotRow}>{slot(VESSEL_IMAGE_KEYS.vow)}</div>
        ) : null}
      </section>
    </>
  );

  /* ══ KADER ÇİZELGESİ + ÇEVRE + KAPANIŞ ═════════════════════════════ */
  const chronicle = (
    <>
      <section className={styles.timeline} aria-labelledby="vessel-timeline-title">
        <header className={styles.sectionHead}>
          <h2 id="vessel-timeline-title" className={styles.sectionTitle}>
            {pick(VESSEL_TIMELINE_TITLE.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(VESSEL_TIMELINE_TITLE.lede, locale)}
          </p>
        </header>

        <ol className={styles.eras}>
          {VESSEL_TIMELINE.map((era, index) => {
            const art = src(era.imageKey);
            const holder =
              era.control === "split"
                ? `${sideName.itadori} / ${sideName.sukuna}`
                : sideName[era.control];
            return (
              <li
                key={era.key}
                className={styles.era}
                data-side={index % 2 === 0 ? "left" : "right"}
                data-control={era.control}
              >
                <span className={styles.eraArt} aria-hidden>
                  {art ? <Image src={art} alt="" fill sizes="960px" /> : null}
                  <span className={styles.eraScrim} />
                  <CleaveMark className={styles.eraMark} />
                </span>
                <div className={styles.eraBody}>
                  <p className={styles.eraWhen}>{pick(era.when, locale)}</p>
                  <h3 className={styles.eraTitle}>{pick(era.title, locale)}</h3>
                  <p className={styles.eraText}>{pick(era.text, locale)}</p>
                  <p className={styles.eraControl}>
                    <span className={styles.eraControlLabel}>
                      {pick(VESSEL_TIMELINE_TITLE.controlLabel, locale)}
                    </span>
                    <span className={styles.eraControlValue}>{holder}</span>
                    <span className={styles.eraControlTrack} aria-hidden />
                  </p>
                  {era.quote ? (
                    <figure className={styles.eraQuote}>
                      <blockquote>
                        &ldquo;{pick(era.quote.text, locale)}&rdquo;
                      </blockquote>
                      <figcaption>{pick(era.quote.by, locale)}</figcaption>
                    </figure>
                  ) : null}
                </div>
                {slot(era.imageKey)}
              </li>
            );
          })}
        </ol>
      </section>

      <section className={styles.circle} aria-labelledby="vessel-circle-title">
        <header className={styles.sectionHead}>
          <h2 id="vessel-circle-title" className={styles.sectionTitle}>
            {pick(VESSEL_CIRCLE_TITLE.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(VESSEL_CIRCLE_TITLE.lede, locale)}
          </p>
        </header>
        <ul className={styles.circleRow}>
          {VESSEL_CIRCLE.map((person) => {
            const portrait =
              src(person.imageKey) ?? portraits.get(person.characterId) ?? null;
            return (
              <li key={person.characterId} className={styles.plate}>
                <span className={styles.plateFace}>
                  {portrait ? (
                    <Image
                      src={portrait}
                      alt={`${person.name} — ${pick(VESSEL_CIRCLE_TITLE.altSuffix, locale)}`}
                      fill
                      sizes="240px"
                    />
                  ) : (
                    /* Portre yoksa ad kendi yazısıyla durur — bölüm çökmez */
                    <span className={styles.plateGlyph} aria-hidden>
                      {person.native}
                    </span>
                  )}
                </span>
                <span className={styles.plateBody}>
                  <span className={styles.plateNative} aria-hidden>
                    {person.native}
                  </span>
                  <span className={styles.plateName}>{person.name}</span>
                  <span className={styles.plateNote}>
                    {pick(person.note, locale)}
                  </span>
                </span>
                {slot(person.imageKey)}
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.closing} aria-labelledby="vessel-closing-title">
        <p className={styles.closingWatermark} aria-hidden>
          {VESSEL_CLOSING.watermark}
        </p>
        <header className={styles.sectionHead}>
          <h2 id="vessel-closing-title" className={styles.sectionTitle}>
            {pick(VESSEL_CLOSING.title, locale)}
          </h2>
          <p className={styles.sectionLede}>{pick(VESSEL_CLOSING.lede, locale)}</p>
        </header>

        <div className={styles.quotePair}>
          {VESSEL_CLOSING.quotes.map((quote) => (
            <figure key={quote.mode} className={styles.quote} data-side={quote.mode}>
              <p className={styles.quoteNative} aria-hidden>
                {quote.native}
              </p>
              <blockquote>&ldquo;{pick(quote.text, locale)}&rdquo;</blockquote>
              <figcaption>{pick(quote.by, locale)}</figcaption>
            </figure>
          ))}
        </div>

        <a className={styles.jumpLink} href="#kontrol">
          {pick(VESSEL_SWITCH.backLink, locale)}
        </a>

        <p className={styles.credit}>
          {pick(VESSEL_CLOSING.credit, locale)}{" "}
          <a href={VESSEL_ANILIST_LINKS.itadori} rel="noreferrer noopener">
            {pick(VESSEL_CLOSING.creditLinkLabel, locale)} · 127212
          </a>
          <span aria-hidden> · </span>
          <a href={VESSEL_ANILIST_LINKS.sukuna} rel="noreferrer noopener">
            {pick(VESSEL_CLOSING.creditLinkLabel, locale)} · 133701
          </a>
        </p>
      </section>
    </>
  );

  return (
    <CuratorFrame isAdmin={isAdmin}>
      <VesselShell
        initialVessel={initialVessel}
        labels={{
          question: pick(VESSEL_SWITCH.question, locale),
          note: pick(VESSEL_SWITCH.note, locale),
          itadori: {
            name: VESSEL_SWITCH.itadori.name,
            native: VESSEL_SWITCH.itadori.native,
            role: pick(VESSEL_SWITCH.itadori.role, locale),
          },
          sukuna: {
            name: VESSEL_SWITCH.sukuna.name,
            native: VESSEL_SWITCH.sukuna.native,
            role: pick(VESSEL_SWITCH.sukuna.role, locale),
          },
        }}
        rail={{
          kanji: VESSEL_RAIL.kanji,
          title: pick(VESSEL_RAIL.title, locale),
          lede: pick(VESSEL_RAIL.lede, locale),
          hint: pick(VESSEL_RAIL.hint, locale),
          groupLabel: pick(VESSEL_RAIL.groupLabel, locale),
          fingerLabel: pick(VESSEL_RAIL.fingerLabel, locale),
          readoutLabel: pick(VESSEL_RAIL.readoutLabel, locale),
          remainingLabel: pick(VESSEL_RAIL.remainingLabel, locale),
          milestoneBadge: pick(VESSEL_RAIL.milestoneBadge, locale),
          betweenNote: pick(VESSEL_RAIL.betweenNote, locale),
          milestones: VESSEL_RAIL.milestones.map((stone) => ({
            count: stone.count,
            key: stone.key,
            label: pick(stone.label, locale),
            title: pick(stone.title, locale),
            text: pick(stone.text, locale),
          })),
          slot: isAdmin ? (
            <div className={styles.slotRow}>{slot(VESSEL_IMAGE_KEYS.finger)}</div>
          ) : null,
        }}
        hero={hero}
        dossier={dossier}
        chronicle={chronicle}
      />
    </CuratorFrame>
  );
}
