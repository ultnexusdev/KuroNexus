import { attachChildren, pickJson, projectedColumns } from './json-projection';

describe('pickJson', () => {
  it('yalniz istenen anahtarlari kuran jsonb_build_object uretir', () => {
    const sql = pickJson({
      column: 'externalData',
      keys: ['title', 'runtime'],
    });
    expect(sql.sql).toBe(
      `CASE WHEN "externalData" IS NULL OR jsonb_typeof("externalData") = 'null' THEN NULL ELSE jsonb_build_object('title', "externalData"->'title', 'runtime', "externalData"->'runtime') END AS "externalData"`,
    );
    expect(sql.values).toHaveLength(0);
  });

  it('tablo takma adini sutuna ekler, AS kismina eklemez', () => {
    const sql = pickJson({ column: 'externalData', keys: ['name'] }, 's');
    expect(sql.sql).toContain(`"s"."externalData"->'name'`);
    expect(sql.sql).toMatch(/ AS "externalData"$/);
  });

  it('SQL kacisi gerektiren anahtar ve sutun adlarini reddeder', () => {
    expect(() =>
      pickJson({ column: 'externalData', keys: ["title'; DROP TABLE x; --"] }),
    ).toThrow('Gecersiz JSON anahtari');
    expect(() => pickJson({ column: 'ext"ernal', keys: ['title'] })).toThrow(
      'Gecersiz SQL tanimlayicisi',
    );
    expect(() => pickJson({ column: 'externalData', keys: [] })).toThrow(
      'en az bir anahtar',
    );
  });
});

describe('projectedColumns', () => {
  const fields = {
    id: 'id',
    tmdbId: 'tmdbId',
    externalData: 'externalData',
    createdAt: 'createdAt',
  };

  it('JSON sutunu haric butun skalerleri sema sirasiyla secer', () => {
    const sql = projectedColumns(fields, {
      column: 'externalData',
      keys: ['title'],
    });
    expect(sql.sql).toBe(
      `"id", "tmdbId", "createdAt", CASE WHEN "externalData" IS NULL OR jsonb_typeof("externalData") = 'null' THEN NULL ELSE jsonb_build_object('title', "externalData"->'title') END AS "externalData"`,
    );
  });

  it('takma adi her sutuna uygular', () => {
    const sql = projectedColumns(
      fields,
      { column: 'externalData', keys: ['title'] },
      'p',
    );
    expect(
      sql.sql.startsWith(`"p"."id", "p"."tmdbId", "p"."createdAt", `),
    ).toBe(true);
  });

  it('modelde olmayan JSON sutununu reddeder', () => {
    expect(() =>
      projectedColumns(fields, { column: 'payload', keys: ['title'] }),
    ).toThrow('bu modelin sutunu degil');
  });
});

describe('attachChildren', () => {
  it('cocuklari ebeveyne sirayi koruyarak baglar, cocuksuz ebeveyn bos dizi alir', () => {
    const parents = [{ id: 'a' }, { id: 'b' }];
    const children = [
      { entryId: 'b', n: 1 },
      { entryId: 'a', n: 2 },
      { entryId: 'b', n: 3 },
    ];
    const result = attachChildren(
      parents,
      children,
      (child) => child.entryId,
      'parts',
    );
    expect(result).toEqual([
      { id: 'a', parts: [{ entryId: 'a', n: 2 }] },
      {
        id: 'b',
        parts: [
          { entryId: 'b', n: 1 },
          { entryId: 'b', n: 3 },
        ],
      },
    ]);
  });
});
