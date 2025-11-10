import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Prisma, Answer } from '@prisma/client';
import { AnswersService } from './answer.service';

@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Get()
  async getAllAnswers(): Promise<Answer[]> {
    return this.answersService.findAll();
  }

  @Get(':id')
  async getAnswerById(@Param('id') id: string): Promise<Answer> {
    return this.answersService.findOne(Number(id));
  }

  @Post()
  async createAnswer(
    @Body() answerData: Prisma.AnswerCreateInput,
  ): Promise<Answer> {
    return this.answersService.create(answerData);
  }

  @Put(':id')
  async updateAnswer(
    @Param('id') id: string,
    @Body() answerData: Prisma.AnswerUpdateInput,
  ): Promise<Answer> {
    return this.answersService.update(Number(id), answerData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAnswer(@Param('id') id: string): Promise<void> {
    await this.answersService.remove(Number(id));
  }
}
