import { Module } from '@nestjs/common';
import { databaseProviders } from './mongo.config';

@Module({
  imports: [],
  exports: [...databaseProviders],
  providers: [...databaseProviders],
})
export class DatabaseModule {}
