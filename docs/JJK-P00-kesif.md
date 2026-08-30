# JUJUTSU KAISEN EVRENİ — "LANETLİ ARŞİV" KEŞİF + DEVİR

> Tarih: 30 Ağustos 2026 · Kapsam: `/anime/jujutsu-kaisen` (+ `/en/…`)
> Kaynak brief: kullanıcının **"Lanetli Arşiv v2" mockup'ı**
> (`Jujutsu Kaisen sayfası tasarımı.zip` — Desktop'tan yüklendi, v2 esas).

---

## ⌂ DEVİR — SIRADAKİ OTURUM BURADAN BAŞLASIN (30 Ağustos 2026)

**Durum: ON BİR BÖLÜMÜN TAMAMI TEK TURDA KURULDU ve derleme temiz.**
Sayfa `noindex` kilidi altında canlıya çıkacak; kilit CANLI doğrulama +
İngilizce son okuma + OG kartı yapılmadan KALKMAZ (`page.tsx` içindeki
`robots` bloğunda yazılı).

### Kullanıcının dört kararı (4 Soru, 30 Ağustos 2026)

1. **Kapsam = tasarımdaki kapsam.** Son büyük bölüm Kıyım Oyunu; Son
   Kayıt "liste eksiktir" ile açık uçlu kapanır. Shinjuku yalnızca yay
   listesinde ve kayıplar sicilinde ANILIYOR — kendi bölümü YOK. Shinjuku
   bölümü gerekirse 12. bölüm olarak ayrı tur.
2. **v2 tam ekran alan devralması DAHİL** (native `<dialog>`; güvenlik
   şartları aşağıda).
3. **Görseller: önce yuvalar.** 31 küratör yuvası boş açıldı; üretim
   (Naruto boru hattı) AYRI oturum. Sayfa görselsiz eksiksiz.
4. **Dört geliştirme de onaylı:** Shibuya saat↔harita bağı, 20 Parmak
   localStorage ilerlemesi, kanji rayında scroll-spy (dar ekranda alt
   şerit), karakter köprüleri (Gojo #127691 üç yerden köprülü: Toplum
   sicili, Derece Duvarı, Arketipler).

### Mimarinin özeti (Bleach şablonu, bilinçli kopya)

| Katman | Yer |
|---|---|
| Veri (TR+EN `Localized`) | `lib/anime/jjk/*.ts` — konu başına dosya |
| Yuva manifestosu | `lib/anime/jjk/slots.ts` — `JJK_SURFACE="anime/jjk"`, 31 yuva |
| Çapa defteri | `lib/anime/jjk/anchors.ts` — atla listesi + JSON-LD + ray + denetim aynı listeyi okur |
| Bileşenler | `components/anime/jjk/` — bölüm başına sunucu kabuk + küçük istemci adası |
| Renk | YALNIZCA `styles/globals.css` (kural 16): `[data-world="jjk"]` + 3 `[data-zone]` + 9 `[data-domain]` bloğu |
| Tipografi/ölçek | `components/anime/jjk/jjk.module.css` (`--j-display` Shippori Mincho, `--j-mono` IBM Plex Mono, `--j-body` Inter) |
| Sayfa | `app/[locale]/anime/jujutsu-kaisen/page.tsx` (`force-dynamic`, `<main>` AÇMAZ) |
| Denetim | `npm run check:jjk` → kontrast (91 kontrol/13 palet) + çapa + hareket + i18n |

### ⚠️ Tekrarlayan tuzaklar / bu sayfaya özgü kararlar

- **`data-zone` / `data-domain` YENİ nitelikler** — Bleach'in
  `data-layer`'ına dokunulmadı (çakışma). İkisi de `--surface-2` türev
  kuralının seçici listesine EKLENDİ (globals.css) — eksik kalsaydı
  bölge içindeki ara tonlar sayfanın paletinden hesaplanırdı.
- **Alan paleti = token seti komple döner.** `[data-domain]` yalnızca
  `--dom-*` değil `--bg/--surface/--text-*/--accent*` VE `--world-*`
  dördünü de yeniden bağlar; `CuratedImage` duotone'u kalıtımla alanın
  rengine geçer. Yeni alan eklerken 13'lü ev seti + 8'li dom seti +
  4'lü world seti EKSİKSİZ doldurulur — `check-jjk-contrast` blok
  eksikse kırmızı yanar.
- **Gojo alanı (Unlimited Void) sitenin İKİNCİ açık paleti** (Hueco
  Mundo'dan sonra) — metin token'ları ters yönde, aynı eşikler.
- **Devralma kilidi TEK KAPIDAN çözülür:** kaydırma kilidi diyaloğun
  `close` olayında kalkar (ESC/✕/zemin üçü de oradan geçer) + unmount
  cleanup. `open()` içinde kilit ÇÖZÜLMEZ. (Gojo scroll-kilidi dersi.)
- **`NEXT_PUBLIC_*` DERLEMEDE GÖMÜLÜR** — `next start`'a farklı
  `NEXT_PUBLIC_API_URL` vermek İŞE YARAMAZ (30 Ağustos'ta ölçüldü:
  3999'a yönlendirilmiş örnek yine 3001'e bağlandı). Lokal API'yi
  değiştirmek istiyorsan `.env.local` değiştir + YENİDEN DERLE.
- **Asılı backend, kapalı backend'den KÖTÜ.** `backend/dist/main`
  ayakta ama uzak DB'ye ulaşamıyorken DB'li her uç SONSUZ bekliyor →
  SSR ~284 sn'de (undici zaman aşımı) yedeğe düşüyor. Sayfa yine 200 +
  eksiksiz döner ama lokal doğrulama işkence olur. Backend'i ya düzgün
  çalıştır ya HİÇ çalıştırma; asılı süreci öldürmek serbest (o oturum
  kapanmış oluyor).
- **i18n bekçisi düz tırnak arar:** `tr:` şablon dizesi İÇİNDE düz
  çift tırnak kullanma (slots.ts'te bir kez yaşandı) — tipografik
  tırnak ya da tırnaksız yaz.
- **Mockup'tan alınan canon düzeltmeleri:** Kento (Kenta değil) Nanami ·
  Yuta'nın alan kanjisi 真贋相愛 · Dagon'un alanı 蕩蘊平線 · Binding Vow
  kanjisi 縛り (束縛 değil) · Sakurajima 3. oyuncu Noritoshi Kamo
  (Higuruma değil — Higuruma Tokyo No.1'de) · Hakari kolonisinden
  mükerrer Kashimo çıkarıldı. Mockup'a dönerken bunları GERİ ALMA.
- **Bilinçli YUVASIZ bölümler:** Parmaklar, Shibuya haritası, kural
  defteri, Son Kayıt (gerekçe `slots.ts` başlığında). "Eksik" değil.
- **20 Parmak `localStorage` sözleşmesi:** anahtar `jjk:fingers:opened`,
  değer numara dizisi; her erişim try/catch; 1 numara hep açık;
  ilk kare SSR ile aynı, depo `useEffect`te yüklenir.
- **Kanji rayı dar ekranda (≤1100px) alt şerit olur** — gövdeye
  `padding-bottom: 3.6rem` o yüzden var (`page.module.css`).

### AÇIK İŞLER (sonraki turların sırası önerisi)

1. **Canlı doğrulama** — deploy sonrası: devralma (aç/kapa/ESC/zemin),
   perde kırılması, Shibuya iğne geçişleri, 20 Parmak kalıcılığı,
   scroll-spy, dar ekran alt şerit, kâğıt dosyanın okunurluğu.
2. **Küratör görselleri** — 31 yuva; üretim ayrı oturum (Naruto boru
   hattı: `K:\KURONEXUS-uretim`, fal yedeği). Öncelik: skyline (eager),
   9 alan sineması, 7 arketip portresi.
3. **OG kartı** — `scripts/build-bleach-og.mjs` deseninde
   `build-jjk-og.mjs` + `public/og/jjk.png`; sonra `shareCard`e
   `image` parametresi.
4. **`noindex` kaldırma turu** — (1)+(2 en azından kısmen)+(3) bitince:
   robots bloğu silinir, `app/sitemap.ts`e iki dilli kayıt eklenir.
5. **İsteğe bağlı 12. bölüm: Shinjuku Hesaplaşması** — kapsam kararı
   değişirse; Son Kayıt zaten kapıyı açık bırakıyor.
6. **Bütçe bekçisi** — istenirse `check-jjk-budget.mjs` (bleach'inki
   şablon; bugünkü paket 11.1 kB rota / 139 kB first-load, sorun yok).

### Bölüm envanteri (id → bileşen → etkileşim)

| # | id | Bileşen | Etkileşim |
|---|---|---|---|
| 01 | `veil` | `VeilHero` + `Veil.tsx` | perde kaldır/indir (8 parça CSS uçuşu) |
| 02 | `energy` | `EnergySection` + `EnergyLadder` | 10 katman sekmesi (tablist) |
| 03 | `society` | `SocietySection` + `SocietyBoard` | 3 kurum × üye → KÂĞIT DOSYA |
| 04 | `grades` | `GradeWall` + `GradeBoard` | resmî↔gerçek anahtar, fark rozetleri |
| 05 | `spirits` | `SpiritArchive` + `SpiritCatalog` | silüet aç (oturumluk), tehdit paneli |
| 06 | `domain` | `DomainSection` + `DomainChamber` | 9 palet + `<dialog>` devralma |
| 07 | `archetypes` | `ArchetypesSection` + `ArchetypeIndex` | 7 rol, portre + köprü |
| 08 | `fingers` | `FingersSection` + `FingerVault` | 20 karo, localStorage sayaç |
| 09 | `shibuya` | `ShibuyaSection` + `ShibuyaOps` | saat↔harita, iğne geçişleri |
| 10 | `culling` | `CullingSection` + `ColonyMap` | 10 koloni iğnesi + kural defteri |
| 11 | `finale` | `FinalArchive` | saf sunucu, yapışkan kayıplar sicili |

Ortak: `KanjiRail` (scroll-spy), `SectionNav` (odakla açılan atla
listesi), `JjkJsonLd`, `CuratorManifest` (admin), `CuratedImage`/
`CuratedSlotPen` (JJK kopyaları — Bleach'ten BAĞIMSIZ, gerekçe dosya
başlıklarında).
