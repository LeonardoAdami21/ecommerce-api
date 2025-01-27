import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Response,
  UseGuards
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import redisClient from '../config/redis.config';
import { accessTokenSecret, refreshTokenSecret } from '../env/envoriment';
import { IsPublic } from '../interfaces/isPublicKey';
import { RequestUser } from '../interfaces/request.user';
import { UserRole } from '../interfaces/user.role';
import { UserAuthGuard } from '../jwt/user-auth.guard';
import { Roles } from '../strategy/roles.decorator';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller('auth')
@ApiTags('Authentication and Authorization')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ description: 'User registered successfully' })
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
  async login(@Body() dto: LoginAuthDto) {
    return await this.authService.login(dto);
  }

  @IsPublic()
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout ' })
  @ApiOkResponse({ description: 'Logout successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('logout')
  async logout(@Request() req: any, @Response() res: any) {
    return await this.authService.logout(req, res);
  }

  @IsPublic()
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh token' })
  @ApiOkResponse({ description: 'Refresh token successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('refresh-token')
  async refreshToken(@Request() req: any, @Response() res: any) {
    return await this.authService.refreshToken(req, res);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({ description: 'Get user profile successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('profile')
  async profile(@Req() req: {user: {id: string}}) {
    return await this.authService.usersProfile(req.user.id);
  }
}
