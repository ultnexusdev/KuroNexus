# Deploy düzeni — neden çöküyordu, ne değişti

> 14 Ağustos 2026. Kullanıcının bildirdiği arıza: "backend ve frontend aynı
> anda deploy edilince site çöküyor." Ölçüldü, sebebi bulundu, üç ayarla
> kapatıldı. **Kod değişmedi** — üçü de Coolify panel ayarı.

---

## 1 · Sunucu ne kaldırabiliyor (ölçüm)

Coolify → Servers → localhost → Configuration → General:

| | |
|---|---|
| OS | Ubuntu 24.04.4 LTS |
| CPU | **2 çekirdek** |
| RAM | **3.7 GB** |

Bu makinede sürekli çalışanlar: PostgreSQL, `kuronexus-backend`,
`kuronexus-frontend`, Coolify'ın kendisi (Laravel + Redis + kendi
PostgreSQL'i), Traefik proxy. Kabaca 1.5–2 GB.

Derlemelerin tepe kullanımı: Next.js üretim derlemesi tek başına 1.5–2.5 GB,
Nest + `prisma generate` 1–1.5 GB.

**Yani iki derleme aynı anda 3.7 GB'a sığmıyor.**

## 2 · Çökmenin mekanizması

`Number of concurrent builds` **2** idi. Tek bir push iki uygulamayı da
tetiklediği için iki derleme aynı anda başlıyordu.

Bellek tükendiğinde Linux'un OOM killer'ı devreye giriyor ve **hangi süreci
öldüreceğini biz seçmiyoruz.** Derlemeyi değil, çalışan backend konteynerini
ya da PostgreSQL'i öldürebiliyor. Site böyle çöküyordu.

2 çekirdekli bir makinede paralel derlemenin zaten hiçbir kazancı yok: aynı
toplam CPU işi yapılıyor, yalnızca bellek tepesi ikiye katlanıyor. Yani
sıraya almanın **hızda maliyeti yok**.

## 3 · Uygulanan üç ayar

### 3a. Eşzamanlı derleme = 1

`Servers → localhost → Configuration → Advanced → Builds`
→ **Number of concurrent builds: 2 → 1**

Diğer iki alan değişmedi (Deployment timeout 3600, queue limit 25).

Geri alma: değeri 2 yap, Save.

### 3b. Watch Paths — asıl kazanç

`Projects → <proje> → <environment> → <uygulama> → Configuration → General`
→ **Watch Paths**

| Uygulama | Değer |
|---|---|
| `kuronexus-backend` | `backend/**` |
| `kuronexus-frontend` | `frontend/**` |

**Neden bu depoda risksiz:** iki taraf da tamamen kendi kendine yeterli.
`backend/` ve `frontend/` klasörlerinin **her birinin kendi
`package.json`, `pnpm-lock.yaml` ve `pnpm-workspace.yaml`'ı var**; kökte
paylaşılan hiçbir derleme girdisi yok (kökte `package.json` bile yok).
Her iki `Dockerfile` da yalnızca kendi klasörünü bağlam alıyor. Yani bir
tarafın dışındaki hiçbir dosya o tarafın derlemesini etkileyemez.

**Manuel "Deploy" butonu Watch Paths'ten etkilenmez** — istendiği an zorla
deploy edilebilir. Geri alma: kutuyu boşalt, Save.

**Neden gerekliydi (ölçüm, son 40 commit):**

| Commit türü | Adet | Watch Paths öncesi |
|---|---|---|
| Sadece frontend | 12 | backend de derleniyor + `migrate deploy` boşuna koşuyor |
| Sadece backend | 5 | frontend de derleniyor |
| Sadece belge | 9 | **iki uygulama da boşuna derleniyor** |
| İkisi birden | 14 | ikisi de gerekli |

**40 push'un 26'sında (%65) eşzamanlı çift derleme tamamen gereksizdi.**
Üstelik her gereksiz backend derlemesi `prisma migrate deploy`'u yeniden
koşuyordu — 11 Ağustos'ta yarım saatlik kesintiye yol açan riski hiçbir
kazanç karşılığı olmadan tekrarlıyordu (bkz. `DEVIR-2026-08-11.md` §4).

### 3c. Backend health check (ÖNERİLDİ — uygulandığı doğrulanmadı)

`kuronexus-backend → Configuration → Healthcheck`

| Alan | Değer |
|---|---|
| Path | `/health` |
| Port | `3001` |
| Method | `GET` |
| Return code | `200` |
| Interval | `30` |
| Timeout | `10` |
| Retries | `3` |
| **Start period** | **`120`** |

⚠️ **Start period kısa tutulmamalı.** Konteyner açılırken önce
`prisma migrate deploy` koşuyor, API ondan sonra başlıyor. Süre yetmezse
Coolify daha migration biterken konteyneri ölü sanıp öldürür.

