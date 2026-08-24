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
  SHINO_ALT,
  SHINO_CELLS,
  SHINO_CLOSING,
  SHINO_COMB_UI,
  SHINO_CRUMB,
  SHINO_FORGOTTEN,
  SHINO_HERO,
  SHINO_HIVE_TEXT,
  SHINO_ID,
  SHINO_IDENTITY,
  SHINO_IMAGE_KEYS,
  SHINO_JUTSU,
  SHINO_SECTIONS,
  SHINO_SITE_URL,
  SHINO_SLOT_LABELS,
  SHINO_TEAM,
  SHINO_TIMELINE,
  SHINO_TOOLS,
} from "@/lib/characters/shino-aburame-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { HiveShell } from "./HiveShell";
import { HiveComb } from "./HiveComb";
import { DroneCloud } from "./HiveGlyphs";
import styles from "./ShinoExperience.module.css";

/**
 * Shino Aburame — "Kovan" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/3428 bu bileşene dallanır
 * (rota dosyasındaki `EXPERIENCES` haritası).
 *
 * ── SAYFANIN FİKRİ ───────────────────────────────────────────────────────
 * Yirmi iki kardeşi içinde EN SESSİZ olanı. Az hareket, çok boşluk, çok
 * düşük kontrastlı dekor — ama metin kontrastı yüksek kalıyor: sessizlik
 * okunmayı zorlaştırmak değil, gürültüyü kaldırmak demek.
 *
 * Yapısal iki fikir:
 *   1. PETEK — altı hücreli altıgen halka. Bir hücre seçilince komşuları da
 *      canlanıyor; sürü davranışı bir tıklamayla değil bir dalgayla cevap
 *      veriyor.
 *   2. "BENİ UNUTUYORLAR" — sayfanın duygusal merkezi. Görselsiz, süssüz,
 *      dar bir sütun. Shino'nun sürekli tekrarlanan "unutulma" esprisi
 *      burada şaka olarak değil, tutanak olarak duruyor.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   HiveShell — "Kovan modu" (tek boolean, etkinin tamamı CSS'te)
 *   HiveComb  — altı hücreli petek (halka + klavye + yayılma)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 3428 kaydının ABILITY yuvaları (`shino:*`).
 * Hiçbiri zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır.
 */
