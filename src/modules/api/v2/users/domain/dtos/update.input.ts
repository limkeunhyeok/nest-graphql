import { Field, InputType } from '@nestjs/graphql';
import { MongoId } from 'src/@types/datatype';
import { Role } from 'src/constants/role.const';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  _id: MongoId;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  role?: Role;
}
