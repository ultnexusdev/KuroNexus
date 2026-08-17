import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import type { CharacterCard, CharacterImageRow } from "@/lib/api/types";
import {
  AKATSUKI_IDS,
  AKATSUKI_LEADER,
  AKATSUKI_MEMBERS,
  AKATSUKI_NEXUS_PEOPLE,
  AKATSUKI_PARTNERS,
  AKATSUKI_RELATIONS,
  AKATSUKI_STAT_KEYS,
  AKATSUKI_SYMBOL_KEYS,
  AKATSUKI_TIMELINE,
  EXHIBIT_IMAGE_KEYS,
  SIX_PATHS,
  eraImageKey,
} from "@/lib/anime/akatsuki";
import { animeHref } from "@/lib/anime/routes";
import { AkatsukiCloud } from "@/components/anime/AkatsukiCloud";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { AkatsukiAudio } from "./AkatsukiAudio";
import { AkatsukiGlyph, type AkatsukiGlyphName } from "./AkatsukiGlyphs";
import { AkatsukiSetup } from "./AkatsukiSetup";
import { RinneganMotif } from "./RinneganMotif";
import shell from "@/app/[locale]/anime/layout.module.css";
import styles from "./AkatsukiExhibit.module.css";

/**
 * Akatsuki — aşağı doğru keşfedilen dijital sergi (komut §4).
 *
 * ── HİYERARŞİ KURALI ─────────────────────────────────────────────────────
 * Pain sayfanın AÇIK ARA en büyük görsel öğesi: hero'nun tamamı onun.
 * Başka hiçbir karakter, hiçbir bölümde bu ağırlığa yaklaşmaz — üyeler üç
 * sütunlu arşiv kartları, Pain tam ekran bir portre. Bu bir grup posteri
 * değil; Pain merkez, geri kalan herkes onun etrafında açılan arşiv.
 *
 * ── GÖRSEL ÇÖZÜMLEME SIRASI ─────────────────────────────────────────────
 * küratör/kurulum görseli (kendi diskimiz) → AniList portresi (küçük ama
 * var) → dokulu yuva (hiç görselsiz de sergi ayakta). Kurulum ucu henüz
 * koşmadıysa sayfa kırılmaz — komut §1'in fallback şartı.
 *
 * Sayfa saf sunucu bileşeni; tek istemci adası admin'e görünen kurulum
 * düğmesi (`AkatsukiSetup`).
 */

interface ImageSources {
  /** slot PORTRAIT → karakter kimliğiyle */
  portraits: Map<number, CharacterImageRow>;
  /** slot ABILITY → sergi anahtarıyla ("path:deva", "akatsuki:sky"…) */
  exhibit: Map<string, CharacterImageRow>;
  /** AniList portre yedeği */
  anilist: Map<number, string>;
}

function collectSources(
  images: CharacterImageRow[],
  cards: CharacterCard[],
): ImageSources {
  const portraits = new Map<number, CharacterImageRow>();
  const exhibit = new Map<string, CharacterImageRow>();
  for (const row of images) {
    /*
     * v3-A6: SON KAZANIR (satırlar orderIndex/createdAt artan sıralı, yani
     * en yeni yükleme haritada kalır). Kürasyon modunda "Görseli Değiştir"
     * yeni bir kayıt açar ve deploy'suz, anında görünür olur — şemadaki
     * PORTRAIT sözleşmesinin ("sonuncusu kazanır") sergi geneline uygulanışı.
     */
    if (row.slot === "PORTRAIT") {
      portraits.set(row.characterId, row);
    }
    if (row.slot === "ABILITY" && row.abilityName) {
      exhibit.set(row.abilityName, row);
    }
  }
  const anilist = new Map<number, string>();
  for (const card of cards) {
    if (card.image) {
      anilist.set(card.characterId, card.image);
    }
  }
  return { portraits, exhibit, anilist };
}

/**
 * Çözülmüş görsel: adres + kaynağı. `local` bayrağı `next/image`
 * optimizasyonunun kapısı — AniList adresleri `remotePatterns`ta yok,
 * `unoptimized` çizilmek zorunda (CharacterDossier deseni).
 */
interface ResolvedImage {
  src: string;
  local: boolean;
}

/** Portre adresi: kendi diskimiz önce, AniList yedek. `null` → dokulu yuva. */
function portraitSrc(
  sources: ImageSources,
  characterId: number,
): ResolvedImage | null {
  const own = sources.portraits.get(characterId);
  if (own) return { src: apiUrl(own.url), local: true };
  const fallback = sources.anilist.get(characterId);
  return fallback ? { src: fallback, local: false } : null;
}

