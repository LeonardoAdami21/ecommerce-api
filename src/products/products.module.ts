import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaConfigModule } from 'src/config/prisma.config.module';
import { productsProvider } from './provider/product.provider';
import { ProductRepository } from './prisma/product.repository';

@Module({
  imports: [PrismaConfigModule],
  controllers: [ProductsController],
  providers: [ProductsService, ...productsProvider, ProductRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
