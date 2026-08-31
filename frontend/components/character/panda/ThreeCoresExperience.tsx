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
  PND_ALT,
  PND_BONDS,
  PND_CLOSING,
  PND_CORES,
  PND_CORE_UI,
  PND_CORPSE_UI,
  PND_CRUMB,
  PND_FACT_COLUMNS,
  PND_FRAME_EMPTY,
  PND_GAPS,
  PND_HERO,
  PND_ID,
  PND_IDENTITY,
  PND_IMAGE_KEYS,
  PND_KIT,
  PND_PORTRAIT,
  PND_PORTRAIT_SLOT,
  PND_POWERS,
  PND_SECTIONS,
  PND_SITE_URL,
  PND_SLOT_LABELS,
  PND_SLOT_SIZES,
  PND_SLOT_SPECS,
  PND_TIMELINE,
  PND_UNLISTED,
  PND_WORLD_LINKS,
} from "@/lib/characters/panda-experience";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  CuratorGaps,
  type CuratorGapRow,
} from "@/components/character/CuratorGaps";
import { CoreShell } from "./CoreShell";
import type { DeckCore } from "./CoreDeck";
import {
  BambooGrove,
  CoreSilhouette,
  CorpseAnatomy,
  SnappedStalk,
  ThreeRings,
} from "./PandaGlyphs";
import styles from "./ThreeCoresExperience.module.css";

/**
 * Panda — "Üç çekirdek" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/137974 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek cümle: ÜÇ ÇEKİRDEK VAR VE HER
 * KULLANIM BİRİNİ TÜKETİYOR.
 *
 * ── NEDEN BÖYLE GÖRÜNÜYOR ────────────────────────────────────────────────
 * Sayfanın TAMAMI üç dikey sütun üzerine kurulu — hero, künye, laboratuvar,
 * çekirdek güvertesi, kader çizelgesi, bağlar. Sütunların oranı kök
 * öğedeki `data-core` niteliğinden okunuyor: bir çekirdek yakıldığında o
 * sütun genişliyor, diğer ikisi daralıyor. Akordiyon değil — hiçbir sütun
 * kapanmıyor, yalnızca oran değişiyor, ve değişim elastik (hafif geri
 * sekmeli `cubic-bezier`).
 *
 * Üç sütun VARSAYILAN durumda da yerinde: mod düğmesi ızgarayı açıp
 * kapatmıyor, tonunu çeviriyor.
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero (bambu filigranı + üç halka + madalyon portre + geniş kadraj)
 *   2 mod düğmesi — "Lanetli ceset", `CoreShell` içinde (durum orada)
 *   3 künye şeridi — üç sütun: gövde · kayıt · KAYITTA OLMAYAN
 *   4 lanet laboratuvarı — üç büyük + dört küçük, JJK terminolojisiyle
 *   5 üç çekirdek — sayfanın kalbi (`CoreDeck`), seçim TÜKETİYOR
 *   6 kader çizelgesi — beş durak, üç sütuna dağılmış
 *   7 kapanış — iki kayıt + 三つの核 + kaynak künyesi
 *
 * ── İSTEMCİ ADALARI (2) ──────────────────────────────────────────────────
 *   CoreShell — kök öğe, "Lanetli ceset" düğmesi, çekirdek durumu
 *   CoreDeck  — üç çekirdek güvertesi (durumsuz, çizim)
 * `PandaGlyphs` SUNUCU bileşeni: bütün SVG'ler burada çizilip prop olarak
 * adalara geçiyor, yani hiçbiri istemci paketine inmiyor.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×335 — küçük, o yüzden yalnızca madalyon
 * kadrajında). On dört kadraj BOŞ ve küratör yuvası olarak duruyor; her
 * kadrajın HEMEN ALTINDA kendi yuvası var (sayfa sonunda toplu yuva yok).
 * Kadrajlar sunucuda çizilip `CoreDeck`e prop olarak geçiyor — böylece
 * TÜKENMİŞ ya da KİLİTLİ bir sütunun yuvası da çalışmaya devam ediyor.
 */
