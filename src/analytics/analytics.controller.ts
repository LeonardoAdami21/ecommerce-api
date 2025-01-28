import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { Roles } from '../strategy/roles.decorator';
import { UserRole } from '../interfaces/user.role';

@Controller('analytics')
@ApiBearerAuth()
@ApiTags('Analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'startDate', type: Date, required: true })
  @ApiQuery({ name: 'endDate', type: Date, required: true })
  @ApiOperation({ summary: 'Analytics' })
  @ApiOkResponse({ description: 'Analytics All Data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async analytics(@Query() startDate: Date, @Query() endDate: Date) {
    const analyticsData = await this.analyticsService.getAnalyticsData();
    const getEndDate = new Date(endDate);
    const getStartDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dailySalesData = await this.analyticsService.getDailySalesData(
      startDate,
      endDate,
    );
    return {
      analyticsData,
      dailySalesData,
    };
  }
}
