# KuroNexus — Müzik Bölümü Tasarım Planı
### Kadim Dünyalar → Ses/Müzik Arşivi Dönüşümü

*Bu doküman, Claude ile yapılan mimari tartışmalarının özetidir ve Claude Code'a devredilecek uygulama planını içerir.*

---

## 1. Karar Özeti

- **Kaldırılan:** Kadim Dünyalar bölümü (çok-kitaplı evren galerisi — Dune, Wheel of Time vb.)
- **Sebep:** Bu işlevi zaten kitap serisi sayfaları kendi içinde karşılıyor (bir seriye tıklandığında karakterler/mekanlar o sayfada sergileniyor). Ayrı bir "evren kapısı" gereksiz tekrar yaratıyor.
- **Yerine gelen:** Spotify entegrasyonlu, kişisel arşiv karakterli bir **Müzik/Ses Arşivi** bölümü.
- **"World/Universe" kavramının akıbeti:** Silinmiyor — bağımsız bir kapı olmaktan çıkarılıp, ileride herhangi bir eserin (kitap/film/anime) içine gömülü ilişkisel bir üst yapıya dönüştürülecek. Bu, bu fazın kapsamı dışında, ayrı bir gelecek fazı (bkz. Bölüm 9).

## 2. Tasarım Felsefesi

> Spotify bir veri kaynağıdır, KuroNexus'un kimliği değildir.

- **Spotify katmanı:** sanatçı/albüm/parça metadata'sı, görsel, popülerlik, dış link — "gerçek dünya verisi"
- **KuroNexus katmanı:** puan, kişisel not, anı, favori parça, kişisel kronoloji — "senin arşivin"
- Amaç bir Spotify klonu değil, kültürel hafızayı tutan bir sistem inşa etmek.

## 3. Sayfa Konseptleri

- **Artist/Act sayfası** — üst bilgi (tür, kuruluş yılı, köken), "Spotify'da Aç" butonu, albüm listesi, altında **My Archive** bloğu (kişisel puan, favori dönem, en önemli albüm, en çok dinlenen/favori parça)
- **Person sayfası** (örn. Chester Bennington) — bağlı olduğu Act'ler, "Featured In" parça listesi, ilişki ağı
- **Album Room** — parça listesi + kişisel notlar + "Spotify'da Dinle" embed
- **Genre sayfası** — o türe/alt türe bağlı tüm sanatçılar
- **Music Archive ana sayfası** — toplam istatistik (X sanatçı, Y albüm, Z parça), "Currently Listening", favori sanatçılar listesi
- **Era/Timeline görselleştirmesi** — bir Act'in dönemlerini kronolojik şerit olarak gösterme
- **Related/Family Tree** — Nexus Graph'in müzik-içi görsel karşılığı (Chester → Linkin Park → Meteora → Numb gibi zincirler)

## 4. Veri Modeli — Nihai Entity Listesi

