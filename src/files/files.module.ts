import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Module({
  controllers: [FilesController],
  providers: [FilesService, PrismaService, NotificationsGateway],
  exports: [FilesService],
})
export class FilesModule {}
