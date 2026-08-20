# DEVİR NOTU — 21 Ağustos 2026 · Salon 06 / 23 Futbolcu Sayfası

> Bir önceki not: `docs/DEVIR-2026-08-20-futbol.md` (futbol kanadının kendisi).
> Bu not onun üstüne biniyor; oradaki §4 (ölçülmüş tuzaklar) ve §7
> (değiştirilmeyecek kararlar) **hâlâ geçerli** ve tekrar edilmedi.

---

## 0 · YENİ OTURUMDA İLK İŞ

1. **Canlıyı doğrula** — hepsi 200 dönmeli:
   ```bash
   for u in /spor/futbol /spor/futbol/efsaneler /spor/futbol/futbolcular/osimhen /en/spor/futbol/futbolcular/osimhen /spor/futbol/efsaneler/hagi; do printf "%-52s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' "https://kuronexus.com$u")"; done
   ```
2. **Toplu görsel ucunun ayakta olduğunu doğrula** (backend bu turda değişti):
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" https://api.kuronexus.com/sport-archive/football/players/images
   ```
   404 dönüyorsa backend deploy'u tamamlanmamıştır. Sayfa yine de çalışır —
   ön yüz eski yola düşüyor (§3.3) — ama hub futbolcu başına istek atar.
3. **Geri dönüş noktaları**

| Etiket | Nereye döner |
| --- | --- |
| `yedek-oyuncular-oncesi-2026-08-20` | Bu turdan ÖNCE (`b3447d6`) |
| `yedek-futbol-oncesi-2026-08-20` | Futbol kanadı yeniden tasarımından önce |
| `yedek-icardi-oncesi-2026-08-20` | Icardi sayfasından önce |

---

## 1 · BU TURDA NE OLDU

Script'te adı geçen **22 futbolcu/efsane** deftere işlendi ve her birinin
kendi sayfası açıldı. Icardi'yle birlikte defterde **23 kayıt** var.

| | |
| --- | --- |
| Yeni kayıt | 22 (toplam 23) |
| Toplam satır | 8.656 |
| Yeni rota | `/spor/futbol/efsaneler` (önceden **404**) |
| Efsaneler salonunda görünen | 6 defter kaydı + Hagi (backend) |
| Doğrulanan rota | 23 × TR + 23 × EN = **46, hepsi 200** |
| Yüklenmeyi bekleyen görsel yuvası | **399** |
| Mavi ton denetimi | 210 renk tarandı, **0 mavi** |

### 1.1 Efsaneler salonunda kimler var

`legendEpithet` alanı dolu olan kayıt salonda **da** görünüyor; iki kart da
aynı sayfaya gidiyor (kullanıcı kararı).

| İsim | Lakap | Kaynak |
| --- | --- | --- |
| Metin Oktay | Taçsız Kral | defter — **panteon** |
| Hagi | (backend kaydı) | backend — **panteon** |
| Mauro Icardi | Aşk adamı | defter |
| Fernando Muslera | Güvenin ta kendisi | defter |
| Bülent Korkmaz | Altın neslin kaptanı | defter |
| Cláudio Taffarel | Kurtaran eller | defter |
| Faryd Mondragón | Sakin tecrübe | defter |

⚠️ **Hagi'nin sayfası yeniden üretilmedi.** Kendi backend kaydı ve kendi
sayfası zaten vardı (`/spor/futbol/efsaneler/hagi`, canlıda 200); salon ona
yalnızca bağlantı veriyor.

---

## 2 · SAYFALAR NEDEN BİRBİRİNE BENZEMİYOR

Kullanıcının şartı: "her sayfanın kendine has bir tasarımı olsun,
birbirine benzemesin."

Oyuncu başına ayrı bileşen ağacı yazmak **ölçüldü ve reddedildi**: küratör
modu, yuva sistemi, `/en` rotası ve erişilebilirlik 23 kez yeniden yazılırdı
ve tek bir düzeltme 23 dosyaya elle taşınırdı.

Onun yerine **kompozisyon da veri oldu**. `player.design` altı eksen taşıyor
ve altısı da sayfanın köküne `data-*` olarak iniyor:

| Eksen | Değerler | Ne değişiyor |
| --- | --- | --- |
| `voice` | poster · monument · condensed · editorial | Anton / Cinzel / Bebas / Petrona — **yeni font dosyası yok**, dördü de zaten yüklüydü |
| `hero` | sash · column · split · frame · kinetic · stack | ilk ekranın iskeleti |
| `signature` | sash · arc · grid · rays · scan · wave | bölümlerin ve **boş yuvaların** arkasındaki motif |
| `rhythm` | tight · open · cinematic | bölümler arası nefes |
| `texture` | grain · archive · clean · halo | zemin dokusu |
| `order` | bölüm dizisi | bölümlerin sırası |

Ölçülmüş sonuç (canlı DOM'dan):

| | Osimhen | Taffarel |
| --- | --- | --- |
| Tipografi | Anton | Cinzel, 0.08em, 700 |
| Hero ızgarası | 1.05fr / 1fr | tek sütun |
| Sash | var | `display: none` |
| Bölüm boşluğu | `0rem` | `clamp(2.5rem, 7vw, 6rem)` |
| Zemin dokusu | yok | arşiv taraması |
| Vurgu | `#1fb85a` | `#d9b23c` |

