import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './StaticData/users/users.module';
import { ProfileModule } from './StaticData/profiles/profile.module';
import { CategoriesModule } from '@/StaticData/categories/categories.module';
import { RolesModule } from '@/StaticData/roles/roles.module';
import { QuestionsModule } from '@/StaticData/question/question.module';
import { AnswersModule } from '@/StaticData/answer/answer.module';
import { FacultiesModule } from '@/StaticData/faculties/faculties.module';
import { AuthModule } from '@/StaticData/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProfileModule,
    RolesModule,
    CategoriesModule,
    QuestionsModule,
    AnswersModule,
    FacultiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
