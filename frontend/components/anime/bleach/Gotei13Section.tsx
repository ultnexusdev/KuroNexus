import { getTranslations } from "next-intl/server";
import { DIVISIONS, hasSecondCaptain } from "@/lib/anime/bleach/divisions";
import { gateSlotId, gateTybwSlotId } from "@/lib/anime/bleach/slots";
import { CuratedImage, CuratedSlotPen } from "./CuratedImage";
import { Gotei13 } from "./Gotei13";

/**
 * `Gotei13`in SUNUCU sarmalayıcısı.
 *
 * Neden ayrı dosya: `Gotei13` bir istemci bileşeni (kapı açma, zaman kipi,
 * klavye gezinmesi) ve istemci bileşenleri `getTranslations` çağıramaz.
 * Etiketler burada sunucuda çözülüp aşağı prop olarak iniyor.
 *
 * ⚠️ Sözlüğün TAMAMI değil, on beş etiket iniyor. `useTranslations`
 * istemcide de çalışırdı ama o zaman bölümün ad alanı istemci paketine
 * girerdi; burada yalnızca kullanılan dizeler geçiyor.
 */
export async function Gotei13Section({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.bleach.gotei" });

  /**
   * ── ⚠️ KAPTAN KARELERİ BURADA ÇİZİLİYOR ────────────────────────────────
   * `bleach:gotei:1…13` yuvaları manifestoda ilk günden tanımlıydı ama
   * SAYFADA HİÇ ÇİZİLMİYORDU: küratör Yamamoto'yu ve Suì-Fēng'i yükledi,
   * ikisi de veritabanına yazıldı ve on üç kapının hiçbirinde görünmedi
   * (kullanıcı bildirimi + canlı API okuması, 27 Ağustos 2026).
   *
   * `CuratedImage` bir SUNUCU bileşeni, `Gotei13` ise istemci. Sunucu
   * bileşenini istemciye import etmek derlemeyi durduruyor; React'in izin
   * verdiği yol onu **prop olarak** geçirmek — `BankaiSection` ile birebir
   * aynı desen ve aynı gerekçe.
   *
   * ⚠️ `noEdit` zorunlu: kapı bir `<button>` ve içine ikinci bir `<button>`
   * (kalem) koymak geçersiz HTML olurdu. Kalem bu yüzden ayrı geliyor —
   * `pens`, kapının KARDEŞİ olarak çiziliyor.
   *
   * ── ⚠️ İKİ ZAMAN KİPİ, İKİ KARE ────────────────────────────────────────
   * Sekiz bölükte kaptan değişiyor (1, 3, 4, 5, 7, 8, 9, 13). Anahtar adı
   * zaten değiştiriyordu ama kare sabit kalıyordu: Kyōraku'nun kapısında
   * Yamamoto'nun fotoğrafı duruyordu. İkinci dizi bu yüzden var.
   *
   * ⚠️ Kaptanı değişmeyen beş bölükte ikinci dizinin karşılığı `null` —
   * boş bir kopya DEĞİL. Aynı yuvayı ikinci kez çizmek, anahtar her
   * çevrildiğinde React'e aynı görseli söktürüp yeniden taktırırdı:
   * değişmemesi gereken kare gözle görülür biçimde yanıp sönerdi.
   */
  const art = DIVISIONS.map((division) => (
    <CuratedImage
      key={division.n}
      slotId={gateSlotId(division.n)}
      fill
      decorative
      noEdit
      sizes="160px"
    />
  ));

  const pens = DIVISIONS.map((division) => (
    <CuratedSlotPen key={division.n} slotId={gateSlotId(division.n)} />
  ));

  /** Kaptanı değişen bölüklerin TYBW karesi; değişmeyenlerde `null` */
  const artTybw = DIVISIONS.map((division) =>
    hasSecondCaptain(division) ? (
      <CuratedImage
        key={`${division.n}-tybw`}
        slotId={gateTybwSlotId(division.n)}
        fill
        decorative
        noEdit
        sizes="160px"
      />
    ) : null,
  );

  const pensTybw = DIVISIONS.map((division) =>
    hasSecondCaptain(division) ? (
      <CuratedSlotPen
        key={`${division.n}-tybw`}
        slotId={gateTybwSlotId(division.n)}
      />
    ) : null,
  );

  return (
    <Gotei13
      locale={locale}
      art={art}
      artTybw={artTybw}
      pens={pens}
      pensTybw={pensTybw}
      labels={{
        eyebrow: t("eyebrow"),
        title: t("title"),
        lede: t("lede"),
        eraClassic: t("eraClassic"),
        eraTybw: t("eraTybw"),
        eraAria: t("eraAria"),
        gatesAria: t("gatesAria"),
        captain: t("captain"),
        lieutenant: t("lieutenant"),
        zanpakuto: t("zanpakuto"),
        bankai: t("bankai"),
        specialty: t("specialty"),
        flower: t("flower"),
        unknown: t("unknown"),
        close: t("close"),
        center: t("center"),
        /**
         * Ekran okuyucuya giden ad: on üç kapının hepsi yalnızca "kapı"
         * diye duyulmasın.
         *
         * ⚠️ İŞLEV DEĞİL, HAZIR DİZİ. Sunucu bileşeninden istemciye işlev
         * geçirilemez (RSC sınırında serileştirilemez); on üç dize burada
         * üretilip aşağı iniyor.
         */
        gateLabels: DIVISIONS.map((d) => t("gateLabel", { n: d.n })),
      }}
    />
  );
}
