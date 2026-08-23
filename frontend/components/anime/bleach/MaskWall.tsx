import { getTranslations } from "next-intl/server";
import { MASK_WALL } from "@/lib/anime/bleach/masks";
import { READY_SECTIONS } from "@/lib/anime/bleach/worlds";
import { pick } from "@/lib/anime/bleach/types";
import { eye, mouth } from "./HollowMask";
import { FRAGMENTS } from "./MaskFragment";
import styles from "./MaskWall.module.css";
import world from "./world.module.css";

/**
 * P11 · MASKELER — DUVAR.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Bleach denince akla maske gelir. Bu bölüm bir kadro değil bir **duvar**:
 * bir çizgiye asılmış sekiz maske, altlarında kısa gölgeler.
 *
 * ── ⚠️ ÜÇÜNCÜ BİR MASKE GRAMERİ İCAT EDİLMEDİ ────────────────────────────
 * P07 yedi maske durumu, P08 on maske parçası çizdi. Buradaki sekiz maske
 * **aynı ilkellerden** kuruluyor: `eye()` ve `mouth()` doğrudan
 * `HollowMask`tan, Ulquiorra ile Grimmjow'un kalıntıları ise
 * `MaskFragment`taki path'lerin TA KENDİSİ. Aynı kalıntıyı iki bölümde
 * iki farklı biçimde çizmek, P07'nin "kalan parça kimin ne olduğunu
 * söyler" cümlesini yalanlardı.
 *
 * Hepsi tek parça `d` + `fill-rule="evenodd"`: göz ve ağız ayrı renkli
 * parçalar değil, aynı yolun içinde açılan oyuklar (gerekçesi
 * `HollowMask` başlığında).
 *
 * ── SIFIR JS ─────────────────────────────────────────────────────────────
 * Sallanma ve dolgu CSS hover/odak; bağlantılar düz `<a>`. Tek satır
 * istemci kodu yok.
 *
 * ── ⚠️ AD HOVER'DA BELİRMİYOR, HEP DURUYOR ───────────────────────────────
 * Brief adı hover'da açıyor. Duvarda sekiz maske var ve hangisinin kim
 * olduğunu öğrenmek için hepsinin üstünden geçmek gerekirdi — dokunmatikte
 * ise hiç öğrenilemezdi (`BankaiHall` dersi). Ad hep görünür, hover/odak
 * onu ve maskeyi yalnızca **parlatıyor**. Yer ayrılmış: CLS = 0.
 *
 * ── BAĞLANTI YALNIZCA HEDEF VARSA ────────────────────────────────────────
 * Üç maskenin sayfa içinde gerçek bir karşılığı var (#espada); kalan beşi
 * bağlantısız duruyor. Ölü çapa çizmek, olmayan bir bağlantıdan kötüdür —
 * sayfanın her yerinde aynı kural (`READY_SECTIONS`).
 */

/* ══════════════════════════════════════════════════════════════════
   SEKİZ MASKE — hepsi 0 0 120 120 kadrajında, tek `d`
   ══════════════════════════════════════════════════════════════════ */

/** Tehditkâr bir kafatası; SOL yanında üç şerit (canon: sayıları arttı) */
const ICHIGO =
  "M60 6c28 0 44 20 44 50 0 34-20 58-44 58S16 90 16 56 32 6 60 6Z" +
  eye(40, 48, 24, 12, 1) +
  eye(80, 48, 24, 12, -1) +
  mouth(28, 92, 76, 98, 6) +
  /* Şeritler alında, gözlerin ÜSTÜNDE: oyuklarla çakışsalardı
     `evenodd` onları tekrar doldurup lekeye çevirirdi. */
  "M24 22h6l-2 16h-6ZM34 16h6l-2 22h-6ZM44 13h5l-2 25h-5Z";

/** Firavun maskesi; ensesinde kısa başlık, dar yatay göz yarıkları */
const SHINJI =
  "M60 6c18 0 30 10 32 26l6 46-14 40H36L22 78l6-46C30 16 42 6 60 6Z" +
  "M30 44h24v7H30ZM66 44h24v7H66Z" +
  mouth(34, 86, 74, 92, 5) +
  "M22 78 8 96l16 6ZM98 78l14 18-16 6Z";

/** Düz hokey maskesi: iki sütun hâlinde altı yarık göz + yan uzantılar */
const KENSEI =
  "M60 8c24 0 38 14 38 42 0 32-16 58-38 58S22 82 22 50 36 8 60 8Z" +
  "M34 36h12v7H34ZM34 48h12v7H34ZM34 60h12v7H34Z" +
  "M74 36h12v7H74ZM74 48h12v7H74ZM74 60h12v7H74Z" +
  "M22 34 6 30l16 8ZM22 50 4 50l18 6ZM22 66 8 72l14 2Z" +
  "M98 34l16-4-16 8ZM98 50l18 0-18 6ZM98 66l14 6-14 2Z";

/** İskelet; alnın ORTASINDA tek boynuz, kaşların üstünde baklava dizisi */
const HIYORI =
  "M60 2 52 26h16Z" +
  "M60 22c22 0 34 16 34 42 0 30-16 52-34 52S26 94 26 64 38 22 60 22Z" +
  eye(44, 62, 20, 12, 1) +
  eye(76, 62, 20, 12, -1) +
  "M38 40l5 5-5 5-5-5ZM50 38l5 5-5 5-5-5ZM60 37l5 5-5 5-5-5ZM70 38l5 5-5 5-5-5ZM82 40l5 5-5 5-5-5Z" +
  mouth(34, 86, 84, 100, 5);

