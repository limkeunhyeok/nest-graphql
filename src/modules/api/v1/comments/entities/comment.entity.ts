import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MongoId } from 'src/@types/datatype';

// Comment는 Post에 nested로 들어가 굳이 따로 저장할 필요는 없으나,
// data loader를 테스트하기 위해 추가
@ObjectType()
@Schema({ timestamps: true, _id: true })
export class Comment {
  @Field(() => String)
  _id: MongoId;

  @Field(() => String)
  @Prop({ text: true })
  contents: string;

  @Field(() => Boolean)
  @Prop()
  published: boolean;

  @Field(() => String)
  @Prop({ required: true, type: Types.ObjectId, ref: 'user' })
  authorId: MongoId;

  @Field(() => String)
  @Prop({ required: true, type: Types.ObjectId, ref: 'post' })
  postId: MongoId;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);
