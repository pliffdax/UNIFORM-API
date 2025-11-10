import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Твои модули со статикой
import { UsersModule } from './StaticData/users/users.module';
import { ProfileModule } from './StaticData/profiles/profile.module';
import { CategoriesModule } from '@/StaticData/categories/categories.module';
import { RolesModule } from '@/StaticData/roles/roles.module';
import { FacultiesModule } from '@/StaticData/faculties/faculties.module';

// Новые модули для функционала загрузки и уведомлений
import { FilesModule } from './files/files.module';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    UsersModule,
    ProfileModule,
    RolesModule,
    CategoriesModule,
    FacultiesModule,
    FilesModule, // <- важно
  ],
  controllers: [AppController],
  providers: [
    AppService,
    NotificationsGateway, // <- для WS /notifications
    PrismaService, // <- Prisma клиент как провайдер
  ],
})
export class AppModule {}
