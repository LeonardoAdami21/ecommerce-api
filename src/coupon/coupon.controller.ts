import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { CouponService } from './coupon.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { Roles } from '../strategy/roles.decorator';
import { UserRole } from '../interfaces/user.role';

@Controller('coupons')
@ApiBearerAuth()
@ApiTags('Coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Get user coupon' })
  @ApiOkResponse({ description: 'Get user coupon' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Get()
  async getCoupon(@Request() req: { user: { _id: string } }) {
    return this.couponService.getCoupon(req.user._id);
  }

  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Validate user coupon' })
  @ApiCreatedResponse({ description: 'Validate user coupon' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('validate')
  async validateCoupon(
    @Request() req: { user: { _id: string } },
    @Body() dto: CreateCouponDto,
  ) {
    return this.couponService.validateCoupon(dto, req.user._id);
  }
}
