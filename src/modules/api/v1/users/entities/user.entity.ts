import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { Role } from 'src/constants/role.const';
import { Post } from '../../posts/entities/post.entity';

@ObjectType()
@Schema({ timestamps: true, _id: true })
export class User {
  @Field(() => String)
  _id: MongoId;

  @Field(() => String)
  @Prop({ unique: true })
  email: string;

  @Field(() => String)
  @Prop()
  name: string;

  @Prop()
  password: string;

  @Field(() => [Post], { nullable: true })
  posts: Post[]; // 실제 DB에는 저장되지 않음

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Role, { defaultValue: Role.MEMBER })
  @Prop({ type: String, enum: Role, default: Role.MEMBER })
  role: Role;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
