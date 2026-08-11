import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './_client';

const BCRYPT_ROUNDS = 12;

/**
 * Müzik künyesi rol sözlüğü (Salon 06).
 *
 * ⚠️ Liste `src/music/music-roles.service.ts` içinde de duruyor ve
 * BİLEREK kopyalanmış: prisma betikleri `src/` altından import EDEMEZ
 * (üretimde yalnızca derlenmiş `dist/` var, bkz. Dockerfile). İki yerin de
 * aynı kalması gerekiyor; sözlük büyürse ikisi birlikte güncellenir.
 *
 * Sözlük kontrollü: katalog sync'i bu tabloya yazmaz. Görünen etiket burada
 * DEĞİL — `key` bir çeviri anahtarı, metin `messages/*.json` içinde
 * (`music.roles.<key>`, kural 1).
 */
const MUSIC_ROLE_KEYS = [
  'primary_artist',
  'featured_artist',
  'vocalist',
  'guitarist',
  'bassist',
  'drummer',
  'keyboardist',
  'dj',
  'turntablist',
  'composer',
  'songwriter',
  'producer',
  'arranger',
  'conductor',
  'mixing_engineer',
  'mastering_engineer',
];

async function main(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? 'Admin';

  if (!email || !password) {
    throw new Error('SEED.ADMIN_CREDENTIALS_MISSING');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    }),
  });

  try {
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const admin = await prisma.user.upsert({
      where: { email },
      update: { passwordHash, name, role: 'ADMIN', isDeleted: false },
      create: { email, passwordHash, name, role: 'ADMIN' },
    });
    // Şifre asla loglanmaz (AGENTS.md kural 6).
    console.log(`Admin user ready: ${admin.email} (id: ${admin.id})`);

    /**
     * Rol sözlüğü. `update: {}` bilinçli boş: küratörün elle düzelttiği bir
     * sırayı ya da slug'ı seed'i yeniden çalıştırmak EZMEZ.
     */
    let createdRoles = 0;
    for (const [index, key] of MUSIC_ROLE_KEYS.entries()) {
      const before = await prisma.musicRole.findUnique({
        where: { key },
        select: { id: true },
      });
      if (before) {
        continue;
      }
      await prisma.musicRole.create({
        data: { key, slug: key.replace(/_/g, '-'), orderIndex: index },
      });
      createdRoles += 1;
    }
    console.log(
      `Music role vocabulary ready: ${createdRoles} created, ${MUSIC_ROLE_KEYS.length - createdRoles} existing`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
