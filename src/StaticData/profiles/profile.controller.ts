import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getAllProfiles() {
    return this.profileService.getAllProfiles();
  }

  @Get(':id')
  getProfileById(@Param('id') id: number) {
    return this.profileService.getProfileById(Number(id));
  }

  @Get('user/:userId')
  getProfileByUserId(@Param('userId') userId: number) {
    return this.profileService.getProfileByUserId(Number(userId));
  }

  @Post('update/:id')
  updateProfile(@Param('id') id: number, @Body() updatedProfile: Partial<any>) {
    return this.profileService.updateProfile(Number(id), updatedProfile);
  }

  @Post('delete/:id')
  deleteProfile(@Param('id') id: number) {
    this.profileService.deleteProfile(Number(id));
    return { message: `Profile with ID ${id} deleted successfully` };
  }
}
