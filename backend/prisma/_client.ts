/**
 * `prisma/*.ts` betikleri için modül çözücü.
 *
 * ⚠️ NEDEN VAR: bu betikler sunucuda çalıştırıldığında
 * `Cannot find module '../src/generated/prisma/client'` veriyordu. Sebep
 * Dockerfile'da: çalışma imajına yalnızca `dist`, `prisma`, `node_modules` ve
 * `package.json` kopyalanıyor — **`src/` kopyalanmıyor**. Geliştirmede kaynak
 * `src/` altında, üretimde derlenmiş hâliyle `dist/` altında.
 *
 * Betikleri yalnızca yerelde denediğim için bu ilk canlı çalıştırmada çıktı.
 *
 * Tip güvenliği KAYBOLMUYOR: tipler `import type` ile alınıyor ve derlemede
 * tamamen siliniyor — yani üretimde o yollar hiç çözülmeye çalışılmıyor.
 * Çalışma zamanındaki `require` hangisi varsa onu buluyor.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { PrismaClient as PrismaClientTip } from '../src/generated/prisma/client';
import type {
  CommonsPortraitResolver as CommonsTip,
  JolpicaProvider as JolpicaTip,
} from '../src/f1-sync/providers';

/** `src/<yol>` (geliştirme) ya da `dist/<yol>` (üretim) — hangisi varsa. */
function cozumle(yol: string): Record<string, unknown> {
  const gelistirme = join(__dirname, '../src', yol);
  const uretim = join(__dirname, '../dist', yol);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(existsSync(`${gelistirme}.ts`) ? gelistirme : uretim);
}

const prismaModul = cozumle('generated/prisma/client');
const f1Modul = cozumle('f1-sync/providers');

export const PrismaClient = prismaModul.PrismaClient as new (
  ...args: ConstructorParameters<typeof PrismaClientTip>
) => PrismaClientTip;

export const JolpicaProvider = f1Modul.JolpicaProvider as new () => JolpicaTip;

export const CommonsPortraitResolver =
  f1Modul.CommonsPortraitResolver as new () => CommonsTip;

export type { PrismaClientTip as PrismaClientType };
export type { F1ResultsProvider, PodiumEntry } from '../src/f1-sync/providers';
