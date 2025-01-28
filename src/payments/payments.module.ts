import { forwardRef, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { paymentProviders } from './provider/payments.provider';
import { DatabaseModule } from '../config/database.module';
import { UserModule } from '../users/user.module';
import { CouponModule } from '../coupon/coupon.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => UserModule),
    forwardRef(() => CouponModule),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, ...paymentProviders],
  exports: [PaymentsService],
})
export class PaymentsModule {}
