// @ts-nocheck
import { Module } from '@nestjs/common';
import { QuestionsService } from './question.service';
import { QuestionsController } from './question.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService, PrismaService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
