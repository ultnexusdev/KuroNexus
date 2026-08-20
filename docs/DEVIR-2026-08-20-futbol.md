# DEVİR NOTU — 20 Ağustos 2026 · Salon 06 / Futbol Kanadı

> **Bir sonraki oturumun konusu:** favori futbolcular ve efsaneler için
> **birden fazla oyuncu sayfasını eş zamanlı** tasarlamak.
> Bu dosya o işin başlangıç noktasıdır. Önce §0, sonra §3 okunmalı;
> §4 tekrar keşfedilmemesi gereken ölçümleri taşıyor.

---

## 0 · YENİ OTURUMDA İLK İŞ

1. **Bu dosyayı bitir.** Özellikle §3 (yeni oyuncu ekleme reçetesi) ve
   §4 (ölçülmüş tuzaklar).
2. **Canlıyı doğrula** — üç adres, üçü de 200 dönmeli:
   ```bash
   for u in /spor/futbol /spor/futbol/futbolcular/mauro-icardi /en/spor/futbol/futbolcular/mauro-icardi; do printf "%-46s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' "https://kuronexus.com$u")"; done
   ```
3. **Geri dönüş noktası aç** (her büyük tur öncesi kural):
   ```bash
   git tag -a "yedek-<konu>-2026-08-XX" -m "..." && git push origin "yedek-<konu>-2026-08-XX"
   ```

**Bu turda kullanılabilecek mevcut geri dönüş noktaları**

| Etiket | Nereye döner |
| --- | --- |
| `yedek-futbol-oncesi-2026-08-20` | Futbol kanadı yeniden tasarımından ÖNCE (`e93c275`) |
| `yedek-icardi-oncesi-2026-08-20` | Icardi sayfası yeniden tasarımından ÖNCE (`92e1cb9`) |

---

## 1 · ŞU AN NE ÇALIŞIYOR (canlıda doğrulandı)

### 1.1 `/spor/futbol` — hub, beş sahne

| Sahne | Bileşen | Notu |
| --- | --- | --- |
| Gece hero'su | `HubStage` | Renk alanı + fotoğraf plakası (`screen` karışımı) + projektör huzmeleri + zerre + fare paralaksı. Plaka **küratör yuvası**. |
| Kulüp kapısı | `ClubGate` | Galatasaray. Kapak küratörün (backend `coverImage`), ışık patlaması + lens parlaması + kor. |
| Efsaneler | `LegendsHall` | **İki kaynak tek salon**: backend efsaneleri + defterdeki favori futbolcular. |
| Favori futbolcular | `PlayerRail` | Yatay poster rayı; ilk kart çift genişlikte. |
| Tarihten | `HistoryReel` | **Zikzak**, her kayıtta foto yuvası, ışık scroll **ve** hover ile açılıyor. |

Kuyrukta öne çıkan dışındaki kulüpler (sessiz dizin). **Görsel künyesi bloğu YOK**
— gerekçesi §5.3.

### 1.2 `/spor/futbol/futbolcular/[slug]` — futbolcu posteri

Sırası: hero → hikâye → kariyer yolculuğu → unutulmaz geceler → favori anlar →
istatistikler → galeri → kapanış. Sağ kenarda dikey bölüm rayı (`PlayerRoute`,
≥1100 px), sağ üstte tek tuşluk tema müziği (`PlayerAudio`).

### 1.3 Küratör modu (her iki sayfada)

Admin girişliyken sağ altta anahtar. Açıkken **her görsel yuvasının** köşesinde
düzenle düğmesi: dosya seç ya da adres yapıştır → `/admin/uploads` →
`PATCH /admin/sport-archive/player-image` → **veritabanı**.

---

## 2 · MİMARİ — ÜÇ KATMAN

```
TASARIM (kod)                VERİ (kod)                 GÖRSEL (veritabanı)
lib/sport/favourite-players  aynı dosya                 FavouritePlayerImage
  palet, bölüm sırası,       ad, künye, hikâye,           playerSlug + slotId
  anlatı ritmi               istatistik, kariyer          → /uploads/... adresi
```

### 2.1 Neden defter kodda, görsel veritabanında

Defter bir liste değil bir **seçki**: her girdi kendi renk paletini, bölüm
sırasını ve anlatı ritmini taşıyor — bunlar veri değil **tasarım**. Ama
fotoğraf veridir: küratör bir kare yüklediğinde herkeste, her cihazda
görünmeli. Bu ayrım bilinçli ve korunmalı.

### 2.2 Yuva (slot) sistemi

