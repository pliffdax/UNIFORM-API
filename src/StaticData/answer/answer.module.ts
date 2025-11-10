import { Module } from '@nestjs/common';
import { AnswersService } from './answer.service';
import { AnswersController } from './answer.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [AnswersController],
  providers: [AnswersService, PrismaService],
  exports: [AnswersService],
})
export class AnswersModule {}
