import { MongoId } from '@common/core/@types/datatype';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, _id: true })
export class Post {
  _id: MongoId;

  @Prop()
  title: string;

  @Prop({ text: true })
  contents: string;

  @Prop()
  published: boolean;

  @Prop({ required: true, type: Types.ObjectId, ref: 'users' })
  authorId: MongoId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
