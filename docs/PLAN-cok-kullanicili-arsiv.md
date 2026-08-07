# Karar — Arşiv Kişisel Kalıyor (çok kullanıcılı YAPILMAYACAK)

> ## ⛔ KARAR VERİLDİ: BU İŞ YAPILMAYACAK
>
> **7 Ağustos 2026.** Kardeşlerin kendi arşivlerini tutabilmesi için çok
> kullanıcılı yapı araştırıldı, ölçüldü ve planlandı. Kullanıcı planı ve
> maliyeti gördükten sonra **vazgeçti**:
>
> > "Böyle kalsın kişisel arşiv olarak, uğraşmaya değmez."
>
> Gerekçe: maliyet (≈3–4M token, güvenlik hassasiyetli) kazanıma değmiyor.
> Site zaten "kişisel kültür arşivi" ve motto da öyle kurulu.
>
> **Bu belge silinmedi çünkü ölçümü taşıyor.** Konu yeniden açılırsa aşağıdaki
> sayılar yeniden çıkarılmasın: veri modeli ve yazma yolu ZATEN hazır, eksik
> olan yalnızca 28 okuma sorgusu ve opsiyonel kimlik.
>
> ⚠️ Bu kararı kullanıcı vermeden yeniden önerme.
>
> ---
>
> Aşağıdaki plan, karar anındaki hâliyle korunuyor.

---

## 1 · Nerede duruyoruz (ölçüldü, tahmin değil)

| Katman | Durum |
|---|---|
| **Veri modeli** | ✅ Hazır. Dört arşiv tablosunda `userId`, `User` ilişkisi, `@@unique([userId, X])`, `@@index([userId, …])` |
| **Yazma yolu** | ✅ Hazır. `create(dto, userId)`, `where: { userId_tmdbId: … }` |
| **Rol sistemi** | ✅ `Role` enum: `ADMIN / EDITOR / VIEWER` |
| **Kimlik altyapısı** | ✅ `@CurrentUser()` dekoratörü, `AuthenticatedUser { id, email, name, role }`, `JwtAuthGuard`, `RolesGuard` |
| **Okuma yolu** | ❌ **28 sorguda `userId` süzgeci yok** |
| **Opsiyonel kimlik** | ❌ Yok. Herkese açık uçlar "soran kim, varsa" diye sormuyor |
| **Kayıt akışı** | ❌ Bilinçli kapalı (`/register`) — tek kullanıcı varsayımı |

