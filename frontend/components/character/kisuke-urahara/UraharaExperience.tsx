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
import {
  URAHARA_ALT,
  URAHARA_CLOSING,
  URAHARA_DRAWERS,
  URAHARA_DRAWERS_TITLE,
  URAHARA_ID,
  URAHARA_IDENTITY,
  URAHARA_IMAGE_KEYS,
  URAHARA_LAB_TITLE,
  URAHARA_LEDGER,
  URAHARA_LEDGER_TITLE,
  URAHARA_MODE_TEXT,
  URAHARA_RECORD_TITLE,
  URAHARA_SLOT_LABELS,
  URAHARA_TECHNIQUES,
  URAHARA_TIMELINE,
  URAHARA_TIMELINE_TITLE,
  URAHARA_TOOLS,
  type UraharaImageKey,
} from "@/lib/characters/kisuke-urahara-experience";
import { animeHref } from "@/lib/anime/routes";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { ShopShell } from "./ShopShell";
import { DrawerCabinet } from "./DrawerCabinet";
import { ShopGlyphMark } from "./ShopGlyphs";
import styles from "./UraharaExperience.module.css";

/**
 * Kisuke Urahara — deneyim sayfası. Konsept: **Urahara Dükkânı.**
 *
 * Diğer on iki karakter sayfası bir portre ya da bir savaş; bu sayfanın
 * ayırt edici özelliği bir MEKÂN olması. Ziyaretçi bir dosya değil bir oda
 * açıyor: noren perdesi, ahşap raflar, hasır zemin, fener ışığı ve dokuz
 * kapalı çekmece.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   · ShopShell     — "Benihime modu" (tek durum + context)
 *   · DrawerCabinet — dokuz çekmece ve fenerin parlaklığı
 * İkisi de metinleri düz dize olarak alır; `LocalizedText` istemciye inmez.
 *
 * Görseller: characterId 210 kaydının ABILITY yuvaları (`urahara:*`).
 * Hiçbir bölüm görsele bağımlı değil — küratör tek görsel yüklemese de
 * sayfa eksiksiz açılır, çünkü mekânın kendisi CSS ve elle çizilmiş SVG.
 */

