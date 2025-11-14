// @ts-nocheck
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { QuestionsService } from './question.service';
import { Question, Prisma } from '@prisma/client';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  async getAllQuestions(): Promise<Question[]> {
    return this.questionsService.findAll();
  }

  @Get(':id')
  async getQuestionById(@Param('id') id: string): Promise<Question> {
    return this.questionsService.findOne(Number(id));
  }

  @Post()
  async createQuestion(
    @Body() question: Prisma.QuestionCreateInput,
  ): Promise<Question> {
    return this.questionsService.create(question);
  }

  @Put(':id')
  async updateQuestion(
    @Param('id') id: string,
    @Body() question: Partial<Question>,
  ): Promise<Question> {
    return this.questionsService.update(Number(id), question);
  }

  @Delete(':id')
  async deleteQuestion(@Param('id') id: string): Promise<Question> {
    return this.questionsService.remove(Number(id));
  }
}