/**
 * Çizgi film kafatası; SOL yanında çatlak ve KIRILMIŞ DÖRT DİŞ.
 *
 * ⚠️ Ağız burada `mouth()` ile üretilmiyor: yardımcı dişleri eşit dağıtıyor
 * ve Nelliel'in maskesinin ayırt edici yanı tam olarak dişlerin SOL YARIDA
 * OLMAMASI. Bant elle yazılıp dişler yalnızca sağ yarıya konuldu.
 */
const NELLIEL =
  "M60 12c24 0 38 16 38 40 0 28-17 46-38 46S22 80 22 52 36 12 60 12Z" +
  eye(44, 50, 20, 12, 1) +
  eye(76, 50, 20, 12, -1) +
  "M34 72H86V90H34Z" +
  "M60 90l4.5-18L69 90ZM69 90l4.5-18L78 90ZM78 90l4.5-18L87 90Z" +
  "M28 22l4 1-5 12 4 2-6 12 5 2-4 10-4-1 4-10-5-2 6-12-4-2Z";

/** İşaretsiz Hollow kafatası — adı olmayanlar */
const NAMELESS =
  "M60 10c25 0 39 17 39 42 0 30-18 50-39 50S21 82 21 52 35 10 60 10Z" +
  eye(43, 50, 22, 13, 1) +
  eye(77, 50, 22, 13, -1) +
  mouth(32, 88, 74, 94, 7);

const MASK_PATHS: Record<string, string> = {
  ichigo: ICHIGO,
  shinji: SHINJI,
  kensei: KENSEI,
  hiyori: HIYORI,
  /* ⚠️ Yeniden çizilmedi, ithal edildi. */
  ulquiorra: FRAGMENTS.helm,
  grimmjow: FRAGMENTS["jaw-right"],
  nelliel: NELLIEL,
  nameless: NAMELESS,
};

/**
 * İTHAL EDİLEN İKİ KALINTININ ÇERÇEVELENMESİ.
 *
 * ⚠️ Path'ler YENİDEN ÇİZİLMEDİ, yalnızca yerleri düzeltildi. P08'de bu
 * iki parça dev bir rakamın üstüne biniyordu ve ona göre konumlanmıştı:
 * ölçüldüğünde Ulquiorra'nın boynuzu kadrajın 8 birim dışında kalıyor
 * (kırpılıyor), Grimmjow'un çenesi ise sağa yaslı duruyordu. Duvarda
 * hepsi aynı kutuda ortalanmalı.
 *
 * Çözüm bir `transform`: aynı çizim, farklı çerçeve. Yeniden çizmek
 * "aynı kalıntı iki bölümde aynı biçimde" kuralını kırardı.
 */
const MASK_FRAMES: Record<string, string> = {
  ulquiorra: "translate(6 14)",
  grimmjow: "translate(-28 10)",
};

export async function MaskWall({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.bleach.masks" });

  return (
    <section
      id="masks"
      /* Nötr: duvar bir dünyaya ait değil, hepsinin sınırında duruyor
         (brief). Deri sayfanın tabanı. */
      className={`${styles.section} ${world.deferPaint}`}
      aria-labelledby="masks-title"
    >
      <div className={styles.head}>
        <p className={world.eyebrow} lang="en">
          {t("eyebrow")}
        </p>
        <h2 id="masks-title" className={world.section}>
          {t("title")}
        </h2>
        <p className={`${world.body} ${styles.lede}`}>{t("lede")}</p>
      </div>

      {/* Asıldıkları çizgi. Duvarın tamamı bunun altında sallanıyor. */}
      <div className={styles.wall}>
        <span className={styles.rod} aria-hidden="true" />

        <ul className={styles.hooks} aria-label={t("wallAria")}>
          {MASK_WALL.map((mask) => {
            const linked =
              mask.anchor && READY_SECTIONS.has(mask.anchor.slice(1));
            const label = mask.owner ?? t("namelessTitle");

            const figure = (
              <>
                <span className={styles.string} aria-hidden="true" />
                <span className={styles.maskBox}>
                  <svg
                    className={styles.mask}
                    viewBox="0 0 120 120"
                    aria-hidden="true"
                    role="presentation"
                  >
                    <path
                      d={MASK_PATHS[mask.id]}
                      fillRule="evenodd"
                      transform={MASK_FRAMES[mask.id]}
                    />
                  </svg>
                  <span className={styles.shadow} aria-hidden="true" />
                </span>
                <span className={styles.plate}>
                  {mask.kanji ? (
                    <span className={styles.plateKanji} lang="ja">
                      {mask.kanji}
                    </span>
                  ) : null}
                  <span className={styles.plateName}>{label}</span>
                  {/* ⚠️ İç sarmalayıcı ŞART: `grid-template-rows: 0fr`
                      ile kapanma ancak taşması kırpılabilen bir ÖĞE
                      varsa çalışıyor; çıplak metin düğümü anonim bir
                      ızgara öğesi oluyor ve ona sınıf yazılamıyor. */}
                  <span className={styles.plateNote}>
                    <span>{pick(mask.note, locale)}</span>
                  </span>
                </span>
              </>
            );

            return (
              <li
                key={mask.id}
                className={styles.hook}
                data-nameless={mask.owner === null ? "" : undefined}
              >
                {linked && mask.anchor ? (
                  <a className={styles.link} href={mask.anchor}>
                    {figure}
                  </a>
                ) : (
                  /* Hedefi olmayan maske bağlantı DEĞİL: tıklanınca
                     hiçbir yere gitmeyen bir bağlantı, bağlantı olmayan
                     bir şeyden kötüdür. */
                  <div className={styles.link}>{figure}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
