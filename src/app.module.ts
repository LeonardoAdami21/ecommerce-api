import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
  ],
  providers: [
    JwtService,
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