Sayfadaki her fotoğraf bir `PlayerImageSlot` ve `PlayerImage` bileşeninden
geçiyor. Üç durumdan biri:

1. **Küratör kopyası** — veritabanında kayıt varsa o çizilir.
2. **Gerçek fotoğraf** — `placeholder` false ise `slot.src`.
3. **Yer tutucu** — tasarlanmış çerçeve: köşegen doku + kadraj notu + dosya
   yolu + "FOTO EKLENECEK" + `data-placeholder` özniteliği.

```ts
interface PlayerImageSlot {
  id: string;         // KARARLI. Değiştirmek küratörün yüklemesini koparır.
  owner?: string;     // veritabanındaki playerSlug; boşsa sayfanın varsayılanı
  src: string;        // dosyanın olması GEREKEN yer
  placeholder?: boolean;
  hint?: string;      // yer tutucunun içinde yazılı kadraj notu
  width?: number; height?: number;   // CLS için GERÇEK ölçüler
  caption?: string; credit?: MediaCredit | null;
}
```

### 2.3 Çok sahiplilik

`PlayerCuratorProvider` deposu iki katlı: `images[sahip][yuvaId] = adres`.

| Sayfa | `defaultOwner` | Ek sahipler |
| --- | --- | --- |
| `/spor/futbol` | `futbol-hub` | defterdeki her futbolcunun slug'ı (kart yuvaları) |
| `/spor/futbol/futbolcular/[slug]` | oyuncunun slug'ı | — |

Hub sayfası sahip başına bir istek atıyor ve istekler **paralel** koşuyor.

### 2.4 Backend

| | |
| --- | --- |
| Tablo | `FavouritePlayerImage` (`playerSlug` + `slotId` + `url`, `@@unique`, `@@index`) |
| Okuma | `GET /sport-archive/football/players/:slug/images` → düz harita, **açık uç** |
| Yazma | `PATCH /admin/sport-archive/player-image` → `{playerSlug, slotId, url}` — boş `url` = kaldır, **ADMIN** |
| Migration | `20260820181259_add_favourite_player_image` — saf ekleme |
| Uygulama | Konteyner açılışında (`Dockerfile`: `prisma migrate deploy && node dist/main`) |

Doğrulama kuralları: `url` yalnızca `/uploads/...` (dış adres 400),
`slotId` yalnızca `[a-z0-9][a-z0-9-]*` (bozuk kimlik 400).
Fiziksel silme yok — `isDeleted`, aynı yuvaya yeni kare gelince upsert diriltiyor.

---

## 3 · YENİ OYUNCU / EFSANE EKLEME REÇETESİ

> **Bir sonraki oturumun asıl işi bu.** Aşağıdaki adımların hiçbiri backend
> deploy'u gerektirmiyor.

### 3.1 Favori futbolcu ekleme

1. `frontend/public/assets/players/<slug>/` klasörünü aç (boş olabilir).
2. `frontend/lib/sport/favourite-players.ts` dizisine bir `FavouritePlayer`
   nesnesi ekle. Zorunlu alanlar tipte yazılı; **17 görsel yuvası** var:
   `hero`, `card`, `crest-<kulüp>`, 4-5 `career-*`, 4 `night-*`, 7 `gallery-*`.
   Görseli olmayan her yuvayı `placeholder: true` bırak.
3. `palette` alanını kulübün renklerinden kur:
   ```ts
   palette: { ink, accent, warm, glow, neon }
   ```
   Sayfa bu beş değeri kökten okuyor; **tek satır CSS yazmadan** sayfa o
   kulübün rengini giyiyor.
4. Efsaneler salonunda da görünsün istiyorsan `legendEpithet` yaz
   (Hagi'de "Karpatların Maradonası", Icardi'de "Aşk adamı").
5. Başka hiçbir yere dokunma. Rota, kart, profil, renk, küratör yuvaları
   kendiliğinden geliyor.

### 3.2 Kulüp rengi ≠ rakip rengi

⚠️ **LACİVERT / KOYU MAVİ KULLANILMAYACAK.** Kullanıcı kararı, gerekçesi
kesin: rakip kulübün rengi ve burası bir Galatasaray arşivi. Bu kural
**bütün futbol içeriği** için geçerli — atmosfer, zemin, tarih tonları ve
**kariyer duraklarının kulüp renkleri** dâhil. Inter/Sampdoria gibi mavi
kulüpler nötr taş tonuyla (`#8d8778`, `#6d6455`) temsil ediliyor.

