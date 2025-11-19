import { Injectable, NotFoundException } from '@nestjs/common';
import { UserProfile, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getAllProfiles(): Promise<UserProfile[]> {
    return this.prisma.userProfile.findMany();
  }

  async getProfileById(id: string): Promise<UserProfile> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    return profile;
  }

  async getProfileByUserId(userId: string): Promise<UserProfile> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new NotFoundException(`Profile for User ID ${userId} not found`);
    }
    return profile;
  }

  async createProfile(data: CompleteProfileDto) {
    const existing = await this.prisma.userProfile.findUnique({
      where: { userId: data.userId },
    });

    if (existing) {
      throw new ConflictException('Profile already exists');
    }

    return this.prisma.userProfile.create({
      data: {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        group: data.group,
        role: data.role || 2,
        questions: 0,
        answers: 0,
        status: 'active',
      },
      include: { user: true },
    });
  }

  async updateProfile(
    id: string,
    data: Prisma.UserProfileUpdateInput,
  ): Promise<UserProfile> {
    try {
      return await this.prisma.userProfile.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
  }

  async deleteProfile(id: string): Promise<UserProfile> {
    try {
      return await this.prisma.userProfile.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
  }
}
