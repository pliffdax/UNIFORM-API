import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Prisma, UserProfile } from '@prisma/client';
import { CompleteProfileDto } from './dto/complete-profile.dto';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getAllProfiles() {
    return this.profileService.getAllProfiles();
  }

  @Get(':id')
  getProfileById(@Param('id') id: string) {
    return this.profileService.getProfileById(id);
  }

  @Get('user/:userId')
  getProfileByUserId(@Param('userId') userId: string) {
    return this.profileService.getProfileByUserId(userId);
  }

  @Post('complete')
  async completeProfile(@Body() data: CompleteProfileDto) {
    return this.profileService.createProfile(data);
  }

  @Post('create')
  async createProfile(data: CompleteProfileDto): Promise<UserProfile> {
    return this.profileService.createProfile(data);
  }

  @Post('update/:id')
  updateProfile(
    @Param('id') id: string,
    @Body() updatedProfile: Prisma.UserProfileUpdateInput,
  ) {
    return this.profileService.updateProfile(id, updatedProfile);
  }

  @Post('delete/:id')
  deleteProfile(@Param('id') id: string) {
    this.profileService.deleteProfile(id);
    return { message: `Profile with ID ${id} deleted successfully` };
  }
}
