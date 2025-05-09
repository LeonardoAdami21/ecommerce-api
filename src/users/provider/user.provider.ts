import { PrismaClient } from '@prisma/client';
import { IProvider } from '../../interface/IProvider';
import { DATA_SOURCE } from 'src/config/data.source';

export const USER__REPOSITORY = 'USER__REPOSITORY';

export const usersProvider: IProvider<PrismaClient['user']>[] = [
  {
    provide: USER__REPOSITORY,
    useFactory: (prisma: PrismaClient) => prisma.user,
    inject: [DATA_SOURCE],
  },
];
