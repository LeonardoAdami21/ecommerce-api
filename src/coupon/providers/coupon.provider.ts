import { IProvider } from '../../interfaces/IProvider';
import { DATA_SOURCE } from '../../config/datasource.provider';
import { Connection } from 'mongoose';
import { COUPON_MODEL } from './model.provider';
import { Coupon, CouponSchema } from '../model/coupon.model';

export const couponProviders: IProvider<Coupon>[] = [
  {
    provide: COUPON_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Coupon', CouponSchema),
    inject: [DATA_SOURCE],
  },
];