**Süzgeçsiz okumaların dağılımı** (Prisma'nın ürettiği istemci hariç):

| Dosya | Süzgeçli | Süzgeçsiz |
|---|---|---|
| `books.service.ts` | 1 | **9** |
| `anime.service.ts` | 1 | **7** |
| `shows.service.ts` | 3 | **5** |
| `pulse.service.ts` | 0 | **4** |
| `movies.service.ts` | 3 | **3** |
| **Toplam** | 8 | **28** |

> ⚠️ Daha önce "55 sorgu" demiştim, yanlıştı: o sayı `generated/prisma`
> altındaki üretilmiş istemci dosyalarını da sayıyordu. Gerçek iş 28 sorguda.

**Veri göçü gerekmiyor.** Mevcut kayıtların hepsinde zaten `userId` var ve
sahibine bağlı.

---

## 2 · Verilmiş karar

Giriş yapmamış ziyaretçi **sahibin arşivini** görür (vitrin). Kardeşler giriş
yapınca **aynı adreslerde** kendi arşivlerini görür. Adresler değişmez, SEO ve
mevcut bağlantılar bozulmaz.

Bu kararın teknik karşılığı: her okuma "hangi kullanıcının arşivi" sorusunu
şöyle cevaplar → *oturum varsa o kullanıcı, yoksa sahip*.

---

## 3 · Adımlar

Her adım tek başına dağıtılabilir ve doğrulanabilir. Sıra önemli: 0 ve 1
olmadan ötekiler yazılamaz.

### Adım 0 — Sahip kavramı + opsiyonel kimlik
- `OWNER_USER_ID` (ortam değişkeni ya da "ilk ADMIN" sorgusu) — ziyaretçinin
  gördüğü arşivin sahibi
- Yeni `OptionalJwtGuard`: token varsa çözer, yoksa **401 vermez**, `user`
  boş kalır. Bugünkü `JwtAuthGuard` zorunlu; herkese açık uçlarda kullanılamaz
- `resolveViewerId(user)` yardımcısı: `user?.id ?? OWNER_USER_ID`
- **Doğrulama:** giriş yapmadan `/movies` hâlâ 200 dönüyor ve sahibin arşivini
  veriyor; girişliyken kendi kimliği çözülüyor

### Adım 1 — Bir salonu uçtan uca kapsama al (FİLM, pilot)
En küçük salon (3 süzgeçsiz sorgu) önce yapılır ki desen otururken hata ucuz olsun.
- `movies.controller.ts` uçlarına opsiyonel kimlik, `viewerId` servise geçer
- `getArchive`, `getDetail`, `showcase`, komşular, istatistikler → `where: { userId: viewerId }`
- Slug türetimi kullanıcı içinde kalır (zaten `withSlugs` liste bazlı)
- **Doğrulama:** iki test kullanıcısıyla, birinin arşivi ötekinde görünmüyor

### Adım 2 — Kalan üç salon
`dizi` (5) → `anime` (7) → `kitap` (9). Aynı desen, artan büyüklük sırasıyla.
Kitap en sonda çünkü künye ilişkileri (yazar/çevirmen/yayınevi) en karmaşığı.

### Adım 3 — Nabız ve ana sayfa (4 sorgu)
`/pulse` salon sayaçlarını, "şu an" şeridini ve "son eklenenler"i üretiyor —
üçü de kişiye özel olmalı. Ana sayfa vitrin olduğu için giriş yoksa sahibin
sayıları görünür.

### Adım 4 — Ortak sayfaların "arşivimde var mı?" kontrolleri
Ödüller, okuma sırası, kaynak künye sayfası ve benzer içerik rozetleri
"bu kayıt arşivde var mı" diye soruyor. Bunlar **kişiye özel** olmalı, sayfanın
kendisi ortak kalmalı.

### Adım 5 — Hesap açma ve küratör yetkisi
- Kayıt yine herkese açık **olmayacak**: hesapları sahip açar (panelden).
  Açık kayıt, tanımadığın birinin veri yazması demek
- Her kullanıcı kendi arşivinin küratörü; başkasının kaydını düzenleyemez
- Küratör modu bugün `isAdmin`e bakıyor → "bu kayıt benim mi"ye dönmeli

### Adım 6 — Frontend oturum bağlamı
Sunucu bileşenleri zaten çerez okuyor (`readIsAdmin`). Okuma isteklerinin
oturumu taşıması ve önbelleklerin **kullanıcıya göre** ayrışması gerekiyor.
⚠️ Burası sessiz sızıntının en olası yeri: kullanıcı A'nın sayfası önbelleğe
girip kullanıcı B'ye servis edilirse veri sızar. `no-store` ya da kullanıcı
anahtarlı önbellek şart.

### Adım 7 — Güvenlik denetimi
28 sorgunun tamamı tek tek gözden geçirilir; ayrıca yetki sınırları
(başkasının kaydını güncelleme/silme denemesi) sınanır.

---

## 4 · Riskler

| Risk | Neden ciddi |
|---|---|
| **Tek eksik süzgeç = sızıntı** | 28 sorgudan biri atlanırsa kardeşin arşivi başkasına görünür. Sessiz hata: hiçbir yerde patlamaz |
| **Önbellek sızıntısı** | Next önbelleği kullanıcıya göre ayrışmazsa A'nın sayfası B'ye servis edilir. Sorgular doğru olsa bile olur |
| **Slug çakışması** | Slug listeye bağlı türetiliyor. Kapsam daralınca slug'lar değişir; eski bağlantılar kırılabilir |
| **Ortak sayfaların kirlenmesi** | Ödül/okuma sırası ortak kalmalı; yanlışlıkla kişiye özelleşirse herkes farklı liste görür |
| **Geri dönüşü zor** | Kardeşler veri girmeye başladıktan sonra "vazgeçtim" demek zor |

---

## 5 · Maliyet

Bugünkü ölçülmüş veri noktaları: 5 ajanlık iş ~590k, 19 ajanlık inceleme ~1,3M,
22 ajanlık özellik+inceleme ~2M token.

| Adım | Tahmin |
|---|---|
| 0 · Sahip + opsiyonel kimlik | 200–300k |
| 1 · Film (pilot) | 300–400k |
| 2 · Dizi + anime + kitap | 900–1,3M |
| 3 · Nabız + ana sayfa | 200–300k |
| 4 · Ortak sayfa kontrolleri | 200–300k |
| 5 · Hesap açma + küratör yetkisi | 300–400k |
| 6 · Frontend oturum + önbellek | 300–400k |
| 7 · Güvenlik denetimi (tam derinlik) | 500–800k |
| **Toplam** | **≈ 2,9 – 4,2M token** |

Yani bugün yapılan bütün işlerin toplamıyla aynı mertebede, muhtemelen üstünde.
Bu, kalibrasyon kuralının "tam derinlik" dediği tek iş türü — burada inceleme
kısmak sızıntı riskini doğrudan artırır.

---

## 6 · Daha ucuz iki alternatif

### A · Hiç yapma — arşiv kişisel kalsın
**Maliyet: 0.** Kardeşler bugünkü gibi sahibin arşivini gezer. Site zaten
"kişisel kültür arşivi" diyor; motto da öyle. Vazgeçilen tek şey onların kendi
listelerini tutabilmesi.

### B · Ayrı kurulum
Aynı kod tabanı, **kardeş başına ayrı Coolify uygulaması + ayrı veritabanı**.

- **Kod maliyeti 0** — tek satır yazılmıyor
- **En güçlü izolasyon**: sızıntı fiziksel olarak imkânsız, çünkü paylaşılan
  veritabanı yok. Yukarıdaki risk tablosunun tamamı buharlaşıyor
- Bedeli: her kurulum ayrı bakım, ayrı yedek, ayrı domain; ortak sayfalar
  (ödüller, kadim dünyalar) her kurulumda ayrı ayrı durur ve senin yazdığın
  içerik onlara geçmez
- Sunucu kaynağı: her kurulum kendi konteynerini ve DB'sini ister

> B seçeneği, 3–4M tokenlık güvenlik hassasiyetli bir refaktörü bir kurulum
> işine çeviriyor. Ortak içeriğin paylaşılması önemli değilse en akıllı yol bu.

---

## 7 · Karar için sorulacaklar

1. Kardeşlerin **senin** arşivini görmesi gerekiyor mu, yoksa yalnızca kendi
   listeleri mi olsun? (Gerekmiyorsa → B seçeneği)
2. Ortak içerik (ödüller, kadim dünyalar, karakter analizleri) onlarda da
   görünsün mü? (Görünecekse → B zayıflar, tek kurulum gerekir)
3. Kaç kişi? İki-üç kişi için B, beş üstü için tek kurulum daha mantıklı
4. Bu iş şimdi mi, yoksa ana sayfa/salon işleri bitince mi?
