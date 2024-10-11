import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { Role } from '../../../../constants/role.const';

@Schema({ timestamps: true, _id: true })
export class User {
  _id: MongoId;

  @Prop({ unique: true })
  email: string;

  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop({ type: String, enum: Role, default: Role.MEMBER })
  role: Role;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);