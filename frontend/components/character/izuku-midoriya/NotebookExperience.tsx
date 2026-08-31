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
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  CuratorGaps,
  type CuratorGapRow,
} from "@/components/character/CuratorGaps";
import {
  MID_ALT,
  MID_ANALYSIS,
  MID_BONDS,
  MID_BOND_UI,
  MID_CLOSING,
  MID_CRUMB,
  MID_GAPS,
  MID_HERO,
  MID_ID,
  MID_IDENTITY,
  MID_IMAGE_KEYS,
  MID_MARGIN,
  MID_MISSING_NOTE,
  MID_MOVES,
  MID_PORTRAIT,
  MID_PORTRAIT_SLOT_KEY,
  MID_POWERS,
  MID_SCENE_ALT,
  MID_SECTIONS,
  MID_SITE_URL,
  MID_SLOT_LABELS,
  MID_SLOT_SIZES,
  MID_SLOT_SPECS,
  MID_TIMELINE,
  MID_VESTIGES,
  MID_VESTIGE_UI,
} from "@/lib/characters/izuku-midoriya-experience";
import { AnalysisShell } from "./AnalysisShell";
import { ArrowMark, ClipMark, UnderlineMark } from "./MidoriyaGlyphs";
import { VestigeStack, type VestigeView } from "./VestigeStack";
import styles from "./NotebookExperience.module.css";

/**
 * Izuku Midoriya — "Analiz Defteri" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/89028 bu bileşene çıkıyor.
 * Sayfanın fikri tek cümle: BU ÇOCUĞUN GÜCÜ YUMRUĞU DEĞİL, NOT TUTMASI.
 *
 * ── SAYFA NEDEN BÖYLE GÖRÜNÜYOR ──────────────────────────────────────────
 * Zemin kareli defter kâğıdı (`repeating-linear-gradient`, CSS'te). Her
 * bölüm bu kâğıdın üstüne İĞNELENMİŞ bir kart. Kâğıdın kendi asimetrisi
 * de aynen duruyor: solda geniş içerik sütunu, sağda DAR bir kenar-not
 * sütunu ve ikisini ayıran dikey marj çizgisi.
 *
 * Kenar sütunu varsayılan durumda boş DEĞİL: bölüm numarası (01…06) ve
 * kanji sekmesi (記録 · 個性 · 継承 · 経歴 · 関係 · 結) orada, hero'da ise
 * portre orada duruyor. "Analiz" düğmesi o iskeletin ALTINA el yazısı bir
 * not, çizilen bir ok ve mono bir ölçü ekliyor — sütunun genişliği,
 * kartların yeri ve kâğıdın ızgarası hiç değişmiyor.
 *
 * ⚠️ Dalga 1 dersi (Onizuka): mod düğmesi KİLİTLİ IZGARAYI AÇIP KAPATMIYOR.
 * Kareli zemin ve iki kolon KAPALIYKEN DE tam olarak yerinde.
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero            — defter kapağı + portre (vesikalık) + geniş kadraj
 *   2 mod düğmesi     — "Analiz" (`AnalysisShell` içinde, durum orada)
 *   3 künye şeridi    — 01 記録, AniList kaydından birebir + defter kadrajı
 *   4 güç laboratuvarı— 02 個性, 3 büyük kayıt + 4 Ultimate Move
 *   5 interaktif      — 03 継承, `VestigeStack` (SAYFANIN KALBİ)
 *   6 kader çizelgesi — 04 経歴, beş durak, yaş etiketli
 *   7 kapanış         — 05 関係 bağlar + 06 結 iki replik, motto, künye
 *
 * ── İSTEMCİ ADALARI (2) ──────────────────────────────────────────────────
 *   AnalysisShell — kök öğe, `data-analysis` durumu, "Analiz" düğmesi
 *   VestigeStack  — sekiz sahibin kümülatif katmanları
 * `MidoriyaGlyphs` yalnız SVG çiziyor, kendi başına bir ada değil.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×345), yani KÜÇÜK: kenar sütununda
 * deftere ataşla iliştirilmiş bir vesikalık boyunda duruyor. Geniş hero
 * karesi `mid:hero` yuvasında bekliyor. On altı `mid:` kadrajının her
 * birinin HEMEN ALTINDA kendi küratör yuvası var; ziyaretçi boş kadrajda
 * üretim metadatası GÖRMÜYOR (Dalga 1'de Levi'de sızmıştı) — o bilgi
 * `isAdmin` ile kesiliyor.
 */
