import {
  nameLangOf,
  type FavouritePlayer,
  type PlayerVoice,
} from "@/lib/sport/favourite-players";
import { PlayerImage } from "./PlayerImage";
import styles from "./PlayerHero.module.css";

/**
 * ══════════════════════════════════════════════════════════════════════════
 * DEV ADIN İKİ ÖLÇÜSÜ — 21 Ağustos 2026'da ÖLÇÜLMÜŞ İKİ ARIZANIN KAPISI
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Ad iki satır: ilk satır ön ad, ikinci satır soyad. Her ikisi de dev
 * puntoda. Kullanıcı dört sayfada birden aynı iki arızayı bildirdi:
 *
 *   ① KELİME ORTASINDAN KIRILMA
 *     "FERNANDO" sığmayınca FERNAND / O diye ikiye bölünüyordu (Muslera).
 *     Aynısı MONDR / AGÓN ve KORKM / AZ. Sebep `.name` üzerindeki
 *     `overflow-wrap: anywhere`: sığmayan kelimeyi HER YERDEN kırma izni.
 *     O kural Türkçe uzun kelimeler (BEŞİKTAŞ, KONYASPOR) için doğruydu ama
 *     ÖZEL AD için hiçbir zaman doğru değil — bir isim kırılmaz, küçülür.
 *
 *   ② SATIRLARIN ÜST ÜSTE BİNMESİ
 *     "SELÇUK / İNAN" ve "DAVINSON / SÁNCHEZ" çakışıyordu. Sebep
 *     `line-height: 0.86`: poster sıkılığı için bilinçli seçilmişti ve düz
 *     büyük harfte doğru duruyor. Ama Ç'nin çengeli TABANIN ALTINA, İ'nin
 *     noktası ve Á'nın aksanı BÜYÜK HARF BOYUNUN ÜSTÜNE taşıyor; ikisi
 *     arka arkaya gelince satırlar birbirine giriyor.
 *
 * ── ÇÖZÜM: İKİSİ DE ÖLÇÜLÜP VERİYE ÇEVRİLDİ ──────────────────────────────
 * Tahmin yok: dört yazı ailesinin GERÇEK dosyaları tarayıcıda
 * `canvas.measureText` ile ölçüldü (21 Ağustos 2026, 700 ağırlık).
 *
 * ── İŞ BÖLÜMÜ ────────────────────────────────────────────────────────────
 *   GENİŞLİK  → CSS'te. Harf başına ne kadar yer gerektiği yazı AİLESİNE
 *               bağlı, ada değil; o yüzden pay ailenin tanımlandığı yerde
 *               duruyor: `page.module.css`, `--advance`, her `--display`
 *               atamasının hemen yanında. Ölçüm notu da orada.
 *   YÜKSEKLİK → BURADA (`INK` + `satirAraligi`). Gereken satır aralığı ADA
 *               bağlı — hangi harfin taban altına, hangisinin büyük harf
 *               boyunun üstüne taştığına — yani kayıt başına hesaplanmalı ve
 *               CSS bunu bilemez.
 *
 * Bileşenin CSS'e verdiği iki değişken bundan çıkıyor: `--name-len` (en uzun
 * kelimenin harf sayısı) ve `--name-lh` (o ada gereken satır aralığı).
 *
 * ⚠️ YAZI AİLESİNİ DEĞİŞTİRİRSEN İKİ TARAFI DA YENİDEN ÖLÇ.
 */

/**
 * Dikey mürekkep sınırları (em, taban çizgisine göre).
 *   cap  düz büyük harfin tepesi        (FERNANDO)
 *   tall aksanlı/noktalı harfin tepesi  (Á, Ó, İ, Ğ, Ü)
 *   base düz harfin tabanı              (ihmal edilebilir)
 *   deep çengelli harfin dibi           (Ç, Ş)
 */
