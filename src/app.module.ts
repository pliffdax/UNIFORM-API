import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './StaticData/users/users.module';
import { ProfileModule } from './StaticData/profiles/profile.module';
import { CategoriesModule } from '@/StaticData/categories/categories.module';
import { RolesModule } from '@/StaticData/roles/roles.module';

@Module({
  imports: [UsersModule, ProfileModule, RolesModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
