# KuroNexus — Güvenlik Çalışması Günlüğü

> **Bu dosyaya asla parola, token veya bağlantı dizesi yazılmaz.** Yalnızca
> "değiştirildi / doğrulandı" gibi olgular kaydedilir. *(Doğrulandı: dosyada
> 0 sır eşleşmesi.)*
>
> ⚠️ **Depo bir gün PUBLIC yapılacaksa bu dosya önce çıkarılmalıdır.**
> Başta `.gitignore`'daydı; eve/diğer makineye taşınabilmesi için 4 Ağustos
> 2026'da depoya alındı. Gerekçe: kritik açıklar kapandı, depo private ve
> 0 collaborator var — belge artık "yapılacaklar" değil "yapıldı" listesi.

---

# 📌 DEVİR NOTU — 5 Ağustos 2026, iş yeri oturumu

**Kaldığımız nokta:** Madde 8 (JWT → HttpOnly çerez) tamamlandı ve canlıda
doğrulandı. **Güvenlik listesinin 0–11 arası tüm maddeleri kapandı.** Kalan
işler artık "açık güvenlik açığı" değil, iyileştirme sırası.

## Şu an sistemin durumu: 🟢 Çalışıyor ve güvende

| | Durum |
|---|---|
| Site | ✅ Çalışıyor (kuronexus.com) |
| Backend + frontend deploy | ✅ İkisi de sağlıklı |
| Veritabanı | ✅ 250 kitap, yedekleme çalışıyor |
| Uzak depo `main` | `42b13db` — 5 Ağu iş yeri oturumu sonrası |
| CSP | ✅ **Zorunlu** (report-only değil), canlıda doğrulandı |
| Sırlar | ✅ `JWT_SECRET`, `DATABASE_URL`, `APIFY_TOKEN`, `KAGGLE_API_TOKEN` rotate |
| Oturum | ✅ **HttpOnly + Secure + SameSite=Lax çerez** — token JavaScript'e kapalı |
| Konteyner | ✅ `root` değil, `node` kullanıcısı |
| Futbol oyuncu fotoğrafları | ⚠️ **Görünmüyor** — CSP kaynaklı, bilinçli olarak bekletiliyor (aşağıda) |

## ✅ 5 Ağustos'ta kapananlar

1. **Madde 8 — JWT HttpOnly çereze taşındı** (iki fazlı deploy, canlıda doğrulandı)
2. **Fontlar `next/font`e taşındı, CSP daraltıldı** — ziyaretçi IP'si artık
   Google'a gitmiyor (iki fazlı, ölçümle doğrulandı)
3. **Dockerfile sertleştirildi (Ö-4)** — migration hatası artık yutulmuyor,
   `/health` ucu eklendi, konteyner `root` yerine `node` kullanıcısıyla çalışıyor
4. **Kadro düzeltme ucuna DTO doğrulaması (Ö-2)** — gövde hiç denetlenmiyordu
4. Devir notundaki `backend/.env` maddesi **düştü** — o dosya iş yeri PC'sinde
   hiç yokmuş, dolayısıyla bayat sır de yok

Ayrıntılar: **"İş yeri oturumu — 5 Ağustos"** bölümü.

---

## ⚡ SIRADAKİ İŞLER

### 1️⃣ ⚠️ Slug altyapısı (K-2, K-3, R-1) — ÖNCE PLAN GEREKİR
`BookEntry.slug` kolonu + `SlugHistory` + 301 yönlendirme, ardından `getDetail`
in `findUnique({ where: { slug } })`'a çevrilmesi.

**Bu iş bir Prisma migration'ı içeriyor.** İş yeri makinesinde Docker kurulu
değil, yani lokal veritabanı yok → migration **doğrudan üretim veritabanında**
ilk kez çalışacak. 250 kitaplık gerçek veri var. Başlamadan önce: taze yedek,
yazılı geri alma senaryosu, tercihen bir kopya DB üzerinde prova.
Aceleye getirilmemeli.

---

## ⚠️ AÇIK ARIZA — futbol oyuncu fotoğrafları görünmüyor (5 Ağustos 2026)

**Belirti:** Kadro ızgarası, transfer haberleri ve oyuncu detay sayfasında
oyuncu fotoğrafları boş.

**Sebep — ölçüldü, tahmin edilmedi:** Veri sağlam. `/football/squad` ucundan
alınan 35 oyuncunun **35'inde de** fotoğraf adresi dolu ve güncel:
`https://img.a.transfermarkt.technology/...`. Sorun tamamen görüntüleme
tarafında: bu adres CSP'nin `img-src` beyaz listesinde **yok**, tarayıcı
görselleri engelliyor.

**Ne zamandan beri:** 4 Ağustos akşamı CSP zorunlu hâle geldiğinde. 5 Ağustos
değişiklikleriyle ilgisi yok.

❌ **İlk tahmin yanlıştı:** "Kaggle API'yi sildiğimiz için" düşünüldü. Kaggle
token'ı silinmedi, **rotate edildi ve doğrulandı**; tamamen çıkılan servis
Apify'dı. Veritabanındaki 35 fotoğraf adresi bunun kanıtı.

📌 **Ders — CSP turu rota envanteriyle yapılmalı.** 4 Ağustos'taki tarama
"genel sayfalar + 10 admin sayfası" olarak yapılmıştı; futbol sayfaları
listede yoktu ve tek eksik kaynak orada saklıydı. Bir sonraki CSP değişikliğinde
tarama, sayfa listesi üzerinden değil **tüm rotalar** üzerinden yapılmalı.

*(Aynı hata ikinci kez yapılmasın diye tüm futbol uçlarındaki dış adresler
toptan tarandı — `img.a.transfermarkt.technology` dışında engellenen başka
kaynak yok.)*

### İki çözüm — bilinçli olarak ERTELENDİ
| | Yöntem | Bedeli |
|---|---|---|
| **A** | Adresi `img-src`e ekle (tek satır) | Her ziyaretçinin IP'si Transfermarkt'a gider — **aynı gün Google fontları için kapattığımız sızıntının aynısı** |
| **B** | Fotoğrafları kendi sunucumuza aynala | Doğru çözüm. Desen zaten var: kitap kapakları `book-cover.service.ts` ile indiriliyor. Ama senkron kodunun içine giriyor |

**Karar (kullanıcı, 5 Ağustos):** İkisi de şimdi yapılmayacak. Gerekçe: IP
sızıntısı aynı gün kapatıldı, aynı gün geri açmak tutarsız olurdu. Fotoğraflar
birkaç gün eksik kalabilir.

**B, futbol fazının ilk maddelerinden biri olacak** — o kod zaten elden
geçirilecek, aynalama oraya doğal biçimde girer. Planlanırken: senkron
sırasında mı indirilecek, mevcut 35 oyuncu için geri dolum nasıl olacak,
`/uploads` altında hangi klasör.

---

### Sonraki turda ele alınacaklar
- `script-src 'unsafe-inline'` → nonce tabanlı (bilinen kalan zayıflık)
- 26 Dependabot uyarısı (19 yüksek, 7 orta) — push çıktısında görünüyor
- Futbol veri kaynağı kararı: Apify artık uygun değil, Maçkolik fizibilitesi
  incelenmedi (bkz. "Futbol veri kaynağı" bölümü)
- `TM_SEASON` kodda `'2024'` varsayılanıyla geliyor, Coolify'da tanımlı değil
- Kaggle Legacy API Credentials kapatıldı ✅ (4 Ağu akşamı)

## Sonrasında devam edilecek yön

Kullanıcının belirttiği hedef: **mevcut sitenin iyileştirilmesi**, ardından
**yeni web sitesi tasarımı**. Elde hazır iki girdi var:

1. **Mimari inceleme raporu** (4 Ağustos, sohbette) — 4 kritik, 13 önemli,
   çok sayıda iyileştirme bulgusu. Güvenlik maddeleri kapandı; **performans,
   SEO, kod tekrarı ve refactor maddeleri duruyor.** Öne çıkanlar:
   - 🔴 K-2: Kitap slug'ları dizi indeksinden türetiliyor → kalıcı olmayan URL
   - 🔴 K-3: Her detay isteği tüm tabloyu okuyor
   - 🟠 Ö-7: sitemap / robots / hreflang / canonical / OG **hiçbiri yok**
   - 🟠 Ö-10, Ö-11: React performans hataları, `unoptimized` 53 yerde
   - 🟡 İ-1: Film/dizi/anime/kitap kanatları birbirinin kopyası (~%60 tekrar)
2. **30 skill'lik tasarım araç seti** (4 Ağustos'ta kuruldu, `~/.claude/skills`)

---

## 🔴 AÇIK OLAY — Üretim sırları sohbete yapıştırıldı (4 Ağustos 2026)

**Ne oldu:** Adım 9 sırasında Coolify'ın "Developer view" ekranı (değişkenleri
düz metin gösteren görünüm) açıldı ve tüm üretim ortam değişkenleri değerleriyle
birlikte sohbete yapıştırıldı.

**Sorumluluk paylaşımı:** Asistan "Developer view'a bas ve ekran görüntüsü
gönder" dedi ve o istekte **maskeleme uyarısını tekrarlamadı** (önceki adımda
uyarmıştı). Kullanıcıyı o ekrana yönlendiren talimat hatalıydı.

**Etkilenen değerler** *(değerler kayda geçirilmez — yalnızca adlar)*:
`DATABASE_URL` (bugün değiştirilen yeni parola) · `JWT_SECRET` ·
`APIFY_TOKEN` · `KAGGLE_API_TOKEN` · `FOOTBALL_API_KEY` · `TMDB_API_KEY` ·
`TMDB_READ_ACCESS_TOKEN` · `GOOGLE_BOOKS_API_KEY`

**Gerçekleşen risk seviyesi: DÜŞÜK** — `check.js` olayından çok farklı:

| | `check.js` (12 Temmuz) | Bu olay (4 Ağustos) |
|---|---|---|
| Nereye gitti | **Herkese açık GitHub** | Özel sohbet kaydı |
| Kimler erişebilir | İnternetteki herkes + tarayıcı botlar | Çok dar |
| Süre | 23 gün | — |

Yine de ilke aynı: **sınırının dışına çıkan sır, ele geçirilmiş sayılır.**

### 🔄 ROTASYON PLANI (öncelik sırasıyla)

