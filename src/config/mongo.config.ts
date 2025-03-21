import { MongooseModule, MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { mongooseUrl } from '../env/envoriment';

const mongoConfig: MongooseModuleAsyncOptions = {
  useFactory: async (): Promise<MongooseModule> => {
    return {
      uri: mongooseUrl,
    };
  },
};

export default mongoConfig;
