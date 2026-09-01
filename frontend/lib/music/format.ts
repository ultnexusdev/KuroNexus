/**
 * Süre etiketinin tek kaynağı.
 *
 * Beş müzik sayfası bu işi kendi içinde yapıyordu ve METİN GÖMÜLÜYDÜ:
 * `` `${hours} sa ${minutes} dk` ``. Yani İngilizce sayfalarda süre Türkçe
 * görünüyordu — kullanıcıya görünen bir dil hatası. Üstüne beşincisi
 * (`muzik/dinleme`) farklı bir biçim kullanıyordu (`2s 05d`), yani aynı sitede
 * iki ayrı süre gösterimi vardı (1 Eylül 2026 denetimi, bulgu H-F1).
 *
 * Biçim artık sözlükte: `music.duration.hoursMinutes` / `music.duration.minutes`.
 * Sıralamayı dilin kendisi belirleyebiliyor, kod karışmıyor.
 *
 * `null` döner (boş dize değil): çağıran "süre yok" durumunu kendi bağlamına
 * göre çizsin — bazı sayfalar hiç yazmıyor, bazıları ayraçla ekliyor.
 */
type Translate = (
  key: string,
  values?: Record<string, string | number>,
) => string;

export function formatDuration(
  ms: number | null | undefined,
  t: Translate,
): string | null {
  if (!ms || ms <= 0) {
    return null;
  }
  const totalMinutes = Math.round(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0
    ? t("duration.hoursMinutes", { hours, minutes })
    : t("duration.minutes", { minutes });
}

/**
 * Dinleme kaydının kompakt biçimi ("61s 24d").
 *
 * Uzun biçimden AYRI tutuluyor çünkü bu bir tasarım kararı: sayfadaki sayaç
 * dar bir sütunda duruyor ve dakika iki haneye sabitleniyor ki alt alta gelen
 * satırlar kaymasın. Kaynak dosyadaki yorum bunu zaten belgeliyordu; denetimde
 * "iki farklı süre biçimi" diye işaretlense de biçim korundu, i18n'e taşınan
 * yalnızca HARFLER oldu (İngilizcede "s/d" değil "h/m").
 */
export function formatDurationCompact(
  ms: number | null | undefined,
  t: Translate,
): string {
  if (!ms || ms <= 0) {
    return t("duration.minutesCompact", { minutes: 0 });
  }
  const totalMinutes = Math.round(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0
    ? t("duration.hoursMinutesCompact", {
        hours,
        minutes: String(minutes).padStart(2, "0"),
      })
    : t("duration.minutesCompact", { minutes });
}
