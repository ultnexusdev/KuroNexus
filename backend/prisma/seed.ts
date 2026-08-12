import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './_client';
import { MUSIC_TAXONOMY } from './music-taxonomy';

/**
 * ⚠️ `src/common/utils/slugify.ts`in KOPYASI — prisma betikleri `src/`
 * altından import edemiyor (bu dosyanın başındaki nota bakın). İkisi
 * ayrışırsa tür slug'ları seed ile servis arasında farklılaşır; taksonomi
 * adları ASCII olduğu için bugün fark üretmiyor ama kural aynı.
 */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

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

    await seedMusicTaxonomy(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Tür taksonomisi — 17 oda ve alt türleri (`music-taxonomy.ts`).
 *
 * Tekrar çalıştırmak güvenli: slug üzerinden upsert. Var olan kayıtlar
 * taksonomiye KATILIYOR — MusicBrainz'den gelmiş "rock", "metal", "nu-metal"
 * gibi türler aynı slug'a düştüğü için yeni ad/renk/üst tür bilgisini alıyor
 * ve onaylanıyor. Yani sözlük ikiye bölünmüyor.
 *
 * ⚠️ Alt tür ana türle AYNI ada sahipse atlanıyor. Kullanıcının listesinde
 * dört yerde var ("Pop > Pop", "Hip-Hop > Hip-Hop", "Reggae > Reggae",
 * "Experimental > Experimental"); ikisi de aynı slug'a düşeceği için ikinci
 * upsert birincisini kendi çocuğu yapmaya çalışırdı — tür kendi kendinin
 * üstü olurdu. Ana tür zaten o adı temsil ediyor.
 */
async function seedMusicTaxonomy(
  prisma: InstanceType<typeof PrismaClient>,
): Promise<void> {
  let parents = 0;
  let children = 0;
  let skipped = 0;

  for (const group of MUSIC_TAXONOMY) {
    const parentSlug = slugify(group.name);
    const parent = await prisma.musicGenre.upsert({
      where: { slug: parentSlug },
      update: {
        name: group.name,
        accentKey: group.accentKey,
        parentId: null,
        isApproved: true,
      },
      create: {
        slug: parentSlug,
        name: group.name,
        accentKey: group.accentKey,
        isApproved: true,
      },
      select: { id: true },
    });
    parents += 1;

    for (const childName of group.children) {
      const childSlug = slugify(childName);
      if (childSlug === parentSlug) {
        skipped += 1;
        continue;
      }
      await prisma.musicGenre.upsert({
        where: { slug: childSlug },
        update: {
          name: childName,
          // Alt tür ana türün rengini TAŞIYOR — gerekçe `music-taxonomy.ts`
          accentKey: group.accentKey,
          parentId: parent.id,
          isApproved: true,
        },
        create: {
          slug: childSlug,
          name: childName,
          accentKey: group.accentKey,
          parentId: parent.id,
          isApproved: true,
        },
      });
      children += 1;
    }
  }

  console.log(
    `Music taxonomy ready: ${parents} rooms, ${children} subgenres, ${skipped} skipped (same name as parent)`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
