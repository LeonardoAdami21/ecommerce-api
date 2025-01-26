import { Model } from 'mongoose';

export interface IProvider<T> {
  provide: string;
  useFactory: (model: Model<T>) => Model<T>;
  inject: string[];
}