export function UraharaExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const src = (key: UraharaImageKey): string | null => ability.get(key) ?? null;
  const faces = companionPortraits(companions);
  const portrait = primaryPortrait(detail);

  const slot = (key: UraharaImageKey) =>
    isAdmin ? (
      <CuratorSlot
        characterId={URAHARA_ID}
        slot="ABILITY"
        abilityName={key}
        label={pick(URAHARA_SLOT_LABELS[key], locale)}
      />
    ) : null;

  const shopImage = src(URAHARA_IMAGE_KEYS.shop);

  /* Çekmeceler istemciye düz dize olarak iner; erişilebilir ad burada,
     sunucuda kuruluyor (şablondaki {n} sıra, {t} kapaktaki tek kelime) */
  const ariaTemplate = pick(URAHARA_DRAWERS_TITLE.ariaTemplate, locale);
  const drawers = URAHARA_DRAWERS.map((drawer, index) => {
    const teaser = pick(drawer.teaser, locale);
    return {
      key: drawer.key,
      numeral: drawer.numeral,
      kanji: drawer.kanji,
      glyph: drawer.glyph,
      teaser,
      name: drawer.name,
      title: pick(drawer.title, locale),
      text: pick(drawer.text, locale),
      aria: ariaTemplate
        .replace("{n}", String(index + 1))
        .replace("{t}", teaser),
    };
  });

  return (
    <ShopShell
      enterLabel={pick(URAHARA_MODE_TEXT.enter, locale)}
      exitLabel={pick(URAHARA_MODE_TEXT.exit, locale)}
      bannerLabel={pick(URAHARA_MODE_TEXT.banner, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <span className={styles.crumbHere}>{URAHARA_IDENTITY.shopSign}</span>
        </nav>

        {/* ══ 1 · DÜKKÂNIN ÖNÜ ══════════════════════════════════════════ */}
        <section className={styles.hero} aria-labelledby="urahara-name">
          {/* Noren: şapkanın yeşil-beyaz şeridi, kapının üstünde perde */}
          <span className={styles.noren} aria-hidden>
            <span className={styles.norenSlit} />
          </span>

          <span className={styles.heroScene} aria-hidden>
            {shopImage ? (
              <Image src={shopImage} alt="" fill sizes="1600px" priority />
            ) : null}
            <span className={styles.heroShelves} />
            <span className={styles.heroLantern} />
            <span className={styles.dust} />
          </span>

          <div className={styles.heroInner}>
            <div className={styles.portraitFrame}>
              {portrait ? (
                <Image
                  src={portrait}
                  alt={pick(URAHARA_ALT.portrait, locale)}
                  fill
                  sizes="260px"
                  className={styles.portraitImg}
                  unoptimized={!isUploadedPortrait(detail)}
                  priority
                />
              ) : (
                <ShopGlyphMark name="hat" className={styles.portraitFallback} />
              )}
              {/* Şapkanın altındaki gölge — portrenin yarısı karanlıkta */}
              <span className={styles.brimShadow} aria-hidden />
              <span className={styles.portraitPlate} aria-hidden>
                {URAHARA_IDENTITY.openPlate}
              </span>
            </div>

            <div className={styles.heroText}>
              <span className={styles.signWatermark} aria-hidden>
                {URAHARA_IDENTITY.shopSign}
              </span>
              <h1 id="urahara-name" className={styles.name}>
                {URAHARA_IDENTITY.name}
              </h1>
              <p className={styles.native} aria-hidden>
                {URAHARA_IDENTITY.nativeName}
              </p>
              <p className={styles.alias}>{pick(URAHARA_IDENTITY.alias, locale)}</p>
              <p className={styles.epigraph}>
                {pick(URAHARA_IDENTITY.epigraph, locale)}
              </p>
              <p className={styles.openRow}>
                <ShopGlyphMark name="geta" className={styles.openIcon} />
                <span>{pick(URAHARA_IDENTITY.openPlateText, locale)}</span>
              </p>
            </div>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>{slot(URAHARA_IMAGE_KEYS.shop)}</div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE — HASIR ZEMİN ═══════════════════════════════════ */}
        <section className={styles.record} aria-labelledby="urahara-record">
          <header className={styles.sectionHead}>
            <h2 id="urahara-record" className={styles.sectionTitle}>
              {pick(URAHARA_RECORD_TITLE.title, locale)}
            </h2>
          </header>
          <dl className={styles.tatami}>
            {URAHARA_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.mat}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · ARKA ODA — GÜÇ LABORATUVARI ═══════════════════════════ */}
        <section className={styles.lab} aria-labelledby="urahara-lab">
          <header className={styles.sectionHead}>
            <h2 id="urahara-lab" className={styles.sectionTitle}>
              {pick(URAHARA_LAB_TITLE.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(URAHARA_LAB_TITLE.lede, locale)}
            </p>
          </header>

          <ul className={styles.shelf}>
            {URAHARA_TECHNIQUES.map((technique) => {
              const image = src(technique.imageKey);
              return (
                <li
                  key={technique.key}
                  className={styles.crate}
                  data-technique={technique.key}
                >
                  <span className={styles.crateArt} aria-hidden>
                    {image ? (
                      <Image src={image} alt="" fill sizes="900px" />
                    ) : null}
                    <span className={styles.crateGrain} />
                    <span className={styles.crateKanji}>{technique.kanji}</span>
                  </span>
                  <div className={styles.crateBody}>
                    <p className={styles.crateName}>{technique.name}</p>
                    <p className={styles.crateTagline}>
                      {pick(technique.tagline, locale)}
                    </p>
                    {technique.release ? (
                      <p className={styles.release}>
                        <span className={styles.releaseNative}>
                          {technique.release.native}
                        </span>
                        <span className={styles.releaseText}>
                          {pick(technique.release.text, locale)}
                        </span>
                      </p>
                    ) : null}
                    <p className={styles.crateText}>
                      {pick(technique.text, locale)}
                    </p>
                    <ul className={styles.tagRow}>
                      {technique.traits.map((trait) => (
                        <li key={trait.tr} className={styles.tag}>
                          {pick(trait, locale)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {slot(technique.imageKey)}
                </li>
              );
            })}
          </ul>

          <ul className={styles.jarRow}>
            {URAHARA_TOOLS.map((tool) => {
              const image = src(tool.imageKey);
              return (
                <li key={tool.key} className={styles.jar}>
                  <span className={styles.jarArt} aria-hidden>
                    {image ? (
                      <Image src={image} alt="" fill sizes="420px" />
                    ) : null}
                    <span className={styles.jarKanji}>{tool.kanji}</span>
                  </span>
                  <div className={styles.jarBody}>
                    <p className={styles.jarName}>{tool.name}</p>
                    <p className={styles.jarNote}>{pick(tool.note, locale)}</p>
                  </div>
                  {slot(tool.imageKey)}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · KAPALI ÇEKMECELER — SAYFANIN KALBİ ════════════════════ */}
        <section className={styles.drawers} aria-labelledby="urahara-drawers">
          <header className={styles.sectionHead}>
            <h2 id="urahara-drawers" className={styles.sectionTitle}>
              {pick(URAHARA_DRAWERS_TITLE.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(URAHARA_DRAWERS_TITLE.lede, locale)}
            </p>
          </header>
          <DrawerCabinet
            drawers={drawers}
            statusTemplate={pick(URAHARA_DRAWERS_TITLE.countTemplate, locale)}
            lampLabel={pick(URAHARA_DRAWERS_TITLE.lampLabel, locale)}
          />
        </section>

        {/* ══ 5 · DÜKKÂNIN DEFTERİ ══════════════════════════════════════ */}
        <section className={styles.ledger} aria-labelledby="urahara-ledger">
          <header className={styles.sectionHead}>
            <h2 id="urahara-ledger" className={styles.sectionTitle}>
              {pick(URAHARA_LEDGER_TITLE.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(URAHARA_LEDGER_TITLE.lede, locale)}
            </p>
          </header>
          <ul className={styles.ledgerList}>
            {URAHARA_LEDGER.map((row) => {
              const face = faces.get(row.characterId) ?? null;
              return (
                <li key={row.characterId} className={styles.ledgerRow}>
                  <span className={styles.ledgerFace}>
                    {face ? (
                      <Image
                        src={face}
                        alt={pick(URAHARA_ALT.ledger, locale).replace(
                          "{name}",
                          row.name,
                        )}
                        fill
                        sizes="120px"
                      />
                    ) : (
                      /* Portre kaydımızda yok (Bleach kadrosu) — ad tahta
                         künyede yazıyla duruyor, bölüm çökmüyor */
                      <span className={styles.ledgerTag} aria-hidden>
                        {row.native}
                      </span>
                    )}
                  </span>
                  <div className={styles.ledgerBody}>
                    <p className={styles.ledgerName}>
                      {row.name}
                      <span className={styles.ledgerNative} aria-hidden>
                        {row.native}
                      </span>
                    </p>
                    <p className={styles.ledgerNote}>{pick(row.note, locale)}</p>
                  </div>
                  <span className={styles.ledgerEntry}>
                    {pick(row.entry, locale)}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 6 · DÜKKÂNA GİDEN YOL ═════════════════════════════════════ */}
        <section className={styles.road} aria-labelledby="urahara-road">
          <header className={styles.sectionHead}>
            <h2 id="urahara-road" className={styles.sectionTitle}>
              {pick(URAHARA_TIMELINE_TITLE.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(URAHARA_TIMELINE_TITLE.lede, locale)}
            </p>
          </header>
          <ol className={styles.roadList}>
            {URAHARA_TIMELINE.map((era) => {
              const image = src(era.imageKey);
              return (
                <li key={era.key} className={styles.stop} data-era={era.key}>
                  <span className={styles.stopMark} aria-hidden>
                    <ShopGlyphMark
                      name={era.glyph}
                      className={styles.stopGlyph}
                    />
                  </span>
                  <div className={styles.stopBody}>
                    <p className={styles.stopAge}>{pick(era.age, locale)}</p>
                    <h3 className={styles.stopTitle}>{pick(era.title, locale)}</h3>
                    <p className={styles.stopText}>{pick(era.text, locale)}</p>
                    {era.quote ? (
                      <figure className={styles.stopQuote}>
                        <blockquote>
                          &ldquo;{pick(era.quote.text, locale)}&rdquo;
                        </blockquote>
                        <figcaption>
                          <span aria-hidden>{era.quote.native}</span>
                          <span>{pick(era.quote.note, locale)}</span>
                        </figcaption>
                      </figure>
                    ) : null}
                  </div>
                  {/* Görsel yoksa kadraj HİÇ çizilmiyor: boş bir kutu
                      kırık görsel gibi görünürdü, metin sütunu genişliyor */}
                  {image ? (
                    <span className={styles.stopArt} aria-hidden>
                      <Image src={image} alt="" fill sizes="720px" />
                      <span className={styles.stopScrim} />
                    </span>
                  ) : null}
                  {slot(era.imageKey)}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 7 · KAPANIŞ ═══════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="urahara-closing">
          <h2 id="urahara-closing" className={styles.visuallyHidden}>
            {pick(URAHARA_CLOSING.title, locale)}
          </h2>
          {URAHARA_CLOSING.quotes.map((quote) => (
            <figure key={quote.text.tr} className={styles.finalQuote}>
              <blockquote>&ldquo;{pick(quote.text, locale)}&rdquo;</blockquote>
              <figcaption>{pick(quote.note, locale)}</figcaption>
            </figure>
          ))}
          <p className={styles.motto} aria-hidden>
            {URAHARA_CLOSING.motto.native}
          </p>
          <p className={styles.mottoText}>
            {pick(URAHARA_CLOSING.motto.text, locale)}
          </p>
          <p className={styles.credit}>
            {pick(URAHARA_CLOSING.credit, locale)}{" "}
            <a
              className={styles.creditLink}
              href={URAHARA_CLOSING.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {pick(URAHARA_CLOSING.creditLink, locale)}
            </a>
          </p>
        </section>
      </CuratorFrame>
    </ShopShell>
  );
}
