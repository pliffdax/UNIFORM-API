import { UserProfile, Prisma, PrismaClient } from '../../generated/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaClient) {}

  async getAllProfiles(): Promise<UserProfile[]> {
    return this.prisma.userProfile.findMany();
  }

  async getProfileById(id: number): Promise<UserProfile> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { id: 'id' },
    });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    return profile;
  }

  async createProfile(
    data: Prisma.UserProfileCreateInput,
  ): Promise<UserProfile> {
    return this.prisma.userProfile.create({
      data,
    });
  }

  async getProfileByUserId(userId: number): Promise<UserProfile> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId: 'userId' },
    });
    if (!profile) {
      throw new NotFoundException(`Profile for User ID ${userId} not found`);
    }
  }

  async updateProfile(
    id: number,
    data: Prisma.UserProfileUpdateInput,
  ): Promise<UserProfile> {
    try {
      return await this.prisma.userProfile.update({
        where: { id: 'id' },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
  }

  async deleteProfile(id: number): Promise<UserProfile> {
    try {
      return await this.prisma.userProfile.delete({
        where: { id: 'id' },
      });
    } catch (error) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
  }
}
