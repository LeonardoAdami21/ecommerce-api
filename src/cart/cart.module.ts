import { forwardRef, Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { UserModule } from '../users/user.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => ProductsModule)],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
