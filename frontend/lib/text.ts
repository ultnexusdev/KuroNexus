/**
 * Metin biçimleme yardımcıları.
 */

/**
 * ÖZEL ADI büyük harfe çevirir — Türkçe kurallarına göre DEĞİL.
 *
 * ⚠️ Neden ayrı bir fonksiyon: `"Alternative Rock".toLocaleUpperCase("tr-TR")`
 * → `"ALTERNATİVE ROCK"`. Türkçede `i`nin büyüğü `İ` olduğu için sanatçı,
 * albüm ve tür adları bozuluyor (kullanıcı bildirimi, 13 Ağustos 2026:
 * *"Linkin Park hepsi büyük harfle yazıldığında LINKIN PARK olarak görünmeli,
 * özel isimler Türkçe karakterle değişmemeli"*).
 *
 * Kural: **arayüz sözcüğü mü, veri mi?**
 *   - Arayüz metni (`t("act.favorite")` → "FAVORİ SANATÇI") Türkçedir ve
 *     `toLocaleUpperCase("tr-TR")` ile büyütülür — orada `İ` DOĞRU.
 *   - Veritabanından gelen ad (sanatçı, albüm, tür, liste) özel addır ve
 *     bununla büyütülür.
 *
 * ⚠️ Aynı tuzak CSS'te de var: `text-transform: uppercase`, sayfa
 * `lang="tr"` olduğu için tarayıcıda da `i → İ` yapıyor. Veriden gelen bir ad
 * CSS ile büyütülüyorsa ya bu fonksiyonla önceden büyütülmeli (sonuç zaten
 * büyük olduğu için CSS bir şey değiştirmez) ya da o kural kaldırılmalı.
 */
export function upperProperName(value: string): string {
  // "en-US" değil "invariant" niyeti: Türkçe'ye özgü i/İ eşlemesini kapatmak.
  // Locale vermemek tarayıcının kendi diline düşerdi ve TR tarayıcıda aynı
  // hataya geri dönerdik — o yüzden locale AÇIKÇA veriliyor.
  return value.toLocaleUpperCase("en-US");
}