```
Person
  - gerçek kişi (örn. Chester Bennington, Hans Zimmer)

MusicalAct
  - grup/solo proje/orkestra (örn. Linkin Park, Dead by Sunrise)
  - actKind: Band | SoloProject | Duo | Group | Orchestra
    (ontolojik tür — MusicalAct'ın "ne" olduğu; tekil, sabit alan)

Role  (kontrollü sözlük, serbest text DEĞİL)
  - örn: Vocalist, Guitarist, Composer, Producer, Songwriter, DJ, Conductor...
  - Membership.role ve TrackCredit.role bu sözlükten referans alır
  - bir Person/MusicalAct birden fazla Role taşıyabilir (many-to-many)
  - ActKind ile KARIŞTIRILMAZ: ActKind = "act ne tür bir oluşum", Role = "kim hangi
    profesyonel işlevi üstleniyor" (örn. Hans Zimmer → Composer + Producer;
    Chester Bennington → Vocalist + Songwriter)

Membership
  - Person ↔ MusicalAct, role (Role tablosundan referans), tarih aralığı

Album
  - MusicalAct'e bağlı, eraId (opsiyonel, açık FK — otomatik tarih eşlemesi yerine)

Track
  - Album'e bağlı

TrackCredit
  - Track ↔ (Person veya MusicalAct), role (Role tablosundan referans:
    primary | featured | producer | composer | ...)

Genre
  - self-referencing (parentId) → Genre/Subgenre hiyerarşisi
  - many-to-many: MusicalAct ↔ Genre

ArtistEra
  - MusicalAct'e bağlı, tarih aralığı, açıklama (bandın kendi tarihi — nesnel)

PersonalChronology
  - kullanıcıya özel dönemler ("2000-2007 dönemim") — ArtistEra'dan TAMAMEN AYRI

ExternalRef
  - entityType, entityId, provider (spotify | musicbrainz | discogs | wikidata | lastfm),
    externalId, url, lastSyncedAt
  - Spotify şemayı belirlemesin diye: her entity kendi tablosunda yaşar,
    Spotify sadece bu tablo üzerinden bağlanan bir kaynak olur

NexusEdge  (bu fazda YALNIZCA müzik-içi kullanım)
  - sourceType, sourceId, targetType, targetId, relationType, note
  - gerçek ilişkilerin (Membership, TrackCredit, Album-Era) YERİNE GEÇMEZ,
    sadece keşif/anlatı katmanıdır

NexusRelationType (kontrollü enum, serbest text değil)
  - başlangıç seti: MEMBER_OF, RELATED_TO, COLLABORATED_WITH, FEATURED_IN,
    COMPOSED_FOR, PRODUCED, BASED_ON, ADAPTED_FROM, APPEARS_IN, CREATED_BY,
    PART_OF, INSPIRED_BY

Kullanıcı Katmanı
  - Rating, Notes, Memories, FavoriteTracks, FavoriteAlbums
  - Notes/Memories alanları TR ve EN olmak üzere iki dilde de yazılacak
    (locale-keyed alan/tablo — site genelindeki TR/EN ikili yapıyla tutarlı)
```

## 5. Kapsam Kararı

**Bu fazda var:**
- Yukarıdaki tüm Music domain tabloları
- NexusEdge — ama sadece Music içi bağlantılar için (Chester→Linkin Park→Meteora→Numb gibi)

**Bu fazda YOK, ayrı bir faz/migration olarak ertelendi:**
- Film/Series/Anime/Book/Sport'u da kapsayan tam KuroNexus Nexus Layer
- Character (kurgusal) ↔ Person (gerçek/oyuncu) ayrımı (örn. Paul Atreides ↔ Chalamet)
- Sebep: mevcut çalışan Film/Book/Anime sistemini bozma riskini izole etmek, tek geliştiricili bir projede kapsamı yönetilebilir tutmak

## 6. Spotify API — Güncel Teknik Gerçekler

