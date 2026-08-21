/**
 * Naruto Evreni — tek giriş noktası.
 *
 * Kayıt dört alana bölündü (coğrafya / insan / güç / tarih), çünkü tek
 * dosyada ~900 satır oluyordu ve bir bölümü düzenlemek diffi okunmaz hâle
 * getiriyordu — futbolcu defterindeki (`lib/sport/players/`) bölme kararının
 * aynısı. Çağıranlar bu dosyadan okur, alan dosyaları yer değiştirirse
 * yalnızca burası değişir.
 */
export * from "./types";
export * from "./geography";
export * from "./people";
export * from "./power";
export * from "./history";
export * from "./images";
