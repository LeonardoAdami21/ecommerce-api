import { IProvider } from '../../interfaces/IProvider';
import { DATA_SOURCE } from '../../config/datasource.provider';
import { USER_MODEL } from './model.provider';
import { User, userSchema } from './user.schema';
import { Connection } from 'mongoose';

export const usersProviders: IProvider<User>[] = [
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('User', userSchema),
    inject: [DATA_SOURCE],
  },
];
