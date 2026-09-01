import { parseDurationMs } from './duration';

describe('parseDurationMs', () => {
  it("'1d' çerezin eski sabit ömrüyle birebir aynı sonucu verir", () => {
    // Bu eşitlik bozulursa oturum süresi sessizce değişmiş olur.
    expect(parseDurationMs('1d')).toBe(24 * 60 * 60 * 1000);
  });

  it('birimsiz sayıyı saniye sayar (jsonwebtoken kuralı)', () => {
    expect(parseDurationMs('900')).toBe(900_000);
  });

  it('diğer birimleri çevirir', () => {
    expect(parseDurationMs('12h')).toBe(12 * 3_600_000);
    expect(parseDurationMs('30m')).toBe(30 * 60_000);
    expect(parseDurationMs('7d')).toBe(7 * 86_400_000);
    expect(parseDurationMs(' 2w ')).toBe(2 * 604_800_000);
  });

  it('tanımadığı biçimde null döner — sessiz varsayılana düşmez', () => {
    expect(parseDurationMs('10 gün')).toBeNull();
    expect(parseDurationMs('')).toBeNull();
    expect(parseDurationMs('abc')).toBeNull();
  });
});