export function ShinoExperience({
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
  const heroScene = src(SHINO_IMAGE_KEYS.hero);
  const closingArt = src(SHINO_IMAGE_KEYS.closing);

  const name = detail.character.name || SHINO_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? SHINO_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? SHINO_SITE_URL;

  const cells = SHINO_CELLS.map((cell) => ({
    key: cell.key,
    short: pick(cell.short, locale),
    title: pick(cell.title, locale),
    latin: pick(cell.latin, locale),
    text: pick(cell.text, locale),
    use: pick(cell.use, locale),
    image: src(cell.imageKey),
  }));

  return (
    <HiveShell
      enterLabel={pick(SHINO_HIVE_TEXT.enter, locale)}
      exitLabel={pick(SHINO_HIVE_TEXT.exit, locale)}
      hint={pick(SHINO_HIVE_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(SHINO_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO — YARISI GÖRÜNMEYEN YÜZ ════════════════════════════
            Portre altıgene kırpılı: Shino da kovanın bir hücresi. Alt kenarı
            sayfaya karışıyor (yaka), arkasında dağılan böcek bulutu var. */}
        <section className={styles.hero} aria-labelledby="shi-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <p className={styles.heroMark} aria-hidden>
            {SHINO_IDENTITY.watermark}
          </p>

          <div className={styles.heroFigure}>
            <span className={styles.heroCloud} aria-hidden>
              <DroneCloud
                className={styles.heroCloudArt}
                dotClassName={styles.drone}
              />
            </span>
            {portrait ? (
              <span className={styles.heroPortrait}>
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? SHINO_HERO.portraitAlt
                      : SHINO_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="380px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              </span>
            ) : null}
            <p className={styles.heroCaption}>
              {pick(SHINO_HERO.swarmCaption, locale)}
            </p>
          </div>

          <div className={styles.heroBody}>
            <p className={styles.heroClan}>
              {pick(SHINO_IDENTITY.clan, locale)}
            </p>
            <h1 id="shi-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {nativeName}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(SHINO_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(SHINO_HERO.lede, locale)}</p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={SHINO_ID}
                slot="ABILITY"
                abilityName={SHINO_IMAGE_KEYS.hero}
                label={pick(SHINO_SLOT_LABELS[SHINO_IMAGE_KEYS.hero], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="shi-identity">
          <header className={styles.sectionHead}>
            <h2 id="shi-identity" className={styles.sectionTitle}>
              {pick(SHINO_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(SHINO_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {SHINO_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · 8. TAKIM ═══════════════════════════════════════════════
            Dört portre, dördü de altıgene kırpılı: kovanda herkes bir
            hücre. Naruto listenin sonunda — bir sonraki bölümün konusu. */}
        <section className={styles.section} aria-labelledby="shi-team">
          <header className={styles.sectionHead}>
            <h2 id="shi-team" className={styles.sectionTitle}>
              {pick(SHINO_SECTIONS.team.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(SHINO_SECTIONS.team.lede, locale)}
            </p>
          </header>
          <ul className={styles.team}>
            {SHINO_TEAM.map((member) => {
              const face = faces.get(member.characterId) ?? null;
              return (
                <li key={member.characterId} className={styles.teamMember}>
                  <span className={styles.teamFace}>
                    {face ? (
                      <Image
                        src={face}
                        alt={`${member.name} ${pick(SHINO_ALT.faceSuffix, locale)}`}
                        fill
                        sizes="240px"
                      />
                    ) : null}
                  </span>
                  <span className={styles.teamBody}>
                    <span className={styles.teamName}>{member.name}</span>
                    <span className={styles.teamRole}>
                      {pick(member.role, locale)}
                    </span>
                    <span className={styles.teamNote}>
                      {pick(member.note, locale)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · KOVANDAN ÇIKAN ÜÇ ŞEY ══════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="shi-jutsu">
          <header className={styles.sectionHead}>
            <h2 id="shi-jutsu" className={styles.sectionTitle}>
              {pick(SHINO_SECTIONS.jutsu.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(SHINO_SECTIONS.jutsu.lede, locale)}
            </p>
          </header>
          <ul className={styles.forms}>
            {SHINO_JUTSU.map((jutsu, position) => {
              const key = SHINO_IMAGE_KEYS[jutsu.key];
              const art = src(key);
              return (
                <li key={jutsu.key} className={styles.form}>
                  <span className={styles.formPlate}>
                    {art ? (
                      <Image src={art} alt="" fill sizes="420px" />
                    ) : (
                      <span className={styles.formPlateIndex} aria-hidden>
                        {String(position + 1).padStart(2, "0")}
                      </span>
                    )}
                  </span>
                  <span className={styles.formBody}>
                    <span className={styles.formName}>{jutsu.name}</span>
                    {"kanji" in jutsu && jutsu.kanji ? (
                      <span className={styles.formKanji} aria-hidden>
                        {jutsu.kanji}
                      </span>
                    ) : null}
                    <span className={styles.formTurkish}>
                      {pick(jutsu.turkish, locale)}
                    </span>
                    <span className={styles.formTagline}>
                      {pick(jutsu.tagline, locale)}
                    </span>
                    <span className={styles.formText}>
                      {pick(jutsu.text, locale)}
                    </span>
                    <span className={styles.formTraits}>
                      {jutsu.traits.map((trait) => (
                        <span key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={SHINO_ID}
                      slot="ABILITY"
                      abilityName={key}
                      label={pick(SHINO_SLOT_LABELS[key], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · DÖRT SESSİZ İŞ ═════════════════════════════════════════
            Kart değil, cetvel: dört satır ve aralarında birer saç teli. */}
        <section className={styles.section} aria-labelledby="shi-tools">
          <header className={styles.sectionHead}>
            <h2 id="shi-tools" className={styles.sectionTitle}>
              {pick(SHINO_SECTIONS.tools.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(SHINO_SECTIONS.tools.lede, locale)}
            </p>
          </header>
          <ul className={styles.tools}>
            {SHINO_TOOLS.map((tool) => {
              const art = src(tool.imageKey);
              return (
                <li key={tool.key} className={styles.tool}>
                  <span className={styles.toolArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="220px" /> : null}
                  </span>
                  <span className={styles.toolName}>
                    {pick(tool.name, locale)}
                  </span>
                  <span className={styles.toolNote}>
                    {pick(tool.note, locale)}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={SHINO_ID}
                      slot="ABILITY"
                      abilityName={tool.imageKey}
                      label={pick(SHINO_SLOT_LABELS[tool.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 6 · PETEK — SAYFANIN KALBİ ═════════════════════════════════ */}
        <section className={styles.combSection} aria-labelledby="shi-comb">
          <header className={styles.sectionHead}>
            <h2 id="shi-comb" className={styles.sectionTitle}>
              {pick(SHINO_SECTIONS.comb.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(SHINO_SECTIONS.comb.lede, locale)}
            </p>
          </header>
          <HiveComb
            cells={cells}
            listLabel={pick(SHINO_COMB_UI.listLabel, locale)}
            cellWord={pick(SHINO_COMB_UI.cellWord, locale)}
            coreGlyph={SHINO_COMB_UI.coreGlyph}
            coreLabel={pick(SHINO_COMB_UI.coreLabel, locale)}
            prevLabel={pick(SHINO_COMB_UI.prev, locale)}
            nextLabel={pick(SHINO_COMB_UI.next, locale)}
            useLabel={pick(SHINO_COMB_UI.useLabel, locale)}
            keyboardHint={pick(SHINO_COMB_UI.keyboardHint, locale)}
            combAlt={pick(SHINO_COMB_UI.combAlt, locale)}
          />
          {isAdmin ? (
            <div className={styles.slotRow}>
              {SHINO_CELLS.map((cell) => (
                <CuratorSlot
                  key={cell.imageKey}
                  characterId={SHINO_ID}
                  slot="ABILITY"
                  abilityName={cell.imageKey}
                  label={pick(SHINO_SLOT_LABELS[cell.imageKey], locale)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 7 · BENİ UNUTUYORLAR ═══════════════════════════════════════
            Sayfanın duygusal merkezi. Görsel YOK, kurator yuvası YOK,
            süs YOK — gösterilecek bir şeyin olmaması bölümün konusu. */}
        <section className={styles.quiet} aria-labelledby="shi-forgotten">
          <header className={styles.quietHead}>
            <h2 id="shi-forgotten" className={styles.quietTitle}>
              {pick(SHINO_SECTIONS.forgotten.title, locale)}
            </h2>
            <p className={styles.quietLede}>
              {pick(SHINO_SECTIONS.forgotten.lede, locale)}
            </p>
          </header>
          <ol className={styles.record}>
            {SHINO_FORGOTTEN.map((entry) => (
              <li key={entry.key} className={styles.recordItem}>
                <p className={styles.recordWhen}>{pick(entry.when, locale)}</p>
                <p className={styles.recordText}>{pick(entry.text, locale)}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ══ 8 · ÖMÜR ÇİZELGESİ ═════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="shi-fate">
          <header className={styles.sectionHead}>
            <h2 id="shi-fate" className={styles.sectionTitle}>
              {pick(SHINO_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(SHINO_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {SHINO_TIMELINE.map((entry) => {
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
                      characterId={SHINO_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(SHINO_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 9 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="shi-closing">
          <h2 id="shi-closing" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}
          {SHINO_CLOSING.quotes.map((quote) => (
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
            {SHINO_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(SHINO_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(SHINO_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(SHINO_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={SHINO_ID}
                slot="ABILITY"
                abilityName={SHINO_IMAGE_KEYS.closing}
                label={pick(
                  SHINO_SLOT_LABELS[SHINO_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </HiveShell>
  );
}
