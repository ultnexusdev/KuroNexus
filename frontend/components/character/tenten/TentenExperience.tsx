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
  TENTEN_AIM,
  TENTEN_ALT,
  TENTEN_ARMS,
  TENTEN_ARSENAL,
  TENTEN_CLOSING,
  TENTEN_COMPANIONS,
  TENTEN_CRUMB,
  TENTEN_HERO,
  TENTEN_ID,
  TENTEN_IDENTITY,
  TENTEN_IMAGE_KEYS,
  TENTEN_MODE,
  TENTEN_SCROLL_UI,
  TENTEN_SECTIONS,
  TENTEN_SITE_URL,
  TENTEN_SLOT_LABELS,
  TENTEN_TIMELINE,
  TENTEN_TOOLS,
} from "@/lib/characters/tenten-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { ScrollShell } from "./ScrollShell";
import { WeaponScroll } from "./WeaponScroll";
import { TargetBoard, TasselRibbon, WeaponGlyph } from "./TentenArms";
import styles from "./TentenExperience.module.css";

/**
 * Tenten — "Silah Parşömeni" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/3710 bu bileşene dallanır
 * (rota dosyasındaki `EXPERIENCES` haritası).
 *
 * ── SAYFANIN FİKRİ ──────────────────────────────────────────────────────
 * ENVANTER. Diğer karakter sayfaları bir gücü anlatır; bu sayfa bir
 * CEPHANELİĞİ açar. Ortada dikey bir parşömen var ve aşağı doğru açılıyor;
 * her mühür karesi bir silahı tutuyor, açılan kare kapanmıyor ve çıkan
 * silah sayfanın arka planında birikiyor. Tomar sonuna kadar açıldığında
 * ziyaretçi bir cephaneliğin ortasında duruyor.
 *
 * Sayfanın duygusal merkezi tomar değil, ondan sonraki küçük bölüm:
 * yüz atıştan yüz isabet — ve bu ölçünün kimseyi etkilememesi.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   ScrollShell  — "Sōryū Tensakai" modu (tek boolean, etkinin tamamı CSS)
 *   WeaponScroll — açılan tomar (iki bağlı durum + klavye + SVG set)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 3710 kaydının ABILITY yuvaları (`tenten:*`).
 * Hiçbiri zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır.
 */
