import { Role } from '@common/core/constants/role.const';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignupInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  password: string;

  @Field(() => Role, { defaultValue: Role.MEMBER })
  role: Role;
}