Bu tur temizlenenler (yeniden getirmeyin):
`#1b2a55` (hero çivit) · `#2b1a55` (favoriler moru) · `#8fa6c4` / `#1a2436`
(tarih çelik mavisi) · `#2f6fbf` / `#1b3a8f` (kariyer mavileri) ·
`#0c0f15` nötr-mavi gri zeminler → sıcak karanlığa çekildi.

### 3.3 Efsane ekleme (backend kaydı)

Backend efsaneleri (`FootballLegend`) hâlâ kendi küratör ekranından
yönetiliyor ve portreleri **burada düzenlenemez** (`editable: false`) —
aynı görselin iki kaynağı olmasın diye. Yeni efsane eklemek için backend
küratör uçları kullanılır; hub sayfası onu kendiliğinden gösterir.

### 3.4 Birden fazla sayfayı eş zamanlı tasarlarken

- Palet **veriden** geldiği için sayfalar birbirinden bağımsız; aynı bileşen
  ağacı N oyuncuya hizmet ediyor.
- Bileşenlerde **kulüp adı sabit yazmayın**. Bugün tek sabit `HUB_OWNER`.
- Yeni bölüm türü gerekiyorsa (ör. "milli takım") önce tipe alan ekleyin,
  sonra bileşen; ters sıra defteri tutarsız bırakıyor.

---

## 4 · ÖLÇÜLMÜŞ GERÇEKLER — YENİDEN KEŞFETMEYİN

### 4.1 `generateStaticParams` `[locale]` altında ÖLÜMCÜL

`app/[locale]/**` altındaki bir rotaya eklerseniz TR çalışır, **`/en` 500
verir**. Üst katmanın kendi statik parametresi yok; `/en` SSG işaretli
segmentte istek anında üretilmeye çalışılıyor ve next-intl'in beklediği
`setRequestLocale` olmadığı için patlıyor. **`tsc`, `eslint` ve `next build`
üçü de temiz geçiyor** — yalnızca `/en` denenince görülüyor.
→ Yeni rota eklerken doğrulama listesine **her zaman `/en` karşılığını** koy.

### 4.2 İki farklı origin

Depodaki kareler (`/assets/…`, `/spor/…`) **ön yüz** sunucusunda; küratörün
yüklediği kareler (`/uploads/…`) **API** sunucusunda. `isLocalUpload()`
ayrımı tek yerden yapıyor (`PlayerImage`). Ham basmak `/uploads/`yi
kuronexus.com'da arar; hepsini `apiUrl()`den geçirmek `/assets/`yi API'de arar.

### 4.3 Görünmez kutular tıklamayı yutuyor

Bu turda **dört** tanesi bulundu ve hepsi aynı sınıf: tam genişlikte, görsel
olarak boş, `pointer-events` bırakılmamış bir katman.

| Katman | Neyi engelliyordu |
| --- | --- |
| Kırıntı şeridi (`.crumb`, her iki sayfa) | hero yuvasının düzenle düğmesi |
| Hero üst şeridi (`.top`) | hero yuvasının düzenle düğmesi |
| `PlayerRail` okunurluk maskesi (`.shade`) | kart yuvası |
| Küratör paneli | altındaki düzenle düğmeleri (× artık yalnızca paneli katlıyor) |

⚠️ **`z-index` yetmiyor.** `PlayerImage`in `.frame`i `container-type:
inline-size` taşıyor = `contain: layout` = **yığın bağlamı**. Düğmenin
`z-index: 6`sı o bağlamın içinde hapsoluyor.

⚠️ **Programatik `.click()` bunu YAKALAMAZ** — isabet testini atlar. Doğru
yöntem:
```js
const r = btn.getBoundingClientRect();
const hit = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2);
const ok = hit === btn || btn.contains(hit);
```

### 4.4 İç içe etkileşimli öğe

Bir yuva `<a>` ya da `<button>` içindeyse küratör düzenleyicisi orada
`<input>` basıyor: geçersiz HTML **ve** yanlış hedefe giden tıklama.
React sentetik olayları **bileşen ağacında** yükseldiği için portal tek başına
yetmiyor. İki çözüm kullanıldı:

- Küratör modunda kabı `<div>`e çevir (galeri kareleri, `PlayerRail` kartı,
  `HistoryReel` kaydı).
- Aynı yuva başka yerde düzenlenebiliyorsa `noEdit` ile bastır
  (`PlayerStats`in arması).
- Efsane kartlarında "uzatılmış bağlantı" deseni: tek `<a>` sözde-öğeyle
  kartı kaplıyor, portre küratör düğmesi taşıdığında `:has(button)` ile
  üstüne çıkıyor.

### 4.5 Tarayıcı paneli donuk

