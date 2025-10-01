import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  providers: [ProfileService],
  controllers: [ProfileController, PrismaService],
  exports: [ProfileService],
})
export class ProfileModule {}
