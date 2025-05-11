import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Request } from 'express';

@Controller('v2/users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({ description: 'Returns user profile' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async me(@Req() req: Request) {
    return this.usersService.me(req.user.id);
  }
}
