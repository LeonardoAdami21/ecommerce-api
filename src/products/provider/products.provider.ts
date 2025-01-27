import { IProvider } from '../../interfaces/IProvider';
import { DATA_SOURCE } from '../../config/datasource.provider';
import { Connection } from 'mongoose';
import { PRODUCT_MODEL } from './model.provider';
import { Product, ProductSchema } from '../model/product.model';

export const productsProviders: IProvider<Product>[] = [
  {
    provide: PRODUCT_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Product', ProductSchema),
    inject: [DATA_SOURCE],
  },
];
