/**
 * SLAM DUNK EVRENİ — SAYFA MÜZİĞİ.
 *
 * ── NEDEN AKATSUKI GİBİ DEPODA DEĞİL ─────────────────────────────────────
 * Akatsuki sergisinin teması `public/audio/akatsuki-theme.mp3` — depoya
 * konmuş sabit bir dosya. Kullanıcı Slam Dunk için bunu istemedi: parçayı
 * KÜRATÖR MODUNDAN yükleyecek ("müzik ekle sekmesi", 28 Ağustos 2026).
 * Depoya konan dosya her değişiklikte yeni bir commit ve deploy demek
 * olurdu; küratör yüklemesi aynı işi sayfayı yeniden yayınlamadan yapıyor.
 *
 * ── NEDEN YENİ TABLO YOK ─────────────────────────────────────────────────
 * `CuratedImage` satırının şekli (`surface` + `slotId` + `url`) parçanın
 * adresini taşımaya yetiyor ve yükleme ucu (`POST /admin/uploads`) ses
 * biçimlerini ZATEN kabul ediyor (`audio/mpeg`, `audio/wav`, `audio/ogg`,
 * `audio/mp3` — `uploads.service.ts` beyaz listesi). Tablo adının "Image"
 * olması tek maliyeti: bir yorum satırı. Yeni tablo bir migration demekti ve
 * migration'ın bedeli bu iş için taşıdığı değerin çok üstünde.
 *
 * ⚠️ Yuva GÖRSEL manifestosunda (`slots.ts`) DEĞİL. Orada olsaydı küratör
 * panelinde "eksik görsel" olarak listelenirdi ve odak/oran/alt metin gibi
 * bir ses dosyasında anlamsız olan beş sekme açılırdı. Kendi denetimi
 * `SlamDunkAudio` bileşeninin yanındaki tek düğmede.
 */

/** ⚠️ Değiştirme: küratörün yüklediği parçanın kaydı bu anahtara bağlı. */
export const SLAM_DUNK_ANTHEM_SLOT = "slam-dunk:anthem";

/**
 * Hedef ses seviyesi ve açılış solması.
 *
 * Akatsuki'nin değerleriyle aynı ve bilerek: ev içinde iki sergi arasında
 * gezinen bir ziyaretçi ses seviyesinin değiştiğini fark etmemeli.
 */
export const ANTHEM_VOLUME = 0.35;
export const ANTHEM_FADE_MS = 1800;