export function ThreeCoresExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const src = (key: string): string | null => ability.get(key) ?? null;

  /* Portre kaynağı: küratör bir PORTRAIT yüklediyse o, yoksa DEPODAKİ resmî
     kare. İkisi de bizim kaynağımız; AniList'e hotlink YOK. */
  const portraitUploaded = isUploadedPortrait(detail);
  const portraitSrc =
    (portraitUploaded ? primaryPortrait(detail) : null) ?? PND_PORTRAIT.src;

  const name = detail.character.name || PND_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? PND_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? PND_SITE_URL;

  const faces = companionPortraits(companions);

  const gapRows: CuratorGapRow[] = Object.values(PND_IMAGE_KEYS).map((key) => ({
    key,
    label: pick(PND_SLOT_LABELS[key], locale),
    spec: pick(PND_SLOT_SPECS[key], locale),
    filled: ability.has(key),
  }));

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası (kullanıcı şartı: sayfa sonunda
   * toplu yuva bloğu yasak).
   *
   * ⚠️ Kadraj boşken ziyaretçi YAZISIZ bir boşluk görüyor; üretim
   * metadatası (ölçü, tip, yuva adı) yalnızca `isAdmin` iken çiziliyor.
   * Levi'de düzeltilen hatanın aynısı: koşulsuz bırakılırsa sıradan
   * ziyaretçi on dört kez "1600×900 · webp" okuyor.
   *
   * Kadraj boşken içinde elle çizilmiş bambu motifi duruyor — bölüm
   * görselsiz ama AYAKTA kalıyor.
   */
  const frame = (key: string, shapeClass: string) => {
    const scene = src(key);
    return (
      <>
        <figure
          className={`${styles.frame} ${shapeClass}`}
          data-filled={scene ? "true" : "false"}
        >
          {scene ? (
            <Image
              className={styles.frameImg}
              src={scene}
              alt={`${pick(PND_ALT.scenePrefix, locale)} ${pick(
                PND_SLOT_LABELS[key],
                locale,
              )}`}
              fill
              sizes="(max-width: 60rem) 90vw, 28rem"
            />
          ) : (
            <span className={styles.frameMotif} aria-hidden>
              <BambooGrove
                className={styles.frameMotifArt}
                stalkClassName={styles.motifStalk}
                nodeClassName={styles.motifNode}
                leafClassName={styles.motifLeaf}
              />
            </span>
          )}
          {!scene && isAdmin ? (
            <figcaption className={styles.frameCaption} data-curator-slot>
              <span className={styles.frameCaptionWord}>
                {pick(PND_FRAME_EMPTY, locale)}
              </span>
              <span className={styles.frameCaptionSpec}>
                {pick(PND_SLOT_SPECS[key], locale)}
              </span>
            </figcaption>
          ) : null}
        </figure>
        {isAdmin ? (
          <CuratorSlot
            characterId={PND_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(PND_SLOT_LABELS[key], locale)}
            size={PND_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Filigran: elle çizilmiş bambu korusu + üç halka + 呪骸. Hero'nun kendisi
     de üç sütun: madalyon portre · ad · geniş kadraj. */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        <span className={styles.crumbSep} aria-hidden>
          ·
        </span>
        <span className={styles.crumbHere}>{pick(PND_CRUMB.series, locale)}</span>
      </nav>

      <section className={styles.hero} aria-labelledby="pnd-name">
        <span className={styles.mark} aria-hidden>
          <BambooGrove
            className={styles.markGrove}
            stalkClassName={styles.markStalk}
            nodeClassName={styles.markNode}
            leafClassName={styles.markLeaf}
          />
          <ThreeRings
            className={styles.markRings}
            ringClassName={styles.markRing}
            linkClassName={styles.markLink}
          />
          <span className={styles.markKanji} lang="ja">
            {PND_IDENTITY.species}
          </span>
        </span>

        <div
          className={styles.heroGrid}
          role="group"
          aria-label={pick(PND_HERO.columnsLabel, locale)}
        >
          <div className={styles.heroCell} data-column="1">
            {/* Madalyon portre — 230×335, yani KÜÇÜK: tam kanama bir hero
                olarak kullanılmıyor. */}
            <figure className={styles.portrait}>
              <Image
                className={styles.portraitImg}
                src={portraitSrc}
                alt={pick(
                  portraitUploaded ? PND_ALT.portraitUploaded : PND_ALT.portrait,
                  locale,
                )}
                width={PND_PORTRAIT.w}
                height={PND_PORTRAIT.h}
                priority
              />
            </figure>
            {isAdmin ? (
              <CuratorSlot
                characterId={PND_ID}
                slot="PORTRAIT"
                label={pick(PND_PORTRAIT_SLOT, locale)}
                size={{ w: 1200, h: 1600 }}
              />
            ) : null}
            <p className={styles.heroSpecies} lang="ja">
              {PND_IDENTITY.species}
            </p>
            <p className={styles.heroSpeciesReading}>
              {pick(PND_IDENTITY.speciesReading, locale)}
            </p>
          </div>

          <div className={styles.heroCell} data-column="2">
            <p className={styles.heroSchool}>{pick(PND_IDENTITY.school, locale)}</p>
            <h1 id="pnd-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} lang="ja">
              {nativeName}
            </p>
            <p className={styles.heroGrade}>{pick(PND_IDENTITY.grade, locale)}</p>
            <p className={styles.heroEpigraph}>
              {pick(PND_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(PND_HERO.lede, locale)}</p>
          </div>

          <div className={styles.heroCell} data-column="3">
            {/* Not yalnızca kadraj GERÇEKTEN boşken yazılıyor. */}
            {src(PND_IMAGE_KEYS.hero) ? null : (
              <p className={styles.heroFrameNote}>
                {pick(PND_HERO.frameNote, locale)}
              </p>
            )}
            {frame(PND_IMAGE_KEYS.hero, styles.frameTall)}
          </div>
        </div>
      </section>
    </>
  );

  /* ══ 3 · KÜNYE ŞERİDİ ═══════════════════════════════════════════════════
     Üç sütun: gövde · kayıt · kayıtta olmayan. Üçüncü sütun Panda'nın yaş
     ve kan grubu boşluğunu "bilinmiyor" diye değil, TÜRÜN TANIMI olarak
     yazıyor — uydurma sayı yok. */
  const identityBand = (
    <section className={styles.band} aria-labelledby="pnd-identity">
      <div className={styles.bandHead}>
        <h2 id="pnd-identity" className={styles.bandTitle}>
          {pick(PND_SECTIONS.identity.title, locale)}
        </h2>
        <p className={styles.bandLede}>
          {pick(PND_SECTIONS.identity.lede, locale)}
        </p>
      </div>

      <div className={styles.triGrid}>
        {PND_FACT_COLUMNS.map((column) => (
          <div
            key={column.key}
            className={styles.factCol}
            data-column={column.column}
            data-kind={column.key}
          >
            <h3 className={styles.factColTitle}>{pick(column.title, locale)}</h3>
            <p className={styles.factColLede}>{pick(column.lede, locale)}</p>
            <dl className={styles.factList}>
              {column.rows.map((row) => (
                <div
                  key={row.key}
                  className={styles.factRow}
                  data-state={row.state}
                >
                  <dt className={styles.factLabel}>
                    {row.kanji ? (
                      <span className={styles.factKanji} lang="ja" aria-hidden>
                        {row.kanji}
                      </span>
                    ) : null}
                    {pick(row.label, locale)}
                  </dt>
                  <dd className={styles.factValue}>
                    {pick(row.value, locale)}
                    {row.note ? (
                      <span className={styles.factNote}>
                        {pick(row.note, locale)}
                      </span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );

  /* ══ 4a · LANET LABORATUVARI — ÜÇ BÜYÜK ═════════════════════════════════ */
  const labBand = (
    <section className={styles.band} aria-labelledby="pnd-lab">
      <div className={styles.bandHead}>
        <h2 id="pnd-lab" className={styles.bandTitle}>
          {pick(PND_SECTIONS.lab.title, locale)}
        </h2>
        <p className={styles.bandLede}>{pick(PND_SECTIONS.lab.lede, locale)}</p>
      </div>

      <div className={styles.triGrid}>
        {PND_POWERS.map((power, index) => (
          <article
            key={power.key}
            className={styles.bigCard}
            data-column={power.column}
          >
            <p className={styles.cardIndex} aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className={styles.cardName} lang="ja">
              {power.name}
            </h3>
            <p className={styles.cardReading}>{power.reading}</p>
            <p className={styles.cardTurkish}>{pick(power.turkish, locale)}</p>
            <p className={styles.cardTagline}>{pick(power.tagline, locale)}</p>
            <p className={styles.cardText}>{pick(power.text, locale)}</p>
            <ul className={styles.cardTraits}>
              {power.traits.map((trait) => (
                <li key={trait.tr} className={styles.trait}>
                  {pick(trait, locale)}
                </li>
              ))}
            </ul>
            {frame(power.imageKey, styles.frameWide)}
          </article>
        ))}
      </div>
    </section>
  );

  /* ══ 4b · DÖRT KÜÇÜK — hepsi "kayıtta yok" ══════════════════════════════
     Üçü üç sütuna oturuyor, dördüncüsü şeridin altına tam genişlikte
     uzanıyor: dört satır üç sütuna bölünmüyor ve bölünmemesi kasıtlı. */
  const kitBand = (
    <section className={styles.band} aria-labelledby="pnd-kit">
      <div className={styles.bandHead}>
        <h2 id="pnd-kit" className={styles.bandTitle}>
          {pick(PND_SECTIONS.kit.title, locale)}
        </h2>
        <p className={styles.bandLede}>{pick(PND_SECTIONS.kit.lede, locale)}</p>
      </div>

      <div className={styles.triGrid}>
        {PND_KIT.map((kit, index) => (
          <article
            key={kit.key}
            className={styles.smallCard}
            data-column={index < 3 ? index + 1 : 1}
            data-wide={index === 3 ? "true" : "false"}
          >
            <h3 className={styles.kitName} lang="ja">
              {kit.name}
            </h3>
            <p className={styles.cardReading}>{kit.reading}</p>
            <p className={styles.kitTurkish}>{pick(kit.turkish, locale)}</p>
            <p className={styles.kitVerdict}>{pick(kit.verdict, locale)}</p>
            <p className={styles.cardText}>{pick(kit.text, locale)}</p>
          </article>
        ))}
      </div>
    </section>
  );

  /* ══ 6 · KADER ÇİZELGESİ ════════════════════════════════════════════════
     Beş durak üç sütuna dağılmış (1 · 2 · 3 · 1 · 3): ikinci satırın orta
     sütunu boş kalıyor ve o boşluk çizelgenin nefesi.

     Her durağın altındaki blok bir REPLİK DEĞİL, künyede geçen bir TERİM;
     kaynağı da yazılı (veri dosyasının başındaki replik disiplini). */
  const fateBand = (
    <section className={styles.band} aria-labelledby="pnd-fate">
      <div className={styles.bandHead}>
        <h2 id="pnd-fate" className={styles.bandTitle}>
          {pick(PND_SECTIONS.fate.title, locale)}
        </h2>
        <p className={styles.bandLede}>{pick(PND_SECTIONS.fate.lede, locale)}</p>
      </div>

      <ol className={styles.triGrid}>
        {PND_TIMELINE.map((stop, index) => (
          <li key={stop.key} className={styles.stop} data-column={stop.column}>
            <p className={styles.stopIndex} aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className={styles.stopStamp}>{pick(stop.stamp, locale)}</p>
            <h3 className={styles.stopTitle}>{pick(stop.title, locale)}</h3>
            <p className={styles.stopText}>{pick(stop.text, locale)}</p>

            <figure className={styles.record}>
              <blockquote className={styles.recordText} lang="ja">
                {stop.record.text}
              </blockquote>
              <p className={styles.recordReading}>
                {pick(stop.record.reading, locale)}
              </p>
              <figcaption className={styles.recordBy}>
                {pick(stop.record.source, locale)}
              </figcaption>
            </figure>

            {frame(stop.imageKey, styles.frameSmall)}
          </li>
        ))}
      </ol>
    </section>
  );

  /* ══ 7a · BAĞLAR ════════════════════════════════════════════════════════
     Dört ad — `EXPERIENCE_COMPANIONS[137974]` ile BİREBİR aynı numaralar.
     Toge Inumaki ve Masamichi Yaga'nın arşivde numarası yok: düz ad, bağ
     kurulmuyor (aşağıdaki ayrı liste). */
  const bondsBand = (
    <section className={styles.band} aria-labelledby="pnd-bonds">
      <div className={styles.bandHead}>
        <h2 id="pnd-bonds" className={styles.bandTitle}>
          {pick(PND_SECTIONS.bonds.title, locale)}
        </h2>
        <p className={styles.bandLede}>{pick(PND_SECTIONS.bonds.lede, locale)}</p>
      </div>

      <ul className={styles.triGrid}>
        {PND_BONDS.map((bond) => {
          const linked = isExperienceCharacter(bond.characterId);
          const face = faces.get(bond.characterId) ?? null;
          return (
            <li
              key={bond.characterId}
              className={styles.bond}
              data-column={bond.column}
            >
              {face ? (
                <figure className={styles.bondFace}>
                  <Image
                    className={styles.bondFaceImg}
                    src={face}
                    alt={`${bond.name} — ${pick(PND_ALT.companion, locale)}`}
                    width={120}
                    height={160}
                  />
                </figure>
              ) : null}

              {linked ? (
                <Link
                  className={styles.bondName}
                  href={animeHref.character(bond.characterId)}
                >
                  {bond.name}
                </Link>
              ) : (
                <span className={styles.bondNamePlain}>{bond.name}</span>
              )}
              <span className={styles.bondNative} lang="ja">
                {bond.native}
              </span>
              <span className={styles.bondRole}>{pick(bond.role, locale)}</span>
              <p className={styles.bondLine}>{pick(bond.line, locale)}</p>
            </li>
          );
        })}
      </ul>

      <div className={styles.unlisted}>
        <h3 className={styles.unlistedTitle}>
          {pick(PND_UNLISTED.title, locale)}
        </h3>
        <p className={styles.unlistedNote}>{pick(PND_UNLISTED.note, locale)}</p>
        <ul className={styles.unlistedList}>
          {PND_UNLISTED.people.map((person) => (
            <li key={person.name} className={styles.unlistedItem}>
              <span className={styles.unlistedName}>{person.name}</span>
              <span className={styles.unlistedNative} lang="ja">
                {person.native}
              </span>
              <span className={styles.unlistedRole}>
                {pick(person.role, locale)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );

  /* ══ 7b · EVREN BAĞLANTILARI ════════════════════════════════════════════
     Çapalar `lib/anime/jjk/anchors.ts` defterinden; ölü çapa yasak. Adres
     elle yazılmıyor, `animeHref.jjk()` ile birleşiyor. */
  const worldBand = (
    <section className={styles.band} aria-labelledby="pnd-world">
      <div className={styles.bandHead}>
        <h2 id="pnd-world" className={styles.bandTitle}>
          {pick(PND_SECTIONS.world.title, locale)}
        </h2>
        <p className={styles.bandLede}>{pick(PND_SECTIONS.world.lede, locale)}</p>
      </div>

      <ul className={styles.worldList}>
        {PND_WORLD_LINKS.map((link) => (
          <li key={link.anchor} className={styles.worldItem}>
            <Link
              className={styles.worldLink}
              href={`${animeHref.jjk()}#${link.anchor}`}
            >
              {pick(link.label, locale)}
            </Link>
            <span className={styles.worldNote}>{pick(link.note, locale)}</span>
          </li>
        ))}
      </ul>
    </section>
  );

  /* ══ 7c · KAPANIŞ ═══════════════════════════════════════════════════════ */
  const closingBand = (
    <section className={styles.closing} aria-labelledby="pnd-closing">
      <div className={styles.bandHead}>
        <h2 id="pnd-closing" className={styles.bandTitle}>
          {pick(PND_SECTIONS.closing.title, locale)}
        </h2>
        <p className={styles.bandLede}>
          {pick(PND_SECTIONS.closing.lede, locale)}
        </p>
      </div>

      <ul className={styles.closingLines}>
        {PND_CLOSING.lines.map((line) => (
          <li key={line.text}>
            <figure className={styles.closingLine}>
              <blockquote className={styles.closingJa} lang="ja">
                {line.text}
              </blockquote>
              <p className={styles.closingReading}>
                {pick(line.reading, locale)}
              </p>
              <p className={styles.closingNote}>{pick(line.note, locale)}</p>
              {/* `figcaption` figure'un SON çocuğu olmak zorunda (HTML
                  şartı): not bloğu bilerek onun üstünde duruyor. */}
              <figcaption className={styles.closingBy}>
                {pick(line.by, locale)}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <p className={styles.discipline}>
        {pick(PND_CLOSING.quoteDiscipline, locale)}
      </p>

      <span className={styles.rule} aria-hidden>
        <SnappedStalk
          className={styles.ruleArt}
          stalkClassName={styles.ruleStalk}
          fiberClassName={styles.ruleFiber}
        />
      </span>

      <p className={styles.motto} lang="ja">
        {PND_CLOSING.motto}
      </p>
      <p className={styles.mottoReading}>
        {pick(PND_CLOSING.mottoReading, locale)}
      </p>
      <p className={styles.mottoNote}>{pick(PND_CLOSING.mottoNote, locale)}</p>

      {frame(PND_IMAGE_KEYS.closing, styles.frameBand)}

      <p className={styles.credit}>
        {pick(PND_CLOSING.credit, locale)}{" "}
        <a href={siteUrl} target="_blank" rel="noreferrer noopener">
          {pick(PND_CLOSING.creditLink, locale)}
        </a>
      </p>
      <p className={styles.creditNote}>{pick(PND_CLOSING.creditNote, locale)}</p>
    </section>
  );

  /* Çekirdek güvertesinin verisi — istemciye YALNIZCA düz dize iniyor.
     SVG'ler ve kadrajlar burada, SUNUCUDA çizilip prop olarak geçiyor. */
  const deckCores: DeckCore[] = PND_CORES.map((core) => ({
    key: core.key,
    column: core.column,
    name: pick(core.name, locale),
    native: core.native,
    recordLine: pick(core.recordLine, locale),
    kin: pick(core.kin, locale),
    tagline: pick(core.tagline, locale),
    text: pick(core.text, locale),
    reading: pick(core.reading, locale),
    loss: pick(core.loss, locale),
    stats: core.stats.map((stat) => ({
      key: stat.key,
      label: pick(stat.label, locale),
      value: stat.value,
      max: stat.max,
    })),
    silhouette: (
      <CoreSilhouette
        shape={core.silhouette}
        className={styles.silhouette}
        bodyClassName={styles.silhouetteBody}
        markClassName={styles.silhouetteMark}
      />
    ),
    frame: frame(core.imageKey, styles.frameTall),
  }));

  return (
    <CoreShell
      isAdmin={isAdmin}
      hero={hero}
      middle={
        <>
          {identityBand}
          {labBand}
          {kitBand}
        </>
      }
      tail={
        <>
          {fateBand}
          {bondsBand}
          {worldBand}
          {closingBand}
          {/* Düzenleyicisiz özet — yalnızca küratör modunda çiziliyor */}
          {isAdmin ? (
            <CuratorGaps
              title={pick(PND_GAPS.title, locale)}
              emptyLabel={pick(PND_GAPS.empty, locale)}
              filledLabel={pick(PND_GAPS.filled, locale)}
              allFilledLabel={pick(PND_GAPS.allFilled, locale)}
              rows={gapRows}
            />
          ) : null}
        </>
      }
      rings={
        <ThreeRings
          className={styles.modeRings}
          ringClassName={styles.modeRing}
          linkClassName={styles.modeLink}
        />
      }
      anatomy={
        <CorpseAnatomy
          className={styles.modeAnatomy}
          shellClassName={styles.anatomyShell}
          seamClassName={styles.anatomySeam}
          coreClassName={styles.anatomyCore}
        />
      }
      lockedGlyph={
        <SnappedStalk
          className={styles.lockedArt}
          stalkClassName={styles.lockedStalk}
          fiberClassName={styles.lockedFiber}
        />
      }
      modeFrame={frame(PND_IMAGE_KEYS.corpse, styles.frameWide)}
      mode={{
        title: pick(PND_CORPSE_UI.title, locale),
        native: PND_CORPSE_UI.native,
        enter: pick(PND_CORPSE_UI.enter, locale),
        exit: pick(PND_CORPSE_UI.exit, locale),
        hintWarm: pick(PND_CORPSE_UI.hintWarm, locale),
        hintCorpse: pick(PND_CORPSE_UI.hintCorpse, locale),
        subtext: pick(PND_CORPSE_UI.subtext, locale),
        anatomyLabel: pick(PND_CORPSE_UI.anatomyLabel, locale),
      }}
      deck={{
        title: pick(PND_SECTIONS.cores.title, locale),
        lede: pick(PND_SECTIONS.cores.lede, locale),
        cores: deckCores,
        announceIgnite: pick(PND_CORE_UI.announceIgnite, locale),
        announceReopen: pick(PND_CORE_UI.announceReopen, locale),
        announceLocked: pick(PND_CORE_UI.announceLocked, locale),
        ui: {
          deckLabel: pick(PND_CORE_UI.deckLabel, locale),
          ignite: pick(PND_CORE_UI.ignite, locale),
          reopen: pick(PND_CORE_UI.reopen, locale),
          intactBadge: pick(PND_CORE_UI.intactBadge, locale),
          spentBadge: pick(PND_CORE_UI.spentBadge, locale),
          liveBadge: pick(PND_CORE_UI.liveBadge, locale),
          spentHelp: pick(PND_CORE_UI.spentHelp, locale),
          remaining: pick(PND_CORE_UI.remaining, locale),
          statsTitle: pick(PND_CORE_UI.statsTitle, locale),
          statsNote: pick(PND_CORE_UI.statsNote, locale),
          unmeasured: pick(PND_CORE_UI.unmeasured, locale),
          silhouetteLabel: pick(PND_CORE_UI.silhouetteLabel, locale),
          idleHint: pick(PND_CORE_UI.idleHint, locale),
          lockedTitle: pick(PND_CORE_UI.lockedTitle, locale),
          lockedNative: PND_CORE_UI.lockedNative,
          lockedBody: pick(PND_CORE_UI.lockedBody, locale),
          lockedNote: pick(PND_CORE_UI.lockedNote, locale),
        },
      }}
    />
  );
}
