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
  MADARA_ALT,
  MADARA_ARSENAL,
  MADARA_CLIMB_UI,
  MADARA_CLOSING,
  MADARA_CRUMB,
  MADARA_DREAM,
  MADARA_HERO,
  MADARA_ID,
  MADARA_IDENTITY,
  MADARA_IMAGE_KEYS,
  MADARA_MEASURES,
  MADARA_SECTIONS,
  MADARA_SITE_URL,
  MADARA_SLOT_LABELS,
  MADARA_STEPS,
  MADARA_TIMELINE,
  MADARA_TOOLS,
} from "@/lib/characters/madara-uchiha-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { TsukuyomiShell } from "./TsukuyomiShell";
import { AscentStair } from "./AscentStair";
import { AshFall, Gunbai, HairFall, MoonMark, SusanooFrame } from "./MadaraGlyphs";
import styles from "./MadaraExperience.module.css";

/**
 * Madara Uchiha — "Yükselen Ölçek" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/53901 bu bileşene dallanır.
 * Sayfanın fikri tek kelime: ÖLÇEK. Madara'nın hikâyesi bir göz hikâyesi
 * değil (o Sasuke'nin sayfasında), bir büyüme hikâyesi: her aşamada dünya
 * ona biraz daha küçük geliyor. Sayfanın kalbi olan altı basamaklı tırmanış
 * bunu düzenin kendisiyle anlatıyor — yukarı çıkıldıkça tipografi büyüyor,
 * boşluk açılıyor, kart azalıyor, sıcaklık sönüyor.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   TsukuyomiShell — "Sonsuz Tsukuyomi" modu (tek boolean, etkisi CSS'te)
 *   AscentStair    — altı basamaklı tırmanış (sekme + klavye + ölçek)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner (BRIEF §5).
 *
 * Görseller: characterId 53901 kaydının ABILITY yuvaları (`madara:*`).
 * Hiçbiri zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır.
 */
