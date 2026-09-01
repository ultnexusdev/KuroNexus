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

### 3c. Backend health check (1 Eylül 2026: panelden AÇILDI)

⚠️ **İmajda `curl` şart.** İlk deneme (1 Eylül) tam da bu yüzden düştü:
Coolify, Dockerfile tabanlı uygulamada HTTP tipli kontrolü bile konteynerin
İÇİNDEN curl/wget ile atıyor — imajda yokken uyarı basıp yeni konteyneri
unhealthy sayıyor ve eski konteynere geri dönüyor (rollback çalıştı, site
düşmedi). `curl` aynı gün çalışma imajına eklendi (`backend/Dockerfile`,
openssl satırı). §8.7'deki "HTTP tipi imajsız çalışır" varsayımı bu uygulama
türü için YANLIŞ çıktı.

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

---

# 8 · Rolling update takılması → BÖLÜNMÜŞ SÜRÜM (23 Ağustos 2026)

> ⚠️ **BU BÖLÜM ARTIK TARİHÎ.** Kök sebep aynı gün bulundu ve kapatıldı —
> rolling update bu makinenin bellek bütçesine sığmıyordu. Çözüm **§10**'da.
> Aşağısı teşhis zincirinin kaydı olarak duruyor: aynı belirtiyi bir daha
> görürsen önce §10'a bak.

> ⚠️ Bu, §1–2'deki RAM çöküşünden **farklı bir arıza sınıfı.** Sunucu
> sağlıklıydı: site 0.7 saniyede cevap veriyordu, iki konteyner de
> milisaniyelerde `Ready` oluyordu. Bellekle ilgisi yok.

## 8.1 Belirti

`8f8fb76` (P03) push'unda deployment logu şurada durdu ve 22 dakika hiç
ilerlemedi:

```
11:53:17  Building docker image completed.
11:53:19  Rolling update started.
          (bundan sonrası yok)
```

Dışarıdan bakınca "deploy çok uzun sürüyor" gibi görünüyor. Değil.

## 8.2 Gerçekte olan

Coolify yeni konteyneri başlattı, konteyner sorunsuz ayağa kalktı
(`Ready in 508ms`), **ama Coolify trafiği ona çevirip eskisini durdurmadı.**
İş orada asılı kaldı.

Bu aşamada uygulama Logs sekmesinde **iki konteyner** görünür:

```
qy5pumcarapuqr90z6ljcry8-111637833943   ← eski (11:16, P02)
qy5pumcarapuqr90z6ljcry8-114907800612   ← yeni (11:49, P03)
```

## 8.3 ⚠️ EN ÖNEMLİ KISIM — Cancel yetmiyor

`Cancel` yalnızca **yardımcı** konteyneri siliyor:

```
[CMD]: docker rm -f dx0j33r6cgdhazkbsu2alyrf
Deployment cancelled by user.
```

Uygulama konteyneri **yerinde kalıyor** ve Traefik ikisine birden yük
dağıtmaya devam ediyor. Ölçüldü — aynı adrese üç ardışık istek:

```
istek1: P03 yok   (eski konteyner)
istek2: P03 VAR   (yeni konteyner)
istek3: P03 yok   (eski konteyner)
```

**Bu sadece "tutarsız içerik" değil.** Next.js varlık adresleri build
kimliği taşıyor: A konteynerinden gelen HTML, B'nin
`/_next/static/…` dosyasını isteyip **404 alıyor**. O ziyaretçi sayfayı
CSS'siz ve JS'siz görüyor. Yani bölünmüş durum rastgele bozuk sayfa üretiyor
ve bu, tek bir eski sürüm servis etmekten kötü.

## 8.4 Çözüm

**1. Stop** — bütün konteynerleri kaldırır.

> ⚠️ **"Run Docker Cleanup (remove unused images and builder cache)"
> kutusunun işaretini KALDIR.** Konteyner durduğu anda az önce derlenmiş
> imaj "kullanılmıyor" sayılır ve cleanup onu siler. Builder cache de
> gittiği için sonraki derleme katman önbelleği olmadan sıfırdan koşar:
> bir dakikanın altında bitecek kesinti beş-altı dakikaya çıkar.