function exhibitSrc(sources: ImageSources, key: string): ResolvedImage | null {
  const row = sources.exhibit.get(key);
  return row ? { src: apiUrl(row.url), local: true } : null;
}

/**
 * Sergi görseli — hepsi kaplama (`fill`) düzeninde, kırpma üstteki kapta.
 * `sizes` SABİT px (vw yasak — next.config.ts'teki ölçülmüş tuzak).
 */
function ExhibitImage({
  image,
  alt,
  sizes,
  priority,
  className,
}: {
  image: ResolvedImage;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={image.src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!image.local}
      className={className}
    />
  );
}

/**
 * v3-A6 yuva kapısı: ziyaretçi kürasyon yuvasını NE DOM'da NE JS'te görür
 * (dossier'deki `{isAdmin ? <CuratorSlot/> : null}` deseninin toplu hâli —
 * ilk sürümde kapı unutulmuştu, yerel sondayla yakalandı).
 */
function ExhibitSlot({
  enabled,
  ...props
}: { enabled: boolean } & Parameters<typeof CuratorSlot>[0]) {
  if (!enabled) return null;
  return <CuratorSlot {...props} />;
}

/** Dokulu yuva — portresi inmemiş karakter (spor panteonu deseni). */
function Hatch({ initial }: { initial: string }) {
  return (
    <span className={styles.hatch} aria-hidden>
      <span className={styles.hatchInitial}>{initial}</span>
    </span>
  );
}

