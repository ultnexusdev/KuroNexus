import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { getAnimeArchive, getAnimeShowcase } from "@/lib/api/anime";
import { getCharacterImages } from "@/lib/api/characters";
import { apiUrl } from "@/lib/api/client";
import { getHall } from "@/lib/halls";
import { shareCard } from "@/lib/seo";
import { animeHref } from "@/lib/anime/routes";
import { AKATSUKI_IDS, EXHIBIT_IMAGE_KEYS } from "@/lib/anime/akatsuki";
import { ANIME_SECTIONS } from "@/lib/anime/sections";
import type { ArchiveAnime } from "@/lib/api/types";
import { AkatsukiCloud } from "@/components/anime/AkatsukiCloud";
import { AkatsukiPortalLink } from "@/components/anime/AkatsukiPortal";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { HallArt, HallSlotPen, hallArtSrc } from "@/components/anime/HallArt";
import { readIsAdmin } from "@/lib/auth/session";
import shell from "../layout.module.css";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

/**
 * Bleach kartının depodaki geçici karesi.
 *
 * Küratör `world:bleach` yuvasını doldurana kadar geçerli. Bleach sayfasının
 * Seireitei katmanıyla AYNI dosya: kart ile sayfa arasında görsel bir bağ
 * kuruyor ve tarayıcı ikisini tek kez indiriyor.
 */
const BLEACH_CARD_FALLBACK = "/assets/bleach/world-soul-society.webp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "anime" });
  const title = t("hallName");
  const description = t("lobbyLede");
  return {
    title,
    description,
    ...shareCard({ title, description, locale, path: "/anime" }),
  };
}

/**
 * Arşivde adı geçen seriyi bul. En kısa başlık kazanır: "Naruto" araması
 * "Naruto: Shippuden"i değil kök seriyi seçsin. Bulunamazsa `null` —
 * kart HİÇ çizilmez (boş oda yasağı: olmayan sayfaya kapı açılmaz).
 */
function findSeries(entries: ArchiveAnime[], needle: string) {
  const matches = entries.filter((entry) =>
    entry.title.toLowerCase().includes(needle),
  );
  if (matches.length === 0) return null;
  return [...matches].sort((a, b) => a.title.length - b.title.length)[0];
}

/**
 * Salon girişi — `/anime`.
 *
 * ── ÜÇ HAREKET ───────────────────────────────────────────────────────────
 *   1. AÇILIŞ     ANİME başlığı + cümle; vitrindeki iki afiş kenarlardan
 *                 sızar ve merkeze doğru kaybolur          (sessiz, sinematik)
 *   2. ODALAR     Anime Arşivim + Karakterler — mevcut iki kapı korunur
 *   3. DÜNYALAR   Akatsuki (öne çıkan) · Naruto · One Piece · Arşiv
 *
 * Akatsuki kartı bilinçli olarak diğerlerinden AYRIŞIR: kendi derisini
 * (`data-world="akatsuki"`) taşır, bulut motifi ve Pain silüetiyle gelir.
 * Amaç, göz sayfaya ilk düştüğünde oraya gitsin (komut §2a).
 */
