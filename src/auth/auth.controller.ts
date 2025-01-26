import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import redisClient from 'src/config/redis.config';
import { JwtService } from '@nestjs/jwt';
import { accessTokenSecret, refreshTokenSecret } from '../env/envoriment';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { IsPublic } from '../interfaces/isPublicKey';

@Controller('auth')
@ApiTags('Authentication and Authorization')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({ description: 'User registered successfully' })
  @ApiConflictResponse({ description: 'Email already exists' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @IsPublic()
  @Post('register')
  async register(@Body() dto: RegisterAuthDto) {
    return await this.authService.register(dto);
  }

  async generateTokens(userId) {
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

  storeRefreshToken = async (userId, refreshToken) => {
    await redisClient.set(
      `refresh_token:${userId}`,
      refreshToken,
      'EX',
      7 * 24 * 60 * 60,
    ); // 7days
  };

  async setCookies(res: any, accessToken, refreshToken) {
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

  @IsPublic()
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiOkResponse({ description: 'Login successfully' })
  @ApiConflictResponse({ description: 'Email already exists' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('login')
  @ApiBody({ type: LoginAuthDto })
  async login(@Body() dto: LoginAuthDto, @Response() res: any) {
    const user = await this.authService.findUserByEmail(dto.email);
    const { accessToken, refreshToken } = await this.generateTokens(user._id);
    await this.storeRefreshToken(user._id, refreshToken);
    this.setCookies(res, accessToken, refreshToken);
    return res.status(HttpStatus.OK).json({
      message: 'Login successfully',
      acess_token: accessToken,
      refresh_token: refreshToken,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
}