const INK: Record<PlayerVoice, { cap: number; tall: number; base: number; deep: number }> = {
  poster: { cap: 0.89, tall: 1.13, base: 0.03, deep: 0.33 },
  condensed: { cap: 0.73, tall: 0.89, base: 0.03, deep: 0.17 },
  monument: { cap: 0.72, tall: 0.95, base: 0.02, deep: 0.22 },
  editorial: { cap: 0.66, tall: 0.9, base: 0.02, deep: 0.27 },
};

/** Büyük harf boyunun ÜSTÜNE taşan harfler: nokta, aksan, kısa çizgi. */
const YUKARI_TASAN = /[İÍÌÎÏÁÀÂÄÃÅÉÈÊËÓÒÔÖÕÚÙÛÜÑŃŠŚŽŹŻĞĈČĆŐŰÝŸ]/;

/** Taban çizgisinin ALTINA taşan büyük harfler: çengel ve kuyruk. */
const ASAGI_TASAN = /[ÇŞĢĶĻŅŖQJ]/;

/**
 * Adın en uzun KELİMESİ. Boşluk normal yerden kırılabildiği için ölçü
 * bütün dize değil kelime: "BARIŞ ALPER" gerekirse iki satır olur ve bu
 * doğrudur; kırılmaması gereken şey kelimenin KENDİSİ.
 */
function enUzunKelime(...parcalar: string[]): number {
  return Math.max(
    1,
    ...parcalar.flatMap((p) => p.split(/\s+/).map((w) => w.length)),
  );
}

/**
 * İki satırın taban çizgileri arasında gereken en küçük mesafe (em).
 *
 * Üst satırın en derin harfi ile alt satırın en yüksek harfi çakışmamalı.
 * Sonuç 0.86'nın (özgün poster sıkılığı) altına inmiyor: düz bir adda
 * kompozisyon hiç değişmiyor, yalnızca gerçekten taşan adlar nefes alıyor.
 */
function satirAraligi(voice: PlayerVoice, ust: string, alt: string): number {
  const ink = INK[voice];
  const dip = ASAGI_TASAN.test(ust) ? ink.deep : ink.base;
  const tepe = YUKARI_TASAN.test(alt) ? ink.tall : ink.cap;
  return Math.max(0.86, Number((dip + tepe + 0.02).toFixed(3)));
}

/**
 * FUTBOLCU HERO'SU.
 *
 * ── HUB HERO'SUNDAN NEDEN AYRI ───────────────────────────────────────────
 * Önceki sürümde bu sayfa `/spor/futbol` hero'sunun aynı stadyum plakasını
 * kullanıyordu; iki sayfa aynı geceye bakıyordu ve profil sayfası hub'ın
 * devamı gibi duruyordu. Buradaki kompozisyon PAYLAŞILAN hiçbir görsel
 * kullanmıyor — taşıyıcı öğe oyuncunun kendi karesi, arka plan ise formanın
 * geometrisinden çıkarılmış bir işaret.
 *
 * ── GÖRSEL İMZA: SASH ────────────────────────────────────────────────────
 * Galatasaray forması dikey değil ÇAPRAZ bölünür (sarı yarı / kırmızı yarı).
 * Sayfanın imzası o bölünme: kadrajı çapraz kesen bir bant, sarıdan kırmızıya
 * geçiyor ve fotoğrafın arkasından çıkıyor. Bir "dekoratif şerit" değil,
 * kulübün kendi geometrisi — ve `--accent` / `--warm` üzerinden çalıştığı
 * için başka bir kulübün oyuncusu eklendiğinde onun renklerini giyiyor.
 *
 * ── FORMA NUMARASI ───────────────────────────────────────────────────────
 * "9" bir rozet değil, kompozisyonun zemin katmanı: kadrajın sağ altından
 * taşan, yalnızca konturu çizilmiş dev bir rakam. `aria-hidden` — ekran
 * okuyucu için künye şeridinde zaten yazıyor.
 *
 * ── TAŞMA GÜVENLİĞİ ──────────────────────────────────────────────────────
 * Hem sash hem rakam kadrajın dışına taşıyor; `.hero` üzerinde
 * `overflow: hidden` var, yani hiçbiri yatay kaydırma üretmiyor. Mobilde
 * ikisi de yeniden konumlanıyor (aşağıdaki media sorgusu) — küçültülmüş
 * masaüstü değil, kendi düzeni.
 */