`/health` ucu (`backend/src/app.controller.ts`) boş bir `ok` dönmüyor,
gerçekten `SELECT 1` atıyor. Bu projede fark önemli: veritabanına
ulaşılamadığında site zaten HTTP 200 dönüyor ve yalnızca raflar sessizce
boş geliyor (inceleme raporu bulgu Ö-8).

Doğrulama:

```bash
curl -s https://api.kuronexus.com/health
# beklenen: {"status":"ok","db":"up"}
```

Geri alma: Healthcheck → Disabled, Save, yeniden deploy.

---

## 4 · Alışkanlık: iki taraf değişiyorsa iki push

Watch Paths sıralamayı bedava veriyor. Backend ve frontend birlikte
değiştiğinde tek push yerine:

1. Backend commit'ini push et → Coolify'da yeşile döndüğünü gör
2. Frontend commit'ini push et

Her push yalnızca kendi tarafını tetikler, sıra garantili olur. Bu,
`spor-uretim-cikis.md`'deki "backend → içerik → frontend" sırasının kalıcı
hâli: yeni uçlar ve migration'lar, onları çağıran sayfalardan **önce**
canlıda olur.

Sıra bu yönde olmalı çünkü ters yönün bedeli görünür: frontend'in taşıdığı
kalıcı yönlendirmeler deploy edildiği **an** devreye giriyor; hedef sayfa
henüz olmayan bir uçtan veri isterse 404 döner.

---

## 5 · Bilerek DEĞİŞTİRİLMEYEN

**`backend/Dockerfile` `CMD` zinciri**
(`npx prisma migrate deploy && node dist/main`) **olduğu gibi kalıyor.**
`DEVIR-2026-08-11.md` §4.4'te "karar bekliyor" diye duran madde bu turda
kapandı — cevap: **ayrılmayacak.**

Gerekçe: mevcut hâli bilinçli olarak *sessiz bozulma yerine gürültülü duruş*
seçiyor. Migration patlarsa uygulama hiç başlamaz, Coolify başarısız
deploy'da eski konteyneri devirmediği için **site ayakta kalır** ve gerçek
hata deploy logunda görünür. Zincir ayrılırsa uygulama eksik tablolarla
başlar; bu projede o durum 200 dönen ama boş raflı bir siteye dönüşür —
teşhisi çok daha zor bir arıza.

Asıl sorun zincirin kendisi değil, **ne kadar sık koştuğuydu**. Onu da
Watch Paths çözdü: backend artık yalnızca backend değiştiğinde derleniyor.

---

## 6 · Açık kalanlar

- **"Sentinel Out Of Sync"** — Coolify metrik toplayıcısı senkron değil.
  Site çalışmasını etkilemiyor ama **Resources sekmesindeki RAM/CPU
  grafikleri güvenilmez** demek. Bakılmadı.
- **Docker Cleanup** sekmesinin açık olduğu doğrulanmadı. 3.7 GB RAM'li ve
  disk uyarı eşiği %80 olan bir makinede imaj birikimi hızlı olur; geçmişte
  bir kez `/artifacts` dolduğu için frontend deploy'u düşmüştü.
- **Swap** ölçülmedi. Eşzamanlılık 1'e indiği için acil değil, ama 3.7 GB'da
  tek bir Next.js derlemesi bile tepeye yaklaşıyor olabilir.

---

## 7 · Doğrulama (14 Ağustos, ölçüldü)

Ayarlar girildikten sonra **belge-only** bir commit (`57c7e0d`) push edildi.
Sonuç: **iki uygulamada da deploy başlamadı.** Watch Paths öncesinde bu push
iki Docker derlemesi tetikleyecekti.

⚠️ **Bu tek başına yeterli kanıt DEĞİLDİ.** "Deploy başlamadı" iki şeyin
ikisine de uyuyor:

1. Webhook geldi, Coolify baktı, eşleşme yok, **bilerek** atladı → istenen
2. Webhook hiç gelmedi, Coolify push'tan haberdar olmadı → sessiz arıza

İkisi dışarıdan aynı görünüyor ve ikincisi bu depoda daha önce yaşandı
(STATE.md, Temmuz: "Push sonrası Coolify auto-deploy tetiklenmedi").

**Ayırt etme yolu — hiçbir şey deploy etmeden:**
GitHub → repo **Settings → Webhooks** → payload URL'i
`http://65.108.220.5:8000/webhooks/source/github/events/manual` olan kanca →
**Recent Deliveries**. Yeşil tik + `200` = webhook çalıştı ve Coolify
bilerek atladı. Kırmızı ya da kayıt yok = webhook kırık.

**Ölçülen:** 14.08 11:38, 13.08 23:31 ve 12.08 22:22 teslimatlarının
üçü de yeşil. Webhook sağlıklı, sessizlik Watch Paths'in eseri.
Tek kanca var; Coolify onu içeride iki uygulamaya dağıtıyor.

**Tam kanıt gerekirse** (bu tur gerekmedi): `frontend/` içine zararsız bir
yorum satırı commit'leyip push et. Frontend deploy başlar **ve** backend
başlamazsa hem webhook hem Watch Paths kanıtlanmış olur.
