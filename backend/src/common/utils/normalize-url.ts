/**
 * Elle girilen bir adresi kullanılabilir hâle getirir.
 *
 * Küratör panellerine adres çoğu zaman şemasız yazılıyor (`imdb.com/title/…`);
 * o hâliyle `href`e konursa tarayıcı onu göreli yol sanıp site içinde arar.
 * Bu yüzden şemasız girdilere `https://` ekleniyor.
 *
 * ⚠️ `/` İLE BAŞLAYAN GİRDİYE DOKUNULMAZ — bu satır bir hatanın tamiri.
 * Fonksiyonun dört ayrı kopyası vardı (movies, shows, books, anime) ve
 * düzeltme yalnızca anime kopyasına yazılmıştı; diğer üçü `/uploads/x.jpg`
 * gibi YEREL bir yolu `https:///uploads/x.jpg`e çevirip kırıyordu. Kopyalar
 * arasında kaybolan düzeltme sınıfının ta kendisi (1 Eylül 2026 denetimi,
 * bulgu D-B6). Artık tek tanım var; bir sonraki düzeltme de tek yerde kalır.
 */
export function normalizeUrl(value: string | null | undefined): string | null {
  const trimmed = (value ?? '').trim();
  if (!trimmed) {
    return null;
  }
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
