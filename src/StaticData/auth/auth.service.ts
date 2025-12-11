import {
  Inject,
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_CORE } from './auth-core.provider';
import {
  AuthCore,
  UserAlreadyExistsError,
  InvalidCredentialsError,
} from 'auth-lib';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_CORE) private readonly core: AuthCore) {}

  async register(data: RegisterDto) {
    try {
      const result = await this.core.register({
        username: data.username || '',
        email: data.email,
        password: data.password,
        isStaff: false,
      });

      return {
        message: 'User registered successfully',
        user: result.user,
        ...result.tokens,
      };
    } catch (e) {
      if (e instanceof UserAlreadyExistsError) {
        throw new ConflictException('User already exists');
      }
      throw e;
    }
  }

  async login(data: LoginDto) {
    try {
      const result = await this.core.login({
        emailOrUsername: data.email,
        password: data.password,
      });

      return {
        message: 'Login successful',
        user: result.user,
        ...result.tokens,
      };
    } catch (e) {
      if (e instanceof InvalidCredentialsError) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw e;
    }
  }
}
