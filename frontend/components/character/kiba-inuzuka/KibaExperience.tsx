import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { animeHref } from "@/lib/anime/routes";
import { pick } from "@/lib/characters/types";
import {
  collectAbilityImages,
  companionPortraits,
  isExperienceCharacter,
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import {
  KIBA_ALT,
  KIBA_CLONE_TEXT,
  KIBA_CLOSING,
  KIBA_CRUMB,
  KIBA_HERO,
  KIBA_ID,
  KIBA_IDENTITY,
  KIBA_IMAGE_KEYS,
  KIBA_JUTSU,
  KIBA_KIT,
  KIBA_PACK,
  KIBA_SCENT,
  KIBA_SECTIONS,
  KIBA_SITE_URL,
  KIBA_SLOT_LABELS,
  KIBA_SYNC,
  KIBA_SYNC_UI,
  KIBA_TIMELINE,
} from "@/lib/characters/kiba-inuzuka-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { PackShell } from "./PackShell";
import { SyncLadder } from "./SyncLadder";
import { AkamaruSilhouette, FangMarks, ScentThread } from "./InuzukaGlyphs";
import styles from "./KibaExperience.module.css";

/**
 * Kiba Inuzuka — "İki Beden, Tek Sürü" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/3495 bu bileşene dallanır (rota
 * dosyasındaki harita). Sayfanın fikri tek cümle: BİR KİŞİ İKİ GÖVDEDİR.
 *
 * ── SAYFANIN İKİ YAPISAL FİKRİ ───────────────────────────────────────────
 * 1. EŞ ZAMANLAMA MERDİVENİ (kalp): "Eş zamanlama kademeleri" bölümünde
 *    sayfa iki sütuna ayrılır — solda Kiba, sağda Akamaru. Kademe
 *    yükseldikçe iki sütun birbirine yaklaşır ve son kademede (Sōtōrō) tek
 *    bir gövdeye kilitlenir. Düzenin kendisi anlatının parçası; metin ile
 *    ızgara aynı şeyi söyler.
 * 2. KOKU İZİ: bölümlerin kenarında ince bir çizgi sayfanın tamamı boyunca
 *    ilerler ve her bölümün başında bir klan işaretiyle düğümlenir. Kiba'nın
 *    dünyayı burnuyla okuması, sayfanın kendi omurgası hâline geldi.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var (BRIEF §8, en fazla 3):
 *   PackShell  — "Beast Human Clone" modu (tek boolean, etkinin tamamı CSS)
 *   SyncLadder — beş kademelik merdiven (radiogroup + klavye + omurga şeması)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 3495 kaydının ABILITY yuvaları (`kiba:*`). Hiçbiri
 * zorunlu değil — yuva boşken bölüm görselsiz ama AYAKTA kalır.
 */
export function KibaExperience({
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
  const heroScene = src(KIBA_IMAGE_KEYS.hero);
  const scentArt = src(KIBA_IMAGE_KEYS.scent);
  const closingArt = src(KIBA_IMAGE_KEYS.closing);

  const name = detail.character.name || KIBA_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? KIBA_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? KIBA_SITE_URL;

  const portraitAlt = pick(
    portraitUploaded ? KIBA_HERO.portraitAlt : KIBA_HERO.portraitAltFallback,
    locale,
  );

  const stages = KIBA_SYNC.map((stage) => ({
    key: stage.key,
    kanji: stage.kanji,
    romaji: stage.romaji,
    title: pick(stage.title, locale),
    kiba: pick(stage.kiba, locale),
    akamaru: pick(stage.akamaru, locale),
    bond: pick(stage.bond, locale),
    image: src(stage.imageKey),
  }));

  return (
    <PackShell
      enterLabel={pick(KIBA_CLONE_TEXT.enter, locale)}
      exitLabel={pick(KIBA_CLONE_TEXT.exit, locale)}
      hint={pick(KIBA_CLONE_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>{pick(KIBA_CRUMB.naruto, locale)}</Link>
        </nav>

        {/* ══ 1 · HERO ════════════════════════════════════════════════════
            Portre dar bir kadrajda sağda; solda ad, klan işareti ve giriş.
            Arkada toz ve Akamaru'nun silueti — ikinci beden daha ilk
            ekranda kadrajın içinde. */}
        <section className={styles.hero} aria-labelledby="kib-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <span className={styles.heroBeast} aria-hidden>
            <AkamaruSilhouette className={styles.beastArt} />
          </span>

          <p className={styles.heroMark} aria-hidden>
            {KIBA_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <p className={styles.heroClan}>{pick(KIBA_IDENTITY.clan, locale)}</p>
            <h1 id="kib-name" className={styles.heroName}>
              {/* Klon modunda beliren ikinci kopya — salt dekoratif */}
              <span className={styles.heroEcho} aria-hidden>
                {name}
              </span>
              <span className={styles.heroReal}>{name}</span>
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {nativeName}
            </p>

            <div className={styles.heroFangs}>
              <FangMarks
                className={styles.fangArt}
                markClassName={styles.fangMark}
              />
              <p className={styles.fangCaption}>
                {pick(KIBA_HERO.markCaption, locale)}
              </p>
            </div>

            <p className={styles.heroEpigraph}>
              {pick(KIBA_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(KIBA_HERO.lede, locale)}</p>
          </div>

          <div className={styles.heroAside}>
            {portrait ? (
              <>
                {/* Klon modunun ikinci gövdesi. Görünür olana kadar
                    `display: none` — tarayıcı gizli ve tembel görseli
                    istemiyor, yani ziyaretçiye ek indirme çıkmıyor. */}
                <span className={styles.heroPortraitEcho} aria-hidden>
                  <Image
                    src={portrait}
                    alt=""
                    fill
                    sizes="360px"
                    unoptimized={!portraitUploaded}
                  />
                </span>
                <span className={styles.heroPortrait}>
                  <Image
                    src={portrait}
                    alt={portraitAlt}
                    fill
                    sizes="360px"
                    priority
                    unoptimized={!portraitUploaded}
                  />
                </span>
              </>
            ) : null}
          </div>

          <ScentThread
            className={styles.heroThread}
            pathClassName={styles.threadLine}
          />

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={KIBA_ID}
                slot="ABILITY"
                abilityName={KIBA_IMAGE_KEYS.hero}
                label={pick(KIBA_SLOT_LABELS[KIBA_IMAGE_KEYS.hero], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ═══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="kib-identity">
          <header className={styles.sectionHead}>
            <h2 id="kib-identity" className={styles.sectionTitle}>
              {pick(KIBA_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KIBA_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {KIBA_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · KOKU İZİ ════════════════════════════════════════════════
            Sayfanın ikinci yapısal fikri burada adını alıyor: kenardaki
            çizgi bir süs değil, bu bölümün konusu. */}
        <section className={styles.section} aria-labelledby="kib-scent">
          <header className={styles.sectionHead}>
            <h2 id="kib-scent" className={styles.sectionTitle}>
              {pick(KIBA_SECTIONS.scent.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KIBA_SECTIONS.scent.lede, locale)}
            </p>
          </header>

          <div className={styles.scentWrap}>
            <dl className={styles.scent}>
              {KIBA_SCENT.map((entry) => (
                <div key={entry.key} className={styles.scentItem}>
                  <dt className={styles.scentTerm}>
                    <FangMarks
                      className={styles.scentBullet}
                      markClassName={styles.scentBulletMark}
                    />
                    {pick(entry.reading, locale)}
                  </dt>
                  <dd className={styles.scentNote}>{pick(entry.note, locale)}</dd>
                </div>
              ))}
            </dl>

            <span className={styles.scentArt} aria-hidden>
              {scentArt ? (
                <Image src={scentArt} alt="" fill sizes="520px" />
              ) : null}
            </span>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={KIBA_ID}
                slot="ABILITY"
                abilityName={KIBA_IMAGE_KEYS.scent}
                label={pick(KIBA_SLOT_LABELS[KIBA_IMAGE_KEYS.scent], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 4 · SÜRÜ ════════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="kib-pack">
          <header className={styles.sectionHead}>
            <h2 id="kib-pack" className={styles.sectionTitle}>
              {pick(KIBA_SECTIONS.pack.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KIBA_SECTIONS.pack.lede, locale)}
            </p>
          </header>
          <ul className={styles.pack}>
            {KIBA_PACK.map((member) => {
              const face = faces.get(member.characterId) ?? null;
              const linked = isExperienceCharacter(member.characterId);
              return (
                <li key={member.characterId} className={styles.packItem}>
                  <span className={styles.packArt}>
                    {face ? (
                      <Image
                        src={face}
                        alt={`${member.name} ${pick(KIBA_ALT.packSuffix, locale)}`}
                        fill
                        sizes="240px"
                      />
                    ) : null}
                  </span>
                  <span className={styles.packBody}>
                    <span className={styles.packRole}>
                      {pick(member.role, locale)}
                    </span>
                    <span className={styles.packName}>
                      {linked ? (
                        <Link href={animeHref.character(member.characterId)}>
                          {member.name}
                        </Link>
                      ) : (
                        member.name
                      )}
                    </span>
                    <span className={styles.packNote}>
                      {pick(member.note, locale)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · ÜÇ TEKNİK ═══════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="kib-jutsu">
          <header className={styles.sectionHead}>
            <h2 id="kib-jutsu" className={styles.sectionTitle}>
              {pick(KIBA_SECTIONS.jutsu.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KIBA_SECTIONS.jutsu.lede, locale)}
            </p>
          </header>
          <ul className={styles.forms}>
            {KIBA_JUTSU.map((jutsu) => {
              const art = src(jutsu.imageKey);
              return (
                <li key={jutsu.key} className={styles.form}>
                  <span className={styles.formKanji} aria-hidden>
                    {jutsu.kanji}
                  </span>
                  <span className={styles.formArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="640px" /> : null}
                  </span>
                  <span className={styles.formBody}>
                    <span className={styles.formName}>{jutsu.name}</span>
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
                      characterId={KIBA_ID}
                      slot="ABILITY"
                      abilityName={jutsu.imageKey}
                      label={pick(KIBA_SLOT_LABELS[jutsu.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 6 · ÇANTADAKİLER ════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="kib-kit">
          <header className={styles.sectionHead}>
            <h2 id="kib-kit" className={styles.sectionTitle}>
              {pick(KIBA_SECTIONS.kit.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KIBA_SECTIONS.kit.lede, locale)}
            </p>
          </header>
          <ul className={styles.kit}>
            {KIBA_KIT.map((item) => {
              const art = src(item.imageKey);
              return (
                <li key={item.key} className={styles.kitItem}>
                  <span className={styles.kitArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="480px" /> : null}
                  </span>
                  <span className={styles.kitName}>{pick(item.name, locale)}</span>
                  <span className={styles.kitGloss}>
                    {pick(item.gloss, locale)}
                  </span>
                  <span className={styles.kitNote}>{pick(item.note, locale)}</span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={KIBA_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(KIBA_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 7 · EŞ ZAMANLAMA KADEMELERİ — SAYFANIN KALBİ ════════════════ */}
        <section className={styles.syncSection} aria-labelledby="kib-sync">
          <header className={styles.sectionHead}>
            <h2 id="kib-sync" className={styles.sectionTitle}>
              {pick(KIBA_SECTIONS.sync.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KIBA_SECTIONS.sync.lede, locale)}
            </p>
          </header>

          <SyncLadder
            stages={stages}
            groupLabel={pick(KIBA_SYNC_UI.groupLabel, locale)}
            stageWord={pick(KIBA_SYNC_UI.stageWord, locale)}
            prevLabel={pick(KIBA_SYNC_UI.prev, locale)}
            nextLabel={pick(KIBA_SYNC_UI.next, locale)}
            kibaColumn={pick(KIBA_SYNC_UI.kibaColumn, locale)}
            akamaruColumn={pick(KIBA_SYNC_UI.akamaruColumn, locale)}
            kibaRole={pick(KIBA_SYNC_UI.kibaRole, locale)}
            akamaruRole={pick(KIBA_SYNC_UI.akamaruRole, locale)}
            bondLabel={pick(KIBA_SYNC_UI.bondLabel, locale)}
            keyboardHint={pick(KIBA_SYNC_UI.keyboardHint, locale)}
            diagramAlt={pick(KIBA_SYNC_UI.diagramAlt, locale)}
          />

          {isAdmin ? (
            <div className={styles.slotRow}>
              {KIBA_SYNC.map((stage) => (
                <CuratorSlot
                  key={stage.imageKey}
                  characterId={KIBA_ID}
                  slot="ABILITY"
                  abilityName={stage.imageKey}
                  label={pick(KIBA_SLOT_LABELS[stage.imageKey], locale)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 8 · ÖMÜR ÇİZELGESİ ══════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="kib-fate">
          <header className={styles.sectionHead}>
            <h2 id="kib-fate" className={styles.sectionTitle}>
              {pick(KIBA_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KIBA_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {KIBA_TIMELINE.map((entry) => {
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
                        <p className={styles.quoteNative} aria-hidden>
                          {entry.quote.native}
                        </p>
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
                      characterId={KIBA_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(KIBA_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 9 · KAPANIŞ ═════════════════════════════════════════════════
            İki gövde: biri doğrulanmış replik, diğeri açıkça etiketlenmiş
            arşiv notu (bkz. veri dosyasındaki replik disiplini notu). */}
        <section className={styles.closing} aria-labelledby="kib-closing">
          <h2 id="kib-closing" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}

          <figure className={styles.closingQuote}>
            <p className={styles.quoteNative} aria-hidden>
              {KIBA_CLOSING.quote.native}
            </p>
            <blockquote>
              &ldquo;{pick(KIBA_CLOSING.quote.text, locale)}&rdquo;
            </blockquote>
            <figcaption>
              <span className={styles.quoteBy}>
                {pick(KIBA_CLOSING.quote.by, locale)}
              </span>
              <span className={styles.quoteNote}>
                {pick(KIBA_CLOSING.quote.note, locale)}
              </span>
            </figcaption>
          </figure>

          <figure className={styles.closingRecord}>
            <blockquote>{pick(KIBA_CLOSING.record.text, locale)}</blockquote>
            <figcaption>{pick(KIBA_CLOSING.record.label, locale)}</figcaption>
          </figure>

          <p className={styles.motto} aria-hidden>
            {KIBA_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(KIBA_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(KIBA_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(KIBA_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={KIBA_ID}
                slot="ABILITY"
                abilityName={KIBA_IMAGE_KEYS.closing}
                label={pick(KIBA_SLOT_LABELS[KIBA_IMAGE_KEYS.closing], locale)}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </PackShell>
  );
}
