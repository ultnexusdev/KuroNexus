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
  TSUNADE_ALT,
  TSUNADE_BETS,
  TSUNADE_BLOOD,
  TSUNADE_CLOSING,
  TSUNADE_CRUMB,
  TSUNADE_HERO,
  TSUNADE_ID,
  TSUNADE_IDENTITY,
  TSUNADE_IMAGE_KEYS,
  TSUNADE_JUTSU,
  TSUNADE_KIT,
  TSUNADE_REBIRTH_TEXT,
  TSUNADE_SEATS,
  TSUNADE_SECTIONS,
  TSUNADE_SITE_URL,
  TSUNADE_SLOT_LABELS,
  TSUNADE_TABLE_UI,
  TSUNADE_TIMELINE,
} from "@/lib/characters/tsunade-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { RebirthShell } from "./RebirthShell";
import { BettingTable } from "./BettingTable";
import { BloodDrop, ByakugoSeal, TableRail } from "./TsunadeGlyphs";
import styles from "./TsunadeExperience.module.css";

/**
 * Tsunade Senju — "Kumarbazın Bahsi" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/2767 bu bileşene dallanır
 * (rota dosyasındaki `EXPERIENCES` haritası). Sayfanın fikri tek cümle:
 * BAHİS. Sayfadaki her ölçü bir iskambil kartının genişliğinden türüyor
 * (`--tsu-card`), sayfanın kalbi yeşil çuha üzerinde beş bahis, ve sayfanın
 * tezi tek bir renkte duruyor — `--tsu-luck` yalnızca kazanan ele ve kana
 * ayrıldı, çünkü Tsunade için ikisi aynı şey.
 *
 * ⚠️ Sakura'nın sayfası dolan bir mühür GÖSTERGESİ kullanıyor. Burada mühür
 * bir birikim çubuğu değil: bir kasa ve bir bedel. Ortak hiçbir mekanik yok.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   RebirthShell — "Sōzō Saisei" modu (tek boolean, etkinin tamamı CSS'te)
 *   BettingTable — beş bağımsız kart + değişen hesap
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 2767 kaydının ABILITY yuvaları (`tsunade:*`).
 * Hiçbiri zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır.
 */
