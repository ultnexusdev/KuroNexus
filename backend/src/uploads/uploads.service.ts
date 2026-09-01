import { randomBytes } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/mp3',
]);

// `.env.example`'daki `MAX_UPLOAD_BYTES` ile AYNI olmalı. Uzun süre kod 50 MB,
// örnek dosya 10 MB diyordu; değişkeni tanımlamayan bir ortamda sınır sessizce
// beş katına çıkıyordu (1 Eylül 2026 denetimi, H-B4).
const DEFAULT_MAX_BYTES = 10 * 1024 * 1024; // 10MB

@Injectable()
export class UploadsService implements OnModuleInit {
  private readonly uploadDir: string;
  readonly maxBytes: number;

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    this.uploadDir = configService.get<string>('UPLOAD_DIR', './uploads');
    this.maxBytes = Number(
      configService.get<string>('MAX_UPLOAD_BYTES', String(DEFAULT_MAX_BYTES)),
    );
  }

  async onModuleInit(): Promise<void> {
    await mkdir(this.uploadDir, { recursive: true });
  }

  getUploadDir(): string {
    return this.uploadDir;
  }

  async saveFile(file: Express.Multer.File, userId: string) {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException('UPLOADS.INVALID_FILE_TYPE');
    }
    if (file.size > this.maxBytes) {
      throw new BadRequestException('UPLOADS.FILE_TOO_LARGE');
    }

    const extension = extname(file.originalname).toLowerCase() || '.bin';
    return this.store(file.buffer, {
      extension,
      mimeType: file.mimetype,
      originalName: file.originalname,
      userId,
    });
  }

  /**
   * Adresten indirilmiş görseli kaydeder.
   *
   * İndirme işi `RemoteImageService`te (SSRF savunması orada); burada
   * yalnızca diske yazma ve `MediaAsset` kaydı var. Böylece dosya yükleme ve
   * adresten alma **aynı depolama yolunu** kullanıyor: iki ayrı kayıt biçimi
   * doğmuyor.
   */
  async saveRemoteImage(
    image: { buffer: Buffer; mimeType: string; extension: string; originalName: string },
    userId: string,
  ) {
    if (image.buffer.byteLength > this.maxBytes) {
      throw new BadRequestException('UPLOADS.FILE_TOO_LARGE');
    }
    return this.store(image.buffer, {
      extension: image.extension,
      mimeType: image.mimeType,
      originalName: image.originalName,
      userId,
    });
  }

  private async store(
    buffer: Buffer,
    meta: {
      extension: string;
      mimeType: string;
      originalName: string;
      userId: string;
    },
  ) {
    const filename = `${Date.now()}-${randomBytes(8).toString('hex')}${meta.extension}`;
    await writeFile(join(this.uploadDir, filename), buffer);

    try {
      const asset = await this.prisma.mediaAsset.create({
        data: {
          filename,
          originalName: meta.originalName,
          mimeType: meta.mimeType,
          sizeBytes: buffer.byteLength,
          userId: meta.userId,
        },
      });
      return { id: asset.id, url: `/uploads/${filename}` };
    } catch (error) {
      // DB kaydı başarısızsa diskte artık dosya bırakma
      await unlink(join(this.uploadDir, filename)).catch(() => undefined);
      throw error;
    }
  }
}
