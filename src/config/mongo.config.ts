import mongoose from 'mongoose';
import { DATA_SOURCE } from './datasource.provider';
import { mongoUri } from '../env/envoriment';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      const mongooseConnection = await mongoose.connect(mongoUri);
      return mongooseConnection.connection.host;
    },
  },
];
