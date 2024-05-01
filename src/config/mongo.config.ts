import {  MongooseModuleAsyncOptions, MongooseModuleOptions } from '@nestjs/mongoose';

const mongoConfig: MongooseModuleAsyncOptions = {
  useFactory: async (): Promise<MongooseModuleOptions> => {
    return {
      uri: process.env.MONGO_URL,
    };
  },
};

export default mongoConfig;
