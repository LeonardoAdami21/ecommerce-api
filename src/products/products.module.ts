import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaConfigModule } from '../config/prisma.config.module';
import { productsProvider } from './provider/product.provider';
import { ProductRepository } from './prisma/product.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaConfigModule, forwardRef(() => UsersModule)],
  controllers: [ProductsController],
  providers: [ProductsService, ...productsProvider, ProductRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
