import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './_client';

const BCRYPT_ROUNDS = 12;

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
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
