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
  INO_ALT,
  INO_BENCH,
  INO_CLOSING,
  INO_CRUMB,
  INO_FLOWERS,
  INO_HERO,
  INO_ID,
  INO_IDENTITY,
  INO_IMAGE_KEYS,
  INO_JUTSU,
  INO_SECTIONS,
  INO_SITE_URL,
  INO_SLOT_LABELS,
  INO_SWITCH_TEXT,
  INO_TIMELINE,
  INO_WEB_NODES,
  INO_WEB_UI,
} from "@/lib/characters/ino-yamanaka-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { ShintenshinShell } from "./ShintenshinShell";
import { MindWeb } from "./MindWeb";
import { BenchGlyph, BloomField, InoFlower, MindDiagram } from "./InoGlyphs";
import styles from "./InoExperience.module.css";

/**
 * Ino Yamanaka — "Zihinden Zihne" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/2009 bu bileşene dallanır
 * (rota dosyasındaki `EXPERIENCES` haritası). Sayfanın fikri tek cümle:
 * BAĞLANTI BİRİKİR. Ino'nun ömrü tek bir zihne girmekle başlıyor, bir
 * cephenin tamamını birbirine bağlamakla bitiyor; sayfanın kalbindeki
 * bölüm de bu birikmeyi ziyaretçiye ELLE ördürüyor — kurulan bağ kurulu
 * kalıyor, ağ büyüdükçe dıştaki ittifak halkası doluyor.
 *
 * İkinci yapısal fikir hanakotoba: Yamanaka'lar çiçekçi, ve Japon çiçek
 * dilinde her çiçeğin yazılı bir anlamı var. İlişkiler bölümü bir künye
 * listesi değil, bir herbaryum çizelgesi — her kişiye bir çiçek, her
 * çiçeğe sözlükteki anlamı.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   ShintenshinShell — "Shintenshin" modu (tek sayaç, etkinin tamamı CSS)
 *   MindWeb          — zihin ağı (biriken bağlar + klavye)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 2009 kaydının ABILITY yuvaları (`ino:*`).
 * Hiçbiri zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır;
 * çiçekler, şemalar ve ağ zaten elle çizilmiş SVG.
 */
