import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import redisClient from '../config/redis.config';
import { accessTokenSecret, refreshTokenSecret } from '../env/envoriment';
import { User } from '../users/providers/user.schema';
import { UserService } from '../users/user.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  generateTokens(userId) {
    const accessToken = this.jwtService.sign(
      {
        userId,
      },
      {
        secret: accessTokenSecret,
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwtService.sign(
      { userId },
      {
        secret: refreshTokenSecret,
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  async storeRefreshToken(userId, refreshToken) {
    await redisClient.set(
      `refresh_token:${userId}`,
      refreshToken,
      'EX',
      7 * 24 * 60 * 60,
    ); // 7days
  }

  setCookies(res: any, accessToken, refreshToken) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true, // prevent XSS attacks, cross site scripting attack
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // prevents CSRF attack, cross-site request forgery attack
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // prevent XSS attacks, cross site scripting attack
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // prevents CSRF attack, cross-site request forgery attack
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  async register(dto: RegisterAuthDto) {
    try {
      const { email, password, name } = dto;
      const user = await this.userService.create({
        name,
        email,
        password,
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.userService.fidOneByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(dto: LoginAuthDto, res: any) {
    try {
      const { email, password } = dto;
      const user = await this.userService.fidOneByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const isvalidPassword = await argon2.verify(user.password, password);
      if (!isvalidPassword) {
        throw new BadRequestException('Invalid password');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
