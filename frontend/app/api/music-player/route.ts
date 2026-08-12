import { NextResponse } from "next/server";

/**
 * Spotify çalarının **karantina sayfası**.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * NEDEN AYRI BİR SAYFA VE NEDEN `/api` ALTINDA
 *
 * Spotify'ın `embed/iframe-api` betiği çalışmak için `eval` istiyor (13
 * Ağustos 2026'da ölçüldü: betik yüklendi, ilk satırda `EvalError` alıp öldü,
 * kontrolcü hiç kurulmadı). Bizim CSP'mizde `'unsafe-eval'` **bilerek** yok.
 *
 * İki kötü seçenek vardı: (a) bütün siteye `'unsafe-eval'` vermek — o zaman
 * sayfaya bir gün sızan herhangi bir metin çalıştırılabilir hâle gelirdi,
 * (b) otomatik geçişten vazgeçmek. Kullanıcı üçüncüsünü seçti (13 Ağustos):
 * **izni yalnızca bu mini sayfaya vermek.**
 *
 * Bu sayfa görünmez bir iframe olarak site geneli düzende yaşıyor. İçinde
 * ne oturum var, ne çerez okuyan kod, ne kullanıcı verisi — yalnızca Spotify
 * gömüsü ve on satırlık bir köprü. `eval` izni buranın dışına ÇIKMIYOR:
 * sitenin geri kalanı `script-src 'self' 'unsafe-inline'` ile kalıyor.
 *
 * `/api` altında, çünkü `middleware.ts` matcher'ı `/api`yi dışarıda
 * bırakıyor — ne dil yönlendirmesi ne de Basic Auth kapısı araya giriyor.
 * `app/[locale]/` altına konsaydı kanat düzenini miras alırdı ve o düzen
 * `MusicPlayerBar`ı içerdiği için sayfa **kendini** iframe'lerdi.
 *
 * ⚠️ CSP BU DOSYADA YAZILMIYOR, `next.config.ts`teki yol kuralında yazılı.
 * İkisine birden yazmak iki `Content-Security-Policy` başlığı üretir ve
 * tarayıcı ikisinin KESİŞİMİNİ uygular — yani `unsafe-eval` yine engellenir.
 * Tek kaynak: `next.config.ts` → `PLAYER_SECURITY_HEADERS`.
 * ══════════════════════════════════════════════════════════════════════════
 */

/** Köprü mesajlarının kimliği — sayfada başka `postMessage` trafiği olabilir. */
const HOST_TAG = "kuronexus-host";
const PLAYER_TAG = "kuronexus-player";

/** Kontrolcü bu süre içinde kurulmazsa ebeveyne "olmadı" deniyor. */
const READY_TIMEOUT_MS = 12_000;

const PAGE = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex,nofollow">
<title>KuroNexus çalar</title>
<style>
  html, body { margin: 0; padding: 0; background: transparent; overflow: hidden; }
  #host { width: 100%; }
  #host iframe { display: block; border: 0; width: 100%; }
</style>
</head>
<body>
<div id="host"></div>
<script>
(function () {
  var ORIGIN = location.origin;
  var controller = null;

  function send(message) {
    message.source = '${PLAYER_TAG}';
    parent.postMessage(message, ORIGIN);
  }

  // Spotify betiği yüklenince BU adı çağırıyor; tanımı betikten önce olmalı
  window.onSpotifyIframeApiReady = function (api) {
    api.createController(
      document.getElementById('host'),
      { uri: '', width: '100%', height: 80 },
      function (created) {
        controller = created;
        created.addListener('playback_update', function (event) {
          var data = event.data || {};
          send({
            type: 'update',
            position: data.position,
            duration: data.duration,
            isPaused: data.isPaused
          });
        });
        send({ type: 'ready' });
      }
    );
  };

  // Ebeveynden gelen komutlar. Origin kontrolü ŞART: bu sayfa bir iframe ve
  // herhangi bir pencere ona mesaj gönderebilir.
  window.addEventListener('message', function (event) {
    if (event.origin !== ORIGIN) return;
    var data = event.data;
    if (!data || data.source !== '${HOST_TAG}' || !controller) return;
    if (data.type === 'load') {
      controller.loadUri('spotify:track:' + String(data.spotifyId));
      if (data.autoplay) controller.play();
    } else if (data.type === 'play') {
      controller.play();
    } else if (data.type === 'toggle') {
      controller.togglePlay();
    }
  });

  var script = document.createElement('script');
  script.src = 'https://open.spotify.com/embed/iframe-api/v1';
  script.async = true;
  script.onerror = function () { send({ type: 'failed', reason: 'SCRIPT_ERROR' }); };
  document.body.appendChild(script);

  // \`onerror\` yalnızca istek BAŞARISIZ olursa tetikleniyor; asılı kalırsa hiç
  // çağrılmıyor ve çalar sonsuza kadar sessiz kalırdı.
  setTimeout(function () {
    if (!controller) send({ type: 'failed', reason: 'TIMEOUT' });
  }, ${READY_TIMEOUT_MS});
})();
</script>
</body>
</html>`;

export function GET() {
  return new NextResponse(PAGE, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Sayfa tamamen sabit; her gezinmede yeniden indirilmesin
      "Cache-Control": "public, max-age=3600",
    },
  });
}