Hub şeridinde **23 kart, 23 farklı vurgu rengi** ve altı motifin tamamı
ölçüldü.

⚠️ **Yeni eksen eklerken:** önce `players/types.ts`e alan ekle, sonra
bileşeni yaz. Ters sıra defteri tutarsız bırakıyor.

⚠️ **Hero varyantları `@media (min-width: 901px)` içinde ve orada kalmalı.**
900 px altındaki sorgu kadrajı tek sütuna düşürüyor; varyant kuralları
öznitelik + sınıf taşıdığı için özgüllükleri daha yüksek, medya sorgusunun
dışına çıkarılırsa **mobil düzeni ezer**. Dar ekranda kompozisyon oyunu değil
okunurluk kazanıyor — bu bilinçli.

---

## 3 · MİMARİ DEĞİŞİKLİKLERİ

### 3.1 Defter bölündü

```
lib/sport/players/types.ts     tip sözleşmesi + tasarım DNA'sı
lib/sport/players/<slug>.ts    her oyuncu KENDİ dosyasında (23 dosya)
lib/sport/players/index.ts     kayıt listesi — sıra tasarımın parçası
lib/sport/favourite-players.ts DIŞARIYA BAKAN YÜZ (import yolu korundu)
```

Gerekçe: tek dosya 23 kayıtta 6.500+ satır olurdu ve iki kişi (ya da iki
ajan) iki farklı oyuncuya aynı anda yazamazdı. **Hiçbir bileşenin import
satırı değişmedi.**

### 3.2 Boş yuvanın iki yüzü

`PlayerImage` artık ikiye ayrılıyor:

- **Ziyaretçi** → `.veil`: tasarlanmış boşluk. Oyuncunun paletinde ışık,
  imza motifinin gölgesi, film graini. **Tek harf yazı yok**, dosya yolu yok.
- **Küratör modu açıkken** → `.holder`: eski iskele. Kadraj notu, dosya yolu,
  "FOTO EKLENECEK".

Gerekçe: 399 yuva boş açılıyor. Eski düzen sürseydi her sayfa baştan aşağı
dosya yolu listesi olarak yayına girerdi.

⚠️ Ayrım `curating` üzerinden: küratör modu **kapalıyken** admin de
ziyaretçinin gördüğünü görüyor — sayfanın gerçek hâlini denetleyebilsin diye.

### 3.3 Toplu görsel ucu (backend değişti)

```
GET /sport-archive/football/players/images   → { slug: { slotId: url } }
```

Hub futbolcu başına ayrı istek atıyordu: 23 kayıtta **24 tur** olacaktı ve her
yeni futbolcu hub'ı bir tur daha yavaşlatacaktı. Tek sorguya indi.

- Migration **yok**, saf ekleme.
- Rota çakışması yok: bu yol üç segment, tekil uç dört.
- Ön yüzde `readCuratorImages()` bu ucu kullanıyor ve **yanıt vermezse eski
  yola düşüyor** — iki servis aynı push'ta deploy oluyor ama aynı anda ayağa
  kalkmıyor; yedek olmasaydı o pencerede bütün küratör kareleri kaybolurdu.

### 3.4 Boş bölüm gizleme — İNCE ayrım

Fotoğrafı olmayan her bölümü gizlemek **yanlış olurdu**: geceler ve kariyer
bölümlerinde fotoğrafın yanında metin var (yıl, başlık, cümle). Onları kare
gelmedi diye kapatmak yazılmış içeriği silmek demek.

Gerçekten boş kalan tek bölüm **galeri**. O yüzden yalnızca galeri gizleniyor.

⚠️ **Küratör istisnası:** admin girişliyken galeri fotoğraf olmasa da
çiziliyor. Yoksa yükleme yapılacak yuva sayfada hiç görünmezdi.

---

## 4 · AÇIK İŞLER

### 4.1 399 görsel yuvası boş — küratör yükleyecek

Her sayfa, her yuva küratör modundan doldurulabilir. Yuvanın içindeki kadraj
notu ne konacağını söylüyor.

**Öncelik sırası** (en çok görüneni önce):

1. Her oyuncunun `card` yuvası — hub şeridi + efsaneler salonu ikisi de
   bunu kullanıyor, yani tek kare iki yerde birden doluyor.
2. `hero` — sayfanın ilk ekranı.
3. `crest-gs` — arma. ⚠️ Kare/dikey bir kare daha iyi oturur; mevcut
   Icardi karesi 736×1308 ve arma kutusunda yanlarda boşluk kalıyor.
4. Galeri — **fotoğraf yüklenene kadar bölüm ziyaretçiye hiç görünmüyor.**

### 4.2 SAYILAR DOĞRULANMADI — en önemli açık iş

