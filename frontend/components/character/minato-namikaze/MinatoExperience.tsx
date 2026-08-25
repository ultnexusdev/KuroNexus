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
  MINATO_ALT,
  MINATO_CLOSING,
  MINATO_CRUMB,
  MINATO_HERO,
  MINATO_ID,
  MINATO_IDENTITY,
  MINATO_IMAGE_KEYS,
  MINATO_JUTSU,
  MINATO_KIT,
  MINATO_MARKS,
  MINATO_MARKS_TEXT,
  MINATO_MODE,
  MINATO_NIGHT,
  MINATO_RAIL,
  MINATO_SECTIONS,
  MINATO_SITE_URL,
  MINATO_SLOT_LABELS,
  MINATO_STOPS,
  MINATO_TIMELINE,
} from "@/lib/characters/minato-namikaze-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { HiraishinShell } from "./HiraishinShell";
import {
  FlameHem,
  HiraishinFormula,
  KitGlyph,
  MarkSeal,
  SealingSpiral,
} from "./MinatoGlyphs";
import styles from "./MinatoExperience.module.css";

/**
 * Minato Namikaze — "Sarı Şimşek · İşaretler" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/2535 bu bileşene dallanır
 * (rota dosyasındaki harita). Sayfanın fikri tek cümle: MESAFE YOK.
 * Kenarda sabit duran yedi mühür sayfanın yedi bölümüne bağlı ve bir
 * mühre basmak aradaki yolu göstermeden o bölüme ışınlıyor — sitedeki
 * hiçbir sayfada olmayan bir gezinme jesti, çünkü sitedeki hiçbir
 * karakterin tekniği bu değil.
 *
 * Bunun bilinçli tek istisnası MÜHÜRLEME GECESİ bölümü: sayfanın geri
 * kalanı anlıkken orada hiçbir şey hızlanmıyor. Uzun satır aralığı, geniş
 * boşluk, hiç geçiş yok. Sayfanın duygusal merkezi orası ve oraya
 * "ışınlanmak" da mümkün — ama varınca sayfa yavaşlıyor.
 *
 * Sayfa SUNUCUDA çizilir. TEK istemci adası var: `HiraishinShell` (işaret
 * sütunu, mod düğmesi, aktif bölüm takibi). Metinler burada `pick` ile
 * seçilip adaya düz dize olarak iner (BRIEF §5).
 *
 * Görseller: characterId 2535 kaydının ABILITY yuvaları (`minato:*`).
 * Hiçbiri zorunlu değil — yuva boşken bölüm görselsiz ama AYAKTA kalır.
 */
