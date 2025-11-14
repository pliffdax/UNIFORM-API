// @ts-nocheck
function stryNS_9fa48() {
  var g =
    (typeof globalThis === 'object' &&
      globalThis &&
      globalThis.Math === Math &&
      globalThis) ||
    new Function('return this')();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (
    ns.activeMutant === undefined &&
    g.process &&
    g.process.env &&
    g.process.env.__STRYKER_ACTIVE_MUTANT__
  ) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov =
    ns.mutantCoverage ||
    (ns.mutantCoverage = {
      static: {},
      perTest: {},
    });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error(
          'Stryker: Hit count limit reached (' + ns.hitCount + ')',
        );
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  private generateTokens(userId: string, email: string) {
    if (stryMutAct_9fa48('2')) {
      {
      }
    } else {
      stryCov_9fa48('2');
      const payload = stryMutAct_9fa48('3')
        ? {}
        : (stryCov_9fa48('3'),
          {
            sub: userId,
            email,
          });
      return stryMutAct_9fa48('4')
        ? {}
        : (stryCov_9fa48('4'),
          {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(
              payload,
              stryMutAct_9fa48('5')
                ? {}
                : (stryCov_9fa48('5'),
                  {
                    expiresIn: stryMutAct_9fa48('6')
                      ? ''
                      : (stryCov_9fa48('6'), '30d'),
                  }),
            ),
          });
    }
  }
  async register(data: RegisterDto) {
    if (stryMutAct_9fa48('7')) {
      {
      }
    } else {
      stryCov_9fa48('7');
      const existing = await this.prisma.user.findFirst(
        stryMutAct_9fa48('8')
          ? {}
          : (stryCov_9fa48('8'),
            {
              where: stryMutAct_9fa48('9')
                ? {}
                : (stryCov_9fa48('9'),
                  {
                    OR: stryMutAct_9fa48('10')
                      ? []
                      : (stryCov_9fa48('10'),
                        [
                          stryMutAct_9fa48('11')
                            ? {}
                            : (stryCov_9fa48('11'),
                              {
                                email: data.email,
                              }),
                          stryMutAct_9fa48('12')
                            ? {}
                            : (stryCov_9fa48('12'),
                              {
                                username: data.username,
                              }),
                        ]),
                  }),
            }),
      );
      if (
        stryMutAct_9fa48('14')
          ? false
          : stryMutAct_9fa48('13')
            ? true
            : (stryCov_9fa48('13', '14'), existing)
      ) {
        if (stryMutAct_9fa48('15')) {
          {
          }
        } else {
          stryCov_9fa48('15');
          throw new ConflictException(
            stryMutAct_9fa48('16')
              ? ''
              : (stryCov_9fa48('16'), 'User already exists'),
          );
        }
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await this.prisma.user.create(
        stryMutAct_9fa48('17')
          ? {}
          : (stryCov_9fa48('17'),
            {
              data: stryMutAct_9fa48('18')
                ? {}
                : (stryCov_9fa48('18'),
                  {
                    username: stryMutAct_9fa48('21')
                      ? data.username && ''
                      : stryMutAct_9fa48('20')
                        ? false
                        : stryMutAct_9fa48('19')
                          ? true
                          : (stryCov_9fa48('19', '20', '21'),
                            data.username ||
                              (stryMutAct_9fa48('22')
                                ? 'Stryker was here!'
                                : (stryCov_9fa48('22'), ''))),
                    email: data.email,
                    password: hashedPassword,
                    isStaff: stryMutAct_9fa48('23')
                      ? true
                      : (stryCov_9fa48('23'), false),
                  }),
              select: stryMutAct_9fa48('24')
                ? {}
                : (stryCov_9fa48('24'),
                  {
                    id: stryMutAct_9fa48('25')
                      ? false
                      : (stryCov_9fa48('25'), true),
                    username: stryMutAct_9fa48('26')
                      ? false
                      : (stryCov_9fa48('26'), true),
                    email: stryMutAct_9fa48('27')
                      ? false
                      : (stryCov_9fa48('27'), true),
                    isStaff: stryMutAct_9fa48('28')
                      ? false
                      : (stryCov_9fa48('28'), true),
                    profile: stryMutAct_9fa48('29')
                      ? false
                      : (stryCov_9fa48('29'), true),
                  }),
            }),
      );
      const tokens = this.generateTokens(user.id, user.email);
      return stryMutAct_9fa48('30')
        ? {}
        : (stryCov_9fa48('30'),
          {
            message: stryMutAct_9fa48('31')
              ? ''
              : (stryCov_9fa48('31'), 'User registered successfully'),
            user,
            ...tokens,
          });
    }
  }
  async login(data: LoginDto) {
    if (stryMutAct_9fa48('32')) {
      {
      }
    } else {
      stryCov_9fa48('32');
      const user = await this.prisma.user.findUnique(
        stryMutAct_9fa48('33')
          ? {}
          : (stryCov_9fa48('33'),
            {
              where: stryMutAct_9fa48('34')
                ? {}
                : (stryCov_9fa48('34'),
                  {
                    email: data.email,
                  }),
              include: stryMutAct_9fa48('35')
                ? {}
                : (stryCov_9fa48('35'),
                  {
                    profile: stryMutAct_9fa48('36')
                      ? false
                      : (stryCov_9fa48('36'), true),
                  }),
            }),
      );
      if (
        stryMutAct_9fa48('39')
          ? false
          : stryMutAct_9fa48('38')
            ? true
            : stryMutAct_9fa48('37')
              ? user
              : (stryCov_9fa48('37', '38', '39'), !user)
      ) {
        if (stryMutAct_9fa48('40')) {
          {
          }
        } else {
          stryCov_9fa48('40');
          throw new UnauthorizedException(
            stryMutAct_9fa48('41')
              ? ''
              : (stryCov_9fa48('41'), 'Invalid credentials'),
          );
        }
      }
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password,
      );
      if (
        stryMutAct_9fa48('44')
          ? false
          : stryMutAct_9fa48('43')
            ? true
            : stryMutAct_9fa48('42')
              ? isPasswordValid
              : (stryCov_9fa48('42', '43', '44'), !isPasswordValid)
      ) {
        if (stryMutAct_9fa48('45')) {
          {
          }
        } else {
          stryCov_9fa48('45');
          throw new UnauthorizedException(
            stryMutAct_9fa48('46')
              ? ''
              : (stryCov_9fa48('46'), 'Invalid credentials'),
          );
        }
      }
      const { password, ...userWithoutPassword } = user;
      const tokens = this.generateTokens(user.id, user.email);
      return stryMutAct_9fa48('47')
        ? {}
        : (stryCov_9fa48('47'),
          {
            message: stryMutAct_9fa48('48')
              ? ''
              : (stryCov_9fa48('48'), 'Login successful'),
            user: userWithoutPassword,
            ...tokens,
          });
    }
  }
}
