import { PrismaClient } from '@prisma/client';

export interface IProvider<T> {
  provide: string;
  useFactory: (prisma: PrismaClient) => T;
  inject: string[];
}
