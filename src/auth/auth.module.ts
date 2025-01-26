import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  imports: [],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
