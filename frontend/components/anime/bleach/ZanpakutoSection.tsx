import { getTranslations } from "next-intl/server";
import { ZanpakutoArchive } from "./ZanpakutoArchive";

/**
 * `ZanpakutoArchive`in SUNUCU sarmalayıcısı — `Gotei13Section` ile aynı
 * desen ve aynı gerekçe: istemci bileşenleri `getTranslations` çağıramaz,
 * etiketler burada çözülüp aşağı iniyor. Sözlüğün tamamı değil, kullanılan
 * on iki dize geçiyor.
 */
export async function ZanpakutoSection({ locale }: { locale: string }) {
  const t = await getTranslations({
    locale,
    namespace: "anime.bleach.zanpakuto",
  });

  return (
    <ZanpakutoArchive
      locale={locale}
      labels={{
        eyebrow: t("eyebrow"),
        title: t("title"),
        lede: t("lede"),
        command: t("command"),
        noCommand: t("noCommand"),
        unnamed: t("unnamed"),
        stages: {
          sealed: t("stages.sealed"),
          shikai: t("stages.shikai"),
          bankai: t("stages.bankai"),
          true: t("stages.true"),
        },
        enterInner: t("enterInner"),
        back: t("back"),
        innerAria: t("innerAria"),
        stripAria: t("stripAria"),
      }}
    />
  );
}
