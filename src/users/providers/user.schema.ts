import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User> & Document;

export class CartItem {
  @Prop({ type: Number, default: 1 })
  quantity: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  product: Types.ObjectId;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: false })
  refreshToken?: string;

  @Prop({
    type: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      },
    ],
    default: [],
  })
  cartItems?: CartItem[];
}

export const userSchema = SchemaFactory.createForClass(User);
