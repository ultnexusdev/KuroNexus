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
  ARMIN_ARTS,
  ARMIN_CLOSING,
  ARMIN_CRUMB,
  ARMIN_DESK_UI,
  ARMIN_DETAILS,
  ARMIN_EVENT,
  ARMIN_GAPS,
  ARMIN_HERO,
  ARMIN_ID,
  ARMIN_IDENTITY,
  ARMIN_IMAGE_KEYS,
  ARMIN_MISSING_NOTE,
  ARMIN_MODE_TEXT,
  ARMIN_NOTES,
  ARMIN_PORTRAIT,
  ARMIN_READINGS,
  ARMIN_SECTIONS,
  ARMIN_SITE_URL,
  ARMIN_SLOTS,
  ARMIN_TIMELINE,
  ARMIN_VERDICT,
  ARMIN_WITNESS_UI,
  ARMIN_WITNESSES,
} from "@/lib/characters/armin-arlert-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorGaps, type CuratorGapRow } from "@/components/character/CuratorGaps";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { CoastMap, HorizonRule } from "./HorizonGlyphs";
import { ReadingDesk } from "./ReadingDesk";
import { SteamShell } from "./SteamShell";
import styles from "./HorizonExperience.module.css";

/**
 * Armin Arlert — "Ufuk" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/46494 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın tezi tek cümle: AYNI OLAY, BEŞ OKUMA.
 * Armin'in serideki işi savaşmak değil okumaktı; elindeki veri herkesle
 * aynıydı, farkı yorumuydu. Sayfa da o yönteme göre kurulu — solda yapışkan
 * bir DEFTER sütunu (yorum), sağda olay.
 *
 * ── SAYFA SUNUCUDA ÇİZİLİR ───────────────────────────────────────────────
 * İki istemci adası var (bütçe: en fazla 3):
 *   SteamShell  — "Kolosal buhar" modu; tek boolean, etkisi CSS'te
 *   ReadingDesk — beş okuma tezgâhı (sayfanın kalbi)
 * `HorizonGlyphs` ada DEĞİL: durum tutmuyor, sunucuda çiziliyor.
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iniyor.
 *
 * ── GÖRSELLER ────────────────────────────────────────────────────────────
 * Portre depoda: `public/assets/anime/karakterler/armin-arlert/` (AniList'ten
 * indirildi, künyesi `kaynak.json`). ⚠️ 230×345, yani hero olamayacak kadar
 * küçük — madalyon ölçüsünde duruyor, büyük kadraj `arm:hero` yuvasında
 * bekliyor. Sahne kareleri characterId 46494 kaydının ABILITY yuvalarında
 * (`arm:*`) ve 30 Ağustos 2026 itibarıyla HİÇBİRİ dolu değil: her kadraj
 * görselsiz de ayakta duruyor, yerine elle çizilmiş ufuk çizgisi geçiyor.
 */
