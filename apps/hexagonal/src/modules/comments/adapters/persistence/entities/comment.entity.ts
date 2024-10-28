import { MongoId } from '@common/core/@types/datatype';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, _id: true })
export class Comment {
  _id: MongoId;

  @Prop({ text: true })
  contents: string;

  @Prop()
  published: boolean;

  @Prop({ required: true, type: Types.ObjectId, ref: 'user' })
  authorId: MongoId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'post' })
  postId: MongoId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);
