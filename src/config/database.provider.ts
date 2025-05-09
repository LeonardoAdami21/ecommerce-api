import { PrismaClient } from '@prisma/client';
import { DATA_SOURCE } from './data.source';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      const prisma = new PrismaClient();
      await prisma.$connect();
      return prisma;
    },
  },
];