- ✅ **Client Credentials flow** (kullanıcı girişi gerektirmez) ile Search, Get Artist, Get Artist's Albums, Get Artist's Top Tracks, Get Album, Get Album Tracks, Get Track — hepsi çalışır durumda. Katalog verisi için yeterli.
- ⚠️ **Related Artists endpoint'i Kasım 2024'ten beri yeni uygulamalara kapalı.** Spotify'dan otomatik "ilişkili sanatçı" verisi çekilemiyor. Bu planla çelişmiyor — bu ilişki zaten NexusEdge üzerinden kendi küratörlüğüyle kurulacaktı (RELATED_TO).
- ⚠️ **Recommendations, Audio Features, Audio Analysis** de yeni uygulamalara kapalı — BPM/key/mood gibi verilere zaten ihtiyaç yoktu, kayıp sayılmaz.
- ⚠️ **Get Artist'in genre alanı** toplulukta tutarsız/eksik olarak raporlanıyor. Genre taksonomisinin Spotify etiketlerine değil kendi küratörlüğe dayanması (zaten plandaki gibi) bu riski by-design ortadan kaldırıyor.
- ✅ **Embed player (open.spotify.com/embed) Web API'den ayrı bir mekanizma** — bu deprecation'ların hiçbirinden etkilenmiyor. "Spotify'da Dinle" / gömülü player OAuth gerekmeden sorunsuz çalışır.
- **"Currently Listening" widget'ı** kendi hesapla Authorization Code flow + refresh token gerektirir (Development Mode'da sorun değil, uygulamaya sadece kendi hesap yetkili kullanıcı olarak eklenir).
- **Öneri:** MusicBrainz, `ExternalRef`'e ikincil/tamamlayıcı kaynak olarak eklenebilir — özellikle Person↔MusicalAct (band member) ilişkileri için tamamen açık ve ücretsiz, Related Artists'in Spotify'da kapanmış olmasının boşluğunu kısmen doldurur.

*(Kaynak: Spotify for Developers resmi duyurusu — Kasım 2024; geliştirici topluluğu raporları, 2025-2026)*

## 7. Senkronizasyon ve Cache Mimarisi (KARARLAŞTIRILDI)

