import { Module } from '@nestjs/common';
import { FacultiesController } from './faculties.controller';
import { FacultiesService } from './faculties.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [FacultiesController],
  providers: [FacultiesService, PrismaService],
  exports: [FacultiesService]
})
export class FacultiesModule {}
