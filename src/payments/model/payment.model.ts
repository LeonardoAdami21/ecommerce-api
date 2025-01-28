import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export class Product {
  @Prop({
    required: true,
    type: Number,
  })
  quantity: number;

  @Prop({
    required: true,
    type: Number,
  })
  price: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  })
  productId: string;
}

export type PaymentDocument = Payment & Document;
@Schema({ timestamps: true })
export class Payment {
  @Prop({
    required: true,
    unique: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: string;

  @Prop({
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  })
  products: Product[];

  @Prop({ required: true, min: 0, type: Number })
  totalAmount: number;

  @Prop({ required: true, unique: true })
  stripeSessionId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);