export function InoExperience({
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
  const heroScene = src(INO_IMAGE_KEYS.hero);
  const closingArt = src(INO_IMAGE_KEYS.closing);

  const name = detail.character.name || INO_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? INO_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? INO_SITE_URL;

  const webNodes = INO_WEB_NODES.map((node) => ({
    key: node.key,
    kanji: node.kanji,
    who: pick(node.who, locale),
    title: pick(node.title, locale),
    eyes: pick(node.eyes, locale),
    body: pick(node.body, locale),
    learned: pick(node.learned, locale),
    image: src(node.imageKey),
    imageAlt: pick(INO_SLOT_LABELS[node.imageKey], locale),
    finale: node.finale === true,
  }));

  return (
    <ShintenshinShell
      enterLabel={pick(INO_SWITCH_TEXT.enter, locale)}
      exitLabel={pick(INO_SWITCH_TEXT.exit, locale)}
      hint={pick(INO_SWITCH_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>{pick(INO_CRUMB.naruto, locale)}</Link>
        </nav>

        {/* ══ 1 · HERO — AÇILAN ÇİÇEK ═════════════════════════════════════
            Portre kemerli bir çerçevede (dükkân kapısı / sera camı), arkada
            üç kademeli bir taç çok düşük opaklıkta açılıyor. Filigran
            yatay ve kadrajın dışına taşıyor. */}
        <section className={styles.hero} aria-labelledby="ino-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <BloomField className={styles.heroBloom} />

          <p className={styles.heroMark} aria-hidden>
            {INO_IDENTITY.watermark}
          </p>

          <div className={styles.heroPortraitWrap}>
            {portrait ? (
              <span className={styles.heroPortrait}>
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? INO_HERO.portraitAlt
                      : INO_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="420px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              </span>
            ) : null}
          </div>

          <div className={styles.heroBody}>
            <h1 id="ino-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative}>
              <span className={styles.heroNativeText}>{nativeName}</span>
              <span className={styles.heroClan}>
                {pick(INO_IDENTITY.clan, locale)}
              </span>
            </p>
            <p className={styles.heroEpigraph}>
              {pick(INO_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(INO_IDENTITY.lede, locale)}</p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={INO_ID}
                slot="ABILITY"
                abilityName={INO_IMAGE_KEYS.hero}
                label={pick(INO_SLOT_LABELS[INO_IMAGE_KEYS.hero], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="ino-identity">
          <header className={styles.sectionHead}>
            <h2 id="ino-identity" className={styles.sectionTitle}>
              {pick(INO_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(INO_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {INO_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · KLANIN ÜÇ AYARI ════════════════════════════════════════
            Kart ızgarası DEĞİL: üç sıra, her sırada solda şema sağda metin.
            Şemalar üçünün farkını çiziyor — dolu daire bilinç, kesikli
            daire boşalmış beden, ince iplik bağ. */}
        <section className={styles.section} aria-labelledby="ino-jutsu">
          <header className={styles.sectionHead}>
            <h2 id="ino-jutsu" className={styles.sectionTitle}>
              {pick(INO_SECTIONS.lab.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(INO_SECTIONS.lab.lede, locale)}
            </p>
          </header>
          <ul className={styles.forms}>
            {INO_JUTSU.map((jutsu) => {
              const art = src(jutsu.imageKey);
              return (
                <li key={jutsu.key} className={styles.form}>
                  <span className={styles.formPlate}>
                    <span className={styles.formKanji} aria-hidden>
                      {jutsu.kanji}
                    </span>
                    <MindDiagram
                      kind={jutsu.diagram}
                      className={styles.formDiagram}
                    />
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

                  <span className={styles.formArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="480px" /> : null}
                  </span>

                  {isAdmin ? (
                    <CuratorSlot
                      characterId={INO_ID}
                      slot="ABILITY"
                      abilityName={jutsu.imageKey}
                      label={pick(INO_SLOT_LABELS[jutsu.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · TEZGÂHIN ALTINDAKİLER — dört küçük ═════════════════════ */}
        <section className={styles.section} aria-labelledby="ino-bench">
          <header className={styles.sectionHead}>
            <h2 id="ino-bench" className={styles.sectionTitle}>
              {pick(INO_SECTIONS.bench.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(INO_SECTIONS.bench.lede, locale)}
            </p>
          </header>
          <ul className={styles.bench}>
            {INO_BENCH.map((item) => {
              const art = src(item.imageKey);
              return (
                <li key={item.key} className={styles.benchItem}>
                  <span className={styles.benchArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="420px" /> : null}
                  </span>
                  <BenchGlyph kind={item.glyph} className={styles.benchGlyph} />
                  <span className={styles.benchName}>
                    {pick(item.name, locale)}
                  </span>
                  <span className={styles.benchNote}>
                    {pick(item.note, locale)}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={INO_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(INO_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · ZİHİN AĞI — SAYFANIN KALBİ ═════════════════════════════ */}
        <section className={styles.webSection} aria-labelledby="ino-web">
          <header className={styles.sectionHead}>
            <h2 id="ino-web" className={styles.sectionTitle}>
              {pick(INO_SECTIONS.web.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(INO_SECTIONS.web.lede, locale)}
            </p>
          </header>
          <MindWeb
            nodes={webNodes}
            groupLabel={pick(INO_WEB_UI.groupLabel, locale)}
            counterLabel={pick(INO_WEB_UI.counterLabel, locale)}
            resetLabel={pick(INO_WEB_UI.reset, locale)}
            linkedBadge={pick(INO_WEB_UI.linkedBadge, locale)}
            eyesLabel={pick(INO_WEB_UI.eyesLabel, locale)}
            learnedLabel={pick(INO_WEB_UI.learnedLabel, locale)}
            idleTitle={pick(INO_WEB_UI.idleTitle, locale)}
            idleText={pick(INO_WEB_UI.idleText, locale)}
            hint={pick(INO_WEB_UI.hint, locale)}
            ringNote={pick(INO_WEB_UI.ringNote, locale)}
            completeNote={pick(INO_WEB_UI.complete, locale)}
            webAlt={pick(INO_WEB_UI.webAlt, locale)}
            linkedAnnounce={pick(INO_WEB_UI.linkedAnnounce, locale)}
            releasedAnnounce={pick(INO_WEB_UI.releasedAnnounce, locale)}
          />
          {isAdmin ? (
            <div className={styles.slotRow}>
              {INO_WEB_NODES.map((node) => (
                <CuratorSlot
                  key={node.imageKey}
                  characterId={INO_ID}
                  slot="ABILITY"
                  abilityName={node.imageKey}
                  label={pick(INO_SLOT_LABELS[node.imageKey], locale)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 6 · ÇİÇEK DİLİ ═════════════════════════════════════════════
            Herbaryum çizelgesi: solda elle çizilmiş çiçek, ortada sözlük
            künyesi, sağda kişi. Kart yok — cetvel çizgileriyle ayrılmış
            satırlar, bir çiçekçinin defteri gibi. */}
        <section className={styles.section} aria-labelledby="ino-flowers">
          <header className={styles.sectionHead}>
            <h2 id="ino-flowers" className={styles.sectionTitle}>
              {pick(INO_SECTIONS.flowers.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(INO_SECTIONS.flowers.lede, locale)}
            </p>
          </header>
          <ul className={styles.plates}>
            {INO_FLOWERS.map((entry) => {
              const face = entry.characterId
                ? (faces.get(entry.characterId) ?? null)
                : null;
              return (
                <li key={entry.key} className={styles.plate}>
                  <span className={styles.plateArt}>
                    <InoFlower
                      name={entry.glyph}
                      className={styles.plateFlower}
                    />
                  </span>

                  <span className={styles.plateSpec}>
                    <span className={styles.plateKanji} aria-hidden>
                      {entry.kanji}
                    </span>
                    <span className={styles.plateRomaji}>{entry.romaji}</span>
                    <span className={styles.plateName}>
                      {pick(entry.flower, locale)}
                    </span>
                    <span className={styles.plateMeaning}>
                      {pick(entry.meaning, locale)}
                    </span>
                  </span>

                  <span className={styles.plateWho}>
                    <span className={styles.plateFace}>
                      {face ? (
                        <Image
                          src={face}
                          alt={`${entry.person} ${pick(INO_ALT.companionSuffix, locale)}`}
                          fill
                          sizes="128px"
                        />
                      ) : null}
                    </span>
                    <span className={styles.platePerson}>{entry.person}</span>
                    <span className={styles.plateReading}>
                      {pick(entry.reading, locale)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 7 · ÖMÜR ÇİZELGESİ ═════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="ino-fate">
          <header className={styles.sectionHead}>
            <h2 id="ino-fate" className={styles.sectionTitle}>
              {pick(INO_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(INO_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {INO_TIMELINE.map((entry) => {
              const art = src(entry.imageKey);
              return (
                <li key={entry.key} className={styles.fateItem}>
                  <p className={styles.fateAge}>{pick(entry.age, locale)}</p>
                  <div className={styles.fateBody}>
                    <h3 className={styles.fateTitle}>
                      {pick(entry.title, locale)}
                    </h3>
                    <p className={styles.fateText}>{pick(entry.text, locale)}</p>
                  </div>
                  <span className={styles.fateArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="560px" /> : null}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={INO_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(INO_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 8 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="ino-closing">
          <h2 id="ino-closing" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}

          <div className={styles.names}>
            {INO_CLOSING.names.map((item) => (
              <figure key={item.text.tr} className={styles.nameCard}>
                <blockquote>&ldquo;{pick(item.text, locale)}&rdquo;</blockquote>
                <figcaption>
                  <span className={styles.nameBy}>{pick(item.by, locale)}</span>
                  <span className={styles.nameNote}>
                    {pick(item.note, locale)}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className={styles.motto} aria-hidden>
            {INO_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(INO_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(INO_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(INO_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={INO_ID}
                slot="ABILITY"
                abilityName={INO_IMAGE_KEYS.closing}
                label={pick(INO_SLOT_LABELS[INO_IMAGE_KEYS.closing], locale)}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </ShintenshinShell>
  );
}
