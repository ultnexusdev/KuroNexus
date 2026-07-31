import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';
import { BookCoverService } from './book-cover.service';
import { matchGenreKeys } from './data/genres.data';
import type { BinKitapCredits } from './bin-kitap.service';

/**
 * Künyenin ilişkisel hâlini kurar: yazar/çevirmen/editör, yayınevi, seri ve
 * tür kayıtlarını bulur ya da açar, sonra kitaba bağlar (Faz 2a, kural 11).
 *
 * **Eşleştirme anahtarı sırası** — yanlış eşleşme aynı kişiyi ikiye böler ya
 * da iki kişiyi birleştirir, ikisi de sessiz hatadır:
 *  1. Kaynağın kimliği (`binKitapId`) varsa o. Ölçüldü: 1000Kitap kişiye ve
 *     türe kimlik veriyor.
 *  2. Yoksa aksan katlanmış ad (`slug`). "Ülker İnce" / "ULKER INCE" /
 *     "ulker ince" aynı kişiye düşsün diye.
 *
 * Yayınevi ve seri yalnızca (2)'ye düşüyor: kaynak onlara kimlik vermiyor
 * (düz metin, ölçüldü).
 *
 * **Bu servis düz metin sütunlarını DEĞİŞTİRMEZ.** Faz 2a'da `authors`,
 * `publisher`, `translator`, `genres`, `seriesName` yazılmaya devam ediyor ve
 * arayüz onları okuyor; ilişkiler yanlarına kuruluyor. Okuma yolu Faz 2b'de
 * geçecek, düz metin sütunları o zaman düşecek.
 */
@Injectable()
export class BookCreditsService {
  private readonly logger = new Logger(BookCreditsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly covers: BookCoverService,
  ) {}

  /**
   * Kitabın ilişkisel künyesini kurar ve `BookEntry`ye yazılacak yabancı
   * anahtarları döndürür.
   *
   * **Asla fırlatmaz.** İlişki kurulamadığı için kitap eklenememesi kabul
   * edilemez (kural 4); hata günlüğe yazılır, kayıt düz metin künyesiyle
   * yaşamaya devam eder.
   */
  async link(
    entryId: string,
    credits: BinKitapCredits,
  ): Promise<{ publisherId: string | null; seriesId: string | null }> {
    try {
      const [publisherId, seriesId] = await Promise.all([
        this.resolvePublisher(credits.publisher),
        this.resolveSeries(credits.series?.name ?? null),
      ]);
      await this.linkPeople(entryId, credits);
      await this.linkGenres(entryId, credits);
      return { publisherId, seriesId };
    } catch (error) {
      this.logger.warn(
        `İlişkisel künye kurulamadı (${entryId}): ${String(error)}`,
      );
      return { publisherId: null, seriesId: null };
    }
  }

  // --- Kişiler ---

  private async linkPeople(
    entryId: string,
    credits: BinKitapCredits,
  ): Promise<void> {
    // Kayıt yeniden tohumlanırsa eski bağlar kalmasın
    await this.prisma.bookPersonOnEntry.deleteMany({ where: { entryId } });

    for (const person of credits.people) {
      const id = await this.resolvePerson(person);
      if (!id) {
        continue;
      }
      /**
       * `createMany` + `skipDuplicates` değil `upsert`: aynı kişi aynı kitapta
       * iki rolde birden görünebiliyor (yazar-çevirmen) ve kısıt role dahil,
       * ama kaynak aynı rolü iki kez de verebiliyor.
       */
      await this.prisma.bookPersonOnEntry.upsert({
        where: {
          entryId_personId_role: { entryId, personId: id, role: person.role },
        },
        create: {
          entryId,
          personId: id,
          role: person.role,
          orderIndex: person.orderIndex,
        },
        update: { orderIndex: person.orderIndex },
      });
    }
  }