export function TentenExperience({
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
  const heroScene = src(TENTEN_IMAGE_KEYS.hero);
  const bullseye = src(TENTEN_IMAGE_KEYS.bullseye);
  const closingArt = src(TENTEN_IMAGE_KEYS.closing);

  const name = detail.character.name || TENTEN_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? TENTEN_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? TENTEN_SITE_URL;

  const arms = TENTEN_ARMS.map((arm) => ({
    key: arm.key,
    kanji: arm.kanji,
    name: arm.name,
    turkish: pick(arm.turkish, locale),
    note: pick(arm.note, locale),
    moment: pick(arm.moment, locale),
    image: src(arm.imageKey),
  }));

  return (
    <ScrollShell
      modeName={TENTEN_MODE.name}
      enterLabel={pick(TENTEN_MODE.enter, locale)}
      exitLabel={pick(TENTEN_MODE.exit, locale)}
      hint={pick(TENTEN_MODE.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(TENTEN_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO ════════════════════════════════════════════════════
            Portre dar kadrajda ve solda; sağda açılmış tomarın kenarı.
            Kırmızı püskül kadrajı yukarıdan aşağı kesiyor. */}
        <section className={styles.hero} aria-labelledby="ten-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <p className={styles.heroMark} aria-hidden>
            {TENTEN_IDENTITY.watermark}
          </p>

          <div className={styles.heroPortraitWrap}>
            {portrait ? (
              <span className={styles.heroPortrait}>
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? TENTEN_HERO.portraitAlt
                      : TENTEN_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="420px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              </span>
            ) : null}
            {/* Püskül: portrenin kenarından geçip kadrajın altına iniyor */}
            <TasselRibbon className={styles.tassel} />
          </div>

          <div className={styles.heroBody}>
            <p className={styles.heroTeam}>
              {pick(TENTEN_IDENTITY.team, locale)}
            </p>
            <h1 id="ten-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {nativeName}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(TENTEN_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(TENTEN_HERO.lede, locale)}</p>
            <p className={styles.heroCaption}>
              {pick(TENTEN_HERO.tasselCaption, locale)}
            </p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={TENTEN_ID}
                slot="ABILITY"
                abilityName={TENTEN_IMAGE_KEYS.hero}
                label={pick(
                  TENTEN_SLOT_LABELS[TENTEN_IMAGE_KEYS.hero],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="ten-identity">
          <header className={styles.sectionHead}>
            <h2 id="ten-identity" className={styles.sectionTitle}>
              {pick(TENTEN_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(TENTEN_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {TENTEN_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · CEPHANENİN ÜÇ KATMANI ══════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="ten-arsenal">
          <header className={styles.sectionHead}>
            <h2 id="ten-arsenal" className={styles.sectionTitle}>
              {pick(TENTEN_SECTIONS.arsenal.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(TENTEN_SECTIONS.arsenal.lede, locale)}
            </p>
          </header>
          <ul className={styles.layers}>
            {TENTEN_ARSENAL.map((layer) => {
              const art = src(layer.imageKey);
              return (
                <li key={layer.key} className={styles.layer}>
                  <span className={styles.layerArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="760px" /> : null}
                  </span>
                  <span className={styles.layerKanji} aria-hidden>
                    {layer.kanji}
                  </span>
                  <span className={styles.layerBody}>
                    <span className={styles.layerName}>{layer.name}</span>
                    <span className={styles.layerTurkish}>
                      {pick(layer.turkish, locale)}
                    </span>
                    <span className={styles.layerTagline}>
                      {pick(layer.tagline, locale)}
                    </span>
                    <span className={styles.layerText}>
                      {pick(layer.text, locale)}
                    </span>
                    <span className={styles.layerTraits}>
                      {layer.traits.map((trait) => (
                        <span key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={TENTEN_ID}
                      slot="ABILITY"
                      abilityName={layer.imageKey}
                      label={pick(TENTEN_SLOT_LABELS[layer.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · ELİNDEKİLER ════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="ten-tools">
          <header className={styles.sectionHead}>
            <h2 id="ten-tools" className={styles.sectionTitle}>
              {pick(TENTEN_SECTIONS.tools.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(TENTEN_SECTIONS.tools.lede, locale)}
            </p>
          </header>
          <ul className={styles.tools}>
            {TENTEN_TOOLS.map((tool) => {
              const art = src(tool.imageKey);
              return (
                <li key={tool.key} className={styles.tool}>
                  <span className={styles.toolArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="520px" /> : null}
                  </span>
                  <span className={styles.toolName}>
                    {pick(tool.name, locale)}
                  </span>
                  <span className={styles.toolNote}>
                    {pick(tool.note, locale)}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={TENTEN_ID}
                      slot="ABILITY"
                      abilityName={tool.imageKey}
                      label={pick(TENTEN_SLOT_LABELS[tool.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · SİLAH PARŞÖMENİ — SAYFANIN KALBİ ═══════════════════════ */}
        <section className={styles.scrollSection} aria-labelledby="ten-scroll">
          <header className={styles.sectionHead}>
            <h2 id="ten-scroll" className={styles.sectionTitle}>
              {pick(TENTEN_SECTIONS.scroll.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(TENTEN_SECTIONS.scroll.lede, locale)}
            </p>
          </header>
          <WeaponScroll
            arms={arms}
            listLabel={pick(TENTEN_SCROLL_UI.listLabel, locale)}
            sealWord={pick(TENTEN_SCROLL_UI.sealWord, locale)}
            prevLabel={pick(TENTEN_SCROLL_UI.prev, locale)}
            nextLabel={pick(TENTEN_SCROLL_UI.next, locale)}
            momentLabel={pick(TENTEN_SCROLL_UI.momentLabel, locale)}
            openLabel={pick(TENTEN_SCROLL_UI.openLabel, locale)}
            keyboardHint={pick(TENTEN_SCROLL_UI.keyboardHint, locale)}
            rigAlt={pick(TENTEN_SCROLL_UI.rigAlt, locale)}
            armoryAlt={pick(TENTEN_SCROLL_UI.armoryAlt, locale)}
          />
          {isAdmin ? (
            <div className={styles.slotRow}>
              {TENTEN_ARMS.map((arm) => (
                <CuratorSlot
                  key={arm.imageKey}
                  characterId={TENTEN_ID}
                  slot="ABILITY"
                  abilityName={arm.imageKey}
                  label={pick(TENTEN_SLOT_LABELS[arm.imageKey], locale)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 6 · İSABET — SAYFANIN DUYGUSAL MERKEZİ ═════════════════════
            Bilerek kısa: bir ölçü, üç cümle, tek grafik. */}
        <section className={styles.aim} aria-labelledby="ten-aim">
          <div className={styles.aimBoard}>
            <TargetBoard
              className={styles.board}
              ringClassName={styles.boardRings}
              hitClassName={styles.boardHits}
              title={pick(TENTEN_AIM.boardAlt, locale)}
            />
            {bullseye ? (
              <span className={styles.aimArt} aria-hidden>
                <Image src={bullseye} alt="" fill sizes="480px" />
              </span>
            ) : null}
          </div>

          <div className={styles.aimBody}>
            <h2 id="ten-aim" className={styles.aimTitle}>
              {pick(TENTEN_SECTIONS.aim.title, locale)}
            </h2>
            <p className={styles.aimLede}>
              {pick(TENTEN_SECTIONS.aim.lede, locale)}
            </p>
            <p className={styles.aimMeasure} aria-hidden>
              {pick(TENTEN_AIM.measure, locale)}
            </p>
            <p className={styles.aimMeasureNote}>
              {pick(TENTEN_AIM.measureNote, locale)}
            </p>
            <div className={styles.aimLines}>
              {TENTEN_AIM.lines.map((line) => (
                <p key={line.tr} className={styles.aimLine}>
                  {pick(line, locale)}
                </p>
              ))}
            </div>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={TENTEN_ID}
                slot="ABILITY"
                abilityName={TENTEN_IMAGE_KEYS.bullseye}
                label={pick(
                  TENTEN_SLOT_LABELS[TENTEN_IMAGE_KEYS.bullseye],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 7 · YANINDAKİLER ═══════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="ten-companions">
          <header className={styles.sectionHead}>
            <h2 id="ten-companions" className={styles.sectionTitle}>
              {pick(TENTEN_SECTIONS.companions.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(TENTEN_SECTIONS.companions.lede, locale)}
            </p>
          </header>
          <ul className={styles.people}>
            {TENTEN_COMPANIONS.map((person) => {
              const face = faces.get(person.characterId) ?? null;
              return (
                <li
                  key={person.characterId}
                  className={styles.person}
                  data-kind={person.kind}
                >
                  <span className={styles.personArt}>
                    {face ? (
                      <Image
                        src={face}
                        alt={`${person.name} ${pick(TENTEN_ALT.companionSuffix, locale)}`}
                        fill
                        sizes="240px"
                      />
                    ) : null}
                  </span>
                  <span className={styles.personBody}>
                    <span className={styles.personRole}>
                      {pick(person.role, locale)}
                    </span>
                    <span className={styles.personName}>{person.name}</span>
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
        <section className={styles.section} aria-labelledby="ten-fate">
          <header className={styles.sectionHead}>
            <h2 id="ten-fate" className={styles.sectionTitle}>
              {pick(TENTEN_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(TENTEN_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {TENTEN_TIMELINE.map((entry) => {
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
                      characterId={TENTEN_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(TENTEN_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 9 · KAPANIŞ ════════════════════════════════════════════════
            Tek alıntı var ve Tenten'e ait değil: Guy'ın değerlendirmesi,
            kaynağı AniList künye metni. İkinci blok bilerek blockquote
            DEĞİL — arşivin kendi cümlesi replik gibi görünmesin diye. */}
        <section className={styles.closing} aria-labelledby="ten-closing">
          <h2 id="ten-closing" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}

          <span className={styles.closingGlyph} aria-hidden>
            <WeaponGlyph name="kunai" className={styles.closingKunai} />
          </span>

          <figure className={styles.closingQuote}>
            <blockquote>
              &ldquo;{pick(TENTEN_CLOSING.quote.text, locale)}&rdquo;
            </blockquote>
            <figcaption>
              <span className={styles.quoteBy}>
                {pick(TENTEN_CLOSING.quote.by, locale)}
              </span>
              <span className={styles.quoteNote}>
                {pick(TENTEN_CLOSING.quote.source, locale)}
              </span>
            </figcaption>
          </figure>

          <div className={styles.closingNote}>
            <p className={styles.closingNoteText}>
              {pick(TENTEN_CLOSING.note.text, locale)}
            </p>
            <p className={styles.quoteBy}>
              {pick(TENTEN_CLOSING.note.by, locale)}
            </p>
          </div>

          <p className={styles.motto} aria-hidden>
            {TENTEN_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(TENTEN_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(TENTEN_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(TENTEN_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={TENTEN_ID}
                slot="ABILITY"
                abilityName={TENTEN_IMAGE_KEYS.closing}
                label={pick(
                  TENTEN_SLOT_LABELS[TENTEN_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </ScrollShell>
  );
}
