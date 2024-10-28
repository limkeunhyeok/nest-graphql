import { MongoId } from '@common/core/@types/datatype';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  _id: MongoId;

  @Field(() => String)
  name: string;

  @Field(() => String)
  password: string;
}