**2. Redeploy** — imaj diskte durduğu için derleme adımı atlanır.

Stop'tan sonra ortada eski konteyner kalmadığı için Coolify rolling update
yolunu hiç kullanmaz; takılan adım tamamen devre dışı kalır.

**Ölçülen sonuç (23.08):** tek konteyner, altı ardışık istek aynı sürüm,
CSS + JS chunk + woff2 üçü de 200, dokuz rota 200 / ~0.7s.

## 8.5 Nasıl tespit edilir — panele bakmadan

```bash
for i in 1 2 3; do curl -s https://kuronexus.com/anime/bleach | grep -c "THE THIRTEEN GATES"; done
```

Üç satır aynı değilse bölünmüş sürüm var. (Belirteci o an canlıda olması
gereken en yeni bölümden seç.)

## 8.6 Tekrarlarsa

Bir kez yaşandı ve `Stop → Redeploy` ile kapandı; ayar değiştirilmedi.
İkinci kez olursa `Configuration → Advanced` altındaki rolling update
kapatılacak. 3.7 GB'lık ve tek konteynerli bir kurulumda rolling update'in
kazancı zaten küçük: karşılığında birkaç saniyelik kesinti alınır ama
bellek tepesi yarıya iner ve bu arıza sınıfı kökten kalkar.

## 8.7 Healthcheck notu

Frontend healthcheck'i **kapalı** ve bu arızanın sebebi o değildi
(kontrol edildi). İleride açılırsa:

- **Port `3000` yazılmalı.** Coolify'ın alandaki `80` yalnızca yer
  tutucudur; olduğu gibi bırakılırsa kontrol her seferinde düşer.
- İmaj `node:24-slim` ve içinde **`curl` da `wget` de yok**. Konteyner içi
  komut tipi bir kontrol çalışmaz; HTTP tipi (Coolify'ın kendi tarafından
  attığı) çalışır. Konteyner içi kontrol şart olursa `node` ile yazılmalı:

  ```
  node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
  ```
## 8.8 Deploy TAKILDI ama bölünmüş sürüm YOKTU (23 Ağustos 2026, akşam)

§10'daki "Consistent Container Names" ayarı açıkken de bir push canlıya
çıkmadı. Bu **§8.1'deki arıza değil** — ayırt etmek önemli, çünkü çözümleri
farklı.

**Ölçülen (dışarıdan, panele bakmadan):**

| | |
|---|---|
| Push | 21:19:36, `3d086c7` (P18-a). Yalnızca `frontend/**` + `docs/` → Watch Paths gereği **tek** derleme |
| 17 dakika sonra | site **200 / 0,9s**, API **200 / 0,4s** — yani OOM yok, §1–§2 senaryosu değil |
| §8.5 testi | üç ardışık istek **aynı** (667325 B, yeni belirteç 0) → **bölünmüş sürüm YOK**, tek ve eski sürüm |

**Çözüm:** panelden **Cancel → elle Deploy**. Sonrası temiz ölçüldü: altı
ardışık istek aynı build, CSS + JS chunk + woff2 üçü de 200.

### Ayırt etme kuralı — bu bölümün asıl kazancı

Bir push canlıda görünmüyorsa §8.5'i koştur ve iki sonucu ayır:

- **"Eski sürüm ama TUTARLI"** (bütün istekler aynı) → derleme sürüyor ya da
  takılmış. Yapılacak: bekle, geçmiyorsa **Cancel → Deploy**.
- **"Sürüm sürümden farklı"** (istekler farklı) → §8.1'deki bölünmüş sürüm.
  Yapılacak: **§8.4 — Stop → Redeploy**, cleanup kutusu KAPALI.

### ⚠️ AYNI AKŞAM DÜZELTİLDİ: sebep "yavaş derleme" değildi

Yukarıdaki paragrafta önce "toplam süre derlemeyi de içeriyor, 2 çekirdekte
uzun" yazıyordu. Panel açılınca **kanıt bunu çürüttü**: Deployments
listesinde o turun başarılı kaydı **00m 14s** sürmüştü. Yani 17 dakikanın
tamamı **kuyrukta bekleme**ydi, derleme değil.