  private async resolvePerson(person: {
    binKitapId: string | null;
    name: string;
    seoName: string | null;
    photo: string | null;
  }): Promise<string | null> {
    const slug = slugify(person.name);
    if (!slug) {
      return null;
    }

    const existing = person.binKitapId
      ? ((await this.prisma.bookPerson.findUnique({
          where: { binKitapId: person.binKitapId },
        })) ?? (await this.prisma.bookPerson.findUnique({ where: { slug } })))
      : await this.prisma.bookPerson.findUnique({ where: { slug } });

    if (existing) {
      /**
       * Var olan kayıt **zenginleştirilir, ezilmez**: küratörün elle yazdığı
       * biyografi ya da düzelttiği ad korunmalı. Yalnızca boş alanlar dolar.
       */
      const photo =
        existing.photo ?? (await this.covers.download(person.photo));
      const needsUpdate =
        (!existing.binKitapId && person.binKitapId) ||
        (!existing.binKitapSeoName && person.seoName) ||
        (!existing.photo && photo);
      if (needsUpdate) {
        await this.prisma.bookPerson.update({
          where: { id: existing.id },
          data: {
            binKitapId: existing.binKitapId ?? person.binKitapId,
            binKitapSeoName: existing.binKitapSeoName ?? person.seoName,
            photo: existing.photo ?? photo,
          },
        });
      }
      return existing.id;
    }

    const photo = await this.covers.download(person.photo);
    const created = await this.prisma.bookPerson.create({
      data: {
        name: person.name,
        slug,
        binKitapId: person.binKitapId,
        binKitapSeoName: person.seoName,
        photo,
      },
    });
    return created.id;
  }

  // --- Yayınevi ve seri ---

  private async resolvePublisher(name: string | null): Promise<string | null> {
    const slug = name ? slugify(name) : '';
    if (!name || !slug) {
      return null;
    }
    const publisher = await this.prisma.bookPublisher.upsert({
      where: { slug },
      create: { name, slug },
      update: {},
    });
    return publisher.id;
  }

  private async resolveSeries(name: string | null): Promise<string | null> {
    const slug = name ? slugify(name) : '';
    if (!name || !slug) {
      return null;
    }
    const series = await this.prisma.bookSeries.upsert({
      where: { slug },
      create: { name, slug },
      update: {},
    });
    return series.id;
  }

  // --- Türler ---

  private async linkGenres(
    entryId: string,
    credits: BinKitapCredits,
  ): Promise<void> {
    await this.prisma.bookGenreOnEntry.deleteMany({ where: { entryId } });

    const seen = new Set<string>();
    for (const genre of credits.genres) {
      for (const id of await this.resolveGenre(genre)) {
        if (seen.has(id)) {
          continue;
        }
        seen.add(id);
        await this.prisma.bookGenreOnEntry.create({
          data: { entryId, genreId: id },
        });
      }
    }
  }

  /**
   * Kaynağın tür adını sözlükteki türlere bağlar.
   *
   * **Kullanıcı kararı: eşleşmeyen tür otomatik kabul edilmez.** Sözlükte
   * karşılığı olan ad onaylı tür(ler)e düşer; olmayan ad `isApproved = false`
   * ile açılır, süzgeçte görünmez ve admin panelde onay bekler. Otomatik kabul
   * edilseydi tür listesi aynı kavramın varyantlarıyla dolardı
   * ("Roman" / "Fantastik Roman" / "Çok Satanlar" ayrı türler olurdu).
   *
   * Tek ad birden çok türe düşebiliyor ("Fiction / Science Fiction / General"
   * hem roman hem bilimkurgu), o yüzden dizi dönüyor.
   */
  private async resolveGenre(genre: {
    binKitapId: string | null;
    name: string;
  }): Promise<string[]> {
    const keys = matchGenreKeys(genre.name);
    if (keys.length > 0) {
      const ids: string[] = [];
      for (const key of keys) {
        const approved = await this.prisma.bookGenre.upsert({
          where: { key },
          // `name` anahtarın kendisi: görünen ad çeviri dosyasından
          // (`book.genreName.<key>`) okunuyor, burada saklanmıyor
          create: { key, name: key, slug: key, isApproved: true },
          update: {},
        });
        ids.push(approved.id);
      }
      return ids;
    }

    const slug = slugify(genre.name);
    if (!slug) {
      return [];
    }
    if (genre.binKitapId) {
      const byId = await this.prisma.bookGenre.findUnique({
        where: { binKitapId: genre.binKitapId },
      });
      if (byId) {
        return [byId.id];
      }
    }
    const pending = await this.prisma.bookGenre.upsert({
      where: { slug },
      create: {
        name: genre.name,
        slug,
        binKitapId: genre.binKitapId,
        isApproved: false,
      },
      update: {},
    });
    return [pending.id];
  }
}
