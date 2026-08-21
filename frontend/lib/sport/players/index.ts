import { slotsOf, type FavouritePlayer } from "./types";

import { mauroIcardi } from "./icardi";
import { victorOsimhen } from "./osimhen";
import { leroySane } from "./sane";
import { fernandoMuslera } from "./muslera";
import { didierDrogba } from "./drogba";
import { wesleySneijder } from "./sneijder";
import { burakYilmaz } from "./burak-yilmaz";
import { ardaTuran } from "./arda-turan";
import { selcukInan } from "./selcuk-inan";
import { felipeMelo } from "./felipe-melo";
import { driesMertens } from "./dries-mertens";
import { lucasTorreira } from "./torreira";
import { milanBaros } from "./baros";
import { ugurcanCakir } from "./ugurcan-cakir";
import { abdulkerimBardakci } from "./bardakci";
import { davinsonSanchez } from "./davinson-sanchez";
import { rolandSallai } from "./sallai";
import { yunusAkgun } from "./yunus-akgun";
import { barisAlperYilmaz } from "./baris-alper";
import { metinOktay } from "./metin-oktay";
import { bulentKorkmaz } from "./bulent-korkmaz";
import { claudioTaffarel } from "./taffarel";
import { farydMondragon } from "./mondragon";
import { gheorgheHagi } from "./hagi";

/**
 * FUTBOLCU DEFTERİNİN KAYIT LİSTESİ.
 *
 * ── SIRA TASARIMIN PARÇASI ───────────────────────────────────────────────
 * Hub sayfasındaki favori futbolcu rayı (`PlayerRail`) bu diziyi olduğu gibi
 * basıyor ve İLK kart çift genişlikte çiziliyor. Yani buradaki ilk kayıt
 * şeridin açılış kartı oluyor — alfabetik değil KÜRATÖR sırası.
 *
 * Icardi başta çünkü fotoğrafları yüklenmiş tek kayıt o; ray boş bir kareyle
 * değil dolu bir posterle açılıyor. Sonrası kabaca dönem ve rol: bugünün
 * kadrosu, ardından yakın geçmişin isimleri, en sonda arşiv efsaneleri.
 *
 * ── EFSANELER AYRI BİR LİSTE DEĞİL ───────────────────────────────────────
 * `legendEpithet` alanı dolu olan her kayıt efsaneler salonunda DA görünüyor
 * (`legendaryPlayers()`). Bir oyuncunun hem favori şeridinde hem salonda
 * olması kullanıcının açık kararı (20 Ağustos 2026) ve iki kart da AYNI
 * sayfaya gidiyor — `sportHref.favouritePlayer(slug)`.
 *
 * Bugün lakabı yazılı olanlar: Icardi, Muslera, Metin Oktay, Bülent Korkmaz,
 * Taffarel, Mondragón ve Hagi.
 *
 * ⚠️ HAGİ 21 AĞUSTOS 2026'DA BURAYA TAŞINDI. Daha önce yalnızca bir backend
 * kaydıydı ve sayfası `/spor/futbol/efsaneler/hagi` adresindeki "uzun belge"
 * düzenini kullanıyordu — salonun tek yabancısı. Kullanıcı diğer efsanelerle
 * aynı poster tasarımını istedi; defter kaydı bunu tek dosyayla veriyor.
 * Backend kaydı silinmedi, eski adres yeni sayfaya yönleniyor. Gerekçenin
 * tamamı `players/hagi.ts` başında.
 *
 * ── YENİ KAYIT EKLERKEN ──────────────────────────────────────────────────
 * `players/<slug>.ts` dosyasını aç, buraya import et, diziye yaz. Başka
 * hiçbir yere dokunma: rota, kart, profil, renk, küratör yuvaları
 * kendiliğinden geliyor. Sözleşme `docs/futbolcu-kayit-sozlesmesi.md`.
 */
/**
 * ══════════════════════════════════════════════════════════════════════════
 * YUVA SAHİPLİĞİ — 21 Ağustos 2026'da ÖLÇÜLMÜŞ BİR ARIZANIN KAPISI
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Küratörün yüklediği kareler `FavouritePlayerImage` tablosunda İKİ
 * sütunla adresleniyor: `playerSlug` (sahip) + `slotId` (yuva). Yuva
 * kimlikleri kayıtlar arasında BİLEREK aynı — her oyuncunun bir "hero"su,
 * bir "card"ı, "gallery-1"i var. Kimliği benzersiz kılan tek şey SAHİP.
 *
 * Kayıtlar sahibini yazmıyordu ve `PlayerImage` sahip yokken SAYFANIN
 * varsayılan sahibine düşüyor. Profil sayfasında bu doğru sonucu veriyor
 * (varsayılan zaten o oyuncunun slug'ı). Hub sayfasında ise varsayılan
 * `futbol-hub`: yirmi üç kartın yirmi üçü de `futbol-hub / card` diye
 * TEK BİR satırı okuyordu.
 *
 * Görünen sonuç şuydu — kullanıcı bildirimi, birebir: Icardi'nin karesi
 * dururken Osimhen'inki yüklendi ve BÜTÜN favori futbolcuların kartı
 * Osimhen oldu. İkinci yükleme birincinin üstüne yazmıştı, çünkü ikisi
 * aynı satırdı.
 *
 * Düzeltme burada ve tek yerde: defter kurulurken her kaydın her yuvası
 * kendi slug'ıyla damgalanıyor. Kayıt dosyalarının hiçbirine `owner`
 * yazmak gerekmiyor — yeni bir futbolcu eklendiğinde de kendiliğinden
 * doğru çalışıyor, yani aynı arıza bir daha doğamaz.
 *
 * ⚠️ YUVA NESNELERİ YERİNDE DAMGALANIYOR, kopyalanmıyor. Kayıtlar modül
 * sabiti ve bu dosya onların TEK tüketicisi; kopyalamak `night.image.id`
 * gibi React anahtarlarının kimliğini değiştirirdi ve hiçbir şey
 * kazandırmazdı.
 *
 * ⚠️ ELLE YAZILMIŞ SAHİP KORUNUYOR (`??=`). Bugün hiçbir kayıt yazmıyor
 * ama bir yuva bilinçli olarak başka bir sahibe bağlanmak isterse — hub
 * yuvalarının `futbol-hub`a bağlanması gibi — o karar buradan ezilmemeli.
 */
function damgala(players: FavouritePlayer[]): FavouritePlayer[] {
  for (const player of players) {
    for (const slot of slotsOf(player)) slot.owner ??= player.slug;
  }
  return players;
}

export const FAVOURITE_PLAYERS: FavouritePlayer[] = damgala([
  // ---- Bugünün kadrosu ----
  mauroIcardi,
  victorOsimhen,
  leroySane,
  fernandoMuslera,
  lucasTorreira,
  ugurcanCakir,
  abdulkerimBardakci,
  davinsonSanchez,
  rolandSallai,
  yunusAkgun,
  barisAlperYilmaz,

  // ---- Yakın geçmiş ----
  didierDrogba,
  wesleySneijder,
  burakYilmaz,
  ardaTuran,
  selcukInan,
  felipeMelo,
  driesMertens,
  milanBaros,

  // ---- Arşiv efsaneleri ----
  metinOktay,
  bulentKorkmaz,
  claudioTaffarel,
  farydMondragon,
  gheorgheHagi,
]);
