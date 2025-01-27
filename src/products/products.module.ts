import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { productsProviders } from './provider/products.provider';
import { DatabaseModule } from '../config/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '../multer/multer-config.service';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.registerAsync({ useClass: MulterConfigService }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ...productsProviders],
  exports: [ProductsService],
})
export class ProductsModule {}
