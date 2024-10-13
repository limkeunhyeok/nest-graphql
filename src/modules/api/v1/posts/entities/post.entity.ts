import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';

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

  // comments 필드는 동적으로 가져오는 필드로 설정
  @Field(() => [Comment], { nullable: true })
  comments?: Comment[]; // 실제 DB에는 저장되지 않음

  // author 필드는 동적으로 가져오는 필드로 설정
  @Field(() => User, { nullable: true })
  author?: User; // 실제 DB에는 저장되지 않음

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
