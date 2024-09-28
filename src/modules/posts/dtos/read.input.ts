import { Field, InputType } from '@nestjs/graphql';
import { MongoId } from 'src/@types/datatype';

@InputType()
export class ReadPostInput {
  @Field(() => String, { nullable: true })
  _id?: MongoId;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Boolean, { nullable: true })
  published?: boolean;

  @Field(() => String, { nullable: true })
  authorId?: MongoId;
}