export function NotebookExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const src = (key: string): string | null => ability.get(key) ?? null;
  const faces = companionPortraits(companions);

  /* Portre kaynağı: küratör bir PORTRAIT yüklediyse o, yoksa DEPODAKİ resmî
     kare. İkisi de bizim kaynağımız → `unoptimized` yalnızca AniList'in
     uzak dosyası kullanılsaydı gerekirdi; burada hiç doğmuyor. */
  const portraitUploaded = isUploadedPortrait(detail);
  const portraitSrc =
    (portraitUploaded ? primaryPortrait(detail) : null) ?? MID_PORTRAIT.src;
  const portraitAlt = pick(
    portraitUploaded ? MID_ALT.portraitUploaded : MID_ALT.portraitLocal,
    locale,
  );

  const name = detail.character.name || MID_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? MID_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? MID_SITE_URL;

  const gapRows: CuratorGapRow[] = Object.values(MID_IMAGE_KEYS).map((key) => ({
    key,
    label: pick(MID_SLOT_LABELS[key], locale),
    spec: pick(MID_SLOT_SPECS[key], locale),
    filled: ability.has(key),
  }));

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası (kullanıcı şartı: sayfa sonunda
   * toplu yuva bloğu yasak).
   *
   * Boş kadraj GÖRSELSİZ AMA AYAKTA: içinde elle çizilmiş bir ataş duruyor
   * ve kutunun kendisi kareli kâğıdın üstünde bir boşluk olarak okunuyor.
   * Ziyaretçi orada tek kelime YAZI görmüyor — ölçü ve biçim notu yalnızca
   * yöneticiye çiziliyor.
   *
   * Dolu kadrajda görselin üstüne perde iniyor: kadraja bir gün metin
   * bindiğinde okunabilirlik görselin parlaklığına bağlı kalmasın diye.
   */
  const frame = (key: string, shapeClass: string) => {
    const scene = src(key);
    return (
      <>
        <div className={styles.frameSlot} data-filled={scene ? "true" : "false"}>
          <figure className={`${styles.frame} ${shapeClass}`}>
            {scene ? (
              <>
                <Image
                  className={styles.frameImage}
                  src={scene}
                  alt={pick(MID_SCENE_ALT[key], locale)}
                  fill
                  sizes="(max-width: 62rem) 92vw, 52rem"
                />
                <span className={styles.frameScrim} aria-hidden />
              </>
            ) : (
              <>
                <span className={styles.frameEmpty} aria-hidden>
                  <ClipMark
                    className={styles.frameClip}
                    strokeClassName={styles.clipStroke}
                  />
                </span>
                {isAdmin ? (
                  <figcaption
                    className={styles.frameCaption}
                    data-curator-slot
                  >
                    <span className={styles.frameCaptionWord}>
                      {pick(MID_SLOT_LABELS[key], locale)}
                    </span>
                    <span className={styles.frameCaptionSpec}>
                      {pick(MID_SLOT_SPECS[key], locale)}
                    </span>
                  </figcaption>
                ) : null}
              </>
            )}
          </figure>
        </div>
        {isAdmin ? (
          <CuratorSlot
            characterId={MID_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(MID_SLOT_LABELS[key], locale)}
            size={MID_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /**
   * Kenar sütununun DEĞİŞMEYEN iskeleti: bölüm numarası + kanji sekmesi.
   * Analiz kapalıyken sütunda görünen tek şey bu — yani sütun boş bir
   * şerit değil, kâğıdın kendi marjı.
   */
  const marginHead = (section: { index: string; tab: string }) => (
    <>
      <p className={styles.marginIndex}>{section.index}</p>
      <p className={styles.marginTab} lang="ja" aria-hidden>
        {section.tab}
      </p>
    </>
  );

  /**
   * Analiz açıkken kenar sütununa DÜŞEN katman: çizilen ok + el yazısı not
   * + mono ölçü. Kapalıyken CSS `display: none` veriyor, yani ekran
   * okuyucu da görmüyor (gizli metin okutmak, "kapalı" demek değildir).
   */
  const marginNote = (key: keyof typeof MID_MARGIN) => (
    <div className={styles.marginNote}>
      <ArrowMark
        className={styles.marginArrow}
        strokeClassName={styles.pencilStroke}
      />
      <p className={styles.marginHand}>{pick(MID_MARGIN[key].hand, locale)}</p>
      <p className={styles.marginMeasure}>
        {pick(MID_MARGIN[key].measure, locale)}
      </p>
    </div>
  );

  /** Bölüm başlığı — numara ve kanji kenar sütununda, başlık gövdede. */
  const sectionHead = (
    id: string,
    section: { title: { tr: string; en: string }; lede: { tr: string; en: string } },
  ) => (
    <div className={styles.sectionHead}>
      <h2 id={id} className={styles.sectionTitle}>
        {pick(section.title, locale)}
        <UnderlineMark
          className={styles.sectionUnderline}
          strokeClassName={styles.pencilStroke}
        />
      </h2>
      <p className={styles.sectionLede}>{pick(section.lede, locale)}</p>
    </div>
  );

  /* Sahnenin arka kadrajı — boşsa arkada yalnızca siluetler kalıyor
     (bölüm görselsiz ama AYAKTA). */
  const vestigeScene = src(MID_IMAGE_KEYS.vestiges);

  const vestigeViews: VestigeView[] = MID_VESTIGES.map((item) => ({
    key: item.key,
    ordinal: item.ordinal,
    order: item.order,
    name: item.name,
    quirkName: item.quirk?.name ?? null,
    quirkKanji: item.quirk?.kanji ?? null,
    /* İki ayrı sebep, iki ayrı cümle: üçüncü sahibin quirk'i KAYITTA ADSIZ;
       birinci ve sekizinci sahipte devralınacak ikinci bir quirk HİÇ YOK. */
    quirkFallback: pick(
      item.key === "third"
        ? MID_VESTIGE_UI.unnamedQuirk
        : MID_VESTIGE_UI.noQuirk,
      locale,
    ),
    role: pick(item.role, locale),
    note: pick(item.note, locale),
    silhouette: item.silhouette,
  }));

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Defter kapağı: seride geçen başlık (未来へのヒーロー分析) ve cilt
     numarası. Filigranın kanji yarısı ve kareli ızgara `AnalysisShell` ile
     `.page` zemininde — ikisi de dekoratif. */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link className={styles.crumbLink} href={animeHref.characters()}>
          {t("backToGallery")}
        </Link>
        <span className={styles.crumbSep} aria-hidden>
          /
        </span>
        <span className={styles.crumbHere}>{pick(MID_CRUMB.series, locale)}</span>
      </nav>

      <section className={styles.sheet} aria-labelledby="mid-name">
        <div className={styles.main}>
          <div className={styles.cover}>
            <p className={styles.coverTitle} lang="ja">
              {MID_IDENTITY.notebookTitle}
            </p>
            <p className={styles.coverVolume}>{MID_IDENTITY.notebookVolume}</p>
          </div>

          <h1 id="mid-name" className={styles.heroName}>
            {name}
          </h1>
          <p className={styles.heroNative} lang="ja">
            {nativeName}
          </p>
          {/* Karışık dize: gövde Türkçe/İngilizce, içinde Latin harfli
              özel adlar var — tamamını `lang="ja"` ilan etmek ekran
              okuyucuyu yanlış sese geçirirdi. */}
          <p className={styles.heroHouse}>{pick(MID_IDENTITY.house, locale)}</p>

          <span className={styles.rule} aria-hidden />

          <p className={styles.heroEpigraph}>
            {pick(MID_IDENTITY.epigraph, locale)}
          </p>
          <p className={styles.heroLede}>{pick(MID_HERO.lede, locale)}</p>

          {/* Not YALNIZCA yöneticiye ve yalnızca kadraj gerçekten boşken:
              küratör kareyi yüklediğinde "bu kadraj bekliyor" cümlesi
              yalan olurdu, ziyaretçi içinse üretim notundan başka bir şey
              değil. */}
          {isAdmin && !src(MID_IMAGE_KEYS.hero) ? (
            <p className={styles.adminNote} data-curator-slot>
              {pick(MID_HERO.heroFrameCaption, locale)}
            </p>
          ) : null}
          {frame(MID_IMAGE_KEYS.hero, styles.frameWide)}
        </div>

        <aside className={styles.margin}>
          <p className={styles.marginIndex}>00</p>
          <p className={styles.marginTab} lang="ja" aria-hidden>
            {MID_IDENTITY.watermark}
          </p>

          {/* Vesikalık: kaynak dosya 230×345, yani büyütülemez. Deftere
              ataşla iliştirilmiş bir fotoğraf boyunda duruyor. */}
          <figure className={styles.photo}>
            <ClipMark
              className={styles.photoClip}
              strokeClassName={styles.clipStroke}
            />
            <Image
              className={styles.photoImg}
              src={portraitSrc}
              alt={portraitAlt}
              width={MID_PORTRAIT.w}
              height={MID_PORTRAIT.h}
              priority
            />
          </figure>

          {isAdmin ? (
            <CuratorSlot
              characterId={MID_ID}
              slot="PORTRAIT"
              label={pick(MID_SLOT_LABELS[MID_PORTRAIT_SLOT_KEY], locale)}
              size={MID_SLOT_SIZES[MID_PORTRAIT_SLOT_KEY]}
            />
          ) : null}

          {marginNote("hero")}
        </aside>
      </section>
    </>
  );

  return (
    <AnalysisShell
      isAdmin={isAdmin}
      label={pick(MID_ANALYSIS.label, locale)}
      native={MID_ANALYSIS.native}
      openLabel={pick(MID_ANALYSIS.off, locale)}
      closeLabel={pick(MID_ANALYSIS.on, locale)}
      stateOn={pick(MID_ANALYSIS.stateOn, locale)}
      stateOff={pick(MID_ANALYSIS.stateOff, locale)}
      hintOn={pick(MID_ANALYSIS.hintOn, locale)}
      hintOff={pick(MID_ANALYSIS.hintOff, locale)}
      note={pick(MID_ANALYSIS.note, locale)}
      watermark={MID_IDENTITY.watermark}
      hero={hero}
    >
      {/* ══ 3 · KÜNYE ŞERİDİ — 01 記録 ═══════════════════════════════════ */}
      <section className={styles.sheet} aria-labelledby="mid-identity">
        <div className={styles.main}>
          {sectionHead("mid-identity", MID_SECTIONS.identity)}

          <dl className={styles.facts}>
            {MID_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt className={styles.factLabel}>{pick(fact.label, locale)}</dt>
                <dd className={styles.factValue}>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>

          <p className={styles.missingNote}>{pick(MID_MISSING_NOTE, locale)}</p>

          {frame(MID_IMAGE_KEYS.notebook, styles.frameSquare)}
          <p className={styles.frameNote}>
            {pick(MID_HERO.notebookCaption, locale)}
          </p>
        </div>

        <aside className={styles.margin}>
          {marginHead(MID_SECTIONS.identity)}
          {marginNote("identity")}
        </aside>
      </section>

      {/* ══ 4 · GÜÇ LABORATUVARI — 02 個性 ═══════════════════════════════
          Üç büyük kayıt + dört Ultimate Move. Terminoloji MHA'nın kendisi:
          Quirk (個性), Ultimate Move, Hero Adı. "Jutsu"/"teknik" YOK. */}
      <section className={styles.sheet} aria-labelledby="mid-quirk">
        <div className={styles.main}>
          {sectionHead("mid-quirk", MID_SECTIONS.quirk)}

          <div className={styles.powers}>
            {MID_POWERS.map((power) => (
              <article key={power.key} className={styles.power}>
                <h3 className={styles.powerName}>{power.name}</h3>
                <p className={styles.powerKana} lang="ja">
                  {power.kana}
                </p>
                <p className={styles.powerTurkish}>
                  {pick(power.turkish, locale)}
                </p>
                <p className={styles.powerTagline}>
                  {pick(power.tagline, locale)}
                </p>
                <p className={styles.powerText}>{pick(power.text, locale)}</p>

                <ul className={styles.powerTraits}>
                  {power.traits.map((trait) => (
                    <li key={trait.tr} className={styles.powerTrait}>
                      {pick(trait, locale)}
                    </li>
                  ))}
                </ul>

                {/* Analiz katmanı: kart YER DEĞİŞTİRMİYOR, altına iki
                    satır ekleniyor. */}
                <div className={styles.cardNote}>
                  <p className={styles.cardPencil}>
                    {pick(power.pencil, locale)}
                  </p>
                  <p className={styles.cardMeasure}>
                    {pick(power.measure, locale)}
                  </p>
                </div>

                {frame(power.imageKey, styles.frameCard)}
              </article>
            ))}
          </div>

          <ul className={styles.moves}>
            {MID_MOVES.map((move) => (
              <li key={move.key} className={styles.move}>
                <h3 className={styles.moveName}>{move.name}</h3>
                <p className={styles.moveKana} lang="ja">
                  {move.kana}
                </p>
                <p className={styles.moveNote}>{pick(move.note, locale)}</p>

                <div className={styles.cardNote}>
                  <p className={styles.cardMeasure}>
                    {pick(move.measure, locale)}
                  </p>
                </div>

                {frame(move.imageKey, styles.frameSmall)}
              </li>
            ))}
          </ul>
        </div>

        <aside className={styles.margin}>
          {marginHead(MID_SECTIONS.quirk)}
          {marginNote("quirk")}
        </aside>
      </section>

      {/* ══ 5 · VESTIGE'LER — 03 継承 · SAYFANIN KALBİ ═══════════════════ */}
      <section className={styles.sheet} aria-labelledby="mid-vestiges">
        <div className={styles.main}>
          {sectionHead("mid-vestiges", MID_SECTIONS.vestiges)}

          <VestigeStack
            vestiges={vestigeViews}
            portrait={
              <Image
                className={styles.stageFace}
                src={portraitSrc}
                alt={portraitAlt}
                width={MID_PORTRAIT.w}
                height={MID_PORTRAIT.h}
              />
            }
            scene={
              vestigeScene ? (
                <>
                  <Image
                    className={styles.frameImage}
                    src={vestigeScene}
                    alt={pick(MID_SCENE_ALT[MID_IMAGE_KEYS.vestiges], locale)}
                    fill
                    sizes="(max-width: 62rem) 92vw, 52rem"
                  />
                  <span className={styles.frameScrim} aria-hidden />
                </>
              ) : null
            }
            slot={
              isAdmin ? (
                <CuratorSlot
                  characterId={MID_ID}
                  slot="ABILITY"
                  abilityName={MID_IMAGE_KEYS.vestiges}
                  label={pick(
                    MID_SLOT_LABELS[MID_IMAGE_KEYS.vestiges],
                    locale,
                  )}
                  size={MID_SLOT_SIZES[MID_IMAGE_KEYS.vestiges]}
                />
              ) : null
            }
            stageLabel={pick(MID_VESTIGE_UI.stageLabel, locale)}
            listLabel={pick(MID_VESTIGE_UI.listLabel, locale)}
            layersLabel={pick(MID_VESTIGE_UI.layersLabel, locale)}
            namedLabel={pick(MID_VESTIGE_UI.namedLabel, locale)}
            inheritedTitle={pick(MID_VESTIGE_UI.inheritedTitle, locale)}
            emptyInherited={pick(MID_VESTIGE_UI.emptyInherited, locale)}
            selectAll={pick(MID_VESTIGE_UI.selectAll, locale)}
            clear={pick(MID_VESTIGE_UI.clear, locale)}
            statusSuffix={pick(MID_VESTIGE_UI.status, locale)}
            fullLine={pick(MID_VESTIGE_UI.fullLine, locale)}
            keyboardHint={pick(MID_VESTIGE_UI.keyboardHint, locale)}
            note={pick(MID_VESTIGE_UI.note, locale)}
          />
        </div>

        <aside className={styles.margin}>
          {marginHead(MID_SECTIONS.vestiges)}
          {marginNote("vestiges")}
        </aside>
      </section>

      {/* ══ 6 · KADER ÇİZELGESİ — 04 経歴 ════════════════════════════════ */}
      <section className={styles.sheet} aria-labelledby="mid-fate">
        <div className={styles.main}>
          {sectionHead("mid-fate", MID_SECTIONS.fate)}

          <ol className={styles.stops}>
            {MID_TIMELINE.map((stop) => (
              <li key={stop.key} className={styles.stop}>
                <p className={styles.stopAge}>{pick(stop.age, locale)}</p>
                <h3 className={styles.stopTitle}>{pick(stop.title, locale)}</h3>
                <p className={styles.stopText}>{pick(stop.text, locale)}</p>

                {stop.quote ? (
                  <figure className={styles.stopQuote}>
                    <blockquote className={styles.quoteJa} lang="ja">
                      {stop.quote.text}
                    </blockquote>
                    <p className={styles.quoteReading}>
                      {pick(stop.quote.reading, locale)}
                    </p>
                    <figcaption className={styles.quoteBy}>
                      {pick(stop.quote.by, locale)}
                    </figcaption>
                  </figure>
                ) : null}

                <div className={styles.cardNote}>
                  <p className={styles.cardPencil}>
                    {pick(stop.pencil, locale)}
                  </p>
                  <p className={styles.cardMeasure}>
                    {pick(stop.measure, locale)}
                  </p>
                </div>

                {frame(stop.imageKey, styles.frameScene)}
              </li>
            ))}
          </ol>
        </div>

        <aside className={styles.margin}>
          {marginHead(MID_SECTIONS.fate)}
          {marginNote("fate")}
        </aside>
      </section>

      {/* ══ 7a · BAĞLAR — 05 関係 ════════════════════════════════════════
          Beşinin de kimliği `EXPERIENCE_COMPANIONS[89028]` listesinde
          DOĞRULANDI; listede olmayan bir kimliğin portresi sonsuza kadar
          boş kalırdı (Dalga 1'de Armin↔Levi emsali). Shigaraki'nin kendi
          sayfası yok → `isExperienceCharacter` false, bağ verilmiyor. */}
      <section className={styles.sheet} aria-labelledby="mid-bonds">
        <div className={styles.main}>
          {sectionHead("mid-bonds", MID_SECTIONS.bonds)}

          <ul className={styles.bonds}>
            {MID_BONDS.map((bond) => {
              const linked = isExperienceCharacter(bond.characterId);
              const face = faces.get(bond.characterId) ?? null;
              return (
                <li key={bond.characterId} className={styles.bond}>
                  <span
                    className={styles.bondFace}
                    data-filled={face ? "true" : "false"}
                  >
                    {face ? (
                      <Image
                        className={styles.bondFaceImg}
                        src={face}
                        alt={`${bond.name} — ${pick(
                          MID_ALT.companionSuffix,
                          locale,
                        )}`}
                        width={96}
                        height={128}
                      />
                    ) : (
                      <span className={styles.bondMono} lang="ja" aria-hidden>
                        {bond.nativeName}
                      </span>
                    )}
                  </span>

                  <span className={styles.bondBody}>
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
                    <span className={styles.bondRole}>
                      {pick(bond.role, locale)}
                    </span>
                    <span className={styles.bondNote}>
                      {pick(bond.note, locale)}
                    </span>

                    {isAdmin ? (
                      <span className={styles.bondFlag} data-curator-slot>
                        {pick(
                          linked ? MID_BOND_UI.hasPage : MID_BOND_UI.noPage,
                          locale,
                        )}
                      </span>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className={styles.margin}>
          {marginHead(MID_SECTIONS.bonds)}
          {marginNote("bonds")}
        </aside>
      </section>

      {/* ══ 7b · KAPANIŞ — 06 結 ═════════════════════════════════════════ */}
      <section className={styles.sheet} aria-labelledby="mid-closing">
        <div className={styles.main}>
          {sectionHead("mid-closing", MID_SECTIONS.closing)}

          <ul className={styles.closingQuotes}>
            {MID_CLOSING.quotes.map((quote) => (
              <li key={quote.text}>
                <figure className={styles.closingQuote}>
                  <blockquote className={styles.quoteJa} lang="ja">
                    {quote.text}
                  </blockquote>
                  <p className={styles.quoteReading}>
                    {pick(quote.reading, locale)}
                  </p>
                  <p className={styles.quoteNote}>{pick(quote.note, locale)}</p>
                  {/* `figcaption` figure'un SON çocuğu olmak zorunda. */}
                  <figcaption className={styles.quoteBy}>
                    {pick(quote.by, locale)}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <span className={styles.rule} aria-hidden />

          <p className={styles.motto} lang="ja">
            {MID_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(MID_CLOSING.mottoNote, locale)}
          </p>

          {frame(MID_IMAGE_KEYS.closing, styles.frameBand)}

          <p className={styles.credit}>
            {pick(MID_CLOSING.credit, locale)}{" "}
            <a
              className={styles.creditLink}
              href={siteUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              {pick(MID_CLOSING.creditLink, locale)}
            </a>
          </p>
          <p className={styles.creditNote}>
            {pick(MID_CLOSING.creditNote, locale)}
          </p>
        </div>

        <aside className={styles.margin}>
          {marginHead(MID_SECTIONS.closing)}
          {marginNote("closing")}
        </aside>
      </section>

      {/* Düzenleyicisiz özet — yalnızca küratör modunda çiziliyor */}
      {isAdmin ? (
        <CuratorGaps
          title={pick(MID_GAPS.title, locale)}
          emptyLabel={pick(MID_GAPS.empty, locale)}
          filledLabel={pick(MID_GAPS.filled, locale)}
          allFilledLabel={pick(MID_GAPS.allFilled, locale)}
          rows={gapRows}
        />
      ) : null}
    </AnalysisShell>
  );
}