export function TsunadeExperience({
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
  const heroScene = src(TSUNADE_IMAGE_KEYS.hero);
  const closingArt = src(TSUNADE_IMAGE_KEYS.closing);

  const name = detail.character.name || TSUNADE_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? TSUNADE_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? TSUNADE_SITE_URL;

  const bets = TSUNADE_BETS.map((bet) => ({
    key: bet.key,
    suit: bet.suit,
    rank: bet.rank,
    odds: pick(bet.odds, locale),
    title: pick(bet.title, locale),
    call: pick(bet.call, locale),
    stake: pick(bet.stake, locale),
    result: bet.result,
    truth: pick(bet.truth, locale),
    image: src(bet.imageKey),
  }));

  return (
    <RebirthShell
      enterLabel={pick(TSUNADE_REBIRTH_TEXT.enter, locale)}
      exitLabel={pick(TSUNADE_REBIRTH_TEXT.exit, locale)}
      hint={pick(TSUNADE_REBIRTH_TEXT.hint, locale)}
      costLabel={pick(TSUNADE_REBIRTH_TEXT.cost, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(TSUNADE_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO — PORTRE, MÜHÜR, YAYILAN ÇİZGİLER ══════════════════
            Portre solda dar bir çerçevede; mührün çizgileri çerçeveden taşıp
            başlığın altına kadar uzanıyor. Filigran 綱手 sağ altta, adın
            hayaleti gibi. */}
        <section className={styles.hero} aria-labelledby="tsu-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <p className={styles.heroMark} aria-hidden>
            {nativeName}
          </p>

          <div className={styles.heroPortraitWrap}>
            <span className={styles.heroPortrait}>
              {portrait ? (
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? TSUNADE_HERO.portraitAlt
                      : TSUNADE_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="360px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              ) : null}
            </span>
            {/* Mühür portrenin üstünde, alnın geldiği yükseklikte durur ve
                çizgileri çerçevenin dışına taşar. Dekoratif (aria-hidden):
                anlamı yandaki açıklama satırı taşıyor. */}
            <ByakugoSeal
              className={styles.heroSeal}
              lineClassName={styles.sealLine}
            />
          </div>

          <div className={styles.heroBody}>
            <p className={styles.heroClan}>
              {pick(TSUNADE_IDENTITY.clan, locale)}
            </p>
            <h1 id="tsu-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {nativeName}
            </p>
            <ul className={styles.aliases}>
              {TSUNADE_IDENTITY.aliases.map((alias) => (
                <li key={alias.en} className={styles.alias}>
                  {pick(alias, locale)}
                </li>
              ))}
            </ul>
            <p className={styles.heroEpigraph}>
              {pick(TSUNADE_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(TSUNADE_HERO.lede, locale)}</p>
            <p className={styles.sealCaption}>
              {pick(TSUNADE_HERO.sealCaption, locale)}
            </p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={TSUNADE_ID}
                slot="ABILITY"
                abilityName={TSUNADE_IMAGE_KEYS.hero}
                label={pick(
                  TSUNADE_SLOT_LABELS[TSUNADE_IMAGE_KEYS.hero],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE — KASA FİŞİ ══════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="tsu-identity">
          <header className={styles.sectionHead}>
            <h2 id="tsu-identity" className={styles.sectionTitle}>
              {pick(TSUNADE_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(TSUNADE_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {TSUNADE_IDENTITY.facts.map((fact) => (
              <div key={fact.label.en} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · MASADAKİLER ════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="tsu-seats">
          <header className={styles.sectionHead}>
            <h2 id="tsu-seats" className={styles.sectionTitle}>
              {pick(TSUNADE_SECTIONS.seats.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(TSUNADE_SECTIONS.seats.lede, locale)}
            </p>
          </header>
          <ul className={styles.seats}>
            {TSUNADE_SEATS.map((seat) => {
              const face = faces.get(seat.characterId) ?? null;
              return (
                <li
                  key={seat.characterId}
                  className={styles.seat}
                  data-side={seat.side}
                >
                  <span className={styles.seatArt}>
                    {face ? (
                      <Image
                        src={face}
                        alt={`${seat.name} ${pick(TSUNADE_ALT.seatSuffix, locale)}`}
                        fill
                        sizes="200px"
                      />
                    ) : null}
                  </span>
                  <span className={styles.seatBody}>
                    <span className={styles.seatRole}>
                      {pick(seat.role, locale)}
                    </span>
                    <span className={styles.seatName}>{seat.name}</span>
                    <span className={styles.seatNote}>
                      {pick(seat.note, locale)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · ÖMÜRLE ÖDENEN ÜÇ TEKNİK ════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="tsu-jutsu">
          <header className={styles.sectionHead}>
            <h2 id="tsu-jutsu" className={styles.sectionTitle}>
              {pick(TSUNADE_SECTIONS.jutsu.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(TSUNADE_SECTIONS.jutsu.lede, locale)}
            </p>
          </header>
          <ul className={styles.forms}>
            {TSUNADE_JUTSU.map((jutsu) => {
              const key = TSUNADE_IMAGE_KEYS[jutsu.key];
              const art = src(key);
              return (
                <li key={jutsu.key} className={styles.form}>
                  <span className={styles.formArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="720px" /> : null}
                  </span>
                  <span className={styles.formKanji} aria-hidden>
                    {jutsu.kanji}
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
                        <span key={trait.en} className={styles.trait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={TSUNADE_ID}
                      slot="ABILITY"
                      abilityName={key}
                      label={pick(TSUNADE_SLOT_LABELS[key], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · MASADAKİ GERİ KALAN — dört küçük ═══════════════════════ */}
        <section className={styles.section} aria-labelledby="tsu-kit">
          <header className={styles.sectionHead}>
            <h2 id="tsu-kit" className={styles.sectionTitle}>
              {pick(TSUNADE_SECTIONS.kit.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(TSUNADE_SECTIONS.kit.lede, locale)}
            </p>
          </header>
          <ul className={styles.kit}>
            {TSUNADE_KIT.map((item) => {
              const art = src(item.imageKey);
              return (
                <li key={item.key} className={styles.kitItem}>
                  <span className={styles.kitArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="480px" /> : null}
                  </span>
                  <span className={styles.kitKanji} aria-hidden>
                    {item.kanji}
                  </span>
                  <span className={styles.kitName}>
                    {pick(item.name, locale)}
                  </span>
                  <span className={styles.kitNote}>
                    {pick(item.note, locale)}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={TSUNADE_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(TSUNADE_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 6 · BAHİS MASASI — SAYFANIN KALBİ ══════════════════════════
            Tek tam genişlikte bant: yeşil çuha, masa kenarı ve beş bahis.
            Sayfanın geri kalanı bu bandın iki yanında dar bir sütunda. */}
        <section className={styles.tableBand} aria-labelledby="tsu-table">
          <TableRail className={styles.tableRail} />
          <div className={styles.tableInner}>
            <header className={styles.sectionHead}>
              <h2 id="tsu-table" className={styles.sectionTitle}>
                {pick(TSUNADE_SECTIONS.table.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(TSUNADE_SECTIONS.table.lede, locale)}
              </p>
              <p className={styles.tableNote}>
                {pick(TSUNADE_SECTIONS.table.note, locale)}
              </p>
            </header>

            <BettingTable
              bets={bets}
              listLabel={pick(TSUNADE_TABLE_UI.listLabel, locale)}
              oddsLabel={pick(TSUNADE_TABLE_UI.oddsLabel, locale)}
              stakeLabel={pick(TSUNADE_TABLE_UI.stakeLabel, locale)}
              truthLabel={pick(TSUNADE_TABLE_UI.truthLabel, locale)}
              openLabel={pick(TSUNADE_TABLE_UI.open, locale)}
              closeLabel={pick(TSUNADE_TABLE_UI.close, locale)}
              wonStamp={pick(TSUNADE_TABLE_UI.wonStamp, locale)}
              lostStamp={pick(TSUNADE_TABLE_UI.lostStamp, locale)}
              ledgerLabel={pick(TSUNADE_TABLE_UI.ledgerLabel, locale)}
              wonWord={pick(TSUNADE_TABLE_UI.wonWord, locale)}
              lostWord={pick(TSUNADE_TABLE_UI.lostWord, locale)}
              closedWord={pick(TSUNADE_TABLE_UI.closedWord, locale)}
              dealAllLabel={pick(TSUNADE_TABLE_UI.dealAll, locale)}
              collectAllLabel={pick(TSUNADE_TABLE_UI.collectAll, locale)}
              ruleLine={pick(TSUNADE_TABLE_UI.rule, locale)}
              verdictLine={pick(TSUNADE_TABLE_UI.verdict, locale)}
              keyboardHint={pick(TSUNADE_TABLE_UI.keyboardHint, locale)}
            />

            {isAdmin ? (
              <div className={styles.slotRow}>
                {TSUNADE_BETS.map((bet) => (
                  <CuratorSlot
                    key={bet.imageKey}
                    characterId={TSUNADE_ID}
                    slot="ABILITY"
                    abilityName={bet.imageKey}
                    label={pick(TSUNADE_SLOT_LABELS[bet.imageKey], locale)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* ══ 7 · KAN KORKUSU ════════════════════════════════════════════
            Sayfanın en sessiz yeri: dar sütun, kart yok, çerçeve yok,
            hareket yok. Tek grafik bir damla ve sayfada bu rengin
            bulunduğu ikinci (ve son) yer orası. */}
        <section className={styles.blood} aria-labelledby="tsu-blood">
          <BloodDrop className={styles.bloodDrop} />
          <h2 id="tsu-blood" className={styles.bloodTitle}>
            {pick(TSUNADE_SECTIONS.blood.title, locale)}
          </h2>
          {TSUNADE_BLOOD.lines.map((line) => (
            <p key={line.en} className={styles.bloodLine}>
              {pick(line, locale)}
            </p>
          ))}
          <p className={styles.bloodNote}>
            {pick(TSUNADE_BLOOD.colourNote, locale)}
          </p>
        </section>

        {/* ══ 8 · ÖMÜR ÇİZELGESİ ═════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="tsu-fate">
          <header className={styles.sectionHead}>
            <h2 id="tsu-fate" className={styles.sectionTitle}>
              {pick(TSUNADE_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(TSUNADE_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {TSUNADE_TIMELINE.map((entry) => {
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
                      characterId={TSUNADE_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(TSUNADE_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 9 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="tsu-closing">
          <h2 id="tsu-closing" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}
          {TSUNADE_CLOSING.quotes.map((quote) => (
            <figure key={quote.text.en} className={styles.closingQuote}>
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
            {TSUNADE_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(TSUNADE_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(TSUNADE_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(TSUNADE_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={TSUNADE_ID}
                slot="ABILITY"
                abilityName={TSUNADE_IMAGE_KEYS.closing}
                label={pick(
                  TSUNADE_SLOT_LABELS[TSUNADE_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </RebirthShell>
  );
}