export function PlayerHero({
  player,
  labels,
}: {
  player: FavouritePlayer;
  /** `crumb` yalnızca ETİKET; futbolcunun adı bileşende ekleniyor. */
  labels: { scroll: string; crumb: string };
}) {
  const voice = player.design.voice;

  return (
    <header
      className={styles.hero}
      style={
        {
          /* Adın sığması için gereken iki ölçü. CSS bunları okuyup punto ve
             satır yüksekliğini kuruyor — gerekçe dosyanın başında. */
          "--name-len": enUzunKelime(player.firstName, player.lastName),
          "--name-lh": satirAraligi(voice, player.firstName, player.lastName),
        } as React.CSSProperties
      }
    >
      {/* ── Zemin katmanları ── */}
      <div className={styles.field} aria-hidden="true" />
      <div className={styles.sash} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <span className={styles.jersey} aria-hidden="true">
        {player.shirt ?? ""}
      </span>

      {/* ── Üst şerit: arma + kırıntı ── */}
      <div className={styles.top}>
        {/* ⚠️ `aria-hidden` YOK ve olmayacak. Kap küratör modunda içine
            odaklanabilir bir düzenle düğmesi alıyor (`PlayerImage` →
            `SlotEditor`); `aria-hidden="true"` bir kapta odaklanabilir öğe
            bırakmak erişilebilirlik ağacında var olmayan bir düğmeye klavye
            odağı vermek demek. Görsel zaten `decorative` ile `alt=""`
            basılıyor, yani ekran okuyucuya fazladan bir şey söylenmiyor. */}
        <span className={styles.crest}>
          <PlayerImage
            slot={player.stats.club.crest}
            fit="contain"
            decorative
          />
        </span>
        {/* Kırıntı CSS'te büyütülüyor ve içinde futbolcunun adı geçiyor;
            ad kendi dilinin kuralıyla büyümeli (bkz. `nameLangOf`). Etiket
            ile ad ayrı `span`ler çünkü `lang` yalnızca ADA ait — etiket
            sayfanın dilinde kalıyor. */}
        <span className={styles.crumb}>
          {labels.crumb}
          <span lang={nameLangOf(player)}>{player.name}</span>
        </span>
      </div>

      {/* ── Fotoğraf ── */}
      <div className={styles.portrait}>
        <PlayerImage
          slot={player.hero}
          eager
          position="50% 22%"
          className={styles.portraitImage}
        />
        <span className={styles.portraitFade} aria-hidden="true" />
      </div>

      {/* ── Metin ── */}
      <div className={styles.body}>
        <p className={styles.kicker}>
          <span className={styles.kickerLine} aria-hidden="true" />
          {player.badges.join(" · ")}
        </p>

        {/* Ön ad ve soyad DEFTERDE zaten büyük harfle yazılı, yani burada
            `lang` bir şey değiştirmiyor; yine de yazılı, çünkü bir gün
            defterde normal yazımlı bir ad görünürse (ya da `data-voice`
            editoryal olduğu için büyütme kapalıyken) doğru davranış
            kendiliğinden gelsin. */}
        <h1
          className={styles.name}
          lang={nameLangOf(player)}
          aria-label={player.name}
        >
          <span>{player.firstName}</span>
          <em>{player.lastName}</em>
        </h1>

        <p className={styles.role}>
          <span>{player.birthPlace}</span>
          <i aria-hidden="true" />
          <span>{player.height}</span>
          <i aria-hidden="true" />
          <span>{player.club}</span>
        </p>

        <blockquote className={styles.quote}>{player.quote}</blockquote>

        <dl className={styles.vitals}>
          {player.vitals.map((vital) => (
            <div key={vital.label}>
              <dt>{vital.label}</dt>
              <dd>{vital.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <span className={styles.scroll} aria-hidden="true">
        {labels.scroll}
      </span>
    </header>
  );
}
