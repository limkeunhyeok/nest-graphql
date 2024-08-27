import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MongoId } from 'src/@types/datatype';

@ObjectType()
@Schema({ timestamps: true, _id: true })
export class Post {
  @Field(() => String)
  _id: MongoId;

  @Field(() => String)
  @Prop()
  title: string;

  @Field(() => String)
  @Prop({ text: true })
  contents: string;

  @Field(() => Boolean)
  @Prop()
  published: boolean;

  @Field(() => String)
  @Prop({ required: true, type: Types.ObjectId, ref: 'user' })
  authorId: MongoId;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
