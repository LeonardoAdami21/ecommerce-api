import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterAuthDto } from './dto/register.auth-dto';
import { Public } from '../decorators/public.decorator';
import { LoginAuthDto } from './dto/login.auth-dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('v2/auth')
@ApiTags('Authentication and Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Register new user' })
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while creating the user',
  })
  @Post('/register')
  register(@Body() dto: RegisterAuthDto) {
    return this.authService.register(dto);
  }

  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({ description: 'User login successfully' })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while login the user',
  })
  @Post('/login')
  login(@Body() dto: LoginAuthDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiOkResponse({ description: 'Logout successfully' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while logout',
  })
  @HttpCode(200)
  @Post('/logout')
  async logout() {
    return {
      message: 'User logout successfully',
    };
  }
}
