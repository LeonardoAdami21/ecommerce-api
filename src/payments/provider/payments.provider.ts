import { IProvider } from '../../interfaces/IProvider';
import { DATA_SOURCE } from '../../config/datasource.provider';
import { Connection } from 'mongoose';
import { PAYMENT_MODEL } from './model.provider';
import { Payment, PaymentSchema } from '../model/payment.model';

export const paymentProviders: IProvider<Payment>[] = [
  {
    provide: PAYMENT_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Payment', PaymentSchema),
    inject: [DATA_SOURCE],
  },
];
