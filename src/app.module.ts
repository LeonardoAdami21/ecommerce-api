import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoConfig from './config/mongo.config';

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRootAsync(mongoConfig)],
})
export class AppModule {}
