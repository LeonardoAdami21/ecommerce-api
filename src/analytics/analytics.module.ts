import { forwardRef, Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { UserModule } from '../users/user.module';
import { PaymentsModule } from '../payments/payments.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => PaymentsModule),
    forwardRef(() => ProductsModule),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
