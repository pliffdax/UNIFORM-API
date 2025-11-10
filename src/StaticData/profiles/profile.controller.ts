import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Prisma } from '@prisma/client';

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

  @Post('create')
  createProfile(@Body() newProfile: Prisma.UserProfileCreateInput) {
    return this.profileService.createProfile(newProfile);
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
