import { Model } from 'mongoose';

export interface IProvider<T> {
  provide: string;
  useFactory: (...args: any[]) => Model<T>;
  inject: string[];
}
