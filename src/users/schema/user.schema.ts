import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UseDocument = HydratedDocument<User>;

export enum UserEnumType {
  ADMIN = 'admin',
  USER = 'user',
  CUSTOMER = 'customer',
}

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ min: 11, max: 14, unique: true })
  document: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  recoveryToken?: string;

  @Prop()
  confirmationToken?: string;

  @Prop()
  passwordConfirmation?: string;

  @Prop({
    enum: [UserEnumType.USER, UserEnumType.ADMIN, UserEnumType.CUSTOMER],
  })
  role: string;

  @Prop({ default: Date.now() })
  createdAt?: Date;

  @Prop({ default: Date.now() })
  updatedAt?: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