Doğru tablo şöyle:

| Durum | Süre |
|---|---|
| Katman önbelleği sıcak deploy | **~14 sn** |
| `docker builder prune` sonrası sıfırdan derleme | **~4 dk** |
| Kuyruk tıkalı (Redis yazamıyor) | **sınırsız** — hiç başlamaz |

Ders: bir push canlıda görünmüyorsa **süreye bakma, kuyruğa bak.** §8.5'i
koştur; "eski ama tutarlı" çıkıyorsa sorun derlemenin yavaşlığı değil,
işin hiç başlamamış olmasıdır.

---



---

# 9 · Disk dolması → Coolify Redis MISCONF (23 Ağustos 2026)

## 9.1 Belirti

Coolify **paneli** 500 veriyor:

```
MISCONF Redis is configured to save RDB snapshots, but it's currently unable
to persist to disk. Commands that may modify the data set are disabled…
```

⚠️ **Site bundan etkilenmiyor.** Panel Coolify'ın kendi Redis'ine bağlı;
Traefik ve uygulama konteynerleri ayrı. Ölçüldü: panel ölüyken site 200 /
0.65s veriyordu ve API `db:up` dönüyordu. Yani panik gerekmiyor — ama
deploy da yapılamıyor, çünkü Coolify'ın iş kuyruğu o Redis'te.

## 9.2 Sebep

Neredeyse her zaman tek şey: **kök disk dolmuş.** Redis'in
`stop-writes-on-bgsave-error` ayarı, RDB yazması başarısız olunca bütün
yazma komutlarını reddediyor.

Ölçülen: `/dev/sda1` 38G, **36G kullanılmış, 0 bayt boş.**

⚠️ 0 bayt boş bir kökte PostgreSQL de yazamaz. Site o an ayaktaydı ama bu
hâlde bırakılırsa veritabanı yazma hatası vermeye başlar.

## 9.3 Teşhis ve çözüm

```bash
df -h /
```

`Use%` %95 üstüyse teşhis kesin. Sonra sırayla:

```bash
docker builder prune -af
```

Yalnızca **derleme önbelleğini** siler. Kullanılan imajlara, çalışan ya da
durmuş konteynerlere, hacimlere dokunmaz. **Ölçülen kazanç: 5.86 GB.**

```bash
docker image prune -af
```

Hiçbir konteynerin referans vermediği imajları siler (durmuş konteynerlerin
imajları da korunur). Bedeli: Coolify'ın rollback için sakladığı eski
imajlar gider. **Ölçülen kazanç: 623 MB.**

Toplam ~6.5 GB → disk %80'e ve 7.4 GB boşa döndü. Panel yenilenince
kendiliğinden açıldı; açılmazsa `docker restart coolify-redis` (o Redis
kuyruk ve önbellek, kalıcı veri değil).

## 9.4 ⚠️ ASLA

**`docker system prune` komutuna `--volumes` bayrağı EKLENMEYECEK.**
O bayrak PostgreSQL veri hacmini siler — sitenin bütün içeriği orada.
Temizlik `builder prune` + `image prune` ile yapılır; ikisi de hacimlere
dokunmaz.

## 9.5 Neden dolmuştu

Zamanlanmış Docker temizliği koşmuyordu ve 35 deployment'lık imaj +
derleme önbelleği birikmişti. Katkı eden ikinci şey: §8'deki takılmayı
çözerken Stop diyaloğundaki "Run Docker Cleanup" kutusu **bilerek**
kaldırılmıştı (imajı koruyup redeploy'u hızlandırmak için) — o an doğru
karardı ama temizliğin hiç koşmadığı anlamına da geliyordu.

**Kalıcı çözüm:** Coolify'da zamanlanmış Docker temizliğini aç. Elle
temizlik bir arıza müdahalesi olmalı, rutin değil.

**✅ 1 Eylül 2026: iki kalıcı önlem de alındı.** Disk o gün ÜÇÜNCÜ kez
doldu (%100 — Postgres `pg_logical` checkpoint'ini yazamayıp PANIC
döngüsüne girdi; disk açılınca kendiliğinden toparladı). Ardından:
1) Coolify zamanlanmış Docker temizliği panelden AÇILDI.
2) journald'a kalıcı tavan kondu — sınırsızken 1,5 GB'a şişmişti:
   `/etc/systemd/journald.conf.d/kuronexus-limit.conf` →
   `[Journal] SystemMaxUse=200M` (drop-in bilinçli: ana conf'u sistem
   güncellemesi ezebilir). Doğrulama: `journalctl --disk-usage` = 192,0M.
