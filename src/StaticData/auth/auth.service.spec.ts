import { Test, type TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AUTH_CORE } from './auth-core.provider';

import type { AuthCore } from 'auth-lib';
import { InvalidCredentialsError, UserAlreadyExistsError } from 'auth-lib';

type AuthCoreFacade = Pick<AuthCore, 'register' | 'login'>;

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService: Partial<PrismaService> = {};
  const mockJwtService: Partial<JwtService> = {};

  let mockAuthCore: jest.Mocked<AuthCoreFacade>;

  beforeEach(async () => {
    mockAuthCore = {
      register: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AUTH_CORE, useValue: mockAuthCore },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should return message + user + tokens (flattened)', async () => {
      const registerDto = {
        email: 'test@test.com',
        password: '123456',
        username: 'test_123',
      };

      mockAuthCore.register.mockResolvedValue({
        user: {
          id: '1',
          email: registerDto.email,
          username: registerDto.username,
          isStaff: false,
        },
        tokens: {
          accessToken: 'access',
          refreshToken: 'refresh',
        },
      });

      const result = await service.register(registerDto);

      expect(result).toEqual({
        message: 'User registered successfully',
        user: {
          id: '1',
          email: registerDto.email,
          username: registerDto.username,
          isStaff: false,
        },
        accessToken: 'access',
        refreshToken: 'refresh',
      });

      expect(mockAuthCore.register).toHaveBeenCalledTimes(1);
      expect(mockAuthCore.register).toHaveBeenCalledWith({
        username: registerDto.username,
        email: registerDto.email,
        password: registerDto.password,
        isStaff: false,
      });
    });

    it('should throw ConflictException if core throws UserAlreadyExistsError', async () => {
      const registerDto = {
        email: 'test@test.com',
        password: '123456',
        username: 'test_123',
      };

      mockAuthCore.register.mockRejectedValue(new UserAlreadyExistsError());

      await expect(service.register(registerDto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should return message + user + tokens (flattened)', async () => {
      const loginDto = { email: 'test@test.com', password: '123456' };

      mockAuthCore.login.mockResolvedValue({
        user: {
          id: '1',
          email: loginDto.email,
          username: 'test_123',
          isStaff: false,
        },
        tokens: {
          accessToken: 'access',
          refreshToken: 'refresh',
        },
      });

      const result = await service.login(loginDto);

      expect(result).toEqual({
        message: 'Login successful',
        user: {
          id: '1',
          email: loginDto.email,
          username: 'test_123',
          isStaff: false,
        },
        accessToken: 'access',
        refreshToken: 'refresh',
      });

      expect(mockAuthCore.login).toHaveBeenCalledTimes(1);
      expect(mockAuthCore.login).toHaveBeenCalledWith({
        emailOrUsername: loginDto.email,
        password: loginDto.password,
      });
    });

    it('should throw UnauthorizedException if core throws InvalidCredentialsError', async () => {
      const loginDto = { email: 'wrong@test.com', password: '123456' };

      mockAuthCore.login.mockRejectedValue(new InvalidCredentialsError());

      await expect(service.login(loginDto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });
});
