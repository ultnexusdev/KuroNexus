import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
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
  KENPACHI_BONDS,
  KENPACHI_CLOSING,
  KENPACHI_FATE,
  KENPACHI_GALLERY,
  KENPACHI_HERO,
  KENPACHI_ID,
  KENPACHI_IDENTITY,
  KENPACHI_IMAGE_KEYS,
  KENPACHI_LAB,
  KENPACHI_MODE,
  KENPACHI_OUTCOME,
  KENPACHI_RAIL,
  KENPACHI_SLOT_LABELS,
} from "@/lib/characters/kenpachi-zaraki-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { KenpachiShell } from "./KenpachiShell";
import { NotchRail, type RailNotch } from "./NotchRail";
import {
  BellCluster,
  EyePatchMark,
  RestraintMark,
  ScarLine,
} from "./KenpachiMarks";
import styles from "./KenpachiExperience.module.css";

/**
 * Kenpachi Zaraki — ÇENTİK SAYACI deneyim sayfası.
 *
 * /karakterler/909 buraya dallanır. Sayfanın düzeni bilerek kaba ve
 * asimetrik: bloklar hizalanmıyor, kenarlar kalın, köşeler `clip-path` ile
 * kesik. Diğer karakter sayfaları düzenli; bu adam düzenli değil.
 *
 * Duraklar: Hero → Künye → Arşiv kareleri → Kesme Odası → ÇENTİK SAYACI →
 * Kader Çizelgesi → Yanındakiler → Kapanış.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   · KenpachiShell — "Kenpachi modu" (tek durum, etkisi tamamen CSS'te)
 *   · NotchRail     — çentik sayacı (sekme deseni, ok tuşlarıyla gezinir)
 * Metinler burada `pick` ile seçilip adalara DÜZ DİZE olarak iniyor.
 *
 * Görseller: PORTRAIT + dört GALLERY + iki ABILITY zaten yüklü
 * ("Bankai", "Shikai — Nozarashi" — anahtarları serbest metin, EZİLMEDİ).
 * Yeni yuvalar `kenpachi:` önekiyle açıldı; hiçbiri zorunlu değil, görsel
 * inmediğinde bölüm görselsiz ama ayakta kalıyor.
 */
