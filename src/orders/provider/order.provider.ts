import { PrismaClient } from '@prisma/client';
import { IProvider } from '../../interface/IProvider';
import { DATA_SOURCE } from 'src/config/data.source';

export const ORDER__REPOSITORY = 'ORDER__REPOSITORY';

export const ordersProvider: IProvider<PrismaClient['order']>[] = [
  {
    provide: ORDER__REPOSITORY,
    useFactory: (prisma: PrismaClient) => prisma.order,
    inject: [DATA_SOURCE],
  },
];
