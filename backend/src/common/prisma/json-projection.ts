import { Prisma, type PrismaClient } from '../../generated/prisma/client';

/**
 * JSON sütunundan yalnızca okunan anahtarları çeken SELECT parçaları (API-08).
 *
 * Film/dizi/anime kanatları dış kaynağın anlık görüntüsünü tek bir `Json`
 * sütununda tutuyor (`externalData`); liste görünümü o görüntüden 10-15 alan
 * okurken satırlar kadro, sahne kareleri, platformlar dâhil tam görüntüyle
 * geliyordu. Prisma'nın `select`/`omit`'i JSON'un içine inemediği için
 * daraltma Postgres'te yapılıyor: `jsonb_build_object` yalnızca istenen
 * anahtarları kurar, geri kalanı veritabanından hiç çıkmaz.
 *
 * Sütun listesi elle yazılmıyor: Prisma'nın ürettiği `…ScalarFieldEnum`
 * nesnesinden türetiliyor. Şemaya sütun eklenince buradaki sorgular
 * kendiliğinden onu da seçer; elle liste tutulsaydı yeni sütun tipte "var"
 * görünüp çalışma anında `undefined` gelirdi.
 *
 * Kitap kanadı aynı sorunu `ARCHIVE_OMIT` ile çözüyor — orada JSON hiç
 * okunmadığı için sütunu bütünüyle atmak yetiyor; burada yetmiyor.
 */

/** `$queryRaw` çalıştırabilen her şey — servis de, testteki çıplak istemci de. */
export type RawReader = Pick<PrismaClient, '$queryRaw'>;

const IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/;

/**
 * Tanımlayıcıyı çift tırnaklar; deseni tutmayanı reddeder. Buraya gelen her
 * ad kod sabitlerinden geliyor (şema alanı ya da tip anahtarı), kullanıcı
 * girdisi değil — yine de `Prisma.raw` ile SQL'e giren tek yol burası,
 * kapı dar tutuluyor.
 */
function quote(name: string): string {
  if (!IDENTIFIER.test(name)) {
    throw new Error(`Gecersiz SQL tanimlayicisi: ${JSON.stringify(name)}`);
  }
  return `"${name}"`;
}

function column(name: string, alias?: string): string {
  return alias ? `${quote(alias)}.${quote(name)}` : quote(name);
}

export interface JsonProjection {
  /** Daraltılacak `Json` sütunu (ör. `externalData`) */
  column: string;
  /** Görüntüden taşınacak anahtarlar; eksik anahtar JSON `null` olarak gelir */
  keys: readonly string[];
}

/**
 * `jsonb_build_object('k1', col->'k1', …) AS "col"` — sütun NULL ise NULL
 * kalır ki "künye hiç alınmamış" durumu (`externalData ?? null`) bozulmasın.
 *
 * İki tür boşluk var ve ikisi de korunur: SQL NULL (`IS NULL`) ve JSON `null`
 * (`jsonb_typeof = 'null'`). Prisma, `Json?` alana düz `null` yazınca ikincisini
 * üretiyor; yalnız `IS NULL`e bakılsaydı öyle bir satır bütün anahtarları
 * `null` olan bir NESNE olarak gelir, `?? null` kontrolleri kaçırırdı
 * (entegrasyon testinde yakalandı).
 */
export function pickJson(
  projection: JsonProjection,
  tableAlias?: string,
): Prisma.Sql {
  const source = column(projection.column, tableAlias);
  if (projection.keys.length === 0) {
    throw new Error('pickJson: en az bir anahtar gerekli');
  }
  const pairs = projection.keys
    .map((key) => {
      if (!IDENTIFIER.test(key)) {
        throw new Error(`Gecersiz JSON anahtari: ${JSON.stringify(key)}`);
      }
      return `'${key}', ${source}->'${key}'`;
    })
    .join(', ');
  return Prisma.raw(
    `CASE WHEN ${source} IS NULL OR jsonb_typeof(${source}) = 'null' THEN NULL ELSE jsonb_build_object(${pairs}) END AS ${quote(projection.column)}`,
  );
}

/**
 * Modelin bütün skaler sütunları + daraltılmış JSON sütunu. `fields` Prisma'nın
 * ürettiği `XScalarFieldEnum` nesnesidir; sıra şemadaki sırayla aynı kalır.
 */
export function projectedColumns(
  fields: Record<string, string>,
  projection: JsonProjection,
  tableAlias?: string,
): Prisma.Sql {
  const names = Object.values(fields);
  if (!names.includes(projection.column)) {
    throw new Error(
      `projectedColumns: ${projection.column} bu modelin sutunu degil`,
    );
  }
  const scalars = names
    .filter((name) => name !== projection.column)
    .map((name) => column(name, tableAlias));
  return Prisma.join(
    [Prisma.raw(scalars.join(', ')), pickJson(projection, tableAlias)],
    ', ',
  );
}

/**
 * Bire-çok ilişkiyi (dizi→sezon, seri→parça) iki düz sorgudan birleştirir;
 * Prisma'nın `include` çıktısıyla aynı şekil. Çocuklar geldiği sırayla
 * korunur — sıralamayı sorgu verir, burası dokunmaz.
 */
export function attachChildren<
  Parent extends { id: string },
  Child,
  Key extends string,
>(
  parents: Parent[],
  children: Child[],
  parentIdOf: (child: Child) => string,
  key: Key,
): Array<Parent & Record<Key, Child[]>> {
  const grouped = new Map<string, Child[]>();
  for (const child of children) {
    const parentId = parentIdOf(child);
    const bucket = grouped.get(parentId);
    if (bucket) {
      bucket.push(child);
    } else {
      grouped.set(parentId, [child]);
    }
  }
  return parents.map(
    (parent) =>
      ({
        ...parent,
        [key]: grouped.get(parent.id) ?? [],
      }) as Parent & Record<Key, Child[]>,
  );
}
