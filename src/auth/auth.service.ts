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
import { accessTokenSecret, refreshTokenSecret } from '../env/envoriment';
import { User } from '../users/providers/user.schema';
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

  async login(dto: LoginAuthDto) {
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
      
      const payload: JwtPayloadInterface = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,

      }

      const refreshToken = this.jwtService.sign(payload, {
        secret: refreshTokenSecret,
        expiresIn: '7d',
      })

      const accessToken = this.jwtService.sign(payload, {
        secret: accessTokenSecret,
        expiresIn: '15m',
      })

      await this.storeRefreshToken(user.id, refreshToken);
      return{
        message: 'Login successfully',
        access_token: accessToken,
        refresh_token: refreshToken,
        data: user
      }

    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async logout(req: any, res: any) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        const decoded = this.jwtService.verify(refreshToken, {
          secret: refreshTokenSecret,
        });
        await redisClient.del(`refresh_token:${decoded.userId}`);
      }
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return {
        message: 'Logout successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async refreshToken(req: any, res: any) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
      }

      const decoded = this.jwtService.verify(refreshToken, {
        secret: refreshTokenSecret,
      });
      const storedToken = await redisClient.get(
        `refresh_token:${decoded.userId}`,
      );

      if (storedToken !== refreshToken) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }

      const accessToken = this.jwtService.sign(
        { userId: decoded.userId },
        { secret: accessTokenSecret, expiresIn: '15m' },
      );

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });
      return {
        message: 'Refresh token successfully',
        access_token: accessToken,
        refresh_token: refreshToken,
      };
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
