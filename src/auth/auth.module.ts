import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './guards/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    JwtAuthGuard,
    JwtService,
    JwtStrategy,
  ],
  exports: [JwtStrategy, JwtModule, JwtService],
})
export class AuthModule {}
