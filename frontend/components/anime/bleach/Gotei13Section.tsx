import { getTranslations } from "next-intl/server";
import { DIVISIONS } from "@/lib/anime/bleach/divisions";
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

  return (
    <Gotei13
      locale={locale}
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
