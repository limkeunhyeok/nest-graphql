import { Field, InputType } from '@nestjs/graphql';
import { MongoId } from 'src/@types/datatype';
import { Role } from '../../../../constants/role.const';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  _id: MongoId;

  @Field(() => String)
  name: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  role: Role;
}
