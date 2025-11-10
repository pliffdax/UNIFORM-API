import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(data: RegisterDto) {
    // Проверка существования
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existing) {
      throw new ConflictException('User already exists');
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Создаём user + profile
    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        isStaff: false,
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role || 2, // дефолтная роль студента
            group: data.group,
            faculty: data.faculty,
            questions: 0,
            answers: 0,
            status: 'active',
          },
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        isStaff: true,
        profile: true,
        // НЕ включаем password в ответ!
      },
    });

    return {
      message: 'User registered successfully',
      user,
    };
  }

  async login(data: LoginDto) {
    // Найти user
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Проверить пароль
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Здесь можно генерировать JWT токен
    // Пока просто возвращаем user без пароля
    const { password, ...userWithoutPassword } = user;

    return {
      message: 'Login successful',
      user: userWithoutPassword,
    };
  }
}
