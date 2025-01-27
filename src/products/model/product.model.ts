import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0, type: Number })
  price: number;

  @Prop({ required: true })
  file: string;

  @Prop({ required: true })
  category: string;

  @Prop({ default: false })
  isFeatured: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);