Panel görünmüyorken **CSS geçişleri hiç ilerlemez** ve `getComputedStyle`
başlangıç değerini döndürür → "kuralım çalışmıyor" sanılır. `loading="lazy"`
görseller de hiç yüklenmez. Doğrulama yöntemi:
```js
const k=document.createElement('style');
k.textContent='*,*::before,*::after{transition:none!important;animation:none!important}';
document.head.appendChild(k);   // durumu değiştir → ölç → k.remove()
```
Ayrıntı: `~/.claude/.../memory/browser-pane-frozen-raf.md`.

### 4.6 Küratör modunu yerelde sınama

`readIsAdmin()` yerelde false; tarayıcıdan admin **yazma** da CORS'a takılıyor
(backend allowlist'inde `localhost:3100` yok). Yöntem:

- **Yapı doğrulaması:** sayfa dosyasında `const isAdmin = true || await
  readIsAdmin(); // GECICI` → derle → ölç → **hedefli `sed`/`node` ile geri al**.
  ⚠️ `git checkout -- <dosya>` KULLANMAYIN: o turdaki diğer düzenlemeleri de
  siler (bu turda bir kez yaşandı).
- **Uç doğrulaması:** yerel Postgres + yerel backend + **gerçek giriş akışı**
  (`local@test.dev` / `LocalTest!2026`), `node` içinden `fetch`.

### 4.7 Kabuk tuzakları

- `node -e "..."` içinde **backtick** kabuk tarafından yeniyor (yorumlardaki
  `` `url` `` boşaldı). Türkçe **kesme işareti** de tek tırnaklı string'i
  kırıyor. → Uzun/Türkçe metinlerde **Edit ya da Write aracı** kullanın.
- Backend dosyaları **CRLF**; `node` ile yazınca prettier patlıyor.
  `npm run lint` ÇALIŞTIRMAYIN (içindeki `--fix` gerekli tip dönüşümlerini
  siliyor) — `npx eslint <yol>` kullanın ve satır sonlarını elle
  normalleştirin.

---

## 5 · AÇIK İŞLER

### 5.1 Boş kalan yuvalar

| Yuva | Durum |
| --- | --- |
| `mauro-icardi` / `hero` | **Boş.** Küratör modundan yüklenebilir. |
| `mauro-icardi` / `card` | **Boş.** Hub şeridindeki kart + efsaneler salonundaki portre bunu kullanıyor. |
| `futbol-hub` / tarih kareleri (4) | Boş, yer tutucu çiziyor. |

Diğer 16 yuva dolu ve hem deftere hem veritabanına yazılı.

### 5.2 Doğrulanmamış sayılar

`favourite-players.ts` içindeki maç/gol/asist/kupa değerleri kullanıcının
tasarım referansından geldi, dış kaynakla karşılaştırılmadı. Bilinen
tutarsızlık: kulüp kırılımı toplandığında maç sayısı "tüm zamanlar"
satırındaki 297'yi aşıyor. Dosya başında uyarı olarak duruyor.

### 5.3 Görsel künyesi neden kalktı

Kullanıcı isteğiyle. Ancak künye **gerektiren** kare kalmadıktan sonra
yapılabilirdi: efsanelerdeki CC BY plaka kaldırıldı, kulüp kapısının CC BY
yedeği CC0 bir kareyle değiştirildi.
⚠️ **Yeni bir CC BY / CC BY-SA görsel eklenirse künye zorunluluğu geri gelir.**
`MediaCredits` bileşeni duruyor, yeniden bağlanabilir.

### 5.4 Küçük pürüz

`crest-gs` yuvasına yüklenen kare 736×1308 (uzun dikey); arma kutusu 320/397
oranında ve `contain` ile çiziliyor, yani yanlarda boşluk kalıyor.
Kare/dikey bir arma görseli daha iyi oturur.

---

## 6 · DOSYA HARİTASI

### Veri / kayıt
```
frontend/lib/sport/favourite-players.ts   defter + bütün tipler + allSlotsOf()
frontend/lib/sport/football-hub-slots.ts  HUB_OWNER, hero yuvası, historySlot()
frontend/lib/sport/football-media.ts      depodaki plakalar + künye defteri
frontend/lib/sport/routes.ts              /spor/... adreslerinin TEK kaynağı
```

### Sayfalar
```
app/[locale]/spor/futbol/page.tsx                      hub (5 sahne)
app/[locale]/spor/futbol/futbolcular/[slug]/page.tsx   futbolcu posteri
```

### Bileşenler — hub
```
components/sport/football/HubStage      gece hero'su (plaka = yuva)
components/sport/football/ClubGate      kulüp kapısı
components/sport/football/LegendsHall   efsaneler (iki kaynak)
components/sport/football/PlayerRail    favori futbolcu rayı
components/sport/football/HistoryReel   zikzak tarih şeridi
components/sport/football/PlayerRoute   dikey bölüm rayı
```

### Bileşenler — futbolcu sayfası (`player/`)
```
PlayerCurator   çok sahipli küratör deposu + anahtar + panel
PlayerImage     TEK yuva bileşeni (yer tutucu + düzenleyici + portal panel)
PlayerHero      sash imzası + dev ad + forma numarası
PlayerStory     iki sütun + tam bant kare
PlayerJourney   kariyer: gittikçe parlayan hat
PlayerStats     iki küme (arma / tüm zamanlar), kulüp kümesinde glow
PlayerGallery   editoryal ızgara + ışık kutusu
PlayerAudio     tema müziği, sağ üstte tek tuş
```

### Backend
```
backend/prisma/schema.prisma                            FavouritePlayerImage
backend/prisma/migrations/20260820181259_add_favourite_player_image/
backend/src/sport-archive/sport-archive.controller.ts   açık okuma ucu
backend/src/sport-archive/sport-archive.admin.controller.ts  yazma ucu
backend/src/sport-archive/sport-archive.service.ts      getPlayerImages()
backend/src/sport-archive/sport-archive-curator.service.ts   setPlayerImage()
backend/src/sport-archive/dto/curator.dto.ts            SetFavouritePlayerImageDto
```

### Varlıklar
```
frontend/public/assets/players/icardi/OKU.md   yuva listesi + kadraj notları
frontend/public/audio/icardi-theme.mp3         sayfa teması (10 MB)
frontend/public/spor/futbol/*.webp             depodaki plakalar (776 KB)
```

---

## 7 · DEĞİŞTİRİLMEYECEK KARARLAR

1. **Lacivert yok** (§3.2).
2. **Defter kodda, görsel veritabanında** (§2.1).
3. **Yuva kimlikleri kararlı.** Yeniden adlandırmak küratörün yüklemesini
   koparır.
4. **`/spor/...` dizesi elle yazılmaz** — tek kaynak `lib/sport/routes.ts`.
   `futbolcular` `RESERVED_CLUB_SLUGS` içinde.
5. **Boş oda yasağı** — dolu olmayan yüzey hiç çizilmez; kırık görsel kutusu
   hiçbir koşulda görünmez, yerine tasarlanmış yer tutucu çizilir.
6. **`app/[locale]` altında `generateStaticParams` yok** (§4.1).
7. **`isAdmin` yalnızca düğmeyi gösterir**; yetkinin kapısı backend'de.
8. **Dış adres saklanmaz, indirilir** — CSP beyaz liste ve dış adres ölebilir.
9. **Anton + Inter yalnızca futbolcu ağacında**, ikisi de `preload: false`.
   Kanat ölçeği (Petrona/Cinzel/Bebas) ezilmedi.
10. **Tek belirme hareketi** — `Reveal`. Her bölüm kendi imza hareketini
    taşıyor ama giriş animasyonu tek.

---

## 8 · BU TURDA YAPILANLAR (commit sırası)

```
ed04212  futbol hub yeniden tasarlandi - gece sahneleri, favori futbolcular
92e1cb9  /en futbolcu profilinde 500 duzeltildi
51a7dcd  Icardi sayfasi yeniden tasarlandi - sash imzasi, kurator modu, tema
3006ba6  kaydir ipucu cakismasi, kurator paneli, galeri girdisi
1a4f74e  futbolcu gorselleri artik veritabaninda (localStorage degil)
5a874fb  Icardi fotograflari deftere islendi (14 yuva) + origin coz duzeltmesi
7fd41cc  hero duzenle dugmesi tiklanamiyordu + panel modu kapatiyordu
61cee21  hub sayfasina kurator modu, zikzak tarih seridi, efsanelerde Icardi
```

---

## 9 · AÇIK SORULAR (kullanıcıya sorulacak)

1. Yeni oyuncular hangi kulüplerden? Palet ve "lacivert yok" kuralının o
   kulüplerde nasıl karşılanacağı buna bağlı.
2. Efsaneler salonuna eklenecekler backend kaydı mı olacak yoksa defterdeki
   favori futbolcular üzerinden mi? (İkincisi hiç backend işi gerektirmiyor.)
3. Her yeni oyuncuya kendi tema müziği mi, yoksa müzik yalnızca Icardi'ye mi
   özel kalsın?
