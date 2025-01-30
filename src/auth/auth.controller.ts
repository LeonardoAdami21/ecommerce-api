import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Request,
  Response,
  UseGuards,
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
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import redisClient from '../config/redis.config';
import {
  accessTokenSecret,
  nodeEnv,
  refreshTokenSecret,
} from '../env/envoriment';
import { IsPublic } from '../interfaces/isPublicKey';
import { UserRole } from '../interfaces/user.role';
import { Roles } from '../strategy/roles.decorator';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { UserAuthGuard } from 'src/jwt/user-auth.guard';
import { RolesGuard } from 'src/jwt/roles.guard';
import { RequestUser } from 'src/interfaces/request.user';

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
  register(@Body() dto: RegisterAuthDto, @Response() res: any) {
    return this.authService.register(dto, res);
  }

  async generateTokens(userId, name, email, role) {
    const accessToken = this.jwtService.sign(
      {
        userId,
        name,
        email,
        role,
      },
      {
        secret: accessTokenSecret,
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwtService.sign(
      { userId, name, email, role },
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
  @HttpCode(200)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiOkResponse({ description: 'Login successfully' })
  @ApiConflictResponse({ description: 'Email already exists' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('login')
  @ApiBody({ type: LoginAuthDto })
  async login(@Body() dto: LoginAuthDto, @Response() res: any) {
    return await this.authService.login(dto, res);
  }

  @IsPublic()
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout ' })
  @ApiOkResponse({ description: 'Logout successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('logout')
  async logout(@Request() req: any, @Response() res: any) {
    return this.authService.logout(req, res);
  }

  @IsPublic()
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh token' })
  @ApiOkResponse({ description: 'Refresh token successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('refresh-token')
  async refreshToken(@Request() req: any, @Response() res: any) {
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
      secure: nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ message: 'Token refreshed successfully' });
  }

  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ description: 'Get user profile successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Get('profile')
  profile(@Request() req: RequestUser) {
    return req.user;
  }
}
