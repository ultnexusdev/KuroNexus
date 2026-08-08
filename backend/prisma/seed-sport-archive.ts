/**
 * Salon 06 · Spor Arşivi — Faz 1 tohum verisi.
 *
 * ⚠️ METİNLER TASLAKTIR. Anlaşma şuydu: şablonun "tam derinlikte" çalıştığını
 * görebilmek için ilk metinleri ben yazıyorum, küratör üstünden geçip kendi
 * sesine çeviriyor. Özellikle `personalNoteTr` alanları — onlar tanım gereği
 * benim yazamayacağım şeyler, yer tutuyorlar.
 *
 * Çalıştırma (yerel):
 *   DATABASE_URL=$(cat /k/postgres/LOCAL_DB_URL.txt) \
 *     npx ts-node --transpile-only prisma/seed-sport-archive.ts
 *
 * Yeniden çalıştırılabilir: her kayıt slug üzerinden `upsert` ediliyor, ikinci
 * çalıştırma kopya üretmiyor. Dönem/an/viraj gibi çocuk kayıtlar sahibine göre
 * temizlenip yeniden yazılıyor — elle düzeltilen metin KAYBOLUR, o yüzden
 * düzeltmeler bu dosyada yapılmalı (ya da panel açıldıktan sonra panelde).
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './_client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  // ── Kulüp ────────────────────────────────────────────────────────────────
  const gs = await prisma.footballClub.upsert({
    where: { slug: 'galatasaray' },
    update: {},
    create: {
      slug: 'galatasaray',
      name: 'Galatasaray',
      officialName: 'Galatasaray Spor Kulübü',
      shortName: 'GS',
      nicknameTr: 'Cimbom · Aslan',
      nicknameEn: 'Cimbom · The Lion',
      foundedYear: 1905,
      countryCode: 'TR',
      cityName: 'İstanbul',
      stadiumName: 'RAMS Park',
      stadiumCapacity: 53798,
      taglineTr: 'Bir kulübün değil, bir ömrün arşivi.',
      taglineEn: 'The archive of a lifetime, not of a club.',
      narrativeTr:
        'Bu sayfa bir kulüp künyesi değil. Kupa sayısı, puan durumu, güncel kadro — hepsi başka yerlerde ve daha iyi tutuluyor. Burada duran şey, bir kulübün neden hatırlandığı: hangi yıllarda ne olduğu, o yılların bana ne anlattığı, ve aradan geçen zamanın hangi anları ayakta bıraktığı.',
      isFeatured: true,
      isPublished: true,
      orderIndex: 0,
    },
  });

  // Çocuk kayıtları temizle (yeniden çalıştırılabilirlik)
  await prisma.footballEra.deleteMany({ where: { clubId: gs.id } });

  // ── Dönemler ─────────────────────────────────────────────────────────────
  const kurulus = await prisma.footballEra.create({
    data: {
      clubId: gs.id,
      slug: 'kurulus-ve-okul',
      startYear: 1905,
      endYear: 1959,
      titleTr: 'Kuruluş ve okul',
      titleEn: 'The founding and the school',
      subtitleTr: 'Bir kulüpten önce bir fikir vardı.',
      narrativeTr:
        'Galatasaray bir stadyumda değil, bir sınıfta doğdu. Kurucularının niyeti bir spor kulübü kurmaktan çok, bir arada oynayıp bir arada kazanmanın mümkün olduğunu göstermekti — o dönemin İstanbul’unda bu, göründüğünden büyük bir iddiaydı. Rengin, armanın ve adın hepsi o ilk yılların içinde yerleşti; sonradan eklenen hiçbir şey onları değiştiremedi.',
      contextTr:
        'Bu yıllar Türkiye’de örgütlü sporun henüz kurulmakta olduğu yıllar. Lig yok, profesyonellik yok, arşiv neredeyse yok. Elimizde kalan şey büyük ölçüde fotoğraflar ve sonradan anlatılanlar — bu sayfanın da en çok anlatıya dayandığı dönem burası.',
      personalNoteTr:
        '[TASLAK — küratör notu buraya] Bu dönemi ben yaşamadım; bildiklerim aktarılmış bilgi. Yine de arşivin başlangıcı burası olmalı, çünkü sonraki her şey buraya yaslanıyor.',
      isPublished: true,
      orderIndex: 0,
    },
  });

  const aliSamiYen = await prisma.footballEra.create({
    data: {
      clubId: gs.id,
      slug: 'ali-sami-yen-yillari',
      startYear: 1964,
      endYear: 1992,
      titleTr: 'Ali Sami Yen yılları',
      titleEn: 'The Ali Sami Yen years',
      subtitleTr: 'Bir stadyumun kendi karakteri olabilir.',
      narrativeTr:
        'Ali Sami Yen küçük bir stattı ve tam da bu yüzden büyük bir yerdi. Ses, sahaya dört bir yandan aynı anda iniyordu; oyuncular sonradan hep aynı şeyi anlattı — topu değil, gürültüyü hatırlıyorlardı. Bu dönemde kazanılanlar Avrupa ölçeğinde büyük değildi, ama kulübün kendini nasıl gördüğü burada şekillendi.',
      contextTr:
        'Türkiye ligi bu yıllarda profesyonelleşti, maçlar televizyona girdi ve taraftarlık bir kimlik hâline geldi. Stadyumun “cehennem” lakabı da bu dönemin ürünü — bir pazarlama sözü değil, tanıklıkların ortak tarifi.',
      personalNoteTr:
        '[TASLAK — küratör notu buraya] Buranın benim için anlamı, ilk kez bir maçı baştan sona izlediğim yer olması.',
      isPublished: true,
      orderIndex: 1,
    },
  });

  const avrupa = await prisma.footballEra.create({
    data: {
      clubId: gs.id,
      slug: 'avrupaya-acilan-kapi',
      startYear: 1993,
      endYear: 2002,
      titleTr: "Avrupa'ya açılan kapı",
      titleEn: 'The gateway to Europe',
      subtitleTr: 'Kendi ligini kazanmakla yetinmeyen bir kuşak.',
      narrativeTr:
        'Bu dönem, kulübün kendi sınırlarını yeniden çizdiği dönemdir. Önce Avrupa’da yenilmemenin mümkün olduğu görüldü, sonra kazanmanın da mümkün olduğu. Aradaki fark bir kadro farkı değil, bir inanç farkıydı: sahaya çıkarken rakibin adına bakmayı bırakan ilk kuşak buydu.',
      contextTr:
        'Aynı yıllarda Avrupa kupaları formatını değiştirdi, yayın gelirleri büyüdü ve büyük ligler arasındaki mesafe hızla açıldı. Bu, kazanılanın ölçeğini daha da anlamlı kılıyor: kapanmakta olan bir kapıdan geçildi.',
      personalNoteTr:
        '[TASLAK — küratör notu buraya] Bu dönemin sonu, futbolu izleme biçimimin değiştiği yer.',
      isPublished: true,
      orderIndex: 2,
    },
  });

  // ── Efsane ───────────────────────────────────────────────────────────────
  const hagi = await prisma.footballLegend.upsert({
    where: { slug: 'hagi' },
    update: {},
    create: {
      slug: 'hagi',
      name: 'Hagi',
      fullName: 'Gheorghe Hagi',
      epithetTr: 'Karpatların Maradonası',
      epithetEn: 'The Maradona of the Carpathians',
      role: 'PLAYER',
      countryCode: 'RO',
      birthYear: 1965,
      yearsFrom: 1996,
      yearsTo: 2001,
      shirtNumber: 10,
      clubId: gs.id,
      narrativeTr:
        'Hagi’yi anlatmanın kolay yolu istatistik vermek olurdu; zor ve doğru yolu ise şu: onu izlemeye başladıktan sonra sahada başka bir şeye bakar oldum. Topun nereye gideceğini değil, oyuncunun nereye BAKTIĞINI izlemeyi ondan öğrendim. Pas verdiği anı çoğu zaman göremezsiniz, çünkü karar pastan önce verilmiştir — o kararın verildiği anı görmek, futbolu bir kez daha seyretmek demek.',
      contextTr:
        'Türkiye’ye geldiğinde otuz bir yaşındaydı ve kariyerinin bittiği düşünülüyordu. Barcelona ve Real Madrid’den sonra bir Türk kulübüne gitmek, o yılların basınında bir “emeklilik” hamlesi olarak okundu. Sonraki beş yıl bu okumayı topluca yanlış çıkardı.',
      achievementsTr: [
        'UEFA Kupası — 2000',
        'UEFA Süper Kupası — 2000',
        'Süper Lig — 1997, 1998, 1999, 2000',
        'Türkiye Kupası — 1999, 2000',
      ].join('\n'),
      personalNoteTr:
        '[TASLAK — küratör notu buraya] Onu neden bu arşivin ilk efsanesi yaptığımı bir cümleyle yazmak istiyorum ama henüz doğru cümleyi bulamadım.',
      personalRank: 1,
      isFavorite: true,
      isPublished: true,
      orderIndex: 0,
    },
  });

  await prisma.footballEraFigure.create({
    data: {
      eraId: avrupa.id,
      legendId: hagi.id,
      roleTr: 'dönemin numara onu',
      roleEn: 'the number ten of the era',
      noteTr:
        'Geldiği yıl takımın oyun fikri değişti: top artık en hızlı yoldan değil, en doğru yoldan gidiyordu. Bu dönemin kazanılanları büyük ölçüde o farkın ürünü.',
      orderIndex: 0,
    },
  });

  // ── Anlar ────────────────────────────────────────────────────────────────
  await prisma.footballMoment.createMany({
    data: [
      {
        eraId: kurulus.id,
        kind: 'MILESTONE',
        year: 1905,
        titleTr: 'Kuruluş',
        titleEn: 'The founding',
        narrativeTr:
          'Bir okul sınıfında alınan karar. Arşivin başladığı yer burası — öncesi için elimizde kayıt değil, anlatı var.',
        isHighlight: true,
        isPublished: true,
        orderIndex: 0,
      },
      {
        eraId: aliSamiYen.id,
        kind: 'MILESTONE',
        year: 1964,
        titleTr: 'Ali Sami Yen açılıyor',
        narrativeTr:
          'Kulübün kendi evine taşınması. Sonraki otuz yılın bütün hikâyeleri bu zeminde geçiyor.',
        isHighlight: true,
        isPublished: true,
        orderIndex: 0,
      },
      {
        eraId: avrupa.id,
        kind: 'ARRIVAL',
        year: 1996,
        titleTr: "Hagi'nin gelişi",
        narrativeTr:
          'Transferin kendisi bir haberdi; asıl olay sonraki beş yılda yaşandı.',
        legendId: hagi.id,
        isHighlight: true,
        isPublished: true,
        orderIndex: 0,
      },
      {
        eraId: avrupa.id,
        kind: 'TROPHY',
        year: 2000,
        titleTr: 'Kopenhag gecesi',
        titleEn: 'The night in Copenhagen',
        narrativeTr:
          'Doksan dakika boyunca kazanan taraf belli olmadı, uzatmalarda da olmadı. Kupanın penaltılarla gelmesi, o geceyi bir skor olmaktan çıkarıp bir dayanma hikâyesine çevirdi.',
        legendId: hagi.id,
        isHighlight: true,
        isPublished: true,
        orderIndex: 1,
      },
    ],
  });

  // ── Formula 1 · Monza ────────────────────────────────────────────────────
  const monza = await prisma.f1Circuit.upsert({
    where: { slug: 'monza' },
    update: {},
    create: {
      slug: 'monza',
      name: 'Monza',
      officialName: 'Autodromo Nazionale di Monza',
      nicknameTr: 'Hız Tapınağı',
      nicknameEn: 'The Temple of Speed',
      countryCode: 'IT',
      cityName: 'Monza',
      firstGrandPrixYear: 1950,
      isActive: true,
      lengthMeters: 5793,
      cornerCount: 11,
      drsZones: 2,
      isClockwise: true,
      lapRecordTime: '1:21.046',
      lapRecordYear: 2004,
      // Tek çizgi şema — gerçek pist geometrisi değil, okunabilir bir soyutlama.
      // Küratör gerçek çizimi koyduğunda bu değişecek.
      trackSvgPath:
        'M40 168 L96 44 Q100 34 110 36 L132 42 Q142 45 140 56 L128 104 Q126 116 137 118 L206 130 Q218 132 216 144 L210 170 Q208 180 196 178 L52 176 Q40 175 40 168 Z',
      trackSvgViewBox: '0 0 260 200',
      startLineOffset: 0.02,
      narrativeTr:
        'Monza’da pist neredeyse hiç dönmez. On bir viraj, çoğu pistin yarısından az; geri kalanı düz. Bu, kâğıt üzerinde sıkıcı görünen bir tarif ama sonucu tam tersi: dönmeyen bir pistte fark yaratmanın tek yolu frene herkesten geç basmaktır, ve bunun bedeli her zaman aynı yerde ödenir.',
      contextTr:
        'Takvimin en eski pistlerinden biri ve 1950’den bu yana neredeyse kesintisiz yarışılıyor. Eski banked oval bugün kullanılmıyor ama hâlâ ayakta — pistin kendi tarihini içinde taşıdığı az sayıdaki yerden biri.',
      personalNoteTr:
        '[TASLAK — küratör notu buraya] Bu pisti neden arşive ilk aldığımı yazmak istiyorum.',
      personalRank: 1,
      isFavorite: true,
      isPublished: true,
      orderIndex: 0,
    },
  });

  await prisma.f1CircuitCorner.deleteMany({ where: { circuitId: monza.id } });
  await prisma.f1CircuitCorner.createMany({
    data: [
      {
        circuitId: monza.id,
        number: 1,
        name: 'Variante del Rettifilo',
        noteTr:
          'Düzlüğün sonundaki ilk frenleme. Yarışın en çok olay çıkan yeri, çünkü herkes aynı anda ve aynı çizgide fren yapmak zorunda.',
        markerX: 96,
        markerY: 44,
        isPublished: true,
        orderIndex: 0,
      },
      {
        circuitId: monza.id,
        number: 4,
        name: 'Variante della Roggia',
        noteTr: 'Kısa ve dar; içeriden geçmeye çalışmak çoğu zaman iyi bitmez.',
        markerX: 140,
        markerY: 56,
        isPublished: true,
        orderIndex: 1,
      },
      {
        circuitId: monza.id,
        number: 8,
        name: 'Variante Ascari',
        noteTr:
          'Üç bölümlü ve akıcı. Buradan iyi çıkmak, sonraki uzun düzlüğün tamamını belirliyor.',
        markerX: 206,
        markerY: 130,
        isPublished: true,
        orderIndex: 2,
      },
      {
        circuitId: monza.id,
        number: 11,
        name: 'Parabolica',
        noteTr:
          'Sürekli açılan uzun bir sağ. Erken gaz veren kazanır, biraz erken veren duvarı bulur.',
        markerX: 52,
        markerY: 176,
        isPublished: true,
        orderIndex: 3,
      },
    ],
  });

  await prisma.f1Moment.deleteMany({ where: { circuitId: monza.id } });
  await prisma.f1Moment.createMany({
    data: [
      {
        circuitId: monza.id,
        seasonYear: 1971,
        titleTr: 'Tarihin en yakın finişi',
        narrativeTr:
          'İlk beş araç arasında bir saniyeden az fark vardı. Slipstream düzeninin en uç örneği; sonraki yıllarda pist bu yarışa göre yeniden düşünüldü.',
        isHighlight: true,
        isPublished: true,
        orderIndex: 0,
      },
      {
        circuitId: monza.id,
        seasonYear: 2004,
        titleTr: 'Tur rekoru',
        narrativeTr:
          'Uzun yıllar kırılmadan duran tur. Monza’nın neden başka bir yer olduğunu tek bir sayıyla anlatan kayıt.',
        isPublished: true,
        orderIndex: 1,
      },
    ],
  });

  console.log('Tohum tamam:');
  console.log('  kulüp   : galatasaray (3 dönem, 4 an, 1 figür)');
  console.log('  efsane  : hagi');
  console.log('  pist    : monza (4 viraj, 2 an)');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
