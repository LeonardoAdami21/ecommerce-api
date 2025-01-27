import { forwardRef, Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { DatabaseModule } from '../config/database.module';
import { couponProviders } from './providers/coupon.provider';
import { UserModule } from '../users/user.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => UserModule)],
  controllers: [CouponController],
  providers: [CouponService, ...couponProviders],
})
export class CouponModule {}
