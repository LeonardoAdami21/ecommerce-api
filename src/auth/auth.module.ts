import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { JwtStrategy } from '../strategy/jwt.strategy';
import { UserStrategy } from '../strategy/user.strategy';
import { LocalStrategy } from '../strategy/local.strayegy';
import { LocalAuthGuard } from '../jwt/local-auth.guard';

@Module({
  controllers: [AuthController],
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [
    AuthService,
    JwtService,
    JwtStrategy,
    UserStrategy,
    LocalStrategy,
    LocalAuthGuard,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService, JwtService, JwtStrategy, LocalAuthGuard, UserStrategy],
})
export class AuthModule {}
