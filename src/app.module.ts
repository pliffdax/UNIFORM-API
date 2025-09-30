import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './StaticData/users/users.module';
import { ProfileModule } from './StaticData/profiles/profile.module';

@Module({
  imports: [UsersModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
