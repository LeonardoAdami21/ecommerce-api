import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';

@Module({
  imports: [],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class PrismaConfigModule {}
