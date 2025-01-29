import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import redisClient from '../config/redis.config';
import {
  accessTokenSecret,
  nodeEnv,
  refreshTokenSecret,
} from '../env/envoriment';
import { UserService } from '../users/user.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { JwtPayloadInterface } from '../interfaces/jwt.payload';

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
      secure: nodeEnv === 'production',
      sameSite: 'strict', // prevents CSRF attack, cross-site request forgery attack
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // prevent XSS attacks, cross site scripting attack
      secure: nodeEnv === 'production',
      sameSite: 'strict', // prevents CSRF attack, cross-site request forgery attack
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.fidOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isvalidPassword = await argon2.verify(user.password, password);
    if (!isvalidPassword) {
      throw new BadRequestException('Invalid password');
    }
    return user;
  }

  async register(dto: RegisterAuthDto, res: any) {
    try {
      const { email, password, name } = dto;
      const userExists = await this.userService.findUserByEmail(email);
      if (userExists) {
        throw new ConflictException('Email already exists');
      }
      const user = await this.userService.create({
        name,
        email,
        password,
      });

      const { accessToken, refreshToken } = this.generateTokens(user._id);

      await this.storeRefreshToken(user._id, refreshToken);
      this.setCookies(res, accessToken, refreshToken);

      return res.status(201).json({
        message: 'Register successfully',
        data: user,
      });
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
      const verifyUser = await this.userService.findUserIsActivated(user.id);
      if (!verifyUser) {
        throw new ConflictException('User is not activated');
      }

      const isvalidPassword = await argon2.verify(user.password, password);
      if (!isvalidPassword) {
        throw new BadRequestException('Invalid password');
      }

      const { accessToken, refreshToken } = this.generateTokens(user._id);
      await this.storeRefreshToken(user._id, refreshToken);
      this.setCookies(res, accessToken, refreshToken);
      return res.status(200).json({
        message: 'Login successfully',
        access_token: accessToken,
        refresh_token: refreshToken,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async logout(req: any, res: any) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        const decoded = this.jwtService.verify(refreshToken, {
          secret: refreshTokenSecret,
        });
        await redisClient.del(`refresh_token:${decoded.userId}`);
      }
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(200).json({
        message: 'Logout successfully',
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async usersProfile(id: string) {
    try {
      const user = await this.userService.findUserById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