export function MinatoExperience({
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
  const heroScene = src(MINATO_IMAGE_KEYS.hero);
  const formulaArt = src(MINATO_IMAGE_KEYS.marks);
  const nightArt = src(MINATO_IMAGE_KEYS.night);
  const closingArt = src(MINATO_IMAGE_KEYS.closing);

  const name = detail.character.name || MINATO_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? MINATO_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? MINATO_SITE_URL;
  const faceSuffix = pick(MINATO_ALT.faceSuffix, locale);

  /* İstemci adasına yalnızca düz dizeler iniyor: anahtar, hedef kimlik,
     glif numarası ve görünen ad. `LocalizedText` sınırı geçmiyor. */
  const marks = MINATO_MARKS.map((mark) => ({
    key: mark.key,
    targetId: MINATO_STOPS[mark.key],
    glyph: mark.glyph,
    title: pick(mark.title, locale),
  }));

  return (
    <HiraishinShell
      marks={marks}
      railLabel={pick(MINATO_RAIL.label, locale)}
      railHint={pick(MINATO_RAIL.hint, locale)}
      modeLabel={pick(MINATO_MODE.label, locale)}
      modeHint={pick(MINATO_MODE.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(MINATO_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO — GECE GÖĞÜ VE BEYAZ CÜBBE ═══════════════════════════
            Solda tipografi, sağda dar bir portre paneli; panelin eteğinde
            cübbenin alev deseni. Filigran 四代目 dikey, gökyüzünün içinde. */}
        <section
          id={MINATO_STOPS.hero}
          data-mark="hero"
          tabIndex={-1}
          className={`${styles.stop} ${styles.hero}`}
          aria-labelledby="min-name"
        >
          <span className={styles.heroSky} aria-hidden />
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <p className={styles.heroWatermark} aria-hidden>
            {MINATO_IDENTITY.watermark}
          </p>

          <div className={styles.heroInner}>
            <div className={styles.heroBody}>
              <h1 id="min-name" className={styles.heroName}>
                {name}
              </h1>
              <p className={styles.heroNative} aria-hidden>
                {nativeName}
              </p>
              <p className={styles.heroRoles}>
                {pick(MINATO_IDENTITY.roles, locale)}
              </p>
              <p className={styles.heroEpigraph}>
                {pick(MINATO_IDENTITY.epigraph, locale)}
              </p>
              <p className={styles.heroLede}>{pick(MINATO_HERO.lede, locale)}</p>
              <p className={styles.heroMarkNote}>
                <MarkSeal variant={0} className={styles.heroMarkGlyph} />
                {pick(MINATO_RAIL.hint, locale)}
              </p>
            </div>

            <div className={styles.heroAside}>
              <span className={styles.heroPortrait}>
                {portrait ? (
                  <Image
                    src={portrait}
                    alt={pick(
                      portraitUploaded
                        ? MINATO_HERO.portraitAlt
                        : MINATO_HERO.portraitAltFallback,
                      locale,
                    )}
                    fill
                    sizes="380px"
                    priority
                    unoptimized={!portraitUploaded}
                  />
                ) : null}
                <span className={styles.heroPortraitVeil} aria-hidden />
              </span>
            </div>
          </div>

          {/* Cübbe eteğinin alev deseni — hero'nun alt sınırı. Portrenin
              içinde değil sayfanın kendi eteğinde: dar ekranda portre
              solup arkaya geçtiğinde de desen ayakta kalıyor. */}
          <FlameHem className={styles.heroHem} />

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={MINATO_ID}
                slot="ABILITY"
                abilityName={MINATO_IMAGE_KEYS.hero}
                label={pick(MINATO_SLOT_LABELS[MINATO_IMAGE_KEYS.hero], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE — nokta liderli tutanak satırları ═══════════════════ */}
        <section
          id={MINATO_STOPS.record}
          data-mark="record"
          tabIndex={-1}
          className={styles.stop}
          aria-labelledby="min-record-title"
        >
          <div className={styles.inner}>
            <header className={styles.head}>
              <h2 id="min-record-title" className={styles.title}>
                {pick(MINATO_SECTIONS.record.title, locale)}
              </h2>
              <p className={styles.lede}>
                {pick(MINATO_SECTIONS.record.lede, locale)}
              </p>
            </header>
            <dl className={styles.record}>
              {MINATO_IDENTITY.facts.map((fact) => (
                <div key={fact.label.tr} className={styles.recordRow}>
                  <dt className={styles.recordLabel}>
                    {pick(fact.label, locale)}
                  </dt>
                  <dd className={styles.recordValue}>
                    {pick(fact.value, locale)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ══ 3 · İŞARETLER — sayfanın kalbi, yazıya dökülmüş hâli ══════════
            Sütun bir gezinme aracı; burası onun kullanma kılavuzu ve aynı
            zamanda yedi mührün sözlüğü. Dar ekranda sütun alt şeride indiği
            için mekaniğin anlatıldığı tek yer burası oluyor. */}
        <section
          id={MINATO_STOPS.marks}
          data-mark="marks"
          tabIndex={-1}
          className={styles.stop}
          aria-labelledby="min-marks-title"
        >
          <div className={`${styles.inner} ${styles.marksGrid}`}>
            <div className={styles.marksBody}>
              <header className={styles.head}>
                <h2 id="min-marks-title" className={styles.title}>
                  {pick(MINATO_SECTIONS.marks.title, locale)}
                </h2>
                <p className={styles.lede}>
                  {pick(MINATO_SECTIONS.marks.lede, locale)}
                </p>
              </header>
              {MINATO_MARKS_TEXT.body.map((paragraph) => (
                <p key={paragraph.tr} className={styles.prose}>
                  {pick(paragraph, locale)}
                </p>
              ))}
            </div>

            <div className={styles.marksArt}>
              {formulaArt ? (
                <span className={styles.marksPhoto} aria-hidden>
                  <Image src={formulaArt} alt="" fill sizes="520px" />
                </span>
              ) : null}
              <HiraishinFormula
                className={styles.formula}
                title={pick(MINATO_MARKS_TEXT.formulaAlt, locale)}
              />
            </div>

            <div className={styles.legend}>
              <h3 className={styles.legendTitle}>
                {pick(MINATO_MARKS_TEXT.legendTitle, locale)}
              </h3>
              <ol className={styles.legendList}>
                {MINATO_MARKS.map((mark) => (
                  <li key={mark.key} className={styles.legendItem}>
                    <MarkSeal
                      variant={mark.glyph}
                      className={styles.legendGlyph}
                    />
                    <span className={styles.legendName}>
                      {pick(mark.title, locale)}
                    </span>
                    <span className={styles.legendNote}>
                      {pick(mark.note, locale)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={MINATO_ID}
                slot="ABILITY"
                abilityName={MINATO_IMAGE_KEYS.marks}
                label={pick(MINATO_SLOT_LABELS[MINATO_IMAGE_KEYS.marks], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 4 · ÜÇ TEKNİK ════════════════════════════════════════════════ */}
        <section
          id={MINATO_STOPS.jutsu}
          data-mark="jutsu"
          tabIndex={-1}
          className={styles.stop}
          aria-labelledby="min-jutsu-title"
        >
          <div className={styles.inner}>
            <header className={styles.head}>
              <h2 id="min-jutsu-title" className={styles.title}>
                {pick(MINATO_SECTIONS.jutsu.title, locale)}
              </h2>
              <p className={styles.lede}>
                {pick(MINATO_SECTIONS.jutsu.lede, locale)}
              </p>
            </header>
            <ul className={styles.techs}>
              {MINATO_JUTSU.map((jutsu, index) => {
                const art = src(jutsu.imageKey);
                return (
                  <li key={jutsu.key} className={styles.tech} data-side={index % 2}>
                    {art ? (
                      <span className={styles.techArt} aria-hidden>
                        <Image src={art} alt="" fill sizes="720px" />
                      </span>
                    ) : null}
                    <span className={styles.techBody}>
                      <span className={styles.techKanji} aria-hidden>
                        {jutsu.kanji}
                      </span>
                      <h3 className={styles.techName}>{jutsu.name}</h3>
                      <span className={styles.techTurkish}>
                        {pick(jutsu.turkish, locale)}
                      </span>
                      <span className={styles.techTagline}>
                        {pick(jutsu.tagline, locale)}
                      </span>
                      <span className={styles.techText}>
                        {pick(jutsu.text, locale)}
                      </span>
                      <span className={styles.techTraits}>
                        {jutsu.traits.map((trait) => (
                          <span key={trait.tr} className={styles.trait}>
                            {pick(trait, locale)}
                          </span>
                        ))}
                      </span>
                    </span>
                    {isAdmin ? (
                      <CuratorSlot
                        characterId={MINATO_ID}
                        slot="ABILITY"
                        abilityName={jutsu.imageKey}
                        label={pick(MINATO_SLOT_LABELS[jutsu.imageKey], locale)}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ══ 5 · DÖRT KÜÇÜK — asimetrik tutanak ızgarası ═══════════════════ */}
        <section
          id={MINATO_STOPS.kit}
          data-mark="kit"
          tabIndex={-1}
          className={styles.stop}
          aria-labelledby="min-kit-title"
        >
          <div className={styles.inner}>
            <header className={styles.head}>
              <h2 id="min-kit-title" className={styles.title}>
                {pick(MINATO_SECTIONS.kit.title, locale)}
              </h2>
              <p className={styles.lede}>
                {pick(MINATO_SECTIONS.kit.lede, locale)}
              </p>
            </header>
            <ul className={styles.kit}>
              {MINATO_KIT.map((item) => {
                const art = src(item.imageKey);
                return (
                  <li key={item.key} className={styles.kitItem}>
                    {art ? (
                      <span className={styles.kitPhoto} aria-hidden>
                        <Image src={art} alt="" fill sizes="640px" />
                      </span>
                    ) : null}
                    <KitGlyph variant={item.glyph} className={styles.kitGlyph} />
                    <h3 className={styles.kitName}>{pick(item.name, locale)}</h3>
                    <p className={styles.kitNote}>{pick(item.note, locale)}</p>
                    {isAdmin ? (
                      <CuratorSlot
                        characterId={MINATO_ID}
                        slot="ABILITY"
                        abilityName={item.imageKey}
                        label={pick(MINATO_SLOT_LABELS[item.imageKey], locale)}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ══ 6 · YİRMİ DÖRT YIL ═══════════════════════════════════════════ */}
        <section
          id={MINATO_STOPS.fate}
          data-mark="fate"
          tabIndex={-1}
          className={styles.stop}
          aria-labelledby="min-fate-title"
        >
          <div className={styles.inner}>
            <header className={styles.head}>
              <h2 id="min-fate-title" className={styles.title}>
                {pick(MINATO_SECTIONS.fate.title, locale)}
              </h2>
              <p className={styles.lede}>
                {pick(MINATO_SECTIONS.fate.lede, locale)}
              </p>
            </header>
            <ol className={styles.fate}>
              {MINATO_TIMELINE.map((entry) => {
                const art = src(entry.imageKey);
                /* Portre kaydı olmayan yüz hiç çizilmiyor. `flatMap` ile
                   süzmenin sebebi tip: `filter` sonrası adres hâlâ
                   `string | undefined` kalırdı ve `as` yazmak gerekirdi. */
                const drawn = entry.faces.flatMap((face) => {
                  const url = faces.get(face.characterId);
                  return url ? [{ ...face, url }] : [];
                });
                return (
                  <li key={entry.key} className={styles.fateItem}>
                    <p className={styles.fateEra}>{pick(entry.era, locale)}</p>
                    <div className={styles.fateBody}>
                      <h3 className={styles.fateTitle}>
                        {pick(entry.title, locale)}
                      </h3>
                      <p className={styles.fateText}>{pick(entry.text, locale)}</p>
                      {drawn.length > 0 ? (
                        <ul className={styles.faces}>
                          {drawn.map((face) => (
                            <li key={face.characterId} className={styles.face}>
                              <span className={styles.faceArt}>
                                <Image
                                  src={face.url}
                                  alt={`${face.name} ${faceSuffix}`}
                                  fill
                                  sizes="96px"
                                />
                              </span>
                              <span className={styles.faceName}>{face.name}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {art ? (
                        <span className={styles.fateArt} aria-hidden>
                          <Image src={art} alt="" fill sizes="620px" />
                        </span>
                      ) : null}
                      {isAdmin ? (
                        <CuratorSlot
                          characterId={MINATO_ID}
                          slot="ABILITY"
                          abilityName={entry.imageKey}
                          label={pick(MINATO_SLOT_LABELS[entry.imageKey], locale)}
                        />
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ══ 7 · MÜHÜRLEME GECESİ ═════════════════════════════════════════
            Sayfanın yavaşladığı tek yer. Beş kısa satır, aralarında bir
            bölüm boyu boşluk, geniş satır aralığı ve HİÇ hareket yok. */}
        <section
          id={MINATO_STOPS.night}
          data-mark="night"
          tabIndex={-1}
          className={`${styles.stop} ${styles.night}`}
          aria-labelledby="min-night-title"
        >
          {nightArt ? (
            <span className={styles.nightScene} aria-hidden>
              <Image src={nightArt} alt="" fill sizes="1600px" />
            </span>
          ) : null}
          <SealingSpiral
            className={styles.nightSeal}
            title={pick(MINATO_NIGHT.sealAlt, locale)}
          />

          <div className={styles.nightInner}>
            <header className={styles.nightHead}>
              <h2 id="min-night-title" className={styles.nightTitle}>
                {pick(MINATO_SECTIONS.night.title, locale)}
              </h2>
              <p className={styles.nightLede}>
                {pick(MINATO_SECTIONS.night.lede, locale)}
              </p>
            </header>

            {MINATO_NIGHT.lines.map((line, index) => (
              <p
                key={line.tr}
                className={styles.nightLine}
                data-last={index === MINATO_NIGHT.lines.length - 1 || undefined}
              >
                {pick(line, locale)}
              </p>
            ))}

            <p className={styles.nightSource}>
              {pick(MINATO_NIGHT.sourceNote, locale)}
            </p>

            {isAdmin ? (
              <div className={styles.slotRow}>
                <CuratorSlot
                  characterId={MINATO_ID}
                  slot="ABILITY"
                  abilityName={MINATO_IMAGE_KEYS.night}
                  label={pick(
                    MINATO_SLOT_LABELS[MINATO_IMAGE_KEYS.night],
                    locale,
                  )}
                />
              </div>
            ) : null}
          </div>
        </section>

        {/* ══ 8 · KAPANIŞ — iki belge, motto, kaynak künyesi ════════════════ */}
        <section className={styles.closing} aria-labelledby="min-closing-title">
          <h2 id="min-closing-title" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}

          {/* Tırnak işareti YOK ve bu bilinçli: bunlar replik değil belge.
              Kaynakları figcaption'da duruyor (bkz. veri dosyası). */}
          {MINATO_CLOSING.records.map((record) => (
            <figure key={record.text.tr} className={styles.doc}>
              <p className={styles.docText}>{pick(record.text, locale)}</p>
              <figcaption className={styles.docCaption}>
                <span className={styles.docBy}>{pick(record.by, locale)}</span>
                <span className={styles.docNote}>
                  {pick(record.note, locale)}
                </span>
              </figcaption>
            </figure>
          ))}

          <p className={styles.motto} aria-hidden>
            {MINATO_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(MINATO_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(MINATO_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(MINATO_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={MINATO_ID}
                slot="ABILITY"
                abilityName={MINATO_IMAGE_KEYS.closing}
                label={pick(
                  MINATO_SLOT_LABELS[MINATO_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}

          <FlameHem className={styles.closingHem} flipped />
        </section>
      </CuratorFrame>
    </HiraishinShell>
  );
}
