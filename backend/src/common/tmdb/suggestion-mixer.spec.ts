import { dedupe, interleave, shuffle } from './suggestion-mixer';

/** Test okunurlugu icin: id listesinden oneri dizisi. */
function items(...ids: number[]) {
  return ids.map((tmdbId) => ({ tmdbId }));
}

describe('dedupe', () => {
  it('bilinen kayitlari eler', () => {
    const result = dedupe(items(1, 2, 3), new Set([2]));
    expect(result.map((item) => item.tmdbId)).toEqual([1, 3]);
  });

  it('ayni listedeki tekrarlari eler, ilk gorunumu tutar', () => {
    const result = dedupe(items(1, 2, 1, 3, 2), new Set());
    expect(result.map((item) => item.tmdbId)).toEqual([1, 2, 3]);
  });

  it('girdi dizisini degistirmez', () => {
    const input = items(1, 2);
    dedupe(input, new Set([1]));
    expect(input.map((item) => item.tmdbId)).toEqual([1, 2]);
  });
});

describe('shuffle', () => {
  it('ayni ogeleri dondurur ve girdiyi bozmaz', () => {
    const input = items(1, 2, 3, 4, 5);
    const result = shuffle(input);
    expect(result.map((item) => item.tmdbId).sort((a, b) => a - b)).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(input.map((item) => item.tmdbId)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('interleave', () => {
  it('akislari donusumlu dizer', () => {
    const a = items(1, 2, 3);
    const b = items(10, 20, 30);
    expect(interleave([a, b], 6).map((item) => item.tmdbId)).toEqual([
      1, 10, 2, 20, 3, 30,
    ]);
  });

  it('limit dolunca durur', () => {
    const a = items(1, 2, 3);
    const b = items(10, 20, 30);
    expect(interleave([a, b], 3).map((item) => item.tmdbId)).toEqual([
      1, 10, 2,
    ]);
  });

  it('AYNI akis iki kez verilse bile ogeyi tekrarlamaz', () => {
    // Cagiranlar `[explore, taste, explore, buzz]` gonderiyor: kesif bilerek
    // iki kez listede. Bu test o kurulumun ogeyi ciftlemedigini sabitliyor.
    const explore = items(1, 2, 3, 4);
    const taste = items(10, 11);
    const result = interleave([explore, taste, explore], 6);
    const ids = result.map((item) => item.tmdbId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([1, 10, 2, 3, 11, 4]);
  });

  it('akislar tukenirse limitten once biter (sonsuz donguye girmez)', () => {
    const result = interleave([items(1), items(2)], 100);
    expect(result.map((item) => item.tmdbId)).toEqual([1, 2]);
  });

  it('bos akislarla bos dizi doner', () => {
    expect(interleave([[], []], 10)).toEqual([]);
  });
});
