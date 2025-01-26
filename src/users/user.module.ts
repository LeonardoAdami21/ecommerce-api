import { Module } from '@nestjs/common';
import { usersProviders } from './providers/users.provider';
import { DatabaseModule } from '../config/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...usersProviders],
  exports: [],
})
export class UserModule {}
