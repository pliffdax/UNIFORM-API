import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class FilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationsGateway,
  ) {}

  async persist(files: Express.Multer.File[]) {
    const saved = await Promise.all(
      files.map(async (f) => {
        const url = `/static/${f.filename}`;
        const previewUrl =
          f.mimetype.startsWith('image/') || f.mimetype.startsWith('video/')
            ? url
            : undefined;

        return this.prisma.file.create({
          data: {
            name: f.originalname,
            mimeType: f.mimetype,
            size: f.size,
            url,
            previewUrl,
          },
        });
      }),
    );

    this.gateway.broadcast({ type: 'success', message: 'Новий файл завантажено' });
    return saved;
  }
}
