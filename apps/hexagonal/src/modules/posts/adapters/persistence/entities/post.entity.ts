import { MongoId } from '@common/core/@types/datatype';
import { Role } from '@common/core/constants/role.const';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class ArrayOfObject {
  @Prop()
  field1: string;

  @Prop()
  field2: number;

  @Prop()
  field3: Boolean;
}

@Schema({ _id: false })
export class ObjectField {
  @Prop()
  field4: string;

  @Prop()
  field5: number;

  @Prop()
  field6: Boolean;
}

@Schema({ timestamps: true, _id: true })
export class Post {
  _id: MongoId;

  @Prop({ isRequired: true })
  title: string;

  @Prop({ text: true, isRequired: true })
  contents: string;

  @Prop()
  published: boolean;

  @Prop({ required: true, type: Types.ObjectId, ref: 'users' })
  authorId: MongoId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  // TEST 용 Array
  @Prop({ type: [ArrayOfObject] })
  arrayOfObject: ArrayOfObject[];

  // TEST 용 Array
  @Prop({ type: [String] })
  arrayOfString: string[];

  // TEST 용 Array
  @Prop({ type: [String], enum: Role })
  arrayOfEnum: Role[];

  // TEST 용 Embeded
  @Prop({ type: ObjectField })
  objectField: ObjectField;
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
