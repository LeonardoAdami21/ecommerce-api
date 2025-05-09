import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaConfigModule } from '../config/prisma.config.module';
import { usersProvider } from './provider/user.provider';
import { UserRepository } from './prisma/user.repository';
import { UsersController } from './users.controller';

@Module({
  imports: [PrismaConfigModule],
  controllers: [UsersController],
  providers: [UsersService, ...usersProvider, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
