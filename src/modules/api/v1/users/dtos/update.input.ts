import { Field, InputType } from '@nestjs/graphql';
import { MongoId } from 'src/@types/datatype';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  _id: MongoId;

  @Field(() => String)
  name: string;

  @Field(() => String)
  password: string;
}
