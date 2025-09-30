import { UserProfile } from './profile.interface';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProfileService {
  private profiles: UserProfile[] = [
    {
      id: 1,
      userId: 1,
      username: 'alice',
      email: 'alice@gmail.com',
      firstname: 'Alice',
      surname: 'Smith',
      role: 2,
      group: 'IO-35',
      faculty: 1,
      questions: 5,
      answers: 10,
      avatar_url: 'http://example.com/avatar1.png',
      status: 'active',
      socialLinks: 'http://linkedin.com/in/alice',
      created_at: '2023-10-01T10:00:00Z',
      updated_at: '2023-10-01T10:00:00Z',
    },
  ];

  getAllProfiles(): UserProfile[] {
    return this.profiles;
  }

  getProfileById(id: number): UserProfile {
    const profile = this.profiles.find((p) => p.id === id);
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  getProfileByUserId(userId: number): UserProfile {
    const profile = this.profiles.find((p) => p.userId === userId);
    if (!profile) {
      throw new NotFoundException(`Profile for user ID ${userId} not found`);
    }
    return profile;
  }

  updateProfile(id: number, updatedProfile: Partial<UserProfile>): UserProfile {
    const profileIndex = this.profiles.findIndex((p) => p.id === id);
    if (profileIndex === -1) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    this.profiles[profileIndex] = {
      ...this.profiles[profileIndex],
      ...updatedProfile,
      updated_at: new Date().toISOString(),
    };
    return this.profiles[profileIndex];
  }

  deleteProfile(id: number): void {
    const profileIndex = this.profiles.findIndex((p) => p.id === id);
    if (profileIndex === -1) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    this.profiles.splice(profileIndex, 1);
  }
}
