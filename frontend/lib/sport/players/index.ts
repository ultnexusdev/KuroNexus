import type { FavouritePlayer } from "./types";

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
 * Taffarel, Mondragón. Hagi burada YOK — o bir backend kaydı ve kendi efsane
 * sayfasında duruyor (`sportHref.legend("hagi")`).
 *
 * ── YENİ KAYIT EKLERKEN ──────────────────────────────────────────────────
 * `players/<slug>.ts` dosyasını aç, buraya import et, diziye yaz. Başka
 * hiçbir yere dokunma: rota, kart, profil, renk, küratör yuvaları
 * kendiliğinden geliyor. Sözleşme `docs/futbolcu-kayit-sozlesmesi.md`.
 */
export const FAVOURITE_PLAYERS: FavouritePlayer[] = [
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
];