export async function AkatsukiExhibit({
  locale,
  images,
  cards,
  isAdmin,
  narutoSlug,
}: {
  locale: string;
  images: CharacterImageRow[];
  cards: CharacterCard[];
  isAdmin: boolean;
  /** Arşivdeki Naruto serisinin slug'ı — Nexus paneli kapısı; yoksa kapı çizilmez */
  narutoSlug: string | null;
}) {
  const t = await getTranslations({ locale, namespace: "akatsuki" });
  const sources = collectSources(images, cards);

  const painPortrait = portraitSrc(sources, AKATSUKI_IDS.pain);
  const sky = exhibitSrc(sources, EXHIBIT_IMAGE_KEYS.sky);
  const six = exhibitSrc(sources, EXHIBIT_IMAGE_KEYS.six);
  const origins = exhibitSrc(sources, EXHIBIT_IMAGE_KEYS.origins);
  const legion = exhibitSrc(sources, EXHIBIT_IMAGE_KEYS.legion);
  const horror = exhibitSrc(sources, EXHIBIT_IMAGE_KEYS.horror);
  const dawn = exhibitSrc(sources, EXHIBIT_IMAGE_KEYS.dawn);
  /* v6: üretilmiş sahneler — yoksa bölümler eski düzenleriyle çizilir,
     görsel geldiği an (üretim ya da kürasyon) düzen kendiliğinden değişir */
  const aboutScene = exhibitSrc(sources, EXHIBIT_IMAGE_KEYS.about);
  /* v7: çerçeve süsleme frizi (screen blend — siyah zemin görünmez) */
  const ornament = exhibitSrc(sources, EXHIBIT_IMAGE_KEYS.ornament);
  /* v7: duvar lider + dokuz üye dizer; lider kendi çerçevesini taşır */
  const wallMembers = [AKATSUKI_LEADER, ...AKATSUKI_MEMBERS];

  const memberByKey = new Map(
    AKATSUKI_MEMBERS.map((member) => [member.key, member]),
  );

  return (
    <main className={styles.page} data-world="akatsuki">
      {/* v3-A6 — KÜRASYON MODU: anahtar yalnızca admin'e çizilir; açıkken
          her görsel yuvasının altında "Görseli Değiştir" (URL + dosya)
          belirir. Dossier'deki CuratorFrame/CuratorSlot altyapısının
          aynısı — yuva kimliği characterId+slot+abilityName. */}
      <CuratorFrame isAdmin={isAdmin}>
      {/* Kaydırma ilerlemesi (kullanıcı fikri, v2): scroll() zaman
          çizelgesiyle JS'siz; desteksiz tarayıcıda hiç görünmez */}
      <span className={styles.progress} aria-hidden />
      {/* Sergiye özgü fon müziği (v2 §5) — rota değişince susar */}
      <AkatsukiAudio />

      <nav className={shell.crumb} aria-label="breadcrumb">
        <Link href="/dark-stories">KuroNexus</Link>
        <span className={shell.sep}>/</span>
        <Link href={animeHref.hall()}>Anime</Link>
        <span className={shell.sep}>/</span>
        <span>{t("title")}</span>
      </nav>

      {/* ══ HERO — PAIN. Sayfanın en büyük görsel öğesi; pazarlıksız. ══ */}
      <header className={styles.hero}>
        {sky ? (
          <span className={styles.sky} aria-hidden>
            <ExhibitImage image={sky} alt="" sizes="1920px" priority />
          </span>
        ) : null}
        <span className={styles.rain} aria-hidden />
        <span className={styles.embers} aria-hidden />
        <RinneganMotif className={styles.rinnegan} />

        {painPortrait ? (
          <span className={styles.heroPortrait} aria-hidden>
            <ExhibitImage image={painPortrait} alt="" sizes="760px" priority />
          </span>
        ) : null}

        <div className={styles.heroInner}>
          <p className={`${shell.eyebrow} ${styles.heroEyebrow}`}>
            {t("eyebrow")} · {t("subtitle")}
          </p>
          {/* Sanat yönü v2: serginin adı kızıl serif kapitalde (kullanıcının
              görsel referansı); özel ad olduğu için TR büyütme YOK — serif
              small-caps yerine düz büyük yazımla veriliyor */}
          <h1 className={`${shell.serif} ${styles.mastTitle}`}>
            {t("title")}
          </h1>
          <p className={`${shell.brush} ${styles.mastKanji}`} aria-hidden>
            暁 ・ あかつき
          </p>
          {/* Pain'in adı: figürün levhası — sayfanın EN BÜYÜK görseli
              portrenin kendisi, hiyerarşi kuralı bozulmuyor */}
          <p className={`${shell.display} ${styles.heroName}`}>
            {t("hero.name")}
          </p>
          <p className={`${shell.serif} ${styles.epigraph}`}>
            {t("hero.epigraph")}
          </p>

          <dl className={styles.heroMeta}>
            {(
              [
                ["realName", "realNameValue"],
                ["village", "villageValue"],
                ["eye", "eyeValue"],
                ["role", "roleValue"],
                ["bodies", "bodiesValue"],
              ] as const
            ).map(([labelKey, valueKey]) => (
              <div key={labelKey} className={styles.heroMetaRow}>
                <dt className={`${shell.data} ${styles.heroMetaLabel}`}>
                  {t(`hero.meta.${labelKey}`)}
                </dt>
                <dd className={styles.heroMetaValue}>
                  {t(`hero.meta.${valueKey}`)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <p className={`${shell.data} ${styles.scrollHint}`} aria-hidden>
          {t("scrollHint")} ↓
        </p>

        {/* v3-A6: hero yuvaları — kürasyon modunda görünür */}
        <div className={styles.heroSlots}>
          <ExhibitSlot
            enabled={isAdmin}
            characterId={AKATSUKI_IDS.pain}
            slot="PORTRAIT"
            label={t("slots.portraitOf", { name: "Pain" })}
          />
          <ExhibitSlot
            enabled={isAdmin}
            characterId={AKATSUKI_IDS.pain}
            slot="ABILITY"
            abilityName={EXHIBIT_IMAGE_KEYS.sky}
            label={t("slots.sky")}
          />
        </div>
      </header>

      {/* ══ AKATSUKI HAKKINDA ══
          v6: üretilmiş taş kabartma sahnesi varsa bölüm TAM ŞERİT sinema
          kadrajına döner (referans görsel) — metin solda ışık perdesinin
          üstünde. Sahne yoksa v3-B1 düzeni (kadro paneli) devrede kalır. */}
      <section
        className={styles.about}
        data-scene={aboutScene ? "" : undefined}
        aria-labelledby="akatsuki-about"
      >
        {aboutScene ? (
          <span className={styles.aboutScene} aria-hidden>
            <ExhibitImage image={aboutScene} alt="" sizes="1920px" />
            <span className={styles.aboutSceneScrim} />
          </span>
        ) : (
          <AkatsukiCloud className={styles.aboutWatermark} />
        )}
        <div className={styles.aboutGrid}>
          <div className={styles.aboutText}>
            <h2
              id="akatsuki-about"
              className={`${shell.display} ${shell.section} ${styles.sectionTitle}`}
            >
              {t("about.title")}
            </h2>
            <p className={`${shell.lede} ${styles.aboutLede}`}>{t("lede")}</p>
            <div className={styles.aboutBody}>
              <p className={shell.prose}>{t("about.p1")}</p>
              <p className={shell.prose}>{t("about.p2")}</p>
              <p className={shell.prose}>{t("about.p3")}</p>
            </div>
            <AkatsukiCloud className={styles.divider} />
            <ExhibitSlot
              enabled={isAdmin}
              characterId={AKATSUKI_IDS.pain}
              slot="ABILITY"
              abilityName={EXHIBIT_IMAGE_KEYS.about}
              label={t("slots.about")}
            />
          </div>

          {!aboutScene && legion ? (
            <span className={styles.aboutArt} aria-hidden>
              <ExhibitImage image={legion} alt="" sizes="900px" />
              <span className={styles.aboutArtWash} />
            </span>
          ) : null}
        </div>
      </section>

      {/* ══ SIX PATHS OF PAIN ══ */}
      <section className={styles.paths} aria-labelledby="akatsuki-paths">
        {six ? (
          <span className={styles.pathsBand} aria-hidden>
            <ExhibitImage image={six} alt="" sizes="1920px" />
          </span>
        ) : null}
        <header className={styles.sectionHead}>
          <h2
            id="akatsuki-paths"
            className={`${shell.display} ${shell.section} ${styles.sectionTitle}`}
          >
            {t("paths.title")}
          </h2>
          <p className={shell.lede}>{t("paths.lede")}</p>
          <ExhibitSlot
            enabled={isAdmin}
            characterId={AKATSUKI_IDS.pain}
            slot="ABILITY"
            abilityName={EXHIBIT_IMAGE_KEYS.six}
            label={t("slots.six")}
          />
        </header>

        <ul className={styles.pathGrid}>
          {SIX_PATHS.map((path) => {
            const src = exhibitSrc(sources, path.imageKey);
            return (
              <li key={path.key} className={styles.path}>
                {/* v7: kart tıklanabilir — her Path kendi detay sayfasına
                    açılır; portre küçüldü, kısa cümle karta indi */}
                <Link
                  href={animeHref.akatsukiPath(path.key)}
                  className={styles.pathLink}
                >
                  <span className={styles.pathArt}>
                    {src ? (
                      <ExhibitImage
                        image={src}
                        alt={t(`paths.${path.key}.name`)}
                        sizes="440px"
                      />
                    ) : (
                      <Hatch initial={path.kanji.slice(0, 1)} />
                    )}
                    <span
                      className={`${shell.brush} ${styles.pathKanji}`}
                      aria-hidden
                    >
                      {path.kanji}
                    </span>
                  </span>
                  <span className={styles.pathBody}>
                    <span className={`${shell.display} ${styles.pathName}`}>
                      {t(`paths.${path.key}.name`)}
                    </span>
                    <span className={`${shell.data} ${styles.pathRomaji}`}>
                      {path.romaji}
                    </span>
                    <span className={styles.pathDesc}>
                      {t(`paths.${path.key}.short`)}
                    </span>
                    <span className={`${shell.data} ${styles.pathAbility}`}>
                      {t(`paths.${path.key}.ability`)}
                    </span>
                    <span className={`${shell.data} ${styles.pathOpen}`}>
                      {t("pathPage.open")} →
                    </span>
                  </span>
                </Link>
                <ExhibitSlot
                  enabled={isAdmin}
                  characterId={AKATSUKI_IDS.pain}
                  slot="ABILITY"
                  abilityName={path.imageKey}
                  label={t("slots.pathOf", {
                    name: t(`paths.${path.key}.name`),
                  })}
                />
              </li>
            );
          })}
        </ul>
      </section>

      {/* ══ AKATSUKI ÜYELERİ ══ */}
      <section className={styles.members} aria-labelledby="akatsuki-members">
        {legion ? (
          <span className={styles.membersBand} aria-hidden>
            <ExhibitImage image={legion} alt="" sizes="1920px" />
          </span>
        ) : null}
        <header className={styles.sectionHead}>
          <h2
            id="akatsuki-members"
            className={`${shell.display} ${shell.section} ${styles.sectionTitle}`}
          >
            {t("members.title")}
          </h2>
          <p className={shell.lede}>{t("members.lede")}</p>
          <ExhibitSlot
            enabled={isAdmin}
            characterId={AKATSUKI_IDS.pain}
            slot="ABILITY"
            abilityName={EXHIBIT_IMAGE_KEYS.legion}
            label={t("slots.legion")}
          />
        </header>

        <ul className={styles.memberGrid}>
          {wallMembers.map((member) => {
            const src = portraitSrc(sources, member.characterId);
            const isLeader = member.key === AKATSUKI_LEADER.key;
            return (
              <li
                key={member.key}
                className={styles.member}
                data-leader={isLeader || undefined}
              >
                <Link
                  href={animeHref.character(member.characterId)}
                  className={styles.memberLink}
                  aria-label={member.name}
                >
                  <span className={styles.memberFrame} data-member={member.key}>
                    {/* v7: çerçeve süslemesi — köşe bulutları + (üretilince)
                        kızıl bulut frizi; screen blend siyahı yutar */}
                    <AkatsukiCloud className={styles.frameCloudA} />
                    <AkatsukiCloud className={styles.frameCloudB} />
                    {ornament ? (
                      <span
                        className={styles.frameOrnament}
                        style={{ backgroundImage: `url("${ornament.src}")` }}
                      />
                    ) : null}
                    {src ? (
                      <ExhibitImage
                        image={src}
                        alt={member.name}
                        sizes="440px"
                        className={styles.memberPortrait}
                      />
                    ) : (
                      <Hatch initial={member.name.slice(0, 1)} />
                    )}
                    {member.ring ? (
                      <span
                        className={styles.memberRing}
                        title={`${t("labels.ring")} · ${member.ring.romaji}`}
                      >
                        <span className={shell.brush}>{member.ring.kanji}</span>
                      </span>
                    ) : null}
                  </span>

                  <span className={styles.memberBody}>
                    <span className={`${shell.display} ${styles.memberName}`}>
                      {member.name}
                    </span>
                    <span
                      className={`${shell.brush} ${styles.memberNative}`}
                      aria-hidden
                    >
                      {member.nativeName}
                    </span>
                    <span
                      className={`${shell.serif} ${styles.memberAlias}`}
                    >
                      {t(`members.${member.key}.alias`)}
                    </span>
                    <span className={`${shell.data} ${styles.memberRole}`}>
                      {t(`members.${member.key}.role`)}
                    </span>
                    <span className={`${shell.data} ${styles.memberAbility}`}>
                      {t(`members.${member.key}.ability`)}
                    </span>
                    <span className={styles.memberBio}>
                      {t(`members.${member.key}.bio`)}
                    </span>
                    {/* İmza söz (v2) — sergiyi wiki hissinden çıkaran satır */}
                    <span className={`${shell.serif} ${styles.memberQuote}`}>
                      &ldquo;{t(`members.${member.key}.quote`)}&rdquo;
                    </span>
                    {/* Güç profili (v2) — küratör tahmini, rozeti üstünde */}
                    <span
                      className={styles.memberStats}
                      title={t("stats.note")}
                    >
                      {AKATSUKI_STAT_KEYS.map((statKey) => (
                        <span key={statKey} className={styles.statRow}>
                          <span
                            className={`${shell.data} ${styles.statLabel}`}
                          >
                            {t(`stats.${statKey}`)}
                          </span>
                          <span className={styles.statTrack}>
                            <span
                              className={styles.statFill}
                              style={{ width: `${member.stats[statKey]}%` }}
                            />
                          </span>
                        </span>
                      ))}
                    </span>
                    <span className={`${shell.data} ${styles.memberEnter}`}>
                      {t("labels.dossier")}
                    </span>
                  </span>
                </Link>
                <ExhibitSlot
                  enabled={isAdmin}
                  characterId={member.characterId}
                  slot="PORTRAIT"
                  label={t("slots.portraitOf", { name: member.name })}
                />
              </li>
            );
          })}
        </ul>
      </section>

      {/* ══ PARTNERLER ══ */}
      <section className={styles.partners} aria-labelledby="akatsuki-partners">
        {horror ? (
          <span className={styles.partnersBand} aria-hidden>
            <ExhibitImage image={horror} alt="" sizes="1920px" />
          </span>
        ) : null}
        <header className={styles.sectionHead}>
          <h2
            id="akatsuki-partners"
            className={`${shell.display} ${shell.section} ${styles.sectionTitle}`}
          >
            {t("partners.title")}
          </h2>
          <p className={shell.lede}>{t("partners.lede")}</p>
          <ExhibitSlot
            enabled={isAdmin}
            characterId={AKATSUKI_IDS.pain}
            slot="ABILITY"
            abilityName={EXHIBIT_IMAGE_KEYS.horror}
            label={t("slots.horror")}
          />
        </header>

        <ul className={styles.partnerGrid}>
          {AKATSUKI_PARTNERS.map((pair) => {
            const a =
              pair.aKey === "pain"
                ? {
                    name: t("hero.name"),
                    characterId: AKATSUKI_IDS.pain,
                  }
                : memberByKey.get(pair.aKey)!;
            const b = memberByKey.get(pair.bKey)!;
            const aSrc = portraitSrc(sources, a.characterId);
            const bSrc = portraitSrc(sources, b.characterId);
            return (
              <li key={pair.key} className={styles.pair}>
                <span className={styles.pairFaces} aria-hidden>
                  <span className={styles.pairFace}>
                    {aSrc ? (
                      <ExhibitImage image={aSrc} alt="" sizes="96px" />
                    ) : (
                      <Hatch initial={a.name.slice(0, 1)} />
                    )}
                  </span>
                  <span className={`${styles.pairFace} ${styles.pairFaceB}`}>
                    {bSrc ? (
                      <ExhibitImage image={bSrc} alt="" sizes="96px" />
                    ) : (
                      <Hatch initial={b.name.slice(0, 1)} />
                    )}
                  </span>
                </span>
                <span className={styles.pairBody}>
                  <span className={`${shell.display} ${styles.pairNames}`}>
                    {a.name} <span className={styles.pairX}>×</span> {b.name}
                  </span>
                  <span className={styles.pairNote}>
                    {t(`partners.${pair.key}`)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ══ AKATSUKI'NİN TARİHİ ══ */}
      <section className={styles.history} aria-labelledby="akatsuki-history">
        {origins ? (
          <span className={styles.historyBand} aria-hidden>
            <ExhibitImage image={origins} alt="" sizes="1920px" />
          </span>
        ) : null}
        <header className={styles.sectionHead}>
          <h2
            id="akatsuki-history"
            className={`${shell.display} ${shell.section} ${styles.sectionTitle}`}
          >
            {t("history.title")}
          </h2>
          <p className={shell.lede}>{t("history.lede")}</p>
          <ExhibitSlot
            enabled={isAdmin}
            characterId={AKATSUKI_IDS.pain}
            slot="ABILITY"
            abilityName={EXHIBIT_IMAGE_KEYS.origins}
            label={t("slots.origins")}
          />
        </header>

        {/* v3-B2 — ZİGZAG SERGİ ŞERİDİ: dönemler merkez ekseninin iki
            yanında dönüşümlü; her kartın kendi dokusu (`data-era`),
            dairesel portreleri ve glifleri var. Merkez çizgi kaydırmayla
            doluyor (scroll-driven, JS'siz). */}
        <ol className={styles.zigzag}>
          <span className={styles.zigLine} aria-hidden>
            <span className={styles.zigFill} />
          </span>
          {AKATSUKI_TIMELINE.map((era, index) => {
            /* v6: dönem illüstrasyonu (üretilmiş) — yoksa kart yalnız
               dokusuyla çizilir, referanstaki zenginlik görsel gelince */
            const eraArt = exhibitSrc(sources, eraImageKey(era.key));
            return (
            <li
              key={era.key}
              className={styles.zigItem}
              data-era={era.key}
              data-side={index % 2 === 0 ? "left" : "right"}
            >
              <span className={styles.zigNode} aria-hidden />
              <article className={styles.zigCard}>
                <span className={styles.zigTexture} aria-hidden />
                {eraArt ? (
                  <span className={styles.zigArt} aria-hidden>
                    <ExhibitImage image={eraArt} alt="" sizes="640px" />
                  </span>
                ) : null}
                <div className={styles.zigBody}>
                  <span className={`${shell.data} ${styles.eraLabel}`}>
                    {t(`history.${era.key}.era`)}
                  </span>
                  <span className={`${shell.display} ${styles.eraTitle}`}>
                    {t(`history.${era.key}.title`)}
                  </span>
                  <p className={`${shell.prose} ${styles.eraText}`}>
                    {t(`history.${era.key}.text`)}
                  </p>
                  <span className={styles.zigMeta}>
                    <span className={styles.zigFaces} aria-hidden>
                      {era.faces.map((characterId) => {
                        const src = portraitSrc(sources, characterId);
                        return src ? (
                          <span key={characterId} className={styles.zigFace}>
                            <ExhibitImage image={src} alt="" sizes="48px" />
                          </span>
                        ) : null;
                      })}
                    </span>
                    <span className={styles.zigIcons} aria-hidden>
                      {era.icons.map((icon) => (
                        <AkatsukiGlyph
                          key={icon}
                          name={icon as AkatsukiGlyphName}
                          className={styles.zigIcon}
                        />
                      ))}
                    </span>
                  </span>
                </div>
              </article>
              <ExhibitSlot
                enabled={isAdmin}
                characterId={AKATSUKI_IDS.pain}
                slot="ABILITY"
                abilityName={eraImageKey(era.key)}
                label={t("slots.eraOf", {
                  name: t(`history.${era.key}.title`),
                })}
              />
            </li>
            );
          })}
        </ol>
      </section>

      {/* ══ ÖNEMLİ İLİŞKİLER ══ */}
      <section className={styles.relations} aria-labelledby="akatsuki-relations">
        <header className={styles.sectionHead}>
          <h2
            id="akatsuki-relations"
            className={`${shell.display} ${shell.section} ${styles.sectionTitle}`}
          >
            {t("relations.title")}
          </h2>
          <p className={shell.lede}>{t("relations.lede")}</p>
        </header>

        <ul className={styles.relationList}>
          {AKATSUKI_RELATIONS.map((relation) => {
            const src = relation.imageKey
              ? (exhibitSrc(sources, relation.imageKey) ??
                portraitSrc(sources, relation.characterId))
              : portraitSrc(sources, relation.characterId);
            return (
              <li key={relation.key} className={styles.relation}>
                <span className={styles.relationFace} aria-hidden>
                  {src ? (
                    <ExhibitImage image={src} alt="" sizes="128px" />
                  ) : (
                    <Hatch initial={relation.name.slice(0, 1)} />
                  )}
                </span>
                <span className={styles.relationBody}>
                  <span className={`${shell.display} ${styles.relationName}`}>
                    {relation.name}
                  </span>
                  <span className={`${shell.data} ${styles.relationRole}`}>
                    {t(`relations.${relation.key}.role`)}
                  </span>
                  <p className={`${shell.prose} ${styles.relationText}`}>
                    {t(`relations.${relation.key}.text`)}
                  </p>
                  {relation.imageKey ? (
                    <ExhibitSlot
                      enabled={isAdmin}
                      characterId={relation.imageOwnerId ?? relation.characterId}
                      slot="ABILITY"
                      abilityName={relation.imageKey}
                      label={t("slots.exhibitOf", { name: relation.name })}
                    />
                  ) : (
                    <ExhibitSlot
                      enabled={isAdmin}
                      characterId={relation.characterId}
                      slot="PORTRAIT"
                      label={t("slots.portraitOf", { name: relation.name })}
                    />
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ══ SEMBOLİZM ══ */}
      <section className={styles.symbols} aria-labelledby="akatsuki-symbols">
        <header className={styles.sectionHead}>
          <h2
            id="akatsuki-symbols"
            className={`${shell.display} ${shell.section} ${styles.sectionTitle}`}
          >
            {t("symbols.title")}
          </h2>
          <p className={shell.lede}>{t("symbols.lede")}</p>
        </header>

        <ul className={styles.symbolGrid}>
          {AKATSUKI_SYMBOL_KEYS.map((key) => (
            <li key={key} className={styles.symbol}>
              <span className={styles.symbolArt} aria-hidden>
                {key === "cloud" ? (
                  <AkatsukiCloud className={styles.symbolCloud} />
                ) : null}
                {key === "rings" ? (
                  <span className={styles.ringRow}>
                    <span className={`${shell.brush} ${styles.ringChip}`}>
                      零
                    </span>
                    {AKATSUKI_MEMBERS.filter(
                      (member, index, all) =>
                        member.ring &&
                        all.findIndex(
                          (m) => m.ring?.kanji === member.ring?.kanji,
                        ) === index,
                    ).map((member) => (
                      <span
                        key={member.key}
                        className={`${shell.brush} ${styles.ringChip}`}
                      >
                        {member.ring?.kanji}
                      </span>
                    ))}
                  </span>
                ) : null}
                {key === "cloak" ? (
                  <span className={styles.cloak}>
                    <AkatsukiCloud className={styles.cloakCloud} />
                    <AkatsukiCloud
                      className={`${styles.cloakCloud} ${styles.cloakCloudB}`}
                    />
                  </span>
                ) : null}
              </span>
              <span className={`${shell.display} ${styles.symbolName}`}>
                {t(`symbols.${key}.name`)}
              </span>
              <p className={styles.symbolText}>{t(`symbols.${key}.text`)}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ══ SON — MİRAS ══ */}
      <section className={styles.legacy} aria-labelledby="akatsuki-legacy">
        {dawn ? (
          <span className={styles.legacyBand} aria-hidden>
            <ExhibitImage image={dawn} alt="" sizes="1920px" />
          </span>
        ) : null}
        <AkatsukiCloud className={styles.legacyCloud} />
        <h2
          id="akatsuki-legacy"
          className={`${shell.display} ${shell.section} ${styles.sectionTitle}`}
        >
          {t("legacy.title")}
        </h2>
        <p className={`${shell.serif} ${styles.legacyText}`}>{t("legacy.p1")}</p>
        <p className={`${shell.serif} ${styles.legacyText}`}>{t("legacy.p2")}</p>
        <ExhibitSlot
          enabled={isAdmin}
          characterId={AKATSUKI_IDS.pain}
          slot="ABILITY"
          abilityName={EXHIBIT_IMAGE_KEYS.dawn}
          label={t("slots.dawn")}
        />
      </section>

      {/* ══ NEXUS DÜĞÜMÜ — İLGİLİ İÇERİK (v2) ══
          Sergi bir son durak değil; ipler arşivin başka odalarına uzanır. */}
      <section className={styles.nexus} aria-labelledby="akatsuki-nexus">
        <header className={styles.sectionHead}>
          <h2
            id="akatsuki-nexus"
            className={`${shell.display} ${shell.section} ${styles.sectionTitle}`}
          >
            {t("nexus.title")}
          </h2>
          <p className={shell.lede}>{t("nexus.lede")}</p>
        </header>

        <div className={styles.nexusGrid}>
          <ul className={styles.nexusPeople}>
            {AKATSUKI_NEXUS_PEOPLE.map((person) => {
              const src = portraitSrc(sources, person.characterId);
              return (
                <li key={person.key} className={styles.nexusPerson}>
                  <Link
                    href={animeHref.character(person.characterId)}
                    className={styles.nexusPersonLink}
                    aria-label={person.name}
                  >
                    <span className={styles.nexusFace}>
                      {src ? (
                        <ExhibitImage image={src} alt="" sizes="128px" />
                      ) : (
                        <Hatch initial={person.name.slice(0, 1)} />
                      )}
                    </span>
                    <span className={styles.nexusPersonBody}>
                      <span
                        className={`${shell.display} ${styles.nexusPersonName}`}
                      >
                        {person.name}
                      </span>
                      <span className={styles.nexusPersonRole}>
                        {t(`nexus.people.${person.key}`)}
                      </span>
                      <span className={`${shell.data} ${styles.memberEnter}`}>
                        {t("labels.dossier")}
                      </span>
                    </span>
                  </Link>
                  <ExhibitSlot
                    enabled={isAdmin}
                    characterId={person.characterId}
                    slot="PORTRAIT"
                    label={t("slots.portraitOf", { name: person.name })}
                  />
                </li>
              );
            })}
          </ul>

          <ul className={styles.nexusDoors}>
            {narutoSlug ? (
              <li>
                <Link
                  href={animeHref.series(narutoSlug)}
                  className={styles.nexusDoor}
                >
                  <span className={`${shell.display} ${styles.nexusDoorName}`}>
                    {t("nexus.doors.naruto")}
                  </span>
                  <span className={styles.nexusDoorDesc}>
                    {t("nexus.doors.narutoDesc")}
                  </span>
                </Link>
              </li>
            ) : null}
            <li>
              <Link href={animeHref.characters()} className={styles.nexusDoor}>
                <span className={`${shell.display} ${styles.nexusDoorName}`}>
                  {t("nexus.doors.characters")}
                </span>
                <span className={styles.nexusDoorDesc}>
                  {t("nexus.doors.charactersDesc")}
                </span>
              </Link>
            </li>
            <li>
              <Link href={animeHref.archive()} className={styles.nexusDoor}>
                <span className={`${shell.display} ${styles.nexusDoorName}`}>
                  {t("nexus.doors.archive")}
                </span>
                <span className={styles.nexusDoorDesc}>
                  {t("nexus.doors.archiveDesc")}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Küratör kuşağı — ziyaretçi bu adayı hiç indirmiyor; yetkinin
          gerçek kapısı backend'de (@Roles). */}
      {isAdmin ? (
        <section className={styles.curator}>
          <AkatsukiSetup />
          {/* Salon girişi hero fonunun yuvası da burada — salonun kendi
              kürasyon çerçevesi yok, bütün yuvalar sergide toplanıyor */}
          <ExhibitSlot
            enabled={isAdmin}
            characterId={AKATSUKI_IDS.pain}
            slot="ABILITY"
            abilityName={EXHIBIT_IMAGE_KEYS.hallHero}
            label={t("slots.hallHero")}
          />
        </section>
      ) : null}
      </CuratorFrame>
    </main>
  );
}