⚠️ Bu 23 kayıt **gerçek insanları** anlatıyor ve içlerindeki bilgiler dış bir
kaynakla karşılaştırılmadı.

Kayıtları üreten ajanlara açık talimat verildi: **emin olmadığın sayıyı
yazma.** Talimata uyuldu — çoğu kayıtta `career[].matches` ve `goals` alanları
`null`, istatistik kümeleri rakam yerine unvan/yıl/kupa taşıyor, birkaç
kayıtta `shirt: null`.

Ama **yazılmış olanlar da doğrulanmadı**: yıllar, şampiyonluk sayıları,
kulüp sıraları, doğum yerleri. Her dosyanın başında `⚠️ SAYILAR DOĞRULANMADI`
uyarısı duruyor.

→ **Bir sonraki turun işi bu olabilir:** kayıtları tek tek dış kaynakla
karşılaştırıp düzeltmek. Düzeltme her dosyada tek satır.

### 4.3 Metin kalitesi ölçüldü, hepsi okunmadı

Örnekleme yapıldı (Osimhen, Sneijder, Taffarel) ve metinler arşivin sesinde,
gözleme dayalı ve Türkçesi temiz çıktı. **23 dosyanın tamamı satır satır
okunmadı.** Bir sayfada tuhaf bir cümle görülürse tek dosyada, tek satırda.

### 4.4 Deploy RAM riski hâlâ açık

Bu push **iki servisi birden** deploy ediyor ve 13-14 Ağustos'ta iki eşzamanlı
build siteyi + SSH'ı + Coolify'ı düşürmüştü. O yüzden bu turda **tek push**
yapıldı (arka arkaya push deploy döngüsünü katlardı). Kalıcı çözüm hâlâ açık iş.

---

## 5 · DOSYA HARİTASI (bu turda değişen/eklenen)

```
docs/futbolcu-kayit-sozlesmesi.md         yeni kayıt yazma sözleşmesi

frontend/lib/sport/players/types.ts       tip + tasarım DNA'sı            YENİ
frontend/lib/sport/players/<slug>.ts      23 kayıt                        YENİ
frontend/lib/sport/players/index.ts       kayıt listesi                   YENİ
frontend/lib/sport/curator-images.ts      toplu uç + yedek                YENİ
frontend/lib/sport/favourite-players.ts   yüz (yeniden yazıldı)

frontend/app/[locale]/spor/futbol/efsaneler/page.tsx         salon        YENİ
frontend/app/[locale]/spor/futbol/efsaneler/page.module.css               YENİ
frontend/app/[locale]/spor/futbol/futbolcular/[slug]/page.tsx  bölüm sırası
frontend/app/[locale]/spor/futbol/futbolcular/[slug]/page.module.css  eksenler
frontend/app/[locale]/spor/futbol/page.tsx                   toplu uç + salon kapısı

frontend/components/sport/football/player/PlayerImage.tsx     veil / holder
frontend/components/sport/football/player/PlayerImage.module.css
frontend/components/sport/football/player/PlayerHero.module.css  5 varyant
frontend/components/sport/football/LegendsHall.tsx            "Tüm efsaneler"
frontend/components/sport/football/PlayerRail.tsx             data-sig

backend/src/sport-archive/sport-archive.controller.ts   toplu okuma ucu
backend/src/sport-archive/sport-archive.service.ts      getAllPlayerImages()
```

---

## 6 · REDDEDİLEN YAKLAŞIM (tekrar önerilmesin)

Kullanıcı `setup-player-pages.sh` adında bir script getirdi: 23 git worktree +
23 tmux oturumu + 23 bağımsız Claude ajanı, her biri kendi bileşen ağacını
yazacaktı. **Çalıştırılmadı.** Gerekçeler:

1. **tmux bu makinede yok** (Windows 11 + Git Bash) — script satır 18'de
   `exit 1` veriyor. `claude` CLI de Bash PATH'inde yok.
2. Script'in kendi hataları: yeni worktree'de `.claude/players/` klasörü
   oluşmuyor (`set -e` ilk oyuncuda öldürürdü); `SHARED_RULES.md` yolu bir
   dizin eksik (23 ajanın hiçbiri ortak kuralları görmezdi); worktree'lerde
   `node_modules` yok, yani hiçbiri derleyemezdi.
3. Mimariye ters: küratör modunu 23 kez yeniden icat ettirir, `PlayerTimeline`
   diye var olmayan bir bileşen adı kullanır, `Chelsea mavisi` / `soğuk
   mavi-beyaz` diyerek **"lacivert yok" kuralını çiğner**, ve `/efsaneler`
   diye ikinci bir rota açardı (doğrusu `/spor/futbol/efsaneler`).
4. 23 paralel Opus + 23 Next derlemesi — RAM riski (§4.4).

Script'in **haklı çıktığı iki nokta** uygulandı: Hagi'nin sayfası yeniden
üretilmedi, ve eksik olan efsaneler index'i gerçekten yazıldı.
