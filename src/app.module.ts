import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import mongoConfig from './config/mongo.config';

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRootAsync(mongoConfig), UsersModule],
})
export class AppModule {}