export function KenpachiExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const faces = companionPortraits(companions);
  const portrait = primaryPortrait(detail);
  const portraitUnoptimized = !isUploadedPortrait(detail);

  /** Yetenek yuvası → adres; yoksa null (bölüm görselsiz çizilir) */
  const src = (key: string): string | null => ability.get(key) ?? null;

  /* GALLERY yuvası `abilityName` taşımıyor, o yüzden ayrı okunuyor */
  const gallery = (detail.images ?? [])
    .filter((row) => row.slot === "GALLERY")
    .map((row) => ({ id: row.id, url: apiUrl(row.url) }));

  const slotLabel = (key: string): string => {
    const label = KENPACHI_SLOT_LABELS[key];
    return label ? pick(label, locale) : key;
  };

  /* Çentikler ada için düz dizeye çevriliyor */
  const railNotches: RailNotch[] = KENPACHI_RAIL.notches.map((notch) => ({
    key: notch.key,
    index: notch.index,
    opponent: notch.opponent,
    arc: pick(notch.arc, locale),
    outcome: notch.outcome,
    outcomeLabel: pick(KENPACHI_OUTCOME[notch.outcome], locale),
    what: pick(notch.what, locale),
    learned: pick(notch.learned, locale),
    image: src(notch.imageKey),
    imageAlt: pick(notch.imageAlt, locale),
    href: notch.opponentCharacterId
      ? animeHref.character(notch.opponentCharacterId)
      : null,
    portrait: notch.opponentCharacterId
      ? (faces.get(notch.opponentCharacterId) ?? null)
      : null,
    portraitAlt: `${notch.opponent} — ${pick(KENPACHI_BONDS.portraitAlt, locale)}`,
  }));

  const heroBand = src(KENPACHI_IMAGE_KEYS.heroBand);

  return (
    <KenpachiShell
      enterLabel={pick(KENPACHI_MODE.enter, locale)}
      exitLabel={pick(KENPACHI_MODE.exit, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ／
          </span>
          <span className={styles.crumbHere}>Bleach</span>
        </nav>

        {/* ══ 1 · HERO ══════════════════════════════════════════════ */}
        <section className={styles.hero} aria-labelledby="knp-name">
          {heroBand ? (
            <span className={styles.heroBand} aria-hidden>
              <Image
                src={heroBand}
                alt=""
                fill
                sizes="100vw"
                priority
                className={styles.heroBandImg}
              />
            </span>
          ) : null}

          <div className={styles.heroType}>
            <p className={styles.heroWatermark} aria-hidden>
              {KENPACHI_HERO.watermark}
            </p>
            <h1 id="knp-name" className={styles.heroName}>
              <span className={styles.heroNameInk}>{KENPACHI_HERO.name}</span>
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {KENPACHI_HERO.nativeName}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(KENPACHI_HERO.epigraph, locale)}
            </p>
          </div>

          <div className={styles.heroPortrait}>
            {portrait ? (
              <span className={styles.portraitFrame}>
                <Image
                  src={portrait}
                  alt={pick(KENPACHI_HERO.portraitAlt, locale)}
                  fill
                  sizes="(max-width: 900px) 92vw, 420px"
                  priority
                  unoptimized={portraitUnoptimized}
                  className={styles.portraitImg}
                />
                {/* Yara izi portrenin üstünde — elle çizilmiş SVG */}
                <ScarLine
                  className={styles.scar}
                  strokeClassName={styles.scarStroke}
                />
              </span>
            ) : null}
            <p className={styles.divisionBadge} aria-hidden>
              {KENPACHI_HERO.divisionKanji}
            </p>
          </div>

          <ul className={styles.markList}>
            {KENPACHI_HERO.marks.map((mark) => (
              <li key={mark.key} className={styles.markItem} data-mark={mark.key}>
                <span className={styles.markArt} aria-hidden>
                  {mark.key === "patch" ? (
                    <EyePatchMark className={styles.markPatch} />
                  ) : null}
                  {mark.key === "bells" ? (
                    <BellCluster
                      className={styles.markBells}
                      swingClassName={styles.bellSwing}
                    />
                  ) : null}
                  {mark.key === "scar" ? (
                    <ScarLine
                      className={styles.markScar}
                      strokeClassName={styles.scarStroke}
                    />
                  ) : null}
                </span>
                <span className={styles.markBody}>
                  <span className={styles.markLabel}>
                    {pick(mark.label, locale)}
                  </span>
                  <span className={styles.markNote}>
                    {pick(mark.note, locale)}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <p className={styles.modeNote}>{pick(KENPACHI_MODE.note, locale)}</p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={KENPACHI_ID}
                slot="ABILITY"
                abilityName={KENPACHI_IMAGE_KEYS.heroBand}
                label={slotLabel(KENPACHI_IMAGE_KEYS.heroBand)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ŞERİDİ ══════════════════════════════════════ */}
        <section className={styles.identity} aria-labelledby="knp-identity">
          <header className={styles.sectionHead} data-align="left">
            <h2 id="knp-identity" className={styles.sectionTitle}>
              {pick(KENPACHI_IDENTITY.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KENPACHI_IDENTITY.lede, locale)}
            </p>
          </header>
          <dl className={styles.factGrid}>
            {KENPACHI_IDENTITY.facts.map((fact) => (
              <div
                key={fact.key}
                className={styles.fact}
                data-missing={"missing" in fact && fact.missing ? "true" : undefined}
              >
                <dt className={styles.factLabel}>{pick(fact.label, locale)}</dt>
                <dd className={styles.factValue}>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · ARŞİV KARELERİ ════════════════════════════════════ */}
        {gallery.length > 0 ? (
          <section className={styles.frames} aria-labelledby="knp-frames">
            <header className={styles.sectionHead} data-align="right">
              <h2 id="knp-frames" className={styles.sectionTitle}>
                {pick(KENPACHI_GALLERY.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(KENPACHI_GALLERY.note, locale)}
              </p>
            </header>
            <ul className={styles.frameRow}>
              {gallery.map((frame, index) => (
                <li key={frame.id} className={styles.frameItem}>
                  <Image
                    src={frame.url}
                    alt={`${pick(KENPACHI_GALLERY.alt, locale)} ${index + 1}`}
                    fill
                    sizes="(max-width: 900px) 80vw, 340px"
                    className={styles.frameImg}
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ══ 4 · KESME ODASI ═══════════════════════════════════════ */}
        <section className={styles.lab} aria-labelledby="knp-lab">
          <header className={styles.sectionHead} data-align="right">
            <h2 id="knp-lab" className={styles.sectionTitle}>
              {pick(KENPACHI_LAB.title, locale)}
            </h2>
            <p className={styles.sectionLede}>{pick(KENPACHI_LAB.lede, locale)}</p>
          </header>

          <ul className={styles.powerStack}>
            {KENPACHI_LAB.powers.map((power) => {
              const image = power.imageKey ? src(power.imageKey) : null;
              return (
                <li
                  key={power.key}
                  className={styles.power}
                  data-power={power.key}
                >
                  <div className={styles.powerArt}>
                    {image && power.imageAlt ? (
                      <Image
                        src={image}
                        alt={pick(power.imageAlt, locale)}
                        fill
                        sizes="(max-width: 900px) 100vw, 560px"
                        className={styles.powerImg}
                      />
                    ) : (
                      <span className={styles.powerEmpty} aria-hidden>
                        {power.kanji}
                      </span>
                    )}
                    <span className={styles.powerScrim} aria-hidden />
                  </div>
                  <div className={styles.powerBody}>
                    <p className={styles.powerKanji} aria-hidden>
                      {power.kanji}
                    </p>
                    <h3 className={styles.powerName}>{power.name}</h3>
                    <p className={styles.powerTagline}>
                      {pick(power.tagline, locale)}
                    </p>
                    {power.release ? (
                      <p className={styles.powerRelease}>
                        &ldquo;{pick(power.release, locale)}&rdquo;
                      </p>
                    ) : null}
                    <p className={styles.powerText}>{pick(power.text, locale)}</p>
                    <ul className={styles.traitRow}>
                      {power.traits.map((trait) => (
                        <li key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {isAdmin && power.imageKey ? (
                    <CuratorSlot
                      characterId={KENPACHI_ID}
                      slot="ABILITY"
                      abilityName={power.imageKey}
                      label={slotLabel(power.imageKey)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>

          <div className={styles.restraints}>
            <h3 className={styles.restraintTitle}>
              {pick(KENPACHI_LAB.restraintsTitle, locale)}
            </h3>
            <p className={styles.restraintNote}>
              {pick(KENPACHI_LAB.restraintsNote, locale)}
            </p>
            <ul className={styles.restraintRow}>
              {KENPACHI_LAB.restraints.map((item) => (
                <li
                  key={item.key}
                  className={styles.restraint}
                  data-restraint={item.key}
                >
                  <RestraintMark
                    kind={item.mark}
                    className={styles.restraintMark}
                  />
                  <span className={styles.restraintName}>
                    {pick(item.name, locale)}
                  </span>
                  <span className={styles.restraintText}>
                    {pick(item.note, locale)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ══ 5 · ÇENTİK SAYACI ═════════════════════════════════════ */}
        <section className={styles.railSection} aria-labelledby="knp-rail">
          <header className={styles.sectionHead} data-align="left">
            <h2 id="knp-rail" className={styles.sectionTitle}>
              {pick(KENPACHI_RAIL.title, locale)}
            </h2>
            <p className={styles.sectionLede}>{pick(KENPACHI_RAIL.lede, locale)}</p>
          </header>

          <NotchRail
            notches={railNotches}
            listLabel={pick(KENPACHI_RAIL.title, locale)}
            counterLabel={pick(KENPACHI_RAIL.counterLabel, locale)}
            whatLabel={pick(KENPACHI_RAIL.whatLabel, locale)}
            learnedLabel={pick(KENPACHI_RAIL.learnedLabel, locale)}
            hint={pick(KENPACHI_RAIL.hint, locale)}
          />

          {isAdmin ? (
            <div className={styles.slotRow}>
              {KENPACHI_RAIL.notches.map((notch) => (
                <CuratorSlot
                  key={notch.imageKey}
                  characterId={KENPACHI_ID}
                  slot="ABILITY"
                  abilityName={notch.imageKey}
                  label={slotLabel(notch.imageKey)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 6 · KADER ÇİZELGESİ ═══════════════════════════════════ */}
        <section className={styles.fate} aria-labelledby="knp-fate">
          <header className={styles.sectionHead} data-align="right">
            <h2 id="knp-fate" className={styles.sectionTitle}>
              {pick(KENPACHI_FATE.title, locale)}
            </h2>
            <p className={styles.sectionLede}>{pick(KENPACHI_FATE.lede, locale)}</p>
          </header>
          <ol className={styles.eraList}>
            {KENPACHI_FATE.eras.map((era, index) => (
              <li
                key={era.key}
                className={styles.era}
                data-side={index % 2 === 0 ? "left" : "right"}
              >
                <span className={styles.eraMarker}>{pick(era.marker, locale)}</span>
                <span className={styles.eraNotch} aria-hidden />
                <div className={styles.eraBody}>
                  <h3 className={styles.eraTitle}>{pick(era.title, locale)}</h3>
                  <p className={styles.eraText}>{pick(era.text, locale)}</p>
                  {era.quote ? (
                    <figure className={styles.eraQuote}>
                      <blockquote>
                        &ldquo;{pick(era.quote, locale)}&rdquo;
                      </blockquote>
                      {era.quoteNote ? (
                        <figcaption>{pick(era.quoteNote, locale)}</figcaption>
                      ) : null}
                    </figure>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ══ 7 · YANINDAKİLER ══════════════════════════════════════ */}
        <section className={styles.bonds} aria-labelledby="knp-bonds">
          <header className={styles.sectionHead} data-align="left">
            <h2 id="knp-bonds" className={styles.sectionTitle}>
              {pick(KENPACHI_BONDS.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KENPACHI_BONDS.lede, locale)}
            </p>
          </header>
          <ul className={styles.bondRow}>
            {KENPACHI_BONDS.bonds.map((bond) => {
              const face = bond.characterId
                ? (faces.get(bond.characterId) ?? null)
                : null;
              return (
                <li key={bond.name} className={styles.bond}>
                  {face ? (
                    <span className={styles.bondFace}>
                      <Image
                        src={face}
                        alt={`${bond.name} — ${pick(KENPACHI_BONDS.portraitAlt, locale)}`}
                        fill
                        sizes="120px"
                      />
                    </span>
                  ) : (
                    <span className={styles.bondInitial} aria-hidden>
                      {bond.name.slice(0, 1)}
                    </span>
                  )}
                  <span className={styles.bondBody}>
                    <span className={styles.bondName}>
                      {bond.characterId ? (
                        <Link
                          href={animeHref.character(bond.characterId)}
                          className={styles.bondLink}
                        >
                          {bond.name}
                        </Link>
                      ) : (
                        bond.name
                      )}
                    </span>
                    <span className={styles.bondRole}>
                      {pick(bond.role, locale)}
                    </span>
                    <span className={styles.bondNote}>
                      {pick(bond.note, locale)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 8 · KAPANIŞ ═══════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="knp-closing">
          <h2 id="knp-closing" className={styles.visuallyHidden}>
            {KENPACHI_HERO.name}
          </h2>

          {KENPACHI_CLOSING.quotes.map((quote) => (
            <figure key={quote.text.tr} className={styles.bigQuote}>
              <blockquote>&ldquo;{pick(quote.text, locale)}&rdquo;</blockquote>
              <figcaption>{pick(quote.note, locale)}</figcaption>
            </figure>
          ))}

          <div className={styles.motto}>
            <p className={styles.mottoGlyph} aria-hidden>
              {KENPACHI_CLOSING.motto.glyph}
            </p>
            <p className={styles.mottoReading}>
              {KENPACHI_CLOSING.motto.glyph}
              <span className={styles.mottoLatin}>
                {KENPACHI_CLOSING.motto.reading}
              </span>
            </p>
            <p className={styles.mottoMeaning}>
              {pick(KENPACHI_CLOSING.motto.meaning, locale)}
            </p>
          </div>

          <p className={styles.closingLine}>
            {pick(KENPACHI_CLOSING.closingLine, locale)}
          </p>

          <p className={styles.credit}>
            {pick(KENPACHI_CLOSING.credit, locale)}{" "}
            <a
              href={KENPACHI_CLOSING.creditHref}
              className={styles.creditLink}
              target="_blank"
              rel="noreferrer"
            >
              {pick(KENPACHI_CLOSING.creditLinkLabel, locale)}
            </a>
          </p>
        </section>
      </CuratorFrame>
    </KenpachiShell>
  );
}