export function HorizonExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const faces = companionPortraits(companions);
  const src = (key: string): string | null => ability.get(key) ?? null;

  /* Portre kaynağı: önce küratörün yüklediği PORTRAIT yuvası, yoksa depodaki
     yerel AniList karesi. AniList'in UZAK adresi HİÇ kullanılmıyor (Faz 2 §3:
     hotlink yok) — bu yüzden `unoptimized` de yazılmıyor, iki kaynak da
     bizim. */
  const uploadedPortrait = isUploadedPortrait(detail)
    ? primaryPortrait(detail)
    : null;
  const portraitSrc = uploadedPortrait ?? ARMIN_PORTRAIT.src;
  const portraitAlt = pick(
    uploadedPortrait ? ARMIN_HERO.portraitAlt : ARMIN_HERO.portraitAltFallback,
    locale,
  );

  const heroScene = src(ARMIN_IMAGE_KEYS.hero);
  const deskScene = src(ARMIN_IMAGE_KEYS.desk);
  const closingScene = src(ARMIN_IMAGE_KEYS.closing);

  const name = detail.character.name || ARMIN_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? ARMIN_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? ARMIN_SITE_URL;
  const faceSuffix = pick(ARMIN_WITNESS_UI.portraitSuffix, locale);

  /** Tezgâha inen düz dizeler — istemci adasına `LocalizedText` girmiyor. */
  const readings = ARMIN_READINGS.map((row) => ({
    key: row.key,
    index: row.index,
    title: pick(row.title, locale),
    retell: pick(row.retell, locale),
    means: pick(row.means, locale),
    drops: pick(row.drops, locale),
    next: pick(row.next, locale),
  }));

  /** Boşluk özeti — anahtar sırası `ARMIN_IMAGE_KEYS`'in kendi sırası. */
  const gapRows: CuratorGapRow[] = Object.values(ARMIN_IMAGE_KEYS).map(
    (key) => ({
      key,
      label: pick(ARMIN_SLOTS[key].label, locale),
      spec: `${pick(ARMIN_SLOTS[key].spec, locale)} · ${ARMIN_SLOTS[key].w}×${ARMIN_SLOTS[key].h}`,
      filled: ability.has(key),
    }),
  );

  /**
   * Yuva çizimi tek yerden — her görselin/boş kadrajın HEMEN altında.
   *
   * ⚠️ Sarmalayıcı da `data-curator-slot` taşıyor: küratör anahtarı
   * kapalıyken `CuratorSlot` kendini hiç çizmiyor ama bu kap kalırdı ve
   * boşluğu ızgaraya eklerdi. Nitelik `CuratorFrame`in CSS'ine kabı da
   * kapatma izni veriyor (memory: gizleme `isAdmin` ile değil, nitelikle).
   */
  const slot = (key: string) =>
    isAdmin ? (
      <div className={styles.slotRow} data-curator-slot>
        <CuratorSlot
          characterId={ARMIN_ID}
          slot="ABILITY"
          abilityName={key}
          label={pick(ARMIN_SLOTS[key].label, locale)}
          size={{ w: ARMIN_SLOTS[key].w, h: ARMIN_SLOTS[key].h }}
        />
      </div>
    ) : null;

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Filigran bir arma değil bir HARİTA: kıyı çizgisi + izohips. Armin'in
     dünyası ölçülmüş ama gidilmemiş bir kıyıdır; kanji 海 onun üstünde. */
  const header = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link className={styles.crumbLink} href={animeHref.characters()}>
          {t("backToGallery")}
        </Link>
        <span className={styles.crumbSep} aria-hidden>
          ·
        </span>
        <span className={styles.crumbHere}>
          {pick(ARMIN_CRUMB.series, locale)}
        </span>
      </nav>

      <section className={styles.hero} aria-labelledby="arm-name">
        <span className={styles.heroMap} aria-hidden>
          <CoastMap />
        </span>
        <span className={styles.heroKanji} aria-hidden>
          {ARMIN_IDENTITY.watermark}
        </span>

        <div className={styles.heroBody}>
          <p className={styles.heroHouse}>
            {pick(ARMIN_IDENTITY.house, locale)}
          </p>
          <h1 id="arm-name" className={styles.heroName}>
            {name}
          </h1>
          <p className={styles.heroNative} lang="ja">
            {nativeName}
          </p>
          <p className={styles.heroEpigraph}>
            {pick(ARMIN_IDENTITY.epigraph, locale)}
          </p>
          <p className={styles.heroLede}>{pick(ARMIN_HERO.lede, locale)}</p>
        </div>

        <div className={styles.heroAside}>
          <figure className={styles.portrait}>
            <span className={styles.portraitFrame}>
              <Image
                className={styles.portraitImg}
                src={portraitSrc}
                alt={portraitAlt}
                width={ARMIN_PORTRAIT.width}
                height={ARMIN_PORTRAIT.height}
                priority
              />
            </span>
            <figcaption className={styles.portraitCap}>
              {portraitAlt}
            </figcaption>
          </figure>
          {slot(ARMIN_IMAGE_KEYS.portrait)}
        </div>

        {/* Geniş ufuk kadrajı — boşken elle çizilmiş çizgi duruyor */}
        <div className={styles.heroBand}>
          {heroScene ? (
            <Image
              src={heroScene}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 1200px"
              className={styles.heroBandImg}
            />
          ) : (
            <span className={styles.heroBandEmpty} aria-hidden>
              <HorizonRule />
            </span>
          )}
        </div>
        <p className={styles.heroBandCap}>
          {pick(ARMIN_HERO.bandCaption, locale)}
        </p>
        {slot(ARMIN_IMAGE_KEYS.hero)}
      </section>
    </>
  );

  return (
    <CuratorFrame isAdmin={isAdmin}>
      <SteamShell
        header={header}
        enterLabel={pick(ARMIN_MODE_TEXT.enter, locale)}
        exitLabel={pick(ARMIN_MODE_TEXT.exit, locale)}
        stateLabel={pick(ARMIN_MODE_TEXT.stateLabel, locale)}
        stateAnalysis={pick(ARMIN_MODE_TEXT.stateAnalysis, locale)}
        stateRuin={pick(ARMIN_MODE_TEXT.stateRuin, locale)}
        hint={pick(ARMIN_MODE_TEXT.hint, locale)}
      >
        {/* ══ İKİ KOLON — asimetrik ═════════════════════════════════════════
            Sol: dar, yapışkan defter. Sağ: geniş akış. 900 px altında ve
            buhar modunda tek kolona iner. */}
        <div className={styles.grid}>
          <aside className={styles.rail} aria-labelledby="arm-notes">
            <h2 id="arm-notes" className={styles.railTitle}>
              {pick(ARMIN_NOTES.title, locale)}
            </h2>
            <p className={styles.railHint}>{pick(ARMIN_NOTES.hint, locale)}</p>
            <ol className={styles.railList}>
              {ARMIN_NOTES.rows.map((row) => (
                <li key={row.id} className={styles.railItem}>
                  <a className={styles.railLink} href={`#${row.id}`}>
                    <span className={styles.railNum} aria-hidden>
                      {row.num}
                    </span>
                    <span className={styles.railText}>
                      {pick(row.text, locale)}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <div className={styles.stream}>
            {/* ══ 3 · KÜNYE ŞERİDİ ══════════════════════════════════════════ */}
            <section className={styles.section} aria-labelledby="arm-identity">
              <header className={styles.sectionHead}>
                <h2 id="arm-identity" className={styles.sectionTitle}>
                  {pick(ARMIN_SECTIONS.identity.title, locale)}
                </h2>
                <p className={styles.sectionLede}>
                  {pick(ARMIN_SECTIONS.identity.lede, locale)}
                </p>
                <span className={styles.sectionRule} aria-hidden>
                  <HorizonRule />
                </span>
              </header>

              <dl className={styles.facts}>
                {ARMIN_IDENTITY.facts.map((fact) => (
                  <div key={fact.label.tr} className={styles.fact}>
                    <dt className={styles.factLabel}>
                      {pick(fact.label, locale)}
                    </dt>
                    <dd className={styles.factValue}>
                      {pick(fact.value, locale)}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className={styles.factNote}>
                {pick(ARMIN_MISSING_NOTE, locale)}
              </p>
            </section>

            {/* ══ 4 · GÜÇ LABORATUVARI — 3 büyük + 4 küçük ══════════════════ */}
            <section className={styles.section} aria-labelledby="arm-lab">
              <header className={styles.sectionHead}>
                <h2 id="arm-lab" className={styles.sectionTitle}>
                  {pick(ARMIN_SECTIONS.lab.title, locale)}
                </h2>
                <p className={styles.sectionLede}>
                  {pick(ARMIN_SECTIONS.lab.lede, locale)}
                </p>
                <span className={styles.sectionRule} aria-hidden>
                  <HorizonRule />
                </span>
              </header>

              <ul className={styles.arts}>
                {ARMIN_ARTS.map((art) => {
                  const scene = src(art.imageKey);
                  return (
                    <li key={art.key} className={styles.art}>
                      <div className={styles.artMedia}>
                        <div className={styles.artFrame}>
                          {scene ? (
                            <Image
                              src={scene}
                              alt=""
                              fill
                              sizes="(max-width: 900px) 100vw, 760px"
                              className={styles.artImg}
                            />
                          ) : (
                            <span className={styles.frameEmpty} aria-hidden>
                              <HorizonRule />
                            </span>
                          )}
                        </div>
                        {slot(art.imageKey)}
                      </div>

                      <div className={styles.artBody}>
                        <p className={styles.artKanji} lang="ja">
                          {art.kanji}
                        </p>
                        <p className={styles.artReading} aria-hidden>
                          {art.reading}
                        </p>
                        <h3 className={styles.artName}>
                          {pick(art.name, locale)}
                        </h3>
                        <p className={styles.artTagline}>
                          {pick(art.tagline, locale)}
                        </p>
                        <p className={styles.artText}>
                          {pick(art.text, locale)}
                        </p>
                        <ul className={styles.artTraits}>
                          {art.traits.map((trait) => (
                            <li key={trait.tr} className={styles.trait}>
                              {pick(trait, locale)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <ul className={styles.details}>
                {ARMIN_DETAILS.map((item) => {
                  const scene = src(item.imageKey);
                  return (
                    <li key={item.key} className={styles.detail}>
                      <div className={styles.detailFrame}>
                        {scene ? (
                          <Image
                            src={scene}
                            alt=""
                            fill
                            sizes="(max-width: 900px) 50vw, 300px"
                            className={styles.detailImg}
                          />
                        ) : (
                          <span className={styles.frameEmpty} aria-hidden>
                            <HorizonRule />
                          </span>
                        )}
                      </div>
                      {slot(item.imageKey)}

                      <p className={styles.detailKanji} lang="ja">
                        {item.kanji}
                      </p>
                      <p className={styles.detailReading} aria-hidden>
                        {item.reading}
                      </p>
                      <h3 className={styles.detailName}>
                        {pick(item.name, locale)}
                      </h3>
                      <p className={styles.detailNote}>
                        {pick(item.note, locale)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* ══ 5 · SAYFANIN KALBİ — aynı olay, beş okuma ═════════════════ */}
            <section className={styles.deskSection} aria-labelledby="arm-desk">
              <header className={styles.sectionHead}>
                <h2 id="arm-desk" className={styles.sectionTitle}>
                  {pick(ARMIN_SECTIONS.desk.title, locale)}
                </h2>
                <p className={styles.sectionLede}>
                  {pick(ARMIN_SECTIONS.desk.lede, locale)}
                </p>
                <span className={styles.sectionRule} aria-hidden>
                  <HorizonRule />
                </span>
              </header>

              <p className={styles.deskWhere}>
                {pick(ARMIN_EVENT.where, locale)}
              </p>

              <div className={styles.deskScene}>
                {deskScene ? (
                  <Image
                    src={deskScene}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 1000px"
                    className={styles.deskSceneImg}
                  />
                ) : (
                  <span className={styles.frameEmpty} aria-hidden>
                    <HorizonRule />
                  </span>
                )}
              </div>
              {slot(ARMIN_IMAGE_KEYS.desk)}

              <ReadingDesk
                readings={readings}
                dataLabel={pick(ARMIN_EVENT.dataLabel, locale)}
                data={pick(ARMIN_EVENT.data, locale)}
                dataNote={pick(ARMIN_EVENT.dataNote, locale)}
                listLabel={pick(ARMIN_DESK_UI.listLabel, locale)}
                listHint={pick(ARMIN_DESK_UI.listHint, locale)}
                activeLabel={pick(ARMIN_DESK_UI.activeLabel, locale)}
                retellLabel={pick(ARMIN_DESK_UI.retellLabel, locale)}
                meansLabel={pick(ARMIN_DESK_UI.meansLabel, locale)}
                dropsLabel={pick(ARMIN_DESK_UI.dropsLabel, locale)}
                nextLabel={pick(ARMIN_DESK_UI.nextLabel, locale)}
                counterLabel={pick(ARMIN_DESK_UI.counterLabel, locale)}
                lockedLabel={pick(ARMIN_DESK_UI.lockedLabel, locale)}
                seenLabel={pick(ARMIN_DESK_UI.seenLabel, locale)}
                resetLabel={pick(ARMIN_DESK_UI.resetLabel, locale)}
                emptyTitle={pick(ARMIN_DESK_UI.emptyTitle, locale)}
                emptyText={pick(ARMIN_DESK_UI.emptyText, locale)}
                keyboardHint={pick(ARMIN_DESK_UI.keyboardHint, locale)}
                verdictTitle={pick(ARMIN_VERDICT.title, locale)}
                verdictText={pick(ARMIN_VERDICT.text, locale)}
                verdictStamp={pick(ARMIN_VERDICT.stamp, locale)}
              />
            </section>

            {/* ══ 6 · KADER ÇİZELGESİ — beş durak ══════════════════════════ */}
            <section className={styles.section} aria-labelledby="arm-fate">
              <header className={styles.sectionHead}>
                <h2 id="arm-fate" className={styles.sectionTitle}>
                  {pick(ARMIN_SECTIONS.fate.title, locale)}
                </h2>
                <p className={styles.sectionLede}>
                  {pick(ARMIN_SECTIONS.fate.lede, locale)}
                </p>
                <span className={styles.sectionRule} aria-hidden>
                  <HorizonRule />
                </span>
              </header>

              <ol className={styles.fate}>
                {ARMIN_TIMELINE.map((stop) => {
                  const scene = src(stop.imageKey);
                  return (
                    <li key={stop.key} className={styles.fateItem}>
                      <p className={styles.fateStamp}>
                        <span className={styles.fateYear}>{stop.year}</span>
                        <span className={styles.fateAge}>
                          {pick(stop.age, locale)}
                        </span>
                      </p>

                      <div className={styles.fateBody}>
                        <h3 className={styles.fateTitle}>
                          {pick(stop.title, locale)}
                        </h3>
                        <p className={styles.fateText}>
                          {pick(stop.text, locale)}
                        </p>
                        {stop.quote ? (
                          <figure className={styles.fateQuote}>
                            <blockquote className={styles.quoteJa} lang="ja">
                              {stop.quote.text}
                            </blockquote>
                            <p className={styles.quoteReading}>
                              {pick(stop.quote.reading, locale)}
                            </p>
                            <figcaption className={styles.quoteBy}>
                              <span className={styles.quoteWho}>
                                {pick(stop.quote.by, locale)}
                              </span>
                              <span className={styles.quoteNote}>
                                {pick(stop.quote.note, locale)}
                              </span>
                            </figcaption>
                          </figure>
                        ) : null}
                      </div>

                      <div className={styles.fateMedia}>
                        <div className={styles.fateFrame}>
                          {scene ? (
                            <Image
                              src={scene}
                              alt=""
                              fill
                              sizes="(max-width: 900px) 100vw, 420px"
                              className={styles.fateImg}
                            />
                          ) : (
                            <span className={styles.frameEmpty} aria-hidden>
                              <HorizonRule />
                            </span>
                          )}
                        </div>
                        {slot(stop.imageKey)}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* ══ 6b · AYNI OLAYLARIN DİĞER OKUYUCULARI ════════════════════
                Nexus bağları (dalga şartı): sayfası olan üçü bağlantılı,
                olmayan üçü adla çiziliyor. */}
            <section className={styles.section} aria-labelledby="arm-witness">
              <header className={styles.sectionHead}>
                <h2 id="arm-witness" className={styles.sectionTitle}>
                  {pick(ARMIN_SECTIONS.witness.title, locale)}
                </h2>
                <p className={styles.sectionLede}>
                  {pick(ARMIN_SECTIONS.witness.lede, locale)}
                </p>
                <span className={styles.sectionRule} aria-hidden>
                  <HorizonRule />
                </span>
              </header>

              <ul className={styles.witnesses}>
                {ARMIN_WITNESSES.map((person) => {
                  const face = faces.get(person.characterId) ?? null;
                  const linked = isExperienceCharacter(person.characterId);
                  const inner = (
                    <>
                      <span className={styles.witnessFace}>
                        {face ? (
                          <Image
                            src={face}
                            alt={`${person.name} ${faceSuffix}`}
                            fill
                            sizes="72px"
                          />
                        ) : (
                          <span className={styles.witnessMark} aria-hidden>
                            {person.nameNative.slice(0, 1)}
                          </span>
                        )}
                      </span>
                      <span className={styles.witnessBody}>
                        <span className={styles.witnessName}>
                          {person.name}
                        </span>
                        <span className={styles.witnessNative} lang="ja">
                          {person.nameNative}
                        </span>
                        <span className={styles.witnessRole}>
                          {pick(person.role, locale)}
                        </span>
                        <span className={styles.witnessReading}>
                          {pick(person.reading, locale)}
                        </span>
                        <span className={styles.witnessGo}>
                          {pick(
                            linked
                              ? ARMIN_WITNESS_UI.linked
                              : ARMIN_WITNESS_UI.unlinked,
                            locale,
                          )}
                        </span>
                      </span>
                    </>
                  );

                  return (
                    <li key={person.characterId} className={styles.witness}>
                      {linked ? (
                        <Link
                          className={styles.witnessLink}
                          href={animeHref.character(person.characterId)}
                        >
                          {inner}
                        </Link>
                      ) : (
                        <span className={styles.witnessPlain}>{inner}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* ══ 7 · KAPANIŞ ══════════════════════════════════════════════ */}
            <section className={styles.closing} aria-labelledby="arm-closing">
              <div className={styles.closingArt}>
                {closingScene ? (
                  <Image
                    src={closingScene}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 1000px"
                    className={styles.closingImg}
                  />
                ) : (
                  <span className={styles.frameEmpty} aria-hidden>
                    <HorizonRule />
                  </span>
                )}
              </div>
              {slot(ARMIN_IMAGE_KEYS.closing)}

              <header className={styles.sectionHead}>
                <h2 id="arm-closing" className={styles.sectionTitle}>
                  {pick(ARMIN_SECTIONS.closing.title, locale)}
                </h2>
                <p className={styles.sectionLede}>
                  {pick(ARMIN_SECTIONS.closing.lede, locale)}
                </p>
              </header>

              <ul className={styles.quotes}>
                {ARMIN_CLOSING.quotes.map((quote) => (
                  <li key={quote.text} className={styles.quoteItem}>
                    <figure className={styles.closingQuote}>
                      <blockquote className={styles.quoteJa} lang="ja">
                        {quote.text}
                      </blockquote>
                      <p className={styles.quoteReading}>
                        {pick(quote.reading, locale)}
                      </p>
                      <figcaption className={styles.quoteBy}>
                        <span className={styles.quoteWho}>
                          {pick(quote.by, locale)}
                        </span>
                        <span className={styles.quoteNote}>
                          {pick(quote.note, locale)}
                        </span>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>

              <p className={styles.motto} lang="ja">
                {ARMIN_CLOSING.motto}
              </p>
              <p className={styles.mottoNote}>
                {pick(ARMIN_CLOSING.mottoNote, locale)}
              </p>

              <p className={styles.credit}>
                {pick(ARMIN_CLOSING.credit, locale)}{" "}
                <a
                  className={styles.creditLink}
                  href={siteUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {pick(ARMIN_CLOSING.creditLink, locale)}
                </a>
              </p>
              <p className={styles.creditNote}>
                {pick(ARMIN_CLOSING.creditNote, locale)}
              </p>
            </section>
          </div>
        </div>

        {/* Düzenleyicisiz boşluk özeti — sayfanın EN ALTINDA */}
        {isAdmin ? (
          <CuratorGaps
            title={pick(ARMIN_GAPS.title, locale)}
            emptyLabel={pick(ARMIN_GAPS.empty, locale)}
            filledLabel={pick(ARMIN_GAPS.filled, locale)}
            allFilledLabel={pick(ARMIN_GAPS.allFilled, locale)}
            rows={gapRows}
          />
        ) : null}
      </SteamShell>
    </CuratorFrame>
  );
}