Geri alma: drop-in dosyayı sil + `systemctl restart systemd-journald`.
## 9.6 Tam kurtarma zinciri — 23 Ağustos 2026 akşamı (ölçüldü)

Bu arıza tek bir komutla bitmedi; sıra önemliydi. Yaşanan tam dizi:

| # | Belirti / işlem | Ölçüm |
|---|---|---|
| 1 | Push canlıya çıkmıyor | site 200/0,9s, API 200, §8.5 **tutarlı** → bölünmüş sürüm YOK, iş hiç başlamamış |
| 2 | Coolify paneli 500 | `MISCONF Redis … unable to persist to disk` → §9.1 |
| 3 | `docker image prune -af` | 622,6 MB |
| 4 | `df -h /` | 7,4G boş / %80 — **ama saniyeler sonra 1019M / %98** |
| 5 | `docker ps` | **derleme konteyneri YOK** → "In Progress" kaydı zombi |
| 6 | Panelden **Cancel** | takılı kayıt kapandı, kuyruk açıldı |
| 7 | `docker builder prune -af` | **6,297 GB** → 6,2G boş / %83 |
| 8 | Redeploy #1 | **Failed**, 3m 47s, `Linting and checking validity of types` satırında |
| 9 | Redeploy #2 | **başarılı** — aynı commit, değişiklik yok |

### 9.6.1 Derleme düşerse: disk mi bellek mi

8. adımdaki hata iki sebepten gelebilir ve ikisinin çözümü farklı.
**Ayırt etmenin yolu, derleme SÜRERKEN diske bakmak:**