export default async function AnimeHallPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "anime" });

  const isAdmin = await readIsAdmin();
  const [archive, showcase, hall, painImages] = await Promise.all([
    getAnimeArchive(isAdmin),
    getAnimeShowcase(),
    getHall("anime", t("hallName"), locale),
    // Silüet için yalnızca Pain'in kayıtları; kurulum koşmadıysa boş döner
    // ve kart bulut motifiyle çizilir — sayfa görsele borçlu değil.
    getCharacterImages([AKATSUKI_IDS.pain], isAdmin),
  ]);

  const painPortrait =
    painImages.find(
      (image) =>
        image.characterId === AKATSUKI_IDS.pain && image.slot === "PORTRAIT",
    ) ?? null;

  /* v6-A1: üretilmiş özgün hero fonu (kürasyonla değiştirilebilir; yuvası
     sergideki küratör kuşağında). Varsa afişlerin yerini tam kadraj alır;
     SON kayıt kazanır (kürasyon sözleşmesi). */
  const exhibitImage = (key: string) =>
    [...painImages]
      .reverse()
      .find(
        (image) => image.slot === "ABILITY" && image.abilityName === key,
      ) ?? null;

  /* ── ⚠️ ESKİ KARE MEKANİZMASI ARTIK YEDEK (29 Ağustos 2026) ────────────
     Bu dört kare karakter görselleri tablosundan geliyordu: Pain'in
     kaydına `ABILITY` slotu olarak, `abilityName` alanına `akatsuki:…`
     anahtarları yazılarak. Sergi için yazılmış bir mekanizma salonun kapı
     kareleri için ödünç alınmıştı ve bedeli şuydu: yeni bir karta kare
     koymanın yolu admin panelinden Pain'in dosyasına gidip uydurma bir
     yetenek adı yazmaktı (kullanıcı bildirimi: "Slam Dunk evrenini
     ekledik onun resmi yok").

     Kareler artık `anime/hall` küratör yüzeyinden geliyor ve aşağıdakiler
     yalnızca YEDEK: yuva boşken çizilmeye devam ediyorlar, küratör
     üstlerine yazdığı anda kayıt kazanıyor. Yani geçiş yıkıcı değil. */
  const hallHero = exhibitImage(EXHIBIT_IMAGE_KEYS.hallHero);
  const narutoArt = exhibitImage(EXHIBIT_IMAGE_KEYS.worldNaruto);
  const archiveArt = exhibitImage(EXHIBIT_IMAGE_KEYS.worldArchive);
  const bleachArtLegacy = exhibitImage(EXHIBIT_IMAGE_KEYS.worldBleach);

  /* Bleach kartı kareyi İKİ KEZ çiziyor (hover'da yarılan iki yarı), o
     yüzden `HallArt` değil doğrudan adres çözücü kullanılıyor. Kartın
     hiçbir koşulda görselsiz kalmaması gerekiyor: yarılma etkisi görsele
     bağlı ve boş bir kartta anlamsız kalırdı — bu yüzden zincirin sonunda
     depodaki geçici kare duruyor. */
  const bleachArt = await hallArtSrc(
    "anime:world:bleach",
    bleachArtLegacy ? apiUrl(bleachArtLegacy.url) : BLEACH_CARD_FALLBACK,
  );

  /* Hero kaydı var mı — vitrin afişleri yalnızca HİÇBİR kare yokken
     çiziliyor ve bu artık küratör yuvasını da hesaba katmalı. */
  const heroArt = await hallArtSrc(
    "anime:hall:hero",
    hallHero ? apiUrl(hallHero.url) : null,
  );

  /* Naruto artık aranmıyor: kartı arşivdeki seri kaydına değil kendi evren
     sayfasına gidiyor. One Piece hâlâ arşive bağlı — onun evren sayfası yok. */
  const onePiece = findSeries(archive.entries, "one piece");

  const archiveMeter =
    archive.entries.length === 0
      ? t("lobbyArchiveEmpty")
      : t("lobbyArchiveMeter", {
          count: archive.entries.length,
          watching: archive.stats.watching,
        });

  return (
    /* Küratör anahtarı: kapalıyken kalemler gizli ve yönetici sayfanın
       gerçek hâlini görüyor. Ziyaretçide sarmalayıcı hiç çizilmiyor —
       ne anahtar, ne nitelik, ne de bir bayt JS. */
    <CuratorFrame isAdmin={isAdmin}>
    <div className={styles.page}>
      <nav className={shell.crumb} aria-label="breadcrumb">
        <Link href="/dark-stories">KuroNexus</Link>
        <span className={shell.sep}>/</span>
        <span>{t("hall", { num: hall.label, name: hall.name })}</span>
      </nav>

      {/* ══ 1. AÇILIŞ ══ */}
      <header className={styles.opening}>
        {/* Hero fonu — varsa sahnenin tamamı onun, afişler hiç çizilmez */}
        <HallArt
          slotId="anime:hall:hero"
          fallbackUrl={hallHero ? apiUrl(hallHero.url) : null}
          className={styles.heroArt}
          sizes="1920px"
          priority
        />

        {/* Vitrin afişleri: kenarlardan sızar, metne doğru kaybolur.
            AniList adresleri tam URL verir; CSP img-src'de s4.anilist.co
            zaten var. remotePatterns'ta olmadığı için düz <img>.

            ⚠️ Koşul artık `heroArt` — eski `hallHero` DEĞİL. Küratör
            hero yuvasını doldurduğunda afişler de susmalı; koşul eski
            kayda bakmaya devam etseydi kare ile afişler üst üste binerdi. */}
        {!heroArt && showcase.left?.posterPath ? (
          <span className={`${styles.poster} ${styles.posterLeft}`} aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={showcase.left.posterPath} alt="" loading="eager" />
          </span>
        ) : null}
        {!heroArt && showcase.right?.posterPath ? (
          <span
            className={`${styles.poster} ${styles.posterRight}`}
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={showcase.right.posterPath} alt="" loading="eager" />
          </span>
        ) : null}

        {/* Küratör kalemi: hero bir `<a>` içinde DEĞİL, o yüzden doğrudan
            sahnenin içinde durabiliyor. */}
        <HallSlotPen slotId="anime:hall:hero" className={styles.heroPen} />

        {/* v3-A1: merkez ışık havuzu — hero'nun ortası ölü siyah kalmasın */}
        <span className={styles.openingPool} aria-hidden />

        <div className={styles.openingInner}>
          <p className={shell.eyebrow}>
            {t("hall", { num: hall.label, name: hall.name })}
          </p>
          <h1 className={`${shell.display} ${shell.world}`}>
            {hall.name.toLocaleUpperCase(locale)}
          </h1>
          <p className={shell.lede}>{t("lobbyLede")}</p>
        </div>
      </header>

      {/* ══ 2. ODALAR — mevcut iki kapı, kanat dilinde ══ */}
      <nav className={styles.rooms} aria-label={t("lobbySectionsAria")}>
        {ANIME_SECTIONS.map((section) => (
          <Link key={section.slug} href={section.href} className={styles.room}>
            <span className={`${shell.display} ${styles.roomTitle}`}>
              {t(`sections.${section.key}.title`)}
            </span>
            <span className={styles.roomDesc}>
              {t(`sections.${section.key}.desc`)}
            </span>
            {section.key === "archive" ? (
              <span className={`${shell.data} ${styles.roomMeter}`}>
                {archiveMeter}
              </span>
            ) : null}
            <span className={styles.roomRule} aria-hidden />
          </Link>
        ))}
      </nav>

      {/* ══ 3. ANİME DÜNYALARI ══ */}
      <section className={styles.worlds} aria-label={t("worlds.aria")}>
        <h2 className={`${shell.eyebrow} ${styles.worldsLabel}`}>
          {t("worlds.title")}
        </h2>

        <ul className={styles.worldGrid}>
          {/* Akatsuki — öne çıkan kart, kendi derisiyle. Tıklama anı bir
              portal (v2): bulut ekranı yutar, sonra sergi açılır. */}
          <li className={styles.worldItem} data-featured>
            <AkatsukiPortalLink
              href={animeHref.akatsuki()}
              className={`${styles.world} ${styles.akatsuki}`}
            >
              {/* Küratör kare koyarsa bulut/silüet kompozisyonunun ARKASINA
                  giriyor: kartın kendi dili (暁, bulut rozeti, Pain silüeti)
                  kaybolmuyor, yalnızca zemin kazanıyor. */}
              <HallArt
                slotId="anime:world:akatsuki"
                className={styles.worldArt}
                sizes="620px"
              />
              <span className={styles.mist} aria-hidden />
              {painPortrait ? (
                <span className={styles.silhouette} aria-hidden>
                  {/* Kendi diskimizden — next/image küçültüp WebP'ye çevirir;
                      sizes SABİT px (vw yasak, next.config.ts ölçümü) */}
                  <Image
                    src={apiUrl(painPortrait.url)}
                    alt=""
                    fill
                    sizes="620px"
                  />
                </span>
              ) : null}
              <span className={`${shell.brush} ${styles.kanji}`} aria-hidden>
                暁
              </span>

              <span className={styles.worldBody}>
                {/* v3-A4: bulut artık serbest katman değil, metin bloğunun
                    rozeti — tam görünür, hiçbir şeyin üstüne binmiyor */}
                <span className={styles.cloudChip} aria-hidden>
                  <AkatsukiCloud className={styles.cloudChipArt} />
                </span>
                <span className={`${shell.data} ${styles.worldMeter}`}>
                  {t("worlds.akatsuki.meter")}
                </span>
                {/* Özel ad — TR büyütme İ üretir ("AKATSUKİ", LINKIN PARK
                    dersi). Bebas kapitali görsel olarak zaten basıyor. */}
                <span className={`${shell.display} ${styles.worldName}`}>
                  {t("worlds.akatsuki.title")}
                </span>
                <span className={styles.worldTagline}>
                  {t("worlds.akatsuki.tagline")}
                </span>
                <span className={`${shell.data} ${styles.worldEnter}`}>
                  {t("worlds.enter")}
                </span>
              </span>
            </AkatsukiPortalLink>
            <HallSlotPen slotId="anime:world:akatsuki" />
          </li>

          {/* Naruto Evreni kendi sayfasına gidiyor (`/anime/naruto`), arşivdeki
              seri kaydına DEĞİL: biri "izlediğim seri", diğeri evrenin
              ansiklopedisi. Kart artık arşive de bağlı değil — evren sayfası
              her hâlükârda var, koşullu çizim gereksizdi. */}
          <li className={styles.worldItem}>
            <Link href={animeHref.naruto()} className={styles.world}>
                <HallArt
                  slotId="anime:world:naruto"
                  fallbackUrl={narutoArt ? apiUrl(narutoArt.url) : null}
                  className={styles.worldArt}
                  sizes="620px"
                />
                <span className={styles.worldBody}>
                  <span className={`${shell.display} ${styles.worldName}`}>
                    {t("worlds.naruto.title")}
                  </span>
                  <span className={styles.worldTagline}>
                    {t("worlds.naruto.tagline")}
                  </span>
                  <span className={`${shell.data} ${styles.worldEnter}`}>
                    {t("worlds.enter")}
                  </span>
                </span>
            </Link>
            <HallSlotPen slotId="anime:world:naruto" />
          </li>

          {/* Bleach Evreni — Naruto'nun kardeşi: evrenin kendisi, izlediğim
              seri kaydı değil. Sayfa inşa hâlinde ama kart bugünden duruyor
              (kullanıcı isteği, 23 Ağustos 2026); "İnşa hâlinde" ölçüsü bunu
              açıkça söylüyor, ziyaretçi yarım bir sayfaya sürpriz girmiyor.

              KARTIN AYRIMI: hover'da görsel ortadan DİKEY OLARAK yarılıyor ve
              aradan ince bir ışık geçiyor — Senkaimon'un mikro hâli. Sayfanın
              dili kullanıcıya girmeden önce haber veriliyor. Diğer kartlar
              ölçekleniyor, bu yarılıyor. */}
          <li className={styles.worldItem}>
            <Link
              href={animeHref.bleach()}
              className={`${styles.world} ${styles.bleach}`}
            >
              <span className={styles.riftArt} aria-hidden>
                {/* Aynı kare iki kez: her yarı kendi clip-path'iyle duruyor
                    ve hover'da ters yönlere kayıyor. Tek görsel dosyası —
                    ikinci kopya ağdan yeniden inmiyor.

                    ⚠️ İki kopya AYNI yuvadan besleniyor ama tek bir kalemi
                    var (kartın dışında, kardeş olarak): küratör tek bir kare
                    yüklüyor, yarılmayı CSS yapıyor. */}
                {bleachArt ? (
                  <>
                    <span className={styles.riftHalf} data-side="left">
                      <Image
                        src={bleachArt.url}
                        alt=""
                        fill
                        sizes="620px"
                        style={bleachArt.style}
                      />
                    </span>
                    <span className={styles.riftHalf} data-side="right">
                      <Image
                        src={bleachArt.url}
                        alt=""
                        fill
                        sizes="620px"
                        style={bleachArt.style}
                      />
                    </span>
                  </>
                ) : null}
                <span className={styles.riftSeam} />
              </span>

              {/* Kanji rozeti — Akatsuki kartındaki `.kanji` deseninin
                  aynısı ve bilinçli olarak aynısı: hub'ın kart dili tek
                  olmalı, ayrımı yapan şey yarılma. 卍 sayfanın da tek
                  büyük işareti (Bankai salonu aynı karakteri taşıyor). */}
              <span className={`${shell.brush} ${styles.kanji}`} aria-hidden>
                卍
              </span>

              <span className={styles.worldBody}>
                <span className={`${shell.data} ${styles.worldMeter}`}>
                  {t("worlds.bleach.meter")}
                </span>
                {/* Özel ad — TR büyütme "BLEACH" üzerinde sorun üretmiyor
                    ama kural gereği `lang` yazılı: İngilizce bir ad. */}
                <span
                  lang="en"
                  className={`${shell.display} ${styles.worldName}`}
                >
                  {t("worlds.bleach.title")}
                </span>
                <span className={styles.worldTagline}>
                  {t("worlds.bleach.tagline")}
                </span>
                <span className={`${shell.data} ${styles.worldEnter}`}>
                  {t("worlds.enter")}
                </span>
              </span>
            </Link>
            <HallSlotPen slotId="anime:world:bleach" />
          </li>

          {/* Slam Dunk Evreni — üçüncü evren kapısı (28 Ağustos 2026).
              ⚠️ Kart 29 Ağustos 2026'ya kadar GÖRSELSİZDİ ve gerekçesi
              teknikti: kareler `EXHIBIT_IMAGE_KEYS` üzerinden, yani
              Pain'in karakter kaydından geliyordu ve oraya Slam Dunk için
              bir kare koymanın makul bir yolu yoktu. Kullanıcı bildirimi
              tam olarak buydu ("onun resmi yok"). Yuva artık `anime/hall`
              yüzeyinde ve kart da diğerleri gibi doldurulabiliyor. */}
          <li className={styles.worldItem}>
            <Link href={animeHref.slamDunk()} className={styles.world}>
              <HallArt
                slotId="anime:world:slamdunk"
                className={styles.worldArt}
                sizes="620px"
              />
              {/* Kanji rozeti: Akatsuki ve Bleach kartlarındaki `.kanji`
                  deseni. 湘北 = Shohoku, sayfanın da açılış işareti. */}
              <span className={`${shell.brush} ${styles.kanji}`} aria-hidden>
                湘北
              </span>

              <span className={styles.worldBody}>
                <span className={`${shell.data} ${styles.worldMeter}`}>
                  {t("worlds.slamdunk.meter")}
                </span>
                {/* Özel ad — İngilizce, TR büyütmesi bozmasın diye `lang` */}
                <span
                  lang="en"
                  className={`${shell.display} ${styles.worldName}`}
                >
                  {t("worlds.slamdunk.title")}
                </span>
                <span className={styles.worldTagline}>
                  {t("worlds.slamdunk.tagline")}
                </span>
                <span className={`${shell.data} ${styles.worldEnter}`}>
                  {t("worlds.enter")}
                </span>
              </span>
            </Link>
            <HallSlotPen slotId="anime:world:slamdunk" />
          </li>

          {/* Jujutsu Kaisen Evreni — dördüncü evren kapısı (30 Ağustos 2026).
              Bleach'in "İnşa hâlinde" kararının aynısı: sayfa yapım
              aşamasında ama kart bugünden duruyor, ölçü bunu açıkça
              söylüyor. Kanji rozeti 呪 — sayfanın da açılış işareti. */}
          <li className={styles.worldItem}>
            <Link href={animeHref.jjk()} className={styles.world}>
              <HallArt
                slotId="anime:world:jjk"
                className={styles.worldArt}
                sizes="620px"
              />
              <span className={`${shell.brush} ${styles.kanji}`} aria-hidden>
                呪
              </span>

              <span className={styles.worldBody}>
                <span className={`${shell.data} ${styles.worldMeter}`}>
                  {t("worlds.jjk.meter")}
                </span>
                {/* Özel ad — İngilizce, TR büyütmesi bozmasın diye `lang` */}
                <span
                  lang="en"
                  className={`${shell.display} ${styles.worldName}`}
                >
                  {t("worlds.jjk.title")}
                </span>
                <span className={styles.worldTagline}>
                  {t("worlds.jjk.tagline")}
                </span>
                <span className={`${shell.data} ${styles.worldEnter}`}>
                  {t("worlds.enter")}
                </span>
              </span>
            </Link>
            <HallSlotPen slotId="anime:world:jjk" />
          </li>

          {onePiece ? (
            <li className={styles.worldItem}>
              <Link
                href={animeHref.series(onePiece.slug)}
                className={styles.world}
              >
                <HallArt
                  slotId="anime:world:onepiece"
                  className={styles.worldArt}
                  sizes="620px"
                />
                <span className={styles.worldBody}>
                  {/* "One Piece" TR büyütmede "ONE PİECE" olurdu — özel ad */}
                  <span className={`${shell.display} ${styles.worldName}`}>
                    {t("worlds.onepiece.title")}
                  </span>
                  <span className={styles.worldTagline}>
                    {t("worlds.onepiece.tagline")}
                  </span>
                  <span className={`${shell.data} ${styles.worldEnter}`}>
                    {t("worlds.enter")}
                  </span>
                </span>
              </Link>
              <HallSlotPen slotId="anime:world:onepiece" />
            </li>
          ) : null}

          <li className={styles.worldItem}>
            <Link href={animeHref.archive()} className={styles.world}>
              <HallArt
                slotId="anime:world:archive"
                fallbackUrl={archiveArt ? apiUrl(archiveArt.url) : null}
                className={styles.worldArt}
                sizes="620px"
              />
              <span className={styles.worldBody}>
                <span className={`${shell.display} ${styles.worldName}`}>
                  {t("worlds.archive.title")}
                </span>
                <span className={styles.worldTagline}>
                  {t("worlds.archive.tagline")}
                </span>
                <span className={`${shell.data} ${styles.worldEnter}`}>
                  {archiveMeter}
                </span>
              </span>
            </Link>
            <HallSlotPen slotId="anime:world:archive" />
          </li>
        </ul>
      </section>
    </div>
    </CuratorFrame>
  );
}
