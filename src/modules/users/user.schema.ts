import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class User {
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop()
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