| # | Sır | Aciliyet | Neden bu sırada |
|---|---|---|---|
| 1 | ✅ **`JWT_SECRET`** *(4 Ağu akşamı yapıldı, doğrulandı)* | 🔴 En yüksek | Bu anahtarla saldırgan **admin token'ı üretebilir**; API internete açık. *(Hafifletici: guard `sub` alanını DB'den doğruluyor, saldırganın admin cuid'ini de bilmesi gerekir.)* ⚠️ Değişince mevcut admin oturumu düşer, yeniden giriş gerekir. |
| 2 | ✅ **`DATABASE_URL`** parolası *(4 Ağu akşamı yapıldı, doğrulandı)* | 🔴 Yüksek | Bugün ikinci kez. Prosedür Adım 1'de yazılı, ~10 dk. |
| 3 | ✅ **`APIFY_TOKEN`** *(rotate edildi, ardından Apify'dan tamamen çıkıldı)* | 🟠 | **Ücretli servis** — kötüye kullanım faturaya yansır |
| 4 | ✅ `KAGGLE_API_TOKEN` *(4 Ağu akşamı, doğrulandı; eski token + legacy iptal edildi)* | 🟠 | Hesap erişimi |
| 5 | ⚖️ `TMDB_API_KEY` + `TMDB_READ_ACCESS_TOKEN` *(kabul edilmiş artık risk)* | 🟡 | Kota kullanımı |
| 6 | ⚖️🔒 `GOOGLE_BOOKS_API_KEY` *(kısıtlandı; rotasyon: kabul edilmiş artık risk)* | 🟡 | Kota kullanımı |
| 7 | 🗑️ `FOOTBALL_API_KEY` *(rotate edilmedi — kodda ölü, 4 değişken silindi)* | 🟡 | Kota kullanımı |

3–7 arası anahtarlar ilgili servislerin **kendi panellerinden** yenilenir.

### Aynı geçişte yapılacak diğer işler (Adım 9'un aslı)

- **Tüm değişkenlerde `Available at Buildtime` işaretini KALDIR**
  *(`Available at Runtime` işaretli kalsın)*
  Sebep: Coolify her build değişkeni için Dockerfile'a `ARG` ekliyor ve
  `ARG` değerleri **imaj katmanlarına kalıcı olarak yazılıyor** —
  `docker history --no-trunc` ile düz metin okunabiliyor.
  Backend'de **hiçbir değişken derleme zamanında gerekmiyor**: Dockerfile
  `prisma generate` için kendi sahte `DATABASE_URL`'ini zaten koyuyor.
  ⚠️ **Frontend'de yapma** — `NEXT_PUBLIC_*` derleme anında koda gömülüyor.

- **"Preview Deployments Environment Variables" bölümünü tamamen sil.**
  Preview Deployments kullanılmıyor. Üstelik o bölümdeki `DATABASE_URL`
  hâlâ **12 Temmuz'da sızan eski parolayı** taşıyor — uykuda risk.

- Sonra **tek redeploy** + doğrulama: site açılıyor mu, admin girişi
  çalışıyor mu, arama çalışıyor mu, deploy logunda `SecretsUsedInArgOrEnv`
  uyarısı kayboldu mu.

⚠️ **Rotasyon sırasında hiçbir değer sohbete yazılmaz.** Doğrulama gerekirse
"ilk 4 karakteri şu mu?" biçiminde sorulur.

---

## 🏠 Ev oturumu — 4 Ağustos 2026 akşamı

Maddeler 10, 9 ve 11'in `JWT_SECRET` ayağı burada kapandı.

### Depo senkronizasyonu (madde 10) ✅
Uyarıda yazan sıra aynen uygulandı: **önce** skiller `~/Desktop/skill-yedek`'e
kopyalandı (442 dosya), **sonra** `git reset --hard origin/main`.

- Ev PC'si 113 ileri / 120 geri ayrışmıştı (force-push nedeniyle). 113 yerel
  commit'in 108'i zaten uzakta mevcuttu; kalan 5'i yalnızca silinen skill
  dosyaları, `check.js` ve `kapaklar` gibi 0 baytlık çöpler yüzünden farklıydı.
  **Kod kaybı yok.** Eski geçmiş `yedek/eve-donus` dalında donduruldu.
- ⚠️ Düz `git pull` denenseydi merge, kasten temizlenen 361 skill dosyasını ve
  `check.js`'i **geri diriltecekti**. Reset değil, merge tehlikeliymiş.
- Skiller geri kondu, artık gitignore'lu → git işlemlerinden etkilenmiyorlar.
- Ev PC'sinde `pnpm` kurulu değil, `corepack enable` yönetici izni istiyor.
  Çözüm: `npx --yes pnpm@11.13.1 install` (sürüm `node_modules/.modules.yaml`
  içindeki `packageManager` alanından okunur; yanlış major node_modules'ü
  silmek ister). Backend ve frontend derlemeleri temiz.

### `JWT_SECRET` rotasyonu (madde 11/1) ✅
Sır ev PC'sinde `node -e "…randomBytes(48).toString('base64url')" |
Set-Clipboard` ile üretildi — **değer hiçbir noktada sohbete düşmedi**, ekrana
da basılmadı. 48 bayt / 384 bit / 64 karakter.

Canlıda doğrulandı: çıkış → yeniden giriş çalışıyor (yeni anahtarın devrede
olduğunun tek geçerli kanıtı), admin işlemleri 401 vermiyor, arama sağlam.

Kod tarafı ön kontrolü: uygulamayı **başlamaktan alıkoyan** yalnızca iki
değişken var — `auth.module.ts` → `JWT_SECRET`, `prisma.service.ts` →
`DATABASE_URL`. Geri kalanlar `get` ile okunuyor, eksik olsalar da uygulama
kalkıyor.

### Docker ARG temizliği (madde 9) ✅
Backend'deki **17 değişkenin tamamında** `Available at Buildtime` kapatıldı,
`Available at Runtime` doğrulandı. Dockerfile incelendi: derleme aşamasında
gerçek sır **hiç gerekmiyor** — `prisma generate` için kendi sahte
`DATABASE_URL`'ini koyuyor. Frontend'e bilinçli olarak dokunulmadı
(`NEXT_PUBLIC_*` derlemede gömülmek zorunda).

### 🔴 Preview bölümünde iki sızıntı kalıntısı bulundu — silindi
`Preview Deployments Environment Variables` bölümünde 12 değişken vardı,
hepsinin Production'da güncel karşılığı doğrulandıktan sonra tamamı silindi.
İçlerinde **beklenmedik iki kalıntı** çıktı:

- `DATABASE_URL` → 12 Temmuz'da sızan **eski parola**
- `JWT_SECRET` → 4 Ağustos'ta sızan **eski anahtarın ikinci kopyası**

Yani rotasyon yalnızca Production'da yapılsaydı, sızmış anahtar panelde yazılı
kalmaya devam edecekti. **Ders: rotasyonda tüm ortam bölümleri taranmalı.**

### ⚠️ ÖNEMLİ TUZAK — "Build step skipped"
İlk redeploy'un logunda şu satır çıktı:

```
No build configuration changed & image found (…) with the same Git Commit SHA.
Build step skipped.
```

Coolify, git commit'i değişmediği için **imajı yeniden kullandı**. Sonuçları:

- Ortam değişkenleri **yine de uygulandı** (runtime enjeksiyonu) → `JWT_SECRET`
  rotasyonu gerçekten oldu.
- Ama buildtime temizliği **imaja yansımadı**; eski imaj kullanımda kaldı.
- `SecretsUsedInArgOrEnv` uyarısının kaybolması **yanlış pozitifti** — uyarı
  derleme sırasında üretilir, derleme hiç çalışmadığı için görünmedi.

O imaj bugün iş yerinde, buildtime açıkken ve `DATABASE_URL` rotasyonundan
**sonra** derlenmişti → geçerli DB parolasını katmanlarında taşıyordu.

Çözüm: `Advanced` menüsünden **zorla yeniden derleme**. İkinci deploy'da gerçek
derleme koştu (`Building docker image started/completed`, ~94 sn) ve temiz imaj
eskisinin yerini aldı.

📌 **Kural: ortam değişkeni değişikliği sonrası sırların imajdan çıktığını
doğrulamak istiyorsan normal redeploy yetmez — zorla yeniden derleme gerekir.**

### `GOOGLE_BOOKS_API_KEY` — kaza ve sonuç 🔒
Preview temizliği sırasında bu değişken **yanlışlıkla Production'dan da**
silindi. Etkisi ölçüldü ve sınırlıydı: `get` ile okunuyor, uygulamayı
düşürmüyor; kitap araması üç bacaklı ve `allSettled` ile korunuyor, yalnızca
Türkçe baskı sıralaması zayıflıyordu.

Kullanıcı **mevcut anahtarı** geri koymayı tercih etti ve **kısıtlamaları
uyguladı**: `API restrictions → Books API`, `Application restrictions → IP`.
Canlıda kitap araması doğrulandı.

📌 Bu anahtar için **kısıtlama, rotasyondan daha değerli**: `Books API` + tek IP
ile kilitli bir anahtar sızsa bile saldırganın elinde işe yarar bir yetenek
bırakmaz.

⚠️ **Kayıt çelişkisi — çözüldü:** Kullanıcı önce bu anahtarı hiçbir yerde
paylaşmadığını düşündü. Ardından iş yeri sohbet geçmişini kontrol etti ve
`Developer view` çıktısının sohbete yapıştırıldığını **doğruladı**. Yani anahtar
ifşa edilmiş durumda ve bu belgenin "Sır ifşası" bölümü geçerli.

Anahtar şu an kısıtlamalarla korunuyor, ama **rotasyon maddesi geçerliliğini
koruyor** — yeni anahtar üretilmeli. Aynı teyit, rotasyon listesinin 3–7 arası
maddelerinin de gerçekten gerekli olduğunu gösteriyor.

### `DATABASE_URL` rotasyonu — ikinci tur (rotasyon listesi madde 2) ✅
Sabah yapılan rotasyon (Adım 1) öğleden sonraki ifşa yüzünden geçersiz kalmıştı;
bu, aynı parolanın **aynı gün ikinci kez** değiştirilmesi.

**Sıralama Adım 1'dekinden bilinçli olarak farklı kuruldu.** Adım 1'de önce
parola değiştirilmiş, sonra `DATABASE_URL` güncellenmişti — bu sıra, aradaki
sürede çalışan backend'in yeni bağlantı açamamasına yol açıyor. Bu turda:

1. Taze yedek (`Backup Now` → `Success`, **4,54 MB**, DB `Running (healthy)`)
2. `DATABASE_URL` yeni parolayla **kaydedildi ama uygulanmadı**
   (Coolify env değişikliğini redeploy'a kadar uygulamıyor — canlı etkilenmedi)
3. Parola veritabanında değiştirildi
4. **Hemen** redeploy

Böylece açık pencere dakikalardan saniyelere indi.

**Parola:** 40 karakter, yalnızca `[A-Za-z0-9]` (~238 bit entropi). Alfabe
bilinçli olarak dar tutuldu: `@ : / ? #` gibi karakterler bağlantı dizesinde
ayırıcı görevi görür ve URL'yi yanlış yerden böler — üstelik hata mesajı
"parola yanlış" demez, teşhis saatler alır.

**Yöntem:** Adım 1d'deki gibi `\password postgres`. `ALTER USER` yine
kullanılmadı. Değişim `md5(rolpassword)` parmak izi karşılaştırmasıyla
kanıtlandı (öncesi ≠ sonrası).

**Parola yönetimi:** Yeni parola ayrı bir kayda yazıldı, **eski kayıt
doğrulama bitene kadar korundu**. Emniyet kemeri yine `trust` yetkilendirmesi:
`psql -U postgres` konteyner içinden parolasız bağlanıyor, yani yanlış parola
yazılsa bile geri dönülebilir.

**Doğrulama — "site açılıyor" yeterli sayılmadı:**
- Raflar **dolu** geldi (asıl kanıt)
- Arama çalışıyor
- Admin paneli çalışıyor — `jwt-auth.guard.ts` her istekte kullanıcıyı DB'den
  okuduğu için bu tek test hem kimlik doğrulamayı hem DB bağlantısını kanıtlıyor

📌 Bu ısrarın sebebi Adım 1e'de gözlenen davranış: DB'ye ulaşılamadığında site
HTTP 200 dönüyor ve sayfalar açılıyor, ama raflar **sessizce boş** geliyor
(`lib/api/*.ts` içindeki `catch { return [] }`, inceleme raporu bulgu Ö-8).
Bu projede "hata görmedim" ile "çalışıyor" aynı şey değil.

### Rotasyon turunun kalanı (maddeler 3–7) ✅

#### Madde 3 — `APIFY_TOKEN`: rotate edildi, sonra Apify'dan tamamen çıkıldı
Yeni token üretilip Coolify'a kondu, ama doğrulama yapılamadı: **Apify ücretsiz
kotası tükenmişti** (`$5.00/$5.00`, panelde *"Actors and other platform features
are disabled"*, yenilenme 2026-08-16). Günde bir koşan tek actor ücretsiz
katmanı tam ay taşımıyor.

Bunun üzerine Apify'dan tamamen çıkıldı: Coolify'daki `APIFY_TOKEN` silindi,
**Apify panelindeki iki token da** (sızan `Default API token` + yeni üretilen)
iptal edildi. Kod tarafında `if (!this.apifyToken) return;` koruması olduğu için
günlük Süper Lig senkronu sessizce atlanıyor, uygulama etkilenmiyor.

⚠️ **ÖNEMLİ DERS — ortam değişkenini silmek anahtarı iptal etmez.**
Kullanıcı önce yalnızca Coolify'daki `APIFY_TOKEN` değişkenini sildi ve iş
bitti sandı. Oysa ortam değişkeni anahtarın bir **kopyası**; sızan anahtar
sağlayıcının veritabanında geçerli kalmaya devam ediyordu. İptal ancak
sağlayıcının panelinden yapılır. *Kilidi değiştirmek yerine adres defterinden
kapı numarasını silmek gibi.*

#### Madde 4 — `KAGGLE_API_TOKEN`: rotate edildi ve doğrulandı
Kaggle'ın yeni arayüzü **üst üste binmeye izin veriyor** (*"Creating a new token
doesn't expire any existing tokens"*) → yeni token doğrulanmadan eskisi
silinmedi.

- Kötüye kullanım kontrolü: eski token'ın `Last Use Time` değeri **sızıntıdan
  önceydi** ("2 days ago") → sızıntı sonrası kullanılmamış, temiz.
- Doğrulama: `POST /admin/football/sync` ile kadro senkronu elle tetiklendi,
  `GET` ile sonuç okundu → `ok: true`.
- Ardından eski `Kuronexus` token'ı silindi ve **Legacy API Credentials** de
  kapatıldı (kullanıcı Kaggle CLI kullanmadığını teyit etti — kullanılmayan
  kimlik bilgisi açık kapıdır).

📌 **Mimari not:** "Transfermarkt senkronu" aslında Kaggle üzerinden çalışıyor —
kod, Transfermarkt verisini barındıran bir **Kaggle veri setini** indiriyor
([football.service.ts:603](backend/src/football/football.service.ts:603)),
doğrudan siteyi kazımıyor. Yani Kaggle bağımlılığı canlı ve gerekli.

#### Madde 7 — `FOOTBALL_*`: rotate edilmedi, **silindi**
`FOOTBALL_API_KEY`, `FOOTBALL_API_HOST`, `FOOTBALL_SEASON`, `FOOTBALL_TEAM_ID`
için `backend/src` ve `backend/scripts` altında **sıfır kullanım** bulundu —
API-Football döneminden kalma artıklar. Dördü de Coolify'dan silindi.

Futbol servisi bambaşka değişkenler okuyor: `TM_TEAM_ID`, `TM_SEASON`,
`APIFY_TR_SEASON`, `KAGGLE_*`. İlk üçü Coolify'da tanımlı değil, kod
varsayılanlarıyla çalışıyor.

📌 *İşlevsel bulgu (güvenlikle ilgisiz):* `TM_SEASON` kodda `'2024'`
varsayılanıyla geliyor ve Coolify'da tanımlı değil — 2026'da 2024 sezonuna
bakıyor olabilir. Futbol turunda kontrol edilmeli.

#### Maddeler 5–6 — ⚖️ Kabul edilmiş artık risk (rotate EDİLMEDİ)
`TMDB_API_KEY`, `TMDB_READ_ACCESS_TOKEN` ve `GOOGLE_BOOKS_API_KEY` bilinçli
olarak yenilenmedi. **Bu "güvenli" demek değil — sızdıkları biliniyor.**

Kullanıcının gerekçesi ve değerlendirme:
- **Etki yalnızca kota.** Para çıkışı yok, hesap ele geçirme yok, veri erişimi
  yok. Listenin en alt basamağı.
- **Google Books ayrıca kısıtlı:** `Books API` + tek IP (`65.108.220.5`).
  Sızsa bile eline geçen kişi yalnızca bu sunucudan kitap arayabilir. Bu
  anahtar için kısıtlama, rotasyondan daha etkili bir korumadır.
- **TMDB'de yenileme yolu belirsiz** — bazı kurulumlarda API erişimini silip
  yeniden talep etmeyi gerektiriyor, bu da film/dizi veri akışını kesebilir.
  Koruma maliyeti riskten büyük görüldü.

**Doğrulamanın sınırı (kayıt doğruluğu için):** Kaggle ve Apify panellerinde
sızıntı sonrası kullanım izi olmadığı **doğrulandı**. TMDB ve Google Cloud
panelleri **kontrol edilmedi** — bu iki anahtar için "kullanılmamış" bir
gözlem, ölçüm değil.

🔔 **Bu kararı ne bozar:** TMDB'den beklenmedik `429`'lar, Google Cloud'da
tanımadığın kullanım, ya da kota anormalliği. Böyle bir şey görürsen bu
maddeyi yeniden aç ve rotate et.

📌 *Ayrıca:* `TMDB_API_KEY` üretimde **hiç okunmuyor** — kod
`TMDB_READ_ACCESS_TOKEN ?? TMDB_API_KEY` şeklinde okuyor ve ilki tanımlı
([tmdb.service.ts:174](backend/src/movies/tmdb.service.ts:174)). İleride
tutulan sır sayısını azaltmak istenirse bu değişken silinebilir; koddaki yedek
mekanizma yerinde kalır.

#### Futbol veri kaynağı — açık karar
Apify artık uygun değil (ücretsiz katman bir ayı taşımıyor). Değerlendirilen
yön: oyuncu/kadro **Transfermarkt-üzerinden-Kaggle** (mevcut, çalışıyor), puan
durumu + canlı skor **Maçkolik**. Fizibilite **incelenmedi**.

⚠️ İki iş aynı zorlukta değil: puan durumu/fikstür günde bir çekilir (orta),
**canlı skor maç sırasında sık yoklama** ister (zor — engellenme riski,
zamanlama, frontend'de canlı güncelleme). Ayrı fazlar olarak ele alınmalı.
Ayrıca kaynağın kullanım şartları ve `robots.txt` kontrol edilmeli.

📌 *Uç adresi notu:* Futbol denetleyicisinde **iki controller** var —
genel uçlar `@Controller('football')`, yönetici uçları
`@Roles('ADMIN') @Controller('admin/football')`
([football.controller.ts:46](backend/src/football/football.controller.ts:46)).
Senkron tetikleme adresi `/admin/football/sync`.

### CSP konsol turu ve zorunluluk (maddeler 7b-2, 7c) ✅

#### Ölçüm yöntemi — konsol tek başına yetmiyor
Planlanan yöntem "F12 → Console → `Content Security` filtresi" idi. Uygulamada
yetersiz kaldı: **Chrome ihlal mesajlarında adresleri `<URL>` diye gizliyor**,
yani "img-src ihlali var" diyor ama hangi sunucu olduğunu söylemiyor.

Bunun yerine her sayfada şu ölçüldü — sayfanın **gerçekten yüklediği** her
kaynağı listeleyip beyaz listeyle karşılaştırır:

```js
performance.getEntriesByType('resource')
```

Genel sayfalar tarayıcı panelinden (Node dışarı çıkamıyor ama tarayıcı
çıkabiliyor), 10 admin sayfası kullanıcı tarafından tarandı.

#### Bulunan üç eksik
| Kaynak | Nerede | İhlal |
|---|---|---|
| `s4.anilist.co` | anime kapak + banner görselleri | 172 |
| `fonts.googleapis.com` | `globals.css` 1. satırdaki `@import` | — |
| `fonts.gstatic.com` | o `@import`un çektiği font dosyaları | 29 |

Zorunlu hale getirilseydi **tüm anime görselleri ve üç font kırılırdı.**

⚠️ **Yanlış çıkan varsayım:** `next.config.ts` yorumu *"fontlar
next/font/google derleme anında self-host ediyor"* diyordu. Bu yalnızca
`layout.tsx`teki **dört** font için doğruymuş; `globals.css` ayrı bir `@import`
ile **üç fontu daha** doğrudan Google'dan çekiyor. Projede iki font yöntemi
var, yorum yalnızca birini biliyordu.

#### Yanlış alarm çıkanlar (kayda geçsin, tekrar araştırılmasın)
- `1k-cdn.com`, `covers.openlibrary.org`, `books.google.com` → yalnızca
  **sunucunun** kapak indirdiği kaynaklar ([book-cover.service.ts:30](backend/src/books/book-cover.service.ts:30)).
  Tarayıcı oralara hiç gitmiyor; kitap kapaklarının 59'u da kendi sunucumuzdan
  geliyor (ölçüldü).
- `dailymotion`, `www.youtube.com` → gömü değil, **bağlantı hedefi**. CSP
  `<a href>`i kısıtlamaz. Gömülen tek şey `youtube-nocookie`.
- Jikan (MyAnimeList) → serviste görsel alanı yok, MAL CDN'i kullanılmıyor.

#### Zorunluluk ve canlı doğrulama
Üç eksik eklendi, `Content-Security-Policy-Report-Only` →
`Content-Security-Policy` yapıldı, tek deploy'da yayına alındı.

Canlıda doğrulandı:
- Başlık artık `content-security-policy` (report-only eki yok)
- AniList görseli zorlanarak yüklendi → `YUKLENDI`
- `document.fonts.load()` ile Cormorant Garamond ve Corinthia → ikisi de
  `true`
- `fonts.googleapis.com` (1) ve `fonts.gstatic.com` (4) istekleri ağ kaydında
  görünüyor — CSP engellese **istek hiç yapılmazdı**

📌 **Geri alış:** `next.config.ts`te başlık anahtarının sonuna `-Report-Only`
eklemek yeterli. Tek kelimelik düzenleme, bir deploy.

📌 **SONRAKİ İŞ — fontları taşı.** Üç fontu (`Cormorant Garamond`, `Corinthia`,
`Noto Sans Old Turkic`) `next/font/google`'a taşı, `globals.css` 1. satırdaki
`@import`u sil, sonra `fonts.googleapis.com` + `fonts.gstatic.com` girdilerini
CSP'den çıkar. Kazanç: dış istek sıfırlanır, **ziyaretçi IP'si Google'a
gitmez**, render engelleyen bir tur eksilir, CSP daralır. Bugün yapılmadı:
fontlar derleme anında indiği için değişiklik ev makinesinde doğrulanamıyor.

📌 **Kalan bilinen zayıflık:** `script-src 'unsafe-inline'`. Next.js hidrasyon
scriptleri satır içi olduğu için duruyor; nonce'a taşımak ayrı bir adım
(`next.config.ts` içinde gerekçesiyle yazılı).

### Coolify arayüz notları (ev oturumundan)
- Değişken listesi değerleri **maskeliyor** (nokta + göz simgesi). Bu sayfanın
  ekran görüntüsü güvenli. Kaçınılması gereken tek ekran hâlâ `Developer view`.
- Production ve Preview bölümlerini ayırt etmenin pratik yolu: Production'da
  artık tüm `Available at Buildtime` kutucukları kapalı.

---

## 🏢 İş yeri oturumu — 5 Ağustos 2026

Madde 8 kapandı. Ayrıca ortam hakkında iki kalıcı bulgu çıktı.

### Ortam bulguları (sonraki oturumlar için)

| Bulgu | Sonuç |
|---|---|
| `backend/.env` iş yeri PC'sinde **yok** | Devir notundaki "eski sırları güncelle" maddesi geçersiz — güncellenecek bayat sır de yok |
| Docker **kurulu değil** | Bu makinede lokal veritabanı kurulamaz → **backend lokalde çalıştırılamaz** |
| Tarayıcıda `kuronexus.com` **engelli** | Canlı doğrulama telefondan yapılıyor (curl/PowerShell erişimi var) |
| `npx` PowerShell'de engelli | `.ps1` çalıştırma politikası. **Politika değiştirilmedi** — `npx.cmd` kullanılıyor. Bir güvenlik korumasını kolaylık için gevşetmek yanlış olurdu |

Lokal çalıştırma imkânsız olduğu için doğrulama iki katmana bölündü:
**(1)** her değişiklikten sonra `tsc --noEmit` + gerçek derleme (Coolify'ın
sunucuda yapacağı işin aynısı), **(2)** küçük parçalar hâlinde deploy +
telefondan işlevsel test.

### Madde 8 — JWT HttpOnly çereze taşındı ✅

**Sorun:** Token `document.cookie` ile yazılıyordu, yani sayfada çalışan
**herhangi bir JavaScript** onu okuyabiliyordu. 4 Ağustos akşamı canlı olarak
gözlenmişti: admin token'ı konsoldan okunup API çağrısı yapıldı.

**Yöntem: iki fazlı deploy.** Giriş mekanizmasını değiştiren bir iş, yanlış
giderse kullanıcıyı kendi panelinden kilitler. Bu yüzden tek seferde değil,
geri dönüşü olan iki adımda yapıldı.

#### Faz A — yeni yol açıldı, eskisi kapatılmadı (`d2b1773`)
Backend `HttpOnly` çerez yazmaya başladı, guard onu okumayı öğrendi, ama giriş
yanıtı token'ı gövdede **döndürmeye devam etti**. Frontend hiç değişmedi →
deploy sonrası site tıpatıp aynı çalıştı. "Hiçbir şey değişmedi" bu fazda
başarı ölçüsüydü.

- `backend/src/common/auth-cookie.ts` *(yeni)* — çerezin tek tanım yeri
- `auth.controller.ts` — `Set-Cookie` + `POST /auth/logout`
- `jwt-auth.guard.ts` — önce çerez, sonra `Bearer` yedeği
- `main.ts` — CORS `credentials: true`
- Coolify'a `AUTH_COOKIE_DOMAIN=.kuronexus.com` eklendi (Buildtime **kapalı**)

📌 **Çerez adı bilinçli olarak değiştirildi:** `kuronexus-token` →
`kuronexus-session`. Aynı ad kullanılsaydı geçiş sırasında tarayıcıda iki ayrı
çerez aynı adı taşıyacaktı (biri JS'in yazdığı host-only, biri sunucunun
yazdığı alan adı geneli) ve hangisinin okunacağı belirsizleşecekti. Süresi
dolmuş olanın öne geçmesi, sebebi çok zor bulunan "bazen oturum düşüyor"
arızası üretirdi.

#### Faz A doğrulaması — şifresiz ölçüm
Yeni eklenen `POST /auth/logout` ucu deploy'un bittiğini anlamanın parolasız
göstergesi oldu (eski kodda 404, yenisinde 204). Üstelik o uç çerezi silme
başlığı gönderdiği için **hiçbir kimlik bilgisi girmeden** tüm çerez ayarları
okunabildi:

```
Set-Cookie: kuronexus-session=; Max-Age=86400; Domain=.kuronexus.com; Path=/;
            HttpOnly; Secure; SameSite=Lax
```

Ardından tek bir giriş yapılıp `Authorization` başlığı **olmadan**
`/auth/me` çağrıldı → **HTTP 200**. Yani çerez tek başına kimlik kanıtı olarak
kabul ediliyor. Bu ölçüm Faz B'nin ön koşuluydu; `401` gelseydi devam
edilmeyecekti.

CORS ön kontrolü de yapıldı (şifresiz, `OPTIONS`):
`Allow-Origin: https://kuronexus.com` + `Allow-Credentials: true`.

📌 Şifre gereken tek ölçümde `Read-Host -AsSecureString` kullanıldı — değer
ekrana basılmadı, komut geçmişine yazılmadı. Çıktıda çerezin **adı ve
özellikleri** gösterildi, **değeri (token) bilinçli olarak kesildi.**

⚠️ *Süreç notu:* `Read-Host` içeren bir bloğu PowerShell'e toplu yapıştırmak
çalışmıyor — açılan soru, yapıştırılan sonraki satırı "cevap" sanıp yutuyor.
Soru satırları tek tek yapıştırılmalı.

#### Faz B — eski yol kapatıldı (`42b13db`)
10 dosya, **129 satır eklendi / 171 satır silindi.** Açık kapatılırken kod da
azaldı.

- `frontend/lib/admin/auth.ts` **silindi** — `document.cookie` erişiminin tek
  kaynağı, yani açığın kendisi
- `lib/admin/api.ts` — **77** `authHeaders()` çağrısı kaldırıldı; token'ı elle
  başlığa koymaya gerek kalmadı
- `lib/api/client.ts` — `apiFetch`e `credentials: "include"` (API ayrı alan
  adında olduğu için varsayılan davranış çerezi göndermemek)
- `lib/auth/session.ts` — yeni çerez adını okuyor
- `AdminGuard.tsx` — "girişli miyim?" sorusu artık `/auth/me`ye soruluyor;
  çerez okunamadığı için başka yol yok
- `AccountMenu.tsx` — çıkış `/auth/logout` çağırıyor
- `dev-proxy` — `cookie` ve `set-cookie` iki yönde taşınıyor *(lokal geliştirme
  için; bu makinede sınanamadı)*
- `auth.controller.ts` — `accessToken` gövdeden çıktı: **açığı kapatan satır**

**Doğrulama:** Telefondan giriş ve admin işlemleri çalışıyor. Bu tek başına
yeterli kanıt: token artık yanıt gövdesinde hiç gönderilmiyor ve kodda
`document.cookie` erişimi yok — panel çalışıyorsa kimlik ancak HttpOnly
çerezle doğrulanmış olabilir.

*Ölçümün sınırı (kayıt doğruluğu için):* Giriş yanıtının gövdesinde token
olmadığı **kod düzeyinde kesin** (controller `{ user }` döndürüyor) ama canlıda
ayrıca ölçülmedi; işlevsel kanıt yeterli görüldü.

### Dockerfile: migration hatası artık yutulmuyor + `/health` ucu ✅ (`98cadb0`)

#### 🔴 Bulgu — başlangıç komutu hatayı gizliyordu
Konteynerin başlangıç satırı şuydu:
```sh
npx prisma migrate deploy || echo 'Migration warning — continuing' && node dist/main
```
`sh`de `||` ve `&&` **aynı önceliktedir** ve soldan sağa okunur, yani
`((A || B) && C)`. Migration patlarsa `echo` çalışıyor, `echo` her zaman
başarılı oluyor, zincir başarılı sayılıyor ve **uygulama yine de başlıyordu** —
kodun beklediği tablolar olmadan.

Bu projede o durum en sinsi arıza biçimine dönüşür: site 200 döner, sayfalar
açılır, **raflar sessizce boş gelir** (`catch { return [] }`, bulgu Ö-8). Daha
kötüsü, yarım göçmüş bir şemaya yazma yapılabilir.

**Düzeltme:** `npx prisma migrate deploy && node dist/main`. Migration
başarısız olursa konteyner hiç başlamaz; Coolify başarısız deploy'da eski
konteyneri devirmediği için site ayakta kalır ve gerçek hata deploy logunda
görünür. **Sessiz bozulma yerine gürültülü duruş.**

📌 *Bu düzeltme geri alınmamalı.* Eski zincir hatayı çözmüyordu, gizliyordu.

#### `/health` — veritabanına gerçekten dokunan tür
Boş bir `{ ok: true }` bu sistemde işe yaramazdı: site DB olmadan da 200
dönüyor. Uç `SELECT 1` ile veritabanına dokunuyor:
`200 {status:"ok",db:"up"}` / `503 {status:"error",db:"down"}`.
`@Public()` (izleme aracı giriş yapamaz) + `@SkipThrottle()` (düzenli yoklama
rate limit'i tüketmesin).

Canlı doğrulama: `GET https://api.kuronexus.com/health` → `200`,
`{"status":"ok","db":"up"}`. Tek istek hem yeni kodun yayında olduğunu hem de
DB bağlantısının sağlıklı olduğunu kanıtlıyor — kimlik bilgisi gerektirmeden.

### Kadro düzeltme ucuna DTO doğrulaması ✅ (`bc32f5b`, Ö-2)

`POST /admin/football/squad-overrides` ucunda `@Body()` **satır içi bir
TypeScript tipiyle** işaretliydi. TS tipleri derlemede yok olduğu için
`ValidationPipe`in doğrulayacağı bir sınıf kalmıyordu — yani `whitelist` ve
`forbidNonWhitelisted` açık olmasına rağmen **gövde hiç denetlenmiyordu.**
Projedeki tek istisna buydu; diğer uçların hepsinde DTO sınıfı var.

Somut sonuçları: `age: "abc"` → Prisma seviyesinde **500** (temiz 400 yerine) ·
hiçbir alan gönderilmezse şemada tüm alanlar opsiyonel olduğu için **her alanı
boş bir kadro kaydı sessizce oluşuyordu** · fazladan alanlar reddedilmiyordu.

`CreateSquadOverrideDto` yazıldı. Ucun iki kullanımı ("tmPlayerId verilirse
gizle / name verilirse ekle") `@ValidateIf` ile doğrulama katmanına taşındı:
ikisinden biri mutlaka gelmeli. `photo` yalnızca `http(s)://` ya da
`/uploads/` ile başlayabiliyor (`javascript:`/`data:` reddedilir).

Panelin kırılmadığı önceden kontrol edildi: `admin/squad/page.tsx` `age`i zaten
`Number()` ile gönderiyor, boş alanları `undefined` yapıyor.

📌 *Yan bulgu, düzeltilmedi:* `DELETE squad-overrides/:id` var olmayan bir id
ile çağrılırsa Prisma `P2025` fırlatıyor ve **500** dönüyor; doğrusu 404. Nokta
atışı bir `try/catch` aynı sorunun onlarca uçtaki hâlini gizlerdi — asıl çözüm
madde 11'deki global exception filter.

📌 *Biçimlendirme notu:* `football.controller.ts` ve `football.service.ts`
prettier'a uymuyor, **ama bu değişiklikten önce de uymuyordu** (HEAD hâli
kontrol edildi). `prettier --write` çalıştırılmadı: 3 dosyalık bir düzeltme
alakasız yüzlerce satırlık biçim değişikliğinin içinde kaybolmasın (4 Ağustos'ta
alınan kararla aynı çizgi).

### Konteyner artık `root` değil — `USER node` ✅ (`bda644e`)

**Neden değerli:** Uygulamada bir açık bulunursa saldırgan konteyner içinde tam
yetkiyle değil, sınırlı bir kullanıcıyla başlar.

#### Doğrudan yapılamazdı — önce ölçüldü
Yüklenen görseller `/app/uploads` altında ve orası **named volume**
(`xpvhr95pdd3n4orzuoty`, `UPLOAD_DIR=/app/uploads`). Docker'da **mount edilmiş
bir volume kendi sahipliğini korur** — imajdaki `chown` ona işlemez.

Konteyner terminalinden ölçüldü:
```
uid=0(root) gid=0(root)
drwxr-xr-x 3 root root 4096 Jul 31 19:33 /app/uploads
```
Yani doğrudan `USER node` eklenseydi uygulama o klasöre **yazamayacaktı** ve
görsel yükleme kırılacaktı. Üstelik sessizce: site açılır, `/health` yeşil
döner, arıza ancak bir kapak yüklenmeye çalışılınca ortaya çıkardı.

#### Sıra: önce volume, sonra imaj
1. Konteyner içinden **tek seferlik** `chown -R node:node /app/uploads`
   (volume'de kalıcı; konteyner değişse de kalır — bu, sonraki redeploy'da
   doğrulandı). Konteyner o an hâlâ root çalıştığı için bu adım hiçbir şeyi
   bozmadı: root dosya izinlerini dinlemez.
2. Sonra Dockerfile'a `USER node`.

Dockerfile'a ayrıca iki önlem kondu:
- `RUN mkdir -p /app/uploads && chown -R node:node /app/uploads` — ileride yeni
  bir ortam kurulursa volume ilk oluşturulurken sahipliği imajdan kopyalanır
- `ENV HOME=/home/node` — `npx prisma migrate deploy` ev dizinine yazmak
  isteyip `/root`'a takılırsa migration patlar ve (yeni kural gereği) konteyner
  hiç başlamazdı

⚠️ *Bu adım yerelde doğrulanamadı* — iş yeri makinesinde Docker yok, ilk gerçek
test Coolify derlemesi oldu. Riskin tavanı "bir deploy boşa gider"di: başarısız
deploy eski konteyneri devirmiyor.

**Doğrulama — üç aşama, üçü de geçti:**
`/health` → `200 {"status":"ok","db":"up"}` (konteyner kalktı **ve** migration
`node` kullanıcısıyla çalıştı) · terminalde `id` → `uid=1000(node)` ·
**admin panelinden gerçek görsel yüklendi** → sorunsuz.

📌 Üçüncüsü şart: yazma izni sorunu diğer iki testin hiçbirinde görünmezdi.

### Fontlar `next/font`e taşındı, CSP daraltıldı ✅

**Sorun:** `globals.css` 1. satırındaki `@import` üç fontu (Cormorant Garamond,
Corinthia, Noto Sans Old Turkic) doğrudan Google'dan çekiyordu → **her
ziyaretçinin IP adresi Google'a gidiyordu.** Ayrıca render'ı engelleyen bir dış
istek turu ekliyordu.

#### 🔴 Naif taşımanın sessizce bozacağı şey — geç fark edilseydi pahalıydı
Editördeki font seçicisi ([RichTextEditor.tsx:299](frontend/components/admin/RichTextEditor.tsx:299))
iki font için **düz font adı** üretiyordu:

| Seçenek | Ürettiği değer |
|---|---|
| Cinzel | `var(--font-cinzel)` ✅ zaten değişken |
| Corinthia | `'Corinthia', cursive` ⚠️ |
| Orhun | `'Noto Sans Old Turkic', sans-serif` ⚠️ |

Bu değerler **hikâyelerin içine satır içi `style` olarak veritabanına
kaydedilmiş** durumda. `next/font` ise fontu self-host ederken ona üretilmiş
bir ad veriyor (`__Corinthia_a1b2c3` gibi) — düz `'Corinthia'` adı hiçbir şeye
karşılık gelmez hale gelir. Yani doğrudan taşıma, **eski hikâyelerdeki özel
fontları hata vermeden düşürürdü.**

**Çözüm — veritabanına dokunmadan köprü:** `globals.css`e iki kural eklendi:
```css
[style*="corinthia" i]  { font-family: var(--font-corinthia), cursive !important; }
[style*="old turkic" i] { font-family: var(--font-runic) !important; }
```
`i` bayrağı şart: eski kayıtlar `'Corinthia'`, editör artık
`var(--font-corinthia)` yazıyor — seçici ikisini de yakalamalı. Aynı sebeple
`PaginatedReader.module.css`teki punto kuralının seçicisi de `i` aldı.

📌 *Ders: bir fontu taşımadan önce "bu font adı kullanıcı içeriğinin içine
kaydedilmiş olabilir mi?" diye sorulmalı. Cinzel'in doğru desende olması,
diğer ikisinin geride kaldığını gizlemişti.*

#### Faz 1 — fontlar taşındı, CSP'ye dokunulmadı (`7bbda2b`)
`layout.tsx`e üç font eklendi (mevcut dört fontun deseni izlendi),
`globals.css`teki `@import` silindi, `--font-runic` yeni değişkenden besleniyor.
`--font-cormorant`ın `globals.css`teki tanımı **kaldırıldı** — next/font onu
zaten tanımlıyor, ikisi aynı öğeye çarpsaydı hangisinin kazandığı CSS sırasına
kalırdı; eski fallback zinciri (`Georgia, Times New Roman`) next/font'un
`fallback` alanına taşındı.

Nadir kullanılan iki fontta `preload: false` (ziyaretçilerin çoğu onları hiç
görmüyor). Derleme **153 woff2 dosyası** üretti — self-host doğrulandı.

CSP bilinçli olarak bu fazda değiştirilmedi: gözden kaçan bir şey varsa site
kırılmasın, ölçebilelim.

#### Faz 2 — CSP daraltıldı (`60496a9`)
Önce ölçüldü (tahmin edilmedi): canlı sitede 4 rota (`/`, `/dark-stories`,
`/dark-stories/category/kitap`, `/en`) ve her birinin yüklediği CSS paketleri
indirilip tarandı → `fonts.googleapis.com` + `fonts.gstatic.com` için
**0 referans**. Ardından iki girdi de CSP'den çıkarıldı:

```
style-src 'self' 'unsafe-inline'      (googleapis çıktı)
font-src  'self' data:                (gstatic çıktı)
```

Canlı doğrulama: başlık `Content-Security-Policy` (Report-Only **değil**),
içinde `googleapis`/`gstatic` **yok**, ve üç yazı tipi de telefonda yerinde
(gövde yazısı, eski bir hikâyedeki Corinthia, Göktürkçe runik metin).

📌 Bu ölçüm yöntemi tarayıcı gerektirmiyor — iş yeri makinesinde site tarayıcıda
açılmadığı için değerli: sayfa ve CSS paketleri PowerShell'den indirilip
taranabiliyor.

#### Kalan bilinen zayıflık — CSRF
Çerez tabanlı kimlikte asıl risk CSRF'tir. Koruma `SameSite=Lax`: başka bir
siteden gelen POST isteğine tarayıcı çerezi eklemez. `kuronexus.com` ve
`api.kuronexus.com` aynı site sayıldığı için kendi isteklerimiz etkilenmez.
Ayrı bir CSRF token'ı **eklenmedi** — bu kurulumda gereksiz görüldü.
🔔 *Bu kararı ne bozar:* API'nin farklı bir siteye taşınması ya da
`SameSite=None` gerektiren bir entegrasyon.

📌 Eski `kuronexus-token` çerezi tarayıcılarda bir süre daha duracak ama
**hiçbir kod onu okumuyor** ve 24 saat içinde kendiliğinden ölüyor. Bir
günlüğüne inert bir çerez için kalıcı temizlik kodu yazılmadı.

---

## Çalışmanın Amacı

4 Ağustos 2026'da yapılan mimari incelemede 4 kritik, 13 önemli bulgu çıktı.
Bu çalışma, güvenlik ve altyapı başlıklarını sırayla kapatıyor.

## Sunucu / Altyapı Künyesi

| Bileşen | Değer |
|---|---|
| Sunucu | Hetzner CX23, Helsinki (`ultnexus-prod`) |
| Sunucu IP | 65.108.220.5 |
| Yönetim paneli | Coolify |
| Veritabanı | PostgreSQL — Coolify resource, `Kuronexus > production` projesi |
| DB public port | 5433 (8 Temmuz 2026'da kapatıldığı STATE.md'de yazılı — **doğrulanacak**) |
| Uygulamalar | Coolify'da 2 Application: root dizinleri `/backend` ve `/frontend` |
| Depo | github.com/ultnexusdev/KuroNexus |
| Yedekleme | Günlük `pg_dump`, cron `0 3 * * *` UTC, 7 yedek saklanıyor |
| Depo görünürlüğü | **Private** (4 Ağustos 2026'da kullanıcı tarafından teyit edildi) |
| Yönetici erişimi | **Yalnızca Coolify web paneli** — SSH erişimi yok |

---

## Zaman Çizelgesi (olay geçmişi)

| Tarih | Olay | Kaynak |
|---|---|---|
| 2026-07-08 | DB public erişimi (5433) kapatıldı ve doğrulandı | STATE.md |
| 2026-07-08 | Günlük pg_dump yedekleme kuruldu | STATE.md |
| 2026-07-12 | `backend/check.js` canlı DB parolasıyla commit edildi (`100fd59`) | git log |
| 2026-08-04 | Mimari + güvenlik incelemesi yapıldı, 4 kritik bulgu | — |

**Risk değerlendirmesi — ikinci düzeltme (2026-08-04):**

Bu bulgu iki kez yeniden değerlendirildi. Nihai tablo:

| Tarih | Olay | Depo durumu |
|---|---|---|
| 2026-07-08 | DB dış portu (5433) kapatıldı | Public |
| 2026-07-12 | Parola `check.js` ile commit edildi | **Public** |
| 2026-08-04 | Kullanıcı depoyu private yaptı | Private |

**Parola ~23 gün boyunca internete açık durdu.**

Bir ara "depo private → risk düşük" değerlendirmesi yapıldı; bu, deponun
*geçmişte de* private olduğu varsayımına dayanıyordu ve yanlıştı. Public bir
depoya giren sır **dakikalar içinde** otomatik tarayıcılar tarafından
toplanır. Doğru varsayım: **parola üçüncü taraflarca ele geçirilmiş kabul
edilmelidir.** Depoyu sonradan private yapmak bunu geri almaz.

**Zararı önleyen tek etken:** Port, sızıntıdan **4 gün önce** kapatılmıştı.
Parolayı ele geçiren biri bağlanacak bir uç bulamazdı — *portun gerçekten
kapalı kaldığı varsayımıyla.* Bu varsayım artık doğrulanması zorunlu bir
maddedir (bkz. Adım 2).

**Alınan aksiyon:** Parola 2026-08-04'te değiştirildi (Adım 1d) → sızmış
değer artık geçersiz.

**Eklenen aksiyon:** DB bağlantı günlükleri, 12 Temmuz–4 Ağustos aralığında
dışarıdan bağlantı denemesi olup olmadığı için incelenecek (kanıta dayalı
olay müdahalesi; tahminle yetinilmeyecek).

---

## Yapılacaklar Listesi

| # | İş | Durum |
|---|---|---|
| 0 | Coolify → GitHub kimlik doğrulamasını onar | ✅ Tamamlandı |
| 1 | PostgreSQL parolasını değiştir | ✅ Tamamlandı |
| 2 | Firewall — DB portunun kapalı olduğunu doğrula | ✅ Tamamlandı (3 bağımsız kaynak) |
| 2a | Korumanın hangi katmandan geldiği | ✅ Belirlendi — KuroNexus: yapısal koruma |
| 2b | DB bağlantı günlüğü incelemesi | ✅ Gerekçeli kapatıldı (aranan kayıt var olamaz) |
| 3a | `backend/check.js` dosyasını kaldır | ✅ Tamamlandı (push edildi, doğrulandı) |
| 3b | Tüm git geçmişini sırlar için tara | ✅ Tamamlandı — tek gerçek sır: `check.js` |
| 4 | Git geçmişini temizle | ✅ Tamamlandı (taze klonla doğrulandı) |
| 5 | Depoyu güvenli hale getir | ✅ Tamamlandı (secret scanning yerine pre-commit hook) |
| 6 | Bağımlılık açıkları (Dependabot triyajı) | ✅ Tamamlandı, canlıda doğrulandı |
| 7a | Güvenlik başlıkları (CSP hariç) — Helmet + Next headers | ✅ Tamamlandı, canlıda doğrulandı |
| 7b-1 | CSP yazıldı, Report-Only olarak canlıya alındı | ✅ Tamamlandı |
| 7b-2 | CSP konsol turu — ihlal var mı? | ✅ Tamamlandı — 3 eksik bulundu (bkz. "Ev oturumu") |
| 7c | CSP'yi zorunlu hale getir | ✅ Tamamlandı, canlıda doğrulandı |
| — | Dış API çağrılarına zaman aşımı *(araya girdi)* | ✅ Tamamlandı — arama 40sn → ~9sn |
| 8 | JWT'yi HttpOnly + Secure cookie'ye taşı | ✅ Tamamlandı — iki fazlı deploy, canlıda doğrulandı (5 Ağu) |
| 9 | API anahtarlarını Docker ARG'lardan çıkar | ✅ Tamamlandı — 17 değişkende buildtime kapatıldı, temiz imaj derlendi |
| 10 | Ev bilgisayarı senkronizasyonu | ✅ Tamamlandı — 442 skill korundu, derlemeler temiz |
| 11 | 🔴 Sır rotasyonu (sohbete yapıştırılan değerler) | ✅ Tamamlandı — 1–4 rotate edildi/kaldırıldı, 7 silindi, 5–6 kabul edilmiş artık risk |
| 12 | Mevcut sitenin iyileştirilmesi (mimari rapor bulguları) | ⬜ Sonraki faz |
| 13 | Yeni web sitesi tasarımı | ⬜ Sonraki faz |
| 12a | Dockerfile: migration hatasında dur + `/health` ucu | ✅ Tamamlandı, canlıda doğrulandı (5 Ağu) |
| 12b | Dockerfile: `USER node` | ✅ Tamamlandı — volume önce chown'landı, görsel yükleme canlıda doğrulandı (5 Ağu) |
| 12c | `createSquadOverride` için DTO (Ö-2) | ✅ Tamamlandı (5 Ağu) |
| 14 | ⚠️ Futbol oyuncu fotoğrafları (CSP) | ⬜ **Bilinçli ertelendi** — futbol fazında aynalama ile çözülecek |
| 8+ | Sonraki maddeler (yapılandırılmış logging, global exception filter…) | ⬜ Bekliyor |

### Sonraya not edilenler (bu turda ele alınmıyor)

- **Yedekler sunucu dışına çıkmıyor.** S3 kapalı, yalnızca `Local Storage`.
  Sunucu kaybedilirse yedekler de kaybedilir. Bir S3/B2/R2 hedefi tanımlanmalı.
- **Yedek geri yükleme hiç denenmedi.** Test edilmemiş yedek, yedek sayılmaz.

---

### Adım 5 — Depo sertleştirme
**Tarih:** 2026-08-04

#### 5a — Erişim denetimi ve Dependabot ✅
- **Kullanılmayan deploy key silindi.** `Coolify - production deploy`,
  `Never used` etiketiyle hiç kullanılmadığı doğrulanmıştı (Coolify GitHub App
  üzerinden bağlanıyor). Kullanılmayan kimlik bilgisi = açık kapı.
- **Erişim denetimi:** Depo `private`, **0 collaborator**. 23 günlük public
  dönemde kimse eklenmemiş → "içeriden erişim" ihtimali kapandı.
- **Secret scanning / push protection: MEVCUT DEĞİL.** GitHub bu özellikleri
  public depolarda ücretsiz, private depolarda ücretli (Secret Protection
  aboneliği) sunuyor. Advanced Security sayfasında yalnızca Dependabot
  seçenekleri görünüyor.

**Açılan Dependabot özellikleri:**
| Özellik | Durum | Gerekçe |
|---|---|---|
| Dependency graph | ✅ Açık | Diğerlerinin ön koşulu |
| Dependabot alerts | ✅ Açık | Bağımlılıklarda bilinen açık uyarısı |
| Dependabot security updates | ✅ Açık | Düzeltme PR'ını otomatik açar |
| Grouped security updates | ✅ Açık | PR gürültüsünü azaltır |
| Dependabot **version** updates | ❌ Kapalı (bilinçli) | Güvenlikle ilgisiz her sürüm için PR açar → uyarı yorgunluğu, gerçek uyarıları gizler |
| Self-hosted runners | ❌ Kapalı | GitHub Actions runner yok |
| Dependabot malware alerts | ⬜ Açılacak | npm tedarik zinciri saldırılarına karşı |

#### 5b — Pre-commit sır taraması ✅
`.githooks/pre-commit` yazıldı, test edildi, commit edildi (`3a688f7`).

**Neden gerekli:** GitHub'ın push protection'ı satın alınamadığı için onun
yerini alıyor — ve **bir adım önde** davranıyor:

| | Ne zaman yakalar |
|---|---|
| GitHub push protection | Sır zaten yerel geçmişe girmiş, push'ta durdurur → geçmiş temizliği gerekir |
| **Bu hook** | Sır git'e hiç girmez → temizlenecek bir şey olmaz |

**Test sonuçları — 10/10 doğru:**

*Engelledikleri:* parolalı DB bağlantı dizesi · GitHub token (`ghp_`) ·
AWS anahtarı (`AKIA`) · SSH özel anahtarı · koda gömülü `JWT_SECRET` ·
`git add -f` ile zorlanan `.env`

*Geçirdikleri (yanlış alarm kontrolü):* normal kod · `.env.example`
(yer tutuculu) · `postgresql://user:password@localhost` · Türkçe lore metni

Son sütun kritik: sürekli yanlış alarm veren bir kontrol birkaç gün içinde
`--no-verify` ile atlanmaya başlanır ve fiilen ölür.

**⚠️ KURULUM GEREKTİRİR (her klon için bir kez):**
```
git config core.hooksPath .githooks
```
Git, hook'ları güvenlik gereği otomatik etkinleştirmez. Yeni bir makinede
klonlarsan bu komutu çalıştırmayı unutma — yoksa koruma devrede olmaz.

#### 5c — Hook GitHub'a gönderildi ✅
```
c01c4a5..3a688f7  main -> main
git ls-tree -r origin/main | grep githooks  →  .githooks/pre-commit ✅
```

#### 🟠 YENİ BULGU — Dependabot 36 açık raporladı
Push sırasında GitHub uyardı:
```
GitHub found 36 vulnerabilities on ultnexusdev/KuroNexus's default branch
(23 high, 13 moderate)
```
Bu, Dependabot'un açılmasının **ilk günden** karşılık verdiğini gösteriyor.

**Değerlendirme yapılmadı — ham sayı yanıltıcıdır.** npm projelerinde bu
sayılar tipik olarak şişkin görünür: çoğu geliştirme bağımlılığı (canlıda
çalışmaz), çoğu dolaylı (doğrudan kurulmamış), bir kısmı bu kullanım
şeklinde sömürülemez. Gerçek eyleme dönüşecek sayı genelde çok daha küçük.

**Sıradaki iş:** `github.com/ultnexusdev/KuroNexus/security/dependabot`
adresindeki liste tek tek ayıklanacak — hangileri üretimde çalışan koda
dokunuyor, hangileri gerçekten sömürülebilir.

#### 5d — Skiller kullanıcı seviyesine taşındı ✅
`KuroNexus/.claude/skills/` → `~/.claude/skills/` **kopyalandı**
(taşınmadı; proje içindekiler de yerinde kaldı).

- 8 skill, 140 dosya, 2,7 MB
- Artık her projede kullanılabilir ve **git işlemlerinden etkilenmez**

**Neden gerekliydi:** Bu makinede skiller "kurulu" değildi — KuroNexus
deposunun içinde taşınıyorlardı (`~/.claude/skills/` boştu). Bugün
`.claude/skills/` git takibinden çıkarıldığı için, depo başka bir makinede
güncellendiğinde o dosyalar **diskten silinecekti**.

**⚠️ EV BİLGİSAYARI İÇİN AÇIK RİSK:**
Ev PC'sindeki kopya hem eski geçmişi taşıyor (force-push nedeniyle ayrışmış)
hem de senkronize edilirse 361 skill dosyası silinecek. Sıra önemli:
1. **Önce** skill klasörünü güvenli bir yere kopyala
2. **Sonra** `git fetch && git reset --hard origin/main`
Tek başına `git pull` denenirse skiller kaybedilir.

#### 5e — Üçüncü taraf skill kurulumu (güvenlik denetimiyle)
13 aday depo **önce geçici alana klonlanıp incelendi**, sonra seçmeli kuruldu.
Doğrudan `~/.claude/skills/`'e kurulmadı — bu, bilinçli bir sıralama.

**Ölçüm sonuçları (13 depo):** Toplam **301 skill**. Hepsi kurulsaydı mevcut
~33'ün üstüne çıkıp ~334'e ulaşacaktı. Her skill'in adı ve açıklaması her
oturumun bağlamına yüklendiği için bu, sistemi hızlandırmaz — yavaşlatır ve
doğru skill'in seçilme olasılığını düşürür.

**Kilit bulgular:**
- `nextlevelbuilder/ui-ux-pro-max-skill` (113k ⭐) = kullanıcının **zaten sahip
  olduğu** 8 skill'in kaynağı. Kurmak %100 tekrar olurdu.
- `anthropics/claude-code` (140k ⭐) içindeki tek tasarım skill'i
  (`frontend-design`) **zaten kurulu**; kalan 9'u eklenti geliştirme aracı.
- `rshankras/claude-code-apple-skills` (63 skill) → iOS/App Store; Next.js
  projesiyle ilgisiz.
- **Skiller klasördür — depo bütünü kurmak zorunlu değil.** Cherry-pick
  yaklaşımı benimsendi (ör. `wondelai/skills`'in 62 skill'inden yalnızca 1'i).

**Prompt injection taraması yapıldı** (makalenin "%36" uyarısı üzerine).
6 dosya işaretlendi, hepsi **tek tek incelendi ve yanlış alarm çıktı**:
"system prompt" ifadesi ya akademik bir araştırmada, ya bir sunum metninde,
ya da **iOS izin penceresi** anlamında geçiyordu. Enjeksiyon yok.

**Kurulan (13 yeni, toplam 21):**
| Kaynak | Alınan | Alınmayan |
|---|---|---|
| vercel-labs/agent-skills | 4 (react-best-practices, composition-patterns, view-transitions, web-design-guidelines) | Vercel'e özgü deploy/CLI/optimize (Coolify kullanılıyor), react-native |
| nutlope/hallmark | 1 | — |
| Dammyjay93/interface-design | 1 | — |
| wondelai/skills | 1 (`ux-heuristics`) | 61 |
| Leonxlnx/taste-skill | 6 | v1 (eski sürüm), stitch (başka araç), imagegen ×3, brutalist, **`full-output-enforcement`** |

⚠️ `full-output-enforcement` bilinçli olarak **kurulmadı**: tasarım skill'i
değil, modelin çıktı davranışını ezmeye çalışan bir meta-skill. Sessizce
kurulması doğru olmazdı; kullanıcıya ayrıca sorulacak.

**İkinci tur (kullanıcı itirazı üzerine):** Kullanıcı, elemelerin *tek projeye
göre* yapıldığını haklı olarak eleştirdi — kullanıcı seviyesindeki skiller tüm
projelere hizmet eder ve **kurmak ≠ kullanmak**. Ölçüt düzeltildi:
*"Kurmak ucuzsa şimdi kur; pahalıysa ihtiyaç anında kur."*

9 skill daha eklendi: `industrial-brutalist-ui`, `stitch-design-taste`,
`brandkit`, `imagegen-frontend-web`, `imagegen-frontend-mobile`,
`full-output-enforcement`, `refactoring-ui`, `frontend-design-pro`,
`impeccable`. **Toplam: 30 skill, 8 MB.**

**`pbakaus/impeccable` denetimi (kurulum öncesi):**
İlk taramada "1.628 betik" görünmüştü — inceleme bunun **aynı skill'in 15 AI
aracı için 15 kopyası** olduğunu gösterdi (`.claude/`, `.cursor/`, `.gemini/`,
`.grok/`, `.trae/`…). Yalnızca `.claude/` kopyası kuruldu: 146 dosya, 105 betik.

İşaretlenen 5 dosya tek tek incelendi:
| Dosya | Bulgu | Karar |
|---|---|---|
| `live-browser.js` | `http://www.w3.org/2000/svg` | ✅ Yanlış alarm — SVG isim uzayı |
| `detector/file-system.mjs` | `fetch("http://localhost:PORT")` | ✅ Kendi dev sunucusunu analiz ediyor |
| `context.mjs` | `fetch("${UPDATE_HOST}/api/version")` | 🟡 Sürüm kontrolü — yazarın sunucusuna bağlanıyor |
| `concept-seed.mjs` | `https://impeccable.style/api/roll` | 🟡 Tasarım fikri için yazarın API'si |
| `generate-image.mjs` | `OPENAI_API_KEY` + `api.openai.com` | 🟠 **Ücretli** OpenAI görsel API'si |

**Sonuç: kötü niyetli davranış yok.** Araç dışarı konuşuyor ama şeffaf ve
standart yöntemlerle; gizlenmiş bir şey yok. Kullanıcı bilgilendirildi.

**Ücretli API gerektirenler:** `brandkit`, `imagegen-frontend-web`,
`imagegen-frontend-mobile` ve `impeccable`'ın görsel üretimi →
`OPENAI_API_KEY` tanımlı değilse sessizce devre dışı kalırlar.

Geçici klon klasörleri silindi.

#### Süreç hatası ve kurtarma (2026-08-04)
Hook'u test eden betiğimde kusur vardı: `.env` testinde dosya `.gitignore`
yüzünden hiç stage edilemedi, `git commit` başarısız oldu, betik bunu
"commit oluştu" sanıp `git reset --soft HEAD~1` çalıştırdı ve **gerçek bir
commit'i geri aldı** (`c01c4a5` → `44e90ca`).

*Kurtarma:* `git reset --soft c01c4a5` + `git reset` ile HEAD ve index
düzeltildi. **`--hard` bilinçli olarak kullanılMADI** — diskteki skill
dosyalarını silebilirdi. Kayıp yok: commit hem `origin/main`'de hem reflog'da
duruyordu.

*Dersler:* (1) Test aracının kendisi de doğrulanmalı — betik, commit'in
gerçekten oluştuğunu kontrol etmeden geri alma yaptı. (2) Yıkıcı komutlar
koşulsuz çalıştırılmaz. Sonraki testler commit denemeden, hook doğrudan
çağrılarak yapıldı.

---

### Adım 6 — Bağımlılık açıklarının ayıklanması ve kapatılması
**Tarih:** 2026-08-04 · **Durum:** 🔄 Commit edildi, deploy bekliyor

#### Triyaj yöntemi
Dependabot 36 açık raporladı. **Ham sayı yanıltıcıdır** — bir açığın gerçek
risk olması üç şarta bağlı: (1) üretimde çalışan koda dokunuyor mu,
(2) açık kod yolu kullanılıyor mu, (3) saldırgan oraya ulaşabilir mi.

`pnpm audit --json` çıktısı, her bulgunun bağımlılık yolundaki **kök paket**
`package.json`'daki `dependencies` / `devDependencies` ile eşleştirilerek
sınıflandırıldı.

| | Önce | Sonra |
|---|---|---|
| Toplam | 36 | **26** |
| **Üretimde** | **17** | **7** |
| Yalnızca geliştirme | 19 | 19 |

#### Maruziyet ölçümü (tahmin değil)
Next.js açıklarının kaçının gerçekten geçerli olduğu ölçüldü:
- `"use server"` içeren dosya: **0** → Server Action açıkları büyük ölçüde geçersiz
- `next.config.ts`'te `rewrites`: **yok** → rewrites SSRF'i geçersiz
- `<Image>` kullanan dosya: **42** → Image Optimization DoS **geçerli**
- Cache confusion → her Next dağıtımında **geçerli**

Yani 8 Next açığından ~3'ü gerçekten geçerliydi; yama hepsini birden kapattı.

#### Kapatılanlar
| Paket | Değişim | Kapattığı |
|---|---|---|
| `next` | 15.5.20 → **15.5.22** | **8 advisory** (2 SSRF, 2 DoS, 2 cache confusion, unauthenticated endpoint disclosure, unbounded payload) |
| `postcss` (backend) | 8.5.16 → **8.5.25** | sourceMappingURL path traversal → sunucudan dosya okuma |
| `sanitize-html` | 2.17.5 → **2.17.6** | postcss güncellemesiyle birlikte |

#### 🟡 KABUL EDİLMİŞ RİSKLER (gerekçeli)

**frontend `postcss` 8.4.31 + `sharp` 0.34.5 (6 advisory)**
`next@15.5.22` bu ikisini kendisi sabitliyor (`postcss: 8.4.31` kesin sürüm,
`sharp: ^0.34.3`). Zorla yükseltmek Next'in CSS boru hattını bozabilir.
İkisi de bu kurulumda **sömürülebilir değil**:
- postcss Next'te **derleme zamanında** çalışıyor, istek anında değil; işlenen
  CSS'i biz yazıyoruz, saldırgan girdi veremiyor.
- sharp yalnızca `/_next/image` üzerinden; o da `remotePatterns` ile
  `image.tmdb.org` ve kendi API'mizle sınırlı — saldırgan kendi görselini
  işletemiyor.

_Gözden geçirme: Next bu sürümleri yükselttiğinde kendiliğinden kapanacak._

**backend `multer` 1.x (2 advisory)**
Düzeltme `multer >= 2.2.0` istiyor — **major sürüm atlaması**.
`@nestjs/platform-express`'in `FileInterceptor`'ı 1.x API'sine göre yazılmış;
zorlamak dosya yüklemeyi bozabilir. Açık yalnızca **ADMIN** yetkisiyle
tetiklenebilen bir DoS. Kırılma riski, açığın riskinden büyük.

_Gözden geçirme: NestJS multer 2.x'e geçtiğinde._

#### Uygulama notu
Yalnızca kilit dosyaları güncellendi (`--lockfile-only`). Sebep: yerel
`node_modules` pnpm **v11** store'uyla kurulu, Dockerfile ise **pnpm@10**
kullanıyor — `pnpm update` store çakışması verdi. Dockerfile ile aynı sürüm
kullanılarak kilit dosyası formatı (`9.0`) korundu ve her iki projede
`pnpm install --frozen-lockfile` doğrulandı (Docker derlemesinin ilk adımı).

**⚠️ Yerel derleme testi YAPILAMADI** — `node_modules` güncellenmediği için
yerel derleme eski bağımlılıkları test ederdi. İlk gerçek test Docker
derlemesi olacak. Kabul edilebilir çünkü: (a) değişiklikler yama/minör
seviyede, (b) `--frozen-lockfile` doğrulandı, (c) başarısız deploy çalışan
konteyneri devirmiyor (bugün kanıtlandı).

Commit: `2d78fd2` → push `3a688f7..2d78fd2`

#### Deploy ve doğrulama ✅
**İlk deneme başarısız** — ama sebebi bizim değişikliğimiz değildi:
```
ERROR: failed to build: failed to solve:
image "...:2d78fd2b3163..." : already exists
```
Coolify imajı commit SHA'sıyla etiketliyor; önceki denemeden kalan bir imaj
etiket çakışması yarattı. **`pnpm install --frozen-lockfile` bu denemede de
sorunsuz geçti** (`Done in 11.7s`) — yani kilit dosyası baştan geçerliydi.

**İkinci deneme başarılı.** Coolify mevcut imajı bulup yeniden derlemeyi
atladı (`Build step skipped`).

**Çalışan konteynerlerde doğrulandı** (imajın doğru olduğu varsayılmadı,
`ls /app/node_modules/.pnpm` ile ölçüldü):
| Uygulama | Ölçülen |
|---|---|
| backend | `postcss@8.5.25` ✅ · `sanitize-html@2.17.6` ✅ |
| frontend | `next@15.5.22` ✅ |

Site kontrolü: ana sayfa açılıyor, içerikler geliyor, **görseller yükleniyor**
(`next` güncellemesinin görsel optimizasyonunu bozmadığı teyit edildi).

**➡️ ADIM 6 TAMAMLANDI.**

---

## 🟠 YENİ BULGU — API anahtarları Docker imaj katmanlarında

Deploy loglarında Docker'ın kendi uyarısı:
```
SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data
  ARG "TMDB_API_KEY"      (satır 13)
  ARG "FOOTBALL_API_KEY"  (satır 50)
  ARG "KAGGLE_API_TOKEN"  (satır 57)
```

**Sorun:** `ARG` ile verilen değerler imaj katmanlarına yazılır. İmaja
erişebilen biri `docker history` ile bu anahtarları **düz metin** okuyabilir.
Bu, `check.js` olayıyla **aynı sınıf** bir hata: sır kalıcı bir yere gömülüyor.

**Aciliyet: düşük.** İmajlar özel sunucuda, dışarı açık bir registry'ye
gönderilmiyor.

**Çözüm seçenekleri:**
1. Bu anahtarları build zamanında hiç vermemek — çalışma zamanı (runtime)
   değişkeni olmaları yeterli. Coolify'da "Build Variable" işaretini kaldırmak.
2. BuildKit `--mount=type=secret` kullanmak (derleme sırasında gerçekten
   gerekiyorsa).

Seçenek 1 muhtemelen doğru olan — bu anahtarlar derleme sırasında değil,
uygulama çalışırken kullanılıyor.

---

### Adım 7 — HTTP güvenlik başlıkları
**Tarih:** 2026-08-04 · **Durum:** 🔄 7a commit edildi, deploy bekliyor

Uygulamalar bugüne kadar **hiçbir** güvenlik başlığı göndermiyordu
(inceleme raporu bulgu Ö-1).

#### Kademeli yaklaşım — neden CSP ertelendi
CSP, yanlış yazılırsa **siteyi bozabilen tek başlıktır**; Next.js hidrasyon
için satır içi script kullanıyor. Bu yüzden üç kademeye bölündü:

| Kademe | İçerik | Risk |
|---|---|---|
| **7a** | CSP dışındaki başlıklar | Sıfır — mevcut davranışı değiştirmez |
| 7b | CSP **Report-Only** modda | Sıfır — engellemez, yalnızca raporlar |
| 7c | CSP zorunlu | Kontrollü, ölçüme dayalı |

#### 7a — Eklenen başlıklar ✅ (commit `156d98f`)

**backend (helmet 8.3.0):** HSTS (1 yıl) · nosniff · X-Frame-Options ·
Referrer-Policy · X-Powered-By kaldırıldı

⚠️ **`crossOriginResourcePolicy: 'cross-origin'` bilinçli olarak ayarlandı.**
Helmet'in varsayılanı `same-origin`; frontend ayrı alan adında çalıştığı için
varsayılan bırakılsaydı tarayıcı `/uploads/*` görsellerini **engellerdi** ve
bütün kitap kapakları kaybolurdu. Bilmeden uygulansa fark edilmesi zor bir
arıza olurdu.

`contentSecurityPolicy: false` — bu servis JSON ve statik dosya sunuyor,
HTML değil. Sayfa CSP'si frontend tarafında tanımlanacak.

**frontend (`next.config.ts` → `headers()`):** HSTS · nosniff ·
X-Frame-Options: DENY · Referrer-Policy · Permissions-Policy
(kamera/mikrofon/konum kapalı) · `poweredByHeader: false`

_Not: `X-Frame-Options: DENY`, bizim YouTube fragmanı gömmemizi etkilemez —
o ilişkide biz ebeveynyiz; bu başlık "beni kim gömebilir" sorusunu yanıtlar._

#### CSP hazırlık ölçümü (7b için)
Sitenin **gerçekte** kullandığı dış kaynaklar ölçüldü (tahmin edilmedi):

| Kaynak | Kullanım | CSP karşılığı |
|---|---|---|
| `image.tmdb.org` | Film/dizi afişleri | `img-src` |
| `i.ytimg.com` | YouTube küçük görselleri | `img-src` |
| `www.youtube-nocookie.com` | Fragman gömüleri | `frame-src` |
| `www.w3.org` | SVG isim uzayı | ❌ Ağ yüklemesi **değil** — gerekmez |
| `www.themoviedb.org` | Tıklanan bağlantı | gerekmez |
| Fontlar | `next/font/google` → derleme anında **self-host** | dış kaynak yok |

Satır içi `<script>`: **0** · `style={{ }}`: **16 dosya**
→ `style-src 'unsafe-inline'` gerekecek, `script-src` için gerekmeyebilir.

#### Doğrulama — bu sefer YERELDE DERLENDİ
Önceki adımın aksine kod değişikliği yerelde sınandı:
```
backend : tsc --noEmit temiz  +  nest build başarılı
frontend: tsc --noEmit temiz  +  next build başarılı (55 sn, uyarı yok)
```

Yan iş: yerel Prisma istemcisi tazelendi. `ReadingOrderProgress` modeli
eksik olduğu için 2 tip hatası veriyordu — **kod hatası değil, ortam
eksikliğiydi** (Docker'da her derlemede `prisma generate` çalışıyor).

Ayrıca `pnpm@11 install --frozen-lockfile` çalıştırıldı; kilit dosyası
formatı (`9.0`) korundu ve pnpm'in tedarik zinciri kontrolü geçti
(*"Lockfile passes supply-chain policies, 834 entries"*).

#### Deploy ve canlı doğrulama ✅
Push `2d78fd2..156d98f`. Her iki uygulama da sorunsuz dağıtıldı
(`Deployment is Finished`, 12:10–12:13).

**Deploy öncesi temel ölçüm** (`curl -I https://kuronexus.com`):
```
Gönderilen tek güvenlik-ilgili başlık:  X-Powered-By: Next.js
Diğer başlıkların hepsi:                YOK
```

**Deploy sonrası ölçüm:**
| | frontend | backend (`api.kuronexus.com`) |
|---|---|---|
| `Strict-Transport-Security` | ✅ 1 yıl + subdomains | ✅ |
| `X-Content-Type-Options` | ✅ nosniff | ✅ |
| `X-Frame-Options` | ✅ DENY | ✅ |
| `Referrer-Policy` | ✅ strict-origin-when-cross-origin | ✅ |
| `Permissions-Policy` | ✅ kamera/mikrofon/konum kapalı | — |
| `Cross-Origin-Resource-Policy` | — | ✅ **cross-origin** |
| `X-Powered-By` | ✅ **kaldırıldı** | ✅ **kaldırıldı** |

**Kullanıcı doğrulaması:** Kitap kapakları görünüyor, site çalışıyor.
Bu, `crossOriginResourcePolicy: 'cross-origin'` ayarının doğru olduğunun
kanıtı — varsayılan bırakılsaydı tüm `/uploads/*` görselleri engellenirdi.

**➡️ ADIM 7a TAMAMLANDI.**

#### 🎯 Adım 6'nın bağımsız doğrulaması
Bu push sırasında GitHub'ın uyarısı değişti:
```
Önce:  36 vulnerabilities (23 high, 13 moderate)
Şimdi: 26 vulnerabilities (19 high,  7 moderate)
```
Dependabot yeniden taradı ve **yerel `pnpm audit` ölçümümüzle birebir aynı
sonuca vardı** (36 → 26). Bağımsız kaynak teyidi.

---

### 🔍 Araya giren bulgu — dış API çağrılarında zaman aşımı yokluğu
**Tarih:** 2026-08-04 · **Commit:** `30e79a5` · **Durum:** 🔄 Deploy bekliyor

**Nasıl ortaya çıktı:** CSP Report-Only deploy'undan sonra kullanıcı, kitap
küratör aramasının 30–40 saniye sürdüğünü bildirdi. Film/dizi araması normaldi.

**İlk eleme — CSP değil:** `Content-Security-Policy-**Report-Only**` tanımı
gereği hiçbir şeyi engelleyemez. Bu bir varsayım değil, başlığın tanımı.

**Kök neden (ölçüldü):**
```
openlibrary.org   → HTTP 000, 11 sn sonra bağlantı düştü   ← cevap vermiyor
googleapis.com    → HTTP 429, 0.49 sn                       ← hızlı
```
```
google-books.service.ts'teki iki fetch çağrısında ZAMAN AŞIMI YOK
search() dört bacağı Promise.allSettled ile birlikte bekliyor
   ↓
Open Library asılı kalıyor → düşmüyor → allSettled hepsini bekliyor
   ↓
Google 0.5 sn'de dönse bile arama 30-40 saniye sürüyor
```

**Backend'in kendisi sağlıklıydı** (ölçüldü): `/books` 1,21 sn ·
`/universes` 0,60 sn · `/books/okuma-sirasi` 0,52 sn. Yavaşlık yalnızca dış
kaynak yolundaydı. **Bugünkü güvenlik değişiklikleriyle ilgisi yoktu.**

**Bu aynı zamanda bir güvenlik meselesi:** Zaman aşımı olmayan dış istek
yalnızca yavaşlık değil, **kaynak tükenmesi** riskidir — asılı kalan istekler
soket havuzunu ve olay döngüsünü doldurur. Dışarıdan tetiklenebilen bir
hizmet reddi (DoS) yüzeyi.

**Sınıf hatası çıktı — 8 dış servisin 4'ünde daha aynı eksik:**
| Servis | Durum |
|---|---|
| `books/bin-kitap.service.ts` | ✅ Zaten vardı (10 sn) |
| `books/book-cover.service.ts` | ✅ Zaten vardı |
| `football/football.service.ts` | ✅ Zaten vardı |
| `books/google-books.service.ts` | ➕ Eklendi (2 çağrı) |
| `movies/tmdb.service.ts` | ➕ Eklendi |
| `shows/tmdb-tv.service.ts` | ➕ Eklendi |
| `anime/anilist.service.ts` | ➕ Eklendi |
| `anime/jikan.service.ts` | ➕ Eklendi |

TMDB/AniList/Jikan o gün ayakta olduğu için oralarda görülmemişti. Özellikle
`jikan` riskliydi — kendi kod notunda *"kırılgan bir kaynak (MAL'a bağlı,
504 verebiliyor)"* yazıyor.

Hepsinde `AbortSignal.timeout(8_000)`. Sonuç: arama en kötü ~8 saniyede biter.

**Süreç notu:** `prettier --write "src/**/*.ts"` tüm backend'i biçimlendirdi
(103 dosya). O değişiklikler **bilerek commit'e alınmadı** — 5 satırlık bir
güvenlik düzeltmesi 100 dosyalık bir yığında kaybolmamalı. Yalnızca kasıtlı
5 dosya işlendi (+91/−3).

---

## 🏠 EV BİLGİSAYARINDA YAPILACAKLAR (sırası önemli!)

### Görev 1 — Depoyu senkronize et — ⚠️ SIRA KRİTİK

**Kullanıcı notu (4 Ağustos):** *"Evdeki PC'de skilleri yüklerken bugünkü gibi
sorular sormadın, orada ne varsa yüklemiştim. Bu yüzden skillerin silinmesini
de istemiyorum."*

→ Ev makinesindeki skill seti **buradakinden farklı ve daha geniş** olabilir.
Aşağıdaki prosedür **ne varsa hepsini** korur; hiçbir şey seçilip elenmez.

**Ev PC'sindeki kopya neden normal `git pull` ile güncellenemez:**
1. Bugün geçmiş yeniden yazıldı (force-push) → geçmişler ayrıştı, `pull` çakışır
2. `.claude/skills` ve `.agents/skills` git takibinden çıkarıldı → senkronda
   git onları **silinmiş dosya** sayıp diskten kaldırır

`.gitignore` bunu engellemez: gitignore yalnızca *takip edilmeyen* dosyalar
için geçerlidir, silme işlemi için değil.

---

#### 🔒 ADIM 1 — ÖNCE YEDEK AL (bu adımı atlama)

```bash
cd ~/Desktop/Kuronexus

# Kac dosya oldugunu not et - sonunda karsilastiracagiz
find .claude/skills -type f 2>/dev/null | wc -l
find .agents/skills -type f 2>/dev/null | wc -l

# Ikisini de guvenli bir yere kopyala (proje klasorunun DISINA)
mkdir -p ~/Desktop/skill-yedek
cp -r .claude/skills  ~/Desktop/skill-yedek/claude-skills   2>/dev/null
cp -r .agents/skills  ~/Desktop/skill-yedek/agents-skills   2>/dev/null

# Yedegi dogrula - yukaridaki sayilarla ayni olmali
find ~/Desktop/skill-yedek -type f | wc -l
```

**Sayılar tutmuyorsa devam etme.** Önce yedeği düzelt.

#### ADIM 2 — Kaybolacak başka bir şey var mı, bak

```bash
git status --short
```
Commit edilmemiş bir çalışman varsa `git stash` ile sakla — sonraki adım onu siler.

#### ADIM 3 — Depoyu uzak halin birebir aynısı yap

```bash
git fetch origin
git reset --hard origin/main
```

⚠️ `--hard` commit edilmemiş değişiklikleri siler. Adım 2'yi yaptıysan sorun yok.
Skill dosyaları bu adımda diskten kalkacak — **yedeğin var, panik yok.**

#### ADIM 4 — Skilleri KULLANICI seviyesine kur (artık orada yaşayacaklar)

```bash
mkdir -p ~/.claude/skills

# Once .claude, sonra .agents (ayni isimliler varsa .claude kazanir)
cp -rn ~/Desktop/skill-yedek/claude-skills/*  ~/.claude/skills/  2>/dev/null
cp -rn ~/Desktop/skill-yedek/agents-skills/*  ~/.claude/skills/  2>/dev/null
```

`-n` bayrağı: var olan bir skill'in üzerine yazma. Böylece iki kaynakta da
bulunan bir skill iki kez kopyalanmaz.

**Neden kullanıcı seviyesi:** Orada duran skiller **her projede** kullanılabilir
ve hiçbir git işleminden etkilenmez. Bugün bu makinede de aynısı yapıldı.

#### ADIM 5 — Pre-commit hook'u etkinleştir (klon başına bir kez)

```bash
git config core.hooksPath .githooks
```
Git, hook'ları güvenlik gereği otomatik açmaz. Bu komut çalıştırılmazsa sır
taraması o makinede devrede olmaz.

#### ADIM 6 — Doğrula

```bash
git log --oneline -3                       # en ustte: 30e79a5
ls ~/.claude/skills | wc -l                # skill sayisi
find ~/.claude/skills -type f | wc -l      # Adim 1'deki toplamla karsilastir
.githooks/pre-commit && echo "hook calisiyor"
```

Her şey tamamsa `~/Desktop/skill-yedek` klasörünü silebilirsin — ama birkaç
gün beklemekte fayda var.

### Görev 2 — CSP konsol turu (7b-2)
İş yeri PC'sinden yapılamadı. Evde Chrome ile:
`F12` → **Console** → filtreye `Content Security` yaz → siteyi gez:
ana sayfa · kitap arşivi · bir kitap · film → bir film · fragmanlı bir yapım ·
evren → bölüm okuma · admin paneli.

İhlal yoksa **7c**: `next.config.ts`'te `Content-Security-Policy-Report-Only`
anahtarındaki `-Report-Only` eki kaldırılır → kural zorunlu olur.

_Alternatif: `report-uri` uç noktası eklenirse ihlaller sunucuya düşer ve
telefon dahil her cihazdan test edilebilir (ayrıca zorunlu moddan sonra da
izleme sağlar). Yazılırsa hız sınırı + gövde boyutu sınırı şart._

---

## Sıralama kararı (2026-08-04)

Orijinal listede 4. madde "git geçmişini temizle", 5. madde "depoyu güvenli
hale getir (secret taraması dahil)" idi. **Sıra değiştirildi:** tarama,
geçmiş temizliğinden **önce** yapılacak.

Gerekçe: Geçmişi yeniden yazmak, tüm commit'lerin karmasını değiştirir ve
uzak depoya `--force` ile gönderilmesini gerektirir. Önce temizleyip sonra
tarayıp yeni bir sır bulursak, **ikinci kez** yeniden yazmak zorunda kalırız.
Riskli bir işlem iki kez yapılmaz. Önce her şeyi bul, sonra hepsini tek
seferde temizle.

Hiçbir madde atlanmadı; yalnızca sıralandı.

---

## Adım Kayıtları

### Adım 0 — Hazırlık ve keşif
**Tarih:** 2026-08-04
**Durum:** ✅ Tamamlandı

Yapılanlar:
- Depo baştan sona incelendi (788 dosya, ~1,3 MB uygulama kodu).
- `backend/check.js` içinde canlı PostgreSQL superuser parolası tespit edildi.
- Commit tarihi belirlendi: `100fd59`, 2026-07-12 19:41 +0300.
- STATE.md kayıtlarından altyapı künyesi ve olay zaman çizelgesi çıkarıldı.
- Bu günlük dosyası oluşturuldu ve `.gitignore`'a eklendi.

Sonuç: Sızıntının kapı kapandıktan **sonra** gerçekleştiği anlaşıldı —
aciliyet düştü, ama rotasyon gerekliliği değişmedi.

---

### Adım 4 — Git geçmişinin temizlenmesi
**Tarih:** 2026-08-04 · **Durum:** 🔄 Devam ediyor

#### Kapsam kararı
Kullanıcı tercihi: *"gereksiz boş kodların bile yer kaplamasını istemiyorum,
kodlar şişmesin."* Geçmiş yeniden yazma pahalı ve riskli bir işlem olduğu için
**bir kez** yapılıyor; bu yüzden güvenlik temizliğiyle birlikte şişkinlik de
aynı işleme dahil edildi.

**Depo boyut analizi (yeniden yazma öncesi):**

| Kategori | Boyut | Nesne | Karar |
|---|---|---|---|
| `.agents/skills` + `.claude/skills` | 7,49 MB | 361 dosya | 🗑️ Çıkarıldı |
| `hero-bg.mp4` | 9,16 MB | 1 | ✅ Korundu — site kullanıyor |
| `STATE.md` | 6,91 MB | 81 sürüm | ✅ Korundu — proje günlüğü |
| `pnpm-lock.yaml` | 1,61 MB | 8 sürüm | ✅ Korundu |
| Asıl kod | 10,16 MB | 1143 | ✅ |
| **Toplam** | **35,34 MB** | 1451 | (paketli: 13,86 MB) |

_Not: `.agents/skills` ve `.claude/skills` birebir aynı içerikte; Git zaten
tek nesne olarak saklıyordu. Asıl maliyet çalışma dizinindeki 361 dosya._

#### ⚠️ Kritik güvenlik kontrolü — hedef daraltıldı
İlk plan `.agents` ve `.claude` klasörlerini **toptan** silmekti. Silmeden önce
içerikleri kontrol edildi ve şunlar bulundu:
- **`.agents/AGENTS.md`** → projenin **asıl talimat dosyası** (CLAUDE.md onu
  işaret ediyor)
- **`.claude/launch.json`** → geliştirme sunucusu yapılandırması

Toptan silme, projenin kural dosyasını yok edecekti. Hedef yalnızca
`*/skills/` alt klasörleriyle sınırlandırıldı.
_Ders: Geçmiş yeniden yazmadan önce hedefin içeriği **tek tek** doğrulanmalı._

#### 4a — Yedek alındı ✅
- `Masaüstü/kuronexus-git-yedek-20260804-1121.bundle` (14 MB)
- `git bundle verify` → *"The bundle records a complete history"*
- İkinci güvence: GitHub'da eski geçmiş, force-push yapılana kadar duruyor

#### 4b — Güncel hâl temizlendi ✅
- Stash düşürüldü (`13c705bd`, `.claude/launch.json`'da 2 satırlık yerel değişiklik)
- `.gitignore`'a `.agents/skills/` ve `.claude/skills/` eklendi
- 363 dosya takipten çıkarıldı (skill dosyaları **diskte kaldı**)
- 0-byte çöp dosyalar silindi: `arşivimde`, `kapaklar`
- Commit: `634f5c3`

#### 4c — Geçmiş yeniden yazma
**İlk deneme başarısız:** `git filter-branch` 7 dakikada tamamlanamadı,
zaman aşımına uğradı.

*Teşhis:* `git rm --cached` sildiği her dosyanın adını yazdırıyor →
363 dosya × 187 commit ≈ **68.000 satır çıktı**. Windows'ta süreçler arası
bu hacimde metin aktarımı, asıl işten uzun sürüyor.

*Durum kontrolü:* Depo **etkilenmedi** — `filter-branch` işini geçici alanda
yapıp dalı ancak sonda güncelliyor. `main` yerinde (`634f5c3`),
`refs/original` oluşmamış, yedek sağlam. Geçici `.git-rewrite/` temizlendi.

*İkinci deneme:* `-q` (sessiz) bayrağı eklendi, arka planda çalıştırıldı →
**başarılı.** 185 commit, 471 saniye. `Ref 'refs/heads/main' was rewritten`.

- Eski `main`: `634f5c3` → yeni `main`: `c01c4a5`
- Commit sayısı 185 → 184 (`--prune-empty`, yalnızca skill dosyası ekleyen
  bir commit boşaldığı için düştü)

#### 4d — Doğrulama ✅

**Silinmesi gerekenler (yeni `main` geçmişinde arandı):**
| Hedef | Sonuç |
|---|---|
| `backend/check.js` | ✅ Hiç geçmiyor |
| `.agents/skills` | ✅ Hiç geçmiyor |
| `.claude/skills` | ✅ Hiç geçmiyor |
| `arşivimde`, `kapaklar` | ✅ Hiç geçmiyor |
| Nesne düzeyinde tarama | ✅ **0 eşleşme** |

**Korunması gerekenler:** `.agents/AGENTS.md`, `.claude/launch.json`,
`frontend/styles/globals.css`, `backend/src/main.ts`, `hero-bg.mp4`,
`STATE.md`, `schema.prisma` → **hepsi yerinde.**
69 CSS modülü, 127 backend kaynak dosyası, 247 frontend dosyası korundu.

`CLAUDE.md` bulunamadı → **kayıp değil**, bu depoda hiç var olmamış
(eski geçmiş de kontrol edildi: 0 commit). KuroNexus'un talimat dosyası
`.agents/AGENTS.md`.

**Bütünlük:** `git fsck` temiz.

#### 4e — Boyut sonucu ve TAHMİN DÜZELTMESİ

```
Öncesi : 13,86 MB (paketli)
Sonrası: 13,25 MB
Kazanç : 0,61 MB
```

**Tahmin hatası:** 7,5 MB tasarruf öngörülmüştü; gerçekleşen 0,61 MB.
Sebep: ölçülen 7,49 MB **sıkıştırılmamış** boyuttu. Skill dosyaları CSV ve
Markdown — metin çok iyi sıkışır, pakette zaten ~0,6 MB yer kaplıyorlardı.
Buna karşılık `hero-bg.mp4` (9,16 MB) zaten sıkıştırılmış video; deponun
kalan boyutunun **%69'u tek başına o.**

_Ders: Depo boyutu tahminleri paketli (sıkıştırılmış) boyut üzerinden
yapılmalı; `git count-objects -vH` doğru ölçüdür._

**Gerçekleşen kazanımlar (boyut değil):**
| Kazanım | Değer |
|---|---|
| `check.js` geçmişten silindi | Asıl güvenlik hedefi |
| Takip edilen dosya sayısı | 788 → **424** (%46 azalma) |
| IDE indeksleme / arama gürültüsü | 364 dosya daha az |

Windows'ta dosya **sayısı**, dosya **boyutundan** daha çok yavaşlatır —
bu açıdan kazanım gerçek.

#### 4f — Force-push ✅
```
git push --force-with-lease origin main
+ db5778a...c01c4a5  main -> main (forced update)
```
`--force` yerine `--force-with-lease` kullanıldı: uzak depo beklenen yerde
değilse işlem durur (başkasının gönderdiği bir şeyin üzerine yazılmaz).

**Doğrulama — GitHub'dan taze `--mirror` klon alınarak yapıldı**
(yerel deponun beyanına güvenilmedi):

| Kontrol | Sonuç |
|---|---|
| Uzak `main` | `c01c4a5` ✅ |
| `backend/check.js` | ✅ Yok |
| `.agents/skills`, `.claude/skills` | ✅ Yok |
| `arşivimde`, `kapaklar` | ✅ Yok |
| Nesne düzeyinde tarama | ✅ **0 eşleşme** |
| `.agents/AGENTS.md`, `.claude/launch.json`, `globals.css`, `main.ts`, `STATE.md` | ✅ Hepsi yerinde |
| Commit / dosya | 184 / 424 |

**Gerçek klon boyutu: 10,50 MB** (eski geçmişin tamamını içeren yedek bundle
14 MB'dı) → bugün klonlayan biri **~%25 daha az** indiriyor.

_İkinci düzeltme: 4e'de yerel ölçümle 0,61 MB kazanç raporlanmıştı; GitHub
kendi tarafında daha verimli paketlediği için gerçek kazanç daha yüksek çıktı.
Her iki ölçüm de kayda geçirildi._

**⚠️ Dikkat edilecek:** Depo başka bir makinede klonlanmışsa, oradaki kopya
**eski geçmişi** taşıyor. O kopyadan push yapılırsa silinen geçmiş geri gelir.
Böyle bir kopya varsa silinip yeniden klonlanmalı.

**Yedek saklama:** `Masaüstü/kuronexus-git-yedek-20260804-1121.bundle` (14 MB)
bir süre daha saklanacak. Her şeyin oturduğuna emin olunduğunda silinebilir.

---

#### 4g — Frontend uygulaması da GitHub App'e geçirildi ✅
Backend düzeltildikten sonra `kuronexus-frontend` hâlâ `Public GitHub`
kaynağındaydı ve aynı hatayı veriyordu (`could not read Username`).
Coolify'da her uygulama kendi kaynak ayarını taşıyor.

- Kaynak `ghb-ultnexusdev`e çevrildi, Base Directory `/frontend` doğrulandı
- Deploy sonucu: **`Deployment is Finished`** (09:09–09:11)

```
09:09:33  Importing ultnexusdev/KuroNexus:main (commit sha c01c4a576281e3a...)
09:11:11  Building docker image completed.
09:11:15  Rolling update completed.
```

**İki şeyi birden kanıtladı:**
1. GitHub App erişimi her iki uygulamada da çalışıyor
2. **Coolify, yeniden yazılmış geçmişi (`c01c4a5`) sorunsuz çekip derledi** →
   force-push dağıtım hattında hiçbir soruna yol açmadı

_Not: Başarısız ilk deneme sırasında site çalışmaya devam etti — Coolify
başarısız deploy'da eski konteyneri devirmiyor ("Removing the new version of
your application"). Doğru davranış._

---

## ✅ ADIM 3 ve 4 TAMAMLANDI

| İş | Durum |
|---|---|
| `check.js` güncel halden kaldırıldı | ✅ |
| Geçmiş sırlar için tarandı (7 açı) | ✅ Tek gerçek sır bulundu |
| Geçmiş yeniden yazıldı | ✅ 184 commit |
| Hedefler silindi | ✅ Taze klonla doğrulandı |
| Kritik dosyalar korundu | ✅ Taze klonla doğrulandı |
| Şişkinlik temizlendi | ✅ 788 → 424 dosya |

---

### Adım 3b — Git geçmişi sırlar için tarandı ✅
**Tarih:** 2026-08-04 · **Kapsam:** 187 commit, 792 benzersiz dosya

| Tarama açısı | Sonuç |
|---|---|
| Riskli dosya adları (`.env`, `.pem`, `.key`, `id_rsa`, `credentials`) | ✅ Yok |
| Kimlik bilgili bağlantı dizeleri | ⚠️ 4 eşleşme → 3'ü yer tutucu, **1'i bilinen `check.js`** |
| JWT token izleri (`eyJ…`) | ✅ 0 |
| Sağlayıcı anahtar önekleri (`ghp_`, `sk-`, `AKIA`, `xox*`, `apify_api_`) | ✅ 0 |
| 32–40 karakterlik hex anahtarlar (uygulama kodunda) | ✅ 0 |
| Genel `password/secret/apikey` ataması (uygulama kodunda) | ✅ 0 |
| Projeye özgü değişkenler | ✅ Hepsi yer tutucu |

**Projeye özgü değişkenlerin dosya bazında doğrulaması:**
`TMDB_API_KEY`, `TMDB_READ_ACCESS_TOKEN`, `APIFY_TOKEN`, `KAGGLE_KEY`,
`KAGGLE_API_TOKEN`, `KAGGLE_USERNAME`, `JWT_SECRET`, `ADMIN_PASSWORD`,
`ADMIN_EMAIL`, `POSTGRES_PASSWORD` — tümü yalnızca `.env.example`,
`backend/.env.example` ve `docker-compose.yml` içinde geçiyor ve değerleri
yer tutucu (`your-…`, `change-me-…`, `kuronexus_dev_password`) ya da boş.
**Gerçek değerler hiçbir zaman commit edilmemiş** — `.gitignore`'da `.env`
kuralının baştan doğru kurulmuş olması sayesinde.

**➡️ SONUÇ: Geçmişte tek bir gerçek sır var — `check.js`'teki PostgreSQL
parolası. O da 2026-08-04'te geçersiz kılındı (Adım 1).**

_Sınırlılık notu: Hiçbir otomatik tarama tam değildir; alışılmadık biçimde
saklanmış bir sır gözden kaçabilir. Gerçekçi vektörler yedi açıdan tarandı.
Sürekli koruma için GitHub'ın kendi secret scanning özelliği Adım 5'te
açılacak._

---

### Adım 3a — `backend/check.js` kaldırıldı ✅
**Tarih:** 2026-08-04

- `git rm backend/check.js` → commit `db5778a`
- Commit mesajı olayın tam kaydını içeriyor (ne, ne zaman, neden, ne yapıldı);
  **parolanın kendisi mesajda yok.**
- `.gitignore` güncellemesi (güvenlik günlüğü) aynı commit'te
- Push: `0283bb2..db5778a  main -> main`
- **Doğrulama:** `git ls-tree -r origin/main --name-only | grep check.js` →
  sonuç yok. Uzak deponun güncel ağacında dosya bulunmuyor.

**Kapsam:** Dosya deponun *güncel* hâlinden kalktı. **Git geçmişinde hâlâ
duruyor** — o, Adım 4'ün konusu.

**Neden yine de değerli:** Bugün depoyu klonlayan biri (ileride bir ortak, bir
CI sistemi) dosyayı çalışma dizininde bulmaz. Geçmişi kazmak ayrı bir çabadır.
Ayrıca içindeki parola zaten geçersiz kılındığı için dosya artık çalışan bir
anahtar değil, tarihsel bir kayıt.

---

### Adım 2 — DB portunun dışarıya kapalı olduğu doğrulandı ✅
**Tarih:** 2026-08-04

Üç **bağımsız** kaynaktan doğrulama alındı:

| Kaynak | Sonuç |
|---|---|
| Coolify paneli | `Make it publicly available` kapalı, `Ports Mappings` boş |
| İş yeri ağı → `65.108.220.5:5433` | `ERR_CONNECTION_TIMED_OUT` |
| Mobil veri (kısıtsız ağ) → aynı adres | Bağlanamadı |

**Neden bu kanıt geçerli:** Tarayıcı HTTP konuşmadan önce TCP el sıkışması
yapar. Hata türü ayırt edicidir:
- `ERR_EMPTY_RESPONSE` → TCP bağlandı, protokol uyuşmadı → **port açık**
- `ERR_CONNECTION_REFUSED` → host cevap verdi, port kapalı
- **`ERR_CONNECTION_TIMED_OUT`** → paketler düşürüldü → **erişilemez** ✅

Alınan sonuç üçüncüsü. Ayrıca *timeout* (refused değil) tercih edilen
davranıştır: sunucu portun varlığını bile belli etmiyor.

Mobil veriden de bağlanılamaması, "kurumsal güvenlik duvarı engelliyor olabilir"
karışıklığını ortadan kaldırdı — iki bağımsız ağ, aynı sonuç.

**➡️ Sonuç: Parolanın internette olduğu 23 gün boyunca, onu ele geçiren biri
bağlanacak bir uç bulamazdı.**

_(Not: Bir ara "tarayıcıyla test edilemez" değerlendirmesi yapılmıştı; bu
kısmen yanlıştı ve düzeltildi. Tarayıcı bir portun açık olduğunu doğrulayamaz
ama erişilemez olduğunu doğrulayabilir.)_

#### 2a — Korumanın kaynağı belirlendi ✅
Sunucu terminalinden (`ultnexus-prod`) ölçüldü:

```
# ss -tlnp | grep -E ':5432|:5433'
LISTEN 0 4096  0.0.0.0:5432  0.0.0.0:*  users:(("docker-proxy",pid=1421467,fd=7))

# ufw status verbose
Status: active
Default: deny (incoming), allow (outgoing), deny (routed)
22, 80, 443 → ALLOW IN  (v4 + v6)
```

**KuroNexus DB (5433): Senaryo A — yapısal koruma.** Hiçbir ağ arayüzünde
dinleyici yok; veritabanı yalnızca Docker iç ağında. Firewall kuralı bir gün
silinse bile bu port açılmaz. En dayanıklı koruma türü.

**UFW yapılandırması sağlıklı:** varsayılan `deny incoming`, yalnızca 22/80/443
açık.

---

## 🟠 YENİ BULGU — `0.0.0.0:5432` dinleniyor (UltNexus DB)

`ss` çıktısında **5432 portunda `docker-proxy` üzerinden bir dinleyici var.**
STATE.md'ye göre 5432 = **UltNexus** projesinin veritabanı (KuroNexus'a 5433
verilmesinin sebebi buydu).

**Neden önemli — Docker/UFW atlaması:**
Docker bir portu `-p` ile yayınladığında iptables kurallarını doğrudan yazar;
bu kurallar UFW'ninkilerden **önce** değerlendirilir. Trafik `INPUT` yerine
`FORWARD` zincirinden geçtiği için UFW onu hiç görmez. Sonuç: `ufw status`
"deny incoming" dese bile yayınlanmış bir konteyner portu internetten
erişilebilir olabilir.

- **5433** bu tuzağa düşmüyor → yayınlanmış port yok
- **5432** düşüyor olabilir → yayınlanmış port var

**Durum: DOĞRULANMADI.** Hetzner Cloud Firewall (ağ seviyesi, sunucudan
bağımsız) devredeyse engelliyor olabilir. Dış testle ölçülecek.

**Kapsam notu:** Bu bulgu KuroNexus'a değil UltNexus'a ait — bu çalışmanın
kapsamı dışında. Aynı sunucuda oldukları ve UltNexus DB'sinin ele geçirilmesi
saldırgana bu sunucuda dayanak sağlayacağı için raporlanıyor. Ele alınıp
alınmayacağına kullanıcı karar verecek.

**Dış test sonucu (2026-08-04):** `65.108.220.5:5432` mobil ağdan denendi →
**kapalı.** Şu an dışarıdan erişilemiyor.

**🟡 KABUL EDİLMİŞ / İZLENMESİ GEREKEN RİSK:**
5432'de `docker-proxy` dinleyicisi **hâlâ duruyor.** Bu, KuroNexus'unkinden
farklı bir koruma modeli:

| | KuroNexus (5433) | UltNexus (5432) |
|---|---|---|
| Dinleyici | Yok | **Var** (`0.0.0.0`) |
| Koruma türü | **Yapısal** — kapı yok | **Koşullu** — dış firewall engelliyor |
| Firewall kuralı silinirse | Etkilenmez | **Anında açılır** |

Öneri: UltNexus DB'sinin Coolify ayarında da `Make it publicly available`
kapatılarak yapısal korumaya geçirilmesi. (Kapsam dışı, kullanıcı kararına
bırakıldı.)

#### 2c — DB bağlantı günlüğü incelemesi — GEREKSİZ, KAPATILDI
Karar gerekçesi: 5433 portu sunucuda hiçbir zaman yayınlanmadığı için
dışarıdan gelen paketler PostgreSQL'e **ulaşamazdı**; ağ katmanında
düşerlerdi. PostgreSQL böyle bir denemeyi hiç görmez, günlüğüne yazmaz.
Aranan kayıt fiziksel olarak var olamaz — yokluğu da bir şey kanıtlamaz.
_(Ayrıca PostgreSQL'de `log_connections` varsayılan olarak kapalıdır.)_

---

### Adım 1 — PostgreSQL parolasını değiştir
**Tarih:** 2026-08-04
**Durum:** 🔄 Devam ediyor

#### 1a — Taze yedek alındı ✅
- Coolify → Kuronexus → production → `postgresql-database-gps2h7ukfnx374bzgkevec62`
  → Backups → "Backup Now".
- Sonuç: `Success`, 4 Ağustos 05:31, **4,45 MB**, 3 saniyede tamamlandı.
- Karşılaştırma: otomatik gece yedeği (03:00) 4,39 MB → içerik tutarlı,
  yedek gerçek veri taşıyor.
- DB durumu: `Running (healthy)`.

Keşif notu: Coolify kaynağında **Terminal sekmesi mevcut** → SSH olmadan da
veritabanı konteynerine komut gönderilebiliyor. Parola değişimi bu yolla
yapılacak.

#### 1b — Yeni parola üretildi ✅
- 40 karakter, yalnızca `[A-Za-z0-9]` → URL-güvenli (bağlantı dizesinde
  `@ : / ? # %` gibi ayırıcı karakterler yok).
- Kaynak: `System.Security.Cryptography.RandomNumberGenerator` (kriptografik).
- Parola yöneticisine kaydedildi. **Sohbete/koda/depoya girmedi.**

#### 1c — Terminal erişimi doğrulandı ✅
- Coolify → PostgreSQL kaynağı → Terminal → konteyner bağlantısı çalışıyor.
- PostgreSQL sürümü: **18.4** (Alpine/musl).
- `psql -U postgres` yerel soketten **parolasız** bağlanıyor (trust auth).
  → Yanlış parola ayarlansa bile konteynerden geri düzeltilebilir; kendimizi
  dışarıda bırakma riski yok.
- Çıkarım: parola yalnızca **ağ üzerinden** gelen bağlantıları koruyor.

#### 1d — Parola veritabanı içinde değiştirildi ✅
- Yöntem: `psql` içinde `\password postgres` (interaktif).
  `ALTER USER ... WITH PASSWORD '...'` **bilerek kullanılmadı** — o yöntemde
  parola shell geçmişine, işlem listesine ve olası DB günlüklerine düz metin
  düşer. `\password` parolayı yerelde şifreleyip gönderir.
- Doğrulama: `md5(rolpassword)` parmak izi öncesi/sonrası karşılaştırıldı.
  - Önce: `8749ecb7ddb91660a22ccceb57f5eb38`
  - Sonra: `227aebf22621659e83e0e1bfa163112f`
  - **Farklı → parola değişimi kanıtlandı.**

#### 1e — Backend `DATABASE_URL` güncellemesi 🔴 ENGELLENDİ
Env değişkeni güncellendi, ancak **redeploy başarısız oldu** ve sebebi parola
değil:

```
exit code 128 · git ls-remote https://github.com/ultnexusdev/KuroNexus refs/heads/main
fatal: could not read Username for 'https://github.com/ultnexusdev/KuroNexus':
No such device or address
```

**Teşhis:** Coolify, private depoyu GitHub'dan çekemiyor — geçerli bir kimlik
doğrulaması (GitHub App / deploy key / PAT) yapılandırılmamış ya da süresi
dolmuş. En olası senaryo: depo yakın zamanda public'ten private'a çevrildi ve
anonim klonlama yolu kapandı.

**Sonuçları:**
1. Backend **hiç yeniden dağıtılamıyor** → hiçbir kod değişikliği canlıya
   çıkamaz. Bu, parola işinden bağımsız ve ondan daha ağır bir engel.
2. Coolify eski sürüme geri döndü (`Removing the new version`); çalışan
   konteyner hâlâ **eski parolayı** taşıyor.
3. Backend yeni DB bağlantısı açamayacağı için site kısa sürede düşecek.

**Bu bulgu bizim yaptığımız değişiklikten kaynaklanmıyor** — mevcut bir arıza,
parola çalışması sırasında ortaya çıktı.

**Kök neden teyit edildi:** Depo bugüne kadar **public**ti; kullanıcı bugünkü
çalışmaya başlamadan önce private'a çevirdi. Coolify o zamana kadar depoyu
kimliksiz (anonim HTTPS) klonluyordu; private olunca bu yol kapandı.

**Gözlenen site davranışı:** Frontend ayakta, sayfa HTTP 200 dönüyor, ama
raflar boş. Sebep: `lib/api/*.ts` içindeki `catch { return [] }` deseni
(inceleme raporu bulgu Ö-8). Sistem arızalıyken arızalı olduğunu söylemiyor —
bu bulgunun canlı doğrulaması.

---

### Adım 0 — Coolify ↔ GitHub kimlik doğrulaması (araya giren acil iş)
**Tarih:** 2026-08-04
**Durum:** 🔄 Devam ediyor

Seçilen yöntem: **Deploy Key (SSH)**.
Gerekçe: en az yetki ilkesi — tek depoya, salt-okuma erişim. GitHub App'e
göre daha dar yetkili ve daha az hareketli parça. Otomatik deploy kaybı
önemsiz: STATE.md'ye göre auto-deploy zaten güvenilir çalışmıyordu, deploy
elle tetikleniyordu.

#### 0a — ED25519 anahtar çifti üretildi ✅
- Coolify → Keys & Tokens → Private Keys → Generate new ED25519 SSH Key
- Ad: `github-kuronexus-deploy` (Coolify'ın verdiği rastgele ad düzeltildi)
- Açık anahtar doğrulandı: `ssh-ed25519` + 68 karakterlik gövde, eksiksiz
- Özel anahtar Coolify'da kaldı; hiçbir yere kopyalanmadı, sohbete girmedi
- RSA yerine ED25519 seçildi: modern eğrisel algoritma, GitHub tam destekliyor

#### 0b — Açık anahtar GitHub'a tanıtıldı ✅
- Konum: GitHub → ultnexusdev/KuroNexus → Settings → Deploy keys
- Başlık: `Coolify - production deploy`
- Parmak izi: `SHA256:c0+5yt620ZceQ1PS20Z/yGp2iNk4R1RLRm2rMpsZRq8`
- **Yetki: `Read-only`** — "Allow write access" bilinçli olarak işaretlenmedi.
  Gerekçe: anahtar sızarsa saldırgan yalnızca kodu okuyabilir; yazma yetkisi
  olsaydı depoya kod gönderip deploy hattı üzerinden sunucuyu ele geçirebilirdi.
- Durum: `Never used` (beklenen — Coolify henüz denemedi). Bu alan, sonraki
  adımın doğrulama göstergesi olarak kullanılacak.

#### 0c — Kaynak yapılandırması incelendi, yol değiştirildi ✅
- Backend uygulaması `Public GitHub` türüyle kurulmuş; depo `owner/repo`
  biçiminde tutuluyor, **SSH adresi/deploy key kabul etmiyor.**
- `Change Git Source` yalnızca GitHub App türü kaynakları listeliyor
  ("No other sources found").
- **Deploy key önerisi geri çekildi:** Coolify'da mevcut bir uygulamayı
  deploy key'e dönüştürme yolu yok; yalnızca uygulama ilk kurulurken seçilebiliyor.
- **Uygulamayı silip yeniden kurma seçeneği reddedildi.** Gerekçe:
  `Persistent Storage` bağlantısı kaybolabilir → `/app/uploads` altındaki
  kitap kapakları ve yüklenen görseller yetim kalır. Bir kimlik doğrulama
  sorunu için veri riski alınmaz.
- `DATABASE_URL` değişikliğinin kayıtlı olduğu doğrulandı
  ("1 unapplied configuration change detected").

#### 0d — GitHub App oluşturuldu ve kuruldu ✅
- Ad: `ghb-ultnexusdev`, kişisel hesap (`ultnexusdev`) üzerinde
- App Id `4481500`, Installation Id `151123424` → hem oluşturuldu hem kuruldu
  (Installation Id boş olsaydı hiçbir depoya erişemezdi)
- Bağlantı SSH üzerinden (`git`, port 22)

#### 0e — Verilen yetki doğrulandı ✅
**Depo kapsamı:** `Only select repositories` — **1 depo**. `All repositories`
bilinçli olarak seçilmedi; uygulama hesaptaki diğer depoları göremiyor.

**İzinler:**
| İzin | Seviye | Değerlendirme |
|---|---|---|
| code (contents) | Okuma | Gerekli — klonlama bunun üstünden |
| metadata | Okuma | Tüm GitHub App'lerde zorunlu |
| administration | Okuma | İhtiyaçtan geniş, ama değiştiremez |
| pull requests | **Okuma + Yazma** | ⚠️ Coolify'ın preview deployment özelliği için |

**En önemli tespit: `write access to code` YOK.** Uygulamanın kimlik
bilgileri ele geçirilse bile saldırgan depoya kod gönderemez, `main`
branch'ine yazamaz, deploy hattı üzerinden zararlı kod süremez.

**KABUL EDİLMİŞ BİLİNEN RİSK — `pull requests: write`**
Daraltılmadı. Gerekçe: bu izni kötüye kullanmak için önce Coolify
sunucusunun ele geçirilmesi gerekir; o senaryoda sunucu, veritabanı ve tüm
sırlar zaten kaybedilmiş olur — PR yetkisi en küçük sorun olur. Ayrıca açılan
bir PR, elle birleştirilmedikçe canlıya çıkmaz.
_Gözden geçirme: preview deployment özelliği kullanılmayacaksa bu izin
ileride kaldırılabilir._

#### 0f — Git kaynağı değiştirildi ve deploy başarılı ✅
- Kaynak: `Public GitHub` → **`ghb-ultnexusdev`** (GitHub App)
- Geçiş, `Persistent Storage` ve env değişkenlerine dokunulmadan yapıldı
- Deploy sonucu: **`Deployment is Finished`** (2026-08-04 06:54–06:56)

Log kanıtları:
```
06:54:06  Importing ultnexusdev/KuroNexus:main (commit sha 0283bb2335138e91...)
06:55:48  Building docker image completed.
06:55:49  Rolling update started.  →  New container started.  →  Removing old containers.
06:56:22  Rolling update completed.
```
- `could not read Username` hatası **kayboldu** → GitHub App erişimi çalışıyor
- Çekilen commit `0283bb2335…`, deponun güncel `main` ucuyla eşleşiyor
- Rolling update: yeni konteyner ayağa kalktıktan sonra eski kaldırıldı

**➡️ ADIM 0 TAMAMLANDI.** Deploy hattı onarıldı; artık kod değişiklikleri
(güvenlik yamaları dahil) canlıya çıkarılabiliyor.

#### 1e/1f — Yeni parola uçtan uca doğrulandı ✅
- Deploy sonrası site kontrol edildi: **içerik geri geldi** (kitaplar, filmler,
  evrenler görünüyor).
- Bu, gözleme dayalı bir kanıttır: backend DB'ye bağlanamasaydı sayfa yine
  açılır ama raflar boş kalırdı (`catch { return [] }` deseni). İçeriğin
  gelmesi, `DATABASE_URL`'deki parolanın veritabanındaki yeni parolayla
  birebir tuttuğunu gösterir.

**➡️ ADIM 1 — PAROLA ROTASYONU İŞLEVSEL OLARAK TAMAMLANDI.**
Kalan tek iş: Coolify'ın PostgreSQL kaynağında saklı olan **eski** parola
kaydının hizalanması ve otomatik yedeklemenin hâlâ çalıştığının doğrulanması
(Adım 1g).

**Yan tespit (sonraya):** Uygulama durumu `Running (unknown)` + ⚠️ —
tanımlı healthcheck yok, Coolify uygulamanın sağlıklı olup olmadığını
bilmiyor. İnceleme raporu bulgu Ö-4 (`/health` ucu yok) ile aynı kök.

#### 1g — Yedeklemenin etkilenmediği doğrulandı ✅
Parola değişiminden sonra elle yedek alındı:
```
Success · 2026-08-04 07:12 · 4,45 MB   ← parola değişiminden SONRA
Success · 2026-08-04 05:31 · 4,45 MB   ← parola değişiminden ÖNCE
```
**Çıkarım:** Coolify'ın yedekleme işi, sakladığı ağ parolasını kullanmıyor;
konteyner içinden yerel soket üzerinden `pg_dump` çalıştırıyor (Terminal'de
`psql -U postgres`in parola sormamasıyla aynı mekanizma). Yedekleme zinciri
sağlam. DB durumu: `Running (healthy)`.

#### 1h — Coolify'ın saklı parola kaydı hizalandı ✅
- Coolify → PostgreSQL → Configuration → General → `Password` alanı yeni
  parolayla güncellendi ve kaydedildi.
- Doğrulama 1 — **yedekleme**: hizalamadan sonra alınan yedek `Success`,
  2026-08-04 07:49, 4,45 MB. (Günün üçüncü başarılı yedeği: 05:31 → 07:12 → 07:49.)
- Doğrulama 2 — **site**: mobil bağlantıdan kontrol edildi, içerik görünüyor
  → backend DB bağlantısı sağlam.
- **Uykuda risk kapandı:** Veritabanı bir gün sıfırdan kurulsa bile artık
  sızmış eski parolayla değil, yeni parolayla açılır.

---

## ✅ ADIM 1 TAMAMLANDI — PostgreSQL parola rotasyonu

| Katman | Durum |
|---|---|
| PostgreSQL'in kendi parolası | ✅ Değiştirildi (`\password`), parmak iziyle kanıtlandı |
| Backend `DATABASE_URL` | ✅ Güncellendi, deploy ile uygulandı, içerik dönüşüyle doğrulandı |
| Coolify saklı kaydı | ✅ Hizalandı, yedeklemeyle doğrulandı |
| Yedekleme zinciri | ✅ Üç kez test edildi, çalışıyor |

**23 gün internete açık kalan parola artık hiçbir katmanda geçerli değil.**

**Yapılandırma incelemesi (2026-08-04) — bulgular:**

| Ayar | Değer | Değerlendirme |
|---|---|---|
| Image | `postgres:18-alpine` | Güncel sürüm |
| Username | `postgres` | Superuser — tek rol kullanılıyor |
| **Make it publicly available** | ⬜ **Kapalı** | ✅ Proxy dışarıya yol açmıyor |
| **Ports Mappings** | *(boş)* | ✅ Docker seviyesinde host'a port bağlanmamış |
| Public Port | `5433` | Yalnızca *tercih* — kutucuk kapalı olduğu için kullanılmıyor |
| Enable SSL | ⬜ Kapalı | 🟡 Backend↔DB trafiği şifresiz (aynı Docker ağı, risk düşük) |
| Host Auth Method | *(boş/varsayılan)* | — |
| Initialization scripts | Yok | — |

**➡️ PANEL SEVİYESİNDE DOĞRULANDI: Veritabanı dışarıya kapalı.**
STATE.md'deki 8 Temmuz kaydı teyit edildi — parolanın internette olduğu 23
gün boyunca ağ kapısı gerçekten kapalıydı. *(Panel dışından bağımsız
doğrulama Adım 2'de yapılacak; panelin beyanı tek başına kanıt sayılmaz.)*

**Coolify'ın kendi uyarısı** (General bölümünde sarı ile):
> *"If you change the values in the database, please sync it here, otherwise
> automations (like backups) won't work."*

Bu, 1h adımının yalnızca ihtiyat değil, üreticinin talimatı olduğunu gösteriyor.

**Neden yarım bırakılmıyor — UYKUDA RİSK:**
Coolify hâlâ sızmış eski parolayı saklıyor. Bugün zararsız, çünkü PostgreSQL
`POSTGRES_PASSWORD` ayarını yalnızca **ilk kurulumda** okuyor. Ancak veritabanı
kaynağı bir gün yeniden kurulursa ya da disk sıfırlanırsa, PostgreSQL sıfırdan
başlar ve **internete sızmış eski parolayla** kurulur. Bugün kapattığımız
açık, aylar sonra kendiliğinden geri gelir ve kimse sebebini hatırlamaz.

---
