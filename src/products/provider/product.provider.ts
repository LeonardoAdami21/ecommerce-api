import { PrismaClient } from '@prisma/client';
import { IProvider } from '../../interface/IProvider';
import { DATA_SOURCE } from '../../config/data.source';

export const PRODUCT__REPOSITORY = 'PRODUCT__REPOSITORY';

export const productsProvider: IProvider<PrismaClient['product']>[] = [
  {
    provide: PRODUCT__REPOSITORY,
    useFactory: (prisma: PrismaClient) => prisma.product,
    inject: [DATA_SOURCE],
  },
];
