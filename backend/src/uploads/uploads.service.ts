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
]);

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024; // 10MB (AGENTS.md kural 15)

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

  async saveImage(file: Express.Multer.File, userId: string) {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException('UPLOADS.INVALID_FILE_TYPE');
    }
    if (file.size > this.maxBytes) {
      throw new BadRequestException('UPLOADS.FILE_TOO_LARGE');
    }

    const extension = extname(file.originalname).toLowerCase() || '.bin';
    const filename = `${Date.now()}-${randomBytes(8).toString('hex')}${extension}`;
    await writeFile(join(this.uploadDir, filename), file.buffer);

    try {
      const asset = await this.prisma.mediaAsset.create({
        data: {
          filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          sizeBytes: file.size,
          userId,
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
