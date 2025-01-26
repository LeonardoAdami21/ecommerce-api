import { Module } from '@nestjs/common';
import { usersProviders } from './providers/users.provider';
import { DatabaseModule } from '../config/database.module';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule],
  providers: [...usersProviders, UserService],
  exports: [UserService],
})
export class UserModule {}