**Metadata senkronizasyonu:**
- Sayfalar canlı Spotify fetch ile DEĞİL, KuroNexus DB'sindeki senkronize kopyadan servis edilir.
- Periyodik arka plan senkronizasyonu için mevcut projedeki (ultnexus) Redis/Bull pattern'i kullanılır.
- Manuel refresh/sync tetikleme imkânı olmalı (admin panelinden veya CLI komutuyla tek bir Artist/Album için zorunlu yeniden senkronizasyon).
- **KRİTİK KURAL:** Sync işlemi hiçbir koşulda kişisel veriye (Rating, Notes, Memories, FavoriteTracks/Albums, PersonalChronology) dokunmaz veya üzerine yazmaz. Yalnızca external/metadata alanlarını (isim, görsel, popülerlik, albüm/parça listesi vb.) günceller. Bu, veri modelinde Spotify-kaynaklı alanlarla kullanıcı katmanının fiziksel olarak ayrı tablolarda tutulmasıyla (Bölüm 4'teki ExternalRef ayrımı) zaten garanti altına alınıyor.

**Album artwork:**
- Spotify CDN'ine sürekli hotlink YAPILMAZ.
- İlk senkronizasyonda artwork indirilip KuroNexus'un kendi storage/uploads/CDN katmanında cache'lenir; uygulama kendi asset URL'ini kullanır.
- Spotify'ın orijinal artwork URL'i external metadata olarak (ExternalRef veya ilgili alanda) saklanır.
- İndirme başarısız olursa kontrollü bir fallback kullanılır (örn. placeholder görsel + retry kuyruğuna ekleme).

## 8. SEO / Migration Kontrol Listesi

- [ ] Kadim Dünyalar'ın mevcut URL'lerine 301 redirect (yeni Music bölümüne veya ilgili kitap serisi sayfasına)
- [ ] Site içi navigasyon/menüdeki Kadim Dünyalar linklerini güncelle
- [ ] Sitemap.xml güncelle
- [ ] Kadim Dünyalar'a işaret eden internal linkleri tara ve düzelt

## 9. Uygulama Fazları

1. **Faz 1 — Çekirdek Katalog:** Person, MusicalAct (actKind), Role, Membership, Album, Track, TrackCredit + Spotify sync altyapısı (Client Credentials + Redis/Bull background job + DB-first serving, Bölüm 7). Salt okunur, kişisel katman yok.
2. **Faz 2 — Kişisel Katman:** Rating, Notes, Memories, FavoriteTracks/Albums. "My Archive" bloğu Artist sayfasında görünür hale gelir.
3. **Faz 3 — Genre & Era:** Genre/Subgenre hiyerarşisi, ArtistEra, Album-Era ilişkisi, timeline UI.
4. **Faz 4 — Nexus (müzik-içi):** NexusEdge + NexusRelationType, Related/Family Tree görselleştirmesi.
5. **Faz 5 — Music Archive Ana Sayfası:** istatistik paneli, Currently Listening (Authorization Code flow).
6. **Faz 6 — (Ayrı proje, ileride):** Tüm KuroNexus'u kapsayan Nexus Layer + Character/Person ayrımı.

## 10. Claude Code İnceleme Komutu (nihai hali)

Kodlamaya başlamadan önce Claude Code'a mimariyi gözden geçirtmek için:

> Bu müzik arşivi mimarisini henüz kodlamaya başlama. Önce KuroNexus'un mevcut mimarisiyle uyumlu olacak şekilde Music bölümünün nihai bilgi mimarisini çıkar. Person, MusicalAct (actKind: Band/SoloProject/Duo/Group/Orchestra), Role (kontrollü sözlük — Composer/Producer/Vocalist/Songwriter/DJ/Conductor vb., Membership ve TrackCredit bu sözlükten referans alır), Membership, Album, Track, TrackCredit, Genre/Subgenre hiyerarşisi, ArtistEra, ExternalRef (Spotify + gelecekte MusicBrainz/Discogs), ve KuroNexus'a özel Rating/Notes/Memories/FavoriteTracks/PersonalChronology katmanlarını değerlendir. ActKind ile Role'ü kesinlikle ayrı tut — biri act'in ontolojik türü, diğeri kişi/act'in üstlendiği profesyonel işlevdir. NexusEdge ve NexusRelationType'ı ekle ama bu fazda yalnızca Music içi ilişkiler için kullan — Film/Book/Anime'yi kapsayan tam Nexus Layer bu fazın kapsamı dışında, sonraki bir migration'a bırakılacak. Person ile MusicalAct'i kesinlikle ayrı tut. ArtistEra ile PersonalChronology'yi kesinlikle birbirinden ayır. Spotify verisi hiçbir sayfada canlı fetch ile çekilmesin; KuroNexus DB'sindeki senkronize kopyadan servis edilsin, senkronizasyon Redis/Bull ile periyodik arka plan job'ı olarak çalışsın ve manuel tetiklenebilsin; bu sync işlemi kişisel katmana (Rating/Notes/Memories/Favorites/PersonalChronology) asla dokunmasın. Album artwork Spotify CDN'ine hotlink edilmesin; ilk sync'te indirilip KuroNexus'un kendi storage/CDN katmanında cache'lensin, orijinal Spotify URL'i ayrıca metadata olarak saklansın, indirme hatasında kontrollü fallback kullanılsın. Kullanıcı katmanındaki Notes/Memories alanları TR ve EN olmak üzere iki dilde de tutulabilecek şekilde (locale-keyed) modellensin. Spotify'ın veri modeli KuroNexus'un veri modelini belirlemesin. Önce mevcut önerideki eksik veya gereksiz noktaları belirt. Ardından nihai entity/relationship listesini çıkar. Son olarak, mevcut Film/Series/Anime/Book sistemlerini bozmadan ve mevcut güvenlik/SEO mimarisine uyacak şekilde Music bölümünü ekleme komutunu hazırla. Kadim Dünyalar bölümünün kaldırılmasından doğacak URL/redirect/SEO etkilerini migration planına dahil et.

## 11. Ek Kararlar (KARARLAŞTIRILDI)

- **i18n:** "My Archive" kişisel notları (Notes/Memories) TR ve EN ikisinde de yazılacak — sitenin genel iki dilli yapısıyla tutarlı. Bkz. Bölüm 4, Kullanıcı Katmanı.

Tüm açık kararlar netleşti; bu doküman artık Claude Code'a devredilmeye hazır.
