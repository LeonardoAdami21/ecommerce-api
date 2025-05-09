import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaConfigModule } from '../config/prisma.config.module';
import { PrismaConfigService } from '../config/prisma.config.service';
import { ordersProvider } from './provider/order.provider';
import { OrdersRepository } from './prisma/order.repository';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [PrismaConfigModule, forwardRef(() => ProductsModule)],
  controllers: [OrdersController],
  providers: [OrdersService, ...ordersProvider, OrdersRepository, PrismaConfigService],
  exports: [OrdersService],
})
export class OrdersModule {}