\`\`\`bash
df -h /
\`\`\`

O tur ölçüldü: derleme boyunca 6,2G → 5,1G, yani yalnızca ~1,1 GB yendi ve
%86'da durdu. **Disk elendi, geriye bellek kaldı** — `next build`in tip
kontrolü adımı 3,7 GB'lık makinenin tepe noktası.

⚠️ Ama ikinci deneme **hiçbir şey değiştirmeden** geçti. Yani bu OOM
kalıcı bir sınır değil, makine hâlâ toparlanırken (Redis yeni açılmış,
prune yeni bitmiş) oluşan geçici bir tepe. **Önce bir kez daha dene.**

Tekrar tekrar aynı satırda düşerse kalıcı çözüm hazır: `next.config.ts`
zaten `NEXT_OUTPUT_STANDALONE === "1"` ile "yalnızca Docker derlemesinde"
deseni kullanıyor (`output: standalone`). Aynı bayrağa bağlanacak iki satır
tip kontrolünü sunucuda kapatır:

\`\`\`
typescript: { ignoreBuildErrors: isDockerBuild },
eslint:     { ignoreDuringBuilds: isDockerBuild },
\`\`\`

Güvenlik kaybı sanıldığı kadar değil: aynı kontrolü yerel `next build`
tam olarak yapıyor ve push öncesi `npx tsc --noEmit` + `npx eslint` zaten
koşuluyor. 3,7 GB'lık sunucuda ikinci kez yapmanın tek getirisi deploy'u
düşürmek. **Yine de ölçmeden uygulama** — bu turda gerekmedi.

---



---

# 10 · KÖK SEBEP: rolling update bu makineye sığmıyor — ÇÖZÜLDÜ

## 10.1 Kanıt

Rolling update **iki kez** aynı satırda takıldı: `Rolling update started`,
sonrası yok.

| | disk | sonuç |
|---|---|---|
| 1. deneme (11:53) | doluydu | takıldı |
| 2. deneme (12:46) | **7.4 GB boştu** | **yine takıldı** |

İkinci ölçüm disk teorisini çürüttü. Geriye tek açıklama kaldı ve
belirtilerle birebir örtüşüyor.

## 10.2 Mekanizma

Rolling update **eski ve yeni konteyneri aynı anda** çalıştırmayı
gerektiriyor. Bu makinede (§1) 3.7 GB RAM var; ölçüm anında 3220 MB
kullanımda, 599 MB boş ve **2.3 GB swap dolu**. İki Next sunucusunu birden
ayakta tutmak bu bütçeye sığmıyor: yeni konteyner açılıyor (`Ready in
508ms`) ama sistem yerine oturamıyor ve Coolify geçişi tamamlayamıyor.

Konteyner logları da bunu doğruladı — bellek baskısı belirtileri:

```
Failed to write image to cache … could not be tracked by lru cache
Error: Internal server error  at .next/server/app/sitemap.xml/route.js
```

⚠️ Bunlar **kod hatası değil**. Canlıdaki `/sitemap.xml` 200 dönüyor ve
674 KB geçerli XML üretiyor; 674 KB'lık bir sitemap üretilirken bellek
sıkışırsa arada bir düşüyor.

## 10.3 Çözüm — "Consistent Container Names"

`Configuration → Advanced → Container → **Consistent Container Names**` → **AÇIK**

Ayrı bir "rolling update" anahtarı **yok**; bu onun kapısı. Kanıt konteyner
adlarında duruyor:

```
qy5pumcarapuqr90z6ljcry8-121944168696   ← zaman damgalı: her deploy benzersiz ad
qy5pumcarapuqr90z6ljcry8                ← sabit ad
```

Ad benzersiz olduğu sürece eski ve yeni konteyner **birlikte var olabiliyor**
— rolling update tam olarak buna dayanıyor. Ad sabitlenince Docker aynı adla
iki konteyner çalıştıramıyor, dolayısıyla Coolify mecburen eskisini durdurup
yenisini başlatıyor. Coolify bunu logda açıkça yazıyor:

```
Consistent container name feature enabled, rolling update is not supported.
Removing old containers.
New container started.
Deployment is Finished
```

## 10.4 ⚠️ AYARI AÇTIKTAN SONRA: eski konteynerler kalıyor

Ayar geçmişe dönük çalışmıyor. "Removing old containers" yalnızca kendi
beklediği ada uyanları kaldırıyor; başarısız rolling update'lerden kalan
**zaman damgalı yetimler ayakta kalıyor** ve Traefik onlara yönlenmeye devam
ediyor. Sonuç: deploy `Finished` diyor ama site eski sürümü servis ediyor.

Ölçülen: deploy bittikten sonra Logs sekmesinde **üç** konteyner vardı ve
canlıdaki CSS parmak izi hiç değişmemişti.

**Temizlik — cerrahi, kesintisiz:**

```bash
docker rm -f <eski-ad-1> <eski-ad-2>
```

Yalnızca yetimleri kaldırır, yeni sabit adlı konteynere dokunmaz. Traefik
birkaç saniye içinde tek kalana yönelir. Adlar Logs sekmesinde yazılı.

(Alternatif: panelden Stop → Redeploy. Aynı sonuç, bir dakikaya kadar
kesinti ve fazladan bir tur.)

## 10.5 Sonuç

**Ölçülen (23.08, P04 deploy'u):**

| | |
|---|---|
| Deploy süresi | **14 saniye** (imaj SHA ile bulundu, derleme atlandı) |
| Konteyner | **tek**, sabit adlı |
| Sürüm tutarlılığı | 6 ardışık istek, hepsi aynı |
| Varlıklar | CSS + JS chunk + woff2 → 200 |
| Rotalar | 8 rota 200 / 0.68–1.17s |
| API | `db:up` |

**Bedel:** sıfır kesintili deploy yok — eski durur, yeni başlar. Bu
makinede sıfır kesinti zaten hiç çalışmıyordu.

**Yan fayda:** §8'deki "Cancel yetim konteyner bırakıyor → site iki sürümü
birden servis ediyor" arıza sınıfı **kökten yok oldu** — ikinci bir
konteyner artık hiç var olmuyor. Ayrıca konteyner adı sabit olduğu için log
okurken hangi konteynere baktığını aramak gerekmiyor.
