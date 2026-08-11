#!/usr/bin/env node
/**
 * Migration dosyalarını **çalıştırılabilir SQL** olarak doğrular.
 *
 * ── NEDEN VAR (11 Ağustos 2026 kesintisi) ─────────────────────────────────
 * `20260811152033_add_music_core` üretimde P3009 ile patladı ve backend
 * crash-loop'a girdi; arşiv yaklaşık yarım saat erişilemedi. Sebep SQL'in
 * kendisi DEĞİLDİ — dosyanın ilk satırı şuydu:
 *
 *     Loaded Prisma config from prisma.config.ts.
 *
 * Yani Prisma CLI'nin stdout banner'ı. Migration şöyle üretilmişti:
 *
 *     npx prisma migrate diff ... --script > migration.sql 2>&1
 *                                                          ^^^^^
 * `2>&1` stderr'i dosyaya kattı ve banner SQL'in birinci satırı oldu.
 * PostgreSQL: `42601 syntax error at or near "Loaded"`, Position 0.
 *
 * Dosya o gün DENETLENDİ ama yanlış şeyler arandı: `CREATE TABLE` sayısı,
 * `ALTER` hedefleri, FK'ler, 63 karakter sınırı, tekrar eden index adları.
 * Hiçbiri "bu dosya geçerli SQL ile başlıyor mu" diye sormadı. Aradığını
 * bulan bir denetim, aramadığını göremez — bu betik o boşluğu kapatıyor.
 *
 * ── İKİ KORUMA ────────────────────────────────────────────────────────────
 * 1. Dosyanın ilk anlamlı satırı bir SQL ifadesi ya da yorum olmalı.
 * 2. Dosyanın HİÇBİR yerinde CLI gürültüsü olmamalı (banner, npm uyarısı,
 *    Prisma hata satırı). Satır sonunda da olabilir — `>>` ile eklenmiş bir
 *    çıktı ya da yanlış kopyala-yapıştır aynı sınıf hata.
 *
 * ── KULLANIM ──────────────────────────────────────────────────────────────
 *     node scripts/check-migrations.mjs              # prisma/migrations/**
 *     node scripts/check-migrations.mjs yol/bir.sql  # tek dosya
 *
 * Bozuk dosya bulursa çıkış kodu 1. Bağımlılık yok — yeni migration üreten
 * herkes tek komutla koşturabilsin diye düz Node.
 *
 * ⚠️ Bu betik SQL'in ANLAMINI doğrulamıyor, yalnızca dosyanın SQL olduğunu.
 * Migration'ın gerçekten uygulanabildiğini görmek için tek yol var: gerçek
 * bir PostgreSQL'de koşturmak. Bu betik onun yerine geçmez, önünde durur.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const MIGRATIONS_DIR = resolve(import.meta.dirname, '..', 'prisma', 'migrations');

/** Bir migration dosyasının ilk anlamlı satırı bunlardan biriyle başlamalı. */
const VALID_STARTS = [
  '--',
  '/*',
  'CREATE',
  'ALTER',
  'DROP',
  'BEGIN',
  'INSERT',
  'UPDATE',
  'DELETE',
  'SET',
  'COMMENT',
  'DO',
  'GRANT',
  'TRUNCATE',
  'WITH',
];

/**
 * Bilinen CLI gürültüsü. Bunlar SQL dosyasında bulunursa dosya kirlenmiştir.
 * Liste tahminle değil, gerçekten karşılaşılan çıktılardan kuruldu.
 */
const NOISE_PATTERNS = [
  /^Loaded Prisma config/i,
  /^Prisma schema loaded/i,
  /^Environment variables loaded/i,
  /^\d+ migrations? found/i,
  /^npm (notice|warn|error)/i,
  /^Error:/i,
  /^warn /i,
  /^Datasource "/i,
  /^✔/,
  /^✖/,
  /Update available/i,
  /^\s*at [A-Za-z]/, // yığın izi satırı
];

function migrationFiles() {
  let entries;
  try {
    entries = readdirSync(MIGRATIONS_DIR, { withFileTypes: true });
  } catch {
    console.error(`Migration klasörü okunamadı: ${MIGRATIONS_DIR}`);
    process.exit(1);
  }
  const files = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const file = join(MIGRATIONS_DIR, entry.name, 'migration.sql');
    try {
      if (statSync(file).isFile()) {
        files.push(file);
      }
    } catch {
      // migration.sql'i olmayan klasör (migration_lock.toml gibi) atlanır
    }
  }
  return files.sort();
}

/** Tek dosyayı sınar, bulunan sorunları döndürür. */
function check(file) {
  const problems = [];
  const raw = readFileSync(file, 'utf8');

  if (raw.trim().length === 0) {
    problems.push('dosya boş');
    return problems;
  }

  const lines = raw.split(/\r?\n/);

  // 1) İlk anlamlı satır SQL mi?
  const firstIndex = lines.findIndex((line) => line.trim().length > 0);
  const first = lines[firstIndex].trim();
  const upper = first.toUpperCase();
  if (!VALID_STARTS.some((start) => upper.startsWith(start))) {
    problems.push(
      `${firstIndex + 1}. satır SQL ile başlamıyor: ${JSON.stringify(first.slice(0, 80))}`,
    );
  }

  // 2) Dosyanın herhangi bir yerinde CLI gürültüsü var mı?
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      return;
    }
    for (const pattern of NOISE_PATTERNS) {
      if (pattern.test(trimmed)) {
        problems.push(
          `${index + 1}. satırda CLI çıktısı: ${JSON.stringify(trimmed.slice(0, 80))}`,
        );
        return;
      }
    }
  });

  return problems;
}

const targets = process.argv.slice(2);
const files = targets.length > 0 ? targets.map((t) => resolve(t)) : migrationFiles();

let bad = 0;
for (const file of files) {
  const problems = check(file);
  const label = file.replace(resolve(import.meta.dirname, '..'), 'backend');
  if (problems.length === 0) {
    console.log(`  ok    ${label}`);
    continue;
  }
  bad += 1;
  console.error(`  BOZUK ${label}`);
  for (const problem of problems) {
    console.error(`        → ${problem}`);
  }
}

console.log(
  `\n${files.length} migration denetlendi, ${bad} bozuk.` +
    (bad > 0
      ? '\n⚠️ Bozuk bir migration ÜRETİME PUSH EDİLMEZ: `migrate deploy` başarısız olur,' +
        '\n   `_prisma_migrations` tablosuna başarısız satır yazılır ve CMD zincirli' +
        "\n   olduğu için (`migrate deploy && node dist/main`) backend hiç kalkmaz."
      : ''),
);

process.exit(bad > 0 ? 1 : 0);