export function MadaraExperience({
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
  const heroScene = src(MADARA_IMAGE_KEYS.hero);
  const closingArt = src(MADARA_IMAGE_KEYS.closing);

  const name = detail.character.name || MADARA_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? MADARA_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? MADARA_SITE_URL;
  const dreamTag = pick(MADARA_DREAM.tag, locale);

  /* Tırmanışın altı basamağı — adaya düz dize olarak iniyor. */
  const steps = MADARA_STEPS.map((step) => ({
    key: step.key,
    reach: pick(step.reach, locale),
    era: pick(step.era, locale),
    title: pick(step.title, locale),
    text: pick(step.text, locale),
    cards: step.cards.map((card) => ({
      title: pick(card.title, locale),
      note: pick(card.note, locale),
    })),
    image: step.imageKey ? src(step.imageKey) : null,
  }));

  return (
    <TsukuyomiShell
      enterLabel={pick(MADARA_DREAM.enter, locale)}
      exitLabel={pick(MADARA_DREAM.exit, locale)}
      notice={pick(MADARA_DREAM.notice, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(MADARA_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO — KÜL YAĞARKEN ═════════════════════════════════════
            Soğuk gri zemin, kadrajı kesen uzun saç silueti, arkada kül
            serpintisi. Tek sıcaklık sağ alttaki kor notu. */}
        <section className={styles.hero} aria-labelledby="mad-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <AshFall className={styles.heroAsh} fleckClassName={styles.fleck} />

          <p className={styles.heroMark} aria-hidden>
            {MADARA_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <h1 id="mad-name" className={styles.heroName}>
              {name}
            </h1>
            {/* Ad altındaki tek satır: ana dildeki ad + klan. Başlığın
                ÜSTÜNE etiket konmuyor — künye başlığın altına yazılır. */}
            <p className={styles.heroMeta}>
              <span className={styles.heroNative} aria-hidden>
                {nativeName}
              </span>
              <span className={styles.heroSep} aria-hidden>
                ·
              </span>
              <span className={styles.heroClan}>
                {pick(MADARA_IDENTITY.clan, locale)}
              </span>
            </p>
            <p className={styles.heroEpigraph}>
              {pick(MADARA_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(MADARA_HERO.lede, locale)}</p>
            <DreamLine text={pick(MADARA_HERO.dream, locale)} tag={dreamTag} />
          </div>

          <div className={styles.heroAside}>
            <HairFall className={styles.heroHair} />
            {portrait ? (
              <span className={styles.heroPortrait}>
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? MADARA_HERO.portraitAlt
                      : MADARA_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="360px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              </span>
            ) : null}
            <p className={styles.emberNote}>
              <span className={styles.ember} aria-hidden />
              {pick(MADARA_HERO.ashNote, locale)}
            </p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={MADARA_ID}
                slot="ABILITY"
                abilityName={MADARA_IMAGE_KEYS.hero}
                label={pick(MADARA_SLOT_LABELS[MADARA_IMAGE_KEYS.hero], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ═══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="mad-identity">
          <header className={styles.sectionHead}>
            <h2 id="mad-identity" className={styles.sectionTitle}>
              {pick(MADARA_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(MADARA_SECTIONS.identity.lede, locale)}
            </p>
            <DreamLine
              text={pick(MADARA_SECTIONS.identity.dream, locale)}
              tag={dreamTag}
            />
          </header>
          <dl className={styles.facts}>
            {MADARA_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.factsNote}>
            {pick(MADARA_IDENTITY.missing, locale)}
          </p>
        </section>

        {/* ══ 3 · ÖLÇÜSÜ OLANLAR ══════════════════════════════════════════
            Yoldaş portreleri; her biri Madara'nın kendini ölçtüğü bir
            büyüklük. Kart değil, ölçü şeridi üstünde beş durak. */}
        <section className={styles.section} aria-labelledby="mad-measures">
          <header className={styles.sectionHead}>
            <h2 id="mad-measures" className={styles.sectionTitle}>
              {pick(MADARA_SECTIONS.measures.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(MADARA_SECTIONS.measures.lede, locale)}
            </p>
            <DreamLine
              text={pick(MADARA_SECTIONS.measures.dream, locale)}
              tag={dreamTag}
            />
          </header>
          <ul className={styles.measures}>
            {MADARA_MEASURES.map((item) => {
              const face = faces.get(item.characterId) ?? null;
              return (
                <li
                  key={item.characterId}
                  className={styles.measure}
                  data-weight={item.weight}
                >
                  <span className={styles.measureArt}>
                    {face ? (
                      <Image
                        src={face}
                        alt={`${item.name} ${pick(MADARA_ALT.measureSuffix, locale)}`}
                        fill
                        sizes="240px"
                      />
                    ) : null}
                  </span>
                  <span className={styles.measureBody}>
                    <span className={styles.measureName}>{item.name}</span>
                    <span className={styles.measureRole}>
                      {pick(item.role, locale)}
                    </span>
                    <span className={styles.measureNote}>
                      {pick(item.note, locale)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · ÜÇ BÜYÜK ÖLÇEK ══════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="mad-arsenal">
          <header className={styles.sectionHead}>
            <h2 id="mad-arsenal" className={styles.sectionTitle}>
              {pick(MADARA_SECTIONS.arsenal.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(MADARA_SECTIONS.arsenal.lede, locale)}
            </p>
            <DreamLine
              text={pick(MADARA_SECTIONS.arsenal.dream, locale)}
              tag={dreamTag}
            />
          </header>
          <ul className={styles.arsenal}>
            {MADARA_ARSENAL.map((item, position) => {
              const art = src(item.imageKey);
              return (
                <li
                  key={item.key}
                  className={styles.arsenalItem}
                  data-rank={position + 1}
                >
                  {/* Sahne yükleme beklemiyor: görsel yoksa kanji ve
                      (Susanoo'da) iskelet çizimi sahneyi tek başına
                      taşıyor — boş çerçeve kalmıyor. */}
                  <span className={styles.arsenalStage} aria-hidden>
                    {item.key === "susanoo" ? (
                      <SusanooFrame className={styles.arsenalGlyph} />
                    ) : null}
                    {art ? (
                      <span className={styles.arsenalArt}>
                        <Image src={art} alt="" fill sizes="720px" />
                      </span>
                    ) : null}
                    <span className={styles.arsenalKanji}>{item.kanji}</span>
                  </span>

                  <span className={styles.arsenalBody}>
                    <span className={styles.arsenalName}>{item.name}</span>
                    <span className={styles.arsenalTurkish}>
                      {pick(item.turkish, locale)}
                    </span>
                    <span className={styles.arsenalTagline}>
                      {pick(item.tagline, locale)}
                    </span>
                    <span className={styles.arsenalText}>
                      {pick(item.text, locale)}
                    </span>
                    <span className={styles.traits}>
                      {item.traits.map((trait) => (
                        <span key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>

                  {isAdmin ? (
                    <CuratorSlot
                      characterId={MADARA_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(MADARA_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · DÖRT KÜÇÜK ÖLÇEK ════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="mad-tools">
          <header className={styles.sectionHead}>
            <h2 id="mad-tools" className={styles.sectionTitle}>
              {pick(MADARA_SECTIONS.tools.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(MADARA_SECTIONS.tools.lede, locale)}
            </p>
          </header>
          <ul className={styles.tools}>
            {MADARA_TOOLS.map((item) => {
              const art = src(item.imageKey);
              return (
                <li key={item.key} className={styles.tool}>
                  <span className={styles.toolArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="480px" /> : null}
                  </span>
                  {item.key === "gunbai" ? (
                    <Gunbai className={styles.toolGlyph} />
                  ) : null}
                  {item.key === "moonPlan" ? (
                    <MoonMark className={styles.toolMoon} />
                  ) : null}
                  <span className={styles.toolName}>
                    {pick(item.name, locale)}
                  </span>
                  <span className={styles.toolNote}>
                    {pick(item.note, locale)}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={MADARA_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(MADARA_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 6 · YÜKSELEN BASAMAKLAR — SAYFANIN KALBİ ════════════════════ */}
        <section className={styles.climbSection} aria-labelledby="mad-ascent">
          <header className={styles.sectionHead}>
            <h2 id="mad-ascent" className={styles.sectionTitle}>
              {pick(MADARA_SECTIONS.ascent.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(MADARA_SECTIONS.ascent.lede, locale)}
            </p>
            <DreamLine
              text={pick(MADARA_SECTIONS.ascent.dream, locale)}
              tag={dreamTag}
            />
          </header>

          <AscentStair
            steps={steps}
            railLabel={pick(MADARA_CLIMB_UI.railLabel, locale)}
            stepWord={pick(MADARA_CLIMB_UI.stepWord, locale)}
            upLabel={pick(MADARA_CLIMB_UI.up, locale)}
            downLabel={pick(MADARA_CLIMB_UI.down, locale)}
            scaleLabel={pick(MADARA_CLIMB_UI.scaleLabel, locale)}
            keyboardHint={pick(MADARA_CLIMB_UI.keyboardHint, locale)}
          />

          {isAdmin ? (
            <div className={styles.slotRow}>
              {MADARA_STEPS.map((step) =>
                step.imageKey ? (
                  <CuratorSlot
                    key={step.imageKey}
                    characterId={MADARA_ID}
                    slot="ABILITY"
                    abilityName={step.imageKey}
                    label={pick(MADARA_SLOT_LABELS[step.imageKey], locale)}
                  />
                ) : null,
              )}
            </div>
          ) : null}
        </section>

        {/* ══ 7 · KADER ÇİZELGESİ ═════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="mad-fate">
          <header className={styles.sectionHead}>
            <h2 id="mad-fate" className={styles.sectionTitle}>
              {pick(MADARA_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(MADARA_SECTIONS.fate.lede, locale)}
            </p>
            <DreamLine
              text={pick(MADARA_SECTIONS.fate.dream, locale)}
              tag={dreamTag}
            />
          </header>
          <ol className={styles.fate}>
            {MADARA_TIMELINE.map((entry) => {
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
                      characterId={MADARA_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(MADARA_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 8 · KAPANIŞ ═════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="mad-closing">
          <h2 id="mad-closing" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}

          <MoonMark className={styles.closingMoon} />

          {MADARA_CLOSING.quotes.map((quote) => (
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

          <DreamLine text={pick(MADARA_CLOSING.dream, locale)} tag={dreamTag} />

          <p className={styles.motto} aria-hidden>
            {MADARA_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(MADARA_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(MADARA_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(MADARA_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={MADARA_ID}
                slot="ABILITY"
                abilityName={MADARA_IMAGE_KEYS.closing}
                label={pick(
                  MADARA_SLOT_LABELS[MADARA_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </TsukuyomiShell>
  );
}

/**
 * Rüya satırı — yalnızca Sonsuz Tsukuyomi modunda görünür.
 *
 * Mod kapalıyken CSS `display: none` uyguluyor, yani satır ekran okuyucuya
 * da inmiyor: kapalı modda sayfa yalnızca KAYIT'tan ibaret kalıyor. Açıkken
 * her satırın başında "rüyada görülen" etiketi duruyor — bu sayfanın
 * dürüstlük şartı (bkz. veri dosyasının başı).
 */
function DreamLine({ text, tag }: { text: string; tag: string }) {
  return (
    <p className={styles.dreamLine}>
      <span className={styles.dreamTag}>{tag}</span>
      <span className={styles.dreamText}>{text}</span>
    </p>
  );
}
