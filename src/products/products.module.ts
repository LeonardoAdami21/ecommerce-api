import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { productsProviders } from './provider/products.provider';
import { DatabaseModule } from '../config/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '../multer/multer-config.service';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.registerAsync({ useClass: MulterConfigService }),
    forwardRef(() => UserModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ...productsProviders],
  exports: [ProductsService],
})
export class ProductsModule {}
